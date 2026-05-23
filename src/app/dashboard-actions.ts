'use server'

import { getDashboardData } from '@/lib/erp-data'

export async function getDashboardStats() {
  return getDashboardData()
}
