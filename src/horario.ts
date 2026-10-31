// Cálculo de "abierto ahora" con la hora del negocio. Funciones puras, sin DOM.

import type { Cliente, Hora } from './tipos';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;
const DIAS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** Minutos antes del cierre en que se avisa "Cierra pronto". */
const AVISO_CIERRE = 30;

export interface Momento {
  /** 0 = domingo. */
  dia: number;
  /** Minutos desde la medianoche. */
  minutos: number;
}

export type Estado =
  | { abierto: true; cierra: Hora; cierraPronto: boolean; desayunos: boolean }
  | { abierto: false; abre: Hora; cuando: string };

export function aMinutos(hora: Hora): number {
  const [h = 0, m = 0] = hora.split(':').map(Number);
  return h * 60 + m;
}

/** "22:30" → "10:30 pm" */
export function formatoHora(hora: Hora): string {
  const [h = 0, m = 0] = hora.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}

/** "la 1:00 pm" / "las 9:00 am" */
export function conArticulo(hora: Hora): string {
  const texto = formatoHora(hora);
  return `${texto.startsWith('1:') ? 'la' : 'las'} ${texto}`;
}

export function momentoEn(zonaHoraria: string, fecha = new Date()): Momento {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zonaHoraria, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha);
  const valor = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value ?? '';
  return {
    dia: DIAS_EN.indexOf(valor('weekday')),
    minutos: Number(valor('hour')) * 60 + Number(valor('minute')),
  };
}

export function estadoEn(cliente: Cliente, ahora: Momento): Estado | null {
  const turnosHoy = cliente.horario[ahora.dia] ?? [];

  for (const turno of turnosHoy) {
    const abre = aMinutos(turno.abre);
    const cierra = aMinutos(turno.cierra);
    if (ahora.minutos >= abre && ahora.minutos < cierra) {
      return {
        abierto: true,
        cierra: turno.cierra,
        cierraPronto: cierra - ahora.minutos <= AVISO_CIERRE,
        desayunos: ahora.minutos < aMinutos(cliente.desayunosHasta),
      };
    }
  }

  const masTarde = turnosHoy.find((t) => aMinutos(t.abre) > ahora.minutos);
  if (masTarde) return { abierto: false, abre: masTarde.abre, cuando: 'hoy' };

  for (let i = 1; i <= 7; i++) {
    const dia = (ahora.dia + i) % 7;
    const turno = cliente.horario[dia]?.[0];
    if (turno) return { abierto: false, abre: turno.abre, cuando: i === 1 ? 'mañana' : `el ${DIAS[dia]}` };
  }
  return null;
}
