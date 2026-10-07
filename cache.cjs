'use strict';
const HTTP_CACHE_BYTES = 256 * 1024 * 1024;
function configureCache(app) {
  app.commandLine.appendSwitch('disk-cache-size', String(HTTP_CACHE_BYTES));
}
async function cacheInfo(ses) { return { usedBytes: await ses.getCacheSize(), targetBytes: HTTP_CACHE_BYTES }; }
async function clearResourceCache(ses) {
  await ses.clearCache();
  await ses.clearCodeCaches({ urls: [] });
  // Preserve cookies, authentication, localStorage and all other account storage.
  return cacheInfo(ses);
}
module.exports = { configureCache, cacheInfo, clearResourceCache, HTTP_CACHE_BYTES };
