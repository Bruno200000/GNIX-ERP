'use server'

import { revalidatePath } from 'next/cache'
import {
  getOrganizationData,
  updateOrganizationData,
  type JsonValue,
  type ProfileRecord,
} from '@/lib/erp-data'

export type Member = ProfileRecord

export type Organization = {
  id: string
  name: string
  domain: string | null
  settings: Record<string, JsonValue>
  created_at: string
  members: Member[]
}

export async function getOrganizationDetails() {
  return getOrganizationData()
}

export async function updateOrganization(formData: FormData) {
  await updateOrganizationData(formData)
  revalidatePath('/organisations')
  revalidatePath('/settings/organisation')
}
