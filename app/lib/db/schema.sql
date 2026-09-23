-- Full schema at app/lib/db/schema.sql — see repo
CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, level INTEGER NOT NULL DEFAULT 0, description TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, password_hash TEXT, google_id TEXT UNIQUE, name TEXT NOT NULL, avatar_url TEXT, role_id INTEGER NOT NULL DEFAULT 5 REFERENCES roles(id), status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')));
-- ... (full schema in the actual file)
