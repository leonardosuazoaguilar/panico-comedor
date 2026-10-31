// Envía eventos a GA4, Clarity y Meta Pixel si están cargados; si no, no hace nada.

export function registrarEvento(evento: string, datos: Record<string, unknown> = {}): void {
  window.gtag?.('event', evento, datos);
  window.clarity?.('event', evento);
  window.fbq?.('track', 'Contact', { metodo: evento, ...datos });
}

/** Registra los clics en elementos con data-evento (llamar, WhatsApp, cómo llegar). */
export function escucharClics(): void {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-evento]');
    if (!el?.dataset.evento) return;
    registrarEvento(el.dataset.evento, { link_url: el instanceof HTMLAnchorElement ? el.href : undefined });
  });
}
