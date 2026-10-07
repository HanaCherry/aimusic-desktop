const { app, BrowserWindow, session } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { configureCache, clearResourceCache, cacheInfo } = require('../../cache.cjs');
const { mode, profile, origin, report } = JSON.parse(Buffer.from(process.argv.find(arg=>arg.startsWith('--cache-probe=')).slice('--cache-probe='.length),'base64').toString());
fs.mkdirSync(profile, { recursive: true });
app.setPath('userData', profile); app.setPath('sessionData', profile);
configureCache(app);
app.whenReady().then(async () => {
  let win;
  try {
    const ses = session.fromPartition('persist:cache-fixture', { cache: true });
    if (mode === 'clear') await clearResourceCache(ses);
    win = new BrowserWindow({ show: false, webPreferences: { session: ses, sandbox: true, contextIsolation: true, nodeIntegration: false } });
    await win.loadURL(origin + '/?mode=' + mode);
    if (mode === 'seed') await win.webContents.executeJavaScript("localStorage.setItem('fixture-setting','kept')");
    const marker = await win.webContents.executeJavaScript("({ asset: window.fixtureAsset, setting: localStorage.getItem('fixture-setting') })");
    const cookies = await ses.cookies.get({ url: origin });
    await ses.cookies.flushStore(); ses.flushStorageData();
    await new Promise(resolve => setTimeout(resolve,400));
    fs.writeFileSync(report, JSON.stringify({ mode, marker, cookieKept: cookies.some(c => c.name === 'fixture-login' && c.value === 'kept'), ...await cacheInfo(ses) }));
    win.destroy(); app.quit();
  } catch(error) { fs.writeFileSync(report,JSON.stringify({ error:String(error.stack) })); app.exit(1); }
});

