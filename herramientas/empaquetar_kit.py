"""Empaqueta el kit de diseño v2 en un .zip para compartirlo (ver ESTANDARES-DISENO.md, sección 15).

El zip funciona SIN el repo adcom: trae el kit, el estándar, el verificador, el instalador (replicar_v2.py), un
LEEME.md con los pasos y un archivo VERSION. Quien lo reciba lo descomprime y sigue el LEEME.

Usa la misma lista de archivos que replicar_v2.py, así el zip y el instalador no se desalinean.

Uso (desde la raíz de adcom):
    python -I herramientas/empaquetar_kit.py                       # deja el zip en la carpeta Descargas
    python -I herramientas/empaquetar_kit.py --salida C:\\ruta     # otra carpeta
Reglas del repo: el zip es un entregable, no se guarda dentro del repo (.gitignore ignora *.zip).
"""
import argparse
import subprocess
import sys
import zipfile
from datetime import date
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
from replicar_v2 import RAIZ, archivos_del_kit  # noqa: E402

EXTRAS = [  # (origen, ruta dentro del zip)
    (AQUI / "replicar_v2.py", "herramientas/replicar_v2.py"),
    (AQUI / "LEEME-kit.md", "LEEME.md"),
]


def commit() -> str:
    try:
        r = subprocess.run(["git", "-C", str(RAIZ), "rev-parse", "--short", "HEAD"], capture_output=True,
                           text=True, check=True)
        return r.stdout.strip()
    except Exception:
        return "desconocido"


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--salida", help="Carpeta donde dejar el zip (por defecto, Descargas)")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    carpeta = Path(a.salida) if a.salida else Path.home() / "Downloads"
    carpeta.mkdir(parents=True, exist_ok=True)
    hoy = date.today().isoformat()
    destino = carpeta / f"Adcom-kit-diseno-v2-{hoy}.zip"
    raiz_zip = "Adcom-kit-diseno-v2"

    n = 0
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        for origen, rel in archivos_del_kit():
            z.write(origen, f"{raiz_zip}/{rel}")
            n += 1
        for origen, rel in EXTRAS:
            if not origen.exists():
                sys.exit(f"Falta: {origen}")
            z.write(origen, f"{raiz_zip}/{rel}")
            n += 1
        z.writestr(f"{raiz_zip}/VERSION", f"origen=adcom\ncommit={commit()}\nempaquetado={hoy}\n")
        n += 1
    print(f"\nKit empaquetado: {destino}")
    print(f"  {n} archivos · {destino.stat().st_size / 1024:.0f} KB")
    print(f"  Dentro del zip: {raiz_zip}/LEEME.md es lo primero que hay que leer.\n")


if __name__ == "__main__":
    main()
