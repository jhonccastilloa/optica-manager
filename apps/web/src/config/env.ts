import { z } from "zod"

const envSchema = z.object({
  VITE_API_URL: z.string().trim().url(),
})

const parsedEnv = envSchema.safeParse({
  VITE_API_URL:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "http://localhost:3000" : undefined),
})

if (!parsedEnv.success) {
  throw new Error(
    `Variables de entorno inválidas: ${parsedEnv.error.issues
      .map((issue) => issue.path.join(".") + " - " + issue.message)
      .join(", ")}`,
  )
}

const apiUrl = parsedEnv.data.VITE_API_URL.replace(/\/$/, "")

const ENV = {
  API_URL: apiUrl,
  API_BASE_URL: `${apiUrl}/api`,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}

export default ENV
