<template>
  <VDialog v-model="showAddReward" max-width="600px">
    <AddRewardDialog
      :loading="loading"
      @saveReward="saveNewReward"
      @close="closeAddRewardDialog"
    />
  </VDialog>

  <VDialog v-model="showAddWithdrawal" max-width="600px">
    <AddPurchaseDialog
      v-if="rewardToWithdraw"
      :reward="rewardToWithdraw"
      :loading="loading"
      @close="closeAddWithdrawalDialog"
      @savePurchase="saveNewPurchase"
    />
  </VDialog>

  <NoUserSelected>
    <VContainer>
      <VRow v-if="rewards.length === 0">
        <VCol cols="12">
          <span class="text-h5">Rewards</span>
        </VCol>

        <VCol cols="12">
          <VBtn @click="showAddRewardDialog" color="primary" class="w-100">
            Add a Reward
          </VBtn>
        </VCol>
      </VRow>

      <VRow v-else>
        <VCol cols="auto">
          <span class="text-h5">Rewards</span>
        </VCol>

        <VSpacer />

        <VCol class="text-end">
          <VBtn @click="showAddRewardDialog" color="primary" icon="mdi-plus" />
        </VCol>
      </VRow>

      <VRow v-if="rewards.length > 0">
        <VCol v-for="reward in rewards" :key="reward.id" cols="12" md="6">
          <RewardCard
            :reward="reward"
            @click="showAddWithdrawalDialog(reward)"
            @updateReward="vbStore.updateReward"
            @deleteReward="vbStore.deleteReward"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <!-- Put list of purchase hisotry here -->
          <span class="text-h5">Purchase History</span>
        </VCol>

        <VExpansionPanels multiple>
          <VExpansionPanel
            v-for="[date, history] in Object.entries(purchaseHistory)"
            :key="date"
          >
            <VExpansionPanelTitle>
              {{ makeFriendlyYear(date) }} - {{ history.length }}
              {{ history.length === 1 ? 'purchase' : 'purchases' }}
            </VExpansionPanelTitle>

            <VExpansionPanelText>
              <VRow>
                <VCol
                  v-for="purchase in history"
                  :key="purchase.id"
                  cols="12"
                  class="pa-1"
                >
                  <PurchaseCard
                    :purchase="purchase"
                    @deletePurchase="deletePurchase"
                  />
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VRow>
    </VContainer>
  </NoUserSelected>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';

import { useViceBankStore } from '@/stores/vice_bank_store';
import { useAppStore } from '@/stores/app_store';
import type { Reward } from '@vice_bank/models/reward';
import type { Purchase } from '@vice_bank/models/purchase';
import { useHistoryComposable } from '@/views/pages/history_composable';

import NoUserSelected from '@/views/components/root_components/no_user_selected.vue';
import AddRewardDialog from '@/views/components/dialogs/add_reward_dialog.vue';
import RewardCard from '@/views/components/rewards/reward_card.vue';
import AddPurchaseDialog from '@/views/components/dialogs/add_purchase_dialog.vue';
import PurchaseCard from '@/views/components/rewards/purchase_card.vue';

const vbStore = useViceBankStore();
const appStore = useAppStore();

const { currentUser, rewards, purchases } = toRefs(vbStore);

const loading = ref(false);

const { makeFriendlyYear } = useHistoryComposable();

// #region Add Reward

const showAddReward = ref(false);

function showAddRewardDialog() {
  showAddReward.value = true;
}

function closeAddRewardDialog() {
  showAddReward.value = false;
}

async function saveNewReward(reward: Reward) {
  console.log('Saving', reward);
  loading.value = true;
  try {
    await vbStore.addReward(reward);

    appStore.setSuccessMessage({
      message: 'Reward saved successfully',
    });

    closeAddRewardDialog();
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({
      message: 'Failed to save reward',
    });
  }
  loading.value = false;
}

// #endregion

// #region Add Purchase

const rewardToWithdraw: Ref<Reward | undefined> = ref(undefined);
const showAddWithdrawal = computed({
  get: () => !!rewardToWithdraw.value,
  set: (_v) => {
    rewardToWithdraw.value = undefined;
  },
});

function showAddWithdrawalDialog(reward: Reward) {
  rewardToWithdraw.value = reward;
}

function closeAddWithdrawalDialog() {
  showAddWithdrawal.value = false;
}

async function saveNewPurchase(purchase: Purchase) {
  console.log('Save New Purhcase', purchase);

  loading.value = true;

  try {
    await vbStore.addPurchase(purchase);
    appStore.setSuccessMessage({
      message: 'Purchase saved successfully',
    });
  } catch (e) {
    console.error('Error saving purchase:', e);
    appStore.setErrorMessage({
      message: 'Failed to save purchase',
    });
  }
  closeAddWithdrawalDialog();
  loading.value = false;
}

// #endregion

// #region Purchase History

const purchaseHistory: ComputedRef<Record<string, Purchase[]>> = computed(
  () => {
    const p = [...purchases.value];
    p.sort((a, b) => b.date.toMillis() - a.date.toMillis());

    const pMap: Record<string, Purchase[]> = {};

    p.forEach((purchase) => {
      const date = purchase.date.toISODate();
      const history = pMap[date] ?? [];
      history.push(purchase);
      pMap[date] = history;
    });

    return pMap;
  },
);

async function deletePurchase(purchase: Purchase) {
  loading.value = true;

  try {
    await vbStore.deletePurchase(purchase);
    appStore.setSuccessMessage({
      message: 'Purchase deleted successfully',
    });
  } catch (e) {
    console.error('Error deleting purchase:', e);
    appStore.setErrorMessage({
      message: 'Error deleting purchase',
    });
  }

  loading.value = false;
}

// #endregion

async function getAllData() {
  const vbUserId = currentUser.value?.id;

  if (!vbUserId) {
    return;
  }

  try {
    await Promise.all([
      vbStore.getRewards(vbUserId),
      vbStore.getPurchases(vbUserId),
    ]);
  } catch (e) {
    console.error('Error fetching rewards:', e);
    appStore.setErrorMessage({
      message: 'Failed to fetch rewards',
    });
  }
}

watch(currentUser, async (user) => {
  if (user) {
    await getAllData();
  }
});
</script>
