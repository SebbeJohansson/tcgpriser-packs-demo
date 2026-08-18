<script setup lang="ts">
import type { PackCard } from '~/composables/usePackOpener';

const props = defineProps<{ expansionSlug: string; expansionName: string }>();

const { canOpenPack, openPack } = usePackOpener();
const available = computed(() => canOpenPack(props.expansionSlug));

const drawn = ref<PackCard[]>();
const revealed = ref<boolean[]>([]);
const opening = ref(false);

function open() {
  const result = openPack(props.expansionSlug);
  if (!result) return;
  drawn.value = result;
  revealed.value = result.map(() => false);
  opening.value = true;
  result.forEach((_, i) => {
    setTimeout(() => {
      revealed.value[i] = true;
    }, 260 + i * 170);
  });
}

function reset() {
  drawn.value = undefined;
  revealed.value = [];
  opening.value = false;
}

function ringStyle(item: PackCard) {
  const tier = getRarityTier(item.card.rarity);
  if (tier.foil) {
    return {
      background:
        'conic-gradient(from 180deg, var(--color-foil-300), var(--color-rarity-hyper), var(--color-foil-500), var(--color-rarity-illustration), var(--color-foil-300))',
    };
  }
  return { background: tier.color };
}
</script>

<template>
  <section class="rounded-2xl border border-ink-700 bg-ink-900/60 p-6 sm:p-8">
    <div class="flex items-center justify-between gap-4 mb-6">
      <h2 class="font-display text-lg font-semibold text-paper-50">Open a pack</h2>
      <button
        v-if="drawn"
        type="button"
        class="text-xs font-mono uppercase tracking-wide text-paper-300 hover:text-foil-400 transition-colors"
        @click="reset"
      >
        Open another
      </button>
    </div>

    <p v-if="!available" class="text-sm text-paper-300">
      No community-collected pull rates for {{ expansionName }} yet, so a pack can't be simulated.
    </p>

    <div v-else-if="!drawn" class="flex flex-col items-center py-6">
      <button
        type="button"
        class="pack-sheen relative w-40 aspect-5/7 rounded-2xl border-2 border-foil-500 bg-ink-800 flex flex-col items-center justify-center gap-2 overflow-hidden hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer"
        @click="open"
      >
        <span class="font-display text-3xl font-bold text-foil-400 tracking-widest">?</span>
        <span class="text-[11px] font-mono uppercase tracking-widest text-foil-300">Tap to open</span>
      </button>
      <p class="mt-4 text-xs text-paper-300 font-mono">9 cards · 4 common · 3 uncommon · 1 reverse · 1 hit</p>
    </div>

    <div v-else class="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
      <div v-for="(item, i) in drawn" :key="i" class="[perspective:1200px] aspect-5/7">
        <div
          class="relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
          :style="{ transform: revealed[i] ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
        >
          <!-- back -->
          <div
            class="absolute inset-0 rounded-lg [backface-visibility:hidden] border border-ink-600 bg-ink-800 flex items-center justify-center"
          >
            <span class="font-display text-foil-400/70 text-xl">?</span>
          </div>
          <!-- front -->
          <div class="absolute inset-0 rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] p-[2px]" :style="ringStyle(item)">
            <div class="w-full h-full rounded-[7px] bg-ink-900 flex flex-col overflow-hidden relative">
              <span
                v-if="item.slot === 'hit'"
                class="absolute top-1 left-1 z-10 text-[9px] font-mono uppercase tracking-widest bg-ink-950/80 text-foil-400 px-1.5 py-0.5 rounded"
              >
                Hit
              </span>
              <span
                v-if="item.reverseHolo"
                class="absolute top-1 right-1 z-10 text-[9px] font-mono uppercase tracking-widest bg-ink-950/80 text-paper-100 px-1.5 py-0.5 rounded"
              >
                Reverse
              </span>
              <div class="flex-1 bg-ink-800 min-h-0">
                <img
                  v-if="item.card.imageUrl"
                  :src="item.card.imageUrl"
                  :alt="displayCardName(item.card.name, expansionName)"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p class="px-1.5 py-1 text-[11px] text-paper-50 truncate" :title="displayCardName(item.card.name, expansionName)">
                {{ displayCardName(item.card.name, expansionName) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pack-sheen::after {
  content: '';
  position: absolute;
  inset: -50%;
  background: linear-gradient(115deg, transparent 40%, color-mix(in srgb, var(--color-foil-300) 55%, transparent) 50%, transparent 60%);
  animation: sheen 3.2s ease-in-out infinite;
}

@keyframes sheen {
  0% {
    transform: translateX(-40%);
  }
  100% {
    transform: translateX(40%);
  }
}
</style>
