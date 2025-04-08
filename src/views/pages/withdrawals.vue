<template>
  <NoUserSelected>
    <VContainer>
      <VRow>
        <VCol>
          <!-- Put list of rewards here -->
          <span class="text-h5">No Rewards</span>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <VBtn color="primary" class="w-100">Add a Reward</VBtn>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <!-- Put list of purchase hisotry here -->
          <span class="text-h5">Purchase History</span>
        </VCol>
      </VRow>
    </VContainer>
  </NoUserSelected>
</template>

<script setup lang="ts">
import NoUserSelected from '@/views/components/root_components/no_user_selected.vue';
</script>
