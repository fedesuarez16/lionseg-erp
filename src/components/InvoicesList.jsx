import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/clientes') 
      .then((response) => {
        const allInvoices = [];
        
        response.data.forEach(client => {
          allInvoices.push(...client.invoices);
        });

        setInvoices(allInvoices);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching clients or their invoices:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching invoices: {error.message}</div>;
  }

  if (!invoices || invoices.length === 0) {
    return <div>No invoices found.</div>;
  }

  return (
    <div className="bg-gray-100 h-screen">
      <Navbar/>
            <table className="min-w-full bg-white rounded border border-collapse border-gray-800">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="border p-2 rounded">Numero </th>
            <th className="border p-2 rounded">Nombre </th>
            <th className="border p-2 rounded">Fecha de emision</th>
            <th className="border p-2 rounded">fecha de expiracion</th>
            <th className="border p-2 rounded">Total</th>
            <th className="border p-2 rounded">metodo de pago</th>
            <th className="border p-2 rounded">State</th>
          </tr>
        </thead>
        <tbody>
        
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
