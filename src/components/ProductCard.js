import React from 'react';

function ProductCard({ supplier, product, onAddToCart }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p><strong>Price:</strong> ₹{product.price}/kg</p>
      <p><strong>Supplier:</strong> {supplier.name}</p>
      <p><strong>Location:</strong> {supplier.location}</p>
      <p><strong>Rating:</strong> ⭐ {supplier.rating}</p>
      <button onClick={() => onAddToCart(supplier, product)}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
