import { randomUUID } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { cookies } from "next/headers"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

function shouldUseLocalSeedData() {
  return process.env.NEXT_PUBLIC_USE_LOCAL_SEED === "true"
}

function getDataFilePath() {
  const baseDir = process.env.NODE_ENV === "production" ? "/tmp" : process.cwd()
  return path.join(baseDir, ".data", "erp-db.json")
}

function getIntegrationOverridesPath() {
  const baseDir = process.env.NODE_ENV === "production" ? "/tmp" : process.cwd()
  return path.join(baseDir, ".data", "erp-integration-overrides.json")
}

const dataFile = getDataFilePath()
const integrationOverridesFile = getIntegrationOverridesPath()

type IntegrationStatusMap = Record<string, "connected" | "available">

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

type BaseRecord = {
  id: string
  organization_id: string
  created_at: string
}

export type ProfileRecord = {
  id: string
  organization_id: string
  first_name: string
  last_name: string
  email: string
  avatar_url: string | null
  role: string
  is_active: boolean
  created_at: string
}

export type OrganizationRecord = {
  id: string
  name: string
  domain: string | null
  settings: Record<string, JsonValue>
  created_at: string
}

export type ClientRecord = BaseRecord & {
  name: string
  email: string
  phone: string
  type: string
  source: string
  status: string
  ai_conversion_score: number
  estimated_value: number
}

export type QuoteItem = {
  id: string
  name: string
  qty: number
  price: number
}

export type QuoteRecord = BaseRecord & {
  client_id: string
  quote_number: string
  total_amount: number
  status: string
  valid_until: string
  items: QuoteItem[]
}

export type InvoiceRecord = BaseRecord & {
  client_id: string
  invoice_number: string
  total_amount: number
  tax_amount: number
  status: string
  due_date: string
  ai_anomaly_flag: boolean
}

export type PaymentRecord = BaseRecord & {
  invoice_id: string
  amount: number
  payment_date: string
  payment_method: string
}

export type ProductRecord = BaseRecord & {
  sku: string
  name: string
  price: number
  image_url?: string
}

export type WarehouseRecord = BaseRecord & {
  name: string
  location: string
  capacity: number
}

export type InventoryRecord = BaseRecord & {
  product_id: string
  warehouse_id: string
  quantity: number
  location: string
}

export type StockEntryRecord = BaseRecord & {
  product_id: string
  warehouse_id: string
  quantity: number
  type: "in" | "out" | "transfer"
  notes: string
}

export type DeliveryItem = {
  id: string
  product_id: string
  qty: number
}

export type DeliveryNoteRecord = BaseRecord & {
  client_id: string
  delivery_number: string
  delivery_date: string
  notes: string
  items: DeliveryItem[]
  status: string
}

export type ShipmentRecord = BaseRecord & {
  tracking_number: string
  carrier: string
  status: string
  origin: string
  destination: string
  eta: string
  confidence: number
}

export type EmployeeRecord = BaseRecord & {
  first_name: string
  last_name: string
  email: string
  position: string
  department: string
  contract_type: string
  salary: number
  hire_date: string
  avatar_url: string | null
}

export type AttendanceRecord = BaseRecord & {
  employee_id: string
  employee_name: string
  time: string
  method: string
  status: string
  location: string
  attendance_date: string
}

export type LeaveRecord = BaseRecord & {
  employee_id: string
  employee_name: string
  start_date: string
  end_date: string
  type: string
  status: string
}

export type EvaluationRecord = BaseRecord & {
  employee_id: string
  employee_name: string
  period: string
  score: number
  status: string
  objective: string
}

export type ProjectRecord = BaseRecord & {
  client_id: string
  name: string
  status: string
  deadline: string
}

export type TaskRecord = BaseRecord & {
  project_id: string
  name: string
  status: string
  assignee: string
  ai_estimated_hours: number
}

export type MeetingRecord = BaseRecord & {
  project_id: string
  title: string
  meeting_date: string
  attendees: string[]
  status: string
}

export type CommunicationRecord = BaseRecord & {
  type: "email" | "whatsapp" | "call"
  client_name: string
  subject: string
  sentiment: string
  category: string
  summary: string
  channel_status: string
}

export type CallRecord = BaseRecord & {
  caller: string
  duration: string
  transcript: string
  status: string
}

export type ChatChannelRecord = BaseRecord & {
  name: string
}

export type ChatMessageRecord = BaseRecord & {
  channel_id: string
  author: string
  content: string
  sent_at: string
  is_me: boolean
}

export type TicketRecord = BaseRecord & {
  ticket_number: string
  subject: string
  requester: string
  priority: string
  status: string
  category: string
  created_label: string
}

export type AssetRecord = BaseRecord & {
  serial_number: string
  model: string
  assigned_to: string
  status: string
  location: string
}

export type IntegrationRecord = BaseRecord & {
  name: string
  description: string
  category: string
  status: "connected" | "available"
  icon: string
  color: string
}

export type AuditLogRecord = BaseRecord & {
  user_name: string
  action: string
  target: string
  ip_address: string
  severity: string
}

export type AppSettingsRecord = BaseRecord & {
  language: string
  dark_mode: boolean
  auto_translate: boolean
  ai_provider: string
  ai_email_analysis: boolean
  notifications: Record<string, JsonValue>
}

type ErpStore = {
  organizations: OrganizationRecord[]
  profiles: ProfileRecord[]
  clients: ClientRecord[]
  quotes: QuoteRecord[]
  invoices: InvoiceRecord[]
  payments: PaymentRecord[]
  products: ProductRecord[]
  warehouses: WarehouseRecord[]
  inventory: InventoryRecord[]
  stock_entries: StockEntryRecord[]
  delivery_notes: DeliveryNoteRecord[]
  shipments: ShipmentRecord[]
  employees: EmployeeRecord[]
  attendance: AttendanceRecord[]
  leaves: LeaveRecord[]
  evaluations: EvaluationRecord[]
  projects: ProjectRecord[]
  tasks: TaskRecord[]
  meetings: MeetingRecord[]
  communications: CommunicationRecord[]
  calls: CallRecord[]
  chat_channels: ChatChannelRecord[]
  chat_messages: ChatMessageRecord[]
  tickets: TicketRecord[]
  assets: AssetRecord[]
  integrations: IntegrationRecord[]
  audit_logs: AuditLogRecord[]
  settings: AppSettingsRecord[]
}

type StoreTableName = keyof ErpStore

type DbContext = {
  supabase: SupabaseClient
  user: User | null
  userId: string
  orgId: string
  orgName: string
  email: string
  isSupabaseWorkspaceReady: boolean
}

type SupabaseRow = Record<string, unknown>

const nowIso = () => new Date().toISOString()
const todayIso = () => new Date().toISOString().slice(0, 10)
const addDaysIso = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const id = (prefix: string) => `${prefix}_${randomUUID()}`

async function readIntegrationOverrides(): Promise<IntegrationStatusMap> {
  try {
    const raw = await readFile(integrationOverridesFile, "utf8")
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => value === "connected" || value === "available"),
      ) as IntegrationStatusMap
    }
  } catch {
    // No persisted override file yet.
  }

  return {}
}

async function writeIntegrationOverrides(overrides: IntegrationStatusMap) {
  try {
    await mkdir(path.dirname(integrationOverridesFile), { recursive: true })
    await writeFile(integrationOverridesFile, JSON.stringify(overrides, null, 2), "utf8")
  } catch {
    // Ignore write failures in restricted environments.
  }
}

function normalizeIntegrationName(name: string) {
  return name.trim().toLowerCase()
}

function applyIntegrationOverrides(apps: IntegrationRecord[], overrides: IntegrationStatusMap) {
  return apps.map((app) => ({
    ...app,
    status: overrides[app.id] ?? app.status,
  }))
}

