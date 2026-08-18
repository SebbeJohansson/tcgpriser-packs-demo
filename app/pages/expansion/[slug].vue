<script setup lang="ts">
const slug = useRoute().params.slug as string;

const { getExpansionCards } = useTcgPriser();

const group = computed(() => getExpansionCards(slug));
const expansion = computed(() => group.value?.expansion);

const showDetails = ref(false);

const oddsRows = computed(() => {
  const buckets = group.value?.packRates;
  if (!buckets?.length) return [];
  const total = buckets.reduce((sum, b) => sum + b.weight, 0);
  return [...buckets]
    .sort((a, b) => b.weight - a.weight)
    .map((bucket) => ({
      ...bucket,
      tier: getRarityTier(bucket.rarity),
      percent: total > 0 ? (bucket.weight / total) * 100 : 0,
    }));
});
</script>

<template>
  <div v-if="!expansion" class="text-paper-300">Expansion not found.</div>

  <div v-else class="flex flex-col gap-8">
    <div class="flex items-center justify-between gap-4">
      <NuxtLink to="/" class="text-xs font-mono uppercase tracking-wide text-paper-300 hover:text-foil-400 transition-colors w-fit">
        &larr; Back
      </NuxtLink>
      <button
        type="button"
        class="text-xs font-mono uppercase tracking-wide text-paper-300 hover:text-foil-400 transition-colors cursor-pointer"
        @click="showDetails = !showDetails"
      >
        {{ showDetails ? 'Hide details' : 'Show details' }}
      </button>
    </div>

    <h1 class="font-display text-2xl sm:text-3xl font-bold text-paper-50 text-center">{{ expansion.name }}</h1>

    <PackOpener
      :expansion-slug="slug"
      :expansion-name="expansion.name"
      :expansion-language="expansion.language"
      :pack-image-url="group?.packImageUrl"
    />

    <div v-if="showDetails" class="flex flex-col gap-10">
      <header class="flex flex-col sm:flex-row sm:items-center gap-6">
        <div class="w-full sm:w-56 aspect-16/9 bg-ink-900 border border-ink-700 rounded-xl flex items-center justify-center p-4 shrink-0">
          <img v-if="expansion.logoUrl" :src="expansion.logoUrl" :alt="expansion.name" class="max-h-full max-w-full object-contain" />
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm font-mono text-paper-300">
          <span>{{ expansion.language }}</span>
          <span v-if="expansion.year">· {{ expansion.year }}</span>
          <span>· {{ expansion.cardCount }} cards</span>
          <span v-if="expansion.sealedCount">· {{ expansion.sealedCount }} sealed products</span>
        </div>
      </header>

      <section v-if="oddsRows.length" class="flex flex-col gap-3">
        <h2 class="font-display text-lg font-semibold text-paper-50">Hit-slot odds</h2>
        <p class="text-xs text-paper-300 -mt-1">
          Every pack carries 4 common, 3 uncommon, and 1 reverse holo, plus one rare-or-better "hit" slot.
          These are the community-collected odds for that hit slot, normalised to 100%.
        </p>
        <div class="flex flex-col gap-2 max-w-xl">
          <div v-for="row in oddsRows" :key="row.rarity" class="flex items-center gap-3">
            <span class="w-40 shrink-0 text-sm text-paper-100 truncate">{{ row.tier.label }}</span>
            <div class="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
              <div class="h-full rounded-full" :style="{ width: `${row.percent}%`, backgroundColor: row.tier.color }" />
            </div>
            <span class="w-14 shrink-0 text-right text-xs font-mono text-paper-300">{{ row.percent.toFixed(1) }}%</span>
          </div>
        </div>
      </section>

      <section v-if="group?.cards.length" class="flex flex-col gap-4">
        <h2 class="font-display text-lg font-semibold text-paper-50">All cards</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <CardTile v-for="card in group.cards" :key="card.id" :card="card" :expansion-name="expansion.name" />
        </div>
      </section>
    </div>
  </div>
</template>
