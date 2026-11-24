"use strict";

/* ==========================================================================
   Seguimiento de inversión · datos de la plantilla
   --------------------------------------------------------------------------
   REEMPLAZAR CON LOS DATOS DEL CLIENTE. Todo lo que se ve sale de este bloque.
   - Montos en la moneda de `corte.moneda`, sin separadores.
   - Una fila = una asignación de presupuesto (campaña o línea del flow), sin solapes.
   - asignado: null  -> gasto fuera de plan (no entra al pacing, se reporta aparte).
   - gasto: null     -> «Sin dato» (la fuente no respondió).
   - curva: proporción esperada al corte si el plan no es lineal (0,45 = 45 %).
   - parcial: texto si la fuente llega con rezago o incompleta.
   - Debe cuadrar con seguimiento-inversion.xlsx y con `bitacora inversion` de
     Media Bridge cuando el cliente tenga presupuesto en su perfil.
   ========================================================================== */
const corte = {
  cliente: "Universidad Andina",
  periodo: "Abril 2027",
  inicio: "2027-04-01",
  fin: "2027-04-30",
  fecha: "2027-04-15",         // último día incluido en el gasto (Media Bridge: hasta ayer)
  moneda: "COP",
  plan: "UNIVERSIDAD-ANDINA_FLOW_Inscripciones 2027-2_01-02-27_V01",
  fuente: "APIs de Meta, Google Ads, TikTok y LinkedIn vía Media Bridge · programática: reporte del proveedor",
  actualizado: "2027-04-16 08:00"
};

