# Lineamientos de diseño consolidados de los repositorios

> **Aviso:** en el repo `adcom` el estándar vigente es [`ESTANDARES-DISENO.md`](../ESTANDARES-DISENO.md) (sistema v2). Este documento describe el sistema anterior (amarillo y Poppins), que sigue vigente solo en los repos de cliente.

> Auditoría local: 15 de septiembre de 2026  
> Alcance: 17 repositorios locales vinculados a GitHub  
> Estado: consolidación descriptiva y normativa; no modifica los repositorios fuente

## 0. Alcance y criterio de autoridad

Este documento reúne los lineamientos explícitos, los tokens compartidos y los
patrones consistentes encontrados en los repositorios locales vinculados a
GitHub. No fue posible enumerar repositorios remotos no clonados porque GitHub
CLI no está instalado; por tanto, "todos" significa **todos los repositorios
GitHub disponibles localmente en este equipo**.

Se auditaron:

- `adcomgroupco/adcom`
- `adcomgroupco/betplay`
- `adcomgroupco/catolica`
- `adcomgroupco/cesde`
- `adcomgroupco/compensar`
- `adcomgroupco/corpas`
- `adcomgroupco/eia`
- `adcomgroupco/gana`
- `adcomgroupco/genius`
- `adcomgroupco/loyevo`
- `DanielAdcom98/otros`
- `adcomgroupco/raza`
- `adcomgroupco/ris`
- `adcomgroupco/uan`
- `adcomgroupco/westfield`
- `adcomgroupco/yajuego`
- `DanielAdcom98/Meta-Ads-CLI`, hoy Media Bridge

El repositorio externo `GongRzhe/Office-PowerPoint-MCP-Server` se excluyó.

### Orden de precedencia

Cuando dos fuentes se contradicen, aplicar este orden:

1. **Web nuevo y migraciones:** `adcom/sistema/DESIGN.md`,
   `adcom/sistema/adcom.css`, `adcom/sistema/adcom-tokens.css` y
   `adcom/sistema/adcom.js`. Es la fuente de verdad explícita y más reciente.
2. **Narrativa, datos, gráficos y presentaciones:**
   `Meta-Ads-CLI/docs/REPORT_DESIGN_SYSTEM.md` y
   `config/report_design_system.yaml`.
3. **Perfil explícito de cliente:** Westfield, Católica, Loyevo u otro perfil
   aprobado, sin sacrificar legibilidad, evidencia ni accesibilidad.
4. **CSS heredado de un documento:** sirve para entender su estado actual, no
   para crear una regla nueva.

### Conflictos resueltos

| Tema | Estándar anterior | Regla vigente |
| --- | --- | --- |
| Amarillo ADCOM | `#FFC000` en reporting histórico | `#FFD400`; `#FFC000` es deriva heredada |
| Radios | 18-24 px en editorial | 12 px para superficies/medios y 8 px para controles |
| Eyebrow sobre titular | Permitido en reportes | No usar en web canónica; el titular debe ubicarse solo |
| Tarjetas | Rejillas de cajas con sombra | Solo la ficha de índice es caja por defecto; prosa y gráficos se separan con reglas |
| Alineación centrada | Variante frecuente | Todo a la izquierda; un solo bloque centrado y es el cierre |
| Fechas con raya | `1 ene–31 ago` | En web canónica usar guion normal: `1 ene-31 ago` |

En PowerPoint se pueden conservar radios moderados y tarjetas cuando el medio
lo requiera, pero no deben trasladarse automáticamente al sistema web.

## 1. Idea rectora

ADCOM convierte datos de pauta en decisiones respaldadas por evidencia. Un
documento no es una colección de métricas ni una demostración de decoración.

Reglas de base:

- Una sección responde una pregunta principal.
- Un título comunica la lectura demostrable, no el nombre del gráfico.
- Una rejilla tiene una sola pieza dominante.
- Hecho, inferencia y recomendación se distinguen.
- Cada cifra se puede rastrear a fuente, periodo, filtros y definición.
- La marca del cliente puede cambiar apariencia, pero no legibilidad,
  trazabilidad, narrativa ni accesibilidad.
- Menos decoración, más evidencia.

## 2. Sistema visual canónico ADCOM

### 2.1 Los dos suelos

