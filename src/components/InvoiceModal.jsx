import React, { useState } from 'react';
import axios from 'axios';

const InvoiceModal = ({ clientId, onClose, onInvoiceCreated }) => {
  const [monto, setMonto] = useState('');
  const [fechaFactura, setFechaFactura] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  const handleGenerateInvoice = async () => {
    if (!monto || !fechaFactura || !fechaVencimiento || !descripcion) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      const response = await axios.post(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/invoices`, {
        monto,
        destinatario: clientId,
        fechaFactura,
        fechaVencimiento,
        descripcion,
      });
      onInvoiceCreated(response.data);  // Llama al callback con la nueva factura
      onClose();
    } catch (err) {
      setError('Error al generar la factura');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Generar Factura</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Monto:</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        <div>
          <label>Fecha de Factura:</label>
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
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <button onClick={handleGenerateInvoice}>Generar Factura</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default InvoiceModal;
