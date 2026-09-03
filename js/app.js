/* ═══════════════════════════════════════════════════════════
   MUNAY SUYU · comportamiento del sitio
   Sin librerías. Todo vanilla.
   ═══════════════════════════════════════════════════════════ */
(function(){
"use strict";

const $  = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ═══════ 1 · PRELOADER ═══════ */
window.addEventListener("load", () => {
  setTimeout(() => {
    const p = $("#preloader");
    if (p) { p.classList.add("fuera"); setTimeout(() => p.remove(), 1400); }
    document.body.classList.add("cargado");
  }, menosMovimiento ? 100 : 1500);
});

/* ═══════ 2 · WHATSAPP ═══════ */
const waURL = (texto) =>
  "https://wa.me/" + CONTENIDO.whatsapp + "?text=" + encodeURIComponent(texto || CONTENIDO.mensajeContacto);

$$("[data-wa]").forEach(a => {
  a.href = waURL();
  a.target = "_blank";
  a.rel = "noopener";
});
const waTexto = $("#waTexto");
if (waTexto) waTexto.textContent = CONTENIDO.whatsappVisible;

$$('a[href*="instagram.com"]').forEach(a => a.href = CONTENIDO.instagram);
$$('a[href*="tiktok.com"]').forEach(a => a.href = CONTENIDO.tiktok);

if (CONTENIDO.whatsapp === "56900000000") {
  console.warn("⚠️  MUNAY SUYU — falta poner el WhatsApp real del grupo en js/contenido.js (línea 'whatsapp').");
}

/* ═══════ 3 · NAV ═══════ */
const nav = $("#nav");
const burger = $("#navBurger");

burger.addEventListener("click", () => {
  const abierto = nav.classList.toggle("abierto");
  burger.setAttribute("aria-expanded", abierto ? "true" : "false");
  document.body.style.overflow = abierto ? "hidden" : "";
});
$$("#navLinks a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("abierto");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}));

/* ═══════ 4 · SCROLL: barra, nav pegado, botón flotante ═══════ */
const barra = $("#progreso");
const flotante = $(".wa-flotante");
const riel = $("#rielRelleno");
const lineaTiempo = $(".linea-tiempo");

/* Las medidas del documento se guardan una vez y se recalculan solo cuando
   algo cambia de tamaño. Leerlas en cada evento de scroll obliga al navegador
   a rehacer el cálculo de posiciones, y eso es justo lo que traba el
   desplazamiento en un teléfono.
   Se anima con transform (scaleX) y no con width, porque transform lo resuelve
   la tarjeta gráfica sin volver a maquetar la página. */
let altoScroll = 0, topeLinea = 0, pedido = false;

function medirDocumento(){
  altoScroll = document.documentElement.scrollHeight - window.innerHeight;
  topeLinea = lineaTiempo
    ? lineaTiempo.getBoundingClientRect().top + window.scrollY
    : 0;
}

function pintarScroll(){
  pedido = false;
  const y = window.scrollY;
  barra.style.transform = "scaleX(" + (altoScroll > 0 ? y / altoScroll : 0) + ")";
  nav.classList.toggle("pegado", y > 60);
  flotante.classList.toggle("visible", y > 600);
  if (riel && lineaTiempo){
    const avance = (y + window.innerHeight - topeLinea) / (window.innerHeight * 0.75);
    riel.style.transform = "scaleX(" + Math.max(0, Math.min(1, avance)) + ")";
  }
}

function alScroll(){
  if (!pedido){ pedido = true; requestAnimationFrame(pintarScroll); }
}

window.addEventListener("scroll", alScroll, { passive:true });
window.addEventListener("resize", () => { medirDocumento(); alScroll(); }, { passive:true });
/* al cargar las fotos diferidas la página crece: hay que volver a medir */
if (window.ResizeObserver){
  new ResizeObserver(() => { medirDocumento(); alScroll(); }).observe(document.body);
}
medirDocumento();
pintarScroll();

/* ═══════ 5 · REVELADO AL ENTRAR EN PANTALLA ═══════ */
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e, i) => {
    if (e.isIntersecting){
      setTimeout(() => e.target.classList.add("visible"), i * 70);
      observador.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

function observar(){
  $$("[data-animar]:not(.visible), .g-item:not(.visible), .serv:not(.visible)").forEach(el => {
    /* Lo que ya está en pantalla al llegar (por ejemplo si alguien entra
       directo a #galeria) se muestra de una, sin esperar a cruzarlo. */
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("visible");
    else observador.observe(el);
  });
}
observar();

/* Red de seguridad: si algo quedó arriba sin alcanzar a mostrarse —un salto
   de ancla, un scroll muy brusco— igual se muestra. Sin esto podría quedar
   texto invisible para siempre. */
window.addEventListener("scroll", () => {
  clearTimeout(window.__rescate);
  window.__rescate = setTimeout(() => {
    $$("[data-animar]:not(.visible), .g-item:not(.visible), .serv:not(.visible)")
      .forEach(el => { if (el.getBoundingClientRect().bottom < 0) el.classList.add("visible"); });
  }, 250);
}, { passive:true });

/* ═══════ 6 · CONTADORES ═══════ */
const obsContador = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const meta = parseInt(el.dataset.contador, 10);
    const dur = 1400; const t0 = performance.now();
    (function paso(t){
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(meta * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(paso);
    })(t0);
    obsContador.unobserve(el);
  });
}, { threshold: 0.6 });
$$("[data-contador]").forEach(el => obsContador.observe(el));

/* ═══════ 7 · TILT DE LA FOTO DEL HERO ═══════ */
const marco = $("#marcoHero");
if (marco && !menosMovimiento){
  const zona = marco.parentElement;
  zona.addEventListener("mousemove", (e) => {
    const r = zona.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    marco.style.transform = `rotateY(${x * 11}deg) rotateX(${-y * 9}deg) translateZ(14px)`;
  });
  zona.addEventListener("mouseleave", () => { marco.style.transform = ""; });
}

/* ═══════ 9 · PAPEL PICADO (canvas) ═══════ */
const lienzo = $("#papelitos");
if (lienzo && !menosMovimiento){
  const ctx = lienzo.getContext("2d");
  const tonos = ["#B31B24","#C89434","#22B3AE","#E9548A","#E88A33","#3C6E45"];
  const sellos = [];

  /* Cada figura se dibuja UNA sola vez en un lienzo aparte y después solo se
     copia. Antes se redibujaban cinco elipses por pétalo en cada cuadro: era,
     de lejos, lo más caro que hacía la página mientras uno se desplazaba. */
  function prepararSellos(){
    const R = 16;
    tonos.forEach(color => {
      ["rombo", "flor"].forEach(forma => {
        const c = document.createElement("canvas");
        c.width = c.height = R * 2;
        const g = c.getContext("2d");
        g.translate(R, R);
        g.fillStyle = color;
        if (forma === "rombo"){
          g.beginPath();
          g.moveTo(0, -R + 1); g.lineTo(R * .7, 0); g.lineTo(0, R - 1); g.lineTo(-R * .7, 0);
          g.closePath(); g.fill();
        } else {
          for (let k = 0; k < 5; k++){
            g.beginPath();
            g.ellipse(0, -R * .42, R * .22, R * .42, (k * 72) * Math.PI / 180, 0, Math.PI * 2);
            g.fill();
          }
        }
        sellos.push(c);
      });
    });
  }

  let piezas = [], ancho = 0, alto = 0;
  let corriendo = false, enPantalla = true, pestanaActiva = true;

  function nueva(inicio){
    return {
      x: Math.random() * ancho,
      y: inicio ? Math.random() * alto : -30,
      t: 9 + Math.random() * 13,
      vy: .25 + Math.random() * .7,
      vx: (Math.random() - .5) * .5,
      g: Math.random() * 360,
      vg: (Math.random() - .5) * 1.6,
      o: .22 + Math.random() * .34,
      sello: sellos[(Math.random() * sellos.length) | 0]
    };
  }
  function medir(){
    ancho = lienzo.width = window.innerWidth;
    alto  = lienzo.height = window.innerHeight;
    const total = window.innerWidth < 760 ? 14 : 30;
    piezas = Array.from({ length: total }, () => nueva(true));
  }
  function pintar(){
    if (!enPantalla || !pestanaActiva){ corriendo = false; return; }
    ctx.clearRect(0, 0, ancho, alto);
    for (let i = 0; i < piezas.length; i++){
      const p = piezas[i];
      p.y += p.vy; p.x += p.vx; p.g += p.vg;
      if (p.y > alto + 40) piezas[i] = nueva(false);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.g * Math.PI / 180);
      ctx.globalAlpha = p.o;
      ctx.drawImage(p.sello, -p.t / 2, -p.t / 2, p.t, p.t);
      ctx.restore();
    }
    requestAnimationFrame(pintar);
  }
  function arrancar(){
    if (!corriendo && enPantalla && pestanaActiva){
      corriendo = true;
      requestAnimationFrame(pintar);
    }
  }

  prepararSellos();
  medir();
  arrancar();

  /* Se apaga cuando la portada sale de pantalla: más abajo no se nota y
     mantener un lienzo del alto de la ventana animándose cuesta caro. */
  const portada = $(".hero");
  if (portada && window.IntersectionObserver){
    new IntersectionObserver(es => {
      enPantalla = es[0].isIntersecting;
      lienzo.classList.toggle("apagado", !enPantalla);
      arrancar();
    }, { threshold: 0 }).observe(portada);
  }
  document.addEventListener("visibilitychange", () => {
    pestanaActiva = !document.hidden;
    arrancar();
  });
  window.addEventListener("resize", () => { medir(); arrancar(); }, { passive:true });
}

