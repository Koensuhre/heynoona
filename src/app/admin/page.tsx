"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Tab = "dashboard" | "agenda" | "bookings" | "availability";

type DashboardStats = {
  total: number;
  thisMonth: number;
  upcoming: number;
  popularPackage: string | null;
  popularEventType: string | null;
};

type BookingStatus =
  | "nieuw"
  | "goedgekeurd"
  | "in_behandeling"
  | "afgerond"
  | "geannuleerd";

type Booking = {
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
};

type BlockedDate = {
  id: string;
  date: string;
  reason: string | null;
  createdAt: string;
};

type BlockedSlot = {
  id: string;
  date: string;
  startTime: string;
  reason: string | null;
  createdAt: string;
};

const statusLabels: Record<BookingStatus, string> = {
  nieuw: "Nieuw",
  goedgekeurd: "Goedgekeurd",
  in_behandeling: "In behandeling",
  afgerond: "Afgerond",
  geannuleerd: "Geannuleerd",
};

const TIME_SLOTS = [
  { start: "10:00", end: "12:00" },
  { start: "12:00", end: "14:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
  { start: "18:00", end: "20:00" },
  { start: "20:00", end: "22:00" },
];

export default function AdminPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking");

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    thisMonth: 0,
    upcoming: 0,
    popularPackage: null,
    popularEventType: null,
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setStats(data);
        }
      })
      .catch((error) => {
        console.error("Dashboard stats ophalen mislukt:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  if (activeTab !== "bookings") return;
  loadBookings();
}, [activeTab]);

useEffect(() => {
  if (!bookingId || bookings.length === 0) return;

  const booking = bookings.find((item) => item.id === bookingId);

  if (booking) {
    setSelectedBooking(booking);
    setActiveTab("bookings");
  }
}, [bookingId, bookings]);

  async function loadBookings() {
    setBookingsLoading(true);

    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();

      if (!data.error) {
        setBookings(data.bookings ?? []);
      }
    } catch (error) {
      console.error("Boekingen ophalen mislukt:", error);
    } finally {
      setBookingsLoading(false);
    }
  }

  async function saveBooking(
    id: string,
    changes: {
      status?: BookingStatus;
      adminNotes?: string;
    }
  ) {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Opslaan mislukt.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === id ? data.booking : booking
        )
      );

      setSelectedBooking(data.booking);
    } catch (error) {
      console.error("Boeking opslaan mislukt:", error);
      alert("Opslaan mislukt. Probeer het opnieuw.");
    }
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "agenda", label: "Agenda", icon: "▣" },
    { id: "bookings", label: "Boekingen", icon: "☷" },
    { id: "availability", label: "Beschikbaarheid", icon: "◷" },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="w-full border-b border-black/10 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
          <div className="p-6">
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40">
                HeyNoona
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Beheer
              </h1>
            </div>

            <nav className="flex gap-2 overflow-x-auto md:flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedBooking(null);
                    setActiveTab(tab.id);
                  }}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "text-black/60 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="flex-1 p-5 md:p-10">
          {activeTab === "dashboard" && (
            <Dashboard stats={stats} loading={loading} />
          )}

          {activeTab === "agenda" && <Agenda />}

          {activeTab === "bookings" && (
            <>
              {selectedBooking ? (
                <BookingDetail
                  booking={selectedBooking}
                  onBack={() => setSelectedBooking(null)}
                  onSave={saveBooking}
                />
              ) : (
                <BookingsList
                  bookings={bookings}
                  loading={bookingsLoading}
                  onSelect={setSelectedBooking}
                />
              )}
            </>
          )}

          {activeTab === "availability" && <Availability />}
        </section>
      </div>
    </main>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({
  stats,
  loading,
}: {
  stats: DashboardStats;
  loading: boolean;
}) {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-black/40">HeyNoona beheer</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Dashboard
        </h2>

        <p className="mt-2 text-black/50">
          Beheer hier je boekingen en beschikbaarheid.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Boekingen"
          value={loading ? "…" : String(stats.total)}
        />

        <StatCard
          label="Deze maand"
          value={loading ? "…" : String(stats.thisMonth)}
        />

        <StatCard
          label="Aankomend"
          value={loading ? "…" : String(stats.upcoming)}
        />

        <StatCard
          label="Populair pakket"
          value={loading ? "…" : stats.popularPackage ?? "—"}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="text-lg font-semibold">Overzicht</h3>

        <div className="mt-5 space-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <span className="text-black/50">Populair evenement</span>

            <span className="font-medium">
              {stats.popularEventType ?? "—"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-black/50">Aankomende boekingen</span>

            <span className="font-medium">{stats.upcoming}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- BOEKINGEN ---------------- */

function BookingsList({
  bookings,
  loading,
  onSelect,
}: {
  bookings: Booking[];
  loading: boolean;
  onSelect: (booking: Booking) => void;
}) {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-black/40">HeyNoona beheer</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Boekingen
        </h2>

        <p className="mt-2 text-black/50">
          Alle aanvragen en boekingen vanuit je website.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <p className="text-black/40">Boekingen laden...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <p className="text-black/40">Er zijn nog geen boekingen.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <button
              key={booking.id}
              onClick={() => onSelect(booking)}
              className="block w-full rounded-2xl border border-black/10 bg-white p-5 text-left transition hover:border-black/20 hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {booking.firstName} {booking.lastName}
                    </h3>

                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium">
                      {statusLabels[booking.status]}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-black/50">
                    {formatDate(booking.date)} · {booking.startTime} –{" "}
                    {booking.endTime}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm font-medium">{booking.package}</p>

                  <p className="text-sm text-black/50">
                    {booking.eventType}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function BookingDetail({
  booking,
  onBack,
  onSave,
}: {
  booking: Booking;
  onBack: () => void;
  onSave: (
    id: string,
    changes: {
      status?: BookingStatus;
      adminNotes?: string;
    }
  ) => void;
}) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [notes, setNotes] = useState(booking.adminNotes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(booking.status);
    setNotes(booking.adminNotes ?? "");
  }, [booking]);

  async function handleSave() {
    setSaving(true);

    await onSave(booking.id, {
      status,
      adminNotes: notes,
    });

    setSaving(false);
  }

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 text-sm text-black/50 hover:text-black"
      >
        ← Terug naar boekingen
      </button>

      <div className="mb-8">
        <p className="text-sm text-black/40">Boeking</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          {booking.firstName} {booking.lastName}
        </h2>

        <p className="mt-2 text-black/50">
          {formatDate(booking.date)} · {booking.startTime} –{" "}
          {booking.endTime}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DetailSection title="Evenement">
          <DetailRow label="Datum" value={formatDate(booking.date)} />

          <DetailRow
            label="Tijd"
            value={`${booking.startTime} – ${booking.endTime}`}
          />

          <DetailRow label="Pakket" value={booking.package} />

          <DetailRow label="Evenement" value={booking.eventType} />
        </DetailSection>

        <DetailSection title="Klant">
          <DetailRow
            label="Naam"
            value={`${booking.firstName} ${booking.lastName}`}
          />

          {booking.company && (
            <DetailRow label="Bedrijf" value={booking.company} />
          )}

          <DetailRow
            label="E-mail"
            value={booking.email}
            href={`mailto:${booking.email}`}
          />

          <DetailRow
            label="Telefoon"
            value={booking.phone}
            href={`tel:${booking.phone}`}
          />
        </DetailSection>

        <DetailSection title="Adres">
          <p className="text-sm leading-6">
            {booking.address || "Geen adres opgegeven"}
            <br />
            {booking.postalCode} {booking.city}
          </p>
        </DetailSection>

        <DetailSection title="Opmerkingen klant">
          <p className="whitespace-pre-wrap text-sm leading-6 text-black/70">
            {booking.message || "Geen opmerkingen"}
          </p>
        </DetailSection>
      </div>

      <div className="mt-5 rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="text-lg font-semibold">Beheer</h3>

        <div className="mt-5">
          <label className="text-sm font-medium">Status</label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as BookingStatus)
            }
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black md:max-w-md"
          >
            <option value="nieuw">Nieuw</option>
            <option value="goedgekeurd">Goedgekeurd</option>
            <option value="in_behandeling">In behandeling</option>
            <option value="afgerond">Afgerond</option>
            <option value="geannuleerd">Geannuleerd</option>
          </select>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium">Interne notitie</label>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Bijvoorbeeld: klant gebeld, extra uur besproken..."
            className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Opslaan..." : "Wijzigingen opslaan"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------- BESCHIKBAARHEID ---------------- */

