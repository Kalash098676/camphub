# 🎓 CampusHub — Frontend Web Application

This directory contains the **React 19 + Vite 8** Single Page Application for **CampusHub**, styled with Vanilla CSS and powered by Zustand state management.

> 📌 **For full project documentation (including Backend API, MongoDB models, setup instructions, and architecture breakdown), please check the root [README.md](../README.md).**

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: React 19 (Vite 8 template scaffold)
- **State Management**: Zustand (`src/store/`)
- **Forms & Validation**: React Hook Form + Zod (`@hookform/resolvers`, `zod`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Styling**: Pure Vanilla CSS (`src/index.css`)
- **Linter**: Oxlint

---

## 📂 Source Structure

```
src/
├── components/          # Page sections (Navbar, Hero, Store, Services, PrintHub, Admin)
│   ├── drawers/         # CartDrawer, WishlistDrawer
│   └── modals/          # AuthModal, CheckoutModal, AIChatDrawer, TrackOrderModal, etc.
├── data/                # Sample products, categories, combos, coupons fallback
├── store/               # Zustand store modules (cart, wishlist, user, orders)
├── utils/               # Formatting helpers & utilities
├── App.jsx              # Main view controller & page layout
├── index.css            # Custom CSS Design System, tokens, glassmorphism, animations
└── main.jsx             # Application entry point
```
