/* ============================================================================
   Banco de formatos · Estrategia / ruta estratégica para universidades
   ----------------------------------------------------------------------------
   Este archivo pinta las cifras de la plantilla: portada, radiografía de la
   cuenta, embudo pauta frente a otros canales, inversión (totales, por medio,
   por mes y por programa) y escenarios. Todo lo demás es texto en el HTML.

   Cómo se usa: se reemplaza SOLO el bloque DATOS. La lógica de abajo calcula
   leads, matrículas, totales y porcentajes; no se escriben totales a mano.
   Reglas de cálculo (iguales al flow de medios del banco):
     leads      = presupuesto ÷ CPL, redondeado hacia abajo
     matrículas = leads × conversión lead → matrícula, redondeado hacia abajo
   Una cifra que no existe se deja en null: la plantilla escribe «Sin dato».
   ========================================================================= */

/* ===================== Reemplazar con los datos del cliente ===================== */
const DATOS = {
  moneda: 'COP',

  /* Meta institucional del periodo para los programas con pauta (Admisiones).
     La proyección digital se compara contra esta cifra. */
  metaInstitucional: null, // null = suma de metaInstitucional por programa

  /* Una fila por programa con presupuesto de captación (performance).
     rol: Tractor · Competitivo · Nicho rentable · Alerta de producto · No aplica
     conversion: lead → matrícula de la planeación (fracción: 0.032 = 3,2 %). */
  programas: [
    { nivel: 'Pregrado', programa: 'Administración de Empresas', modalidad: 'Virtual', rol: 'Tractor', presupuesto: 52000000, cpl: 24000, conversion: 0.032, metaInstitucional: 120 },
    { nivel: 'Pregrado', programa: 'Psicología', modalidad: 'Presencial', rol: 'Tractor', presupuesto: 56000000, cpl: 27000, conversion: 0.028, metaInstitucional: 150 },
    { nivel: 'Pregrado', programa: 'Derecho', modalidad: 'Presencial', rol: 'Competitivo', presupuesto: 64000000, cpl: 31000, conversion: 0.024, metaInstitucional: 140 },
    { nivel: 'Pregrado', programa: 'Ingeniería de Sistemas', modalidad: 'Presencial', rol: 'Competitivo', presupuesto: 48000000, cpl: 29000, conversion: 0.026, metaInstitucional: 100 },
    { nivel: 'Pregrado', programa: 'Diseño Gráfico', modalidad: 'Presencial', rol: 'Alerta de producto', presupuesto: 22000000, cpl: 34000, conversion: 0.016, metaInstitucional: 40 },
    { nivel: 'Pregrado', programa: 'Campaña general pregrado', modalidad: 'Mixta', rol: 'No aplica', presupuesto: 30000000, cpl: 21000, conversion: 0.018, metaInstitucional: null },
    { nivel: 'Posgrado', programa: 'Especialización en Gerencia de Proyectos', modalidad: 'Virtual', rol: 'Tractor', presupuesto: 42000000, cpl: 38000, conversion: 0.022, metaInstitucional: 60 },
    { nivel: 'Posgrado', programa: 'Maestría en Educación', modalidad: 'Virtual', rol: 'Competitivo', presupuesto: 34000000, cpl: 36000, conversion: 0.024, metaInstitucional: 70 },
    { nivel: 'Posgrado', programa: 'Maestría en Analítica de Datos', modalidad: 'Virtual', rol: 'Nicho rentable', presupuesto: 46000000, cpl: 52000, conversion: 0.017, metaInstitucional: 45 },
    { nivel: 'Posgrado', programa: 'Especialización en Derecho Laboral', modalidad: 'Presencial', rol: 'Nicho rentable', presupuesto: 28000000, cpl: 41000, conversion: 0.020, metaInstitucional: 40 }
  ],

  /* Branding: no se mide por CPL; leads y matrículas quedan en «No aplica». */
  branding: [
    { nivel: 'Pregrado', presupuesto: 24000000, nota: 'Quiz vocacional y alcance en audiencia joven' },
    { nivel: 'Posgrado', presupuesto: 16000000, nota: 'Video y programática en audiencia profesional' }
  ],

  /* Reparto por medio dentro de cada bolsa. Cada bolsa suma 1. */
  mezclaMedios: {
    Pregrado: { 'Google Ads': 0.42, 'Meta Ads': 0.40, 'TikTok Ads': 0.18 },
    Posgrado: { 'Google Ads': 0.48, 'Meta Ads': 0.27, 'LinkedIn Ads': 0.25 },
    Branding: { 'Meta Ads': 0.30, 'TikTok Ads': 0.20, 'Programática': 0.35, 'YouTube': 0.15 }
  },

  /* Curva mensual aprobada (peso sobre el total). Suma 1. */
  mensual: [
    { mes: 'ago-26', peso: 0.04 },
    { mes: 'sep-26', peso: 0.10 },
    { mes: 'oct-26', peso: 0.18 },
    { mes: 'nov-26', peso: 0.24 },
    { mes: 'dic-26', peso: 0.20 },
    { mes: 'ene-27', peso: 0.17 },
    { mes: 'feb-27', peso: 0.07 }
  ],

  /* Escenarios del framework (punto 21). Se aplican a cada programa:
     CPL × factorCpl y conversión + deltaConversion (en fracción). */
  escenarios: [
    { nombre: 'Base', factorCpl: 1, deltaConversion: 0, condicion: 'CPL y conversión del plan.', senal: 'Leads con conversación ≥ 55 % y CPL dentro de ±10 % del plan durante dos cortes.', respuesta: 'Operar, monitorear y aprender sin sobrerreaccionar.' },
    { nombre: 'Favorable', factorCpl: 0.9, deltaConversion: 0.003, condicion: 'CPL 10 % menor y +0,3 pp de conversión.', senal: 'Costo por preinscrito 15 % bajo el plan por tres semanas.', respuesta: 'Adelantar presupuesto de enero a diciembre en los programas tractores.' },
    { nombre: 'Restrictivo', factorCpl: 1.2, deltaConversion: -0.004, condicion: 'CPL 20 % mayor y −0,4 pp de conversión.', senal: 'CPL 20 % sobre el plan o contacto efectivo < 40 % por dos cortes.', respuesta: 'Proteger tractores, pausar alertas de producto y avisar a Cuentas.' }
  ],

  /* Radiografía del periodo anterior (CRM). leads/matriculas null = sin atribución. */
  radiografia: {
    periodo: '2026-2',
    corte: '31 jul 2026',
    canales: [
      { canal: 'Google Ads', inversion: 162400000, leads: 3180, matriculas: 58 },
      { canal: 'Meta Ads', inversion: 128700000, leads: 5940, matriculas: 31 },
      { canal: 'TikTok Ads', inversion: 17900000, leads: 610, matriculas: 2 },
      { canal: 'LinkedIn Ads', inversion: 11600000, leads: 240, matriculas: 3 },
      { canal: 'Programática', inversion: 19800000, leads: null, matriculas: null }
    ],
    historico: [
      { periodo: '2025-2', inversion: 205300000, leads: 7410, matriculas: 71, estado: 'Cerrado' },
      { periodo: '2026-1', inversion: 248900000, leads: 8020, matriculas: 102, estado: 'Cerrado' },
      { periodo: '2026-2', inversion: 320600000, leads: 9970, matriculas: 94, estado: 'Parcial' }
    ]
  },

  /* Embudo del CRM, mismo periodo. Etapas en orden; un valor por etapa. */
  embudo: {
    etapas: ['Leads', 'Preinscritos', 'Inscritos', 'Admitidos', 'Matriculados'],
    series: [
      { nombre: 'Pauta', valores: [9970, 299, 214, 199, 94] },
      { nombre: 'Otros canales', valores: [8400, 1260, 940, 890, 720] }
    ]
  }
};
/* ============================ Fin de los datos ============================ */


