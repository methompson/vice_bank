<template>
  <NoUserSelected>
    <div>
      <VRow class="pa-2">
        <VCol cols="12" sm="6">
          <VCard :color="cardColor">
            <VCardTitle> Purchases </VCardTitle>

            <VCardText>
              <VRow>
                <VCol cols="12">
                  <div>Past Week Purchases</div>
                </VCol>
                <VCol cols="12">
                  <div>0</div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" sm="6">
          <VCard :color="cardColor">
            <VCardTitle> Deposits </VCardTitle>

            <VCardText>
              <VRow>
                <VCol cols="12">
                  <div>Past Week Deposits</div>
                </VCol>
                <VCol cols="12">
                  <div>0</div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </NoUserSelected>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useAppStore } from '@/stores/app_store';

import NoUserSelected from '@/views/components/root_components/no_user_selected.vue';

const appStore = useAppStore();

const cardColor = computed(() => {
  return appStore.isDarkMode ? 'surface-dark' : 'surface-light';
});
</script>
