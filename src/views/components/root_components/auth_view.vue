<template>
  <VDialog v-model="showAddUserDialog" persistent max-width="600px">
    <AddUserDialog
      :loading="loading"
      @saveUser="saveNewUser"
      @close="closeAddUserAndLogout"
    />
  </VDialog>

  <slot v-if="isLoggedIn" />

  <LoginForm v-else-if="showLoginForm" />

  <div v-else-if="showAddUserDialog">
    <h1>Create User</h1>
  </div>

  <div v-else>
    <h1>Loading...</h1>

    <p>Please wait while we load your data.</p>
  </div>
</template>

<script setup lang="ts">
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  onIdTokenChanged,
  type User,
} from 'firebase/auth';
import { computed, onBeforeMount, ref, type Ref } from 'vue';
import { isUndefinedOrNull } from 'tcheck';

import { getFirebaseConfig } from '@/utils/get_firebase_config';
import { useViceBankStore } from '@/stores/vice_bank_store';
import { useAppStore } from '@/stores/app_store';
import { useAuthComposable } from '@/views/pages/auth_composable';
import { NotFoundError } from '@/utils/errors';

import LoginForm from '@/views/components/login_form.vue';
import AddUserDialog from '@/views/components/dialogs/add_user_dialog.vue';

const vbStore = useViceBankStore();
const appStore = useAppStore();
const { logout } = useAuthComposable();

const userInfo: Ref<User | null> = ref(null);

const app: Ref<FirebaseApp | undefined> = ref(undefined);
const loaded: Ref<boolean> = ref(false);

const showAddUserDialog = ref(false);
const loading = ref(false);

async function saveNewUser(name: string) {
  loading.value = true;

  try {
    await vbStore.addUser({
      name,
    });

    appStore.setSuccessMessage({
      message: 'User added successfully',
    });
  } catch (e) {
  } finally {
    loading.value = false;
    showAddUserDialog.value = false;
  }
}
function closeAddUserAndLogout() {
  console.log('close');
  showAddUserDialog.value = false;
  logout();
}

const isLoggedIn = computed(() => {
  return loaded.value && userInfo.value !== null;
});
const showLoginForm = computed(() => {
  return !isLoggedIn.value && loaded.value;
});

function clearLocalStorage() {
  localStorage.clear();
}

async function getUserData() {
  try {
    await vbStore.getUser();
  } catch (e) {
    if (e instanceof NotFoundError) {
      showAddUserDialog.value = true;
      return;
    }
    console.error('Error getting user data:', e);
  }
}

async function authChangeHandler(user: User | null) {
  console.log('auth change handler');
  if (isUndefinedOrNull(user)) {
    userInfo.value = null;
    clearLocalStorage();
  } else {
    // We're logged in, let's fetch our user data
    userInfo.value = user;
    getUserData();
  }

  loaded.value = true;
}

function authInit() {
  const firebaseConfig = getFirebaseConfig();
  app.value = initializeApp(firebaseConfig);

  const authInst = getAuth();

  onAuthStateChanged(authInst, authChangeHandler);
  onIdTokenChanged(authInst, (user) => {
    console.log('on id token changed');
    authChangeHandler(user);
  });
}

function beforeMountHandler() {
  authInit();
}

onBeforeMount(beforeMountHandler);
</script>
