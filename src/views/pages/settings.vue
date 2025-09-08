<template>
  <VDialog v-model="showLogs" fullscreen>
    <Logs @close="closeLogsDialog" />
  </VDialog>

  <VContainer>
    <VRow>
      <VCol>
        <span class="text-h4">Settings</span>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn color="primary" class="w-100">Clear Cache</VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn @click="showLogsDialog" color="primary" class="w-100">
          Logging
        </VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn @click="logout" color="primary" class="w-100">Logout</VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol> Copyright 2025 </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useAuthComposable } from '@/views/pages/auth_composable';
import Logs from '@/views/components/settings/logs.vue';

const { logout } = useAuthComposable();

const showLogs = ref(false);

function showLogsDialog() {
  showLogs.value = true;
}
function closeLogsDialog() {
  showLogs.value = false;
}
</script>
