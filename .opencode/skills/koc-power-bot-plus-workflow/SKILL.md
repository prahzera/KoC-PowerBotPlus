---
name: koc-power-bot-plus-workflow
description: Checklist obligatorio para CUALQUIER cambio en el repositorio KoC Power Bot Plus. Usa SIEMPRE que edites src/, lang_es.json/lang_en.json, script.js, o prepares una versión/release: subir versión en package.json, actualizar // @releasenotes en src/meta/header.js (New Features! del modal), revisar claves de idioma, npm run build + build:check, y commit con formato "KoC Power Bot Plus vX.Y.Z - ...". Incluye referencia completa del Tab Search (mapa, provincias, bloques, last login) para no investigar.
---

# Workflow: cambios en KoC Power Bot Plus

Userscript monolito: `src/` es la fuente de verdad. `script.js` y `script.meta.js` se GENERAN con `npm run build` (NUNCA editar a mano; los cambios se hacen en `src/`). CI ejecuta `node build.js --check` y en la versión publicada `script.js` debe quedar idéntico a la salida del build.

## Checklist obligatorio en cada cambio

1. **Versión (X.Y.Z)**: subir `"version"` en `package.json` SOLO cuando el cambio sea una actualización/release user-facing (auto-update). Formato obligatorio **X.Y.Z** (build.js aborta si no lo cumple): **X** = versión principal del sistema, **Y** = nuevas features, **Z** = arreglos y mejoras de features. Usar `npm run version:feature` (sube Y, Z=0), `npm run version:fix` (sube Z) o `npm run version:major` (sube X, Y=Z=0); estos scripts suben la versión y recompilan. El build inyecta la versión en el banner `// @version`, en `var Version` (src/core/version.js) y en `script.meta.js` (build.js). Cambios internos (skill, tooling, build, sólo release notes, infra) NO suben versión. NO editar a mano `src/core/version.js` (es un placeholder que el build sobreescribe) ni el `// @version` de `src/meta/header.js`.

2. **Release notes (por eso el modal "New Features!")**: actualizar SIEMPRE la línea `// @releasenotes` de `src/meta/header.js` (línea 46) con el resumen user-facing de los cambios de esta versión, en una sola línea y en español. AutoUpdater la lee (regex `\/\/\s*@releasenotes\s+(.+)`) y la muestra bajo `tx('New Features!')`. Si no se actualiza, los usuarios ven las notas viejas.

3. **Idiomas (lang packs)**: todo string NUEVO visible para el usuario se añade como clave en `lang_es.json` (valor en español) y `lang_en.json` (valor `""`). Las claves solo llegan a los usuarios tras publicar una release (los packs se descargan de `releases/latest/download/lang_<lang>.json`). Si existe un string del juego adecuado, usar `uW.g_js_strings.*` en vez de una clave nueva (evita depender del pack). Claves retiradas deben borrarse de ambos archivos.

4. **Build y verificación**: para archivos editados de `src/`: `node --check <file>`, luego `npm run build` y `npm run build:check`. Archivos nuevos en `src/` se registran automáticamente en `scripts/manifest.js` (lista ORDENADA de concatenación) con un build normal (en `--check` eso es un error a propósito). Si resultó script.js / script.meta.js, commitearlos siempre.

5. **Commit**: el formato `KoC Power Bot Plus vX.Y.Z - <descripción>` (primera línea matcheable por `^KoC Power Bot Plus v([0-9.]+)`, que dispara el release automático al pushear a main) se usa SOLO para releases/actualizaciones. Para cambios que NO lanzan update (skill, tooling, build, release-notes-only, infra) usar un mensaje NORMAL descriptivo SIN prefijo de versión (p. ej. `Add workflow skill`). Committear solo lo intencional (git status/git diff antes); NO hacer push salvo que el usuario lo pida.

## Reglas
- No editar `script.js` directamente: cambiar en `src/` y rebuild.
- No crear documentación (*.md) ni comentarios en el código salvo que se pida.
- No subir secretos.
- Trabajar en español cuando el usuario lo haga.

---

# Conocimiento del repositorio

