import postgres from "postgres";

// Eén gedeelde, serverless-vriendelijke connectie-pool.
// Werkt met zowel Neon als Vercel Postgres — beide geven een
// standaard Postgres-connectiestring terug in DATABASE_URL.
declare global {
  var __heynoonaSql: ReturnType<typeof postgres> | undefined;
}

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL ontbreekt. Zet deze in .env.local (lokaal) of in de Vercel project settings."
    );
  }

  if (!global.__heynoonaSql) {
    global.__heynoonaSql = postgres(process.env.DATABASE_URL, {
      max: 5,
      idle_timeout: 20,
      ssl: "require",
    });
  }

  return global.__heynoonaSql;
}

export type BookingStatus =
  | "nieuw"
  | "goedgekeurd"
  | "in_behandeling"
  | "afgerond"
  | "geannuleerd";

export interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  package: string;
  eventType: string;
  firstName: string;
  lastName: string;
  company: string | null;
  phone: string;
  email: string;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  message: string | null;
  termsAccepted: boolean;
  status: BookingStatus;
  adminNotes: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  date: string;
  startTime: string;
  endTime: string;
  package: string;
  eventType: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  email: string;
  address?: string;
  postalCode?: string;
  city?: string;
  message?: string;
  termsAccepted: boolean;
}

// snake_case rij -> camelCase Booking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Booking {
  return {
    id: row.id,
    date:
      row.date instanceof Date
        ? row.date.toISOString().slice(0, 10)
        : row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    package: row.package,
    eventType: row.event_type,
    firstName: row.first_name,
    lastName: row.last_name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    address: row.address,
    postalCode: row.postal_code,
    city: row.city,
    message: row.message,
    termsAccepted: row.terms_accepted,
    status: row.status,
    adminNotes: row.admin_notes,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------- Beschikbaarheid (publiek) ----------

export async function getBookedSlotsForMonth(
  year: number,
  month: number
): Promise<string[]> {
  const sql = getSql();
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;
  const { TIME_SLOTS } = await import("./packages");

  const bookingRows = await sql<{ date: string; start_time: string }[]>`
    SELECT date, start_time FROM bookings
    WHERE to_char(date, 'YYYY-MM') = ${prefix}
      AND status != 'geannuleerd'
  `;

  const blockedSlotRows = await sql<{ date: string; start_time: string }[]>`
    SELECT date, start_time FROM blocked_slots
    WHERE to_char(date, 'YYYY-MM') = ${prefix}
  `;

  const blockedDateRows = await sql<{ date: string }[]>`
    SELECT date FROM blocked_dates
    WHERE to_char(date, 'YYYY-MM') = ${prefix}
  `;

  const slots = new Set<string>();
  for (const r of bookingRows) {
    slots.add(`${toDateStr(r.date)}:${r.start_time}`);
  }
  for (const r of blockedSlotRows) {
    slots.add(`${toDateStr(r.date)}:${r.start_time}`);
  }
  // Volledig geblokkeerde dagen: alle tijdsloten toevoegen zodat de
  // front-end (die "vol" bepaalt op basis van het aantal bezette sloten)
  // de hele dag automatisch als vol/niet beschikbaar toont.
  for (const r of blockedDateRows) {
    const d = toDateStr(r.date);
    for (const slot of TIME_SLOTS) {
      slots.add(`${d}:${slot.start}`);
    }
  }

  return Array.from(slots);
}

function toDateStr(d: string | Date): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return d;
}

export async function getBookedSlotsForDate(date: string): Promise<string[]> {
  const sql = getSql();

  const isFullyBlocked = await sql<{ date: string }[]>`
    SELECT date FROM blocked_dates WHERE date = ${date}
  `;
  if (isFullyBlocked.length > 0) {
    // Alle sloten "bezet" teruggeven is de eenvoudigste manier om de hele
    // dag ontoegankelijk te maken zonder de front-end te hoeven aanpassen.
    const { TIME_SLOTS } = await import("./packages");
    return TIME_SLOTS.map((s) => s.start);
  }

  const bookingRows = await sql<{ start_time: string }[]>`
    SELECT start_time FROM bookings
    WHERE date = ${date} AND status != 'geannuleerd'
  `;
  const blockedRows = await sql<{ start_time: string }[]>`
    SELECT start_time FROM blocked_slots WHERE date = ${date}
  `;

  return [
    ...bookingRows.map((r) => r.start_time),
    ...blockedRows.map((r) => r.start_time),
  ];
}

