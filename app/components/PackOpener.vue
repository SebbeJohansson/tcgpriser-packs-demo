<script setup lang="ts">
import type { PackCard } from '~/composables/usePackOpener';
import { packCardRingStyle } from '~/composables/usePackOpener';

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

// The unpulled part of the pack, top of stack first.
const pile = ref<PileCard[]>();
// Cards already pulled, in the order they came out — shown below the stack.
const pulled = ref<PileCard[]>([]);
// Id of the card currently mid-flip at the top of the stack, just before it moves to `pulled`.
const revealingId = ref<number | null>(null);
// User preference: pull cards one at a time, or let the whole pack deal itself automatically.
const autoPull = ref(true);

// The code card and Basic Energy aren't part of the "find the hit" ritual — a real card trick
// sets them aside by feel before you ever start dealing.
const hasInserts = computed(() => !!pile.value?.some((c) => c.slot === 'energy' || c.slot === 'code'));
const allDealt = computed(() => !!pile.value && pile.value.length === 0);
const clickable = computed(() => !!pile.value && pile.value.length > 0 && !autoPull.value && revealingId.value === null);

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
  pulled.value = [];
  revealingId.value = null;
  if (autoPull.value) autoDealNext();
}

function runCardTrick() {
  if (!pile.value || !hasInserts.value) return;
  const inserts = pile.value.filter((c) => c.slot === 'energy' || c.slot === 'code');
  pile.value = pile.value.filter((c) => c.slot !== 'energy' && c.slot !== 'code');
  pulled.value.push(...inserts);
}

function revealTopCard() {
  if (!pile.value || pile.value.length === 0 || revealingId.value !== null) return;
  revealingId.value = pile.value[0]!.id;
  autoTimer = setTimeout(() => {
    pulled.value.push(pile.value!.shift()!);
    revealingId.value = null;
    if (autoPull.value) autoDealNext();
  }, 650);
}

function autoDealNext() {
  if (!pile.value || pile.value.length === 0) return;
  autoTimer = setTimeout(revealTopCard, 500);
}

function onStackClick() {
  if (autoPull.value) return;
  revealTopCard();
}

function reset() {
  clearAutoTimer();
  pile.value = undefined;
  pulled.value = [];
  revealingId.value = null;
}
</script>

<template>
  <section>
    <div v-if="pile" class="flex items-center justify-between gap-4 mb-6">
      <button
        v-if="hasInserts"
        type="button"
        class="text-xs font-mono uppercase tracking-wide text-foil-400 hover:text-foil-300 transition-colors cursor-pointer"
        @click="runCardTrick"
      >
        Run card trick
      </button>
      <p v-else-if="!allDealt" class="text-xs font-mono uppercase tracking-wide text-paper-300">
        {{ autoPull ? 'Pulling cards…' : 'Tap the pack to pull a card' }}
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

    <div v-else class="flex flex-col items-center gap-8 py-6">
      <div
        v-if="pile.length"
        class="relative w-full max-w-56 aspect-5/7 [perspective:1200px]"
        :class="clickable ? 'cursor-pointer' : ''"
        @click="onStackClick"
      >
        <div
          v-for="(item, i) in pile"
          :key="item.id"
          class="absolute inset-0 transition-transform duration-300 ease-out"
          :style="{ transform: `translate(${i * 1.4}px, ${i * 1.4}px)`, zIndex: pile.length - i }"
        >
          <div
            class="relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
            :style="{ transform: item.id === revealingId ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
          >
            <!-- back -->
            <div class="absolute inset-0 rounded-lg [backface-visibility:hidden] border border-ink-600 bg-ink-800 overflow-hidden">
              <img :src="cardBackUrl" alt="" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <!-- front -->
            <div class="absolute inset-0 rounded-lg [backface-visibility:hidden] [transform:rotateY(180deg)] p-[2px]" :style="packCardRingStyle(item)">
              <PackCardFace :item="item" :expansion-name="expansionName" />
            </div>
          </div>
        </div>
      </div>

      <TransitionGroup
        v-if="pulled.length"
        tag="div"
        name="pulled-card"
        class="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 w-full"
      >
        <div v-for="item in pulled" :key="item.id" class="aspect-5/7 rounded-lg p-[2px]" :style="packCardRingStyle(item)">
          <PackCardFace :item="item" :expansion-name="expansionName" />
        </div>
      </TransitionGroup>
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

.pulled-card-enter-active {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.pulled-card-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.92);
}
</style>
