# Migrar una página de Adcom al sistema de diseño nuevo

Guía para pasar un HTML existente (informe, ruta, copys, propuesta, tablero) al sistema `assets/ds/`. El piloto ya hecho es el portal `index.html` y `tableros/tablero-catolica.html` del repo `catolica`; ábrelos y copia sus patrones.

## Qué cambia y qué no

- **Cambia:** la capa visual: `<head>` (fuentes, CSS), el bloque `<style>`, colores, tipografía, radios, sombras, encabezado, pie, clases de estado y etiquetas.
- **No cambia:** el contenido (textos, cifras, tablas, enlaces, URLs), la lógica de datos y el JS (carga de Google Sheets, gráficas, filtros, `onclick`, ids que usa el JS), ni las imágenes que son contenido (previews de anuncios, capturas, piezas). Si cambias una clase que el JS usa, el JS se rompe: busca antes en el `<script>`.
- Los datos y totales deben quedar idénticos.

## Archivos del sistema

Desde una subcarpeta (`informes/`, `rutas/`…) las rutas son `../assets/ds/…`; desde la raíz, `assets/ds/…`.

- `fonts.css`: Inter Tight (300–600) e Inter (400–500) locales. Nada de Google Fonts, Poppins, Roboto, Montserrat ni Caveat.
- `tokens.css` y `bundle.css`: tokens y componentes del sistema (`.ad-*`). Leer `README.md` de esta carpeta: voz, color, tipografía, formas, diagramas y movimiento.
- `adcom-dash.css` + `adcom-dash.js`: capa para pantallas de datos (riel, filtros, cifras, tablas, etiquetas de estado, gráficas). Para tableros.
- `adcom-portal.css`: portal/índice.
- `logos/adcom-mark.png`: isotipo Adcom en negro (provisional hasta tener el logo definitivo). `logos/` tiene también favicon y apple-touch.

Orden en el `<head>`: `fonts.css`, `tokens.css`, `bundle.css`, la capa que toque, y al final el `<style>` propio de la página (solo lo que sea específico de ese documento).

## Reglas de diseño (resumen; el README manda)

- Fondo `washi` (#f7f6f2), tarjetas `papel` (blanco), líneas de 1 px `piedra`. **Sin sombras.** Lo que se toca es redondo (`radius-pill`); lo que se lee es recto (`radius-card` 4 px, paneles 6 px).
- Texto en `sumi` (#141414). Para texto secundario usar `tinta-secundaria` (#4a4a46) o, como mínimo, `#55554f`. **Nunca** `tinta-tenue` ni grises claros en texto: Mike los encontró difíciles de leer. Contraste ≥ 4,5:1.
- Titulares en Inter Tight 500, interletrado negativo, en `sumi` (todas las líneas, sin gris claro), `text-wrap: balance`. Titulares que afirman una conclusión, en minúscula de oración y cerrados con punto cuando sean frases. Cifras grandes en Inter Tight 300.
- **Lima (`#d8ff3d`)** solo como relleno con texto `sumi`, nunca como color de texto. Usos pedidos por Mike: **(1)** una línea gruesa debajo de la palabra clave de un titular (`background: linear-gradient(var(--lima), var(--lima)) 0 100% / 100% .13em no-repeat`), nunca un resaltador detrás del texto; **(2)** los **enlaces y botones de acción** (ver portal: píldoras lima «Abrir ›»), para que se note que se puede hacer clic.
- **Estados** (verde / amarillo / rojo) en porcentajes y etiquetas: pastilla con fondo pastel + texto oscuro + símbolo (● ◆ ▲). Variables `--est-ok/-medio/-mal` y `-bg` en `adcom-dash.css`. Nunca solo color.
- **Etiquetas tipo Notion** (categorías, niveles, tipos): fondo pastel y texto oscuro del mismo tono, radio 4 px. Variables `--tg-<color>-bg` / `--tg-<color>` en `adcom-dash.css` (gris, naranja, amarillo, verde, azul, morado, rosa, rojo).
- Series de gráficas por medio: Meta `--s-meta`, Google `--s-google` (con borde `--s-google-borde`), TikTok `--s-tiktok`, Programática `--s-prog`, ChatGPT `--s-chatgpt`, orgánico `--s-organico`. Sin doble eje, sin donas de más de 6 porciones; gráfica sin datos → estado vacío.
- Móvil a 390 px: sin scroll horizontal de la página (las tablas anchas pueden desplazarse dentro de su contenedor), campos a 16 px, objetivos táctiles ≥ 44 px. `prefers-reduced-motion` respetado.
- Sin emoji ni signos de exclamación en textos de interfaz. No inventar contenido.

## Encabezado, pie y marca

- Encabezado: isotipo `logos/adcom-mark.png` (negro) + separador + nombre del documento en texto. **No** escribir «adcom» como wordmark inventado; el logo es solo el isotipo.
- **No poner el logo del cliente** (Mike decidió quitarlos: no hay logos de todos los clientes). Quitar los logos de cliente de portadas y encabezados; el nombre del cliente va en texto. Las imágenes que son contenido se quedan.
- Favicon: `<link rel="icon" type="image/png" href="…/assets/favicon-adcom.png">` y `<link rel="apple-touch-icon" href="…/assets/ds/logos/apple-touch-icon.png">`.
- `<meta name="robots" content="noindex, nofollow">` si la página ya lo tenía.
- Pie: `Adcom · Brand Group`.
- Cuando llegue el logo definitivo se reemplazará `logos/adcom-mark.png`; mantén todas las referencias a ese archivo (no incrustes el logo en base64).

## Cómo trabajar con páginas grandes

Muchas páginas llevan imágenes en base64 de MB. **No las leas enteras ni las imprimas.** Trabaja con scripts de Python que sustituyan por marcadores los `data:…;base64,…` para inspeccionar, hagan los cambios sobre el texto y los reinserten (o editen solo el `<style>`/`<head>` con reemplazos acotados). Verifica que el número de imágenes base64 y el tamaño de los datos no cambian salvo los logos de cliente quitados.

## Verificación obligatoria

1. Servir la carpeta por http (`python3 -m http.server <puerto> --bind 127.0.0.1` dentro del repo) y abrir con Playwright de Python (`python3 -I`, ya instalado): capturas a 1440 y 390 px, **sin errores de consola** y `document.documentElement.scrollWidth <= 390` en móvil.
2. Páginas con datos de Google Sheets: el navegador de pruebas no llega a Google. Bajar las pestañas con `curl` a una carpeta temporal y servirlas con `page.route` (ver el arnés de pruebas del scratchpad de la sesión, `harness.py`, y la carpeta `fix/`), o comparar el DOM renderizado antes y después.
3. Comparar el texto visible antes y después (cifras idénticas).
4. Mirar las capturas de verdad y corregir lo que se vea roto: texto ilegible, desbordes, cajas vacías.

## No hacer

- No hacer commit ni push. No tocar archivos fuera de los asignados (en particular `assets/ds/*`; si falta algo del sistema, resolverlo en el `<style>` de la página y avisarlo en el informe).
- No borrar nada; copia previa de cada archivo editado en `/tmp`-equivalente del scratchpad (el original está en git de todas formas).
