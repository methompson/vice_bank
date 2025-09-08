<template>
  <VCard>
    <VToolbar>
      <VBtn icon="mdi-close" @click="closeDialog" />

      <VToolbarTitle>Logs</VToolbarTitle>
    </VToolbar>

    <div class="py-2 text-center">
      <VBtn @click="clearLogs" color="primary">Clear Logs</VBtn>
    </div>

    <VTable striped="odd" density="compact">
      <thead>
        <tr>
          <th class="text-left px-1">Date</th>
          <th class="text-left px-1">Message</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in logs" :key="item.id">
          <td class="px-1">
            <div>
              {{ item.timestamp.toLocaleString(DateTime.DATE_SHORT) }}
              {{ formatTimeForLog(item) }}
            </div>
          </td>
          <td class="px-1">
            <div :class="getLogClasses(item)">
              {{ item.level.toUpperCase() }}:
              {{ item.message }}
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCard>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import { DateTime } from 'luxon';

import { useLoggerStore } from '@/stores/logger_store';
import { useAppStore } from '@/stores/app_store';
import { LogLevel, type LoggedEvent } from '@/models/logger_types';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const loggerStore = useLoggerStore();
const appStore = useAppStore();

const logs: Ref<LoggedEvent[]> = ref([]);

function getLogClasses(log: LoggedEvent) {
  const classes = [];
  if (log.level === LogLevel.Error) {
    classes.push('text-error');
  } else if (log.level === LogLevel.Warning) {
    // TODO Anything special?
  } else if (log.level === LogLevel.Info) {
    // TODO Anything special?
  }

  return classes.join(' ');
}

function formatTimeForLog(log: LoggedEvent) {
  const dt = log.timestamp;
  return `${dt.hour.toString().padStart(2, '0')}:${dt.minute.toString().padStart(2, '0')}:${dt.second.toString().padStart(2, '0')}.${dt.millisecond.toString().padEnd(3, '0')}`;
}

function closeDialog() {
  emit('close');
}

async function fetchLogs() {
  try {
    logs.value = await loggerStore.getRecentLogs();
  } catch (e) {
    const msg = `Failed to fetch logs: ${e}`;
    console.error(msg);
    appStore.setErrorMessage({
      message: msg,
    });
  }
}

async function clearLogs() {
  try {
    await loggerStore.clearLogs();
    await fetchLogs();
  } catch (e) {
    const msg = `Failed to clear logs: ${e}`;
    console.error(msg);
    appStore.setErrorMessage({
      message: msg,
    });
  }
}

onBeforeMount(() => {
  fetchLogs();
});
</script>
