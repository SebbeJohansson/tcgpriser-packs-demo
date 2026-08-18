<script setup lang="ts">
import type { ExpansionCard } from '~/types/tcgpriser';

const props = defineProps<{ card: ExpansionCard; expansionName?: string }>();
const name = computed(() => displayCardName(props.card.name, props.expansionName));
</script>

<template>
  <div class="flex flex-col rounded-lg border border-ink-700 bg-ink-900 overflow-hidden">
    <div class="aspect-5/7 bg-ink-800">
      <img
        v-if="card.imageUrl"
        :src="card.imageUrl"
        :alt="name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div class="p-2.5 flex flex-col gap-1.5">
      <p class="text-sm text-paper-50 leading-tight truncate" :title="name">{{ name }}</p>
      <div class="flex items-center justify-between text-xs font-mono text-paper-300">
        <span>{{ card.cardNumber }}</span>
        <span v-if="card.retailPrice">{{ card.retailPrice }} kr</span>
      </div>
      <RarityBadge :rarity="card.rarity" />
    </div>
  </div>
</template>
