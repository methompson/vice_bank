import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';

import { arrayToObject } from '@/utils/array_to_obj';

import type { ViceBankUser } from '@vice_bank/models/vice_bank_user';
import type { Action } from '@vice_bank/models/action';
import type { Task } from '@vice_bank/models/task';

import * as usersAPI from '@/api/vb_users';
import * as actionsAPI from '@/api/actions';
import * as tasksAPI from '@/api/tasks';
import * as actionDepositsAPI from '@/api/action_deposits';
import * as taskDepositsAPI from '@/api/task_deposits';
import type { ActionDeposit } from '@vice_bank/models/action_deposit';
import type { TaskDeposit } from '@vice_bank/models/task_deposit';

export const useViceBankStore = defineStore('viceBankStore', () => {
  // #region Users
  const vbUsersState: Ref<ViceBankUser[]> = ref([]);
  const vbUsers = computed(() => [...vbUsersState.value]);
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

  function setCurrentUser(user: ViceBankUser) {
    if (!userMap.value[user.id]) {
      throw new Error('Invalid user');
    }

    currentUserId.value = user.id;
  }

  function clearCurrentUser() {
    currentUserId.value = undefined;
  }

  async function getUsers() {
    vbUsersState.value = await usersAPI.getVBUsers();
  }

  type AddUserPayload = {
    name: string;
    currentTokens: number;
  };
  async function addUser(payload: AddUserPayload) {
    await usersAPI.addVBUser(payload);
  }

  async function updateUser(updatedUser: ViceBankUser) {
    await usersAPI.updateVBUser(updatedUser);
  }

  async function deleteUser(vbUserId: string) {
    await usersAPI.deleteVBUser(vbUserId);
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
    await getActionDeposits(actionDeposit.vbUserId);
  }

  async function updateActionDeposit(actionDeposit: ActionDeposit) {
    await actionDepositsAPI.updateActionDeposit(actionDeposit);
    await getActionDeposits(actionDeposit.vbUserId);
  }

  async function deleteActionDeposit(actionDeposit: ActionDeposit) {
    await actionDepositsAPI.deleteActionDeposit(actionDeposit.id);
    await getActionDeposits(actionDeposit.vbUserId);
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
    await getTaskDeposits(taskDeposit.vbUserId);
  }

  async function updateTaskDeposit(taskDeposit: TaskDeposit) {
    await taskDepositsAPI.updateTaskDeposit(taskDeposit);
    await getTaskDeposits(taskDeposit.vbUserId);
  }

  async function deleteTaskDeposit(taskDeposit: TaskDeposit) {
    await taskDepositsAPI.deleteTaskDeposit(taskDeposit.id);
    await getTaskDeposits(taskDeposit.vbUserId);
  }

  // #endregion

  return {
    // Users
    vbUsers,
    currentUser,
    clearCurrentUser,
    setCurrentUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,

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
  };
});
