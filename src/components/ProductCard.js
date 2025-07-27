import React from 'react';

// ✅ Helper function to capitalize each word
function capitalizeWords(str) {
  return str?.replace(/\b\w/g, char => char.toUpperCase()) || '';
}

function ProductCard({ supplier, product, onAddToCart }) {
  const handleClick = () => {
    onAddToCart();
  };

  return (
    <div className="product-card" style={{
      border: '1px solid #ccc',
      padding: '16px',
      borderRadius: '10px',
      margin: '10px',
      width: '250px'
    }}>
      <h3>{capitalizeWords(product.name) || "Unnamed Product"}</h3>

      <p><strong>Supplier:</strong> {capitalizeWords(supplier.supplierName) || "Unknown"}</p>
      <p><strong>Contact:</strong> {supplier.supplierContact || "N/A"}</p>
      <p><strong>Address:</strong> {capitalizeWords(supplier.supplierAddress) || "N/A"}</p>
      <p><strong>Quantity:</strong> {supplier.productQuantity || 0}</p>

      <p><strong>Price:</strong> ₹
        {typeof product.price === "number"
          ? product.price.toFixed(2)
          : "N/A"}
      </p>

      <p><strong>🧭 Distance:</strong> {supplier.distance
        ? `${supplier.distance.toFixed(2)} km`
        : "Unknown"}
      </p>

      <button onClick={handleClick} style={{
        padding: '10px 16px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
