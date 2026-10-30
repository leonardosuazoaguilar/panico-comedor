// Menú: se lee del Google Sheet publicado como CSV (MENU_CSV_URL) al construir el sitio.
// Si no hay URL, se usa la copia local src/data/menu.csv con las mismas columnas.
import menuLocal from '../data/menu.csv?raw';

export type Platillo = {
  categoria: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
  etiquetas: string[];
  destacado: boolean;
  foto: string;
};

function parseCsv(texto: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = '';
  let entreComillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') entreComillas = false;
      else campo += c;
    } else if (c === '"') entreComillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); campo = '';
      if (fila.some((v) => v.trim() !== '')) filas.push(fila);
      fila = [];
    } else campo += c;
  }
  fila.push(campo);
  if (fila.some((v) => v.trim() !== '')) filas.push(fila);
  return filas;
}

export async function cargarMenu(): Promise<Platillo[]> {
  const url = import.meta.env.MENU_CSV_URL;
  const texto = url ? await (await fetch(url)).text() : menuLocal;
  const [encabezado, ...filas] = parseCsv(texto);
  const col = (nombre: string) => encabezado.findIndex((h) => h.trim().toLowerCase() === nombre);
  const i = {
    categoria: col('categoria'), nombre: col('nombre'), descripcion: col('descripcion'),
    precio: col('precio'), etiquetas: col('etiquetas'), destacado: col('destacado'), foto: col('foto'),
  };
  return filas.map((f) => ({
    categoria: f[i.categoria]?.trim() ?? '',
    nombre: f[i.nombre]?.trim() ?? '',
    descripcion: f[i.descripcion]?.trim() ?? '',
    precio: f[i.precio]?.trim() ? Number(f[i.precio]) : null,
    etiquetas: (f[i.etiquetas] ?? '').split(';').map((e) => e.trim()).filter(Boolean),
    destacado: (f[i.destacado] ?? '').trim().toLowerCase() === 'si',
    foto: f[i.foto]?.trim() ?? '',
  })).filter((p) => p.nombre);
}

export function agruparPorCategoria(platillos: Platillo[]) {
  const grupos = new Map<string, Platillo[]>();
  for (const p of platillos) {
    if (!grupos.has(p.categoria)) grupos.set(p.categoria, []);
    grupos.get(p.categoria)!.push(p);
  }
  return [...grupos.entries()];
}

export const precioMXN = (n: number | null) => (n == null ? '' : `$${n.toLocaleString('es-MX')}`);
