<script setup lang="ts">
import type { PackCard } from '~/composables/usePackOpener';

const props = defineProps<{
  expansionSlug: string;
  expansionName: string;
  expansionLanguage?: string;
  packImageUrl?: string;
}>();

const { canOpenPack, openPack } = usePackOpener();
const available = computed(() => canOpenPack(props.expansionSlug));
const cardBackUrl = computed(() =>
  (props.expansionLanguage || '').toUpperCase() === 'JPN' ? '/card-backs/jpn.jpg' : '/card-backs/en.jpg'
);

interface PileCard extends PackCard {
  id: number;
}

interface Scatter {
  x: number;
  y: number;
  rot: number;
}

// The pack as a physical stack, top of pile first. Dealing moves pile[0] to the end.
const pile = ref<PileCard[]>();
// Whether "Run card trick" has settled the scattered pile into its real, sorted slot order.
const trickRun = ref(false);
// Whether the whole stack has been flipped face up (the top card's front is now showing).
const flipped = ref(false);
const dealtCount = ref(0);
// User preference, only changeable before a pack is drawn: pull cards one at a time, or let the
// trick and the deal-through happen automatically once the pack is opened.
const autoPull = ref(true);
const scatter = ref<Record<number, Scatter>>({});

const allDealt = computed(() => !!pile.value && dealtCount.value >= pile.value.length);
const clickable = computed(() => !!pile.value && trickRun.value && !autoPull.value && !allDealt.value);

let nextId = 0;
let autoTimer: ReturnType<typeof setTimeout> | undefined;

function clearAutoTimer() {
  if (autoTimer) clearTimeout(autoTimer);
  autoTimer = undefined;
}

function open() {
  const result = openPack(props.expansionSlug);
  if (!result) return;
  clearAutoTimer();
  pile.value = result.map((card) => ({ ...card, id: nextId++ }));
  trickRun.value = false;
  flipped.value = false;
  dealtCount.value = 0;
  scatter.value = {};
  for (const card of pile.value) {
    scatter.value[card.id] = {
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 16,
      rot: (Math.random() - 0.5) * 50,
    };
  }
}

function dealTopCard() {
  if (!pile.value || dealtCount.value >= pile.value.length) return;
  const top = pile.value.shift()!;
  pile.value.push(top);
  dealtCount.value++;
}

function autoDealNext() {
  if (!pile.value || dealtCount.value >= pile.value.length) return;
  autoTimer = setTimeout(() => {
    dealTopCard();
    autoDealNext();
  }, 750);
}

function runCardTrick() {
  if (!pile.value || trickRun.value) return;
  trickRun.value = true;
  if (!autoPull.value) return;
  autoTimer = setTimeout(() => {
    flipped.value = true;
    autoDealNext();
  }, 550);
}

function onStackClick() {
  if (!pile.value || autoPull.value || !trickRun.value) return;
  if (!flipped.value) {
    flipped.value = true;
    return;
  }
  dealTopCard();
}

function reset() {
  clearAutoTimer();
  pile.value = undefined;
  trickRun.value = false;
  flipped.value = false;
  dealtCount.value = 0;
  scatter.value = {};
}

function transformFor(card: PileCard, index: number): string {
  if (!trickRun.value) {
    const s = scatter.value[card.id] ?? { x: 0, y: 0, rot: 0 };
    return `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`;
  }
  return `translate(${index * 1.4}px, ${index * 1.4}px)`;
}

