import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  package: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message: string | null;
  status: string;
  createdAt: string;
}

export interface CreateBookingInput {
  date: string;
  startTime: string;
  endTime: string;
  package: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message?: string;
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "bookings.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      package TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      event_type TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TEXT NOT NULL,
      UNIQUE(date, start_time)
    )
  `);

  return db;
}

export function getBookedSlotsForMonth(year: number, month: number): string[] {
  const database = getDb();
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;

  const rows = database
    .prepare(
      `SELECT date, start_time FROM bookings
       WHERE date LIKE ? AND status = 'confirmed'`
    )
    .all(`${prefix}-%`) as { date: string; start_time: string }[];

  return rows.map((r) => `${r.date}:${r.start_time}`);
}

export function getBookedSlotsForDate(date: string): string[] {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT start_time FROM bookings
       WHERE date = ? AND status = 'confirmed'`
    )
    .all(date) as { start_time: string }[];

  return rows.map((r) => r.start_time);
}

export function isSlotAvailable(
  date: string,
  startTime: string
): boolean {
  const database = getDb();
  const row = database
    .prepare(
      `SELECT id FROM bookings
       WHERE date = ? AND start_time = ? AND status = 'confirmed'`
    )
    .get(date, startTime);

  return !row;
}

export function createBooking(
  id: string,
  input: CreateBookingInput
): Booking {
  const database = getDb();
  const createdAt = new Date().toISOString();

  const insert = database.prepare(`
    INSERT INTO bookings
      (id, date, start_time, end_time, package, name, email, phone, event_type, message, status, created_at)
    VALUES
      (@id, @date, @startTime, @endTime, @package, @name, @email, @phone, @eventType, @message, 'confirmed', @createdAt)
  `);

  try {
    insert.run({
      id,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      package: input.package,
      name: input.name,
      email: input.email,
      phone: input.phone,
      eventType: input.eventType,
      message: input.message ?? null,
      createdAt,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      throw new Error("SLOT_UNAVAILABLE");
    }
    throw error;
  }

  return {
    id,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    package: input.package,
    name: input.name,
    email: input.email,
    phone: input.phone,
    eventType: input.eventType,
    message: input.message ?? null,
    status: "confirmed",
    createdAt,
  };
}
