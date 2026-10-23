"""Generate local SVG mockups for the Creative Media Playbook.

The ads, brands and offers below are fictional. SVGs are editorial examples,
not platform screenshots or current ad specifications.
"""

import base64
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "mockups"
OUT.mkdir(parents=True, exist_ok=True)
PHOTO_DIR = ROOT / "assets" / "photos"
PHOTO_BY_ID = {
    "meta-reels": "plants", "meta-stories": "travel", "meta-carrusel": "sneakers",
    "meta-collection": "perfume", "meta-instant": "living-room", "meta-mensajes": "skincare",
    "tik-infeed": "coffee", "tik-spark": "sneakers", "tik-addons": "skincare",
    "tik-votacion": "perfume", "tik-countdown": "breakfast",
    "goo-search": "living-room", "goo-shopping": "perfume", "goo-instream": "coffee",
    "goo-shorts": "plants", "goo-demand": "travel", "goo-display": "headphones",
    "pro-display": "headphones", "pro-native": "living-room", "pro-rich": "perfume",
    "pro-high": "travel", "pro-game": "sneakers", "pro-dco": "rainy-car",
    "pro-realtime": "breakfast", "ctv-video": "travel", "ctv-pause": "skincare",
    "ctv-mobile": "coffee", "ctv-shop": "living-room", "dooh-screen": "breakfast",
    "dooh-motion": "sneakers", "dooh-daypart": "breakfast", "dooh-data": "rainy-car",
    "dooh-special": "travel",
}
PHOTO_DATA = {}
ACTIVE_PHOTO = "plants"


def photo(x, y, w, h, name=None):
    name = name or ACTIVE_PHOTO
    if name not in PHOTO_DATA:
        PHOTO_DATA[name] = base64.b64encode((PHOTO_DIR / f"{name}.jpg").read_bytes()).decode("ascii")
    return (f'<image x="{x}" y="{y}" width="{w}" height="{h}" '
            f'preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,{PHOTO_DATA[name]}"/>')


def photo_tile(x, y, w, h, name, label=None):
    out = [r(x, y, w, h, "#ddd", 7), photo(x, y, w, h, name)]
    if label:
        out += [r(x, y + h - 34, w, 34, "#101010bb"), t(x + 10, y + h - 11, label, 14, "#fff", 700)]
    return "".join(out)