function Availability() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);

  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [startTime, setStartTime] = useState(TIME_SLOTS[0].start);

  const [dateReason, setDateReason] = useState("");
  const [slotReason, setSlotReason] = useState("");

  const [savingDate, setSavingDate] = useState(false);
  const [savingSlot, setSavingSlot] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  async function loadAvailability() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/availability");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setBlockedDates(data.dates ?? []);
      setBlockedSlots(data.slots ?? []);
    } catch (error) {
      console.error("Beschikbaarheid ophalen mislukt:", error);
      alert("Beschikbaarheid kon niet worden opgehaald.");
    } finally {
      setLoading(false);
    }
  }

  async function blockDate() {
    if (!date) {
      alert("Kies eerst een datum.");
      return;
    }

    setSavingDate(true);

    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "date",
          date,
          reason: dateReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setBlockedDates((current) => [...current, data.date]);
      setDate("");
      setDateReason("");
    } catch (error) {
      console.error(error);
      alert("Dag blokkeren mislukt.");
    } finally {
      setSavingDate(false);
    }
  }

  async function blockSlot() {
    if (!slotDate) {
      alert("Kies eerst een datum.");
      return;
    }

    setSavingSlot(true);

    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "slot",
          date: slotDate,
          startTime,
          reason: slotReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setBlockedSlots((current) => [...current, data.slot]);
      setSlotDate("");
      setSlotReason("");
    } catch (error) {
      console.error(error);
      alert("Tijdslot blokkeren mislukt.");
    } finally {
      setSavingSlot(false);
    }
  }

  async function removeBlock(
    type: "date" | "slot",
    id: string
  ) {
    try {
      const response = await fetch("/api/admin/availability", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      if (type === "date") {
        setBlockedDates((current) =>
          current.filter((item) => item.id !== id)
        );
      } else {
        setBlockedSlots((current) =>
          current.filter((item) => item.id !== id)
        );
      }
    } catch (error) {
      console.error(error);
      alert("Blokkade verwijderen mislukt.");
    }
  }

  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-black/40">HeyNoona beheer</p>

        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Beschikbaarheid
        </h2>

        <p className="mt-2 max-w-2xl text-black/50">
          Zet dagen of specifieke tijdsloten dicht wanneer HeyNoona niet
          beschikbaar is.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Hele dag blokkeren */}
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h3 className="text-lg font-semibold">
            Hele dag blokkeren
          </h3>

          <p className="mt-1 text-sm text-black/50">
            De hele dag wordt onbeschikbaar voor nieuwe boekingen.
          </p>

          <div className="mt-5">
            <label className="text-sm font-medium">
              Datum
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">
              Reden <span className="font-normal text-black/40">(optioneel)</span>
            </label>

            <input
              type="text"
              value={dateReason}
              onChange={(event) => setDateReason(event.target.value)}
              placeholder="Bijvoorbeeld: vakantie"
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <button
            onClick={blockDate}
            disabled={savingDate}
            className="mt-5 w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
          >
            {savingDate ? "Blokkeren..." : "Hele dag blokkeren"}
          </button>
        </div>

        {/* Tijdslot blokkeren */}
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h3 className="text-lg font-semibold">
            Tijdslot blokkeren
          </h3>

          <p className="mt-1 text-sm text-black/50">
            Alleen het gekozen tijdslot wordt onbeschikbaar.
          </p>

          <div className="mt-5">
            <label className="text-sm font-medium">
              Datum
            </label>

            <input
              type="date"
              value={slotDate}
              onChange={(event) => setSlotDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">
              Tijd
            </label>

            <select
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot.start} value={slot.start}>
                  {slot.start} – {slot.end}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">
              Reden <span className="font-normal text-black/40">(optioneel)</span>
            </label>

            <input
              type="text"
              value={slotReason}
              onChange={(event) => setSlotReason(event.target.value)}
              placeholder="Bijvoorbeeld: privé-afspraak"
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>

          <button
            onClick={blockSlot}
            disabled={savingSlot}
            className="mt-5 w-full rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
          >
            {savingSlot ? "Blokkeren..." : "Tijdslot blokkeren"}
          </button>
        </div>
      </div>

      {/* Geblokkeerde dagen */}
      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="text-lg font-semibold">
          Geblokkeerde dagen
        </h3>

        {loading ? (
          <p className="mt-5 text-sm text-black/40">
            Laden...
          </p>
        ) : blockedDates.length === 0 ? (
          <p className="mt-5 text-sm text-black/40">
            Er zijn momenteel geen hele dagen geblokkeerd.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {blockedDates
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-black/5 bg-[#faf9f7] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {formatDate(item.date)}
                    </p>

                    {item.reason && (
                      <p className="mt-1 text-sm text-black/50">
                        {item.reason}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      removeBlock("date", item.id)
                    }
                    className="text-left text-sm font-medium text-red-600 hover:text-red-700 sm:text-right"
                  >
                    Blokkade verwijderen
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Geblokkeerde tijdsloten */}
      <div className="mt-5 rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="text-lg font-semibold">
          Geblokkeerde tijdsloten
        </h3>

        {loading ? (
          <p className="mt-5 text-sm text-black/40">
            Laden...
          </p>
        ) : blockedSlots.length === 0 ? (
          <p className="mt-5 text-sm text-black/40">
            Er zijn momenteel geen tijdsloten geblokkeerd.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {blockedSlots
              .sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date);

                if (dateCompare !== 0) {
                  return dateCompare;
                }

                return a.startTime.localeCompare(b.startTime);
              })
              .map((item) => {
                const slot = TIME_SLOTS.find(
                  (slot) => slot.start === item.startTime
                );

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-black/5 bg-[#faf9f7] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {formatDate(item.date)}
                      </p>

                      <p className="mt-1 text-sm text-black/50">
                        {item.startTime} – {slot?.end ?? ""}
                      </p>

                      {item.reason && (
                        <p className="mt-1 text-sm text-black/40">
                          {item.reason}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        removeBlock("slot", item.id)
                      }
                      className="text-left text-sm font-medium text-red-600 hover:text-red-700 sm:text-right"
                    >
                      Blokkade verwijderen
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}

/* ---------------- AGENDA ---------------- */

function Agenda() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);

  const [loading, setLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Maandag = 0, zondag = 6
  const startingDay = (firstDay.getDay() + 6) % 7;

  const days = Array.from(
    { length: startingDay + daysInMonth },
    (_, index) => {
      if (index < startingDay) return null;
      return index - startingDay + 1;
    }
  );

  useEffect(() => {
    loadAgenda();
  }, [year, month]);

  async function loadAgenda() {
    setLoading(true);

    const dateFrom = `${year}-${String(month + 1).padStart(2, "0")}-01`;

    const lastDay = new Date(year, month + 1, 0).getDate();

    const dateTo = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      lastDay
    ).padStart(2, "0")}`;

    try {
      const response = await fetch(
        `/api/admin/agenda?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setBookings(data.bookings ?? []);
      setBlockedDates(data.blockedDates ?? []);
      setBlockedSlots(data.blockedSlots ?? []);
    } catch (error) {
      console.error("Agenda ophalen mislukt:", error);
      alert("Agenda kon niet worden opgehaald.");
    } finally {
      setLoading(false);
    }
  }

  function previousMonth() {
    setSelectedDate(null);
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setSelectedDate(null);
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    const today = new Date();

    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

    setSelectedDate(formatDateForApi(today));
  }

  function getBookingsForDate(date: string) {
    return bookings.filter((booking) => booking.date === date);
  }

  function getBlockedSlotsForDate(date: string) {
    return blockedSlots.filter((slot) => slot.date === date);
  }

  function isDateBlocked(date: string) {
    return blockedDates.some((blocked) => blocked.date === date);
  }

  function formatMonthTitle() {
    return currentDate.toLocaleDateString("nl-NL", {
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-black/40">HeyNoona beheer</p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Agenda
            </h2>

            <p className="mt-2 text-black/50">
              Bekijk boekingen en je geblokkeerde momenten.
            </p>
          </div>

          <button
            onClick={goToToday}
            className="w-fit rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            Vandaag
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 md:p-6">
        {/* Kalender header */}

        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5"
          >
            ←
          </button>

          <h3 className="text-lg font-semibold capitalize">
            {formatMonthTitle()}
          </h3>

          <button
            onClick={nextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5"
          >
            →
          </button>
        </div>

        {/* Weekdagen */}

        <div className="grid grid-cols-7 border-b border-black/10 pb-2">
          {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-black/40"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Kalender */}

        <div className="mt-2 grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-20 rounded-xl"
                />
              );
            }

            const date = `${year}-${String(month + 1).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;

            const dayBookings = getBookingsForDate(date);
            const dayBlockedSlots = getBlockedSlotsForDate(date);
            const blocked = isDateBlocked(date);

            const today = formatDateForApi(new Date()) === date;
            const selected = selectedDate === date;

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`min-h-20 rounded-xl border p-2 text-left transition md:min-h-24 ${
                  selected
                    ? "border-black bg-black/5"
                    : "border-transparent hover:border-black/10 hover:bg-black/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      today
                        ? "bg-black font-semibold text-white"
                        : "font-medium"
                    }`}
                  >
                    {day}
                  </span>

                  {blocked && (
                    <span className="text-xs text-red-500">
                      ●
                    </span>
                  )}
                </div>

                <div className="mt-2 space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className="truncate rounded-md bg-black px-1.5 py-1 text-[10px] font-medium text-white"
                    >
                      {booking.startTime} {booking.firstName}
                    </div>
                  ))}

                  {dayBookings.length > 2 && (
                    <p className="text-[10px] text-black/40">
                      +{dayBookings.length - 2} meer
                    </p>
                  )}

                  {dayBlockedSlots.length > 0 && !blocked && (
                    <p className="truncate text-[10px] text-red-500">
                      {dayBlockedSlots.length} geblokkeerd
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="mt-5 text-center text-sm text-black/40">
            Agenda laden...
          </p>
        )}
      </div>

      {/* Geselecteerde dag */}

      {selectedDate && (
        <AgendaDay
          date={selectedDate}
          bookings={getBookingsForDate(selectedDate)}
          blockedDate={isDateBlocked(selectedDate)}
          blockedSlots={getBlockedSlotsForDate(selectedDate)}
          onRefresh={loadAgenda}
        />
      )}
    </>
  );
}

/* ---------------- AGENDA DAG ---------------- */

function AgendaDay({
  date,
  bookings,
  blockedDate,
  blockedSlots,
  onRefresh,
}: {
  date: string;
  bookings: Booking[];
  blockedDate: boolean;
  blockedSlots: BlockedSlot[];
  onRefresh: () => void;
}) {
  const selected = new Date(`${date}T00:00:00`);
  const [blockingSlot, setBlockingSlot] = useState<string | null>(null);

  const title = selected.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function getBookingForSlot(startTime: string) {
    return bookings.find(
      (booking) => booking.startTime === startTime
    );
  }

  function isSlotBlocked(startTime: string) {
    return blockedSlots.some(
      (slot) => slot.startTime === startTime
    );
  }

  async function blockSlot(startTime: string) {
    const reason = window.prompt(
      "Waarom wil je dit tijdslot blokkeren? (optioneel)"
    );

    if (reason === null) return;

    setBlockingSlot(startTime);

    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "slot",
          date,
          startTime,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Blokkeren mislukt.");
      }

      await onRefresh();
    } catch (error) {
      console.error("Tijdslot blokkeren mislukt:", error);
      alert("Tijdslot blokkeren mislukt.");
    } finally {
      setBlockingSlot(null);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-black/10 bg-white p-6">
      <div className="mb-5">
        <p className="text-sm text-black/40">Geselecteerde dag</p>

        <h3 className="mt-1 text-xl font-semibold capitalize">
          {title}
        </h3>

        {blockedDate && (
          <p className="mt-2 text-sm font-medium text-red-500">
            Deze hele dag is geblokkeerd.
          </p>
        )}
      </div>

      <div className="space-y-2">
        {TIME_SLOTS.map((slot) => {
          const booking = getBookingForSlot(slot.start);
          const blocked = isSlotBlocked(slot.start);

          return (
            <div
              key={slot.start}
              className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                booking
                  ? "border-black/10 bg-black text-white"
                  : blocked || blockedDate
                  ? "border-red-100 bg-red-50"
                  : "border-black/5 bg-[#faf9f7]"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-semibold ${
                    booking ? "text-white" : ""
                  }`}
                >
                  {slot.start} – {slot.end}
                </p>

                {booking ? (
                  <p className="mt-1 text-sm text-white/70">
                    {booking.firstName} {booking.lastName}
                  </p>
                ) : blocked || blockedDate ? (
                  <p className="mt-1 text-sm text-red-500">
                    Niet beschikbaar
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-black/40">
                    Beschikbaar
                  </p>
                )}
              </div>

            {booking ? (
  <button
    onClick={() => {
      window.location.href = `/admin?booking=${booking.id}`;
    }}
    className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
  >
    Bekijk boeking
  </button>
) : !blocked && !blockedDate ? (
  <button
    onClick={() => blockSlot(slot.start)}
    disabled={blockingSlot === slot.start}
    className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-50"
  >
    {blockingSlot === slot.start
      ? "Blokkeren..."
      : "Blokkeer tijdslot"}
  </button>
) : null}
            </div>
          );
        })}
      </div>

      <button
        onClick={onRefresh}
        className="mt-5 text-sm text-black/40 hover:text-black"
      >
        ↻ Agenda vernieuwen
      </button>
    </div>
  );
}

/* ---------------- HULPCOMPONENTEN ---------------- */

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="mb-5 text-lg font-semibold">{title}</h3>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-black/5 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-sm text-black/40">{label}</span>

      {href ? (
        <a
          href={href}
          className="break-all text-sm font-medium hover:underline sm:text-right"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm font-medium sm:text-right">
          {value}
        </span>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-sm text-black/40">{label}</p>

      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <p className="text-sm text-black/40">HeyNoona beheer</p>

      <h2 className="mt-1 text-3xl font-semibold tracking-tight">
        {title}
      </h2>

      <div className="mt-8 rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center">
        <p className="text-black/40">
          Dit onderdeel bouwen we in de volgende stap.
        </p>
      </div>
    </div>
  );
}

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}