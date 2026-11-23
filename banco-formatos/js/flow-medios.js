"use strict";

/* ==========================================================================
   Flow de medios y forecast · datos de la plantilla
   --------------------------------------------------------------------------
   REEMPLAZAR CON LOS DATOS DEL CLIENTE. Todo lo que se ve en la página sale
   de este bloque: no escribas cifras a mano en el HTML.
   - Montos en la moneda de `plan.moneda`, sin separadores (14000000).
   - Fechas en AAAA-MM-DD. Los vuelos son inclusivos.
   - Si un dato no existe todavía, déjalo en null: la página muestra «Sin dato».
   - Las cifras deben coincidir con el libro flow-medios.xlsx del mismo periodo.
   ========================================================================== */
const plan = {
  cliente: "Universidad Andina",
  nombre: "Inscripciones 2027-2",
  documento: "UNIVERSIDAD-ANDINA_FLOW_Inscripciones 2027-2_01-02-27_V01",
  estado: "Propuesta a validar con el cliente",
  moneda: "COP",
  inicio: "2027-03-01",
  fin: "2027-07-31",
  resultado: "Lead: formulario de inscripción enviado (evento lead_inscripcion)",
  negocio: "Matrícula confirmada por Admisiones",
  // Porcentaje que se guarda fuera de los medios para mover según el CPL real.
  reserva: 0.10,
  // El peso adicional rinde menos que el promedio: costo marginal sobre el CPL medio.
  costoMarginal: 1.3
};

// Etapas en el orden del embudo. El tono va del más oscuro (conversión) al más claro.
const etapas = [
  { id: "conversion", nombre: "Conversión", trabajo: "Generar leads de inscripción" },
  { id: "consideracion", nombre: "Consideración", trabajo: "Explicar programas y llevar tráfico" },
  { id: "reconocimiento", nombre: "Reconocimiento", trabajo: "Instalar la marca y la convocatoria" }
];

// Una línea por medio y táctica. `meses` es la inversión mensual (clave AAAA-MM).
// `costo` es el supuesto por unidad: CPL/CPA por resultado; CPM por mil impresiones; CPV por vista.
const lineas = [
  { id: "meta-leads", medio: "Meta Ads", tactica: "Leads de inscripción", etapa: "conversion",
    rol: "Base de volumen: formularios nativos y sitio", kpi: "CPL", tipoCosto: "CPL", costo: 22000, unidad: "leads",
    fuente: "Histórico 2026-2, mismo periodo", vuelos: [["2027-03-01", "2027-07-15"]],
    meses: { "2027-03": 14000000, "2027-04": 16000000, "2027-05": 18000000, "2027-06": 16000000, "2027-07": 6000000 } },
  { id: "search", medio: "Google Ads", tactica: "Search por programa", etapa: "conversion",
    rol: "Captura de demanda: marca y genéricas por programa", kpi: "CPL", tipoCosto: "CPL", costo: 30000, unidad: "leads",
    fuente: "Histórico 2026-2, mismo periodo", vuelos: [["2027-03-01", "2027-07-31"]],
    meses: { "2027-03": 12000000, "2027-04": 14000000, "2027-05": 16000000, "2027-06": 15000000, "2027-07": 6000000 } },
  { id: "tiktok", medio: "TikTok Ads", tactica: "Leads pregrado", etapa: "conversion",
    rol: "Audiencia joven de pregrado con video vertical", kpi: "CPL", tipoCosto: "CPL", costo: 26000, unidad: "leads",
    fuente: "Estimado: prueba de 2026-2 con cuatro semanas", vuelos: [["2027-03-08", "2027-07-15"]],
    meses: { "2027-03": 6000000, "2027-04": 8000000, "2027-05": 9000000, "2027-06": 8000000, "2027-07": 3000000 } },
  { id: "linkedin", medio: "LinkedIn Ads", tactica: "Leads posgrado", etapa: "conversion",
    rol: "Profesionales por cargo y sector para posgrados", kpi: "CPL", tipoCosto: "CPL", costo: 65000, unidad: "leads",
    fuente: "Referencia de categoría: sin historial propio", vuelos: [["2027-03-01", "2027-06-30"]],
    meses: { "2027-03": 5000000, "2027-04": 5000000, "2027-05": 5000000, "2027-06": 4000000, "2027-07": 0 } },
  { id: "youtube", medio: "Google Ads", tactica: "YouTube in-stream", etapa: "consideracion",
    rol: "Testimonios y recorrido por el campus", kpi: "CPV", tipoCosto: "CPV", costo: 60, unidad: "vistas",
    fuente: "Histórico 2026-2", vuelos: [["2027-03-01", "2027-05-31"]],
    meses: { "2027-03": 6000000, "2027-04": 5000000, "2027-05": 3000000, "2027-06": 0, "2027-07": 0 } },
  { id: "programatica", medio: "Programática", tactica: "Display contextual", etapa: "consideracion",
    rol: "Portales de educación y orientación vocacional", kpi: "CPM", tipoCosto: "CPM", costo: 7000, unidad: "impresiones",
    fuente: "Cotización del proveedor, enero 2027", vuelos: [["2027-03-01", "2027-04-30"], ["2027-05-17", "2027-06-30"]],
    meses: { "2027-03": 4000000, "2027-04": 4000000, "2027-05": 3000000, "2027-06": 2000000, "2027-07": 0 } },
  { id: "meta-alcance", medio: "Meta Ads", tactica: "Alcance de marca", etapa: "reconocimiento",
    rol: "Convocatoria abierta y recordación", kpi: "CPM", tipoCosto: "CPM", costo: 9000, unidad: "impresiones",
    fuente: "Histórico 2026-2", vuelos: [["2027-03-01", "2027-07-31"]],
    meses: { "2027-03": 8000000, "2027-04": 6000000, "2027-05": 4000000, "2027-06": 3000000, "2027-07": 2000000 } }
];

