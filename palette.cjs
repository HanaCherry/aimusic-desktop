'use strict';
function imagePalette(image) {
  const thumbnail=image.resize({width:64,height:64}), pixels=thumbnail.toBitmap(), buckets=new Map();
  for(let i=0;i<pixels.length;i+=4){
    const rgb=[pixels[i+2],pixels[i+1],pixels[i]],hi=Math.max(...rgb),lo=Math.min(...rgb);
    if(pixels[i+3]<128||hi<48||lo>230)continue;
    const key=rgb.map(v=>Math.round(v/32)*32).join(',');
    const bucket=buckets.get(key)||{rgb:[0,0,0],count:0,weight:0};
    bucket.count++;bucket.weight+=1+(hi-lo)/80;rgb.forEach((v,k)=>bucket.rgb[k]+=v);buckets.set(key,bucket);
  }
  const ranked=[...buckets.values()].sort((a,b)=>b.weight-a.weight).map(b=>b.rgb.map(v=>Math.round(v/b.count)));
  const primary=ranked[0]||[140,170,160];
  const secondary=ranked.find(rgb=>rgb.reduce((sum,v,i)=>sum+(v-primary[i])**2,0)>6500)||primary.map(v=>Math.round(v*.65+255*.35));
  const hex=rgb=>'#'+rgb.map(v=>Math.min(255,v).toString(16).padStart(2,'0')).join('');
  return {primary:hex(primary),secondary:hex(secondary),thumbnail:thumbnail.toDataURL()};
}
module.exports={imagePalette};
