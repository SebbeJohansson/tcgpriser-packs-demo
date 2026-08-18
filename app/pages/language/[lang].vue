<script setup lang="ts">
const lang = useRoute().params.lang as string;
const { expansionsGroupedByLanguage } = useTcgPriser();

const expansionsForLanguage = computed(() => {
  return expansionsGroupedByLanguage.value[lang] || [];
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl font-semibold text-paper-50 uppercase tracking-wide">{{ lang }} expansions</h1>
      <NuxtLink to="/" class="text-xs font-mono uppercase tracking-wide text-paper-300 hover:text-foil-400 transition-colors">
        &larr; Back
      </NuxtLink>
    </div>

    <p v-if="expansionsForLanguage.length === 0" class="text-paper-300">No expansions found for this language.</p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ExpansionTile v-for="group in expansionsForLanguage" :key="group.expansion.technicalName" :group="group" />
    </div>
  </div>
</template>
