<template>
  <CommonDialog :loading="loading" @close="close" title="Add a Reward">
    <VContainer class="px-0">
      <VRow>
        <VCol cols="12">
          <VTextField
            v-model="name"
            label="Name"
            variant="outlined"
            density="compact"
          />
        </VCol>

        <VCol cols="12">
          <VNumberInput
            v-model="price"
            :min="0"
            label="Price"
            variant="outlined"
            density="compact"
          />
        </VCol>

        <VCol cols="12" class="text-center">
          <VBtn @click="saveReward" :disabled="!canDeposit" color="primary">
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </CommonDialog>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { Reward, type RewardJSON } from '@vice_bank/models/reward';

import CommonDialog from '@/views/components/common_dialog.vue';
import { useViceBankStore } from '@/stores/vice_bank_store';
import { useAppStore } from '@/stores/app_store';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const { loading } = toRefs(props);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saveReward', reward: Reward): void;
}>();

const vbStore = useViceBankStore();
const appStore = useAppStore();

const name = ref('');
const price = ref(0);

const canDeposit = computed(() => {
  return name.value.length > 0 && price.value > 0;
});

function saveReward() {
  const vbUser = vbStore.currentUser?.id;

  if (!vbUser) {
    console.error('No user ID found');
    appStore.setErrorMessage({
      message: 'Invalid VB User',
    });
    return;
  }

  const newReward: RewardJSON = {
    id: uuidv4(),
    name: name.value,
    price: price.value,
    vbUserId: vbUser,
  };

  emit('saveReward', new Reward(newReward));
}

function close() {
  emit('close');
}
</script>
