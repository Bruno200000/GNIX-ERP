'use client'

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { addProject } from "@/app/(dashboard)/projets/actions"
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
      {pending ? "Création en cours..." : "Créer le projet"}
    </Button>
  )
}

export function AddProjectDialog() {
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
      await addProject(formData)
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
            <Plus className="mr-2 h-4 w-4" /> Nouveau Projet
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Créer un Projet</DialogTitle>
          <DialogDescription>
            Définissez un nouveau projet pour votre équipe.
          </DialogDescription>
        </DialogHeader>
        <form action={actionWrapper} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="client_id">Client Associé</Label>
            <select 
              id="client_id"
              name="client_id" 
              required 
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Sélectionnez un client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Projet</Label>
            <Input id="name" name="name" required placeholder="Ex: Refonte Site Web" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select 
                id="status"
                name="status" 
                defaultValue="active"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600"
              >
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Date d'échéance</Label>
              <Input id="deadline" name="deadline" type="date" required />
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
