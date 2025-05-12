<template>
  <VDialog v-model="userSelect">
    <VCard>
      <VCardText>
        <UserSelect @close="closeUserSelect" />
      </VCardText>
    </VCard>
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
        <span>Total Tasks in task queue: 0</span>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn color="primary" class="w-100">Clear Task Queue</VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn @click="showUserSelect" color="primary" class="w-100">
          Select a User
        </VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn color="primary" class="w-100">Logging</VBtn>
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

const { logout } = useAuthComposable();

const userSelect = ref(false);

function showUserSelect() {
  userSelect.value = true;
}

function closeUserSelect() {
  userSelect.value = false;
}
</script>
