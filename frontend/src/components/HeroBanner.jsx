import React from 'react';

export default function HeroBanner({
  HERO_SLIDES,
  currentSlide,
  isTransitioning,
  handleTransitionEnd,
  setCategoryFilter
}) {
  return (
    <section className="hero-section" id="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-tagline"></div>
          <h1 className="hero-title">Everything You Need On Campus. <span>Delivered Fast.</span></h1>
          <p className="hero-desc">
            CampusHub brings stationery, electronics, hostel kits, and student services straight to your dorm room floor in minutes. Sourced from verified sellers right on campus.
          </p>
          <div className="hero-ctas">
            <a href="#featured-products" className="btn btn-primary" onClick={() => setCategoryFilter('all')}>Shop Products</a>
            <a href="#services" className="btn btn-secondary">Explore Services</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15 Mins</span>
              <span className="stat-label">Average Delivery</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Student Rating</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2,500+</span>
              <span className="stat-label">Campus Orders</span>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '1.4', overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)' }}>
          <div 
            onTransitionEnd={handleTransitionEnd}
            style={{
              display: 'flex',
              width: `${HERO_SLIDES.length * 100}%`,
              height: '100%',
              transform: `translateX(-${(currentSlide * 100) / HERO_SLIDES.length}%)`,
              transition: isTransitioning ? 'transform 0.8s ease-in-out' : 'none'
            }}
          >
            {HERO_SLIDES.map((slide, idx) => (
              <img
                key={idx}
                src={slide}
                alt={`Campus Hub Student Life Slide ${idx + 1}`}
                style={{
                  width: `${100 / HERO_SLIDES.length}%`,
                  height: '100%',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
