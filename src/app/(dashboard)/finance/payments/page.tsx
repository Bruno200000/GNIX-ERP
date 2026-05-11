import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RecordPaymentDialog } from "@/components/finance/RecordPaymentDialog"

export default function FinancePayments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements & Rapprochement</h1>
          <p className="text-sm text-slate-500">Historique des transactions et réconciliation bancaire.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filtrer</Button>
          <RecordPaymentDialog />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-emerald-500" /> Flux de Trésorerie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-slate-400 italic">Chargement des transactions...</div>
        </CardContent>
      </Card>
    </div>
  )
}
