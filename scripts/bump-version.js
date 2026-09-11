#!/usr/bin/env node
/**
 * Sube la versión X.Y.Z en package.json y recompila.
 *
 *   node scripts/bump-version.js fix     → +1 en Z (arreglos y mejoras)
 *   node scripts/bump-version.js feature → +1 en Y, Z = 0 (nuevas features)
 *   node scripts/bump-version.js major   → +1 en X, Y = 0, Z = 0
 *
 * Al terminar ejecuta `node build.js` y `node build.js --check` para dejar
 * script.js/script.meta.js listos para commitear.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));

const type = process.argv[2];
const m = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.exec(pkg.version);
if (!m) {
  console.error(`La versión actual de package.json ("${pkg.version}") no tiene formato X.Y.Z (ej. 4.26.0).`);
  process.exit(1);
}

let [x, y, z] = [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
let label;
if (type === 'fix') {
  z += 1;
  label = 'arreglo/mejora (Z)';
} else if (type === 'feature') {
  y += 1;
  z = 0;
  label = 'feature (Y)';
} else if (type === 'major') {
  x += 1;
  y = 0;
  z = 0;
  label = 'major (X)';
} else {
  console.error('Uso: node scripts/bump-version.js <fix|feature|major>');
  process.exit(1);
}

const next = `${x}.${y}.${z}`;
pkg.version = next;
fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Versión: ${pkg.version} → ${next} (${label})`);
try {
  execSync('node build.js', { stdio: 'inherit', cwd: ROOT });
  execSync('node build.js --check', { stdio: 'inherit', cwd: ROOT });
} catch (e) {
  console.error('El build falló tras subir la versión; revisa antes de commitear.');
  process.exit(1);
}
console.log('Versión subida y script.js regenerado. Revisa git diff y haz el commit de release si corresponde.');