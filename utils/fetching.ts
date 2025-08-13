import {db} from "~/utils/db";
import {createHash} from "node:crypto";

// =======================
//  Uses table http_cache
// =======================
interface http_cache {
    url: string
    next_refresh: number
    sha256_og: string
    content_text: string
    content_blob: Blob
}

function debug(msg: unknown, enabled: boolean = false) {
    if (enabled) {
        console.log(msg)
    }
}


/**
 * Fetches a URL first by checking the local cache before going out to fetch the page. This will not check for the page's
 * response/status code i.e. 200 vs 404 which can lead to undesirable results if the upstream server has issues or changed.
 *
 * @param normalizedURL Normalize the URL by removing unnecessary query strings and anchor parts for best performance.
 * @param fetchOptions  Normal `fetch()` options. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
 * @param parser        Either the string literal `"text"` or a custom lambda function can be provided.
 *          - `text` - saves the response as is with no post-processing
 *          - `custom lambda function` - can process the data as needed by the caller.
 *            Please ensure this function returns a Promise which resolves to a string.
 *            This option is preferable since it stores less in the db and prevents constant recalculations of the same data.
 * @param cacheTime     Number of seconds to keep this response validated for before needing to refetch it. Default is `60` seconds.
 * @param forceFetch    Force cache invalidation and fetch the url.
 */
export function fetchTextViaCache(normalizedURL: string,
                                  fetchOptions: RequestInit,
                                  parser: "text" | ((res: Response) => Promise<string>),
                                  cacheTime: number = 60,
                                  forceFetch: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
        if (parser === undefined || parser === null) {
            throw new Error("Invalid parameter 'parser' it's undefined or null.");
        }

        // checks for db cache
        debug(`======= fetchCache(${normalizedURL}) ======= ${new Date()}`);
        const dbResponse = db.prepare(`SELECT *
                                       FROM http_cache
                                       WHERE url = ?`).get(normalizedURL) as http_cache | undefined;
        debug("db response:");
        debug(dbResponse);

        // is cached value still valid?
        if (dbResponse?.next_refresh !== undefined && Math.floor(Date.now() / 1000) < dbResponse.next_refresh && !forceFetch) {
            debug(`✅✅✅ resolving content from cache`)
            return resolve(dbResponse.content_text);
        }

        // a new fetch needs to be sent out
        debug(`🔥🔥🔥 cache is invalid or DNE`)
        let sha256hash = '';
        let disableThenChain = false;
        fetch(normalizedURL, fetchOptions)
            .then(async data => {
                // calc sha256 for changes, if no changes then return existing storage and update cache
                const buffer = Buffer.from(await data.clone().arrayBuffer());
                sha256hash = createHash("sha256").update(buffer).digest("hex");
                if (dbResponse?.sha256_og === sha256hash && !forceFetch) {
                    db.prepare(`
                        INSERT INTO http_cache (url, next_refresh)
                        VALUES (?, ?)
                        ON CONFLICT(url) DO UPDATE SET next_refresh = excluded.next_refresh
                    `).run(normalizedURL, Math.floor(Date.now() / 1000) + cacheTime);
                    debug("⚡⚡⚡ short circuit with same sha256 hash")
                    resolve(dbResponse.content_text);
                    disableThenChain = true;
                }

                if (parser === "text") {
                    return data.text();
                }

                debug("💥💥💥 using custom parser")
                return parser(data)
                    .then(parsedData => {
                        debug("🆗🆗🆗 custom parsedData");
                        debug(parsedData);
                        return parsedData;
                    })
            })
            .then(data => {
                if (disableThenChain) {
                    return;
                }

                if (data === undefined || data === null) {
                    console.warn(`fetching.ts#fetchTextViaCache(${normalizedURL},
                        ${JSON.stringify(fetchOptions)}, ${parser}) resulted in an undefined or null response`);
                    data = ''
                }

                db.prepare(`
                    INSERT INTO http_cache (url, next_refresh, sha256_og, content_text)
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(url) DO UPDATE SET next_refresh = excluded.next_refresh,
                                                   sha256_og    = excluded.sha256_og,
                                                   content_text = excluded.content_text
                `).run(normalizedURL, Math.floor(Date.now() / 1000) + cacheTime, sha256hash, data);
                debug("🎄🎄🎄 new data is saved as text")
                resolve(data);
            })
            .catch(reject)
    })
}

