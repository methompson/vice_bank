<template>
  <VApp>
    <VMain>
      <AuthView>
        <DataManager>
          <TopBar />

          <RouterView />

          <BottomBar />
        </DataManager>
      </AuthView>
    </VMain>

    <Snackbar />
    <ThemeView />
  </VApp>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import AuthView from '@/views/components/root_components/auth_view.vue';
import TopBar from '@/views/components/root_components/top_bar.vue';
import BottomBar from '@/views/components/root_components/bottom_bar.vue';

import ThemeView from '@/views/components/root_components/theme_view.vue';
import Snackbar from '@/views/components/root_components/snackbar.vue';
import DataManager from '@/views/components/root_components/data_manager.vue';
</script>

<style scoped></style>
