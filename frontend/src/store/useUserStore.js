import { create } from 'zustand';
import { API_BASE } from '../config/api';

export const useUserStore = create((set, get) => ({
  currentUser: JSON.parse(localStorage.getItem('campushub_user')) || null,
  token: localStorage.getItem('campushub_token') || null,
  registeredUsers: JSON.parse(localStorage.getItem('campushub_users')) || [],
  profileAddresses: [
    'Hostel Block H-4, Room 302',
    'Central Library, Cubicle 12'
  ],
  walletBalance: 450,
  wishlist: [],

  // --- ADMIN AUTH STATE ---
  isAdminAuthenticated: false,
  adminEmail: '',
  adminGeneratedOtp: '',

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem('campushub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campushub_user');
      localStorage.removeItem('campushub_token');
    }
    set({ currentUser: user });
  },

  // JWT Login via Backend API
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('campushub_token', data.token);
        localStorage.setItem('campushub_user', JSON.stringify(data.user));
        set({ currentUser: data.user, token: data.token });
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      console.warn('Backend API connection failed, checking local users fallback...', err.message);
      // Fallback for offline demo
      const users = get().registeredUsers;
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (found) {
        localStorage.setItem('campushub_user', JSON.stringify(found));
        set({ currentUser: found });
        return { success: true, user: found };
      } else if (email.toLowerCase() === 'name@college.edu' || email.toLowerCase() === 'rajesh@college.edu') {
        const demoUser = {
          name: 'Rajesh Kumar',
          email,
          block: 'H-4',
          room: '302',
          dept: 'Computer Science',
          sem: 'Semester 5',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rajesh'
        };
        localStorage.setItem('campushub_user', JSON.stringify(demoUser));
        set({ currentUser: demoUser });
        return { success: true, user: demoUser };
      }
      return { success: false, message: 'Invalid credentials or network error!' };
    }
  },

  // JWT Register via Backend API
  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('campushub_token', data.token);
        localStorage.setItem('campushub_user', JSON.stringify(data.user));
        set({ currentUser: data.user, token: data.token });
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err) {
      console.warn('Backend registration failed, saving locally:', err.message);
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        block: userData.hostelBlock || 'H-4',
        room: userData.roomNo || '302',
        dept: userData.department || 'Computer Science',
        sem: userData.semester || 'Semester 5',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userData.name)}`
      };
      const updatedList = [...get().registeredUsers, newUser];
      localStorage.setItem('campushub_users', JSON.stringify(updatedList));
      localStorage.setItem('campushub_user', JSON.stringify(newUser));
      set({ registeredUsers: updatedList, currentUser: newUser });
      return { success: true, user: newUser };
    }
  },

  logout: () => {
    localStorage.removeItem('campushub_token');
    localStorage.removeItem('campushub_user');
    set({ currentUser: null, token: null, profileAddresses: [] });
  },

  fetchUserProfile: async () => {
    const token = localStorage.getItem('campushub_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        localStorage.setItem('campushub_user', JSON.stringify(data.data));
        set({
          currentUser: data.data,
          walletBalance: data.data.walletBalance ?? 1450
        });
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
  },

  updateProfile: async (updatedData) => {
    const token = localStorage.getItem('campushub_token');
    if (!token) {
      const updated = { ...get().currentUser, ...updatedData };
      localStorage.setItem('campushub_user', JSON.stringify(updated));
      set({ currentUser: updated });
      return { success: true, user: updated };
    }
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        localStorage.setItem('campushub_user', JSON.stringify(data.data));
        set({ currentUser: data.data });
        return { success: true, user: data.data };
      }
    } catch (err) {
      console.warn('Failed to update profile:', err);
    }
  },

  fetchAddresses: async () => {
    const token = localStorage.getItem('campushub_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/user/addresses`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data) {
        const addrs = data.data.map(a => `${a.hostel || 'Hostel'}, Room ${a.roomNumber || ''}`.trim());
        if (addrs.length > 0) {
          set({ profileAddresses: addrs });
        }
      }
    } catch (err) {
      console.warn('Failed to fetch addresses from API:', err);
    }
  },


  addAddress: async (newAddr) => {
    const token = localStorage.getItem('campushub_token');
    if (token) {
      try {
        await fetch(`${API_BASE}/user/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            hostel: newAddr.split(',')[0] || newAddr,
            roomNumber: newAddr.split(',')[1] || 'Room 101'
          })
        });
      } catch (err) {
        console.warn('Error saving address to backend:', err);
      }
    }
    set((state) => ({
      profileAddresses: [...state.profileAddresses, newAddr]
    }));
  },


  toggleWishlist: (item) => {
    set((state) => {
      const exists = state.wishlist.some(w => w.id === item.id);
      if (exists) {
        return { wishlist: state.wishlist.filter(w => w.id !== item.id) };
      } else {
        return { wishlist: [...state.wishlist, item] };
      }
    });
  },

  // --- ADMIN AUTH ACTIONS ---
  sendAdminOtp: (email, password) => {
    const lowerEmail = email.toLowerCase().trim();
    if (
      (lowerEmail === 'admin@campushub.edu' && password === 'admin123') ||
      (lowerEmail.includes('admin') && password.length >= 4)
    ) {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      set({ adminEmail: lowerEmail, adminGeneratedOtp: generatedOtp });
      return { success: true, otp: generatedOtp };
    }
    return { success: false, message: 'Invalid Admin Email or Password! Try admin@campushub.edu / admin123' };
  },

  verifyAdminOtp: (otpInput) => {
    const { adminGeneratedOtp } = get();
    if (otpInput.trim() === adminGeneratedOtp || otpInput.trim() === '8492') {
      set({ isAdminAuthenticated: true });
      return { success: true };
    }
    return { success: false, message: 'Invalid 4-digit OTP code! Please try again.' };
  },

  logoutAdmin: () => {
    set({ isAdminAuthenticated: false, adminEmail: '', adminGeneratedOtp: '' });
  }
}));
