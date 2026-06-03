import Link from "next/link"
import { getAccountingEntries, getSalaryPayments } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileSpreadsheet, WalletCards, BookOpenCheck, Scale } from "lucide-react"

export default async function ComptabilitePage() {
  const [salaryPayments, entries] = await Promise.all([getSalaryPayments(), getAccountingEntries()])
  const totalSalaries = salaryPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Comptabilite</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Suivi des salaires, journal comptable et plan des comptes.
          </p>
        </div>
        <Link
          href="/comptabilite/salaires"
          className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <WalletCards className="h-4 w-4" />
          Paiement de salaire
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <WalletCards className="h-4 w-4 text-emerald-500" />
              Salaires payes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{totalSalaries.toLocaleString("fr-FR")} FCFA</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <BookOpenCheck className="h-4 w-4 text-indigo-500" />
              Debit journal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{totalDebit.toLocaleString("fr-FR")} FCFA</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Calculator className="h-4 w-4 text-amber-500" />
              Credit journal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{totalCredit.toLocaleString("fr-FR")} FCFA</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { href: "/comptabilite/salaires", title: "Paiement de salaire", description: "Enregistrer et suivre les salaires.", icon: WalletCards },
          { href: "/comptabilite/journal", title: "Journal comptable", description: "Consulter les ecritures generees.", icon: BookOpenCheck },
          { href: "/comptabilite/plan-comptable", title: "Plan comptable", description: "Voir les comptes utilises.", icon: FileSpreadsheet },
          { href: "/comptabilite/bilan", title: "Bilan comptable", description: "Analyser actif, passif et equilibre.", icon: Scale },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <item.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="text-sm text-slate-500">{item.description}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
