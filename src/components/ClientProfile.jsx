import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import InvoiceModal from './InvoiceModal';  // Asegúrate de importar el modal

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
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);  // Estado para controlar el modal

  useEffect(() => {
    axios.get(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`)
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
    axios.put(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`, formData)
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
    axios.delete(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`)
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

  const handleInvoiceCreated = (newInvoice) => {
    setClient({
      ...client,
      invoiceLinks: [...client.invoiceLinks, newInvoice]
    });
  };

  const handleAddService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { producto: '', price: 0, invoiceCycle: '', paymentMethod: '', domains: [] }]
    });
  };

  const handleRemoveService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      services: newServices
    });
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
              <button
                onClick={() => handleRemoveService(index)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Eliminar Servicio
              </button>
            </div>
          ))}
          <button
            onClick={handleAddService}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Añadir Servicio
          </button>

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
            </div>
          ))}

          <button
            onClick={handleFormSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Guardar cambios
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-md shadow-md">
          <p><strong>Nombre:</strong> {client.name}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Teléfono:</strong> {client.phoneNumber}</p>
          <h2 className="text-xl font-bold mt-4 mb-2">Servicios</h2>
          <ul>
            {client.services.map((service, index) => (
              <li key={index}>
                <p><strong>Producto:</strong> {service.producto}</p>
                <p><strong>Precio:</strong> {service.price}</p>
                <p><strong>Ciclo de facturación:</strong> {service.invoiceCycle}</p>
                <p><strong>Método de pago:</strong> {service.paymentMethod}</p>
                <p><strong>Dominios:</strong> {service.domains.join(', ')}</p>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-4 mb-2">Info de facturación</h2>
          <ul>
            {client.invoiceLinks.map((invoiceLink, index) => (
              <li key={index}>
                <p><strong>Número de factura:</strong> {invoiceLink.fileName}</p>
                <p><strong>Fecha de registro:</strong> {new Date(invoiceLink.registrationDate).toLocaleDateString()}</p>
                <p><strong>Fecha de expiración:</strong> {new Date(invoiceLink.expirationDate).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleEditToggle}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {isEditing ? 'Cancelar' : 'Editar Cliente'}
      </button>
      <button
        onClick={handleDeleteClient}
        className="mt-4 ml-4 px-4 py-2 bg-red-600 text-white rounded-md"
      >
        Eliminar Cliente
      </button>

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        clientId={clientId}
        onInvoiceCreated={handleInvoiceCreated}
      />

      <button
        onClick={() => setIsInvoiceModalOpen(true)}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Añadir Factura
      </button>
    </div>
  );
};

export default ClientProfile;
