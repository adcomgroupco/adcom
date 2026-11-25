"use strict";

/* ============================================================================
   Informe de cierre de periodo · datos y lógica de la plantilla
   ----------------------------------------------------------------------------
   1. DATOS: reemplazar con los datos del cliente (todo lo numérico vive aquí).
   2. Lógica: calcula KPI, variaciones y totales una sola vez y pinta la página.

   Convenciones de los datos:
   - Montos en COP enteros, sin formato: 182400000, no "$182,4 M".
   - null = «Sin dato» (no se pudo leer). Nunca convertir ausencia en 0.
   - estado: "parcial" | "preliminar" | "no-aplica" | "sin-dato" marca la fila o
     la cifra y se muestra en pantalla con su etiqueta.
   - La inversión de conversión (medios, niveles, programas) excluye branding y
     eventos: el CPL y el costo por matrícula se calculan solo sobre ella.
   ========================================================================= */

/* ==================== 1. DATOS · Reemplazar con los datos del cliente ==================== */
const DATOS = {
  periodo: { actual: "2026-2", equivalente: "2025-2" },

  // Metas del periodo, tal como quedaron en la estrategia aprobada.
  // matriculas = meta institucional: se compara con matrícula TOTAL (todas las fuentes).
  metas: { presupuesto: 410000000, leadsCrm: 14500, matriculas: 520, cplCrm: 28000 },

  // Frentes del periodo. Branding y eventos no generan leads: no entran al CPL.
  frentes: [
    { nombre: "Pregrado", inversion: 251000000 },
    { nombre: "Posgrado", inversion: 129000000 },
    { nombre: "Branding y eventos", inversion: 24000000, nota: "sin objetivo de conversión" }
  ],

  // Inversión de conversión por medio. Fuente: API de cada plataforma + CRM.
  medios: [
    { medio: "Meta", inversion: 182400000, impresiones: 14820000, clics: 312400, leadsPlataforma: 9860, leadsCrm: 8920, matriculas: 58 },
    { medio: "Google Ads", inversion: 146300000, impresiones: 1284000, clics: 121800, leadsPlataforma: 4120, leadsCrm: 3380, matriculas: 71 },
    { medio: "TikTok", inversion: 38600000, impresiones: 31500000, clics: 96200, leadsPlataforma: 2240, leadsCrm: 1160, matriculas: 4 },
    { medio: "LinkedIn", inversion: 12700000, impresiones: 640000, clics: 3050, leadsPlataforma: 210, leadsCrm: 150, matriculas: 3, nota: "solo posgrado, abr–jul" }
  ],

  // Ritmo mensual de la inversión de conversión, por medio y en el orden de DATOS.medios.
  ritmo: [
    { mes: "Feb", valores: [14200000, 12100000, 0, 0] },
    { mes: "Mar", valores: [22800000, 18400000, 4200000, 0] },
    { mes: "Abr", valores: [30500000, 22600000, 7800000, 2100000] },
    { mes: "May", valores: [44600000, 34900000, 11500000, 3800000] },
    { mes: "Jun", valores: [46100000, 38200000, 10900000, 4300000] },
    { mes: "Jul", valores: [24200000, 20100000, 4200000, 2500000], estado: "parcial" }
  ],

  // Embudo de pauta: plataforma → CRM → inscritos → admitidos → matriculados.
  // anterior = mismo embudo del semestre equivalente, con el mismo criterio de atribución.
  embudo: [
    { etapa: "Leads plataforma", actual: 16430, anterior: 14950 },
    { etapa: "Leads CRM", actual: 13610, anterior: 11480 },
    { etapa: "Inscritos", actual: 690, anterior: 610 },
    { etapa: "Admitidos", actual: 318, anterior: 296 },
    { etapa: "Matriculados", actual: 136, anterior: 141, estado: "parcial" }
  ],
  matriculaTotal: { actual: 468, anterior: 455 }, // todas las fuentes, para la meta institucional
  inversionConversionAnterior: 330000000,

  // Serie histórica: inversión de conversión, leads CRM y matrículas de pauta por periodo.
  historico: [
    { periodo: "2024-1", inversion: 232000000, leadsCrm: 8900, matriculas: 118 },
    { periodo: "2024-2", inversion: 258000000, leadsCrm: 9650, matriculas: 124 },
    { periodo: "2025-1", inversion: 297000000, leadsCrm: 10900, matriculas: 133 },
    { periodo: "2025-2", inversion: 330000000, leadsCrm: 11480, matriculas: 141 },
    { periodo: "2026-1", inversion: 352000000, leadsCrm: 12300, matriculas: 138 },
    { periodo: "2026-2", inversion: 380000000, leadsCrm: 13610, matriculas: 136 }
  ],

  // Programas. Inversión y leads de plataforma por homologación de campaña;
  // leads CRM y matrículas por programa de interés en el CRM.
  // meta y matriculaTotal: meta institucional y matrícula de todas las fuentes.
  programas: [
    { programa: "Medicina", nivel: "Pregrado", inversion: 72000000, leadsPlataforma: 2900, leadsCrm: 2480, matriculas: 38, matriculaTotal: 118, meta: 130 },
    { programa: "Ingeniería de Sistemas", nivel: "Pregrado", inversion: 41200000, leadsPlataforma: 2020, leadsCrm: 1700, matriculas: 18, matriculaTotal: 54, meta: 60 },
    { programa: "Psicología", nivel: "Pregrado", inversion: 38500000, leadsPlataforma: 2150, leadsCrm: 1890, matriculas: 21, matriculaTotal: 62, meta: 65 },
    { programa: "Administración de Empresas", nivel: "Pregrado", inversion: 34800000, leadsPlataforma: 1880, leadsCrm: 1610, matriculas: 14, matriculaTotal: 47, meta: 50 },
    { programa: "Derecho", nivel: "Pregrado", inversion: 30600000, leadsPlataforma: 1540, leadsCrm: 1330, matriculas: 12, matriculaTotal: 43, meta: 45 },
    { programa: "Diseño Gráfico", nivel: "Pregrado", inversion: 19400000, leadsPlataforma: 980, leadsCrm: 820, matriculas: 6, matriculaTotal: 27, meta: 30 },
    { programa: "Campaña general pregrado", nivel: "Pregrado", inversion: 14500000, leadsPlataforma: 710, leadsCrm: 590, matriculas: 3, matriculaTotal: null, meta: null, estado: "no-aplica" },
    { programa: "MBA", nivel: "Posgrado", inversion: 36900000, leadsPlataforma: 1080, leadsCrm: 760, matriculas: 5, matriculaTotal: 33, meta: 40 },
    { programa: "Especialización en Gerencia de Proyectos", nivel: "Posgrado", inversion: 31600000, leadsPlataforma: 1150, leadsCrm: 880, matriculas: 7, matriculaTotal: 31, meta: 35 },
    { programa: "Maestría en Salud Pública", nivel: "Posgrado", inversion: 28400000, leadsPlataforma: 820, leadsCrm: 640, matriculas: 6, matriculaTotal: 27, meta: 30 },
    { programa: "Especialización en Derecho Laboral", nivel: "Posgrado", inversion: 18700000, leadsPlataforma: 640, leadsCrm: 520, matriculas: 4, matriculaTotal: 17, meta: 20 },
    { programa: "Maestría en Educación", nivel: "Posgrado", inversion: 13400000, leadsPlataforma: 560, leadsCrm: 390, matriculas: 2, matriculaTotal: 9, meta: 15, estado: "parcial" }
  ],

  // Campañas de mayor inversión (no tienen que sumar el total: la tabla dice qué parte cubren).
  campanas: [
    { campana: "Medicina · registro en sitio", medio: "Meta", objetivo: "Clientes potenciales", inversion: 41800000, resultados: 2140, leadsCrm: 1890, matriculas: 22 },
    { campana: "Medicina · búsqueda programa", medio: "Google Ads", objetivo: "Búsqueda", inversion: 27600000, resultados: 690, leadsCrm: 560, matriculas: 16 },
    { campana: "Marca · búsqueda", medio: "Google Ads", objetivo: "Búsqueda", inversion: 24300000, resultados: 1020, leadsCrm: 860, matriculas: 19 },
    { campana: "Psicología · formulario nativo", medio: "Meta", objetivo: "Clientes potenciales", inversion: 22100000, resultados: 1480, leadsCrm: 1320, matriculas: 11 },
    { campana: "Posgrados · máximo rendimiento", medio: "Google Ads", objetivo: "Máximo rendimiento", inversion: 21400000, resultados: 520, leadsCrm: 380, matriculas: 6 },
    { campana: "Pregrados · video vertical", medio: "TikTok", objetivo: "Clientes potenciales", inversion: 19800000, resultados: 1240, leadsCrm: 610, matriculas: 2 },
    { campana: "MBA · formulario de contacto", medio: "LinkedIn", objetivo: "Clientes potenciales", inversion: 12700000, resultados: 210, leadsCrm: 150, matriculas: 3 },
    { campana: "Remarketing · pregrados", medio: "Meta", objetivo: "Conversiones", inversion: 9600000, resultados: 380, leadsCrm: 350, matriculas: null, estado: "sin-dato" }
  ],

  // Branding y eventos: se leen por alcance y costo, no por lead ni matrícula.
  branding: [
    { linea: "Marca · DOOH y audio", medio: "Programática", inversion: 16500000, impresiones: 18000000, alcance: null, registros: null },
    { linea: "Marca · alcance", medio: "Meta", inversion: 4300000, impresiones: 5200000, alcance: 1480000, registros: null },
    { linea: "Open House · registro al evento", medio: "Meta", inversion: 3200000, impresiones: 1100000, alcance: 410000, registros: 860 }
  ],

  // Creativos destacados. imagen: ruta relativa a la miniatura (null = marcador neutro).
  // formato "vertical" para 9:16 (Reels, TikTok). Métricas nativas de la plataforma.
  piezas: [
    { medio: "Meta", programa: "Medicina", nombre: "video_testimonio-medicina_mar", mensaje: "Seis años que empiezan con una visita al hospital", resultados: 612, costo: 14200, ctr: 2.4, imagen: null, formato: "vertical" },
    { medio: "Meta", programa: "Psicología", nombre: "img_practicas-psicologia_abr", mensaje: "Prácticas desde el cuarto semestre", resultados: 488, costo: 15900, ctr: 2.1, imagen: null },
    { medio: "Meta", programa: "Gerencia de Proyectos", nombre: "carrusel_fin-de-semana_may", mensaje: "Especialización en un año, con clases el fin de semana", resultados: 301, costo: 24300, ctr: 1.6, imagen: null },
    { medio: "TikTok", programa: "Diseño Gráfico", nombre: "video_un-dia-en-el-taller_may", mensaje: "Un día en el taller, contado por una estudiante", resultados: 214, costo: 18700, ctr: 1.1, imagen: null, formato: "vertical" }
  ],
  anuncios: [
    { url: "Patrocinado · dominio-del-cliente.edu.co/medicina", titulo: "Medicina en Universidad Andina | Inscripciones 2026-2", descripcion: "Plan de estudios con prácticas desde el primer año. Conoce requisitos, costos y fechas de admisión.", grupo: "Medicina · búsqueda", conversiones: 690, inversion: 27600000 },
    { url: "Patrocinado · dominio-del-cliente.edu.co/posgrados", titulo: "Posgrados en Bogotá | Clases el fin de semana", descripcion: "Especializaciones y maestrías en modalidad presencial y virtual. Habla con un asesor hoy.", grupo: "Posgrados · búsqueda", conversiones: 214, inversion: 9800000 }
  ],
  palabras: [
    { palabra: "universidad andina", concordancia: "Frase", conversiones: 640, inversion: 9800000, ctr: 28.4 },
    { palabra: "estudiar medicina en bogotá", concordancia: "Frase", conversiones: 310, inversion: 11200000, ctr: 9.6 },
    { palabra: "carrera de psicología", concordancia: "Amplia", conversiones: 226, inversion: 6100000, ctr: 8.2 },
    { palabra: "especialización gerencia de proyectos", concordancia: "Frase", conversiones: 118, inversion: 4900000, ctr: 7.4 },
    { palabra: "mba bogotá", concordancia: "Exacta", conversiones: 74, inversion: 5300000, ctr: 5.1 }
  ],

  // Módulo opcional: contactabilidad (agente de voz o centro de contacto). null si no aplica.
  contacto: { base: 6800, contactados: 3150, conInteres: 540, inscritosTrasLlamada: 96, matriculadosTrasLlamada: null }
};
/* ======================== fin de DATOS · lo que sigue es lógica ======================== */


