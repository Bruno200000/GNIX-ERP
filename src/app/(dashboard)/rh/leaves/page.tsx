import { getEmployees, getLeaves, requestLeave } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function RHLeaves() {
  const [leaves, employees] = await Promise.all([getLeaves(), getEmployees()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Conges & Absences</h1>
          <p className="text-sm text-slate-500">Planning et gestion des demandes d'absence.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-500" /> Nouvelle demande</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={requestLeave} className="grid gap-3 md:grid-cols-5">
            <select name="employee_id" className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.first_name} {employee.last_name}</option>
              ))}
            </select>
            <Input name="type" placeholder="Type d'absence" defaultValue="Conge annuel" />
            <Input name="start_date" type="date" required />
            <Input name="end_date" type="date" required />
            <Button className="bg-indigo-600 gap-2 text-white" type="submit"><Plus className="h-4 w-4" /> Demander</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-500" /> Calendrier des Absences</CardTitle>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed text-slate-400">Aucune absence planifiee</div>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900">{leave.employee_name}</div>
                    <div className="text-xs text-slate-500">{leave.type} - {new Date(leave.start_date).toLocaleDateString("fr-FR")} au {new Date(leave.end_date).toLocaleDateString("fr-FR")}</div>
                  </div>
                  <span className="text-xs font-bold uppercase text-indigo-600">{leave.status}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
