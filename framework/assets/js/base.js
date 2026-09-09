/* ============================================================
   Framework Digital · base.js
   Utilidades compartidas por el resto de scripts.
   ============================================================ */

window.FD = window.FD || {};

(function(FD){
  "use strict";

  /* selectores cortos */
  FD.$  = function(s,c){return (c||document).querySelector(s)};
  FD.$$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ¿el sistema pide menos movimiento?
     El CSS ya lo respeta, pero hay dos rutas que una media query no alcanza:
     un contador que escribe textContent frame a frame y un scroll programático.
     Se consulta en vivo, no se cachea: el usuario puede cambiar el ajuste. */
  FD.menosMovimiento = function(){
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  /* copia al portapapeles y dice la VERDAD sobre el resultado.
     Antes ambos botones hacían .then(aviso).catch(aviso): el fallo mostraba
     el mismo mensaje verde de éxito, y el usuario pegaba en una campaña real
     lo que hubiera antes en el portapapeles. */
  FD.copiar = function(texto, avisador){
    function fin(ok){
      avisador.textContent = ok
        ? "Copiado al portapapeles"
        : "No se pudo copiar. Selecciona el texto y usa Ctrl+C.";
      avisador.classList.toggle("is-error", !ok);
      avisador.classList.add("show");
      /* el fallo pide una acción: se queda más tiempo en pantalla */
      setTimeout(function(){ avisador.classList.remove("show"); }, ok ? 2400 : 6000);
    }
    function alternativa(){
      var ta = document.createElement("textarea");
      ta.value = texto;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.top = "-1000px";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch(e){ ok = false; }
      document.body.removeChild(ta);
      fin(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(texto).then(function(){ fin(true); }).catch(alternativa);
    } else {
      alternativa();
    }
  };

  /* pinta una lista de textos como chips, con entrada escalonada */
  FD.chips = function(ul, arr){
    /* de 8 items en adelante se lee mejor como lista en columnas que como nube */
    ul.classList.toggle("chips-densa", arr.length > 7);
    ul.innerHTML = "";
    arr.forEach(function(t,i){
      var li = document.createElement("li");
      li.textContent = t;
      li.style.animation = "fadeUp .4s cubic-bezier(.22,1,.36,1) both";
      li.style.animationDelay = (i*22)+"ms";
      ul.appendChild(li);
    });
  };

  /* pinta una lista de textos como items simples */
  FD.lista = function(ul, arr){
    ul.innerHTML = "";
    arr.forEach(function(t){ var li=document.createElement("li"); li.textContent=t; ul.appendChild(li); });
  };

  /* ---------- patrón WAI-ARIA de pestañas ----------
     Los contenedores ya declaraban role="tablist" y sus hijos role="tab",
     pero faltaba lo que el patrón exige de verdad: mover el foco con las
     flechas y sacar del orden de tabulación las pestañas no activas.
     Va por delegación porque casi todas las pestañas las pinta el JS
     después de que este archivo se ejecuta. */
  FD.tabs = function(){
    function tabsDe(lista){ return FD.$$('[role="tab"]', lista); }

    /* solo la pestaña activa entra con Tab; entre pestañas se navega con flechas */
    function sincronizar(lista){
      var ts = tabsDe(lista);
      var hayActiva = ts.some(function(t){ return t.getAttribute("aria-selected") === "true"; });
      ts.forEach(function(t, i){
        var activa = hayActiva ? t.getAttribute("aria-selected") === "true"
                               : t.classList.contains("is-active") || i === 0;
        t.tabIndex = activa ? 0 : -1;
      });
    }

    function listaDe(el){ return el && el.closest ? el.closest('[role="tablist"]') : null; }

    document.addEventListener("keydown", function(e){
      var t = e.target;
      if (!t || t.getAttribute("role") !== "tab") return;
      var lista = listaDe(t); if (!lista) return;
      var ts = tabsDe(lista), i = ts.indexOf(t); if (i < 0) return;
      var d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key];
      var n = null;
      if (d) n = ts[(i + d + ts.length) % ts.length];
      else if (e.key === "Home") n = ts[0];
      else if (e.key === "End") n = ts[ts.length - 1];
      if (!n) return;
      e.preventDefault();
      n.focus(); n.click();
    });

    document.addEventListener("click", function(e){
      var lista = listaDe(e.target); if (lista) setTimeout(function(){ sincronizar(lista); }, 0);
    });

    FD.$$('[role="tablist"]').forEach(sincronizar);
  };
})(window.FD);
