<template>
  <VMenu>
    <template v-slot:activator="{ props }">
      <VTextField
        v-model="dateStr"
        v-bind="props"
        label="Date"
        variant="outlined"
        density="compact"
        hide-details
      />
    </template>

    <VDatePicker
      v-model="date"
      label="Deposit Date"
      color="primary"
      class="mb-4"
    />
  </VMenu>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, onBeforeMount, ref, watch, type Ref } from 'vue';

const dateModel = defineModel();

const date: Ref<DateTime<true>> = ref(DateTime.now().startOf('day'));
const datePretty = computed(() => {
  return date.value.toLocaleString(DateTime.DATE_SHORT);
});
const dateStr = ref(datePretty.value);

watch(date, (newDate) => {
  dateStr.value = datePretty.value;
  dateModel.value = newDate;
});

onBeforeMount(() => {
  dateModel.value = date.value;
});
</script>
