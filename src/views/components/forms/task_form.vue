<template>
  <VContainer class="px-0">
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="name"
          density="compact"
          variant="outlined"
          label="Name"
          hide-details
        />
      </VCol>

      <VCol cols="12">
        <VNumberInput
          v-model="tokensEarned"
          :min="0"
          density="compact"
          variant="outlined"
          label="How Many Tokens You Get"
          hide-details
        />
      </VCol>

      <VCol cols="12">
        <VSelect
          v-model="frequency"
          :items="frequencyItems"
          label="Frequency"
          variant="outlined"
          density="compact"
          hide-details
        />
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn
          @click="saveTask"
          :disabled="!isInputValid"
          class="w-100"
          color="primary"
        >
          {{ buttonTitle }}
        </VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { isNumber, isString, typeGuardGenerator } from 'tcheck';
import { computed, onBeforeMount, ref, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { Frequency, isFrequency } from '@vice_bank/models/frequency';
import { Task, type TaskJSON } from '@vice_bank/models/task';
import { useViceBankStore } from '@/stores/vice_bank_store';
import { useAppStore } from '@/stores/app_store';

const props = defineProps<{
  task?: Task;
}>();
const emit = defineEmits<{
  (e: 'saveTask', task: Task): void;
}>();

const vbStore = useViceBankStore();
const appStore = useAppStore();

const name = ref('');
const tokensEarned: Ref<number | null> = ref(0);

const frequencyItems = Object.values(Frequency);
const frequency: Ref<Frequency | null> = ref(null);

const buttonTitle = computed(() => (props.task ? 'Edit Task' : 'Add New Task'));

interface ValidTaskInput {
  name: string;
  tokensEarned: number;
  frequency: Frequency;
}
const validTaskInputStrict = typeGuardGenerator<ValidTaskInput>({
  name: isString,
  tokensEarned: isNumber,
  frequency: isFrequency,
});
function isValidTaskInput(input: unknown): input is ValidTaskInput {
  if (!validTaskInputStrict(input)) {
    return false;
  }

  const nameTest = input.name.length > 0;
  const tokensEarnedTest = input.tokensEarned > 0;

  return nameTest && tokensEarnedTest;
}

function getPotentialData() {
  return {
    name: name.value,
    tokensEarned: tokensEarned.value,
    frequency: frequency.value,
  };
}

const isInputValid = computed(() => {
  return isValidTaskInput(getPotentialData());
});

function saveTask() {
  const id = props.task ? props.task.id : uuidv4();

  const vbUserId = props.task ? props.task.vbUserId : vbStore.currentUser?.id;
  if (!vbUserId) {
    appStore.setErrorMessage({
      message: 'No user selected',
    });
    return;
  }

  const dat = getPotentialData();

  if (!isValidTaskInput(dat)) {
    console.error('Invalid task input:', dat);
    appStore.setErrorMessage({
      message: 'Invalid task input',
    });
    return;
  }

  const json: TaskJSON = {
    id,
    vbUserId,
    name: dat.name,
    tokensEarnedPerInput: dat.tokensEarned,
    frequency: dat.frequency,
  };

  console.log(json);

  const task = new Task(json);

  emit('saveTask', task);
}

function beforeMountHandler() {
  if (props.task) {
    name.value = props.task.name;
    tokensEarned.value = props.task.tokensEarnedPerInput;
    frequency.value = props.task.frequency;
  }
}

onBeforeMount(beforeMountHandler);
</script>
