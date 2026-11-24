"use strict";

/* ==========================================================================
   Cuadro de materiales · datos y lógica
   --------------------------------------------------------------------------
   REEMPLAZAR CON LOS DATOS DEL CLIENTE: todo lo que está entre este bloque y
   «FIN DE LOS DATOS». La lógica de abajo no se toca.

   Origen real de cada bloque (framework, operacion-tactica.html):
   - CAMPANA y BRIEF: nivel estratégico del punto 24 y mínimos de 94.3.
   - PRODUCCION: nivel productivo del punto 24. Sale de la hoja «Producción»
     de cuadro-materiales.xlsx: una adaptación por fila allá, agrupada por
     mensaje aquí.
   - COPYS: hoja «Copys» (una fila por programa, columnas por medio).
   - CATALOGO: hoja «Formatos». Medidas tomadas de
     ../playbook-creativo/assets/specs.js; confirma siempre el spec del
     placement contratado.

   Datos ficticios. No pegues nombres de personas, IDs de cuenta ni enlaces
   privados: en «enlace» va la ruta pública o compartida de la pieza final,
   o null si todavía no existe.
   ========================================================================== */

const CAMPANA = {
  cliente: "Universidad Andina",
  campana: "Inscripciones 2027-2",
  periodo: "Abr–jun 2027",
  corte: "2027-04-09",               // AAAA-MM-DD · define qué entrega está vencida
  version: "V02",
  responsable: "Planner de la cuenta", // rol, no nombre de persona
  aprueba: "Mercadeo del cliente",
  fuente: "Hoja de cálculo de la campaña · pestañas Brief, Producción y Copys"
};

/* Nivel estratégico (punto 24): una entrada por necesidad de comunicación,
   no por pieza. «codigo» conecta con PRODUCCION y con la hoja Producción. */
const BRIEF = [
  {
    codigo: "BR-01", programa: "Arquitectura", angulo: "Aprender haciendo", rol: "Core",
    objetivo: "Captar interesados", audiencia: "Aspirantes de 16 a 19 años que exploran carreras creativas",
    barrera: "No saben cómo es un semestre de Arquitectura", hipotesis: "Mostrar un proyecto real de taller aumenta las solicitudes frente a la pieza institucional",
    mensaje: "Diseña tu primer proyecto desde el primer semestre", oferta: "Taller abierto de introducción", accion: "Reservar un cupo en el taller",
    aprendizaje: "En 2027-1 las piezas con maquetas reales tuvieron mejor costo por lead que las de campus", legales: "Fecha y cupos del taller", modo: "Por muestra"
  },
  {
    codigo: "BR-02", programa: "Arquitectura", angulo: "Respaldo y acreditación", rol: "Soporte",
    objetivo: "Reducir fricción en remarketing", audiencia: "Personas que abrieron el formulario y no lo enviaron",
    barrera: "Dudan de la calidad del programa", hipotesis: "La acreditación y los egresados resuelven la duda de seriedad",
    mensaje: "Un programa acreditado con egresados en estudios de todo el país", oferta: "Sin oferta", accion: "Completar la inscripción",
    aprendizaje: "Sin dato: primera vez que se prueba este ángulo", legales: "Resolución de acreditación vigente", modo: "Por pieza"
  },
  {
    codigo: "BR-03", programa: "Ingeniería de Sistemas", angulo: "Salida laboral", rol: "Core",
    objetivo: "Captar interesados", audiencia: "Bachilleres y técnicos interesados en tecnología",
    barrera: "Creen que necesitan saber programar antes de entrar", hipotesis: "Mostrar el primer reto práctico baja la barrera de entrada",
    mensaje: "Empiezas sin saber programar y sales con un portafolio", oferta: "Beca del 15 % para inscritos antes del 30 de mayo", accion: "Enviar el formulario",
    aprendizaje: "El video corto superó al estático en 2027-1", legales: "Condiciones de la beca", modo: "Por pieza"
  },
  {
    codigo: "BR-04", programa: "Maestría en Analítica de Datos", angulo: "Ascenso profesional", rol: "Core",
    objetivo: "Generar leads calificados", audiencia: "Profesionales de 28 a 45 años en cargos de análisis o coordinación",
    barrera: "No tienen tiempo para una maestría presencial", hipotesis: "El formato virtual con clases en vivo los convence más que el prestigio",
    mensaje: "Lidera decisiones con datos sin dejar de trabajar", oferta: "Sesión informativa con el director", accion: "Inscribirse a la sesión",
    aprendizaje: "En LinkedIn el mensaje directo duplicó la tasa de respuesta del anuncio de imagen", legales: "Registro calificado del programa", modo: "Por muestra"
  },
  {
    codigo: "BR-05", programa: "Institucional", angulo: "Cierre de inscripciones", rol: "Soporte",
    objetivo: "Activar la decisión", audiencia: "Toda la base de remarketing de la campaña",
    barrera: "Aplazan la inscripción", hipotesis: "La fecha de cierre visible acelera los envíos de la última semana",
    mensaje: "Inscripciones abiertas hasta el 30 de mayo", oferta: "Sin oferta", accion: "Inscribirse",
    aprendizaje: "Sin dato", legales: "Fecha de cierre oficial", modo: "Por muestra"
  }
];

