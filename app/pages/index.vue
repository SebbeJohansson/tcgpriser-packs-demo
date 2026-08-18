<script setup lang="ts">
const { expansionsGroupedByLanguage } = useTcgPriser();

const languages = computed(() => Object.keys(expansionsGroupedByLanguage.value).sort());

const languageLabels: Record<string, string> = {
  eng: 'English',
  jpn: 'Japanese',
  chi: 'Chinese',
};
</script>

<template>
  <div class="flex flex-col gap-16">
    <section class="flex flex-col gap-4 max-w-2xl">
      <h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-paper-50 text-balance">
        Know your odds before you rip the pack.
      </h1>
      <p class="text-paper-100 leading-relaxed">
        Browse expansions, check community-collected pull rates, and simulate opening a booster
        pack using real card pools and rarity weights.
      </p>
    </section>

    <section v-for="language in languages" :key="language" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-xl font-semibold text-paper-50">
          {{ languageLabels[language] ?? language.toUpperCase() }}
        </h2>
        <NuxtLink :to="`/language/${language}`" class="text-xs font-mono uppercase tracking-wide text-paper-300 hover:text-foil-400 transition-colors">
          View all
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ExpansionTile v-for="group in expansionsGroupedByLanguage[language]" :key="group.expansion.technicalName" :group="group" />
      </div>
    </section>
  </div>
</template>
