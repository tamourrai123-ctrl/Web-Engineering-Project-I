import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Products({ goToProduct }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchCat = category === 'All' || p.cat === category;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, category]);

  return (
    <div className="page active">
      <div className="filters">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="products-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} goToProduct={(id) => goToProduct(id, 'products')} />
          ))}
        </div>
      ) : (
        <p className="empty-text">No products found</p>
      )}
    </div>
  );
}