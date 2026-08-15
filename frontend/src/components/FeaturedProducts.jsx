import React from 'react';
import ProductCard from './ProductCard';

export default function FeaturedProducts({
  categoryFilter,
  setCategoryFilter,
  PRODUCTS,
  wishlist,
  handleToggleWishlist,
  setSelectedProduct,
  handleAddToCart
}) {
  return (
    <section className="section section-alt" id="featured-products">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-accent">Daily Picks</span>
          <h2>Featured Campus Products</h2>
          <p>Curated list of premium and high-demand student gear available in campus storage.</p>
        </div>

        {/* Filter Tabs */}
        <div className="product-filters">
          <button className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>All Items</button>
          <button className={`filter-btn ${categoryFilter === 'study' ? 'active' : ''}`} onClick={() => setCategoryFilter('study')}>Study Essentials</button>
          <button className={`filter-btn ${categoryFilter === 'electronics' ? 'active' : ''}`} onClick={() => setCategoryFilter('electronics')}>Electronics</button>
          <button className={`filter-btn ${categoryFilter === 'hostel' ? 'active' : ''}`} onClick={() => setCategoryFilter('hostel')}>Hostel Essentials</button>
          <button className={`filter-btn ${categoryFilter === 'merchandise' ? 'active' : ''}`} onClick={() => setCategoryFilter('merchandise')}>Official Merch</button>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {PRODUCTS.filter(p => categoryFilter === 'all' || p.category === categoryFilter).map(prod => {
            const isInWish = wishlist.includes(prod.id);
            return (
              <ProductCard
                key={prod.id}
                prod={prod}
                isInWish={isInWish}
                handleToggleWishlist={handleToggleWishlist}
                setSelectedProduct={setSelectedProduct}
                handleAddToCart={handleAddToCart}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
