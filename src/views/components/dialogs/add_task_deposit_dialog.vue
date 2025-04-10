<template>
  <CommonDialog :loading="loading" @close="close" title="Deposit Action">
    <VContainer class="px-0">
      <VRow justify="center" align="center">
        <VCol cols="12">
          <TaskCard :task="task" :showMenu="false" />
        </VCol>

        <VCol cols="12" class="text-center">
          <VBtn @click="saveDeposit" color="primary"> Deposit </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </CommonDialog>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import type { Task } from '@vice_bank/models/task';
import { TaskDeposit } from '@vice_bank/models/task_deposit';

import TaskCard from '@/views/components/deposits/task_card.vue';
import CommonDialog from '@/views/components/common_dialog.vue';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
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

const deposit = computed(() => {
  return TaskDeposit.fromTask(task.value);
});

function close() {
  emit('close');
}

function saveDeposit() {
  emit('saveTaskDeposit', deposit.value);
}
</script>
