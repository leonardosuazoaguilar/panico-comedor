# Pánico Comedor: sitio demo

Sitio estático en HTML + CSS, con JavaScript compilado desde TypeScript (sin framework), para **Pánico Comedor**, Manuel Gutiérrez Nájera Sur 46, Centro Histórico, Querétaro. Construido según el *Estándar de Desarrollo Web para Restaurantes y Cafeterías*. Es un sitio de **nivel 3** (funciones complejas: pedido para llevar con cálculo de total), así que el JavaScript se escribe en TypeScript y se compila con esbuild.

Demo publicada: https://leonardosuazoaguilar.github.io/panico-comedor/

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Inicio one-page: hero, destacados, nosotros, reseñas, temporada, ubicación y horarios, Instagram. Lleva el schema JSON-LD (`Restaurant`). |
| `menu.html` | Menú en HTML por categorías, con precios, vegetariano y alérgenos. |
| `aviso-privacidad.html` | Aviso de privacidad (LFPDPPP). |
| `css/tokens.css` | Design tokens del cliente: colores, tipografías, espaciados y `@font-face`. |
| `css/base.css` | Estilos de la plantilla; solo usa variables de `tokens.css`. |
| `src/` | Código TypeScript. `main.ts` (todas las páginas) y `menu.ts` (solo el menú) son las entradas; un módulo por función. |
| `src/datos/cliente.json` | Datos del negocio que usa el JavaScript (WhatsApp, zona horaria, horario por día). Se genera desde la ficha de Airtable; el tipo `Cliente` de `src/tipos.ts` hace que el build falle si cambia su forma. |
| `js/` | JavaScript compilado (`main.js`, `menu.js`). No se edita a mano: se regenera con `npm run build`. |
| `package.json`, `tsconfig.json` | esbuild y TypeScript (solo para compilar; el sitio publicado no tiene dependencias). |
| `img/` | Fotos en AVIF + WebP, en 2 tamaños (las de 240 px solo existen en un tamaño porque el original no da más). |
| `fonts/` | Bricolage Grotesque (títulos) y Work Sans (texto), variables, autoalojadas. |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Estáticos. |
| `_headers` | Encabezados de seguridad y caché para Cloudflare Pages. |
| `.nojekyll` | Para que GitHub Pages sirva los archivos tal cual. |

Los bloques repetidos están marcados con comentarios para reemplazarlos en todos los sitios a la vez: `inicio:cabecera`, `inicio:pie`, `inicio:barra-movil`, `inicio:analitica`, `inicio:scripts`, `inicio:schema`, `inicio:eventos` y `inicio:menu`.

Todos los enlaces son relativos, así que el sitio funciona igual en una subcarpeta (GitHub Pages) que en la raíz de un dominio (Cloudflare Pages).

## JavaScript y TypeScript

Todo es mejora progresiva: sin JavaScript se leen igual el menú, el horario, la dirección y los botones de WhatsApp. Lo que solo funciona con JavaScript lleva la clase `requiere-js` y se oculta con `@media (scripting: none)`.

| Función | Módulo | Nivel |
| --- | --- | --- |
| Piezas que aparecen al hacer scroll (`data-aparecer`), solo con `transform` y `opacity`; se desactiva con `prefers-reduced-motion` | `aparecer.ts` | 1 |
| Mapa de Google que se carga al tocar | `mapa.ts` | 1 |
| Eventos de analítica en llamar, WhatsApp, cómo llegar, reservar, agregar y enviar pedido | `analitica.ts` | 1 |
| "Abierto ahora / Cierra pronto / Cerrado" con la hora de Querétaro, no la del visitante (`data-estado`) | `horario.ts`, `abierto.ts` | 2 |
| Filtros del menú: vegetariano, sin gluten, sin lácteos, sin frutos secos | `platillos.ts`, `filtros.ts` | 2 |
| Pedido para llevar: botón «Agregar», total en pesos y mensaje de WhatsApp ya escrito; se guarda en `sessionStorage` | `pedido.ts`, `panel-pedido.ts` | 3 |

