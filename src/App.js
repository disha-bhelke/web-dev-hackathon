import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
// import Suppliers from './pages/Suppliers';
import Order from './pages/Order';
import Cart from './pages/Cart';
import AddSupplier from './pages/add-supplier';
import UserRoleSelection from './pages/UserRoleSelection';
import './styles.css';

// ✅ Custom wrapper to conditionally show Header
function AppWrapper() {
  const location = useLocation();

  // ✅ Hide Header only on the role selection page
  const hideHeader = location.pathname === '/' || location.pathname === '/add-supplier';

  return (
    <>
      {!hideHeader && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<UserRoleSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          {/* <Route path="/suppliers" element={<Suppliers />} /> */}
          <Route path="/order/:supplierId" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-supplier" element={<AddSupplier />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
