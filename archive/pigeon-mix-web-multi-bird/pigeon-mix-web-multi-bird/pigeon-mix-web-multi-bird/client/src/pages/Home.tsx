import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Bird,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Info,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  ChevronRight,
  Wheat,
  Sprout,
  Droplets,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { INGREDIENTS, PROFILES } from "@/lib/data";
import { MultibirMixCalculator, MixResult } from "@/lib/calculator-multi-bird";
import {
  isToxicRaw,
  grainNeedsPairing,
  getPreparationInstructions,
  SAFETY_DISCLAIMER,
} from "@/lib/safety";
import { cn } from "@/lib/utils";
import { BirdType, BIRD_INFO, getProfilesForBird } from "@/lib/birds";
import { isIngredientCompatible, getToxicFoodForBird } from "@/lib/bird-safety";

export default function Home() {
  // Wrap app with TooltipProvider
  return (
    <TooltipProvider>
      <HomeContent />
    </TooltipProvider>
  );
}

function HomeContent() {
  const [selectedBird, setSelectedBird] = useState<BirdType>("pigeon");
  const [situation, setSituation] = useState("maintenance");
  const [targetWeight, setTargetWeight] = useState(1000);
  const [inventory, setInventory] = useState<Record<string, number>>({
    wheat: 5000,
    corn_yellow: 3000,
    peas: 2000,
    lentils: 1000,
    safflower: 500,
    barley: 2000,
  });
  const [result, setResult] = useState<MixResult | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");
  const [ingredientSearch, setIngredientSearch] = useState("");

  // Get profiles for selected bird
  const birdProfiles = getProfilesForBird(selectedBird);
  const currentProfile =
    birdProfiles[situation] || Object.values(birdProfiles)[0];
  const birdInfo = BIRD_INFO[selectedBird];

  // Reset situation when bird changes
  const handleBirdChange = (bird: BirdType) => {
    setSelectedBird(bird);
    const profiles = getProfilesForBird(bird);
    setSituation(Object.keys(profiles)[0]); // Set to first profile of new bird
    setInventory({}); // Clear inventory when switching birds
  };

  // Calculate mix whenever inputs change
  useEffect(() => {
    const calculator = new MultibirMixCalculator(
      inventory,
      situation,
      selectedBird,
    );
    const res = calculator.calculate(targetWeight);
    setResult(res);
  }, [inventory, situation, targetWeight]);

  const handleAddIngredient = (name: string) => {
    if (!inventory[name]) {
      setInventory((prev) => ({ ...prev, [name]: 1000 }));
    }
  };

  const handleRemoveIngredient = (name: string) => {
    const newInv = { ...inventory };
    delete newInv[name];
    setInventory(newInv);
  };

  const handleUpdateAmount = (name: string, amount: number) => {
    setInventory((prev) => ({ ...prev, [name]: amount }));
  };

  const sortedIngredients = useMemo(() => {
    const all = Object.keys(INGREDIENTS).sort();
    const filtered = all.filter((ing) =>
      isIngredientCompatible(ing, selectedBird),
    );
    if (!ingredientSearch.trim()) return filtered;
    const searchLower = ingredientSearch.toLowerCase();
    return filtered.filter((ing) => ing.toLowerCase().includes(searchLower));
  }, [ingredientSearch, selectedBird]);

  const incompatibleMatches = useMemo(() => {
    if (!ingredientSearch.trim()) return [];
    const searchLower = ingredientSearch.toLowerCase();
    return Object.keys(INGREDIENTS)
      .filter((ing) => !isIngredientCompatible(ing, selectedBird))
      .filter((ing) => ing.toLowerCase().includes(searchLower));
  }, [ingredientSearch, selectedBird]);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="/images/hero-pigeon-mix.png"
          alt="Premium Pigeon Mix"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container h-full flex flex-col justify-center items-start text-white">
          <Badge className="mb-4 bg-primary/90 hover:bg-primary text-primary-foreground border-none px-3 py-1 text-sm font-medium backdrop-blur-sm">
            v2.0 Enhanced Calculator
          </Badge>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 leading-tight">
            Precision Nutrition <br />
            for Champion Pigeons
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light">
            Scientifically optimized seed mixes tailored to your flock's
            specific needs—from racing to molting.
          </p>
        </div>
      </div>

      <main className="container py-12 -mt-20 relative z-30">
        {/* Bird Selector */}
        <div className="mb-8 pb-6 border-b border-border/50">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Select Bird Type
          </h3>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(BIRD_INFO) as BirdType[]).map((bird) => (
              <button
                key={bird}
                onClick={() => handleBirdChange(bird)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2",
                  selectedBird === bird
                    ? `${BIRD_INFO[bird].color} text-white border-current shadow-lg scale-105`
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80",
                )}
              >
                {BIRD_INFO[bird].name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls & Inventory */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-xl bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Bird className="w-6 h-6 text-primary" />
                  {birdInfo.name} Profile
                </CardTitle>
                <CardDescription>
                  Configure your flock's current situation to get optimized
                  targets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Situation
                  </label>
                  <Select value={situation} onValueChange={setSituation}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(birdProfiles).map(([key, profile]) => (
                        <SelectItem key={key} value={key}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/50">
                    {currentProfile.feeding_notes}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-muted-foreground">
                      Target Batch Size
                    </label>
                    <span className="font-mono font-bold">{targetWeight}g</span>
                  </div>
                  <Slider
                    value={[targetWeight]}
                    min={500}
                    max={10000}
                    step={100}
                    onValueChange={(vals) => setTargetWeight(vals[0])}
                    className="py-4"
                  />
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Droplets className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Fresh Water</p>
                      <p className="text-xs text-muted-foreground">
                        Always provide clean, fresh water available at all times
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Grit</p>
                      <p className="text-xs text-muted-foreground">
                        Pigeons need grit to properly digest seeds and grains
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-card/95 backdrop-blur-sm flex flex-col h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Wheat className="w-5 h-5 text-secondary-foreground" />
                    Your Inventory
                  </CardTitle>
                </div>
                <Select
                  onValueChange={(value) => {
                    handleAddIngredient(value);
                    setIngredientSearch("");
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-xs mt-2">
                    <Plus className="w-3 h-3 mr-1" /> Add Ingredient
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <div className="flex items-center gap-2 relative mb-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search ingredients..."
                          value={ingredientSearch}
                          onChange={(e) => {
                            e.stopPropagation();
                            setIngredientSearch(e.target.value);
                          }}
                          className="h-8 text-xs flex-1 pl-0 border-0"
                          autoFocus
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[300px]">
                      {sortedIngredients.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Compatible
                          </div>
                          {sortedIngredients.map((ing) => (
                            <SelectItem
                              key={ing}
                              value={ing}
                              disabled={!!inventory[ing]}
                            >
                              {ing.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {incompatibleMatches.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-2 pt-2">
                            Not Recommended
                          </div>
                          {incompatibleMatches.map((ing) => (
                            <SelectItem
                              key={ing}
                              value={ing}
                              disabled={!!inventory[ing]}
                              className="opacity-50"
                            >
                              {ing.replace(/_/g, " ")} (not ideal)
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <CardDescription>
                  Enter available amounts in grams for each ingredient you have
                  on hand.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="space-y-4 pt-2">
                    {Object.entries(inventory).map(([name, amount]) => {
                      const toxicInfo = isToxicRaw(name);
                      const birdToxic = getToxicFoodForBird(name, selectedBird);
                      const isIncompatible = !isIngredientCompatible(
                        name,
                        selectedBird,
                      );
                      const hasWarning =
                        toxicInfo || birdToxic || isIncompatible;
                      return (
                        <div
                          key={name}
                          className={cn(
                            "flex items-center gap-3 group p-3 rounded-lg border",
                            hasWarning
                              ? "bg-red-50 border-red-300"
                              : "border-transparent",
                          )}
                        >
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium capitalize text-sm">
                                {name.replace(/_/g, " ")}
                                {getPreparationInstructions(name) && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    (
                                    {
                                      getPreparationInstructions(name)
                                        ?.preparation
                                    }
                                    )
                                  </span>
                                )}
                                {birdToxic && (
                                  <span className="text-xs text-red-600 font-semibold ml-2">
                                    WARNING TOXIC
                                  </span>
                                )}
                                {isIncompatible && !birdToxic && (
                                  <span className="text-xs text-orange-600 font-semibold ml-2">
                                    Not recommended
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {amount}g
                              </span>
                            </div>
                            {(toxicInfo || birdToxic || isIncompatible) && (
                              <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-900 font-semibold">
                                {birdToxic &&
                                  `WARNING: ${birdToxic.toxin}. ${birdToxic.message}`}
                                {toxicInfo &&
                                  !birdToxic &&
                                  `WARNING: ${toxicInfo.toxin}. ${toxicInfo.message}`}
                                {isIncompatible &&
                                  !birdToxic &&
                                  !toxicInfo &&
                                  `Not recommended for ${birdInfo.name}`}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                  handleUpdateAmount(
                                    name,
                                    Number(e.target.value),
                                  )
                                }
                                className="h-8 text-xs"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveIngredient(name)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(inventory).length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No ingredients added.</p>
                        <p className="text-sm">
                          Add ingredients to start calculating.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results & Analysis */}
          <div className="lg:col-span-7 space-y-6">
            {result && (
              <div className="space-y-6">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <NutritionCard
                    label="Protein"
                    value={result.nutrition.protein}
                    target={currentProfile.protein}
                    unit="%"
                    color="bg-[var(--chart-1)]"
                  />
                  <NutritionCard
                    label="Carbs"
                    value={result.nutrition.carbs}
                    target={currentProfile.carbs}
                    unit="%"
                    color="bg-[var(--chart-2)]"
                  />
                  <NutritionCard
                    label="Fat"
                    value={result.nutrition.fat}
                    target={currentProfile.fat}
                    unit="%"
                    color="bg-[var(--chart-3)]"
                  />
                  <NutritionCard
                    label="Fiber"
                    value={result.nutrition.fiber}
                    target={currentProfile.fiber}
                    unit="%"
                    color="bg-[var(--chart-4)]"
                  />
                </div>

                {/* Main Mix Display */}
                <Card className="border-none shadow-xl overflow-hidden">
                  <div className="bg-muted/30 border-b border-border/50 p-1">
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="w-full justify-start bg-transparent p-0 h-12">
                        <TabsTrigger
                          value="calculator"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md mx-1 h-10 px-6"
                        >
                          Optimized Mix
                        </TabsTrigger>
                        <TabsTrigger
                          value="herbs"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md mx-1 h-10 px-6"
                        >
                          Herbs & Supplements
                        </TabsTrigger>
                        <TabsTrigger
                          value="analysis"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md mx-1 h-10 px-6"
                        >
                          Detailed Analysis
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <CardContent className="p-6 min-h-[500px]">
                    {activeTab === "calculator" && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-display font-bold">
                            Recommended Formula
                          </h3>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" /> Export Recipe
                          </Button>
                        </div>

                        {/* Missing Ingredients Alert */}
                        {result.missingIngredients &&
                          result.missingIngredients.length > 0 && (
                            <div className="space-y-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-6">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                                <div className="flex-1">
                                  <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">
                                    Missing Essential Ingredients
                                  </h4>
                                  {result.missingIngredients.map(
                                    (missing, i) => (
                                      <div key={i} className="mb-3 last:mb-0">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                                          {missing.category}
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                                          {missing.reason}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {missing.recommendations.map(
                                            (rec, j) => (
                                              <Badge
                                                key={j}
                                                variant="outline"
                                                className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-200 border-red-300 dark:border-red-700"
                                              >
                                                {rec}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Warnings */}
                        {result.warnings.length > 0 && (
                          <div className="space-y-2">
                            {result.warnings.map((w, i) => (
                              <Alert
                                key={i}
                                variant={
                                  w.level === "CRITICAL"
                                    ? "destructive"
                                    : "default"
                                }
                                className={cn(
                                  "border-l-4",
                                  w.level === "CRITICAL"
                                    ? "border-l-destructive bg-destructive/5"
                                    : "border-l-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                                )}
                              >
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>
                                  {w.level === "CRITICAL"
                                    ? "Critical Issue"
                                    : "Advisory"}
                                </AlertTitle>
                                <AlertDescription>{w.message}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        )}

                        {/* Mix Table */}
                        <div className="rounded-lg border border-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                              <tr>
                                <th className="px-4 py-3 text-left">
                                  Ingredient
                                </th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-right">%</th>
                                <th className="px-4 py-3 text-left pl-8">
                                  Category
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                              {Object.entries(result.mix)
                                .sort(([, a], [, b]) => b - a)
                                .map(([name, amount]) => (
                                  <tr
                                    key={name}
                                    className="hover:bg-muted/20 transition-colors"
                                  >
                                    <td className="px-4 py-3 font-medium capitalize">
                                      {name.replace(/_/g, " ")}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono">
                                      {Math.round(amount)}g
                                    </td>
                                    <td className="px-4 py-3 text-right text-muted-foreground">
                                      {((amount / targetWeight) * 100).toFixed(
                                        1,
                                      )}
                                      %
                                    </td>
                                    <td className="px-4 py-3 pl-8">
                                      <Badge
                                        variant="secondary"
                                        className={cn(
                                          "capitalize font-normal",
                                          INGREDIENTS[name].category ===
                                            "grain" &&
                                            "bg-amber-100 text-amber-800 hover:bg-amber-200",
                                          INGREDIENTS[name].category ===
                                            "legume" &&
                                            "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
                                          INGREDIENTS[name].category ===
                                            "seed" &&
                                            "bg-stone-100 text-stone-800 hover:bg-stone-200",
                                        )}
                                      >
                                        {INGREDIENTS[name].category}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Preparation Notes */}
                        {Object.keys(result.mix).some((ing) =>
                          getPreparationInstructions(ing),
                        ) && (
                          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                            <h4 className="font-medium text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
                              <Info className="w-4 h-4" /> Preparation
                              Instructions
                            </h4>
                            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-400">
                              {Object.keys(result.mix)
                                .filter((ing) =>
                                  getPreparationInstructions(ing),
                                )
                                .map((ing) => (
                                  <li key={ing} className="flex gap-2">
                                    <span className="font-medium capitalize">
                                      {ing.replace(/_/g, " ")}:
                                    </span>
                                    <span>
                                      {
                                        getPreparationInstructions(ing)
                                          ?.preparation
                                      }
                                    </span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggestions */}
                        {result.suggestions.length > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                            <h4 className="font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                              <Info className="w-4 h-4" /> Optimization
                              Suggestions
                            </h4>
                            <ul className="space-y-1">
                              {result.suggestions.map((s, i) => (
                                <li
                                  key={i}
                                  className="text-sm text-blue-800 dark:text-blue-400 flex items-start gap-2"
                                >
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "herbs" && (
                      <div className="space-y-6">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <Sprout className="w-6 h-6 text-green-700 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-display font-bold">
                              Natural Supplements
                            </h3>
                            <p className="text-muted-foreground">
                              {result.herbPurpose}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          {result.herbRecommendations.map((herb, i) => (
                            <div
                              key={i}
                              className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors bg-card"
                            >
                              <div className="mt-1">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold text-lg capitalize">
                                  {herb.name}
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {herb.benefits.map((b) => (
                                    <Badge
                                      key={b}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {b}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground mt-2">
                                  <div className="flex gap-2">
                                    <span className="font-medium text-foreground">
                                      Dosage:
                                    </span>{" "}
                                    {herb.dosage}
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="font-medium text-foreground">
                                      Frequency:
                                    </span>{" "}
                                    {herb.frequency}
                                  </div>
                                </div>
                                <p className="text-sm italic mt-2 text-muted-foreground/80 border-l-2 border-primary/20 pl-3">
                                  {herb.notes}
                                </p>
                              </div>
                            </div>
                          ))}

                          {result.herbRecommendations.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                              No specific herb recommendations for this profile.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "analysis" && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-bold mb-4">
                            Category Breakdown
                          </h3>
                          <div className="space-y-4">
                            <CategoryBar
                              label="Grains"
                              value={result.categories.grain}
                              target={currentProfile.category_ratios.grain}
                              color="bg-amber-400"
                            />
                            <CategoryBar
                              label="Legumes"
                              value={result.categories.legume}
                              target={currentProfile.category_ratios.legume}
                              color="bg-emerald-500"
                            />
                            <CategoryBar
                              label="Seeds"
                              value={result.categories.seed}
                              target={currentProfile.category_ratios.seed}
                              color="bg-stone-500"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-bold mb-4">
                            Nutritional Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Protein Source Efficiency
                                </span>
                                <span className="font-medium">High</span>
                              </div>
                              <Progress value={85} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Energy Density
                                </span>
                                <span className="font-medium">
                                  3200 kcal/kg
                                </span>
                              </div>
                              <Progress value={70} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                          <h3 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-200">
                            Profile: {currentProfile.name}
                          </h3>
                          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                            {currentProfile.feeding_notes}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="font-semibold text-blue-900 dark:text-blue-200">
                                Protein Target:
                              </span>
                              <p className="text-blue-700 dark:text-blue-400">
                                {currentProfile.protein[0]}-
                                {currentProfile.protein[1]}%
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-900 dark:text-blue-200">
                                Carbs Target:
                              </span>
                              <p className="text-blue-700 dark:text-blue-400">
                                {currentProfile.carbs[0]}-
                                {currentProfile.carbs[1]}%
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-900 dark:text-blue-200">
                                Fat Target:
                              </span>
                              <p className="text-blue-700 dark:text-blue-400">
                                {currentProfile.fat[0]}-{currentProfile.fat[1]}%
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-900 dark:text-blue-200">
                                Fiber Target:
                              </span>
                              <p className="text-blue-700 dark:text-blue-400">
                                {currentProfile.fiber[0]}-
                                {currentProfile.fiber[1]}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="mt-16 border-t pt-8">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900 font-bold">
              Important Safety Reminders
            </AlertTitle>
            <AlertDescription className="text-amber-800 mt-2 space-y-2 text-sm">
              <p>
                Fresh Water: Always provide clean, fresh water available at all
                times
              </p>
              <p>Grit: Pigeons need grit to properly digest seeds and grains</p>
              <p>
                Toxic Legumes: Never feed raw kidney beans, lima beans, fava
                beans, navy beans, or pinto beans
              </p>
              <p>
                Preparation: Follow preparation instructions for each ingredient
                carefully
              </p>
              <p>
                Veterinary Care: If your pigeon shows signs of illness, contact
                an avian veterinarian immediately
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
}

function NutritionCard({
  label,
  value,
  target,
  unit,
  color,
}: {
  label: string;
  value: number;
  target: number[];
  unit: string;
  color: string;
}) {
  const min = target[0];
  const max = target[1];
  const isGood = value >= min && value <= max;
  const isLow = value < min;
  const isHigh = value > max;

  const getColorClass = () => {
    if (isGood) return "text-green-600 dark:text-green-400";
    if (isLow) return "text-red-600 dark:text-red-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const getStatusText = () => {
    if (isGood) return "Within target range";
    if (isLow) return "Below target (too low)";
    return "Above target (too high)";
  };

  return (
    <Card className="border-none shadow-md bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">
                  <strong>Color Guide:</strong>
                  <br />
                  🟢 Green: Within target range
                  <br />
                  🔴 Red: Below target (too low)
                  <br />
                  🟠 Orange: Above target (too high)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className={cn("text-2xl font-bold font-mono", getColorClass())}>
            {value.toFixed(1)}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {unit}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          {getStatusText()}
        </div>
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute top-0 left-0 h-full transition-all duration-500",
              color,
            )}
            style={{ width: `${Math.min(100, (value / (max * 1.5)) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span>Target:</span>
          <span className="font-medium">
            {min}-{max}
            {unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryBar({
  label,
  value,
  target,
  color,
}: {
  label: string;
  value: number;
  target: number[];
  color: string;
}) {
  const min = target[0];
  const max = target[1];

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value.toFixed(1)}%{" "}
          <span className="text-xs opacity-70">
            (Target: {min}-{max}%)
          </span>
        </span>
      </div>
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        {/* Target Range Marker */}
        <div
          className="absolute top-0 h-full bg-black/5 dark:bg-white/10"
          style={{ left: `${min}%`, width: `${max - min}%` }}
        />
        {/* Actual Value Bar */}
        <div
          className={cn(
            "absolute top-0 left-0 h-full transition-all duration-500 opacity-80",
            color,
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
