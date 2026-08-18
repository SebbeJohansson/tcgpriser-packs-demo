<script setup lang="ts">
const { expansionsGroupedByLanguage, fetchExpansionProducts } = useTcgPriser();

await fetchExpansionProducts();

const languages = computed(() => Object.keys(expansionsGroupedByLanguage.value).sort());
</script>

<template>
  <div class="min-h-screen bg-ink-950 text-paper-50">
    <header class="border-b border-ink-800 bg-ink-950/90 backdrop-blur sticky top-0 z-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center gap-6">
        <NuxtLink to="/" class="font-display text-xl font-semibold tracking-tight text-paper-50">
          <span class="text-foil-400">Pack</span>Odds
        </NuxtLink>
        <nav class="flex items-center gap-1 text-sm overflow-x-auto">
          <NuxtLink
            v-for="language in languages"
            :key="language"
            :to="`/language/${language}`"
            class="px-3 py-1.5 rounded-full text-paper-100 hover:text-paper-50 hover:bg-ink-800 transition-colors whitespace-nowrap uppercase tracking-wide text-xs font-medium"
            active-class="bg-ink-800 text-foil-400"
          >
            {{ language }}
          </NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <NuxtPage />
    </main>
    <footer class="border-t border-ink-800 mt-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-xs text-paper-300">
        Odds are community-collected estimates, not official rates. All information is collected from tcgpriser.se.
      </div>
    </footer>
  </div>
</template>
