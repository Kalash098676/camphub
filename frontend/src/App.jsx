import React, { useState, useEffect, useRef } from 'react';

// Data & Constants
import {
  PRODUCTS,
  RAW_CATALOG,
  CATALOG_PRODUCTS,
  SERVICES,
  COMBOS,
  MARKETPLACE
} from './data/mockData.jsx';

// Components
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import FeaturedProducts from './components/FeaturedProducts';
import CombosSection from './components/CombosSection';
import MarketplaceSection from './components/MarketplaceSection';
import PrintHubSection from './components/PrintHubSection';
import ServicesSection from './components/ServicesSection';
import StudentProfileSection from './components/StudentProfileSection';
import BlinkitStoreView from './components/BlinkitStoreView';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

// Drawers & Modals
import CartDrawer from './components/drawers/CartDrawer';
import WishlistDrawer from './components/drawers/WishlistDrawer';
import AuthModal from './components/modals/AuthModal';
import SellerModal from './components/modals/SellerModal';
import TrackOrderModal from './components/modals/TrackOrderModal';
import ProductDetailModal from './components/modals/ProductDetailModal';
import AIChatDrawer from './components/modals/AIChatDrawer';
import CheckoutModal from './components/modals/CheckoutModal';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Stores
import { useUserStore } from './store/useUserStore';
import { useOrderStore } from './store/useOrderStore';
import { API_BASE } from './config/api';


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // --- STATE MANAGEMENT ---
  const [cart, setCart] = useState(() => {
    localStorage.removeItem('campushub_cart');
    return [];
  });
  const [wishlist, setWishlist] = useState(() => {
    localStorage.removeItem('campushub_wishlist');
    return [];
  });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Modals Open State
  const [loginOpen, setLoginOpen] = useState(false);
  const [sellerOpen, setSellerOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dynamic Orders history
  const [orders, setOrders] = useState([
    { id: 'CH-83920', date: '2026-07-29', total: 430, location: 'Hostel Block H-4, Room 302', status: 'shipping', items: 'Trimax Pens, Classmate Notebooks', runner: 'Sarah M. (Junior)' },
    { id: 'CH-83815', date: '2026-07-15', total: 1299, location: 'Hostel Block H-4, Room 302', status: 'completed', items: 'Official Varsity Hoodie', runner: 'Sarah M. (Junior)' },
    { id: 'CH-83601', date: '2026-06-12', total: 180, location: 'Central Library Desk 12', status: 'completed', items: 'Notebooks (Pack of 6)', runner: 'Daniel T. (Sophomore)' }
  ]);

  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'dorm_store' | 'admin_dashboard' | etc.
  const [activeCategory, setActiveCategory] = useState('study');
  const [blinkitSearchQuery, setBlinkitSearchQuery] = useState('');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your CampusHub AI Assistant. Ask me for "Exam Kit", "Hostel Essentials", "Under ₹500", or "Laptop Accessories" for smart recommendations!' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState('revenue');

  // Printing Hub States
  const [printFile, setPrintFile] = useState(null);
  const [printPages, setPrintPages] = useState(10);
  const [printColor, setPrintColor] = useState('bw');
  const [printBinding, setPrintBinding] = useState('spiral');
  const [printLamination, setPrintLamination] = useState(false);

  // Services Booking States
  const [bookingService, setBookingService] = useState('Laptop Cleaning');
  const [bookingDate, setBookingDate] = useState('2026-07-30');
  const [bookingTime, setBookingTime] = useState('10:00 AM - 12:00 PM');
  const [bookingLoc, setBookingLoc] = useState('Hostel Block H-4');

  // Student Profile preferences
  const [studentBlock, setStudentBlock] = useState('H-4');
  const [studentRoom, setStudentRoom] = useState('302');
  const [studentDept, setStudentDept] = useState('Computer Science');
  const [studentSem, setStudentSem] = useState('Semester 5');
  const [profileAddresses, setProfileAddresses] = useState([
    'Hostel Block H-4, Room 302',
    'Central Library, Cubicle 12'
  ]);
  const [newProfileAddress, setNewProfileAddress] = useState('');

  // Authentication & Registered Users
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'otp'

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupBlock, setSignupBlock] = useState('H-4');
  const [signupRoom, setSignupRoom] = useState('');
  const [signupDept, setSignupDept] = useState('Computer Science');
  const [signupSem, setSignupSem] = useState('Semester 5');

  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('1234');

  // Modal input fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const { currentUser, setCurrentUser, fetchUserProfile, fetchAddresses, walletBalance } = useUserStore();
  const { fetchUserOrders } = useOrderStore();

  const [productsList, setProductsList] = useState(PRODUCTS);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map(p => ({
            id: p._id || p.id,
            _id: p._id,
            title: p.title,
            category: p.category,
            categoryLabel: p.categoryLabel,
            price: p.price,
            originalPrice: p.originalPrice,
            rating: p.rating,
            reviews: p.reviews,
            delivery: p.delivery,
            image: p.image,
            stock: p.stock
          }));
          setProductsList(mapped);
        }
      })
      .catch(err => console.warn('Could not fetch live products from API:', err));
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
      fetchAddresses();
      fetchUserOrders();
    }
  }, [currentUser, fetchUserProfile, fetchAddresses, fetchUserOrders]);



  const [sellerName, setSellerName] = useState('');
  const [sellerDept, setSellerDept] = useState('');
  const [sellerItem, setSellerItem] = useState('');
  const [sellerPrice, setSellerPrice] = useState('');
  const [sellerCondition, setSellerCondition] = useState('excellent');
  const [sellerDesc, setSellerDesc] = useState('');

  const [trackInput, setTrackInput] = useState('');
  const [trackStatusResult, setTrackStatusResult] = useState(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Carousel controls
  const originalSlides = ['/hero_slide_1.jpg', '/hero_slide_2.jpg', '/hero_slide_3.jpg', '/hero_slide_4.jpg'];
  const HERO_SLIDES = [originalSlides[originalSlides.length - 1], ...originalSlides, originalSlides[0]];
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide(prev => prev + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleTransitionEnd = () => {
    if (currentSlide >= HERO_SLIDES.length - 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);
    } else if (currentSlide <= 0) {
      setIsTransitioning(false);
      setCurrentSlide(HERO_SLIDES.length - 2);
    }
  };

  const searchInputRef = useRef(null);
  const suggestionsBoxRef = useRef(null);

  // Sync states to LocalStorage
  useEffect(() => {
    localStorage.setItem('campushub_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('campushub_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Click outside search suggestion box to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(e.target) &&
        suggestionsBoxRef.current && 
        !suggestionsBoxRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.product-detail-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, [selectedProduct]);

  // --- ACTIONS & TOASTS ---
  const addToast = (message, isError = false) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, isError }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handlePlaceOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    addToast(`🎉 Order #${newOrder.id} placed successfully!`);
  };

  const handleAddToCart = (item) => {
    if (!currentUser) {
      addToast('Please login first to add items to your cart!', true);
      setLoginOpen(true);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, {
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100',
          quantity: 1
        }];
      }
    });
    addToast(`Added "${item.title}" to cart`);
  };

  const handleUpdateQty = (itemId, change) => {
    setCart(prev => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;
      const newQty = item.quantity + change;
      if (newQty <= 0) {
        return prev.filter(i => i.id !== itemId);
      }
      return prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i);
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
    addToast('Item removed from cart');
  };

  const handleToggleWishlist = (itemId, itemTitle) => {
    if (!currentUser) {
      addToast('Please login first to add items to your wishlist!', true);
      setLoginOpen(true);
      return;
    }
    setWishlist(prev => {
      const exists = prev.includes(itemId);
      if (exists) {
        addToast(`Removed "${itemTitle}" from Wishlist`);
        return prev.filter(id => id !== itemId);
      } else {
        addToast(`Added "${itemTitle}" to Wishlist`);
        return [...prev, itemId];
      }
    });
  };

  // --- SEARCH ENGINE ---
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const trimmed = query.toLowerCase().trim();
    if (trimmed.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(trimmed))
      .concat(SERVICES.filter(s => s.title.toLowerCase().includes(trimmed)))
      .slice(0, 5);

    setSearchSuggestions(matches);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.title);
    setShowSuggestions(false);
    
    // Switch to Dorm Store tab and populate query
    setCurrentTab('dorm_store');
    setBlinkitSearchQuery(item.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- AUTHENTICATION & OTP HANDLERS ---
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupRoom) {
      addToast('Please fill in all required signup fields', true);
      return;
    }
    const otp = '1234';
    setGeneratedOtp(otp);
    setAuthMode('otp');
    addToast(`🔑 OTP sent to ${signupEmail}! Demo Code: ${otp}`);
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '1234') {
      addToast('Invalid OTP code! Please use demo OTP: 1234', true);
      return;
    }

    const { register } = useUserStore.getState();
    const res = await register({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      hostelBlock: signupBlock,
      roomNo: signupRoom,
      department: signupDept,
      semester: signupSem
    });

    if (res.success) {
      addToast(`✓ Account created & verified successfully! Welcome, ${res.user?.name || signupName}!`);
      setLoginOpen(false);
      setAuthMode('login');
      setOtpInput('');
    } else {
      addToast(res.message || 'Registration failed', true);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast('Please fill in all fields', true);
      return;
    }

    const { login } = useUserStore.getState();
    const res = await login(loginEmail, loginPassword);

    if (res.success) {
      addToast(`Logged in successfully! Welcome back, ${res.user?.name || 'Student'}.`);
      setLoginOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      addToast(res.message || 'Invalid email or password! Please check credentials.', true);
    }
  };

  const handleSellerSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('Please login first to list items!', true);
      setLoginOpen(true);
      return;
    }
    if (!sellerName || !sellerDept || !sellerItem || !sellerPrice || !sellerDesc) {
      addToast('Please fill in all fields', true);
      return;
    }
    addToast(`Listing request submitted! Verification for "${sellerItem}" will take up to 2 hrs.`);
    setSellerOpen(false);
    setSellerName('');
    setSellerDept('');
    setSellerItem('');
    setSellerPrice('');
    setSellerDesc('');
  };

  const handleTrackLookup = () => {
    const code = trackInput.toUpperCase().trim();
    if (!code) {
      addToast('Please enter an Order ID', true);
      return;
    }
    
    // Check if it's a dynamic order ID from our orders state
    const dynamicOrder = orders.find(o => o.id === code || o.id === `CH-${code}`);
    if (dynamicOrder) {
      setTrackStatusResult({
        orderId: dynamicOrder.id,
        estTime: dynamicOrder.status === 'completed' ? 'Delivered' : '15 Mins',
        steps: [
          { title: 'Order Confirmed', desc: 'Your payment was confirmed and order was received.', time: 'Today', status: 'completed' },
          { title: 'Runner Dispatched', desc: `Delivery partner ${dynamicOrder.runner} assigned.`, time: 'Today', status: dynamicOrder.status === 'pending' ? 'active' : 'completed' },
          { title: 'Out for Delivery', desc: `Rider heading to ${dynamicOrder.location}.`, time: 'Today', status: dynamicOrder.status === 'shipping' ? 'active' : dynamicOrder.status === 'completed' ? 'completed' : 'pending' },
          { title: 'Delivered', desc: 'Order delivered to room floor.', time: dynamicOrder.status === 'completed' ? 'Today' : 'Pending', status: dynamicOrder.status === 'completed' ? 'completed' : 'pending' }
        ]
      });
      return;
    }

    if (code === 'CH-12345' || code === '12345') {
      setTrackStatusResult({
        orderId: 'CH-12345',
        estTime: '12 Mins',
        steps: [
          { title: 'Order Confirmed', desc: 'Hostel Starter Kit confirmed by CampusHub storage', time: 'Today, 2:10 PM', status: 'completed' },
          { title: 'Courier Assigned', desc: 'Sarah (Sophomore, CS) picked up your items', time: 'Today, 2:18 PM', status: 'completed' },
          { title: 'Out for Delivery', desc: 'Rider is passing by Library, heading to Hostel H-4 (Room 302)', time: 'Today, 2:24 PM', status: 'active' },
          { title: 'Arrived at Hostel', desc: 'Requires buyer security OTP clearance code', time: 'Pending', status: 'pending' }
        ]
      });
    } else {
      setTrackStatusResult({ error: true });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast(`Subscribed! Check coupons sent to ${newsletterEmail}`);
      setNewsletterEmail('');
    }
  };

  const handleContactSeller = (seller, product) => {
    if (!currentUser) {
      addToast('Please login first to contact a seller!', true);
      setLoginOpen(true);
      return;
    }
    addToast(`Chat request dispatched to ${seller} regarding "${product}"`);
  };

  const handlePrintFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrintFile(file.name);
      addToast(`File selected: ${file.name}`);
    }
  };

  // Subtotal Calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 39 : 0;
  const totalCartCount = currentUser ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const getRelatedProducts = () => {
    if (!selectedProduct) return [];
    if (selectedProduct.id.startsWith('market-')) {
      return MARKETPLACE.filter(item => item.id !== selectedProduct.id && item.tag === selectedProduct.tag)
        .concat(MARKETPLACE.filter(item => item.id !== selectedProduct.id && item.tag !== selectedProduct.tag))
        .slice(0, 4);
    } else if (selectedProduct.id.startsWith('combo-')) {
      return COMBOS.filter(item => item.id !== selectedProduct.id).slice(0, 4);
    } else {
      return PRODUCTS.filter(item => item.id !== selectedProduct.id && item.category === selectedProduct.category)
        .concat(PRODUCTS.filter(item => item.id !== selectedProduct.id && item.category !== selectedProduct.category))
        .slice(0, 4);
    }
  };
  const relatedProducts = getRelatedProducts();

  return (
    <>
      {/* Sticky Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchSuggestions={searchSuggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        searchInputRef={searchInputRef}
        suggestionsBoxRef={suggestionsBoxRef}
        handleSearchChange={handleSearchChange}
        handleSuggestionClick={handleSuggestionClick}
        wishlist={wishlist}
        setWishlistOpen={setWishlistOpen}
        totalCartCount={totalCartCount}
        setCartOpen={setCartOpen}
        currentUser={currentUser}
        setLoginOpen={setLoginOpen}
        setBlinkitSearchQuery={setBlinkitSearchQuery}
      />

      {/* Main Views */}
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <HeroBanner
                HERO_SLIDES={HERO_SLIDES}
                currentSlide={currentSlide}
                isTransitioning={isTransitioning}
                handleTransitionEnd={handleTransitionEnd}
                setCategoryFilter={setCategoryFilter}
              />

              <CategoryFilter setCategoryFilter={setCategoryFilter} />

              <ServicesSection
                bookingService={bookingService}
                setBookingService={setBookingService}
                bookingDate={bookingDate}
                setBookingDate={setBookingDate}
                bookingTime={bookingTime}
                setBookingTime={setBookingTime}
                bookingLoc={bookingLoc}
                setBookingLoc={setBookingLoc}
                addToast={addToast}
              />

              <FeaturedProducts
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                PRODUCTS={productsList}
                wishlist={wishlist}
                handleToggleWishlist={handleToggleWishlist}
                setSelectedProduct={setSelectedProduct}
                handleAddToCart={handleAddToCart}
              />


              <CombosSection
                COMBOS={COMBOS}
                setSelectedProduct={setSelectedProduct}
                handleAddToCart={handleAddToCart}
              />

              <MarketplaceSection
                MARKETPLACE={MARKETPLACE}
                setSellerOpen={setSellerOpen}
                setSelectedProduct={setSelectedProduct}
                handleContactSeller={handleContactSeller}
              />
            </>
          } />

          <Route path="/store" element={
            <BlinkitStoreView
              RAW_CATALOG={RAW_CATALOG}
              CATALOG_PRODUCTS={CATALOG_PRODUCTS}
              productsList={productsList}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}

              blinkitSearchQuery={blinkitSearchQuery}
              setBlinkitSearchQuery={setBlinkitSearchQuery}
              studentBlock={studentBlock}
              studentRoom={studentRoom}
              cart={cart}
              setSelectedProduct={setSelectedProduct}
              handleAddToCart={handleAddToCart}
              handleUpdateQty={handleUpdateQty}
            />
          } />

          <Route path="/printing" element={
            <PrintHubSection
              handlePrintFileChange={handlePrintFileChange}
              printFile={printFile}
              setPrintFile={setPrintFile}
              printPages={printPages}
              setPrintPages={setPrintPages}
              printColor={printColor}
              setPrintColor={setPrintColor}
              printBinding={printBinding}
              setPrintBinding={setPrintBinding}
              printLamination={printLamination}
              setPrintLamination={setPrintLamination}
              studentBlock={studentBlock}
              studentRoom={studentRoom}
              addToast={addToast}
            />
          } />

          <Route path="/marketplace" element={
            <MarketplaceSection
              MARKETPLACE={MARKETPLACE}
              setSellerOpen={setSellerOpen}
              setSelectedProduct={setSelectedProduct}
              handleContactSeller={handleContactSeller}
            />
          } />

          <Route path="/services" element={
            <ServicesSection
              bookingService={bookingService}
              setBookingService={setBookingService}
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              bookingTime={bookingTime}
              setBookingTime={setBookingTime}
              bookingLoc={bookingLoc}
              setBookingLoc={setBookingLoc}
              addToast={addToast}
            />
          } />

          <Route path="/combos" element={
            <CombosSection
              COMBOS={COMBOS}
              setSelectedProduct={setSelectedProduct}
              handleAddToCart={handleAddToCart}
            />
          } />

          <Route path="/profile" element={
            <StudentProfileSection
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              studentDept={studentDept}
              setStudentDept={setStudentDept}
              studentSem={studentSem}
              setStudentSem={setStudentSem}
              studentBlock={studentBlock}
              setStudentBlock={setStudentBlock}
              studentRoom={studentRoom}
              setStudentRoom={setStudentRoom}
              walletBalance={walletBalance}
              profileAddresses={profileAddresses}
              setProfileAddresses={setProfileAddresses}
              newProfileAddress={newProfileAddress}
              setNewProfileAddress={setNewProfileAddress}
              orders={orders}
              addToast={addToast}
              setLoginOpen={setLoginOpen}
            />
          } />

          <Route path="/admin" element={
            <AdminDashboard
              adminActiveTab={adminActiveTab}
              setAdminActiveTab={setAdminActiveTab}
            />
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <AIChatDrawer
          aiChatOpen={aiChatOpen}
          setAiChatOpen={setAiChatOpen}
          aiMessages={aiMessages}
          setAiMessages={setAiMessages}
          aiInput={aiInput}
          setAiInput={setAiInput}
          onAddToCart={handleAddToCart}
          onNavigate={(target) => {
            if (target === 'cart') setCartOpen(true);
            else if (target === 'orders' || target === 'wallet') {
              setCurrentTab('profile');
              window.scrollTo(0, 0);
            } else if (['printhub', 'services', 'marketplace', 'dorm_store', 'home'].includes(target)) {
              setCurrentTab(target);
              window.scrollTo(0, 0);
            }
          }}
          onOpenProduct={(productId) => {
            const found = productsList.find(p => p.id === productId || p._id === productId);
            if (found) setSelectedProduct(found);
          }}
          currentTab={currentTab}
          cart={cart}
        />
      </main>

      {/* Footer */}
      <Footer
        setSellerOpen={setSellerOpen}
        setTrackOpen={setTrackOpen}
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        handleNewsletterSubmit={handleNewsletterSubmit}
      />

      {/* Modals and Drawers */}
      <AuthModal
        loginOpen={loginOpen}
        setLoginOpen={setLoginOpen}
        authMode={authMode}
        setAuthMode={setAuthMode}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLoginSubmit={handleLoginSubmit}
        signupName={signupName}
        setSignupName={setSignupName}
        signupEmail={signupEmail}
        setSignupEmail={setSignupEmail}
        signupPassword={signupPassword}
        setSignupPassword={setSignupPassword}
        signupBlock={signupBlock}
        setSignupBlock={setSignupBlock}
        signupRoom={signupRoom}
        setSignupRoom={setSignupRoom}
        signupDept={signupDept}
        setSignupDept={setSignupDept}
        signupSem={signupSem}
        setSignupSem={setSignupSem}
        handleSendOtp={handleSendOtp}
        otpInput={otpInput}
        setOtpInput={setOtpInput}
        generatedOtp={generatedOtp}
        handleVerifyOtp={handleVerifyOtp}
      />

      <SellerModal
        sellerOpen={sellerOpen}
        setSellerOpen={setSellerOpen}
        sellerName={sellerName}
        setSellerName={setSellerName}
        sellerDept={sellerDept}
        setSellerDept={setSellerDept}
        sellerItem={sellerItem}
        setSellerItem={setSellerItem}
        sellerPrice={sellerPrice}
        setSellerPrice={setSellerPrice}
        sellerCondition={sellerCondition}
        setSellerCondition={setSellerCondition}
        sellerDesc={sellerDesc}
        setSellerDesc={setSellerDesc}
        handleSellerSubmit={handleSellerSubmit}
      />

      <TrackOrderModal
        trackOpen={trackOpen}
        setTrackOpen={setTrackOpen}
        trackInput={trackInput}
        setTrackInput={setTrackInput}
        trackStatusResult={trackStatusResult}
        setTrackStatusResult={setTrackStatusResult}
        handleTrackLookup={handleTrackLookup}
      />

      <ProductDetailModal
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        cart={cart}
        handleAddToCart={handleAddToCart}
        handleUpdateQty={handleUpdateQty}
        handleContactSeller={handleContactSeller}
        relatedProducts={relatedProducts}
      />

      <WishlistDrawer
        wishlistOpen={wishlistOpen}
        setWishlistOpen={setWishlistOpen}
        wishlist={wishlist}
        setWishlist={setWishlist}
        PRODUCTS={PRODUCTS}
        COMBOS={COMBOS}
        MARKETPLACE={MARKETPLACE}
        handleAddToCart={handleAddToCart}
        handleToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cart={cart}
        handleUpdateQty={handleUpdateQty}
        handleRemoveFromCart={handleRemoveFromCart}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        onProceedToPay={() => { setCartOpen(false); setCheckoutOpen(true); }}
        addToast={addToast}
      />

      <CheckoutModal
        checkoutOpen={checkoutOpen}
        setCheckoutOpen={setCheckoutOpen}
        cart={cart}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        profileAddresses={profileAddresses}
        setProfileAddresses={setProfileAddresses}
        walletBalance={walletBalance}
        onPlaceOrder={handlePlaceOrder}
        setTrackOpen={setTrackOpen}
        setTrackInput={setTrackInput}
        addToast={addToast}
      />

      <ToastContainer toasts={toasts} />
    </>
  );
}
