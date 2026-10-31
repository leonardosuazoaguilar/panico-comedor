// Funciones que inyectan GA4, Microsoft Clarity y Meta Pixel cuando se pegan en el bloque analitica.
interface Window {
  gtag?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
}
