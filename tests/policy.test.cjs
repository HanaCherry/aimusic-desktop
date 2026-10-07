const { test } = require('node:test');
const assert = require('node:assert/strict');
const { siteURL, authURL, httpsURL, settings, telemetry } = require('../policy.cjs');
test('Navigation only accepts actual HTTPS site and identity provider hosts', () => {
  assert.ok(siteURL('https://aimusic.so/fr/app'));
  assert.ok(authURL('https://accounts.google.com/o/oauth2/auth'));
  assert.ok(authURL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize'));
  for (const url of ['https://aimusic.so.evil.com/', 'http://aimusic.so/', 'file:///C:/Windows/', 'javascript:alert(1)', 'https://user:secret@aimusic.so/']) assert.equal(siteURL(url), false);
  assert.equal(authURL('https://accounts.google.com.evil.com/'), false);
  assert.equal(httpsURL('mailto:someone@example.com'), false);
});
test('Corrupt settings cannot escape supported ranges or enable arbitrary actions', () => {
  const result = settings({ theme: '<script>', zoom: 999, density: -5, size: NaN, analysis: 'true', extra: 'ignored' });
  assert.equal(result.theme, 'galaxy'); assert.equal(result.zoom, 1.5); assert.equal(result.density, 15); assert.equal(result.size, 20); assert.equal(result.analysis, false); assert.equal(result.extra, undefined);
});
test('Remote samples are bounded and do not forward metadata or arbitrary CSS', () => {
  assert.deepEqual(telemetry({ state: 'active', bass: 99, impact: 1, color: 'url(https://evil)', token: 'private' }), { state: 'active', bass: 1, impact: false, color: null });
  assert.equal(telemetry({ color: '#aabbcc' }).color, '#aabbcc'); assert.equal(telemetry(null), null);
});