// Fechas que mueven el plan. Se marcan en el calendario.
const momentos = [
  { fecha: "2027-03-01", nombre: "Apertura de inscripciones" },
  { fecha: "2027-04-17", nombre: "Feria de admisiones" },
  { fecha: "2027-06-15", nombre: "Cierre de inscripciones ordinarias" },
  { fecha: "2027-07-26", nombre: "Inicio de clases" }
];

// Forecast por programa: cómo se reparte cada línea de conversión (suma 1 por línea),
// la tasa lead → matrícula y la meta de matrículas atribuibles a pauta.
const programas = [
  { nombre: "Administración de Empresas", nivel: "Pregrado", tasa: 0.028, meta: 50,
    reparto: { "meta-leads": 0.25, search: 0.20, tiktok: 0.30 } },
  { nombre: "Ingeniería de Sistemas", nivel: "Pregrado", tasa: 0.028, meta: 45,
    reparto: { "meta-leads": 0.25, search: 0.25, tiktok: 0.30 } },
  { nombre: "Psicología", nivel: "Pregrado", tasa: 0.028, meta: 40,
    reparto: { "meta-leads": 0.20, search: 0.15, tiktok: 0.25 } },
  { nombre: "Contaduría Pública", nivel: "Pregrado", tasa: 0.028, meta: 25,
    reparto: { "meta-leads": 0.15, search: 0.15, tiktok: 0.15 } },
  { nombre: "Especialización en Gerencia de Proyectos", nivel: "Posgrado", tasa: 0.02, meta: 20,
    reparto: { "meta-leads": 0.10, search: 0.15, linkedin: 0.50 } },
  { nombre: "Maestría en Analítica de Datos", nivel: "Posgrado", tasa: 0.02, meta: 12,
    reparto: { "meta-leads": 0.05, search: 0.10, linkedin: 0.50 } }
];

// Tres escenarios (estrategia.html, punto 21): una condición con su respuesta ya escrita.
// factorCosto multiplica el costo supuesto; factorTasa, la conversión a matrícula;
// recorteAlcance reduce reconocimiento y consideración; usaReserva activa la reserva.
const escenarios = [
  { id: "base", nombre: "Base", condicion: "El contexto se mantiene en la línea base de 2026-2.",
    senal: "CPL real dentro de ±10 % del supuesto durante dos semanas.",
    respuesta: "Operar el plan, medir y mover hasta 15 % entre medios al cierre de cada mes.",
    factorCosto: 1, factorTasa: 1, recorteAlcance: 0, usaReserva: false },
  { id: "favorable", nombre: "Favorable", condicion: "Más demanda: la feria y las becas suben la búsqueda de programas.",
    senal: "CPL 10 % bajo el supuesto por tres semanas con tasa de contacto estable.",
    respuesta: "Activar la reserva en los medios que sostienen el CPL, sin pasar de 20 % de aumento semanal.",
    factorCosto: 0.9, factorTasa: 1, recorteAlcance: 0, usaReserva: true },
  { id: "restrictivo", nombre: "Restrictivo", condicion: "Menos demanda o más costo: competencia con becas agresivas.",
    senal: "CPL 20 % sobre el supuesto o contacto efectivo bajo 40 % en CRM.",
    respuesta: "Proteger conversión, recortar 30 % de reconocimiento y consideración y avisar al cliente.",
    factorCosto: 1.2, factorTasa: 0.9, recorteAlcance: 0.3, usaReserva: false }
];

