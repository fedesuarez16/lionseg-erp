  import React, { useState } from 'react';
  import axios from 'axios';

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
      try {
        const response = await axios.post('https://lionseg-df2520243ed6.herokuapp.com/api/clientes', formData);

        console.log('Client added:', response.data);
        onClientAdded(); // Notificar a ClientList que un cliente ha sido agregado
        setFormData({
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
      } catch (error) {
        console.error('Error adding client:', error);
      }
    };

    return (
      <div className="flex justify-center w-full items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Add Client</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefono:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mt-4">Services</h3>
              {formData.services.map((service, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
                  <label className="block text-sm font-medium text-gray-700">Servicio:</label>
                  <select
                    type="text"
                    name="producto"
                    value={service.producto}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="monitoreo">Monitoreo</option>
                    <option value="kit DVR">Kit DVR</option>
                    <option value="kit DVR">Instalacion</option>
                    <option value="kit DVR">Alarma</option>
                    <option value="kit DVR">Otro</option>

                  </select>
                  <label className="block text-sm font-medium text-gray-700">Monto del primer pago:</label>
                  <input
                    type="number"
                    name="firstPaymentAmount"
                    value={service.firstPaymentAmount}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <label className="block text-sm font-medium text-gray-700">Precio:</label>
                  <input
                    type="number"
                    name="price"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <label className="block text-sm font-medium text-gray-700">Ciclo de facturación:</label>
                  <input
                    type="text"
                    name="invoiceCycle"
                    value={service.invoiceCycle}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <label className="block text-sm font-medium text-gray-700">Método de pago:</label>
                  <input
                    type="text"
                    name="paymentMethod"
                    value={service.paymentMethod}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <label className="block text-sm font-medium text-gray-700">Dominios:</label>
                  <input
                    type="text"
                    name="domains"
                    value={service.domains}
                    onChange={(e) => handleServiceChange(index, e)}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
           
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Agregar cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddClient;
