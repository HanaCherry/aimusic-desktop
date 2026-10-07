const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
async function run({ win, site, prefsFile, setPanel }) {
  const { ipcMain } = require('electron');
  const errors = [];
  for (const wc of [win.webContents, site.webContents]) wc.on('preload-error', (_e, _p, error) => errors.push(String(error)));
  assert.equal(await win.webContents.executeJavaScript('typeof window.desktop.save'), 'function');
  const initialCache = await win.webContents.executeJavaScript("window.desktop.cache('info')");
  assert.equal(initialCache.targetBytes,268435456); assert.ok(initialCache.usedBytes >= 0);
  assert.equal(await win.webContents.executeJavaScript('typeof require'), 'undefined');
  await site.webContents.loadURL('data:text/html,<html><body><h1>Native site fixture</h1></body></html>');
  const childLoaded = new Promise((resolve,reject) => {
    const timeout = setTimeout(() => { site.webContents.removeListener('did-frame-finish-load', listener); reject(Error('Child frame did not finish loading')); },4000);
    const listener = (_event,isMainFrame) => { if (!isMainFrame) { clearTimeout(timeout); site.webContents.removeListener('did-frame-finish-load',listener); resolve(); } };
    site.webContents.on('did-frame-finish-load',listener);
  });
  await site.webContents.executeJavaScript("const child=document.createElement('iframe');child.src='data:text/html,<h2>Delayed sign-in widget fixture</h2>';document.body.appendChild(child)");
  await childLoaded;
  await new Promise(resolve=>setTimeout(resolve,80));
  assert.equal(site.getVisible(),true,'A child frame loading after DOM ready must not hide the studio');
  assert.equal(await site.webContents.executeJavaScript('typeof require'), 'undefined');
  assert.equal(await site.webContents.executeJavaScript('typeof window.desktop'), 'undefined');
  // Controlled HTTPS fixture exercises the production layout adapter and IPC
  // without signing in or making a generation request to the real service.
  const fixture = `<!doctype html><html><body><main><div>
    <div class="app-sidebar-rail"><div><div><div>Brand</div><span></span><div><button id="account-fixture">Account</button></div><span></span></div><div><nav>
    ${['app','library','ai-lyrics-generator','sound-effect','vocal-remover','stem-splitter'].map(route=>`<a data-key="${route}" aria-selected="${route==='app'}" href="/fr/${route}">${route}</a>`).join('')}
    <a data-key="library" href="https://example.com/fr/library">Foreign route</a>
    </nav></div><div><button id="credits-fixture">Crédits<span class="text-right">42</span></button></div></div></div>
    <div id="workspace"><section id="app"><div><div><button id="custom-mode" role="switch">Custom</button><textarea id="draft">Preserve this draft</textarea><button id="generate-fixture">Generate</button></div><div><input placeholder="Search"></div></div></section></div>
    </div></main><script>
    document.getElementById('account-fixture').onclick=()=>document.body.dataset.accountOpened='true';
    document.getElementById('generate-fixture').onclick=()=>document.body.dataset.generated='true';
    document.querySelectorAll('a[data-key]').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('a[data-key]').forEach(link=>link.setAttribute('aria-selected',String(link===a)));history.pushState(null,'',a.getAttribute('href'));if(a.dataset.key==='ai-lyrics-generator')document.getElementById('workspace').innerHTML='<section><img alt="bg"><div><section>Marketing header</section><section><div><textarea id="lyrics-fixture">Lyrics draft</textarea><button>Generate lyrics</button></div></section><section>Marketing information</section></div></section>';});
    </script></body></html>`;
  await site.webContents.session.protocol.handle('https', () => new Response(fixture,{headers:{'content-type':'text/html; charset=utf-8'}}));
  await site.webContents.loadURL('https://aimusic.so/fr/app');
  const waitFor = async condition => { const deadline=Date.now()+4500; while(Date.now()<deadline){if(await condition())return;await new Promise(resolve=>setTimeout(resolve,50));}throw Error('Studio adapter did not settle'); };
  await waitFor(async()=> (await win.webContents.executeJavaScript('window.desktop.init()')).studio.ready);
  await waitFor(async()=> (await win.webContents.executeJavaScript('window.desktop.init()')).studio.credits==='42');
  assert.equal(await win.webContents.executeJavaScript('document.getElementById("creditsCount").textContent'),'42');
  await site.webContents.executeJavaScript('document.querySelector("#credits-fixture span").textContent="19"');
  await waitFor(async()=>await win.webContents.executeJavaScript('document.getElementById("creditsCount").textContent === "19"'));
  assert.equal(await site.webContents.executeJavaScript('document.documentElement.dataset.desktopStudio'),'true');
  assert.equal(await site.webContents.executeJavaScript('document.querySelectorAll("[data-desktop-panel]").length'),2);
  assert.equal(await site.webContents.executeJavaScript('document.getElementById("draft").value'),'Preserve this draft');
  await site.webContents.executeJavaScript('window.originalDraft=document.getElementById("draft")');
  assert.equal(await win.webContents.executeJavaScript("window.desktop.studio('https://example.com')"),false);
  await win.webContents.executeJavaScript("window.desktop.save({studioUI:false})");
  await waitFor(async()=>await site.webContents.executeJavaScript('document.documentElement.dataset.desktopStudio === "false"'));
  await win.webContents.executeJavaScript("window.desktop.save({studioUI:true})");
  await waitFor(async()=>await site.webContents.executeJavaScript('document.documentElement.dataset.desktopStudio === "true"'));
  assert.ok(await site.webContents.executeJavaScript('window.originalDraft===document.getElementById("draft") && originalDraft.value==="Preserve this draft"'),'Switching presentation must preserve actual form nodes and drafts');
  await site.webContents.executeJavaScript('document.getElementById("generate-fixture").click()');
  assert.equal(await site.webContents.executeJavaScript('document.body.dataset.generated'),'true');
  assert.equal(await win.webContents.executeJavaScript("window.desktop.studio('account')"),true);
  await waitFor(async()=>await site.webContents.executeJavaScript('document.body.dataset.accountOpened === "true"'));
  await win.webContents.executeJavaScript("window.desktop.studio('ai-lyrics-generator')");
  await waitFor(async()=> (await win.webContents.executeJavaScript('window.desktop.init()')).studio.route==='ai-lyrics-generator');
  await waitFor(async()=>await site.webContents.executeJavaScript('document.querySelectorAll("[data-desktop-region=information]").length===2'));
  assert.equal(await site.webContents.executeJavaScript('getComputedStyle(document.querySelector("[data-desktop-region=information]")).display'),'none');
  assert.equal(await site.webContents.executeJavaScript('document.getElementById("lyrics-fixture").value'),'Lyrics draft');
  const expected = await win.webContents.executeJavaScript("window.desktop.save({theme:'music',size:33,density:40,motion:false,analysis:false,autoColor:true,zoom:1.1})");
  assert.equal(expected.theme, 'music'); assert.equal(JSON.parse(fs.readFileSync(prefsFile)).size, 33);
  assert.equal(site.webContents.getZoomFactor(), 1.1);
  setPanel(true); assert.equal(site.getVisible(),false); assert.equal(site.getBounds().width, win.getContentSize()[0] - 260);
  setPanel(false); assert.equal(site.getVisible(),true); assert.equal(site.getBounds().width, win.getContentSize()[0] - 260);
  await win.webContents.executeJavaScript("document.getElementById('settings').click()");
  await new Promise(resolve => setTimeout(resolve,80));
  assert.equal(site.getVisible(),false);
  win.setContentSize(1120,760);
  await new Promise(resolve => setTimeout(resolve,80));
  assert.ok(await win.webContents.executeJavaScript("document.getElementById('panel').scrollWidth <= document.getElementById('panel').clientWidth"), 'Settings must fit the minimum supported window width');
  assert.equal(await win.webContents.executeJavaScript("getComputedStyle(document.querySelector('main')).visibility"),'hidden');
  await win.webContents.executeJavaScript("document.getElementById('close').click()");
  await new Promise(resolve => setTimeout(resolve,80));
  assert.equal(site.getVisible(),true);
  await win.webContents.executeJavaScript("window.desktop.action('maximize')"); assert.equal(win.isMaximized(),true);
  await win.webContents.executeJavaScript("window.desktop.action('maximize')"); assert.equal(win.isMaximized(),false);
  await win.webContents.executeJavaScript("document.querySelector('[data-theme=galaxy].theme').click()");
  await waitFor(async()=> (await win.webContents.executeJavaScript('window.desktop.init()')).prefs.theme==='galaxy');
  assert.equal(await win.webContents.executeJavaScript('document.body.dataset.theme'), 'galaxy');
  // Controlled 80 Hz signal verifies the analyser without a site account or external audio.
  await site.webContents.loadURL('data:text/html,<html><body><h1>Isolated audio fixture</h1></body></html>');
  const wav = Buffer.alloc(44 + 48000 * 4);
  wav.write('RIFF',0); wav.writeUInt32LE(wav.length-8,4); wav.write('WAVEfmt ',8); wav.writeUInt32LE(16,16);
  wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22); wav.writeUInt32LE(48000,24); wav.writeUInt32LE(96000,28);
  wav.writeUInt16LE(2,32); wav.writeUInt16LE(16,34); wav.write('data',36); wav.writeUInt32LE(wav.length-44,40);
  for(let i=0;i<96000;i++) wav.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*80/48000)*16000),44+i*2);
  await site.webContents.executeJavaScript(`document.body.innerHTML='<audio id="fixture" loop></audio>'; document.getElementById('fixture').src=${JSON.stringify('data:audio/wav;base64,'+wav.toString('base64'))}`);
  const samples = [];
  const listener = (event,value) => { if(event.sender===site.webContents) samples.push(value); };
  ipcMain.on('analysis:sample', listener);
  await win.webContents.executeJavaScript("window.desktop.save({theme:'music',analysis:true,motion:true})");
  await site.webContents.executeJavaScript("document.getElementById('fixture').play()",true);
  try { await waitFor(async()=>samples.some(s=>s.state==='active' && s.bass>.08)); } catch(error) { throw Error(String(error)+' '+JSON.stringify(await win.webContents.executeJavaScript('window.desktop.init()'))+' samples='+JSON.stringify(samples)); }
  ipcMain.removeListener('analysis:sample', listener);
  assert.ok(samples.some(s=>s.state==='active' && s.bass>.08), '80 Hz fixture should produce a measured bass signal: '+JSON.stringify(samples.map(s=>({state:s.state,bass:s.bass})))+' settings='+JSON.stringify(await win.webContents.executeJavaScript('window.desktop.init()')));
  await site.webContents.executeJavaScript("document.getElementById('fixture').pause()");
  await win.webContents.executeJavaScript("window.desktop.save({theme:'galaxy',analysis:false})");
  await site.webContents.loadURL('https://aimusic.so/fr/app');
  await site.webContents.executeJavaScript(`const track=document.createElement('audio');track.id='footer-fixture';track.loop=true;track.preload='auto';track.src=${JSON.stringify('data:audio/wav;base64,'+wav.toString('base64'))};document.body.appendChild(track);track.load();navigator.mediaSession.metadata=new MediaMetadata({title:'Piste de test',artist:'Atelier local'})`);
  await waitFor(async()=> (await win.webContents.executeJavaScript('window.desktop.init()')).player.available);
  try{await waitFor(async()=> (await win.webContents.executeJavaScript('window.desktop.init()')).player.duration>0);}catch(e){throw Error(String(e)+' '+JSON.stringify(await site.webContents.executeJavaScript('(()=>{const m=document.getElementById(\"footer-fixture\");return {duration:m.duration,readyState:m.readyState,networkState:m.networkState,error:m.error?.code,hasDataSource:m.src.startsWith(\"data:audio\")}})()')));} 
  assert.equal(await win.webContents.executeJavaScript('document.getElementById("trackTitle").textContent'),'Piste de test');
  assert.equal(await win.webContents.executeJavaScript("window.desktop.player({action:'arbitrary-command'})"),false);
  await win.webContents.executeJavaScript('document.getElementById("playerToggle").click()');
  await waitFor(async()=>await site.webContents.executeJavaScript('!document.getElementById("footer-fixture").paused'));
  await waitFor(async()=> (await win.webContents.executeJavaScript('window.desktop.init()')).player.playing);
  await win.webContents.executeJavaScript('document.getElementById("playerToggle").click()');
  await waitFor(async()=>await site.webContents.executeJavaScript('document.getElementById("footer-fixture").paused'));
  await win.webContents.executeJavaScript("window.desktop.player({action:'seek',value:1.2})");
  await waitFor(async()=>await site.webContents.executeJavaScript('Math.abs(document.getElementById("footer-fixture").currentTime-1.2)<.05'));
  await win.webContents.executeJavaScript("window.desktop.player({action:'volume',value:.35})");
  await waitFor(async()=>await site.webContents.executeJavaScript('Math.abs(document.getElementById("footer-fixture").volume-.35)<.01'));
  win.setContentSize(1120,760);
  await waitFor(async()=>await win.webContents.executeJavaScript('document.querySelector("footer").scrollWidth<=document.querySelector("footer").clientWidth'));
  assert.ok(await win.webContents.executeJavaScript('document.querySelector(".sidebarBottom").getBoundingClientRect().bottom<=document.querySelector("footer").getBoundingClientRect().top'),'Credits and account must remain above the player at minimum height');
  await site.webContents.executeJavaScript('document.getElementById("footer-fixture").remove()');
  await waitFor(async()=> !(await win.webContents.executeJavaScript('window.desktop.init()')).player.available);
  assert.equal(await win.webContents.executeJavaScript('document.getElementById("playerToggle").disabled'),true);
  await require('./extended.cjs').run({win,site,wav,waitFor});
  await site.webContents.session.protocol.unhandle('https');
  assert.equal(errors.length, 0, errors.join('\n'));
  fs.writeFileSync(path.join(__dirname, '..', 'verification.json'), JSON.stringify({ passed: true, checks: ['local isolated bridge', 'remote sandbox', 'child-frame loads keep studio visible', 'allowlisted studio navigation', 'live native form nodes and handlers preserved', 'original presentation toggle preserves drafts', 'SPA tool adaptation and marketing sections hidden', 'account control dispatch', 'live credit balance updates', 'footer player controls actual audio playback, seek and volume', 'footer player disables when media removed', 'sidebar and player fit minimum window', 'settings persistence', 'native view resizing', 'full settings screen at minimum width', 'custom maximize and restore controls', 'theme selection', '80 Hz synthetic audio measurement','local-only nickname and photo persistence','native repeat, rewind, forward, favorite, share and download dispatch','album palette and static artwork','official theme','cross-origin CORS audio analysis','10-band equalizer response and bypass','reverb, echo, stereo and auto-pan configuration'], realSiteAudioVerified: false, realSiteGenerationVerified: false, authenticatedLibraryVerified: false, electron: process.versions.electron }, null, 2));
  console.log('Electron smoke checks passed');
}
module.exports = { run };
