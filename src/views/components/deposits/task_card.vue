<template>
  <VCard color="red">
    <VCardText class="pa-2">
      <VRow align="center">
        <VCol class="actionCardTitle">
          <span class="title">
            {{ task.name }}
          </span>

          <span class="subtitle">
            Once a {{ task.frequency }} for
            {{ task.tokensEarnedPerInput }} Token(s)
          </span>
        </VCol>

        <VCol class="text-end">
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
              <VListItem value="edit" item="edit" @click="updateTask()">
                <VListItemTitle>Edit</VListItemTitle>
              </VListItem>

              <VListItem value="delete" item="delete" @click="deleteTask()">
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
import { toRefs } from 'vue';

import type { Task } from '@vice_bank/models/task';

const props = defineProps<{
  task: Task;
}>();

const { task } = toRefs(props);

const emit = defineEmits<{
  (e: 'updateTask', task: Task): void;
  (e: 'deleteTask', task: Task): void;
}>();

function deleteTask() {
  emit('deleteTask', task.value);
}
function updateTask() {
  emit('updateTask', task.value);
}
</script>
