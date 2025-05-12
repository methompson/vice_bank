import {
  isVBUserTokensJSON,
  type VBUserTokens,
  type VBUserTokensJSON,
} from './vb_user_types';
import {
  isArrayOfGenerator,
  isRecord,
  isString,
  isUndefinedOrNull,
  typeGuardGenerator,
  unionGuard,
} from 'tcheck';

interface VBUserLocalDataPayload {
  vbUserTokens?: VBUserTokens[];
  currentUserId?: string;
}
interface VBUserLocalData {
  vbUserTokens?: VBUserTokensJSON[];
  currentUserId?: string;
}

const isVBUserLocalData = typeGuardGenerator<VBUserLocalData>({
  currentUserId: unionGuard(isString, isUndefinedOrNull),
  vbUserTokens: unionGuard(
    isArrayOfGenerator(isVBUserTokensJSON),
    isUndefinedOrNull,
  ),
});

const LOCAL_VB_USER_DATA_KEY = 'localVBUserData';

export function persistVBUserData(payload: VBUserLocalDataPayload) {
  const vbUserTokens = payload.vbUserTokens;
  const { currentUserId } = payload;

  localStorage.setItem(
    LOCAL_VB_USER_DATA_KEY,
    JSON.stringify({ vbUserTokens, currentUserId }),
  );
}

export function getVBUserData(): VBUserLocalData {
  const defaultVals = {
    vbUserTokens: undefined,
    currentUserId: undefined,
  };
  const rawData = localStorage.getItem(LOCAL_VB_USER_DATA_KEY);

  if (!isString(rawData)) {
    return defaultVals;
  }

  try {
    const data = JSON.parse(rawData);

    if (!isRecord(data)) {
      return defaultVals;
    }

    const { vbUserTokens, currentUserId } = data;

    // const

    if (
      isVBUserLocalData({
        vbUserTokens,
        currentUserId,
      })
    ) {
      return {};
    }
  } catch (_e) {}
}
