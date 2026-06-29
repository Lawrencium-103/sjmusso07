import { createClient } from "@libsql/client";

let _db: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!_db) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url) throw new Error("TURSO_DATABASE_URL environment variable is required");
    _db = createClient({ url, authToken });
  }
  return _db;
}

function convertSql(sql: string, params?: any[]): { sql: string; args: any[] } {
  if (!params || params.length === 0) return { sql, args: [] };
  const indices: number[] = [];
  const converted = sql.replace(/\$(\d+)/g, (_, num) => {
    indices.push(parseInt(num));
    return "?";
  });
  return { sql: converted, args: indices.map(i => params[i - 1]) };
}

export function getDb() {
  const client = getClient();
  return {
    all: async (text: string, params?: any[]): Promise<any[]> => {
      const { sql, args } = convertSql(text, params);
      const result = await client.execute({ sql, args });
      return result.rows;
    },
    get: async (text: string, params?: any[]): Promise<any | null> => {
      const { sql, args } = convertSql(text, params);
      const result = await client.execute({ sql, args });
      return result.rows[0] || null;
    },
    run: async (text: string, params?: any[]): Promise<{ changes: number; lastInsertRowid: number | null }> => {
      const { sql, args } = convertSql(text, params);
      const result = await client.execute({ sql, args });
      return {
        changes: result.rowsAffected ?? 0,
        lastInsertRowid: result.lastInsertRowid != null ? Number(result.lastInsertRowid) : null,
      };
    },
    transaction: async <T>(fn: () => Promise<T>): Promise<T> => {
      await client.execute("BEGIN");
      try {
        const result = await fn();
        await client.execute("COMMIT");
        return result;
      } catch (e) {
        await client.execute("ROLLBACK");
        throw e;
      }
    },
  };
}

export async function migrate() {
  const d = getDb();
  const tables = (await d.all("SELECT name FROM sqlite_master WHERE type='table'"))
    .map((r: any) => r.name);

  if (!tables.includes("alumni")) {
    await d.run(`
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
      )
    `);
  } else {
    const cols = await d.all("PRAGMA table_info(alumni)") as any[];
    const colNames = cols.map((c: any) => c.name);
    if (!colNames.includes("profile_picture")) {
      await d.run("ALTER TABLE alumni ADD COLUMN profile_picture TEXT");
    }
    if (!colNames.includes("is_seeded")) {
      await d.run("ALTER TABLE alumni ADD COLUMN is_seeded INTEGER DEFAULT 0");
    }
  }

  if (!tables.includes("sessions")) {
    await d.run(`
      CREATE TABLE sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alumni_id INTEGER NOT NULL REFERENCES alumni(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL
      )
    `);
  }

  if (!tables.includes("settings")) {
    await d.run(`
      CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
    await d.run("INSERT INTO settings (key, value) VALUES ('results_published', '0')");
  }

  if (!tables.includes("positions")) {
    await d.run(`
      CREATE TABLE positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
      )
    `);
  }

  if (!tables.includes("aspirants")) {
    await d.run(`
      CREATE TABLE aspirants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position_id INTEGER REFERENCES positions(id),
        cleared INTEGER DEFAULT 0
      )
    `);
  }

  if (!tables.includes("votes")) {
    await d.run(`
      CREATE TABLE votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alumni_id INTEGER NOT NULL REFERENCES alumni(id),
        aspirant_id INTEGER NOT NULL REFERENCES aspirants(id),
        position_id INTEGER NOT NULL REFERENCES positions(id),
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  if (!tables.includes("news_updates")) {
    await d.run(`
      CREATE TABLE news_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_by INTEGER REFERENCES alumni(id),
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  if (!tables.includes("meetings")) {
    await d.run(`
      CREATE TABLE meetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        meeting_date TEXT NOT NULL,
        created_by INTEGER REFERENCES alumni(id),
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  if (!tables.includes("attendance")) {
    await d.run(`
      CREATE TABLE attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meeting_id INTEGER NOT NULL REFERENCES meetings(id),
        alumni_id INTEGER NOT NULL REFERENCES alumni(id),
        attended INTEGER DEFAULT 0
      )
    `);
  }

  if (!tables.includes("payments")) {
    await d.run(`
      CREATE TABLE payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alumni_id INTEGER REFERENCES alumni(id),
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        paid INTEGER DEFAULT 0,
        confirmed INTEGER DEFAULT 0,
        confirmed_by INTEGER REFERENCES alumni(id)
      )
    `);
  }
}
