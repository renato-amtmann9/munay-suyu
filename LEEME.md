# Munay Suyu — sitio web

Sitio de una sola página para el conjunto folclórico **Munay Suyu**.
HTML, CSS y JavaScript puro: **no necesita `npm install`, ni build, ni framework**.

---

## Cómo verlo

Doble clic en `abrir-web.bat`, o desde la terminal:

```bash
node servidor.js
```

Después abre **http://localhost:4600**

---

## El WhatsApp del grupo

Está configurado en `js/contenido.js`:

```js
whatsapp: "56994745417",          // +56 9 9474 5417
whatsappVisible: "+56 9 9474 5417",
```

Ese número alimenta **todos** los botones de WhatsApp del sitio: el flotante,
los de cada una de las 6 tarjetas de servicios, el del pie y el formulario de
postulación. Si algún día cambia, se cambia solo acá y se actualiza en todos lados.

---

## Qué se edita y dónde

Todo el contenido vive en **`js/contenido.js`**. No hace falta tocar el HTML.

| Qué | Dónde en `contenido.js` |
|---|---|
| WhatsApp del grupo | `whatsapp` |
| Mensaje que aparece escrito al abrir WhatsApp | `mensajeContacto` |
| Links de Instagram y TikTok | `instagram`, `tiktok` |
| Fotos de la galería | `fotos` |
| Videos de la galería | `videos` |
| Tarjetas de "Contrátanos" | `servicios` |

### Agregar fotos

1. Deja el archivo en `assets/img/`
2. Suma una línea en `fotos`:

```js
{ src:"assets/img/mi-foto.jpg", zona:"norte", titulo:"Título", pie:"Descripción" }
```

`zona` puede ser `"norte"` o `"centro"` — es lo que usan los filtros.

### Agregar videos

1. Deja el `.mp4` en `assets/video/`
2. Suma una línea en `videos`:

```js
{ src:"assets/video/cueca.mp4", poster:"assets/img/centro-pareja.jpg",
  titulo:"Cueca en la plaza", pie:"Presentación de septiembre" }
```

Mientras `videos` esté vacío, la pestaña **Videos** muestra una invitación a TikTok.
Apenas agregues uno, aparece la grilla con reproductor y lightbox.

---

## Qué tiene el sitio

- **Preloader** con el logo del grupo al centro, latiendo, y el lema debajo
- **Hero** con cintas animadas, volantín que cruza la pantalla, papel picado en canvas,
  título letra por letra y foto con inclinación 3D al pasar el mouse
- **Marquesina** roja con el repertorio corriendo
- **Quiénes somos** con collage, significado quechua del nombre y línea de tiempo
- **Nuestros cuadros**: mapa de Chile interactivo (Norte / Centro) sincronizado con las pestañas
- **Galería** tipo masonry con filtros y lightbox (flechas del teclado y Esc)
- **Contrátanos**: 6 tarjetas, cada una abre WhatsApp con su propio mensaje
- **Postula**: formulario que arma el mensaje y lo abre en WhatsApp listo para enviar
- **Pie** con redes, guirnalda de banderitas y botón flotante de WhatsApp

Respeta `prefers-reduced-motion`: si el visitante pidió menos animación en su sistema,
se apagan el papel picado, el volantín y las transiciones.

## La versión móvil

Casi todo el tráfico va a llegar por teléfono, así que el móvil tiene su propio
tratamiento. Está todo en un solo bloque al final de `css/estilo.css`,
bajo `@media (max-width:760px)` — **el escritorio no se toca desde ahí**.

Lo que cambia bajo 760px:

- **Portada.** El título crece a pantalla completa (22vw) y la foto del grupo sale
  a sangre, de borde a borde. Se sube por sobre las cifras, así en un iPhone normal
  la foto entra entera en la primera pantalla sin scrollear.
- **Cifras** (cuadros / danzas) en una sola fila de tres, en vez de apiladas.
- **Collage de "Quiénes somos"** pasa de posicionamiento absoluto a una grilla de dos
  columnas — en absoluto las fotos se montaban unas sobre otras.
- **Mapa de Chile** se recorta al norte y centro con un degradado al sur, y las dos
  pestañas se acomodan a su lado en vez de debajo.
