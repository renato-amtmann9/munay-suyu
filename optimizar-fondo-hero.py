#!/usr/bin/env python3
"""
Optimizador del fondo fotográfico de la portada (hero).

Es un caso aparte de optimizar-imagenes.py porque el fondo del hero se
sirve como CSS background-size:cover a pantalla completa, así que necesita
anchos mucho mayores que una foto de tarjeta (que como mucho se ve a
1200px). Genera:

  · hero-fonda.jpg        ← maestro recomprimido, respaldo/original
  · hero-fonda-640.webp   ← celulares
  · hero-fonda-1280.webp  ← tablets
  · hero-fonda-1920.webp  ← notebooks / escritorio estándar
  · hero-fonda-2600.webp  ← pantallas grandes (1920×1080 con densidad alta,
                             2560×1440, etc.)

Uso:
    python optimizar-fondo-hero.py <ruta-al-original>

Requiere Pillow: pip install Pillow
"""

from PIL import Image
import os
import sys

CARPETA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "img")
BASE = os.path.join(CARPETA, "hero-fonda")
ANCHOS_WEBP = [640, 1280, 1920, 2600]
ANCHO_MAESTRO = 2600
CALIDAD_WEBP = 72
CALIDAD_JPG = 86


def escalar(im, ancho):
    if ancho >= im.size[0]:
        return im
    alto = round(im.size[1] * ancho / im.size[0])
    return im.resize((ancho, alto), Image.LANCZOS)


def kb(ruta):
    return os.path.getsize(ruta) // 1024


def main():
    if len(sys.argv) < 2:
        print("Uso: python optimizar-fondo-hero.py <ruta-al-original>")
        return
    origen = sys.argv[1]
    im = Image.open(origen).convert("RGB")
    print(f"Original: {im.size[0]}x{im.size[1]}  ({kb(origen)} KB)")

    maestro = escalar(im, ANCHO_MAESTRO)
    ruta_maestro = BASE + ".jpg"
    maestro.save(ruta_maestro, "JPEG", quality=CALIDAD_JPG, optimize=True, progressive=True)
    print(f"hero-fonda.jpg          {maestro.size[0]}x{maestro.size[1]}  {kb(ruta_maestro)} KB")

    for ancho in ANCHOS_WEBP:
        v = escalar(im, ancho)
        ruta = f"{BASE}-{ancho}.webp"
        v.save(ruta, "WEBP", quality=CALIDAD_WEBP, method=6)
        print(f"hero-fonda-{ancho}.webp   {v.size[0]}x{v.size[1]}  {kb(ruta)} KB")


if __name__ == "__main__":
    main()
