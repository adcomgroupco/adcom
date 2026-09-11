# Sistema de diseño Adcom

El lenguaje visual de los documentos de cliente. Un archivo de CSS, un archivo de JS,
y este documento. Lo comparten todos los repos de la organización.

**Fuente de verdad:** `adcom/sistema/`. Las copias que viven en cada repo
(`assets/css/adcom.css`, `assets/js/adcom.js`) se generan con `sync.ps1` y se
sobrescriben. Editar una copia es perder el cambio en el siguiente sync.

---

## 1. Qué es

Poppins, el amarillo de Adcom, y **dos suelos**. Sin build, sin dependencias, sin
framework: un documento se abre haciendo doble clic y se imprime bien.

## Los dos suelos

Cada documento elige uno, en el `<html>`, y no lo cambia:

```html
<html lang="es">                      <!-- papel: fondo claro -->
<html lang="es" data-suelo="tinta">   <!-- tinta: fondo oscuro -->
```

Los dos vienen de la casa. El **framework del área digital es tinta**
(`color-scheme:dark`, fondo `#050505`) y es la declaración canónica de la marca.
**genius es papel.** Los dos son Adcom, y ninguno es la excepción del otro.

Lo que es idéntico en los dos suelos: la estructura, la escala tipográfica, el
ritmo, los contenedores, el índice con categorías, las tablas, los gráficos y
todo el vocabulario de clases. **Solo cambia el juego de tokens.**

Cuál usar: tinta cuando el documento se lee en pantalla y quiere presencia
(lanzamientos, flows, tableros de campaña). Papel cuando se lee largo o se
imprime seguido (informes, rutas, análisis). Los dos imprimen bien: en `@media
print` el sistema redeclara los tokens al suelo claro, así que un documento en
tinta no gasta una página de tinta.

**El `index.html` va SIEMPRE en papel**, aunque sus documentos vayan en tinta.
El índice no es una pieza con carácter: es el estante. Un estante oscuro compite
con lo que aloja, y el lector llega a él para irse a otro sitio, no para
quedarse. El carácter lo pone cada documento.

### Las franjas

Un documento largo se lee mejor por capítulos, y la **franja es el capítulo**:
una sección que declara su propio suelo y lo pinta de borde a borde.

```html
<section class="franja" data-suelo="tinta">
  <div class="wrap"> ... </div>
</section>
```

Los tokens se heredan, así que todo lo de adentro (fichas, barras, tablas,
gráficos, el amarillo de dato) resuelve con el contraste correcto sin escribir
una regla más.

**La franja es un ritmo, no un parche:**

- **Alterna de forma regular, no aleatoria.** Si el lector no puede predecir el
  patrón, siente que lo cambiaron de sitio. Ese era el problema de `raza`, y no
  era el color: era que el patrón no se leía. Su flow, ordenado, alterna
  tinta, papel, tinta, papel, tinta, papel, tinta. Eso sí funciona.
- **Cada franja tiene contenido para leerse como capítulo.** Dos párrafos en
  otro suelo no son un capítulo, son una raya.
- **Dos franjas seguidas del mismo suelo son una sola franja.** El sistema les
  colapsa el aire; el marcado debería unirlas.
- **El aire entre franjas de suelo distinto NO se colapsa.** Ahí el cambio de
  color abre el capítulo y necesita su respiro completo.

Las clases heredadas **son** los dos suelos: `.section-dark` y `.s-dark` valen
tinta, `.section-light` y `.s-light` valen papel. Un informe viejo recupera su
ritmo de color con el contraste correcto sin tocar su HTML.

**Una franja pinta de borde a borde; su contenido no.** En marcado nuevo eso lo
hace el `.wrap` de adentro. Los informes viejos no lo tienen, así que el sistema
le pone `max-width:var(--max)` a cada hijo directo de una franja heredada. Sin
eso el bloque se estira al viewport, y a 1900px la columna de un titular mide
1000px mientras su complemento aterriza a 1060: 700px de vacío en medio, y
cualquier acción suelta pegada al borde izquierdo.

### Una decisión de suelo es un token, nunca un selector de ancestro

Esta es la regla que más veces se ha roto, y la más caras de sus consecuencias.

Cuando algo tiene que cambiar según el suelo, la tentación es escribirlo así:

```css
/* MAL */
:is([data-suelo="tinta"],.section-dark) :is(h1,h2,h3) em{color:var(--accent)}
```

No funciona, y no es un detalle: es un **selector de descendencia**. Con
`<html data-suelo="tinta">` el ancestro está siempre presente, así que la regla
alcanza también a los `<em>` que viven dentro de una franja papel. CSS no tiene
forma de decir «el suelo más cercano».

Un token sí sabe de proximidad, porque se declara en el bloque del suelo y lo
que hereda un elemento es el valor del suelo **más cercano**:

```css
/* BIEN */
:root, [data-suelo="papel"],.section-light{ --em-fg:var(--fg);    --em-bg:linear-gradient(…) }
[data-suelo="tinta"],.section-dark      { --em-fg:var(--accent); --em-bg:none }

:is(h1,h2,h3,.display) em{ color:var(--em-fg); background:var(--em-bg) }
```

Cómo se encontró: en `raza/flow-digital.html`, el `<em>` de un `<h2>` en una
franja papel salía con el amarillo de marca, **1.3:1**. La regla de tinta lo
alcanzaba desde el `<html>`.

### Un alias se redeclara en cada suelo

Una propiedad personalizada que apunta a otra se resuelve **donde se declara**,
no donde se usa. Si `--ink:var(--fg)` vive solo en `:root`, su valor queda
congelado en el suelo de la raíz, y los descendientes heredan ese color ya
resuelto. Una franja del otro suelo redefine `--fg`, pero no `--ink`: el alias
sigue valiendo lo contrario.

Por eso los alias se repiten en los cuatro bloques de suelo (papel, tinta,
`:root` e impresión). No es duplicación: es lo que hace que el alias siga al
suelo.

Cómo se encontró: `.flow-table-section tbody td:first-child{color:var(--ink)}`
dentro de `.section-light` en un documento tinta. Texto `#f4f4f1` sobre
`#f4f4f1` — **1.00:1**. La columna «Canal» de la tabla de inversión de raza
salía en blanco, con los once nombres de canal invisibles.

### Ninguna regla se ancla a una lista de nombres de contenedor

```css
/* MAL */
.hero h1 em,.library-hero h1 em,.s-head h2 em,.section-heading h2 em{…}
```

Una lista así hay que mantenerla, y el documento número quince trae un
contenedor con otro nombre. El `<em>` de `section.rule-intro` en raza no estaba
en la lista: se quedaba sin regla y salía en itálica suelta, que es justo lo
que este sistema prohíbe.

Mantener una lista de nombres de contenedor **es** el problema de los ochenta
documentos con ochenta nombres, escrito dentro del sistema que venía a
resolverlo. Se ancla al significado (`un <em> dentro de un titular`), no al
envoltorio.

### Alineación

**Todo va alineado a la izquierda**, que es donde el ojo vuelve en cada línea.

**Un solo bloque centrado por documento, y es el cierre.** Si se centran varios,
el centrado deja de significar "este es el momento de decidir" y pasa a ser
decoración. Un botón que se ve aislado casi nunca se arregla centrándolo: se
arregla acercándolo al texto que lo justifica y dándole a su bloque el ancho
máximo. Centrarlo lo deja igual de solo, pero en el medio.

### El slab es otra cosa

`.slab` es un **momento invertido dentro de una franja**, una vez por documento
o ninguna. No se usa para lo mismo que una franja: la franja abre capítulo, el
slab interrumpe. Dentro de un slab todo va por los tokens `--inv-*`, incluido
el acento (`--inv-accent`): un `--accent` a pelo dentro de un slab claro da
1.3:1.

## Las referencias

`genius` es la referencia de **organización**: contenedores, gráficos y orden.
`raza` era la anti-referencia de **estructura**, pero su color asertivo (suelo
tinta y amarillo de bloque) es lo que dio origen al segundo suelo. Los dos
existían al mismo tiempo, y la diferencia no era de gusto sino de decisiones
concretas, que este documento fija.

