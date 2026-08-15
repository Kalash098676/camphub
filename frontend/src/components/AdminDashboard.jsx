import React from 'react';
import { useUserStore } from '../store/useUserStore';
import { useUIStore } from '../store/useUIStore';
import AdminAuthGate from './modals/AdminAuthGate';

export default function AdminDashboard({ adminActiveTab, setAdminActiveTab }) {
  const isAdminAuthenticated = useUserStore((s) => s.isAdminAuthenticated);
  const adminEmail = useUserStore((s) => s.adminEmail);
  const logoutAdmin = useUserStore((s) => s.logoutAdmin);
  const addToast = useUIStore((s) => s.addToast);

  if (!isAdminAuthenticated) {
    return <AdminAuthGate />;
  }

  const handleAdminLogout = () => {
    logoutAdmin();
    addToast('Admin Session Revoked. Security Gate Locked.');
  };

  return (
    <div className="admin-dashboard-wrapper">
      {/* Admin Session Security Bar */}
      <div className="admin-top-bar container">
        <div className="admin-session-badge">
          <span className="live-dot"></span>
          <span>🛡️ Verified Admin Session: <strong>{adminEmail || 'admin@campushub.edu'}</strong> (Clearance Level 1)</span>
        </div>
        <button className="btn btn-secondary btn-admin-logout" onClick={handleAdminLogout}>
          🔒 Logout Admin
        </button>
      </div>

      <div className="admin-dashboard-container container">
        <div className="admin-dashboard-sidebar">
          <button className={`admin-tab-btn ${adminActiveTab === 'revenue' ? 'active' : ''}`} onClick={() => setAdminActiveTab('revenue')}>📈 Revenue & Analytics</button>
          <button className={`admin-tab-btn ${adminActiveTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminActiveTab('orders')}>📦 Active Orders</button>
          <button className={`admin-tab-btn ${adminActiveTab === 'delivery' ? 'active' : ''}`} onClick={() => setAdminActiveTab('delivery')}>🏃 Delivery Partners</button>
          <button className={`admin-tab-btn ${adminActiveTab === 'inventory' ? 'active' : ''}`} onClick={() => setAdminActiveTab('inventory')}>📋 Inventory Stock</button>
          <button className={`admin-tab-btn ${adminActiveTab === 'users' ? 'active' : ''}`} onClick={() => setAdminActiveTab('users')}>👥 Users Status</button>
        </div>
        
        <div className="admin-dashboard-content">
          {adminActiveTab === 'revenue' && (
            <div className="admin-panel-fade">
              <h3 className="admin-section-title">Revenue & Analytics Dashboard</h3>
              <div className="admin-stats-grid">
                <div className="stat-card">
                  <span>Daily Revenue</span>
                  <strong>₹42,850</strong>
                  <span className="trend positive">↑ 18% from yesterday</span>
                </div>
                <div className="stat-card">
                  <span>Active Customers Today</span>
                  <strong>312</strong>
                  <span className="trend positive">↑ 8% from yesterday</span>
                </div>
                <div className="stat-card">
                  <span>Average Basket Value</span>
                  <strong>₹480</strong>
                  <span className="trend negative">↓ 2% from last week</span>
                </div>
                <div className="stat-card">
                  <span>Total Items In Stock</span>
                  <strong>1,420</strong>
                  <span className="trend normal">Steady</span>
                </div>
              </div>
              
              <div className="dashboard-chart-mock">
                <h4>Order Volume (Last 24 Hours)</h4>
                <div className="bar-chart-mock">
                  <div className="chart-bar" style={{ height: '40%' }}><span>8 AM</span></div>
                  <div className="chart-bar" style={{ height: '55%' }}><span>12 PM</span></div>
                  <div className="chart-bar" style={{ height: '85%' }}><span>4 PM</span></div>
                  <div className="chart-bar" style={{ height: '95%' }}><span>8 PM</span></div>
                  <div className="chart-bar" style={{ height: '70%' }}><span>12 AM</span></div>
                </div>
              </div>
            </div>
          )}

          {adminActiveTab === 'orders' && (
            <div className="admin-panel-fade">
              <h3 className="admin-section-title">Active Orders Status</h3>
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer / Location</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#CH-98421</td>
                    <td>Rohan M. (Hostel H-4, Rm 302)</td>
                    <td>Wireless Mouse, Notebooks (x2)</td>
                    <td>₹1,240</td>
                    <td><span className="badge badge-success">Out for Delivery</span></td>
                  </tr>
                  <tr>
                    <td>#CH-98420</td>
                    <td>Priya K. (Girls Hostel GH-1)</td>
                    <td>Laptop Sleeve, Sticky Notes</td>
                    <td>₹850</td>
                    <td><span className="badge badge-warning">Packing</span></td>
                  </tr>
                  <tr>
                    <td>#CH-98419</td>
                    <td>Aman V. (Library Desk 14)</td>
                    <td>Trimax Pens (Pack of 5)</td>
                    <td>₹350</td>
                    <td><span className="badge badge-primary">Delivered</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {adminActiveTab === 'delivery' && (
            <div className="admin-panel-fade">
              <h3 className="admin-section-title">Campus Delivery Runners Status</h3>
              <div className="admin-stats-grid">
                <div className="stat-card">
                  <span>Active Runners Now</span>
                  <strong>8 Students</strong>
                  <span className="trend positive">On Campus</span>
                </div>
                <div className="stat-card">
                  <span>Avg Delivery Speed</span>
                  <strong>11.4 Mins</strong>
                  <span className="trend positive">⚡ Super Fast</span>
                </div>
              </div>
            </div>
          )}

          {adminActiveTab === 'inventory' && (
            <div className="admin-panel-fade">
              <h3 className="admin-section-title">Inventory Stock Level</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                All dorm store items and stationery stock levels monitored in real-time.
              </p>
            </div>
          )}

          {adminActiveTab === 'users' && (
            <div className="admin-panel-fade">
              <h3 className="admin-section-title">Student Users Directory</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Registered campus student accounts and active buyer profiles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
