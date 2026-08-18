import { TcgPriser } from 'tcgpriser';
import type { CardGroup } from '~/types/tcgpriser';

export function useTcgPriser() {
  const expansionsByTechnicalName = useState<Record<string, CardGroup>>('expansionsByTechnicalName', () => ({}));

  const expansionsGroupedByLanguage = computed(() => {
    const grouped: Record<string, CardGroup[]> = {};
    for (const group of Object.values(expansionsByTechnicalName.value)) {
      const expansionLanguage = group.expansion.language?.toLowerCase() || 'unknown';
      (grouped[expansionLanguage] ??= []).push(group);
    }
    return grouped;
  });

  async function fetchExpansionProducts() {
    const tcgpriser = new TcgPriser();
    const allExpansions = await tcgpriser.expansions.list();

    for (const expansion of allExpansions.slice(0, 10)) {
      if (expansion.cardCount < 10) {
        console.log(`Skipping expansion ${expansion.name} due to insufficient card count (${expansion.cardCount})`);
        continue;
      }
      const expansionProducts = await tcgpriser.expansions.products(expansion.technicalName);
      const expansionHitRates = await tcgpriser.packRates.get(expansion.technicalName).catch((error) => {
        console.error(`Failed to fetch pack rates for expansion ${expansion.technicalName}:`, error);
        return undefined;
      });
      console.log("expansionHitRates", expansionHitRates);
      expansionsByTechnicalName.value[expansion.technicalName] = {
        expansion,
        cards: expansionProducts.cards.items.map((card) => {
          card.expansion = undefined;
          return card;
        }),
        packRates: expansionHitRates?.buckets || undefined,
      };
    }
  }

  const getExpansionCards = (expansionSlug: string): CardGroup | undefined => {
    return expansionsByTechnicalName.value[expansionSlug];
  };

  return {
    expansionsGroupedByLanguage,
    fetchExpansionProducts,
    getExpansionCards,
  };
}
