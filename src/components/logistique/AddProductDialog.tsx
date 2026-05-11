'use client'

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addProduct } from "@/app/(dashboard)/logistique/actions"
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
import { Plus, Camera } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
      {pending ? "Création en cours..." : "Ajouter au catalogue"}
    </Button>
  )
}

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function actionWrapper(formData: FormData) {
    setError(null)
    try {
      await addProduct(formData)
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
            <Plus className="mr-2 h-4 w-4" /> Ajouter au Stock
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>Ajouter un Produit</DialogTitle>
          <DialogDescription>
            Enregistrez un nouveau produit ou service dans votre catalogue.
          </DialogDescription>
        </DialogHeader>
        <form action={actionWrapper} className="space-y-4 pt-4">
          <div className="flex justify-center pb-4">
             <div className="h-24 w-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-indigo-400 transition-colors cursor-pointer group">
                <Camera className="h-8 w-8 text-slate-300 group-hover:text-indigo-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Photo</span>
             </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom du Produit</Label>
            <Input id="name" name="name" required placeholder="Ex: Ordinateur Portable X200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">Référence (SKU)</Label>
              <Input id="sku" name="sku" required placeholder="REF-2024-X" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix Unitaire (FCFA)</Label>
              <Input id="price" name="price" type="number" required placeholder="250000" />
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