**Ámbito:** todos los repos de `adcomgroupco` menos `loyevo`, que queda fuera por
decisión del cliente interno. `otros` tampoco entra: es un repo de borrador.

---

## 2. Los tokens

Todo el color del sistema. Los tokens son **roles**, no colores: `--fg` es "el
primer plano", y vale negro en papel y casi blanco en tinta. No se agregan
tokens sin actualizar estas tablas.

Los contrastes están medidos uno por uno, no estimados.

### Igual en los dos suelos

| Token | Valor | Contraste | Para qué |
|---|---|---|---|
| `--accent` | `#ffd400` | ver abajo | El amarillo de Adcom |
| `--accent-hi` | `#ffdf3d` | no aplica | El amarillo al pasar el cursor |
| `--accent-ink` | `#3d3300` | 8.8:1 sobre el amarillo | Texto encima de un relleno amarillo |

### Suelo papel (el de por defecto)

| Token | Valor | Contraste sobre el suelo | Para qué |
|---|---|---|---|
| `--ground` | `#f4f4f1` | no aplica | El fondo de toda la página |
| `--fg` | `#050505` | 18.5:1 | Titulares y prosa principal |
| `--fg-secondary` | `#4a4a47` | 8.1:1 | Prosa secundaria, entradillas |
| `--fg-muted` | `#656560` | 5.3:1 · 4.7:1 sobre `--sunken` | Etiquetas, pies, unidades |
| `--raised` | `#fcfcfa` | no aplica | La superficie de una ficha |
| `--sunken` | `#e7e6e1` | no aplica | La pista de una barra |
| `--rule` | `rgba(5,5,5,.13)` | no aplica | Separar sin llamar la atención |
| `--rule-strong` | `rgba(5,5,5,.88)` | no aplica | Abrir una sección |
| `--accent-fg` | `#7d6800` | 4.9:1 | El amarillo cuando es dato o texto |
| `--neg` | `#c2261c` | 5.3:1 | El dato que está mal |
| `--inv-accent` | `#7d6800` | sobre el `.slab` oscuro | El acento del momento invertido |

Aquí el amarillo de marca da **1.3:1** contra el suelo: es inservible como texto
y como relleno de barra. Para eso existe `--accent-fg`.

### Suelo tinta

| Token | Valor | Contraste sobre el suelo | Para qué |
|---|---|---|---|
| `--ground` | `#050505` | no aplica | El fondo de toda la página |
| `--fg` | `#f4f4f1` | 18.5:1 | Nunca `#fff` puro |
| `--fg-secondary` | `#aaa9a4` | 8.7:1 | El mismo que usa el `.slab` de genius |
| `--fg-muted` | `#949289` | 6.5:1 · 4.9:1 sobre `--sunken` | Etiquetas, pies, unidades |
| `--raised` | `#141413` | no aplica | La superficie de una ficha |
| `--sunken` | `#262624` | no aplica | La pista de una barra |
| `--rule` | `rgba(244,244,241,.18)` | no aplica | Separar sin llamar la atención |
| `--rule-strong` | `rgba(244,244,241,.85)` | no aplica | Abrir una sección |
| `--accent-fg` | `#ffd400` | **14.2:1** | El amarillo de marca **es** el de dato |
| `--neg` | `#ff6b6b` | 7.3:1 | `#c2261c` se queda en 3.5:1 aquí |
| `--inv-accent` | `#7d6800` | sobre el `.slab` claro | El acento del momento invertido |

**Esta es la razón de ser del suelo tinta:** sobre negro el amarillo de marca ya
es legible, así que el amarillo de dato y el de marca son el mismo. Por eso una
página en tinta se ve más asertiva sin agregar un solo color.

### Los alias heredados

El vocabulario se escribió con `--ink` y `--paper`. Se quedan como alias de los
roles, así que **un documento cambia de suelo sin tocar una línea de su CSS**:

```css
--ink:var(--fg);   --paper:var(--ground);   --accent-deep:var(--accent-fg);
--ink-secondary:var(--fg-secondary);   --ink-muted:var(--fg-muted);
```

En código nuevo usa los roles (`--fg`, `--ground`). Los alias existen para no
reescribir catorce repos, no como estilo a seguir.

**Van repetidos en los cuatro bloques de suelo.** Un alias se resuelve donde se
declara: si solo vive en `:root`, queda congelado en el suelo de la raíz y una
franja del otro suelo hereda el color contrario. Ver «Un alias se redeclara en
cada suelo».

### La rampa secuencial

Para un **orden**, no para identidades: un embudo, una escala de intensidad, una
serie de etapas. Corre del suelo hacia el primer plano.

| Token | Papel | Tinta | Texto encima |
|---|---|---|---|
| `--ramp-1` | `#e7e6e1` | `#262624` | `--fg` |
| `--ramp-2` | `#c4c3bc` | `#3f3e3b` | `--fg` |
| `--ramp-3` | `#9a9992` | `#6b6a64` | `--fg` |
| `--ramp-4` | `#4a4a47` | `#aaa9a4` | `--ground` |

La regla de texto es **la misma en los dos suelos**, y no es casualidad: la
rampa siempre va del suelo hacia el primer plano, así que el último paso es el
más cercano a `--fg` y necesita `--ground` encima. Medido: 16.3, 11.5, 7.1 y
8.1:1 en papel; 13.8, 9.7, 4.9 y 8.7:1 en tinta.

No hay verde de "bien": el dato bueno es el que no está marcado.

### Dónde va cada amarillo

Esta es la regla que más se equivoca, y la que `genius` tenía mal:

| Uso | Token | Por qué |
|---|---|---|
| Relleno de una barra, punto de un rango, línea de una serie | `--accent-fg` | El lector tiene que ver **dónde termina** el dato. En papel `#ffd400` sobre `--sunken` da **1.1:1** y el borde desaparece; en tinta `--accent-fg` **es** `#ffd400` y no hay conflicto |
| Subrayado de un titular, regla de `.panel-hi` o `.quote`, punto del wordmark, categoría en pantalla | `--accent` | Aquí solo hace falta **notar** que algo está marcado, y es el momento de marca |
| Relleno de la acción primaria (`.button-primary`), nivel final de un embudo, `.skip-link` | `--accent` con `--accent-ink` encima | El amarillo lleno, en los dos suelos. Es el momento de marca más visible de cualquier página, y a 8.8:1 pasa AAA |
| Cualquier acento dentro de un `.slab` | `--inv-accent` | El slab es el suelo contrario, así que el acento se invierte con él |
| Texto encima de un relleno amarillo | `--accent-ink` | 8.8:1 en los dos suelos |

En corto: **el amarillo de dato es `--accent-fg`; el amarillo de marca es
`--accent`.** En papel son distintos; en tinta son el mismo, y eso es
exactamente lo que hace que tinta se sienta como el raza original.

### De dónde viene el amarillo

`#ffd400` es el de `adcom/framework` (la declaración canónica de la marca) y el de
`genius`. El `#FFC000` que aparecía en `gana`, `uan`, `yajuego` y `westfield` es deriva
y se corrige al migrar cada repo.

### La escala de espacio

Siete pasos verticales y uno para columnas. **Cada uno tiene un trabajo**, y no
se usa un valor a mano cuando alguno de estos sirve.

| Token | Valor | Su trabajo |
|---|---|---|
| `--s-1` | `4px` | Dentro de una línea: icono a texto |
| `--s-2` | `8px` | Dentro de un grupo: etiqueta a dato |
| `--s-3` | `14px` | Elemento a elemento dentro de una ficha |
| `--s-4` | `clamp(18px,2.4vw,26px)` | Ficha a ficha, fila a fila |
| `--s-5` | `clamp(26px,3.4vw,44px)` | Bloque a bloque, encabezado a contenido |
| `--s-6` | `clamp(44px,6vw,84px)` | Apertura de una sección o de una portada |
| `--s-7` | `clamp(72px,8vw,128px)` | Entre franjas. `--step` es su alias |
| `--s-col` | `clamp(24px,4vw,64px)` | Separación entre columnas anchas |

