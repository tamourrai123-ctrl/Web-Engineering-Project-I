import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ page, setPage, user, onLogout }) {
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { key: 'home',     label: 'Home',       icon: '🏠' },
    { key: 'products', label: 'Shop',        icon: '🛍️' },
    { key: 'cart',     label: 'Cart',        icon: '🛒' },
    { key: 'orders',   label: 'Orders',      icon: '📦' },
    { key: 'chat',     label: 'AI Chat',     icon: '🤖' },
    { key: 'shopper',  label: 'My Account',  icon: '👤' },
    ...(user?.role === 'admin' ? [{ key: 'admin', label: 'Admin', icon: '⚙️' }] : []),
  ];

  const handleNav = (key) => {
    setPage(key);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => handleNav('home')}>
        Smart<span>Shop</span>
      </div>

      {/* Desktop nav */}
      <div className="nav-links nav-links-desktop">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-btn ${page === item.key ? 'active' : ''}`}
            onClick={() => handleNav(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.key === 'cart' && cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        ))}

        <div className="theme-switch-group">
          <span className="theme-switch-label">Dark</span>
          <button
            className={`theme-switch ${theme === 'dark' ? 'is-dark' : ''}`}
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label="Toggle dark mode"
          >
            <span className="theme-switch-track">
              <span className="theme-switch-thumb" />
            </span>
          </button>
        </div>

        {user ? (
          <button className="nav-btn" onClick={handleLogout} style={{ color: 'var(--accent)' }}>
            <span className="nav-icon">🚪</span>Logout
          </button>
        ) : (
          <button className="nav-btn" onClick={() => handleNav('login')} style={{ color: 'var(--accent)' }}>
            <span className="nav-icon">🔑</span>Sign In
          </button>
        )}
      </div>

      {/* Mobile right side: cart icon + hamburger */}
      <div className="nav-mobile-right">
        <button className="nav-btn" onClick={() => handleNav('cart')} style={{ position: 'relative' }}>
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`mobile-menu-item ${page === item.key ? 'active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.key === 'cart' && cartCount > 0 && (
                <span className="cart-badge" style={{ marginLeft: 'auto' }}>{cartCount}</span>
              )}
            </button>
          ))}

          <div className="mobile-menu-divider" />

          <div className="mobile-menu-theme">
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Dark mode</span>
            <button
              className={`theme-switch ${theme === 'dark' ? 'is-dark' : ''}`}
              onClick={toggleTheme}
            >
              <span className="theme-switch-track">
                <span className="theme-switch-thumb" />
              </span>
            </button>
          </div>

          <div className="mobile-menu-divider" />

          {user ? (
            <button className="mobile-menu-item" onClick={handleLogout} style={{ color: 'var(--accent)' }}>
              <span>🚪</span>Logout
            </button>
          ) : (
            <button className="mobile-menu-item" onClick={() => handleNav('login')} style={{ color: 'var(--accent)' }}>
              <span>🔑</span>Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}