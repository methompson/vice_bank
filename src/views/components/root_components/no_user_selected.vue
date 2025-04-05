<template>
  <template v-if="showUserSelect">
    <VRow>
      <VCol class="text-center">
        <div>No User Selected</div>
        <div>Select a User</div>
      </VCol>
    </VRow>
    <UserSelect />
  </template>

  <slot v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useViceBankStore } from '@/stores/vice_bank_store';
import UserSelect from '@/views/components/user_select.vue';

const vbStore = useViceBankStore();

const { currentUser } = storeToRefs(vbStore);

const showUserSelect = computed(() => {
  return !currentUser.value;
});
</script>
