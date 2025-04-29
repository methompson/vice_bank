<template>
  <VCard color="orange">
    <VCardText class="pa-2">
      <VRow align="center">
        <VCol class="actionCardTitle">
          <span class="title"> {{ reward.name }} </span>

          <span class="subtitle">
            Cost {{ reward.price }} {{ tokenPhrase }}
          </span>
        </VCol>

        <VCol v-if="showMenu" class="text-end">
          <VMenu>
            <template v-slot:activator="{ props }">
              <VBtn
                v-bind="props"
                variant="text"
                size="small"
                icon="mdi-pencil"
              />
            </template>

            <VList>
              <VListItem value="edit" item="edit" @click="editReward()">
                <VListItemTitle>Edit</VListItemTitle>
              </VListItem>

              <VListItem value="delete" item="delete" @click="deleteReward()">
                <VListItemTitle> Delete </VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { Reward } from '@vice_bank/models/reward';
import { computed, toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    reward: Reward;
    showMenu?: boolean;
  }>(),
  {
    showMenu: true,
  },
);

const { reward, showMenu } = toRefs(props);

const emit = defineEmits<{
  (e: 'updateReward', reward: Reward): void;
  (e: 'deleteReward', reward: Reward): void;
}>();

const tokenPhrase = computed(() => {
  return reward.value.price === 1 ? 'Token' : 'Tokens';
});

function editReward() {
  emit('updateReward', reward.value);
}
function deleteReward() {
  emit('deleteReward', reward.value);
}
</script>
