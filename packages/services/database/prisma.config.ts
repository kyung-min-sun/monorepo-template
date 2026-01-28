import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/project-template",
  },
});
