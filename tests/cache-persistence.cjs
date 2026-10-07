const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const electron = require('electron');
const { HTTP_CACHE_BYTES } = require('../cache.cjs');
async function run() {
  const fixtureRoot = path.resolve(__dirname,'../../../work/cache-fixture-'+Date.now());
  fs.mkdirSync(fixtureRoot,{ recursive:true });
  let assetRequests = 0;
  const server = http.createServer((req,res) => {
    if(req.url === '/asset.js') { assetRequests++; res.writeHead(200,{'Content-Type':'application/javascript','Cache-Control':'public, max-age=86400, immutable'}); res.end('window.fixtureAsset="cached-resource";'); }
    else { const headers = {'Content-Type':'text/html','Cache-Control':'no-store'}; if(req.url.includes('mode=seed')) headers['Set-Cookie']='fixture-login=kept; SameSite=Lax; Max-Age=86400'; res.writeHead(200,headers); res.end('<!doctype html><html><body>Local cache fixture<script src="/asset.js"></script></body></html>'); }
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = 'http://127.0.0.1:'+server.address().port;
  const results = [];
  try {
    for(const mode of ['seed','reuse','clear']) {
      const report = path.join(fixtureRoot,mode+'.json');
      await new Promise((resolve,reject) => {
        const quote = value => "'"+value.replace(/'/g,"''")+"'";
        const encoded = Buffer.from(JSON.stringify({ mode,profile:path.join(fixtureRoot,'profile'),origin,report })).toString('base64');
        const args = [path.resolve(__dirname,'cache-worker'),'--cache-probe='+encoded];
        const command = '$cacheTestProcess = Start-Process -FilePath '+quote(electron)+' -ArgumentList @('+args.map(quote).join(',')+') -WindowStyle Hidden -Wait -PassThru; exit $cacheTestProcess.ExitCode';
        const child = spawn('powershell.exe',['-NoProfile','-NonInteractive','-Command',command],{ stdio:['ignore','ignore','pipe'],windowsHide:true });
        let diagnostic=''; child.stderr.on('data',chunk=>{diagnostic+=chunk.toString();});
        const deadline = setTimeout(()=>{child.kill();reject(Error('Cache fixture timed out'));},20000);
        child.on('error',error=>{clearTimeout(deadline);reject(error);});
        child.on('exit',code=>{clearTimeout(deadline);code===0?resolve():reject(Error('Worker failed with code '+code+': '+(fs.existsSync(report)?fs.readFileSync(report,'utf8'):diagnostic)));});
      });
      const result=JSON.parse(fs.readFileSync(report,'utf8'));
      assert.equal(result.marker.asset,'cached-resource'); assert.equal(result.marker.setting,'kept'); assert.equal(result.cookieKept,true);
      assert.equal(result.targetBytes,HTTP_CACHE_BYTES);
      assert.equal(assetRequests,mode==='clear'?2:1, 'Cached asset must survive a full process restart and be fetched again after clearing');
      results.push({ mode,assetRequests,usedBytes:result.usedBytes,cookieKept:true,settingKept:true });
    }
    fs.writeFileSync(path.join(__dirname,'../cache-verification.json'),JSON.stringify({ passed:true, scope:'Local synthetic fixture; no user profile accessed', results },null,2));
    console.log('Persistent HTTP cache verified across process restarts; clear preserves cookies and localStorage.');
  } finally { await new Promise(resolve=>server.close(resolve)); }
}
run().catch(error=>{console.error(error);process.exitCode=1;});

