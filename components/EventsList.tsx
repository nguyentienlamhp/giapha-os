"use client";

import { getZodiacSign } from "@/utils/dateHelpers";
import {
  computeEvents,
  CustomEventRecord,
  FamilyEvent,
} from "@/utils/eventHelpers";
import { motion } from "framer-motion";
import {
  AlignLeft,
  Cake,
  CalendarDays,
  CalendarHeart,
  Clock,
  Flower,
  MapPin,
  Plus,
} from "lucide-react";
import { Solar } from "lunar-javascript";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CustomEventModal from "./CustomEventModal";
import { useDashboard } from "./DashboardContext";

interface EventsListProps {
  persons: {
    id: string;
    full_name: string;
    birth_year: number | null;
    birth_month: number | null;
    birth_day: number | null;
    death_year: number | null;
    death_month: number | null;
    death_day: number | null;
    death_lunar_year: number | null;
    death_lunar_month: number | null;
    death_lunar_day: number | null;
    is_deceased: boolean;
  }[];
  customEvents?: CustomEventRecord[];
}

const DAY_LABELS: Record<string, string> = {
  "-1": "Hôm qua",
  "0": "Hôm nay",
  "1": "Ngày mai",
};

function daysUntilLabel(days: number): string {
  if (days.toString() in DAY_LABELS) return DAY_LABELS[days.toString()];
  if (days < 0) {
    const abs = Math.abs(days);
    if (abs <= 30) return `${abs} ngày trước`;
    if (abs <= 60) return `${Math.ceil(abs / 7)} tuần trước`;
    return `${Math.ceil(abs / 30)} tháng trước`;
  }
  if (days <= 30) return `${days} ngày nữa`;
  if (days <= 60) return `${Math.ceil(days / 7)} tuần nữa`;
  return `${Math.ceil(days / 30)} tháng nữa`;
}

