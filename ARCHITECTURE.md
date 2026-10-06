# Architecture And Validation Limits

## Frontend And Accounts

Server-rendered Vinext pages were replaced with a static Vite React entry point. Existing React components/assets remain. A fetch-compatible adapter sends application API calls over an authenticated Base44 actor connection. Images, audio, video and document links resolve through the adapter so private files do not become public assets.

Registration, verification, login and recovery use Base44's SDK. Passwords/session tokens are never persisted in the staffing database. The actor takes the caller ID from conn.identity, re-verifies each request token through Base44 auth.me(), and checks that the verified ID matches the connection. Staff authorization uses configured server IDs. Legacy records can be linked through reviewed auth_identity_links entries.

## Transactional Records

StaffingHub is a native Base44 actor. Its sole permitted room is always-nursing-records-v1. Business requests pass through one serialized executor. Portable sql.js SQLite preserves parameterized SQL, views and transaction rules. Conditional updates and complete request publication remain authoritative on the server.

The database is saved as checksummed, chunked snapshots in persistent actor storage. A head pointer publishes a complete snapshot after its chunks are written. Acknowledgement follows persistence. Publication failure discards changed in-memory data. Mutation request IDs prevent duplicate replay. A prior snapshot is retained; it is not an independent disaster backup.

This design preserves SQL transaction semantics instead of translating conditional booking into non-atomic entity updates. Records are NOT mirrored into ordinary Base44 Entities. The standard Data table browser, entity triggers and entity backup controls do not manage these staffing records. Use the existing agency interface and authorized snapshot export.

Initial conservative limits: 8 MiB records database; 10 MiB song/video uploads; credentials remain 5 MB and photos remain 5 MB. Transport frames are 48,000 characters. Incomplete multipart uploads expire after two minutes; aggregate pending uploads are bounded. Larger videos can use supported streaming links. High-volume deployment needs load/memory testing and a storage redesign before these limits are raised.

The worker SQL runtime is sql.js 1.14.2, bundled/minified with Node process detection disabled. License included. It contains no runtime eval or Function construction. Backend bundling was checked locally with platform runtime imports external; actual Base44 actor execution is not verified.

## Private Documents

NativeObjects uses service-role Core.UploadPrivateFile and keeps private URIs server-side. It obtains a 60-second signed URL only after the original route authorizes access. Bytes are returned through the caller's connection; signed URLs are not returned to employees. Ownership metadata remains in transactional storage.

Logical archive keys produce private duplicate files. Those and the prior snapshot share the Base44 environment. Independent recovery requires exported records plus securely retained file bytes. Base44 does not document a Core private-file deletion API used by this adapter; removing a logical key does not physically erase the provider file. Replaced/failed uploads can leave unreachable private files, requiring an administrator retention/cleanup process before production.

## Updates

Keep the actor name, canonical room ID and snapshot keys stable. native/migrations.ts defines numbered additive migrations using SQLite user_version. Older app code refuses newer schemas. Test migrations against restored staging exports and check existing records and files after deployment. Never reset/delete a populated room or replace its database with a fresh schema.

## Verified Locally

TypeScript typecheck, frontend build with a non-production app ID, actor dependency bundle, portable schema initialization, native regression tests and existing pure workflow tests. See HANDOFF-CHECKS.json.

Tests execute real converted handlers and portable SQLite. Base44 identity, private storage providers and persistence are stubbed. These checks do not prove hosted runtime compatibility, email delivery, platform permissions, phone behavior, sustained traffic, live import, staff MFA or independent disaster recovery.