/* Nivel productivo (punto 24): una fila por mensaje y plataforma, con sus
   adaptaciones dentro (regla del cuadro: un mensaje no se duplica por formato).
   - nn: orden del anuncio en el flow (75.1); arma la nomenclatura.
   - adaptaciones[].formato: clave de CATALOGO.
   - tipo: "estatico" | "video" | "carrusel" | "texto" | "audio".
   - estado: Solicitada | En producción | Por aprobar | Aprobada | Entregada | Cancelada.
   - duracion: segundos o null (No aplica). enlace: URL o null (Sin enlace). */
const PRODUCCION = [
  {
    codigo: "BR-01", nn: "01", plataforma: "Meta Ads", ubicacion: "Conversiones · feed, Stories y Reels",
    pedido: "Foto o video real de maqueta en taller, espacio limpio arriba para el titular. Sin fotos de banco.",
    cta: "Reserva tu cupo", trabajo: "Nueva", responsable: "Creatividad", solicitud: "2027-03-28", entrega: "2027-04-08", aprobacion: "2027-04-10",
    adaptaciones: [
      { formato: "meta-feed-45", tipo: "estatico", cantidad: 2, duracion: null, estado: "Por aprobar", enlace: null },
      { formato: "meta-stories", tipo: "estatico", cantidad: 2, duracion: null, estado: "En producción", enlace: null }
    ]
  },
  {
    codigo: "BR-01", nn: "02", plataforma: "TikTok", ubicacion: "In-feed · tráfico al formulario",
    pedido: "Estudiante mostrando su maqueta en primera persona. Gancho en los primeros 2 segundos.",
    cta: "Reserva tu cupo", trabajo: "Nueva", responsable: "Producción audiovisual", solicitud: "2027-03-28", entrega: "2027-04-14", aprobacion: null,
    adaptaciones: [
      { formato: "tik-infeed", tipo: "video", cantidad: 1, duracion: 15, estado: "Solicitada", enlace: null }
    ]
  },
  {
    codigo: "BR-02", nn: "03", plataforma: "Meta Ads", ubicacion: "Remarketing · carrusel en feed",
    pedido: "Cuatro tarjetas: acreditación, egresados, taller y llamado. La primera debe funcionar sola.",
    cta: "Completa tu inscripción", trabajo: "Adaptación", responsable: "Creatividad", solicitud: "2027-03-25", entrega: "2027-04-02", aprobacion: "2027-04-04",
    adaptaciones: [
      { formato: "meta-carrusel", tipo: "carrusel", cantidad: 4, duracion: null, estado: "Aprobada", enlace: "https://drive.example.com/andina/br-02-carrusel" }
    ]
  },
  {
    codigo: "BR-02", nn: "04", plataforma: "Google Ads", ubicacion: "Performance Max · grupo de recursos Arquitectura",
    pedido: "Un solo ángulo por grupo de recursos. No mezclar acreditación con taller.",
    cta: "Inscríbete", trabajo: "Adaptación", responsable: "Creatividad", solicitud: "2027-03-25", entrega: "2027-04-03", aprobacion: "2027-04-05",
    adaptaciones: [
      { formato: "goo-pmax-h", tipo: "estatico", cantidad: 1, duracion: null, estado: "Entregada", enlace: "https://drive.example.com/andina/br-02-pmax" },
      { formato: "goo-pmax-c", tipo: "estatico", cantidad: 1, duracion: null, estado: "Entregada", enlace: "https://drive.example.com/andina/br-02-pmax" },
      { formato: "goo-pmax-v", tipo: "estatico", cantidad: 1, duracion: null, estado: "Entregada", enlace: "https://drive.example.com/andina/br-02-pmax" }
    ]
  },
  {
    codigo: "BR-03", nn: "05", plataforma: "Meta Ads", ubicacion: "Conversiones · Reels",
    pedido: "Pantalla del primer reto resuelto, voz en off de estudiante. Subtítulos siempre.",
    cta: "Inscríbete", trabajo: "Nueva", responsable: "Producción audiovisual", solicitud: "2027-03-26", entrega: "2027-04-07", aprobacion: null,
    adaptaciones: [
      { formato: "meta-reels", tipo: "video", cantidad: 1, duracion: 20, estado: "Por aprobar", enlace: null }
    ]
  },
  {
    codigo: "BR-03", nn: "06", plataforma: "Google Ads", ubicacion: "Búsqueda · RSA y YouTube Shorts",
    pedido: "Los copys de búsqueda salen de la vista Copys. El Short reutiliza el video de Reels.",
    cta: "Inscríbete", trabajo: "Adaptación", responsable: "Paid Media", solicitud: "2027-03-26", entrega: "2027-04-12", aprobacion: null,
    adaptaciones: [
      { formato: "goo-search", tipo: "texto", cantidad: 1, duracion: null, estado: "Aprobada", enlace: null },
      { formato: "goo-shorts", tipo: "video", cantidad: 1, duracion: 15, estado: "En producción", enlace: null }
    ]
  },
  {
    codigo: "BR-04", nn: "07", plataforma: "LinkedIn", ubicacion: "Message Ads y anuncio de imagen",
    pedido: "Mensaje consultivo y uno a uno. La imagen muestra un tablero de datos, no personas posando.",
    cta: "Reserva tu lugar", trabajo: "Nueva", responsable: "Creatividad", solicitud: "2027-03-30", entrega: "2027-04-11", aprobacion: null,
    adaptaciones: [
      { formato: "lin-mensaje", tipo: "texto", cantidad: 1, duracion: null, estado: "Por aprobar", enlace: null },
      { formato: "lin-imagen", tipo: "estatico", cantidad: 2, duracion: null, estado: "En producción", enlace: null }
    ]
  },
  {
    codigo: "BR-05", nn: "08", plataforma: "Programática", ubicacion: "Display en sitios de noticias y educación",
    pedido: "Fecha de cierre como elemento principal. Logo y CTA legibles en 320 × 50.",
    cta: "Inscríbete", trabajo: "Adaptación", responsable: "Creatividad", solicitud: "2027-04-01", entrega: "2027-04-16", aprobacion: null,
    adaptaciones: [
      { formato: "pro-300x250", tipo: "estatico", cantidad: 1, duracion: null, estado: "Solicitada", enlace: null },
      { formato: "pro-728x90", tipo: "estatico", cantidad: 1, duracion: null, estado: "Solicitada", enlace: null },
      { formato: "pro-320x50", tipo: "estatico", cantidad: 1, duracion: null, estado: "Solicitada", enlace: null }
    ]
  },
  {
    codigo: "BR-05", nn: "09", plataforma: "Spotify", ubicacion: "Audio · listas de estudio",
    pedido: "Se canceló: el presupuesto pasó a programática.",
    cta: "Inscríbete", trabajo: "Nueva", responsable: "Producción audiovisual", solicitud: "2027-04-01", entrega: "2027-04-16", aprobacion: null,
    adaptaciones: [
      { formato: "spo-audio", tipo: "audio", cantidad: 1, duracion: 30, estado: "Cancelada", enlace: null }
    ]
  }
];

