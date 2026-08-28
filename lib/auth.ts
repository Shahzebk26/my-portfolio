const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PortfolioAdmin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "portfolio-admin-token";

export function validateAdminPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

export function createAdminToken() {
  return ADMIN_TOKEN;
}

export function verifyAdminToken(token: string) {
  return token === ADMIN_TOKEN;
}
