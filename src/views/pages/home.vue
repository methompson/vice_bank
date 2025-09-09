<template>
  <VContainer>
    <VRow>
      <VCol cols="12" sm="6">
        <VCard :color="cardColor">
          <VCardTitle> Past Week Deposits </VCardTitle>

          <VCardText>
            <VRow>
              <VCol cols="12"> Deposits: {{ lastWeekDeposits.length }} </VCol>
              <VCol cols="12">
                Tokens Earned: {{ lastWeekTokensEarned.toFixed(2) }}
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6">
        <VCard :color="cardColor">
          <VCardTitle> Past Week Purchases </VCardTitle>

          <VCardText>
            <VRow>
              <VCol cols="12"> Purchases: {{ lastWeekPurchases.length }} </VCol>
              <VCol cols="12">
                Tokens Earned:
                {{ lastWeekTokensSpent.toFixed(2) }}</VCol
              >
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, toRefs, type ComputedRef } from 'vue';
import { DateTime } from 'luxon';

import { useAppStore } from '@/stores/app_store';
import { useViceBankStore } from '@/stores/vice_bank_store';

const appStore = useAppStore();
const vbStore = useViceBankStore();

const { actionDeposits, taskDeposits, purchases } = toRefs(vbStore);

const cardColor = computed(() => {
  // return appStore.isDarkMode ? 'surface-dark' : 'surface-light';
  return 'surface';
});

function sevenDaysAgo() {
  return DateTime.now().minus({ days: 7 }).startOf('day');
}

const lastWeekDeposits = computed(() => {
  const depositsList = [...actionDeposits.value, ...taskDeposits.value];

  const sda = sevenDaysAgo();

  const output = depositsList.filter((dep) => {
    return dep.date >= sda;
  });

  return output;
});

const lastWeekTokensEarned = computed(() => {
  const totalTokens = lastWeekDeposits.value.reduce((acc, dep) => {
    return acc + dep.tokensEarned;
  }, 0);

  return totalTokens;
});

const lastWeekPurchases = computed(() => {
  const sda = sevenDaysAgo();

  const output = purchases.value.filter((purchase) => {
    return purchase.date >= sda;
  });

  return output;
});

const lastWeekTokensSpent = computed(() => {
  const totalTokens = lastWeekPurchases.value.reduce((acc, purchase) => {
    return acc + purchase.tokensSpent;
  }, 0);

  return totalTokens;
});
</script>
