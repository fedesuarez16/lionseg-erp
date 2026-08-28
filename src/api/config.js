// URL base del backend.
// Se configura por entorno (REACT_APP_API_URL en Vercel / .env.local).
// El fallback es solo para desarrollo: en produccion la variable SIEMPRE debe estar seteada.
export const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3000';
