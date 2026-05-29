import Link from "next/link"
import { approveOrganizationMember, getOrganizationDetails, inviteOrganizationMember } from "./actions"
import { InviteMemberDialog } from "@/components/organisations/InviteMemberDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Building2, Users, Shield, Globe, Mail, Calendar } from "lucide-react"

export default async function OrganisationsPage() {
  const orgData = await getOrganizationDetails()

  if (!orgData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Building2 className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold">Organisation non trouvée</h2>
        <p className="text-slate-500">Une erreur est survenue lors de la récupération des données.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Organisations</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gérez les paramètres de votre entreprise et les membres de votre équipe.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-500" />
              Profil de l'Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="h-20 w-20 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <Building2 className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold">{orgData.name}</h3>
              <Badge variant="secondary" className="mt-1">Plan Pro</Badge>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Globe className="h-4 w-4" />
                  Domaine
                </div>
                <span className="font-medium">{orgData.domain || 'Non défini'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4" />
                  Créé le
                </div>
                <span className="font-medium">{new Date(orgData.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users className="h-4 w-4" />
                  Membres
                </div>
                <span className="font-medium">{orgData.members.length} actifs</span>
              </div>
            </div>

            <Button render={<Link href="/settings/organisation" />} variant="outline" className="w-full">Modifier le Profil</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Équipe & Membres</CardTitle>
              <CardDescription>Gérez les accès et les rôles de vos collaborateurs.</CardDescription>
            </div>
            <InviteMemberDialog
              action={inviteOrganizationMember}
              trigger={<Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Inviter</Button>}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orgData.members.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700">
                        {member.first_name?.[0]}{member.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.first_name} {member.last_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={member.is_active ? "outline" : "secondary"}>
                      {member.is_active ? "Actif" : "En attente"}
                    </Badge>
                    <Badge variant="secondary">
                      {member.role || "Utilisateur"}
                    </Badge>
                    {member.is_active ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Acces valide">
                        <Shield className="h-4 w-4 text-emerald-500" />
                      </Button>
                    ) : (
                      <form action={approveOrganizationMember}>
                        <input type="hidden" name="member_id" value={member.id} />
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Valider</Button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
