import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalIncome = () => {
  const [totalIngresos, setTotalIngresos] = useState(0);
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

    fetchTotalIngresos();
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Total de Ingresos</h2>
          <p>${totalIngresos.toFixed(2)} ARS</p>
        </div>
      )}
    </div>
  );
};

export default TotalIncome;