## Arquitectura
- **Monolito Tampermonkey**: src_files concatenados por orden de `scripts/manifest.js`. `script.js` (~2 MB) y `script.meta.js` (gitignored) se generan con `npm run build`.
- `src/core/runtime.js` define los objetos globales base: `JSON2`, `uW` (objeto real del juego, p. ej. `uW.g_ajaxpath`, `uW.g_js_strings`, `uW.tvuid`, `uW.provincenames`), `Seed`, `CM`, `http`, `KOCMON_ON`, `GameURL`.
- `src/core/world.js`: objeto `Provinces` (esquinas superior-izquierda de cada provincia). `src/core/constants.js`: `MAP_DELAY = 2000`, `MAX_BLOCKS = 20`.
- `src/utils/i18n.js`: `tx('Clave')` traduce desde el pack descargado; usa la clave si no hay pack.
- Versiones pasadas: 3.90..3.96 (filtros last login, botón Actualizar) → 3.97 (búsqueda de todo el mapa). Última feature v3.97 en `main` (commit de release). NO push sin pedido.

## Estructura de src/
- `tabs/` — una carpeta por tab/feature UI (hojas. repetitivo `tabs/search`, `tabs/shared/...`).
- `core/` — base: `runtime.js`, `world.js`, `constants.js`, `version.js` (placeholder).
- `game-api/` — wrappers de AJAX del juego: `map.js` (`GotoMap`, `GotoMapRpt`, `PlotCityImage`, `PlotAllianceHQ`), `online.js` (`getOnline(uidArray, notify)` → `ajax/getOnline.php`), `ui.js` (`generateBlockList`, line 74), `players.js` (`fetchPlayerCourt`), `hq.js`, `wilds.js`, etc.
- `game-data/` — datos estáticos del juego (tileTypes, niveles, trofeo, etc.).
- `utils/` — helpers puros: `map-math.js` (`distance`), `time.js` (`unixTime`, `convertTime`), `game-utils.js` (`getServerId`), `i18n.js`, `dom.js` (`ById`), `numbers.js` (`parseIntNan`), `format.js`, `options-io.js` (`saveOptions`), `logging.js`, etc.
- `meta/header.js` — banner (línea 46 = `// @releasenotes`), `footer/`, `options/`, `panels/`, `ui/` (botones, ventanas, main-loop), `auth/`, `features/` (raids, battle-popup...), `bootstrap/`.

## Helpers globales disponibles (se usan todo el tiempo)
- `tx('Key')` i18n · `ById('id')` = getElementById · `jQuery` disponible · `parseIntNan(x)` (devuelve 0 si no es número).
- `htmlSelector({1:'A',2:'B'}, sel, 'id=miId')` genera `<select>` · `strButton20('Texto','id=miId')` genera botón pequeño.
- `ChangeOption('SearchOptions','idElemento','Propiedad', cb)` y `ToggleOption(...)` persisten en Options (src/options) y llaman cb (usar en vez de escribir el listener manualmente).
- `saveOptions()` · `StartKeyTimer(input, fn)` para input con texto · `distance(x1,y1,x2,y2)` (map-math).
- `getServerId()` (game-utils) · `getOnline(uids, cb)` (online.js) · `fetchPlayerCourt(uid, cb)` (players.js).
- **UNIDADES DE TIEMPO: `unixTime()` y `convertTime(fecha)` devuelven SEGUNDOS (no milisegundos)** — src/utils/time.js. Para días hay que dividir por `86400`, NO `86400000` (bug real corregido en v3.93).

---

# Mapa del juego (conocimiento esencial)
- Coordenadas X/Y: **0..749** (mundo cuadrado de 750×750). El mundo NO es infinito: el borde hace "wrap" (restar 750 / sumar 750).
- **25 provincias de 150×150**. `src/core/world.js`: `Provinces = { p1:{x:0,y:0}, p2:{x:150,y:0}, p3:{x:300,y:0}, ... }`.
  - **Las claves son STRINGS `"p1".."p25"`, NO números.** Cen. de provincia = `Provinces["pN"].x + 75` / `.y + 75`.
  - Para comprobar "¿es una provincia real?" usar `if (Provinces[valor])` (truthy). Un valor como `"0"` u `"-1"` NO es provincia.
  - Nombres visibles: global del juego `uW.provincenames["p" + tileProvinceId]` (no definir, es del juego).
