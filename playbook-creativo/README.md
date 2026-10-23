# Playbook creativo de medios digitales

Biblioteca estática para el equipo creativo. Abrir `index.html` con doble clic o desde el portal de Adcom.
No requiere build ni servidor; los recursos del playbook son locales, salvo la fuente web opcional.
El diseño usa los tokens compartidos de `../assets/css/adcom-tokens.css`: suelo tinta para lectura
visual, franja papel para la biblioteca, Poppins y amarillo Adcom.

## Contenido

- `assets/data.js`: medios, oportunidades y fichas. Cada ficha define formato, rutas creativas,
  acción, microtips, activación y el ID de una referencia.
- `assets/references.js`: referencias del paquete v2, con fuente, nota y fecha de revisión.
- `assets/specs.js`: lienzos de trabajo y proporciones orientativas para las 43 fichas. La medida
  final depende del placement, proveedor y mercado; debe confirmarse antes de producir.
- `assets/interfaces/`: 43 imágenes generadas que representan la pantalla o el contexto completo
  de cada formato. Las marcas, mensajes, páginas y campañas son ficticios; son ilustraciones,
  no capturas reales de una plataforma o una campaña publicada.
- `assets/mockups/`: composiciones SVG anteriores, conservadas como respaldo si una imagen no carga.
- `assets/branding/`: logo de Adcom proporcionado para la cabecera y favicon.
- `assets/logos/`: iconos locales de Meta, TikTok, Google, YouTube, Spotify, Twitch y Kick,
  tomados de Simple Icons 16.35.0 (CC0). Programática, CTV y DOOH usan etiquetas de categoría.
- `assets/photos/`: diez fotografías originales generadas para estos ejemplos y utilizadas en
  las composiciones SVG de respaldo.
- `assets/thumbnails/` y `assets/safe-zones/`: material heredado del paquete v2 que la interfaz
  ya no carga. Se conserva como insumo de origen.
- `tools/generate_mockups.py`: regenera las composiciones SVG de respaldo. Requiere solo Python
  estándar; la página funciona sin Python.
- `script.js`: búsqueda, filtros, fichas y demos interactivas.

La exploración presenta un selector de medios y muestra sus formatos en páginas de cuatro tarjetas
con previews de altura uniforme. La búsqueda recorre todos los medios. Hay fichas de Meta, TikTok,
Google, Spotify, Programática, CTV, Twitch / Kick y DOOH. Las fichas de Meta y TikTok incluyen una guía
visual orientativa de zonas seguras. DCO y los formatos activados por datos muestran un registro
ficticio, la regla y la pieza resultante, incluido un escenario sin dato válido, desde la tarjeta
de preview. La ficha de Performance Max reúne seis superficies de Google en un solo visual.
Las imágenes de las tarjetas y de las fichas se pueden ampliar con un clic. TikTok incluye
TopView, Pulse y Top Feed; Google incluye YouTube Masthead. Estos formatos de reserva requieren
validar acceso, inventario, mercado y compra antes de producir.

## Mantener una ficha

Editar el registro en `assets/data.js` y comprobar que el ID `ref` exista en `assets/references.js`.
El estado `Habitual`, `Especializada` o `Por validar` es una orientación editorial, no una promesa
de compra. Antes de producir, medios debe confirmar mercado, inventario, proveedor y especificaciones.
Las demos de clima y de zonas visibles son orientativas, sin datos en vivo ni medidas oficiales.
Los ejemplos de precio, stock y clima son ficticios. Para preparar originales, usa el preview y
la plantilla del producto contratado. Referencias para los lienzos iniciales: [Meta Reels](https://www.facebook.com/business/ads/facebook-instagram-reels-ads), [TikTok In-Feed](https://ads.tiktok.com/resources/help/article/tiktok-auction-in-feed-ads), [TikTok TopView](https://ads.tiktok.com/resources/help/article/tiktok-reservation-topview?lang=en), [TikTok Pulse](https://ads.tiktok.com/resources/help/article/tiktok-pulse?lang=en), [TikTok Top Feed](https://ads.tiktok.com/resources/help/article/reach-frequency-campaigns-top-feed), [YouTube Masthead](https://support.google.com/youtube/answer/2375464?hl=en), [Google Performance Max](https://support.google.com/google-ads/answer/16683501), [Spotify Ads](https://ads.spotify.com/en-US/ad-specs/), [Twitch](https://help.twitch.tv/s/article/branded-content-policy), [Kick](https://help.kick.com/en/articles/15300357-advertising-on-kick-for-viewers), [Google Demand Gen](https://support.google.com/google-ads/answer/17140672), [Google Display](https://support.google.com/google-ads/answer/1722096), [Merchant Center](https://support.google.com/merchants/answer/14779112), [Amazon Streaming TV](https://advertising.amazon.com/resources/ad-specs/dsp/video/streaming-tv-prime-video-ads) y [Amazon Pause Ads](https://advertising.amazon.com/resources/ad-specs/prime-video/pause-ad).

## Procedencia

Basado en el brief maestro y el paquete `Creative_Media_Playbook_v2` suministrados para este
proyecto (22 de octubre de 2026). Cada ficha muestra una imagen generada de su contexto de uso y
enlaza una referencia externa por separado. Algunas interfaces reconocibles se han recreado como
ejemplos editoriales, con contenido ficticio; no se cargan capturas de terceros en la página.
Los códigos QR visibles en algunas imágenes son ilustrativos y no forman parte de una activación.
