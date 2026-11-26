# Talleres

Las guías y talleres del área digital, montados como páginas con el sistema de diseño v2
(`ESTANDARES-DISENO.md`). Las guías en PowerPoint de 2025 son la base; cada página se complementa con
secciones nuevas.

| Página | Fuente original (Drive: CLIENTES / GUIAS y TALLERES) | Herramienta |
|---|---|---|
| `index.html` | — | Lista y recorrido de los talleres |
| `entorno-digital.html` | `GUIA DIGITAL 2025.pptx`; capítulo de IA actualizado en 2026 con `guias/como-trabajamos-con-ia.html`; herramientas por tipo de trabajo según los tableros de Artificial Analysis (consultados el 26 nov 2026, revisar cada mes) | Modelos de atribución sobre un recorrido de cuatro contactos |
| `segmentacion.html` | `GUIA DE SEGMENTACIÓN 2025.pptx`; capítulo Meta Andromeda (2026) con Meta Engineering (2 dic 2024), AdExchanger (28 oct 2026) y el método de ángulos de Adcom | Cómo decide cada plataforma |
| `comunicacion.html` | `GUIA DE COMUNICACION 2025.pptx` | Seis estructuras de anuncio con su ejemplo |
| `contenido-anuncios.html` | `Guia para crear contenido de anuncios.pptx` + recomendaciones de la guía de comunicación | Matriz de mensajes y simulador de área segura |

`talleres.css` (prefijo `ta-`) y `talleres.js` tienen solo lo particular de estas páginas. Todo lo demás
sale de `assets/css/adcom-v2.css`.

## Cómo se compone una página

Como el sitio y las diapositivas de las guías, no como un documento:

- **Portada centrada** (`.ad-hero--centro`), titular en dos líneas con una palabra en `.ad-hl`.
- **Frase protagonista** (`.ta-frase` + `.ad-t-statement`): una idea por pantalla, la segunda línea en
  `.ta-tenue`. Se usa para las frases fuertes de la guía y para abrir capítulos.
- **Diagramas del vocabulario cerrado**: anillo para ciclos, eje para recorridos y embudos (con cifras),
  suma para piezas que se suman, cruce y red en SVG con las clases `ad-dg-*`.
- **Ideas paralelas en columnas** (`.ta-caps`, regla superior y poco texto), no en listas largas.
- Secundario en `details.ad-datos` (por ejemplo, los tipos de prompt de la guía de 2025).

## Reglas

1. **Un tema, un lugar.** Las guías repiten contenido (los 6 a 8 impactos, el mapa de puntos de contacto,
   el UGC, las tendencias 2025). Cada tema vive en un taller y los demás lo enlazan.
2. **Cifras con fuente y año.** Se dejan como las cita la guía. Si no trae fuente: «Sin fuente en la guía».
   Si falta el número: «Sin dato». Al actualizar una cifra, cambia también la fuente y el año.
3. **Sin piezas de clientes.** El repositorio es público y se publica en GitHub Pages. Las piezas de
   clientes se describen o quedan como `ad-marcador`. Tampoco videos de terceros: pesan y no son nuestros.
4. **Sin CSS suelto.** Lo nuevo se arma con componentes `ad-*` (galería: `banco-formatos/componentes.html`).
   Si una herramienta necesita algo propio, va en `talleres.css` con prefijo `ta-` y solo con tokens.
5. **Lima:** entre 4 y 10 rellenos por página, una marca por bloque. Los selectores de la matriz usan
   sumi, no lima.

## Complementar un taller

1. Copia una sección `<section class="ad-sec …">` parecida de la misma página y respeta la alternancia de
   fondos (claro → papel o crema → claro…; las oscuras para ideas fuertes).
2. Si suma un enlace al menú, agrégalo en `.ad-nav__links`.
3. Las herramientas reutilizables están en `talleres.js`:
   - `data-picker`: chips que muestran un panel (`data-show` ↔ `data-panel`). Sin JS se ven todos.
   - `data-atribucion`, `data-segura`, `data-matriz`: una por página.

## Agregar un taller

1. Copia el taller más parecido, cambia el encabezado, la portada y las secciones.
2. Agrégalo a `talleres/index.html` (fila y recorrido), al portal (`index.html#talleres`) y a la tabla de
   arriba.
3. Ajusta el cierre del taller anterior para que apunte al nuevo.

## Antes de dar algo por terminado

```text
python -I herramientas/auditar_v2.py . --detalle
```

Debe dar 0 en `talleres/`. Revisa la página a 1440 y 390 px (sin scroll horizontal, consola limpia) y
prueba cada herramienta.