/* ═══════ 10 · MAPA + PESTAÑAS DE CUADROS ═══════ */
function mostrarZona(zona){
  $$(".tab").forEach(t => {
    const on = t.dataset.zona === zona;
    t.classList.toggle("activa", on);
    t.setAttribute("aria-selected", on ? "true" : "false");
  });
  $$(".zona-panel").forEach(p => p.classList.toggle("activa", p.dataset.panel === zona));
  $$(".zona, .pin, .mapa__etq").forEach(el => el.classList.toggle("activa", el.dataset.zona === zona));
}
$$(".tab, .zona, .pin, .mapa__etq").forEach(el => {
  if (!el.dataset.zona) return;
  el.style.cursor = "pointer";
  el.addEventListener("click", () => mostrarZona(el.dataset.zona));
});
mostrarZona("norte");

/* ═══════ 12 · GALERÍA ═══════ */
(function galeria(){
  const grid = $("#galeriaGrid");
  if (!grid) return;

  const fotos  = CONTENIDO.fotos.map(f  => Object.assign({ tipo:"foto"  }, f));
  const videos = CONTENIDO.videos.map(v => Object.assign({ tipo:"video", zona:"video" }, v));
  const todo   = fotos.concat(videos);
  let lista = todo;

  const lupa = '<span class="g-item__lupa"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></span>';
  const play = '<span class="g-item__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>';

  /* Arma la miniatura en dos tamaños: el teléfono baja la de 480px y las
     pantallas densas la mayor. En una miniatura nunca hace falta la versión
     de 1200px, así que para las fotos grandes se usa la intermedia de 800
     — que además ya está descargada, porque es la misma de la portada.
     width/height van declarados para que la grilla no salte al ir cargando. */
  function miniatura(it){
    const hayIntermedia = it.w > 900;
    const mayorArchivo = hayIntermedia ? "-800.webp" : "-grande.webp";
    const mayorAncho   = hayIntermedia ? 800 : Math.min(it.w, 1200);
    return '<img src="' + it.base + '-480.webp"' +
           ' srcset="' + it.base + '-480.webp 480w, ' +
                        it.base + mayorArchivo + ' ' + mayorAncho + 'w"' +
           ' sizes="(max-width:760px) 100vw, 33vw"' +
           ' width="' + it.w + '" height="' + it.h + '"' +
           ' loading="lazy" decoding="async" alt="' + it.titulo + '">';
  }

  function pintar(filtro){
    lista = filtro === "todo"  ? todo
          : filtro === "video" ? videos
          : todo.filter(i => i.zona === filtro);

    if (!lista.length && filtro === "video"){
      grid.innerHTML =
        '<div class="g-item visible" style="padding:34px;text-align:center;cursor:default">' +
        '<p style="margin:0 0 14px;font-family:var(--display);font-size:1.3rem;color:var(--rojo)">Nuestros videos viven en TikTok</p>' +
        '<p style="margin:0 0 18px;font-size:14.5px;color:var(--tinta-2)">Ahí subimos ensayos, viajes y presentaciones cada semana.</p>' +
        '<a class="btn btn--rojo btn--mini" href="' + CONTENIDO.tiktok + '" target="_blank" rel="noopener">Ver en TikTok</a>' +
        '</div>';
      return;
    }

    grid.innerHTML = lista.map((it, i) => {
      const medio = it.tipo === "video"
        ? '<img src="' + (it.poster || "") + '" alt="' + it.titulo + '" loading="lazy" decoding="async">' + play
        : miniatura(it) + lupa;
      return '<figure class="g-item' + (it.tipo === "video" ? " g-item--video" : "") + '" data-i="' + i + '">' +
        medio +
        '<figcaption class="g-item__capa"><span>' +
          (it.zona === "video" ? "Video" : it.zona === "norte" ? "Zona Norte" : "Zona Central") +
        '</span><b>' + it.titulo + '</b></figcaption></figure>';
    }).join("");

    $$(".g-item", grid).forEach(el => {
      observador.observe(el);
      el.addEventListener("click", () => abrirLb(parseInt(el.dataset.i, 10)));
    });
  }

  $$(".filtro").forEach(b => b.addEventListener("click", () => {
    $$(".filtro").forEach(x => x.classList.remove("activa"));
    b.classList.add("activa");
    pintar(b.dataset.filtro);
  }));

  /* — lightbox — */
  const lb = $("#lightbox"), lbMedio = $("#lbMedio"), lbTexto = $("#lbTexto");
  let idx = 0;

  function abrirLb(i){
    idx = i;
    const it = lista[idx];
    if (!it) return;
    lbMedio.innerHTML = it.tipo === "video"
      ? '<video src="' + it.src + '" controls autoplay playsinline poster="' + (it.poster || "") + '"></video>'
      : '<img src="' + it.base + '-grande.webp" width="' + it.w + '" height="' + it.h +
        '" decoding="async" alt="' + it.titulo + '">';
    lbTexto.innerHTML = "<b>" + it.titulo + "</b> — " + (it.pie || "");
    lb.classList.add("abierto");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function cerrarLb(){
    lb.classList.remove("abierto");
    lb.setAttribute("aria-hidden", "true");
    lbMedio.innerHTML = "";
    document.body.style.overflow = "";
  }
  function saltar(d){ abrirLb((idx + d + lista.length) % lista.length); }

  $("#lbCerrar").addEventListener("click", cerrarLb);
  $("#lbPrev").addEventListener("click", () => saltar(-1));
  $("#lbNext").addEventListener("click", () => saltar(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) cerrarLb(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("abierto")) return;
    if (e.key === "Escape") cerrarLb();
    if (e.key === "ArrowLeft") saltar(-1);
    if (e.key === "ArrowRight") saltar(1);
  });

  pintar("todo");
})();

