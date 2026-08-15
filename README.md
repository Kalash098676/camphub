# 🎓 CampusHub — Hyperlocal Quick E-Commerce & Campus Services Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)](https://zustand-demo.pmnd.rs/)

> **CampusHub** is a state-of-the-art, hyperlocal quick e-commerce and campus services platform tailored specifically for college students, dorm residents, and faculty. Designed with modern Apple-, Stripe-, and Notion-inspired minimalist design principles, CampusHub delivers instant 10-minute campus delivery, document printing, peer-to-peer marketplace trading, and campus utility services under a single unified application.

---

## 🌟 Overview & Highlights

- **⚡ 10-Minute Campus Delivery**: Order late-night snacks, exam stationery, electronics, and dorm essentials delivered directly to hostel rooms, library tables, or department blocks.
- **🖨️ Instant PrintHub**: Upload PDFs/documents, configure color, paper size, and binding options, and receive printed copies at your dorm door.
- **🔄 Peer-to-Peer Student Marketplace**: Buy and sell second-hand textbooks, lab coats, cycles, and hostel furniture with verified campus peers.
- **🛠️ Campus Utility Services**: Book trusted local services such as hostel laundry pickup, room deep cleaning, gadget repair, and peer tutoring.
- **💰 Campus Pay / Wallet**: Built-in digital campus wallet featuring instant top-ups, referral bonuses, transaction history, and seamless single-click checkouts.
- **🎯 Live Order Tracker Simulator**: Real-time delivery step timeline simulation (try tracking order ID `CH-12345`).
- **🤖 AI Campus Concierge**: Integrated AI Assistant to recommend study bundles, navigate campus deals, and answer instant queries.
- **📊 Admin Operations Center**: Comprehensive administrative portal for real-time sales metrics, product inventory management, order status lifecycle updates, and print queue processing.

---

## 📁 Repository Structure

```
prototype-quick-ecommerce/
├── backend/                  # Node.js + Express + MongoDB REST API
│   ├── config/               # Database connection (Mongoose DB)
│   ├── controllers/          # Business logic (Auth, User, Product, Order)
│   ├── middleware/           # JWT auth & error handling middleware
│   ├── models/               # Mongoose schemas (User, Product, Order, Coupon, etc.)
│   ├── routes/               # API endpoint definitions
│   ├── seed/                 # Database seeder script with rich initial dataset
│   ├── .env                  # Backend environment configuration
│   ├── index.js              # Express server entry point
│   └── package.json          # Backend dependencies and scripts
│
├── frontend/                 # React + Vite Single Page Application
│   ├── public/               # Static photographs, slide banners, and media assets
│   ├── src/
│   │   ├── components/       # Core UI sections (Navbar, Hero, Store, Services, PrintHub, Admin)
│   │   │   ├── drawers/      # Slide-out drawers (CartDrawer, WishlistDrawer)
│   │   │   └── modals/       # Interactive overlays (Auth, Checkout, AI Chat, TrackOrder, etc.)
│   │   ├── data/             # Mock datasets & fallback items
│   │   ├── store/            # Zustand global state management
│   │   ├── utils/            # Helper utilities and formatters
│   │   ├── App.jsx           # Main React component & view router
│   │   ├── index.css         # Custom Vanilla CSS design system & tokens
│   │   └── main.jsx          # React app DOM entry point
│   ├── package.json          # Frontend dependencies and scripts
│   └── vite.config.js        # Vite bundler configuration
│
└── README.md                 # Project root documentation
```

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 19 + Vite 8.1
- **State Management**: Zustand v5
- **Form Handling & Validation**: React Hook Form + Zod
- **Styling**: Pure Vanilla CSS with CSS custom properties, HSL color system, glassmorphism, and micro-interactions
- **Icons & Assets**: Custom SVG icon system and locally hosted high-resolution campus photography

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js v4.21
- **Database**: MongoDB (Mongoose v8.9 ORM)
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **Middleware**: CORS, Express JSON parser, Dotenv environment manager

---

## 🔥 Features breakdown

