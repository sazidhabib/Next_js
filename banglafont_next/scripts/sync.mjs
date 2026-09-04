import "dotenv/config";
import { ensureDatabaseReady } from "../lib/initDb.mjs";

async function run() {
  const result = await ensureDatabaseReady({ verbose: true, autoSeedIfEmpty: true });
  if (!result.success) {
    console.error("Database initialization failed.");
    process.exit(1);
  }
  process.exit(0);
}

run();
