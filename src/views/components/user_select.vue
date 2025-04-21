<template>
  <VContainer>
    <VRow>
      <template v-for="dat in vbUsersAndTokens" :key="dat.user.id">
        <VCol cols="12" md="4">
          <VCard @click="userClick(dat.user)">
            <VCardText>
              <VRow>
                <VCol align-self="center" cols="auto" class="pa-0 text-left">
                  <VAvatar icon="mdi-account-outline" />
                </VCol>

                <VCol align-self="center" class="pa-0">
                  {{ dat.user.name }}
                </VCol>

                <VCol> Current Tokens: {{ dat.currentTokens }} </VCol>

                <VCol align-self="center" class="pa-0 text-right">
                  <VMenu>
                    <template v-slot:activator="{ props }">
                      <VBtn
                        v-bind="props"
                        variant="text"
                        size="small"
                        icon="mdi-pencil"
                      />
                    </template>

                    <VList>
                      <VListItem
                        value="delete"
                        item="delete"
                        @click="deleteUser(dat.user)"
                      >
                        <VListItemTitle>Delete</VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </template>
    </VRow>

    <VRow>
      <VCol class="text-center">
        <VBtn @click="showAddUser" color="primary"> Add a New User </VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol class="text-center">
        <VBtn @click="deselectUser" color="primary"> Deselect User </VBtn>
      </VCol>
    </VRow>
  </VContainer>

  <VDialog v-model="showAddUserDialog" max-width="600px">
    <AddUserDialog
      :loading="loading"
      @saveUser="saveNewUser"
      @close="closeAddUser"
    />
  </VDialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useViceBankStore } from '@/stores/vice_bank_store';
import type { ViceBankUser } from '@vice_bank/models/vice_bank_user';

import AddUserDialog from '@/views/components/dialogs/add_user_dialog.vue';
import { useAppStore } from '@/stores/app_store';

const appStore = useAppStore();
const vbStore = useViceBankStore();
const { vbUsersAndTokens } = storeToRefs(vbStore);

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

const showAddUserDialog = ref(false);
const loading = ref(false);

function showAddUser() {
  showAddUserDialog.value = true;
}

function closeAddUser() {
  showAddUserDialog.value = false;
}

async function saveNewUser(name: string) {
  loading.value = true;

  try {
    await vbStore.addUser({
      name,
    });
    appStore.setSuccessMessage({
      message: 'User added successfully',
    });

    closeAddUser();
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({
      message: 'Error adding user',
    });
  }

  loading.value = false;
}

async function deleteUser(user: ViceBankUser) {
  loading.value = true;

  try {
    await vbStore.deleteUser(user.id);
    appStore.setSuccessMessage({
      message: 'User deleted successfully',
    });
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({
      message: 'Error deleting user',
    });
  }

  loading.value = false;
}

function userClick(user: ViceBankUser) {
  vbStore.setCurrentUser(user);
  emit('close');
}

function deselectUser() {
  vbStore.clearCurrentUser();
}
</script>
