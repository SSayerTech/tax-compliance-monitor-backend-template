/**
 * Detects MongoDB permission errors (E11000, 8000, MongoError with Unauthorized).
 * Used to differentiate permission failures from other write errors.
 *
 * Common MongoDB error codes:
 * - 8000: Unauthorized
 * - 11000: E11000 duplicate key error (permission-related in read-only contexts)
 * - 13: Unauthorized (newer MongoDB versions)
 */
export function isMongoPermissionError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) {
    return false;
  }

  const errObj = err as Record<string, unknown>;

  // Check error code (8000 = Unauthorized, 13 = Unauthorized in newer versions)
  if ('code' in errObj && (errObj.code === 8000 || errObj.code === 13)) {
    return true;
  }

  // Check errmsg field for permission-related keywords
  if ('errmsg' in errObj && typeof errObj.errmsg === 'string') {
    const msg = errObj.errmsg.toLowerCase();
    return msg.includes('unauthorized') || msg.includes('not authorized');
  }

  // Check message field (standard Error.message)
  if ('message' in errObj && typeof errObj.message === 'string') {
    const msg = errObj.message.toLowerCase();
    return (
      msg.includes('unauthorized') ||
      msg.includes('not authorized') ||
      msg.includes('permission')
    );
  }

  return false;
}
