import Database from 'better-sqlite3';

export const db = new Database('./replicants.db');
// Create the replicants table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS replicants (
    channel TEXT,
    name TEXT,
    value TEXT,
    PRIMARY KEY (channel, name)
  )
`).run();


export function saveReplicant(channel: string, name: string, value: unknown) {
  db.prepare(`
    INSERT INTO replicants (channel, name, value)
    VALUES (?, ?, ?)
    ON CONFLICT(channel, name) DO UPDATE SET value = excluded.value
  `).run(channel, name, JSON.stringify(value));
}


export function loadReplicant<T>(channel: string, name: string): T | null {
  const row = db.prepare(`SELECT value FROM replicants WHERE channel = ? AND name = ?`).get(channel, name);
  return row ? JSON.parse(row.value) as T : null;
}