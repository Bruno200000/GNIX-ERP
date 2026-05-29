'use server'

import { revalidatePath } from 'next/cache'
import {
  approveOrganizationMemberData,
  getOrganizationData,
  inviteOrganizationMemberData,
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

export async function inviteOrganizationMember(formData: FormData) {
  await inviteOrganizationMemberData(formData)
  revalidatePath('/organisations')
}

export async function approveOrganizationMember(formData: FormData) {
  await approveOrganizationMemberData(formData)
  revalidatePath('/organisations')
}
