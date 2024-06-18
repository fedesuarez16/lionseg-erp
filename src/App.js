import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientList from './components/ClientList';
import ClientProfile from './components/ClientProfile';
import Invoices from './components/InvoicesList';
import Sidebar from './components/SideBar'; // Import the Sidebar component
import GeneradorFacturas from './components/GeneradorFacturas';

function App() {
  return (
    <Router>
      <div className="flex"> {/* Add a flex container for the sidebar and main content */}
        {/* Sidebar */}
        <Sidebar />
        {/* Main content */}
        <main className="flex-1 p-4 bg-gray-200">
          <Routes>
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/:clientId" element={<ClientProfile />} />
            <Route path="/facturas" element={<GeneradorFacturas />} />
            {/* New routes based on Sidebar */}
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// You would also need to create or import these new components:
// Dashboard, Transacciones, Reportes

export default App;
