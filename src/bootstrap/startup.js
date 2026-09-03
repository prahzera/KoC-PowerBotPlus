/** Initialise BOT **/

function PowerBotStartup() {
	clearTimeout(btStartupTimer);
	if (uW.btLoaded) return;
	var metc = getClientCoords(ById('main_engagement_tabs'));
	if (metc.width == null || metc.width == 0) { // wait until page loaded
		btStartupTimer = setTimeout(PowerBotStartup, 1000);
		return;
	}

	// initialise Bot

	logit('initialising Power Bot Plus');
	PBPWatchdog();

	// set up top tabs

	var tabs = ById('main_engagement_tabs');
	if (tabs) {
		SetupMainTab(tabs);
		SetupSubTab(tabs);
	}

	readUserOptions(uW.user_id); // fb user id
	readOptions();
	Dashboard.OptionsInit(); // always initialise dashboard options
	Options.Language = uW.g_ajaxparams.lang;
	readLanguage(Options.Language); // initially load any language settings stored in browser memory cache

	AreYouALeader();

	RefreshEvery.init();
	RefreshEvery.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Initialising PowerBot+') + ' ...</b></font></span>';

	ModifyUWObjects();

	InitialiseAudioManager();

	DefaultWindowPos('btWinPos', 'main_engagement_tabs');
	DefaultWindowPos('btDashPos', 'main_engagement_tabs');

	if (GlobalOptions.btTransparent) { Opacity = 0.9; } else { Opacity = 1.0; }

	var HeadColour = 'rgba(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ',0.5)';
	if ((HEXtoRGB(Options.Colors.Panel).r * 0.299) + (HEXtoRGB(Options.Colors.Panel).g * 0.587) + (HEXtoRGB(Options.Colors.Panel).b * 0.114) <= 100) {
		SpeedColour = '#fff';
		LinkColour = '#00ff00';
	}

	if (!Options.GreenCastles) { URL_CASTLE_BUT_SEL = URL_CASTLE_BUT_HOVER; }

	var styles = '\
		.buttonv2.std {width:123px; height:20px; line-height:20px; padding:2px 7px;} \
		.kocmain .mod_comm .comm_global .chatlist .global {background-color:transparent;}\
		table.xtab td {padding-right: 5px; border:none; background:none; white-space:nowrap;}\
		table.xtabBR td {padding-right: 5px; border:none; background:none; white-space:normal;}\
		.xtabBorder {background:none; border:1px solid #ccc; padding: 1px;}\
		.xtab {padding-right:5px; border:none; background:none; white-space:nowrap;}\
		.xtabBR {padding-right:5px; border:none; background:none; white-space:normal;}\
		.xtabHD {padding-right:5px; border-bottom:1px solid '+ HeadColour + '; background:none; white-space:nowrap;font-weight:bold;font-size:11px;color:' + HeadColour + ';margin-left:10px;margin-right:10px;margin-top:5px;margin-bottom:5px;vertical-align:text-top;align:left}\
		.xtabHDDef {padding-right: 5px; border-bottom:1px solid '+ HeadColour + '; background:none; white-space:nowrap;font-weight:bold;font-size:11px;color:#f00;margin-left:10px;margin-right:10px;margin-top:5px;margin-bottom:5px;vertical-align:text-top;align:left}\
		.xtabBRTop {padding-right: 5px; border:none; background:none; white-space:normal; vertical-align:top;}\
		.xtabH {background:'+ Options.Colors.Panel + '; border:none; padding-right: 5px; padding-left: 5px; margin-left:10px;}\
		.xtabHL {background:'+ Options.Colors.Panel + '; border-width: 1px; border-style: none none none solid; padding-right:5px; padding-left:5px; margin-left:10px;}\
		.xtabL {background:none; border-width: 1px; border-style: none none none solid; padding-right:5px; padding-left: 5px; margin-left:10px;}\
		.xtabLine {padding:0px; spacing:0px; height:1px; border-color:black; border-width: 1px; border-style: none none solid none;}\
		a.xlink {color:'+ LinkColour + ' !important;}\
		table.xtab td.xtabTotal {border-bottom:1px solid '+ HeadColour + '; border-top:1px solid ' + HeadColour + ';}\
		tr.btPopupTop td {background-color:'+ Options.Colors.Title + '; border:1px solid #000000; height: 21px; padding:0px; color:' + Options.Colors.TitleText + ';}\
		.btPopMain {background-color:'+ Options.Colors.Panel + '; border:1px solid #000000; -moz-box-shadow:inset 0px 0px 10px #6a6a6a; -moz-border-radius-bottomright: 20px; -moz-border-radius-bottomleft: 20px; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px; font-size:11px; color:' + Options.Colors.PanelText + '}\
		.btMonitor_btPopMain {font-size:'+ Options.MonitorOptions.MonitorFontSize + 'px;}\
		.btPopup {border:5px ridge #666; opacity:'+ Opacity + '; -moz-border-radius:25px; border-radius:25px; -moz-box-shadow: 1px 1px 5px #000000;}\
		.btReportPopup_btPopMain {font-size:12px;}\
		.btSelector {font-size:11px;}\
		.btInput {font-size:10px;}\
		.AlertStyle {background:url("'+ AlertBG + '") no-repeat left;}\
		.AlertContent {border:none; background:none; white-space:nowrap;font:bold 11px Georgia;color:#551000;text-align:left;height:13px;}\
		.AlertLink {text-decoration:none;color:#ecddc1;text-shadow: 0px 0px 15px #000;}\
		.TextLink {text-decoration:none;}\
		.TextLink:Hover {text-decoration:none;}\
		.TextLink:Active {text-decoration:none;}\
		.divHide {display:none}\
		.divHeader {border:0px solid; border-color:#000000; background: -moz-linear-gradient(top,'+ Options.Colors.DividerTop + ',' + Options.Colors.DividerBottom + '); background: -webkit-linear-gradient(top,' + Options.Colors.DividerTop + ', ' + Options.Colors.DividerBottom + '); -moz-border-radius:5px; height: 16px;border-bottom:0px solid #000000;font-weight:bold;font-size:11px;opacity:0.75;margin-left:0px;margin-right:0px;margin-top:1px;margin-bottom:0px;padding-top:4px;padding-right:10px;padding-left:4px;vertical-align:text-top;align:left; color:' + Options.Colors.DividerText + ';}\
		.btButton:Hover {color:#FFFF80;}\
		.oddRow {height:20px;background: rgba(0,0,0,0.05);}\
		.evenRow {height:20px;background: rgba(0,0,0,0);}\
		.highRow {height:20px;font-weight:bold;background-color:'+ Options.Colors.Highlight + ';color:' + Options.Colors.HighlightText + ';}\
		.totalCell {background-color:'+ Options.Colors.Highlight + ';color:' + Options.Colors.HighlightText + '}\
		.divLink {color:#000;text-decoration:none;}\
		.divLink:Hover {color:#000;text-decoration:none;}\
		.divLink:Active {color:#000;text-decoration:none;}\
		.castleBut {outline:0px; margin-left:0px; margin-right:0px; width:23px; height:25px; font-size:12px; font-weight:bold;}\
		.castleBut:hover {background:url("'+ URL_CASTLE_BUT_HOVER + '") no-repeat center center;}\
		.castleButNon {background:url("'+ URL_CASTLE_BUT + '") no-repeat center center;}\
		.castleButSel {background:url("'+ URL_CASTLE_BUT_SEL + '") no-repeat center center;}\
		.castleButBack {background-color:#f00;display:inline-block;width:23px; height:25px;}\
		.trimg:hover span.trtip {display:block; opacity: 1.0; z-index:999999; font-size:11px; text-align:left; position:absolute; background: #FFFFAA; color: #000; border: 1px solid #FFAD33; padding: 0.5em 0.5em;}\
		.trimg span.trtip {display:none;}\
		.trimg span.trtip:hover {display:none;}\
		.presetBut {outline:0px; margin-left:0px; margin-right:0px; width:22px; height:22px; font-family: georgia,arial,sans-serif;font-size: 12px;color:white; line-height:19px;}\
		.presetButNon {background:url("'+ PresetImage + '") no-repeat center center;}\
		.presetButLck {background:url("'+ PresetImage_LCK + '") no-repeat center center;}\
		.presetButSel {background:url("'+ PresetImage_SEL + '") no-repeat center center;}\
		.presetButDis {opacity: 0.4;}\
		.guardBut {outline:0px; margin-left:0px; margin-right:0px; width:31px; height:33px; font-family: georgia,arial,sans-serif;line-height:52px;font-size:11px;font-weight:bold;color:#fff;text-shadow: 1px 1px 2px #000,-1px -1px 2px #000; background: url("'+ GuardBG + '") no-repeat scroll 0% 0% transparent; background-size:350px;}\
		.guardButNon {border: 2px solid transparent;}\
		.guardButSel {border: 2px solid blue;}\
		.champBut {outline:0px; margin-left:0px; margin-right:0px; width:31px; height:33px; font-family: georgia,arial,sans-serif;line-height:52px;font-size:11px;font-weight:bold;color:#fff;text-shadow: 1px 1px 2px #000,-1px -1px 2px #000;}\
		.champButNon {border: 2px solid transparent;}\
		.champButSel {border: 2px solid green;}\
		.champButMarch {border: 2px solid red;}\
		.ptChatAttack {color: #000; font-weight:bold; background-color:'+ Options.ChatOptions.Colors.ChatAtt + ';}\
		.ptChatScout {color: #000; font-weight:bold; background-color:'+ Options.ChatOptions.Colors.ChatScout + ';}\
		.ptChatRecall {color: #000; font-weight:bold; background-color:'+ Options.ChatOptions.Colors.ChatRecall + ';}\
		.ptChatWhisper {font-weight:bold; color:'+ Options.ChatOptions.Colors.ChatWhisper + ';}\
		.ptChatAlliance {background-color:'+ Options.ChatOptions.Colors.ChatAll + ';}\
		.ptChatGlobal {background-color:'+ Options.ChatOptions.Colors.ChatGlobal + ';}\
		.ptChatBold {font-weight:bold}\
		.ptChatGlobalAll {font-weight:bold;background-color:'+ Options.ChatOptions.Colors.ChatGlobal + ';}\
		.ptChatIcon {border: 1px inset black}\
		.ptChatCHAN {color:#000; background-color:'+ Options.ChatOptions.Colors.ChatChancy + ';}\
		.ptChatVICE {color:#000; background-color:'+ Options.ChatOptions.Colors.ChatVC + ';}\
		.ptChatOFFI {color:#000; background-color:'+ Options.ChatOptions.Colors.ChatLeaders + ';}\
		.ptChatGLORY {background-image: url('+ GLORY_BACKGROUND + '); background-size: 40px 33px; background-position: right bottom; background-repeat: no-repeat; min-height:65px; }\
		.ptChatRAINBOW {background-image: url('+ RAINBOW_BACKGROUND + '); background-size: 280px 1px; background-position: left top; background-repeat: repeat-y; }\
		table.ptTab tr td {border:none; background:none; white-space:nowrap;}\
		.whiteOnRed {padding-left:3px; padding-right:3px; background-color:#f00; color:white; font-weight:bold}\
		.whiteOnGreen {padding-left:3px; padding-right:3px; background-color:#080; color:white; font-weight:bold}\
		span.boldRed {color:'+ (Options.Colors.BoldRed || '#800') + '; font-weight:bold}\
		span.boldOrange {color:'+ (Options.Colors.BoldOrange || '#F80') + '; font-weight:bold}\
		span.boldGreen {color:'+ (Options.Colors.BoldGreen || '#080') + '; font-weight:bold}\
		span.boldMagenta {color:'+ (Options.Colors.BoldMagenta || '#808') + '; font-weight:bold}\
		.kocHeader .timeAndDomain {margin: 13px 0px 0px -5px;}\
		.kocmain .mod_maparea .mod_citylist .city_warning{background: url('+ URL_CASTLE_WARN + ') no-repeat; margin-top: 4px;}\
		.btExpander {background:none; -moz-border-radius-bottomright: 20px; -moz-border-radius-topright: 20px; border-bottom-right-radius: 20px; border-top-right-radius: 20px;}\
		.btBackExpander {background:none; -moz-border-radius-bottomleft: 20px; -moz-border-radius-topleft: 20px; border-bottom-left-radius: 20px; border-top-left-radius: 20px;}\
		.tooldesc:hover span.tooltip {display:block; position:absolute; color: #000000; background: #FFFFAA; border: 1px solid #FFAD33; padding: 0.5em 0.5em;}\
		.tooldesc span.tooltip {display:none;}\
		.tooldesc span.tooltip:hover {display:none;}\
		.flip {-webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); transform: rotate(180deg);}\
		.smileyimage {width:17px !important;height:17px !important;float:none !important;}\
		.wrap {white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;}\
		.ui-tabs { padding: 0px; background: transparent; border-width: 0px; }\
		.ui-tabs .ui-tabs-nav { padding-left: 0px; background: transparent; border-width: 0px 0px 1px 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; }\
		.ui-tabs li.ui-tabs-active { border-width: 1px 1px 0px 1px; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; background-color:'+ Options.Colors.Panel + '; }\
		.ui-tabs .ui-tabs-panel { border-width: 0px 0px 0px 1px; -moz-border-radius: 0px; -webkit-border-radius: 0px; border-radius: 0px; font-family: georgia,arial,sans-serif; font-size:11px; }\
		.ui-tabs .ui-state-active { background: none;}\
		.ui-widget-content a { color: #fff; }\
		.buttonv2.purple { background: -moz-linear-gradient(center top , #F0F, #808 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #F0F, #808 100%) repeat scroll 0% 0% transparent; }\
		.buttonv2.purple:hover { background: -moz-linear-gradient(center top , #FF44FF, #A044A0 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #FF44FF, #A044A0 100%) repeat scroll 0% 0% transparent; }\
		.buttonv2.orange { background: -moz-linear-gradient(center top , #FF8000, #FF4500 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #FF8000, #FF4500 100%) repeat scroll 0% 0% transparent; }\
		.buttonv2.orange:hover { background: -moz-linear-gradient(center top , #FFB045, #FF8045 100%) repeat scroll 0% 0% transparent; background: -webkit-linear-gradient(top , #FFB045, #FF8045 100%) repeat scroll 0% 0% transparent; }\
		.btIcon { vertical-align:text-bottom; }\
		.btTop { vertical-align:text-top; }\
		.btFaint { opacity:0.8; }\
		div.ErrText {color:#FF0000;}';

	GM_addStyle("a.inlineButton.brown11 span {background: url(" + LONG_BROWN_BTN + ") no-repeat scroll left top transparent; !important}");
	GM_addStyle(".castleBut.defending {border-top: 2px; border-bottom: 2px; border-left: 2px; border-right: 2px; border-style: ridge; border-color: red;}");
	GM_addStyle(".castleBut.hiding {border-top: 2px; border-bottom: 2px; border-left: 2px; border-right: 2px; border-style: ridge; border-color: rgb(229, 221, 201);}");
	GM_addStyle(".castleBut.attack {opacity: 0.6;}");
	GM_addStyle("#directory_tabs {background: -moz-linear-gradient(center top , rgba(0,0,0,0) 50%, #1B64CB 55%, #163665 100%) repeat scroll 0% 0% transparent}");
	GM_addStyle('div.rored {color:#fff !important}');

	if (Options.ShowServerTraffic) {
		if (ById('kochead_time')) {
			var newdiv = document.createElement('div');
			newdiv.innerHTML = tx('Server Traffic') + ':&nbsp;<span style="font-weight:bold;text-shadow:black 0.1em 0.1em 0.2em;" id=btTraffic>&nbsp;</span>';
			ById('kochead_time').parentNode.parentNode.appendChild(newdiv);
			ByCl('timeAndDomain')[0].style.marginTop = '4px';
			ByCl('avatarInfo')[0].style.marginTop = '10px';
		}
	}

	if (uW.g_js_strings) {
		uW.g_js_strings.commonstr.yourScriptVersionIsOut = uW.g_js_strings.checkoutofdate.reloadconfirm; // more meaningful!!
		if (uW.cm.thronestats && uW.cm.thronestats.boosts && uW.cm.thronestats.boosts.Speed) {
			uW.cm.thronestats.boosts.Speed.BoostName = uW.g_js_strings.throneRoom.effectName_4; // change speed to combat speed in TR Caps
		}
	}

	var gg = ByCl('gem_gifting');
	if (gg.length > 0) for (var g = 0; g < gg.length; g++) gg[g].style.display = 'none';

	// Hide the game's built-in "Extra Tools" nav button (replaced by Power Bot Plus)
	var navTabs = ByCl('navTab');
	for (var n = 0; n < navTabs.length; n++) {
		if (navTabs[n].getAttribute('onclick') && navTabs[n].getAttribute('onclick').indexOf('toggleExtraTools') !== -1) {
			navTabs[n].style.display = 'none';
			break;
		}
	}

	if (!GlobalOptions.btPowerBar) {
		AddMainTabLink(tx('POWERBOT+'), 'PBPButton', eventHideShow, mouseMainTab);
	}

	/* add all effects to alternate sort order */

	for (k in uW.cm.thronestats.tiers) {
		if (AlternateSortOrder.indexOf(parseInt(k)) == -1) { AlternateSortOrder.push(parseInt(k)); }
	}

	setCities();

	if (ArcanaEnabled()) {
		for (var l = 1; l <= parseIntNan(Seed.allianceHQ.buildings[3].buildingLevel); l++) {
			for (var ll in Seed.arcaneRequirements[l]) {
				if (Seed.arcaneRequirements[l][ll].isAvailable) {
					ArcaneRequirements[ll] = JSON2.parse(JSON2.stringify(Seed.arcaneRequirements[l][ll]));
				}
			}
		}
	}
	if (!Seed.arcanaApothecaryBuffValue) { Seed.arcanaApothecaryBuffValue = 0; }
	if (!Seed.arcanaAetherstoneCapBuffValue) { Seed.arcanaAetherstoneCapBuffValue = 0; }

	/* set initial city ID (for city selectors in all the panels and tabs, NOT Dashboard!) */

	InitialCityId = uW.currentcityid;
	if (Options.amain) {
		if (Options.smain == -1) {
			if (Cities.cities[Options.lmain]) { InitialCityId = Cities.cities[Options.lmain].id; }
		}
		else {
			if (Cities.cities[Options.smain]) { InitialCityId = Cities.cities[Options.smain].id; }
		}
	}

	setTroops();
	SelectiveDefending = uW.g_serverType != CM.SERVER_TYPES.PVP;
	CE_EFFECT_TIERS = CM.WorldSettings.getSettingAsObject("CE_EFFECTS_TIERS");

	for (var i in ScoutTroops) {
		ScoutTroops[i] = uW.unitnamedesctranslated['unt' + i][0];
	}

	var effectTiers = CE_EFFECT_TIERS;
	var effObjSize = 0, effsplit = {}, basegrowth = {};
	for (var k in effectTiers) {
		effsplit = effectTiers[k]["Id_Tier"].split(",");
		ChampionStatTiers['' + effsplit[0]] = {};
	}
	for (var k in effectTiers) {
		effsplit = effectTiers[k]["Id_Tier"].split(",");
		basegrowth = {};
		basegrowth['base'] = effectTiers[k]["Base"];
		basegrowth['growth'] = effectTiers[k]["Growth"];
		ChampionStatTiers['' + effsplit[0]]['' + effsplit[1]] = basegrowth;
	}

	CE_MIGHT_RARITY_MAP = CM.WorldSettings.getSettingAsObject("CE_MIGHT_RARITY_MAP");
	CE_MIGHT_LEVEL_MAP = CM.WorldSettings.getSettingAsObject("CE_MIGHT_LEVEL_MAP");

	for (var h = 0; h < HourGlasses.length; h++) { HourGlassName[HourGlasses[h]] = uW.itemlist['i' + HourGlasses[h]].name; }

	WideScreen.init();
	WideScreen.setPowerBar(GlobalOptions.btPowerBar, GlobalOptions.btPowerBarOpen);
	WideScreen.setChatOnRight(GlobalOptions.btChatOnRight);
	WideScreen.useWideMap(GlobalOptions.btWideMap);

	function CloseMainTab() {
		tabManager.hideTab();
		Options.btWinIsOpen = false;
		saveOptions();
	}

	mainPop = new CPopup('btMain', Options.btWinPos.x, Options.btWinPos.y, GlobalOptions.btWinSize.x, 100, true, CloseMainTab);
	mainPop.getMainDiv().innerHTML = '<STYLE>' + styles + '</style>';

	WideScreen.setDashboard(Options.btDashboard); // do after styles added ^^

	// Load in Additional/Optional Tabs

	var NewVersion = false;
	if (!GlobalOptions.ExtraTabsVersion || AutoUpdater.compareVersion(Version, GlobalOptions.ExtraTabsVersion)) {
		NewVersion = true;
		GlobalOptions.ExtraTabsVersion = Version;
		saveGlobalOptions();
	}

	CheckDelay = 0;
	for (var e in GlobalOptions.ExtraTabs) {
		if (GlobalOptions.ExtraTabs[e].enabled) {
			try {
				eval(atob(GlobalOptions.ExtraTabs[e].data));
			} catch (err) { logerr(err); }
			if (GlobalOptions.TabAutoCheck) {
				var now = unixTime();
				if (NewVersion || (!GlobalOptions.ExtraTabs[e].lastchecked || GlobalOptions.ExtraTabs[e].lastchecked + (3600 * 24 * 3) < now)) { // only check for new tabs once every 3 days, or if main script version changes
					CheckDelay++;
					setTimeout(Tabs.Options.TabLoad, (CheckDelay * 1250), e, true);
				}
			}
		}
	}

	// Basic initialisation complete 
	tabManager.init(mainPop.getMainDiv());

	Incoming.init();
	Outgoing.init();
	QuickMarch.init();
	Battle.init();
	QuickScout.init();

	// check token response

	Tabs.Options.CheckTokenResponse();

	if (GlobalOptions.DashboardToggle) {
		AddPowerBarLink(tx('Dashboard'), 'PBPDashButton', function () { WideScreen.ShowDashboard(!Options.btDashboard); }, function (me) { if (Options.btFloatingDashboard) ResetWindowPos(me, 'main_engagement_tabs', popDash); });
	}

	if (Options.btWinIsOpen && GlobalOptions.btTrackOpen) {
		mainPop.show(true);
		tabManager.showTab(true);
	}

	// fix leaderboard display so you can always see might leaderboard even if glory leaderboard returns no results!

	var lbfix = new CalterUwFunc("modal_fow_leaderboard", [['e.emptySet', 'false']]);
	lbfix.setEnable(true);

	// Set to check for updates in 15 seconds

	//	if (GlobalOptions.AutoUpdates) setTimeout(function(){AutoUpdater.check();},15000);

	// start main looper

	afkdetector.init();
	SecondTimer = setTimeout(EverySecond, 0);

	// TEMP FIX FOR REPORTS

	var rptfix = new CalterUwFunc('Messages.deleteCheckedReports', [['MessagesController', 'MessageController']]);
	rptfix.setEnable(true);

	// UPDATE_SEED_AJAX IS CRASHING OUT IN UPDATE_MARCH SOMETIMES - THIS IS BAD, SO PUT A TRY-CATCH AROUND IT.

	t.updateseedfix = new CalterUwFunc('update_seed_ajax', [
		[/if\s*\(typeof\s*isCancelTraining/im, 'var l_lastCallTime = cm.l_lastCallTime; var reload_requests = cm.reload_requests; var l_callIntervalMin = cm.l_callIntervalMin; if(typeof isCancelTraining'],
		[/update_march\(rslt.updateMarch\)/im, 'try {update_march(rslt.updateMarch);} catch (V) {}'],
	]);
	t.updateseedfix.setEnable(true);

	// initialisation complete!

	uW.btLoaded = true;
	LoadChecker(false);
	window.addEventListener('beforeunload', onUnload, false);
	RefreshEvery.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;PowerBot+ Initialised!</b></font></span>';
	actionLog('Power Bot Plus (' + Version + ') successfully initialised');
}