/* ============================== 2. Formato ============================== */
const fmtEntero = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0, useGrouping: "always" });
const fmtDecimal = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: "always" });
const fmtDos = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: "always" });

const ETIQUETAS = { "parcial": "Parcial", "preliminar": "Preliminar", "no-aplica": "No aplica", "sin-dato": "Sin dato", "entregado": "Entregado" };
const MODIFICADOR = { "parcial": "parcial", "preliminar": "parcial", "no-aplica": "na", "sin-dato": "sin", "entregado": "ok" };
const estado = clave => `<span class="ad-estado ad-estado--${MODIFICADOR[clave]}">${ETIQUETAS[clave]}</span>`;
const vacio = v => v === null || v === undefined || Number.isNaN(v) || v === Infinity;
const sinDato = () => estado("sin-dato");

const entero = v => vacio(v) ? sinDato() : fmtEntero.format(Math.round(v));
const pesos = v => vacio(v) ? sinDato() : "$" + fmtEntero.format(Math.round(v));
const millones = v => vacio(v) ? sinDato() : "$" + fmtDecimal.format(v / 1e6) + " M";
const pct = (v, dec = 1) => vacio(v) ? sinDato() : (dec === 2 ? fmtDos : fmtDecimal).format(v) + " %";
const dividir = (a, b) => (vacio(a) || vacio(b) || b === 0) ? null : a / b;
const variacion = (actual, anterior) => dividir(actual - anterior, anterior);
const conSigno = v => vacio(v) ? sinDato() : (v > 0 ? "+" : v < 0 ? "−" : "") + fmtDecimal.format(Math.abs(v * 100)) + " %";
const escapar = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const $ = id => document.getElementById(id);
const suma = (filas, campo) => filas.reduce((s, f) => s + (vacio(f[campo]) ? 0 : f[campo]), 0);

