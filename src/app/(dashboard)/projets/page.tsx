import { getProjects } from "./actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, CheckCircle2, Clock } from "lucide-react"
import { AddProjectDialog } from "@/components/projets/AddProjectDialog"

export default async function ProjetsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Projets & Tâches</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Suivez l'avancement de vos projets et la charge de travail de vos équipes.
          </p>
        </div>
        <AddProjectDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Calendar className="h-10 w-10 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aucun projet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Commencez par créer votre premier projet pour organiser vos tâches.
            </p>
          </div>
        ) : (
          projects.map((project) => {
            const completedTasks = project.tasks?.filter(t => t.status === 'completed').length || 0
            const totalTasks = project.tasks?.length || 0
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

            return (
              <Card key={project.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="capitalize mb-2">
                      {project.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Échéance : {new Date(project.deadline).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Progression</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.3 w-3 text-emerald-500" />
                        {completedTasks}/{totalTasks} tâches
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {projects.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tâches Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tâche</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Estimation IA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.flatMap(p => p.tasks?.map(t => ({ ...t, projectName: p.name })) || []).map((task: any) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell className="text-slate-500">{task.projectName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {task.ai_estimated_hours}h
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