const asignaciones = [
  { producto: "Marca", plataforma: "Meta Ads", campana: "RECONOCIMIENTO_Marca_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 6000000, asignado: 6000000, gasto: 3150000, curva: null, responsable: "Paid Media", accion: "Mantener" },
  { producto: "Marca", plataforma: "Google Ads", campana: "CONSIDERACION_YouTube_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 5000000, asignado: 5000000, gasto: 1400000, curva: null, responsable: "Paid Media", accion: "Ampliar segmentos de intención" },
  { producto: "Marca", plataforma: "Programática", campana: "CONSIDERACION_Display_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 4000000, asignado: 4000000, gasto: 2050000, curva: null, responsable: "Proveedor programático", accion: "Mantener", parcial: "Reporte del proveedor hasta el 14 de abril" },
  { producto: "Pregrado", plataforma: "Meta Ads", campana: "CONVERSION_Pregrado_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 12000000, asignado: 12000000, gasto: 6900000, curva: null, responsable: "Paid Media", accion: "Bajar el diario a $340.000" },
  { producto: "Pregrado", plataforma: "Google Ads", campana: "CONVERSION_Search-Pregrado_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 9000000, asignado: 9000000, gasto: 4350000, curva: null, responsable: "Paid Media", accion: "Mantener" },
  { producto: "Pregrado", plataforma: "TikTok Ads", campana: "CONVERSION_Pregrado_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 8000000, asignado: 8000000, gasto: 2600000, curva: null, responsable: "Paid Media", accion: "Revisar aprobación de anuncios y subir puja" },
  { producto: "Posgrado", plataforma: "Meta Ads", campana: "CONVERSION_Posgrado_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 4000000, asignado: 4000000, gasto: 1950000, curva: null, responsable: "Paid Media", accion: "Mantener" },
  { producto: "Posgrado", plataforma: "Google Ads", campana: "CONVERSION_Search-Posgrado_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 5000000, asignado: 5000000, gasto: 2300000, curva: 0.45, responsable: "Paid Media", accion: "Curva aprobada: más peso antes de la feria" },
  { producto: "Posgrado", plataforma: "LinkedIn Ads", campana: "CONVERSION_Posgrado_CO_2027-2", inicio: "2027-04-01", fin: "2027-04-30",
    aprobado: 5000000, asignado: 5000000, gasto: 2480000, curva: null, responsable: "Paid Media", accion: "Mantener" },
  { producto: "Marca", plataforma: "Meta Ads", campana: "CONVERSION_Feria-admisiones_CO_2027-04", inicio: "2027-04-10", fin: "2027-04-17",
    aprobado: null, asignado: null, gasto: 620000, curva: null, responsable: "Paid Media", accion: "Definir si sale de la reserva" }
];

// Gasto diario total de las asignaciones con plan (para la curva acumulada). Suma = gasto con plan.
const gastoDiario = [1640000, 1710000, 1820000, 1790000, 1680000, 1590000, 1750000,
  1860000, 1920000, 1830000, 1760000, 1880000, 1900000, 1810000, 2240000];

// Meses cerrados (y el mes en curso al corte). gasto del mes en curso = al corte.
const historico = [
  { mes: "2027-01", presupuesto: 30000000, gasto: 29100000 },
  { mes: "2027-02", presupuesto: 42000000, gasto: 43500000 },
  { mes: "2027-03", presupuesto: 55000000, gasto: 53900000 }
];

// Puntos para revisar. prioridad P1 (ahora) a P3 (siguiente corte).
const puntos = [
  { prioridad: "P1", titulo: "TikTok va a un tercio del ritmo",
    evidencia: "Lleva $2.600.000 de $4.000.000 esperados al 15 de abril. Necesita $360.000 diarios hasta el cierre; hoy gasta $173.333.",
    responsable: "Paid Media", fecha: "2027-04-17", criterio: "Gasto diario sobre $330.000 durante tres días" },
  { prioridad: "P2", titulo: "Meta pregrado se adelantó al plan",
    evidencia: "Gastó $6.900.000 contra $6.000.000 esperados. Al ritmo actual cierra en $13.800.000, $1.800.000 sobre lo asignado.",
    responsable: "Paid Media", fecha: "2027-04-17", criterio: "Proyección de cierre dentro de ±5 % de lo asignado" },
  { prioridad: "P3", titulo: "La campaña de la feria no tiene flow",
    evidencia: "Gastó $620.000 entre el 10 y el 15 de abril sin asignación. Si sale de la reserva, se registra en el flow V02.",
    responsable: "Cuentas", fecha: "2027-04-19", criterio: "Asignación aprobada por el cliente y cargada en el libro" }
];

// Semáforo (operacion-tactica.html 26 y alertas 30—33): desviación absoluta del pacing.
const umbrales = { normal: 0.05, observacion: 0.15, accion: 0.30 };

/* ==========================================================================
   Lógica. Mismas fórmulas que seguimiento-inversion.xlsx.
   ========================================================================== */
const entero = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0, useGrouping: "always" });
const decimal = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: "always" });
const diaMes = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "UTC" });
const mesLargo = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric", timeZone: "UTC" });
const SIN_DATO = "Sin dato";
const NO_APLICA = "No aplica";
const pesos = v => Number.isFinite(v) ? (v < 0 ? "−$" : "$") + entero.format(Math.round(Math.abs(v))) : SIN_DATO;
const signo = v => Number.isFinite(v) ? (v >= 0 ? "+" : "−") + "$" + entero.format(Math.round(Math.abs(v))) : SIN_DATO;
const millones = v => Number.isFinite(v) ? "$" + decimal.format(v / 1e6) + " M" : SIN_DATO;
const pct = (v, dec = 0) => Number.isFinite(v)
  ? new Intl.NumberFormat("es-CO", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v * 100) + " %" : SIN_DATO;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fecha = s => new Date(s + "T00:00:00Z");
const DIA = 86400000;
const $ = sel => document.querySelector(sel);

// Días inclusivos, como el libro: transcurridos = corte − inicio + 1.
function medir(a) {
  const ini = fecha(a.inicio), fin = fecha(a.fin), c = fecha(corte.fecha);
  const dias = Math.round((fin - ini) / DIA) + 1;
  const trans = c < ini ? 0 : Math.min(dias, Math.round((c - ini) / DIA) + 1);
  const restantes = dias - trans;
  const prop = trans === 0 ? 0 : trans >= dias ? 1 : (Number.isFinite(a.curva) ? a.curva : trans / dias);
  const conPlan = Number.isFinite(a.asignado);
  const tieneGasto = Number.isFinite(a.gasto);
  const esperado = conPlan ? a.asignado * prop : null;
  const desvio = conPlan && tieneGasto ? a.gasto - esperado : null;
  const pacing = conPlan && tieneGasto && esperado > 0 ? a.gasto / esperado : null;
  const saldo = conPlan && tieneGasto ? a.asignado - a.gasto : null;
  const diario = tieneGasto && trans > 0 ? a.gasto / trans : null;
  const requerido = conPlan && saldo !== null && restantes > 0 ? Math.max(0, saldo) / restantes : null;
  const proyeccion = !tieneGasto || trans === 0 ? null : trans >= dias ? a.gasto : prop > 0 ? a.gasto / prop : null;
  return { a, dias, trans, restantes, esperado, desvio, pacing, saldo, diario, requerido, proyeccion,
    ejecutado: conPlan && tieneGasto && a.asignado > 0 ? a.gasto / a.asignado : null,
    ritmo: prop, estado: estado(a, pacing, trans) };
}

function estado(a, pacing, trans) {
  if (!Number.isFinite(a.asignado)) return { id: "fuera", txt: "Fuera de plan" };
  if (!Number.isFinite(a.gasto)) return { id: "sin-dato", txt: SIN_DATO };
  if (trans === 0) return { id: "sin-iniciar", txt: "Sin iniciar" };
  if (!Number.isFinite(pacing)) return { id: "sin-dato", txt: SIN_DATO };
  const d = Math.abs(pacing - 1);
  const sentido = pacing > 1 ? " · sobreconsumo" : pacing < 1 ? " · subconsumo" : "";
  if (d <= umbrales.normal) return { id: "normal", txt: "Normal" };
  if (d <= umbrales.observacion) return { id: "observacion", txt: "Observación" + sentido };
  if (d <= umbrales.accion) return { id: "accion", txt: "Acción" + sentido };
  return { id: "critico", txt: "Crítico" + sentido };
}

// Agregado: pacing = gasto agregado ÷ esperado agregado (no promedio de pacings).
function agregar(ms) {
  const plan = ms.filter(m => Number.isFinite(m.a.asignado));
  const s = k => plan.reduce((t, m) => t + (Number.isFinite(m[k]) ? m[k] : 0), 0);
  const asignado = plan.reduce((t, m) => t + m.a.asignado, 0);
  const gasto = plan.reduce((t, m) => t + (m.a.gasto || 0), 0);
  const esperado = s("esperado");
  const pacing = esperado > 0 ? gasto / esperado : null;
  const proyeccion = s("proyeccion");
  return { asignado, gasto, esperado, pacing, desvio: gasto - esperado, saldo: asignado - gasto,
    diario: s("diario"), requerido: s("requerido"), proyeccion, ejecutado: asignado > 0 ? gasto / asignado : null,
    ritmo: asignado > 0 ? esperado / asignado : null,
    estado: estado({ asignado, gasto }, pacing, 1), incompleto: plan.some(m => !Number.isFinite(m.a.gasto)) };
}

const medidas = asignaciones.map(medir);
const total = agregar(medidas);
const fuera = medidas.filter(m => m.estado.id === "fuera");
const gastoFuera = fuera.reduce((t, m) => t + (m.a.gasto || 0), 0);
const dur = medidas[0] ? Math.round((fecha(corte.fin) - fecha(corte.inicio)) / DIA) + 1 : 0;
const transc = Math.min(dur, Math.round((fecha(corte.fecha) - fecha(corte.inicio)) / DIA) + 1);

// Semáforo → .ad-estado (la lima es solo para lo normal; la gravedad crece hacia «alerta»).
const ESTADO_AD = { normal: "ok", observacion: "parcial", accion: "pendiente", critico: "alerta", fuera: "sin", "sin-dato": "sin", "sin-iniciar": "na" };
const chip = e => `<span class="ad-estado ad-estado--${ESTADO_AD[e.id] || "sin"}">${esc(e.txt)}</span>`;
// Barra de ejecución (.ad-barra): relleno = ejecutado, raya = ritmo esperado a hoy. destacada = lima.
const medidor = (ejec, ritmo, destacada) => `<span class="ad-barra seg-barra${destacada ? " ad-barra--on" : ""}" style="--v:${Math.min(100, (ejec || 0) * 100)}%;--meta:${Math.min(100, (ritmo || 0) * 100)}%" aria-hidden="true"><span></span><i></i></span>`;

function renderPortada() {
  $("#seg-cliente").textContent = corte.cliente;
  $("#seg-periodo").textContent = corte.periodo + ", al " + diaMes.format(fecha(corte.fecha)).replace(".", "") + ".";
  $("#seg-corte").textContent = diaMes.format(fecha(corte.fecha)) + " " + corte.fecha.slice(0, 4) + " · día " + transc + " de " + dur + " (el mes va al " + pct(transc / dur) + ")";
  $("#seg-plan").textContent = corte.plan;
  $("#seg-fuente").textContent = corte.fuente;
  $("#seg-actualizado").textContent = corte.actualizado;
  $("#seg-moneda").textContent = corte.moneda;
  $("#seg-lectura").textContent = `Llevamos ${millones(total.gasto)} de ${millones(total.asignado)}: ${pct(total.pacing)} de lo esperado a hoy. ` +
    `Al ritmo actual cerramos en ${millones(total.proyeccion)}, ${pct(total.proyeccion / total.asignado)} de lo asignado` +
    (gastoFuera ? `, y hay ${millones(gastoFuera)} fuera de plan.` : ".");
}

function renderKpi() {
  $("#seg-kpi").innerHTML = [
    { t: "Asignado del mes", v: millones(total.asignado), s: "suma de asignaciones con plan" },
    { t: "Gasto al corte", v: millones(total.gasto), s: pct(total.ejecutado) + " ejecutado" + (gastoFuera ? " · " + millones(gastoFuera) + " fuera de plan" : "") },
    { t: "Esperado al corte", v: millones(total.esperado), s: "ritmo esperado " + pct(total.ritmo) },
    { t: "Pacing", v: pct(total.pacing, 1), s: "desvío " + signo(total.desvio) + " · " + total.estado.txt },
    { t: "Proyección de cierre", v: millones(total.proyeccion), s: signo(total.proyeccion - total.asignado) + " vs. asignado", lima: true },
    { t: "Diario requerido", v: pesos(total.requerido), s: "hoy " + pesos(total.diario) + " por día" }
  ].map(k => `<div class="ad-kpi${k.lima ? " ad-kpi--on" : ""}"><span class="ad-kpi__l">${k.t}</span><span class="ad-kpi__n">${k.v}</span><span class="ad-kpi__m">${esc(k.s)}</span></div>`).join("");
  if (total.incompleto) $("#seg-kpi-nota").textContent = "Hay asignaciones sin dato de gasto: los totales son parciales.";
}

/* Curva acumulada: real, esperado lineal, proyección y presupuesto. SVG propio. */
function renderCurva() {
  const w = 720, h = 300, m = { t: 20, r: 16, b: 34, l: 64 };
  const conPlan = medidas.filter(x => Number.isFinite(x.a.asignado));
  const asign = total.asignado;
  const acum = [];
  gastoDiario.reduce((s, v, i) => (acum[i] = s + v), 0);
  const tope = Math.max(asign, total.proyeccion || 0) * 1.08;
  const x = d => m.l + (w - m.l - m.r) * (d / dur);
  const y = v => m.t + (h - m.t - m.b) * (1 - v / tope);
  let svg = "";
  const paso = Math.pow(10, Math.floor(Math.log10(tope))) / 2;
  for (let v = 0; v <= tope; v += paso) svg += `<line class="eje-linea" x1="${m.l}" x2="${w - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="eje-texto" x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${millones(v)}</text>`;
  [1, 8, 15, 22, dur].forEach(d => { svg += `<text class="eje-texto" x="${x(d)}" y="${h - m.b + 20}" text-anchor="middle">día ${d}</text>`; });
  // esperado: suma de las curvas de cada asignación por día (lineal o curva declarada al corte)
  // con curva declarada, la línea pasa por la proporción del corte y llega al 100 % al cierre
  const propDia = (q, d) => !Number.isFinite(q.a.curva) || transc <= 0 || transc >= dur ? d / dur
    : d <= transc ? q.a.curva * d / transc : q.a.curva + (1 - q.a.curva) * (d - transc) / (dur - transc);
  const esperadoDia = d => conPlan.reduce((s, q) => s + q.a.asignado * propDia(q, d), 0);
  const ptsEsp = Array.from({ length: dur + 1 }, (_, d) => `${x(d)},${y(esperadoDia(d))}`).join(" ");
  svg += `<line class="seg-presupuesto" x1="${m.l}" x2="${w - m.r}" y1="${y(asign)}" y2="${y(asign)}"/><text class="eje-valor" x="${w - m.r}" y="${y(asign) - 6}" text-anchor="end">Asignado ${millones(asign)}</text>`;
  svg += `<polyline class="seg-esperado" points="${m.l},${y(0)} ${ptsEsp}"/>`;
  const ultimo = acum[acum.length - 1] || 0;
  svg += `<polyline class="seg-proyeccion" points="${x(acum.length)},${y(ultimo)} ${x(dur)},${y(total.proyeccion)}"/>`;
  svg += `<polyline class="seg-real" points="${x(0)},${y(0)} ${acum.map((v, i) => `${x(i + 1)},${y(v)}`).join(" ")}"/>`;
  svg += `<circle cx="${x(acum.length)}" cy="${y(ultimo)}" r="4" class="seg-punto"/><text class="eje-valor" x="${x(acum.length) + 8}" y="${y(ultimo) + 16}">${millones(ultimo)} al corte</text>`;
  svg += `<text class="eje-valor" x="${x(dur) - 4}" y="${y(total.proyeccion) + 16}" text-anchor="end">Cierre ${millones(total.proyeccion)}</text>`;
  const el = $("#seg-curva");
  el.setAttribute("viewBox", `0 0 ${w} ${h}`);
  el.insertAdjacentHTML("beforeend", svg);
  const cuadra = Math.abs(ultimo - total.gasto) < 1;
  $("#seg-curva-nota").textContent = cuadra ? "" : `La serie diaria suma ${pesos(ultimo)} y el gasto con plan ${pesos(total.gasto)}: revisa la serie antes de entregar.`;
  $("#seg-curva-lectura").textContent = `El gasto acumulado va ${total.desvio < 0 ? "por debajo" : "por encima"} de la línea esperada por ${pesos(Math.abs(total.desvio))}. La diferencia se concentra en pocas campañas; la tabla por campaña dice cuáles.`;
}

function renderMedios() {
  const plats = [...new Set(medidas.filter(m => Number.isFinite(m.a.asignado)).map(m => m.a.plataforma))];
  const filas = plats.map(p => ({ p, g: agregar(medidas.filter(m => m.a.plataforma === p)) }))
    .sort((a, b) => b.g.asignado - a.g.asignado);
  const mayor = filas.reduce((m, f) => (Math.abs(f.g.desvio) > Math.abs(m.g.desvio) ? f : m), filas[0]);
  $("#seg-medios").innerHTML = filas.map(({ p, g }) => `<tr${filas.length > 1 && mayor.p === p ? ' class="is-on"' : ""}>
    <th scope="row">${esc(p)}</th>
    <td class="valor">${pesos(g.asignado)}</td><td class="valor">${pesos(g.gasto)}</td>
    <td class="seg-col-medidor">${medidor(g.ejecutado, g.ritmo)}<span class="seg-medidor__n">${pct(g.ejecutado)}</span></td>
    <td class="valor">${pct(g.pacing, 1)}</td><td class="valor">${pesos(g.proyeccion)}</td><td>${chip(g.estado)}</td></tr>`).join("");
}

function poblarFiltros() {
  const opciones = (sel, vals) => { sel.insertAdjacentHTML("beforeend", vals.map(v => `<option>${esc(v)}</option>`).join("")); };
  opciones($("#seg-f-plataforma"), [...new Set(asignaciones.map(a => a.plataforma))]);
  opciones($("#seg-f-producto"), [...new Set(asignaciones.map(a => a.producto))]);
}

function renderControl() {
  const fp = $("#seg-f-plataforma").value, fr = $("#seg-f-producto").value, fe = $("#seg-f-estado").value;
  const visibles = medidas.filter(m => (!fp || m.a.plataforma === fp) && (!fr || m.a.producto === fr) &&
    (!fe || (fe === "revisar" ? !["normal"].includes(m.estado.id) : m.estado.id === fe)));
  const productos = [...new Set(visibles.map(m => m.a.producto))];
  // La lima marca la campaña con mayor desvío (solo si hay plan y más de una fila).
  const conDesvio = visibles.filter(m => m.desvio !== null);
  const mayorDesvio = conDesvio.length > 1 ? conDesvio.reduce((a, b) => (Math.abs(b.desvio) > Math.abs(a.desvio) ? b : a)) : null;
  const celdas = m => `
    <td class="valor">${m.a.asignado === null ? NO_APLICA : pesos(m.a.asignado)}</td>
    <td class="valor">${pesos(m.a.gasto)}${m.a.parcial ? `<span class="seg-parcial">Parcial</span>` : ""}</td>
    <td class="valor">${m.esperado === null ? NO_APLICA : pesos(m.esperado)}${Number.isFinite(m.a.curva) ? `<span class="seg-parcial">curva ${pct(m.a.curva)}</span>` : ""}</td>
    <td class="valor">${m.desvio === null ? NO_APLICA : signo(m.desvio)}</td>
    <td class="valor">${m.pacing === null ? NO_APLICA : pct(m.pacing, 1)}</td>
    <td class="valor">${m.saldo === null ? NO_APLICA : pesos(m.saldo)}</td>
    <td class="valor">${pesos(m.diario)}</td>
    <td class="valor">${m.requerido === null ? NO_APLICA : pesos(m.requerido)}</td>
    <td class="valor">${pesos(m.proyeccion)}</td>
    <td>${chip(m.estado)}</td>`;
  let html = "";
  productos.forEach(p => {
    const ms = visibles.filter(m => m.a.producto === p);
    const g = agregar(ms);
    html += `<tr class="seg-producto"><th scope="row">${esc(p)}<span class="flow-sub">producto · decide</span></th><td></td>
      <td class="valor">${pesos(g.asignado)}</td><td class="valor">${pesos(g.gasto)}</td><td class="valor">${pesos(g.esperado)}</td>
      <td class="valor">${signo(g.desvio)}</td><td class="valor">${pct(g.pacing, 1)}</td><td class="valor">${pesos(g.saldo)}</td>
      <td class="valor">${pesos(g.diario)}</td><td class="valor">${pesos(g.requerido)}</td><td class="valor">${pesos(g.proyeccion)}</td>
      <td>${g.asignado ? chip(g.estado) : ""}</td><td></td></tr>`;
    html += ms.map(m => `<tr${m === mayorDesvio ? ' class="is-on"' : ""}>
      <th scope="row" class="seg-campana">${esc(m.a.campana)}<span class="flow-sub">${diaMes.format(fecha(m.a.inicio))}–${diaMes.format(fecha(m.a.fin))} · ${esc(m.a.responsable)}${m.a.parcial ? " · " + esc(m.a.parcial) : ""}</span></th>
      <td>${esc(m.a.plataforma)}</td>${celdas(m)}<td class="seg-accion">${esc(m.a.accion || "")}</td></tr>`).join("");
  });
  $("#seg-control").innerHTML = html || `<tr><td colspan="13">No hay asignaciones con estos filtros.</td></tr>`;
  const g = agregar(visibles);
  $("#seg-control-pie").innerHTML = `<tr><th scope="row" colspan="2">Total con plan de la selección</th>
    <td class="valor">${pesos(g.asignado)}</td><td class="valor">${pesos(g.gasto)}</td><td class="valor">${pesos(g.esperado)}</td>
    <td class="valor">${signo(g.desvio)}</td><td class="valor">${pct(g.pacing, 1)}</td><td class="valor">${pesos(g.saldo)}</td>
    <td class="valor">${pesos(g.diario)}</td><td class="valor">${pesos(g.requerido)}</td><td class="valor">${pesos(g.proyeccion)}</td><td>${g.asignado ? chip(g.estado) : ""}</td><td></td></tr>`;
}

function renderHistorico() {
  const filas = historico.map(h => ({ ...h, abierto: false }))
    .concat([{ mes: corte.inicio.slice(0, 7), presupuesto: total.asignado, gasto: total.gasto + gastoFuera, abierto: true }]);
  $("#seg-historico").innerHTML = filas.map(h => {
    const ej = h.presupuesto > 0 && Number.isFinite(h.gasto) ? h.gasto / h.presupuesto : null;
    return `<tr><th scope="row">${esc(mesLargo.format(fecha(h.mes + "-01")))}${h.abierto ? `<span class="flow-sub">en curso, al corte</span>` : ""}</th>
      <td class="valor">${pesos(h.presupuesto)}</td><td class="valor">${pesos(h.gasto)}</td>
      <td class="seg-col-medidor">${medidor(ej, h.abierto ? transc / dur : 1, h.abierto)}<span class="seg-medidor__n">${pct(ej)}</span></td>
      <td class="valor">${h.abierto ? NO_APLICA : signo(h.gasto - h.presupuesto)}</td></tr>`;
  }).join("");
}

function renderPuntos() {
  $("#seg-puntos").innerHTML = puntos.map((p, i) => `<li class="ad-card seg-punto-item${i === 0 ? " is-on" : ""}">
    <p class="seg-punto-item__t"><span class="ad-n${i === 0 ? " ad-n--on" : ""}">${esc(p.prioridad)}</span>${esc(p.titulo)}</p>
    <p class="ad-card__d">${esc(p.evidencia)}</p>
    <p class="ad-card__d">${esc(p.responsable)} · ${diaMes.format(fecha(p.fecha))} · criterio: ${esc(p.criterio)}</p>
  </li>`).join("");
  $("#seg-umbrales").textContent = `Normal hasta ±${pct(umbrales.normal)} de desviación del pacing; observación hasta ±${pct(umbrales.observacion)}; acción hasta ±${pct(umbrales.accion)}; crítico por encima.`;
}

renderPortada();
renderKpi();
renderCurva();
renderMedios();
poblarFiltros();
renderControl();
renderHistorico();
renderPuntos();
["#seg-f-plataforma", "#seg-f-producto", "#seg-f-estado"].forEach(s => $(s).addEventListener("change", renderControl));
