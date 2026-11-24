import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { marked } = await import(pathToFileURL(require.resolve("marked")).href);
const markdown = await readFile(new URL("INSTRUCTIVO.md", import.meta.url), "utf8");
const html = marked.parse(markdown).replace(/^<h1>.*?<\/h1>\s*/, "").replace(/<h2>(.*?)<\/h2>/g, (_, title) => {
  const id = title.normalize("NFD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return '<h2 id="' + id + '">' + title + '</h2>';
});
const embed = text => "[\n" + text.split("\n").map(line => "  " + JSON.stringify(line)).join(",\n") + '\n].join("\\n")';

const runtime = [
  '"use strict";',
  '',
  '// Generado desde INSTRUCTIVO.md con actualizar-instructivo.mjs.',
  '// Copia local para leer y descargar la guía al abrir el sitio desde disco.',
  '(function () {',
  '  const markdown = ' + embed(markdown) + ';',
  '  const contenido = document.querySelector("[data-instructivo-contenido]");',
  '  if (contenido) contenido.innerHTML = ' + embed(html) + ';',
  '  if (location.protocol === "file:") {',
  '    const archivo = new Blob([markdown], { type: "text/markdown;charset=utf-8" });',
  '    const url = URL.createObjectURL(archivo);',
  '    for (const enlace of document.querySelectorAll("[data-descargar-instructivo]")) enlace.href = url;',
  '  }',
  '}());',
  ''
].join("\n");
await writeFile(new URL("instructivo-web.js", import.meta.url), runtime, "utf8");
