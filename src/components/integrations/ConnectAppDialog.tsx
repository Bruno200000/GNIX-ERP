'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Key } from "lucide-react"

export function ConnectAppDialog({ 
  appId, 
  appName, 
  trigger,
  action
}: { 
  appId: string
  appName: string
  trigger: React.ReactElement
  action: (formData: FormData) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    try {
      formData.append("integration_id", appId)
      await action(formData)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
            <Key className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Connecter {appName}</DialogTitle>
          <DialogDescription>Entrez la cle API de l'application pour autoriser l'acces.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cle API (API Key)</label>
            <Input name="api_key" type="password" required placeholder="sk_live_..." className="rounded-xl font-mono" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 gap-2">
              {loading ? "Connexion..." : "Valider"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
