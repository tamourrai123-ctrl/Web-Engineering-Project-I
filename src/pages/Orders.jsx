import { useCart } from '../context/CartContext';

const STATUS_LABELS = {
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered'
};

export default function Orders({ setPage }) {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="page active">
        <div className="section-title">Order History</div>
        <div className="cart-empty">
          <div className="cart-empty-icon">📦</div>
          <p>You haven't placed any orders yet</p>
          <br />
          <button className="hero-btn dark" onClick={() => setPage && setPage('products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="section-title">Order History</div>
      <div className="orders-list">
        {orders.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-header">
              <div>
                <div className="order-id">{o.id}</div>
                <div className="order-date">{o.date}</div>
              </div>
              <span className={`order-status status-${o.status}`}>{STATUS_LABELS[o.status]}</span>
            </div>
            <div className="order-items">{o.items}</div>
            <div className="order-total">${o.total.toFixed(2)}</div>
            <div className="progress-bar">
              <div
                className={`progress-fill status-fill-${o.status}`}
                style={{ width: `${o.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
