<template>
  <VCard color="primary">
    <VCardText class="pa-2">
      <VRow align="center">
        <VCol class="actionCardTitle">
          <span class="title">
            {{ action.name }}
          </span>

          <span class="subtitle">
            {{ action.inputQuantity }} {{ action.conversionUnit }} for
            {{ action.tokensEarnedPerInput }} Token(s)
          </span>
        </VCol>

        <VCol v-if="showMenu" class="text-end">
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
              <VListItem value="edit" item="edit" @click="editAction()">
                <VListItemTitle>Edit</VListItemTitle>
              </VListItem>

              <VListItem value="delete" item="delete" @click="deleteAction()">
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

import type { Action } from '@vice_bank/models/action';

const props = withDefaults(
  defineProps<{
    action: Action;
    showMenu?: boolean;
  }>(),
  {
    showMenu: true,
  },
);

const { action, showMenu } = toRefs(props);

const emit = defineEmits<{
  (e: 'updateAction', action: Action): void;
  (e: 'deleteAction', action: Action): void;
}>();

function deleteAction() {
  emit('deleteAction', action.value);
}
function editAction() {
  emit('updateAction', action.value);
}
</script>
