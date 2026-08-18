export interface RarityTier {
  label: string;
  color: string;
  /** Reserved for the top of the ladder — the only place a gradient (real foil, not decoration) shows up. */
  foil: boolean;
}

const TIERS: { test: (r: string) => boolean; tier: RarityTier }[] = [
  { test: (r) => r.includes('hyper') || r.includes('secret'), tier: { label: 'Hyper rare', color: 'var(--color-rarity-hyper)', foil: true } },
  { test: (r) => r.includes('special illustration'), tier: { label: 'Special illustration rare', color: 'var(--color-rarity-special-illustration)', foil: true } },
  { test: (r) => r.includes('illustration'), tier: { label: 'Illustration rare', color: 'var(--color-rarity-illustration)', foil: false } },
  { test: (r) => r.includes('ultra'), tier: { label: 'Ultra rare', color: 'var(--color-rarity-ultra)', foil: false } },
  { test: (r) => r.includes('double'), tier: { label: 'Double rare', color: 'var(--color-rarity-double-rare)', foil: false } },
  { test: (r) => r.includes('rare'), tier: { label: 'Rare', color: 'var(--color-rarity-rare)', foil: false } },
  { test: (r) => r.includes('uncommon'), tier: { label: 'Uncommon', color: 'var(--color-rarity-uncommon)', foil: false } },
  { test: (r) => r.includes('common'), tier: { label: 'Common', color: 'var(--color-rarity-common)', foil: false } },
];

export function getRarityTier(rarity: string | undefined): RarityTier {
  const normalized = (rarity || '').toLowerCase();
  const match = TIERS.find(({ test }) => test(normalized));
  return match?.tier ?? { label: rarity || 'Unknown', color: 'var(--color-rarity-common)', foil: false };
}
