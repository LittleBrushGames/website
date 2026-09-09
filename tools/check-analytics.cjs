const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const source = readFileSync(join(__dirname, '../analytics.js'), 'utf8');
function visit(hostname, blocked = false) {
  const cleared = [], removed = [], window = {};
  const document = {};
  Object.defineProperty(document, 'cookie', {
    get: () => '_ga=old; _ga_DLNT4X7N46=old; session=keep',
    set: value => cleared.push(value)
  });
  runInNewContext(source, { location: { hostname }, window, document,
    localStorage: { removeItem(key) { if (blocked) throw Error('blocked'); removed.push(key); } } });
  return { cleared, removed, window };
}
for (const host of ['andynata.com', 'www.andynata.com']) {
  const result = visit(host);
  assert.equal(result.window['ga-disable-G-DLNT4X7N46'], true);
  assert.deepEqual(result.removed, ['andynata-analytics-consent-v1']);
  assert.equal(result.cleared.length, 6);
  assert.ok(result.cleared.every(cookie => cookie.startsWith('_ga') && cookie.includes('Max-Age=0')));
  assert.equal(visit(host, true).cleared.length, 6);
}
for (const host of ['localhost', 'littlebrushgames.com']) {
  assert.equal(visit(host).cleared.length, 0);
  assert.equal(visit(host).removed.length, 0);
}
assert.doesNotMatch(source, /createElement|googletagmanager|gtag\(/);
console.log('PASS: GA4 disabled, old consent/cookies cleared, unrelated storage preserved, no tracker or consent UI loaded.');
