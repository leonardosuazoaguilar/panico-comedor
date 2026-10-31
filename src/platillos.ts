// Lee los platillos del HTML del menú (data-id, data-precio y data-etiquetas en cada li.item).

import type { Etiqueta, Platillo } from './tipos';

const ETIQUETAS: readonly Etiqueta[] = ['vegetariano', 'vegano', 'gluten', 'lacteos', 'huevo', 'frutos-secos'];

export interface PlatilloEnPagina {
  elemento: HTMLElement;
  platillo: Platillo;
}

const esEtiqueta = (valor: string): valor is Etiqueta => (ETIQUETAS as readonly string[]).includes(valor);

export function leerPlatillos(raiz: ParentNode): PlatilloEnPagina[] {
  const resultado: PlatilloEnPagina[] = [];

  raiz.querySelectorAll<HTMLElement>('.item[data-id]').forEach((elemento) => {
    const precio = Number(elemento.dataset.precio);
    const nombre = elemento.querySelector('h3')?.textContent?.trim();
    if (!elemento.dataset.id || !nombre || !Number.isFinite(precio)) return;

    resultado.push({
      elemento,
      platillo: {
        id: elemento.dataset.id,
        nombre,
        precio,
        categoria: elemento.closest('section')?.querySelector('h2')?.textContent?.trim() ?? '',
        etiquetas: (elemento.dataset.etiquetas ?? '').split(' ').filter(esEtiqueta),
      },
    });
  });
  return resultado;
}
