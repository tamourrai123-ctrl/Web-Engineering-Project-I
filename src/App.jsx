import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import ShopperDashboard from './pages/ShopperDashboard';
import Chatbot from './components/Chatbot';
import './index.css';

const AUTH_REQUIRED_PAGES = ['orders', 'shopper', 'admin'];

const ADMIN_USER = {
  id: 'admin-hardcoded',
  email: 'admin@smartshop.com',
  role: 'admin',
  name: 'Admin',
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [prevPage, setPrevPage] = useState('products');
  const [postLoginPage, setPostLoginPage] = useState('home');
  const [authLoading, setAuthLoading] = useState(true);

  const buildUser = (supabaseUser) => ({
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.full_name ?? supabaseUser.email,
    avatar: supabaseUser.user_metadata?.avatar_url ?? null,
    role: 'shopper',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = buildUser(session.user);
        setUser(u);
        const pending = sessionStorage.getItem('postLoginPage');
        if (pending) {
          sessionStorage.removeItem('postLoginPage');
          setPage(u.role === 'admin' ? 'admin' : pending);
        } else {
          setPage('home');
        }
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(buildUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage(userData.role === 'admin' ? 'admin' : postLoginPage);
  };

  const handleAdminLogin = () => {
    setUser(ADMIN_USER);
    setPage('admin');
  };

  const handleLogout = async () => {
    if (user?.id !== 'admin-hardcoded') {
      await supabase.auth.signOut();
    }
    setUser(null);
    setPage('home');
  };

  const goToProduct = (productId, from = 'products') => {
    setPrevPage(from);
    setSelectedProduct(productId);
    setPage('product-detail');
  };

  const goBack = () => {
    setPage(prevPage);
    setSelectedProduct(null);
  };

  const navigate = (targetPage) => {
    if (!user && AUTH_REQUIRED_PAGES.includes(targetPage)) {
      setPostLoginPage(targetPage);
      sessionStorage.setItem('postLoginPage', targetPage);
      setPage('login');
      return;
    }
    setPage(targetPage);
  };

  if (authLoading) {
    return (
      <ThemeProvider>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif', color: 'var(--accent2)', background: 'var(--bg)' }}>
          Loading…
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <CartProvider user={user}>
        <div id="app">
          <Navbar page={page} setPage={navigate} user={user} onLogout={handleLogout} />
          <main>
            {page === 'home' && <Home setPage={navigate} goToProduct={goToProduct} user={user} />}
            {page === 'products' && <Products goToProduct={goToProduct} />}
            {page === 'product-detail' && <ProductDetail productId={selectedProduct} onBack={goBack} />}
            {page === 'login' && <Login onAdminLogin={handleAdminLogin} onLogin={handleLogin} navigate={navigate} />}
            {page === 'chat' && (
              <div className="page active">
                <div className="section-title">AI Shopping Assistant</div>
                <Chatbot />
              </div>
            )}

            {page === 'cart' && <Cart setPage={navigate} />}
            {page === 'checkout' && <Checkout setPage={navigate} user={user} />}

            {page === 'orders' && (user ? <Orders setPage={navigate} /> : <Login onAdminLogin={handleAdminLogin} onLogin={handleLogin} navigate={navigate} />)}
            {page === 'shopper' && (user ? <ShopperDashboard setPage={navigate} goToProduct={goToProduct} /> : <Login onAdminLogin={handleAdminLogin} onLogin={handleLogin} navigate={navigate} />)}
            {page === 'admin' && (user?.role === 'admin' ? <AdminDashboard /> : <Login onAdminLogin={handleAdminLogin} onLogin={handleLogin} navigate={navigate} />)}
          </main>
        </div>
        <Toast />
      </CartProvider>
    </ThemeProvider>
  );
}