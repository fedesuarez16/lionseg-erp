import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';
import { formatFecha } from '../utils/date';

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

// "YYYY-MM-DD" en hora argentina, el formato que espera <input type="date">
const toInputDate = (date) => date.toLocaleDateString('en-CA', { timeZone: TIME_ZONE });

// Mismo anclaje que el backend: mediodía argentino, así no se corre un día
const fromInputDate = (value) => (value ? `${value}T12:00:00-03:00` : null);

const formatMonto = (monto) => {
  const value = parseFloat(monto);
  return `$ ${Number.isNaN(value) ? '0.00' : value.toFixed(2)}`;
};

const inputClass =
  'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Réplica en HTML del PDF que genera /invoiceIndividual, para ver cómo va a quedar
const InvoicePreview = ({ client, monto, fechaVencimiento, descripcion }) => {
  const domains = client?.services?.[0]?.domains;
  const clientAddress = domains && domains.length > 0 ? domains.join(', ') : 'Dirección no proporcionada';

  return (
    <div className="border border-gray-200 rounded-md p-4 text-xs bg-white shadow-inner">
      <div className="flex justify-between items-start mb-4">
        <img src="https://storage.googleapis.com/lionseg/logolionseg.png" alt="LionSeg" className="w-24" />
        <div className="bg-gray-100 rounded p-3 w-44">
          <p className="text-center font-bold text-indigo-800 text-sm mb-1">FACTURA</p>
          <p>Fecha: {formatFecha(new Date())}</p>
          <p>Vencimiento: {fechaVencimiento ? formatFecha(fromInputDate(fechaVencimiento)) : '—'}</p>
          <p>Nº: INV-IND-…</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
        <p className="font-bold text-indigo-800 mb-1">DATOS DEL CLIENTE</p>
        <div className="grid grid-cols-2 gap-x-2">
          <p>Cliente: {client?.name || '—'}</p>
          <p>Email: {client?.email || 'No disponible'}</p>
          <p className="truncate">Dirección: {clientAddress}</p>
          <p>Teléfono: {client?.phoneNumber || 'No disponible'}</p>
        </div>
      </div>

      <div className="flex justify-between bg-indigo-800 text-white font-bold rounded-t px-3 py-2">
        <span>DESCRIPCIÓN</span>
        <span>MONTO</span>
      </div>
      <div className="flex justify-between bg-gray-100 border border-gray-200 rounded-b px-3 py-2 mb-3">
        <span className="break-words pr-2">{descripcion || 'Servicio'}</span>
        <span className="whitespace-nowrap">{formatMonto(monto)}</span>
      </div>

      <div className="flex justify-end mb-4">
        <div className="bg-indigo-800 text-white font-bold rounded px-4 py-2">TOTAL: {formatMonto(monto)}</div>
      </div>

      <p className="font-bold text-indigo-800 mb-1">MÉTODOS DE PAGO</p>
      <div className="grid grid-cols-2 gap-x-2 text-gray-700">
        <div>
          <p>Banco Patagonia:</p>
          <p>Alias: lionseg.patagonia</p>
          <p>CBU: 0340040108409895361003</p>
        </div>
        <div>
          <p>Mercado Pago:</p>
          <p>Alias: lionseg.mp</p>
          <p>CVU: 0000003100041927153583</p>
        </div>
      </div>
    </div>
  );
};

const InvoiceModal = ({ clientId, client, onClose, onInvoiceCreated }) => {
  const [monto, setMonto] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState(
    toInputDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  );
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdInvoice, setCreatedInvoice] = useState(null);

  const modalRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/clientes/${clientId}/invoiceIndividual`, {
        monto,
        fechaVencimiento,
        descripcion,
      });
      setCreatedInvoice(response.data);
      onInvoiceCreated?.(response.data);
    } catch (err) {
      console.error('Error al crear la factura:', err);
      setError(err.response?.data?.message || 'Error al crear la factura');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewInvoice = () => {
    setCreatedInvoice(null);
    setMonto('');
    setDescripcion('');
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Crear Factura</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {createdInvoice ? (
            <div className="flex flex-col justify-center items-center text-center space-y-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">Factura creada exitosamente</p>
              <p className="text-sm text-gray-600 break-all">{createdInvoice.fileName}</p>
              <div className="flex gap-3">
                <a
                  href={createdInvoice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Ver factura
                </a>
                <a
                  href={createdInvoice.url}
                  download={createdInvoice.fileName}
                  className="py-2 px-4 rounded-md text-sm font-medium text-indigo-700 border border-indigo-600 hover:bg-indigo-50"
                >
                  Descargar
                </a>
              </div>
              <button type="button" onClick={handleNewInvoice} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Crear otra factura
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento:</label>
                <input
                  type="date"
                  required
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción:</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading && <Spinner />}
                  {isLoading ? 'Generando factura...' : 'Crear Factura'}
                </button>
              </div>
            </form>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Previsualización</p>
            <InvoicePreview
              client={client}
              monto={monto}
              fechaVencimiento={fechaVencimiento}
              descripcion={descripcion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
