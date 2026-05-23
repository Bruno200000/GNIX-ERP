import { getCallsData } from "@/lib/erp-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Mic, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function CommCallsIA() {
  const calls = await getCallsData()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analyse d'Appels IA</h1>
      <p className="text-sm text-slate-500">Transcription automatique et detection des besoins clients par IA.</p>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Appels Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{calls.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Derniers Enregistrements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calls.map((call, index) => (
              <div key={call.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Appel entrant #{String(index + 1).padStart(3, "0")}</p>
                    <p className="text-xs text-slate-400">Duree: {call.duration} - Client: {call.caller}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2"><FileText className="h-4 w-4" /> Transcript</Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full"><Play className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
