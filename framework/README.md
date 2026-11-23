# Framework Área Digital · v0.3

Landing interna del framework de trabajo del área digital de Adcom.
Es un sitio estático: **se abre haciendo doble clic en `index.html`**, sin servidor, sin build, sin dependencias.

Se organiza en tres guías, con entrada directa desde la portada y el menú:

- **Estrategia** (`estrategia.html`): contexto y objetivos, pilares, modelo de resultados,
  inteligencia estratégica, coordinación con otras áreas y evolución con criterio de éxito.
- **Operación y táctica** (`operacion-tactica.html`): solicitudes, flujo de trabajo, equipo,
  distribución de cuentas, campañas y QA, presupuesto y alertas, diagnóstico, optimización
  y pruebas, playbooks y repositorio.
- **Automatización e IA** (automatizacion.html): Media Bridge, niveles de autonomía, aprobación, auditoría y riesgos.

La táctica define acciones, ajustes y pruebas; la operación define responsables, plazos,
validación y registro. La numeración original se conserva como referencia, aunque la lectura
se ordena por propósito. Los capítulos mantienen sus anclas y no se duplican.

Vive dentro del repositorio [`adcomgroupco/adcom`](https://github.com/adcomgroupco/adcom) y se
abre también desde el portal de la raíz (`../index.html`).

---

## Estructura

```
framework/
├── index.html                    ← portada, herramientas e índice compartido
├── estrategia.html               ← estrategia, ruta de decisión y capítulos
├── operacion-tactica.html         ← operación y táctica, flujos y herramientas
├── automatizacion.html          ← IA, supervisión y gobernanza
├── assets/
│   ├── css/
│   │   ├── 01-tokens.css         colores, tipografía, reset, animaciones
│   │   ├── 02-layout.css         header, navegación y hero
│   │   ├── 03-componentes.css    cards, paneles, tablas, herramientas, cierre
│   │   │                         y, al final, las utilidades de separación
│   │   ├── 04-diagramas.css      diagramas de flujo en SVG
│   │   ├── 05-responsive.css     breakpoints globales
│   │   └── 06-impresion.css      cómo sale en papel o PDF (media="print")
│   ├── js/
│   │   ├── base.js               utilidades compartidas ($, $$, chips, lista)
│   │   ├── contenido.js          TEXTOS de las partes interactivas, el índice, el tablero
│   │   │                         de cuentas y los requisitos de solicitud
│   │   ├── interacciones.js      navegación, animaciones y bloques que se pintan solos
│   │   └── herramientas.js       calculadora, árbol, constructor, combinador y tablero
│   ├── plantillas/                archivos de nomenclaturas y UTM descargables
│   └── img/                       capturas y recursos visuales
├── _archivo/                      versiones sustituidas y fuente histórica (regla 10)
│   ├── framework-area-digital-v03.html
│   └── framework-area-digital-v03-detallado.md
├── PRODUCT.md                     propósito, usuarios y restricciones del producto
└── README.md                      documentación de mantenimiento
```

> **Ojo con el `.md` de `_archivo/`.** Era el documento fuente, pero `index.html` ya lo superó: la página
> incluye los puntos 86—99 (optimización de pauta, distribución de cuentas, solicitudes y
> automatización) que el `.md` no tiene, y omite los puntos 42, 43 y 82 que el `.md` sí trae.
> Hoy la fuente de verdad son las páginas de capítulos. El `.md` se conserva como referencia histórica; si
> alguien lo edita esperando que se refleje en la página, no va a pasar nada.

`06-impresion.css` se carga con `media="print"`, así que no afecta la pantalla. Si agregas una
sección nueva y quieres verla impresa, no hay que tocar nada: solo revisa que no use una
herramienta interactiva, porque esas se ocultan en papel.

Los archivos CSS están numerados porque **el orden importa**: se cargan en secuencia y así se
resuelve la cascada. Si agregas uno, ponlo en la posición que le corresponda y enlázalo en el
`<head>` de `index.html` en ese mismo orden.

---

## Dónde cambiar qué

| Quiero cambiar… | Voy a… |
|---|---|
| Un color, la tipografía, los radios | `assets/css/01-tokens.css`, bloque `:root` |
| Los textos de pilares, variables, etapas, ciclo, localización, árbol o repositorio | `assets/js/contenido.js` |
| Una entrada del índice | `assets/js/contenido.js`, bloque `FD.INDICE` |
| Las personas o las cuentas del tablero | `assets/js/contenido.js`, bloque `FD.CUENTAS` |
| Lo que se pide para aceptar una solicitud | `assets/js/contenido.js`, bloque `FD.SOLICITUDES` |
| Cualquier otro texto de la página | El HTML de la guía correspondiente |
| Un diagrama de flujo | El HTML de la guía, en su elemento `figure` |
| El aspecto de los diagramas | `assets/css/04-diagramas.css` |
| Cómo se comporta la calculadora o el constructor | `assets/js/herramientas.js` |
| Lo que dice el capítulo de automatización e IA | `automatizacion.html`, sección `#ia` |
| Agregar un capítulo a la navegación | Su página, dentro de `.chapter-nav` |

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

1. Copia un capítulo con `data-framework-section` en la página correspondiente.
2. Cámbiale el `id`, el `aria-labelledby` y alterna la clase `section-dark` / `section-light`
   respecto a la sección vecina.
3. Agrega el enlace a la navegación de capítulos y a FD.INDICE con la familia correspondiente.
   Registra el ancla en FD.ANCLAS para que el índice y los enlaces compartidos lleguen a esa página.
   El título de la página es h1, el del capítulo h2 y sus temas empiezan en h3.
4. Marca con `data-reveal` los bloques que deban aparecer al hacer scroll.

## Títulos: tres niveles y el número del punto

- **Apertura de sección** (`.wrap > .section-heading`): en escritorio, título y frase a la izquierda;
  entradilla y mapa de la sección a la derecha. La línea de arriba (`.eyebrow`) es la ubicación: el JS
  le antepone la sección del índice (Estrategia u Operación y táctica).
- **Subsección** (`.divider > .section-heading`): el número del punto va en pastilla, en la misma línea
  del título. Si la subsección usa `h4.sub-heading`, el número se escribe así:

  ```html
  <h4 class="sub-heading" data-reveal><span class="num">86</span> Sistema de priorización de solicitudes</h4>
  ```

  No escribas `86 · Título` a mano: pierde la pastilla y el mapa de la sección no separa el número.
- **Mapa de la sección** (`.en-seccion`): se arma solo con cada `.divider[id]` y `.sub-heading[id]`
  del capítulo, cuando hay dos o más. Para que un tema aparezca, basta con darle `id`.
- **Las fichas del resumen son enlaces** (`a.card-link`): cada una lleva a su sección. Si cambia el
  `id` de una sección, actualiza el `href` de su ficha.

## Qué componente usar: según lo que es el contenido

Antes de poner dos o tres tarjetas en una rejilla, pregúntate qué relación tienen entre sí. Todos
estos componentes trabajan sobre las mismas `.card`: cambiar de forma es cambiar la clase del
contenedor, no reescribir las tarjetas.

| El contenido es… | Componente | Ejemplo en la página |
|---|---|---|
| Explicaciones que se leen una tras otra | `div.notas` | 29.4—29.7, 98.1—98.2 |
| Categorías paralelas y cortas | `div.columnas` (color con `style="--tono:var(--green)"`) | escenarios (21), familias A/B/C |
| Niveles ordenados de menor a mayor | `div.columnas.escala` + `style="--nivel:2"` en cada tarjeta | alertas S3—S1, autonomía 97 |
| Opuestos | `div.versus` con `card versus-si` y `card versus-no` | 52/53, 95.1/95.2, 89.2/89.3 |
| Serie paralela larga (4 o más, con detalle) | `div.carrusel` con `data-tab="Nombre"` en cada tarjeta | Media Bridge (96), interfaces (14—17) |
| Secuencia en el tiempo | `ol.linea` con `li.card` | madurez de medición (83.1), las cuatro preguntas (20) |
| Muchos elementos con los mismos atributos | una tabla | frentes de la v0.4, lentes del 36 |

- **Escala:** el riel se llena `--nivel / --niveles` (3 por defecto). Ordénala siempre de menor a mayor.
- **Carrusel:** el JS arma las pestañas, las flechas y el contador. Sin JS queda una fila que se
  desplaza de lado. En papel se imprimen todas las fichas. Un enlace o resultado de búsqueda que
  apunta adentro de una ficha la trae a la vista.
- **Barra en tabla** (`span.barra` con `style="--v:.66"`): solo para una cifra real, con el valor escrito
  al lado. Si un valor no cabe en la escala (por ejemplo días frente a horas), usa `barra-fuera` y dilo.
  No inventes cifras para tener un gráfico.
- **Rango en tabla** (`span.rango` con `style="--a:1;--m:2;--b:4"`, escala de 0 a 7): de un mínimo
  a un máximo, con un punto en el valor medio. Es el de la tabla del punto 86 (días por complejidad).
  Las cifras siguen en sus columnas: la barra es la lectura rápida, no la única.
- **La tarjeta sola sigue sirviendo** cuando cada una es una entidad completa y distinta (los tres
  roles del equipo) o cuando es un enlace (las fichas del resumen).

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
{f:"operacion-tactica", a:"sistema", n:"58—81", t:"Sistema documental", items:[
  {a:"nomenclatura", t:"71—77 · Nomenclatura y constructor de nombres"}
]}
```

Si el texto de una entrada empieza con el número del punto seguido de ` · ` (por ejemplo
`"58.1 · Dónde vive cada cosa hoy"`), el índice lo separa solo en su propia columna. Una entrada sin
ese formato se muestra sin número. Las guías del riel izquierdo son filtros que se prenden y se
apagan, y su conteo sigue a la búsqueda.

El buscador filtra por texto de la entrada, ignora tildes y resalta la coincidencia. Si agregas una
subsección al documento, ponle un `id` al `<div class="divider">` o al `<h3>` y súmala aquí: es el
único lugar donde hay que registrarla.

Hay un botón flotante de vuelta al índice que aparece al pasar la primera pantalla. La búsqueda
global también se puede abrir desde el header o con `/` y `Ctrl+K`; lleva al campo principal y
mantiene el acceso disponible desde cualquier punto del documento.

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
{c:"94.4", t:"Informe", sale:"Informe con acciones derivadas", sla:"1 a 3 días hábiles",
 pregunta:"¿Qué decisión va a soportar este informe?",
 min:["Objetivo del informe: qué decisión debe habilitar", "…"],   // sin esto se devuelve
 des:["Preguntas concretas que se esperan responder", "…"],        // suma, no bloquea
 conecta:"81·06 · Todo informe genera acciones",
 nota:"Un informe sin decisión asociada…"}
```

- **`min` es la lista que bloquea.** Antes de agregar algo ahí, pregúntate si de verdad impide
  empezar. Todo lo que ayuda pero no impide va en `des`; si `min` crece sin control, la puerta deja
  de usarse y la gente vuelve a pedir por chat.
- **`sla` y `sale` deben coincidir con la tabla del punto 86.** Si cambias uno, cambia el otro.
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

**Lo único que necesita internet** son las tipografías Inter Tight e Inter de Google Fonts (sistema v2, que además carga ../assets/css/adcom-v2.css). Sin conexión la página
funciona igual, con la tipografía de respaldo del sistema.

**Los acentos de los diagramas usan `var(--accent-ink)`**, no el amarillo fijo: así el mismo diagrama
se lee tanto en una sección oscura como en una clara.

---

## Accesibilidad y navegación: lo que ya está resuelto

No lo rompas sin querer:

- **Navegación principal.** Los enlaces entre páginas están siempre visibles. El capítulo se elige en la apertura de cada página o desde el índice compartido.
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