**La regla de jerarquía: más espacio arriba de un encabezado que abajo.** Una
sección abre con `--s-7` y separa su encabezado del contenido con `--s-5`, así
que la apertura siempre gana y el encabezado pertenece visiblemente a lo que
sigue, no a lo que quedó atrás.

**Por qué existe esta escala.** Antes había **67 valores verticales distintos**,
40 de ellos `clamp()`. Pares como `clamp(18px,2.4vw,26px)` y
`clamp(16px,2vw,26px)` hacían el mismo trabajo con 2px de diferencia:
invisibles para el lector y caros de mantener. Es el mismo arreglo que el
framework del área digital ya había hecho con su tipografía, por la misma razón.

La única excepción viva es el gap interno del gráfico de barras: está calibrado
a la forma del dibujo, no al ritmo de la página.

### Cómo se colapsa el aire entre franjas

Dos franjas seguidas del mismo suelo son **una** franja, así que su aire no se
duplica. El colapso va en el `padding-bottom` de la primera, **no** en el
`padding-top` de la segunda: si la primera cierra con una regla, con el colapso
al revés el titular de la siguiente aterriza pegado a la línea y todo el aire
queda del lado equivocado. Con `:has()` no disponible no se colapsa nada, que
es preferible.

Y si dos franjas comparten suelo, la primera **no** debería llevar además una
regla de cierre: son dos separadores para la misma junta.

### Ritmo y medida

| Token | Valor | Nota |
|---|---|---|
| `--measure` | `68ch` | Medida de lectura. Nada de prosa más ancho |
| `--max` | `1240px` | Ancho del contenido |
| `--gutter` | `clamp(20px,5vw,72px)` | Margen lateral |

### Forma

Dos roles declarados, no una mezcla al gusto:

| Rol | Token | Valor | Qué lleva |
|---|---|---|---|
| Superficies y medios | `--radius` | `12px` | Fichas, marcos, paneles, fotos |
| Controles compactos | `--radius-sm` | `8px` | Botones, inputs, chips, categorías |
| Marcas de dato | ninguno | `0` | Barras, pistas, embudos, celdas |

La regla que decide: **una foto con la esquina blanda se lee como pieza; una
barra con la esquina blanda solo se lee como descuido.** Viene del framework
del área digital (20/12px), un poco más contenido.

**Un borde de acento no va sobre una esquina redonda.** Una franja amarilla al
borde de una ficha redondeada se lee como una pestaña suelta, no como parte de
la ficha. La ficha se distingue por su superficie y su regla —`--raised` más
`--rule`—, no por una franja de color. Si el acento tiene que estar en el
borde, la esquina va a `0` en ESE lado, como en la nota al margen.

### El piso tipográfico

El piso son dos números, y el segundo se fijó midiendo la referencia: raza usa
`.8rem` (12,8px) en sus notas de ficha. Tener dos valores distintos para el
mismo piso era peor que la diferencia de dos décimas de píxel entre 12,8 y 13.

Dos trampas que se lo saltan sin que se vea en el CSS:

- **`<small>`**: el navegador le da el 80% del tamaño heredado. Dentro de una
  etiqueta que ya está en el piso (12px) cae a 10px, y el piso deja de serlo.
  El sistema lo fija.
- **El `font:` abreviado**: `font:600 10px 'Poppins'` no aparece en ninguna
  búsqueda de `font-size`. Las olas que leían el CSS no lo veían.


| Token | Valor | Qué cubre |
|---|---|---|
| `--fs-min` | `.75rem` (12px) | Etiquetas, cabeceras de tabla, ejes de gráfico, chips |
| `--fs-body-min` | `.82rem` (13px) | Prosa, notas al pie, subtextos de celda |

No era regla escrita, y se notaba: los informes bajaban a **9,5px** en las
cabeceras de tabla y en las etiquetas de los ejes. En rem, no en px, para que
respete el zoom del navegador. Por debajo del piso no hay excepción: si algo
no cabe, sobra contenido, no falta tamaño.

### Los medios

Una imagen no es un `<img>` suelto: es una pieza.

```html
<figure class="media media-4-5">
  <img src="..." alt="">
  <span class="media-motif"><i></i></span>     <!-- motivo de marca, aria-hidden -->
  <figcaption>LA PASIÓN SE PRENDE</figcaption>
</figure>
```

- Relaciones disponibles: `.media-4-5`, `.media-1-1`, `.media-16-9`.
- El `figcaption` va **dentro** de la pieza, sobre un velo oscuro. Es el único
  color absoluto del sistema, y a propósito: una foto cualquiera no garantiza
  contraste, así que el velo no puede depender del suelo.
- `.media-motif` es un motivo de marca, no un control. Va `aria-hidden` y no
  se puede pulsar.

### El marco

Un grupo enmarcado con el borde en acento, para cuando varias piezas forman
**una** decisión y hay que verlas como bloque:

```html
<section class="marco marco-duo">
  <div class="marco-head"> <h2>…</h2> <p>…</p> </div>
  <div class="opciones" role="group">
    <button class="opcion" aria-pressed="true">  <span>Base</span>
      <strong>Benchmark</strong> <small>Sin variación</small> </button>
    …
  </div>
</section>
```

**Se usa poco.** Si todo va enmarcado, el marco deja de significar.

### Las opciones

Un grupo de controles donde uno está elegido. El elegido va en **amarillo
lleno** con `--accent-ink` encima (8.8:1). Es el estado más visible del
sistema, y por eso se reserva para "esto es lo que estás viendo".

Se activa con `aria-pressed="true"` o con `.is-active`, así que el estado
visual y el accesible no se pueden desincronizar.

### El énfasis del titular

Una palabra destacada dentro de un titular, con `<em>`. Nunca con otra familia
ni con una itálica suelta: eso se lee como error, no como énfasis.

Cada suelo lleva su versión, y no por gusto:

| Suelo | Tratamiento | Por qué |
|---|---|---|
| Papel | Subrayado de acento | El amarillo da 1.3:1 como texto aquí |
| Tinta | El amarillo directo | Da 14.2:1, y es el énfasis que tenía el raza original |
| Impresión | Subrayado en tinte claro | El amarillo como texto sobre blanco da 1.4:1 |

Se decide con tres tokens (`--em-fg`, `--em-bg`, `--em-pad`) declarados en cada
bloque de suelo, y **una sola regla** los consume. Hubo tres reglas compitiendo
por esto, y ganaba la peor: una con lista de contenedores que imponía el
tratamiento de papel en los dos suelos. El resultado medido era un `<em>` con
el color de tinta y el subrayado de papel a la vez.

### Los iconos

Iconos **dibujados**, nunca glifos de texto. El juego vive en `adcom.js`, que
inyecta un `<symbol>` por icono una sola vez, y se usa así:

```html
<span class="go">Abrir
  <svg class="ico" aria-hidden="true"><use href="#i-abrir"></use></svg>
</span>
```

| Disponibles | |
|---|---|
| `i-abrir` | abrir, enlace externo |
| `i-bajar` `i-arriba` `i-abajo` `i-flecha` | dirección |
| `i-mas` `i-menos` | desplegar y plegar |
| `i-alerta` | advertencia |
| `i-buscar` `i-filtro` `i-tabla` | herramientas |
| `i-descargar` `i-imprimir` `i-cerrar` | acciones |
| `i-ruta` `i-grafico` `i-tendencia` `i-documento` `i-pieza` `i-reloj` | **tipo de documento**, para la ficha del índice |

Tamaños: `.ico` sigue al texto (`1em`), `.ico-sm` y `.ico-lg` lo ajustan.
Todos comparten lienzo de 16 y el mismo trazo, así que se pueden mezclar en
una línea sin que uno pese más que otro.

