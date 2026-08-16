// Design contract: Modern Agrarian / Organic Tech — a warm, editorial feed workshop that communicates scope and safety clearly without overstating nutrition precision.
// Design contract: Modern Agrarian / Organic Tech — retain the practical calculator rhythm while keeping contribution prompts compact, friendly, and safety-aware.
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bird,
  BookOpen,
  CheckCircle2,
  Download,
  Droplets,
  ExternalLink,
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
import { HerbCard } from "@/components/HerbCard";
import { PersonalizedSupplementMix } from "@/components/PersonalizedSupplementMix";
import { IssueSubmitDialog } from "@/components/IssueSubmitDialog";
import { HERB_RECOMMENDATIONS, HERBS_SUPPLEMENTS, INGREDIENTS } from "@/lib/data";
import { checkBirdToxicity, isIngredientCompatible } from "@/lib/bird-safety";
import { getEligibleHerbNames } from "@/lib/herb-evidence";
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
import { getStarterInventory } from "@/lib/inventory-presets";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Home() {
  const [selectedBird, setSelectedBird] = useState<BirdType>("pigeon");
  const [situation, setSituation] = useState("pet");
  const [targetWeight, setTargetWeight] = useState(1000);
  const [inventory, setInventory] = useState<Record<string, number>>(() => getStarterInventory("pigeon", "pet"));
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
      herbs: getEligibleHerbNames(recommendation.recommended, selectedBird)
        .map((name) => ({ name, herb: HERBS_SUPPLEMENTS[name] }))
        .filter((entry): entry is { name: string; herb: NonNullable<typeof entry.herb> } => Boolean(entry.herb)),
    };
  }, [selectedBird, situation]);

  const diversitySuggestion = useMemo(() => {
    if (!result || result.missingIngredients?.length || !Object.keys(result.mix).length) return null;

    const candidate = ["barley", "oats", "millet", "sorghum", "buckwheat", "wheat", "rice_brown"]
      .filter((name) => !result.mix[name])
      .filter((name) => isIngredientCompatible(name, selectedBird) && !isToxicRaw(name) && !checkBirdToxicity(name, selectedBird) && !getProcessingWarning(name))
      .find((name) => INGREDIENTS[name]?.category === "grain");

    return candidate ? `Try offering ${candidate.replace(/_/g, " ")} alongside this mix to increase diversity for your bird.` : null;
  }, [result, selectedBird]);

  useEffect(() => {
    if (!availableSituations.includes(situation)) setSituation(availableSituations[0]);
  }, [availableSituations, situation]);

  useEffect(() => {
    if (!availableSituations.includes(situation)) return;
    setInventory(getStarterInventory(selectedBird, situation));
  }, [availableSituations, selectedBird, situation]);

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

  const ingredientTitle = ingredientSearch.trim() ? `[Ingredient research] ${ingredientSearch.trim()}` : "[Ingredient research]";
  const ingredientBody = ingredientSearch.trim() ? [
    "## Requested ingredient",
    ingredientSearch.trim(),
    "",
    "## Planner context",
    `Bird: ${birdProfile.name}`,
    `Profile: ${currentProfile.name}`,
    "",
    "## Research needed",
    "This request requires research before any ingredient value, safety rule, compatibility decision, or feeding guidance can change.",
    "",
    "## What would you like to add or correct?",
    "Please add any preparation detail, use case, or source here.",
  ].join("\n") : "";

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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-7">
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
            <IssueSubmitDialog
              triggerLabel={<><Plus className="h-6 w-6" aria-hidden="true" /><span className="text-sm font-semibold">Suggest bird</span></>}
              triggerClassName="flex aspect-square min-h-[108px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-4 text-center text-emerald-900 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              defaultTitle="[Bird research] Suggest a bird"
              defaultBody={[
                "## Requested bird",
                "",
                "## Intended use and life stage",
                "",
                "## Known dietary considerations or source links",
                "",
                "## Research request",
                "Please research nutrition targets, safe ingredients, toxicity boundaries, and suitable profiles before any calculator data is added.",
              ].join("\n")}
              labels={["needs-research", "bird-request"]}
              helperText="Suggestions are queued for research and product-owner review. They never add a live calculator bird automatically."
            />
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
                  <div className="flex items-end gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <label htmlFor="situation" className="text-sm font-medium text-muted-foreground">Current situation</label>
                      <Select value={situation} onValueChange={setSituation}>
                        <SelectTrigger id="situation" className="h-12 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {availableSituations.map((value) => (
                            <SelectItem key={value} value={value}>{birdProfile.profiles[value].name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <IssueSubmitDialog
                      triggerLabel={<><Plus className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Suggest profile</span></>}
                      triggerClassName="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-2 border-dashed border-emerald-300 bg-emerald-50 text-emerald-900 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultTitle={`[Profile research] ${birdProfile.name}`}
                      defaultBody={[
                        `## Bird\n${birdProfile.name}`,
                        "",
                        "## Suggested profile name",
                        "",
                        "## Intended use, life stage, or condition",
                        "",
                        "## Research request",
                        "Please research nutrition targets, suitability, safety boundaries, and source support before any calculator profile is added.",
                      ].join("\n")}
                      labels={["needs-research", "profile-request"]}
                      helperText="Suggestions are queued for research and product-owner review. They never alter an existing profile automatically."
                    />
                  </div>
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
                          <span><span className="block capitalize">{name.replace(/_/g, " ")}</span>{name === "popcorn" && <span className="block text-xs text-muted-foreground">Popcorn is not the same as corn nutritionally.</span>}</span><Plus className="h-4 w-4 shrink-0 text-emerald-700" />
                        </button>
                      )) : <div className="px-2 py-3"><p className="text-sm text-muted-foreground">No compatible ingredients match this search.</p>{ingredientSearch.trim() && <div className="mt-3"><IssueSubmitDialog triggerLabel={<><ExternalLink className="h-3.5 w-3.5" />Suggest to add</>} defaultTitle={ingredientTitle} defaultBody={ingredientBody} helperText="Submits an ingredient research request directly to the repository." /></div>}<p className="mt-1 text-xs leading-relaxed text-muted-foreground">Submits a research request assigned to the project owner; no ingredient data changes automatically.</p></div>}
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
                    const peanutGuidance = name === "peanuts" || name === "peanuts_raw" || name === "peanuts_roasted" ? getPreparationInstructions(name)?.notes : null;
                    const popcornGuidance = name === "popcorn" ? INGREDIENTS[name].notes : null;
                    const adzukiSafety = name === "adzuki_beans" ? getPreparationInstructions(name)?.notes : null;
                    return (
                      <div key={name} className={cn("group rounded-lg border p-3", hasConcern || adzukiSafety ? "border-red-300 bg-red-50" : "bg-card")}>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div>
                            <label htmlFor={`amount-${name}`} className="text-sm font-medium capitalize">{name.replace(/_/g, " ")}{preparation && <span className="ml-1 text-xs font-normal text-muted-foreground">(Preparation: {preparation})</span>}</label>
                          </div>
                          <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${name.replace(/_/g, " ")}`} onClick={() => removeIngredient(name)} className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        {hasConcern && <p className="mb-2 rounded bg-red-100 p-2 text-xs font-medium text-red-900">Excluded from the formula: {speciesToxicity?.description || rawSafety?.message || processingWarning || `not compatible with ${birdProfile.name}`}.</p>}
                        {adzukiSafety && <p className="mb-2 flex items-start gap-1.5 rounded border border-red-300 bg-red-100 p-2 text-xs font-semibold text-red-950"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{adzukiSafety}</p>}
                        {peanutGuidance && <p className="mb-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs font-medium text-amber-950"><strong>Peanut treat:</strong> {peanutGuidance}</p>}
                        {popcornGuidance && <p className="mb-2 flex items-start gap-1.5 rounded border border-blue-200 bg-blue-50 p-2 text-xs font-medium text-blue-950"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{popcornGuidance}</p>}
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

              <Card className="border-none shadow-xl">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="overflow-x-auto border-b bg-muted/30 p-2" aria-label="Calculator sections">
                    <TabsList className="flex h-auto min-w-[510px] w-full justify-stretch bg-transparent">
                      <TabsTrigger value="calculator" className="flex-1 whitespace-nowrap">Optimized Mix</TabsTrigger>
                      <TabsTrigger value="herbs" className="flex-1 whitespace-nowrap">Herbs & Supplements</TabsTrigger>
                      <TabsTrigger value="analysis" className="flex-1 whitespace-nowrap">Detailed Analysis</TabsTrigger>
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

                    {Object.keys(result.mix).length ? <>{diversitySuggestion && <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"><Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /><p><strong className="font-semibold">Ingredient diversity:</strong> {diversitySuggestion}</p></div>}<div className="rounded-lg border"><div className="overflow-x-auto"><table className="min-w-[560px] w-full text-sm"><thead className="bg-muted/50 text-muted-foreground"><tr><th className="px-4 py-3 text-left">Ingredient</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-right">Batch share</th><th className="px-4 py-3 text-left">Category</th></tr></thead><tbody className="divide-y">{Object.entries(result.mix).sort(([, left], [, right]) => right - left).map(([name, amount]) => <tr key={name}><td className="px-4 py-3 font-medium capitalize">{name.replace(/_/g, " ")}</td><td className="px-4 py-3 text-right font-mono">{Math.round(amount)}g</td><td className="px-4 py-3 text-right">{((amount / result.targetWeight) * 100).toFixed(1)}%</td><td className="px-4 py-3"><Badge variant="secondary" className={cn("capitalize font-normal", INGREDIENTS[name].category === "grain" && "bg-amber-100 text-amber-800 hover:bg-amber-200", INGREDIENTS[name].category === "legume" && "bg-emerald-100 text-emerald-800 hover:bg-emerald-200", INGREDIENTS[name].category === "seed" && "bg-stone-100 text-stone-800 hover:bg-stone-200")}>{INGREDIENTS[name].category}</Badge></td></tr>)}</tbody></table></div></div><p className="text-xs text-muted-foreground sm:hidden">Swipe the formula table sideways to view all columns.</p>{Object.entries(result.mix).some(([name]) => getPreparationInstructions(name)) && <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><h3 className="mb-2 flex items-center gap-2 font-semibold"><Info className="h-4 w-4" />Preparation instructions</h3><ul className="space-y-2">{Object.keys(result.mix).filter((name) => getPreparationInstructions(name)).map((name) => { const preparation = getPreparationInstructions(name); const birdGuidance = preparation?.birdGuidance?.[selectedBird]; return <li key={name}><strong className="capitalize">{name.replace(/_/g, " ")}:</strong> {preparation?.preparation}{birdGuidance && <span className="block pl-1 text-amber-900">{birdGuidance}</span>}</li>; })}</ul></div>}</> : <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">There is no safe, compatible ingredient combination to estimate yet.</p>}<ReportIssueLink section="Optimized Mix" bird={birdProfile.name} profile={currentProfile.name} />

                  </div>}

                  {activeTab === "herbs" && <div className="space-y-10">
                    <section className="space-y-5">
                      <div className="flex flex-col justify-between gap-4 border-b border-emerald-100 pb-5 sm:flex-row sm:items-start">
                        <div className="flex gap-4">
                          <div className="rounded-full bg-emerald-100 p-3"><Leaf className="h-6 w-6 text-emerald-700" /></div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Herbs & supplements</p>
                            <h2 className="mt-1 text-xl font-bold">Profile</h2>
                            <p className="mt-1 text-muted-foreground">{herbRecommendation?.notes || "No specific herb recommendations are recorded for this profile."}</p>
                          </div>
                        </div>
                        <Link href="/herbs" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-50"><BookOpen className="h-4 w-4" />Browse herb library</Link>
                      </div>
                      {herbRecommendation?.herbs.length ? <div className="grid gap-4 md:grid-cols-2">{herbRecommendation.herbs.map(({ name, herb }) => <HerbCard key={name} name={name} herb={herb} />)}</div> : <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No specific herb recommendations are recorded for this profile.</p>}
                    </section>
                    <PersonalizedSupplementMix bird={selectedBird} />
                    <ReportIssueLink section="Herbs & Supplements" bird={birdProfile.name} profile={currentProfile.name} />
                  </div>}

                  {activeTab === "analysis" && <div className="space-y-8"><div><h2 className="mb-4 text-lg font-bold">Category Breakdown</h2><div className="space-y-4"><CategoryBar label="Grains" value={result.categories.grain} target={getCategoryTargets(selectedBird).grain} color="bg-amber-400" /><CategoryBar label="Legumes" value={result.categories.legume} target={getCategoryTargets(selectedBird).legume} color="bg-emerald-500" /><CategoryBar label="Seeds" value={result.categories.seed} target={getCategoryTargets(selectedBird).seed} color="bg-stone-500" /></div></div><Separator /><div><h2 className="mb-3 text-lg font-bold">Detailed analysis</h2><p className="text-sm text-muted-foreground mb-3">Detailed analysis of the recommended seed mix based on nutritional targets and ingredient properties.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{result.suggestions.map((suggestion) => <div key={suggestion} className="rounded-lg border bg-muted/20 p-4 text-sm"><CheckCircle2 className="mb-2 h-4 w-4 text-emerald-700" />{suggestion}</div>)}</div><p className="mt-4 text-xs text-muted-foreground">Optimizer note: The optimizer favours the selected profile’s estimated macronutrient and category ranges using the inventory you supplied. It is deterministic: identical inventory and settings produce the same batch estimate.</p></div><div className="rounded-lg border border-blue-200 bg-blue-50 p-4"><h3 className="font-semibold text-blue-950">Profile: {currentProfile.name}</h3><p className="mt-1 text-sm text-blue-900">{currentProfile.feedingNotes}</p></div><ReportIssueLink section="Detailed Analysis" bird={birdProfile.name} profile={currentProfile.name} /></div>}
                </CardContent>
              </Card>
            </div>}
          </section>
        </div>

        <section className="mt-16 border-t pt-8" aria-label="Safety reminders"><Alert className="border-amber-200 bg-amber-50"><AlertTriangle className="h-4 w-4 text-amber-600" /><AlertTitle className="font-bold text-amber-900">Important Safety Reminders</AlertTitle><AlertDescription className="mt-2 space-y-2 text-sm text-amber-800"><p>Fresh Water: Always provide clean, fresh water available at all times</p><p>Grit: Pigeons need grit to properly digest seeds and grains</p><p>Toxic Legumes: Never feed raw kidney beans, lima beans, fava beans, navy beans, pinto beans, or black beans</p><p>Preparation: Follow preparation instructions for each ingredient carefully</p><p>Exotics Vet Care: If your pigeon shows signs of illness, contact an exotics vet immediately</p></AlertDescription></Alert></section>
      </main>
    </div>
  );
}

function CareNote({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="flex items-start gap-3"><div className="mt-0.5 shrink-0">{icon}</div><div><p className="font-medium text-foreground">{title}</p><p className="text-xs leading-relaxed text-muted-foreground">{text}</p></div></div>;
}

function ReportIssueLink({ section, bird, profile }: { section: string; bird: string; profile: string }) {
  const title = `[Information report] ${section}`;
  const body = [
    "## Location in the calculator",
    `Section: ${section}`,
    `Bird: ${bird}`,
    `Profile: ${profile}`,
    "",
    "## What seems incorrect, incomplete, or unclear?",
    "Please describe the information that needs review.",
    "",
    "## Research needed",
    "This report requires research before any nutrition value, herb record, safety rule, compatibility decision, or user-facing guidance can change.",
    "",
    "## Helpful source or context",
    "Add a link, publication, photograph, or practical context if available.",
  ].join("\n");

  return (
    <div className="border-t border-dashed pt-6">
      <IssueSubmitDialog
        triggerLabel={<><ExternalLink className="h-4 w-4" />Report wrong info / issue</>}
        triggerClassName="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 transition-colors"
        defaultTitle={title}
        defaultBody={body}
        helperText="Submits a research request directly to the repository without leaving the calculator."
      />
      <p className="mt-2 text-xs text-muted-foreground">Submits a research request assigned to the project owner. Nothing in the calculator changes automatically.</p>
    </div>
  );
}

function buildGitHubIssueUrl(template: string, title: string, body: string) {
  const query = new URLSearchParams({ template, title, body });
  return `https://github.com/Crypto-Shroom/Bird-Feed-Calculator/issues/new?${query.toString()}`;
}