function ringStyle(item: PackCard) {
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
</script>

<template>
  <section>
    <div v-if="pile" class="flex items-center justify-between gap-4 mb-6">
      <button
        v-if="!trickRun"
        type="button"
        class="text-xs font-mono uppercase tracking-wide text-foil-400 hover:text-foil-300 transition-colors cursor-pointer"
        @click="runCardTrick"
      >
        Run card trick
      </button>
      <p v-else-if="!flipped" class="text-xs font-mono uppercase tracking-wide text-paper-300">
        {{ autoPull ? 'Settling the trick…' : 'Tap the pack to flip it face up' }}
      </p>
      <p v-else-if="!allDealt" class="text-xs font-mono uppercase tracking-wide text-paper-300">
        {{ autoPull ? 'Pulling cards…' : 'Tap the pack to pull the next card' }}
      </p>
      <p v-else class="text-xs font-mono uppercase tracking-wide text-foil-400">Pack complete</p>
      <button
        type="button"
        class="text-xs font-mono uppercase tracking-wide text-paper-300 hover:text-foil-400 transition-colors cursor-pointer"
        @click="reset"
      >
        Open another
      </button>
    </div>

    <p v-if="!available" class="text-sm text-paper-300">
      No community-collected pull rates for {{ expansionName }} yet, so a pack can't be simulated.
    </p>

    <div v-else-if="!pile" class="flex flex-col items-center gap-4 py-6">
      <button
        type="button"
        class="pack-sheen relative h-[min(80vh,calc(100dvh-26rem))] max-h-144 aspect-5/7 rounded-2xl border-2 border-foil-500 bg-ink-800 bg-cover bg-center flex flex-col items-center justify-end overflow-hidden hover:scale-[1.03] active:scale-[0.98] transition-transform cursor-pointer"
        :style="packImageUrl ? { backgroundImage: `url(${packImageUrl})` } : undefined"
        @click="open"
      >
        <span v-if="!packImageUrl" class="font-display text-3xl font-bold text-foil-400 tracking-widest m-auto">?</span>
        <span
          class="w-full text-[11px] font-mono uppercase tracking-widest text-foil-300 text-center py-1.5"
          :class="packImageUrl ? 'bg-gradient-to-t from-ink-950/90 to-transparent pt-4' : ''"
        >
          Tap to open
        </span>
      </button>

      <label class="flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-paper-300 cursor-pointer select-none">
        <span>Pull cards:</span>
        <button
          type="button"
          role="switch"
          :aria-checked="autoPull"
          class="relative w-9 h-5 rounded-full transition-colors cursor-pointer"
          :class="autoPull ? 'bg-foil-500' : 'bg-ink-700'"
          @click="autoPull = !autoPull"
        >
          <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-ink-950 transition-transform" :class="autoPull ? 'translate-x-4' : ''" />
        </button>
        <span class="text-paper-100">{{ autoPull ? 'Auto' : 'One at a time' }}</span>
      </label>
    </div>

    <div v-else class="flex justify-center py-6">
      <div
        class="relative w-full max-w-56 aspect-5/7 [perspective:1200px]"
        :class="clickable ? 'cursor-pointer' : ''"
        @click="onStackClick"
      >
        <div
          v-for="(item, i) in pile"
          :key="item.id"
          class="absolute inset-0 transition-transform duration-500 ease-out"
          :style="{ transform: transformFor(item, i), zIndex: pile.length - i }"
        >
          <div
            class="relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
            :style="{ transform: i === 0 && flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
          >
            <!-- back -->
            <div class="absolute inset-0 rounded-lg [backface-visibility:hidden] border border-ink-600 bg-ink-800 overflow-hidden">
              <img :src="cardBackUrl" alt="" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <!-- front -->
            <div class="absolute inset-0 rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] p-[2px]" :style="ringStyle(item)">
              <div class="w-full h-full rounded-[7px] bg-ink-900 flex flex-col overflow-hidden relative">
                <template v-if="item.slot === 'energy' || item.slot === 'code'">
                  <div class="flex-1 flex items-center justify-center p-3 text-center">
                    <span class="text-xs font-mono uppercase tracking-widest text-paper-300">
                      {{ item.slot === 'energy' ? 'Basic Energy' : 'Code Card' }}
                    </span>
                  </div>
                </template>
                <template v-else-if="item.card">
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
                </template>
              </div>
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
