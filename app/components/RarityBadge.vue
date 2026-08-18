<script setup lang="ts">
const props = defineProps<{ rarity: string | undefined }>();
const tier = computed(() => getRarityTier(props.rarity));
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wide"
    :style="{ color: tier.color, backgroundColor: `color-mix(in srgb, ${tier.color} 16%, transparent)` }"
  >
    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: tier.color }" />
    {{ tier.label }}
  </span>
</template>
