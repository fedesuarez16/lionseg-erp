import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const GeneradorFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'unpaid'

  const generarFacturas = async () => {
    try {
      const response = await axios.post('https://lionseg-df2520243ed6.herokuapp.com/api/generar-facturas');
      if (response.status === 200) {
        fetchFacturas(); // Después de generar las facturas, actualiza la lista de facturas
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
        // Aplanar la estructura de datos
        const facturasAplanadas = response.data.flatMap(cliente => 
          cliente.invoiceLinks.map(invoiceLink => ({
            ...invoiceLink,
            clienteId: cliente._id, // Asegúrate de incluir clienteId aquí
            clienteName: cliente.name,
            total: cliente.services.reduce((acc, service) => acc + (service.price || 0), 0),
            paymentMethods: cliente.services.map(service => service.paymentMethod).filter(Boolean).join(', '),
          }))
        );
        setFacturas(facturasAplanadas);
        setError('');
      } else {
        setError('Error al obtener las facturas');
      }
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      setError('Error al obtener las facturas');
    }
  };

  const updateInvoiceLinkState = async (clienteId, invoiceLinkId, newState) => {
    try {
      const response = await axios.put(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clienteId}/invoiceLinks/${invoiceLinkId}/state`, {
        state: newState,
      });
  
      if (response.status === 200) {
        fetchFacturas(); // Refresh the list after updating the state
        setError('');
      } else {
        setError('Error al actualizar el estado de la factura');
      }
    } catch (error) {
      console.error('Error al actualizar el estado de la factura:', error);
      setError('Error al actualizar el estado de la factura');
    }
  };
  

  

  const filterAndSortFacturas = (facturas) => {
    // Filtrar
    const facturasFiltradas = facturas.filter(invoiceLink => {
      if (filter === 'paid') {
        return invoiceLink.state === 'paid';
      } else if (filter === 'unpaid') {
        return invoiceLink.state !== 'paid';
      }
      return true;
    });

    // Ordenar
    return facturasFiltradas.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return (
    <div>
      <div className="bg-gray-100 min-h-screen h-auto">
        <Navbar />

        <table className="min-w-full bg-white rounded border border-collapse ">
        <div className="p-4 h-12">
          <label htmlFor="filter">Filtrar por estado: </label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todas</option>
            <option value="paid">Pagadas</option>
            <option value="unpaid">Impagas</option>
          </select>
        </div>
          <thead>
            <tr className="bg-gray-300 text-black">
              <th className="border p-2 rounded">Invoice Link</th>
              <th className="border p-2 rounded">Nombre</th>
              <th className="border p-2 rounded">Fecha de Emisión</th>
              <th className="border p-2 rounded">Fecha de Expiración</th>
              <th className="border p-2 rounded">Total</th>
              <th className="border p-2 rounded">Método de Pago</th>
              <th className="border p-2 rounded">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filterAndSortFacturas(facturas).length === 0 ? (
              <tr>
                <td colSpan="7" className="border p-2">No hay facturas generadas</td>
              </tr>
            ) : (
              filterAndSortFacturas(facturas).map(invoiceLink => (
                <tr key={invoiceLink._id}>
                  <td className="border p-2">
                    <a href={`https://lionseg-df2520243ed6.herokuapp.com/facturas/${invoiceLink.fileName}`} target="_blank" rel="noopener noreferrer">
                      {invoiceLink.fileName}
                    </a>
                  </td>
                  <td className="border p-2">{invoiceLink.clienteName}</td>
                  <td className="border p-2">{invoiceLink.registrationDate ? new Date(invoiceLink.registrationDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="border p-2">{invoiceLink.expirationDate ? new Date(invoiceLink.expirationDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="border p-2">{invoiceLink.total.toFixed(2)}</td>
                  <td className="border p-2">{invoiceLink.paymentMethods || 'N/A'}</td>
                  <td className="border p-2">
                  <select
                    value={invoiceLink.state}
                    onChange={(e) => updateInvoiceLinkState(invoiceLink.clienteId, invoiceLink._id, e.target.value)}
                    className={`text-white p-1 rounded ${invoiceLink.state === 'paid' ? 'text-green-700' : 'text-red-700'}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>


                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-500 m-4">{error}</p>}

      <button
        onClick={generarFacturas}
        className="fixed bottom-4 right-4 bg-gray-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Generar Facturas
      </button>
    </div>
  );
};

export default GeneradorFacturas;