Cada documento elige un suelo en `<html>` y no lo cambia arbitrariamente:

```html
<html lang="es">                    <!-- papel -->
<html lang="es" data-suelo="tinta"> <!-- tinta -->
```

- **Papel:** lectura larga, informes, análisis e impresión frecuente.
- **Tinta:** pantalla, lanzamientos, flows y tableros con presencia.
- El `index.html` siempre va en papel: es un estante, no una pieza con carácter.
- Una sección puede cambiar de suelo con `.franja` y `data-suelo`, siempre de
  borde a borde y con un `.wrap` interior.
- Las franjas alternan con ritmo predecible y tienen contenido suficiente para
  funcionar como capítulos.
- Dos franjas consecutivas del mismo suelo son una sola franja; no duplicar
  aire ni regla de cierre.
- `.section-dark`/`.s-dark` equivalen a tinta y
  `.section-light`/`.s-light` a papel por compatibilidad.
- `.slab` es un momento invertido dentro de una franja. Se usa una vez por
  documento o ninguna; no es otro sistema de secciones.

Una decisión de suelo se expresa con tokens heredables, nunca con un selector
de ancestro que pueda alcanzar una franja anidada del suelo contrario. Los
alias deben redeclararse en cada suelo porque una variable que apunta a otra se
resuelve donde se declara.

### 2.2 Paleta semántica

#### Común

| Token | Valor | Uso |
| --- | --- | --- |
| `--accent` | `#FFD400` | Amarillo de marca |
| `--accent-hi` | `#FFDF3D` | Hover del acento |
| `--accent-ink` | `#3D3300` | Texto sobre relleno amarillo; 8,8:1 |

#### Papel

| Token | Valor | Uso |
| --- | --- | --- |
| `--ground` | `#F4F4F1` | Fondo de página |
| `--fg` | `#050505` | Titulares y prosa principal |
| `--fg-secondary` | `#4A4A47` | Prosa secundaria |
| `--fg-muted` | `#656560` | Etiquetas, pies y unidades |
| `--raised` | `#FCFCFA` | Superficie elevada |
| `--sunken` | `#E7E6E1` | Pistas y superficie hundida |
| `--rule` | `rgba(5,5,5,.13)` | Separador discreto |
| `--rule-strong` | `rgba(5,5,5,.88)` | Apertura de sección |
| `--accent-fg` | `#7D6800` | Amarillo como dato o texto |
| `--pos` | `#16693A` | Dato positivo cuando deba marcarse |
| `--neg` | `#C2261C` | Dato negativo |

#### Tinta

| Token | Valor | Uso |
| --- | --- | --- |
| `--ground` | `#050505` | Fondo de página |
| `--fg` | `#F4F4F1` | Texto principal; nunca blanco puro |
| `--fg-secondary` | `#AAA9A4` | Prosa secundaria |
| `--fg-muted` | `#949289` | Etiquetas, pies y unidades |
| `--raised` | `#141413` | Superficie elevada |
| `--sunken` | `#262624` | Pistas y superficie hundida |
| `--rule` | `rgba(244,244,241,.18)` | Separador discreto |
| `--rule-strong` | `rgba(244,244,241,.85)` | Apertura de sección |
| `--accent-fg` | `#FFD400` | Dato/acento; coincide con la marca |
| `--pos` | `#2FB574` | Dato positivo |
| `--neg` | `#FF6B6B` | Dato negativo |

No usar `#FFD400` como texto sobre papel: el contraste es aproximadamente
1,3:1. Usar `--accent-fg`; sobre relleno amarillo usar `--accent-ink`.

#### Escalas

Para orden o intensidad, no para identidades:

| Token | Papel | Tinta |
| --- | --- | --- |
| `--ramp-1` | `#E7E6E1` | `#262624` |
| `--ramp-2` | `#C4C3BC` | `#3F3E3B` |
| `--ramp-3` | `#9A9992` | `#6B6A64` |
| `--ramp-4` | `#4A4A47` | `#AAA9A4` |

Para gráficos de varias series, máximo tres colores:

| Serie | Papel | Tinta |
| --- | --- | --- |
| `--serie-1` azul | `#2A78D6` | `#3987E5` |
| `--serie-2` naranja | `#EB6834` | `#D95926` |
| `--serie-3` aqua | `#1BAF7A` | `#199E70` |