export async function isSlotAvailable(
  date: string,
  startTime: string
): Promise<boolean> {
  const sql = getSql();

  const blockedDate = await sql`
    SELECT 1 FROM blocked_dates WHERE date = ${date}
  `;
  if (blockedDate.length > 0) return false;

  const blockedSlot = await sql`
    SELECT 1 FROM blocked_slots WHERE date = ${date} AND start_time = ${startTime}
  `;
  if (blockedSlot.length > 0) return false;

  const existing = await sql`
    SELECT 1 FROM bookings
    WHERE date = ${date} AND start_time = ${startTime} AND status != 'geannuleerd'
  `;
  return existing.length === 0;
}

// ---------- Boekingen aanmaken ----------

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const sql = getSql();

  try {
    const rows = await sql`
      INSERT INTO bookings (
        date, start_time, end_time, package, event_type,
        first_name, last_name, company, phone, email,
        address, postal_code, city, message, terms_accepted
      ) VALUES (
        ${input.date}, ${input.startTime}, ${input.endTime}, ${input.package}, ${input.eventType},
        ${input.firstName}, ${input.lastName}, ${input.company ?? null}, ${input.phone}, ${input.email},
        ${input.address ?? null}, ${input.postalCode ?? null}, ${input.city ?? null}, ${input.message ?? null}, ${input.termsAccepted}
      )
      RETURNING *
    `;
    return mapRow(rows[0]);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "23505" // unique_violation
    ) {
      throw new Error("SLOT_UNAVAILABLE");
    }
    throw error;
  }
}

// ---------- Dashboard: opvragen ----------

export interface BookingFilters {
  status?: BookingStatus;
  eventType?: string;
  package?: string;
  search?: string; // naam, telefoon of e-mail
  dateFrom?: string;
  dateTo?: string;
}

