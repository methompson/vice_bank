<template>
  <CommonDialog :loading="loading" @close="close" title="Buy">
    <VContainer class="px-0">
      <VRow justify="center" align="center">
        <VCol cols="12">
          <RewardCard :reward="reward" :showMenu="false" />
        </VCol>

        <VCol cols="6" class="text-center">
          <TextDatePicker v-model="addOnDate" />
        </VCol>

        <VCol cols="6" class="text-center">
          <TextTimePicker v-model="addOnTime" />
        </VCol>

        <VCol class="text-center" cols="12">
          Tokens Available: {{ tokensAvailable }}
        </VCol>

        <VCol cols="12">
          <VNumberInput
            v-model="quantity"
            :min="0"
            :max="maxQuantity"
            variant="outlined"
            density="compact"
            label="Quantity"
          />
        </VCol>

        <VCol class="text-center" cols="12">
          Tokens Remaining: {{ remainingTokens }}
        </VCol>

        <VCol class="text-center" cols="12">
          <VBtn :disabled="saveDisabled" @click="savePurchase">Purchase</VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </CommonDialog>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, type Ref } from 'vue';
import { DateTime } from 'luxon';
import { storeToRefs } from 'pinia';
import { isUndefinedOrNull } from '@metools/tcheck';

import type { Reward } from '@vice_bank/models/reward';
import { Purchase } from '@vice_bank/models/purchase';

import { useViceBankStore } from '@/stores/vice_bank_store';
import { getTokensEarnedString } from '@/utils/tokens_earned';

import CommonDialog from '@/views/components/common_dialog.vue';
import RewardCard from '@/views/components/rewards/reward_card.vue';
import TextDatePicker from '@/views/components/utility/text_date_picker.vue';
import TextTimePicker from '@/views/components/utility/text_time_picker.vue';

const props = withDefaults(
  defineProps<{
    reward: Reward;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const { loading, reward } = toRefs(props);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'savePurchase', purchase: Purchase): void;
}>();

const vbStore = useViceBankStore();
const { currentUserTokens } = storeToRefs(vbStore);

const tokensAvailable = computed(() =>
  getTokensEarnedString(currentUserTokens.value),
);

const addOnDate: Ref<DateTime<true>> = ref(DateTime.now().startOf('day'));
const addOnTime: Ref<string> = ref(
  DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE),
);

const quantity = ref(0);

const depositDateTime = computed(() => {
  const [hr, min] = addOnTime.value
    .split(':')
    .map((v) => Number.parseInt(v, 10));

  if (
    isUndefinedOrNull(hr) ||
    isUndefinedOrNull(min) ||
    Number.isNaN(hr) ||
    Number.isNaN(min)
  ) {
    return addOnDate.value;
  }

  return addOnDate.value.set({ hour: hr, minute: min });
});

const purchase = computed(() => {
  return Purchase.fromReward(reward.value, quantity.value, {
    date: depositDateTime.value,
  });
});

const maxQuantity = computed(() => {
  return Math.floor(currentUserTokens.value / reward.value.price);
});

const remainingTokens = computed(() => {
  const remaining = currentUserTokens.value - purchase.value.tokensSpent;
  return getTokensEarnedString(remaining < 0 ? 0 : remaining);
});

const saveDisabled = computed(() => {
  return quantity.value <= 0 || quantity.value > currentUserTokens.value;
});

function close() {
  emit('close');
}

function savePurchase() {
  emit('savePurchase', purchase.value);
}
</script>