/* ═══════ 12b · PRESENTACIONES ═══════ */
(function presentaciones(){
  const cont = $("#presentacionesGrid");
  if (!cont) return;

  const acentos = ["", " func--turquesa", " func--oro", " func--rosa"];
  let html = "", grupoActual = null, i = 0;

  CONTENIDO.presentaciones.forEach(p => {
    const clave = p.dia + "-" + p.mes;
    if (clave !== grupoActual){
      if (grupoActual !== null) html += "</div></div>";
      html +=
        '<div class="presentaciones__grupo" data-animar>' +
          '<div class="presentaciones__fecha">' +
            '<span class="presentaciones__dia">' + p.dia + '</span>' +
            '<div><strong>' + p.diaSemana + '</strong><small>' + p.mes + '</small></div>' +
          '</div>' +
          '<div class="presentaciones__tarjetas">';
      grupoActual = clave;
    }
    html +=
      '<article class="func' + acentos[i % acentos.length] + '">' +
        '<div class="func__top"><span class="func__hora">' + p.hora + ' hrs</span><span class="func__ico">✦</span></div>' +
        '<h3>' + p.lugar + '</h3>' +
        '<span class="func__tag">Función de folclor</span>' +
      '</article>';
    i++;
  });
  if (grupoActual !== null) html += "</div></div>";

  cont.innerHTML = html;
  observar();
})();

