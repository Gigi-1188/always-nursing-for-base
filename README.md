# Always Nursing — Native Base44 App

Start with START-HERE.md. This source conversion targets native Base44 hosting: Vite React, Base44 Auth, persistent StaffingHub actor records and private Base44 files. No external Cloudflare or Supabase deployment is required by this converted source.

Local checks pass. This archive has not been deployed to or accepted on a real Base44 app. Existing live data is not included or automatically migrated. Read ARCHITECTURE.md for storage design, limits and unverified checks; read MIGRATION.md before transferring records.

Use npm ci, npm run typecheck, npm test, npm run check:actor. Publish using npx base44 deploy --build after linking to your own staging app.
