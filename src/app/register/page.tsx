'use client'

import { signup } from '../login/actions'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Building2, User, Mail, Lock, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")

  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get("plan")
    setSelectedPlan(plan || "")
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await signup(formData)
    } catch (e: any) {
      // Dans Next.js 14+, redirect() jette une erreur spéciale.
      // Si on est dans un try/catch, il faut la laisser passer.
      if (e.message === 'NEXT_REDIRECT' || e.digest?.includes('NEXT_REDIRECT')) {
        throw e
      }
      setError("Une erreur est survenue lors de la création du compte. Vérifiez vos informations.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Colonne Gauche - Formulaire */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24">
        <div className="w-full max-w-[480px] space-y-8 py-12">
          <Link href="/login" className="flex items-center text-sm font-bold text-slate-400 hover:text-[#2189C7] transition-colors mb-8 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Retour à la connexion
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1a1a]">Créer votre espace ERP</h1>
            <p className="mt-2 text-slate-500 font-medium">Rejoignez GNIX ERP et commencez à gérer votre entreprise intelligemment.</p>
            {selectedPlan ? (
              <div className="mt-4 rounded-xl border border-[#2189C7]/20 bg-[#2189C7]/10 px-4 py-3 text-sm font-bold text-[#1a6e9f]">
                Plan selectionne: {selectedPlan === "professionnel" ? "Professionnel - 200000f" : "Essentiel - 100000f"}
              </div>
            ) : null}
          </div>

          <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="billing_plan" value={selectedPlan} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-sm font-bold text-[#333] ml-1">Nom de l'Entreprise</Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                    id="company_name" 
                    name="company_name" 
                    required 
                    placeholder="ex: Ma Société SARL" 
                    className="bg-slate-50 border-slate-200 focus:border-[#2189C7] h-14 pl-12 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-bold text-[#333] ml-1">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input id="first_name" name="first_name" required placeholder="Jean" className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-bold text-[#333] ml-1">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input id="last_name" name="last_name" required placeholder="Dupont" className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-[#333] ml-1">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="jean@societe.com" 
                    className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold text-[#333] ml-1">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    className="bg-slate-50 border-slate-200 h-14 pl-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-14 bg-[#2189C7] hover:bg-[#1a6e9f] text-white text-lg font-bold rounded-xl shadow-lg transition-all">
              {loading ? "Création en cours..." : "Créer mon compte entreprise"}
            </Button>

            <p className="text-center text-xs text-slate-400 px-4">
              En créant un compte, vous acceptez nos <button type="button" className="underline">Conditions d'Utilisation</button> et notre <button type="button" className="underline">Politique de Confidentialité</button>.
            </p>
          </form>
        </div>
      </div>

      {/* Colonne Droite - Identité (Proverbe Africain) */}
      <div className="hidden lg:flex flex-[0.6] bg-[#0F172A] justify-center items-center p-24 border-l border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1E293B] to-[#0F172A]" />
        
        <div className="relative z-10 max-w-sm text-center">
          <div className="w-12 h-1 bg-indigo-500 mx-auto mb-8" />
          <p className="text-4xl font-light text-white leading-tight mb-8">
            “ C'est au bout de la vieille corde qu'on tisse la nouvelle. ”
          </p>
          <div className="space-y-2">
            <p className="text-xl text-slate-400 font-medium italic">Sagesse Africaine</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              GNIX ERP vous aide à moderniser vos acquis pour construire le futur de votre entreprise.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
