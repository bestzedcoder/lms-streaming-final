import { create } from "zustand";
import { studentService } from "../services/student.service";

interface CartState {
  cartCount: number;
  fetchCartCount: () => Promise<void>;
  setCartCount: (count: number) => void;
  addItem: () => void;
  removeItem: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartCount: 0,

  fetchCartCount: async () => {
    try {
      const res = await studentService.getCountItem();
      set({ cartCount: res.data as number });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
    }
  },

  setCartCount: (count: number) => set({ cartCount: count }),

  addItem: () => set((state) => ({ cartCount: state.cartCount + 1 })),

  removeItem: () =>
    set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),

  clearCart: () => set({ cartCount: 0 }),
}));
