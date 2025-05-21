// components/members/SearchBar.jsx
import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="input-group">
      <span className="input-group-text bg-white">
        <Search size={18} />
      </span>
      <input 
        type="text" 
        className="form-control" 
        placeholder="Search members..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button 
          className="btn btn-outline-secondary" 
          type="button"
          onClick={() => setSearchTerm('')}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;