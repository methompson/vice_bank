<template>
  <CommonDialog :loading="loading" @close="close" title="Add User">
    <VContainer class="px-0">
      <VRow>
        <VCol cols="12">
          <p>You must create a user to continue.</p>
        </VCol>

        <VCol>
          <VTextField
            v-model="name"
            label="Name"
            variant="outlined"
            density="compact"
          />
        </VCol>

        <VCol cols="12" class="text-center">
          <VBtn @click="saveUser" :disabled="!canSave" color="primary">
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </CommonDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import CommonDialog from '@/views/components/common_dialog.vue';

withDefaults(
  defineProps<{
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saveUser', name: string): void;
}>();

const name = ref('');

const canSave = computed(() => name.value.length > 0);

function saveUser() {
  emit('saveUser', name.value);
}

function close() {
  emit('close');
}
</script>
