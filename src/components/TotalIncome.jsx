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
    <div className="">
      <IncomeNavbar/>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Ingresos</h2>
          <div className="flex justify-around mb-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Total</h3>
              <p className="text-lg">${totalIngresos.toFixed(2)} ARS</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Semanales</h3>
              <p className="text-lg">${ingresosSemanales.toFixed(2)} ARS</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Diarios</h3>
              <p className="text-lg">${ingresosDiarios.toFixed(2)} ARS</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4">Detalles de Ingresos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Monto</th>
                  <th className="py-2 px-4 border-b">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.map((ingreso, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">${ingreso.amount.toFixed(2)} ARS</td>
                    <td className="py-2 px-4">{new Date(ingreso.date).toLocaleDateString()}</td>
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
