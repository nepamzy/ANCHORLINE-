import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { d1Query, hasD1Credentials } from "./db";

/**
 * Storage for the customer portal: real people (Anchorline's clients)
 * signing up, booking projects, and placing requests — distinct from
 * the single site-owner "client" row in auth.ts/db.ts, which is
 * Anchorline's own CMS login. Same D1-or-local-JSON duality as db.ts,
 * but relational (customers/projects/requests) instead of one row per
 * CMS section, so it gets its own small store and schema instead of
 * reusing content_sections.
 */

export type Customer = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  customer_id: string;
  name: string;
  tier: string | null;
  status: string;
  created_at: string;
};

export type PortalRequest = {
  id: string;
  customer_id: string;
  project_id: string | null;
  type: "new_project" | "service_request";
  message: string;
  status: "Pending" | "In Progress" | "Completed";
  created_at: string;
  updated_at: string;
};

export type RequestWithContext = PortalRequest & {
  customer_name: string;
  customer_email: string;
  project_name: string | null;
};

export type SiteVisitReport = {
  id: string;
  project_id: string;
  visit_date: string;
  summary: string;
  status: "On Track" | "Minor Delay" | "Attention Required";
  created_at: string;
};

export type ReportWithProject = SiteVisitReport & { project_name: string };

export type ProjectDocument = {
  id: string;
  project_id: string;
  title: string;
  file_url: string;
  uploaded_at: string;
};

export type DocumentWithProject = ProjectDocument & { project_name: string };

export type Message = {
  id: string;
  customer_id: string;
  sender: "customer" | "admin";
  body: string;
  created_at: string;
};

export type Invoice = {
  id: string;
  project_id: string;
  description: string;
  amount: number;
  currency: "NGN" | "USD";
  status: "Unpaid" | "Paid";
  created_at: string;
  paid_at: string | null;
  provider: "paystack" | "stripe" | null;
  provider_reference: string | null;
};

export type InvoiceWithProject = Invoice & { project_name: string };

export type PushSubscription = {
  id: string;
  customer_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
};

let schemaEnsured = false;

export async function ensurePortalSchema(): Promise<void> {
  if (!hasD1Credentials() || schemaEnsured) return;
  schemaEnsured = true;

  await d1Query(`CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    created_at TEXT NOT NULL
  )`);

  await d1Query(`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    name TEXT NOT NULL,
    tier TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TEXT NOT NULL
  )`);

  await d1Query(`CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    project_id TEXT,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);

  await d1Query(`CREATE TABLE IF NOT EXISTS site_visit_reports (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    visit_date TEXT NOT NULL,
    summary TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'On Track',
    created_at TEXT NOT NULL
  )`);

  await d1Query(`CREATE TABLE IF NOT EXISTS project_documents (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TEXT NOT NULL
  )`);

  await d1Query(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  await d1Query(`CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'Unpaid',
    created_at TEXT NOT NULL,
    paid_at TEXT
  )`);

  // Added after the invoices table first shipped — CREATE TABLE IF NOT
  // EXISTS above is a no-op against an existing table, so these two
  // columns need their own migration. ALTER TABLE ADD COLUMN isn't
  // idempotent in SQLite/D1 (errors on a column that already exists),
  // so swallow exactly that error rather than guard with a pragma
  // query on every cold start.
  await addColumnIfMissing("invoices", "provider", "TEXT");
  await addColumnIfMissing("invoices", "provider_reference", "TEXT");

  await d1Query(`CREATE TABLE IF NOT EXISTS push_subscriptions (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);
}

async function addColumnIfMissing(table: string, column: string, type: string): Promise<void> {
  try {
    await d1Query(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("duplicate column name")) throw err;
  }
}

// --- Dev-only local JSON file store -------------------------------------

type LocalStore = {
  customers: Customer[];
  projects: Project[];
  requests: PortalRequest[];
  reports: SiteVisitReport[];
  documents: ProjectDocument[];
  messages: Message[];
  invoices: Invoice[];
  pushSubscriptions: PushSubscription[];
};

