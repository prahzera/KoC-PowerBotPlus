# KoC Power Bot Plus

> All-in-One automation userscript for **Kingdoms of Camelot** (Facebook / Web)

[![Version](https://img.shields.io/badge/version-3.73-blue)](https://github.com/prahzera/KoC-PowerBotPlus/releases/latest)
[![License](https://img.shields.io/badge/license-CC--BY--4.0-green)](https://creativecommons.org/licenses/by/4.0/)
[![Install](https://img.shields.io/badge/Install-Tampermonkey-brightgreen)](https://github.com/prahzera/KoC-PowerBotPlus/releases/latest/download/script.user.js)

---


## 📖 Description

**KoC Power Bot Plus** is a powerful Tampermonkey userscript that automates and enhances the gameplay experience in Kingdoms of Camelot. It provides a comprehensive control panel with dozens of automation features, multi-language support, and a fully configurable interface.

- **Original author:** barbarossa69  
- **Current maintainer:** prahzera  
- **License:** [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)

---

## ✨ Features

- 🏰 **Building automation** — auto-queue constructions and upgrades
- ⚔️ **Attack automation** — configure and schedule attacks
- 🌾 **Resource transport** — automated resource gathering and transport
- 🎓 **Training automation** — auto-train troops across all cities
- 🔬 **Research automation** — queue and manage research
- 🗺️ **Multi-city support** — manage all your cities from a single panel
- 🌍 **Multi-language UI** — English (default) + Spanish included; import any language pack
- 📊 **Statistics & reports** — track resources, troops, and activity
- ⚙️ **Fully configurable** — extensive settings panel for every feature
- 💾 **Import/Export** — save and restore all settings and language packs

---

## 🚀 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Chrome / Edge / Firefox)
2. Click the button below to install the script directly from the latest release:

[![Install Script](https://img.shields.io/badge/⬇️%20Install%20Script-latest%20release-brightgreen?style=for-the-badge)](https://github.com/prahzera/KoC-PowerBotPlus/releases/latest/download/script.user.js)

3. Confirm the installation in Tampermonkey
4. Open Kingdoms of Camelot — the bot panel will appear automatically

---

## 🌍 Language Packs

The script defaults to **English**. A complete **Spanish** translation is included and loaded automatically from the latest release.

Language packs are fetched directly from GitHub releases when you change the language in-game — no manual file import needed.

### How to switch language

1. Open the bot panel in-game
2. Go to **Config** → **Language** tab
3. Select your language from the dropdown and click **Change**
4. The page will reload with the new language applied

### Available language packs

| File | Language | Status |
|------|----------|--------|
| `lang_en.json` | English | Template (default) |
| `lang_es.json` | Spanish / Español | ✅ Complete |

### Creating a new language pack

1. Copy `lang_en.json` as a starting point
2. Change `"CurrLang": "en"` to your language code (e.g. `"fr"`, `"de"`, `"pt"`)
3. Fill in the translations for each key (leave the value empty to fall back to English)
4. Import the file using the in-game Language tab

---

## 📁 Repository Structure

```
├── src/                      # Source code, split by feature (edit here)
│   ├── meta/                 # Userscript metadata banner
│   ├── core/                 # Globals: version, runtime, state, effects,
│   │                         #   champion maps/items, world, images, constants
│   ├── options/              # Settings model, defaults, auto-updater
│   ├── bootstrap/            # Startup, window positions, seed, screens,
│   │                         #   instances, standalone, watchdogs
│   ├── auth/                 # Facebook dialogs, tokens, publish, widescreen, AFK
│   ├── ui/                   # Buttons, tabs setup, windows, march/champion
│   │                         #   display, main loop, incoming
│   ├── utils/                # i18n, dom, offsets, browser, ajax, audio,
│   │                         #   window manager, popups, scripting, logging…
│   ├── game-api/             # Chat, players, links, online, map, wilds,
│   │                         #   reports, hq, city picker, buildings…
│   ├── game-data/            # Wall, production, throne, training, troops,
│   │                         #   messages, levels, champions, throne room
│   ├── features/             # Standalone features:
│   │   ├── raid-manager/     #   Raid Manager + dashboard
│   │   ├── might-popup/      #   Might Breakdown popup
│   │   ├── battle-popup/     #   Battle popup
│   │   ├── incoming-popup/   #   Incoming popup
│   │   ├── outgoing-popup/   #   Outgoing popup
│   │   ├── quick-scout/      #   Quick Scout
│   │   ├── quick-march/      #   Quick March
│   │   └── option-objects/   #   Option objects (anticd, kill box, fairie killer)
│   ├── panels/               # Chat overlay, reports, map fixes, clock,
│   │                         #   delete reports, report links
│   ├── tabs/                 # One folder per tab (options, log, alliance,
│   │                         #   monitor, reference, player, overview, search,
│   │                         #   gloryfarm, notes, whisper, messages, wilds,
│   │                         #   knights, nomad, inventory, scout-reports,
│   │                         #   bulk-scout, gift, fort, training, crafting,
│   │                         #   spells, transport, reassign, attack, build,
│   │                         #   revive) + shared/ (navigation, fixes, march)
│   └── footer/               # Final init block
├── scripts/manifest.js # Defines the CONCATENATION ORDER of src/ files
│                       #   (footer/init.js always last). New files in src/
│                       #   are registered automatically by the build
├── build.js            # Compiler: src/ -> script.js + script.meta.js
├── package.json        # Build scripts + centralized version
├── script.js           # Compiled userscript (generated by build, committed)
├── script.user.js      # Installable userscript (generated on release)
├── script.meta.js      # Script metadata (generated by build / release)
├── lang_en.json        # English language template
├── lang_es.json        # Spanish translation (complete)
└── README.md           # This file
```

> ⚠️ **Edit `src/`, never `script.js` directly.** `script.js` is the compiled
> output: `node build.js` regenerates it from `src/`.
> The compiled script is still committed so the release workflow, install
> links and Tampermonkey auto-updates keep working unchanged.

### How the build works

**`src/` is the source of truth.** The build concatenates its files in the
order declared in `scripts/manifest.js` (top to bottom) and writes
`script.js` + `script.meta.js`. `footer/init.js` is always last because it
contains the startup block.

- **New files** added to `src/` are registered automatically by
  `npm run build` (inserted just before `footer/init.js`) — no manual
  manifest edits needed.
- **Reordering code** = moving the file's entry in `scripts/manifest.js`.
- **Moving / renaming a file** = move it in `src/` and update its path in
  the manifest (the build fails with a clear message if a declared file is
  missing).
- **`npm run build:check`** is the CI sync check: it aborts (exit 1) if the
  compiled output differs from the committed `script.js` or if `src/` has
  unregistered files.

You can safely delete the committed `script.js` and regenerate it anytime:
`npm run build` recreates it byte-identically from `src/`.

## 🛠️ Development

Requires **Node.js 16+** (no npm dependencies needed).

```bash
npm run build         # compile src/ -> script.js + script.meta.js
                      # (also auto-registers new files in scripts/manifest.js)
npm run build:check   # verify the output is byte-identical to script.js, abort if not
npm run watch         # rebuild automatically on every src/ change
```

The **version** is centralized in `package.json` (`"version"`) and injected
into the banner (`// @version`) and `var Version` during the build — bump it
in one place only.

---

## 🔄 Changelog

### v3.73
- Install button now points to `script.user.js` so Tampermonkey detects and shows the install dialog (instead of just downloading the file)

### v3.72
- Target Finder now excludes the player's own cities from results
- Fixed Target Finder getting stuck on "Checking..." when a status request never responds

### v3.71
- Language packs now loaded directly from GitHub releases (no CDN dependency)
- Hidden the game's built-in "Extra Tools" button (replaced by Power Bot Plus panel)

### v3.65
- Previous release by barbarossa69

---

## 🤝 Contributing

Contributions are welcome!

- **Bug reports:** Open an issue describing the problem and steps to reproduce
- **Translations:** Create a new `lang_XX.json` based on `lang_en.json` and submit a PR
- **Features:** Fork the repo, implement your feature, and open a pull request

---

## ⚠️ Disclaimer

This script is a third-party tool and is **not affiliated with or endorsed by** the developers of Kingdoms of Camelot. Use at your own risk. Automation tools may violate the game's Terms of Service.

---

## 📄 License

This project is licensed under the **Creative Commons Attribution 4.0 International (CC-BY-4.0)** license.  
You are free to share and adapt the material as long as you give appropriate credit.

See [LICENSE](https://creativecommons.org/licenses/by/4.0/) for details.

---

*Original script by [barbarossa69](https://greasyfork.org/scripts/399012) · Maintained by prahzera*
