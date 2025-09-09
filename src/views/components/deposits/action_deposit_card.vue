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
              {{ actionDeposit.action.name }}
            </VCol>

            <VCol class="pa-0 cardInfo" cols="12">
              {{ actionDeposit.depositQuantity }}
              {{ actionDeposit.action.conversionUnit }}
            </VCol>

            <VCol class="pa-0 cardInfo" cols="12">
              Earned {{ tokensEarned }} {{ tokenName }}
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
                @click="deleteActionDeposit"
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

import type { ActionDeposit } from '@vice_bank/models/action_deposit';
import { getTokensEarnedString } from '@/utils/tokens_earned';

const props = defineProps<{
  actionDeposit: ActionDeposit;
}>();
const { actionDeposit } = toRefs(props);

const emit = defineEmits<{
  (e: 'deleteActionDeposit', deposit: ActionDeposit): void;
}>();

const depositDate = computed(() => {
  return actionDeposit.value.date.toLocaleString(DateTime.DATETIME_MED);
});

const tokensEarned = computed(() =>
  getTokensEarnedString(actionDeposit.value.tokensEarned),
);
const tokenName = computed(() => {
  return actionDeposit.value.tokensEarned === 1 ? 'token' : 'tokens';
});

function deleteActionDeposit() {
  emit('deleteActionDeposit', actionDeposit.value);
}
</script>

<style lang="scss">
.cardDate {
  font-size: 0.7rem;
}

.cardInfo {
  font-size: 0.8rem;
}
</style>