ITEMS = {
    "meta-reels": ("META", "Reels", "Video vertical en el feed", "NOMA", "Un cambio que se nota", "#db805c", "phone-video"),
    "meta-stories": ("META", "Stories", "Secuencia a pantalla completa", "LUMA", "Tu próximo plan empieza aquí", "#5a93bd", "phone-story"),
    "meta-carrusel": ("META", "Carrusel", "Tarjetas que avanzan", "CASA", "Una idea, tres formas", "#be9e63", "phone-carousel"),
    "meta-collection": ("META", "Collection", "Portada y catálogo", "MODO", "Explora la colección", "#9c876e", "phone-collection"),
    "meta-instant": ("META", "Instant Experience", "Experiencia móvil inmersiva", "NOMA", "Entra en la historia", "#7978b8", "phone-instant"),
    "meta-mensajes": ("META", "Mensajes y leads", "Respuesta dentro del entorno", "TALLER", "Hablemos de tu proyecto", "#6a9e8b", "phone-leads"),
    "tik-infeed": ("TIKTOK", "In-Feed", "Video nativo en pantalla completa", "MODO", "Así se usa de verdad", "#e37286", "tiktok-video"),
    "tik-spark": ("TIKTOK", "Spark Ads", "Publicación orgánica amplificada", "NOMA", "Lo probé durante una semana", "#ba89ad", "tiktok-spark"),
    "tik-addons": ("TIKTOK", "Interactive Add-Ons", "Elemento tocable sobre el video", "CASA", "Descubre el detalle", "#e18862", "tiktok-addon"),
    "tik-votacion": ("TIKTOK", "Votación", "La audiencia elige", "LUMA", "¿Cuál va contigo?", "#789dce", "tiktok-poll"),
    "tik-countdown": ("TIKTOK", "Cuenta atrás", "Expectativa con fecha", "MODO", "Falta muy poco", "#c59671", "tiktok-countdown"),
    "goo-search": ("GOOGLE", "Search responsive", "Anuncio en una búsqueda", "TALLER", "Diseño para espacios reales", "#6f98bc", "search"),
    "goo-shopping": ("GOOGLE", "Shopping", "Producto, precio y comercio", "CASA", "Encuentra tu favorita", "#b9a070", "shopping"),
    "goo-instream": ("GOOGLE", "YouTube in-stream", "Video dentro de otro video", "NOMA", "Una historia en pantalla", "#b66f66", "youtube"),
    "goo-shorts": ("GOOGLE", "YouTube Shorts", "Video vertical con UI de Shorts", "LUMA", "En 15 segundos", "#74a8a4", "shorts"),
    "goo-demand": ("GOOGLE", "Demand Gen", "Una idea en varias superficies", "MODO", "Descubre algo nuevo", "#9678b9", "demand"),
    "goo-display": ("GOOGLE", "Display adaptable", "Recursos en un sitio web", "CASA", "Renueva tu espacio", "#80a894", "display"),
    "pro-display": ("PROGRAMÁTICA", "Banner clásico", "Una idea en poco espacio", "NOMA", "Una pausa para ti", "#a887b5", "banner"),
    "pro-native": ("PROGRAMÁTICA", "Native", "Anuncio integrado en contenido", "TALLER", "Ideas para empezar", "#8c9c75", "native"),
    "pro-rich": ("PROGRAMÁTICA", "Rich media", "El banner se expande", "MODO", "Explora los detalles", "#8a85c0", "rich"),
    "pro-high": ("PROGRAMÁTICA", "Takeover", "La marca ocupa la página", "NOMA", "Hoy es el día", "#c28678", "takeover"),
    "pro-game": ("PROGRAMÁTICA", "Gamificación", "Una elección dentro del anuncio", "CASA", "Elige tu estilo", "#c69c67", "game"),
    "pro-dco": ("PROGRAMÁTICA", "DCO", "Una plantilla, dos variantes", "LUMA", "El mensaje cambia", "#80a1c1", "dco"),
    "pro-realtime": ("PROGRAMÁTICA", "Datos en tiempo real", "Dato, regla y pieza de respaldo", "MODO", "El contexto importa", "#8eaaa1", "realtime"),
    "ctv-video": ("CTV", "In-stream", "Spot en pantalla grande", "NOMA", "Una historia para ver juntos", "#a37d9b", "tv-video"),
    "ctv-pause": ("CTV", "Pause ad", "Anuncio durante la pausa", "CASA", "Mira más de cerca", "#b69771", "tv-pause"),
    "ctv-mobile": ("CTV", "TV a móvil", "Escanea y continúa", "LUMA", "Llévate la idea", "#6a9ba9", "tv-mobile"),
    "ctv-shop": ("CTV", "Compra con control", "Selección con control remoto", "MODO", "Explora desde el sofá", "#b27c93", "tv-shop"),
    "dooh-screen": ("DOOH", "Pantalla digital", "Mensaje para leer de paso", "NOMA", "Haz una pausa", "#c18c69", "street-screen"),
    "dooh-motion": ("DOOH", "Motion y gran formato", "Secuencia en una pantalla urbana", "LUMA", "La ciudad se mueve", "#6c9bb4", "street-motion"),
    "dooh-daypart": ("DOOH", "Hora y localización", "Una pieza según el momento", "CASA", "El momento indicado", "#c0a573", "street-daypart"),
    "dooh-data": ("DOOH", "Data-triggered", "Variante por contexto disponible", "MODO", "Una idea oportuna", "#6e9f9b", "street-data"),
    "dooh-special": ("DOOH", "Activación especial", "Pantalla y acción en el lugar", "TALLER", "Participa aquí", "#b887a7", "street-special"),
}


def r(x, y, w, h, fill, radius=0, stroke=None, sw=1):
    edge = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}"{edge}/>'


def t(x, y, label, size=26, color="#f4f4f1", weight=600, anchor="start"):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}">{escape(label)}</text>'


