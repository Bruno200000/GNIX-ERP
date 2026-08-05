'use client'

import Link from "next/link"
import { AlertTriangle, Home, RefreshCcw, ShieldCheck } from "lucide-react"

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-amber-300">Connexion instable</p>
        <h1 className="mt-3 text-4xl font-black tracking-normal">GNIX ERP reste disponible en mode securise.</h1>
        <p className="mt-5 text-base font-medium leading-7 text-slate-300">
          Une partie du service ne repond pas correctement. Vous pouvez revenir au tableau de bord ou relancer la page; les actions sensibles restent protegees pour eviter les enregistrements incomplets.
        </p>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          Les donnees disponibles restent consultables pendant que la connexion est retablie.
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-amber-100"
          >
            <RefreshCcw className="h-4 w-4" />
            Reessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
      </section>
    </main>
  )
}
