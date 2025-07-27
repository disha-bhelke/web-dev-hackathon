import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaMicrophone } from 'react-icons/fa';
// import { IoIosArrowDown } from 'react-icons/io';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const voiceSearchResult = event.results[0][0].transcript;
      setSearchQuery(voiceSearchResult);
      window.location.href = `/search?q=${voiceSearchResult}`;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition failed. Please try again.");
    };
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      window.location.href = `/search?q=${searchQuery}`;
    }
  };

  return (
    <header className="header">
      <Link to="/home" className="logo">
        <h1>Bharosa Bazaar</h1>
      </Link>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for raw materials, suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="search-input"
        />
        <FaMicrophone
          className="mic-icon"
          onClick={startVoiceSearch}
          style={{
            marginLeft: '10px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '18px',
            transition: 'color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'blue')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'white')}
        />
      </div>

      <div className="nav-section">
        <nav className="nav-links">
          <Link to="/cart"><FaShoppingCart size={20}
                            style={{
                                marginLeft: '10px',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: '18px',
                                transition: 'color 0.3s',
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.color = 'blue')}
                              onMouseOut={(e) => (e.currentTarget.style.color = 'white')}
          /></Link>
          <Link to="/profile"><FaUserCircle size={20} 
                            style={{
                              marginLeft: '10px',
                              cursor: 'pointer',
                              color: 'white',
                              fontSize: '18px',
                              transition: 'color 0.3s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.color = 'blue')}
                            onMouseOut={(e) => (e.currentTarget.style.color = 'white')}
          /></Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