const LOCAL_FILE = path.join(process.cwd(), "data", "portal.json");

function readLocal(): LocalStore {
  try {
    const raw = fs.readFileSync(LOCAL_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    return {
      customers: parsed.customers ?? [],
      projects: parsed.projects ?? [],
      requests: parsed.requests ?? [],
      reports: parsed.reports ?? [],
      documents: parsed.documents ?? [],
      messages: parsed.messages ?? [],
      invoices: parsed.invoices ?? [],
      pushSubscriptions: parsed.pushSubscriptions ?? [],
    };
  } catch {
    return {
      customers: [],
      projects: [],
      requests: [],
      reports: [],
      documents: [],
      messages: [],
      invoices: [],
      pushSubscriptions: [],
    };
  }
}

function writeLocal(store: LocalStore): void {
  try {
    fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Same reasoning as db.ts's writeLocalStore: this path only runs
    // without D1 credentials configured, never in production.
  }
}

function newId(): string {
  return crypto.randomUUID();
}

// --- Customers -----------------------------------------------------------

export async function createCustomer(input: {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
}): Promise<Customer> {
  const email = input.email.trim().toLowerCase();
  const existing = await getCustomerByEmail(email);
  if (existing) throw new Error("An account with this email already exists.");

  const customer: Customer = {
    id: newId(),
    name: input.name.trim(),
    email,
    password_hash: input.passwordHash,
    phone: input.phone?.trim() || null,
    created_at: new Date().toISOString(),
  };

  if (!hasD1Credentials()) {
    const store = readLocal();
    store.customers.push(customer);
    writeLocal(store);
    return customer;
  }

  await d1Query(
    `INSERT INTO customers (id, name, email, password_hash, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [customer.id, customer.name, customer.email, customer.password_hash, customer.phone, customer.created_at]
  );
  return customer;
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const normalized = email.trim().toLowerCase();
  if (!hasD1Credentials()) {
    return readLocal().customers.find((c) => c.email === normalized) ?? null;
  }
  const rows = await d1Query<Customer>("SELECT * FROM customers WHERE email = ?", [normalized]);
  return rows[0] ?? null;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!hasD1Credentials()) {
    return readLocal().customers.find((c) => c.id === id) ?? null;
  }
  const rows = await d1Query<Customer>("SELECT * FROM customers WHERE id = ?", [id]);
  return rows[0] ?? null;
}

export async function listCustomers(): Promise<Customer[]> {
  if (!hasD1Credentials()) {
    return [...readLocal().customers].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return d1Query<Customer>("SELECT * FROM customers ORDER BY created_at DESC");
}

export async function updateCustomerProfile(
  id: string,
  input: { name: string; phone?: string | null }
): Promise<void> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    const customer = store.customers.find((c) => c.id === id);
    if (customer) {
      customer.name = input.name.trim();
      customer.phone = input.phone?.trim() || null;
      writeLocal(store);
    }
    return;
  }
  await d1Query("UPDATE customers SET name = ?, phone = ? WHERE id = ?", [
    input.name.trim(),
    input.phone?.trim() || null,
    id,
  ]);
}

export async function updateCustomerPassword(id: string, passwordHash: string): Promise<void> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    const customer = store.customers.find((c) => c.id === id);
    if (customer) {
      customer.password_hash = passwordHash;
      writeLocal(store);
    }
    return;
  }
  await d1Query("UPDATE customers SET password_hash = ? WHERE id = ?", [passwordHash, id]);
}

// --- Projects --------------------------------------------------------------

export async function createProject(input: {
  customerId: string;
  name: string;
  tier?: string | null;
}): Promise<Project> {
  const project: Project = {
    id: newId(),
    customer_id: input.customerId,
    name: input.name.trim(),
    tier: input.tier?.trim() || null,
    status: "Active",
    created_at: new Date().toISOString(),
  };

  if (!hasD1Credentials()) {
    const store = readLocal();
    store.projects.push(project);
    writeLocal(store);
    return project;
  }

  await d1Query(
    `INSERT INTO projects (id, customer_id, name, tier, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [project.id, project.customer_id, project.name, project.tier, project.status, project.created_at]
  );
  return project;
}

export type ProjectWithCustomer = Project & { customer_name: string; customer_email: string };

export async function listAllProjects(): Promise<ProjectWithCustomer[]> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    return store.projects
      .map((p) => {
        const customer = store.customers.find((c) => c.id === p.customer_id);
        return { ...p, customer_name: customer?.name ?? "Unknown", customer_email: customer?.email ?? "" };
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return d1Query<ProjectWithCustomer>(
    `SELECT p.*, c.name AS customer_name, c.email AS customer_email
     FROM projects p JOIN customers c ON c.id = p.customer_id
     ORDER BY p.created_at DESC`
  );
}

export async function listProjectsForCustomer(customerId: string): Promise<Project[]> {
  if (!hasD1Credentials()) {
    return readLocal()
      .projects.filter((p) => p.customer_id === customerId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return d1Query<Project>("SELECT * FROM projects WHERE customer_id = ? ORDER BY created_at DESC", [customerId]);
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!hasD1Credentials()) {
    return readLocal().projects.find((p) => p.id === id) ?? null;
  }
  const rows = await d1Query<Project>("SELECT * FROM projects WHERE id = ?", [id]);
  return rows[0] ?? null;
}

// --- Requests ----------------------------------------------------------

export async function createRequest(input: {
  customerId: string;
  projectId?: string | null;
  type: PortalRequest["type"];
  message: string;
}): Promise<PortalRequest> {
  const now = new Date().toISOString();
  const request: PortalRequest = {
    id: newId(),
    customer_id: input.customerId,
    project_id: input.projectId || null,
    type: input.type,
    message: input.message.trim(),
    status: "Pending",
    created_at: now,
    updated_at: now,
  };

  if (!hasD1Credentials()) {
    const store = readLocal();
    store.requests.push(request);
    writeLocal(store);
    return request;
  }

  await d1Query(
    `INSERT INTO requests (id, customer_id, project_id, type, message, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      request.id,
      request.customer_id,
      request.project_id,
      request.type,
      request.message,
      request.status,
      request.created_at,
      request.updated_at,
    ]
  );
  return request;
}

export async function listRequestsForCustomer(customerId: string): Promise<PortalRequest[]> {
  if (!hasD1Credentials()) {
    return readLocal()
      .requests.filter((r) => r.customer_id === customerId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return d1Query<PortalRequest>("SELECT * FROM requests WHERE customer_id = ? ORDER BY created_at DESC", [
    customerId,
  ]);
}

export async function listAllRequests(): Promise<RequestWithContext[]> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    return store.requests
      .map((r) => {
        const customer = store.customers.find((c) => c.id === r.customer_id);
        const project = r.project_id ? store.projects.find((p) => p.id === r.project_id) : null;
        return {
          ...r,
          customer_name: customer?.name ?? "Unknown",
          customer_email: customer?.email ?? "",
          project_name: project?.name ?? null,
        };
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return d1Query<RequestWithContext>(
    `SELECT r.*, c.name AS customer_name, c.email AS customer_email, p.name AS project_name
     FROM requests r
     JOIN customers c ON c.id = r.customer_id
     LEFT JOIN projects p ON p.id = r.project_id
     ORDER BY r.created_at DESC`
  );
}

export async function updateRequestStatus(id: string, status: PortalRequest["status"]): Promise<void> {
  const now = new Date().toISOString();
  if (!hasD1Credentials()) {
    const store = readLocal();
    const request = store.requests.find((r) => r.id === id);
    if (request) {
      request.status = status;
      request.updated_at = now;
      writeLocal(store);
    }
    return;
  }
  await d1Query("UPDATE requests SET status = ?, updated_at = ? WHERE id = ?", [status, now, id]);
}

export async function linkRequestToNewProject(
  requestId: string,
  input: { customerId: string; name: string; tier?: string | null }
): Promise<Project> {
  const project = await createProject(input);
  if (!hasD1Credentials()) {
    const store = readLocal();
    const request = store.requests.find((r) => r.id === requestId);
    if (request) {
      request.project_id = project.id;
      request.status = "In Progress";
      request.updated_at = new Date().toISOString();
      writeLocal(store);
    }
    return project;
  }
  await d1Query("UPDATE requests SET project_id = ?, status = 'In Progress', updated_at = ? WHERE id = ?", [
    project.id,
    new Date().toISOString(),
    requestId,
  ]);
  return project;
}

// --- Site visit reports --------------------------------------------------

export async function createSiteVisitReport(input: {
  projectId: string;
  visitDate: string;
  summary: string;
  status: SiteVisitReport["status"];
}): Promise<SiteVisitReport> {
  const report: SiteVisitReport = {
    id: newId(),
    project_id: input.projectId,
    visit_date: input.visitDate,
    summary: input.summary.trim(),
    status: input.status,
    created_at: new Date().toISOString(),
  };

  if (!hasD1Credentials()) {
    const store = readLocal();
    store.reports.push(report);
    writeLocal(store);
    return report;
  }

  await d1Query(
    `INSERT INTO site_visit_reports (id, project_id, visit_date, summary, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [report.id, report.project_id, report.visit_date, report.summary, report.status, report.created_at]
  );
  return report;
}

export async function listReportsForProject(projectId: string): Promise<SiteVisitReport[]> {
  if (!hasD1Credentials()) {
    return readLocal()
      .reports.filter((r) => r.project_id === projectId)
      .sort((a, b) => b.visit_date.localeCompare(a.visit_date));
  }
  return d1Query<SiteVisitReport>(
    "SELECT * FROM site_visit_reports WHERE project_id = ? ORDER BY visit_date DESC",
    [projectId]
  );
}

export async function listReportsForCustomer(customerId: string): Promise<ReportWithProject[]> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    const projectIds = new Set(store.projects.filter((p) => p.customer_id === customerId).map((p) => p.id));
    return store.reports
      .filter((r) => projectIds.has(r.project_id))
      .map((r) => ({ ...r, project_name: store.projects.find((p) => p.id === r.project_id)?.name ?? "" }))
      .sort((a, b) => b.visit_date.localeCompare(a.visit_date));
  }
  return d1Query<ReportWithProject>(
    `SELECT r.*, p.name AS project_name FROM site_visit_reports r
     JOIN projects p ON p.id = r.project_id
     WHERE p.customer_id = ? ORDER BY r.visit_date DESC`,
    [customerId]
  );
}

// --- Project documents -----------------------------------------------------

export async function createDocument(input: {
  projectId: string;
  title: string;
  fileUrl: string;
}): Promise<ProjectDocument> {
  const document: ProjectDocument = {
    id: newId(),
    project_id: input.projectId,
    title: input.title.trim(),
    file_url: input.fileUrl,
    uploaded_at: new Date().toISOString(),
  };

  if (!hasD1Credentials()) {
    const store = readLocal();
    store.documents.push(document);
    writeLocal(store);
    return document;
  }

  await d1Query(`INSERT INTO project_documents (id, project_id, title, file_url, uploaded_at) VALUES (?, ?, ?, ?, ?)`, [
    document.id,
    document.project_id,
    document.title,
    document.file_url,
    document.uploaded_at,
  ]);
  return document;
}

export async function listDocumentsForProject(projectId: string): Promise<ProjectDocument[]> {
  if (!hasD1Credentials()) {
    return readLocal()
      .documents.filter((d) => d.project_id === projectId)
      .sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
  }
  return d1Query<ProjectDocument>("SELECT * FROM project_documents WHERE project_id = ? ORDER BY uploaded_at DESC", [
    projectId,
  ]);
}

export async function listDocumentsForCustomer(customerId: string): Promise<DocumentWithProject[]> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    const projectIds = new Set(store.projects.filter((p) => p.customer_id === customerId).map((p) => p.id));
    return store.documents
      .filter((d) => projectIds.has(d.project_id))
      .map((d) => ({ ...d, project_name: store.projects.find((p) => p.id === d.project_id)?.name ?? "" }))
      .sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
  }
  return d1Query<DocumentWithProject>(
    `SELECT d.*, p.name AS project_name FROM project_documents d
     JOIN projects p ON p.id = d.project_id
     WHERE p.customer_id = ? ORDER BY d.uploaded_at DESC`,
    [customerId]
  );
}

// --- Messages ------------------------------------------------------------

export async function createMessage(input: {
  customerId: string;
  sender: Message["sender"];
  body: string;
}): Promise<Message> {
  const message: Message = {
    id: newId(),
    customer_id: input.customerId,
    sender: input.sender,
    body: input.body.trim(),
    created_at: new Date().toISOString(),
  };

  if (!hasD1Credentials()) {
    const store = readLocal();
    store.messages.push(message);
    writeLocal(store);
    return message;
  }

  await d1Query(`INSERT INTO messages (id, customer_id, sender, body, created_at) VALUES (?, ?, ?, ?, ?)`, [
    message.id,
    message.customer_id,
    message.sender,
    message.body,
    message.created_at,
  ]);
  return message;
}

export async function listMessagesForCustomer(customerId: string): Promise<Message[]> {
  if (!hasD1Credentials()) {
    return readLocal()
      .messages.filter((m) => m.customer_id === customerId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }
  return d1Query<Message>("SELECT * FROM messages WHERE customer_id = ? ORDER BY created_at ASC", [customerId]);
}

export type CustomerWithLastMessage = Customer & { last_message_at: string | null; message_count: number };

export async function listCustomersWithMessageSummary(): Promise<CustomerWithLastMessage[]> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    return store.customers
      .map((c) => {
        const own = store.messages.filter((m) => m.customer_id === c.id);
        return {
          ...c,
          message_count: own.length,
          last_message_at: own.length ? own[own.length - 1].created_at : null,
        };
      })
      .sort((a, b) => (b.last_message_at ?? "").localeCompare(a.last_message_at ?? ""));
  }
  return d1Query<CustomerWithLastMessage>(
    `SELECT c.*, COUNT(m.id) AS message_count, MAX(m.created_at) AS last_message_at
     FROM customers c LEFT JOIN messages m ON m.customer_id = c.id
     GROUP BY c.id
     ORDER BY last_message_at DESC`
  );
}

