'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRightLeft, Barcode } from "lucide-react"
import { getProducts, getWarehouses, transferStock, Product, Warehouse } from "@/app/(dashboard)/logistique/actions"

export function TransferStockDialog({ trigger }: { trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      getProducts().then(setProducts)
      getWarehouses().then(setWarehouses)
    }
  }, [open])

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await transferStock(formData)
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
          <Button variant="outline" className="gap-2">
            <ArrowRightLeft className="h-4 w-4" /> Transfert de Stock
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
            <ArrowRightLeft className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Transfert de Stock</DialogTitle>
          <DialogDescription>Deplacez des articles d'un entrepot a un autre.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Produit</label>
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select 
                name="product_id" 
                required 
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none appearance-none"
              >
                <option value="">Selectionnez un produit</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">De l'entrepot</label>
              <select 
                name="from_warehouse_id" 
                required 
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                <option value="">Source</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vers l'entrepot</label>
              <select 
                name="to_warehouse_id" 
                required 
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                <option value="">Destination</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quantite a transferer</label>
            <Input name="quantity" type="number" required placeholder="0" className="rounded-xl" />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xs">{error}</div>}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
              {loading ? "Transfert..." : "Confirmer le transfert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
