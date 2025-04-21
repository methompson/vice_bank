import type { ViceBankUser } from '@vice_bank/models/vice_bank_user';

export interface VBUserTokens {
  user: ViceBankUser;
  currentTokens: number;
}
