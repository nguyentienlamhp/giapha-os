import { DashboardProvider } from "@/components/DashboardContext";
import EventsList from "@/components/EventsList";
import MemberDetailModal from "@/components/MemberDetailModal";
import { getSupabase } from "@/utils/supabase/queries";

export const metadata = {
  title: "Sự kiện gia phả",
};

export default async function EventsPage() {
  const supabase = await getSupabase();

  const [personsRes, customEventsRes] = await Promise.all([
    supabase
      .from("persons")
      .select(
        "id, full_name, birth_year, birth_month, birth_day, death_year, death_month, death_day, death_lunar_year, death_lunar_month, death_lunar_day, is_deceased, avatar_url",
      ),
    supabase
      .from("custom_events")
      .select("id, name, event_type, content, event_date, location, created_by"),
  ]);

  const persons = personsRes.data || [];
  const customEvents = customEventsRes.data || [];

  return (
    <DashboardProvider>
      <div className="relative flex w-full flex-1 flex-col pb-12">
        <div className="relative z-20 mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="title">Sự kiện gia phả</h1>
          <p className="mt-1 text-sm text-stone-500">
            Sinh nhật, ngày giỗ và sự kiện dòng họ
          </p>
        </div>

        <main className="mx-auto flex-1 w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <EventsList persons={persons} customEvents={customEvents} />
        </main>
      </div>

      <MemberDetailModal />
    </DashboardProvider>
  );
}
