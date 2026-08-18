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
    const { data } = await useFetch<Record<string, CardGroup>>('/api/expansions', { key: 'expansions' });
    if (data.value) {
      expansionsByTechnicalName.value = data.value;
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
