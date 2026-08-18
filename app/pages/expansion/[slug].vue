<script setup lang="ts">
import type { CardGroup } from '~/types/tcgpriser';
const slug = useRoute().params.slug as string;

const tcgPriser = useTcgPriser();

const expansionCards = computed(() => {
  return tcgPriser.getExpansionCards(slug);
});
const expansionPackRates = computed(() => {
  return expansionCards.value?.packRates;
});

</script>


<template>
  <div>
    <h3>Pack Rates</h3>
    <span v-if="!expansionPackRates">Warning: this expansion do not have proper community collected pack rates.</span>
    <div v-for="card in expansionCards?.cards" :key="card.id">
      {{ card.id }}
      <img :src="card.imageUrl" :alt="card.name" />
    </div>
  </div>
</template>