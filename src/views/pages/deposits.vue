<template>
  <VDialog v-model="addEditActionTaskDialog" max-width="600px">
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
    <DepositActionDialog
      v-if="actionToDeposit"
      :action="actionToDeposit"
      :loading="loading"
      @close="closeAddActionDialog"
      @saveActionDeposit="addActionDeposit"
    />
  </VDialog>

  <NoUserSelected>
    <VContainer>
      <VRow v-if="itemsList.length === 0">
        <VCol cols="12">
          <!-- Put list of tasks or actions here -->
          <span class="text-h5"> No Tasks or Actions </span>
        </VCol>

        <VCol cols="12">
          <VBtn @click="showAddDialog" color="primary">
            Add an Action or Task
          </VBtn>
        </VCol>
      </VRow>

      <template v-else>
        <VRow align="center">
          <VCol cols="auto">
            <span class="text-h5">Actions and Tasks</span>
          </VCol>

          <VSpacer />

          <VCol class="text-end">
            <VBtn @click="showAddDialog" color="primary" icon="mdi-plus" />
          </VCol>
        </VRow>

        <VRow>
          <VCol v-for="item in itemsList" :key="item.id" cols="12" md="6">
            <ActionCard
              v-if="item instanceof Action"
              :action="item"
              @click="showAddAction(item)"
              @deleteAction="deleteAction"
              @updateAction="showUpdateActionDialog"
            />
            <TaskCard
              v-if="item instanceof Task"
              :task="item"
              @deleteTask="deleteTask"
              @updateTask="showUpdateTaskDialog"
            />
          </VCol>
        </VRow>
      </template>

      <VRow>
        <VCol>
          <!-- Put list of deposit hisotry here -->
          <span class="text-h5"> Deposit History </span>
        </VCol>
      </VRow>
    </VContainer>
  </NoUserSelected>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs, type Ref } from 'vue';

import { Action } from '@vice_bank/models/action';
import { useViceBankStore } from '@/stores/vice_bank_store';

import { useAppStore } from '@/stores/app_store';
import { getUserId } from '@/utils/auth';
import { Task } from '@vice_bank/models/task';

import NoUserSelected from '@/views/components/root_components/no_user_selected.vue';
import AddActionTaskDialog from '@/views/components/dialogs/add_action_task_dialog.vue';
import ActionCard from '@/views/components/deposits/action_card.vue';
import TaskCard from '@/views/components/deposits/task_card.vue';
import EditActionDialog from '@/views/components/dialogs/edit_action_dialog.vue';
import EditTaskDialog from '@/views/components/dialogs/edit_task_dialog.vue';

import DepositActionDialog from '@/views/components/dialogs/deposit_action_dialog.vue';
import type { ActionDeposit } from '@vice_bank/models/action_deposit';

const vbStore = useViceBankStore();
const appStore = useAppStore();

const { actions, tasks } = toRefs(vbStore);

const loading = ref(false);
const addEditActionTaskDialog = ref(false);

const itemsList = computed(() => {
  const list = [...actions.value, ...tasks.value];

  list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
});

// #region Add Dialog

function showAddDialog() {
  addEditActionTaskDialog.value = true;
}

function closeAddDialog() {
  addEditActionTaskDialog.value = false;
}

async function saveNewAction(action: Action) {
  try {
    loading.value = true;
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

// #region Add Action

const actionToDeposit: Ref<Action | undefined> = ref(undefined);
const showAddActionDialog = computed({
  get: () => !!actionToDeposit.value,
  set: (_value) => {
    actionToDeposit.value = undefined;
  },
});

function showAddAction(action: Action) {
  actionToDeposit.value = action;
}
function closeAddActionDialog() {
  showAddActionDialog.value = false;
}

function addActionDeposit(deposit: ActionDeposit) {
  console.log('Adding deposit:', deposit);
}

// #endregion

async function beforeMountHandler() {
  try {
    const userId = getUserId();
    await Promise.all([vbStore.getActions(userId), vbStore.getTasks(userId)]);
  } catch (e) {
    console.error('Error fetching actions:', e);
    appStore.setErrorMessage({
      message: 'Error fetching actions',
    });
  }
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