- El amarillo de marca no entra en la escala categórica.
- Texto sobre las series usa `--serie-fg: #050505`.
- Siempre acompañar color con leyenda o etiqueta directa y tabla equivalente.
- Separar segmentos apilados con 2 px del color del suelo.

### 2.3 Tipografía

- Familia base: `Poppins, ui-sans-serif, -apple-system, "Segoe UI", sans-serif`.
- No usar más de dos familias; una segunda solo entra mediante perfil aprobado.
- Display: `clamp(2.6rem, 7vw, 6rem)`, tracking mínimo `-.04em`, línea `.95`.
- El titular fuerte se consigue con tamaño, peso y copy corto, no comprimiendo
  letras.
- Titular del índice: máximo 40 caracteres.
- Piso funcional: `--fs-min: .75rem` (12 px).
- Piso de prosa/notas: `--fs-body-min: .8rem` (12,8 px).
- `<small>` no puede caer por debajo del piso.
- Etiquetas breves pueden usar el piso funcional; si hay algo que leer, usar el
  piso de prosa.
- Todo se alinea a la izquierda. Solo el cierre puede ser el bloque centrado.
- `<em>` dentro de un titular es el marcador: subrayado amarillo en papel,
  amarillo directo en tinta y subrayado claro al imprimir. No usar itálica
  suelta ni otra familia.
- El texto fluye; no partir titulares con `<br>`.
- No usar versales sistemáticas ni `text-transform: uppercase` como lenguaje
  general.

### 2.4 Espacio, medida y forma

| Token | Valor | Trabajo |
| --- | --- | --- |
| `--s-1` | `4px` | Icono a texto |
| `--s-2` | `8px` | Etiqueta a dato |
| `--s-3` | `14px` | Elementos dentro de una pieza |
| `--s-4` | `clamp(18px,2.4vw,26px)` | Ficha a ficha |
| `--s-5` | `clamp(26px,3.4vw,44px)` | Bloque a bloque |
| `--s-6` | `clamp(44px,6vw,84px)` | Apertura de sección/portada |
| `--s-7` | `clamp(72px,8vw,128px)` | Entre franjas |
| `--s-col` | `clamp(24px,4vw,64px)` | Columnas anchas |

- Medida de lectura: `--measure: 68ch`.
- Ancho máximo: `--max: 1240px`.
- Gutter: `--gutter: clamp(20px,5vw,72px)`.
- Más espacio arriba de un encabezado que abajo.
- No inventar valores de espacio si un paso existente cumple el trabajo.
- Superficies y medios: `--radius: 12px`.
- Controles compactos: `--radius-sm: 8px`.
- Barras, pistas, embudos y celdas: radio 0.
- Un borde de acento no se combina con una esquina redondeada en ese lado.
- Sombras escasas. La estructura se expresa con superficie, regla y espacio.

### 2.5 Contenedores y composición

- La caja es excepcional. La ficha clicable del índice es caja porque la
  elevación comunica destino.
- `.panel`: prosa con regla superior de 2 px, no tarjeta.
- `.chart`: título, dibujo y pie; sin fondo, borde ni sombra.
- `.quote`: regla de acento y tipografía grande; no cartel amarillo.
- No anidar tarjetas.
- `.marco` agrupa varias piezas que forman una decisión; se usa poco.
- Una acción primaria seleccionada usa amarillo lleno y `--accent-ink`.
- El estado visible de una opción debe corresponder con `aria-pressed="true"`
  o `.is-active`.
- Una acción no queda huérfana debajo de su párrafo: va junto al texto que la
  justifica y alineada por abajo.

### 2.6 Portada

- Es una franja a sangre, hija directa de `<body>`, nunca una caja oscura dentro
  de un wrapper con ancho máximo.
- Incluye antetítulo corto, titular con marcador en una parte y una entradilla
  de una o dos frases.
- Acciones, pieza visual y cifras son opcionales.
- Dos o tres cifras solo si son el titular del documento, no para llenar sitio.
- Sin pieza visual, la copia ocupa todo el ancho; no dejar una columna vacía.
- El aire vertical es simétrico con `--s-6`.
- La pieza gráfica conserva proporción y puede usar `.media-4-5`, `.media-1-1`
  o `.media-16-9`.