// --- Invoices --------------------------------------------------------------

export async function createInvoice(input: {
  projectId: string;
  description: string;
  amount: number;
  currency: Invoice["currency"];
}): Promise<Invoice> {
  const invoice: Invoice = {
    id: newId(),
    project_id: input.projectId,
    description: input.description.trim(),
    amount: input.amount,
    currency: input.currency,
    status: "Unpaid",
    created_at: new Date().toISOString(),
    paid_at: null,
    provider: null,
    provider_reference: null,
  };

  if (!hasD1Credentials()) {
    const store = readLocal();
    store.invoices.push(invoice);
    writeLocal(store);
    return invoice;
  }

  await d1Query(
    `INSERT INTO invoices (id, project_id, description, amount, currency, status, created_at, paid_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
    [invoice.id, invoice.project_id, invoice.description, invoice.amount, invoice.currency, invoice.status, invoice.created_at]
  );
  return invoice;
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  if (!hasD1Credentials()) {
    return readLocal().invoices.find((i) => i.id === id) ?? null;
  }
  const rows = await d1Query<Invoice>("SELECT * FROM invoices WHERE id = ?", [id]);
  return rows[0] ?? null;
}

export async function listInvoicesForProject(projectId: string): Promise<Invoice[]> {
  if (!hasD1Credentials()) {
    return readLocal()
      .invoices.filter((i) => i.project_id === projectId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return d1Query<Invoice>("SELECT * FROM invoices WHERE project_id = ? ORDER BY created_at DESC", [projectId]);
}

export async function listInvoicesForCustomer(customerId: string): Promise<InvoiceWithProject[]> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    const projectIds = new Set(store.projects.filter((p) => p.customer_id === customerId).map((p) => p.id));
    return store.invoices
      .filter((i) => projectIds.has(i.project_id))
      .map((i) => ({ ...i, project_name: store.projects.find((p) => p.id === i.project_id)?.name ?? "" }))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  return d1Query<InvoiceWithProject>(
    `SELECT i.*, p.name AS project_name FROM invoices i
     JOIN projects p ON p.id = i.project_id
     WHERE p.customer_id = ? ORDER BY i.created_at DESC`,
    [customerId]
  );
}

export async function setInvoiceStatus(id: string, status: Invoice["status"]): Promise<void> {
  const paidAt = status === "Paid" ? new Date().toISOString() : null;
  if (!hasD1Credentials()) {
    const store = readLocal();
    const invoice = store.invoices.find((i) => i.id === id);
    if (invoice) {
      invoice.status = status;
      invoice.paid_at = paidAt;
      writeLocal(store);
    }
    return;
  }
  await d1Query("UPDATE invoices SET status = ?, paid_at = ? WHERE id = ?", [status, paidAt, id]);
}

/** Marks an invoice paid via a real payment processor (as opposed to the admin's manual toggle), recording which one and its transaction reference. Idempotent — safe to call more than once for the same payment (e.g. both the redirect callback and a later webhook). */
export async function markInvoicePaidByProvider(
  id: string,
  provider: NonNullable<Invoice["provider"]>,
  reference: string
): Promise<void> {
  const paidAt = new Date().toISOString();
  if (!hasD1Credentials()) {
    const store = readLocal();
    const invoice = store.invoices.find((i) => i.id === id);
    if (invoice && invoice.status !== "Paid") {
      invoice.status = "Paid";
      invoice.paid_at = paidAt;
      invoice.provider = provider;
      invoice.provider_reference = reference;
      writeLocal(store);
    }
    return;
  }
  await d1Query(
    `UPDATE invoices SET status = 'Paid', paid_at = ?, provider = ?, provider_reference = ?
     WHERE id = ? AND status != 'Paid'`,
    [paidAt, provider, reference, id]
  );
}

// --- Push subscriptions ---------------------------------------------------

/** Upserts by endpoint — re-subscribing (e.g. after clearing site data) replaces the stored keys for that endpoint instead of creating a duplicate row. */
export async function savePushSubscription(input: {
  customerId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}): Promise<void> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    const existing = store.pushSubscriptions.find((s) => s.endpoint === input.endpoint);
    if (existing) {
      existing.customer_id = input.customerId;
      existing.p256dh = input.p256dh;
      existing.auth = input.auth;
    } else {
      store.pushSubscriptions.push({
        id: newId(),
        customer_id: input.customerId,
        endpoint: input.endpoint,
        p256dh: input.p256dh,
        auth: input.auth,
        created_at: new Date().toISOString(),
      });
    }
    writeLocal(store);
    return;
  }
  await d1Query(
    `INSERT INTO push_subscriptions (id, customer_id, endpoint, p256dh, auth, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(endpoint) DO UPDATE SET customer_id = excluded.customer_id, p256dh = excluded.p256dh, auth = excluded.auth`,
    [newId(), input.customerId, input.endpoint, input.p256dh, input.auth, new Date().toISOString()]
  );
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  if (!hasD1Credentials()) {
    const store = readLocal();
    store.pushSubscriptions = store.pushSubscriptions.filter((s) => s.endpoint !== endpoint);
    writeLocal(store);
    return;
  }
  await d1Query("DELETE FROM push_subscriptions WHERE endpoint = ?", [endpoint]);
}

export async function listPushSubscriptionsForCustomer(customerId: string): Promise<PushSubscription[]> {
  if (!hasD1Credentials()) {
    return readLocal().pushSubscriptions.filter((s) => s.customer_id === customerId);
  }
  return d1Query<PushSubscription>("SELECT * FROM push_subscriptions WHERE customer_id = ?", [customerId]);
}
