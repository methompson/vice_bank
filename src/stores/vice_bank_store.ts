import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';

import { arrayToObject } from '@/utils/array_to_obj';
import type { ViceBankUser } from '@vice_bank/models/vice_bank_user';

import * as usersAPI from '@/api/vb_users';

export const useViceBankStore = defineStore('viceBankStore', () => {
  // #region Users
  const vbUsersState: Ref<ViceBankUser[]> = ref([]);
  const vbUsers: ComputedRef<ViceBankUser[]> = computed(
    () => vbUsersState.value,
  );
  const userMap = computed(() => {
    return arrayToObject(vbUsers.value, (u) => u.id);
  });

  const currentUserId: Ref<string | undefined> = ref(undefined);
  const currentUser: ComputedRef<ViceBankUser | undefined> = computed(() => {
    if (!currentUserId.value) {
      return undefined;
    }
    return userMap.value[currentUserId.value];
  });

  function setCurrentUser(user: ViceBankUser) {
    if (!userMap.value[user.id]) {
      throw new Error('Invalid user');
    }

    currentUserId.value = user.id;
  }

  function clearCurrentUser() {
    currentUserId.value = undefined;
  }

  async function getUsers() {
    vbUsersState.value = await usersAPI.getVBUsers();
  }

  type AddUserPayload = {
    name: string;
    currentTokens: number;
  };
  async function addUser(payload: AddUserPayload) {
    await usersAPI.addVBUser(payload);
  }

  async function updateUser(updatedUser: ViceBankUser) {
    await usersAPI.updateVBUser(updatedUser);
  }

  async function deleteUser(vbUserId: string) {
    await usersAPI.deleteVBUser(vbUserId);
  }

  // #endregion

  return {
    // Users
    vbUsers,
    currentUser,
    clearCurrentUser,
    setCurrentUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
  };
});
