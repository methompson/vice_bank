<template>
  <VContainer>
    <VRow>
      <template v-for="user in vbUsers" :key="user.id">
        <VCol cols="12" md="4">
          <VCard @click="userClick(user)">
            <VCardText>
              <VRow>
                <VCol>
                  <VAvatar icon="mdi-account-outline" />
                </VCol>

                <VCol>
                  {{ user.name }}
                </VCol>
              </VRow>

              <VRow>
                <VCol> Current Tokens: {{ user.currentTokens }} </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </template>
    </VRow>

    <VRow>
      <VCol class="text-center">
        <VBtn color="primary"> Add a New User </VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol class="text-center">
        <VBtn @click="deselectUser" color="primary"> Deselect User </VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';

import { useViceBankStore } from '@/stores/vice_bank_store';
import type { ViceBankUser } from '@vice_bank/models/vice_bank_user';

const vbStore = useViceBankStore();
const { vbUsers } = storeToRefs(vbStore);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

async function onBeforeMountHandler() {
  try {
    await vbStore.getUsers();
  } catch (e) {
    console.error('Error fetching users:', e);
  }
}

onBeforeMount(onBeforeMountHandler);

function userClick(user: ViceBankUser) {
  vbStore.setCurrentUser(user);
  emit('close');
}

function deselectUser() {
  vbStore.clearCurrentUser();
}
</script>
