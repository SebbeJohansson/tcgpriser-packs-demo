import type { ExpansionCard } from '~/types/tcgpriser';

export type PackSlot = 'common' | 'uncommon' | 'reverse' | 'hit' | 'energy' | 'code';

// Fallback top-to-bottom slot order for expansions with no known "card trick" order recorded yet.
// English mirrors the pris-tabell-api Scarlet & Violet slot structure (src/scripts/generate-pack.ts):
// 4 Common, 3 Uncommon, 1 reverse-holo, 1 rare-or-better "hit" slot, plus a Basic Energy and a code
// card. Japanese packs are a smaller, different physical product (no reverse-holo/energy/code slot):
// 3 Common, 1 Uncommon, 1 "hit" slot — 5 cards total.
const DEFAULT_SLOT_ORDER_ENG: PackSlot[] = ['common', 'common', 'common', 'common', 'uncommon', 'uncommon', 'uncommon', 'reverse', 'hit'];
const DEFAULT_SLOT_ORDER_JPN: PackSlot[] = ['common', 'common', 'common', 'uncommon', 'hit'];

export interface PackCard {
  // Absent for the synthetic 'energy'/'code' slots, which aren't drawn from the card pool.
  card?: ExpansionCard;
  slot: PackSlot;
  reverseHolo: boolean;
}

/** Border/ring color for a card face: foil gradient for foil rarities, a flat tier color otherwise,
 * and a plain neutral ring for the synthetic energy/code slots (which have no rarity). */
export function packCardRingStyle(item: PackCard) {
  if (!item.card) return { background: 'var(--color-ink-700)' };
  const tier = getRarityTier(item.card.rarity);
  if (tier.foil) {
    return {
      background:
        'conic-gradient(from 180deg, var(--color-foil-300), var(--color-rarity-hyper), var(--color-foil-500), var(--color-rarity-illustration), var(--color-foil-300))',
    };
  }
  return { background: tier.color };
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

    const isEnglish = (group.expansion.language || '').toUpperCase() !== 'JPN';
    const baseOrder = group.packSlotOrder?.length ? group.packSlotOrder : isEnglish ? DEFAULT_SLOT_ORDER_ENG : DEFAULT_SLOT_ORDER_JPN;
    // English packs include a Basic Energy and a code card; Japanese packs don't. A curated
    // slotOrder that already places them wins as-is; otherwise they default to the code card on
    // top (as inserted at the factory) and the energy card at the bottom.
    const hasEnergy = baseOrder.includes('energy');
    const hasCode = baseOrder.includes('code');
    const slotOrder =
      isEnglish && !(hasEnergy && hasCode)
        ? [...(hasCode ? [] : (['code'] as PackSlot[])), ...baseOrder, ...(hasEnergy ? [] : (['energy'] as PackSlot[]))]
        : baseOrder;

    // Draw each slot's cards up front, then place them by real physical position: the "card
    // trick" order collectors use to sort an unopened pack, published per-expansion by the API
    // (falls back to the language-appropriate default grouping when unknown). Counts come from the
    // resolved slot order itself rather than a hardcoded constant, so a Japanese pack's smaller
    // common/uncommon composition is honored too.
    const countOf = (slot: PackSlot) => slotOrder.filter((s) => s === slot).length;
    const drawnBySlot: Record<PackSlot, PackCard[]> = {
      common: Array.from({ length: countOf('common') }, () => ({ card: pickRandom(commonPool), slot: 'common', reverseHolo: false })),
      uncommon: Array.from({ length: countOf('uncommon') }, () => ({ card: pickRandom(uncommonPool), slot: 'uncommon', reverseHolo: false })),
      reverse: Array.from({ length: countOf('reverse') }, () => ({ card: pickRandom(reversePool), slot: 'reverse', reverseHolo: true })),
      hit: [{ card: pickWeighted(hitPool, weightOf), slot: 'hit', reverseHolo: false }],
      energy: [{ slot: 'energy', reverseHolo: false }],
      code: [{ slot: 'code', reverseHolo: false }],
    };

    return slotOrder.map((slot) => drawnBySlot[slot].shift()!);
  };

  return { canOpenPack, openPack };
}
