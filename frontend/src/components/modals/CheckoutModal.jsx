import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, cardPaymentSchema, upiPaymentSchema } from '../../utils/validationSchemas';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useUIStore } from '../../store/useUIStore';

export default function CheckoutModal(props) {
  const storeCart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const storeSubtotal = useCartStore((s) => s.getSubtotal());
  const storeDeliveryCharge = useCartStore((s) => s.getDeliveryCharge());

  const storeAddresses = useUserStore((s) => s.profileAddresses);
  const storeAddAddress = useUserStore((s) => s.addAddress);
  const storeWalletBalance = useUserStore((s) => s.walletBalance);
  const fetchUserProfile = useUserStore((s) => s.fetchUserProfile);

  const storePlaceOrder = useOrderStore((s) => s.placeOrder);
  const storeSetTrackInput = useOrderStore((s) => s.setTrackInput);

  const storeCheckoutOpen = useUIStore((s) => s.checkoutOpen);
  const storeSetCheckoutOpen = useUIStore((s) => s.setCheckoutOpen);
  const storeSetTrackOpen = useUIStore((s) => s.setTrackOpen);
  const storeAddToast = useUIStore((s) => s.addToast);

  const checkoutOpen = props.checkoutOpen !== undefined ? props.checkoutOpen : storeCheckoutOpen;
  const setCheckoutOpen = props.setCheckoutOpen || storeSetCheckoutOpen;
  const setTrackOpen = props.setTrackOpen || storeSetTrackOpen;
  const addToast = props.addToast || storeAddToast;

  const cart = props.cart || storeCart;
  const subtotal = props.subtotal !== undefined ? props.subtotal : storeSubtotal;
  const deliveryCharge = props.deliveryCharge !== undefined ? props.deliveryCharge : storeDeliveryCharge;
  const walletBalance = props.walletBalance !== undefined ? props.walletBalance : storeWalletBalance;
  const profileAddresses = props.profileAddresses || storeAddresses;

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review, 4: Success
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  // Payment method choices
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'wallet' | 'cod' | 'netbanking'
  const [upiOption, setUpiOption] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'custom'
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  // Processing state & placed order info
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);

  // --- REACT HOOK FORM + ZOD RESOLVERS ---
  // 1. Address Form
  const {
    register: registerAddr,
    handleSubmit: handleSubmitAddr,
    formState: { errors: addrErrors },
    reset: resetAddr
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      block: 'Hostel Block H-4',
      room: '',
      landmark: ''
    }
  });

  // 2. Card Form
  const {
    register: registerCard,
    formState: { errors: cardErrors },
    watch: watchCard
  } = useForm({
    resolver: zodResolver(cardPaymentSchema),
    mode: 'onChange',
    defaultValues: {
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardName: ''
    }
  });

  // 3. Custom UPI Form
  const {
    register: registerUpi,
    formState: { errors: upiErrors },
    watch: watchUpi
  } = useForm({
    resolver: zodResolver(upiPaymentSchema),
    mode: 'onChange',
    defaultValues: {
      upiId: ''
    }
  });

  if (!checkoutOpen) return null;

  // Calculate pricing
  const platformFee = 5;
  const rawTotal = subtotal + deliveryCharge + platformFee;
  const finalTotal = Math.max(0, rawTotal - couponDiscount);

  // Addresses list
  const addresses = profileAddresses.length > 0 ? profileAddresses : [
    'Hostel Block H-4, Room 302',
    'Central Library, Cubicle 12'
  ];

  // Address Submit Handler
  const onSaveNewAddress = (data) => {
    const formatted = `${data.block}, Room ${data.room}${data.landmark ? ` (${data.landmark})` : ''}`;
    if (props.setProfileAddresses) {
      props.setProfileAddresses(prev => [...prev, formatted]);
    } else {
      storeAddAddress(formatted);
    }
    setSelectedAddressIndex(addresses.length);
    setShowAddForm(false);
    resetAddr();
    addToast(`✓ New delivery address added: ${data.block}, Room ${data.room}`);
  };

  // Step 2 to Step 3 Validation
  const handleProceedToReview = () => {
    if (paymentMethod === 'upi' && upiOption === 'custom') {
      const upiVal = watchUpi('upiId');
      const isValid = /^[\w.-]+@[\w.-]+$/.test(upiVal);
      if (!isValid) {
        addToast('Please enter a valid UPI ID (e.g. name@upi)', true);
        return;
      }
    } else if (paymentMethod === 'card') {
      const cNum = watchCard('cardNumber');
      const cExp = watchCard('cardExpiry');
      const cCvv = watchCard('cardCvv');
      const cName = watchCard('cardName');
      if (!cNum || !cExp || !cCvv || !cName || Object.keys(cardErrors).length > 0) {
        addToast('Please fix card details errors before proceeding', true);
        return;
      }
    } else if (paymentMethod === 'wallet') {
      if (walletBalance < finalTotal) {
        addToast(`Insufficient wallet balance. Total is ₹${finalTotal.toFixed(0)}, but your balance is ₹${walletBalance}.`, true);
        return;
      }
    }
    setStep(3);
  };

  // Coupon application
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'CAMPUS10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon('CAMPUS10');
      setCouponDiscount(discount);
      setCouponMsg({ type: 'success', text: '10% Campus Discount Applied!' });
      addToast('Coupon CAMPUS10 applied! Saved ₹' + discount);
    } else if (code === 'WELCOME50') {
      const discount = 50;
      setAppliedCoupon('WELCOME50');
      setCouponDiscount(discount);
      setCouponMsg({ type: 'success', text: 'Flat ₹50 Welcome Discount Applied!' });
      addToast('Coupon WELCOME50 applied!');
    } else if (code === 'FREESHIP') {
      const discount = deliveryCharge;
      setAppliedCoupon('FREESHIP');
      setCouponDiscount(discount);
      setCouponMsg({ type: 'success', text: 'Free Campus Runner Delivery Applied!' });
      addToast('Free delivery coupon applied!');
    } else {
      setCouponMsg({ type: 'error', text: 'Invalid coupon code. Try CAMPUS10 or WELCOME50' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput('');
    setCouponMsg({ type: '', text: '' });
  };

  // Final Order Placement
  const handleConfirmOrder = async () => {
    if (paymentMethod === 'wallet' && walletBalance < finalTotal) {
      addToast(`Insufficient wallet balance. Total is ₹${finalTotal.toFixed(0)}, but your balance is ₹${walletBalance}.`, true);
      return;
    }

    setIsProcessing(true);

    const selectedAddrStr = addresses[selectedAddressIndex] || addresses[0];
    
    let payMethodCode = 'COD';
    if (paymentMethod === 'upi') payMethodCode = 'UPI';
    else if (paymentMethod === 'wallet') payMethodCode = 'Wallet';

    const orderPayload = {
      items: cart.map(i => ({
        productId: i._id || i.id,
        title: i.title,
        price: i.price,
        quantity: i.quantity || 1,
        image: i.image
      })),
      totalAmount: Math.round(finalTotal),
      paymentMethod: payMethodCode,
      hostelBlock: selectedAddrStr.split(',')[0] || 'H-3 (Boys Hostel)',
      roomNo: selectedAddrStr.split(',')[1] || 'Room 304-B',
      shippingAddress: {
        hostel: selectedAddrStr.split(',')[0] || 'H-3 (Boys Hostel)',
        roomNumber: selectedAddrStr.split(',')[1] || '304-B',
        city: 'Campus',
        pincode: '110001'
      }
    };

    const res = await storePlaceOrder(orderPayload);

    if (res && res.success) {
      clearCart();
      setPlacedOrderInfo(res.order);
      setIsProcessing(false);
      setStep(4);
      if (addToast) addToast(`🎉 Order placed successfully!`);
      // Refresh user profile/wallet balance from backend
      try {
        await fetchUserProfile();
      } catch (err) {
        console.warn('Failed to refresh user profile:', err);
      }
    } else {
      setIsProcessing(false);
      if (addToast) addToast(res?.message || '❌ Order placement failed. Please try again.', true);
    }
  };


  const handleClose = () => {
    setCheckoutOpen(false);
    setTimeout(() => {
      setStep(1);
      setPlacedOrderInfo(null);
    }, 300);
  };

  const handleTrackNewOrder = () => {
    if (placedOrderInfo) {
      if (props.setTrackInput) props.setTrackInput(placedOrderInfo.id);
      else storeSetTrackInput(placedOrderInfo.id);
      
      setCheckoutOpen(false);
      setTrackOpen(true);
    }
  };

  return (
    <div className={`modal-backdrop checkout-modal-backdrop ${checkoutOpen ? 'open' : ''}`}>
      <div className="modal-content checkout-modal-content" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={handleClose}>×</button>

        {/* Modal Header */}
        <div className="checkout-modal-header">
          <h3>
            {step === 4 ? '🎉 Order Placed Successfully!' : '⚡ Campus Quick Checkout'}
          </h3>
          {step < 4 && (
            <div className="checkout-stepper">
              <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="step-num">{step > 1 ? '✓' : '1'}</span>
                <span className="step-label">Address</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="step-num">{step > 2 ? '✓' : '2'}</span>
                <span className="step-label">Payment</span>
              </div>
              <div className="step-line"></div>
              <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span className="step-label">Review</span>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-modal-body">
          {/* STEP 1: ADDRESS SELECTION */}
          {step === 1 && (
            <div className="checkout-step-container">
              <h4 className="checkout-section-title">Select Delivery Location</h4>
              <p className="checkout-section-desc">Where should our Campus Runner deliver your order?</p>

              <div className="address-list">
                {addresses.map((addr, idx) => (
                  <label 
                    key={idx} 
                    className={`address-card ${selectedAddressIndex === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedAddressIndex(idx)}
                  >
                    <input 
                      type="radio" 
                      name="deliveryAddress" 
                      checked={selectedAddressIndex === idx} 
                      onChange={() => setSelectedAddressIndex(idx)} 
                    />
                    <div className="address-info">
                      <div className="address-tag">
                        {idx === 0 ? '🏠 Primary Hostel' : `📍 Saved Location ${idx + 1}`}
                      </div>
                      <p className="address-text">{addr}</p>
                    </div>
                  </label>
                ))}
              </div>

              {!showAddForm ? (
                <button 
                  type="button" 
                  className="btn-add-new-address"
                  onClick={() => setShowAddForm(true)}
                >
                  + Add New Hostel / Campus Location
                </button>
              ) : (
                <form className="add-address-form" onSubmit={handleSubmitAddr(onSaveNewAddress)} noValidate>
                  <h5>Add New Delivery Location</h5>
                  
                  <div style={{ marginBottom: '0.65rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Student Full Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...registerAddr('fullName')}
                      className={`modal-input ${addrErrors.fullName ? 'input-invalid' : ''}`}
                    />
                    {addrErrors.fullName && <span className="field-error">{addrErrors.fullName.message}</span>}
                  </div>

                  <div className="form-grid">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Mobile Number (10 Digits)</label>
                      <input 
                        type="tel"
                        placeholder="e.g. 9876543210"
                        maxLength={10}
                        {...registerAddr('phone')}
                        className={`modal-input ${addrErrors.phone ? 'input-invalid' : ''}`}
                      />
                      {addrErrors.phone && <span className="field-error">{addrErrors.phone.message}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Hostel / Building Block</label>
                      <select 
                        {...registerAddr('block')}
                        className={`modal-input ${addrErrors.block ? 'input-invalid' : ''}`}
                      >
                        <option value="Hostel Block H-1">Hostel Block H-1</option>
                        <option value="Hostel Block H-2">Hostel Block H-2</option>
                        <option value="Hostel Block H-3">Hostel Block H-3</option>
                        <option value="Hostel Block H-4">Hostel Block H-4</option>
                        <option value="Girls Hostel GH-1">Girls Hostel GH-1</option>
                        <option value="Girls Hostel GH-2">Girls Hostel GH-2</option>
                        <option value="Central Library">Central Library</option>
                        <option value="Academic Block A">Academic Block A</option>
                        <option value="Campus Canteen Area">Campus Canteen Area</option>
                      </select>
                      {addrErrors.block && <span className="field-error">{addrErrors.block.message}</span>}
                    </div>
                  </div>

                  <div className="form-grid" style={{ marginTop: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Room / Desk / Cubicle No.</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Room 302 or Desk 14" 
                        {...registerAddr('room')}
                        className={`modal-input ${addrErrors.room ? 'input-invalid' : ''}`}
                      />
                      {addrErrors.room && <span className="field-error">{addrErrors.room.message}</span>}
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Landmark (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Near West Staircase" 
                        {...registerAddr('landmark')}
                        className="modal-input" 
                      />
                    </div>
                  </div>

                  <div className="form-actions" style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem' }}>Save & Select Address</button>
                    <button type="button" className="btn btn-secondary" style={{ padding: '0.55rem 1rem' }} onClick={() => setShowAddForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              <div className="checkout-actions">
                <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                <button 
                  className="btn btn-primary btn-next-step"
                  onClick={() => setStep(2)}
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div className="checkout-step-container">
              <h4 className="checkout-section-title">Choose Payment Method</h4>
              <p className="checkout-section-desc">Select how you'd like to pay for this order</p>

              <div className="payment-options-grid">
                {/* 1. UPI Payment */}
                <div 
                  className={`payment-option-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="payment-option-header">
                    <label>
                      <input 
                        type="radio" 
                        name="payMethod" 
                        checked={paymentMethod === 'upi'} 
                        onChange={() => setPaymentMethod('upi')} 
                      />
                      <span className="pay-title">📱 UPI / Instant Mobile Pay</span>
                    </label>
                    <span className="pay-badge fast">Fastest</span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="payment-sub-content">
                      <div className="upi-apps-row">
                        <button 
                          type="button"
                          className={`upi-app-btn ${upiOption === 'gpay' ? 'active' : ''}`}
                          onClick={() => setUpiOption('gpay')}
                        >
                          Google Pay
                        </button>
                        <button 
                          type="button"
                          className={`upi-app-btn ${upiOption === 'phonepe' ? 'active' : ''}`}
                          onClick={() => setUpiOption('phonepe')}
                        >
                          PhonePe
                        </button>
                        <button 
                          type="button"
                          className={`upi-app-btn ${upiOption === 'paytm' ? 'active' : ''}`}
                          onClick={() => setUpiOption('paytm')}
                        >
                          Paytm
                        </button>
                        <button 
                          type="button"
                          className={`upi-app-btn ${upiOption === 'custom' ? 'active' : ''}`}
                          onClick={() => setUpiOption('custom')}
                        >
                          UPI ID
                        </button>
                      </div>

                      {upiOption === 'custom' && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <input 
                            type="text" 
                            placeholder="Enter VPA / UPI ID (e.g. mobile@upi)" 
                            {...registerUpi('upiId')}
                            className={`modal-input ${upiErrors.upiId ? 'input-invalid' : ''}`}
                          />
                          {upiErrors.upiId && <span className="field-error">{upiErrors.upiId.message}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Campus Wallet */}
                <div 
                  className={`payment-option-card ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="payment-option-header">
                    <label>
                      <input 
                        type="radio" 
                        name="payMethod" 
                        checked={paymentMethod === 'wallet'} 
                        onChange={() => setPaymentMethod('wallet')} 
                      />
                      <span className="pay-title">💳 Campus Student Wallet</span>
                    </label>
                    <span className="wallet-balance-tag">Balance: ₹{walletBalance}</span>
                  </div>
                  {paymentMethod === 'wallet' && (
                    <div className="payment-sub-content">
                      {walletBalance >= finalTotal ? (
                        <p style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>
                          ✓ Instant 1-Click checkout using your Student Wallet balance!
                        </p>
                      ) : (
                        <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>
                          ⚠️ Low balance (₹{walletBalance}). Remaining ₹{(finalTotal - walletBalance).toFixed(0)} can be paid via cash or UPI.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Cards */}
                <div 
                  className={`payment-option-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="payment-option-header">
                    <label>
                      <input 
                        type="radio" 
                        name="payMethod" 
                        checked={paymentMethod === 'card'} 
                        onChange={() => setPaymentMethod('card')} 
                      />
                      <span className="pay-title">💳 Credit / Debit Card</span>
                    </label>
                    <div className="card-icons-inline">Visa • Mastercard • RuPay</div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="payment-sub-content">
                      <div style={{ marginBottom: '0.5rem' }}>
                        <input 
                          type="text" 
                          placeholder="Cardholder Name" 
                          {...registerCard('cardName')}
                          className={`modal-input ${cardErrors.cardName ? 'input-invalid' : ''}`}
                        />
                        {cardErrors.cardName && <span className="field-error">{cardErrors.cardName.message}</span>}
                      </div>

                      <div style={{ marginBottom: '0.5rem' }}>
                        <input 
                          type="text" 
                          placeholder="Card Number (16 digits)" 
                          maxLength={19}
                          {...registerCard('cardNumber')}
                          className={`modal-input ${cardErrors.cardNumber ? 'input-invalid' : ''}`}
                        />
                        {cardErrors.cardNumber && <span className="field-error">{cardErrors.cardNumber.message}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <input 
                            type="text" 
                            placeholder="Expiry (MM/YY)" 
                            maxLength={5}
                            {...registerCard('cardExpiry')}
                            className={`modal-input ${cardErrors.cardExpiry ? 'input-invalid' : ''}`}
                          />
                          {cardErrors.cardExpiry && <span className="field-error">{cardErrors.cardExpiry.message}</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <input 
                            type="password" 
                            placeholder="CVV" 
                            maxLength={4}
                            {...registerCard('cardCvv')}
                            className={`modal-input ${cardErrors.cardCvv ? 'input-invalid' : ''}`}
                          />
                          {cardErrors.cardCvv && <span className="field-error">{cardErrors.cardCvv.message}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Cash on Delivery */}
                <div 
                  className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="payment-option-header">
                    <label>
                      <input 
                        type="radio" 
                        name="payMethod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={() => setPaymentMethod('cod')} 
                      />
                      <span className="pay-title">💵 Cash on Delivery / Pay Runner</span>
                    </label>
                    <span className="pay-badge">No Prepayment</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="payment-sub-content">
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Pay cash or UPI directly to the Campus Runner when your order arrives at your hostel room.
                      </p>
                    </div>
                  )}
                </div>

                {/* 5. Net Banking */}
                <div 
                  className={`payment-option-card ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <div className="payment-option-header">
                    <label>
                      <input 
                        type="radio" 
                        name="payMethod" 
                        checked={paymentMethod === 'netbanking'} 
                        onChange={() => setPaymentMethod('netbanking')} 
                      />
                      <span className="pay-title">🏦 Net Banking</span>
                    </label>
                  </div>
                  {paymentMethod === 'netbanking' && (
                    <div className="payment-sub-content">
                      <select 
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="modal-input"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="checkout-actions">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button 
                  className="btn btn-primary btn-next-step"
                  onClick={handleProceedToReview}
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & COUPON */}
          {step === 3 && (
            <div className="checkout-step-container">
              <h4 className="checkout-section-title">Order Review & Payment</h4>
              
              <div className="review-grid">
                {/* Left Column: Items & Details */}
                <div className="review-left">
                  {/* Delivery Location Summary */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <span>📍 Delivery Address</span>
                      <button className="btn-link" onClick={() => setStep(1)}>Change</button>
                    </div>
                    <p className="review-card-body">{addresses[selectedAddressIndex] || addresses[0]}</p>
                  </div>

                  {/* Payment Method Summary */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <span>💳 Payment Method</span>
                      <button className="btn-link" onClick={() => setStep(2)}>Change</button>
                    </div>
                    <p className="review-card-body">
                      {paymentMethod === 'upi' && `UPI Mobile Pay (${upiOption.toUpperCase()})`}
                      {paymentMethod === 'card' && 'Credit / Debit Card'}
                      {paymentMethod === 'wallet' && 'Campus Student Wallet'}
                      {paymentMethod === 'cod' && 'Cash on Delivery (Pay to Runner)'}
                      {paymentMethod === 'netbanking' && `Net Banking (${selectedBank})`}
                    </p>
                  </div>

                  {/* Items list */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <span>📦 Bag Items ({cart.length})</span>
                    </div>
                    <div className="checkout-items-mini">
                      {cart.map(item => (
                        <div key={item.id} className="checkout-item-row">
                          <img src={item.image} alt={item.title} className="item-mini-thumb" />
                          <div className="item-mini-info">
                            <span className="item-mini-title">{item.title}</span>
                            <span className="item-mini-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="item-mini-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Coupon */}
                <div className="review-right">
                  {/* Coupon Box */}
                  <div className="coupon-box">
                    <label className="coupon-label">🏷️ Have a Campus Coupon?</label>
                    {!appliedCoupon ? (
                      <div className="coupon-input-group">
                        <input 
                          type="text" 
                          placeholder="e.g. CAMPUS10" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="coupon-input"
                        />
                        <button className="btn btn-accent btn-apply-coupon" onClick={handleApplyCoupon}>
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="applied-coupon-badge">
                        <span>🎉 <strong>{appliedCoupon}</strong> Applied (-₹{couponDiscount})</span>
                        <button className="btn-remove-coupon" onClick={handleRemoveCoupon}>×</button>
                      </div>
                    )}

                    {couponMsg.text && (
                      <div className={`coupon-msg ${couponMsg.type}`}>
                        {couponMsg.text}
                      </div>
                    )}

                    <div className="suggested-coupons">
                      <span className="suggested-tag" onClick={() => { setCouponInput('CAMPUS10'); }}>Use CAMPUS10 (10% OFF)</span>
                      <span className="suggested-tag" onClick={() => { setCouponInput('WELCOME50'); }}>Use WELCOME50 (₹50 OFF)</span>
                    </div>
                  </div>

                  {/* Price Bill Breakdown */}
                  <div className="bill-breakdown-card">
                    <div className="bill-row">
                      <span>Items Subtotal</span>
                      <span>₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="bill-row">
                      <span>Campus Runner Fee</span>
                      <span>₹{deliveryCharge.toFixed(0)}</span>
                    </div>
                    <div className="bill-row">
                      <span>Platform & Tech Fee</span>
                      <span>₹{platformFee}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="bill-row discount">
                        <span>Campus Coupon Discount</span>
                        <span>-₹{couponDiscount}</span>
                      </div>
                    )}
                    <div className="bill-divider"></div>
                    <div className="bill-row total">
                      <span>Total Amount Payable</span>
                      <span className="total-price">₹{finalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Pay button */}
                  <button 
                    className="btn btn-primary btn-place-order-large"
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? '⚡ Securing Order...' : `Pay ₹${finalTotal.toFixed(0)} & Place Order`}
                  </button>
                </div>
              </div>

              <div className="checkout-actions" style={{ marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back to Payment</button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS / CONFIRMATION */}
          {step === 4 && placedOrderInfo && (
            <div className="order-success-container">
              <div className="success-icon-badge">
                <span>✓</span>
              </div>
              <h3>Order Confirmed!</h3>
              <p className="success-subtitle">
                Your order <strong>#{placedOrderInfo.id}</strong> has been assigned to a Campus Runner!
              </p>

              <div className="success-details-card">
                <div className="detail-row">
                  <span className="detail-label">Delivery Address</span>
                  <span className="detail-val">{placedOrderInfo.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-val">{placedOrderInfo.paymentMethod}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Amount Paid</span>
                  <span className="detail-val highlight">₹{placedOrderInfo.total}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Est. Runner Arrival</span>
                  <span className="detail-val runner-tag">⚡ 10 - 15 Mins ({placedOrderInfo.runner})</span>
                </div>
              </div>

              <div className="success-actions">
                <button className="btn btn-accent btn-track-order-now" onClick={handleTrackNewOrder}>
                  🚚 Track Live Delivery
                </button>
                <button className="btn btn-secondary" onClick={handleClose}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
