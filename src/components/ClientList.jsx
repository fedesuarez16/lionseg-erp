import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AddClient from './AddClient';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faEnvelope, faPhone, faCalendar, faFileInvoice, faWhatsapp } from '@fortawesome/free-solid-svg-icons';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddClientVisible, setIsAddClientVisible] = useState(false);
  const [processingClient, setProcessingClient] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  const fetchClients = async () => {
    try {
      const response = await axios.get(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes?search=${searchQuery}`);
      const sortedClients = response.data.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
      setClients(sortedClients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  const handleAddClientToggle = () => {
    setIsAddClientVisible(!isAddClientVisible);
  };

  const handleClientAdded = () => {
    fetchClients();
    setIsAddClientVisible(false);
  };

  const handleSearch = (searchQuery) => {
    console.log('Search Query:', searchQuery);
  };

  const handleStateChange = async (clientId, newState) => {
    try {
      const response = await axios.put(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`, { state: newState });
      if (response.status === 200) {
        setClients(clients.map(client => client._id === clientId ? response.data : client));
      }
    } catch (error) {
      console.error('Error updating client state:', error);
    }
  };

  // Renderizar badge de estado
  const renderStateBadge = (state) => {
    const badgeClass = state === 'activo' 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-red-100 text-red-800 border-red-300';
    
    const stateText = state === 'activo' ? 'Activo' : 'Inactivo';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass} border`}>
        {stateText}
      </span>
    );
  };
 
  const generarFactura = async (clientId) => {
    setProcessingClient(clientId);
    try {
      // Obtener los detalles del cliente
      const clientResponse = await axios.get(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`);
      const clientData = clientResponse.data;
  
      // Extraer datos del cliente
      const clientPhone = clientData.phoneNumber;
      const clientName = clientData.name;
  
      // Validar si hay servicios y obtener precio y producto
      if (!clientData.services.length) {
        alert('El cliente no tiene servicios registrados.');
        setProcessingClient(null);
        return;
      }
  
      const monto = clientData.services[0].price || 0;
      const servicioDescripcion = clientData.services[0].producto || "Servicio contratado";
  
      // Generar la factura con los datos corregidos
      const facturaResponse = await axios.post(
        `https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/invoices`,
        {
          monto: monto,
          fechaVencimiento: new Date().toISOString().split('T')[0],
          descripcion: servicioDescripcion,
        }
      );
  
      // Obtener el enlace de la factura generada
      const facturaLink = facturaResponse.data.factura.fileName;
  
      // Construir la lista de servicios y montos
      const serviciosLista = clientData.services.map(servicio => `- ${servicio.producto}: $${servicio.price}`).join('\n');

      const mensajeWhatsApp = `Hola ${clientName}, Te enviamos la factura correspondiente al mes actual: https://storage.cloud.google.com/lionseg2/facturas/${facturaLink}

*Detalles de la factura:*
${serviciosLista}

Recorda pagar antes de los 7 dias para no recibir recargos. Luego de transferir a la cuenta de tu preferencia debes enviar el comprobante a este numero`;

      const whatsappURL = `https://wa.me/${clientPhone}?text=${encodeURIComponent(mensajeWhatsApp)}`;
  
      // Abrir en una nueva ventana
      window.open(whatsappURL, '_blank');
      
      // Actualizar lista de clientes después de generar factura
      fetchClients();
      
      alert('Factura generada con éxito y enviada a WhatsApp');
  
    } catch (error) {
      console.error('Error generando la factura o enviando a WhatsApp:', error);
      alert('Error al generar la factura');
    } finally {
      setProcessingClient(null);
    }
  };
  
  // Generar esqueletos de carga
  const loadingSkeletons = Array(8).fill(0).map((_, index) => (
    <tr key={`skeleton-${index}`} className="animate-pulse">
      <td colSpan="6" className="border-t border-b border-gray-200 px-4 py-4">
        <div className="h-6 bg-gray-200 rounded-md"></div>
      </td>
    </tr>
  ));
  
  return ( 
    <div className="p-4 bg-gray-50 min-h-screen h-auto relative">
      <Navbar onSearch={handleSearch} />
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-600 mr-2" />
            Listado de Clientes
          </h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              {clients.length} clientes en total
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {loading ? (
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Nombre</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Email</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Teléfono</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Registro</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Estado</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loadingSkeletons}
              </tbody>
            </table>
          ) : clients.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <FontAwesomeIcon icon={faUser} className="text-gray-300 text-5xl mb-3" />
              <p className="font-medium">No hay clientes para mostrar</p>
              <p className="text-sm text-gray-400 mt-1">Intenta agregar un nuevo cliente usando el botón +</p>
            </div>
          ) : (
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-1" />
                      Nombre
                    </span>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-1" />
                      Email
                    </span>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-1" />
                      Teléfono
                    </span>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faCalendar} className="text-gray-400 mr-1" />
                      Registro
                    </span>
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Estado
                  </th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-3 py-3 text-sm whitespace-nowrap">
                      <Link 
                        to={`/clients/${client._id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-sm whitespace-nowrap truncate">
                      <span className="text-gray-600" title={client.email}>{client.email}</span>
                    </td>
                    <td className="px-3 py-3 text-sm whitespace-nowrap">
                      <span className="text-gray-600">{client.phoneNumber}</span>
                    </td>
                    <td className="px-3 py-3 text-sm whitespace-nowrap">
                      <span className="text-gray-600">{new Date(client.creationDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-3 py-3 text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStateBadge(client.state)}
                        <select
                          value={client.state}
                          onChange={(e) => handleStateChange(client._id, e.target.value)}
                          className="ml-2 text-xs border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm whitespace-nowrap text-center">
                      <button 
                        onClick={() => generarFactura(client._id)} 
                        disabled={processingClient === client._id}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingClient === client._id ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <FontAwesomeIcon icon={faWhatsapp} className="mr-1" />
                        )}
                        {processingClient === client._id ? 'Enviando...' : 'Enviar Factura'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 inline-flex items-center justify-center p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out"
        onClick={handleAddClientToggle}
        title="Agregar nuevo cliente"
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>

      {isAddClientVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute top-4 right-4">
              <button 
                onClick={handleAddClientToggle}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <AddClient onClientAdded={handleClientAdded} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
