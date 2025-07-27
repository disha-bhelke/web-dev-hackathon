import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Suppliers.css'; // ✅ CSS file you'll create

const suppliers = [
  { id: 1, name: 'Fresh Farms', category: 'Vegetables', location: 'Delhi' },
  { id: 2, name: 'Spicy Masters', category: 'Spices', location: 'Mumbai' },
  { id: 3, name: 'Meat Direct', category: 'Meat', location: 'Kolkata' },
  { id: 4, name: 'Fruit Basket', category: 'Fruits', location: 'Chennai' },
];

function Suppliers() {
  const [filter, setFilter] = useState('');

  const filteredSuppliers = suppliers.filter((supplier) =>
    filter ? supplier.category.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <div className="suppliers-container">
       <span className="star"></span>
      <span className="star"></span>
      <span className="star"></span>
      <span className="star"></span>
      <span className="star"></span>

      <h2 className="animated-title">Browse Trusted Suppliers</h2>
      <input
        className="search-input"
        type="text"
        placeholder="Search by category (e.g., Vegetables, Spices)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="supplier-grid">
        {filteredSuppliers.map((supplier, index) => (
          <div className="supplier-card slide-in" key={supplier.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <h3>{supplier.name}</h3>
            <p><strong>Category:</strong> {supplier.category}</p>
            <p><strong>Location:</strong> {supplier.location}</p>
            <Link to={`/order/${supplier.id}`} className="view-button">View Products</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Suppliers;
