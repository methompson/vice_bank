<template>
  <VAppBar v-if="currentUser">
    <VAppBarTitle>
      <div class="text-h5">{{ currentUser.name }}</div>
      <div class="text-subtitle-2">{{ currentTokens }} {{ tokensName }}</div>
    </VAppBarTitle>
    <template v-slot:append>
      <VBtn @click="refresh" icon="mdi-refresh" />
    </template>
  </VAppBar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useViceBankStore } from '@/stores/vice_bank_store';
import { useLoggerStore } from '@/stores/logger_store';
import { useAppStore } from '@/stores/app_store';

import { getTokensEarnedString } from '@/utils/tokens_earned';
import {
  fetchActionAndTaskData,
  fetchPurchaseData,
} from '@/views/pages/history_composable';

const loggerStore = useLoggerStore();
const appStore = useAppStore();
const vbStore = useViceBankStore();
const { currentUser, currentUserTokens } = storeToRefs(vbStore);

const currentTokens = computed(() =>
  getTokensEarnedString(currentUserTokens.value),
);

const tokensName = computed(() => {
  const tokens = currentUserTokens.value;

  if (!tokens || tokens > 1 || tokens < 1) {
    return 'Tokens';
  } else {
    return 'Token';
  }
});

async function refresh() {
  const vbUserId = currentUser.value?.id;

  if (!vbUserId) {
    return;
  }

  try {
    await Promise.all([
      fetchPurchaseData(vbUserId),
      fetchActionAndTaskData(vbUserId),
      vbStore.getUserTokens(),
    ]);

    appStore.setSuccessMessage({
      message: 'Data refreshed successfully',
    });
  } catch (e) {
    loggerStore.addErrorLog(`Error refreshing data: ${e}`);
    appStore.setErrorMessage({
      message: 'Error refreshing data',
    });
  }
}
</script>
