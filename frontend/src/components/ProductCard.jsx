import React from 'react';

export default function ProductCard({
  prod,
  isInWish,
  handleToggleWishlist,
  setSelectedProduct,
  handleAddToCart
}) {
  return (
    <div className="product-card" data-id={prod.id}>
      <div className="product-image-container">
        <img src={prod.image} alt={prod.title} onClick={() => setSelectedProduct(prod)} style={{ cursor: 'pointer' }} />
        <button 
          className={`wishlist-toggle ${isInWish ? 'active' : ''}`} 
          onClick={() => handleToggleWishlist(prod.id, prod.title)}
          aria-label="Toggle wishlist"
        >
          <svg width="18" height="18" fill={isInWish ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="product-info">
        <span className="product-cat">{prod.categoryLabel}</span>
        <h3 className="product-title" onClick={() => setSelectedProduct(prod)} style={{ cursor: 'pointer' }}>{prod.title}</h3>
        <div className="product-meta">
          <div className="product-rating">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
            <span>{prod.rating}</span>
          </div>
          <span className="product-reviews">({prod.reviews})</span>
          <span className="product-delivery">{prod.delivery}</span>
        </div>
        <div className="product-footer">
          <div className="product-price">
            ₹{prod.price.toFixed(0)}
            <span className="original">₹{prod.originalPrice.toFixed(0)}</span>
          </div>
          <button className="btn-add-cart" onClick={() => handleAddToCart(prod)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
