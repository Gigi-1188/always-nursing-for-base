# Always Nursing — Native Base44 Hosting Conversion

This package replaces the previous Cloudflare/Supabase architecture with a Vite React frontend, Base44 email/password accounts, a Base44 StaffingHub actor for persistent staffing records, and Base44 private file storage. It is for Base44 hosting, not just Base Code editing.

The source conversion and local checks are complete. No Base44 account is linked in this download. Hosted deployment, actual verification/recovery emails, actor runtime compatibility, real private uploads, phone acceptance and load testing remain unverified. Existing live records and documents have NOT been copied into this package.

## Deploy A Separate Staging App First

Install Node.js 22.13 or newer. This package was checked with Node.js 24.19. Extract the ZIP and open a terminal in the always-nursing-base44-native folder containing package.json.

~~~sh
npm ci
npm run typecheck
npm test
npm run check:actor
npx base44 login
npx base44 link --create --name "Always Nursing Staging"
npx base44 deploy --build
npx base44 site open
~~~

If you already created an empty Base44 app to receive this code, use npx base44 link instead of link --create and select that app.

The Base44 build injects the correct app ID. Deploy with npx base44 deploy --build. A plain Vite build without that ID cannot connect to the app. The ZIP excludes temporary local validation build output.

## Enable Your Agency Account

Initially, new accounts are applicants with no hiring approval and no agency access. Create and verify your Always Nursing account on the staging app. In the Base44 app dashboard, inspect the Users records and copy that account's internal user ID.

Add these server-side secrets through the Base44 app Dashboard Secrets controls:

| Secret | Value |
| --- | --- |
| STAFF_AUTH_IDS | Comma-separated internal Base44 user IDs for authorized agency staff |
| STAFF_EMAILS | Matching agency emails, used only to protect staff records from employment status changes |

STAFF_AUTH_IDS grants privileges. Email alone or a browser-supplied role never grants them. Keep this list under your Base44 project owner's control. Deploy again after changing staff configuration, then sign in and confirm your account opens the staffing dashboard. Confirm a second ordinary employee account cannot perform agency actions.

Enable Core integration protection in the Base44 dashboard and confirm service-role private uploads and signed URL creation still work through StaffingHub. Configure your company logo and email branding in the Base44 app settings. The included sign-in already shows Always Nursing branding.

## What Is Preserved

The existing agency/employee dashboards, demo views, onboarding and credentials, scheduling, facility instructions, messaging, document controls, GPS timekeeping, RN/LPN signoffs, breaks, payroll document access, evaluations, DNR/attendance, incentives/referrals, training, merchandise and branding assets are retained from the supplied source.

Provider-specific VMS/MSP, OnShift, EHR, payroll, SMS and email sending connections still require selected providers, credentials and actual adapters. This conversion does not establish those commercial connections or automatically pay bonuses.

## Before Employee Use

Use a SEPARATE staging Base44 app. Actors operate on persistent room data; selecting the editor's test database does not isolate these staffing records. Use fictional records until hosted authorization, files, restart persistence, concurrent booking, phones and backup recovery are tested.

Read ARCHITECTURE.md for storage design and capacity limits. Read MIGRATION.md before moving existing records. The original live Always Nursing site has not been changed.

## Official Documentation

- https://docs.base44.com/developers/backend/quickstart/templates/quickstart-react-template
- https://docs.base44.com/developers/backend/resources/actors/reference
- https://docs.base44.com/developers/backend/resources/auth
- https://docs.base44.com/developers/references/sdk/docs/type-aliases/integrations
- https://docs.base44.com/developers/references/cli/commands/deploy
