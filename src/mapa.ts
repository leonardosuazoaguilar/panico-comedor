// Mapa diferido: el iframe de Google Maps solo se carga al tocar el botón.

export function iniciarMapa(): void {
  document.querySelectorAll<HTMLElement>('[data-mapa]').forEach((caja) => {
    caja.querySelector('button')?.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = caja.dataset.mapa ?? '';
      iframe.title = 'Mapa de ubicación de Pánico Comedor';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      caja.replaceChildren(iframe);
    });
  });
}
