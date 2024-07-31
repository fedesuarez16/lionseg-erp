import React from 'react';

const SearchBarInvoice = ({ searchQuery, setSearchQuery }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white">Generador de Facturas</h1>
        <input
          type="text"
          placeholder="Buscar por nombre del cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded"
        />
      </div>
    </nav>
  );
};

export default SearchBarInvoice;
