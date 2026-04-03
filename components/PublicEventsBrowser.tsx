"use client";

import { FamilyEvent } from "@/utils/eventHelpers";
import { CalendarHeart, Flower2, Gift } from "lucide-react";
import { useMemo, useState } from "react";

type PublicFilter =
  | "all"
  | "birthday"
  | "death_anniversary"
  | "organized_event";

const eventMeta = {
  birthday: {
    label: "Sinh nhật",
    icon: Gift,
    tone:
      "border-amber-200/80 bg-[linear-gradient(180deg,rgba(255,251,235,0.95),rgba(255,247,237,0.88))] text-amber-800",
  },
  death_anniversary: {
    label: "Ngày giỗ",
    icon: Flower2,
    tone:
      "border-stone-200/80 bg-[linear-gradient(180deg,rgba(250,250,249,0.96),rgba(245,245,244,0.88))] text-stone-800",
  },
  organized_event: {
    label: "Sự kiện dòng họ",
    icon: CalendarHeart,
    tone:
      "border-amber-300/70 bg-[linear-gradient(180deg,rgba(255,251,235,0.96),rgba(254,243,199,0.72))] text-amber-900",
  },
} as const;

function relativeLabel(daysUntil: number) {
  if (daysUntil === 0) return "Hôm nay";
  if (daysUntil === 1) return "Ngày mai";
  return `${daysUntil} ngày nữa`;
}

export default function PublicEventsBrowser({
  events,
}: {
  events: FamilyEvent[];
}) {
  const [filter, setFilter] = useState<PublicFilter>("all");

  const filteredEvents = useMemo(() => {
    const base = events.filter((event) => event.daysUntil >= 0 && event.daysUntil <= 180);

    if (filter === "all") {
      return base.filter((event) => event.type !== "custom_event");
    }

    return base.filter((event) => event.type === filter);
  }, [events, filter]);

  const tabs: { key: PublicFilter; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "birthday", label: "Sinh nhật" },
    { key: "death_anniversary", label: "Ngày giỗ" },
    { key: "organized_event", label: "Sự kiện dòng họ" },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(250,248,244,0.96))] p-5 shadow-[0_28px_80px_-44px_rgba(15,23,42,0.24)] sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              filter === tab.key
                ? "bg-stone-900 text-white shadow-sm"
                : "border border-stone-200 bg-white text-stone-600 hover:border-amber-200 hover:text-amber-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-xs font-medium text-stone-500">
          {filteredEvents.length} sự kiện
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const meta = eventMeta[event.type as keyof typeof eventMeta];
            const Icon = meta.icon;

            return (
              <article
                key={`${event.personId}-${event.type}-${index}`}
                className={`rounded-[1.5rem] border px-5 py-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.2)] ${meta.tone}`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-bold">{event.personName}</p>
                        <p className="text-sm font-medium opacity-80">
                          {meta.label}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {relativeLabel(event.daysUntil)}
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-6 opacity-80">
                      {event.eventDateLabel}
                    </p>

                    {event.location && (
                      <p className="mt-1 text-sm leading-6 opacity-80">
                        Địa điểm: {event.location}
                      </p>
                    )}

                    {event.content && (
                      <p className="mt-2 text-sm leading-6 opacity-80">
                        {event.content}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-stone-200 bg-stone-50/70 p-8 text-center text-stone-500">
            Chưa có dữ liệu ở nhóm sự kiện này.
          </div>
        )}
      </div>
    </section>
  );
}
