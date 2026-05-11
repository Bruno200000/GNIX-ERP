'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Product = {
  id: string
  sku: string
  name: string
  price: number
  image_url?: string
  inventory: { quantity: number; warehouses: { name: string } }[]
}

export type Warehouse = {
  id: string
  name: string
  location: string
}

export type StockEntry = {
  id: string
  product_id: string
  warehouse_id: string
  quantity: number
  type: 'in' | 'out'
  notes?: string
}

export async function getProducts() {
  const supabase = await createClient()
  
  // Requête avec jointure pour récupérer les stocks
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      sku,
      name,
      price,
      inventory (
        quantity,
        warehouses (
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return products as unknown as Product[]
}

export async function getWarehouses() {
  const supabase = await createClient()
  const { data: warehouses, error } = await supabase
    .from('warehouses')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching warehouses:', error)
    return []
  }

  return warehouses as Warehouse[]
}

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  const newProduct = {
    organization_id: profile.organization_id,
    name: formData.get('name') as string,
    sku: formData.get('sku') as string,
    price: parseFloat(formData.get('price') as string),
  }

  const { error } = await supabase.from('products').insert([newProduct])

  if (error) {
    console.error("Error creating product:", error)
    throw new Error("Erreur lors de la création du produit")
  }

  revalidatePath('/logistique')
}

export async function addStockEntry(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  const newEntry = {
    organization_id: profile.organization_id,
    product_id: formData.get('product_id') as string,
    warehouse_id: formData.get('warehouse_id') as string,
    quantity: parseInt(formData.get('quantity') as string),
    type: 'in',
    notes: formData.get('notes') as string
  }

  // Dans un vrai ERP, on mettrait aussi à jour la table inventory ou via un trigger DB
  const { error } = await supabase.from('stock_entries').insert([newEntry])

  if (error) {
    console.error("Error creating stock entry:", error)
    throw new Error("Erreur lors de l'entrée de stock")
  }

  revalidatePath('/logistique')
}

export async function createDeliveryNote(formData: FormData, items: any[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  const newBL = {
    organization_id: profile.organization_id,
    client_id: formData.get('client_id') as string,
    delivery_date: formData.get('delivery_date') as string,
    notes: formData.get('notes') as string,
    items: items,
    status: 'pending'
  }

  const { error } = await supabase.from('delivery_notes').insert([newBL])

  if (error) {
    console.error("Error creating delivery note:", error)
    throw new Error("Erreur lors de la création du bon de livraison")
  }

  revalidatePath('/logistique/delivery-notes')
}
