// Datos del negocio. src/datos/cliente.json se genera desde la ficha del cliente en Airtable;
// el tipo Cliente hace que el build falle si falta un campo o cambia su forma.

import datos from './datos/cliente.json';
import type { Cliente } from './tipos';

export const cliente: Cliente = datos;
