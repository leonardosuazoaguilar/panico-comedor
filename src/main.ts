// Entrada común de todas las páginas: se compila a js/main.js.

import { iniciarEstado } from './abierto';
import { escucharClics } from './analitica';
import { iniciarAparecer } from './aparecer';
import { iniciarMapa } from './mapa';

escucharClics();
iniciarEstado();
iniciarMapa();
iniciarAparecer();
