---
name: koc-power-bot-plus-versioning-and-changes
description: Skill complementaria de koc-power-bot-plus-workflow para el repo KoC Power Bot Plus. Documenta el versionado X.Y.Z (npm run version:fix/feature/major, validación en build.js, comparación del AutoUpdater y regex del release automático) y los cambios recientes (v4.25 distancia desde la ciudad seleccionada en Search, v4.26 idiomas con LangVersion y refresco automático al arrancar/al cambiar de versión) y el trabajo pendiente (detección instantánea en el tab Scout Reports). Cargar siempre junto con la skill de workflow para no investigar ni repetir.
---

# KoC Power Bot Plus — Versionado y cambios recientes

Skill complementaria de `koc-power-bot-plus-workflow`. Cargarla SIEMPRE junto a ella al trabajar en este repo (cualquier edición en `src/`, lang packs o preparación de release). Esta skill recoge **lo nuevo** para no tener que investigar.

## Versionado X.Y.Z (desde 4.26.0)

- Formato OBLIGATORIO `X.Y.Z` en `package.json` (`build.js` aborta si no cumple `^[0-9]+\.[0-9]+\.[0-9]+$`). **X** = versión principal del sistema, **Y** = feature nueva, **Z** = arreglo/mejora de features. Con esto evitamos llegar a "4.10000" simplemente con fixes.
- Comandos (suben la versión, recompilan y verifican con `scripts/bump-version.js`):
  - `npm run version:fix` → Z+1 (ej. 4.26.0 → 4.26.1)
  - `npm run version:feature` → Y+1, Z=0 (ej. 4.26.0 → 4.27.0)
  - `npm run version:major` → X+1, Y=Z=0 (ej. 4.27.0 → 5.0.0)
- Compatibilidad sin cambios: `AutoUpdater.compareVersion` (src/options/auto-updater.js) compara por partes (`split('.')` + `parseIntNan`) → "4.26.0" vs "4.26" NO da falso update; "4.26.1" > "4.26.0" correcto. El release automático (`.github/workflows/release.yml`) matchea `^KoC Power Bot Plus v([0-9.]+)` → admite `v4.26.1` (tag/name `v4.26.1`).
- La versión se inyecta durante el build en `// @version` (banner), `var Version` (src/core/version.js) y `script.meta.js`. NO editar esos lugares a mano.

## Cambios recientes

### v4.25 — Search: distancia desde la ciudad seleccionada
- `mapDat[2]` (columna Distance) se calcula desde la ciudad del picker (`t.ModelCityId`, helper `t.distOrigin()`) en vez del centro de la búsqueda/provincia. `mapCallback` usa `dOrigin = t.distOrigin()`.
- `citySelNotify` → `t.recalcDistances()` al cambiar de ciudad (recalcula `mapDat[2]` y re-renderiza) si hay resultados y existe `pbStatFound`.
- El filtro de búsqueda CIRCULAR sigue relativo al CENTRO de búsqueda: `distance(startX, startY, x, y) <= maxDistance` (NO usar `mapDat[2]` para eso).

### v4.26 — Idioma: packs auto-refrescables
- `lang_es.json` / `lang_en.json` llevan metadatos `"CurrLang"` y `"LangVersion"` (fecha YYYYMMDD); NO son claves de traducción (los valores `""` del pack en son el fallback a inglés).
- `Tabs.Options.LoadLanguage` (src/tabs/options/options.js) aplica el pack descargado si `rslt.LangVersion && (!LanguageArray.LangVersion || parseIntNan(String(local)) < parseIntNan(String(remote)))`. Antes solo ponía "New Language Pack Available!" sin aplicar → los packs nunca se refrescaban (causa de claves en inglés).
- Refresco automático al arrancar (src/bootstrap/startup.js): si `Options.LanguageLastChecked + 7 días < unixTime()` **O** `Options.LanguageScriptVersion != Version` → `setTimeout(Tabs.Options.LoadLanguage, 8000)`. `LanguageScriptVersion` (src/options/options.js, default 0) se fija en `LoadLanguage` → al actualizar el script el pack se refresca.
- Las ediciones manuales de traducción (Options > Edit Translations) persisten hasta que el pack remoto sea más nuevo.

## Trabajo pendiente (no implementado)
- **Tab Scout Reports — detección casi-instantánea**: hoy `listreports` escanea `listReports.php` cada 30 s en reposo (10 s inicial; 5 s entre páginas o tras borrar) y `fetchreport` procesa 1 detalle cada 2 s vía `EverySecond` (que corre cada 1 s vía `tabManager.EverySecond()`).
- Plan acordado (híbrido): (1) trigger al aterrizar una marcha de exploración propia (`Seed.queue_atkp` con `marchType == 3` cruzando `destinationUnixTime`, o desapareciendo de la cola); (2) trigger cuando suba `Seed.newReportCount`; (3) bajar `scandelay` 30→5 s como respaldo (cubre scouts entrantes). Detalles en el plan de sesión.
- Cuando se implemente → es una feature → `npm run version:feature` → 4.27.0 (no olvidar `// @releasenotes`).

## Reglas rápidas
- Build: `node --check <archivo>` → `npm run build` → `npm run build:check`; commitear `script.js` siempre que cambie.
- Commit de release: `KoC Power Bot Plus vX.Y.Z - <descripción>`. Cambios de skill/tooling/infra: mensaje normal sin prefijo. NO push salvo que lo pida el usuario.