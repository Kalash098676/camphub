import {
  searchProducts,
  getProductDetails,
  getUserOrders,
  getOrderDetails,
  getWalletInfo,
  getUserProfile,
  getUserAddresses,
  getCategories,
  getServices,
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
    if (intent === 'PRODUCT_CHEAPEST' || intent === 'PRODUCT_MOST_EXPENSIVE' || intent === 'PRODUCT_OUT_OF_STOCK' || intent === 'PRODUCT_IN_STOCK' || intent === 'PRODUCT_SEARCH' || intent === 'PRODUCT_PRICE' || intent === 'PRODUCT_AVAILABILITY' || intent === 'PRODUCT_RECOMMENDATION') {
      let maxPrice = null;
      let minPrice = null;
      
      const underMatch = lowerQuery.match(/(?:under|below|less than|within|<=|₹)\s*(\d+)/i);
      if (underMatch) maxPrice = parseInt(underMatch[1], 10);

      const aboveMatch = lowerQuery.match(/(?:above|more than|greater than|>=)\s*(\d+)/i);
      if (aboveMatch) minPrice = parseInt(aboveMatch[1], 10);

      let sortBy = '';
      let stockOnly = false;
      let outOfStockOnly = false;

      if (intent === 'PRODUCT_CHEAPEST') {
        sortBy = 'price_asc';
        stockOnly = true;
      } else if (intent === 'PRODUCT_MOST_EXPENSIVE') {
        sortBy = 'price_desc';
        stockOnly = true;
      } else if (intent === 'PRODUCT_OUT_OF_STOCK') {
        outOfStockOnly = true;
      } else if (intent === 'PRODUCT_IN_STOCK') {
        stockOnly = true;
      }

      if (lowerQuery.includes('cheap') || lowerQuery.includes('lowest price') || lowerQuery.includes('cheapest')) {
        sortBy = 'price_asc';
      } else if (lowerQuery.includes('most expensive') || lowerQuery.includes('highest price')) {
        sortBy = 'price_desc';
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
      let searchTerm = '';
      if (intent === 'PRODUCT_SEARCH' || intent === 'PRODUCT_PRICE' || intent === 'PRODUCT_AVAILABILITY') {
        let clean = query
          .replace(/show me|search for|do you have|any|available|under|below|above|less than|more than|cheap|cheapest|best|products|product|item|items|which|currently|out of stock|in stock|₹\d+|\d+/gi, '')
          .trim();
        if (clean.length >= 3 && !category) {
          searchTerm = clean;
        }
      } else {
        if (lowerQuery.includes('calculator')) searchTerm = 'calculator';
        else if (lowerQuery.includes('kettle')) searchTerm = 'kettle';
        else if (lowerQuery.includes('notebook')) searchTerm = 'notebook';
        else if (lowerQuery.includes('pen')) searchTerm = 'pen';
        else if (lowerQuery.includes('laptop')) searchTerm = 'laptop';
      }

      const limit = (intent === 'PRODUCT_CHEAPEST' || intent === 'PRODUCT_MOST_EXPENSIVE') ? 1 : 6;

      productsResult = await searchProducts({
        query: searchTerm,
        category,
        minPrice,
        maxPrice,
        stockOnly,
        outOfStockOnly,
        sortBy,
        limit
      });

      toolData.products = productsResult;
    } 
    else if (intent === 'FOLLOW_UP_CHEAPEST' || intent === 'FOLLOW_UP_RECOMMEND' || intent === 'FOLLOW_UP_PRICE' || intent === 'FOLLOW_UP_STOCK') {
      // User asking follow-up question referring to recent conversation products
      if (conversationProducts.length > 0) {
        const sorted = [...conversationProducts].sort((a, b) => a.price - b.price);
        productsResult = (intent === 'FOLLOW_UP_CHEAPEST') ? [sorted[0]] : [conversationProducts[0]];
        toolData.products = productsResult;
        toolData.followUpTarget = productsResult[0];
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
    else if (intent === 'PRINTING_INFO') {
      toolData.printhub = campusHubKnowledge.printhub;
      action = { type: 'NAVIGATE', target: 'printhub' };
    }
    else if (intent === 'SERVICE_LIST' || intent === 'SERVICE_INFO') {
      toolData.services = await getServices();
      toolData.printhub = campusHubKnowledge.printhub;
      action = { type: 'NAVIGATE', target: 'services' };
    }
    else if (intent === 'MARKETPLACE_INFO') {
      toolData.marketplace = campusHubKnowledge.marketplace;
      action = { type: 'NAVIGATE', target: 'marketplace' };
    }
    else if (intent === 'PRODUCT_VS_SERVICES') {
      toolData.services = await getServices();
      toolData.printhub = campusHubKnowledge.printhub;
      toolData.marketplace = campusHubKnowledge.marketplace;
      toolData.categories = await getCategories();
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

  // 4. Call Gemini API for natural conversational synthesis (skip Gemini for deterministic DB intents to prevent hallucinated search errors)
  const apiKey = process.env.GEMINI_API_KEY;
  let finalResponseText = '';

  const deterministicIntents = [
    'PRODUCT_CHEAPEST',
    'PRODUCT_MOST_EXPENSIVE',
    'PRODUCT_OUT_OF_STOCK',
    'PRODUCT_IN_STOCK',
    'PRINTING_INFO',
    'HOW_TO_ORDER',
    'PAYMENT_INFO',
    'DELIVERY_INFO',
    'RETURN_REFUND_INFO',
    'PRODUCT_VS_SERVICES'
  ];

  if (!deterministicIntents.includes(intent) && apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && !apiKey.includes('your_actual_gemini')) {
    try {
      const systemInstruction = buildSystemPrompt({ user, toolData, intent, context });
      const contents = buildGeminiContents(messages, query);

      const candidateModels = [
        process.env.GEMINI_MODEL,
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-pro'
      ].filter(Boolean);

      for (const model of candidateModels) {
        if (model === 'gemini-3.6-flash') continue; // skip invalid legacy placeholder
        try {
          const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemInstruction }] },
              generationConfig: {
                maxOutputTokens: 1200,
                temperature: 0.5
              },
              safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
              ]
            })
          });

          const geminiData = await geminiResponse.json();

          if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts[0]) {
            const rawText = geminiData.candidates[0].content.parts[0].text;
            if (rawText && !isResponseTruncated(rawText, intent)) {
              finalResponseText = rawText;
              break;
            }
          }
        } catch (mErr) {
          console.warn(`Gemini model ${model} execution notice:`, mErr.message);
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to dynamic tool response generator:', err.message);
    }
  }

  // 5. Dynamic Fallback Text Generator (If Gemini text is empty, offline, or truncated)
  if (!finalResponseText || isResponseTruncated(finalResponseText, intent)) {
    finalResponseText = await generateDynamicFallbackResponse({ query, intent, toolData, user, action });
  }

  // 6. Sanitize and complete any response text (auto-completes mid-sentence endings like "in 10-" and appends missing sections)
  finalResponseText = sanitizeAndCompleteResponse(finalResponseText, intent, toolData, user);

  // 7. Return Structured Output
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

  // Dedicated Product Intents (Cheapest, Out of Stock, Most Expensive, In Stock)
  if (lower.includes('out of stock') || lower.includes('unavailable products') || lower.includes('items are unavailable') || lower.includes('products are unavailable') || lower.includes('zero stock') || lower.includes('not available right now') || lower.includes('marked as out of stock')) {
    return 'PRODUCT_OUT_OF_STOCK';
  }
  if (lower.includes('cheapest') || lower.includes('least expensive') || lower.includes('costs the least') || lower.includes('lowest price') || lower.includes('lowest priced') || lower.includes('cheaper')) {
    if (lower.match(/which (?:one is|one's|one) (?:cheapest|cheaper)/i)) return 'FOLLOW_UP_CHEAPEST';
    return 'PRODUCT_CHEAPEST';
  }
  if (lower.includes('most expensive') || lower.includes('highest price') || lower.includes('highest priced') || lower.includes('costs the most')) {
    return 'PRODUCT_MOST_EXPENSIVE';
  }
  if (lower.includes('in stock') || lower.includes('products are available') || lower.includes('what can i buy right now') || lower.includes('available products')) {
    return 'PRODUCT_IN_STOCK';
  }

  // 1. Difference Question (Product vs Services)
  if (lower.match(/difference between.*product.*service|product vs service|difference.*service|how do (?:products|services) differ/i)) {
    return 'PRODUCT_VS_SERVICES';
  }

  // 2. General Website overview ("tell me everything i can do", "about campushub", "what can i do on campushub")
  if (lower.match(/what is campushub|about campushub|what can i do|everything i can do|how does campushub work|tell me about campushub/i)) {
    return 'GENERAL_WEBSITE';
  }

  // 3. Service Query Intent ("what services are available", "what can i book")
  if (lower.match(/what services|available services|services available|service available|services do you|what can i book|book service|tell me about your services|campus services/i)) {
    return 'SERVICE_LIST';
  }

  // 4. Product Category Query Intent ("what categories are available", "what product categories do you have", "which categories can i browse")
  if (lower.match(/what (?:product )?categories|categories available|available categories|category available|types of products|show me all categories|which categories|list categories/i)) {
    return 'PRODUCT_CATEGORY_LIST';
  }

  // Product comparison & Rating queries
  if (lower.match(/highest rating|highest rated|top rated|best product|best rated|top product|most popular/i)) {
    return 'TOP_RATED_PRODUCT';
  }

  // Follow-ups & Cart actions
  if (lower.match(/which (?:one is|one's|one) (?:cheapest|cheaper|the cheapest|lowest price)/i)) return 'FOLLOW_UP_CHEAPEST';
  if (lower.match(/how much (?:does it cost|is it|is that|cost)|what is (?:the )?price of (?:it|this|that)/i)) return 'FOLLOW_UP_PRICE';
  if (lower.match(/is (?:it|this|that) in stock|is (?:it|this|that) available|stock status/i)) return 'FOLLOW_UP_STOCK';
  if (lower.match(/add (?:that|this|it|the cheapest|second|first|1st|2nd) (?:one|item)? to (?:my )?cart/i)) return 'CART_ADD';
  if (lower.match(/add .* to (?:my )?cart/i)) return 'CART_ADD';
  if (lower.match(/cart|check (?:my )?cart|show (?:my )?cart|view (?:my )?cart|open (?:my )?cart|what is in my cart|how to see cart|how (?:can|do) i check (?:my )?cart/i)) return 'CART_VIEW';

  // Ordering & Workflows
  if (lower.match(/how (?:can|do|to|should|would) (?:i|we)? (?:place|make|put|create|do) (?:an|my|the)? ?(?:order|purchase)|how (?:can|do|to) (?:i|we)? order|how (?:can|do|to) (?:i|we)? buy|how to order|how to place order|order(?:ing)? process|process .* order|tell me how (?:can|do|to) i order/i) || lower.includes('how to place an order') || lower.includes('how to place my order') || lower.includes('how can i place my order') || lower.includes('how can i place an order') || lower.includes('how can i order')) {
    return 'HOW_TO_ORDER';
  }
  if (lower.match(/my orders|recent order|recent orders|latest order|track (?:my )?order|track|order status|where is my order|what did i order|order history|how (?:can|do|to) i track (?:my )?order/i)) return 'ORDER_STATUS';
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

  if (lower.match(/print|printhub|print section|pdf|photocopy|spiral|binding|lamination/i)) return 'PRINTING_INFO';
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

  if (toolData.categories && toolData.categories.length > 0) {
    toolContextText += `Available Product Categories:\n`;
    toolData.categories.forEach(c => {
      toolContextText += `- ${c.label || c.name} (${c.itemsCount || 0} items available)\n`;
    });
  }

  if (toolData.services && Array.isArray(toolData.services) && toolData.services.length > 0) {
    toolContextText += `CampusHub Utility Services:\n`;
    toolData.services.forEach(s => {
      toolContextText += `- ${s.name}: ${s.description} (Price: ${typeof s.price === 'number' ? '₹' + s.price : s.price})\n`;
    });
  }

  if (toolData.printhub) {
    toolContextText += `PrintHub Printing Services:\n- B&W Printing: ₹2/page\n- Color Printing: ₹10/page\n- Spiral Binding: ₹49\n- Lamination: ₹30\n`;
  }

  if (toolData.marketplace) {
    toolContextText += `Second-Hand Student Marketplace:\n- Peer-to-peer trading for textbooks, lab coats, cycles, and hostel furniture.\n`;
  }

  return `You are the official CampusHub Dynamic AI Assistant — a smart, friendly, college junior assisting students on campus.

Student Context:
- Name: ${userName}
- Hostel Block: ${userBlock}, Room: ${userRoom}
- Wallet Balance: ₹${walletBal}

${toolContextText}

Knowledge Guidelines:
- PrintHub: B&W ₹2/pg, Color ₹10/pg, Spiral binding ₹49, Staple binding ₹10, Lamination ₹30. Fast 10-15 min delivery to hostel floor.
- Delivery Time: 10-15 minutes campus runner delivery.

STRICT INSTRUCTIONS:
1. Always speak as a helpful campus assistant. Be friendly, natural, and provide COMPLETE, fully detailed answers.
2. NEVER cut off your response mid-sentence or leave answers incomplete. Always complete all thoughts, explanations, and bullet points.
3. Base your product details, prices, stock, categories, and services strictly on the verified data above.
4. PRINTHUB RULE: When asked about PrintHub or printing ("how Print section works", "printing rates", "how to print"), ONLY discuss document printing (B&W ₹2/pg, Color ₹10/pg, Spiral binding ₹49, paper size, duplex, document upload, hostel floor delivery). DO NOT mention Laptop Cleaning, Laundry, or Room Deep Cleaning!
5. FORMATTING MANDATE: NEVER output multiple items, categories, or services horizontally on a single line separated by dots or bullets (e.g., NEVER write "• A • B • C").
6. ALWAYS list items vertically on separate lines with a bullet ("•") or number ("1.") on its own line.
7. If the user asks Hinglish questions (e.g., "Calculator kitne ka hai?"), reply naturally in clean Hinglish or English.`;
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
 * Dynamic Fallback Text Generator
 */
async function generateDynamicFallbackResponse({ query, intent, toolData, user, action }) {
  const userName = user ? user.name : 'Guest';

  if (toolData.authRequired) {
    return `Hey ${userName}! 🔐 ${toolData.authMessage}`;
  }

  if (intent === 'PRODUCT_CHEAPEST') {
    if (toolData.products && toolData.products.length > 0) {
      const p = toolData.products[0];
      return `The cheapest product is **${p.title}** for **₹${p.price}**.`;
    } else {
      return `No available products in store.`;
    }
  }

  if (intent === 'PRODUCT_MOST_EXPENSIVE') {
    if (toolData.products && toolData.products.length > 0) {
      const p = toolData.products[0];
      return `The most expensive product is **${p.title}** for **₹${p.price}**.`;
    } else {
      return `No available products in store.`;
    }
  }

  if (intent === 'PRODUCT_OUT_OF_STOCK') {
    if (toolData.products && toolData.products.length > 0) {
      const list = toolData.products.map(p => `• **${p.title}**`).join('\n');
      return `The following product(s) are currently out of stock:\n\n${list}`;
    } else {
      return `Everything is available.`;
    }
  }

  if (intent === 'PRODUCT_IN_STOCK') {
    if (toolData.products && toolData.products.length > 0) {
      return `I found ${toolData.products.length} in-stock product(s) currently available in the CampusHub store! Check out the product cards below.`;
    } else {
      return `There are currently no in-stock products available in the CampusHub database.`;
    }
  }

  if (intent === 'FOLLOW_UP_PRICE') {
    if (toolData.followUpTarget) {
      const p = toolData.followUpTarget;
      return `The price of **${p.title}** is **₹${p.price}**! Check out the product card below to add it to your cart.`;
    }
  }

  if (intent === 'FOLLOW_UP_STOCK') {
    if (toolData.followUpTarget) {
      const p = toolData.followUpTarget;
      const inStock = (p.stock ?? 20) > 0;
      return `Yes, **${p.title}** is currently **${inStock ? 'IN STOCK' : 'OUT OF STOCK'}** (Available Stock: ${p.stock ?? 'Available'}).`;
    }
  }

  if (intent === 'PRODUCT_SEARCH' || intent === 'FOLLOW_UP_CHEAPEST') {
    if (toolData.products && toolData.products.length > 0) {
      const pCount = toolData.products.length;
      const topP = toolData.products[0];
      return `Hey ${userName}! 🎒 I found ${pCount} matching items in the CampusHub store! The top result is "${topP.title}" for ₹${topP.price}. Check out the details below!`;
    } else {
      let cleanTerm = query.replace(/which|what|where|show|me|the|cheapest|available|currently|products|product|items|item|in stock|out of stock|is|are|do|you|have|any|under|below|above|₹\d+|\d+/gi, '').trim();
      if (cleanTerm.length > 2) {
        return `Sorry ${userName}! 🎒 The item "${cleanTerm}" is not available in our CampusHub database right now. Try searching for available items like calculators, notebooks, pens, electric kettles, or laptop stands!`;
      } else {
        return `Sorry ${userName}! 🎒 I couldn't find any matching items in our CampusHub database right now. Try searching for available items like calculators, notebooks, pens, electric kettles, or laptop stands!`;
      }
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
    return `Hey ${userName}! 🎒 Here is a complete breakdown of how physical products and services differ on CampusHub:

🛍️ **CampusHub Physical Products**:
• Store items you purchase and own permanently (e.g., scientific calculators, notebooks, electric kettles, hostel room essentials, snacks, laptop accessories).
• Delivered straight to your dorm room floor via our 10-15 minute hyperlocal campus runner.
• Ordered by adding items to your shopping cart and checking out via Campus Pay Wallet, UPI, or Cash on Delivery.

🛠️ **CampusHub Services**:
• On-demand professional utility tasks booked for your dorm room or academic needs.
• **PrintHub**: Cloud document printing (B&W ₹2/pg, Color ₹10/pg, Spiral Binding ₹49) delivered right to your hostel floor.
• **Dorm Utility Services**: Schedule skilled helpers for Laptop Cleaning (₹799), Laundry Wash & Fold (₹299), or Room Deep Cleaning (₹199).
• **Student Marketplace**: Trade pre-owned textbooks, lab coats, cycles, and hostel gear directly with verified dorm peers.`;
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
    return `Hey ${userName}! 🛒 Here is the complete step-by-step process to place an order on CampusHub:

1️⃣ **Browse & Select Products**:
Explore store categories (stationery, electronics, hostel supplies, snacks) or ask me for any product.

2️⃣ **Add Items to Cart**:
Click '+ Add to Cart' on your chosen item or ask me to add it directly to your cart.

3️⃣ **Open Cart & Select Hostel Address**:
Click the Cart icon in the top navigation bar and select your hostel block & room number.

4️⃣ **Select Payment Method**:
Pay using Campus Pay Wallet (instant 1-click), UPI (Google Pay / PhonePe / Paytm), or Cash on Delivery (COD).

5️⃣ **Track Fast 10-Minute Delivery**:
Place your order! Our campus runner delivers your items straight to your hostel room floor in 10-15 minutes!`;
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

  if (intent === 'PRINTING_INFO') {
    return `Hey ${userName}! 🖨️ Here is everything you need to know about PrintHub cloud document printing on CampusHub:

📄 **What You Can Print**:
• Assignment PDFs, Lecture Notes, Lab Records, Presentations, & Exam Question Papers (PDF/DOCX/PNG format).

💰 **Pricing & Print Rates**:
• **Black & White Printing**: ₹2 / page
• **Color Printing**: ₹10 / page
• **Spiral Binding**: ₹49 (includes durable plastic front/back cover)
• **Staple Binding**: ₹10
• **Lamination**: ₹30

⚙️ **Custom Print Options**:
• Paper Sizes: A4, A3
• Sides: Single-sided or Double-sided (Duplex)

🚀 **How to Order & Use PrintHub**:
1️⃣ Go to the **PrintHub** section from the top navigation bar.
2️⃣ Upload your document file (PDF or DOCX).
3️⃣ Select page range, color mode (B&W/Color), paper size, and binding preference.
4️⃣ Enter your hostel block & room number.
5️⃣ Checkout via Campus Pay Wallet, UPI, or Cash on Delivery.
6️⃣ Our campus runner delivers your printed documents directly to your hostel room floor in 10-15 minutes!`;
  }

  if (intent === 'SERVICE_LIST' || intent === 'SERVICE_INFO') {
    return `Here are the CampusHub services currently available:

• **🖨️ PrintHub Cloud Printing**: Upload PDF/DOC documents for B&W (₹2/pg) or Color (₹10/pg) printing with optional Spiral Binding (₹49), delivered to your dorm room floor.
• **💻 Laptop & Gadget Deep Cleaning**: Internal dust removal, thermal paste re-application, and keyboard sanitization (₹799).
• **🧺 Dorm Laundry Pickup & Fold**: 5kg laundry wash, fabric softening, steam press, and neat fold (₹299).
• **🧹 Hostel Room Deep Sanitization**: Floor scrubbing, desk clearing, and bathroom sanitization (₹199).
• **🔄 Student Marketplace**: Trade pre-owned textbooks, lab coats, cycles, and hostel gear directly with dorm peers.

You can ask me about pricing or how to book any of these services!`;
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

  if (intent === 'CATEGORY_SEARCH' || intent === 'PRODUCT_CATEGORY_LIST') {
    const cats = (toolData.categories && toolData.categories.length > 0) ? toolData.categories : await getCategories();
    const catListText = cats.map(c => `• **${c.label}** (${c.itemsCount || 0} items available)`).join('\n');
    return `Here are the product categories currently available on CampusHub:

${catListText}

Want me to show products from any of these categories?`;
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

/**
 * Helper to validate response completeness and detect mid-sentence or section truncation
 */
function isResponseTruncated(text, intent = '') {
  if (!text || typeof text !== 'string') return true;
  const trimmed = text.trim();
  if (trimmed.length < 15) return true;

  // Check abrupt sentence termination markers (dangling hyphens or connectors)
  if (/[-([{:,\u2014]$/.test(trimmed)) return true;
  if (/\b(?:and|or|the|with|for|a|an|is|are|of|to|in 10-|in 10-15)\s*$/i.test(trimmed)) return true;

  // Mismatched parentheses or brackets across response
  const openParens = (trimmed.match(/\(/g) || []).length;
  const closeParens = (trimmed.match(/\)/g) || []).length;
  if (openParens > closeParens + 1) return true;

  return false;
}

/**
 * Auto-sanitizer that completes any broken sentences or missing sections in AI text
 */
function sanitizeAndCompleteResponse(text, intent = '', toolData = {}, user = null) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.trim();

  // Normalize any inline bullet point separators (" • ") into clean vertical newlines ("\n• ")
  if (cleaned.includes(' • ')) {
    cleaned = cleaned.replace(/\s*•\s*/g, '\n• ').trim();
  }

  // 1. Fix known truncated endings like "in 10-" or "in 10-15"
  if (/in 10-$/i.test(cleaned)) {
    cleaned += '15 minutes, delivered straight to your hostel room floor!';
  } else if (/in 10-15\s*$/i.test(cleaned)) {
    cleaned += ' minutes, delivered straight to your hostel room floor!';
  } else if (/in 10-15 min(?:ute)?s?\s*$/i.test(cleaned)) {
    cleaned += ', delivered straight to your hostel room floor!';
  } else if (/[-([{:,\u2014]$/.test(cleaned)) {
    cleaned = cleaned.replace(/[-([{:,\u2014]+$/, '').trim();
    if (!/[.!?}$`'"]$/.test(cleaned)) {
      cleaned += '.';
    }
  }

  // 2. Intent-specific section completion
  if (intent === 'PRODUCT_VS_SERVICES') {
    const lower = cleaned.toLowerCase();
    const hasProducts = lower.includes('product') || lower.includes('buy') || lower.includes('physical');
    const hasServices = lower.includes('service') || lower.includes('printhub') || lower.includes('laundry') || lower.includes('clean');

    if (hasProducts && !hasServices) {
      cleaned += `\n\n🛠️ **CampusHub Utility Services**:\n• **What they are**: On-demand professional utility tasks booked for your dorm room or academic needs.\n• **PrintHub**: Cloud document printing (B&W ₹2/pg, Color ₹10/pg, Spiral Binding ₹49) delivered right to your hostel floor.\n• **Dorm Utility Services**: Schedule skilled helpers for Laptop Cleaning (₹799), Laundry Wash & Fold (₹299), or Room Deep Cleaning (₹199).\n• **Student Marketplace**: Trade pre-owned textbooks, lab coats, cycles, and hostel gear directly with verified dorm peers.`;
    }
  }

  if (!/[.!?}\]"'`'’]$/.test(cleaned) && !cleaned.endsWith('**') && !cleaned.endsWith('__')) {
    cleaned += '.';
  }

  return cleaned;
}