// menorEsMejor: en costos, bajar es bueno. Devuelve texto con palabra, no solo color.
function lecturaVariacion(actual, anterior, menorEsMejor) {
  const v = variacion(actual, anterior);
  if (vacio(v)) return `<span class="ad-kpi__m">vs. ${DATOS.periodo.equivalente}: ${sinDato()}</span>`;
  const mejora = menorEsMejor ? v < 0 : v > 0;
  const clase = v === 0 ? "" : mejora ? " cierre-var--bien" : " cierre-var--mal";
  const palabra = v === 0 ? "igual" : mejora ? "mejor" : "peor";
  return `<span class="ad-kpi__m cierre-var${clase}"><b>${conSigno(v)}</b> vs. ${DATOS.periodo.equivalente} · ${palabra}</span>`;
}


/* ============================== 3. Cálculos únicos ============================== */
const T = (() => {
  const m = DATOS.medios;
  const inversionConversion = suma(m, "inversion");
  const inversionTotal = suma(DATOS.frentes, "inversion");
  const leadsPlataforma = suma(m, "leadsPlataforma");
  const leadsCrm = suma(m, "leadsCrm");
  const matriculas = suma(m, "matriculas");
  const ant = DATOS.embudo;
  return {
    inversionConversion, inversionTotal, leadsPlataforma, leadsCrm, matriculas,
    cplCrm: dividir(inversionConversion, leadsCrm),
    costoMatricula: dividir(inversionConversion, matriculas),
    conversion: dividir(matriculas, leadsCrm),
    anterior: {
      leadsPlataforma: ant[0].anterior,
      leadsCrm: ant[1].anterior,
      matriculas: ant[4].anterior,
      cplCrm: dividir(DATOS.inversionConversionAnterior, ant[1].anterior),
      costoMatricula: dividir(DATOS.inversionConversionAnterior, ant[4].anterior),
      conversion: dividir(ant[4].anterior, ant[1].anterior)
    }
  };
})();


