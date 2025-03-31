<template>
  <VApp>
    <AuthView>
      <RouterView />
    </AuthView>
  </VApp>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import AuthView from '@/ui/components/root_components/auth_view.vue';
</script>

<style scoped></style>