/* Copys (hoja «Copys»): una entrada por programa. Los medios que no aplican
   se omiten (null). Los límites están en LIMITES. */
const COPYS = [
  {
    programa: "Arquitectura", nivel: "Pregrado", modalidad: "Presencial", codigo: "BR-01",
    meta: {
      titular: "Tu primer proyecto empieza en primer semestre",
      apoyo: "Taller abierto de Arquitectura",
      copyOut: "En Arquitectura diseñas desde la primera semana: maquetas, planos y recorridos reales. Reserva tu cupo en el taller abierto y conoce cómo se estudia.",
      titulo: "Taller abierto de Arquitectura",
      cta: "Más información"
    },
    google: null,
    tiktok: "Así se ve tu primera maqueta en Arquitectura. Reserva tu cupo en el taller abierto",
    linkedin: null
  },
  {
    programa: "Ingeniería de Sistemas", nivel: "Pregrado", modalidad: "Presencial", codigo: "BR-03",
    meta: {
      titular: "Empiezas sin saber programar",
      apoyo: "Sales con un portafolio de proyectos",
      copyOut: "No necesitas saber programar para entrar a Ingeniería de Sistemas. Desde el primer semestre resuelves retos reales. Beca del 15 % hasta el 30 de mayo.",
      titulo: "Beca del 15 % hasta el 30 de mayo",
      cta: "Registrarte"
    },
    google: {
      h: [
        "Ingeniería de Sistemas", "Universidad Andina", "Beca del 15 % hasta mayo",
        "Empieza sin saber programar", "Retos reales desde el inicio", "Sal con un portafolio propio",
        "Inscripciones 2027-2 abiertas", "Aprende con proyectos reales y mentores"
      ],
      d: [
        "Resuelve retos de software desde el primer semestre. Inscríbete antes del 30 de mayo.",
        "Programa presencial con laboratorios abiertos y acompañamiento de mentores.",
        "Beca del 15 % para inscritos antes del 30 de mayo. Aplican condiciones."
      ]
    },
    tiktok: "No sabía programar y este fue mi primer reto en Ingeniería de Sistemas",
    linkedin: null
  },
  {
    programa: "Maestría en Analítica de Datos", nivel: "Posgrado", modalidad: "Virtual", codigo: "BR-04",
    meta: null,
    google: {
      h: [
        "Maestría en Analítica de Datos", "Virtual con clases en vivo", "Lidera decisiones con datos",
        "Sesión informativa gratuita", "Estudia sin dejar de trabajar"
      ],
      d: [
        "Maestría virtual con clases en vivo. Agenda tu sesión informativa con el director.",
        "Aplica analítica a tu trabajo desde el primer módulo. Registro calificado vigente."
      ]
    },
    tiktok: null,
    linkedin: {
      asunto: "Su próximo cargo se decide con datos",
      cuerpo: "Hola, {nombre}. La Maestría en Analítica de Datos de la Universidad Andina es virtual, con clases en vivo y casos de su sector. El próximo jueves el director del programa responde preguntas en una sesión de 30 minutos. ¿Le reservamos un lugar?",
      cta: "Reservar mi lugar"
    }
  }
];

/* Límites por bloque de copy. Fuente: especificaciones de cada plataforma y
   reglas internas que usamos en las revisiones de copys. */
const LIMITES = {
  metaPieza: { min: 60, max: 100, nota: "Titular más apoyo dentro de la imagen" },
  metaCopyOut: { max: 150, nota: "El feed corta cerca de 125; lo esencial va al inicio" },
  metaTitulo: { max: 40, nota: "Debajo de la pieza" },
  googleH: { max: 30, cantidad: 15, minimo: 3, nota: "Títulos de anuncio responsive" },
  googleD: { max: 90, cantidad: 4, minimo: 2, nota: "Descripciones" },
  tiktok: { max: 100, nota: "Sin emojis" },
  linAsunto: { max: 60, nota: "Asunto del Message Ad" },
  linCuerpo: { max: 500, nota: "Recomendado; la plataforma admite 1.500" },
  linCta: { max: 20, nota: "Texto del botón" }
};

