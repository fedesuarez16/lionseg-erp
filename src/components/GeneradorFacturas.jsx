import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import SearchBarInvoice from './SearchBarInvoice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const GeneradorFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'unpaid'
  const [searchQuery, setSearchQuery] = useState('');

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
    try {
      const response = await axios.get('https://lionseg-df2520243ed6.herokuapp.com/api/clientes');
      if (response.status === 200) {
        const facturasAplanadas = response.data.flatMap(cliente =>
          cliente.invoiceLinks.map(invoiceLink => ({
            ...invoiceLink,
            clienteId: cliente._id,
            clienteName: cliente.name,
            total: cliente.services.reduce((acc, service) => acc + (service.price || 0), 0),
            paymentMethods: cliente.services.map(service => service.paymentMethod).filter(Boolean).join(', '),
          }))
        );
  
        // Ordenar por fecha descendente (suponiendo que invoiceLink tiene una propiedad 'date')
        const facturasOrdenadas = facturasAplanadas
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 300); // Tomar solo las últimas 300
  
        setFacturas(facturasOrdenadas);
        setError('');
      } else {
        setError('Error al obtener las facturas');
      }
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      setError('Error al obtener las facturas');
    }
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

  return (
    <div className="p-2 bg-white border rounded-xl min-h-screen h-auto relative">
      <SearchBarInvoice searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="p-4 mb-6 h-8">
        <label htmlFor="filter">Filtrar: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ml-2 text-gray-400 px-2 border border-gray-300 rounded"
        >
          <option value="all">Todas</option>
          <option value="paid">Pagadas</option>
          <option value="unpaid">Impagas</option>
        </select>
      </div>
      <button
        className="fixed bottom-4 right-6 pb-[14px] bg-gray-800 text-white py-2 px-[18px] rounded-full text-3xl"
        onClick={generarFacturas}
      >
        +
      </button>

      <table className="min-w-full bg-white rounded border border-collapse border-gray-300">
        <thead>
          <tr className="text-gray-700 m-2">
            <th className="font-semibold border-t border-b border-gray-300 p-4 rounded-tl-lg mx-2">Invoice Link</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 mx-2">Nombre</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 mx-2">Fecha de Emisión</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 mx-2">Fecha de Expiración</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 mx-2">Total</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 mx-2">Método de Pago</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 mx-2">Estado</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 rounded-tr-lg mx-2"></th>
          </tr>
        </thead>
        <tbody>
          {filterAndSortFacturas(facturas).length === 0 ? (
            <tr>
              <td colSpan="8" className="border-t border-b border-gray-300 p-4 mx-2">No hay facturas generadas</td>
            </tr>
          ) : (
            filterAndSortFacturas(facturas).map((invoiceLink, index) => (
              <tr key={invoiceLink._id} className="text-gray-600">
                <td className={`border-t border-b border-gray-300 p-4 mx-2 ${index === filterAndSortFacturas(facturas).length - 1 ? 'rounded-bl-lg' : ''}`}>
                  <a href={`https://storage.cloud.google.com/lionseg25/facturas/${invoiceLink.fileName}`} target="_blank" rel="noopener noreferrer">
                    {invoiceLink.fileName}
                  </a>
                </td>
                <td className="border-t border-b border-gray-300 p-4 mx-2">{invoiceLink.clienteName}</td>
                <td className="border-t border-b border-gray-300 p-4 mx-2">{invoiceLink.registrationDate ? new Date(invoiceLink.registrationDate).toLocaleDateString() : 'N/A'}</td>
                <td className="border-t border-b border-gray-300 p-4 mx-2">{invoiceLink.expirationDate ? new Date(invoiceLink.expirationDate).toLocaleDateString() : 'N/A'}</td>
                <td className="border-t border-b border-gray-300 p-4 mx-2">{invoiceLink.total.toFixed(2)}</td>
                <td className="border-t border-b border-gray-300 p-4 mx-2">{invoiceLink.paymentMethods || 'N/A'}</td>
                <td className={`border-t border-b border-gray-300 p-4 mx-2 ${index === filterAndSortFacturas(facturas).length - 1 ? 'rounded-br-lg' : ''}`}>
                  <select
                    value={invoiceLink.state}
                    onChange={(e) => updateInvoiceLinkState(invoiceLink.clienteId, invoiceLink._id, e.target.value)}
                    className={`text-white font-semibold p-1 rounded ${invoiceLink.state === 'paid' ? 'text-green-600' : 'text-red-700'}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option className='text-green-700' value="paid">Pago</option>
                    <option value="overdue">Vencido</option>
                  </select>
                </td>
                <td className="border-t border-b  border-gray-300 p-4 mx-2">
                  <button
                    onClick={() => deleteInvoice(invoiceLink.clienteId, invoiceLink._id)}
                    className="text-slate-500  hover:text-gray-800"
                  >
                  <FontAwesomeIcon icon={faTrash} />

                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {error && <p className="text-red-500 m-4">{error}</p>}
    </div>
  );
};

export default GeneradorFacturas;
