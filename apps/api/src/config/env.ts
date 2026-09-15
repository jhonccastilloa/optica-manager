// src/config/env.ts
import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";
import { z } from "zod";

if (existsSync(".env")) loadEnvFile(".env");

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url({ message: "DATABASE_URL debe ser una URL válida" }),
  HOST: z.string().default("localhost"),
  NODE_ENV: z
    .enum(["dev", "prod"], { error: 'NODE_ENV debe ser "dev" o "prod"' })
    .default("dev"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  parsed.error.issues.forEach((err) => {
    console.error(`- ${err.path.join(".")}: ${err.message}`);
  });
  process.exit(1);
}
export const ENV = parsed.data;
