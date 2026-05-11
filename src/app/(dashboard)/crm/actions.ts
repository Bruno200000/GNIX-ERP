'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  type: string
  ai_conversion_score: number
  created_at: string
}

export type Product = {
  id: string
  name: string
  price: number
  sku: string
}

export type Quote = {
  id: string
  client_id: string
  quote_number: string
  total_amount: number
  status: string
  valid_until: string
  items: any[]
}

export async function getClients() {
  const supabase = await createClient()
  
  // Dans un vrai flux, le RLS filtre automatiquement.
  // On récupère les clients triés par score IA décroissant pour mettre en avant les meilleures opportunités
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('ai_conversion_score', { ascending: false })

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  return clients as Client[]
}

export async function addClient(formData: FormData) {
  const supabase = await createClient()

  // 1. Récupérer l'utilisateur courant pour obtenir son organization_id
  // (Normalement, avec un RLS parfait, Supabase l'injecte ou on l'insère, 
  // mais la table requiert l'organization_id)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Vous devez être connecté pour ajouter un client.")
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) {
    throw new Error("Aucune organisation trouvée pour cet utilisateur.")
  }

  const newClient = {
    organization_id: profile.organization_id,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    type: formData.get('type') as string,
    ai_conversion_score: Math.floor(Math.random() * 50) + 40, // Score IA simulé
  }

  const { error } = await supabase.from('clients').insert([newClient])

  if (error) {
    console.error("Error creating client:", error)
    throw new Error("Erreur lors de la création du client")
  }

  revalidatePath('/crm')
}

export async function addQuote(formData: FormData, items: any[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  const totalAmount = items.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.qty)), 0)

  const newQuote = {
    organization_id: profile.organization_id,
    client_id: formData.get('client_id') as string,
    quote_number: `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    total_amount: totalAmount,
    status: 'draft',
    valid_until: formData.get('valid_until') as string,
    items: items // On stocke les items en JSON pour simplifier la démo
  }

  const { error } = await supabase.from('quotes').insert([newQuote])

  if (error) {
    console.error("Error creating quote:", error)
    throw new Error("Erreur lors de la création du devis")
  }

  revalidatePath('/crm/quotes')
}