- El `figcaption` vive dentro de la imagen sobre velo oscuro.
- Los motivos decorativos usan `aria-hidden="true"`.

### 2.7 Índice de cliente

- Siempre en papel.
- Es un estante: aloja documentos, no argumenta sobre la cuenta.
- Título estructural y corto; entradilla de una línea.
- Categorías según el contenido real: Rutas, Informes, Tableros,
  Diagnósticos, Implementación o Herramientas.
- La ficha breve lleva icono de tipo, nombre del documento y acción de abrir.
- No incluir fecha, cifras, bajada, estado “Disponible” ni promesas.
- No repetir el tipo de documento si la categoría ya lo expresa.
- Los conteos se escriben en HTML y el JS los corrige contra el DOM.
- La ficha larga con bajada y datos es una excepción para un destacado.
- Debe existir estado vacío cuando una categoría aún no contiene documentos.

### 2.8 Menú lateral

- Usar `.app-shell`; no crear una sidebar distinta por documento.
- El riel es mueble y siempre oscuro mediante `--shell-*`.
- El contenido interior sigue usando el vocabulario normal del sistema.
- Bajo 900 px el riel se vuelve una banda horizontal; no se oculta detrás de
  un control que el lector deba descubrir.
- En impresión desaparece.
- El JS resalta la sección visible, pero sin JS sigue funcionando como tabla de
  contenidos.
- Al migrar contenido heredado, colapsar escalas de radio locales hacia 12/8 px
  mediante tokens, no reescribiendo cada componente.

### 2.9 Tablas y gráficos

#### Tabla

- Abierta: sin caja, esquina redondeada ni cabecera negra.
- Regla de 1 px bajo el encabezado; encabezado en `--fg-muted`.
- Texto a la izquierda y números a la derecha.
- Unidades visibles y consistentes.
- Total diferenciado una sola vez.
- Sticky header solo con fondo del suelo.
- En móvil, scroll horizontal dentro de su propio contenedor alcanzable por
  teclado; el cuerpo de la página nunca debe desplazarse lateralmente.
- En vista ejecutiva mostrar ranking relevante; el detalle puede ir a anexo,
  acordeón o descarga.

#### Gráfico

- Título como pregunta o conclusión demostrable.
- Periodo, unidad, fuente y nota metodológica.
- Resumen accesible y lectura escrita junto al gráfico.
- Barras horizontales para categorías, línea para tiempo, apiladas para
  composición, bullet/progreso para meta, dispersión para relación y funnel
  solo si las etapas comparten población.
- Barras simples: pista `--sunken`, relleno `--fg`; mejor dato
  `--accent-fg`, exceso/problema `--neg`.
- Chart.js solo cuando la forma del dato lo exige.
- Evitar 3D, doble eje sin justificación, arcoíris, donuts con más de cinco
  partes, ejes truncados engañosos y etiquetas inclinadas difíciles de leer.

### 2.10 Medios, iconos y motion

- Una imagen informativa es una pieza con proporción, pie y propósito.
- Una captura debe señalar qué mirar con uno o dos pines/anotaciones.
- Iconos dibujados en SVG, nunca emoji ni glifo Unicode.
- El icono acompaña un rótulo de texto, usa `aria-hidden` y nunca es el único
  portador de significado.
- Todos los iconos comparten lienzo de 16 y el mismo trazo.
- Único motion autorado: el dato se dibuja al entrar en pantalla con `.grow`.
- Sin entradas repetidas, bucles infinitos ni parallax.
- `prefers-reduced-motion` muestra todo ya dibujado.

### 2.11 Vocabulario canónico

```text
Suelo:       data-suelo="papel|tinta" .franja .slab
Estructura:  .wrap .band .grupo .head .divider .lede .note
Medios:      .media .media-4-5 .media-1-1 .media-16-9 .media-motif
Grupos:      .marco .marco-head .marco-duo .opciones .opcion
Titular:     .display y <em>
Iconos:      .ico .ico-sm .ico-lg y <use href="#i-…">
Shell:       .app-shell .app-sidebar .app-topbar .app-content
Cabecera:    .masthead .wordmark .stamp .al-indice .skip-link
Portada:     .portada .portada-wrap .portada-copy .portada-visual
Índice:      .opening .categorias .grupo-head .shelf .card .kind .go .is-empty
Prosa:       .panel .panel-hi .duo .quote .orders .rules
Dato:        .bars .share .ranges .chart .legend .figure .axis
Piezas:      .works .work .work-stats
Cierre:      .colophon .footer
Invertido:   .slab .calls .call .verdict
Motion:      .grow .is-in
```

