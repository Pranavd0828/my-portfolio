import test from 'node:test'
import assert from 'node:assert/strict'
import { explainCampaign } from '../src/content/decisionExamples.ts'

test('No signal authorizes delivery after the budget is exhausted', () => {
  for (const signal of ['settled', 'fresh', 'missing']) {
    assert.equal(explainCampaign(signal, 'exhausted').action, 'Hold delivery')
  }
})
test('Missing state and fresh engagement do not become financial authority', () => {
  assert.equal(explainCampaign('missing', 'available').action, 'Hold for reliable guidance')
  assert.equal(explainCampaign('fresh', 'available').action, 'Keep the approved guidance')
  assert.equal(explainCampaign('settled', 'available').action, 'Allow an eligible opportunity')
})