**El rótulo de texto siempre va al lado.** Los iconos son decorativos, van
`aria-hidden`, y si el JS no corre no aparecen: por eso ninguno puede ser el
único portador del significado. Un icono solo, sin texto, no se usa.

Añadir uno: un `<symbol id="i-nombre" viewBox="0 0 16 16">` en `adcom.js`, con
paths sin `fill` ni `stroke-width` (los pone `.ico` desde el CSS).

### El titular fuerte

| Token | Valor | Nota |
|---|---|---|
| `--fs-display` | `clamp(2.6rem,7vw,6rem)` | El techo son 6rem |
| `--tk-display` | `-.04em` | El piso. Por debajo las letras pierden su forma |
| `--lh-display` | `.95` | |

Se llega a "fuerte" con **tamaño, peso y copy corto**, no apretando el
tracking. Y el titular del índice se queda en 40 caracteres o menos: a 96px una
frase más larga llena el viewport sola.

---

## 3. El índice con categorías

La estructura de la puerta de entrada de cada cliente. Es el patrón que venía de
`cesde`, con lo que informaba y sin lo que no.

```html
<section class="opening wrap">
  <h1>Lo que sabemos de la <em>pauta de Corpas.</em></h1>
  <p class="lede">Cada informe responde una pregunta distinta de la cuenta.</p>

  <!-- las cifras de la cuenta van AQUÍ, una sola vez -->
  <div class="opening-meta">
    <div><b>$120,4M</b>inversión del semestre</div>
    <div><b>12</b>documentos publicados</div>
  </div>

  <nav class="categorias" aria-label="Categorías de documentos">
    <a href="#rutas">Rutas <b>4</b></a>
    <a href="#informes">Informes <b>6</b></a>
    <a href="#tableros">Tableros <b>2</b></a>
  </nav>
</section>

<section class="grupo wrap" id="rutas">
  <div class="grupo-head">
    <h2>Rutas</h2>
    <p>Estrategia, audiencias y guías de producción.</p>
  </div>

  <div class="shelf">
    <!-- la ficha: el documento y su enlace. Nada más. -->
    <a class="card card-breve" href="ruta-estrategica.html">
      <h3>Ruta estratégica 2027-1</h3>
      <span class="go">Abrir <svg …></svg></span>
    </a>
  </div>
</section>
```

### El índice aloja, no argumenta

Es la regla que gobierna todo lo de abajo. El índice es **el espacio donde
viven los documentos de la cuenta**, no una pieza que explique la cuenta.

| | |
|---|---|
| El título | **Genérico y estructural**: "Documentos de la cuenta". No un argumento ("Lo que sabemos del lanzamiento") ni una promesa |
| La entradilla | Una línea que nombra las categorías y el cliente. No un párrafo |
| Las cifras de la cuenta | **No van.** Viven en el documento que las sostiene |
| Las fechas | **No van.** Un índice con fechas envejece a la vista |
| La bajada de cada ficha | **No va.** El nombre del documento y su icono alcanzan |
| El pie de cada grupo | Nombra lo que hay dentro ("Inversión, etapas y canales"), no lo explica |

Referencias en la organización: el índice de **cesde** (título estructural más
categorías) y el de **catolica** (icono, nombre corto y flecha por ficha).

Reglas del índice:

- **El conteo se escribe a mano en el HTML** y `adcom.js` lo corrige contra el DOM.
  Si el JS no corre, el índice sigue completo; si alguien agrega una ficha y olvida
  subir el número, se arregla solo.
- **La ficha es un icono de tipo, el NOMBRE del documento y la flecha.**
  `.card-breve` y nada más. El nombre es corto y es el nombre, no una frase:
  "Flow digital", no "Cómo se invierten los US$655K". El icono da la identidad
  visual que antes cargaba la bajada.
- **`.opening-meta` no va en el índice.** Existe para la portada de un
  documento, donde las cifras son el tema. En un índice son ruido.
- **`.kind` O categorías, nunca los dos.** Si las fichas viven en un `.grupo`
  que ya se llama "Informes", repetir "Informe" en cada ficha no agrega nada.
  `.kind` es para un índice sin grupos, como el de genius.
- La versión larga de la ficha (`.card` con bajada y `<dl>`) sigue existiendo,
  pero es la excepción: un documento destacado, no el patrón del índice.
- **`.card.is-empty`** es el estado vacío de una categoría que aún no tiene nada.
  Existe, y dice cómo se llena.
- **El titular se queda en 40 caracteres o menos.** A 86px (el techo de
  `clamp(2.3rem,6vw,5.4rem)`) una frase más larga llena el viewport sola y no
  deja ver ni la primera categoría. El nombre del cliente ya está en el
  masthead, el `<title>`, el colofón y el pie: no hace falta repetirlo aquí.
- **Las categorías las decide el contenido del repo.** No hay lista fija. Las que
  se repiten en la organización: Rutas, Informes, Tableros, Diagnósticos,
  Implementación, Herramientas.

---

## 4. El vocabulario

Lo que existe. Si algo no está aquí, se construye con esto antes de inventar una clase.

**Suelo** · `data-suelo="papel|tinta"` · `.franja` · `.slab`
**Estructura** · `.wrap` `.band` `.grupo` `.head` `.divider` `.lede` `.note`
**Medios** · `.media` + `.media-4-5` `.media-1-1` `.media-16-9` `.media-motif`
**Grupos** · `.marco` `.marco-head` `.marco-duo` · `.opciones` `.opcion`
**Titular** · `.display` · `<em>` para el énfasis
**Iconos** · `.ico` `.ico-sm` `.ico-lg` + `<use href="#i-…">`
**Menú lateral** · `.app-shell` (en `body.con-shell`) `.app-sidebar` `.app-topbar` `.app-content`
**Cabecera** · `.masthead` `.wordmark` `.stamp` `.al-indice` `.skip-link`
**Portada** · `.opening` `.opening-meta`
**Índice** · `.categorias` `.grupo-head` `.shelf` `.card` + `.kind` `.go` `.is-empty`
**Prosa** · `.panel` `.panel-hi` `.duo` `.quote` `.orders` `.rules`
**Dato** · `.bars` `.share` `.ranges` `.chart` `.legend` `.figure` `.axis` · tablas sin clase
**Piezas** · `.works` `.work` `.work-stats`
**Cierre** · `.colophon` `.footer`
**Invertido** · `.slab` `.calls` `.call` `.verdict`
**Motion** · `.grow` (el JS le pone `.is-in`)

### Los contenedores

**Las cajas son el contenedor perezoso.** Solo la ficha del índice (`.card`) es una
caja, porque ahí la elevación dice algo: es un destino en el que se hace clic.

Todo lo demás se separa con una regla:

- `.panel` es prosa con una regla de 2px arriba. No es una caja.
- `.chart` no tiene fondo, ni borde, ni sombra. Es un título, el dibujo y un pie.
- `.quote` es una regla de acento y tipografía grande. No es un cartel amarillo.

**Una ficha dentro de una ficha es un error dos veces.** Las cifras de portada van en
`.opening-meta`, que es una fila separada por una regla, no una rejilla de tarjetitas.

### Los gráficos

El gráfico del sistema es `.bars`: una pista (`--sunken`), un relleno (`--ink`) y el
dato en `font-variant-numeric: tabular-nums`. No pesa, imprime bien y se lee sin leyenda.

Variantes del relleno: `.is-best` (`--accent-deep`), `.is-over` (`--neg`). Nada más.

Chart.js se usa solo cuando la forma del dato lo pide de verdad (series de tiempo
largas, dispersión). Va dentro de `.chart`, con `.chart-foot` explicando qué se mira.

### El menú lateral

Para un documento largo de **Operate** (una ruta estratégica, un tablero) que
necesita orientación constante: qué sección estoy viendo, cuántas faltan.
Varios documentos de educación ya traían este patrón, cada uno con su propio
CSS bespoke (`.sidebar`/`.sb-*`, `.sidebar-nav`, etc.); `.app-shell` es la
versión única del sistema.

