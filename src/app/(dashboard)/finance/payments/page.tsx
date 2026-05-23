import { getPayments } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RecordPaymentDialog } from "@/components/finance/RecordPaymentDialog"

export default async function FinancePayments() {
  const payments = await getPayments()
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements & Rapprochement</h1>
          <p className="text-sm text-slate-500">Historique des transactions et reconciliation bancaire.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filtrer</Button>
          <RecordPaymentDialog />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-emerald-500" /> Flux de Tresorerie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm font-bold text-emerald-600">
            Encaissements enregistres: {total.toLocaleString("fr-FR")} FCFA
          </div>
          {payments.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">Aucune transaction enregistree.</div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900">{payment.invoice?.invoice_number || "Paiement libre"}</div>
                    <div className="text-xs text-slate-500">{payment.invoice?.clients?.name || "Client inconnu"} - {new Date(payment.payment_date).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">{payment.payment_method}</Badge>
                    <span className="font-black text-emerald-600">{payment.amount.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
