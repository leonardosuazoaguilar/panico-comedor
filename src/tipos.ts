// Tipos de los datos del cliente (ficha de Airtable) y del menú (Google Sheet).

/** Hora en formato 24 h, "HH:MM". */
export type Hora = string;

export interface Turno {
  abre: Hora;
  cierra: Hora;
}

export interface Cliente {
  nombre: string;
  /** Teléfono en formato E.164, para enlaces tel:. */
  telefono: string;
  /** Número para wa.me: 52 + 10 dígitos, sin signos. */
  whatsapp: string;
  /** Zona horaria IANA del negocio; el horario se calcula en ella, no en la del visitante. */
  zonaHoraria: string;
  desayunosHasta: Hora;
  /** Siete listas de turnos, una por día; el índice 0 es domingo. Una lista vacía es día cerrado. */
  horario: Turno[][];
}

export type Etiqueta = 'vegetariano' | 'vegano' | 'gluten' | 'lacteos' | 'huevo' | 'frutos-secos';

export interface Platillo {
  id: string;
  nombre: string;
  /** Precio en pesos, IVA incluido. */
  precio: number;
  categoria: string;
  etiquetas: Etiqueta[];
}

export interface LineaPedido {
  platillo: Platillo;
  cantidad: number;
}
