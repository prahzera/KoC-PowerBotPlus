/** OPTION OBJECTS **/

var anticd = {
	isInited: false,
	KOCversion: '?',
	init: function () {
		try {
			if (this.isInited)
				return this.KOCversion;

			var nullfunc = function () { return; };
			if (typeof exportFunction == 'function') {
				exportFunction(nullfunc, CM.cheatDetector, { defineAs: "detect" });
			}
			else { CM.cheatDetector.detect = nullfunc; };

			var scripts = document.getElementsByTagName('script');
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].src.indexOf('camelotmain') >= 0) {
					break;
				}
			}
			if (i < scripts.length) {
				var m = scripts[i].src.match(/camelotmain[_]{0,1}[a-z]{0,2}-(.*).js/);
				if (m) this.KOCversion = m[1];
			}
			this.isInited = true;
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	getKOCversion: function () {
		return this.KOCversion;
	},
};

var TreasureChestClick = {
	clickTreasureChest: null,

	init: function () {
		t = TreasureChestClick;

		try {
			uWExportFunction('treasure_chest_post_hook', t.hook);
			t.clickTreasureChest = new CalterUwFunc('pop_treasure_chest_modal', [[/if/im, 'treasure_chest_post_hook(a); return; if']]);
			t.clickTreasureChest.setEnable(UserOptions.TreasureChest);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	setEnable: function (tf) {
		var t = TreasureChestClick;
		t.clickTreasureChest.setEnable(tf);
	},

	isAvailable: function () {
		var t = TreasureChestClick;
		return t.clickTreasureChest.isAvailable();
	},

	hook: function (tid) {
		var mid = tid;
		var city = null;
		var coords = "";
		var tileName = "Barbarian Camp";
		var logTile = "";
		for (var k in Seed.queue_atkp) {
			if (Seed.queue_atkp[k]['m' + mid]) {
				city = k;
				coords = ' (' + Seed.queue_atkp[k]['m' + mid].toXCoord + ',' + Seed.queue_atkp[k]['m' + mid].toYCoord + ')';
				break;
			}
		}
		if (city) {
			try {
				tileName = (Seed.queue_atkp[city]["m" + mid].toTileType == 51) ? "Barbarian Camp" : capitalize(uW.g_mapObject.types[parseInt(Seed.queue_atkp[city]["m" + mid].toTileType)]);
				logTile = ' in ' + tileName + ' Level ' + Seed.queue_atkp[city]["m" + mid].toTileLevel;
				if (tileName == "Boss") { // DF!!
					if (DeleteReports.ReportLog.ItemsFoundDF["T"]) { DeleteReports.ReportLog.ItemsFoundDF["T"] += 1; }
					else { DeleteReports.ReportLog.ItemsFoundDF["T"] = 1; }
				}
				else {
					for (var i in Options.AttackOptions.Routes) {
						var a = Options.AttackOptions.Routes[i];
						if (Seed.queue_atkp[city]['m' + mid].toXCoord == a.target_x && Seed.queue_atkp[city]['m' + mid].toYCoord == a.target_y && Seed.queue_atkp[city]['m' + mid].marchType == 4) {
							if (DeleteReports.ReportLog.ItemsFound["T"]) { DeleteReports.ReportLog.ItemsFound["T"] += 1; }
							else { DeleteReports.ReportLog.ItemsFound["T"] = 1; }
							break;
						}
					}
				}
			}
			catch (e) { };
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.tid = tid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/postFriendVictoryTokenShare.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (UserOptions.BankTreasureChests && UserOptions.TreasureChestBank.length < UserOptions.MaxBankedTreasureChests) {
						var post_link = 'convert.php?pl=1&ty=3&si=118&wccc=fcf-feed-118&ln=31&da=' + yyyymmdd(new Date()) + '&in=' + uW.tvuid + '&ex=s%3A' + getServerId() + '%7Cf%3A' + rslt.feedId + '%7Cm%3A' + rslt.tokenId + '%7Cimg%3Ahttps%3A%2F%2F' + GameURL + '%2Ffb%2Fe2%2Fsrc%2Fimg%2Fbronze_vip.png%7C&page=convert';
						UserOptions.TreasureChestBank.push({ tokenId: rslt.tokenId, feedId: rslt.feedId, serverId: getServerId(), playerId: uW.tvuid, tileName: tileName, unixTime_taken: unixTime(), link: post_link });
						saveUserOptions(uW.user_id);
						actionLog('Chest found' + logTile + coords + ' - Link Stored', 'TREASURE');
					}
					else {
						var reparr = new Array();
						reparr.push(["REPLACE_TiLeNaMe", tileName]);
						reparr.push(["REPLACE_fEeDiD", rslt.feedId]);
						reparr.push(["REPLACE_tOkEnId", rslt.tokenId]);
						uW.common_postToProfile("118", uWCloneInto(reparr));
						actionLog('Chest found' + logTile + coords + ' - Link Posted to FB', 'TREASURE');
					}
				} else {
					actionLog('Chest found' + logTile + coords + ' - Error: ' + rslt.error_code + ',' + rslt.msg + ',' + rslt.feedback, 'TREASURE')
				}
			},
			onFailure: function () {
				actionLog('Chest found' + logTile + coords + ' - AJAX Error', 'TREASURE')
			},
		}, true);
	},
}

var KillBox = {
	kboxtime: 1,
	init: function () {
		var t = KillBox;
		t.kboxtime += 1;
		if (!Options.MagicBox) { return; }
		if (t.kboxtime > 50) { return; }
		if (Number(uW.seed.items.i599) == 0) { return; }
		if (!ById('modal_mmb')) {
			setTimeout(KillBox.init, 100);
		}
		else {
			uW.Modal.hideModal();
		}
	},
}

var FairieKiller = {
	saveFunc: null,
	init: function (tf) {
		try {
			FairieKiller.saveFunc = uW.Modal.showModalUEP;
			FairieKiller.setEnable(tf);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	setEnable: function (tf) {
		if (tf)
			uW.Modal.showModalUEP = eval('function FairieKiller (a,b,c) {actionLog ("Blocked Faire popup");}');
		else
			uW.Modal.showModalUEP = FairieKiller.saveFunc;
	},
}
