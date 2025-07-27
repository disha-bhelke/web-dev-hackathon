import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // ✅ Ensure this path is correct

function Product() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vendor/");
        setProductList(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading products...</p>;

  if (productList.length === 0)
    return <p style={{ textAlign: 'center', color: 'gray' }}>No products found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>All Available Suppliers</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {productList.map((product, index) =>
          product.suppliers.map((supplier, i) => (
            <ProductCard
              key={`${index}-${i}`}
              product={{
                name: product.productName,
                price: supplier.productPrice,
              }}
              supplier={supplier}
              onAddToCart={() =>
                alert(
                  `✅ Added "${product.productName}" from "${supplier.supplierName}" to cart!`
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Product;
