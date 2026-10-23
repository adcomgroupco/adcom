(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const formats = window.CMP_FORMATS || [];
  const media = window.CMP_MEDIA || [];
  const specs = window.CMP_SPECS || {};
  const references = new Map((window.CMP_REFERENCES || []).map(item => [item.id, item]));
  const interfaceIds = new Set(formats.map(item => item.id));
  const grid = $('#format-grid');
  const dialog = $('#format-dialog');
  const lightbox = $('#image-lightbox');
  const search = $('#search');
  const mediumFilter = $('#medium-filter');
  const opportunityFilter = $('#opportunity-filter');
  const pager = $('#format-pager');
  const dataPreviewState = new Map();
  const pageSize = 4;
  let currentPage = 1;
  let lastTrigger = null;
  let returnHash = '#explorar';

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = content;
    return node;
  }
  function image(id, alt) {
    const img = el('img');
    img.src = imageSource(id);
    if (interfaceIds.has(id)) img.classList.add('interface-image');
    img.onerror = () => { img.onerror = null; img.src = `assets/mockups/${id}.svg`; };
    img.alt = alt;
    const portrait = isPortrait(id);
    img.width = portrait ? 780 : 1200;
    img.height = portrait ? 1200 : 780;
    img.loading = 'lazy';
    return img;
  }
  function imageSource(id) {
    return interfaceIds.has(id) ? `assets/interfaces/${id}.webp` : `assets/mockups/${id}.svg`;
  }
  function isPortrait(id) {
    return (/^(meta-|tik-)/.test(id) && id !== 'tik-pulse') || ['goo-shorts','goo-demand','spo-audio','spo-video'].includes(id);
  }
  function mediaLogo(id) {
    const logoFiles = {
      'Meta':['meta'], 'TikTok':['tiktok'], 'Google':['google','youtube'],
      'Spotify':['spotify'], 'Twitch / Kick':['twitch','kick']
    };
    const host = el('span', 'media-logo');
    host.setAttribute('aria-hidden', 'true');
    if (logoFiles[id]) logoFiles[id].forEach(name => {
      const logo = el('img');
      logo.src = `assets/logos/${name}.svg`;
      logo.alt = '';
      logo.width = 25;
      logo.height = 25;
      host.append(logo);
    });
    else host.append(el('span', 'media-logo-type', {'Programática':'DSP','CTV':'TV','DOOH':'OOH'}[id] || id));
    return host;
  }
  function openImage(item) {
    $('#image-lightbox-title').textContent = `${item.medio} · ${item.nombre}`;
    const enlarged = $('#image-lightbox-image');
    enlarged.src = imageSource(item.id);
    enlarged.alt = `Recreación visual ampliada de ${item.nombre} en ${item.medio}`;
    lightbox.showModal();
  }
  function imagePreviewButton(item) {
    const button = el('button', 'format-card-image-button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar imagen de ${item.nombre}`);
    button.append(image(item.id, `Recreación visual de ${item.nombre} en ${item.medio}`), el('span', 'image-zoom-label', 'Ampliar imagen ↗'));
    button.addEventListener('click', () => openImage(item));
    return button;
  }
  function normalize(value) {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  function mediumKey(value) {
    return `medio-${normalize(value).replace(/[^a-z0-9]+/g, '-')}`;
  }
  function validUrl(url) {
    try { return ['https:', 'http:'].includes(new URL(url).protocol); } catch { return false; }
  }
  function link(label, url) {
    const a = el('a', '', label + ' ↗');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  }
  function renderMedia() {
    const host = $('#media-grid');
    media.forEach(item => {
      const button = el('button', 'media-index-item');
      button.type = 'button';
      button.dataset.medium = item.id;
      button.setAttribute('aria-label', `Ver formatos de ${item.id}`);
      const count = formats.filter(format => format.medio === item.id).length;
      button.append(mediaLogo(item.id), el('span', 'media-index-name', item.id), el('span', 'media-index-intro', item.intro), el('span', 'media-index-count', `${count} formatos`), el('span', 'media-index-arrow', '↗'));
      button.addEventListener('click', () => {
        mediumFilter.value = item.id;
        opportunityFilter.value = '';
        search.value = '';
        currentPage = 1;
        renderFormats();
        history.replaceState(null, '', `#${mediumKey(item.id)}`);
        $('#explorar').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      });
      host.append(button);
      mediumFilter.append(new Option(item.id, item.id));
    });
    window.CMP_OPPORTUNITIES.forEach(item => opportunityFilter.append(new Option(item, item)));
  }
  function renderPager(total) {
    const pageCount = Math.ceil(total / pageSize);
    pager.hidden = pageCount < 2;
    pager.replaceChildren();
    if (pageCount < 2) return;
    const previous = el('button', '', '← Anterior');
    const next = el('button', '', 'Siguiente →');
    previous.type = next.type = 'button';
    previous.addEventListener('click', () => changePage(currentPage - 1));
    next.addEventListener('click', () => changePage(currentPage + 1));
    previous.disabled = currentPage === 1;
    next.disabled = currentPage === pageCount;
    pager.append(previous, el('span', 'format-pager-status', `Página ${currentPage} de ${pageCount}`), next);
  }
  function changePage(page) {
    currentPage = page;
    renderFormats();
    const heading = $('.format-section-head h3', grid);
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({preventScroll:true});
      heading.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
  }
  function dataExamples(id) {
    if (id === 'pro-dco') return [
      {label:'Silla', data:{sku:'CASA-042',nombre:'Silla Alba',precio_cop:899000,stock:12,zona:'Bogotá'}, rule:'stock > 0 → mostrar producto y precio', art:['CASA · CATÁLOGO','Silla Alba · $899.000','Descubre el producto'], photo:'living-room', signal:'stock: 12'},
      {label:'Audio', data:{sku:'LUMA-018',nombre:'Auriculares Luma',precio_cop:349000,stock:7,zona:'Bogotá'}, rule:'stock > 0 → llenar la misma plantilla', art:['LUMA · CATÁLOGO','Auriculares · $349.000','Descubre el producto'], photo:'headphones', signal:'stock: 7'},
      {label:'Sin stock', data:{sku:'CASA-042',nombre:'Silla Alba',precio_cop:899000,stock:0,zona:'Bogotá'}, rule:'stock = 0 → mostrar respaldo', art:['CASA · INSPIRACIÓN','Encuentra tu próximo favorito','Explorar colección'], photo:'living-room', signal:'stock: 0'}
    ];
    return [
      {label:'Sol', data:{ciudad:'Bogotá',clima:'soleado',temperatura_c:24,estado:'válido'}, rule:'clima = soleado → variante exterior', art:['CONTEXTO · SOL','Sal a disfrutar el día','Mensaje activado por regla'], photo:'breakfast', signal:'clima: soleado'},
      {label:'Lluvia', data:{ciudad:'Bogotá',clima:'lluvia',temperatura_c:15,estado:'válido'}, rule:'clima = lluvia → variante bajo techo', art:['CONTEXTO · LLUVIA','Un plan para días de lluvia','Mensaje activado por regla'], photo:'rainy-car', signal:'clima: lluvia'},
      {label:'Sin dato', data:{ciudad:'Bogotá',clima:null,temperatura_c:null,estado:'sin dato'}, rule:'dato ausente → mostrar respaldo', art:['SIN DATO VÁLIDO','Encuentra un plan para hoy','Sin afirmar el clima'], photo:'living-room', signal:'clima: sin dato'}
    ];
  }
  function renderDataCard(item) {
    const examples = dataExamples(item.id);
    const preview = el('div', 'format-data-preview');
    const head = el('div', 'format-data-head');
    head.append(el('span', '', 'Prueba el dato'), el('code'));
    const art = el('div', 'format-data-art');
    const controls = el('div', 'format-data-controls');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', `Cambiar datos de ${item.nombre}`);
    const rule = el('p', 'format-data-rule');
    const buttons = examples.map((example, index) => {
      const button = makeButton(example.label, false, () => show(index));
      controls.append(button);
      return button;
    });
    function show(index) {
      const example = examples[index];
      dataPreviewState.set(item.id, index);
      $('code', head).textContent = example.signal;
      art.style.backgroundImage = `linear-gradient(90deg, #000b, #0002), url("assets/photos/${example.photo}.jpg")`;
      art.replaceChildren(...example.art.map((word, position) => el(position === 1 ? 'strong' : 'span', '', word)));
      rule.textContent = example.rule;
      buttons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(index === buttonIndex)));
    }
    preview.append(head, art, controls, rule);
    show(dataPreviewState.get(item.id) || 0);
    return preview;
  }
  function renderFormats() {
    const q = normalize(search.value.trim());
    const medium = mediumFilter.value;
    const opportunity = opportunityFilter.value;
    const visible = formats.filter(item => {
      if (medium && item.medio !== medium) return false;
      if (opportunity && item.oportunidad !== opportunity) return false;
      return !q || normalize([item.medio,item.familia,item.nombre,item.promesa,item.oportunidad,item.accion,...item.rutas,window.CMP_ALIASES?.[item.id] || ''].join(' ')).includes(q);
    });
    const total = visible.length;
    currentPage = Math.min(currentPage, Math.max(1, Math.ceil(total / pageSize)));
    const pageItems = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    grid.replaceChildren();
    const fragment = document.createDocumentFragment();
    media.forEach(group => {
      const matches = pageItems.filter(item => item.medio === group.id);
      if (!matches.length) return;
      const section = el('section', 'format-section');
      section.id = mediumKey(group.id);
      const heading = el('div', 'format-section-head');
      const headingCopy = el('div');
      const groupTotal = visible.filter(item => item.medio === group.id).length;
      headingCopy.append(mediaLogo(group.id), el('p', 'format-section-kicker', `${groupTotal} ${groupTotal === 1 ? 'formato' : 'formatos'}`), el('h3', '', group.id), el('p', '', group.intro));
      heading.append(headingCopy);
      section.append(heading);
      const cards = el('div', 'format-grid');
      matches.forEach(item => {
        const card = el('article', 'format-card');
        if (isPortrait(item.id)) card.classList.add('is-mobile');
        const visual = el('div', 'format-card-visual');
        if (['pro-dco','dooh-data','pro-realtime'].includes(item.id)) { card.classList.add('has-data-preview'); visual.append(renderDataCard(item)); }
        else visual.append(imagePreviewButton(item));
        if (item.id === 'goo-pmax') visual.append(el('p', 'channel-caption', 'Search · YouTube · Discover · Gmail · Maps · Display'));
        card.append(visual);
        const body = el('div', 'format-card-body');
        body.append(el('p', 'format-card-meta', `${item.medio} / ${item.familia}`), el('h3', '', item.nombre), el('p', '', item.promesa));
        const button = el('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Abrir ficha de ${item.nombre} en ${item.medio}`);
        button.append(el('span', '', 'Explorar ficha'), el('span', '', '↗'));
        button.addEventListener('click', () => openDetail(item, button));
        body.append(button);
        card.append(body);
        cards.append(card);
      });
      section.append(cards);
      fragment.append(section);
    });
    grid.append(fragment);
    const first = total ? (currentPage - 1) * pageSize + 1 : 0;
    const last = Math.min(currentPage * pageSize, total);
    $('#result-count').textContent = total ? `Mostrando ${first}–${last} de ${total} ${total === 1 ? 'formato' : 'formatos'}` : '0 formatos para explorar';
    $('#empty-state').hidden = total > 0;
    $('#clear-filters').hidden = !(q || opportunity || (medium && medium !== media[0].id));
    document.querySelectorAll('.media-index-item').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.medium === medium)));
    renderPager(total);
  }
  function fillList(selector, values) {
    const list = $(selector);
    list.replaceChildren(...values.map(value => el('li', '', value)));
  }
  function openDetail(item, trigger = null) {
    lastTrigger = trigger || document.activeElement;
    returnHash = `#${mediumKey(item.medio)}`;
    dialog.dataset.format = item.id;
    const ref = references.get(item.ref);
    const dataFirst = ['pro-dco','dooh-data','pro-realtime'].includes(item.id);
    const visual = $('.detail-visual');
    const demo = $('#demo-region');
    if (dataFirst) visual.before(demo);
    else visual.after(demo);
    $('#detail-breadcrumb').textContent = `${item.medio} / ${item.familia}`;
    $('#detail-type').textContent = `${item.oportunidad} · ${item.activacion}`;
    $('#detail-title').textContent = item.nombre;
    $('#detail-promise').textContent = item.promesa;
    $('#detail-observation').textContent = `Qué mirar: ${window.CMP_OBSERVATIONS[item.id] || item.promesa}`;
    const spec = specs[item.id];
    $('#detail-size').textContent = spec?.size || 'Definir con el proveedor';
    $('#detail-ratio').textContent = spec?.ratio || 'Variable';
    $('#detail-spec-note').textContent = `${spec?.detail || 'Solicita especificaciones del inventario.'} Son medidas iniciales; confirma las especificaciones de la ubicación contratada.`;
    $('#detail-action').textContent = item.accion;
    fillList('#detail-routes', item.rutas);
    fillList('#detail-tips', item.tips);
    $('#detail-image').src = imageSource(item.id);
    $('#detail-image').onerror = () => { $('#detail-image').onerror = null; $('#detail-image').src = `assets/mockups/${item.id}.svg`; };
    $('#detail-image').alt = `Recreación visual de ${item.nombre} en ${item.medio}`;
    const portrait = isPortrait(item.id);
    $('#detail-image').width = portrait ? 780 : 1200;
    $('#detail-image').height = portrait ? 1200 : 780;
    $('.detail-visual').classList.toggle('is-mobile', portrait);
    $('.detail-visual').classList.toggle('has-interface', interfaceIds.has(item.id));
    $('#detail-status').textContent = item.activacion === 'Habitual'
      ? 'Habitual: confirma especificaciones y disponibilidad actuales.'
      : item.activacion === 'Especializada'
        ? 'Especializada: requiere configuración, proveedor, inventario o desarrollo.'
        : 'Por validar: confirma producto, mercado e inventario antes de ofrecerlo.';
    $('#detail-note').textContent = ref ? `Referencia complementaria: ${ref.titulo}. ${ref.nota || ''} La imagen recrea la interfaz o el contexto del formato con marca y ejecución ficticias; no es una captura de esa referencia.` : 'La imagen recrea una ejecución ficticia.';
    $('#detail-review').textContent = `Referencia ${item.ref} · Revisión editorial: ${ref?.fecha_revision || '2026-10-22'}`;
    const links = $('#detail-links');
    links.replaceChildren();
    if (ref && validUrl(ref.url_fuente)) links.append(link('Ver referencia original', ref.url_fuente));
    const official = officialSource(item);
    if (official && validUrl(official) && official !== ref?.url_fuente) links.append(link('Consultar guía oficial', official));
    renderDemo(item);
    $('#dialog-scroll').scrollTop = 0;
    dialog.showModal();
    history.replaceState(null, '', `#${item.id}`);
  }
  function officialSource(item) {
    const sources = {
      'meta-reels':'https://www.facebook.com/business/ads/facebook-instagram-reels-ads',
      'tik-spark':'https://ads.tiktok.com/resources/help/article/spark-ads?lang=es-419',
      'tik-addons':'https://ads.tiktok.com/resources/help/article/about-interactive-add-ons?lang=es',
      'tik-votacion':'https://ads.tiktok.com/resources/help/article/about-interactive-add-ons?lang=es',
      'tik-countdown':'https://ads.tiktok.com/resources/help/article/about-interactive-add-ons?lang=es',
      'tik-topview':'https://ads.tiktok.com/resources/help/article/tiktok-reservation-topview?lang=en',
      'tik-pulse':'https://ads.tiktok.com/resources/help/article/tiktok-pulse?lang=en',
      'tik-topfeed':'https://ads.tiktok.com/resources/help/article/tiktok-reservation-in-feed-ads-reach-frequency?lang=en',
      'goo-search':'https://support.google.com/google-ads/answer/7684791',
      'goo-masthead':'https://support.google.com/google-ads/answer/17091270?hl=en',
      'goo-demand':'https://support.google.com/google-ads/answer/13704860',
      'goo-pmax':'https://support.google.com/google-ads/answer/17091269',
      'spo-audio':'https://ads.spotify.com/en-US/ad-specs/audio-ad-specs/',
      'spo-video':'https://ads.spotify.com/en-US/ad-specs/in-feed-video-ad-specs/',
      'spo-display':'https://ads.spotify.com/en-US/ad-formats/display-ads/',
      'pro-display':'https://iabtechlab.com/standards/iab-new-ad-portfolio-guidelines/',
      'pro-rich':'https://iabtechlab.com/standards/html-5/',
      'ctv-pause':'https://advertising.amazon.com/es-co/resources/ad-specs/prime-video/pause-ad',
      'live-sponsor':'https://help.kick.com/en/articles/15063647-understanding-kick-s-community-guidelines',
      'live-break':'https://help.twitch.tv/s/article/ads-manager',
      'dooh-data':'https://www.jcdecauxlatam.com/pdooh'
    };
    return sources[item.id] || null;
  }
  function makeButton(label, pressed, handler) {
    const button = el('button', '', label);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(pressed));
    button.addEventListener('click', handler);
    return button;
  }
  function renderDemo(item) {
    const host = $('#demo-region');
    host.replaceChildren();
    if (/^(meta-|tik-)/.test(item.id) || item.id === 'goo-shorts') {
      const section = el('section', 'demo');
      section.append(el('h3', '', 'Zonas seguras · guía visual'));
      const controls = el('div', 'demo-controls');
      const stage = el('div', 'safe-stage');
      const photo = {
        'meta-reels':'plants','meta-stories':'travel','meta-carrusel':'sneakers',
        'meta-collection':'perfume','meta-instant':'living-room','meta-mensajes':'living-room',
        'tik-infeed':'coffee','tik-spark':'sneakers','tik-addons':'skincare',
        'tik-votacion':'perfume','tik-countdown':'breakfast','tik-topview':'travel',
        'tik-pulse':'breakfast','tik-topfeed':'sneakers','goo-shorts':'plants'
      }[item.id];
      stage.style.backgroundImage = `linear-gradient(180deg, #0003, transparent 40%, #000a), url("assets/photos/${photo}.jpg")`;
      stage.style.aspectRatio = item.id === 'meta-carrusel' ? '1 / 1' : ['meta-collection','meta-mensajes'].includes(item.id) ? '4 / 5' : '9 / 16';
      stage.append(el('div', 'stage-copy', 'Una idea que se ve'));
      const mask = el('div', 'safe-mask');
      mask.setAttribute('aria-label', 'Guía orientativa de espacio visible e interfaz');
      const bounds = {
        'meta-reels':['14%','35%','6%'], 'meta-stories':['14%','23%','6%'],
        'meta-carrusel':['8%','18%','8%'], 'meta-collection':['10%','22%','8%'],
        'meta-instant':['10%','15%','7%'], 'meta-mensajes':['8%','19%','8%'],
        'tik-infeed':['12%','32%','8%'], 'tik-spark':['12%','34%','8%'],
        'tik-addons':['12%','42%','8%'], 'tik-votacion':['12%','45%','8%'],
        'tik-countdown':['12%','40%','8%'], 'tik-topview':['18%','29%','8%'],
        'tik-pulse':['12%','34%','8%'], 'tik-topfeed':['12%','34%','8%'],
        'goo-shorts':['12%','30%','8%']
      }[item.id];
      mask.style.setProperty('--top', bounds[0]);
      mask.style.setProperty('--bottom', bounds[1]);
      mask.style.setProperty('--side', bounds[2]);
      mask.append(el('div', 'safe-top'), el('div', 'safe-bottom'), el('div', 'safe-left'), el('div', 'safe-right'), el('div', 'safe-center'));
      stage.append(mask);
      const toggle = makeButton('Ocultar guía', true, () => {
        mask.hidden = !mask.hidden;
        toggle.textContent = mask.hidden ? 'Mostrar guía' : 'Ocultar guía';
        toggle.setAttribute('aria-pressed', String(!mask.hidden));
      });
      controls.append(toggle);
      section.append(controls, stage, el('p', '', 'Área amarilla: zona sugerida para texto, logo y producto clave. Franjas naranjas: espacio que puede cubrir la interfaz. Las posiciones son orientativas y cambian según placement, texto y componentes; verifica la plantilla y el preview oficiales.'));
      host.append(section);
      if (item.id === 'meta-carrusel') {
        const carousel = el('section', 'demo'); carousel.append(el('h3', '', 'Demo · cada tarjeta agrega algo'));
        const frame = el('div', 'carousel-stage'); const slide = el('div', 'carousel-slide');
        const labels = ['01 · El problema','02 · La solución','03 · El resultado']; let current = 0;
        const prev = el('button', '', '‹'); const next = el('button', '', '›');
        prev.type = next.type = 'button'; prev.setAttribute('aria-label','Tarjeta anterior'); next.setAttribute('aria-label','Tarjeta siguiente');
        function update(){slide.textContent = labels[current]; slide.style.backgroundImage = `linear-gradient(180deg, #0002, #000a), url("assets/photos/${['sneakers','living-room','travel'][current]}.jpg")`; prev.disabled = current === 0; next.disabled = current === labels.length-1;}
        prev.addEventListener('click',()=>{current--;update();}); next.addEventListener('click',()=>{current++;update();});
        frame.append(prev,slide,next); carousel.append(frame,el('p','','Secuencia simulada: cada tarjeta cambia el argumento, no solo el color.')); host.append(carousel); update();
      }
    } else if (item.id === 'pro-display') {
      const section = el('section', 'demo'); section.append(el('h3', '', 'Demo · menos texto, más claridad'));
      const controls = el('div', 'demo-controls'); const stage = el('div', 'banner-stage');
      function setBusy(busy) {
        stage.classList.toggle('busy', busy);
        stage.style.backgroundImage = `linear-gradient(180deg, #0009, #0005), url("assets/photos/${busy ? 'rainy-car' : 'headphones'}.jpg")`;
        stage.replaceChildren(el('small', '', busy ? 'LANZAMIENTO · GRAN OFERTA · DESCUBRE TODO' : 'NUEVA COLECCIÓN'),
          el('strong', '', busy ? 'Muchos mensajes compiten en un espacio muy pequeño' : 'Una idea. Un beneficio.'),
          el('em', '', busy ? 'Más detalles, más beneficios y más mensajes' : 'Explorar'));
        before.setAttribute('aria-pressed', String(busy)); after.setAttribute('aria-pressed', String(!busy));
      }
      const before = makeButton('Sobrecargado', false, () => setBusy(true));
      const after = makeButton('Optimizado', true, () => setBusy(false));
      controls.append(before,after); section.append(controls,stage,el('p','','Simulación interna a escala aproximada de banner 300 × 250. Comprueba legibilidad al tamaño final.'));
      host.append(section); setBusy(false);
    } else if (['pro-dco','pro-realtime','dooh-data'].includes(item.id)) {
      const isDco = item.id === 'pro-dco';
      const examples = dataExamples(item.id);
      const section = el('section', 'demo data-demo');
      section.append(el('h3', '', isDco ? 'Del catálogo a la pieza' : 'El dato cambia la pieza'));
      const controls = el('div', 'demo-controls');
      const layout = el('div', 'data-example');
      const input = el('div', 'data-example-input');
      input.append(el('p', 'data-label', '01 · Dato recibido'));
      const code = el('pre'); input.append(code);
      const rule = el('div', 'data-example-rule');
      rule.append(el('p', 'data-label', '02 · Regla aplicada'));
      const ruleText = el('strong'); rule.append(ruleText);
      const output = el('div', 'data-example-output');
      output.append(el('p', 'data-label', '03 · Pieza resultante'));
      const stage = el('div', 'dco-stage'); output.append(stage);
      layout.append(input,rule,output);
      const buttons = examples.map((example, index) => {
        const button = makeButton(example.label, index === 0, () => show(index));
        controls.append(button);
        return button;
      });
      function show(index) {
        const example = examples[index];
        dataPreviewState.set(item.id, index);
        code.textContent = JSON.stringify(example.data, null, 2);
        ruleText.textContent = example.rule;
        stage.style.backgroundImage = `linear-gradient(90deg, #000b, #0002), url("assets/photos/${example.photo}.jpg")`;
        stage.replaceChildren(...example.art.map((word, position) => el(position === 1 ? 'strong' : 'span', '', word)));
        buttons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(index === buttonIndex)));
      }
      section.append(controls,layout,el('p','','Datos y precios ficticios. La demo no consulta una fuente real; para producción define permiso, actualización, validación y respaldo.'));
      host.append(section); show(dataPreviewState.get(item.id) || 0);
    }
  }
  function closeDialog() { dialog.close(); }
  $('#close-dialog').addEventListener('click', closeDialog);
  $('#detail-image-button').addEventListener('click', () => {
    const item = formats.find(format => format.id === dialog.dataset.format);
    if (item) openImage(item);
  });
  $('#close-image-lightbox').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('close', () => {
    if (location.hash.slice(1) === dialog.dataset.format) history.replaceState(null, '', returnHash);
    lastTrigger?.focus?.();
  });
  search.addEventListener('input', () => { if (search.value.trim()) mediumFilter.value = ''; currentPage = 1; renderFormats(); });
  [mediumFilter, opportunityFilter].forEach(control => control.addEventListener('change', () => { currentPage = 1; renderFormats(); }));
  $('#clear-filters').addEventListener('click', () => { search.value=''; mediumFilter.value=media[0].id; opportunityFilter.value=''; currentPage = 1; renderFormats(); search.focus(); });
  renderMedia();
  const initialMedium = media.find(item => mediumKey(item.id) === location.hash.slice(1));
  mediumFilter.value = initialMedium?.id || media[0].id;
  renderFormats();
  $('#hero-count').textContent = `01 / ${formats.length}`;
  const initial = formats.find(item => item.id === location.hash.slice(1));
  if (initial) openDetail(initial);
  else if (initialMedium) $('#explorar').scrollIntoView();
})();
