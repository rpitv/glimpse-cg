import Database from "better-sqlite3"

const db = new Database("replicants.db")

db.exec(`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`)

export function getValue<T = any>(key: string): T | null {
  const row = db.prepare("SELECT value FROM store WHERE key = ?").get(key)
  return row ? JSON.parse(row.value) : null
}

export function setValue<T = any>(key: string, value: T) {
  db.prepare("INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)").run(
    key,
    JSON.stringify(value)
  )
}