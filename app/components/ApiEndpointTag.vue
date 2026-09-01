<script setup lang="ts">
withDefaults(defineProps<{ method?: string; path: string }>(), { method: 'GET' });
</script>

<template>
  <a
    href="https://api.tcgpriser.se/docs"
    target="_blank"
    rel="noopener noreferrer"
    :class="[
      'inline-flex max-w-full items-center gap-1.5 rounded border border-ink-700 bg-ink-800/60 px-2 py-1 font-mono text-[11px] leading-none text-paper-300 transition-colors',
      'hover:border-foil-500/40 hover:bg-ink-800 hover:text-foil-300',
    ]"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3 w-3 shrink-0 text-foil-500/70">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25M6.75 6.75 1.5 12l5.25 5.25M14.25 4.5 9.75 19.5" />
    </svg>
    <span class="shrink-0 font-semibold text-foil-400/90">{{ method }}</span>
    <span class="truncate">{{ path }}</span>
  </a>
</template>
