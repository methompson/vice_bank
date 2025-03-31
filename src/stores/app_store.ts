import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';

export enum MessageType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export enum MessageLocation {
  Top = 'top',
  Bottom = 'bottom',
  TopLeft = 'top left',
  TopRight = 'top right',
  BottomLeft = 'bottom left',
  BottomRight = 'bottom right',
}

interface SetMessageInput {
  message: string;
  timeout?: number;
  messageLocation?: MessageLocation;
}

export const useAppStore = defineStore('appStore', () => {
  // #region Messaging
  const messageState = ref('');
  const messageTypeState: Ref<MessageType | undefined> = ref(undefined);
  const msgTimeout: Ref<number | undefined> = ref(undefined);
  const messageLocationState = ref(MessageLocation.Bottom);

  const message = computed(() => messageState.value);
  const messageType = computed(() => messageTypeState.value);
  const messageLocation = computed(() => messageLocationState.value);

  function setMessage(
    msg: string,
    type: MessageType,
    timeout: number,
    location: MessageLocation = MessageLocation.Bottom,
  ) {
    messageState.value = msg;
    messageTypeState.value = type;

    msgTimeout.value = window.setTimeout(() => clearMessage(), timeout);
    messageLocationState.value = location;
  }

  function setErrorMessage(input: SetMessageInput) {
    setMessage(
      input.message,
      MessageType.Error,
      input.timeout ?? 50000,
      input.messageLocation,
    );
  }

  function setInfoMessage(input: SetMessageInput) {
    setMessage(
      input.message,
      MessageType.Info,
      input.timeout ?? 5000,
      input.messageLocation,
    );
  }

  function setSuccessMessage(input: SetMessageInput) {
    setMessage(
      input.message,
      MessageType.Success,
      input.timeout ?? 5000,
      input.messageLocation,
    );
  }

  function clearMessage() {
    messageState.value = '';
    // messageTypeState.value = undefined;
    clearTimeout(msgTimeout.value);
    msgTimeout.value = undefined;
  }

  // #endregion

  async function login(email: string, password: string) {
    const authInst = getAuth();

    const userCredentials = await signInWithEmailAndPassword(
      authInst,
      email,
      password,
    );

    return userCredentials;
  }

  async function logout() {
    const auth = getAuth();
    await signOut(auth);
  }

  return {
    // auth
    login,
    logout,

    // Messaging
    message,
    messageType,
    messageLocation,
    setErrorMessage,
    setInfoMessage,
    setSuccessMessage,
  };
});