/* ============================== 4. Pintado por sección ============================== */
function pintarKpi() {
  const el = $("cierre-kpi");
  if (!el) return;
  const a = T.anterior;
  const filas = [
    ["Inversión total", millones(T.inversionTotal), `<span class="ad-kpi__m">${millones(T.inversionConversion)} de conversión · ${millones(T.inversionTotal - T.inversionConversion)} de branding</span>`],
    ["Leads plataforma", entero(T.leadsPlataforma), lecturaVariacion(T.leadsPlataforma, a.leadsPlataforma, false)],
    ["Leads CRM", entero(T.leadsCrm), lecturaVariacion(T.leadsCrm, a.leadsCrm, false)],
    ["CPL CRM", pesos(T.cplCrm), lecturaVariacion(T.cplCrm, a.cplCrm, true)],
    ["Matrículas de pauta " + estado("parcial"), entero(T.matriculas), lecturaVariacion(T.matriculas, a.matriculas, false), true],
    ["Costo por matrícula", millones(T.costoMatricula), lecturaVariacion(T.costoMatricula, a.costoMatricula, true)],
    ["Conversión CRM → matrícula", pct(T.conversion * 100, 2), lecturaVariacion(T.conversion, a.conversion, false)]
  ];
  el.innerHTML = filas.map(([dt, dd, nota, clave]) => `<div class="ad-kpi${clave ? " ad-kpi--on" : ""}"><span class="ad-kpi__l">${dt}</span><span class="ad-kpi__n">${dd}</span>${nota}</div>`).join("");
}

function pintarFrentes() {
  const el = $("cierre-frentes");
  if (!el) return;
  const mayor = Math.max(...DATOS.frentes.map(f => f.inversion));
  el.innerHTML = DATOS.frentes.map((f, i) => {
    const parte = dividir(f.inversion, T.inversionTotal);
    return `<div><dt>${escapar(f.nombre)}${f.nota ? `<small>${escapar(f.nota)}</small>` : ""}</dt>
      <dd><span class="ad-barra" style="--v:${(parte * 100).toFixed(1)}%" aria-hidden="true"><span></span></span></dd>
      <dd class="cierre-valor">${pct(parte * 100)}<small>${millones(f.inversion)}</small></dd></div>`;
  }).join("");
}

function pintarMetas() {
  const el = $("cierre-metas");
  if (!el) return;
  const m = DATOS.metas;
  const escala = 1.2; // la pista llega a 120 % de la meta; la marca queda en 100 %
  const filas = [
    { nombre: "Ejecución de presupuesto", nota: `${millones(T.inversionTotal)} de ${millones(m.presupuesto)}`, real: T.inversionTotal, meta: m.presupuesto },
    { nombre: "Leads CRM", nota: `${entero(T.leadsCrm)} de ${entero(m.leadsCrm)}`, real: T.leadsCrm, meta: m.leadsCrm },
    { nombre: "Matrícula institucional", nota: `${entero(DATOS.matriculaTotal.actual)} de ${entero(m.matriculas)} · todas las fuentes`, real: DATOS.matriculaTotal.actual, meta: m.matriculas, destacar: true },
    { nombre: "CPL CRM (tope)", nota: `${pesos(T.cplCrm)} con tope de ${pesos(m.cplCrm)} · menor es mejor`, real: T.cplCrm, meta: m.cplCrm }
  ];
  el.innerHTML = filas.map(f => {
    const c = dividir(f.real, f.meta);
    const ancho = Math.min(c / escala, 1) * 100;
    return `<div><dt>${f.nombre}<small>${f.nota}</small></dt>
      <dd><span class="ad-barra${f.destacar ? " ad-barra--on" : ""}" style="--v:${ancho.toFixed(1)}%;--meta:${(100 / escala).toFixed(2)}%" aria-hidden="true"><span></span><i></i></span></dd>
      <dd class="cierre-valor">${pct(c * 100)}</dd></div>`;
  }).join("");
}

