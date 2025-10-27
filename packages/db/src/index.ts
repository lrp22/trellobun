import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Import the aggregated schema from our new index file
import * as schema from "./schema";

// Create a connection pool. This is more efficient and robust than a single client.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Drizzle instance and pass it the connection pool AND the schema.
// This is the key step that makes Drizzle "schema-aware".
export const db = drizzle(pool, { schema });
