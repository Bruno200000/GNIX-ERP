'use client'

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addShipment } from "@/app/(dashboard)/logistique/actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhotoFileInput } from "@/components/ui/PhotoFileInput"
import { Package } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
      {pending ? "Creation..." : "Creer le colis"}
    </Button>
  )
}

export function NewShipmentDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function actionWrapper(formData: FormData) {
    setError(null)
    try {
      await addShipment(formData)
      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Package className="h-4 w-4" /> Nouveau Colis
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>Nouveau colis</DialogTitle>
          <DialogDescription>Ajoutez une expedition au flux logistique et joignez une photo si necessaire.</DialogDescription>
        </DialogHeader>
        <form action={actionWrapper} className="space-y-4 pt-4">
          <div className="flex justify-center">
            <PhotoFileInput name="package_photo" label="Colis" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tracking_number">Tracking</Label>
              <Input id="tracking_number" name="tracking_number" placeholder="GNX-2026-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrier">Transporteur</Label>
              <Input id="carrier" name="carrier" defaultValue="GNIX Fleet" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origine</Label>
              <Input id="origin" name="origin" defaultValue="Entrepot principal" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" name="destination" required placeholder="Client / Ville" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eta">ETA</Label>
              <Input id="eta" name="eta" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select id="status" name="status" defaultValue="pending" className="flex h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                <option value="pending">En attente</option>
                <option value="in_transit">En transit</option>
                <option value="delivered">Livre</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confiance IA</Label>
              <Input id="confidence" name="confidence" type="number" min="0" max="100" defaultValue="95" />
            </div>
          </div>
          {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  )
}