function EventCard({
  event,
  index,
  onEditClanEvent,
}: {
  event: FamilyEvent;
  index: number;
  onEditClanEvent: (event: FamilyEvent) => void;
}) {
  const isBirthday = event.type === "birthday";
  const isClanEvent = event.type === "organized_event";
  const isToday = event.daysUntil === 0;
  const isPast = event.daysUntil < 0;
  const isSoon = event.daysUntil > 0 && event.daysUntil <= 7;

  const { setMemberModalId } = useDashboard();

  const handleClick = () => {
    if (isClanEvent) {
      onEditClanEvent(event);
    } else if (event.personId) {
      setMemberModalId(event.personId);
    }
  };

  const yearsInfo = (() => {
    if (!event.originYear) return null;
    const diff = new Date().getFullYear() - event.originYear;
    if (diff <= 0) return null;
    if (isBirthday) return `${diff} tuổi`;
    if (event.type === "death_anniversary") return `${diff} năm`;
    return null;
  })();

  const dateLabel = (() => {
    const weekdays = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const d = event.nextOccurrence;
    const dayOfWeek = weekdays[d.getDay()];
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    let label = `${dayOfWeek}, ngày ${day}/${month}`;
    if (event.type === "organized_event") {
      label += `/${year}`;
    }
    if (event.type === "death_anniversary") {
      label += ` (Âm lịch: ${event.eventDateLabel.replace(" ÂL", "")})`;
    }
    return label;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      onClick={handleClick}
      className={`group flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-all hover:shadow-md active:scale-[0.98] sm:gap-4 sm:p-4 ${
        isToday
          ? "border-amber-300 bg-amber-50 shadow-sm"
          : isPast
            ? "border-stone-200/50 bg-stone-50/60"
            : isBirthday
              ? "border-stone-200/60 bg-white/80 hover:border-blue-200"
              : isClanEvent
                ? "border-stone-200/60 bg-white/80 hover:border-amber-200"
                : "border-stone-200/60 bg-white/80 hover:border-rose-200"
      }`}
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11 ${
          isToday
            ? "bg-amber-100 text-amber-600"
            : isPast
              ? "bg-stone-100 text-stone-400"
              : isBirthday
                ? "bg-blue-50 text-blue-500"
                : isClanEvent
                  ? "bg-amber-50 text-amber-600"
                  : "bg-rose-50 text-rose-500"
        }`}
      >
        {isBirthday ? (
          <Cake className="size-[18px] sm:size-5" />
        ) : isClanEvent ? (
          <CalendarHeart className="size-[18px] sm:size-5" />
        ) : (
          <Flower className="size-[18px] sm:size-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p
            className={`truncate text-[15px] font-semibold transition-colors sm:text-base ${
              isPast ? "text-stone-500" : "text-stone-800 group-hover:text-amber-700"
            }`}
          >
            {event.personName}
          </p>

          {isBirthday &&
            event.originDay &&
            event.originMonth &&
            getZodiacSign(event.originDay, event.originMonth) && (
              <span className="shrink-0 whitespace-nowrap rounded-md border border-indigo-200/60 bg-indigo-50 px-1.5 py-0.5 font-sans text-[10px] font-bold tracking-wider text-indigo-700 shadow-xs">
                {getZodiacSign(event.originDay, event.originMonth)}
              </span>
            )}

          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold leading-tight whitespace-nowrap ${
              isToday
                ? "bg-amber-400 text-white"
                : isPast
                  ? "bg-stone-200/80 text-stone-500"
                  : isSoon
                    ? "bg-red-100 text-red-600"
                    : "bg-stone-100 text-stone-500"
            }`}
          >
            {isToday ? (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-200 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
              </span>
            ) : (
              <Clock className="size-2.5" />
            )}
            {daysUntilLabel(event.daysUntil)}
          </span>
        </div>

        <div className="mt-1 flex flex-col gap-0.5">
          <p className="flex items-center gap-1.5 text-[13px] leading-snug text-stone-500 sm:text-sm">
            <CalendarDays className="size-3.5 shrink-0" />
            <span className="font-medium text-stone-600">{dateLabel}</span>
            {yearsInfo && <span className="text-stone-400">· {yearsInfo}</span>}
          </p>

          {event.location && (
            <p className="flex items-center gap-1.5 text-[13px] leading-snug text-stone-500 sm:text-sm">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </p>
          )}

          {event.content && (
            <p className="mt-0.5 flex items-start gap-1.5 text-[13px] leading-snug text-stone-400 sm:text-sm">
              <AlignLeft className="mt-0.5 size-3.5 shrink-0" />
              <span className="line-clamp-2">{event.content}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsList({
  persons,
  customEvents = [],
}: EventsListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<
    "all" | "birthday" | "death_anniversary" | "organized_event" | "past"
  >("all");
  const [showCount, setShowCount] = useState(20);
  const [showDeceasedBirthdays, setShowDeceasedBirthdays] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomEvent, setEditingCustomEvent] =
    useState<CustomEventRecord | null>(null);

  const handleOpenEditModal = (event: FamilyEvent) => {
    const rawEvent = customEvents.find((item) => item.id === event.personId);
    if (!rawEvent) return;
    setEditingCustomEvent(rawEvent);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingCustomEvent(null);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    router.refresh();
  };

  const [todayDate] = useState(() => {
    const today = new Date();
    const weekdays = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const dayOfWeek = weekdays[today.getDay()];
    const solarStr = `${dayOfWeek}, ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
    let lunarStr = "";

    try {
      const solar = Solar.fromYmd(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
      );
      const lunar = solar.getLunar();
      const lMonthRaw = lunar.getMonth();
      const isLeap = lMonthRaw < 0;
      const lMonth = Math.abs(lMonthRaw).toString().padStart(2, "0");
      const lDay = lunar.getDay().toString().padStart(2, "0");
      lunarStr = `${lDay}/${lMonth}${isLeap ? " nhuận" : ""} ÂL`;
    } catch (error) {
      console.error(error);
    }

    return { solar: solarStr, lunar: lunarStr };
  });

  const allEvents = useMemo(
    () => computeEvents(persons, customEvents),
    [persons, customEvents],
  );

  const filtered = useMemo(() => {
    let result = allEvents.filter((event) => event.type !== "custom_event");

    if (filter === "past") {
      return result
        .filter((event) => event.daysUntil < 0 && event.daysUntil >= -365)
        .sort((a, b) => b.daysUntil - a.daysUntil);
    }

    if (filter !== "all") {
      result = result.filter((event) => event.type === filter);
    }

    if (!showDeceasedBirthdays) {
      result = result.filter(
        (event) => !(event.type === "birthday" && event.isDeceased),
      );
    }

    return result.filter((event) => event.daysUntil >= 0 && event.daysUntil <= 365);
  }, [allEvents, filter, showDeceasedBirthdays]);

  const visible = filtered.slice(0, showCount);
  const todayCount = filtered.filter((event) => event.daysUntil === 0).length;
  const soonCount = filtered.filter(
    (event) => event.daysUntil > 0 && event.daysUntil <= 7,
  ).length;

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "birthday", label: "Sinh nhật" },
    { key: "death_anniversary", label: "Ngày giỗ" },
    { key: "organized_event", label: "Sự kiện dòng họ" },
    { key: "past", label: "Đã qua" },
  ] as const;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-stone-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:border-stone-400 hover:shadow-stone-100 sm:flex-row sm:items-center sm:p-8"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/50 opacity-50 blur-3xl" />

        <div className="relative flex items-center gap-4 sm:gap-6">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-stone-100 bg-stone-50 text-stone-600 shadow-sm">
            <CalendarDays className="size-8" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-stone-800 sm:text-2xl">
              {todayDate.solar}
            </p>

            {todayDate.lunar && (
              <div className="mt-2.5 inline-flex flex-wrap items-center gap-2 rounded-full border border-stone-100 bg-stone-50 px-3.5 py-1">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  Âm lịch:
                </span>
                <span className="text-sm font-semibold text-stone-700">
                  {todayDate.lunar}
                </span>
              </div>
            )}

            {(todayCount > 0 || soonCount > 0) && (
              <p className="mt-3 flex items-start gap-2.5 text-sm font-medium text-stone-500 sm:items-center">
                <span className="relative mt-1 flex size-2.5 shrink-0 sm:mt-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
                </span>
                <span className="flex flex-wrap items-center gap-1.5">
                  {todayCount > 0 && (
                    <span className="font-semibold text-stone-700">
                      {todayCount} sự kiện hôm nay
                    </span>
                  )}
                  {todayCount > 0 && soonCount > 0 && (
                    <span className="hidden sm:inline">·</span>
                  )}
                  {soonCount > 0 && <span>{soonCount} sự kiện trong 7 ngày tới</span>}
                </span>
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="relative z-10 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-800 px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-stone-900 hover:shadow-lg active:scale-95 sm:w-auto"
        >
          <Plus className="size-5 text-stone-300" />
          <span>Thêm sự kiện dòng họ</span>
        </button>
      </motion.div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setShowCount(20);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                filter === tab.key
                  ? filter === "past"
                    ? "bg-stone-600 text-white shadow-sm"
                    : "bg-amber-500 text-white shadow-sm"
                  : "border border-stone-200/60 bg-white/80 text-stone-600 hover:border-amber-200 hover:text-amber-700"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <span className="ml-auto self-center text-xs text-stone-400">
            {filtered.length} sự kiện{filter === "past" ? " trong năm qua" : ""}
          </span>
        </div>

        {filter !== "past" && (
          <div className="flex px-1">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900">
              <input
                type="checkbox"
                checked={showDeceasedBirthdays}
                onChange={(e) => setShowDeceasedBirthdays(e.target.checked)}
                className="size-4 rounded-md border-stone-300 text-amber-500 transition-all focus:ring-amber-500"
              />
              Hiển thị sinh nhật của người đã mất
            </label>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="py-16 text-center text-stone-400">
          <CalendarDays className="mx-auto mb-3 size-10 opacity-40" />
          <p className="font-medium">Không có sự kiện nào</p>
          <p className="mt-1 text-sm">
            Hãy bổ sung ngày sinh, ngày giỗ hoặc sự kiện dòng họ
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {visible.map((event, index) => (
            <EventCard
              key={`${event.personId}-${event.type}-${event.eventDateLabel}`}
              event={event}
              index={index}
              onEditClanEvent={handleOpenEditModal}
            />
          ))}
        </div>
      )}

      {filtered.length > showCount && (
        <button
          onClick={() => setShowCount((count) => count + 20)}
          className="w-full py-3 text-sm font-semibold text-stone-500 transition-colors hover:text-amber-600"
        >
          Xem thêm {filtered.length - showCount} sự kiện...
        </button>
      )}

      <CustomEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        eventToEdit={editingCustomEvent}
      />
    </div>
  );
}
