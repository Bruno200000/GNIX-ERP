import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Play, Mic, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommCallsIA() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analyse d'Appels IA</h1>
      <p className="text-sm text-slate-500">Transcription automatique et détection des besoins clients par IA.</p>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Appels Analysés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">128</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Derniers Enregistrements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Appel entrant #00{i}</p>
                    <p className="text-xs text-slate-400">Durée: 04:12 • Client: Inconnu</p>
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