- **Bloques del mapa**: petición unitaria = bloque de 5×5 tiles, con nombre `bl_<xx>_bt_<yy>` (xx,yy múltiplos de 5). `generateBlockList(X, Y, Radius)` en `src/game-api/ui.js:74` genera la lista de bloques de un cuadrado.
  - `MAX_BLOCKS = 20` bloques simultáneos por request · `MAP_DELAY = 2000` ms entre requests.
  - Búsqueda de todo el mapa = **150×150 = 22.500 bloques, ~1.130 requests, ~40 min**. Riesgos: captcha/"green map" (respuesta inválida → `BotCode 999` aborta la búsqueda), resultado enorme (decenas de miles de tiles en la tabla). Es EXPRESO del usuario (v3.97).

---

# Tab Search — guía de referencia (src/tabs/search/search.js)

Objeto de estado: `Tabs.Search` (todo en mayúsculas/claves: `Options`, `LastSearch`, `mapDat`, `dat`, `blockList`, `blocksTotal`, `blocksSearched`, `lastLogin`, ...). Opciones persistidas en `Tabs.Search.Options` == `Options.SearchOptions`.

## Dropdown de provincia (`pbSearchProvince`) — tres tipos de valor
- **`"0"`** (defecto): "Todas las provincias" + coords manuales (X/Y/Radio). Usado por la búsqueda manual y por `clickedSearchAura` (Aura Arcana).
- **`"-1"`** (v3.97): opción "— Todas las Provincias —" = buscar TODO el mapa de una sola vez.
  - Ignora coords/radio (validación saltada), fuerza `SearchShape = 0` (cuadrado).
  - `firstX=0, firstY=0, lastX=749, lastY=749` y `BlockList` = los 22.500 bloques `bl_<x>_bt_<y>` de 0..745 en pasos de 5 (search.js:478-490). El bucle de continuación lo recorre solo hasta "Completed!".
- **`"pN"`**: provincia concreta. `setSlice` la divide en sub-cuadrados (1/4/9/.../64; selector `pbProvinceSlices` y `pbProvinceSlice` dentro del `<SPAN id=pbSlicesSpan>`).
  - `pbSlicesSpan` se muestra SOLO cuando `Provinces[value]` es truthy (provincia real); oculto con "0" y "-1". Ajustar también en `showlastsearch`.

## Reglas críticas del centinela
- NO comprobar "¿provincia?" con `t.opt.province != 0` — con el valor `"-1"` eso daría true y rompería (split("p")[1] = undefined). Usar SIEMPRE `Provinces[t.opt.province]` (truthy = provincia real). Puntos marcados: `setSlice`, `mapCallback` (pOK), triggers de `LookupMists` (en `clickedSearch` y en el checkbox `pbautoKM`). **Todo call-site de `t.LookupMists(...)` debe estar guardado con `Provinces[t.opt.province]`** (usa `t.opt.province.split("p")[1]` internamente, línea ~1306 → URL `http://www.rycamelot.com/misted/<server>/<prov>`).

## Flujo de búsqueda
1. `clickedSearch` (línea 416): lee `pbSearchProvince`/`pbProvinceSlice`/`pbProvinceSlices` → valida (X/Y 0..749, Radio 1..75; si `province == -1` salta validación) → setupResultsPanel → mists (si aplica) → guarda oldmists → bounds + BlockList → lanza.
2. Bounds con wrap: `firstX = startX - dist; if (firstX < 0) firstX += 750;` y `lastX = startX + dist; if (lastX >= 750) lastX -= 750;` (igual Y). Para `-1`: 0..749 sin wrap.
3. Continuación automática (línea ~1146-1165): por tick consume hasta `MAX_BLOCKS` de `t.BlockList`, arma `blockString = t.Blocks.join("%2C")`, `setTimeout(..., MAP_DELAY)` → `t.MapAjax.LookupMap(...)` → `eventGetPlayerOnline` → `getOnline(uList)` → `mapCallback`. Con `t.BlockList` vacío → `stopSearch(tx('Completed!'), true)`.
4. `mapCallback` (línea ~1060): filtra cada tile por `xOK/yOK` (con wrap) y `pOK` (solo si provincia real) → arma fila `mapDat` → `enqueueLastLogins()`.
5. Búsqueda de Aura: `clickedSearchAura` (línea 404) rellena X/Y/Radio del HQ del arca (nivel 3 del HQ) y **fuerza `pbSearchProvince.selectedIndex = 0`** (modo coords) antes de llamar a `clickedSearch()` — NO romper esto.
6. `e_coordChange` (escuchar en X/Y/Radio): al tocar coords resetea el dropdown a `"0"` y **oculta `pbSlicesSpan`**.

