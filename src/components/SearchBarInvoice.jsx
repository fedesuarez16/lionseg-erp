import React from 'react';

const SearchBarInvoice = ({ searchQuery, setSearchQuery }) => {
  return (
    <nav className="bg-white border-b border-gray-300 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-800  text-xl">Listado de Facturas</h1>
        <input
          type="text"
          placeholder="Buscar por nombre del cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-12 py-2 border-gray-300 border rounded"
          />
      </div>
    </nav>
  );
};

export default SearchBarInvoice;
