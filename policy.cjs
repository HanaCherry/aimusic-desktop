'use strict';
const { eqSettings, eqPresets } = require('./audio-settings.cjs');
const DEFAULTS = Object.freeze({ theme: 'galaxy', size: 20, density: 55, motion: true, analysis: false, autoColor: true, zoom: 1, studioUI: true });
function siteURL(value) { try { const u = new URL(value); return u.protocol === 'https:' && ['aimusic.so', 'www.aimusic.so'].includes(u.hostname) && !u.username && !u.password; } catch { return false; } }
function httpsURL(value) { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } }
function authURL(value) { try { const u = new URL(value); return httpsURL(value) && ['accounts.google.com', 'login.microsoftonline.com', 'login.live.com', 'account.live.com'].includes(u.hostname); } catch { return false; } }
function settings(value = {}) {
  const number = (key, lo, hi) => Number.isFinite(value[key]) ? Math.min(hi, Math.max(lo, value[key])) : DEFAULTS[key];
  return { theme: ['galaxy', 'music', 'night', 'light', 'official'].includes(value.theme) ? value.theme : DEFAULTS.theme,
    size: number('size', 8, 48), density: number('density', 15, 100), zoom: number('zoom', .75, 1.5), eq:eqSettings(value.eq), eqPresets:eqPresets(value.eqPresets),
    ...Object.fromEntries(['motion', 'analysis', 'autoColor', 'studioUI'].map(k => [k, typeof value[k] === 'boolean' ? value[k] : DEFAULTS[k]])) };
}
function telemetry(value) {
  if (!value || typeof value !== 'object') return null;
  return { state: ['disabled','waiting','unavailable','silent','active'].includes(value.state) ? value.state : 'unavailable',
    bass: Number.isFinite(value.bass) ? Math.max(0, Math.min(1, value.bass)) : 0,
    impact: value.impact === true,
    color: typeof value.color === 'string' && /^#[0-9a-f]{6}$/i.test(value.color) ? value.color : null,
    ...(Array.isArray(value.spectrum)?{spectrum:value.spectrum.slice(0,64).map(v=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):0)}:{}),
    ...(typeof value.eqState==='string'?{eqState:['off','active','bypass','waiting','unavailable'].includes(value.eqState)?value.eqState:'unavailable'}:{}) };
}
module.exports = { DEFAULTS, settings, siteURL, httpsURL, authURL, telemetry };
