"use strict";
/* ============================================================================
   Tablero de seguimiento · banco de formatos de Adcom · sistema v2
   ----------------------------------------------------------------------------
   Tres partes, en este orden:
     1. DATOS            Reemplazar con los datos del cliente.
     2. CONEXIÓN A HOJA  Opcional: leer las pestañas de una hoja de Google en
                         vez de los datos embebidos (como los tableros reales).
     3. LÓGICA           Cálculo y dibujo. No se toca para cambiar de cliente.

   Todo lo que se muestra sale de cinco tablas con el mismo formato que las
   pestañas de la hoja de un tablero real:
     filas      (EMBUDO)    una fila por día · programa · medio
     fuentes    (FUENTES)   leads y matriculados del CRM de otras fuentes
     metas      (METAS)     presupuesto y metas del periodo por programa
     mensual    (MENSUAL)   curva mensual de presupuesto y leads por nivel
     branding   (BRANDING)  campañas de marca y eventos, fuera del embudo
   ========================================================================= */


/* ============================================================================
   1. DATOS · Reemplazar con los datos del cliente
   ----------------------------------------------------------------------------
   Cifras ficticias de «Universidad Andina». No hay nombres reales, IDs de
   cuenta ni enlaces a hojas o tableros de clientes: no los pongas aquí si el
   repositorio es público.
   ========================================================================= */
const DATOS = {
  cliente: "Universidad Andina",
  tablero: "Tablero de pauta",
  moneda: "COP",
  // Periodo académico que siguen las metas. Los rangos rápidos y el botón de meta usan este periodo.
  periodo: { id: "2027-1", inicio: "2026-09-01", fin: "2027-02-28" },
  // Fecha del dato más reciente. En un tablero conectado es el día de la última carga.
  corte: "2027-02-14",
  actualizado: "14 feb 2027, 06:10",
  // Acción que cuenta como resultado: se repite en el pie del tablero.
  resultado: "Lead CRM: aspirante creado en el CRM con fuente de pauta",

  // Estado de cada fuente (pestaña LOG en la hoja real). estado: "Al día" | "Parcial" | "Sin dato".
  estadoFuentes: [
    { fuente: "Meta, Google Ads, TikTok, LinkedIn", corte: "14 feb 06:00", estado: "Al día" },
    { fuente: "Programática", corte: "10 feb", estado: "Parcial" },
    { fuente: "CRM de admisiones", corte: "14 feb 05:30", estado: "Al día" },
    { fuente: "Metas del periodo", corte: "25 ago 2026", estado: "Al día" }
  ],

  // Etapas que mide cada nivel en el CRM. Una etapa en false se muestra como «No aplica»
  // y queda fuera de las tasas del embudo (no se cuenta como cero).
  etapas: {
    "Pregrado": { inscritos: true, admitidos: true },
    "Posgrado": { inscritos: true, admitidos: true },
    "Educación continua": { inscritos: false, admitidos: false }
  },

  medios: ["Meta", "Google Ads", "TikTok", "LinkedIn", "Programática"],
  medioEtiqueta: { "Meta": "Meta (Facebook e Instagram)" },

  // Catálogo: el programa es la llave que une filas y metas. El nombre debe ser idéntico en las dos.
  programas: [
    { programa: "Ingeniería de Sistemas", nivel: "Pregrado", facultad: "Ingeniería" },
    { programa: "Ingeniería Industrial", nivel: "Pregrado", facultad: "Ingeniería" },
    { programa: "Administración de Empresas", nivel: "Pregrado", facultad: "Ciencias Económicas" },
    { programa: "Contaduría Pública", nivel: "Pregrado", facultad: "Ciencias Económicas" },
    { programa: "Enfermería", nivel: "Pregrado", facultad: "Salud" },
    { programa: "Psicología", nivel: "Pregrado", facultad: "Salud" },
    { programa: "Diseño Gráfico", nivel: "Pregrado", facultad: "Comunicación y Diseño" },
    { programa: "Maestría en Administración", nivel: "Posgrado", facultad: "Ciencias Económicas" },
    { programa: "Especialización en Finanzas", nivel: "Posgrado", facultad: "Ciencias Económicas" },
    { programa: "Maestría en Analítica de Datos", nivel: "Posgrado", facultad: "Ingeniería" },
    { programa: "Especialización en Gerencia en Salud", nivel: "Posgrado", facultad: "Salud" },
    { programa: "Diplomado en Marketing Digital", nivel: "Educación continua", facultad: "Extensión" },
    { programa: "Curso de Excel Avanzado", nivel: "Educación continua", facultad: "Extensión" }
  ],

  // Metas del periodo por programa (pestaña METAS). Solo pauta de conversión: branding va aparte.
  metas: [
    { programa: "Ingeniería de Sistemas", presupuesto: 70100000, meta_leads: 2025, meta_matriculados: 121 },
    { programa: "Ingeniería Industrial", presupuesto: 50000000, meta_leads: 1462, meta_matriculados: 115 },
    { programa: "Administración de Empresas", presupuesto: 64100000, meta_leads: 2251, meta_matriculados: 148 },
    { programa: "Contaduría Pública", presupuesto: 37100000, meta_leads: 996, meta_matriculados: 79 },
    { programa: "Enfermería", presupuesto: 58800000, meta_leads: 1896, meta_matriculados: 136 },
    { programa: "Psicología", presupuesto: 66900000, meta_leads: 2024, meta_matriculados: 143 },
    { programa: "Diseño Gráfico", presupuesto: 33400000, meta_leads: 857, meta_matriculados: 55 },
    { programa: "Maestría en Administración", presupuesto: 75300000, meta_leads: 880, meta_matriculados: 52 },
    { programa: "Especialización en Finanzas", presupuesto: 36900000, meta_leads: 471, meta_matriculados: 39 },
    { programa: "Maestría en Analítica de Datos", presupuesto: 50400000, meta_leads: 599, meta_matriculados: 35 },
    { programa: "Especialización en Gerencia en Salud", presupuesto: 30100000, meta_leads: 392, meta_matriculados: 22 },
    { programa: "Diplomado en Marketing Digital", presupuesto: 20100000, meta_leads: 897, meta_matriculados: 99 },
    { programa: "Curso de Excel Avanzado", presupuesto: 13500000, meta_leads: 699, meta_matriculados: 62 }
  ],

  // Curva mensual del forecast por nivel (pestaña MENSUAL). Alimenta las metas de la vista mes a mes.
  mensual: [
    { mes: "2026-09", nivel: "Pregrado", presupuesto: 47000000, meta_leads: 1441 },
    { mes: "2026-09", nivel: "Posgrado", presupuesto: 23700000, meta_leads: 276 },
    { mes: "2026-09", nivel: "Educación continua", presupuesto: 4200000, meta_leads: 201 },
    { mes: "2026-10", nivel: "Pregrado", presupuesto: 61500000, meta_leads: 1890 },
    { mes: "2026-10", nivel: "Posgrado", presupuesto: 31400000, meta_leads: 378 },
    { mes: "2026-10", nivel: "Educación continua", presupuesto: 5400000, meta_leads: 269 },
    { mes: "2026-11", nivel: "Pregrado", presupuesto: 66700000, meta_leads: 2037 },
    { mes: "2026-11", nivel: "Posgrado", presupuesto: 33600000, meta_leads: 409 },
    { mes: "2026-11", nivel: "Educación continua", presupuesto: 5900000, meta_leads: 297 },
    { mes: "2026-12", nivel: "Pregrado", presupuesto: 55000000, meta_leads: 1688 },
    { mes: "2026-12", nivel: "Posgrado", presupuesto: 27900000, meta_leads: 336 },
    { mes: "2026-12", nivel: "Educación continua", presupuesto: 4800000, meta_leads: 228 },
    { mes: "2027-01", nivel: "Pregrado", presupuesto: 84900000, meta_leads: 2594 },
    { mes: "2027-01", nivel: "Posgrado", presupuesto: 42900000, meta_leads: 540 },
    { mes: "2027-01", nivel: "Educación continua", presupuesto: 7500000, meta_leads: 370 },
    { mes: "2027-02", nivel: "Pregrado", presupuesto: 65100000, meta_leads: 1967 },
    { mes: "2027-02", nivel: "Posgrado", presupuesto: 33100000, meta_leads: 408 },
    { mes: "2027-02", nivel: "Educación continua", presupuesto: 5700000, meta_leads: 278 }
  ],

  // Branding y eventos (pestaña BRANDING): mensual, no entra en el embudo ni en los costos por lead.
  branding: [
    { mes: "2026-09", campana: "Marca institucional", medio: "Meta", presupuesto: 6000000, inversion: 5880000, impresiones: 1960000, alcance: 742000, clics: 9800 },
    { mes: "2026-09", campana: "Marca institucional", medio: "Programática", presupuesto: 4000000, inversion: 3950000, impresiones: 2630000, alcance: null, clics: 3100 },
    { mes: "2026-10", campana: "Feria de programas", medio: "Meta", presupuesto: 5000000, inversion: 5010000, impresiones: 1540000, alcance: 611000, clics: 8700 },
    { mes: "2026-11", campana: "Marca institucional", medio: "Meta", presupuesto: 6000000, inversion: 5720000, impresiones: 1880000, alcance: 705000, clics: 9100 },
    { mes: "2026-11", campana: "Marca institucional", medio: "Programática", presupuesto: 4000000, inversion: 3990000, impresiones: 2710000, alcance: null, clics: 2950 },
    { mes: "2026-12", campana: "Marca institucional", medio: "Google Ads", presupuesto: 3000000, inversion: 2410000, impresiones: 980000, alcance: 402000, clics: 4100 },
    { mes: "2027-01", campana: "Open house", medio: "Meta", presupuesto: 7000000, inversion: 6940000, impresiones: 2240000, alcance: 830000, clics: 12400 },
    { mes: "2027-01", campana: "Open house", medio: "TikTok", presupuesto: 3000000, inversion: 2980000, impresiones: 1720000, alcance: 905000, clics: 5300 },
    { mes: "2027-02", campana: "Marca institucional", medio: "Meta", presupuesto: 6000000, inversion: 2650000, impresiones: 860000, alcance: 351000, clics: 4200 }
  ],

  // Filas diarias (pestaña EMBUDO). Formato de cada fila:
  //   { fecha: "2027-02-14", programa: "Psicología", medio: "Meta",
  //     inversion: 182000, leads_plataforma: 8, leads_crm: 6,
  //     inscritos: 1, admitidos: 1, matriculados: 0 }
  // null = el medio o el nivel no lo mide («Sin dato» o «No aplica»), 0 = se midió y fue cero.
  // Para un cliente real: reemplaza null por el arreglo de filas, o conecta la hoja (parte 2).
  filas: null,

  // Leads y matriculados del CRM que no vienen de pauta (pestaña FUENTES). Formato:
  //   { fecha: "2027-02-14", nivel: "Pregrado", fuente: "Orgánico", leads: 31, matriculados: 2 }
  // La fuente «Pauta» no se escribe aquí: sale de las filas.
  fuentes: null
};

