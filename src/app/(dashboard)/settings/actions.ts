'use server'

import { revalidatePath } from 'next/cache'
import {
  getAuditLogsData,
  getOrganizationData,
  getProfileData,
  getSettingsData,
  updateOrganizationData,
  updateProfileData,
  updateSettingsData,
} from '@/lib/erp-data'
import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  return getProfileData()
}

export async function getOrganizationSettings() {
  return getOrganizationData()
}

export async function getAppSettings() {
  return getSettingsData()
}

export async function getAuditLogs() {
  return getAuditLogsData()
}

export async function saveProfile(formData: FormData) {
  await updateProfileData(formData)
  revalidatePath('/settings/profile')
}

export async function saveOrganization(formData: FormData) {
  await updateOrganizationData(formData)
  revalidatePath('/settings/organisation')
  revalidatePath('/organisations')
}

export async function saveSettings(formData: FormData) {
  await updateSettingsData(formData)
  revalidatePath('/settings')
}

export async function requestPasswordReset() {
  const supabase = await createClient()
  const profile = await getProfileData()

  if (supabase && profile?.email) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${siteUrl}/settings/security`,
    })
  }

  revalidatePath('/settings')
  revalidatePath('/settings/security')
}
