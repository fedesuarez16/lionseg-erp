import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import InvoiceModal from './InvoiceModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faFileInvoiceDollar, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faBuilding,
  faSpinner,
  faClipboard,
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const ClientProfile = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    cuilCuit: '',
    services: [],
    invoiceLinks: []
  });
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const response = await axios.get(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`);
      setClient(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching client:', err);
      setError(err);
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData(client);
    }
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
  
  const handleInvoiceSubmit = async (invoiceData) => {
    try {
      const response = await axios.post(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/invoices`, invoiceData);
      handleInvoiceCreated(response.data);
      setIsInvoiceModalOpen(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
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
      services: [...formData.services, { 
        producto: '', 
        price: 0, 
        invoiceCycle: 'Mensual', 
        paymentMethod: 'Transferencia', 
        domains: [] 
      }],
    });
  };

  const handleRemoveService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      services: newServices,
    });
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`, formData);
      setClient(response.data);
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error('Error updating client:', error);
      setError(error);
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteConfirmOpen) {
      setDeleteConfirmOpen(true);
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`);
      navigate('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
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

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactivo':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading && !client) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <Navbar />
        <div className="h-[calc(100vh-100px)] flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-indigo-600 text-4xl mb-3" />
            <p className="text-gray-600">Cargando información del cliente...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3 text-lg" />
              <div>
                <h3 className="text-red-800 font-medium">Error al cargar el cliente</h3>
                <p className="text-red-700 mt-1">{error.message || 'Ocurrió un error inesperado'}</p>
                <button 
                  onClick={() => navigate('/clients')}
                  className="mt-3 flex items-center text-red-700 hover:text-red-900"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                  Volver al listado de clientes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 rounded-md">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mr-3 text-lg" />
              <div>
                <h3 className="text-yellow-800 font-medium">Cliente no encontrado</h3>
                <p className="text-yellow-700 mt-1">No se pudo encontrar el cliente solicitado.</p>
                <button 
                  onClick={() => navigate('/clients')}
                  className="mt-3 flex items-center text-yellow-700 hover:text-yellow-900"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                  Volver al listado de clientes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Delete confirmation dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Está seguro que desea eliminar el cliente <span className="font-semibold">{client.name}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteClient}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : (
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Client header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-indigo-100 rounded-full p-3 mr-4">
                <FontAwesomeIcon icon={faUser} className="text-indigo-600 text-2xl" />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-semibold text-gray-800 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <h1 className="text-2xl font-semibold text-gray-800">{client.name}</h1>
                )}
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(client.state)}`}>
                    {client.state === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-gray-500 text-sm ml-3">
                    Cliente desde {new Date(client.creationDate).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={handleCreateInvoice}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" />
                    Crear Factura
                  </button>
                  <button
                    onClick={handleDeleteClient}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Eliminar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFormSubmit}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    )}
                    Guardar
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => handleTabChange('info')}
                className={`px-6 py-4 text-sm font-medium text-center ${
                  activeTab === 'info'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Información básica
              </button>
              <button
                onClick={() => handleTabChange('services')}
                className={`px-6 py-4 text-sm font-medium text-center ${
                  activeTab === 'services'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                Servicios
              </button>
              <button
                onClick={() => handleTabChange('invoices')}
                className={`px-6 py-4 text-sm font-medium text-center ${
                  activeTab === 'invoices'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" />
                Facturas
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Info tab */}
            {activeTab === 'info' && (
              <div>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-500" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-500" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faClipboard} className="mr-2 text-gray-500" />
                        CUIL/CUIT
                      </label>
                      <input
                        type="text"
                        name="cuilCuit"
                        value={formData.cuilCuit}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Email
                      </h3>
                      <p className="text-gray-800">{client.email || 'No proporcionado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Teléfono
                      </h3>
                      <p className="text-gray-800">{client.phoneNumber || 'No proporcionado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faClipboard} className="mr-2" />
                        CUIL/CUIT
                      </h3>
                      <p className="text-gray-800">{client.cuilCuit || 'No proporcionado'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                        Fecha de registro
                      </h3>
                      <p className="text-gray-800">{new Date(client.creationDate).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faClipboard} className="mr-2" />
                        Estado
                      </h3>
                      <p className="text-gray-800">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(client.state)}`}>
                          {client.state === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Services tab */}
            {activeTab === 'services' && (
              <div>
                {isEditing ? (
                  <div>
                    {formData.services.map((service, index) => (
                      <div key={index} className="mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-700">Servicio #{index + 1}</h3>
                          <button
                            onClick={() => handleRemoveService(index)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Eliminar
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Producto / Servicio
                            </label>
                            <input
                              type="text"
                              value={service.producto || ''}
                              onChange={(e) => handleServiceChange(index, 'producto', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Ej: Monitoreo de Cámaras"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Precio
                            </label>
                            <input
                              type="number"
                              value={service.price || 0}
                              onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value) || 0)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ciclo de facturación
                            </label>
                            <select
                              value={service.invoiceCycle || 'Mensual'}
                              onChange={(e) => handleServiceChange(index, 'invoiceCycle', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="Mensual">Mensual</option>
                              <option value="Trimestral">Trimestral</option>
                              <option value="Semestral">Semestral</option>
                              <option value="Anual">Anual</option>
                              <option value="Otro">Otro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Método de pago
                            </label>
                            <select
                              value={service.paymentMethod || 'Transferencia'}
                              onChange={(e) => handleServiceChange(index, 'paymentMethod', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="Transferencia">Transferencia Bancaria</option>
                              <option value="MercadoPago">MercadoPago</option>
                              <option value="Efectivo">Efectivo</option>
                              <option value="Otro">Otro</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Domicilios
                            </label>
                            <input
                              type="text"
                              value={service.domains ? service.domains.join(', ') : ''}
                              onChange={(e) => handleServiceChange(index, 'domains', e.target.value.split(',').map(item => item.trim()))}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Ingrese los domicilios separados por comas"
                            />
                            <p className="mt-1 text-xs text-gray-500">Ingrese los domicilios separados por comas</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddService}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      + Añadir Servicio
                    </button>
                  </div>
                ) : (
                  <div>
                    {client.services.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FontAwesomeIcon icon={faBuilding} className="text-gray-400 text-4xl mb-3" />
                        <p className="text-gray-600">No hay servicios registrados para este cliente</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciclo</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de pago</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domicilios</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {client.services.map((service, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{service.producto || 'No especificado'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">${parseFloat(service.price || 0).toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{service.invoiceCycle || 'Mensual'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{service.paymentMethod || 'No especificado'}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    {service.domains && service.domains.length > 0 
                                      ? service.domains.join(', ') 
                                      : 'No especificado'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Invoices tab */}
            {activeTab === 'invoices' && (
              <div>
                {client.invoiceLinks.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-600">No hay facturas registradas para este cliente</p>
                    <button
                      onClick={handleCreateInvoice}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" />
                      Crear Factura
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emisión</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {client.invoiceLinks
                          .slice()
                          .reverse()
                          .map((invoice, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <a 
                                  href={`https://storage.googleapis.com/lionseg2/facturas/${invoice.fileName}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                >
                                  {invoice.fileName}
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(invoice.registrationDate).toLocaleDateString('es-AR')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(invoice.expirationDate).toLocaleDateString('es-AR')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ${parseFloat(invoice.total || 0).toFixed(2)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.state)}`}>
                                  {invoice.state === 'paid' ? 'Pagado' : 
                                   invoice.state === 'pending' ? 'Pendiente' : 
                                   invoice.state === 'overdue' ? 'Vencido' : invoice.state}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isInvoiceModalOpen && (
        <InvoiceModal
          clientId={clientId}
          onClose={() => setIsInvoiceModalOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}
    </div>
  );
};

export default ClientProfile;
