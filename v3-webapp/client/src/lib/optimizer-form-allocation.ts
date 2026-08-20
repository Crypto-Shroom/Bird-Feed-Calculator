import { resolveSolverCanonicalIngredientId } from "./optimizer-ingredient-identity";

/**
 * Restores a canonical solver quantity to the actual ingredient forms supplied
 * by the visitor. Allocation is proportional to available whole/split stock,
 * then resolves integral remainder by fractional share and stable identifier.
 * It never introduces a form the visitor did not enter or exceeds its stock.
 */
export function allocateCanonicalMixToInventoryForms(
  canonicalMix: Readonly<Record<string, number>>,
  inventory: Readonly<Record<string, number>>,
): Record<string, number> {
  const allocated: Record<string, number> = {};

  for (const [canonicalId, rawQuantity] of Object.entries(canonicalMix).sort(([left], [right]) => left.localeCompare(right))) {
    if (!Number.isInteger(rawQuantity) || rawQuantity < 0) throw new Error(`canonical quantity for '${canonicalId}' must be a non-negative integer`);
    if (rawQuantity === 0) continue;

    const sources = Object.entries(inventory)
      .filter(([id, available]) => resolveSolverCanonicalIngredientId(id) === canonicalId && Number.isFinite(available) && available > 0)
      .map(([id, available]) => ({ id, available: Math.floor(available) }))
      .filter(({ available }) => available > 0)
      .sort((left, right) => left.id.localeCompare(right.id));
    const totalAvailable = sources.reduce((total, source) => total + source.available, 0);

    if (totalAvailable < rawQuantity) {
      throw new Error(`canonical quantity for '${canonicalId}' exceeds actual source-form stock`);
    }

    const provisional = sources.map((source) => {
      const exact = rawQuantity * source.available / totalAvailable;
      return { ...source, quantity: Math.floor(exact), fraction: exact - Math.floor(exact) };
    });
    let remaining = rawQuantity - provisional.reduce((total, source) => total + source.quantity, 0);
    for (const source of [...provisional].sort((left, right) => right.fraction - left.fraction || left.id.localeCompare(right.id))) {
      if (remaining === 0) break;
      if (source.quantity >= source.available) continue;
      source.quantity += 1;
      remaining -= 1;
    }
    if (remaining !== 0) throw new Error(`could not allocate canonical quantity for '${canonicalId}' without exceeding source stock`);

    for (const source of provisional) {
      if (source.quantity > 0) allocated[source.id] = source.quantity;
    }
  }

  return allocated;
}
