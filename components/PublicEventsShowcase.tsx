import { FamilyEvent } from "@/utils/eventHelpers";
import {
  CalendarDays,
  CalendarHeart,
  Flower2,
  Gift,
  Star,
} from "lucide-react";

function relativeLabel(daysUntil: number) {
  if (daysUntil === 0) return "Hôm nay";
  if (daysUntil === 1) return "Ngày mai";
  return `${daysUntil} ngày nữa`;
}

const eventMeta = {
  birthday: {
    label: "Sinh nhật",
    icon: Gift,
    tone: "bg-amber-50 text-amber-700 border-amber-100",
  },
  death_anniversary: {
    label: "Ngày giỗ",
    icon: Flower2,
    tone: "bg-violet-50 text-violet-700 border-violet-100",
  },
  custom_event: {
    label: "Sự kiện",
    icon: Star,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  organized_event: {
    label: "Sự kiện dòng họ",
    icon: CalendarHeart,
    tone: "bg-amber-50 text-amber-700 border-amber-100",
  },
} as const;

export default function PublicEventsShowcase({
  lunar,
  upcomingEvents,
}: {
  lunar: {
    solarStr: string;
    lunarDayStr: string;
    lunarYear: string;
  };
  upcomingEvents: FamilyEvent[];
}) {
  return (
    <section className="overflow-hidden rounded-[2.3rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,251,235,0.9)_48%,rgba(236,253,245,0.88))] p-5 shadow-[0_28px_90px_-44px_rgba(15,23,42,0.35)] sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-3 rounded-[1.5rem] border border-white/80 bg-white/90 px-4 py-3 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.3)]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#c2410c)] text-white shadow-lg shadow-amber-500/25">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                Hôm nay
              </p>
              <p className="text-lg font-semibold text-stone-800">
                Dòng thời gian gia tộc
              </p>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/80 bg-white/85 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.32)]">
            <p className="text-3xl font-bold leading-tight tracking-tight text-stone-950">
              {lunar.solarStr}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                Âm lịch
              </span>
              <span className="text-sm font-semibold text-stone-700">
                {lunar.lunarDayStr}
              </span>
            </div>
            <p className="mt-4 text-base text-stone-500">Năm {lunar.lunarYear}</p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              <span className="size-2.5 rounded-full bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.8)]" />
              Sự kiện 30 ngày tới
            </p>
            <p className="mt-2 text-2xl font-bold text-stone-950">
              Có {upcomingEvents.length} mốc quan trọng đang chờ phía trước
            </p>
          </div>

          <div className="grid gap-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => {
                const meta = eventMeta[event.type];
                const Icon = meta.icon;

                return (
                  <article
                    key={`${event.personId}-${index}`}
                    className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border ${meta.tone}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-bold text-stone-900">
                          {event.personName}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-stone-500">
                          {meta.label}
                        </p>
                        <p className="mt-2 text-sm font-medium text-stone-500">
                          {relativeLabel(event.daysUntil)} · {event.eventDateLabel}
                        </p>
                        {event.content && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
                            {event.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-stone-200 bg-white/80 p-6 text-center">
                <p className="font-semibold text-stone-800">
                  Chưa có sự kiện nào trong 30 ngày tới
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Khi dữ liệu được cập nhật, những mốc quan trọng sẽ xuất hiện tại đây.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
