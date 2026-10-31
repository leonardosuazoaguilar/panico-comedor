// Interfaz del pedido para llevar en menu.html: botones "Agregar", barra flotante y panel (<dialog>).
// Sin JavaScript, el menú se lee igual y queda el botón general de pedir por WhatsApp.

import { registrarEvento } from './analitica';
import { Pedido, pesos } from './pedido';
import type { PlatilloEnPagina } from './platillos';
import type { Cliente, LineaPedido } from './tipos';

const CLAVE_GUARDADO = 'panico-pedido';

function leerGuardado(): unknown {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_GUARDADO) ?? 'null');
  } catch {
    return null;
  }
}

function guardar(pedido: Pedido): void {
  try {
    sessionStorage.setItem(CLAVE_GUARDADO, JSON.stringify(pedido.aObjeto()));
  } catch {
    // Sin almacenamiento (modo privado o bloqueado): el pedido vive solo mientras la página está abierta.
  }
}

const textoPiezas = (n: number) => `${n} ${n === 1 ? 'platillo' : 'platillos'}`;

function botonCantidad(accion: 'sumar' | 'quitar', id: string, nombre: string): HTMLButtonElement {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'linea__boton';
  boton.dataset[accion] = id;
  const oculto = document.createElement('span');
  oculto.className = 'visualmente-oculto';
  oculto.textContent = accion === 'sumar' ? ` Agregar 1 de ${nombre}` : ` Quitar 1 de ${nombre}`;
  boton.append(accion === 'sumar' ? '+' : '−', oculto);
  return boton;
}

function crearLinea({ platillo, cantidad }: LineaPedido): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'linea';

  const nombre = document.createElement('span');
  nombre.className = 'linea__nombre';
  nombre.textContent = platillo.nombre;

  const controles = document.createElement('span');
  controles.className = 'linea__cantidad';
  const numero = document.createElement('span');
  numero.textContent = String(cantidad);
  controles.append(botonCantidad('quitar', platillo.id, platillo.nombre), numero, botonCantidad('sumar', platillo.id, platillo.nombre));

  const subtotal = document.createElement('span');
  subtotal.className = 'linea__subtotal';
  subtotal.textContent = pesos.format(platillo.precio * cantidad);

  li.append(nombre, controles, subtotal);
  return li;
}

export function iniciarPedido(platillos: PlatilloEnPagina[], cliente: Cliente): void {
  const barra = document.querySelector<HTMLElement>('[data-pedido]');
  const abrir = barra?.querySelector<HTMLButtonElement>('button');
  const panel = document.querySelector<HTMLDialogElement>('dialog[data-pedido-panel]');
  const lista = panel?.querySelector<HTMLElement>('[data-pedido-lineas]');
  const enviar = panel?.querySelector<HTMLAnchorElement>('[data-pedido-enviar]');
  const aviso = document.querySelector<HTMLElement>('[data-pedido-aviso]');
  if (!barra || !abrir || !panel || !lista || !enviar || !aviso) return;

  const catalogo = new Map(platillos.map(({ platillo }) => [platillo.id, platillo]));
  const pedido = Pedido.desde(catalogo, leerGuardado());
  const botonesAgregar = new Map<string, HTMLButtonElement>();
  for (const { elemento, platillo } of platillos) {
    const boton = elemento.querySelector<HTMLButtonElement>('[data-agregar]');
    if (boton) botonesAgregar.set(platillo.id, boton);
  }

  const pintar = () => {
    const vacio = pedido.piezas === 0;
    barra.hidden = vacio;
    document.body.classList.toggle('con-pedido', !vacio);

    document.querySelectorAll('[data-pedido-piezas]').forEach((el) => { el.textContent = textoPiezas(pedido.piezas); });
    document.querySelectorAll('[data-pedido-total]').forEach((el) => { el.textContent = pesos.format(pedido.total); });

    // Al redibujar las líneas se conserva el foco en el mismo botón + o −.
    const enfocado = document.activeElement instanceof HTMLElement ? document.activeElement.dataset : {};
    lista.replaceChildren(...pedido.lineas.map(crearLinea));
    for (const accion of ['sumar', 'quitar'] as const) {
      const id = enfocado[accion];
      if (id) (lista.querySelector<HTMLElement>(`[data-${accion}="${CSS.escape(id)}"]`) ?? enviar).focus();
    }

    enviar.href = `https://wa.me/${cliente.whatsapp}?text=${encodeURIComponent(pedido.mensaje(cliente.nombre))}`;

    for (const [id, boton] of botonesAgregar) {
      const cantidad = pedido.cantidadDe(id);
      const contador = boton.querySelector<HTMLElement>('.item__contador');
      boton.classList.toggle('en-pedido', cantidad > 0);
      if (contador) contador.textContent = cantidad > 0 ? String(cantidad) : '';
    }

    if (vacio && panel.open) panel.close();
    guardar(pedido);
  };

  for (const [id, boton] of botonesAgregar) {
    boton.addEventListener('click', () => {
      const platillo = catalogo.get(id);
      if (!platillo) return;
      pedido.cambiar(id, 1);
      pintar();
      aviso.textContent = `Agregaste ${platillo.nombre}. Llevas ${textoPiezas(pedido.piezas)} por ${pesos.format(pedido.total)}.`;
      barra.classList.remove('pedido--latido');
      void barra.offsetWidth; // reinicia la animación
      barra.classList.add('pedido--latido');
      registrarEvento('agregar_pedido', { item_id: id, value: platillo.precio, currency: 'MXN' });
    });
  }

  lista.addEventListener('click', (e) => {
    const boton = (e.target as Element).closest<HTMLButtonElement>('button');
    if (!boton) return;
    if (boton.dataset.sumar) pedido.cambiar(boton.dataset.sumar, 1);
    else if (boton.dataset.quitar) pedido.cambiar(boton.dataset.quitar, -1);
    pintar();
  });

  abrir.addEventListener('click', () => panel.showModal());
  // Un clic en el fondo oscuro cierra el panel (el contenido va en un div interno).
  panel.addEventListener('click', (e) => { if (e.target === panel) panel.close(); });
  panel.querySelector('[data-pedido-cerrar]')?.addEventListener('click', () => panel.close());
  panel.querySelector('[data-pedido-vaciar]')?.addEventListener('click', () => {
    pedido.vaciar();
    pintar();
    abrir.focus();
  });

  pintar();
}
