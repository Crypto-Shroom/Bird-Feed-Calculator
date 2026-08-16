// Design contract: Modern Agrarian / Organic Tech — a calm, browseable botanical catalogue distinct from the calculator dashboard, using warm grain neutrals and deep greens.
import { ArrowLeft, Leaf } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { HerbCard } from "@/components/HerbCard";
import { HERBS_SUPPLEMENTS, type Herb } from "@/lib/data";

const categoryLabels: Record<Herb["category"], string> = {
  herb_seed: "Herb seeds",
  herb_spice: "Herbs & spices",
  herb_dried: "Dried herbs",
  liquid_supplement: "Liquid supplements",
  powder_supplement: "Powder supplements",
};

const categoryOrder: Herb["category"][] = ["herb_seed", "herb_spice", "herb_dried", "liquid_supplement", "powder_supplement"];

export default function HerbLibrary() {
  // Product-owner decision: do not surface apple cider vinegar in newly added app copy until its wording is explicitly approved.
  const herbEntries = Object.entries(HERBS_SUPPLEMENTS)
    .filter(([name]) => name !== "apple_cider_vinegar")
    .sort(([left], [right]) => left.localeCompare(right));

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-foreground">
      <header className="relative overflow-hidden bg-stone-950 text-white">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,132,94,0.48),transparent_43%),radial-gradient(circle_at_bottom_left,rgba(201,161,74,0.22),transparent_40%)]" />
        <div className="container relative py-12 sm:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />Back to calculator
          </Link>
          <Badge className="mt-8 border-none bg-emerald-700/95 px-3 py-1 text-sm text-white">Herb & supplement library</Badge>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">Browse the recorded collection</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">A separate reference page for the planner’s existing herb and supplement records. Dosage values are shown per 1 kg batch.</p>
        </div>
      </header>

      <main className="container py-10 sm:py-14">
        <section className="mb-12 grid gap-5 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm md:grid-cols-[auto_1fr] md:items-center">
          <div className="w-fit rounded-full bg-emerald-100 p-3"><Leaf className="h-6 w-6 text-emerald-800" /></div>
          <div>
            <h2 className="font-display text-2xl font-bold">Reference, not a calculator input</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">Use the calculator’s Herbs & Supplements tab for profile-based suggestions. This library keeps the full collection easy to browse without crowding the mix dashboard.</p>
          </div>
        </section>

        <div className="space-y-14">
          {categoryOrder.map((category) => {
            const herbs = herbEntries.filter(([, herb]) => herb.category === category);
            if (!herbs.length) return null;

            return (
              <section key={category} aria-labelledby={`herb-category-${category}`}>
                <div className="mb-5 flex items-end justify-between gap-4 border-b border-stone-200 pb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Collection</p>
                    <h2 id={`herb-category-${category}`} className="mt-1 font-display text-3xl font-bold text-stone-900">{categoryLabels[category]}</h2>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">{herbs.length} entries</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {herbs.map(([name, herb]) => <HerbCard key={name} name={name} herb={herb} showSources />)}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
