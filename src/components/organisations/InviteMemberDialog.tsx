'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MailPlus, Send } from "lucide-react"

export function InviteMemberDialog({
  trigger,
  action,
}: {
  trigger: React.ReactElement
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
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-200 shadow-2xl">
        <DialogHeader>
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
            <MailPlus className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Inviter un membre</DialogTitle>
          <DialogDescription>Le compte sera ajoute en attente et devra etre valide par un administrateur.</DialogDescription>
        </DialogHeader>

        <form action={actionWrapper} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prenom</Label>
              <Input id="first_name" name="first_name" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input id="last_name" name="last_name" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email professionnel</Label>
            <Input id="email" name="email" type="email" required className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select id="role" name="role" defaultValue="Collaborateur" className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
              <option>Collaborateur</option>
              <option>Manager</option>
              <option>Administrateur</option>
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 gap-2">
              {loading ? "Invitation..." : "Inviter"}
              <Send className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
