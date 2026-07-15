import { create } from 'zustand';
import type { PresentationMode } from '../domain/learning/types';

interface LearningUiState {
  /** Standalone preview adapter; FINM8 owns this preference after integration. */
  presentationMode: PresentationMode;
  setPresentationMode: (mode: PresentationMode) => void;
}

export const useLearningUiStore = create<LearningUiState>((set) => ({
  presentationMode: 'normal',
  setPresentationMode: (presentationMode) => set({ presentationMode }),
}));

