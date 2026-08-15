import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';

export default function CartDrawer(props) {
  // Store selectors with fallbacks
  const storeCart = useCartStore((state) => state.cart);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const deliveryCharge = useCartStore((state) => state.getDeliveryCharge());

  const cartOpen = useUIStore((state) => state.cartOpen);
  const setCartOpen = useUIStore((state) => state.setCartOpen);
  const setCheckoutOpen = useUIStore((state) => state.setCheckoutOpen);

  const cart = props.cart || storeCart;
  const isCartOpen = props.cartOpen !== undefined ? props.cartOpen : cartOpen;

  const handleClose = () => {
    if (props.setCartOpen) props.setCartOpen(false);
    else setCartOpen(false);
  };

  const handleProceed = () => {
    handleClose();
    if (props.onProceedToPay) {
      props.onProceedToPay();
    } else {
      setCheckoutOpen(true);
    }
  };

  return (
    <div 
      className={`cart-drawer-backdrop ${isCartOpen ? 'open' : ''}`} 
      onClick={(e) => { if (e.target.classList.contains('cart-drawer-backdrop')) handleClose(); }}
    >
      <div className="cart-drawer" role="dialog" aria-modal="true">
        <div className="cart-drawer-header">
          <h3>Your Cart Bag</h3>
          <button className="cart-drawer-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z"></path>
              </svg>
              <p>Your shopping cart is empty</p>
              <span>Add items to get fast door-step delivery</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <div>
                    <h4 className="cart-item-title">{item.title}</h4>
                  </div>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="cart-item-quantity">
                        <button className="qty-btn" onClick={() => props.handleUpdateQty ? props.handleUpdateQty(item.id, -1) : updateQty(item.id, -1)}>-</button>
                        <div className="qty-val">{item.quantity}</div>
                        <button className="qty-btn" onClick={() => props.handleUpdateQty ? props.handleUpdateQty(item.id, 1) : updateQty(item.id, 1)}>+</button>
                      </div>
                      <button className="cart-item-remove" onClick={() => props.handleRemoveFromCart ? props.handleRemoveFromCart(item.id) : removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-drawer-footer">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Campus Runner Delivery</span>
            <span>₹{deliveryCharge.toFixed(0)}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>₹{(subtotal + deliveryCharge).toFixed(0)}</span>
          </div>
          <button 
            className="btn btn-accent btn-checkout" 
            onClick={handleProceed}
            disabled={cart.length === 0}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
