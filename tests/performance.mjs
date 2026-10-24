import {chromium} from 'playwright'
import {mkdir,writeFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
const base=process.env.PORTFOLIO_TEST_URL||'http://127.0.0.1:3020'
assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const out=process.env.PORTFOLIO_BROWSER_OUTPUT||'/tmp/portfolio-performance'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.PORTFOLIO_CHROMIUM_EXECUTABLE})
const runs=[]
try {
 for(const route of ['/','/work/rakuten-programmatic-loyalty']) {
  for(let run=1;run<=3;run++) {
   const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'})
   const page=await context.newPage(), cdp=await context.newCDPSession(page)
   await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true})
   await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8})
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:4})
   await page.addInitScript(()=>{
    window.__lab={lcp:0,cls:0,events:[]}
    new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lab.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true})
    new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__lab.cls+=e.value}).observe({type:'layout-shift',buffered:true})
    new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lab.events.push({name:e.name,duration:e.duration})}).observe({type:'event',buffered:true,durationThreshold:16})
   })
   const failed=[];page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}))
   await page.goto(base+route,{waitUntil:'networkidle'})
   await page.evaluate(()=>document.fonts.ready)
   const metrics=await page.evaluate(()=>({...window.__lab,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,encoded:r.encodedBodySize,transfer:r.transferSize,type:r.initiatorType})),navigation:performance.getEntriesByType('navigation').map(r=>({transfer:r.transferSize,encoded:r.encodedBodySize}))}))
   await page.getByRole('button',{name:'Menu',exact:true}).click()
   await page.getByRole('button',{name:'Close',exact:true}).waitFor()
   const events=await page.evaluate(()=>window.__lab.events)
   const result={route,run,...metrics,events,failed}
   runs.push(result)
   console.log(JSON.stringify({route,run,lcp:metrics.lcp,cls:metrics.cls,failed:failed.length}))
   await context.close()
  }
 }
 await writeFile(out+'/performance.json',JSON.stringify({setup:{latencyMs:150,downloadMbps:1.6,cpuSlowdown:4,viewport:'390x844',cache:'disabled, new context per run',note:'Local synthetic measurements, not field Web Vitals.'},runs},null,2))
} finally {await browser.close()}
