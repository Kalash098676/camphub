import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { API_BASE } from '../../config/api';

export default function AIChatDrawer({
  aiChatOpen,
  setAiChatOpen,
  aiMessages,
  setAiMessages,
  aiInput,
  setAiInput,
  onAddToCart,
  onNavigate,
  onOpenProduct,
  currentTab = 'home',
  cart = []
}) {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    const timer1 = setTimeout(scrollToBottom, 100);
    const timer2 = setTimeout(scrollToBottom, 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [aiMessages, isTyping, aiChatOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    // Add user message to UI local state
    setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('campushub_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Context aware payload
      const contextPayload = {
        currentPage: currentTab,
        cartItemCount: cart.length
      };

      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: aiMessages,
          message: userMsg,
          context: contextPayload
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response message
        const newAiMessage = {
          sender: 'ai',
          text: data.text || 'Here is what I found for you!',
          intent: data.intent,
          data: data.data || {},
          action: data.action || null
        };

        setAiMessages(prev => [...prev, newAiMessage]);

        // Process Allowed Safe Client Actions
        if (data.action) {
          handleClientAction(data.action, data.data);
        }
      } else {
        throw new Error(data.message || 'Server error from AI backend');
      }
    } catch (err) {
      console.warn('AI Chat Error:', err.message);
      setAiMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I'm having trouble connecting to the CampusHub AI service right now. Please verify your connection or try again!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handler for Safe Client Actions
  const handleClientAction = (actionObj, dataObj) => {
    if (!actionObj || !actionObj.type) return;

    if (actionObj.type === 'ADD_TO_CART' && onAddToCart) {
      if (actionObj.productId) {
        let productToAdd = null;
        if (dataObj && dataObj.products && dataObj.products.length > 0) {
          productToAdd = dataObj.products.find(p => p.id === actionObj.productId || p._id === actionObj.productId) || dataObj.products[0];
        }
        if (!productToAdd) {
          // Search recent messages for matching product
          for (let i = aiMessages.length - 1; i >= 0; i--) {
            const m = aiMessages[i];
            if (m.data && m.data.products && Array.isArray(m.data.products)) {
              const found = m.data.products.find(p =>
                (p.id && p.id === actionObj.productId) ||
                (p._id && p._id === actionObj.productId) ||
                (p.title && actionObj.productTitle && p.title.toLowerCase().includes(actionObj.productTitle.toLowerCase()))
              );
              if (found) {
                productToAdd = found;
                break;
              }
            }
          }
        }
        if (productToAdd) {
          onAddToCart(productToAdd);
        } else {
          console.warn('Could not locate verified product to add to cart:', actionObj);
        }
      }
    } else if (actionObj.type === 'NAVIGATE' && onNavigate) {
      onNavigate(actionObj.target);
    } else if (actionObj.type === 'OPEN_PRODUCT' && onOpenProduct && actionObj.productId) {
      onOpenProduct(actionObj.productId);
    }
  };

  return (
    <div className={`ai-assistant-widget ${aiChatOpen ? 'expanded' : ''}`}>
      {aiChatOpen ? (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="ai-header-icon-badge">🧠</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>CampusHub AI Assistant</h4>
                <span style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 600 }}>● Active & Database Aware</span>
              </div>
            </div>
            <button className="ai-chat-close-btn" onClick={() => setAiChatOpen(false)} aria-label="Close AI Assistant">×</button>
          </div>

          {/* Body */}
          <div className="ai-chat-body">
            {aiMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="chat-bubble">
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}

                  {/* Render Category Chips if returned by backend tool */}
                  {msg.data && msg.data.categories && msg.data.categories.length > 0 && (
                    <div className="ai-categories-container" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {msg.data.categories.map((cat, cIdx) => (
                        <button
                          key={cIdx}
                          className="ai-category-chip"
                          onClick={() => {
                            setAiInput(`Show products in ${cat.label}`);
                          }}
                          style={{
                            background: '#ffffff',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            borderRadius: '16px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          {cat.label} ({cat.itemsCount || 0})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Product Cards if returned by backend tool */}
                  {msg.data && msg.data.products && msg.data.products.length > 0 && (
                    <div className="ai-products-container" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.data.products.map((prod, pIdx) => (
                        <div 
                          key={pIdx} 
                          className="ai-product-card"
                          style={{
                            display: 'flex',
                            gap: '10px',
                            background: '#ffffff',
                            color: '#1e293b',
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            alignItems: 'center'
                          }}
                        >
                          <img 
                            src={prod.image || 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400'} 
                            alt={prod.title}
                            onLoad={scrollToBottom}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {prod.title}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginTop: '2px' }}>
                              <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{prod.price}</span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.7rem' }}>₹{prod.originalPrice}</span>
                              )}
                              <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#b45309', padding: '1px 4px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                                ★ {prod.rating || 4.5}
                              </span>
                            </div>
                          </div>
                          {onAddToCart && (
                            <button
                              onClick={() => onAddToCart(prod)}
                              style={{
                                background: '#16a34a',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              + Cart
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Services List if returned by backend tool */}
                  {msg.data && msg.data.services && msg.data.services.length > 0 && (
                    <div className="ai-services-container" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.data.services.map((srv, sIdx) => (
                        <div
                          key={sIdx}
                          className="ai-service-card"
                          style={{
                            background: '#ffffff',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{srv.name}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                              {typeof srv.price === 'number' ? `₹${srv.price}` : srv.price}
                            </span>
                          </div>
                          {srv.description && (
                            <span style={{ fontSize: '0.75rem', color: '#475569' }}>{srv.description}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Active Orders if returned by backend tool */}
                  {msg.data && msg.data.orders && msg.data.orders.length > 0 && (
                    <div className="ai-orders-container" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.data.orders.map((ord, oIdx) => (
                        <div
                          key={oIdx}
                          className="ai-order-card"
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a' }}>Order #{ord.orderId || ord._id}</div>
                            <div style={{ fontSize: '0.72rem', color: '#3b82f6' }}>Total: ₹{ord.totalAmount} • Status: {ord.orderStatus || 'Processing'}</div>
                          </div>
                          {onNavigate && (
                            <button
                              onClick={() => onNavigate('orders')}
                              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Track
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message ai">
                <div className="chat-bubble ai-typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginRight: '4px' }}>CampusHub AI is searching</span>
                  <div className="ai-typing-dot"></div>
                  <div className="ai-typing-dot"></div>
                  <div className="ai-typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Form */}
          <form className="ai-chat-footer" onSubmit={handleSend}>
            <input 
              type="text" 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask AI (e.g. Calculators under ₹1500...)" 
              disabled={isTyping}
              aria-label="Ask CampusHub AI Assistant"
            />
            <button type="submit" disabled={isTyping || !aiInput.trim()}>Send</button>
          </form>
        </div>
      ) : (
        <button className="ai-assistant-badge-btn" onClick={() => setAiChatOpen(true)} aria-label="Open AI Assistant">
          <span className="ai-btn-icon-badge">🧠</span>
          <span>Ask AI Assistant</span>
        </button>
      )}
    </div>
  );
}
