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
import { computed, onBeforeMount, ref, toRefs } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { Reward, type RewardJSON } from '@vice_bank/models/reward';

import CommonDialog from '@/views/components/common_dialog.vue';
import { useViceBankStore } from '@/stores/vice_bank_store';
import { useAppStore } from '@/stores/app_store';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    reward?: Reward;
  }>(),
  {
    loading: false,
  },
);

const { loading, reward } = toRefs(props);

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
  const id = props.reward?.id ?? uuidv4();
  const vbUserId = props.reward?.vbUserId ?? vbStore.currentUser?.id;

  if (!vbUserId) {
    console.error('No user ID found');
    appStore.setErrorMessage({
      message: 'Invalid VB User',
    });
    return;
  }

  const newReward: RewardJSON = {
    id,
    name: name.value,
    price: price.value,
    vbUserId,
  };

  emit('saveReward', new Reward(newReward));
}

function close() {
  emit('close');
}

onBeforeMount(beforeMountHandler);

function beforeMountHandler() {
  if (props.reward) {
    name.value = props.reward.name;
    price.value = props.reward.price;
  }
}
</script>
