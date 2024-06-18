import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ClientProfile = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('services'); // Default active tab is 'services'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    services: [],
    invoiceLinks: []
  });

  useEffect(() => {
    axios.get(`https://lionseg-back.herokuapp.com/api/clientes/${clientId}`)
      .then((response) => {
        setClient(response.data);
        setFormData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching client:', error);
        setError(error);
        setLoading(false);
      });
  }, [clientId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index][field] = value;
    setFormData({
      ...formData,
      services: newServices,
    });
  };

  const handleInvoiceChange = (index, field, value) => {
    const newInvoices = [...formData.invoiceLinks];
    newInvoices[index][field] = value;
    setFormData({
      ...formData,
      invoiceLinks: newInvoices,
    });
  };

  const handleFormSubmit = () => {
    axios.put(`https://lionseg-back.herokuapp.com/api/clientes/${clientId}`, formData)
      .then((response) => {
        setClient(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating client:', error);
        setError(error);
      });
  };

  const handleDeleteClient = () => {
    axios.delete(`https://lionseg-back.herokuapp.com/api/clientes/${clientId}`)
      .then(() => {
        navigate('/clients');
      })
      .catch((error) => {
        console.error('Error deleting client:', error);
      });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching client: {error.message}</div>;
  }

  if (!client) {
    return <div>Client not found.</div>;
  }

  return (
    <div className="p-4 bg-gray-100 h-auto">
      <Navbar />
      <div>
        <h1 className="text-2xl font-bold m-4 text-gray-800">Perfil del Cliente</h1>
      </div>

      {isEditing ? (
        <div className="bg-white p-4 rounded-md shadow-md">
          <label className="block mb-2">Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
          <label className="block mt-4 mb-2">Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
          <label className="block mt-4 mb-2">Teléfono:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />

          <h2 className="text-xl font-bold mt-4 mb-2">Servicios</h2>
          {formData.services.map((service, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
              <label className="block mb-2">Producto:</label>
              <input
                type="text"
                value={service.producto}
                onChange={(e) => handleServiceChange(index, 'producto', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
             
              <label className="block mt-4 mb-2">Precio:</label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="block mt-4 mb-2">Ciclo de facturación:</label>
              <input
                type="text"
                value={service.invoiceCycle}
                onChange={(e) => handleServiceChange(index, 'invoiceCycle', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="block mt-4 mb-2">Método de pago:</label>
              <input
                type="text"
                value={service.paymentMethod}
                onChange={(e) => handleServiceChange(index, 'paymentMethod', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="block mt-4 mb-2">Dominios:</label>
              <input
                type="text"
                value={service.domains.join(', ')}
                onChange={(e) => handleServiceChange(index, 'domains', e.target.value.split(', '))}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}

          <h2 className="text-xl font-bold mt-4 mb-2">Info de facturación</h2>
          {formData.invoiceLinks.map((invoiceLink, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
              <label className="block mb-2">Número de factura:</label>
              <input
                type="text"
                value={invoiceLink.fileName}
                onChange={(e) => handleInvoiceChange(index, 'fileName', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="block mt-4 mb-2">Fecha de registro:</label>
              <input
                type="date"
                value={invoiceLink.registrationDate ? new Date(invoiceLink.registrationDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInvoiceChange(index, 'registrationDate', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="block mt-4 mb-2">Fecha de expiración:</label>
              <input
                type="date"
                value={invoiceLink.expirationDate ? new Date(invoiceLink.expirationDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInvoiceChange(index, 'expirationDate', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <label className="block mt-4 mb-2">Estado:</label>
              <select
                value={invoiceLink.state}
                onChange={(e) => handleInvoiceChange(index, 'state', e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          ))}

          <button
            onClick={handleFormSubmit}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Guardar
          </button>
        </div>
      ) : (
        <div>
          <div className="flex mb-4">
            <div className="w-1/2 p-4">
              <p className="font-semibold">Nombre:</p>
              <p className="w-auto bg-white mb-2 p-2 rounded">{client.name}</p>
              <p className="font-semibold">Email:</p>
              <p className="w-auto bg-white mb-2 p-2 rounded">{client.email}</p>
              <p className="font-semibold">Teléfono:</p>
              <p className="w-auto bg-white p-2 rounded">{client.phoneNumber}</p>
            </div>
            <div className="w-1/2 p-4">
              <p className="font-semibold">Fecha de creación:</p>
              <p className="w-auto bg-white mb-2 p-2 rounded">{new Date(client.creationDate).toLocaleDateString()}</p>
              <p className="font-semibold">Estado del cliente:</p>
              <p className="w-auto bg-white mb-2 p-2 rounded">{client.state}</p>
            </div>
          </div>

          <div className="w-full mb-4">
            <h2 className="text-xl font-bold mb-2">Servicios</h2>
            <table className="min-w-full border border-collapse border-gray-800">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-2">Producto</th>
                  <th className="border p-2">Precio</th>
                  <th className="border p-2">Ciclo de facturación</th>
                  <th className="border p-2">Método de pago</th>
                  <th className="border p-2">Dominios</th>
                </tr>
              </thead>
              <tbody>
                {client.services.map((service, index) => (
                  <tr key={index}>
                    <td className="border bg-white p-2">{service.producto}</td>
                    <td className="border bg-white p-2">{service.price}</td>
                    <td className="border bg-white p-2">{service.invoiceCycle}</td>
                    <td className="border bg-white p-2">{service.paymentMethod}</td>
                    <td className="border bg-white p-2">{service.domains.join(', ')}</td>
                  </tr>
                ))} 
              </tbody>
            </table>
          </div>

          <p className="font-semibold">Info de facturación:</p>
          <div className="w-full mb-4">
            <table className="min-w-full border border-collapse border-gray-800">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-2">Número de factura</th>
                  <th className="border p-2">Fecha de registro</th>
                  <th className="border p-2">Fecha de expiración</th>
                  <th className="border p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {client.invoiceLinks.map((invoiceLink, index) => (
                  <tr key={index}>
                    <td className="border bg-white p-2">{invoiceLink.fileName}</td>
                    <td className="border bg-white p-2">{new Date(invoiceLink.registrationDate).toLocaleDateString()}</td>
                    <td className="border bg-white p-2">{new Date(invoiceLink.expirationDate).toLocaleDateString()}</td>
                    <td className="border bg-white p-2">{invoiceLink.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="my-4">
            <button
              onClick={handleEditToggle}
              className="text-black px-4 py-2 rounded flex items-center"
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <div className="my-4">
            <button
              onClick={handleDeleteClient}
              className="text-black px-2 py-2 rounded"
            >
              Borrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
