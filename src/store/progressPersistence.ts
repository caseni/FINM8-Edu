import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { StateStorage } from 'zustand/middleware';

export type ProgressSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ProgressPersistenceStatusState {
  status: ProgressSaveStatus;
  lastSavedAt?: string;
  setSaving: () => void;
  setSaved: (savedAt: string) => void;
  setError: () => void;
}

interface PendingWrite {
  name: string;
  value: string;
}

let latestWrite: PendingWrite | undefined;
let writeSequence = 0;
let writeQueue: Promise<void> = Promise.resolve();
let hideSavedTimer: ReturnType<typeof setTimeout> | undefined;

export const useProgressPersistenceStatusStore =
  create<ProgressPersistenceStatusState>((set) => ({
    status: 'idle',
    lastSavedAt: undefined,
    setSaving: () => {
      if (hideSavedTimer) clearTimeout(hideSavedTimer);
      set({ status: 'saving' });
    },
    setSaved: (lastSavedAt) => {
      if (hideSavedTimer) clearTimeout(hideSavedTimer);
      set({ status: 'saved', lastSavedAt });
      hideSavedTimer = setTimeout(() => set({ status: 'idle' }), 2200);
    },
    setError: () => {
      if (hideSavedTimer) clearTimeout(hideSavedTimer);
      set({ status: 'error' });
    },
  }));

async function enqueueWrite(name: string, value: string) {
  latestWrite = { name, value };
  const sequence = ++writeSequence;
  useProgressPersistenceStatusStore.getState().setSaving();

  const operation = writeQueue.then(
    () => AsyncStorage.setItem(name, value),
    () => AsyncStorage.setItem(name, value)
  );

  writeQueue = operation.catch(() => undefined);

  try {
    await operation;
    if (sequence === writeSequence) {
      useProgressPersistenceStatusStore
        .getState()
        .setSaved(new Date().toISOString());
    }
  } catch (error) {
    if (sequence === writeSequence) {
      useProgressPersistenceStatusStore.getState().setError();
    }
    throw error;
  }
}

export async function retryLatestProgressSave() {
  if (!latestWrite) return false;

  try {
    await enqueueWrite(latestWrite.name, latestWrite.value);
    return true;
  } catch {
    return false;
  }
}

export const trackedProgressStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => enqueueWrite(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
};
