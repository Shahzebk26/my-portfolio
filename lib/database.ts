import { Pool, type QueryResultRow } from "pg";

const databaseUrl = process.env.DATABASE_URL;
export const databaseEnabled = Boolean(databaseUrl);

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("railway") || databaseUrl.includes("neon") ? { rejectUnauthorized: false } : undefined,
      max: 5,
    })
  : null;

let schemaPromise: Promise<void> | null = null;

export async function ensureDatabase() {
  if (!pool) return;
  schemaPromise ??= pool
    .query(`
      CREATE TABLE IF NOT EXISTS portfolio_documents (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS portfolio_projects_created_at_idx
        ON portfolio_projects (created_at DESC);
    `)
    .then(() => undefined);
  await schemaPromise;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  if (!pool) throw new Error("DATABASE_URL is not configured.");
  await ensureDatabase();
  return pool.query<T>(text, values);
}
