'use strict';
const { app, BrowserWindow, WebContentsView, ipcMain, session, shell, dialog, Menu } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { settings, siteURL, httpsURL, authURL, telemetry } = require('./policy.cjs');
const { configureCache, cacheInfo, clearResourceCache } = require('./cache.cjs');
const { localProfile } = require('./profile.cjs');
const { imagePalette } = require('./palette.cjs');
configureCache(app);
const HOME = 'https://aimusic.so/fr/app';
const smoke = process.argv.includes('--smoke-test');
const preview = process.argv.includes('--preview');
// A dedicated directory and partition: no browser or SunoApp profile is consulted.
app.setPath('userData', smoke || preview ? path.join(app.getPath('temp'), 'aimusic-desktop-test-' + process.pid) : path.join(app.getPath('appData'), 'AIMusicDesktopIndependent'));
let win, site, prefs, prefsFile, panel = false, siteReady = false, current = { loading: true, failed: false, studio: { ready: false, route: '', routes: [], account: false, credits: null }, player: { available: false, playing: false, position: 0, duration: 0, volume: 1, muted: false, title: '', artist: '' }, audio: { state: 'disabled', bass: 0, impact: false, color: null } };
let profile = { nickname: '', photo: null }, profileFile;
const popupWindows = new Set();
if (!smoke && !preview) {
  if (!app.requestSingleInstanceLock()) app.exit(0);
  app.on('second-instance', () => { if (win && !win.isDestroyed()) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); } });
}
function send() { if (win && !win.isDestroyed()) win.webContents.send('desktop:state', { ...current, prefs, profile }); }
function layout() {
  if (!win || win.isDestroyed() || !site) return;
  const [width, height] = win.getContentSize();
  site.setBounds({ x: 236, y: 132, width: Math.max(1, width - 260), height: Math.max(1, height - 212) });
  site.setVisible(!panel && siteReady && !current.failed);
}
function shellSender(event) { return win && event.sender === win.webContents && event.senderFrame === win.webContents.mainFrame; }
async function external(url) {
  if (!httpsURL(url)) return;
  const result = await dialog.showMessageBox(win, { type: 'question', title: 'Lien externe', message: 'Ouvrir ce lien dans votre navigateur ?', detail: new URL(url).origin, buttons: ['Annuler', 'Ouvrir'], defaultId: 0, cancelId: 0 });
  if (result.response === 1) await shell.openExternal(url);
}
function protect(contents, popup = false) {
  contents.setWindowOpenHandler(({ url }) => {
    if (siteURL(url) || authURL(url)) return { action: 'allow', overrideBrowserWindowOptions: { title: 'Connexion — AI Music Desktop', width: 580, height: 760, parent: win, autoHideMenuBar: true, webPreferences: { partition: 'persist:aimusic-independent-v1', backgroundThrottling:false, nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true, preload: undefined } } };
    void external(url);
    return { action: 'deny' };
  });
  const navigate = (event, url) => {
    if (siteURL(url) || authURL(url) || (popup && url === 'about:blank')) return;
    event.preventDefault();
    void external(url);
  };
  contents.on('will-navigate', navigate);
  contents.on('will-redirect', navigate);
  contents.on('will-attach-webview', event => event.preventDefault());
  contents.on('did-create-window', child => { popupWindows.add(child); protect(child.webContents, true); child.on('closed', () => popupWindows.delete(child)); });
}
app.whenReady().then(async () => {
  prefsFile = path.join(app.getPath('userData'), 'settings.json');
  try { prefs = settings(JSON.parse(fs.readFileSync(prefsFile, 'utf8'))); } catch { prefs = settings(); }
  profileFile = path.join(app.getPath('userData'),'local-profile.json');
  try { profile=localProfile(JSON.parse(fs.readFileSync(profileFile,'utf8'))); } catch { profile=localProfile(); }
  Menu.setApplicationMenu(null);
  const siteSession = session.fromPartition('persist:aimusic-independent-v1', { cache: true });
  siteSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  siteSession.setPermissionCheckHandler(() => false);
  // Downloads use a native Save dialog, with filenames supplied by the site.
  siteSession.on('will-download', (_event, item) => { item.setSaveDialogOptions({ title: 'Enregistrer le téléchargement', defaultPath: path.join(app.getPath('downloads'), path.basename(item.getFilename())) }); });
  win = new BrowserWindow({ title: 'AI Music Desktop · non officiel', frame: false, icon: path.join(__dirname, 'assets', 'icon.ico'), width: 1480, height: 980, minWidth: 1120, minHeight: 760, backgroundColor: '#100d20', show: false, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), backgroundThrottling:false, nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true } });
  win.once('ready-to-show', () => { if (!smoke) win.show(); });
  win.webContents.on('will-navigate', event => event.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  site = new WebContentsView({ webPreferences: { partition: 'persist:aimusic-independent-v1', preload: path.join(__dirname, 'site-preload.cjs'), backgroundThrottling:false, nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true } });
  site.setBackgroundColor('#101010');
  win.contentView.addChildView(site);
  protect(site.webContents);
  site.webContents.setZoomFactor(prefs.zoom);
  // Loading events also fire for child frames (including sign-in widgets).
  // Only a new main document may reset readiness or hide the native view.
  site.webContents.on('did-start-navigation', (_event, _url, isInPlace, isMainFrame) => {
    if (!isMainFrame || isInPlace) return;
    siteReady = false; layout(); current.failed = false;
    current.studio = { ready: false, route: '', routes: [], account: false, credits: null };
    current.cover = null;
    current.player = { available: false, playing: false, position: 0, duration: 0, volume: 1, muted: false, title: '', artist: '' };
    current.audio = { state: prefs.analysis ? 'waiting' : 'disabled', bass: 0, impact: false, color: null };
  });
  site.webContents.on('did-start-loading', () => { current.loading = true; send(); });
  site.webContents.on('did-stop-loading', () => { current.loading = false; layout(); send(); });
  site.webContents.on('dom-ready', () => {
    siteReady = true; layout();
    site.webContents.send('analysis:config', { enabled: prefs.analysis, autoColor: prefs.autoColor, eq:prefs.eq });
    if (siteURL(site.webContents.getURL())) {
      void site.webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'ui', 'site.css'), 'utf8')).catch(() => {});
      site.webContents.send('appearance:config', { theme: prefs.theme, studioUI: prefs.studioUI });
    }
  });
  site.webContents.on('did-fail-load', (_e, code, _description, _url, mainFrame) => { if (mainFrame && code !== -3) { site.setVisible(false); current.failed = true; current.loading = false; send(); } });
  site.webContents.on('render-process-gone', () => { site.setVisible(false); current.failed = true; current.loading = false; send(); });
  site.webContents.on('before-input-event', (event, input) => { if (input.control && input.key === ',') { event.preventDefault(); panel = !panel; layout(); win.webContents.send('desktop:panel', panel); } if (input.key === 'F5') { event.preventDefault(); site.webContents.reload(); } });
  win.on('resize', layout);
  win.on('closed', () => { for (const child of popupWindows) child.close(); if (!site.webContents.isDestroyed()) site.webContents.close(); win = null; });
  ipcMain.handle('shell:init', event => { if (!shellSender(event)) throw Error('Invalid sender'); return { ...current, prefs, profile }; });
  ipcMain.handle('shell:profile',(event,value)=>{
    if(!shellSender(event))throw Error('Invalid sender');
    profile=localProfile(value);
    fs.mkdirSync(app.getPath('userData'),{recursive:true});
    fs.writeFileSync(profileFile+'.tmp',JSON.stringify(profile));fs.renameSync(profileFile+'.tmp',profileFile);
    send();return profile;
  });
  ipcMain.handle('shell:cache', async (event, action) => {
    if (!shellSender(event)) throw Error('Invalid sender');
    if (action === 'clear') return clearResourceCache(siteSession);
    if (action === 'info') return cacheInfo(siteSession);
    throw Error('Invalid cache action');
  });
  ipcMain.handle('shell:settings', (event, open) => { if (!shellSender(event)) return; panel = open === true; layout(); return panel; });
  ipcMain.handle('shell:save', (event, value) => {
    if (!shellSender(event)) throw Error('Invalid sender');
    prefs = settings(value);
    fs.mkdirSync(app.getPath('userData'), { recursive: true });
    fs.writeFileSync(prefsFile + '.tmp', JSON.stringify(prefs, null, 2));
    fs.renameSync(prefsFile + '.tmp', prefsFile);
    site.webContents.setZoomFactor(prefs.zoom);
    site.webContents.send('analysis:config', { enabled: prefs.analysis, autoColor: prefs.autoColor, eq:prefs.eq });
    if (!prefs.analysis) current.audio = { state: 'disabled', bass: 0, impact: false, color: null };
    site.webContents.send('appearance:config', { theme: prefs.theme, studioUI: prefs.studioUI });
    send(); return prefs;
  });
  ipcMain.handle('shell:action', async (event, action) => {
    if (!shellSender(event)) return;
    switch (action) {
      case 'minimize': win.minimize(); break;
      case 'maximize': if (win.isMaximized()) win.unmaximize(); else win.maximize(); break;
      case 'close-window': win.close(); break;
      case 'back': if (site.webContents.navigationHistory.canGoBack()) site.webContents.navigationHistory.goBack(); break;
      case 'forward': if (site.webContents.navigationHistory.canGoForward()) site.webContents.navigationHistory.goForward(); break;
      case 'reload': site.webContents.reload(); break;
      case 'home': await site.webContents.loadURL(HOME).catch(() => {}); break;
      case 'browser': await shell.openExternal(HOME); break;
    }
  });
  const studioRoutes = ['app','library','ai-lyrics-generator','sound-effect','vocal-remover','stem-splitter'];
  ipcMain.handle('shell:studio', (event, command) => {
    if (!shellSender(event) || !siteURL(site.webContents.getURL()) || !current.studio.ready) return false;
    if (command !== 'account' && command !== 'credits' && !studioRoutes.includes(command)) return false;
    if (command === 'account' ? !current.studio.account : command === 'credits' ? !current.studio.hasCredits : !current.studio.routes.includes(command)) return false;
    site.webContents.send('studio:command', command); return true;
  });
  ipcMain.on('studio:state', (event, value) => {
    if (event.sender !== site.webContents || event.senderFrame !== site.webContents.mainFrame || !siteURL(event.senderFrame.url) || !value || typeof value !== 'object') return;
    current.studio = { ready: value.ready === true, route: studioRoutes.includes(value.route) ? value.route : '', routes: Array.isArray(value.routes) ? studioRoutes.filter(route => value.routes.includes(route)) : [], account: value.account === true, hasCredits: value.hasCredits === true, credits: typeof value.credits === 'string' && value.credits.length <= 24 && /^[\d\s.,]+$/.test(value.credits) ? value.credits : null };
    send();
  });
  ipcMain.handle('shell:player', (event, command) => {
    if (!shellSender(event) || !siteURL(site.webContents.getURL()) || !current.player.available || !command || typeof command !== 'object') return false;
    const action = command.action;
    if (!['toggle','seek','volume','repeat','rewind','forward','favorite','share','download'].includes(action)) return false;
    if (['seek','volume'].includes(action) && !Number.isFinite(command.value)) return false;
    if (['repeat','rewind','forward','favorite','share','download'].includes(action) && !current.player.nativeActions?.[action]) return false;
    site.webContents.send('player:command', { action, value: action === 'seek' ? Math.max(0,Math.min(current.player.duration,command.value)) : action === 'volume' ? Math.max(0,Math.min(1,command.value)) : undefined });
    return true;
  });
  ipcMain.on('player:state', (event, value) => {
    if (event.sender !== site.webContents || event.senderFrame !== site.webContents.mainFrame || (!smoke && !siteURL(event.senderFrame.url)) || !value || typeof value !== 'object') return;
    const bounded = (number, max) => Number.isFinite(number) ? Math.max(0,Math.min(max,number)) : 0;
    current.player = { available: value.available === true, playing: value.playing === true, position: bounded(value.position,864000), duration: bounded(value.duration,864000), volume: bounded(value.volume,1), muted: value.muted === true, title: typeof value.title === 'string' ? value.title.slice(0,120) : '', artist: typeof value.artist === 'string' ? value.artist.slice(0,80) : '' };
    const coverKey=Number.isSafeInteger(value.coverKey)?value.coverKey:0;
    if(current.coverKey!==coverKey){current.cover=null;current.coverKey=coverKey;}
    current.player.nativeActions=Object.fromEntries(['repeat','rewind','forward','favorite','share','download'].map(key=>[key,value.nativeActions?.[key]===true]));
    current.player.repeatMode=['list','single','random'].includes(value.repeatMode)?value.repeatMode:'unknown';
    current.player.collected=value.collected===true;
    for(const key of ['primary','secondary'])current.player[key]=typeof value[key]==='string'&&/^#[0-9a-f]{6}$/i.test(value[key])?value[key]:null;
    current.player.thumbnail=typeof value.thumbnail==='string'&&value.thumbnail.length<100000&&/^data:image\/png;base64,[a-z0-9+/=]+$/i.test(value.thumbnail)?value.thumbnail:null;
    if(!current.player.primary && current.cover?.primary)Object.assign(current.player,current.cover);
    send();
  });
  let coverCapture=0;
  ipcMain.on('cover:sample',async(event,value)=>{
    if(event.sender!==site.webContents||event.senderFrame!==site.webContents.mainFrame||!siteURL(event.senderFrame.url)||!value||typeof value!=='object'||Date.now()-coverCapture<800||!site.getVisible()||value.key!==current.coverKey)return;
    const keys=['x','y','width','height'];
    if(!keys.every(key=>Number.isFinite(value[key])&&value[key]>=0&&value[key]<16384)||value.width<8||value.height<8)return;
    coverCapture=Date.now();
    try{
      const zoom=site.webContents.getZoomFactor();
      const rect=Object.fromEntries(keys.map(key=>[key,Math.round(value[key]*zoom)]));
      const snapshot=await site.webContents.capturePage(rect);
      if(snapshot.isEmpty())return;
      if(value.key!==current.coverKey)return;
      const palette=imagePalette(snapshot);current.cover=palette;Object.assign(current.player,palette);
      site.webContents.send('cover:palette',{key:value.key,...palette});send();
    }catch{/* If no rendered cover is available, use the neutral palette. */}
  });
  let lastTelemetry = 0;
  ipcMain.on('analysis:sample', (event, value) => {
    if (event.sender !== site.webContents || event.senderFrame !== site.webContents.mainFrame || (!smoke && !siteURL(event.senderFrame.url)) || Date.now() - lastTelemetry < 35) return;
    lastTelemetry = Date.now(); const audio = telemetry(value); if (!audio) return;
    current.audio = prefs.analysis ? audio : { state: 'disabled', bass: 0, impact: false, color: null, eqState:audio.eqState, spectrum:audio.spectrum };
    if(prefs.autoColor && current.player.primary)current.audio.color=current.player.primary;
    send();
  });
  await win.loadFile(path.join(__dirname, 'ui', 'index.html'));
  if (!smoke) win.show();
  layout();
  if (smoke) {
    try { await require('./tests/smoke.cjs').run({ app, win, site, prefsFile, layout, setPanel: value => { panel = value; layout(); } }); app.exit(0); }
    catch (error) { fs.writeFileSync(path.join(__dirname, 'verification.json'), JSON.stringify({ passed: false, error: String(error.stack) }, null, 2)); console.error(error); app.exit(1); }
  } else { await site.webContents.loadURL(HOME).catch(() => {}); }
});
app.on('window-all-closed', () => app.quit());

