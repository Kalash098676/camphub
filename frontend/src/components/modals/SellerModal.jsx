import React from 'react';

export default function SellerModal({
  sellerOpen,
  setSellerOpen,
  sellerName,
  setSellerName,
  sellerDept,
  setSellerDept,
  sellerItem,
  setSellerItem,
  sellerPrice,
  setSellerPrice,
  sellerCondition,
  setSellerCondition,
  sellerDesc,
  setSellerDesc,
  handleSellerSubmit
}) {
  return (
    <div className={`modal-backdrop ${sellerOpen ? 'open' : ''}`}>
      <div className="modal-content" role="dialog" aria-modal="true" style={{ maxWidth: '520px' }}>
        <button className="modal-close" onClick={() => setSellerOpen(false)}>×</button>
        <div className="modal-header">
          <h3>List on CampusHub</h3>
          <p>Sell reference books, calculators, and tools directly to peers.</p>
        </div>
        <form onSubmit={handleSellerSubmit}>
          <div className="modal-form-group">
            <label>Your Full Name</label>
            <input 
              type="text" 
              className="modal-input" 
              placeholder="Rajesh Kumar" 
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              required 
            />
          </div>
          <div className="modal-form-group">
            <label>Major / Department & Year</label>
            <input 
              type="text" 
              className="modal-input" 
              placeholder="EE, Sophomore" 
              value={sellerDept}
              onChange={(e) => setSellerDept(e.target.value)}
              required 
            />
          </div>
          <div className="modal-form-group">
            <label>Item Name / Title</label>
            <input 
              type="text" 
              className="modal-input" 
              placeholder="Casio FX-991EX Scientific Calculator" 
              value={sellerItem}
              onChange={(e) => setSellerItem(e.target.value)}
              required 
            />
          </div>
          <div className="modal-form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem' }}>
            <div>
              <label>Price (₹)</label>
              <input 
                type="number" 
                className="modal-input" 
                placeholder="15.00" 
                step="0.01" 
                value={sellerPrice}
                onChange={(e) => setSellerPrice(e.target.value)}
                required 
              />
            </div>
            <div>
              <label>Condition</label>
              <select 
                className="modal-input" 
                style={{ height: '43px', display: 'block' }} 
                value={sellerCondition}
                onChange={(e) => setSellerCondition(e.target.value)}
                required
              >
                <option value="excellent">Like New (Excellent)</option>
                <option value="good">Good (Used)</option>
                <option value="fair">Fair (Decent)</option>
              </select>
            </div>
          </div>
          <div className="modal-form-group">
            <label>Item Description</label>
            <textarea 
              className="modal-input" 
              rows="3" 
              placeholder="Explain highlights, markings, chargers included..." 
              style={{ resize: 'none' }} 
              value={sellerDesc}
              onChange={(e) => setSellerDesc(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary modal-btn-submit">List Item Now</button>
        </form>
      </div>
    </div>
  );
}
