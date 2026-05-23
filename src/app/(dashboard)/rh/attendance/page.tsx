import { getAttendance, getEmployees } from "../actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Fingerprint, MapPin, AlertCircle, CheckCircle2, User, RefreshCw, Smartphone } from "lucide-react"

export default async function RHAttendance() {
  const [attendances, employees] = await Promise.all([getAttendance(), getEmployees()])
  const present = attendances.length
  const totalEmployees = Math.max(employees.length, present)
  const late = attendances.filter((attendance) => attendance.status === "late").length
  const presenceRate = totalEmployees ? Math.round((present / totalEmployees) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Gestion des Presences IoT</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Suivi temps reel des pointages biometriques, GPS et terminaux IoT.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Rafraichir
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Fingerprint className="h-4 w-4" /> Configurer Terminaux
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Taux de Presence (Aujourd'hui)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-indigo-600">{presenceRate}%</div>
            <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${presenceRate}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">{present} employes presents sur {totalEmployees}</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Retards Detectes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-500">{late}</div>
            <div className="mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span className="text-[10px] text-amber-500 font-bold">Action requise pour {late} cas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Terminaux IoT Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-500">14 / 15</div>
            <div className="mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] text-emerald-500 font-bold">Systeme operationnel</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle>Flux de Pointage Temps Reel</CardTitle>
          <CardDescription>Dernieres entrees enregistrees par les terminaux et l'application mobile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendances.map((attendance) => (
              <div key={attendance.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{attendance.employee_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {attendance.method.includes("GPS") ? <Smartphone className="h-3 w-3" /> : <Fingerprint className="h-3 w-3" />}
                        {attendance.method}
                      </div>
                      <span className="text-slate-200">-</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        <MapPin className="h-3 w-3" />
                        {attendance.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{attendance.time}</p>
                    <Badge variant="outline" className={`text-[10px] px-2 uppercase ${attendance.status === "ontime" ? "text-emerald-500 border-emerald-200 bg-emerald-50" : "text-amber-500 border-amber-200 bg-amber-50"}`}>
                      {attendance.status === "ontime" ? "A l'heure" : "En retard"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
