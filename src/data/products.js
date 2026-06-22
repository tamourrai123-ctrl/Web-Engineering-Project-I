export const PRODUCTS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', cat: 'Electronics', price: 89.99, emoji: '🎧', rating: 4.8, stock: 23, description: 'Premium audio experience with active noise cancellation, 30-hour battery life, and foldable design.' },
  { id: 2, name: 'Smart Fitness Watch', cat: 'Electronics', price: 149.99, emoji: '⌚', rating: 4.7, stock: 15, description: 'Track your health 24/7 with heart rate, sleep, SpO2 monitoring and built-in GPS.' },
  { id: 3, name: 'Bluetooth Speaker', cat: 'Electronics', price: 59.99, emoji: '🔊', rating: 4.5, stock: 34, description: 'Portable 360° sound with 12-hour battery, IPX7 waterproof rating and deep bass.' },
  { id: 4, name: 'Laptop Backpack', cat: 'Clothing', price: 45.99, emoji: '🎒', rating: 4.6, stock: 50, description: 'Fits up to 17" laptops with USB charging port, anti-theft pocket and ergonomic straps.' },
  { id: 5, name: 'Running Sneakers', cat: 'Sports', price: 79.99, emoji: '👟', rating: 4.9, stock: 18, description: 'Lightweight responsive foam sole with breathable mesh upper, ideal for road running.' },
  { id: 6, name: 'Yoga Mat Premium', cat: 'Sports', price: 34.99, emoji: '🧘', rating: 4.4, stock: 42, description: 'Extra thick 6mm non-slip mat with alignment lines, eco-friendly TPE material.' },
  { id: 7, name: 'Coffee Maker Deluxe', cat: 'Home', price: 99.99, emoji: '☕', rating: 4.7, stock: 11, description: 'Brew up to 12 cups with programmable timer, built-in grinder and thermal carafe.' },
  { id: 8, name: 'Scented Candle Set', cat: 'Home', price: 24.99, emoji: '🕯️', rating: 4.5, stock: 60, description: 'Set of 6 hand-poured soy wax candles in calming aromas like lavender, vanilla and cedar.' },
  { id: 9, name: 'Slim Fit Jacket', cat: 'Clothing', price: 69.99, emoji: '🧥', rating: 4.3, stock: 27, description: 'Water-resistant shell with fleece lining, packable into its own pocket.' },
  { id: 10, name: 'Gaming Mouse', cat: 'Electronics', price: 49.99, emoji: '🖱️', rating: 4.6, stock: 38, description: '16000 DPI optical sensor, 7 programmable buttons, RGB lighting and 80-hour battery.' },
  { id: 11, name: 'Resistance Bands Set', cat: 'Sports', price: 19.99, emoji: '💪', rating: 4.5, stock: 75, description: 'Set of 5 bands with varying resistance levels, includes door anchor and carrying bag.' },
  { id: 12, name: 'Throw Blanket', cat: 'Home', price: 39.99, emoji: '🛋️', rating: 4.8, stock: 33, description: 'Ultra-soft sherpa fleece blanket, 50x60 inches, machine washable in 8 colors.' }
];

export const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Sports'];

// Orders now come from Supabase — this starts empty rather than seeded
// with fake demo data.
export const INITIAL_ORDERS = [];

export const CUSTOMERS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '+1 555-0101',
    address: '12 Maple St, New York, NY',
    joined: 'Jan 2026',
    orders: []
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@email.com',
    phone: '+1 555-0202',
    address: '88 Oak Ave, San Francisco, CA',
    joined: 'Feb 2026',
    orders: []
  },
  {
    id: 3,
    name: 'Amara Osei',
    email: 'amara@email.com',
    phone: '+1 555-0303',
    address: '5 Birch Rd, Chicago, IL',
    joined: 'Dec 2025',
    orders: []
  },
  {
    id: 4,
    name: 'Lucas Silva',
    email: 'lucas@email.com',
    phone: '+1 555-0404',
    address: '33 Pine Blvd, Austin, TX',
    joined: 'Mar 2026',
    orders: []
  },
  {
    id: 5,
    name: 'Priya Patel',
    email: 'priya@email.com',
    phone: '+1 555-0505',
    address: '21 Cedar Lane, Seattle, WA',
    joined: 'Feb 2026',
    orders: []
  },
];