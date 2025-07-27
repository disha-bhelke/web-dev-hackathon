import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const supplierDetails = {
  1: { name: 'Fresh Farms', category: 'Vegetables', location: 'Delhi', products: ['Tomato', 'Onion', 'Cabbage'] },
  2: { name: 'Spicy Masters', category: 'Spices', location: 'Mumbai', products: ['Chili Powder', 'Turmeric', 'Ginger'] },
  3: { name: 'Meat Direct', category: 'Meat', location: 'Kolkata', products: ['Chicken', 'Beef', 'Mutton'] },
  4: { name: 'Fruit Basket', category: 'Fruits', location: 'Chennai', products: ['Apples', 'Bananas', 'Mangoes'] },
};

function Order() {
  const { supplierId } = useParams();
  const supplier = supplierDetails[supplierId];
  const navigate = useNavigate();

  const [order, setOrder] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleOrder = () => {
    alert(`Order placed for ${quantity} of ${order} from ${supplier.name}`);
    navigate('/suppliers');
  };

  return (
    <div>
      <h2>Place Order with {supplier.name}</h2>
      <p>Category: {supplier.category}</p>
      <p>Location: {supplier.location}</p>

      <h3>Products</h3>
      <ul>
        {supplier.products.map((product) => (
          <li key={product}>
            <button onClick={() => setOrder(product)}>{product}</button>
          </li>
        ))}
      </ul>

      {order && (
        <div>
          <h4>Order: {order}</h4>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
          <button onClick={handleOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default Order;
