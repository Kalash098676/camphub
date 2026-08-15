import {
  searchProducts,
  getProductDetails,
  getUserOrders,
  getOrderDetails,
  getWalletInfo,
  getUserProfile,
  getUserAddresses,
  getCategories,
  getCoupons
} from './aiTools.js';
import { campusHubKnowledge } from './campusHubKnowledge.js';

/**
 * Main AI Process Request Function
 */
export const processAIChatRequest = async ({ message, messages = [], context = {}, user = null }) => {
  const query = (message || '').trim();
  const lowerQuery = query.toLowerCase();
  const isLoggedIn = !!user;

  // 1. Analyze Context & Recent Conversation for Product / Order references
  const conversationProducts = extractProductsFromHistory(messages);
  const selectedProductFromContext = context.selectedProductName || context.selectedProductId;

  // 2. Determine Intent
  const intent = classifyIntent(lowerQuery, context, isLoggedIn);

  let toolData = {};
  let action = null;
  let productsResult = [];

  // 3. Execute Controlled Backend Tool Operations based on Intent
  try {
    if (intent === 'PRODUCT_SEARCH' || intent === 'PRODUCT_PRICE' || intent === 'PRODUCT_AVAILABILITY' || intent === 'PRODUCT_RECOMMENDATION') {
      // Check for price range filters
      let maxPrice = null;
      let minPrice = null;
      
      const underMatch = lowerQuery.match(/(?:under|below|less than|within|<=|₹)\s*(\d+)/i);
      if (underMatch) maxPrice = parseInt(underMatch[1], 10);

      const aboveMatch = lowerQuery.match(/(?:above|more than|greater than|>=)\s*(\d+)/i);
      if (aboveMatch) minPrice = parseInt(aboveMatch[1], 10);

      let sortBy = '';
      if (lowerQuery.includes('cheap') || lowerQuery.includes('lowest price') || lowerQuery.includes('cheapest')) {
        sortBy = 'price_asc';
      } else if (lowerQuery.includes('best') || lowerQuery.includes('top rated') || lowerQuery.includes('highest rated')) {
        sortBy = 'rating';
      }

      // Check category keyword
      let category = '';
      if (lowerQuery.includes('kettle') || lowerQuery.includes('kitchen') || lowerQuery.includes('mug') || lowerQuery.includes('plate') || lowerQuery.includes('bowl') || lowerQuery.includes('lunch box')) {
        category = 'kitchen';
      } else if (lowerQuery.includes('electronic') || lowerQuery.includes('calculator') || lowerQuery.includes('laptop') || lowerQuery.includes('mouse') || lowerQuery.includes('charger') || lowerQuery.includes('cable') || lowerQuery.includes('headphone') || lowerQuery.includes('power bank')) {
        category = 'electronics';
      } else if (lowerQuery.includes('study') || lowerQuery.includes('book') || lowerQuery.includes('notebook') || lowerQuery.includes('pen') || lowerQuery.includes('register') || lowerQuery.includes('journal')) {
        category = 'study';
      } else if (lowerQuery.includes('hostel') || lowerQuery.includes('dorm') || lowerQuery.includes('lamp') || lowerQuery.includes('bucket') || lowerQuery.includes('bedsheet') || lowerQuery.includes('blanket') || lowerQuery.includes('lock')) {
        category = 'hostel';
      } else if (lowerQuery.includes('combo') || lowerQuery.includes('kit') || lowerQuery.includes('bundle') || lowerQuery.includes('exam')) {
        category = 'combos';
      } else if (lowerQuery.includes('shampoo') || lowerQuery.includes('soap') || lowerQuery.includes('toothpaste') || lowerQuery.includes('towel') || lowerQuery.includes('diffuser') || lowerQuery.includes('personal')) {
        category = 'personal';
      } else if (lowerQuery.includes('hoodie') || lowerQuery.includes('t-shirt') || lowerQuery.includes('shirt') || lowerQuery.includes('merchandise')) {
        category = 'merchandise';
      }

      // Clean search term
      let cleanSearchTerm = query
        .replace(/show me|search for|do you have|any|available|under|below|cheap|cheapest|best|products|product|item|items|₹\d+|\d+|i want to see the|i want to see|give me|show|find|can i see|get me|from|all|of|these|categories|category/gi, '')
        .trim();

      let searchTerm = cleanSearchTerm;
      const isBroadSearch = lowerQuery.match(/all products|all categories|from categories|from all|these categories|show products|list products|display products/i);
      if (!searchTerm && !maxPrice && !minPrice && !category && !isBroadSearch) {
        searchTerm = query.trim();
      }

      if (lowerQuery.includes('exam')) searchTerm = 'exam';
      else if (lowerQuery.includes('kettle')) searchTerm = 'kettle';
      else if (lowerQuery.includes('calculator')) searchTerm = 'calculator';
      else if (lowerQuery.includes('laptop')) searchTerm = 'laptop';
      else if (lowerQuery.includes('pen')) searchTerm = 'pen';
      else if (lowerQuery.includes('notebook')) searchTerm = 'notebook';

      productsResult = await searchProducts({
        query: searchTerm,
        category,
        minPrice,
        maxPrice,
        sortBy,
        limit: 6
      });

      toolData.products = productsResult;
    } 
    else if (intent === 'FOLLOW_UP_CHEAPEST' || intent === 'FOLLOW_UP_RECOMMEND') {
      // User asking "Which one is cheapest?" referring to recent conversation products
      if (conversationProducts.length > 0) {
        const sorted = [...conversationProducts].sort((a, b) => a.price - b.price);
        productsResult = [sorted[0]];
        toolData.products = productsResult;
        toolData.followUpTarget = sorted[0];
      } else {
        productsResult = await searchProducts({ sortBy: 'price_asc', limit: 3 });
        toolData.products = productsResult;
      }
    }
    else if (intent === 'TOP_RATED_PRODUCT') {
      productsResult = await searchProducts({ sortBy: 'rating', limit: 3 });
      toolData.products = productsResult;
    }
    else if (intent === 'CART_ADD') {
      // Try resolving target product
      let targetProduct = null;

      // Check if user said "add that one" / "add second one" / "add calculator"
      if (lowerQuery.includes('that one') || lowerQuery.includes('cheapest one') || lowerQuery.includes('this one')) {
        if (conversationProducts.length > 0) {
          targetProduct = conversationProducts[0];
        }
      } else if (selectedProductFromContext) {
        targetProduct = await getProductDetails(selectedProductFromContext);
      }

      if (!targetProduct) {
        // Extract product keyword
        const cleanTerm = query.replace(/add|to cart|to my cart|please|item|product|1|2|3|a/gi, '').trim();
        if (cleanTerm) {
          const searchRes = await searchProducts({ query: cleanTerm, limit: 1 });
          if (searchRes.length > 0) targetProduct = searchRes[0];
        }
      }

      if (targetProduct) {
        action = {
          type: 'ADD_TO_CART',
          productId: targetProduct.id || targetProduct._id,
          productTitle: targetProduct.title,
          price: targetProduct.price,
          quantity: 1
        };
        toolData.addedProduct = targetProduct;
      } else {
        toolData.cartMessage = "I couldn't identify which exact product you wanted to add to your cart. Could you specify the product title?";
      }
    }
    else if (intent === 'CART_VIEW') {
      action = { type: 'NAVIGATE', target: 'cart' };
      toolData.cartItemCount = (context && typeof context.cartItemCount === 'number') ? context.cartItemCount : 0;
    }
    else if (intent === 'COMPOUND_USER_STATUS') {
      if (!isLoggedIn) {
        toolData.authRequired = true;
        toolData.authMessage = "Please log in to view your live Campus Pay wallet balance and latest order status.";
      } else {
        const walletInfo = await getWalletInfo(user);
        const userOrders = await getUserOrders(user._id);
        toolData.walletInfo = walletInfo;
        toolData.userOrders = userOrders;
        action = { type: 'NAVIGATE', target: 'orders' };
      }
    }
    else if (intent === 'ORDER_STATUS' || intent === 'ORDER_LIST') {
      if (!isLoggedIn) {
        toolData.authRequired = true;
        toolData.authMessage = "Please log in to view your active orders and tracking status.";
      } else {
        const userOrders = await getUserOrders(user._id);
        toolData.userOrders = userOrders;
        if (userOrders && userOrders.length > 0) {
          action = { type: 'NAVIGATE', target: 'orders' };
        }
      }
    }
    else if (intent === 'WALLET_BALANCE' || intent === 'WALLET_TRANSACTIONS') {
      if (!isLoggedIn) {
        toolData.authRequired = true;
        toolData.authMessage = "Please log in to view your Campus Pay wallet balance and transaction history.";
      } else {
        const walletInfo = await getWalletInfo(user);
        toolData.walletInfo = walletInfo;
        action = { type: 'NAVIGATE', target: 'wallet' };
      }
    }
    else if (intent === 'PROFILE_INFO') {
      if (!isLoggedIn) {
        toolData.authRequired = true;
        toolData.authMessage = "Please log in to view your student profile information.";
      } else {
        toolData.userProfile = getUserProfile(user);
        const addresses = await getUserAddresses(user._id);
        toolData.userAddresses = addresses;
      }
    }
    else if (intent === 'SERVICE_INFO' || intent === 'PRINTING_INFO') {
      toolData.services = campusHubKnowledge.services;
      toolData.printhub = campusHubKnowledge.printhub;
      if (lowerQuery.includes('print') || lowerQuery.includes('pdf') || lowerQuery.includes('document')) {
        action = { type: 'NAVIGATE', target: 'printhub' };
      } else {
        action = { type: 'NAVIGATE', target: 'services' };
      }
    }
    else if (intent === 'MARKETPLACE_INFO') {
      toolData.marketplace = campusHubKnowledge.marketplace;
      action = { type: 'NAVIGATE', target: 'marketplace' };
    }
    else if (intent === 'COUPON_INFO') {
      toolData.coupons = await getCoupons();
    }
    else if (intent === 'CATEGORY_SEARCH') {
      toolData.categories = await getCategories();
    }
    else if (intent === 'NAVIGATION') {
      if (lowerQuery.includes('cart')) action = { type: 'NAVIGATE', target: 'cart' };
      else if (lowerQuery.includes('order')) action = { type: 'NAVIGATE', target: 'orders' };
      else if (lowerQuery.includes('wallet')) action = { type: 'NAVIGATE', target: 'wallet' };
      else if (lowerQuery.includes('market')) action = { type: 'NAVIGATE', target: 'marketplace' };
      else if (lowerQuery.includes('print')) action = { type: 'NAVIGATE', target: 'printhub' };
      else if (lowerQuery.includes('service')) action = { type: 'NAVIGATE', target: 'services' };
    }
  } catch (err) {
    console.error('Error executing backend AI tool:', err);
  }

  // 4. Call Gemini API if Key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let finalResponseText = '';

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && !apiKey.includes('your_actual_gemini')) {
    try {
      const systemInstruction = buildSystemPrompt({ user, toolData, intent, context });
      
      const contents = buildGeminiContents(messages, query);

      const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.6
          }
        })
      });

      const geminiData = await geminiResponse.json();

      if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts[0]) {
        finalResponseText = geminiData.candidates[0].content.parts[0].text;
      } else {
        console.warn('Gemini API structure warning:', geminiData);
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to dynamic tool response generator:', err.message);
    }
  }

  // 5. Dynamic Fallback Text Generator (If Gemini text is empty or offline)
  if (!finalResponseText) {
    finalResponseText = generateDynamicFallbackResponse({ query, intent, toolData, user, action });
  }

  // 6. Return Structured Output
  return {
    success: true,
    text: finalResponseText,
    intent,
    data: {
      products: toolData.products || [],
      orders: toolData.userOrders || [],
      wallet: toolData.walletInfo || null,
      profile: toolData.userProfile || null,
      services: toolData.services || null,
      coupons: toolData.coupons || null
    },
    action
  };
};

