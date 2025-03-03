import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AddClient from './AddClient';
import Navbar from './Navbar';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddClientVisible, setIsAddClientVisible] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState({}); // Guarda los links generados

  const fetchClients = async () => {
    try {
      const response = await axios.get(`https://lionseg-df2520243ed6.herokuapp.com/api/clientes`);
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
  }, []);

  const handleGenerateLink = async (clientId) => {
    try {
      const response = await axios.post(`https://lionseg-df2520243ed6.herokuapp.com/api/generar-link`, { clientId });
      setGeneratedLinks((prevLinks) => ({
        ...prevLinks,
        [clientId]: response.data.link, // Guarda el link generado en el estado
      }));
    } catch (error) {
      console.error('Error generating link:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
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
  
  return (
    <div className="p-2 bg-white border min-h-screen h-auto relative">
      <Navbar />
      <button
        className="fixed bottom-4 right-6 bg-gray-800 text-white py-2 px-[18px] rounded-full text-3xl"
        onClick={() => setIsAddClientVisible(!isAddClientVisible)}
      >
        +
      </button>

      {isAddClientVisible && <AddClient onClientAdded={fetchClients} />}
      
      <table className="min-w-full bg-white border rounded border-gray-300">
        <thead>
          <tr className="text-gray-700 px-4">
            <th className="font-semibold border p-4">Nombre</th>
            <th className="font-semibold border p-4">Email</th>
            <th className="font-semibold border p-4">Teléfono</th>
            <th className="font-semibold border p-4">Registro</th>
            <th className="font-semibold border p-4">Estado</th>
            <th className="font-semibold border p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id} className="text-gray-600">
              <td className="border p-4">{client.name}</td>
              <td className="border p-4">{client.email}</td>
              <td className="border p-4">{client.phoneNumber}</td>
              <td className="border p-4">{new Date(client.creationDate).toLocaleDateString()}</td>
              <td className="border p-4">
                <select
                  value={client.state}
                  onChange={(e) => handleStateChange(client._id, e.target.value)}
                  className={`p-1 rounded ${client.state === 'activo' ? 'text-green-800' : 'text-red-700'}`}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </td>
              <td className="border p-4">
                <button
                  onClick={() => handleGenerateLink(client._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Generar Link
                </button>
                {generatedLinks[client._id] && (
                  <a
                    href={generatedLinks[client._id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 underline"
                  >
                    Ver Link
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
