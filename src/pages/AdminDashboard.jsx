import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const STATUS_LABELS = { processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };
const EMPTY_PRODUCT = { name: '', cat: 'Electronics', price: '', stock: '', emoji: '', description: '', image: null };

const statusColors = { processing: '#e65100', shipped: '#1565c0', delivered: '#2d7a4f' };
const statusBg     = { processing: '#fff3e0', shipped: '#e3f2fd', delivered: '#e8f5e9' };

const S = {
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '14px',
    padding: '1.25rem',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    display: 'block',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '9px 12px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    background: 'var(--bg)',
    color: 'var(--text)',
    outline: 'none',
    marginBottom: '12px',
  },
  pill: (status) => ({
    background: statusBg[status],
    color: statusColors[status],
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '20px',
    display: 'inline-block',
  }),
};

export default function AdminDashboard() {
  const { orders, customers: CUSTOMERS } = useCart();
  const [tab, setTab] = useState('stats');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const newImageRef = useRef(null);
  const editImageRef = useRef(null);

  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total), 0);
  const totalOrders  = orders.length;
  const avgOrder     = totalOrders ? totalRevenue / totalOrders : 0;
  const processing   = orders.filter(o => o.status === 'processing').length;

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (isEdit) setEditingProduct(p => ({ ...p, image: ev.target.result, emoji: '' }));
      else        setNewProduct(p => ({ ...p, image: ev.target.result, emoji: '' }));
    };
    reader.readAsDataURL(file);
  };

  const deleteProduct = (id) => {
    if (window.confirm('Delete this product?')) setProducts(prev => prev.filter(p => p.id !== id));
  };

  const saveEdit = () => {
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
      ...editingProduct,
      price: parseFloat(editingProduct.price) || 0,
      stock: parseInt(editingProduct.stock) || 0,
    } : p));
    setEditingProduct(null);
  };

  const addProduct = () => {
    if (!newProduct.name) return;
    setProducts(prev => [...prev, {
      ...newProduct,
      id: Date.now(),
      rating: 4.5,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 10,
    }]);
    setNewProduct(null);
  };

  const ProductImagePreview = ({ product, size = 48 }) => (
    product.image
      ? <img src={product.image} alt={product.name} style={{ width: size, height: size, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
      : <div style={{ width: size, height: size, borderRadius: '8px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.55, flexShrink: 0 }}>{product.emoji || '📦'}</div>
  );

  const tabs = [
    { key: 'stats',     label: 'Stats',     icon: '📊' },
    { key: 'products',  label: 'Products',  icon: '📦' },
    { key: 'orders',    label: 'Orders',    icon: '🧾' },
    { key: 'customers', label: 'Customers', icon: '👥' },
  ];

  return (
    <div className="page active">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: 'var(--text)', lineHeight: 1.2 }}>Admin Dashboard</div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Manage your store</div>
        </div>
        <div style={{ background: 'var(--accent)', color: '#fff', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 500 }}>
          🟢 Live
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.75rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: '8px 4px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s',
              background: tab === t.key ? 'var(--accent)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--muted)',
            }}
          >
            <span style={{ marginRight: '5px' }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── STATS ── */}
      {tab === 'stats' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Revenue',   value: `$${totalRevenue.toFixed(2)}`, icon: '💰', accent: true },
              { label: 'Total Orders',    value: totalOrders,                   icon: '🧾' },
              { label: 'Avg Order Value', value: `$${avgOrder.toFixed(2)}`,     icon: '📈' },
              { label: 'Processing',      value: processing,                    icon: '⏳' },
            ].map(stat => (
              <div key={stat.label} style={{ ...S.card, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 12, right: 14, fontSize: '1.6rem', opacity: 0.18 }}>{stat.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.accent ? 'var(--accent)' : 'var(--text)', lineHeight: 1 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '1.25rem', color: 'var(--text)' }}>Revenue by status</div>
            {['delivered', 'shipped', 'processing'].map(status => {
              const rev = orders.filter(o => o.status === status).reduce((s, o) => s + parseFloat(o.total), 0);
              const pct = totalRevenue ? (rev / totalRevenue) * 100 : 0;
              return (
                <div key={status} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--text)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[status], display: 'inline-block' }} />
                      <span style={{ textTransform: 'capitalize' }}>{status}</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>${rev.toFixed(2)}</span>
                  </div>
                  <div style={{ background: 'var(--bg)', borderRadius: '6px', height: '7px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: '6px', background: statusColors[status], transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === 'products' && (
        <div>
          <button
            onClick={() => setNewProduct(EMPTY_PRODUCT)}
            style={{ marginBottom: '1.25rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
          >
            + Add product
          </button>

          {newProduct && (
            <div style={{ ...S.card, marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '1.25rem', color: 'var(--text)' }}>New product</div>

              <label style={S.label}>Product image</label>
              <div
                onClick={() => newImageRef.current.click()}
                style={{ border: '2px dashed var(--border)', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)', marginBottom: '12px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {newProduct.image
                  ? <><img src={newProduct.image} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }} /><div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>Click to change</div></>
                  : <><div style={{ fontSize: '2rem', marginBottom: '6px' }}>📷</div><div style={{ fontSize: '13px', color: 'var(--muted)' }}>Click to upload</div><div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>PNG · JPG · WEBP</div></>
                }
              </div>
              <input ref={newImageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, false)} />

              {!newProduct.image && (
                <><label style={S.label}>Or use an emoji</label>
                <input style={S.input} placeholder="e.g. 🎧" value={newProduct.emoji} onChange={e => setNewProduct(p => ({ ...p, emoji: e.target.value }))} /></>
              )}

              {[
                { field: 'name',        label: 'Product name', placeholder: 'e.g. Wireless Headphones' },
                { field: 'price',       label: 'Price ($)',    placeholder: 'e.g. 49.99' },
                { field: 'stock',       label: 'Stock',        placeholder: 'e.g. 20' },
                { field: 'description', label: 'Description',  placeholder: 'Short product description…' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label style={S.label}>{label}</label>
                  <input style={S.input} placeholder={placeholder} value={newProduct[field]} onChange={e => setNewProduct(p => ({ ...p, [field]: e.target.value }))} />
                </div>
              ))}

              <label style={S.label}>Category</label>
              <select style={{ ...S.input, marginBottom: '1.25rem' }} value={newProduct.cat} onChange={e => setNewProduct(p => ({ ...p, cat: e.target.value }))}>
                {['Electronics', 'Clothing', 'Home', 'Sports'].map(c => <option key={c}>{c}</option>)}
              </select>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={addProduct} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Save product</button>
                <button onClick={() => setNewProduct(null)} className="filter-btn">Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {products.map(p => (
              <div key={p.id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '12px' }}>
                {editingProduct?.id === p.id ? (
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <ProductImagePreview product={editingProduct} size={52} />
                      <button className="filter-btn" onClick={() => editImageRef.current.click()}>📷 Change image</button>
                      <input ref={editImageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, true)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                      {['name', 'price', 'stock', 'emoji'].map(field => (
                        <input key={field} placeholder={field} style={{ ...S.input, marginBottom: 0 }} value={editingProduct[field] || ''} onChange={e => setEditingProduct(ep => ({ ...ep, [field]: e.target.value }))} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={saveEdit} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditingProduct(null)} className="filter-btn">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <ProductImagePreview product={p} size={48} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{p.cat} · Stock: {p.stock}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)', flexShrink: 0 }}>${parseFloat(p.price).toFixed(2)}</div>
                    <button onClick={() => setEditingProduct({ ...p })} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '7px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                    <button onClick={() => deleteProduct(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--muted)', padding: '4px' }}>🗑️</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {orders.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No orders yet.</div>}
          {orders.map(o => (
            <div key={o.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🧾</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{o.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{o.date} · {o.customer || 'Guest'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{o.items}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)', marginBottom: '4px' }}>${parseFloat(o.total).toFixed(2)}</div>
                <span style={S.pill(o.status)}>{STATUS_LABELS[o.status]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CUSTOMERS ── */}
      {tab === 'customers' && (
        <div>
          {selectedCustomer ? (
            <div>
              <button className="filter-btn" onClick={() => setSelectedCustomer(null)} style={{ marginBottom: '1.25rem' }}>← Back</button>

              <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', borderRadius: '16px', padding: '1.5rem', color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '22px', flexShrink: 0 }}>
                  {selectedCustomer.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', marginBottom: '4px' }}>{selectedCustomer.name}</div>
                  <div style={{ opacity: 0.7, fontSize: '13px' }}>{selectedCustomer.email} · {selectedCustomer.phone}</div>
                  <div style={{ opacity: 0.7, fontSize: '13px', marginTop: '2px' }}>📍 {selectedCustomer.address}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${selectedCustomer.orders.reduce((s, o) => s + o.total, 0).toFixed(2)}</div>
                  <div style={{ opacity: 0.7, fontSize: '12px' }}>Total spent</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                  { label: 'Total orders',  value: selectedCustomer.orders.length,                                       icon: '🧾' },
                  { label: 'Delivered',     value: selectedCustomer.orders.filter(o => o.status === 'delivered').length, icon: '✅' },
                  { label: 'In progress',   value: selectedCustomer.orders.filter(o => o.status !== 'delivered').length, icon: '🚚' },
                  { label: 'Member since',  value: selectedCustomer.joined,                                              icon: '📅' },
                ].map(stat => (
                  <div key={stat.label} style={{ ...S.card, textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{stat.icon}</div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1.1rem' }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '0.75rem', color: 'var(--text)' }}>Order history</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCustomer.orders.map(order => (
                  <div key={order.id} style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '0.875rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{order.id}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{order.date}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={S.pill(order.status)}>{STATUS_LABELS[order.status]}</span>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>${order.total.toFixed(2)}</div>
                      </div>
                    </div>
                    <div style={{ padding: '0.75rem 1rem' }}>
                      {order.products?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: i < order.products.length - 1 ? '8px' : 0, marginBottom: i < order.products.length - 1 ? '8px' : 0, borderBottom: i < order.products.length - 1 ? '1px dashed var(--border)' : 'none' }}>
                          <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Qty: {item.qty} · ${item.price.toFixed(2)} each</div>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>${(item.price * item.qty).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '0 1rem 0.875rem' }}>
                      <div style={{ background: 'var(--bg)', borderRadius: '6px', height: '5px', overflow: 'hidden' }}>
                        <div style={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '65%' : '20%', height: '100%', borderRadius: '6px', background: statusColors[order.status], transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {CUSTOMERS.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>👥</div>
                  <div>No customers yet. They'll appear here once someone places an order.</div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CUSTOMERS.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
                      {c.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{c.email} · Joined {c.joined}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>${c.orders.reduce((s, o) => s + o.total, 0).toFixed(2)}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{c.orders.length} orders</div>
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '20px', marginLeft: '4px' }}>›</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}