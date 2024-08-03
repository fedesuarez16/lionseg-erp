import React from 'react';

const IncomeNavbar = ({ searchQuery, setSearchQuery }) => {
  return (
    <nav className="bg-white border-b border-gray-300  p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-700 font-regular  text-xl">Listado de Facturas</h1>
    
      </div>
    </nav>
  );
};

export default IncomeNavbar;
