function FacebookInstance() {

	function setWideFb() {
		var iFrame = ById('iframe_canvas');
		if (!iFrame) {
			setTimeout(setWideFb, 1000);
			return;
		}
		iFrame.style.width = '100%';

		while ((iFrame = iFrame.parentNode) != null) {
			if (iFrame.tagName == 'DIV') {
				iFrame.style.width = '100%';
				iFrame.style.maxWidth = '100%';
			}
		}
		ById('globalContainer').style.left = '0px';

		var e = ById('mainContainer');
		if (e) {
			e.parentNode.style.minWidth = '100%';
			if (GlobalOptions.btWideScreenStyle == "wide") e.parentNode.style.minWidth = '1520px';
			if (GlobalOptions.btWideScreenStyle == "ultra") e.parentNode.style.minWidth = '1900px';
			for (i = 0; i < e.childNodes.length; i++) {
				if (e.childNodes[i].id == 'contentCol') {
					e.childNodes[i].style.margin = '0px';
					e.childNodes[i].style.paddingTop = '5px';
					break;
				}
			}
		}

		GM_addStyle("._470m { display: none !important;}"); // remove annoying facebook games toolbars and junk
		GM_addStyle("._31e { position: inherit !important;}"); // something that stops scrolling
		GM_addStyle("#rightCol { display: none !important;}");

		try { ById('leftColContainer').parentNode.removeChild(ById('leftColContainer')); } catch (e) { }

		var e = ById('pageHead');
		if (e) {
			e.style.width = '80%';
			e.style.margin = '0 10%';
		}

		var e = ById('bottomContent');
		if (e) {
			e.style.padding = "0px 0px 12px 0px";
		}
	}

	setTimeout(function () {
		var url = document.URL;
		var dom = /s=([0-9]+)/i.exec(url);
		if (dom) uW.window.document.title = "KofC " + dom[1];
	}, 10000)

	if ((document.URL.search(/merlinshare/i) != -1) || (document.URL.search(/accepttoken/i) != -1) || (document.URL.search(/claimvictorytoken/i) != -1)) {
		GlobalOptions.LastTopURL = document.URL;
		saveGlobalOptions();
	}

	FacebookWatchdog();
	setWideFb();
}
