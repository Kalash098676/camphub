import React from 'react';

export default function TrackOrderModal({
  trackOpen,
  setTrackOpen,
  trackInput,
  setTrackInput,
  trackStatusResult,
  setTrackStatusResult,
  handleTrackLookup
}) {
  return (
    <div className={`modal-backdrop ${trackOpen ? 'open' : ''}`}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={() => { setTrackOpen(false); setTrackStatusResult(null); setTrackInput(''); }}>×</button>
        <div className="modal-header">
          <h3>Track Campus Order</h3>
          <p>Enter your CampusHub order number below to check progress</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            className="modal-input" 
            placeholder="Order ID (e.g. CH-12345)" 
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value)}
            style={{ margin: 0 }} 
          />
          <button className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }} onClick={handleTrackLookup}>Track</button>
        </div>

        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {trackStatusResult === null ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '1.5rem 0' }}>
              Lookup "<strong>CH-12345</strong>" to test the live tracking animation flow!
            </p>
          ) : trackStatusResult.error ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: '0.75rem', color: '#ef4444', marginLeft: 'auto', marginRight: 'auto' }}>
                <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"></path>
              </svg>
              <h4>Order ID not found</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try looking up "CH-12345" for a mock active delivery demonstration.</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  <span>Order #{trackStatusResult.orderId}</span>
                  <span>Est. Delivery: {trackStatusResult.estTime}</span>
                </div>
              </div>
              {trackStatusResult.steps.map((step, idx) => (
                <div key={idx} className={`track-step ${step.status}`}>
                  <div className="track-icon">
                    {step.status === 'completed' ? '✓' : step.status === 'active' ? '🚚' : '•'}
                  </div>
                  <div className="track-details">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                    <span>{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
