<template>
  <VMenu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <VTextField
        v-model="timeStr"
        v-bind="props"
        label="Time"
        variant="outlined"
        density="compact"
        :readonly="true"
        hide-details
      />
    </template>

    <VCard>
      <VCardText>
        <VRow justify="center">
          <VCol align-self="center">
            <span class="timeInputContainer">
              <input
                v-model="hour"
                class="timeInputField"
                size="1"
                type="decimal"
                :min="hourInputMin"
                :max="hourInputMax"
              />
              <span class="timeColon px-1">:</span>
              <input
                v-model="minute"
                class="timeInputField"
                size="1"
                type="decimal"
                min="0"
                max="59"
              />

              <span v-if="ampm" class="timeInputControls">
                <button
                  :class="amButtonClasses"
                  variant="text"
                  @click="setTimePeriod('am')"
                >
                  AM
                </button>
                <button
                  :class="pmButtonClasses"
                  variant="text"
                  @click="setTimePeriod('pm')"
                >
                  PM
                </button>
              </span>
            </span>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VMenu>
</template>

<script setup lang="ts">
import { isString } from '@metools/tcheck';
import { computed, onBeforeMount, ref, toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    ampm?: boolean;
  }>(),
  {
    ampm: true,
  },
);

const { ampm } = toRefs(props);

const timeModel = defineModel();

const hourStr = ref('12');
const minuteStr = ref('0');

const hour = ref('12');
const minute = ref('0');

/** Raw Number from the hour input */
const hourNum = computed(() => {
  return Number.parseInt(hour.value, 10);
});
/** Raw Number from the minute input */
const minuteNum = computed(() => {
  return Number.parseInt(minute.value, 10);
});

const isAm = ref(true);

const hourInputMin = computed(() => {
  return ampm.value ? 1 : 0;
});
const hourInputMax = computed(() => {
  return ampm.value ? 12 : 23;
});

function setTimePeriod(timePeriod: 'am' | 'pm') {
  if (timePeriod === 'am') {
    isAm.value = true;
  } else {
    isAm.value = false;
  }
}

function timeValidator(
  theHour: number,
  theMinute: number,
  usingAmpm: boolean,
): boolean {
  const minValid =
    !Number.isNaN(theMinute) && theMinute >= 0 && theMinute <= 59;

  // Short circuit if the minutes are invalid
  if (!minValid) {
    return false;
  }

  // ampm times start at 1 and end at 12
  // 24h times start at 0 and end at 23
  if (usingAmpm) {
    return theHour >= 1 && theHour <= 12;
  }

  return theHour >= 0 && theHour <= 23;
}

/**
 * Uses the timeValidator function to determine if the current
 * time as input is valid
 */
const isTimeValid = computed(() => {
  return timeValidator(hourNum.value, minuteNum.value, ampm.value);
});

const timeStr = computed(() =>
  ampm.value ? ampmTime.value : twentyFourHrsTime.value,
);

/**
 * Converts the time elements into a 24 hour format
 */
const twentyFourHrsTime = computed(() => {
  // Short circuit noon if invalid
  if (!isTimeValid.value) {
    return '12:00';
  }

  const min = `${minuteNum.value}`.padStart(2, '0');

  if (ampm.value) {
    const hr = isAm.value ? hourNum.value : hourNum.value + 12;
    return `${hr.toString().padStart(2, '0')}:${min}`;
  } else {
    const hr = `${hourNum.value}`.padStart(2, '0');
    return `${hr}:${min}`;
  }
});

const ampmTime = computed(() => {
  if (!isTimeValid.value) {
    return '12:00 pm';
  }

  const min = `${minuteNum.value}`.padStart(2, '0');

  if (ampm.value) {
    const hr = isAm.value ? hourNum.value : hourNum.value + 12;
    return `${hr}:${min}${isAm.value ? 'am' : 'pm'}`;
  } else {
    const hrNum = hourNum.value === 0 ? 12 : hourNum.value % 12;

    return `${hrNum}:${min}`;
  }
});

const amButtonClasses = computed(() => {
  const styles = ['ampmButton'];
  if (isAm.value) {
    styles.push('ampmSelected');
  }
  return styles;
});
const pmButtonClasses = computed(() => {
  const styles = ['ampmButton'];
  if (!isAm.value) {
    styles.push('ampmSelected');
  }
  return styles;
});

const timeRegex = /^[012]{0,1}[0-9]:[0-5][0-9]$/;

function beforeMountHandler() {
  console.log('Before Mount', timeModel.value);
  if (!isString(timeModel.value) || !timeRegex.test(timeModel.value)) {
    hour.value = '12';
    minute.value = '00';
    timeModel.value = twentyFourHrsTime.value;
    return;
  }

  const [hr, min] = timeModel.value
    .split(':')
    .map((el) => Number.parseInt(el, 10));

  if (!hr || !min || !timeValidator(hr, min, ampm.value)) {
    hour.value = '12';
    minute.value = '00';
    timeModel.value = twentyFourHrsTime.value;
    return;
  }

  if (ampm.value) {
    if (hr >= 12) {
      isAm.value = false;
    } else {
      isAm.value = true;
    }
    hour.value = `${(hr ?? 12) % 12}`.padStart(2, '0');
    minute.value = min.toString() ?? '00';
  } else {
    hour.value = `${hr.toString().padStart(2, '0')}`;
    minute.value = `${min.toString().padStart(2, '0')}`;
  }
}

onBeforeMount(beforeMountHandler);
</script>

<style lang="scss" scoped>
input.timeInputField {
  border: 1px solid black;
  aspect-ratio: 4/3;
  font-size: 3rem;
  text-align: center;
  padding: 0.5rem;
}

.timeColon {
  font-size: 2rem;
  font-weight: bold;
}

.timeInputContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

input.timeInputField,
.timeInputControls {
  height: 4rem;
  border-radius: 0.25rem;
  border: 1px solid black;
}

.timeInputControls {
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem;

  .ampmButton {
    border-radius: 0;
    height: 2rem;
    padding: 5px;
    border: 0;
  }

  .ampmButton:last-child {
    border-top: 1px solid black;
  }

  .ampmButton.ampmSelected {
    background-color: #1976d2;
    color: white;
  }
}
</style>
