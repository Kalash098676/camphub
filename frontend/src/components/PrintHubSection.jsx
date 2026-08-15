import React from 'react';

export default function PrintHubSection({
  handlePrintFileChange,
  printFile,
  setPrintFile,
  printPages,
  setPrintPages,
  printColor,
  setPrintColor,
  printBinding,
  setPrintBinding,
  printLamination,
  setPrintLamination,
  studentBlock,
  studentRoom,
  addToast
}) {
  return (
    <div className="printing-hub-container container">
      <div className="printing-header">
        <span className="badge badge-primary">🖨 Academic Printing</span>
        <h2>Cloud Printing & Academic Services</h2>
        <p>Upload your assignments, records, or slides and have them spiral bound and delivered directly to your desk.</p>
      </div>

      <div className="printing-grid">
        {/* Upload & Configure panel */}
        <div className="printing-config-card">
          <h3>Configure Print Job</h3>
          
          <div className="print-form-group">
            <label>Upload Document (PDF, DOCX)</label>
            <input 
              type="file" 
              id="print-file-input" 
              style={{ display: 'none' }} 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
              onChange={handlePrintFileChange} 
            />
            <div className="print-file-upload-box" onClick={() => document.getElementById('print-file-input').click()}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              {printFile ? (
                <span className="upload-success-text">✓ {printFile} uploaded</span>
              ) : (
                <span>Click to upload file from device</span>
              )}
            </div>
          </div>

          <div className="print-form-group">
            <label>Page Count</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="range" 
                min="1" 
                max="150" 
                value={printPages} 
                onChange={(e) => setPrintPages(parseInt(e.target.value))} 
                style={{ flex: 1, accentColor: 'var(--primary)' }}
              />
              <input 
                type="number" 
                value={printPages}
                onChange={(e) => setPrintPages(parseInt(e.target.value) || 1)}
                className="print-page-num-input"
              />
            </div>
          </div>

          <div className="print-form-group">
            <label>Color Options</label>
            <div className="print-radio-group">
              <label className={`print-radio-card ${printColor === 'bw' ? 'active' : ''}`}>
                <input type="radio" name="printColor" checked={printColor === 'bw'} onChange={() => setPrintColor('bw')} style={{ display: 'none' }} />
                <span>Black & White</span>
                <span className="price-tag">₹2.00 / page</span>
              </label>
              <label className={`print-radio-card ${printColor === 'color' ? 'active' : ''}`}>
                <input type="radio" name="printColor" checked={printColor === 'color'} onChange={() => setPrintColor('color')} style={{ display: 'none' }} />
                <span>Colour Print</span>
                <span className="price-tag">₹10.00 / page</span>
              </label>
            </div>
          </div>

          <div className="print-form-group">
            <label>Binding Style</label>
            <div className="print-radio-group">
              <label className={`print-radio-card ${printBinding === 'none' ? 'active' : ''}`}>
                <input type="radio" name="printBinding" checked={printBinding === 'none'} onChange={() => setPrintBinding('none')} style={{ display: 'none' }} />
                <span>No Binding</span>
                <span className="price-tag">₹0</span>
              </label>
              <label className={`print-radio-card ${printBinding === 'spiral' ? 'active' : ''}`}>
                <input type="radio" name="printBinding" checked={printBinding === 'spiral'} onChange={() => setPrintBinding('spiral')} style={{ display: 'none' }} />
                <span>Spiral Binding</span>
                <span className="price-tag">+₹49</span>
              </label>
              <label className={`print-radio-card ${printBinding === 'project' ? 'active' : ''}`}>
                <input type="radio" name="printBinding" checked={printBinding === 'project'} onChange={() => setPrintBinding('project')} style={{ display: 'none' }} />
                <span>Project Binding</span>
                <span className="price-tag">+₹199</span>
              </label>
            </div>
          </div>

          <div className="print-form-group" style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="lamination" 
              checked={printLamination} 
              onChange={(e) => setPrintLamination(e.target.checked)} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="lamination" style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
              Add Transparent Sheet Lamination (+₹30)
            </label>
          </div>
        </div>

        {/* Print Summary Invoice panel */}
        <div className="printing-invoice-card">
          <h3>Order Cost Summary</h3>
          <div className="print-invoice-breakdown">
            <div className="invoice-row">
              <span>{printPages} pages ({printColor === 'bw' ? 'B&W' : 'Color'})</span>
              <strong>₹{printPages * (printColor === 'bw' ? 2 : 10)}</strong>
            </div>
            <div className="invoice-row">
              <span>Binding Type ({printBinding})</span>
              <strong>₹{printBinding === 'spiral' ? 49 : printBinding === 'project' ? 199 : 0}</strong>
            </div>
            <div className="invoice-row">
              <span>Lamination sheet</span>
              <strong>₹{printLamination ? 30 : 0}</strong>
            </div>
            <div className="invoice-row">
              <span>Hyperlocal Student Runner fee</span>
              <strong>₹15</strong>
            </div>
            <div className="invoice-row total-row">
              <span>Grand Total</span>
              <strong>₹{(printPages * (printColor === 'bw' ? 2 : 10)) + (printBinding === 'spiral' ? 49 : printBinding === 'project' ? 199 : 0) + (printLamination ? 30 : 0) + 15}</strong>
            </div>
          </div>

          <div className="print-delivery-block">
            <h4>Select Pickup/Delivery Point</h4>
            <div className="print-delivery-grid">
              <button className="del-btn-option active">📍 Hostel Room ({studentBlock}-{studentRoom})</button>
              <button className="del-btn-option" onClick={() => addToast('Selected Classroom Delivery option')}>🏫 Classroom Block</button>
              <button className="del-btn-option" onClick={() => addToast('Selected Library Desk pickup option')}>📚 Central Library Desk</button>
              <button className="del-btn-option" onClick={() => addToast('Selected Gate Pickup option')}>🚧 Campus Gate</button>
            </div>
          </div>

          <button 
            className="btn btn-primary print-submit-btn"
            onClick={() => {
              if (!printFile) {
                addToast('Please upload a document PDF first', true);
                return;
              }
              addToast(`Order submitted! Your files will print and deliver to Block ${studentBlock} room ${studentRoom} in 25 mins.`);
              setPrintFile(null);
            }}
          >
            Send Document to Print
          </button>
        </div>
      </div>
    </div>
  );
}
