import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminAuthSchema, adminOtpSchema } from '../../utils/validationSchemas';
import { useUserStore } from '../../store/useUserStore';
import { useUIStore } from '../../store/useUIStore';

export default function AdminAuthGate() {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [demoOtp, setDemoOtp] = useState('');
  
  const sendAdminOtp = useUserStore((s) => s.sendAdminOtp);
  const verifyAdminOtp = useUserStore((s) => s.verifyAdminOtp);
  const addToast = useUIStore((s) => s.addToast);

  // Form 1: Admin Email & Password
  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    formState: { errors: authErrors }
  } = useForm({
    resolver: zodResolver(adminAuthSchema),
    defaultValues: {
      email: 'admin@campushub.edu',
      password: 'admin123'
    }
  });

  // Form 2: OTP Verification
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors }
  } = useForm({
    resolver: zodResolver(adminOtpSchema),
    defaultValues: {
      otp: ''
    }
  });

  const onSendOtp = (data) => {
    const res = sendAdminOtp(data.email, data.password);
    if (res.success) {
      setDemoOtp(res.otp);
      setStep(2);
      addToast(`🔑 Admin OTP sent! Demo OTP code: ${res.otp}`);
    } else {
      addToast(res.message, true);
    }
  };

  const onVerifyOtp = (data) => {
    const res = verifyAdminOtp(data.otp);
    if (res.success) {
      addToast('🛡️ Admin Access Granted! Welcome to Admin Panel.');
    } else {
      addToast(res.message, true);
    }
  };

  return (
    <div className="admin-gate-wrapper container">
      <div className="admin-gate-card">
        <div className="admin-gate-header">
          <div className="admin-shield-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h3>CampusHub Admin Access</h3>
          <p>Strictly for authorized campus store operations & inventory managers</p>
        </div>

        {step === 1 ? (
          <form className="admin-gate-form" onSubmit={handleSubmitAuth(onSendOtp)} noValidate>
            <div className="form-group">
              <label>Admin Work Email</label>
              <input 
                type="email"
                placeholder="admin@campushub.edu"
                {...registerAuth('email')}
                className={`modal-input ${authErrors.email ? 'input-invalid' : ''}`}
              />
              {authErrors.email && <span className="field-error">{authErrors.email.message}</span>}
            </div>

            <div className="form-group" style={{ marginTop: '0.85rem' }}>
              <label>Admin Security Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                {...registerAuth('password')}
                className={`modal-input ${authErrors.password ? 'input-invalid' : ''}`}
              />
              {authErrors.password && <span className="field-error">{authErrors.password.message}</span>}
            </div>

            <div className="demo-hint-box" style={{ marginTop: '1rem' }}>
              <span>💡 <strong>Demo Admin Credentials:</strong></span>
              <span>Email: <code>admin@campushub.edu</code> | Pass: <code>admin123</code></span>
            </div>

            <button type="submit" className="btn btn-primary btn-gate-submit" style={{ marginTop: '1.25rem' }}>
              Authenticate & Send OTP →
            </button>
          </form>
        ) : (
          <form className="admin-gate-form" onSubmit={handleSubmitOtp(onVerifyOtp)} noValidate>
            <div className="otp-sent-banner">
              <span>📧 Verification OTP generated for <strong>Admin Security Clearance</strong></span>
            </div>

            {demoOtp && (
              <div className="demo-otp-badge">
                🔑 Demo Verification OTP Code: <strong>{demoOtp}</strong>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Enter 4-Digit OTP Code</label>
              <input 
                type="text"
                placeholder="e.g. 8492"
                maxLength={4}
                {...registerOtp('otp')}
                className={`modal-input otp-input-large ${otpErrors.otp ? 'input-invalid' : ''}`}
                autoFocus
              />
              {otpErrors.otp && <span className="field-error">{otpErrors.otp.message}</span>}
            </div>

            <div className="gate-actions" style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="submit" className="btn btn-primary btn-gate-submit" style={{ flex: 1 }}>
                Verify OTP & Access Admin Panel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
