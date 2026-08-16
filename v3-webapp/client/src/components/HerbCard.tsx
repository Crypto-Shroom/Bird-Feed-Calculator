// Design contract: Modern Agrarian / Organic Tech — clear botanical reference cards with warm, calm hierarchy and no dashboard-density styling.
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Herb } from "@/lib/data";
import { getHerbEvidence, HERB_SOURCES } from "@/lib/herb-evidence";

interface HerbCardProps {
  name: string;
  herb: Herb;
  showSources?: boolean;
}

export function HerbCard({ name, herb, showSources = false }: HerbCardProps) {
  const evidence = getHerbEvidence(name);
  const sourceEntries = evidence.sourceIds.map((sourceId) => HERB_SOURCES[sourceId]);
  const safetyLabel = evidence.eligibility === "eligible"
    ? evidence.compatibleBirds.length === 1 && evidence.compatibleBirds[0] === "pigeon"
      ? "Pigeon-only automatic suggestion"
      : "Eligible for automatic suggestions"
    : evidence.eligibility === "do_not_suggest"
      ? "Not automatically suggested"
      : "Reference only";
  const safetyClass = evidence.eligibility === "eligible"
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : evidence.eligibility === "do_not_suggest"
      ? "border-red-300 bg-red-50 text-red-900"
      : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <Card className="border-emerald-100 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
      <CardContent className="p-5">
        <h3 className="font-display text-xl font-bold capitalize text-foreground">{name.replace(/_/g, " ")}</h3>
        {showSources && <Badge variant="outline" className={`mt-3 ${safetyClass}`}>{safetyLabel}</Badge>}
        <div className="mt-3 flex flex-wrap gap-2">
          {herb.benefits.map((benefit) => <Badge key={benefit} variant="secondary" className="bg-emerald-50 text-emerald-900 hover:bg-emerald-100">{benefit}</Badge>)}
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-foreground">Dosage per 1 kg batch</dt>
            <dd className="mt-0.5 text-muted-foreground">{herb.dosage_per_kg}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Notes</dt>
            <dd className="mt-0.5 leading-relaxed text-muted-foreground">{herb.notes}</dd>
          </div>
        </dl>
        {showSources && <section className="mt-5 border-t border-emerald-100 pt-4" aria-label={`Evidence and sources for ${name.replace(/_/g, " ")}`}>
          <h4 className="text-sm font-semibold text-foreground">Evidence & source notes</h4>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{evidence.scope}</p>
          {sourceEntries.length ? <ul className="mt-3 space-y-2 text-xs leading-relaxed">
            {sourceEntries.map((source) => <li key={source.url}>
              <a className="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-950" href={source.url} target="_blank" rel="noreferrer">
                {source.authors} ({source.year}). {source.title}.
              </a>
              <span className="text-muted-foreground"> {source.publication}.</span>
            </li>)}
          </ul> : <p className="mt-3 text-xs text-amber-800">No academic source is linked to this individual record yet; it is shown for reference, not as an automatic recommendation.</p>}
        </section>}
      </CardContent>
    </Card>
  );
}
