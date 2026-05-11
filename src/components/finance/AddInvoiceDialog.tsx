'use client'

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { addInvoice } from "@/app/(dashboard)/finance/actions"
import { getClients, Client } from "@/app/(dashboard)/crm/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
      {pending ? "Création en cours..." : "Créer la facture"}
    </Button>
  )
}

export function AddInvoiceDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    if (open) {
      getClients().then(setClients)
    }
  }, [open])

  async function actionWrapper(formData: FormData) {
    setError(null)
    try {
      await addInvoice(formData)
      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
            <Plus className="mr-2 h-4 w-4" /> Créer une Facture
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Nouvelle Facture</DialogTitle>
          <DialogDescription>
            Émettez une facture. L'IA vérifiera automatiquement s'il s'agit d'un doublon ou d'une anomalie de marge.
          </DialogDescription>
        </DialogHeader>
        <form action={actionWrapper} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="client_id">Client</Label>
            <select 
              id="client_id"
              name="client_id" 
              required 
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <option value="">Sélectionnez un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant Total (FCFA)</Label>
            <Input id="amount" name="amount" type="number" required placeholder="500000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select 
                id="status"
                name="status" 
                defaultValue="pending"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                <option value="pending">En attente</option>
                <option value="paid">Payée</option>
                <option value="overdue">En retard</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Date d'échéance</Label>
              <Input id="due_date" name="due_date" type="date" required />
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}
          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
