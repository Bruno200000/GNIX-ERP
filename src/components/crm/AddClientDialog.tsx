'use client'

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addClient } from "@/app/(dashboard)/crm/actions"
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
import { Plus, Camera, Building2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
      {pending ? "Création en cours..." : "Ajouter le client"}
    </Button>
  )
}

export function AddClientDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function actionWrapper(formData: FormData) {
    setError(null)
    try {
      await addClient(formData)
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
            <Plus className="mr-2 h-4 w-4" /> Nouveau Client
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
          <DialogDescription>
            Remplissez les informations du prospect. L'IA calculera son score de conversion plus tard.
          </DialogDescription>
        </DialogHeader>
        <form action={actionWrapper} className="space-y-4 pt-4">
          <div className="flex justify-center pb-4">
             <div className="h-20 w-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-indigo-400 transition-colors cursor-pointer group relative">
                <Camera className="h-6 w-6 text-slate-300 group-hover:text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Logo</span>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                   <Building2 className="h-3 w-3 text-slate-400" />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'entreprise ou contact</Label>
            <Input id="name" name="name" required placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="contact@acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" placeholder="+225 00 00 00 00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type de client</Label>
            <select 
              id="type"
              name="type" 
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
              defaultValue="B2B"
            >
              <option value="B2B">B2B (Entreprise)</option>
              <option value="B2C">B2C (Particulier)</option>
              <option value="GOV">Gouvernemental</option>
            </select>
          </div>
          
          {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
          
          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
