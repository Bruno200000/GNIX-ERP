import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, User, Globe, Moon, CreditCard, Sparkles, Lock } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personnalisez votre expérience GNIX IA et gérez vos préférences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="ai">Intelligence Artificielle</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle>Préférences Générales</CardTitle>
              <CardDescription>Configurez les paramètres de base de votre compte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Langue de l'interface</Label>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">Français</Button>
                  <Button variant="outline">English</Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-medium">
                    <Moon className="h-4 w-4 text-slate-500" />
                    Mode Sombre
                  </div>
                  <div className="text-xs text-slate-500">Activez l'interface sombre pour réduire la fatigue visuelle.</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4 text-slate-500" />
                    Auto-Traduction IA
                  </div>
                  <div className="text-xs text-slate-500">Traduire automatiquement les messages et commentaires.</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline">Annuler</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">Enregistrer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card className="border-indigo-100 bg-indigo-50/10 dark:border-indigo-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" /> Configuration de l'Intelligence Artificielle
              </CardTitle>
              <CardDescription>Connectez vos modèles pour activer l'analyse prédictive et les commandes vocales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="provider">Fournisseur d'IA</Label>
                <select className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="gemini">Google Gemini (Recommandé)</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_key">Clé API Google Gemini</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="password" 
                    placeholder="sk-..." 
                    className="pl-10 rounded-xl"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Votre clé est stockée de manière sécurisée et ne quitte jamais votre instance.</p>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-slate-100">
                 <div className="space-y-0.5">
                    <div className="text-sm font-bold text-slate-900">Analyse Automatique des Emails</div>
                    <div className="text-xs text-slate-500">L'IA classera vos emails entrants par priorité.</div>
                 </div>
                 <Switch defaultChecked />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-12 shadow-lg shadow-indigo-500/20">Activer l'IA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle>Centre de Notifications</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être informé.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Alertes CRM", desc: "Nouveau lead ou score IA élevé", icon: User },
                { name: "Finance", desc: "Retards de paiement ou factures à valider", icon: CreditCard },
                { name: "Sécurité", desc: "Nouvelles connexions ou anomalies détectées", icon: Shield },
                { name: "Rappels de Tâches", desc: "Échéances de projets approchantes", icon: Bell },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Email</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Push</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