/* Datos de ejemplo: generador determinista (mismas cifras en cada carga) para
   que la plantilla tenga meses, semanas y días con qué probar los filtros.
   En un tablero real se borra y se llenan DATOS.filas y DATOS.fuentes. */
function datosDeEjemplo(hasta) {
  let semilla = 20271;
  const azar = () => {
    semilla = (semilla + 0x6D2B79F5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const contar = x => Math.floor(x + azar()); // redondeo al azar: conserva el promedio
  // inversión diaria base y factor de costo de cada programa
  const BASE = {
    "Ingeniería de Sistemas": [420000, 1.05], "Ingeniería Industrial": [300000, .95],
    "Administración de Empresas": [380000, .9], "Contaduría Pública": [220000, 1.1],
    "Enfermería": [350000, .85], "Psicología": [400000, 1], "Diseño Gráfico": [200000, 1.2],
    "Maestría en Administración": [450000, 1.1], "Especialización en Finanzas": [220000, .9],
    "Maestría en Analítica de Datos": [300000, 1], "Especialización en Gerencia en Salud": [180000, .95],
    "Diplomado en Marketing Digital": [120000, 1], "Curso de Excel Avanzado": [80000, .9]
  };
  // [medio, parte de la inversión, costo por lead (plataforma; en programática, CRM), leads CRM por lead de plataforma]
  const MEZCLA = {
    "Pregrado": [["Meta", .45, 22000, .78], ["Google Ads", .30, 38000, .9], ["TikTok", .15, 18000, .62], ["Programática", .10, 90000, null]],
    "Posgrado": [["Meta", .35, 55000, .8], ["Google Ads", .35, 70000, .9], ["LinkedIn", .25, 110000, .86], ["Programática", .05, 160000, null]],
    "Educación continua": [["Meta", .6, 15000, .8], ["Google Ads", .4, 25000, .88]]
  };
  const MESES_P = ["09", "10", "11", "12", "01", "02"];
  const CURVA = [.7, .9, 1, .8, 1.25, 1.05];
  const MATRICULA = [.3, .34, .38, .42, .48, .52]; // matriculados por admitido: sube cerca del inicio de clases
  const TASAS = { "Pregrado": [.22, .75], "Posgrado": [.18, .8] };
  const filas = [], fuentes = [];
  for (let d = DATOS.periodo.inicio; d <= hasta; d = sumarDias(d, 1)) {
    const i = MESES_P.indexOf(d.slice(5, 7)), finde = [0, 6].includes(new Date(fechaUTC(d)).getUTCDay());
    const leadsNivel = {};
    for (const p of DATOS.programas) {
      const [base, factor] = BASE[p.programa];
      for (const [medio, parte, cpl, crm] of MEZCLA[p.nivel]) {
        const inversion = Math.round(base * CURVA[i] * (finde ? .85 : 1) * parte * (.8 + azar() * .4) / 100) * 100;
        const costo = cpl * factor * (.85 + azar() * .3);
        const lp = crm === null ? null : contar(inversion / costo);
        const lc = crm === null ? contar(inversion / costo) : contar(lp * crm);
        const t = TASAS[p.nivel];
        const ins = t ? contar(lc * t[0] * (.85 + .06 * i)) : null;
        const adm = t ? contar(ins * t[1]) : null;
        const mat = t ? contar(adm * MATRICULA[i]) : contar(lc * .1);
        filas.push({ fecha: d, programa: p.programa, medio, inversion, leads_plataforma: lp, leads_crm: lc, inscritos: ins, admitidos: adm, matriculados: mat });
        leadsNivel[p.nivel] = (leadsNivel[p.nivel] || 0) + lc;
      }
    }
    for (const [nivel, lc] of Object.entries(leadsNivel)) {
      const org = contar(lc * .55 * (.8 + azar() * .4)), otras = contar(lc * .3 * (.8 + azar() * .4));
      fuentes.push({ fecha: d, nivel, fuente: "Orgánico", leads: org, matriculados: contar(org * .05 * (.5 + .2 * i)) });
      fuentes.push({ fecha: d, nivel, fuente: "Otras fuentes", leads: otras, matriculados: contar(otras * .035 * (.5 + .2 * i)) });
    }
  }
  return { filas, fuentes };
}


/* ============================================================================
   2. CONEXIÓN OPCIONAL A UNA HOJA DE GOOGLE
   ----------------------------------------------------------------------------
   Los tableros publicados por cliente no embeben los datos: los leen de una
   hoja que un Apps Script actualiza cada hora (inversión de plataformas + CRM).
   Para hacer lo mismo:
     1. La hoja se comparte como «cualquiera con el enlace puede ver».
     2. Cada pestaña lleva encabezados en minúscula iguales a los campos de la
        parte 1 (fecha, programa, medio, inversion, leads_plataforma, ...).
        Las fechas pueden venir como 2027-02-14 o 14/02/2027.
     3. Se escribe el id de la hoja y el gid (o el nombre) de cada pestaña.
   Con `id` vacío se usan los datos embebidos de la parte 1. El id real va en
   el repositorio del cliente, nunca en este banco.
   ========================================================================= */
const HOJA = {
  id: "",
  pestanas: { filas: "sheet=EMBUDO", fuentes: "sheet=FUENTES", metas: "sheet=METAS", mensual: "sheet=MENSUAL" }
};

function leerCsv(texto) {
  const filas = []; let fila = [], campo = "", comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(campo); filas.push(fila); fila = []; campo = "";
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  const [enc, ...resto] = filas;
  return resto.filter(f => f.some(v => v.trim())).map(f => Object.fromEntries(enc.map((k, i) => [k.trim(), (f[i] ?? "").trim()])));
}
const numeroHoja = v => {
  const s = String(v ?? "").replace(/[$\s%]/g, "");
  if (!s) return null;
  return parseFloat(s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/\./g, "")) || 0;
};
const fechaHoja = v => {
  const m = String(v || "").match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : String(v || "").slice(0, 10);
};
async function cargarHoja() {
  const url = q => `https://docs.google.com/spreadsheets/d/${HOJA.id}/gviz/tq?tqx=out:csv&headers=1&${q}&_=${Date.now()}`;
  const leer = q => fetch(url(q)).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }).then(leerCsv);
  const [filas, fuentes, metas, mensual] = await Promise.all(Object.values(HOJA.pestanas).map(leer));
  const nums = (x, campos) => Object.fromEntries(campos.map(k => [k, numeroHoja(x[k])]));
  DATOS.filas = filas.map(x => ({ fecha: fechaHoja(x.fecha), programa: x.programa, medio: x.medio,
    ...nums(x, ["inversion", "leads_plataforma", "leads_crm", "inscritos", "admitidos", "matriculados"]) }));
  DATOS.fuentes = fuentes.map(x => ({ fecha: fechaHoja(x.fecha), nivel: x.nivel, fuente: x.fuente, ...nums(x, ["leads", "matriculados"]) }));
  DATOS.metas = metas.map(x => ({ programa: x.programa, ...nums(x, ["presupuesto", "meta_leads", "meta_matriculados"]) }));
  DATOS.mensual = mensual.map(x => ({ mes: String(x.mes).slice(0, 7), nivel: x.nivel, ...nums(x, ["presupuesto", "meta_leads"]) }));
  DATOS.corte = DATOS.filas.reduce((a, r) => r.fecha > a ? r.fecha : a, "");
}


