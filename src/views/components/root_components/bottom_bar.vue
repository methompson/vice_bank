<template>
  <div class="bottomNavContainer">
    <VBottomNavigation class="bottomNavBar">
      <VBtn @click="navigateTo('/')" value="home">
        <VIcon>mdi-home-outline</VIcon>

        <span>Home</span>
      </VBtn>

      <VBtn @click="navigateTo('/deposits')" value="depoists">
        <VIcon>mdi-bank</VIcon>

        <span>Deposits</span>
      </VBtn>

      <VBtn @click="navigateTo('/withdrawals')" value="withdrawals">
        <VIcon>mdi-account-cash-outline</VIcon>

        <span>Withdrawals</span>
      </VBtn>

      <VBtn @click="navigateTo('/settings')" value="settings">
        <VIcon>mdi-cog-outline</VIcon>

        <span>Settings</span>
      </VBtn>
    </VBottomNavigation>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function navigateTo(route: string) {
  router.push(route);
}
</script>

<style scoped>
.bottomNavBar {
  margin-bottom: env(safe-area-inset-bottom, 0);
}
</style>
