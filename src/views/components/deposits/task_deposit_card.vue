<template>
  <VCard color="secondary">
    <VCardText>
      <VRow>
        <VCol>
          <VRow>
            <VCol class="px-0 pt-1 pb-0 cardDate" cols="12">
              {{ depositDate }}
            </VCol>

            <VCol class="pa-0 cardName" cols="12">
              {{ taskDeposit.task.name }}
            </VCol>

            <VCol class="pa-0 cardInfo" cols="12">
              Earned {{ taskDeposit.tokensEarned }} Token(s)
            </VCol>
          </VRow>
        </VCol>

        <VCol align-self="center" class="text-right">
          <VMenu>
            <template v-slot:activator="{ props }">
              <VBtn
                v-bind="props"
                density="comfortable"
                variant="plain"
                icon="mdi-pencil"
              />
            </template>

            <VList>
              <VListItem
                value="delete"
                item="delete"
                @click="deleteTaskDeposit"
              >
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
import { computed, toRefs } from 'vue';
import { DateTime } from 'luxon';

import type { TaskDeposit } from '@vice_bank/models/task_deposit';

const props = defineProps<{
  taskDeposit: TaskDeposit;
}>();
const { taskDeposit } = toRefs(props);

const emit = defineEmits<{
  (e: 'deleteTaskDeposit', deposit: TaskDeposit): void;
}>();

const depositDate = computed(() => {
  return taskDeposit.value.date.toLocaleString(DateTime.DATETIME_MED);
});

function deleteTaskDeposit() {
  console.log('delort');
  emit('deleteTaskDeposit', taskDeposit.value);
}
</script>
