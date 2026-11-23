# Instructivo del Banco de formatos

Usa este documento junto con la plantilla del banco que corresponda. Entrega el formato completo con datos del encargo, un enlace o archivo utilizable y las limitaciones que afecten su lectura.

## Encargo para una IA

> Replica la plantilla **[nombre del formato]** del Banco de formatos de Adcom. Lee este instructivo, la plantilla y el contexto del cliente. Usa **[objetivo o decisión]**, **[periodo y corte]** y **[fuentes autorizadas]**. Conserva la jerarquía visual y los campos mínimos del formato. Identifica las cifras ausentes o parciales, verifica los totales y entrega el archivo en el destino indicado para **[audiencia y cliente]**.

1. Confirma objetivo, público, cliente, alcance, periodo, moneda y fuente. Identifica la acción que cuenta como resultado y si corresponde a plataforma, analítica web o CRM.
2. En encargos de Media Bridge, consulta el perfil, la bitácora y el contexto del cliente según las instrucciones del repo. Reutiliza el workflow o preset correspondiente. Usa `deliverable_path` para resolver el destino.
3. Duplica la plantilla y sustituye el contenido de ejemplo. Conserva el original como referencia. Registra corte, fuente y comparación junto a los datos. Marca como «Sin dato», «Parcial» o «No aplica» según el caso. El cero representa una observación válida.
4. Distingue plan, ejecución, medición y lectura. Declara supuestos y límites. Sustenta las causas con evidencia y presenta las explicaciones aún por verificar como hipótesis.
5. Usa nombres comprensibles para la audiencia. Para documentos sujetos a nomenclatura del framework, aplica `[CLIENTE]_[TIPO]_[Tema y periodo]_[Fecha]_[Versión]` y el tipo oficial correspondiente. Sigue la convención del repositorio de destino para los nombres de archivo.

## Diseño y archivos

- El punto de partida del banco es el [CSS Adcom v2](../assets/css/adcom-v2.css), alineado con los tokens del paquete «Adcom DesignSystem». Usa Inter Tight para titulares y cifras, Inter para el cuerpo, fondo washi `#F7F6F2`, papel `#FFFFFF`, texto sumi `#141414`, piedra `#E4E2DC` para separadores y crema `#EFEDE7` para áreas de apoyo. La lima `#D8FF3D` se reserva para un relleno de énfasis con texto sumi. Mantén líneas de 1 px, esquinas de 4–6 px en superficies, controles redondos y foco visible.
- **Componentes y lima.** Ordena la información con los componentes `ad-*` de `adcom-v2.css`, documentados con demo en [componentes.html](componentes.html): cabecera de sección, tarjeta, fila, cifras clave, estado, lectura, cita, pasos, barra, tabla, marcador de pieza y figura. No escribas CSS suelto: si falta una pieza, créala en `adcom-v2.css` y súmala a la galería. La lima marca lo primero que hay que ver en cada bloque (palabra clave del titular, lo seleccionado o actual, la cifra clave, lo cumplido, la acción principal): una marca por bloque, varias por página, siempre como relleno con texto sumi.
- Para HTML de este banco, copia la plantilla con sus dependencias: `formatos.css`, y `css/<formato>.css` y `js/<formato>.js` del formato. Los componentes compartidos están en [formatos.css](formatos.css). Al mover la copia, ajusta rutas relativas y conserva el sistema aprobado por el repo del cliente. Consulta los [lineamientos de repositorios](../informes/LINEAMIENTOS_DISENO_REPOSITORIOS.md) para sus perfiles y las reglas de publicación.
- Usa un título principal, una lectura concreta al inicio, tablas con encabezados y unidades, y acciones con responsable y fecha si aplican. Alinea cifras a la derecha. Escribe las cifras con punto de millar y espacio antes de % y de M (`70.000`, `+20 %`, `$86,4 M`); en HTML usa `&nbsp;` y en JS `Intl.NumberFormat("es-CO", { useGrouping: "always" })`. Añade texto alternativo a imágenes informativas. Mantén las tablas accesibles por teclado y con desplazamiento local en móvil.
- Cada gráfico debe responder una pregunta. Identifica métrica, periodo, unidad y valor, y acompaña la figura con una lectura breve. Usa barras con base cero para magnitudes comparables, líneas para series cronológicas con suficientes observaciones y tablas para detalle. Diferencia estados o series con etiquetas, posición o trazo además del color.
- Para Excel, conserva fechas, montos y tasas como valores de su tipo. Ubica los indicadores clave sobre el detalle y agrupa las columnas por función. Usa encabezados sumi, entradas en papel, cálculos sobre crema y un único valor destacado en lima por vista. Amplía los rangos de resumen, fórmulas, formatos y validaciones al agregar filas al rango inicial, de la 8 a la 37. Recalcula después de editar. En equipos sin Inter se verá la fuente de reemplazo de Excel.

