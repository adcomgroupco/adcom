# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primarios — equipo digital de Adcom.** Analistas y ejecutivos del área que ya conocen el oficio y abren la página *a mitad de una tarea sobre una cuenta*, no en un momento de estudio. Llegan con una pregunta concreta o con la intención de usar una herramienta, y su éxito es volver al trabajo rápido.

**Secundarios — personas nuevas en onboarding.** Entran al área y necesitan construir el modelo mental completo del framework durante sus primeras semanas. Necesitan una ruta de entrada, pero son una minoría temporal: cada persona deja de ser este usuario a las pocas semanas.

Las dos audiencias comparten la página y tienen necesidades opuestas de navegación. Esa tensión es el problema de diseño central del proyecto.

## Product Purpose

Landing interna que documenta **y opera** el framework de trabajo del Área Digital de Adcom (v0.3): su sistema de operación, control, reacción y aprendizaje.

Existe para que las reglas del área sean aplicables en el momento en que hacen falta, en lugar de vivir en un documento que nadie abre. El éxito no es que la página se lea entera: es que alguien encuentre lo que buscaba, o ejecute una herramienta, y siga trabajando.

## Positioning

No es documentación. Es documentación **con herramientas ejecutables dentro** — calculadora, árbol de decisión, constructor de nomenclaturas, combinador y tablero de cuentas — que convierten cada regla en algo aplicable sin salir de la página ni abrir otro archivo.

Un documento de framework equivalente en cualquier otra agencia describe el proceso; este lo ejecuta.

## Operating Context

- Se abre **a mitad de una tarea**, con una cuenta en curso y otra ventana esperando. La sesión típica es corta y con objetivo.
- Se hospeda en **intranet**, en una URL interna. Ya no depende del doble clic sobre el archivo, lo que garantiza que Poppins y cualquier recurso externo carguen de forma consistente.
- También se **imprime o exporta a PDF**: existe `assets/css/06-impresion.css` cargado con `media="print"`, que oculta las herramientas interactivas en papel.
- Convive con las plantillas `.xlsx` de nomenclaturas y UTM, que se descargan desde la página y se usan fuera de ella.

## Capabilities and Constraints

**Funcionalidad confirmada**
- 20 secciones de contenido y 19 destinos en `<nav id="mainnav">`: el hero se alcanza mediante
  `#inicio`, las 18 secciones principales tienen ancla propia y el cierre funciona como remate,
  no como destino independiente.
- Cinco herramientas interactivas en `assets/js/herramientas.js`.
- Índice, tablero de cuentas y requisitos de solicitud se pintan desde `assets/js/contenido.js`.
- Resaltado automático del enlace activo del menú por observación de secciones.
- **Dos niveles de búsqueda.** El buscador global del hero (`#q`) consulta títulos y texto completo,
  se abre desde el header, `/` o `Ctrl+K`; el buscador del índice (`#toc-q`) filtra las 91 entradas
  por familia y conserva su contador y estado vacío.

**Restricciones durables**
- **Sitio estático: sin build, sin dependencias, sin paso de compilación.** Se sirve como archivos planos desde la intranet.
- El orden de los seis archivos CSS es significativo: la cascada se resuelve por secuencia y un archivo nuevo debe insertarse en su posición y enlazarse en ese mismo orden.
- Poppins se carga desde el CDN de Google Fonts.
- Los diagramas son SVG escritos a mano, sin librerías.
- La página se escribe **en español**.

**Fuente de verdad**
- `index.html` es la única fuente de verdad. `_archivo/framework-area-digital-v03-detallado.md` es referencia histórica: le faltan los puntos 86—99 que la página sí tiene, e incluye los puntos 42, 43 y 82 que la página omite. Editarlo no cambia nada.
- `_archivo/` guarda versiones sustituidas.

## Brand Commitments

Restricciones fijadas explícitamente por el usuario para este ciclo de trabajo: **es un refinamiento, no un rediseño.**

- **Paleta preservada, sin sustitución:** `--ink #050505`, `--ink-soft #111111`, `--ink-card #151515`, `--paper #f4f4f1`, `--paper-soft #eceae4`, `--white #ffffff`, `--yellow #ffd400` como acento, y los semánticos `--green #55c98a`, `--orange #ff8a3d`, `--red #ff4d4d`, `--blue #315cff`.
- **Familia tipográfica preservada: Poppins.** Los pesos, tamaños, interlineado y tracking **sí** son ajustables.
- Identidad existente: nombre "Framework Área Digital · v0.3", marca "FD", favicon SVG inline, `theme-color #050505`.
- Estructura de secciones alternadas oscuro/claro (`.section-dark` / `.section-light`) como sistema de ritmo de la página.

## Evidence on Hand

- `_archivo/framework-area-digital-v03-detallado.md` — texto original, puntos 1—85.
- `assets/plantillas/` — dos plantillas reales: `Plantilla_nomenclaturas_y_UTM_casa_apuestas.xlsx` y `Plantilla_nomenclaturas_y_UTM_educacion.xlsx`.
- `_archivo/` — versiones anteriores del framework.
- `README.md` — documentación de mantenimiento vigente y detallada.

**Ausencias que el trabajo futuro no debe inventar:** no hay analítica, ni métricas de uso, ni testimonios, ni casos de estudio, ni datos de adopción. No se conoce cuánta gente usa la página ni qué secciones consulta.

## Product Principles

1. **La consulta puntual gana sobre la lectura lineal.** El usuario primario llega con una pregunta, no con tiempo. Encontrar debe costar menos que leer.
2. **Las herramientas son el producto, no un anexo.** Son lo que distingue esta página de un documento y uno de los dos motivos de visita; su lugar en la jerarquía debe reflejarlo.
3. **El onboarding no puede estorbar al experto.** La ruta de entrada para quien llega nuevo tiene que existir sin imponerle fricción a quien ya sabe dónde va.
4. **Alcanzable o no existe.** Contenido que no se puede navegar es contenido que no está: toda sección debe tener una vía de acceso.
5. **Cero fricción de arranque.** Sin build ni dependencias: cualquier persona del área debe poder abrir, editar y publicar sin instalar nada.

## Accessibility & Inclusion

Bases ya implementadas y que deben preservarse: `skip-link`, `:focus-visible` con contorno adaptado al fondo de cada sección, contenedores de scroll horizontal enfocables por teclado, `@media (prefers-reduced-motion:reduce)`, `aria-labelledby` por sección y hoja de impresión dedicada.

**Estándar requerido: WCAG 2.1 nivel AA.** Confirmado por el usuario el 2026-09-06, tras la auditoría que reportó 78 fallos de contraste (1.4.3), 22 saltos de nivel de encabezado (1.3.1), cuatro `role="tablist"` sin `role="tab"` (4.1.2) y una sola región `aria-live` para cinco herramientas (4.1.3).

AA no es una aspiración de este proyecto: es el piso. La página se hospeda en intranet y sirve a onboarding, así que el trabajo futuro que introduzca un fallo AA se considera una regresión, no una decisión de diseño.
