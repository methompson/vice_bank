<template>
  <VDialog v-model="addActionTaskDialog" max-width="600px">
    <AddActionTaskDialog
      :loading="loading"
      @close="closeAddDialog"
      @saveAction="saveNewAction"
      @saveTask="saveNewTask"
    />
  </VDialog>

  <VDialog v-model="showEditActionDialog" max-width="600px">
    <EditActionDialog
      v-if="actionToUpdate"
      :loading="loading"
      :action="actionToUpdate"
      @close="closeEditDialog"
      @saveAction="updateAction"
    />
  </VDialog>

  <VDialog v-model="showEditTaskDialog" max-width="600px">
    <EditTaskDialog
      v-if="taskToUpdate"
      :loading="loading"
      :task="taskToUpdate"
      @close="closeEditDialog"
      @saveTask="updateTask"
    />
  </VDialog>

  <VDialog v-model="showAddActionDialog" max-width="600px">
    <AddActionDepositDialog
      v-if="actionToDeposit"
      :action="actionToDeposit"
      :loading="loading"
      @close="closeAddActionDepositDialog"
      @saveActionDeposit="saveNewActionDeposit"
    />
  </VDialog>

  <VDialog v-model="showAddTaskDialog" max-width="600px">
    <AddTaskDepositDialog
      v-if="taskToDeposit"
      :task="taskToDeposit"
      :loading="loading"
      :taskDepositHistory="taskDeposits"
      @close="closeAddTaskDepositDialog"
      @saveTaskDeposit="saveNewTaskDeposit"
    />
  </VDialog>

  <NoUserSelected>
    <VContainer>
      <VRow v-if="itemsList.length === 0" align="center">
        <VCol cols="12">
          <span class="text-h5">Actions and Tasks</span>
        </VCol>

        <VCol cols="12">
          <VBtn @click="showAddDialog" color="primary">
            Add an Action or Task
          </VBtn>
        </VCol>
      </VRow>

      <VRow v-else align="center">
        <VCol cols="auto">
          <span class="text-h5">Actions and Tasks</span>
        </VCol>

        <VSpacer />

        <VCol class="text-end">
          <VBtn @click="showAddDialog" color="primary" icon="mdi-plus" />
        </VCol>
      </VRow>

      <VRow v-if="itemsList.length > 0">
        <VCol v-for="item in itemsList" :key="item.id" cols="12" md="6">
          <ActionCard
            v-if="isAction(item)"
            :action="item"
            @click="showAddActionDepositDialog(item)"
            @deleteAction="deleteAction"
            @updateAction="showUpdateActionDialog"
          />
          <TaskCard
            v-if="isTask(item)"
            :task="item"
            @click="showAddTaskDepositDialog(item)"
            @deleteTask="deleteTask"
            @updateTask="showUpdateTaskDialog"
          />
        </VCol>
      </VRow>

      <VRow v-if="showDepositHistory">
        <VCol cols="12">
          <!-- Put list of deposit hisotry here -->
          <span class="text-h5"> Deposit History </span>
        </VCol>

        <VExpansionPanels multiple>
          <VExpansionPanel
            v-for="[date, history] in Object.entries(depositHistory)"
            :key="date"
          >
            <VExpansionPanelTitle>
              {{ makeFriendlyYear(date) }} - {{ history.length }}
              {{ history.length === 1 ? 'deposit' : 'deposits' }}
            </VExpansionPanelTitle>

            <VExpansionPanelText>
              <VRow>
                <VCol
                  v-for="dep in history"
                  :key="dep.id"
                  cols="12"
                  class="pa-1"
                >
                  <ActionDepositCard
                    v-if="isActionDeposit(dep)"
                    :actionDeposit="dep"
                    @deleteActionDeposit="deleteActionDeposit"
                  />
                  <TaskDepositCard
                    v-if="isTaskDeposit(dep)"
                    :taskDeposit="dep"
                    @deleteTaskDeposit="deleteTaskDeposit"
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
import {
  computed,
  onBeforeMount,
  ref,
  toRefs,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';

import { Action } from '@vice_bank/models/action';
import { useViceBankStore } from '@/stores/vice_bank_store';

import { useAppStore } from '@/stores/app_store';
import { Task } from '@vice_bank/models/task';
import { useHistoryComposable } from '@/views/pages/history_composable';

import NoUserSelected from '@/views/components/root_components/no_user_selected.vue';
import AddActionTaskDialog from '@/views/components/dialogs/add_action_task_dialog.vue';
import ActionCard from '@/views/components/deposits/action_card.vue';
import TaskCard from '@/views/components/deposits/task_card.vue';
import EditActionDialog from '@/views/components/dialogs/edit_action_dialog.vue';
import EditTaskDialog from '@/views/components/dialogs/edit_task_dialog.vue';
import AddActionDepositDialog from '@/views/components/dialogs/add_action_deposit_dialog.vue';
import ActionDepositCard from '@/views/components/deposits/action_deposit_card.vue';
import TaskDepositCard from '@/views/components/deposits/task_deposit_card.vue';
import AddTaskDepositDialog from '@/views/components/dialogs/add_task_deposit_dialog.vue';

import { ActionDeposit } from '@vice_bank/models/action_deposit';
import { TaskDeposit } from '@vice_bank/models/task_deposit';

const vbStore = useViceBankStore();
const appStore = useAppStore();

const { actions, tasks, actionDeposits, taskDeposits, currentUser } =
  toRefs(vbStore);

watch(currentUser, async (user) => {
  if (user) {
    await getAllData();
  }
});

const loading = ref(false);

const itemsList = computed(() => {
  const list = [...actions.value, ...tasks.value];

  list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
});

async function getAllData() {
  const vbUserId = currentUser.value?.id;

  if (!vbUserId) {
    return;
  }

  loading.value = true;
  try {
    await Promise.all([
      vbStore.getActions(vbUserId),
      vbStore.getTasks(vbUserId),
      vbStore.getActionDeposits(vbUserId),
      vbStore.getTaskDeposits(vbUserId),
    ]);
  } catch (e) {
    console.error('Error fetching actions:', e);
    appStore.setErrorMessage({
      message: 'Error fetching actions',
    });
  }

  loading.value = false;
}

const { makeFriendlyYear } = useHistoryComposable();

// #region Add Action or Task Dialog

const addActionTaskDialog = ref(false);

function showAddDialog() {
  addActionTaskDialog.value = true;
}

function closeAddDialog() {
  addActionTaskDialog.value = false;
}

async function saveNewAction(action: Action) {
  loading.value = true;

  try {
    await vbStore.addNewAction(action);

    closeAddDialog();

    appStore.setSuccessMessage({
      message: 'Action saved successfully',
    });
  } catch (e) {
    console.error('Error saving action:', e);
    appStore.setErrorMessage({
      message: 'Error saving action',
    });
  }

  loading.value = false;
}

async function saveNewTask(task: Task) {
  try {
    loading.value = true;

    await vbStore.addNewTask(task);

    closeAddDialog();

    appStore.setSuccessMessage({
      message: 'Task saved successfully',
    });
  } catch (e) {
    console.error('Error saving task:', e);
    appStore.setErrorMessage({
      message: 'Error saving task',
    });
  }

  loading.value = false;
}

// #endregion

// #region Delete Action & Task
async function deleteAction(action: Action) {
  loading.value = true;

  try {
    await vbStore.deleteAction(action);
    appStore.setSuccessMessage({
      message: 'Action deleted successfully',
    });
  } catch (e) {
    console.error('Error deleting action:', e);
    appStore.setErrorMessage({
      message: 'Error deleting action',
    });
  }

  loading.value = false;
}

async function deleteTask(task: Task) {
  loading.value = true;

  try {
    await vbStore.deleteTask(task);
    appStore.setSuccessMessage({
      message: 'Task deleted successfully',
    });
  } catch (e) {
    console.error('Error deleting task:', e);
    appStore.setErrorMessage({
      message: 'Error deleting task',
    });
  }

  loading.value = false;
}

// #endregion

// #region Update Action & Task
const actionToUpdate: Ref<Action | undefined> = ref(undefined);
const showEditActionDialog = computed({
  get: () => !!actionToUpdate.value,
  set: (_value) => {
    actionToUpdate.value = undefined;
  },
});

const taskToUpdate: Ref<Task | undefined> = ref(undefined);
const showEditTaskDialog = computed({
  get: () => !!taskToUpdate.value,
  set: (_value) => {
    taskToUpdate.value = undefined;
  },
});

function showUpdateActionDialog(action: Action) {
  actionToUpdate.value = action;
}

function showUpdateTaskDialog(task: Task) {
  taskToUpdate.value = task;
}

async function updateAction(action: Action) {
  loading.value = true;

  try {
    await vbStore.updateAction(action);
    appStore.setSuccessMessage({
      message: 'Action updated successfully',
    });
  } catch (e) {
    console.error('Error updating action:', e);
    appStore.setErrorMessage({
      message: 'Error updating action',
    });
  }

  closeEditDialog();
  loading.value = false;
}

async function updateTask(task: Task) {
  loading.value = true;

  try {
    await vbStore.updateTask(task);
    appStore.setSuccessMessage({
      message: 'Task updated successfully',
    });
  } catch (e) {
    console.error('Error updating task:', e);
    appStore.setErrorMessage({
      message: 'Error updating task',
    });
  }

  closeEditDialog();
  loading.value = false;
}

function closeEditDialog() {
  showEditActionDialog.value = false;
  showEditTaskDialog.value = false;
}

// #endregion

// #region Add Action Deposit

const actionToDeposit: Ref<Action | undefined> = ref(undefined);
const showAddActionDialog = computed({
  get: () => !!actionToDeposit.value,
  set: (_value) => {
    actionToDeposit.value = undefined;
  },
});

function isAction(item: Action | Task): item is Action {
  return item instanceof Action;
}

function showAddActionDepositDialog(action: Action) {
  actionToDeposit.value = action;
}
function closeAddActionDepositDialog() {
  showAddActionDialog.value = false;
}

async function saveNewActionDeposit(deposit: ActionDeposit) {
  loading.value = true;

  try {
    await vbStore.addNewActionDeposit(deposit);

    closeAddActionDepositDialog();

    appStore.setSuccessMessage({
      message: 'Action Deposit saved successfully',
    });
  } catch (e) {
    console.error('Error saving action deposit:', e);
    appStore.setErrorMessage({
      message: 'Error saving action deposit',
    });
  }

  loading.value = false;
}

// #endregion

// #region Add Task Deposit
const taskToDeposit: Ref<Task | undefined> = ref(undefined);
const showAddTaskDialog = computed({
  get: () => !!taskToDeposit.value,
  set: (_value) => {
    taskToDeposit.value = undefined;
  },
});

function isTask(item: Action | Task): item is Task {
  return item instanceof Task;
}

function showAddTaskDepositDialog(task: Task) {
  taskToDeposit.value = task;
}
function closeAddTaskDepositDialog() {
  showAddTaskDialog.value = false;
}

async function saveNewTaskDeposit(deposit: TaskDeposit) {
  loading.value = true;

  try {
    await vbStore.addNewTaskDeposit(deposit);

    closeAddTaskDepositDialog();

    appStore.setSuccessMessage({
      message: 'Task Deposit saved successfully',
    });
  } catch (e) {
    console.error('Error saving task deposit:', e);
    appStore.setErrorMessage({
      message: 'Error saving task deposit',
    });
  }

  loading.value = false;
}
// #endregion

// #region Deposit History

const showDepositHistory = computed(() => {
  return [...actionDeposits.value, ...taskDeposits.value].length > 0;
});

const depositHistory: ComputedRef<
  Record<string, (ActionDeposit | TaskDeposit)[]>
> = computed(() => {
  const depositsList = [...actionDeposits.value, ...taskDeposits.value];

  depositsList.sort((a, b) => {
    return b.date.toMillis() - a.date.toMillis();
  });

  const dateMap: Record<string, (ActionDeposit | TaskDeposit)[]> = {};
  depositsList.forEach((dep) => {
    const date = dep.date.toISODate();
    const deposits = dateMap[date] ?? [];
    deposits.push(dep);
    dateMap[date] = deposits;
  });

  return dateMap;
});

async function deleteActionDeposit(actionDeposit: ActionDeposit) {
  loading.value = true;

  try {
    await vbStore.deleteActionDeposit(actionDeposit);
    appStore.setSuccessMessage({
      message: 'Action Deposit deleted successfully',
    });
  } catch (e) {
    console.error('Error deleting action deposit:', e);
    appStore.setErrorMessage({
      message: 'Error deleting action deposit',
    });
  }

  loading.value = false;
}

async function deleteTaskDeposit(taskDeposit: TaskDeposit) {
  loading.value = true;

  try {
    await vbStore.deleteTaskDeposit(taskDeposit);
    appStore.setSuccessMessage({
      message: 'Task Deposit deleted successfully',
    });
  } catch (e) {
    console.error('Error deleting task deposit:', e);
    appStore.setErrorMessage({
      message: 'Error deleting task deposit',
    });
  }

  loading.value = false;
}

// #endregion

async function beforeMountHandler() {
  await getAllData();
}

function isActionDeposit(
  input: ActionDeposit | TaskDeposit,
): input is ActionDeposit {
  return input instanceof ActionDeposit;
}

function isTaskDeposit(
  input: ActionDeposit | TaskDeposit,
): input is TaskDeposit {
  return input instanceof TaskDeposit;
}

onBeforeMount(beforeMountHandler);
</script>

<style lang="scss">
.actionCardTitle {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    font-size: 1rem;
    font-weight: bold;
  }

  .subtitle {
    font-size: 0.75rem;
    font-weight: 400;
  }
}
</style>
