<script setup lang="ts">
const { expansionsGroupedByLanguage, fetchExpansionProducts } = useTcgPriser();

await fetchExpansionProducts();

const languages = computed(() => Object.keys(expansionsGroupedByLanguage.value).sort());
</script>

<template>
  <div class="min-h-screen bg-ink-950 text-paper-50 flex flex-col">
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
        <div class="flex items-center gap-3 ml-auto">
          <a
            href="https://discord.gg/K7WkGRjetM"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            class="text-paper-300 hover:text-paper-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8923.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
          </a>
          <a
            href="https://github.com/SebbeJohansson/tcgpriser-packs-demo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="text-paper-300 hover:text-paper-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex-1 w-full">
      <NuxtPage />
    </main>
    <footer class="border-t border-ink-800">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-xs text-paper-300">
        Odds are community-collected estimates, not official rates. All information is collected from tcgpriser.se.
      </div>
    </footer>
  </div>
</template>
