'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus } from "lucide-react"

export function ProposeIntegrationDialog({ trigger }: { trigger: React.ReactElement }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    // Simulate sending the request
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setTimeout(() => setSuccess(false), 300)
      }, 2000)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
            <Plus className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Proposer une integration</DialogTitle>
          <DialogDescription>Quel outil aimeriez-vous connecter a GNIX IA ?</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center text-emerald-600 space-y-2">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-6 w-6" />
            </div>
            <p className="font-bold">Demande envoyee avec succes !</p>
            <p className="text-sm text-slate-500">Notre equipe vous contactera bientot.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom de l'outil</label>
              <Input required placeholder="Ex: Salesforce, Trello, etc." className="rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cas d'usage</label>
              <textarea required placeholder="Comment souhaitez-vous utiliser cette integration ?" className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-24" />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 gap-2">
                {loading ? "Envoi..." : "Envoyer la demande"}
                <Send className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
