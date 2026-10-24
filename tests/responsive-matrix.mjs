import assert from 'node:assert/strict'
import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { caseStudies } from '../src/content/caseStudies.ts'
const base=process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:3020'
assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost):\d+$/)
const output=process.env.PORTFOLIO_BROWSER_OUTPUT || '/tmp/portfolio-responsive'
await mkdir(output,{recursive:true})
const widths=[320,360,375,390,393,412,430,480,599,600,601,650,699,700,701,768,820,834,899,900,901,1023,1024,1025,1179,1180,1181,1280,1440,1536,1920]
const routes=['/','/work','/reading','/playground','/escape','/rpsls',...caseStudies.map(s=>'/work/'+s.slug)]
const results=[]
for(const engine of ['chromium','webkit']) {
 const browser=await {chromium,webkit}[engine].launch({executablePath:process.env[`PORTFOLIO_${engine.toUpperCase()}_EXECUTABLE`]})
 try {
  const page=await browser.newPage({reducedMotion:'reduce'})
  for(const route of routes) {
   await page.goto(base+route,{waitUntil:'networkidle'})
   await page.evaluate(()=>document.fonts.ready)
   for(const width of widths) {
    await page.setViewportSize({width,height:width<=480?740:900})
    const problems=await page.evaluate(()=>{
     const bad=[]
     if(document.documentElement.scrollWidth>innerWidth+1)bad.push('document overflow')
     for(const el of document.querySelectorAll('.flow-step,.leadership-grid dt span,.story-metrics dd')) {
      if(!el.getClientRects().length)continue
      const range=document.createRange()
      range.selectNodeContents(el)
      const lines=[...range.getClientRects()].filter(r=>r.width>0 && r.height>0)
      if(new Set(lines.map(r=>Math.round(r.top))).size>1)bad.push('split numeric label: '+el.textContent)
     }
     for(const el of document.querySelectorAll('main h1,main h2,main h3,main p,main a,main button,main input,main textarea,main select,main summary,.site-header a,.site-header button')) {
      const r=el.getBoundingClientRect(),s=getComputedStyle(el)
      if(!el.getClientRects().length || r.width===0 || s.visibility==='hidden' || el.closest('[aria-hidden="true"],.sr-only'))continue
      if(r.left< -2 || r.right>innerWidth+2)bad.push(el.tagName+': '+el.textContent.slice(0,60))
     }
     return bad
    })
    assert.deepEqual(problems,[],`${engine} ${route} ${width}`)
    results.push({engine,route,width,passed:true})
   }
  }
  console.log(`PASS ${engine}: ${routes.length} routes at ${widths.length} widths`)
 } finally {await browser.close();await writeFile(output+'/matrix.json',JSON.stringify(results,null,2))}
}
console.log(`PASS ${results.length} route/width/engine checks`)
