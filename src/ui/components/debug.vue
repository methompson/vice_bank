<template>
  <VContainer>
    <VRow>
      <VCol>
        <VBtn @click="getUsers">Get Users</VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn @click="addUser">Add Users</VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn @click="updateUser">Update Users</VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn @click="deleteUser">Delete Users</VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import {
  addVBUser,
  deleteVBUser,
  getVBUsers,
  updateVBUser,
} from '@/api/vb_user';
import { ViceBankUser } from '@vice_bank/models/vice_bank_user';

async function getUsers() {
  await getVBUsers();
}

async function addUser() {
  try {
    await addVBUser({
      name: 'test',
      currentTokens: 0,
    });
  } catch (e) {
    console.error(e);
  }
}

async function updateUser() {
  updateVBUser(
    new ViceBankUser({
      id: '2e8ac8db-6c3e-4c04-a631-210f5c7a3ada',
      userId: 'r3NVUF0c2iTEmOe42WVIGX2WkPK2',
      name: 'test_update',
      currentTokens: 20,
    }),
  );
}

async function deleteUser() {
  deleteVBUser('2e8ac8db-6c3e-4c04-a631-210f5c7a3ada');
}
</script>
