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

  /* El umbral de densidad vive en un solo lugar: de 8 items en adelante una nube
     de pastillas deja de leerse y funciona mejor como lista en columnas. */
  FD.DENSA = 7;

  /* Las listas escritas a mano en el HTML tienen que seguir el mismo criterio que
     las que arma el JS; si no, media pagina densifica y la otra media no. */
  FD.densificar = function(raiz){
    /* Las que llena el JS estan vacias en este momento y quedan en no-densa;
       FD.chips las vuelve a medir cuando las pinta, asi que no hay conflicto. */
    FD.$$("ul.chips", raiz || document).forEach(function(ul){
      ul.classList.toggle("chips-densa", ul.children.length > FD.DENSA);
    });
  };

  /* pinta una lista de textos como chips, con entrada escalonada */
  FD.chips = function(ul, arr){
    ul.classList.toggle("chips-densa", arr.length > FD.DENSA);
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
