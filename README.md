# Pánico Comedor: sitio demo

Sitio estático en HTML + CSS (sin framework ni paso de compilación) para **Pánico Comedor**, Manuel Gutiérrez Nájera Sur 46, Centro Histórico, Querétaro. Construido según el *Estándar de Desarrollo Web para Restaurantes y Cafeterías*.

Demo publicada: https://leonardosuazoaguilar.github.io/panico-comedor/

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Inicio one-page: hero, destacados, nosotros, reseñas, temporada, ubicación y horarios, Instagram. Lleva el schema JSON-LD (`Restaurant`). |
| `menu.html` | Menú en HTML por categorías, con precios, vegetariano y alérgenos. |
| `aviso-privacidad.html` | Aviso de privacidad (LFPDPPP). |
| `css/tokens.css` | Design tokens del cliente: colores, tipografías, espaciados y `@font-face`. |
| `css/base.css` | Estilos de la plantilla; solo usa variables de `tokens.css`. |
| `img/` | Fotos en AVIF + WebP, en 2 tamaños (las de 240 px solo existen en un tamaño porque el original no da más). |
| `fonts/` | Bricolage Grotesque (títulos) y Work Sans (texto), variables, autoalojadas. |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Estáticos. |
| `_headers` | Encabezados de seguridad y caché para Cloudflare Pages. |
| `.nojekyll` | Para que GitHub Pages sirva los archivos tal cual. |

Los bloques repetidos están marcados con comentarios para reemplazarlos en todos los sitios a la vez: `inicio:cabecera`, `inicio:pie`, `inicio:barra-movil`, `inicio:analitica`, `inicio:eventos-analitica`, `inicio:schema`, `inicio:eventos` y `inicio:menu`.

Todos los enlaces son relativos, así que el sitio funciona igual en una subcarpeta (GitHub Pages) que en la raíz de un dominio (Cloudflare Pages).

## Ver en local

Cualquier servidor estático sirve, por ejemplo:

```bash
npx http-server . -p 8080
```

## Publicar en producción (Cloudflare Pages)

Framework preset: *None*, build command vacío, output directory `/`. Antes de publicar:

1. Quitar `<meta name="robots" content="noindex">` de las 3 páginas y la franja amarilla `aviso-demo` de la cabecera.
2. Cambiar `https://leonardosuazoaguilar.github.io/panico-comedor/` por el dominio final en `canonical`, `og:*`, JSON-LD, `robots.txt` y `sitemap.xml`.
3. Pegar GA4, Clarity y Meta Pixel en el bloque `analitica`; los clics en llamar, WhatsApp, cómo llegar y reservar ya se envían como eventos.
4. Validar el schema en Rich Results Test y Schema Markup Validator.

## Lighthouse (móvil, servidor local)

| Página | Performance | Accesibilidad | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Inicio | 98 | 100 | 100 | 69* |
| Menú | 99 | 100 | 100 | 66* |

\* El SEO baja solo por el `noindex` del modo demo. Inicio: LCP 2.3 s, CLS 0, 287 KB en total.

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
