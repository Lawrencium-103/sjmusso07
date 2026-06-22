import { neon, Pool } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;
let _pool: Pool | null = null;

function getSql() {
  if (!_sql) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    _sql = neon(DATABASE_URL);
  }
  return _sql;
}

function getPool() {
  if (!_pool) {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    _pool = new Pool({ connectionString: DATABASE_URL });
  }
  return _pool;
}

interface DbResult {
  rows: any[];
  rowCount: number;
}

interface RunResult {
  changes: number;
  lastInsertRowid: number | null;
}

async function query(text: string, params?: any[]): Promise<DbResult> {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return { rows: result.rows, rowCount: result.rowCount ?? 0 };
  } finally {
    client.release();
  }
}

export function getDb() {
  return {
    all: async (text: string, params?: any[]): Promise<any[]> => {
      const result = await query(text, params);
      return result.rows;
    },
    get: async (text: string, params?: any[]): Promise<any | null> => {
      const result = await query(text, params);
      return result.rows[0] || null;
    },
    run: async (text: string, params?: any[]): Promise<RunResult> => {
      if (text.trim().toUpperCase().startsWith("INSERT")) {
        const result = await query(
          text.includes("RETURNING") ? text : `${text} RETURNING id`,
          params
        );
        return {
          changes: result.rowCount,
          lastInsertRowid: result.rows[0]?.id ?? null,
        };
      }
      const result = await query(text, params);
      return { changes: result.rowCount, lastInsertRowid: null };
    },
    transaction: async <T>(fn: () => Promise<T>): Promise<T> => {
      const pool = getPool();
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await fn();
        await client.query("COMMIT");
        return result;
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    },
  };
}

export async function migrate() {
  const d = getDb();
  const tables = (await d.all(
    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
  )).map((r: any) => r.tablename);

  if (!tables.includes("alumni")) {
    await d.run(`
      CREATE TABLE alumni (
        id SERIAL PRIMARY KEY,
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
        created_at TIMESTAMP DEFAULT NOW(),
        password_hash TEXT,
        must_change_password INTEGER DEFAULT 1,
        security_question TEXT,
        security_answer TEXT
      )
    `);
  }

  if (!tables.includes("sessions")) {
    await d.run(`
      CREATE TABLE sessions (
        id SERIAL PRIMARY KEY,
        alumni_id INTEGER NOT NULL REFERENCES alumni(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL
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
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT
      )
    `);
  }

  if (!tables.includes("aspirants")) {
    await d.run(`
      CREATE TABLE aspirants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        position_id INTEGER REFERENCES positions(id),
        cleared INTEGER DEFAULT 0
      )
    `);
  }

  if (!tables.includes("votes")) {
    await d.run(`
      CREATE TABLE votes (
        id SERIAL PRIMARY KEY,
        alumni_id INTEGER NOT NULL REFERENCES alumni(id),
        aspirant_id INTEGER NOT NULL REFERENCES aspirants(id),
        position_id INTEGER NOT NULL REFERENCES positions(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  if (!tables.includes("news_updates")) {
    await d.run(`
      CREATE TABLE news_updates (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_by INTEGER REFERENCES alumni(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  if (!tables.includes("meetings")) {
    await d.run(`
      CREATE TABLE meetings (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        meeting_date TIMESTAMP NOT NULL,
        created_by INTEGER REFERENCES alumni(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  if (!tables.includes("attendance")) {
    await d.run(`
      CREATE TABLE attendance (
        id SERIAL PRIMARY KEY,
        meeting_id INTEGER NOT NULL REFERENCES meetings(id),
        alumni_id INTEGER NOT NULL REFERENCES alumni(id),
        attended INTEGER DEFAULT 0
      )
    `);
  }

  if (!tables.includes("payments")) {
    await d.run(`
      CREATE TABLE payments (
        id SERIAL PRIMARY KEY,
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
