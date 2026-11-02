# Shahzeb Portfolio

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Copy `.env.example` to `.env.local`. Without `DATABASE_URL`, local development uses JSON files in `data/`.

## Deploy and connect PostgreSQL on Vercel

The project uses PostgreSQL through the `pg` package and reads the connection string from `DATABASE_URL`. Vercel does not provision a new built-in Postgres database; add a Marketplace provider such as Neon, Supabase, or AWS Aurora Postgres. The provider integration can add its connection variables to your Vercel project automatically.

1. In the Vercel dashboard, open **Storage/Marketplace**, select **Neon Postgres** (or another PostgreSQL provider), provision a database, and connect it to the `my-portfolio-ag92` project. Use the pooled/runtime connection URL if the provider supplies one.
2. In **Project → Settings → Environment Variables**, confirm a server-only `DATABASE_URL` exists for **Production**. It must be the real external PostgreSQL URL supplied by the provider, not the placeholder, and not a private host such as `*.railway.internal`. Do not expose it with a `NEXT_PUBLIC_` prefix.
3. Add `ADMIN_PASSWORD` and `ADMIN_TOKEN` as server-only Production variables. Use unique strong values. The app refuses admin authentication in production if either value is missing.
4. For admin image uploads, add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Vercel function disk is temporary, so Cloudinary is required for persistent uploads.
5. Redeploy after connecting the database or changing variables. Verify `https://YOUR_DEPLOYMENT/api/health` returns `{"ok":true,"database":"connected"}`. A 503 means the variable is missing/invalid, the host is unreachable, TLS/authentication failed, or the database role cannot create the app tables. The check does not expose credentials.
6. On first database use the app creates its tables. To load the repository's JSON content and projects, run `npm run db:migrate-json` from your computer with `DATABASE_URL` temporarily set to that same database URL. Do not run this against a production database unless you intend to import/overwrite the seeded content. Then redeploy or reload the site.

Vercel environment variable changes only apply to new deployments. Configure Preview separately if you want working preview deployments, then redeploy. The project is a server-rendered Next.js app; do not use Static Export.

The checked-in `.env.example` contains variable names only. Never commit real database, Cloudinary, or admin credentials. Rotate any secrets previously committed.
