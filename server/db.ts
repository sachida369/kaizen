import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Fix corrupted DATABASE_URL (handle HTML entities and psql command prefix)
let dbUrl = process.env.DATABASE_URL;
if (dbUrl.includes("psql")) {
  // Extract URL from malformed psql command
  const urlMatch = dbUrl.match(/postgresql:\/\/[^'"\s]+/);
  if (urlMatch) {
    dbUrl = urlMatch[0];
  }
}
// Replace HTML entities
dbUrl = dbUrl.replace(/&amp;/g, '&');

export const pool = new Pool({ connectionString: dbUrl });
export const db = drizzle({ client: pool, schema });
