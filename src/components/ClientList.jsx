import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AddClient from './AddClient';
import Navbar from './Navbar';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddClientVisible, setIsAddClientVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  const fetchClients = async () => {
    try {
      const response = await axios.get(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes?search=${searchQuery}`);
      const sortedClients = response.data.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
      setClients(sortedClients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  const handleAddClientToggle = () => {
    setIsAddClientVisible(!isAddClientVisible);
  };

  const handleClientAdded = () => {
    fetchClients();
    setIsAddClientVisible(false);
  };

  const handleSearch = (searchQuery) => {
    console.log('Search Query:', searchQuery);
  };

  const handleStateChange = async (clientId, newState) => {
    try {
      const response = await axios.put(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`, { state: newState });
      if (response.status === 200) {
        setClients(clients.map(client => client._id === clientId ? response.data : client));
      }
    } catch (error) {
      console.error('Error updating client state:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
 
 
 
  const generarFactura = async (clientId) => {
    try {
      // Obtener los detalles del cliente
      const clientResponse = await axios.get(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}`);
      const clientData = clientResponse.data;
  
      console.log('Datos completos del cliente:', clientData); 
      console.log('Servicios del cliente:', clientData.services); 
  
      // Extraer datos del cliente
      const clientPhone = clientData.phoneNumber;
      const clientName = clientData.name;
  
      // Validar si hay servicios y obtener precio y producto
      if (!clientData.services.length) {
        alert('El cliente no tiene servicios registrados.');
        return;
      }
  
      const monto = clientData.services[0].price || 0;
      const servicioDescripcion = clientData.services[0].producto || "Servicio contratado";
  
      console.log('Monto:', monto); 
      console.log('Servicio:', servicioDescripcion); 
  
      // Generar la factura con los datos corregidos
      const facturaResponse = await axios.post(
        `https://lionseg-df2520243ed6.herokuapp.com/api/clientes/${clientId}/invoices`,
        {
          monto: monto,
          fechaVencimiento: new Date().toISOString().split('T')[0],
          descripcion: servicioDescripcion,
        }
      );
  
      console.log('Respuesta de la API al generar factura:', facturaResponse.data); 
  
      // Obtener el enlace de la factura generada
      const facturaLink = facturaResponse.data.factura.fileName;
      console.log('Link de la factura:', facturaLink);
  
// Construir la lista de servicios y montos
const serviciosLista = clientData.services.map(servicio => `- ${servicio.producto}: $${servicio.price}`).join('\n');

const mensajeWhatsApp = `Hola ${clientName}, Te enviamos la factura correspondiente al mes actual: https://storage.cloud.google.com/lionseg2/facturas/${facturaLink}

*Detalles de la factura:*
${serviciosLista}

Recorda pagar antes de los 7 dias para no recibir recargos. Luego de transferir a la cuenta de tu preferencia debes enviar el comprobante a este numero`;

      
            const whatsappURL = `https://wa.me/${clientPhone}?text=${encodeURIComponent(mensajeWhatsApp)}`;
  
      // Abrir en una nueva ventana
      window.open(whatsappURL, '_blank');
  
      alert('Factura generada con éxito y enviada a WhatsApp');
  
    } catch (error) {
      console.error('Error generando la factura o enviando a WhatsApp:', error);
      alert('Error al generar la factura');
    }
  };
  
  return ( 
    <div className="p-2 bg-white border  min-h-screen h-auto relative">
      <Navbar onSearch={handleSearch} />
      <button
        className="fixed bottom-4 right-6 pb-[14px] bg-gray-800 text-white py-2 px-[18px] rounded-full text-3xl"
        onClick={handleAddClientToggle}
      > +
      </button>

      {isAddClientVisible && <AddClient onClientAdded={handleClientAdded} />}
      <table className="min-w-full  bg-white border rounded-full  border-gray-300">
      <thead>
  <tr className="text-gray-700 text-sm text-light px-4">
    <th className="font-semibold border-t border-b border-gray-300 rounded-tl-lg px-2 text-left">Nombre</th>
    <th className="font-semibold border-t border-b border-gray-300 px-2 p-1 text-left">Email</th>
    <th className="font-semibold border-t border-b border-gray-300 px-2 p-1 text-left">Teléfono</th>
    <th className="font-semibold border-t border-b border-gray-300 px-2 p-1 text-left">Registro</th>
    <th className="font-semibold border-t border-b border-gray-300 px-2 p-1 text-left">Estado</th>
    <th className="font-semibold border-t border-b border-gray-300 px-2 p-1 text-left">Acciones</th>
  </tr>
</thead>

        <tbody>
          {clients.map((client, index) => (
            <tr className='text-gray-600 ' key={client._id}>
              <td className={`border-t border-b border-gray-300  p-4 mx-2 ${index === clients.length - 1 ? 'rounded-bl-lg' : ''}`}>
                <Link to={`/clients/${client._id}`}>{client.name}</Link>
              </td>
              <td className="border-t border-b border-gray-300 p-4 mx-2">{client.email}</td>
              <td className="border-t border-b border-gray-300 p-2 mx-2">{client.phoneNumber}</td>
              <td className="border-t border-b border-gray-300 p-4 mx-2">{new Date(client.creationDate).toLocaleDateString()}</td>
              <td className={`border-t border-b border-gray-300 p-4 mx-2 ${index === clients.length - 1 ? 'rounded-br-lg' : ''}`}>
                <select
                  value={client.state}
                  onChange={(e) => handleStateChange(client._id, e.target.value)}
                  className={`text-white font-semibold p-1 rounded ${client.state === 'activo' ? 'text-green-800' : 'text-red-700'}`}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </td>
           <td className="border-t border-b border-gray-300 p-4 mx-2">
                  <button 
          onClick={() => generarFactura(client._id)} 
          className=" text-green-700 px-8 py-1 rounded"
        >
          Enviar
        </button>

            </td>



            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