```html
<body class="con-shell">
  <nav class="app-sidebar">
    <div class="app-sidebar-top">
      <a class="app-sidebar-brand" href="index.html"><i></i>Adcom</a>
      <div class="app-sidebar-client">
        <span class="app-sidebar-client-label">Cliente</span>
        <strong class="app-sidebar-client-name">…</strong>
        <span class="app-sidebar-client-period">…</span>
      </div>
    </div>
    <div class="app-sidebar-nav">
      <span class="app-sidebar-nav-title">Contenido</span>
      <a href="#s-reto"><b></b>El reto<small>01</small></a>
      …
    </div>
    <div class="app-sidebar-foot">Uso interno, no compartir sin autorización</div>
  </nav>
  <div class="app-main">
    <div class="app-topbar">
      <span class="app-topbar-crumb">Ruta estratégica</span>
      <span class="app-topbar-section">El reto</span>
    </div>
    <div class="app-content wrap"> … franjas, paneles, tablas normales del sistema … </div>
  </div>
</body>
```

**El riel es mueble, no contenido.** Va siempre oscuro (`--shell-*`, contraste
17.6:1 / 5.6:1 / 13.6:1), sin importar el suelo del documento: en el original
la sidebar ya era negra con el `.main` en blanco, y eso es justo el patrón que
`--shell-*` preserva. No es el mismo concepto que `.slab`: el slab es un
momento de contenido, una vez por documento; el shell es la estructura de
navegación, presente todo el tiempo que el documento tenga menú lateral.

`.app-content` es un `.wrap` normal: adentro se escribe con el vocabulario de
siempre (`.grupo`, `.panel`, `.bars`, tablas), y sigue el suelo que declare el
documento.

**Responsivo sin botón que descubrir.** Bajo 900px el riel no se esconde
detrás de un hamburguesa: se acuesta arriba como una franja angosta de
navegación horizontal. Sigue siendo la misma tabla de contenidos, en otra
forma. El original no tenía ningún colapso: la sidebar de 240px se quedaba fija
también en móvil.

`adcom.js` marca `.active` en el enlace de la sección visible y actualiza
`.app-topbar-section`. Sin JS el riel sigue siendo una tabla de contenidos que
funciona, solo sin el resaltado.

En impresión el riel desaparece completo: es orientación para una pantalla que
hace scroll, no tiene trabajo que hacer en papel.

### La forma del contenido heredado, cuando queda a la vista

El riel es mueble; el contenido de un documento migrado sigue siendo suyo, y
"solo el riel" no significa "cualquier cosa vale visualmente". Un documento
que trae su PROPIA escala de radios (`--radius-sm/-md/-lg/-xl` en 8/16/24/32px,
o cualquier variante) se siente pegado al lado del sistema, que es de dos
niveles: `--radius` (12px) y `--radius-sm` (8px). Es justo lo que hacía sentir
el primer documento migrado como "un póster pegado", no como parte de la casa.

**El arreglo es del token, no del contenido.** Un documento legado casi
siempre referencia su radio por variable (`var(--radius-md)`, `var(--r-lg)`…),
no en cada regla. Encontrar la declaración de esa variable en su propio
`:root` y apuntarla a `var(--radius)` del sistema colapsa TODOS sus usos de
una vez, sin tocar una sola regla de contenido:

```css
/* antes */
--radius-sm:8px; --radius-md:16px; --radius-lg:24px; --radius-xl:32px;

/* después: el sistema solo tiene dos niveles */
--radius-sm:8px; --radius-md:var(--radius); --radius-lg:var(--radius); --radius-xl:var(--radius);
```

Si el documento usa el mismo NOMBRE que el sistema (`--radius`), verificar
primero que el shell no lo consuma en ninguna regla propia (`grep "var(--radius)"`
sobre `.app-*` en `adcom.css`; hoy no lo hace, esos elementos usan valores
fijos) antes de bajar su valor local a 12px: el nombre puede repetirse sin
choque porque cada documento resuelve el suyo en su propio `:root`, siempre
que el shell no dependa de ese mismo nombre para sí mismo.

Esta es una verificación barata: correr el detector antes y después del
colapso y comparar el total. Si no cambia, el ajuste fue puramente de unidad,
no tocó estructura.

### La portada

La portada es la pieza que fija el carácter del documento. Es lo primero que se
ve y es donde se nota si un documento pertenece a la casa o no.

**Por qué las portadas quedaban distintas.** La portada que sirve de referencia
estaba escrita en `raza/styles.css`: la rejilla de dos columnas, los anillos y
el encuadre de la pieza gráfica vivían en UN repo. El vocabulario existía pero
no era del sistema, así que ningún otro documento podía parecerse. Ahora es
`.portada` en `adcom.css`, y `sync.ps1` la copia a `adcom-tokens.css` para que
también la puedan adoptar los documentos legados.

**Las tres cosas que hacían que una portada oscura se viera "pegada encima".**

| defecto | qué se ve | la regla |
|---|---|---|
| caja con borde redondeado y margen | un rectángulo negro flotando sobre una página clara | la portada es una FRANJA: se pinta a sangre y declara su suelo |
| titular sin marcador | un titular blanco y nada más | el amarillo va en un `<em>` sobre UNA PARTE del titular |
| el suelo no es el suelo | el fondo oscuro termina antes del borde | `data-suelo="tinta"` en la sección, no `background` en una caja |
| **la portada dentro de un envoltorio con `max-width`** | el suelo termina a 28px del borde: la caja negra otra vez | **la portada va FUERA del envoltorio, como hija directa del `<body>`** |

**El error que más cuesta ver.** Casi todos estos documentos envuelven todo su
contenido en un `<div class="wrap">{max-width:1180px;padding:32px 28px}`. Una
franja no puede sangrar desde dentro de ahí: por más que declare su suelo, el
fondo se corta donde acaba el envoltorio, y vuelve a leerse como un cartel
pegado encima. Al convertir, la portada SALE del envoltorio:

```html
<body>
<section class="portada" data-suelo="tinta"> … </section>   <!-- fuera -->
<div class="wrap">
  … el resto del documento …
</div>
```

Y ojo: `.wrap` existe también en el sistema. En un documento legado gana la
suya porque su `<style>` va después del enlace; no cambia nada visual, pero
conviene saberlo antes de tocar esa clase.

**Sobre el marcador y el contraste.** Donde las letras pisan el amarillo el
contraste es 1.30:1, porque el trazo arranca al 58% de la altura y el texto
sigue en `--fg`. Es deliberado: es un marcador, no un resalte macizo, y la
letra se lee por la parte de arriba, que va contra el suelo. Si en algún
documento se quisiera resalte macizo, el texto encima tiene que ir en
`--accent-ink` (8.8:1 en los dos suelos), no en `--fg`.

```html
<section class="portada" data-suelo="tinta">
  <div class="portada-copy">
    <span class="portada-kicker">Cliente · Tipo de documento</span>
    <h1>Hacer ruido. <em>Después, convertir.</em></h1>
    <p class="portada-lede">Una frase que ubica el documento. <b>Lo que importa, en negrita.</b></p>
    <div class="portada-acciones">
      <a class="button button-primary" href="#x">Explorar el flow</a>
      <a class="button button-ghost" href="#y">Ver canales</a>
    </div>
    <dl class="portada-cifras">
      <div><dt>Inversión neta</dt><dd>US$655K<small>contra qué se compara</small></dd></div>
    </dl>
  </div>
  <div class="portada-visual" aria-hidden="true">
    <figure class="media media-4-5 portada-pieza">
      <img src="…" alt="">
      <span class="media-motif"><i></i></span>
      <figcaption>UN RÓTULO CORTO</figcaption>
    </figure>
    <div class="orbita orbita-1"></div>
    <div class="orbita orbita-2"></div>
  </div>
</section>
```

**El `<em>` no es énfasis, es el marcador amarillo.** Va en la parte del titular
que carga el punto, nunca en todo: marcar todo no marca nada. Es un degradado
que arranca al 58% de la altura, así que se lee como trazo de marcador y no como
fondo, y lleva `box-decoration-break:clone` para cortarse bien al pasar de línea.

