# Shahzeb Portfolio

## Local development

Install dependencies and start Next.js:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and set your own values. Without `DATABASE_URL`, local development uses JSON files in `data/`.

## Deploy on Vercel

This app needs a server runtime; do not enable Static Exports.

1. Push the repository to GitHub and import it in Vercel. Keep the repository root as the project root and use the default Next.js settings. The build command is `npm run build`.
2. Create a PostgreSQL database reachable from Vercel. Add its external/TLS connection string as `DATABASE_URL` in Vercel Project Settings → Environment Variables. Provider-internal hostnames (such as `*.railway.internal`) cannot be reached from Vercel.
3. Set `ADMIN_PASSWORD` and `ADMIN_TOKEN` as server-only variables. Choose unique, strong values; generate a token with a password manager or `openssl rand -hex 32`. Never prefix secrets with `NEXT_PUBLIC_`.
4. For admin image uploads, add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Uploads are disabled in production when these variables are missing because serverless local disk is ephemeral.
5. Add the variables to the environments where you need them (Production, Preview, and Development), then deploy. PostgreSQL tables are created automatically on first use. To import the checked-in JSON content into the database, run `npm run db:migrate-json` locally with `DATABASE_URL` set to the same database.

`.env.example` lists variable names with safe placeholders. Never commit real credentials. Any credentials previously placed in a committed env file should be rotated with their providers.
