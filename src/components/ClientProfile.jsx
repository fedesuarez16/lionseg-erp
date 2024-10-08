import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import InvoiceModal from './InvoiceModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

const ClientProfile = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    services: [],
    invoiceLinks: []
  });
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);


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

  const handleCreateInvoice = () => {
    setIsInvoiceModalOpen(true);
  };
  
  const handleInvoiceSubmit = (invoiceData) => {
    axios.post(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/invoices`, invoiceData)
      .then((response) => {
        handleInvoiceCreated(response.data);
        setIsInvoiceModalOpen(false);
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
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

  const handleAddService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { producto: '', price: 0, invoiceCycle: '', paymentMethod: '', domains: [] }],
    });
  };

  const handleRemoveService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      services: newServices,
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
    setIsInvoiceModalOpen(false);
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
    <div className="p-4 bg-white  h-auto">
      <Navbar />
      <div>
        <h1 className="text-2xl font-bold  mb-2 text-gray-800"> <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          /></h1>
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

          <h2 className="text-lg font-bold mt-4 mb-2">Servicios</h2>
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
          
              <label className="block mt-4 mb-2">Dominios:</label>
              <input
                type="text"
                value={service.domains.join(', ')}
                onChange={(e) => handleServiceChange(index, 'domains', e.target.value.split(', '))}
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleRemoveService(index)}
                className="mt-2 px-4 py-2 border border-gray-400 text-gray-800 rounded-md"
              >
                Eliminar Servicio
              </button>
            </div>
          ))}
          <button
            onClick={handleAddService}
            className="mt-4 px-4 py-2 border border-gray-400 text-black rounded-md"
          >
            Añadir Servicio
          </button>

          
        

          <button
            onClick={handleFormSubmit}
            className="mt-4 ml-8 px-4 py-2 border border-gray-400 text-black rounded-md"
          >
            Guardar
          </button>
        </div>
      ) : (
        <div>
          <div className="flex  border rounded border-gray-300">
            <div className="w-1/2 p-4 ">
              <p className="font-semibold">Email:</p>
              <p className="w-auto border rounded border-gray-300 bg-white mb-2 p-2 rounded">{client.email}</p>
              <p className="font-semibold">Teléfono:</p>
              <p className="w-auto border rounded border-gray-300 bg-white p-2 rounded">{client.phoneNumber}</p>
            </div>
            <div className="w-1/2 p-4">
              <p className="font-semibold">Fecha de creación:</p>
              <p className="w-auto border rounded border-gray-300 bg-white mb-2 p-2 rounded">{new Date(client.creationDate).toLocaleDateString()}</p>
              <p className="font-semibold">Estado del cliente:</p>
              <p className="w-auto border rounded border-gray-300 bg-white mb-2 p-2 rounded">{client.state}</p>
            </div>
          </div>

          <div className="w-full ">
            <h2 className="text-xl  font-semibold py-4">Servicios</h2>
            <table className="min-w-full border border-collapse border-gray-300">
              <thead>
                <tr className=" text-gray-600 ">
                  <th className="border-b font-regular p-2">Producto</th>
                  <th className="border-b p-2">Precio</th>
                  <th className="border-b p-2">Ciclo de facturación</th>
                  <th className="border-b p-2">Método de pago</th>
                  <th className="border-b p-2">Dominios</th>
                </tr>
              </thead>
              <tbody>
                {client.services.map((service, index) => (
                  <tr key={index}>
                    <td className="border-b bg-white p-2">{service.producto}</td>
                    <td className="border-b bg-white p-2">{service.price}</td>
                    <td className="border-b bg-white p-2">{service.invoiceCycle}</td>
                    <td className="border-b bg-white p-2">{service.paymentMethod}</td>
                    <td className="border-b bg-white p-2">{service.domains.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-semibold text-lg  py-4 ">Info de facturación</p>
          <div className="w-full mb-4">
            <table className="min-w-full border border-collapse border-gray-300">
              <thead>
                <tr className=" text-gray-600">
                  <th className="border-b border-gray-300  p-2">Número de factura</th>
                  <th className="border-b border-gray-300 p-2">Fecha de registro</th>
                  <th className="border-b p-2">Fecha de expiración</th>
                  <th className="border-b  p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {client.invoiceLinks
                  .slice()
                  .reverse() // Invertir el orden de los invoices
                  .map((invoiceLink, index) => (
                    <tr key={index}>
                      <td className="border-b bg-white p-2">
                        <a href={`https://lionseg-df2520243ed6.herokuapp.com/facturas/${invoiceLink.fileName}`} target="_blank" rel="noopener noreferrer">
                          {invoiceLink.fileName}
                        </a>
                      </td>
                      <td className="border-b bg-white p-2">{new Date(invoiceLink.registrationDate).toLocaleDateString()}</td>
                      <td className="border-b bg-white p-2">{new Date(invoiceLink.expirationDate).toLocaleDateString()}</td>
                      <td className="border-b bg-white p-2">{invoiceLink.state}</td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>

          <button
            onClick={handleEditToggle}
            className="fixed bottom-4 right-4 text-white bg-gray-400 border border-gray-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={handleDeleteClient}
            className="fixed bottom-4 right-24  text-white bg-gray-400 border border-gray-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            onClick={handleCreateInvoice}
            className="fixed bottom-4 right-44 text-white bg-gray-400 border border-gray-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          >
            <FontAwesomeIcon icon={faFileInvoiceDollar} />
          </button>
        </div>
      )}

{isInvoiceModalOpen && (
      <InvoiceModal
        clientId={clientId}
        onClose={() => setIsInvoiceModalOpen(false)}
        onInvoiceCreated={handleInvoiceCreated}  // Pasar el callback al modal
      />
    )}
    </div>
  );
};

export default ClientProfile;
