# Adcom

Material interno del área digital de Adcom: el framework de operación, los tableros por cliente y
los diagnósticos de sector.

Todo es HTML estático. No hay build, ni dependencias, ni servidor: se abre haciendo doble clic en
`index.html`.

## Estructura

```
adcom/
├── index.html                    portal: intro y una fila por destino
├── clientes.html                 hub de tableros por cliente (Looker, Zoho, HTML)
├── acta-entrega-vacaciones.html  acta temporal de continuidad durante vacaciones
├── informes/                     diagnósticos de sector (educación superior)
├── tableros/                     tablero de educación (lee la hoja Consolidado Educación) e inversión de la agencia
├── banco-formatos/               plantillas HTML, hojas de trabajo e instructivo de replicación
├── guias/                        guía interactiva de cómo trabajamos con IA
├── playbook-creativo/            biblioteca visual de formatos y posibilidades de pauta
├── framework/                    framework del área digital · v0.3
│   ├── index.html                el documento completo, con herramientas interactivas
│   ├── assets/{css,js}           estilos y scripts del framework
│   ├── _archivo/                 versiones sustituidas y el .md fuente original
│   └── README.md                 cómo editarlo: dónde cambiar qué, utilidades, checklist
├── assets/css/adcom-v2.css       sistema de diseño v2 (fuente; ver abajo)
├── sistema/                      sistema v1 de los repos de cliente y su sync.ps1
└── README.md
```

Los `.html` de la raíz con nombre de informe o tablero (`tablero-educacion.html`,
`diagnostico-educacion.html`) son redirecciones a su ruta nueva.

## Sistema de diseño

Este repo usa el **sistema v2**: washi, sumi y un solo acento lima; Inter Tight para titulares y
cifras, Inter para el cuerpo. Sus valores vienen del artefacto «Adcom — Sistema de diseño» y viven
en `assets/css/adcom-v2.css`, que es la fuente: se edita ahí.

Lo mínimo que cumple toda página:

- Carga las fuentes locales (`assets/ds/fonts.css`, sin Google Fonts) y enlaza `adcom-v2.css?v=AAAAMMDD`
  (después del CSS viejo, si todavía lo usa).
- El encabezado lleva `.ad-marca`: el isotipo oficial (`assets/ds/logos/adcom-mark.png`) y el nombre del
  documento. Nunca «Adcom» escrito como si fuera el logotipo, ni logos de cliente.
- Fondo `washi`, texto `sumi`, líneas de 1 px en `piedra`. Nada de sombras ni degradados.
- La lima marca lo que se pulsa (`.ad-go`, `.ad-btn--accent`) y lo primero que hay que ver en cada bloque:
  la palabra clave del titular (`.ad-hl`), lo seleccionado o actual (`.is-on`, `aria-current`) y la cifra
  clave (`.ad-kpi--on`). Una marca por bloque, entre 4 y 10 por página. Siempre relleno con texto `sumi`;
  nunca texto, borde ni línea; en gráficos, con borde `sumi`. `.ad-estado--ok` es neutro: solo con `.is-on`
  se rellena.
- Una página no densa se compone en secciones: `.ad-sec` (aire entre secciones), fondos que alternan
  (claro, oscuro, noche), titular grande `.ad-sec-cab--grande`, la idea a un lado y la figura al otro
  (`.ad-split`), un diagrama protagonista con la lógica de esa página (`.ad-anillo`, `.ad-eje`, `.ad-suma`,
  `.ad-pasos`) y una banda de cierre `.ad-cierre`. Los tableros e informes de datos conservan fondo claro.
- La información se ordena con los componentes `ad-*` de `adcom-v2.css` (secciones 5b y 5c): tarjetas, filas,
  cifras, estados, tablas, lecturas, pasos, barras, marcadores, secciones y diagramas. No se escribe CSS suelto por página. Si falta
  una pieza, se crea en `adcom-v2.css` y se documenta en `banco-formatos/componentes.html`.
- Titulares en peso 500, cifras grandes en 300, etiquetas sin mayúsculas.
- Lo que se toca es redondo (píldora); lo que se lee es recto (4 px tarjetas, 6 px paneles).
- Foco visible de 2 px, objetivos táctiles de 44 px o más, contraste de texto de 4,5:1 o más.

`assets/css/adcom.css`, `adcom-tokens.css` y `assets/js/adcom.js` son copias del **sistema v1**
(amarillo, Poppins) que `sistema/sync.ps1` regenera para los repos de cliente: no se editan aquí.
Las páginas que aún los cargan los reciben con `adcom-v2.css` encima, que re-apunta sus tokens a v2.
Cuando v2 se apruebe para los clientes, `adcom-v2.css` pasa a `sistema/` y entra al sync.

Los enlaces a `adcom-v2.css`, `formatos.css` y `css/*.css` llevan `?v=AAAAMMDD`. Al cambiar uno de esos
archivos, sube ese número en las páginas que lo enlazan: sin él, el navegador (y GitHub Pages) siguen
sirviendo la hoja anterior y las páginas se ven sin los estilos de los componentes. Para verlo al momento
basta con recargar sin caché (Ctrl+Shift+R).

Cada pieza es autocontenida: `framework/` trae sus propios `assets/`, y los informes de la raíz
llevan su CSS embebido. Mover una carpeta no rompe a las demás.

El playbook creativo abre desde `playbook-creativo/index.html` y funciona con doble clic, sin servidor.
Sus fichas editoriales viven en `assets/data.js`; las referencias, en `assets/references.js`.

## Cómo agregar un destino al portal

1. Deja el archivo en la raíz (`kebab-case.html`) o en su propia carpeta si trae assets.
2. Duplica un `<li class="doc">` en `index.html` y ajusta número, etiqueta, título y `href`.
3. Súmalo a la tabla de estructura de este README.

## Convenciones

El Banco de formatos publica `banco-formatos/INSTRUCTIVO.md` como guía web y descarga local.
Después de actualizar el Markdown, ejecuta `node banco-formatos/actualizar-instructivo.mjs`
con el paquete `marked` disponible y versiona el `instructivo-web.js` generado.

- Los archivos de contenido usan `kebab-case`. Los documentos estándar de GitHub conservan su
  nombre convencional (`README.md`).
- Las carpetas `_archivo/` guardan lo sustituido, no lo vigente. Nada del sitio debe enlazar ahí.
- Los dumps de datos (`.json`, `.csv`, exports de plataformas) no van al repo: viven fuera y solo
  entra el informe ya construido. Ver `.gitignore`.
