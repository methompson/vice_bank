import { Reward, type RewardJSON } from '@vice_bank/models/reward';
import { getAuthToken, getBaseUrl } from '../utils/auth';
import { isArrayOfGenerator } from 'tcheck';

const isRewardsJSONArray = isArrayOfGenerator<RewardJSON>(Reward.isRewardJSON);

export async function getRewards(vbUserId: string): Promise<Reward[]> {
  const url = `${getBaseUrl()}/vice_bank/rewards?vbUserId=${vbUserId}`;

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
  if (!isRewardsJSONArray(dat)) {
    throw new Error('Invalid response from server');
  }

  return dat.map((r) => new Reward(r));
}

export async function addReward(reward: Reward): Promise<Reward> {
  const url = `${getBaseUrl()}/vice_bank/addReward`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    rewardToAdd: {
      vbUserId: reward.vbUserId,
      name: reward.name,
      price: reward.price,
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error adding reward:', dat);
    throw new Error(`Error adding reward`);
  }
  if (!Reward.isRewardJSON(dat.reward)) {
    throw new Error('Invalid response from server');
  }

  return new Reward(dat.reward);
}

export async function updateReward(reward: Reward): Promise<Reward> {
  const url = `${getBaseUrl()}/vice_bank/updateReward`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    reward: reward.toJSON(),
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error updating reward:', dat);
    throw new Error(`Error updating reward`);
  }
  if (!Reward.isRewardJSON(dat.reward)) {
    throw new Error('Invalid response from server');
  }

  return new Reward(dat.reward);
}

export async function deleteReward(rewardId: string): Promise<Reward> {
  const url = `${getBaseUrl()}/vice_bank/deleteReward`;

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', await getAuthToken());

  const body = JSON.stringify({
    rewardId,
  });

  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  });

  const dat = await response.json();

  if (!response.ok) {
    console.error('Error deleting reward:', dat);
    throw new Error(`Error deleting reward`);
  }
  if (!Reward.isRewardJSON(dat.reward)) {
    throw new Error('Invalid response from server');
  }

  return new Reward(dat.reward);
}