function columnas(contenedor, ejes, datos, opciones) {
  const max = Math.max(...datos.map(d => d.total)) || 1;
  contenedor.innerHTML = datos.map(d => {
    const segmentos = d.valores.map((v, i) => v > 0
      ? `<span class="s${i + 1}" style="height:${(v / max * 100).toFixed(2)}%" title="${escapar(opciones.series ? opciones.series[i] : d.etiqueta)}: ${opciones.formato(v)}"></span>` : "").join("");
    return `<div class="cierre-col${d.actual ? " cierre-col--actual" : ""}">
      <span class="cierre-col__valor">${opciones.formato(d.total)}</span>
      <div class="cierre-col__pila" style="height:${(d.total / max * 100).toFixed(2)}%">${segmentos}</div></div>`;
  }).join("");
  // la pila ocupa su altura total; cada segmento se reescala dentro de ella
  contenedor.querySelectorAll(".cierre-col__pila").forEach((pila, i) => {
    const d = datos[i];
    pila.querySelectorAll("span").forEach((s, j) => {
      const v = d.valores.filter(x => x > 0)[j];
      s.style.height = (v / d.total * 100).toFixed(2) + "%";
    });
  });
  ejes.innerHTML = datos.map(d => `<span>${escapar(d.etiqueta)}</span>`).join("");
}

function pintarRitmo() {
  const el = $("cierre-ritmo");
  if (!el) return;
  const nombres = DATOS.medios.map(m => m.medio);
  columnas(el, $("cierre-ritmo-ejes"), DATOS.ritmo.map(r => ({
    etiqueta: r.mes + (r.estado ? "*" : ""), valores: r.valores, total: r.valores.reduce((a, b) => a + b, 0)
  })), { formato: v => millones(v).replace(" M", ""), series: nombres });
  $("cierre-ritmo-leyenda").innerHTML = nombres.map((n, i) => `<li><i class="s${i + 1}" aria-hidden="true"></i>${escapar(n)}</li>`).join("");
  const pico = DATOS.ritmo.reduce((a, r) => { const t = r.valores.reduce((x, y) => x + y, 0); return t > a.t ? { mes: r.mes, t } : a; }, { t: 0 });
  $("cierre-ritmo-tabla").innerHTML = DATOS.ritmo.map(r => {
    const t = r.valores.reduce((a, b) => a + b, 0);
    return `<tr><th scope="row">${r.mes}${r.estado ? " " + estado(r.estado) : ""}</th>${r.valores.map(v => `<td class="valor">${pesos(v)}</td>`).join("")}<td class="valor">${pesos(t)}</td></tr>`;
  }).join("");
  $("cierre-ritmo-cabeza").innerHTML = `<th scope="col">Mes</th>${nombres.map(n => `<th scope="col" class="valor">${escapar(n)}</th>`).join("")}<th scope="col" class="valor">Total</th>`;
  const pi = $("cierre-ritmo-pico");
  if (pi) pi.textContent = `${pico.mes}: ${millones(pico.t)}`;
}

function pintarMedios() {
  const cuerpo = $("cierre-medios");
  if (!cuerpo) return;
  const mayorMatricula = Math.max(...DATOS.medios.map(m => m.matriculas || 0));
  const fila = (m, th) => {
    const cplCrm = dividir(m.inversion, m.leadsCrm);
    return `<tr><${th} scope="row">${escapar(m.medio)}${m.nota ? `<br><small class="formato-nota">${escapar(m.nota)}</small>` : ""}</${th}>
      <td class="valor">${pesos(m.inversion)}</td>
      <td class="valor">${pct(dividir(m.inversion, T.inversionConversion) * 100)}</td>
      <td class="valor">${entero(m.impresiones)}</td>
      <td class="valor">${pct(dividir(m.clics, m.impresiones) * 100, 2)}</td>
      <td class="valor">${entero(m.leadsPlataforma)}</td>
      <td class="valor">${entero(m.leadsCrm)}</td>
      <td class="valor">${pct(dividir(m.leadsCrm, m.leadsPlataforma) * 100)}</td>
      <td class="valor">${pesos(cplCrm)}</td>
      <td class="valor">${entero(m.matriculas)}</td>
      <td class="valor">${pct(dividir(m.matriculas, m.leadsCrm) * 100, 2)}</td>
      <td class="valor">${pesos(dividir(m.inversion, m.matriculas))}</td></tr>`;
  };
  cuerpo.innerHTML = DATOS.medios.map(m => fila(m, "th")).join("");
  $("cierre-medios-total").innerHTML = fila({
    medio: "Total conversión", inversion: T.inversionConversion, impresiones: suma(DATOS.medios, "impresiones"),
    clics: suma(DATOS.medios, "clics"), leadsPlataforma: T.leadsPlataforma, leadsCrm: T.leadsCrm, matriculas: T.matriculas
  }, "th");
}

