type EnvVarName = "DEBUG" | "UP_STREAM" | "FORCE_PORT" | "AUTH_SECRET";

type EnvConfig = {
  [K in EnvVarName as `NOUTIFY_${K}`]: string | null;
};

function getEnvVar(
  name: EnvVarName,
  defaultValue: string | null
): string | null {
  const fullName = `NOUTIFY_${name}`;
  return process.env[fullName] ?? defaultValue;
}

export const env: EnvConfig = {
  NOUTIFY_DEBUG: getEnvVar("DEBUG", "false"),
  NOUTIFY_UP_STREAM: getEnvVar("UP_STREAM", "https://noutify.vercel.app"),
  NOUTIFY_FORCE_PORT: getEnvVar("FORCE_PORT", null),
  NOUTIFY_AUTH_SECRET: getEnvVar(
    "AUTH_SECRET",
    "I58r485cKM9O1Da1v8CqDTDj9Mn7mwzurNowiFvKK47OCnn4m9jKKNHgbFo="
  ),
};

export const {
  NOUTIFY_DEBUG,
  NOUTIFY_UP_STREAM,
  NOUTIFY_FORCE_PORT,
  NOUTIFY_AUTH_SECRET,
} = env;
