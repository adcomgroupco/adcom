Adcom es la unidad digital de Brand Group: marketing y tecnología en un solo sistema de crecimiento. Este sistema describe lo que ya usa el sitio web propuesto (Home, capacidades, categorías, casos, guía interna del equipo). Todo valor viene del canvas «Adcom — Dirección visual web»; lo que no está definido allí se dice abajo en «Sin definir» y no se inventa.

## Contenido y voz

- Escribe en español latinoamericano, en primera persona del plural: «Conectamos contenido, medios, datos y tecnología en un solo sistema de crecimiento.»
- Titulares en dos líneas cortas, en minúscula de oración y cerrados con punto: «Todo conectado. / Todo medible.», «Cada conversación es un dato. / Cada dato, una decisión.» Parte cada línea con `.ad-ln` (bloque con `text-wrap: balance`), no con `<br>`.
- Una idea, un titular, un visual por pantalla. Si un párrafo no cabe en dos o tres líneas, sobra.
- El CTA principal es siempre «Hablemos». Los enlaces secundarios terminan en « ›»: «Ver cómo trabajamos ›», «Conocer LumnIA ›».
- Cifras con puntos de millar y espacio antes del porcentaje: `70.000`, `+20 %`, `6 → 12 %`, `USD 2,6 M`. Cada cifra lleva una línea de contexto y una fuente con año: «Educación · 2023».
- Separa metadatos con punto medio: «Content · Media», «CRM + pauta · 2022–2026».
- Nada de signos de exclamación, emoji ni superlativos. Los resultados se muestran con datos, no con promesas.
- Los textos de interfaz ilustrativa (capturas de LumnIA, Vincero) llevan siempre la nota «Interfaz ilustrativa».

## Principios visuales

Cuatro ideas japonesas guían cada decisión; cítalas al justificar un diseño:

- **Ma**: el espacio vacío comunica. Separa secciones con `space-40` (160 px) y deja que cada frame respire; nada toca los bordes.
- **Kanso**: simplicidad. Un titular y un visual por pantalla.
- **Shibui**: elegancia discreta. Neutros apagados, líneas de 1 px y un solo acento vivo.
- **Seijaku**: calma. Movimiento lento y preciso, solo donde explica algo.

## Color: 90 % neutro, 10 % carácter

- Fondo de página: `washi`. Fondo alterno de sección: `papel`. Fondo de contacto y cajas de nota: `crema`. Líneas: `piedra` a 1 px.
- Texto: `sumi` para titulares y datos; `tinta-secundaria` para párrafos; `tinta-suave` para etiquetas y metadatos. `tinta-tenue` solo en titulares de 24 px o más.
- `lima` es lo único vivo de la página. Úsala solo como relleno con texto `sumi`: el botón de acción, un resaltador (`.ad-hl`), el punto del ciclo, el último paso, el círculo ×, una cifra clave. Nunca como color de texto ni de línea. Máximo un elemento lima por pantalla.
- Secciones oscuras: `negro-escena` para la sección «Personas + IA» y los marcos de video; `noche` para productos propios (LumnIA, Vincero) y para la tarjeta AI. `sumi` para el bloque central de capacidades y la tarjeta Gambling. Texto sobre oscuro: `sobre-oscuro-100`, `sobre-oscuro-200`, `sobre-oscuro-300`.
- Los tonos `noche-*` solo existen dentro de las interfaces ilustrativas de producto.
- El logotipo va siempre en negro. La lima lo acompaña (CTA, ciclo, dato) pero nunca lo reemplaza. Los logos de cliente se muestran en gris (`opacity-logo`, `grayscale(1)`, `multiply`) y recuperan su color al pasar el cursor.
- Se evaluaron otros acentos (amarillo `#FFD43B` + `#FFE98A`, azul `#2E46FF` + `#DDE2FF`, naranja `#FF5A1F` + `#FFD9C7`) y se eligió lima. No los mezcles. `indigo` (`#16233A`) quedó definido como compañero de lima y todavía no se usa en ninguna página.

## Tipografía

- Titulares y cifras: Inter Tight (`font-display`). Cuerpo: Inter (`font-body`). Ambas se cargan desde Google Fonts: Inter Tight 300, 400, 500 y 600; Inter 400 y 500.
- Titular de página: `display-hero`; de sección: `h2`; sobre fondo oscuro: `statement`. Los tres son fluidos con `clamp()`; el token guarda el tamaño máximo y la nota de cada estilo, el mínimo.
- Etiqueta de sección: `eyebrow` en `tinta-suave`, sin mayúsculas.
- Cifras grandes y finas: `cifra-xl` y `cifra-lg`, peso 300. Una cifra clave puede llevar fondo `lima` (`.ad-fill`).
- Interletrado negativo en titulares (−3 % a −4 %); cuerpo sin interletrado. Interlínea de cuerpo 1,6.
- Usa `text-wrap: balance` en títulos y `text-wrap: pretty` en párrafos.

## Layout y espacio