## Esquema de `mapDat[i]` (índices 0..22)
```
0 xCoord · 1 yCoord · 2 dist · 3 tileType · 4 tileLevel · 5 tileCityId · 6 userId (u; 0 si desconocido)
7 city · 8 name · 9 might · 10 alli · 11 aID · 12 online (1/0, real por getOnline) · 13 misted
14 isPrestige · 15 prestigeLevel · 16 prestigeType · 17 tileId · 18 tileProvinceId · 19 placeholder=false
20 premiumTile · 21 hqId · 22 lastLoginStr ('YYYY-MM-DD HH:MM:SS' UTC, '' si aún no se sabe)
```
- `t.mapDat` = bruto de la búsqueda actual · `t.dat` = filas FILTRADAS (las de la tabla) · `t.dispMapTable()` re-renderiza la tabla · `t.LastSearch` = última búsqueda (restaura con `showlastsearch`, que setea el dropdown y slices).
- Tile types: 50 = ciudad, 51 = city/villaje no asociado (barb si sin dueño, `tileType 53` = niebla), 53 = niebla (ciudad o plano). `tileTypes[tileType]` = texto (game-data).

## "Última conexión" / online (features v3.93–v3.98)
- Origen: `fetchPlayerCourt(uid, cb)` → `cb.rslt.playerInfo.lastLogin`. Procesado en cola (`processLastLoginQueue`, con `t.lastLoginQueue/Pending/Running/Fetched/Total`); `enqueueLastLogins()` encola los uids de la tabla.
- **v3.98 — rendimiento**: `enqueueLastLogins` es incremental (`t.lastLoginEnqLen` marca el último índice procesado; **NUNCA escanear todo `mapDat` por bloque — el render ya es throttled**). Se construye un índice `t.lastLoginIdx` (uid → array de índices de fila de `mapDat`) cada vez que se encolan filas; `processLastLoginQueue` usa ese índice para actualizar `row[22]` y el DOM (`pll_<x>_<y>`) sin barrer `mapDat`/`t.dat` completos por fetch. `savelastlogins` throttled (cada 50 fetched o 60 s: condiciones `lastLoginFetched - lastLoginSaved >= 50 || unixTime() - lastLoginSaveAt > 60`). El índice se resetea al iniciar búsqueda y en `showlastsearch`.
- Persistencia: `GM_setValue('SearchLastLogin_<serverId>_<uW.tvuid>', JSON2.stringify(t.lastLogin))` (`savelastlogins`/`readlastlogins`).
- Filtro por días (ShowLastLogin + min/max): `LLdays = (unixTime() - convertTime(new Date(LL.replace(' ','T')+'Z'))) / 86400`. Min/Max inputs `pbSearchLastLoginMinDays`/`pbSearchLastLoginMaxDays`, con `StartKeyTimer`.
- Regla vigente: **el filtro NO aplica a jugadores online reales** (`t.mapDat[i][12] != 1`); un online real (getOnline=1) SIEMPRE pasa. NO reintroducir heurístico de "<1 día" (se añadió en v3.95 y se revirtió en v3.96 a petición expresa del usuario: solo quiere online GENUINOS).
- **v4.00 — la columna de Última vez SOLO para ciudad (SearchType 0) y salvaje (2)**: helper `t.lastLoginUsable()` = `Options.SearchOptions.ShowLastLogin && (SearchType == 0 || SearchType == 2)`. Todas las entradas (col header, celda `pll_`, `LLspan` colspan, `enqueueLastLogins`, `RefreshLastLogins`, `processLastLoginQueue`, filtro min/max días, fila de opciones `pbslastlogin1/2/3`, botón refresh) se guardan con `lastLoginUsable()`, NO con `ShowLastLogin` a secas. `setupFilterDisplay` oculta la fila del checkbox si el tipo de búsqueda no lo soporta. **Si la columna deja de estar disponible y `sortColNum == 22`, se resetea a 2 (Distancia)**: pasa al desactivar el checkbox (handler del toggle) y al cambiar de tipo de búsqueda (en `setupFilterDisplay`); `searchClickSort` además valida que la cabecera previa exista (`ById(...)` puede ser null cuando la columna 22 desapareció).
- Columna de la tabla: last login = índice 22 (ordenar pone `Options.SearchOptions.sortColNum = 22`).
- Botón **"Actualizar"** (`pbRefreshLastLogin`, TD `pbslastloginrefresh` en el header de resultados): `RefreshLastLogins` (línea ~1211) limpia `lastLogin` de los jugadores de `t.dat` (excepto online), re-encola sus last-logins, y además hace `getOnline(uids)` en lote para refrescar `mapDat[i][12]` y re-renderiza (`dispMapTable`). Se muestra solo con ShowLastLogin activo (`setupFilterDisplay`).
- Modal de opciones: `pbSearchShowLastLogin` (checkbox) + `pbSearchLastLoginMinDays`/`MaxDays` (inputs) en `pbslastlogin1/2/3`, conectados con `ToggleOption`/`ChangeOption` y `StartKeyTimer`.