function mergeIntegrationCatalog(
  dbRows: IntegrationRecord[] | null,
  overrides: IntegrationStatusMap,
  ctx: DbContext,
): IntegrationRecord[] {
  const defaults: IntegrationRecord[] = [
    {
      id: "catalog-openai",
      organization_id: ctx.orgId,
      name: "OpenAI (ChatGPT)",
      description: "Automatisez vos reponses clients et la classification des donnees par IA.",
      category: "Intelligence Artificielle",
      status: "connected",
      icon: "Cpu",
      color: "bg-amber-500",
      created_at: nowIso(),
    },
    {
      id: "catalog-whatsapp",
      organization_id: ctx.orgId,
      name: "WhatsApp Business",
      description: "Centralisez vos echanges clients et analysez les besoins via IA.",
      category: "Communication",
      status: "connected",
      icon: "MessageCircle",
      color: "bg-green-500",
      created_at: nowIso(),
    },
    {
      id: "catalog-shopify",
      organization_id: ctx.orgId,
      name: "Shopify",
      description: "Synchronisez vos stocks et vos commandes e-commerce en temps reel.",
      category: "E-commerce",
      status: "available",
      icon: "ShoppingCart",
      color: "bg-indigo-600",
      created_at: nowIso(),
    },
    {
      id: "catalog-webhooks",
      organization_id: ctx.orgId,
      name: "Site Web (Webhooks)",
      description: "Connectez votre site web pour recevoir des leads directs.",
      category: "Web",
      status: "available",
      icon: "Globe",
      color: "bg-blue-500",
      created_at: nowIso(),
    },
    {
      id: "catalog-slack",
      organization_id: ctx.orgId,
      name: "Slack",
      description: "Centralisez les notifications internes et les alertes commerciales en temps reel.",
      category: "Collaboration",
      status: "available",
      icon: "MessageSquareText",
      color: "bg-purple-500",
      created_at: nowIso(),
    },
    {
      id: "catalog-google-calendar",
      organization_id: ctx.orgId,
      name: "Google Calendar",
      description: "Synchronisez vos rendez-vous et automatisez les planifications client.",
      category: "Calendrier",
      status: "available",
      icon: "CalendarDays",
      color: "bg-rose-500",
      created_at: nowIso(),
    },
  ]

  const mergedDefaults = defaults.map((defaultApp) => {
    const match = dbRows?.find((row) => normalizeIntegrationName(row.name) === normalizeIntegrationName(defaultApp.name))

    if (!match) {
      return defaultApp
    }

    return {
      ...defaultApp,
      ...match,
      icon: defaultApp.icon,
      color: defaultApp.color,
    }
  })

  const extraApps = (dbRows ?? []).filter((row) =>
    !defaults.some((defaultApp) => normalizeIntegrationName(row.name) === normalizeIntegrationName(defaultApp.name)),
  )

  return applyIntegrationOverrides([...mergedDefaults, ...extraApps], overrides)
}

export function formText(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key)
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

export function formNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key))
  return Number.isFinite(value) ? value : fallback
}

function emptyStore(): ErpStore {
  return {
    organizations: [],
    profiles: [],
    clients: [],
    quotes: [],
    invoices: [],
    payments: [],
    products: [],
    warehouses: [],
    inventory: [],
    stock_entries: [],
    delivery_notes: [],
    shipments: [],
    employees: [],
    attendance: [],
    leaves: [],
    evaluations: [],
    projects: [],
    tasks: [],
    meetings: [],
    communications: [],
    calls: [],
    chat_channels: [],
    chat_messages: [],
    tickets: [],
    assets: [],
    integrations: [],
    audit_logs: [],
    settings: [],
  }
}

