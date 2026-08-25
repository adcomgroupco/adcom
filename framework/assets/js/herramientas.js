/* ============================================================
   Framework Digital · herramientas.js
   Calculadora de pacing, árbol de diagnóstico, constructor de nomenclatura y combinador de variables
   ============================================================ */

(function(){
  "use strict";
  var FD = window.FD, $ = FD.$, $$ = FD.$$;

  /* ---------- calculadora de pacing ---------- */
  var fmt = new Intl.NumberFormat("es-CO",{maximumFractionDigits:0});
  function money(v){ return "$" + fmt.format(Math.round(v||0)); }
  function num(id){ var v = parseFloat($(id).value); return isNaN(v) ? 0 : v; }
  var modelSel = $("#c-model"), curveField = $("#c-curve-field");
  function calc(){
    var budget = num("#c-budget"), spent = num("#c-spent");
    var totalDays = Math.max(num("#c-total-days"),1);
    var days = Math.min(Math.max(num("#c-days"),0), totalDays);
    var planned = modelSel.value === "plan";
    curveField.hidden = !planned;

    var pct = planned ? Math.min(Math.max(num("#c-curve"),0),100)/100 : (days/totalDays);
    var expected = budget * pct;
    var pacing = expected > 0 ? (spent/expected)*100 : 0;
    var varAbs = spent - expected;
    var varPct = expected > 0 ? (varAbs/expected)*100 : 0;
    var left = budget - spent;
    var daysLeft = totalDays - days;
    var daily = days > 0 ? spent/days : 0;
    var required = daysLeft > 0 ? left/daysLeft : 0;
    /* la proyección sigue el modelo elegido: con curva planificada, lo consumido
       representa `pct` del plan, no `days/totalDays` */
    var forecast = pct > 0 ? spent / pct : 0;
    var forecastVar = forecast - budget;

    $("#c-pacing").textContent = expected > 0 ? pacing.toFixed(1) + "%" : "—";
    $("#c-expected").textContent = money(expected);
    $("#c-var-abs").textContent = (varAbs>=0?"+":"−") + money(Math.abs(varAbs)).replace("$","$");
    $("#c-var-pct").textContent = (varPct>=0?"+":"−") + Math.abs(varPct).toFixed(1) + "%";
    $("#c-left").textContent = money(left);
    $("#c-days-left").textContent = daysLeft + (daysLeft===1?" día":" días");
    $("#c-daily").textContent = money(daily);
    $("#c-required").textContent = daysLeft > 0 ? money(required) : "Periodo cerrado";
    $("#c-forecast").textContent = money(forecast);
    $("#c-forecast-var").textContent = (forecastVar>=0?"+":"−") + money(Math.abs(forecastVar)).replace("$","$");

    var state, color;
    var dev = Math.abs(pacing - 100);
    if (expected <= 0){ state = "Sin datos"; color = "#666"; }
    else if (dev <= 5){ state = "Normal"; color = "var(--green)"; }
    else if (dev <= 15){ state = "Observación"; color = "var(--yellow)"; }
    else if (dev <= 30){ state = "Acción"; color = "var(--orange)"; }
    else { state = "Crítico"; color = "var(--red)"; }

    var label = $("#c-status-label");
    label.textContent = state + (pacing > 100 ? " · sobreconsumo" : (pacing < 100 && expected > 0 ? " · subconsumo" : ""));
    label.style.background = color;
    label.style.color = (state === "Observación") ? "#050505" : "#050505";
    $("#c-status").style.borderLeftColor = color;
    var meter = $("#c-meter");
    meter.style.width = Math.min(pacing/2, 100) + "%";
    meter.style.background = color;
  }
  $$("#calc input, #calc select").forEach(function(el){
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });
  calc();

  /* ---------- árbol de diagnóstico ---------- */
  var TREE = FD.ARBOL;
  var path = [];
  function renderTree(key){
    var node = TREE[key];
    var pathEl = $("#tree-path"), qEl = $("#tree-question"), actEl = $("#tree-actions"), resEl = $("#tree-result"), resetEl = $("#tree-reset");
    pathEl.innerHTML = "";
    path.forEach(function(p){
      var s = document.createElement("span");
      s.innerHTML = p.q + " <b>" + p.a + "</b>";
      pathEl.appendChild(s);
    });
    if (node.r){
      qEl.textContent = "Resultado del recorrido";
      actEl.innerHTML = "";
      resEl.hidden = false;
      resEl.innerHTML = "<strong>" + node.r + "</strong><p>" + node.d + "</p>";
      resEl.classList.remove("fade-in"); void resEl.offsetWidth; resEl.classList.add("fade-in");
      resetEl.hidden = false;
    } else {
      qEl.textContent = node.q;
      resEl.hidden = true;
      actEl.innerHTML = "";
      node.a.forEach(function(opt){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "button " + (opt.l === "Sí" ? "button-primary" : "button-ghost");
        b.textContent = opt.l;
        b.addEventListener("click", function(){
          path.push({q:node.q, a:opt.l});
          renderTree(opt.to);
        });
        actEl.appendChild(b);
      });
      resetEl.hidden = path.length === 0;
    }
  }
  $("#tree-reset").addEventListener("click", function(){ path = []; renderTree("start"); });
  renderTree("start");

  /* ---------- constructor de nomenclatura ---------- */
  function val(id){ return ($(id).value || "").trim(); }
  function build(){
    var obj = val("#b-objetivo"), ini = val("#b-iniciativa"), mer = val("#b-mercado"), per = val("#b-periodo");
    $("#out-campana").textContent = [obj||"[Objetivo]", ini||"[Iniciativa]", mer||"[Mercado]", per||"[Periodo]"].join(" | ");
    $("#out-audiencia").textContent = [val("#b-aud-tipo")||"[Tipo]", val("#b-aud-seg")||"[Segmento] | [Condición]"].join(" | ");
    $("#out-anuncio").textContent = [val("#b-ad-formato")||"[Formato]", val("#b-ad-angulo")||"[Ángulo]", val("#b-ad-cta")||"[CTA] | [Versión]"].join(" | ");
    $("#out-doc").textContent = ["Estrategia", ini||"[Tema]", per||"[Periodo]"].join(" | ");
    $("#out-mail").textContent = "[" + (val("#b-cliente")||"Cliente") + "] " + (ini||"[Tema / entregable]") + " " + (per||"");
  }
  $$("#builder input, #builder select").forEach(function(el){
    el.addEventListener("input", build);
    el.addEventListener("change", build);
  });
  build();
  $("#copy-btn").addEventListener("click", function(){
    var text = ["Campaña: "+$("#out-campana").textContent,
                "Audiencia: "+$("#out-audiencia").textContent,
                "Anuncio: "+$("#out-anuncio").textContent,
                "Documento: "+$("#out-doc").textContent,
                "Correo: "+$("#out-mail").textContent].join("\n");
    var ok = $("#copy-ok");
    function flash(){ ok.classList.add("show"); setTimeout(function(){ ok.classList.remove("show"); }, 2200); }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(flash).catch(flash);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch(e){}
      document.body.removeChild(ta); flash();
    }
  });

  /* ---------- combinador de variables (90) ---------- */
  function optCode(id){ var s = $(id); var o = s.options[s.selectedIndex]; return o.getAttribute("data-code") || o.textContent; }
  function optText(id){ var s = $(id); return s.options[s.selectedIndex].textContent; }
  function mix(){
    $("#out-combo").textContent = [optCode("#v-a"), optCode("#v-b"), optCode("#v-c")].join(" / ");
    $("#out-combo-read").textContent = [optText("#v-a"), optText("#v-b"), optText("#v-c")].join(" / ");
    $("#out-combo-name").textContent = [optText("#v-formato"),
                                        optText("#v-a") + " · " + optText("#v-b"),
                                        optText("#v-c"),
                                        val("#v-version") || "V01"].join(" | ");
  }
  $$("#vmix input, #vmix select").forEach(function(el){
    el.addEventListener("input", mix);
    el.addEventListener("change", mix);
  });
  mix();

  /* ---------- tablero de distribución de cuentas (93) ---------- */
  var board = $("#board");
  if (board && window.FD && FD.CUENTAS){
    var DATA = FD.CUENTAS, LLAVE = "fd-reparto-cuentas-v1";
    var elegida = null;

    function base(){
      var o = {};
      DATA.cuentas.forEach(function(c){ o[c.n] = c.r; });
      return o;
    }
    function cargar(){
      try {
        var raw = window.localStorage.getItem(LLAVE);
        if (!raw) return base();
        var g = JSON.parse(raw), o = base(), validos = {};
        DATA.equipo.forEach(function(p){ validos[p.id] = true; });
        DATA.cuentas.forEach(function(c){ if (g[c.n] && validos[g[c.n]]) o[c.n] = g[c.n]; });
        return o;
      } catch(e){ return base(); }
    }
    function guardar(){
      try { window.localStorage.setItem(LLAVE, JSON.stringify(reparto)); } catch(e){}
    }
    var reparto = cargar();

    function mover(cuenta, persona){
      if (cuenta && persona && reparto[cuenta] !== persona){
        reparto[cuenta] = persona;
        guardar();
      }
      elegida = null;
      pintar();
    }
    function ficha(c){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ficha" + (elegida === c.n ? " is-picked" : "");
      b.draggable = true;
      b.setAttribute("data-cuenta", c.n);
      b.setAttribute("aria-pressed", elegida === c.n ? "true" : "false");
      b.innerHTML = "<span>" + c.n + "</span><b>" + (c.c == null ? "—" : c.c) + "</b>";
      b.addEventListener("dragstart", function(ev){
        elegida = null;
        ev.dataTransfer.setData("text/plain", c.n);
        ev.dataTransfer.effectAllowed = "move";
        b.classList.add("is-dragging");
      });
      b.addEventListener("dragend", function(){ b.classList.remove("is-dragging"); });
      b.addEventListener("click", function(ev){
        ev.stopPropagation();
        if (elegida && elegida !== c.n){ mover(elegida, reparto[c.n]); return; }
        elegida = (elegida === c.n) ? null : c.n;
        pintar();
      });
      return b;
    }
    function pintar(){
      var cargas = DATA.equipo.map(function(p){
        return DATA.cuentas.reduce(function(a,c){ return a + (reparto[c.n]===p.id ? (c.c||0) : 0); }, 0);
      });
      var tope = Math.max.apply(null, cargas.concat([1]));
      board.innerHTML = "";
      DATA.equipo.forEach(function(p, idx){
        var mias = DATA.cuentas.filter(function(c){ return reparto[c.n] === p.id; });
        var col = document.createElement("div");
        col.className = "board-col";
        col.setAttribute("data-persona", p.id);

        var head = document.createElement("div");
        head.className = "board-head";
        head.innerHTML = "<strong>" + p.nombre + "</strong><span>" + mias.length +
                         (mias.length === 1 ? " cuenta · " : " cuentas · ") + cargas[idx] + " camp.</span>";
        col.appendChild(head);

        var load = document.createElement("div");
        load.className = "board-load";
        var barra = document.createElement("i");
        barra.style.width = Math.round(cargas[idx] / tope * 100) + "%";
        load.appendChild(barra);
        col.appendChild(load);

        var drop = document.createElement("div");
        drop.className = "board-drop";
        if (!mias.length){
          var vacio = document.createElement("button");
          vacio.type = "button";
          vacio.className = "board-empty";
          vacio.textContent = elegida ? "Soltar aquí" : "Sin cuentas asignadas";
          vacio.addEventListener("click", function(ev){ ev.stopPropagation(); if (elegida) mover(elegida, p.id); });
          drop.appendChild(vacio);
        }
        mias.forEach(function(c){ drop.appendChild(ficha(c)); });
        col.appendChild(drop);

        col.addEventListener("dragover", function(ev){ ev.preventDefault(); ev.dataTransfer.dropEffect = "move"; col.classList.add("is-over"); });
        col.addEventListener("dragleave", function(){ col.classList.remove("is-over"); });
        col.addEventListener("drop", function(ev){
          ev.preventDefault();
          col.classList.remove("is-over");
          mover(ev.dataTransfer.getData("text/plain"), p.id);
        });
        col.addEventListener("click", function(){ if (elegida) mover(elegida, p.id); });
        board.appendChild(col);
      });
      resumen();
    }
    function resumen(){
      var camp = 0, sin = [];
      DATA.cuentas.forEach(function(c){ camp += (c.c || 0); if (c.c == null) sin.push(c.n); });
      $("#cuentas-total").textContent = DATA.cuentas.length + " cuentas · " + camp + " campañas activas";
      $("#cuentas-nota").textContent =
        "El tablero original declaraba " + DATA.total_declarado + " campañas activas y la suma de las fichas da " + camp +
        ". " + sin.length + " cuentas no traían conteo (" + sin.join(", ") +
        "). Antes de usar la cifra en un informe hay que reconciliar esa diferencia contra la fuente.";
    }
    $("#cuentas-reset").addEventListener("click", function(){
      try { window.localStorage.removeItem(LLAVE); } catch(e){}
      reparto = base();
      elegida = null;
      pintar();
    });
    pintar();
  }
})();
