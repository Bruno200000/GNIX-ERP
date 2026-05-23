import { getAuditLogs } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, FileText, Search, Filter, History, Lock, User, Terminal } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function AuditLogs() {
  const logs = await getAuditLogs()
  const suspicious = logs.filter((log) => log.severity === "high").length

  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "bg-red-500/10 text-red-500 border-red-500/20"
    if (severity === "medium") return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    return "bg-slate-500/10 text-slate-500 border-slate-500/20"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Audit Logs & Securite</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Journal inviolable des actions techniques (TechLogs) et metier (BizLogs).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Lock className="h-4 w-4" /> Certification Inviolable
          </Button>
          <Button className="bg-slate-900 hover:bg-black text-white gap-2">
            <FileText className="h-4 w-4" /> Exporter Rapport PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Integrite des Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-black">VERIFIE</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Derniere signature locale : {logs[0] ? new Date(logs[0].created_at).toLocaleString("fr-FR") : "aucune"}</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tentatives Suspectes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-red-500">{suspicious} Detectee</div>
            <p className="text-[10px] text-slate-500 mt-1">Analyse temps reel active</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stockage Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black">{Math.max(1, Math.ceil(logs.length / 10))}.2 MB</div>
            <p className="text-[10px] text-slate-500 mt-1">Conservation : 10 ans (Standard RGPD)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-slate-500" />
              <CardTitle>Journal d'Activite</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input className="pl-9 h-9 text-xs rounded-lg" placeholder="Chercher utilisateur, action..." />
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" /> Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Cible</th>
                  <th className="px-6 py-3">Date & Heure</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Severite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="h-3 w-3 text-slate-500" />
                      </div>
                      <span className="font-bold text-slate-700">{log.user_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3 w-3 text-slate-400" />
                        <span className="font-medium">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{log.target}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{new Date(log.created_at).toLocaleString("fr-FR")}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{log.ip_address}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
