'use strict';
const $ = id => document.getElementById(id);
const defaults = { theme: 'galaxy', size: 20, density: 55, motion: true, analysis: false, autoColor: true, zoom: 1, studioUI: true, eq:window.defaultEqualizer(), eqPresets:[] };
const pages = {
  app: ['CRÉATION MUSICALE', 'Donnez vie à vos idées.'],
  library: ['VOTRE COLLECTION', 'Toute votre musique.'],
  'ai-lyrics-generator': ['ATELIER D’ÉCRITURE', 'Trouvez les mots justes.'],
  'sound-effect': ['DESIGN SONORE', 'Imaginez un nouveau son.'],
  'vocal-remover': ['ATELIER AUDIO', 'Explorez la voix.'],
  'stem-splitter': ['ATELIER AUDIO', 'Décomposez votre musique.']
};
let studio = { route: 'app', ready: false, routes: [], account: false };
let playback = { available: false, playing: false, duration: 0, position: 0, volume: 1, muted: false }, seeking = false, adjustingVolume = false;
function timeLabel(value) { const seconds=Math.floor(Math.max(0,value||0)); return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0'); }
function playbackState(value) {
  playback = value;
  $('trackTitle').textContent = value.available ? value.title || 'Piste en cours' : 'Aucune piste chargée';
  $('trackArtist').textContent = value.available ? value.artist || 'AI Music' : 'Choisissez un morceau dans le studio';
  $('playerToggle').disabled = !value.available; $('playerToggle').querySelector('use').setAttribute('href',value.playing?'#i-pause':'#i-play');
  $('trackCover').src=value.thumbnail||'../assets/service-logo.svg';
  $('trackCover').classList.toggle('empty',!value.thumbnail);
  for(const [id,action] of Object.entries({playerRepeat:'repeat',playerRewind:'rewind',playerForward:'forward',playerFavorite:'favorite',playerShare:'share',playerDownload:'download'}))$(id).disabled=!value.available||!value.nativeActions?.[action];
  $('playerFavorite').classList.toggle('collected',value.collected===true);
  $('playerFavorite').setAttribute('aria-pressed',String(value.collected===true));
  $('playerRepeat').title=({list:'Boucle de la liste',single:'Répéter ce morceau',random:'Lecture aléatoire'}[value.repeatMode])||'Mode de lecture';
  $('playerRepeat').dataset.mode=value.repeatMode||'unknown';
  $('playerToggle').setAttribute('aria-label',value.playing ? 'Mettre la musique en pause' : 'Lire la musique');
  $('playerProgress').disabled = !value.available || !value.duration; $('playerProgress').max = value.duration || 1;
  if (!seeking) { $('playerProgress').value = value.position; $('playerProgress').style.setProperty('--progress',Math.min(100,100*value.position/(value.duration||1))+'%'); $('positionTime').textContent = timeLabel(value.position); }
  $('durationTime').textContent = timeLabel(value.duration);
  $('playerVolume').disabled = !value.available;
  if (!adjustingVolume) $('playerVolume').value = value.muted ? 0 : value.volume;
}
function workspaceTitle() {
  const title = profileOpened ? ['PROFIL LOCAL','Votre espace personnel.'] : opened ? ['VOTRE AMBIANCE', 'Un studio à votre image.'] : pages[studio.route] || pages.app;
  $('workspaceEyebrow').textContent = title[0]; $('workspaceHeading').textContent = title[1];
}
let prefs = { ...defaults }, audio = { state: 'disabled', bass: 0, impact: false, color: null }, opened = false, saveTimer;
const descriptions = {
  disabled: ['Analyse audio désactivée', 'Analyse désactivée', 'Activez l’analyse pour essayer la réaction aux basses.'],
  waiting: ['En attente du lecteur du site', 'En attente de musique', 'Lancez une chanson dans le lecteur natif. Les étoiles restent immobiles.'],
  unavailable: ['Audio non accessible · étoiles immobiles', 'Audio non accessible', 'Le lecteur ou les règles du site empêchent l’analyse. La lecture originale reste indépendante.'],
  silent: ['Aucun signal mesurable · étoiles immobiles', 'Aucun signal mesurable', 'Le flux est silencieux ou protégé. Aucun mouvement artificiel n’est ajouté.'],
  active: ['Basses mesurées dans le lecteur', 'Analyse active', 'Les basses déplacent les étoiles. Les impacts détectés changent leur direction.']
};
function applyPrefs() {
  document.body.dataset.theme = prefs.theme;
  $('sourceLayout').setAttribute('aria-pressed', String(!prefs.studioUI));
  $('sourceLayout').textContent = prefs.studioUI ? 'Vue du service' : 'Vue du studio';
  $('sourceLayout').title = prefs.studioUI ? 'Afficher la présentation originale du service' : 'Afficher la nouvelle interface du studio';
  document.querySelectorAll('.theme').forEach(button => { const selected = button.dataset.theme === prefs.theme; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); });
  for (const key of ['size', 'density', 'motion', 'analysis', 'autoColor', 'zoom']) {
    if (['motion', 'analysis', 'autoColor'].includes(key)) $(key).checked = prefs[key];
    else $(key).value = key === 'zoom' ? Math.round(prefs[key] * 100) : prefs[key];
  }
  $('sizeValue').value = prefs.size + ' px'; $('densityValue').value = prefs.density;
  $('zoomValue').value = Math.round(prefs.zoom * 100) + ' %';
  $('themeName').textContent = ({ galaxy: 'Galaxy', music: 'Musique', night: 'Nuit', light: 'Clair', official:'Officiel' }[prefs.theme]);
  applyEqualizer(); rebuildStars();
}
function queueSave() {
  applyPrefs(); $('saved').textContent = 'Enregistrement…'; clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => { try { prefs = await window.desktop.save(prefs); $('saved').textContent = 'Paramètres enregistrés sur cet ordinateur.'; } catch { $('saved').textContent = 'Impossible d’enregistrer les paramètres.'; } }, 220);
}
async function panel(open) {
  if(open){profileOpened=false;$('profilePanel').hidden=true;}
  opened = open; $('panel').hidden = !open; document.body.classList.toggle('panel', open||profileOpened); $('settings').setAttribute('aria-expanded', String(open));
  workspaceTitle();
  await window.desktop.settings(open);
  if (open) void updateCache();
  if (open) $('close').focus(); else $('settings').focus();
}
for (const action of ['back', 'forward', 'reload', 'home', 'browser','minimize','maximize','close-window']) $(action).addEventListener('click', () => { if (opened && ['home','back','forward'].includes(action)) void panel(false); void window.desktop.action(action); });
$('settings').addEventListener('click', () => panel(!opened)); $('settingsShortcut').addEventListener('click',()=>panel(!opened)); $('close').addEventListener('click', () => panel(false));
$('sourceLayout').addEventListener('click', () => { prefs.studioUI = !prefs.studioUI; queueSave(); });
document.querySelectorAll('[data-studio]').forEach(button => {
  button.disabled = true;
  button.addEventListener('click', async () => {
    if (opened) await panel(false);
    if (!await window.desktop.studio(button.dataset.studio)) $('load').textContent = 'Cet outil est indisponible pour le moment.';
  });
});
$('playerToggle').addEventListener('click', () => window.desktop.player({action:'toggle'}));
$('playerProgress').addEventListener('pointerdown', () => { seeking = true; });
$('playerProgress').addEventListener('input', () => { seeking = true; $('positionTime').textContent = timeLabel(Number($('playerProgress').value)); });
$('playerProgress').addEventListener('change', async () => { await window.desktop.player({action:'seek',value:Number($('playerProgress').value)}); seeking = false; });
$('playerVolume').addEventListener('input', () => { adjustingVolume = true; void window.desktop.player({action:'volume',value:Number($('playerVolume').value)}); });
$('playerVolume').addEventListener('change', () => { adjustingVolume = false; });
document.addEventListener('pointercancel', () => { seeking = false; adjustingVolume = false; });
document.addEventListener('keydown', event => { if(event.key==='Escape'&&profileOpened)void profilePanel(false); if (event.key === 'Escape' && opened) void panel(false); if (event.ctrlKey && event.key === ',') { event.preventDefault(); void panel(!opened); } });
window.desktop.onPanel(open => panel(open));
document.querySelectorAll('.theme').forEach(button => button.addEventListener('click', () => { prefs.theme = button.dataset.theme; if(prefs.theme==='music')prefs.analysis=true; queueSave(); }));
for (const key of ['size','density','zoom','motion','analysis','autoColor']) $(key).addEventListener('input', () => { prefs[key] = $(key).type === 'checkbox' ? $(key).checked : Number($(key).value) / (key === 'zoom' ? 100 : 1); queueSave(); });
$('reset').addEventListener('click', () => { prefs = { ...defaults }; queueSave(); });
async function updateCache() {
  try { const info = await window.desktop.cache('info'); $('cacheInfo').textContent = (info.usedBytes / 1048576).toFixed(1) + ' Mo utilisés · cible de cache HTTP : 256 Mo'; }
  catch { $('cacheInfo').textContent = 'Taille du cache indisponible.'; }
}
$('clearCache').addEventListener('click', async () => {
  $('clearCache').disabled = true; $('cacheInfo').textContent = 'Nettoyage…';
  try { await window.desktop.cache('clear'); await updateCache(); }
  catch { $('cacheInfo').textContent = 'Impossible de vider le cache.'; }
  finally { $('clearCache').disabled = false; }
});
function state(value) {
  if (value.studio) {
    studio = value.studio;
    document.querySelectorAll('[data-studio]').forEach(button => {
      const route = button.dataset.studio;
      button.disabled = !studio.ready || (route === 'account' ? !studio.account : route === 'credits' ? !studio.hasCredits : !studio.routes.includes(route));
      button.classList.toggle('selected', route === studio.route);
      if (route === studio.route) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    workspaceTitle();
    $('creditsCount').textContent = studio.credits ?? '—';
    $('creditsDetail').textContent = studio.credits !== null && studio.credits !== undefined ? 'Disponibles sur votre compte' : 'Solde non disponible · ouvrir le compte';
  }
  if(value.profile){profile=value.profile;applyProfile();}
  if (value.player) playbackState(value.player);
  audio = value.audio || audio;
  $('eqStatus').textContent=({off:'Traitement désactivé',active:'Égaliseur actif sur le morceau',bypass:'A/B · signal original',waiting:'Choisissez un morceau pour écouter le réglage',unavailable:'Le flux du service ne permet pas ce traitement'}[audio.eqState])||'Traitement désactivé';
  if (audio.impact && prefs.motion && audio.state === 'active') stars.forEach(star => { star.angle += .8 + Math.random() * 1.8; });
  const info = descriptions[audio.state] || descriptions.unavailable;
  $('audioStatus').textContent = info[0]; $('audioTitle').textContent = info[1]; $('audioDetail').textContent = info[2]; $('dot').classList.toggle('active', audio.state === 'active');
  $('load').textContent = value.failed ? 'Site indisponible · Actualiser pour réessayer' : value.loading ? 'Chargement…' : 'Site prêt';
  $('placeholder').hidden = !value.loading && !value.failed;
  if (value.failed) { $('placeholder').querySelector('h2').textContent = 'Le site est momentanément indisponible'; $('placeholder').querySelector('p').textContent = 'Vérifiez votre connexion, puis cliquez sur Actualiser ou ouvrez le navigateur.'; }
}
let profile={nickname:'',photo:null},profileOpened=false,profileDraftPhoto=null;
function applyProfile(){
  $('profileNickname').textContent=profile.nickname||'Votre studio';
  for(const id of ['identityAvatar','accountAvatar'])$(id).src=profile.photo||'../assets/service-logo.svg';
}
async function profilePanel(open){
  if(open&&opened)await panel(false);
  profileOpened=open;$('profilePanel').hidden=!open;document.body.classList.toggle('panel',open||opened);
  await window.desktop.settings(open||opened);
  workspaceTitle();
  if(open){profileDraftPhoto=profile.photo;$('profilePhoto').src=profile.photo||'../assets/service-logo.svg';$('nickname').value=profile.nickname;$('profileSaved').textContent='';$('nickname').focus();}
}
$('account').addEventListener('click',()=>profilePanel(!profileOpened));$('closeProfile').addEventListener('click',()=>profilePanel(false));
$('serviceAccount').addEventListener('click',async()=>{await profilePanel(false);await window.desktop.studio('account');});
$('removePhoto').addEventListener('click',()=>{profileDraftPhoto=null;$('profilePhoto').src='../assets/service-logo.svg';});
$('photoFile').addEventListener('change',async()=>{
  const file=$('photoFile').files[0];if(!file)return;
  if(file.size>8*1024*1024){$('profileSaved').textContent='Choisissez une photo de moins de 8 Mo.';return;}
  try{
    const bitmap=await createImageBitmap(file),size=Math.min(bitmap.width,bitmap.height),canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    canvas.getContext('2d').drawImage(bitmap,(bitmap.width-size)/2,(bitmap.height-size)/2,size,size,0,0,256,256);bitmap.close();
    profileDraftPhoto=canvas.toDataURL('image/png');$('profilePhoto').src=profileDraftPhoto;$('profileSaved').textContent='Photo prête · enregistrez votre profil.';
  }catch{$('profileSaved').textContent='Cette photo ne peut pas être ouverte.';}
});
$('profileForm').addEventListener('submit',async event=>{event.preventDefault();try{profile=await window.desktop.profile({nickname:$('nickname').value,photo:profileDraftPhoto});applyProfile();$('profileSaved').textContent='Profil enregistré sur cet ordinateur.';}catch{$('profileSaved').textContent='Impossible d’enregistrer le profil.';}});
for(const [id,action] of Object.entries({playerRepeat:'repeat',playerRewind:'rewind',playerForward:'forward',playerFavorite:'favorite',playerShare:'share',playerDownload:'download'}))$(id).addEventListener('click',()=>window.desktop.player({action}));
const eqIds={eqPreamp:'preamp',eqWidth:'width',eqPan:'pan',eqPanRate:'panRate',eqReverb:'reverb',eqEcho:'echo',eqEchoTime:'echoTime'};
for(const [mode,[name]] of Object.entries(window.soundProfiles)){
  const button=document.createElement('button');button.type='button';button.textContent=name;button.dataset.sound=mode;
  button.addEventListener('click',()=>{const [,bands,extra={}]=window.soundProfiles[mode];prefs.eq={...window.defaultEqualizer(),...extra,bands:[...bands],enabled:true,mode};queueSave();});$('soundProfiles').appendChild(button);
}
[31,62,125,250,500,1000,2000,4000,8000,16000].forEach((hz,index)=>{
  const label=document.createElement('label'),name=document.createElement('span'),input=document.createElement('input'),output=document.createElement('output');
  name.textContent=hz>=1000?hz/1000+'k':hz;input.type='range';input.min=-15;input.max=15;input.step=.5;input.setAttribute('aria-label',hz+' Hz');input.dataset.band=index;output.id='bandGain'+index;
  input.addEventListener('input',()=>{prefs.eq.bands[index]=Number(input.value);prefs.eq.enabled=true;prefs.eq.mode='custom';queueSave();});label.append(output,input,name);$('eqBands').appendChild(label);
});
function applyEqualizer(){
  prefs.eq=prefs.eq||window.defaultEqualizer();prefs.eqPresets=prefs.eqPresets||[];
  document.querySelectorAll('[data-band]').forEach(input=>{input.value=prefs.eq.bands[Number(input.dataset.band)];$('bandGain'+input.dataset.band).textContent=input.value+' dB';});
  for(const [id,key] of Object.entries(eqIds)){$(id).value=prefs.eq[key];$(id+'Value').textContent=key==='preamp'?prefs.eq[key]+' dB':key==='echoTime'?Math.round(prefs.eq[key]*1000)+' ms':key==='panRate'?prefs.eq[key].toFixed(2)+' Hz':key==='pan'?prefs.eq[key].toFixed(2):Math.round(prefs.eq[key]*100)+' %';}
  for(const [id,key] of Object.entries({eqEnabled:'enabled',eqAutoPan:'autoPan',eqLimiter:'limiter'}))$(id).checked=prefs.eq[key];
  $('eqBypass').setAttribute('aria-pressed',String(prefs.eq.bypass));$('eqBypass').textContent=prefs.eq.bypass?'A/B · reprendre le traitement':'A/B · écouter l’original';
  document.querySelectorAll('[data-sound]').forEach(button=>button.classList.toggle('selected',button.dataset.sound===prefs.eq.mode));
  $('userPresets').replaceChildren();prefs.eqPresets.forEach((preset,index)=>{const group=document.createElement('div'),button=document.createElement('button'),remove=document.createElement('button');button.textContent=preset.name;button.addEventListener('click',()=>{prefs.eq=structuredClone(preset.eq);queueSave();});remove.textContent='×';remove.setAttribute('aria-label','Retirer le réglage '+preset.name);remove.addEventListener('click',()=>{prefs.eqPresets.splice(index,1);queueSave();});group.append(button,remove);$('userPresets').appendChild(group);});
}
for(const [id,key] of Object.entries(eqIds))$(id).addEventListener('input',()=>{prefs.eq[key]=Number($(id).value);prefs.eq.enabled=true;prefs.eq.mode='custom';queueSave();});
for(const [id,key] of Object.entries({eqEnabled:'enabled',eqAutoPan:'autoPan',eqLimiter:'limiter'}))$(id).addEventListener('change',()=>{prefs.eq[key]=$(id).checked;queueSave();});
$('eqBypass').addEventListener('click',()=>{prefs.eq.bypass=!prefs.eq.bypass;queueSave();});$('eqReset').addEventListener('click',()=>{prefs.eq=window.defaultEqualizer();queueSave();});
$('savePreset').addEventListener('click',()=>{const name=$('presetName').value.trim();if(!name)return;prefs.eqPresets=prefs.eqPresets.filter(preset=>preset.name!==name);prefs.eqPresets.push({name,eq:structuredClone(prefs.eq)});prefs.eqPresets=prefs.eqPresets.slice(-32);$('presetName').value='';queueSave();});
function drawSpectrum(){
  if(!opened)return;const canvas=$('spectrum'),ctx=canvas.getContext('2d'),bins=audio.spectrum||[];ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--cover-primary')||'#c4a7ff';
  bins.forEach((value,index)=>{const w=canvas.width/64;ctx.fillRect(index*w,canvas.height-value*(canvas.height-6),Math.max(1,w-4),value*(canvas.height-6));});
}
const canvas = $('sky'), ctx = canvas.getContext('2d');
let stars = [], width = 0, height = 0, last = performance.now(), elapsed = 0, nextShooting = 8, shooting = null, rgb = [186,162,255];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function rebuildStars() { stars = Array.from({ length: prefs.density }, () => ({ x: Math.random() * width, y: Math.random() * height, radius: .5 + Math.random() * 1.2, phase: Math.random() * 6.28, angle: Math.random() * 6.28, speed: .6 + Math.random() })); }
function resize() { width = innerWidth; height = innerHeight; const dpr = Math.min(devicePixelRatio, 2); canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); rebuildStars(); }
function starShape(x, y, size) {
  ctx.beginPath(); ctx.moveTo(x, y-size); ctx.quadraticCurveTo(x+size*.12,y-size*.12,x+size,y); ctx.quadraticCurveTo(x+size*.12,y+size*.12,x,y+size); ctx.quadraticCurveTo(x-size*.12,y+size*.12,x-size,y); ctx.quadraticCurveTo(x-size*.12,y-size*.12,x,y-size); ctx.fill();
}
function frame(now) {
  const dt = Math.min((now-last)/1000,.05); last = now; elapsed += dt; ctx.clearRect(0,0,width,height);
  const moving = prefs.motion && !reduced.matches;
  const albumColor=prefs.autoColor?(playback.primary||audio.color):null;
  const target = albumColor ? [1,3,5].map(i => parseInt(albumColor.slice(i,i+2),16)) : prefs.theme==='official'?[16,185,129]:[186,162,255];
  rgb = rgb.map((v,i) => v + (target[i]-v)*Math.min(1,dt*.8));
  const blended='rgb('+rgb.map(Math.round).join(',')+')';
  document.body.style.setProperty('--cover-primary',blended);
  document.body.style.setProperty('--cover-secondary',prefs.autoColor&&playback.secondary?playback.secondary:blended);
  document.body.style.setProperty('--music-rgb',rgb.map(Math.round).join(','));
  drawSpectrum();
  if (prefs.theme === 'galaxy' || prefs.theme === 'music') {
    for (const star of stars) {
      const music = prefs.theme === 'music';
      // No clock-driven movement in Music: a measured bass signal is required.
      if (music && moving && audio.state === 'active' && audio.bass > .08) { const amount = audio.bass * star.speed * dt * 90; star.x = (star.x + Math.cos(star.angle)*amount + width)%width; star.y = (star.y + Math.sin(star.angle)*amount + height)%height; }
      const alpha = music ? .48 : moving ? .28 + .45*(Math.sin(elapsed*1.2+star.phase)+1)/2 : .5;
      ctx.fillStyle = `rgba(${rgb.map(Math.round).join(',')},${alpha})`;
      if (music) starShape(star.x,star.y,prefs.size*.35*star.speed); else { ctx.beginPath();ctx.arc(star.x,star.y,star.radius*prefs.size/20,0,Math.PI*2);ctx.fill(); }
    }
    if (prefs.theme === 'galaxy' && moving) {
      if (!shooting && elapsed > nextShooting) { shooting = { x: width*.45+Math.random()*width*.4, y: 4, life: 0 }; nextShooting = elapsed + 9 + Math.random()*8; }
      if (shooting) { shooting.life += dt; shooting.x -= dt*220; shooting.y += dt*100; const gradient = ctx.createLinearGradient(shooting.x,shooting.y,shooting.x+80,shooting.y-36); gradient.addColorStop(0,'#e3dbffb0');gradient.addColorStop(1,'#e3dbff00');ctx.strokeStyle=gradient;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(shooting.x,shooting.y);ctx.lineTo(shooting.x+80,shooting.y-36);ctx.stroke();if(shooting.life>1.6)shooting=null; }
    }
  }
  requestAnimationFrame(frame);
}
addEventListener('resize',resize); resize(); requestAnimationFrame(frame);
window.desktop.onState(state);
window.desktop.init().then(value => { prefs = value.prefs; applyPrefs(); state(value); }).catch(() => { $('load').textContent = 'Impossible de charger les paramètres'; });
