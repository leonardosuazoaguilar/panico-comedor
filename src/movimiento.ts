// Cuándo se permite animar: el visitante no pidió reducir movimiento ni ahorrar datos.

export function puedeAnimar(): boolean {
  const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !matchMedia('(prefers-reduced-motion: reduce)').matches && !conexion?.saveData;
}

/** Puntero preciso con hover (mouse o trackpad): ahí tienen sentido los efectos que siguen al cursor. */
export const hayCursor = (): boolean => matchMedia('(hover: hover) and (pointer: fine)').matches;
