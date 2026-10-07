const assert=require('node:assert/strict');
async function run({win,site,wav,waitFor}){
  const photo=await win.webContents.executeJavaScript("(()=>{const c=document.createElement('canvas');c.width=c.height=64;c.getContext('2d').fillStyle='#247cdd';c.getContext('2d').fillRect(0,0,64,64);return c.toDataURL()})()");
  await win.webContents.executeJavaScript(`window.desktop.profile({nickname:'Atelier local',photo:${JSON.stringify(photo)}})`);
  assert.equal((await win.webContents.executeJavaScript('window.desktop.init()')).profile.nickname,'Atelier local');
  assert.ok((await win.webContents.executeJavaScript('window.desktop.init()')).profile.photo.startsWith('data:image/png;base64,'));
  assert.equal(await site.webContents.executeJavaScript('typeof window.desktop'),'undefined');
  await win.webContents.executeJavaScript('document.getElementById("account").click()');
  await waitFor(async()=>await win.webContents.executeJavaScript('document.getElementById("profilePanel").hidden===false'));
  assert.equal(site.getVisible(),false);
  assert.equal(await win.webContents.executeJavaScript('document.getElementById("nickname").value'),'Atelier local');
  await win.webContents.executeJavaScript('document.getElementById("closeProfile").click();document.getElementById("settings").click()');
  await waitFor(async()=>await win.webContents.executeJavaScript('document.getElementById("panel").hidden===false'));
  await win.webContents.executeJavaScript('document.querySelector(".theme[data-theme=official]").click()');
  await waitFor(async()=>(await win.webContents.executeJavaScript('window.desktop.init()')).prefs.theme==='official');
  assert.equal(await win.webContents.executeJavaScript('getComputedStyle(document.body).getPropertyValue("--accent").trim()'),'#10b981');
  assert.equal(await win.webContents.executeJavaScript('document.querySelectorAll("[data-band]").length'),10);
  assert.equal(await win.webContents.executeJavaScript('document.getElementById("back").closest(".commandCard")!==null'),true);
  await win.webContents.executeJavaScript('document.getElementById("close").click()');
  const cover=await win.webContents.executeJavaScript("(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#fa286e';x.fillRect(0,0,40,64);x.fillStyle='#206fe0';x.fillRect(40,0,24,64);return c.toDataURL()})()");
  const html=`<!doctype html><meta charset="utf-8"><main><div><div class="app-sidebar-rail"><div><div><div>Brand</div><span></span><div><button>Account</button></div></div><div><nav><a data-key="app" aria-selected="true" href="/fr/app">Create</a></nav></div><div><button>Crédits<span class="text-right">19</span></button></div></div></div><div><section id="app"><div><div><button id="custom-mode">Custom</button><textarea></textarea></div><div><div><div><input></div><div><div class="h-20"><div>Tip</div><div class="rhap_container"><audio id="eq-fixture" loop preload="auto" src="https://cdn.fixture.test/tone.wav"></audio><div class="rhap_progress-section"><button data-action="repeat">Repeat</button></div><button class="rhap_rewind-button" data-action="rewind">Rewind</button><button class="rhap_forward-button" data-action="forward">Forward</button></div><div><svg data-action="favorite"></svg></div><button data-action="share">Share</button><button data-action="download">Download</button></div></div></div><div><div><div class="animate-spin-slow"><img alt="cover" src="${cover}"></div></div><p class="line-clamp-1">Album de test</p></div></div></div></section></div></div></main><script>document.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>document.body.dataset.lastAction=button.dataset.action)</script>`;
  await site.webContents.session.protocol.unhandle('https');
  await site.webContents.session.protocol.handle('https',request=>request.url.includes('cdn.fixture.test')?new Response(wav,{headers:{'content-type':'audio/wav','access-control-allow-origin':'*'}}):new Response(html,{headers:{'content-type':'text/html; charset=utf-8'}}));
  await site.webContents.loadURL('https://aimusic.so/fr/app');
  try{await waitFor(async()=>(await win.webContents.executeJavaScript('window.desktop.init()')).player.duration>0);}catch(error){throw Error(String(error)+' '+JSON.stringify(await site.webContents.executeJavaScript('(()=>{const m=document.getElementById(\"eq-fixture\");return {readyState:m.readyState,duration:m.duration,networkState:m.networkState,error:m.error?.code,cors:m.crossOrigin,src:m.src}})()')));} 
  assert.equal(await site.webContents.executeJavaScript('document.getElementById("eq-fixture").crossOrigin'),'anonymous');
  await site.webContents.executeJavaScript('(()=>{const outer=document.querySelector(\"[data-desktop-panel=results]\");if(outer.children.length===2){const row=document.createElement(\"div\");while(outer.firstChild)row.appendChild(outer.firstChild);outer.appendChild(row);}})()');
  await waitFor(async()=>(await win.webContents.executeJavaScript('window.desktop.init()')).player.primary!==null);
  const palette=(await win.webContents.executeJavaScript('window.desktop.init()')).player;
  assert.ok(/^#[0-9a-f]{6}$/i.test(palette.primary));assert.ok(palette.thumbnail.startsWith('data:image/png;base64,'));
  assert.ok(await site.webContents.executeJavaScript('document.querySelector("img[data-desktop-artwork]")!==null'));
  assert.equal(await site.webContents.executeJavaScript('getComputedStyle(document.querySelector("[data-desktop-artwork-frame]")).animationName'),'none');
  for(const action of ['repeat','rewind','forward','favorite','share','download']){
    assert.equal(await win.webContents.executeJavaScript(`window.desktop.player({action:${JSON.stringify(action)}})`),true);
    await waitFor(async()=>await site.webContents.executeJavaScript(`document.body.dataset.lastAction===${JSON.stringify(action)}`));
  }
  await win.webContents.executeJavaScript("window.desktop.save({...window.defaultEqualizer(),theme:'music',analysis:true,motion:true,autoColor:true,eq:{...window.defaultEqualizer(),enabled:true,bands:[0,8,0,0,0,0,0,0,0,0],reverb:.2,echo:.15,echoTime:.4,autoPan:true,panRate:.5}})");
  await site.webContents.executeJavaScript('document.getElementById("eq-fixture").play()',true);
  await waitFor(async()=>{const state=await win.webContents.executeJavaScript('window.desktop.init()');return state.audio.state==='active'&&state.audio.bass>.08&&state.audio.eqState==='active';});
  const inspect=()=>site.webContents.executeJavaScriptInIsolatedWorld(999,[{code:'globalThis.audioRackDiagnostics()'}]);
  await waitFor(async()=>{const rack=await inspect();return rack?.gains[1]>7.8&&Math.abs(rack.panRate-.5)<.01&&Math.abs(rack.echoTime-.4)<.01;});
  const processed=await inspect();assert.ok(processed.gain62>2,'A +8 dB band must change the real filter response');assert.ok(processed.wet>.9&&processed.dry<.1);assert.ok(processed.reverbLength>10000);assert.ok(Math.abs(processed.echoTime-.4)<.01);assert.ok(Math.abs(processed.panRate-.5)<.01);
  await win.webContents.executeJavaScript("window.desktop.init().then(state=>window.desktop.save({...state.prefs,eq:{...state.prefs.eq,bypass:true}}))");
  await waitFor(async()=> (await inspect())?.dry>.95);
  const bypass=await inspect();assert.equal(bypass.id,processed.id);assert.ok(bypass.wet<.05,'A/B bypass must return the original signal');
  await site.webContents.executeJavaScript('document.getElementById("eq-fixture").pause()');
  await win.webContents.executeJavaScript("window.desktop.save({theme:'galaxy',analysis:false,eq:window.defaultEqualizer()})");
}
module.exports={run};

