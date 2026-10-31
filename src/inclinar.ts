// Tarjetas que se inclinan en 3D hacia el cursor (data-inclinar). Solo con mouse o trackpad;
// en pantallas táctiles las tarjetas quedan planas. El CSS lee --rx y --ry.

import { hayCursor, puedeAnimar } from './movimiento';

/** Inclinación máxima en grados. */
const MAXIMO = 7;

export function iniciarInclinar(): void {
  if (!puedeAnimar() || !hayCursor()) return;

  document.querySelectorAll<HTMLElement>('[data-inclinar]').forEach((tarjeta) => {
    tarjeta.addEventListener('pointermove', (e) => {
      const caja = tarjeta.getBoundingClientRect();
      const x = (e.clientX - caja.left) / caja.width - 0.5;
      const y = (e.clientY - caja.top) / caja.height - 0.5;
      tarjeta.style.setProperty('--ry', `${(x * MAXIMO * 2).toFixed(2)}deg`);
      tarjeta.style.setProperty('--rx', `${(-y * MAXIMO * 2).toFixed(2)}deg`);
    });
    tarjeta.addEventListener('pointerleave', () => {
      tarjeta.style.removeProperty('--rx');
      tarjeta.style.removeProperty('--ry');
    });
  });
}
