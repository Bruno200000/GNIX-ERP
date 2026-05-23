'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Plus, Warehouse as WarehouseIcon } from "lucide-react"
import { addWarehouse } from "@/app/(dashboard)/logistique/actions"

export function AddWarehouseDialog({ trigger }: { trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await addWarehouse(formData)
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
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="h-4 w-4" /> Nouvel Entrepot
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
            <WarehouseIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Nouvel Entrepot</DialogTitle>
          <DialogDescription>Ajoutez un nouvel espace de stockage a votre reseau.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom de l'entrepot</label>
            <Input name="name" required placeholder="Ex: Entrepot Nord" className="rounded-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Localisation</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input name="location" required placeholder="Ex: Zone Industrielle, Paris" className="rounded-xl pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Capacite max (articles)</label>
            <Input name="capacity" type="number" required placeholder="1000" className="rounded-xl" defaultValue={1000} />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xs">{error}</div>}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
              {loading ? "Creation..." : "Creer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
