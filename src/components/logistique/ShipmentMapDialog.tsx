'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation, MapPin, Truck } from "lucide-react"

type Shipment = {
  id: string
  tracking_number: string
  origin: string
  destination: string
  status: string
  confidence: number
}

export function ShipmentMapDialog({ shipments }: { shipments: Shipment[] }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2">
            <Navigation className="h-4 w-4" /> Vue Carte (Live)
          </Button>
        }
      />
      <DialogContent className="sm:max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle>Vue carte live</DialogTitle>
          <DialogDescription>Visualisation operationnelle des trajets actifs et points de livraison.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px)] bg-[size:32px_32px]" />
            {shipments.slice(0, 6).map((shipment, index) => (
              <div
                key={shipment.id}
                className="absolute flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
                style={{
                  left: `${12 + (index * 17) % 68}%`,
                  top: `${18 + (index * 23) % 58}%`,
                }}
              >
                {shipment.status === "delivered" ? <MapPin className="h-4 w-4 text-emerald-500" /> : <Truck className="h-4 w-4 text-indigo-500" />}
                {shipment.tracking_number}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-black text-slate-900">{shipment.tracking_number}</div>
                  <Badge variant="secondary">{shipment.confidence}%</Badge>
                </div>
                <div className="mt-2 text-xs text-slate-500">{shipment.origin} vers {shipment.destination}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
