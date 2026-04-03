"use client";

import nhanThoHo from "@/app/images/nhanthoho.png";
import { FamilyEvent } from "@/utils/eventHelpers";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CalendarHeart,
  Gift,
  Network,
  Search,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

interface LandingHeroProps {
  siteName: string;
  lunar: {
    solarStr: string;
    lunarDayStr: string;
    lunarYear: string;
  };
  upcomingEvents: FamilyEvent[];
  totalMembers: number;
  totalCustomEvents: number;
}

const eventTone = {
  birthday: {
    icon: Gift,
    label: "Sinh nhật",
    tone: "bg-amber-50 text-amber-700 border-amber-200/70",
  },
  death_anniversary: {
    icon: Sprout,
    label: "Ngày giỗ",
    tone: "bg-stone-100 text-stone-700 border-stone-200/70",
  },
  custom_event: {
    icon: CalendarDays,
    label: "Sự kiện",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  },
  organized_event: {
    icon: CalendarHeart,
    label: "Sự kiện dòng họ",
    tone: "bg-amber-50 text-amber-700 border-amber-200/70",
  },
} as const;

function daysLabel(daysUntil: number) {
  if (daysUntil === 0) return "Hôm nay";
  if (daysUntil === 1) return "Ngày mai";
  return `${daysUntil} ngày nữa`;
}

