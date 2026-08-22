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
 * Helper to extract valid product keyword or product noun from user query.
 * Returns empty string if query is generic, conversational, or doesn't contain a product noun.
 */
export function extractProductKeyword(query) {
  if (!query || typeof query !== 'string') return '';
  const lower = query.toLowerCase().trim();

  // Known product keywords & nouns in CampusHub catalog
  const knownProductNouns = [
    'calculator', 'notebooks', 'notebook', 'desk organizer', 'organizer', 'water bottle', 'bottle',
    'laptop stand', 'laptop', 'diffuser', 'hoodie', 'journal', 'gel pen', 'pens', 'pen',
    'multi-port hub', 'usb hub', 'usb-c', 'usb', 'cushion', 'backpack', 'bag',
    'exam prep kit', 'exam kit', 'freshers kit', 'hostel starter kit', 'hostel kit',
    'placement crack kit', 'placement kit', 'starter kit', 'electric kettle', 'kettle',
    'bucket', 'mug', 'bedsheet', 'blanket', 'towel', 'soap', 'shampoo', 'toothpaste',
    'charger', 'cable', 'headphone', 'headphones', 'earbuds', 'mouse', 'keyboard',
    'lock', 'combos', 'combo', 'kit', 'stationery', 'resumes', 'folder', 'sticky notes'
  ];

  // Direct match for known product nouns
  for (const noun of knownProductNouns) {
    const regex = new RegExp(`\\b${noun}\\b`, 'i');
    if (regex.test(lower)) {
      return noun;
    }
  }

  // Check if query is a generic phrase, prompt question, confirmation, or category command
  if (
    lower.includes('all products') ||
    lower.includes('all categories') ||
    lower.includes('from all') ||
    lower.includes('show categories') ||
    lower.includes('browse categories') ||
    lower.includes('want me to show') ||
    lower.includes('how products') ||
    lower.includes('what products') ||
    lower.includes('what can i buy') ||
    lower === 'yes' || lower === 'yes please' || lower === 'sure' || lower === 'yeah' || lower === 'ok' || lower === 'okay' ||
    lower === 'show products' || lower === 'show me products' || lower === 'all items' || lower === 'show all'
  ) {
    return '';
  }

  // Clean lead-in verbs, stop words, and filler terms
  let clean = lower
    .replace(/^(?:show me|search for|do you have|can i get|i want|i need|looking for|find|display|list|any|available|which|what|is there|are there|where is|how about)\s+/gi, '')
    .replace(/under|below|above|less than|more than|cheap|cheapest|best|top|rated|in stock|out of stock|₹\d+|\d+/gi, '')
    .replace(/products|product|items|item|store|categories|category|all|please|thanks|thank you|from|these|those|this|that/gi, '')
    .trim();

  // Words that are purely generic/conversational
  const genericWords = new Set([
    'how', 'from', 'these', 'this', 'that', 'those', 'want', 'show', 'tell', 'about',
    'yes', 'yeah', 'sure', 'ok', 'okay', 'see', 'view', 'browse', 'give', 'have',
    'some', 'something', 'thing', 'things', 'many', 'much', 'more', 'less', 'good',
    'which', 'where', 'when', 'what', 'who', 'why', 'can', 'could', 'would', 'should'
  ]);

  const words = clean.split(/\s+/).filter(w => w.length >= 3 && !genericWords.has(w) && isNaN(w));

  if (words.length > 0) {
    const extracted = words.join(' ');
    if (extracted.length >= 3 && !genericWords.has(extracted)) {
      return extracted;
    }
  }

  return '';
}

/**
 * Helper to match explicit category searches from user prompt or category chip clicks.
 */
