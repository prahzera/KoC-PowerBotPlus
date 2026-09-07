---
name: koc-power-bot-plus-workflow
description: Checklist obligatorio para CUALQUIER cambio en el repositorio KoC Power Bot Plus. Usa SIEMPRE que edites src/, lang_es.json/lang_en.json, script.js, o prepares una versión/release: subir versión en package.json, actualizar // @releasenotes en src/meta/header.js (New Features! del modal), revisar claves de idioma, npm run build + build:check, y commit con formato "KoC Power Bot Plus vX.Y.Z - ...".
---

# Workflow: cambios en KoC Power Bot Plus

Userscript monolito: `src/` es la fuente de verdad. `script.js` y `script.meta.js` se GENERAN con `npm run build` (NUNCA editar a mano; los cambios se hacen en `src/`). CI ejecuta `node build.js --check` y en la versión publicada `script.js` debe quedar idéntico a la salida del build.

## Checklist obligatorio en cada cambio

1. **Versión**: subir `"version"` en `package.json` (X.Y.Z) SOLO cuando el cambio sea una actualización/release user-facing que los usuarios van a instalar vía auto-update. El build la inyecta en el banner `// @version`, en `var Version` (src/core/version.js) y en `script.meta.js`. Cambios internos (skill, tooling, build, sólo release notes, infra) NO suben versión. NO editar a mano ni `src/meta/header.js` ni `src/core/version.js` para la versión.

2. **Release notes (por eso el modal "New Features!")**: actualizar SIEMPRE la línea `// @releasenotes` de `src/meta/header.js` (línea 46) con el resumen user-facing de los cambios de esta versión, en una sola línea y en español. AutoUpdater la lee (regex `\/\/\s*@releasenotes\s+(.+)`) y la muestra bajo `tx('New Features!')`. Si no se actualiza, los usuarios ven las notas viejas.

3. **Idiomas (lang packs)**: todo string NUEVO visible para el usuario se añade como clave en `lang_es.json` (valor en español) y `lang_en.json` (valor `""`). Las claves solo llegan a los usuarios tras publicar una release (los packs se descargan de `releases/latest/download/lang_<lang>.json`). Si existe un string del juego adecuado, usar `uW.g_js_strings.*` en vez de una clave nueva (evita depender del pack). Claves retiradas deben borrarse de ambos archivos.

4. **Build y verificación**: para archivos editados de `src/`: `node --check <file>`, luego `npm run build` y `npm run build:check`. Archivos nuevos en `src/` se registran automáticamente en `scripts/manifest.js` con un build normal (en `--check` eso es un error a propósito). Si resultó script.js / script.meta.js, commitearlos siempre.

5. **Commit**: el formato `KoC Power Bot Plus vX.Y.Z - <descripción>` (primera línea matcheable por `^KoC Power Bot Plus v([0-9.]+)`, que dispara el release automático al pushear a main) se usa SOLO para releases/actualizaciones. Para cambios que NO lanzan update (skill, tooling, build, release-notes-only, infra) usar un mensaje NORMAL descriptivo SIN prefijo de versión (p. ej. `Add workflow skill`). Committear solo lo intencional (git status/git diff antes); NO hacer push salvo que el usuario lo pida.

## Reglas
- No editar `script.js` directamente: cambiar en `src/` y rebuild.
- No crear documentación (*.md) ni comentarios en el código salvo que se pida.
- No subir secretos.
- Trabajar en español cuando el usuario lo haga.