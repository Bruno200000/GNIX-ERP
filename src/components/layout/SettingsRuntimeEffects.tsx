'use client'

import { useEffect } from "react"

type RuntimeSettings = {
  language?: string
  dark_mode?: boolean
  auto_translate?: boolean
}

export function SettingsRuntimeEffects({ settings }: { settings?: RuntimeSettings | null }) {
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
  }, [settings?.language, settings?.dark_mode, settings?.auto_translate])

  return null
}
