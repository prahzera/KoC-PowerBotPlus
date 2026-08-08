#!/usr/bin/env node
/**
 * KoC Power Bot Plus — "compilador" del proyecto.
 *
 * src/ es la fuente de verdad. Este script concatena sus archivos (en el
 * orden de scripts/manifest.js) y regenera el userscript de un solo
 * archivo (script.js) + script.meta.js. Mismo scope global, misma
 * semántica que el monolito original.
 *
 * Modos:
 *   node build.js            Compila y escribe script.js + script.meta.js.
 *                            Los archivos NUEVOS en src/ se registran
 *                            automáticamente en scripts/manifest.js
 *                            (insertados antes de footer/init.js).
 *   node build.js --check    Verificación de sincronía (CI): compila y
 *                            compara contra script.js en disco. Si difiere
 *                            o hay archivos sin registrar, ABORTA (exit 1).
 *   node build.js --watch    Recompila automáticamente al cambiar src/
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const OUT_SCRIPT = path.join(ROOT, 'script.js');
const OUT_META = path.join(ROOT, 'script.meta.js');
const PKG = require(path.join(ROOT, 'package.json'));

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const WATCH = args.includes('--watch');

const VERSION = PKG.version;

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

/** Walk src/ recursively and return every *.js file (relative path, forward slashes). */
function walk(dir, base) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...walk(full, rel));
    } else if (entry.name.endsWith('.js')) {
      out.push(rel);
    }
  }
  return out;
}

/**
 * Registra archivos nuevos en scripts/manifest.js, insertándolos justo
 * antes de footer/init.js (el bloque de arranque SIEMPRE va al final).
 */
function registerNewFiles(extra) {
  const mf = path.join(ROOT, 'scripts', 'manifest.js');
  const text = fs.readFileSync(mf, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = extra.map((f) => `  '${f}', // registrado automáticamente por build`);
  const marker = /^(\s*\/\/\s*─+\s*footer\s*─+.*)$/m;
  let out;
  if (marker.test(text)) {
    out = text.replace(marker, `${lines.join(eol)}${eol}$1`);
  } else {
    out = text.replace(/\n\];\s*$/, `${eol}${lines.join(eol)}${eol}];`);
  }
  fs.writeFileSync(mf, out);
}

/**
 * Lee src/ en EXACTAMENTE el orden declarado en scripts/manifest.js.
 * Los archivos nuevos en src/ (no declarados) se registran automáticamente
 * en el manifest durante una build normal; en modo --check eso es un error
 * (la salida no puede coincidir con un script.js que no los contiene).
 */
function readSections() {
  const MANIFEST = require(path.join(ROOT, 'scripts', 'manifest.js'));
  const walked = walk(SRC).sort();
  const inManifest = new Set(MANIFEST);
  const extra = walked.filter((rel) => !inManifest.has(rel));

  if (extra.length) {
    if (CHECK) {
      fail(
        `Hay ${extra.length} archivo(s) nuevo(s) en src/ sin registrar en scripts/manifest.js:\n` +
          `  ${extra.join('\n  ')}\n` +
          `Ejecutá "npm run build" (sin --check) para registrarlos automáticamente.`
      );
    }
    console.log(
      `↳ ${extra.length} archivo(s) nuevo(s) en src/ — registrando en scripts/manifest.js: ${extra.join(', ')}`
    );
    registerNewFiles(extra);
    delete require.cache[require.resolve(path.join(ROOT, 'scripts', 'manifest.js'))];
  }

  const MANIFEST_NOW = require(path.join(ROOT, 'scripts', 'manifest.js'));
  const sections = [];
  const missing = [];
  for (const rel of MANIFEST_NOW) {
    const full = path.join(SRC, rel);
    if (!fs.existsSync(full)) {
      missing.push(rel);
      continue;
    }
    sections.push({ name: rel, content: fs.readFileSync(full, 'utf8') });
  }
  if (missing.length) {
    fail(`Faltan archivos declarados en el manifiesto:\n  ${missing.join('\n  ')}`);
  }
  if (sections.length === 0) fail(`No hay secciones en src/ (${SRC})`);
  if (!sections[0].content.startsWith('// ==UserScript==')) {
    fail(`El primer archivo de src/ (${sections[0].name}) no empieza con el banner // ==UserScript== — revisá el orden.`);
  }
  return sections;
}

/** Replace exactly one match; throws if 0 or >1 matches. */
function replaceOnce(text, re, replacer, label) {
  let count = 0;
  const out = text.replace(re, (...m) => {
    count++;
    return replacer(...m);
  });
  if (count === 0) fail(`No se encontró "${label}" para inyectar la versión.`);
  if (count > 1) fail(`Se encontraron ${count} coincidencias de "${label}" (debe ser única).`);
  return out;
}

/** Inject the centralized version (from package.json) into the two known spots. */
function injectVersion(content) {
  let out = content;
  out = replaceOnce(
    out,
    /^(\/\/ @version\s+)[0-9][0-9.]*$/m,
    (_full, prefix) => `${prefix}${VERSION}`,
    'banner // @version'
  );
  out = replaceOnce(
    out,
    /^(var Version = ')[^']*(';)$/m,
    (_full, pre, post) => `${pre}${VERSION}${post}`,
    'var Version = ...'
  );
  return out;
}

/** Build the full userscript from the sections. */
function build() {
  const sections = readSections();
  const eol = sections[0].content.includes('\r\n') ? '\r\n' : '\n';
  let script = sections.map((s) => s.content).join(eol);
  script = injectVersion(script);
  const meta = sections[0].content + eol; // header banner, como el sed del workflow
  return { script, meta, sections };
}

/** Byte-compare two strings and print the first difference. */
function diffInfo(a, b) {
  let i = 0;
  while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++;
  return {
    at: i,
    original: JSON.stringify(a.slice(Math.max(0, i - 50), i + 50)),
    built: JSON.stringify(b.slice(Math.max(0, i - 50), i + 50)),
  };
}

function run() {
  const { script, meta, sections } = build();

  if (CHECK && fs.existsSync(OUT_SCRIPT)) {
    const current = fs.readFileSync(OUT_SCRIPT, 'utf8');
    if (script !== current) {
      const d = diffInfo(current, script);
      console.error('✗ --check: la salida NO coincide con script.js actual.');
      console.error(`  Primera diferencia en byte ${d.at}:`);
      console.error(`  actual: ${d.original}`);
      console.error(`  build:  ${d.built}`);
      console.error('  NO se escribió nada. Revisá las secciones de src/.');
      process.exit(1);
    }
    console.log('✔ --check: la salida es IDÉNTICA a script.js actual. OK.');
  }

  fs.writeFileSync(OUT_SCRIPT, script);
  fs.writeFileSync(OUT_META, meta);

  const kb = (script.length / 1024).toFixed(1);
  console.log(
    `✔ script.js (${kb} KB) y script.meta.js generados a partir de ${sections.length} secciones (v${VERSION}).`
  );
}

// --- Watch mode: rebuild whenever src/ changes ---
if (WATCH) {
  console.log(`👁  Vigilando src/ (recursivo) — recompilando en cada cambio (Ctrl+C para salir)`);
  run();
  let timer = null;
  fs.watch(SRC, { persistent: true, recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        run();
      } catch (e) {
        console.error(`✗ ${e.message}`);
      }
    }, 150);
  });
} else {
  run();
}
