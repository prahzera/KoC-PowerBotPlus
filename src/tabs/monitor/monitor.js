/** Monitor Tab **/

Tabs.Monitor = {
	tabOrder: 1030,
	tabLabel: 'Monitor',
	userInfo: {},
	rsltInfo: {},
	cText: "",
	LastUser: "",
	MonWidth: 300,
	MonHeight: 500,
	ThroneUID: null,
	ThroneName: null,
	MonitorInterval: 3,
	ResetMonitorCountDown: 900,
	MonitorCountDown: 0,
	CurrLog: [],
	LogUser: "",
	LogTR: [],
	LastTR: [],
	MaxLogEntries: 100,
	MonitorID: 0,
	NameFilter: '',
	AllianceFilter: '',
	HisStatEffects: [],
	HisStatTiers: [],

	Options: {
		MonitorFontSize: 11,
		MonitorColours: true,
		LastMonitored: "",
		LastMonitoredUID: 0,
		MonitorSound: false,
		MonitorStartState: false,
		MonPresetChange: true,
		MonitorChampions: false,
		TRMonPresetByName: false,
		MonitorRefreshRate: 3,
		Volume: 100,
		PVPOnly: false,
	},

	init: function (div) {
		var t = Tabs.Monitor;

		if (uW.isNewServer()) {
			if (GlobalOptions.btPowerBar) {
				var elem = ById("bttcMonitor");
				elem.setAttribute("style", "display:none");
			}
			return;
		}

		HTMLRegister['MONITOR'] = {};

		DefaultWindowPos('btMonPos', 'main_engagement_tabs');

		uWExportFunction('btShowLog', Tabs.Monitor.ShowLog);
		uWExportFunction('btDeleteLog', Tabs.Monitor.DeleteLog);
		uWExportFunction('btPostLog', Tabs.Monitor.PostLog);
		uWExportFunction('btToggleKeep', Tabs.Monitor.ToggleKeep);
		uWExportFunction('btUpdateLabel', Tabs.Monitor.UpdateLabel);
		uWExportFunction('btUpdatePresetLabel', Dashboard.UpdatePresetLabel);
		uWExportFunction('btFilterLog', Tabs.Monitor.FilterLog);
		uWExportFunction('btClearNameFilter', Tabs.Monitor.ClearNameFilter);
		uWExportFunction('btClearAllianceFilter', Tabs.Monitor.ClearAllianceFilter);

		uWExportFunction('btMonitorExternalCallUID', Tabs.Monitor.MonitorExternalCallUID);
		uWExportFunction('btMapMonitorTR', Tabs.Monitor.MapMonitorTR);
		uWExportFunction('btThroneMonitorTR', Tabs.Monitor.ThroneMonitorTR);

		// add entry to the map menu

		for (var jj in CM.ContextMenuMapController.prototype.MapContextMenus.City) {
			if (jj != 5) CM.ContextMenuMapController.prototype.MapContextMenus.City[jj].push("MONI");
		} // no misted anymore
		var wildContext;
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.EnemyWilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("MONI");
		}
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.Wilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("MONI");
		}
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.FriendlyWilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("MONI");
		}
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("MONI");
		}

		var mod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo',
			[['default:', 'case "MONI":' +
				'b.text = "' + tx('Monitor') + '"; b.color = "green"; ' +
				'b.action = function () { ' +
				'btMapMonitorTR(e);' +
				'}; ' +
				'if (e.user.id) d.push(b); break; ' +
				'default: ']]);
		mod.setEnable(true);

		// throne room alteration

		var str = CM.FETemplates.Throne.mainThrone.replace(
			'<li id="throneInventoryTab" class="inactive"> #{inventory} </li>',
			'<li id="throneInventoryTab" class="inactive"> #{inventory} </li><li id="throneMonitor" class="inactive" onclick="btThroneMonitorTR()"> ' + tx('Monitor') + ' </li>');
		CM.FETemplates.Throne.mainThrone = str;

		// intercept throne room view function to grey out monitor option for your own room...

		var oldTRViewFunc = CM.ThroneView.openThrone;
		var newTRViewFunc = function (c) {
			Tabs.Monitor.ThroneUID = 0;
			if (c) { Tabs.Monitor.ThroneUID = c.id; Tabs.Monitor.ThroneName = c.name; }
			oldTRViewFunc(c);
			if (Tabs.Monitor.ThroneUID == 0) { jQuery("#throneMonitor").attr("class", "deactive"); }
		};
		if (typeof exportFunction == 'function') { exportFunction(newTRViewFunc, CM.ThroneView, { defineAs: "openThrone" }); }
		else { CM.ThroneView.openThrone = newTRViewFunc; };

		if (!Options.MonitorOptions) {
			Options.MonitorOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.MonitorOptions.hasOwnProperty(y)) {
					Options.MonitorOptions[y] = t.Options[y];
				}
			}
		}

		t.loadLog();

		m = '<div>';
		m += '<div class="divHeader" align="center">' + tx('THRONE ROOM MONITOR') + '</div>';
		m += '<div align="center"><br>&nbsp;&nbsp;' + tx('Enemy') + ':&nbsp;<INPUT id=btPlayer size=20 type=text value="' + Options.MonitorOptions.LastMonitored + '"/>&nbsp;<a id=btPlayerSubmit class="inlineButton btButton blue20"><span>' + tx('Monitor') + '</span></a>&nbsp;<a id=btUIDSubmit class="inlineButton btButton blue20"><span>UID</span></a></div>';
		m += '<div class="ErrText" align="center" id=btplayErr>&nbsp;</div>';
		m += '<a id=btMonOptionLink class=divLink ><div class="divHeader" align="left"><img id=btMonOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('OPTIONS') + '</div></a>';
		m += '<div id=btMonOption class=divHide><TABLE width="100%">';
		m += '<TR><td class=xtab><INPUT id=SoundChk type=checkbox /></td><td class=xtab>' + tx('Use sound alerts on monitor') + '</td>';
		m += '<TD class=xtab width=50%><div id=btSoundOpts class="divHide"><TABLE cellpadding=0 cellspacing=0><TR valign=middle><TD class=xtab>' + tx('Volume') + '&nbsp;</td><TD class=xtab><SPAN id=btVolSlider></span></td><TD class=xtab align=right id=btVolOut style="width:30px;">0</td><td class=xtab>&nbsp;<a id=btTestMonSound class="inlineButton btButton blue14"><span>' + tx('Test') + '</span></a></td></tr></table></div></td><td class=xtab width=10>&nbsp;</td></tr>';
		m += '<TR><td class=xtab>&nbsp;</td><td class=xtab>' + tx('Font size') + ': ' + htmlSelector({ 8: 8, 9: 9, 10: 10, 11: 11 }, Options.MonitorOptions.MonitorFontSize, 'id=btMonitorFont class=btInput') + '&nbsp;' + tx('pixels') + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=MonitorColoursChk type=checkbox /></td><td class=xtab>' + tx('Use different colours in monitor window') + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=PVPOnlyChk type=checkbox /></td><td class=xtab>' + tx('Show PVP effects only') + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=MonPresetChk type=checkbox /></td><td class=xtab>' + tx('Show throne room preset changer') + '</td><td width="120" class=xtab>&nbsp;</td></tr>';
		m += '<TR id=btMonPresetByNameOpts class="divHide"><td class=xtab><INPUT id=TRMonPresetByNameChk type=checkbox /></td><td colspan="3" class=xtab>' + tx('Select presets by name') + '</td></tr>';
		m += '<TR><td class=xtab>&nbsp;</td><td class=xtab>' + tx('Monitor refresh rate') + ': ' + htmlSelector({ 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }, Options.MonitorOptions.MonitorRefreshRate, 'id=btMonitorRefreshRate class=btInput') + '&nbsp;' + tx('seconds') + '</td></tr>';
		m += '</table></div>';
		m += '<a id=btMonLogLink class=divLink ><div class="divHeader" align="left"><img id=btMonLogArrow height="10" src="' + DownArrow + '">&nbsp;' + tx('MONITOR LOG') + '</div></a>';
		m += '<div id=btMonLog></div><br>';

		div.innerHTML = m;
		t.PaintLog();
		OpenDiv["Monitor"] = "btMonLog";

		ById('btMonOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Monitor", 100, GlobalOptions.btWinSize.x, "btMonOption", false) }, false);
		ById('btMonLogLink').addEventListener('click', function () { ToggleMainDivDisplay("Monitor", 100, GlobalOptions.btWinSize.x, "btMonLog", false) }, false);

		ById('btPlayer').addEventListener('keypress', function (e) { if (e.which == 13) ById('btPlayerSubmit').click(); }, false);
		ById('btPlayer').addEventListener('focus', function () { t.setError('&nbsp;'); }, false);
		ById('btPlayerSubmit').addEventListener('click', t.MonitorTRClick, false);
		ById('btPlayerSubmit').addEventListener('mousedown', function (me) { ResetWindowPos(me, 'btPlayerSubmit', popMon); }, true);
		ById('btUIDSubmit').addEventListener('click', t.UIDClick, false);
		ById('btMonitorFont').addEventListener('change', t.ChangeFontSize, false);

		ChangeOption('MonitorOptions', 'btMonitorFont', 'MonitorFontSize', function () {
			if (t.MonitoringActive && popMon) {
				popMon.show(false);
				popMon.destroy();
				popMon = null;
				t.initMonitor(t.userInfo.userId, t.MonitoringPaused);
			}
		});
		ChangeOption('MonitorOptions', 'btMonitorRefreshRate', 'MonitorRefreshRate');

		ById('btTestMonSound').addEventListener('click', function () {
			AudioManager.setVolume(Options.MonitorOptions.Volume);
			AudioManager.setSource(SOUND_FILES.monitor);
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 2500);
		}, false);


		ToggleOption('MonitorOptions', 'SoundChk', 'MonitorSound', t.SoundToggle);
		t.SoundToggle();
		ToggleOption('MonitorOptions', 'MonitorColoursChk', 'MonitorColours');
		ToggleOption('MonitorOptions', 'PVPOnlyChk', 'PVPOnly');
		ToggleOption('MonitorOptions', 'MonPresetChk', 'MonPresetChange', t.MonPresetToggle);
		t.MonPresetToggle();
		ToggleOption('MonitorOptions', 'TRMonPresetByNameChk', 'TRMonPresetByName', Dashboard.PaintTRPresets);

		t.VolSlider = new SliderBar(ById('btVolSlider'), 200, 21, 0);
		t.VolSlider.setValue(Options.MonitorOptions.Volume / 100);
		t.VolSlider.setChangeListener(t.VolumeChanged);
		t.VolumeChanged(Options.MonitorOptions.Volume / 100);

		if (Options.MonitorOptions.MonitorStartState && (Options.MonitorOptions.LastMonitoredUID != 0)) { t.initMonitor(Options.MonitorOptions.LastMonitoredUID); }
	},

	MonitorExternalCallUID: function (UID) {
		if (UID != "") { Tabs.Monitor.initMonitor(deFilter(UID), false); }
	},

	MapMonitorTR: function (e) {
		if (e.user.id != "0") { Tabs.Monitor.initMonitor(e.user.id, false); }
	},

	ThroneMonitorTR: function () {
		var t = Tabs.Monitor;
		if (t.ThroneUID != 0) { Tabs.Monitor.initMonitor(t.ThroneUID, false); }
	},

	sendChat: function () {
		var t = Tabs.Monitor;
		sendChat(t.cText);
	},

	MonPresetToggle: function () {
		var t = Tabs.Monitor;
		var dc = jQuery('#btMonPresetByNameOpts').attr('class');
		if (Options.MonitorOptions.MonPresetChange) { if (dc.indexOf('divHide') >= 0) jQuery('#btMonPresetByNameOpts').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#btMonPresetByNameOpts').attr('class', 'divHide'); }
		Dashboard.PaintTRPresets();
	},

	SoundToggle: function () {
		var t = Tabs.Monitor;
		var dc = jQuery('#btSoundOpts').attr('class');
		if (Options.MonitorOptions.MonitorSound) { if (dc.indexOf('divHide') >= 0) jQuery('#btSoundOpts').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#btSoundOpts').attr('class', 'divHide'); }
	},

	VolumeChanged: function (val) {
		var t = Tabs.Monitor;
		ById('btVolOut').innerHTML = parseInt(val * 100);
		Options.MonitorOptions.Volume = parseInt(val * 100);
		saveOptions();
	},

	UIDClick: function () {
		var t = Tabs.Monitor;
		t.setError('&nbsp;');
		var UID = ById('btPlayer').value;
		UID = UID.replace(/\'/g, "_");

		t.initMonitor(UID, false)
	},

	MonitorTRClick: function () {
		var t = Tabs.Monitor;
		t.setError('&nbsp;');
		var name = ById('btPlayer').value;
		name = name.replace(/\'/g, "_").replace(/\,/g, "_").replace(/\-/g, "_");

		if (name.toUpperCase() == Seed.player.name.toUpperCase()) {
			t.initMonitor(uW.tvuid, false)
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

		fetchPlayerList(name, t.eventMatchNameMonitor);
	},

	setError: function (msg) {
		ById('btplayErr').innerHTML = msg;
	},

	setMonitorError: function (msg) {
		ById('btCountdownDiv').innerHTML = msg;
	},

	eventMatchNameMonitor: function (rslt) {
		var t = Tabs.Monitor;
		if (!rslt.ok) {
			t.setError(rslt.msg);
			return;
		}

		var matchname = ById('btPlayer').value;
		var uid = "";

		for (var k in rslt.matchedUsers) {
			if (rslt.matchedUsers[k].name.toUpperCase() == matchname.toUpperCase()) { uid = rslt.matchedUsers[k].userId; }
		}

		if (uid == "") {
			t.setError(tx('User not found') + '!');
			return;
		}

		t.initMonitor(uid, false);
	},

	initMonitor: function (uid, Paused) {
		var t = Tabs.Monitor;

		// set booleans and show loading window if not already active..

		t.userInfo.userLoaded = false;
		ResetHTMLRegister('MONITOR', 'btUserDiv');
		ResetHTMLRegister('MONITOR', 'btMonitorDiv');
		t.MonitoringActive = false;
		t.MonitoringPaused = Paused;
		if (popMon) { popMon = null; }
		t.CreateMonitorWindow();

		// get user info first..

		t.fetchPlayerInfo(uid, true, t.eventLoadMonitor);
	},

	eventLoadMonitor: function () {
		var t = Tabs.Monitor;
		if (!t.userInfo.userLoaded) { return; } // error?

		if (t.MonitoringPaused) {
			t.eventPaintTRStats();
			t.StartMonitorLoop();
		}
		else {
			t.TRStats(t.StartMonitorLoop);
		}
	},

	CreateMonitorWindow: function () {
		var t = Tabs.Monitor;
		t.LastUser = "";
		t.LastTR = [];

		m = '<div style="font-size:' + Options.MonitorOptions.MonitorFontSize + 'px;"><div id=btCountdownDiv><TABLE width="100%"><tr><td class=xtab align="center">&nbsp;</span></td></tr></table></div><div id=btUserDiv><TABLE><TD class=xtab><br><B>&nbsp;&nbsp;&nbsp;' + tx('Loading...') + '</b></td></tr></table></div><div id=btMonitorDiv></div><div id=btButtonDiv></div></div>';

		t.MonWidth = 300;
		t.MonHeight = 500;

		// adjust width and height based on monitor font size

		var fontratio = Options.MonitorOptions.MonitorFontSize / 11;
		t.MonWidth = Math.floor(t.MonWidth * fontratio);
		t.MonHeight = Math.floor(t.MonHeight * fontratio);

		popMon = new CPopup('btMonitor', Options.btMonPos.x, Options.btMonPos.y, t.MonWidth, t.MonHeight, true, Tabs.Monitor.close);
		popMon.getMainDiv().innerHTML = m;
		popMon.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('Monitor') + '</B></DIV>';
		popMon.show(true);
	},

	close: function () {
		var t = Tabs.Monitor;
		t.StopMonitoring();
		Options.btMonPos = popMon.getLocation();
		saveOptions();
		popMon = null;
	},

	eventPaintPlayerInfo: function () {
		var t = Tabs.Monitor;
		if (!t.userInfo.userLoaded) { return; } // user being changed

		var fontratio = Options.MonitorOptions.MonitorFontSize / 11;
		var imgwidth = 16;
		imgwidth = Math.floor(imgwidth * fontratio);

		o = "";
		if (t.userInfo.online) o = ' <span style="color:#f00;">(' + tx('ONLINE') + ')</span>';

		m = '<div id=btMonTRPresets align=center style="width:352;"></div>';
		m += '<TABLE width="100%"><tr><td class=xtabBR align="center" colspan="3"><B>' + t.userInfo.name + o + '</b></td></tr>';

		if (!t.userInfo.online)
			m += ' <tr><TD class=xtabBR align="center" colspan="3">' + t.getLastLogDuration(t.userInfo.lastLogin) + '</td></tr>';
		if (t.userInfo.misted)
			m += '<tr><TD class=xtabBR align="center" colspan="3"><B>*** ' + tx('MISTED') + ' (' + t.getDuration(t.userInfo.fogExpireTimestamp) + ') ***</b></td></tr>';
		m += '<tr><TD class=xtab align="center" colspan="3">UID: <B>' + parseInt(t.userInfo.userId) + '</b>&nbsp;<a class=xlink id=btProfile onclick="getInfoForAnUser(' + t.userInfo.userId + ')">(' + uW.g_js_strings.commonstr.profile + ')</a>';
		if (KOCMON_ON) m += '&nbsp;<a target="_tab" href="http://www.rycamelot.com/player/' + getServerId() + '/' + t.userInfo.userId + '"><img title="' + tx('View player on kocmon') + '" width="' + imgwidth + '" style="vertical-align:bottom;opacity:0.75;" src="' + KOCMON_LOGO + '"></a>';
		m += '</td></tr>';
		m += '<tr><TD class=xtab align="center" colspan="3">' + uW.g_js_strings.commonstr.might + ': <B>' + addCommas(Math.round(t.userInfo.might)) + '</b></td></tr>';
		m += '<tr><TD class=xtab align="center" colspan="3">TR/CH ' + uW.g_js_strings.commonstr.might + ': <B>' + addCommas(Math.round(t.userInfo.might) - Math.round(t.userInfo.mightClassic)) + '</b></td></tr>';
		if (Options.ShowGloryMight) {
			m += '<tr><TD class=xtab align="center" colspan="3">' + tx('Glory Might') + ': <B>' + addCommas(Math.round(t.userInfo.mightGlory)) + '</b></td></tr>';
		}
		if (t.userInfo.allianceName) {
			n = ""; if (!isMyself(t.userInfo.userId)) n += FormatDiplomacy(t.userInfo.allianceId);
			m += '<tr><TD class=xtabBR align="center" colspan="3">' + uW.g_js_strings.commonstr.alliance + ': <B>' + t.userInfo.allianceName + n + '</b></td></tr>';
		}
		m += '<tr><TD class=xtabBR align="center" colspan="3">' + uW.g_js_strings.commonstr.status + ': <B>' + t.GetStatusText(t.userInfo.warStatus, t.userInfo.truceExpireTimestamp) + '</b></td></tr>';
		m += '<tr><TD class=xtab align="center" colspan="3">&nbsp;</td></tr></table>';

		if (CheckForHTMLChange('MONITOR', 'btUserDiv', m)) {
			Dashboard.PaintTRPresets();
			ResetFrameSize('btMonitor', t.MonHeight, t.MonWidth);
		}
	},

	fetchPlayerInfo: function (uid, init, notify) {
		var t = Tabs.Monitor;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rsltInfo) {
				if (!rsltInfo.ok) {
					if (init) {
						if (ById('btUserDiv')) {
							ById('btUserDiv').innerHTML = '<TABLE width=100%><TD align=center class=xtab style="color:#f00;"><br><B>' + tx('Unknown UID') + '</b></td></tr></table>';
						}
					}
					t.setError('Unknown UID');
					return;
				}

				t.userInfo = rsltInfo.userInfo[0];
				t.fetchPlayerStatus(notify);
			},
			onFailure: function () {
				t.setError(tx('AJAX error (server not responding)'));
				notify();
			},
		}, true);
	},

	eventPaintTRStats: function () {
		var t = Tabs.Monitor;

		if (!t.userInfo.userLoaded) { return; } // user being changed

		t.cText = "";
		var title = t.userInfo.name + uW.g_js_strings.throneRoom.title_part;
		if (Options.MonitorOptions.PVPOnly) { title += ' (PVP Effects)'; }

		m = '<TABLE>';

		var SortOrder = [];
		if (Options.AlternateSortOrder) { for (var z in AlternateSortOrder) SortOrder.push(AlternateSortOrder[z]); }
		else { for (var z in t.HisStatEffects) SortOrder.push(z); }

		for (var z in SortOrder) {
			var k = SortOrder[z];
			var HisContent = "";
			var LineStyle = '';
			var EndStyle = '';

			var PVP = ((AttackEffects.indexOf(parseInt(k)) > -1) || (DefenceEffects.indexOf(parseInt(k)) > -1) || (LifeEffects.indexOf(parseInt(k)) > -1) || (RangeEffects.indexOf(parseInt(k)) > -1) || (SpeedEffects.indexOf(parseInt(k)) > -1) || (AccuracyEffects.indexOf(parseInt(k)) > -1) || (OtherCombatEffects.indexOf(parseInt(k)) > -1) || (OtherPVPEffects.indexOf(parseInt(k)) > -1));

			if (Options.MonitorOptions.MonitorColours) {
				var TRStyles = getTREffectStyle(k);
				LineStyle = TRStyles.LineStyle;
				EndStyle = TRStyles.EndStyle;
			}
			if (!Options.MonitorOptions.PVPOnly || PVP) {
				if (t.HisStatEffects[k] && (t.HisStatEffects[k] != 0) && uW.cm.thronestats["effects"][k]) {
					var effectName = getThroneEffectName(k, t.HisStatTiers[k]);
					HisContent = (Math.round(t.HisStatEffects[k] * 100) / 100) + '% ' + effectName;
				}
				if (HisContent != "") { m += '<TR><TD width="25px" class=xtab></td><TD class=xtab>' + LineStyle + HisContent + EndStyle + '</span></td><TD width="50px" class=xtab></td></tr>'; t.cText += enFilter(HisContent) + "||"; }
			}
		}
		m += '</table>';
		t.cText = t.cText.replace(/\|\|\s*$/, "");
		t.cText = ":::. |" + title + "|| " + t.cText;

		if (CheckForHTMLChange('MONITOR', 'btMonitorDiv', m)) {
			ResetFrameSize('btMonitor', t.MonHeight, t.MonWidth);
		}

		// if first TR monitored for this user then add log entry...
		// check with last entry added in case of refresh...

		if ((t.LastUser == "") && !t.MonitoringPaused) {
			t.LogUser = "";
			t.LogTR = [];
			if (t.CurrLog.length > 0) {
				t.LogUser = t.CurrLog[t.CurrLog.length - 1].id;
				t.LogTR = t.CurrLog[t.CurrLog.length - 1].tr.slice();
			}

			if ((t.LogUser != t.userInfo.userId) || (JSON2.stringify(t.LogTR) != JSON2.stringify(t.HisStatEffects))) {
				t.AddToLog(t.userInfo.userId, t.userInfo.name, t.userInfo.allianceName, t.HisStatEffects.slice(), t.HisStatTiers.slice());
			}
		}

		// if changed while monitoring add log entry and play a sound...

		if ((t.LastUser == t.userInfo.name) && (JSON2.stringify(t.LastTR) != JSON2.stringify(t.HisStatEffects)) && !t.MonitoringPaused) {
			t.AddToLog(t.userInfo.userId, t.userInfo.name, t.userInfo.allianceName, t.HisStatEffects.slice(), t.HisStatTiers.slice());
			if (Options.MonitorOptions.MonitorSound) {
				AudioManager.setVolume(Options.MonitorOptions.Volume);
				AudioManager.setSource(SOUND_FILES.monitor);
				AudioManager.play();
				AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 2500);
			}
		}

		t.LastUser = t.userInfo.name;
		t.LastTR = t.HisStatEffects.slice();
	},

	fetchPlayerStatus: function (notify) {
		var t = Tabs.Monitor;

		var params = uW.Object.clone(uW.g_ajaxparams);
		var uid = t.userInfo.userId;
		params.checkArr = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getOnline.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				t.userInfo.online = rslt.data[uid];
				t.fetchCourtInfo(notify);
			},
			onFailure: function () {
				t.setError(tx('AJAX error (server not responding)'));
				notify();
			},
		}, true); // no retry
	},

	fetchCourtInfo: function (notify) {
		var t = Tabs.Monitor;

		var params = uW.Object.clone(uW.g_ajaxparams);
		var uid = t.userInfo.userId;
		params.pid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				u = unixTime();
				f = convertTime(new Date(rslt.playerInfo.fogExpireTimestamp.replace(" ", "T") + "Z"));
				t.userInfo.misted = (f >= u);
				t.userInfo.fogExpireTimestamp = rslt.playerInfo.fogExpireTimestamp;
				t.userInfo.warStatus = rslt.playerInfo.warStatus;
				t.userInfo.truceExpireTimestamp = rslt.playerInfo.truceExpireTimestamp;
				t.userInfo.lastLogin = rslt.playerInfo.lastLogin;
				t.userInfo.cityCount = rslt.playerInfo.cityCount;
				t.userInfo.mightClassic = rslt.playerInfo.mightClassic;
				t.userInfo.mightGlory = rslt.playerInfo.mightGlory;
				t.userInfo.userLoaded = true;
				notify();
			},
			onFailure: function () {
				t.setError(tx('AJAX error (server not responding)'));
				notify();
			},
		}, true); // no retry
	},

	TRStats: function (notify) {
		var t = Tabs.Monitor;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.ctrl = 'throneRoom\\ThroneRoomServiceAjax';
		params.action = 'getEquipped';
		params.playerId = t.userInfo.userId;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch53.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					for (var k in uW.cm.thronestats.tiers) { t.HisStatEffects[k] = 0; t.HisStatTiers[k] = 0; }
					for (var kk in rslt.items) {
						y = rslt.items[kk];
						if (y != undefined) {
							if (y["jewel"] && y["jewel"]["valid"] == true) {
								y["effects"]["slot6"].fromJewel = true;
								y["effects"]["slot6"].quality = y["jewel"].quality;
							}
							for (var O in y["effects"]) {
								var i = +(O.split("slot")[1]);
								id = y["effects"]["slot" + i]["id"];
								var Current = getTRSlotStat(y, id, i);
								if (i <= parseInt(y["quality"])) {
									if (CompositeEffects.hasOwnProperty(id)) {
										var Composite = CompositeEffects[id]
										for (var e = 0; e < Composite.length; e++) {
											t.HisStatEffects[Composite[e]] += Current;
										}
									}
									else {
										t.HisStatEffects[id] += Current;
									}
								}
								t.HisStatTiers[id] = y["effects"]["slot" + i]["tier"];
							}
						}
					}
				} else t.setMonitorError(tx('Error Reading Throne Room'));
				if (params.playerId == t.userInfo.userId) { notify(); }
			},
			onFailure: function () {
				t.setMonitorError(tx('AJAX error (server not responding)'));
				if (params.playerId == t.userInfo.userId) { notify(); }
			},
		}, true); // no retry
	},

	StopMonitoring: function () {
		var t = Tabs.Monitor;
		t.userInfo.userLoaded = false;
		t.MonitoringActive = false;
		Options.MonitorOptions.MonitorStartState = false;
		saveOptions();
	},

	StartMonitorLoop: function () {
		var t = Tabs.Monitor;

		t.eventPaintPlayerInfo();
		t.eventPaintTRStats();

		// show buttons ...

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtabBR colspan="3"><div align="center"><br><a id=btPostToChat class="inlineButton btButton blue20"><span style="font-size:' + Options.MonitorOptions.MonitorFontSize + 'px;">' + tx('Post to Chat') + '</span></a>&nbsp;<a id=btOpenTR class="inlineButton btButton blue20"><span style="font-size:' + Options.MonitorOptions.MonitorFontSize + 'px;">' + uW.g_js_strings.commonstr.throneroom + '</span></a>&nbsp;<a id=btPause class="inlineButton btButton blue20"><span style="font-size:' + Options.MonitorOptions.MonitorFontSize + 'px;">' + tx('Pause') + '</span></a></div></td></tr>';
		m += '</table>';
		ById('btButtonDiv').innerHTML = m;
		ResetFrameSize('btMonitor', t.MonHeight, t.MonWidth);
		ById('btPostToChat').addEventListener('click', t.sendChat, false);
		ById('btPause').addEventListener('click', t.TogglePause, false);
		ById('btOpenTR').addEventListener('click', t.showTR, false);

		t.MonitorID = t.userInfo.userId;
		Options.MonitorOptions.LastMonitored = t.userInfo.name;
		Options.MonitorOptions.LastMonitoredUID = t.userInfo.userId;
		Options.MonitorOptions.MonitorStartState = true;
		saveOptions();

		t.MonitorLooper = 0;

		t.MonitorCountDown = t.ResetMonitorCountDown;
		t.MonitoringActive = true;
	},

	MonitorTRLoop: function () {
		var t = Tabs.Monitor;

		if (!t.userInfo.userLoaded) { return; } // user being changed

		t.MonitorLooper = t.MonitorLooper + 1;
		if (t.MonitorLooper > 30) {
			t.MonitorLooper = 0;
			t.fetchPlayerInfo(t.userInfo.userId, false, t.eventPaintPlayerInfo);
		}

		// check for 15 minute monitor timeout

		if (!trusted && !t.MonitoringPaused) {
			t.MonitorCountDown = t.MonitorCountDown - 1;
			if (t.MonitorCountDown < 1) {
				t.MonitorTimedOut = true;
				t.MonitoringPaused = true;
				Options.MonitorOptions.MonitorStartState = false;
				saveOptions();
				AudioManager.setVolume(Options.MonitorOptions.Volume);
				AudioManager.setSource(SOUND_FILES.timeout);
				AudioManager.play();
				AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 2500);
			}
		}

		m = '<TABLE width="100%"><tr><td class=xtab align="center">&nbsp;</span></td></tr></table>';
		if (!trusted && !t.MonitoringPaused) {
			o = '<span style="color:#888;">';
			if (t.MonitorCountDown <= 30) o = '<span style="color:#f00;">';
			if (!t.MonitorTimedOut) m = '<TABLE width="100%"><tr><td class=xtab align="center">' + o + tx('Monitor timeout in ') + uW.timestr(t.MonitorCountDown) + '</span></td></tr></table>';
		}
		ById('btCountdownDiv').innerHTML = m;

		if (t.MonitoringPaused) {
			if (t.MonitorTimedOut) { popMon.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('Monitoring Timed Out') + '</B></DIV>'; }
			else { popMon.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('Monitoring Paused') + '</B></DIV>'; }
			ById('btPause').innerHTML = '<span style="font-size:' + Options.MonitorOptions.MonitorFontSize + 'px;">' + tx('Resume') + '</span>';
		}
		else {
			var dots = "";
			var rem = (t.MonitorLooper % 2);
			for (var s = 0; s <= 1; s++) {
				if (s < rem) { dots += "*"; }
			}

			popMon.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + dots + '&nbsp;Monitoring&nbsp;' + dots + '</B></DIV>';
			ById('btPause').innerHTML = '<span style="font-size:' + Options.MonitorOptions.MonitorFontSize + 'px;">' + tx('Pause') + '</span>';

			if (((t.MonitorLooper % t.MonitorInterval) == 1) || (t.MonitorInterval == 1)) {
				t.TRStats(t.eventPaintTRStats);
			}
		}
	},

	getLastLogDuration: function (datestr) {
		if (!datestr) return;
		var Interval = convertTime(new Date(datestr.replace(" ", "T") + "Z")) - unixTime();
		if (Interval < 0) return '(' + uW.g_js_strings.modal_messages_viewreports_view.lastlogin + ' ' + uW.timestr(Interval * (-1)) + ' ago)';
		else return '(' + tx('minutes ago') + ')';
	},

	getDuration: function (datestr) {
		if (!datestr) return;
		var Interval = convertTime(new Date(datestr.replace(" ", "T") + "Z")) - unixTime();
		if (Interval >= 0) {
			return uW.timestr(Interval);
		}
		else {
			if (Interval > -43200) { return tx("Can't Truce for ") + uW.timestr(43200 - (Interval * -1)); }
			else { return ""; }
		}
	},

	GetStatusText: function (warStatus, truceExpireTimestamp) {
		var t = Tabs.Monitor;
		// weird bug?!!!?
		var dur = t.getDuration(truceExpireTimestamp);
		var d = '';
		if (dur != "") { d = ' (' + dur + ')'; }
		else { warStatus = 1; } // I think this just means the status hasn't been updated...?

		switch (parseInt(warStatus)) {
			case 1:
				return uW.g_js_strings.commonstr.normal + d;
			case 2:
				return uW.g_js_strings.MapObject.begprotect + d;
			case 3:
				return uW.g_js_strings.commonstr.truce + d;
			case 4:
				return uW.g_js_strings.commonstr.vacation + d;
			default:
				return uW.g_js_strings.commonstr.normal + d
		}
	},

	showTR: function () {
		var t = Tabs.Monitor;
		if (uW.btFetchThroneRoom) {
			t.ThroneUID = t.userInfo.userId;
			t.ThroneName = '';
			if (!isMyself(t.userInfo.userId)) { t.ThroneName = t.userInfo.name; }
			uW.btFetchThroneRoom();
		}
		else {
			var T = {};
			T.id = t.userInfo.userId;
			T.self = isMyself(t.userInfo.userId);
			T.name = t.userInfo.name;
			CM.ModalManager.close();
			CM.ThroneController.getThroneItems(uWCloneInto(T))
		}
	},

	TogglePause: function () {
		var t = Tabs.Monitor;
		if (t.MonitoringPaused) {
			t.MonitoringPaused = false;
			t.MonitoringTimedOut = false;
			t.MonitorCountDown = t.ResetMonitorCountDown;
			Options.MonitorOptions.MonitorStartState = true;
		}
		else {
			t.MonitoringPaused = true;
			Options.MonitorOptions.MonitorStartState = false;
		}
		saveOptions();
	},

	loadLog: function () {
		var t = Tabs.Monitor;
		var l = JSON2.parse(GM_getValue('MonitorLog_' + getServerId() + '_' + uW.tvuid, '[]'));
		if (matTypeof(l) == 'array') { t.CurrLog = l; }
	},

	saveLog: function () {
		var t = Tabs.Monitor;
		setTimeout(function () { GM_setValue('MonitorLog_' + getServerId() + '_' + uW.tvuid, JSON2.stringify(t.CurrLog)); }, 0); // get around GM_SetValue uW error
	},

	ClearLog: function () {
		var t = Tabs.Monitor;
		t.CurrLog = [];
		t.saveLog();
		t.PaintLog();
	},

	AddToLog: function (ID, Name, Alliance, TRStats, TRTiers) {
		var t = Tabs.Monitor;
		var ts = unixTime();
		var okeep = false;
		var olabel = "";

		// don't log yourself!!

		if (isMyself(t.userInfo.userId)) { return; }

		// if TR already in log, then remove so we update alliance and date/time stamp...

		var n = t.CurrLog.length;
		while (n--) {
			t.LogUser = t.CurrLog[n].id;
			t.LogTR = t.CurrLog[n].tr.slice();

			if ((t.LogUser == t.userInfo.userId) && (JSON2.stringify(t.LogTR) == JSON2.stringify(t.HisStatEffects))) {
				// keep any labels or keep flag!
				okeep = t.CurrLog[n].keep;
				olabel = t.CurrLog[n].label;
				t.CurrLog.splice(n, 1);
			}
		}

		while (t.CurrLog.length >= t.MaxLogEntries) {
			//make space in the log.. find the earliest entry where keep = false
			var spliced = false;
			for (var l in t.CurrLog) {
				if (!t.CurrLog[l].keep) {
					t.CurrLog.splice(l, 1);
					spliced = true;
					break;
				}
			}
			//no space, because keep is set on all entries. Log it!
			if (!spliced) {
				logit('No space in Monitor Log!');
				return;
			}
		}
		t.CurrLog.push({ ts: ts, id: ID, name: Name, alliance: Alliance, tr: TRStats, tier: TRTiers, keep: okeep, label: olabel });
		t.saveLog();
		t.PaintLog();
	},

	PaintLog: function () {
		var t = Tabs.Monitor;

		var z = '';
		var r = 0;
		var logshow = false;
		var logfiltered = false;

		var z = '<div align="center"><TABLE cellSpacing=0 width=98% height=0%><tr><td class="xtab">' + tx('Filter by Name/UID') + ': <INPUT class="btInput" id="btNameFilter" size=16 style="width: 115px" type=text value="' + t.NameFilter + '" onkeyup="btStartKeyTimer(this,btFilterLog)" onchange="btFilterLog()" />&nbsp;<a class="inlineButton btButton brown8" onclick="btClearNameFilter()"><span>' + tx('Clear') + '</span></a></td><td class="xtab">' + uW.g_js_strings.commonstr.alliance + ': <INPUT class="btInput" id="btAllianceFilter" size=16 style="width: 115px" type=text value="' + t.AllianceFilter + '" onkeyup="btStartKeyTimer(this,btFilterLog)" onchange="btFilterLog()" />&nbsp;<a class="inlineButton btButton brown8" onclick="btClearAllianceFilter()"><span>' + tx('Clear') + '</span></a></td></td><td class="xtab" align=right>(' + t.CurrLog.length + '/' + t.MaxLogEntries + ')</td></tr></table>';
		z += '<TABLE cellSpacing=0 width=98% height=0%><tr><td class="xtabHD" align="center" style="width:20px">&nbsp;</td><td class="xtabHD" style="width:100px"><b>' + tx('Date/Time') + '</b></td><td style="width:115px" class="xtabHD"><b>' + uW.g_js_strings.commonstr.nametx + '</b></td><td style="width:115px" class="xtabHD"><b>' + uW.g_js_strings.commonstr.alliance + '</b></td><td class="xtabHD" style="width:145px"><b>Label</b></td><td class="xtabHD" align="center" style="width:30px"><b>' + tx('Keep') + '</b></td><td class="xtabHD" align="right">' + strButton14(tx('Clear Log'), 'id=btClearLog') + '</td></tr></table>';
		z += '<div style="max-height:330px; overflow-y:scroll" align="center"><TABLE id=btLogTable cellSpacing=0 width=98% height=0%>';

		var n = t.CurrLog.length;
		while (n--) {
			var a = t.CurrLog[n];

			logfiltered = true;
			if ((t.NameFilter != "") && (a.name.toUpperCase().search(t.NameFilter.toUpperCase()) < 0) && (a.id.search(t.NameFilter) < 0)) continue;
			if ((t.AllianceFilter != "") && (a.alliance.toUpperCase().search(t.AllianceFilter.toUpperCase()) < 0)) continue;

			logshow = true;
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			z += '<tr class="' + rowClass + '">';
			z += '<TD style="width:20px" class="xtab trimg" id="trimg' + n + '" align=left><img src="' + ThroneImage + '"</img></td>';
			z += '<TD style="width:100px" class=xtab>' + formatDateTime(a.ts) + '</td>';
			z += '<TD style="width:115px" class=xtab>' + PlayerLink(a.id, a.name) + '</td>';
			z += '<TD style="width:115px" class=xtab>' + (a.alliance ? a.alliance : '---') + '</td>';
			z += '<TD style="width:145px" class=xtab><INPUT class="btInput" id="btLabel' + n + '" size=20 style="width: 140px" type=text value="' + a.label + '" onkeyup="btStartKeyTimer(this,btUpdateLabel,' + n + ')" onchange="btUpdateLabel(this,' + n + ')" /></td>';
			z += '<TD style="width:30px" class=xtab align=center><INPUT id="btKeep' + n + '" type=checkbox ' + (a.keep ? 'CHECKED' : '') + ' onclick="btToggleKeep(' + n + ')" /></td>';
			z += '<TD class=xtab align=right><a id="btShowLog' + n + '" class="inlineButton btButton brown8" onclick="btShowLog(' + n + ')"><span>' + tx('Open') + '</span></a>&nbsp;<a id="btPostLog' + n + '" class="inlineButton btButton brown8" onclick="btPostLog(' + n + ')"><span>' + tx('Post') + '</span></a>&nbsp;<a id="btDeleteLog' + n + '" class="inlineButton btButton brown8" onclick="btDeleteLog(' + n + ')"><span>' + tx('Del') + '</span></a></td>';
			z += '</tr>';
		}

		if (!logshow) {
			if (!logfiltered)
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No log entries') + '</div></td></tr>';
			else
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No log entries matching search parameters') + '</div></td></tr>';
		}

		z += '</table></div><br>';

		ById('btMonLog').innerHTML = z;
		ById('btClearLog').addEventListener('click', function () { t.ClearLog(); }, false);

		var cItems = ById('btLogTable').getElementsByClassName('trimg');
		for (var i = 0; i < cItems.length; i++) {
			if (t.CurrLog[cItems[i].id.substring(5)].tier) {
				t.createToolTip("", cItems[i], t.CurrLog[cItems[i].id.substring(5)].tr.slice(), t.CurrLog[cItems[i].id.substring(5)].tier.slice());
			}
			else {
				t.createToolTip("", cItems[i], t.CurrLog[cItems[i].id.substring(5)].tr.slice());
			}
		}
	},

	createToolTip: function (title, elem, TempStatEffects, TempStatTiers) {
		var t = Tabs.Monitor;
		var TempcText = "";
		if (title != "") { TempcText += "<b>" + title + "</b><br>&nbsp;<br>"; }

		for (var k in TempStatEffects) {
			var HisContent = "";
			if (TempStatEffects[k] && (TempStatEffects[k] != 0) && uW.cm.thronestats["effects"][k]) {
				if (TempStatTiers) { var effectName = getThroneEffectName(k, TempStatTiers[k]); }
				else { var effectName = getThroneEffectName(k); }
				HisContent = (Math.round(TempStatEffects[k] * 100) / 100) + '% ' + effectName;
			}
			if (HisContent != "") { TempcText += HisContent + "<br>"; }
		}

		jQuery('#' + elem.id).children("span").remove();
		jQuery('#' + elem.id).append('<span class="trtip">' + TempcText + '</span>');
	},

	ShowLog: function (entry) {
		var t = Tabs.Monitor;
		t.HisStatEffects = t.CurrLog[entry].tr.slice();
		t.HisStatTiers = [];
		if (t.CurrLog[entry].tier) { t.HisStatTiers = t.CurrLog[entry].tier.slice(); }

		// display monitor in paused mode showing selected entry

		t.initMonitor(t.CurrLog[entry].id, true);
	},

	ToggleKeep: function (entry) {
		var t = Tabs.Monitor;
		t.CurrLog[entry].keep = !t.CurrLog[entry].keep;
		t.saveLog();
	},

	UpdateLabel: function (elem, entry) {
		var t = Tabs.Monitor;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		t.CurrLog[entry].label = elem.value;
		t.saveLog();
	},

	PostLog: function (entry) {
		var t = Tabs.Monitor;
		var TempStatEffects = t.CurrLog[entry].tr.slice();
		var TempStatTiers = [];
		if (t.CurrLog[entry].tier) { TempStatTiers = t.CurrLog[entry].tier.slice(); }
		var TempcText = "";

		var title = t.CurrLog[entry].name + uW.g_js_strings.throneRoom.title_part;
		if (Options.MonitorOptions.PVPOnly) { title += ' (PVP Effects)'; }

		for (var k in TempStatEffects) {
			var HisContent = "";
			var PVP = ((AttackEffects.indexOf(parseInt(k)) > -1) || (DefenceEffects.indexOf(parseInt(k)) > -1) || (LifeEffects.indexOf(parseInt(k)) > -1) || (RangeEffects.indexOf(parseInt(k)) > -1) || (SpeedEffects.indexOf(parseInt(k)) > -1) || (AccuracyEffects.indexOf(parseInt(k)) > -1) || (OtherCombatEffects.indexOf(parseInt(k)) > -1) || (OtherPVPEffects.indexOf(parseInt(k)) > -1));
			if (!Options.MonitorOptions.PVPOnly || PVP) {
				if (TempStatEffects[k] && (TempStatEffects[k] != 0) && uW.cm.thronestats["effects"][k]) {
					var effectName = getThroneEffectName(k, TempStatTiers[k]);
					HisContent = (Math.round(TempStatEffects[k] * 100) / 100) + '% ' + effectName;
				}
				if (HisContent != "") { TempcText += HisContent + "||"; }
			}
		}
		TempcText = TempcText.replace(/\|\|\s*$/, "");
		TempcText = ":::. |" + title + "|| " + TempcText;
		sendChat(TempcText);
	},

	DeleteLog: function (entry) {
		var t = Tabs.Monitor;
		t.CurrLog.splice(entry, 1);
		t.saveLog();
		t.PaintLog();
	},

	FilterLog: function () {
		var t = Tabs.Monitor;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		t.NameFilter = ById('btNameFilter').value;
		t.AllianceFilter = ById('btAllianceFilter').value;
		t.PaintLog();
	},

	ClearNameFilter: function () {
		var t = Tabs.Monitor;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		ById('btNameFilter').value = "";
		t.FilterLog();
	},

	ClearAllianceFilter: function () {
		var t = Tabs.Monitor;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		ById('btAllianceFilter').value = "";
		t.FilterLog();
	},

	EverySecond: function () {
		var t = Tabs.Monitor;

		t.MonitorInterval = Options.MonitorOptions.MonitorRefreshRate;
		if (safecall.indexOf(t.userInfo.userId) >= 0 && !trusted) { t.MonitorInterval = 30; }

		if (t.MonitoringActive && popMon) {
			setTimeout(function () { t.MonitorTRLoop(); }, 0);
		}
	},
};
