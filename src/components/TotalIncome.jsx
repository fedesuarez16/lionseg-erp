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

    fetchTotalIngresos();
    fetchIngresos();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <IncomeNavbar/>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Ingresos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-blue-700">Total</h3>
              <p className="text-2xl text-blue-900">${totalIngresos.toFixed(2)} ARS</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-green-700">Semanales</h3>
              <p className="text-2xl text-green-900">${ingresosSemanales.toFixed(2)} ARS</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-yellow-700">Diarios</h3>
              <p className="text-2xl text-yellow-900">${ingresosDiarios.toFixed(2)} ARS</p>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Detalles de Ingresos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 border-b text-left">Monto</th>
                  <th className="py-3 px-6 border-b text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.map((ingreso, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">${ingreso.amount.toFixed(2)} ARS</td>
                    <td className="py-3 px-6">{new Date(ingreso.date).toLocaleDateString()}</td>
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
