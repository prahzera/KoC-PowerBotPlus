---
name: koctabs
description: Catálogo y reglas de arquitectura de los tabs externos (ExtraTabs) y tabs nativos vanilla en KoC PowerBot+. Usar SIEMPRE al agregar, importar, activar, inventariar o documentar tabs, o al tocar GlobalOptions.ExtraTabs / src/tabs/. Incluye la regla de oro: Throne, Champ y Boss son tabs NATIVOS vanilla (compilados), NO se importan por CDN.
---

# KoC Tabs — Catálogo y Reglas

Referencia única de tabs de este proyecto (KOClon "Host Adapter" + PowerBot+).

## Regla de oro (no olvidar nunca)

**Throne, Champ y Boss son tabs NATIVOS vanilla** — viven en `src/tabs/<nombre>/`
como parte del compilado (`node build.js` → `script.js`). **NO** se importan por CDN
ni se referencian en `GlobalOptions.ExtraTabs`. Si alguien te pide "agregar/importar
Champ/Boss/Throne", la respuesta correcta es: portarlos como tab nativo vanilla,
como ya hicimos con Throne. Jamás hagas `enabled:true` en un ExtraTab que tenga
equivalente nativo.

## Mecánica global

- `GlobalOptions.ExtraTabs` (default en `src/options/global-options.js`, seed `ExtraTabs:`)
  es la lista de **13 tabs externos de fábrica**, todos con `enabled:false` salvo que
  indiquen lo contrario. Se cargan por **URL externa** (`EXTERNAL_RESOURCE + "tabs/X.js"`),
  se descargan con `eval(atob(data))` en el arranque (`src/bootstrap/startup.js`:
  `TabLoad` + `TabAutoCheck`), cacheados en `GlobalOptions.ExtraTabs[e].data`,
  con auto-update cada ~3 días si `TabAutoCheck` está activo.
- El usuario agrega tabs externos manualmente desde **Configuración → Tabs Adicionales**
  (URL + Add) — así se importó Throne originalmente, hasta que lo nativizamos.
- Los tabs nativos se registran como `Tabs.X = { ... }` (con `tabLabel`, `tabOrder`,
  `tabColor`, `tabDisabled`, `obj.show()`, etc.) y aparecen solos en la barra al
  compilar; se ocultan/activan en Configuración vía su checkbox.

## Catálogo — 13 tabs externos de fábrica (ExtraTabs)

| # | Nombre interno | Archivo externo       | Nativo? | Qué hace |
|---|----------------|-----------------------|---------|----------|
| 1 | **Throne**     | (nativo)              | ✅ Throne| Resumen del Reino: recursos, Mighty, alianza, torre del rey, aportes, héroe. |
| 2 | **Champ**      | `tabs/Champ.js` (legacy) | ✅ **NATIVO** | Campeones de tus ciudades: asignación de campeón por ciudad, lista de campeones disponibles, mejorar/nivelar. |
| 3 | **Boss**       | `tabs/Boss.js` (legacy)  | ✅ **NATIVO** | Jefes/eventos temporales de KoC (el "Boss" del reino): coordinar golpes al Boss del evento temporal, ranking, tiempos. |
| 4 | BulkAttack    | `tabs/BulkAttack.js` | ❌ externo | Ataques en masa por lista de coordenadas (ráfagas de ataque múltiple). |
| 5 | Defend        | `tabs/Defend.js`     | ❌ externo | Defensa masiva: refuerza ciudades bajo ataque. |
| 6 | Raid          | `tabs/Raid.js`       | ❌ externo | Saqueo/loot de ciudades marcadas (recursos). |
| 7 | GuardWidget   | `tabs/GuardWidget.js`| ❌ externo | Widget de guardia del castillo (alertas de ataque entrante). |
| 8 | Debug         | `tabs/Debug.js`      | ❌ externo | Panel de depuración/eval de la consola del script. |
| 9 | Tournament    | `tabs/Tournament.js` | ❌ externo | Tab del Torneo (evento temporada KoC). |
| 10| Megalith      | `tabs/Megalith.js`   | ❌ externo | Aportes al Megalito (evento alianza). |
| 11| Aport         | `tabs/Aport.js`      | ❌ externo | Aportador de recursos al Megalito/Ciudad de la Alianza. |
| 12| Resources     | `tabs/Resources.js`  | ❌ externo | Panel de recursos por ciudad (tablero económico). |
| 13| Joust         | `tabs/Joust.js`      | ❌ externo | Justas / Torneo de Caballeros (evento). |

## Estado actual

- **Nativos implementados:** Throne, Champ, Boss.
- **Por importar (externos, enabled:false en default):** BulkAttack, Defend, Raid,
  GuardWidget, Debug, Tournament, Megalith, Aport, Resources, Joust (10).
- Procedimiento de fábrica para activar un externo sin cambiar código:
  Configuración → Tabs Adicionales → Add Tab con la URL, o setear
  `"enabled": true` en el seed + bump de versión (el loader hace merge y lo evalúa).

## Reglas de actualización de versión (obligatorias al tocar tabs)

La versión es **una sola fuente de verdad: `package.json` (`version: X.Y.Z`)**.
`build.js` la inyecta en LOS TRES sitios de salida (banner `// @version` de `script.js`,
`script.meta.js` y `var Version = ...` en el arranque, `src/core/version.js`). Por eso:

- **Nunca** corrijas la versión a mano en `script.js` ni en ningún `@version` del fuente:
  el build es el único autor y los sobreescribe en cada compilación.
- Todo cambio de tabs cuenta como:
  - **Feature** (nuevo tab nativo, port de un externo a nativo como Throne, icono/UI nuevo) →
    `npm run version:feature` (sube Y, Z=0).
  - **Arreglo o mejora** (checkbox, icono, texto, bug sin feature nueva) →
    `npm run version:fix` (sube Z).
- Tras bumpear, el script `scripts/bump-version.js` ya regenera `script.js` +
  `script.meta.js` y corre `--check`; igualmente verifica que no quede la versión
  anterior en los outputs (grep del número viejo en `script.js`/`script.meta.js` → 0).
- El mensaje de commit de release DEBE reflejar la versión REAL de `package.json`
  (después del bump), no un número inventado: si agregaste un tab bumpeaste featu­re y
  el nombre de commit DEBE coincidir con la `X.Y.Z` compilada.

## Comandos

- Build: `node build.js` (genera `script.js` + `script.meta.js` desde `src/`).
- Check: `node build.js --check`.
- Version: `npm run version:fix` (patch), `version:feature`, `version:major`.
- Compilar **siempre** tras editar `src/` o lang; el repo solo trackea el fuente.
