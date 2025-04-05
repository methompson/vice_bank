<template>
  <VAppBar v-if="currentUser">
    <VAppBarTitle>
      <div class="text-h5">{{ currentUser.name }}</div>
      <div class="text-subtitle-2">
        {{ currentUser.currentTokens }} {{ tokensName }}
      </div>
    </VAppBarTitle>
  </VAppBar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useViceBankStore } from '@/stores/vice_bank_store';
import { computed } from 'vue';

const vbStore = useViceBankStore();
const { currentUser } = storeToRefs(vbStore);

const tokensName = computed(() => {
  const tokens = currentUser.value?.currentTokens;

  if (!tokens || tokens > 1 || tokens < 1) {
    return 'Tokens';
  } else {
    return 'Token';
  }
});
</script>
