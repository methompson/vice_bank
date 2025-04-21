import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';

import { arrayToObject } from '@/utils/array_to_obj';

import type { ViceBankUser } from '@vice_bank/models/vice_bank_user';
import type { Action } from '@vice_bank/models/action';
import type { Task } from '@vice_bank/models/task';
import type { ActionDeposit } from '@vice_bank/models/action_deposit';
import type { TaskDeposit } from '@vice_bank/models/task_deposit';
import type { Reward } from '@vice_bank/models/reward';
import type { Purchase } from '@vice_bank/models/purchase';

import * as usersAPI from '@/api/vb_users';
import * as actionsAPI from '@/api/actions';
import * as tasksAPI from '@/api/tasks';
import * as actionDepositsAPI from '@/api/action_deposits';
import * as taskDepositsAPI from '@/api/task_deposits';
import * as rewardsAPI from '@/api/rewards';
import * as purchasesAPI from '@/api/purchases';
import type { VBUserTokens } from '@/utils/vb_user_types';

export const useViceBankStore = defineStore('viceBankStore', () => {
  // #region Users
  const vbUsersAndTokensState: Ref<VBUserTokens[]> = ref([]);
  const vbUsersAndTokens = computed(() => [...vbUsersAndTokensState.value]);
  const vbUsers = computed(() =>
    vbUsersAndTokensState.value.map((dat) => dat.user),
  );
  const userMap = computed(() => {
    return arrayToObject(vbUsers.value, (u) => u.id);
  });

  const currentUserId: Ref<string | undefined> = ref(undefined);
  const currentUser: ComputedRef<ViceBankUser | undefined> = computed(() => {
    if (!currentUserId.value) {
      return undefined;
    }
    return userMap.value[currentUserId.value];
  });

  const currentUserTokensState: Ref<number | undefined> = ref(undefined);
  const currentUserTokens = computed(() => currentUserTokensState.value ?? 0);

  async function getUserTokens(vbUserId: string) {
    currentUserTokensState.value = await usersAPI.getUserTokens(vbUserId);
  }

  async function setCurrentUser(user: ViceBankUser) {
    if (!userMap.value[user.id]) {
      throw new Error('Invalid user');
    }

    currentUserId.value = user.id;

    await getUserTokens(user.id);
  }

  function clearCurrentUser() {
    currentUserId.value = undefined;
  }

  async function getUsers() {
    vbUsersAndTokensState.value = await usersAPI.getVBUsers();
  }

  type AddUserPayload = {
    name: string;
  };
  async function addUser(payload: AddUserPayload) {
    await usersAPI.addVBUser(payload);
    await getUsers();
  }

  async function updateUser(updatedUser: ViceBankUser) {
    await usersAPI.updateVBUser(updatedUser);
    await getUsers();
  }

  async function deleteUser(vbUserId: string) {
    await usersAPI.deleteVBUser(vbUserId);
    await getUsers();
  }

  // #endregion

  // #region Actions

  const actionsState: Ref<Action[]> = ref([]);
  const actions = computed(() => [...actionsState.value]);
  const actionsMap = computed(() => arrayToObject(actions.value, (a) => a.id));

  async function getActions(vbUserId: string) {
    const result = await actionsAPI.getActions(vbUserId);
    actionsState.value = result;
  }

  async function addNewAction(action: Action) {
    await actionsAPI.addAction(action);
    await getActions(action.vbUserId);
  }

  async function updateAction(updatedAction: Action) {
    await actionsAPI.updateAction(updatedAction);
    await getActions(updatedAction.vbUserId);
  }

  async function deleteAction(action: Action) {
    await actionsAPI.deleteAction(action.id);
    await getActions(action.vbUserId);
  }

  // #endregion

  // #region Tasks

  const tasksState: Ref<Task[]> = ref([]);
  const tasks = computed(() => [...tasksState.value]);
  const tasksMap = computed(() => arrayToObject(tasks.value, (t) => t.id));

  async function getTasks(vbUserId: string) {
    const result = await tasksAPI.getTasks(vbUserId);
    tasksState.value = result;
  }

  async function addNewTask(task: Task) {
    await tasksAPI.addTask(task);
    await getTasks(task.vbUserId);
  }

  async function updateTask(task: Task) {
    await tasksAPI.updateTask(task);
    await getTasks(task.vbUserId);
  }

  async function deleteTask(task: Task) {
    await tasksAPI.deleteTask(task.id);
    await getTasks(task.vbUserId);
  }
  // #endregion

  // #region Action Deposits

  const actionDepositsState: Ref<ActionDeposit[]> = ref([]);
  const actionDeposits = computed(() => [...actionDepositsState.value]);
  const actionDepositsMap = computed(() =>
    arrayToObject(actionDeposits.value, (t) => t.id),
  );

  async function getActionDeposits(vbUserId: string) {
    const result = await actionDepositsAPI.getActionDeposits(vbUserId);
    actionDepositsState.value = result;
  }

  async function addNewActionDeposit(actionDeposit: ActionDeposit) {
    await actionDepositsAPI.addActionDeposit(actionDeposit);
    await Promise.all([
      getActionDeposits(actionDeposit.vbUserId),
      getUserTokens(actionDeposit.vbUserId),
    ]);
  }

  async function updateActionDeposit(actionDeposit: ActionDeposit) {
    await actionDepositsAPI.updateActionDeposit(actionDeposit);
    await Promise.all([
      getActionDeposits(actionDeposit.vbUserId),
      getUserTokens(actionDeposit.vbUserId),
    ]);
  }

  async function deleteActionDeposit(actionDeposit: ActionDeposit) {
    await actionDepositsAPI.deleteActionDeposit(actionDeposit.id);
    await Promise.all([
      getActionDeposits(actionDeposit.vbUserId),
      getUserTokens(actionDeposit.vbUserId),
    ]);
  }

  // #endregion

  // #region Task Deposits

  const taskDepositsState: Ref<TaskDeposit[]> = ref([]);
  const taskDeposits = computed(() => [...taskDepositsState.value]);
  const taskDepositsMap = computed(() =>
    arrayToObject(taskDeposits.value, (t) => t.id),
  );

  async function getTaskDeposits(vbUserId: string) {
    const result = await taskDepositsAPI.getTaskDeposits(vbUserId);
    taskDepositsState.value = result;
  }

  async function addNewTaskDeposit(taskDeposit: TaskDeposit) {
    await taskDepositsAPI.addTaskDeposit(taskDeposit);
    await Promise.all([
      getTaskDeposits(taskDeposit.vbUserId),
      getUserTokens(taskDeposit.vbUserId),
    ]);
  }

  async function updateTaskDeposit(taskDeposit: TaskDeposit) {
    await taskDepositsAPI.updateTaskDeposit(taskDeposit);
    await Promise.all([
      getTaskDeposits(taskDeposit.vbUserId),
      getUserTokens(taskDeposit.vbUserId),
    ]);
  }

  async function deleteTaskDeposit(taskDeposit: TaskDeposit) {
    await taskDepositsAPI.deleteTaskDeposit(taskDeposit.id);
    await Promise.all([
      getTaskDeposits(taskDeposit.vbUserId),
      getUserTokens(taskDeposit.vbUserId),
    ]);
  }

  // #endregion

  // #region Rewards

  const rewardsState: Ref<Reward[]> = ref([]);
  const rewards = computed(() => [...rewardsState.value]);
  const rewardsMap = computed(() => arrayToObject(rewards.value, (r) => r.id));

  async function getRewards(vbUserId: string) {
    rewardsState.value = await rewardsAPI.getRewards(vbUserId);
  }

  async function addReward(reward: Reward) {
    await rewardsAPI.addReward(reward);
    await getRewards(reward.vbUserId);
  }

  async function updateReward(reward: Reward) {
    await rewardsAPI.updateReward(reward);
    await getRewards(reward.vbUserId);
  }

  async function deleteReward(reward: Reward) {
    await rewardsAPI.deleteReward(reward.id);
    await getRewards(reward.vbUserId);
  }

  // #endregion

  // #region Purchases

  const purchasesState: Ref<Purchase[]> = ref([]);
  const purchases = computed(() => [...purchasesState.value]);
  const purchasesMap = computed(() =>
    arrayToObject(purchases.value, (p) => p.id),
  );

  async function getPurchases(vbUserId: string) {
    purchasesState.value = await purchasesAPI.getPurchases(vbUserId);
  }

  async function addPurchase(purchase: Purchase) {
    await purchasesAPI.addPurchase(purchase);
    await Promise.all([
      getPurchases(purchase.vbUserId),
      getUserTokens(purchase.vbUserId),
    ]);
  }

  async function updatePurchase(purchase: Purchase) {
    await purchasesAPI.updatePurchase(purchase);
    await Promise.all([
      getPurchases(purchase.vbUserId),
      getUserTokens(purchase.vbUserId),
    ]);
  }

  async function deletePurchase(purchase: Purchase) {
    await purchasesAPI.deletePurchase(purchase.id);
    await Promise.all([
      getPurchases(purchase.vbUserId),
      getUserTokens(purchase.vbUserId),
    ]);
  }

  // #endregion

  return {
    // Users
    vbUsers,
    vbUsersAndTokens,
    currentUser,
    clearCurrentUser,
    setCurrentUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,

    currentUserTokens,

    // actions
    actions,
    actionsMap,
    getActions,
    addNewAction,
    updateAction,
    deleteAction,

    // tasks
    tasks,
    tasksMap,
    getTasks,
    addNewTask,
    updateTask,
    deleteTask,

    // action deposits
    actionDeposits,
    actionDepositsMap,
    getActionDeposits,
    addNewActionDeposit,
    updateActionDeposit,
    deleteActionDeposit,

    // task deposits
    taskDeposits,
    taskDepositsMap,
    getTaskDeposits,
    addNewTaskDeposit,
    updateTaskDeposit,
    deleteTaskDeposit,

    // Rewards
    rewards,
    rewardsMap,
    getRewards,
    addReward,
    updateReward,
    deleteReward,

    // Purchases
    purchases,
    purchasesMap,
    getPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase,
  };
});
