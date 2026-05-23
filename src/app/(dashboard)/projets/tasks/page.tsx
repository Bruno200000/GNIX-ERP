import { addTask, getProjects, getTasks } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function ProjetsTasks() {
  const [tasks, projects] = await Promise.all([getTasks(), getProjects()])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Taches Multi-agents</h1>
          <p className="text-sm text-slate-500">Assignation intelligente et suivi granulaire de l'execution.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-500" /> Nouvelle Tache</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addTask} className="grid gap-3 md:grid-cols-6">
            <select name="project_id" className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm md:col-span-2">
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <Input name="name" placeholder="Nom de la tache" className="md:col-span-2" required />
            <Input name="assignee" placeholder="Assignee" />
            <Input name="ai_estimated_hours" type="number" placeholder="Heures IA" defaultValue="4" />
            <Button className="bg-indigo-600 text-white gap-2 md:col-span-6"><Plus className="h-4 w-4" /> Nouvelle Tache</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" /> Optimisation par l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 italic">L'IA est prete a optimiser votre backlog...</div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const project = projects.find((item) => item.id === task.project_id)
                return (
                  <div key={task.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="font-bold text-slate-900">{task.name}</div>
                        <div className="text-xs text-slate-500">{project?.name || "Projet"} - {task.assignee}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.status}</Badge>
                      <span className="text-xs font-mono text-slate-500">{task.ai_estimated_hours}h</span>
                    </div>
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
