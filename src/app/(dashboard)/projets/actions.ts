'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Task = {
  id: string
  name: string
  status: string
  ai_estimated_hours: number
}

export type Project = {
  id: string
  name: string
  status: string
  deadline: string
  tasks: Task[]
}

export async function getProjects() {
  const supabase = await createClient()
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      status,
      deadline,
      tasks (
        id,
        name,
        status,
        ai_estimated_hours
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects as unknown as Project[]
}

export async function addProject(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  const newProject = {
    organization_id: profile.organization_id,
    client_id: formData.get('client_id') as string,
    name: formData.get('name') as string,
    status: formData.get('status') as string || 'active',
    deadline: formData.get('deadline') as string,
  }

  const { error } = await supabase.from('projects').insert([newProject])

  if (error) {
    console.error("Error creating project:", error)
    throw new Error("Erreur lors de la création du projet")
  }

  revalidatePath('/projets')
}
