import { getTodayLunar } from "@/utils/dateHelpers";
import { computeEvents } from "@/utils/eventHelpers";
import { getIsAdmin, getSupabase } from "@/utils/supabase/queries";
import {
  ArrowRight,
  BarChart2,
  Cake,
  CalendarDays,
  Database,
  Flower2,
  GitMerge,
  Network,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

const eventTypeConfig = {
  birthday: {
    icon: Cake,
    label: "Sinh nhật",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  death_anniversary: {
    icon: Flower2,
    label: "Ngày giỗ",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  custom_event: {
    icon: Star,
    label: "Sự kiện",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  organized_event: {
    icon: CalendarDays,
    label: "Sự kiện tổ chức",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
} as const;

export default async function DashboardLaunchpad() {
  const isAdmin = await getIsAdmin();
  const supabase = await getSupabase();

  const { data: persons } = await supabase
    .from("persons")
    .select(
      "id, full_name, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased",
    );

  const { data: customEvents } = await supabase
    .from("custom_events")
    .select("id, name, event_type, content, event_date, location, created_by");

  const allEvents = computeEvents(persons ?? [], customEvents ?? []);
  const upcomingEvents = allEvents.filter(
    (event) => event.daysUntil >= 0 && event.daysUntil <= 30,
  );

  const lunar = getTodayLunar();
  const personCount = persons?.length ?? 0;
  const customEventCount = customEvents?.length ?? 0;

  const publicFeatures = [
    {
      title: "Cây gia phả",
      description: "Xem và tương tác với sơ đồ dòng họ theo giao diện trực quan.",
      icon: <Network className="size-8 text-amber-600" />,
      href: "/dashboard/members",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200/70",
      hoverColor: "hover:border-amber-300",
    },
    {
      title: "Tra cứu danh xưng",
      description: "Tra nhanh cách gọi họ hàng theo vai vế và quan hệ.",
      icon: <GitMerge className="size-8 text-sky-600" />,
      href: "/dashboard/kinship",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200/70",
      hoverColor: "hover:border-sky-300",
    },
    {
      title: "Thống kê gia phả",
      description: "Tổng hợp dữ liệu và các biểu đồ để quan sát nhanh toàn cảnh.",
      icon: <BarChart2 className="size-8 text-violet-600" />,
      href: "/dashboard/stats",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200/70",
      hoverColor: "hover:border-violet-300",
    },
  ];

  const adminFeatures = [
    {
      title: "Quản lý người dùng",
      description: "Phê duyệt, kích hoạt và phân quyền tài khoản thành viên.",
      icon: <Users className="size-8 text-rose-600" />,
      href: "/dashboard/users",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200/70",
      hoverColor: "hover:border-rose-300",
    },
    {
      title: "Thứ tự gia phả",
      description: "Sắp xếp cấu trúc dòng họ và điều chỉnh nhanh thứ tự nhánh.",
      icon: <Network className="size-8 text-indigo-600" />,
      href: "/dashboard/lineage",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200/70",
      hoverColor: "hover:border-indigo-300",
    },
    {
      title: "Sao lưu và phục hồi",
      description: "Xuất nhập dữ liệu toàn hệ thống để bảo toàn lịch sử.",
      icon: <Database className="size-8 text-teal-600" />,
      href: "/dashboard/data",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200/70",
      hoverColor: "hover:border-teal-300",
    },
  ];

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_28%),linear-gradient(180deg,_#fffaf0_0%,_#f8fafc_42%,_#f1f5f9_100%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(to_right,rgba(255,255,255,0.72)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.72)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />
      <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="absolute -right-20 top-32 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.93),rgba(255,248,235,0.88)_55%,rgba(240,249,255,0.88))] p-6 shadow-[0_24px_80px_-36px_rgba(120,53,15,0.45)] backdrop-blur xl:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.65)]" />
                Dashboard
              </div>
              <h1 className="max-w-2xl text-3xl font-serif font-bold tracking-tight text-stone-900 sm:text-4xl">
                Không gian điều hành gia phả có chiều sâu hơn, đẹp hơn và dễ quét nhanh hơn.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                Tổng quan hóa dữ liệu dòng họ, sự kiện sắp tới và các công cụ quản trị
                trong một bố cục mềm, ấm và rõ tầng lớp.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[32rem]">
              <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-[0_14px_34px_-24px_rgba(120,53,15,0.5)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Thành viên
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
                  {personCount}
                </p>
                <p className="mt-1 text-sm text-stone-500">Hồ sơ đang có</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Sắp diễn ra
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
                  {upcomingEvents.length}
                </p>
                <p className="mt-1 text-sm text-stone-500">Sự kiện trong 30 ngày</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-[0_14px_34px_-24px_rgba(14,116,144,0.45)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Sự kiện riêng
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
                  {customEventCount}
                </p>
                <p className="mt-1 text-sm text-stone-500">Mốc được tạo thủ công</p>
              </div>
            </div>
          </div>
        </section>

        <Link
          href="/dashboard/events"
          className="group relative block overflow-hidden rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(250,245,255,0.92)_48%,rgba(240,253,250,0.92))] shadow-[0_22px_70px_-34px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_90px_-36px_rgba(15,23,42,0.42)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.14),_transparent_30%)]" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-200/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-teal-200/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:gap-8">
            <div className="w-full md:w-[35%]">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.4)] backdrop-blur">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#b45309)] text-white shadow-lg shadow-amber-500/25 transition-transform duration-500 group-hover:scale-105">
                  <CalendarDays className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Hôm nay
                  </p>
                  <p className="text-sm font-semibold text-stone-700">
                    Dòng thời gian gia tộc
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[1.6rem] border border-white/70 bg-white/70 p-5 shadow-[0_16px_42px_-24px_rgba(120,53,15,0.4)] backdrop-blur">
                <p className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                  {lunar.solarStr}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/80 px-3.5 py-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                    Âm lịch
                  </span>
                  <span className="text-sm font-semibold text-stone-700">
                    {lunar.lunarDayStr}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-stone-500">
                  Năm {lunar.lunarYear}
                </p>
              </div>
            </div>

            <div className="w-full md:w-[65%] md:border-l md:border-white/60 md:pl-8">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                        <span className="relative flex size-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex size-2.5 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.65)]" />
                        </span>
                        Sự kiện 30 ngày tới
                      </p>
                      <p className="mt-2 text-lg font-bold text-stone-900">
                        Có {upcomingEvents.length} mốc quan trọng đang chờ phía trước
                      </p>
                    </div>
                    <div className="hidden items-center gap-2 rounded-full border border-stone-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-600 shadow-sm backdrop-blur sm:inline-flex">
                      Xem tất cả
                      <ArrowRight className="size-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-stone-900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {upcomingEvents.slice(0, 4).map((event, index) => {
                      const cfg = eventTypeConfig[event.type];
                      const Icon = cfg.icon;

                      return (
                        <div
                          key={index}
                          className="rounded-[1.4rem] border border-white/80 bg-white/70 p-4 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.35)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                        >
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${cfg.bg} border border-white shadow-sm`}
                            >
                              <Icon className={`size-4 ${cfg.color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-stone-800">
                                {event.personName}
                              </p>
                              <p className="mt-1 text-xs font-medium text-stone-500">
                                {cfg.label}
                              </p>
                              <p className="mt-2 text-xs font-medium text-stone-500">
                                {event.daysUntil === 0
                                  ? "Hôm nay"
                                  : event.daysUntil === 1
                                    ? "Ngày mai"
                                    : `${event.daysUntil} ngày nữa`}{" "}
                                · {event.eventDateLabel}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {upcomingEvents.length > 4 && (
                    <p className="pt-1 text-xs font-medium text-stone-500">
                      + {upcomingEvents.length - 4} sự kiện khác đang chờ bạn xem chi tiết.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 rounded-[1.6rem] border border-white/80 bg-white/60 px-6 py-10 text-center shadow-[0_14px_36px_-26px_rgba(15,23,42,0.32)] backdrop-blur">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 shadow-inner">
                    <CalendarDays className="size-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-stone-800">
                      Chưa có sự kiện nào trong 30 ngày tới
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      Vẫn có thể mở trang sự kiện để xem toàn bộ mốc theo năm.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2 text-sm font-semibold text-stone-600 shadow-sm transition-colors group-hover:text-stone-900">
                    <span>Xem sự kiện trong năm</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="space-y-12">
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Khám phá
                </p>
                <h2 className="mt-2 text-2xl font-serif font-bold text-stone-900">
                  Chức năng chung
                </h2>
              </div>
              <p className="hidden max-w-md text-right text-sm text-stone-500 md:block">
                Mỗi khu vực được tách nhấn bằng sắc độ riêng để bố cục dễ nhìn và dễ chạm hơn.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicFeatures.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className={`group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.8rem] border ${feature.borderColor} bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.82))] p-6 shadow-[0_18px_54px_-34px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-1.5 ${feature.hoverColor}`}
                >
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/60 blur-2xl" />
                  <div
                    className={`relative mb-5 flex size-16 items-center justify-center rounded-2xl ${feature.bgColor} border border-white/90 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:bg-white`}
                  >
                    {feature.icon}
                  </div>
                  <div className="relative flex flex-1 flex-col">
                    <h4 className="mb-2 text-lg font-bold text-stone-900 transition-colors group-hover:text-stone-950">
                      {feature.title}
                    </h4>
                    <p className="text-sm leading-6 text-stone-600">
                      {feature.description}
                    </p>
                    <div className="mt-auto pt-6 text-sm font-semibold text-stone-500 transition-colors group-hover:text-stone-800">
                      Mở khu vực
                      <ArrowRight className="ml-2 inline size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {isAdmin && (
            <section className="rounded-[2rem] border border-rose-200/60 bg-[linear-gradient(135deg,rgba(255,251,251,0.92),rgba(255,241,242,0.92)_52%,rgba(255,247,237,0.88))] p-6 shadow-[0_22px_66px_-38px_rgba(159,18,57,0.35)] sm:p-7">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                    Quản trị
                  </p>
                  <h3 className="mt-2 text-2xl font-serif font-bold text-rose-950">
                    Khu vực quản trị viên
                  </h3>
                </div>
                <p className="hidden max-w-md text-right text-sm text-rose-700/75 md:block">
                  Các tác vụ nhạy cảm được tách riêng bằng tông màu đậm hơn để nhận rõ mức độ quan trọng.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {adminFeatures.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className={`group relative flex min-h-[220px] flex-col overflow-hidden rounded-[1.8rem] border ${feature.borderColor} bg-white/80 p-6 shadow-[0_18px_54px_-34px_rgba(159,18,57,0.3)] transition-all duration-300 hover:-translate-y-1.5 ${feature.hoverColor}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(244,63,94,0.92),rgba(249,115,22,0.74),rgba(99,102,241,0.74))]" />
                    <div
                      className={`mb-5 flex size-16 items-center justify-center rounded-2xl ${feature.bgColor} border border-white/90 shadow-[0_12px_30px_-18px_rgba(159,18,57,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:bg-white`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h4 className="mb-2 text-lg font-bold text-stone-900">
                        {feature.title}
                      </h4>
                      <p className="text-sm leading-6 text-stone-600">
                        {feature.description}
                      </p>
                      <div className="mt-auto pt-6 text-sm font-semibold text-rose-700 transition-colors group-hover:text-rose-900">
                        Truy cập nhanh
                        <ArrowRight className="ml-2 inline size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
