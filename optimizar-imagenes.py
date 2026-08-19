#!/usr/bin/env python3
"""
Optimizador de imágenes de Munay Suyu.

Toma cada .jpg de assets/img/ y genera:
  · nombre-480.webp     ← la que baja un teléfono
  · nombre-800.webp     ← intermedia, solo si el original supera 900px
  · nombre-grande.webp  ← la que baja un escritorio (tope 1200px de ancho)
  · nombre.jpg          ← recomprimido, respaldo y miniatura para redes

Nunca agranda una foto: si el original mide menos, se usa su ancho real.
Los nombres son siempre los mismos, así el HTML no tiene que adivinar.

Uso:
    python optimizar-imagenes.py

Cuando agregues fotos nuevas a assets/img/, córrelo de nuevo.
Requiere Pillow:  pip install Pillow
"""

from PIL import Image
import os
import glob

CARPETA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "img")
ANCHO_CHICO = 480
ANCHO_GRANDE = 1200
CALIDAD_WEBP = 74
CALIDAD_JPG = 80
MAX_JPG = 1000


def kb(ruta):
    return os.path.getsize(ruta) // 1024


def main():
    originales = sorted(glob.glob(os.path.join(CARPETA, "*.jpg")))
    if not originales:
        print("No encontré .jpg en", CARPETA)
        return

    def escalar(im, ancho):
        if ancho >= im.size[0]:
            return im
        return im.resize((ancho, round(im.size[1] * ancho / im.size[0])), Image.LANCZOS)

    antes = chico_total = grande_total = 0
    medidas = []
    print(f"{'archivo':26s} {'original':>12s} {'-480':>9s} {'-grande':>14s}")
    print("-" * 68)

    for ruta in originales:
        nombre = os.path.basename(ruta)
        base = ruta[:-4]
        antes += os.path.getsize(ruta)

        im = Image.open(ruta).convert("RGB")
        w0, h0 = im.size

        ruta_chica = base + "-480.webp"
        ruta_grande = base + "-grande.webp"

        chica = escalar(im, ANCHO_CHICO)
        chica.save(ruta_chica, "WEBP", quality=CALIDAD_WEBP, method=6)
        chico_total += os.path.getsize(ruta_chica)

        # tamaño intermedio, solo para fotos grandes (teléfono en pantalla retina)
        if w0 > 900:
            escalar(im, 800).save(base + "-800.webp", "WEBP",
                                  quality=CALIDAD_WEBP, method=6)

        grande = escalar(im, ANCHO_GRANDE)
        grande.save(ruta_grande, "WEBP", quality=CALIDAD_WEBP, method=6)
        grande_total += os.path.getsize(ruta_grande)

        # jpg de respaldo / redes sociales
        escalar(im, MAX_JPG).save(
            ruta, "JPEG", quality=CALIDAD_JPG, optimize=True, progressive=True
        )

        medidas.append((nombre[:-4], grande.size[0], grande.size[1]))
        col_orig = f"{w0}x{h0}"
        col_chica = f"{kb(ruta_chica)}KB"
        col_grande = f"{grande.size[0]}px {kb(ruta_grande)}KB"
        print(f"{nombre:26s} {col_orig:>12s} {col_chica:>9s} {col_grande:>14s}")

    print("-" * 68)
    print(f"Originales:              {antes//1024:5d} KB")
    print(f"Si todo fuera -480:      {chico_total//1024:5d} KB  "
          f"({100 - chico_total*100//antes}% menos)")
    print(f"Si todo fuera -grande:   {grande_total//1024:5d} KB  "
          f"({100 - grande_total*100//antes}% menos)")
    print("\nMedidas para contenido.js (base, ancho, alto):")
    for m in medidas:
        print(f'  {m[0]:24s} w:{m[1]:4d}  h:{m[2]:4d}')


if __name__ == "__main__":
    main()
