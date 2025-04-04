<template>
  <VApp>
    <VMain>
      <AuthView>
        <TopBar />

        <RouterView />

        <BottomBar />
      </AuthView>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import AuthView from '@/views/components/root_components/auth_view.vue';
import TopBar from '@/views/components/root_components/top_bar.vue';
import BottomBar from '@/views/components/root_components/bottom_bar.vue';
</script>

<style scoped></style>
