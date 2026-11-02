const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function assertAdminCredentialsConfigured() {
  if (process.env.NODE_ENV === "production" && (!ADMIN_PASSWORD || !ADMIN_TOKEN)) {
    throw new Error("ADMIN_PASSWORD and ADMIN_TOKEN are required in production.");
  }
}

export function validateAdminPassword(password: string) {
  assertAdminCredentialsConfigured();
  return Boolean(ADMIN_PASSWORD) && password === ADMIN_PASSWORD;
}

export function createAdminToken() {
  assertAdminCredentialsConfigured();
  return ADMIN_TOKEN || "";
}

export function verifyAdminToken(token: string) {
  assertAdminCredentialsConfigured();
  return Boolean(ADMIN_TOKEN) && token === ADMIN_TOKEN;
}