Cada platillo del menú lleva `data-id`, `data-precio` y `data-etiquetas` (`vegetariano vegano gluten lacteos huevo frutos-secos`); al regenerar `menu.html` desde el Sheet hay que conservarlos.

Peso: 3.3 KB (`main.js`) + 6.1 KB (`menu.js`) sin comprimir, muy por debajo del límite de 50 KB.

```bash
npm install        # una vez: esbuild y TypeScript
npm run check      # revisión de tipos (tsc --noEmit)
npm run build      # compila src/*.ts a js/
npm run dev        # recompila al guardar
```

`js/` se sube al repositorio ya compilado, así que GitHub Pages y Cloudflare Pages lo sirven sin paso de compilación. Después de cambiar algo en `src/`, correr `npm run check && npm run build` antes del commit.

## Ver en local

Cualquier servidor estático sirve, por ejemplo:

```bash
npx http-server . -p 8080
```

## Publicar en producción (Cloudflare Pages)

Framework preset: *None*, output directory `/`. El build command puede quedar vacío porque `js/` ya va compilado en el repositorio; si se prefiere compilar en Cloudflare, usar `npm ci && npm run build`. Antes de publicar:

1. Quitar `<meta name="robots" content="noindex">` de las 3 páginas y la franja amarilla `aviso-demo` de la cabecera.
2. Cambiar `https://leonardosuazoaguilar.github.io/panico-comedor/` por el dominio final en `canonical`, `og:*`, JSON-LD, `robots.txt` y `sitemap.xml`.
3. Pegar GA4, Clarity y Meta Pixel en el bloque `analitica`; los clics en llamar, WhatsApp, cómo llegar, reservar, agregar al pedido (`AddToCart` en Pixel) y enviar pedido ya se envían como eventos.
4. Copiar el horario definitivo a `src/datos/cliente.json` (además del HTML y el JSON-LD) y recompilar.
5. Validar el schema en Rich Results Test y Schema Markup Validator.

## Lighthouse (móvil, servidor local)

| Página | Performance | Accesibilidad | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Inicio | 98 | 100 | 100 | 69* |
| Menú | 99 | 100 | 100 | 66* |

\* El SEO baja solo por el `noindex` del modo demo. Con el JavaScript: inicio con LCP 2.4 s, CLS 0, TBT 0 ms y 297 KB en total; menú con LCP 1.8 s, CLS 0 y 149 KB.

## Pendiente antes de producción

**Contenido de ejemplo**
- Precios y parte de los platillos del menú son ilustrativos (salen de fotos de Instagram y menciones en reseñas). Hay que capturar el menú físico.
- Reseñas: las 3 tarjetas son espacios marcados; hay que elegir 3 reseñas reales del perfil de Google. La calificación (4.5, 1,674 opiniones) sale del perfil de Google Maps.
- Correo del aviso de privacidad (`privacidad@ejemplo.mx`) y revisión del texto.
- Foto del equipo para "Nosotros" y fotos de platillos en mejor resolución (croissant, tarta y pan de muerto vienen recortadas de Instagram a 240 px).

**Inconsistencias de NAP** (corregir en la ficha de Airtable y en todos los perfiles):
- Teléfono: el mapa de Instagram dice 442 801 6844; Google Maps muestra 442 212 5117. El sitio usa 442 801 6844.
- Horario de cierre: la bio de Instagram dice 11 pm; el mapa de Instagram y Google Maps dicen 10:30 pm. El sitio usa 10:30 pm.
- Código postal: la bio de Instagram dice 76020; Google Maps dice 76000. El sitio usa 76000.
- Nombre: Google Maps lo tiene como "Comedor Panico" (sin acento); Instagram como "Pánico".
