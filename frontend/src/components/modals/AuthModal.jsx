import React from 'react';

export default function AuthModal({
  loginOpen,
  setLoginOpen,
  authMode,
  setAuthMode,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLoginSubmit,
  signupName,
  setSignupName,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  signupBlock,
  setSignupBlock,
  signupRoom,
  setSignupRoom,
  signupDept,
  setSignupDept,
  signupSem,
  setSignupSem,
  handleSendOtp,
  otpInput,
  setOtpInput,
  generatedOtp,
  handleVerifyOtp
}) {
  if (!loginOpen) return null;

  return (
    <div className={`modal-backdrop ${loginOpen ? 'open' : ''}`}>
      <div className="modal-content" role="dialog" aria-modal="true" style={{ maxWidth: authMode === 'signup' ? '480px' : '400px' }}>
        <button className="modal-close" onClick={() => setLoginOpen(false)}>×</button>

        {/* LOGIN MODE */}
        {authMode === 'login' && (
          <>
            <div className="modal-header">
              <h3>Welcome Back</h3>
              <p>Login using your registered email and password</p>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div className="modal-form-group">
                <label>University Email</label>
                <input 
                  type="email" 
                  className="modal-input" 
                  placeholder="name@college.edu" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="modal-form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="modal-input" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="modal-flex-row">
                <label className="modal-checkbox">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#" className="modal-forgot-link" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
              </div>
              <button type="submit" className="btn btn-primary modal-btn-submit">Login</button>
            </form>
            <p className="modal-footer-text">
              Don't have an account?{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setAuthMode('signup');
                }}
              >
                Create Student Account
              </a>
            </p>
          </>
        )}

        {/* SIGNUP MODE */}
        {authMode === 'signup' && (
          <>
            <div className="modal-header">
              <h3>Create Student Account</h3>
              <p>Enter your details. We will send an OTP to verify your email.</p>
            </div>
            <form onSubmit={handleSendOtp}>
              <div className="modal-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="e.g. Anjali Gupta" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required 
                />
              </div>
              <div className="modal-form-group">
                <label>University Email</label>
                <input 
                  type="email" 
                  className="modal-input" 
                  placeholder="student@college.edu" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="modal-form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="modal-input" 
                  placeholder="••••••••" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="modal-form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label>Hostel Block</label>
                  <select 
                    className="modal-input" 
                    value={signupBlock} 
                    onChange={(e) => setSignupBlock(e.target.value)}
                    style={{ height: '42px', display: 'block' }}
                  >
                    <option value="H-1">H-1 Block</option>
                    <option value="H-2">H-2 Block</option>
                    <option value="H-3">H-3 Block</option>
                    <option value="H-4">H-4 Block</option>
                    <option value="PG-1">PG-1 Block</option>
                  </select>
                </div>
                <div>
                  <label>Room Number</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    placeholder="e.g. 302" 
                    value={signupRoom}
                    onChange={(e) => setSignupRoom(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="modal-form-group" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label>Department</label>
                  <select 
                    className="modal-input" 
                    value={signupDept} 
                    onChange={(e) => setSignupDept(e.target.value)}
                    style={{ height: '42px', display: 'block' }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engg</option>
                    <option value="Mechanical Engineering">Mechanical Engg</option>
                    <option value="Bio-Technology">Bio-Technology</option>
                    <option value="Business Administration">Business Admin</option>
                  </select>
                </div>
                <div>
                  <label>Semester</label>
                  <select 
                    className="modal-input" 
                    value={signupSem} 
                    onChange={(e) => setSignupSem(e.target.value)}
                    style={{ height: '42px', display: 'block' }}
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 7">Semester 7</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary modal-btn-submit" style={{ marginTop: '0.5rem' }}>
                Send Email Verification OTP
              </button>
            </form>
            <p className="modal-footer-text">
              Already have an account?{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setAuthMode('login');
                }}
              >
                Sign In Instead
              </a>
            </p>
          </>
        )}

        {/* OTP VERIFICATION MODE */}
        {authMode === 'otp' && (
          <>
            <div className="modal-header">
              <h3>Verify Email OTP</h3>
              <p>We sent a 4-digit verification code to <strong>{signupEmail}</strong></p>
            </div>
            <form onSubmit={handleVerifyOtp}>
              <div className="modal-form-group" style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Enter 4-Digit OTP</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="e.g. 1234" 
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  style={{ fontSize: '1.25rem', textAlign: 'center', letterSpacing: '0.5rem', fontWeight: 'bold' }}
                  required 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.5rem', display: 'block' }}>
                  🔑 Demo OTP Code: <strong>{generatedOtp}</strong>
                </span>
              </div>
              <button type="submit" className="btn btn-primary modal-btn-submit" style={{ marginTop: '1rem' }}>
                Verify OTP & Register
              </button>
            </form>
            <p className="modal-footer-text">
              Didn't receive OTP?{' '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleSendOtp(e);
                }}
              >
                Resend OTP
              </a>
              {' • '}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setAuthMode('signup');
                }}
              >
                Back to Details
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