/* Catálogo de formatos (hoja «Formatos»). ratio: proporción del marcador. */
const CATALOGO = {
  "meta-feed-45":  { plataforma: "Meta Ads", nombre: "Imagen de feed", ratio: "4:5", px: "1080 × 1350", nota: "Formato principal de feed en móvil" },
  "meta-feed-11":  { plataforma: "Meta Ads", nombre: "Imagen cuadrada", ratio: "1:1", px: "1080 × 1080", nota: "Feed y columna derecha" },
  "meta-stories":  { plataforma: "Meta Ads", nombre: "Historia", ratio: "9:16", px: "1080 × 1920", nota: "Deja libres perfil, progreso y acción" },
  "meta-reels":    { plataforma: "Meta Ads", nombre: "Reel", ratio: "9:16", px: "1080 × 1920", nota: "Revisa interfaz y CTA en el preview" },
  "meta-carrusel": { plataforma: "Meta Ads", nombre: "Carrusel por tarjeta", ratio: "1:1", px: "1080 × 1080", nota: "Cada tarjeta con su destino" },
  "tik-infeed":    { plataforma: "TikTok", nombre: "In-feed", ratio: "9:16", px: "1080 × 1920", nota: "Admite otros ratios según compra" },
  "goo-search":    { plataforma: "Google Ads", nombre: "Búsqueda RSA", ratio: "texto", px: "Sin lienzo", nota: "Títulos y descripciones en la vista Copys" },
  "goo-pmax-h":    { plataforma: "Google Ads", nombre: "PMax horizontal", ratio: "1.91:1", px: "1200 × 628", nota: "Obligatoria en el grupo de recursos" },
  "goo-pmax-c":    { plataforma: "Google Ads", nombre: "PMax cuadrada", ratio: "1:1", px: "1200 × 1200", nota: "Obligatoria en el grupo de recursos" },
  "goo-pmax-v":    { plataforma: "Google Ads", nombre: "PMax vertical", ratio: "4:5", px: "960 × 1200", nota: "Opcional, amplía inventario" },
  "goo-shorts":    { plataforma: "Google Ads", nombre: "YouTube Shorts", ratio: "9:16", px: "1080 × 1920", nota: "Revisa controles en el preview" },
  "goo-instream":  { plataforma: "Google Ads", nombre: "YouTube in-stream", ratio: "16:9", px: "1920 × 1080", nota: "Confirma duración por tipo de anuncio" },
  "lin-imagen":    { plataforma: "LinkedIn", nombre: "Anuncio de imagen", ratio: "1:1", px: "1200 × 1200", nota: "Confirma el spec vigente de LinkedIn" },
  "lin-mensaje":   { plataforma: "LinkedIn", nombre: "Message Ad", ratio: "texto", px: "Sin banner", nota: "Asunto, cuerpo y CTA" },
  "pro-300x250":   { plataforma: "Programática", nombre: "Display 300 × 250", ratio: "6:5", px: "300 × 250", nota: "Solo los tamaños del plan de medios" },
  "pro-728x90":    { plataforma: "Programática", nombre: "Display 728 × 90", ratio: "8:1", px: "728 × 90", nota: "Solo los tamaños del plan de medios" },
  "pro-320x50":    { plataforma: "Programática", nombre: "Display 320 × 50", ratio: "32:5", px: "320 × 50", nota: "Logo y CTA legibles" },
  "spo-audio":     { plataforma: "Spotify", nombre: "Audio + imagen", ratio: "audio", px: "640 × 640 imagen", nota: "Escribe para escuchar sin pantalla" },
  "dooh-vertical": { plataforma: "DOOH", nombre: "Pantalla vertical", ratio: "9:16", px: "Según pantalla", nota: "Pide resolución exacta al operador" }
};

/* FIN DE LOS DATOS ======================================================== */


const ESTADOS = ["Solicitada", "En producción", "Por aprobar", "Aprobada", "Entregada", "Cancelada"];
const LISTOS = ["Aprobada", "Entregada"];
const NOMBRE_TIPO = { estatico: "ESTÁTICO", video: "VIDEO", carrusel: "CARRUSEL", texto: "TEXTO", audio: "AUDIO" };
const entero = new Intl.NumberFormat("es-CO", { useGrouping: "always", maximumFractionDigits: 0 });
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const $ = sel => document.querySelector(sel);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[c]);
const fecha = iso => { if (!iso) return "Sin dato"; const [a, m, d] = iso.split("-").map(Number); return `${d} ${MESES[m - 1]} ${a}`; };
const briefDe = codigo => BRIEF.find(b => b.codigo === codigo) || {};
const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");

function vencida(fila, adaptacion) {
  return adaptacion.estado !== "Cancelada" && !LISTOS.includes(adaptacion.estado) && fila.entrega < CAMPANA.corte;
}

function nomenclatura(fila, adaptacion) {
  const b = briefDe(fila.codigo);
  return [fila.nn, NOMBRE_TIPO[adaptacion.tipo], b.angulo, fila.cta, CAMPANA.version].join("_");
}

