'use strict';
const FREQUENCIES=Object.freeze([31,62,125,250,500,1000,2000,4000,8000,16000]);
function eqSettings(value={}){
  value=value&&typeof value==='object'?value:{};
  const number=(key,low,high,fallback)=>Number.isFinite(value[key])?Math.max(low,Math.min(high,value[key])):fallback;
  return {enabled:value.enabled===true,bypass:value.bypass===true,limiter:value.limiter!==false,
    bands:FREQUENCIES.map((_,index)=>Number.isFinite(value.bands?.[index])?Math.max(-15,Math.min(15,value.bands[index])):0),
    preamp:number('preamp',-12,12,0),width:number('width',0,2,1),pan:number('pan',-1,1,0),
    autoPan:value.autoPan===true,panRate:number('panRate',.08,1.2,.28),reverb:number('reverb',0,.45,0),echo:number('echo',0,.45,0),echoTime:number('echoTime',.12,.7,.32),
    mode:typeof value.mode==='string'?value.mode.slice(0,32):'flat'};
}
function eqPresets(value){return Array.isArray(value)?value.slice(0,32).filter(item=>item&&typeof item.name==='string'&&item.name.trim()).map(item=>({name:item.name.trim().slice(0,40),eq:eqSettings(item.eq)})):[];}
module.exports={FREQUENCIES,eqSettings,eqPresets};
