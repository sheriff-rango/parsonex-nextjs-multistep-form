import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle(pool, { schema });

async function seed() {
  try {
    // Add a sample account linked to the client
    const [account] = await db
      .insert(schema.psiAccounts)
      .values({
        accountType: "Individual",
        emailAuth: true,
        status: "Active",
        invObjective: "Growth",
        riskTolerance: "Moderate",
        timeHorizon: "5-10 Years",
        pcm: "TEST",
        branch: "001",
        registration1: "Individual",
        clientResState: "CA",
        accountEmail: "test@example.com",
        clientIdPrimary: null,
      })
      .returning();

    console.log("✅ Created account:", account);

    console.log("✅ Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
