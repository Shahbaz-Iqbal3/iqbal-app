import React from 'react';


const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search poems..."
      value={value}
      onChange={onChange}
      className="search-bar"
    />
  );
};


export default SearchBar;