### 1. 🛍️ E-Commerce Storefront
- **Categorized Shopping**: Browse categories including *Study Supplies*, *Electronics*, *Snacks & Drinks*, *Hostel & Decor*, *Campus Merch*, *Services*, *Print Hub*, and *Marketplace*.
- **Search with Autocomplete**: Real-time keyword filtering that highlights matching items dynamically.
- **Interactive Product Modal**: Zoomable image previews, stock indicators, product specs, reviews, and quick cart actions.
- **Campus Combos**: Curated deal packages like *Exam Night Survival Pack* and *Dorm Setup Kit*.

### 2. 🖨️ PrintHub (Cloud Printing Service)
- Document file upload preview (PDF, DOCX).
- Select print orientation, color mode (Color vs. Black & White), paper side (Single vs. Double-sided), and binding types (Spiral, Staple, Softcover).
- Automatic cost calculation based on page counts and runner delivery to student hostels.

### 3. 🤝 Student-to-Student Marketplace
- List pre-owned books, lab equipment, cycles, and electronics.
- Verified seller badges and direct contact modals.

### 4. 💼 Student Profile & Campus Wallet
- **Campus Pay**: Digital wallet balance management, top-up options, cashback rewards, and full ledger history.
- **Delivery Address Manager**: Save multiple campus delivery locations (Hostels, Departments, Library, Campus Gates).
- **Active Orders & Notifications**: View past orders, tracking codes, and status updates.

### 5. 🛒 Cart, Wishlist & Checkout
- Slide-out **Cart Drawer** with quantity adjusters, subtotal summary, campus runner delivery fee (₹39), tip selection, and express shipping option.
- Promo coupon application system (`CAMPUS100`, `FIRST50`, `PRINT20`).
- Slide-out **Wishlist Drawer** to bookmark favorite items.
- Multi-step **Checkout Modal** supporting UPI, Campus Wallet, COD, and Card payments.

### 6. 🤖 AI Campus Concierge
- Interactive drawer featuring an AI assistant designed to help students discover products, check order status, and resolve common campus queries.

### 7. 🛡️ Admin Operations Dashboard
- Password/PIN protected administrative view.
- Real-time operational metrics: Total Revenue, Total Orders, Active Users, and Pending Print Jobs.
- Product inventory creation, pricing update, and stock management.
- Live order status update pipeline (`Pending` → `Preparing` → `Dispatched` → `Delivered`).

---

## ⚡ Getting Started (Local Setup)

### **Prerequisites**
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster connection string)

---

### **1. Clone & Setup Repository**
```bash
git clone https://github.com/Anjaligupta55/campusHub.git
cd prototype-quick-ecommerce
```

---

### **2. Backend Setup**

Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory (if not already present):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campushub?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
```

Seed the database with sample products, categories, coupons, and users:
```bash
npm run seed
```

Start the backend development server:
```bash
npm run dev
```
> The API server will start on `http://localhost:5000`.

---

### **3. Frontend Setup**

Open a new terminal window, navigate to the `frontend` directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
> The frontend web app will run on `http://localhost:5173`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new student account |
| **POST** | `/api/auth/login` | Authenticate user & issue JWT |
| **GET** | `/api/products` | Fetch all products (supports category & search filters) |
| **GET** | `/api/products/:id` | Fetch single product details |
| **POST** | `/api/products` | Create product (Admin access) |
| **GET** | `/api/orders` | Get user order history / list orders |
| **POST** | `/api/orders` | Place a new order |
| **GET** | `/api/orders/track/:orderId` | Track order by order ID (e.g., `CH-12345`) |
| **PUT** | `/api/orders/:id/status` | Update order status (Admin access) |
| **GET** | `/api/user/profile` | Get logged-in user profile details |
| **PUT** | `/api/user/wallet` | Top-up Campus Pay wallet balance |

---

## 📸 Demo Screenshots & Previews

- **Interactive Carousel & Category Grid**: Smooth 2.5s loop carousel featuring curated campus sales and vibrant realistic photo categories.
- **Live Tracker Demo**: Enter `CH-12345` in the navbar tracking bar to watch the 4-step delivery runner progression in real time!

---

## 📜 License & Credits

Developed with ❤️ for campus communities everywhere.  
Distributed under the **MIT License**.
