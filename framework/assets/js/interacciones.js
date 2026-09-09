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

  /* ---------- menú completo ----------
     Los diecinueve destinos viven en un panel: se abre con el botón, se cierra
     al elegir un enlace, con Escape o al tocar fuera del header. */
  var header = $(".site-header"), toggle = $("#nav-toggle");
  if (header && toggle){
    function cerrarMenu(){
      header.classList.remove("nav-abierto");
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Abrir el menú");
    }
    toggle.addEventListener("click", function(){
      var abierto = header.classList.toggle("nav-abierto");
      toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
      toggle.setAttribute("aria-label", abierto ? "Cerrar el menú" : "Abrir el menú");
    });
    $$("#mainnav a").forEach(function(a){ a.addEventListener("click", cerrarMenu); });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && header.classList.contains("nav-abierto")){ cerrarMenu(); toggle.focus(); }
    });
    document.addEventListener("click", function(e){
      if (header.classList.contains("nav-abierto") && !header.contains(e.target)) cerrarMenu();
    });
  }

  /* La búsqueda sigue siendo accesible aunque el hero ya no esté en pantalla. */
  var headerSearch = $("#header-search"), globalSearch = $("#q");
  if (headerSearch && globalSearch){
    headerSearch.addEventListener("click", function(){
      if (header && header.classList.contains("nav-abierto")){
        header.classList.remove("nav-abierto");
        toggle.setAttribute("aria-expanded","false");
      }
      globalSearch.scrollIntoView({behavior:FD.menosMovimiento() ? "auto" : "smooth",block:"center"});
      window.setTimeout(function(){ globalSearch.focus(); }, FD.menosMovimiento() ? 0 : 320);
    });
  }

  /* ---------- nav activo ---------- */
  var navLinks = $$("#mainnav a");
  var navCurrent = $("#nav-current");
  var sections = navLinks.map(function(a){return $(a.getAttribute("href"))}).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length){
    var ion = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          navLinks.forEach(function(a){
            var actual = a.getAttribute("href") === "#"+e.target.id;
            a.classList.toggle("is-current", actual);
            if (actual && navCurrent) navCurrent.textContent = a.textContent;
          });
        }
      });
    },{rootMargin:"-45% 0px -50% 0px"});
    sections.forEach(function(s){ion.observe(s)});
  }

  /* ---------- pilares ---------- */
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
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true":"false");
    });
    var panel = $("#pillar-panel");
    panel.classList.remove("fade-in"); void panel.offsetWidth; panel.classList.add("fade-in");
  }
  $$(".pillar").forEach(function(b){ b.addEventListener("click", function(){ setPillar(b.getAttribute("data-pillar")); }); });
  setPillar(1);

  /* ---------- variables (06): tres tarjetas desde contenido.js ---------- */
  var varsGrid = $("#vars-grid");
  if (varsGrid && FD.VARIABLES){
    Object.keys(FD.VARIABLES).forEach(function(k){
      var d = FD.VARIABLES[k];
      var art = document.createElement("div");
      art.className = "card card-light";
      art.innerHTML = '<span class="card-index">' + d.tag + '</span><h3>' + d.title +
                      '</h3><p style="margin:12px 0 16px">' + d.desc + '</p><ul class="chips"></ul>';
      varsGrid.appendChild(art);
      fillChips(art.querySelector("ul"), d.items);
    });
  }

  /* ---------- línea de trabajo ---------- */
  var STEPS = FD.ETAPAS;
  var stepper = $("#stepper");
  STEPS.forEach(function(s,i){
    var b = document.createElement("button");
    b.className = "step" + (i===0 ? " is-active":"");
    b.type = "button";
    b.setAttribute("role","tab");
    b.setAttribute("aria-selected", i===0 ? "true":"false");
    b.setAttribute("data-step", i);
    b.innerHTML = '<span>'+s.n+'</span><strong>'+s.t+'</strong>';
    b.addEventListener("click", function(){ setStep(i,true); });
    stepper.appendChild(b);
  });
  var current = 0;
  function setStep(i, alinear){
    var s = STEPS[i]; if(!s) return;
    current = i;
    $("#step-tag").textContent = "ETAPA " + s.n;
    $("#step-title").textContent = s.t;
    $("#step-desc").textContent = s.d;
    $("#step-label").textContent = s.label;
    fillChips($("#step-items"), s.items);
    $$(".step").forEach(function(b,idx){
      var on = idx === i;
      b.classList.toggle("is-active", on);
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

  /* ---------- ciclo de campaña ---------- */
  var CYCLE = FD.CICLO;
  var cycleStage = $("#cycle-stage"), cycleDots = $("#cycle-dots"), cycleIdx = 0;
  if (cycleStage){
    CYCLE.forEach(function(s,i){
      var ang = (i/CYCLE.length)*Math.PI*2 - Math.PI/2;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cycle-node" + (i===0?" is-active":"");
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
      $("#cycle-step").textContent = "ESTACIÓN " + n;
      $("#cycle-name").textContent = s.t;
      $("#cycle-title").textContent = s.t;
      $("#cycle-desc").textContent = s.d;
      $("#cycle-ask").textContent = s.a;
      $$(".cycle-node").forEach(function(b,idx){ b.classList.toggle("is-active", idx===i); });
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
      msgParts.forEach(function(b){ b.classList.toggle("is-active", b.getAttribute("data-part")===String(n)); });
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
  var REPO = FD.REPOSITORIO;
  var repoList = $("#repo-list");
  REPO.forEach(function(r,i){
    var b = document.createElement("button");
    b.type = "button";
    b.className = "repo-item" + (i===0?" is-active":"");
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
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
  }
  setRepo(0);

  /* ---------- acordeón exclusivo de interfaces ---------- */
  var ifaces = $$(".iface");
  ifaces.forEach(function(d){
    d.addEventListener("toggle", function(){
      if (d.open) ifaces.forEach(function(o){ if(o!==d) o.open = false; });
    });
  });

  /* ---------- índice consultable, agrupado por familias ---------- */
  var toc = $("#toc");
  if (toc && FD.INDICE && FD.FAMILIAS){
    var grupos = [];

    FD.FAMILIAS.forEach(function(fam){
      var suyos = FD.INDICE.filter(function(b){ return b.f === fam.id; });
      if (!suyos.length) return;
      var sec = document.createElement("section");
      sec.className = "toc-fam";
      sec.setAttribute("data-fam", fam.id);
      var total = suyos.reduce(function(n, b){ return n + b.items.length; }, 0);
      var h = '<header class="toc-fam-h"><span>' + fam.r + '</span><b>' + fam.t +
              '</b><small>' + fam.d + ' · ' + total + ' entradas</small></header><div class="toc-grid">';
      suyos.forEach(function(b){
        h += '<article class="toc-block"><a class="toc-h" href="#' + b.a + '"><b>' + b.n + '</b>' + b.t + '</a><ul class="toc-list">';
        b.items.forEach(function(it){ h += '<li><a href="#' + it.a + '">' + it.t + '</a></li>'; });
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
              var a = li.querySelector("a");
              return {li: li, a: a, texto: a.textContent};
            })
          };
        })
      });
    });

    var campo = $("#toc-q"), marcador = $("#toc-count"), vacio = $("#toc-vacio");
    var barra = $("#toc-filtros"), famActiva = "todo", fichas = [];
    var TOTAL = grupos.reduce(function(n, g){ return n + g.total; }, 0);

    /* quita tildes conservando la longitud, para que los índices sigan calzando */
    function plano(t){ return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    function escapar(t){ return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function resaltar(a, texto, termino){
      if (!termino){ a.textContent = texto; return; }
      var i = plano(texto).indexOf(termino);
      if (i < 0){ a.textContent = texto; return; }
      a.innerHTML = escapar(texto.slice(0, i)) + "<mark>" + escapar(texto.slice(i, i + termino.length)) +
                    "</mark>" + escapar(texto.slice(i + termino.length));
    }

    function ficha(id, texto){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", id === famActiva ? "true" : "false");
      b.textContent = texto;
      b.addEventListener("click", function(){
        famActiva = id;
        filtrar();
      });
      barra.appendChild(b);
      fichas.push({id: id, el: b});
    }
    ficha("todo", "Todo el framework");
    FD.FAMILIAS.forEach(function(f){ ficha(f.id, f.t); });

    function filtrar(){
      var termino = plano((campo.value || "").trim());
      /* familia y término se combinan: antes se anulaban en silencio, y
         "Control" + "umbral" era justo lo que un analista pediría. */
      var porFamilia = famActiva !== "todo";
      var visibles = 0;
      grupos.forEach(function(g){
        var deLaFamilia = !porFamilia || g.fam.id === famActiva;
        var enGrupo = 0;
        g.bloques.forEach(function(b){
          var enTitulo = !!termino && plano(b.titulo).indexOf(termino) >= 0;
          var propios = 0;
          b.items.forEach(function(it){
            var on = !termino || enTitulo || plano(it.texto).indexOf(termino) >= 0;
            it.li.classList.toggle("is-hidden", !on);
            resaltar(it.a, it.texto, on && !enTitulo ? termino : "");
            if (on) propios++;
          });
          b.el.classList.toggle("is-hidden", propios === 0);
          enGrupo += propios;
        });
        g.el.classList.toggle("is-hidden", !deLaFamilia || enGrupo === 0);
        if (deLaFamilia) visibles += enGrupo;
      });
      fichas.forEach(function(f){
        var sel = f.id === famActiva;
        f.el.classList.toggle("is-active", sel);
        f.el.setAttribute("aria-selected", sel ? "true" : "false");
      });
      if (termino) marcador.textContent = visibles + " de " + TOTAL +
        (porFamilia ? " · filtrado por familia" : "");
      else if (porFamilia) marcador.textContent = visibles + " entradas en esta familia";
      else marcador.textContent = TOTAL + " entradas";
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
      $("#sol-sale").textContent = x.sale + " · " + x.horas;
      $("#sol-conecta").textContent = x.conecta;
      $("#sol-nota").textContent = x.nota;
      $$("#sol-list .repo-item").forEach(function(b, k){
        var on = k === i;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      var panel = $("#sol-title").closest ? $("#sol-title").closest(".panel") : null;
      if (panel){ panel.classList.remove("fade-in"); void panel.offsetWidth; panel.classList.add("fade-in"); }
    };

    SOL.forEach(function(x, i){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "repo-item" + (i === 0 ? " is-active" : "");
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
      l.push("Entregable esperado: " + x.sale + " · tiempo de gestión estimado: " + x.horas);
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
    function construir(){
      indice = [];
      $$("main section[id]").forEach(function(sec){
        var h2 = sec.querySelector("h2");
        var seccion = h2 ? h2.textContent.trim() : sec.id;
        $$("h2,h3,h4,p,li,figcaption,td,th", sec).forEach(function(el){
          /* solo hojas: si contiene otro indexable, el hijo ya lo cubre */
          if (el.querySelector("p,li,td,th,figcaption")) return;
          var t = el.textContent.replace(/\s+/g," ").trim();
          if (t.length < 14) return;
          var conId = el.closest("[id]");
          var peso = /^H[234]$/.test(el.tagName) ? 0 : 1;
          indice.push({ t:t, p:plano(t), s:seccion, a:(conId && conId.id) ? conId.id : sec.id, w:peso });
        });
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
          html += '<li><a href="#' + h.a + '">' +
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
      var u = location.pathname + (v ? "?q=" + encodeURIComponent(v) : "") + location.hash;
      history.replaceState(null, "", u);
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
      campo.scrollIntoView({ behavior: FD.menosMovimiento() ? "auto" : "smooth", block: "center" });
      campo.focus(); campo.select();
    });

    /* llegar con ?q= ya buscando */
    var q = (location.search.match(/[?&]q=([^&]*)/) || [])[1];
    if (q){ campo.value = decodeURIComponent(q.replace(/\+/g," ")); buscar(); }
  })();
})();
