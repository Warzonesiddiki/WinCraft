/**
 * Configuration loader, environment validator, and secret redaction.
 */

export interface AppConfig {
  nodeEnv: string;
  isProduction: boolean;
  port: number;
  databaseUrl?: string;
  jwtSecret?: string;
  corsOrigins: string[];
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  licenseSigningPrivateKey?: string;
  resendApiKey?: string;
  smtpPass?: string;
}

const SENSITIVE_KEY_PATTERN = /(SECRET|KEY|PASSWORD|PASS|TOKEN|CREDENTIAL|PRIVATE|AUTH)/i;

/**
 * Returns a masked version of a sensitive value so it cannot be leaked into logs.
 */
export function redactSecret(value: unknown): string {
  if (typeof value !== "string" || !value) {
    return "[REDACTED]";
  }
  if (value.length <= 8) {
    return "********";
  }
  return `${value.slice(0, 3)}...${value.slice(-3)}`;
}

/**
 * Redacts sensitive fields from an environment or config dictionary for safe logging.
 */
export function redactConfig(
  env: Record<string, string | undefined>,
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      result[key] = undefined;
    } else if (SENSITIVE_KEY_PATTERN.test(key) || key === "DATABASE_URL") {
      result[key] = redactSecret(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Validates required configuration variables.
 * In production mode (NODE_ENV === "production"), throws an Error if required environment
 * variables are missing or insecure.
 */
export function validateProductionConfig(
  env: NodeJS.ProcessEnv = process.env,
): void {
  const isProduction = env.NODE_ENV === "production";
  if (!isProduction) {
    return;
  }

  // 1. JWT_SECRET check
  if (!env.JWT_SECRET) {
    throw new Error("Missing required production environment variable: JWT_SECRET");
  }
  if (env.JWT_SECRET.length < 32) {
    throw new Error(
      "Insecure JWT_SECRET in production: secret must be at least 32 characters long",
    );
  }

  // 2. DATABASE_URL check
  if (!env.DATABASE_URL) {
    throw new Error("Missing required production environment variable: DATABASE_URL");
  }

  // 3. Stripe consistency check
  if (env.STRIPE_SECRET_KEY && !env.STRIPE_WEBHOOK_SECRET) {
    throw new Error(
      "STRIPE_SECRET_KEY is configured in production, but STRIPE_WEBHOOK_SECRET is missing",
    );
  }
}

/**
 * Loads and validates configuration from environment.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  validateProductionConfig(env);

  return {
    nodeEnv: env.NODE_ENV || "development",
    isProduction: env.NODE_ENV === "production",
    port: Number(env.PORT) || 3000,
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
    corsOrigins: (env.CORS_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    stripeSecretKey: env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
    licenseSigningPrivateKey: env.LICENSE_SIGNING_PRIVATE_KEY,
    resendApiKey: env.RESEND_API_KEY,
    smtpPass: env.SMTP_PASS,
  };
}
