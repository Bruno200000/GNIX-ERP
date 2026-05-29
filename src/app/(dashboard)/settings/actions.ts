'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
  const section = formData.get('settings_section')
  await updateSettingsData(formData)
  revalidatePath('/settings')
  revalidatePath('/', 'layout')
  if (section === 'security') redirect('/settings/security?saved=security')
  if (typeof section === 'string' && section) redirect(`/settings?tab=${section}&saved=${section}`)
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
