/* Talleres · interacciones compartidas. Sin dependencias; funciona con doble clic (file://).
   Sin JS, la página se lee completa: todos los paneles visibles y los controles ocultos. */
document.documentElement.classList.add('js');

/* 1. Selector de paneles: [data-picker] con botones [data-show] y paneles [data-panel]. */
for (const picker of document.querySelectorAll('[data-picker]')) {
  const botones = picker.querySelectorAll('[data-show]');
  const paneles = picker.querySelectorAll('[data-panel]');
  const mostrar = (id) => {
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.show === id)));
    paneles.forEach((p) => { p.hidden = p.dataset.panel !== id; });
  };
  picker.querySelector('.ta-chips').hidden = false;
  botones.forEach((b) => b.addEventListener('click', () => mostrar(b.dataset.show)));
  mostrar(botones[0].dataset.show);
}

/* 2. Atribución: reparte el crédito de una compra entre los contactos según el modelo. */
const atribucion = document.querySelector('[data-atribucion]');
if (atribucion) {
  const filas = [...atribucion.querySelectorAll('[data-contacto]')];
  const lectura = atribucion.querySelector('[data-lectura]');
  const n = filas.length;
  const modelos = {
    ultimo: { pesos: filas.map((_, i) => (i === n - 1 ? 1 : 0)), texto: 'Todo el crédito va al último contacto. Los canales que abrieron la conversación parecen no servir.' },
    primero: { pesos: filas.map((_, i) => (i === 0 ? 1 : 0)), texto: 'Todo el crédito va a quien abrió la conversación. El canal que cerró la compra parece no servir.' },
    lineal: { pesos: filas.map(() => 1 / n), texto: 'Cada contacto recibe lo mismo. Es parejo, pero no distingue el contacto que decidió.' },
    posicion: { pesos: filas.map((_, i) => (i === 0 || i === n - 1 ? 0.4 : 0.2 / (n - 2))), texto: 'El primero y el último reciben 40 % cada uno; el resto se reparte el 20 %. Reconoce a quien abrió y a quien cerró.' },
  };
  const pct = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });
  const aplicar = (id) => {
    const m = modelos[id];
    atribucion.querySelectorAll('[data-modelo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modelo === id)));
    filas.forEach((fila, i) => {
      const v = Math.round(m.pesos[i] * 100);
      const barra = fila.querySelector('.ad-barra');
      barra.style.setProperty('--v', v + '%');
      barra.setAttribute('aria-label', v + ' % del crédito');
      fila.querySelector('output').textContent = pct.format(v) + ' %';
    });
    lectura.textContent = m.texto;
  };
  atribucion.querySelector('.ta-chips').hidden = false;
  atribucion.querySelectorAll('[data-modelo]').forEach((b) => b.addEventListener('click', () => aplicar(b.dataset.modelo)));
  aplicar('ultimo');
}

/* 3. Área segura: mueve un llamado a la acción sobre una pieza 9:16 y avisa si lo tapa la interfaz.
   Zonas en % del alto y del ancho, según la guía de contenido para anuncios. */
const segura = document.querySelector('[data-segura]');
if (segura) {
  const zonas = {
    reels: { t: 14, b: 35, l: 6, iw: 21, ih: 5, nombre: 'Reels' },
    stories: { t: 14, b: 20, l: 6, iw: 0, ih: 0, nombre: 'Stories' },
  };
  const tel = segura.querySelector('.ta-tel');
  const cta = segura.querySelector('.ta-cta');
  const texto = segura.querySelector('#ta-cta-texto');
  const altura = segura.querySelector('#ta-cta-altura');
  const estado = segura.querySelector('[data-estado]');
  let actual = 'reels';
  const revisar = () => {
    const z = zonas[actual];
    for (const k of ['t', 'b', 'l', 'iw', 'ih']) tel.style.setProperty('--' + k, z[k] + '%');
    tel.querySelector('.ta-zona--iconos').hidden = z.iw === 0;
    cta.textContent = texto.value.trim() || 'Ver la oferta';
    const top = Number(altura.value);
    cta.style.top = top + '%';
    const alto = tel.clientHeight ? (cta.offsetHeight / tel.clientHeight) * 100 : 5;
    const tapado = top < z.t || top + alto > 100 - z.b;
    const msg = tapado
      ? `En ${z.nombre}, el llamado a la acción queda bajo la interfaz: muévelo a la zona libre.`
      : `En ${z.nombre}, el llamado a la acción queda en la zona libre y se lee completo.`;
    estado.textContent = msg;
    estado.className = 'ad-estado ' + (tapado ? 'ad-estado--alerta' : 'ad-estado--ok');
    altura.setAttribute('aria-valuetext', top + ' % desde arriba. ' + msg);
  };
  segura.querySelectorAll('[data-ubicacion]').forEach((b) => b.addEventListener('click', () => {
    actual = b.dataset.ubicacion;
    segura.querySelectorAll('[data-ubicacion]').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    revisar();
  }));
  segura.querySelectorAll('[data-js]').forEach((el) => { el.hidden = false; });
  texto.addEventListener('input', revisar);
  altura.addEventListener('input', revisar);
  window.addEventListener('resize', revisar);
  revisar();
}

/* 4. Matriz de mensajes: una opción por columna arma la receta (C1 + B3 + I4). */
const matriz = document.querySelector('[data-matriz]');
if (matriz) {
  const receta = matriz.querySelector('[data-receta]');
  const frase = matriz.querySelector('[data-frase]');
  const armar = () => {
    const elegidos = [...matriz.querySelectorAll('.ad-chip[aria-pressed="true"]')];
    receta.textContent = elegidos.length ? elegidos.map((b) => b.dataset.codigo).join(' + ') : 'Elige una pieza por columna';
    frase.textContent = elegidos.length ? elegidos.map((b) => b.dataset.texto).join(' ') : 'El mensaje aparece aquí a medida que eliges.';
  };
  matriz.querySelectorAll('fieldset').forEach((col) => {
    col.querySelectorAll('.ad-chip').forEach((b) => b.addEventListener('click', () => {
      const ya = b.getAttribute('aria-pressed') === 'true';
      col.querySelectorAll('.ad-chip').forEach((o) => o.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', String(!ya));
      armar();
    }));
  });
  armar();
}