## Rendimiento / render (v3.98)
- **`dispMapTable()` NO se llama por bloque**: la continuación del scan usa `t.throttledRender()` (timer de 2 s; si `!searchRunning` renderiza directo; `stopSearch` limpia el timer). Sin esto, un mapa completo (~1.130 bloques) re-filtraba y re-ordenaba `mapDat` completo en cada bloque → congelado.
- **Paginación del resultado final**: si `!searchRunning && dat.length > t.pageSize` (default 250; selector 100/250/500/1000), se renderiza solo el slice `[pageStart, pageEnd)` con barra «‹»/«›»/«››». Exports globales: `ptsearchPage(n)` (clampa), `ptsearchPageRel(d)`, `ptsearchPageSize(n)`. `t.pageNum` se resetea a 1 al iniciar búsqueda y al cambiar columna de orden (`searchClickSort`). Mientras `searchRunning` sigue el cap `MAX_SHOW_WHILE_RUNNING = 500`. **`t.dat.sort(sortFunc)` SOLO si `!searchRunning`** (el orden del mapa completo se difiere al final; durante el scan la tabla se muestra sin ordenar para evitar micro-cuelgues).
- **`savelastsearch` con presupuesto**: `stopSearch` con `savelast` guarda `mapDat` SOLO si `t.mapDat.length <= 5000`; si no, omite `mapDat` (sin botón "Previous Search", nota `sNote` en `pbSearchMessages`) para no serializar MB con `JSON2.stringify` síncrono ni exceder la cuota de GM storage.

## Opciones clave de `Tabs.Search.Options` (SearchOptions)
`SearchType` (0 ciudad, 1 barbario, 2+ salvaje...) · `SearchShape` (0 cuadrado / 1 círculo) · `MinLevel/MaxLevel` · `WildType` · `Unowned/Misted/OldMists/NewMists` · `Hostile/Friendly/Neutral/Unallied` · `HostileAlliances` (objeto aid→true = EXCLUIR esa alianza hostil del filtro) · `MinMight/MaxMight` (en el filtro se multiplican por 1e9: `MinMight * 1000000000`) · `Rank/RankType` · `AllianceName/PlayerName` (búsqueda parcial, toUpperCase) · `ShowLastLogin`/`LastLoginMinDays`/`LastLoginMaxDays` · `sortColNum` (22 = last login).