/* ═══════ 13 · SERVICIOS ═══════ */
(function servicios(){
  const grid = $("#servicios-grid");
  if (!grid) return;
  grid.innerHTML = CONTENIDO.servicios.map(s =>
    '<article class="serv">' +
      '<div class="serv__ico"><svg viewBox="0 0 24 24">' + s.ico + '</svg></div>' +
      '<h3>' + s.titulo + '</h3><p>' + s.texto + '</p>' +
      '<a class="serv__link" href="' + waURL(s.pedir) + '" target="_blank" rel="noopener">' +
        'Consultar por WhatsApp <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      '</a>' +
    '</article>'
  ).join("");
  observar();
})();

/* ═══════ 14 · FORMULARIO → WHATSAPP ═══════ */
const form = $("#formPostular");
if (form){
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const nombre = (d.get("nombre") || "").toString().trim();
    const campoNombre = $("#f-nombre");

    if (!nombre){
      campoNombre.classList.add("error");
      campoNombre.focus();
      setTimeout(() => campoNombre.classList.remove("error"), 1500);
      return;
    }

    const partes = [
      "¡Hola Munay Suyu! Quiero postular al grupo 💃",
      "",
      "*Nombre:* " + nombre,
      d.get("edad")   ? "*Edad:* " + d.get("edad") : "",
      d.get("comuna") ? "*Comuna:* " + d.get("comuna") : "",
      "*Cuadro que me llama:* " + d.get("cuadro"),
      "*Experiencia:* " + d.get("experiencia"),
      (d.get("mensaje") || "").toString().trim() ? "\n" + d.get("mensaje") : ""
    ].filter(Boolean);

    window.open(waURL(partes.join("\n")), "_blank", "noopener");
  });
}

/* ═══════ 15 · CONGELAR LO DECORATIVO QUE NO SE VE ═══════
   La marquesina, las cintas, el volantín, el sello y las banderitas siguen
   animándose aunque queden diez pantallazos más arriba. El navegador las
   recalcula igual. Se pausan al salir de vista y se reanudan al volver. */
if (window.IntersectionObserver && !menosMovimiento){
  const obsAnim = new IntersectionObserver(entradas => {
    entradas.forEach(e => e.target.classList.toggle("pausa", !e.isIntersecting));
  }, { rootMargin: "150px" });

  $$(".marquesina__pista, .guirnalda, .sello, .marco__brillo, " +
     ".collage__nota, .punto, .wa-flotante__pulso")
    .forEach(el => obsAnim.observe(el));
}

/* ═══════ 16 · DETALLES ═══════ */
const anio = $("#anio");
if (anio) anio.textContent = new Date().getFullYear();

/* imagen que no carga: no dejar el hueco roto */
$$("img").forEach(img => img.addEventListener("error", () => {
  img.style.background = "linear-gradient(135deg,#F7EFE2,#E4B95C)";
  img.style.minHeight = "180px";
  img.alt = img.alt || "Foto de Munay Suyu";
}));

})();