## 3. Narrativa de informes y presentaciones

### 3.1 Secuencia recomendada

1. Portada y alcance: cliente, informe, periodo, plataformas, moneda y fecha.
2. Resumen ejecutivo: tres a cinco resultados y una lectura principal.
3. Objetivo y contexto.
4. Resultado consolidado: inversión, entrega y resultado de negocio.
5. Evolución temporal.
6. Diagnóstico por medio, campaña, audiencia, geografía o pieza.
7. Creatividad y calidad.
8. Decisiones priorizadas.
9. Metodología, fuentes, filtros, atribución y limitaciones.

Una lámina comunica una idea. Una sección web puede contener varios componentes
solo si todos responden la misma pregunta.

### 3.2 Títulos y evidencia

- Preferir “Search concentró el 61% de las conversiones” sobre “Resultados por
  campaña”.
- No formular una conclusión si los datos no la demuestran.
- Si falta evidencia, usar título descriptivo y declarar la limitación.
- No usar “excelente”, “significativo” o “exitoso” sin benchmark o umbral.
- No repetir en prosa todos los valores del gráfico.

### 3.3 KPI, insights y decisiones

- KPI: valor, nombre de métrica y contexto/denominador/comparación.
- Mostrar tres a seis KPI por bloque y solo uno acentuado.
- Insight: hallazgo, evidencia cuantitativa, interpretación e implicación.
- Callout: una decisión o alerta, título breve y máximo un párrafo o cuatro
  bullets.
- Recomendación: verbo de acción, evidencia, KPI afectado, prioridad P1/P2/P3,
  horizonte y responsable cuando sea operativo.

### 3.4 Formato de datos

- Miles con punto: `12.450`.
- Decimales con coma: `3,7%`.
- COP: `$12.450.000` o `COP 12.450.000`, sin alternar estilos.
- Un decimal en porcentajes; dos solo si cambian la lectura.
- Diferenciar puntos porcentuales de variación porcentual.
- Toda comparación declara base y periodo.
- No sumar alcance entre campañas/anuncios sin advertir duplicación.
- Fechas estructuradas: ISO `YYYY-MM-DD`.
- Fechas visibles web: guion normal, por ejemplo `1 ene-31 ago 2026`.

### 3.5 Presentación 16:9

- Lienzo: `13.333 × 7.5 in`.
- Margen izquierdo aproximado: `0.62 in`.
- Pie cerca de `y = 7.04 in`.
- Portada: 40-46 pt.
- Título: 26-30 pt.
- Título de tarjeta: 14-18 pt.
- KPI: 24-40 pt.
- Cuerpo: 10-12 pt.
- Pie: 7,5-8 pt.

## 4. Perfiles por repositorio y cliente

### 4.1 Repositorios bajo el sistema ADCOM

Trece repositorios contienen una copia idéntica de
`assets/css/adcom-tokens.css`: `adcom`, `betplay`, `catolica`, `cesde`,
`compensar`, `corpas`, `eia`, `gana`, `genius`, `raza`, `ris`, `uan` y
`yajuego`. La copia se genera desde `adcom/sistema`; no se edita localmente.

| Repositorio | Perfil y estado observado |
| --- | --- |
| `adcom` | Fuente canónica. Índices en papel; framework del área digital en tinta. |
| `betplay` | Papel, Poppins y negro-amarillo. Reporting histórico con radio amplio; converger a 12/8 px al migrar. |
| `catolica` | Web compartida ADCOM. Para reportes institucionales se admite perfil azul/navy/amarillo descrito abajo. |
| `cesde` | Papel, alta densidad de reportes y CSS por formato. Reutilizar tokens; los CSS de página solo resuelven composiciones realmente distintas. |
| `compensar` | Papel; documentos largos con navegación lateral. Migrar sidebars locales a `.app-shell`. |
| `corpas` | Papel; reporting compacto y rutas. Tinta local observada es legado, no un nuevo tema. |
| `eia` | Papel; portales multiperiodo. Colores de plataforma son datos de terceros, no paleta ADCOM. |
| `gana` | Papel. Apariciones de `#FFC000` son deriva histórica; usar `#FFD400`. |
| `genius` | Referencia de organización, contenedores y gráficos. Suelo papel con alternancia controlada. |
| `raza` | Referencia del carácter tinta; también anti-referencia de alternancia y estructura antigua. `flow-digital` y `tendencias-busqueda` usan tinta. |
| `ris` | Papel y sistema compartido; mantener composición simple. |
| `uan` | Papel; colores Google/Meta son series o marcas de plataforma, no tokens de identidad. `#FFC000` es legado. |
| `yajuego` | La mayoría de documentos de auditoría/flow usa tinta; el índice permanece en papel. Reemplazar colores oscuros locales por roles del suelo al migrar. |

