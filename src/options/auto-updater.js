var AutoUpdater = {
	id: 999999,
	homepage: 'https://github.com/prahzera/KoC-PowerBotPlus',
	SourceForgeURL: 'sourceforge.net/p/koc-battle-console/code/HEAD/tree/trunk/KoCPowerBotPlus.user.js',
	GreasyForkURL: 'greasyfork.org/scripts/399012-koc-power-bot-plus/code/KoC%20Power%20Bot%20Plus.user.js',
	MirrorURL: 'github.com/prahzera/KoC-PowerBotPlus/releases/latest/download/script.meta.js',
	LukeURL: '',
	CodeSphereURL: '',
	name: 'KoC Power Bot Plus',
	version: Version,
	secure: true,
	getCheckURL: function () {
		if (GlobalOptions.UpdateLocation == 2 && this.MirrorURL) { return this.MirrorURL; }
		if (GlobalOptions.UpdateLocation == 1 && this.GreasyForkURL) { return this.GreasyForkURL; }
		if (GlobalOptions.UpdateLocation == 0 && this.SourceForgeURL) { return this.SourceForgeURL; }
		return this.GreasyForkURL;
	},

	getDownloadURL: function () {
		if (GlobalOptions.UpdateLocation == 2) { return 'github.com/prahzera/KoC-PowerBotPlus/releases/latest/download/script.user.js'; }
		if (GlobalOptions.UpdateLocation == 0 && this.SourceForgeURL) { return this.SourceForgeURL; }
		return this.GreasyForkURL;
	},

	call: function (secure, response) {
		logit("Checking for " + tx(this.name) + " Update!" + (secure ? ' (SSL)' : ' (plain)'));
		this.secure = secure;
		var CheckURL = this.getCheckURL();
		try {
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'http' + (secure ? 's' : '') + '://' + CheckURL,
				onload: function (xpr) { AutoUpdater.compare(xpr, response); },
				onerror: function (xpr) { if (secure) { AutoUpdater.call(false, response); } else { AutoUpdater.compare({ responseText: "" }, response); } }
			});
		} catch (e) { logerr(e); }
	},

	compareVersion: function (r_version, l_version) {
		var r_parts = String(r_version).split('.'),
			l_parts = String(l_version).split('.');
		for (var i = 0, len = (r_parts.length > l_parts.length ? r_parts.length : l_parts.length); i < len; i++) {
			var r = parseIntNan(r_parts[i]),
				l = parseIntNan(l_parts[i]);
			if (r > l) { return true; }
			if (r < l) { return false; }
		}
		return false;
	},

	compare: function (xpr, response) {
		this.xversion = /\/\/\s*@version\s+(.+)\s*\n/i.exec(xpr.responseText);
		if (this.xversion) this.xversion = this.xversion[1];
		else {
			if (response) {
				uW.Modal.showAlert('<div align="center">' + tx('Unable to check for updates to') + ' ' + tx(this.name) + '.<br>' + tx('Please change the update options or visit the') + '<br><a href="' + this.homepage + '" target="_blank">' + tx('script homepage') + '</a></div>');
			}
			logit("Unable to check for updates :(");
			return;
		}
		this.xrelnotes = /\/\/\s*@releasenotes\s+(.+)\s*\n/i.exec(xpr.responseText);
		if (this.xrelnotes) this.xrelnotes = this.xrelnotes[1];
		var updated = this.compareVersion(this.xversion, this.version);
		if (updated) {
			logit('New Version Available!');
			var body = '<BR><DIV align=center><FONT size=3><B>' + tx('New version') + ' ' + this.xversion + ' ' + tx('is available!') + '</b></font></div><BR>';
			if (this.xrelnotes)
				body += '<BR><div align="center" style="border:0;width:470px;height:120px;max-height:120px;overflow:auto"><b>' + tx('New Features!') + '</b><p>' + this.xrelnotes + '</p></div><BR>';

			var DownloadURL = AutoUpdater.getDownloadURL();

			body += '<BR><DIV align=center><a href="http' + (AutoUpdater.secure ? 's' : '') + '://' + DownloadURL + '" target="_blank" class="gemButtonv2 green" id="doBotUpdate">' + tx('Update') + '</a></div>';
			this.ShowUpdate(body);
		}
		else {
			logit("No updates available :(");
			if (response) {
				uW.Modal.showAlert('<div align="center">' + tx('No updates available for') + ' ' + tx(this.name) + ' ' + tx('at this time.') + '</div>');
			}
		}
	},

	check: function () {
		var now = unixTime();
		var lastCheck = 0;
		if (GM_getValue('updated_' + this.id, 0)) lastCheck = parseInt(GM_getValue('updated_' + this.id, 0));
		if (now > (lastCheck + 60 * 60 * 24)) this.call(true, false);
		GM_setValue('updated_' + AutoUpdater.id, now);
	},

	ShowUpdate: function (body) {
		var ModalBody = uWCreateObjectIn('btModalBody', {});
		ModalBody.title = tx(this.name);
		ModalBody.body = body;
		ModalBody.closeNow = false;
		ModalBody["class"] = "Warning";
		ModalBody.curtain = false;
		ModalBody.width = 500;
		ModalBody.height = 700;
		ModalBody.left = 140;
		ModalBody.top = 140;
		exportFunction(function () { CM.ModalManager.closeAll(); }, ModalBody, { defineAs: 'close' });

		CM.ModalManager.addMedium(ModalBody);
		ById('doBotUpdate').addEventListener('click', this.doUpdate, false);
	},

	doUpdate: function () {
		CM.ModalManager.closeAll();
		CM.ModalManager.close();
	},
};
