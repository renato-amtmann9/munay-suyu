# Munay Suyu · Conjunto Folclórico

Sitio web de **Munay Suyu**, un conjunto folclórico chileno que preserva y difunde las raíces y tradiciones de Chile. 

- **Zona Norte** y **Zona Central**
- Para empresas, municipalidades, colegios y celebraciones
- Lema: *Un lugar de amor, hecho danza*

## Características

- 🎨 **Diseño responsivo** optimizado para móvil y escritorio
- ⚡ **Sitio estático** (~320 KB) — sin build, sin dependencias
- 🖼️ **Imágenes optimizadas** en WebP con respaldos en JPG
- 🎭 **Animaciones fluidas** con canvas y CSS
- ♿ **Accesible** — respeta `prefers-reduced-motion`
- 🔍 **SEO** — meta tags y Open Graph

## Tecnología

- HTML5
- CSS3 (sin framework)
- JavaScript vanilla
- Fuentes autohospedadas (Outfit, Playfair Display)
- Canvas para papel picado animado

## Estructura

```
├── index.html              estructura de la página
├── css/
│   ├── estilo.css         estilos y animaciones
│   └── fuentes.css        @font-face (generado)
├── js/
│   ├── app.js             comportamiento
│   └── contenido.js       ← contenido editable
├── assets/
│   ├── img/               fotos en JPG/WebP
│   ├── fuentes/           tipografías
│   └── video/             videos (opcional)
└── LEEME.md               instrucciones locales
```

## Editar contenido

Todo el contenido vive en **`js/contenido.js`**:

- WhatsApp del grupo
- Links de redes sociales
- Galería de fotos
- Videos
- Servicios / Contratos

**No hace falta tocar el HTML.**

Para agregar fotos nuevas:
```bash
python optimizar-imagenes.py
```

Genera variantes WebP responsive y sus dimensiones.

## Desplegar

Es un sitio estático. Sirve subirlo a:
- **Vercel** ← recomendado (este repo)
- Netlify
- GitHub Pages
- Cloudflare Pages

No hay `npm install`, `build` ni backend necesarios.

## Desarrollo local

```bash
node servidor.js
```

Después abre **http://localhost:4600**

O doble clic en `abrir-web.bat` (Windows).

---

**Munay Suyu** © 2024 · Conjunto Folclórico Chileno
