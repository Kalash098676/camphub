import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useOrderStore } from '../store/useOrderStore';

export default function StudentProfileSection({
  addToast,
  setLoginOpen
}) {
  const {
    currentUser,
    logout,
    profileAddresses,
    addAddress,
    fetchAddresses,
    fetchUserProfile,
    updateProfile,
    walletBalance: storeWallet
  } = useUserStore();

  const { orders: storeOrders, fetchUserOrders } = useOrderStore();

  const [studentBlock, setStudentBlock] = useState(currentUser?.hostelBlock || currentUser?.block || 'H-3 (Boys Hostel)');
  const [studentRoom, setStudentRoom] = useState(currentUser?.roomNo || currentUser?.room || '304-B');
  const [studentDept, setStudentDept] = useState(currentUser?.department || currentUser?.dept || 'Computer Science & Engineering');
  const [studentSem, setStudentSem] = useState(currentUser?.semester || currentUser?.sem || 'Semester 5 (Junior)');
  const [newProfileAddress, setNewProfileAddress] = useState('');

  useEffect(() => {
    if (!currentUser && setLoginOpen) {
      setLoginOpen(true);
    } else if (currentUser) {
      fetchUserProfile();
      fetchAddresses();
      fetchUserOrders();
    }
  }, [currentUser, setLoginOpen, fetchUserProfile, fetchAddresses, fetchUserOrders]);

  useEffect(() => {
    if (currentUser) {
      setStudentBlock(currentUser.hostelBlock || currentUser.block || 'H-3 (Boys Hostel)');
      setStudentRoom(currentUser.roomNo || currentUser.room || '304-B');
      setStudentDept(currentUser.department || currentUser.dept || 'Computer Science & Engineering');
      setStudentSem(currentUser.semester || currentUser.sem || 'Semester 5 (Junior)');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="student-profile-container container" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Login Required</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Please sign in to access your student profile, wallet balance, saved hostel addresses, and campus orders.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', fontWeight: 600, fontSize: '0.95rem' }}
            onClick={() => setLoginOpen && setLoginOpen(true)}
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const walletDisplay = currentUser?.walletBalance !== undefined ? currentUser.walletBalance : (storeWallet || 1450);

  const handleSavePreferences = async () => {
    await updateProfile({
      hostelBlock: studentBlock,
      roomNo: studentRoom,
      department: studentDept,
      semester: studentSem
    });
    if (addToast) addToast('Profile settings saved successfully!');
  };

  return (
    <div className="student-profile-container container">
      <div className="profile-wrapper-split">
        {/* Left sidebar card */}
        <div className="profile-details-card">
          <div className="profile-avatar-block">
            <img 
              src={(currentUser?.avatar && !currentUser.avatar.includes('unsplash')) 
                ? currentUser.avatar 
                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser?.name || 'student')}`} 
              alt="User avatar" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid var(--primary)', backgroundColor: '#f0f4ff', objectFit: 'cover', padding: '4px' }}
            />
            <span className="verified-student-badge">✓ Verified Student ID</span>
            <h3>{currentUser?.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{currentUser?.email}</p>
            <p style={{ marginTop: '4px', fontSize: '0.85rem', fontWeight: 500 }}>{studentDept} • {studentSem}</p>
            <button className="btn btn-secondary" onClick={() => {
              logout();
              if (addToast) addToast('Logged out successfully');
            }} style={{marginTop: '0.75rem', width: '100%'}}>
              Logout
            </button>
          </div>

          {/* Info Preferences forms */}
          <div className="profile-pref-form">
            <h4>Preference Setup</h4>
            
            <div className="pref-row">
              <div className="pref-group">
                <label>Hostel Block</label>
                <select value={studentBlock} onChange={(e) => setStudentBlock(e.target.value)}>
                  <option value="H-1 (Girls Hostel)">H-1 (Girls Hostel)</option>
                  <option value="H-2 (Girls Hostel)">H-2 (Girls Hostel)</option>
                  <option value="H-3 (Boys Hostel)">H-3 (Boys Hostel)</option>
                  <option value="H-4 (Boys Hostel)">H-4 (Boys Hostel)</option>
                  <option value="PG-1 Block">PG-1 Block</option>
                </select>
              </div>
              <div className="pref-group">
                <label>Room Number</label>
                <input type="text" value={studentRoom} onChange={(e) => setStudentRoom(e.target.value)} placeholder="304-B" />
              </div>
            </div>

            <div className="pref-group">
              <label>Department Selection</label>
              <select value={studentDept} onChange={(e) => setStudentDept(e.target.value)}>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Bio-Technology">Bio-Technology</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>

            <div className="pref-group">
              <label>Semester Selection</label>
              <select value={studentSem} onChange={(e) => setStudentSem(e.target.value)}>
                <option value="Semester 1 (Freshman)">Semester 1 (Freshman)</option>
                <option value="Semester 3 (Sophomore)">Semester 3 (Sophomore)</option>
                <option value="Semester 5 (Junior)">Semester 5 (Junior)</option>
                <option value="Semester 7 (Senior)">Semester 7 (Senior)</option>
              </select>
            </div>

            <button 
              className="btn btn-primary save-pref-btn" 
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Right sidebar profile content */}
        <div className="profile-content-panel">
          {/* Wallet and balances */}
          <div className="profile-points-box">
            <div className="points-info-text">
              <h3>CampusHub Student Wallet Balance</h3>
              <p>Use student wallet points for one-tap payments on services & prints.</p>
            </div>
            <div className="points-display">
              <strong>₹{walletDisplay}</strong>
              <span>Campus Wallet</span>
            </div>
          </div>

          {/* Saved Dorm Addresses */}
          <div className="profile-saved-addresses">
            <h4>Saved Delivery Locations</h4>
            <div className="addresses-list-deck">
              {(profileAddresses && profileAddresses.length > 0) ? (
                profileAddresses.map((addr, idx) => (
                  <div key={idx} className="address-card-row">
                    <span>📍 {addr}</span>
                  </div>
                ))
              ) : (
                <div className="address-card-row">
                  <span>📍 {studentBlock}, Room {studentRoom}</span>
                </div>
              )}
            </div>
            <div className="add-address-row">
              <input 
                type="text" 
                placeholder="Add custom dorm delivery spot (e.g. Library Desk 12)..." 
                value={newProfileAddress}
                onChange={(e) => setNewProfileAddress(e.target.value)}
              />
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  if (!newProfileAddress.trim()) return;
                  addAddress(newProfileAddress.trim());
                  setNewProfileAddress('');
                  if (addToast) addToast('New delivery point saved!');
                }}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="profile-order-history">
            <h4>Your Campus Orders</h4>
            {(!storeOrders || storeOrders.length === 0) ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No past orders found. Place your first order to see it live! 🛍️
              </div>
            ) : (
              <table className="profile-orders-table-custom">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Total Cost</th>
                    <th>Delivery Location</th>
                    <th>Delivery Status</th>
                  </tr>
                </thead>
                <tbody>
                  {storeOrders.map((o) => {
                    const orderId = (o._id ? `#${o._id.slice(-6).toUpperCase()}` : o.id || '#CH-83920');
                    const orderDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (o.date || 'Today');
                    const orderTotal = o.totalAmount || o.total || 0;
                    const orderLoc = o.shippingAddress?.hostel 
                      ? `${o.shippingAddress.hostel}, Room ${o.shippingAddress.roomNumber || ''}`
                      : (o.hostelBlock ? `${o.hostelBlock}, Room ${o.roomNo}` : (o.location || 'Hostel Block'));
                    const statusText = o.orderStatus || o.status || 'Ordered';
                    const statusClass = statusText.toLowerCase().includes('deliver') ? 'completed' : statusText.toLowerCase().includes('out') ? 'shipping' : 'pending';

                    return (
                      <tr key={o._id || o.id}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{orderId}</td>
                        <td>{orderDate}</td>
                        <td>₹{orderTotal}</td>
                        <td>{orderLoc}</td>
                        <td>
                          <span className={`status-pill ${statusClass}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
