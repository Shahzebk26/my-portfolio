import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Set DATABASE_URL before running the migration.");
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("railway") || databaseUrl.includes("neon") ? { rejectUnauthorized: false } : undefined,
});

try {
  const schema = await readFile(path.join(root, "database", "schema.sql"), "utf8");
  await pool.query(schema);

  const [content, site, projects] = await Promise.all([
    readFile(path.join(root, "data", "content.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "data", "site.json"), "utf8").then(JSON.parse),
    readFile(path.join(root, "data", "projects.json"), "utf8").then(JSON.parse),
  ]);

  await pool.query(
    `INSERT INTO portfolio_documents (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW()), ($3, $4::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    ["content", JSON.stringify(content), "site", JSON.stringify(site)],
  );

  for (const project of projects) {
    await pool.query(
      `INSERT INTO portfolio_projects (id, slug, data, created_at, updated_at)
       VALUES ($1, $2, $3::jsonb, COALESCE($4::timestamptz, NOW()), NOW())
       ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, data = EXCLUDED.data, updated_at = NOW()`,
      [project.id, project.slug, JSON.stringify(project), project.createdAt || null],
    );
  }

  console.log(`Migrated ${projects.length} projects and site content to PostgreSQL.`);
} finally {
  await pool.end();
}
