import React from 'react';

export default function MarketplaceSection({
  MARKETPLACE,
  setSellerOpen,
  setSelectedProduct,
  handleContactSeller
}) {
  return (
    <section className="section" id="marketplace">
      <div className="container">
        <div className="marketplace-header">
          <div className="marketplace-header-text">
            <span className="badge badge-primary">Peer-to-Peer</span>
            <h2>Seniors to Juniors Marketplace</h2>
            <p>Buy directly from seniors graduation batches or clear out your own room. Direct campus exchange, cash or UPI.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setSellerOpen(true)}>List Your Item</button>
        </div>
        <div className="marketplace-grid">
          {MARKETPLACE.map(item => (
            <div key={item.id} className="marketplace-card">
              <div className="market-image-container">
                <img src={item.image} alt={item.title} onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer' }} />
                <span className="market-tag">{item.tag}</span>
                <div className="market-seller-badge">
                  <img src={item.sellerImg} alt={item.seller} />
                  <span>{item.seller}</span>
                </div>
              </div>
              <div className="market-info">
                <h3 className="market-title" onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer' }}>{item.title}</h3>
                <span className={`market-condition cond-${item.condition}`}>{item.conditionLabel}</span>
                <p className="market-desc">{item.desc}</p>
                <div className="market-footer">
                  <span className="market-price">₹{item.price.toFixed(0)}</span>
                  <button 
                    className="btn btn-secondary btn-contact-seller" 
                    onClick={() => handleContactSeller(item.seller, item.title)}
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
