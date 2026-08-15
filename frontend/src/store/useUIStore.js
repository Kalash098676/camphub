import { create } from 'zustand';

export const useUIStore = create((set) => ({
  loginOpen: false,
  sellerOpen: false,
  trackOpen: false,
  cartOpen: false,
  checkoutOpen: false,
  wishlistOpen: false,
  aiChatOpen: false,
  selectedProduct: null,
  toasts: [],

  setLoginOpen: (val) => set({ loginOpen: val }),
  setSellerOpen: (val) => set({ sellerOpen: val }),
  setTrackOpen: (val) => set({ trackOpen: val }),
  setCartOpen: (val) => set({ cartOpen: val }),
  setCheckoutOpen: (val) => set({ checkoutOpen: val }),
  setWishlistOpen: (val) => set({ wishlistOpen: val }),
  setAiChatOpen: (val) => set({ aiChatOpen: val }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  addToast: (message, isError = false) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, isError }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 3000);
  }
}));
