import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  cartOpen: false,
  setCart: (cart) => set({ cart }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
  checkCart: async () => {
    const response = await fetch('/api/cart', { credentials: 'include' });
    if (response.status === 200) {
      const cart = await response.json();
      set({ cart });
    } else {
      set({ cart: [] });
    }
  },
}));
