import { create } from "zustand";
import { instructorService } from "../services/instructor.service";
import type { InstructorInfoResponse } from "../types/instructor.types";

interface InstructorState {
  instructorInfo: InstructorInfoResponse | null;
  isLoading: boolean;
  isInitialized: boolean;

  fetchInstructorInfo: () => Promise<void>;
  setInstructorInfo: (info: InstructorInfoResponse | null) => void;
  reset: () => void;
}

export const useInstructorStore = create<InstructorState>((set, get) => ({
  instructorInfo: null,
  isLoading: false,
  isInitialized: false,

  fetchInstructorInfo: async () => {
    if (get().isInitialized || get().isLoading) return;

    set({ isLoading: true });
    try {
      const res = await instructorService.getInfo();
      if (res.data) {
        set({ instructorInfo: res.data, isInitialized: true });
      } else {
        set({ instructorInfo: null, isInitialized: true });
      }
    } catch (error) {
      console.error("Failed to fetch instructor info", error);
      set({ instructorInfo: null, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },

  setInstructorInfo: (info) =>
    set({ instructorInfo: info, isInitialized: true }),

  reset: () =>
    set({ instructorInfo: null, isLoading: false, isInitialized: false }),
}));
