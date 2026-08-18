import { TcgPriser } from 'tcgpriser';
import type { CardGroup } from '~/types/tcgpriser';

export default defineCachedEventHandler(async (event): Promise<Record<string, CardGroup>> => {
  const { apiServiceToken } = useRuntimeConfig(event);
  const tcgpriser = new TcgPriser({ authToken: apiServiceToken });
  const allExpansions = await tcgpriser.expansions.list();
  const candidates = allExpansions.filter((expansion) => expansion.cardCount >= 10).slice(0, 24);

  const entries = await Promise.all(
    candidates.map(async (expansion) => {
      const [expansionProducts, expansionHitRates] = await Promise.all([
        tcgpriser.expansions.products(expansion.technicalName),
        tcgpriser.packRates.get(expansion.technicalName).catch(() => undefined),
      ]);
      const boosterPack = expansionProducts.sealed.items.find(
        (product) => product.category?.technicalName === 'booster-pack'
      );

      const group: CardGroup = {
        expansion,
        cards: expansionProducts.cards.items.map((card) => {
          card.expansion = undefined;
          return card;
        }),
        packRates: expansionHitRates?.buckets || undefined,
        packSlotOrder: expansionHitRates?.slotOrder || undefined,
        packImageUrl: boosterPack?.imageUrl || undefined,
      };
      return [expansion.technicalName, group] as const;
    })
  );

  return Object.fromEntries(entries);
}, {
  maxAge: 60 * 30,
  name: 'expansions',
  getKey: () => 'all',
});