### 4.2 Perfiles de cliente aprobados para reporting

#### Católica

- Tipografía: Poppins.
- Azul `#0866AD`, navy `#1B2A5B`, amarillo `#FECE00`.
- Papel `#F4F5F5`, fondo `#F0F0F0`, línea `#E0E0E0`.
- Texto `#272727`, muted `#666666`.
- Positivo `#1E7A46`, negativo `#C00000`.
- Cabecera con periodo y logos ADCOM/cliente.
- KPI institucional puede ser bloque azul con valor blanco.

#### CESDE

- Extiende ADCOM reporting.
- Radio histórico 12 px y radio grande 18 px.
- Hero claro con panel de análisis oscuro y borde izquierdo amarillo.
- Etiqueta de sección amarilla solo en outputs históricos de reporting; para
  web canónica preferir la jerarquía sin eyebrow.

#### BetPlay

- Extiende ADCOM reporting.
- Hero oscuro y círculos amarillos sobrios.
- Navegación sticky tipo píldora cuando es un control real.
- Los radios históricos 22/28 px se normalizan a 12/8 px en web nuevo.

#### Genius y Raza

- Extienden ADCOM editorial.
- Genius puede usar azul `#315CFF` como comparación.
- Raza usa papel `#F4F4F1` o tinta `#050505` con acento `#FFD400`.
- La alternancia de superficies debe seguir un patrón, nunca ser decorativa.

#### Compensar, Corpas y EIA

- Compensar: shell histórico de 240 px; el componente canónico responde bajo
  900 px.
- Corpas: tinta histórica `#1A1A1A`, papel `#F5F5F5`; nuevos documentos usan
  los roles canónicos.
- EIA: shell histórico de 260 px; Meta `#1877F2`, Google `#EA4335`; estados
  positivo `#22C55E`, atención `#F59E0B`, negativo `#EF4444`.

### 4.3 Westfield: sistema de cliente independiente

Westfield no enlaza el sistema compartido en su estado actual. Su perfil de
marca es válido para outputs propios:

- Titulares: Libre Caslon Text; fallback Georgia.
- Cuerpo: Sora; fallback Arial/sans-serif.
- Dorado/acento: `#D98E04`.
- Azul: `#023373`; azul profundo: `#010D26`.
- Tinta/navy: `#011640`; texto: `#26355D`.
- Muted: `#8A91A3`; línea: `#E6E8EE`; papel: `#F7F8FB`.
- Apoyos: gris `#C7CCD9`, terracota `#CD6552`, arena `#DEAA70`.
- Radio: 10 px.
- Sombras suaves con tinte navy.
- Hero navy con acento dorado y títulos serif editoriales.
- Motivo de fondo: contorno sutil de escudo.

Algunas páginas recientes usan Syne, DM Sans y DM Mono. Se consideran una
subfamilia heredada para tableros concretos; no mezclarla con Libre Caslon/Sora
en una misma pieza sin una decisión explícita de marca.

Las reglas de evidencia, accesibilidad, datos, responsive e impresión siguen
siendo ADCOM aunque la apariencia sea Westfield.

### 4.4 Loyevo: sistema autónomo excluido del sync

`loyevo` está excluido expresamente del sistema compartido por decisión interna.
Su lenguaje observado es:

- Poppins.
- Rosa `#ED0A78`, rosa oscuro `#C6005F`, wash `#FFF0F7`.
- Tinta `#111827`, papel `#FBFAFB`, muted `#6B6872`, línea `#E8E5EA`.
- Verde semántico `#11875D`.
- Radio principal 22 px.

