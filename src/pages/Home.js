import React from 'react';
import './Home.css';

import { Link } from 'react-router-dom';
import './Home.css'; // We'll create this next

function Home() {
  return (
    <div className="home-hero">
      <div className="floating-icons">
        <img src="https://img.icons8.com/color/96/samosa.png" alt="Samosa" className="icon icon1" />
        <img src="https://img.icons8.com/color/96/hamburger.png" alt="Vada Pav" className="icon icon2" />
        <img src="https://img.icons8.com/color/96/doughnut.png" alt="Pani Puri" className="icon icon3" />
        <img src="https://img.icons8.com/color/96/pizza.png" alt="Dosa" className="icon icon4" />
      </div>

      <div className="home-content animate-fade-in">
        <h1>Welcome to the <span className="highlight">Street Food Vendor Platform</span></h1>
        <p className="subtitle">Search for raw materials and compare trusted suppliers.</p>
        <Link to="/search">
          <button className="cta-button">Start Searching</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
