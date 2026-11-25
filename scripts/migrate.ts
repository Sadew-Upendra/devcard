import { readFileSync } from "node:fs";
import path from "node:path";
import { getPool } from "../src/lib/db";

async function main() {
  const pool = getPool();
  if (!pool) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const sql = readFileSync(path.join(process.cwd(), "db/schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Schema applied.");
  await pool.end();
}

main();