// Design contract: Modern Agrarian / Organic Tech — clear botanical reference cards with warm, calm hierarchy and no dashboard-density styling.
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Herb } from "@/lib/data";

interface HerbCardProps {
  name: string;
  herb: Herb;
}

export function HerbCard({ name, herb }: HerbCardProps) {
  return (
    <Card className="border-emerald-100 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none">
      <CardContent className="p-5">
        <h3 className="font-display text-xl font-bold capitalize text-foreground">{name.replace(/_/g, " ")}</h3>
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
      </CardContent>
    </Card>
  );
}
