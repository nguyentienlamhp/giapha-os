import Footer from "@/components/Footer";
import KinshipFinder from "@/components/KinshipFinder";
import { getSupabase } from "@/utils/supabase/queries";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tra cứu danh xưng",
};

export default async function PublicKinshipPage() {
  const supabase = await getSupabase();

  const { data: persons } = await supabase
    .from("persons")
    .select(
      "id, full_name, gender, birth_year, birth_order, generation, is_in_law, avatar_url",
    )
    .order("birth_year", { ascending: true, nullsFirst: false });

  const { data: relationships } = await supabase
    .from("relationships")
    .select("type, person_a, person_b");

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5efe8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_22%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_20%),linear-gradient(180deg,rgba(255,251,235,0.88),rgba(248,250,252,0.96))]" />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft className="size-4" />
            Quay lại trang chủ
          </Link>

          <div className="mt-6 rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.25)]">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Search className="size-5" />
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold tracking-tight text-stone-950">
                  Tra cứu danh xưng
                </h1>
                <p className="mt-2 max-w-2xl text-base leading-7 text-stone-600">
                  Chọn hai thành viên bất kỳ để hệ thống tự động tính cách gọi theo
                  quan hệ nội ngoại, thế hệ và thứ bậc trong gia phả.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/78 p-2 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.3)] backdrop-blur sm:p-4">
          <KinshipFinder
            persons={persons ?? []}
            relationships={relationships ?? []}
          />
        </div>
      </main>

      <Footer className="relative z-10 border-none bg-transparent" />
    </div>
  );
}
