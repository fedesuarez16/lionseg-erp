import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const InvoiceModal = ({ isOpen, onClose, clientId }) => {
  const [monto, setMonto] = useState('');
  const [fechaFactura, setFechaFactura] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/generar-factura`, {
        monto,
        fechaFactura,
        fechaVencimiento,
        descripcion,
      });
      console.log('Factura generada:', response.data);
      onClose();
    } catch (error) {
      console.error('Error al generar factura:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Generar Factura</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Monto:</label>
          <input
            type="number"
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
        <button type="submit">Generar y Enviar Factura</button>
      </form>
    </Modal>
  );
};

export default InvoiceModal;
