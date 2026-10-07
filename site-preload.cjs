'use strict';
// No bridge is exposed to the website. Only bounded player state and palette data leave this preload.
const { ipcRenderer } = require('electron');
ipcRenderer.on('appearance:config', (_, config) => {
  if (['aimusic.so', 'www.aimusic.so'].includes(location.hostname) && ['galaxy','music','night','light','official'].includes(config.theme)) {
    document.documentElement.dataset.desktopTheme = config.theme;
    studioEnabled = config.studioUI !== false;
    refreshStudio();
  }
});
// Keep React's actual controls and their handlers. Tag layout regions without
// cloning or reparenting nodes, which would break forms and portal lifecycles.
const studioRoutes = ['app','library','ai-lyrics-generator','sound-effect','vocal-remover','stem-splitter'];
let studioEnabled = true, studioTimer, studioSignature = '';
function routeLinks() {
  return [...document.querySelectorAll('.app-sidebar-rail a[data-key]')].filter(link => {
    try { const url = new URL(link.href); return url.origin === location.origin && studioRoutes.includes(link.dataset.key) && url.pathname.split('/').filter(Boolean).at(-1) === link.dataset.key; } catch { return false; }
  });
}
function accountControl() { return document.querySelector('.app-sidebar-rail > div > div:first-child > div:nth-child(3) button'); }
function creditControl() { return [...document.querySelectorAll('.app-sidebar-rail button')].find(button => /cr[ée]dits/i.test(button.textContent)) || document.querySelector('.app-sidebar-rail > div > div:last-child > div:first-child button:has(.text-right)'); }
function tag(element, key, value) { if (element && element.dataset[key] !== value) element.dataset[key] = value; }
function refreshStudio() {
  if (!['aimusic.so','www.aimusic.so'].includes(location.hostname)) return;
  const links = routeLinks();
  const route = links.find(link => link.getAttribute('aria-selected') === 'true')?.dataset.key || location.pathname.split('/').filter(Boolean).at(-1);
  const ready = links.length > 0 && !!document.querySelector('.app-sidebar-rail');
  tag(document.documentElement, 'desktopStudio', studioEnabled && ready ? 'true' : 'false');
  tag(document.documentElement, 'desktopPage', studioRoutes.includes(route) ? route : 'other');
  if (route === 'app') {
    const root = document.querySelector('#app > div');
    if (root?.children.length === 2 && root.children[0].querySelector('#custom-mode') && root.children[1].querySelector('input')) {
      tag(root, 'desktopGrid', 'true');
      tag(root.children[0], 'desktopPanel', 'create');
      tag(root.children[1], 'desktopPanel', 'results');
    }
  }
  const workspace = document.querySelector('.app-sidebar-rail')?.nextElementSibling;
  if (route === 'sound-effect') {
    const root = workspace?.querySelector(':scope > section > div');
    if (root?.children.length === 2 && root.children[0].querySelector('textarea')) {
      tag(root, 'desktopGrid', 'true');
      tag(root.children[0], 'desktopPanel', 'create');
      tag(root.children[1], 'desktopPanel', 'results');
    }
  }
  if (['ai-lyrics-generator','vocal-remover','stem-splitter'].includes(route)) {
    const root = workspace?.querySelector(':scope > section');
    const scroll = root && [...root.children].find(child => child.tagName === 'DIV' && child.querySelector('section'));
    const active = scroll && [...scroll.children].find(child => child.querySelector('textarea') || child.classList.contains('min-h-600px'));
    if (active) {
      tag(root, 'desktopTool', 'true'); tag(scroll, 'desktopToolScroll', 'true');
      for (const child of scroll.children) tag(child, 'desktopRegion', child === active ? 'tool' : 'information');
    }
  }
  const creditButton = creditControl();
  const creditText = creditButton?.querySelector('.text-right')?.textContent.trim() || '';
  const state = { ready, route, routes: links.map(link => link.dataset.key), account: !!accountControl(), hasCredits: !!creditButton, credits: /^[\d\s.,]+$/.test(creditText) && creditText.length <= 24 ? creditText : null };
  const signature = JSON.stringify(state);
  if (signature !== studioSignature) { studioSignature = signature; ipcRenderer.send('studio:state', state); }
}
ipcRenderer.on('studio:command', (_event, command) => {
  if (!['aimusic.so','www.aimusic.so'].includes(location.hostname)) return;
  if (command === 'account') accountControl()?.click();
  else if (command === 'credits') creditControl()?.click();
  else if (studioRoutes.includes(command)) routeLinks().find(link => link.dataset.key === command)?.click();
});
window.addEventListener('DOMContentLoaded', () => {
  refreshStudio();
  const observer = new MutationObserver(() => { if (!studioTimer) studioTimer = setTimeout(() => { studioTimer = null; refreshStudio(); },90); });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['aria-selected','data-key'] });
}, { once: true });
let playbackMedia = null, playbackSignature = '', lastPlaybackSent = 0;
let cover = { primary:null, secondary:null, thumbnail:null }, coverSource = '', coverGeneration = 0;
function prepareAudio() {
  // React assigns src before the browser's resource-selection task. Opt into
  // the CDN's normal CORS response before loading, so captureStream can expose
  // audio tracks. No headers, permissions or certificate checks are bypassed.
  for (const media of document.querySelectorAll('.rhap_container audio')) {
    if (!media.hasAttribute('crossorigin')) media.crossOrigin = 'anonymous';
  }
}
function findPlaybackMedia() {
  const all = [...document.querySelectorAll('audio')].filter(media => media.currentSrc || media.src || media.querySelector('source'));
  return all.find(media => !media.paused && !media.ended) || (playbackMedia?.isConnected && all.includes(playbackMedia) ? playbackMedia : all.find(media => media.closest('.rhap_container')) || all.at(-1)) || null;
}
function nativePlayerControls(media = playbackMedia) {
  const player = media?.closest('.rhap_container'), bar = player?.parentElement;
  if (!player || !bar) return {};
  tag(bar,'desktopNativePlayer','true');
  const extras = [...bar.children].slice([...bar.children].indexOf(player)+1);
  const favorite = extras[0]?.querySelector('svg'), share = extras[1], download = extras[2];
  const repeat = player.querySelector('.rhap_progress-section button');
  return { repeat, rewind:player.querySelector('.rhap_rewind-button'), forward:player.querySelector('.rhap_forward-button'), favorite, share, download };
}
function coverElement() {
  const detail = document.querySelector('#app [data-desktop-panel=results] > div > div:nth-child(2)');
  return [...(detail?.querySelectorAll('img[alt="cover"]') || [])].find(image => {
    const src=image.currentSrc || image.src; return src && !/\/images\/(plate|expires|bg_)/i.test(src);
  });
}
function updateCover() {
  const element = coverElement();
  if(element){tag(element,'desktopArtwork','true');tag(element.parentElement,'desktopArtworkFrame','true');tag(element.parentElement.parentElement,'desktopArtworkGroup','true');}
  const src = navigator.mediaSession?.metadata?.artwork?.[0]?.src || element?.currentSrc || element?.src || '';
  if (src === coverSource) return;
  coverSource = src; const generation=++coverGeneration;
  cover = {primary:null,secondary:null,thumbnail:null};
  if (!src) return;
  const image=new Image(); image.crossOrigin='anonymous';
  image.onload=()=>{
    if(generation!==coverGeneration)return;
    try {
      const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,64,64);
      const pixels=ctx.getImageData(0,0,64,64).data, buckets=new Map();
      for(let i=0;i<pixels.length;i+=4){
        const rgb=[pixels[i],pixels[i+1],pixels[i+2]], hi=Math.max(...rgb),lo=Math.min(...rgb);
        if(pixels[i+3]<128||hi<48||lo>230)continue;
        const key=rgb.map(v=>Math.round(v/32)*32).join(',');
        const bucket=buckets.get(key)||{rgb:[0,0,0],count:0,weight:0};
        bucket.count++;bucket.weight+=1+(hi-lo)/80;rgb.forEach((v,k)=>bucket.rgb[k]+=v);buckets.set(key,bucket);
      }
      const ranked=[...buckets.values()].sort((a,b)=>b.weight-a.weight).map(b=>b.rgb.map(v=>Math.round(v/b.count)));
      const primary=ranked[0]||[140,170,160];
      const secondary=ranked.find(rgb=>rgb.reduce((n,v,i)=>n+(v-primary[i])**2,0)>6500)||primary.map(v=>Math.round(v*.65+255*.35));
      const hex=rgb=>'#'+rgb.map(v=>Math.min(255,v).toString(16).padStart(2,'0')).join('');
      cover={primary:hex(primary),secondary:hex(secondary),thumbnail:canvas.toDataURL('image/png')};
      document.documentElement.style.setProperty('--album-primary',cover.primary);
      document.documentElement.style.setProperty('--album-secondary',cover.secondary);
      playbackSignature='';publishPlayback();
    } catch { /* Canvas retains the service/CDN's normal origin protections. */ }
  };
  image.onerror=()=>{if(generation===coverGeneration){cover={primary:null,secondary:null,thumbnail:null};requestCoverCapture();}};
  image.src=src;
}
let lastCoverRequest=0;
function requestCoverCapture(){
  const image=coverElement();if(!image?.complete||cover.primary||Date.now()-lastCoverRequest<1200)return;
  const rect=image.getBoundingClientRect();if(rect.width<8||rect.height<8)return;
  lastCoverRequest=Date.now();ipcRenderer.send('cover:sample',{key:coverGeneration,x:rect.left,y:rect.top,width:rect.width,height:rect.height});
}
ipcRenderer.on('cover:palette',(_event,value)=>{
  if(value?.key!==coverGeneration)return;
  cover={primary:value.primary,secondary:value.secondary,thumbnail:value.thumbnail};
  document.documentElement.style.setProperty('--album-primary',cover.primary);document.documentElement.style.setProperty('--album-secondary',cover.secondary);
  playbackSignature='';publishPlayback();
});
function publishPlayback() {
  playbackMedia=findPlaybackMedia(); updateCover(); requestCoverCapture();
  const media=playbackMedia, metadata=navigator.mediaSession?.metadata;
  tag(document.documentElement,'desktopPlayer',media?.closest('.rhap_container')?'true':'false');
  const controls=nativePlayerControls(media);
  const nativeActions=Object.fromEntries(['repeat','rewind','forward','favorite','share','download'].map(key=>[key,!!controls[key]]));
  const repeatIcon=controls.repeat?.querySelector('svg')?.getAttribute('class')||'';
  const repeatMode=repeatIcon.includes('teenyicons')?'list':repeatIcon.includes('streamline-flex')?'single':repeatIcon.includes('fontisto')?'random':'unknown';
  const selectedTitle=media?.closest('.rhap_container')?document.querySelector('#app [data-desktop-panel=results] > div > div:nth-child(2) p.line-clamp-1')?.textContent.trim():'';
  const state={available:!!media,playing:!!media&&!media.paused&&!media.ended,title:media?String(metadata?.title||selectedTitle||'Piste en cours').slice(0,120):'',artist:media?String(metadata?.artist||'AI Music').slice(0,80):'',position:Number.isFinite(media?.currentTime)?media.currentTime:0,duration:Number.isFinite(media?.duration)&&media.duration>0?media.duration:0,volume:media?.volume??1,muted:media?.muted===true,nativeActions,repeatMode,coverKey:coverGeneration,collected:!!controls.favorite?.classList.contains('fill-rose-500'),...cover};
  const signature=JSON.stringify(state);
  if(signature!==playbackSignature&&Date.now()-lastPlaybackSent>=180){playbackSignature=signature;lastPlaybackSent=Date.now();ipcRenderer.send('player:state',state);}
}
ipcRenderer.on('player:command',async(_event,command)=>{
  if(!['aimusic.so','www.aimusic.so'].includes(location.hostname)||!command||typeof command!=='object')return;
  const media=findPlaybackMedia();if(!media)return;
  try{
    if(command.action==='toggle'){if(media.paused||media.ended)await media.play();else media.pause();}
    else if(command.action==='seek'&&Number.isFinite(command.value)&&Number.isFinite(media.duration)&&media.duration>0)media.currentTime=Math.max(0,Math.min(media.duration,command.value));
    else if(command.action==='volume'&&Number.isFinite(command.value)){media.volume=Math.max(0,Math.min(1,command.value));media.muted=false;}
    else if(['repeat','rewind','forward','favorite','share','download'].includes(command.action)){
      const control=nativePlayerControls(media)[command.action]; if(control){ if(typeof control.click==='function')control.click(); else control.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window})); }
      if(command.action==='download')setTimeout(()=>{
        const popup=[...document.querySelectorAll('[data-radix-popper-content-wrapper]')].find(el=>/MP3|WAV|MP4/.test(el.textContent));
        if(popup)tag(popup,'desktopPlayerMenu','download');
      },60);
    }
  }catch{/* Native errors and protected streams retain their normal handling. */}
  playbackSignature='';publishPlayback();
});
window.addEventListener('DOMContentLoaded',()=>{
  prepareAudio();publishPlayback();
  new MutationObserver(prepareAudio).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
  for(const event of ['play','pause','timeupdate','loadedmetadata','durationchange','volumechange','emptied','ended'])document.addEventListener(event,publishPlayback,true);
  setInterval(publishPlayback,500);
},{once:true});
const processedGraphs=new WeakMap();let rackCounter=0;
globalThis.audioRackDiagnostics=()=>{const media=findPlaybackMedia(),rack=media&&processedGraphs.get(media);if(!rack)return null;const frequency=new Float32Array([62]),magnitude=new Float32Array(1),phase=new Float32Array(1);rack.filters[1].getFrequencyResponse(frequency,magnitude,phase);return {id:rack.id,gains:rack.filters.map(filter=>filter.gain.value),gain62:magnitude[0],dry:rack.dry.gain.value,wet:rack.wet.gain.value,echoTime:rack.delay.delayTime.value,reverbLength:rack.reverb.buffer.length,panRate:rack.oscillator.frequency.value};};
let eq={enabled:false,bypass:false,limiter:true,bands:Array(10).fill(0),preamp:0,width:1,pan:0,autoPan:false,panRate:.28,reverb:0,echo:0,echoTime:.32}, eqState='off';
class AudioRack {
  constructor(media){
    const context=new AudioContext();this.context=context;this.media=media;this.id=++rackCounter;
    this.source=context.createMediaElementSource(media);this.analyser=context.createAnalyser();this.analyser.fftSize=2048;this.analyser.smoothingTimeConstant=.5;
    this.source.connect(this.analyser);this.dry=context.createGain();this.analyser.connect(this.dry);this.dry.connect(context.destination);
    let previous=this.analyser;
    this.filters=[31,62,125,250,500,1000,2000,4000,8000,16000].map(frequency=>{const filter=context.createBiquadFilter();filter.type='peaking';filter.frequency.value=frequency;filter.Q.value=1.15;previous.connect(filter);previous=filter;return filter;});
    this.preamp=context.createGain();this.preamp.channelCount=2;this.preamp.channelCountMode='explicit';previous.connect(this.preamp);
    const splitter=context.createChannelSplitter(2),merger=context.createChannelMerger(2);this.preamp.connect(splitter);this.matrix=[];
    for(let input=0;input<2;input++)for(let output=0;output<2;output++){const gain=context.createGain();splitter.connect(gain,input);gain.connect(merger,0,output);this.matrix.push({input,output,gain});}
    this.pan=context.createStereoPanner();merger.connect(this.pan);this.bus=context.createGain();this.pan.connect(this.bus);
    this.reverb=context.createConvolver();const length=Math.floor(context.sampleRate*1.6),impulse=context.createBuffer(2,length,context.sampleRate);
    for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);let seed=173+channel*97;for(let i=0;i<length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/2147483648-1)*Math.pow(1-i/length,2.7);}}
    this.reverb.buffer=impulse;this.reverbGain=context.createGain();this.pan.connect(this.reverb);this.reverb.connect(this.reverbGain);this.reverbGain.connect(this.bus);
    this.delay=context.createDelay(1);this.echoGain=context.createGain();this.feedback=context.createGain();this.pan.connect(this.delay);this.delay.connect(this.echoGain);this.echoGain.connect(this.bus);this.delay.connect(this.feedback);this.feedback.connect(this.delay);
    this.limiter=context.createDynamicsCompressor();this.bus.connect(this.limiter);this.wet=context.createGain();this.wet.gain.value=0;this.limiter.connect(this.wet);this.wet.connect(context.destination);
    this.oscillator=context.createOscillator();this.oscillator.type='sine';this.panAmount=context.createGain();this.panAmount.gain.value=0;this.oscillator.connect(this.panAmount);this.panAmount.connect(this.pan.pan);this.oscillator.start();
    this.bins=new Uint8Array(this.analyser.frequencyBinCount);this.apply(eq);
  }
  apply(config){
    const t=this.context.currentTime,smooth=(param,value)=>param.setTargetAtTime(value,t,.025);
    const active=config.enabled&&!config.bypass;
    smooth(this.dry.gain,active?0:1);smooth(this.wet.gain,active?1:0);
    this.filters.forEach((filter,index)=>smooth(filter.gain,config.bands[index]||0));
    const safety=Math.max(0,...config.bands)*.5; // leave headroom for boosts
    smooth(this.preamp.gain,Math.pow(10,(config.preamp-safety)/20));
    for(const cell of this.matrix)smooth(cell.gain.gain,cell.input===cell.output?(1+config.width)/2:(1-config.width)/2);
    smooth(this.pan.pan,config.pan);smooth(this.panAmount.gain,active && config.autoPan ? .8 : 0);smooth(this.oscillator.frequency,config.panRate);
    smooth(this.reverbGain.gain,config.reverb);smooth(this.echoGain.gain,config.echo);smooth(this.feedback.gain,Math.min(.45,config.echo*.8));smooth(this.delay.delayTime,config.echoTime);
    this.limiter.threshold.value=config.limiter?-1:0;this.limiter.knee.value=0;this.limiter.ratio.value=config.limiter?20:1;this.limiter.attack.value=.003;this.limiter.release.value=.1;
  }
}
async function ensureRack(media){
  let rack=processedGraphs.get(media);if(rack){rack.apply(eq);await rack.context.resume();return rack;}
  const url=new URL(media.currentSrc||media.src,location.href);
  if(url.origin!==location.origin&&!['data:','blob:'].includes(url.protocol)&&media.crossOrigin!=='anonymous')return null;
  try{rack=new AudioRack(media);processedGraphs.set(media,rack);await rack.context.resume();return rack;}catch{return null;}
}
let enabled = false, autoColor = true, graph = null, selected = null, previousBass = 0, lastImpact = 0, color = null, artwork = '', retryAt = 0;
function stop() {
  if (graph) { graph.stream.getTracks().forEach(t => t.stop()); void graph.context.close().catch(() => {}); graph = null; }
  selected = null; previousBass = 0;
}
ipcRenderer.on('analysis:config', (_, config) => {
  enabled = config.enabled === true; autoColor = config.autoColor === true;
  if(config.eq&&typeof config.eq==='object'){eq=config.eq;const media=findPlaybackMedia();const rack=media&&processedGraphs.get(media);if(rack)rack.apply(eq);}
  if (!enabled) { stop(); color = null; artwork = ''; }
  if (!autoColor) { color = null; artwork = ''; }
});
function coverColor() { updateCover(); color = autoColor ? cover.primary : null; }
async function sample() {
  let state = 'disabled', bass = 0, impact = false, spectrum=[];
  const rackMedia=findPlaybackMedia();let rack=rackMedia&&processedGraphs.get(rackMedia);
  if(eq.enabled&&rackMedia&&rackMedia.readyState>=2)rack=await ensureRack(rackMedia);
  eqState=eq.enabled?(rack?(eq.bypass?'bypass':'active'):rackMedia?'unavailable':'waiting'):'off';
  coverColor();
  if (enabled || eq.enabled) {
    const media = findPlaybackMedia();
    const playing = media && !media.paused && !media.ended && media.readyState >= 2;
    if (!playing) { stop(); state = 'waiting'; }
    else {
      if (media !== selected) { stop(); selected = media; retryAt = 0; }
      if (!rack && !graph && Date.now() > retryAt) {
        retryAt = Date.now() + 4000;
        let context, stream;
        try {
          if (!media.captureStream) throw Error('capture unavailable');
          stream = media.captureStream();
          if (!stream.getAudioTracks().length) await new Promise(resolve=>{const timeout=setTimeout(resolve,800);stream.addEventListener('addtrack',()=>{clearTimeout(timeout);resolve();},{once:true});});
          if (!stream.getAudioTracks().length) throw Error('no accessible audio track');
          context = new AudioContext();
          const source = context.createMediaStreamSource(stream), analyser = context.createAnalyser(), mute = context.createGain();
          analyser.fftSize = 2048; analyser.smoothingTimeConstant = .65; mute.gain.value = 0;
          source.connect(analyser); analyser.connect(mute); mute.connect(context.destination);
          await context.resume();
          if (!enabled || selected !== media) { stream.getTracks().forEach(t => t.stop()); await context.close(); }
          else graph = { context, stream, analyser, bins: new Uint8Array(analyser.frequencyBinCount) };
        } catch { if (stream) stream.getTracks().forEach(t => t.stop()); if (context) void context.close().catch(() => {}); }
      }
      if(!rack&&!graph&&media.crossOrigin==='anonymous')rack=await ensureRack(media);
      state = 'unavailable';
      const measurement=rack||graph;
      if (measurement && measurement.context.state === 'running') {
        measurement.analyser.getByteFrequencyData(measurement.bins);
        const hz = measurement.context.sampleRate / measurement.analyser.fftSize;
        const lo = Math.max(1, Math.ceil(35 / hz)), hi = Math.min(measurement.bins.length - 1, Math.floor(180 / hz));
        for (let i = lo; i <= hi; i++) bass += measurement.bins[i] / 255;
        bass /= Math.max(1, hi - lo + 1);
        state = measurement.bins.some(v => v > 3) ? 'active' : 'silent';
        spectrum=Array.from({length:64},(_,i)=>measurement.bins[Math.min(measurement.bins.length-1,Math.round(32*Math.pow(600,i/63)/hz))]/255);
        impact = bass > .24 && bass - previousBass > .075 && Date.now() - lastImpact > 220;
        if (impact) lastImpact = Date.now();
        previousBass = bass;
      }
    }
  }
  ipcRenderer.send('analysis:sample', { state, bass, impact, color, spectrum, eqState });
  setTimeout(sample, enabled || eq.enabled ? 65 : 1000);
}
window.addEventListener('pagehide', stop);
window.addEventListener('DOMContentLoaded', sample, { once: true });

