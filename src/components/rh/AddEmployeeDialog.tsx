'use client'

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addEmployee } from "@/app/(dashboard)/rh/actions"
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
import { Plus, User, Camera } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
      {pending ? "Enregistrement..." : "Ajouter l'employé"}
    </Button>
  )
}

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function actionWrapper(formData: FormData) {
    setError(null)
    try {
      await addEmployee(formData)
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
            <Plus className="mr-2 h-4 w-4" /> Nouvel Employé
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Ajouter un employé</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour enregistrer un nouveau membre de l'équipe.
          </DialogDescription>
        </DialogHeader>
        <form action={actionWrapper} className="space-y-4 pt-4">
          <div className="flex justify-center pb-4">
             <div className="relative group cursor-pointer">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-indigo-500 transition-colors">
                   <Camera className="h-8 w-8 text-slate-300 group-hover:text-indigo-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                   <Plus className="h-3 w-3 text-white" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input id="first_name" name="first_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input id="last_name" name="last_name" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Professionnel</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input id="department" name="department" placeholder="IT, Ventes, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input id="position" name="position" placeholder="Développeur..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salaire Annuel (FCFA)</Label>
            <Input id="salary" name="salary" type="number" placeholder="12000000" />
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
