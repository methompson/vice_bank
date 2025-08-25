import {
  ViceBankUser,
  type ViceBankUserJSON,
} from '@vice_bank/models/vice_bank_user';
import { isNumber, typeGuardGenerator } from '@metools/tcheck';

export interface VBUserTokens {
  user: ViceBankUser;
  currentTokens: number;
}

export interface VBUserTokensJSON {
  user: ViceBankUserJSON;
  currentTokens: number;
}

export const isVBUserTokensJSON = typeGuardGenerator<VBUserTokensJSON>({
  user: ViceBankUser.isViceBankUserJSON,
  currentTokens: isNumber,
});