- Contenido en un contenedor de `container-max` (1200 px) centrado con `space-6` (24 px) de gutter. Los artboards de referencia miden 1440 px (escritorio) y 390 px (móvil); las páginas son fluidas entre ambos.
- Secciones separadas por `space-40`; el hero abre con `space-32` arriba y `space-24` abajo.
- Rejillas con `repeat(auto-fit, minmax(320px, 1fr))` y `gap` de `space-16`; en móvil todo se apila.
- Separa secciones con líneas de `piedra`, no con cajas ni sombras. No hay sombras en el sistema.
- Todo elemento tocable mide al menos `target-min` (44 px); los botones de acción, `target-cta` (48 px).

## Formas

- Lo que se toca es redondo: botones, chips y etiquetas usan `radius-pill`. Lo que se lee es recto: tarjetas, imágenes y marcos usan `radius-card` (4 px); tarjetas grandes y paneles, `radius-panel` (6 px); campos, `radius-input` (2 px).
- El gráfico firma es el círculo abierto (ensō): el ciclo del Growth System, siempre en movimiento.

## Lenguaje de diagramas

Vocabulario cerrado de cinco figuras; no inventes formas nuevas por sección.

- **Anillo**: ciclos (Growth System, recorrido que se repite).
- **Cruce**: lo que se encuentra (lógica y emoción; Authority y Adcom). El área común va en `lima`.
- **Suma**: capacidades que se suman (`+`) y la IA que multiplica (`×` en círculo `lima`).
- **Eje**: de lo amplio a lo específico (PEM → PCC → Campañas 360).
- **Pasos numerados**: recorridos y métodos (`.ad-n`); el último paso va en `lima`.

Reglas de medida: un diagrama protagonista por página; los demás son ecos (un número, un «+», una flecha) o silencio. Si una lista basta, usa lista. Lima una vez por pantalla. Las líneas se dibujan al entrar y se quedan quietas; solo la órbita de AI gira en bucle. Si el diagrama necesita un párrafo largo para explicarse, está mal planteado. Los previews de Diagramas muestran las cinco figuras.

## Movimiento

- Cada loop explica la idea de su sección. Ciclos de 4 a 14 segundos con curvas suaves; sin rebotes ni destellos.
- Solo tres recursos: líneas que se dibujan (`easing-draw`), puntos que viajan y anillos que laten.
- Entradas con `duration-rise` y `easing-rise`; hover de logos con `duration-hover`.
- Con `prefers-reduced-motion: reduce` todo queda quieto y legible: anula `animation` en cada clase animada y oculta el punto corredor del hero.
- Video: escenas de vida real con luz natural, cámara quieta o dolly muy lento, personas latinoamericanas sin mirar a cámara, y un solo objeto en lima por escena. Loops de 8 a 12 s sin audio, MP4 (H.264) y WebM de menos de 3 MB, imagen fija de respaldo y velo oscuro del 40 al 50 % detrás del texto.

## Imágenes e iconografía

- Usa fotos reales con luz natural y capturas de producto. No uses fotos de banco, degradados ni íconos de colores.
- No hay librería de íconos: los gráficos son trazos finos de 1 px en SVG propio (`aria-hidden="true"` si decoran, `role="img"` con `aria-label` si informan). El único glifo de texto es «✓» dentro de las interfaces ilustrativas, y la flecha «›» en enlaces.
- Logotipos: copia siempre el archivo oficial de cada marca; no los redibujes. Los logos de Adcom, Brand Group, LumnIA, Vincero y los de cliente viven en el canvas original y no se pudieron copiar a este sistema (ver «Pendiente»).

## Componentes

Hay doce componentes con vista previa y guía: Button, Chip, Highlight, NumberBadge, Header, Stat, Capability, CategoryCard, ProductCard, LogoGrid, FormField y Diagrams. Se estilan con `components/bundle.css`, que solo usa variables de `tokens.css`. No hay JavaScript de componentes: el estado (por ejemplo el chip activo) se resuelve con `aria-pressed`.

## Accesibilidad

- Texto de cuerpo ≥ 4,5:1 sobre su fondo; `lima` siempre con `sumi` (16:1).
- Botones reales con `<button>` o `<a href>`, campos con `<label>`, íconos solo-icono con `aria-label`.
- Foco visible: contorno sólido de 2 px en `sumi`, separado 3 px.
- Avisos conocidos del original (no se recolorearon): el borde `piedra-borde` de campos y chips es 1,4:1 sobre `washi` (menos de 3:1); la nota `noche-nota` es 4,3:1 a 11 px (menos de 4,5:1); `tinta-tenue` es 3,2:1 y solo sirve en 24 px o más.

## Sin definir

El canvas no define estos puntos; no los asumas al extender el sitio, pregunta primero: breakpoints con nombre (solo hay referencias de 1440 y 390 px), estados de error y éxito en formularios, modo oscuro completo, estados de deshabilitado y carga, escala de sombras (no hay), librería de íconos, y el uso del acento `indigo`.

## Pendiente

- Subir los logos oficiales (Adcom, Brand Group, LumnIA, Vincero, Discovery, The Brand, Authority y los de cliente) al grupo `assets/Logos`.
- Los previews de este sistema usan una caja punteada «Logo» donde iría el logotipo.
- La página «Casos» y las 12 fichas de la guía de Equipo se leyeron solo por su índice, no a nivel de componente; si usan patrones nuevos, hay que añadirlos.
