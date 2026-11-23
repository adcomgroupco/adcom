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
`diagnostico-educacion.html`, `inversion-agencia.html`) son redirecciones a su ruta nueva.

## Sistema de diseño

Este repo usa el **sistema v2**: washi, sumi y un solo acento lima; Inter Tight para titulares y
cifras, Inter para el cuerpo. Sus valores vienen del artefacto «Adcom — Sistema de diseño» y viven
en `assets/css/adcom-v2.css`, que es la fuente: se edita ahí.

Lo mínimo que cumple toda página:

- Carga Inter Tight e Inter y enlaza `adcom-v2.css` (después del CSS viejo, si todavía lo usa).
- Fondo `washi`, texto `sumi`, líneas de 1 px en `piedra`. Nada de sombras ni degradados.
- La lima solo como relleno con texto `sumi`, nunca como texto ni línea. Una por pantalla.
- Titulares en peso 500, cifras grandes en 300, etiquetas sin mayúsculas.
- Lo que se toca es redondo (píldora); lo que se lee es recto (4 px tarjetas, 6 px paneles).
- Foco visible de 2 px, objetivos táctiles de 44 px o más, contraste de texto de 4,5:1 o más.

`assets/css/adcom.css`, `adcom-tokens.css` y `assets/js/adcom.js` son copias del **sistema v1**
(amarillo, Poppins) que `sistema/sync.ps1` regenera para los repos de cliente: no se editan aquí.
Las páginas que aún los cargan los reciben con `adcom-v2.css` encima, que re-apunta sus tokens a v2.
Cuando v2 se apruebe para los clientes, `adcom-v2.css` pasa a `sistema/` y entra al sync.

Cada pieza es autocontenida: `framework/` trae sus propios `assets/`, y los informes de la raíz
llevan su CSS embebido. Mover una carpeta no rompe a las demás.

El playbook creativo abre desde `playbook-creativo/index.html` y funciona con doble clic, sin servidor.
Sus fichas editoriales viven en `assets/data.js`; las referencias, en `assets/references.js`.

## Cómo agregar un destino al portal

1. Deja el archivo en la raíz (`kebab-case.html`) o en su propia carpeta si trae assets.
2. Duplica un `<li class="doc">` en `index.html` y ajusta número, etiqueta, título y `href`.
3. Súmalo a la tabla de estructura de este README.

## Convenciones

- Los archivos de contenido usan `kebab-case`. Los documentos estándar de GitHub conservan su
  nombre convencional (`README.md`).
- Las carpetas `_archivo/` guardan lo sustituido, no lo vigente. Nada del sitio debe enlazar ahí.
- Los dumps de datos (`.json`, `.csv`, exports de plataformas) no van al repo: viven fuera y solo
  entra el informe ya construido. Ver `.gitignore`.
