var nHtml = {
	FindByXPath: function (obj, xpath, nodetype) {
		if (!nodetype) { nodetype = XPathResult.FIRST_ORDERED_NODE_TYPE; }
		try { var q = document.evaluate(xpath, obj, null, nodetype, null); }
		catch (e) { GM_log('bad xpath:' + xpath); }
		if (nodetype == XPathResult.FIRST_ORDERED_NODE_TYPE) { if (q && q.singleNodeValue) { return q.singleNodeValue; } }
		else { if (q) { return q; } }
		return null;
	},

	ClickWin: function (obj, evtName) {
		var evt = window.document.createEvent("MouseEvents");
		evt.initMouseEvent(evtName, true, true, obj.ownerDocument.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		return !obj.dispatchEvent(evt);
	},

	Click: function (obj) {
		return this.ClickWin(obj, 'click');
	},

	ClickTimeout: function (obj, millisec) {
		window.setTimeout(function () {
			return nHtml.ClickWin(obj, 'click');
		}, millisec + Math.floor(Math.random() * 500));
	},

	SetSelect: function (obj, v) {
		for (var o = 0; o < obj.options.length; o++) {
			if (v == obj.options[o].value) { obj.options[o].selected = true; return true; }
		}
		return false;
	},
}
readGlobalOptions();

GM_addStyle(".yellowBanner {background-color:#fde073;color:#000; text-align: center; line-height: 2.5; overflow: hidden; -webkit-box-shadow: 0 0 5px black; -moz-box-shadow: 0 0 5px black; box-shadow: 0 0 5px black;");
GM_addStyle(".redBanner {background-color:#a00;color:#fff;text-align: center; line-height: 2.5; overflow: hidden; -webkit-box-shadow: 0 0 5px black; -moz-box-shadow: 0 0 5px black; box-shadow: 0 0 5px black;");

if (document.URL.search(/apps.facebook.com\/kingdomsofcamelot/i) >= 0) {
	SetGameScreen();
	HandleInlinePublishPopup();
	LoadChecker(true);
}
else {
	if (document.URL.search(/games\/kingdoms-of-camelot\/play/i) >= 0) {
		SetGameScreen();
		LoadChecker(true);
	}
	else {
		if (document.URL.search(/facebook.com/i) >= 0) {
			if (document.URL.search(/dialog\/feed/i) >= 0) {
				HandlePublishPopup();
			}
		}
		else {
			if (document.URL.search(/rycamelot.com|playgardencitygames\.com/i) >= 0) {
				if (window.self.location != window.parent.location) { // Fix weird bug with koc game?
					if (document.URL.search(/main_src.php/i) != -1) {
						SetGameScreen();
					}
					else {
						CheckTokenCollection();
					}
				}
			}
		}
	}
}

// Detect SPA URL changes (Tampermonkey) — re-trigger initialization when navigating to the game
if (typeof window.onurlchange === 'function') {
	window.onurlchange = function () {
		if (document.URL.search(/kingdomsofcamelot|kingdoms-of-camelot|playgardencitygames\.com/i) >= 0) {
			if (typeof uW !== 'undefined') uW.btLoaded = false;
			if (typeof InitPortalLayout === 'function') InitPortalLayout();
			SetGameScreen();
			LoadChecker(true);
		}
	};
}
