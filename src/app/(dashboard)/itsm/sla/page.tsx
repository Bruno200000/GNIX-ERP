import { getTicketsData } from "@/lib/erp-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock } from "lucide-react"

export default async function ITSMSla() {
  const tickets = await getTicketsData()
  const resolved = tickets.filter((ticket) => ticket.status === "resolved").length
  const slaRate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 100

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">SLA Monitor</h1>
      <p className="text-sm text-slate-500">Indicateurs de performance et respect des contrats de service.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-indigo-500" /> Temps de resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1h 14m</div>
            <p className="text-xs text-emerald-500 mt-1">Excellent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-500" /> Respect SLA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{slaRate}%</div>
            <p className="text-xs text-slate-500 mt-1">{resolved}/{tickets.length} tickets resolus</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
