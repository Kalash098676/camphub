import React from 'react';

export default function CategoryFilter({ setCategoryFilter }) {
  return (
    <section className="section section-alt" id="categories">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-accent">Quick Browse</span>
          <h2>Shop by Category</h2>
          <p>Find items and gear tailored specifically to student academic and hostel life.</p>
        </div>
        <div className="category-cards-grid">
          {/* Study Essentials */}
          <a href="#featured-products" className="category-card" onClick={() => setCategoryFilter('study')} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_study.png" alt="Study Essentials" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>Study Essentials</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>Notebooks, record sheets, drawing journals, lab equipment, pens.</p>
              <span className="category-card-link">Explore Store</span>
            </div>
          </a>

          {/* Electronics & Accessories */}
          <a href="#featured-products" className="category-card" onClick={() => setCategoryFilter('electronics')} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_electronics.png" alt="Electronics" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>Electronics & Accessories</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>Scientific calculators, charging cables, adapters, ethernet cords.</p>
              <span className="category-card-link">Explore Store</span>
            </div>
          </a>

          {/* Hostel Essentials */}
          <a href="#featured-products" className="category-card" onClick={() => setCategoryFilter('hostel')} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_hostel.png" alt="Hostel Essentials" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>Hostel Essentials</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>Bedsheets, room organizers, table lamps, clip fans, laundry pegs.</p>
              <span className="category-card-link">Explore Store</span>
            </div>
          </a>

          {/* Personal Care */}
          <a href="#featured-products" className="category-card" onClick={() => setCategoryFilter('personal')} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_personal.png" alt="Personal Care" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>Personal Care</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>Hygiene kits, grooming tools, late-night snacks, health drinks.</p>
              <span className="category-card-link">Explore Store</span>
            </div>
          </a>

          {/* Printing & Binding */}
          <a href="#services" className="category-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_printing.png" alt="Printing & Binding" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>Printing & Binding</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>PDF/PPT cloud printing, spiral binding, thesis binding services.</p>
              <span className="category-card-link">Explore Service</span>
            </div>
          </a>

          {/* College Merchandise */}
          <a href="#featured-products" className="category-card" onClick={() => setCategoryFilter('merchandise')} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_merchandise.png" alt="College Merchandise" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>College Merchandise</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>Official college hoodies, smart bottles, keychains, stickers, caps.</p>
              <span className="category-card-link">Explore Store</span>
            </div>
          </a>

          {/* Student Services */}
          <a href="#services" className="category-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_services.png" alt="Student Services" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>Student Services</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>Laptop cleaning, gadget hardware repair, bicycle maintenance.</p>
              <span className="category-card-link">Explore Service</span>
            </div>
          </a>

          {/* Second-Hand Market */}
          <a href="#marketplace" className="category-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <img src="/cat_marketplace.png" alt="Second-Hand Market" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="category-img-hover" />
            </div>
            <div style={{ padding: '1.5rem', width: '100%' }}>
              <h3>Second-Hand Market</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>Buy used reference books, calculators, and gadgets from seniors.</p>
              <span className="category-card-link">Explore Listings</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