def line(x1, y1, x2, y2, color="#777", sw=2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"/>'


def circle(x, y, radius, fill, stroke=None, sw=1):
    edge = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{fill}"{edge}/>'


def tag(x, y, label):
    return r(x, y, max(112, len(label) * 10 + 24), 34, "#ffd400", 6) + t(x + 12, y + 23, label, 15, "#252000", 700)


def art(x, y, w, h, accent, brand, headline, dark=False):
    out = [photo(x, y, w, h), r(x, y, w, h, "url(#photo-shade)"),
           t(x + w * .06, y + h * .12, brand, max(15, min(25, int(w * .065))), "#fff", 800)]
    if h > 180:
        first, second = two_lines(headline, max(13, int(w / 17)))
        size = max(17, min(34, int(w * .073)))
        out.append(t(x + w * .06, y + h * .77, first, size, "#fff", 700))
        if second:
            out.append(t(x + w * .06, y + h * .84, second, size, "#fff", 700))
    return "".join(out)


def two_lines(value, max_chars=21):
    words = value.split()
    first, second = [], []
    for word in words:
        if not second and len(" ".join(first + [word])) <= max_chars:
            first.append(word)
        else:
            second.append(word)
    return " ".join(first), " ".join(second)


def google(kind, brand, headline, accent):
    if kind == "youtube":
        out = [r(120, 144, 960, 508, "#f4f4f1", 12), r(120, 144, 960, 54, "#fff", 12),
               r(145, 157, 29, 24, "#f00", 6), t(160, 175, "▶", 14, "#fff", 700, "middle"),
               t(182, 178, "YouTube", 21, "#111", 800),
               r(386, 155, 380, 31, "#f8f8f8", 15, "#d8d8d8"),
               t(406, 176, "Buscar", 13, "#777", 500), t(831, 178, "⌕", 24, "#333", 500),
               t(955, 176, "▦   ●", 16, "#444", 600),
               r(146, 208, 620, 374, "#171718", 8), art(155, 216, 602, 358, accent, brand, headline, dark=True),
               circle(458, 386, 39, "#050505aa"), t(458, 401, "▶", 34, "#fff", 700, "middle"),
               r(173, 526, 166, 31, "#050505bb", 4), t(184, 548, "Anuncio · Omitir", 13, "#fff", 600),
               r(784, 208, 260, 374, "#fff", 5, "#d4d4d0"),
               t(799, 239, "Compra lo que ves", 17, "#111", 700)]
        for i, name in enumerate(["coffee", "skincare", "perfume", "headphones"]):
            px = 799 + (i % 2) * 119
            py = 251 + (i // 2) * 133
            out += [photo_tile(px, py, 108, 91, name), t(px, py + 109, f"Producto {i + 1}", 13, "#333", 600)]
        out += [r(800, 527, 228, 34, "#ffd400", 4), t(914, 549, "VER PRODUCTOS ↗", 13, "#111", 700, "middle"),
                t(148, 608, "Una historia en pantalla | NOMA", 16, "#111", 700),
                circle(164, 629, 11, "#111"), t(184, 634, "NOMA  ·  Patrocinado", 13, "#444", 600),
                r(669, 613, 85, 23, "#111", 11), t(711, 629, "Suscribirse", 11, "#fff", 700, "middle")]
        return "".join(out)
    if kind == "demand":
        out = [t(95, 157, "La misma idea se adapta al contexto", 27, "#f4f4f1", 700)]
        for i, label in enumerate(["YouTube", "Discover", "Gmail"]):
            x = 100 + i * 335
            out += [r(x, 204, 300, 400, "#f4f4f1", 13), r(x + 15, 226, 270, 42, "#e5e6e4", 6),
                    t(x + 32, 254, label, 18, "#111", 700), art(x + 15, 283, 270, 225, accent, brand, headline),
                    t(x + 22, 545, "Explorar →", 16, "#111", 700)]
        return "".join(out)
    out = [r(120, 144, 960, 508, "#f8f8f7", 12), t(155, 192, "Buscar", 24, "#333", 700),
           r(300, 159, 720, 49, "#fff", 22, "#d0d0ce"), t(333, 191, "Ideas para renovar mi espacio", 18, "#555", 500),
           line(145, 231, 1050, 231, "#e0e0dc")]
    if kind == "search":
        out += [tag(157, 257, "PATROCINADO"), t(157, 336, headline, 31, "#2155a3", 700),
                t(157, 374, "taller.ejemplo · Soluciones hechas para ti", 17, "#287054", 500),
                t(157, 416, "Conoce alternativas y encuentra el siguiente paso.", 18, "#333", 400),
                photo_tile(821, 282, 188, 151, "living-room"),
                line(157, 449, 1010, 449, "#ddd"), t(157, 494, "Más resultados de búsqueda", 22, "#555", 600)]
    elif kind == "shopping":
        out += [t(157, 279, "Productos destacados", 22, "#111", 700)]
        for i, name in enumerate(["perfume", "skincare", "headphones", "sneakers"]):
            x = 155 + i * 220
            out += [r(x, 302, 200, 245, "#eee", 8), photo_tile(x + 12, 313, 176, 160, name),
                    t(x + 13, 501, f"Producto {i+1}", 16, "#111", 700),
                    t(x + 13, 528, "$ precio demo", 14, "#4a4a47", 500)]
    else:
        out += [t(157, 271, "Noticias y contenido", 21, "#111", 700),
                r(157, 305, 534, 255, "#e5e5e2", 7), t(180, 351, "Artículo principal", 23, "#333", 700),
                line(180, 380, 620, 380, "#bbb"), line(180, 405, 580, 405, "#bbb"),
                art(720, 305, 310, 255, accent, brand, headline)]
    return "".join(out)


def browser(kind, brand, headline, accent):
    out = [r(100, 144, 1000, 510, "#f3f3f1", 12), r(100, 144, 1000, 42, "#deded9", 12),
           circle(128, 165, 6, "#b8b8b4"), circle(148, 165, 6, "#b8b8b4"),
           r(205, 155, 745, 20, "#f7f7f5", 9), t(142, 226, "REVISTA / CONTENIDO", 19, "#222", 700)]
    if kind == "takeover":
        out += [photo(112, 246, 976, 95), r(112, 246, 976, 95, "#0008"), t(600, 306, headline, 40, "#fff", 700, "middle"),
                photo(112, 355, 180, 285), photo(908, 355, 180, 285),
                r(309, 355, 582, 285, "#fff", 3), t(343, 406, "Contenido del sitio", 24, "#111", 700),
                line(343, 446, 836, 446, "#bbb"), line(343, 474, 800, 474, "#bbb")]
    elif kind == "native":
        out += [t(145, 284, "Recomendaciones para ti", 28, "#111", 700)]
        for i in range(3):
            x = 145 + i * 305
            out += [r(x, 315, 280, 280, "#fff", 7), photo_tile(x + 12, 327, 256, 162, "living-room" if i == 1 else ("coffee" if i == 0 else "travel")),
                    t(x + 14, 521, "Patrocinado" if i == 1 else "Artículo", 14, "#555", 600),
                    t(x + 14, 552, headline if i == 1 else "Ideas del día", 18, "#111", 700)]
    elif kind == "rich":
        out += [t(145, 303, "Contenido del sitio", 26, "#222", 700),
                line(145, 344, 650, 344, "#bbb"), line(145, 373, 617, 373, "#bbb"),
                r(705, 249, 320, 120, accent, 8), t(725, 303, "Banner", 25, "#fff", 700),
                r(654, 390, 430, 225, "#fff", 9, accent, 5), art(668, 404, 400, 146, accent, brand, headline),
                t(684, 585, "Se expande para explorar  ↗", 18, "#111", 700),
                line(862, 367, 862, 390, accent, 5)]
    elif kind == "game":
        out += [t(145, 303, "Contenido del sitio", 26, "#222", 700),
                r(650, 249, 390, 355, "#181818", 10), t(674, 303, headline, 25, "#fff", 700),
                photo_tile(675, 336, 160, 195, "sneakers"), photo_tile(851, 336, 160, 195, "living-room"),
                t(755, 560, "A", 23, "#fff", 700, "middle"), t(931, 560, "B", 23, "#111", 700, "middle")]
    elif kind in {"dco", "realtime"}:
        out += [t(145, 288, "La creatividad responde a una señal", 28, "#111", 700)]
        for i, label in enumerate(["SOLEADO", "LLUVIA" if kind == "dco" else "SIN DATO"]):
            x = 147 + i * 475
            out += [r(x, 322, 440, 230, "#151515", 8), photo(x + 10, 332, 420, 210, "breakfast" if i == 0 else "rainy-car"),
                    r(x + 10, 332, 420, 210, "#0007"),
                    t(x + 25, 367, label, 18, "#fff", 700),
                    t(x + 25, 434, "Sal y disfruta" if i == 0 else ("Plan para lluvia" if kind == "dco" else "Mensaje de respaldo"), 29, "#fff", 700)]
        out += [t(158, 593, "Dato autorizado  →  regla  →  variante  →  respaldo", 18, "#333", 600)]
    else:
        out += [t(145, 303, "Contenido del sitio", 26, "#222", 700),
                line(145, 345, 665, 345, "#bbb"), line(145, 373, 616, 373, "#bbb"),
                line(145, 401, 640, 401, "#bbb"), art(730, 275, 310, 260, accent, brand, headline),
                t(760, 571, "Anuncio · Explorar  ↗", 17, "#111", 700)]
    return "".join(out)


def tv(kind, brand, headline, accent):
    out = [r(115, 137, 970, 530, "#242424", 22, "#777", 3), r(130, 151, 940, 494, "#0d1828", 12),
           photo(142, 163, 916, 470), r(142, 163, 916, 470, "url(#photo-shade)"),
           r(537, 666, 128, 17, "#777", 5), r(492, 683, 220, 15, "#777", 7)]
    if kind == "tv-video":
        out += [t(180, 265, brand, 28, "#fff", 700), t(180, 502, headline, 43, "#fff", 700),
                r(164, 594, 680, 7, "#777", 3), r(164, 594, 260, 7, "#ffd400", 3),
                t(909, 607, "Anuncio", 18, "#fff", 600)]
    elif kind in {"tv-pause", "tv-mobile"}:
        out += [r(158, 176, 883, 434, "#10111399", 10), t(190, 231, "PAUSA", 22, "#fff", 700),
                t(190, 365, headline, 40, "#fff", 700),
                r(808, 300, 174, 174, "#fff", 6)]
        for row in range(6):
            for col in range(6):
                if (row * 3 + col * 5) % 4 != 0:
                    out.append(r(821 + col * 24, 313 + row * 24, 17, 17, "#171717"))
        out += [t(815, 508, "Escanea y continúa", 17, "#fff", 600)]
    else:
        out += [t(180, 255, brand, 28, "#fff", 700),
                r(375, 400, 545, 172, "#111e", 12), t(412, 450, "Elige con el control", 25, "#fff", 700)]
        for i, label in enumerate(["Opción A", "Opción B", "Más"]):
            x = 404 + i * 166
            out += [r(x, 478, 145, 65, "#ffd400" if i == 0 else "#fff", 8), t(x + 72, 518, label, 16, "#111", 700, "middle")]
    return "".join(out)


def street(kind, brand, headline, accent):
    out = [r(0, 111, 1200, 606, "#232b30"), r(0, 570, 1200, 147, "#303335"),
           r(50, 313, 180, 260, "#343e43"), r(920, 263, 200, 310, "#3d464a"),
           r(226, 205, 730, 372, "#171717", 7, "#858585", 5),
           photo(241, 220, 700, 342), r(241, 220, 700, 342, "#0007"),
           r(230, 577, 19, 130, "#858585"), r(930, 577, 19, 130, "#858585"),
           t(75, 670, "PANTALLA URBANA · VISIÓN A DISTANCIA", 18, "#f4f4f1", 700)]
    for x in [73, 112, 151, 950, 989, 1028, 1067]:
        out += [r(x, 362, 21, 35, "#8595a0"), r(x, 415, 21, 35, "#8595a0")]
    if kind == "street-screen":
        out += [t(282, 282, brand, 27, "#fff", 700), t(282, 422, headline, 48, "#fff", 700)]
    elif kind == "street-motion":
        out += [t(281, 295, brand, 26, "#fff", 700), t(281, 491, "MOVIMIENTO", 41, "#fff", 700),
                t(788, 477, "→", 72, "#fff", 600)]
    elif kind in {"street-daypart", "street-data"}:
        out += [photo(243, 222, 348, 338, "breakfast"), photo(591, 222, 348, 338, "rainy-car"),
                r(243, 222, 348, 338, "#0008"), r(591, 222, 348, 338, "#0008"),
                t(264, 268, "MAÑANA" if kind == "street-daypart" else "SOL", 24, "#fff", 700),
                t(612, 268, "NOCHE" if kind == "street-daypart" else "LLUVIA", 24, "#fff", 700),
                t(260, 393, "Empieza bien" if kind == "street-daypart" else "Sal a disfrutar", 31, "#fff", 700),
                t(609, 393, "Baja el ritmo" if kind == "street-daypart" else "Plan bajo techo", 31, "#fff", 700),
                t(363, 526, "VARIANTE A", 17, "#fff", 700), t(715, 526, "VARIANTE B", 17, "#fff", 700)]
    else:
        out += [t(268, 292, brand, 26, "#fff", 700), t(268, 402, headline, 44, "#fff", 700),
                r(752, 340, 128, 128, "#fff", 4)]
        for row in range(5):
            for col in range(5):
                if (row + 2 * col) % 3:
                    out.append(r(765 + col * 22, 353 + row * 22, 15, 15, "#111"))
        out += [t(705, 503, "Activa en el lugar", 20, "#fff", 700)]
    return "".join(out)


def phone_screen(kind, brand, headline, accent):
    """A full portrait screen, with the native controls around the fictional ad."""
    x, y, w, h = 72, 42, 636, 1116
    sx, sy, sw, sh = 90, 60, 600, 1080
    is_tiktok = kind.startswith("tiktok")
    is_shorts = kind == "shorts"
    is_video = kind in {"phone-video", "phone-story", "tiktok-video", "tiktok-spark",
                        "tiktok-addon", "tiktok-poll", "tiktok-countdown", "shorts"}
    out = [r(0, 0, 780, 1200, "#050505"), r(x, y, w, h, "#111", 62, "#686868", 4)]
    if is_video:
        out += [photo(sx, sy, sw, sh), r(sx, sy, sw, sh, "url(#phone-shade)"),
                t(118, 112, "9:41", 24, "#fff", 700),
                t(585, 112, "●  ▰", 24, "#fff", 700),
                r(330, 76, 120, 22, "#050505", 12)]
        if is_tiktok:
            out += [t(120, 159, "TikTok", 21, "#fff", 800),
                    t(390, 181, "Siguiendo   ·   Para ti", 26, "#fff", 700, "middle"),
                    t(604, 181, "⌕", 36, "#fff", 500)]
        elif is_shorts:
            out += [t(120, 185, "←  Shorts", 32, "#fff", 700), t(622, 185, "◉", 32, "#fff", 600)]
        elif kind == "phone-story":
            out += [r(115, 150, 548, 5, "#fff8", 3), r(115, 150, 195, 5, "#fff", 3),
                    circle(140, 204, 21, "#f0f0e9"), t(177, 212, brand.lower(), 22, "#fff", 700),
                    t(625, 213, "×", 32, "#fff", 400)]
        else:
            out += [t(120, 153, "Instagram", 21, "#fff", 700),
                    t(120, 190, "Reels", 34, "#fff", 700), t(622, 189, "◎", 32, "#fff", 500)]
        for i, symbol in enumerate(["♡", "▢", "➤", "⋯"]):
            yy = 672 + i * 91
            out += [t(620, yy, symbol, 43 if i < 3 else 37, "#fff", 500, "middle")]
            if i < 3:
                out.append(t(620, yy + 25, ["823K", "51", "Enviar"][i], 15, "#fff", 600, "middle"))
        out += ['<clipPath id="avatar"><circle cx="130" cy="877" r="25"/></clipPath>',
                '<g clip-path="url(#avatar)">', photo(105, 852, 50, 50), '</g>',
                circle(130, 877, 25, "none", "#fff", 2),
                t(166, 885, f"{brand.lower()}  ✓", 25, "#fff", 700),
                t(118, 925, "Patrocinado", 19, "#fff", 600),
                t(118, 969, headline, 25, "#fff", 700),
                r(112, 992, 548, 66, accent, 10),
                t(386, 1033, "Comprar ahora  ↗" if kind in {"phone-video", "tiktok-addon"} else "Descubrir  ↗", 23, "#fff", 700, "middle")]
        if kind in {"tiktok-addon", "tiktok-poll", "tiktok-countdown"}:
            label = {"tiktok-addon": "Ver producto  ↗", "tiktok-poll": "¿Cuál prefieres?  A  /  B", "tiktok-countdown": "Lanzamiento  ·  02:14:08"}[kind]
            out += [r(125, 514, 450, 78, "#fff", 12), t(350, 564, label, 22, "#111", 700, "middle")]
        if kind == "tiktok-spark":
            out += [r(116, 795, 385, 58, "#000a", 10), t(137, 832, "Video original de creador", 18, "#fff", 600)]
        if kind == "phone-story":
            out += [r(112, 1070, 548, 50, "#ffffff22", 25, "#fff", 1),
                    t(386, 1102, "Enviar mensaje", 19, "#fff", 500, "middle")]
        else:
            out += [r(90, 1069, 600, 71, "#060606"),
                    t(145, 1115, "⌂", 32, "#fff", 600),
                    t(270, 1115, "⌕", 32, "#fff", 600),
                    t(390, 1115, "+", 35, "#fff", 600, "middle"),
                    t(510, 1115, "▣", 28, "#fff", 600),
                    t(625, 1115, "◉", 30, "#fff", 600)]
            if is_tiktok:
                out += [t(145, 1133, "Inicio", 12, "#fff", 500),
                        t(270, 1133, "Amigos", 12, "#fff", 500),
                        t(493, 1133, "Bandeja", 12, "#fff", 500),
                        t(608, 1133, "Perfil", 12, "#fff", 500)]
    else:
        out += [r(sx, sy, sw, sh, "#fff"), t(118, 112, "9:41", 24, "#111", 700),
                t(585, 112, "●  ▰", 24, "#111", 700), r(330, 76, 120, 22, "#050505", 12),
                t(115, 177, "Instagram", 38, "#111", 700),
                t(596, 177, "♡", 32, "#111", 500), t(645, 177, "◉", 28, "#111", 500),
                line(90, 196, 690, 196, "#e8e8e8", 2)]
        if kind in {"phone-carousel", "phone-collection"}:
            for i, name in enumerate(["plants", "skincare", "travel", "perfume"]):
                cx = 155 + i * 145
                out += [f'<clipPath id="story-{i}"><circle cx="{cx}" cy="251" r="40"/></clipPath>',
                        f'<g clip-path="url(#story-{i})">', photo(cx - 40, 211, 80, 80, name), '</g>',
                        circle(cx, 251, 43, "none", "#d54979", 4)]
            out += [line(90, 318, 690, 318, "#ededed"),
                    circle(128, 354, 22, accent), t(165, 361, brand.lower(), 23, "#111", 700),
                    t(641, 361, "⋯", 30, "#111", 600)]
            image_y = 386
        else:
            out += [circle(128, 231, 22, accent), t(165, 239, brand.lower(), 23, "#111", 700),
                    t(641, 239, "⋯", 30, "#111", 600)]
            image_y = 265
        if kind == "phone-carousel":
            out += [photo(sx, image_y, sw, 565), r(sx, image_y + 455, sw, 110, "#0007"),
                    t(125, image_y + 520, "01 / 03 · Desliza para ver más →", 23, "#fff", 700),
                    t(390, 990, "●  ○  ○", 21, "#2770df", 600, "middle")]
        elif kind == "phone-collection":
            out += [photo(sx, image_y, sw, 390), r(sx, image_y + 305, sw, 85, "#0008"),
                    t(118, image_y + 356, headline, 28, "#fff", 700),
                    t(120, 805, "Ver productos", 25, "#111", 700)]
            for i, name in enumerate(["skincare", "sneakers", "perfume", "headphones"]):
                px = 117 + (i % 4) * 143
                out.append(photo_tile(px, 827, 130, 120, name))
        elif kind == "phone-instant":
            out += [photo(sx, image_y, sw, 585), r(sx, image_y + 430, sw, 155, "#0008"),
                    t(122, image_y + 510, headline, 34, "#fff", 700),
                    t(120, 910, "Explora la experiencia", 29, "#111", 700),
                    r(120, 951, 540, 67, "#ffd400", 9), t(390, 995, "Ver más  ↗", 23, "#111", 700, "middle")]
        else:
            out += [photo(sx, image_y, sw, 460),
                    t(120, 763, "Cuéntanos qué necesitas", 28, "#111", 700),
                    r(120, 787, 540, 65, "#f3f3f3", 6), t(141, 829, "Nombre", 20, "#777", 500),
                    r(120, 866, 540, 65, "#f3f3f3", 6), t(141, 908, "Correo", 20, "#777", 500),
                    r(120, 950, 540, 67, "#ffd400", 9), t(390, 994, "Enviar consulta", 22, "#111", 700, "middle")]
        out += [r(90, 1049, 600, 91, "#fff"), line(90, 1049, 690, 1049, "#e6e6e6"),
                t(145, 1106, "⌂", 35, "#111", 600), t(270, 1106, "⌕", 34, "#111", 600),
                t(390, 1106, "+", 35, "#111", 600, "middle"),
                t(510, 1106, "▣", 30, "#111", 600), t(625, 1106, "◉", 31, "#111", 600)]
    out += [r(320, 1124, 140, 7, "#bbb", 4),
            t(390, 1183, "EJEMPLO FICTICIO · INTERFAZ ILUSTRATIVA", 15, "#aaa", 600, "middle")]
    return "".join(out)


def make_svg(item_id, values):
    global ACTIVE_PHOTO
    ACTIVE_PHOTO = PHOTO_BY_ID[item_id]
    medium, name, explanation, brand, headline, accent, kind = values
    defs = ('<defs><linearGradient id="photo-shade" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#000" stop-opacity=".35"/>'
            '<stop offset=".45" stop-color="#000" stop-opacity=".06"/>'
            '<stop offset="1" stop-color="#000" stop-opacity=".78"/>'
            '</linearGradient><linearGradient id="phone-shade" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#000" stop-opacity=".45"/>'
            '<stop offset=".55" stop-color="#000" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#000" stop-opacity=".95"/>'
            '</linearGradient></defs>')
    if medium in {"META", "TIKTOK"} or kind == "shorts":
        return ('<svg xmlns="http://www.w3.org/2000/svg" width="780" height="1200" '
                'viewBox="0 0 780 1200" role="img" aria-label="Interfaz ilustrativa del formato">'
                + defs + '<style>text{font-family:Poppins,Arial,sans-serif}</style>'
                + phone_screen(kind, brand, headline, accent) + '</svg>')
    head = [r(0, 0, 1200, 780, "#050505"), r(0, 0, 1200, 8, "#ffd400"),
            t(66, 68, medium, 18, "#ffd400", 700),
            t(66, 105, name, 32, "#f4f4f1", 700),
            t(1130, 64, "MOCKUP", 16, "#aaa9a4", 600, "end")]
    if medium == "GOOGLE":
        body = google(kind, brand, headline, accent)
    elif medium == "PROGRAMÁTICA":
        body = browser(kind, brand, headline, accent)
    elif medium == "CTV":
        body = tv(kind, brand, headline, accent)
    else:
        body = street(kind, brand, headline, accent)
    foot = [line(66, 726, 1134, 726, "#454542", 1),
            t(66, 754, explanation, 16, "#aaa9a4", 500),
            t(1134, 754, "EJEMPLO FICTICIO · NO ES CAPTURA DE PLATAFORMA", 13, "#aaa9a4", 600, "end")]
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="780" viewBox="0 0 1200 780" '
            'role="img" aria-label="Mockup ilustrativo del formato">'
            + defs + '<style>text{font-family:Poppins,Arial,sans-serif}</style>'
            + "".join(head) + body + "".join(foot) + '</svg>')


if __name__ == "__main__":
    for key, value in ITEMS.items():
        (OUT / f"{key}.svg").write_text(make_svg(key, value), encoding="utf-8")
    print(f"Generated {len(ITEMS)} mockups in {OUT}")
