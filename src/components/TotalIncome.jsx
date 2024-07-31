import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalIncome = () => {
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState('');

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
        } else {
          setError('Error al obtener los ingresos');
        }
      } catch (error) {
        console.error('Error al obtener los ingresos:', error);
        setError('Error al obtener los ingresos');
      }
    };

    fetchTotalIngresos();
    fetchIngresos();
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Total de Ingresos</h2>
          <p>${totalIngresos.toFixed(2)} ARS</p>
          <h3>Detalles de Ingresos</h3>
          <ul>
            {ingresos.map((ingreso, index) => (
              <li key={index}>
                ${ingreso.amount.toFixed(2)} ARS - {new Date(ingreso.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TotalIncome;
