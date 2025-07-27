import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaMicrophone } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const startVoiceSearch = () => {
    const recognition = new window.SpeechRecognition() || new window.webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();

    recognition.onresult = (event) => {
      const voiceSearchResult = event.results[0][0].transcript;
      setSearchQuery(voiceSearchResult);
      window.location.href = `/search?q=${voiceSearchResult}`;
    };
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      window.location.href = `/search?q=${searchQuery}`;
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
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
        <FaMicrophone className="mic-icon" onClick={startVoiceSearch} />
      </div>

      <div className="nav-section">
        <nav className="nav-links">
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/cart"><FaShoppingCart size={20} /></Link>
          <Link to="/profile"><FaUserCircle size={20} /></Link>
        </nav>

        <div className="language-select">
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>
          <IoIosArrowDown />
        </div>
      </div>
    </header>
  );
}

export default Header;
