import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddClient = ({ onClientAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    services: [
      {
        producto: '',
        firstPaymentAmount: '',
        price: '',
        invoiceCycle: '',
        paymentMethod: '',
        domains: '',
      },
    ],
    creationDate: new Date().toISOString().slice(0, 10),
    state: 'activo',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = formData.services.map((service, i) =>
      i === index ? { ...service, [name]: value } : service
    );
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        {
          producto: '',
          firstPaymentAmount: '',
          price: '',
          invoiceCycle: '',
          paymentMethod: '',
          domains: '',
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      alert('Por favor complete los campos obligatorios: Nombre, Email y Teléfono');
      return;
    }
    
    // Format services domains from string to array
    const formattedData = {
      ...formData,
      services: formData.services.map(service => ({
        ...service,
        domains: service.domains ? service.domains.split(',').map(domain => domain.trim()) : []
      }))
    };
    
    try {
      const response = await axios.post('https://lionseg-df2520243ed6.herokuapp.com/api/clientes', formattedData);
      onClientAdded(); // Notificar a ClientList que un cliente ha sido agregado
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error al agregar cliente. Por favor intente nuevamente.');
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-6 text-gray-800">Agregar Nuevo Cliente</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email: <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono: <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="md:col-span-2 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Servicios</h3>
            <button
              type="button"
              onClick={addService}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" /> Agregar Servicio
            </button>
          </div>

          {formData.services.map((service, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servicio:</label>
                  <select
                    name="producto"
                    value={service.producto}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="monitoreo">Monitoreo</option>
                    <option value="Kit DVR">Kit DVR</option>
                    <option value="Instalacion">Instalación</option>
                    <option value="Alarma">Alarma</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Mensual:</label>
                  <input
                    type="number"
                    name="price"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Pago:</label>
                  <input
                    type="number"
                    name="firstPaymentAmount"
                    value={service.firstPaymentAmount}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo de Facturación:</label>
                  <select
                    name="invoiceCycle"
                    value={service.invoiceCycle}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago:</label>
                  <select
                    name="paymentMethod"
                    value={service.paymentMethod}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="mercadopago">Mercado Pago</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domicilio (separar múltiples con coma):</label>
                  <input
                    type="text"
                    name="domains"
                    value={service.domains}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: Av. Rivadavia 1234, CABA"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Guardar Cliente
          </button>
        </div>
      </form>
    </>
  );
};

export default AddClient;