## Cómo replicar cada formato

Cada plantilla HTML tiene tres archivos: la página (`<formato>.html`), su estilo (`css/<formato>.css`) y sus datos y lógica (`js/<formato>.js`). Los datos van al inicio del `.js`, en el bloque marcado «Reemplazar con los datos del cliente»; las cifras derivadas (totales, costos, variaciones, cumplimiento) se calculan solas. Después se reescriben en el HTML los textos de lectura, que deben citar las mismas cifras. Un valor ausente es `null` y se muestra «Sin dato», nunca cero. Cada sección trae un comentario con qué va, de dónde sale el dato y qué no hacer. El ejemplo usa un cliente ficticio, «Universidad Andina»; nunca se publica la plantilla con datos de un cliente real.

Los formatos siguen el ciclo del framework: **planear** (estrategia, flow, materiales), **ejecutar** (implementación, seguimiento de inversión, tablero) y **reportar** (informe particular, cierre).

### 1. Estrategia o ruta para universidades

**Base** [Estrategia para universidades](estrategia-universidades.html) · tipo `RUTA` o `ESTRATEGIA` · [guía de Estrategia](../framework/estrategia.html), puntos 18 a 21.

- Dos partes. **Punto de partida:** contexto de mercado (programas tractores, competitivos, nicho y en alerta; costos de la categoría), radiografía de la cuenta (cifras clave, por medio, por programa, histórico de tres periodos) y diagnóstico de seis columnas con nota de 1 a 5 y semáforo Mantener / Fortalecer / Priorizar. **Ruta:** objetivos y metas por programa y nivel, recorrido del aspirante y página de gracias (Efecto Imán®), audiencias y verticales, canales con su rol y pruebas, inversión con tres escenarios (base, favorable, restrictivo, cada uno con condición, señal y respuesta), calendario de admisiones, medición, riesgos y próximos pasos.
- El script calcula leads = presupuesto ÷ costo por lead y matrículas = leads × conversión, redondeados hacia abajo, igual que el flow. La meta institucional se compara con lo que aporta la pauta: la pauta no carga toda la meta.
- Una ruta sin diagnóstico empieza en la Parte 02. Para B2B o internacional, cambia moneda, niveles por segmentos y programas por mercados.

### 2. Flow de medios y forecast

