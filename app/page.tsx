import Footer from "@/components/Footer";
import LandingHero from "@/components/LandingHero";
import { getTodayLunar } from "@/utils/dateHelpers";
import { computeEvents } from "@/utils/eventHelpers";
import { getSupabase } from "@/utils/supabase/queries";
import config from "./config";

export default async function HomePage() {
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

  const persons = personsRes.data ?? [];
  const customEvents = customEventsRes.data ?? [];
  const allEvents = computeEvents(persons, customEvents);
  const upcomingEvents = allEvents
    .filter((event) => event.daysUntil >= 0 && event.daysUntil <= 60)
    .slice(0, 6);
  const lunar = getTodayLunar();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f6f1e8] selection:bg-amber-200 selection:text-amber-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(120,113,108,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,113,108,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_900px_at_20%_-10%,rgba(251,191,36,0.24),transparent),radial-gradient(circle_800px_at_100%_0%,rgba(125,211,252,0.18),transparent),linear-gradient(180deg,rgba(255,251,235,0.8),rgba(248,250,252,0.95))]" />
      <div className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-amber-200/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full bg-sky-200/20 blur-[130px]" />

      <main className="relative z-10 flex-1 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <LandingHero
          siteName={config.siteName}
          lunar={lunar}
          upcomingEvents={upcomingEvents}
          totalMembers={persons.length}
          totalCustomEvents={customEvents.length}
        />
      </main>

      <Footer className="relative z-10 border-none bg-transparent" />
    </div>
  );
}
