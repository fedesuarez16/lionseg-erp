import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GenerateInvoice = () => {
  const { clientId } = useParams();
  const [formData, setFormData] = useState({
    // Define the fields needed for generating an invoice
    // You can add more fields based on your invoice schema
    invoiceNumber: '',
    invoiceDate: '',
    expirationDate: '',
    total: '',
    paymentMethod: '',
    // Add more fields as needed
  });

  const handleInputChange = (e) => {
    // Update the form data when input fields change
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateInvoice = () => {
    // Make a POST request to generate the invoice
    axios.post(`https://lionseg-back.herokuapp.com/api/clientes/${clientId}/invoices`, formData)
      .then((response) => {
        // Handle the response as needed
        console.log('Invoice generated successfully:', response.data);
        // Redirect or perform any other actions after generating the invoice
      })
      .catch((error) => {
        console.error('Error generating invoice:', error);
      });
  };

  return (
    <div>
      <h1>Generate Invoice</h1>
      <label>Invoice Number:</label>
      <input
        type="text"
        name="invoiceNumber"
        value={formData.invoiceNumber}
        onChange={handleInputChange}
      />
      <br />
      <label>Invoice Date:</label>
      <input
        type="text"
        name="invoiceDate"
        value={formData.invoiceDate}
        onChange={handleInputChange}
      />
      <br />
      {/* Add more input fields for other invoice details */}
      <button onClick={handleGenerateInvoice}>Generate Invoice</button>
    </div>
  );
};

export default GenerateInvoice;
