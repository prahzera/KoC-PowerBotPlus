# Backlog (no prioritario)

## Features
- [ ] Tab **Scout Reports** — detección casi-instantánea de reportes nuevos.
  - Trigger al aterrizar una marcha de exploración propia (`Seed.queue_atkp` con `marchType == 3` cruzando `destinationUnixTime`).
  - Trigger cuando suba `Seed.newReportCount`.
  - Bajar `scandelay` 30→5 s como respaldo (scouts entrantes).
  - Al implementar → `npm run version:feature` → v4.27.0 + `// @releasenotes` en inglés.

## Correcciones
- Fix Firefox (bloqueo X-Frame-Options de `apps.facebook.com`): que la recarga normal del bot use un reload de página en su sitio en vez de `window.top.location = goto` (`src/bootstrap/watchdogs.js` → `ReloadKOC`). Al implementar → `npm run version:fix` → v4.29.2 + releasenotes en inglés.
- Revisar regresión del parámetro `&lang=` al recargar tras cambio de idioma (persistencia por ajax `changeLanguage.php`).

## Publicación
- [ ] Push a `origin/main` de los commits locales pendientes (v4.29.0 y v4.29.1).

## Infra / tooling
- Revisar compatibilidad con otros gestores de usuarioscripts (Greasemonkey no compatible; solo Tampermonkey/Violentmonkey).