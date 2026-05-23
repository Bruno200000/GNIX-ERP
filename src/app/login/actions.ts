'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

async function setLocalSession(email: string) {
  const cookieStore = await cookies()
  cookieStore.set('gnix_demo_user', encodeURIComponent(email || 'demo@gnix.local'), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })
}

async function clearLocalSession() {
  const cookieStore = await cookies()
  cookieStore.delete('gnix_demo_user')
}

async function withAuthTimeout(operation: Promise<{ error: unknown }>) {
  return Promise.race([
    operation.then((result) => ({ error: result.error })),
    new Promise<{ error: Error }>((resolve) => setTimeout(() => resolve({ error: new Error('Auth locale') }), 1800)),
  ])
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await withAuthTimeout(supabase.auth.signInWithPassword(data))

  if (error) {
    await setLocalSession(data.email)
    revalidatePath('/', 'layout')
    redirect('/')
  }

  await clearLocalSession()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        company_name: formData.get('company_name') as string,
      }
    }
  }

  const { error } = await withAuthTimeout(supabase.auth.signUp(data))

  if (error) {
    await setLocalSession(data.email)
    revalidatePath('/', 'layout')
    redirect('/')
  }

  await setLocalSession(data.email)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  await clearLocalSession()
  redirect('/login')
}
