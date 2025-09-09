<template>
  <CommonDialog :loading="loading" @close="close" title="Deposit Task">
    <VContainer class="px-0">
      <VRow justify="center" align="center">
        <VCol cols="12">
          <TaskCard :task="task" :showMenu="false" />
        </VCol>

        <VCol cols="6" class="text-center">
          <TextDatePicker v-model="addOnDate" />
        </VCol>

        <VCol cols="6" class="text-center">
          <TextTimePicker v-model="addOnTime" />
        </VCol>

        <VCol cols="12" class="text-center">
          <VBtn
            @click="saveDeposit"
            :disabled="!canDepositToday"
            color="primary"
          >
            Deposit
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </CommonDialog>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, type Ref } from 'vue';
import { DateTime } from 'luxon';
import { isString, isUndefinedOrNull } from '@metools/tcheck';

import type { Task } from '@vice_bank/models/task';
import { TaskDeposit } from '@vice_bank/models/task_deposit';
import { arrayToObject } from '@/utils/array_to_obj';

import TaskCard from '@/views/components/deposits/task_card.vue';
import CommonDialog from '@/views/components/common_dialog.vue';
import TextDatePicker from '@/views/components/utility/text_date_picker.vue';
import TextTimePicker from '@/views/components/utility/text_time_picker.vue';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    taskDepositHistory: TaskDeposit[];
    task: Task;
  }>(),
  {
    loading: false,
  },
);
const { task, loading } = toRefs(props);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saveTaskDeposit', deposit: TaskDeposit): void;
}>();

const addOnDate: Ref<DateTime<true>> = ref(DateTime.now().startOf('day'));
const addOnTime: Ref<string> = ref(
  DateTime.now().toLocaleString(DateTime.TIME_24_SIMPLE),
);

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

const depositHistoryForTask = computed(() => {
  return props.taskDepositHistory.filter((d) => d.task.id === task.value.id);
});

const canDepositToday = computed(() => {
  const tasksByDate = arrayToObject(depositHistoryForTask.value, (d) =>
    d.date.toISODate(),
  );

  const addOnStr = addOnDate.value.toISODate();

  if (!isString(addOnStr)) {
    return false;
  }

  return !tasksByDate[addOnStr];
});

const deposit = computed(() => {
  return TaskDeposit.fromTask(task.value, {
    date: depositDateTime.value,
  });
});

function close() {
  emit('close');
}

function saveDeposit() {
  console.log('saveDeposit', deposit.value.toJSON());
  emit('saveTaskDeposit', deposit.value);
}
</script>
