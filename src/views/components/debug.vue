<template>
  <VContainer>
    <VRow>
      <VCol class="pa-1">
        <VBtn @click="getUsers" density="compact">Get Users</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="addUser" density="compact">Add User</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="updateUser" density="compact">Update User</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="deleteUser" density="compact">Delete User</VBtn>
      </VCol>
    </VRow>

    <!-- <VRow>
      <VCol class="pa-1">
        <VBtn @click="getActions" density="compact">Get Actions</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="addAction" density="compact">Add Action</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="updateAction" density="compact">Update Action</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="deleteAction" density="compact">Delete Action</VBtn>
      </VCol>
    </VRow> -->
  </VContainer>
</template>

<script setup lang="ts">
import * as usersAPI from '@/api/vb_users';
// import * as actionsAPI from '@/api/actions';

import { ViceBankUser } from '@vice_bank/models/vice_bank_user';

async function getUsers() {
  await usersAPI.getVBUsers();
}

async function addUser() {
  try {
    await usersAPI.addVBUser({
      name: 'test',
    });
  } catch (e) {
    console.error(e);
  }
}

async function updateUser() {
  try {
    await usersAPI.updateVBUser(
      new ViceBankUser({
        id: '2e8ac8db-6c3e-4c04-a631-210f5c7a3ada',
        userId: 'r3NVUF0c2iTEmOe42WVIGX2WkPK2',
        name: 'test_update',
      }),
    );
  } catch (e) {
    console.error(e);
  }
}

async function deleteUser() {
  try {
    await usersAPI.deleteVBUser('2e8ac8db-6c3e-4c04-a631-210f5c7a3ada');
  } catch (e) {
    console.error(e);
  }
}

// async function getActions() {
//   try {
//     await actionsAPI.getActions('e6b2a204-16af-4c62-aa06-7ce6c90caead');
//   } catch (e) {}
// }

// async function addAction() {
//   try {
//   } catch (e) {}
// }

// async function updateAction() {
//   try {
//   } catch (e) {}
// }

// async function deleteAction() {
//   try {
//   } catch (e) {}
// }
</script>
