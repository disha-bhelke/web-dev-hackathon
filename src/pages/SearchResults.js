import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

// 🔹 Mock supplier data
const suppliers = [
  {
    id: 1,
    name: 'Fresh Farms',
    location: 'Delhi',
    rating: 4.5,
    products: [
      { name: 'Tomato', price: 20 },
      { name: 'Onion', price: 18 }
    ]
  },
  {
    id: 2,
    name: 'Organic Mart',
    location: 'Mumbai',
    rating: 4.1,
    products: [
      { name: 'Tomato', price: 22 },
      { name: 'Cabbage', price: 16 }
    ]
  },
  {
    id: 3,
    name: 'SpiceHub',
    location: 'Hyderabad',
    rating: 3.9,
    products: [
      { name: 'Turmeric', price: 120 },
      { name: 'Ginger', price: 90 }
    ]
  }
];

function SearchResults() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') || '');
  }, []);

  const handleAddToCart = (supplier, product) => {
    alert(`${product.name} added to cart from ${supplier.name}`);
    setCart([...cart, {
      supplierName: supplier.name,
      productName: product.name,
      price: product.price
    }]);
  };

  const results = suppliers.flatMap(supplier =>
    supplier.products
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .map(product => ({ supplier, product }))
  );

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      <div className="product-grid">
        {results.length > 0 ? (
          results.map(({ supplier, product }, index) => (
            <ProductCard
              key={index}
              supplier={supplier}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
