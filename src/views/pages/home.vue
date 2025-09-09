<template>
  <VContainer>
    <VRow>
      <VCol cols="12" sm="6">
        <VCard color="surface">
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
        <VCard color="surface">
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
import { computed, onBeforeMount, toRefs, watch } from 'vue';
import { DateTime } from 'luxon';

import { useViceBankStore } from '@/stores/vice_bank_store';
import {
  fetchActionAndTaskData,
  fetchPurchaseData,
} from './history_composable';
import { useLoggerStore } from '@/stores/logger_store';
import { useAppStore } from '@/stores/app_store';

const vbStore = useViceBankStore();
const appStore = useAppStore();
const loggerStore = useLoggerStore();

const { actionDeposits, taskDeposits, purchases, currentUser } =
  toRefs(vbStore);

watch(currentUser, (newUser) => {
  if (newUser) {
    getAllData();
  }
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

async function getAllData() {
  try {
    const vbUserId = currentUser.value?.id;

    if (!vbUserId) {
      return;
    }

    await Promise.all([
      fetchActionAndTaskData(vbUserId),
      fetchPurchaseData(vbUserId),
    ]);
  } catch (e) {
    const msg = 'Error fetching data';
    loggerStore.addErrorLog(`${msg}: ${e}`).catch((err) => {
      console.error(`Failed to log error: ${err}`);
      appStore.setErrorMessage({
        message: `Failed to log error: ${err}`,
      });
    });
    console.error(msg, e);
    appStore.setErrorMessage({
      message: msg,
    });
  }
}

async function beforeMountHandler() {
  getAllData();
}
onBeforeMount(beforeMountHandler);
</script>
