/** Standard Functions **/

function translate(str) {
	if (LanguageArray[str]) { str = LanguageArray[str]; }
	else { NoTranslation[str] = ""; }
	return str;
}

function tx(str) { return translate(str); }

// Igual que tx() pero con placeholders {0}, {1}... (para frases con numeros,
// donde el orden de palabras cambia entre idiomas)
function txArgs(str, args) {
	var out = translate(str);
	if (!args) { return out; }
	return out.replace(/\{(\d+)\}/g, function (m, i) {
		var v = args[parseInt(i, 10)];
		return (v == null) ? '' : String(v);
	});
}
