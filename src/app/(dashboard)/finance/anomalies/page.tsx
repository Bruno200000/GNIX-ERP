import { getInvoices } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Activity, AlertTriangle } from "lucide-react"

export default async function FinanceAnomalies() {
  const invoices = await getInvoices()
  const critical = invoices.filter((invoice) => invoice.ai_anomaly_flag || invoice.status === "overdue")
  const marginWatch = invoices.filter((invoice) => invoice.total_amount > 1000000 && !invoice.ai_anomaly_flag)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detection d'Anomalies IA</h1>
          <p className="text-sm text-slate-500">Controle automatique des fraudes, doublons et erreurs de saisie.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-red-100 bg-red-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" /> Alertes Critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            {critical.length === 0 ? (
              <div className="text-center py-6 text-slate-400">Aucune anomalie critique detectee aujourd'hui.</div>
            ) : (
              <div className="space-y-3">
                {critical.map((invoice) => (
                  <div key={invoice.id} className="rounded-xl bg-white border border-red-100 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{invoice.invoice_number}</span>
                      <Badge className="bg-red-500">A verifier</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{invoice.clients?.name || "Client inconnu"} - {invoice.total_amount.toLocaleString("fr-FR")} FCFA</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 bg-amber-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Activity className="h-5 w-5" /> Analyse des Marges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marginWatch.length === 0 ? (
              <div className="text-center py-6 text-slate-400">Aucune facture sensible pour le moment.</div>
            ) : (
              <div className="space-y-3">
                {marginWatch.map((invoice) => (
                  <div key={invoice.id} className="flex items-center gap-3 rounded-xl bg-white border border-amber-100 p-4">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <div>
                      <div className="font-bold text-slate-900">{invoice.invoice_number}</div>
                      <div className="text-xs text-slate-500">Montant eleve: {invoice.total_amount.toLocaleString("fr-FR")} FCFA</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
