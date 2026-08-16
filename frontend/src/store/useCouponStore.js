import { create } from 'zustand';

const STORAGE_KEY = 'campushub_coupons';

const DEFAULT_COUPONS = [
  { code: 'FIRSTDEL', type: 'freedelivery', value: 0, description: 'Free Delivery on Your First Order 🎉', firstOrderOnly: true, assignedEmail: null, active: true },
  { code: 'CAMPUS10', type: 'percent', value: 10, description: '10% Campus Discount', firstOrderOnly: false, assignedEmail: null, active: true },
  { code: 'WELCOME50', type: 'flat', value: 50, description: 'Flat ₹50 Welcome Discount', firstOrderOnly: false, assignedEmail: null, active: true },
  { code: 'FREESHIP', type: 'freedelivery', value: 0, description: 'Free Campus Runner Delivery', firstOrderOnly: false, assignedEmail: null, active: true }
];

const loadCoupons = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.length > 0) return saved;
  } catch (err) {
    console.warn('Failed to load coupons from localStorage:', err);
  }
  return DEFAULT_COUPONS;
};

const persist = (coupons) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
};

export const useCouponStore = create((set, get) => ({
  coupons: loadCoupons(),

  // Admin: create or update a coupon
  addCoupon: (coupon) => {
    const code = coupon.code.trim().toUpperCase();
    if (!code) return;
    set((state) => {
      const withoutExisting = state.coupons.filter(c => c.code !== code);
      const updated = [
        ...withoutExisting,
        {
          code,
          type: coupon.type || 'flat',
          value: Number(coupon.value) || 0,
          description: coupon.description || `${code} discount`,
          firstOrderOnly: !!coupon.firstOrderOnly,
          assignedEmail: coupon.assignedEmail ? coupon.assignedEmail.trim().toLowerCase() : null,
          active: true
        }
      ];
      persist(updated);
      return { coupons: updated };
    });
  },

  toggleCoupon: (code) => {
    set((state) => {
      const updated = state.coupons.map(c => c.code === code ? { ...c, active: !c.active } : c);
      persist(updated);
      return { coupons: updated };
    });
  },

  removeCoupon: (code) => {
    set((state) => {
      const updated = state.coupons.filter(c => c.code !== code);
      persist(updated);
      return { coupons: updated };
    });
  },

  // Customer: coupons that this customer is currently eligible to see/use
  getAvailableCoupons: ({ userEmail, isFirstOrder }) => {
    const email = (userEmail || '').toLowerCase();
    return get().coupons.filter(c =>
      c.active &&
      (!c.firstOrderOnly || isFirstOrder) &&
      (!c.assignedEmail || c.assignedEmail === email)
    );
  },

  // Customer: validate a typed-in code and compute the discount
  validateCoupon: (codeInput, { userEmail, isFirstOrder, subtotal, deliveryCharge }) => {
    const code = codeInput.trim().toUpperCase();
    const email = (userEmail || '').toLowerCase();
    const coupon = get().coupons.find(c => c.code === code);

    if (!coupon || !coupon.active) {
      return { success: false, message: 'Invalid or inactive coupon code' };
    }
    if (coupon.assignedEmail && coupon.assignedEmail !== email) {
      return { success: false, message: 'This coupon is not valid on your account' };
    }
    if (coupon.firstOrderOnly && !isFirstOrder) {
      return { success: false, message: 'This coupon is valid only on your first order' };
    }

    let discount = 0;
    let message = '';
    if (coupon.type === 'percent') {
      discount = Math.round(subtotal * (coupon.value / 100));
      message = `${coupon.value}% discount applied!`;
    } else if (coupon.type === 'flat') {
      discount = coupon.value;
      message = `Flat ₹${coupon.value} discount applied!`;
    } else if (coupon.type === 'freedelivery') {
      discount = deliveryCharge;
      message = 'Free delivery applied!';
    }

    return { success: true, discount, message, coupon };
  }
}));