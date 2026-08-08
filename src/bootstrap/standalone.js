function CheckStandAlone(CheckString) {
	if (!CheckString) { CheckString = document.URL; }
	var Standalone = (CheckString.search(/games\/kingdoms-of-camelot\/play/i) >= 0 || CheckString.match(/standalone=1/i) || CheckString.search(/playgardencitygames\.com\/kingdomsofcamelot/i) >= 0);
	return Standalone;
}

function StandAloneInstance() {

	function setWideKb() {
		var iFrames = $('game_frame');
		if (!iFrames) {
			setTimeout(setWideKb, 1000);
			return;
		}

		iFrames.style.width = '100%';
		iFrames.style.height = '3000px';
		if (GlobalOptions.btWideScreenStyle == "wide") iFrames.style.width = '1520px';
		if (GlobalOptions.btWideScreenStyle == "ultra") iFrames.style.width = '1900px';
		while ((iFrames = iFrames.parentNode) != null && iFrames.tagName !== "BODY") {
			iFrames.style.width = '100%';
			if (GlobalOptions.btWideScreenStyle == "wide") iFrames.style.width = '1520px';
			if (GlobalOptions.btWideScreenStyle == "ultra") iFrames.style.width = '1900px';
		}
		try { ById('promo-sidebar').parentNode.removeChild(ById('promo-sidebar')); } catch (e) { }
	}

	function sendmeaway() {
		var serverID = /s=([0-9]+)/im.exec(document.location.href);
		var sr = /value="(.*?)"/im.exec($("post_form").innerHTML);
		var goto = $("post_form").action + (serverID ? "s=" + serverID[1] : '');
		goto += '&platform_req=A&signed_request=' + sr[1];
		setTimeout(function () { window.top.location = goto; }, 0);
	}

	if ((document.URL.search(/merlinshare/i) != -1) || (document.URL.search(/accepttoken/i) != -1) || (document.URL.search(/claimvictorytoken/i) != -1)) {
		GlobalOptions.LastTopURL = document.URL;
		saveGlobalOptions();
	}

	if (GlobalOptions.btNoMoreRy) {
		sendmeaway();
	}
	else {
		setTimeout(function () {
			var url = document.URL;
			var dom = /s=([0-9]+)/i.exec(url);
			if (dom) uW.window.document.title = "KofC " + dom[1];
		}, 10000)

		setWideKb();
	}
}
