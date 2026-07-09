"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface DatePickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
const MONTHS = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isPastDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [fullyBookedDates, setFullyBookedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchMonthAvailability() {
      try {
        const res = await fetch(
          `/api/bookings?year=${viewYear}&month=${viewMonth + 1}`
        );
        const data = await res.json();
        const bookedByDate: Record<string, number> = {};

        for (const slot of data.bookedSlots as string[]) {
          const [date] = slot.split(":");
          bookedByDate[date] = (bookedByDate[date] ?? 0) + 1;
        }

        const fullDates = new Set<string>();
        for (const [date, count] of Object.entries(bookedByDate)) {
          if (count >= 6) fullDates.add(date);
        }
        setFullyBookedDates(fullDates);
      } catch {
        setFullyBookedDates(new Set());
      }
    }

    fetchMonthAvailability();
  }, [viewYear, viewMonth]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const days: (number | null)[] = [];

    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);

    return days;
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div className="rounded-3xl glass p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 disabled:opacity-20"
          aria-label="Vorige maand"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
          aria-label="Volgende maand"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[10px] font-medium uppercase tracking-wider text-foreground/40"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = toDateString(viewYear, viewMonth, day);
          const isPast = isPastDate(viewYear, viewMonth, day);
          const isFullyBooked = fullyBookedDates.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const isDisabled = isPast || isFullyBooked;

          return (
            <motion.button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateStr)}
              className={`relative flex aspect-square items-center justify-center rounded-2xl text-sm font-medium transition-all duration-300 ${
                isSelected
                  ? "bg-foreground text-white shadow-lg shadow-pink/20"
                  : isDisabled
                    ? "cursor-not-allowed text-foreground/20"
                    : "text-foreground hover:bg-pink/20 hover:shadow-sm"
              } ${isFullyBooked && !isPast ? "line-through decoration-foreground/20" : ""}`}
              whileHover={!isDisabled ? { scale: 1.08 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              {day}
              {isFullyBooked && !isPast && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-foreground/30" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
