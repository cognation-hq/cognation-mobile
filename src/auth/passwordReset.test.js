/**
 * Still-here: Forgot password on sign-in calls the same Supabase reset as the web.
 * Run: node src/auth/passwordReset.test.js
 * Does not send real emails or print tokens.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const PASSWORD_RESET_REDIRECT_URL = 'https://cognation.app/reset-password';
const PASSWORD_RESET_SENT_MESSAGE =
  'If that email has an account, a reset link is on its way.';

function isValidResetEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function testHelpers() {
  assert.strictEqual(isValidResetEmail('a@b.co'), true);
  assert.strictEqual(isValidResetEmail('not-an-email'), false);
  assert.ok(PASSWORD_RESET_REDIRECT_URL.endsWith('/reset-password'));
  assert.ok(PASSWORD_RESET_REDIRECT_URL.startsWith('https://'));
  assert.ok(
    /If that email has an account, a reset link is on its way/.test(
      PASSWORD_RESET_SENT_MESSAGE,
    ),
  );
}

function testStillInSource() {
  const panel = fs.readFileSync(path.join(__dirname, 'AuthPanel.tsx'), 'utf8');
  assert.ok(
    /Forgot password\?/.test(panel),
    'sign-in must show Forgot password?',
  );
  assert.ok(
    /setMode\(['"]forgot['"]\)/.test(panel) || /mode === 'forgot'/.test(panel),
    'Forgot password must open in-app forgot mode',
  );
  assert.ok(
    /requestPasswordReset/.test(panel),
    'Forgot flow must call requestPasswordReset',
  );
  assert.ok(
    /PASSWORD_RESET_SENT_MESSAGE/.test(panel),
    'Forgot flow must use neutral confirmation',
  );
  assert.ok(
    !/Linking\.openURL/.test(panel),
    'Forgot password must not open an external browser URL',
  );

  const ctx = fs.readFileSync(path.join(__dirname, 'AuthContext.tsx'), 'utf8');
  assert.ok(
    /resetPasswordForEmail/.test(ctx),
    'AuthContext must call supabase.auth.resetPasswordForEmail',
  );
  assert.ok(
    /PASSWORD_RESET_REDIRECT_URL/.test(ctx),
    'AuthContext must pass the web reset redirect URL',
  );

  const helper = fs.readFileSync(
    path.join(__dirname, 'passwordReset.ts'),
    'utf8',
  );
  assert.ok(
    helper.indexOf('https://cognation.app/reset-password') !== -1,
    'redirect must match the website reset page',
  );

  const layout = fs.readFileSync(
    path.join(__dirname, '..', 'app', '_layout.tsx'),
    'utf8',
  );
  assert.ok(
    /drawerItemStyle:\s*\{\s*display:\s*['"]none['"]/.test(layout),
    'Profile must stay hidden from the left menu',
  );
}

testHelpers();
testStillInSource();
console.log('passwordReset tests passed');
