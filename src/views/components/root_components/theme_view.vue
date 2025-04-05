<template><span class="themeWatcher"></span></template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useTheme } from 'vuetify';

import { useAppStore } from '@/stores/app_store';

const appStore = useAppStore();
const theme = useTheme();

function themeChangeWatcher(event: MediaQueryListEvent) {
  if (event.matches) {
    setDarkMode();
  } else {
    setLightMode();
  }
}

function setDarkMode() {
  theme.global.name.value = 'dark';
  appStore.isDarkMode = true;
}

function setLightMode() {
  theme.global.name.value = 'light';
  appStore.isDarkMode = false;
}

function beforeMountHandler() {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', themeChangeWatcher);

  if (appStore.getIsDarkMode()) {
    setDarkMode();
  } else {
    setLightMode();
  }
}

function beforeUnmountHandler() {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', themeChangeWatcher);
}

onBeforeMount(beforeMountHandler);

onBeforeUnmount(beforeUnmountHandler);
</script>

<style lang="css" scoped>
.themeWatcher {
  display: none;
}
</style>
