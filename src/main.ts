// Entrada común de todas las páginas: se compila a js/main.js.

import { iniciarEstado } from './abierto';
import { escucharClics } from './analitica';
import { iniciarAparecer } from './aparecer';
import { iniciarInclinar } from './inclinar';
import { iniciarMapa } from './mapa';
import { iniciarMascota } from './mascota';

escucharClics();
iniciarEstado();
iniciarMapa();
iniciarAparecer();
iniciarMascota();
iniciarInclinar();
