"""Replica el kit de diseño v2 de adcom en otro repo (ver ESTANDARES-DISENO.md, sección 15).

Copia: las fuentes y el isotipo (assets/ds/), la hoja del sistema (assets/css/adcom-v2.css), el favicon, el
estándar, el verificador, la galería de componentes y la página base. Y deja una nota en AGENTS.md del repo
destino para que un asistente de IA siga el estándar.

No toca las páginas del repo destino ni el sistema anterior (adcom.css, sync.ps1): solo AGREGA archivos.
Migrar cada página a v2 es un paso aparte (assets/ds/MIGRACION.md).

Por defecto SIMULA y no escribe nada. Con --ejecutar copia. No hace commit: imprime la línea de git.

Uso (desde la raíz de adcom):
    python -I herramientas/replicar_v2.py --repos cesde                 # simula en ..\\cesde
    python -I herramientas/replicar_v2.py --repos cesde,raza --ejecutar
    python -I herramientas/replicar_v2.py --repos C:\\ruta\\al\\repo     # una ruta cualquiera
    python -I herramientas/replicar_v2.py --todos                       # simula en todo el ámbito
"""
import argparse
import hashlib
import json
import subprocess
import sys
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# Mismo ámbito que sistema/sync.ps1.
AMBITO = ["betplay", "catolica", "cesde", "compensar", "corpas", "eia", "gana", "genius", "raza", "ris",
          "uan", "yajuego"]
FUERA_DE_AMBITO = {
    "loyevo": "fuera por decisión del cliente interno",
    "otros": "repo de borrador",
    "westfield": "fuera por decisión del cliente interno: conserva su diseño propio",
}

# Archivos y carpetas del kit, con la misma ruta relativa en el destino (así los enlaces ../assets/… de la
# galería y de la página base siguen funcionando).
KIT = [
    "assets/css/adcom-v2.css",
    "assets/ds",
    "assets/favicon-adcom.png",
    "ESTANDARES-DISENO.md",
    "herramientas/auditar_v2.py",
    "banco-formatos/componentes.html",
    "banco-formatos/pagina-base.html",
    "banco-formatos/formatos.css",
]

MARCA_I, MARCA_F = "<!-- adcom-v2:inicio -->", "<!-- adcom-v2:fin -->"
BLOQUE = f"""{MARCA_I}
## Diseño v2 (kit de adcom)

Este repo incluye el kit de diseño v2 de `adcom`. El estándar es **`ESTANDARES-DISENO.md`**: léelo antes de
crear o cambiar una página. Lo esencial: componentes `ad-*` de `assets/css/adcom-v2.css` (galería en
`banco-formatos/componentes.html`), página nueva a partir de `banco-formatos/pagina-base.html`, lima solo como
relleno con texto sumi, fuentes locales (`assets/ds/fonts.css`) e isotipo oficial. Para migrar una página
existente sigue `assets/ds/MIGRACION.md`. Verifica con `python -I herramientas/auditar_v2.py`.
Los archivos del kit se regeneran con `herramientas/replicar_v2.py` desde `adcom`: no se editan aquí.
{MARCA_F}
"""


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def archivos_del_kit():
    """Devuelve [(origen, ruta_relativa)] expandiendo carpetas."""
    salida = []
    for rel in KIT:
        origen = RAIZ / rel
        if not origen.exists():
            sys.exit(f"Falta en el origen: {rel}")
        if origen.is_dir():
            for f in sorted(origen.rglob("*")):
                if f.is_file():
                    salida.append((f, f.relative_to(RAIZ).as_posix()))
        else:
            salida.append((origen, rel))
    return salida


def commit_origen() -> str:
    # Dentro del kit empaquetado no hay git: la versión viene en el archivo VERSION (empaquetar_kit.py).
    version = RAIZ / "VERSION"
    if version.exists():
        for linea in version.read_text(encoding="utf-8").splitlines():
            if linea.startswith("commit="):
                return linea.split("=", 1)[1].strip()
    try:
        r = subprocess.run(["git", "-C", str(RAIZ), "rev-parse", "--short", "HEAD"], capture_output=True,
                           text=True, check=True)
        return r.stdout.strip()
    except Exception:
        return "desconocido"


def resolver(repo: str) -> Path:
    p = Path(repo)
    return p if p.is_absolute() or p.exists() else RAIZ.parent / repo


