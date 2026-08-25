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
})(window.FD);
