import { defineEventHandler, getQuery } from 'h3';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { existsSync } from 'node:fs';
import { db } from '~/server/utils/db';
import type { http_cache } from '~/utils/fetching';
import { basename } from 'pathe';

/**
 * API endpoint for caching an image locally.
 * Use by referring to the route: `/api/img?src=__IMG_URL__` due to src accepting both
 * `encodeURIComponent()` strings and regular URLs it's recommended to set this query last.
 *
 * All available query string parameters:
 * - `src`:   URL location of the image, if no file extension is present it will be saved as `.bin`
 * - `force`: (true or false, defaults false) Used to force remote fetching and bypass the cache.
 *            If successful, results will save to the disk.
 * - `cache`: (default is 30 days) number of seconds to keep the validated image for before refetching
 *
 * <strong>Warning: URLs are not sanitized or normalized.</strong>
 *
 * Examples:
 * - /api/img?src=https://wikipedia.org/favicon.ico
 * - /api/img?force=true&src=https://wikipedia.org/favicon.ico
 * - /api/img?force=1&cache=30&src=https%3A%2F%2Fwikipedia.org%2Ffavicon.ico
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const src = query.src as string || null;
  if (!src) {
    event.node.res.statusCode = 400;
    return { error: 'Missing \'src\' query parameter' };
  }
  const url = decodeURIComponent(src);
  const ext = '.' + url.split('.').pop()?.split(/[#?]/)[0] || 'bin';

  const qForceFetch = query.force || false;
  const forceFetch = qForceFetch && ('true' === qForceFetch || '1' === qForceFetch);

  let cacheTime = Number(query.cache);
  if (Number.isNaN(cacheTime)) {
    cacheTime = 30 * 24 * 60 * 60;
  }

  const cacheDir = join(process.cwd(), 'public', 'cache', 'images');

  try {
    // checks for db for existing cache
    const dbResExistsCheck = db.prepare(`SELECT *
                                             FROM http_cache
                                             WHERE url = ?`).get(url) as http_cache | undefined;

    // is cached value still valid?
    if (!forceFetch
      && dbResExistsCheck?.next_refresh !== undefined
      && Math.floor(Date.now() / 1000) < dbResExistsCheck.next_refresh
      && existsSync(dbResExistsCheck?.content_text)) {
      return sendRedirect(event, `/cache/images/${basename(dbResExistsCheck.content_text)}`);
    }

    // fetches remote image to cache
    const res = await fetch(url);
    if (!res.ok) {
      event.node.res.statusCode = res.status;
      return { error: `Failed to fetch image [${res.statusText}] ${url}` };
    }

    // calc img hash
    const responseBuffer = Buffer.from(await res.clone().arrayBuffer());
    const responseHash = createHash('sha256').update(responseBuffer).digest('hex');

    // search for existing file which has hash and reuse the location or set a new one
    const dbResDupeHash = db.prepare(`SELECT *
                                          FROM http_cache
                                          WHERE sha256_og = ?`).get(responseHash) as http_cache | undefined;
    let hashedImgLocation = dbResDupeHash?.content_text;
    if (!hashedImgLocation) {
      hashedImgLocation = join(cacheDir, responseHash + ext);
    }

    db.prepare(`
            INSERT INTO http_cache (url, next_refresh, sha256_og, content_text)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(url) DO UPDATE SET next_refresh = excluded.next_refresh,
                                           sha256_og = excluded.sha256_og,
                                           content_text = excluded.content_text 
        `).run(url, Math.floor(Date.now() / 1000) + cacheTime, responseHash, hashedImgLocation);

    // saves locally
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    writeFileSync(hashedImgLocation, buffer);

    return sendRedirect(event, `/cache/images/${responseHash + ext}`);
  }
  catch (err: any) {
    event.node.res.statusCode = 500;
    return { error: err.message || 'Server error' };
  }
});
