import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // ✅ Ensure correct path
import { Link } from 'react-router-dom';
import './Cart.css'; // ✅ Optional for styling

function Cart() {
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/vendor/liked`);
        setLikedItems(res.data.likedSuppliers || []);
      } catch (err) {
        console.error("❌ Error fetching liked items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedItems();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  if (likedItems.length === 0) {
    return (
      <div className="cart-container animate-cart">
        <div className="cart-box">
          <img
            src="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/100/000000/external-cart-shopping-and-commerce-smashingstocks-flat-smashing-stocks.png"
            alt="Empty Cart"
            className="cart-icon"
          />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet!</p>
          <Link to="/home">
            <button className="explore-btn">Explore Products</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Liked Products</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px'
      }}>
        {likedItems.map((item, index) => (
          <ProductCard
            key={index}
            supplier={{
              supplierName: item.supplierName,
              supplierContact: item.supplierContact,
              supplierAddress: item.supplierAddress || "N/A",
              productQuantity: item.productQuantity,
              distance: item.distance // If not available, ProductCard handles it
            }}
            product={{
              name: item.productName,
              price: item.productPrice
            }}
            onAddToCart={() => alert(`Added ${item.productName} to cart!`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Cart;