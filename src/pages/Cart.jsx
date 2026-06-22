import { useCart } from '../context/CartContext';

export default function Cart({ setPage }) {
  const { cartItems, cart, subtotal, discount, isLoggedIn, shipping, total, changeQty, removeItem } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page active">
        <div className="section-title">Your Cart</div>
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

  return (
    <div className="page active">
      <div className="section-title">Your Cart</div>

      {cartItems.map((p) => (
        <div className="cart-item" key={p.id}>
          <div className="cart-emoji">{p.emoji}</div>
          <div className="cart-details">
            <div className="cart-name">{p.name}</div>
            <div className="cart-price">${p.price.toFixed(2)} each</div>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => changeQty(p.id, -1)}>−</button>
              <span className="qty-num">{cart[p.id]}</span>
              <button className="qty-btn" onClick={() => changeQty(p.id, 1)}>+</button>
            </div>
          </div>
          <div className="cart-item-right">
            <div className="cart-item-total">${(p.price * cart[p.id]).toFixed(2)}</div>
            <button className="remove-btn" onClick={() => removeItem(p.id)} title="Remove" aria-label="Remove item">
              🗑️
            </button>
          </div>
        </div>
      ))}

      {!isLoggedIn && (
        <div className="discount-banner">
          🎁 Sign in at checkout and get <strong>5% off</strong> this order
        </div>
      )}

      <div className="cart-summary">
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
        <button className="checkout-btn" onClick={() => setPage('checkout')}>
          💳 Proceed to Checkout
        </button>
      </div>
    </div>
  );
}