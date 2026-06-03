-- Schema complet GNIX ERP pour Supabase.
-- A executer dans Supabase SQL Editor apres avoir active l'authentification.
-- Le projet utilise auth.users.id et organizations.id en uuid.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null default 'Utilisateur',
  last_name text not null default '',
  email text not null,
  avatar_url text,
  role text not null default 'Utilisateur',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  type text not null default 'B2B',
  source text not null default 'Manuel',
  status text not null default 'lead',
  ai_conversion_score integer not null default 0,
  estimated_value numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id text not null,
  quote_number text not null,
  total_amount numeric not null default 0,
  status text not null default 'draft',
  valid_until date not null default current_date,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id text not null,
  invoice_number text not null,
  total_amount numeric not null default 0,
  tax_amount numeric not null default 0,
  status text not null default 'pending',
  due_date date not null default current_date,
  ai_anomaly_flag boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id text not null,
  amount numeric not null default 0,
  payment_date date not null default current_date,
  payment_method text not null default 'bank',
  created_at timestamptz not null default now()
);

create table if not exists public.salary_payments (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id text not null,
  amount numeric not null default 0,
  pay_period text not null default '',
  payment_date date not null default current_date,
  payment_method text not null default 'bank',
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create table if not exists public.accounting_entries (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entry_number text not null,
  label text not null,
  account_code text not null,
  debit numeric not null default 0,
  credit numeric not null default 0,
  entry_date date not null default current_date,
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  sku text not null,
  name text not null,
  price numeric not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_orders (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  order_number text not null,
  supplier text not null,
  status text not null default 'draft',
  total_amount numeric not null default 0,
  expected_date date not null default current_date,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.warehouses (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  location text not null default '',
  capacity integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id text not null,
  warehouse_id text not null,
  quantity integer not null default 0,
  location text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.stock_entries (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id text not null,
  warehouse_id text not null,
  quantity integer not null default 0,
  type text not null default 'in',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_notes (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id text not null,
  delivery_number text not null,
  delivery_date date not null default current_date,
  notes text not null default '',
  items jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tracking_number text not null,
  carrier text not null,
  status text not null default 'pending',
  origin text not null default '',
  destination text not null default '',
  eta date not null default current_date,
  confidence integer not null default 0,
  package_photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.employees (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null,
  last_name text not null default '',
  email text not null default '',
  position text not null default '',
  department text not null default '',
  contract_type text not null default 'CDI',
  salary numeric not null default 0,
  hire_date date not null default current_date,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id text not null,
  employee_name text not null,
  time text not null,
  method text not null,
  status text not null default 'ontime',
  location text not null default '',
  attendance_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.leaves (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id text not null,
  employee_name text not null,
  start_date date not null,
  end_date date not null,
  type text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.evaluations (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id text not null,
  employee_name text not null,
  period text not null,
  score integer not null default 0,
  status text not null default 'planned',
  objective text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id text not null,
  name text not null,
  status text not null default 'active',
  deadline date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id text not null,
  name text not null,
  status text not null default 'todo',
  assignee text not null default '',
  ai_estimated_hours integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id text not null,
  title text not null,
  meeting_date date not null default current_date,
  attendees jsonb not null default '[]'::jsonb,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table if not exists public.communications (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  type text not null default 'email',
  client_name text not null,
  subject text not null,
  sentiment text not null default 'neutral',
  category text not null default 'General',
  summary text not null default '',
  channel_status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.calls (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  caller text not null,
  duration text not null default '00:00',
  transcript text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.chat_channels (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  channel_id text not null references public.chat_channels(id) on delete cascade,
  author text not null,
  content text not null,
  sent_at text not null,
  is_me boolean not null default false,
  attachment_url text,
  attachment_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_number text not null,
  subject text not null,
  requester text not null,
  priority text not null default 'medium',
  status text not null default 'open',
  category text not null default 'General',
  created_label text not null default 'maintenant',
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  serial_number text not null,
  model text not null,
  assigned_to text not null default '',
  status text not null default 'active',
  location text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.integrations (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default 'General',
  status text not null default 'available',
  icon text not null default 'Plug',
  color text not null default 'bg-slate-500',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_name text not null,
  action text not null,
  target text not null,
  ip_address text not null default '127.0.0.1',
  severity text not null default 'low',
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  language text not null default 'fr',
  dark_mode boolean not null default false,
  auto_translate boolean not null default true,
  ai_provider text not null default 'gemini',
  ai_api_key text,
  openai_api_key text,
  whatsapp_api_key text,
  whatsapp_phone_number_id text,
  whatsapp_business_account_id text,
  auto_response_enabled boolean not null default false,
  auto_response_prompt text,
  two_factor_enabled boolean not null default false,
  terminal_total integer not null default 15,
  terminal_active integer not null default 14,
  terminal_mode text not null default 'Biometrie + GPS',
  terminal_location text not null default 'Siege principal',
  last_ai_analysis_at timestamptz,
  ai_email_analysis boolean not null default true,
  notifications jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists profiles_organization_idx on public.profiles (organization_id);
create index if not exists chat_messages_channel_created_idx on public.chat_messages (channel_id, created_at);

create index if not exists clients_org_idx on public.clients (organization_id, created_at);
create index if not exists quotes_org_idx on public.quotes (organization_id, created_at);
create index if not exists invoices_org_idx on public.invoices (organization_id, created_at);
create index if not exists payments_org_idx on public.payments (organization_id, created_at);
create index if not exists salary_payments_org_idx on public.salary_payments (organization_id, created_at);
create index if not exists accounting_entries_org_idx on public.accounting_entries (organization_id, created_at);
create index if not exists products_org_idx on public.products (organization_id, created_at);
create index if not exists purchase_orders_org_idx on public.purchase_orders (organization_id, created_at);
create index if not exists warehouses_org_idx on public.warehouses (organization_id, name);
create index if not exists inventory_org_idx on public.inventory (organization_id, created_at);
create index if not exists stock_entries_org_idx on public.stock_entries (organization_id, created_at);
create index if not exists delivery_notes_org_idx on public.delivery_notes (organization_id, created_at);
create index if not exists shipments_org_idx on public.shipments (organization_id, created_at);
create index if not exists employees_org_idx on public.employees (organization_id, created_at);
create index if not exists attendance_org_idx on public.attendance (organization_id, created_at);
create index if not exists leaves_org_idx on public.leaves (organization_id, created_at);
create index if not exists evaluations_org_idx on public.evaluations (organization_id, created_at);
create index if not exists projects_org_idx on public.projects (organization_id, created_at);
create index if not exists tasks_org_idx on public.tasks (organization_id, created_at);
create index if not exists meetings_org_idx on public.meetings (organization_id, created_at);
create index if not exists communications_org_idx on public.communications (organization_id, created_at);
create index if not exists calls_org_idx on public.calls (organization_id, created_at);
create index if not exists chat_channels_org_idx on public.chat_channels (organization_id, created_at);
create index if not exists chat_messages_org_idx on public.chat_messages (organization_id, created_at);
create index if not exists tickets_org_idx on public.tickets (organization_id, created_at);
create index if not exists assets_org_idx on public.assets (organization_id, created_at);
create index if not exists integrations_org_idx on public.integrations (organization_id, created_at);
create index if not exists audit_logs_org_idx on public.audit_logs (organization_id, created_at);
create index if not exists settings_org_idx on public.settings (organization_id, created_at);

create or replace function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.profiles
  where id = auth.uid()
    and is_active = true
  limit 1
$$;

create or replace function public.current_user_is_org_admin(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and organization_id = target_organization_id
      and is_active = true
      and role in ('Administrateur', 'Admin')
  )
$$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.quotes enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.salary_payments enable row level security;
alter table public.accounting_entries enable row level security;
alter table public.products enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.warehouses enable row level security;
alter table public.inventory enable row level security;
alter table public.stock_entries enable row level security;
alter table public.delivery_notes enable row level security;
alter table public.shipments enable row level security;
alter table public.employees enable row level security;
alter table public.attendance enable row level security;
alter table public.leaves enable row level security;
alter table public.evaluations enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.meetings enable row level security;
alter table public.communications enable row level security;
alter table public.calls enable row level security;
alter table public.chat_channels enable row level security;
alter table public.chat_messages enable row level security;
alter table public.tickets enable row level security;
alter table public.assets enable row level security;
alter table public.integrations enable row level security;
alter table public.audit_logs enable row level security;
alter table public.settings enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'clients','quotes','invoices','payments','salary_payments','accounting_entries','products','purchase_orders','warehouses','inventory',
    'stock_entries','delivery_notes','shipments','employees','attendance','leaves','evaluations',
    'projects','tasks','meetings','communications','calls','chat_channels','chat_messages',
    'tickets','assets','integrations','audit_logs','settings'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_select_same_org', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (
        organization_id = public.current_organization_id()
      )',
      t || '_select_same_org',
      t
    );

    execute format('drop policy if exists %I on public.%I', t || '_insert_same_org', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (
        organization_id = public.current_organization_id()
      )',
      t || '_insert_same_org',
      t
    );

    execute format('drop policy if exists %I on public.%I', t || '_update_same_org', t);
    execute format(
      'create policy %I on public.%I for update to authenticated using (
        organization_id = public.current_organization_id()
      ) with check (
        organization_id = public.current_organization_id()
      )',
      t || '_update_same_org',
      t
    );
  end loop;
end $$;

drop policy if exists organizations_select_member on public.organizations;
create policy organizations_select_member
on public.organizations
for select
to authenticated
using (
  id = public.current_organization_id()
);

drop policy if exists organizations_insert_authenticated on public.organizations;
create policy organizations_insert_authenticated
on public.organizations
for insert
to authenticated
with check (true);

drop policy if exists organizations_update_admin on public.organizations;
create policy organizations_update_admin
on public.organizations
for update
to authenticated
using (
  public.current_user_is_org_admin(id)
);

drop policy if exists profiles_select_same_org on public.profiles;
create policy profiles_select_same_org
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or organization_id = public.current_organization_id()
);

drop policy if exists profiles_insert_authenticated on public.profiles;
create policy profiles_insert_authenticated
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  or public.current_user_is_org_admin(organization_id)
);

drop policy if exists profiles_update_same_org on public.profiles;
create policy profiles_update_same_org
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
  or public.current_user_is_org_admin(organization_id)
);

-- Audit final: si cette requete retourne 0 ligne, aucune table/colonne applicative ne manque.
with expected(table_name, column_name) as (
  values
    ('organizations','id'),('organizations','name'),('organizations','domain'),('organizations','settings'),('organizations','created_at'),
    ('profiles','id'),('profiles','organization_id'),('profiles','first_name'),('profiles','last_name'),('profiles','email'),('profiles','avatar_url'),('profiles','role'),('profiles','is_active'),('profiles','created_at'),
    ('clients','id'),('clients','organization_id'),('clients','name'),('clients','email'),('clients','phone'),('clients','type'),('clients','source'),('clients','status'),('clients','ai_conversion_score'),('clients','estimated_value'),('clients','created_at'),
    ('quotes','id'),('quotes','organization_id'),('quotes','client_id'),('quotes','quote_number'),('quotes','total_amount'),('quotes','status'),('quotes','valid_until'),('quotes','items'),('quotes','created_at'),
    ('invoices','id'),('invoices','organization_id'),('invoices','client_id'),('invoices','invoice_number'),('invoices','total_amount'),('invoices','tax_amount'),('invoices','status'),('invoices','due_date'),('invoices','ai_anomaly_flag'),('invoices','created_at'),
    ('payments','id'),('payments','organization_id'),('payments','invoice_id'),('payments','amount'),('payments','payment_date'),('payments','payment_method'),('payments','created_at'),
    ('salary_payments','id'),('salary_payments','organization_id'),('salary_payments','employee_id'),('salary_payments','amount'),('salary_payments','pay_period'),('salary_payments','payment_date'),('salary_payments','payment_method'),('salary_payments','status'),('salary_payments','created_at'),
    ('accounting_entries','id'),('accounting_entries','organization_id'),('accounting_entries','entry_number'),('accounting_entries','label'),('accounting_entries','account_code'),('accounting_entries','debit'),('accounting_entries','credit'),('accounting_entries','entry_date'),('accounting_entries','source'),('accounting_entries','created_at'),
    ('products','id'),('products','organization_id'),('products','sku'),('products','name'),('products','price'),('products','image_url'),('products','created_at'),
    ('purchase_orders','id'),('purchase_orders','organization_id'),('purchase_orders','order_number'),('purchase_orders','supplier'),('purchase_orders','status'),('purchase_orders','total_amount'),('purchase_orders','expected_date'),('purchase_orders','items'),('purchase_orders','created_at'),
    ('warehouses','id'),('warehouses','organization_id'),('warehouses','name'),('warehouses','location'),('warehouses','capacity'),('warehouses','created_at'),
    ('inventory','id'),('inventory','organization_id'),('inventory','product_id'),('inventory','warehouse_id'),('inventory','quantity'),('inventory','location'),('inventory','created_at'),
    ('stock_entries','id'),('stock_entries','organization_id'),('stock_entries','product_id'),('stock_entries','warehouse_id'),('stock_entries','quantity'),('stock_entries','type'),('stock_entries','notes'),('stock_entries','created_at'),
    ('delivery_notes','id'),('delivery_notes','organization_id'),('delivery_notes','client_id'),('delivery_notes','delivery_number'),('delivery_notes','delivery_date'),('delivery_notes','notes'),('delivery_notes','items'),('delivery_notes','status'),('delivery_notes','created_at'),
    ('shipments','id'),('shipments','organization_id'),('shipments','tracking_number'),('shipments','carrier'),('shipments','status'),('shipments','origin'),('shipments','destination'),('shipments','eta'),('shipments','confidence'),('shipments','package_photo_url'),('shipments','created_at'),
    ('employees','id'),('employees','organization_id'),('employees','first_name'),('employees','last_name'),('employees','email'),('employees','position'),('employees','department'),('employees','contract_type'),('employees','salary'),('employees','hire_date'),('employees','avatar_url'),('employees','created_at'),
    ('attendance','id'),('attendance','organization_id'),('attendance','employee_id'),('attendance','employee_name'),('attendance','time'),('attendance','method'),('attendance','status'),('attendance','location'),('attendance','attendance_date'),('attendance','created_at'),
    ('leaves','id'),('leaves','organization_id'),('leaves','employee_id'),('leaves','employee_name'),('leaves','start_date'),('leaves','end_date'),('leaves','type'),('leaves','status'),('leaves','created_at'),
    ('evaluations','id'),('evaluations','organization_id'),('evaluations','employee_id'),('evaluations','employee_name'),('evaluations','period'),('evaluations','score'),('evaluations','status'),('evaluations','objective'),('evaluations','created_at'),
    ('projects','id'),('projects','organization_id'),('projects','client_id'),('projects','name'),('projects','status'),('projects','deadline'),('projects','created_at'),
    ('tasks','id'),('tasks','organization_id'),('tasks','project_id'),('tasks','name'),('tasks','status'),('tasks','assignee'),('tasks','ai_estimated_hours'),('tasks','created_at'),
    ('meetings','id'),('meetings','organization_id'),('meetings','project_id'),('meetings','title'),('meetings','meeting_date'),('meetings','attendees'),('meetings','status'),('meetings','created_at'),
    ('communications','id'),('communications','organization_id'),('communications','type'),('communications','client_name'),('communications','subject'),('communications','sentiment'),('communications','category'),('communications','summary'),('communications','channel_status'),('communications','created_at'),
    ('calls','id'),('calls','organization_id'),('calls','caller'),('calls','duration'),('calls','transcript'),('calls','status'),('calls','created_at'),
    ('chat_channels','id'),('chat_channels','organization_id'),('chat_channels','name'),('chat_channels','created_at'),
    ('chat_messages','id'),('chat_messages','organization_id'),('chat_messages','channel_id'),('chat_messages','author'),('chat_messages','content'),('chat_messages','sent_at'),('chat_messages','is_me'),('chat_messages','attachment_url'),('chat_messages','attachment_name'),('chat_messages','created_at'),
    ('tickets','id'),('tickets','organization_id'),('tickets','ticket_number'),('tickets','subject'),('tickets','requester'),('tickets','priority'),('tickets','status'),('tickets','category'),('tickets','created_label'),('tickets','created_at'),
    ('assets','id'),('assets','organization_id'),('assets','serial_number'),('assets','model'),('assets','assigned_to'),('assets','status'),('assets','location'),('assets','created_at'),
    ('integrations','id'),('integrations','organization_id'),('integrations','name'),('integrations','description'),('integrations','category'),('integrations','status'),('integrations','icon'),('integrations','color'),('integrations','created_at'),
    ('audit_logs','id'),('audit_logs','organization_id'),('audit_logs','user_name'),('audit_logs','action'),('audit_logs','target'),('audit_logs','ip_address'),('audit_logs','severity'),('audit_logs','created_at'),
    ('settings','id'),('settings','organization_id'),('settings','language'),('settings','dark_mode'),('settings','auto_translate'),('settings','ai_provider'),('settings','ai_api_key'),('settings','openai_api_key'),('settings','whatsapp_api_key'),('settings','whatsapp_phone_number_id'),('settings','whatsapp_business_account_id'),('settings','auto_response_enabled'),('settings','auto_response_prompt'),('settings','two_factor_enabled'),('settings','terminal_total'),('settings','terminal_active'),('settings','terminal_mode'),('settings','terminal_location'),('settings','last_ai_analysis_at'),('settings','ai_email_analysis'),('settings','notifications'),('settings','created_at')
)
select expected.table_name, expected.column_name
from expected
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = expected.table_name
 and c.column_name = expected.column_name
where c.column_name is null
order by expected.table_name, expected.column_name;
