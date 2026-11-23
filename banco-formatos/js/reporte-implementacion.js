"use strict";

/* ===========================================================================
   Reemplazar con los datos del cliente
   ---------------------------------------------------------------------------
   Fuente: el plan de la tanda (config/implementaciones/<cliente>/...yaml en
   Media Bridge) y la lectura de vuelta en la plataforma al corte.
   - Sin IDs reales ni nombres de personas si el repositorio es público.
   - Fechas en AAAA-MM-DD. Dinero en número entero (COP), sin puntos.
   - estado de pieza: "entrega" (activo y con impresiones), "activo" (activo
     sin entrega aún), "revision", "rechazado", "pausado".
   - estado de validación: "verificado", "parcial", "pendiente", "noaplica",
     "sindato".
   - prueba: null si la tanda no es una prueba A/B.
   ========================================================================= */
const DATOS = {
  corte: { fecha: "2027-04-12", hora: "5:00 p. m.", fuente: "Meta Ads, estado leído en el administrador de anuncios" },

  programas: [
    { id: "gp", nombre: "Especialización en Gerencia de Proyectos" },
    { id: "ad", nombre: "Maestría en Analítica de Datos" },
    { id: "dl", nombre: "Especialización en Derecho Laboral" }
  ],

  // Un destino = un conjunto de anuncios. presupuesto = total configurado para el periodo.
  destinos: [
    { id: "gp-bog", programa: "gp", sede: "Bogotá", campana: "Posgrados 2027-1 · Clientes potenciales", conjunto: "Gerencia de Proyectos · Bogotá", captacion: "Formulario instantáneo · Gerencia de Proyectos 2027-1", detalleCaptacion: "Campos ocultos: programa y sede", presupuesto: 1200000, inicio: "2027-04-12", fin: "2027-05-15" },
    { id: "ad-bog", programa: "ad", sede: "Bogotá", campana: "Posgrados 2027-1 · Clientes potenciales", conjunto: "Analítica de Datos · Bogotá", captacion: "Formulario instantáneo · Analítica de Datos 2027-1", detalleCaptacion: "Campos ocultos: programa y sede", presupuesto: 900000, inicio: "2027-04-12", fin: "2027-05-15" },
    { id: "ad-vir", programa: "ad", sede: "Virtual", campana: "Posgrados 2027-1 · Conversiones web", conjunto: "Analítica de Datos · Virtual", captacion: "Evento Lead del píxel · página del programa", detalleCaptacion: "Evento estándar, no conversión personalizada", presupuesto: 1100000, inicio: "2027-04-12", fin: "2027-05-31" },
    { id: "dl-med", programa: "dl", sede: "Medellín", campana: "Posgrados 2027-1 · Clientes potenciales", conjunto: "Derecho Laboral · Medellín", captacion: "Formulario instantáneo · Derecho Laboral 2027-1", detalleCaptacion: "Campos ocultos: programa y sede", presupuesto: 800000, inicio: "2027-04-12", fin: "2027-05-15" }
  ],

  // Una pieza = un concepto creativo único. formatos: proporciones de cada variante.
  // destinos: ids de conjunto; estados: estado por destino, en el mismo orden.
  piezas: [
    { id: "gp-equipo", programa: "gp", nombre: "Equipo en obra", tipo: "Imagen", formatos: ["4:5", "9:16"], etiqueta: "Publicación + historia",
      titulo: "Lidera proyectos con método", texto: "Aprende a planear, medir y entregar proyectos a tiempo. Clases los sábados en Bogotá y acompañamiento de docentes que trabajan en el sector.",
      cta: "Más información", url: "ejemplo.edu.co/posgrados/gerencia-proyectos?utm_source=meta&utm_medium=paid_social&utm_campaign=posgrados_2027-1&utm_content=equipo",
      destinos: ["gp-bog"], estados: ["entrega"] },
    { id: "gp-testimonio", programa: "gp", nombre: "Testimonio de egresada", tipo: "Video", duracion: "15 s", formatos: ["9:16"], etiqueta: "Video vertical",
      titulo: "Lo que cambió en mi trabajo", texto: "Una egresada cuenta cómo aplicó lo aprendido en su primer proyecto como directora. Conoce el plan de estudios.",
      cta: "Más información", url: "ejemplo.edu.co/posgrados/gerencia-proyectos?utm_source=meta&utm_medium=paid_social&utm_campaign=posgrados_2027-1&utm_content=testimonio",
      destinos: ["gp-bog"], estados: ["revision"] },
    { id: "ad-datos", programa: "ad", nombre: "Tablero de datos", tipo: "Imagen", formatos: ["4:5", "9:16"], etiqueta: "Publicación + historia",
      titulo: "Decide con datos", texto: "Formación en analítica aplicada a negocio, con proyectos reales desde el primer semestre. Presencial en Bogotá o virtual.",
      cta: "Solicitar información", url: "ejemplo.edu.co/posgrados/analitica-datos?utm_source=meta&utm_medium=paid_social&utm_campaign=posgrados_2027-1&utm_content=tablero",
      destinos: ["ad-bog", "ad-vir"], estados: ["entrega", "entrega"] },
    { id: "ad-horario", programa: "ad", nombre: "Horario flexible", tipo: "Imagen", formatos: ["1:1"], etiqueta: "Pieza única cuadrada",
      titulo: "Estudia a tu ritmo", texto: "Clases virtuales en vivo entre semana y grabadas para repasar. Inscripciones abiertas para 2027-1.",
      cta: "Registrarte", url: "ejemplo.edu.co/posgrados/analitica-datos?utm_source=meta&utm_medium=paid_social&utm_campaign=posgrados_2027-1&utm_content=horario",
      destinos: ["ad-vir"], estados: ["activo"], notaEstado: "Activo desde las 3:40 p. m.; aún sin impresiones al corte." },
    { id: "dl-reforma", programa: "dl", nombre: "Reforma laboral", tipo: "Imagen", formatos: ["4:5", "9:16"], etiqueta: "Publicación + historia",
      titulo: "Actualízate en derecho laboral", texto: "Analiza los cambios recientes de la norma laboral con casos de empresa. Clases presenciales en Medellín.",
      cta: "Más información", url: "ejemplo.edu.co/posgrados/derecho-laboral?utm_source=meta&utm_medium=paid_social&utm_campaign=posgrados_2027-1&utm_content=reforma",
      destinos: ["dl-med"], estados: ["rechazado"], notaEstado: "Rechazado por la política de empleo: el texto enviado prometía ascenso laboral. El texto de arriba es la corrección, en revisión." },
    { id: "general", programa: null, nombre: "Pieza general de posgrados", tipo: "Imagen", formatos: ["9:16"], etiqueta: "Historia",
      titulo: "Tu posgrado empieza en abril", texto: "Tres programas, tres formas de crecer en tu carrera. Elige el tuyo y recibe la información de inscripción.",
      cta: "Más información", url: "ejemplo.edu.co/posgrados?utm_source=meta&utm_medium=paid_social&utm_campaign=posgrados_2027-1&utm_content=general",
      destinos: ["gp-bog", "ad-bog", "dl-med"], estados: ["entrega", "entrega", "revision"] }
  ],

  // tratamiento: "pausado", "mantiene", "rotado".
  anteriores: [
    { nombre: "Gerencia de Proyectos · Imagen de marzo", destino: "gp-bog", tratamiento: "pausado", motivo: "La reemplaza la pieza «Equipo en obra».", fecha: "2027-04-12" },
    { nombre: "Analítica de Datos · Video de febrero", destino: "ad-bog", tratamiento: "mantiene", motivo: "Sigue con el menor costo por lead del conjunto en marzo.", fecha: "2027-04-12" },
    { nombre: "Derecho Laboral · Imagen de marzo", destino: "dl-med", tratamiento: "mantiene", motivo: "Se deja activo hasta que se apruebe la pieza nueva, para no dejar el conjunto sin anuncios.", fecha: "2027-04-12" },
    { nombre: "Posgrados · Pieza general de enero", destino: "gp-bog", tratamiento: "pausado", motivo: "La reemplaza la pieza general de abril en los tres conjuntos.", fecha: "2027-04-12" }
  ],

  // Compuertas del punto 25. estado: "cerrada", "parcial", "abierta".
  compuertas: [
    { nombre: "Requerimiento", estado: "cerrada", nota: "Formulario por programa; Lead en virtual" },
    { nombre: "Implementación", estado: "cerrada", nota: "Formularios, píxel y UTM" },
    { nombre: "Validación", estado: "parcial", nota: "Falta el envío real de Derecho Laboral" },
    { nombre: "QA", estado: "cerrada", nota: "URL, landing y nomenclatura" },
    { nombre: "Aprobación", estado: "cerrada", nota: "Aprobó la coordinación de Paid Media" },
    { nombre: "Activación", estado: "parcial", nota: "Tres de cuatro conjuntos" }
  ],

  validaciones: [
    { nombre: "Formulario por programa", estado: "verificado", evidencia: "Cada conjunto usa el formulario de su programa; los campos ocultos coinciden con programa y sede.", responsable: "Paid Media", fecha: "2027-04-12" },
    { nombre: "Envío real hasta el CRM", estado: "parcial", evidencia: "Los envíos de prueba de Gerencia de Proyectos y Analítica de Datos llegaron a la etapa de captación. Falta Derecho Laboral.", responsable: "Martech", fecha: "2027-04-12" },
    { nombre: "Píxel y evento Lead", estado: "verificado", evidencia: "Prueba real en la página del programa virtual: el evento Lead se registra una vez por envío.", responsable: "Martech", fecha: "2027-04-12" },
    { nombre: "API de conversiones", estado: "sindato", evidencia: "La cuenta no la tiene configurada; no hay deduplicación que revisar.", responsable: "Martech", fecha: "2027-04-12" },
    { nombre: "URL de destino y UTM", estado: "verificado", evidencia: "Todas las URL abren y llevan fuente, medio, campaña y contenido según la convención.", responsable: "Paid Media", fecha: "2027-04-12" },
    { nombre: "Nomenclatura", estado: "verificado", evidencia: "Nombre de anuncio con programa, pieza y fecha; sin duplicados activos por reintento.", responsable: "Paid Media", fecha: "2027-04-12" },
    { nombre: "Validación de datos en el tablero", estado: "noaplica", evidencia: "Esta línea no tiene tablero propio; se lee en el informe mensual.", responsable: "Data", fecha: "2027-04-12" }
  ],

  pendientes: [
    { fecha: "2027-04-14", que: "Corrección del anuncio de Derecho Laboral", criterio: "Aprobado y con impresiones en el conjunto de Medellín.", responsable: "Paid Media" },
    { fecha: "2027-04-14", que: "Video testimonio y pieza general en Medellín salen de revisión", criterio: "Estado activo con entrega.", responsable: "Paid Media" },
    { fecha: "2027-04-15", que: "Envío real de Derecho Laboral", criterio: "El registro de prueba aparece en el CRM con programa y sede.", responsable: "Martech" },
    { fecha: "2027-04-19", que: "Primera lectura de las piezas nuevas", criterio: "Siete días de entrega por conjunto; se compara contra los anuncios que se mantienen.", responsable: "Paid Media" }
  ],

  prueba: {
    reglas: [
      "Un conjunto nuevo dentro de la misma campaña, con el mismo público, la misma optimización y el mismo formulario que el conjunto vigente.",
      "Cambia solo la pieza: el testimonio en video frente a la imagen vigente.",
      "Gasto equitativo: cada conjunto recibe entre 45 % y 50 % del presupuesto diario de la campaña.",
      "Se compara el costo por lead del formulario con al menos 40 leads por grupo o entre 7 y 10 días de entrega."
    ],
    grupos: [
      { programa: "gp", control: "Imagen «Equipo en obra»", prueba: "Video «Testimonio de egresada»", reparto: "45 % a 50 % cada uno", lectura: "2027-04-22" }
    ]
  }
};

