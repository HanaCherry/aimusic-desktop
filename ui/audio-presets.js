 'use strict';
window.soundProfiles = {
 flat:['Neutre',[0,0,0,0,0,0,0,0,0,0]],
 bass:['Basses',[5,5,4,2,0,-1,0,1,0,0]],
 vocal:['Voix',[-2,-2,-1,0,2,3,3,1,0,-1]],
 clarity:['Clarté',[-1,-1,0,0,1,2,3,3,2,1]],
 immersive:['Immersif',[3,3,1,0,-1,0,1,2,3,2],{width:1.35,reverb:.08}],
 stage:['Scène large',[1,1,0,-1,0,1,2,2,1,0],{width:1.55,reverb:.12}],
 surround:['Scène 3D',[2,2,0,-1,0,1,2,2,2,1],{width:1.7,reverb:.18,echo:.05}],
 spatial:['Spatial casque',[1,2,1,0,0,1,1,2,2,1],{width:1.45,reverb:.1}],
 studio:['Studio',[0,0,0,0,0,0,0,0,0,0]],
 warm:['Chaleureux',[2,3,2,1,0,0,-1,-1,-2,-2]],
 punch:['Punch',[4,4,2,0,-1,1,2,1,1,0]],
 air:['Air',[0,0,0,0,0,1,1,2,4,4]],
 presence:['Présence',[-1,-1,0,1,2,3,3,2,0,0]],
 lofi:['Lo-fi',[1,2,1,0,-1,-1,-2,-4,-7,-10],{reverb:.04}],
 vinyl:['Vinyle',[1,2,1,1,0,0,-1,-2,-3,-4]],
 club:['Club',[5,4,2,-1,-2,0,2,3,3,2]],
 acoustic:['Acoustique',[0,1,1,0,1,2,2,1,1,0]],
 electronic:['Électro',[4,4,1,-1,-2,0,2,3,3,2]],
 orchestral:['Orchestre',[1,1,0,0,1,1,2,2,1,1],{reverb:.1,width:1.2}],
 night:['Nuit douce',[-1,0,1,1,1,0,-1,-2,-3,-3],{preamp:-3}],
 wide:['Largeur',[0,0,0,0,0,0,0,0,0,0],{width:1.7}],
 radio:['Radio',[-10,-8,-5,0,3,3,1,-4,-8,-12],{width:0}]
};
window.defaultEqualizer=()=>({enabled:false,bypass:false,limiter:true,bands:Array(10).fill(0),preamp:0,width:1,pan:0,autoPan:false,panRate:.28,reverb:0,echo:0,echoTime:.32,mode:'flat'});
