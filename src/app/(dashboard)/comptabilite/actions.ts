'use server'

import { revalidatePath } from 'next/cache'
import {
  createSalaryPaymentData,
  getAccountingEntriesData,
  getEmployeesData,
  getSalaryPaymentsData,
  type AccountingEntryRecord,
  type EmployeeRecord,
  type SalaryPaymentRecord,
} from '@/lib/erp-data'

export type SalaryPayment = SalaryPaymentRecord & {
  employee?: EmployeeRecord | null
}

export type AccountingEntry = AccountingEntryRecord

export async function getSalaryPayments() {
  return getSalaryPaymentsData()
}

export async function getAccountingEntries() {
  return getAccountingEntriesData()
}

export async function getPayrollEmployees() {
  return getEmployeesData()
}

export async function addSalaryPayment(formData: FormData) {
  await createSalaryPaymentData(formData)
  revalidatePath('/comptabilite')
  revalidatePath('/comptabilite/salaires')
  revalidatePath('/comptabilite/journal')
}