- **Galería** a una columna de ancho completo, con los títulos siempre visibles
  (en el teléfono no hay *hover* que los muestre).
- **Lightbox** con menos margen y flechas redondas que no tapan la foto.
- **Enlaces de texto** del pie y de los servicios con alto mínimo de ~45px para el dedo.

Probado en 320, 375 y 390 px de ancho: sin scroll horizontal y sin elementos montados.

---

## Textos que conviene revisar con el grupo

El contenido se armó con la bio real de Instagram
(*"Preservamos y difundimos las raíces y tradiciones de nuestro hermoso Chile"*),
el lema del afiche y las fotos que ya existían. Estos dos puntos son
redacción propuesta, no datos confirmados — vale la pena que el grupo los lea:

- **La historia en "Quiénes somos"** y la **línea de tiempo** (origen, primer cuadro,
  llegada del norte). Está escrita en general, sin fechas ni nombres inventados,
  pero hay que confirmar que sea así.
- **El repertorio de danzas** de cada cuadro: son las danzas típicas de cada zona,
  pero hay que dejar solo las que el grupo efectivamente baila.
  Están en `index.html`, dentro de las listas `<ul class="chips">`.

No se inventaron números de integrantes, años de trayectoria, premios ni testimonios.

---

## Peso y fluidez

La primera visita descarga **~320 KB** en total. Antes eran 963 KB.

Cómo se logró, por si hay que mantenerlo:

- **Imágenes responsivas en WebP.** Cada foto existe en `-480.webp` (teléfono) y
  `-grande.webp` (escritorio); las grandes tienen además `-800.webp`. El navegador
  baja solo la que le sirve. Los `.jpg` quedan de respaldo y para redes sociales.
- **Fuentes propias.** Antes se pedían a Google, lo que obligaba a abrir dos
  conexiones más antes de poder pintar texto. Ahora viven en `assets/fuentes/`,
  son variables (un archivo por familia) y están recortadas al español: 72 KB.
- **El servidor comprime** html, css y js con gzip, igual que un hosting real.
  El CSS viaja en 11 KB en vez de 46.
- **Nada se anima fuera de pantalla.** La marquesina, las cintas, el volantín,
  el sello y las banderitas se congelan al salir de vista, y el papel picado
  se apaga en cuanto la portada queda atrás.
- **El scroll no obliga a recalcular la página.** Las medidas se guardan una vez
  y las barras se animan con `transform`, que resuelve la tarjeta gráfica.
- **Sin desenfoque de fondo en móvil**, que era lo más caro de repintar al
  desplazarse. En escritorio se mantiene.
- **Las fotos de más abajo se cargan al acercarse**, no todas de entrada.

Medido en móvil: 60 fps sostenidos, 1 cuadro lento de 296.

### Al agregar fotos nuevas

```bash
python optimizar-imagenes.py
```

Genera las variantes y al final imprime el `w`/`h` de cada foto, que es lo que
hay que copiar a `contenido.js`. Requiere `pip install Pillow`.

Las fuentes ya están descargadas y no hay que tocarlas. Si alguna vez hiciera
falta rehacerlas: `python descargar-fuentes.py` (necesita `fonttools` y `brotli`).

## Estructura

```
munay-suyu/
├── index.html               estructura de la página
├── css/estilo.css           todo el diseño y las animaciones
├── css/fuentes.css          reglas @font-face (generado, no editar)
├── js/contenido.js          ← acá se edita el contenido
├── js/app.js                comportamiento (galería, mapa, formulario, scroll)
├── assets/img/              fotos: .jpg original + variantes .webp
├── assets/fuentes/          las tipografías, auto-alojadas
├── assets/video/            videos (vacío por ahora)
├── optimizar-imagenes.py    genera las variantes al agregar fotos
├── descargar-fuentes.py     rehace las tipografías (rara vez hace falta)
├── servidor.js              servidor local, sin dependencias
└── abrir-web.bat            doble clic para levantarlo
```

## Para publicarlo

Es un sitio estático: sirve subir la carpeta completa a Netlify, Vercel,
GitHub Pages o Cloudflare Pages. No hay build ni backend.
