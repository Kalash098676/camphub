import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer({
  setSellerOpen,
  setTrackOpen,
  newsletterEmail,
  setNewsletterEmail,
  handleNewsletterSubmit
}) {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="footer-logo" onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo(0,0); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              Campus<span>Hub</span>
            </a>
            <p className="footer-desc">
              CampusHub is hyperlocal campus commerce. Sourcing and delivering student utilities, kits, prints, and products directly to dorm floors in 15 minutes.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="CampusHub Instagram">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="CampusHub Twitter">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="CampusHub LinkedIn">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><a href="/store" onClick={(e) => { e.preventDefault(); navigate('/store'); }}>Shop Products</a></li>
              <li><a href="/services" onClick={(e) => { e.preventDefault(); navigate('/services'); }}>Campus Services</a></li>
              <li><a href="/marketplace" onClick={(e) => { e.preventDefault(); navigate('/marketplace'); }}>Marketplace</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setSellerOpen(true); }}>Become a Seller</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Student Support</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setTrackOpen(true); }}>Track Your Order</a></li>
              <li><a href="#">Help Center & FAQs</a></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Hostel Runners Directory</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Student Code of Conduct</a></li>
              <li><a href="#">Refund & Return Policy</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Get Discount Coupons</h4>
            <p className="newsletter-desc">Subscribe to get weekly flash coupon codes and deal alerts sent straight to your student inbox.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="student@university.edu" 
                required 
                aria-label="Student Email for Newsletter"
              />
              <button type="submit" className="btn-newsletter-submit">Join</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 CampusHub. Built by college students for college students.</p>
          <div className="footer-bottom-links">
            <span>Stripe Verified</span>
            <span>Apple Pay Integrated</span>
            <span>Notion Inspired</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
