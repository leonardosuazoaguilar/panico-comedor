// Indicador "Abierto ahora" en los elementos con data-estado. Sin JavaScript se queda el horario fijo del HTML.

import { cliente } from './cliente';
import { conArticulo, estadoEn, momentoEn, type Estado } from './horario';

function pintar(el: HTMLElement, estado: Estado): void {
  const sello = document.createElement('span');
  let detalle: string;

  if (estado.abierto) {
    sello.className = `estado ${estado.cierraPronto ? 'estado--pronto' : 'estado--abierto'}`;
    sello.textContent = estado.cierraPronto ? 'Cierra pronto' : 'Abierto ahora';
    detalle = `cierra a ${conArticulo(estado.cierra)}`;
    if (estado.desayunos) detalle += ` · desayunos hasta ${conArticulo(cliente.desayunosHasta)}`;
  } else {
    sello.className = 'estado estado--cerrado';
    sello.textContent = 'Cerrado ahora';
    detalle = `abre ${estado.cuando} a ${conArticulo(estado.abre)}`;
  }

  el.replaceChildren(sello, ` ${detalle}`);
  el.hidden = false;
}

export function iniciarEstado(): void {
  const elementos = document.querySelectorAll<HTMLElement>('[data-estado]');
  if (elementos.length === 0) return;

  const actualizar = () => {
    const estado = estadoEn(cliente, momentoEn(cliente.zonaHoraria));
    if (estado) elementos.forEach((el) => pintar(el, estado));
  };
  actualizar();
  setInterval(actualizar, 60_000);
}