Mantenerlo autónomo. Si se formaliza, extraer sus estilos inline a una fuente de
verdad propia antes de crear más documentos.

### 4.5 `otros`: borrador, no estándar

El repositorio está excluido del sistema. Su única pieza observada usa Inter y
una paleta cálida (`#F7F3EA`, `#FFFDF8`, `#C7773C`, `#2F6B59`, `#315C7A`).
Documentar como experimento; no reutilizar como guía de cliente ni ADCOM.

### 4.6 Media Bridge / Meta-Ads-CLI

Es la fuente de reglas narrativas, perfiles de reporting, diseño de decks y
generadores. No redefine el sistema web. Sus responsabilidades de diseño son:

- entrada de datos y trazabilidad;
- selección de tema por tipo de informe y cliente;
- narrativa y componentes analíticos;
- formato colombiano;
- accesibilidad, responsive e impresión;
- checklist de aprobación.

## 5. Accesibilidad, responsive e impresión

- Todo texto normal pasa WCAG AA; la prosa secundaria apunta a AAA.
- `:focus-visible`: anillo de 2 px, offset de 3 px; nunca `outline: none`.
- `.skip-link` como primer hijo de `<body>`.
- Controles y contenedores con scroll son operables por teclado.
- Imágenes informativas tienen `alt`; decorativas, `alt=""`.
- El color nunca es la única señal.
- No esconder información crítica tras hover.
- A 390 px el cuerpo no desborda horizontalmente.
- Filas flexibles envuelven; rejillas fijas colapsan a una columna donde se
  haya medido desbordamiento.
- Tablas, diagramas y código pueden desplazarse dentro de su contenedor.
- Un panel fuera de pantalla usa `transform`, no `right: -100%`.
- En impresión: fondo blanco, sin sombras, controles ocultos, detalles
  abiertos, navegación lateral fuera, secciones oscuras adaptadas a papel y
  sin cortes dentro de título, tarjeta, fila, gráfico o flow.
- `prefers-reduced-motion` desactiva animación no esencial.

## 6. Lo que no se hace

- Alternar suelos sin patrón.
- Poner un fondo propio dentro de una franja que ya decidió el suelo.
- Fijar colores de identidad a mano en la capa de documento.
- Usar el amarillo de marca como texto sobre papel.
- Crear un acento de cliente sin medir `accent`, `accent-ink` y `accent-fg`.
- Numerar secciones como `01 / 02 / 03` por decoración.
- Usar raya em/en en fechas o rangos del sistema web; usar guion normal.
- Partir titulares con `<br>` o esconder esos saltos con CSS.
- Usar emoji/glifo como icono.
- Usar píldoras para estados editoriales como “Disponible”.
- Inventar cifras para llenar portada o ficha.
- Usar `auto-fit` sin techo en rejillas de texto.
- Crear nuevos valores de espacio si existe un token apropiado.
- Cerrar con regla una franja seguida por otra del mismo suelo.
- Poner el índice en tinta.
- Añadir fechas, cifras o bajadas a cada ficha del índice.
- Centrar bloques para disimular que están aislados.
- Centrar más de un bloque por documento.
- Dejar una acción sola debajo de su explicación.
- Crear una sidebar particular por documento.
- Anidar tarjetas.
- Usar el marco, la sombra o el amarillo en todas partes.
- Usar 3D, arcoíris o doble eje sin justificación.
- Inventar métricas, benchmarks, causalidad, fuentes o definiciones.

## 7. Migración y gobierno

### 7.1 Fuente de verdad

Todo cambio web global ocurre en `adcom/sistema/` y luego se distribuye con:

```powershell
cd adcom\sistema
.\sync.ps1 -DryRun
.\sync.ps1
```

Las copias de `assets/css/adcom.css`, `adcom-tokens.css` y `assets/js/adcom.js`
se sobrescriben. No editarlas en los repositorios cliente.

