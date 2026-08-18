<script setup lang="ts">
import type { CardGroup } from '~/types/tcgpriser';

const props = defineProps<{ group: CardGroup }>();
const { canOpenPack } = usePackOpener();

const hasOdds = computed(() => canOpenPack(props.group.expansion.technicalName));
</script>

<template>
  <NuxtLink
    :to="`/expansion/${group.expansion.technicalName}`"
    class="group relative flex flex-col rounded-xl border border-ink-700 bg-ink-900 overflow-hidden hover:border-foil-500/60 transition-colors"
  >
    <div class="aspect-16/9 bg-ink-800 flex items-center justify-center p-6">
      <img
        v-if="group.expansion.logoUrl"
        :src="group.expansion.logoUrl"
        :alt="group.expansion.name"
        class="max-h-full max-w-full object-contain"
        loading="lazy"
      />
      <span v-else class="font-display text-paper-300 text-sm">{{ group.expansion.shortName }}</span>
    </div>
    <div class="p-4 flex flex-col gap-2">
      <h3 class="font-display font-semibold text-paper-50 leading-snug">{{ group.expansion.name }}</h3>
      <div class="flex items-center gap-3 text-xs font-mono text-paper-300">
        <span>{{ group.expansion.cardCount }} cards</span>
        <span v-if="group.expansion.year">{{ group.expansion.year }}</span>
      </div>
      <span
        class="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
        :class="hasOdds ? 'bg-foil-500/15 text-foil-400' : 'bg-ink-800 text-paper-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="hasOdds ? 'bg-foil-400' : 'bg-ink-600'" />
        {{ hasOdds ? 'Pack odds available' : 'No odds yet' }}
      </span>
    </div>
  </NuxtLink>
</template>
