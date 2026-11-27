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
}

// --- Dev-only local JSON file store -------------------------------------

type LocalStore = { customers: Customer[]; projects: Project[]; requests: PortalRequest[] };

const LOCAL_FILE = path.join(process.cwd(), "data", "portal.json");

function readLocal(): LocalStore {
  try {
    const raw = fs.readFileSync(LOCAL_FILE, "utf-8");
    return JSON.parse(raw) as LocalStore;
  } catch {
    return { customers: [], projects: [], requests: [] };
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
