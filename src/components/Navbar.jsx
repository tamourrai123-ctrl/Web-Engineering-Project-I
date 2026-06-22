import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ page, setPage, user, onLogout }) {
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const NAV_ITEMS = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'products', label: 'Shop', icon: '🛍️' },
    { key: 'cart', label: 'Cart', icon: '🛒' },
    { key: 'orders', label: 'Orders', icon: '📦' },
    { key: 'chat', label: 'AI Chat', icon: '🤖' },
    { key: 'shopper', label: 'My Account', icon: '👤' },
    ...(user?.role === 'admin' ? [{ key: 'admin', label: 'Admin', icon: '⚙️' }] : []),
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => setPage('home')}>
        Smart<span>Shop</span>
      </div>
      <div className="nav-links">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-btn ${page === item.key ? 'active' : ''}`}
            onClick={() => setPage(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.key === 'cart' && cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        ))}
        <div className="theme-switch-group">
          <span className="theme-switch-label">Dark Mode</span>
          <button
            className={`theme-switch ${theme === 'dark' ? 'is-dark' : ''}`}
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-switch-track">
              <span className="theme-switch-thumb" />
            </span>
          </button>
        </div>
        {user ? (
          <button className="nav-btn" onClick={onLogout} style={{ color: 'var(--accent)' }}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        ) : (
          <button className="nav-btn" onClick={() => setPage('login')} style={{ color: 'var(--accent)' }}>
            <span className="nav-icon">🔑</span>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}