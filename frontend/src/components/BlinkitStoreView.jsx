import React from 'react';

export default function BlinkitStoreView({
  RAW_CATALOG,
  CATALOG_PRODUCTS,
  productsList,
  activeCategory,
  setActiveCategory,
  blinkitSearchQuery,
  setBlinkitSearchQuery,
  studentBlock,
  studentRoom,
  cart,
  setSelectedProduct,
  handleAddToCart,
  handleUpdateQty
}) {
  const allProducts = (productsList && productsList.length > 0) ? productsList : CATALOG_PRODUCTS;

  return (
    <div className="blinkit-store-container">
      {/* Header Bar */}
      <div className="blinkit-store-header-bar">
        <div className="blinkit-search-wrapper">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"></path>
          </svg>
          <input 
            type="text" 
            value={blinkitSearchQuery}
            onChange={(e) => setBlinkitSearchQuery(e.target.value)}
            placeholder="Search notebooks, SSDs, mattress protectors, face wash..."
          />
          {blinkitSearchQuery && (
            <button className="clear-search-btn" onClick={() => setBlinkitSearchQuery('')}>×</button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="blinkit-delivery-time">⏱ Deliver to Block {studentBlock} Room {studentRoom}</span>
        </div>
      </div>

      {/* Smart Search Tag suggestions */}
      <div className="smart-search-tags">
        <span className="smart-search-label">Try searching:</span>
        <button className="search-tag-btn" onClick={() => setBlinkitSearchQuery('Exam Kit')}>"Exam Kit"</button>
        <button className="search-tag-btn" onClick={() => setBlinkitSearchQuery('Hostel Essentials')}>"Hostel Essentials"</button>
        <button className="search-tag-btn" onClick={() => setBlinkitSearchQuery('Under 500')}>"Under ₹500"</button>
        <button className="search-tag-btn" onClick={() => setBlinkitSearchQuery('Laptop Accessories')}>"Laptop Accessories"</button>
      </div>

      {/* Promo Banner */}
      <div className="blinkit-promo-banner">
        <div className="promo-text">
          <span className="badge badge-accent">Semester Opening Discount</span>
          <h3>Flat 10% Off on Dorm Setup Kits</h3>
          <p>UPI payments accepted. Delivery directly to your dorm room floor in 15 mins!</p>
        </div>
        <div className="promo-bg-badge">10% OFF</div>
      </div>

      {/* Main Split Layout */}
      <div className="blinkit-store-layout">
        {/* Left Sidebar */}
        <div className="blinkit-sidebar">
          {Object.entries(RAW_CATALOG)
            .filter(([key]) => ['study', 'electronics', 'hostel', 'personal', 'clothing', 'kitchen'].includes(key))
            .map(([key, value]) => (
              <button 
                key={key}
                className={`blinkit-sidebar-item ${activeCategory === key ? 'active' : ''}`}
                onClick={() => { setActiveCategory(key); setBlinkitSearchQuery(''); }}
              >
                <span className="sidebar-emoji">{value.label.split(' ')[0]}</span>
                <span className="sidebar-text">{value.label.split(' ').slice(1).join(' ')}</span>
              </button>
          ))}
        </div>

        {/* Right Product Grid */}
        <div className="blinkit-catalog-panel">
          <h2 className="catalog-category-title">
            {RAW_CATALOG[activeCategory]?.label || 'Store Essentials'} 
            {blinkitSearchQuery && <span className="search-results-label"> / Search results for "{blinkitSearchQuery}"</span>}
          </h2>
          
          <div className="blinkit-catalog-grid">
            {(() => {
              let items = allProducts.filter(p => p.category === activeCategory);
              
              if (blinkitSearchQuery) {
                const query = blinkitSearchQuery.toLowerCase().trim();
                
                if (query === 'under 500' || query === 'under ₹500') {
                  items = allProducts.filter(p => p.price < 500);
                } else if (query === 'laptop accessories') {
                  items = allProducts.filter(p => p.category === 'electronics' && (p.title.toLowerCase().includes('laptop') || p.title.toLowerCase().includes('mouse') || p.title.toLowerCase().includes('keyboard') || p.title.toLowerCase().includes('stand') || p.title.toLowerCase().includes('pad')));
                } else if (query === 'hostel essentials') {
                  items = allProducts.filter(p => p.category === 'hostel');
                } else if (query === 'exam kit') {
                  items = allProducts.filter(p => p.title.toLowerCase().includes('exam') || p.category === 'study');
                } else {
                  items = allProducts.filter(p => p.title.toLowerCase().includes(query) || (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query)) || (p.desc && p.desc.toLowerCase().includes(query)));
                }
              }


              if (items.length === 0) {
                return (
                  <div className="empty-catalog-state">
                    <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
                    </svg>
                    <p>No products found matching your filter</p>
                    <span>Try searching for something else or browse categories</span>
                  </div>
                );
              }

              return items.map(prod => {
                const cartItem = cart.find(i => i.id === prod.id);
                const qty = cartItem ? cartItem.quantity : 0;
                return (
                  <div key={prod.id} className="blinkit-product-card" onClick={() => setSelectedProduct(prod)}>
                    <div className="blinkit-product-img-box">
                      <img src={prod.image} alt={prod.title} />
                      {prod.originalPrice && prod.price < prod.originalPrice && (
                        <span className="blinkit-disc-badge">
                          {((1 - prod.price / prod.originalPrice) * 100).toFixed(0)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="blinkit-product-details">
                      <span className="blinkit-delivery-time">⏱ {prod.delivery}</span>
                      <h4 className="blinkit-product-title">{prod.title}</h4>
                      <p className="blinkit-product-desc-short">{prod.desc}</p>
                      <div className="blinkit-product-footer">
                        <div className="blinkit-price-block">
                          <span className="price">₹{prod.price}</span>
                          {prod.originalPrice && <span className="original">₹{prod.originalPrice}</span>}
                        </div>
                        <div className="blinkit-add-action-box" onClick={(e) => e.stopPropagation()}>
                          {qty === 0 ? (
                            <button className="btn-blinkit-add-sm" onClick={() => handleAddToCart(prod, 'product')}>
                              ADD
                            </button>
                          ) : (
                            <div className="blinkit-qty-controls-sm">
                              <button onClick={() => handleUpdateQty(prod.id, -1)}>−</button>
                              <span>{qty}</span>
                              <button onClick={() => handleUpdateQty(prod.id, 1)}>+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
