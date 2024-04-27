import { create } from "zustand";

type TestState = {
  stage: number;
  setStage: (stage: number) => void;
};

export const useAppStore = create<TestState>()((set) => ({
  stage: 0,
  setStage: (stage) => set({ stage }),
}));
