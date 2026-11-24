/* ============================================================
   Framework Digital · interacciones.js
   Navegación, animaciones y bloques que se pintan desde contenido.js
   ============================================================ */

(function(){
  "use strict";
  var FD = window.FD, $ = FD.$, $$ = FD.$$;
  var fillChips = FD.chips, fillList = FD.lista;

  /* El progreso de lectura usa scroll-driven animation en CSS. Así no hay un
     listener ejecutándose en cada frame durante un documento tan largo. */

  /* ---------- reveal on scroll ---------- */
  var revealables = $$("[data-reveal]");
  /* Stagger inspirado en inView/stagger: cada grupo entra como una secuencia
     legible, no como una pared de tarjetas que aparece al mismo tiempo. */
  var staggerGroups = $$(".grid-2[data-reveal],.grid-3[data-reveal],.phases[data-reveal],.pillars[data-reveal],.split[data-reveal],.quadrant[data-reveal],.tesis[data-reveal],.notas[data-reveal],.columnas[data-reveal],.linea[data-reveal]");
  staggerGroups.forEach(function(group){
    group.classList.add("motion-stagger");
    Array.prototype.forEach.call(group.children, function(child, i){
      child.style.setProperty("--stagger-delay", (i * 55) + "ms");
    });
  });
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, {rootMargin:"0px 0px -8% 0px", threshold:0.06});
    revealables.forEach(function(el){io.observe(el)});
  } else {
    revealables.forEach(function(el){el.classList.add("is-visible")});
  }

  /* ---------- contadores ---------- */
  function countUp(el){
    var target = parseInt(el.getAttribute("data-count"),10) || 0;
    /* con movimiento reducido la cifra se escribe de una vez: quien abre esta
       página cinco veces al día no debería esperar 1,1s para leer un "5". */
    if (FD.menosMovimiento()){ el.textContent = target; return; }
    var start = null, dur = 1100;
    function tick(ts){
      if (!start) start = ts;
      var p = Math.min((ts-start)/dur,1);
      el.textContent = Math.round(target * (1 - Math.pow(1-p,3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window){
    var ioc = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); ioc.unobserve(e.target);} });
    },{threshold:.5});
    counters.forEach(function(el){ioc.observe(el)});
  } else { counters.forEach(function(el){el.textContent = el.getAttribute("data-count")}); }

  function destino(id){
    if (document.getElementById(id)) return "#" + id;
    var pagina = Object.keys(FD.ANCLAS).find(function(nombre){
      return FD.ANCLAS[nombre].includes(id);
    });
    return (pagina ? pagina + ".html" : "index.html") + "#" + id;
  }

  function abrirEnlaceAnterior(){
    var id = location.hash.slice(1);
    if (!id || document.getElementById(id)) return;
    var href = destino(id);
    if (!href.startsWith("index.html")) location.replace(href);
  }
  abrirEnlaceAnterior();
  window.addEventListener("hashchange", abrirEnlaceAnterior);

  var headerSearch = $("#header-search");
  if (headerSearch){
    headerSearch.addEventListener("click", function(){
      var dialog = $("#command-dialog");
      if (dialog && typeof dialog.showModal === "function"){
        document.dispatchEvent(new CustomEvent("open-command"));
      } else {
        $("#q").focus();
      }
    });
  }

  /* ---------- pilares ---------- */
  if ($("#pillar-panel")){
    var PILLARS = FD.PILARES;
    function setPillar(n){
      var d = PILLARS[n]; if(!d) return;
      $("#pillar-tag").textContent = d.tag;
      $("#pillar-title").textContent = d.title;
      $("#pillar-question").textContent = d.q;
      $("#pillar-quote").textContent = d.q;
      fillChips($("#pillar-items"), d.items);
      $$(".pillar").forEach(function(b){
        var on = b.getAttribute("data-pillar") === String(n);
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", on ? "true":"false");
      });
      var panel = $("#pillar-panel");
      panel.classList.remove("fade-in"); void panel.offsetWidth; panel.classList.add("fade-in");
    }
    $$(".pillar").forEach(function(b){ b.addEventListener("click", function(){ setPillar(b.getAttribute("data-pillar")); }); });
    setPillar(1);
  }

  /* ---------- variables (06): tres tarjetas desde contenido.js ---------- */
  var varsGrid = $("#vars-grid");
  if (varsGrid && FD.VARIABLES){
    var grupos = Object.keys(FD.VARIABLES);
    grupos.forEach(function(k, idx){
      var d = FD.VARIABLES[k];
      var art = document.createElement("div");
      art.className = "ad-card";
      /* controlables, influenciables, externas: el margen de acción baja de 3 a 1 */
      art.style.setProperty("--nivel", grupos.length - idx);
      art.innerHTML = '<span class="ad-card__n">' + d.tag + '</span><h5>' + d.title +
                      '</h5><p style="margin:12px 0 16px">' + d.desc + '</p><ul class="chips"></ul>';
      varsGrid.appendChild(art);
      fillChips(art.querySelector("ul"), d.items);
    });
  }

  /* ---------- línea de trabajo ---------- */
  if ($("#stepper")){
    var STEPS = FD.ETAPAS;
    var stepper = $("#stepper");
    STEPS.forEach(function(s,i){
      var b = document.createElement("button");
      b.className = "ad-card ad-card--dark step" + (i===0 ? " is-on":"");
      b.type = "button";
      b.setAttribute("role","tab");
      b.setAttribute("aria-selected", i===0 ? "true":"false");
      b.setAttribute("data-step", i);
      b.innerHTML = '<span class="ad-card__n">'+s.n+'</span><strong>'+s.t+'</strong>';
      b.addEventListener("click", function(){ setStep(i,true); });
      stepper.appendChild(b);
    });
    var current = 0;
    function setStep(i, alinear){
      var s = STEPS[i]; if(!s) return;
      current = i;
      $("#step-tag").textContent = "Etapa " + s.n;
      $("#step-title").textContent = s.t;
      $("#step-desc").textContent = s.d;
      $("#step-label").textContent = s.label;
      fillChips($("#step-items"), s.items);
      $$(".step").forEach(function(b,idx){
        var on = idx === i;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", on ? "true":"false");
      });
      $("#flow-rail").style.transform = "scaleX(" + ((i+1)/STEPS.length) + ")";
      var panel = $("#step-panel");
      panel.classList.remove("fade-in"); void panel.offsetWidth; panel.classList.add("fade-in");
      var active = $$(".step")[i];
      if (alinear && active && active.scrollIntoView) active.scrollIntoView({behavior: FD.menosMovimiento() ? "auto" : "smooth", block:"nearest", inline:"center"});
    }
    $("#step-next").addEventListener("click", function(){ setStep((current+1) % STEPS.length,true); });
    setStep(0,false);
  }

  /* ---------- ciclo de campaña ---------- */
  var CYCLE = FD.CICLO;
  var cycleStage = $("#cycle-stage"), cycleDots = $("#cycle-dots"), cycleIdx = 0;
  if (cycleStage){
    CYCLE.forEach(function(s,i){
      var ang = (i/CYCLE.length)*Math.PI*2 - Math.PI/2;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cycle-node" + (i===0?" is-on":"");
      b.setAttribute("data-cycle", i);
      b.setAttribute("aria-label", "Estación " + (i+1) + ": " + s.t);
      b.style.left = (50 + 43*Math.cos(ang)) + "%";
      b.style.top  = (50 + 43*Math.sin(ang)) + "%";
      b.textContent = (i+1 < 10 ? "0" : "") + (i+1);
      b.addEventListener("click", function(){ setCycle(i); });
      b.addEventListener("mouseenter", function(){ setCycle(i); });
      cycleStage.appendChild(b);
      var dot = document.createElement("i");
      if (i===0) dot.className = "on";
      cycleDots.appendChild(dot);
    });
    var setCycle = function(i){
      var s = CYCLE[i]; if(!s) return;
      cycleIdx = i;
      var n = (i+1 < 10 ? "0" : "") + (i+1);
      $("#cycle-step").textContent = "Estación " + n;
      $("#cycle-name").textContent = s.t;
      $("#cycle-title").textContent = s.t;
      $("#cycle-desc").textContent = s.d;
      $("#cycle-ask").textContent = s.a;
      $$(".cycle-node").forEach(function(b,idx){ b.classList.toggle("is-on", idx===i); });
      $$("#cycle-dots i").forEach(function(d,idx){ d.className = idx===i ? "on":""; });
      var copy = $(".cycle-copy");
      copy.classList.remove("fade-in"); void copy.offsetWidth; copy.classList.add("fade-in");
    };
    $("#cycle-next").addEventListener("click", function(){ setCycle((cycleIdx+1) % CYCLE.length); });
    setCycle(0);
  }

  /* ---------- comunicación por partes ---------- */
  var MSG_NOTES = FD.NOTAS_MENSAJE;
  var msgParts = $$(".msg-part");
  if (msgParts.length){
    var setMsg = function(n){
      msgParts.forEach(function(b){ b.classList.toggle("is-on", b.getAttribute("data-part")===String(n)); });
      $$(".msg-body mark").forEach(function(m){ m.classList.toggle("is-on", m.getAttribute("data-mark")===String(n)); });
      $("#msg-note").textContent = MSG_NOTES[n] || "";
    };
    msgParts.forEach(function(b){
      var n = b.getAttribute("data-part");
      b.addEventListener("click", function(){ setMsg(n); });
      b.addEventListener("mouseenter", function(){ setMsg(n); });
    });
    $$(".msg-body mark").forEach(function(m){
      m.addEventListener("mouseenter", function(){ setMsg(m.getAttribute("data-mark")); });
    });
  }

  /* ---------- cadena de localizacion (37) ---------- */
  var locBody = $("#loc-tbody");
  if (locBody && FD.LOCALIZAR){
    FD.LOCALIZAR.forEach(function(e){
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + e.n + " · " + e.t + "</td><td>" + e.q + "</td><td>" + e.m + "</td><td>" + e.falla + "</td>";
      locBody.appendChild(tr);
    });
  }

  /* ---------- repositorio ---------- */
  if ($("#repo-list")){
    var REPO = FD.REPOSITORIO;
    var repoList = $("#repo-list");
    REPO.forEach(function(r,i){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "repo-item" + (i===0?" is-on":"");
      b.setAttribute("role","tab");
      b.setAttribute("aria-selected", i===0 ? "true":"false");
      b.setAttribute("data-repo", i);
      b.innerHTML = "<b>"+r.c+"</b>"+r.t;
      b.addEventListener("click", function(){ setRepo(i); });
      repoList.appendChild(b);
    });
    function setRepo(i){
      var r = REPO[i]; if(!r) return;
      $("#repo-tag").textContent = r.c;
      $("#repo-title").textContent = r.t;
      $("#repo-desc").textContent = r.d;
      fillChips($("#repo-items"), r.items);
      var note = $("#repo-note");
      if (r.note){ note.hidden = false; note.textContent = r.note; } else { note.hidden = true; }
      $$("#repo-list .repo-item").forEach(function(b,idx){
        var on = idx === i;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
    setRepo(0);
  }

  /* Motion-style view transitions for native details. The DOM remains native
     and accessible; supported browsers animate the layout, others toggle as usual. */
  function enlazarDetalleMotion(detail, siblings){
    var summary = detail && detail.querySelector ? detail.querySelector("summary") : null;
    if (!summary) return;
    summary.addEventListener("click", function(e){
      if (e.target.closest && e.target.closest("a")) return;
      e.preventDefault();
      var next = !detail.open;
      FD.viewTransition(function(){
        detail.open = next;
        if (next && siblings) siblings.forEach(function(other){ if (other !== detail) other.open = false; });
      });
    });
  }

  /* ---------- acordeón exclusivo de interfaces ---------- */
  document.addEventListener("pointerdown", function(e){
    var target = e.target && e.target.closest ? e.target.closest("button,[role=\"tab\"],summary") : null;
    if (target) FD.pressSpring(target);
  }, {passive:true});

  var ifaces = $$(".iface");
  ifaces.forEach(function(d){
    enlazarDetalleMotion(d, ifaces);
    d.addEventListener("toggle", function(){
      if (d.open) ifaces.forEach(function(o){ if(o!==d) o.open = false; });
    });
  });

  /* ---------- carrusel ----------
     El marcado es una lista de .card dentro de .carrusel; el JS le agrega las
     pestañas (con el data-tab de cada ficha), las flechas y el contador. Sin JS
     queda una fila que se desplaza de lado, con todo el contenido presente. */
  $$(".carrusel").forEach(function(c, ci){
    var fichas = $$(":scope > .ad-card", c);
    if (fichas.length < 2) return;
    var pista = document.createElement("div");
    pista.className = "carrusel-pista";
    pista.tabIndex = 0;
    pista.setAttribute("aria-label", (c.getAttribute("aria-label") || "Carrusel") + ". Usa las flechas o las pestañas para recorrerlo.");
    var tabs = document.createElement("div");
    tabs.className = "carrusel-tabs";
    tabs.setAttribute("aria-label", c.getAttribute("aria-label") || "Fichas");
    var botones = fichas.map(function(f, i){
      f.id = f.id || "car" + ci + "-" + (i + 1);
      f.setAttribute("aria-roledescription", "ficha");
      f.setAttribute("aria-label", (i + 1) + " de " + fichas.length);
      pista.appendChild(f);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ad-chip";
      b.setAttribute("aria-controls", f.id);
      b.textContent = f.getAttribute("data-tab") || (f.querySelector("h3,h4,h5") || f).textContent.trim();
      b.addEventListener("click", function(){ ir(i); });
      tabs.appendChild(b);
      return b;
    });
    var nav = document.createElement("div");
    nav.className = "carrusel-nav";
    nav.innerHTML = '<button type="button" aria-label="Ficha anterior"><svg class="ico" aria-hidden="true"><use href="#i-chev-l"/></svg></button>' +
                    '<span class="carrusel-cuenta" aria-live="polite"></span>' +
                    '<button type="button" aria-label="Ficha siguiente"><svg class="ico" aria-hidden="true"><use href="#i-chev-r"/></svg></button>';
    var prev = nav.children[0], cuenta = nav.children[1], next = nav.children[2];
    c.appendChild(tabs); c.appendChild(pista); c.appendChild(nav);

    var actual = -1;
    function dos(n){ return (n < 10 ? "0" : "") + n; }
    function marcar(i){
      if (i === actual) return;
      actual = i;
      botones.forEach(function(b, k){
        b.classList.toggle("is-on", k === i);
        if (k === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      });
      cuenta.textContent = dos(i + 1) + " / " + dos(fichas.length);
      prev.disabled = i === 0;
      next.disabled = i === fichas.length - 1;
    }
    function ir(i){
      i = Math.max(0, Math.min(fichas.length - 1, i));
      destino = i;
      pista.scrollTo({left: fichas[i].offsetLeft - pista.offsetLeft, behavior: FD.menosMovimiento() ? "auto" : "smooth"});
      marcar(i);
    }
    /* la ficha pedida con pestaña o flecha manda hasta que alguien desplace la pista a mano:
       las últimas no llegan al borde izquierdo y la más cercana no sería la pedida */
    var destino = -1;
    function leer(){
      var x = pista.scrollLeft, mejor = 0, dist = Infinity;
      var alFinal = x + pista.clientWidth >= pista.scrollWidth - 4;
      pista.classList.toggle("al-final", alFinal);
      if (destino >= 0){ marcar(destino); return; }
      fichas.forEach(function(f, k){
        var d = Math.abs(f.offsetLeft - pista.offsetLeft - x);
        if (d < dist){ dist = d; mejor = k; }
      });
      marcar(alFinal ? fichas.length - 1 : mejor);
    }
    ["wheel", "touchstart", "pointerdown"].forEach(function(ev){
      pista.addEventListener(ev, function(){ destino = -1; }, {passive:true});
    });
    var t = null;
    pista.addEventListener("scroll", function(){ clearTimeout(t); t = setTimeout(leer, 60); }, {passive:true});
    prev.addEventListener("click", function(){ ir(actual - 1); });
    next.addEventListener("click", function(){ ir(actual + 1); });
    pista.addEventListener("keydown", function(e){
      if (e.key === "ArrowRight"){ e.preventDefault(); ir(actual + 1); }
      else if (e.key === "ArrowLeft"){ e.preventDefault(); ir(actual - 1); }
    });
    c._irA = function(el){
      var k = fichas.indexOf(el.closest(".carrusel-pista > .ad-card"));
      if (k >= 0) ir(k);
    };
    marcar(0); leer();
  });
  /* un enlace o un resultado de búsqueda que apunta dentro de una ficha la trae a la vista */
  function mostrarDestino(){
    var id = location.hash.slice(1);
    var el = id && document.getElementById(id);
    var c = el && el.closest && el.closest(".carrusel");
    if (c && c._irA) c._irA(el);
  }
  window.addEventListener("hashchange", mostrarDestino);
  mostrarDestino();

  /* ---------- ubicación y mapa de cada sección ----------
     La familia sale de FD.INDICE y las subsecciones del propio DOM: así el
     mapa no se puede desactualizar respecto a lo que la sección contiene. */
  if (FD.INDICE && FD.FAMILIAS){
    var famDe = {};
    FD.INDICE.forEach(function(b){
      var fam = FD.FAMILIAS.filter(function(f){ return f.id === b.f; })[0];
      if (fam && !famDe[b.a]) famDe[b.a] = fam.t;
    });
    $$("[data-framework-section]").forEach(function(sec){
      var cabeza = sec.querySelector(".wrap > .section-heading");
      if (!cabeza) return;
      var ceja = cabeza.querySelector(".eyebrow");
      if (ceja && famDe[sec.id]){
        var s = document.createElement("span");
        s.className = "loc-fam";
        s.textContent = famDe[sec.id];
        ceja.insertBefore(s, ceja.firstChild);
      }
      var destinos = $$(".divider[id], .sub-heading[id]", sec);
      if (destinos.length < 2) return;
      var nav = document.createElement("nav");
      nav.className = "en-seccion";
      nav.setAttribute("aria-label", "En " + cabeza.querySelector("h2").textContent.trim());
      var html = '<p>En esta sección</p><ol>';
      destinos.forEach(function(d){
        if (d.matches(".sub-heading") && d.closest(".divider[id]")) return;
        var h = d.matches(".sub-heading") ? d : d.querySelector("h3, h4");
        if (!h) return;
        var titulo = h.textContent.replace(/\s+/g, " ").trim();
        var num = "";
        var pastilla = h.querySelector(".num");
        if (pastilla){
          num = pastilla.textContent.trim();
          titulo = titulo.slice(num.length).trim();
        } else {
          var e = d.querySelector(".eyebrow span");
          var ix = !e && d.querySelector(".ad-card__n");
          if (e) num = e.textContent.trim();
          else if (ix) num = ix.textContent.split("·")[0].trim();
        }
        html += '<li><a href="#' + d.id + '"><b>' + num + '</b><span>' + titulo + '</span></a></li>';
      });
      nav.innerHTML = html + '</ol>';
      cabeza.appendChild(nav);
    });
  }

  /* ---------- índice consultable, agrupado por familias ----------
     Cada entrada separa el número del punto de su texto: se escanea por la
     columna de números y se lee por la de texto. Las familias son filtros que
     se prenden y se apagan (aria-pressed), no pestañas: no hay panel que abrir. */
  var toc = $("#toc");
  if (toc && FD.INDICE && FD.FAMILIAS){
    var grupos = [];

    /* quita tildes conservando la longitud, para que los índices sigan calzando */
    function plano(t){ return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    function escapar(t){ return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function partir(t){
      var m = t.match(/^(\d[\d.]*(?:\s*—\s*\d[\d.]*)?)\s*·\s*(.+)$/);
      return m ? {n: m[1].replace(/\s+/g, ""), t: m[2]} : {n: "", t: t};
    }

    FD.FAMILIAS.forEach(function(fam){
      var suyos = FD.INDICE.filter(function(b){ return b.f === fam.id; });
      if (!suyos.length) return;
      var sec = document.createElement("section");
      sec.className = "toc-fam";
      sec.setAttribute("data-fam", fam.id);
      sec.setAttribute("aria-label", fam.t);
      var total = suyos.reduce(function(n, b){ return n + b.items.length; }, 0);
      var h = '<header class="toc-fam-h"><span>' + fam.r + '</span><h3>' + fam.t +
              '</h3><small>' + fam.d + '</small></header><div class="toc-grid">';
      suyos.forEach(function(b){
        h += '<article class="toc-block"><a class="toc-h" href="' + destino(b.a) + '"><b>' + b.n + '</b> <span>' + b.t + '</span></a><ul class="toc-list">';
        b.items.forEach(function(it){
          var x = partir(it.t);
          h += '<li><a href="' + destino(it.a) + '"><b class="toc-n">' + escapar(x.n) + '</b> <span class="toc-t">' + escapar(x.t) + '</span></a></li>';
        });
        h += '</ul></article>';
      });
      sec.innerHTML = h + '</div>';
      toc.appendChild(sec);
      grupos.push({
        el: sec, fam: fam, total: total,
        bloques: $$(".toc-block", sec).map(function(bl){
          return {
            el: bl,
            titulo: bl.querySelector(".toc-h").textContent,
            items: $$(".toc-list li", bl).map(function(li){
              var n = li.querySelector(".toc-n").textContent, t = li.querySelector(".toc-t");
              return {li: li, span: t, texto: t.textContent, busca: plano(n + " " + t.textContent)};
            })
          };
        })
      });
    });

    var campo = $("#toc-q"), marcador = $("#toc-count"), vacio = $("#toc-vacio");
    var barra = $("#toc-filtros"), famActiva = "todo", fichas = [];
    var TOTAL = grupos.reduce(function(n, g){ return n + g.total; }, 0);

    function resaltar(span, texto, termino){
      var i = termino ? plano(texto).indexOf(termino) : -1;
      if (i < 0){ span.textContent = texto; return; }
      span.innerHTML = escapar(texto.slice(0, i)) + "<mark>" + escapar(texto.slice(i, i + termino.length)) +
                       "</mark>" + escapar(texto.slice(i + termino.length));
    }

    function ficha(id, texto){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "toc-fil";
      b.setAttribute("aria-pressed", id === famActiva ? "true" : "false");
      b.innerHTML = '<span>' + texto + '</span><b></b>';
      b.addEventListener("click", function(){
        /* volver a pulsar la familia activa la apaga */
        famActiva = (famActiva === id && id !== "todo") ? "todo" : id;
        filtrar();
      });
      barra.appendChild(b);
      fichas.push({id: id, el: b, cuenta: b.querySelector("b")});
    }
    ficha("todo", "Todo el framework");
    FD.FAMILIAS.forEach(function(f){ ficha(f.id, f.t); });

    function filtrar(){
      var termino = plano((campo.value || "").trim());
      /* Sección y término se combinan para acotar la consulta. */
      var porFamilia = famActiva !== "todo";
      var visibles = 0, porFam = {};
      grupos.forEach(function(g){
        var enGrupo = 0;
        g.bloques.forEach(function(b){
          var enTitulo = !!termino && plano(b.titulo).indexOf(termino) >= 0;
          var propios = 0;
          b.items.forEach(function(it){
            var on = !termino || enTitulo || it.busca.indexOf(termino) >= 0;
            it.li.classList.toggle("is-hidden", !on);
            resaltar(it.span, it.texto, on && !enTitulo ? termino : "");
            if (on) propios++;
          });
          b.el.classList.toggle("is-hidden", propios === 0);
          enGrupo += propios;
        });
        porFam[g.fam.id] = enGrupo;
        var deLaFamilia = !porFamilia || g.fam.id === famActiva;
        g.el.classList.toggle("is-hidden", !deLaFamilia || enGrupo === 0);
        if (deLaFamilia) visibles += enGrupo;
      });
      var todas = grupos.reduce(function(n, g){ return n + porFam[g.fam.id]; }, 0);
      fichas.forEach(function(f){
        var sel = f.id === famActiva;
        var n = f.id === "todo" ? todas : porFam[f.id];
        f.el.setAttribute("aria-pressed", sel ? "true" : "false");
        f.cuenta.textContent = n;
        f.el.classList.toggle("is-cero", n === 0 && !sel);
      });
      if (termino) marcador.textContent = visibles + " de " + TOTAL + " entradas" + (porFamilia ? " en esta sección" : "");
      else if (porFamilia) marcador.textContent = visibles + " entradas en esta sección";
      else marcador.textContent = TOTAL + " entradas en " + FD.FAMILIAS.length + " secciones";
      vacio.hidden = visibles > 0;
    }
    campo.addEventListener("input", filtrar);
    campo.addEventListener("search", filtrar);
    filtrar();
  }

  /* ---------- botón de vuelta al índice ---------- */
  var alIndice = $("#al-indice");
  if (alIndice){
    var verBoton = function(){
      alIndice.classList.toggle("is-on", window.pageYOffset > window.innerHeight * 1.2);
    };
    window.addEventListener("scroll", verBoton, {passive:true});
    verBoton();
  }

  /* ---------- requisitos por tipo de solicitud (94) ---------- */
  var solLista = $("#sol-list");
  if (solLista && FD.SOLICITUDES){
    var SOL = FD.SOLICITUDES;
    var solActual = 0;

    var setSol = function(i){
      var x = SOL[i];
      if (!x) return;
      solActual = i;
      $("#sol-tag").textContent = x.c;
      $("#sol-title").textContent = x.t;
      $("#sol-pregunta").textContent = x.pregunta;
      fillList($("#sol-min"), x.min);
      fillChips($("#sol-des"), x.des);
      $("#sol-sale").textContent = x.sale;
      var sla = $("#sol-sla");
      if (sla) sla.textContent = x.sla;
      $("#sol-conecta").textContent = x.conecta;
      $("#sol-nota").textContent = x.nota;
      $$("#sol-list .repo-item").forEach(function(b, k){
        var on = k === i;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      var panel = $("#sol-title").closest ? $("#sol-title").closest(".panel") : null;
      if (panel){ panel.classList.remove("fade-in"); void panel.offsetWidth; panel.classList.add("fade-in"); }
    };

    SOL.forEach(function(x, i){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "repo-item" + (i === 0 ? " is-on" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.innerHTML = "<b>" + x.c + "</b>" + x.t;
      b.addEventListener("click", function(){ setSol(i); });
      solLista.appendChild(b);
    });
    setSol(0);

    /* plantilla lista para pegar en un correo o en una tarea */
    function plantilla(x){
      var l = [];
      l.push("SOLICITUD · " + x.t + "  [" + x.c + "]");
      l.push("");
      l.push("Cuenta:");
      l.push("Solicita (cliente / ejecutivo / interno):");
      l.push("Fecha de entrega:");
      l.push("Qué decisión o resultado habilita:");
      l.push("");
      l.push("MÍNIMOS PARA ENTRAR");
      x.min.forEach(function(m){ l.push("- " + m + ":"); });
      l.push("");
      l.push("SUMA VALOR (opcional)");
      x.des.forEach(function(d){ l.push("- " + d + ":"); });
      l.push("");
      l.push("Entregable esperado: " + x.sale + " · SLA estimado: " + x.sla);
      return l.join("\n");
    }
    $("#sol-copy").addEventListener("click", function(){
      var texto = plantilla(SOL[solActual]);
      FD.copiar(texto, $("#sol-copy-ok"));
    });
  }

  /* ---------- buscador global ----------
     Antes solo existía el filtro de #indice, que mira 91 títulos. El 95% del
     texto era inbuscable, y el trabajo primario declarado es la consulta
     puntual. Esto indexa el DOM ya pintado: sin build, sin dependencias. */
  (function(){
    var campo = $("#q"), caja = $("#q-res");
    if (!campo || !caja) return;

    var indice = null, marcado = -1;

    /* quita tildes conservando la longitud, para que los índices calcen */
    function plano(t){ return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
    function esc(t){ return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

    /* se construye al primer uso: para entonces contenido.js ya pintó todo */
    function leerPagina(doc, pagina){
      $$("main > section[id]:not(.framework-area), [data-framework-section], .area-intro", doc).forEach(function(sec){
        if (sec.id === "indice") return;
        var heading = sec.querySelector("h1,h2,h3");
        var area = sec.closest(".framework-area");
        var seccion = (area ? doc.getElementById(area.getAttribute("aria-labelledby")).textContent.trim() + " / " : "") +
          (heading ? heading.textContent.trim() : sec.id);
        $$("h1,h2,h3,h4,h5,p,li,figcaption,td,th", sec).forEach(function(el){
          /* solo hojas: si contiene otro indexable, el hijo ya lo cubre */
          if (el.querySelector("p,li,td,th,figcaption")) return;
          if (el.closest(".en-seccion")) return;
          var t = el.textContent.replace(/\s+/g," ").trim();
          if (t.length < 14) return;
          var conId = el.closest("[id]");
          var peso = /^H[1-5]$/.test(el.tagName) ? 0 : 1;
          var id = (conId && conId.id) || sec.id || (area ? area.id : "inicio");
          indice.push({ t:t, p:plano(t), s:seccion, a:pagina + "#" + id, w:peso });
        });
      });
    }

    function construir(){
      indice = [];
      leerPagina(document, "");
      // El índice permite encontrar también capítulos que viven en otra página.
      FD.INDICE.forEach(function(bloque){
        if (document.getElementById(bloque.a)) return;
        var area = FD.FAMILIAS.find(function(f){ return f.id === bloque.f; });
        [{a: bloque.a, t: bloque.t}].concat(bloque.items).forEach(function(item){
          indice.push({t:item.t, p:plano(item.t), s:area.t, a:destino(item.a), w:0});
        });
      });
      if (!/^https?:$/.test(location.protocol)) return;
      FD.FAMILIAS.forEach(function(familia){
        if (document.getElementById(familia.id)) return;
        var pagina = familia.id + ".html";
        fetch(pagina).then(function(response){
          if (!response.ok) return null;
          return response.text();
        }).then(function(html){
          if (!html) return;
          leerPagina(new DOMParser().parseFromString(html, "text/html"), pagina);
          if (!caja.hidden && campo.value.trim().length >= 2) buscar();
        }).catch(function(){ /* El índice de capítulos sigue disponible. */ });
      });
    }

    function resaltar(t, term){
      var i = plano(t).indexOf(term);
      if (i < 0) return esc(t);
      return esc(t.slice(0,i)) + "<mark>" + esc(t.slice(i,i+term.length)) + "</mark>" + esc(t.slice(i+term.length));
    }

    /* recorta el pasaje alrededor de la coincidencia: el contexto es lo útil */
    function pasaje(t, term){
      var i = plano(t).indexOf(term);
      if (t.length <= 150) return t;
      var ini = Math.max(0, i - 60);
      return (ini > 0 ? "…" : "") + t.slice(ini, ini + 150) + (ini + 150 < t.length ? "…" : "");
    }

    function cerrar(){ caja.hidden = true; caja.innerHTML = ""; marcado = -1; }

    function buscar(){
      var term = plano(campo.value.trim());
      if (term.length < 2){ cerrar(); guardarUrl(""); return; }
      if (!indice) construir();

      var hits = [];
      for (var i = 0; i < indice.length && hits.length < 400; i++){
        if (indice[i].p.indexOf(term) >= 0) hits.push(indice[i]);
      }
      hits.sort(function(a,b){ return a.w - b.w; });
      var top = hits.slice(0, 12);

      if (!top.length){
        caja.innerHTML = '<p class="q-vacio">Sin resultados para “' + esc(campo.value.trim()) +
                         '”. Prueba con otra palabra.</p>';
      } else {
        var html = '<ol>';
        top.forEach(function(h){
          html += '<li><a href="' + esc(h.a) + '">' +
                  '<span class="q-sec">' + esc(h.s) + '</span>' +
                  '<b>' + resaltar(pasaje(h.t, term), term) + '</b></a></li>';
        });
        html += '</ol>';
        if (hits.length > top.length){
          html += '<p class="q-vacio">' + hits.length + ' coincidencias en total. Afina la palabra para ver menos.</p>';
        }
        caja.innerHTML = html;
      }
      caja.hidden = false;
      marcado = -1;
      guardarUrl(campo.value.trim());
    }

    /* el resultado se puede compartir: ?q=pacing */
    function guardarUrl(v){
      if (!window.history || !history.replaceState) return;
      var url = new URL(location.href);
      if (v) url.searchParams.set("q", v);
      else url.searchParams.delete("q");
      if (url.href !== location.href && location.protocol !== "file:") history.replaceState(null, "", url);
    }

    var t = null;
    campo.addEventListener("input", function(){ clearTimeout(t); t = setTimeout(buscar, 120); });

    /* teclado: flechas por los resultados, Enter salta, Escape cierra */
    campo.addEventListener("keydown", function(e){
      var items = $$("a", caja);
      if (e.key === "Escape"){ campo.value = ""; cerrar(); guardarUrl(""); return; }
      if (!items.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp"){
        e.preventDefault();
        marcado += (e.key === "ArrowDown" ? 1 : -1);
        if (marcado < 0) marcado = items.length - 1;
        if (marcado >= items.length) marcado = 0;
        items[marcado].focus();
      } else if (e.key === "Enter"){
        e.preventDefault();
        items[marcado >= 0 ? marcado : 0].click();
      }
    });

    caja.addEventListener("keydown", function(e){
      if (e.key === "Escape"){ campo.focus(); cerrar(); }
    });
    caja.addEventListener("click", function(e){ if (e.target.closest("a")) cerrar(); });

    /* "/" y Ctrl+K desde cualquier parte, salvo mientras se escribe en otro campo */
    document.addEventListener("keydown", function(e){
      var en = e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
      var atajo = (e.key === "/" && !en) || ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K"));
      if (!atajo) return;
      e.preventDefault();
      var commandDialog = $("#command-dialog");
      if (commandDialog && typeof commandDialog.showModal === "function"){
        document.dispatchEvent(new CustomEvent("open-command"));
        return;
      }
      campo.scrollIntoView({ behavior: FD.menosMovimiento() ? "auto" : "smooth", block: "center" });
      campo.focus(); campo.select();
    });

    /* llegar con ?q= ya buscando */
    var q = new URLSearchParams(location.search).get("q");
    if (q){ campo.value = q; buscar(); }
  })();

  /* ---------- command palette · CommandDialog sin dependencia ---------- */
  (function(){
    var dialog = $("#command-dialog"), input = $("#command-q"), results = $("#command-results");
    if (!dialog || !input || !results) return;
    var globalSearch = $("#q"), globalResults = $("#q-res"), close = $("#command-close");

    function syncResults(){
      if (!globalResults) return;
      results.innerHTML = globalResults.innerHTML;
      if (!input.value.trim()) results.innerHTML = '<p class="q-vacio">Escribe una palabra para buscar. También puedes ir directo a una sección.</p>';
    }
    function open(){
      if (dialog.open) return;
      if (globalSearch) input.value = globalSearch.value;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      syncResults();
      window.setTimeout(function(){ input.focus(); input.select(); }, 0);
    }
    function shut(){
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
    document.addEventListener("open-command", open);
    if (globalResults) new MutationObserver(function(){
      if (dialog.open) syncResults();
    }).observe(globalResults, {childList:true});
    close.addEventListener("click", shut);
    dialog.addEventListener("click", function(e){ if (e.target === dialog) shut(); });
    input.addEventListener("input", function(){
      if (globalSearch){
        globalSearch.value = input.value;
        globalSearch.dispatchEvent(new Event("input", {bubbles:true}));
      }
    });
    input.addEventListener("keydown", function(e){
      if (e.key === "Escape"){ e.preventDefault(); shut(); return; }
      var items = $$('a', results);
      if (!items.length) return;
      var active = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown" || e.key === "ArrowUp"){
        e.preventDefault();
        active += e.key === "ArrowDown" ? 1 : -1;
        if (active < 0) active = items.length - 1;
        if (active >= items.length) active = 0;
        items[active].focus();
      } else if (e.key === "Enter"){
        e.preventDefault();
        items[active >= 0 ? active : 0].click();
      }
    });
    results.addEventListener("click", function(e){ if (e.target.closest("a")) shut(); });
    var shortcuts = $$(".command-shortcuts a");
    shortcuts.forEach(function(a){ a.addEventListener("click", shut); });
    document.addEventListener("keydown", function(e){
      if (!dialog.open || !(e.metaKey || e.ctrlKey) || !/^[1-4]$/.test(e.key)) return;
      e.preventDefault();
      if (shortcuts[Number(e.key) - 1]) shortcuts[Number(e.key) - 1].click();
    });
    dialog.addEventListener("close", function(){ if (globalSearch) globalSearch.value = input.value; });
  })();
})();
