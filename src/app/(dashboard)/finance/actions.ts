'use server'

import { revalidatePath } from 'next/cache'
import {
  createInvoiceData,
  createPaymentData,
  getInvoicesData,
  getPaymentsData,
  type ClientRecord,
  type InvoiceRecord,
  type PaymentRecord,
} from '@/lib/erp-data'

export type Invoice = InvoiceRecord & {
  clients?: ClientRecord | null
}

export type Payment = PaymentRecord & {
  invoice?: Invoice | null
}

export async function getInvoices() {
  return getInvoicesData()
}

export async function addInvoice(formData: FormData) {
  await createInvoiceData(formData)
  revalidatePath('/finance')
  revalidatePath('/finance/anomalies')
  revalidatePath('/', 'layout')
}

export async function getPayments() {
  return getPaymentsData()
}

export async function addPayment(formData: FormData) {
  await createPaymentData(formData)
  revalidatePath('/finance/payments')
  revalidatePath('/finance')
  revalidatePath('/', 'layout')
}
