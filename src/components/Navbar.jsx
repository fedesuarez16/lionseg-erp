// Navbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
      navigate(`/clients?search=${searchQuery}`);
    onSearch(searchQuery);
    console.log('Search Query:', searchQuery); // Log search query to console
  };

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white  text-xl">Listado de clientes</div>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search clients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2 py-1 border rounded"
          />
          <button
            onClick={handleSearch}
            className="text-white hover:text-gray-300"
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
