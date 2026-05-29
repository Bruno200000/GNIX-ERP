import { getAppSettings, requestPasswordReset, saveSettings } from "./actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, User, Globe, Moon, CreditCard, Sparkles, Lock } from "lucide-react"

export default async function SettingsPage() {
  const settings = await getAppSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Parametres</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personnalisez votre experience GNIX IA et gerez vos preferences.
        </p>
      </div>

      <form action={saveSettings}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">Intelligence Artificielle</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Securite</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Preferences Generales</CardTitle>
                <CardDescription>Configurez les parametres de base de votre compte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue de l'interface</Label>
                  <div className="flex gap-4">
                    <label className="inline-flex">
                      <input className="sr-only" type="radio" name="language" value="fr" defaultChecked={settings?.language !== "en"} />
                      <span className="inline-flex h-10 items-center rounded-md border border-indigo-600 bg-indigo-50 px-4 text-sm font-medium text-indigo-600">Francais</span>
                    </label>
                    <label className="inline-flex">
                      <input className="sr-only" type="radio" name="language" value="en" defaultChecked={settings?.language === "en"} />
                      <span className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium">English</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-medium">
                      <Moon className="h-4 w-4 text-slate-500" />
                      Mode Sombre
                    </div>
                    <div className="text-xs text-slate-500">Activez l'interface sombre pour reduire la fatigue visuelle.</div>
                  </div>
                  <Switch name="dark_mode" defaultChecked={settings?.dark_mode} />
                </div>

                <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-medium">
                      <Globe className="h-4 w-4 text-slate-500" />
                      Auto-Traduction IA
                    </div>
                    <div className="text-xs text-slate-500">Traduire automatiquement les messages et commentaires.</div>
                  </div>
                  <Switch name="auto_translate" defaultChecked={settings?.auto_translate ?? true} />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" type="reset">Annuler</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700" type="submit">Enregistrer</Button>
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
                <CardDescription>Connectez vos modeles pour activer l'analyse predictive et les commandes vocales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="provider">Fournisseur d'IA</Label>
                  <select name="ai_provider" defaultValue={settings?.ai_provider || "gemini"} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                    <option value="gemini">Google Gemini (Recommande)</option>
                    <option value="openai">OpenAI (ChatGPT)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai_api_key">Clé API (Gemini ou OpenAI)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      type="password" 
                      name="ai_api_key"
                      defaultValue={settings?.ai_api_key || ""}
                      placeholder="Laissez vide pour utiliser l'API gratuite integrée"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Votre clé est stockée de manière sécurisée dans la base de données et n'est utilisée que par le backend.</p>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-slate-100">
                   <div className="space-y-0.5">
                      <div className="text-sm font-bold text-slate-900">Analyse Automatique des Emails</div>
                      <div className="text-xs text-slate-500">L'IA classera vos emails entrants par priorite.</div>
                   </div>
                   <Switch name="ai_email_analysis" defaultChecked={settings?.ai_email_analysis ?? true} />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-12 shadow-lg shadow-indigo-500/20" type="submit">Activer l'IA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Centre de Notifications</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez etre informe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "crm", name: "Alertes CRM", desc: "Nouveau lead ou score IA eleve", icon: User },
                  { key: "finance", name: "Finance", desc: "Retards de paiement ou factures a valider", icon: CreditCard },
                  { key: "security", name: "Securite", desc: "Nouvelles connexions ou anomalies detectees", icon: Shield },
                  { key: "tasks", name: "Rappels de Taches", desc: "Echeances de projets approchantes", icon: Bell },
                ].map((item) => {
                  const notifications = settings?.notifications || {}
                  return (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
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
                          <Switch name={`${item.key}_email`} defaultChecked={notifications[`${item.key}_email`] !== false} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Push</span>
                          <Switch name={`${item.key}_push`} defaultChecked={notifications[`${item.key}_push`] === true} />
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="pt-4 flex justify-end">
                  <Button className="bg-indigo-600 hover:bg-indigo-700" type="submit">Enregistrer les notifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Securite</CardTitle>
                <CardDescription>Les changements de mot de passe passent par Supabase Auth.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" type="submit" formAction={requestPasswordReset}>Envoyer un lien de reinitialisation</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Facturation</CardTitle>
                <CardDescription>Votre plan et vos preferences de paiement.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold text-indigo-700">Plan IA Unlimited actif</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
