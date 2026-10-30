// JSON-LD generado desde client.json; nunca se escribe a mano.
import { cliente } from './cliente';

export function schemaRestaurante(imagenes: string[]) {
  const { nap } = cliente;
  return {
    '@context': 'https://schema.org',
    '@type': cliente.tipoSchema,
    name: cliente.nombre,
    url: cliente.site,
    telephone: nap.telefonoE164,
    image: imagenes,
    address: {
      '@type': 'PostalAddress',
      streetAddress: nap.calle,
      addressLocality: nap.ciudad,
      addressRegion: nap.estado,
      postalCode: nap.cp,
      addressCountry: nap.pais,
    },
    geo: { '@type': 'GeoCoordinates', latitude: nap.geo.lat, longitude: nap.geo.lng },
    openingHoursSpecification: cliente.horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dias.map((d) => `https://schema.org/${d}`),
      opens: h.abre,
      closes: h.cierra,
    })),
    servesCuisine: cliente.servesCuisine,
    priceRange: cliente.priceRange,
    menu: new URL('/menu', cliente.site).href,
    acceptsReservations: cliente.acceptsReservations,
    sameAs: [cliente.redes.instagram, nap.mapsUrl],
  };
}
