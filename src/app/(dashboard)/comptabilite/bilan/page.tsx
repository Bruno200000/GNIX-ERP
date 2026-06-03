import { getAccountingEntries, getSalaryPayments } from "../actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, TrendingDown, TrendingUp } from "lucide-react"

function formatCurrency(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`
}

function accountBalance(entries: Awaited<ReturnType<typeof getAccountingEntries>>, prefixes: string[]) {
  return entries
    .filter((entry) => prefixes.some((prefix) => entry.account_code.startsWith(prefix)))
    .reduce((sum, entry) => sum + entry.debit - entry.credit, 0)
}

export default async function BalanceSheetPage() {
  const [entries, salaryPayments] = await Promise.all([getAccountingEntries(), getSalaryPayments()])
  const cash = accountBalance(entries, ["5"])
  const receivables = accountBalance(entries, ["4"])
  const fixedAssets = accountBalance(entries, ["2"])
  const salaryExpenses = salaryPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalAssets = Math.max(0, cash) + Math.max(0, receivables) + Math.max(0, fixedAssets)
  const liabilities = entries
    .filter((entry) => ["1", "4"].some((prefix) => entry.account_code.startsWith(prefix)))
    .reduce((sum, entry) => sum + entry.credit - entry.debit, 0)
  const revenue = entries
    .filter((entry) => entry.account_code.startsWith("7"))
    .reduce((sum, entry) => sum + entry.credit - entry.debit, 0)
  const recordedExpenses = entries
    .filter((entry) => entry.account_code.startsWith("6"))
    .reduce((sum, entry) => sum + entry.debit - entry.credit, 0)
  const expenses = recordedExpenses || salaryExpenses
  const result = revenue - expenses
  const equityAndResult = Math.max(0, liabilities) + result
  const gap = totalAssets - equityAndResult

  const activeRows = [
    { label: "Immobilisations", value: Math.max(0, fixedAssets), account: "Classe 2" },
    { label: "Clients et creances", value: Math.max(0, receivables), account: "Classe 4" },
    { label: "Tresorerie", value: Math.max(0, cash), account: "Classe 5" },
  ]

  const passiveRows = [
    { label: "Capitaux / dettes", value: Math.max(0, liabilities), account: "Classes 1 et 4" },
    { label: "Resultat estime", value: result, account: "Produits - charges" },
    { label: "Ecart a equilibrer", value: gap, account: "Controle" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bilan comptable</h1>
          <p className="text-sm text-slate-500">Vue synthetique de l'actif, du passif et du resultat estime.</p>
        </div>
        <Badge variant="outline" className={Math.abs(gap) < 1 ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-amber-200 bg-amber-50 text-amber-600"}>
          {Math.abs(gap) < 1 ? "Equilibre" : "A ajuster"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Total actif
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{formatCurrency(totalAssets)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <TrendingDown className="h-4 w-4 text-indigo-500" />
              Passif + resultat
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{formatCurrency(equityAndResult)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Scale className="h-4 w-4 text-amber-500" />
              Ecart
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-black">{formatCurrency(gap)}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <div className="font-bold text-slate-900">{row.label}</div>
                  <div className="text-xs text-slate-500">{row.account}</div>
                </div>
                <div className="font-black text-emerald-600">{formatCurrency(row.value)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {passiveRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                <div>
                  <div className="font-bold text-slate-900">{row.label}</div>
                  <div className="text-xs text-slate-500">{row.account}</div>
                </div>
                <div className={row.value < 0 ? "font-black text-red-600" : "font-black text-indigo-600"}>
                  {formatCurrency(row.value)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
