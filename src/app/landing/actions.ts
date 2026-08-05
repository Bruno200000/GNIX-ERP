'use server'

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { redirect } from "next/navigation"

type LandingLead = {
  id: string
  createdAt: string
  plan: string
  name: string
  company: string
  email: string
  phone: string
  employees: string
  needs: string
}

function leadStorePath() {
  const baseDir = process.env.NODE_ENV === "production" ? "/tmp" : process.cwd()
  return path.join(baseDir, ".data", "landing-leads.json")
}

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function requestQuote(formData: FormData) {
  const filePath = leadStorePath()
  await mkdir(path.dirname(filePath), { recursive: true })

  let leads: LandingLead[] = []
  try {
    leads = JSON.parse(await readFile(filePath, "utf8"))
  } catch {
    leads = []
  }

  const lead: LandingLead = {
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    plan: valueOf(formData, "plan") || "sur-devis",
    name: valueOf(formData, "name"),
    company: valueOf(formData, "company"),
    email: valueOf(formData, "email"),
    phone: valueOf(formData, "phone"),
    employees: valueOf(formData, "employees"),
    needs: valueOf(formData, "needs"),
  }

  leads.unshift(lead)
  await writeFile(filePath, JSON.stringify(leads, null, 2), "utf8")
  redirect("/landing?sent=1#devis")
}
