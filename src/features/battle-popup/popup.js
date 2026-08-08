/** Battle Popup **/

var Battle = {
	userobj: {},
	ReqSent: {},
	dat: [],
	playerpos: { x: -999, y: -999 },
	SearchUID: false,
	init: function () {
		var t = Battle;

		uWExportFunction('ptBatClickSort', Battle.ClickSort);

		DefaultWindowPos('btBatPos', 'main_engagement_tabs');
		if (GlobalOptions.BattleToggle) {
			AddPowerBarLink(tx('Battle'), 'PBPBatButton', Battle.ToggleBattle, function (me) { ResetWindowPos(me, 'main_engagement_tabs', popBat); });
		}
	},

	ToggleBattle: function () {
		var t = Battle;
		if (popBat) {
			popBat.toggleHide(popBat)
		}
		else {
			var initvalue = Options.MonitorOptions.LastMonitored;
			if (t.SearchUID) {
				initvalue = Options.MonitorOptions.LastMonitoredUID;
				if (initvalue == 0) { initvalue = ""; }
			}

			m = '<br>';
			m += '<div align="center">' + tx('Enemy') + ':&nbsp;<INPUT id=btBatPlayer size=20 type=text value="' + initvalue + '"/>&nbsp;' + tx('Search UID') + '<INPUT id=btBatUID type=checkbox ' + (t.SearchUID ? 'CHECKED' : '') + ' /></div>';
			m += '<div class="ErrText" align="center" id=btBatPlayErr>&nbsp;</div><div align="center">';
			if (!uW.isNewServer()) { m += '<a id=btBatMonitor class="inlineButton btButton blue20"><span>' + tx('Monitor') + '</span></a>&nbsp;'; }
			m += '<a id=btBatDetails class="inlineButton btButton blue20"><span>' + tx('Details') + '</span></a>&nbsp;';
			if (!uW.isNewServer()) { m += '<a id=btBatChamp class="inlineButton btButton blue20"><span>' + tx('Champions') + '</span></a><br>&nbsp;</div>'; }

			popBat = new CPopup('btBattle', Options.btBatPos.x, Options.btBatPos.y, 420, 100, true, Battle.close);
			popBat.getMainDiv().innerHTML = m;
			popBat.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('Battle') + '</B></DIV>';

			ById('btBatUID').addEventListener('change', function () {
				t.SearchUID = (ById('btBatUID').checked);
			});

			if (!uW.isNewServer()) {
				ById('btBatMonitor').addEventListener('click', function () { t.BattleClick(1); }, false);
				ById('btBatChamp').addEventListener('click', function () { t.BattleClick(2); }, false);
			}
			ById('btBatDetails').addEventListener('click', function () { t.BattleClick(3); }, false);

			popBat.show(true);
			ResetFrameSize('btBattle', 100, 420);
		}
	},

	close: function () {
		Options.btBatPos = popBat.getLocation();
		saveOptions();
		popBat = null;
	},

	setError: function (msg) {
		ById('btBatPlayErr').innerHTML = msg;
	},

	BattleClick: function (funtype) {
		var t = Battle;
		t.setError('&nbsp;');

		var name = ById('btBatPlayer').value;
		name = name.replace(/\'/g, "_").replace(/\,/g, "_").replace(/\-/g, "_");

		if (name.toUpperCase() == Seed.player.name.toUpperCase()) {
			if (funtype == 1) {
				Tabs.Monitor.initMonitor(uW.tvuid, false)
			}
			if (funtype == 2) {
				Tabs.Player.ViewChamps(uW.tvuid, Seed.player.name, popBat.getMainDiv())
			}
			if (funtype == 3) {
				t.fetchPlayerInfo(uW.tvuid, t.clickedPlayerDetails);
			}
			return;
		}

		if (t.SearchUID) {
			if (funtype == 1) {
				Tabs.Monitor.initMonitor(name, false);
			}
			if (funtype == 2) {
				t.getPlayerName(name, Tabs.Player.ViewChamps, popBat.getMainDiv());
			}
			if (funtype == 3) {
				t.fetchPlayerInfo(name, t.clickedPlayerDetails);
			}
			return;
		}

		if (getMyAlliance()[0] == 0) {
			t.setError(uW.g_js_strings.membersInfo.youmustbelong);
			return;
		}

		if (name.length < 3) {
			setError(uW.g_js_strings.getAllianceSearchResults.entryatleast3);
			return;
		}

		// Get User details.. need to use alliance search to get UserID from name

		if (funtype == 1) {
			fetchPlayerList(name, t.eventMatchNameMonitor);
		}
		if (funtype == 2) {
			fetchPlayerList(name, t.eventMatchNameChamp);
		}
		if (funtype == 3) {
			fetchPlayerList(name, t.eventMatchNameDetails);
		}
	},

	eventMatchNameMonitor: function (rslt) {
		var t = Battle;
		if (!rslt.ok) { t.setError(rslt.msg); return; }

		var matchname = ById('btBatPlayer').value;
		var uid = "";

		for (var k in rslt.matchedUsers) {
			if (rslt.matchedUsers[k].name.toUpperCase() == matchname.toUpperCase()) { uid = rslt.matchedUsers[k].userId; }
		}

		if (uid == "") {
			t.setError(tx('User not found') + '!');
			return;
		}

		Tabs.Monitor.initMonitor(uid, false);
	},

	eventMatchNameChamp: function (rslt) {
		var t = Battle;
		if (!rslt.ok) { t.setError(rslt.msg); return; }

		var matchname = ById('btBatPlayer').value;
		var uid = "";
		var name = "";

		for (var k in rslt.matchedUsers) {
			if (rslt.matchedUsers[k].name.toUpperCase() == matchname.toUpperCase()) {
				uid = rslt.matchedUsers[k].userId;
				name = rslt.matchedUsers[k].name;
			}
		}

		if (uid == "") {
			t.setError(tx('User not found') + '!');
			return;
		}

		Tabs.Player.ViewChamps(uid, name, popBat.getMainDiv());
	},

	eventMatchNameDetails: function (rslt) {
		var t = Battle;
		if (!rslt.ok) { t.setError(rslt.msg); return; }

		var matchname = ById('btBatPlayer').value;
		var uid = "";

		for (var k in rslt.matchedUsers) {
			if (rslt.matchedUsers[k].name.toUpperCase() == matchname.toUpperCase()) { uid = rslt.matchedUsers[k].userId; }
		}

		if (uid == "") {
			t.setError(tx('User not found') + '!');
			return;
		}

		t.fetchPlayerInfo(uid, t.clickedPlayerDetails);
	},

	getPlayerName: function (uid, notify) {
		var t = Battle;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rsltInfo) {
				if (!rsltInfo.ok) {
					t.setError('Unknown UID');
					return;
				}
				notify(uid, rsltInfo.userInfo[0].name);
			},
			onFailure: function () {
				t.setError(tx('AJAX error (server not responding)'));
			},
		}, true);
	},

	fetchPlayerInfo: function (uid, notify) {
		var t = Battle;

		if (t.popPlayer) {
			t.popPlayer.show(false);
			if (t.popPlayer.onClose) t.popPlayer.onClose();
			t.popPlayer.destroy();
			t.popPlayer = null;
		}
		t.popPlayer = new CPopup('btPlayerPop', t.playerpos.x, t.playerpos.y, 500, 100, true, function () { t.playerpos = t.popPlayer.getLocation(); clearTimeout(1000); });
		if ((t.playerpos.x == -999) && (t.playerpos.y == -999)) {
			if (popBat) { t.popPlayer.centerMe(popBat.getMainDiv()); }
			else { t.popPlayer.centerMe(mainPop.getMainDiv()); }
		}
		t.popPlayer.getMainDiv().innerHTML = '<div align=center>' + tx('Loading') + '...</div>';
		t.popPlayer.getTopDiv().innerHTML = '<DIV style="white-space:nowrap;" align=center>&nbsp;&nbsp;<B>' + tx('Player Details') + '</B>&nbsp;&nbsp;</DIV>';
		t.popPlayer.show(true);
		ResetFrameSize('btPlayerPop', 100, 500);

		var uList = [];
		uList.push(uid);
		getOnline(uList, function (r) {
			if (!r.ok) { t.setError(rslt.errorMsg); return; }
			else { notify(uid, r.data[uid]); }
		});
	},

	clickedPlayerDetails: function (uid, online) {
		var t = Battle;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					t.userobj = {};
					t.userobj[uid] = rslt.userInfo[0];
					t.userobj[uid].might = Math.round(t.userobj[uid].might);
					t.userobj[uid].online = (online ? true : false);

					fetchPlayerCourt(uid, function (rslt2) {
						if (rslt2.ok) {
							u = unixTime();
							f = convertTime(new Date(rslt2.playerInfo.fogExpireTimestamp.replace(" ", "T") + "Z"));
							t.userobj[uid].misted = (f >= u);
							t.userobj[uid].fogExpireTimestamp = rslt2.playerInfo.fogExpireTimestamp;
							t.userobj[uid].warStatus = rslt2.playerInfo.warStatus;
							t.userobj[uid].truceExpireTimestamp = rslt2.playerInfo.truceExpireTimestamp;
							t.userobj[uid].cityCount = rslt2.playerInfo.cityCount;
							t.userobj[uid].mightClassic = rslt2.playerInfo.mightClassic;
							t.userobj[uid].mightGlory = rslt2.playerInfo.mightGlory;
							t.userobj[uid].fbuid = parseInt(rslt2.playerInfo.fbuid);
							t.userobj[uid].lastLogin = rslt2.playerInfo.lastLogin;

							t.fetchPlayerLeaderboard(uid, function (r) { t.gotPlayerLeaderboard(r, uid) });
						}
						else {
							t.setError(uW.g_js_strings.barbarian.erroroccured);
						}
					});
				}
				else {
					t.setError(uW.g_js_strings.barbarian.erroroccured);
				}
			},
			onFailure: function () { t.setError(uW.g_js_strings.errorcode.err_602); },
		});
	},

	fetchPlayerLeaderboard: function (uid, notify) {
		var t = Battle;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.userId = uid;
		params.type = "might";
		params.page = 1;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserLeaderboard.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { notify(rslt); },
			onFailure: function () { notify({ errorMsg: tx('AJAX error') }); },
		});
	},

	gotPlayerLeaderboard: function (rslt, uid) {
		var t = Battle;
		if (!rslt.ok) { t.setError(rslt.errorMsg); return; }

		t.dat = [];
		var prestige = "";
		var aid = getMyAlliance()[0];
		if (rslt.totalResults == 0) {
			t.displayPlayer(uid, false);
			return;
		}

		var p = rslt.results[0];
		for (var c = 0; c < p.cities.length; c++) {
			var pt = p.cities[c].prestigeType;
			var prestige = getFactionName(pt);
			if (prestige == "") { prestigelvl = ""; }
			else { prestigelvl = " (" + p.cities[c].prestigeLevel + ")"; }
			ExpTime = convertTime(new Date(p.cities[c].prestigeBuffExpire.replace(" ", "T") + "Z"));
			if ((ExpTime + (3600 * 24) < unixTime()) || isNaN(ExpTime)) {
				prestigeexp = "";
			} else {
				prestigeexp = Tabs.Player.getDuration(p.cities[c].prestigeBuffExpire);
			}
			t.dat.push([p.displayName, parseInt(p.might), p.officerType, parseInt(p.numCities), parseInt(p.cities[c].tileLevel),
			parseInt(p.cities[c].xCoord), parseInt(p.cities[c].yCoord), p.cities[c].cityName, 0, t.userobj[uid].online, '--',
			p.cities[c].cityId, prestige, p.userId, prestigelvl, prestigeexp, p.cities[c].prestigeBuffExpire, prestige + prestigelvl, p.cities[c].blessing, false]);
		}
		t.displayPlayer(uid, true);
	},

	displayPlayer: function (uid, locations) {
		var t = Battle;

		var u = t.userobj[uid];
		var n = '<div>';
		n += '<div style="width:500px;padding:5px;"><table style="padding-right:0px;" class=xtab cellspacing=0 width=100%>';
		if (u.allianceId && u.allianceId != 0) {
			n += '<tr><td>' + uW.g_js_strings.commonstr.alliance + ':&nbsp;</td><td colspan=2><b>' + u.allianceName + FormatDiplomacy(u.allianceId) + '</b></td></tr>';
		}
		else {
			n += '<tr><td>' + uW.g_js_strings.commonstr.alliance + ':&nbsp;</td><td colspan=2><b>' + uW.g_js_strings.commonstr.none + '!</b></td></tr>';
		}

		if (!u.online) {
			n += ' <tr><TD>' + uW.g_js_strings.modal_messages_viewreports_view.lastlogin + ':&nbsp;</td><TD colspan=2><b>' + Tabs.Player.getLastLogDuration(u.lastLogin) + '</b></td></tr>';
		}
		else {
			n += ' <tr><TD>' + tx('Last login') + ':&nbsp;</td><TD colspan=2><b><span style="color:#800">' + tx('ONLINE') + '</span></b></td></tr>';
		}
		if (u.misted)
			n += '<tr><TD>' + tx('Misted') + ':&nbsp;</td><TD colspan=2><b>' + Tabs.Monitor.getDuration(u.fogExpireTimestamp) + '</b></td></tr>';
		n += '<tr><TD>' + uW.g_js_strings.commonstr.status + ':&nbsp;</td><TD colspan=2><b>' + Tabs.Monitor.GetStatusText(u.warStatus, u.truceExpireTimestamp) + '</b></td></tr>';
		n += '<tr><TD>' + uW.g_js_strings.commonstr.might + ':&nbsp;</td><TD colspan=2><b>' + addCommas(Math.round(u.might)) + '</b></td></tr>';
		n += '<tr><TD>' + tx('Classic Might') + ':&nbsp;</td><TD colspan=2><b>' + addCommas(Math.round(u.mightClassic)) + '</b></td></tr>';
		if (Options.ShowGloryMight) {
			n += '<tr><TD>' + tx('Glory Might') + ':&nbsp;</td><TD colspan=2><b>' + addCommas(Math.round(u.mightGlory)) + '</b></td></tr>';
		}
		n += '<TR><TD>' + uW.g_js_strings.commonstr.glory + ':&nbsp;</td><TD width=50><b><DIV id=ptBatPaintGlory></div></b></td><td valign=middle rowspan=3 id=ptBatGloryIcon>&nbsp;</td></tr>';
		n += '<TR><TD>' + tx('Maximum Glory') + ':&nbsp;</td><TD><b><DIV id=ptBatPaintMaxGlory></div></b></td></tr>';
		n += '<TR><TD>' + tx('Lifetime Glory') + ':&nbsp;</td><TD><b><DIV id=ptBatPaintLifetimeGlory></div></b></td></tr>';

		var pids = u.provinceIds.split(',');
		var p = [];
		for (var i = 0; i < pids.length; i++) {
			p.push(uW.provincenames['p' + pids[i]]);
		}
		n += '<tr><td>' + tx('Provinces') + ':&nbsp;</td><td colspan=2><div class="wrap" style="width:350px;">' + p.join(', ') + '</div></td></tr>';
		// create notes link
		var notes = "";
		if (Tabs.Notes && Tabs.Notes.noteValues[uid]) {
			notes = Tabs.Notes.noteValues[uid];
			notes = notes.text;
		}

		if (notes != "") {
			n += '<TR><TD class=xtab valign=top>' + tx('Player Notes') + ':</td><TD colspan=2 id=ptBatplayernotes class=xtabBRTop><div class="wrap" style="width:350px;">' + notes + '</div></td></tr>';
		}
		n += '</table></div>';

		n += '<div id=BatCitySelect style="display:none;padding:5px;"><hr>';
		n += '<table class=xtab width=100%>';
		n += '<TR><TD>';
		if (Tabs.BulkScout) n += strButton20(tx('Add to Scout List'), 'id=BatScoutExport') + '&nbsp;';
		if (Tabs.BulkAttack) n += strButton20(tx('Add to Attack List'), 'id=BatBulkAttackExport') + '&nbsp;';
		n += strButton20(tx('Highlight Defending Cities'), 'id=BatHighDefenders') + '</td></tr></table>'
		n += '</div>';

		n += '<DIV class=divHeader style="padding-right:0px;"><TABLE width=100% cellspacing=0>';
		if (!locations) {
			n += '<TR><TD class=xtab align=center>' + tx('City locations unavailable') + '</td></tr>';
		}
		else {
			n += '<TR><TD class=xtab align=center>' + tx('City Locations') + '</td></tr>';
		}
		n += '</table></div>';
		if (locations) {
			n += '<div style="padding-right:6px;width:500px;overflow-x:auto;height:200px;overflow-y:auto;"><TABLE id=tabBatAllMembers align=left cellpadding=0 cellspacing=0 width=100%>';
			n += '<TR><TD nowrap><A id=clickBat7 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;' + uW.g_js_strings.commonstr.city + '&nbsp;</span></a></td>\
				<TD nowrap><A id=clickBat4 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Lvl') + '&nbsp;</span></a></td>\
				<TD nowrap><A id=clickBat17 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.commonstr.faction + '&nbsp;</span></a></td>\
				<TD nowrap><A id=clickBat16 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Protection Left') + '&nbsp;</span></a></td>\
				<TD nowrap><a id=clickBat9 class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="padding-right:10px;vertical-align:middle;display:inline-block;width:100%;"><INPUT id=BatToggleScoutCheckbox type=checkbox></span></a></td>\
				<TD nowrap><A id=clickBat5 onclick="ptBatClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Co-ords') + '&nbsp;</span></a></td>\
				</tr>';
			n += '<TBODY id=BatBody></tbody></table></div>';
		}

		n += '</div><br>';

		t.popPlayer.getMainDiv().innerHTML = n;

		if (locations) {
			ById('BatCitySelect').style.display = 'block';
			if (ById('clickBat' + Options.PlayerOptions.sortColNum)) {
				ById('clickBat' + Options.PlayerOptions.sortColNum).className = 'buttonv2 std green';
			}
			ById('BatToggleScoutCheckbox').addEventListener('change', t.doSelectall, false);
			t.RepaintList();
		}

		t.PaintGlory(uid);

		if (ById('BatScoutExport')) ById('BatScoutExport').addEventListener('click', t.ExportScoutList, false);
		if (ById('BatBulkAttackExport')) ById('BatBulkAttackExport').addEventListener('click', t.ExportAttackList, false);
		ById('BatHighDefenders').addEventListener('click', t.HighlightDefenders, false);

		t.popPlayer.getTopDiv().innerHTML = '<DIV style="white-space:nowrap;" align=center>&nbsp;&nbsp;<B>' + u.name + ' (' + uid + ')</B>&nbsp;&nbsp;</DIV>';
		t.popPlayer.show(true);
		ResetFrameSize('btPlayerPop', 100, 500);
	},

	ClickSort: function (e) {
		var t = Battle;
		var newColNum = e.id.substr(8);
		if (ById('clickBat' + Options.PlayerOptions.sortColNum))
			ById('clickBat' + Options.PlayerOptions.sortColNum).className = 'buttonv2 std blue';
		e.className = 'buttonv2 std green';
		if (newColNum == Options.PlayerOptions.sortColNum) { Options.PlayerOptions.sortDir *= -1; }
		else { Options.PlayerOptions.sortColNum = newColNum; }
		saveOptions();
		t.RepaintList();
	},

	PaintGlory: function (uid) {
		var t = Battle;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.userId = uid;
		params.ctrl = 'PlayerProfile';
		params.action = 'get';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					ById('ptBatPaintGlory').innerHTML = addCommas(rslt.profile.glory);
					ById('ptBatPaintMaxGlory').innerHTML = addCommas(rslt.profile.maxGlory);
					ById('ptBatPaintLifetimeGlory').innerHTML = addCommas(parseIntNan(rslt.profile.lifetimeGlory));
					ById('ptBatGloryIcon').innerHTML = '<img src="' + IMGURL + 'chat_' + rslt.profile.gloryIconId + '.png">';
				}
				else {
					ById('ptBatPaintGlory').innerHTML = tx('(error)');
					ById('ptBatPaintMaxGlory').innerHTML = tx('(error)');
					ById('ptBatPaintLifetimeGlory').innerHTML = tx('(error)');
					ById('ptBatGloryIcon').innerHTML = '&nbsp;';
				}
			},
		}, true);
	},

	doSelectall: function () {
		var t = Battle;
		var city = "";
		for (var k = 0; k < t.dat.length; k++) {
			city = t.dat[k][11].toString();
			if (ById('BatToggleScoutCheckbox').checked) ById('ptBatScout_' + city).checked = true;
			else ById('ptBatScout_' + city).checked = false;
		}
	},

	RepaintList: function () {
		var t = Battle;

		function sortFunc(a, b) {
			var t = Battle;
			if (typeof (a[Options.PlayerOptions.sortColNum]) == 'number') {
				if (Options.PlayerOptions.sortDir > 0)
					return a[Options.PlayerOptions.sortColNum] - b[Options.PlayerOptions.sortColNum];
				else
					return b[Options.PlayerOptions.sortColNum] - a[Options.PlayerOptions.sortColNum];
			} else if (typeof (a[Options.PlayerOptions.sortColNum]) == 'boolean') {
				return 0;
			} else {
				if (Options.PlayerOptions.sortDir > 0)
					return a[Options.PlayerOptions.sortColNum].localeCompare(b[Options.PlayerOptions.sortColNum]);
				else
					return b[Options.PlayerOptions.sortColNum].localeCompare(a[Options.PlayerOptions.sortColNum]);
			}
		}

		t.dat.sort(sortFunc);

		var m = '';
		var RowId = "";
		var r = 0;
		for (var i = 0; i < t.dat.length; i++) {
			RowId = 'bat_' + t.dat[i][5].toString() + '_' + t.dat[i][6].toString();
			var bless = showBlessings(t.dat[i][18]);
			if (bless != "") {
				var bless = '<a class=trimg><img style="vertical-align:bottom" src="' + IMGURL + 'bonus_prestige.png"><SPAN class=trtip><table width=200 class=xtab>' + bless + '</table></span></a>';
			}
			var status = '<img title="Offline" style="vertical-align:bottom" src="' + OFFLINE + '"/>';
			if (t.dat[i][9] == 1) status = '<img title="Online" style="vertical-align:bottom" src="' + ONLINE + '"/>';

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			if (t.dat[i][19]) rowClass += ' highRow';
			m += '<TR id="' + RowId + '" class="' + rowClass + '" style="max-height:30px"><TD class=xtab nowrap>' + t.dat[i][7] + '</td>';
			m += '<TD class=xtab align=right>' + t.dat[i][4] + '</td>';
			m += '<TD class=xtab align=left nowrap>' + bless + t.dat[i][12] + t.dat[i][14] + '</td>';
			m += '<TD class=xtab align=center>' + t.dat[i][15] + '</td>';
			m += '<TD class=xtab align=center style="padding-left:4px;padding-right:0px;"><INPUT id=ptBatScout_' + t.dat[i][11] + ' type=checkbox></td>';
			m += '<TD class=xtab align=center onclick="btGotoMap(' + t.dat[i][5] + ',' + t.dat[i][6] + ')"><A class=xlink>' + t.dat[i][5] + ',' + t.dat[i][6] + '</a></td>';
		}
		if (ById('BatBody')) {
			ById('BatBody').innerHTML = m;
			ResetFrameSize('btPlayerPop', 100, 400);
		}
	},

	ExportScoutList: function () {
		var t = Battle;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkScout.ImportCoords(coordlist.split(" "));
		}
	},

	ExportAttackList: function () {
		var t = Battle;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkAttack.ImportCoords(coordlist.split(" "));
		}
	},

	getSelected: function () {
		var t = Battle;
		var coordlist = "";
		var city = "";
		for (var k = 0; k < t.dat.length; k++) {
			city = t.dat[k][11].toString();
			if (ById('ptBatScout_' + city).checked) {
				coordlist += t.dat[k][5].toString() + ',' + t.dat[k][6].toString() + ' ';
				ById('ptBatScout_' + city).checked = false;
			}
		}
		return coordlist;
	},

	HighlightDefenders: function () {
		var t = Battle;

		var delayer = 0;
		ById('BatHighDefenders').outerHTML = '<span id=BatHighDefendersProg>&nbsp;</span>';

		for (var k = 0; k < t.dat.length; k++) {
			if (!t.ReqSent[t.dat[k][5] + '_' + t.dat[k][6]] || t.ReqSent[t.dat[k][5] + '_' + t.dat[k][6]] == 0) {
				t.ReqSent[t.dat[k][5] + '_' + t.dat[k][6]] = 1;
				setTimeout(getDefendStatus, (250 * delayer), t.dat[k][5], t.dat[k][6], false, false, t.UpdateDefendStatus, k, t.dat.length, 'BatHighDefendersProg');
				delayer = delayer + 1;
			}
		}

		function ClearAtEnd() {
			if (ById('BatHighDefendersProg')) {
				ById('BatHighDefendersProg').outerHTML = strButton20(tx('Highlight Defending Cities'), 'id=BatHighDefenders');
				ById('BatHighDefenders').addEventListener('click', t.HighlightDefenders, false);
			}
		};

		setTimeout(ClearAtEnd, (250 * delayer));
	},

	UpdateDefendStatus: function (rslt, x, y, k) {
		var t = Battle;
		t.ReqSent[x + '_' + y] = 0;
		var div = ById('bat_' + x + '_' + y);
		var city = t.dat[k][11].toString();
		if (rslt.ok && rslt.ok == "true") {
			t.dat[k][19] = true;
			if (div) jQuery(div).addClass("highRow");
			if (ById('ptBatScout_' + city)) ById('ptBatScout_' + city).checked = true;
		}
		else {
			t.dat[k][19] = false;
			if (div) jQuery(div).removeClass("highRow");
			if (ById('ptBatScout_' + city)) ById('ptBatScout_' + city).checked = false;
		}
	},

}
