export default function OrderCard({ order }) {
  const statusColors = {
    processing: { bg: '#fff3e0', color: '#e65100' },
    shipped: { bg: '#e3f2fd', color: '#1565c0' },
    delivered: { bg: '#e8f5e9', color: '#2d7a4f' },
  };

  const progressColors = {
    processing: 'var(--accent)',
    shipped: '#1565c0',
    delivered: 'var(--success)',
  };

  const style = statusColors[order.status] || statusColors.processing;

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <div className="order-id">{order.id}</div>
          <div className="order-date">{order.date}</div>
        </div>
        <span className="order-status" style={{ background: style.bg, color: style.color }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <div className="order-items">{order.items}</div>
      <div className="order-total">{order.total}</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${order.progress}%`, background: progressColors[order.status] }}
        />
      </div>
    </div>
  );
}