import { create } from 'zustand';
import { API_BASE } from '../config/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('campushub_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  trackInput: '',
  trackStatusResult: null,

  setTrackInput: (val) => set({ trackInput: val }),
  setTrackStatusResult: (val) => set({ trackStatusResult: val }),

  fetchUserOrders: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      const data = await res.json();
      if (data.success) {
        set({ orders: data.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.warn('Failed to fetch user orders from backend:', err);
      set({ loading: false });
    }
  },

  placeOrder: async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success) {
        get().fetchUserOrders();
        return { success: true, order: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.warn('Backend order creation failed, adding locally:', err);
      const newOrder = {
        _id: `CH-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        totalAmount: orderData.totalAmount || 0,
        orderStatus: 'Ordered',
        items: orderData.items || []
      };
      set((state) => ({ orders: [newOrder, ...state.orders] }));
      return { success: true, order: newOrder };
    }
  },

  trackLookup: (orderId) => {
    const code = orderId.toUpperCase().trim();
    if (!code) return { error: 'Please enter an Order ID' };

    const orders = get().orders;
    const dynamicOrder = orders.find(o => (o._id && o._id.toString().toUpperCase().includes(code)) || o.id === code);
    if (dynamicOrder) {
      const status = dynamicOrder.orderStatus || dynamicOrder.status || 'Ordered';
      const result = {
        orderId: dynamicOrder._id || dynamicOrder.id,
        estTime: status === 'Delivered' ? 'Delivered' : '15 Mins',
        steps: [
          { title: 'Order Confirmed', desc: 'Your payment was confirmed and order was received.', time: 'Today', status: 'completed' },
          { title: 'Runner Dispatched', desc: `Delivery partner assigned.`, time: 'Today', status: status === 'Ordered' ? 'active' : 'completed' },
          { title: 'Out for Delivery', desc: `Rider heading to your address.`, time: 'Today', status: status === 'Out for Delivery' ? 'active' : status === 'Delivered' ? 'completed' : 'pending' },
          { title: 'Delivered', desc: 'Order delivered to room floor.', time: status === 'Delivered' ? 'Today' : 'Pending', status: status === 'Delivered' ? 'completed' : 'pending' }
        ]
      };
      set({ trackStatusResult: result });
      return { success: true, result };
    }

    const errorResult = { error: true };
    set({ trackStatusResult: errorResult });
    return { success: false, result: errorResult };
  }
}));