def replicar(destino: Path, ejecutar: bool, forzar_ambito: bool):
    nombre = destino.name.lower()
    if nombre in FUERA_DE_AMBITO and not forzar_ambito:
        print(f"  {destino.name} omitido: {FUERA_DE_AMBITO[nombre]} (usa --forzar-ambito para saltarlo)")
        return None
    if not destino.is_dir():
        print(f"  {destino} no existe: clónalo o revisa el nombre")
        return None
    if destino.resolve() == RAIZ:
        print("  El destino es adcom mismo: nada que replicar")
        return None
    sucio = ""
    if (destino / ".git").exists():
        r = subprocess.run(["git", "-C", str(destino), "status", "--porcelain"], capture_output=True, text=True)
        if r.stdout.strip():
            sucio = " (tiene cambios sin commitear: se agregan encima, revisa antes de commitear)"

    cambios = []
    for origen, rel in archivos_del_kit():
        dest = destino / rel
        if not dest.exists():
            accion = "crea"
        elif sha(origen) != sha(dest):
            accion = "actualiza"
        else:
            continue
        cambios.append((accion, rel))
        if ejecutar:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(origen.read_bytes())

    # Nota para asistentes de IA en AGENTS.md (se crea, o se agrega/actualiza solo el bloque marcado).
    agentes = destino / "AGENTS.md"
    previo = agentes.read_text(encoding="utf-8") if agentes.exists() else None
    if previo is None:
        nuevo, accion = f"# {destino.name}\n\n{BLOQUE}", "crea"
    elif MARCA_I in previo and MARCA_F in previo:
        i, f = previo.index(MARCA_I), previo.index(MARCA_F) + len(MARCA_F)
        nuevo = previo[:i] + BLOQUE.rstrip("\n") + previo[f:]
        accion = "actualiza" if nuevo != previo else None
    else:
        nuevo, accion = previo.rstrip("\n") + "\n\n" + BLOQUE, "actualiza"
    if accion:
        cambios.append((accion, "AGENTS.md (bloque del kit)"))
        if ejecutar:
            agentes.write_text(nuevo, encoding="utf-8", newline="\n")
    claude = destino / "CLAUDE.md"
    if not claude.exists():
        cambios.append(("crea", "CLAUDE.md"))
        if ejecutar:
            claude.write_text("# " + destino.name + "\n\n@AGENTS.md\n", encoding="utf-8", newline="\n")

    # Marca de versión, para saber de dónde viene y cuándo se copió.
    marca = destino / ".adcom-v2.json"
    estado = {"origen": "adcom", "commit": commit_origen(), "copiado": date.today().isoformat()}
    texto = json.dumps(estado, indent=2) + "\n"
    if not marca.exists() or marca.read_text(encoding="utf-8") != texto:
        cambios.append(("actualiza" if marca.exists() else "crea", ".adcom-v2.json"))
        if ejecutar:
            marca.write_text(texto, encoding="utf-8", newline="\n")

    print(f"  {destino.name}{sucio}")
    if not cambios:
        print("     al día")
    for accion, rel in cambios[:40]:
        print(f"     {accion:10} {rel}")
    if len(cambios) > 40:
        print(f"     … y {len(cambios) - 40} más")
    return cambios


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--repos", help="Nombres (hermanos de adcom) o rutas, separados por coma")
    ap.add_argument("--todos", action="store_true", help="Todo el ámbito de sistema/sync.ps1")
    ap.add_argument("--ejecutar", action="store_true", help="Copia de verdad (por defecto solo simula)")
    ap.add_argument("--forzar-ambito", action="store_true", help="Permite repos fuera del ámbito")
    a = ap.parse_args()
    if not a.repos and not a.todos:
        ap.error("indica --repos nombre[,nombre] o --todos")
    repos = AMBITO if a.todos else [r.strip() for r in a.repos.split(",") if r.strip()]

    sys.stdout.reconfigure(encoding="utf-8")
    print("\nEJECUTANDO.\n" if a.ejecutar else "\nSIMULACIÓN: no se escribe nada. Usa --ejecutar para copiar.\n")
    tocados = []
    for repo in repos:
        destino = resolver(repo)
        if replicar(destino, a.ejecutar, a.forzar_ambito):
            tocados.append(destino)
    if a.ejecutar and tocados:
        print("\nFalta commitear en cada repo (después de revisar el diff):")
        for d in tocados:
            print(f'  cd "{d}"; git add -A; git commit -m "Agrega el kit de diseño v2 de adcom"')
    print()


if __name__ == "__main__":
    main()
