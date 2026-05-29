'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fingerprint, Save } from "lucide-react"

type TerminalSettings = {
  terminal_total?: number
  terminal_active?: number
  terminal_mode?: string
  terminal_location?: string
}

export function TerminalConfigDialog({
  settings,
  action,
}: {
  settings?: TerminalSettings | null
  action: (formData: FormData) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function actionWrapper(formData: FormData) {
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
      <DialogTrigger
        render={
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Fingerprint className="h-4 w-4" /> Configurer Terminaux
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Configurer les terminaux</DialogTitle>
          <DialogDescription>Reglez le parc IoT utilise pour les pointages biometrie, GPS et mobile.</DialogDescription>
        </DialogHeader>
        <form action={actionWrapper} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terminal_total">Terminaux total</Label>
              <Input id="terminal_total" name="terminal_total" type="number" min="0" defaultValue={settings?.terminal_total ?? 15} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terminal_active">Terminaux actifs</Label>
              <Input id="terminal_active" name="terminal_active" type="number" min="0" defaultValue={settings?.terminal_active ?? 14} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="terminal_mode">Mode de pointage</Label>
            <select id="terminal_mode" name="terminal_mode" defaultValue={settings?.terminal_mode || "Biometrie + GPS"} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
              <option>Biometrie + GPS</option>
              <option>Biometrie uniquement</option>
              <option>Mobile GPS uniquement</option>
              <option>Badge RFID</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="terminal_location">Site principal</Label>
            <Input id="terminal_location" name="terminal_location" defaultValue={settings?.terminal_location || "Siege principal"} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 text-white gap-2">
              {loading ? "Sauvegarde..." : "Enregistrer"}
              <Save className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
