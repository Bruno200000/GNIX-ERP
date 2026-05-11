import { getInvoices } from "./actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, AlertTriangle, ShieldCheck } from "lucide-react"
import { AddInvoiceDialog } from "@/components/finance/AddInvoiceDialog"

export default async function FinancePage() {
  const invoices = await getInvoices()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Finance & Trésorerie</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Suivi des factures, paiements et détection de fraude par Intelligence Artificielle.
          </p>
        </div>
        <AddInvoiceDialog />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            Factures Émises
          </CardTitle>
          <CardDescription>
            Historique de la facturation. L'IA GNIX analyse en temps réel pour détecter des anomalies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg border-slate-300 dark:border-slate-800">
              <FileText className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucune facture</h3>
              <p className="mt-1 text-sm text-slate-500">
                Vous n'avez pas encore émis de factures. Note : Il vous faut d'abord créer un Client dans le module CRM.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-indigo-500" />
                        Audit IA
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.invoice_number}</TableCell>
                      <TableCell>{inv.clients?.name || 'Client Inconnu'}</TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(inv.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          inv.status === 'paid' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" :
                          inv.status === 'overdue' ? "text-red-500 border-red-500/20 bg-red-500/10" :
                          "text-amber-500 border-amber-500/20 bg-amber-500/10"
                        }>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {inv.ai_anomaly_flag ? (
                          <div className="flex items-center text-xs font-medium text-red-500">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Anomalie suspectée
                          </div>
                        ) : (
                          <div className="flex items-center text-xs font-medium text-emerald-500">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            RAS
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
