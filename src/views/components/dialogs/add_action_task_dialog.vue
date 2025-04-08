<template>
  <CommonDialog :loading="loading" @close="close" title="Add an Action or Task">
    <VTabs v-model="tab">
      <VTab value="action"> Action </VTab>
      <VTab value="task"> Task </VTab>
    </VTabs>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem value="action">
        <ActionForm @saveAction="saveAction" />
      </VTabsWindowItem>

      <VTabsWindowItem value="task">
        <TaskForm @saveTask="saveTask" />
      </VTabsWindowItem>
    </VTabsWindow>
  </CommonDialog>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';

import type { Action } from '@vice_bank/models/action';
import type { Task } from '@vice_bank/models/task';

import CommonDialog from '@/views/components/common_dialog.vue';
import ActionForm from '@/views/components/forms/action_form.vue';
import TaskForm from '@/views/components/forms/task_form.vue';

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
  (e: 'saveAction', action: Action): void;
  (e: 'saveTask', task: Task): void;
}>();

const tab = ref('action');

function close() {
  emit('close');
}

function saveAction(actionToSave: Action) {
  emit('saveAction', actionToSave);
}
function saveTask(taskToSave: Task) {
  emit('saveTask', taskToSave);
}
</script>
