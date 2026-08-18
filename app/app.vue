<script setup lang="ts">
const { expansionsGroupedByLanguage, fetchExpansionProducts } = useTcgPriser();

await fetchExpansionProducts();
</script>

<template>
  <div>
    {{ Object.keys(expansionsGroupedByLanguage) }}
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink v-for="language in Object.keys(expansionsGroupedByLanguage)" :to="`/language/${language}`">
      {{ language }}
    </NuxtLink>
    <NuxtPage />
    <!-- {{ cardsGroupedByLanguage?.['eng']?.[0] }} -->
  </div>
</template>