**Base** [presentación](flow-medios.html) y [hoja de trabajo](flow-medios.xlsx) · tipo `FLOW` · [escenarios del framework](../framework/estrategia.html#escenarios), puntos 26 a 29.

- La hoja es donde se trabaja; la página es lo que se muestra al cliente. Ambas comparten cifras.
- Anatomía: portada con periodo, moneda y estado («propuesta a validar»); cifras clave (inversión, resultados proyectados, costo por resultado, resultado de negocio); tabla por canal (rol, etapa, inversión, KPI y costo supuesto, resultado), con total, reserva de optimización y participación; calendario medio × mes con vuelos y momentos; peso por mes; forecast por programa (presupuesto, costo por lead, leads, conversión, matrículas, meta y cumplimiento); escenarios; supuestos con fuente y estado («real», «estimado», «en verificación»); reglas de optimización.
- Libro: hojas **Flow** (una fila por medio, táctica y vuelo; meses en columnas con fechas tipadas), **Calendario** (Gantt semanal por fórmula), **Programas** (la celda de control contra la inversión de conversión del Flow debe dar 0) y **Escenarios** (factores de costo, tasa y recorte; el costo marginal sube, no es regla de tres).
- Una moneda por libro y por página. No se suman leads con impresiones; un CPM se calcula por mil.

### 3. Cuadro de materiales y copys

**Base** [presentación](cuadro-materiales.html) y [hoja de trabajo](cuadro-materiales.xlsx) · hoja por campaña · [proceso de materiales](../framework/operacion-tactica.html#ciclo), puntos 23, 24 y 94.3.

- Una fila por mensaje o ángulo, con sus adaptaciones por formato. **Brief:** código único (BR-xx), campaña, programa, objetivo, audiencia, barrera, hipótesis, ángulo, rol (core o soporte), mensaje, oferta, CTA, qué pedir a creatividad, textos legales y quién aprueba (por muestra o pieza por pieza). **Producción:** pieza nueva o adaptación, plataforma, formato, proporción y dimensiones (salen de la hoja Formatos), duración, cantidad, fechas de solicitud y entrega, estado, responsable, enlace final y nomenclatura (punto 75.1). **Copys:** por programa y medio, con contador y límite de caracteres (Meta pieza y copy, Google RSA 15 × 30 y 4 × 90, TikTok 100 sin emoji) y revisión Aprobar / Con ajustes.
- El código BR-xx une Brief, Producción y Copys. Las piezas se muestran como marcadores con su proporción real hasta tener el archivo aprobado.
- La revisión de copys en la página vive en memoria y se descarga en CSV. En el repo del cliente se conecta a su hoja como ya se hace, sin escribir la URL en la plantilla.

### 4. Reporte de implementación

**Base** [Reporte de implementación](reporte-implementacion.html) · tipo `IMPLEMENTACIÓN` · [implementación y tracking](../framework/operacion-tactica.html#implementacion), punto 25. En Media Bridge aplica además `docs/presets/meta-ads-implementation.md` y `meta-ads-report.md`.

- Anatomía: portada «Anuncios de [línea] · [fecha]» con el estado real al corte y la franja de cifras (programas, anuncios, sedes, estado); destinos por programa (campaña y conjunto, formulario o evento exacto, piezas, presupuesto, fechas, estado, total); galería con una vista por pieza única y sus destinos (texto, CTA, formato, URL con UTM, estado); prueba A/B si la hay (control, prueba, reparto, criterio de lectura); anuncios anteriores pausados o mantenidos con su motivo; validaciones de tracking con las compuertas del punto 25; pendientes con fecha, criterio de éxito y responsable; anexo técnico con la nomenclatura interna.
- Activo no es lo mismo que con entrega, y la configuración no prueba que el lead llegue al CRM: dilo explícitamente. La implementación no lleva gasto ni leads; eso es del informe.
- Para otro sector, programa pasa a producto o campaña, sede a ciudad o país, y el evento puede ser registro o depósito.

### 5. Seguimiento de inversión

**Base** [presentación](seguimiento-inversion.html) y [hoja de trabajo](seguimiento-inversion.xlsx) · [control presupuestal](../framework/operacion-tactica.html#estructura-control), puntos 26 a 29.

- Anatomía: corte, cuentas, plan de referencia (el flow) y fuente del gasto; cifras clave (inversión, % ejecutado, ritmo esperado «día X de N», proyección de cierre); curva acumulada real contra esperado; tabla por medio con marca de ritmo; tabla de control agrupada por producto (decide) y campaña (ejecuta); gasto fuera de plan aparte; puntos para revisar priorizados con evidencia; historial mes a mes; definiciones.
- Esperado = asignado × días transcurridos ÷ días del periodo (inclusivos), o la curva aprobada. Pacing = gasto ÷ esperado. Desvío = gasto − esperado. Diario requerido = saldo positivo ÷ días restantes. Proyección = gasto ÷ proporción transcurrida (la misma de `bitacora inversion` en Media Bridge). Estado con los umbrales del framework: ±5 % normal, ±15 % observación, ±30 % acción, más allá crítico; los umbrales son editables en la hoja.
- Una fila por asignación, sin solapamientos. Asignado vacío = fuera de plan, y no entra al pacing.

### 6. Tablero de seguimiento

**Base** [Tablero de seguimiento](tablero-seguimiento.html) · tablero · [resultados y cierre mensual](../framework/operacion-tactica.html), puntos 05 y 42.

- Anatomía de los tableros de universidades: barra de filtros (rangos rápidos, fechas, programa, nivel, medio), cifras clave (inversión, leads de plataforma, leads CRM, costo por lead, inscritos, admitidos, matriculados, ejecución de presupuesto y cumplimiento de meta), embudo CRM por etapa, vistas por programa, mes a mes y por medio, y notas de medición con fuente y corte.
- Costo por resultado = suma de gasto ÷ suma de resultados. Cumplimiento = resultados ÷ meta del mismo alcance. Mismos filtros en los dos periodos y ventanas equivalentes. Los leads de plataforma y los del CRM conservan su definición y no se mezclan.
- La plantilla trae los datos embebidos para abrir con doble clic. En el repo del cliente se conecta a su hoja de datos como el tablero real.

### 7. Informe particular

**Base** [Informe particular](informe-particular.html) · tipo `INFORME` · [requisitos del framework](../framework/operacion-tactica.html#requisitos), puntos 35 a 41.

- Responde una pregunta concreta. Anatomía: portada con la pregunta y la respuesta en la entradilla, ficha (periodo, fuente que manda, alcance, resultado); índice; «En tres ideas»; cifras clave contra la ventana anterior; evolución con meta e hitos; desglose por campaña, programa, ángulo o pieza con columna de lectura; mejores piezas; hallazgos (lo que funciona, lo que presiona, lo que hay que mirar); medición y límites (quién cuenta qué: plataforma, GA4, CRM); acciones con responsable, fecha y criterio de verificación; anexo de fuentes.
- Los títulos afirman algo («El costo por registro se movió en tres tramos»), nunca «Resultados». Las dos ventanas tienen el mismo número de días. No se recomienda presupuesto si no se pidió. El script comprueba que los totales cuadren y lo muestra en el anexo.

### 8. Informe de cierre de periodo

**Base** [Informe de cierre](informe-cierre.html) · tipo `INFORME` · [cierre mensual y de periodo](../framework/operacion-tactica.html), puntos 42 y 43.

- Anatomía de los cierres de semestre: portada con periodo y ventana real de entrega; resumen general (inversión, leads de plataforma y CRM, costo por lead CRM, matrículas, costo por matrícula, conversión) con conclusión ejecutiva; resultados contra meta; ritmo mensual por medio; tabla por medio cruzada con CRM y validez; embudo plataforma → CRM → inscrito → admitido → matriculado; comparación con el periodo equivalente e histórico; nivel y programa; campañas, branding y eventos (siempre aparte, sin costo por lead); creativos destacados; contactabilidad si aplica; decisiones para el siguiente periodo.
- La meta institucional se compara con la matrícula total; la de pauta va aparte. El embudo marca solo la etapa con la mayor caída.

## Control antes de entregar

- Comprueba que el archivo abre, que no queden ejemplos mezclados con datos reales y que las referencias sean accesibles para su audiencia.
- Concilia periodos, moneda, unidades, cifras, porcentajes y fórmulas. Prueba filtros, estados vacíos y corte anterior cuando corresponda.
- Para HTML, revisa portada, tablas, imágenes y enlaces en escritorio y móvil. Revisa impresión si se compartirá en PDF.
- Revisa el archivo entero, incluidos comentarios, datos incrustados y anexos. Antes de publicar con Media Bridge, ejecuta la revisión de seguridad de entregables del cliente.
