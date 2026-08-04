import { getAppSettings, requestPasswordReset, saveSettings } from "./actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, User, Globe, Moon, CreditCard, Sparkles, Lock, CheckCircle2, Package } from "lucide-react"

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const activeTab = typeof params.tab === "string" ? params.tab : "general"
  const savedSection = typeof params.saved === "string" ? params.saved : ""
  const settings = await getAppSettings()
  const notifications = settings?.notifications || {}
  const billingPlan = String(notifications.billing_plan || "unlimited")
  const billingCycle = String(notifications.billing_cycle || "monthly")
  const aiKey = settings?.openai_api_key || settings?.ai_api_key || ""
  const aiProviderLabel = settings?.ai_provider === "openai" || aiKey.startsWith("sk-") ? "OpenAI" : "Gemini"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Parametres</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personnalisez votre experience GNIX IA et gerez vos preferences.
        </p>
      </div>

      {savedSection && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          Parametres {savedSection === "notifications" ? "de notifications" : savedSection} enregistres et appliques a l'application.
        </div>
      )}

      <Tabs defaultValue={activeTab} className="space-y-4">
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
              <CardContent>
                <form action={saveSettings} className="space-y-6">
                <input type="hidden" name="settings_section" value="general" />
                <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Langue active: {settings?.language === "en" ? "English" : "Francais"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    Theme: {settings?.dark_mode ? "Sombre" : "Clair"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    Auto-traduction: {settings?.auto_translate === false ? "Inactive" : "Active"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Langue de l'interface</Label>
                  <div className="flex gap-4">
                    <label className="inline-flex cursor-pointer">
                      <input className="peer sr-only" type="radio" name="language" value="fr" defaultChecked={settings?.language !== "en"} />
                      <span className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600">Francais</span>
                    </label>
                    <label className="inline-flex cursor-pointer">
                      <input className="peer sr-only" type="radio" name="language" value="en" defaultChecked={settings?.language === "en"} />
                      <span className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600">English</span>
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
                </form>
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
              <CardContent>
                <form action={saveSettings} className="space-y-6">
                <input type="hidden" name="settings_section" value="ai" />
                <div className={`rounded-xl border px-4 py-3 text-xs font-bold ${aiKey ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-700"}`}>
                  {aiKey
                    ? `IA connectee via ${aiProviderLabel}. Les commandes et analyses utiliseront votre cle.`
                    : "Mode local actif. Ajoutez une cle API reelle pour tester les analyses avancees."}
                </div>
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
                      placeholder="OpenAI: sk-... / Gemini: AIza..."
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Si vous collez une cle OpenAI sk-..., GNIX IA utilisera automatiquement OpenAI. Une cle Gemini commence souvent par AIza.</p>
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
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle>Centre de Notifications</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez etre informe.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={saveSettings} className="space-y-4">
                <input type="hidden" name="settings_section" value="notifications" />
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-medium text-indigo-700">
                  Les notifications push alimentent la cloche du header avec les vraies alertes ERP en temps reel. Desactivez une categorie pour la retirer du flux.
                </div>
                {[
                  { key: "crm", name: "Alertes CRM", desc: "Nouveau lead ou score IA eleve", icon: User },
                  { key: "finance", name: "Finance", desc: "Retards de paiement ou factures a valider", icon: CreditCard },
                  { key: "security", name: "Securite", desc: "Nouvelles connexions ou anomalies detectees", icon: Shield },
                  { key: "tasks", name: "Rappels de Taches", desc: "Echeances de projets approchantes", icon: Bell },
                  { key: "stock", name: "Stock", desc: "Ruptures et seuils critiques", icon: Package },
                ].map((item) => {
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
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Securite</CardTitle>
                <CardDescription>Renforcez les acces, les sessions et les alertes de securite.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form action={saveSettings} className="space-y-4">
                  <input type="hidden" name="settings_section" value="security" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                      <div>
                        <div className="text-sm font-bold">Double authentification</div>
                        <div className="text-xs text-slate-500">Demander un second facteur a la connexion.</div>
                      </div>
                      <Switch name="two_factor_enabled" defaultChecked={settings?.two_factor_enabled ?? false} />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                      <div>
                        <div className="text-sm font-bold">Alertes de connexion</div>
                        <div className="text-xs text-slate-500">Notifier les nouvelles connexions.</div>
                      </div>
                      <Switch name="login_alerts" defaultChecked={notifications.login_alerts !== false} />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                      <div>
                        <div className="text-sm font-bold">Appareils approuves</div>
                        <div className="text-xs text-slate-500">Bloquer les appareils inconnus jusqu'a validation.</div>
                      </div>
                      <Switch name="device_approval" defaultChecked={notifications.device_approval === true} />
                    </div>
                    <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                      <Label htmlFor="session_timeout">Expiration session</Label>
                      <select id="session_timeout" name="session_timeout" defaultValue={String(notifications.session_timeout || "30")} className="mt-2 flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 heure</option>
                        <option value="240">4 heures</option>
                      </select>
                    </div>
                    <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 md:col-span-2">
                      <Label htmlFor="audit_retention">Retention audit logs</Label>
                      <select id="audit_retention" name="audit_retention" defaultValue={String(notifications.audit_retention || "90")} className="mt-2 flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                        <option value="30">30 jours</option>
                        <option value="90">90 jours</option>
                        <option value="365">1 an</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-indigo-600 hover:bg-indigo-700" type="submit">Enregistrer la securite</Button>
                  </div>
                </form>
                <form action={requestPasswordReset} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                  <div className="mb-3 text-sm font-bold">Mot de passe</div>
                  <Button variant="outline" type="submit">Envoyer un lien de reinitialisation</Button>
                </form>
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
                <form action={saveSettings} className="space-y-6">
                  <input type="hidden" name="settings_section" value="billing" />
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { id: "starter", name: "Starter", price: "19 000 FCFA", desc: "CRM, factures et chat interne." },
                      { id: "pro", name: "Pro", price: "49 000 FCFA", desc: "IA, marketplace et notifications avancees." },
                      { id: "unlimited", name: "IA Unlimited", price: "99 000 FCFA", desc: "Tous les modules, analyses et support prioritaire." },
                    ].map((plan) => (
                      <label key={plan.id} className="cursor-pointer">
                        <input className="peer sr-only" type="radio" name="billing_plan" value={plan.id} defaultChecked={billingPlan === plan.id} />
                        <div className="h-full rounded-2xl border border-slate-200 p-5 transition-all peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:ring-2 peer-checked:ring-indigo-100 dark:border-slate-800">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="font-black text-slate-900 dark:text-white">{plan.name}</div>
                            {billingPlan === plan.id && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                          </div>
                          <div className="text-2xl font-black text-indigo-600">{plan.price}</div>
                          <div className="mt-2 text-xs text-slate-500">{plan.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="billing_cycle">Cycle de paiement</Label>
                      <select id="billing_cycle" name="billing_cycle" defaultValue={billingCycle} className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600">
                        <option value="monthly">Mensuel</option>
                        <option value="yearly">Annuel (-15%)</option>
                      </select>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm font-bold text-indigo-700">
                      Plan actif: {billingPlan === "starter" ? "Starter" : billingPlan === "pro" ? "Pro" : "IA Unlimited"} / {billingCycle === "yearly" ? "Annuel" : "Mensuel"}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-indigo-600 hover:bg-indigo-700" type="submit">Mettre a jour le plan</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  )
}
