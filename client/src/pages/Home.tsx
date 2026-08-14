// Design contract: a warm, editorial feed-workshop interface that communicates scope and safety clearly without overstating nutrition precision.
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bird,
  CheckCircle2,
  Download,
  Droplets,
  Info,
  Leaf,
  Plus,
  Scale,
  Search,
  Trash2,
  Wheat,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HERB_RECOMMENDATIONS, HERBS_SUPPLEMENTS, INGREDIENTS } from "@/lib/data";
import { checkBirdToxicity, isIngredientCompatible } from "@/lib/bird-safety";
import {
  BIRD_CARE,
  BIRD_PROFILES,
  BIRD_TYPES,
  getAvailableSituations,
  getCategoryTargets,
  type BirdType,
} from "@/lib/birds";
import { MultibirMixCalculator, type MixResult } from "@/lib/calculator-multi-bird";
import { getPreparationInstructions, getProcessingWarning, isToxicRaw } from "@/lib/safety";
import { cn } from "@/lib/utils";

const defaultInventory: Record<string, number> = {
  wheat: 5000,
  corn_yellow: 3000,
  peas: 2000,
  lentils: 1000,
  safflower: 500,
  barley: 2000,
};

type NutrientKey = "protein" | "carbs" | "fat" | "fiber";

