import { addSalaryPayment, getPayrollEmployees, getSalaryPayments } from "../actions"
import { RecordSalaryPaymentDialog } from "@/components/comptabilite/RecordSalaryPaymentDialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletCards } from "lucide-react"

export default async function SalaryPaymentsPage() {
  const [payments, employees] = await Promise.all([getSalaryPayments(), getPayrollEmployees()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiement de salaire</h1>
          <p className="text-sm text-slate-500">Enregistrez les salaires et generez les ecritures comptables.</p>
        </div>
        <RecordSalaryPaymentDialog employees={employees} action={addSalaryPayment} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletCards className="h-5 w-5 text-emerald-500" />
            Historique des salaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
              Aucun salaire enregistre.
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900">
                      {payment.employee ? `${payment.employee.first_name} ${payment.employee.last_name}` : "Employe inconnu"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {payment.pay_period} - {new Date(payment.payment_date).toLocaleDateString("fr-FR")}
                    </div>
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
