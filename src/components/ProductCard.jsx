import { useCart } from '../context/CartContext';

export default function ProductCard({ product, goToProduct }) {
  const { cart, addToCart } = useCart();
  const inCart = cart[product.id] > 0;

  return (
    <div className="product-card">
      <div
        className="product-img"
        onClick={() => goToProduct && goToProduct(product.id)}
        style={{ cursor: goToProduct ? 'pointer' : 'default' }}
      >
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : product.emoji || '📦'
        }
      </div>
      <div className="product-info">
        <div className="product-cat">{product.cat}</div>
        <div
          className="product-name"
          onClick={() => goToProduct && goToProduct(product.id)}
          style={{ cursor: goToProduct ? 'pointer' : 'default' }}
        >
          {product.name}
        </div>
        <div className="product-bottom">
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className="product-actions">
            {inCart && <span className="in-cart">✓ In cart</span>}
            <button
              className="add-btn"
              onClick={() => addToCart(product.id)}
              title="Add to cart"
              aria-label={`Add ${product.name} to cart`}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}