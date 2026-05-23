'use server'

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getDashboardData, getProductsData } from "@/lib/erp-data"

async function getAppDataSummary() {
  const [dashboard, products] = await Promise.all([getDashboardData(), getProductsData()])
  const lowStock = products.filter((product) => product.totalStock <= 10).length

  return `
    CONTEXTE DE L'ENTREPRISE (GNIX ERP) :
    - Clients : ${dashboard.clientsCount}
    - Valeur pipeline : ${dashboard.totalRevenue}
    - Revenu encaisse : ${dashboard.paidRevenue}
    - Projets : ${dashboard.projectsCount}
    - Taches ouvertes : ${dashboard.openTasks}
    - Produits en stock critique : ${lowStock}
    - Score CRM moyen : ${dashboard.avgScore}/100
  `
}

export async function processAICommand(command: string) {
  const apiKey = process.env.GEMINI_API_KEY
  const dataSummary = await getAppDataSummary()

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    const clients = dataSummary.match(/Clients : (\d+)/)?.[1] ?? "0"
    const projects = dataSummary.match(/Projets : (\d+)/)?.[1] ?? "0"

    if (command.toLowerCase().includes("combien") || command.toLowerCase().includes("stat")) {
      return {
        message: `Point rapide : ${clients} clients, ${projects} projets et un score CRM moyen disponible dans le tableau de bord.`,
        type: "info",
      }
    }

    return {
      message: `[Mode local] Commande recue : "${command}". Les donnees ERP sont accessibles; ajoutez GEMINI_API_KEY pour une analyse IA avancee.`,
      type: "info",
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const prompt = `
      Tu es l'intelligence artificielle centrale de GNIX ERP.
      Voici les donnees actuelles de l'organisation :
      ${dataSummary}

      Instruction utilisateur : "${command}".

      Reponds de maniere concise, professionnelle, et exploite les chiffres si pertinent.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return {
      message: response.text(),
      type: "ai_response",
    }
  } catch {
    return { message: "Le service IA est indisponible pour le moment, mais vos donnees ERP restent operationnelles.", type: "error" }
  }
}