/* ============================================================================
   3. LÓGICA · no se toca para cambiar de cliente
   ========================================================================= */

// ── Formato: punto de millar siempre y espacio antes de % ──────────────────────
const NF0 = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0, useGrouping: "always" });
const NF1 = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1, useGrouping: "always" });
const vacio = v => v === null || v === undefined || !Number.isFinite(v);
const fCOP = v => vacio(v) ? "—" : "$" + NF0.format(Math.round(v));
const fN = v => vacio(v) ? "—" : NF0.format(Math.round(v));
const fP = v => vacio(v) ? "—" : NF1.format(v * 100) + " %";
const fDif = v => vacio(v) ? "—" : (v > 0 ? "+" : "") + fP(v);
const fM = v => "$" + NF1.format(v / 1e6) + " M";
const div = (a, b) => (b && !vacio(a)) ? a / b : null;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ── Fechas en ISO (AAAA-MM-DD), aritmética en UTC ─────────────────────────────
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function fechaUTC(s) { return Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)); }
function sumarDias(s, n) { return new Date(fechaUTC(s) + n * 864e5).toISOString().slice(0, 10); }
const dias = (a, b) => Math.round((fechaUTC(b) - fechaUTC(a)) / 864e5) + 1;
const lunes = s => sumarDias(s, -((new Date(fechaUTC(s)).getUTCDay() + 6) % 7));
const finMes = k => new Date(Date.UTC(+k.slice(0, 4), +k.slice(5, 7), 0)).toISOString().slice(0, 10);
const fFecha = s => `${+s.slice(8, 10)} ${MESES[+s.slice(5, 7) - 1]}`;
const fMes = k => MESES[+k.slice(5, 7) - 1].replace(/^./, c => c.toUpperCase()) + " " + k.slice(0, 4);
const maxF = (a, b) => a > b ? a : b, minF = (a, b) => a < b ? a : b;

// semáforo de cumplimiento: ≥ 80 % bien, ≥ 50 % atención, menos alerta (mismo umbral que el tablero consolidado)
const tono = p => vacio(p) ? "ts-mute" : p >= .8 ? "ts-pos" : p >= .5 ? "ts-warn" : "ts-neg";
const tonoDif = d => vacio(d) ? "ts-mute" : Math.abs(d) <= .1 ? "ts-pos" : Math.abs(d) <= .25 ? "ts-warn" : "ts-neg";
const NIVELES = () => Object.keys(DATOS.etapas);
const CAT = {};
const etapa = n => DATOS.etapas[n] || { inscritos: true, admitidos: true };

// ── Estado de la vista ────────────────────────────────────────────────────────
const E = { quick: "mes", metaTotal: false, evo: "mes", vistaMedio: "niv", abiertosEvo: new Set(), cerrados: new Set(), orden: { col: "inv", dir: -1 } };
let FILAS = [], FUENTES = [], ROWS = [];
const GRAF = {};
const $ = id => document.getElementById(id);

// ── Agregación ────────────────────────────────────────────────────────────────
// Además de los totales se guardan los de los niveles que miden cada etapa, para que
// cada tasa del embudo compare solo a quien mide las dos etapas.
const Z = () => ({ inv: 0, lp: 0, invLp: 0, lcLp: 0, conLp: false, sinLp: false, lc: 0, lcI: 0, ins: 0, insA: 0, adm: 0, matA: 0, mat: 0, midIns: false, midAdm: false });
function sumar(a, r) {
  a.inv += r.inv; a.lc += r.lc; a.mat += r.mat;
  if (r.lp === null) a.sinLp = true; else { a.conLp = true; a.lp += r.lp; a.invLp += r.inv; a.lcLp += r.lc; }
  const e = etapa(r.nivel);
  if (e.inscritos) { a.midIns = true; a.ins += r.ins || 0; a.lcI += r.lc; }
  if (e.admitidos) { a.midAdm = true; a.adm += r.adm || 0; a.matA += r.mat; if (e.inscritos) a.insA += r.ins || 0; }
  return a;
}
const agrupar = (filas, llave) => filas.reduce((g, r) => { const k = llave(r); sumar(g[k] = g[k] || Z(), r); return g; }, {});
function M(a, meta) {
  const m = meta || { ppto: null, lm: null, mm: null };
  return {
    ...a,
    lpV: a.conLp ? a.lp : null, insV: a.midIns ? a.ins : null, admV: a.midAdm ? a.adm : null,
    cplP: a.conLp ? div(a.invLp, a.lp) : null, cplC: div(a.inv, a.lc), dif: a.conLp && a.lp ? a.lcLp / a.lp - 1 : null,
    pLI: a.midIns ? div(a.ins, a.lcI) : null, pIA: a.midIns && a.midAdm ? div(a.adm, a.insA) : null, pAM: a.midAdm ? div(a.matA, a.adm) : null,
    conv: div(a.mat, a.lc), cpm: div(a.inv, a.mat),
    ppto: m.ppto ?? null, lm: m.lm ?? null, mm: m.mm ?? null,
    ejec: div(a.inv, m.ppto), cumL: div(a.lc, m.lm), cumM: div(a.mat, m.mm),
    cplM: div(m.ppto, m.lm), cpmM: div(m.ppto, m.mm)
  };
}

// ── Filtros ───────────────────────────────────────────────────────────────────
function F() {
  const v = id => $(id).value;
  return { desde: v("f-desde"), hasta: v("f-hasta"), nivel: v("f-nivel"), facultad: v("f-facultad"), programa: v("f-programa"), medio: v("f-medio") };
}
const pasaCat = (r, f) => (!f.nivel || r.nivel === f.nivel) && (!f.facultad || r.facultad === f.facultad) && (!f.programa || r.programa === f.programa);
const pasa = (r, f) => r.fecha >= f.desde && r.fecha <= f.hasta && pasaCat(r, f) && (!f.medio || r.medio === f.medio);

// Meta del periodo que cae en el filtro: con el botón de meta encendido, la meta completa;
// apagado, la parte proporcional a los días del rango dentro del periodo. Con medio elegido no hay meta.
function partePeriodo(f) {
  if (E.metaTotal) return 1;
  const p = DATOS.periodo, a = maxF(f.desde, p.inicio), b = minF(f.hasta, p.fin);
  return a > b ? 0 : dias(a, b) / dias(p.inicio, p.fin);
}
function metaDe(f, prueba) {
  if (f.medio) return null;
  const s = partePeriodo(f), out = { ppto: 0, lm: 0, mm: 0 };
  let hay = false;
  for (const m of DATOS.metas) {
    const c = CAT[m.programa];
    if (!c || !pasaCat(c, f) || (prueba && !prueba(c))) continue;
    hay = true; out.ppto += (m.presupuesto || 0) * s; out.lm += (m.meta_leads || 0) * s; out.mm += (m.meta_matriculados || 0) * s;
  }
  return hay && s ? out : null;
}
// Meta mensual (MENSUAL) de un mes: solo por nivel, así que no aplica con facultad, programa o medio.
function metaMes(k, f, nivel) {
  if (f.medio || f.facultad || f.programa) return null;
  const ini = k + "-01", fin = finMes(k), a = E.metaTotal ? ini : maxF(ini, f.desde), b = E.metaTotal ? fin : minF(fin, f.hasta);
  if (a > b) return null;
  const s = dias(a, b) / dias(ini, fin), out = { ppto: 0, lm: 0, mm: null };
  let hay = false;
  for (const m of DATOS.mensual) {
    if (m.mes !== k || (f.nivel && m.nivel !== f.nivel) || (nivel && m.nivel !== nivel)) continue;
    hay = true; out.ppto += m.presupuesto * s; out.lm += m.meta_leads * s;
  }
  return hay ? out : null;
}

