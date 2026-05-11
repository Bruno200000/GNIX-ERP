'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Employee = {
  id: string
  first_name: string
  last_name: string
  position: string
  department: string
  contract_type: string
  salary: number
  hire_date: string
}

export async function getEmployees() {
  const supabase = await createClient()
  
  // Dans la réalité on fait un join avec la table profiles
  const { data: employees, error } = await supabase
    .from('employees')
    .select(`
      id,
      position,
      department,
      contract_type,
      salary,
      hire_date,
      profiles (
        first_name,
        last_name,
        avatar_url
      )
    `)

  if (error) {
    console.error('Error fetching employees:', error)
    return []
  }

  // Formatage pour l'interface
  return employees.map((emp: any) => ({
    id: emp.id,
    first_name: emp.profiles?.first_name || 'Inconnu',
    last_name: emp.profiles?.last_name || '',
    position: emp.position,
    department: emp.department,
    contract_type: emp.contract_type,
    salary: emp.salary,
    hire_date: emp.hire_date
  })) as Employee[]
}

export async function addEmployee(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Vous devez être connecté.")

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!profile?.organization_id) throw new Error("Aucune organisation.")

  // Note: Dans un vrai système, on créerait un compte Auth.
  // Ici on simule en ajoutant directement dans la table profiles/employees.
  const newEmployee = {
    organization_id: profile.organization_id,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    department: formData.get('department') as string,
    position: formData.get('position') as string,
    salary: parseFloat(formData.get('salary') as string || '0'),
    hire_date: new Date().toISOString().split('T')[0],
    avatar_url: formData.get('avatar_url') as string || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.get('last_name')}`
  }

  // Insertion simplifiée (dépend du schéma exact)
  const { error } = await supabase.from('employees').insert([newEmployee])

  if (error) {
    console.error("Error creating employee:", error)
    throw new Error("Erreur lors de l'ajout de l'employé")
  }

  revalidatePath('/rh')
}
