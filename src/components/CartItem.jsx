export default function CartItem({ product, quantity, onChangeQty, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-emoji">{product.emoji}</div>
      <div className="cart-details">
        <div className="cart-name">{product.name}</div>
        <div className="cart-price">${product.price} each</div>
        <div className="qty-ctrl">
          <button className="qty-btn" onClick={() => onChangeQty(product.id, -1)}>−</button>
          <span className="qty-num">{quantity}</span>
          <button className="qty-btn" onClick={() => onChangeQty(product.id, 1)}>+</button>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>
          ${(product.price * quantity).toFixed(2)}
        </div>
        <button className="remove-btn" onClick={() => onRemove(product.id)} title="Remove">
          🗑️
        </button>
      </div>
    </div>
  );
}