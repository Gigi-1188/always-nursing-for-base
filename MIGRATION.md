# Existing Record Migration

The initial native records store is empty. Source code is not a live-data export.

1. Obtain an authorized consistent export of the original database and all private objects, including archives, facility photos, contracts, home media and training. Preserve record IDs/object keys.
2. Create and verify replacement Base44 accounts. Prepare staff-reviewed new user ID to old record user_id mappings. Never merge solely by email or copy old passwords/session tokens.
3. Remove obsolete auth-session/rate-limit tables from the migration copy. Add the native tables from native/migrations.ts. Preserve business tables, views and triggers. Insert unique reviewed auth_identity_links mappings and set user_version to the deployed native version.
4. Upload authorized private objects to Base44 private storage. Populate native_objects with each original logical key, new private URI, MIME and byte count. This source has NO production bulk-import or destructive restore endpoint. A reviewed migration tool with agency authorization and an empty-store guard is required before importing the prepared snapshot into StaffingHub.
5. Verify table counts, ownership, assignments, attendance, credentials, inactive access, incentives/payment states and file hashes against the export. Rehearse restoration in a separate app.
6. Reconcile changes after export and schedule cutover only after hosted acceptance passes. Retain the original app for recovery until the replacement is verified.

Do not paste live records, employee files or credentials into an AI chat. The agency Download Records Backup link exports SQLite records and private references, not uploaded file contents. Keep the export secure and independently back up file bytes. Verify they can be restored together.

Live migration, bulk-import tooling and independent restoration have NOT been completed by this source conversion. Deploying code alone does not transfer existing employee data.
