import type { ExpansionCard } from '~/types/tcgpriser';

// Mirrors the pris-tabell-api Scarlet & Violet slot structure (src/scripts/generate-pack.ts):
// 4 Common, 3 Uncommon, 1 reverse-holo, 1 rare-or-better "hit" slot drawn from the expansion's
// community-collected pull rates. Energy and code cards aren't modelled.
const PACK_COMMON = 4;
const PACK_UNCOMMON = 3;

export type PackSlot = 'common' | 'uncommon' | 'reverse' | 'hit';

export interface PackCard {
  card: ExpansionCard;
  slot: PackSlot;
  reverseHolo: boolean;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickWeighted<T>(items: T[], weightOf: (item: T) => number): T {
  const total = items.reduce((sum, item) => sum + weightOf(item), 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= weightOf(item);
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

export function usePackOpener() {
  const { getExpansionCards } = useTcgPriser();

  const canOpenPack = (expansionSlug: string): boolean => {
    const group = getExpansionCards(expansionSlug);
    if (!group?.packRates?.length) return false;

    const cards = group.cards;
    const weightByRarity = new Map(group.packRates.map((bucket) => [bucket.rarity.toLowerCase(), bucket.weight]));
    const weightOf = (rarity?: string) => weightByRarity.get((rarity || '').toLowerCase()) ?? 0;

    const hasCommon = cards.some((c) => (c.rarity || '').toLowerCase() === 'common');
    const hasUncommon = cards.some((c) => (c.rarity || '').toLowerCase() === 'uncommon');
    const hasHit = cards.some((c) => weightOf(c.rarity) > 0);
    return hasCommon && hasUncommon && hasHit;
  };

  const openPack = (expansionSlug: string): PackCard[] | undefined => {
    const group = getExpansionCards(expansionSlug);
    if (!group?.packRates?.length) return undefined;

    const cards = group.cards;
    const rarityOf = (c: ExpansionCard) => (c.rarity || '').toLowerCase();

    const commonPool = cards.filter((c) => rarityOf(c) === 'common');
    const uncommonPool = cards.filter((c) => rarityOf(c) === 'uncommon');
    const reversePool = cards.filter((c) => ['common', 'uncommon', 'rare'].includes(rarityOf(c)));

    const weightByRarity = new Map(group.packRates.map((bucket) => [bucket.rarity.toLowerCase(), bucket.weight]));
    const weightOf = (c: ExpansionCard) => weightByRarity.get(rarityOf(c)) ?? 0;
    const hitPool = cards.filter((c) => weightOf(c) > 0);

    if (commonPool.length === 0 || uncommonPool.length === 0 || hitPool.length === 0) return undefined;

    const pack: PackCard[] = [];
    for (let i = 0; i < PACK_COMMON; i++) {
      pack.push({ card: pickRandom(commonPool), slot: 'common', reverseHolo: false });
    }
    for (let i = 0; i < PACK_UNCOMMON; i++) {
      pack.push({ card: pickRandom(uncommonPool), slot: 'uncommon', reverseHolo: false });
    }
    pack.push({ card: pickRandom(reversePool), slot: 'reverse', reverseHolo: true });
    pack.push({ card: pickWeighted(hitPool, weightOf), slot: 'hit', reverseHolo: false });

    return pack;
  };

  return { canOpenPack, openPack };
}
