import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  
  addToCart: (item) => {
    set((state) => {
      const existingIndex = state.cart.findIndex(i => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...state.cart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return { cart: updated };
      } else {
        return {
          cart: [...state.cart, {
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100',
            quantity: 1
          }]
        };
      }
    });
  },

  updateQty: (id, delta) => {
    set((state) => {
      const updated = state.cart.map(i => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean);
      return { cart: updated };
    });
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter(i => i.id !== id)
    }));
  },

  clearCart: () => set({ cart: [] }),

  // Computed Selectors
  getSubtotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
  getDeliveryCharge: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 500 ? 0 : 20;
  },
  getTotalCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0)
}));
