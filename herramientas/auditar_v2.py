"""Audita el repo contra los estándares de diseño v2 (ver ESTANDARES-DISENO.md, sección 13).

Cuenta, por archivo HTML/CSS/JS: amarillo del sistema anterior, Poppins, sombras, mayúsculas forzadas,
radios fuera de norma, colores fuera de paleta, degradados, emoji, exclamaciones, lang y fuentes.
Objetivo: 0 en todo salvo los colores de estado provisionales (verde, rojo y ámbar).

Uso (desde la raíz del repo):
    python -I herramientas/auditar_v2.py            # audita todo el repo
    python -I herramientas/auditar_v2.py ruta --detalle
"""
import re
import sys
from pathlib import Path

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
ROOT = Path(ARGS[0]) if ARGS else Path(__file__).resolve().parent.parent
DETALLE = "--detalle" in sys.argv

EXCLUIR = ("_archivo", "mockups", "safe-zones", "logos", ".git", "sistema", "tools", "ds")
# Copias generadas por sistema/sync.ps1: se auditan aparte, no se editan.
GENERADOS = {"assets/css/adcom.css", "assets/css/adcom-tokens.css", "assets/js/adcom.js"}

PALETA = {
    "#f7f6f2", "#ffffff", "#fff", "#efede7", "#e4e2dc", "#d6d3cb", "#141414", "#4a4a46",
    "#6b6b66", "#8a8a84", "#d8ff3d", "#16233a", "#0e0e27", "#0e0e0f", "#c9c9c4", "#a8a8a2",
    "#a9b3c4", "#c9d0db", "#14153a", "#2e3d57", "#2e3057", "#3b3d66", "#1e2050", "#2a2d63",
    "#8e96b8", "#6f77a0", "#000", "#000000",
}

CHEQUEOS = {
    "fuente_poppins": re.compile(r"Poppins", re.I),
    "amarillo_viejo": re.compile(r"#(ffd400|ffc000|ffdf3d|ffe86a|7d6800|3d3300|ffd43b)\b", re.I),
    "sombra": re.compile(r"box-shadow\s*:\s*(?!none)[^;}{]*\d", re.I),
    "mayusculas": re.compile(r"text-transform\s*:\s*uppercase", re.I),
    "degradado": re.compile(r"(linear|radial|conic)-gradient\((?![^)]*transparent)", re.I),
}
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")
RADIO = re.compile(r"border-radius\s*:\s*([^;}{]+)", re.I)
RADIOS_OK = re.compile(r"^(0|0px|2px|4px|6px|999px|50%|var\(--radius[^)]*\)|inherit)$")
TEXTO_VISIBLE = re.compile(r">([^<>]{2,})<")
EXCLAMA = re.compile(r"[!¡]")


def archivos():
    for p in ROOT.rglob("*"):
        rel = p.relative_to(ROOT).as_posix()
        if not p.is_file() or any(part in EXCLUIR for part in p.relative_to(ROOT).parts):
            continue
        if p.suffix.lower() in (".html", ".css", ".js") and rel not in GENERADOS:
            yield rel, p


def main():
    total = {}
    filas = []
    for rel, p in sorted(archivos()):
        t = p.read_text(encoding="utf-8", errors="replace")
        f = {k: len(rx.findall(t)) for k, rx in CHEQUEOS.items()}
        hexes = [h.lower() for h in HEX.findall(t)]
        fuera = [h for h in hexes if h not in PALETA and len(h) in (4, 7)]
        f["hex_fuera_paleta"] = len(fuera)
        radios = [r.strip() for r in RADIO.findall(t)]
        f["radio_fuera"] = sum(1 for r in radios if not all(RADIOS_OK.match(x) for x in r.split()))
        if p.suffix == ".html":
            visibles = " ".join(m.group(1) for m in TEXTO_VISIBLE.finditer(re.sub(r"<(script|style)[\s\S]*?</\1>", "", t)))
            f["emoji"] = len(EMOJI.findall(visibles))
            f["exclamacion"] = len(EXCLAMA.findall(visibles))
            f["sin_lang_es"] = 0 if re.search(r'<html[^>]*lang="es', t) else 1
            f["sin_inter"] = 0 if ("Inter+Tight" in t or "url=" in t.lower() or "ds/fonts.css" in t) else 1
        filas.append((rel, f, sorted(set(fuera))[:12]))
        for k, v in f.items():
            total[k] = total.get(k, 0) + v

    claves = sorted(total)
    print(f"{'archivo':58} " + " ".join(f"{k[:11]:>11}" for k in claves))
    for rel, f, fuera in filas:
        if any(f.values()):
            print(f"{rel[:58]:58} " + " ".join(f"{f.get(k, 0) or '':>11}" for k in claves))
            if DETALLE and fuera:
                print("    hex fuera de paleta:", ", ".join(fuera))
    print(f"{'TOTAL':58} " + " ".join(f"{total[k]:>11}" for k in claves))


if __name__ == "__main__":
    main()
