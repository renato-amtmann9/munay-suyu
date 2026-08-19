#!/usr/bin/env python3
"""
Descarga las fuentes del sitio desde Google y las deja auto-alojadas
en assets/fuentes/, recortadas a los caracteres del español.

Por qué: si las fuentes se piden a Google en cada visita, el navegador tiene
que abrir dos conexiones extra (fonts.googleapis.com y fonts.gstatic.com)
antes de poder pintar el texto. Alojadas acá, viajan junto al resto del sitio.

Genera:
  · assets/fuentes/*.woff2   los archivos
  · css/fuentes.css          las reglas @font-face que los apuntan

Uso:
    python descargar-fuentes.py

Requiere:  pip install fonttools brotli
"""

import os
import re
import urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0 Safari/537.36")

# Los pesos pedidos son los que el CSS realmente usa:
#   Playfair Display  700-900 normal  ·  400-700 itálica
#   Outfit            400-700 normal
API = ("https://fonts.googleapis.com/css2?"
       "family=Playfair+Display:ital,wght@0,700..900;1,400..700"
       "&family=Outfit:wght@400..700&display=swap")

ARCHIVOS = {
    ('Outfit', 'normal'): 'outfit-var',
    ('Playfair Display', 'normal'): 'playfair-var',
    ('Playfair Display', 'italic'): 'playfair-italic-var',
}

# Alfabeto español completo + puntuación + los símbolos que usa el diseño.
# Es a propósito más amplio que el texto actual, para que agregar contenido
# nuevo no deje letras sin dibujar.
CARACTERES = (
    "".join(chr(c) for c in range(0x20, 0x7F))          # ASCII imprimible
    + "áéíóúüñÁÉÍÓÚÜÑ¿¡ºª"                              # español
    + "àèìòùâêîôûäëïöçÀÈÌÒÙÂÊÎÔÛÄËÏÖÇ"                  # acentos vecinos
    + "«»“”‘’–—…·•×÷°€$"                                # puntuación y signos
    + "←→↑↓✦✓♥"                                          # símbolos del diseño
)

RAIZ = os.path.dirname(os.path.abspath(__file__))
DIR_FUENTES = os.path.join(RAIZ, "assets", "fuentes")


def main():
    from fontTools.subset import main as subset_main

    os.makedirs(DIR_FUENTES, exist_ok=True)
    req = urllib.request.Request(API, headers={"User-Agent": UA})
    css = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")

    unicodes = ",".join(f"U+{ord(c):04X}" for c in sorted(set(CARACTERES)))
    reglas, antes, despues = [], 0, 0

    for bloque in re.findall(r"@font-face\s*\{[^}]*\}", css):
        if "U+0000-00FF" not in bloque:   # solo el subconjunto latino
            continue
        fam = re.search(r"font-family:\s*'([^']+)'", bloque).group(1)
        est = re.search(r"font-style:\s*(\w+)", bloque).group(1)
        peso = re.search(r"font-weight:\s*([\d ]+);", bloque).group(1).strip()
        url = re.search(r"url\((https://[^)]+)\)", bloque).group(1)

        nombre = ARCHIVOS[(fam, est)] + ".woff2"
        destino = os.path.join(DIR_FUENTES, nombre)
        crudo = destino + ".tmp"

        urllib.request.urlretrieve(url, crudo)
        antes += os.path.getsize(crudo)

        subset_main([
            crudo,
            f"--unicodes={unicodes}",
            "--layout-features=kern,liga,calt",
            "--flavor=woff2",
            f"--output-file={destino}",
        ])
        os.remove(crudo)
        despues += os.path.getsize(destino)
        print(f"  {nombre:26s} {fam:17s} {est:7s} {peso:9s} "
              f"{os.path.getsize(destino)/1024:5.0f} KB")

        reglas.append(
            "@font-face{\n"
            f"  font-family:'{fam}';\n"
            f"  font-style:{est};\n"
            f"  font-weight:{peso};\n"
            "  font-display:swap;\n"
            f"  src:url('../assets/fuentes/{nombre}') format('woff2');\n"
            "}"
        )

    cabecera = (
        "/* Fuentes auto-alojadas: variables, recortadas al español.\n"
        "   No las edites a mano — se regeneran con:  python descargar-fuentes.py  */\n\n"
    )
    with open(os.path.join(RAIZ, "css", "fuentes.css"), "w", encoding="utf-8") as f:
        f.write(cabecera + "\n\n".join(reglas) + "\n")

    print(f"\nDe Google: {antes/1024:.0f} KB  ->  recortadas: {despues/1024:.0f} KB "
          f"({100 - despues*100//antes}% menos)")


if __name__ == "__main__":
    main()
