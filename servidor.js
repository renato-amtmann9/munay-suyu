/* Servidor estático mínimo para ver la web en local.
   Uso:  node servidor.js          → http://localhost:4600
   No necesita npm install ni nada más. */

const http = require("http");
const fs   = require("fs");
const path = require("path");
const zlib = require("zlib");

const PUERTO = process.env.PORT || 4600;
const RAIZ   = __dirname;

const TIPOS = {
  ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8",
  ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8",
  ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".png":"image/png", ".gif":"image/gif",
  ".svg":"image/svg+xml", ".webp":"image/webp", ".ico":"image/x-icon",
  ".mp4":"video/mp4", ".webm":"video/webm", ".mp3":"audio/mpeg",
  ".woff":"font/woff", ".woff2":"font/woff2"
};

// Solo se comprime texto: jpg, webp y woff2 ya vienen comprimidos de fábrica
// y volver a pasarlos por gzip solo gastaría tiempo.
const COMPRIMIBLES = new Set([".html", ".css", ".js", ".json", ".svg"]);

http.createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split("?")[0]);
  if (ruta === "/") ruta = "/index.html";

  const archivo = path.join(RAIZ, path.normalize(ruta).replace(/^(\.\.[\/\\])+/, ""));
  if (!archivo.startsWith(RAIZ)) { res.writeHead(403); return res.end("403"); }

  fs.readFile(archivo, (err, datos) => {
    if (err){
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<h1 style='font-family:sans-serif;padding:40px'>404 &mdash; no encontrado</h1>");
    }

    const ext = path.extname(archivo).toLowerCase();
    const cabeceras = {
      "Content-Type": TIPOS[ext] || "application/octet-stream",
      "Cache-Control": COMPRIMIBLES.has(ext) ? "no-cache" : "public, max-age=604800"
    };

    // Se comprime el texto (html, css, js) igual que lo haría un hosting real,
    // para que lo que se ve en local se parezca a lo que verá la gente.
    const aceptado = (req.headers["accept-encoding"] || "");
    if (COMPRIMIBLES.has(ext) && /\bgzip\b/.test(aceptado) && datos.length > 512){
      zlib.gzip(datos, { level: 6 }, (e, comprimido) => {
        if (e) { res.writeHead(200, cabeceras); return res.end(datos); }
        cabeceras["Content-Encoding"] = "gzip";
        cabeceras["Vary"] = "Accept-Encoding";
        res.writeHead(200, cabeceras);
        res.end(comprimido);
      });
      return;
    }

    res.writeHead(200, cabeceras);
    res.end(datos);
  });
}).listen(PUERTO, () => {
  console.log("\n  ♥  Munay Suyu corriendo en  http://localhost:" + PUERTO + "\n");
});
