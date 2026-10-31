// Elemento firma: la rebanada de pan con ojos del letrero (data-mascota).
// Sigue al cursor (o al último toque) con los ojos y se inclina en 3D, parpadea sola y se asusta
// si la tocas, porque se llama Pánico. Se pausa fuera de pantalla y no se anima con reducir
// movimiento ni con ahorro de datos.

import { puedeAnimar } from './movimiento';

/** Recorrido máximo de las pupilas, en unidades del viewBox. */
const PUPILA_X = 6;
const PUPILA_Y = 3.5;
/** Las pupilas del dibujo están corridas 5 unidades a la izquierda, como en el letrero. */
const CORRIMIENTO = 5;
/** Igual que la animación "susto" de base.css. */
const DURACION_SUSTO = 520;

interface Punto {
  x: number;
  y: number;
}

function animar(svg: SVGSVGElement): void {
  const pupilas = [...svg.querySelectorAll<SVGElement>('.mascota__pupila')];
  let punto: Punto | null = null;
  let cuadro = 0;
  let visible = false;
  let parpadeo: number | undefined;

  const mirar = () => {
    cuadro = 0;
    if (!punto) return;
    const caja = svg.getBoundingClientRect();
    const dx = punto.x - (caja.left + caja.width / 2);
    const dy = punto.y - (caja.top + caja.height / 2);
    const distancia = Math.hypot(dx, dy) || 1;
    const fuerza = Math.min(distancia / 250, 1);
    const x = (dx / distancia) * PUPILA_X * fuerza + CORRIMIENTO;
    const y = (dy / distancia) * PUPILA_Y * fuerza;
    for (const pupila of pupilas) pupila.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    svg.style.setProperty('--giro-y', `${((dx / innerWidth) * 28).toFixed(2)}deg`);
    svg.style.setProperty('--giro-x', `${((-dy / innerHeight) * 18).toFixed(2)}deg`);
  };

  const alMover = (e: PointerEvent) => {
    punto = { x: e.clientX, y: e.clientY };
    if (visible && !cuadro) cuadro = requestAnimationFrame(mirar);
  };

  const programarParpadeo = () => {
    parpadeo = window.setTimeout(() => {
      svg.classList.add('parpadea');
      window.setTimeout(() => svg.classList.remove('parpadea'), 160);
      programarParpadeo();
    }, 2200 + Math.random() * 3800);
  };

  new IntersectionObserver(([entrada]) => {
    visible = entrada?.isIntersecting ?? false;
    window.clearTimeout(parpadeo);
    if (visible) programarParpadeo();
  }).observe(svg);

  addEventListener('pointermove', alMover, { passive: true });
  addEventListener('pointerdown', alMover, { passive: true });

  let finSusto: number | undefined;
  svg.addEventListener('click', () => {
    svg.classList.remove('susto');
    void svg.getBoundingClientRect(); // reinicia la animación si se toca varias veces seguidas
    svg.classList.add('susto');
    window.clearTimeout(finSusto);
    finSusto = window.setTimeout(() => svg.classList.remove('susto'), DURACION_SUSTO);
  });
  svg.classList.add('mascota--viva');
}

export function iniciarMascota(): void {
  if (!puedeAnimar()) return;
  document.querySelectorAll<SVGSVGElement>('svg[data-mascota]').forEach(animar);
}
