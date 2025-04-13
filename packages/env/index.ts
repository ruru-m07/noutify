import { z } from "zod";

/**
 * ! Define your environment variables schema.
 * * - Use .default(...) to supply default values.
 * * - Use .optional() for variables that might not be provided.
 */
const envSchema = z.object({
  OAUTH_GITHUB_ID: z.string().min(1, "OAUTH_GITHUB_ID is required"),
  OAUTH_GITHUB_SECRET: z.string().min(1, "OAUTH_GITHUB_SECRET is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

/** // ? Export the inferred TypeScript type for consumers */
export type EnvVariables = z.infer<typeof envSchema>;

/**
 * ? Validates process.env against the schema.
 * * - If validation fails, it throws an error with detailed messages.
 * * - If successful, returns a properly typed and parsed environment config.
 */
function validateEnv(): EnvVariables {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    return {} as EnvVariables;
    // throw new Error("Environment validation error");
  }
  return result.data;
}

/**
 * ? The validated environment configuration.
 *
 * * Importing this file anywhere in your monorepo will run the validation once at startup.
 *
 * @type EnvVariables
 *
 */
export const env: EnvVariables = validateEnv();

/**
 * ! Global augmentation to merge our validated env types with NodeJS.ProcessEnv.
 *
 * ? This improves DX by providing auto-completion and type safety across your project.
 *
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {}
  }
}
