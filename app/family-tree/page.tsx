import Footer from "@/components/Footer";
import { DashboardProvider } from "@/components/DashboardContext";
import DashboardViews from "@/components/DashboardViews";
import ViewToggle, { ViewMode } from "@/components/ViewToggle";
import { getSupabase } from "@/utils/supabase/queries";
import { ArrowLeft, Network, Users } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ view?: string; rootId?: string; avatar?: string }>;
}

export const metadata = {
  title: "Gia phả công khai",
};

export default async function PublicFamilyTreePage({ searchParams }: PageProps) {
  const { view, rootId, avatar } = await searchParams;
  const initialView = view as ViewMode | undefined;
  const initialShowAvatar = avatar !== "hide";

  const supabase = await getSupabase();
  const [personsRes, relsRes] = await Promise.all([
    supabase
      .from("persons")
      .select("*")
      .order("birth_year", { ascending: true, nullsFirst: false }),
    supabase.from("relationships").select("*"),
  ]);

  const persons = personsRes.data ?? [];
  const relationships = relsRes.data ?? [];

  const personsMap = new Map();
  persons.forEach((person) => personsMap.set(person.id, person));

  const childIds = new Set(
    relationships
      .filter(
        (relationship) =>
          relationship.type === "biological_child" ||
          relationship.type === "adopted_child",
      )
      .map((relationship) => relationship.person_b),
  );

  let finalRootId = rootId;
  if (!finalRootId || !personsMap.has(finalRootId)) {
    const rootsFallback = persons.filter((person) => !childIds.has(person.id));
    if (rootsFallback.length > 0) {
      finalRootId = rootsFallback[0].id;
    } else if (persons.length > 0) {
      finalRootId = persons[0].id;
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f3efe7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_20%),linear-gradient(180deg,rgba(255,251,235,0.9),rgba(248,250,252,0.94))]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-stone-900"
            >
              <ArrowLeft className="size-4" />
              Quay lại trang chủ
            </Link>

            <h1 className="mt-4 text-4xl font-serif font-bold tracking-tight text-stone-950">
              Gia phả công khai
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-stone-600">
              Khám phá cấu trúc dòng họ theo nhiều cách nhìn: danh sách, sơ đồ cây,
              mindmap hoặc bong bóng, ngay ngoài khu đăng nhập.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Thành viên
              </p>
              <p className="mt-1 text-2xl font-bold text-stone-900">
                {persons.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Quan hệ
              </p>
              <p className="mt-1 text-2xl font-bold text-stone-900">
                {relationships.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.25)]">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <Users className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  Chỉ xem công khai
                </p>
                <p className="text-sm text-stone-500">
                  Phần hiển thị mở ra ngoài, còn chỉnh sửa vẫn nằm trong khu quản trị.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/72 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.3)] backdrop-blur">
          <DashboardProvider
            initialView={initialView}
            initialRootId={finalRootId}
            initialShowAvatar={initialShowAvatar}
          >
            <div className="border-b border-stone-200/70 bg-white/76 px-4 py-6 sm:px-6">
              <div className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.18)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                      <Network className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Đa chế độ hiển thị
                      </p>
                      <p className="text-sm text-stone-500">
                        Chuyển nhanh giữa danh sách, sơ đồ cây, mindmap và bong bóng.
                      </p>
                    </div>
                  </div>
                  <ViewToggle />
                </div>
              </div>
            </div>
            <DashboardViews
              persons={persons}
              relationships={relationships}
              canEdit={false}
            />
          </DashboardProvider>
        </div>
      </div>

      <Footer className="relative z-10 border-none bg-transparent" />
    </div>
  );
}
