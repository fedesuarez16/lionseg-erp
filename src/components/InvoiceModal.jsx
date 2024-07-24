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
      const response = await axios.post(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/generar-factura`, {
        monto,
        destinatario: clientId,
        fechaFactura,
        fechaVencimiento,
        descripcion,
      });
      onInvoiceCreated(response.data);
      onClose();
    } catch (err) {
      setError('Error al generar la factura');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-md w-1/2">
        <h2 className="text-xl font-bold mb-4">Generar Factura</h2>
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <input
          type="date"
          placeholder="Fecha de la Factura"
          value={fechaFactura}
          onChange={(e) => setFechaFactura(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <input
          type="date"
          placeholder="Fecha de Vencimiento"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={handleGenerateInvoice}
          className="bg-indigo-600 text-white p-2 rounded-md mr-2"
        >
          Generar
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white p-2 rounded-md"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;
