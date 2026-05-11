'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Invoice = {
  id: string
  invoice_number: string
  total_amount: number
  tax_amount: number
  status: string
  due_date: string
  ai_anomaly_flag: boolean
  clients?: {
    name: string
  }
}

export async function getInvoices() {
  const supabase = await createClient()
  
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      total_amount,
      tax_amount,
      status,
      due_date,
      ai_anomaly_flag,
      clients (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching invoices:', error)
    return []
  }

  return invoices as unknown as Invoice[]
}

export async function addInvoice(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  // Pour la démo, on assigne à un client existant aléatoire s'il y en a un, ou on laisse vide (ce qui plantera si client_id est NOT NULL)
  // Dans la réalité, on aurait un Select pour choisir le client.
  // Récupérons le premier client de l'org.
  const { data: clients } = await supabase
    .from('clients')
    .select('id')
    .limit(1)

  if (!clients || clients.length === 0) {
    throw new Error("Vous devez d'abord créer au moins un client dans le CRM pour pouvoir émettre une facture.")
  }

  const newInvoice = {
    organization_id: profile.organization_id,
    client_id: clients[0].id,
    invoice_number: `F-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    total_amount: parseFloat(formData.get('amount') as string),
    status: formData.get('status') as string || 'pending',
    due_date: formData.get('due_date') as string,
    ai_anomaly_flag: Math.random() > 0.8 // Simule 20% de chances d'anomalie IA
  }

  const { error } = await supabase.from('invoices').insert([newInvoice])

  if (error) {
    console.error("Error creating invoice:", error)
    throw new Error("Erreur lors de la création de la facture")
  }

  revalidatePath('/finance')
}

export async function addPayment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  const amount = parseFloat(formData.get('amount') as string)
  const invoiceId = formData.get('invoice_id') as string

  const newPayment = {
    organization_id: profile.organization_id,
    invoice_id: invoiceId,
    amount: amount,
    payment_date: formData.get('payment_date') as string,
    payment_method: formData.get('payment_method') as string || 'cash'
  }

  const { error } = await supabase.from('payments').insert([newPayment])

  if (error) {
    console.error("Error creating payment:", error)
    throw new Error("Erreur lors de l'enregistrement du paiement")
  }

  // Optionnel: Mettre à jour le statut de la facture si elle est totalement payée
  // (Logique simplifiée pour la démo)
  if (invoiceId) {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId)
  }

  revalidatePath('/finance/payments')
  revalidatePath('/finance')
}
