// Run with: node tools/check-analytics.cjs
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const source = readFileSync(join(__dirname, '../analytics.js'), 'utf8');
function visit(saved, hostname = 'andynata.com', brokenStorage = false) {
  const nodes = [], stored = {}, cookies = [], listeners = {};
  const element = tag => ({ tag, events: {}, append(...children) { nodes.push(...children); },
    setAttribute() {}, addEventListener(name, fn) { this.events[name] = fn; }, showModal() { this.open = true; } });
  const document = { head: element('head'), body: element('body'), createElement: element, querySelector: () => null };
  Object.defineProperty(document, 'cookie', { get: () => '_ga=abc; _ga_DLNT4X7N46=abc; session=keep', set: value => cookies.push(value) });
  const context = { document, location: { hostname, reload() { context.reloaded = true; } },
    localStorage: { getItem: () => { if (brokenStorage) throw Error('blocked'); return saved; },
      setItem: (key, value) => { if (brokenStorage) throw Error('blocked'); stored[key] = value; } },
    addEventListener(name, fn) { listeners[name] = fn; } };
  context.window = context;
  runInNewContext(source, context);
  return { context, nodes, cookies, listeners, stored, scripts: () => nodes.filter(n => n.tag === 'script'),
    dialog: nodes.find(n => n.tag === 'dialog'), choose(value) { this.dialog.returnValue = value; this.dialog.events.close(); } };
}
const saved = (value, time = Date.now()) => JSON.stringify({ value, time });
let page = visit(null);
assert.equal(page.scripts().length, 0); assert.equal(page.dialog.open, true);
page.choose('denied'); assert.equal(page.scripts().length, 0);
page = visit(saved('denied')); assert.equal(page.dialog.open, undefined); assert.equal(page.scripts().length, 0);
page = visit(null); page.choose('granted'); page.choose('granted');
assert.equal(page.scripts().length, 1);
assert.equal(Object.prototype.toString.call(page.context.dataLayer[0]), '[object Arguments]');
assert.match(page.scripts()[0].src, /G-DLNT4X7N46$/);
assert.equal(page.context.dataLayer[0][2].analytics_storage, 'denied');
assert.equal(page.context.dataLayer.find(row => row[0] === 'config')[2].allow_google_signals, false);
page.choose('denied'); assert.equal(page.context['ga-disable-G-DLNT4X7N46'], true); assert.equal(page.context.reloaded, true);
assert.equal(page.cookies.length, 6); assert.ok(page.cookies.every(value => !value.startsWith('session=')));
assert.equal(visit(saved('granted')).scripts().length, 1);
assert.equal(visit(saved('granted', 0)).scripts().length, 0);
assert.equal(visit('invalid').scripts().length, 0);
assert.equal(visit(null, 'littlebrushgames.com').nodes.length, 0);
assert.equal(visit(saved('granted'), 'localhost').scripts().length, 0);
page = visit(null, 'andynata.com', true); page.choose('granted'); assert.equal(page.scripts().length, 1);
page = visit(saved('granted')); page.listeners.storage({ key: 'andynata-analytics-consent-v1' });
assert.equal(page.context['ga-disable-G-DLNT4X7N46'], true); assert.equal(page.context.reloaded, true);
console.log('PASS: consent gating, persistence, expiry, revocation, cookie cleanup, cross-tab changes and host scope.');
