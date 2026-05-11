'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

async function getAppDataSummary() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return "Utilisateur non connecté."

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) return "Aucune organisation trouvée."

  const orgId = profile.organization_id

  // Récupération parallélisée des statistiques clés
  const [
    { count: clientsCount },
    { count: unpaidInvoicesCount },
    { count: productsCount },
    { count: employeesCount }
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).neq('status', 'paid'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('employees').select('*', { count: 'exact', head: true }).eq('organization_id', orgId)
  ])

  return `
    CONTEXTE DE L'ENTREPRISE (GNIX ERP) :
    - Clients : ${clientsCount || 0}
    - Factures impayées : ${unpaidInvoicesCount || 0}
    - Produits en catalogue : ${productsCount || 0}
    - Effectif (Employés) : ${employeesCount || 0}
  `
}

export async function processAICommand(command: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const dataSummary = await getAppDataSummary();

  if (!apiKey) {
    // Mode Simulation Enrichi avec les données réelles
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const cmd = command.toLowerCase();
    if (cmd.includes('combien') || cmd.includes('stat') || cmd.includes('résumé')) {
      return {
        message: `Voici un point rapide basé sur vos données : Vous avez actuellement ${dataSummary.match(/Clients : (\d+)/)?.[1]} clients et ${dataSummary.match(/Effectif \(Employés\) : (\d+)/)?.[1]} employés enregistrés.`,
        type: 'info'
      };
    }

    return {
      message: `[Mode Démo] Commande reçue : "${command}". Connectez Gemini pour une analyse profonde de vos ${dataSummary.match(/Clients : (\d+)/)?.[1]} clients.`,
      type: 'info'
    };
  }

  // Vraie intégration Gemini avec Contexte Data
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Tu es l'intelligence artificielle centrale de GNIX ERP. 
      Voici les données actuelles de l'organisation de l'utilisateur :
      ${dataSummary}

      L'utilisateur a donné l'instruction suivante : "${command}".

      RÈGLES :
      1. Réponds de manière concise, intelligente et professionnelle.
      2. Utilise les chiffres du contexte si pertinent pour répondre.
      3. Si l'utilisateur demande "combien" ou "quel est l'état", sers-toi du résumé fourni.
      4. Garde un ton d'assistant de direction de haut niveau.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      message: response.text(),
      type: 'ai_response'
    };
  } catch (error) {
    console.error("Erreur IA Gemini:", error);
    return { message: "Désolé, une erreur technique est survenue avec le service IA.", type: 'error' };
  }
}
