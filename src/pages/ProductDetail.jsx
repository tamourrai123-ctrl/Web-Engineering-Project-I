import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail({ productId, onBack }) {
  const { cart, addToCart, changeQty, wishlist, toggleWishlist } = useCart();
  const product = PRODUCTS.find(p => p.id === productId);
  const qty = cart[product?.id] || 0;
  const isWishlisted = wishlist.includes(product?.id);

  if (!product) return <div className="page active"><p>Product not found.</p></div>;

  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

  return (
    <div className="page active">
      <button className="filter-btn" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        ← Back
      </button>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', maxWidth: '600px', margin: '0 auto' }}>
        <div className="product-img" style={{ height: '220px', fontSize: '6rem', position: 'relative' }}>
          {product.emoji}
          <button
            onClick={() => toggleWishlist(product.id)}
            style={{ position: 'absolute', top: '12px', right: '12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <div style={{ padding: '2rem' }}>
          <div className="product-cat">{product.cat}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent2)', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
            {product.name}
          </h2>
          <div style={{ color: '#f5a623', fontSize: '18px', marginBottom: '0.5rem' }}>
            {stars} <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{product.rating} / 5</span>
          </div>
          {product.description && (
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '1rem' }}>
              {product.description}
            </p>
          )}
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent2)', marginBottom: '1.5rem' }}>
            ${product.price.toFixed(2)}
          </div>

          {qty === 0 ? (
            <button className="checkout-btn" onClick={() => addToCart(product.id)}>
              + Add to Cart
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="qty-btn" onClick={() => changeQty(product.id, -1)}>−</button>
              <span className="qty-num" style={{ fontSize: '18px' }}>{qty}</span>
              <button className="qty-btn" onClick={() => changeQty(product.id, 1)}>+</button>
              <span className="in-cart" style={{ marginLeft: '8px' }}>✓ In cart</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}