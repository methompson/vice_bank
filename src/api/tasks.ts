import { isArrayOfGenerator } from '@metools/tcheck';

import { Task } from '@vice_bank/models/task';
import { getAuthToken, getBaseUrl } from '@/utils/auth';

const isTaskJSONArray = isArrayOfGenerator<Task>(Task.isTaskJSON);

export async function getTasks(vbUserId: string): Promise<Task[]> {
  const url = `${getBaseUrl()}/vice_bank/tasks?vbUserId=${vbUserId}`;

  const headers = new Headers();
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error getting users:', dat);
    throw new Error(`Error getting users`);
  }

  const tasks = dat.tasks;

  if (!isTaskJSONArray(tasks)) {
    throw new Error('Invalid response from server');
  }

  return tasks.map((task) => new Task(task));
}

export async function addTask(task: Task): Promise<Task> {
  const url = `${getBaseUrl()}/vice_bank/addTask`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    taskToAdd: {
      vbUserId: task.vbUserId,
      name: task.name,
      frequency: task.frequency,
      tokensEarnedPerInput: task.tokensEarnedPerInput,
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error adding task:', dat);
    throw new Error(`Error adding task`);
  }
  if (!Task.isTaskJSON(dat.task)) {
    throw new Error('Invalid response from server');
  }

  return new Task(dat.task);
}

export async function updateTask(task: Task): Promise<Task> {
  const url = `${getBaseUrl()}/vice_bank/updateTask`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      task: task.toJSON(),
    }),
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error updating task:', dat);
    throw new Error(`Error updating task`);
  }
  if (!Task.isTaskJSON(dat.task)) {
    throw new Error('Invalid response from server');
  }

  return new Task(dat.task);
}

export async function deleteTask(taskId: string): Promise<Task> {
  const url = `${getBaseUrl()}/vice_bank/deleteTask`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ taskId }),
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error deleting task:', dat);
    throw new Error(`Error deleting task`);
  }
  if (!Task.isTaskJSON(dat.task)) {
    throw new Error('Invalid response from server');
  }

  return new Task(dat.task);
}
