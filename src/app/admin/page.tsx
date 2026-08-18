"use client";

import { useEffect, useState } from "react";

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

const statusLabels: Record<BookingStatus, string> = {
  nieuw: "Nieuw",
  goedgekeurd: "Goedgekeurd",
  in_behandeling: "In behandeling",
  afgerond: "Afgerond",
  geannuleerd: "Geannuleerd",
};

export default function AdminPage() {
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

          {activeTab === "agenda" && (
            <Placeholder title="Agenda" />
          )}

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

          {activeTab === "availability" && (
            <Placeholder title="Beschikbaarheid" />
          )}
        </section>
      </div>
    </main>
  );
}

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
            <span className="text-black/50">
              Populair evenement
            </span>

            <span className="font-medium">
              {stats.popularEventType ?? "—"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-black/50">
              Aankomende boekingen
            </span>

            <span className="font-medium">
              {stats.upcoming}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

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
          <p className="text-black/40">
            Boekingen laden...
          </p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
          <p className="text-black/40">
            Er zijn nog geen boekingen.
          </p>
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
                  <p className="text-sm font-medium">
                    {booking.package}
                  </p>

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
  const [status, setStatus] = useState<BookingStatus>(
    booking.status
  );

  const [notes, setNotes] = useState(
    booking.adminNotes ?? ""
  );

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
        <p className="text-sm text-black/40">
          Boeking
        </p>

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
          <DetailRow
            label="Datum"
            value={formatDate(booking.date)}
          />

          <DetailRow
            label="Tijd"
            value={`${booking.startTime} – ${booking.endTime}`}
          />

          <DetailRow
            label="Pakket"
            value={booking.package}
          />

          <DetailRow
            label="Evenement"
            value={booking.eventType}
          />
        </DetailSection>

        <DetailSection title="Klant">
          <DetailRow
            label="Naam"
            value={`${booking.firstName} ${booking.lastName}`}
          />

          {booking.company && (
            <DetailRow
              label="Bedrijf"
              value={booking.company}
            />
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
        <h3 className="text-lg font-semibold">
          Beheer
        </h3>

        <div className="mt-5">
          <label className="text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as BookingStatus)
            }
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black md:max-w-md"
          >
            <option value="nieuw">Nieuw</option>
            <option value="goedgekeurd">
              Goedgekeurd
            </option>
            <option value="in_behandeling">
              In behandeling
            </option>
            <option value="afgerond">Afgerond</option>
            <option value="geannuleerd">
              Geannuleerd
            </option>
          </select>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium">
            Interne notitie
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
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

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="mb-5 text-lg font-semibold">
        {title}
      </h3>

      <div className="space-y-4">
        {children}
      </div>
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
      <span className="text-sm text-black/40">
        {label}
      </span>

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
      <p className="text-sm text-black/40">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function Placeholder({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <p className="text-sm text-black/40">
        HeyNoona beheer
      </p>

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

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}