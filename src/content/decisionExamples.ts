// Fictional scenarios explain a product boundary, not production decision logic.
export type CampaignSignal = 'settled' | 'fresh' | 'missing'
export type CampaignBudget = 'available' | 'exhausted'
export function explainCampaign(signal: CampaignSignal, budget: CampaignBudget) {
  if (budget === 'exhausted') return {
    action: 'Hold delivery',
    advertiser: 'A promising signal does not create more approved budget.',
    customer: 'This campaign does not receive additional delivery in the example.',
    next: 'Reconcile spend and obtain an authorized budget change before reconsidering delivery.',
  }
  if (signal === 'missing') return {
    action: 'Hold for reliable guidance',
    advertiser: 'Missing state is not permission to spend.',
    customer: 'Do not expand campaign exposure using an unverified decision.',
    next: 'Restore valid state. In this conservative example, a hold trades some delivery for control.',
  }
  if (signal === 'fresh') return {
    action: 'Keep the approved guidance',
    advertiser: 'A new click is useful information, but it is not settled sales evidence.',
    customer: 'A single recent signal does not automatically increase this campaign’s exposure.',
    next: 'Use the new evidence in a later guidance update instead of changing financial assumptions immediately.',
  }
  return {
    action: 'Allow an eligible opportunity',
    advertiser: 'Use valid guidance within the remaining approved budget.',
    customer: 'Eligibility still matters. A budget is not a reason to show an irrelevant offer.',
    next: 'Measure delivery and reconcile outcomes before updating the next recommendation.',
  }
}
