<template>
  <CommonDialog :loading="loading" @close="close" title="Edit Task">
    <TaskForm :task="task" @saveTask="saveTask" />
  </CommonDialog>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

import type { Task } from '@vice_bank/models/task';

import CommonDialog from '@/views/components/common_dialog.vue';
import TaskForm from '@/views/components/forms/task_form.vue';

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
  (e: 'saveTask', task: Task): void;
}>();

function close() {
  emit('close');
}
function saveTask(taskToSave: Task) {
  emit('saveTask', taskToSave);
}
</script>