**Sin pieza gráfica**, se omite `.portada-visual` entero y la copia toma el
ancho: `.portada:not(:has(.portada-visual))` lo resuelve sola. No hay que dejar
una columna vacía ni buscar una foto de relleno.

**La portada es el TÍTULO.** Antetítulo, titular y una entradilla corta. Todo
lo demás es opcional, y la tira de cifras es la excepción antes que la regla.

| va en la portada | no va |
|---|---|
| antetítulo corto: cliente y tipo de documento | la fecha, el periodo y el detalle: eso es entradilla |
| el titular, con el marcador en una parte | un titular sin marcador, o marcado entero |
| una entradilla de una o dos frases | el resumen del documento |
| dos o tres cifras **si son el titular del documento** | cifras de relleno |

**Cuándo llevan cifras.** Solo cuando el documento tiene dos o tres números que
son su titular: la inversión ejecutada contra la meta, el cumplimiento, el CPL.
Si hay que estrujarse para llenar la tira —«1 vista por pieza», «22 programas»—
no va: eso es ruido en el sitio donde el lector busca de qué se trata. Los
datos se rinden más abajo, donde tienen su tabla y su contexto.

Es la misma regla del índice: **la portada aloja, no argumenta.**

**La tira de cifras va en `<dl>`**, con el número en `<dd>` y su comparación en
un `<small>` dentro del mismo `<dd>`. Los informes traían esa línea en
`rgba(255,255,255,.35)`, que sobre el suelo oscuro da 3.05:1; el componente la
pone en `--fg-muted`, que en tinta da 6.53:1.

El aire de la portada es **simétrico** (`var(--s-6)` arriba y abajo) justamente
porque las cifras son opcionales: si el aire de abajo se calcula suponiéndolas,
una portada de solo titular deja una franja vacía debajo.

**Convertir una portada legada:** renombrar el marcado a `.portada*` (los
nombres son nuevos a propósito: el CSS propio del documento no los conoce, así
que no hay pelea de sobrescritura) y borrar las reglas propias de la portada
vieja, que quedan muertas. Medido en el primer caso: 85 → 68 hallazgos, con
`low-contrast` de 9 a 2.

### El puente de tokens: cómo un documento legado adopta la paleta

Un documento de cliente ya escrito declara su propia paleta en su `:root`, y
todas sus reglas la referencian. Reapuntar esas declaraciones a los roles del
sistema cambia el documento entero **sin reescribir una sola de sus reglas**.
Es la palanca más grande que hay para estandarizar sin riesgo de maquetación.

Pero no se hace enlazando `adcom.css`. Esos documentos reciben
`adcom-tokens.css` (ver la cabecera de ese archivo): `adcom.css` trae reglas
sobre `table`, `img`, `h1..h4`, `p` y `a` que le moverían cosas que ya estaban
resueltas a mano.

