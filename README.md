# Pánico Comedor: sitio demo

Sitio estático en HTML + CSS, con JavaScript compilado desde TypeScript (sin framework), para **Pánico Comedor**, Manuel Gutiérrez Nájera Sur 46, Centro Histórico, Querétaro. Construido según el *Estándar de Desarrollo Web para Restaurantes y Cafeterías*. Es un sitio de **nivel 2** (indicador de abierto ahora y filtros del menú); el JavaScript se escribe en TypeScript y se compila con esbuild. El sitio no tiene reservas ni pedidos en línea: el contacto es por teléfono y WhatsApp.

Demo publicada: https://leonardosuazoaguilar.github.io/panico-comedor/

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Inicio one-page: hero, destacados, nosotros, reseñas, temporada, ubicación y horarios, Instagram. Lleva el schema JSON-LD (`Restaurant`). |
| `menu.html` | Menú en HTML por categorías, con precios, vegetariano y alérgenos. |
| `aviso-privacidad.html` | Aviso de privacidad (LFPDPPP). |
| `css/tokens.css` | Design tokens del cliente: colores, tipografías con sus respaldos, espaciados, textura y formas dibujadas. |
| `css/base.css` | Estilos de la plantilla; solo usa variables de `tokens.css`. |
| `src/` | Código TypeScript. `main.ts` (todas las páginas) y `menu.ts` (solo el menú) son las entradas; un módulo por función. |
| `src/datos/cliente.json` | Datos del negocio que usa el JavaScript (zona horaria, horario por día). Se genera desde la ficha de Airtable; el tipo `Cliente` de `src/tipos.ts` hace que el build falle si cambia su forma. |
| `js/` | JavaScript compilado (`main.js`, `menu.js`). No se edita a mano: se regenera con `npm run build`. |
| `package.json`, `tsconfig.json` | esbuild, TypeScript y Playwright (solo para compilar y probar; el sitio publicado no tiene dependencias). |
| `pruebas/anchos.mjs` | Prueba de diseño adaptativo con Playwright (ver abajo). Las capturas quedan en `pruebas/capturas/`, que no se sube al repositorio. |
| `img/` | Fotos en AVIF + WebP, en 2 tamaños (las de 240 px solo existen en un tamaño porque el original no da más). |
| `fonts/` | Fredoka (títulos) y Work Sans (texto), de Google Fonts, variables, subconjunto latino, autoalojadas. |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Estáticos. |
| `_headers` | Encabezados de seguridad y caché para Cloudflare Pages. |
| `.nojekyll` | Para que GitHub Pages sirva los archivos tal cual. |

Los bloques repetidos están marcados con comentarios para reemplazarlos en todos los sitios a la vez: `inicio:cabecera`, `inicio:pie`, `inicio:barra-movil`, `inicio:analitica`, `inicio:scripts`, `inicio:schema`, `inicio:eventos` y `inicio:menu`.

Todos los enlaces son relativos, así que el sitio funciona igual en una subcarpeta (GitHub Pages) que en la raíz de un dominio (Cloudflare Pages).

El pie de todas las páginas lleva el crédito "Powered by DuaL Digital Branding" dentro del bloque `pie`. Cuando exista el sitio de la agencia, hay que convertirlo en enlace en las 3 páginas.

## Diseño adaptativo: del celular a 6K

- Diseñado primero a 360 px y probado en 320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560, 3840 y 6016 px, en vertical y en horizontal.
- Todas las medidas están en `rem`. Arriba de 1920 px crece la base de 16 px (`tokens.css`), con cambios de ritmo en 2560 y 3840 px: 20 px en 2K, 30 px en 4K y 44 px en 6K. Así la página se ve igual de proporcionada en un monitor 4K o 6K que en uno de 1920 px.
- Espacios grandes y títulos con `clamp()`. Texto limitado a 68 caracteres por línea (`--ancho-texto`) y contenido a un ancho máximo centrado (`--ancho-max`, 75 rem). Los fondos, las orillas onduladas y la cinta ocupan todo el ancho.
- Rejillas fluidas (`repeat(auto-fit, minmax())` en temporada y flexbox en reseñas). Container queries en las tarjetas de platillo, temporada y el cierre del menú. Las media queries de 768 y 1024 px solo cambian la estructura.
- Los efectos al pasar el cursor van dentro de `@media (hover: hover)`; en pantallas táctiles los botones responden al toque.
- `viewport-fit=cover`: la barra inferior respeta `env(safe-area-inset-bottom)` y los márgenes laterales respetan el notch en horizontal.
- La foto del hero va enmarcada (es parte del estilo de calcomanía) y no a todo el ancho, porque la foto que tenemos mide 944 px. Con fotos profesionales de 3840 px se puede considerar un hero a todo el ancho.

