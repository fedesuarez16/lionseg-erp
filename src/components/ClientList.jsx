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

  useEffect(() => {
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

    fetchClients();
  }, [searchQuery]);

  const handleAddClientToggle = () => {
    setIsAddClientVisible(!isAddClientVisible);
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
    <div className="bg-gray-100 min-h-screen h-auto relative">
      <Navbar onSearch={handleSearch} />
      <table className="min-w-full bg-white rounded border border-collapse border-gray-800">
        <thead>
          <tr className="bg-gray-300">
            <th className="border p-2 rounded">Name</th>
            <th className="border p-2 rounded">Email</th>
            <th className="border p-2 rounded">Phone Number</th>
            <th className="border p-2 rounded">Creation Date</th>
            <th className="border p-2 rounded">State</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td className="border p-2 rounded-bl">
                <Link to={`/clients/${client._id}`}>{client.name}</Link>
              </td>
              <td className="border p-2">{client.email}</td>
              <td className="border p-2">{client.phoneNumber}</td>
              <td className="border p-2">{new Date(client.creationDate).toLocaleDateString()}</td>
              <td className="border p-2">
                <select
                  value={client.state}
                  onChange={(e) => handleStateChange(client._id, e.target.value)}
                  className={`text-white font-semibold p-1 rounded ${client.state === 'activo' ? 'text-green-700' : 'text-red-700'}`}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="fixed bottom-4 right-6 pb-[14px] bg-gray-800 text-white py-2 px-[18px] rounded-full text-3xl"
        onClick={handleAddClientToggle}
      > +
      </button>

      {isAddClientVisible && <AddClient />}
    </div>
  );
};

export default ClientList;