/**
 * Classify Intent from user query
 */
function classifyIntent(query, context, isLoggedIn) {
  const lower = query.replace(/[“”"'`]/g, '').trim().toLowerCase();

  // Compound user status check (wallet + orders)
  if (lower.includes('wallet') && (lower.includes('order') || lower.includes('track'))) {
    return 'COMPOUND_USER_STATUS';
  }

  // Product comparison & Rating queries
  if (lower.match(/highest rating|highest rated|top rated|best product|best rated|top product|most popular/i)) {
    return 'TOP_RATED_PRODUCT';
  }

  if (lower.match(/difference between.*product.*service|product vs service|difference.*service/i)) {
    return 'PRODUCT_VS_SERVICES';
  }

  // General Website overview check (prioritize "what is campushub" over specific service keyword)
  if (lower.match(/what is campushub|about campushub|what can i do on this website|how does campushub work|how to register|how to signup/i)) {
    return 'GENERAL_WEBSITE';
  }

  // Follow-ups & Cart actions
  if (lower.match(/which (?:one is|one's|one) (?:cheapest|cheaper|the cheapest|lowest price)/i)) return 'FOLLOW_UP_CHEAPEST';
  if (lower.match(/add (?:that|this|it|the cheapest|second|first|1st|2nd) (?:one|item)? to (?:my )?cart/i)) return 'CART_ADD';
  if (lower.match(/add .* to (?:my )?cart/i)) return 'CART_ADD';
  if (lower.match(/cart|check (?:my )?cart|show (?:my )?cart|view (?:my )?cart|open (?:my )?cart|what is in my cart|how to see cart|how (?:can|do) i check (?:my )?cart/i)) return 'CART_VIEW';

  // Ordering & Workflows
  if (lower.match(/how (?:can|do|to) (?:i |we )?(?:place (?:an )?order|order|buy|purchase)|order(?:ing)? process|process .* order|tell me how can i order/i)) {
    return 'HOW_TO_ORDER';
  }
  if (lower.match(/my orders|latest order|track (?:my )?order|track|order status|where is my order|what did i order|order history|how (?:can|do|to) i track (?:my )?order/i)) return 'ORDER_STATUS';
  if (lower.match(/wallet|balance|campus pay|my money|transactions|cashback|wallet balance/i)) return 'WALLET_BALANCE';
  if (lower.match(/my profile|my student id|my department|my room number|my room no|my hostel block|who am i|profile/i)) return 'PROFILE_INFO';
  if (lower.match(/address|delivery location|saved address/i)) return 'ADDRESS_INFO';

  if (lower.match(/payment|pay|how (?:can|do|to) (?:i |we )?pay|make a payment|payment methods|payment options|cash on delivery|cod|upi|wallet pay|credit card|debit card/i)) {
    return 'PAYMENT_INFO';
  }

  if (lower.match(/delivery time|how long (?:does )?delivery|delivery fee|shipping|delivery process|10 minute delivery|how fast/i)) {
    return 'DELIVERY_INFO';
  }

  if (lower.match(/return|refund|cancellation|cancel order|how to return|exchange/i)) {
    return 'RETURN_REFUND_INFO';
  }

  if (lower.match(/show product|show products|list product|display product|products from|products in/i)) {
    return 'PRODUCT_SEARCH';
  }

  if (lower.match(/category|categories|catagories|catagorie|catagory|catagori/i)) {
    return 'CATEGORY_SEARCH';
  }

  if (lower.match(/print|printhub|pdf|photocopy|spiral|binding|lamination/i)) return 'PRINTING_INFO';
  if (lower.match(/laundry|cleaning|laptop clean|room clean|service|services/i)) return 'SERVICE_INFO';
  if (lower.match(/marketplace|second-hand|buy used|sell item|pre-owned/i)) return 'MARKETPLACE_INFO';
  if (lower.match(/coupon|coupons|discount|promo|offer|code/i)) return 'COUPON_INFO';

  if (lower.match(/where is|how to go|open cart|open orders|open wallet|open marketplace/i)) return 'NAVIGATION';

  if (lower.match(/hi\b|hello\b|hey\b|greetings|good morning|good evening/i)) {
    return 'GENERAL_WEBSITE';
  }

  // DEFAULT EVERYTHING ELSE TO PRODUCT_SEARCH so any raw product name or query searches MongoDB!
  return 'PRODUCT_SEARCH';
}

/**
 * Extract products mentioned in previous assistant messages for follow-up resolution
 */
function extractProductsFromHistory(messages) {
  if (!Array.isArray(messages)) return [];
  const items = [];
  
  // Inspect last 6 messages
  const recent = messages.slice(-6);
  for (const m of recent) {
    if (m.sender === 'ai' && m.data && m.data.products && Array.isArray(m.data.products)) {
      items.push(...m.data.products);
    }
  }
  return items;
}

/**
 * Build System Prompt for Gemini
 */
function buildSystemPrompt({ user, toolData, intent, context }) {
  const userName = user ? user.name : 'Guest Student';
  const userBlock = user ? (user.hostelBlock || 'H-3 Hostel') : 'Guest';
  const userRoom = user ? (user.roomNo || '304-B') : 'Guest';
  const walletBal = user ? (user.walletBalance ?? 0) : 0;

  let toolContextText = `Current Verified Application Data:\n`;
  if (toolData.products && toolData.products.length > 0) {
    toolContextText += `Live Products Found (${toolData.products.length}):\n`;
    toolData.products.forEach(p => {
      toolContextText += `- ${p.title} | Price: ₹${p.price} (Original: ₹${p.originalPrice || p.price}) | Rating: ${p.rating} | Stock: ${p.stock} | Delivery: ${p.delivery}\n`;
    });
  }

  if (toolData.userOrders) {
    toolContextText += `User Active Orders:\n${JSON.stringify(toolData.userOrders, null, 2)}\n`;
  }

  if (toolData.walletInfo) {
    toolContextText += `User Wallet Balance: ₹${toolData.walletInfo.walletBalance}\nRecent Ledger: ${JSON.stringify(toolData.walletInfo.recentTransactions)}\n`;
  }

  if (toolData.userProfile) {
    toolContextText += `User Profile Specs: ${JSON.stringify(toolData.userProfile)}\n`;
  }

  if (toolData.authRequired) {
    toolContextText += `SECURITY NOTICE: User is currently GUEST. ${toolData.authMessage}\n`;
  }

  return `You are the official CampusHub Dynamic AI Assistant — a smart, friendly, college junior assisting students on campus.

Student Context:
- Name: ${userName}
- Hostel Block: ${userBlock}, Room: ${userRoom}
- Wallet Balance: ₹${walletBal}

${toolContextText}

Knowledge Guidelines:
- PrintHub: B&W ₹2/pg, Color ₹10/pg, Spiral binding ₹49, Lamination ₹30. Fast delivery to hostel floor.
- Services: Laptop Cleaning (₹799), Laundry Wash & Fold (₹299), Room Deep Cleaning (₹199).
- Delivery Time: 10-15 minutes campus runner delivery.

STRICT INSTRUCTIONS:
1. Always speak as a helpful campus assistant. Be concise, friendly, and natural.
2. NEVER invent products, prices, stock, or order details. Base your answer strictly on the Live Products and Verified Data above.
3. If user is guest and asks for private data (orders/wallet/profile), politely tell them to log in first.
4. If products are returned, introduce them clearly so the student can inspect the product cards rendered below.
5. If the user asks Hinglish questions (e.g., "Calculator kitne ka hai?"), reply naturally in clean Hinglish or English.`;
}

/**
 * Format chat history for Gemini API payload
 */
function buildGeminiContents(messages, currentQuery) {
  const contents = [];
  if (Array.isArray(messages)) {
    messages.slice(-8).forEach(m => {
      if (m.text) {
        contents.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        });
      }
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: currentQuery }]
  });
  return contents;
}

/**
 * Dynamic DB-aware fallback text generator (used if Gemini API key is missing or offline)
 */
function generateDynamicFallbackResponse({ query, intent, toolData, user, action }) {
  const userName = user ? user.name : 'Guest';

  if (toolData.authRequired) {
    return `Hey ${userName}! 🔐 ${toolData.authMessage}`;
  }

  if (intent === 'PRODUCT_SEARCH' || intent === 'FOLLOW_UP_CHEAPEST') {
    if (toolData.products && toolData.products.length > 0) {
      const pCount = toolData.products.length;
      const topP = toolData.products[0];
      return `Hey ${userName}! 🎒 I found ${pCount} matching items in the CampusHub store! The top result is "${topP.title}" for ₹${topP.price}. Check out the details below!`;
    } else {
      return `Sorry ${userName}! 🎒 The product "${query}" is not available in any category in our CampusHub database right now. Try searching for available items like calculators, notebooks, pens, electric kettles, or laptop stands!`;
    }
  }

  if (intent === 'TOP_RATED_PRODUCT') {
    if (toolData.products && toolData.products.length > 0) {
      const topP = toolData.products[0];
      return `Hey ${userName}! ⭐ The highest rated product on CampusHub is "${topP.title}" with a rating of ★${topP.rating || 4.9}! It costs ₹${topP.price}. Check out the details below!`;
    } else {
      return `Hey ${userName}! ⭐ Our top-rated products include scientific calculators, insulated smart water bottles, and desk organizers!`;
    }
  }

  if (intent === 'PRODUCT_VS_SERVICES') {
    return `Hey ${userName}! 🎒 Here is the difference between CampusHub Products and CampusHub Services:

🛍️ CampusHub Products: Physical store items (e.g., calculators, notebooks, hostel room essentials, snacks) ordered from our 10-minute quick-commerce store and delivered directly to your dorm room floor.

🛠️ CampusHub Services: On-demand professional campus services (e.g., PrintHub PDF document printing, Laptop Cleaning, Laundry, Room Cleaning, and trading pre-owned items in the Second-Hand Marketplace).`;
  }

  if (intent === 'CART_ADD') {
    if (toolData.addedProduct) {
      return `Awesome ${userName}! 🛒 Added "${toolData.addedProduct.title}" (₹${toolData.addedProduct.price}) to your cart! You can view your cart in the side drawer.`;
    } else {
      return toolData.cartMessage || `Which product would you like to add to your cart? Please specify the title!`;
    }
  }

  if (intent === 'CART_VIEW') {
    const count = toolData.cartItemCount || 0;
    if (count > 0) {
      return `Hey ${userName}! 🛒 I've opened your Cart drawer for you! You currently have ${count} item(s) in your cart ready for checkout.`;
    } else {
      return `Hey ${userName}! 🛒 Your shopping cart is currently empty. I've opened your Cart drawer for you so you can review your cart anytime!`;
    }
  }

  if (intent === 'HOW_TO_ORDER') {
    return `Hey ${userName}! 🛒 Here is how you can place an order on CampusHub:

1️⃣ Browse & Select: Explore store categories or ask me for any product (e.g., calculators, notebooks, snacks).
2️⃣ Add to Cart: Click '+ Add to Cart' on your chosen item or ask me to add it directly.
3️⃣ Checkout: Open your Cart drawer, select your hostel room delivery address, choose payment (COD, UPI, or Campus Pay Wallet), and place your order!
4️⃣ Fast Delivery: Our campus runner delivers it straight to your hostel room floor in 10-15 minutes!`;
  }

  if (intent === 'PAYMENT_INFO') {
    return `Hey ${userName}! 💳 CampusHub accepts the following payment methods:

1️⃣ Campus Pay Wallet: Instant 1-click checkout using your student wallet balance (get cashback on every order!).
2️⃣ UPI & QR Code: Pay seamlessly using Google Pay, PhonePe, Paytm, or any UPI app.
3️⃣ Cash on Delivery (COD): Pay cash directly to the campus runner when your order is delivered to your hostel room floor.
4️⃣ Credit / Debit Cards: Secure online payment via Visa, Mastercard, or RuPay.`;
  }

  if (intent === 'DELIVERY_INFO') {
    return `Hey ${userName}! ⚡ CampusHub guarantees 10-15 minute hyperlocal campus runner delivery straight to your hostel room floor! Standard delivery is FREE for orders above ₹199 (or ₹15 flat fee).`;
  }

  if (intent === 'RETURN_REFUND_INFO') {
    return `Hey ${userName}! 🔄 Orders can be cancelled instantly before runner dispatch. For damaged or incorrect items, CampusHub offers an instant 24-hour replacement or full refund to your Campus Pay Wallet!`;
  }

  if (intent === 'COMPOUND_USER_STATUS') {
    const bal = toolData.walletInfo ? toolData.walletInfo.walletBalance : (user ? user.walletBalance : 0);
    if (toolData.userOrders && toolData.userOrders.length > 0) {
      const latest = toolData.userOrders[0];
      return `Hey ${userName}! 💳 Your current Campus Pay Wallet balance is ₹${bal}.\n\n📦 Latest Order (#${latest.orderId}): Total ₹${latest.totalAmount}, Status is "${latest.orderStatus}". I've opened your orders page for live tracking!`;
    } else {
      return `Hey ${userName}! 💳 Your current Campus Pay Wallet balance is ₹${bal}.\n\n📦 You don't have any active orders right now. Browse our store to place your first 10-minute campus delivery!`;
    }
  }

  if (intent === 'ORDER_STATUS') {
    if (toolData.userOrders && toolData.userOrders.length > 0) {
      const latest = toolData.userOrders[0];
      return `Hey ${userName}! 📦 Your latest order (#${latest.orderId}) total is ₹${latest.totalAmount} and current status is "${latest.orderStatus}". I've opened your orders page for live tracking!`;
    } else {
      return `Hey ${userName}! 📦 You don't have any active orders right now. Browse our store to place your first 10-minute campus delivery!`;
    }
  }

  if (intent === 'WALLET_BALANCE') {
    const bal = toolData.walletInfo ? toolData.walletInfo.walletBalance : (user ? user.walletBalance : 0);
    return `Hey ${userName}! 💳 Your current Campus Pay Wallet balance is ₹${bal}. You can use this for instant single-click checkouts on stationery, snacks, and print orders!`;
  }

  if (intent === 'PROFILE_INFO') {
    if (toolData.userProfile) {
      const p = toolData.userProfile;
      return `Hey ${p.name}! 🎓 Profile Details: Student ID: ${p.studentId} | Dept: ${p.department} | Hostel: ${p.hostelBlock}, Room ${p.roomNo} | Wallet: ₹${p.walletBalance}.`;
    }
  }

  if (intent === 'SERVICE_INFO' || intent === 'PRINTING_INFO') {
    return `Hey ${userName}! 🖨️ PrintHub costs ₹2/page (B&W) and ₹10/page (Color) with spiral binding (₹49). We also offer Laptop Cleaning (₹799), Laundry (₹299), and Room Cleaning (₹199) delivered straight to your dorm room floor!`;
  }

  if (intent === 'MARKETPLACE_INFO') {
    return `Hey ${userName}! 🤝 Campus Marketplace allows you to buy and sell second-hand textbooks, lab coats, cycles, and hostel gear directly with verified campus peers!`;
  }

  if (intent === 'COUPON_INFO') {
    if (toolData.coupons && toolData.coupons.length > 0) {
      const c = toolData.coupons[0];
      return `🎉 Available Coupon Offer: Use code "${c.code}" for ${c.discountText} (Min Order: ₹${c.minOrderAmount})!`;
    }
  }

  if (intent === 'CATEGORY_SEARCH') {
    if (toolData.categories && toolData.categories.length > 0) {
      const catListText = toolData.categories.map(c => `${c.label}`).join('\n• ');
      return `Hey ${userName}! 🛍️ Here are all the available categories on CampusHub:\n\n• ${catListText}\n\nYou can ask me to show products from any of these categories!`;
    }
  }

  const lq = query.toLowerCase();
  if (lq.includes('what is') || lq.includes('about') || lq.includes('what can i do')) {
    return `CampusHub is a 10-minute quick e-commerce & campus services platform! You can order hostel essentials, study supplies, snacks, upload PDFs for dorm print delivery, trade pre-owned books in the marketplace, or book room cleans!`;
  }
  if (lq.includes('register') || lq.includes('signup') || lq.includes('log in') || lq.includes('login') || lq.includes('account')) {
    return `To register or log in, click the Login / Register button in the top navigation bar. Enter your college email and password to access your student profile, saved hostel addresses, and Campus Pay wallet balance!`;
  }
  if (lq.includes('order') || lq.includes('buy') || lq.includes('checkout')) {
    return `To place an order: Browse items in the store, click '+ Add to Cart', open your Cart drawer, select your hostel room address, choose payment (COD, UPI, or Campus Pay Wallet), and confirm checkout!`;
  }

  return `Hey ${userName}! 👋 I can help you search live products, track orders, check Campus Pay wallet balance, calculate printing costs, or book dorm services. What do you need today?`;
}
