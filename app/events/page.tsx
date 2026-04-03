import Footer from "@/components/Footer";
import PublicEventsBrowser from "@/components/PublicEventsBrowser";
import PublicEventsShowcase from "@/components/PublicEventsShowcase";
import { getTodayLunar } from "@/utils/dateHelpers";
import { computeEvents } from "@/utils/eventHelpers";
import { getSupabase } from "@/utils/supabase/queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sự kiện gia tộc",
};

export default async function PublicEventsPage() {
  const supabase = await getSupabase();

  const [personsRes, customEventsRes] = await Promise.all([
    supabase
      .from("persons")
      .select(
        "id, full_name, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased",
      ),
    supabase
      .from("custom_events")
      .select("id, name, event_type, content, event_date, location, created_by"),
  ]);

  const events = computeEvents(
    personsRes.data ?? [],
    customEventsRes.data ?? [],
  ).filter((event) => event.daysUntil >= 0 && event.daysUntil <= 180);
  const publicEvents = events.filter((event) => event.type !== "custom_event");

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f6f1e8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,rgba(255,251,235,0.86),rgba(248,250,252,0.94))]" />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-stone-900"
            >
              <ArrowLeft className="size-4" />
              Quay lại trang chủ
            </Link>
            <h1 className="mt-4 text-4xl font-serif font-bold tracking-tight text-stone-950">
              Sự kiện gia tộc
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-stone-600">
              Xem nhanh sinh nhật, ngày giỗ và thông báo giỗ họ mà không cần đăng nhập.
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-stone-700">
              {publicEvents.length} sự kiện sắp tới trong 180 ngày
            </p>
          </div>
        </div>

        <PublicEventsShowcase
          lunar={getTodayLunar()}
          upcomingEvents={publicEvents.slice(0, 8)}
        />

        <PublicEventsBrowser events={events} />
      </main>

      <Footer className="relative z-10 border-none bg-transparent" />
    </div>
  );
}