function seedWorkspace(orgId: string, userId: string, email: string, orgName: string): ErpStore {
  const createdAt = nowIso()
  const clientA = id("client")
  const clientB = id("client")
  const clientC = id("client")
  const warehouseA = id("warehouse")
  const warehouseB = id("warehouse")
  const productA = id("product")
  const productB = id("product")
  const productC = id("product")
  const employeeA = id("employee")
  const employeeB = id("employee")
  const projectA = id("project")
  const projectB = id("project")
  const invoiceA = id("invoice")
  const invoiceB = id("invoice")
  const invoiceC = id("invoice")
  const channelGeneral = id("channel")

  const store = emptyStore()

  store.organizations.push({
    id: orgId,
    name: orgName,
    domain: email.includes("@") ? email.split("@")[1] : "gnix.local",
    settings: {
      slogan: "L'IA au service de votre gestion",
      category: "service",
      address: "Boulevard Latrille, Cocody",
      city_country: "Abidjan, Cote d'Ivoire",
      website: "https://gnix.ia",
      phone: "+225 01 02 03 04 05",
    },
    created_at: createdAt,
  })

  store.profiles.push({
    id: userId,
    organization_id: orgId,
    first_name: "Bruno",
    last_name: "Admin",
    email,
    avatar_url: null,
    role: "Administrateur",
    is_active: true,
    created_at: createdAt,
  })

  store.clients.push(
    {
      id: clientA,
      organization_id: orgId,
      name: "SuperU Abidjan",
      email: "achats@superu.ci",
      phone: "+225 07 45 12 98 31",
      type: "B2B",
      source: "Site Web",
      status: "lead",
      ai_conversion_score: 88,
      estimated_value: 1250000,
      created_at: createdAt,
    },
    {
      id: clientB,
      organization_id: orgId,
      name: "Quincaillerie Centrale",
      email: "contact@quincaillerie.example",
      phone: "+225 05 60 10 11 12",
      type: "B2B",
      source: "LinkedIn",
      status: "client",
      ai_conversion_score: 72,
      estimated_value: 450000,
      created_at: createdAt,
    },
    {
      id: clientC,
      organization_id: orgId,
      name: "Mairie de Cocody",
      email: "services@cocody.example",
      phone: "+225 27 22 44 00 00",
      type: "GOV",
      source: "Referral",
      status: "lead",
      ai_conversion_score: 64,
      estimated_value: 2200000,
      created_at: createdAt,
    },
  )

  store.quotes.push({
    id: id("quote"),
    organization_id: orgId,
    client_id: clientA,
    quote_number: "DEV-2026-001",
    total_amount: 1250000,
    status: "sent",
    valid_until: addDaysIso(20),
    items: [
      { id: id("item"), name: "Pack ERP GNIX Pro", qty: 1, price: 950000 },
      { id: id("item"), name: "Formation equipe", qty: 3, price: 100000 },
    ],
    created_at: createdAt,
  })

  store.invoices.push(
    {
      id: invoiceA,
      organization_id: orgId,
      client_id: clientA,
      invoice_number: "F-2026-001",
      total_amount: 1250000,
      tax_amount: 225000,
      status: "paid",
      due_date: addDaysIso(-8),
      ai_anomaly_flag: false,
      created_at: createdAt,
    },
    {
      id: invoiceB,
      organization_id: orgId,
      client_id: clientB,
      invoice_number: "F-2026-002",
      total_amount: 450000,
      tax_amount: 81000,
      status: "pending",
      due_date: addDaysIso(7),
      ai_anomaly_flag: false,
      created_at: createdAt,
    },
    {
      id: invoiceC,
      organization_id: orgId,
      client_id: clientC,
      invoice_number: "F-2026-003",
      total_amount: 3850000,
      tax_amount: 693000,
      status: "overdue",
      due_date: addDaysIso(-12),
      ai_anomaly_flag: true,
      created_at: createdAt,
    },
  )

  store.payments.push(
    {
      id: id("payment"),
      organization_id: orgId,
      invoice_id: invoiceA,
      amount: 1250000,
      payment_date: addDaysIso(-7),
      payment_method: "bank",
      created_at: createdAt,
    },
    {
      id: id("payment"),
      organization_id: orgId,
      invoice_id: invoiceB,
      amount: 150000,
      payment_date: todayIso(),
      payment_method: "mobile",
      created_at: createdAt,
    },
  )

  store.warehouses.push(
    {
      id: warehouseA,
      organization_id: orgId,
      name: "Entrepot Central",
      location: "Zone Industrielle, Abidjan",
      capacity: 1700,
      created_at: createdAt,
    },
    {
      id: warehouseB,
      organization_id: orgId,
      name: "Hub Secondaire",
      location: "Koumassi, Abidjan",
      capacity: 900,
      created_at: createdAt,
    },
  )

  store.products.push(
    {
      id: productA,
      organization_id: orgId,
      sku: "CPU-001",
      name: "Processeur i7-12700K",
      price: 250000,
      created_at: createdAt,
    },
    {
      id: productB,
      organization_id: orgId,
      sku: "MB-982",
      name: "Carte Mere Z690",
      price: 180000,
      created_at: createdAt,
    },
    {
      id: productC,
      organization_id: orgId,
      sku: "PSU-102",
      name: "Alimentation 850W Gold",
      price: 95000,
      created_at: createdAt,
    },
  )

  store.inventory.push(
    {
      id: id("inventory"),
      organization_id: orgId,
      product_id: productA,
      warehouse_id: warehouseA,
      quantity: 45,
      location: "A-12-C",
      created_at: createdAt,
    },
    {
      id: id("inventory"),
      organization_id: orgId,
      product_id: productB,
      warehouse_id: warehouseA,
      quantity: 12,
      location: "B-04",
      created_at: createdAt,
    },
    {
      id: id("inventory"),
      organization_id: orgId,
      product_id: productC,
      warehouse_id: warehouseB,
      quantity: 28,
      location: "C-1",
      created_at: createdAt,
    },
  )

  store.delivery_notes.push(
    {
      id: id("delivery"),
      organization_id: orgId,
      client_id: clientA,
      delivery_number: "BL-2026-001",
      delivery_date: addDaysIso(-3),
      notes: "Livraison a l'entrepot principal.",
      items: [
        { id: id("delivery_item"), product_id: productA, qty: 4 },
        { id: id("delivery_item"), product_id: productB, qty: 2 },
      ],
      status: "validated",
      created_at: createdAt,
    },
    {
      id: id("delivery"),
      organization_id: orgId,
      client_id: clientB,
      delivery_number: "BL-2026-002",
      delivery_date: addDaysIso(1),
      notes: "Confirmer le quai de dechargement.",
      items: [{ id: id("delivery_item"), product_id: productC, qty: 5 }],
      status: "pending",
      created_at: createdAt,
    },
  )

  store.shipments.push(
    {
      id: id("shipment"),
      organization_id: orgId,
      tracking_number: "GNX-9821",
      carrier: "DHL Express",
      status: "in_transit",
      origin: "Paris, FR",
      destination: "Abidjan, CI",
      eta: addDaysIso(2),
      confidence: 98,
      created_at: createdAt,
    },
    {
      id: id("shipment"),
      organization_id: orgId,
      tracking_number: "GNX-7742",
      carrier: "GNIX Fleet",
      status: "delivered",
      origin: "Entrepot A",
      destination: "Client: SuperU",
      eta: addDaysIso(-1),
      confidence: 100,
      created_at: createdAt,
    },
    {
      id: id("shipment"),
      organization_id: orgId,
      tracking_number: "GNX-1205",
      carrier: "FedEx",
      status: "pending",
      origin: "Dubai, UAE",
      destination: "Lome, TG",
      eta: addDaysIso(5),
      confidence: 85,
      created_at: createdAt,
    },
  )

  store.employees.push(
    {
      id: employeeA,
      organization_id: orgId,
      first_name: "Jean",
      last_name: "Dupont",
      email: "jean.dupont@example.com",
      position: "Responsable Logistique",
      department: "Operations",
      contract_type: "CDI",
      salary: 12000000,
      hire_date: "2024-02-12",
      avatar_url: null,
      created_at: createdAt,
    },
    {
      id: employeeB,
      organization_id: orgId,
      first_name: "Marie",
      last_name: "Kouadio",
      email: "marie.kouadio@example.com",
      position: "Sales Lead",
      department: "Ventes",
      contract_type: "CDI",
      salary: 9800000,
      hire_date: "2023-09-01",
      avatar_url: null,
      created_at: createdAt,
    },
  )

  store.attendance.push(
    {
      id: id("attendance"),
      organization_id: orgId,
      employee_id: employeeA,
      employee_name: "Jean Dupont",
      time: "07:58",
      method: "Biometrie (IoT)",
      status: "ontime",
      location: "Siege Social",
      attendance_date: todayIso(),
      created_at: createdAt,
    },
    {
      id: id("attendance"),
      organization_id: orgId,
      employee_id: employeeB,
      employee_name: "Marie Kouadio",
      time: "08:15",
      method: "App Mobile (GPS)",
      status: "late",
      location: "Teletravail",
      attendance_date: todayIso(),
      created_at: createdAt,
    },
  )

  store.leaves.push({
    id: id("leave"),
    organization_id: orgId,
    employee_id: employeeB,
    employee_name: "Marie Kouadio",
    start_date: addDaysIso(8),
    end_date: addDaysIso(12),
    type: "Conge annuel",
    status: "pending",
    created_at: createdAt,
  })

  store.evaluations.push({
    id: id("evaluation"),
    organization_id: orgId,
    employee_id: employeeA,
    employee_name: "Jean Dupont",
    period: "T2 2026",
    score: 86,
    status: "planned",
    objective: "Reduire les retards de livraison de 10%",
    created_at: createdAt,
  })

  store.projects.push(
    {
      id: projectA,
      organization_id: orgId,
      client_id: clientA,
      name: "Deploiement ERP SuperU",
      status: "active",
      deadline: addDaysIso(24),
      created_at: createdAt,
    },
    {
      id: projectB,
      organization_id: orgId,
      client_id: clientC,
      name: "Portail services mairie",
      status: "paused",
      deadline: addDaysIso(45),
      created_at: createdAt,
    },
  )

  store.tasks.push(
    {
      id: id("task"),
      organization_id: orgId,
      project_id: projectA,
      name: "Parametrage des workflows ventes",
      status: "completed",
      assignee: "Marie Kouadio",
      ai_estimated_hours: 8,
      created_at: createdAt,
    },
    {
      id: id("task"),
      organization_id: orgId,
      project_id: projectA,
      name: "Migration catalogue produits",
      status: "in_progress",
      assignee: "Jean Dupont",
      ai_estimated_hours: 14,
      created_at: createdAt,
    },
    {
      id: id("task"),
      organization_id: orgId,
      project_id: projectB,
      name: "Validation cahier des charges",
      status: "todo",
      assignee: "Bruno Admin",
      ai_estimated_hours: 5,
      created_at: createdAt,
    },
  )

  store.meetings.push({
    id: id("meeting"),
    organization_id: orgId,
    project_id: projectA,
    title: "Comite de pilotage SuperU",
    meeting_date: addDaysIso(2),
    attendees: ["Bruno Admin", "Marie Kouadio", "Client SuperU"],
    status: "scheduled",
    created_at: createdAt,
  })

  store.communications.push(
    {
      id: id("comm"),
      organization_id: orgId,
      type: "email",
      client_name: "Jean Dupont",
      subject: "Question sur devis #45",
      sentiment: "neutral",
      category: "Commercial",
      summary: "Le client demande une remise sur les frais de port.",
      channel_status: "open",
      created_at: createdAt,
    },
    {
      id: id("comm"),
      organization_id: orgId,
      type: "whatsapp",
      client_name: "Marie Curie",
      subject: "Urgence livraison",
      sentiment: "negative",
      category: "Logistique",
      summary: "Colis non recu apres 3 jours de retard.",
      channel_status: "open",
      created_at: createdAt,
    },
    {
      id: id("comm"),
      organization_id: orgId,
      type: "email",
      client_name: "Robert Ford",
      subject: "Retour materiel",
      sentiment: "positive",
      category: "Support",
      summary: "Remerciements apres resolution du ticket.",
      channel_status: "closed",
      created_at: createdAt,
    },
  )

  store.calls.push(
    {
      id: id("call"),
      organization_id: orgId,
      caller: "Client SuperU",
      duration: "04:12",
      transcript: "Demande de confirmation de livraison.",
      status: "analyzed",
      created_at: createdAt,
    },
    {
      id: id("call"),
      organization_id: orgId,
      caller: "Quincaillerie Centrale",
      duration: "02:38",
      transcript: "Question sur une facture en attente.",
      status: "analyzed",
      created_at: createdAt,
    },
  )

  store.chat_channels.push(
    { id: channelGeneral, organization_id: orgId, name: "General", created_at: createdAt },
    { id: id("channel"), organization_id: orgId, name: "Annonces", created_at: createdAt },
    { id: id("channel"), organization_id: orgId, name: "Projet Alpha", created_at: createdAt },
    { id: id("channel"), organization_id: orgId, name: "Support IT", created_at: createdAt },
  )

  store.chat_messages.push(
    {
      id: id("message"),
      organization_id: orgId,
      channel_id: channelGeneral,
      author: "Admin GNIX",
      content: "Bonjour a tous ! L'IA a fini l'analyse des ventes de la veille.",
      sent_at: "09:12",
      is_me: false,
      created_at: createdAt,
    },
    {
      id: id("message"),
      organization_id: orgId,
      channel_id: channelGeneral,
      author: "Moi",
      content: "Super, merci pour l'info ! Je vais regarder ca tout de suite.",
      sent_at: "09:15",
      is_me: true,
      created_at: createdAt,
    },
  )

  store.tickets.push(
    {
      id: id("ticket"),
      organization_id: orgId,
      ticket_number: "T-1001",
      subject: "Ecran casse - Laptop RH",
      requester: "Alice Brown",
      priority: "high",
      status: "open",
      category: "Materiel",
      created_label: "1h",
      created_at: createdAt,
    },
    {
      id: id("ticket"),
      organization_id: orgId,
      ticket_number: "T-1002",
      subject: "Acces VPN impossible",
      requester: "Marc Levin",
      priority: "medium",
      status: "in_progress",
      category: "Reseau",
      created_label: "3h",
      created_at: createdAt,
    },
    {
      id: id("ticket"),
      organization_id: orgId,
      ticket_number: "T-1003",
      subject: "Installation Office 365",
      requester: "Julie Kern",
      priority: "low",
      status: "resolved",
      category: "Logiciel",
      created_label: "1j",
      created_at: createdAt,
    },
  )

  store.assets.push(
    {
      id: id("asset"),
      organization_id: orgId,
      serial_number: "GNX-LPT-001",
      model: "Dell Latitude 7440",
      assigned_to: "Marie Kouadio",
      status: "active",
      location: "Siege Social",
      created_at: createdAt,
    },
    {
      id: id("asset"),
      organization_id: orgId,
      serial_number: "GNX-SRV-009",
      model: "Serveur Backup NAS",
      assigned_to: "IT",
      status: "maintenance",
      location: "Salle serveur",
      created_at: createdAt,
    },
  )

  store.integrations.push(
    {
      id: id("integration"),
      organization_id: orgId,
      name: "OpenAI (ChatGPT)",
      description: "Automatisez vos reponses clients et la classification des donnees par IA.",
      category: "Intelligence Artificielle",
      status: "connected",
      icon: "Cpu",
      color: "bg-emerald-500",
      created_at: createdAt,
    },
    {
      id: id("integration"),
      organization_id: orgId,
      name: "Shopify",
      description: "Synchronisez vos stocks et vos commandes e-commerce en temps reel.",
      category: "E-commerce",
      status: "available",
      icon: "ShoppingCart",
      color: "bg-indigo-600",
      created_at: createdAt,
    },
    {
      id: id("integration"),
      organization_id: orgId,
      name: "WhatsApp Business",
      description: "Centralisez vos echanges clients et analysez les besoins via IA.",
      category: "Communication",
      status: "connected",
      icon: "MessageCircle",
      color: "bg-green-500",
      created_at: createdAt,
    },
    {
      id: id("integration"),
      organization_id: orgId,
      name: "Site Web (Webhooks)",
      description: "Connectez votre site web pour recevoir des leads directs.",
      category: "Web",
      status: "available",
      icon: "Globe",
      color: "bg-blue-500",
      created_at: createdAt,
    },
  )

  store.audit_logs.push(
    {
      id: id("audit"),
      organization_id: orgId,
      user_name: "Admin",
      action: "Creation organisation",
      target: orgName,
      ip_address: "127.0.0.1",
      severity: "low",
      created_at: createdAt,
    },
    {
      id: id("audit"),
      organization_id: orgId,
      user_name: "Systeme IA",
      action: "Analyse factures",
      target: "Finance",
      ip_address: "127.0.0.1",
      severity: "medium",
      created_at: createdAt,
    },
  )

  store.settings.push({
    id: id("settings"),
    organization_id: orgId,
    language: "fr",
    dark_mode: false,
    auto_translate: true,
    ai_provider: "gemini",
    ai_email_analysis: true,
    notifications: {
      crm_email: true,
      finance_email: true,
      security_email: true,
      tasks_email: true,
      crm_push: false,
      finance_push: true,
      security_push: true,
      tasks_push: false,
    },
    created_at: createdAt,
  })

  return store
}

