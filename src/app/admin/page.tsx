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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    thisMonth: 0,
    upcoming: 0,
    popularPackage: null,
    popularEventType: null,
  });

  const [loading, setLoading] = useState(true);

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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "agenda", label: "Agenda", icon: "▣" },
    { id: "bookings", label: "Boekingen", icon: "☷" },
    { id: "availability", label: "Beschikbaarheid", icon: "◷" },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        {/* Sidebar */}
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
                  onClick={() => setActiveTab(tab.id)}
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

        {/* Content */}
        <section className="flex-1 p-5 md:p-10">
          {activeTab === "dashboard" && (
            <Dashboard stats={stats} loading={loading} />
          )}

          {activeTab === "agenda" && <Placeholder title="Agenda" />}

          {activeTab === "bookings" && <Placeholder title="Boekingen" />}

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

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
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