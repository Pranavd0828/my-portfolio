'use client'
import { useState } from 'react'
import { explainCampaign, type CampaignBudget, type CampaignSignal } from '@/content/decisionExamples'
import styles from './DecisionLab.module.css'

export default function DecisionLab({ mode }: { mode: 'campaign' | 'creative' }) {
  const [signal, setSignal] = useState<CampaignSignal>('settled')
  const [budget, setBudget] = useState<CampaignBudget>('available')
  const [ambiguous, setAmbiguous] = useState(false)
  const result = explainCampaign(signal, budget)
  return (
    <section id="explore-model" className={`story-section ${styles.lab}`} aria-labelledby="model-heading">
      <p className="eyebrow">Illustrative product model</p>
      <h2 id="model-heading">{mode === 'campaign' ? 'A stronger signal is not permission to spend.' : 'A suggestion is not an approval.'}</h2>
      <p className={styles.boundary}>Fictional scenarios. This explains a product principle, not Rakuten policy, production software, or measured performance.</p>
      {mode === 'campaign' ? <>
        <div className={styles.inputs}>
          <label>What evidence is available?
            <select value={signal} onChange={e => setSignal(e.target.value as CampaignSignal)}>
              <option value="settled">Valid settled-outcome guidance</option>
              <option value="fresh">A new engagement signal</option>
              <option value="missing">Missing or stale guidance</option>
            </select>
          </label>
          <label>Does the campaign have budget?
            <select value={budget} onChange={e => setBudget(e.target.value as CampaignBudget)}>
              <option value="available">Budget remains</option>
              <option value="exhausted">Approved budget is exhausted</option>
            </select>
          </label>
        </div>
        <div className={styles.result} aria-live="polite" aria-atomic="true">
          <p className="eyebrow">Example decision</p><h3>{result.action}</h3>
          <dl>
            <div><dt>For the advertiser</dt><dd>{result.advertiser}</dd></div>
            <div><dt>For the customer</dt><dd>{result.customer}</dd></div>
            <div><dt>What happens next</dt><dd>{result.next}</dd></div>
          </dl>
        </div>
        <button className="text-link" type="button" onClick={() => {setSignal('settled');setBudget('available')}}>Reset example</button>
        <noscript><p>Without interactive controls: valid guidance and available budget permit an eligible opportunity. Exhausted budget or missing guidance means holding delivery in this conservative example.</p></noscript>
      </> : <>
        <div className={styles.choices} role="group" aria-label="Creative review example">
          <button type="button" className="button" aria-pressed={!ambiguous} onClick={() => setAmbiguous(false)}>Complete, supported submission</button>
          <button type="button" className="button" aria-pressed={ambiguous} onClick={() => setAmbiguous(true)}>Unsupported product claim</button>
        </div>
        <div className={styles.result} aria-live="polite" aria-atomic="true">
          <p className="eyebrow">Synthetic submission</p>
          <h3>{ambiguous ? '“Clinically proven to improve sleep.”' : '“Explore our new collection.”'}</h3>
          <dl>
            <div><dt>Rules</dt><dd>Check required fields and permitted file types. Passing these checks says nothing about the truth of the copy.</dd></div>
            <div><dt>Model assistance</dt><dd>{ambiguous ? 'Flag the health claim and the missing supporting source. Do not manufacture evidence or soften the sentence into an automatic approval.' : 'Compare the copy with the supplied brief and surface any mismatch for inspection.'}</dd></div>
            <div><dt>Human authority</dt><dd>{ambiguous ? 'Hold for a qualified reviewer. Request evidence or revised copy before an approval decision.' : 'Present the draft and its supporting context to the reviewer. The model has not granted publication authority.'}</dd></div>
          </dl>
        </div>
        <details className={styles.evaluation}>
          <summary>A retrospective evaluation plan</summary>
          <p>This is how I would evaluate the illustrative workflow, not a report of a historical test.</p>
          <ul><li>Correctness: supported findings and missed issues.</li><li>Utility: revisions and reviewer effort per submission.</li><li>Risk: unsupported approvals and override patterns.</li><li>Operations: failure rate, response time, and cost per completed review.</li></ul>
        </details>
        <noscript><p>An unsupported claim should be held for evidence and human review. A complete submission can proceed to a reviewer, but a model suggestion does not authorize publication.</p></noscript>
      </>}
    </section>
  )
}