function mergeStore(target: ErpStore, source: ErpStore) {
  target.organizations.push(...source.organizations)
  target.profiles.push(...source.profiles)
  target.clients.push(...source.clients)
  target.quotes.push(...source.quotes)
  target.invoices.push(...source.invoices)
  target.payments.push(...source.payments)
  target.products.push(...source.products)
  target.warehouses.push(...source.warehouses)
  target.inventory.push(...source.inventory)
  target.stock_entries.push(...source.stock_entries)
  target.delivery_notes.push(...source.delivery_notes)
  target.shipments.push(...source.shipments)
  target.employees.push(...source.employees)
  target.attendance.push(...source.attendance)
  target.leaves.push(...source.leaves)
  target.evaluations.push(...source.evaluations)
  target.projects.push(...source.projects)
  target.tasks.push(...source.tasks)
  target.meetings.push(...source.meetings)
  target.communications.push(...source.communications)
  target.calls.push(...source.calls)
  target.chat_channels.push(...source.chat_channels)
  target.chat_messages.push(...source.chat_messages)
  target.tickets.push(...source.tickets)
  target.assets.push(...source.assets)
  target.integrations.push(...source.integrations)
  target.audit_logs.push(...source.audit_logs)
  target.settings.push(...source.settings)
  return target
}

async function readStore(): Promise<ErpStore> {
  if (!shouldUseLocalSeedData()) {
    return emptyStore()
  }

  try {
    const raw = await readFile(dataFile, "utf8")
    return { ...emptyStore(), ...JSON.parse(raw) } as ErpStore
  } catch {
    return emptyStore()
  }
}

async function writeStore(store: ErpStore) {
  if (!shouldUseLocalSeedData()) {
    return
  }

  try {
    await mkdir(path.dirname(getDataFilePath()), { recursive: true })
    await writeFile(getDataFilePath(), JSON.stringify(store, null, 2), "utf8")
  } catch {
    // Fallback for serverless environments where the working directory is read-only.
  }
}

