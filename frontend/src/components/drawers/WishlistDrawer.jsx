import React from 'react';

export default function WishlistDrawer({
  wishlistOpen,
  setWishlistOpen,
  wishlist,
  setWishlist,
  PRODUCTS,
  COMBOS,
  MARKETPLACE,
  handleAddToCart,
  handleToggleWishlist
}) {
  return (
    <div className={`cart-drawer-backdrop ${wishlistOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('cart-drawer-backdrop')) setWishlistOpen(false); }}>
      <div className="cart-drawer" role="dialog" aria-modal="true">
        <div className="cart-drawer-header" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <svg width="20" height="20" fill="currentColor" style={{ color: 'var(--accent)' }} viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            Your Wishlist
          </h3>
          <button className="cart-drawer-close" onClick={() => setWishlistOpen(false)}>×</button>
        </div>
        
        <div className="cart-items-container">
          {wishlist.length === 0 ? (
            <div className="empty-cart-message">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"></path>
              </svg>
              <p>Your wishlist is empty</p>
              <span>Heart items across the store to save them here</span>
            </div>
          ) : (
            wishlist.map(itemId => {
              const item = PRODUCTS.find(p => p.id === itemId) || COMBOS.find(c => c.id === itemId) || MARKETPLACE.find(m => m.id === itemId);
              if (!item) return null;
              return (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-details">
                    <div>
                      <h4 className="cart-item-title">{item.title}</h4>
                    </div>
                    <div className="cart-item-price-row" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span className="cart-item-price" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{item.price.toFixed(0)}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
                          onClick={() => {
                            handleAddToCart(item, item.id.startsWith('combo') ? 'combo' : 'product');
                            setWishlist(prev => prev.filter(id => id !== item.id));
                          }}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="cart-item-remove" 
                          style={{ fontSize: '0.75rem', color: '#ef4444' }} 
                          onClick={() => handleToggleWishlist(item.id, item.title)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
