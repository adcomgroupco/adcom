# Estándares de diseño de Adcom · v2

La fuente de verdad del diseño de las páginas y formatos de Adcom. Sirve para tres cosas: construir una página
nueva sin inventar CSS, revisar que una existente cumpla, y replicar el sistema en otro repo. Está escrito para
el equipo y para cualquier IA que trabaje en este repo.

Origen: el artefacto «Adcom — Sistema de diseño» (canvas «Dirección visual web»), la exportación oficial de
`assets/ds/` y el sitio web (`sitio-adcom`) como referencia visual. Si algo de aquí choca con `sistema/DESIGN.md`
o con `informes/LINEAMIENTOS_DISENO_REPOSITORIOS.md`, **manda este documento**: esos describen el sistema
anterior (amarillo y Poppins), que sigue vigente solo en los repos de cliente.

Contenido: [1 Principios](#1-principios) · [2 Archivos](#2-archivos-y-cómo-enlazarlos) ·
[3 Color y lima](#3-color-y-la-regla-de-la-lima) · [4 Tipografía](#4-tipografía) · [5 Composición](#5-espacio-y-composición) ·
[6 Forma y movimiento](#6-forma-y-movimiento) · [7 Componentes](#7-componentes) · [8 Diagramas](#8-diagramas) ·
[9 Marca](#9-marca) · [10 Voz](#10-contenido-y-voz) · [11 Accesibilidad](#11-accesibilidad-y-responsive) ·
[12 Privacidad](#12-privacidad-en-plantillas) · [13 Verificación](#13-verificación) ·
[14 Páginas nuevas](#14-crear-una-página-o-un-componente-nuevo) · [15 Replicar](#15-replicar-en-otro-repo) ·
[16 Pendientes](#16-decisiones-abiertas)

## 1. Principios

Cuatro ideas guían cada decisión; se citan al justificar un diseño.

- **Ma**: el espacio vacío comunica. Cada sección respira; nada toca los bordes.
- **Kanso**: simplicidad. Una idea, un titular, un visual por pantalla.
- **Shibui**: elegancia discreta. Neutros apagados, líneas de 1 px y un solo acento vivo.
- **Seijaku**: calma. Movimiento lento y preciso, solo donde explica algo.

Color: 90 % neutro, 10 % carácter. Lo que hace que una página se vea elaborada no es adorno: es aire, jerarquía,
un diagrama que explica y una marca de lima que dice dónde mirar.

## 2. Archivos y cómo enlazarlos

| Archivo | Qué es | Se edita |
|---|---|---|
| `assets/css/adcom-v2.css` | Tokens, puente de nombres del sistema anterior, componentes `ad-*` (secciones 5b y 5c) | Sí, es la fuente |
| `assets/ds/fonts.css` y `fonts/` | Inter Tight e Inter, locales | No |
| `assets/ds/logos/adcom-mark.png` | Isotipo oficial (negro, 256×213) | No |
| `assets/favicon-adcom.png` | Favicon | No |
| `banco-formatos/formatos.css` | Estilo compartido de las plantillas del banco | Sí |
| `banco-formatos/componentes.html` | Galería viva de cada componente | Sí, al crear uno |

Orden del `<head>` (rutas relativas según la profundidad de la página):

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../assets/ds/fonts.css">
<link rel="stylesheet" href="../assets/css/adcom-v2.css?v=AAAAMMDD">
<link rel="icon" type="image/png" href="../assets/favicon-adcom.png">
<link rel="apple-touch-icon" href="../assets/ds/logos/apple-touch-icon.png">
```

**Versión de las hojas.** `?v=AAAAMMDD` es obligatorio. Al editar `adcom-v2.css`, `formatos.css` o un
`css/<formato>.css`, sube ese número en todas las páginas que lo enlazan. Sin él, el navegador y GitHub Pages
siguen sirviendo la hoja vieja y la página se ve «sin estilos».

Nada de Google Fonts, Poppins, Roboto ni Montserrat. Nada de estilos en línea con colores sueltos: todo sale de
tokens (`var(--…)`).

## 3. Color y la regla de la lima

| Token | Valor | Para qué | Contraste |
|---|---|---|---|
| `--washi` | `#F7F6F2` | Fondo de página | — |
| `--papel` | `#FFFFFF` | Fondo alterno, tarjetas, campos | — |
| `--crema` | `#EFEDE7` | Notas, lecturas, contacto | — |
| `--piedra` | `#E4E2DC` | Línea de 1 px | decorativa |
| `--piedra-borde` | `#D6D3CB` | Borde de chip y campo | 1,4:1 (aviso conocido) |
| `--sumi` | `#141414` | Titulares, datos, botón oscuro | 17:1 |
| `--tinta-secundaria` | `#4A4A46` | Párrafos | 8,2:1 |
| `--tinta-suave` | `#55554F` | Etiquetas y metadatos | 6,9:1 |
| `--tinta-tenue` | `#8A8A84` | Solo texto de 24 px o más; marcas de gráfico | 3,2:1 |
| `--lima` | `#D8FF3D` | Acento único, solo relleno | con sumi 16:1 |
| `--negro-escena` | `#0E0E0F` | Secciones oscuras | — |
| `--noche` | `#0E0E27` | Productos propios (LumnIA, Vincero) | — |
| `--sobre-oscuro-100/200/300` | `#F7F6F2` / `#C9C9C4` / `#A8A8A2` | Texto sobre oscuro | 17,8 / 11,6 / 8,1:1 |

`--tinta-suave` es más oscuro que el valor del artefacto original (`#6B6B66`): el equipo lo encontró difícil de
leer. **Nunca `--tinta-tenue` en texto de lectura ni grises claros en texto.**

### La lima

Siempre es **relleno con texto `sumi`**. Nunca color de texto, de borde ni de línea. En un gráfico sobre fondo
claro, con borde `sumi` (la lima sobre papel da 1,1:1 y sola no se lee).

| Uso | Clase | Cuántas |
|---|---|---|
| Lo que se **pulsa** como acción principal | `.ad-go` («Abrir ›»), `.ad-btn--accent` | La acción principal de cada bloque; `.ad-go` en cada fila de una lista de destinos |
| La **palabra clave** del titular | `.ad-hl` | Una por titular |
| Lo **seleccionado o actual** | `.is-on`, `aria-current`, `aria-pressed` | Uno por grupo |
| La **cifra clave** de un bloque | `.ad-kpi--on`, `.ad-fill` | Una por bloque de cifras |
| El **último paso** o el actual de un recorrido | `.ad-n--on`, `.ad-paso.is-on`, `.ad-eje li.is-on` | Uno por recorrido |
| Un logro destacado | `.ad-estado--ok.is-on` | Uno por tabla |

Reglas de medida: **una marca por bloque, entre 4 y 10 rellenos por página** (el sitio web está en ese rango).
`.ad-estado--ok` es neutro (borde sumi y punto lleno); no se rellena de lima salvo con `.is-on`. No más de una
fila `tr.is-on` por tabla ni un `ad-kpi--on` por `ad-kpis`. Si todo es lima, nada lo es.

### Colores de estado (provisionales)

El sistema original no define verde, rojo ni ámbar. Se usan `--pos`, `--neg` y `--warn` solo con texto y forma
(punto, medio círculo), nunca solos. Están marcados PROVISIONAL en `adcom-v2.css` hasta que el sistema los
defina.

## 4. Tipografía

- **Titulares y cifras:** Inter Tight (`--font-display`). **Cuerpo:** Inter (`--font-body`).
- Titulares en peso **500**, interletrado −3 % a −4 %, `text-wrap: balance`. Cifras grandes en peso **300**.
- Cuerpo en 17 px con interlínea 1,6; sin interletrado. Etiquetas y metadatos de 13 a 15 px, **sin mayúsculas**.
- Escala (clases `.ad-t-*`, fluidas con `clamp()`): `display-hero` hasta 104 px (h1 de página),
  `statement` 72 (sobre oscuro), `h2` 60 (sección), `h2-compact` 44, `h3-capacidad` 26, `lead` 21, `body` 17,
  `caption` 14, `label` 13; `cifra-xl` 64 y `cifra-lg` 44.
- Titulares que **afirman**, en minúscula de oración y cerrados con punto cuando son frases, en dos líneas cortas
  (`.ad-ln`, nunca `<br>`): «Todo conectado. / Todo medible.» «Resultados» no es un titular; «El costo por
  registro se movió en tres tramos» sí.
- Cifras con punto de millar y espacio antes de `%` y `M`: `70.000`, `+20 %`, `$86,4 M`. En HTML, `&nbsp;`; en JS,
  `Intl.NumberFormat('es-CO', { useGrouping: 'always' })`. Cada cifra lleva contexto y fuente («Educación · 2023»).

## 5. Espacio y composición

**Escala de espacio:** `--space-2` 8 · `-4` 16 · `-6` 24 · `-8` 32 · `-10` 40 · `-12` 48 · `-16` 64 · `-24` 96 ·
`-32` 128 · `-40` 160 px. Contenedor `--container-max` 1200 px con gutter de 24 px (`.ad-wrap`).

**Ritmo.** Cada bloque grande es un `<section class="ad-sec …">` con `.ad-wrap` dentro. Dos secciones seguidas
suman entre 112 y 160 px de aire: no se achica con relleno propio.

**Páginas no densas** (portal, framework, playbook, guías, portadas, informes editoriales) se componen así:

1. `.ad-hero`: titular de hasta 104 px en dos líneas, entradilla `.ad-lead` (máx. ~44 caracteres de ancho) y la
   acción principal.
2. Secciones que **alternan** fondo: claro (`washi`) → `--papel`/`--crema` → `--oscuro` → claro… Al menos una
   oscura donde haya una idea fuerte (`.ad-sec--oscuro`, `--noche` para productos).
3. Cada sección: cabecera `.ad-sec-cab` (`--grande` para el titular de 60 px) a un lado y la figura o la lista
   al otro (`.ad-split`; en móvil se apila).
4. Un **diagrama protagonista** por página (sección 8).
5. Cierre `.ad-cierre`: una frase y una sola acción, sobre fondo oscuro.

**Páginas densas** (tableros, informes de datos, plantillas con tablas) mantienen fondo claro y no llevan
diagrama forzado: se mejora jerarquía y espaciado (títulos de sección de 26–44 px con nota, tablas con aire,
cifras protagonistas).

Se separa con líneas de `piedra` de 1 px, no con cajas ni sombras.

## 6. Forma y movimiento

- **Lo que se toca es redondo** (`--radius-pill`: botones, chips, etiquetas); **lo que se lee es recto**
  (`--radius-card` 4 px, `--radius-panel` 6 px, `--radius-input` 2 px, `--radius-circle` para insignias).
- **Sin sombras y sin degradados decorativos.** (El resaltador `.ad-hl` y las tramas funcionales son la excepción.)
- Movimiento lento (ciclos de 4 a 14 s), solo tres recursos: líneas que se dibujan, puntos que viajan y anillos
  que laten. Sin rebotes. `prefers-reduced-motion` lo deja quieto y ya está cubierto en `adcom-v2.css`.

## 7. Componentes

La galería con cada pieza, su marcado y cuándo usarla es **`banco-formatos/componentes.html`**. Se copia el
marcado de ahí. Resumen:

| Necesito… | Uso |
|---|---|
| Encabezado de página | `.ad-nav` + `.ad-marca` |
| Portada | `.ad-hero` (`--centro`), `.ad-lead` |
| Sección con ritmo | `.ad-sec` (`--papel`, `--crema`, `--oscuro`, `--noche`, `--linea`), `.ad-wrap` |
| Cabecera de sección | `.ad-sec-cab` (`--grande`, `--centro`, `--compacta`), `.ad-eyebrow` |
| Idea a un lado, figura al otro | `.ad-split` (`--inversa`, `--arriba`) |
| Elegir entre opciones | `.ad-card` (`.is-on`, `--dark`), `.ad-chip` |
| Lista de destinos | `.ad-filas` / `.ad-fila` + `.ad-go` |
| Cifras | `.ad-kpis` / `.ad-kpi`, `.ad-cifras` / `.ad-stat` |
| Estado | `.ad-estado` (`--ok`, `--parcial`, `--pendiente`, `--sin`, `--na`, `--alerta`) |
| Frase que traduce un dato | `.ad-lectura`; hallazgo central: `.ad-cita` |
| Recorrido numerado | `.ad-pasos` / `.ad-paso` con `.ad-n` |
| Avance o cumplimiento | `.ad-barra` (`--on`), `.ad-barra-apilada` |
| Tabla | `.ad-tabla` (`--densa`; `.valor` alinea cifras a la derecha) |
| Pieza o imagen pendiente | `.ad-marcador--1x1`, `--4x5`, `--9x16`, `--16x9` |
| Gráfico con lectura | `.ad-figura` + `.ad-leyenda` + `.ad-datos` |
| Datos de portada, aviso, filtros | `.ad-ficha`, `.ad-aviso`, `.ad-filtros` |
| Sobre fondo oscuro | Dentro de `.ad-sec--oscuro` o `.ad-oscuro`, los componentes se adaptan |
| Cierre | `.ad-cierre` + `.ad-btn--accent` |

**No se escribe CSS suelto por página.** Si falta una pieza: se crea en `adcom-v2.css` con prefijo `ad-` y solo
con tokens, se documenta en `componentes.html` (demo, cuándo se usa y dónde va la lima) y se sube la versión
`?v=`. Solo lo realmente particular de una página (un gráfico propio, un layout único) vive en su CSS, con
prefijo propio.

## 8. Diagramas

Vocabulario **cerrado** de cinco figuras; no se inventan formas nuevas por sección.

| Figura | Componente | Cuándo |
|---|---|---|
| **Anillo** | `.ad-anillo` | Un ciclo que se repite (de 4 nodos): Growth System; el ciclo del área |
| **Eje** | `.ad-eje` | De lo amplio a lo específico, o fases de un recorrido (el actual en lima) |
| **Suma** | `.ad-suma` + `.ad-op` | Capacidades que se suman (`+`) y la que multiplica (`×` en lima) |
| **Cruce** | inline SVG | Lo que se encuentra; el área común va en lima |
| **Pasos** | `.ad-pasos` | Recorridos y métodos; el último paso en lima |

**El diagrama se adapta a la lógica de la página; no se copia.** Se elige la figura por la relación que se
explica y se nombran los nodos con contenido real:

| La página explica… | Figura | Ejemplo en este repo |
|---|---|---|
| Un ciclo del que se vuelve a empezar | Anillo | Portal: planear → ejecutar → reportar → aprender |
| De qué decidimos a qué delegamos | Eje | Framework: estrategia → operación → automatización |
| Una ruta de lo general a una ficha | Eje con cifras | Playbook: medio (8) → formato (43) → ficha (1) |
| Piezas que se suman a un resultado | Suma | Estrategia: medios + creatividad + … = resultado |
| Un embudo o un proceso con estados | Pasos | Cierre: plataforma → CRM → inscrito → matriculado |
| Una evolución en el tiempo | Gráfico propio con lectura | Seguimiento de inversión, informe particular |

Un diagrama protagonista por página; los demás son ecos (un número, un «+», una flecha) o silencio. Si necesita
un párrafo largo para entenderse, está mal planteado. Si una lista basta, se usa una lista.

## 9. Marca

- El encabezado lleva `.ad-marca`: el **isotipo oficial** (`assets/ds/logos/adcom-mark.png`) más un separador y
  el nombre del documento en texto. Sobre fondo oscuro, `.ad-marca--claro` (isotipo en blanco).
- **Nunca** escribir «Adcom» en texto como si fuera el logotipo ni redibujar la marca.
- **Sin logos de cliente** en portadas ni encabezados: el nombre del cliente va en texto. Las imágenes que son
  contenido (previews de anuncios, capturas, piezas) se conservan.
- Los logos de clientes pueden mostrarse en gris (`opacity-logo`, `grayscale(1)`, `multiply`) y recuperar su
  color al pasar el cursor, solo en piezas de presentación (el sitio web), nunca en documentos de trabajo.
- Pie: «Adcom · Brand Group» o «Adcom · Área digital».
- Los textos de interfaz ilustrativa (capturas de LumnIA, Vincero) llevan la nota «Interfaz ilustrativa».

## 10. Contenido y voz

- Español latinoamericano, primera persona del plural («Conectamos contenido, medios, datos y tecnología»).
- Una idea, un titular, un visual por pantalla. Si un párrafo no cabe en dos o tres líneas, sobra.
- El CTA principal es «Hablemos» (sitio) o la acción concreta del documento. Los enlaces secundarios terminan en
  « ›».
- Sin signos de exclamación, emoji ni superlativos. Los resultados se muestran con datos, no con promesas.
- Metadatos separados por punto medio: «Content · Media», «CRM + pauta · 2022–2026».
- Un valor ausente es **«Sin dato»** (nunca cero); también «Parcial», «No aplica». Todo gráfico o tabla lleva
  periodo, unidad, moneda y fuente.

## 11. Accesibilidad y responsive

- Contraste de texto ≥ 4,5:1 (≥ 3:1 desde 24 px, marcas de gráfico, iconos y bordes de control). `--lima`
  siempre con `--sumi`.
- Foco visible: contorno sólido de 2 px, separado 3 px. Objetivos táctiles ≥ 44 px (`--target-min`; botones de
  acción 48 px). En tablas densas, 32 px con mouse y 44 con `@media (pointer: coarse)`.
- HTML semántico: `<button>` o `<a href>` (nunca `div` con `onclick`), `<label>` en campos, `aria-label` en
  controles solo-icono, un solo `<h1>`, sin saltar niveles de título, `aria-pressed` o `aria-current` para el
  estado activo, `caption` y `scope` en tablas, `alt` en imágenes informativas.
- Estados nunca solo con color: texto y forma además.
- Funciona con doble clic (`file://`) y a **390 px sin scroll horizontal** de la página; las tablas anchas se
  desplazan dentro de su contenedor.
- Campos a 16 px en móvil. `prefers-reduced-motion` respetado.

## 12. Privacidad en plantillas

`banco-formatos/` se copia y puede publicarse. Su ejemplo es **«Universidad Andina»** (o «Marca Ejemplo» fuera de
educación) con cifras inventadas. Ningún cliente real, ID de cuenta, URL de Looker/Zoho/hoja, nombre de persona
ni cifra copiada de un cliente. El auditor y la búsqueda de la sección 13 lo comprueban. Nunca credenciales ni
datos personales de leads.

## 13. Verificación

Una página está lista cuando pasa esta lista. Ejecutarla es parte del trabajo, no un extra.

```text
python -I herramientas/auditar_v2.py . --detalle
```

El auditor cuenta, por archivo: amarillo del sistema anterior, Poppins, sombras, mayúsculas forzadas, radios
fuera de norma, colores fuera de paleta, emoji, exclamaciones, `lang`. Objetivo: **0** en todo salvo los
colores de estado provisionales.

- [ ] Encabezado con `.ad-marca`; sin wordmark escrito ni logos de cliente.
- [ ] `fonts.css` y `adcom-v2.css?v=` enlazados; sin Google Fonts.
- [ ] Cada bloque grande en `.ad-sec`; fondos que alternan en páginas no densas.
- [ ] Un diagrama protagonista con la lógica de la página (no densas) y un cierre `.ad-cierre`.
- [ ] Lima: 4–10 rellenos, una marca por bloque; ninguna como texto ni línea.
- [ ] Componentes `ad-*` en vez de CSS propio duplicado.
- [ ] Titulares que afirman; cifras con formato `es-CO`; «Sin dato», no cero.
- [ ] Consola sin errores, sin scroll horizontal a 390 px, interacciones funcionando.
- [ ] Un solo `h1`, sin saltos de nivel, objetivos de 44 px, foco visible.
- [ ] En `banco-formatos/`: cero nombres de clientes reales ni IDs largos.
- [ ] Imprime bien si se compartirá en PDF.

**Cómo mirar la página sin cargar el navegador de pruebas.** Un servidor local y Chromium sin interfaz:

```text
python -m http.server 8765 --bind 127.0.0.1
chrome-headless-shell --screenshot=captura.png --window-size=1440,4000 --hide-scrollbars --force-prefers-reduced-motion http://127.0.0.1:8765/index.html
```

`--force-prefers-reduced-motion` es necesario en el framework: sus bloques se revelan al hacer scroll y la captura
estática no scrollea. Recargar sin caché (Ctrl+Shift+R) o cambiar `?v=` antes de comparar.

## 14. Crear una página o un componente nuevo

**Página.** Copia `banco-formatos/pagina-base.html` (encabezado, portada, sección en dos columnas con figura,
cifras, sección oscura, cierre y pie ya montados con los componentes) y reemplaza el contenido. Ajusta las rutas
relativas. Pasa la lista de la sección 13.

**Formato del banco** (informe, flow, materiales…): copia la plantilla más parecida de `banco-formatos/` con su
`css/` y `js/`; los datos van al inicio del `.js`, en el bloque «Reemplazar con los datos del cliente». Sigue
`banco-formatos/INSTRUCTIVO.md`. Nomenclatura de archivo: `[CLIENTE]_[TIPO]_[Tema y periodo]_[Fecha]_[Versión]`.

**Componente.** Busca primero en la galería: casi siempre ya hay uno. Si no: clase `ad-` en `adcom-v2.css`,
solo con tokens; demo en `componentes.html`; sube `?v=`; verifica contraste, foco, 44 px y 390 px.

## 15. Replicar en otro repo

Hoy conviven dos sistemas. **v1** (amarillo `#ffd400`, Poppins; `sistema/` con `sync.ps1`) está en los repos de
cliente. **v2** (este documento) está en `adcom`. Para llevar v2 a otro repo:

1. Copia `assets/ds/` (fuentes, logos, favicon) y `assets/css/adcom-v2.css` al repo, en las mismas rutas.
2. Enlaza las hojas como en la sección 2 y carga la fuente local; quita Google Fonts.
3. Para cada página, sigue `assets/ds/MIGRACION.md` (qué cambia y qué no: la capa visual cambia; contenido, datos
   y JS no) y la lista de la sección 13. Conserva los ids y clases que usa el JS.
4. Un repo de cliente se migra **de a una página**, empezando por el portal y un tablero; el resto sigue en v1
   mientras tanto. No mezcles las dos hojas en una misma página.
5. Cuando v2 se apruebe para los clientes, `adcom-v2.css` se mueve a `sistema/` y `sync.ps1` lo copia a cada repo
   en lugar de copiarlo a mano. **Hasta entonces `sync.ps1` no se toca**: sigue regenerando v1.

El sitio web (`sitio-adcom`) usa estilos en línea exportados del canvas: es la referencia **visual**, no la
técnica. No se copia su código; se reconstruye su composición con los componentes de aquí.

## 16. Decisiones abiertas

- **Resaltador o línea.** El sitio resalta la palabra clave con un fondo lima detrás del texto (`.ad-hl`, lo que
  usa este repo). El feedback del equipo en `assets/ds/MIGRACION.md` pide en cambio una línea gruesa bajo la
  palabra. Pendiente de unificar; cambiarlo es una sola clase.
- **Logo definitivo.** El estándar fija el isotipo como provisional. El sitio trae un wordmark «adcom» en PNG que
  podría ser el definitivo.
- **Colores de estado** (verde, rojo, ámbar): provisionales hasta que el sistema los defina.
- **`adcom-v2.css` en `sistema/`** y su sincronización a los repos de cliente (sección 15).
- **Lima en el artefacto original.** El sistema de Claude Chat dice «una por pantalla»; este repo usa «una por
  bloque». Conviene actualizar el artefacto para que coincida.

## Historial

| Fecha | Cambio |
|---|---|
| 2026-11 | v2: capa `adcom-v2.css`, componentes `ad-*`, composición con ritmo y diagramas, isotipo y fuentes locales, banco de formatos |
