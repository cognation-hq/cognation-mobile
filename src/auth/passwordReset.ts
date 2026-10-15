/**
 * Same recover redirect the website uses so the new password works on web and app.
 * Web: loc.origin + "/reset-password" (see cognation-hq/cognation js/password-reset.js).
 */
export const PASSWORD_RESET_REDIRECT_URL =
  'https://cognation.app/reset-password';

/** Neutral copy — never say whether the email has an account. */
export const PASSWORD_RESET_SENT_MESSAGE =
  'If that email has an account, a reset link is on its way.';

export function isValidResetEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
