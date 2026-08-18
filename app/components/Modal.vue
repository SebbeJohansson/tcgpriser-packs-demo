<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function close() {
  emit('update:modelValue', false);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

watch(
  () => props.modelValue,
  (open) => {
    if (import.meta.client) document.body.style.overflow = open ? 'hidden' : '';
  }
);

onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6" @keydown="onKeydown">
        <div class="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" @click="close" />

        <div
          class="relative w-full max-w-3xl max-h-[85dvh] flex flex-col bg-ink-900 border border-ink-700 rounded-xl shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between gap-4 px-5 py-4 border-b border-ink-700 shrink-0">
            <h2 v-if="title" class="font-display text-lg font-semibold text-paper-50">{{ title }}</h2>
            <span v-else />
            <button
              type="button"
              class="text-xs font-mono uppercase tracking-wide text-paper-300 hover:text-foil-400 transition-colors cursor-pointer"
              @click="close"
            >
              Close
            </button>
          </div>

          <div class="overflow-y-auto px-5 py-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
