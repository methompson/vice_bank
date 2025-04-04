<template>
  <VAppBar v-if="currentUser">
    <VAppBarTitle>Mat T. Tokens, etc.</VAppBarTitle>
  </VAppBar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useViceBankStore } from '@/stores/vice_bank_store';

const vbStore = useViceBankStore();
const { currentUser } = storeToRefs(vbStore);
</script>