export function extractCategoryKey(query) {
  if (!query || typeof query !== 'string') return null;
  const lower = query.toLowerCase().trim();

  if (lower.includes('hostel essentials') || lower.includes('hostel essential')) {
    return { key: 'hostel', label: 'Hostel Essentials' };
  }
  if (lower.includes('electronics & accessories') || lower.includes('electronics') || lower.includes('electronic accessories')) {
    return { key: 'electronics', label: 'Electronics & Accessories' };
  }
  if (lower.includes('study essentials') || lower.includes('study essential')) {
    return { key: 'study', label: 'Study Essentials' };
  }
  if (lower.includes('college merchandise') || lower.includes('merchandise') || lower.includes('college merch')) {
    return { key: 'merchandise', label: 'College Merchandise' };
  }
  if (lower.includes('student combo packs') || lower.includes('combo packs') || lower.includes('combos')) {
    return { key: 'combos', label: 'Student Combo Packs' };
  }
  if (lower.includes('kitchen & utility') || lower.includes('kitchen utility')) {
    return { key: 'kitchen', label: 'Kitchen & Utility' };
  }
  if (lower.includes('personal care')) {
    return { key: 'personal', label: 'Personal Care' };
  }

  // Generic category keywords in prompt ("products in hostel", "show study category")
  if (lower.includes('in hostel') || lower.includes('hostel products')) return { key: 'hostel', label: 'Hostel Essentials' };
  if (lower.includes('in electronics') || lower.includes('electronic products')) return { key: 'electronics', label: 'Electronics & Accessories' };
  if (lower.includes('in study') || lower.includes('study products') || lower.includes('stationery')) return { key: 'study', label: 'Study Essentials' };
  if (lower.includes('in kitchen') || lower.includes('kitchen products')) return { key: 'kitchen', label: 'Kitchen & Utility' };
  if (lower.includes('in personal') || lower.includes('personal products')) return { key: 'personal', label: 'Personal Care' };
  if (lower.includes('in merchandise') || lower.includes('merch products')) return { key: 'merchandise', label: 'College Merchandise' };
  if (lower.includes('in combos') || lower.includes('combo products')) return { key: 'combos', label: 'Student Combo Packs' };

  return null;
}

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
    if (intent === 'ALL_PRODUCTS') {
      productsResult = await searchProducts({ limit: 18 });
      toolData.products = productsResult;
    }
    else if (intent === 'PRODUCT_CHEAPEST' || intent === 'PRODUCT_MOST_EXPENSIVE' || intent === 'PRODUCT_OUT_OF_STOCK' || intent === 'PRODUCT_IN_STOCK' || intent === 'PRODUCT_SEARCH' || intent === 'PRODUCT_PRICE' || intent === 'PRODUCT_AVAILABILITY' || intent === 'PRODUCT_RECOMMENDATION') {
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
      const catMatch = extractCategoryKey(query);
      let category = '';
      if (catMatch) {
        category = catMatch.key;
        toolData.searchedCategoryLabel = catMatch.label;
      } else if (lowerQuery.includes('combo') || lowerQuery.includes('kit') || lowerQuery.includes('bundle') || lowerQuery.includes('exam')) {
        category = 'combos';
      } else if (lowerQuery.includes('kettle') || lowerQuery.includes('kitchen') || lowerQuery.includes('mug') || lowerQuery.includes('plate') || lowerQuery.includes('bowl') || lowerQuery.includes('lunch box')) {
        category = 'kitchen';
      } else if (lowerQuery.includes('electronic') || lowerQuery.includes('calculator') || lowerQuery.includes('laptop') || lowerQuery.includes('mouse') || lowerQuery.includes('charger') || lowerQuery.includes('cable') || lowerQuery.includes('headphone') || lowerQuery.includes('power bank')) {
        category = 'electronics';
      } else if (lowerQuery.includes('study') || lowerQuery.includes('book') || lowerQuery.includes('notebook') || lowerQuery.includes('pen') || lowerQuery.includes('register') || lowerQuery.includes('journal')) {
        category = 'study';
      } else if (lowerQuery.includes('hostel') || lowerQuery.includes('dorm') || lowerQuery.includes('lamp') || lowerQuery.includes('bucket') || lowerQuery.includes('bedsheet') || lowerQuery.includes('blanket') || lowerQuery.includes('lock')) {
        category = 'hostel';
      } else if (lowerQuery.includes('shampoo') || lowerQuery.includes('soap') || lowerQuery.includes('toothpaste') || lowerQuery.includes('towel') || lowerQuery.includes('diffuser') || lowerQuery.includes('personal')) {
        category = 'personal';
      } else if (lowerQuery.includes('hoodie') || lowerQuery.includes('t-shirt') || lowerQuery.includes('shirt') || lowerQuery.includes('merchandise')) {
        category = 'merchandise';
      }

      // Extract search term cleanly
      let searchTerm = '';
      if (catMatch && (lowerQuery.includes('show products in') || lowerQuery.includes('products in') || lowerQuery.includes('category') || !extractProductKeyword(query))) {
        searchTerm = ''; // Pure category listing
      } else if (intent === 'PRODUCT_SEARCH' || intent === 'PRODUCT_PRICE' || intent === 'PRODUCT_AVAILABILITY') {
        searchTerm = extractProductKeyword(query);
      } else {
        if (lowerQuery.includes('calculator')) searchTerm = 'calculator';
        else if (lowerQuery.includes('kettle')) searchTerm = 'kettle';
        else if (lowerQuery.includes('notebook')) searchTerm = 'notebook';
        else if (lowerQuery.includes('pen')) searchTerm = 'pen';
        else if (lowerQuery.includes('laptop')) searchTerm = 'laptop';
      }

      const limit = (intent === 'PRODUCT_CHEAPEST' || intent === 'PRODUCT_MOST_EXPENSIVE') ? 1 : (catMatch ? 12 : 6);

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
      toolData.searchedTerm = searchTerm;
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
        const cleanTerm = extractProductKeyword(query);
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
    else if (intent === 'CATEGORY_SEARCH' || intent === 'PRODUCT_CATEGORY_LIST') {
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
    'ALL_PRODUCTS',
    'PRODUCT_CATEGORY_LIST',
    'CATEGORY_SEARCH',
    'PRODUCT_CHEAPEST',
    'PRODUCT_MOST_EXPENSIVE',
    'PRODUCT_OUT_OF_STOCK',
    'PRODUCT_IN_STOCK',
    'PRODUCT_SEARCH',
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

  // 6. Sanitize and complete any response text
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
      coupons: toolData.coupons || null,
      categories: toolData.categories || null
    },
    action
  };
};

