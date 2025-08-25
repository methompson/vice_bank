<template>
  <VSnackbar
    :timeout="2000"
    :color="snackbarColor"
    elevation="24"
    v-model="showSnackbar"
    :location="messageLocation"
    @click="clearMessage"
  >
    {{ message }}

    <template v-slot:actions>
      <VBtn icon="mdi-close" @click="clearMessage" />
    </template>
  </VSnackbar>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import { useAppStore } from '@/stores/app_store';
import { isUndefined } from '@metools/tcheck';

const appStore = useAppStore();

const { message, messageType, messageLocation, clearMessage } =
  toRefs(appStore);

const showSnackbar = computed({
  get: () => !isUndefined(messageType) && message.value !== '',
  set(_) {
    appStore.clearMessage();
  },
});

const snackbarColor = computed(() => {
  switch (messageType.value) {
    case 'error':
      return 'red';
    case 'success':
      return 'green';
    default:
      return 'blue';
  }
});
</script>
