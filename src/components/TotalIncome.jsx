import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IncomeNavbar from './IncomeNavbar';

const TotalIncome = () => {
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState('');
  const [ingresosDiarios, setIngresosDiarios] = useState(0);
  const [ingresosSemanales, setIngresosSemanales] = useState(0);

  useEffect(() => {
    fetchTotalIngresos();
    fetchIngresos();
  }, []);

  const fetchTotalIngresos = async () => {
    try {
      const response = await axios.get('https://lionseg-df2520243ed6.herokuapp.com/api/total-ingresos');
      if (response.status === 200) {
        setTotalIngresos(response.data.totalIngresos);
      } else {
        setError('Error al obtener el total de ingresos');
      }
    } catch (error) {
      console.error('Error al obtener el total de ingresos:', error);
      setError('Error al obtener el total de ingresos');
    }
  };

  const fetchIngresos = async () => {
    try {
      const response = await axios.get('https://lionseg-df2520243ed6.herokuapp.com/api/ingresos');
      if (response.status === 200) {
        setIngresos(response.data);
        calcularIngresosDiariosYsemanales(response.data);
      } else {
        setError('Error al obtener los ingresos');
      }
    } catch (error) {
      console.error('Error al obtener los ingresos:', error);
      setError('Error al obtener los ingresos');
    }
  };

  const calcularIngresosDiariosYsemanales = (ingresos) => {
    const hoy = new Date();
    let ingresosDiarios = 0;
    let ingresosSemanales = 0;

    ingresos.forEach(ingreso => {
      const fechaIngreso = new Date(ingreso.date);
      const unDia = 24 * 60 * 60 * 1000; // Milisegundos en un día

      if (hoy.toDateString() === fechaIngreso.toDateString()) {
        ingresosDiarios += ingreso.amount;
      }

      if ((hoy - fechaIngreso) / unDia <= 7) {
        ingresosSemanales += ingreso.amount;
      }
    });

    setIngresosDiarios(ingresosDiarios);
    setIngresosSemanales(ingresosSemanales);
  };

  const borrarHistorialIngresos = async () => {
    try {
      await axios.delete('https://lionseg-df2520243ed6.herokuapp.com/api/ingresos');
      setIngresos([]);
      setIngresosDiarios(0);
      setIngresosSemanales(0);
      setTotalIngresos(0);
    } catch (error) {
      console.error('Error al borrar el historial de ingresos:', error);
      setError('Error al borrar el historial de ingresos');
    }
  };

  return (
    <div className="p-2 bg-white border rounded-xl min-h-screen h-auto relative">
      <IncomeNavbar />
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-regular mb-6 text-center text-gray-800">Ingresos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-300 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-600">Total</h3>
              <p className="text-2xl text-gray-600">${totalIngresos.toFixed(2)} ARS</p>
            </div>
            <div className="border border-gray-300  p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-600">Semanales</h3>
              <p className="text-2xl text-gray-600">${ingresosSemanales.toFixed(2)} ARS</p>
            </div>
            <div className="border border-gray-300  p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-600">Diarios</h3>
              <p className="text-2xl text-gray-600">${ingresosDiarios.toFixed(2)} ARS</p>
            </div>
          </div>
          <button 
            onClick={borrarHistorialIngresos}
            className="fixed bottom-4 right-4 text-black bg-gray-100 border border-gray-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Borrar Historial de Ingresos
          </button>
          <h3 className="text-lg font-regular  mb-4 text-gray-600">Detalles de Ingresos:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-xl">
              <thead className="text-gray-600 font-regular ">
                <tr>
                  <th className="py-4 px-6 border-b text-left">Monto</th>
                  <th className="py-4 px-6 border-b text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.map((ingreso, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 text-green-700">+ ${ingreso.amount.toFixed(2)} ARS</td>
                    <td className="py-4 px-6">{new Date(ingreso.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalIncome;