export default function LandingHero({
  siteName,
  lunar,
  upcomingEvents,
  totalMembers,
  totalCustomEvents,
}: LandingHeroProps) {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-7xl flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.section
        variants={fadeIn}
        className="overflow-hidden rounded-[2.5rem] border border-[#d8c8ab] bg-[linear-gradient(180deg,rgba(255,250,240,0.98),rgba(250,244,232,0.96))] shadow-[0_40px_120px_-54px_rgba(68,40,18,0.45)]"
      >
        <div className="space-y-0">
          <div className="relative border-b border-[#ddceb4] p-5 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,83,9,0.08),transparent_28%),linear-gradient(180deg,rgba(120,53,15,0.04),transparent)]" />

            <div className="relative space-y-5">
              <div className="inline-flex items-center rounded-full border border-[#d6c2a0] bg-white/70 px-4 py-2 text-sm font-semibold tracking-[0.24em] text-[#8a5a1f]">
                TỪ ĐƯỜNG HỌ
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#d7c6a8] bg-[#f8f0e2] p-2 shadow-[0_24px_60px_-36px_rgba(68,40,18,0.35)]">
                <Image
                  src={nhanThoHo}
                  alt="Nhà thờ họ"
                  className="h-[260px] w-full rounded-[1.5rem] object-cover sm:h-[340px] lg:h-[430px]"
                  priority
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#dcccae] bg-white/75 px-4 py-3 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Thành viên
                  </p>
                  <p className="mt-2 text-2xl font-bold text-stone-900">
                    {totalMembers}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#dcccae] bg-white/75 px-4 py-3 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Sự kiện
                  </p>
                  <p className="mt-2 text-2xl font-bold text-stone-900">
                    {upcomingEvents.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#dcccae] bg-white/75 px-4 py-3 text-center shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Mốc riêng
                  </p>
                  <p className="mt-2 text-2xl font-bold text-stone-900">
                    {totalCustomEvents}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_24%)]" />

            <div className="relative flex h-full flex-col gap-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a5a1f]">
                  Gia phả dòng họ
                </p>
                <h1 className="max-w-5xl text-4xl font-serif font-bold leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
                  {siteName}
                </h1>
                <p className="max-w-4xl text-xl font-medium text-stone-700 sm:text-2xl">
                  Xem gia phả. Xem sự kiện. Tra cứu danh xưng.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/family-tree"
                  className="group rounded-[1.8rem] border border-[#d8c7ab] bg-white/82 p-5 shadow-[0_18px_38px_-28px_rgba(68,40,18,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <Network className="mb-4 size-6 text-[#8a5a1f]" />
                  <p className="text-lg font-bold text-stone-900">Gia phả</p>
                  <p className="mt-2 text-sm text-stone-500">Danh sách và sơ đồ cây</p>
                  <div className="mt-4 text-sm font-semibold text-[#8a5a1f]">
                    Mở xem
                    <ArrowRight className="ml-2 inline size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href="/events"
                  className="group rounded-[1.8rem] border border-[#d8c7ab] bg-white/82 p-5 shadow-[0_18px_38px_-28px_rgba(68,40,18,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <CalendarDays className="mb-4 size-6 text-[#8a5a1f]" />
                  <p className="text-lg font-bold text-stone-900">Sự kiện</p>
                  <p className="mt-2 text-sm text-stone-500">Lịch chung của dòng họ</p>
                  <div className="mt-4 text-sm font-semibold text-[#8a5a1f]">
                    Mở xem
                    <ArrowRight className="ml-2 inline size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                <Link
                  href="/kinship"
                  className="group rounded-[1.8rem] border border-[#d8c7ab] bg-white/82 p-5 shadow-[0_18px_38px_-28px_rgba(68,40,18,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  <Search className="mb-4 size-6 text-[#8a5a1f]" />
                  <p className="text-lg font-bold text-stone-900">Danh xưng</p>
                  <p className="mt-2 text-sm text-stone-500">Tra cứu cách gọi</p>
                  <div className="mt-4 text-sm font-semibold text-[#8a5a1f]">
                    Mở xem
                    <ArrowRight className="ml-2 inline size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>

              <div className="rounded-[2rem] border border-[#d8c7ab] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(250,244,232,0.95))] p-5 shadow-[0_22px_50px_-34px_rgba(68,40,18,0.3)]">
                <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[1.7rem] border border-[#ded1ba] bg-white/80 p-5">
                    <div className="mb-4 inline-flex items-center gap-3 rounded-[1.3rem] border border-[#e5d8c1] bg-[#fbf6ee] px-4 py-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#a16207,#7c2d12)] text-white">
                        <CalendarDays className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Hôm nay
                        </p>
                        <p className="text-base font-semibold text-stone-800">
                          Dòng thời gian gia tộc
                        </p>
                      </div>
                    </div>

                    <p className="text-3xl font-bold leading-tight text-stone-950">
                      {lunar.solarStr}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e0c78f] bg-[#fff4d9] px-3.5 py-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a650f]">
                        Âm lịch
                      </span>
                      <span className="text-sm font-semibold text-stone-700">
                        {lunar.lunarDayStr}
                      </span>
                    </div>
                    <p className="mt-3 text-base text-stone-500">
                      Năm {lunar.lunarYear}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                          Sự kiện sắp tới
                        </p>
                        <p className="mt-2 text-2xl font-bold text-stone-950">
                          {upcomingEvents.length} mốc quan trọng
                        </p>
                      </div>
                      <Link
                        href="/events"
                        className="hidden rounded-full border border-[#d8c7ab] bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:-translate-y-0.5 sm:inline-flex"
                      >
                        Xem tất cả
                      </Link>
                    </div>

                    <div className="grid gap-3">
                      {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event, index) => {
                          const meta = eventTone[event.type];
                          const Icon = meta.icon;

                          return (
                            <article
                              key={`${event.personId}-${index}`}
                              className="rounded-[1.5rem] border border-[#e3d8c4] bg-white/82 p-4 shadow-[0_18px_34px_-28px_rgba(68,40,18,0.24)]"
                            >
                              <div className="flex items-start gap-3.5">
                                <div
                                  className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${meta.tone}`}
                                >
                                  <Icon className="size-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-lg font-bold text-stone-900">
                                    {event.personName}
                                  </p>
                                  <p className="mt-1 text-sm text-stone-500">
                                    {meta.label}
                                  </p>
                                  <p className="mt-2 text-sm font-medium text-stone-600">
                                    {daysLabel(event.daysUntil)} · {event.eventDateLabel}
                                  </p>
                                </div>
                              </div>
                            </article>
                          );
                        })
                      ) : (
                        <div className="rounded-[1.5rem] border border-dashed border-[#d8c7ab] bg-white/70 p-6 text-center">
                          <p className="font-semibold text-stone-800">
                            Chưa có sự kiện sắp tới
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/family-tree"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#d6c2a0] bg-[#6b3f1f] px-6 py-4 text-lg font-bold text-white shadow-[0_24px_50px_-26px_rgba(68,40,18,0.7)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#5a3418]"
                >
                  Vào xem gia phả
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#d8c7ab] bg-white/82 px-6 py-4 text-lg font-bold text-stone-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  Đăng nhập quản trị
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
