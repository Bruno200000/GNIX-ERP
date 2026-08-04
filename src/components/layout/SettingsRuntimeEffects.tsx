'use client'

import { useEffect, useState } from "react"

type RuntimeSettings = {
  language?: string
  dark_mode?: boolean
  auto_translate?: boolean
}

export function SettingsRuntimeEffects({ settings }: { settings?: RuntimeSettings | null }) {
  const [isOffline, setIsOffline] = useState(false)

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

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-[80] -translate-x-1/2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 shadow-lg">
      Connexion instable: GNIX continue en mode local et resynchronisera les donnees disponibles.
    </div>
  )
}
