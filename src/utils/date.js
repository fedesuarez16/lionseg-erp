// Formateo de fechas unificado para todo el panel.
//
// Dos razones para no usar `toLocaleDateString()` pelado:
//  1. Sin locale toma el del browser del usuario — en una máquina en inglés
//     sale mm/dd/aa y no coincide con lo que dice la factura.
//  2. Sin timeZone se usa el huso del usuario — una fecha guardada en UTC
//     puede mostrarse corrida un día. Anclamos a Argentina para que el panel
//     y el PDF que genera el backend digan siempre lo mismo.

const TIME_ZONE = 'America/Argentina/Buenos_Aires';

const format = (date, options) => {
  if (!date) return 'N/A';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'N/A';

  return parsed.toLocaleDateString('es-AR', { timeZone: TIME_ZONE, ...options });
};

// 12/08/2026
export const formatFecha = (date) =>
  format(date, { day: '2-digit', month: '2-digit', year: 'numeric' });

// 12 de agosto de 2026
export const formatFechaLarga = (date) =>
  format(date, { day: 'numeric', month: 'long', year: 'numeric' });

// 12 ago 2026
export const formatFechaCorta = (date) =>
  format(date, { day: 'numeric', month: 'short', year: 'numeric' });
