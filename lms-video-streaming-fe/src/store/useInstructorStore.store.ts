import { create } from "zustand";
import { instructorService } from "../services/instructor.service";
import type { InstructorInfoResponse } from "../@types/instructor.types";

interface InstructorState {
  instructorInfo: InstructorInfoResponse | null;
  pendingApprovals: number;
  isLoading: boolean;
  isInitialized: boolean;

  fetchInstructorInfo: () => Promise<void>;
  setInstructorInfo: (info: InstructorInfoResponse | null) => void;
  setPendingApprovals: (count: number) => void;
  decrementPending: () => void;
  reset: () => void;
}

export const useInstructorStore = create<InstructorState>((set, get) => ({
  instructorInfo: null,
  pendingApprovals: 0,
  isLoading: false,
  isInitialized: false,

  fetchInstructorInfo: async () => {
    if (get().isInitialized || get().isLoading) return;

    set({ isLoading: true });
    try {
      const [infoRes, pendingRes] = await Promise.all([
        instructorService.getInfo(),
        instructorService.countPendingRegistrationsByInstructor(),
      ]);

      set({
        instructorInfo: infoRes.data || null,
        pendingApprovals: pendingRes.data,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Failed to fetch instructor data", error);
      set({ instructorInfo: null, pendingApprovals: 0, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },

  setInstructorInfo: (info) =>
    set({ instructorInfo: info, isInitialized: true }),

  setPendingApprovals: (count) => set({ pendingApprovals: count }),

  decrementPending: () =>
    set((state) => ({
      pendingApprovals: Math.max(0, state.pendingApprovals - 1),
    })),

  reset: () =>
    set({
      instructorInfo: null,
      pendingApprovals: 0,
      isLoading: false,
      isInitialized: false,
    }),
}));
