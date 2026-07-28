import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // CLI/migrations use the direct/session connection (port 5432).
    // App runtime uses DATABASE_URL via the PrismaPg adapter in index.ts.
    url: process.env["DIRECT_URL"],
  },
});
