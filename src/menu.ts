// Entrada de menu.html: filtros por dieta y alérgenos. Se compila a js/menu.js y se carga después de js/main.js.

import { iniciarFiltros } from './filtros';
import { leerPlatillos } from './platillos';

iniciarFiltros(leerPlatillos(document));
