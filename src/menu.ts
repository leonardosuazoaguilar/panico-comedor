// Entrada de menu.html: filtros y pedido para llevar. Se compila a js/menu.js y se carga después de js/main.js.

import { cliente } from './cliente';
import { iniciarFiltros } from './filtros';
import { iniciarPedido } from './panel-pedido';
import { leerPlatillos } from './platillos';

const platillos = leerPlatillos(document);
iniciarFiltros(platillos);
iniciarPedido(platillos, cliente);