### 7.2 Documento nuevo

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="assets/css/adcom.css">
<script defer src="assets/js/adcom.js"></script>
```

- Elegir el suelo en `<html>`.
- Usar `adcom.css` para marcado nuevo.
- Si el archivo vive en `pages/`, ajustar rutas con `../`.
- El índice va en papel.

### 7.3 Documento heredado

Usar `adcom-tokens.css`, no `adcom.css`, cuando el documento ya tiene reglas
globales para tablas, imágenes, titulares, párrafos y enlaces. Después:

1. Declarar `data-suelo="tinta"` en bloques oscuros de contenido.
2. Mapear tokens de prosa/superficie a roles semánticos.
3. Mantener tokens de doble rol (`--white`, `--black`) en valores literales si
   también pintan texto y superficies opuestas.
4. No tocar colores de marcas de plataforma ni tintes funcionales sin razón.
5. Buscar amarillo usado como `color:` sobre papel y reemplazarlo por
   `--accent-fg`.
6. Quitar colores fijos, `<br>` de titulares y rayas tipográficas heredadas.
7. Revisar contraste, móvil e impresión con render real.
8. Migrar nombres de clases a los canónicos cuando sea seguro.

### 7.4 Verificación

Medir el render en navegador, no confiar solo en lectura de CSS. Revisar:

- contraste contra el fondo compuesto real;
- bloques oscuros sin suelo declarado;
- texto bajo 12/12,8 px;
- versales sistemáticas;
- desbordamiento a 390 px;
- foco y navegación por teclado;
- impresión/PDF;
- fallos del propio detector como categoría separada.

Una excepción de cliente se registra como perfil; no se repite inline. Un
componente nuevo debe resolver una necesidad analítica distinta. Si solo cambia
el mes, cliente, color o dato, es una variante.

## 8. Checklist de aprobación

### Datos

- [ ] Periodo, fuente, cuenta, filtros, moneda, zona horaria y actualización visibles.
- [ ] Totales y métricas derivadas reconciliados.
- [ ] Atribución, cobertura y deduplicación explicadas.
- [ ] No hay cifras, causas ni benchmarks inventados.

### Narrativa

- [ ] El resumen ejecutivo cabe en una pantalla o lámina.
- [ ] Cada sección responde una pregunta.
- [ ] Los títulos comunican una lectura demostrable.
- [ ] Las recomendaciones tienen evidencia, prioridad y horizonte.

### Diseño

- [ ] Se aplicó el sistema o un perfil aprobado.
- [ ] El suelo está declarado y las franjas alternan con ritmo.
- [ ] Poppins es la base salvo perfil explícito.
- [ ] Solo una pieza domina cada rejilla.
- [ ] Colores, espacios, radios y estados consumen tokens.
- [ ] Tablas, gráficos y creativos tienen contexto y lectura.
- [ ] No hay tarjetas anidadas ni decoración sin función.
- [ ] No hay solapamientos, desbordes ni microtexto.

### Experiencia

- [ ] Contraste, foco, `alt` y teclado revisados.
- [ ] Vista móvil revisada a 390 px.
- [ ] Impresión/PDF limpia y sin gasto de tinta innecesario.
- [ ] `prefers-reduced-motion` funciona.
- [ ] Versión, fecha y responsable visibles.

## 9. Mapa de fuentes

| Fuente | Papel |
| --- | --- |
| `adcom/sistema/DESIGN.md` | Norma web canónica y decisiones de diseño |
| `adcom/sistema/adcom.css` | Componentes y compatibilidad |
| `adcom/sistema/adcom-tokens.css` | Puente de tokens para documentos heredados |
| `adcom/sistema/adcom.js` | Iconos, conteos, shell y motion progresivo |
| `adcom/framework/` | Origen del lenguaje tinta y composición digital |
| `Meta-Ads-CLI/docs/REPORT_DESIGN_SYSTEM.md` | Narrativa y calidad de informes |
| `Meta-Ads-CLI/config/report_design_system.yaml` | Valores estructurados y perfiles de cliente |
| `Meta-Ads-CLI/media_bridge/reporting/deck_style.py` | Implementación de presentaciones |
| `westfield/assets/css/shared.css` | Lenguaje visual propio de Westfield |
| HTML/CSS de los repos cliente | Evidencia de implementación y legado |

---

**Conclusión operativa:** para cualquier pieza nueva, empezar por el sistema
ADCOM canónico, añadir la capa narrativa de reporting y aplicar un perfil de
cliente solo si está documentado. No copiar estilos de una página heredada como
punto de partida.
