# Pánico Comedor: sitio demo

Sitio estático en Astro para **Pánico Comedor** (Manuel Gutiérrez Nájera Sur 46, Centro Histórico, Querétaro), construido según el *Estándar de Desarrollo Web para Restaurantes y Cafeterías*.

## Estructura

| Archivo | Qué contiene |
| --- | --- |
| `client.json` | Datos del cliente: NAP, horarios, redes, reseñas, eventos, colores (design tokens) y IDs de analítica. Todo el sitio y el JSON-LD salen de aquí. |
| `src/data/menu.csv` | Menú con las mismas columnas que el Google Sheet: `categoria, nombre, descripcion, precio, etiquetas, destacado, foto`. |
| `src/assets/fotos/` | Fotos reales del local (Astro las convierte a AVIF/WebP con `width`/`height`). |
| `src/pages/` | `index` (one-page), `menu`, `aviso-de-privacidad`. |
| `public/_headers` | Encabezados de seguridad para Cloudflare Pages. |

### Menú desde Google Sheet

Publica la hoja como CSV (Archivo → Compartir → Publicar en la web → CSV) y define la variable de entorno al construir:

```bash
MENU_CSV_URL="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv" npm run build
```

Sin la variable se usa `src/data/menu.csv`.

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview
```

## Despliegue (Cloudflare Pages)

Build command `npm run build`, output `dist`, variable `MENU_CSV_URL` opcional. Antes de publicar en producción, cambia `"demo": false` en `client.json` (quita el `noindex` y los avisos de demostración) y actualiza `site` y `public/robots.txt` con el dominio final.

## Resultados Lighthouse (móvil, build local)

| Página | Performance | Accesibilidad | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Inicio | 99 | 100 | 100 | 69* |
| Menú | 100 | 100 | 100 | 66* |

\* SEO baja solo por el `noindex` del modo demo. LCP 2.0 s, CLS 0, peso de inicio ≈240 KB.

## Pendiente antes de producción

**Contenido de demostración**
- Precios del menú: ilustrativos. Los platillos salen de fotos de Instagram y de menciones en reseñas de Google (chilaquiles, focaccias). Hay que capturar el menú físico.
- Reseñas: las 3 tarjetas son marcadores; hay que elegir 3 reseñas reales del perfil de Google. La calificación (4.5, 1,674 opiniones) sí es real.
- Correo del aviso de privacidad (`privacidad@ejemplo.mx`) y revisión legal del texto.
- Foto del equipo para "Nosotros".
- IDs de GA4, Clarity y Meta Pixel en `client.json`.

**Inconsistencias de NAP detectadas** (corregir en la fuente única de verdad):
- **Teléfono:** el mapa de Instagram dice 442 801 6844 (WhatsApp); Google Maps muestra 442 212 5117. El sitio usa 442 801 6844.
- **Horario de cierre:** la bio de Instagram dice 11 pm; el mapa de Instagram y Google Maps dicen 10:30 pm. El sitio usa 10:30 pm.
- **Código postal:** Instagram dice 76020; Google Maps dice 76000. El sitio usa 76000.
- **Nombre:** Google Maps lo tiene como "Comedor Panico" (sin acento); Instagram como "Pánico".
