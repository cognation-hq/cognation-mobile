/**
 * Still-here / timeout helpers for sign-in.
 * Run: node src/auth/authTimeout.test.js
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mirror the TS helpers in plain JS for a zero-dep Node check.
const AUTH_TIMEOUT_MS = 10_000;
const AUTH_TIMEOUT_MESSAGE =
  'Could not reach Cognation. Check your connection and try again.';

function withAuthTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(AUTH_TIMEOUT_MESSAGE));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  });
}

function formatAuthError(raw) {
  if (raw == null) return null;
  const msg = String(raw).trim();
  if (!msg) return null;
  const lower = msg.toLowerCase();
  if (
    lower === 'fetch failed' ||
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('could not reach cognation')
  ) {
    return AUTH_TIMEOUT_MESSAGE;
  }
  return msg;
}

async function testTimeoutRejects() {
  const start = Date.now();
  let err;
  try {
    await withAuthTimeout(new Promise(() => {}), 50);
  } catch (e) {
    err = e;
  }
  assert.ok(err, 'timeout should reject');
  assert.strictEqual(err.message, AUTH_TIMEOUT_MESSAGE);
  assert.ok(Date.now() - start < 500, 'timeout should fire quickly');
}

async function testFastResolve() {
  const value = await withAuthTimeout(Promise.resolve(42), 200);
  assert.strictEqual(value, 42);
}

function testFormatAuthError() {
  assert.strictEqual(formatAuthError('fetch failed'), AUTH_TIMEOUT_MESSAGE);
  assert.strictEqual(
    formatAuthError('TypeError: Network request failed'),
    AUTH_TIMEOUT_MESSAGE,
  );
  assert.strictEqual(
    formatAuthError('Invalid login credentials'),
    'Invalid login credentials',
  );
  assert.strictEqual(formatAuthError(null), null);
  assert.strictEqual(AUTH_TIMEOUT_MS, 10_000);
}

function testStillInSource() {
  const ctx = fs.readFileSync(path.join(__dirname, 'AuthContext.tsx'), 'utf8');
  assert.ok(
    /withAuthTimeout/.test(ctx),
    'AuthContext must use withAuthTimeout',
  );
  assert.ok(
    /formatAuthError/.test(ctx),
    'AuthContext must format auth errors',
  );
  assert.ok(
    /AUTH_TIMEOUT_MS|10_000|10000/.test(ctx),
    'AuthContext must apply ~10s timeout',
  );
  const panel = fs.readFileSync(path.join(__dirname, 'AuthPanel.tsx'), 'utf8');
  assert.ok(
    /\.finally\s*\(/.test(panel) || /setBusy\(false\)/.test(panel),
    'AuthPanel must always clear busy',
  );
}

(async () => {
  testFormatAuthError();
  testStillInSource();
  await testTimeoutRejects();
  await testFastResolve();
  console.log('authTimeout tests passed');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
