import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react"
import { requestQuote } from "./actions"

const plans = [
  {
    name: "Essentiel",
    price: "100000f",
    href: "/register?plan=essentiel",
    description: "Pour lancer un ERP solide avec CRM, ventes, RH et suivi simple.",
    features: ["CRM et clients", "Facturation", "Gestion RH", "Chat interne"],
  },
  {
    name: "Professionnel",
    price: "200000f",
    href: "/register?plan=professionnel",
    description: "Pour piloter l'activite avec IA, comptabilite, marketplace et notifications.",
    features: ["IA multi-modeles", "Comptabilite avancee", "Marketplace apps", "Centre de notification"],
    highlighted: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    href: "#devis",
    description: "Pour deploiement complet, personnalisation, support et integration sur mesure.",
    features: ["Modules personnalises", "Connexion logiciels", "Securite renforcee", "Accompagnement"],
  },
]

const modules = [
  { icon: BarChart3, label: "Finance", text: "Suivi des revenus, paiements, bilan et anomalies." },
  { icon: Users, label: "RH", text: "Employes, presences, conges, salaires et evaluations." },
  { icon: MessageSquare, label: "Communication", text: "Chat interne, canaux, appels et resume IA." },
  { icon: Workflow, label: "Operations", text: "Logistique, stocks, projets, tickets et automatisations." },
]

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>
}) {
  const params = await searchParams
  const sent = params.sent === "1"

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#17201d]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/35 bg-[#f7f8f4]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/landing" className="flex items-center gap-3">
            <Image src="/logo.png" alt="GNIX ERP" width={36} height={36} className="rounded-md" priority />
            <span className="text-sm font-black tracking-[0.22em] text-[#111814]">GNIX ERP</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-[#52615b] md:flex">
            <a href="#modules" className="hover:text-[#0f5f55]">Modules</a>
            <a href="#tarifs" className="hover:text-[#0f5f55]">Tarifs</a>
            <a href="#devis" className="hover:text-[#0f5f55]">Devis</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-md px-4 py-2 text-sm font-bold text-[#17201d] hover:bg-white">
              Connexion
            </Link>
            <Link href="#devis" className="inline-flex items-center gap-2 rounded-md bg-[#17201d] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#0f5f55]">
              Acheter <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[92vh] overflow-hidden pt-16">
        <Image
          src="/gnix-erp-hero.png"
          alt="Apercu professionnel du logiciel GNIX ERP"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,248,244,0.98)_0%,rgba(247,248,244,0.78)_38%,rgba(247,248,244,0.2)_78%)]" />
        <div className="relative mx-auto flex min-h-[calc(92vh-4rem)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-gnix-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8d8d1] bg-white/80 px-4 py-2 text-sm font-bold text-[#0f5f55] shadow-sm">
              <Sparkles className="size-4" /> ERP intelligent pret pour les PME ambitieuses
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-[#111814] sm:text-6xl lg:text-7xl">
              GNIX ERP
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-[#41524c] sm:text-xl">
              Vendez, facturez, payez les salaires, analysez vos emails, connectez vos apps et pilotez vos equipes avec une IA configurable.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#tarifs" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0f5f55] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#0f5f55]/20 hover:bg-[#0b4b43]">
                Voir les plans <CreditCard className="size-4" />
              </Link>
              <Link href="#devis" className="inline-flex items-center justify-center gap-2 rounded-md border border-[#cfd8d2] bg-white/85 px-6 py-3 text-sm font-black text-[#17201d] hover:bg-white">
                Demander un devis <FileText className="size-4" />
              </Link>
            </div>
          </div>
          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {["CRM", "Comptabilite", "IA", "Marketplace"].map((item, index) => (
              <div
                key={item}
                className="animate-gnix-float rounded-md border border-white/70 bg-white/80 px-4 py-3 text-sm font-black shadow-sm backdrop-blur"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0f5f55]">Logiciel complet</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-normal text-[#111814] sm:text-5xl">
                Toutes les operations critiques dans un meme espace.
              </h2>
            </div>
            <p className="max-w-md text-base font-medium leading-7 text-[#52615b]">
              GNIX ERP relie les ventes, la comptabilite, les ressources humaines, la logistique, le support et l'IA sans changer vos habitudes.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => (
              <article key={module.label} className="rounded-md border border-[#e1e7e1] bg-[#fbfcf8] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <module.icon className="size-8 text-[#0f5f55]" />
                <h3 className="mt-5 text-xl font-black">{module.label}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[#5b6862]">{module.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#17201d] py-5 text-white">
        <div className="animate-gnix-marquee flex w-max gap-10 whitespace-nowrap text-sm font-black uppercase tracking-[0.2em] text-white/75">
          {Array.from({ length: 2 }).map((_, group) => (
            <span key={group} className="flex gap-10">
              <span>IA multi-modeles</span>
              <span>Facturation</span>
              <span>Chat interne</span>
              <span>Marketplace</span>
              <span>Mode sombre</span>
              <span>Notifications</span>
            </span>
          ))}
        </div>
      </section>

      <section id="tarifs" className="bg-[#f7f8f4] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0f5f55]">Plans tarifaires</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-5xl">Choisissez le niveau qui correspond a votre organisation.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={`rounded-md border p-7 shadow-sm ${plan.highlighted ? "border-[#0f5f55] bg-[#eff8f3] shadow-[#0f5f55]/10" : "border-[#dde5dd] bg-white"}`}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  {plan.highlighted ? <span className="rounded-full bg-[#0f5f55] px-3 py-1 text-xs font-black text-white">Populaire</span> : null}
                </div>
                <p className="mt-5 text-4xl font-black text-[#111814]">{plan.price}</p>
                <p className="mt-4 min-h-20 text-sm font-medium leading-6 text-[#5b6862]">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-bold text-[#2b3733]">
                      <CheckCircle2 className="size-5 text-[#0f5f55]" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black ${plan.highlighted ? "bg-[#0f5f55] text-white hover:bg-[#0b4b43]" : "bg-[#17201d] text-white hover:bg-[#26332e]"}`}>
                  {plan.price === "Sur devis" ? "Demander le prix" : "Acheter ce plan"} <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="devis" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#0f5f55]">Achat du logiciel</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-5xl">Un devis clair pour installer GNIX ERP chez vous.</h2>
            <p className="mt-6 text-base font-medium leading-7 text-[#52615b]">
              Le formulaire enregistre votre demande et prepare les informations necessaires pour le suivi commercial.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="flex gap-4 rounded-md border border-[#e1e7e1] p-4">
                <ShieldCheck className="size-7 shrink-0 text-[#0f5f55]" />
                <div>
                  <h3 className="font-black">Securite et controle</h3>
                  <p className="mt-1 text-sm text-[#5b6862]">Acces, roles, audits, notifications et integrations controlees.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-md border border-[#e1e7e1] p-4">
                <Bot className="size-7 shrink-0 text-[#0f5f55]" />
                <div>
                  <h3 className="font-black">IA configurable</h3>
                  <p className="mt-1 text-sm text-[#5b6862]">OpenAI, Gemini, OpenRouter, Kimi ou fournisseur compatible.</p>
                </div>
              </div>
            </div>
          </div>

          <form action={requestQuote} className="rounded-md border border-[#dfe7df] bg-[#fbfcf8] p-6 shadow-sm">
            {sent ? (
              <div className="mb-5 rounded-md border border-[#b8d8d1] bg-[#edf8f5] px-4 py-3 text-sm font-bold text-[#0f5f55]">
                Votre demande a ete enregistree. L'equipe peut vous recontacter avec les details.
              </div>
            ) : null}
            <input type="hidden" name="plan" value="sur-devis" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">
                Nom complet
                <input name="name" required className="rounded-md border border-[#ccd8d0] bg-white px-4 py-3 font-medium outline-none focus:border-[#0f5f55]" />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Entreprise
                <input name="company" required className="rounded-md border border-[#ccd8d0] bg-white px-4 py-3 font-medium outline-none focus:border-[#0f5f55]" />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Email
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 size-4 text-[#7a8882]" />
                  <input type="email" name="email" required className="w-full rounded-md border border-[#ccd8d0] bg-white py-3 pl-10 pr-4 font-medium outline-none focus:border-[#0f5f55]" />
                </div>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Telephone
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-3.5 size-4 text-[#7a8882]" />
                  <input name="phone" required className="w-full rounded-md border border-[#ccd8d0] bg-white py-3 pl-10 pr-4 font-medium outline-none focus:border-[#0f5f55]" />
                </div>
              </label>
              <label className="grid gap-2 text-sm font-black sm:col-span-2">
                Taille de l'equipe
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-3.5 size-4 text-[#7a8882]" />
                  <select name="employees" className="w-full rounded-md border border-[#ccd8d0] bg-white py-3 pl-10 pr-4 font-medium outline-none focus:border-[#0f5f55]">
                    <option>1-10 utilisateurs</option>
                    <option>11-50 utilisateurs</option>
                    <option>51-200 utilisateurs</option>
                    <option>Plus de 200 utilisateurs</option>
                  </select>
                </div>
              </label>
              <label className="grid gap-2 text-sm font-black sm:col-span-2">
                Besoin principal
                <textarea name="needs" rows={5} required className="resize-none rounded-md border border-[#ccd8d0] bg-white px-4 py-3 font-medium outline-none focus:border-[#0f5f55]" />
              </label>
            </div>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0f5f55] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#0f5f55]/20 hover:bg-[#0b4b43]">
              Envoyer la demande <ArrowRight className="size-4" />
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