function pintarEmbudo() {
  const el = $("cierre-embudo");
  if (!el) return;
  const e = DATOS.embudo;
  // el cuello de botella es el paso con la caída relativa más grande frente al periodo equivalente
  let cuello = -1, peor = Infinity;
  for (let i = 1; i < e.length; i++) {
    const d = dividir(e[i].actual, e[i - 1].actual) - dividir(e[i].anterior, e[i - 1].anterior);
    if (d < peor) { peor = d; cuello = i; }
  }
  // la lima marca el paso con la mayor caída (is-on); el último paso ya no se pinta solo
  el.innerHTML = e.map((s, i) => `<li class="ad-paso${i === cuello ? " is-on" : ""}">
      <span class="ad-n" aria-hidden="true">${i + 1}</span>
      <h3>${escapar(s.etapa)}${s.estado ? " " + estado(s.estado) : ""}</h3>
      <p class="cierre-embudo__n">${entero(s.actual)}</p>
      <p class="cierre-embudo__tasa">${i === 0 ? "base del embudo" : pct(dividir(s.actual, e[i - 1].actual) * 100) + " de la etapa anterior"}${i === cuello ? ' <span class="ad-estado ad-estado--alerta">Mayor caída</span>' : ""}</p>
      <p class="cierre-embudo__antes">${DATOS.periodo.equivalente}: ${entero(s.anterior)}${i === 0 ? "" : " · " + pct(dividir(s.anterior, e[i - 1].anterior) * 100)}</p>
    </li>`).join("");
  $("cierre-embudo-tabla").innerHTML = e.map((s, i) => `<tr><th scope="row">${escapar(s.etapa)}${s.estado ? " " + estado(s.estado) : ""}</th>
      <td class="valor">${entero(s.anterior)}</td><td class="valor">${i ? pct(dividir(s.anterior, e[i - 1].anterior) * 100) : "—"}</td>
      <td class="valor">${entero(s.actual)}</td><td class="valor">${i ? pct(dividir(s.actual, e[i - 1].actual) * 100) : "—"}</td>
      <td class="valor">${conSigno(variacion(s.actual, s.anterior))}</td></tr>`).join("");
}

function pintarHistorico() {
  const inv = $("cierre-hist-inversion");
  if (!inv) return;
  const h = DATOS.historico;
  const actual = DATOS.periodo.actual;
  columnas(inv, $("cierre-hist-inversion-ejes"), h.map(p => ({ etiqueta: p.periodo, valores: [p.inversion], total: p.inversion, actual: p.periodo === actual })),
    { formato: v => millones(v).replace(" M", "") });
  columnas($("cierre-hist-conversion"), $("cierre-hist-conversion-ejes"), h.map(p => {
    const c = dividir(p.matriculas, p.leadsCrm) * 100;
    return { etiqueta: p.periodo, valores: [c], total: c, actual: p.periodo === actual };
  }), { formato: v => fmtDos.format(v) + " %" });
  $("cierre-hist-tabla").innerHTML = h.map((p, i) => {
    const marca = p.periodo === actual ? " · este cierre" : p.periodo === DATOS.periodo.equivalente ? " · equivalente" : "";
    return `<tr><th scope="row">${p.periodo}${marca}</th><td class="valor">${pesos(p.inversion)}</td>
      <td class="valor">${i ? conSigno(variacion(p.inversion, h[i - 1].inversion)) : "—"}</td>
      <td class="valor">${entero(p.leadsCrm)}</td><td class="valor">${pesos(dividir(p.inversion, p.leadsCrm))}</td>
      <td class="valor">${entero(p.matriculas)}</td><td class="valor">${pct(dividir(p.matriculas, p.leadsCrm) * 100, 2)}</td></tr>`;
  }).join("");
}

function pintarNiveles() {
  const el = $("cierre-niveles");
  if (!el) return;
  const niveles = [...new Set(DATOS.programas.map(p => p.nivel))];
  const filas = niveles.map(n => {
    const ps = DATOS.programas.filter(p => p.nivel === n);
    return { nivel: n, inversion: suma(ps, "inversion"), leadsPlataforma: suma(ps, "leadsPlataforma"), leadsCrm: suma(ps, "leadsCrm"),
      matriculas: suma(ps, "matriculas"), matriculaTotal: suma(ps, "matriculaTotal"), meta: suma(ps, "meta") };
  });
  el.innerHTML = filas.map(f => `<tr><th scope="row">${f.nivel}</th>
    <td class="valor">${pesos(f.inversion)}</td><td class="valor">${pct(dividir(f.inversion, T.inversionConversion) * 100)}</td>
    <td class="valor">${entero(f.leadsPlataforma)}</td><td class="valor">${entero(f.leadsCrm)}</td>
    <td class="valor">${pesos(dividir(f.inversion, f.leadsCrm))}</td><td class="valor">${entero(f.matriculas)}</td>
    <td class="valor">${pct(dividir(f.matriculas, T.matriculas) * 100)}</td>
    <td class="valor">${entero(f.matriculaTotal)} de ${entero(f.meta)}</td><td class="valor">${pct(dividir(f.matriculaTotal, f.meta) * 100)}</td></tr>`).join("");
}

/* Programas: filtro por nivel (chips) y orden por columna (botones en el encabezado). */
const COLUMNAS_PROGRAMA = [
  { clave: "programa", titulo: "Programa", texto: true },
  { clave: "nivel", titulo: "Nivel", texto: true },
  { clave: "inversion", titulo: "Inversión", f: pesos },
  { clave: "leadsPlataforma", titulo: "Leads plat.", f: entero },
  { clave: "leadsCrm", titulo: "Leads CRM", f: entero },
  { clave: "cplCrm", titulo: "CPL CRM", f: pesos },
  { clave: "matriculas", titulo: "Matr. pauta", f: entero },
  { clave: "conversion", titulo: "% conv. pauta", f: v => pct(v, 2) },
  { clave: "costoMatricula", titulo: "Costo por matr.", f: pesos },
  { clave: "matriculaTotal", titulo: "Matr. total", f: entero },
  { clave: "meta", titulo: "Meta", f: entero },
  { clave: "ejecucion", titulo: "% ejecución", f: v => pct(v) }
];
const estadoProgramas = { nivel: "Todos", orden: "inversion", dir: -1 };
const programasCalculados = () => DATOS.programas.map(p => ({
  ...p,
  cplCrm: dividir(p.inversion, p.leadsCrm),
  conversion: dividir(p.matriculas, p.leadsCrm) === null ? null : dividir(p.matriculas, p.leadsCrm) * 100,
  costoMatricula: dividir(p.inversion, p.matriculas),
  ejecucion: dividir(p.matriculaTotal, p.meta) === null ? null : dividir(p.matriculaTotal, p.meta) * 100
}));

