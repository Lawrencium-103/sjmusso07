import { Pool } from "@neondatabase/serverless";
import { createClient } from "@libsql/client";

const NEON_URL = process.env.DATABASE_URL;
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!NEON_URL || !TURSO_URL || !TURSO_TOKEN) {
  console.error("Missing env vars. Set DATABASE_URL, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN");
  process.exit(1);
}

const neonPool = new Pool({ connectionString: NEON_URL });
const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

const SCHEMA_SQL = `
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS news_updates;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS aspirants;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS alumni;

CREATE TABLE alumni (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender TEXT,
  location TEXT,
  dob TEXT,
  occupation TEXT,
  email TEXT NOT NULL UNIQUE,
  profile_name_whatsapp TEXT,
  facebook_handle TEXT,
  x_handle TEXT,
  linkedin TEXT,
  snapchat TEXT,
  telegram TEXT,
  tiktok TEXT,
  instagram TEXT,
  phone_no TEXT,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT (datetime('now')),
  password_hash TEXT,
  must_change_password INTEGER DEFAULT 1,
  security_question TEXT,
  security_answer TEXT,
  profile_picture TEXT,
  is_seeded INTEGER DEFAULT 0
);

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumni_id INTEGER NOT NULL REFERENCES alumni(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE aspirants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position_id INTEGER REFERENCES positions(id),
  cleared INTEGER DEFAULT 0
);

CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumni_id INTEGER NOT NULL REFERENCES alumni(id),
  aspirant_id INTEGER NOT NULL REFERENCES aspirants(id),
  position_id INTEGER NOT NULL REFERENCES positions(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE news_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by INTEGER REFERENCES alumni(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE meetings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TEXT NOT NULL,
  created_by INTEGER REFERENCES alumni(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meeting_id INTEGER NOT NULL REFERENCES meetings(id),
  alumni_id INTEGER NOT NULL REFERENCES alumni(id),
  attended INTEGER DEFAULT 0
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumni_id INTEGER REFERENCES alumni(id),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  paid INTEGER DEFAULT 0,
  confirmed INTEGER DEFAULT 0,
  confirmed_by INTEGER REFERENCES alumni(id)
);
`;

async function tableExists(turso, name) {
  const r = await turso.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`);
  return r.rows.length > 0;
}

async function migrate() {
  console.log("Creating Turso tables...");
  for (const stmt of SCHEMA_SQL.split(";").map(s => s.trim()).filter(Boolean)) {
    await turso.execute(stmt);
  }

  const tables = [
    "alumni", "sessions", "settings", "positions", "aspirants",
    "votes", "news_updates", "meetings", "attendance", "payments"
  ];

  for (const table of tables) {
    console.log(`Migrating ${table}...`);
    const client = await neonPool.connect();
    let rows;
    try {
      const result = await client.query(`SELECT * FROM "${table}"`);
      rows = result.rows;
    } finally {
      client.release();
    }
    if (!rows || rows.length === 0) {
      console.log(`  -> 0 rows, skipped`);
      continue;
    }

    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => "?").join(", ");
    const insertSql = `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders})`;

    for (const row of rows) {
      const values = cols.map(c => {
        const v = row[c];
        return v instanceof Date ? v.toISOString() : v;
      });
      try {
        await turso.execute({ sql: insertSql, args: values });
      } catch (err) {
        console.error(`  Error inserting into ${table}:`, err.message);
        console.error(`  Row:`, JSON.stringify(row));
      }
    }
    console.log(`  -> ${rows.length} rows migrated`);
  }

  await neonPool.end();
  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
