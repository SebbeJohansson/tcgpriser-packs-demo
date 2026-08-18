<script setup lang="ts">
import type { PackCard } from '~/composables/usePackOpener';

defineProps<{
  item: PackCard;
  expansionName: string;
}>();
</script>

<template>
  <div class="w-full h-full rounded-[7px] bg-ink-900 flex flex-col overflow-hidden relative">
    <div v-if="item.slot === 'energy' || item.slot === 'code'" class="flex-1 flex items-center justify-center p-3 text-center">
      <span class="text-xs font-mono uppercase tracking-widest text-paper-300">
        {{ item.slot === 'energy' ? 'Basic Energy' : 'Code Card' }}
      </span>
    </div>
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
</template>
