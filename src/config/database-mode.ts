import { ConfigService } from '@nestjs/config';

/**
 * Shared interview database mode.
 *
 * When `DB_READ_ONLY=true`:
 * - Candidates connect with read-only MongoDB credentials
 * - `POST /monitoring/:taxpayerId/trigger` simulates invoice ingestion (no writes)
 * - Returns simulated ingest counts; actual invoices must be pre-seeded by admin
 *
 * When `DB_READ_ONLY=false` (admin/interviewer):
 * - Full write permissions
 * - Trigger persists real invoices to DB
 * - `npm run seed` idempotent loads `blocked_ruts`
 *
 * See [MongoMigration.md](../../../MongoMigration.md) for role setup.
 */
export function isDbReadOnly(configService: ConfigService): boolean {
  const value = configService.get<string>('DB_READ_ONLY', 'false');
  return value === 'true' || value === '1';
}

/**
 * Error message for invoice write denials.
 * Use when catch block catches permission error and wants to explain to user.
 */
export const INVOICE_PERSIST_DENIED_MSG =
  'Cannot write invoices. Use DB_READ_ONLY=true for simulated trigger, or pre-seed invoices via MongoMigration.md §3 (interviewer/admin only).';

/**
 * Error message for monitoring config write denials.
 * Use when catch block catches permission error in monitoring config updates.
 */
export const MONITORING_PERSIST_DENIED_MSG =
  'Cannot write monitoring config. Ensure your MongoDB user has insert/update permissions, or use DB_READ_ONLY=true for shared interview mode (read-only).';

/**
 * Guidance note for shared interview DB setup.
 * Include in logs or error contexts when appropriate.
 */
export const SHARED_DB_INTERVIEW_NOTE =
  "Shared interview DB: keep candidate users read-only; pre-seed data with an admin account so candidates cannot overwrite each other's work.";
