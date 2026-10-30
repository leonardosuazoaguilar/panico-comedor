import cliente from '../../client.json';
import type { ImageMetadata } from 'astro';

export { cliente };

const { nap } = cliente;

export const direccionCompleta = `${nap.calle}, ${nap.colonia}, ${nap.cp} ${nap.ciudad}, ${nap.estado}`;
export const telLink = `tel:${nap.telefonoE164}`;
export const waLink = (mensaje = '') =>
  `https://wa.me/${nap.whatsapp}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;
export const waReservar = waLink(cliente.reservas.mensaje);
export const waPedir = waLink(cliente.pedidos.mensaje);
export const mapsLink = nap.mapsUrl;

export const horarioTexto = (h: { abre: string; cierra: string }) => `${aDoce(h.abre)} a ${aDoce(h.cierra)}`;

function aDoce(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${sufijo}`;
}

// Fotos reales del local: nombre de archivo -> imagen + texto alternativo.
const archivos = import.meta.glob<{ default: ImageMetadata }>('../assets/fotos/*.{jpg,png,webp}', { eager: true });

const alts: Record<string, string> = {
  'terraza-fachada': 'Terraza de Pánico Comedor con sombrillas blancas, mesas de madera y buganvilias',
  'fachada-comedor': 'Fachada de Pánico Comedor con buganvilias rojas y sombrillas en la terraza',
  'letrero-panico': 'Letrero pintado a mano en la pared: Pánico, pan y conservas',
  'tosta-prosciutto-higos': 'Tosta de pan de masa madre con queso fresco, higos y prosciutto',
  'torta-cerveza': 'Torta de carne deshebrada con berros y cebolla encurtida, junto a una cerveza',
  'croissant': 'Croissant abierto con pesto y semillas de calabaza, con un café al fondo',
  'pan-de-muerto': 'Pan de muerto de masa madre servido en plato rosa',
  'tarta-aceitunas': 'Tarta de hojaldre enrejada con aceitunas verdes, rebanada',
  'mapa-panico': 'Mapa ilustrado del Centro Histórico de Querétaro con las tres sucursales de Pánico',
};

export function foto(nombre: string) {
  const entrada = Object.entries(archivos).find(([ruta]) => ruta.split('/').pop()!.replace(/\.\w+$/, '') === nombre);
  if (!entrada) return null;
  return { src: entrada[1].default, alt: alts[nombre] ?? '' };
}
