'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Grid3X3 } from "lucide-react"
import { updateInventoryLocation } from "@/app/(dashboard)/logistique/actions"

interface EditLocationDialogProps {
  inventoryId: string
  currentLocation: string
  productName: string
  trigger?: React.ReactElement
}

export function EditLocationDialog({ inventoryId, currentLocation, productName, trigger }: EditLocationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('inventory_id', inventoryId)
    try {
      await updateInventoryLocation(formData)
      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        trigger || (
          <Button variant="ghost" size="sm">Editer Empl.</Button>
        )
      } />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
            <Grid3X3 className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Editer l'emplacement</DialogTitle>
          <DialogDescription>Modifiez l'emplacement du produit "{productName}".</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nouvel Emplacement</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input name="location" required defaultValue={currentLocation !== "Non defini" ? currentLocation : ""} placeholder="Ex: A-12-C" className="rounded-xl pl-10" />
            </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xs">{error}</div>}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