function llenar(id, opciones, etiqueta) {
  const el = $(id), actual = el.value, primera = el.options[0].outerHTML;
  el.innerHTML = primera + opciones.map(o => `<option value="${esc(o)}">${esc(etiqueta ? etiqueta(o) : o)}</option>`).join("");
  el.value = opciones.includes(actual) ? actual : "";
}
// facultad depende del nivel; programa, del nivel y la facultad
function cascada() {
  const n = $("f-nivel").value;
  const enNivel = DATOS.programas.filter(p => !n || p.nivel === n);
  llenar("f-facultad", [...new Set(enNivel.map(p => p.facultad))].sort((a, b) => a.localeCompare(b, "es")));
  const fac = $("f-facultad").value;
  llenar("f-programa", enNivel.filter(p => !fac || p.facultad === fac).map(p => p.programa).sort((a, b) => a.localeCompare(b, "es")));
}

// Rangos rápidos: «hoy» es la fecha de corte de los datos, no el reloj del equipo.
const RAPIDOS = [["sem", "Esta semana"], ["semAnt", "Semana pasada"], ["mes", "Este mes"], ["mesAnt", "Mes pasado"], ["per", "Periodo " + DATOS.periodo.id]];
function rango(k) {
  const hoy = DATOS.corte;
  let a = hoy.slice(0, 8) + "01", b = hoy;
  if (k === "sem") a = lunes(hoy);
  else if (k === "semAnt") { a = sumarDias(lunes(hoy), -7); b = sumarDias(a, 6); }
  else if (k === "mesAnt") { b = sumarDias(a, -1); a = b.slice(0, 8) + "01"; }
  else if (k === "per") a = DATOS.periodo.inicio;
  return [a, b];
}
function rapido(k) {
  const [a, b] = rango(k);
  $("f-desde").value = a; $("f-hasta").value = b; E.quick = k; pintar();
}

// ── Componentes de dibujo ─────────────────────────────────────────────────────
const NO_APLICA = '<span class="ts-mute">No aplica</span>';
const SIN_DATO = '<span class="ts-mute">Sin dato</span>';
const PARCIAL = '<span class="ad-estado ad-estado--parcial">Parcial</span>';
function barraKpi(p, etiqueta) {
  if (vacio(p)) return `<div class="ts-kpi__meta"><span>${etiqueta}</span><span class="ts-mute">No aplica</span></div>`;
  return `<div class="ts-kpi__meta"><span>${etiqueta}</span><span class="${tono(p)}">${fP(p)}</span></div>` +
    `<div class="ad-barra ts-kpi__barra" style="--v:${Math.min(p, 1) * 100}%" aria-hidden="true"><span></span></div>`;
}
const META_COLS = ["ppto", "lm", "mm", "ejec", "cumL", "cumM", "cplM", "cpmM"];
// columnas: [clave, título, tipo, separador de grupo]
function celda(m, [k, , tipo, g]) {
  const c = g ? " ts-grp" : "", v = m[k];
  if ((k === "insV" || k === "admV") && vacio(v)) return `<td class="ts-r${c}">${NO_APLICA}</td>`;
  if (k === "lpV" && vacio(v)) return `<td class="ts-r${c}">${SIN_DATO}</td>`;
  if (META_COLS.includes(k) && m.ppto === null && m.lm === null) return `<td class="ts-r${c}">${NO_APLICA}</td>`;
  if (tipo === "cop") return `<td class="ts-r${c}">${fCOP(v)}</td>`;
  if (tipo === "n") return `<td class="ts-r${c}">${fN(v)}</td>`;
  if (tipo === "pct") return `<td class="ts-r${c}">${fP(v)}</td>`;
  if (tipo === "dif") return `<td class="ts-r${c} ${tonoDif(v)}">${fDif(v)}</td>`;
  return `<td class="ts-r${c} ${tono(v)}">${fP(v)}</td>`;
}
function encabezado(primera, cols, ordenable) {
  return '<tr><th scope="col" class="ts-fija">' + primera + "</th>" + cols.map(c => {
    const cl = `ts-r${c[3] ? " ts-grp" : ""}`;
    if (!ordenable) return `<th scope="col" class="${cl}">${c[1]}</th>`;
    const activo = E.orden.col === c[0];
    return `<th scope="col" class="${cl}" aria-sort="${activo ? (E.orden.dir > 0 ? "ascending" : "descending") : "none"}"><button type="button" class="ts-orden" data-orden="${c[0]}">${c[1]}${activo ? (E.orden.dir > 0 ? " ↑" : " ↓") : ""}</button></th>`;
  }).join("") + "</tr>";
}
const filaTabla = (clase, etiqueta, m, cols) => `<tr${clase ? ` class="${clase}"` : ""}><th scope="row" class="ts-fija">${etiqueta}</th>${cols.map(c => celda(m, c)).join("")}</tr>`;
const vacioTabla = n => `<tr><td colspan="${n}" class="ts-vacio">Sin datos en el rango</td></tr>`;

// ── Gráficos (Chart.js) ───────────────────────────────────────────────────────
const tinta = v => getComputedStyle(document.body).getPropertyValue(v).trim();
function grafico(id, config) {
  const lienzo = $(id);
  if (!lienzo) return;
  if (typeof Chart === "undefined") {
    lienzo.parentElement.innerHTML = '<p class="ts-vacio">El gráfico necesita conexión para cargar Chart.js. Las tablas muestran las mismas cifras.</p>';
    return;
  }
  if (GRAF[id]) GRAF[id].destroy();
  GRAF[id] = new Chart(lienzo, config);
}
function opciones(ejes, etiqueta) {
  const suave = tinta("--tinta-suave");
  const eje = extra => ({ beginAtZero: true, ...extra, ticks: { color: suave, font: { size: 12 }, ...(extra.ticks || {}) }, title: extra.title ? { color: suave, font: { size: 12 }, ...extra.title } : undefined });
  return {
    responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: "index", intersect: false },
    plugins: { legend: { labels: { boxWidth: 12, color: suave, font: { size: 12 } } }, tooltip: { callbacks: { label: etiqueta } } },
    scales: Object.fromEntries(Object.entries(ejes).map(([k, v]) => [k, eje(k === "x" ? v : { ...v, ticks: { callback: fN, ...(v.ticks || {}) } })]))
  };
}