export default function Home() {
  const [selectedBird, setSelectedBird] = useState<BirdType>("pigeon");
  const [situation, setSituation] = useState("maintenance");
  const [targetWeight, setTargetWeight] = useState(1000);
  const [inventory, setInventory] = useState<Record<string, number>>(defaultInventory);
  const [result, setResult] = useState<MixResult | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const availableSituations = useMemo(() => getAvailableSituations(selectedBird), [selectedBird]);
  const birdProfile = BIRD_PROFILES[selectedBird];
  const currentProfile = birdProfile.profiles[situation] || birdProfile.profiles[availableSituations[0]];
  const care = BIRD_CARE[selectedBird];
  const herbRecommendation = useMemo(() => {
    const recommendation = HERB_RECOMMENDATIONS[situation];
    if (!recommendation) return null;
    return {
      notes: recommendation.notes,
      herbs: recommendation.recommended
        .map((name) => ({ name, herb: HERBS_SUPPLEMENTS[name] }))
        .filter((entry): entry is { name: string; herb: NonNullable<typeof entry.herb> } => Boolean(entry.herb)),
    };
  }, [situation]);

  useEffect(() => {
    if (!availableSituations.includes(situation)) setSituation(availableSituations[0]);
  }, [availableSituations, situation]);

  useEffect(() => {
    const calculator = new MultibirMixCalculator(inventory, selectedBird, situation);
    setResult(calculator.calculate(targetWeight));
  }, [inventory, selectedBird, situation, targetWeight]);

  const ingredientOptions = useMemo(() => {
    const query = ingredientSearch.trim().toLowerCase();
    return Object.keys(INGREDIENTS)
      .filter((name) => !inventory[name])
      .filter((name) => !query || name.replace(/_/g, " ").includes(query))
      .sort()
      .reduce<{ available: string[]; blocked: Array<{ name: string; reason: string; severity: "critical" | "review" }> }>((groups, name) => {
        const rawSafety = isToxicRaw(name);
        const speciesToxicity = checkBirdToxicity(name, selectedBird);
        const processingWarning = getProcessingWarning(name);
        if (isIngredientCompatible(name, selectedBird) && !rawSafety && !speciesToxicity && !processingWarning) {
          groups.available.push(name);
        } else {
          groups.blocked.push({
            name,
            reason: speciesToxicity?.description || rawSafety?.message || processingWarning || `Not compatible with ${birdProfile.name}.`,
            severity: rawSafety || speciesToxicity ? "critical" : "review",
          });
        }
        return groups;
      }, { available: [], blocked: [] });
  }, [birdProfile.name, ingredientSearch, inventory, selectedBird]);

  const addIngredient = (name: string) => {
    setInventory((previous) => ({ ...previous, [name]: 1000 }));
    setIngredientSearch("");
    setAddOpen(false);
  };

  const updateAmount = (name: string, amount: number) => {
    setInventory((previous) => ({ ...previous, [name]: Number.isFinite(amount) ? Math.max(0, amount) : 0 }));
  };

  const removeIngredient = (name: string) => {
    setInventory((previous) => {
      const updated = { ...previous };
      delete updated[name];
      return updated;
    });
  };

  const exportRecipe = () => {
    if (!result || !Object.keys(result.mix).length) return;
    const lines = [
      `${birdProfile.name} — ${currentProfile.name}`,
      `Batch estimate: ${Math.round(result.targetWeight)}g`,
      "",
      "FORMULA",
      ...Object.entries(result.mix)
        .sort(([, a], [, b]) => b - a)
        .map(([name, amount]) => `${name.replace(/_/g, " ")}: ${Math.round(amount)}g`),
      "",
      "ESTIMATED NUTRITION",
      `Protein: ${result.nutrition.protein.toFixed(1)}%`,
      `Carbohydrates: ${result.nutrition.carbs.toFixed(1)}%`,
      `Fat: ${result.nutrition.fat.toFixed(1)}%`,
      `Fiber: ${result.nutrition.fiber.toFixed(1)}%`,
      "",
      "SAFETY SCOPE",
      care.scope,
      care.baseDiet,
      ...result.warnings.map((warning) => `${warning.level}: ${warning.message}`),
    ];
    const file = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${selectedBird}-${situation}-mix.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="relative h-[360px] overflow-hidden">
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663234243499/zvVSfnDuxBzqyTwR.png"
          alt="Mixed grains and seeds"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-950/65" />
        <div className="container relative flex h-full flex-col justify-center text-white">
          <Badge className="mb-4 w-fit border-none bg-emerald-700/95 px-3 py-1 text-sm text-white">v3.0 Multi-Bird Calculator</Badge>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">Precision Nutrition <br />for All Birds</h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">Scientifically optimized seed mixes for pigeons, parrots, budgies, canaries, and more.</p>
        </div>
      </header>

      <main className="container relative z-10 -mt-14 pb-16">
        <section aria-labelledby="bird-selector-heading" className="mb-8 rounded-xl border bg-card p-5 shadow-lg">
          <h2 id="bird-selector-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Choose a bird</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {BIRD_TYPES.map((bird) => {
              const profile = BIRD_PROFILES[bird];
              const selected = bird === selectedBird;
              return (
                <button
                  key={bird}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedBird(bird)}
                  className={cn(
                    "rounded-lg border-2 p-4 text-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/50",
                  )}
                >
                  <span aria-hidden="true" className="mb-2 block text-2xl">{profile.icon}</span>
                  {profile.name}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-5">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl"><Bird className="h-6 w-6 text-primary" />{birdProfile.name} profile</CardTitle>
                <CardDescription>Configure your {birdProfile.name.toLowerCase()}'s current situation to get optimized targets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="situation" className="text-sm font-medium text-muted-foreground">Current situation</label>
                  <Select value={situation} onValueChange={setSituation}>
                    <SelectTrigger id="situation" className="h-12 text-base"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availableSituations.map((value) => (
                        <SelectItem key={value} value={value}>{birdProfile.profiles[value].name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">{currentProfile.feedingNotes}</p>
                    {currentProfile.contextNote && <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">{currentProfile.contextNote}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="batch-size" className="text-sm font-medium text-muted-foreground">Target batch size</label>
                    <span className="font-mono font-bold">{targetWeight}g</span>
                  </div>
                  <Slider id="batch-size" value={[targetWeight]} min={500} max={10000} step={100} onValueChange={(values) => setTargetWeight(values[0])} className="py-4" />
                </div>

                <Separator />
                <div className="space-y-4 text-sm">
                  <CareNote icon={<Droplets className="h-5 w-5 text-blue-600" />} title="Water" text="Always provide clean, fresh water available at all times." />
                  <CareNote icon={<Scale className="h-5 w-5 text-amber-700" />} title="Grit" text={care.grit} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2"><Wheat className="h-5 w-5" />Your inventory</CardTitle>
                <CardDescription>Enter the available amount of each ingredient in grams. Unsafe or incompatible ingredients are not offered for this bird.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Popover open={addOpen} onOpenChange={setAddOpen}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-start gap-2"><Plus className="h-4 w-4" />Add compatible ingredient</Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[min(92vw,380px)] p-3">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input autoFocus value={ingredientSearch} onChange={(event) => setIngredientSearch(event.target.value)} placeholder="Search compatible ingredients" className="pl-9" />
                    </div>
                    <ScrollArea className="h-72 pr-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">Compatible choices</p>
                      {ingredientOptions.available.length ? ingredientOptions.available.map((name) => (
                        <button key={name} type="button" onClick={() => addIngredient(name)} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <span className="capitalize">{name.replace(/_/g, " ")}</span><Plus className="h-4 w-4 text-emerald-700" />
                        </button>
                      )) : <p className="px-2 py-3 text-sm text-muted-foreground">No compatible ingredients match this search.</p>}
                      {ingredientOptions.blocked.length > 0 && <>
                        <Separator className="my-3" />
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Not offered for this bird</p>
                        {ingredientOptions.blocked.map(({ name, reason, severity }) => (
                          <div key={name} className={cn("mb-1 rounded-md px-2 py-2 text-sm", severity === "critical" ? "border border-red-200 bg-red-50 text-red-950" : "bg-amber-50 text-amber-950")}><p className="capitalize line-through">{name.replace(/_/g, " ")}</p><p className="mt-0.5 text-xs">{reason}</p></div>
                        ))}
                      </>}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>

                <div className="space-y-3">
                  {Object.entries(inventory).map(([name, amount]) => {
                    const rawSafety = isToxicRaw(name);
                    const speciesToxicity = checkBirdToxicity(name, selectedBird);
                    const processingWarning = getProcessingWarning(name);
                    const hasConcern = Boolean(rawSafety || speciesToxicity || processingWarning || !isIngredientCompatible(name, selectedBird));
                    const preparation = getPreparationInstructions(name)?.preparation;
                    return (
                      <div key={name} className={cn("group rounded-lg border p-3", hasConcern ? "border-red-300 bg-red-50" : "bg-card")}>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div>
                            <label htmlFor={`amount-${name}`} className="text-sm font-medium capitalize">{name.replace(/_/g, " ")}{preparation && <span className="ml-1 text-xs font-normal text-muted-foreground">(Preparation: {preparation})</span>}</label>
                          </div>
                          <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${name.replace(/_/g, " ")}`} onClick={() => removeIngredient(name)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        {hasConcern && <p className="mb-2 rounded bg-red-100 p-2 text-xs font-medium text-red-900">Excluded from the formula: {speciesToxicity?.description || rawSafety?.message || processingWarning || `not compatible with ${birdProfile.name}`}.</p>}
                        <Input id={`amount-${name}`} type="number" min="0" value={amount} onChange={(event) => updateAmount(name, Number(event.target.value))} aria-label={`${name.replace(/_/g, " ")} amount in grams`} />
                      </div>
                    );
                  })}
                  {!Object.keys(inventory).length && <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">Add compatible ingredients to create a batch estimate.</p>}
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="lg:col-span-7" aria-live="polite">
            {result && <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <NutritionCard label="Protein" value={result.nutrition.protein} target={currentProfile.nutrition.protein} color="bg-[var(--chart-1)]" />
                <NutritionCard label="Carbs" value={result.nutrition.carbs} target={currentProfile.nutrition.carbs} color="bg-[var(--chart-2)]" />
                <NutritionCard label="Fat" value={result.nutrition.fat} target={currentProfile.nutrition.fat} color="bg-[var(--chart-3)]" />
                <NutritionCard label="Fiber" value={result.nutrition.fiber} target={currentProfile.nutrition.fiber} color="bg-[var(--chart-4)]" />
              </div>

              <Card className="overflow-hidden border-none shadow-xl">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="border-b bg-muted/30 p-2">
                    <TabsList className="grid h-auto w-full grid-cols-3 bg-transparent">
                      <TabsTrigger value="calculator">Optimized Mix</TabsTrigger>
                      <TabsTrigger value="herbs">Herbs & Supplements</TabsTrigger>
                      <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>

                <CardContent className="min-h-[520px] p-6">
                  {activeTab === "calculator" && <div className="space-y-6">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div><h2 className="text-xl font-bold">Recommended Formula</h2></div>
                      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={exportRecipe} disabled={!Object.keys(result.mix).length}><Download className="h-4 w-4" />Export recipe</Button>
                    </div>

                    {result.warnings.length > 0 && <div className="space-y-2">{result.warnings.map((warning, index) => <Alert key={`${warning.message}-${index}`} variant={warning.level === "CRITICAL" ? "destructive" : "default"} className={cn("border-l-4", warning.level === "CRITICAL" ? "border-l-destructive bg-destructive/5" : "border-l-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400")}>
                      <AlertTriangle className="h-4 w-4" /><AlertTitle>{warning.level === "CRITICAL" ? "Critical Issue" : "Advisory"}</AlertTitle><AlertDescription>{warning.message}</AlertDescription>
                    </Alert>)}</div>}

                    {result.missingIngredients?.length ? <div className="mb-6 space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><div className="flex-1"><h3 className="mb-2 font-bold">Missing Essential Ingredients</h3>{result.missingIngredients.map((item) => <div key={item.category} className="mb-3 last:mb-0"><p className="mb-1 text-sm font-medium text-red-800">{item.category}</p><p className="mb-2 text-sm text-red-700">{item.reason}</p><div className="flex flex-wrap gap-2">{item.recommendations.map((recommendation) => <Badge key={recommendation} variant="outline" className="border-red-300 bg-red-100 text-red-900">{recommendation}</Badge>)}</div></div>)}</div></div></div> : null}

                    {Object.keys(result.mix).length ? <><div className="overflow-hidden rounded-lg border"><table className="w-full text-sm"><thead className="bg-muted/50 text-muted-foreground"><tr><th className="px-4 py-3 text-left">Ingredient</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Batch share</th><th className="px-4 py-3 text-left">Category</th></tr></thead><tbody className="divide-y">{Object.entries(result.mix).sort(([, left], [, right]) => right - left).map(([name, amount]) => <tr key={name}><td className="px-4 py-3 font-medium capitalize">{name.replace(/_/g, " ")}</td><td className="px-4 py-3 text-right font-mono">{Math.round(amount)}g</td><td className="px-4 py-3 text-right">{((amount / result.targetWeight) * 100).toFixed(1)}%</td><td className="px-4 py-3"><Badge variant="secondary" className={cn("capitalize font-normal", INGREDIENTS[name].category === "grain" && "bg-amber-100 text-amber-800 hover:bg-amber-200", INGREDIENTS[name].category === "legume" && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", INGREDIENTS[name].category === "seed" && "bg-stone-100 text-stone-800 hover:bg-stone-200")}>{INGREDIENTS[name].category}</Badge></td></tr>)}</tbody></table></div>{Object.entries(result.mix).some(([name]) => getPreparationInstructions(name)) && <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><h3 className="mb-2 flex items-center gap-2 font-semibold"><Info className="h-4 w-4" />Preparation instructions</h3><ul className="space-y-1">{Object.keys(result.mix).filter((name) => getPreparationInstructions(name)).map((name) => <li key={name}><strong className="capitalize">{name.replace(/_/g, " ")}:</strong> {getPreparationInstructions(name)?.preparation}</li>)}</ul></div>}</> : <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">There is no safe, compatible ingredient combination to estimate yet.</p>}

                  </div>}

                  {activeTab === "herbs" && <div className="space-y-6"><div className="flex gap-4"><div className="rounded-full bg-emerald-100 p-3"><Leaf className="h-6 w-6 text-emerald-700" /></div><div><h2 className="text-xl font-bold">Natural supplements</h2><p className="mt-1 text-muted-foreground">{herbRecommendation?.notes || "No specific herb recommendations are recorded for this profile."}</p></div></div>{herbRecommendation?.herbs.length ? <div className="grid gap-4 md:grid-cols-2">{herbRecommendation.herbs.map(({ name, herb }) => <Card key={name} className="border-emerald-100"><CardContent className="p-5"><h3 className="text-lg font-bold capitalize">{name.replace(/_/g, " ")}</h3><div className="mt-3 flex flex-wrap gap-2">{herb.benefits.map((benefit) => <Badge key={benefit} variant="secondary">{benefit}</Badge>)}</div><dl className="mt-4 space-y-2 text-sm"><div><dt className="font-medium">Dosage</dt><dd className="text-muted-foreground">{herb.dosage_per_kg}</dd></div><div><dt className="font-medium">Frequency</dt><dd className="text-muted-foreground">{herb.frequency}</dd></div><div><dt className="font-medium">Notes</dt><dd className="text-muted-foreground">{herb.notes}</dd></div></dl></CardContent></Card>)}</div> : <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No specific herb recommendations are recorded for this profile.</p>}</div>}

                  {activeTab === "analysis" && <div className="space-y-8"><div><h2 className="mb-4 text-lg font-bold">Category Breakdown</h2><div className="space-y-4"><CategoryBar label="Grains" value={result.categories.grain} target={getCategoryTargets(selectedBird).grain} color="bg-amber-400" /><CategoryBar label="Legumes" value={result.categories.legume} target={getCategoryTargets(selectedBird).legume} color="bg-emerald-500" /><CategoryBar label="Seeds" value={result.categories.seed} target={getCategoryTargets(selectedBird).seed} color="bg-stone-500" /></div></div><Separator /><div><h2 className="mb-3 text-lg font-bold">Detailed analysis</h2><p className="text-sm text-muted-foreground">The optimizer favours the selected profile’s estimated macronutrient and category ranges using the inventory you supplied. It is deterministic: identical inventory and settings produce the same batch estimate.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{result.suggestions.map((suggestion) => <div key={suggestion} className="rounded-lg border bg-muted/20 p-4 text-sm"><CheckCircle2 className="mb-2 h-4 w-4 text-emerald-700" />{suggestion}</div>)}</div></div><div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><h3 className="font-semibold text-blue-950">Profile: {currentProfile.name}</h3><p className="mt-1 text-sm text-blue-900">{currentProfile.feedingNotes}</p></div></div>}
                </CardContent>
              </Card>
            </div>}
          </section>
        </div>

        <section className="mt-16 border-t pt-8" aria-label="Safety reminders"><Alert className="border-amber-200 bg-amber-50"><AlertTriangle className="h-4 w-4 text-amber-600" /><AlertTitle className="font-bold text-amber-900">Important Safety Reminders</AlertTitle><AlertDescription className="mt-2 space-y-2 text-sm text-amber-800"><p>Fresh Water: Always provide clean, fresh water available at all times</p><p>Grit: Pigeons need grit to properly digest seeds and grains</p><p>Toxic Legumes: Never feed raw kidney beans, lima beans, fava beans, navy beans, or pinto beans</p><p>Preparation: Follow preparation instructions for each ingredient carefully</p><p>Exotics Vet Care: If your pigeon shows signs of illness, contact an exotics vet immediately</p></AlertDescription></Alert></section>
      </main>
    </div>
  );
}

function CareNote({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="flex items-start gap-3"><div className="mt-0.5 shrink-0">{icon}</div><div><p className="font-medium text-foreground">{title}</p><p className="text-xs leading-relaxed text-muted-foreground">{text}</p></div></div>;
}

function NutritionCard({ label, value, target, color }: { label: string; value: number; target: [number, number]; color: string }) {
  const [min, max] = target;
  const isGood = value >= min && value <= max;
  const isLow = value < min;
  return <Card className="border-none bg-card shadow-md"><CardContent className="p-4"><div className="mb-1 text-sm text-muted-foreground">{label}</div><div className="mb-2 flex items-baseline gap-1"><span className={cn("font-mono text-2xl font-bold", !isGood && (isLow ? "text-blue-600" : "text-orange-600"))}>{value.toFixed(1)}</span><span className="text-xs font-medium text-muted-foreground">%</span></div><div className="relative h-1.5 overflow-hidden rounded-full bg-muted"><div className={cn("absolute left-0 top-0 h-full transition-all duration-500", color)} style={{ width: `${Math.min(100, (value / (max * 1.5)) * 100)}%` }} /></div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>Target:</span><span className="font-medium">{min}-{max}%</span></div></CardContent></Card>;
}

function CategoryBar({ label, value, target, color }: { label: string; value: number; target: [number, number]; color: string }) {
  const [min, max] = target;
  return <div className="space-y-1"><div className="flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-muted-foreground">{value.toFixed(1)}% <span className="text-xs opacity-70">(Target: {min}-{max}%)</span></span></div><div className="relative h-4 overflow-hidden rounded-full bg-muted"><div className="absolute top-0 h-full bg-black/5 dark:bg-white/10" style={{ left: `${min}%`, width: `${max - min}%` }} /><div className={cn("absolute top-0 left-0 h-full opacity-80", color)} style={{ width: `${Math.min(value, 100)}%` }} /></div></div>;
}
