<template>
  <VBottomNavigation>
    <VBtn @click="navigateTo('/')" value="home">
      <VIcon>mdi-home-outline</VIcon>

      <span>Home</span>
    </VBtn>

    <VBtn value="depoists">
      <VIcon>mdi-bank</VIcon>

      <span>Deposits</span>
    </VBtn>

    <VBtn value="withdrawals">
      <VIcon>mdi-account-cash-outline</VIcon>

      <span>Withdrawals</span>
    </VBtn>

    <VBtn @click="navigateTo('/settings')" value="settings">
      <VIcon>mdi-cog-outline</VIcon>

      <span>Settings</span>
    </VBtn>
  </VBottomNavigation>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(route: string) {
  router.push(route);
}
</script>