function metadataText(user: User | null, key: string, fallback = "") {
  const value = user?.user_metadata?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

async function getDbContext(): Promise<DbContext> {
  let localSessionEmail = ""

  try {
    const cookieStore = await cookies()
    localSessionEmail = cookieStore.get("gnix_demo_user")?.value ?? ""
  } catch {
    localSessionEmail = ""
  }

  const decodedLocalEmail = localSessionEmail ? decodeURIComponent(localSessionEmail) : ""
  const fallbackUserId = decodedLocalEmail ? `demo-${decodedLocalEmail.replace(/[^a-z0-9]/gi, "-")}` : "demo-user"
  const fallbackEmail = decodedLocalEmail ?? "bruno@gnix.local"
  const fallbackOrgId = decodedLocalEmail ? `local-${decodedLocalEmail.replace(/[^a-z0-9]/gi, "-")}` : "local-demo-org"

  let supabase: SupabaseClient | null = null

  try {
    supabase = await createClient()
  } catch {
    supabase = null
  }

  if (!supabase) {
    return {
      supabase: null as unknown as SupabaseClient,
      user: null,
      userId: fallbackUserId,
      orgId: fallbackOrgId,
      orgName: "GNIX IA SARL",
      email: fallbackEmail,
      isSupabaseWorkspaceReady: false,
    }
  }

  let authTimedOut = false
  let user: User | null = null

  try {
    user = await Promise.race([
      supabase.auth.getUser().then((result) => result.data.user),
      new Promise<null>((resolve) =>
        setTimeout(() => {
          authTimedOut = true
          resolve(null)
        }, 1200)
      ),
    ])
  } catch {
    authTimedOut = true
    user = null
  }

  const userId = user?.id ?? fallbackUserId
  const email = user?.email ?? fallbackEmail
  const companyName = metadataText(user, "company_name", "GNIX IA SARL")
  const resolvedOrgId = user ? `local-${user.id}` : fallbackOrgId

  if (!user || authTimedOut) {
    return {
      supabase,
      user,
      userId,
      orgId: resolvedOrgId,
      orgName: companyName,
      email,
      isSupabaseWorkspaceReady: false,
    }
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, first_name, last_name, email")
      .eq("id", user.id)
      .maybeSingle()

    const profileOrgId =
      profile && typeof profile.organization_id === "string" ? profile.organization_id : null

    if (profileOrgId) {
      return {
        supabase,
        user,
        userId,
        orgId: profileOrgId,
        orgName: companyName,
        email,
        isSupabaseWorkspaceReady: true,
      }
    }

    const orgId = id("org")
    const organization: OrganizationRecord = {
      id: orgId,
      name: companyName,
      domain: email.includes("@") ? email.split("@")[1] : null,
      settings: {},
      created_at: nowIso(),
    }

    const { error: orgError } = await supabase.from("organizations").insert([organization])
    if (orgError) throw orgError

    const profilePayload: ProfileRecord = {
      id: user.id,
      organization_id: orgId,
      first_name: metadataText(user, "first_name", "Utilisateur"),
      last_name: metadataText(user, "last_name", ""),
      email,
      avatar_url: null,
      role: "Administrateur",
      is_active: true,
      created_at: nowIso(),
    }

    const { error: profileError } = await supabase.from("profiles").upsert([profilePayload])
    if (profileError) throw profileError

    return {
      supabase,
      user,
      userId,
      orgId,
      orgName: companyName,
      email,
      isSupabaseWorkspaceReady: true,
    }
  } catch {
    return {
      supabase,
      user,
      userId,
      orgId: resolvedOrgId,
      orgName: companyName,
      email,
      isSupabaseWorkspaceReady: false,
    }
  }
}

async function readWorkspaceStore(ctx: DbContext) {
  const store = await readStore()

  if (!shouldUseLocalSeedData()) {
    return emptyStore()
  }

  const hasOrganization = store.organizations.some((org) => org.id === ctx.orgId)

  if (!hasOrganization) {
    mergeStore(store, seedWorkspace(ctx.orgId, ctx.userId, ctx.email, ctx.orgName))
    await writeStore(store)
  }

  return store
}

async function selectSupabaseRows<T extends BaseRecord>(
  ctx: DbContext,
  table: string,
  orderBy = "created_at",
  ascending = false,
): Promise<T[] | null> {
  if (!ctx.isSupabaseWorkspaceReady) return null

  const { data, error } = await ctx.supabase
    .from(table)
    .select("*")
    .eq("organization_id", ctx.orgId)
    .order(orderBy, { ascending })

  if (error || !data) return null
  return data as T[]
}

async function insertSupabaseRow<T extends BaseRecord>(ctx: DbContext, table: string, row: T) {
  if (!ctx.isSupabaseWorkspaceReady) return false
  const { error } = await ctx.supabase.from(table).insert([row])
  return !error
}

async function updateSupabaseRow(ctx: DbContext, table: string, recordId: string, patch: SupabaseRow) {
  if (!ctx.isSupabaseWorkspaceReady) return false
  const { error } = await ctx.supabase
    .from(table)
    .update(patch)
    .eq("id", recordId)
    .eq("organization_id", ctx.orgId)
  return !error
}

async function localRows<K extends StoreTableName>(ctx: DbContext, table: K): Promise<ErpStore[K]> {
  const store = await readWorkspaceStore(ctx)
  return store[table].filter((row) => {
    if ("organization_id" in row) return row.organization_id === ctx.orgId
    if ("id" in row) return row.id === ctx.orgId
    return false
  }) as ErpStore[K]
}

async function mutateStore<T>(ctx: DbContext, mutator: (store: ErpStore) => T) {
  const store = await readWorkspaceStore(ctx)
  const result = mutator(store)
  await writeStore(store)
  return result
}

async function logAudit(ctx: DbContext, action: string, target: string, severity = "low") {
  const entry: AuditLogRecord = {
    id: id("audit"),
    organization_id: ctx.orgId,
    user_name: ctx.email.split("@")[0] || "Utilisateur",
    action,
    target,
    ip_address: "127.0.0.1",
    severity,
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "audit_logs", entry))) {
    await mutateStore(ctx, (store) => {
      store.audit_logs.unshift(entry)
    })
  }
}

