import React, { useState } from 'react';
import axios from 'axios';

const InvoiceModal = ({ clientId }) => {
  const [monto, setMonto] = useState('');
  const [fechaFactura, setFechaFactura] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invoiceData = {
      monto,
      fechaFactura,
      fechaVencimiento,
      descripcion
    };

    try {
      const response = await axios.post(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/invoices`, invoiceData);
      console.log('Factura creada:', response.data);
      // Limpiar el formulario o hacer cualquier otra acción necesaria
    } catch (error) {
      console.error('Error al crear la factura:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Monto:</label>
        <input
          type="text"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </div>
      <div>
        <label>Fecha de la Factura:</label>
        <input
          type="date"
          value={fechaFactura}
          onChange={(e) => setFechaFactura(e.target.value)}
        />
      </div>
      <div>
        <label>Fecha de Vencimiento:</label>
        <input
          type="date"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
        />
      </div>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <button type="submit">Crear Factura</button>
    </form>
  );
};

export default InvoiceModal;
