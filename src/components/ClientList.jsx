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
    <div className="bg-gray-100 min-h-screen h-auto relative">
      <Navbar onSearch={handleSearch} />
      <button
        className="fixed bottom-4 right-6 pb-[14px] bg-gray-800 text-white py-2 px-[18px] rounded-full text-3xl"
        onClick={handleAddClientToggle}
      > +
      </button>

      {isAddClientVisible && <AddClient onClientAdded={handleClientAdded} />}
      <table className="min-w-full bg-white rounded border border-collapse border-gray-800">
        <thead>
          <tr className="bg-gray-300">
            <th className="border p-2 rounded">Invoice #</th>
            <th className="border p-2 rounded">Customer</th>
            <th className="border p-2 rounded">Amount</th>
            <th className="border p-2 rounded">Status</th>
            <th className="border p-2 rounded">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td className="border p-2 rounded-bl">{client.invoiceNumber}</td>
              <td className="border p-2">
                <div className="font-bold">{client.companyName}</div>
                <div className="text-gray-500">{client.contactName}</div>
              </td>
              <td className="border p-2">{`$${client.amount.toFixed(2)}`}</td>
              <td className="border p-2">
                <span className={`inline-block px-2 py-1 rounded-full text-white ${client.status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {client.status}
                </span>
              </td>
              <td className="border p-2 flex space-x-2">
                <button className="p-1 bg-gray-300 rounded">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m0 0H5m4 0h6m2 0h2m-8 4v4m0 0H9m2 0h2m0 0h2m0-4V8m0-4h4m0 0H9m8 0h2m0 0h2m0 4v4m0 0v4m0-8h-2" />
                  </svg>
                </button>
                <button className="p-1 bg-gray-300 rounded">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
