# Kit de diseño Adcom v2

Todo lo necesario para llevar el sistema de diseño de Adcom a otro repositorio, o para construir una página
nueva con él. Este archivo es lo primero que hay que leer.

## Qué trae

| Carpeta o archivo | Para qué |
|---|---|
| `ESTANDARES-DISENO.md` | **La regla.** Colores, lima, tipografía, composición, componentes, diagramas, marca, verificación |
| `assets/css/adcom-v2.css` | La hoja del sistema: tokens y todos los componentes `ad-*` |
| `assets/ds/` | Fuentes locales (Inter Tight e Inter), isotipo, tokens y la guía de migración `MIGRACION.md` |
| `assets/logos/adcom-wordmark.png` | Wordmark oficial: el logo de los encabezados |
| `assets/favicon-adcom.png` | Favicon |
| `banco-formatos/componentes.html` | Galería viva de cada componente: ábrela con doble clic |
| `banco-formatos/pagina-base.html` | Página de arranque lista para copiar |
| `banco-formatos/formatos.css` | Estilos compartidos de las plantillas |
| `herramientas/auditar_v2.py` | Verificador: revisa que las páginas cumplan el estándar |
| `herramientas/replicar_v2.py` | Instalador: copia este kit a otro repo |
| `VERSION` | De qué versión de `adcom` salió el kit |

No hace falta instalar nada salvo **Python 3.9 o superior**. No hay dependencias ni paso de compilación: todo es
HTML y CSS estático.

## Para verlo en 1 minuto

Descomprime el zip y abre `banco-formatos/componentes.html` y `banco-formatos/pagina-base.html` con doble clic.
Eso es lo que el sistema produce.

## Para llevarlo a un repositorio (lo recomendado)

Descomprime el zip en cualquier carpeta y, desde ella:

```text
python -I herramientas/replicar_v2.py --repos "C:\ruta\al\repo"            # simula: no escribe nada
python -I herramientas/replicar_v2.py --repos "C:\ruta\al\repo" --ejecutar # copia de verdad
```

Qué hace: agrega al repo destino las fuentes, el wordmark y el isotipo, la hoja, el estándar, el verificador, la galería y la
página base, con las mismas rutas; deja un bloque en su `AGENTS.md` para asistentes de IA y un `.adcom-v2.json`
con la versión de origen. **Solo agrega archivos**: no toca las páginas existentes ni hace commit. Revisa con
`git status` y haz el commit tú.

Para actualizar más adelante: descarga el kit nuevo y vuelve a correr el mismo comando. Las copias se regeneran;
lo tuyo no se toca. Los archivos del kit no se editan en el repo destino.

## Para hacerlo a mano

1. Copia `assets/` completo, `ESTANDARES-DISENO.md`, `herramientas/` y `banco-formatos/` al repo, **con las
   mismas rutas** (los enlaces de la galería y de la página base dependen de ellas).
2. En el `<head>` de cada página:

   ```html
   <link rel="stylesheet" href="assets/ds/fonts.css">
   <link rel="stylesheet" href="assets/css/adcom-v2.css?v=AAAAMMDD">
   <link rel="icon" type="image/png" href="assets/favicon-adcom.png">
   ```

   (desde una subcarpeta, antepone `../` por cada nivel). Sin Google Fonts.
3. Página nueva: copia `banco-formatos/pagina-base.html` y reemplaza el contenido.
4. Página que ya existe: sigue `assets/ds/MIGRACION.md`. Cambia la capa visual; el contenido, los datos y el
   JavaScript no cambian. Hazlo **de a una página**, empezando por el portal y un tablero.
5. Verifica: `python -I herramientas/auditar_v2.py` debe dar 0 salvo los colores de estado provisionales, y mira
   la página a 1440 y 390 px.

## Si lo va a usar una IA

Dile que lea `ESTANDARES-DISENO.md` primero y que parta de `pagina-base.html`. El instalador ya deja esa
instrucción en el `AGENTS.md` del repo. Un buen encargo:

> Lee ESTANDARES-DISENO.md y assets/ds/MIGRACION.md. Migra [página] al sistema v2 sin cambiar el contenido ni
> el JavaScript, usando los componentes de banco-formatos/componentes.html. Al terminar corre
> `python -I herramientas/auditar_v2.py` y revisa la página a 1440 y 390 px.

## Cosas que conviene saber

- **La versión del CSS importa.** El enlace lleva `?v=AAAAMMDD`. Si cambias la hoja, sube ese número en las
  páginas que la enlazan; si no, el navegador muestra la versión vieja y la página se ve sin estilos.
- **No mezcles los dos sistemas en una página.** El sistema anterior (amarillo y Poppins) sigue vigente en
  algunos repos de cliente; una página usa v1 o v2, no los dos.
- **La lima** es siempre relleno con texto negro: nunca texto ni línea. Está explicado en el estándar, sección 3.
- **Privacidad.** Las plantillas usan un cliente ficticio. No pegues datos reales de clientes en lo que vayas a
  compartir.
- Los enlaces «Banco de formatos» y «Adcom» de la galería apuntan a páginas que no vienen en este kit; es
  normal.
- Los colores de estado (verde, rojo, ámbar) son provisionales. Las decisiones tomadas y las que siguen
  abiertas están en la sección 16 del estándar.
