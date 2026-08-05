'use client'

import { countries, currencies, CurrencyCode, useLandingCurrency } from "./LandingCurrencyProvider"

export function LandingCurrencyControls({ compact = false }: { compact?: boolean }) {
  const { country, currency, setCountry, setCurrency } = useLandingCurrency()

  return (
    <div className={`flex items-center gap-2 ${compact ? "w-full" : ""}`}>
      <select
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        className="h-9 min-w-0 rounded-md border border-[#cfd8d2] bg-white/90 px-2 text-xs font-black text-[#17201d] outline-none focus:border-[#0f5f55] sm:w-36"
        aria-label="Selectionner le pays"
      >
        {countries.map((item) => (
          <option key={item.name} value={item.name}>{item.name}</option>
        ))}
      </select>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
        className="h-9 rounded-md border border-[#cfd8d2] bg-white/90 px-2 text-xs font-black text-[#17201d] outline-none focus:border-[#0f5f55]"
        aria-label="Selectionner la devise"
      >
        {Object.entries(currencies).map(([code, config]) => (
          <option key={code} value={code}>{config.shortLabel}</option>
        ))}
      </select>
    </div>
  )
}
