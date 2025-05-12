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

  <VDialog v-model="showEditReward" max-width="600px">
    <AddRewardDialog
      v-if="rewardToEdit"
      @close="closeEditRewardDialog"
      @saveReward="updateReward"
      :loading="loading"
      :reward="rewardToEdit"
    />
  </VDialog>

  <VContainer>
    <VRow v-if="rewards.length === 0" align="center">
      <VCol cols="12">
        <span class="text-h5">Rewards</span>
      </VCol>

      <VCol cols="12" class="w-100 text-center">
        <VBtn @click="showAddRewardDialog" color="primary" class="text-center">
          Add a Reward
        </VBtn>
      </VCol>
    </VRow>

    <VRow v-else align="center">
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
          @updateReward="showEditRewardDialog(reward)"
          @deleteReward="deleteReward"
        />
      </VCol>
    </VRow>

    <VRow>
      <VCol v-if="showPurchaseHistory" cols="12">
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
            {{ history.length === 1 ? 'Purchase' : 'Purchases' }}
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
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  ref,
  toRefs,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';

import { useViceBankStore } from '@/stores/vice_bank_store';
import { useAppStore } from '@/stores/app_store';
import { Reward } from '@vice_bank/models/reward';
import type { Purchase } from '@vice_bank/models/purchase';
import { useHistoryComposable } from '@/views/pages/history_composable';

import AddRewardDialog from '@/views/components/dialogs/add_reward_dialog.vue';
import RewardCard from '@/views/components/rewards/reward_card.vue';
import AddPurchaseDialog from '@/views/components/dialogs/add_purchase_dialog.vue';
import PurchaseCard from '@/views/components/rewards/purchase_card.vue';

const vbStore = useViceBankStore();
const appStore = useAppStore();

const { currentUser, rewards, purchases } = toRefs(vbStore);

watch(currentUser, async (user) => {
  if (user) {
    await getAllData();
  }
});

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

// #region Delete / Update Reward

const showEditReward = computed({
  get() {
    return !!rewardToEdit.value;
  },
  set(_val) {
    rewardToEdit.value = undefined;
  },
});
const rewardToEdit: Ref<Reward | undefined> = ref(undefined);

async function updateReward(reward: Reward) {
  loading.value = true;
  try {
    await vbStore.updateReward(reward);
    appStore.setSuccessMessage({
      message: 'Reward updated successfully',
    });
    showEditReward.value = false;
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({
      message: 'Error updating reward',
    });
  } finally {
    loading.value = false;
  }
}

function showEditRewardDialog(reward: Reward) {
  rewardToEdit.value = reward;
}

function closeEditRewardDialog() {
  rewardToEdit.value = undefined;
}

async function deleteReward(reward: Reward) {
  loading.value = true;

  try {
    await vbStore.deleteReward(reward);
    appStore.setSuccessMessage({
      message: 'Reward deleted successfully',
    });
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({
      message: 'Error deleting reward',
    });
  }

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

const showPurchaseHistory = computed(() => {
  return purchases.value.length > 0;
});

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

async function beforeMountHandler() {
  await getAllData();
}

onBeforeMount(beforeMountHandler);
</script>
