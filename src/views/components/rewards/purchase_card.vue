<template>
  <VCard color="teal">
    <VCardText>
      <VRow>
        <VCol>
          <VRow>
            <VCol class="px-0 pt-1 pb-0 cardDate" cols="12">
              {{ purchaseDate }}
            </VCol>

            <VCol class="pa-0 cardName" cols="12">
              {{ purchase.reward.name }}
            </VCol>

            <VCol class="pa-0 cardInfo" cols="12">
              {{ purchase.purchasedQuantity }}
              Purchased
            </VCol>

            <VCol class="pa-0 cardInfo" cols="12">
              Spent {{ purchase.tokensSpent }} {{ tokenName }}
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
              <VListItem value="delete" item="delete" @click="deletePurchase">
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
import { DateTime } from 'luxon';
import { computed, toRefs } from 'vue';

import type { Purchase } from '@vice_bank/models/purchase';

const props = withDefaults(
  defineProps<{
    purchase: Purchase;
    showMenu?: boolean;
  }>(),
  {
    showMenu: true,
  },
);

const emit = defineEmits<{
  (e: 'deletePurchase', purchase: Purchase): void;
}>();

const { purchase } = toRefs(props);

function deletePurchase() {
  emit('deletePurchase', purchase.value);
}

const purchaseDate = computed(() => {
  return purchase.value.date.toLocaleString(DateTime.DATETIME_MED);
});

const tokenName = computed(() => {
  return purchase.value.tokensSpent === 1 ? 'token' : 'tokens';
});
</script>
