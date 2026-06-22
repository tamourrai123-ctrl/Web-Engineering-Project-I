import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ShopperDashboard({ setPage, goToProduct }) {
  const { orders, wishlist, toggleWishlist, profile, setProfile } = useCart();
  const [tab, setTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(profile);

  const totalSpent = orders.reduce((s, o) => s + parseFloat(o.total), 0);
  const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  const STATUS_LABELS = { processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };

  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'orders', label: '📦 Orders' },
    { key: 'wishlist', label: '❤️ Wishlist' },
    { key: 'profile', label: '👤 Profile' },
  ];

  return (
    <div className="page active">
      <div className="section-title">My Account</div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} className={`filter-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', borderRadius: '16px', padding: '1.5rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, flexShrink: 0 }}>
              {profile.name[0]}
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem' }}>{profile.name}</div>
              <div style={{ opacity: 0.7, fontSize: '13px' }}>{profile.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: '💳' },
              { label: 'Orders', value: orders.length, icon: '📦' },
              { label: 'Wishlist', value: wishlist.length, icon: '❤️' },
              { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '✅' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent2)' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '1rem' }}>Spending by Status</div>
            {['delivered', 'shipped', 'processing'].map(status => {
              const spent = orders.filter(o => o.status === status).reduce((s, o) => s + o.total, 0);
              const pct = totalSpent ? (spent / totalSpent) * 100 : 0;
              const colors = { delivered: 'var(--success)', shipped: '#1565c0', processing: 'var(--accent)' };
              return (
                <div key={status} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ textTransform: 'capitalize' }}>{status}</span>
                    <span>${spent.toFixed(2)}</span>
                  </div>
                  <div style={{ background: '#f0ede9', borderRadius: '4px', height: '8px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: '4px', background: colors[status] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {orders.length === 0 && <p className="empty-text">No orders yet.</p>}
          {orders.map(o => (
            <div key={o.id} className="order-card">
              <div className="order-header">
                <div>
                  <div className="order-id">{o.id}</div>
                  <div className="order-date">{o.date}</div>
                </div>
                <span className={`order-status status-${o.status}`}>{STATUS_LABELS[o.status]}</span>
              </div>
              <div className="order-items">{o.items}</div>
              <div className="order-total">${parseFloat(o.total).toFixed(2)}</div>
              <div className="progress-bar">
                <div className={`progress-fill status-fill-${o.status}`} style={{ width: `${o.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WISHLIST */}
      {tab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">❤️</div>
              <p>Your wishlist is empty</p>
              <br />
              <button className="hero-btn dark" onClick={() => setPage('products')}>Browse Products</button>
            </div>
          ) : (
            <div className="products-grid">
              {wishlistProducts.map(p => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <ProductCard product={p} goToProduct={goToProduct} />
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE */}
      {tab === 'profile' && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', maxWidth: '480px' }}>
          <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '1.25rem' }}>Personal Information</div>
          {editingProfile ? (
            <>
              {[
                { field: 'name', label: 'Full Name' },
                { field: 'email', label: 'Email' },
                { field: 'phone', label: 'Phone' },
                { field: 'address', label: 'Address' },
              ].map(({ field, label }) => (
                <div key={field} style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <input
                    style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none' }}
                    value={profileForm[field]}
                    onChange={e => setProfileForm(p => ({ ...p, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                <button className="hero-btn" onClick={() => { setProfile(profileForm); setEditingProfile(false); }}>Save Changes</button>
                <button className="filter-btn" onClick={() => setEditingProfile(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              {[
                { label: 'Full Name', value: profile.name },
                { label: 'Email', value: profile.email },
                { label: 'Phone', value: profile.phone || '—' },
                { label: 'Address', value: profile.address || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
              <button className="hero-btn dark" onClick={() => { setProfileForm(profile); setEditingProfile(true); }}>
                ✏️ Edit Profile
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}