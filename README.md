# KoC Power Bot Plus

> All-in-One automation userscript for **Kingdoms of Camelot** (Facebook / Web)

[![Version](https://img.shields.io/badge/version-3.66-blue)](https://greasyfork.org/scripts/399012)
[![License](https://img.shields.io/badge/license-CC--BY--4.0-green)](https://creativecommons.org/licenses/by/4.0/)
[![GreasyFork](https://img.shields.io/badge/GreasyFork-install-red)](https://greasyfork.org/scripts/399012)

---

## 📖 Description

**KoC Power Bot Plus** is a powerful Tampermonkey/Greasemonkey userscript that automates and enhances the gameplay experience in Kingdoms of Camelot. It provides a comprehensive control panel with dozens of automation features, multi-language support, and a fully configurable interface.

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

### Option 1 — GreasyFork (recommended)

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge/Firefox) or [Greasemonkey](https://www.greasespot.net/) (Firefox)
2. Click the install link:  
   👉 **[Install from GreasyFork](https://greasyfork.org/scripts/399012)**
3. Confirm the installation in Tampermonkey/Greasemonkey
4. Open Kingdoms of Camelot — the bot panel will appear automatically

### Option 2 — Manual installation

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Open the Tampermonkey dashboard → **Create new script**
3. Copy the contents of `script.js` and paste them into the editor
4. Save (`Ctrl+S`) and reload the game

---

## 🌍 Language Packs

The script defaults to **English**. A complete **Spanish** translation is included in this repository.

### How to import a language pack

1. Open the bot panel in-game
2. Go to **Config** → **Language** tab
3. Click **Import Language**
4. Select the `lang_es.json` file (or any other language pack)
5. **Reload the page** — the UI will switch to the imported language

### Available language packs

| File | Language | Keys | Status |
|------|----------|------|--------|
| `lang_en.json` | English | 704 | Template (default) |
| `lang_es.json` | Spanish / Español | 704 | ✅ Complete |

### Creating a new language pack

1. Copy `lang_en.json` as a starting point
2. Change `"CurrLang": "en"` to your language code (e.g. `"fr"`, `"de"`, `"pt"`)
3. Fill in the translations for each key (leave the value empty to fall back to English)
4. Import the file using the in-game Language tab

---

## 📁 Repository Structure

```
├── script.js        # Main userscript (install this)
├── lang_en.json     # English language template (704 keys)
├── lang_es.json     # Spanish translation (704 keys, complete)
└── README.md        # This file
```

---

## 🔄 Changelog

### v3.66
- Full Spanish translation (704 keys)
- Fixed Import Language button (3 bugs resolved)
- Wrapped all hardcoded English UI strings in translation system (`tx()`)
- Improved error handling in language import/export
- **Maintained by:** prahzera

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
