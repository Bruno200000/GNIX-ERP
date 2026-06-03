'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WalletCards } from "lucide-react"
import type { EmployeeRecord } from "@/lib/erp-data"

export function RecordSalaryPaymentDialog({
  employees,
  action,
}: {
  employees: EmployeeRecord[]
  action: (formData: FormData) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[0]?.id || "")
  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await action(formData)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700" disabled={!employees.length} />}>
        <WalletCards className="h-4 w-4" />
        Payer un salaire
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-2xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement de salaire</DialogTitle>
          <DialogDescription>Le paiement cree aussi une ecriture comptable dans le journal.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employe</Label>
            <select
              id="employee_id"
              name="employee_id"
              required
              value={selectedEmployeeId}
              onChange={(event) => setSelectedEmployeeId(event.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input id="amount" name="amount" type="number" min="0" defaultValue={selectedEmployee?.salary || 0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_date">Date de paiement</Label>
              <Input id="payment_date" name="payment_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pay_period">Periode</Label>
              <Input id="pay_period" name="pay_period" placeholder="Mai 2026" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method">Methode</Label>
              <select
                id="payment_method"
                name="payment_method"
                defaultValue="bank"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="bank">Virement bancaire</option>
                <option value="cash">Especes</option>
                <option value="mobile_money">Mobile money</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
