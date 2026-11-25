# Adcom · repositorio de documentos del área digital

HTML estático, sin build ni dependencias: se abre con doble clic en `index.html` o con
`python -m http.server`. Contiene el portal, el framework del área, el playbook creativo, los tableros, los
informes y el **Banco de formatos** (plantillas que el equipo copia para construir entregables de clientes).

## Diseño: el estándar manda

Todo trabajo visual sigue **`ESTANDARES-DISENO.md`** (sistema v2: washi, sumi y lima; Inter Tight e Inter).
Léelo antes de crear o cambiar una página. Si choca con `sistema/DESIGN.md` o con
`informes/LINEAMIENTOS_DISENO_REPOSITORIOS.md`, manda `ESTANDARES-DISENO.md`: esos describen el sistema
anterior, que solo sigue vigente en los repos de cliente.

Lo esencial, para no olvidarlo:

1. **Componentes, no CSS suelto.** Todo sale de las clases `ad-*` de `assets/css/adcom-v2.css`. La galería con
   cada pieza y su marcado es `banco-formatos/componentes.html`. Si falta una pieza, se crea en
   `adcom-v2.css` con prefijo `ad-` y solo con tokens, y se documenta en la galería.
2. **Página nueva:** copia `banco-formatos/pagina-base.html`. Las páginas no densas se componen en secciones
   (`.ad-sec`) que alternan fondo, con un diagrama protagonista según la lógica de la página y un cierre
   `.ad-cierre`. Tableros e informes de datos mantienen fondo claro.
3. **Lima:** siempre relleno con texto `sumi`; nunca texto ni línea. Marca lo que se pulsa y una cosa por
   bloque, entre 4 y 10 rellenos por página. `.ad-estado--ok` no se rellena.
4. **Encabezado:** `.ad-marca` con el isotipo oficial. Nunca «Adcom» escrito como logotipo ni logos de cliente.
5. **Fuentes locales** (`assets/ds/fonts.css`): nada de Google Fonts. Hojas con `?v=AAAAMMDD`: al editar una,
   sube el número en las páginas que la enlazan.
6. **Sin sombras ni degradados decorativos, sin mayúsculas forzadas, sin emoji ni exclamaciones.** Titulares
   que afirman; cifras con punto de millar y `&nbsp;` antes de `%` y `M`; un valor ausente es «Sin dato».

## Antes de dar algo por terminado

1. `python -I herramientas/auditar_v2.py` debe dar 0 salvo los colores de estado provisionales.
2. Mira la página de verdad a 1440 y 390 px (sin scroll horizontal, consola limpia). Recarga sin caché.
3. La lista completa está en la sección 13 de `ESTANDARES-DISENO.md`.

## Privacidad

`banco-formatos/` usa un cliente ficticio («Universidad Andina» o «Marca Ejemplo») con cifras inventadas.
Nunca nombres de clientes reales, IDs de cuenta, URLs de hojas o dashboards, personas ni credenciales. Los
dumps de datos (`.json`, `.csv`, exports) no van al repo; solo entra el informe ya construido (ver `.gitignore`).

## Cambios que no se hacen sin preguntar

- `sistema/` y `sistema/sync.ps1`: regeneran el sistema anterior a 14 repos de cliente.
- `assets/ds/`: exportación oficial del sistema de diseño; si falta algo, se resuelve en la página o en
  `adcom-v2.css` y se avisa.
- Datos, cifras y textos sustantivos de un informe: el rediseño cambia la capa visual, no el contenido.
