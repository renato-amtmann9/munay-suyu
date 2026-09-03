/* ═══════════════════════════════════════════════════════════
   MUNAY SUYU · CONTENIDO EDITABLE
   Todo lo que hay que cambiar para poner la web en marcha
   está en este archivo. No hace falta tocar nada más.
   ═══════════════════════════════════════════════════════════ */

const CONTENIDO = {

  /* ─────────────────────────────────────────────────────────
     1) WHATSAPP DEL GRUPO
     Formato: código de país + número, sin +, sin espacios.
     Chile: 56 + 9 + los 8 dígitos.
     ───────────────────────────────────────────────────────── */
  whatsapp: "56994745417",
  whatsappVisible: "+56 9 9474 5417",

  /* Mensaje que aparece escrito al abrir WhatsApp desde los botones */
  mensajeContacto: "¡Hola Munay Suyu! Los vi en su página web y me gustaría consultarles por una presentación.",

  /* ─────────────────────────────────────────────────────────
     2) REDES  (ya están con las cuentas reales)
     ───────────────────────────────────────────────────────── */
  instagram: "https://www.instagram.com/munay.suyu",
  tiktok:    "https://www.tiktok.com/@munay.suyu",

  /* ─────────────────────────────────────────────────────────
     3) GALERÍA

     Para agregar una foto:
       1. Deja el .jpg en assets/img/
       2. Corre:  python optimizar-imagenes.py
       3. Suma una línea acá

     "base"  = la ruta SIN extensión. El sitio arma solo las versiones
               -480.webp (teléfono) y -grande.webp (escritorio), así cada
               visitante baja únicamente el tamaño que su pantalla necesita.
     "w"/"h" = medidas de la foto grande. Las imprime el optimizador al
               terminar. Sirven para que nada salte mientras carga.
     "zona"  = norte | centro. Es lo que usan los filtros.
     ───────────────────────────────────────────────────────── */
  fotos: [
    { base:"assets/img/grupo-oficial",   w:1008, h:570,  zona:"centro", titulo:"El grupo completo",     pie:"Vestuario de Zona Central: vestidos floreados, chamantos y chupallas." },
    { base:"assets/img/hero-norte",      w:1200, h:1200, zona:"norte",  titulo:"Pañuelo al viento",     pie:"Trote nortino, aguayo tejido y camisa amarilla." },
    { base:"assets/img/grupo-norte",     w:640,  h:480,  zona:"norte",  titulo:"Cuadro Norte",          pie:"Polleras bordadas, pompones y sombreros de la pampa." },
    { base:"assets/img/centro-pareja",   w:640,  h:640,  zona:"centro", titulo:"Cueca de pareja",       pie:"El vuelo del vestido en plena vuelta." },
    { base:"assets/img/norte-bailarina", w:640,  h:640,  zona:"norte",  titulo:"Color del altiplano",   pie:"Detalle del vestuario nortino." },
    { base:"assets/img/huasos",          w:640,  h:640,  zona:"centro", titulo:"Chamanto y chupalla",   pie:"El traje del huaso de la Zona Central." },
    { base:"assets/img/norte-dupla",     w:640,  h:640,  zona:"norte",  titulo:"En dupla",              pie:"Coreografía del cuadro norte." },
    { base:"assets/img/centro-vestido",  w:640,  h:640,  zona:"centro", titulo:"El vestido floreado",   pie:"Enaguas, puntilla y delantal." },
    { base:"assets/img/norte-encuentro", w:640,  h:640,  zona:"norte",  titulo:"Encuentro folclórico",  pie:"Compartiendo escenario con otros conjuntos." },
    { base:"assets/img/escenario",       w:640,  h:640,  zona:"centro", titulo:"Arriba del escenario",  pie:"Presentación completa del conjunto." },
    { base:"assets/img/norte-hombres",   w:640,  h:640,  zona:"norte",  titulo:"Los varones del norte", pie:"Faja, aguayo y sombrero." },
    { base:"assets/img/centro-panuelos", w:640,  h:640,  zona:"centro", titulo:"Pañuelos arriba",       pie:"El gesto que define la cueca." }
  ],

  /* ─────────────────────────────────────────────────────────
     4) VIDEOS
     Deja los .mp4 en assets/video/ y agrégalos acá.
     Ejemplo:
     { src:"assets/video/cueca.mp4", poster:"assets/img/centro-pareja-480.webp",
       titulo:"Cueca en la plaza", pie:"Presentación de septiembre" }
     Mientras esté vacío, la pestaña Videos invita a ver TikTok.
     ───────────────────────────────────────────────────────── */
  videos: [],

  /* ─────────────────────────────────────────────────────────
     5) PRESENTACIONES
     Va en orden cronológico. Las que comparten fecha (mismo "dia"
     y "mes") se agrupan solas bajo un mismo encabezado de fecha.
     ───────────────────────────────────────────────────────── */
  presentaciones: [
    { dia:"4",  mes:"Septiembre", diaSemana:"Viernes",   hora:"12:00", lugar:"CESFAM" },
    { dia:"4",  mes:"Septiembre", diaSemana:"Viernes",   hora:"18:30", lugar:"Biblioteca Paul Harris" },
    { dia:"4",  mes:"Septiembre", diaSemana:"Viernes",   hora:"19:00", lugar:"Comunitario Rotonda Atenas" },
    { dia:"5",  mes:"Septiembre", diaSemana:"Sábado",    hora:"14:00", lugar:"Biblioteca Paul Harris" },
    { dia:"5",  mes:"Septiembre", diaSemana:"Sábado",    hora:"22:00", lugar:"Biblioteca Paul Harris" },
    { dia:"13", mes:"Septiembre", diaSemana:"Domingo",   hora:"15:00", lugar:"Isabel La Católica #4158" },
    { dia:"15", mes:"Septiembre", diaSemana:"Martes",    hora:"17:30", lugar:"Av. Simón Bolívar #3747" },
    { dia:"16", mes:"Septiembre", diaSemana:"Miércoles", hora:"14:00", lugar:"SAR La Reina" },
    { dia:"16", mes:"Septiembre", diaSemana:"Miércoles", hora:"3:30",  lugar:"Camino Las Flores 10126" },
    { dia:"17", mes:"Septiembre", diaSemana:"Jueves",    hora:"16:30", lugar:"Intercomunal" },
    { dia:"20", mes:"Septiembre", diaSemana:"Domingo",   hora:"18:00", lugar:"Intercomunal" },
    { dia:"24", mes:"Septiembre", diaSemana:"Jueves",    hora:"18:00", lugar:"Las Condesas" },
    { dia:"25", mes:"Septiembre", diaSemana:"Viernes",   hora:"17:30", lugar:"Comunitario Patricia" },
    { dia:"25", mes:"Septiembre", diaSemana:"Viernes",   hora:"18:30", lugar:"Comunitario Diaguitas" }
  ],

  /* ─────────────────────────────────────────────────────────
     6) SERVICIOS
     ───────────────────────────────────────────────────────── */
  servicios: [
    {
      ico:'<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>',
      titulo:"Municipalidades",
      texto:"Galas, aniversarios comunales, fiestas costumbristas y actividades en plaza. Llegamos con los dos cuadros y puesta en escena completa.",
      pedir:"Hola, soy de una municipalidad y quiero consultar por una presentación de Munay Suyu."
    },
    {
      ico:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
      titulo:"Empresas",
      texto:"Celebración de fiestas patrias, aniversario de la empresa o actividad de clima laboral. Nos adaptamos al espacio y al tiempo que tengan.",
      pedir:"Hola, quiero cotizar una presentación de Munay Suyu para mi empresa."
    },
    {
      ico:'<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>',
      titulo:"Colegios y jardines",
      texto:"Muestras culturales, semana del folclor y actos del 18. Presentamos, explicamos cada danza y hacemos participar a los niños.",
      pedir:"Hola, soy de un colegio y me gustaría consultar por una presentación de Munay Suyu."
    },
    {
      ico:'<path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/>',
      titulo:"Matrimonios y eventos",
      texto:"La cueca de los novios, una sorpresa para los invitados o un cierre de fiesta con todo el color del norte.",
      pedir:"Hola, quiero consultar por Munay Suyu para un matrimonio o evento privado."
    },
    {
      ico:'<path d="M4 21V8l8-5 8 5v13M4 21h16M9 21v-5h6v5"/><path d="M2 8h20"/>',
      titulo:"Ramadas y fondas",
      texto:"Set completo de 18 de septiembre: cueca, danzas de la zona central y remate nortino para levantar la fonda.",
      pedir:"Hola, quiero consultar por Munay Suyu para una ramada o fonda de septiembre."
    },
    {
      ico:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
      titulo:"Talleres y clases",
      texto:"Enseñamos cueca y danzas nortinas paso a paso. Para equipos de trabajo, cursos de colegio o grupos de la comunidad.",
      pedir:"Hola, me interesa un taller de folclor con Munay Suyu."
    }
  ]
};
