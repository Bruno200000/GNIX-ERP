'use client'

import Link from "next/link"
import { ArrowRight, CheckCircle2, Globe2 } from "lucide-react"
import { currencies, CurrencyCode, useLandingCurrency } from "./LandingCurrencyProvider"

const plans = [
  {
    name: "Essentiel",
    baseXof: 100000,
    href: "/register?plan=essentiel",
    description: "Pour lancer un ERP solide avec CRM, ventes, RH et suivi simple.",
    features: ["CRM et clients", "Facturation", "Gestion RH", "Chat interne"],
  },
  {
    name: "Professionnel",
    baseXof: 200000,
    href: "/register?plan=professionnel",
    description: "Pour piloter l'activite avec IA, comptabilite, marketplace et notifications.",
    features: ["IA multi-modeles", "Comptabilite avancee", "Marketplace apps", "Centre de notification"],
    highlighted: true,
  },
  {
    name: "Entreprise",
    baseXof: null,
    href: "#devis",
    description: "Pour deploiement complet, personnalisation, support et integration sur mesure.",
    features: ["Modules personnalises", "Connexion logiciels", "Securite renforcee", "Accompagnement"],
  },
]

function formatPrice(amountXof: number | null, currency: CurrencyCode) {
  if (!amountXof) return "Sur devis"
  const config = currencies[currency]
  const converted = amountXof * config.rateFromXof

  if (currency === "XOF") {
    return `${Math.round(converted).toLocaleString(config.locale)}f`
  }

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(converted)
}

export function PricingPlans() {
  const { currency, selectedCountry } = useLandingCurrency()

  return (
    <section id="tarifs" className="bg-[#f7f8f4] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0f5f55]">Plans tarifaires</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-5xl">
              Choisissez le niveau qui correspond a votre organisation.
            </h2>
          </div>

          <div className="rounded-md border border-[#dfe7df] bg-white p-4 text-xs font-bold text-[#5b6862] shadow-sm lg:min-w-[360px]">
            <div className="flex items-center gap-2">
              <Globe2 className="size-4 text-[#0f5f55]" />
              {selectedCountry.name} affiche les prix en {currencies[currency].label}. Modifiez le pays ou la devise dans la barre de navigation.
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`rounded-md border p-7 shadow-sm ${plan.highlighted ? "border-[#0f5f55] bg-[#eff8f3] shadow-[#0f5f55]/10" : "border-[#dde5dd] bg-white"}`}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-black">{plan.name}</h3>
                {plan.highlighted ? <span className="rounded-full bg-[#0f5f55] px-3 py-1 text-xs font-black text-white">Populaire</span> : null}
              </div>
              <p className="mt-5 text-4xl font-black text-[#111814]">{formatPrice(plan.baseXof, currency)}</p>
              {plan.baseXof ? (
                <p className="mt-2 text-xs font-bold text-[#6a7771]">Base: {plan.baseXof.toLocaleString("fr-FR")}f</p>
              ) : null}
              <p className="mt-4 min-h-20 text-sm font-medium leading-6 text-[#5b6862]">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-bold text-[#2b3733]">
                    <CheckCircle2 className="size-5 text-[#0f5f55]" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black ${plan.highlighted ? "bg-[#0f5f55] text-white hover:bg-[#0b4b43]" : "bg-[#17201d] text-white hover:bg-[#26332e]"}`}>
                {plan.baseXof ? "Acheter ce plan" : "Demander le prix"} <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
