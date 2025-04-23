import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IncomeNavbar from './IncomeNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCoins, faChartLine, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const TotalIncome = () => {
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [ingresos, setIngresos] = useState([]);
  const [filteredIngresos, setFilteredIngresos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'day', 'week', 'month'
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [stats, setStats] = useState({
    diario: 0,
    semanal: 0,
    mensual: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (ingresos.length > 0) {
      calculateStats();
      applyFilters();
    }
  }, [ingresos, dateFilter, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [totalResponse, ingresosResponse] = await Promise.all([
        axios.get('https://lionseg-df2520243ed6.herokuapp.com/api/total-ingresos'),
        axios.get('https://lionseg-df2520243ed6.herokuapp.com/api/ingresos')
      ]);

      if (totalResponse.status === 200 && ingresosResponse.status === 200) {
        setTotalIngresos(totalResponse.data.totalIngresos || 0);
        
        // Sort ingresos by date in descending order
        const sortedIngresos = ingresosResponse.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setIngresos(sortedIngresos);
        setFilteredIngresos(sortedIngresos);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneDay = 24 * 60 * 60 * 1000;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    let ingresosDiarios = 0;
    let ingresosSemanales = 0;
    let ingresosMensuales = 0;

    ingresos.forEach(ingreso => {
      const ingresoDate = new Date(ingreso.date);
      ingresoDate.setHours(0, 0, 0, 0);
      
      const amount = parseFloat(ingreso.amount) || 0;

      // Daily income
      if (ingresoDate.getTime() === today.getTime()) {
        ingresosDiarios += amount;
      }
      
      // Weekly income
      if (ingresoDate >= startOfWeek && ingresoDate <= today) {
        ingresosSemanales += amount;
      }
      
      // Monthly income
      if (ingresoDate >= startOfMonth && ingresoDate <= today) {
        ingresosMensuales += amount;
      }
    });

    setStats({
      diario: ingresosDiarios,
      semanal: ingresosSemanales,
      mensual: ingresosMensuales
    });
  };

  const applyFilters = () => {
    let filtered = [...ingresos];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'day') {
      filtered = ingresos.filter(ingreso => {
        const ingresoDate = new Date(ingreso.date);
        ingresoDate.setHours(0, 0, 0, 0);
        return ingresoDate.getTime() === today.getTime();
      });
    } else if (dateFilter === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      filtered = ingresos.filter(ingreso => {
        const ingresoDate = new Date(ingreso.date);
        ingresoDate.setHours(0, 0, 0, 0);
        return ingresoDate >= startOfWeek && ingresoDate <= today;
      });
    } else if (dateFilter === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      filtered = ingresos.filter(ingreso => {
        const ingresoDate = new Date(ingreso.date);
        ingresoDate.setHours(0, 0, 0, 0);
        return ingresoDate >= startOfMonth && ingresoDate <= today;
      });
    } else if (dateFilter === 'custom' && dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = ingresos.filter(ingreso => {
        const ingresoDate = new Date(ingreso.date);
        return ingresoDate >= start && ingresoDate <= end;
      });
    }
    
    setFilteredIngresos(filtered);
  };

  const handleFilterChange = (filter) => {
    setDateFilter(filter);
  };

  const handleDateRangeChange = (e, field) => {
    setDateRange({
      ...dateRange,
      [field]: e.target.value
    });
    
    if (dateFilter !== 'custom') {
      setDateFilter('custom');
    }
  };

  const borrarHistorialIngresos = async () => {
    if (!window.confirm('¿Está seguro que desea borrar todo el historial de ingresos? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.delete('https://lionseg-df2520243ed6.herokuapp.com/api/ingresos');
      if (response.status === 200) {
        setIngresos([]);
        setFilteredIngresos([]);
        setStats({
          diario: 0,
          semanal: 0,
          mensual: 0
        });
        setTotalIngresos(0);
        setError('');
      }
    } catch (error) {
      console.error('Error al borrar el historial de ingresos:', error);
      setError('Error al borrar el historial de ingresos');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)} ARS`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  if (loading && ingresos.length === 0) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <IncomeNavbar />
        <div className="h-[calc(100vh-100px)] flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-indigo-600 text-4xl mb-3" />
            <p className="text-gray-600">Cargando información de ingresos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <IncomeNavbar />
      
      {error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : null}
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-2 text-indigo-600" />
          Resumen de Ingresos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="rounded-full bg-indigo-100 p-3 mr-4">
                <FontAwesomeIcon icon={faCoins} className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Histórico</h3>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(totalIngresos)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mensual</h3>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(stats.mensual)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Semanal</h3>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(stats.semanal)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3 mr-4">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Hoy</h3>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(stats.diario)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Filtrar por Fecha</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleFilterChange('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateFilter === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => handleFilterChange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateFilter === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => handleFilterChange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateFilter === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Este Mes
            </button>
          </div>
          
          <div className={`flex flex-wrap gap-4 mb-4 items-end ${dateFilter === 'custom' ? 'opacity-100' : 'opacity-70'}`}>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate || ''}
                onChange={(e) => handleDateRangeChange(e, 'startDate')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate || ''}
                onChange={(e) => handleDateRangeChange(e, 'endDate')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              Historial de Ingresos
              {filteredIngresos.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredIngresos.length} {filteredIngresos.length === 1 ? 'registro' : 'registros'})
                </span>
              )}
            </h3>
            
            <button 
              onClick={borrarHistorialIngresos}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              disabled={loading || ingresos.length === 0}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              ) : (
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
              )}
              Borrar Historial
            </button>
          </div>
          
          {loading && ingresos.length > 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faSpinner} spin className="text-indigo-600 text-2xl mb-2" />
              <p className="text-gray-500">Actualizando datos...</p>
            </div>
          ) : filteredIngresos.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No hay registros de ingresos para mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Monto</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredIngresos.map((ingreso, index) => (
                    <tr key={ingreso._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-green-600 font-medium">
                        +{formatCurrency(ingreso.amount)}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {formatDate(ingreso.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalIncome;
