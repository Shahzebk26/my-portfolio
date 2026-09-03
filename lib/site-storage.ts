import fs from "fs/promises";
import path from "path";
import { assertDatabaseConfigured, databaseEnabled, dbQuery } from "./database";

export type SiteConfig = { profileImage: string };

const fallbackConfig: SiteConfig = { profileImage: "/profile-illustration.svg" };
const configFilePath = path.join(process.cwd(), "data", "site.json");

async function readFileConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(configFilePath, "utf8");
    return { ...fallbackConfig, ...(JSON.parse(raw) as Partial<SiteConfig>) };
  } catch {
    return fallbackConfig;
  }
}

export async function readSiteConfig(): Promise<SiteConfig> {
  assertDatabaseConfigured();
  if (databaseEnabled) {
    try {
      const result = await dbQuery<{ value: SiteConfig }>("SELECT value FROM portfolio_documents WHERE key = $1", ["site"]);
      if (result.rows[0]?.value) return { ...fallbackConfig, ...result.rows[0].value };

      await dbQuery(
        "INSERT INTO portfolio_documents (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO NOTHING",
        ["site", JSON.stringify(fallbackConfig)],
      );
      return fallbackConfig;
    } catch (error) {
      throw new Error("Unable to read site settings from PostgreSQL.", { cause: error });
    }
  }
  return readFileConfig();
}

export async function updateSiteConfig(config: SiteConfig) {
  assertDatabaseConfigured();
  if (databaseEnabled) {
    await dbQuery(
      `INSERT INTO portfolio_documents (key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      ["site", JSON.stringify(config)],
    );
    return config;
  }

  await fs.mkdir(path.dirname(configFilePath), { recursive: true });
  await fs.writeFile(configFilePath, JSON.stringify(config, null, 2), "utf8");
  return config;
}
