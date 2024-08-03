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
          <tr className="text-gray-500 text-light px-4 m-2">
            <th className="font-semibold border-t border-b border-gray-300 p-4 rounded-tl-lg mx-2">Nombre</th>
            <th className="font-semibold border-t border-b border-gray-300 p-4 mx-2">Email</th>
            <th className="border-t border-b font-semibold border-gray-300 p-4 mx-2">Telefono</th>
            <th className="border-t border-b border-gray-300 font-semibold p-4 mx-2">Registro</th>
            <th className="border-t border-b border-gray-300 p-4 rounded-tr- font-semibold lg mx-2">Estado </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr className='text-gray-600' key={client._id}>
              <td className={`border-t border-b border-gray-300  p-4 mx-2 ${index === clients.length - 1 ? 'rounded-bl-lg' : ''}`}>
                <Link to={`/clients/${client._id}`}>{client.name}</Link>
              </td>
              <td className="border-t border-b border-gray-300 p-4 mx-2">{client.email}</td>
              <td className="border-t border-b border-gray-300 p-4 mx-2">{client.phoneNumber}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
