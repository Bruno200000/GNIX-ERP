'use server'

import { GoogleGenerativeAI, FunctionDeclaration, SchemaType, Tool } from "@google/generative-ai"
import { getDashboardData, getProductsData, getSettingsData, createTicketData, createClientData, createProductData } from "@/lib/erp-data"

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

async function runOpenAICommand(command: string, dataSummary: string, apiKey: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es l'intelligence artificielle centrale de GNIX ERP. Reponds en francais, de maniere concise et operationnelle.",
        },
        {
          role: "user",
          content: `${dataSummary}\n\nInstruction utilisateur: ${command}`,
        },
      ],
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    throw new Error("OpenAI a refuse la requete. Verifiez la cle API et le quota.")
  }

  const payload = await response.json()
  return {
    message: payload.choices?.[0]?.message?.content || "Analyse IA terminee.",
    type: "ai_response",
  }
}

export async function processAICommand(command: string) {
  const settings = await getSettingsData()
  const provider = settings?.ai_provider || "gemini"
  const openAiKey = settings?.openai_api_key || (provider === "openai" ? settings?.ai_api_key : "")
  const geminiKey = provider === "gemini" ? settings?.ai_api_key || process.env.GEMINI_API_KEY : process.env.GEMINI_API_KEY
  const apiKey = provider === "openai" ? openAiKey : geminiKey
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
      message: `[Mode local] Commande recue : "${command}". Les donnees ERP sont accessibles; ajoutez une cle API dans les parametres pour une analyse avancee et le controle.`,
      type: "info",
    }
  }

  try {
    if (provider === "openai" && apiKey) {
      return await runOpenAICommand(command, dataSummary, apiKey)
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Definition des outils (Tool Calling)
    const createTicketFunction: FunctionDeclaration = {
      name: "create_ticket",
      description: "Creer un ticket de support ITSM",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          subject: { type: SchemaType.STRING, description: "Le sujet du probleme" },
          priority: { type: SchemaType.STRING, description: "La priorite: 'low', 'medium' ou 'high'" },
        },
        required: ["subject", "priority"],
      },
    }

    const addClientFunction: FunctionDeclaration = {
      name: "add_client",
      description: "Ajouter un client au CRM",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING, description: "Nom du client ou entreprise" },
          email: { type: SchemaType.STRING, description: "Adresse email du client" },
        },
        required: ["name", "email"],
      },
    }

    const tools: Tool[] = [{ functionDeclarations: [createTicketFunction, addClientFunction] }]

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      tools: tools
    })

    const prompt = `
      Tu es l'intelligence artificielle centrale de GNIX ERP.
      Tu as la capacite d'executer des actions pour l'utilisateur a l'aide de tes outils.
      Voici les donnees actuelles de l'organisation :
      ${dataSummary}

      Instruction utilisateur : "${command}".

      Si l'utilisateur te demande de creer quelque chose, utilise l'outil approprie au lieu de simplement lui dire que tu vas le faire.
      Si l'outil n'existe pas, explique-lui.
      Reponds de maniere concise et professionnelle.
    `

    const chat = model.startChat()
    const result = await chat.sendMessage(prompt)
    const response = result.response

    // Verifier s'il y a un appel de fonction
    const functionCalls = response.functionCalls()
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0]
      const args = call.args as any
      if (call.name === "create_ticket") {
        const formData = new FormData()
        formData.append("subject", args.subject as string)
        formData.append("priority", args.priority as string)
        await createTicketData(formData)
        return { message: "Le ticket de support a ete cree avec succes.", type: "ai_response" }
      } else if (call.name === "add_client") {
        const formData = new FormData()
        formData.append("name", args.name as string)
        formData.append("email", args.email as string)
        await createClientData(formData)
        return { message: "Le client a ete ajoute au CRM.", type: "ai_response" }
      }
    }

    return {
      message: response.text(),
      type: "ai_response",
    }
  } catch (err: any) {
    console.error(err)
    return { message: "Le service IA est indisponible ou la cle API est invalide.", type: "error" }
  }
}
