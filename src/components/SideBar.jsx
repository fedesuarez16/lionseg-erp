// Sidebar.js
import React, { useState } from 'react';
import logo from './logo.png'; // Importa tu logo aquí
import { Link } from 'react-router-dom'; // Import Link

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`bg-gray-900 text-white w-${isSidebarOpen ? '64' : '16'} p-4 transition-all`}>
      {/* Logo */}
      <div className="flex justify-start items-center p-4 mb-4">
        <img src={logo} alt="Logo" className="w-40 h-16" /> {/* Ajusta el tamaño del logo según tus necesidades */}
      </div>

      {/* Sidebar Content */}
      {isSidebarOpen && (
        <ul className='mx-auto text-center'>
          <li className="mb-2">
            <Link to="/clients" className="block text-white hover:bg-blue-600 p-2 rounded">
              Lista de Clientes
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/facturas" className="block text-white hover:bg-blue-600 p-2 rounded">
              Lista de Facturas
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/clients" className="block text-white hover:bg-blue-600 p-2 rounded">
              Lista de Transacciones
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/reportes" className="block text-white hover:bg-blue-600 p-2 rounded">
              Reportes
            </Link>
          </li>
        </ul>
      )}

      {/* Sidebar Toggle Button */}
      <button
        className="bg-white text-black hover:bg-gray-700 p-2 rounded"
        onClick={handleSidebarToggle}
      >
      </button>
    </div>
  );
};

export default Sidebar;
