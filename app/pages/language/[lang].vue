<script setup lang="ts">
const lang = useRoute().params.lang as string;
const { expansionsGroupedByLanguage } = useTcgPriser();

const expansionsForLanguage = computed(() => {
  return expansionsGroupedByLanguage.value[lang] || [];
});
</script>


<template>
    <div v-for="expansion in expansionsForLanguage" :key="expansion.expansion.technicalName">
        <NuxtLink :to="`/expansion/${expansion.expansion.technicalName}`">
            <img :src="expansion.expansion.logoUrl" :alt="expansion.expansion.name" />
            <h5>Pack Rates</h5>
            <span v-if="!expansion.packRates">Warning: this expansion do not have proper community collected pack rates.</span>
        </NuxtLink>
    </div>
</template>