**Paso 1, obligatorio: declarar el suelo de los bloques oscuros.**
Casi todos estos documentos son un suelo claro con bloques oscuros a mano (un
hero, un cierre, una cabecera de tabla). Su prosa tiene que resolver contra
tinta, y eso NO es una preferencia estética: está medido.

    Para pasar 4.5:1 sobre papel  (#f4f4f1) hace falta luminancia <= 0.1617
    Para pasar 4.5:1 sobre el bloque oscuro (#0A0A0A)          >= 0.1887

El techo está por debajo del piso: **no existe un gris único que sirva en los
dos suelos.** Es la razón de ser de los dos suelos. Así que primero:

```html
<div class="hero" data-suelo="tinta">
<section class="cierre" data-suelo="tinta">
```

Van los contenedores de CONTENIDO. Un control o una marca de color que fija su
propia pareja (una pestaña activa, una muestra de color, una celda que solo
lleva el amarillo) no lo necesita.

**Paso 2: los tokens de doble rol van al VALOR literal, no al rol.**
El error que hay que no repetir: en estos documentos `--white` pinta el texto
de los bloques oscuros *y* el fondo de las fichas claras. Mandarlo a
`var(--raised)` lo vuelve `#141413` dentro de un bloque en tinta: texto negro
sobre negro. Un token con dos roles no puede ir a un rol.

| token del documento | va a | por qué |
|---|---|---|
| `--white`, `--blanco` | `#fcfcfa` | el color de `--raised`, sin girar con el suelo |
| `--black`, `--negro` | `#050505` | el color de `--fg`, sin girar con el suelo |

**Paso 3: los tokens de prosa y de superficie van a rol.** Ahí el giro es
justamente lo que se busca.

| token del documento | va a |
|---|---|
| suelo de la página (`--gray-50`, `--bg`) | `var(--ground)` |
| superficie hundida (`--gray-100`, `--surface2`) | `var(--sunken)` |
| regla (`--gray-200`, `--border`) | `var(--rule)` |
| prosa secundaria (`--gray-600`, `--t2`) | `var(--fg-secondary)` |
| etiqueta apagada (`--gray-400`, `--t3`, `--muted`) | `var(--fg-muted)` |
| el dato que está mal (`--red`, `--no`) | `var(--neg)` |
| el dato que está bien (`--green`, `--ok`) | `var(--pos)` |
| la marca (`--yellow`, `--amarillo`) | `var(--accent)` |

Antes de mapear un token de superficie a rol, verificar que no se use DENTRO
de un bloque que pasa a tinta: ahí giraría al revés.

**Paso 4: el amarillo como texto sobre claro.** Al mapear `--yellow` a
`var(--accent)`, cualquier regla que lo use como `color:` sobre el suelo claro
queda en 1.43:1. Para eso está `--accent-fg` (4.95:1). Buscar
`color:var(--yellow)` y ver sobre qué se apoya cada uso.

**Lo que NO se toca:** marcas de terceros (`--meta`, `--google`, `--tiktok`,
`--uan-blue`), los tintes suaves (`--*-bg`, `--*-soft`, `--*-brd`), y los
escalones oscuros propios (`--gray-900`, `--dark2`): borrarlos junta dos capas
que el documento separaba a propósito.

**Verificación.** Detector antes y después, comparando POR TIPO y no solo el
total. Cuatro artefactos conocidos que NO son regresiones:

| artefacto | cómo se reconoce | cómo se comprueba |
|---|---|---|
| resuelve los tokens de `@media print`, no los de pantalla | reporta `#555` o `#333` como texto apagado | esos son los valores del bloque de impresión |
| reetiqueta | `border-accent-on-rounded` baja a 0 y `side-tab` sube lo mismo | son las MISMAS reglas con otro nombre |
| no resuelve `var()` ni `clamp()` en el padding | `cramped-padding` en un elemento que sí tiene padding | copiar el archivo y sustituir el `var()` por el literal: si el hallazgo desaparece, era esto |
| analiza regla por regla, sin el árbol del DOM | dice "sobre `#ffffff`" en texto que va dentro de un contenedor oscuro | mirar el `background` del contenedor y medir el par a mano |

Los dos últimos importan mucho aquí: un documento con bloques oscuros pintados
con `var()` acumula falsos positivos de contraste. Cuando el detector y la
medición a mano no coinciden, **manda la medición**.


### La escala de gráfico (cuando hacen falta colores)

El sistema tiene un solo acento, y eso alcanza para casi todo: `.bars` con una
pista y un relleno de tinta resuelve la mayoría de los gráficos de un informe.

Cuando un gráfico tiene **varias series a la vez** (barras apiladas, un donut,
un mapa de calor), hace falta una escala categórica. Reglas:

1. **Máximo 3 series con color.** Por encima de eso el lector no las separa.
   Si hay más entidades, se agrupan por lo que significan. En `raza` los 11
   canales del flow se agruparon en sus 3 objetivos, que además es el eje real
   del plan; el detalle por canal quedó en el ranking, las fichas y la tabla.
2. **La escala es esta, la pone el sistema, y no se improvisa.** Son los mismos
   tres hues, escalonados para cada suelo:

   | Ranura | Papel | Tinta |
   |---|---|---|
   | `--serie-1` azul | `#2a78d6` | `#3987e5` |
   | `--serie-2` naranja | `#eb6834` | `#d95926` |
   | `--serie-3` aqua | `#1baf7a` | `#199e70` |

   Un documento **no fija estos valores**: usa `var(--serie-1)` y sigue al suelo.

   Validadas sobre **todos** los pares con `scripts/validate_palette.js` de la
   skill `dataviz`: en papel ΔE 9.2 para daltonismo y 24.0 para visión normal;
   en tinta ΔE 9.4 y 20.9, y las tres pasan 3:1 contra el suelo oscuro.
3. **El amarillo de marca no entra a esta escala.** No es gusto: sobre papel da
   1.3:1 y sobre tinta se sale de la banda de luminosidad (lo comprobé con el
   validador). Y aunque pasara, si el amarillo fuera "serie 2" el lector no
   sabría cuándo el amarillo significa Adcom y cuándo significa Awareness.
4. **Texto encima de estos colores va en `--serie-fg`, que es tinta en los dos
   suelos.** Medido: el suelo claro encima de los tres da 2.9:1, 4.0:1 y 2.6:1,
   y falla. Tinta da 6.4 / 4.6 / 7.2:1 en papel y 5.6 / 5.3 / 6.0:1 en tinta.
5. **En papel las tres quedan por debajo de 3:1 contra el suelo**, así que el
   gráfico que las use lleva **leyenda, etiquetas directas de total y la tabla
   con los mismos datos**. La identidad nunca depende solo del color. En tinta
   las tres pasan, pero la regla se queda: es más barato que recordar cuándo
   aplica.
6. **Entre segmentos apilados van 2px del color del papel**, para que el borde
   se lea sin depender del color.

### El momento invertido

`.slab` es el suelo contrario: oscuro en una página de papel, claro en una de
tinta. **Se usa una vez por documento, o ninguna.**

Dos veces y el lector siente que cambió de sitio. Ese era el error concreto de
`raza`: oscuro, claro, oscuro. Es la regla que más importa de todo este documento.

Dentro de un `.slab` todo va por los tokens `--inv-*`, incluido el acento
(`--inv-accent`). Un `--accent` a pelo dentro de un slab claro da 1.3:1.

### El motion

**Un solo momento autorado en todo el sistema:** el dato se dibuja cuando su figura
entra en pantalla. Se marca con `.grow` en el contenedor de las barras.

No hay entradas idénticas en cada sección, ni bucles infinitos, ni parallax. Bajo
`prefers-reduced-motion: reduce` todo aparece ya dibujado.

---

## Cómo se verifica: midiendo el render, no el CSS

Durante mucho tiempo esto se comprobó leyendo hojas de estilo, y los números
no se podían creer. Un analizador de CSS no sabe contra qué fondo cae un
texto, no resuelve `var()` ni `clamp()`, y mezcla lo que declara `@media
print` con lo que se ve en pantalla.

Ahora se mide en un navegador de verdad. El documento se sirve en local, y
unas sondas leen del DOM lo que el lector ve: el color computado, el fondo
**compuesto** capa a capa hasta la primera opaca, el tamaño en píxeles ya
resuelto, y la regla que gana. Esa diferencia no es de precisión: es de
categoría. El primer día encontró que la columna «Canal» de la tabla de
inversión de raza salía **vacía**, con once nombres de canal invisibles, y
eso llevaba meses ahí.

Lo que se mide, por documento:

| Medida | Qué busca |
|---|---|
| Bajo contraste | Texto que no llega al mínimo contra su fondo real |
| Franja sin declarar | Un contenedor que pinta un suelo de otro polo y no lo dice |
| Microtexto | Texto por debajo del piso tipográfico |
| Versales | `text-transform:uppercase`, que esta casa no usa |

Tres cosas aprendidas sobre la medida misma, porque una medida equivocada es
peor que ninguna:

- **Un fondo semitransparente no es un fondo.** Hay que componerlo sobre lo
  que tiene debajo. Y `getComputedStyle` no siempre devuelve `rgb()`: con un
  color en espacio moderno devuelve `color(srgb 0.95 0.95 0.94 / 0.86)`, con
  los canales de 0 a 1. Leerlos como 0-255 daba un falso 1.02:1 en una
  cabecera perfectamente legible.
- **Una verificación que comparte el defecto con lo que verifica no verifica
  nada.** El primer barrido de versales usaba una búsqueda que exigía `;` al
  final de la declaración, y se pasaba por alto la última de cada bloque. La
  comprobación final usaba la misma búsqueda, así que informó «0 archivos» con
  161 elementos en versales delante. La comprobación debe venir de otro sitio:
  ahora la da el navegador.
- **Un fallo de sonda no puede pasar por documento correcto.** Una sonda que
  llegaba rota devolvía nada, el script lo tomaba por «sin hallazgos» y
  anunció «0 documentos oscuros» con siete secciones negras sin declarar. Los
  fallos se cuentan aparte y se enseñan.

## Etiqueta o prosa: la diferencia la hace lo que hay que leer

El piso tipográfico tiene dos valores, 12px para lo funcional y 12,8px para
la prosa, y decidir cuál toca no se puede hacer sólo por la etiqueta HTML.
Un `<p class="kind">Framework</p>` es un rótulo de una palabra. Se pide
además que haya algo que leer —unos veinticinco caracteres— antes de tratarlo
como prosa.

## La tabla es abierta

Sin caja, sin esquina redondeada y **sin cabecera de relleno oscuro**. La
estructura la da una regla de 1px bajo el encabezado, y el texto de cabecera
va en `--fg-muted`.

No es sólo cuestión de peso visual. `th{color:var(--fg)}` sobre
`background:var(--black)` es una trampa: `--fg` es un rol y se adapta al
suelo, pero el negro del fondo es un token del documento que la impresión no
adapta. Al imprimir, el fondo se queda negro y el texto se vuelve negro —
1.00:1, cabeceras invisibles en el papel que el cliente tiene en la mano.
Había 37 de estas cabeceras en 30 archivos.

Si la cabecera es pegajosa (`position:sticky`) sí lleva fondo, el del suelo:
sin él, el contenido se ve pasar por debajo.

## En el teléfono, una columna

A 390px el cuerpo del documento **no se desplaza en horizontal**. Sólo una
tabla, un diagrama o un bloque de código pueden ser más anchos que la
ventana, y cada uno dentro de su propio contenedor con `overflow-x:auto`.

Esto no se había comprobado nunca, y no se ve en una captura de escritorio:
al medirlo, **38 de 94 documentos** desbordaban, hasta 685px de más. Las
causas, por orden de tamaño:

| Causa | Arreglo |
|---|---|
| Una fila flexible que no envuelve (`flex-wrap:nowrap`) | `flex-wrap:wrap` y altura libre |
| Una rejilla de columnas fijas | `grid-template-columns:minmax(0,1fr)` en `@media (max-width:560px)` |
| Una tabla con `min-width:620px` sin contenedor propio | La tabla se convierte en su propio contenedor de scroll |
| Un panel fuera de pantalla con `right:-100%` | `transform:translateX(100%)`, que no ocupa sitio |

El último merece explicación: un cajón aparcado con `right:-100%` **sigue
ocupando espacio** y alarga el documento. Con `transform` no ocupa nada y la
animación de entrada es la misma.

Las reglas de colapso se escriben **sólo para los contenedores que midieron
desbordamiento**, dentro de un `@media` que no toca el escritorio. El corpus
tiene 587 rejillas de columnas fijas; convertirlas todas a `auto-fit` movía
composiciones que estaban bien.

Una trampa de la medición, por si se repite: `"nowrap"` **contiene** la
cadena `"wrap"`. Comprobar `/wrap/.test(flexWrap)` excluye exactamente las
filas que no envuelven, que son las que desbordan. Hay que comparar el valor
entero.

## 5. Lo que no se hace

Cada una de estas estaba en `raza`, y cada una tiene una razón, no un gusto.

| No | Por qué |
|---|---|
| **Alternar de suelo sin patrón** | Una franja aquí y otra allá, sin ritmo, es lo que hace sentir que cambiaste de sitio. Alternar con ritmo sí funciona: ver "Las franjas" |
| **Usar el marco para todo** | Si todo va enmarcado, el marco deja de significar |
| **Un fondo propio dentro de una franja que ya tiene fondo** | Son dos decisiones de fondo peleando. La isla sigue el suelo de su franja |
| **Fijar un color a mano en una capa de documento** | Deja de seguir al suelo y se rompe al cambiarlo, o al imprimir. Todo por token |
| **Eyebrow sobre un titular** | Si hace falta una etiqueta encima para entenderlo, el titular está mal escrito. `.eyebrow{display:none}` está en el CSS |
| **`01 / 02 / 03` numerando secciones** | El orden de Rutas → Informes → Tableros no le dice nada al lector. Los conteos de categoría sí, y esos se quedan |
| **Em-dash (`—`) y en-dash (`–`)** | `2026—2027`, `25 SEP—FEB`. Se usa guión normal: `2026-2027` |
| **Partir titulares con `<br>` + itálica** | `Una<br>estrategia.<br><em>Todos los<br>documentos.</em>`. El texto fluye y `text-wrap:balance` decide |
| **El amarillo como texto** | 1.3:1. Para eso están `--accent-deep` y `--accent-ink` |
| **Píldoras de estado** | `Disponible`, `Interactiva`. O el documento está publicado y aparece, o no aparece |
| **Contador con cero de relleno** | `02` no es un titular |
| **Cifras inventadas** | Todo dato en una ficha sale de la cuenta. Si no hay dato, no hay `<dl>` |
| **Emoji o glifo Unicode como icono** | Un `↗` o un `+` de texto se renderiza con la fuente de cada sistema: cambia de peso, de tamaño, y a veces sale en color de emoji. Ver "Los iconos" |
| **Ocultar un `<br>` con CSS** | Borra el salto **y el espacio**: `tiene<br>un` renderiza "tieneun". Los `<br>` arbitrarios se quitan del marcado |
| **`auto-fit` sin techo en una rejilla de texto** | A pantalla ancha salen seis columnas de 180px que nadie lee. Se declara el número de columnas |
| **Un valor de espacio a mano** | Ya hay un paso de la escala para cada trabajo. Un `clamp()` nuevo es un valor que nadie va a poder mantener |
| **Una regla de cierre entre dos franjas del mismo suelo** | Son dos separadores para la misma junta |
| **Un índice en suelo tinta** | El estante compite con lo que aloja. El índice es papel siempre |
| **Fechas, cifras o bajadas en la ficha del índice** | El índice aloja, no argumenta. Ver "El índice aloja" |
| **Centrar un bloque para que no se vea solo** | Queda igual de solo, en el medio. Se acerca al texto que lo justifica y se le da ancho máximo a su bloque |
| **Más de un bloque centrado por documento** | El centrado deja de significar "aquí se decide" |
| **Una acción sola debajo de su párrafo** | Va a su lado, alineada por abajo. Debajo y sola se lee como huérfana |
| **Un menú lateral bespoke por documento** | Ya existe `.app-shell`. Un CSS de sidebar nuevo es exactamente el problema que el sistema resuelve |
| **Un menú lateral sin colapso en móvil** | El riel se acuesta arriba a 900px, no desaparece detrás de un botón |
| **Tarjetas anidadas** | Ver "Los contenedores" |

---

## 6. Cómo cambiar algo

Todo pasa por `adcom/sistema/`. Después, `sync.ps1`.

```powershell
cd adcom\sistema
# editar adcom.css
.\sync.ps1                    # copia a todos los repos, muestra qué cambió
.\sync.ps1 -Repos cesde,raza  # solo a esos dos
.\sync.ps1 -DryRun            # qué haría, sin escribir nada
```

| Quiero cambiar | Edito |
|---|---|
| **El suelo de un documento** | El `<html>`: pongo o quito `data-suelo="tinta"`. Nada más. El `index.html` no: va en papel siempre |
| El amarillo | `--accent` y recalcular `--accent-ink` y `--accent-fg` de los dos suelos |
| Un color de un solo suelo | Ese token dentro de `:root` (papel) o de `[data-suelo="tinta"]` |
| Los colores de un gráfico de series | `--serie-1..3`, en los dos suelos |
| Un embudo o una escala de etapas | `--ramp-1..4`, en los dos suelos |
| El redondeo de las fichas o de las fotos | `--radius` |
| El redondeo de botones e inputs | `--radius-sm` |
| El tamaño del titular de portada | `--fs-display` (techo 6rem) |
| El suelo de una sección | `data-suelo` en esa sección, y `class="franja"` para que pinte y respire |
| El aire entre franjas | `--s-7` |
| Cualquier otro espacio | El paso de la escala que corresponda, nunca un valor a mano |
| El ancho del contenido | `--max` |
| La medida de lectura | `--measure` |
| Los márgenes laterales | `--gutter` |
| El radio de las fichas | `border-radius` en `.card` (hoy: 0, todo el sistema) |
| Cómo sale en PDF | El bloque `@media print`, al final del archivo |
| Un nombre de clase viejo | La capa de compatibilidad, al final |

**Si un cambio necesita tocar el HTML de varios repos, probablemente pertenece al CSS.**
Ese es el criterio para decidir si algo entra al sistema o se queda en un documento.

### Excepciones por cliente

El sistema es el mismo para todos: el amarillo de Adcom manda. Lo que un repo sí
elige es **su suelo**, y eso ya cubre casi toda la diferencia de carácter entre
un cliente y otro.

Si en algún momento un cliente necesita su propio acento, es una línea al final
de su HTML:

```html
<style>:root{--accent:#16835E; --accent-ink:#fff; --accent-fg:#0f5c42}</style>
```

Y hay que **medir los tres contrastes** antes, no elegirlos a ojo, y medirlos
contra el suelo que use ese repo. Hoy nadie tiene esta excepción, y conviene que
siga así.

---

## 7. Migrar un documento viejo

El CSS trae una capa de compatibilidad que neutraliza los nombres de clase heredados
(`.section-dark`, `.eyebrow`, `.document-card`, `.hero-stats`, `.library-hero`...).
Por eso migrar no es reescribir.

1. Borrar el `<style>` embebido del archivo.
2. Enlazar el sistema:
   ```html
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap">
   <link rel="stylesheet" href="assets/css/adcom.css">
   <script defer src="assets/js/adcom.js"></script>
   ```
   (con `../` delante si el archivo vive en `pages/`)
3. Elegir el suelo en el `<html>`. Si el documento venía con fondo oscuro,
   `data-suelo="tinta"` lo conserva sin pelear con el sistema.
4. Abrirlo y revisar tres cosas: que no haya quedado texto del mismo tono que su
   fondo, que las tablas no desborden, y que la vista de impresión salga limpia.
5. Quitar los em-dash y los `<br>` de los titulares, que son marcado y no CSS.
6. Cambiar los hex fijos de su CSS propio por tokens: si quedan colores a mano,
   el documento no sigue al suelo y sale mal impreso.
7. Cuando haya tiempo, cambiar sus clases por las canónicas y perder la muleta.

---

## 8. Accesibilidad

No es una capa que se agrega después: está en los tokens.

- Todo texto pasa **WCAG AA** (4.5:1). La prosa secundaria pasa AAA.
- `:focus-visible` con anillo de 2px en `--ink`, offset 3px. Nunca `outline:none`.
- `.skip-link` en cada documento, como primer hijo de `<body>`.
- Los contenedores con scroll horizontal (`.table-scroll`) son alcanzables con teclado.
- `prefers-reduced-motion: reduce` deja todo dibujado, no a medias.
- Selección, caret, scrollbar y anillo de foco están vestidos desde la paleta:
  son parte del diseño aunque no los dibujemos nosotros.
