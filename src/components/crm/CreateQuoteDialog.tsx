'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calculator, Sparkles, Plus, Trash2, User } from "lucide-react"
import { getClients, addQuote, Client } from "@/app/(dashboard)/crm/actions"

export function CreateQuoteDialog() {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [items, setItems] = useState([{ id: String(Date.now()), name: '', qty: 1, price: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      getClients().then(setClients)
    }
  }, [open])

  const addItem = () => setItems([...items, { id: String(Date.now()), name: '', qty: 1, price: 0 }])
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))
  
  const updateItem = (id: string, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const totalHT = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.qty)), 0)

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      await addQuote(formData, items.map((item) => ({
        id: item.id,
        name: item.name,
        qty: Number(item.qty),
        price: Number(item.price),
      })))
      setOpen(false)
      setItems([{ id: String(Date.now()), name: '', qty: 1, price: 0 }])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-500/20">
          <Plus className="h-4 w-4" /> Nouveau Devis
        </Button>
      } />
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Calculator className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Optimisé par IA
            </div>
          </div>
          <DialogTitle className="text-2xl font-black">Génération de Devis</DialogTitle>
          <DialogDescription>Créez des offres commerciales professionnelles avec calcul automatique des marges.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prospect / Client</label>
                <select 
                  name="client_id" 
                  required 
                  className="w-full h-10 px-3 rounded-xl border-none shadow-sm text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option value="">Sélectionnez un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Validité de l'offre</label>
                <Input name="valid_until" type="date" required className="rounded-xl border-none shadow-sm" />
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900">Lignes du devis</h3>
                <Button type="button" variant="ghost" size="sm" onClick={addItem} className="text-indigo-600 font-bold">+ Ajouter</Button>
             </div>

             <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="col-span-6">
                      <Input 
                        placeholder="Désignation" 
                        required 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="rounded-xl" 
                      />
                    </div>
                    <div className="col-span-2">
                      <Input 
                        type="number" 
                        placeholder="Qté" 
                        required 
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                        className="rounded-xl" 
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        placeholder="Prix Unitaire" 
                        required 
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                        className="rounded-xl" 
                      />
                    </div>
                    <div className="col-span-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xs">{error}</div>}

          <DialogFooter className="bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-3xl border-t mt-4">
            <div className="flex-1 flex flex-col justify-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase">Total HT estimé</p>
               <p className="text-xl font-black text-slate-900">{totalHT.toLocaleString()} FCFA</p>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="rounded-xl px-6" onClick={() => setOpen(false)}>Annuler</Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 shadow-lg shadow-indigo-500/20"
              >
                {loading ? "Création..." : "Finaliser le Devis"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
