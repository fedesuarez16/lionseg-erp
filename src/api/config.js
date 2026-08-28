// URL base del backend, configurada por entorno (REACT_APP_API_URL).
//
// Se normaliza a proposito: si el valor viene sin protocolo, `${API_URL}/api/x`
// produce una ruta RELATIVA que el browser resuelve contra el dominio del front.
// En una SPA eso devuelve el index.html con status 200, y el error aparece
// mucho despues y muy lejos ("data.flatMap is not a function"), en vez de fallar
// donde esta el problema real.
const raw = (process.env.REACT_APP_API_URL || 'http://localhost:3000').trim();

const normalize = (url) => {
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, ''); // sin barra final: evita la doble barra
};

export const API_URL = normalize(raw);
