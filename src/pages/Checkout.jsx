import { useState } from 'react';
import { useCart } from '../context/CartContext';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7;
}

export default function Checkout({ setPage, user }) {
  const { cartItems, subtotal, discount, isLoggedIn, shipping, total, placeOrder } = useCart();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    else if (!isValidPhone(form.phone)) next.phone = 'Enter a valid phone number';
    if (!form.address.trim()) next.address = 'Delivery address is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignIn = () => {
    sessionStorage.setItem('postLoginPage', 'checkout');
    setPage('login');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const order = placeOrder(form);
    setConfirmedOrder(order);
  };

  if (cartItems.length === 0 && !confirmedOrder) {
    return (
      <div className="page active">
        <div className="section-title">Checkout</div>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p>Your cart is empty</p>
          <br />
          <button className="hero-btn dark" onClick={() => setPage('products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="page active">
        <div className="section-title">Order Confirmed</div>
        <div className="checkout-card confirmation-card">
          <div className="confirmation-icon">✅</div>
          <div className="order-card" style={{ border: 'none', padding: 0 }}>
            <div className="order-header">
              <div>
                <div className="order-id">{confirmedOrder.id}</div>
                <div className="order-date">{confirmedOrder.date}</div>
              </div>
              <span className="order-status status-processing">Processing</span>
            </div>
            <div className="order-items">{confirmedOrder.items}</div>
            <div className="order-total">Total: ${confirmedOrder.total.toFixed(2)}</div>
          </div>
          <p className="confirmation-note">
            We'll send updates to <strong>{confirmedOrder.shippingInfo.email}</strong>.
          </p>
          <div className="confirmation-actions">
            <button className="hero-btn dark" onClick={() => setPage('products')}>
              Continue Shopping
            </button>
            {isLoggedIn && (
              <button className="hero-btn" onClick={() => setPage('orders')}>
                View My Orders
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="section-title">Checkout</div>

      {!isLoggedIn && (
        <div className="discount-banner">
          🎁 <strong>Sign in</strong> before placing your order to save 5% —{' '}
          <button type="button" className="link-btn" onClick={handleSignIn}>Sign in now</button>
        </div>
      )}

      <form className="checkout-grid" onSubmit={handlePlaceOrder} noValidate>
        <div className="checkout-card">
          <h3 className="checkout-card-title">Shipping Details</h3>

          <div className="form-field">
            <label htmlFor="checkout-name">Full Name</label>
            <input
              id="checkout-name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Jane Doe"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="checkout-email">Email</label>
            <input
              id="checkout-email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="jane@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="checkout-phone">Phone Number</label>
            <input
              id="checkout-phone"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="(555) 123-4567"
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="checkout-address">Delivery Address</label>
            <textarea
              id="checkout-address"
              rows={3}
              value={form.address}
              onChange={handleChange('address')}
              placeholder="123 Main St, Springfield, IL 62704"
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
        </div>

        <div className="checkout-card checkout-summary-card">
          <h3 className="checkout-card-title">Order Summary</h3>

          <div className="checkout-items-list">
            {cartItems.map((item) => (
              <div className="checkout-line-item" key={item.id}>
                <span className="checkout-line-emoji">{item.emoji}</span>
                <span className="checkout-line-name">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {isLoggedIn && discount > 0 && (
            <div className="summary-row discount-row">
              <span>Member discount (5%)</span>
              <span>−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="submit" className="checkout-btn">
            💳 Place Order
          </button>
        </div>
      </form>
    </div>
  );
}