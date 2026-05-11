'use client'

import { login } from './actions'
import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Lock, User } from "lucide-react"

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = use(searchParams)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex bg-white">
      {/* Colonne Gauche - Formulaire */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24">
        <div className="w-full max-w-[420px] space-y-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-6 animate-in zoom-in duration-700">
              <Image 
                src="/logo.png" 
                alt="GNIX ERP Logo" 
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-extrabold text-[#1a1a1a] tracking-tight">GNIX ERP</h1>
            <p className="mt-2 text-[#666666] font-semibold tracking-[0.2em] text-xs uppercase">Gestion Intelligente</p>
          </div>

          <form action={login} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-sm font-bold text-[#333] ml-1">Identifiant ou Email</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-[#2189C7] transition-colors" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="votre@email.com" 
                    className="bg-[#FFFCE0]/50 border-slate-200 focus:border-[#2189C7] focus:ring-[#2189C7] h-14 pl-12 text-md rounded-xl transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-sm font-bold text-[#333] ml-1">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-[#2189C7] transition-colors" />
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="Votre mot de passe"
                    className="bg-[#FFFCE0]/50 border-slate-200 focus:border-[#2189C7] focus:ring-[#2189C7] h-14 pl-12 pr-12 text-md rounded-xl transition-all shadow-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2189C7] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {resolvedSearchParams?.error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium animate-in fade-in slide-in-from-top-1">
                {resolvedSearchParams.error}
              </div>
            )}

            <div className="pt-2">
              <Button 
                type="submit"
                className="w-full h-14 bg-[#2189C7] hover:bg-[#1a6e9f] text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Se Connecter
              </Button>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-slate-300 rounded" />
                <label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">
                  Rester connecté
                </label>
              </div>
              <button type="button" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Oublié ?
              </button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-medium">Nouveau ici ?</span>
              </div>
            </div>

            <Link href="/register" className="block">
              <Button variant="outline" className="w-full h-14 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">
                Créer un compte entreprise
              </Button>
            </Link>
          </form>
        </div>
      </div>

      {/* Colonne Droite - Citation (Proverbes Africains) */}
      <div className="hidden lg:flex flex-1 bg-[#0F172A] justify-center items-center p-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-1 bg-orange-500 mb-8" />
          <p className="text-5xl font-light text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            “ Si tu veux aller vite, marche seul. Si tu veux aller loin, marchons ensemble. ”
          </p>
          <div className="mt-12 space-y-2">
            <p className="text-xl text-slate-400 font-medium italic">Sagesse Africaine</p>
            <p className="text-sm text-slate-500 max-w-sm">
              Chez GNIX, nous croyons en la force du collectif et de l'intelligence partagée pour propulser votre entreprise.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
