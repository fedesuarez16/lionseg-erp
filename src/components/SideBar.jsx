// Sidebar.js
import React, { useState } from 'react';
import logo from './logo.png'; // Importa tu logo aquí
import { Link } from 'react-router-dom'; // Import Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronLeft, faChevronRight, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Implementa tu lógica de cerrar sesión aquí
    console.log("Cerrando sesión");
  };

  return (
    <div className={`bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} min-h-screen flex flex-col justify-between transition-all duration-300`}>
      <div>
        {/* Logo and Toggle Button */}
        <div className="flex justify-between items-center p-4 mb-4">
          <img src={logo} alt="Logo" className={`${isSidebarOpen ? 'w-18 h-10 mr-2' : 'hidden'}`}/> {/* Ajusta el tamaño del logo según tus necesidades */}
          <button
            className="bg-gray-800 text-white hover:bg-gray-700 p-2 rounded focus:outline-none"
            onClick={handleSidebarToggle}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faBars : faBars} />
          </button>
        </div>

        {/* Sidebar Content */}
        {isSidebarOpen && (
          <ul className="space-y-2">
            <li className="border-b border-gray-700">
              <Link to="/clients" className="block text-white hover:bg-gray-700 p-4 transition-colors duration-300">
                Lista de Clientes
              </Link>
            </li>
            <li className="border-b border-gray-700">
              <Link to="/facturas" className="block text-white hover:bg-gray-700 p-4 transition-colors duration-300">
                Lista de Facturas
              </Link> 
            </li>
            <li className="border-b border-gray-700">
              <Link to="/transactions" className="block text-white hover:bg-gray-700 p-4 transition-colors duration-300">
                Lista de Transacciones
              </Link>
            </li>
            <li className="border-b border-gray-700">
              <Link to="/reportes" className="block text-white hover:bg-gray-700 p-4 transition-colors duration-300">
                Reportes
              </Link>
            </li>
            <li className="border-b border-gray-700">
              <Link to="/factura-nueva" className="block text-white hover:bg-gray-700 p-4 transition-colors duration-300">
                Generar factura
              </Link>
            </li>
          </ul>
        )}
        {!isSidebarOpen && (
          <button
            className="fixed bottom-20 bg-gray-800 text-white hover:bg-gray-700 p-2 rounded focus:outline-none"
            onClick={handleSidebarToggle}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
      {/* Logout Button */}
      <div className="p-4">
        <button
          className="w-full flex items-center bg-gray-700 text-white hover:bg-red-700 p-2 rounded focus:outline-none"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          {isSidebarOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
