<template>
  <CommonDialog :loading="loading" @close="close" title="Deposit Action">
    <VContainer class="px-0">
      <VRow justify="start" align="center">
        <VCol cols="12">
          <ActionCard :action="action" :showMenu="false" />
        </VCol>

        <VCol cols="12"> {{ tokensEarned }} Tokens Earned </VCol>

        <VCol cols="6" class="text-center">
          <TextDatePicker v-model="addOnDate" />
        </VCol>

        <VCol cols="6" class="text-center">
          <TextTimePicker v-model="addOnTime" />
        </VCol>

        <VCol cols="12">
          <VNumberInput
            v-model="quantity"
            :label="action.conversionUnit"
            :min="0"
            variant="outlined"
            density="compact"
          />
        </VCol>

        <VCol cols="12" class="text-center">
          <VBtn @click="saveDeposit" :disabled="!canDeposit" color="primary">
            Deposit
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </CommonDialog>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch, type Ref } from 'vue';
import { DateTime } from 'luxon';

import type { Action } from '@vice_bank/models/action';
import { ActionDeposit } from '@vice_bank/models/action_deposit';

import CommonDialog from '@/views/components/common_dialog.vue';
import ActionCard from '@/views/components/deposits/action_card.vue';

import TextDatePicker from '@/views/components/text_date_picker.vue';
import TextTimePicker from '@/views/components/utility/text_time_picker.vue';
import { isUndefinedOrNull } from '@metools/tcheck';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    action: Action;
  }>(),
  {
    loading: false,
  },
);
const { action, loading } = toRefs(props);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saveActionDeposit', deposit: ActionDeposit): void;
}>();

const addOnDate: Ref<DateTime<true>> = ref(DateTime.now().startOf('day'));
const addOnTime: Ref<string> = ref(
  DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE),
);

watch(addOnTime, (newVal) => {
  console.log('addOnTime changed', newVal);
});

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

const canDeposit = computed(() => {
  const max = action.value.maxDeposit ?? Number.MAX_VALUE;
  return quantity.value > 0 && quantity.value <= max;
});

const deposit = computed(() => {
  return ActionDeposit.fromAction(action.value, quantity.value, {
    date: depositDateTime.value,
  });
});

const tokensEarned = computed(() => {
  return deposit.value.tokensEarned.toFixed(2);
});

function close() {
  emit('close');
}

function saveDeposit() {
  emit('saveActionDeposit', deposit.value);
}
</script>
