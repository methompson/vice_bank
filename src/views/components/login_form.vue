<template>
  <div class="loginFormContainer">
    <VContainer>
      <VRow justify="center">
        <VCol cols="12" sm="6" align-self="center">
          <VCard :loading="loggingIn">
            <VCardText>
              <VForm class="text-center" ref="loginFormRef">
                <img
                  src="/vb_logo_1024_transparent.png"
                  alt="logo"
                  width="128"
                  height="128"
                  class="mb-4"
                />

                <VTextField
                  v-model="email"
                  variant="solo-filled"
                  label="Email"
                  required
                  type="email"
                />

                <VTextField
                  v-model="password"
                  variant="solo-filled"
                  label="Password"
                  required
                  type="password"
                />

                <VBtn :disabled="!validInputs" @click="login" color="tertiary">
                  Login
                </VBtn>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue';
import type { VForm } from 'vuetify/components';

import { useAppStore } from '@/stores/app_store';

const appStore = useAppStore();

const email = ref('');
const password = ref('');
const loggingIn = ref(false);

const loginFormRef: Ref<VForm | null> = ref(null);
watch(loginFormRef, (newValue) => {
  if (newValue && newValue.$el) {
    newValue.$el.addEventListener('keyup', formKeyUpHandler);
  }
});

const validInputs = computed(() => {
  return email.value.length > 6 && password.value.length > 6;
});

function formKeyUpHandler(ev: KeyboardEvent) {
  if (ev.code !== 'Enter') {
    return;
  }

  if (!validInputs.value) {
    return;
  }

  login();
}

async function login() {
  try {
    loggingIn.value = true;
    await appStore.login(email.value, password.value);
  } catch (e) {
    // if (e instanceof FirebaseError) {
    //   if (
    //     e.code === 'auth/user-not-found' ||
    //     e.code === 'auth/wrong-password'
    //   ) {
    //     appStore.setErrorMessage({
    //       message: 'Invalid Credentials',
    //     });
    //     return;
    //   }

    //   console.error({
    //     code: e.code,
    //     message: e.message,
    //   });
    // }

    console.error(e);

    appStore.setErrorMessage({
      message: 'Invalid Credentials',
    });
  }
  loggingIn.value = false;
}
</script>

<style lang="scss" scoped>
.loginFormContainer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
