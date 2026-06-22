import { createContext, useContext, useState } from 'react';
import { PRODUCTS, INITIAL_ORDERS } from '../data/products';

const CartContext = createContext(null);

export function CartProvider({ children, user }) {
  const [cart, setCart]         = useState({});
  const [orders, setOrders]     = useState(INITIAL_ORDERS);
  const [toast, setToast]       = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [profile, setProfile]   = useState({
    name: 'You',
    email: 'you@email.com',
    phone: '',
    address: '',
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    showToast('Added to cart!');
  };

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty  = (next[id] || 0) + delta;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const removeItem = (id) => {
    setCart((prev) => { const next = { ...prev }; delete next[id]; return next; });
    showToast('Item removed');
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const cartItems = PRODUCTS.filter((p) => cart[p.id]);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal  = cartItems.reduce((s, p) => s + p.price * cart[p.id], 0);

  const isLoggedIn = !!user;
  const discount   = isLoggedIn ? subtotal * 0.05 : 0;
  const shipping   = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const total      = subtotal - discount + shipping;

  const placeOrder = (contactInfo) => {
    if (cartItems.length === 0) return null;

    const info = {
      name:    contactInfo?.name    || profile.name,
      email:   contactInfo?.email   || profile.email,
      phone:   contactInfo?.phone   || profile.phone,
      address: contactInfo?.address || profile.address,
    };

    const newOrder = {
      id:           '#SS-' + Math.floor(1044 + Math.random() * 900),
      date:         new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items:        cartItems.map((p) => p.name).join(', '),
      products:     cartItems.map((p) => ({ ...p, qty: cart[p.id] })),
      subtotal,
      discount,
      shipping,
      total,
      status:       'processing',
      progress:     20,
      customer:     info.name,
      shippingInfo: info,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Upsert customer — match by email, create if new
    setCustomers((prev) => {
      const existing = prev.find(c => c.email === info.email);
      if (existing) {
        return prev.map(c =>
          c.email === info.email
            ? { ...c, orders: [newOrder, ...c.orders] }
            : c
        );
      }
      return [
        {
          id:      Date.now(),
          name:    info.name,
          email:   info.email,
          phone:   info.phone   || '—',
          address: info.address || '—',
          joined:  new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          orders:  [newOrder],
        },
        ...prev,
      ];
    });

    setCart({});
    showToast('Order placed successfully!');
    return newOrder;
  };

  return (
    <CartContext.Provider value={{
      cart, cartItems, cartCount, subtotal, discount, isLoggedIn, shipping, total,
      orders, customers, toast, wishlist, profile,
      addToCart, changeQty, removeItem, placeOrder,
      toggleWishlist, setProfile, showToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}