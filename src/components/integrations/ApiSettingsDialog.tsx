'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Save } from "lucide-react"

type ApiSettings = {
  openai_api_key?: string
  whatsapp_api_key?: string
  whatsapp_phone_number_id?: string
  whatsapp_business_account_id?: string
}

export function ApiSettingsDialog({
  trigger,
  settings,
  action,
}: {
  trigger: React.ReactElement
  settings?: ApiSettings | null
  action: (formData: FormData) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function actionWrapper(formData: FormData) {
    setLoading(true)
    setError("")
    try {
      await action(formData)
      setOpen(false)
    } catch (e: any) {
      setError(e.message || "Les parametres API n'ont pas pu etre enregistres.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-2xl rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
            <KeyRound className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Parametres API</DialogTitle>
          <DialogDescription>Connectez OpenAI et WhatsApp Business pour activer les modules IA et communication.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-slate-100 p-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">OpenAI</h3>
                <p className="text-xs text-slate-500">Utilise pour les reponses IA et l'analyse des messages.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai_api_key">Cle API OpenAI</Label>
                <Input
                  id="openai_api_key"
                  name="openai_api_key"
                  type="password"
                  placeholder={settings?.openai_api_key ? "Cle deja connectee" : "sk-..."}
                  className="rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-100 p-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">WhatsApp Business</h3>
                <p className="text-xs text-slate-500">Necessaire pour debloquer le Communication Hub WhatsApp.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_api_key">Token API</Label>
                <Input
                  id="whatsapp_api_key"
                  name="whatsapp_api_key"
                  type="password"
                  placeholder={settings?.whatsapp_api_key ? "Token deja connecte" : "EAAB..."}
                  className="rounded-xl font-mono"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_phone_number_id">Phone Number ID</Label>
                  <Input
                    id="whatsapp_phone_number_id"
                    name="whatsapp_phone_number_id"
                    defaultValue={settings?.whatsapp_phone_number_id || ""}
                    className="rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_business_account_id">Business Account ID</Label>
                  <Input
                    id="whatsapp_business_account_id"
                    name="whatsapp_business_account_id"
                    defaultValue={settings?.whatsapp_business_account_id || ""}
                    className="rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
              {error}
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 gap-2">
              {loading ? "Sauvegarde..." : "Enregistrer"}
              <Save className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
