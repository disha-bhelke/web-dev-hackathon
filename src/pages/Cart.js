import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css'; // ⬅️ Create this file

function Cart() {
  return (
    <div className="cart-container animate-cart">
      <div className="cart-box">
        <img
          src="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/100/000000/external-cart-shopping-and-commerce-smashingstocks-flat-smashing-stocks.png"
          alt="Empty Cart"
          className="cart-icon"
        />
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven’t added anything yet!</p>
        <Link to="/search">
          <button className="explore-btn">Explore Products</button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;
