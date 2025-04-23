import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import SearchBarInvoice from './SearchBarInvoice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFileInvoice, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';

const GeneradorFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'unpaid'
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleFacturas, setVisibleFacturas] = useState(50); // Número de facturas visibles inicialmente
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [allFacturasLoaded, setAllFacturasLoaded] = useState(false);

  const generarFacturas = async () => {
    try {
      const response = await axios.post('https://lionseg-df2520243ed6.herokuapp.com/api/generar-facturas');
      if (response.status === 200) {
        fetchFacturas();
        setError('');
      } else {
        setError('Error al generar las facturas');
      }
    } catch (error) {
      console.error('Error al generar las facturas:', error);
      setError('Error al generar las facturas');
    }
  };

  const fetchFacturas = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://lionseg-df2520243ed6.herokuapp.com/api/clientes');
      if (response.status === 200) {
        const facturasAplanadas = response.data.flatMap(cliente =>
          cliente.invoiceLinks.map(invoiceLink => ({
            ...invoiceLink,
            clienteId: cliente._id,
            clienteName: cliente.name,
            total: invoiceLink.total || cliente.services.reduce((acc, service) => acc + (service.price || 0), 0),
            paymentMethods: cliente.services.map(service => service.paymentMethod).filter(Boolean).join(', '),
          }))
        );
  
        // Ordenar por fecha de registro descendente
        const facturasOrdenadas = facturasAplanadas
          .sort((a, b) => new Date(b.registrationDate || 0) - new Date(a.registrationDate || 0));
  
        setFacturas(facturasOrdenadas);
        // Resetear la paginación al cargar nuevas facturas
        setVisibleFacturas(50);
        setAllFacturasLoaded(facturasOrdenadas.length <= 50);
        setError('');
      } else {
        setError('Error al obtener las facturas');
      }
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      setError('Error al obtener las facturas');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMoreFacturas = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleFacturas(prev => {
        const newValue = prev + 50;
        setAllFacturasLoaded(newValue >= filterAndSortFacturas(facturas).length);
        return newValue;
      });
      setIsLoading(false);
    }, 500); // Pequeño retraso para mostrar el spinner
  };

  const [refresh, setRefresh] = useState(false);

  const updateInvoiceLinkState = async (clienteId, invoiceLinkId, newState) => {
    try {
      const response = await axios.put(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clienteId}/invoiceLinks/${invoiceLinkId}/state`, {
        state: newState,
      });
  
      if (response.status === 200) {
        fetchFacturas();
        setRefresh(prev => !prev); // Esto forzará una re-renderización
        setError('');
      } else {
        setError('Error al actualizar el estado de la factura');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la factura:', error);
      setError('Error al actualizar el estado de la factura');
    }
  };
  

  const deleteInvoice = async (clienteId, invoiceLinkId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      return;
    }
    
    try {
      const response = await axios.delete(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clienteId}/invoiceLinks/${invoiceLinkId}`);
      if (response.status === 200) {
        fetchFacturas();
        setError('');
      } else {
        setError('Error al eliminar la factura');
      }
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
      setError('Error al eliminar la factura');
    }
  };

  const filterAndSortFacturas = (facturas) => {
    const facturasFiltradas = facturas.filter(invoiceLink => {
      if (filter === 'paid') {
        return invoiceLink.state === 'paid';
      } else if (filter === 'unpaid') {
        return invoiceLink.state !== 'paid';
      }
      return true;
    });

    const facturasBuscadas = facturasFiltradas.filter(invoiceLink =>
      invoiceLink.clienteName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return facturasBuscadas.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
  };

  useEffect(() => {
    fetchFacturas();
  }, [refresh]);

  // Cuando cambia el filtro o la búsqueda, revisar si todas las facturas están cargadas
  useEffect(() => {
    setAllFacturasLoaded(visibleFacturas >= filterAndSortFacturas(facturas).length);
  }, [filter, searchQuery, facturas, visibleFacturas]);

  const facturasToShow = filterAndSortFacturas(facturas).slice(0, visibleFacturas);
  
  // Generar esqueletos de carga
  const loadingSkeletons = Array(10).fill(0).map((_, index) => (
    <tr key={`skeleton-${index}`} className="animate-pulse">
      <td colSpan="8" className="border-t border-b border-gray-200 px-4 py-4">
        <div className="h-7 bg-gray-200 rounded-md"></div>
      </td>
    </tr>
  ));

  // Helper para obtener la clase CSS y texto basado en el estado
  const getStateStyles = (state) => {
    switch(state) {
      case 'paid':
        return {
          className: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
          text: 'Pagado'
        };
      case 'overdue':
        return {
          className: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
          text: 'Vencido'
        };
      default:
        return {
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
          text: 'Pendiente'
        };
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen h-auto relative">
      <SearchBarInvoice searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500 mr-2" />
            <span className="text-gray-600 font-medium mr-2">Filtrar:</span>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="all">Todas las facturas</option>
              <option value="paid">Facturas pagadas</option>
              <option value="unpaid">Facturas pendientes</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              Mostrando {facturasToShow.length} de {filterAndSortFacturas(facturas).length} facturas
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Factura
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Cliente
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                  Emisión
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                  Vencimiento
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                  Total
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10 hidden md:table-cell">
                  Método
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/10">
                  Estado
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                loadingSkeletons
              ) : facturasToShow.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center">
                      <FontAwesomeIcon icon={faFileInvoice} className="text-gray-300 text-5xl mb-3" />
                      <p>No hay facturas para mostrar</p>
                      <p className="text-sm text-gray-400 mt-1">Intenta cambiar los filtros o agregar nuevas facturas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                facturasToShow.map((invoiceLink, index) => (
                  <tr key={invoiceLink._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-3 py-3 text-xs whitespace-nowrap truncate">
                      <a 
                        href={`https://storage.cloud.google.com/lionseg2/facturas/${invoiceLink.fileName}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center"
                        title={invoiceLink.fileName}
                      >
                        <FontAwesomeIcon icon={faFileInvoice} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{invoiceLink.fileName.slice(-12)}</span>
                      </a>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap truncate">
                      <span className="truncate" title={invoiceLink.clienteName}>{invoiceLink.clienteName}</span>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap text-gray-500">
                      {invoiceLink.registrationDate ? new Date(invoiceLink.registrationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap text-gray-500">
                      {invoiceLink.expirationDate ? new Date(invoiceLink.expirationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap font-medium text-gray-900">
                      ${invoiceLink.total.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap text-gray-500 hidden md:table-cell truncate">
                      <span className="truncate" title={invoiceLink.paymentMethods}>{invoiceLink.paymentMethods || 'N/A'}</span>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      <select
                        value={invoiceLink.state}
                        onChange={(e) => updateInvoiceLinkState(invoiceLink.clienteId, invoiceLink._id, e.target.value)}
                        className={`${getStateStyles(invoiceLink.state).className} inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-200 pr-6`}
                        style={{ 
                          backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                          backgroundPosition: "right 0.25rem center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "1rem 1rem",
                          paddingRight: "1.5rem"
                        }}
                      >
                        <option value="pending" className="bg-white text-gray-900">Pendiente</option>
                        <option value="paid" className="bg-white text-gray-900">Pagado</option>
                        <option value="overdue" className="bg-white text-gray-900">Vencido</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap text-right font-medium">
                      <button
                        onClick={() => deleteInvoice(invoiceLink.clienteId, invoiceLink._id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-150 ease-in-out"
                        title="Eliminar factura"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!allFacturasLoaded && filterAndSortFacturas(facturas).length > visibleFacturas && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMoreFacturas}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </span>
              ) : (
                'Cargar Más Facturas'
              )}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default GeneradorFacturas;
