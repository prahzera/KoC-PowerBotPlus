# Documentación de la API Interna de Kingdoms of Camelot

Este documento detalla las funciones y objetos expuestos por el juego que el bot utiliza para interactuar con la interfaz y los datos.

## 1. Acceso al DOM y UI
- `ById(id)`: Función global (definida en `src/utils/dom.js`) para obtener elementos del DOM por su ID.
- `#kocContainer`: Contenedor principal del juego.
- `#kocIframes1`: Iframe principal donde se renderiza el juego.

## 2. Gestión de Opciones
- `GlobalOptions`: Objeto global que almacena la configuración del bot.
- `readGlobalOptions()` / `saveGlobalOptions()`: Funciones en `src/utils/options-io.js` para persistir la configuración en `GM_storage`.
- `togGlobalOpt(checkboxId, optionName, callOnChange)`: Vincula un checkbox a una opción global.
- `changeGlobalOpt(valueId, optionName, callOnChange)`: Vincula un input (color, texto, etc.) a una opción global.

## 3. Funciones de Bootstrap y Pantalla
- `SetGameScreen()`: Inicializa el entorno del juego, ajusta el tamaño del iframe y limpia elementos innecesarios (progressBar, crossPromoBar).
- `ApplyKocBgColor(color)`: Aplica un color de fondo personalizado al contenedor del juego. Utiliza un `MutationObserver` para asegurar la persistencia del estilo.

## 4. Utilidades (src/utils/)
- `tx(str)`: Función de internacionalización. Busca la traducción en `LanguageArray` (cargado desde `lang_es.json` o `lang_en.json`).
- `ajax.js`: Manejo de peticiones asíncronas al servidor del juego.
- `dom.js`: Helpers para manipulación del DOM.
- `format.js`: Formateo de números y fechas.

## 5. Estado del Juego
- `RuntimeState`: Objeto que mantiene el estado actual de la sesión (recursos, tropas, edificios).
- `uW`: Referencia a `unsafeWindow` para acceder a variables globales del juego.

---
*Nota: Esta documentación se irá actualizando a medida que descubramos más funciones de la API interna.*
