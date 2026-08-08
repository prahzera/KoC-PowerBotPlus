function FacebookWatchdog() {

	function fbwatchdog() {
		if (!ById('app_content_130402594779')) {
			logit("KOC NOT FOUND (FB)!");
			KOCnotFound(30);
		}
	}

	var INTERVAL = 50000; // wait 50 seconds before checking DOM
	if (!GlobalOptions.btWatchdog) return;
	setTimeout(fbwatchdog, INTERVAL);
}

function KOCWatchdog() {

	function kbwatchdog() {
		if (!ById('mod_maparea') == null) {
			logit("KOC NOT FOUND (STANDALONE)!");
			KOCnotFound(30);
		}
	}

	var INTERVAL = 50000; // wait 50 seconds before checking DOM
	if (!GlobalOptions.btWatchdog) return;
	setTimeout(kbwatchdog, INTERVAL);
}

function PBPWatchdog() {

	function botwatchdog() {
		if (!uW.btLoaded) {
			logit("PBP NOT INITIALISED");
			KOCnotFound(20, false, true);
		}
	}

	var INTERVAL = 50000; // wait 50 seconds before checking DOM
	setTimeout(botwatchdog, INTERVAL);
}

function KOCnotFound(secs, bot, inst) {
	var div;
	var countdownTimer = null;
	var endSecs = (new Date().getTime() / 1000) + secs;

	function countdown() {
		var secsLeft = endSecs - (new Date().getTime() / 1000);
		ById('btwdsecs').innerHTML = timestr(secsLeft);
		if (secsLeft < 0) {
			clearTimeout(countdownTimer);
			ReloadKOC();
		}
	}
	function cancel() {
		clearTimeout(countdownTimer);
		document.body.removeChild(div);
	}

	div = document.createElement('div');
	var msg = tx('Power Bot Plus has detected that KofC is not loaded');
	if (bot) msg = tx('Power Bot Plus failed to initialise - You may need to reinstall');
	if (inst) msg = tx('Power Bot Plus failed to fully initialise - Some features may not work as expected');
	msg = '<DIV class=redBanner >' + msg + '. ';
	if (!inst) { msg = msg + tx('Refreshing in') + ' <SPAN id=btwdsecs></span>. <a style="color:#FFFF80;visited:#FFFF80;hover:#FFFF80;cursor:pointer;" id=btwdcan >[' + tx('cancel refresh') + ']</a>'; }
	msg = msg + '</div>';
	div.innerHTML = msg;
	document.body.insertBefore(div, document.body.firstChild);
	if (!inst) {
		ById('btwdcan').addEventListener('click', cancel, false);
		countdownTimer = setInterval(countdown, 1000);
	}
}

function ReloadKOC(timer, params) {
	var serverId = getServerId();
	if (serverId == '??') { window.location.reload(true); return; }

	params = (params ? params : '');
	var goto = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + serverId + params;
	if (CheckStandAlone()) { goto = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + serverId + params; }

	if (timer && GlobalOptions.TokenEnabled && UserOptions.TokenAuto && serverId == UserOptions.TokenDomain) {
		// check for token collection
		if (!UserOptions.TokenCollected && UserOptions.TokenLink != "" && UserOptions.TokenLink.search(/merlinshare/i) != -1 && UserOptions.LastTokenStatus == "") {
			UserOptions.TokenRequest = 'TOKEN';
			saveUserOptions(uW.user_id);
			var goto = UserOptions.TokenLink;
		}
		else {
			// check for build collection
			if (!UserOptions.BuildCollected && UserOptions.BuildLink != "" && UserOptions.BuildLink.search(/accepttoken/i) != -1 && UserOptions.LastBuildStatus == "") {
				UserOptions.TokenRequest = 'BUILD';
				saveUserOptions(uW.user_id);
				var goto = UserOptions.BuildLink;
			}
			else {
				if (!UserOptions.BonusCollected && UserOptions.TreasureChestBankOther.length > 0 && UserOptions.TreasureChestBankOther[0].playerId != uW.tvuid && UserOptions.LastChestStatus == "") {
					Tabs.Options.CreateLink(false, true);
					return;
				}
				else {
					var DomArray = UserOptions.ChestDomainList.split(",");
					var freedomain = false;
					for (var d = 0; d < DomArray.length; d++) {
						if (DomArray[d]) {
							if (!UserOptions.ChestCollected[DomArray[d]] && !UserOptions.BadChestDomains[DomArray[d]]) {
								freedomain = true;
								break;
							}
						}
					}
					if (freedomain) {
						if (UserOptions.TreasureChestBankOther.length > 0) {
							Tabs.Options.CreateLink(false, true);
							return;
						}
						else {
							if (UserOptions.TreasureChestBank.length > 0) {
								Tabs.Options.CreateLink(true, true);
								return;
							}
						}
					}
				}
			}
		}
	}
	setTimeout(function () { window.top.location = goto; }, 0);
}
