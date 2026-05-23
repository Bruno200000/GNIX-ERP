'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Plus } from "lucide-react"

export function AddPurchaseOrderDialog({ 
  action
}: { 
  action: (formData: FormData) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
      <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"><ShoppingCart className="h-4 w-4" /> Bon de commande</Button>} />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
            <ShoppingCart className="h-6 w-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Nouveau Bon de Commande</DialogTitle>
          <DialogDescription>Creez une demande d'achat pour reapprovisionner votre stock.</DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fournisseur</label>
            <Input name="supplier" required placeholder="Nom du fournisseur" className="rounded-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Montant Total (XOF)</label>
            <Input name="total_amount" type="number" min="0" required placeholder="Ex: 150000" className="rounded-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date de reception prevue</label>
            <Input name="expected_date" type="date" required className="rounded-xl" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 gap-2">
              {loading ? "Creation..." : "Creer la commande"}
              <Plus className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