/* Cada estado de la hoja se dibuja con el componente .ad-estado del sistema. */
const VARIANTE_ESTADO = {
  "Solicitada": "sin", "En producción": "pendiente", "Por aprobar": "parcial", "Aprobada": "ok", "Entregada": "ok", "Cancelada": "na",
  "Pendiente": "pendiente", "Aprobado": "ok", "Con ajustes": "alerta"
};
function chipEstado(estado, extra) {
  return `<span class="ad-estado ad-estado--${VARIANTE_ESTADO[estado] || "pendiente"}${estado === "Cancelada" ? " cm-cancelada" : ""}">${esc(estado)}</span>` + (extra ? ` <span class="ad-estado ad-estado--alerta">${esc(extra)}</span>` : "");
}

function marcador(formato, tipo, duracion) {
  const c = CATALOGO[formato] || { ratio: "texto", px: "Sin dato" };
  const r = c.ratio.replace(":", "x").replace(".", "");
  const base = ["1x1", "4x5", "9x16", "16x9"].includes(r) ? `ad-marcador--${r}` : `cm-ar--${r}`;
  let dentro = esc(c.ratio === "texto" ? "Solo texto" : c.ratio === "audio" ? "Audio" : c.ratio);
  if (tipo === "video" || tipo === "audio") dentro += `<small>${duracion ? duracion + " s" : "Sin dato"}</small>`;
  return `<span class="cm-lienzo"><span class="ad-marcador ${base}${tipo === "video" ? " cm-marco--video" : ""}" aria-hidden="true">${dentro}</span></span>`;
}

/* ---------- Ficha y resumen ---------- */
function pintarFicha() {
  $("#cm-cliente").textContent = CAMPANA.cliente;
  $("#cm-campana").textContent = CAMPANA.campana;
  $("#cm-periodo").textContent = CAMPANA.periodo;
  $("#cm-corte").textContent = fecha(CAMPANA.corte);
  $("#cm-responsable").textContent = CAMPANA.responsable;
  $("#cm-aprueba").textContent = CAMPANA.aprueba;
  $("#cm-fuente").textContent = `Fuente: ${CAMPANA.fuente} · corte ${fecha(CAMPANA.corte)} · ${CAMPANA.version}`;
}

function pintarResumen() {
  const conteo = Object.fromEntries(ESTADOS.map(e => [e, 0]));
  let vencidas = 0;
  PRODUCCION.forEach(f => f.adaptaciones.forEach(a => {
    conteo[a.estado] += a.cantidad;
    if (vencida(f, a)) vencidas += a.cantidad;
  }));
  const plan = ESTADOS.filter(e => e !== "Cancelada").reduce((s, e) => s + conteo[e], 0);
  const listas = conteo["Aprobada"] + conteo["Entregada"];
  $("#cm-kpi").innerHTML = [
    ["Piezas planificadas", plan, "Sin canceladas"],
    ["Por aprobar", conteo["Por aprobar"], "Esperan al cliente", true],
    ["Aprobadas o entregadas", listas, plan ? `${Math.round(listas / plan * 100)} % del plan` : "Sin dato"],
    ["Vencidas al corte", vencidas, "Entrega anterior al corte y sin aprobar"]
  ].map(([t, n, m, destacar]) => `<div class="ad-kpi${destacar ? " ad-kpi--on" : ""}"><dt class="ad-kpi__l">${t}</dt><dd class="ad-kpi__n">${entero.format(n)}</dd><dd class="ad-kpi__m">${m}</dd></div>`).join("");

  const max = Math.max(...ESTADOS.map(e => conteo[e]), 1);
  const mayor = ESTADOS.filter(e => e !== "Cancelada").sort((a, b) => conteo[b] - conteo[a])[0];
  $("#cm-barras").innerHTML = ESTADOS.map(e => `<li><span>${e}</span><span class="ad-barra${e === mayor ? " ad-barra--on" : ""}" aria-hidden="true"><span style="--v:${conteo[e] / max * 100}%"></span></span><strong>${entero.format(conteo[e])}</strong></li>`).join("");

  $("#cm-lectura").innerHTML = `<span class="ad-lectura__k">Lectura</span><p>De ${entero.format(plan)} piezas planificadas, ${entero.format(listas)} ya están aprobadas o entregadas. ` +
    `El mayor bloque está en «${mayor}» (${entero.format(conteo[mayor])}) y ${entero.format(vencidas)} piezas pasaron su fecha de entrega sin aprobación: son <span class="ad-hl">lo primero que se gestiona</span> con creatividad y con el cliente.</p>`;
}

/* ---------- Brief ---------- */
function pintarBrief() {
  const campos = [["objetivo", "Objetivo"], ["audiencia", "Audiencia"], ["barrera", "Barrera"], ["hipotesis", "Hipótesis"], ["oferta", "Oferta"], ["accion", "Acción esperada"], ["aprendizaje", "Aprendizaje previo"], ["legales", "Textos legales"], ["modo", "Aprobación"]];
  $("#cm-brief").innerHTML = BRIEF.map(b => `
    <article class="ad-card cm-brief">
      <p class="ad-card__n"><span class="cm-codigo">${esc(b.codigo)}</span> · ${esc(b.programa)} · ${esc(b.angulo)} · <span class="ad-tag ad-tag--line">${esc(b.rol)}</span></p>
      <h3 class="ad-card__t">${esc(b.mensaje)}</h3>
      <dl>${campos.map(([k, t]) => `<div><dt>${t}</dt><dd>${esc(b[k] || "Sin dato")}</dd></div>`).join("")}</dl>
    </article>`).join("");
}

