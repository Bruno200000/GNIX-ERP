import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet } from "lucide-react"

const accounts = [
  { code: "411", label: "Clients", type: "Actif" },
  { code: "512", label: "Banque", type: "Tresorerie" },
  { code: "641", label: "Charges de personnel", type: "Charge" },
  { code: "706", label: "Prestations de services", type: "Produit" },
]

export default function AccountingPlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plan comptable</h1>
        <p className="text-sm text-slate-500">Comptes de base utilises par GNIX ERP.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-indigo-500" />
            Comptes
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {accounts.map((account) => (
            <div key={account.code} className="rounded-xl border border-slate-100 p-4">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">{account.code}</div>
              <div className="font-bold text-slate-900">{account.label}</div>
              <div className="text-sm text-slate-500">{account.type}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