/**
 * Classify Intent from user query
 */
function classifyIntent(query, context, isLoggedIn) {
  const lower = query.replace(/[“”"'`]/g, '').trim().toLowerCase();

  // 0. Greetings & General Website Overview
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'greetings' || lower === 'good morning' || lower === 'good evening' || lower === 'help' || lower === 'what can you do') {
    return 'GENERAL_WEBSITE';
  }

  // Explicit single category product search request ("Show products in Hostel Essentials", etc.)
  const catSearch = extractCategoryKey(query);
  if (catSearch && !lower.includes('all categories') && !lower.includes('from all categories') && !lower.includes('all products')) {
    return 'PRODUCT_SEARCH';
  }

  // 1. ALL PRODUCTS / Category prompt responses / Generic product requests across categories
  if (
    lower.includes('all products') ||
    lower.includes('products from all') ||
    lower.includes('from all categories') ||
    lower.includes('all categories') ||
    lower.includes('all category') ||
    lower.includes('all items') ||
    lower.includes('show all') ||
    lower.includes('how products from all') ||
    lower.includes('want me to show products') ||
    lower.match(/show products from all/i) ||
    lower.match(/products in all/i) ||
    lower.match(/how products/i)
  ) {
    return 'ALL_PRODUCTS';
  }

  // Affirmative responses or category prompt follow-ups ("yes", "sure", "yeah", "ok", "show products")
  if (
    lower === 'yes' || lower === 'yes please' || lower === 'sure' || lower === 'yeah' ||
    lower === 'ok' || lower === 'okay' || lower === 'show products' || lower === 'show me products'
  ) {
    return 'ALL_PRODUCTS';
  }

  // 2. Dedicated Product Intents (Cheapest, Out of Stock, Most Expensive, In Stock)
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

  // 3. Difference Question (Product vs Services)
  if (lower.match(/difference between.*product.*service|product vs service|difference.*service|how do (?:products|services) differ/i)) {
    return 'PRODUCT_VS_SERVICES';
  }

  // 4. General Website overview
  if (lower.match(/what is campushub|about campushub|what can i do|everything i can do|how does campushub work|tell me about campushub/i)) {
    return 'GENERAL_WEBSITE';
  }

  // 5. Service Query Intent
  if (lower.match(/what services|available services|services available|service available|services do you|what can i book|book service|tell me about your services|campus services/i)) {
    return 'SERVICE_LIST';
  }

  // 6. Product Category Query Intent
  if (
    lower === 'show categories' || lower === 'browse categories' || lower === 'list categories' ||
    lower.match(/what (?:product )?categories|categories available|available categories|category available|types of products|show me all categories|which categories|list categories/i)
  ) {
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
  if (lower.match(/payment|pay|how (?:can|do|to) (?:i |we )?pay|make a payment|payment methods|payment options|cash on delivery|cod|upi|wallet pay|credit card|debit card/i)) return 'PAYMENT_INFO';
  if (lower.match(/delivery time|how long (?:does )?delivery|delivery fee|shipping|delivery process|10 minute delivery|how fast/i)) return 'DELIVERY_INFO';
  if (lower.match(/return|refund|cancellation|cancel order|how to return|exchange/i)) return 'RETURN_REFUND_INFO';

  if (lower.match(/print|printhub|print section|pdf|photocopy|spiral|binding|lamination/i)) return 'PRINTING_INFO';
  if (lower.match(/laundry|cleaning|laptop clean|room clean|service|services/i)) return 'SERVICE_INFO';
  if (lower.match(/marketplace|second-hand|buy used|sell item|pre-owned/i)) return 'MARKETPLACE_INFO';
  if (lower.match(/coupon|coupons|discount|promo|offer|code/i)) return 'COUPON_INFO';
  if (lower.match(/where is|how to go|open cart|open orders|open wallet|open marketplace/i)) return 'NAVIGATION';

  if (lower.match(/category|categories|catagories|catagorie|catagory|catagori/i)) {
    return 'CATEGORY_SEARCH';
  }

  // Check if query contains an explicit product keyword/noun
  const keyword = extractProductKeyword(query);
  if (keyword) {
    return 'PRODUCT_SEARCH';
  }

  return 'GENERAL_WEBSITE';
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

  if (intent === 'ALL_PRODUCTS') {
    if (toolData.products && toolData.products.length > 0) {
      return `Hey ${userName}! 🎒 Here are available products from all categories in our CampusHub store! Check out the listings below:`;
    } else {
      return `Hey ${userName}! 🎒 Here are available store products.`;
    }
  }

  if (intent === 'PRODUCT_CHEAPEST') {
    if (toolData.products && toolData.products.length > 0) {
      let cheapestProd = toolData.products[0];
      for (const p of toolData.products) {
        if (typeof p.price === 'number' && p.price < cheapestProd.price) {
          cheapestProd = p;
        }
      }
      return `Cheapest product: ${cheapestProd.title} — ₹${cheapestProd.price}`;
    } else {
      return `No available products in store.`;
    }
  }

  if (intent === 'PRODUCT_MOST_EXPENSIVE') {
    if (toolData.products && toolData.products.length > 0) {
      let expProd = toolData.products[0];
      for (const p of toolData.products) {
        if (typeof p.price === 'number' && p.price > expProd.price) {
          expProd = p;
        }
      }
      return `Most expensive product: ${expProd.title} — ₹${expProd.price}`;
    } else {
      return `No available products in store.`;
    }
  }

  if (intent === 'PRODUCT_OUT_OF_STOCK') {
    if (toolData.products && toolData.products.length > 0) {
      const outNames = toolData.products.map(p => p.title).join(', ');
      return `Out of stock: ${outNames}`;
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
    const searchTerm = toolData.searchedTerm || extractProductKeyword(query);
    const catLabel = toolData.searchedCategoryLabel;

    if (toolData.products && toolData.products.length > 0) {
      const pCount = toolData.products.length;
      const topP = toolData.products[0];
      if (catLabel) {
        return `Hey ${userName}! 🎒 Here are available products in the **${catLabel}** category in our CampusHub store! Check out the listings below:`;
      } else if (searchTerm) {
        return `Hey ${userName}! 🎒 I found ${pCount} matching item(s) for "${searchTerm}" in the CampusHub store! The top result is "${topP.title}" for ₹${topP.price}. Check out the details below!`;
      } else {
        return `Hey ${userName}! 🎒 Here are available products in our CampusHub store! Check out the details below:`;
      }
    } else {
      if (catLabel) {
        return `Sorry ${userName}! 🎒 There are currently no products in the "${catLabel}" category available right now.`;
      } else if (searchTerm && searchTerm.length >= 2) {
        return `Sorry ${userName}! 🎒 The item "${searchTerm}" is not available in our CampusHub database right now. Try searching for available items like calculators, notebooks, pens, electric kettles, or laptop stands!`;
      } else {
        return `Hey ${userName}! 🎒 I couldn't find any specific product matching your query. Here are some popular items available in our CampusHub store right now!`;
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
• **Student Marketplace**: Trade pre-owned textbooks, lab coats, cycles, and hostel gear directly with dorm peers.`;
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
    } else {
      return `Hey ${userName}! 🎓 Please log in to view your detailed student profile specs.`;
    }
  }

  return `Hey ${userName}! 🎒 Welcome to CampusHub! I can help you search for scientific calculators, notebooks, electric kettles, track your live orders, or check your Campus Pay wallet. How can I assist you today?`;
}

/**
 * Check if AI response was cut off mid-sentence
 */
function isResponseTruncated(text, intent) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.endsWith('...') || trimmed.endsWith('..') || trimmed.endsWith('in 10-') || trimmed.endsWith('in 10') || trimmed.endsWith('in') || trimmed.endsWith('to') || trimmed.endsWith('and') || trimmed.endsWith('the')) {
    return true;
  }
  return false;
}

/**
 * Sanitize and Complete Any Response Text
 */
function sanitizeAndCompleteResponse(text, intent, toolData, user) {
  if (!text) return text;
  let cleaned = text.trim();

  // Fix mid-sentence truncation
  if (cleaned.endsWith('in 10-') || cleaned.endsWith('in 10')) {
    cleaned += '15 minutes campus runner delivery to your hostel floor!';
  } else if (cleaned.endsWith('...')) {
    cleaned = cleaned.slice(0, -3) + '.';
  }

  return cleaned;
}
