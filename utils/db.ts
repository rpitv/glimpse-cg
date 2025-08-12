import Database from 'better-sqlite3';

export const db = new Database('./replicants.db');
// Create the replicants table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS replicants (
    name TEXT PRIMARY KEY,
    value TEXT
  )
`).run();



export function saveReplicant(name: string, value: unknown) {
  db.prepare(`
    INSERT INTO replicants (name, value)
    VALUES (?, ?)
    ON CONFLICT(name) DO UPDATE SET value = excluded.value
  `).run(name, JSON.stringify(value));
}


export function loadReplicant<T>(name: string): T | null {
  const row = db.prepare(`SELECT value FROM replicants WHERE name = ?`).get(name) as { value?: string } | undefined;
  return row && row.value !== undefined ? JSON.parse(row.value) as T : null;
}