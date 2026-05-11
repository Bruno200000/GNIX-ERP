'use server'

import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()

  // On récupère le profil pour avoir l'org_id
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) return null

  const orgId = profile.organization_id

  // 1. Revenu Total (Somme des factures payées)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('total_amount, status')
    .eq('organization_id', orgId)

  const totalRevenue = invoices?.reduce((acc, inv) => acc + (inv.total_amount || 0), 0) || 0

  // 2. Nombre de Clients
  const { count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)

  // 3. Tâches en cours (ou projets actifs)
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)

  // 4. Score IA (Moyenne des scores clients)
  const { data: clientScores } = await supabase
    .from('clients')
    .select('ai_conversion_score')
    .eq('organization_id', orgId)

  const avgScore = clientScores && clientScores.length > 0
    ? Math.round(clientScores.reduce((acc, c) => acc + (c.ai_conversion_score || 0), 0) / clientScores.length)
    : 0

  return {
    totalRevenue,
    clientsCount: clientsCount || 0,
    projectsCount: projectsCount || 0,
    avgScore
  }
}
