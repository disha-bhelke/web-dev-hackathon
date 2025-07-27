import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Suppliers from './pages/Suppliers';
import Order from './pages/Order';
import Cart from './pages/Cart';
import './styles.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/order/:supplierId" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;