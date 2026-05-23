import { getShipments } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Package, Navigation, Clock, ShieldCheck, Filter, Search, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function LogistiqueShipments() {
  const shipments = await getShipments()

  const getStatusColor = (status: string) => {
    if (status === "in_transit") return "bg-blue-500 text-white"
    if (status === "delivered") return "bg-emerald-500 text-white"
    return "bg-amber-500 text-white"
  }

  const inTransit = shipments.filter((shipment) => shipment.status === "in_transit").length
  const delivered = shipments.filter((shipment) => shipment.status === "delivered").length
  const alerts = shipments.filter((shipment) => shipment.confidence < 90 || shipment.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Operations & Logistique Flux</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tracking GPS temps reel, optimisation d'itineraires IA et gestion des colis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Navigation className="h-4 w-4" /> Vue Carte (Live)
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Package className="h-4 w-4" /> Nouveau Colis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Truck className="h-8 w-8 text-blue-600" />
              <Badge className="bg-blue-600 text-white border-none">{inTransit} Actifs</Badge>
            </div>
            <p className="mt-4 text-sm font-bold text-blue-900 uppercase tracking-tighter">En Transit</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-emerald-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
              <Badge className="bg-emerald-600 text-white border-none">{delivered} Livres</Badge>
            </div>
            <p className="mt-4 text-sm font-bold text-emerald-900 uppercase tracking-tighter">Succes</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-amber-600" />
              <Badge className="bg-amber-600 text-white border-none">{alerts} Alertes</Badge>
            </div>
            <p className="mt-4 text-sm font-bold text-amber-900 uppercase tracking-tighter">Retards IA Detectes</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm bg-slate-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-white">
              <Navigation className="h-8 w-8 text-indigo-400" />
              <Badge className="bg-indigo-600 text-white border-none">-15% Couts</Badge>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-300 uppercase tracking-tighter underline">IA Opti Itineraire</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Suivi des Expeditions</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-10 h-10 rounded-xl" placeholder="Numero de tracking..." />
              </div>
              <Button variant="ghost" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="p-4 rounded-2xl border border-slate-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Package className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tighter">{shipment.tracking_number}</h4>
                    <p className="text-xs text-slate-500 font-medium">{shipment.carrier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Origine</span>
                    <span className="text-xs font-bold text-slate-700">{shipment.origin}</span>
                  </div>
                  <div className="h-0.5 w-16 bg-slate-200 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Truck className="h-3 w-3 text-indigo-500" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Destination</span>
                    <span className="text-xs font-bold text-slate-700">{shipment.destination}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Arrivee (ETA IA)</span>
                    <span className="text-xs font-black text-slate-900">{new Date(shipment.eta).toLocaleDateString("fr-FR")}</span>
                    <Badge variant="secondary" className="ml-2 bg-indigo-50 text-indigo-600 text-[9px]">Confiance {shipment.confidence}%</Badge>
                  </div>
                  <Badge className={`${getStatusColor(shipment.status)} uppercase text-[10px] px-2 py-1`}>
                    {shipment.status.replace("_", " ")}
                  </Badge>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
