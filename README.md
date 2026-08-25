# Adcom

Material interno del área digital de Adcom: el framework de operación, los tableros por cliente y
los diagnósticos de sector.

Todo es HTML estático. No hay build, ni dependencias, ni servidor: se abre haciendo doble clic en
`index.html`.

## Estructura

```
adcom/
├── index.html                    portal: intro y cards hacia cada destino
├── clientes.html                 hub de tableros por cliente (Looker, Zoho, HTML)
├── diagnostico-educacion.html    diagnóstico del sector de educación superior
├── framework/                    framework del área digital · v0.3
│   ├── index.html                el documento completo, con herramientas interactivas
│   ├── assets/{css,js}           estilos y scripts del framework
│   ├── _archivo/                 versiones sustituidas y el .md fuente original
│   └── README.md                 cómo editarlo: dónde cambiar qué, utilidades, checklist
└── README.md
```

Cada pieza es autocontenida: `framework/` trae sus propios `assets/`, y los informes de la raíz
llevan su CSS embebido. Mover una carpeta no rompe a las demás.

## Cómo agregar un destino al portal

1. Deja el archivo en la raíz (`kebab-case.html`) o en su propia carpeta si trae assets.
2. Duplica una `<a class="card">` en `index.html` y ajusta tag, título, bajada y `href`.
3. Súmalo a la tabla de estructura de este README.

## Convenciones

- Los archivos de contenido usan `kebab-case`. Los documentos estándar de GitHub conservan su
  nombre convencional (`README.md`).
- Las carpetas `_archivo/` guardan lo sustituido, no lo vigente. Nada del sitio debe enlazar ahí.
- Los dumps de datos (`.json`, `.csv`, exports de plataformas) no van al repo: viven fuera y solo
  entra el informe ya construido. Ver `.gitignore`.
