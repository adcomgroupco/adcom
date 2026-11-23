/* Informe particular · datos y dibujo de cifras, gráficos y tablas.
   Funciona con doble clic (file://): sin módulos, sin red, sin librerías. */

/* =====================================================================
   REEMPLAZAR CON LOS DATOS DEL CLIENTE
   ---------------------------------------------------------------------
   - Todo lo numérico del informe sale de aquí. El texto (ideas, hallazgos,
     limitaciones) vive en el HTML y debe citar estas mismas cifras.
   - Una sola fuente y una sola ventana por cifra. Si un dato no existe,
     usa null: se muestra «Sin dato», nunca 0.
   - Inversión en la moneda de la cuenta y sin ajustes comerciales salvo que
     el perfil del cliente lo exija (y entonces se dice en el anexo).
   - Los totales se calculan desde las campañas y se comprueban contra los
     KPI y la serie diaria (ver «Comprobación» en el anexo).
   ===================================================================== */
var DATOS = {
  moneda: 'COP',
  resultado: 'lead', // nombre corto del resultado: lead, registro, inscrito, compra

  // Cifras clave. mejorSi: 'baja' para costos, 'sube' para volumen.
  // estado: null | 'Parcial' | 'Sin dato' | 'No aplica'
  kpi: [
    { id: 'inversion', etiqueta: 'Inversión', tipo: 'dinero', actual: 86400000, anterior: 72000000, mejorSi: null, estado: null },
    { id: 'leads', etiqueta: 'Leads en plataforma', tipo: 'numero', actual: 3840, anterior: 4000, mejorSi: 'sube', estado: null },
    { id: 'cpl', etiqueta: 'Costo por lead', tipo: 'dinero', actual: 22500, anterior: 18000, mejorSi: 'baja', estado: null, destacar: true },
    { id: 'calificados', etiqueta: 'Leads calificados en CRM', tipo: 'numero', actual: 1152, anterior: 1360, mejorSi: 'sube', estado: 'Parcial' },
    { id: 'cpc', etiqueta: 'Costo por calificado', tipo: 'dinero', actual: 75000, anterior: 52941, mejorSi: 'baja', estado: 'Parcial' }
  ],

  // Serie diaria de la ventana actual (misma ventana que los KPI).
  diario: {
    fechas: ['20 oct', '21 oct', '22 oct', '23 oct', '24 oct', '25 oct', '26 oct', '27 oct', '28 oct', '29 oct',
      '30 oct', '31 oct', '1 nov', '2 nov', '3 nov', '4 nov', '5 nov', '6 nov', '7 nov', '8 nov',
      '9 nov', '10 nov', '11 nov', '12 nov', '13 nov', '14 nov', '15 nov', '16 nov'],
    meta: 20000, // costo por lead objetivo; null si no hay meta acordada
    series: [
      {
        nombre: 'Todas las plataformas',
        inversion: [2857000, 3014000, 3005000, 2877000, 2806000, 2843000, 2866000, 3098000, 2995000, 3068000, 3273000, 3374000, 3255000, 3078000,
          3049000, 3143000, 3172000, 3083000, 3042000, 3174000, 3348000, 3341000, 3149000, 3000000, 3044000, 3167000, 3180000, 3099000],
        resultados: [162, 162, 151, 139, 132, 135, 146, 156, 160, 156, 146, 138, 136, 141, 126, 132, 135, 133, 126, 121, 117, 120, 125, 131, 134, 132, 128, 120]
      },
      {
        nombre: 'Google Ads',
        inversion: [1200000, 1293000, 1250000, 1134000, 1116000, 1221000, 1296000, 1539000, 1401000, 1409000, 1551000, 1619000, 1513000, 1389000,
          1428000, 1573000, 1612000, 1487000, 1382000, 1450000, 1592000, 1600000, 1462000, 1381000, 1475000, 1607000, 1583000, 1437000],
        resultados: [61, 59, 54, 50, 50, 54, 59, 61, 58, 54, 50, 50, 54, 59, 38, 36, 33, 31, 31, 34, 36, 38, 36, 33, 31, 31, 34, 35]
      }
    ],
    // Cambios que explican la curva. dia = posición en «fechas» (empieza en 0).
    hitos: [
      { dia: 7, texto: '27 oct · más presupuesto a Performance Max' },
      { dia: 14, texto: '3 nov · formulario nuevo en la página de Google' }
    ]
  },

  // Desglose. ant / act = ventana anterior / actual. calificados: null si el
  // CRM no puede atribuir esa campaña (se muestra «Sin dato»).
  campanas: [
    { plataforma: 'Google Ads', campana: 'Búsqueda · marca', inv: [6000000, 6400000], res: [500, 480], calificados: 190, lectura: 'Estable; la demanda de marca tiene techo.' },
    { plataforma: 'Google Ads', campana: 'Búsqueda · programas', inv: [14000000, 15600000], res: [700, 560], calificados: 150, lectura: 'Cae desde el 3 nov, con el formulario nuevo.' },
    { plataforma: 'Google Ads', campana: 'Performance Max', inv: [8000000, 18000000], res: [200, 210], calificados: 42, lectura: 'Más del doble de inversión para 10 leads más.' },
    { plataforma: 'Meta', campana: 'Formularios · pregrado', inv: [24000000, 25200000], res: [1800, 1820], calificados: 560, lectura: 'Sostiene el volumen con costo casi igual.' },
    { plataforma: 'Meta', campana: 'Remarketing', inv: [12000000, 13200000], res: [600, 580], calificados: 210, lectura: 'Frecuencia en 4,1; rotar piezas.' },
    { plataforma: 'TikTok', campana: 'Video · programas', inv: [8000000, 8000000], res: [200, 190], calificados: null, lectura: 'Sin UTM de campaña: el CRM no lo atribuye.' }
  ],

  // Ángulos creativos (solo plataformas con piezas; aquí Meta y TikTok).
  angulos: [
    { angulo: 'Empleabilidad del egresado', piezas: 4, inv: 16800000, res: 1120, decision: 'Conservar y producir dos variantes' },
    { angulo: 'Beca y financiación', piezas: 3, inv: 12600000, res: 760, decision: 'Conservar' },
    { angulo: 'Campus y vida universitaria', piezas: 3, inv: 9000000, res: 430, decision: 'Rotar las dos piezas con más frecuencia' },
    { angulo: 'Testimonio de estudiante', piezas: 2, inv: 8000000, res: 280, decision: 'Probar otro gancho en los primeros 3 segundos' }
  ],

  // Quién cuenta qué: cada fuente con su definición y su estado.
  fuentes: [
    { fuente: 'Plataformas', cuenta: 'Formulario enviado, según Meta, Google Ads y TikTok', valor: 3840, referencia: null, estado: 'Confirmado' },
    { fuente: 'GA4', cuenta: 'Evento de formulario en el sitio (solo Google Ads y TikTok llegan al sitio)', valor: 1180, referencia: 1440, estado: 'Por validar' },
    { fuente: 'CRM · recibidos', cuenta: 'Registros que entraron al CRM con origen pauta', valor: 3620, referencia: 3840, estado: 'Confirmado' },
    { fuente: 'CRM · calificados', cuenta: 'Registros con perfil y programa válidos, gestionados por admisiones', valor: 1152, referencia: 3620, estado: 'Parcial' }
  ],

  // Acciones. semanas: lunes de cada semana del calendario.
  // desde / hasta: posiciones en «semanas». estado: Hecho | En curso | Pendiente
  acciones: {
    semanas: ['17 nov', '24 nov', '1 dic', '8 dic'],
    filas: [
      { accion: 'Volver al formulario anterior en la página de Google', responsable: 'Performance', desde: 0, hasta: 0, criterio: 'Tasa de conversión del sitio de 4,5 % o más en 7 días', estado: 'Hecho' },
      { accion: 'Bajar Performance Max a $400.000 al día y pasar $350.000 a Búsqueda · programas', responsable: 'Performance', desde: 0, hasta: 1, criterio: 'Costo por lead de Google Ads de $26.000 o menos la semana del 24 nov', estado: 'En curso' },
      { accion: 'Excluir los términos de marca de Performance Max', responsable: 'Performance', desde: 1, hasta: 1, criterio: 'Menos de 20 % de los clics de Performance Max en marca', estado: 'Pendiente' },
      { accion: 'Conciliar el evento de formulario de GA4 con Google Ads', responsable: 'Analítica', desde: 1, hasta: 2, criterio: 'Diferencia entre GA4 y Google Ads menor a 10 %', estado: 'Pendiente' },
      { accion: 'Agregar UTM de campaña a TikTok para que el CRM la reconozca', responsable: 'Performance y CRM del cliente', desde: 1, hasta: 1, criterio: 'Todos los leads de TikTok con campaña en el CRM', estado: 'Pendiente' },
      { accion: 'Leer calificados con 30 días de madurez y decidir la redistribución', responsable: 'Planner', desde: 3, hasta: 3, criterio: 'Costo por calificado comparable por plataforma', estado: 'Pendiente' }
    ]
  }
};