/* ---------- Producción ---------- */
function opciones(sel, valores) {
  sel.insertAdjacentHTML("beforeend", valores.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join(""));
}

function filaVisible(f) {
  const p = $("#cm-f-plataforma").value, b = $("#cm-f-brief").value, e = $("#cm-f-estado").value;
  return (p === "all" || f.plataforma === p) && (b === "all" || f.codigo === b) &&
    (e === "all" || f.adaptaciones.some(a => e === "Vencida" ? vencida(f, a) : a.estado === e));
}

function pintarProduccion() {
  const filas = PRODUCCION.filter(filaVisible);
  $("#cm-produccion").innerHTML = filas.length ? filas.map(f => {
    const b = briefDe(f.codigo);
    const piezas = f.adaptaciones.map(a => {
      const c = CATALOGO[a.formato] || {};
      return `<li class="cm-pieza${a.estado === "Cancelada" ? " cm-pieza--cancelada" : ""}">
        ${marcador(a.formato, a.tipo, a.duracion)}
        <div>
          <strong>${esc(c.nombre || a.formato)}</strong>
          <span>${esc(c.px || "Sin dato")} · ${a.tipo === "video" || a.tipo === "audio" ? (a.duracion ? a.duracion + " s" : "Duración sin dato") : "Duración no aplica"}</span>
          <span>Cantidad ${entero.format(a.cantidad)}</span>
          ${chipEstado(a.estado, vencida(f, a) ? "Vencida" : "")}
          ${a.enlace ? `<a href="${esc(a.enlace)}" rel="noopener">Pieza final</a>` : `<span class="cm-suave">Sin enlace</span>`}
        </div>
      </li>`;
    }).join("");
    const nombres = f.adaptaciones.map(a => `<code>${esc(nomenclatura(f, a))}</code>`).filter((v, i, arr) => arr.indexOf(v) === i).join("");
    return `<tr>
      <th scope="row"><span class="cm-codigo">${esc(f.codigo)}</span><span class="cm-mensaje">${esc(b.mensaje)}</span><span class="cm-suave">${esc(b.programa)} · ${esc(b.angulo)} · ${esc(b.rol)}</span></th>
      <td><strong>${esc(f.plataforma)}</strong><span class="cm-suave">${esc(f.ubicacion)}</span><span class="cm-suave">${esc(f.trabajo)}</span></td>
      <td><ul class="cm-piezas">${piezas}</ul></td>
      <td><p>${esc(f.pedido)}</p><p class="cm-suave">CTA: ${esc(f.cta)}</p></td>
      <td class="cm-fechas"><span>Solicitud ${fecha(f.solicitud)}</span><span>Entrega ${fecha(f.entrega)}</span><span>Aprobación ${fecha(f.aprobacion)}</span><span class="cm-suave">Produce: ${esc(f.responsable)}</span><span class="cm-suave">Aprueba: ${esc(CAMPANA.aprueba)}</span></td>
      <td class="cm-nombres">${nombres}</td>
    </tr>`;
  }).join("") : `<tr><td colspan="6" class="cm-vacio">Ninguna fila coincide con los filtros.</td></tr>`;
  const n = filas.reduce((s, f) => s + f.adaptaciones.length, 0);
  $("#cm-conteo").textContent = `${entero.format(filas.length)} mensajes · ${entero.format(n)} adaptaciones visibles`;
}

function csv(nombre, encabezados, filas) {
  const celda = v => `"${String(v == null ? "" : v).replace(/"/g, "\"\"")}"`;
  const texto = [encabezados, ...filas].map(f => f.map(celda).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["﻿" + texto], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: nombre });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* Mismas columnas que la hoja Producción del Excel: se pega allí sin reordenar. */
function exportarProduccion() {
  const filas = [];
  PRODUCCION.filter(filaVisible).forEach(f => f.adaptaciones.forEach(a => {
    const c = CATALOGO[a.formato] || {};
    filas.push([f.codigo, briefDe(f.codigo).mensaje, f.plataforma, `${c.plataforma} · ${c.nombre}`, c.ratio, c.px, a.duracion || "", a.cantidad, f.trabajo,
      f.solicitud, f.entrega, f.aprobacion || "", a.estado, f.responsable, CAMPANA.aprueba, nomenclatura(f, a), a.enlace || ""]);
  }));
  csv(`${slug(CAMPANA.cliente)}_materiales_${CAMPANA.corte}.csv`,
    ["Código del brief", "Pieza o variante", "Plataforma", "Formato", "Proporción", "Dimensiones (px)", "Duración (s)", "Cantidad", "Tipo de trabajo",
      "Fecha de solicitud", "Fecha de entrega", "Fecha de aprobación", "Estado", "Responsable", "Aprueba", "Nomenclatura", "Enlace final"], filas);
}

/* ---------- Copys ---------- */
/* Revisión en memoria: no se guarda. En el repo del cliente, «registrar»
   envía cada decisión a la hoja (Apps Script) o se exporta a CSV. */
const REVISION = {};

function contador(texto, lim) {
  const n = [...String(texto)].length;
  const fuera = n > lim.max || (lim.min && n < lim.min);
  const rango = lim.min ? `${lim.min}–${lim.max}` : `${lim.max}`;
  return `<span class="cm-chars${fuera ? " cm-chars--fuera" : ""}">${entero.format(n)} / ${rango}${fuera ? (n > lim.max ? " · excede" : " · corto") : ""}</span>`;
}

