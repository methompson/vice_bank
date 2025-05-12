<template>
  <VAppBar v-if="currentUser">
    <VAppBarTitle>
      <div class="text-h5">{{ currentUser.name }}</div>
      <div class="text-subtitle-2">{{ currentTokens }} {{ tokensName }}</div>
    </VAppBarTitle>
  </VAppBar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useViceBankStore } from '@/stores/vice_bank_store';
import { computed } from 'vue';
import { getTokensEarnedString } from '@/utils/tokens_earned';

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
</script>
