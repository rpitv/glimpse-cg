import {
    defaultChannels,
    defaultConfiguration,
    defaultExternal,
    defaultFullscreen,
    defaultLowerThird,
    defaultScoreboard
} from '~/types/replicants';
import Database from 'better-sqlite3';
import {createReplicants} from "~/utils/replicants";
import {fetchTextViaCache} from "~/utils/fetching";

export const db = new Database('./replicants.db');

// Helper: deep merge defaults into obj, remove keys not in defaults
function migrateObject(obj: any, defaults: any): any {
    if (typeof defaults !== 'object' || defaults === null) return obj;
    if (typeof obj !== 'object' || obj === null) obj = Array.isArray(defaults) ? [] : {};
    // Add or update fields from defaults
    for (const key of Object.keys(defaults)) {
        if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
            obj[key] = migrateObject(obj[key], defaults[key]);
        } else if (Array.isArray(defaults[key])) {
            obj[key] = Array.isArray(obj[key]) ? obj[key] : [];
        } else if (!(key in obj)) {
            obj[key] = defaults[key];
        }
    }
    // Remove fields not in defaults
    for (const key of Object.keys(obj)) {
        if (!(key in defaults)) {
            delete obj[key];
        }
    }
    return obj;
}

// Map replicant name to default value
const defaultMap: Record<string, any> = {
    lowerThird: defaultLowerThird,
    configuration: defaultConfiguration,
    scoreboard: defaultScoreboard,
    fullscreen: defaultFullscreen,
    external: defaultExternal,
    channels: defaultChannels,
};

function migrateReplicantsSchema() {
    const rows = db.prepare('SELECT name, value FROM replicants').all() as { name: string, value: string }[];
    for (const {name, value} of rows) {
        if (!(name in defaultMap)) continue;
        let parsed;
        try {
            parsed = JSON.parse(value);
        } catch {
            continue;
        }
        const migrated = migrateObject(parsed, defaultMap[name]);
        saveReplicant(name, migrated);
    }
}


/**
 * Inits the db, and performs any migrations.
 */
export function initDb() {
    // Create the replicants table if it doesn't exist
    db.prepare(`
        CREATE TABLE IF NOT EXISTS replicants
        (
            name TEXT PRIMARY KEY,
            value TEXT
        )
    `).run();

    // creates http_cache table for ~/utils/fetching.ts
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

    createReplicants();
    migrateReplicantsSchema();
}


export function saveReplicant(name: string, value: unknown) {
    db.prepare(`
        INSERT INTO replicants (name, value)
        VALUES (?, ?) ON CONFLICT(name) DO
        UPDATE SET value = excluded.value
    `).run(name, JSON.stringify(value));
}


export function loadReplicant<T>(name: string): T | null {
    const row = db.prepare(`SELECT value
                            FROM replicants
                            WHERE name = ?`).get(name) as { value?: string } | undefined;
    return row && row.value !== undefined ? JSON.parse(row.value) as T : null;
}
