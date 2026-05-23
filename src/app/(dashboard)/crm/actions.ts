'use server'

import { revalidatePath } from 'next/cache'
import {
  createClientData,
  createQuoteData,
  getClientsData,
  getQuotesData,
  type ClientRecord,
  type QuoteItem,
} from '@/lib/erp-data'

export type Client = ClientRecord

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
  items: QuoteItem[]
}

export async function getClients() {
  return getClientsData()
}

export async function addClient(formData: FormData) {
  await createClientData(formData)
  revalidatePath('/crm')
  revalidatePath('/', 'layout')
}

export async function getQuotes() {
  return getQuotesData()
}

export async function addQuote(formData: FormData, items: QuoteItem[]) {
  await createQuoteData(formData, items)
  revalidatePath('/crm/quotes')
  revalidatePath('/crm')
}
