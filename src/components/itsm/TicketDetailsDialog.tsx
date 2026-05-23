'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Ticket } from "lucide-react"

export function TicketDetailsDialog({ 
  ticketId, 
  ticketNumber,
  subject,
  currentStatus,
  trigger,
  action
}: { 
  ticketId: string
  ticketNumber: string
  subject: string
  currentStatus: string
  trigger: React.ReactElement
  action: (ticketId: string, status: string) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleResolve() {
    setLoading(true)
    try {
      await action(ticketId, "resolved")
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
            <Ticket className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">Ticket {ticketNumber}</DialogTitle>
          <DialogDescription>{subject}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-slate-600">Statut actuel : <span className="font-bold">{currentStatus === "resolved" ? "Resolu" : "En cours"}</span></p>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Fermer</Button>
          {currentStatus !== "resolved" && (
            <Button onClick={handleResolve} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 gap-2">
              {loading ? "Mise a jour..." : "Marquer comme resolu"}
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
