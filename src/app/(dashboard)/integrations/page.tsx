import { getIntegrationsData, toggleIntegrationData } from "@/lib/erp-data"
import { revalidatePath } from "next/cache"
import { ConnectAppDialog } from "@/components/integrations/ConnectAppDialog"
import { ProposeIntegrationDialog } from "@/components/integrations/ProposeIntegrationDialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Globe,
  ShoppingCart,
  MessageCircle,
  Cpu,
  Settings2,
  Plus,
  ArrowRight,
  MessageSquareText,
  CalendarDays,
  Mail,
  ShieldCheck,
  Zap,
} from "lucide-react"

async function toggleIntegration(formData: FormData) {
  "use server"
  await toggleIntegrationData(formData)
  revalidatePath("/integrations")
}

const icons = {
  Cpu,
  ShoppingCart,
  MessageCircle,
  Globe,
  MessageSquareText,
  CalendarDays,
  Mail,
  ShieldCheck,
  Zap,
}

export default async function IntegrationsPage() {
  const apps = await getIntegrationsData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Marketplace</h1>
          <p className="text-sm text-slate-500">Connectez GNIX IA a vos outils preferes pour un ERP sans limites.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings2 className="h-4 w-4" /> Parametres API
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => {
          const Icon = icons[app.icon as keyof typeof icons] ?? Globe
          return (
            <Card key={app.id} className="group hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden flex flex-col">
              <CardHeader className="relative">
                <div className={`h-12 w-12 ${app.color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg shadow-black/5`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-black">{app.name}</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{app.category}</CardDescription>
                  </div>
                  <Badge variant={app.status === "connected" ? "default" : "secondary"} className={app.status === "connected" ? "bg-emerald-500" : ""}>
                    {app.status === "connected" ? "Actif" : "Installer"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-0">
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {app.description}
                </p>
                {app.status === "connected" ? (
                  <form action={toggleIntegration}>
                    <input type="hidden" name="integration_id" value={app.id} />
                    <Button 
                      type="submit"
                      variant="destructive"
                      className="w-full gap-2 rounded-xl h-11"
                    >
                      Déconnecter
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <ConnectAppDialog
                    appId={app.id}
                    appName={app.name}
                    action={toggleIntegration}
                    trigger={
                      <Button 
                        type="button"
                        className="w-full gap-2 rounded-xl h-11 bg-slate-900 text-white"
                      >
                        Connecter
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>
          )
        })}

        <ProposeIntegrationDialog trigger={
          <Card className="border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors h-full">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Plus className="h-6 w-6 text-slate-400" />
            </div>
            <CardTitle className="text-sm font-bold text-slate-600">Proposer une integration</CardTitle>
            <p className="text-xs text-slate-400 mt-2">Vous avez un outil specifique ?<br/>Contactez notre equipe IA.</p>
          </Card>
        } />
      </div>

      <div className="mt-12 p-8 bg-indigo-900 rounded-3xl text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-indigo-400/30 text-indigo-100 border-none mb-4 uppercase tracking-widest text-[10px]">Developpeurs</Badge>
          <h2 className="text-3xl font-black mb-4 tracking-tighter">API & Webhooks Personnalises</h2>
          <p className="text-indigo-200 text-lg leading-relaxed mb-8">
            Connectez votre propre site web ou application metier directement a GNIX IA. Recevez des notifications temps reel via nos webhooks securises.
          </p>
          <div className="flex gap-4">
            <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 h-12 rounded-xl">Documentation API</Button>
            <Button variant="ghost" className="text-white hover:bg-white/10 font-bold px-8 h-12 rounded-xl">Gerer mes cles API</Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-800 to-transparent flex items-center justify-center opacity-50">
           <Globe className="h-64 w-64 text-white/10 rotate-12 translate-x-20" />
        </div>
      </div>
    </div>
  )
}
