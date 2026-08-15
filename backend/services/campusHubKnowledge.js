/**
 * CampusHub Static Knowledge Base
 * Central source of truth for static FAQs, platform workflows, service features,
 * PrintHub configuration, Student Marketplace, and Navigation.
 */

export const campusHubKnowledge = {
  platform: {
    name: "CampusHub",
    tagline: "Hyperlocal Quick E-Commerce & Campus Services Platform",
    description: "CampusHub is a college campus platform for 10-minute hostel room delivery, document printing (PrintHub), peer-to-peer student marketplace, and campus utility services (laptop cleaning, laundry, room deep cleaning).",
    deliveryTime: "10 to 15 minutes direct to dorm room, library table, or department gates.",
    targetAudience: "College students, hostel residents, faculty, and campus staff."
  },

  navigation: {
    home: "Main storefront home showing category filters, hero banner, featured items, and quick access.",
    dorm_store: "Quick E-Commerce store for late-night snacks, exam supplies, electronics, and dorm essentials.",
    combos: "Curated deal packages like Semester Exam Prep Kit and Freshers Starter Kit.",
    marketplace: "Peer-to-peer student marketplace for second-hand textbooks, lab gear, cycles, and hostel furniture.",
    printhub: "Cloud printing service to upload PDFs/DOCs, configure B&W/Color, single/double sided, binding, and get dorm room delivery.",
    services: "Campus utility bookings for Laptop Cleaning, Laundry Wash & Fold, and Room Deep Cleaning.",
    profile: "Student profile management, Campus Pay Wallet balance, delivery address manager, and order history.",
    cart: "Slide-out Cart drawer showing current items, quantity controls, and checkout button.",
    orders: "Active order tracking timeline simulator and historical order receipts."
  },

  services: [
    {
      id: "srv-1",
      name: "Laptop & Gadget Deep Cleaning",
      price: 799,
      duration: "45 mins",
      description: "Internal dust removal, thermal paste application, keyboard sanitization, and screen polish."
    },
    {
      id: "srv-2",
      name: "Dorm Laundry Pickup & Fold (5 kg)",
      price: 299,
      duration: "24 hrs turnaround",
      description: "Washed, anti-bacterial fabric softened, steam pressed, and neatly folded delivered back to hostel."
    },
    {
      id: "srv-3",
      name: "Hostel Room Deep Sanitization & Clean",
      price: 199,
      duration: "30 mins",
      description: "Floor scrubbing, desk dust clearing, trash clearance, and bathroom sanitization."
    }
  ],

  printhub: {
    pricing: {
      bwPerPage: 2,
      colorPerPage: 10,
      spiralBinding: 49,
      stapleBinding: 10,
      lamination: 30
    },
    options: {
      paperSizes: ["A4", "A3"],
      sides: ["Single-sided", "Double-sided (Duplex)"],
      bindings: ["Spiral Bound", "Stapled", "Softcover"]
    },
    howItWorks: "Upload your document (PDF/DOCX), select page range, color mode, and binding preference. Our campus print runner delivers the hard copies straight to your hostel floor!"
  },

  marketplace: {
    description: "Verified student-to-student trading hub for pre-owned textbooks, lab coats, engineering drawing boards, hostel mini-fridges, cycles, and electronics.",
    howToSell: "Click 'Sell Item / List Product' button in Marketplace section, upload photo, set price, select category, and add your contact details.",
    howToBuy: "Browse Marketplace, click 'Contact Verified Seller' or 'Buy Now' to chat directly with dorm peers."
  },

  wallet: {
    name: "Campus Pay / Wallet",
    features: "Instant single-click checkouts, referral cashback, top-up options, and full transaction ledger.",
    howToUse: "Select 'Campus Pay Wallet' at checkout. Balance is deducted instantly without needing UPI OTPs."
  },

  faq: [
    {
      question: "How do I place an order?",
      answer: "Browse products or combos, click 'Add to Cart', open Cart drawer, select shipping address, choose payment (COD, UPI, or Campus Pay Wallet), and click Place Order."
    },
    {
      question: "How do I track my order?",
      answer: "Click 'Track Order' in top navbar or go to Profile -> Orders to view real-time delivery status step-by-step."
    },
    {
      question: "How do I register or login?",
      answer: "Click the Login/Register button in the navbar. Use your college email and password to log in or create a student account."
    }
  ]
};