function pintarProgramas() {
  const cuerpo = $("cierre-programas");
  if (!cuerpo) return;
  const { nivel, orden, dir } = estadoProgramas;
  const col = COLUMNAS_PROGRAMA.find(c => c.clave === orden);
  const filas = programasCalculados()
    .filter(p => nivel === "Todos" || p.nivel === nivel)
    .sort((a, b) => {
      const x = a[orden], y = b[orden];
      if (vacio(x)) return 1;
      if (vacio(y)) return -1;
      return col.texto ? dir * String(x).localeCompare(String(y), "es") : dir * (x - y);
    });
  cuerpo.innerHTML = filas.map(p => `<tr>${COLUMNAS_PROGRAMA.map((c, i) => {
    if (i === 0) return `<th scope="row">${escapar(p.programa)}${p.estado ? " " + estado(p.estado) : ""}</th>`;
    if (c.texto) return `<td>${escapar(p[c.clave])}</td>`;
    if (p.estado === "no-aplica" && ["matriculaTotal", "meta", "ejecucion"].includes(c.clave)) return `<td class="valor">${estado("no-aplica")}</td>`;
    return `<td class="valor">${c.f(p[c.clave])}</td>`;
  }).join("")}</tr>`).join("");
  document.querySelectorAll("#cierre-programas-cabeza th").forEach(th => {
    th.setAttribute("aria-sort", th.dataset.clave === orden ? (dir === 1 ? "ascending" : "descending") : "none");
  });
  $("cierre-programas-estado").textContent = `${filas.length} programas · ${nivel === "Todos" ? "todos los niveles" : nivel} · orden por ${col.titulo.toLowerCase()}`;
}

function montarProgramas() {
  const cabeza = $("cierre-programas-cabeza");
  if (!cabeza) return;
  cabeza.innerHTML = COLUMNAS_PROGRAMA.map(c => `<th scope="col" data-clave="${c.clave}"${c.texto ? "" : ' class="valor"'}><button type="button">${c.titulo}</button></th>`).join("");
  cabeza.addEventListener("click", ev => {
    const th = ev.target.closest("th");
    if (!th) return;
    const clave = th.dataset.clave;
    estadoProgramas.dir = estadoProgramas.orden === clave ? -estadoProgramas.dir : (COLUMNAS_PROGRAMA.find(c => c.clave === clave).texto ? 1 : -1);
    estadoProgramas.orden = clave;
    pintarProgramas();
  });
  const chips = $("cierre-programas-chips");
  const niveles = ["Todos", ...new Set(DATOS.programas.map(p => p.nivel))];
  chips.innerHTML = niveles.map(n => `<button type="button" class="ad-chip" aria-pressed="${n === "Todos"}">${n}</button>`).join("");
  chips.addEventListener("click", ev => {
    const b = ev.target.closest("button");
    if (!b) return;
    chips.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    estadoProgramas.nivel = b.textContent;
    pintarProgramas();
  });
  pintarProgramas();

  // Extremos: solo programas con meta y sin estado especial; mínimo 300 leads CRM para no leer ruido.
  const comparables = programasCalculados().filter(p => !p.estado && p.leadsCrm >= 300 && !vacio(p.conversion));
  const orden = [...comparables].sort((a, b) => b.conversion - a.conversion);
  const li = p => `<li><span>${escapar(p.programa)}<small>${p.nivel} · ${entero(p.leadsCrm)} leads CRM · ${entero(p.matriculas)} matr.</small></span><span>${pct(p.conversion, 2)}<small>${pesos(p.costoMatricula)} por matr.</small></span></li>`;
  $("cierre-mejores").innerHTML = orden.slice(0, 3).map(li).join("");
  $("cierre-menores").innerHTML = orden.slice(-3).reverse().map(li).join("");
}

