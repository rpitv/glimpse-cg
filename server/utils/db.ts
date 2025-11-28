import Database from 'better-sqlite3';
import { mkdir } from 'node:fs/promises';
import { join } from 'path';
import { writeFile } from 'node:fs';

export const db = new Database('replicants.db');

function initHttpCacheTable() {
  db.prepare(`
      CREATE TABLE IF NOT EXISTS http_cache
      (
          url TEXT NOT NULL,
          next_refresh INTEGER,
          "sha256_og" TEXT (64),
          content_text TEXT,
          content_blob BLOB,
          CONSTRAINT http_cache_pk PRIMARY KEY (url)
      )
  `).run();

  // image cache dir
  mkdir(join(process.cwd(), 'public', 'cache', 'images'), { recursive: true })
    .then(() => {
      writeFile(join(process.cwd(), 'public', 'cache', '_README.txt'), `
          Warning: Files in cache subject to automatic deletion.
          It is safe to delete this directory if it gets too full.
          `, (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log('File written successfully!');
      });
    })
    .catch(console.error);
}

export function getValue<T = any>(key: string): T | null {
  const row = db.prepare('SELECT value FROM store WHERE key = ?').get(key);
  return row ? JSON.parse(row.value) : null;
}

export function setValue<T = any>(key: string, value: T) {
  db.prepare('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)').run(
    key,
    JSON.stringify(value),
  );
}

db.exec(`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

initHttpCacheTable();
