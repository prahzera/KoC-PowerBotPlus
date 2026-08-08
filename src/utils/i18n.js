/** Standard Functions **/

function translate(str) {
	if (LanguageArray[str]) { str = LanguageArray[str]; }
	else { NoTranslation[str] = ""; }
	return str;
}

function tx(str) { return translate(str); }