function bloquesDe(p) {
  const b = [];
  if (p.meta) {
    b.push({ id: "pieza", medio: "Meta", t: "Pieza · texto dentro de la imagen", html: `
      <div class="cm-copy-pieza">
        <div class="cm-pz" aria-label="Vista de referencia de la pieza 4:5"><span>${esc(CAMPANA.cliente)}</span><b>${esc(p.meta.titular)}</b><i>${esc(p.meta.apoyo)}</i><small>${esc(p.programa)} · ${esc(p.modalidad)}</small></div>
        <div><p class="cm-etq">Titular</p><p><strong>${esc(p.meta.titular)}</strong></p><p class="cm-etq">Apoyo</p><p>${esc(p.meta.apoyo)}</p>
        ${contador(p.meta.titular + " " + p.meta.apoyo, LIMITES.metaPieza)}<p class="cm-suave">La vista es de referencia; el diseño final lo define creatividad.</p></div>
      </div>` });
    b.push({ id: "out", medio: "Meta", t: "Copy out · texto principal del anuncio", html: `
      <p>${esc(p.meta.copyOut)}</p>${contador(p.meta.copyOut, LIMITES.metaCopyOut)}
      <p class="cm-etq">Título bajo la pieza</p><p>${esc(p.meta.titulo)}</p>${contador(p.meta.titulo, LIMITES.metaTitulo)}
      <p class="cm-suave">Botón: ${esc(p.meta.cta)}</p>` });
  }
  if (p.google) {
    const L = LIMITES;
    b.push({ id: "google", medio: "Google", t: `Google · búsqueda (${p.google.h.length} títulos, ${p.google.d.length} descripciones)`, html: `
      <div class="cm-serp" aria-label="Ejemplo de combinación en resultados de búsqueda"><small>Patrocinado · universidadandina.example</small>
        <b>${esc(p.google.h.slice(0, 3).join(" | "))}</b><span>${esc(p.google.d.slice(0, 2).join(" "))}</span></div>
      <p class="cm-suave">Google rota títulos y descripciones; esta es solo una combinación posible.</p>
      <p class="cm-etq">Títulos · máximo ${L.googleH.max} caracteres · ${L.googleH.minimo} a ${L.googleH.cantidad}</p>
      <ul class="cm-chips">${p.google.h.map(h => `<li>${esc(h)} ${contador(h, L.googleH)}</li>`).join("")}</ul>
      <p class="cm-etq">Descripciones · máximo ${L.googleD.max} caracteres · ${L.googleD.minimo} a ${L.googleD.cantidad}</p>
      <ul class="cm-desc">${p.google.d.map(d => `<li>${esc(d)} ${contador(d, L.googleD)}</li>`).join("")}</ul>
      ${p.google.h.length < L.googleH.cantidad ? `<p class="cm-suave">Parcial: faltan ${L.googleH.cantidad - p.google.h.length} títulos para completar el máximo.</p>` : ""}` });
  }
  if (p.tiktok) b.push({ id: "tiktok", medio: "TikTok", t: "TikTok · caption", html: `<p>${esc(p.tiktok)}</p>${contador(p.tiktok, LIMITES.tiktok)}<p class="cm-suave">Sin emojis.</p>` });
  if (p.linkedin) b.push({ id: "linkedin", medio: "LinkedIn", t: "LinkedIn · Message Ad", html: `
    <p class="cm-etq">Asunto</p><p><strong>${esc(p.linkedin.asunto)}</strong></p>${contador(p.linkedin.asunto, LIMITES.linAsunto)}
    <p class="cm-etq">Cuerpo</p><p>${esc(p.linkedin.cuerpo)}</p>${contador(p.linkedin.cuerpo, LIMITES.linCuerpo)}
    <p class="cm-etq">Botón</p><p>${esc(p.linkedin.cta)}</p>${contador(p.linkedin.cta, LIMITES.linCta)}` });
  return b;
}

function estadoCopy(clave) { return (REVISION[clave] && REVISION[clave].e) || "Pendiente"; }

