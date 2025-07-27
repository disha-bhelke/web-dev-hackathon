import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setQuery(q);

    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/vendor/search?q=${q}`);
        const { productName, productId, suppliers } = res.data;

        const formattedResults = suppliers.map((supplier) => ({
          supplier: {
            ...supplier,
            productId: productId, // Pass productId to supplier object
          },
          product: {
            name: productName,
            price: supplier.productPrice,
          },
        }));

        setResults(formattedResults);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Server error');
        setLoading(false);
      }
    };

    if (q) fetchResults();
  }, []);

  const handleAddToCart = async (supplier, product) => {
  try {
    setCart((prevCart) => [
      ...prevCart,
      {
        supplierName: supplier.supplierName,
        productName: product.name,
        price: product.price,
      },
    ]);

    // Call the like API
    const response = await axios.post('http://localhost:5000/api/vendor/like', {
      productId: supplier.productId,
      supplierId: supplier._id,
    });

    const message = response.data.message || '';
    alert(message); // ✅ Will show "Already liked" or "Supplier liked successfully"
    console.log('👍 Like API response:', response.data);

  } catch (err) {
    console.error('❌ Error liking supplier:', err.response?.data || err.message);
    alert('Failed to like supplier');
  }
};

  return (
    <div>
      <h2>Search Results for "{query}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : results.length > 0 ? (
        <div className="product-grid">
          {results.map(({ supplier, product }, index) => (
            <ProductCard
              key={index}
              supplier={supplier}
              product={product}
              onAddToCart={() => handleAddToCart(supplier, product)}
            />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default SearchResults;
