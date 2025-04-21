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
        <VTextField
          v-model="conversionUnit"
          density="compact"
          variant="outlined"
          label="Unit of Measure (e.g. Minutes)"
          hide-details
        />
      </VCol>

      <VCol cols="12">
        <VNumberInput
          v-model="inputQuantity"
          :min="0"
          density="compact"
          variant="outlined"
          label="How much you must deposit"
          hide-details
        />
      </VCol>

      <VCol cols="12">
        <VNumberInput
          v-model="tokensEarnedPerInput"
          :min="0"
          :precision="2"
          density="compact"
          variant="outlined"
          label="How many tokens you get"
          hide-details
        />
      </VCol>

      <VCol cols="12">
        <VNumberInput
          v-model="minDeposit"
          :min="0"
          density="compact"
          variant="outlined"
          label="Minimum Deposit"
          hide-details
        />
      </VCol>
    </VRow>

    <VRow>
      <VCol>
        <VBtn
          @click="saveAction"
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
import { computed, onBeforeMount, ref, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { isNumber, isString, typeGuardGenerator } from 'tcheck';

import { Action, type ActionJSON } from '@vice_bank/models/action';
import { useViceBankStore } from '@/stores/vice_bank_store';
import { useAppStore } from '@/stores/app_store';

const props = defineProps<{
  action?: Action;
}>();

const emit = defineEmits<{
  (e: 'saveAction', action: Action): void;
}>();

const vbStore = useViceBankStore();
const appStore = useAppStore();

const name: Ref<string> = ref('');
const conversionUnit: Ref<string> = ref('');
const inputQuantity: Ref<number | null> = ref(0);
const tokensEarnedPerInput: Ref<number | null> = ref(0);
const minDeposit: Ref<number | null> = ref(0);

const buttonTitle = computed(() =>
  props.action ? 'Edit Action' : 'Add New Action',
);

interface ValidActionInput {
  name: string;
  conversionUnit: string;
  inputQuantity: number;
  tokensEarnedPerInput: number;
  minDeposit: number;
}
const validActionInputStrict = typeGuardGenerator<ValidActionInput>({
  name: isString,
  conversionUnit: isString,
  inputQuantity: isNumber,
  tokensEarnedPerInput: isNumber,
  minDeposit: isNumber,
});
function isValidActionInput(input: unknown): input is ValidActionInput {
  if (!validActionInputStrict(input)) {
    return false;
  }

  const nameTest = input.name.length > 0;
  const conversionUnitTest = input.conversionUnit.length > 0;
  const inputQuantityTest = input.inputQuantity > 0;
  const tokensEarnedPerInputTest = input.tokensEarnedPerInput > 0;

  const val =
    nameTest &&
    conversionUnitTest &&
    inputQuantityTest &&
    tokensEarnedPerInputTest;

  return val;
}

function getPotentialData() {
  return {
    name: name.value,
    conversionUnit: conversionUnit.value,
    inputQuantity: inputQuantity.value,
    tokensEarnedPerInput: tokensEarnedPerInput.value,
    minDeposit: minDeposit.value,
  };
}

const isInputValid = computed(() => {
  return isValidActionInput(getPotentialData());
});

function saveAction() {
  const id = props.action ? props.action.id : uuidv4();
  const vbUserId = props.action
    ? props.action.vbUserId
    : vbStore.currentUser?.id;

  if (!vbUserId) {
    console.error('No user ID found');
    appStore.setErrorMessage({
      message: 'Invalid VB User',
    });
    return;
  }

  const dat = getPotentialData();

  if (!isValidActionInput(dat)) {
    console.error('Invalid action input');
    appStore.setErrorMessage({
      message: 'Invalid action input',
    });
    return;
  }

  const json: ActionJSON = {
    id,
    vbUserId,
    name: name.value,
    conversionUnit: conversionUnit.value,
    inputQuantity: dat.inputQuantity,
    tokensEarnedPerInput: dat.tokensEarnedPerInput,
    minDeposit: dat.minDeposit,
  };

  console.log(json);

  const action = new Action(json);

  emit('saveAction', action);
}

function beforeMountHandler() {
  if (props.action) {
    name.value = props.action.name;
    conversionUnit.value = props.action.conversionUnit;
    inputQuantity.value = props.action.inputQuantity;
    tokensEarnedPerInput.value = props.action.tokensEarnedPerInput;
    minDeposit.value = props.action.minDeposit;
  }
}

onBeforeMount(beforeMountHandler);
</script>
