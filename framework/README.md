# Framework Área Digital · v0.3

Landing interna del framework de trabajo del área digital de Adcom.
Es un sitio estático: **se abre haciendo doble clic en `index.html`**, sin servidor, sin build, sin dependencias.

Vive dentro del repo [`adcomgroupco/adcom`](https://github.com/adcomgroupco/adcom) y se llega a él
desde el portal de la raíz (`../index.html`).

---

## Estructura

```
framework/
├── index.html                    ← todo el contenido visible (markup + diagramas SVG)
├── assets/
│   ├── css/
│   │   ├── 01-tokens.css         colores, tipografía, reset, animaciones
│   │   ├── 02-layout.css         header, navegación y hero
│   │   ├── 03-componentes.css    cards, paneles, tablas, herramientas, cierre
│   │   │                         y, al final, las utilidades de separación
│   │   ├── 04-diagramas.css      diagramas de flujo en SVG
│   │   ├── 05-responsive.css     breakpoints globales
│   │   └── 06-impresion.css      cómo sale en papel o PDF (media="print")
│   └── js/
│       ├── base.js               utilidades compartidas ($, $$, chips, lista)
│       ├── contenido.js          TEXTOS de las partes interactivas, el índice, el tablero
│       │                         de cuentas y los requisitos de solicitud
│       ├── interacciones.js      navegación, animaciones y bloques que se pintan solos
│       └── herramientas.js       calculadora, árbol, constructor, combinador y tablero
├── assets/img/                    capturas (ver assets/img/LEEME.txt)
├── _archivo/                     versiones sustituidas y fuente histórica (regla 10)
│   ├── framework-area-digital-v03.html           versión anterior de la página
│   └── framework-area-digital-v03-detallado.md   texto original, puntos 1—85
└── README.md                     este archivo
```

> **Ojo con el `.md` de `_archivo/`.** Era el documento fuente, pero `index.html` ya lo superó: la página
> incluye los puntos 86—99 (optimización de pauta, distribución de cuentas, solicitudes y
> automatización) que el `.md` no tiene, y omite los puntos 42, 43 y 82 que el `.md` sí trae.
> Hoy la fuente de verdad es `index.html`. El `.md` se conserva como referencia histórica; si
> alguien lo edita esperando que se refleje en la página, no va a pasar nada.

`06-impresion.css` se carga con `media="print"`, así que no afecta la pantalla. Si agregas una
sección nueva y quieres verla impresa, no hay que tocar nada: solo revisa que no use una
herramienta interactiva, porque esas se ocultan en papel.

Los archivos CSS están numerados porque **el orden importa**: se cargan en secuencia y así se
resuelve la cascada. Si agregas uno, ponlo en la posición que le corresponda y enlázalo en el
`<head>` de `index.html` en ese mismo orden.

---

---

## Las tres superficies

El documento es claro. El negro es puntuación, no fondo: se reserva para el hero, tres
momentos de énfasis (`control`, `ia`, `futuro`) y el cierre. Todo lo demás alterna papel y
blanco, que es lo que da ritmo sin cambiar el peso de la página.

| Clase | Fondo | Tarjetas | Cuándo |
|---|---|---|---|
| `section-light` | papel | blancas | el paso por defecto |
| `section-plain` | blanco | papel | el paso alterno, para que dos secciones seguidas no se fundan |
| `section-dark` | tinta | tinta | solo énfasis: úsalo y ya llevas cinco en todo el documento |

**Voltear una sección es cambiarle la clase, nada más.** Cada superficie redeclara los mismos
tokens (`--surface`, `--fg`, `--line`, `--chip-bg`, `--eyebrow-fg`…), así que ningún componente
de adentro necesita saber dónde está. Si un componente nuevo se ve mal al voltear la sección,
el error es que tiene un color fijo: cámbialo por el token y se arregla en las tres.

Las clases `card-light` y `panel-light` solo hacen algo dentro de una sección oscura, donde
significan «isla clara». En una sección clara son un no-op.

## Una sección, un capítulo

**La regla que mantiene el documento legible.** Antes había hasta seis capítulos metidos en un
solo bloque de scroll y por eso se sentía denso: no sobraba información, sobraba jerarquía
plana. Hoy cada capítulo con su propio `<h2>` es un `<section>`.

Al agregar un capítulo, agrégalo como sección, no como `<div class="divider">` dentro de otra:

```html
<section class="section-plain" id="mi-capitulo" aria-labelledby="mi-capitulo-title">
  <div class="wrap">
    <div class="section-heading" data-reveal>
      <div>
        <p class="eyebrow"><span>NN</span></p>
        <h2 id="mi-capitulo-title">Título del capítulo</h2>
        <p class="claim">La frase que lo resume <em>en una línea.</em></p>
      </div>
      <p>El párrafo que acompaña al título.</p>
    </div>
    …
  </div>
</section>
```

Alterna `section-light` / `section-plain` respecto a la vecina. `divider` se sigue usando, pero
solo para separar bloques *dentro* de un capítulo.

Si una sección pasa de ~450 palabras, probablemente son dos capítulos.

## Los componentes de composición

| Componente | Para qué | Regla |
|---|---|---|
| `.bento` | rejilla de seis columnas con celdas de peso distinto | combina `b-2` (tercio), `b-3` (mitad), `b-4` (dos tercios), `b-6` (ancho completo); `b-tall` ocupa dos filas |
| `.stats` + `.stat` | cifras que se leen de lejos | el número manda, la etiqueta explica; `stat-accent` para una sola |
| `.numbers` + `.num` | secuencias de 3 a 5 pasos | el número es lo que comunica que hay un orden |
| `.card-accent` / `.card-ink` | destacar una celda | **una por rejilla**: si hay dos, ya no destaca ninguna |
| `.visual` | respiro visual donde no hay nada que capturar | variantes `visual-b` y `visual-c` para que no se repita la misma mancha |
| `.showcase` + `.pin` | captura real con etiquetas encima | sin la etiqueta, la captura es decoración |
| `.iconrow` + `.iconcell` | cuatro o cinco conceptos que se enumeran | si cada uno necesita un párrafo, va un bento |
| `.steps-h` | secuencia conectada por una línea | el diagrama más barato que existe; `.es-clave` marca el paso que pesa |
| `.display` | una frase a tamaño de portada | nunca dos seguidas, nunca más de doce palabras |
| `.marca` | celda del bento sin texto: un signo o un icono grande | ancla la rejilla cuando todo lo demás es texto |
| `.stat-badge` | distintivo en la esquina de una cifra | marca cuál de las cifras es la que importa |

## Que no todas las secciones abran igual

Cuarenta secciones con la misma apertura se leen como una sola. Por eso el encabezado tiene
tres variantes además de la normal, y **dos secciones seguidas nunca comparten forma**:

| Clase | Dónde va | Cuándo |
|---|---|---|
| *(ninguna)* | en el `<div class="section-heading">` | título a la izquierda, párrafo a la derecha |
| `es-apilado` | en el `section-heading` | la sección trae algo ancho (tabla, diagrama, bento) y el encabezado se aparta |
| `es-centro` | en el `section-heading` | sección corta que funciona como bisagra entre dos bloques densos |
| `wrap-titulo-abajo` | en el `<div class="wrap">` | el contenido se entiende sin que se lo anuncien: el título cierra en vez de abrir |

Si vas a agregar una sección, mira qué forma tienen la anterior y la siguiente y usa otra.

## Iconos

Treinta y cinco iconos en el sprite del `<head>`, todos sobre la misma retícula de 24 y con el
mismo trazo. **Cada sección lleva el suyo en el eyebrow**, que es lo que los hace leerse como
sistema y no como decoración suelta.

```html
<svg class="ico ico-sm" aria-hidden="true"><use href="#i-shield"/></svg>
```

- El color y el grosor **se heredan**: nunca le pongas `fill`, `stroke` ni `stroke-width` a un
  `<symbol>`. Si un icono necesita su propio grosor, está mal dibujado, no mal configurado.
- La escala son cuatro pasos: `ico-sm` (18), base (24), `ico-lg` (32), `ico-xl` (44). No
  inventes tamaños intermedios con `style=`.
- Al dibujar uno nuevo: `viewBox="0 0 24 24"`, solo trazo, sin relleno, y que el peso visual se
  parezca al de los que ya están. Ponlo en el sprite del `<head>`, junto a los demás.
- Que un icono se repita entre secciones está bien si los temas están emparentados
  (`i-route` en flujo, ruta y árbol). Que se repita por descuido, no.

## Recursos: el puente con lo que ya existe

Cada punto que tiene un archivo real detrás (un repo, una plantilla, un presupuesto, un
tablero) se enlaza desde `FD.RECURSOS`, en `contenido.js`. Es lo que evita que el framework se
lea como teoría.

En el HTML basta con dejar el contenedor vacío; la lista lo llena sola:

```html
<div class="recursos" data-recursos="sistema"></div>
```

```js
{k:"Repositorio", t:"Estructura maestra de cuenta",
 d:"Las once carpetas, listas para duplicar por cliente",
 href:"", i:"i-file", img:""}
```

- **`href` vacío significa pendiente**, y se pinta como tal: marco punteado y la etiqueta
  «por enlazar». Esa es la gracia. Un recurso que no existe todavía tiene que verse, no
  desaparecer: si desaparece, nadie se acuerda de conectarlo.
- **Llenar un pendiente es pegar el enlace en `href`.** Nada más: ni HTML ni CSS.
- `i` es un ícono del sprite del `<head>` (`i-file`, `i-list`, `i-code`, `i-shield`…).
- `img` es opcional y reemplaza al ícono por una miniatura.

## Imágenes

Van en `assets/img/`, en `kebab-case` y con nombre que diga qué son. Máximo 1600px de ancho y
sin datos de cliente visibles.

Los huecos de captura (`.showcase.is-pendiente`) siguen el mismo criterio que los recursos
pendientes: declaran qué imagen falta en vez de dejar la sección sin apoyo visual. Cuando
llegue la captura, se le mete el `<img>` y se le quita la clase `is-pendiente`:

```html
<figure class="showcase sep-lg" data-reveal>
  <img src="assets/img/nomenclatura-tabla.png" alt="Describe qué muestra la captura.">
  <span class="pin pin-accent pin-tl">Lo que hay que mirar</span>
  <figcaption>Qué es y de dónde salió.</figcaption>
</figure>
```

---

## Dónde cambiar qué

| Quiero cambiar… | Voy a… |
|---|---|
| Un color, la tipografía, los radios | `assets/css/01-tokens.css`, bloque `:root` |
| Los textos de pilares, variables, etapas, ciclo, localización, árbol o repositorio | `assets/js/contenido.js` |
| Una entrada del índice | `assets/js/contenido.js`, bloque `FD.INDICE` |
| Las personas o las cuentas del tablero | `assets/js/contenido.js`, bloque `FD.CUENTAS` |
| Lo que se pide para aceptar una solicitud | `assets/js/contenido.js`, bloque `FD.SOLICITUDES` |
| Cualquier otro texto de la página | `index.html`, en la sección correspondiente |
| Un enlace a un archivo real (repo, plantilla, presupuesto) | `assets/js/contenido.js`, bloque `FD.RECURSOS` |
| El fondo de una sección | la clase del `<section>`: `section-light`, `section-plain` o `section-dark` |
| Una captura | `assets/img/`, y la ruta en el `<img>` o en el campo `img` del recurso |
| Un diagrama de flujo | `index.html`, dentro del `<figure class="flow">` |
| El aspecto de los diagramas | `assets/css/04-diagramas.css` |
| Cómo se comporta la calculadora o el constructor | `assets/js/herramientas.js` |
| Lo que dice el capítulo de automatización e IA | `index.html`, sección `#ia` |
| Agregar un enlace al menú | `index.html`, dentro de `<nav id="mainnav">` |

**Regla práctica:** si es texto que aparece dentro de un panel que cambia al hacer clic, está en
`contenido.js`. Si es texto fijo, está en `index.html`.

---

## Separación entre bloques: usa las utilidades, no `style=`

Al final de `03-componentes.css` hay cinco pasos de separación y dos utilidades más. Se escriben
como clase, no como estilo inline:

```html
<ul class="list-check sep">…</ul>
<div class="grid-2 sep-md" data-reveal>…</div>
<div class="divider divider-light" id="algo">…</div>
```

| Clase | Qué hace | Cuándo |
|---|---|---|
| `sep-xs` | `margin-top:8px` | separar una línea de la anterior |
| `sep-sm` | `margin-top:12px` | un párrafo dentro de una tarjeta |
| `sep` | `margin-top:14px` | una lista dentro de una tarjeta |
| `sep-md` | `margin-top:16px` | una rejilla después de otro bloque |
| `sep-lg` | `margin-top:20px` | separar dos bloques distintos |
| `sin-margen` | `margin:0` | quitarle el margen propio a un elemento |
| `divider-light` | borde claro | `divider` sobre una sección clara |
| `quote-sm` | cita más pequeña | `quote` dentro de una tarjeta |

Los selectores están duplicados en el CSS (`.sep.sep`) a propósito: así ganan sobre reglas de
componente como `.card p{margin:0}` sin necesidad de `!important`.

**Son cinco pasos, no diez.** Si necesitas un valor intermedio, casi siempre el espacio le
corresponde al componente y la regla va en `03-componentes.css`, no en el HTML. Los estilos inline
que quedan son los que de verdad son únicos de un solo lugar: colores puntuales, anchos de columna
y ajustes de un diagrama.

---

## Cómo agregar una sección

1. Copia el bloque de una sección existente en `index.html` (desde `<section` hasta `</section>`).
2. Cámbiale el `id`, el `aria-labelledby` y alterna `section-light` / `section-plain`
   respecto a la sección vecina. `section-dark` solo si de verdad es un momento de énfasis:
   ver <b>Las tres superficies</b>.
3. Agrega el enlace en `<nav id="mainnav">`. El resaltado activo del menú es automático: el JS
   observa cualquier sección que esté enlazada desde ahí.
4. Marca con `data-reveal` los bloques que deban aparecer al hacer scroll.

## Cómo agregar un diagrama

Los diagramas son SVG escritos a mano, sin librerías. La plantilla mínima:

```html
<figure class="flow" data-reveal>
  <svg viewBox="0 0 1160 320" role="img" aria-label="Describe el flujo completo en una frase.">
    <defs>
      <marker id="fa-XX" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="mk-a" d="M0 0 L10 5 L0 10 z" fill="currentColor" fill-opacity=".5"/>
      </marker>
    </defs>
    <rect class="fl-box" x="20" y="60" width="200" height="58" rx="10"/>
    <text class="fl-t" x="120" y="95" text-anchor="middle">Paso</text>
    <path class="fl-line" d="M220 89 H260" marker-end="url(#fa-XX)"/>
  </svg>
  <figcaption><b>NN.</b> La regla que el dibujo no alcanza a decir.</figcaption>
</figure>
```

Clases disponibles: `fl-box` (caja), `fl-box-key` (caja destacada), `fl-box-out` (salida alterna,
punteada), `fl-dec` (rombo de decisión), `fl-band` (contenedor), `fl-line` / `fl-line-yes` /
`fl-line-no` / `fl-line-loop` (conexiones), `fl-t` / `fl-t-b` / `fl-t-sm` / `fl-t-key` / `fl-t-code`
(textos), `fl-edge` / `fl-edge-yes` / `fl-edge-no` (etiquetas de flecha).

Tres cosas que hay que respetar:

- **El `id` del marcador debe ser único en toda la página.** Por eso llevan sufijo (`fa-87a`, `fa-89`).
- **No pongas etiquetas en flechas cortas:** por debajo de ~60px de separación el texto pisa las cajas.
  Etiqueta solo lo que informa (Sí, No, condiciones), no los pasos obvios.
- **El `aria-label` describe el flujo completo**, porque es lo único que lee quien no ve el dibujo.

---

## Cómo se usa el índice

La sección `#indice` se arma sola desde `FD.INDICE`. Cada bloque es una sección y cada item una
entrada consultable; `a` es el ancla de destino y tiene que existir como `id` en `index.html`.

```js
{a:"sistema", n:"58—81", t:"Sistema documental", items:[
  {a:"nomenclatura", t:"71—77 · Nomenclatura y constructor de nombres"}
]}
```

El buscador filtra por texto de la entrada, ignora tildes y resalta la coincidencia. Si agregas una
subsección al documento, ponle un `id` al `<div class="divider">` o al `<h3>` y súmala aquí: es el
único lugar donde hay que registrarla.

Hay un botón flotante de vuelta al índice que aparece al pasar la primera pantalla.

## Cómo se usa el tablero de cuentas

`FD.CUENTAS` tiene tres partes: `total_declarado` (la cifra que traía el tablero original), `equipo`
(las personas, en el orden en que se pintan las columnas) y `cuentas` (cada ficha con su número de
campañas `c` y su responsable `r`, que debe coincidir con un `id` de `equipo`).

- Se mueve arrastrando la ficha, o tocándola y luego tocando la columna que la recibe.
- El reparto que arme cada persona se guarda en su propio navegador (`localStorage`). **No se
  comparte:** para cambiar el reparto oficial hay que editar `FD.CUENTAS`. El botón *Restablecer
  reparto* vuelve a lo que dice el archivo.
- Los totales y la barra de carga se recalculan solos. Una cuenta sin conteo de campañas se escribe
  `c:null` y aparece con un guion.

## Cómo se usan los requisitos de solicitud

`FD.SOLICITUDES` es la puerta de entrada del área: un objeto por tipo de solicitud.

```js
{c:"94.4", t:"Informe", sale:"Informe con acciones derivadas", horas:"2 horas",
 pregunta:"¿Qué decisión va a soportar este informe?",
 min:["Objetivo del informe: qué decisión debe habilitar", "…"],   // sin esto se devuelve
 des:["Preguntas concretas que se esperan responder", "…"],        // suma, no bloquea
 conecta:"81·06 · Todo informe genera acciones",
 nota:"Un informe sin decisión asociada…"}
```

- **`min` es la lista que bloquea.** Antes de agregar algo ahí, pregúntate si de verdad impide
  empezar. Todo lo que ayuda pero no impide va en `des`; si `min` crece sin control, la puerta deja
  de usarse y la gente vuelve a pedir por chat.
- **`horas` y `sale` deben coincidir con la tabla del punto 86.** Si cambias uno, cambia el otro.
- El botón *Copiar plantilla* arma el texto desde estos mismos campos, así que no hay una plantilla
  aparte que se pueda desactualizar.

## Fichas o lista, según el largo

Las listas de etiquetas (`ul.chips`) tienen dos formas y la regla es el número de items:

- **Hasta 7 items:** fichas redondeadas. Funcionan como etiquetas y se leen de un vistazo.
- **De 8 en adelante:** se agrega la clase `chips-densa` y se vuelven una lista en columnas con
  viñeta. Una nube de trece fichas no se lee: se mira. En columnas sí se recorre.

En las listas que pinta el JS esto es automático (`FD.chips` pone la clase sola). En las que están
escritas en el HTML hay que poner `chips-densa` a mano si la lista pasa de siete.

## Tarjetas alineadas

Las rejillas de tarjetas (`.toc`, `.board`, `.grid-2`, `.grid-3`) **no llevan `align-items:start`**:
todas las tarjetas de una fila miden lo mismo y la rejilla se ve regular. Si una tarjeta queda con
espacio sobrante, es preferible ese espacio a un borde inferior irregular.

Los pilares reservan dos líneas para el título y dos para la bajada (`.pillar strong` y
`.pillar small` tienen `min-height`), así los cinco textos arrancan a la misma altura aunque un
título ocupe una sola línea.

## Bloques plegables

Para que el documento se pueda leer de corrido, los inventarios largos (tablas de referencia, listas
de quince puntos) van dentro de un plegable:

```html
<details class="mas" data-reveal>
  <summary>Ver los diez niveles de carpeta</summary>
  <div class="mas-body"> … la tabla o la lista … </div>
</details>
```

El resumen debe decir qué hay adentro y cuánto: *"Ver los quince resultados"* sirve, *"Ver más"* no.
Si el contenido lleva `data-reveal`, quítaselo al interior y déjalo en el `<details>`.

## Decisiones técnicas

**Por qué el contenido está en `.js` y no en `.json`.** Un `fetch()` de JSON desde `file://` lo
bloquea el navegador. Como el requisito es que el archivo se pueda abrir con doble clic y enviarse
por correo o Drive, los datos se declaran como objetos sobre `window.FD`. Si algún día esto se
publica en un servidor, migrar a JSON es directo.

**Por qué no hay build ni framework.** El documento tiene que poder editarlo cualquiera del equipo
con un editor de texto y ver el resultado al instante. Cualquier paso de compilación rompe eso.

**Por qué los scripts van al final del `<body>`.** Se ejecutan en orden y con el DOM ya construido:
`base.js` → `contenido.js` → `interacciones.js` → `herramientas.js`. Si agregas un script, va después.

**Lo único que necesita internet** es la tipografía Poppins de Google Fonts. Sin conexión la página
funciona igual, con la tipografía de respaldo del sistema.

**Los acentos de los diagramas usan `var(--accent-ink)`**, no el amarillo fijo: así el mismo diagrama
se lee tanto en una sección oscura como en una clara.

---

## Accesibilidad y navegación: lo que ya está resuelto

No lo rompas sin querer:

- **El menú compacto.** Debajo de 1080px los enlaces del `<nav>` no caben, así que se convierten
  en un panel que abre el botón `#nav-toggle`. Si agregas un enlace al menú funciona solo; si
  tocas el header, revisa que el botón siga ahí.
- **Foco visible.** Hay una regla global `:focus-visible` en `01-tokens.css` que usa
  `--accent-ink`, por eso se ve tanto en secciones oscuras como claras. No la sobreescribas con
  `outline:none` en un componente.
- **Los diagramas y las tablas anchas llevan `tabindex="0"`.** Es lo que permite recorrerlos con
  teclado cuando no caben en pantalla. Si copias un `<figure class="flow">` o un
  `<div class="table-wrap">`, cópialo con su `tabindex`.
- **Sin JavaScript la página se ve igual de completa.** El `<noscript>` del `<head>` anula la
  animación de entrada; si no estuviera, todo quedaría en `opacity:0`.
- **El enlace «Saltar al contenido»** apunta a `#resumen`, la primera sección real.

---

## Antes de publicar un cambio

- Ábrelo con doble clic y recorre la página completa.
- Abre la consola del navegador (F12) y confirma que no hay errores en rojo.
- Prueba en móvil o angostando la ventana: comprueba que el menú compacto abre y cierra, y que
  los diagramas hacen scroll horizontal dentro de su marco.
- Recórrelo con Tab: cada control debe mostrar un contorno visible.
- Haz Ctrl+P y mira la vista previa: debe salir sobre blanco, con los plegables abiertos.
- Si tocaste `contenido.js`, verifica el panel que corresponda haciendo clic en sus botones.
- Si agregaste una subsección, búscala en el índice y comprueba que el enlace cae donde debe.
