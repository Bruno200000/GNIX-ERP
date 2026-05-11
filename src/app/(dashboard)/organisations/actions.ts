'use server'

import { createClient } from '@/lib/supabase/server'

export type Member = {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  is_active: boolean
  created_at: string
}

export type Organization = {
  id: string
  name: string
  domain: string | null
  settings: any
  created_at: string
}

export async function getOrganizationDetails() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // On récupère le profil pour avoir l'org_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) return null

  // On récupère les détails de l'organisation
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.organization_id)
    .single()

  if (orgError) {
    console.error('Error fetching organization:', orgError)
    return null
  }

  // On récupère tous les membres de l'organisation
  const { data: members, error: membersError } = await supabase
    .from('profiles')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: true })

  if (membersError) {
    console.error('Error fetching members:', membersError)
    return { ...org, members: [] }
  }

  return { ...org, members }
}
