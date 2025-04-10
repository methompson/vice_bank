import { isArrayOfGenerator } from 'tcheck';

import {
  TaskDeposit,
  type TaskDepositJSON,
} from '@vice_bank/models/task_deposit';

import { getAuthToken, getBaseUrl } from '@/utils/auth';

const isTaskDepositJSONArray = isArrayOfGenerator<TaskDepositJSON>(
  TaskDeposit.isTaskDepositJSON,
);

export async function getTaskDeposits(
  vbUserId: string,
): Promise<TaskDeposit[]> {
  const url = `${getBaseUrl()}/vice_bank/taskDeposits?vbUserId=${vbUserId}`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting task deposits:', dat);
    throw new Error(`Error getting task deposits`);
  }

  const taskDeposits = dat.taskDeposits;

  if (!isTaskDepositJSONArray(taskDeposits)) {
    throw new Error('Invalid response from server');
  }

  return taskDeposits.map((taskDeposit) => new TaskDeposit(taskDeposit));
}

export async function addTaskDeposit(
  deposit: TaskDeposit,
): Promise<TaskDeposit> {
  const url = `${getBaseUrl()}/vice_bank/addTaskDeposit`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    taskDeposit: {
      vbUserId: deposit.vbUserId,
      date: deposit.date.toISO(),
      task: deposit.task.toJSON(),
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error adding task deposit:', dat);
    throw new Error(`Error adding task deposit`);
  }

  if (!TaskDeposit.isTaskDepositJSON(dat.taskDeposit)) {
    const test = TaskDeposit.taskDepositJSONTest(dat.taskDeposit);
    console.error(`Invalid response from server: ${test.join(',')}`, dat);
    throw new Error('Invalid response from server');
  }

  return new TaskDeposit(dat.taskDeposit);
}

export async function updateTaskDeposit(
  deposit: TaskDeposit,
): Promise<TaskDeposit> {
  const url = `${getBaseUrl()}/vice_bank/updateTaskDeposit`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    taskDeposit: deposit.toJSON(),
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error updating task deposit:', dat);
    throw new Error(`Error updating task deposit`);
  }

  if (!TaskDeposit.isTaskDepositJSON(dat.taskDeposit)) {
    const test = TaskDeposit.taskDepositJSONTest(dat.taskDeposit);
    console.error(`Invalid response from server: ${test.join(',')}`, dat);
    throw new Error('Invalid response from server');
  }

  return new TaskDeposit(dat.taskDeposit);
}

export async function deleteTaskDeposit(
  taskDepositId: string,
): Promise<TaskDeposit> {
  const url = `${getBaseUrl()}/vice_bank/deleteTaskDeposit`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    taskDepositId,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error deleting task deposit:', dat);
    throw new Error(`Error deleting task deposit`);
  }

  if (!TaskDeposit.isTaskDepositJSON(dat.taskDeposit)) {
    const test = TaskDeposit.taskDepositJSONTest(dat.taskDeposit);
    console.error(`Invalid response from server: ${test.join(',')}`, dat);
    throw new Error('Invalid response from server');
  }

  return new TaskDeposit(dat.taskDeposit);
}
