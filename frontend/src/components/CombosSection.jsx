import React from 'react';

export default function CombosSection({ COMBOS, setSelectedProduct, handleAddToCart }) {
  return (
    <section className="section" id="combos">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-primary">Super Savers</span>
          <h2>Student Bundle Combo Packs</h2>
          <p>Carefully curated kit bundles containing everything you need for specific campus phases. Saves time and money.</p>
        </div>
        <div className="combo-grid">
          {COMBOS.map(combo => (
            <div key={combo.id} className="combo-card">
              <div className="combo-image-box">
                <img src={combo.image} alt={combo.title} onClick={() => setSelectedProduct(combo)} style={{ cursor: 'pointer' }} />
                <span className="combo-tag">{combo.tag}</span>
              </div>
              <div className="combo-body">
                <h3 onClick={() => setSelectedProduct(combo)} style={{ cursor: 'pointer' }}>{combo.title}</h3>
                <p>{combo.desc}</p>
                <ul className="combo-items-list">
                  {combo.items.map((item, idx) => (
                    <li key={idx} className="combo-item">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ marginRight: '6px', color: 'var(--success)' }}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="combo-footer">
                  <div className="combo-price-block">
                    <span className="discount">Save {(100 - (combo.price / combo.originalPrice * 100)).toFixed(0)}%</span>
                    <div className="price">₹{combo.price.toFixed(0)} <span>₹{combo.originalPrice.toFixed(0)}</span></div>
                  </div>
                  <button className="btn btn-primary btn-combo-add" onClick={() => handleAddToCart(combo, 'combo')}>Add Bundle</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
