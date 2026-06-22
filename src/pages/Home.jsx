import { useState } from 'react';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
export default function Home({ setPage, goToProduct, user }) {
  return (
    <div className="page active">

      {/* Hero */}
      <div className="hero">
        <h1>Shop smarter with AI</h1>
        <p>Browse thousands of products with personalized recommendations</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="hero-btn" onClick={() => setPage('products')}>
            Browse Products →
          </button>
          {!user && (
            <button className="hero-btn dark" onClick={() => setPage('login')}>
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Featured products */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div className="section-title" style={{ marginBottom: '2px' }}>Featured Products</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Handpicked just for you</div>
          </div>
          <button
            onClick={() => setPage('products')}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >
            View all →
          </button>
        </div>
        <div className="products-grid">
          {PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} goToProduct={(id) => goToProduct(id, 'home')} />
          ))}
        </div>
      </div>

      {/* Recommended products */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div className="section-title" style={{ marginBottom: '2px' }}>Recommended for You</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {user ? `Based on your activity, ${user.name?.split(' ')[0]}` : 'Sign in for personalised picks'}
            </div>
          </div>
          <button
            onClick={() => setPage('products')}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >
            View all →
          </button>
        </div>
        <div className="products-grid">
          {PRODUCTS.slice(4, 8).map((p) => (
            <ProductCard key={p.id} product={p} goToProduct={(id) => goToProduct(id, 'home')} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--accent2)', marginBottom: '10px' }}>
              Smart<span style={{ color: 'var(--accent)' }}>Shop</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '200px' }}>
              AI-powered shopping designed to find you the best products at the best prices.
            </div>
          </div>

          {/* Shop links */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>Shop</div>
            {[
              { label: 'All Products', page: 'products' },
              { label: 'My Orders',    page: 'orders'   },
              { label: 'My Cart',      page: 'cart'     },
              { label: 'AI Assistant', page: 'chat'     },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => setPage(link.page)}
                  style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >
                  {link.label}
                </button>
              </div>
            ))}
          </div>

          {/* Account links */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>Account</div>
            {[
              { label: user ? 'My Dashboard' : 'Sign In',    page: user ? 'shopper' : 'login' },
              { label: 'Admin Panel',                         page: 'admin'   },
              { label: 'Wishlist',                            page: 'shopper' },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => setPage(link.page)}
                  style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'var(--muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >
                  {link.label}
                </button>
              </div>
            ))}
          </div>

          {/* Contact / email */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>Contact Us</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px', lineHeight: 1.6 }}>
              Have a question? Drop us a message and we'll get back to you within 24 hours.
            </div>
            <ContactForm />
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>© {new Date().getFullYear()} SmartShop. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
              <span key={label} style={{ fontSize: '12px', color: 'var(--muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >{label}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

function ContactForm() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus]   = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async () => {
    if (!email || !message) return;
    setStatus('sending');
    try {
      // TODO: wire up to Supabase Edge Function
      // const { error } = await supabase.functions.invoke('send-contact-email', {
      //   body: { email, message },
      // });
      // if (error) throw error;
      await new Promise(r => setTimeout(r, 800)); // simulate for now
      setStatus('sent');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'sent') {
    return (
      <div style={{ background: 'rgba(45,122,79,0.08)', border: '1px solid rgba(45,122,79,0.2)', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: 'var(--success)' }}>
        ✅ Message sent! We'll be in touch soon.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
      />
      <textarea
        placeholder="Your message…"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={3}
        style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', background: 'var(--bg)', color: 'var(--text)', outline: 'none', resize: 'vertical' }}
      />
      {status === 'error' && (
        <div style={{ fontSize: '12px', color: '#c0392b' }}>Something went wrong. Please try again.</div>
      )}
      <button
        onClick={handleSubmit}
        disabled={status === 'sending' || !email || !message}
        style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s', opacity: (!email || !message) ? 0.6 : 1 }}
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </div>
  );
}