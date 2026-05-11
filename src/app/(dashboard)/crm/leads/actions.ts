'use server'

/**
 * Service de Scoring IA pour les Leads
 * Simule ou appelle un modèle d'IA (ex: Gemini) pour évaluer la probabilité de conversion.
 */
export async function scoreLeadAction(leadData: { name: string, company: string, budget?: string, source: string }) {
  // Simulation d'un délai d'analyse IA
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Logique de scoring simplifiée (à remplacer par un vrai call API)
  let score = 50;
  
  if (leadData.budget && parseInt(leadData.budget) > 1000000) score += 30;
  if (leadData.source === 'LinkedIn' || leadData.source === 'Site Web') score += 15;
  if (leadData.company.includes('SARL') || leadData.company.includes('SA')) score += 10;

  const analysis = score > 75 
    ? "Lead très chaud. Probabilité de conversion élevée. Recommandation : Contacter dans les 2h."
    : "Lead tiède. Nécessite plus de maturation (nurturing).";

  return {
    score: Math.min(score, 100),
    analysis,
    timestamp: new Date().toISOString()
  };
}
