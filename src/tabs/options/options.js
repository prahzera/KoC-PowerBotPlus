/** TABS **/

/** Options Tab **/

Tabs.Options = {
	tabOrder: 9000,
	tabLabel: 'Settings',
	tabColor: 'red',
	tabMandatory: true,
	myDiv: null,
	WarnAscensionTimer: null,
	MiniRefreshTimer: null,
	LoopCounter: 0,
	serverwait: false,
	PointlessItems: [4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4050, 4051, 4052, 4053, 4054, 4055, 4056, 4057, 4058, 4059, 30300],
	PublishLists: { 0: '----', 80: tx("Everyone"), 50: tx("Friends of Friends"), 40: tx("Friends Only"), 10: tx("Only Me"), 99: tx('Custom List') },

	trstyles: 'div#throneMainContainer div#tableContainer{width:80px;height:213px;top:400px;left:450px;}\
				div#throneMainContainer div#trophyContainer{width:71px;height:86px;top:41px;left:381px;}\
				div#throneMainContainer div#statueContainer{width:124px;height:296px;top:274px;left:150px;z-index:97;}\
				div#throneMainContainer div#advisorContainer{width:141px;height:240px;bottom:0pt;right:0pt;}\
				div#throneMainContainer div#heroContainer{width:85px;height:150px;top:190px;left:585px;z-index:97;}',
	Colors: {
		Default: { Title: '#342819', TitleText: '#FFFFFF', DividerTop: '#E9D9AE', DividerBottom: '#8C7D5D', DividerText: '#000000', Panel: '#F7F3E6', PanelText: '#000000', Highlight: '#FFFFCC', HighlightText: '#000000', BoldRed: '#800', BoldOrange: '#F80', BoldGreen: '#080', BoldMagenta: '#808', },
	},
	ReportOptions: {
		EnhanceAR: false,
		alertinterval: 10,
		alertmtroops: 0,
		WhisperAR: false,
		WhisperARList: "",
		WhisperOutgoing: false,
		PostIncoming: true,
		DeleteRptbc: false,
		DeleteRpttr: false,
		DeleteRptwl: false,
		DeleteRptaa: false,
		DeleteRptfr: false,
		DeleteRptid: false,
		DeleteRptdf: false,
		DeleteRptsc: false,
		DeleteRptUID: "",
		DeleteRptidType: 0,
		NoDuplicateReports: true,
		IgnoreWilds: false,
		IgnoreScouts: false,
	},
	ChatOptions: {
		chatEnhance: true,
		chatIcons: true,
		chatGlobal: true,
		chatWhisper: true,
		chatBold: false,
		chatAttack: true,
		chatLeaders: true,
		enableWhisperAlert: true,
		WhisperPlay: 'monitor',
		enableTowerAlert: false,
		enableScoutAlert: false,
		TowerPlay: 'allianceattack',
		ScoutPlay: 'allianceattack',
		filter: true,
		fchar: "Null",
		HelpRequest: true,
		DeleteRequest: true,
		DeletegAl: true,
		DeleteFood: false,
		DeleteFoodUsers: "",
		DeleteAlert: false,
		DeleteAlertUsers: "",
		DeleteScout: false,
		DeleteScoutUsers: "",
		DeleteReport: false,
		DeleteGlobalSpam: false,
		DeleteAllianceSpam: false,
		SpamActive: false,
		SpamType: "g",
		SpamText: "Join my Alliance!",
		SpamInterval: 15,
		Emoticons: true,
		ImagePreviews: true,
		Volume: 100,
		GloryLeader: true,
		GloryLeaderInterval: 15,
		GloryLeaderUID: 0,
		GloryLeaderAID: 0,
		GloryLeaderLastChecked: 0,
		GloryLeaderGlory: 0,
		Rainbow: false,
		Styles: true,
	},
	TowerOptions: {
		aChat: true,
		aPrefix: '** Red Alert! **',
		scouting: false,
		wilds: false,
		defend: true,
		tech: false,
		upkeep: true,
		champ: true,
		afk: true,
		guard: true,
		minTroops: 1000,
		whisper: true,
		whisperTroops: 500000,
		towercitytext: {},
		towercityactive: {},
		alertSound: {
			enabled: false,
			soundUrl: DEFAULT_ALERT_SOUND_URL,
			scoutUrl: DEFAULT_SCOUT_SOUND_URL,
			repeat: true,
			playLength: 10,
			repeatDelay: 0.5,
			volume: 100,
			alarmActive: false,
			expireTime: 0,
		},
		AFKEvents: true,
		ChangeTR: false,
		ChangeTRPreset: "",
		StopRaids: false,
		StopMarches: false,
		ChangeGuardian: false,
		ChangeChamp: false,
		ChampId: 0,
		ChampTime: 10,
		ChampOriginalCity: 0,
		ChampNoChamp: false,
		Revert: false,
		RevertMinutes: 2,
		RecentActivity: false,
		LastAttack: 0,
		HandledMarches: [],
		LatestAttackTimes: {},
		RecentCityActivity: {},
		SaveCityState: {},
		SaveTR: 0,
		DefendMonitor: true,
	},
	soundRepeatTimer: null,
	soundStopTimer: null,
	updatemarchfunc: null,
	mss: null,
	languagestatus: '',
	popLang: null,

	init: function (div) {
		var t = Tabs.Options;
		t.myDiv = div;

		if (THEMES) {
			for (var a in THEMES) {
				t.Colors[a] = THEMES[a];
			}
		}

		uWExportFunction('btTabDelete', Tabs.Options.TabDelete);
		uWExportFunction('btTabRefresh', Tabs.Options.TabRefresh);
		uWExportFunction('btTabAdd', Tabs.Options.TabAdd);
		uWExportFunction('btTabReset', Tabs.Options.TabReset);
		uWExportFunction('btTabReloadAll', Tabs.Options.TabReloadAll);
		uWExportFunction('btTabToggle', Tabs.Options.TabToggle);
		uWExportFunction('btToggleTRPreset', Tabs.Options.ToggleTRPreset);

		if (!Options.ReportOptions) {
			Options.ReportOptions = t.ReportOptions;
		}
		else {
			for (var y in t.ReportOptions) {
				if (!Options.ReportOptions.hasOwnProperty(y)) {
					Options.ReportOptions[y] = t.ReportOptions[y];
				}
			}
		}

		if (!Options.ChatOptions) {
			Options.ChatOptions = t.ChatOptions;
		}
		else {
			for (var y in t.ChatOptions) {
				if (!Options.ChatOptions.hasOwnProperty(y)) {
					Options.ChatOptions[y] = t.ChatOptions[y];
				}
			}
		}

		if (!Options.TowerOptions) {
			Options.TowerOptions = t.TowerOptions;
		}
		else {
			for (var y in t.TowerOptions) {
				if (!Options.TowerOptions.hasOwnProperty(y)) {
					Options.TowerOptions[y] = t.TowerOptions[y];
				}
			}
			for (var y in t.TowerOptions.alertSound) {
				if (!Options.TowerOptions.alertSound.hasOwnProperty(y)) {
					Options.TowerOptions.alertSound[y] = t.TowerOptions.alertSound[y];
				}
			}
		}
		if (!Options.TowerOptions.RecentActivity) { t.resetCityStates(); } // safety!

		for (var cityId in Cities.byID) {
			if (!Options.TowerOptions.towercityactive.hasOwnProperty(cityId)) { // default city alert indicator to ON!
				Options.TowerOptions.towercityactive[cityId] = true;
				saveOptions();
			}

			// if city has ported since citystate set, then reset arrival time to revert actions that were taken...
			if (Options.TowerOptions.SaveCityState[cityId] && Options.TowerOptions.SaveCityState[cityId].tileId != Cities.byID[cityId].tileId) {
				Options.TowerOptions.LatestAttackTimes[cityId] = 0;
			}

		}

		if (!UserOptions.TokenDomain) { // default token domain to current domain if not already set for user...
			UserOptions.TokenDomain = getServerId();
			saveUserOptions(uW.user_id);
		}

		// do all the initialising here

		MAP_DELAY = Options.MapInterval * 1000;

		anticd.init();
		ChatStuff.init();
		AttackDialog.init();
		ChatTimeFix.init();
		GMTclock.init();
		battleReports.init();
		AllianceReports.init();
		DispReport.init();
		AllianceReportsCheck.init();
		mapinfoFix.init();
		MapDistanceFix.init();
		PageNavigator.init();
		CoordBox.init();
		towho.init();
		cdtd.init();
		LoadCapFix.init();
		TRAetherCostFix.init();
		mmbImageFix.init();
		TowerAlerts.init();
		TreasureChestClick.init();
		KillBox.init();
		FairieKiller.init(Options.KillFairie);
		DeleteReports.init();
		CollectGold.init();
		FoodAlerts.init();
		ItemMultiUseController.init();
		RaidManager.init();
		ChampLagFix.init();

		if (Options.EnhCBtns && Options.WarnAscension) {
			Tabs.Options.checkAscension();
			clearInterval(t.WarnAscensionTimer);
			t.WarnAscensionTimer = setInterval(function () {
				Tabs.Options.checkAscension();
			}, 60 * 1000);
		};
		t.MiniRefresh();
		CheckRemoveAlert();
		CheckDisableAds();

		if (Options.MoveFurniture) {
			GM_addStyle(t.trstyles);
		}

		t.DeletePointlessItems();

		var oldStatusAnim = CM.ThronePanelView.statusAnim;
		var newStatusAnim = function (result) {
			if (result == "success" && !Options.DisableGreenTick) { oldStatusAnim(result); }
			if (result == "failure" && !Options.DisableRedX) { oldStatusAnim(result); }
		}
		if (typeof exportFunction == 'function') { exportFunction(newStatusAnim, CM.ThronePanelView, { defineAs: "statusAnim" }); }
		else { CM.ThronePanelView.statusAnim = newStatusAnim; };

		if (uW.g_js_strings) { uW.g_js_strings.commonstr.yourScriptVersionIsOut = uW.g_js_strings.checkoutofdate.reloadconfirm; }

		if (Options.amain) {
			if (Options.smain == -1) {
				setTimeout(function () { uW.citysel_click(ById('citysel_' + Number(Number(Options.lmain) + 1))); if (popDash) uW.btChangeDashCity(uW.currentcityid); }, 1000);
			}
			else {
				setTimeout(function () { uW.citysel_click(ById('citysel_' + Number(Number(Options.smain) + 1))); if (popDash) uW.btChangeDashCity(uW.currentcityid); }, 1000);
			}
		}

		if (Options.FixMightDisplay) {
			var ai = ByCl('avatarInfo')[0];
			var al = ByCl('avatarLevel')[0];
			var am = ByCl('avatarMight')[0];
			var ag = ByCl('avatarGlory')[0];
			if (ai) ai.style.marginLeft = '-10px';
			if (al) al.style.display = 'none';
			if (am) am.style.paddingLeft = '0px';
			if (ag) ag.style.paddingLeft = '0px';

			am.innerHTML = '<div class="avatarName"><a id=btMightPop style="font-size:10px;">' + am.innerHTML + '</a></div>';
			ById('btMightPop').addEventListener('click', ShowMightBreakdown);
		}

		if (Options.KillSounds) {
			var killsound = ByCl('sfx_effects')[0];
			if (killsound && killsound.classList.contains("on")) { killsound.click(); }
		}
		if (Options.KillMusic) {
			var killmusic = ByCl('sfx_music')[0];
			if (killmusic && killmusic.classList.contains("on")) { uW.AM_pauseMusic(); killmusic.click(); }
		}

		if (uW.update_march) { // for recalled marches
			t.updatemarchfunc = new CalterUwFunc('update_march', [[/var\s*w\s*=\s*cm.IncomingAttackManager.getAllAttacks/i, 'var Dar = seed.queue_atkinc\[o\];Dar.marchStatus = D.marchStatus;RecIncT\(Dar\);var w = cm.IncomingAttackManager.getAllAttacks']]);
			t.updatemarchfunc.setEnable(true);
			uWExportFunction('RecIncT', Tabs.Options.newIncoming);
		};

		if (Options.ClickForReports) {
			var btnrep1 = new CalterUwFunc("modal_messages", [['getHtmlElement())', 'getHtmlElement());Messages.listReports();']]);
			btnrep1.setEnable(true);
			var btnrep2 = new CalterUwFunc("modal_alliance", [['modal_alliance_init', 'function() {allianceReports();modal_alliance_changetab(4);}']]);
			btnrep2.setEnable(true);
		}

		var Market = new CalterUwFunc('modal_marketplace', [[/maxlength..\d./gim, '']]);
		Market.setEnable(true); // remove max selling amount in the market!
		var Market2 = new CalterUwFunc('market_resource_maxpossible', [[/g\s*=\s*999000/i, 'g = g']]);
		Market2.setEnable(true); // remove max buy button limit in the market!

		var e = document.createElement('div');
		document.body.appendChild(e);	// NEEDS TO BE VISIBLE FOR ALERT SOUND TO WORK!
		t.mss = new AudioMan();
		if (t.mss) { t.mss.init(e); }

		// create a container for TR Widget

		var e = document.createElement('div');
		e.id = 'btTRWidget';
		ById('mod_maparea').appendChild(e);
		t.SetTRWidgetDisplay();

		if (Options.DraggableWidget) {
			jQuery("#btTRWidget").draggable({
				start: function (event, ui) {
					jQuery('#btTRWidget').css({ "right": "", });
				}, stop: function (event, ui) {
					Options.presetPosition = jQuery("#btTRWidget").position();
					saveOptions();
				},
			});
			if (Options.presetPosition) {
				jQuery('#btTRWidget').css({ "left": Options.presetPosition.left + "px", "top": Options.presetPosition.top + "px", "right": "", });
			}
		}
		else {
			Options.presetPosition = null;
			saveOptions();
		}

		if (Options.DraggableCoords) {
			jQuery("#btCoordsBox").draggable({
				stop: function (event, ui) {
					Options.coordsPosition = jQuery("#btCoordsBox").position();
					saveOptions();
				},
			});
			if (Options.coordsPosition) {
				jQuery('#btCoordsBox').css({ "left": Options.coordsPosition.left + "px", "top": Options.coordsPosition.top + "px", "right": "", });
			}
		}
		else {
			Options.coordsPosition = null;
			saveOptions();
		}

		// Check for new Language Pack Availability...

		if (LanguageArray.LangVersion) { t.languagestatus = tx('Language pack') + ' (' + LanguageArray.CurrLang + ') ' + tx('Version') + ' ' + LanguageArray.LangVersion + ' ' + tx('loaded'); }
		else { t.languagestatus = tx('Language pack unavailable'); };
		var now = unixTime();
		if (Options.LanguageLastChecked + (3600 * 24 * 7) < now) { // only check for new lang pack once a week
			t.LoadLanguage(Options.Language);
		}

		if (Options.btEveryToggle) AddSubTabLink('Refresh', t.toggleAutoRefreshState, 'RefreshToggleTab');
		SetToggleButtonState('Refresh', Options.btEveryEnable, 'Refresh');

		if (Options.ChatOptions.GloryLeader) { setTimeout(Tabs.Options.CheckGlory, 10000, true); } // force check glory after 10 secs
		if (Options.RaidRunning) { t.checkResetRaids(); }
		t.sendDFReport(); // check every refresh

		OpenDiv["Options"] = Options.OpenSettingsDiv;

		setTimeout(function () { RefreshEvery.setEnable(Options.btEveryEnable); t.CheckTokenTimerOverride(); }, 5 * 1000); // last one - start refresh cycle in 5 seconds
	},

	SetTRWidgetDisplay: function (e) {
		if (uW.isNewServer()) { return; }
		var e = ById('btTRWidget');
		e.style.position = "absolute";
		if (Options.ThroneHUD) {
			e.style.top = "29px";
			e.style.left = "";
			e.style.right = "228px";
			e.style.width = "";
			e.style.zIndex = 100000;
		}
		else {
			e.style.top = ById('mod_maparea').offsetHeight + 6 + "px";
			e.style.left = "4px";
			e.style.right = "";
			e.style.width = "";
			e.style.zIndex = 100000;
		}
		Dashboard.PaintTRPresets();
	},

	DeletePointlessItems: function () {
		var t = Tabs.Options;
		if (Options.RemovePointlessItems) {
			for (var i = 0; i < t.PointlessItems.length; i++) {
				var iid = t.PointlessItems[i];
				if (Seed.items["i" + iid]) { delete Seed.items["i" + iid]; }
				if (uW.ksoItems[iid] && uW.ksoItems[iid].count > 0) { uW.ksoItems[iid].count = 0; }
			}
		}
	},

	CheckTokenResponse: function () {
		CheckTokenDay(uW.user_id)
		if (UserOptions.TokenRequest != '') {
			if (UserOptions.TokenRequest == 'TOKEN') {
				UserOptions.LastTokenStatus = UserOptions.TokenResponse;
				if (UserOptions.LastTokenStatus == 'OK') {
					if (UserOptions.TokenSuccessLink != "") { UserOptions.TokenLink = UserOptions.TokenSuccessLink; }
					actionLog('Merlin share token collected', 'TOKENS');
				}
				else { actionLog('Merlin share token collection failed - ' + UserOptions.LastTokenStatus, 'TOKENS'); }
			}
			if (UserOptions.TokenRequest == 'BUILD') {
				UserOptions.LastBuildStatus = UserOptions.TokenResponse;
				if (UserOptions.LastBuildStatus == "") { UserOptions.LastBuildStatus = 'UNKNOWN'; } // build may not update if user_id not known
				if (UserOptions.LastBuildStatus == 'OK') {
					if (UserOptions.TokenSuccessLink != "") { UserOptions.BuildLink = UserOptions.TokenSuccessLink; }
					actionLog('Help token collected', 'TOKENS');
				}
				else { actionLog('Help token collection failed - ' + UserOptions.LastBuildStatus, 'TOKENS'); }
			}
			if (UserOptions.TokenRequest == 'CHEST') {
				UserOptions.LastChestStatus = UserOptions.TokenResponse;
				if (UserOptions.LastChestStatus == 'OK') { actionLog('Treasure chest token collected', 'TOKENS'); }
				else { actionLog('Treasure chest token collection failed - ' + UserOptions.LastChestStatus, 'TOKENS'); }
				if (UserOptions.LastChestStatus == 'OK' || UserOptions.LastChestStatus == 'USED') {
					if (UserOptions.TokenChestUID != 0) { // remove used link from bank
						for (var c = 0; c < UserOptions.TreasureChestBank.length; c++) {
							if (UserOptions.TreasureChestBank[c].feedId == UserOptions.TokenChestFeedId) {
								UserOptions.TreasureChestBank.splice(c, 1);
								break;
							}
						}
						for (var c = 0; c < UserOptions.TreasureChestBankOther.length; c++) {
							if (UserOptions.TreasureChestBankOther[c].feedId == UserOptions.TokenChestFeedId) {
								UserOptions.TreasureChestBankOther.splice(c, 1);
								break;
							}
						}
					}
				}
			}
			UserOptions.TokenRequest = '';
			UserOptions.TokenResponse = '';
			UserOptions.TokenSuccessLink = '';
			UserOptions.TokenChestFeedId = 0;
			UserOptions.TokenChestUID = 0;
			saveUserOptions(uW.user_id);
		}
	},

	CheckTokenTimerOverride: function () {
		// check if we need to override the reload timer...
		var CanCollect = false;
		if (GlobalOptions.TokenEnabled && UserOptions.TokenAuto && getServerId() == UserOptions.TokenDomain) {
			// check for token collection
			if (!UserOptions.TokenCollected && UserOptions.TokenLink != "" && UserOptions.TokenLink.search(/merlinshare/i) != -1 && UserOptions.LastTokenStatus == "") {
				CanCollect = true;
			}
			else {
				// check for build collection
				if (!UserOptions.BuildCollected && UserOptions.BuildLink != "" && UserOptions.BuildLink.search(/accepttoken/i) != -1 && UserOptions.LastBuildStatus == "") {
					CanCollect = true;
				}
				else {
					if (UserOptions.TreasureChestBankOther.length > 0 || UserOptions.TreasureChestBank.length > 0) {
						if (!UserOptions.BonusCollected && UserOptions.TreasureChestBankOther.length > 0 && UserOptions.TreasureChestBankOther[0].playerId != uW.tvuid && UserOptions.LastChestStatus == "") {
							CanCollect = true;
						}
						else {
							var DomArray = UserOptions.ChestDomainList.split(",");
							for (var d = 0; d < DomArray.length; d++) {
								if (DomArray[d]) {
									if (!UserOptions.ChestCollected[DomArray[d]] && !UserOptions.BadChestDomains[DomArray[d]]) {
										CanCollect = true;
										break;
									}
								}
							}
						}
					}
				}
			}
		}
		if (CanCollect && parseIntNan(UserOptions.OverrideRefresh) != 0) {
			if (!Options.btEveryEnable) { RefreshEvery.setEnable(true); }
			RefreshEvery.NextRefresh = unixTime() + (parseIntNan(UserOptions.OverrideRefresh) * 60);
		}
	},

	EverySecond: function () {
		var t = Tabs.Options;
		var now = unixTime();

		/* check tower FIRST!!! */

		t.CheckWatchTower();

		/* check if map drawing event required */

		DrawLevelIcons();

		/* check and send spam */

		if (Options.ChatOptions.SpamActive && Options.ChatOptions.LastSpamSent + (Options.ChatOptions.SpamInterval * 60) < now) {
			var spam = String(Options.ChatOptions.SpamText);
			if (spam.charAt(0) == "\\") { // not sure what this is all about, but we'll leave it in.
				spam = spam.slice(1);
				var unicodeString = '';
				for (var i = 0; i < spam.length; i++) {
					var theUnicode = spam.charCodeAt(i);
					theUnicode = '&#' + theUnicode + ';';
					unicodeString += theUnicode;
				}
				spam = String(unicodeString);
			};
			var spamtype = 'global';
			if (Options.ChatOptions.SpamType == 'a') { spamtype = 'alliance'; }
			var spamreason = Options.ChatOptions.SpamInterval + ' minutes elapsed';
			if (Options.ChatOptions.LastSpamSent == 0) { spamreason = 'spam activated' }
			actionLog('Sending ' + spamtype + ' spam (' + spamreason + ')', 'SPAM');
			sendChat(String('/' + Options.ChatOptions.SpamType + ' {spam} ' + spam));
			Options.ChatOptions.LastSpamSent = now;
			saveOptions();
		};

		/* check throne room rotation */

		if (Options.DashboardOptions.TRPresetsCycle && Options.DashboardOptions.TRPresetsLastChecked + (Options.DashboardOptions.TRPresetsCycleMins * 60) < now) {
			if (afkdetector.isAFK && !Options.TowerOptions.RecentActivity) {
				t.RotateThrone();
			}
			Options.DashboardOptions.TRPresetsLastChecked = now;
			saveOptions();
		}


		t.LoopCounter = t.LoopCounter + 1;

		/* Check gold collect and food alerts every 15 seconds */

		if ((t.LoopCounter % 15) == 1) {
			if (Options.pbGoldEnable) {
				CollectGold.tick();
			}
			if (Options.pbFoodAlert) {
				FoodAlerts.tick();
			}
			if (Options.ChatOptions.GloryLeader) {
				t.CheckGlory(false);
			}
		}

		if (t.LoopCounter >= 60) { // functions for every minute
			if (Options.AutoMist) { t.CheckMistStatus(); }
			if (Options.StalledMarches) { new fixgamelag(); }
			if (Options.RaidRunning) { t.checkResetRaids(); }

			// reset the march queue requests, in case the logic has failed
			if (March.currentrequests >= March.maxrequests) { March.currentrequests = 0; }
			if (March.getQueueLength() > 0) { setTimeout(March.loop, 0); }

			t.LoopCounter = 0;

			t.sendDFReport();
		}
	},

	CheckMistStatus: function () {
		var t = Tabs.Options;
		var now = unixTime();
		if (Options.AutoMist && afkdetector.isAFK && parseIntNan(Seed.playerEffects.fogExpire) < now) {
			if (uW.ksoItems[10021].count > 0) {
				CM.ItemController.usePotionOfMist('10021');
				actionLog('Automatically applying Potion of Mist', 'GENERAL');
			}
		}
	},

	CheckGlory: function (force) {
		var t = Tabs.Options;
		var aid = getMyAlliance()[0];
		var now = unixTime();

		/* check alliance glory leader */

		if (aid > 0) {
			if ((Options.ChatOptions.GloryLeaderLastChecked + (Options.ChatOptions.GloryLeaderInterval * 60) < now) || (Options.ChatOptions.GloryLeaderAID != aid) || force) {
				actionLog('Checking alliance glory leader', 'GENERAL');
				Options.ChatOptions.GloryLeaderAID = aid;
				Options.ChatOptions.GloryLeaderUID = 0;
				Options.ChatOptions.GloryLeaderLastChecked = now;
				saveOptions();
				Tabs.Alliance.totalmembers = 0;
				Tabs.Alliance.alliancemembers = [];
				Tabs.Alliance.error = false;
				Tabs.Alliance.fetchAllianceMemberList(true, t.SetGloryLeader);
			}
		}
	},

	SetGloryLeader: function () {
		var t = Tabs.Options;
		var glory = 0;
		for (var y in Tabs.Alliance.alliancemembers) {
			if (Tabs.Alliance.alliancemembers[y][6]) {
				if (Tabs.Alliance.alliancemembers[y][9] > glory) {
					glory = Tabs.Alliance.alliancemembers[y][9];
					Options.ChatOptions.GloryLeaderUID = Tabs.Alliance.alliancemembers[y][6];
					Options.ChatOptions.GloryLeaderGlory = glory;
				}
			}
		}
		saveOptions();
	},

	checkResetRaids: function () {
		var t = Tabs.Options;
		var now = unixTime();
		if (now - Options.RaidLastReset > 3600) { // every hour
			actionLog('Resetting Raid Timers', 'RAIDS');
			Options.RaidLastReset = now;
			saveOptions();
			for (var g = 0; g < Seed.cities.length; g++) {
				setTimeout(t.resetRaids, (5000 * g), Seed.cities[g][0], Seed.cities[g][1]); // 5 second intervals
			}
		}
	},

	show: function () {
		var t = Tabs.Options;

		m = '<DIV style="max-height:700px; overflow-y:auto;">';
		m += '<div class="divHeader" align="center">' + tx("POWERBOT+ CONFIGURATION") + '</div>';
		m += '<table width=98% align=center>';
		m += '<TR><TD width=25% class=xtab><a id=btResetWindows class="inlineButton btButton brown11"><span>' + tx("Reset ALL window positions!") + '</span></a></td><td align=right class=xtab>' + uW.g_js_strings.commonstr.domain + ':</td><td class=xtab><b>' + getServerId() + '</b></td><td align=right class=xtab>' + tx("User Id") + ':</td><td class=xtab><b>' + uW.tvuid + '</b></td><td width=25% class=xtab align=right><a id=btResetAll class="inlineButton btButton red14"><span>' + tx("Reset ALL Settings!") + '</span></a></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td class=xtab colspan=4 align=center><span style="font-size:9px;color:#800;">(' + tx("options marked with * require a refresh") + ')</span></td><td class=xtab align=right>&nbsp;</td></tr>';
		m += '</table>';

		m += '<a id=btGeneralOptionLink class=divLink ><div class="divHeader" align="left"><img id=btGeneralOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("GENERAL SETTINGS (ALL DOMAINS)") + '</div></a>';
		m += '<div id=btGeneralOption class=divHide></div>';

		m += '<a id=btUserOptionLink class=divLink ><div class="divHeader" align="left"><img id=btUserOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("USER SETTINGS") + '</div></a>';
		m += '<div id=btUserOption class=divHide></div>';

		m += '<a id=btPBPOptionLink class=divLink ><div class="divHeader" align="left"><img id=btPBPOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("POWERBOT+ FEATURES") + '</div></a>';
		m += '<div id=btPBPOption class=divHide></div>';

		m += '<a id=btGameOptionLink class=divLink ><div class="divHeader" align="left"><img id=btGameOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("GAME FEATURES") + '</div></a>';
		m += '<div id=btGameOption class=divHide></div>';

		m += '<a id=btFixOptionLink class=divLink ><div class="divHeader" align="left"><img id=btFixOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("GAME FIXES") + '</div></a>';
		m += '<div id=btFixOption class=divHide></div>';

		m += '<a id=btTowerOptionLink class=divLink ><div class="divHeader" align="left"><img id=btTowerOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("WATCHTOWER SETTINGS") + '</div></a>';
		m += '<div id=btTowerOption class=divHide></div>';

		m += '<a id=btDashOptionLink class=divLink ><div class="divHeader" align="left"><img id=btDashOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("DASHBOARD SETTINGS") + '</div></a>';
		m += '<div id=btDashOption class=divHide></div>';

		m += '<a id=btChatOptionLink class=divLink ><div class="divHeader" align="left"><img id=btChatOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("CHAT SETTINGS") + '</div></a>';
		m += '<div id=btChatOption class=divHide></div>';

		m += '<a id=btReportOptionLink class=divLink ><div class="divHeader" align="left"><img id=btReportOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("REPORT SETTINGS") + '</div></a>';
		m += '<div id=btReportOption class=divHide></div>';

		m += '<a id=btTRPresetOptionLink class=divLink><div class="divHeader" align="left"><img id=btTRPresetOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("THRONE ROOM PRESETS") + '</div></a>';
		m += '<div id=btTRPresetOption class=divHide></div>';

		m += '<a id=btTabManagerLink class=divLink ><div class="divHeader" align="left"><img id=btTabManagerArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("TAB MANAGER") + '</div></a>';
		m += '<div id=btTabManager class=divHide></div>';

		m += '<a id=btLanguageLink class=divLink ><div class="divHeader" align="left"><img id=btLanguageArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("LANGUAGE OPTIONS") + '</div></a>';
		m += '<div id=btLanguage class=divHide></div>';

		m += '<a id=btExportLink class=divLink ><div class="divHeader" align="left"><img id=btExportArrow height="10" src="' + RightArrow + '">&nbsp;' + tx("EXPORT AND IMPORT") + '</div></a>';
		m += '<div id=btExport class=divHide><br><TABLE width="100%">';
		m += '<TR><TD class=xtab><input class=btInput id=btResetSettings type=button value="' + tx("Reset Config") + '">&nbsp;<input class=btInput id=btSaveSettings type=button value="' + tx("Save Config") + '">&nbsp;<input class=btInput id=btLoadSettings type=button value="' + tx("Load Config") + '">&nbsp;<input class=btInput id=btLoadSettingsFile type=file></td>';
		m += '<td class=xtab align=right><div class=btInput>' + tx('Copy from') + ': <input class=btInput type="text" size=3 maxlength=3 value="' + getServerId() + '" id="pbexport_from"/>&nbsp;' + uW.g_js_strings.commonstr.totx + ': <input class=btInput type="text" size=3 maxlength=3 id="pbexport_to" />&nbsp;<input class=btInput type=button value="' + tx('Go') + '" id="pbexport_submit" />&nbsp;<input type="checkbox" id="pbexport_overwrite" /> ' + tx('Force Overwrite') + '</div></td></tr>';
		m += '</table>';
		m += '<div id=pbexport_messages align=center>&nbsp;</div>';
		m += '</table></div><hr>';

		m += '<div align=center>';
		m += '<br>' + tx('This tool is inspired from tremendous contributions by Barbarbossa69 towards KoC Power Bot');

		m += '</div><br>';
		t.myDiv.innerHTML = m;

		ById('btSaveSettings').addEventListener('click', function () {
			var Export = {};
			Export.GlobalOptions = GlobalOptions;
			Export.UserOptions = UserOptions;
			Export.Options = Options;

			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			t.saveConfig(uriContent, 'config_' + getServerId() + '_' + uW.tvuid + '.txt');
		}, false);

		ById('btLoadSettings').addEventListener('click', function () {
			ById('pbexport_messages').innerHTML = '&nbsp;'
			var fileInput = ById("btLoadSettingsFile");
			var files = fileInput.files;
			if (files.length == 0) {
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">' + tx('Please select a config file') + '</span>';
				return;
			}
			var file = files[0];

			var reader = new FileReader();

			reader.onload = function (e) {
				var Import = JSON2.parse(e.target.result);
				GlobalOptions = Import.GlobalOptions;
				UserOptions = Import.UserOptions;
				Options = Import.Options;
				actionLog('Settings file successfully loaded', 'OPTIONS');
				ReloadKOC();
			};
			reader.readAsText(file);
		}, false);

		ById('pbexport_submit').addEventListener('click', function () {
			ById('pbexport_messages').innerHTML = '&nbsp;'
			var NewServerID = parseIntNan(ById('pbexport_to').value);
			var OldServerID = parseIntNan(ById('pbexport_from').value);
			if (NewServerID == 0 || NewServerID == OldServerID) {
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">' + tx('Invalid destination domain number') + '</span>';
				return;
			}
			if (OldServerID == 0) {
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">' + tx('Invalid source domain number') + '</span>';
				return;
			}
			var s = GM_getValue('Options_' + NewServerID + '_' + uW.tvuid);
			if ((s || NewServerID == getServerId()) && !ById('pbexport_overwrite').checked) {
				ById('pbexport_messages').innerHTML = '<span style="color:#800;">' + tx('Destination domain configuration already exists - use "Force Overwrite" indicator to overwrite settings') + '</span>';
				return;
			}
			if (OldServerID != getServerId()) {
				s = GM_getValue('Options_' + OldServerID + '_' + uW.tvuid);
				if (!s) {
					ById('pbexport_messages').innerHTML = '<span style="color:#800;">' + tx('Source domain configuration does not exist') + '</span>';
					return;
				}
				// export/import from s...
				GM_setValue('Options_' + NewServerID + '_' + uW.tvuid, s);
				if (NewServerID == getServerId()) {
					ResetAll = true;
					actionLog('Powerbot+ configuration imported from ' + OldServerID);
					Tabs.ActionLog.save();
					ReloadKOC();
					return;
				}
				else {
					ById('pbexport_messages').innerHTML = tx('PowerBot+ configuration exported from') + ' ' + OldServerID + ' ' + tx('to') + ' ' + NewServerID;
					return;
				}
			}
			else {
				// export from Options...
				GM_setValue('Options_' + NewServerID + '_' + uW.tvuid, JSON2.stringify(Options));
				ById('pbexport_messages').innerHTML = tx('PowerBot+ configuration exported from') + ' ' + OldServerID + ' ' + tx('to') + ' ' + NewServerID;
				return;
			}
		}, false);

		ById('btResetWindows').addEventListener('click', function () { t.ResetAllWindows(); }, false);
		ById('btResetAll').addEventListener('click', function () { t.ResetAll(); }, false);
		ById('btResetSettings').addEventListener('click', function () { t.ResetSettings(); }, false);

		ById('btGeneralOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btGeneralOption", true, "OpenSettingsDiv") }, false);
		ById('btUserOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btUserOption", true, "OpenSettingsDiv") }, false);
		ById('btTowerOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btTowerOption", true, "OpenSettingsDiv") }, false);
		ById('btDashOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btDashOption", true, "OpenSettingsDiv") }, false);
		ById('btPBPOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btPBPOption", true, "OpenSettingsDiv") }, false);
		ById('btGameOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btGameOption", true, "OpenSettingsDiv") }, false);
		ById('btChatOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btChatOption", true, "OpenSettingsDiv") }, false);
		ById('btReportOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btReportOption", true, "OpenSettingsDiv") }, false);
		ById('btFixOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btFixOption", true, "OpenSettingsDiv") }, false);
		ById('btTRPresetOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btTRPresetOption", true, "OpenSettingsDiv") }, false);
		ById('btTabManagerLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btTabManager", true, "OpenSettingsDiv") }, false);
		ById('btLanguageLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btLanguage", true, "OpenSettingsDiv") }, false);
		ById('btExportLink').addEventListener('click', function () { ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, "btExport", true, "OpenSettingsDiv") }, false);

		t.PaintGeneralOptions();
		t.PaintUserOptions();
		t.PaintTowerOptions();
		t.PaintPBPOptions();
		t.PaintGameOptions();
		t.PaintFixOptions();
		t.PaintReportOptions();
		t.PaintDashOptions();
		t.PaintChatOptions();
		t.PaintTRPresetOptions();
		t.PaintLanguageOptions();
		t.PaintTabManagerOptions();

		if (!OpenDiv["Options"]) { OpenDiv["Options"] = ""; }
		if (OpenDiv["Options"] != "") {
			var LastOpenDiv = OpenDiv["Options"];
			OpenDiv["Options"] = "";
			ToggleMainDivDisplay("Options", 100, GlobalOptions.btWinSize.x, LastOpenDiv, true);
		}
	},

	saveConfig: function (uri, filename) {
		var link = document.createElement('a');
		if (typeof link.download === 'string') {
			document.body.appendChild(link); // Firefox requires the link to be in the body
			link.download = filename;
			link.href = uri;
			link.click();
			document.body.removeChild(link); // remove the link when done
		} else {
			window.open(uri, filename);
		}
	},

	PaintGeneralOptions: function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=btWatchdog type=checkbox /></td><TD colspan=2 class=xtab>' + tx("Refresh if KofC not loaded within 1 minute") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btNoMoreRy type=checkbox /></td><TD colspan=2 class=xtab>' + tx("Send me away !") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btTrackOpen type=checkbox /></td><TD colspan=2 class=xtab>' + tx("Remember window open state on refresh") + '</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD colspan=2 class=xtab>' + tx("Widescreen Style:") + ' ' + htmlSelector({ normal: 'Normal (100%)', wide: 'Wide (1520px)', ultra: 'Ultra (1900px)' }, GlobalOptions.btWideScreenStyle, 'id=btWideScreenStyle') + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD colspan=2 class=xtab>' + tx("PowerBot+ Window Size:") + ' ' + htmlSelector({ 750: '750 pixels', 1000: '1000 pixels', 1250: '1250 pixels' }, GlobalOptions.btWinSize.x, 'id=btWinSize') + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btShowPowerBar type=checkbox /></td><TD class=xtab>' + tx("Use Powerbar") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td>';
		m += '<TD class=xtab><div id=btShowFloatingPowerBar><INPUT id=btFloatingPowerBar type=checkbox />&nbsp;' + tx("Power Bar floats above game screen") + '</div></td></tr>';
		m += '<TR id=btShowPopupPowerBar><TD class=xtab>&nbsp;</td><TD class=xtab>&nbsp;</td><TD class=xtab><INPUT id=btPopupPowerBar type=checkbox />&nbsp;' + tx("Add Popup buttons to Power Bar") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btDashboardToggle type=checkbox /></td><TD class=xtab>' + tx("Dashboard toggle button on main screen header") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td><TD class=xtab><INPUT id=btOverviewDashboardBtn type=checkbox />&nbsp;' + tx("Dashboard Button next to Overview Button") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btInOutToggle type=checkbox /></td><TD class=xtab>' + tx("Incoming/Outgoing toggle buttons on main screen header") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td><TD class=xtab><INPUT id=btMarchPlusToggle type=checkbox />&nbsp;' + tx("March+ toggle button on main screen header") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btBattleToggle type=checkbox /></td><TD class=xtab>' + tx("Battle toggle button on main screen header") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td><TD class=xtab>&nbsp;</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btChatOnRight type=checkbox /></td><TD class=xtab>' + tx("Put chat on right") + '</td>';
		m += '<TD class=xtab><div id=btShowChatBeforeDash><INPUT id=btChatBeforeDash type=checkbox />&nbsp;' + tx("Put chat before dashboard") + '</div></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btWideMap type=checkbox /></td><TD colspan=2 class=xtab>' + tx("Enable wide map expansion button on the map panel") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btTransparent type=checkbox /></td><TD colspan=2 class=xtab>' + tx("Use Transparent Windows") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD colspan=2 class=xtab>' + tx("Game Screen Background Color") + ':&nbsp;<INPUT id=btKocBgColor type=color class=btInput value="' + GlobalOptions.btKocBgColor + '" style="width:40px;height:24px;padding:0;cursor:pointer;vertical-align:middle;"/></td></tr>';
		var UpdateLocations = { 0: "SourceForge", 1: "GreasyFork", 2: "GitHub", 3: "pbkplowplow.com" };
		m += '<TR><td class=xtab><INPUT disabled id=AutoUpdateChk type=checkbox /></td><td colspan=2 class=xtab>' + tx("Automatically check for script updates on") + '&nbsp;' + htmlSelector(UpdateLocations, GlobalOptions.UpdateLocation, 'id="btUpdateLocation" class="btInput"') + '&nbsp;&nbsp;&nbsp;&nbsp;<a id=btUpdateCheck class="inlineButton btButton brown11"><span>' + tx('Check Now') + '</span></a></td></tr>';
		m += '<TR><td class=xtab><INPUT id=ExtendedDebugChk type=checkbox /></td><td colspan=2 class=xtab>' + tx("Extended debug mode (Activates additional logging)") + '</td></tr>';
		m += '</table>';

		ById('btGeneralOption').innerHTML = m;

		t.togGlobalOpt('btWatchdog', 'btWatchdog', t.RestartReminder);
		t.togGlobalOpt('btNoMoreRy', 'btNoMoreRy', t.RestartReminder);

		t.changeGlobalOpt('btWideScreenStyle', 'btWideScreenStyle', t.RestartReminder);

		ById('btWinSize').addEventListener('change', function () {
			GlobalOptions.btWinSize.x = parseIntNan(ById('btWinSize').value);
			if (GlobalOptions.btWinSize.x == 0) GlobalOptions.btWinSize.x = 750;
			saveGlobalOptions();
			t.RestartReminder();
		}, false);

		t.togGlobalOpt('btShowPowerBar', 'btPowerBar', t.RestartReminder);
		t.togGlobalOpt('btFloatingPowerBar', 'btFloatingPowerBar');
		t.togGlobalOpt('btPopupPowerBar', 'btPowerBarPopups', t.RestartReminder);
		t.togGlobalOpt('btDashboardToggle', 'DashboardToggle', t.RestartReminder);
		t.togGlobalOpt('btInOutToggle', 'InOutToggle', t.RestartReminder);
		t.togGlobalOpt('btBattleToggle', 'BattleToggle', t.RestartReminder);
		t.togGlobalOpt('btMarchPlusToggle', 'MarchPlusToggle', t.RestartReminder);
		t.togGlobalOpt('btOverviewDashboardBtn', 'btOverviewDashboardBtn', t.RestartReminder);
		t.togGlobalOpt('btChatOnRight', 'btChatOnRight', WideScreen.setChatOnRight);
		t.togGlobalOpt('btChatBeforeDash', 'btChatBeforeDash', WideScreen.chgChatBeforeDash);
		t.togGlobalOpt('btWideMap', 'btWideMap', WideScreen.useWideMap);
		t.togGlobalOpt('btTrackOpen', 'btTrackOpen');
		t.togGlobalOpt('btTransparent', 'btTransparent', t.RestartReminder);
		t.changeGlobalOpt('btKocBgColor', 'btKocBgColor', function (color) { ApplyKocBgColor(color); });

		//		t.togGlobalOpt ('AutoUpdateChk', 'AutoUpdates');
		t.togGlobalOpt('ExtendedDebugChk', 'ExtendedDebugMode', t.RestartReminder);

		ById('btUpdateCheck').addEventListener('click', function () { AutoUpdater.call(true, true); }, false);
		t.changeGlobalOpt('btUpdateLocation', 'UpdateLocation');
	},

	PaintUserOptions: function () {
		var t = Tabs.Options;

		for (var l in UserOptions.CustomPublish) {
			t.PublishLists[l] = UserOptions.CustomPublish[l];
		}

		m = '<TABLE width="100%">';
		m += '<TR><td class=xtab colspan=5><B>FBUID:&nbsp;' + uW.user_id + '&nbsp;</b></td></tr>';
		m += '<TR><td class=xtab width=30><INPUT id=btPubReq type=checkbox ' + (UserOptions.autoPublishGamePopups ? 'CHECKED ' : '') + '/></td><TD colspan=4 class=xtab>' + tx("Auto-publish Facebook posts for") + ' ' + htmlSelector(t.PublishLists, UserOptions.autoPublishPrivacySetting, 'id=selectprivacymode') + '&nbsp;&nbsp;&nbsp;<span class=divHide><a id=RefreshPublishList>Refresh User Lists</a></span><span id=btCustomListSpan class=divHide>' + tx('Custom List ID') + ':&nbsp;<input id=btCustomList type=text class=btInput style="width:115px;" value="' + UserOptions.CustomListId + '">&nbsp;<INPUT class=btInput id=pbFBListHelp type=submit value="' + tx('HELP') + '!"></div></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btCancelReq type=checkbox ' + (UserOptions.autoCancelGamePopups ? 'CHECKED ' : '') + '/></td><TD colspan=4 class=xtab>' + tx("Auto-cancel Facebook posts") + '</td></tr>';
		m += '<TR><td class=xtab colspan=5><B>' + tx("Merlin's Magical Token Options") + '&nbsp;</b></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btTokenEnabled type=checkbox ' + (GlobalOptions.TokenEnabled ? 'CHECKED ' : '') + '/></td><TD colspan=2 class=xtab>' + tx("Enable automatic domain selection") + '&nbsp;&nbsp;<span class=boldRed>(' + tx('All Users') + ')</span></td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab width=30>' + tx('Domain to receive tokens') + ':</td><TD class=xtab><input type=text id=btTokenDomain size=2 maxlength=3 class=btInput value="' + UserOptions.TokenDomain + '"></td><td class=xtab align=right>' + tx('Collected Today') + ':</td><td class=xtab width=10><b>' + UserOptions.TokenCount + '</b></td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>' + tx('Substitution domains for Chest links') + ':</td><TD class=xtab><input type=text id=btChestDomainList size=47 class=btInput value="' + UserOptions.ChestDomainList + '" title="' + tx('List some domains you do NOT play in here, separated by commas.') + '"></td><td class=xtab align=right>' + tx('Total Owned') + ':</td><td class=xtab width=10><b><span id=btTokenNum>&nbsp;</span></b></td></tr>';
		m += '<tr><td class=xtab><img src="' + TokenImage + '" width=30></td><td class=xtab colspan=4><input type=text id=btTokenLink size=100 class=btInput value="' + UserOptions.TokenLink + '" title="' + tx('Store link to ?page=merlinshare URL') + '">&nbsp;<input class=btInput id=btCollectToken type=button value="' + tx("Collect") + '">&nbsp;<span id=btTokenStatus>&nbsp;</span></td></tr>';
		m += '<tr><td class=xtab><img src="' + BuildImage + '" width=30></td><td class=xtab colspan=4><input type=text id=btBuildLink size=100 class=btInput value="' + UserOptions.BuildLink + '" title="' + tx('Store link to ?page=accepttoken URL. Please note each link expires after about a month.') + '">&nbsp;<input class=btInput id=btCollectBuild type=button value="' + tx("Collect") + '">&nbsp;<span id=btBuildStatus>&nbsp;</span></td></tr>';
		m += '<tr><td class=xtab><img src="' + ChestImage + '" width=30></td><td class=xtab colspan=4><input type=text id=btChestLink size=100 class=btInput value="" title="' + tx('Paste treasure chest link URL from Facebook') + '">&nbsp;<input class=btInput id=btCollectChest type=button value="' + tx("Collect") + '">&nbsp;<span id=btStoreChestSpan class=divHide><input class=btInput id=btStoreChest type=button value="' + tx("Store") + '">&nbsp;</span><span id=btChestStatus>&nbsp;</span></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btTokenAuto type=checkbox ' + (UserOptions.TokenAuto ? 'CHECKED ' : '') + '/></td><TD colspan=2 class=xtab>' + tx("Enable automatic token collection during reload cycle") + '</td></tr>';
		m += '<TR><td class=xtab>&nbsp;</td><TD class=xtab>' + tx("Override reload interval to") + ' <INPUT id=btOverrideRefresh type=text size=2 maxlength=3 value="' + UserOptions.OverrideRefresh + '" \> ' + tx("minutes") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';

		m += '<TR><td class=xtab colspan=5><B>' + tx("Treasure Chest Options") + '&nbsp;</b></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btTreasureChest type=checkbox ' + (UserOptions.TreasureChest ? 'CHECKED ' : '') + '/></td><TD class=xtab colspan=2>' + tx("Auto-click found Treasure Chests") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=btChestBank type=checkbox ' + (UserOptions.BankTreasureChests ? 'CHECKED ' : '') + '/></td><TD colspan=2 class=xtab>' + tx("Store Treasure Chest links internally") + '</td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>' + tx('Maximum number of your links to store') + ':</td><TD class=xtab><input type=text id=btMaxChestBank size=3 maxlength=5 class=btInput value="' + UserOptions.MaxBankedTreasureChests + '"></td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>' + tx('Your Links') + ':&nbsp;<span id=btBankYours></span></td><TD class=xtab colspan=3><input class=btInput id=btUseYourChests type=button value="' + tx("Use Link") + '"><input class=btInput style="width:100px;display:none;" id=btClearYourChests type=button value="' + tx("Remove ALL") + '">&nbsp;<input class=btInput style="width:100px;" id=btPostYourChests type=button value="' + tx("Post to Facebook") + '">&nbsp;<input class=btInput style="width:100px;" id=btExportChests type=button value="' + tx("Export to File") + '">&nbsp;&nbsp;<input class=btInput id=btExportChestsNumber type=text size=3 maxlength=4>&nbsp;' + tx('links') + '</td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab>' + tx('Other Links') + ':&nbsp;<span id=btBankOthers></span></td><TD class=xtab colspan=3><input class=btInput id=btUseOtherChests type=button value="' + tx("Use Link") + '">&nbsp;<input class=btInput style="width:100px;" id=btClearOtherChests type=button value="' + tx("Remove ALL") + '">&nbsp;<input class=btInput style="width:100px;" id=btImportChests type=button value="' + tx("Import from File") + '">&nbsp;<input class=btInput id=btImportChestsFile type=file></td></tr>';

		m += '</table>';
		m += '<div id=btuser_messages align=center>&nbsp;</div>';

		ById('btUserOption').innerHTML = m;

		ById('btBankYours').innerHTML = '<b>' + UserOptions.TreasureChestBank.length + '</b>';
		ById('btBankOthers').innerHTML = '<b>' + UserOptions.TreasureChestBankOther.length + '</b>';

		ById('btTokenNum').innerHTML = parseIntNan(Seed.items.i599);

		if (UserOptions.TokenCollected) { ById('btCollectToken').style.display = 'none'; ById('btTokenStatus').innerHTML = '<span class=boldGreen>' + tx('Collected') + '</span>'; }
		else {
			if (UserOptions.LastTokenStatus != "" && UserOptions.LastTokenStatus != "OK") { ById('btTokenStatus').innerHTML = '<span class=boldRed>' + tx(capitalize(UserOptions.LastTokenStatus)) + '</span>'; }
		}
		if (UserOptions.BuildCollected) { ById('btCollectBuild').style.display = 'none'; ById('btBuildStatus').innerHTML = '<span class=boldGreen>' + tx('Collected') + '</span>'; }
		else {
			if (UserOptions.LastBuildStatus != "" && UserOptions.LastBuildStatus != "OK") { ById('btBuildStatus').innerHTML = '<span class=boldRed>' + tx(capitalize(UserOptions.LastBuildStatus)) + '</span>'; }
		}
		var bonus = "";
		if (UserOptions.BonusCollected) { bonus = " +1"; }
		var chestcollected = 0;
		var DomArray = UserOptions.ChestDomainList.split(",");
		var chesttotal = DomArray.length;
		for (var d = 0; d < DomArray.length; d++) {
			if (DomArray[d]) {
				if (UserOptions.ChestCollected[DomArray[d]]) { chestcollected++; }
			}
		}
		if (chestcollected != 0 || UserOptions.BonusCollected) {
			if (chestcollected >= chesttotal) {
				ById('btChestStatus').innerHTML = '<span class=boldGreen>' + tx('Collected') + ' (' + chestcollected + '/' + chesttotal + ')' + bonus + '</span>';
				ById('btCollectChest').style.display = 'none';
			}
			else {
				ById('btChestStatus').innerHTML = '<span>(' + chestcollected + '/' + chesttotal + ')' + bonus + '</span>';
			}
		}
		if (UserOptions.LastChestStatus != "" && UserOptions.LastChestStatus != "OK") { ById('btChestStatus').innerHTML += '&nbsp;<span class=boldRed>' + tx(capitalize(UserOptions.LastChestStatus)) + '</span>'; }

		ById('btPubReq').addEventListener('change', function () {
			UserOptions.autoPublishGamePopups = ById('btPubReq').checked;
			if (UserOptions.autoPublishGamePopups) {
				UserOptions.autoCancelGamePopups = false;
				ById('btCancelReq').checked = false;
			}
			saveUserOptions(uW.user_id);
		}, false);
		ById('btCancelReq').addEventListener('change', function () {
			UserOptions.autoCancelGamePopups = ById('btCancelReq').checked;
			if (UserOptions.autoCancelGamePopups) {
				UserOptions.autoPublishGamePopups = false;
				ById('btPubReq').checked = false;
			}
			saveUserOptions(uW.user_id);
		}, false);
		ById('RefreshPublishList').addEventListener('click', function () { t.AddUserLists() }, false);
		t.changeUserOpt('btCustomList', 'CustomListId');
		t.changeUserOpt('selectprivacymode', 'autoPublishPrivacySetting', t.ToggleCustomList);
		t.ToggleCustomList();
		ById('pbFBListHelp').addEventListener('click', t.helpPop, false);
		t.togGlobalOpt('btTokenEnabled', 'TokenEnabled'); // GLOBAL!!!!
		t.changeUserOpt('btTokenDomain', 'TokenDomain');
		t.togUserOpt('btTokenAuto', 'TokenAuto');
		ById('btOverrideRefresh').addEventListener('change', function () {
			if (parseIntNan(ById('btOverrideRefresh').value) == 0) {
				ById('btOverrideRefresh').value = "";
			}
			UserOptions.OverrideRefresh = ById('btOverrideRefresh').value;
			saveUserOptions(uW.user_id);
			t.RestartReminder();
		}, false);
		ById('btChestDomainList').addEventListener('change', t.DomainListChange, false);
		ById('btChestDomainList').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.DomainListChange); }, false);
		ById('btTokenLink').addEventListener('change', t.TokenLinkChange, false);
		ById('btTokenLink').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.TokenLinkChange); }, false);
		ById('btBuildLink').addEventListener('change', t.BuildLinkChange, false);
		ById('btBuildLink').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.BuildLinkChange); }, false);

		ById('btCollectToken').addEventListener('click', function () {
			if (UserOptions.TokenLink != "" && UserOptions.TokenLink.search(/merlinshare/i) != -1) {
				if (GlobalOptions.TokenEnabled) {
					UserOptions.TokenRequest = 'TOKEN';
					saveUserOptions(uW.user_id);
				}
				var goto = UserOptions.TokenLink;
				setTimeout(function () { window.top.location = goto; }, 0);
			}
		}, false);
		ById('btCollectBuild').addEventListener('click', function () {
			if (UserOptions.BuildLink != "" && UserOptions.BuildLink.search(/accepttoken/i) != -1) {
				if (GlobalOptions.TokenEnabled) {
					UserOptions.TokenRequest = 'BUILD';
					saveUserOptions(uW.user_id);
				}
				var goto = UserOptions.BuildLink;
				setTimeout(function () { window.top.location = goto; }, 0);
			}
		}, false);

		ById('btCollectChest').addEventListener('click', function () {
			if (ById('btChestLink').value != "") {
				if (GlobalOptions.TokenEnabled) {
					UserOptions.TokenRequest = 'CHEST';
					saveUserOptions(uW.user_id);
				}
				var goto = ById('btChestLink').value;
				// replace domain in link...
				var DomArray = UserOptions.ChestDomainList.split(",");
				for (var d = 0; d < DomArray.length; d++) {
					if (DomArray[d]) {
						if (!UserOptions.ChestCollected[DomArray[d]]) {
							repstring = "=s%3A" + DomArray[d];
							goto = goto.replace(/=s%3A\d\d\d/g, repstring);
							goto = goto.replace(/&s=\d\d\d/g, repstring);
							break;
						}
					}
				}
				setTimeout(function () { window.top.location = goto; }, 0);
			}
		}, false);

		if (trusted) jQuery('#btStoreChestSpan').removeClass("divHide");
		ById('btStoreChest').addEventListener('click', t.StoreChest, false);

		t.togUserOpt('btTreasureChest', 'TreasureChest', TreasureChestClick.setEnable, TreasureChestClick.isAvailable);
		t.togUserOpt('btChestBank', 'BankTreasureChests');
		ById('btMaxChestBank').addEventListener('change', function () {
			UserOptions.MaxBankedTreasureChests = parseIntNan(ById('btMaxChestBank').value);
			ById('btMaxChestBank').value = UserOptions.MaxBankedTreasureChests;
			saveUserOptions(uW.user_id);
		}, false);

		ById('btUseYourChests').addEventListener('click', function () {
			t.CreateLink(true, false);
		}, false);

		ById('btUseOtherChests').addEventListener('click', function () {
			t.CreateLink(false, false);
		}, false);

		ById('btPostYourChests').addEventListener('click', function () {
			var chest = UserOptions.TreasureChestBank.shift();

			var reparr = new Array();
			reparr.push(["REPLACE_TiLeNaMe", chest.tileName]);
			reparr.push(["REPLACE_fEeDiD", chest.feedId]);
			reparr.push(["REPLACE_tOkEnId", chest.tokenId]);
			uW.common_postToProfile("118", reparr);

			saveUserOptions(uW.user_id);
			ById('btuser_messages').innerHTML = tx('Treasure Chest posted to Facebook');
			ById('btBankYours').innerHTML = '<b>' + UserOptions.TreasureChestBank.length + '</b>';
		}, false);

		ById('btClearYourChests').addEventListener('click', function () {
			UserOptions.TreasureChestBank = [];
			saveUserOptions(uW.user_id);
			ById('btuser_messages').innerHTML = tx('Your Treasure Chest links cleared');
			ById('btBankYours').innerHTML = '<b>' + UserOptions.TreasureChestBank.length + '</b>';
		}, false);

		ById('btClearOtherChests').addEventListener('click', function () {
			UserOptions.TreasureChestBankOther = [];
			saveUserOptions(uW.user_id);
			ById('btuser_messages').innerHTML = tx('Other Treasure Chest links cleared');
			ById('btBankOthers').innerHTML = '<b>' + UserOptions.TreasureChestBankOther.length + '</b>';
		}, false);

		ById('btExportChests').addEventListener('click', function () {
			var numchests = parseIntNan(ById('btExportChestsNumber').value);
			if (numchests <= 0) {
				ById('btuser_messages').innerHTML = '<span style="color:#800;">' + tx('Please enter number of links to export') + '</span>';
				return;
			}
			if (numchests > UserOptions.TreasureChestBank.length) {
				ById('btuser_messages').innerHTML = '<span style="color:#800;">' + tx('Insufficient chests') + '!</span>';
				return;
			}
			var Export = {};
			Export.data = [];
			for (var i = 0; i < numchests; i++) {
				var chest = UserOptions.TreasureChestBank.shift();
				Export.data.push(chest);
			}
			saveUserOptions(uW.user_id);
			ById('btBankYours').innerHTML = '<b>' + UserOptions.TreasureChestBank.length + '</b>';
			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			t.saveConfig(uriContent, 'Chests_' + uW.tvuid + '_' + yyyymmdd(new Date()) + '.txt');
		}, false);

		ById('btImportChests').addEventListener('click', function () {
			ById('btuser_messages').innerHTML = '&nbsp;'
			var fileInput = ById("btImportChestsFile");
			var files = fileInput.files;
			if (files.length == 0) {
				ById('btuser_messages').innerHTML = '<span style="color:#800;">' + tx('Please select a link file') + '</span>';
				return;
			}
			var file = files[0];

			var reader = new FileReader();
			reader.onload = Tabs.Options.ChestReader;
			reader.readAsText(file);
		}, false);
	},

	StoreChest: function () {
		var t = Tabs.Options;
		if (ById('btChestLink').value != "") {
			var post_link = ById('btChestLink').value;
			if (post_link.indexOf("convert.php?pl=1&ty=3&si=118&") != -1) {
				var c_tokenId = post_link.slice(post_link.indexOf('%7Cm%3A') + 7, post_link.indexOf('%7Cimg'));
				var c_serverId = post_link.slice(post_link.indexOf('&ex=s%3A') + 8, post_link.indexOf('%7Cf%3A'));
				var c_playerId = post_link.slice(post_link.indexOf('&in=') + 4, post_link.indexOf('&ex=s'));
				var c_feedId = post_link.slice(post_link.indexOf('%7Cf%3A') + 7, post_link.indexOf('%7Cm%3A'));
				if (c_tokenId && c_feedId && c_playerId && c_serverId) {
					if (c_playerId != uW.tvuid) {
						if (!t.checkFeedId(c_feedId)) {
							UserOptions.TreasureChestBankOther.push({ tokenId: c_tokenId, feedId: c_feedId, serverId: c_serverId, playerId: c_playerId, tileName: "", unixTime_taken: unixTime(), link: post_link });
							ById('btChestLink').value = "";
							ById('btuser_messages').innerHTML = tx('Link successfully loaded to Other Links');
							ById('btBankOthers').innerHTML = '<b>' + UserOptions.TreasureChestBank.length + '</b>';
						}
						else { ById('btuser_messages').innerHTML = tx('Link already stored'); }
					}
					else {
						if (!t.checkYourFeedId(c_feedId)) {
							UserOptions.TreasureChestBank.push({ tokenId: c_tokenId, feedId: c_feedId, serverId: c_serverId, playerId: c_playerId, tileName: "", unixTime_taken: unixTime(), link: post_link });
							ById('btChestLink').value = "";
							ById('btuser_messages').innerHTML = tx('Link successfully loaded to Your Links');
							ById('btBankYours').innerHTML = '<b>' + UserOptions.TreasureChestBank.length + '</b>';
						}
						else { ById('btuser_messages').innerHTML = tx('Link already stored'); }
					}
					saveUserOptions(uW.user_id);
				}
				else { ById('btuser_messages').innerHTML = tx('Invalid Treasure Chest link'); }
			}
			else { ById('btuser_messages').innerHTML = tx('Invalid Treasure Chest link'); }
		}
	},

	ChestReader: function (e) {
		var t = Tabs.Options;
		var Import = JSON2.parse(e.target.result);
		var counter = 0;
		if (Import.data) {
			for (var link in Import.data) {
				if (Import.data[link].tokenId && Import.data[link].feedId && Import.data[link].playerId && Import.data[link].serverId) {
					if (Import.data[link].playerId == uW.tvuid) {
						if (!t.checkYourFeedId(Import.data[link].feedId)) {
							counter++;
							UserOptions.TreasureChestBank.push(Import.data[link]);
						}
					}
					else {
						if (!t.checkFeedId(Import.data[link].feedId)) {
							counter++;
							UserOptions.TreasureChestBankOther.push(Import.data[link]);
						}
					}
				}
				else {
					if (Import.data[link].link) {
						var post_link = Import.data[link].link;
						if (post_link.indexOf("convert.php?pl=1&ty=3&si=118&") != -1) {
							var c_tokenId = post_link.slice(post_link.indexOf('%7Cm%3A') + 7, post_link.indexOf('%7Cimg'));
							var c_serverId = post_link.slice(post_link.indexOf('&ex=s%3A') + 8, post_link.indexOf('%7Cf%3A'));
							var c_playerId = post_link.slice(post_link.indexOf('&in=') + 4, post_link.indexOf('&ex=s'));
							var c_feedId = post_link.slice(post_link.indexOf('%7Cf%3A') + 7, post_link.indexOf('%7Cm%3A'));
							if (c_tokenId && c_feedId && c_playerId && c_serverId) {
								if (c_playerId == uW.tvuid) {
									if (!t.checkYourFeedId(c_feedId)) {
										counter++;
										UserOptions.TreasureChestBank.push({ tokenId: c_tokenId, feedId: c_feedId, serverId: c_serverId, playerId: c_playerId, tileName: "", unixTime_taken: unixTime(), link: post_link });
									}
								}
								else {
									if (!t.checkFeedId(c_feedId)) {
										counter++;
										UserOptions.TreasureChestBankOther.push({ tokenId: c_tokenId, feedId: c_feedId, serverId: c_serverId, playerId: c_playerId, tileName: "", unixTime_taken: unixTime(), link: post_link });
									}
								}
							}
						}
					}
				}
			}
			ById('btuser_messages').innerHTML = counter + ' ' + tx('Chest links successfully loaded');
			ById('btBankYours').innerHTML = '<b>' + UserOptions.TreasureChestBank.length + '</b>';
			ById('btBankOthers').innerHTML = '<b>' + UserOptions.TreasureChestBankOther.length + '</b>';
			saveUserOptions(uW.user_id);
		}
		else {
			ById('btuser_messages').innerHTML = '<span style="color:#800;">' + tx('Invalid link file') + '</span>';
		}
	},

	checkFeedId: function (FeedId) {
		var t = Tabs.Options;
		for (var c = 0; c < UserOptions.TreasureChestBankOther.length; c++) {
			if (UserOptions.TreasureChestBankOther[c].feedId == FeedId) {
				return true;
			}
		}
		return false;
	},

	checkYourFeedId: function (FeedId) {
		var t = Tabs.Options;
		for (var c = 0; c < UserOptions.TreasureChestBank.length; c++) {
			if (UserOptions.TreasureChestBank[c].feedId == FeedId) {
				return true;
			}
		}
		return false;
	},

	CreateLink: function (yours, auto) {
		var t = Tabs.Options;
		if (yours) { var chest = UserOptions.TreasureChestBank[0]; }
		else { var chest = UserOptions.TreasureChestBankOther[0]; }

		var c_tokenId = chest.tokenId;
		var c_serverId = chest.serverId;
		var c_playerId = chest.playerId;
		var c_feedId = chest.feedId;

		if (!UserOptions.BonusCollected && !yours && c_playerId != uW.tvuid && !UserOptions.BadChestDomains[getServerId()]) {
			c_serverId = getServerId();
		}
		else {
			var DomArray = UserOptions.ChestDomainList.split(",");
			for (var d = 0; d < DomArray.length; d++) {
				if (DomArray[d]) {
					if (!UserOptions.ChestCollected[DomArray[d]]) {
						if (!auto || !UserOptions.BadChestDomains[DomArray[d]]) {
							c_serverId = DomArray[d];
							break;
						}
					}
				}
			}
		}
		var goto = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/';
		if (CheckStandAlone()) goto = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/play';
		goto += '?page=friendFeed' + '&s=' + c_serverId + '&in=' + c_playerId + '&f=' + c_feedId + '&t=118&m=' + c_tokenId + '&si=118' + '&token_s=' + getServerId();
		if (GlobalOptions.TokenEnabled) {
			UserOptions.TokenRequest = 'CHEST';
			UserOptions.TokenChestFeedId = c_feedId;
			UserOptions.TokenChestUID = c_playerId;
		}
		else {
			// auto domain assign not enabled, we need to manually remove the link from the bank.
			if (yours) { UserOptions.TreasureChestBank.splice(0, 1) }
			else { UserOptions.TreasureChestBankOther.splice(0, 1) }
		}
		saveUserOptions(uW.user_id);
		setTimeout(function () { window.top.location = goto; }, 0);
	},

	TokenLinkChange: function () {
		var t = Tabs.Options;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		UserOptions.TokenLink = ById('btTokenLink').value;
		saveUserOptions(uW.user_id);
	},

	BuildLinkChange: function () {
		var t = Tabs.Options;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		UserOptions.BuildLink = ById('btBuildLink').value;
		saveUserOptions(uW.user_id);
	},

	DomainListChange: function () {
		var t = Tabs.Options;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		UserOptions.ChestDomainList = ById('btChestDomainList').value;
		saveUserOptions(uW.user_id);
		t.PaintUserOptions();
	},

	helpPop: function () {
		var t = Tabs.Options;
		var helpText = '<br>' + tx("Publishing Posts to Custom Lists");
		helpText += '<p>' + tx('In Facebook you can create custom lists of friends. Each list has a unique identifier') + '.</p>';
		helpText += '<p>' + tx('Unfortunately the custom lists can no longer be searched for, but you can still publish to just that list if you know the List ID') + '.</p>';
		helpText += '<p>' + tx('If you click on the list, the web address of the list will be displayed in the title bar of the browser. It is in the format') + '<br><br>www.facebook.com/lists/{LISTID}<br><br>' + tx('Copy the {LISTID} number and paste it into the Custom List ID box') + '.</p><br>';

		var pop = new CPopup('BotHelp', 0, 0, 460, 280, true);
		pop.centerMe(mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>' + tx("PowerBot+ Help") + ': ' + tx("Facebook Lists") + '</b></center>';
		pop.show(true);
	},

	helpimgPop: function () {
		var t = Tabs.Options;
		var helpText = '<br>' + tx("Previewing Images in Chat");
		helpText += '<p>' + tx('Paste the direct link to the image, NOT the image hosting page!') + '.</p>';
		helpText += '<p>' + tx('Supported image hosting services are as follows') + ':-</p>';
		helpText += '<TABLE class=xtab><TR><TD><b>' + tx('Image Host') + '</b></td><TD><b>' + tx('Image Link Example') + '</b></td></tr>';
		helpText += '<TR><TD><a href="http://imgur.com/" target="_blank">imgur.com</a></td><TD>i.imgur.com/XXXX.jpg</td></tr>';
		helpText += '<TR><TD><a href="http://tinypic.com/" target="_blank">tinypic.com</a></td><TD>i99.tinypic.com/XXXX.jpg</td></tr>';
		helpText += '<TR><TD><a href="http://postimage.org/" target="_blank">postimage.org</a></td><TD>s99.postimg.org/YYYY/XXXX.jpg</td></tr>';
		helpText += '<TR><TD><a href="http://giphy.com/" target="_blank">giphy.com</a></td><TD>i.giphy.com/XXXX.gif</td></tr>';
		helpText += '</table><br>';

		var pop = new CPopup('BotHelp', 0, 0, 460, 280, true);
		pop.centerMe(mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>' + tx("PowerBot+ Help") + ': ' + tx("Image Previews") + '</b></center>';
		pop.show(true);
	},

	helpstylePop: function () {
		var t = Tabs.Options;
		var helpText = '<br>' + tx("Using Text Styles in Chat");
		helpText += '<p>' + tx('Use the following control codes to change the style of your text in chat') + '.</p>';
		helpText += '<p>' + tx('Note that multiple styles can be embedded, but must all be closed off separately') + '.</p>';
		helpText += '<TABLE class=xtab><TR><TD><b>' + tx('Control Code') + '</b></td><TD><b>' + tx('Style') + '</b></td></tr>';
		helpText += '<TR><TD>[#0]</td><TD>' + tx('Black') + '</td></tr>';
		helpText += '<TR><TD>[#1]</td><TD>' + tx('Red') + '</td></tr>';
		helpText += '<TR><TD>[#2]</td><TD>' + tx('Green') + '</td></tr>';
		helpText += '<TR><TD>[#3]</td><TD>' + tx('Blue') + '</td></tr>';
		helpText += '<TR><TD>[#4]</td><TD>' + tx('Magenta') + '</td></tr>';
		helpText += '<TR><TD>[#5]</td><TD>' + tx('Cyan') + '</td></tr>';
		helpText += '<TR><TD>[#6]</td><TD>' + tx('Yellow') + '</td></tr>';
		helpText += '<TR><TD>[#7]</td><TD>' + tx('White') + '</td></tr>';
		helpText += '<TR><TD>[#8]</td><TD>' + tx('Bold') + '</td></tr>';
		helpText += '<TR><TD>[#9]</td><TD>' + tx('Italic') + '</td></tr>';
		helpText += '<TR><TD>[#]</td><TD>' + tx('End Previous Style') + '</td></tr>';
		helpText += '</table><br>';

		var pop = new CPopup('BotHelp', 0, 0, 460, 380, true);
		pop.centerMe(mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>' + tx("PowerBot+ Help") + ': ' + tx("Chat Styles") + '</b></center>';
		pop.show(true);
	},


	ToggleCustomList: function () {
		var t = Tabs.Options;
		var pub = UserOptions.autoPublishPrivacySetting;
		if (pub == 99) { jQuery('#btCustomListSpan').removeClass("divHide"); }
		else { jQuery('#btCustomListSpan').addClass("divHide"); }
	},

	changeRefreshOption: function (tf) {
		var t = Tabs.Options;
		RefreshEvery.setEnable(tf);
		SetToggleButtonState('Refresh', Options.btEveryEnable, 'Refresh');
	},

	toggleAutoRefreshState: function () {
		var t = Tabs.Options;
		var obj = ById('btEveryEnable');
		Options.btEveryEnable = !Options.btEveryEnable;
		if (obj) obj.checked = Options.btEveryEnable;
		RefreshEvery.setEnable(Options.btEveryEnable);
		saveOptions();
		SetToggleButtonState('Refresh', Options.btEveryEnable, 'Refresh');
	},

	toggleAutoRaidState: function () {
		var t = Tabs.Options;
		var obj = ById('togResetRaids');
		Options.RaidRunning = !Options.RaidRunning;
		saveOptions();
		if (obj) obj.checked = Options.RaidRunning;
		t.ToggleRaidActive();
	},

	PaintTowerOptions: function () {
		var t = Tabs.Options;

		m = '<br><div align=center><table class=xtab width=100%>';
		m += '<TR><TD colspan=2 align=left><b>' + tx("Minimum number of Troops to trigger Tower Alert") + ':&nbsp;<INPUT id=pbalertTroops type=text size=7 value="' + Options.TowerOptions.minTroops + '" \></b>&nbsp;(' + tx("Controls All Tower Options") + ')<br>&nbsp;</td></tr>';
		m += '</table><TABLE width=98% cellspacing=0 class=xtab><tr><th class=xtabHD align=left>&nbsp;' + uW.g_js_strings.commonstr.city + '</th><th class=xtabHD align=center>' + tx("Active") + '</th><th class=xtabHD align=left>&nbsp;' + tx("WatchTower") + '</th><th class=xtabHD align=left>&nbsp;' + tx("Chat Alert Message") + '</th></tr>';

		for (var cityId in Cities.byID) {
			var wlevel = getUniqueCityBuilding(cityId, 14).maxLevel;
			if (wlevel != 0) { wleveltext = 'Level ' + wlevel; }
			else { wleveltext = '<span style="color:#800;"><b>None!</b></style>'; }
			m += '<tr><TD><b>' + Cities.byID[cityId].name + '</b></td><td align=center><INPUT id=toweractive_' + cityId + ' name=' + cityId + ' type=checkbox ' + (Options.TowerOptions.towercityactive[cityId] ? 'CHECKED ' : '') + '"></TD><td align=left>' + wleveltext + '</td><td align=left><INPUT id=towertext_' + cityId + ' name=' + cityId + ' type=text style="width: 400px;" maxlength=120 value="' + (Options.TowerOptions.towercitytext[cityId] ? Options.TowerOptions.towercitytext[cityId] : "") + '"></td></tr>';
		};

		ChampionObj = { 0: '-- ' + tx('Select Champion') + ' --' };
		for (var y in Seed.champion.champions) {
			var chkchamp = Seed.champion.champions[y];
			if (chkchamp.championId) {
				ChampionObj[chkchamp.championId] = chkchamp.name;
			}
		}

		m += '</tr></table></div><br>';

		m += '<TABLE width=100% class=xtab>';
		m += '<TR><TD><INPUT id=pbalertScout type=checkbox ' + (Options.TowerOptions.scouting ? 'CHECKED ' : '') + '/></td><TD>' + tx("Alert when being scouted") + '&nbsp;&nbsp;&nbsp;';
		m += '<INPUT id=pbalertWild type=checkbox ' + (Options.TowerOptions.wilds ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Alert on wilderness attack") + '&nbsp;&nbsp;</td></tr>';
		m += '<TR><TD><INPUT id=pbalertEnable type=checkbox ' + (Options.TowerOptions.aChat ? 'CHECKED ' : '') + '/></td><TD>' + tx("Post incoming attacks to Alliance Chat") + '</td></tr>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertWhisper type=checkbox ' + (Options.TowerOptions.whisper ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Whisper to yourself instead, if less than") + '&nbsp;<INPUT id=pbwhisperTroops type=text size=7 value="' + Options.TowerOptions.whisperTroops + '" \>&nbsp;' + tx("incoming troops") + '</td></tr>';
		m += '<TR><td>&nbsp;</td><TD>' + tx("Chat Message Prefix") + ':&nbsp;<INPUT id=pbalertPrefix type=text style="width: 400px;" maxlength=120 value="' + Options.TowerOptions.aPrefix + '" \></td><tr>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertAFK type=checkbox ' + (Options.TowerOptions.afk ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Display your AFK status") + '</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertChamp type=checkbox ' + (Options.TowerOptions.champ ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Display your city champion name") + '</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertDefend type=checkbox ' + (Options.TowerOptions.defend ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Display your city defend status") + '</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertTech type=checkbox ' + (Options.TowerOptions.tech ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Display your research information") + '</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertUpkeep type=checkbox ' + (Options.TowerOptions.upkeep ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Display your city food remaining") + '</td>';
		m += '<TR><td>&nbsp;</td><TD><INPUT id=pbalertDefendMonitor type=checkbox ' + (Options.TowerOptions.DefendMonitor ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Display defender throne monitor link") + '</td>';
		m += '<TR><td colspan=2><b>' + tx("Sound Options") + ':</b></td></tr>';
		m += '<TR><TD><INPUT id=pbSoundEnable type=checkbox ' + (Options.TowerOptions.alertSound.enabled ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Play sound on incoming attack/scout") + '</td></tr>';
		m += '<TR><TD>&nbsp;</td><TD><DIV id=pbSoundOpts><TABLE cellpadding=0 cellspacing=0 class=xtab>';
		m += '<TR><TD>' + tx("Attack sound") + ':&nbsp;</td><TD colspan=2><INPUT id=pbsoundFile type=text size=60 maxlength=1000 value="' + Options.TowerOptions.alertSound.soundUrl + '" \>&nbsp;</td><TD><INPUT type=button class=btInput value="' + tx("Test") + '" id=pbPlayNow><INPUT id=pbSoundStop type=button class=btInput value="' + tx("Stop") + '"><INPUT id=pbSoundDefault type=button class=btInput value=' + tx("Default") + ' ></td></tr>';
		m += '<TR><TD>' + tx("Scout sound") + ':&nbsp;</td><TD colspan=2><INPUT id=pbscoutFile type=text size=60 maxlength=1000 value="' + Options.TowerOptions.alertSound.scoutUrl + '" \>&nbsp;</td><TD><INPUT type=button class=btInput value="' + tx("Test") + '" id=pbScoutPlayNow><INPUT id=pbScoutStop type=button class=btInput value="' + tx("Stop") + '"><INPUT id=pbScoutDefault type=button class=btInput value=' + tx("Default") + ' ></td></tr>';
		m += '<TR><TD>' + tx("Volume") + ':&nbsp;</td><TD colspan=2><TABLE cellpadding=0 cellspacing=0 class=xtab><TR valign=middle><TD><SPAN id=pbVolSlider></span></td><TD width=15></td><TD align=right id=pbVolOut>0</td></td></table></td></tr>';
		m += '<TR><TD>&nbsp;</td><TD>Play for <INPUT id=pbSoundLength type=text size=3 maxlength=5 value="' + Options.TowerOptions.alertSound.playLength + '"> ' + tx("seconds") + '</td><TD><INPUT id=pbSoundRepeat type=checkbox ' + (Options.TowerOptions.alertSound.repeat ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Repeat every") + '&nbsp;<INPUT id=pbSoundEvery type=text size=2 maxlength=5 value="' + Options.TowerOptions.alertSound.repeatDelay + '"> ' + tx("minutes") + '</td></tr>';
		m += '</table></div></td></tr>';
		m += '<TR><td colspan=2><b>' + tx("Automatic Event Options") + ':</b></td></tr>';
		m += '<TR><TD><INPUT id=pbAFKEvents type=checkbox ' + (Options.TowerOptions.AFKEvents ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Only do the selected actions when AFK (Untick to always do the selected actions)") + '</td></tr>';
		m += '<TR><TD><INPUT id=pbRevert type=checkbox ' + (Options.TowerOptions.Revert ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Revert selected actions back after") + '&nbsp;<INPUT id=pbRevertMinutes type=text size=2 maxlength=2 value="' + Options.TowerOptions.RevertMinutes + '">&nbsp;' + tx("minutes after the last attack lands") + '&nbsp;<INPUT id=pbResetTower type=button class=btInput value="' + tx("Clear City States") + '"></td></tr>';
		m += '<TR><td colspan=2><b>' + tx("Automatic Events") + ':</b></td></tr>';
		m += '<TR><TD><INPUT id=pbChangeTR type=checkbox ' + (Options.TowerOptions.ChangeTR ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Change Throne Room to Preset") + '&nbsp;<INPUT id=pbChangeTRPreset type=text size=2 maxlength=2 value="' + Options.TowerOptions.ChangeTRPreset + '"></td></tr>';
		m += '<TR><TD><INPUT id=pbChangeGuardian type=checkbox ' + (Options.TowerOptions.ChangeGuardian ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Switch to Wood Guardian in city being attacked") + '</td></tr>';
		m += '<TR><TD><INPUT id=pbChangeChampion type=checkbox ' + (Options.TowerOptions.ChangeChamp ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Assign Champion") + '&nbsp;' + htmlSelector(ChampionObj, Options.TowerOptions.ChampId, "id=pbChampionId") + '&nbsp;' + tx("when attacking march is") + '&nbsp;<INPUT id=pbChampTime type=text size=2 maxlength=2 value="' + Options.TowerOptions.ChampTime + '">&nbsp;' + tx("seconds away") + '</td></tr>';
		m += '<TR><TD>&nbsp;</td><td colspan=3><INPUT id=pbChampNoChamp type=checkbox ' + (Options.TowerOptions.ChampNoChamp ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Only when city does not already have a champion") + '</td></tr>';
		m += '<TR><TD><INPUT id=pbStopRaids type=checkbox ' + (Options.TowerOptions.StopRaids ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Suspend Barbarian Raids in city being attacked") + '</td></tr>';
		m += '<TR><TD><INPUT id=pbStopMarches type=checkbox ' + (Options.TowerOptions.StopMarches ? 'CHECKED ' : '') + '/></td><TD colspan=3>' + tx("Suspend ALL automatic marches in city being attacked") + '</td></tr>';
		m += '</table><BR>';

		ById('btTowerOption').innerHTML = m;

		for (var cityId in Cities.byID) {
			ById('toweractive_' + cityId).addEventListener('click', function (e) { Options.TowerOptions.towercityactive[e.target.name] = e.target.checked; saveOptions(); }, false);
			ById('towertext_' + cityId).addEventListener('change', function (e) { Options.TowerOptions.towercitytext[e.target.name] = e.target.value; saveOptions(); }, false);
		}

		t.volSlider = new SliderBar(ById('pbVolSlider'), 200, 21, 0);
		t.volSlider.setValue(Options.TowerOptions.alertSound.volume / 100);
		t.volSlider.setChangeListener(t.e_volChanged);
		t.e_volChanged(Options.TowerOptions.alertSound.volume / 100);
		t.loadUrl(Options.TowerOptions.alertSound.soundUrl); // preload URL

		ById('pbPlayNow').addEventListener('click', function () { t.playSound(Options.TowerOptions.alertSound.soundUrl, false, 'pbSoundStop') }, false);
		ById('pbSoundStop').addEventListener('click', t.stopSoundAlerts, false);
		ById('pbSoundStop').disabled = true;

		ById('pbScoutPlayNow').addEventListener('click', function () { t.playSound(Options.TowerOptions.alertSound.scoutUrl, false, 'pbScoutStop') }, false);
		ById('pbScoutStop').addEventListener('click', t.stopSoundAlerts, false);
		ById('pbScoutStop').disabled = true;

		ById('pbSoundRepeat').addEventListener('change', function (e) { Options.TowerOptions.alertSound.repeat = e.target.checked; saveOptions(); }, false);
		ById('pbSoundEvery').addEventListener('change', function (e) { Options.TowerOptions.alertSound.repeatDelay = e.target.value; saveOptions(); }, false);
		ById('pbSoundLength').addEventListener('change', function (e) { Options.TowerOptions.alertSound.playLength = e.target.value; saveOptions(); }, false);
		ById('pbSoundEnable').addEventListener('change', function (e) { Options.TowerOptions.alertSound.enabled = e.target.checked; saveOptions(); }, false);

		ToggleOption('TowerOptions', 'pbalertEnable', 'aChat');
		ToggleOption('TowerOptions', 'pbalertScout', 'scouting');
		ToggleOption('TowerOptions', 'pbalertWild', 'wilds');
		ToggleOption('TowerOptions', 'pbalertChamp', 'champ');
		ToggleOption('TowerOptions', 'pbalertAFK', 'afk');
		ToggleOption('TowerOptions', 'pbalertDefend', 'defend');
		ToggleOption('TowerOptions', 'pbalertTech', 'tech');
		ToggleOption('TowerOptions', 'pbalertUpkeep', 'upkeep');
		ToggleOption('TowerOptions', 'pbalertWhisper', 'whisper');
		ToggleOption('TowerOptions', 'pbAFKEvents', 'AFKEvents');
		ToggleOption('TowerOptions', 'pbRevert', 'Revert');
		ToggleOption('TowerOptions', 'pbChangeTR', 'ChangeTR');
		ToggleOption('TowerOptions', 'pbChangeChampion', 'ChangeChamp');
		ToggleOption('TowerOptions', 'pbChampNoChamp', 'ChampNoChamp');
		ToggleOption('TowerOptions', 'pbChangeGuardian', 'ChangeGuardian');
		ToggleOption('TowerOptions', 'pbStopRaids', 'StopRaids');
		ToggleOption('TowerOptions', 'pbStopMarches', 'StopMarches');
		ToggleOption('TowerOptions', 'pbalertDefendMonitor', 'DefendMonitor');

		ChangeOption('TowerOptions', 'pbalertPrefix', 'aPrefix');
		ChangeOption('TowerOptions', 'pbalertTroops', 'minTroops');
		ChangeOption('TowerOptions', 'pbwhisperTroops', 'whisperTroops');
		ChangeOption('TowerOptions', 'pbRevertMinutes', 'RevertMinutes');
		ChangeOption('TowerOptions', 'pbChangeTRPreset', 'ChangeTRPreset');
		ChangeIntegerOption('TowerOptions', 'pbChampTime', 'ChampTime', 10);
		ChangeOption('TowerOptions', 'pbChampionId', 'ChampId');

		ById('pbResetTower').addEventListener('click', t.resetCityStates, false);

		ById('pbsoundFile').addEventListener('change', function () {
			Options.TowerOptions.alertSound.soundUrl = ById('pbsoundFile').value;
			saveOptions();
			t.loadUrl(Options.TowerOptions.alertSound.soundUrl);
		}, false);
		ById('pbSoundDefault').addEventListener('click', function () {
			Options.TowerOptions.alertSound.soundUrl = DEFAULT_ALERT_SOUND_URL;
			saveOptions();
			ById('pbsoundFile').value = DEFAULT_ALERT_SOUND_URL;
			t.loadUrl(DEFAULT_ALERT_SOUND_URL);
		}, false);

		ById('pbscoutFile').addEventListener('change', function () {
			Options.TowerOptions.alertSound.scoutUrl = ById('pbscoutFile').value;
			saveOptions();
			t.loadUrl(Options.TowerOptions.alertSound.scoutUrl);
		}, false);
		ById('pbScoutDefault').addEventListener('click', function () {
			Options.TowerOptions.alertSound.scoutUrl = DEFAULT_SCOUT_SOUND_URL;
			saveOptions();
			ById('pbscoutFile').value = DEFAULT_SCOUT_SOUND_URL;
			t.loadUrl(DEFAULT_SCOUT_SOUND_URL);
		}, false);
	},

	resetCityStates: function () {
		var t = Tabs.Options;
		Options.TowerOptions.RecentActivity = false;
		Options.TowerOptions.LastAttack = 0;
		Options.TowerOptions.HandledMarches = new Array();
		Options.TowerOptions.LatestAttackTimes = {};
		Options.TowerOptions.RecentCityActivity = {};
		Options.TowerOptions.SaveCityState = {};
		Options.TowerOptions.SaveTR = 0;
		Options.TowerOptions.ChampOriginalCity = 0;
		saveOptions();
	},

	loadUrl: function (url) {
		var t = Tabs.Options;
		if (t.mss) { t.mss.setSource(url); }
	},

	PaintFixOptions: function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=ptEnableMiniRefresh type=checkbox ' + (Options.MiniRefresh ? 'CHECKED ' : '') + '/></td><TD class=xtab>&nbsp;' + tx("Refresh Data/Marches every");
		m += '<INPUT id=ptMiniRefreshInterval type=text size=3 value="' + Options.MiniRefreshInterval + '">&nbsp;' + tx("minutes") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRemovePointless type=checkbox /></td><TD class=xtab>' + tx("Hide pointless items from Inventory views") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChampLagFix type=checkbox /></td><TD class=xtab>' + tx("Fix delay when opening Castle, Rally Point and Boss Battle") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togTowerFix type=checkbox /></td><TD class=xtab>' + tx("Fix tower alert to show exact target (city or wild)") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togKnightSelect type=checkbox /></td><TD class=xtab>' + tx("Do not automatically select a knight when changing march type to Scout, Transport or Reassign") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togFilterTroopsFix type=checkbox /></td><TD class=xtab>' + tx("Don't filter troop types for transport") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togStalledMarches type=checkbox /></td><TD class=xtab>' + tx("Fix stalled marches and missing knights") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togCoordBox type=checkbox /></td><TD class=xtab>' + tx("Keep map coordinate box/bookmarks on top of troop activity") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo2 type=checkbox /></td><TD class=xtab>' + tx("Add reassign button when clicked on own city") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo type=checkbox /></td><TD class=xtab>' + tx("Fix reassign button on maptile info") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo3 type=checkbox /></td><TD class=xtab>' + tx("Include player name / city name in new bookmarks") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togLoadCapFix type=checkbox /></td><TD class=xtab>' + tx("Limit load capacity to not exceed throne room load cap") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togTRAetherCostFix type=checkbox /></td><TD class=xtab>' + tx("Fix display of aetherstones for throne room upgrade/enhance") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMMBImageFix type=checkbox /></td><TD class=xtab>' + tx("Post correct image to facebook for Merlin Box") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatTimeFix type=checkbox /></td><TD class=xtab>' + tx("Always show local time on chat posts") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=togMoveFurniture type=checkbox /></td><td class=xtab>' + tx("Rearrange throne room furniture for better visibility") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><td class=xtab><INPUT id=togFixMightDisplay type=checkbox /></td><td class=xtab>' + tx("Fix might display on main screen") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptkillmusic type=checkbox /></td><TD class=xtab>' + tx("Kill music on startup") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptkillsounds type=checkbox /></td><TD class=xtab>' + tx("Kill sound effects on startup") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptdisableredx type=checkbox /></td><TD class=xtab>' + tx('Disable "Red X" failure animation') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptdisablegreentick type=checkbox /></td><TD class=xtab>' + tx('Disable "Green Tick" success animation') + '</td></tr>';
		m += '</table>';

		ById('btFixOption').innerHTML = m;

		ById('ptEnableMiniRefresh').addEventListener('change', t.MiniRefreshChanged, false);
		ChangeIntegerOption('', 'ptMiniRefreshInterval', 'MiniRefreshInterval', 3, t.MiniRefresh);

		ToggleOption('', 'togTowerFix', 'fixTower', TowerAlerts.enableFixTarget, TowerAlerts.isFixTargetAvailable);
		ToggleOption('', 'togKnightSelect', 'fixKnightSelect', AttackDialog.setEnable, AttackDialog.isAvailable);
		ToggleOption('', 'togFilterTroopsFix', 'DontFilterTransportTroops', AttackDialog.setEnable, AttackDialog.isAvailable);
		ToggleOption('', 'togStalledMarches', 'StalledMarches');
		ToggleOption('', 'togCoordBox', 'mapCoordsTop', CoordBox.setEnable, CoordBox.isAvailable);
		ToggleOption('', 'togMapInfo2', 'mapInfo2', mapinfoFix.setEnable2, mapinfoFix.isAvailable2);
		ToggleOption('', 'togMapInfo', 'mapInfo', mapinfoFix.setEnable, mapinfoFix.isAvailable);
		ToggleOption('', 'togMapInfo3', 'mapInfo3', mapinfoFix.setEnable3, mapinfoFix.isAvailable3);
		ToggleOption('', 'togLoadCapFix', 'fixLoadCap', LoadCapFix.setEnable, LoadCapFix.isAvailable);
		ToggleOption('', 'togTRAetherCostFix', 'fixTRAetherCost', TRAetherCostFix.setEnable, TRAetherCostFix.isAvailable);
		ToggleOption('', 'togMMBImageFix', 'fixMMBImage', mmbImageFix.setEnable, mmbImageFix.isAvailable);
		ToggleOption('', 'togChatTimeFix', 'fixChatTime', ChatTimeFix.setEnable, ChatTimeFix.isAvailable);
		ToggleOption('', 'togChampLagFix', 'FixCastleLag', ChampLagFix.setEnable, ChampLagFix.isAvailable);
		ToggleOption('', 'togRemovePointless', 'RemovePointlessItems', t.RestartReminder);
		ToggleOption('', 'togMoveFurniture', 'MoveFurniture', t.RestartReminder);
		ToggleOption('', 'togFixMightDisplay', 'FixMightDisplay', t.RestartReminder);
		ToggleOption('', 'ptkillmusic', 'KillMusic');
		ToggleOption('', 'ptkillsounds', 'KillSounds');
		ToggleOption('', 'ptdisableredx', 'DisableRedX');
		ToggleOption('', 'ptdisablegreentick', 'DisableGreenTick');
	},

	PaintReportOptions: function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab colspan=2><B>' + tx("Alliance Report Scanner") + ':</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnhanceAR type=checkbox /></td><TD class=xtab>' + tx("Enable scanning of Alliance Reports") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab><TABLE>';
		m += '<TR><TD class=xtab colspan=3>' + tx("Scan interval") + ': <INPUT id=ptalertinterval type=text size=3 value=' + Options.ReportOptions.alertinterval + ' /> ' + tx("seconds") + '</td></tr>';
		m += '<TR><TD class=xtab colspan=3><INPUT id=ptincomingar type=checkbox ' + (Options.ReportOptions.PostIncoming ? 'CHECKED ' : '') + '/>' + tx("Scan incoming attack reports") + '</td></tr>';
		m += '<TR><TD class=xtab width=50>&nbsp;</td><TD class=xtab colspan=2>' + tx("Min troops") + ': <INPUT id=ptalertmtroops type=text size=6 value=' + Options.ReportOptions.alertmtroops + ' /></TD></TR>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptalertignorewilds type=checkbox ' + (Options.ReportOptions.IgnoreWilds ? 'CHECKED ' : '') + '/>' + tx("Ignore incoming wild attacks") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptalertignorescouts type=checkbox ' + (Options.ReportOptions.IgnoreScouts ? 'CHECKED ' : '') + '/>' + tx("Ignore incoming scouts") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptwhisperar type=checkbox ' + (Options.ReportOptions.WhisperAR ? 'CHECKED ' : '') + '/>' + tx("Whisper incoming attack reports to yourself and the following players (separated by commas)") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td class=xtab width=50>&nbsp;</td><td class=xtab><INPUT id=ptwhisperarlist type=text size=70 value="' + Options.ReportOptions.WhisperARList + '"></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptnoduplicatereports type=checkbox ' + (Options.ReportOptions.NoDuplicateReports ? 'CHECKED ' : '') + '/>' + tx("Do not post reports already posted by another alliance member") + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#800;"><b>(WORK IN PROGRESS)</b></span></td></tr>';
		m += '<TR><TD class=xtab colspan=3><INPUT id=ptwhisperoutgoing type=checkbox ' + (Options.ReportOptions.WhisperOutgoing ? 'CHECKED ' : '') + '/>' + tx("Whisper your own outgoing attack reports to yourself") + '</td></tr></table></td></tr>';

		m += '<TR><TD class=xtab colspan=2><B>' + tx('Automatic Report Deletion') + ':</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletebctoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete barbarian camp reports/Transport reports from you") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletetrtoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete transport reports to you") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletewltoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete wilderness reports") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeleteaatoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete auto-attack reports (and log items for attack summary)") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletedftoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete dark forest reports (and log items for DF summary)") + '</td></tr>';
		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab><INPUT id=pbdfreport type=checkbox ' + (Options.DFReport ? ' CHECKED' : '') + '\>&nbsp;' + tx("Send DF report every") + '&nbsp;<INPUT id=pbdfreportinterval value=' + Options.DFReportInterval + ' type=text size=3 \>&nbsp;' + tx('hours') + '&nbsp;&nbsp;&nbsp;' + strButton8(tx('Send Now'), 'id=pbdfreportsend') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletesctoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete ALL incoming scout reports") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeletefrtoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete incoming attack/scout reports from friendly alliances") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbdeleteidtoggle type=checkbox /></td><TD class=xtab> ' + tx("Delete incoming") + ' ' + htmlSelector({ 0: tx("attack/scout"), 4: tx("attack"), 3: tx("scout") }, Options.ReportOptions.DeleteRptidType, "id=pbdeleteidtype class=btInput") + ' ' + tx("reports from the following UIDs (separated by commas)") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab><input id=pbdeleteuidreps type=text size=100 /></td></tr>';
		m += '</table>';

		ById('btReportOption').innerHTML = m;

		ToggleOption('ReportOptions', 'togEnhanceAR', 'EnhanceAR', AllianceReportsCheck.enable);
		ToggleOption('ReportOptions', 'ptincomingar', 'PostIncoming');
		ToggleOption('ReportOptions', 'ptwhisperoutgoing', 'WhisperOutgoing');
		ToggleOption('ReportOptions', 'ptalertignorescouts', 'IgnoreScouts');
		ToggleOption('ReportOptions', 'ptalertignorewilds', 'IgnoreWilds');
		ToggleOption('ReportOptions', 'ptwhisperar', 'WhisperAR');
		ToggleOption('ReportOptions', 'pbdeletebctoggle', 'DeleteRptbc');
		ToggleOption('ReportOptions', 'pbdeletetrtoggle', 'DeleteRpttr');
		ToggleOption('ReportOptions', 'pbdeletewltoggle', 'DeleteRptwl');
		ToggleOption('ReportOptions', 'pbdeleteaatoggle', 'DeleteRptaa');
		ToggleOption('ReportOptions', 'pbdeletefrtoggle', 'DeleteRptfr');
		ToggleOption('ReportOptions', 'pbdeleteidtoggle', 'DeleteRptid');
		ToggleOption('ReportOptions', 'pbdeletedftoggle', 'DeleteRptdf');
		ToggleOption('ReportOptions', 'pbdeletesctoggle', 'DeleteRptsc');

		ChangeOption('ReportOptions', 'ptalertinterval', 'alertinterval');
		ChangeOption('ReportOptions', 'ptalertmtroops', 'alertmtroops');
		ChangeOption('ReportOptions', 'ptwhisperarlist', 'WhisperARList');
		ChangeOption('ReportOptions', 'pbdeleteuidreps', 'DeleteRptUID');
		ChangeOption('ReportOptions', 'pbdeleteidtype', 'DeleteRptidType');
		ChangeOption('ReportOptions', 'ptnoduplicatereports', 'NoDuplicateReports');

		ById('pbdfreportinterval').addEventListener('keyup', function () {
			if (isNaN(ById('pbdfreportinterval').value) || ById('pbdfreportinterval').value < 1) { ById('pbdfreportinterval').value = 1; }
			Options.DFReportInterval = ById('pbdfreportinterval').value;
			saveOptions();
			t.sendDFReport();
		}, false);
		ById('pbdfreportsend').addEventListener('click', function () {
			Options.LastDFReport = 0;
			saveOptions();
			t.sendDFReport(true);
		}, false);
		ToggleOption('', 'pbdfreport', 'DFReport', t.sendDFReport);
	},

	PaintDashOptions: function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=btShowDashboard type=checkbox /></td><TD class=xtab>' + tx("Show Dashboard") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btFloatingDashboard type=checkbox /></td><TD class=xtab>' + tx("Floating Dashboard") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD colspan=2 class=xtab>' + tx("Dashboard Width:") + ' ' + htmlSelector({ 480: '480 pixels', 540: '540 pixels', 600: '600 pixels' }, Options.DashboardOptions.DashWidth, 'id=btDashWidth') + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><td class=xtab width=30><INPUT id=UpperDefChk type=checkbox /></td><td class=xtab width=300>' + tx("Overview defend button") + '</td><td class=xtab width=30><INPUT id=LowerDefChk type=checkbox /></td><td class=xtab>' + tx("Troops defend button") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=PresetChk type=checkbox /></td><td colspan="3" class=xtab>' + tx("Show throne room preset changer") + '</td></tr>';
		m += '<TR id=btPresetByNameOpts class="divHide"><td class=xtab><INPUT id=TRPresetByNameChk type=checkbox /></td><td colspan="3" class=xtab>' + tx("Select presets by name") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=GraphChampChk type=checkbox /></td><td colspan="3" class=xtab>' + tx("Graphical champion selector") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=QuickSacChk type=checkbox /></td><td colspan="3" class=xtab>' + tx("Show quick sacrifice icons") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=DefaultSacChk type=checkbox /></td><td class=xtab>' + tx("Default sacrifice duration") + '</td>';
		m += '<TD class=xtab colspan="2"><span id=btSacOpts class="divHide"><INPUT class="btInput" style="width: 30px;text-align:right;" id="btDefaultRitualMinutes" type=text maxlength=4 value="' + Options.DashboardOptions.DefaultSacrificeMin + '" onkeyup="btCheckDefaultRitual(this)">&nbsp;' + uW.g_js_strings.timestr.timemin + '&nbsp;';
		m += '<INPUT class="btInput" style="width: 15px;text-align:right;" id="btDefaultRitualSeconds" type=text maxlength=2 value="' + Options.DashboardOptions.DefaultSacrificeSec + '" onkeyup="btCheckDefaultRitual(this)">&nbsp;' + uW.g_js_strings.timestr.timesec + '</span></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>' + tx("Maximum troops to sacrifice") + '</td><TD class=xtab colspan="2"><INPUT class="btInput" style="text-align:right;" id="btSacrificeLimit" type=text size=13 maxlength=11 value="' + Options.DashboardOptions.SacrificeLimit + '">&nbsp;' + tx("troops") + '</td></tr>';

		if (SelectiveDefending) {
			m += '<TR><td class=xtab><INPUT id=DefSetFirst type=checkbox /></td><td colspan="3" class=xtab>' + tx("Show Assign Defenders section above Troop Display") + '</td></tr>';
			m += '<TR><td class=xtab><INPUT id=DefAddTroopChk type=checkbox /></td><td colspan="3" class=xtab>' + tx("Show defence add troops") + '</td></tr>';
			m += '<TR id=btDefOpts class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab>' + tx("Default add defence amount") + '</td><TD class=xtab colspan="2"><INPUT class="btInput" style="text-align:right;" id="btDefaultDefenceNum" type=text size=13 maxlength=11 value="' + Options.DashboardOptions.DefaultDefenceNum + '">&nbsp;' + tx("troops") + '</td></tr>';
			m += '<TR><td class=xtab><INPUT id=DefPresetChk type=checkbox /></td><td colspan="3" class=xtab>' + tx("Show defensive presets") + '</td></tr>';
		}

		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=4><table cellSpacing=0 width=98%>';
		m += '<TR><TD style="width:20px" class=xtabHD>' + tx("Show") + '</td><TD style="width:100px" class=xtabHD>' + tx("Section") + '</td><TD class=xtabHD>' + tx("Sequence") + '</td><TD class=xtabHD align=right><a id=btResetDash class="inlineButton btButton brown11"><span>' + tx("Reset") + '</span></a></td></tr>';

		for (var p in Dashboard.DefaultDashboard) {
			var NewObj = {};
			if (Options.DashboardOptions.OverrideDashboard[p]) {
				NewObj.Display = Options.DashboardOptions.OverrideDashboard[p].Display;
				NewObj.Sequence = Options.DashboardOptions.OverrideDashboard[p].Sequence;
			}
			else {
				NewObj.Display = Dashboard.DefaultDashboard[p].Display;
				NewObj.Sequence = Dashboard.DefaultDashboard[p].Sequence;
			}
			NewObj["name"] = p;

			m += '<tr>';
			m += '<TD style="width:20px" class="xtab"><INPUT id="dashDisp' + NewObj["name"] + '" type=checkbox ' + (NewObj["Display"] ? 'CHECKED' : '') + ' onclick="btOverrideDash(\'' + NewObj["name"] + '\')" /></td>';
			m += '<TD class=xtab>' + tx(NewObj["name"]) + '</td>';
			m += '<TD class=xtab><INPUT class="btInput" id="dashSeq' + NewObj["name"] + '" style="width:30px;" maxlength=3 type=text value="' + NewObj["Sequence"] + '" onkeyup="btOverrideDash(\'' + NewObj["name"] + '\')" /></td>';
			m += '<td class=xtab>&nbsp;</td></tr>';
		}
		m += '</table></td></tr>';
		m += '</table>';

		ById('btDashOption').innerHTML = m;

		ById('btResetDash').addEventListener('click', function () { t.ResetDash(); }, false);

		ToggleOption('', 'btShowDashboard', 'btDashboard', WideScreen.setDashboard); // options, not dash options...
		ToggleOption('', 'btFloatingDashboard', 'btFloatingDashboard', WideScreen.RestartDashboard);

		ById('btDashWidth').addEventListener('change', function () {
			Options.DashboardOptions.DashWidth = parseIntNan(ById('btDashWidth').value);
			if (Options.DashboardOptions.DashWidth == 0) Options.DashboardOptions.DashWidth = 480;
			saveOptions();
			t.RestartReminder();
		}, false);

		ToggleOption('DashboardOptions', 'UpperDefChk', 'UpperDefendButton');
		ToggleOption('DashboardOptions', 'LowerDefChk', 'LowerDefendButton');
		ToggleOption('DashboardOptions', 'PresetChk', 'TRPresetChange', t.PresetToggle);
		t.PresetToggle();

		if (SelectiveDefending) {
			ToggleOption('DashboardOptions', 'DefSetFirst', 'SetDefendersFirst', WideScreen.RestartDashboard);
			ToggleOption('DashboardOptions', 'DefAddTroopChk', 'DefAddTroopShow', t.DefToggle);
			t.DefToggle();
			ToggleOption('DashboardOptions', 'DefPresetChk', 'DefPresetShow');
			ChangeIntegerOption('DashboardOptions', 'btDefaultDefenceNum', 'DefaultDefenceNum');
		}

		ToggleOption('DashboardOptions', 'QuickSacChk', 'QuickSacrifice', Dashboard.PaintQuickSac);
		ToggleOption('DashboardOptions', 'DefaultSacChk', 'DefaultSacrifice', t.SacToggle);
		t.SacToggle();

		ToggleOption('DashboardOptions', 'TRPresetByNameChk', 'TRPresetByName');
		ToggleOption('DashboardOptions', 'GraphChampChk', 'GraphicalChampDisplay');

		ChangeIntegerOption('DashboardOptions', 'btSacrificeLimit', 'SacrificeLimit');
	},

	PaintTRPresetOptions: function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><table cellSpacing=0 width=98%>';
		m += '<TR><TD style="width:20px" class=xtabHD>' + tx('Num') + '</td><TD style="width:150px;" class=xtabHD>' + uW.g_js_strings.commonstr.nametx + '</td><TD class=xtabHD colspan=2>' + uW.g_js_strings.commonstr.select + '</td></tr>';

		for (var i = 1; i <= Seed.throne.slotNum; i++) {
			m += '<tr>';
			m += '<TD style="width:20px" id="trpresetopt' + i + '" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div id="trpresetoptdiv' + i + '" class="presetBut presetButNon"><center>' + i + '</center></div></a></td>';
			m += '<TD class=xtab><INPUT class="btInput" id="btpresetLabel' + i + '" style="width:120px;" maxlength=15 type=text value="' + (Options.DashboardOptions.TRPresets[i] ? Options.DashboardOptions.TRPresets[i].name : 'Preset ' + i) + '" onkeyup="btStartKeyTimer(this,btUpdatePresetLabel,' + i + ')" onchange="btUpdatePresetLabel(this,' + i + ')" /></td>';
			m += '<TD class=xtab colspan=2><INPUT type=checkbox id="btpresetSelect' + i + '" ' + (Options.DashboardOptions.TRPresetsSelected[i] ? 'CHECKED' : '') + ' onclick="btToggleTRPreset(' + i + ')" /></td>';
			m += '</tr>';
		}
		m += '<tr><TD class=xtab style="width:20px"><INPUT type=checkbox id="btpresetCycle" ' + (Options.DashboardOptions.TRPresetsCycle ? 'CHECKED' : '') + ' /></td><td class=xtab colspan=2>' + tx('Cycle through selected presets when AFK, every') + ' ' + '<INPUT id=btpresetCycleMins type=text size=2 value="' + Options.DashboardOptions.TRPresetsCycleMins + '">&nbsp;' + tx('minutes') + '</td>';
		if (uW.tcoPresetNames) { m += '<td class=xtab align=right><a class=xlink id=btCopyTCOPresets>' + tx('Copy Preset Names from Throne/Champ') + '</a></td>'; }
		m += '</tr>';

		m += '</table></td></tr>';
		m += '</table>';

		ById('btTRPresetOption').innerHTML = m;

		ToggleOption('DashboardOptions', 'btpresetCycle', 'TRPresetsCycle');
		ChangeIntegerOption('DashboardOptions', 'btpresetCycleMins', 'TRPresetsCycleMins', 1);

		if (ById('btCopyTCOPresets')) {
			ById('btCopyTCOPresets').addEventListener('click', function () {
				for (var i = 1; i <= Seed.throne.slotNum; i++) {
					var PresetName = uW.tcoPresetNames[i];
					if (PresetName && PresetName != "" && PresetName != "undefined") {
						ById('btpresetLabel' + i).value = uW.tcoPresetNames[i].substring(0, 15);
						Dashboard.UpdatePresetLabel(ById('btpresetLabel' + i), i);
					}
				}
				saveOptions();
			}, false);
		}
		Dashboard.PaintTRPresets();
	},

	PaintChatOptions: function () {
		var t = Tabs.Options;
		m = '<TABLE width="100%">';

		m += '<TR><TD class=xtab><INPUT id=togChatStuff type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enable Chat Enhancements (Clickable Co-ords, Click on Icon to Whisper, Colours, Emoticons)") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=CFilter type=checkbox /></td><TD class=xtab>' + tx("Beat chat filter so words such as \'deSCRIPTion\' can be typed") + '</td><td width=50% class=xtab>' + tx('Replacement Char') + ' :&nbsp;<select id=pbfilter>';
		for (c in Filter) {
			if (c == Options.ChatOptions.fchar)
				m += '<option value=' + c + ' selected="selected">' + c + ' (' + Filter[c] + ')</option>';
			else
				m += '<option value=' + c + '>' + c + ' (' + Filter[c] + ')</option>';
		};
		m += '</select></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatIcon type=checkbox /></td><TD class=xtab>' + tx("Show Facebook profile picture in chat instead of avatar") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatEmoticons type=checkbox /></td><TD class=xtab>' + tx("Show emoticons in chat") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatStyles type=checkbox /></td><TD class=xtab>' + tx("Show text styles in chat") + '&nbsp;<INPUT class=btInput id=pbChatStyleHelp type=submit value="' + tx('HELP') + '!"></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatImages type=checkbox /></td><TD class=xtab colspan=2>' + tx("Show linked image previews in chat") + '&nbsp;<INPUT class=btInput id=pbIMGLinkHelp type=submit value="' + tx('HELP') + '!"></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbChatHelpRequest type=checkbox /></td><TD class=xtab>' + tx("Help alliance build/research posts") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeletegAl type=checkbox /></td><TD class=xtab>' + tx("Hide alliance chat from global chat") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteRequest type=checkbox /></td><TD class=xtab>' + tx("Hide alliance requests in chat") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteReport type=checkbox /></td><TD class=xtab colspan=2>' + tx("Hide alliance report scanner posts in chat") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteGlobalSpam type=checkbox /></td><TD class=xtab>' + tx("Hide spam messages from global chat") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteAllianceSpam type=checkbox /></td><TD class=xtab>' + tx("Hide spam messages from alliance chat") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteFood type=checkbox /></td><TD class=xtab colspan=2>' + tx("Hide alliance food alerts in chat from player names") + ':&nbsp;<input title="' + tx('Separate your alliance player names by commas - No spaces. Leave blank for all players.') + '" id=pbDelFoodUsers type=text size=60 /></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteAlert type=checkbox /></td><TD class=xtab colspan=2>' + tx("Hide alliance attack alerts in chat from player names") + ':&nbsp;<input title="' + tx('Separate your alliance player names by commas - No spaces. Leave blank for all players.') + '" id=pbDelAlertUsers type=text size=60 /></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbDeleteScout type=checkbox /></td><TD class=xtab colspan=2>' + tx("Hide alliance scout alerts in chat from player names") + ':&nbsp;<input title="' + tx('Separate your alliance player names by commas - No spaces. Leave blank for all players.') + '" id=pbDelScoutUsers type=text size=60 /></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnableTowerAlert type=checkbox /></td><TD class=xtab>' + tx("Enable sound alert on alliance Attack alerts") + '</td><TD width=50% class=xtab>' + htmlSelector(AlertSounds, Options.ChatOptions.TowerPlay, 'id=btTowerPlay') + '&nbsp;<a id=btTestTowerSound class="inlineButton btButton blue14"><span>Test</span></a></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnableScoutAlert type=checkbox /></td><TD class=xtab>' + tx("Enable sound alert on alliance Scout alerts") + '</td><TD width=50% class=xtab>' + htmlSelector(AlertSounds, Options.ChatOptions.ScoutPlay, 'id=btScoutPlay') + '&nbsp;<a id=btTestScoutSound class="inlineButton btButton blue14"><span>Test</span></a></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togEnableWhisperAlert type=checkbox /></td><TD class=xtab>' + tx("Enable sound alert on whisper") + '</td><TD width=50% class=xtab>' + htmlSelector(WhisperSounds, Options.ChatOptions.WhisperPlay, 'id=btWhisperPlay') + '&nbsp;<a id=btTestWhisperSound class="inlineButton btButton blue14"><span>Test</span></a></td></tr>';
		m += '<tr id=ptSoundOpts class="divHide"><td class=xtab>&nbsp;</td><TD class=xtab colspan=2><div><TABLE cellpadding=0 cellspacing=0><TR valign=middle><TD class=xtab>' + tx('Chat sounds volume') + '&nbsp;</td><TD class=xtab><SPAN id=ptVolSlider></span></td><TD class=xtab align=right id=ptVolOut style="width:30px;">0</td></tr></table></div></tr>';
		m += '</table>';
		m += '<TABLE><TR><TD class=xtab colspan=3><br><B>' + tx("Chat Spam") + '&nbsp;</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbspamactive type=checkbox /></td><TD class=xtab>' + tx("Spam Enabled") + '</td><TD class=xtab>' + htmlSelector({ g: 'Send to Global Chat', a: 'Send to Alliance Chat' }, Options.ChatOptions.SpamType, 'id=pbspamtype') + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>' + tx("Spam Interval") + ':</td><TD class=xtab><INPUT id=pbspaminterval type=text size=3 value=' + Options.ChatOptions.SpamInterval + ' /> ' + tx("minutes") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD style="vertical-align:top" class=xtab>' + tx("Spam Text") + ':</td><TD class=xtab><textarea id=pbspamtext rows=3 cols=40 onkeyup="ptStopProp(event);">' + Options.ChatOptions.SpamText + '</textarea></td></tr>';
		m += '</table>';
		m += '<TABLE><TR><TD class=xtab colspan=3><B>' + tx("Chat Colours") + '&nbsp;</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatGlory type=checkbox /></td><TD class=xtab>' + tx("Highlight Alliance Glory Leader") + '</td><TD colspan=2 class=xtab>' + tx("Check every") + '&nbsp;<INPUT id=pbglorycheck type=text size=2 value="' + Options.ChatOptions.GloryLeaderInterval + '">&nbsp;' + tx('minutes') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatRainbow type=checkbox /></td><TD class=xtab colspan=2>' + tx("Display your own messages with a rainbow background") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatBold type=checkbox /></td><TD class=xtab>' + tx("Enable Bold Font") + '</td></tr>';
		var cb = '';
		if (Options.ChatOptions.chatBold) { cb = ';font-weight:bold;'; }
		m += '<TR><TD class=xtab><INPUT id=togChatGlobal type=checkbox /></td><TD class=xtab>' + tx("Enable Global Chat Background Colour") + '</td><TD class=xtab><INPUT id=togGlobal type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatGlobal + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatGlobal + cb + '" width=90px>' + tx("Global") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatAlliance type=checkbox /></td><TD class=xtab>' + tx("Enable Alliance Chat Background Colour") + '</td><TD class=xtab><INPUT id=togAll type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatAll + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatAll + cb + '" width=90px>' + tx("Alliance") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatWhisper type=checkbox /></td><TD class=xtab>' + tx("Enable Whisper Colour") + '</td><TD class=xtab><INPUT id=togWhisper type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatWhisper + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:#F8E151;color:' + Options.ChatOptions.Colors.ChatWhisper + '" width=90px><b>' + tx("Whisper") + '</b></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatAttack type=checkbox /></td><TD class=xtab>' + tx("Enable Tower Alert Background Colours") + '</td><TD class=xtab><INPUT id=togChatAtt type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatAtt + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatAtt + cb + '" width=90px>' + tx("Attack") + '</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatScout type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatScout + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatScout + cb + '" width=90px>' + tx("Scout") + '</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatRecall type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatRecall + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatRecall + cb + '" width=90px>' + tx("Recall") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togChatLead type=checkbox /></td><TD class=xtab>' + tx("Enable Alliance Leaders Background Colours") + '</td><TD class=xtab><INPUT id=togChatC type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatChancy + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatChancy + cb + '" width=90px>' + tx("Chancellor") + '</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatVC type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatVC + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatVC + cb + '" width=90px>' + tx("Vice") + '</td>';
		m += '<TD class=xtab>&nbsp;<INPUT id=togChatLeaders type=text size=7 maxlength=7 value="' + Options.ChatOptions.Colors.ChatLeaders + '"></td>&nbsp;<TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.ChatOptions.Colors.ChatLeaders + cb + '" width=90px>' + tx("Officer") + '</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>' + tx('HTML colours') + ':&nbsp;<a class=xlink href="http://www.colorpicker.com/" target="_blank">' + tx('Colour Picker') + '</a>&nbsp;/&nbsp;<a class=xlink href="http://www.w3schools.com/html/html_colors.asp" target="_blank">' + tx('Colours') + '</a></td><td colspan=2 class=xtab>';
		m += makeButtonv2('blue', 'id=btResetChatColors', tx("Reset Chat Colours"));
		m += '</td></tr>';

		m += '</table>';

		ById('btChatOption').innerHTML = m;

		t.ChatVolSlider = new SliderBar(ById('ptVolSlider'), 200, 21, 0);
		t.ChatVolSlider.setValue(Options.ChatOptions.Volume / 100);
		t.ChatVolSlider.setChangeListener(t.ChatVolumeChanged);
		t.ChatVolumeChanged(Options.ChatOptions.Volume / 100);
		t.ChatSoundToggle();

		ById('btTestWhisperSound').addEventListener('click', function () {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.WhisperPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(AudioManager.stop, 2500);
		}, false);

		ById('btTestTowerSound').addEventListener('click', function () {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.TowerPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(AudioManager.stop, 5000);
		}, false);

		ById('btTestScoutSound').addEventListener('click', function () {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.ScoutPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(AudioManager.stop, 5000);
		}, false);

		ToggleOption('ChatOptions', 'togChatStuff', 'chatEnhance', ChatStuff.setEnable, ChatStuff.isAvailable);
		ToggleOption('ChatOptions', 'togChatGlobal', 'chatGlobal');
		ToggleOption('ChatOptions', 'togChatAlliance', 'chatAlliance');
		ToggleOption('ChatOptions', 'togChatWhisper', 'chatWhisper');
		ToggleOption('ChatOptions', 'togChatBold', 'chatBold', t.PaintChatOptions);
		ToggleOption('ChatOptions', 'togChatAttack', 'chatAttack');
		ToggleOption('ChatOptions', 'togChatLead', 'chatLeaders');
		ToggleOption('ChatOptions', 'togChatIcon', 'chatIcons');
		ToggleOption('ChatOptions', 'togChatEmoticons', 'Emoticons');
		ToggleOption('ChatOptions', 'togChatStyles', 'Styles');
		ToggleOption('ChatOptions', 'togChatImages', 'ImagePreviews');

		ToggleOption('ChatOptions', 'togEnableWhisperAlert', 'enableWhisperAlert', t.ChatSoundToggle);
		ToggleOption('ChatOptions', 'togEnableTowerAlert', 'enableTowerAlert', t.ChatSoundToggle);
		ToggleOption('ChatOptions', 'togEnableScoutAlert', 'enableScoutAlert', t.ChatSoundToggle);

		ToggleOption('ChatOptions', 'pbspamactive', 'SpamActive', t.ToggleSpamActive);

		ChangeOption('ChatOptions', 'pbspamtype', 'SpamType');
		ChangeOption('ChatOptions', 'pbspamtext', 'SpamText');

		ChangeIntegerOption('ChatOptions', 'pbspaminterval', 'SpamInterval', 1);

		ToggleOption('ChatOptions', 'CFilter', 'filter');
		ChangeOption('ChatOptions', 'pbfilter', 'fchar');

		ToggleOption('ChatOptions', 'pbChatHelpRequest', 'HelpRequest');
		ToggleOption('ChatOptions', 'pbDeleteRequest', 'DeleteRequest');
		ToggleOption('ChatOptions', 'pbDeletegAl', 'DeletegAl');
		ToggleOption('ChatOptions', 'pbDeleteFood', 'DeleteFood');
		ToggleOption('ChatOptions', 'pbDeleteAlert', 'DeleteAlert');
		ToggleOption('ChatOptions', 'pbDeleteScout', 'DeleteScout');
		ToggleOption('ChatOptions', 'pbDeleteReport', 'DeleteReport');
		ToggleOption('ChatOptions', 'pbDeleteGlobalSpam', 'DeleteGlobalSpam');
		ToggleOption('ChatOptions', 'pbDeleteAllianceSpam', 'DeleteAllianceSpam');
		ChangeOption('ChatOptions', 'pbDelFoodUsers', 'DeleteFoodUsers');
		ChangeOption('ChatOptions', 'pbDelAlertUsers', 'DeleteAlertUsers');
		ChangeOption('ChatOptions', 'pbDelScoutUsers', 'DeleteScoutUsers');

		ChangeOption('ChatOptions', 'btTowerPlay', 'TowerPlay');
		ChangeOption('ChatOptions', 'btScoutPlay', 'ScoutPlay');
		ChangeOption('ChatOptions', 'btWhisperPlay', 'WhisperPlay');

		ById('togGlobal').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatGlobal = ById('togGlobal').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatLeaders').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatLeaders = ById('togChatLeaders').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatC').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatChancy = ById('togChatC').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatVC').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatVC = ById('togChatVC').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togAll').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatAll = ById('togAll').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatAtt').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatAtt = ById('togChatAtt').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatScout').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatScout = ById('togChatScout').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togChatRecall').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatRecall = ById('togChatRecall').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('togWhisper').addEventListener('change', function () {
			Options.ChatOptions.Colors.ChatWhisper = ById('togWhisper').value;
			saveOptions();
			t.PaintChatOptions();
		}, false);
		ById('btResetChatColors').addEventListener('click', function () {
			for (var p in ChatStuff.Colors) {
				Options.ChatOptions.Colors[p] = ChatStuff.Colors[p];
			}
			saveOptions();
			t.PaintChatOptions();
		}, false);

		ToggleOption('ChatOptions', 'togChatGlory', 'GloryLeader');
		ToggleOption('ChatOptions', 'togChatRainbow', 'Rainbow');
		ChangeIntegerOption('ChatOptions', 'pbglorycheck', 'GloryLeaderInterval', 1);

		ById('pbIMGLinkHelp').addEventListener('click', t.helpimgPop, false);
		ById('pbChatStyleHelp').addEventListener('click', t.helpstylePop, false);
	},

	ChatVolumeChanged: function (val) {
		var t = Tabs.Options;
		ById('ptVolOut').innerHTML = parseInt(val * 100);
		Options.ChatOptions.Volume = parseInt(val * 100);
		saveOptions();
	},

	ChatSoundToggle: function () {
		var t = Tabs.Options;
		var dc = jQuery('#ptSoundOpts').attr('class');
		if (Options.ChatOptions.enableTowerAlert || Options.ChatOptions.enableScoutAlert || Options.ChatOptions.enableWhisperAlert) { if (dc.indexOf('divHide') >= 0) jQuery('#ptSoundOpts').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#ptSoundOpts').attr('class', 'divHide'); }
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	PaintGameOptions: function () {
		var t = Tabs.Options;
		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=togAttackPicker type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enable Target City Picker in Attack Dialog (Reinforce, Reassign and Transport)") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togHideAttackEfforts type=checkbox /></td><TD class=xtab colspan=2>' + tx("Hide Attack/Speed boosts by default in attack dialog") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togPageNav type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enhanced Page Navigation for Messages and Reports") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togAllRpts type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enhanced Alliance Reports") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRptGift type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enhanced Inbox/Report functions") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togAllMembers type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enhanced Alliance Members View") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRptClick type=checkbox /></td><TD class=xtab colspan=2>' + tx("Alliance and Messages buttons open on Report View") + '</td></tr>';

		m += '<TR><TD class=xtab><INPUT id=togResetRaids type=checkbox /></td><TD class=xtab>' + tx("Automatically restart raid timer") + '</td><td class=xtab><INPUT id=togAutoRaidToggle type=checkbox />&nbsp;' + tx("Auto-raid restart toggle on screen header") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togRaidButtons type=checkbox /></td><TD class=xtab>' + tx("Raid Stop/Resume buttons on screen header") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td><td class=xtab><INPUT id=togRaidDeleteButton type=checkbox />&nbsp;' + tx("Raid delete button on screen header") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbGoldEnable type=checkbox /></td><TD class=xtab colspan=2>' + tx("Automatically collect gold when happiness reaches") + ' <INPUT id=pbGoldLimit type=text size=2 maxlength=3 \>%</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbFoodToggle type=checkbox /></td><TD class=xtab colspan=2>' + tx("Display food alert in alliance chat when less than") + ' <INPUT id=pbFoodAlertInt type=text size=2 maxlength=3 \> ' + tx("hours of food remaining (checked every 15 min)") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togBatRounds type=checkbox /></td><TD class=xtab colspan=2>' + tx("Display Number of Rounds in Battle Reports") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togAtkDelete type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enable Delete Button on Battle Report") + '</td></tr>';

		m += '<TR><TD class=xtab><INPUT id=togGmtClock type=checkbox /></td><TD class=xtab colspan=2>' + tx("Show") + ' ' + htmlSelector({
			0: 'GMT',
			1: 'Pacific'
		}, Options.gmtClockType, 'id=btClockType') + ' ' + tx("Time next to Camelot Time") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapInfo4 type=checkbox /></td><TD class=xtab colspan=2>' + tx("Display Province, Truce Status and Player Notes in Map Tooltips") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togMapMenuInfo type=checkbox /></td><TD class=xtab colspan=2>' + tx("Include Extra Player Information in Map Context Menu") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=MapExtra type=checkbox /></td><TD class=xtab colspan=2>' + tx("Show Player & Might in map") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=MapLevel type=checkbox /></td><TD class=xtab colspan=2>' + tx("Show Tile Level in map") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=togCV type=checkbox /></td><TD class=xtab colspan=2>' + tx("Enhanced city buttons") + '</td></tr>';
		m += '<TR id=ptcvoptions1 class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=togDbClkDef type=checkbox />' + tx("Hide/Defend by Double-Clicking City Icon") + '</td></tr>';
		m += '<TR id=ptcvoptions2 class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=togColrCty type=checkbox />' + tx("Enable Colour Icon for City Faction") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR id=ptcvoptions3 class="divHide"><TD class=xtab>&nbsp;</td><TD class=xtab colspan=2><INPUT id=ptWarnAscension type=checkbox ' + (Options.WarnAscension ? 'CHECKED ' : '') + '/>' + tx("Highlight when Ascension Protection will Expire within") + ' ';
		m += '<INPUT id=ptWarnAscensionInterval type=text size=3 value="' + Options.WarnAscensionInterval + '"> ' + tx("Hours") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=pbmaintoggle type=checkbox /></td><TD class=xtab colspan=2>' + tx("Auto-select city on startup");
		m += '&nbsp;<select id=pbwhichcity>';
		m += '<option value="-1" ' + ((Options.smain == 0) ? 'selected' : '') + '>(' + tx("Previously selected city") + ')</option>';
		for (var h = 0; h < uW.seed.cities.length; h++) {
			if (h == Options.smain)
				m += '<option value=' + h + ' selected="selected">' + uW.seed.cities[h][1] + '</option>';
			else
				m += '<option value=' + h + '>' + uW.seed.cities[h][1] + '</option>';
		}
		m += '</select></td></tr>';
		m += '<TR><td class=xtab><INPUT id=btFairie type=checkbox ' + (Options.KillFairie ? 'CHECKED ' : '') + '/></td><TD class=xtab colspan=2>' + tx("Kill annoying Faire and Court popups") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=btLoginReward type=checkbox ' + (Options.LoginReward ? 'CHECKED ' : '') + '/></td><TD class=xtab colspan=2>' + tx("Auto-click and accept Daily Login Reward") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=btMagicBox type=checkbox ' + (Options.MagicBox ? 'CHECKED ' : '') + '/></td><TD class=xtab colspan=2>' + tx("Kill Merlins Magical Boxes on start up") + '</td></tr>';
		m += '</table>';

		ById('btGameOption').innerHTML = m;

		ById('btClockType').addEventListener('change', function () {
			Options.gmtClockType = this.value;
			saveOptions();
		}, false);

		ToggleOption('', 'togPageNav', 'fixPageNav', PageNavigator.enable, PageNavigator.isAvailable);
		ToggleOption('', 'togRptGift', 'enhancedinbox', DispReport.setEnable, DispReport.isDispReportAvailable);
		ToggleOption('', 'togCV', 'EnhCBtns', function () { t.EnhCBtnsToggle(); t.RestartReminder(); });
		ToggleOption('', 'togDbClkDef', 'DbClkDefBtns');
		ToggleOption('', 'togColrCty', 'ColrCityBtns', t.RestartReminder);
		t.EnhCBtnsToggle();

		ToggleOption('', 'togResetRaids', 'RaidRunning', t.ToggleRaidActive);
		ToggleOption('', 'togAutoRaidToggle', 'RaidToggle', t.RestartReminder);
		ToggleOption('', 'togRaidButtons', 'RaidButtons', t.RestartReminder);
		ToggleOption('', 'togRaidDeleteButton', 'RaidDeleteButton', t.RestartReminder);
		ToggleOption('', 'togRptClick', 'ClickForReports', t.RestartReminder);
		ToggleOption('', 'togAttackPicker', 'attackCityPicker', AttackDialog.setEnable, AttackDialog.isAvailable);
		ToggleOption('', 'togHideAttackEfforts', 'hideAttackEfforts');
		ToggleOption('', 'togGmtClock', 'gmtClock', GMTclock.setEnable);
		ToggleOption('', 'togAllRpts', 'enhanceARpts', AllianceReports.listFunc.setEnable);
		ToggleOption('', 'togAllMembers', 'enhanceViewMembers', AllianceReports.enable_viewmembers);
		ToggleOption('', 'togBatRounds', 'dispBattleRounds', null, battleReports.isRoundsAvailable);
		ToggleOption('', 'togAtkDelete', 'reportDeleteButton', null, battleReports.isRoundsAvailable);
		ToggleOption('', 'MapExtra', 'MapShowExtra');
		ToggleOption('', 'MapLevel', 'MapShowLevel');
		ToggleOption('', 'togMapInfo4', 'dispStatus', mapinfoFix.setEnableDispStatus, mapinfoFix.isAvailableDispStatus);
		ToggleOption('', 'togMapMenuInfo', 'mapMenuInfo', mapinfoFix.setMenuEnable, mapinfoFix.isMenuAvailable);
		ToggleOption('', 'btLoginReward', 'LoginReward');
		ToggleOption('', 'btMagicBox', 'MagicBox');
		ToggleOption('', 'btFairie', 'KillFairie', FairieKiller.setEnable);
		ToggleOption('', 'pbmaintoggle', 'amain');
		ChangeOption('', 'pbwhichcity', 'smain');

		ToggleOption('', 'pbGoldEnable', 'pbGoldEnable');
		ChangeOption('', 'pbGoldLimit', 'pbGoldHappy');
		ToggleOption('', 'pbFoodToggle', 'pbFoodAlert');
		ChangeOption('', 'pbFoodAlertInt', 'pbFoodAlertInt');

		ById('ptWarnAscension').addEventListener('change', t.EnhCBtnsToggle, false);
		ChangeIntegerOption('', 'ptWarnAscensionInterval', 'WarnAscensionInterval', 1, Tabs.Options.checkAscension);
	},

	PaintPBPOptions: function () {
		var t = Tabs.Options;

		var Themes = {};
		for (var a in t.Colors) Themes[a] = tx(a);

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab><INPUT id=btEveryEnable type=checkbox /></td><TD class=xtab>' + tx("Refresh KofC every") + ' <INPUT id=btEveryMins type=text size=2 maxlength=3 \> ' + tx("minutes") + '</td><TD class=xtab><INPUT id=btdetafk type=checkbox ' + (Options.detAFK ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Only when AFK") + '&nbsp;&nbsp;&nbsp;&nbsp;<INPUT id=btEveryToggle type=checkbox ' + (Options.btEveryToggle ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Add Toggle Button") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btAutoMist type=checkbox /></td><td class=xtab>' + tx('Automatically apply Potion of Mist when AFK') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btAutoMistMarch type=checkbox /></td><td class=xtab>' + tx('Automatically apply Potion of Mist if you lose it when marching') + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;<TD class=xtab colspan=2>' + tx("Use") + '&nbsp;' + htmlSelector(ScoutTroops, Options.QuickScoutTroops, ' id=btquickscouttroops class=btInput') + '&nbsp;' + tx("for Quick Scout") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;<TD class=xtab colspan=2>' + tx("Automatic march functions should ALWAYS keep") + ' <INPUT id=btfreerallyslots type=text size=2 maxlength=2 value="' + Options.FreeRallySlots + '"\> ' + tx("free rally slots") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptHideOnGoto type=checkbox /></td><TD class=xtab>' + tx("Hide PowerBot+ when clicking on Map Coordinates") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptOneClickAttack type=checkbox /></td><TD class=xtab>' + tx("Enable one-click attack from the map") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btDraggableCoords type=checkbox /></td><TD class=xtab>' + tx("Enable draggable map co-ordinates box") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btGreenCastles type=checkbox /></td><TD class=xtab>' + tx("Display selected castle in green on city selection widgets") + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptFetchMarchInfo type=checkbox /></td><TD class=xtab>' + tx("Fetch additional march information from server") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptAlertOverrideChk type=checkbox /></td><TD class=xtab>' + tx("Replace gem containers with incoming attack alert timer") + '</td></tr>';
		m += '<TR><td class=xtab><INPUT id=AlternateSortOrderChk type=checkbox /></td><td class=xtab>' + tx('Display throne room stats in alternate sort order') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btWidgetCheck type=checkbox /></td><TD class=xtab>' + tx("Enable main screen throne room widget") + '</td><td class=xtab><INPUT id=btDraggableWidget type=checkbox />&nbsp;' + tx("Draggable") + '&nbsp;<span style="font-size:14px;color:#800;">*</span>&nbsp;&nbsp;&nbsp;&nbsp;<INPUT id=btThroneHUD type=checkbox />&nbsp;' + tx("Display widget as Throne HUD") + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=TRFixPresetWidth type=checkbox /></td><td class=xtab>' + tx('Fix throne room preset changer width to 8 per row') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btGloryMight type=checkbox /></td><td class=xtab>' + tx('Display Glory Might') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btMarchMight type=checkbox /></td><td class=xtab>' + tx('Display Defending/Marching Troop Might') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=btTrafficOpt type=checkbox /></td><td class=xtab>' + tx('Display Server Traffic Monitor') + '&nbsp;<span style="font-size:14px;color:#800;">*</span></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>' + tx("Detect AFK when mouse and keyboard idle for") + ' <INPUT id=btafktimeout type=text size=2 maxlength=3 \> ' + tx("minutes") + '</td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>' + tx("Map lookup request interval") + ' <INPUT id=btmapinterval type=text size=2 maxlength=2 value="' + Options.MapInterval + '"\> ' + tx("seconds") + '</td></tr>';
		m += '<TABLE><TR><TD class=xtab colspan=3><B>' + tx("PowerBot+ Colours") + '&nbsp;<span style="font-size:16px;color:#800;">*</span></b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>' + tx("Title Background") + ': </td><TD class=xtab><INPUT id=togTitleBack type=text size=7 maxlength=7 value="' + Options.Colors.Title + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togTitleText type=text size=7 maxlength=7 value="' + Options.Colors.TitleText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.Colors.Title + ';color:' + Options.Colors.TitleText + ';"><b>' + tx('Title') + '</b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>' + tx("Divider Background") + ': </td><TD class=xtab><INPUT id=togDividerTop type=text size=7 maxlength=7 value="' + Options.Colors.DividerTop + '">&nbsp;-&nbsp;<INPUT id=togDividerBottom type=text size=7 maxlength=7 value="' + Options.Colors.DividerBottom + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togDividerText type=text size=7 maxlength=7 value="' + Options.Colors.DividerText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background: -moz-linear-gradient(top, ' + Options.Colors.DividerTop + ', ' + Options.Colors.DividerBottom + '); background: -webkit-linear-gradient(top, ' + Options.Colors.DividerTop + ', ' + Options.Colors.DividerBottom + ');color:' + Options.Colors.DividerText + ';"><b>' + tx('DIVIDER') + '</b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>' + tx("Panel Background") + ': </td><TD class=xtab><INPUT id=togPanelBack type=text size=7 maxlength=7 value="' + Options.Colors.Panel + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togPanelText type=text size=7 maxlength=7 value="' + Options.Colors.PanelText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + tx('Panel') + '</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>' + tx("Highlight Background") + ': </td><TD class=xtab><INPUT id=togHighlightBack type=text size=7 maxlength=7 value="' + Options.Colors.Highlight + '"></td><TD class=xtab>Text: </td><TD class=xtab><INPUT id=togHighlightText type=text size=7 maxlength=7 value="' + Options.Colors.HighlightText + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:' + Options.Colors.Highlight + ';color:' + Options.Colors.HighlightText + ';"><b>' + tx('Highlight') + '</b></td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>' + tx("Bold Text Colours") + ': </td><TD class=xtab><INPUT id=togBoldRed type=text size=7 maxlength=7 value="' + (Options.Colors.BoldRed || '#800') + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:#FFF;color:' + (Options.Colors.BoldRed || '#800') + ';font-weight:bold;" width=50px>' + tx('Red') + '</td><TD class=xtab>&nbsp;<INPUT id=togBoldOrange type=text size=7 maxlength=7 value="' + (Options.Colors.BoldOrange || '#F80') + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:#FFF;color:' + (Options.Colors.BoldOrange || '#F80') + ';font-weight:bold;" width=50px>' + tx('Orange') + '</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD class=xtab>&nbsp;</td><TD class=xtab><INPUT id=togBoldGreen type=text size=7 maxlength=7 value="' + (Options.Colors.BoldGreen || '#080') + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:#FFF;color:' + (Options.Colors.BoldGreen || '#080') + ';font-weight:bold;" width=50px>' + tx('Green') + '</td><TD class=xtab>&nbsp;<INPUT id=togBoldMagenta type=text size=7 maxlength=7 value="' + (Options.Colors.BoldMagenta || '#808') + '"></td><TD cellpadding=2 align=center style="border:1px solid #888888;background-color:#FFF;color:' + (Options.Colors.BoldMagenta || '#808') + ';font-weight:bold;" width=50px>' + tx('Magenta') + '</td></tr>';
		m += '<TR><TD class=xtab width=30>&nbsp;</td><TD colspan=4 class=xtab>' + tx("HTML colours") + ':&nbsp;<a class=xlink href="http://www.colorpicker.com/" target="_blank">' + tx("Colour Picker") + '</a>&nbsp;/&nbsp;<a class=xlink href="http://www.w3schools.com/html/html_colors.asp" target="_blank">' + tx('Colours') + '</a></td><td class=xtab>';
		m += tx('Theme') + ':&nbsp;' + htmlSelector(Themes, Options.Theme, 'id=btTheme') + '&nbsp' + makeButtonv2('blue', 'id=btResetColors', tx("Reset Colours"));
		m += '</td></tr>';

		m += '</table>';

		ById('btPBPOption').innerHTML = m;

		ChangeOption('', 'btEveryMins', 'btEveryMins', RefreshEvery.setTimer);
		ToggleOption('', 'btEveryEnable', 'btEveryEnable', t.changeRefreshOption);
		ToggleOption('', 'btEveryToggle', 'btEveryToggle', t.RestartReminder);
		ToggleOption('', 'btTrafficOpt', 'ShowServerTraffic', t.RestartReminder);
		ToggleOption('', 'btAutoMist', 'AutoMist');
		ToggleOption('', 'btGloryMight', 'ShowGloryMight');
		ToggleOption('', 'btMarchMight', 'ShowMarchMight');
		ToggleOption('', 'btAutoMistMarch', 'AutoMistMarch');
		ToggleOption('', 'btdetafk', 'detAFK');

		ById('togTitleBack').addEventListener('change', function () {
			Options.Colors.Title = ById('togTitleBack').value;
			saveOptions();
			t.PaintPBPOptions();
			t.RestartReminder();
		}, false);
		ById('togTitleText').addEventListener('change', function () {
			Options.Colors.TitleText = ById('togTitleText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togDividerTop').addEventListener('change', function () {
			Options.Colors.DividerTop = ById('togDividerTop').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togDividerBottom').addEventListener('change', function () {
			Options.Colors.DividerBottom = ById('togDividerBottom').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togDividerText').addEventListener('change', function () {
			Options.Colors.DividerText = ById('togDividerText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togPanelBack').addEventListener('change', function () {
			Options.Colors.Panel = ById('togPanelBack').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togPanelText').addEventListener('change', function () {
			Options.Colors.PanelText = ById('togPanelText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togHighlightBack').addEventListener('change', function () {
			Options.Colors.Highlight = ById('togHighlightBack').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togHighlightText').addEventListener('change', function () {
			Options.Colors.HighlightText = ById('togHighlightText').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togBoldRed').addEventListener('change', function () {
			Options.Colors.BoldRed = ById('togBoldRed').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togBoldOrange').addEventListener('change', function () {
			Options.Colors.BoldOrange = ById('togBoldOrange').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togBoldGreen').addEventListener('change', function () {
			Options.Colors.BoldGreen = ById('togBoldGreen').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('togBoldMagenta').addEventListener('change', function () {
			Options.Colors.BoldMagenta = ById('togBoldMagenta').value;
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);
		ById('btResetColors').addEventListener('click', function () {
			var Theme = ById('btTheme').value;
			for (var p in Tabs.Options.Colors[Theme]) {
				Options.Colors[p] = Tabs.Options.Colors[Theme][p];
			}
			saveOptions();
			t.PaintPBPOptions()
			t.RestartReminder();
		}, false);

		ToggleOption('', 'ptOneClickAttack', 'OneClickAttack', t.RestartReminder);
		ToggleOption('', 'btDraggableCoords', 'DraggableCoords', t.RestartReminder);
		ToggleOption('', 'btGreenCastles', 'GreenCastles', t.RestartReminder);
		ToggleOption('', 'ptHideOnGoto', 'hideOnGoto');
		ToggleOption('', 'ptFetchMarchInfo', 'FetchMarchInfo');
		ToggleOption('', 'ptAlertOverrideChk', 'OverrideAttackAlert');
		ChangeOption('', 'btTheme', 'Theme');
		ChangeOption('', 'btafktimeout', 'AFKTimeout', afkdetector.reset);

		ById('btquickscouttroops').addEventListener('change', function () {
			Options.QuickScoutTroops = ById('btquickscouttroops').value;
			saveOptions();
		}, false);

		ToggleOption('', 'AlternateSortOrderChk', 'AlternateSortOrder');
		ToggleOption('', 'btWidgetCheck', 'TRWidget', function () { Dashboard.PaintTRPresets(); WideScreen.CheckChatPosition(); });
		ToggleOption('', 'btDraggableWidget', 'DraggableWidget', t.RestartReminder);
		ToggleOption('', 'btThroneHUD', 'ThroneHUD', function () { Options.presetPosition = null; t.SetTRWidgetDisplay(); Dashboard.PaintTRPresets(); WideScreen.CheckChatPosition(); });
		ToggleOption('', 'TRFixPresetWidth', 'TRFixPresetWidth', Dashboard.PaintTRPresets);


		ChangeIntegerOption('', 'btmapinterval', 'MapInterval', 2, function () { MAP_DELAY = Options.MapInterval * 1000; });

		ChangeIntegerOption('', 'btfreerallyslots', 'FreeRallySlots');
	},

	PaintLanguageOptions: function () {
		var t = Tabs.Options;

		m = '<TABLE width="100%">';
		m += '<TR><TD class=xtab>&nbsp;</td><TD class=xtab>' + tx('Current Language') + ':&nbsp;<select id=btChangeLang>';
		for (var l in uW.g_supportedLangugages) {
			m += '<option value="' + l + '" ' + ((Options.Language == l) ? "selected" : "") + '>' + uW.g_supportedLangugages[l] + '</option>';
		}
		m += '</select>&nbsp;' + strButton20(uW.g_js_strings.getUserSettings.changelang, 'id=btChangeLangButton') + '&nbsp;' + strButton20(tx('Refresh'), 'id=btRefreshLangButton') + '</td>';
		m += '<TD colspan=2 class=xtab align=right>' + t.languagestatus + '&nbsp;&nbsp;</td></tr>';
		m += '<TR><td class=xtab>&nbsp;</td><td class=xtab><input class=btInput id=btEditLang type=button value="' + tx("Edit Translations") + '"></td></tr></table>';

		ById('btLanguage').innerHTML = m;

		ById('btChangeLangButton').addEventListener('click', t.ChangeLanguage, false);
		ById('btRefreshLangButton').addEventListener('click', t.ChangeLanguage, false);
		ById('btEditLang').addEventListener('click', t.editTranslations, false);
	},

	PaintTabManagerOptions: function () {
		var t = Tabs.Options;

		var m = '<TABLE width="100%">';
		m += '<TR><TD colspan=2 class=xtab><b>' + tx('Additional Tabs') + '</b></td><td colspan=2 class=xtab align=right><INPUT id=btTabAutoCheck type=checkbox />&nbsp;' + tx("Automatically Check for Updates") + '&nbsp;<a class="inlineButton btButton blue14" onclick="btTabReloadAll()"><span>' + tx('Check Now') + '</span></a></td></tr>';
		m += '</table><TABLE width="100%" cellspacing=0 cellpadding=2>';

		var r = 0;
		for (var e in GlobalOptions.ExtraTabs) {
			if (GlobalOptions.ExtraTabs[e].source) {
				var dispvers = '';
				if (GlobalOptions.ExtraTabs[e].version && GlobalOptions.ExtraTabs[e].version != "0") dispvers = 'v' + GlobalOptions.ExtraTabs[e].version;
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				m += '<TR class="' + rowClass + '"><TD width=30 class=xtab><INPUT id="btTabEnabled_' + e + '" type=checkbox ' + (GlobalOptions.ExtraTabs[e].enabled ? 'CHECKED' : '') + ' onclick="btTabToggle(' + e + ')" /></td><TD class=xtab>' + GlobalOptions.ExtraTabs[e].source + '</td><td class=xtab align=right><span style="font-size:8px;">' + dispvers + '</span></td><td class=xtab align=right width=100px><a id="btTabRefresh_' + e + '" class="inlineButton btButton brown8" onclick="btTabRefresh(' + e + ')"><span>' + tx('Reload') + '</span></a>&nbsp;<a id="btTabDelete_' + e + '" class="inlineButton btButton brown8" onclick="btTabDelete(' + e + ')"><span>' + tx('Remove') + '</span></a></td></tr>';
			}
		}
		m += '<TR><TD width=30 class=xtab>&nbsp;</td><TD colspan=2 class=xtab><INPUT title="' + tx('Enter the URL for the remote source code of the additional tab - NOTE THIS CANNOT BE A LOCAL FILE!') + '" class="btInput" id="btTabSource" type=text style="width:450px;" value=""></td><td class=xtab align=right width=100px><a id="btTabAdd" class="inlineButton btButton brown8" onclick="btTabAdd()"><span>' + tx('Add Tab') + '</span></a></td></tr>';
		m += '<TR><TD align=center class=xtab colspan=4 id=btTabMessage>&nbsp;</td></tr>';

		m += '<TR style="display:none;"><TD class=xtab colspan=4><br><div align=center>' + tx('Autoport Access Code') + ':&nbsp;<input class=btInput type="text" value="' + Options.PremiumAccessCode + '" id="btPremiumCode"/></div><br></td></tr>';
		m += '</table><TABLE width="100%">';
		m += '<TR><TD colspan=2 class=xtab>&nbsp;</td><td colspan=2 class=xtab align=right><a class="inlineButton btButton red14" onclick="btTabReset()"><span>' + tx('Reset Additional Tabs') + '</span></a></td></tr>';
		m += '</table>';

		ById('btTabManager').innerHTML = m;

		t.togGlobalOpt('btTabAutoCheck', 'TabAutoCheck');
		ChangeOption('', 'btPremiumCode', 'PremiumAccessCode', t.RestartReminder);

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	ToggleTRPreset: function (entry) {
		var t = Tabs.Options;
		if (!Options.DashboardOptions.TRPresetsSelected[entry]) { Options.DashboardOptions.TRPresetsSelected[entry] = true; }
		Options.DashboardOptions.TRPresetsSelected[entry] = ById('btpresetSelect' + entry).checked;
		saveOptions();
	},

	TabToggle: function (e) {
		var t = Tabs.Options;
		GlobalOptions.ExtraTabs[e].enabled = ById('btTabEnabled_' + e).checked;
		if (GlobalOptions.ExtraTabs[e].enabled && !GlobalOptions.ExtraTabs[e].data) {
			t.TabLoad(e);
		}
		saveGlobalOptions();
		t.RestartReminder();
	},

	RotateThrone: function () {
		var t = Tabs.Options;
		var activeSlot = Number(Seed.throne.activeSlot);
		var oldActive = activeSlot;
		var foundone = false;
		do {
			activeSlot++;
			if (activeSlot > Number(Seed.throne.slotNum)) activeSlot = 1;
			if (Options.DashboardOptions.TRPresetsSelected[activeSlot]) {
				SwitchThroneRoom(activeSlot);
				foundone = true;
				break;
			}
		}
		while (!foundone && (activeSlot != oldActive))
	},

	TabDelete: function (e) {
		var t = Tabs.Options;
		GlobalOptions.ExtraTabs.splice(e, 1);
		saveGlobalOptions();
		t.RestartReminder();
		t.PaintTabManagerOptions();
		ById('btTabMessage').innerHTML = tx('Tab Removed');
	},

	TabRefresh: function (e) {
		var t = Tabs.Options;
		t.TabLoad(e);
	},

	TabReset: function () {
		var t = Tabs.Options;
		delete GlobalOptions.ExtraTabs;
		saveGlobalOptions();
		t.RestartReminder();
		t.PaintTabManagerOptions();
	},

	TabReloadAll: function () {
		var t = Tabs.Options;
		CheckDelay = 0;
		ById('btTabMessage').innerHTML = tx('Checking Additional Tabs for updates') + '...';
		for (var e in GlobalOptions.ExtraTabs) {
			if (GlobalOptions.ExtraTabs[e].enabled) {
				CheckDelay++;
				setTimeout(t.TabLoad, (CheckDelay * 1250), e, true);
			}
		}
		CheckDelay++;
		setTimeout(function () { ById('btTabMessage').innerHTML = tx('Complete! Please reload Kingdoms of Camelot') + '!'; }, (CheckDelay * 1250));
	},

	TabAdd: function () {
		var t = Tabs.Options;
		var TabObj = {};
		TabObj.source = ById('btTabSource').value.trim();
		TabObj.data = null;
		TabObj.enabled = true;
		TabObj.lastchecked = 0;
		GlobalOptions.ExtraTabs.push(TabObj);
		t.TabLoad(GlobalOptions.ExtraTabs.length - 1);
	},

	TabLoad: function (e, background) {
		var t = Tabs.Options;
		var src = GlobalOptions.ExtraTabs[e].source;
		if (src != "") {
			var TabMessage = tx('Tab Added');
			if (GlobalOptions.ExtraTabs[e].data) {
				TabMessage = tx('Tab Updated');
			}
			GlobalOptions.ExtraTabs[e].lastchecked = unixTime();
			saveGlobalOptions();
			remotefun = function (e) {
				try {
					GM_xmlhttpRequest({
						method: 'GET',
						url: src + '?' + new Date(),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
						},
						onload: function (remote) {
							if (remote.status == 200) {
								try {
									var oldvers = null;
									if (GlobalOptions.ExtraTabs[e].data) { oldvers = /\/\/\s*@tabversion\s+(.+)\s*\n/i.exec(atob(GlobalOptions.ExtraTabs[e].data)); }
									if (oldvers) { oldvers = oldvers[1]; } else { oldvers = '0'; }
									var newvers = /\/\/\s*@tabversion\s+(.+)\s*\n/i.exec(remote.responseText);
									if (newvers) { newvers = newvers[1]; } else { newvers = '0'; }
									if (!background || AutoUpdater.compareVersion(newvers, oldvers)) {
										GlobalOptions.ExtraTabs[e].data = btoa(unescape(encodeURIComponent(remote.responseText)));
										GlobalOptions.ExtraTabs[e].version = newvers;
										saveGlobalOptions();
										if (!background) { t.RestartReminder(); }
										else { actionLog(TabMessage + ': ' + src + ' (' + tx('Restart Required') + ')', 'GENERAL'); }
									}
								}
								catch (err) {
									TabMessage = err.message;
									logerr(err);
								}
							}
							else {
								TabMessage = tx('Unable to open source file');
								logit('unable to open file ' + src);
							}
							if (!GlobalOptions.ExtraTabs[e].data) {
								GlobalOptions.ExtraTabs.splice(e, 1); // remove bad tab
								saveGlobalOptions();
							}
							if (!background) {
								t.PaintTabManagerOptions();
								ById('btTabMessage').innerHTML = TabMessage;
							}
						},
					});
				} catch (err) { logerr(err); }
			}
			setTimeout(remotefun, 0, e);
		}
	},

	ChangeLanguage: function () {
		var t = Tabs.Options;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.lang = ById('btChangeLang').value;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/changeLanguage.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				Options.Language = (params.lang);
				LanguageArray = {};
				t.LoadLanguage(Options.Language, function () { saveLanguage(Options.Language); ReloadKOC(false, '&lang=' + Options.Language); });
			},
		}, true);
	},

	LoadLanguage: function (lang, notify) {
		var t = Tabs.Options;
		Options.LanguageLastChecked = unixTime();
		saveOptions();
		var LangURL = 'https://github.com/prahzera/KoC-PowerBotPlus/releases/latest/download/lang_' + lang + '.json?' + new Date();
		try {
			GM_xmlhttpRequest({
				method: 'GET',
				url: LangURL,
				onload: function (xpr) {
					var rslt = null;
					if (xpr.status == 200) {
						try {
							rslt = JSON2.parse(xpr.responseText);
						} catch (e) {
							t.languagestatus = "<span class=boldRed>Invalid Language Pack</span>";
							logerr(e);
							if (notify) { notify(); }
							return;
						}

						if (!LanguageArray.CurrLang || LanguageArray.CurrLang != rslt.CurrLang) {
							t.UpdateLangArray(rslt);
						}
						else {
							if (!LanguageArray.LangVersion || parseIntNan(LanguageArray.LangVersion.substring(0, 8)) < parseIntNan(rslt.LangVersion.substring(0, 8))) {
								t.languagestatus = "New Language Pack Available!";
							}
						}
					}
					if (notify) { notify(); }
				},
				onerror: function () {
					t.languagestatus = tx('Language pack unavailable');
					if (notify) { notify(); }
				}
			});
		} catch (e) { logerr(e); }
	},

	UpdateLangArray: function (rslt) {
		var t = Tabs.Options;
		for (var k in rslt) {
			LanguageArray[k] = rslt[k];
		}
		saveLanguage(Options.Language);
		t.languagestatus = tx('Language pack') + ' (' + rslt.CurrLang + ') ' + tx('Version') + ' ' + rslt.LangVersion + ' ' + tx('loaded');
	},

	editTranslations: function () {
		var t = Tabs.Options;

		var m = '<table width=98% align=center class=xtab cellpadding=0 cellspacing=0>';

		m += '<tr><td class=xtab>&nbsp;</td><td class=xtab align=left><input class=btInput id=btSaveLang type=button value="' + tx("Save Changes") + '"></td><td class=xtab align=right><input class=btInput id=btExportLang type=button value="' + tx("Export") + '">&nbsp;<input class=btInput id=btImportLang type=button value="' + tx("Import") + '">&nbsp;<input class=btInput id=btImportLangFile type=file></td></tr>';
		m += '<tr><td colspan=3 align=center id=btEditTransMsg><span class=boldRed>' + tx("¡Salir sin guardar hará que se pierdan los cambios!") + '</span></td></table>';
		m += '<div style="max-height:420px;overflow-y:auto;max-width:' + GlobalOptions.btWinSize.x + 'px;"><br><table align=center cellspacing=0 cellpadding=0 class=xtab width=98%>';

		if (!LanguageArray.CurrLang) {
			LanguageArray.CurrLang = Options.Language;
		}
		var r = 0;
		m += '<tr class="oddRow"><td class=xtabBRTop><div class="wrap" style="width:' + (GlobalOptions.btWinSize.x - 360) + 'px;">CurrLang</div></td><td>' + LanguageArray.CurrLang + '</td></tr>';
		r = r + 1;
		if (LanguageArray.LangVersion) {
			m += '<tr class="evenRow"><td class=xtabBRTop><div class="wrap" style="width:' + (GlobalOptions.btWinSize.x - 360) + 'px;">LangVersion</div></td><td>' + LanguageArray.LangVersion + '</td></tr>';
			r = r + 1;
		}

		for (var l in NoTranslation) {
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			m += '<tr class="' + rowClass + '"><td class=xtabBRTop><div class="wrap" style="width:' + (GlobalOptions.btWinSize.x - 360) + 'px;">' + l + '</div></td><td><input style="width:300px;" id="btlang_' + escape(l) + '" value="' + NoTranslation[l] + '"/></td></tr>';
		}
		for (var l in LanguageArray) {
			if (l != "CurrLang" && l != "LangVersion") {
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				m += '<tr class="' + rowClass + '"><td class=xtabBRTop><div class="wrap" style="width:' + (GlobalOptions.btWinSize.x - 360) + 'px;">' + l + '</div></td><td><input style="width:300px;" id="btlang_' + escape(l) + '" value="' + LanguageArray[l] + '"/></td></tr>';
			}
		}
		m += '</table></div>';

		t.popLang = new CPopup('btEditLanguage', 10, 10, GlobalOptions.btWinSize.x, 500, true, function () { saveLanguage(Options.Language); t.popLang.destroy(); });
		t.popLang.getTopDiv().innerHTML = '<div align=center><B>' + tx("Edit Translations") + '</div>';
		t.popLang.getMainDiv().innerHTML = m;
		t.popLang.show(true);

		ById("btSaveLang").addEventListener('click', function () {
			for (var l in LanguageArray) {
				var elem = ById("btlang_" + escape(l));
				if (elem && elem.value != '') {
					LanguageArray[l] = elem.value;
				}
			}
			for (var l in NoTranslation) {
				var elem = ById("btlang_" + escape(l));
				if (elem && elem.value != '') {
					LanguageArray[l] = elem.value;
					delete NoTranslation[l];
				}
			}
			saveLanguage(Options.Language);
			saveOptions();
			t.popLang.getTopDiv().innerHTML = '<div align=center><B>' + tx("Traducciones guardadas — Recargando página...") + '</div>';
			setTimeout(function () { ReloadKOC(false, '&lang=' + Options.Language); }, 500);
		}, false);

		ById('btExportLang').addEventListener('click', function () {
			var Export = {};
			for (var k in LanguageArray) {
				Export[k] = LanguageArray[k];
			}
			if (Options.Language === 'en') {
				for (var k in NoTranslation) {
					Export[k] = NoTranslation[k];
				}
			}
			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			t.saveConfig(uriContent, 'lang_' + LanguageArray.CurrLang + '.txt');
			ById('btEditTransMsg').innerHTML = tx('Traducciones exportadas — El archivo se descargará');
		}, false);

		ById('btImportLang').addEventListener('click', function () {
			var fileInput = ById("btImportLangFile");
			var files = fileInput.files;
			if (files.length == 0) { return; }
			var file = files[0];
			var reader = new FileReader();
			reader.onload = function (e) {
				try {
					var Import = JSON2.parse(e.target.result);
					if (Import.CurrLang) {
						LanguageArray.CurrLang = Import.CurrLang;
						Options.Language = Import.CurrLang;
					}
					for (var k in Import) {
						if (Import[k] != "") {
							LanguageArray[k] = Import[k];
							if (NoTranslation.hasOwnProperty(k)) delete NoTranslation[k];
						}
					}
					ById('btEditTransMsg').innerHTML = '¡Traducciones importadas! — Haz clic en "Guardar Cambios" y luego recarga la página';
					t.editTranslations();
				} catch (err) {
					ById('btEditTransMsg').innerHTML = 'Error: Formato de archivo inválido';
				}
			};
			reader.readAsText(file);
		}, false);
	},

	togGlobalOpt: function (checkboxId, optionName, callOnChange) {
		var t = Tabs.Options;
		var checkbox = ById(checkboxId);
		checkbox.checked = GlobalOptions[optionName];
		checkbox.addEventListener('change', eventHandler, false);
		function eventHandler() {
			GlobalOptions[optionName] = this.checked;
			saveGlobalOptions();
			if (callOnChange) { callOnChange(this.checked); }
		}
	},

	changeGlobalOpt: function (valueId, optionName, callOnChange) {
		var t = Tabs.Options;
		var e = ById(valueId);
		e.value = GlobalOptions[optionName];
		e.addEventListener('change', eventHandler, false);
		function eventHandler() {
			GlobalOptions[optionName] = this.value;
			saveGlobalOptions();
			if (callOnChange) { callOnChange(this.value); }
		}
	},

	togUserOpt: function (checkboxId, optionName, callOnChange, callIsAvailable) {
		var t = Tabs.Options;
		var checkbox = ById(checkboxId);
		if (callIsAvailable && callIsAvailable() == false) {
			checkbox.disabled = true;
			return;
		};
		checkbox.checked = UserOptions[optionName];
		checkbox.addEventListener('change', eventHandler, false);
		function eventHandler() {
			UserOptions[optionName] = this.checked;
			saveUserOptions(uW.user_id); // facebook user id
			if (callOnChange) { callOnChange(this.checked); }
		}
	},

	changeUserOpt: function (valueId, optionName, callOnChange) {
		var t = Tabs.Options;
		var e = ById(valueId);
		e.value = UserOptions[optionName];
		e.addEventListener('change', eventHandler, false);
		function eventHandler() {
			UserOptions[optionName] = this.value;
			saveUserOptions(uW.user_id); // facebook user id
			if (callOnChange) { callOnChange(this.value); }
		}
	},

	ResetDash: function () {
		var t = Tabs.Options;
		for (var p in Dashboard.DefaultDashboard) {
			ById('dashSeq' + p).value = Dashboard.DefaultDashboard[p].Sequence;
			ById('dashDisp' + p).checked = Dashboard.DefaultDashboard[p].Display;
		}
		Options.DashboardOptions.OverrideDashboard = {};
		saveOptions();
		WideScreen.RestartDashboard();
	},

	OverrideDash: function (sect) {
		var NewObj = {};
		if (Options.DashboardOptions.OverrideDashboard[sect]) {
			NewObj.Display = Options.DashboardOptions.OverrideDashboard[sect].Display;
			NewObj.Sequence = Options.DashboardOptions.OverrideDashboard[sect].Sequence;
		}
		else {
			NewObj.Display = Dashboard.DefaultDashboard[sect].Display;
			NewObj.Sequence = Dashboard.DefaultDashboard[sect].Sequence;
		}
		if (isNaN(ById('dashSeq' + sect).value)) { ById('dashSeq' + sect).value = 0; }
		NewObj.Sequence = ById('dashSeq' + sect).value;
		NewObj.Display = ById('dashDisp' + sect).checked;
		Options.DashboardOptions.OverrideDashboard[sect] = NewObj;
		saveOptions();
		WideScreen.RestartDashboard();
	},

	SacToggle: function () {
		var dc = jQuery('#btSacOpts').attr('class');
		if (Options.DashboardOptions.DefaultSacrifice) { if (dc.indexOf('divHide') >= 0) jQuery('#btSacOpts').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#btSacOpts').attr('class', 'divHide'); }
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	DefToggle: function () {
		var dc = jQuery('#btDefOpts').attr('class');
		if (Options.DashboardOptions.DefAddTroopShow) { if (dc.indexOf('divHide') >= 0) jQuery('#btDefOpts').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#btDefOpts').attr('class', 'divHide'); }
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	PresetToggle: function () {
		var dc = jQuery('#btPresetByNameOpts').attr('class');
		if (Options.DashboardOptions.TRPresetChange) { if (dc.indexOf('divHide') >= 0) jQuery('#btPresetByNameOpts').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#btPresetByNameOpts').attr('class', 'divHide'); }
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
		Dashboard.PaintTRPresets();
	},

	EnhCBtnsToggle: function () {
		var dc1 = jQuery('#ptcvoptions1').attr('class');
		var dc2 = jQuery('#ptcvoptions2').attr('class');
		var dc3 = jQuery('#ptcvoptions3').attr('class');
		if (Options.EnhCBtns) {
			if (dc1.indexOf('divHide') >= 0) jQuery('#ptcvoptions1').attr('class', '');
			if (dc2.indexOf('divHide') >= 0) jQuery('#ptcvoptions2').attr('class', '');
			if (dc3.indexOf('divHide') >= 0) jQuery('#ptcvoptions3').attr('class', '');
		}
		else {
			if (dc1.indexOf('divHide') < 0) jQuery('#ptcvoptions1').attr('class', 'divHide');
			if (dc2.indexOf('divHide') < 0) jQuery('#ptcvoptions2').attr('class', 'divHide');
			if (dc3.indexOf('divHide') < 0) jQuery('#ptcvoptions3').attr('class', 'divHide');
		}
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		Options.WarnAscension = ById('ptWarnAscension').checked;
		saveOptions();
		clearInterval(t.WarnAscensionTimer);
		if (Options.EnhCBtns && Options.WarnAscension) {
			t.WarnAscensionTimer = setInterval(function () {
				Tabs.Options.checkAscension();
			}, 60 * 1000); // every min?
		}
		Tabs.Options.checkAscension();
	},

	checkAscension: function () {
		var t = Tabs.Options;
		for (var i = 0; i < uW.seed.cities.length; i++) {
			var cityidx = i + 1;
			var city = ById('citysel_' + cityidx);
			if (!city) {
				setTimeout(t.checkAscension, 2000);
				return;
			}
			if (!Options.WarnAscension || !Options.EnhCBtns) {
				jQuery('#citysel_' + cityidx).removeClass('city_warning');
			} else {
				var cityExpTime = uW.seed.cityData.city[uW.seed.cities[i][0]].prestigeInfo.prestigeBuffExpire;
				if (!isNaN(cityExpTime) && (cityExpTime >= unixTime()) && ((cityExpTime - unixTime()) <= (Options.WarnAscensionInterval * 3600))) {
					if (jQuery('#citysel_' + cityidx).hasClass('city_unselected')) {
						jQuery('#citysel_' + cityidx).addClass('city_warning');
					}
				} else {
					jQuery('#citysel_' + cityidx).removeClass('city_warning');
				}
			}
		}
	},

	MiniRefreshChanged: function () {
		var t = Tabs.Options;
		Options.MiniRefresh = ById('ptEnableMiniRefresh').checked;
		saveOptions();
		t.MiniRefresh();
	},

	MiniRefresh: function () {
		var t = Tabs.Options;
		clearTimeout(t.MiniRefreshTimer);
		if (Options.MiniRefresh) {
			if (!Options.DashboardOptions.RefreshSeed && !RefreshingSeed) {
				RefreshSeed();
			}
			t.MiniRefreshTimer = setTimeout(t.MiniRefresh, Options.MiniRefreshInterval * 60 * 1000);
		}
	},

	AddUserLists: function () { // obsolete code. Kept for posterity
		var t = Tabs.Options;

		uW.FB.getLoginStatus(function (response) { if (response.status != 'connected') { return; } });
		uW.FB.login(function (o) {
			if (o.authResponse) {
				var p = {
					access_token: o.authResponse.accessToken
				};
				uW.FB.api('/me/friendlists', p, function (result) {
					UserOptions.CustomPublish = {};
					var markup = '';
					for (var l in t.PublishLists) {
						var selected = "";
						if (UserOptions.autoPublishPrivacySetting == l) selected = "selected";
						markup += '<option value="' + l + '" ' + selected + '>' + t.PublishLists[l] + '</option>';
					}
					var lists = result.data;
					for (var i in lists) {
						if (lists[i].list_type == 'user_created') {
							UserOptions.CustomPublish[lists[i].id] = lists[i].name;
							var selected = "";
							if (UserOptions.autoPublishPrivacySetting == lists[i].id) selected = "selected";
							markup += '<option value="' + lists[i].id + '" ' + selected + '>' + lists[i].name + '</option>';
						}
					}
					saveUserOptions(uW.user_id); // facebook user id
					ById('selectprivacymode').innerHTML = markup;
				});
			}
		}, { scope: "read_friendlists" });
	},

	ResetAllWindows: function () {
		DefaultWindowPos('btWinPos', 'main_engagement_tabs', true);
		mouseMainTab({ button: 2 });

		DefaultWindowPos('btDashPos', 'main_engagement_tabs', true);
		if (Options.btFloatingDashboard) ResetWindowPos({ button: 2 }, 'main_engagement_tabs', popDash);

		DefaultWindowPos('btIncPos', 'main_engagement_tabs', true);
		ResetWindowPos({ button: 2 }, 'main_engagement_tabs', popInc);

		DefaultWindowPos('btOutPos', 'main_engagement_tabs', true);
		ResetWindowPos({ button: 2 }, 'main_engagement_tabs', popOut);

		DefaultWindowPos('btMarchPos', 'main_engagement_tabs', true);
		ResetWindowPos({ button: 2 }, 'main_engagement_tabs', popMarch);

		DefaultWindowPos('btMonPos', 'main_engagement_tabs', true);
		ResetWindowPos({ button: 2 }, 'main_engagement_tabs', popMon);

		if (uW.btGuardWidget) { uW.btGuardWidget.resetGuardWidget(); }

		actionLog('All window positions reset', 'OPTIONS');
	},

	ResetAll: function () {
		hideMe();
		ModalMultiButton({
			buttons: [
				{
					txt: "Reset ALL Options!", exe: function () {
						uW.Modal.hideModal();
						setTimeout(function () {
							var RemoveList = (GM_listValues());
							for (i = 0; i < RemoveList.length; i++) {
								GM_deleteValue(RemoveList[i]);
							}
							ResetAll = true;
							actionLog('Powerbot+ restored to factory settings');
							ReloadKOC();
						}, 0);
					}
				},
				{
					txt: "Cancel Request", exe: function () {
						uW.Modal.hideModal();
					}
				}
			],
			body: "<center> Please confirm you want to return PowerBot+ to Factory Settings?<br>Note this affects all domains...</center>",
			title: "Reset ALL PowerBot+ Options"
		});
	},

	ResetSettings: function () {
		hideMe();
		ModalMultiButton({
			buttons: [
				{
					txt: "Reset Settings", exe: function () {
						uW.Modal.hideModal();
						setTimeout(function () {
							var serverID = getServerId();
							GM_deleteValue('Options_??');
							GM_deleteValue('Options_' + serverID + '_' + uW.tvuid);
							ResetAll = true;
							actionLog('Powerbot+ configuration reset');
							Tabs.ActionLog.save();
							ReloadKOC();
						}, 0);
					}
				},
				{
					txt: "Cancel Request", exe: function () {
						uW.Modal.hideModal();
					}
				}
			],
			body: "<center> Please confirm you want to reset PowerBot+ settings to default values?</center>",
			title: "Reset Settings"
		});
	},

	RestartReminder: function () {
		var t = Tabs.Options;
		var div = ById('ptRestart');
		if (!div) {
			var div = document.createElement('div');
			div.id = 'ptRestart';
			uWExportFunction('ReloadKOC', ReloadKOC);
			var msg = tx('Changes to Power Bot Plus Settings require Kingdoms of Camelot to be reloaded') + '... <a onClick="ReloadKOC();">[' + tx('Reload') + ']</a>&nbsp;<a onClick="this.parentNode.parentNode.style.display=\'none\';">[' + uW.g_js_strings.commonstr.close + ']</a>';
			div.innerHTML = '<DIV style="background: #fde073; text-align: center; line-height: 2.5; overflow: hidden; -webkit-box-shadow: 0 0 5px black; -moz-box-shadow: 0 0 5px black; box-shadow: 0 0 5px black;">' + msg + '</div>';
			document.body.insertBefore(div, document.body.firstChild);
		}
	},

	ToggleSpamActive: function () {
		var t = Tabs.Options;
		if (Options.ChatOptions.SpamActive) { // reset last sent time...
			Options.ChatOptions.LastSpamSent = 0;
			saveOptions();
		}
	},

	ToggleRaidActive: function () {
		var t = Tabs.Options;
		if (Options.RaidRunning) { // reset last sent time...
			Options.RaidLastReset = 0;
			saveOptions();
		}
		SetToggleButtonState('Raids', Options.RaidRunning, 'Raids');
	},

	resetRaids: function (cityId, cityName) {
		var t = Tabs.Options;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'resetRaidTimer';
		params.settings = {};
		params.settings.cityId = cityId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					uW.cityinfo_army();
					setTimeout(uW.update_seed_ajax, 250);
				}
			},
		});
	},

	CheckWatchTower: function () {
		var t = Tabs.Options;
		var now = unixTime();
		var incoming = false;
		for (var k in local_atkinc) { // check each incoming march
			var m = local_atkinc[k];
			if (m.marchType == 3 || m.marchType == 4) {
				if (Options.TowerOptions.HandledMarches.indexOf(String(m.mid) + String(m.departureTime)) == -1) { // new attack!!
					Options.TowerOptions.HandledMarches.push(String(m.mid) + String(m.departureTime));
					if (Cities.byID[m.toCityId] && Cities.byID[m.toCityId].tileId == m.toTileId) { // only save times on city attacks
						if (!Options.TowerOptions.LatestAttackTimes[m.toCityId] || (Number(m.arrivalTime) > Options.TowerOptions.LatestAttackTimes[m.toCityId])) {
							Options.TowerOptions.LatestAttackTimes[m.toCityId] = Number(m.arrivalTime); // arrival times by city.
							if (Number(m.arrivalTime) > Options.TowerOptions.LastAttack) {
								Options.TowerOptions.LastAttack = Number(m.arrivalTime); // global last attack time var.
							}
						}
					}
					saveOptions();
					t.newIncoming(m);
				};
				incoming = true;
			}
		}

		if (!incoming) { // all clear!
			if (Options.TowerOptions.RecentActivity) {
				// belt and braces - reset last attack values if they are later than now...
				if (parseInt(Options.TowerOptions.LastAttack) > now) {
					Options.TowerOptions.LastAttack = now;
				}
				for (var cid in Options.TowerOptions.LatestAttackTimes) {
					if (parseInt(Options.TowerOptions.LatestAttackTimes[cid]) > now) {
						Options.TowerOptions.LatestAttackTimes[cid] = now;
					}
				}
			}
			Options.TowerOptions.HandledMarches = new Array(); // cleanup
		}

		// Start or Stop Sound Alert!

		if (incoming && Options.TowerOptions.alertSound.alarmActive) {
			if (ById('btDashAlarmOff')) {
				if (!ById('btDashAlarmOffButton')) {
					ById('btDashAlarmOff').innerHTML = strButton14(tx('Silence Alarm') + '!', 'id=btDashAlarmOffButton', 'red14');
					ById('btDashAlarmOffButton').addEventListener('click', t.stopSoundAlerts, false);
				}
			}
			else {
				if (!ById("towersirentab")) {
					AddSubTabLink(tx('Silence Alarm') + '!', t.stopSoundAlerts, 'towersirentab', 'red20');
				}
			}
		}
		if (Options.TowerOptions.alertSound.alarmActive && ((now > Options.TowerOptions.alertSound.expireTime) || !incoming)) {
			var element = ById('towersirentab');
			if (element) { element.parentNode.removeChild(element); }
			if (ById('btDashAlarmOff')) { ById('btDashAlarmOff').innerHTML = ''; }
			t.stopSoundAlerts();
		}

		// Check Action Reverts

		if (Options.TowerOptions.RecentActivity) {
			for (var cid in Options.TowerOptions.RecentCityActivity) { // check each city action..
				if (Options.TowerOptions.RecentCityActivity[cid] === true) {
					var switchtime = parseInt(Options.TowerOptions.LatestAttackTimes[cid]);
					if (Options.TowerOptions.Revert) switchtime += Options.TowerOptions.RevertMinutes * 60;
					if (switchtime < now) {
						actionLog(Cities.byID[cid].name + ': All Clear', 'TOWER');
						if (Options.TowerOptions.Revert && (afkdetector.isAFK || !Options.TowerOptions.AFKEvents)) {
							// change guardian back
							if (Options.TowerOptions.ChangeGuardian) {
								if (Options.TowerOptions.SaveCityState[cid].Guardian != Seed.guardian[Cities.byID[cid].idx].type) {
									actionLog(Cities.byID[cid].name + ': Resetting Guardian', 'TOWER');
									SwitchGuardian(cid, Options.TowerOptions.SaveCityState[cid].Guardian);
								}
							}
							// change champion back...
							if (Options.TowerOptions.ChangeChamp) {
								if (Options.TowerOptions.SaveCityState[cid].Champion != getCityChampion(cid).championId && getChampionCity(Options.TowerOptions.SaveCityState[cid].Champion) == 0) {
									actionLog(Cities.byID[cid].name + ': Resetting City Champion', 'TOWER');
									setTimeout(SwitchChampion, 3000, cid, Options.TowerOptions.SaveCityState[cid].Champion); // delay 3 seconds
								}
							}
							// restart raids in city...
							if (Options.TowerOptions.StopRaids) {
								actionLog(Cities.byID[cid].name + ': Restarting Raids', 'TOWER');
								ToggleCityRaids(cid, 'resumeAll');
							}
						}
						Options.TowerOptions.RecentCityActivity[cid] = false; // switch off
						if (Options.TowerOptions.SaveCityState[cid]) {
							setTimeout(function () {
								if (!Options.TowerOptions.RecentCityActivity[cid] === true) { // double check!
									delete Options.TowerOptions.SaveCityState[cid];
									if (Options.TowerOptions.StopMarches) {
										actionLog(Cities.byID[cid].name + ': Automatic march functions resumed', 'TOWER');
									}
								}
							}, 10000); // cleanup (which will allow marches again) 10 sec delay so raids get going first...
						}
					}
				}
			}

			var switchtime = parseInt(Options.TowerOptions.LastAttack);
			if (Options.TowerOptions.Revert) switchtime += Options.TowerOptions.RevertMinutes * 60;
			if (switchtime < now) {
				if (Options.TowerOptions.Revert && (afkdetector.isAFK || !Options.TowerOptions.AFKEvents)) {
					// Switch TR back if required
					if (Options.TowerOptions.ChangeTR) {
						if (Options.TowerOptions.SaveTR != Seed.throne.activeSlot) {
							actionLog('Resetting Throne Room', 'TOWER');
							SwitchThroneRoom(Options.TowerOptions.SaveTR);
						}
					}
					// Switch Champ back if required
					if (Options.TowerOptions.ChangeChamp) {
						if (Options.TowerOptions.ChampId && Options.TowerOptions.ChampOriginalCity != getChampionCity(Options.TowerOptions.ChampId)) {
							if (getChampionStatus(Options.TowerOptions.ChampId) == "10") {
								actionLog('Champion is marching - Cannot revert to original city', 'TOWER');
							}
							else {
								actionLog('Reverting champion to original city', 'TOWER');
								SwitchChampion(Options.TowerOptions.ChampOriginalCity, Options.TowerOptions.ChampId);
							}
						}
					}
				}
				Options.TowerOptions.RecentActivity = false; // switch off
			}
		}
	},

	e_volChanged: function (val) {
		var t = Tabs.Options;
		ById('pbVolOut').innerHTML = parseInt(val * 100);
		Options.TowerOptions.alertSound.volume = parseInt(val * 100);
	},
	playSound: function (soundfile, doRepeats, btnid) {
		var t = Tabs.Options;
		if (!t.mss) return;
		var stopbtn = ById(btnid);
		if (stopbtn) { stopbtn.disabled = false; }
		clearTimeout(t.soundStopTimer);
		clearTimeout(t.soundRepeatTimer);
		t.mss.setVolume(Options.TowerOptions.alertSound.volume);
		t.mss.setSource(soundfile);
		t.mss.play();
		t.soundStopTimer = setTimeout(function () { t.mss.stop(); var stopbtn = ById(btnid); if (stopbtn) { stopbtn.disabled = true; }; }, Options.TowerOptions.alertSound.playLength * 1000);
		if (doRepeats && Options.TowerOptions.alertSound.repeat) {
			t.soundRepeatTimer = setTimeout(t.playSound, Options.TowerOptions.alertSound.repeatDelay * 60000, soundfile, true, btnid);
		}
		else {
			Options.TowerOptions.alertSound.alarmActive = false;
		}
	},
	soundTheAlert: function (marchtype) {
		var t = Tabs.Options;
		Options.TowerOptions.alertSound.alarmActive = true;
		if (marchtype == 3) { new t.playSound(Options.TowerOptions.alertSound.scoutUrl, true, 'pbScoutStop'); }
		else { new t.playSound(Options.TowerOptions.alertSound.soundUrl, true, 'pbSoundStop'); }
	},
	stopSoundAlerts: function () {
		var t = Tabs.Options;
		if (t.mss) { t.mss.stop(); }
		var element = ById('towersirentab');
		if (element) { element.parentNode.removeChild(element); }
		if (ById('btDashAlarmOff')) { ById('btDashAlarmOff').innerHTML = ''; }
		clearTimeout(t.soundStopTimer);
		clearTimeout(t.soundRepeatTimer);
		var stopbtn = ById('pbSoundStop');
		if (stopbtn) { stopbtn.disabled = true; }
		var stopbtn = ById('pbScoutStop');
		if (stopbtn) { stopbtn.disabled = true; }
		Options.TowerOptions.alertSound.alarmActive = false;
		Options.TowerOptions.alertSound.expireTime = 0;
	},

	newIncoming: function (m) {
		var t = Tabs.Options;
		if (m.marchType == null) return; // bogus march (returning scouts)
		if (m.arrivalTime && m.arrivalTime < uW.unixtime() + 30) return; // don't show expired marches, well unless within 30 seconds for lag...

		var totTroops = 0;
		if (m.unts) { // if watchtower not high enough, display anyway
			for (var k in m.unts) { totTroops += Number(m.unts[k]); }
			if (!isNaN(totTroops) && totTroops < Options.TowerOptions.minTroops) { return; }
		}
		if (!Options.TowerOptions.towercityactive[m.toCityId]) { return; }

		var city = Cities.byID[m.toCityId];
		if (city.tileId != m.toTileId && !Options.TowerOptions.wilds) { return; }
		if (m.marchType == 3 && !Options.TowerOptions.scouting) { return; }

		t.BuildMessage(m);

		if (m.marchStatus == 9) { // recalled marches
			// Need to recheck arrival times to this city to take into account recalled march...
			var now = unixTime();
			Options.TowerOptions.LatestAttackTimes[m.toCityId] = now;
			for (var k in local_atkinc) {
				var n = local_atkinc[k];
				if ((n.marchType == 3 || n.marchType == 4) && (n.marchId != m.mid)) { // weird, cos it comes from the game!
					if (n.toCityId == m.toCityId && n.toTileId == Cities.byID[m.toCityId].tileId) {
						if (Number(n.arrivalTime) > Options.TowerOptions.LatestAttackTimes[m.toCityId]) {
							Options.TowerOptions.LatestAttackTimes[m.toCityId] = Number(n.arrivalTime);
						}
					}
				}
			}
			// now recheck the global var
			Options.TowerOptions.LastAttack = now;
			for (var cid in Options.TowerOptions.LatestAttackTimes) {
				if (Number(Options.TowerOptions.LatestAttackTimes[cid]) > Options.TowerOptions.LastAttack) {
					Options.TowerOptions.LastAttack = Number(Options.TowerOptions.LatestAttackTimes[cid]);
				}
			}
			saveOptions();
			return; // recalled marches leave here..
		}

		// alert sound!

		if (Options.TowerOptions.alertSound.enabled) {
			t.soundTheAlert(m.marchType);
			if (m.arrivalTime > Options.TowerOptions.alertSound.expireTime) {
				Options.TowerOptions.alertSound.expireTime = m.arrivalTime;
			}
		}

		// Perform Automatic Events

		if (city.tileId == m.toTileId) {
			if (!Options.TowerOptions.SaveCityState[m.toCityId]) {
				actionLog(Cities.byID[m.toCityId].name + ': Under Attack!', 'TOWER');
				var CityState = new Object();
				CityState.cityId = m.toCityId;
				CityState.tileId = city.tileId;
				CityState.Guardian = Seed.guardian[Cities.byID[m.toCityId].idx].type;
				CityState.Champion = getCityChampion(m.toCityId).championId;
				CityState.ChangeChampion = true;
				CityState.AllowMarches = true;
				CityState.AllowRaids = true;
				Options.TowerOptions.SaveCityState[m.toCityId] = CityState;

				if (afkdetector.isAFK || !Options.TowerOptions.AFKEvents) {
					Options.TowerOptions.SaveCityState[m.toCityId].AllowMarches = (!Options.TowerOptions.StopMarches);
					Options.TowerOptions.SaveCityState[m.toCityId].AllowRaids = (!Options.TowerOptions.StopRaids);
					if (Options.TowerOptions.StopMarches) {
						actionLog(Cities.byID[m.toCityId].name + ': Automatic march functions suspended', 'TOWER');
					}
					// change guardian
					if (Options.TowerOptions.ChangeGuardian) {
						if (Seed.guardian[Cities.byID[m.toCityId].idx].type != "wood") {
							actionLog(Cities.byID[m.toCityId].name + ': Switching to Wood Guardian', 'TOWER');
							SwitchGuardian(m.toCityId, "wood");
						}
					}
					// stop raids in city...
					if (Options.TowerOptions.StopRaids) {
						actionLog(Cities.byID[m.toCityId].name + ': Stopping Raids', 'TOWER');
						ToggleCityRaids(m.toCityId, 'stopAll');
					}
				}
			}
			Options.TowerOptions.RecentCityActivity[m.toCityId] = true;

			if (!Options.TowerOptions.RecentActivity) { // save current TR and location of champ
				Options.TowerOptions.SaveTR = Seed.throne.activeSlot;
				if (afkdetector.isAFK || !Options.TowerOptions.AFKEvents) {
					if (Options.TowerOptions.ChangeTR) {
						if (parseIntNan(Options.TowerOptions.ChangeTRPreset) != 0 && Options.TowerOptions.ChangeTRPreset != Seed.throne.activeSlot) {
							actionLog('Changing Throne Room', 'TOWER');
							SwitchThroneRoom(Options.TowerOptions.ChangeTRPreset);
						}
					}
				}
				if (Options.TowerOptions.ChangeChamp && Options.TowerOptions.ChampId) {
					Options.TowerOptions.ChampOriginalCity = getChampionCity(Options.TowerOptions.ChampId);
				}
			}
			Options.TowerOptions.RecentActivity = true;
		}
		saveOptions(); // do once!
	},

	BuildMessage: function (m) {
		var t = Tabs.Options;
		var target, atkType, who;
		var scoutingat = '';
		var atkType;

		if (m.marchType == 3) {
			if (!Options.TowerOptions.scouting) { return; }
			var scoutingat = uW.g_js_strings.modal_messages_viewreports_view.scoutingat;
			atkType = tx('SCOUT');
		} else if (m.marchType == 4) {
			atkType = tx("ATTACK");
		} else {
			return;
		}

		var city = Cities.byID[m.toCityId];
		if (city.tileId == m.toTileId) {
			target = uW.g_js_strings.commonstr.city + ' ' + city.name + ' (' + city.x + ',' + city.y + ')';
			if (Options.TowerOptions.towercitytext[m.toCityId] && Options.TowerOptions.towercitytext[m.toCityId] != "") {
				target += '|' + Options.TowerOptions.towercitytext[m.toCityId];
			}
		}
		else {
			if (!Options.TowerOptions.wilds) { return; }
			target = uW.g_js_strings.commonstr.wilderness;
			for (var k in Seed.wilderness['city' + m.toCityId]) {
				if (Seed.wilderness['city' + m.toCityId][k].tileId == m.toTileId) {
					target += '(' + Seed.wilderness['city' + m.toCityId][k].xCoord + ',' + Seed.wilderness['city' + m.toCityId][k].yCoord + ')';
					break;
				}
			}
		}
		if (Seed.players['u' + m.pid]) {
			who = Seed.players['u' + m.pid].n;
		}
		else {
			if (m.players && m.players['u' + m.pid]) {
				who = m.players['u' + m.pid].n;
			}
			else {
				who = tx('Unknown');
			}
		}

		if (m.fromXCoord) { who += '(' + m.fromXCoord + ',' + m.fromYCoord + ')'; }
		if (m.aid && m.aid != 0) { who += ' (' + getDiplomacy(m.aid) + ')'; }

		if (m.marchStatus == 9) {
			msg = '.::.|' + scoutingat + ' ' + target + ' || ' + uW.g_js_strings.commonstr.attacker + ' ' + who + ' || ' + uW.g_js_strings.incomingattack.attackrecalled;
		}
		else {
			var ArrTime = uW.g_js_strings.incomingattack.unknown;
			if (m.arrivalTime) ArrTime = uW.timestr(parseInt(m.arrivalTime - unixTime()));
			if (m.marchType == 3) { msg = '.:..'; } else { msg = '..:.'; }
			msg += '|' + Options.TowerOptions.aPrefix + ' || ' + scoutingat + ' ' + target + ' || ' + uW.g_js_strings.commonstr.attacker + ' ' + who + ' || ' + uW.g_js_strings.attack_generateincoming.estimatedarrival + ': ' + ArrTime;
		}
		if (m.pid) { msg += ' || UID: ' + enFilter(m.pid); }
		msg += ' || ' + uW.g_js_strings.commonstr.troops + ': ';

		if (m.unts) {
			for (var k in m.unts) {
				var uid = parseInt(k.substr(1));
				var UNTCOUNT = enFilter(m.unts[k]);
				msg += '|' + UNTCOUNT + ' ' + uW.unitcost['unt' + uid][0] + ', ';
			}
		}
		else {
			if (m.cnt) {
				msg += ' ' + m.cnt;
			}
			else {
				msg += ' Unknown';
			}
		}

		if (m.marchStatus != 9) { // pointless showing following info for recalls
			if ((safecall.indexOf(m.pid) < 0 || trusted) && m.championInfo) {
				msg += ' || ' + uW.g_js_strings.report_view.champion_stats + ':';
				var got202 = false;
				for (var cy in m["championInfo"].effects[1]) {
					if (cy < 300) {
						// missing bonus damage?
						if (cy == '202') { got202 = true; }
						if ((cy == '203') && !got202) { msg += '|' + uW.g_js_strings.effects.name_202 + ': 0,'; }
						str = uW.g_js_strings.effects['name_' + cy];
						if (str && str != "") { msg += '|' + str + ': ' + m["championInfo"].effects[1][cy] + ', '; }
						else { break; }
					}
				}
				msg += ' | ' + uW.g_js_strings.report_view.troop_stats + ':';
				for (var ty in m.championInfo.effects[2]) {
					str = uW.g_js_strings.effects['name_' + ty];
					if (str && str != "") { msg += '|' + str + ': ' + m.championInfo.effects[2][ty] + ', '; }
					else { break; }
				}
			}

			if (city.tileId == m.toTileId) {
				var baseProtection = 0;
				var totalSthPrt = 0;
				var SthPrtResearch = parseIntNan(Seed.tech.tch14);
				var TRStHsBoost = Math.min(equippedthronestats(89) + equippedthronestats(167), uW.cm.thronestats.boosts.Storehouse.Max);
				if (TRStHsBoost == 0) TRStHsBoost = 1
				var researchToApply = ((SthPrtResearch / 10) + 1);
				var TRBoostToApply = ((TRStHsBoost / 100) + 1);
				baseProtection = StorehouseLevels[parseIntNan(getUniqueCityBuilding(city.id, 9).maxLevel)];
				totalSthPrt = addCommas(parseInt((baseProtection * researchToApply) * TRBoostToApply))
				msg += '|| ' + tx('Storehouse Protection') + ':|' + totalSthPrt + ' (TR ' + TRStHsBoost + '%)';

				if (Options.TowerOptions.upkeep == true) {
					var trupkeepreduce = 0;
					trupkeepreduce = Math.min(equippedthronestats(79), uW.cm.thronestats.boosts.Upkeep.Max);
					var trprodres = Math.min(equippedthronestats(82), uW.cm.thronestats.boosts.ResourceProduction.Max);
					var trprod = [0, 0, 0, 0, 0];
					trprod[1] = Math.min(equippedthronestats(83), uW.cm.thronestats.boosts.ResourceProduction.Max) + trprodres;
					var rp = getResourceProduction(m.toCityId);
					var usage = parseIntNan(Seed.resources['city' + m.toCityId]['rec1'][3]);
					var bp = CM.Resources.getProductionBase(1, m.toCityId);
					usage = (parseIntNan(rp[1] - usage + bp * trprod[1] / 100));
					if (usage < 0) {
						var timeLeft = parseInt(Seed.resources["city" + m.toCityId]['rec1'][0]) / 3600 / (0 - usage) * 3600;
						if (timeLeft < 86313600) {
							msg += '|| ' + tx('Food Remaining') + ': ' + timestrShort(timeLeft);
						}
					}
				}

				var emb = getUniqueCityBuilding(m.toCityId, 8);
				if (emb.count == 0) {
					msg += '||' + tx("No Embassy!");
					msg += '| ' + tx("Do not try and reinforce");
				}
				else {
					var availSlots = emb.maxLevel;
					for (var k in Seed.queue_atkinc) {
						if ((Seed.queue_atkinc[k].toCityId == m.toCityId) && (Seed.queue_atkinc[k].marchStatus == 2) && (Seed.queue_atkinc[k].fromCityId != m.toCityId) && (Cities.byID[Seed.queue_atkinc[k].fromCityId] == null)) {
							--availSlots;
						}
					}
					msg += ' || ' + uW.g_js_strings.openEmbassy.encampall + ' ' + (emb.maxLevel - availSlots) + '/' + emb.maxLevel + ' ';

					if (Options.TowerOptions.defend == true) {
						if (parseInt(Seed.citystats["city" + m.toCityId].gate) == 1) {
							msg += '||' + tx('Troops are Defending!');
						}
						else {
							msg += '||' + tx('Troops are Hiding!');
						}
					}

					if (Options.TowerOptions.champ == true) {
						var citychamp = getCityChampion(m.toCityId);
						if (citychamp.championId) {
							msg += '||' + tx('Defending Champ') + ': ' + citychamp.name;
						}
						else {
							msg += '||' + tx('No Defending Champ');
						}
					}

					if (Options.TowerOptions.tech == true) {
						msg += '||' + uW.g_js_strings.commonstr.technology + ':|Fletching ' + parseInt(Seed.tech.tch13) + ', |Healing Potions ' + parseInt(Seed.tech.tch15) + ', |Poisoned Edge ' + parseInt(Seed.tech.tch8) + ', |Metal Alloys ' + parseInt(Seed.tech.tch9) + ', |Magical Mapping ' + parseInt(Seed.tech.tch11) + ', |Alloy Horseshoes ' + parseInt(Seed.tech.tch12) + ', ';
					}

				}
			}
			if (Options.TowerOptions.afk == true) {
				if (afkdetector.isAFK) { msg += '||' + tx('Activity Status') + ': ' + tx('AFK'); }
				else { msg += '||' + tx('Activity Status') + ': ' + tx('ONLINE'); }
			}
			if (Options.TowerOptions.DefendMonitor == true) {
				msg += ' || ' + tx('My UID') + ': ' + enFilter(uW.tvuid);
			}
			msg += ' || ' + tx('March id') + ': ' + enFilter(m.mid);
		}

		var totTroops = 0;
		if (!m.unts) { // no unit info, watchtower not high enough? Force to alliance chat not whisper.
			totTroops = 99999999;
		}
		else {
			for (var k in m.unts) { totTroops += Number(m.unts[k]); }
		}

		if (Options.TowerOptions.aChat) {
			if (Options.TowerOptions.whisper && !isNaN(totTroops) && totTroops < Options.TowerOptions.whisperTroops) {
				sendChat("/" + Seed.player.name + ' ' + msg); // whisper
			}
			else {
				sendChat("/a " + msg); // Alliance chat
			}
		}

	},

	sendDFReport: function (force) {
		var t = Tabs.Options;
		if (!Options.DFReport && !force) { return; }

		var now = unixTime();

		if (!force) {
			if (now < (parseInt(Options.LastDFReport) + (Options.DFReportInterval * 60 * 60))) { return; }
			var message = tx('Dark Forest Report for') + ' ' + Options.DFReportInterval + ' ' + tx('hours (or since last report)') + ' %0A';
		}
		else {
			var message = tx('Dark Forest Report (since last report)') + ' %0A';
		}

		if (Options.ReportOptions.DeleteRptdf) {
			var total = DeleteReports.ReportLog.DFCount;
			if (total == 0) { // don't report if no DF's attacked in timeframe.
				actionLog('No report generated as no dark forests attacked in timeframe', 'REPORTS');
				Options.LastDFReport = now;
				saveOptions();
				return;
			}

			message += '%0A';
			message += tx('Number of Dark Forests Attacked') + ': ' + total + '%0A';
			message += '%0A';
			message += tx('Miscellaneous items') + ': %0A';
			for (var z in DeleteReports.ReportLog.ItemsFoundDF) {
				message += uW.g_js_strings.commonstr.found + ' ' + uW.ksoItems[z].name + ' x ' + DeleteReports.ReportLog.ItemsFoundDF[z] + '%0A';
			}

			message += '%0A';
			message += tx('Jewel Stats') + ': %0A';
			var itemcount = 0;
			for (var z in DeleteReports.ReportLog.JewelItemsFoundDF) {
				itemcount += DeleteReports.ReportLog.JewelItemsFoundDF[z];
				message += uW.g_js_strings.jewel['quality_' + Number(z - 1)] + ' Jewel x ' + DeleteReports.ReportLog.JewelItemsFoundDF[z] + '%0A';
			}
			message += tx('Total Jewels Found') + ': ' + itemcount + '%0A';

			message += '%0A';
			message += tx('Throne Stats') + ': %0A';
			var itemcount = 0;
			for (var z in DeleteReports.ReportLog.ThroneItemsFoundDF) {
				itemcount += DeleteReports.ReportLog.ThroneItemsFoundDF[z].amount;
				message += strQuality(DeleteReports.ReportLog.ThroneItemsFoundDF[z].quality) + ' ' + DeleteReports.ReportLog.ThroneItemsFoundDF[z].type + ' x ' + DeleteReports.ReportLog.ThroneItemsFoundDF[z].amount + '%0A';
			}
			message += tx('Total Throne Room Items Found') + ': ' + itemcount + '%0A';

			message += '%0A';
			message += uW.g_js_strings.report_view.champion_stats + ': %0A';
			var itemcount = 0;
			for (var z in DeleteReports.ReportLog.ChampItemsFoundDF) {
				itemcount += DeleteReports.ReportLog.ChampItemsFoundDF[z].amount;
				message += strQuality(DeleteReports.ReportLog.ChampItemsFoundDF[z].quality) + ' ' + DeleteReports.ReportLog.ChampItemsFoundDF[z].type + ' x ' + DeleteReports.ReportLog.ChampItemsFoundDF[z].amount + '%0A';
			}
			message += tx('Total Champion Equipment Found') + ': ' + itemcount + '%0A';
		}
		else {
			message += tx('Found item details only available if the option "Delete dark forest reports" is ticked') + '%0A';
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = tx("Dark Forest Overview");

		params.message = message;
		params.requestType = "COMPOSED_MAIL";

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					DeleteLastMessage();
					if (Options.ReportOptions.DeleteRptdf) {
						DeleteReports.ReportLog.ItemsFoundDF = {};
						DeleteReports.ReportLog.ThroneItemsFoundDF = {};
						DeleteReports.ReportLog.ChampItemsFoundDF = {};
						DeleteReports.ReportLog.JewelItemsFoundDF = {};
						DeleteReports.ReportLog.DFCount = 0;
						DeleteReports.saveLog();
					}
				}
			},
		});

		Options.LastDFReport = now;
		saveOptions();
	},
}
