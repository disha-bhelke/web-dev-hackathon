import React, { useState } from 'react';
import './Suppliers.css'; 

function AddSupplier() {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierContact: '',
    supplierAddress: '',
    productQuantity: '',
    productPrice: '',
    deliver: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Supplier added successfully');
        setFormData({
          supplierName: '',
          supplierContact: '',
          supplierAddress: '',
          productQuantity: '',
          productPrice: '',
          deliver: false,
        });
      } else {
        alert('Failed to add supplier');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error');
    }
  };

  return (
    <div className="suppliers-container">
      <h2 className="animated-title">Add New Supplier</h2>
      <form className="supplier-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="Product"
          placeholder="Product"
          value={formData.Product}
          onChange={handleChange}
          required
          className="search-input"
          style={{ border: '2px solid black' }}
        />
        <input
          type="text"
          name="supplierName"
          placeholder="Supplier Name"
          value={formData.supplierName}
          onChange={handleChange}
          required
          className="search-input"
          style={{ border: '2px solid black' }}
        />
        <input
          type="text"
          name="supplierContact"
          placeholder="Contact Number"
          value={formData.supplierContact}
          onChange={handleChange}
          required
          className="search-input"
          style={{ border: '2px solid black' }}
        />
        <input
          type="text"
          name="supplierAddress"
          placeholder="Address"
          value={formData.supplierAddress}
          onChange={handleChange}
          required
          className="search-input"
          style={{ border: '2px solid black' }}
        />
        <input
          type="number"
          name="productQuantity"
          placeholder="Product Quantity (kg)"
          value={formData.productQuantity}
          onChange={handleChange}
          required
          className="search-input"
          style={{ border: '2px solid black' }}
        />
        <input
          type="number"
          name="productPrice"
          placeholder="Price per kg (₹)"
          value={formData.productPrice}
          onChange={handleChange}
          required
          className="search-input"
          style={{ border: '2px solid black' }}
        />
        <label style={{ marginBottom: '1rem', display: 'block' }}>
          <input
            type="checkbox"
            name="deliver"
            checked={formData.deliver}
            onChange={handleChange}
            style={{ border: '2px solid black' }}
          />{' '}
          Willing to deliver?
        </label>
        <button type="submit" className="view-button">Add Supplier</button>
      </form>
    </div>
  );
}

export default AddSupplier;
