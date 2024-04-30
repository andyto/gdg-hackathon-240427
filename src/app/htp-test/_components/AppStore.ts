import { create } from "zustand";

type TestState = {
  id?: string;
  stage: number;
  setStage: (stage: number) => void;
  drawing?: File;
  setDrawing: (drawing: File | undefined) => void;
  genId: () => void;
};

export const useAppStore = create<TestState>()((set) => ({
  stage: 0,
  setStage: (stage) => set({ stage }),
  setDrawing: (drawing) => set({ drawing }),
  genId: () => {
    const id = Math.random().toString(36).substring(7);
    set({ id });
  },
}));
