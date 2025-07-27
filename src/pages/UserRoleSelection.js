import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Suppliers.css';

function UserRoleSelection() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleContinue = () => {
    if (!role) {
      alert('Please select a role');
      return;
    }

    if (role === 'vendor') {
      navigate('/home');
    } else if (role === 'supplier') {
      navigate('/add-supplier');
    }
  };

  const roleButtonStyle = (selected) => ({
    padding: '1rem 2.5rem',
    fontSize: '1.2rem',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
    backgroundColor: selected ? '#2e7d32' : '#4caf50',
    color: 'white',
    boxShadow: selected ? '0 0 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.15)',
  });

  return (
    <div className="suppliers-container">
      <h2 className="animated-title">Welcome to Bharosa Bazaar</h2>
      <p className="subtitle">Please select your role to continue:</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => handleSelection('vendor')}
          style={roleButtonStyle(role === 'vendor')}
        >
          I am a Vendor
        </button>

        <button
          onClick={() => handleSelection('supplier')}
          style={roleButtonStyle(role === 'supplier')}
        >
          I am a Supplier
        </button>
      </div>

      {/* ✅ Continue button uses view-button class only */}
      <button onClick={handleContinue} className="view-button">
        Continue
      </button>
    </div>
  );
}

export default UserRoleSelection;