function NutritionCard({ label, value, target, color }: { label: string; value: number; target: [number, number]; color: string }) {
  const [min, max] = target;
  const isGood = value >= min && value <= max;
  const isLow = value < min;
  const targetRange = Math.max(0.5, max - min);
  const upperDisplayLimit = max + Math.max(targetRange * 2, max * 0.2);
  const position = value < min
    ? (value / Math.max(min, 0.5)) * 40
    : value <= max
      ? 40 + ((value - min) / targetRange) * 20
      : 60 + ((value - max) / Math.max(upperDisplayLimit - max, 0.5)) * 40;
  const markerPosition = Math.max(0, Math.min(100, position));
  const status = isGood ? "within the target range" : isLow ? "below the target range" : "above the target range";

  return <Card className="border-none bg-card shadow-md"><CardContent className="p-4"><div className="mb-1 text-sm text-muted-foreground">{label}</div><div className="mb-2 flex items-baseline gap-1"><span className={cn("font-mono text-2xl font-bold", !isGood && (isLow ? "text-blue-600" : "text-orange-600"))}>{value.toFixed(1)}</span><span className="text-xs font-medium text-muted-foreground">%</span></div><div className="relative h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${label}: ${value.toFixed(1)}%, ${status}; target range ${min} to ${max} percent.`}><div aria-hidden="true" className="absolute inset-y-0 border-x border-emerald-600/70 bg-emerald-100/80" style={{ left: "40%", width: "20%" }} /><div aria-hidden="true" className={cn("absolute left-0 top-0 h-full opacity-65 transition-[width] duration-300 motion-reduce:transition-none", color)} style={{ width: `${markerPosition}%` }} /><div aria-hidden="true" className={cn("absolute top-0 h-full w-1 rounded-full shadow-sm transition-[left] duration-300 motion-reduce:transition-none", isGood ? "bg-emerald-800" : isLow ? "bg-blue-700" : "bg-orange-700")} style={{ left: `calc(${markerPosition}% - 2px)` }} /></div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span className={cn("font-medium", isGood ? "text-emerald-700" : isLow ? "text-blue-700" : "text-orange-700")}>{status}</span><span>Target: <span className="font-medium">{min}-{max}%</span></span></div></CardContent></Card>;
}

function CategoryBar({ label, value, target, color }: { label: string; value: number; target: [number, number]; color: string }) {
  const [min, max] = target;
  return <div className="space-y-1"><div className="flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-muted-foreground">{value.toFixed(1)}% <span className="text-xs opacity-70">(Target: {min}-{max}%)</span></span></div><div className="relative h-4 overflow-hidden rounded-full bg-muted"><div className="absolute top-0 h-full bg-black/5 dark:bg-white/10" style={{ left: `${min}%`, width: `${max - min}%` }} /><div className={cn("absolute top-0 left-0 h-full opacity-80", color)} style={{ width: `${Math.min(value, 100)}%` }} /></div></div>;
}