/* ===========================================================================
   Lógica: no hace falta tocarla para una tanda nueva.
   ========================================================================= */
(function () {
  const entero = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0, useGrouping: "always" });
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const mesesLargos = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  const ESTADOS = {
    entrega: { texto: "Activo con entrega", orden: 0, estado: "ok" },
    activo: { texto: "Activo, sin entrega aún", orden: 1, estado: "parcial" },
    revision: { texto: "En revisión", orden: 2, estado: "pendiente" },
    rechazado: { texto: "Rechazado", orden: 3, estado: "alerta" },
    pausado: { texto: "Pausado", orden: 4, estado: "na" }
  };
  const VALIDACION = {
    verificado: "Verificado", parcial: "Parcial", pendiente: "Pendiente", noaplica: "No aplica", sindato: "Sin dato"
  };
  // Estado de validación → variante de .ad-estado (la lima es solo para lo cumplido).
  const VALIDACION_ESTADO = { verificado: "ok", parcial: "parcial", pendiente: "pendiente", noaplica: "na", sindato: "sin" };
  const TRATAMIENTO = { pausado: "Pausado", mantiene: "Se mantiene activo", rotado: "Rotado" };
  const COMPUERTA = { cerrada: "Cerrada", parcial: "Parcial", abierta: "Abierta" };

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pesos = (n) => (typeof n === "number" ? "$" + entero.format(n) : "Sin dato");
  const fecha = (iso) => { if (!iso) return "Sin dato"; const [a, m, d] = iso.split("-").map(Number); return d + " " + meses[m - 1] + " " + a; };
  const fechaLarga = (iso) => { const [a, m, d] = iso.split("-").map(Number); return d + " de " + mesesLargos[m - 1] + " de " + a; };
  const programa = (id) => (DATOS.programas.find((p) => p.id === id) || { nombre: "Varios programas" }).nombre;
  const destino = (id) => DATOS.destinos.find((d) => d.id === id);
  const plural = (n, uno, varios) => entero.format(n) + " " + (n === 1 ? uno : varios);
  const etiquetaEstado = (clave) => { const e = ESTADOS[clave] || { texto: "Sin dato", estado: "sin" }; return `<span class="ad-estado ad-estado--${e.estado}">${esc(e.texto)}</span>`; };

  // Anuncios configurados = pieza × destino.
  const anuncios = [];
  DATOS.piezas.forEach((p) => p.destinos.forEach((d, i) => anuncios.push({ pieza: p, destino: destino(d), estado: p.estados[i] || "sindato" })));

  // ---------- Corte y fuente
  $("ri-corte").textContent = fechaLarga(DATOS.corte.fecha) + " · " + DATOS.corte.hora;
  $("ri-fuente").textContent = "Corte: " + fechaLarga(DATOS.corte.fecha) + ", " + DATOS.corte.hora + " · Fuente: " + DATOS.corte.fuente + " · Presupuesto configurado, no inversión observada.";

  // ---------- Franja de resumen
  const conEntrega = anuncios.filter((a) => a.estado === "entrega").length;
  const totalPresupuesto = DATOS.destinos.reduce((s, d) => s + (d.presupuesto || 0), 0);
  const sedes = new Set(DATOS.destinos.map((d) => d.sede)).size;
  // «Con entrega al corte» es la cifra clave del bloque: lleva la lima.
  const kpis = [
    ["Programas", entero.format(DATOS.programas.length), plural(sedes, "sede", "sedes o modalidades"), false],
    ["Piezas únicas", entero.format(DATOS.piezas.length), "una vista por pieza", false],
    ["Anuncios configurados", entero.format(anuncios.length), plural(DATOS.destinos.length, "conjunto", "conjuntos"), false],
    ["Con entrega al corte", entero.format(conEntrega), "de " + plural(anuncios.length, "anuncio", "anuncios"), true],
    ["Presupuesto configurado", pesos(totalPresupuesto), "COP · total del periodo", false]
  ];
  $("ri-kpi").innerHTML = kpis.map(([l, n, m, on]) => `<div class="ad-kpi${on ? " ad-kpi--on" : ""}"><span class="ad-kpi__l">${esc(l)}</span><span class="ad-kpi__n">${esc(n)}</span><span class="ad-kpi__m">${esc(m)}</span></div>`).join("");

  // ---------- Estado al corte (barra apilada, base cero, con etiquetas)
  const conteo = {};
  anuncios.forEach((a) => { conteo[a.estado] = (conteo[a.estado] || 0) + 1; });
  const claves = Object.keys(conteo).sort((a, b) => (ESTADOS[a] ? ESTADOS[a].orden : 9) - (ESTADOS[b] ? ESTADOS[b].orden : 9));
  const total = anuncios.length || 1;
  $("ri-estado").innerHTML =
    `<div class="ri-barra" role="img" aria-label="${esc(claves.map((k) => (ESTADOS[k] || { texto: k }).texto + ": " + conteo[k]).join(", "))}">` +
    claves.map((k) => `<span class="ri-barra__seg ri-barra__seg--${esc(k)}" style="flex-grow:${conteo[k]}"></span>`).join("") +
    `</div><ul class="ad-leyenda ri-leyenda">` +
    claves.map((k) => `<li><i class="ri-barra__seg--${esc(k)}" aria-hidden="true"></i>${esc((ESTADOS[k] || { texto: k }).texto)} <strong>${entero.format(conteo[k])}</strong> <span class="ri-pct">${entero.format(Math.round((conteo[k] / total) * 100))} %</span></li>`).join("") +
    `</ul>`;
  const enRevision = conteo.revision || 0;
  const rechazados = conteo.rechazado || 0;
  $("ri-estado-lectura").textContent =
    `${entero.format(conEntrega)} de ${entero.format(anuncios.length)} anuncios ya entregan. ` +
    (enRevision ? `${plural(enRevision, "sigue", "siguen")} en revisión de la plataforma. ` : "") +
    (rechazados ? `${plural(rechazados, "fue rechazado", "fueron rechazados")} y ${rechazados === 1 ? "está" : "están"} en corrección; el conjunto conserva su anuncio anterior mientras tanto.` : "");

  // ---------- Destinos
  $("ri-destinos").innerHTML = DATOS.destinos.map((d) => {
    const propios = anuncios.filter((a) => a.destino && a.destino.id === d.id);
    const estados = {};
    propios.forEach((a) => { estados[a.estado] = (estados[a.estado] || 0) + 1; });
    const resumen = Object.keys(estados).map((k) => `${etiquetaEstado(k)} <span class="ri-num">${entero.format(estados[k])}</span>`).join("<br>");
    return `<tr>
      <th scope="row">${esc(programa(d.programa))}<span class="ri-sub">${esc(d.sede)}</span></th>
      <td>${esc(d.campana)}<span class="ri-sub">${esc(d.conjunto)}</span></td>
      <td>${esc(d.captacion)}<span class="ri-sub">${esc(d.detalleCaptacion || "")}</span></td>
      <td>${propios.map((a) => esc(a.pieza.nombre)).join("<br>") || "Sin piezas nuevas"}</td>
      <td class="valor">${pesos(d.presupuesto)}</td>
      <td class="ri-nowrap">${fecha(d.inicio)}<span class="ri-sub">al ${fecha(d.fin)}</span></td>
      <td class="ri-nowrap">${resumen || "Sin dato"}</td>
    </tr>`;
  }).join("");
  $("ri-destinos-total").innerHTML = `<tr><th scope="row">Total</th><td>${plural(DATOS.destinos.length, "conjunto", "conjuntos")}</td><td></td><td>${plural(anuncios.length, "anuncio", "anuncios")}</td><td class="valor">${pesos(totalPresupuesto)}</td><td></td><td></td></tr>`;

  // ---------- Galería
  const marcador = (p, ratio) => {
    const [w, h] = ratio.split(":");
    const ubicacion = ratio === "9:16" ? "historia o reel" : ratio === "1:1" ? "cuadrado" : "publicación";
    const video = p.tipo === "Video";
    const icono = video
      ? `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="11" class="ri-svg-linea"/><path d="M10 8l6 4-6 4z" class="ri-svg-relleno"/></svg>`
      : `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="1" class="ri-svg-linea"/><path d="M4 17l5-6 4 4 3-3 4 5" class="ri-svg-linea"/><circle cx="16" cy="9" r="1.6" class="ri-svg-relleno"/></svg>`;
    return `<div class="ad-marcador ad-marcador--${w}x${h}" role="img" aria-label="Marcador de pieza aprobada, ${esc(ratio)}, ${esc(ubicacion)}${video ? ", fotograma de video" : ""}">
      ${icono}<span>Pieza aprobada</span><span class="ri-ratio">${esc(ratio)} · ${esc(ubicacion)}</span></div>`;
  };

  const tarjeta = (p) => {
    const dest = p.destinos.map((id, i) => { const d = destino(id); return `<li>${esc(programa(d.programa))} · ${esc(d.sede)} ${etiquetaEstado(p.estados[i])}</li>`; }).join("");
    return `<article class="ad-card ri-pieza" data-programa="${esc(p.programa || "general")}" data-estados="${esc(p.estados.join(" "))}">
      <figure class="ad-figura">
        <div class="ri-marcos">${p.formatos.map((r) => marcador(p, r)).join("")}</div>
        <figcaption>${esc(p.tipo)}${p.duracion ? " · " + esc(p.duracion) : ""} · ${esc(p.etiqueta)}</figcaption>
      </figure>
      <h4 class="ad-card__t">${esc(p.nombre)}</h4>
      <p class="ri-pieza__titulo">${esc(p.titulo)}</p>
      <p class="ad-card__d">${esc(p.texto)}</p>
      <dl class="ri-pieza__datos">
        <div><dt>Botón</dt><dd><span class="ad-pill ri-cta">${esc(p.cta)}</span></dd></div>
        <div><dt>Destinos</dt><dd><ul class="ri-destinos-lista">${dest}</ul></dd></div>
        <div><dt>URL de destino</dt><dd class="ri-url">${esc(p.url)}</dd></div>
      </dl>
      ${p.notaEstado ? `<div class="ad-lectura"><span class="ad-lectura__k">Estado</span><p>${esc(p.notaEstado)}</p></div>` : ""}
    </article>`;
  };

  const grupos = DATOS.programas.map((g) => ({ id: g.id, nombre: g.nombre, piezas: DATOS.piezas.filter((p) => p.programa === g.id) }));
  const generales = DATOS.piezas.filter((p) => !p.programa);
  if (generales.length) grupos.push({ id: "general", nombre: "Piezas generales", piezas: generales, nota: "Se muestran en varios programas; cada conjunto es un anuncio." });
  $("ri-galeria").innerHTML = grupos.filter((g) => g.piezas.length).map((g) => `
    <section class="ri-grupo" data-grupo="${esc(g.id)}" aria-labelledby="g-${esc(g.id)}">
      <h3 id="g-${esc(g.id)}">${esc(g.nombre)}</h3>
      <p class="formato-nota">${plural(g.piezas.length, "pieza", "piezas")}${g.nota ? " · " + esc(g.nota) : ""}</p>
      <div class="ad-grid ri-galeria">${g.piezas.map(tarjeta).join("")}</div>
    </section>`).join("");

  // ---------- Filtros (programa y estado)
  const filtro = { programa: "todos", estado: "todos" };
  const chips = (cont, clave, opciones) => {
    cont.innerHTML = opciones.map(([v, t]) => `<button type="button" class="ad-chip" data-${clave}="${esc(v)}" aria-pressed="${v === "todos"}">${esc(t)}</button>`).join("");
    cont.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      filtro[clave] = b.dataset[clave];
      cont.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      aplicar();
    });
  };
  const estadosPresentes = Object.keys(ESTADOS).filter((k) => conteo[k]);
  chips($("ri-chips-programa"), "programa", [["todos", "Todos"]].concat(grupos.filter((g) => g.piezas.length).map((g) => [g.id, g.id === "general" ? "Generales" : g.nombre])));
  chips($("ri-chips-estado"), "estado", [["todos", "Todos"]].concat(estadosPresentes.map((k) => [k, ESTADOS[k].texto])));
  $("ri-filtros").hidden = false;

  function aplicar() {
    let visibles = 0;
    document.querySelectorAll(".ri-pieza").forEach((el) => {
      const ok = (filtro.programa === "todos" || el.dataset.programa === filtro.programa) &&
        (filtro.estado === "todos" || el.dataset.estados.split(" ").includes(filtro.estado));
      el.hidden = !ok; if (ok) visibles++;
    });
    document.querySelectorAll(".ri-grupo").forEach((g) => { g.hidden = !g.querySelector(".ri-pieza:not([hidden])"); });
    $("ri-piezas-resumen").textContent = visibles
      ? `Se muestran ${plural(visibles, "pieza", "piezas")} de ${entero.format(DATOS.piezas.length)}.`
      : "Ninguna pieza cumple los dos filtros. Cambia el programa o el estado.";
  }
  aplicar();

  // ---------- Prueba (opcional)
  if (DATOS.prueba) {
    $("ri-prueba-seccion").hidden = false;
    $("ri-prueba-reglas").innerHTML = DATOS.prueba.reglas.map((r) => `<li>${esc(r)}</li>`).join("");
    $("ri-prueba").innerHTML = DATOS.prueba.grupos.map((g) => `<tr><th scope="row">${esc(programa(g.programa))}</th><td>${esc(g.control)}</td><td>${esc(g.prueba)}</td><td>${esc(g.reparto)}</td><td class="ri-nowrap">${fecha(g.lectura)}</td></tr>`).join("");
  }

  // ---------- Anteriores
  $("ri-anteriores").innerHTML = DATOS.anteriores.length
    ? DATOS.anteriores.map((a) => { const d = destino(a.destino); return `<tr><th scope="row">${esc(a.nombre)}</th><td>${esc(programa(d.programa))} · ${esc(d.sede)}</td><td><span class="ad-tag ad-tag--line">${esc(TRATAMIENTO[a.tratamiento] || a.tratamiento)}</span></td><td>${esc(a.motivo)}</td><td class="ri-nowrap">${fecha(a.fecha)}</td></tr>`; }).join("")
    : `<tr><td colspan="5">No aplica: los conjuntos no tenían anuncios anteriores.</td></tr>`;

  // ---------- Compuertas y validaciones
  // La lima marca la compuerta actual: la primera que aún no está cerrada (o la última si todas lo están).
  const primeraAbierta = DATOS.compuertas.findIndex((c) => c.estado !== "cerrada");
  const actual = primeraAbierta === -1 ? DATOS.compuertas.length - 1 : primeraAbierta;
  $("ri-compuertas").innerHTML = DATOS.compuertas.map((c, i) => `<li class="ad-paso ri-compuerta ri-compuerta--${esc(c.estado)}${i === actual ? " is-on" : ""}">
    <span class="ad-n ad-n--md" aria-hidden="true">${i + 1}</span>
    <h3>${esc(c.nombre)}</h3>
    <p class="ri-compuerta__estado">${esc(COMPUERTA[c.estado] || c.estado)}</p>
    <p class="ri-compuerta__nota">${esc(c.nota)}</p></li>`).join("");
  $("ri-validaciones").innerHTML = DATOS.validaciones.map((v) => `<tr><th scope="row">${esc(v.nombre)}</th><td><span class="ad-estado ad-estado--${VALIDACION_ESTADO[v.estado] || "sin"}">${esc(VALIDACION[v.estado] || "Sin dato")}</span></td><td>${esc(v.evidencia)}</td><td>${esc(v.responsable)}</td><td class="ri-nowrap">${fecha(v.fecha)}</td></tr>`).join("");

  // ---------- Pendientes
  $("ri-pendientes").innerHTML = DATOS.pendientes.length
    ? DATOS.pendientes.map((p, i) => `<tr${i === 0 ? ' class="is-on"' : ""}><td class="ri-nowrap">${fecha(p.fecha)}</td><th scope="row">${esc(p.que)}</th><td>${esc(p.criterio)}</td><td>${esc(p.responsable)}</td></tr>`).join("")
    : `<tr><td colspan="4">Sin pendientes al corte.</td></tr>`;

  // ---------- Anexo técnico (nombres internos; identificador nunca real en repositorio público)
  $("ri-anexo").innerHTML = anuncios.map((a) => {
    const [, m, d] = DATOS.corte.fecha.split("-");
    const nombre = `${a.destino.conjunto.split(" · ")[0]} · ${a.pieza.nombre} · ${d}/${m}`;
    return `<tr><th scope="row">${esc(nombre)}</th><td>${esc(a.destino.conjunto)}</td><td>${esc(a.pieza.nombre)}</td><td>Verificado en plataforma</td></tr>`;
  }).join("");
})();

// Al imprimir: el anexo abierto y la galería completa.
window.addEventListener("beforeprint", () => {
  const anexo = document.querySelector(".ri-anexo");
  if (anexo) anexo.open = true;
});
