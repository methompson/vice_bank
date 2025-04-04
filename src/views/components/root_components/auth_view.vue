<template>
  <slot v-if="isLoggedIn" />

  <LoginForm v-else-if="showLoginForm" />

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

import { getFirebaseConfig } from '@/utils/get_firebase_config';
import LoginForm from '@/views/components/login_form.vue';

const userInfo: Ref<User | null> = ref(null);

const app: Ref<FirebaseApp | undefined> = ref(undefined);
const loaded: Ref<boolean> = ref(false);

const isLoggedIn = computed(() => {
  return loaded.value && userInfo.value !== null;
});
const showLoginForm = computed(() => {
  return !isLoggedIn.value && loaded.value;
});

function clearLocalStorage() {
  localStorage.clear();
}

async function authChangeHandler(user: User | null) {
  if (user === null) {
    userInfo.value = null;
    // unsetAuthCookie();
    clearLocalStorage();
  } else {
    const idToken = await user.getIdToken();
    // setAuthCookie(idToken);
    userInfo.value = user;
  }

  loaded.value = true;
}

async function beforeMountHandler() {
  const firebaseConfig = getFirebaseConfig();
  app.value = initializeApp(firebaseConfig);

  const authInst = getAuth();

  onAuthStateChanged(authInst, authChangeHandler);
  onIdTokenChanged(authInst, (user) => {
    authChangeHandler(user);
  });
}

onBeforeMount(beforeMountHandler);
</script>