// Supuestos visibles. estado: "Histórico", "Estimado", "En verificación" o "Sin dato".
const supuestos = [
  { nombre: "CPL Meta Ads", valor: "$22.000", fuente: "Promedio 2026-2, marzo a julio", estado: "Histórico" },
  { nombre: "CPL Google Search", valor: "$30.000", fuente: "Promedio 2026-2, marzo a julio", estado: "Histórico" },
  { nombre: "CPL TikTok Ads", valor: "$26.000", fuente: "Prueba de cuatro semanas en 2026-2", estado: "Estimado" },
  { nombre: "CPL LinkedIn Ads", valor: "$65.000", fuente: "Referencia de categoría para posgrados", estado: "Estimado" },
  { nombre: "Tasa lead → matrícula pregrado", valor: "2,8 %", fuente: "Cruce CRM 2026-2 entregado por Admisiones", estado: "Histórico" },
  { nombre: "Tasa lead → matrícula posgrado", valor: "2,0 %", fuente: "Pendiente: CRM sin cierre de posgrados 2026-2", estado: "En verificación" },
  { nombre: "Matrículas de la convocatoria que vienen de pauta", valor: null, fuente: "Admisiones no separa canal de origen todavía", estado: "Sin dato" }
];

// Reglas de ajuste y próximos pasos con responsable, fecha y criterio de verificación.
const reglas = [
  "Las dos primeras semanas son de aprendizaje: no movemos presupuesto antes del 15 de marzo.",
  "Al cierre de cada mes movemos hasta 15 % entre medios según el CPL real de cada uno.",
  "Para escalar un medio subimos como máximo 20 % por semana; un salto mayor reinicia el aprendizaje.",
  "La reserva solo se activa con la señal del escenario favorable o para cubrir un medio en verificación."
];
const pasos = [
  { accion: "Validar el flow y la meta de matrículas por programa", responsable: "Cuentas y Admisiones", fecha: "2027-02-08", criterio: "Flow firmado en V02" },
  { accion: "Confirmar la tasa de conversión de posgrado con el CRM", responsable: "Analítica", fecha: "2027-02-12", criterio: "Tasa con al menos 300 leads de base" },
  { accion: "Publicar formularios y evento lead_inscripcion en las cuatro plataformas", responsable: "Martech", fecha: "2027-02-22", criterio: "Prueba real con lead en CRM en menos de 10 minutos" }
];

/* ==========================================================================
   Lógica. No hace falta tocarla para adaptar la plantilla.
   ========================================================================== */
const entero = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0, useGrouping: "always" });
const decimal = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: "always" });
const mesCorto = new Intl.DateTimeFormat("es-CO", { month: "short", timeZone: "UTC" });
const mesLargo = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric", timeZone: "UTC" });
const diaMes = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "UTC" });

const SIN_DATO = "Sin dato";
const pesos = v => Number.isFinite(v) ? "$" + entero.format(Math.round(v)) : SIN_DATO;
const millones = v => {
  if (!Number.isFinite(v)) return SIN_DATO;
  const m = v / 1e6;
  return "$" + (Math.abs(m) >= 100 || Number.isInteger(m) ? entero.format(Math.round(m)) : decimal.format(m)) + " M";
};
const numero = v => Number.isFinite(v) ? entero.format(Math.round(v)) : SIN_DATO;
const pct = (v, dec = 0) => Number.isFinite(v)
  ? new Intl.NumberFormat("es-CO", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v * 100) + " %"
  : SIN_DATO;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fecha = s => new Date(s + "T00:00:00Z");
const $ = sel => document.querySelector(sel);

