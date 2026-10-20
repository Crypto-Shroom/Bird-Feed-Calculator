// Design contract: Modern Agrarian / Organic Tech — clear botanical reference cards with warm, calm hierarchy and no dashboard-density styling.
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Herb } from "@/lib/data";
import { getHerbEvidence, HERB_SOURCES, type HerbBirdKey } from "@/lib/herb-evidence";
import { useLanguage } from "@/contexts/LanguageContext";
import { getHerbName, translateHerbText } from "@/locales/herbs";


interface HerbCardProps {
  name: string;
  herb: Herb;
  showSources?: boolean;
  showCompatibleBirds?: boolean;
}

export function HerbCard({ name, herb, showSources = false, showCompatibleBirds = false }: HerbCardProps) {
  const { t, language } = useLanguage();
  const herbName = getHerbName(name, language);
  const nameCase = language === "en" ? "capitalize" : "";
  const birdLabels: Record<HerbBirdKey, string> = {
    pigeon: t("common.pigeon"),
    parrot: t("common.parrot"),
    african_grey: t("common.africanGrey"),
    budgie: t("common.budgie"),
    canary: t("common.canary"),
    chicken: t("common.chicken"),
  };
  const evidence = getHerbEvidence(name);
  const sourceEntries = evidence.sourceIds.map((sourceId) => HERB_SOURCES[sourceId]);
  const safetyLabel = evidence.eligibility === "eligible"
    ? evidence.compatibleBirds.length === 1 && evidence.compatibleBirds[0] === "pigeon"
      ? t("herbs.pigeonOnlyAutomaticSuggestions")
      : t("herbs.eligibleForAutomaticSuggestions")
    : evidence.eligibility === "do_not_suggest"
      ? t("herbs.notAutomaticallySuggested")
      : t("herbs.referenceOnly");
  const safetyClass = evidence.eligibility === "eligible"
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : evidence.eligibility === "do_not_suggest"
      ? "border-red-300 bg-red-50 text-red-900"
      : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <Card className="border-emerald-100 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
      <CardContent className="p-5">
        <h3 className={`font-display text-xl font-bold text-foreground ${nameCase}`}>{herbName}</h3>
        {showSources && <Badge variant="outline" className={`mt-3 ${safetyClass}`}>{safetyLabel}</Badge>}
        <div className="mt-3 flex flex-wrap gap-2">
          {herb.benefits.map((benefit) => <Badge key={benefit} variant="secondary" className="bg-emerald-50 text-emerald-900 hover:bg-emerald-100">{translateHerbText(benefit, language)}</Badge>)}
        </div>
        {showCompatibleBirds && <section className="mt-5" aria-label={t("herbs.compatibleBirdsFor", { name: herbName })}>
          <h4 className="text-sm font-semibold text-foreground">{t("herbs.compatibleBirds")}</h4>
          {evidence.compatibleBirds.length ? <div className="mt-2 flex flex-wrap gap-2">
            {evidence.compatibleBirds.map((bird) => <Badge key={bird} variant="outline" className="border-sky-200 bg-sky-50 text-sky-900">{birdLabels[bird]}</Badge>)}
          </div> : <p className="mt-1 text-xs text-muted-foreground">{t("herbs.noCompatibleBirdsRecorded")}</p>}
        </section>}
        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-foreground">{t("herbs.dosagePerKg")}</dt>
            <dd className="mt-0.5 text-muted-foreground">{translateHerbText(herb.dosage_per_kg, language)}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">{t("herbs.notes")}</dt>
            <dd className="mt-0.5 leading-relaxed text-muted-foreground">{translateHerbText(herb.notes, language)}</dd>
          </div>
        </dl>
        {showSources && <section className="mt-5 border-t border-emerald-100 pt-4" aria-label={t("herbs.evidenceAndSourcesFor", { name: herbName })}>
          <h4 className="text-sm font-semibold text-foreground">{t("herbs.evidenceAndSources")}</h4>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{translateHerbText(evidence.scope, language)}</p>
          {sourceEntries.length ? <ul className="mt-3 space-y-2 text-xs leading-relaxed">
            {sourceEntries.map((source) => <li key={source.url}>
              <a className="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-950" href={source.url} target="_blank" rel="noreferrer">
                {source.authors} ({source.year}). {source.title}.
              </a>
              <span className="text-muted-foreground"> {source.publication}.</span>
            </li>)}
          </ul> : <p className="mt-3 text-xs text-amber-800">{t("herbs.noAcademicSource")}</p>}
        </section>}
      </CardContent>
    </Card>
  );
}
