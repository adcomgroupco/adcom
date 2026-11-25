/* Adcom — comportamiento compartido de tableros. Se carga después de Chart.js (si la página lo usa).
   No pinta datos: se engancha al DOM que ya pintó cada tablero. */
(function () {
  'use strict';
  var A = window.ADC = window.ADC || {};

  /* Series: mismas variables que adcom-dash.css */
  var css = getComputedStyle(document.documentElement);
  var v = function (n, d) { return (css.getPropertyValue(n) || '').trim() || d; };
  A.c = {
    sumi: v('--sumi', '#141414'), suave: v('--tinta-suave', '#6b6b66'), sec: v('--tinta-secundaria', '#4a4a46'),
    piedra: v('--piedra', '#e4e2dc'), borde: v('--piedra-borde', '#d6d3cb'), papel: v('--papel', '#fff'), lima: v('--lima', '#d8ff3d'),
    meta: v('--s-meta', '#3b5bc9'), google: v('--s-google', '#e3a600'), googleB: v('--s-google-borde', '#8a6500'),
    tiktok: v('--s-tiktok', '#1c8c83'), prog: v('--s-prog', '#7457c4'), chatgpt: v('--s-chatgpt', '#4a4a46'),
    organico: v('--s-organico', '#8a8a84'), otro: v('--s-otro', '#c4c1b8'),
    ok: v('--est-ok', '#2c7a4b')
  };
  A.alpha = function (hex, a) {
    var h = hex.replace('#', ''); if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
  };

  /* Chart.js: Inter, rejilla de 1 px, barras rectas, tooltip en tinta */
  A.chartBase = function () {
    if (!window.Chart) return;
    var C = Chart.defaults;
    C.font.family = 'Inter, system-ui, sans-serif'; C.font.size = 12; C.color = A.c.suave;
    C.borderColor = A.c.piedra;
    C.plugins.legend.labels.usePointStyle = true; C.plugins.legend.labels.boxWidth = 8; C.plugins.legend.labels.boxHeight = 8; C.plugins.legend.labels.padding = 16;
    C.plugins.tooltip.backgroundColor = A.c.sumi; C.plugins.tooltip.titleColor = '#fff'; C.plugins.tooltip.bodyColor = '#e4e2dc';
    C.plugins.tooltip.padding = 12; C.plugins.tooltip.cornerRadius = 4; C.plugins.tooltip.boxPadding = 4;
    C.elements.bar.borderRadius = 2; C.elements.line.borderWidth = 2; C.elements.point.radius = 0; C.elements.point.hoverRadius = 4;
    C.animation = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 600 };
  };
  A.chartBase();

  /* Cada canvas lleva etiqueta accesible y botón «Tabla» si declara data-tabla="id-de-la-tabla" */
  A.accesibles = function () {
    document.querySelectorAll('canvas[data-label]').forEach(function (cv) {
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', cv.getAttribute('data-label'));
    });
  };

  /* Estados en tablas: si la celda lleva t-pos / t-mid / t-neg, el valor se envuelve para que la etiqueta de color quede ajustada al texto */
  var ESTADOS = ['t-pos', 't-mid', 't-neg'];
  function etiquetar(raiz) {
    raiz.querySelectorAll('td.t-pos, td.t-mid, td.t-neg').forEach(function (td) {
      var c = ESTADOS.filter(function (k) { return td.classList.contains(k); })[0];
      td.classList.remove(c); td.innerHTML = '<span class="' + c + '">' + td.innerHTML + '</span>';
    });
  }
  var pendiente = false;
  new MutationObserver(function () {
    if (pendiente) return; pendiente = true;
    requestAnimationFrame(function () { pendiente = false; etiquetar(document.body); });
  }).observe(document.body, { childList: true, subtree: true });
  A.etiquetar = etiquetar;

  /* Menú del riel en celular */
  var btn = document.getElementById('menu-btn');
  function cerrar() { document.body.classList.remove('menu-open'); if (btn) btn.setAttribute('aria-expanded', 'false'); }
  if (btn) {
    btn.addEventListener('click', function () {
      var abierto = document.body.classList.toggle('menu-open'); btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (document.body.classList.contains('menu-open') && !e.target.closest('.rail') && !e.target.closest('#menu-btn')) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
  }
  var fb = document.getElementById('filtros-btn');
  if (fb) fb.addEventListener('click', function () { var ab = document.body.classList.toggle('filtros-open'); fb.setAttribute('aria-expanded', ab ? 'true' : 'false'); });
  document.querySelectorAll('.rail-nav a[href^="#"]').forEach(function (a) { a.addEventListener('click', cerrar); });

  /* Sección activa en el riel */
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail-nav a[href^="#"]'));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function activa() {
    var y = window.scrollY + 160, cur = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  if (links.length) { window.addEventListener('scroll', activa, { passive: true }); window.addEventListener('load', activa); activa(); }
})();