export async function getBookings(filters: BookingFilters = {}): Promise<Booking[]> {
  const sql = getSql();

  const conditions = [];
  if (filters.status) conditions.push(sql`status = ${filters.status}`);
  if (filters.eventType) conditions.push(sql`event_type = ${filters.eventType}`);
  if (filters.package) conditions.push(sql`package = ${filters.package}`);
  if (filters.dateFrom) conditions.push(sql`date >= ${filters.dateFrom}`);
  if (filters.dateTo) conditions.push(sql`date <= ${filters.dateTo}`);
  if (filters.search) {
    const term = `%${filters.search.toLowerCase()}%`;
    conditions.push(
      sql`(lower(first_name || ' ' || last_name) LIKE ${term} OR lower(phone) LIKE ${term} OR lower(email) LIKE ${term})`
    );
  }

  const whereClause = conditions.length
    ? conditions.reduce((acc, c) => sql`${acc} AND ${c}`)
    : sql`TRUE`;

  const rows = await sql`
    SELECT * FROM bookings WHERE ${whereClause} ORDER BY date DESC, start_time DESC
  `;
  return rows.map(mapRow);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM bookings WHERE id = ${id}`;
  return rows[0] ? mapRow(rows[0]) : null;
}

export interface UpdateBookingInput {
  status?: BookingStatus;
  adminNotes?: string;
  approvedBy?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

export async function updateBooking(
  id: string,
  patch: UpdateBookingInput
): Promise<Booking | null> {
  const sql = getSql();

  const setClauses = [];
  if (patch.status !== undefined) {
    setClauses.push(sql`status = ${patch.status}`);
    if (patch.status === "goedgekeurd") {
      setClauses.push(sql`approved_at = now()`);
      if (patch.approvedBy) setClauses.push(sql`approved_by = ${patch.approvedBy}`);
    }
  }
  if (patch.adminNotes !== undefined) setClauses.push(sql`admin_notes = ${patch.adminNotes}`);
  if (patch.date !== undefined) setClauses.push(sql`date = ${patch.date}`);
  if (patch.startTime !== undefined) setClauses.push(sql`start_time = ${patch.startTime}`);
  if (patch.endTime !== undefined) setClauses.push(sql`end_time = ${patch.endTime}`);

  if (setClauses.length === 0) return getBookingById(id);

  const setClause = setClauses.reduce((acc, c) => sql`${acc}, ${c}`);
  const rows = await sql`
    UPDATE bookings SET ${setClause} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM bookings WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// ---------- Dashboard: statistieken ----------

export interface DashboardStats {
  total: number;
  thisMonth: number;
  upcoming: number;
  popularPackage: string | null;
  popularEventType: string | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const sql = getSql();

  const [{ count: total }] = await sql<{ count: string }[]>`
    SELECT count(*) FROM bookings WHERE status != 'geannuleerd'
  `;
  const [{ count: thisMonth }] = await sql<{ count: string }[]>`
    SELECT count(*) FROM bookings
    WHERE status != 'geannuleerd' AND date_trunc('month', date) = date_trunc('month', now())
  `;
  const [{ count: upcoming }] = await sql<{ count: string }[]>`
    SELECT count(*) FROM bookings
    WHERE status NOT IN ('geannuleerd', 'afgerond') AND date >= current_date
  `;
  const popularPackageRows = await sql<{ package: string }[]>`
    SELECT package FROM bookings WHERE status != 'geannuleerd'
    GROUP BY package ORDER BY count(*) DESC LIMIT 1
  `;
  const popularEventTypeRows = await sql<{ event_type: string }[]>`
    SELECT event_type FROM bookings WHERE status != 'geannuleerd'
    GROUP BY event_type ORDER BY count(*) DESC LIMIT 1
  `;

  return {
    total: Number(total),
    thisMonth: Number(thisMonth),
    upcoming: Number(upcoming),
    popularPackage: popularPackageRows[0]?.package ?? null,
    popularEventType: popularEventTypeRows[0]?.event_type ?? null,
  };
}

// ---------- Blokkades ----------

export interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  reason: string | null;
  createdAt: string;
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM blocked_dates ORDER BY date ASC`;
  return rows.map((r) => ({
    id: r.id,
    date: toDateStr(r.date),
    reason: r.reason,
    createdAt: r.created_at,
  }));
}

export async function addBlockedDate(date: string, reason?: string): Promise<BlockedDate> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO blocked_dates (date, reason) VALUES (${date}, ${reason ?? null})
    ON CONFLICT (date) DO UPDATE SET reason = EXCLUDED.reason
    RETURNING *
  `;
  const r = rows[0];
  return { id: r.id, date: toDateStr(r.date), reason: r.reason, createdAt: r.created_at };
}

export async function removeBlockedDate(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM blocked_dates WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM blocked_slots ORDER BY date ASC, start_time ASC`;
  return rows.map((r) => ({
    id: r.id,
    date: toDateStr(r.date),
    startTime: r.start_time,
    reason: r.reason,
    createdAt: r.created_at,
  }));
}

export async function addBlockedSlot(
  date: string,
  startTime: string,
  reason?: string
): Promise<BlockedSlot> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO blocked_slots (date, start_time, reason) VALUES (${date}, ${startTime}, ${reason ?? null})
    ON CONFLICT (date, start_time) DO UPDATE SET reason = EXCLUDED.reason
    RETURNING *
  `;
  const r = rows[0];
  return {
    id: r.id,
    date: toDateStr(r.date),
    startTime: r.start_time,
    reason: r.reason,
    createdAt: r.created_at,
  };
}

export async function removeBlockedSlot(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`DELETE FROM blocked_slots WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
