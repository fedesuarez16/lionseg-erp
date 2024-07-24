// NesInvoicw.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewInvoice = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [monto, setMonto] = useState('');
  const [fechaFactura, setFechaFactura] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch clients from the server
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/clientes');
        setClients(response.data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    fetchClients();
  }, []);

  const handleGenerateInvoice = async () => {
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/api/clientes/${selectedClient._id}/generar-factura`, {
        monto,
        destinatario: selectedClient.name,
        fechaFactura,
        fechaVencimiento,
        descripcion,
      });
      setResult(response.data.facturaLink);
      setError('');
    } catch (err) {
      setError('Error al generar la factura');
      setResult('');
    }
  };

  return (
    <div>
      <h2>Generar Factura</h2>
      <div>
        <label>Seleccionar Cliente:</label>
        <select onChange={(e) => setSelectedClient(clients.find(client => client._id === e.target.value))}>
          <option value="">--Seleccione un Cliente--</option>
          {clients.map(client => (
            <option key={client._id} value={client._id}>{client.name}</option>
          ))}
        </select>
      </div>
      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <input
        type="date"
        placeholder="Fecha de la Factura"
        value={fechaFactura}
        onChange={(e) => setFechaFactura(e.target.value)}
      />
      <input
        type="date"
        placeholder="Fecha de Vencimiento"
        value={fechaVencimiento}
        onChange={(e) => setFechaVencimiento(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <button onClick={handleGenerateInvoice}>Generar Factura</button>
      {result && (
        <div>
          <h3>Factura Generada:</h3>
          <a href={result} target="_blank" rel="noopener noreferrer">Ver Factura</a>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default NewInvoice;
