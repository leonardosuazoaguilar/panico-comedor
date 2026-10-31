// Prueba de diseño adaptativo (sección 5 del estándar): abre cada página en todos los anchos, de
// 320 px a 6K, en vertical y en horizontal. Guarda una captura de cada una en pruebas/capturas/ y
// falla si hay scroll horizontal, algo que se sale de la pantalla o texto cortado.
//
//   npm run prueba:anchos
//
// Usa el Chrome instalado en la máquina. Para usar el Chromium de Playwright:
//   npx playwright install chromium  y  NAVEGADOR=chromium npm run prueba:anchos

import { createServer } from 'node:http';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const CAPTURAS = join(RAIZ, 'pruebas', 'capturas');
const PAGINAS = ['index.html', 'menu.html', 'aviso-privacidad.html'];
const ANCHOS = [320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560, 3840, 6016];
const ORIENTACIONES = { vertical: 16 / 9, horizontal: 9 / 16 };
/** Margen para el redondeo de los navegadores y los giros de 1–2° de fotos y etiquetas. */
const TOLERANCIA = 3;

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json',
};

const servidor = createServer((pedido, respuesta) => {
  const ruta = decodeURIComponent(new URL(pedido.url ?? '/', 'http://local').pathname);
  const archivo = join(RAIZ, normalize(ruta === '/' ? '/index.html' : ruta));
  try {
    const cuerpo = readFileSync(archivo);
    respuesta.writeHead(200, { 'content-type': TIPOS[extname(archivo)] ?? 'application/octet-stream' }).end(cuerpo);
  } catch {
    respuesta.writeHead(404).end();
  }
});
await new Promise((listo) => servidor.listen(0, '127.0.0.1', listo));
const BASE = `http://127.0.0.1:${servidor.address().port}/`;

/** Corre dentro de la página: lista lo que se sale de la pantalla o queda cortado. */
function revisar(tolerancia) {
  const ancho = document.documentElement.clientWidth;
  const problemas = [];
  const nombre = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.classList.length ? `.${[...el.classList].join('.')}` : '');
  const ignorar = (el) => el.closest('[aria-hidden="true"], .visualmente-oculto, .saltar, noscript, head');

  const desborde = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (desborde > ancho + 1) problemas.push(`scroll horizontal: ${desborde} px en ${ancho} px`);

  for (const el of document.body.querySelectorAll('*')) {
    if (ignorar(el)) continue;
    const caja = el.getBoundingClientRect();
    if (!caja.width || !caja.height) continue;
    if (caja.right > ancho + tolerancia || caja.left < -tolerancia) {
      // Lo que vive dentro de un contenedor con scroll propio (las categorías del menú) no cuenta.
      let padre = el.parentElement;
      let enScroll = false;
      while (padre && padre !== document.body) {
        if (/(auto|scroll)/.test(getComputedStyle(padre).overflowX)) { enScroll = true; break; }
        padre = padre.parentElement;
      }
      if (!enScroll) problemas.push(`se sale de la pantalla: ${nombre(el)} (${Math.round(caja.left)}–${Math.round(caja.right)} de ${ancho})`);
    }
  }

  // Texto cortado: cada línea de texto tiene que caber en los contenedores que recortan (overflow).
  const recorrido = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let nodo = recorrido.nextNode(); nodo; nodo = recorrido.nextNode()) {
    const el = nodo.parentElement;
    if (!el || !nodo.textContent.trim() || ignorar(el)) continue;
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    for (const linea of rango.getClientRects()) {
      if (!linea.width) continue;
      let enScroll = false;
      for (let padre = el; padre && padre !== document.documentElement; padre = padre.parentElement) {
        const estilo = getComputedStyle(padre);
        if (/(auto|scroll)/.test(estilo.overflowX)) { enScroll = true; break; }
        if (!/(hidden|clip)/.test(estilo.overflowX + estilo.overflowY) || padre === document.body) continue;
        const marco = padre.getBoundingClientRect();
        if (linea.right > marco.right + tolerancia || linea.left < marco.left - tolerancia || linea.bottom > marco.bottom + tolerancia) {
          problemas.push(`texto cortado en ${nombre(padre)}: "${nodo.textContent.trim().slice(0, 40)}"`);
        }
        break;
      }
      if (!enScroll && linea.right > ancho + tolerancia) problemas.push(`texto fuera de la pantalla: "${nodo.textContent.trim().slice(0, 40)}"`);
    }
  }
  return [...new Set(problemas)];
}

rmSync(CAPTURAS, { recursive: true, force: true });
mkdirSync(CAPTURAS, { recursive: true });

const navegador = await chromium.launch({ channel: process.env.NAVEGADOR ?? 'chrome' });
let fallas = 0;
let revisadas = 0;

for (const [orientacion, proporcion] of Object.entries(ORIENTACIONES)) {
  for (const ancho of ANCHOS) {
    const alto = Math.round(ancho * proporcion);
    // Sin animaciones para que las capturas salgan estables; el diseño es el mismo.
    const contexto = await navegador.newContext({ viewport: { width: ancho, height: alto }, reducedMotion: 'reduce' });
    await contexto.route('**/*', (ruta) => (ruta.request().url().startsWith(BASE) ? ruta.continue() : ruta.abort()));
    const pagina = await contexto.newPage();
    for (const archivo of PAGINAS) {
      await pagina.goto(BASE + archivo, { waitUntil: 'load' });
      await pagina.evaluate(() => document.fonts.ready);
      const problemas = await pagina.evaluate(revisar, TOLERANCIA);
      const nombre = `${archivo.replace('.html', '')}-${ancho}-${orientacion}`;
      try {
        await pagina.screenshot({ path: join(CAPTURAS, `${nombre}.jpg`), fullPage: true, type: 'jpeg', quality: 60 });
      } catch {
        // Una página completa a 6K puede pasar del límite de captura del navegador: se guarda la pantalla visible.
        await pagina.screenshot({ path: join(CAPTURAS, `${nombre}.jpg`), type: 'jpeg', quality: 60 });
      }
      revisadas++;
      if (problemas.length) {
        fallas++;
        console.log(`✗ ${archivo} a ${ancho}×${alto} (${orientacion})`);
        for (const problema of problemas) console.log(`    ${problema}`);
      }
    }
    await contexto.close();
  }
}

await navegador.close();
servidor.close();
console.log(`\n${revisadas - fallas} de ${revisadas} vistas sin problemas. Capturas en pruebas/capturas/.`);
if (fallas) process.exitCode = 1;
