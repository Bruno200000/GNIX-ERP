'use client'

import { createContext, useContext, useMemo, useState } from "react"

export type CurrencyCode = "XOF" | "EUR" | "USD" | "CAD"

export const currencies: Record<CurrencyCode, { label: string; shortLabel: string; rateFromXof: number; locale: string }> = {
  XOF: { label: "Franc CFA", shortLabel: "FCFA", rateFromXof: 1, locale: "fr-FR" },
  EUR: { label: "Euro", shortLabel: "EUR", rateFromXof: 1 / 655.957, locale: "fr-FR" },
  USD: { label: "Dollar US", shortLabel: "USD", rateFromXof: 0.001734, locale: "en-US" },
  CAD: { label: "Dollar canadien", shortLabel: "CAD", rateFromXof: 0.002444, locale: "en-CA" },
}

export const countries = [
  { name: "Cote d'Ivoire", currency: "XOF" },
  { name: "Senegal", currency: "XOF" },
  { name: "Benin", currency: "XOF" },
  { name: "Burkina Faso", currency: "XOF" },
  { name: "Mali", currency: "XOF" },
  { name: "Niger", currency: "XOF" },
  { name: "Togo", currency: "XOF" },
  { name: "France", currency: "EUR" },
  { name: "Belgique", currency: "EUR" },
  { name: "Allemagne", currency: "EUR" },
  { name: "Italie", currency: "EUR" },
  { name: "Espagne", currency: "EUR" },
  { name: "Etats-Unis", currency: "USD" },
  { name: "Canada", currency: "CAD" },
  { name: "Royaume-Uni", currency: "USD" },
  { name: "Maroc", currency: "USD" },
  { name: "Ghana", currency: "USD" },
  { name: "Nigeria", currency: "USD" },
] satisfies { name: string; currency: CurrencyCode }[]

type LandingCurrencyContextValue = {
  country: string
  currency: CurrencyCode
  selectedCountry: (typeof countries)[number]
  setCountry: (country: string) => void
  setCurrency: (currency: CurrencyCode) => void
}

const LandingCurrencyContext = createContext<LandingCurrencyContextValue | null>(null)

export function LandingCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [country, updateCountry] = useState(countries[0].name)
  const [currency, updateCurrency] = useState<CurrencyCode>("XOF")

  const selectedCountry = useMemo(
    () => countries.find((item) => item.name === country) ?? countries[0],
    [country]
  )

  const value = useMemo<LandingCurrencyContextValue>(() => ({
    country,
    currency,
    selectedCountry,
    setCountry(nextCountryName) {
      const nextCountry = countries.find((item) => item.name === nextCountryName) ?? countries[0]
      updateCountry(nextCountry.name)
      updateCurrency(nextCountry.currency)
    },
    setCurrency(nextCurrency) {
      updateCurrency(nextCurrency)
    },
  }), [country, currency, selectedCountry])

  return (
    <LandingCurrencyContext.Provider value={value}>
      {children}
    </LandingCurrencyContext.Provider>
  )
}

export function useLandingCurrency() {
  const context = useContext(LandingCurrencyContext)
  if (!context) throw new Error("useLandingCurrency must be used within LandingCurrencyProvider")
  return context
}
