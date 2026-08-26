/* ============================================================
   Framework Digital · interacciones.js
   Navegación, animaciones y bloques que se pintan desde contenido.js
   ============================================================ */

(function(){
  "use strict";
  var FD = window.FD, $ = FD.$, $$ = FD.$$;
  var fillChips = FD.chips, fillList = FD.lista;

  /* ---------- densidad de las listas escritas a mano ----------
     Se corre una vez al arrancar: las nubes de mas de siete pastillas pasan a
     lista en columnas, igual que las que pinta FD.chips. */
  FD.densificar();

  /* ---------- scroll progress y color del header ----------
     El header nace oscuro sobre el hero y se aclara al entrar al documento:
     una barra negra fija sobre un documento claro pesa de mas. */
  var progress = $("#progress");
  var headerEl = $(".site-header");
  function onScroll(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    if (headerEl) headerEl.classList.toggle("is-claro", h.scrollTop > window.innerHeight - 90);
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

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

  /* ---------- menú compacto ----------
     Debajo de 1080px el nav es un panel: se abre con el botón, se cierra al
     elegir un enlace, con Escape o al tocar fuera del header. */
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

  /* ---------- nav activo ---------- */
  var navLinks = $$("#mainnav a");
  var sections = navLinks.map(function(a){return $(a.getAttribute("href"))}).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length){
    var ion = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          navLinks.forEach(function(a){ a.classList.toggle("is-current", a.getAttribute("href") === "#"+e.target.id); });
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
      art.innerHTML = '<span class="card-index">' + d.tag + '</span><h4>' + d.title +
                      '</h4><p style="margin:12px 0 16px">' + d.desc + '</p><ul class="chips"></ul>';
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
    b.addEventListener("click", function(){ setStep(i); });
    stepper.appendChild(b);
  });
  var current = 0;
  function setStep(i){
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
    $("#flow-rail").style.width = (((i+1)/STEPS.length)*100) + "%";
    var panel = $("#step-panel");
    panel.classList.remove("fade-in"); void panel.offsetWidth; panel.classList.add("fade-in");
    var active = $$(".step")[i];
    if (active && active.scrollIntoView) active.scrollIntoView({behavior:"smooth", block:"nearest", inline:"center"});
  }
  $("#step-next").addEventListener("click", function(){ setStep((current+1) % STEPS.length); });
  setStep(0);

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
    $$(".repo-item").forEach(function(b,idx){ b.classList.toggle("is-active", idx===i); });
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
      b.textContent = texto;
      b.addEventListener("click", function(){
        famActiva = id;
        if (campo.value){ campo.value = ""; }
        filtrar();
      });
      barra.appendChild(b);
      fichas.push({id: id, el: b});
    }
    ficha("todo", "Todo el framework");
    FD.FAMILIAS.forEach(function(f){ ficha(f.id, f.t); });

    function filtrar(){
      var termino = plano((campo.value || "").trim());
      var porFamilia = !termino && famActiva !== "todo";
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
        f.el.classList.toggle("is-active", termino ? f.id === "todo" : f.id === famActiva);
      });
      if (termino) marcador.textContent = visibles + " de " + TOTAL;
      else if (famActiva === "todo") marcador.textContent = TOTAL + " entradas";
      else marcador.textContent = visibles + " entradas";
      vacio.hidden = visibles > 0;
    }
    campo.addEventListener("input", filtrar);
    campo.addEventListener("search", filtrar);
    filtrar();
  }


  /* ---------- recursos: enlaces a lo que ya existe ----------
     Llena cualquier <div class="recursos" data-recursos="clave"></div> con la
     lista que le corresponda de FD.RECURSOS. Un recurso sin href se pinta como
     pendiente y no es enlace: se ve el hueco, que es justo lo que queremos. */
  FD.$$("[data-recursos]").forEach(function(cont){
    var lista = (FD.RECURSOS || {})[cont.getAttribute("data-recursos")];
    if (!lista || !lista.length) return;
    cont.innerHTML = "";
    lista.forEach(function(r){
      var enlazado = !!r.href;
      var el = document.createElement(enlazado ? "a" : "div");
      el.className = "recurso" + (enlazado ? "" : " is-pendiente");
      if (enlazado){
        el.href = r.href;
        /* solo los externos abren pestaña: dentro del repo la navegación es directa */
        if (/^https?:/i.test(r.href)){ el.target = "_blank"; el.rel = "noopener"; }
      }

      var thumb = document.createElement("span");
      thumb.className = "recurso-thumb";
      if (r.img){
        var img = document.createElement("img");
        img.src = r.img; img.alt = ""; img.loading = "lazy";
        thumb.appendChild(img);
      } else {
        thumb.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#' + (r.i || "i-file") + '"></use></svg>';
      }

      var body = document.createElement("span");
      body.className = "recurso-body";
      var kind = document.createElement("span");
      kind.className = "recurso-kind";
      kind.textContent = enlazado ? r.k : r.k + " · por enlazar";
      var t = document.createElement("b"); t.textContent = r.t;
      var d = document.createElement("small"); d.textContent = r.d;
      body.appendChild(kind); body.appendChild(t); body.appendChild(d);

      var go = document.createElement("span");
      go.className = "recurso-go";
      go.setAttribute("aria-hidden", "true");
      go.textContent = enlazado ? "↗" : "···";

      el.appendChild(thumb); el.appendChild(body); el.appendChild(go);
      cont.appendChild(el);
    });
  });

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
      var ok = $("#sol-copy-ok");
      function avisar(){ ok.classList.add("show"); setTimeout(function(){ ok.classList.remove("show"); }, 2400); }
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(texto).then(avisar).catch(avisar);
      } else {
        var ta = document.createElement("textarea");
        ta.value = texto; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch(e){}
        document.body.removeChild(ta); avisar();
      }
    });
  }
})();
