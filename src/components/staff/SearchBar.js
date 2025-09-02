// src/components/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css';
import { toast } from 'react-toastify';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for: ", query);
    toast.info("features coming soon");
    // Implement search logic here
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}  style={{ display: 'flex' }}>
      <input
        type="text"
        placeholder="Search records..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
