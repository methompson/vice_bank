<script setup lang="ts">
import { getVBUsers } from '@/api/vb_user';
import { ref } from 'vue';

const count = ref(0);

async function getUsers() {
  await getVBUsers();
}
</script>

<template>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>

    <button type="button" @click="getUsers">Get Users</button>
  </div>
</template>

<style scoped></style>
