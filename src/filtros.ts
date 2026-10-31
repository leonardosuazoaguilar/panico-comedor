// Filtros del menú por dieta y alérgenos. Ocultan los platillos y las categorías que no cumplen.

import type { PlatilloEnPagina } from './platillos';
import type { Platillo } from './tipos';

type Filtro = 'vegetariano' | 'sin-gluten' | 'sin-lacteos' | 'sin-frutos-secos';

const CUMPLE: Record<Filtro, (p: Platillo) => boolean> = {
  'vegetariano': (p) => p.etiquetas.includes('vegetariano') || p.etiquetas.includes('vegano'),
  'sin-gluten': (p) => !p.etiquetas.includes('gluten'),
  'sin-lacteos': (p) => !p.etiquetas.includes('lacteos'),
  'sin-frutos-secos': (p) => !p.etiquetas.includes('frutos-secos'),
};

const esFiltro = (valor: string | undefined): valor is Filtro => !!valor && valor in CUMPLE;

export function iniciarFiltros(platillos: PlatilloEnPagina[]): void {
  const caja = document.querySelector<HTMLElement>('[data-filtros]');
  const resultado = caja?.querySelector<HTMLElement>('[data-filtros-resultado]');
  if (!caja || !resultado) return;

  const categorias = [...document.querySelectorAll<HTMLElement>('.menu__categoria')];
  const activos = new Set<Filtro>();

  const aplicar = () => {
    let visibles = 0;
    for (const { elemento, platillo } of platillos) {
      const cumple = [...activos].every((f) => CUMPLE[f](platillo));
      elemento.hidden = !cumple;
      if (cumple) visibles++;
    }
    for (const categoria of categorias) {
      categoria.hidden = !categoria.querySelector('.item:not([hidden])');
    }

    if (activos.size === 0) resultado.textContent = '';
    else if (visibles === 0) resultado.textContent = 'Ningún platillo cumple todos los filtros.';
    else resultado.textContent = `${visibles} ${visibles === 1 ? 'platillo cumple' : 'platillos cumplen'} con los filtros.`;
  };

  caja.querySelectorAll<HTMLButtonElement>('button[data-filtro]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const filtro = boton.dataset.filtro;
      if (!esFiltro(filtro)) return;
      if (activos.has(filtro)) activos.delete(filtro);
      else activos.add(filtro);
      boton.setAttribute('aria-pressed', String(activos.has(filtro)));
      aplicar();
    });
  });
}