function quoteNumber(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`
}

function normalizeQuoteItems(items: unknown): QuoteItem[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {}
    return {
      id: typeof row.id === "string" ? row.id : id("item"),
      name: typeof row.name === "string" ? row.name : "",
      qty: Number(row.qty) || 0,
      price: Number(row.price) || 0,
    }
  })
}

function normalizeDeliveryItems(items: unknown): DeliveryItem[] {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {}
    return {
      id: typeof row.id === "string" ? row.id : id("delivery_item"),
      product_id: typeof row.product_id === "string" ? row.product_id : "",
      qty: Number(row.qty) || 0,
    }
  })
}

export async function getDashboardData() {
  const [clients, invoices, projects, products, tasks] = await Promise.all([
    getClientsData(),
    getInvoicesData(),
    getProjectsData(),
    getProductsData(),
    getTasksData(),
  ])

  const paidRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.total_amount, 0)
  const pipeline = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)
  const avgScore = clients.length
    ? Math.round(clients.reduce((sum, client) => sum + client.ai_conversion_score, 0) / clients.length)
    : 0
  const openTasks = tasks.filter((task) => task.status !== "completed").length
  const lowStock = products.filter((product) => product.totalStock <= 10).length
  const anomalies = invoices.filter((invoice) => invoice.ai_anomaly_flag || invoice.status === "overdue")

  return {
    totalRevenue: pipeline,
    paidRevenue,
    clientsCount: clients.length,
    projectsCount: projects.length,
    avgScore,
    openTasks,
    lowStock,
    anomalies,
    topClients: clients.slice(0, 3),
  }
}

export async function getClientsData() {
  const ctx = await getDbContext()
  const rows = (await selectSupabaseRows<ClientRecord>(ctx, "clients", "ai_conversion_score", false))
    ?? (await localRows(ctx, "clients"))

  return [...rows].sort((a, b) => b.ai_conversion_score - a.ai_conversion_score)
}

export async function createClientData(formData: FormData) {
  const ctx = await getDbContext()
  const record: ClientRecord = {
    id: id("client"),
    organization_id: ctx.orgId,
    name: formText(formData, "name", "Client sans nom"),
    email: formText(formData, "email"),
    phone: formText(formData, "phone"),
    type: formText(formData, "type", "B2B"),
    source: formText(formData, "source", "Manuel"),
    status: "lead",
    ai_conversion_score: Math.min(98, Math.max(35, 45 + formText(formData, "name").length * 3)),
    estimated_value: formNumber(formData, "estimated_value", 0),
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "clients", record))) {
    await mutateStore(ctx, (store) => store.clients.unshift(record))
  }
  await logAudit(ctx, "Creation client", record.name)
}

export async function getQuotesData() {
  const ctx = await getDbContext()
  const rows = (await selectSupabaseRows<QuoteRecord>(ctx, "quotes"))
    ?? (await localRows(ctx, "quotes"))
  const clients = await getClientsData()

  return rows.map((quote) => ({
    ...quote,
    items: normalizeQuoteItems(quote.items),
    client: clients.find((client) => client.id === quote.client_id) ?? null,
  }))
}

export async function createQuoteData(formData: FormData, items: unknown) {
  const ctx = await getDbContext()
  const quoteItems = normalizeQuoteItems(items).filter((item) => item.name && item.qty > 0)
  const totalAmount = quoteItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const record: QuoteRecord = {
    id: id("quote"),
    organization_id: ctx.orgId,
    client_id: formText(formData, "client_id"),
    quote_number: quoteNumber("DEV"),
    total_amount: totalAmount,
    status: "draft",
    valid_until: formText(formData, "valid_until", addDaysIso(15)),
    items: quoteItems,
    created_at: nowIso(),
  }

  if (!record.client_id) throw new Error("Selectionnez un client.")

  if (!(await insertSupabaseRow(ctx, "quotes", record))) {
    await mutateStore(ctx, (store) => store.quotes.unshift(record))
  }
  await logAudit(ctx, "Creation devis", record.quote_number)
}

export async function getInvoicesData() {
  const ctx = await getDbContext()
  const rows = (await selectSupabaseRows<InvoiceRecord>(ctx, "invoices"))
    ?? (await localRows(ctx, "invoices"))
  const clients = await getClientsData()

  return rows.map((invoice) => ({
    ...invoice,
    clients: clients.find((client) => client.id === invoice.client_id) ?? null,
  }))
}

export async function createInvoiceData(formData: FormData) {
  const ctx = await getDbContext()
  const clients = await getClientsData()
  const clientId = formText(formData, "client_id", clients[0]?.id)
  if (!clientId) throw new Error("Creez d'abord un client dans le CRM.")

  const amount = formNumber(formData, "amount")
  const record: InvoiceRecord = {
    id: id("invoice"),
    organization_id: ctx.orgId,
    client_id: clientId,
    invoice_number: quoteNumber("F"),
    total_amount: amount,
    tax_amount: Math.round(amount * 0.18),
    status: formText(formData, "status", "pending"),
    due_date: formText(formData, "due_date", addDaysIso(15)),
    ai_anomaly_flag: amount > 3000000,
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "invoices", record))) {
    await mutateStore(ctx, (store) => store.invoices.unshift(record))
  }
  await logAudit(ctx, "Creation facture", record.invoice_number, record.ai_anomaly_flag ? "medium" : "low")
}

export async function getPaymentsData() {
  const ctx = await getDbContext()
  const rows = (await selectSupabaseRows<PaymentRecord>(ctx, "payments"))
    ?? (await localRows(ctx, "payments"))
  const invoices = await getInvoicesData()

  return rows.map((payment) => ({
    ...payment,
    invoice: invoices.find((invoice) => invoice.id === payment.invoice_id) ?? null,
  }))
}

export async function createPaymentData(formData: FormData) {
  const ctx = await getDbContext()
  const invoiceId = formText(formData, "invoice_id")
  if (!invoiceId) throw new Error("Selectionnez une facture.")

  const amount = formNumber(formData, "amount")
  const record: PaymentRecord = {
    id: id("payment"),
    organization_id: ctx.orgId,
    invoice_id: invoiceId,
    amount,
    payment_date: formText(formData, "payment_date", todayIso()),
    payment_method: formText(formData, "payment_method", "cash"),
    created_at: nowIso(),
  }

  const inserted = await insertSupabaseRow(ctx, "payments", record)
  if (inserted) {
    await updateSupabaseRow(ctx, "invoices", invoiceId, { status: "paid" })
  } else {
    await mutateStore(ctx, (store) => {
      store.payments.unshift(record)
      const invoice = store.invoices.find((item) => item.id === invoiceId && item.organization_id === ctx.orgId)
      if (invoice && amount >= invoice.total_amount) invoice.status = "paid"
    })
  }
  await logAudit(ctx, "Enregistrement paiement", invoiceId)
}

export async function getProductsData() {
  const ctx = await getDbContext()
  const products = (await selectSupabaseRows<ProductRecord>(ctx, "products"))
    ?? (await localRows(ctx, "products"))
  const inventory = (await selectSupabaseRows<InventoryRecord>(ctx, "inventory"))
    ?? (await localRows(ctx, "inventory"))
  const warehouses = await getWarehousesData()

  return products.map((product) => {
    const productInventory = inventory
      .filter((row) => row.product_id === product.id)
      .map((row) => ({
        ...row,
        warehouses: warehouses.find((warehouse) => warehouse.id === row.warehouse_id) ?? null,
      }))

    return {
      ...product,
      inventory: productInventory,
      totalStock: productInventory.reduce((sum, item) => sum + item.quantity, 0),
    }
  })
}

export async function createProductData(formData: FormData) {
  const ctx = await getDbContext()
  const record: ProductRecord = {
    id: id("product"),
    organization_id: ctx.orgId,
    name: formText(formData, "name", "Produit sans nom"),
    sku: formText(formData, "sku", quoteNumber("SKU")),
    price: formNumber(formData, "price"),
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "products", record))) {
    await mutateStore(ctx, (store) => store.products.unshift(record))
  }
  await logAudit(ctx, "Creation produit", record.sku)
}

export async function getWarehousesData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<WarehouseRecord>(ctx, "warehouses", "name", true))
    ?? (await localRows(ctx, "warehouses"))
}

export async function createStockEntryData(formData: FormData) {
  const ctx = await getDbContext()
  const productId = formText(formData, "product_id")
  const warehouseId = formText(formData, "warehouse_id")
  const quantity = formNumber(formData, "quantity")

  if (!productId || !warehouseId || quantity <= 0) {
    throw new Error("Produit, entrepot et quantite sont requis.")
  }

  const record: StockEntryRecord = {
    id: id("stock"),
    organization_id: ctx.orgId,
    product_id: productId,
    warehouse_id: warehouseId,
    quantity,
    type: "in",
    notes: formText(formData, "notes"),
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "stock_entries", record))) {
    await mutateStore(ctx, (store) => {
      store.stock_entries.unshift(record)
      const existing = store.inventory.find(
        (item) =>
          item.organization_id === ctx.orgId &&
          item.product_id === productId &&
          item.warehouse_id === warehouseId,
      )
      if (existing) {
        existing.quantity += quantity
        if (record.notes) existing.location = record.notes
      } else {
        store.inventory.unshift({
          id: id("inventory"),
          organization_id: ctx.orgId,
          product_id: productId,
          warehouse_id: warehouseId,
          quantity,
          location: record.notes,
          created_at: nowIso(),
        })
      }
    })
  }
  await logAudit(ctx, "Entree de stock", productId)
}

export async function getDeliveryNotesData() {
  const ctx = await getDbContext()
  const rows = (await selectSupabaseRows<DeliveryNoteRecord>(ctx, "delivery_notes"))
    ?? (await localRows(ctx, "delivery_notes"))
  const clients = await getClientsData()
  const products = await getProductsData()

  return rows.map((note) => ({
    ...note,
    items: normalizeDeliveryItems(note.items),
    client: clients.find((client) => client.id === note.client_id) ?? null,
    products,
  }))
}

export async function createDeliveryNoteData(formData: FormData, items: unknown) {
  const ctx = await getDbContext()
  const deliveryItems = normalizeDeliveryItems(items).filter((item) => item.product_id && item.qty > 0)
  const record: DeliveryNoteRecord = {
    id: id("delivery"),
    organization_id: ctx.orgId,
    client_id: formText(formData, "client_id"),
    delivery_number: quoteNumber("BL"),
    delivery_date: formText(formData, "delivery_date", todayIso()),
    notes: formText(formData, "notes"),
    items: deliveryItems,
    status: "pending",
    created_at: nowIso(),
  }

  if (!record.client_id) throw new Error("Selectionnez un client.")
  if (!deliveryItems.length) throw new Error("Ajoutez au moins un article.")

  if (!(await insertSupabaseRow(ctx, "delivery_notes", record))) {
    await mutateStore(ctx, (store) => {
      store.delivery_notes.unshift(record)
      for (const item of deliveryItems) {
        const inventory = store.inventory.find(
          (row) => row.organization_id === ctx.orgId && row.product_id === item.product_id,
        )
        if (inventory) inventory.quantity = Math.max(0, inventory.quantity - item.qty)
      }
    })
  }
  await logAudit(ctx, "Creation BL", record.delivery_number)
}

export async function getShipmentsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<ShipmentRecord>(ctx, "shipments"))
    ?? (await localRows(ctx, "shipments"))
}

export async function getEmployeesData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<EmployeeRecord>(ctx, "employees", "created_at", true))
    ?? (await localRows(ctx, "employees"))
}

export async function createEmployeeData(formData: FormData) {
  const ctx = await getDbContext()
  const firstName = formText(formData, "first_name")
  const lastName = formText(formData, "last_name")
  const record: EmployeeRecord = {
    id: id("employee"),
    organization_id: ctx.orgId,
    first_name: firstName,
    last_name: lastName,
    email: formText(formData, "email"),
    department: formText(formData, "department", "General"),
    position: formText(formData, "position", "Collaborateur"),
    contract_type: formText(formData, "contract_type", "CDI"),
    salary: formNumber(formData, "salary"),
    hire_date: todayIso(),
    avatar_url: null,
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "employees", record))) {
    await mutateStore(ctx, (store) => store.employees.unshift(record))
  }
  await logAudit(ctx, "Creation employe", `${firstName} ${lastName}`.trim())
}

export async function getAttendanceData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<AttendanceRecord>(ctx, "attendance"))
    ?? (await localRows(ctx, "attendance"))
}

export async function getLeavesData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<LeaveRecord>(ctx, "leaves"))
    ?? (await localRows(ctx, "leaves"))
}

export async function createLeaveData(formData: FormData) {
  const ctx = await getDbContext()
  const employees = await getEmployeesData()
  const employee = employees.find((item) => item.id === formText(formData, "employee_id")) ?? employees[0]
  if (!employee) throw new Error("Ajoutez un employe avant de creer une absence.")

  const record: LeaveRecord = {
    id: id("leave"),
    organization_id: ctx.orgId,
    employee_id: employee.id,
    employee_name: `${employee.first_name} ${employee.last_name}`.trim(),
    start_date: formText(formData, "start_date", todayIso()),
    end_date: formText(formData, "end_date", addDaysIso(2)),
    type: formText(formData, "type", "Conge annuel"),
    status: "pending",
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "leaves", record))) {
    await mutateStore(ctx, (store) => store.leaves.unshift(record))
  }
  await logAudit(ctx, "Demande de conge", record.employee_name)
}

export async function getEvaluationsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<EvaluationRecord>(ctx, "evaluations"))
    ?? (await localRows(ctx, "evaluations"))
}

export async function getProjectsData() {
  const ctx = await getDbContext()
  const rows = (await selectSupabaseRows<ProjectRecord>(ctx, "projects"))
    ?? (await localRows(ctx, "projects"))
  const tasks = await getTasksData()

  return rows.map((project) => ({
    ...project,
    tasks: tasks.filter((task) => task.project_id === project.id),
  }))
}

export async function createProjectData(formData: FormData) {
  const ctx = await getDbContext()
  const clients = await getClientsData()
  const record: ProjectRecord = {
    id: id("project"),
    organization_id: ctx.orgId,
    client_id: formText(formData, "client_id", clients[0]?.id),
    name: formText(formData, "name", "Projet sans nom"),
    status: formText(formData, "status", "active"),
    deadline: formText(formData, "deadline", addDaysIso(30)),
    created_at: nowIso(),
  }

  if (!record.client_id) throw new Error("Creez d'abord un client.")

  if (!(await insertSupabaseRow(ctx, "projects", record))) {
    await mutateStore(ctx, (store) => store.projects.unshift(record))
  }
  await logAudit(ctx, "Creation projet", record.name)
}

export async function getTasksData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<TaskRecord>(ctx, "tasks"))
    ?? (await localRows(ctx, "tasks"))
}

export async function createTaskData(formData: FormData) {
  const ctx = await getDbContext()
  const projects = await getProjectsData()
  const projectId = formText(formData, "project_id", projects[0]?.id)
  if (!projectId) throw new Error("Creez un projet avant d'ajouter une tache.")

  const record: TaskRecord = {
    id: id("task"),
    organization_id: ctx.orgId,
    project_id: projectId,
    name: formText(formData, "name", "Nouvelle tache"),
    status: formText(formData, "status", "todo"),
    assignee: formText(formData, "assignee", "Equipe"),
    ai_estimated_hours: formNumber(formData, "ai_estimated_hours", 4),
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "tasks", record))) {
    await mutateStore(ctx, (store) => store.tasks.unshift(record))
  }
  await logAudit(ctx, "Creation tache", record.name)
}

export async function getMeetingsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<MeetingRecord>(ctx, "meetings"))
    ?? (await localRows(ctx, "meetings"))
}

export async function createMeetingData(formData: FormData) {
  const ctx = await getDbContext()
  const projects = await getProjectsData()
  const record: MeetingRecord = {
    id: id("meeting"),
    organization_id: ctx.orgId,
    project_id: formText(formData, "project_id", projects[0]?.id),
    title: formText(formData, "title", "Nouvelle reunion"),
    meeting_date: formText(formData, "meeting_date", addDaysIso(1)),
    attendees: formText(formData, "attendees", "Equipe").split(",").map((item) => item.trim()),
    status: "scheduled",
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "meetings", record))) {
    await mutateStore(ctx, (store) => store.meetings.unshift(record))
  }
  await logAudit(ctx, "Creation reunion", record.title)
}

export async function getCommunicationsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<CommunicationRecord>(ctx, "communications"))
    ?? (await localRows(ctx, "communications"))
}

export async function getCallsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<CallRecord>(ctx, "calls"))
    ?? (await localRows(ctx, "calls"))
}

export async function getChatData() {
  const ctx = await getDbContext()
  const channels = (await selectSupabaseRows<ChatChannelRecord>(ctx, "chat_channels", "created_at", true))
    ?? (await localRows(ctx, "chat_channels"))
  const messages = (await selectSupabaseRows<ChatMessageRecord>(ctx, "chat_messages", "created_at", true))
    ?? (await localRows(ctx, "chat_messages"))
  const users = await getEmployeesData()

  return { channels, messages, users }
}

export async function sendChatMessageData(formData: FormData) {
  const ctx = await getDbContext()
  const channels = (await localRows(ctx, "chat_channels")) as ChatChannelRecord[]
  const record: ChatMessageRecord = {
    id: id("message"),
    organization_id: ctx.orgId,
    channel_id: formText(formData, "channel_id", channels[0]?.id),
    author: "Moi",
    content: formText(formData, "content"),
    sent_at: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    is_me: true,
    created_at: nowIso(),
  }

  if (!record.content) return

  if (!(await insertSupabaseRow(ctx, "chat_messages", record))) {
    await mutateStore(ctx, (store) => store.chat_messages.push(record))
  }
}

export async function getTicketsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<TicketRecord>(ctx, "tickets"))
    ?? (await localRows(ctx, "tickets"))
}

export async function createTicketData(formData: FormData) {
  const ctx = await getDbContext()
  const record: TicketRecord = {
    id: id("ticket"),
    organization_id: ctx.orgId,
    ticket_number: quoteNumber("T"),
    subject: formText(formData, "subject", "Nouveau ticket"),
    requester: formText(formData, "requester", ctx.email),
    priority: formText(formData, "priority", "medium"),
    status: "open",
    category: formText(formData, "category", "General"),
    created_label: "maintenant",
    created_at: nowIso(),
  }

  if (!(await insertSupabaseRow(ctx, "tickets", record))) {
    await mutateStore(ctx, (store) => store.tickets.unshift(record))
  }
  await logAudit(ctx, "Creation ticket", record.ticket_number, record.priority === "high" ? "high" : "low")
}

export async function getAssetsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<AssetRecord>(ctx, "assets"))
    ?? (await localRows(ctx, "assets"))
}

export async function getIntegrationsData() {
  const ctx = await getDbContext()
  const overrides = await readIntegrationOverrides()
  const dbRows = await selectSupabaseRows<IntegrationRecord>(ctx, "integrations", "created_at", true)
  return mergeIntegrationCatalog(dbRows, overrides, ctx)
}

export async function toggleIntegrationData(formData: FormData) {
  const ctx = await getDbContext()
  const integrationId = formText(formData, "integration_id")
  const integrations = await getIntegrationsData()
  const integration = integrations.find((item) => item.id === integrationId)
  if (!integration) return

  const status = integration.status === "connected" ? "available" : "connected"
  const updated = await updateSupabaseRow(ctx, "integrations", integrationId, { status })

  if (!updated) {
    const overrides = await readIntegrationOverrides()
    overrides[integrationId] = status
    await writeIntegrationOverrides(overrides)
  } else {
    const overrides = await readIntegrationOverrides()
    delete overrides[integrationId]
    await writeIntegrationOverrides(overrides)
  }

  await logAudit(ctx, status === "connected" ? "Integration connectee" : "Integration desactivee", integration.name)
}

export async function getOrganizationData() {
  const ctx = await getDbContext()

  if (ctx.isSupabaseWorkspaceReady) {
    const { data: org } = await ctx.supabase
      .from("organizations")
      .select("*")
      .eq("id", ctx.orgId)
      .maybeSingle()
    const { data: members } = await ctx.supabase
      .from("profiles")
      .select("*")
      .eq("organization_id", ctx.orgId)
      .order("created_at", { ascending: true })

    if (org) return { ...(org as OrganizationRecord), members: (members ?? []) as ProfileRecord[] }
  }

  if (!shouldUseLocalSeedData()) {
    return {
      id: ctx.orgId,
      name: ctx.orgName,
      domain: ctx.email.includes("@") ? ctx.email.split("@")[1] : null,
      settings: {},
      created_at: nowIso(),
      members: [],
    }
  }

  const store = await readWorkspaceStore(ctx)
  const org = store.organizations.find((item) => item.id === ctx.orgId)
  return {
    ...(org ?? seedWorkspace(ctx.orgId, ctx.userId, ctx.email, ctx.orgName).organizations[0]),
    members: store.profiles.filter((profile) => profile.organization_id === ctx.orgId),
  }
}

export async function getProfileData() {
  const ctx = await getDbContext()
  const profiles = await localRows(ctx, "profiles")
  if (ctx.isSupabaseWorkspaceReady) {
    const { data: profile } = await ctx.supabase.from("profiles").select("*").eq("id", ctx.userId).maybeSingle()
    if (profile) return profile as ProfileRecord
  }
  return profiles.find((profile) => profile.id === ctx.userId) ?? profiles[0] ?? null
}

export async function updateProfileData(formData: FormData) {
  const ctx = await getDbContext()
  const patch = {
    first_name: formText(formData, "first_name"),
    last_name: formText(formData, "last_name"),
    email: formText(formData, "email", ctx.email),
  }

  const updated = ctx.isSupabaseWorkspaceReady
    ? !(await ctx.supabase.from("profiles").update(patch).eq("id", ctx.userId)).error
    : false

  if (!updated) {
    await mutateStore(ctx, (store) => {
      const profile = store.profiles.find((row) => row.id === ctx.userId)
      if (profile) Object.assign(profile, patch)
    })
  }
  await logAudit(ctx, "Mise a jour profil", patch.email)
}

export async function updateOrganizationData(formData: FormData) {
  const ctx = await getDbContext()
  const settings = {
    slogan: formText(formData, "slogan"),
    category: formText(formData, "category", "service"),
    address: formText(formData, "address"),
    city_country: formText(formData, "city_country"),
    website: formText(formData, "website"),
    phone: formText(formData, "phone"),
  }
  const patch = {
    name: formText(formData, "name", ctx.orgName),
    domain: formText(formData, "domain"),
    settings,
  }

  const updated = await updateSupabaseRow(ctx, "organizations", ctx.orgId, patch)
  if (!updated) {
    await mutateStore(ctx, (store) => {
      const organization = store.organizations.find((row) => row.id === ctx.orgId)
      if (organization) Object.assign(organization, patch)
    })
  }
  await logAudit(ctx, "Mise a jour organisation", patch.name)
}

export async function getSettingsData() {
  const ctx = await getDbContext()
  const rows = (await selectSupabaseRows<AppSettingsRecord>(ctx, "settings"))
    ?? (await localRows(ctx, "settings"))
  return rows[0]
}

export async function updateSettingsData(formData: FormData) {
  const ctx = await getDbContext()
  const settings = await getSettingsData()
  if (!settings) return

  const patch: Partial<AppSettingsRecord> = {
    language: formText(formData, "language", settings.language),
    dark_mode: formData.get("dark_mode") === "on",
    auto_translate: formData.get("auto_translate") === "on",
    ai_provider: formText(formData, "ai_provider", settings.ai_provider),
    ai_email_analysis: formData.get("ai_email_analysis") === "on",
    notifications: {
      crm_email: formData.get("crm_email") === "on",
      finance_email: formData.get("finance_email") === "on",
      security_email: formData.get("security_email") === "on",
      tasks_email: formData.get("tasks_email") === "on",
      crm_push: formData.get("crm_push") === "on",
      finance_push: formData.get("finance_push") === "on",
      security_push: formData.get("security_push") === "on",
      tasks_push: formData.get("tasks_push") === "on",
    },
  }

  if (!(await updateSupabaseRow(ctx, "settings", settings.id, patch as SupabaseRow))) {
    await mutateStore(ctx, (store) => {
      const row = store.settings.find((item) => item.id === settings.id)
      if (row) Object.assign(row, patch)
    })
  }
  await logAudit(ctx, "Mise a jour parametres", "Preferences")
}

export async function getAuditLogsData() {
  const ctx = await getDbContext()
  return (await selectSupabaseRows<AuditLogRecord>(ctx, "audit_logs"))
    ?? (await localRows(ctx, "audit_logs"))
}
