'use client'

import { useEffect, useState } from "react"
import { AlertTriangle, CloudOff, LockKeyhole, RefreshCcw } from "lucide-react"

type RuntimeSettings = {
  language?: string
  dark_mode?: boolean
  auto_translate?: boolean
}

export function SettingsRuntimeEffects({
  settings,
  connectionDegraded = false,
}: {
  settings?: RuntimeSettings | null
  connectionDegraded?: boolean
}) {
  const [isOffline, setIsOffline] = useState(false)
  const [noticeVisible, setNoticeVisible] = useState(false)
  const actionsLocked = isOffline || connectionDegraded

  useEffect(() => {
    const root = document.documentElement
    const language = settings?.language || "fr"

    root.lang = language
    root.classList.toggle("dark", Boolean(settings?.dark_mode))
    root.dataset.language = language
    root.dataset.autoTranslate = settings?.auto_translate ? "true" : "false"

    window.localStorage.setItem("gnix_language", language)
    window.localStorage.setItem("gnix_dark_mode", settings?.dark_mode ? "true" : "false")
    window.localStorage.setItem("gnix_auto_translate", settings?.auto_translate ? "true" : "false")

    if (language === "en" && settings?.auto_translate) {
      const dictionary: Record<string, string> = {
        "Dashboard": "Dashboard",
        "CRM & Ventes": "CRM & Sales",
        "RH & PrÃ©sences": "HR & Attendance",
        "Finance & TrÃ©sorerie": "Finance & Cashflow",
        "Comptabilite": "Accounting",
        "App Marketplace": "App Marketplace",
        "Chat Interne": "Internal Chat",
        "Parametres": "Settings",
        "Langue de l'interface": "Interface language",
        "Mode Sombre": "Dark mode",
        "Auto-Traduction IA": "AI auto-translation",
        "Intelligence Artificielle": "Artificial Intelligence",
        "Notifications": "Notifications",
        "Securite": "Security",
        "Facturation": "Billing",
      }

      document.querySelectorAll("h1,h2,h3,button,a,label,span,div").forEach((node) => {
        const text = node.textContent?.trim()
        if (text && dictionary[text] && node.childNodes.length === 1) {
          node.textContent = dictionary[text]
        }
      })
    }
  }, [settings?.language, settings?.dark_mode, settings?.auto_translate])

  useEffect(() => {
    const updateStatus = () => setIsOffline(!window.navigator.onLine)
    updateStatus()
    window.addEventListener("online", updateStatus)
    window.addEventListener("offline", updateStatus)
    return () => {
      window.removeEventListener("online", updateStatus)
      window.removeEventListener("offline", updateStatus)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle("gnix-actions-locked", actionsLocked)

    function blockProtectedSubmit(event: SubmitEvent) {
      const form = event.target instanceof HTMLFormElement ? event.target : null
      if (!form || form.dataset.allowOfflineActions === "true") return
      if (!actionsLocked) return

      event.preventDefault()
      event.stopPropagation()
      setNoticeVisible(true)
      window.setTimeout(() => setNoticeVisible(false), 4500)
    }

    document.addEventListener("submit", blockProtectedSubmit, true)
    return () => {
      document.body.classList.remove("gnix-actions-locked")
      document.removeEventListener("submit", blockProtectedSubmit, true)
    }
  }, [actionsLocked])

  if (!actionsLocked) return null

  const title = isOffline ? "Connexion internet interrompue" : "Connexion cloud indisponible"
  const description = isOffline
    ? "GNIX reste consultable avec les donnees disponibles. Les actions sont bloquees jusqu'au retour de la connexion."
    : "Le service de donnees ne repond pas correctement. L'interface reste ouverte en lecture seule pour eviter les erreurs."

  return (
    <>
      <div className="fixed inset-x-4 top-20 z-[80] mx-auto max-w-5xl overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl shadow-amber-900/10 dark:border-amber-900/50 dark:bg-slate-950">
        <div className="flex flex-col gap-4 border-l-4 border-amber-500 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              {isOffline ? <CloudOff className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            <div>
              <div className="text-sm font-black text-slate-950 dark:text-white">{title}</div>
              <div className="mt-1 max-w-2xl text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">{description}</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <LockKeyhole className="h-3.5 w-3.5" />
                Mode lecture seule
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white transition-colors hover:bg-indigo-600 dark:bg-white dark:text-slate-950"
          >
            <RefreshCcw className="h-4 w-4" />
            Reessayer
          </button>
        </div>
      </div>

      {noticeVisible ? (
        <div className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800 shadow-lg">
          Action bloquee: la connexion doit etre retablie avant d'enregistrer des modifications.
        </div>
      ) : null}
    </>
  )
}
