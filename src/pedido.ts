// Pedido para llevar: cantidades, total y mensaje de WhatsApp. Lógica pura, sin DOM.

import type { LineaPedido, Platillo } from './tipos';

/** Tope por platillo, para que un toque repetido no arme un pedido absurdo. */
const MAXIMO_POR_PLATILLO = 20;

export const pesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export class Pedido {
  private readonly cantidades = new Map<string, number>();

  constructor(private readonly catalogo: ReadonlyMap<string, Platillo>) {}

  /** Reconstruye un pedido guardado; ignora platillos que ya no están en el menú. */
  static desde(catalogo: ReadonlyMap<string, Platillo>, guardado: unknown): Pedido {
    const pedido = new Pedido(catalogo);
    if (guardado && typeof guardado === 'object') {
      for (const [id, cantidad] of Object.entries(guardado)) {
        if (Number.isInteger(cantidad)) pedido.cambiar(id, cantidad as number);
      }
    }
    return pedido;
  }

  /** Suma (o resta, con un número negativo) piezas de un platillo. */
  cambiar(id: string, diferencia: number): void {
    if (!this.catalogo.has(id)) return;
    const nueva = Math.min(this.cantidadDe(id) + diferencia, MAXIMO_POR_PLATILLO);
    if (nueva > 0) this.cantidades.set(id, nueva);
    else this.cantidades.delete(id);
  }

  cantidadDe(id: string): number {
    return this.cantidades.get(id) ?? 0;
  }

  vaciar(): void {
    this.cantidades.clear();
  }

  get lineas(): LineaPedido[] {
    const lineas: LineaPedido[] = [];
    for (const [id, cantidad] of this.cantidades) {
      const platillo = this.catalogo.get(id);
      if (platillo) lineas.push({ platillo, cantidad });
    }
    return lineas;
  }

  get piezas(): number {
    return this.lineas.reduce((suma, l) => suma + l.cantidad, 0);
  }

  get total(): number {
    return this.lineas.reduce((suma, l) => suma + l.cantidad * l.platillo.precio, 0);
  }

  mensaje(negocio: string): string {
    const renglones = this.lineas.map(
      (l) => `• ${l.cantidad} × ${l.platillo.nombre}: ${pesos.format(l.cantidad * l.platillo.precio)}`,
    );
    return [`Hola, ${negocio}. Quiero hacer un pedido para llevar:`, ...renglones, `Total: ${pesos.format(this.total)}`].join('\n');
  }

  aObjeto(): Record<string, number> {
    return Object.fromEntries(this.cantidades);
  }
}