```bash
npm run prueba:anchos   # 3 páginas × 11 anchos × 2 orientaciones = 66 vistas
```

La prueba usa el Chrome instalado y falla si alguna vista tiene scroll horizontal, algo que se sale de la pantalla o texto cortado. Resultado actual: 66 de 66 sin problemas.

## Diseño y personalidad

El lenguaje visual sale del letrero pintado a mano y del mapa ilustrado de Pánico: contornos café, sombras duras como de calcomanía, papel con textura, orillas onduladas como corteza de pan y garabatos bajo los títulos.

- **Elemento firma:** la rebanada de pan con ojos del letrero, en el hero y en el menú. Sigue al cursor (o al último toque) con los ojos, se inclina en 3D, parpadea sola y se asusta si la tocas. Entre inicio y menú "salta" de una página a otra con View Transitions.
- **Logo:** palabra "PÁNICO" (con la I de baguette) y "PAN Y CONSERVAS" redibujadas en SVG a partir del letrero, nunca escritas con una fuente. Hay que reemplazarlas por el SVG original de la marca cuando el cliente lo entregue.
- **Tipografía:** Fredoka para títulos, por ser la de Google Fonts más parecida al logotipo (redonda, gruesa, de terminales suaves). Alternativas a proponer al cliente: Baloo 2 y Lilita One. Work Sans para texto y nombres de platillos. Cada fuente tiene un respaldo de Arial ajustado con `size-adjust` para que no salte el diseño.
- **Color:** paleta del letrero y el mapa. El amarillo de las calles del mapa (`--color-cta`) es solo para el botón de acción principal de cada bloque (Ver menú, Cómo llegar, Abrir en Google Maps).
- **Movimiento:** tarjetas que se inclinan en 3D con el cursor (solo con mouse), piezas que aparecen al hacer scroll con `animation-timeline: view()` y respaldo con IntersectionObserver, foto de Nosotros con parallax, cinta de texto bajo el hero, botones que rebotan al tocarlos e iconos de la barra móvil que se menean. Interacciones de 150 a 400 ms. Todo se apaga con `prefers-reduced-motion` y el pan tampoco se anima con ahorro de datos.
- **Sin WebGL:** el pan en SVG con 3D de CSS cubre el elemento firma sin cargar Three.js ni un modelo glTF.

## JavaScript y TypeScript

Todo es mejora progresiva: sin JavaScript se leen igual el menú, el horario, la dirección y los botones de contacto. Lo que solo funciona con JavaScript lleva la clase `requiere-js` y se oculta con `@media (scripting: none)`.

| Función | Módulo | Nivel |
| --- | --- | --- |
| Pan con ojos que sigue al cursor, parpadea y se asusta (`data-mascota`) | `mascota.ts` | 1 |
| Tarjetas que se inclinan en 3D hacia el cursor (`data-inclinar`) | `inclinar.ts` | 1 |
| Respaldo de las piezas que aparecen al hacer scroll (`data-aparecer`) donde el CSS no tiene `animation-timeline` | `aparecer.ts` | 1 |
| Mapa de Google que se carga al tocar | `mapa.ts` | 1 |
| Eventos de analítica en llamar, WhatsApp y cómo llegar | `analitica.ts` | 1 |
| "Abierto ahora / Cierra pronto / Cerrado" con la hora de Querétaro, no la del visitante (`data-estado`) | `horario.ts`, `abierto.ts` | 2 |
| Filtros del menú: vegetariano, sin gluten, sin lácteos, sin frutos secos | `platillos.ts`, `filtros.ts` | 2 |

`movimiento.ts` decide si se puede animar (reducir movimiento, ahorro de datos y si hay mouse). Cada platillo del menú lleva `data-id`, `data-precio` y `data-etiquetas` (`vegetariano vegano gluten lacteos huevo frutos-secos`); al regenerar `menu.html` desde el Sheet hay que conservarlos para los filtros.

Peso: 5.1 KB (`main.js`) + 1.5 KB (`menu.js`) sin comprimir, muy por debajo del límite de 50 KB.

