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
    <nav className=" p-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-gray-800 font-semibold text-xl">Listado de clientes</div>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre de cliente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-20 py-2 border-gray-300 border rounded"
          />
          <button
            onClick={handleSearch}
            className="text-gray-500 hover:text-gray-300"
          >
            Buscar
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