function pintarCopys() {
  const nivel = $("#cm-c-nivel").value, medio = $("#cm-c-medio").value, estado = $("#cm-c-estado").value;
  let total = 0, revisados = 0;
  COPYS.forEach((p, i) => bloquesDe(p).forEach(b => { total++; if (estadoCopy(i + b.id) !== "Pendiente") revisados++; }));
  const html = COPYS.map((p, i) => {
    if (nivel !== "all" && p.nivel !== nivel) return "";
    const bloques = bloquesDe(p).filter(b => (medio === "all" || b.medio === medio) && (estado === "all" || estadoCopy(i + b.id) === estado));
    if (!bloques.length) return "";
    return `<article class="ad-card cm-programa">
      <header><span class="cm-nivel">${esc(p.nivel)}</span><h3>${esc(p.programa)}</h3><p class="cm-suave">${esc(p.modalidad)} · ${esc(p.codigo)} · ${esc(briefDe(p.codigo).angulo || "Sin ángulo")}</p></header>
      ${bloques.map(b => {
        const clave = i + b.id, e = estadoCopy(clave), r = REVISION[clave] || {};
        return `<section class="cm-bloque" aria-label="${esc(b.t)}">
          <div class="cm-bloque__cab"><h4>${esc(b.t)}</h4>${chipEstado(e)}</div>
          ${b.html}
          <div class="cm-revision">
            <button type="button" class="ad-chip" data-clave="${clave}" data-e="Aprobado" aria-pressed="${e === "Aprobado"}">Aprobar</button>
            <button type="button" class="ad-chip" data-clave="${clave}" data-e="Con ajustes" aria-pressed="${e === "Con ajustes"}">Pedir ajuste</button>
            <label class="cm-oculto" for="nota-${clave}">Comentario para ${esc(b.t)}</label>
            <textarea id="nota-${clave}" data-nota="${clave}" rows="1" placeholder="Comentario o corrección">${esc(r.c || "")}</textarea>
          </div>
        </section>`;
      }).join("")}
    </article>`;
  }).join("");
  $("#cm-copys").innerHTML = html || `<p class="cm-vacio">Ningún bloque coincide con los filtros.</p>`;
  $("#cm-progreso").innerHTML = `<span class="ad-barra ad-barra--on" aria-hidden="true"><span style="--v:${total ? revisados / total * 100 : 0}%"></span></span> ${entero.format(revisados)} de ${entero.format(total)} bloques revisados`;
}

function exportarRevision() {
  const filas = [];
  COPYS.forEach((p, i) => bloquesDe(p).forEach(b => {
    const r = REVISION[i + b.id] || {};
    filas.push([CAMPANA.campana, p.programa, p.nivel, b.t, r.e || "Pendiente", r.c || ""]);
  }));
  csv(`${slug(CAMPANA.cliente)}_revision-copys_${CAMPANA.corte}.csv`, ["Campaña", "Programa", "Nivel", "Bloque", "Estado", "Comentario"], filas);
}

/* ---------- Especificaciones ---------- */
function pintarEspecificaciones() {
  $("#cm-specs").innerHTML = Object.values(CATALOGO).map(c => `<tr><th scope="row">${esc(c.plataforma)} · ${esc(c.nombre)}</th><td>${esc(c.ratio === "texto" ? "Texto" : c.ratio === "audio" ? "Audio" : c.ratio)}</td><td class="valor">${esc(c.px)}</td><td>${esc(c.nota)}</td></tr>`).join("");
  const nombres = { metaPieza: "Meta · pieza (titular + apoyo)", metaCopyOut: "Meta · copy out", metaTitulo: "Meta · título", googleH: "Google · título", googleD: "Google · descripción", tiktok: "TikTok · caption", linAsunto: "LinkedIn · asunto", linCuerpo: "LinkedIn · cuerpo", linCta: "LinkedIn · botón" };
  $("#cm-limites").innerHTML = Object.entries(LIMITES).map(([k, l]) => `<tr><th scope="row">${nombres[k] || k}</th><td class="valor">${l.min ? `${l.min}–${l.max}` : entero.format(l.max)}</td><td class="valor">${l.cantidad ? `${l.minimo} a ${l.cantidad}` : "1"}</td><td>${esc(l.nota)}</td></tr>`).join("");
}

/* ---------- Arranque ---------- */
function iniciar() {
  pintarFicha();
  pintarResumen();
  pintarBrief();
  opciones($("#cm-f-plataforma"), [...new Set(PRODUCCION.map(f => f.plataforma))]);
  opciones($("#cm-f-brief"), BRIEF.map(b => b.codigo));
  [...$("#cm-f-brief").options].forEach(o => { if (o.value !== "all") o.textContent = `${o.value} · ${briefDe(o.value).angulo}`; });
  opciones($("#cm-f-estado"), [...ESTADOS, "Vencida"]);
  opciones($("#cm-c-nivel"), [...new Set(COPYS.map(p => p.nivel))]);
  opciones($("#cm-c-medio"), [...new Set(COPYS.flatMap(p => bloquesDe(p).map(b => b.medio)))]);
  opciones($("#cm-c-estado"), ["Pendiente", "Aprobado", "Con ajustes"]);
  ["#cm-f-plataforma", "#cm-f-brief", "#cm-f-estado"].forEach(s => $(s).addEventListener("change", pintarProduccion));
  ["#cm-c-nivel", "#cm-c-medio", "#cm-c-estado"].forEach(s => $(s).addEventListener("change", pintarCopys));
  $("#cm-exportar").addEventListener("click", exportarProduccion);
  $("#cm-exportar-copys").addEventListener("click", exportarRevision);
  $("#cm-copys").addEventListener("click", ev => {
    const btn = ev.target.closest("button[data-clave]");
    if (!btn) return;
    const r = REVISION[btn.dataset.clave] || (REVISION[btn.dataset.clave] = {});
    r.e = r.e === btn.dataset.e ? "Pendiente" : btn.dataset.e;
    pintarCopys();
    const igual = document.querySelector(`button[data-clave="${btn.dataset.clave}"][data-e="${btn.dataset.e}"]`);
    if (igual) igual.focus();
  });
  $("#cm-copys").addEventListener("input", ev => {
    const t = ev.target.closest("textarea[data-nota]");
    if (t) (REVISION[t.dataset.nota] || (REVISION[t.dataset.nota] = {})).c = t.value;
  });
  pintarProduccion();
  pintarCopys();
  pintarEspecificaciones();
  document.querySelectorAll(".formato-filtros").forEach(f => { f.hidden = false; });
}

iniciar();