```bash
npm install        # una vez: esbuild y TypeScript
npm run check      # revisión de tipos (tsc --noEmit)
npm run build      # compila src/*.ts a js/
npm run dev        # recompila al guardar
npm run prueba:anchos  # prueba de diseño adaptativo con Playwright
```

`js/` se sube al repositorio ya compilado, así que GitHub Pages y Cloudflare Pages lo sirven sin paso de compilación. Después de cambiar algo en `src/`, correr `npm run check && npm run build` antes del commit.

## Ver en local

Cualquier servidor estático sirve, por ejemplo:

```bash
npx http-server . -p 8080
```

## Publicar en producción (Cloudflare Pages)

Framework preset: *None*, output directory `/`. El build command puede quedar vacío porque `js/` ya va compilado en el repositorio; si se prefiere compilar en Cloudflare, usar `npm ci && npm run build`. Antes de publicar:

1. Quitar `<meta name="robots" content="noindex">` de las 3 páginas y la franja `aviso-demo` de la cabecera.
2. Cambiar `https://leonardosuazoaguilar.github.io/panico-comedor/` por el dominio final en `canonical`, `og:*`, JSON-LD, `robots.txt` y `sitemap.xml`.
3. Pegar GA4, Clarity y Meta Pixel en el bloque `analitica`; los clics en llamar, WhatsApp y cómo llegar ya se envían como eventos.
4. Copiar el horario definitivo a `src/datos/cliente.json` (además del HTML y el JSON-LD) y recompilar.
5. Validar el schema en Rich Results Test y Schema Markup Validator.
6. Correr `npm run prueba:anchos` y revisar las capturas de `pruebas/capturas/`, sobre todo en 320 px, 1920 px y 6K.
7. Prueba con personas reales: el dueño y al menos un cliente usan el sitio en su teléfono mientras el equipo observa dónde dudan. Probar el pan animado en un Android de gama media.

## Lighthouse (móvil, servidor local)

| Página | Performance | Accesibilidad | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Inicio | 98 | 100 | 100 | 69* |
| Menú | 99 | 100 | 100 | 66* |

\* El SEO baja solo por el `noindex` del modo demo. Inicio: LCP 2.4 s, CLS 0, TBT 0 ms y 298 KB en total. Menú: LCP 2.0 s, CLS 0 y 140 KB.

## Pendiente antes de producción

**Marca**
- SVG original del logo (el del sitio está redibujado del letrero) y aprobación de la tipografía de títulos entre Fredoka, Baloo 2 y Lilita One, junto al logo.
- Registrar en Airtable el nivel del sitio (2) y las fuentes elegidas.
- Enlazar el crédito "Powered by DuaL Digital Branding" al sitio de la agencia cuando exista.

**Contenido de ejemplo**
- Precios y parte de los platillos del menú son ilustrativos (salen de fotos de Instagram y menciones en reseñas). Hay que capturar el menú físico.
- Reseñas: las 3 tarjetas son espacios marcados; hay que elegir 3 reseñas reales del perfil de Google. La calificación (4.5, 1,674 opiniones) sale del perfil de Google Maps.
- Correo del aviso de privacidad (`privacidad@ejemplo.mx`) y revisión del texto.
- Foto del equipo para "Nosotros" y fotos de platillos en mejor resolución (croissant, tarta y pan de muerto vienen recortadas de Instagram a 240 px).
- El estándar pide fotos con `srcset` de 480 a 3840 px con versiones 2x. Las fotos actuales miden como máximo 944 px, así que en pantallas 2K a 6K se ven estiradas. Con la sesión de fotos hay que exportar cada una en 480, 800, 1280, 1920, 2560 y 3840 px (AVIF + WebP).

**Inconsistencias de NAP** (corregir en la ficha de Airtable y en todos los perfiles):
- Teléfono: el mapa de Instagram dice 442 801 6844; Google Maps muestra 442 212 5117. El sitio usa 442 801 6844.
- Horario de cierre: la bio de Instagram dice 11 pm; el mapa de Instagram y Google Maps dicen 10:30 pm. El sitio usa 10:30 pm.
- Código postal: la bio de Instagram dice 76020; Google Maps dice 76000. El sitio usa 76000.
- Nombre: Google Maps lo tiene como "Comedor Panico" (sin acento); Instagram como "Pánico".