/* =====================================================================
   LÓGICA · no hace falta tocarla para adaptar la plantilla
   ===================================================================== */
(function () {
  'use strict';

  var grupo;
  try { grupo = new Intl.NumberFormat('es-CO', { useGrouping: 'always', maximumFractionDigits: 0 }); }
  catch (e) { grupo = new Intl.NumberFormat('es-CO', { useGrouping: true, maximumFractionDigits: 0 }); }
  var unDecimal = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function num(n) { return grupo.format(Math.round(n)); }
  function dinero(n) { return '$' + num(n); }
  function millones(n) { return '$' + unDecimal.format(n / 1e6) + ' M'; }
  function pct(n) { return unDecimal.format(n).replace(/,0$/, '') + ' %'; }
  function delta(act, ant) {
    if (act == null || ant == null || ant === 0) return null;
    return (act - ant) / ant * 100;
  }
  function signo(d) {
    if (d == null) return 'Sin dato';
    var r = Math.round(d);
    return (r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r) + ' %';
  }
  function div(a, b) { return b ? a / b : null; }
  function sum(arr) { return arr.reduce(function (a, b) { return a + b; }, 0); }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function estadoTag(estado) {
    if (!estado) return '';
    var mapa = { 'Hecho': ' ad-estado--ok', 'Confirmado': ' ad-estado--ok', 'Parcial': ' ad-estado--parcial', 'Por validar': ' ad-estado--pendiente', 'Pendiente': ' ad-estado--pendiente', 'En curso': ' ad-estado--parcial', 'Sin dato': ' ad-estado--sin', 'No aplica': ' ad-estado--na' };
    return '<span class="ad-estado' + (mapa[estado] || '') + '">' + esc(estado) + '</span>';
  }
  function fmt(tipo, n) {
    if (n == null) return 'Sin dato';
    return tipo === 'dinero' ? (n >= 1e7 ? millones(n) : dinero(n)) : tipo === 'pct' ? pct(n) : num(n);
  }
  function lecturaDelta(d, mejorSi) {
    if (d == null) return '';
    if (!mejorSi || Math.round(d) === 0) return '';
    var favorable = (mejorSi === 'baja') ? d < 0 : d > 0;
    return favorable ? ' · a favor' : ' · en contra';
  }

  /* ---------- Cifras clave ---------- */
  function pintarKpi() {
    var dl = document.getElementById('ip-kpi'); // contenedor .ad-kpis
    if (!dl) return;
    DATOS.kpi.forEach(function (k) {
      var d = delta(k.actual, k.anterior);
      var box = el('div', { 'class': 'ad-kpi' + (k.destacar ? ' ad-kpi--on' : '') });
      box.innerHTML = '<span class="ad-kpi__l">' + esc(k.etiqueta) + (k.estado ? ' ' + estadoTag(k.estado) : '') + '</span>' +
        '<span class="ad-kpi__n">' + fmt(k.tipo, k.actual) + '</span>' +
        '<span class="ad-kpi__m"><strong>' + signo(d) + '</strong> frente a ' + fmt(k.tipo, k.anterior) + lecturaDelta(d, k.mejorSi) + '</span>';
      dl.appendChild(box);
    });
  }

  /* ---------- Evolución diaria (SVG propio) ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  function costoDiario(s) {
    return s.inversion.map(function (v, i) { return div(v, s.resultados[i]); });
  }
  function pintarEvolucion() {
    var cont = document.getElementById('ip-evolucion');
    if (!cont) return;
    var D = DATOS.diario;
    var series = D.series.map(costoDiario);
    var cs = getComputedStyle(cont);
    var ancho = Math.max(260, Math.floor(cont.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)));
    var estrecho = ancho < 560;
    var alto = estrecho ? 250 : 320;
    var m = { t: 30, r: estrecho ? 8 : 20, b: 30, l: estrecho ? 58 : 68 };
    var w = ancho - m.l - m.r, h = alto - m.t - m.b;
    var max = Math.max.apply(null, series.reduce(function (a, s) { return a.concat(s.filter(function (v) { return v != null; })); }, []).concat([D.meta || 0]));
    var paso = Math.pow(10, Math.floor(Math.log10(max / 4)));
    var tope = Math.ceil(max * 1.08 / (paso * 2)) * paso * 2;
    var n = D.fechas.length;
    function x(i) { return m.l + (n === 1 ? w / 2 : i * w / (n - 1)); }
    function y(v) { return m.t + h - v / tope * h; }

    var svg = svgEl('svg', { viewBox: '0 0 ' + ancho + ' ' + alto, width: ancho, height: alto, role: 'img', 'aria-labelledby': 'ip-evolucion-titulo ip-evolucion-nota' });
    // Rejilla y eje Y (base cero)
    for (var t = 0; t <= 4; t++) {
      var v = tope * t / 4, yy = y(v);
      svg.appendChild(svgEl('line', { x1: m.l, x2: m.l + w, y1: yy, y2: yy, 'class': t === 0 ? 'ip-base' : 'ip-eje' }));
      svg.appendChild(svgEl('text', { x: m.l - 8, y: yy + 4, 'text-anchor': 'end' }, dinero(v)));
    }
    // Eje X: cada 7 días y el último
    D.fechas.forEach(function (f, i) {
      if (i % 7 === 0 || i === n - 1) {
        svg.appendChild(svgEl('text', { x: x(i), y: alto - 8, 'text-anchor': i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle' }, f));
      }
    });
    // Hitos numerados
    (D.hitos || []).forEach(function (hito, k) {
      var hx = x(hito.dia);
      svg.appendChild(svgEl('line', { x1: hx, x2: hx, y1: m.t - 6, y2: m.t + h, 'class': 'ip-hito' }));
      svg.appendChild(svgEl('circle', { cx: hx, cy: m.t - 16, r: 10, fill: 'var(--papel)', stroke: 'var(--sumi)', 'stroke-width': 1 }));
      svg.appendChild(svgEl('text', { x: hx, y: m.t - 12, 'text-anchor': 'middle', 'class': 'ip-hito-txt' }, String(k + 1)));
    });
    // Meta
    if (D.meta != null) {
      svg.appendChild(svgEl('line', { x1: m.l, x2: m.l + w, y1: y(D.meta), y2: y(D.meta), 'class': 'ip-meta' }));
    }
    // Series: la principal se dibuja al final para quedar encima
    series.slice().reverse().forEach(function (s, ri) {
      var idx = series.length - 1 - ri;
      var dd = '';
      s.forEach(function (v, i) { if (v != null) dd += (dd ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); });
      svg.appendChild(svgEl('path', { d: dd, 'class': 'ip-serie-' + (idx + 1) }));
    });
    // Último dato de la serie principal, rotulado
    var s0 = series[0], ult = s0[n - 1];
    if (ult != null) {
      svg.appendChild(svgEl('circle', { cx: x(n - 1), cy: y(ult), r: 5, 'class': 'ip-punto' }));
    }
    cont.innerHTML = '';
    cont.appendChild(svg);
  }
  function pintarLeyendaEvolucion() {
    var ul = document.getElementById('ip-evolucion-leyenda');
    if (!ul) return;
    var D = DATOS.diario, html = '';
    D.series.forEach(function (s, i) {
      html += '<li><svg width="28" height="10" aria-hidden="true"><line x1="0" x2="28" y1="5" y2="5" stroke="' + (i === 0 ? 'var(--sumi)' : 'var(--tinta-secundaria)') + '" stroke-width="' + (i === 0 ? 2.5 : 2) + '"' + (i === 0 ? '' : ' stroke-dasharray="7 4"') + '/></svg>' + esc(s.nombre) + '</li>';
    });
    if (D.meta != null) html += '<li><svg width="28" height="10" aria-hidden="true"><line x1="0" x2="28" y1="5" y2="5" stroke="var(--tinta-secundaria)" stroke-width="1.5" stroke-dasharray="2 4"/></svg>Meta ' + dinero(D.meta) + '</li>';
    (D.hitos || []).forEach(function (h, k) { html += '<li><span class="ad-n ad-n--md" aria-hidden="true">' + (k + 1) + '</span>' + esc(h.texto) + '</li>'; });
    ul.innerHTML = html;
  }
  function pintarDatosEvolucion() {
    var tabla = document.getElementById('ip-evolucion-tabla');
    if (!tabla) return;
    var D = DATOS.diario, cost = D.series.map(costoDiario);
    var head = '<tr><th scope="col">Día</th>' + D.series.map(function (s) { return '<th scope="col" class="valor">' + esc(s.nombre) + '</th>'; }).join('') + '</tr>';
    var body = D.fechas.map(function (f, i) {
      return '<tr><th scope="row">' + f + '</th>' + cost.map(function (c) { return '<td class="valor">' + (c[i] == null ? 'Sin dato' : dinero(c[i])) + '</td>'; }).join('') + '</tr>';
    }).join('');
    tabla.querySelector('thead').innerHTML = head;
    tabla.querySelector('tbody').innerHTML = body;
  }

  /* ---------- Desglose: barras anterior / actual ---------- */
  function pintarBarras() {
    var dl = document.getElementById('ip-barras');
    if (!dl) return;
    var filas = DATOS.campanas.map(function (c) {
      return { nombre: c.campana, plataforma: c.plataforma, ant: div(c.inv[0], c.res[0]), act: div(c.inv[1], c.res[1]) };
    });
    var max = Math.max.apply(null, filas.map(function (f) { return Math.max(f.ant || 0, f.act || 0); }).concat([DATOS.diario.meta || 0]));
    var meta = DATOS.diario.meta;
    dl.innerHTML = filas.map(function (f) {
      var mp = meta != null ? (meta / max * 100).toFixed(2) + '%' : '100%';
      var marca = meta != null ? '<i></i>' : '';
      return '<div><dt>' + esc(f.nombre) + ' <small>· ' + esc(f.plataforma) + '</small></dt><dd>' +
        '<span class="ip-fila ip-fila--ant"><span class="ad-barra" style="--v:' + ((f.ant || 0) / max * 100).toFixed(2) + '%;--meta:' + mp + '" aria-hidden="true"><span></span>' + marca + '</span><b><span class="ip-sr">Anterior </span>' + (f.ant == null ? 'Sin dato' : dinero(f.ant)) + '</b></span>' +
        '<span class="ip-fila"><span class="ad-barra ad-barra--on" style="--v:' + ((f.act || 0) / max * 100).toFixed(2) + '%;--meta:' + mp + '" aria-hidden="true"><span></span>' + marca + '</span><b><span class="ip-sr">Actual </span>' + (f.act == null ? 'Sin dato' : dinero(f.act)) + '</b></span>' +
        '</dd></div>';
    }).join('');
  }

  /* ---------- Tabla de detalle: filtro por plataforma y orden ---------- */
  var orden = { col: null, dir: -1 };
  function filasDetalle() {
    var sel = document.getElementById('ip-filtro-plataforma');
    var p = sel ? sel.value : '';
    var filas = DATOS.campanas.filter(function (c) { return !p || c.plataforma === p; }).map(function (c) {
      return {
        c: c, inv: c.inv[1], dInv: delta(c.inv[1], c.inv[0]), res: c.res[1], dRes: delta(c.res[1], c.res[0]),
        costo: div(c.inv[1], c.res[1]), dCosto: delta(div(c.inv[1], c.res[1]), div(c.inv[0], c.res[0])), cal: c.calificados
      };
    });
    if (orden.col) {
      filas.sort(function (a, b) {
        var va = a[orden.col], vb = b[orden.col];
        if (va == null) return 1; if (vb == null) return -1;
        return (va - vb) * orden.dir;
      });
    }
    return filas;
  }
  function pintarDetalle() {
    var tabla = document.getElementById('ip-detalle');
    if (!tabla) return;
    var filas = filasDetalle();
    var peorAlza = Math.max.apply(null, filas.map(function (f) { return f.dCosto == null ? -Infinity : f.dCosto; }));
    tabla.querySelector('tbody').innerHTML = filas.map(function (f) {
      return '<tr' + (filas.length > 1 && f.dCosto === peorAlza && peorAlza > 0 ? ' class="is-on"' : '') + '><th scope="row">' + esc(f.c.campana) + '<span class="ip-sub">' + esc(f.c.plataforma) + '</span></th>' +
        '<td class="valor">' + dinero(f.inv) + '</td><td class="valor">' + signo(f.dInv) + '</td>' +
        '<td class="valor">' + num(f.res) + '</td><td class="valor">' + signo(f.dRes) + '</td>' +
        '<td class="valor">' + dinero(f.costo) + '</td><td class="valor">' + signo(f.dCosto) + '</td>' +
        (f.cal == null ? '<td class="valor ip-sin">' + estadoTag('Sin dato') + '</td>' : '<td class="valor">' + num(f.cal) + '</td>') +
        '<td class="ip-lectura-col">' + esc(f.c.lectura) + '</td></tr>';
    }).join('');
    // Total de lo visible, recalculado desde las filas
    var invA = sum(filas.map(function (f) { return f.c.inv[0]; })), invB = sum(filas.map(function (f) { return f.c.inv[1]; }));
    var resA = sum(filas.map(function (f) { return f.c.res[0]; })), resB = sum(filas.map(function (f) { return f.c.res[1]; }));
    var cal = filas.some(function (f) { return f.cal == null; }) ? null : sum(filas.map(function (f) { return f.cal; }));
    var calParcial = sum(filas.map(function (f) { return f.cal || 0; }));
    tabla.querySelector('tfoot').innerHTML = '<tr><th scope="row">Total' + (filas.length < DATOS.campanas.length ? ' filtrado' : '') + '</th>' +
      '<td class="valor">' + dinero(invB) + '</td><td class="valor">' + signo(delta(invB, invA)) + '</td>' +
      '<td class="valor">' + num(resB) + '</td><td class="valor">' + signo(delta(resB, resA)) + '</td>' +
      '<td class="valor">' + dinero(div(invB, resB)) + '</td><td class="valor">' + signo(delta(div(invB, resB), div(invA, resA))) + '</td>' +
      '<td class="valor">' + (cal == null ? num(calParcial) + ' ' + estadoTag('Parcial') : num(cal)) + '</td><td></td></tr>';
    var aviso = document.getElementById('ip-detalle-estado');
    if (aviso) aviso.textContent = filas.length + ' campañas visibles.';
  }
  function prepararDetalle() {
    var tabla = document.getElementById('ip-detalle');
    if (!tabla) return;
    var sel = document.getElementById('ip-filtro-plataforma');
    if (sel) {
      var plats = DATOS.campanas.map(function (c) { return c.plataforma; }).filter(function (p, i, a) { return a.indexOf(p) === i; });
      plats.forEach(function (p) { sel.appendChild(el('option', { value: p }, esc(p))); });
      sel.addEventListener('change', pintarDetalle);
      var filtros = sel.closest('.formato-filtros');
      if (filtros) filtros.hidden = false;
    }
    tabla.querySelectorAll('[data-orden]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var col = btn.getAttribute('data-orden');
        if (orden.col === col && orden.dir === 1) { orden.col = null; orden.dir = -1; }
        else if (orden.col === col) { orden.dir = 1; }
        else { orden.col = col; orden.dir = -1; }
        tabla.querySelectorAll('th[aria-sort]').forEach(function (th) { th.removeAttribute('aria-sort'); });
        tabla.querySelectorAll('[data-orden] [aria-hidden]').forEach(function (s) { s.textContent = '↕'; });
        if (orden.col) {
          btn.closest('th').setAttribute('aria-sort', orden.dir === 1 ? 'ascending' : 'descending');
          btn.querySelector('[aria-hidden]').textContent = orden.dir === 1 ? '↑' : '↓';
        }
        pintarDetalle();
      });
    });
    pintarDetalle();
  }

  /* ---------- Ángulos creativos ---------- */
  function pintarAngulos() {
    var tabla = document.getElementById('ip-angulos');
    if (!tabla) return;
    var a = DATOS.angulos;
    tabla.querySelector('tbody').innerHTML = a.map(function (f) {
      return '<tr><th scope="row">' + esc(f.angulo) + '</th><td class="valor">' + num(f.piezas) + '</td><td class="valor">' + dinero(f.inv) + '</td>' +
        '<td class="valor">' + pct(f.inv / sum(a.map(function (x) { return x.inv; })) * 100) + '</td>' +
        '<td class="valor">' + num(f.res) + '</td><td class="valor">' + dinero(div(f.inv, f.res)) + '</td><td>' + esc(f.decision) + '</td></tr>';
    }).join('');
    var inv = sum(a.map(function (x) { return x.inv; })), res = sum(a.map(function (x) { return x.res; }));
    tabla.querySelector('tfoot').innerHTML = '<tr><th scope="row">Total</th><td class="valor">' + num(sum(a.map(function (x) { return x.piezas; }))) + '</td><td class="valor">' + dinero(inv) +
      '</td><td class="valor">100 %</td><td class="valor">' + num(res) + '</td><td class="valor">' + dinero(div(inv, res)) + '</td><td></td></tr>';
  }

  /* ---------- Fuentes de medición ---------- */
  function pintarFuentes() {
    var tabla = document.getElementById('ip-fuentes');
    if (!tabla) return;
    tabla.querySelector('tbody').innerHTML = DATOS.fuentes.map(function (f) {
      var dif = f.referencia == null ? 'Referencia' : signo(delta(f.valor, f.referencia)) + '<span class="ip-sub">sobre ' + num(f.referencia) + '</span>';
      return '<tr><th scope="row">' + esc(f.fuente) + '</th><td>' + esc(f.cuenta) + '</td><td class="valor">' + (f.valor == null ? 'Sin dato' : num(f.valor)) +
        '</td><td class="valor">' + dif + '</td><td>' + estadoTag(f.estado) + '</td></tr>';
    }).join('');
  }

  /* ---------- Acciones con calendario por semana ---------- */
  function pintarAcciones() {
    var tabla = document.getElementById('ip-acciones');
    if (!tabla) return;
    var A = DATOS.acciones;
    var cab = tabla.querySelector('[data-semanas]');
    if (cab) cab.textContent = 'Semanas del ' + A.semanas[0] + ' al ' + A.semanas[A.semanas.length - 1];
    tabla.querySelector('tbody').innerHTML = A.filas.map(function (f, i) {
      var celdas = A.semanas.map(function (s, k) { return '<span' + (k >= f.desde && k <= f.hasta ? ' class="on"' : '') + '></span>'; }).join('');
      var cuando = f.desde === f.hasta ? 'Semana del ' + A.semanas[f.desde] : 'Del ' + A.semanas[f.desde] + ' al ' + A.semanas[f.hasta];
      return '<tr><th scope="row">' + (i + 1) + '. ' + esc(f.accion) + '</th><td>' + esc(f.responsable) + '</td>' +
        '<td><span class="ip-semanas" role="img" aria-label="' + cuando + '">' + celdas + '</span><span class="ip-sub">' + cuando + '</span></td>' +
        '<td>' + esc(f.criterio) + '</td><td>' + estadoTag(f.estado) + '</td></tr>';
    }).join('');
  }

  /* ---------- Comprobación de totales ---------- */
  function comprobar() {
    var p = document.getElementById('ip-cuadre');
    if (!p) return;
    var invC = sum(DATOS.campanas.map(function (c) { return c.inv[1]; }));
    var resC = sum(DATOS.campanas.map(function (c) { return c.res[1]; }));
    var s0 = DATOS.diario.series[0];
    var invD = sum(s0.inversion), resD = sum(s0.resultados);
    var kInv = DATOS.kpi.filter(function (k) { return k.id === 'inversion'; })[0];
    var kRes = DATOS.kpi.filter(function (k) { return k.id === 'leads'; })[0];
    var ok = invC === invD && resC === resD && (!kInv || kInv.actual === invC) && (!kRes || kRes.actual === resC);
    p.innerHTML = (ok ? '<span class="ad-estado ad-estado--ok">Cuadra</span> ' : '<span class="ad-estado ad-estado--alerta">No cuadra</span> ') +
      'Campañas: ' + dinero(invC) + ' y ' + num(resC) + ' ' + DATOS.resultado + 's. Serie diaria: ' + dinero(invD) + ' y ' + num(resD) + '. Cifras clave: ' +
      (kInv ? dinero(kInv.actual) : 'Sin dato') + ' y ' + (kRes ? num(kRes.actual) : 'Sin dato') + '.';
    if (!ok && window.console) console.warn('Informe particular: los totales de campañas, serie diaria y cifras clave no coinciden.');
  }

  function iniciar() {
    pintarKpi();
    pintarLeyendaEvolucion();
    pintarEvolucion();
    pintarDatosEvolucion();
    pintarBarras();
    prepararDetalle();
    pintarAngulos();
    pintarFuentes();
    pintarAcciones();
    comprobar();
    var cont = document.getElementById('ip-evolucion');
    if (cont && 'ResizeObserver' in window) {
      var ultimo = cont.clientWidth, espera;
      new ResizeObserver(function () {
        if (Math.abs(cont.clientWidth - ultimo) < 8) return;
        ultimo = cont.clientWidth;
        clearTimeout(espera);
        espera = setTimeout(pintarEvolucion, 120);
      }).observe(cont);
    }
    // Al imprimir, los datos plegados también salen.
    window.addEventListener('beforeprint', function () {
      document.querySelectorAll('details.ad-datos').forEach(function (d) { d.setAttribute('data-cerrado', d.open ? '' : '1'); d.open = true; });
    });
    window.addEventListener('afterprint', function () {
      document.querySelectorAll('details.ad-datos[data-cerrado="1"]').forEach(function (d) { d.open = false; });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