function pintarCampanas() {
  const el = $("cierre-campanas");
  if (!el) return;
  el.innerHTML = DATOS.campanas.map(c => `<tr><th scope="row">${escapar(c.campana)}${c.estado ? " " + estado(c.estado) : ""}</th><td>${escapar(c.medio)}</td><td>${escapar(c.objetivo)}</td>
    <td class="valor">${pesos(c.inversion)}</td><td class="valor">${entero(c.resultados)}</td><td class="valor">${pesos(dividir(c.inversion, c.resultados))}</td>
    <td class="valor">${entero(c.leadsCrm)}</td><td class="valor">${pesos(dividir(c.inversion, c.leadsCrm))}</td><td class="valor">${entero(c.matriculas)}</td></tr>`).join("");
  const cubierto = suma(DATOS.campanas, "inversion");
  $("cierre-campanas-cobertura").textContent = `${DATOS.campanas.length} campañas de mayor inversión · ${millones(cubierto)}, el ${fmtDecimal.format(cubierto / T.inversionConversion * 100)} % de la inversión de conversión.`;

  const b = DATOS.branding;
  $("cierre-branding").innerHTML = b.map(f => `<tr><th scope="row">${escapar(f.linea)}</th><td>${escapar(f.medio)}</td>
    <td class="valor">${pesos(f.inversion)}</td><td class="valor">${entero(f.impresiones)}</td><td class="valor">${pesos(dividir(f.inversion, f.impresiones) * 1000)}</td>
    <td class="valor">${f.alcance === null ? estado("no-aplica") : entero(f.alcance)}</td><td class="valor">${f.registros === null ? estado("no-aplica") : entero(f.registros)}</td></tr>`).join("");
  $("cierre-branding-total").innerHTML = `<th scope="row">Total branding y eventos</th><td></td><td class="valor">${pesos(suma(b, "inversion"))}</td><td class="valor">${entero(suma(b, "impresiones"))}</td><td class="valor">${pesos(dividir(suma(b, "inversion"), suma(b, "impresiones")) * 1000)}</td><td class="valor">—</td><td class="valor">—</td>`;
}

function pintarCreativos() {
  const el = $("cierre-piezas");
  if (!el) return;
  el.innerHTML = DATOS.piezas.map((p, i) => {
    const vertical = p.formato === "vertical";
    return `<li class="ad-card cierre-pieza">
      ${p.imagen ? `<img class="cierre-img${vertical ? " cierre-img--vertical" : ""}" src="${escapar(p.imagen)}" alt="Pieza ${escapar(p.nombre)} de ${escapar(p.programa)}" loading="lazy">`
                 : `<div class="ad-marcador ad-marcador--${vertical ? "9x16" : "4x5"}" role="img" aria-label="Marcador de la pieza ${escapar(p.nombre)}">Miniatura de la pieza<br>${vertical ? "9:16" : "4:5"}</div>`}
      <p class="cierre-pieza__cab"><span class="ad-n" aria-hidden="true">${i + 1}</span>${escapar(p.medio)} · ${escapar(p.programa)}</p>
      <h3>${escapar(p.mensaje)}</h3>
      <code>${escapar(p.nombre)}</code>
      <dl><div><dt>Resultados</dt><dd>${entero(p.resultados)}</dd></div><div><dt>Costo</dt><dd>${pesos(p.costo)}</dd></div><div><dt>CTR</dt><dd>${pct(p.ctr)}</dd></div></dl>
    </li>`;
  }).join("");
  $("cierre-anuncios").innerHTML = DATOS.anuncios.map(a => `<li class="ad-card cierre-anuncio">
      <p class="ad-card__n cierre-anuncio__url">${escapar(a.url)}</p><h4>${escapar(a.titulo)}</h4><p class="ad-card__d">${escapar(a.descripcion)}</p>
      <p class="cierre-anuncio__datos">${escapar(a.grupo)} · ${entero(a.conversiones)} conversiones · ${pesos(a.inversion)} · ${pesos(dividir(a.inversion, a.conversiones))} por conversión</p></li>`).join("");
  $("cierre-palabras").innerHTML = DATOS.palabras.map(p => `<tr><th scope="row">${escapar(p.palabra)}</th><td>${p.concordancia}</td>
    <td class="valor">${entero(p.conversiones)}</td><td class="valor">${pesos(p.inversion)}</td><td class="valor">${pesos(dividir(p.inversion, p.conversiones))}</td><td class="valor">${pct(p.ctr)}</td></tr>`).join("");
}

function pintarContacto() {
  const el = $("cierre-contacto");
  if (!el) return;
  const c = DATOS.contacto;
  if (!c) { el.innerHTML = `<div class="ad-kpi"><span class="ad-kpi__l">Contactabilidad</span><span class="ad-kpi__n">${estado("no-aplica")}</span></div>`; return; }
  el.innerHTML = [
    ["Base gestionada", entero(c.base), "leads de pauta enviados a contacto"],
    ["Contactados", entero(c.contactados), pct(dividir(c.contactados, c.base) * 100) + " de la base"],
    ["Con interés confirmado", entero(c.conInteres), pct(dividir(c.conInteres, c.contactados) * 100) + " de los contactados"],
    ["Inscritos tras la llamada", entero(c.inscritosTrasLlamada), pct(dividir(c.inscritosTrasLlamada, c.conInteres) * 100) + " de los interesados"],
    ["Matriculados tras la llamada", entero(c.matriculadosTrasLlamada), "cruce con matrícula pendiente"]
  ].map(([dt, dd, s], i) => `<div class="ad-kpi"><span class="ad-kpi__l">${dt}</span><span class="ad-kpi__n">${dd}</span><span class="ad-kpi__m">${s}</span></div>`).join("");
}

function iniciar() {
  pintarKpi();
  pintarFrentes();
  pintarMetas();
  pintarRitmo();
  pintarMedios();
  pintarEmbudo();
  pintarHistorico();
  pintarNiveles();
  montarProgramas();
  pintarCampanas();
  pintarCreativos();
  pintarContacto();
  const imprimir = $("cierre-imprimir");
  if (imprimir) { imprimir.hidden = false; imprimir.addEventListener("click", () => window.print()); }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
else iniciar();
