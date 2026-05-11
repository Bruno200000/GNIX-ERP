import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket, Cpu, Clock, CheckCircle2, AlertCircle, Plus, Filter, HardDrive } from "lucide-react"

export default function ITSMSupport() {
  const tickets = [
    { id: 'T-1001', subject: 'Écran cassé - Laptop RH', client: 'Alice Brown', priority: 'high', status: 'open', category: 'Matériel', created: '1h' },
    { id: 'T-1002', subject: 'Accès VPN impossible', client: 'Marc Levin', priority: 'medium', status: 'in_progress', category: 'Réseau', created: '3h' },
    { id: 'T-1003', subject: 'Installation Office 365', client: 'Julie Kern', priority: 'low', status: 'resolved', category: 'Logiciel', created: '1j' },
  ]

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-500 text-white'
    if (p === 'medium') return 'bg-amber-500 text-white'
    return 'bg-slate-500 text-white'
  }

  const getStatusIcon = (s: string) => {
    if (s === 'open') return <AlertCircle className="h-4 w-4 text-red-500" />
    if (s === 'in_progress') return <Clock className="h-4 w-4 text-amber-500" />
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">ITSM & Support</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gestion des tickets techniques, inventaire matériel et SLA.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <HardDrive className="h-4 w-4" /> Inventaire Matériel
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white">
            <Plus className="h-4 w-4" /> Nouveau Ticket
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Tickets Ouverts</CardTitle>
            <Ticket className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-red-500 mt-1">+2 depuis ce matin</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">SLA Respecté</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-slate-500 mt-1">Objectif: 95%</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Temps de Réponse</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 min</div>
            <p className="text-xs text-emerald-500 mt-1">-5 min vs hier</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Actifs Gérés</CardTitle>
            <Cpu className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-slate-500 mt-1">PC, Serveurs, IoT</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>File d'Attente des Tickets</CardTitle>
              <CardDescription>Visualisez et assignez les demandes de support technique.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="h-3.5 w-3.5" /> Filtrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getStatusIcon(ticket.status)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{ticket.id}</span>
                      <h4 className="font-bold text-slate-900">{ticket.subject}</h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 font-medium">{ticket.client}</span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">{ticket.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${getPriorityColor(ticket.priority)} uppercase text-[10px] px-2`}>
                    {ticket.priority}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">{ticket.created}</span>
                  <Button variant="secondary" size="sm" className="h-8">Détails</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
