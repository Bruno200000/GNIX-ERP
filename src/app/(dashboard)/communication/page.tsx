import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Phone, Sparkles, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CommunicationHub() {
  const threads = [
    { id: 1, type: 'email', client: 'Jean Dupont', subject: 'Question sur devis #45', sentiment: 'neutral', category: 'Commercial', summary: 'Le client demande une remise sur les frais de port.' },
    { id: 2, type: 'whatsapp', client: 'Marie Curie', subject: 'Urgence Livraison', sentiment: 'negative', category: 'Logistique', summary: 'Colis non reçu après 3 jours de retard.' },
    { id: 3, type: 'email', client: 'Robert Ford', subject: 'Retour matériel', sentiment: 'positive', category: 'Support', summary: 'Remerciements après résolution du ticket.' },
  ]

  const getSentimentColor = (s: string) => {
    if (s === 'positive') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    if (s === 'negative') return 'bg-red-500/10 text-red-500 border-red-500/20'
    return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Communication Hub</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Emails OVH & WhatsApp Business centralisés avec analyse IA des sentiments et besoins.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtres
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-white">
            <Sparkles className="h-4 w-4" /> Réponse IA Auto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Canaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start gap-3 bg-indigo-50 text-indigo-700 border-indigo-100">
                <Mail className="h-4 w-4" /> Emails (12)
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <MessageSquare className="h-4 w-4" /> WhatsApp (5)
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Phone className="h-4 w-4" /> Appels IA (2)
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <CardContent className="pt-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-80" />
              <p className="text-sm font-medium">L'IA GNIX a classifié 24 messages aujourd'hui.</p>
              <Button variant="secondary" className="mt-4 w-full bg-white/10 border-white/20 hover:bg-white/20 text-white">
                Voir l'analyse
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-10 h-12 bg-white border-slate-200 rounded-xl" placeholder="Rechercher une conversation..." />
          </div>

          <div className="space-y-3">
            {threads.map((t) => (
              <Card key={t.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${t.type === 'email' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {t.type === 'email' ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{t.client}</h3>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Il y a 5 min</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.subject}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className={getSentimentColor(t.sentiment)}>
                        Sentiment: {t.sentiment}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                        {t.category}
                      </Badge>
                    </div>
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 italic text-xs text-slate-500">
                      <Sparkles className="h-3 w-3 inline mr-1 text-indigo-500" />
                      Résumé IA: {t.summary}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
