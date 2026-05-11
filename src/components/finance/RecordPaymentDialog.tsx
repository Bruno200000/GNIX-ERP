'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, Plus, CreditCard, Banknote, Calendar, Smartphone, Camera } from "lucide-react"
import { getInvoices, addPayment, Invoice } from "@/app/(dashboard)/finance/actions"
import { cn } from "@/lib/utils"

export function RecordPaymentDialog() {
  const [open, setOpen] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')

  useEffect(() => {
    if (open) {
      getInvoices().then(setInvoices)
    }
  }, [open])

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    setError(null)
    try {
      formData.append('payment_method', paymentMethod)
      await addPayment(formData)
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
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Enregistrer un Paiement
        </Button>
      } />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200">
        <DialogHeader>
          <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
            <Wallet className="h-6 w-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Nouveau Paiement</DialogTitle>
          <DialogDescription>Enregistrez un encaissement client ou un règlement facture.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Facture Associée</label>
            <select 
              name="invoice_id" 
              required 
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
            >
              <option value="">Sélectionnez une facture</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} - {inv.clients?.name} ({inv.total_amount.toLocaleString()} FCFA)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Montant (FCFA)</label>
              <Input name="amount" type="number" required placeholder="0" className="rounded-xl font-bold text-emerald-600 text-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</label>
              <Input name="payment_date" type="date" required className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mode de Règlement</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  paymentMethod === 'cash' ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm" : "border-slate-100 hover:bg-slate-50"
                )}
              >
                <Banknote className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase">Espèces</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  paymentMethod === 'bank' ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm" : "border-slate-100 hover:bg-slate-50"
                )}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase">Virement</span>
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('mobile')}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  paymentMethod === 'mobile' ? "border-emerald-600 bg-emerald-50 text-emerald-600 shadow-sm" : "border-slate-100 hover:bg-slate-50"
                )}
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase">Mobile</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preuve de Paiement (Photo/Scan)</label>
             <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-indigo-400 transition-colors cursor-pointer group">
                <div className="text-center">
                   <Camera className="h-8 w-8 text-slate-300 group-hover:text-indigo-400 mx-auto mb-2" />
                   <p className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 uppercase">Prendre en photo / Upload</p>
                </div>
             </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xs">{error}</div>}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8">
              {loading ? "Enregistrement..." : "Valider le Paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