// Meses del periodo (AAAA-MM), en orden.
const meses = (() => {
  const out = [];
  const d = fecha(plan.inicio);
  d.setUTCDate(1);
  while (d <= fecha(plan.fin)) {
    out.push(d.toISOString().slice(0, 7));
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return out;
})();
const nombreMes = k => mesCorto.format(fecha(k + "-01")).replace(".", "");

const totalLinea = l => meses.reduce((s, m) => s + (l.meses[m] || 0), 0);
// Resultado de una inversión según el tipo de costo. CPM rinde por mil.
const rinde = (l, inversion, factor = 1) => {
  if (!Number.isFinite(inversion) || !(l.costo > 0)) return null;
  const costo = l.costo * factor;
  return l.tipoCosto === "CPM" ? inversion / costo * 1000 : inversion / costo;
};

function calcular(esc) {
  const base = lineas.map(l => {
    const total = totalLinea(l);
    const recorte = l.etapa === "conversion" ? 0 : esc.recorteAlcance;
    const inversion = total * (1 - recorte);
    return { l, inversion, resultado: rinde(l, inversion, l.etapa === "conversion" ? esc.factorCosto : 1) };
  });
  const conv = base.filter(x => x.l.etapa === "conversion");
  const invConv = conv.reduce((s, x) => s + x.inversion, 0);
  const leadsConv = conv.reduce((s, x) => s + (x.resultado || 0), 0);
  const totalBase = lineas.reduce((s, l) => s + totalLinea(l), 0);
  const reserva = totalBase * plan.reserva;
  // La reserva rinde al costo marginal, no al promedio.
  const cplMedioBase = (() => {
    const c = lineas.filter(l => l.etapa === "conversion");
    const inv = c.reduce((s, l) => s + totalLinea(l), 0);
    const leads = c.reduce((s, l) => s + rinde(l, totalLinea(l)), 0);
    return inv / leads;
  })();
  const leadsReserva = esc.usaReserva ? reserva / (cplMedioBase * esc.factorCosto * plan.costoMarginal) : 0;
  const inversion = base.reduce((s, x) => s + x.inversion, 0) + (esc.usaReserva ? reserva : 0);
  const leads = leadsConv + leadsReserva;

  // Forecast por programa: reparte cada línea de conversión y suma la reserva en proporción.
  const progs = programas.map(p => {
    let inv = 0, ld = 0;
    for (const [id, share] of Object.entries(p.reparto)) {
      const x = conv.find(c => c.l.id === id);
      if (!x) continue;
      inv += x.inversion * share;
      ld += (x.resultado || 0) * share;
    }
    return { p, inversion: inv, leads: ld };
  });
  const leadsProg = progs.reduce((s, x) => s + x.leads, 0);
  progs.forEach(x => {
    const extra = leadsProg > 0 ? leadsReserva * x.leads / leadsProg : 0;
    const invExtra = leadsProg > 0 && esc.usaReserva ? reserva * x.leads / leadsProg : 0;
    x.inversion += invExtra;
    x.leads += extra;
    x.matriculas = Number.isFinite(x.p.tasa) ? x.leads * x.p.tasa * esc.factorTasa : null;
    x.cumplimiento = x.p.meta > 0 && x.matriculas !== null ? x.matriculas / x.p.meta : null;
  });
  const matriculas = progs.reduce((s, x) => s + (x.matriculas || 0), 0);
  const meta = programas.reduce((s, p) => s + (p.meta || 0), 0);
  return {
    esc, base, progs, inversion, reserva, totalBase, leads, invConv: invConv + (esc.usaReserva ? reserva : 0),
    cpl: leads > 0 ? (invConv + (esc.usaReserva ? reserva : 0)) / leads : null,
    matriculas, meta, cumplimiento: meta > 0 ? matriculas / meta : null
  };
}

/* ---------- portada y resumen ---------- */
function renderPortada() {
  $("#flow-cliente").textContent = plan.cliente;
  $("#flow-nombre").textContent = plan.nombre + ".";
  $("#flow-documento").textContent = plan.documento;
  $("#flow-estado").textContent = plan.estado;
  $("#flow-periodo").textContent = diaMes.format(fecha(plan.inicio)) + " a " + diaMes.format(fecha(plan.fin)) + " de " + plan.fin.slice(0, 4) + " · " + meses.length + " meses";
  $("#flow-moneda").textContent = plan.moneda + " · sin IVA ni comisión de agencia";
  $("#flow-resultado").textContent = plan.resultado;
  $("#flow-negocio").textContent = plan.negocio;
}

let escenarioActivo = escenarios[0].id;

function renderResumen() {
  const r = calcular(escenarios.find(e => e.id === escenarioActivo));
  const base = calcular(escenarios[0]);
  const delta = (v, b) => r.esc.id === "base" || !Number.isFinite(v) || !Number.isFinite(b) || b === 0 ? "" :
    " · " + (v >= b ? "+" : "−") + pct(Math.abs(v / b - 1)) + " vs. base";
  $("#flow-kpi").innerHTML = [
    { t: "Inversión del periodo", v: millones(r.inversion), s: (r.esc.usaReserva ? "incluye reserva de " + millones(r.reserva) : "más reserva de " + millones(r.reserva) + " sin asignar") + delta(r.inversion, base.inversion), lima: true },
    { t: "Leads proyectados", v: numero(r.leads), s: "solo líneas de conversión" + delta(r.leads, base.leads) },
    { t: "CPL promedio", v: pesos(r.cpl), s: "inversión de conversión ÷ leads" + delta(r.cpl, base.cpl) },
    { t: "Matrículas estimadas", v: numero(r.matriculas), s: "leads × tasa de cada nivel" + delta(r.matriculas, base.matriculas) },
    { t: "Cumplimiento de meta", v: pct(r.cumplimiento), s: "meta de " + numero(r.meta) + " matrículas de pauta" }
  ].map(k => `<div class="ad-kpi${k.lima ? " ad-kpi--on" : ""}"><dt class="ad-kpi__l">${k.t}</dt><dd class="ad-kpi__n">${k.v}</dd><dd class="ad-kpi__m">${esc(k.s)}</dd></div>`).join("");

  const conv = lineas.filter(l => l.etapa === "conversion").length;
  $("#flow-lectura").textContent = r.esc.id === "base"
    ? `Con ${millones(r.inversion)} en ${lineas.length} líneas de medios proyectamos ${numero(r.leads)} leads a un CPL de ${pesos(r.cpl)}. Eso da ${numero(r.matriculas)} matrículas, ${pct(r.cumplimiento)} de la meta: el plan base no la cubre sola y la reserva queda para cerrar la diferencia.`
    : `En el escenario ${r.esc.nombre.toLowerCase()} proyectamos ${numero(r.leads)} leads (${conv} líneas de conversión) y ${numero(r.matriculas)} matrículas, ${pct(r.cumplimiento)} de la meta. ${r.esc.respuesta}`;
  $("#flow-escenario-nota").textContent = "Escenario " + r.esc.nombre.toLowerCase() + ": " + r.esc.condicion;
  document.querySelectorAll("[data-escenario]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.escenario === escenarioActivo)));
  renderMedios(r);
  renderProgramas(r);
}

/* ---------- rol por medio ---------- */
function renderMedios(r) {
  const filas = r.base.map(x => {
    const l = x.l;
    const etapa = etapas.find(e => e.id === l.etapa);
    const costo = l.tipoCosto === "CPM" ? pesos(l.costo) + " por mil" : pesos(l.costo);
    return `<tr>
      <th scope="row">${esc(l.medio)}<span class="flow-sub">${esc(l.tactica)}</span></th>
      <td>${esc(etapa ? etapa.nombre : l.etapa)}</td>
      <td class="flow-rol">${esc(l.rol)}</td>
      <td>${esc(l.tipoCosto)} ${costo}</td>
      <td class="valor">${pesos(x.inversion)}</td>
      <td class="valor">${pct(x.inversion / (r.inversion - (r.esc.usaReserva ? r.reserva : 0)), 1)}</td>
      <td class="valor">${numero(x.resultado)} <span class="flow-sub flow-sub--inline">${esc(l.unidad)}</span></td>
    </tr>`;
  }).join("");
  const sinReserva = r.inversion - (r.esc.usaReserva ? r.reserva : 0);
  const leadsMedios = r.base.filter(x => x.l.etapa === "conversion").reduce((s, x) => s + (x.resultado || 0), 0);
  $("#flow-medios-filas").innerHTML = filas;
  $("#flow-medios-pie").innerHTML = `
    <tr><th scope="row" colspan="4">Total en medios</th><td class="valor">${pesos(sinReserva)}</td><td class="valor">100 %</td><td class="valor">${numero(leadsMedios)} <span class="flow-sub flow-sub--inline">leads</span></td></tr>
    <tr><th scope="row" colspan="4">Reserva de optimización (${pct(plan.reserva)})</th><td class="valor">${pesos(r.reserva)}</td><td class="valor">—</td><td class="valor">${r.esc.usaReserva ? "+" + numero(r.leads - leadsMedios) + ' <span class="flow-sub flow-sub--inline">leads</span>' : "sin asignar"}</td></tr>
    <tr><th scope="row" colspan="4">Total con reserva</th><td class="valor">${pesos(sinReserva + r.reserva)}</td><td class="valor">—</td><td class="valor">—</td></tr>`;
}

/* ---------- calendario tipo Gantt: medio × mes, con semanas ---------- */
function semanasDe(mes) {
  // Semanas que empiezan (lunes) dentro del mes; la primera arranca el día 1.
  const ini = fecha(mes + "-01");
  const fin = new Date(Date.UTC(ini.getUTCFullYear(), ini.getUTCMonth() + 1, 0));
  const out = [];
  let d = new Date(ini);
  while (d <= fin) {
    const e = new Date(d);
    e.setUTCDate(e.getUTCDate() + ((7 - e.getUTCDay()) % 7)); // hasta el domingo
    out.push([new Date(d), e > fin ? fin : e]);
    d = new Date(e);
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}
const activa = (l, [a, b]) => l.vuelos.some(([i, f]) => fecha(i) <= b && fecha(f) >= a);

function renderCalendario() {
  const semanas = Object.fromEntries(meses.map(m => [m, semanasDe(m)]));
  const cab = `<tr><th scope="col" class="gantt-medio">Medio y táctica</th>${meses.map(m =>
    `<th scope="col" class="gantt-mes">${esc(nombreMes(m))}<span class="flow-sub flow-sub--inline">${semanas[m].length} sem.</span></th>`).join("")}<th scope="col" class="valor">Total</th></tr>`;
  const filas = etapas.map(et => {
    const ls = lineas.filter(l => l.etapa === et.id);
    if (!ls.length) return "";
    const grupo = `<tr class="gantt-grupo"><th scope="rowgroup" colspan="${meses.length + 2}">${esc(et.nombre)} · ${esc(et.trabajo)}</th></tr>`;
    return grupo + ls.map(l => `<tr>
      <th scope="row" class="gantt-medio">${esc(l.medio)}<span class="flow-sub">${esc(l.tactica)}</span></th>
      ${meses.map(m => {
        const monto = l.meses[m] || 0;
        const tiras = semanas[m].map(s => {
          const on = activa(l, s);
          return `<i class="${on ? "on" : ""}" title="${diaMes.format(s[0])}–${diaMes.format(s[1])}: ${on ? "al aire" : "sin pauta"}"></i>`;
        }).join("");
        return `<td class="gantt-celda${monto ? "" : " gantt-celda--vacia"}"><span class="gantt-monto">${monto ? millones(monto) : "—"}</span><span class="gantt-tira" aria-hidden="true">${tiras}</span></td>`;
      }).join("")}
      <td class="valor">${millones(totalLinea(l))}</td>
    </tr>`).join("");
  }).join("");
  const totMes = meses.map(m => lineas.reduce((s, l) => s + (l.meses[m] || 0), 0));
  const total = totMes.reduce((a, b) => a + b, 0);
  const pie = `<tr><th scope="row">Total del mes</th>${totMes.map(v => `<td class="valor">${millones(v)}</td>`).join("")}<td class="valor">${millones(total)}</td></tr>
    <tr><th scope="row">Participación</th>${totMes.map(v => `<td class="valor">${pct(v / total)}</td>`).join("")}<td class="valor">100 %</td></tr>`;
  const hitos = `<tr class="gantt-hitos"><th scope="row">Momentos</th>${meses.map(m => {
    const hs = momentos.filter(h => h.fecha.startsWith(m));
    return `<td>${hs.map(h => `<span class="gantt-hito"><b aria-hidden="true"></b>${diaMes.format(fecha(h.fecha))} · ${esc(h.nombre)}</span>`).join("") || ""}</td>`;
  }).join("")}<td></td></tr>`;
  $("#flow-gantt").innerHTML = `<caption id="flow-gantt-caption">Inversión mensual en ${esc(plan.moneda)} y semanas al aire por línea. Barra oscura: semana con pauta; clara: sin pauta.</caption><thead>${cab}</thead><tbody>${hitos}${filas}</tbody><tfoot>${pie}</tfoot>`;
}

/* ---------- inversión por mes, apilada por etapa (SVG propio) ---------- */
function renderGrafico() {
  const w = 720, h = 300, m = { t: 16, r: 12, b: 36, l: 56 };
  const datos = meses.map(mes => ({
    mes,
    partes: etapas.map(et => lineas.filter(l => l.etapa === et.id).reduce((s, l) => s + (l.meses[mes] || 0), 0))
  }));
  const max = Math.max(...datos.map(d => d.partes.reduce((a, b) => a + b, 0)));
  const paso = Math.pow(10, Math.floor(Math.log10(max))) / 2;
  const tope = Math.ceil(max / paso) * paso;
  const y = v => m.t + (h - m.t - m.b) * (1 - v / tope);
  const banda = (w - m.l - m.r) / datos.length;
  const ancho = Math.min(64, banda * 0.56);
  const tonos = ["var(--sumi)", "var(--tinta-secundaria)", "var(--tinta-tenue)"];
  let svg = "";
  for (let v = 0; v <= tope; v += paso) {
    svg += `<line x1="${m.l}" x2="${w - m.r}" y1="${y(v)}" y2="${y(v)}" class="eje-linea"/><text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" class="eje-texto">${millones(v)}</text>`;
  }
  datos.forEach((d, i) => {
    const x = m.l + banda * i + (banda - ancho) / 2;
    let acc = 0;
    d.partes.forEach((v, j) => {
      if (!v) return;
      svg += `<rect x="${x}" y="${y(acc + v)}" width="${ancho}" height="${y(acc) - y(acc + v)}" fill="${tonos[j]}" stroke="var(--papel)" stroke-width="1"><title>${esc(nombreMes(d.mes))} · ${esc(etapas[j].nombre)}: ${millones(v)}</title></rect>`;
      acc += v;
    });
    svg += `<text x="${x + ancho / 2}" y="${y(acc) - 6}" text-anchor="middle" class="eje-valor">${millones(acc)}</text>`;
    svg += `<text x="${x + ancho / 2}" y="${h - m.b + 20}" text-anchor="middle" class="eje-texto">${esc(nombreMes(d.mes))}</text>`;
  });
  $("#flow-grafico").innerHTML = svg;
  $("#flow-grafico").setAttribute("viewBox", `0 0 ${w} ${h}`);
  $("#flow-leyenda").innerHTML = etapas.map((et, j) => `<li><i style="--c:${tonos[j]}"></i>${esc(et.nombre)}</li>`).join("");
  const totales = datos.map(d => d.partes.reduce((a, b) => a + b, 0));
  const pico = totales.indexOf(Math.max(...totales));
  const convIni = datos[0].partes[0] / totales[0], convPico = datos[pico].partes[0] / totales[pico];
  $("#flow-grafico-lectura").innerHTML = `<span class="ad-lectura__k">Lectura</span><p>${esc(`La inversión se concentra entre ${nombreMes(meses[1])} y ${nombreMes(meses[2])}, antes del cierre de inscripciones. Conversión pasa de ${pct(convIni)} del mes en ${nombreMes(meses[0])} a ${pct(convPico)} en ${nombreMes(meses[pico])}: primero instalamos la convocatoria y después capturamos.`)}</p>`;
  $("#flow-grafico-tabla").innerHTML = `<thead><tr><th scope="col">Mes</th>${etapas.map(e => `<th scope="col" class="valor">${esc(e.nombre)}</th>`).join("")}<th scope="col" class="valor">Total</th></tr></thead><tbody>${datos.map(d =>
    `<tr><th scope="row">${esc(mesLargo.format(fecha(d.mes + "-01")))}</th>${d.partes.map(v => `<td class="valor">${pesos(v)}</td>`).join("")}<td class="valor">${pesos(d.partes.reduce((a, b) => a + b, 0))}</td></tr>`).join("")}</tbody>`;
}

/* ---------- forecast por programa ---------- */
function renderProgramas(r) {
  const nivel = $("#flow-nivel").value;
  const xs = r.progs.filter(x => !nivel || x.p.nivel === nivel);
  const errores = lineas.filter(l => l.etapa === "conversion").map(l => {
    const suma = programas.reduce((s, p) => s + (p.reparto[l.id] || 0), 0);
    return Math.abs(suma - 1) > 0.001 ? `${l.medio} · ${l.tactica} reparte ${pct(suma)}` : null;
  }).filter(Boolean);
  $("#flow-programas-filas").innerHTML = xs.map(x => `<tr>
    <th scope="row">${esc(x.p.nombre)}</th>
    <td>${esc(x.p.nivel)}</td>
    <td class="valor">${pesos(x.inversion)}</td>
    <td class="valor">${numero(x.leads)}</td>
    <td class="valor">${pesos(x.leads > 0 ? x.inversion / x.leads : null)}</td>
    <td class="valor">${pct(x.p.tasa * r.esc.factorTasa, 1)}</td>
    <td class="valor">${numero(x.matriculas)}</td>
    <td class="valor">${numero(x.p.meta)}</td>
    <td class="valor">${x.cumplimiento !== null && x.cumplimiento >= 1 ? `<span class="ad-estado ad-estado--ok">${pct(x.cumplimiento)}</span>` : pct(x.cumplimiento)}</td>
  </tr>`).join("");
  const sum = k => xs.reduce((s, x) => s + (x[k] || 0), 0);
  const meta = xs.reduce((s, x) => s + (x.p.meta || 0), 0);
  $("#flow-programas-pie").innerHTML = `<tr><th scope="row" colspan="2">Total ${nivel ? nivel.toLowerCase() : "de la selección"}</th>
    <td class="valor">${pesos(sum("inversion"))}</td><td class="valor">${numero(sum("leads"))}</td>
    <td class="valor">${pesos(sum("leads") > 0 ? sum("inversion") / sum("leads") : null)}</td><td class="valor">—</td>
    <td class="valor">${numero(sum("matriculas"))}</td><td class="valor">${numero(meta)}</td>
    <td class="valor">${pct(meta > 0 ? sum("matriculas") / meta : null)}</td></tr>`;
  $("#flow-programas-aviso").hidden = !errores.length;
  $("#flow-programas-aviso").textContent = errores.length ? "Reparto incompleto: " + errores.join(" · ") + ". Cada línea debe sumar 100 %." : "";
  $("#flow-programas-caption").textContent = `Escenario ${r.esc.nombre.toLowerCase()}. CPL del programa = inversión ÷ leads según su mezcla de medios. Matrículas = leads × tasa del nivel.`;
}

/* ---------- escenarios ---------- */
function renderEscenarios() {
  const activo = escenarioActivo;
  const rs = escenarios.map(calcular);
  $("#flow-escenarios-tarjetas").innerHTML = rs.map((r, i) => `<li class="ad-card flow-escenario${r.esc.id === activo ? " is-on" : ""}">
    <p class="ad-card__n">0${i + 1}</p>
    <h3 class="flow-escenario__n">${esc(r.esc.nombre)}</h3>
    <dl>
      <div><dt>Condición</dt><dd>${esc(r.esc.condicion)}</dd></div>
      <div><dt>Señal que lo activa</dt><dd>${esc(r.esc.senal)}</dd></div>
      <div><dt>Respuesta</dt><dd>${esc(r.esc.respuesta)}</dd></div>
    </dl>
  </li>`).join("");
  const filas = [
    ["Inversión", r => millones(r.inversion)],
    ["Costo supuesto de conversión", r => r.esc.factorCosto === 1 ? "Igual al histórico" : (r.esc.factorCosto < 1 ? "−" : "+") + pct(Math.abs(r.esc.factorCosto - 1))],
    ["Leads proyectados", r => numero(r.leads)],
    ["CPL promedio", r => pesos(r.cpl)],
    ["Matrículas estimadas", r => numero(r.matriculas)],
    ["Cumplimiento de meta", r => pct(r.cumplimiento)]
  ];
  $("#flow-escenarios-tabla").innerHTML = `<caption>Mismo plan de medios leído con tres condiciones. La reserva rinde a un costo ${pct(plan.costoMarginal - 1)} mayor que el promedio.</caption>
    <thead><tr><th scope="col">Indicador</th>${rs.map(r => `<th scope="col" class="valor">${esc(r.esc.nombre)}</th>`).join("")}</tr></thead>
    <tbody>${filas.map(([t, f]) => `<tr><th scope="row">${t}</th>${rs.map(r => `<td class="valor">${f(r)}</td>`).join("")}</tr>`).join("")}</tbody>`;
}

/* ---------- supuestos, reglas y pasos ---------- */
function renderSupuestos() {
  $("#flow-supuestos").innerHTML = supuestos.map(s => `<tr>
    <th scope="row">${esc(s.nombre)}</th>
    <td class="valor">${s.valor === null ? SIN_DATO : esc(s.valor)}</td>
    <td>${esc(s.fuente)}</td>
    <td><span class="ad-estado ad-estado--${({ "Estimado": "pendiente", "En verificación": "parcial" })[s.estado] || "sin"}">${esc(s.estado)}</span></td>
  </tr>`).join("");
  $("#flow-reglas").innerHTML = reglas.map((t, i) => `<li class="ad-paso"><span class="ad-n">${i + 1}</span><p>${esc(t)}</p></li>`).join("");
  $("#flow-pasos").innerHTML = pasos.map(p => `<tr><th scope="row">${esc(p.accion)}</th><td>${esc(p.responsable)}</td><td>${diaMes.format(fecha(p.fecha))} ${p.fecha.slice(0, 4)}</td><td>${esc(p.criterio)}</td></tr>`).join("");
}

renderPortada();
renderCalendario();
renderGrafico();
renderEscenarios();
renderSupuestos();
renderResumen();
document.querySelectorAll("[data-escenario]").forEach(b => b.addEventListener("click", () => {
  escenarioActivo = b.dataset.escenario;
  renderResumen();
  renderEscenarios();
}));
$("#flow-nivel").addEventListener("change", renderResumen);
