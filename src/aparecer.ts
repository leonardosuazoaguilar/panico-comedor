// Las piezas marcadas con data-aparecer suben y aparecen al entrar en pantalla.
// Donde el navegador soporta animation-timeline: view() lo hace el CSS; esto es el respaldo con IntersectionObserver.
// Solo se ocultan las que empiezan fuera de la vista, para no mover nada de lo que ya se ve (CLS).

import { puedeAnimar } from './movimiento';

export function iniciarAparecer(): void {
  if (!puedeAnimar() || CSS.supports('animation-timeline: view()') || !('IntersectionObserver' in window)) return;

  const pendientes = [...document.querySelectorAll<HTMLElement>('[data-aparecer]')]
    .filter((el) => el.getBoundingClientRect().top > innerHeight);
  if (pendientes.length === 0) return;

  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      entrada.target.classList.remove('por-aparecer');
      observador.unobserve(entrada.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });

  for (const el of pendientes) {
    // Escalonado entre hermanos de la misma rejilla.
    const posicion = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.style.setProperty('--retraso', `${(posicion % 4) * 70}ms`);
    el.classList.add('por-aparecer');
    observador.observe(el);
  }
}
