# sistema

El lenguaje visual de los documentos de cliente de Adcom. Lo comparten todos los repos
de la organización.

**Dos suelos.** Cada documento elige uno en el `<html>` y no lo cambia:

```html
<html lang="es">                      papel: fondo claro
<html lang="es" data-suelo="tinta">   tinta: fondo oscuro
```

Todo lo demás (estructura, escala, contenedores, índice, gráficos, vocabulario) es
idéntico en los dos. Solo cambia el juego de tokens. En `@media print` el sistema
redeclara los tokens al suelo claro, así que un documento en tinta imprime bien.

**Esta carpeta es la fuente de verdad.** Las copias que viven en cada repo
(`assets/css/adcom.css`, `assets/js/adcom.js`) las genera `sync.ps1` y se sobrescriben.
Editar una copia es perder el cambio en el siguiente sync.

```
sistema/
├── adcom.css     el sistema: tokens, vocabulario, compatibilidad, impresión
├── adcom.js      motion del dato + conteos del índice
├── DESIGN.md     qué es, por qué, y cómo cambiarlo
├── sync.ps1      copia a los repos
└── README.md
```

## Hacer un ajuste

```powershell
cd adcom\sistema
# editar adcom.css
.\sync.ps1 -DryRun            # qué haría
.\sync.ps1                    # copia y dice qué commitear
```

| Parámetro | Para qué |
|---|---|
| `-Repos cesde,raza` | Solo esos |
| `-DryRun` | Reporta y no escribe |

El script deja los repos con los archivos cambiados, sin commitear: cada repo se
commitea por separado porque cada uno es su propio repositorio de GitHub. Al final
imprime la línea de `git` lista para cada uno.

## Ámbito

Los 14 repos de `adcomgroupco`: `adcom`, `betplay`, `catolica`, `cesde`, `compensar`,
`corpas`, `eia`, `gana`, `genius`, `raza`, `ris`, `uan`, `westfield`, `yajuego`.

Fuera: **`loyevo`** (decisión del cliente interno) y **`otros`** (repo de borrador).
Si agregas un repo a la organización, súmalo a `$AmbitoCompleto` en `sync.ps1`.

## Enlazarlo desde un documento

Desde la raíz de un repo:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="assets/css/adcom.css">
<script defer src="assets/js/adcom.js"></script>
```

Desde `pages/`, con `../` delante de las dos rutas locales.

## Antes de escribir un documento nuevo

Lee **DESIGN.md**. En particular:

- **Los contenedores**: por qué solo la ficha del índice es una caja.
- **El momento invertido**: `.slab` una vez por documento, o ninguna.
- **Lo que no se hace**: la lista, con la razón de cada punto.

Lo que hay que saber de memoria: el amarillo `#ffd400` da **1.3:1** sobre papel y
ahí no sirve como texto ni como relleno de barra; sobre tinta da **14.2:1** y sí
sirve. Por eso existe `--accent-fg`, que resuelve el amarillo correcto para el suelo
que sea. Encima de un relleno amarillo, el texto va en `--accent-ink` (8.8:1).

## El framework

`adcom/framework/` tiene su propio sistema (radio 20px, nueve roles tipográficos) y
no entra a este sync. Pero su suelo oscuro **sí** es el origen del suelo tinta: es
la declaración canónica de la marca. No mezclar los dos archivos; sí tomar el
framework como referencia de que la casa es oscura tanto como es clara.
