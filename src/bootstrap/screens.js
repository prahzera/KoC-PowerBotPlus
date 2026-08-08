/** Widescreen/Environment Functions **/

function LoadChecker(init) {
	if (!GlobalOptions.btWatchdog) return;
	var Sresult = getServerId();
	if (init) {
		if (Sresult == '??') {
			GM_setValue('Loaded', 0);
			setTimeout(LoadCheckLoop, 5000, 'Loaded');
		} else {
			GM_setValue(Sresult + 'Loaded', 0);
			setTimeout(LoadCheckLoop, 5000, Sresult + 'Loaded');
		};

		// check firefox and GM version, if dodgy, display a message bar

		ValidCombo = true;
		if (GMVersion.Handler == 'Greasemonkey' && parseIntNan(GMVersion.Version) > 1 && parseIntNan(FFVersion.Version) > 31 && parseIntNan(FFVersion.Version) < 38) { ValidCombo = false; }
		if (!ValidCombo) {
			div = document.createElement('div');
			var msg = tx('Power Bot Plus has detected you are running') + ' ' + GMVersion.Handler + ' ' + tx('version') + ' : ' + GMVersion.Version + ' ' + tx('and') + ' ' + FFVersion.Browser + ' ' + tx('version') + ' : ' + FFVersion.Version + '. ' + tx('Some features may not work correctly') + '. <a onClick="this.parentNode.parentNode.style.display=\'none\';">[' + tx('Close') + ']</a>';
			div.innerHTML = '<DIV class=yellowBanner>' + msg + '</div>';
			document.body.insertBefore(div, document.body.firstChild);
		}
	} else {
		GM_setValue('Loaded', 1);
		GM_setValue(Sresult + 'Loaded', 1);
	}
}

function LoadCheckLoop(checkvalue) {
	if (GM_getValue(checkvalue) == 0) {
		LoadCheckCounter = LoadCheckCounter - 1;
		if (LoadCheckCounter <= 0) { KOCnotFound(20, true); }
		else { setTimeout(LoadCheckLoop, 5000, checkvalue); }
	}
}

function SetGameScreen() {

	function setGame() {
		try { var kocFrame = parent.document.getElementById('kocIframes1'); } catch (err) { };
		if (!kocFrame) {
			setTimeout(setGame, 1000);
			return;
		}

		kocFrame.style.width = '100%';
		kocFrame.style.height = '3000px';
		if (GlobalOptions.btWideScreenStyle == "wide") kocFrame.style.width = '1520px';
		if (GlobalOptions.btWideScreenStyle == "ultra") kocFrame.style.width = '1900px';
		var style = document.createElement('style');
		style.innerHTML = 'body {margin:0; width:100%; !important;}';
		kocFrame.parentNode.appendChild(style);

		try { ById('progressBar').parentNode.removeChild(ById('progressBar')); } catch (e) { }
		try { ById('crossPromoBarContainer').parentNode.removeChild(ById('crossPromoBarContainer')); } catch (e) { }

		ApplyKocBgColor();
	}

	setTimeout(function () {
		var url = document.URL;
		var dom = /s=([0-9]+)/i.exec(url);
		if (dom) uW.window.document.title = "KofC " + dom[1];
	}, 10000)

	KOCWatchdog();
	setGame();
}

/** Aplica el color de fondo configurado al contenedor del juego (#kocContainer).
 *  Usa una regla CSS con !important para que sobreviva a los estilos del juego,
 *  y actualiza el estilo en vivo si el div ya existe. */
function ApplyKocBgColor(color) {
	if (!color) color = GlobalOptions.btKocBgColor || '#ffffff';
	var el = ById('kocContainer');
	if (el) el.style.backgroundColor = color;
	if (!ApplyKocBgColor._style) {
		ApplyKocBgColor._style = document.createElement('style');
		(document.head || document.documentElement).appendChild(ApplyKocBgColor._style);
	}
	ApplyKocBgColor._style.innerHTML = '#kocContainer { background-color: ' + color + ' !important; }';
}
