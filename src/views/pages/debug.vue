<template>
  <VContainer>
    <VRow>
      <VCol class="pa-1">
        <VBtn @click="addLog" density="compact">Add Log</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="addErrorLog" density="compact">Add Error Log</VBtn>
      </VCol>

      <VCol class="pa-1">
        <VBtn @click="readLogs" density="compact">Read Logs</VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { useLoggerStore } from '@/stores/logger_store';
import { readLogsFromDB } from '@/stores/logger_db_connection';
import { DateTime } from 'luxon';

const loggerStore = useLoggerStore();

async function addErrorLog() {
  console.log('Adding Error Log');
  await loggerStore.addErrorLog(
    'This is a test error log with a lot of text. I am trying to see what the logging page does when the page extends past the point where it ought to wrap around.',
  );

  await loggerStore.addInfoLog('This is another test log', {
    timestamp: DateTime.now().minus({ months: 1 }),
  });
  console.log('Log Added');
}
async function addLog() {
  console.log('Adding Log');
  await loggerStore.addInfoLog(
    'This is a test log with a lot of text. I am trying to see what the logging page does when the page extends past the point where it ought to wrap around.',
  );

  await loggerStore.addInfoLog('This is another test log', {
    timestamp: DateTime.now().minus({ months: 1 }),
  });
  console.log('Log Added');
}

async function readLogs() {
  try {
    const logs = await readLogsFromDB();
    console.log('Logs read successfully', logs);
  } catch (e) {
    console.error('Error reading logs:', e);
  }
}
</script>
