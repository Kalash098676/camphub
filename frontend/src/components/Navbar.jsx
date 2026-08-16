import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

export default function Navbar({
  currentTab,
  setCurrentTab,
  setCategoryFilter,
  searchQuery,
  searchSuggestions,
  showSuggestions,
  setShowSuggestions,
  searchInputRef,
  suggestionsBoxRef,
  handleSearchChange,
  handleSuggestionClick,
  wishlist,
  setWishlistOpen,
  totalCartCount,
  setCartOpen,
  currentUser,
  setLoginOpen,
  setBlinkitSearchQuery
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isAdminAuthenticated = useUserStore((s) => s.isAdminAuthenticated);

  return (
    <header className="navbar-wrapper">
      <div className="container navbar">
        {/* Brand Logo */}
        <a 
          href="/" 
          className="nav-brand" 
          onClick={(e) => { 
            e.preventDefault(); 
            navigate('/'); 
            if (setCurrentTab) setCurrentTab('home'); 
            window.scrollTo(0,0); 
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Campus<span>Hub</span>
        </a>

        {/* Categories Hover Trigger */}
        <div className="category-dropdown">
          <button className="dropdown-trigger">
            <span>Categories</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path>
            </svg>
          </button>
          <div className="dropdown-menu">
            <a href="#featured-products" className="dropdown-item" onClick={() => { navigate('/'); setCategoryFilter('study'); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-16.25v16.25" />
              </svg>
              Study Essentials
            </a>
            <a href="#featured-products" className="dropdown-item" onClick={() => { navigate('/'); setCategoryFilter('electronics'); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
              </svg>
              Electronics & Accessories
            </a>
            <a href="#featured-products" className="dropdown-item" onClick={() => { navigate('/'); setCategoryFilter('hostel'); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Hostel Essentials
            </a>
            <a href="#featured-products" className="dropdown-item" onClick={() => { navigate('/'); setCategoryFilter('personal'); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Personal Care
            </a>
            <a href="/printing" className="dropdown-item" onClick={(e) => { e.preventDefault(); navigate('/printing'); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.567-1.12-1.227L6.34 18m11.318 0h-11.32" />
              </svg>
              Printing & Binding
            </a>
            <a href="#featured-products" className="dropdown-item" onClick={() => { navigate('/'); setCategoryFilter('merchandise'); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 0 0 12 17.75a3 3 0 0 0 2.47-1.628M9.53 16.122a3 3 0 0 1-2.47-1.628m4.94 0a3 3 0 0 0-2.47-1.628m4.94 0A3 3 0 0 0 12 11.25M9.53 16.122V3" />
              </svg>
              College Merchandise
            </a>
            <a href="/marketplace" className="dropdown-item" onClick={(e) => { e.preventDefault(); navigate('/marketplace'); }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              Second-Hand Marketplace
            </a>
          </div>
        </div>

        {/* Search autocomplete field */}
        <div className="nav-search">
          <div className="search-box">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"></path>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSuggestions(false);
                  navigate('/store');
                  if (setCurrentTab) setCurrentTab('dorm_store');
                  setBlinkitSearchQuery(searchQuery);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onFocus={() => { if (searchQuery.trim().length >= 2) setShowSuggestions(true); }}
              placeholder="Search textbooks, calculators, cleanings..."
              autoComplete="off"
            />
          </div>
          
          {showSuggestions && (
            <div className="search-suggestions active" ref={suggestionsBoxRef}>
              {searchSuggestions.length === 0 ? (
                <>
                  <div className="suggestion-section-title">No matches found</div>
                  <div className="suggestion-item">Try searching for 'calculator' or 'laptop cleaning'</div>
                </>
              ) : (
                <>
                  <div className="suggestion-section-title">Suggested Matches</div>
                  <ul className="suggestion-list">
                    {searchSuggestions.map(item => (
                      <li 
                        key={item.id}
                        className="suggestion-item" 
                        onClick={() => {
                          handleSuggestionClick(item);
                          navigate('/store');
                        }}
                      >
                        <span style={{ marginRight: '6px' }}>
                          {item.price && item.unit ? '📄' : '📦'}
                        </span>
                        <strong>{item.title}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button className={`nav-link-btn ${currentPath === '/store' || currentTab === 'dorm_store' ? 'active' : ''}`} onClick={() => { navigate('/store'); if(setCurrentTab) setCurrentTab('dorm_store'); setBlinkitSearchQuery(''); }}>Store</button>
          <button className={`nav-link-btn ${currentPath === '/printing' || currentTab === 'printing' ? 'active' : ''}`} onClick={() => { navigate('/printing'); if(setCurrentTab) setCurrentTab('printing'); }}>Print</button>
          <button className={`nav-link-btn ${currentPath === '/marketplace' || currentTab === 'marketplace' ? 'active' : ''}`} onClick={() => { navigate('/marketplace'); if(setCurrentTab) setCurrentTab('marketplace'); }}>Market</button>
          <button className={`nav-link-btn ${currentPath === '/services' || currentTab === 'services' ? 'active' : ''}`} onClick={() => { navigate('/services'); if(setCurrentTab) setCurrentTab('services'); }}>Services</button>
          <button className={`nav-link-btn ${currentPath === '/combos' || currentTab === 'combos' ? 'active' : ''}`} onClick={() => { navigate('/combos'); if(setCurrentTab) setCurrentTab('combos'); }}>Combos</button>
          <button className={`nav-link-btn ${currentPath === '/profile' || currentTab === 'profile' ? 'active' : ''}`} onClick={() => {
            if (!currentUser) {
              if (setLoginOpen) setLoginOpen(true);
            } else {
              navigate('/profile'); 
              if(setCurrentTab) setCurrentTab('profile');
            }
          }}>Profile</button>
          {/* Admin tab hidden once a regular customer is logged in */}
          {!currentUser && (
            <button className={`nav-link-btn ${currentPath === '/admin' || currentTab === 'admin_dashboard' ? 'active' : ''}`} onClick={() => { navigate('/admin'); if(setCurrentTab) setCurrentTab('admin_dashboard'); }}>Admin</button>
          )}
        </nav>

        {/* Action Counters */}
        <div className="nav-actions">
          {/* Wishlist */}
          <button className="icon-btn" onClick={() => setWishlistOpen(true)} aria-label="Wishlist items count">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"></path>
            </svg>
            {currentUser && wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
          </button>

          {/* Cart Trigger */}
          <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart bag items count">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z"></path>
            </svg>
            {currentUser && totalCartCount > 0 && <span className="icon-badge">{totalCartCount}</span>}
          </button>

          {/* User State */}
          {currentUser ? (
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
              onClick={() => { navigate('/profile'); if(setCurrentTab) setCurrentTab('profile'); }}
              title="Go to Profile"
            >
              <img 
                src={(currentUser.avatar && !currentUser.avatar.includes('unsplash')) 
                  ? currentUser.avatar 
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name || 'student')}`} 
                alt="cartoon bitmoji avatar" 
                style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--primary)', backgroundColor: '#f0f4ff', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.name}</span>
            </div>
          ) : isAdminAuthenticated ? null : (
            // Login button hidden while an admin session is active
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => setLoginOpen(true)}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
