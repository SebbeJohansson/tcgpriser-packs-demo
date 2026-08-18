import type { ExpansionCard } from '~/types/tcgpriser';

// Mirrors the pris-tabell-api Scarlet & Violet slot structure (src/scripts/generate-pack.ts):
// 4 Common, 3 Uncommon, 1 reverse-holo, 1 rare-or-better "hit" slot drawn from the expansion's
// community-collected pull rates, plus a Basic Energy and a code card for English-language packs.
const PACK_COMMON = 4;
const PACK_UNCOMMON = 3;

export type PackSlot = 'common' | 'uncommon' | 'reverse' | 'hit' | 'energy' | 'code';

// Fallback top-to-bottom slot order for expansions with no known "card trick" order recorded yet:
// the same common/uncommon/reverse/hit grouping the pack has always been drawn in.
const DEFAULT_SLOT_ORDER: PackSlot[] = ['common', 'common', 'common', 'common', 'uncommon', 'uncommon', 'uncommon', 'reverse', 'hit'];

export interface PackCard {
  // Absent for the synthetic 'energy'/'code' slots, which aren't drawn from the card pool.
  card?: ExpansionCard;
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

    // Draw each slot's cards up front, then place them by real physical position: the "card
    // trick" order collectors use to sort an unopened pack, published per-expansion by the API
    // (falls back to the historical common/uncommon/reverse/hit grouping when unknown).
    const drawnBySlot: Record<PackSlot, PackCard[]> = {
      common: Array.from({ length: PACK_COMMON }, () => ({ card: pickRandom(commonPool), slot: 'common', reverseHolo: false })),
      uncommon: Array.from({ length: PACK_UNCOMMON }, () => ({ card: pickRandom(uncommonPool), slot: 'uncommon', reverseHolo: false })),
      reverse: [{ card: pickRandom(reversePool), slot: 'reverse', reverseHolo: true }],
      hit: [{ card: pickWeighted(hitPool, weightOf), slot: 'hit', reverseHolo: false }],
      energy: [{ slot: 'energy', reverseHolo: false }],
      code: [{ slot: 'code', reverseHolo: false }],
    };

    const baseOrder = group.packSlotOrder?.length ? group.packSlotOrder : DEFAULT_SLOT_ORDER;
    // English packs include a Basic Energy and a code card; Japanese packs don't. A curated
    // slotOrder that already places them wins as-is; otherwise they default to the code card on
    // top (as inserted at the factory) and the energy card at the bottom.
    const isEnglish = (group.expansion.language || '').toUpperCase() !== 'JPN';
    const hasEnergy = baseOrder.includes('energy');
    const hasCode = baseOrder.includes('code');
    const slotOrder =
      isEnglish && !(hasEnergy && hasCode)
        ? [...(hasCode ? [] : (['code'] as PackSlot[])), ...baseOrder, ...(hasEnergy ? [] : (['energy'] as PackSlot[]))]
        : baseOrder;

    return slotOrder.map((slot) => drawnBySlot[slot].shift()!);
  };

  return { canOpenPack, openPack };
}
