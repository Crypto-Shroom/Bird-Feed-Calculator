// Design contract: Modern Agrarian / Organic Tech — a gentle, transparent guided-browsing panel that keeps user choices clear without implying medical calculation.
import { useMemo, useState } from "react";
import { Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HERBS_SUPPLEMENTS } from "@/lib/data";
import { isHerbEligibleForBird } from "@/lib/herb-evidence";
import type { BirdType } from "@/lib/birds";

const supplementGoals = [
  { value: "digestion", label: "Digestive comfort", benefit: "Digestion" },
  { value: "respiratory", label: "Respiratory comfort", benefit: "Respiratory" },
  { value: "feathers", label: "Feather condition", benefit: "Feather health" },
  { value: "resilience", label: "Everyday resilience", benefit: "Immunity" },
] as const;

const supplementFormats = [
  { value: "all", label: "Any recorded form", categories: null },
  { value: "seed_spice", label: "Seeds & spices", categories: ["herb_seed", "herb_spice"] },
  { value: "dried", label: "Dried herbs", categories: ["herb_dried"] },
  { value: "supplement", label: "Liquid & powder supplements", categories: ["liquid_supplement", "powder_supplement"] },
] as const;

export function PersonalizedSupplementMix({ bird }: { bird: BirdType }) {
  const [supplementGoal, setSupplementGoal] = useState<(typeof supplementGoals)[number]["value"]>("digestion");
  const [supplementFormat, setSupplementFormat] = useState<(typeof supplementFormats)[number]["value"]>("all");

  const goal = supplementGoals.find((entry) => entry.value === supplementGoal)!;
  const format = supplementFormats.find((entry) => entry.value === supplementFormat)!;
  const matches = useMemo(() => Object.entries(HERBS_SUPPLEMENTS)
    // Product-owner decision: do not surface apple cider vinegar in newly added app copy until its wording is explicitly approved.
    .filter(([name]) => name !== "apple_cider_vinegar")
    .filter(([name]) => isHerbEligibleForBird(name, bird))
    .filter(([, herb]) => herb.benefits.includes(goal.benefit))
    .filter(([, herb]) => !format.categories || (format.categories as readonly string[]).includes(herb.category))
    .sort(([left], [right]) => left.localeCompare(right)), [bird, format, goal]);

  return (
    <section aria-labelledby="personalized-supplement-heading" className="border-t border-emerald-100 pt-8">
      <div className="flex gap-4">
        <div className="rounded-full bg-amber-100 p-3"><Leaf className="h-6 w-6 text-amber-800" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">Guided browsing</p>
          <h2 id="personalized-supplement-heading" className="mt-1 text-xl font-bold">Personalized Supplement Mix</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Choose a focus and format to narrow the existing records. This does not calculate a combined dose, change the profile suggestions, or alter any herb data.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-xl border border-amber-100 bg-amber-50/60 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="supplement-goal" className="text-sm font-medium text-foreground">What would you like to focus on?</label>
          <Select value={supplementGoal} onValueChange={(value) => setSupplementGoal(value as (typeof supplementGoals)[number]["value"])}>
            <SelectTrigger id="supplement-goal" className="bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>{supplementGoals.map((entry) => <SelectItem key={entry.value} value={entry.value}>{entry.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="supplement-format" className="text-sm font-medium text-foreground">Which form would you like to browse?</label>
          <Select value={supplementFormat} onValueChange={(value) => setSupplementFormat(value as (typeof supplementFormats)[number]["value"])}>
            <SelectTrigger id="supplement-format" className="bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>{supplementFormats.map((entry) => <SelectItem key={entry.value} value={entry.value}>{entry.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="font-display text-2xl font-bold">Records matching {goal.label.toLowerCase()}</h3>
            <p className="mt-1 text-sm text-muted-foreground">These entries list “{goal.benefit}” in their existing recorded benefits.</p>
          </div>
          <span className="font-mono text-sm text-muted-foreground">{matches.length} matches</span>
        </div>
        {matches.length ? <div className="mt-4 grid gap-4 md:grid-cols-2">{matches.map(([name, herb]) => <Card key={name} className="border-amber-100"><CardContent className="p-5"><h4 className="text-lg font-bold capitalize">{name.replace(/_/g, " ")}</h4><div className="mt-3 flex flex-wrap gap-2">{herb.benefits.map((benefit) => <Badge key={benefit} variant="secondary" className="bg-amber-100 text-amber-950 hover:bg-amber-200">{benefit}</Badge>)}</div><dl className="mt-4 space-y-2 text-sm"><div><dt className="font-medium">Dosage per 1 kg batch</dt><dd className="text-muted-foreground">{herb.dosage_per_kg}</dd></div><div><dt className="font-medium">Notes</dt><dd className="text-muted-foreground">{herb.notes}</dd></div></dl></CardContent></Card>)}</div> : <p className="mt-4 rounded-lg border border-dashed bg-white p-6 text-sm text-muted-foreground">No existing records match both selections. Try another form to browse the recorded collection.</p>}
      </div>
    </section>
  );
}
