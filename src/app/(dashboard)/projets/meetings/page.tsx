import { addMeeting, getMeetings, getProjects } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function ProjetsMeetings() {
  const [meetings, projects] = await Promise.all([getMeetings(), getProjects()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reunions & Collaboration</h1>
          <p className="text-sm text-slate-500">Planifiez et gerez vos reunions d'equipe.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-500" /> Nouvelle Reunion</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addMeeting} className="grid gap-3 md:grid-cols-5">
            <select name="project_id" className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <Input name="title" placeholder="Titre" required />
            <Input name="meeting_date" type="date" required />
            <Input name="attendees" placeholder="Participants separes par virgule" />
            <Button className="bg-indigo-600 text-white gap-2"><Plus className="h-4 w-4" /> Planifier</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-500" /> Planning Hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">Aucune reunion prevue aujourd'hui.</div>
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => {
                const project = projects.find((item) => item.id === meeting.project_id)
                return (
                  <div key={meeting.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900">{meeting.title}</div>
                      <div className="text-xs text-slate-500">{project?.name || "Projet"} - {meeting.attendees.join(", ")}</div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">{new Date(meeting.meeting_date).toLocaleDateString("fr-FR")}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