/* -------------------------------- Lógica -------------------------------- */
(function () {
  'use strict';

  const nf = new Intl.NumberFormat('es-CO', { useGrouping: 'always', maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat('es-CO', { useGrouping: 'always', minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const SIN_DATO = '<span class="ad-estado ad-estado--sin">Sin dato</span>';
  const NO_APLICA = '<span class="ad-estado ad-estado--na">No aplica</span>';

  const n = (v) => nf.format(v);
  const pesos = (v) => '$' + nf.format(Math.round(v));
  const millones = (v) => '$' + nf1.format(v / 1e6).replace(/,0$/, '') + ' M';
  const pct = (v, dec = 1) => (dec ? nf1.format(v * 100) : nf.format(v * 100)) + ' %';
  const $ = (id) => document.getElementById(id);
  const put = (id, html) => {
    const el = $(id);
    if (!el) return;
    const i = html.indexOf('<small>');
    if (i > -1 && el.classList.contains('ad-kpi__n')) {
      /* cifra en .ad-kpi__n y su nota en un .ad-kpi__m hermano */
      el.innerHTML = html.slice(0, i);
      const m = document.createElement('dd');
      m.className = 'ad-kpi__m';
      m.textContent = html.slice(i + 7).replace('</small>', '');
      el.after(m);
    } else el.innerHTML = html;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---- cálculo por programa y escenario ---- */
  function proyectar(p, esc0) {
    const e = esc0 || { factorCpl: 1, deltaConversion: 0 };
    const cpl = p.cpl * e.factorCpl;
    const conv = Math.max(0, p.conversion + e.deltaConversion);
    const leads = cpl > 0 ? Math.floor(p.presupuesto / cpl) : 0;
    const matriculas = Math.floor(leads * conv);
    return { ...p, cplEsc: cpl, convEsc: conv, leads, matriculas };
  }
  const suma = (arr, k) => arr.reduce((t, x) => t + (x[k] || 0), 0);

  const base = DATOS.programas.map((p) => proyectar(p));
  const presFormal = suma(base, 'presupuesto');
  const presBranding = suma(DATOS.branding, 'presupuesto');
  const presTotal = presFormal + presBranding;
  const leadsTot = suma(base, 'leads');
  const matTot = suma(base, 'matriculas');
  const metaTot = DATOS.metaInstitucional ?? suma(DATOS.programas, 'metaInstitucional');

  /* ---- portada ---- */
  put('kpi-presupuesto', millones(presTotal) + '<small>' + pesos(presTotal) + ' ' + DATOS.moneda + '</small>');
  put('kpi-meta', n(metaTot) + '<small>Meta institucional de los programas con pauta</small>');
  put('kpi-matriculas', n(matTot) + '<small>Matrículas proyectadas desde pauta</small>');
  put('kpi-leads', n(leadsTot) + '<small>CPL promedio ' + pesos(presFormal / leadsTot) + ' · conversión ' + pct(matTot / leadsTot) + '</small>');

  const aporte = metaTot ? matTot / metaTot : 0;
  const arco = $('anillo-arco');
  if (arco) {
    const r = Number(arco.getAttribute('r'));
    const c = 2 * Math.PI * r;
    arco.setAttribute('stroke-dasharray', (c * Math.min(aporte, 1)).toFixed(1) + ' ' + c.toFixed(1));
  }
  put('anillo-n', pct(aporte, 0));
  const fig = $('anillo');
  if (fig) fig.setAttribute('aria-label', 'La pauta aporta el ' + pct(aporte, 0) + ' de la meta institucional: ' + n(matTot) + ' de ' + n(metaTot) + ' matrículas.');

  /* ---- radiografía ---- */
  const R = DATOS.radiografia;
  const invTot = suma(R.canales, 'inversion');
  const atribuibles = R.canales.filter((c) => c.leads != null);
  const invAtrib = suma(atribuibles, 'inversion');
  const rLeads = suma(atribuibles, 'leads');
  const rMat = suma(atribuibles, 'matriculas');
  put('rx-inversion', millones(invTot) + '<small>Todos los medios, incluida programática</small>');
  put('rx-leads', n(rLeads) + '<small>Leads en CRM al corte</small>');
  put('rx-matriculas', n(rMat) + '<small>Matrículas atribuidas a pauta</small>');
  put('rx-cpl', pesos(invAtrib / rLeads) + '<small>Sobre inversión atribuible</small>');
  put('rx-conversion', pct(rMat / rLeads, 2) + '<small>Lead → matrícula</small>');
  put('rx-cpa', pesos(invTot / rMat) + '<small>Inversión total ÷ matrículas</small>');

  put('rx-canales', R.canales.map((c) => {
    const sinAtr = c.leads == null;
    return '<tr><th scope="row">' + esc(c.canal) + '</th>' +
      '<td class="valor">' + pesos(c.inversion) + '</td>' +
      '<td class="valor">' + pct(c.inversion / invTot) + '</td>' +
      '<td class="valor">' + (sinAtr ? '<span class="ad-estado ad-estado--sin">Sin atribución</span>' : n(c.leads)) + '</td>' +
      '<td class="valor">' + (sinAtr ? NO_APLICA : pesos(c.inversion / c.leads)) + '</td>' +
      '<td class="valor">' + (sinAtr ? NO_APLICA : n(c.matriculas)) + '</td>' +
      '<td class="valor">' + (sinAtr ? NO_APLICA : (c.matriculas ? pesos(c.inversion / c.matriculas) : SIN_DATO)) + '</td></tr>';
  }).join('') +
    '<tr><th scope="row">Total</th><td class="valor">' + pesos(invTot) + '</td><td class="valor">100 %</td><td class="valor">' + n(rLeads) + '</td><td class="valor">' + pesos(invAtrib / rLeads) + '</td><td class="valor">' + n(rMat) + '</td><td class="valor">' + pesos(invTot / rMat) + '</td></tr>');

  put('rx-historico', R.historico.map((h) =>
    '<tr><th scope="row">' + esc(h.periodo) + ' <span class="ad-estado ad-estado--' + (h.estado === 'Parcial' ? 'parcial' : 'ok') + '">' + esc(h.estado) + '</span></th>' +
    '<td class="valor">' + pesos(h.inversion) + '</td><td class="valor">' + n(h.leads) + '</td>' +
    '<td class="valor">' + pesos(h.inversion / h.leads) + '</td><td class="valor">' + n(h.matriculas) + '</td>' +
    '<td class="valor">' + pesos(h.inversion / h.matriculas) + '</td><td class="valor">' + pct(h.matriculas / h.leads, 2) + '</td></tr>'
  ).join(''));

  /* ---- embudo: el cuello es el paso con menor tasa en la serie de pauta ---- */
  const E = DATOS.embudo;
  const serieA = E.series[0].valores;
  let cuello = 1;
  for (let i = 1; i < serieA.length; i++) if (serieA[i] / serieA[i - 1] < serieA[cuello] / serieA[cuello - 1]) cuello = i;
  const finales = E.series.map((s) => s.valores[s.valores.length - 1] / s.valores[0]);
  put('embudo', E.series.map((s, k) => {
    const filas = E.etapas.map((et, i) => {
      const v = s.valores[i];
      const paso = i === 0 ? '100 %' : pct(v / s.valores[i - 1]);
      const ancho = (v / s.valores[0]) * 100;
      return '<li class="eu-embudo__fila' + (k === 0 && i === cuello ? ' eu-embudo__fila--cuello' : '') + '">' +
        '<span>' + esc(et) + '</span><span class="ad-barra' + (k === 0 && i === cuello ? ' ad-barra--on' : '') + '" aria-hidden="true"><span style="--v:' + ancho.toFixed(2) + '%"></span></span>' +
        '<span class="eu-embudo__dato"><span>' + n(v) + '</span><b>' + paso + (k === 0 && i === cuello ? ' · cuello' : '') + '</b></span></li>';
    }).join('');
    return '<div class="ad-card eu-embudo__serie"><h4>' + esc(s.nombre) + '</h4><ol>' + filas + '</ol>' +
      '<p class="eu-embudo__fin">Conversión final: <b>' + pct(finales[k], 2) + '</b></p></div>';
  }).join(''));
  put('embudo-brecha', nf1.format(finales[1] / finales[0]) + ' veces');
  put('embudo-cuello', esc(E.etapas[cuello - 1]) + ' → ' + esc(E.etapas[cuello]));

  /* ---- inversión: totales ---- */
  put('inv-total', millones(presTotal) + '<small>' + pesos(presTotal) + ' · ' + DATOS.mensual[0].mes + ' a ' + DATOS.mensual[DATOS.mensual.length - 1].mes + '</small>');
  put('inv-formal', millones(presFormal) + '<small>Captación por programa · ' + pct(presFormal / presTotal) + ' del total</small>');
  put('inv-branding', millones(presBranding) + '<small>Marca y quiz vocacional · ' + pct(presBranding / presTotal) + ' del total</small>');

  /* ---- inversión por medio: tres bolsas apiladas ---- */
  const bolsas = {
    Pregrado: suma(base.filter((p) => p.nivel === 'Pregrado'), 'presupuesto'),
    Posgrado: suma(base.filter((p) => p.nivel === 'Posgrado'), 'presupuesto'),
    Branding: presBranding
  };
  const porMedio = {};
  Object.entries(DATOS.mezclaMedios).forEach(([bolsa, mezcla]) => {
    Object.entries(mezcla).forEach(([medio, w]) => {
      porMedio[medio] = porMedio[medio] || { Pregrado: 0, Posgrado: 0, Branding: 0 };
      porMedio[medio][bolsa] += (bolsas[bolsa] || 0) * w;
    });
  });
  const medios = Object.entries(porMedio).map(([m, v]) => ({ medio: m, ...v, total: v.Pregrado + v.Posgrado + v.Branding }))
    .sort((a, b) => b.total - a.total);
  const maxMedio = medios[0] ? medios[0].total : 1;
  put('inv-medios', medios.map((m) => {
    const seg = ['Pregrado', 'Posgrado', 'Branding'].map((b, i) =>
      m[b] > 0 ? '<span class="s' + (i + 1) + '" style="width:' + ((m[b] / maxMedio) * 100).toFixed(2) + '%"></span>' : '').join('');
    const det = ['Pregrado', 'Posgrado', 'Branding'].filter((b) => m[b] > 0).map((b) => b + ' ' + millones(m[b])).join(' · ');
    return '<li class="eu-medio"><span class="eu-medio__n">' + esc(m.medio) + '</span>' +
      '<span class="eu-medio__barra" aria-hidden="true">' + seg + '</span>' +
      '<span class="eu-medio__v">' + millones(m.total) + '<small>' + pct(m.total / presTotal) + ' del total</small></span>' +
      '<span class="eu-medio__detalle">' + det + '</span></li>';
  }).join(''));

  /* ---- inversión por mes: columnas con base cero; el pico va en lima ---- */
  const maxPeso = Math.max(...DATOS.mensual.map((m) => m.peso));
  put('inv-meses', DATOS.mensual.map((m) =>
    '<li' + (m.peso === maxPeso ? ' class="pico"' : '') + '><span class="eu-meses__v">' + millones(presTotal * m.peso) + '</span>' +
    '<span class="eu-meses__b" style="height:' + ((m.peso / maxPeso) * 85).toFixed(1) + '%"></span></li>').join(''));
  put('inv-meses-ejes', DATOS.mensual.map((m) => '<li>' + esc(m.mes) + '</li>').join(''));
  const pico = DATOS.mensual.filter((m) => m.peso === maxPeso).map((m) => m.mes).join(' y ');
  const ordenados = [...DATOS.mensual].sort((a, b) => b.peso - a.peso);
  put('inv-meses-lectura', '<span class="ad-lectura__k">Lectura</span><p>El pico es ' + esc(pico) + ' con ' + pct(maxPeso) + ' del presupuesto; ' + esc(ordenados[0].mes) + ' y ' + esc(ordenados[1].mes) + ' suman ' + pct(ordenados[0].peso + ordenados[1].peso) + '.</p>');
  const figMeses = $('inv-meses-fig');
  if (figMeses) figMeses.setAttribute('aria-label', 'Inversión por mes: ' + DATOS.mensual.map((m) => m.mes + ' ' + millones(presTotal * m.peso)).join(', ') + '.');

  /* ---- tabla por programa ---- */
  const fila = (p) => '<tr><th scope="row">' + esc(p.programa) + '</th><td>' + esc(p.nivel) + '</td><td>' + esc(p.modalidad) + '</td>' +
    '<td><span class="ad-tag ad-tag--line">' + esc(p.rol) + '</span></td>' +
    '<td class="valor">' + pesos(p.presupuesto) + '</td><td class="valor">' + pct(p.presupuesto / presTotal) + '</td>' +
    '<td class="valor">' + pesos(p.cpl) + '</td><td class="valor">' + n(p.leads) + '</td><td class="valor">' + pct(p.conversion) + '</td>' +
    '<td class="valor">' + n(p.matriculas) + '</td>' +
    '<td class="valor">' + (p.metaInstitucional == null ? NO_APLICA : n(p.metaInstitucional)) + '</td>' +
    '<td class="valor">' + (p.metaInstitucional ? pct(p.matriculas / p.metaInstitucional, 0) : NO_APLICA) + '</td></tr>';
  const subtotal = (nombre, arr) => {
    const pr = suma(arr, 'presupuesto'), l = suma(arr, 'leads'), m = suma(arr, 'matriculas'), mt = suma(arr, 'metaInstitucional');
    return '<tr class="eu-subtotal"><th scope="row" colspan="4">' + esc(nombre) + '</th><td class="valor">' + pesos(pr) + '</td><td class="valor">' + pct(pr / presTotal) + '</td>' +
      '<td class="valor">' + (l ? pesos(pr / l) : NO_APLICA) + '</td><td class="valor">' + (l ? n(l) : NO_APLICA) + '</td><td class="valor">' + (l ? pct(m / l) : NO_APLICA) + '</td>' +
      '<td class="valor">' + (l ? n(m) : NO_APLICA) + '</td><td class="valor">' + (mt ? n(mt) : NO_APLICA) + '</td><td class="valor">' + (mt ? pct(m / mt, 0) : NO_APLICA) + '</td></tr>';
  };
  const filasNivel = (nivel) => { const arr = base.filter((p) => p.nivel === nivel); return arr.map(fila).join('') + subtotal('Total ' + nivel.toLowerCase(), arr); };
  const filasBranding = DATOS.branding.map((b) =>
    '<tr><th scope="row">Branding ' + esc(b.nivel.toLowerCase()) + '</th><td>' + esc(b.nivel) + '</td><td>' + esc(b.nota) + '</td><td>' + NO_APLICA + '</td>' +
    '<td class="valor">' + pesos(b.presupuesto) + '</td><td class="valor">' + pct(b.presupuesto / presTotal) + '</td>' +
    '<td class="valor">' + NO_APLICA + '</td><td class="valor">' + NO_APLICA + '</td><td class="valor">' + NO_APLICA + '</td><td class="valor">' + NO_APLICA + '</td><td class="valor">' + NO_APLICA + '</td><td class="valor">' + NO_APLICA + '</td></tr>').join('');
  put('inv-programas', filasNivel('Pregrado') + filasNivel('Posgrado') + filasBranding +
    '<tr class="eu-total"><th scope="row" colspan="4">Total periodo</th><td class="valor">' + pesos(presTotal) + '</td><td class="valor">100 %</td>' +
    '<td class="valor">' + pesos(presFormal / leadsTot) + '</td><td class="valor">' + n(leadsTot) + '</td><td class="valor">' + pct(matTot / leadsTot) + '</td>' +
    '<td class="valor">' + n(matTot) + '</td><td class="valor">' + n(metaTot) + '</td><td class="valor">' + pct(aporte, 0) + '</td></tr>');

  /* ---- escenarios ---- */
  put('escenarios', DATOS.escenarios.map((e, ie) => {
    const proy = DATOS.programas.map((p) => proyectar(p, e));
    const l = suma(proy, 'leads'), m = suma(proy, 'matriculas');
    return '<tr' + (ie === 0 ? ' class="is-on"' : '') + '><th scope="row">' + esc(e.nombre) + '</th><td>' + esc(e.condicion) + '</td>' +
      '<td class="valor">' + pesos(presFormal / l) + '</td><td class="valor">' + n(l) + '</td><td class="valor">' + n(m) + '</td>' +
      '<td class="valor">' + pct(m / metaTot, 0) + '</td><td>' + esc(e.senal) + '</td><td>' + esc(e.respuesta) + '</td></tr>';
  }).join(''));
  // Cuánto costaría cubrir toda la meta solo con pauta, con las condiciones base
  const leadsReq = Math.ceil(metaTot * leadsTot / matTot);
  put('meta-solo-pauta', 'Cubrir las ' + n(metaTot) + ' matrículas solo con pauta exigiría unos ' + n(leadsReq) + ' leads y ' + millones(leadsReq * presFormal / leadsTot) + ' de inversión en captación, ' + nf1.format((leadsReq * presFormal / leadsTot) / presFormal) + ' veces el presupuesto del plan.');

  /* impresión: abre los desplegables para que el PDF muestre el detalle */
  window.addEventListener('beforeprint', () => document.querySelectorAll('details').forEach((d) => { d.dataset.cerrado = d.open ? '' : '1'; d.open = true; }));
  window.addEventListener('afterprint', () => document.querySelectorAll('details[data-cerrado="1"]').forEach((d) => { d.open = false; }));
})();
