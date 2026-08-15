import React from 'react';

export default function ProductDetailModal({
  selectedProduct,
  setSelectedProduct,
  cart,
  handleAddToCart,
  handleUpdateQty,
  handleContactSeller,
  relatedProducts
}) {
  if (!selectedProduct) return null;

  return (
    <div className={`modal-backdrop product-detail-modal-backdrop ${selectedProduct ? 'open' : ''}`} onClick={(e) => { if (e.target.classList.contains('product-detail-modal-backdrop')) setSelectedProduct(null); }}>
      <div className="product-detail-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
        <div className="product-detail-container">
          <div className="product-detail-main">
            {/* Image Section */}
            <div className="product-detail-image-sec">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="product-detail-img" />
              {selectedProduct.tag && <span className="product-detail-tag-badge">{selectedProduct.tag}</span>}
            </div>
            
            {/* Info Section */}
            <div className="product-detail-info-sec">
              <span className="product-detail-category-label">
                {selectedProduct.categoryLabel || (selectedProduct.id.startsWith('market-') ? 'Second-Hand Marketplace' : 'Super Saver Combo')}
              </span>
              <h2 className="product-detail-title">{selectedProduct.title}</h2>
              
              {selectedProduct.conditionLabel && (
                <span className={`market-condition cond-${selectedProduct.condition} product-detail-condition`}>
                  {selectedProduct.conditionLabel}
                </span>
              )}
              
              <div className="product-detail-meta">
                {selectedProduct.rating && (
                  <div className="product-rating">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                    </svg>
                    <span>{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                  </div>
                )}
                <span className="product-detail-delivery-badge">
                  {selectedProduct.delivery || 'Available on Campus'}
                </span>
              </div>

              <div className="product-detail-divider"></div>

              <div className="product-detail-purchase-row">
                <div className="product-detail-price-block">
                  <span className="product-detail-price">₹{selectedProduct.price.toFixed(0)}</span>
                  {selectedProduct.originalPrice && (
                    <span className="product-detail-original-price">₹{selectedProduct.originalPrice.toFixed(0)}</span>
                  )}
                </div>

                <div className="product-detail-action-block">
                  {(() => {
                    const cartItem = cart.find(i => i.id === selectedProduct.id);
                    const qty = cartItem ? cartItem.quantity : 0;
                    if (qty === 0) {
                      return (
                        <button className="btn-blinkit-add" onClick={() => handleAddToCart(selectedProduct, selectedProduct.id.startsWith('combo') ? 'combo' : 'product')}>
                          ADD
                        </button>
                      );
                    } else {
                      return (
                        <div className="blinkit-qty-controls">
                          <button onClick={() => handleUpdateQty(selectedProduct.id, -1)}>−</button>
                          <span>{qty}</span>
                          <button onClick={() => handleUpdateQty(selectedProduct.id, 1)}>+</button>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>

              <div className="product-detail-divider"></div>

              {selectedProduct.desc && (
                <div className="product-detail-desc-sec">
                  <h4>Product Description</h4>
                  <p>{selectedProduct.desc}</p>
                </div>
              )}

              {selectedProduct.items && (
                <div className="product-detail-items-sec">
                  <h4>Combo Items Included:</h4>
                  <ul className="combo-items-list" style={{ marginTop: '0.5rem' }}>
                    {selectedProduct.items.map((item, idx) => (
                      <li key={idx} className="combo-item">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ marginRight: '6px', color: 'var(--success)' }}>
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProduct.seller && (
                <div className="product-detail-seller-card">
                  <div className="market-seller-badge" style={{ position: 'static', marginBottom: '0.75rem' }}>
                    <img src={selectedProduct.sellerImg} alt={selectedProduct.seller} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedProduct.seller}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verified Campus Seller</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-contact-seller" 
                    onClick={() => handleContactSeller(selectedProduct.seller, selectedProduct.title)}
                    style={{ marginTop: '0.5rem', width: '100%' }}
                  >
                    Contact Seller
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          <div className="related-products-section">
            <h3 className="related-products-heading">Related Products</h3>
            <div className="related-products-grid">
              {relatedProducts.map(rel => {
                return (
                  <div key={rel.id} className="related-product-card" onClick={() => setSelectedProduct(rel)}>
                    <div className="related-product-img-box">
                      <img src={rel.image} alt={rel.title} />
                    </div>
                    <div className="related-product-body">
                      <h4 className="related-product-title">{rel.title}</h4>
                      <div className="related-product-footer">
                        <span className="related-product-price">₹{rel.price.toFixed(0)}</span>
                        <button 
                          className="btn-blinkit-add-sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(rel, rel.id.startsWith('combo') ? 'combo' : 'product');
                          }}
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
