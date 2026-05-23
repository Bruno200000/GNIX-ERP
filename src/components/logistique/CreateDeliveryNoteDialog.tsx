'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Trash2, Truck } from "lucide-react"
import { getClients, Client } from "@/app/(dashboard)/crm/actions"
import { getProducts, createDeliveryNote, Product } from "@/app/(dashboard)/logistique/actions"

export function CreateDeliveryNoteDialog() {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState([{ id: String(Date.now()), product_id: '', qty: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      getClients().then(setClients)
      getProducts().then(setProducts)
    }
  }, [open])

  const addItem = () => setItems([...items, { id: String(Date.now()), product_id: '', qty: 0 }])
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))
  const updateItem = (id: string, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await createDeliveryNote(formData, items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        qty: Number(item.qty),
      })))
      setOpen(false)
      setItems([{ id: String(Date.now()), product_id: '', qty: 0 }])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Créer un BL
        </Button>
      } />
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200">
        <DialogHeader>
          <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
            <Truck className="h-6 w-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl font-black">Nouveau Bon de Livraison</DialogTitle>
          <DialogDescription>Générez un document de livraison pour vos clients.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client</label>
              <select 
                name="client_id" 
                required 
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="">Sélectionnez un client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date de Livraison</label>
              <Input name="delivery_date" type="date" required className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Articles à livrer</label>
              <Button type="button" variant="ghost" size="sm" onClick={addItem} className="text-indigo-600 text-xs">
                + Ajouter une ligne
              </Button>
            </div>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex-1">
                    <select 
                      required 
                      value={item.product_id}
                      onChange={(e) => updateItem(item.id, 'product_id', e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                    >
                      <option value="">Produit</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <Input 
                      type="number" 
                      required 
                      placeholder="Qté" 
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                      className="rounded-xl" 
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notes / Instructions</label>
            <textarea 
              name="notes"
              className="w-full h-24 rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
              placeholder="Ex: Livraison à l'entrepôt B, porte 4..."
            />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xs">{error}</div>}

          <DialogFooter className="border-t pt-6">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8">
              {loading ? "Création..." : "Générer le BL"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
