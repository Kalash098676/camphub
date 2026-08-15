import React from 'react';

export default function ServicesSection({
  bookingService,
  setBookingService,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  bookingLoc,
  setBookingLoc,
  addToast
}) {
  return (
    <div className="services-hub-container container">
      <div className="services-header">
        <span className="badge badge-primary">🛠 On-Campus Support</span>
        <h2>Book Campus Dorm Services</h2>
        <p>Schedule skilled campus technicians or helpers to fix, clean, or fetch items for your room.</p>
      </div>

      <div className="services-split-booking">
        {/* Grid of bookable services */}
        <div className="services-list-panel">
          {[
            { title: 'Laptop Cleaning & Fan Thermal Paste', price: 799, icon: '💻', desc: 'Internal dust cleaning, motherboard air blowout, and high-performance thermal paste application.' },
            { title: 'Mechanical Keyboard Deep Clean', price: 199, icon: '⌨️', desc: 'Keycaps removal, ultrasonic cleaning, keyboard switch brush, and re-assembly.' },
            { title: 'Dorm Device Setup & OS Install', price: 499, icon: '💿', desc: 'Operating system clean installation, campus Wi-Fi credentials integration, and software setup.' },
            { title: 'Hostel Room Deep Cleaning', price: 299, icon: '🧹', desc: 'Floor vacuuming, table dust wipe down, fan blade cleaner, shelf organization.' },
            { title: 'Water Can Delivery (20L)', price: 50, icon: '💧', desc: 'Refilled cold drinking mineral water can delivered directly inside your room.' },
            { title: 'Outbound Courier Parcel Pickup', price: 99, icon: '📦', desc: 'Campus runner picks up your boxes and submits them to DTDC courier office for dispatch.' },
            { title: 'Inbound Parcel Office Collection', price: 49, icon: '📯', desc: 'Runner collects post/parcel from college central gate office and delivers to your room.' },
            { title: 'Document & Exam Sheet Room Delivery', price: 39, icon: '📄', desc: 'Inter-hostel delivery of exam notes, sheets, lab coats or calculators.' }
          ].map((srv, idx) => (
            <div 
              key={idx} 
              className={`service-selector-card ${bookingService === srv.title ? 'active' : ''}`}
              onClick={() => setBookingService(srv.title)}
            >
              <span className="service-icon">{srv.icon}</span>
              <div className="service-details-text">
                <h4>{srv.title}</h4>
                <p>{srv.desc}</p>
                <strong>₹{srv.price}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Date Time slot scheduler */}
        <div className="services-scheduler-card">
          <h3>Confirm Scheduling</h3>
          <div className="scheduler-box">
            <div className="schedule-row">
              <span>Selected Service:</span>
              <strong>{bookingService}</strong>
            </div>

            <div className="schedule-input-group">
              <label>Select Date</label>
              <input 
                type="date" 
                value={bookingDate} 
                onChange={(e) => setBookingDate(e.target.value)} 
                className="schedule-date-picker"
              />
            </div>

            <div className="schedule-input-group">
              <label>Select Time Slot</label>
              <div className="time-slots-grid">
                {[
                  '08:00 AM - 10:00 AM',
                  '10:00 AM - 12:00 PM',
                  '12:00 PM - 02:00 PM',
                  '02:00 PM - 04:00 PM',
                  '04:00 PM - 06:00 PM'
                ].map(slot => (
                  <button 
                    key={slot} 
                    className={`slot-option-btn ${bookingTime === slot ? 'active' : ''}`}
                    onClick={() => setBookingTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="schedule-input-group">
              <label>Delivery Point / Dorm Floor</label>
              <input 
                type="text" 
                value={bookingLoc}
                onChange={(e) => setBookingLoc(e.target.value)}
                className="schedule-loc-input"
                placeholder="e.g. Hostel Block H-4 Room 302"
              />
            </div>

            <div className="scheduler-footer-total">
              <span>Estimated Total</span>
              <strong>₹{
                bookingService.includes('Laptop') ? 799 : 
                bookingService.includes('Keyboard') ? 199 : 
                bookingService.includes('OS') ? 499 : 
                bookingService.includes('Deep Cleaning') ? 299 :
                bookingService.includes('Water Can') ? 50 : 
                bookingService.includes('Courier') ? 99 : 
                bookingService.includes('Parcel') ? 49 : 39
              }</strong>
            </div>

            <button 
              className="btn btn-primary schedule-confirm-btn"
              onClick={() => {
                addToast(`Booking confirmed for ${bookingService} on ${bookingDate} (${bookingTime})! Check order details in your profile.`);
              }}
            >
              Book Service Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
