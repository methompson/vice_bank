<template>
  <VCard :loading="loading">
    <template v-slot:loader="{ isActive }">
      <VProgressLinear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      />
    </template>

    <VCardTitle>
      <div class="d-flex justify-space-between align-center">
        <span class="text-h6">{{ title }}</span>
        <VBtn @click="close" icon="mdi-close" variant="text" />
      </div>
    </VCardTitle>

    <VCardText class="pt-0">
      <slot />
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    loading?: boolean;
  }>(),
  {
    title: '',
    loading: false,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { title } = toRefs(props);

function close() {
  emit('close');
}
</script>
