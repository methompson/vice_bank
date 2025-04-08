<template>
  <CommonDialog :loading="loading" @close="close" title="Edit Action">
    <ActionForm :action="action" @saveAction="saveAction" />
  </CommonDialog>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

import type { Action } from '@vice_bank/models/action';

import ActionForm from '@/views/components/forms/action_form.vue';
import CommonDialog from '@/views/components/common_dialog.vue';

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
  (e: 'saveAction', action: Action): void;
}>();

function close() {
  emit('close');
}
function saveAction(actionToSave: Action) {
  emit('saveAction', actionToSave);
}
</script>