// ── Pintar ────────────────────────────────────────────────────────────────────
function pintar() {
  const f = F();
  if (!f.desde || !f.hasta) return;
  if (f.desde > f.hasta) { $("f-hasta").value = f.desde; pintar(); return; }
  document.querySelectorAll("[data-rapido]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.rapido === E.quick)));
  $("b-meta").setAttribute("aria-pressed", String(E.metaTotal));
  ROWS = FILAS.filter(r => pasa(r, f));
  const T = M(ROWS.reduce(sumar, Z()), metaDe(f));
  const mesCorte = DATOS.corte.slice(0, 7), abierto = f.hasta >= DATOS.corte && finMes(mesCorte) > DATOS.corte;
  $("rango-nota").innerHTML = `${fFecha(f.desde)} – ${fFecha(f.hasta)} ${f.hasta.slice(0, 4)} · ${dias(f.desde, f.hasta)} días` +
    (f.hasta > DATOS.corte ? ` · datos hasta el ${fFecha(DATOS.corte)}` : "") + (abierto ? " · " + PARCIAL : "") +
    (E.metaTotal ? " · metas del periodo completo" : " · metas proporcionales al rango");
  $("estado-filtros").textContent = `Rango del ${fFecha(f.desde)} al ${fFecha(f.hasta)}: ${fCOP(T.inv)} de inversión y ${fN(T.lc)} leads CRM.`;
  pintarKpis(T); pintarMedios(); pintarEmbudo(T); pintarNivel(f); pintarEvolucion(f); pintarDiario(f, T);
  pintarMedio(); pintarProgramas(f); pintarFuentes(f); pintarBranding(f);
}

function pintarKpis(T) {
  // La cifra clave del bloque (on = true) lleva la lima: .ad-kpi--on.
  const k = (l, v, sub, extra, on) => `<div class="ad-kpi${on ? " ad-kpi--on" : ""}"><span class="ad-kpi__l">${l}</span><span class="ad-kpi__n">${v}</span>${sub ? `<span class="ad-kpi__m">${sub}</span>` : ""}${extra || ""}</div>`;
  const conMeta = T.ppto !== null;
  const noMiden = NIVELES().filter(n => !etapa(n).inscritos && ROWS.some(r => r.nivel === n));
  const nota = T.midIns && noMiden.length ? ` (sin ${noMiden.join(", ")})` : "";
  $("kpis").innerHTML = [
    k("Inversión", fCOP(T.inv), "solo conversión · branding aparte", barraKpi(T.ejec, conMeta ? "Ejecución de " + fCOP(T.ppto) : "Ejecución de presupuesto")),
    k("Leads plataforma", T.lpV === null ? SIN_DATO : fN(T.lpV), "CPL plataforma " + fCOP(T.cplP) + (T.sinLp && T.conLp ? " · sin programática" : "")),
    k("Leads CRM", fN(T.lc), `<span class="${tonoDif(T.dif)}">${T.dif === null ? "sin comparación con plataforma" : fDif(T.dif) + " frente a plataforma"}</span>`, barraKpi(T.cumL, conMeta ? "Meta " + fN(T.lm) : "Meta de leads")),
    k("CPL CRM", fCOP(T.cplC), conMeta ? `CPL meta ${fCOP(T.cplM)}` : "sin meta con este filtro"),
    k("Inscritos", T.insV === null ? NO_APLICA : fN(T.insV), T.insV === null ? "el nivel no mide esta etapa" : fP(T.pLI) + " de los leads CRM" + nota),
    k("Admitidos", T.admV === null ? NO_APLICA : fN(T.admV), T.admV === null ? "el nivel no mide esta etapa" : fP(T.pIA) + " de los inscritos"),
    k("Matriculados", fN(T.mat), fP(T.conv) + " de los leads CRM", barraKpi(T.cumM, conMeta ? "Meta " + fN(T.mm) : "Meta de matriculados"), true),
    k("Costo por matriculado", fCOP(T.cpm), conMeta ? "meta " + fCOP(T.cpmM) : "sin meta con este filtro")
  ].join("");
}

function pintarMedios() {
  const g = agrupar(ROWS, r => r.medio), total = ROWS.reduce((a, r) => a + r.inv, 0);
  const fila = (l, v, s) => `<div class="ts-medio__f"><span>${l}</span><span><b>${v}</b>${s ? `<small>${s}</small>` : ""}</span></div>`;
  const lista = DATOS.medios.filter(m => g[m]);
  $("medios").innerHTML = lista.length ? lista.map(k => {
    const m = M(g[k]);
    return `<div class="ad-card ts-medio"><h3>${esc(DATOS.medioEtiqueta[k] || k)}</h3>
      <p class="ts-medio__v">${fCOP(m.inv)}</p><p class="ad-card__d">${fP(div(m.inv, total))} de la inversión</p>
      ${fila("Leads plataforma", m.lpV === null ? SIN_DATO : fN(m.lpV), m.lpV === null ? "" : "CPL " + fCOP(m.cplP))}
      ${fila("Leads CRM", fN(m.lc), "CPL " + fCOP(m.cplC))}
      ${fila("Matriculados", fN(m.mat), fP(m.conv) + " de los leads")}</div>`;
  }).join("") : '<p class="ts-vacio">Sin inversión en el rango</p>';
}

function pintarEmbudo(T) {
  const pasos = [
    ["Leads plataforma", T.lpV, "", null, SIN_DATO],
    ["Leads CRM", T.lc, T.conLp ? fP(div(T.lcLp, T.lp)) + " de plataforma" : "", T.cplM],
    ["Inscritos", T.insV, T.insV === null ? "" : fP(T.pLI) + " de leads CRM", null, NO_APLICA],
    ["Admitidos", T.admV, T.admV === null ? "" : fP(T.pIA) + " de inscritos", null, NO_APLICA],
    ["Matriculados", T.mat, T.midAdm ? fP(T.pAM) + " de admitidos" : fP(T.conv) + " de leads CRM", T.cpmM]
  ];
  const mx = Math.max(1, ...pasos.map(p => p[1] || 0));
  const costo = (v, meta) => {
    const c = div(T.inv, v);
    if (c === null) return '<span class="ts-mute">—</span>';
    const t = meta ? (c <= meta ? "ts-pos" : c <= meta * 1.25 ? "ts-warn" : "ts-neg") : "";
    return `<b class="${t}">${fCOP(c)}</b>${meta ? `<small>meta ${fCOP(meta)}</small>` : ""}`;
  };
  $("embudo").innerHTML = '<div class="ts-emb__f ts-emb__h"><span>Etapa</span><span></span><span>Volumen · tasa frente a la etapa anterior</span><span>Costo por etapa</span></div>' +
    pasos.map(([l, v, tasa, meta, sin], i) => `<div class="ts-emb__f"><span class="ts-emb__l">${l}</span>
      <span class="ad-barra${i === pasos.length - 1 && !vacio(v) ? " ad-barra--on" : ""}" style="--v:${vacio(v) ? 0 : Math.max(v / mx * 100, .5)}%" aria-hidden="true"><span></span></span>
      <span class="ts-emb__v">${vacio(v) ? sin : `<b>${fN(v)}</b>`}<small>${tasa}</small></span>
      <span class="ts-emb__c">${vacio(v) ? '<span class="ts-mute">—</span>' : costo(v, meta)}</span></div>`).join("");
  // lectura: el paso con menor conversión entre etapas medidas
  const tasas = [["leads CRM", "inscritos", T.pLI], ["inscritos", "admitidos", T.pIA], ["admitidos", "matriculados", T.pAM]].filter(t => !vacio(t[2]));
  const peor = tasas.sort((a, b) => a[2] - b[2])[0];
  $("embudo-lectura").textContent = peor ? `El paso con menor conversión es de ${peor[0]} a ${peor[1]}: ${fP(peor[2])}. Cada etapa cuenta en su propia fecha, así que las tasas no siguen al mismo aspirante.`
    : "Con este filtro el embudo solo mide leads y matriculados.";
}

const COLS_NIVEL = [["inv", "Inversión", "cop"], ["pInv", "% inversión", "pct"], ["ppto", "Presupuesto", "cop", 1], ["ejec", "Ejecución", "cum"],
  ["lpV", "Leads plat.", "n", 1], ["lc", "Leads CRM", "n"], ["lm", "Meta leads", "n"], ["cumL", "Cumpl. leads", "cum"], ["cplC", "CPL CRM", "cop"], ["cplM", "CPL meta", "cop"],
  ["mat", "Matriculados", "n", 1], ["mm", "Meta matr.", "n"], ["cumM", "Cumpl. matr.", "cum"], ["cpm", "Costo / matr.", "cop"]];
function pintarNivel(f) {
  const g = agrupar(ROWS, r => r.nivel), tot = ROWS.reduce((a, r) => a + r.inv, 0);
  const lista = NIVELES().filter(n => g[n]);
  const fila = (n, a, meta, clase) => { const m = M(a, meta); m.pInv = div(m.inv, tot); return filaTabla(clase, esc(n), m, COLS_NIVEL); };
  $("nivel-head").innerHTML = encabezado("Nivel", COLS_NIVEL);
  $("nivel-body").innerHTML = lista.length ? lista.map(n => fila(n, g[n], metaDe(f, c => c.nivel === n))).join("") + fila("Total", ROWS.reduce(sumar, Z()), metaDe(f), "ts-total") : vacioTabla(COLS_NIVEL.length + 1);
  const linea = (l, real, meta, fmt) => {
    const p = div(real, meta);
    if (p === null) return `<div class="ts-cum"><span>${l}</span><span class="ad-barra ts-cum__p" style="--v:0%" aria-hidden="true"><span></span></span><span class="ts-r ts-mute">No aplica</span></div>`;
    return `<div class="ts-cum"><span>${l}</span><span class="ad-barra ts-cum__p" style="--v:${Math.min(p, 1.5) / 1.5 * 100}%;--meta:66.667%" aria-hidden="true"><span></span><i></i></span>` +
      `<span class="ts-r ${tono(p)}">${fP(p)}</span><small>${fmt(real)} de ${fmt(meta)}</small></div>`;
  };
  $("nivel-barras").innerHTML = lista.length ? lista.map(n => {
    const m = M(g[n], metaDe(f, c => c.nivel === n));
    return `<div class="ts-cum__g"><h3>${esc(n)}</h3>${linea("Presupuesto", m.inv, m.ppto, fCOP)}${linea("Leads CRM", m.lc, m.lm, fN)}${linea("Matriculados", m.mat, m.mm, fN)}</div>`;
  }).join("") : '<p class="ts-vacio">Sin datos en el rango</p>';
  const T = M(ROWS.reduce(sumar, Z()), metaDe(f));
  $("nivel-lectura").textContent = T.ppto === null ? "Con un medio elegido no hay metas: el presupuesto y las metas son por programa, no por medio."
    : `Con ${fP(T.ejec)} del presupuesto del rango ejecutado, los leads CRM van en ${fP(T.cumL)} de su meta y los matriculados en ${fP(T.cumM)}.`;
}

const COLS_EVO = [["inv", "Inversión", "cop"], ["lpV", "Leads plat.", "n"], ["lc", "Leads CRM", "n"], ["dif", "CRM vs plat.", "dif"], ["cplC", "CPL CRM", "cop"],
  ["insV", "Inscritos", "n", 1], ["admV", "Admitidos", "n"], ["mat", "Matriculados", "n"], ["conv", "Lead → matr.", "pct"], ["cpm", "Costo / matr.", "cop"]];
const COLS_EVO_META = [["ppto", "Ppto meta", "cop", 1], ["ejec", "Ejec. ppto", "cum"], ["lm", "Meta leads", "n"], ["cumL", "Cumpl. leads", "cum"], ["cplM", "CPL meta", "cop"]];
function pintarEvolucion(f) {
  const mes = E.evo === "mes", llave = r => mes ? r.fecha.slice(0, 7) : lunes(r.fecha);
  const g = agrupar(ROWS, llave), ks = Object.keys(g).sort(), cols = mes ? COLS_EVO.concat(COLS_EVO_META) : COLS_EVO;
  const etiqueta = k => mes ? fMes(k) : "Semana del " + fFecha(k);
  const incompleto = k => { const ini = mes ? k + "-01" : k, fin = mes ? finMes(k) : sumarDias(k, 6); return fin > DATOS.corte || ini < f.desde || fin > f.hasta; };
  const meta = (k, n) => mes ? metaMes(k, f, n) : null;
  let h = "";
  for (const k of ks.slice().reverse()) {
    const abierto = E.abiertosEvo.has(k);
    const chip = `<button type="button" class="ts-abrir" aria-expanded="${abierto}" data-evo="${k}">${etiqueta(k)}</button>${incompleto(k) ? " " + PARCIAL : ""}`;
    h += filaTabla("ts-n1", chip, M(g[k], meta(k)), cols);
    if (!abierto) continue;
    const gn = agrupar(ROWS.filter(r => llave(r) === k), r => r.nivel);
    for (const n of NIVELES().filter(n => gn[n])) h += filaTabla("ts-n2", esc(n), M(gn[n], meta(k, n)), cols);
  }
  $("evo-head").innerHTML = encabezado(mes ? "Mes" : "Semana", cols);
  const totMeta = mes ? ks.reduce((a, k) => { const m = meta(k); if (m) { a = a || { ppto: 0, lm: 0, mm: null }; a.ppto += m.ppto; a.lm += m.lm; } return a; }, null) : null;
  $("evo-body").innerHTML = ks.length ? h + filaTabla("ts-total", "Total", M(ROWS.reduce(sumar, Z()), totMeta), cols) : vacioTabla(cols.length + 1);
  document.querySelectorAll("[data-vista-evo]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.vistaEvo === E.evo)));
  const datos = ks.map(k => M(g[k]));
  grafico("g-evo", {
    data: { labels: ks.map(k => mes ? fMes(k) : fFecha(k)), datasets: [
      { type: "bar", label: "Inversión", data: datos.map(d => d.inv), backgroundColor: tinta("--tinta-tenue"), maxBarThickness: 56, yAxisID: "y1", order: 3 },
      { type: "line", label: "Leads CRM", data: datos.map(d => d.lc), borderColor: tinta("--sumi"), backgroundColor: tinta("--sumi"), borderWidth: 2, tension: .25, yAxisID: "y", order: 1 },
      { type: "line", label: "Matriculados", data: datos.map(d => d.mat), borderColor: tinta("--tinta-secundaria"), backgroundColor: tinta("--tinta-secundaria"), borderWidth: 2, borderDash: [6, 4], tension: .25, yAxisID: "y2", order: 0 }
    ] },
    options: opciones({ x: { grid: { display: false } }, y: { position: "left", title: { display: true, text: "Leads CRM" } }, y2: { display: false }, y1: { position: "right", grid: { display: false }, ticks: { callback: v => fM(v) } } },
      c => c.dataset.label + ": " + (c.dataset.yAxisID === "y1" ? fCOP(c.raw) : fN(c.raw)))
  });
  const completos = datos.map((d, i) => [ks[i], d.cplC]).filter(x => x[1] !== null && !incompleto(x[0])).sort((a, b) => a[1] - b[1]);
  $("evo-lectura").textContent = completos.length
    ? `${mes ? "El mes completo" : "La semana completa"} con menor CPL CRM fue ${etiqueta(completos[0][0]).replace(/^Semana/, "la semana")}: ${fCOP(completos[0][1])}. Los periodos marcados «Parcial» no se comparan como completos.`
    : "El rango no tiene un periodo completo para comparar: amplía las fechas o cambia a semana a semana.";
}

function pintarDiario(f, T) {
  const g = agrupar(ROWS, r => r.fecha), ks = [];
  for (let d = f.desde; d <= minF(f.hasta, DATOS.corte); d = sumarDias(d, 1)) ks.push(d);
  const datos = ks.map(k => M(g[k] || Z())), labels = ks.map(fFecha);
  const sumi = tinta("--sumi"), sec = tinta("--tinta-secundaria"), tenue = tinta("--tinta-tenue"), x = { grid: { display: false }, ticks: { maxTicksLimit: 8 } };
  grafico("g-inv", { data: { labels, datasets: [{ type: "bar", label: "Inversión", data: datos.map(d => d.inv), backgroundColor: tenue, maxBarThickness: 24 }] },
    options: opciones({ x, y: { ticks: { callback: v => fM(v) } } }, c => "Inversión: " + fCOP(c.raw)) });
  grafico("g-leads", { data: { labels, datasets: [
    { type: "line", label: "Leads CRM", data: datos.map(d => d.lc), borderColor: sumi, backgroundColor: sumi, borderWidth: 2, pointRadius: 0, tension: .25 },
    { type: "line", label: "Leads plataforma", data: datos.map(d => d.lpV), borderColor: sec, backgroundColor: sec, borderWidth: 2, borderDash: [6, 4], pointRadius: 0, tension: .25 }] },
    options: opciones({ x, y: {} }, c => c.dataset.label + ": " + fN(c.raw)) });
  const ds = [{ type: "line", label: "CPL CRM", data: datos.map(d => d.cplC), borderColor: sumi, backgroundColor: sumi, borderWidth: 2, pointRadius: 0, tension: .25, spanGaps: true }];
  if (T.cplM) ds.push({ type: "line", label: "CPL meta", data: ks.map(() => T.cplM), borderColor: sec, backgroundColor: sec, borderWidth: 1.5, borderDash: [2, 3], pointRadius: 0 });
  grafico("g-cpl", { data: { labels, datasets: ds }, options: opciones({ x, y: { ticks: { callback: v => fCOP(v) } } }, c => c.dataset.label + ": " + fCOP(c.raw)) });
  const sobre = T.cplM ? datos.filter(d => d.cplC !== null && d.cplC > T.cplM).length : null;
  $("diario-lectura").textContent = !ks.length ? "Sin días con datos en el rango." : sobre === null
    ? `${ks.length} días con datos. Sin CPL meta con este filtro.`
    : `${sobre} de ${ks.length} días quedaron con el CPL CRM por encima de la meta (${fCOP(T.cplM)}).`;
}

const COLS_MEDIO = [["inv", "Inversión", "cop"], ["pInv", "% inversión", "pct"], ["lpV", "Leads plat.", "n", 1], ["cplP", "CPL plat.", "cop"], ["lc", "Leads CRM", "n"],
  ["dif", "CRM vs plat.", "dif"], ["cplC", "CPL CRM", "cop"], ["insV", "Inscritos", "n", 1], ["admV", "Admitidos", "n"], ["mat", "Matriculados", "n"], ["conv", "Lead → matr.", "pct"], ["cpm", "Costo / matr.", "cop"]];
function pintarMedio() {
  const tot = ROWS.reduce((a, r) => a + r.inv, 0);
  const fila = (clase, l, a) => { const m = M(a); m.pInv = div(m.inv, tot); return filaTabla(clase, l, m, COLS_MEDIO); };
  const porMedio = (rs, clase) => { const g = agrupar(rs, r => r.medio); return DATOS.medios.filter(k => g[k]).map(k => fila(clase, esc(DATOS.medioEtiqueta[k] || k), g[k])).join(""); };
  let h = "";
  if (E.vistaMedio === "niv") {
    const g = agrupar(ROWS, r => r.nivel);
    for (const n of NIVELES().filter(n => g[n])) h += fila("ts-n1", esc(n), g[n]) + porMedio(ROWS.filter(r => r.nivel === n), "ts-n2");
  } else h = porMedio(ROWS, "");
  $("medio-head").innerHTML = encabezado(E.vistaMedio === "niv" ? "Nivel / medio" : "Medio", COLS_MEDIO);
  $("medio-body").innerHTML = h ? h + fila("ts-total", "Total", ROWS.reduce(sumar, Z())) : vacioTabla(COLS_MEDIO.length + 1);
  document.querySelectorAll("[data-vista-medio]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.vistaMedio === E.vistaMedio)));
}

function pintarProgramas(f) {
  const crm = DATOS.medios.map((k, i) => ["crm_" + k, "CRM " + k, "n", i === 0 ? 1 : 0]);
  const cols = [["inv", "Inversión", "cop"], ["lpV", "Leads plat.", "n"], ["lc", "Leads CRM", "n"], ...crm, ["cplC", "CPL CRM", "cop", 1],
    ["insV", "Inscritos", "n"], ["admV", "Admitidos", "n"], ["mat", "Matriculados", "n"], ["cpm", "Costo / matr.", "cop"], ["conv", "Lead → matr.", "pct"],
    ["ppto", "Ppto meta", "cop", 1], ["ejec", "Ejecución", "cum"], ["lm", "Meta leads", "n"], ["cumL", "Cumpl. leads", "cum"], ["mm", "Meta matr.", "n"], ["cumM", "Cumpl. matr.", "cum"]];
  const q = $("buscar").value.trim().toLowerCase();
  const nodo = () => ({ t: Z(), medios: {}, meta: null, hijos: {} });
  const medida = x => { const m = M(x.t, x.meta); DATOS.medios.forEach(k => m["crm_" + k] = x.medios[k] ?? null); return m; };
  const arbol = {};
  for (const r of ROWS) {
    if (q && !(r.programa + " " + r.facultad).toLowerCase().includes(q)) continue;
    const n = arbol[r.nivel] = arbol[r.nivel] || nodo();
    const fa = n.hijos[r.facultad] = n.hijos[r.facultad] || nodo();
    const p = fa.hijos[r.programa] = fa.hijos[r.programa] || nodo();
    for (const x of [n, fa, p]) { sumar(x.t, r); x.medios[r.medio] = (x.medios[r.medio] || 0) + r.lc; }
  }
  // metas antes de ordenar, para que también se pueda ordenar por cumplimiento
  for (const [n, xn] of Object.entries(arbol)) {
    xn.meta = metaDe(f, c => c.nivel === n);
    for (const [fa, xf] of Object.entries(xn.hijos)) {
      xf.meta = metaDe(f, c => c.nivel === n && c.facultad === fa);
      for (const [p, xp] of Object.entries(xf.hijos)) xp.meta = metaDe(f, c => c.programa === p);
    }
  }
  const valor = x => { const v = medida(x)[E.orden.col]; return vacio(v) ? -Infinity : v; };
  const ordenar = o => Object.entries(o).sort((a, b) => (E.orden.dir * (valor(a[1]) - valor(b[1]))) || a[0].localeCompare(b[0], "es"));
  const boton = (id, texto) => `<button type="button" class="ts-abrir" aria-expanded="${!E.cerrados.has(id)}" data-arbol="${esc(id)}">${esc(texto)}</button>`;
  let h = "";
  for (const [n, xn] of ordenar(arbol)) {
    const idN = "n|" + n;
    h += filaTabla("ts-n1", boton(idN, n), medida(xn), cols);
    if (E.cerrados.has(idN)) continue;
    for (const [fa, xf] of ordenar(xn.hijos)) {
      const idF = "f|" + n + "|" + fa;
      h += filaTabla("ts-n2", boton(idF, fa), medida(xf), cols);
      if (E.cerrados.has(idF)) continue;
      for (const [p, xp] of ordenar(xf.hijos)) h += filaTabla("ts-n3", esc(p), medida(xp), cols);
    }
  }
  $("prog-head").innerHTML = encabezado("Nivel / facultad / programa", cols, true);
  const tot = { t: ROWS.reduce(sumar, Z()), medios: {}, meta: metaDe(f) };
  ROWS.forEach(r => tot.medios[r.medio] = (tot.medios[r.medio] || 0) + r.lc);
  $("prog-body").innerHTML = h ? h + (q ? "" : filaTabla("ts-total", "Total", medida(tot), cols))
    : `<tr><td colspan="${cols.length + 1}" class="ts-vacio">${q ? "Ningún programa coincide con la búsqueda" : "Sin datos en el rango"}</td></tr>`;
}

const FU = ["Pauta", "Orgánico", "Otras fuentes"];
function pintarFuentes(f) {
  const enRango = r => r.fecha >= f.desde && r.fecha <= f.hasta && (!f.nivel || r.nivel === f.nivel);
  const filas = FUENTES.filter(enRango).concat(FILAS.filter(enRango).map(r => ({ fecha: r.fecha, fuente: "Pauta", leads: r.lc, matriculados: r.mat })));
  const T = {}, MES = {};
  FU.forEach(k => T[k] = { l: 0, m: 0 });
  for (const r of filas) {
    if (!T[r.fuente]) continue;
    const k = r.fecha.slice(0, 7);
    MES[k] = MES[k] || Object.fromEntries(FU.map(x => [x, { l: 0, m: 0 }]));
    for (const x of [T[r.fuente], MES[k][r.fuente]]) { x.l += r.leads || 0; x.m += r.matriculados || 0; }
  }
  const tl = FU.reduce((a, k) => a + T[k].l, 0), tm = FU.reduce((a, k) => a + T[k].m, 0);
  const it = (l, v) => `<div><dt>${l}</dt><dd>${v}</dd></div>`;
  $("fuentes-tarjetas").innerHTML = FU.map((k, i) => `<div class="ad-card ts-fuente"><h3><span class="ts-muestra ts-muestra--${i + 1}" aria-hidden="true"></span>${k}</h3><dl>
    ${it("Leads CRM", fN(T[k].l))}${it("% de los leads", fP(div(T[k].l, tl)))}${it("Lead → matr.", fP(div(T[k].m, T[k].l)))}${it("Matriculados", fN(T[k].m))}${it("% de matriculados", fP(div(T[k].m, tm)))}</dl></div>`).join("");
  const ks = Object.keys(MES).sort();
  $("fuentes-head").innerHTML = '<tr><th scope="col" class="ts-fija">Mes</th>' + FU.map(k => `<th scope="col" class="ts-r ts-grp">Leads ${k.toLowerCase()}</th><th scope="col" class="ts-r">Matr.</th><th scope="col" class="ts-r">Lead → matr.</th>`).join("") + '<th scope="col" class="ts-r ts-grp">% leads de pauta</th></tr>';
  const tr = (l, x, c) => `<tr${c ? ` class="${c}"` : ""}><th scope="row" class="ts-fija">${l}</th>` + FU.map(k => `<td class="ts-r ts-grp">${fN(x[k].l)}</td><td class="ts-r">${fN(x[k].m)}</td><td class="ts-r">${fP(div(x[k].m, x[k].l))}</td>`).join("") +
    `<td class="ts-r ts-grp">${fP(div(x.Pauta.l, FU.reduce((a, k) => a + x[k].l, 0)))}</td></tr>`;
  $("fuentes-body").innerHTML = ks.length ? ks.slice().reverse().map(k => tr(fMes(k), MES[k])).join("") + tr("Total", T, "ts-total") : vacioTabla(11);
  const color = [tinta("--sumi"), tinta("--tinta-secundaria"), tinta("--tinta-tenue")];
  grafico("g-fuentes", { data: { labels: ks.map(fMes), datasets: FU.map((k, i) => ({ type: "bar", label: "Leads " + k.toLowerCase(), data: ks.map(m => MES[m][k].l), backgroundColor: color[i], borderColor: tinta("--papel"), borderWidth: { top: 2 }, maxBarThickness: 56, stack: "l" })) },
    options: opciones({ x: { stacked: true, grid: { display: false } }, y: { stacked: true, title: { display: true, text: "Leads CRM" } } }, c => c.dataset.label + ": " + fN(c.raw)) });
  $("fuentes-lectura").textContent = tl
    ? `La pauta aporta ${fP(div(T.Pauta.l, tl))} de los leads y ${fP(div(T.Pauta.m, tm))} de los matriculados del rango. Su conversión de lead a matriculado es ${fP(div(T.Pauta.m, T.Pauta.l))}, frente a ${fP(div(T["Orgánico"].m, T["Orgánico"].l))} del orgánico.`
    : "Sin leads del CRM en el rango.";
}

function pintarBranding(f) {
  const rs = DATOS.branding.filter(r => finMes(r.mes) >= f.desde && r.mes + "-01" <= f.hasta && (!f.medio || r.medio === f.medio));
  const cols = ["Mes", "Campaña", "Medio", "Presupuesto", "Inversión", "Ejecución", "Impresiones", "Alcance", "CPM", "Clics", "CTR"];
  $("brand-head").innerHTML = "<tr>" + cols.map((c, i) => `<th scope="col" class="${i === 0 ? "ts-fija" : i > 2 ? "ts-r" : ""}">${c}</th>`).join("") + "</tr>";
  const fila = (r, total) => {
    const ej = div(r.inversion, r.presupuesto), abierto = !total && finMes(r.mes) > DATOS.corte;
    return `<tr${total ? ' class="ts-total"' : ""}><th scope="row" class="ts-fija">${total ? "Total" : fMes(r.mes) + (abierto ? " " + PARCIAL : "")}</th><td>${total ? "" : esc(r.campana)}</td><td>${total ? "" : esc(r.medio)}</td>
      <td class="ts-r">${fCOP(r.presupuesto)}</td><td class="ts-r">${fCOP(r.inversion)}</td><td class="ts-r ${abierto ? "ts-mute" : tono(ej)}">${fP(ej)}</td>
      <td class="ts-r">${fN(r.impresiones)}</td><td class="ts-r">${r.alcance === null ? (total ? "—" : SIN_DATO) : fN(r.alcance)}</td>
      <td class="ts-r">${fCOP(div(r.inversion * 1000, r.impresiones))}</td><td class="ts-r">${fN(r.clics)}</td><td class="ts-r">${fP(div(r.clics, r.impresiones))}</td></tr>`;
  };
  const t = rs.reduce((a, r) => { a.presupuesto += r.presupuesto; a.inversion += r.inversion; a.impresiones += r.impresiones; a.clics += r.clics; return a; }, { presupuesto: 0, inversion: 0, impresiones: 0, clics: 0, alcance: null });
  $("brand-body").innerHTML = rs.length ? rs.slice().reverse().map(r => fila(r)).join("") + fila(t, true) : vacioTabla(cols.length);
}

// ── Arranque ──────────────────────────────────────────────────────────────────
function preparar() {
  DATOS.programas.forEach(p => CAT[p.programa] = p);
  if (!DATOS.filas || !DATOS.fuentes) {
    const ej = datosDeEjemplo(DATOS.corte);
    DATOS.filas = DATOS.filas || ej.filas; DATOS.fuentes = DATOS.fuentes || ej.fuentes;
  }
  FILAS = DATOS.filas.filter(r => CAT[r.programa]).map(r => ({ fecha: r.fecha, programa: r.programa, nivel: CAT[r.programa].nivel, facultad: CAT[r.programa].facultad, medio: r.medio || "Sin medio",
    inv: r.inversion || 0, lp: vacio(r.leads_plataforma) ? null : r.leads_plataforma, lc: r.leads_crm || 0, ins: r.inscritos, adm: r.admitidos, mat: r.matriculados || 0 }));
  FUENTES = DATOS.fuentes;
  // aviso visible si la hoja trae programas que no están en el catálogo (no se cuentan en silencio)
  const fuera = [...new Set(DATOS.filas.filter(r => !CAT[r.programa]).map(r => r.programa))];
  $("aviso-datos").hidden = !fuera.length;
  $("aviso-datos").textContent = fuera.length ? `Hay filas de programas que no están en el catálogo y no se cuentan: ${fuera.join(", ")}.` : "";

  document.querySelectorAll("[data-cliente]").forEach(el => el.textContent = DATOS.cliente);
  document.title = `${DATOS.tablero} · ${DATOS.cliente}`;
  $("riel-periodo").textContent = `Periodo ${DATOS.periodo.id} · ${fFecha(DATOS.periodo.inicio)} ${DATOS.periodo.inicio.slice(0, 4)} a ${fFecha(DATOS.periodo.fin)} ${DATOS.periodo.fin.slice(0, 4)}`;
  $("actualizado").textContent = "Corte: " + DATOS.actualizado;
  $("resultado").textContent = DATOS.resultado;
  $("riel-fuentes").innerHTML = DATOS.estadoFuentes.map(x => `<li><span>${esc(x.fuente)}</span><span>${esc(x.corte)}${x.estado !== "Al día" ? " · " + esc(x.estado.toLowerCase()) : ""}</span></li>`).join("");
  llenar("f-nivel", NIVELES().filter(n => DATOS.programas.some(p => p.nivel === n)));
  llenar("f-medio", DATOS.medios, m => DATOS.medioEtiqueta[m] || m);
  cascada();
  $("rapidos").innerHTML = RAPIDOS.map(([k, l]) => `<button type="button" class="ad-chip ts-rango" data-rapido="${k}" aria-pressed="false">${l}</button>`).join("");
  $("b-meta").textContent = "Meta " + DATOS.periodo.id;
  rapido(E.quick || "mes");
}

function enlazar() {
  $("rapidos").addEventListener("click", e => { const b = e.target.closest("[data-rapido]"); if (b) rapido(b.dataset.rapido); });
  $("b-meta").addEventListener("click", () => { E.metaTotal = !E.metaTotal; pintar(); });
  for (const id of ["f-desde", "f-hasta"]) $(id).addEventListener("change", () => { E.quick = ""; pintar(); });
  for (const id of ["f-nivel", "f-facultad", "f-programa", "f-medio"]) $(id).addEventListener("change", () => { if (id === "f-nivel" || id === "f-facultad") cascada(); pintar(); });
  $("b-limpiar").addEventListener("click", () => { ["f-nivel", "f-facultad", "f-programa", "f-medio"].forEach(id => $(id).value = ""); $("buscar").value = ""; E.metaTotal = false; cascada(); rapido("mes"); });
  $("b-recargar").addEventListener("click", iniciar);
  $("buscar").addEventListener("input", () => pintarProgramas(F()));
  document.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.vistaEvo) { E.evo = b.dataset.vistaEvo; E.abiertosEvo.clear(); pintarEvolucion(F()); }
    else if (b.dataset.vistaMedio) { E.vistaMedio = b.dataset.vistaMedio; pintarMedio(); }
    else if (b.dataset.evo) {
      const k = b.dataset.evo; E.abiertosEvo.has(k) ? E.abiertosEvo.delete(k) : E.abiertosEvo.add(k);
      pintarEvolucion(F()); $("evo-body").querySelector(`[data-evo="${k}"]`)?.focus();
    } else if (b.dataset.arbol) {
      const k = b.dataset.arbol; E.cerrados.has(k) ? E.cerrados.delete(k) : E.cerrados.add(k);
      pintarProgramas(F()); $("prog-body").querySelector(`[data-arbol="${CSS.escape(k)}"]`)?.focus();
    } else if (b.dataset.orden) {
      const c = b.dataset.orden; E.orden = { col: c, dir: E.orden.col === c ? -E.orden.dir : -1 };
      pintarProgramas(F()); $("prog-head").querySelector(`[data-orden="${c}"]`)?.focus();
    } else if (b.id === "b-expandir") { E.cerrados.clear(); pintarProgramas(F()); }
    else if (b.id === "b-contraer") { NIVELES().forEach(n => E.cerrados.add("n|" + n)); pintarProgramas(F()); }
  });
  // riel: marca la sección visible
  const enlaces = [...document.querySelectorAll(".ts-riel nav a")];
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(es => es.forEach(x => {
      if (x.isIntersecting) enlaces.forEach(a => a.getAttribute("href") === "#" + x.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
    }), { rootMargin: "-20% 0px -70% 0px" });
    document.querySelectorAll(".ts-sec").forEach(s => obs.observe(s));
  }
}

async function iniciar() {
  $("carga").hidden = false;
  $("carga").textContent = "Cargando datos…";
  try {
    if (HOJA.id) await cargarHoja();
    preparar();
    $("carga").hidden = true;
  } catch (err) {
    $("carga").textContent = "No se pudo leer la hoja de datos. Revisa que esté compartida por enlace y que los nombres de las pestañas coincidan.";
  }
}
if (typeof Chart !== "undefined") { Chart.defaults.font.family = "Inter, system-ui, sans-serif"; Chart.defaults.borderColor = tinta("--piedra"); }
enlazar();
iniciar();
