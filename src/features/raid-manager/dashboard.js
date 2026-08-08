/** Dashboard Control **/

var Dashboard = {
	order: [],
	DashWidth: 480,
	GeneralInterval: 1,
	DefaultDashboard: { "Overview": { Display: true, Sequence: 0 }, "Boost": { Display: true, Sequence: 3 }, "Arcana": { Display: true, Sequence: 5 }, "Sacrifices": { Display: true, Sequence: 10 }, "Troops": { Display: true, Sequence: 20 }, "Reinforcements": { Display: true, Sequence: 30 }, "Fortifications": { Display: true, Sequence: 40 }, "Outgoing Attacks": { Display: true, Sequence: 50 }, "Incoming Attacks": { Display: true, Sequence: 60 } },
	OverviewShow: true,
	SacrificeShow: true,
	ReinforceShow: true,
	TroopShow: true,
	FortificationShow: true,
	AttackShow: true,
	CityAttackShow: true,
	ArcanaShow: true,
	BoostShow: true,
	Curr: -1,
	Castles: null,
	ResizeFrame: false,
	serverwait: false,
	ExpandMarshall: false,
	ExpandChampion: false,
	ExpandDefPreset: false,
	CurrentCityId: 0,
	StillComing: false,
	CityStillComing: false,
	CityIncoming: false,
	CityOutgoing: false,
	SacSettings: null,
	SacSpeed: null,
	SacSpeedBuff: null,
	DarkRitual: null,
	ChannelledSuffering: null,
	TotalTroops: null,
	TotalSanctuaryTroops: null,
	QuickSacString: "",
	DefOptionsString: "",
	NextPresetNumber: 0,
	InitPresetNumber: 0,
	marchchamp: null,
	citychamp: null,
	oldchamp: null,
	allownewsacs: false,
	Reins: [],
	WallDefences: [],
	FieldDefences: [],
	StoreArray: {},
	ThroneDelay: 0,
	GuardDelay: 0,
	ForceTries: 0,
	AttackedCity: null,
	CurrGuardian: null,
	Loaded: false,
	Buildings: {},
	BoostItemList: [261, 262, 280, 271, 272, 281],
	BoostItemList2: [282, 283, 295, 296],
	BoostItemList3: [297, 298],
	tBoostItemList: [290, 291, 292, 301, 287, 288, 289, 300],
	TroopBoostSpeedList: [49001, 49002, 49003, 49004, 49005, 49006, 49007, 49008, 49009, 49010, 49011],
	TroopBoostAccuracyList: [49501, 49502, 49503, 49504, 49505, 49506, 49507, 49508, 49509, 49510],
	Options: {
		OverviewState: true,
		SacrificeState: false,
		ReinforceState: false,
		FortificationState: false,
		AttackState: false,
		CityAttackState: false,
		ArcanaState: false,
		BoostState: false,
		DefaultSacrifice: true,
		DefaultSacrificeMin: 1,
		DefaultSacrificeSec: 0,
		QuickSacrifice: true,
		SacrificeLimit: 1000000,
		DefaultDefenceNum: 200000,
		DefAddTroopShow: true,
		DefPresetShow: true,
		DefPresets: {},
		UpperDefendButton: false,
		LowerDefendButton: true,
		TRPresets: {},
		TRPresetsSelected: {},
		TRPresetsCycle: false,
		TRPresetsCycleMins: 1,
		TRPresetsLastChecked: 0,
		TRPresetChange: true,
		TRPresetByName: false,
		OverrideDashboard: {},
		CurrentCity: -1,
		RefreshSeed: false,
		ReplaceDefendingTroops: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		GraphicalChampDisplay: true,
		ExpandSanctuary: true,
		SetDefendersFirst: false,
		DashWidth: 540,
	},

	OptionsInit: function () {
		var t = Dashboard;
		if (!Options.DashboardOptions) {
			Options.DashboardOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.DashboardOptions.hasOwnProperty(y)) {
					Options.DashboardOptions[y] = t.Options[y];
				}
			}
		}
	},

	init: function () {
		var t = Dashboard;

		HTMLRegister['DASH'] = {};

		t.order = [];
		for (var p in t.DefaultDashboard) {
			var NewObj = {};
			if (Options.DashboardOptions.OverrideDashboard[p]) {
				NewObj.Display = Options.DashboardOptions.OverrideDashboard[p].Display;
				NewObj.Sequence = Options.DashboardOptions.OverrideDashboard[p].Sequence;
			}
			else {
				NewObj.Display = t.DefaultDashboard[p].Display;
				NewObj.Sequence = t.DefaultDashboard[p].Sequence;
			}
			NewObj["name"] = p;
			t.order.push(NewObj);
		}
		t.order.sort(function (a, b) { return a.Sequence - b.Sequence });

		t.DashWidth = Options.DashboardOptions.DashWidth;

		m = '<div><table width="100%"><tr><td class=xtab align="right"><b>' + uW.g_js_strings.commonstr.city + ' : </b></td><td class=xtab><span id=btCastlesContainer></span></td><td class=xtab align="right"><span id="btCityAlert">&nbsp;</span></td></tr>';
		m += '<tr><td class=xtab colspan="2"><span style="display:inline-block;" id=btItems>&nbsp;</span>&nbsp;<span style="display:inline-block;height:21px;vertical-align:bottom;" id=btDashAlarmOff>&nbsp;</span></td><td class=xtab align="right"><a id=btRefreshSeed class="inlineButton btButton blue14"><span>' + tx('Refresh') + '</span></a>&nbsp;<span id=btAutoSpan class="divHide"><a id=btAutoRefresh class="inlineButton btButton blue14"><span style="width:30px;display:inline-block;text-align:center;">' + tx('Auto') + '</span></a></span></td></tr></table></div>';

		for (var p in t.order) {
			if (t.order[p].name == 'Overview') {
				m += '<div id=btStatusHeader><a id=btStatusLink class=divLink ><div class="divHeader" align="right">' + tx('OVERVIEW') + '&nbsp;<img id=btStatusArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btStatus align=center class="divHide"><TABLE width="100%"><tr><td class=xtab align="center" id=btStatusCell style="padding-right:0px;"></td></tr>';
				m += '</table></div></div>';
				t.OverviewShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Boost') {
				m += '<div id=btBoostHeader><a id=btBoostLink class=divLink ><div class="divHeader" align="right">' + tx('TROOP BOOSTS') + '&nbsp;<img id=btBoostArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btBoost align=center class="divHide"><TABLE width="100%"><td width=50% class="xtabHD"><b>' + uW.g_js_strings.modal_attack.speedboosts + '</b></td><td width=50% class="xtabHD"><b>' + tx('Accuracy Boosts') + '</b></td></tr>';
				m += '<tr><td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btBoostSpeedCell></td></tr><tr><td class=xtab><div id=btNewBoostSpeedCell align="left"></div></td></tr></td></tr></table></td>';
				m += '<td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btBoostAccuracyCell></td></tr><tr><td class=xtab><div id=btNewBoostAccuracyCell align="left"></div></td></tr></table></td></tr>';
				m += '<tr><td colspan=2 class="xtab"><div class="ErrText" align="center" id=btBoostErr>&nbsp;</div></td></tr></table></div></div>';
				t.BoostShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Arcana') {
				m += '<div id=btArcanaHeader><a id=btArcanaLink class=divLink ><div class="divHeader" align="right">' + tx('ARCANA') + '&nbsp;<img id=btArcanaArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btArcana align=center class="divHide"><TABLE width="100%"><td width=50% class="xtabHD"><b>' + uW.g_js_strings.arcane.allianceText + '&nbsp;(<span id=btalliarcananum></span>/<span id=btalliarcanamax></span>)</b></td><td width=50% class="xtabHD"><b>' + uW.g_js_strings.arcane.personalText + '&nbsp;(<span id=btpersarcananum></span>/<span id=btpersarcanamax></span>)</b></td></tr>';
				m += '<tr><td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btAlliArcanaCell></td></tr><tr><td class=xtab><div id=btNewAlliArcanaCell align="left"></div></td></tr></td></tr></table></td>';
				m += '<td class=xtab align=center valign=top><TABLE width="100%"><tr><td class=xtab id=btPersArcanaCell></td></tr><tr><td class=xtab><div id=btNewPersArcanaCell align="left"></div></td></tr></table></td></tr>';
				m += '<tr><td colspan=2 class="xtab"><div class="ErrText" align="center" id=btArcanaErr>&nbsp;</div></td></tr></table></div></div>';
				t.ArcanaShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Sacrifices') {
				m += '<div id=btSacrificeHeader><a id=btSacrificeLink class=divLink ><div class="divHeader" align="right">' + tx('SACRIFICES') + '&nbsp;<img id=btSacrificeArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btSacrifice align=center class="divHide"><TABLE width="98%"><tr><td class=xtab align=center id=btSacrificeCell></td></tr><tr><td class=xtab align=center>';
				m += '<div id=btNewSacrificeCell align="center" class="divHide">&nbsp;</div></td></tr>';
				m += '</table></div></div>';
				t.SacrificeShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Troops') {
				m += '<div id=btTroopHeader><a id=btTroopLink class=divLink ><div class="divHeader" align="right">' + tx('TROOPS') + '&nbsp;<img id=btTroopArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btTroop align=center class=divHide><TABLE width="100%">';
				if (Options.DashboardOptions.SetDefendersFirst) {
					m += '<tr><td class=xtab align=center style="padding-right:0px;"><div id=btTroopAddCell align="center">&nbsp;</div></td></tr>';
					m += '<tr><td class=xtabBR align=center id=btTroopCell></td></tr>';
				}
				else {
					m += '<tr><td class=xtabBR align=center id=btTroopCell></td></tr>';
					m += '<tr><td class=xtab align=center style="padding-right:0px;"><div id=btTroopAddCell align="center">&nbsp;</div></td></tr>';
				}
				m += '</table></div></div>';
				t.TroopShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Reinforcements') {
				m += '<div id=btReinforceHeader><a id=btReinforceLink class=divLink ><div class="divHeader" align="right">' + tx('REINFORCEMENTS') + '&nbsp;<img id=btReinforceArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btReinforce align=center class=divHide><TABLE width="98%"><tr><td class=xtabBR align=center id=btReinforceCell></td></tr>';
				m += '</table></div></div>';
				t.ReinforceShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Fortifications') {
				m += '<div id=btWallDefenceHeader><a id=btWallDefenceLink class=divLink ><div class="divHeader" align="right">' + tx('FORTIFICATIONS') + '&nbsp;<img id=btWallDefenceArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btWallDefence align=center class=divHide><TABLE width="100%"><tr><td id=btWallDefenceCell class=xtabBR align=center style="padding-right:0px;"></td></tr>';
				m += '</table></div></div>';
				t.FortificationShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Outgoing Attacks') {
				m += '<div id=btCityAttackHeader><a id=btCityAttackLink class=divLink ><div class="divHeader" align="right">' + tx('OUTGOING ATTACKS') + '&nbsp;<img id=btCityAttackArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btCityAttack align=center class=divHide><TABLE width="98%"><tr><td class=xtabBR align=center id=btCityAttackCell></td></tr>';
				m += '</table></div></div>';
				t.CityAttackShow = t.order[p].Display;
			}

			if (t.order[p].name == 'Incoming Attacks') {
				m += '<div id=btAttackHeader><a id=btAttackLink class=divLink ><div class="divHeader" align="right">' + tx('INCOMING ATTACKS') + '&nbsp;<img id=btAttackArrow height="10" src="' + RightArrow + '"></div></a>';
				m += '<div id=btAttack align=center class=divHide><TABLE width="98%"><tr><td class=xtabBR align=center id=btAttackCell></td></tr>';
				m += '</table></div></div><br>';
				t.AttackShow = t.order[p].Display;
			}
		}

		popDash = new CPopup('btDash', Options.btDashPos.x, Options.btDashPos.y, t.DashWidth, 100, Options.btFloatingDashboard, Dashboard.close);

		if (!Options.btFloatingDashboard) {
			popDash.BASE_ZINDEX = 40; // below widemap
			elem = ById('btDash_outer');
			elem.style.left = '0px';
			elem.style.top = '0px';
			ById('btDashboard').appendChild(elem);
		}

		popDash.getMainDiv().innerHTML = m;
		popDash.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('PowerBot+ Dashboard') + '</B></DIV>';

		if (t.Curr < 0) { t.Curr = Cities.byID[uW.currentcityid].idx; }

		t.Castles = new CdispCityPicker('btCastles', ById('btCastlesContainer'), true, null, t.Curr, null, 'castleButBack');

		for (var i = 0; i < Cities.numCities; i++) {
			ById('btCastles_' + i).addEventListener('mouseover', function () { CityResourceHint(this, this.id.substring(10)); }, false);
			ById('btCastles_' + i).addEventListener('mouseout', function () { CityResourceHintOff(this); }, false);
		}

		ById('btCastlesContainer').addEventListener('click', function () { t.SetCurrentCity(t.Castles.city.id); }, false);
		ById('btStatusLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btStatus"); Options.DashboardOptions.OverviewState = !(Options.DashboardOptions.OverviewState); saveOptions(); }, false);
		ById('btBoostLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btBoost"); Options.DashboardOptions.BoostState = !(Options.DashboardOptions.BoostState); saveOptions(); }, false);
		ById('btArcanaLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btArcana"); Options.DashboardOptions.ArcanaState = !(Options.DashboardOptions.ArcanaState); saveOptions(); }, false);
		ById('btSacrificeLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btSacrifice"); Options.DashboardOptions.SacrificeState = !(Options.DashboardOptions.SacrificeState); saveOptions(); }, false);
		ById('btTroopLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btTroop"); Options.DashboardOptions.TroopState = !(Options.DashboardOptions.TroopState); saveOptions(); }, false);
		ById('btWallDefenceLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btWallDefence"); Options.DashboardOptions.FortificationState = !(Options.DashboardOptions.FortificationState); saveOptions(); }, false);
		ById('btReinforceLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btReinforce"); Options.DashboardOptions.ReinforceState = !(Options.DashboardOptions.ReinforceState); saveOptions(); }, false);
		ById('btAttackLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btAttack"); Options.DashboardOptions.AttackState = !(Options.DashboardOptions.AttackState); saveOptions(); }, false);
		ById('btCityAttackLink').addEventListener('click', function () { ToggleDivDisplay("btDash", 100, t.DashWidth, "btCityAttack"); Options.DashboardOptions.CityAttackState = !(Options.DashboardOptions.CityAttackState); saveOptions(); }, false);

		if (Options.DashboardOptions.OverviewState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btStatus");
		if (Options.DashboardOptions.BoostState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btBoost");
		if (Options.DashboardOptions.ArcanaState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btArcana");
		if (Options.DashboardOptions.SacrificeState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btSacrifice");
		if (Options.DashboardOptions.TroopState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btTroop");
		if (Options.DashboardOptions.ReinforceState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btReinforce");
		if (Options.DashboardOptions.FortificationState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btWallDefence");
		if (Options.DashboardOptions.AttackState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btAttack");
		if (Options.DashboardOptions.CityAttackState) ToggleDivDisplay("btDash", 100, t.DashWidth, "btCityAttack");

		ById('btRefreshSeed').addEventListener('click', function () { setTimeout(function () { t.SetCurrentCity(t.Castles.city.id); RefreshSeed(); }, 250); }, false);
		ById('btAutoRefresh').addEventListener('click', function () { t.ToggleAutoRefresh(); }, false);
		if (Options.DashboardOptions.RefreshSeed) {
			jQuery('#btRefreshSeed').addClass("disabled");
			jQuery('#btAutoRefresh').addClass("red14");
			jQuery('#btAutoRefresh').removeClass("blue14");
			ById('btAutoRefresh').innerHTML = '<span style="width:30px;display:inline-block;text-align:center;">' + tx('Off') + '</span>';
		}
		if (trusted) jQuery('#btAutoSpan').removeClass("divHide");

		t.SetCurrentCity(Seed.cities[t.Curr][0], true);

		popDash.show(true);
		ResetFrameSize('btDash', 100, t.DashWidth);
		saveOptions();

		t.Loaded = true; // allow everysecond to update
	},

	show: function (city) {
		var t = Dashboard;
		if (!popDash) {
			t.init();
		}
		else {
			t.Castles.selectBut(city.idx);
		}
	},

	close: function () {
		Options.DashboardOptions.CurrentCity = -1;
		Dashboard.Curr = Options.DashboardOptions.CurrentCity;
		if (Options.btFloatingDashboard) {
			Options.btDashPos = popDash.getLocation();
		}
		else {
			document.body.appendChild(popDash.div);
		}
		popDash.destroy();
		popDash = null;
		Options.btDashboard = false;
		WideScreen.setDashboard(false);
		saveOptions();
		saveGlobalOptions();
	},

	SetCurrentCity: function (cityId, leaveModal) {
		var t = Dashboard;

		t.serverwait = false;
		t.ExpandMarshall = false;
		t.ExpandChampion = false;

		t.CurrentCityId = cityId;
		t.Curr = Cities.byID[cityId].idx;
		Options.DashboardOptions.CurrentCity = t.Curr;
		saveOptions();

		if (!leaveModal) {
			uW.Modal.hideModal(); // don't hide modal on init.
			if (jQuery('#ahqbutton').hasClass('sel')) { uW.changeview_city(); }
		}

		if (uW.currentcityid != cityId) {
			if (!SelectCity(t.Curr + 1)) { setTimeout(t.SetCurrentCity, 1000, cityId, leaveModal); return false; }
		}

		t.Buildings = getCityBuildings(cityId);

		// refresh arcana info

		if (ArcanaEnabled()) {
			t.MaxAllianceArcana = Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].maxActiveAlliance;
			t.MaxPersonalArcana = Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].maxActivePersonal;

			var ArcanaTypes = { 0: '-- ' + tx('Select Arcana') + ' --' };
			for (var l = 1; l <= parseIntNan(Seed.allianceHQ.buildings[3].buildingLevel); l++) {
				for (var ll in Seed.arcaneRequirements[l]) {
					if (Seed.arcaneRequirements[l][ll].isAvailable) {
						ArcanaTypes[ll] = uW.itemlist["i" + ll].name;
					}
				}
			}
			var SelWidth = 150;
			if (t.DashWidth == 480) SelWidth = 125;
			if (t.DashWidth == 600) SelWidth = 175;
			m = '<div id=btAlliArcanaDiv>' + htmlSelector(ArcanaTypes, 0, 'id=btAlliArcanaSel class=btInput style="width:' + SelWidth + 'px;" onChange="btAlliArcanaSelChange();"') + '&nbsp;<span style="display:inline-block;position:relative;">' + strButton8(tx('Day'), 'id=btAlliArcanaSetDay') + '</span>&nbsp;<span style="display:inline-block;position:relative;">' + strButton8(tx('Week'), 'id=btAlliArcanaSetWeek') + '</span><br><table class=xtab width=100% style="padding-right:0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btAlliArcanaDesc></div></td></tr></table></div>';
			ById('btNewAlliArcanaCell').innerHTML = m;
			m = '<div id=btPersArcanaDiv>' + htmlSelector(ArcanaTypes, 0, 'id=btPersArcanaSel class=btInput style="width:' + SelWidth + 'px;" onChange="btPersArcanaSelChange();"') + '&nbsp;<span style="display:inline-block;position:relative;">' + strButton8(tx('Day'), 'id=btPersArcanaSetDay') + '</span>&nbsp;<span style="display:inline-block;position:relative;">' + strButton8(tx('Week'), 'id=btPersArcanaSetWeek') + '</span><br><table class=xtab width=100% style="padding-right: 0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btPersArcanaDesc></div></td></tr></table></div>';
			ById('btNewPersArcanaCell').innerHTML = m;

			ById('btAlliArcanaSetDay').addEventListener('click', function () {
				var Arc = parseIntNan(ById('btAlliArcanaSel').value);
				if (Arc != 0) { t.ActivateArcana(Arc, 'a', '24h'); }
			}, false);
			ById('btAlliArcanaSetWeek').addEventListener('click', function () {
				var Arc = parseIntNan(ById('btAlliArcanaSel').value);
				if (Arc != 0) { t.ActivateArcana(Arc, 'a', '7d'); }
			}, false);
			ById('btPersArcanaSetDay').addEventListener('click', function () {
				var Arc = parseIntNan(ById('btPersArcanaSel').value);
				if (Arc != 0) { t.ActivateArcana(Arc, 'p', '24h'); }
			}, false);
			ById('btPersArcanaSetWeek').addEventListener('click', function () {
				var Arc = parseIntNan(ById('btPersArcanaSel').value);
				if (Arc != 0) { t.ActivateArcana(Arc, 'p', '7d'); }
			}, false);

			ById('btAlliArcanaSetDay').addEventListener('mouseover', function () { t.ArcanaHint(this, 'a', '24h'); }, false);
			ById('btAlliArcanaSetDay').addEventListener('mouseout', function () { t.ArcanaHintOff(this); }, false);
			ById('btAlliArcanaSetWeek').addEventListener('mouseover', function () { t.ArcanaHint(this, 'a', '7d'); }, false);
			ById('btAlliArcanaSetWeek').addEventListener('mouseout', function () { t.ArcanaHintOff(this); }, false);
			ById('btPersArcanaSetDay').addEventListener('mouseover', function () { t.ArcanaHint(this, 'p', '24h'); }, false);
			ById('btPersArcanaSetDay').addEventListener('mouseout', function () { t.ArcanaHintOff(this); }, false);
			ById('btPersArcanaSetWeek').addEventListener('mouseover', function () { t.ArcanaHint(this, 'p', '7d'); }, false);
			ById('btPersArcanaSetWeek').addEventListener('mouseout', function () { t.ArcanaHintOff(this); }, false);
		}

		// refresh boost info

		var BoostSpeedTypes = { 0: '-- ' + tx('Select Boost') + ' --' };
		for (var a = 0; a < t.TroopBoostSpeedList.length; a++) {
			buff = t.TroopBoostSpeedList[a]
			BoostSpeedTypes[buff] = uW.itemlist["i" + buff].name + ' (' + (Seed.items['i' + buff] ? Seed.items['i' + buff] : 0) + ')';
		}
		var BoostAccuracyTypes = { 0: '-- ' + tx('Select Boost') + ' --' };
		for (var a = 0; a < t.TroopBoostAccuracyList.length; a++) {
			buff = t.TroopBoostAccuracyList[a]
			BoostAccuracyTypes[buff] = uW.itemlist["i" + buff].name + ' (' + (Seed.items['i' + buff] ? Seed.items['i' + buff] : 0) + ')';
		}
		var SelWidth = 175;
		if (t.DashWidth == 480) SelWidth = 150;
		if (t.DashWidth == 600) SelWidth = 200;
		m = '<div id=btBoostSpeedDiv>' + htmlSelector(BoostSpeedTypes, 0, 'id=btBoostSpeedSel class=btInput style="width:' + SelWidth + 'px;" onChange="btBoostSpeedSelChange();"') + '&nbsp;<span style="display:inline-block;position:relative;">' + strButton8(tx('Activate'), 'id=btBoostSpeedSet') + '</span><br><table class=xtab width=100% style="padding-right:0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btBoostSpeedDesc></div></td></tr></table></div>';
		ById('btNewBoostSpeedCell').innerHTML = m;
		m = '<div id=btBoostAccuracyDiv>' + htmlSelector(BoostAccuracyTypes, 0, 'id=btBoostAccuracySel class=btInput style="width:' + SelWidth + 'px;" onChange="btBoostAccuracySelChange();"') + '&nbsp;<span style="display:inline-block;position:relative;">' + strButton8(tx('Activate'), 'id=btBoostAccuracySet') + '</span><br><table class=xtab width=100% style="padding-right:0px;"><tr><td style="padding-right:0px;"><div style="height:30px;padding:2px;font-size:10px;opacity:0.8;" class="wrap xtabBorder" id=btBoostAccuracyDesc></div></td></tr></table></div>';
		ById('btNewBoostAccuracyCell').innerHTML = m;

		ById('btBoostSpeedSet').addEventListener('click', function () {
			var buff = parseIntNan(ById('btBoostSpeedSel').value);
			if (buff != 0) { t.ActivateTroopBoost(buff, 'spd'); }
		}, false);

		ById('btBoostAccuracySet').addEventListener('click', function () {
			var buff = parseIntNan(ById('btBoostAccuracySel').value);
			if (buff != 0) { t.ActivateTroopBoost(buff, 'acc'); }
		}, false);

		// refresh sacrifice info

		var b = t.Buildings[25];
		if (b.count > 0) {
			t.SacSettings = (b.count <= 1) ? CM.WorldSettings.getSettingAsObject("ASCENSION_SACRIFICE_ONE_ALTER_BUFF") : CM.WorldSettings.getSettingAsObject("ASCENSION_SACRIFICE_TWO_ALTER_BUFF");
			t.SacSettings = t.SacSettings[b.maxLevel];

			t.DarkRitual = CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().DARK_RITUAL);
			t.SacSpeedBuff = CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().CHANNELED_SUFFERING);
			t.ChannelledSuffering = (t.SacSpeedBuff != 1);

			t.SacAllowed = t.DarkRitual ? 2 : 1;
			t.SacSpeed = CM.WorldSettings.getSettingAsNumber("ASCENSION_SACRIFICE_TROOPS_PER_SEC");

			var l = b.maxLevel;
			var o = [];
			var i = CM.WorldSettings.getSettingAsObject("ASCENSION_SACRIFICE_ALTAR_LEVEL_UNLOCKS");
			for (var x = 1; x <= l; x++) {
				oo = i[x].troops.split(",");
				for (var y in oo) {
					o.push(oo[y]); // contains array of troop types this city is allowed to sacrifice :)
				}
			}

			m = '<TABLE cellSpacing=0 width=100% height=0%>';
			m += '<tr><TD width="120" class=xtabBR><span class=xtab>';
			m += '<SELECT class="btSelector" id="btRitualTroops" onchange="btSelectTroopType(this);"><option value="0">-- ' + uW.g_js_strings.openCastle.trooptype + ' --</option>';
			t.QuickSacString = "";
			for (var y in uW.unitcost) {
				var TroopAllowed = (o.indexOf(y.substr(3)) >= 0);
				var DefendingTroops = 0;
				if (SelectiveDefending) { DefendingTroops = parseIntNan(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + y.substr(3)]); }
				var tot = parseIntNan(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + y.substr(3)]) + DefendingTroops;
				if ((tot > 0) && TroopAllowed) {
					var TTStyle = 'width:20px;height:20px;vertical-align:middle;';
					if (DefendingTroops != 0) { m += '<option style="font-weight:bold;" value="' + y.substr(3) + '">' + uW.unitcost[y][0] + '</option>'; TTStyle += "border:1px solid red;"; }
					else { m += '<option value="' + y.substr(3) + '">' + uW.unitcost[y][0] + '</option>'; TTStyle += "border:1px solid transparent;"; }
					t.QuickSacString = t.QuickSacString + '<a class="TextLink" onclick="btQuickSacrifice(' + y.substr(3) + ');">' + TroopImage(y.substr(3), TTStyle) + '</a> ';
				}
			}
			m += '</select></span></td>';
			m += '<td class=xtab><INPUT class="btInput" id="btRitualAmount" type=text size=7 maxlength=7 value="" onkeyup="btSetRitualLength(this)"><span id="btTotalTroops"></span></td><td align=right class=xtab><span id="btMaxTroops"></span></td>';
			m += '<td width="80" class=xtab><INPUT class="btInput" style="width: 30px;text-align:right;" id="btRitualMinutes" type=text maxlength=4 value="" onkeyup="btSetRitualLength(this)">&nbsp;m&nbsp;';
			m += '<INPUT class="btInput" style="width: 15px;text-align:right;" id="btRitualSeconds" type=text maxlength=2 value="" onkeyup="btSetRitualLength(this)">&nbsp;s&nbsp;</td>';
			m += '<td width="90" align=right class=xtab><a id="btStartRitualButton" class="inlineButton btButton blue14" onclick="btStartRitual()"><span style="width:65px;display:inline-block;text-align:center;" align="center">' + uW.g_js_strings.sacrifice_popup.starttraining + '</span></a></td></tr>';
			m += '<tr><td class=xtab colspan="5"><div class="ErrText" align="center" id=btSacErr>&nbsp;</div></td></tr>';
			m += '</table>';
			ById('btNewSacrificeCell').innerHTML = m;
		}

		// refresh troop add defenders cell

		if (SelectiveDefending) {
			t.DefOptionsString = "";
			m = '<TABLE cellSpacing=0 width=100% height=0%><tr><TD colspan=3 class=xtabHD>' + tx('Assign Defenders') + '</td><TD width="100" align=right class=xtabHD><a id="btSelectDefendButton" class="inlineButton btButton blue14" onclick="cm.CastleController.openSelectDefendingTroops();"><span style="width:85px;display:inline-block;text-align:center;" align="center">' + uW.g_js_strings.openCastle.selecttroops + '</span></a></td></tr>';
			m += '<tr id=btDefAddTroopRow><TD width="120" class=xtabBR><span class=xtab>';
			m += '<SELECT class="btSelector" id="btDefendTroops" onchange="btSelectDefTroopType(this);"><option value="0">-- ' + uW.g_js_strings.openCastle.trooptype + ' --</option>';
			for (var y in uW.unitcost) {
				var tot = parseIntNan(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + y.substr(3)]);
				if ((tot > 0)) {
					m += '<option value="' + y.substr(3) + '">' + uW.unitcost[y][0] + '</option>';
					t.DefOptionsString = t.DefOptionsString + y.substr(3);
				}
			}
			m += '</select></span></td>';
			m += '<td width="200" class=xtab><INPUT class="btInput" id="btDefendAmount" type=text size=13 maxlength=11 value=""><span id="btTotalDefTroops"></span></td>';
			m += '<td align=right class=xtab><span id="btMaxDefTroops"></span></td>';
			m += '<td width="100" align=right class=xtab><a id="btAddDefendButton" class="inlineButton btButton blue14" onclick="btAddDefenders()"><span style="width:85px;display:inline-block;text-align:center;" align="center">' + tx('Add') + '</span></a></td></tr>';
			m += '<tr id=btDefPresetRow><TD colspan=4 class=xtab style="padding-right:0px;"><TABLE cellSpacing=0 width=100% height=0%><tr><td class=xtab>';
			m += '<SELECT class="btSelector" style="width:190px;" id="btDefendPreset" onchange="btSelectDefPreset(this);"><option value="0">-- ' + tx('Select Preset') + ' --</option>';
			for (var y in Options.DashboardOptions.DefPresets) {
				m += '<option value="' + y + '">' + Options.DashboardOptions.DefPresets[y][0] + '</option>';
			}
			t.NextPresetNumber = parseIntNan(y) + 1;

			m += '</select></td>';
			m += '<td align=left class=xtab width=200><a id="btNewDefPreset" class="inlineButton btButton brown8" onclick="btNewDefPreset()"><span>' + tx('New') + '</span></a>&nbsp;<a id="btChgDefPreset" class="inlineButton btButton brown8 disabled" onclick="btChgDefPreset()"><span>' + tx('Chg') + '</span></a></td>';
			m += '<td align=right class=xtab style="padding-right:0px;"><a id="btAddPresetButton" class="inlineButton btButton blue14" onclick="btSetPresetDefenders(false)"><span style="width:15px;display:inline-block;text-align:center;" align="center">+</span></a>&nbsp;<a id="btReplacePresetButton" class="inlineButton btButton blue14" onclick="btSetPresetDefenders(true)"><span style="width:85px;display:inline-block;text-align:center;" align="center">' + tx('Replace') + '</span></a></td></tr></table>';
			if (t.ExpandDefPreset) m += '<div id=DefEditPresetRow >';
			else m += '<div id=DefEditPresetRow class=divHide >';
			m += '<TABLE cellSpacing=0 width=100% height=0%><tr><TD colspan=2 class=xtabHD style="font-size:2px;">&nbsp;</td></tr><tr><td class=xtab style="padding-top:5px;">' + tx('Preset Name') + ':&nbsp;<INPUT class="btInput" id="btDefPresetName" size=20 style="width: 185px" type=text value=""/></td>';
			m += '<td align=right class=xtab style="padding-right:0px;"><a id="btSetCurrentPreset" class="inlineButton btButton brown8" onclick="btSetCurrentPreset()"><span>' + tx('Set Current') + '</span></a>&nbsp;<a id="btSaveDefPreset" class="inlineButton btButton brown8" onclick="btSaveDefPreset()"><span>' + tx('Save') + '</span></a></td></tr>';
			m += '<tr><td colspan=2 class=xtabBR style="padding-right:0px;padding-left:10px;">';
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				m += '<span class=xtab style="display:inline-block;padding-right:0px;"><table class=xtab cellpadding=0 cellspacing=0 style="padding-right:0px"><tr><td rowspan=2>' + TroopImageBig(i) + '</td><td style="font-size:10px;">' + uW.unitcost["unt" + i][0].substring(0, 15) + '</td></tr><tr><td><INPUT class="btInput" id="btPresetTroop' + i + '" type=text size=13 maxlength=11 value=""></td></tr></table></span> ';
			}
			m += '</td></tr><tr><TD colspan=2 class=xtabHD align=right style="padding-right:0px;"><a id="btDelDefPreset" class="inlineButton btButton brown8 disabled" onclick="btDelDefPreset()"><span>' + uW.g_js_strings.commonstr.deletetx + '</span></a>&nbsp;<a id="btCancelDefPreset" class="inlineButton btButton brown8" onclick="btCancelDefPreset()"><span>' + uW.g_js_strings.commonstr.cancel + '</span></a></td></tr></table>';
			m += '</div></td></tr>';
			m += '<tr><td class=xtab colspan="4"><div style="opacity:0.6;" align="center" id=btTroopMsg>&nbsp;</div></td></tr></table>';

			ById('btTroopAddCell').innerHTML = m;

			if (t.InitPresetNumber != 0) {
				ById('btDefendPreset').value = t.InitPresetNumber;
				t.SelectDefPreset(ById('btDefendPreset'));
				t.InitPresetNumber = 0;
			}
		}
		else {
			jQuery('#btTroopAddCell').addClass("divHide");
		}
		t.PaintCityInfo(cityId);
	},

	PaintCityInfo: function (cityId) {
		var t = Dashboard;

		if (!popDash) return;

		t.Curr = Cities.byID[cityId].idx;
		var CityTag = '<div class="divHide">' + cityId + '</div>';

		// header items

		t.ResizeFrame = false;

		var Mists = Seed.items.i10021;
		var Doves = Seed.items.i901;
		var Refuges = Seed.items.i911;
		var Orders = Seed.items.i912;
		var now = unixTime();
		var TruceDuration = 0;
		if (Seed.player.truceExpireUnixTime != undefined)
			TruceDuration = Seed.player.truceExpireUnixTime - now;
		var CannotDove = ((TruceDuration > 0) && (Seed.player.warStatus != 1));

		var items = '<table style="padding-left:10px;" cellspacing=0 cellpadding=0><tr>';
		if (Mists) {
			items += '<td class=xtab><a onClick="cm.ItemController.usePotionOfMist(\'10021\')"><img height=24 class="btTop btFaint" src="' + MistImage + '" title="' + itemTitle(10021) + '"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="' + MistImage + '" title="' + itemTitle(10021) + '"></td>';
		}
		if (Seed.playerEffects.fogExpire > now) {
			items += '<td style="width:80px;" class=xtab><span style="color:#080;"><b>' + uW.timestr(Seed.playerEffects.fogExpire - now) + '</b></span></td>';
		}
		if (Doves && !CannotDove) {
			items += '<td class=xtab><a onClick="btDoveOfPeace(\'901\')"><img height=24 class="btTop btFaint" src="' + DoveImage + '" title="' + itemTitle(901) + '"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="' + DoveImage + '" title="' + itemTitle(901) + '"></td>';
		}
		if (TruceDuration > 0) {
			if (Seed.player.warStatus != 3) {
				items += '<td style="width:80px;" class=xtab><span style="color:#f00;"><b>' + tx('BROKEN!') + '</b></span></td>';
			}
			else {
				var ts = "color:#080";
				if (TruceDuration < 3600) { ts = "color:#f00" };
				items += '<td style="width:80px;" class=xtab><span style="' + ts + ';"><b>' + uW.timestr(Seed.player.truceExpireUnixTime - now) + '</b></span></td>';
			}
		}
		if (Refuges) {
			items += '<td class=xtab><a onClick="cm.InventoryView.openPortalOfRefugeModal(\'911\')"><img height=24 class="btTop btFaint" src="' + RefugeImage + '" title="' + itemTitle(911) + '"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="' + RefugeImage + '" title="' + itemTitle(911) + '"></td>';
		}
		if (Orders) {
			items += '<td class=xtab><a onClick="cm.InventoryView.openPortalOfOrderModal(\'912\')"><img height=24 class="btTop btFaint" src="' + OrderImage + '" title="' + itemTitle(912) + '"></a></td>';
		}
		else {
			items += '<td class=xtab><img height=24 class="btTop btFaint" src="' + OrderImage + '" title="' + itemTitle(912) + '"></td>';
		}

		items += '</tr></table>'
		if (CheckForHTMLChange('DASH', 'btItems', items)) {
			t.ResizeFrame = true;
		}

		// overview

		t.Buildings = getCityBuildings(cityId); // refresh buildings info each loop
		var Status = '';

		var ascended = getAscensionValues(t.CurrentCityId);
		var cityExpTime = ascended.prestigeBuffExpire;
		var prestigeexp = '';
		if ((!isNaN(cityExpTime)) && (cityExpTime + (3600 * 24) >= unixTime())) {
			if (cityExpTime < unixTime()) { prestigeexp = '<span style="color:#f00"><b>&nbsp;' + tx('Expired!') + '</b></span>'; }
			else { prestigeexp = '<span style="color:#080"><b>&nbsp;' + uW.timestr(cityExpTime - unixTime()) + ' ' + tx('Remaining') + '</b></span>'; }
		}

		if (!ascended.isPrestigeCity) { CityFaction = tx('Not ascended'); }
		else { CityFaction = getFactionName(ascended.prestigeType) + ' (' + uW.g_js_strings.commonstr.level + ' ' + ascended.prestigeLevel + ')'; }

		DefState = parseInt(Seed.citystats["city" + cityId].gate);
		if (DefState) DefButton = '<a id=btCityStatus class="inlineButton btButton red20"><span style="width:150px"><center>' + tx('Troops are Defending!') + '</center></span></a>';
		else DefButton = '<a id=btCityStatus class="inlineButton btButton green20"><span style="width:150px"><center>' + tx('Troops are Hiding!') + '</center></span></a>';

		ArcaneAura = '';
		if (ArcanaEnabled()) {
			var HQDist = distance(Seed.cities[t.Curr][2], Seed.cities[t.Curr][3], Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord);
			var AuraDist = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
			if (HQDist <= AuraDist) { ArcaneAura = '<span class=boldGreen>' + tx('HQ Dist') + ': ' + HQDist + '</span>'; }
			else { ArcaneAura = '<span class=boldRed>' + tx('HQ Dist') + ': ' + HQDist + '</span>'; }
		}

		Status += '<table cellspacing=0 width="100%" style="padding-right:0px;">';
		Status += '<tr><td class=xtab width=70>' + uW.g_js_strings.commonstr.nametx + '</a></td><td class=xtab><b>' + Seed.cities[t.Curr][1] + '</b></td><td class=xtab rowspan=2 align=right><span class=' + ((Options.DashboardOptions.UpperDefendButton == false) ? 'divHide' : '') + '>' + DefButton + '</span></td></tr>';
		Status += '<tr><td class=xtab>' + tx('Location') + '</a></td><td class=xtab><b>' + uW.provincenames['p' + Seed.cities[t.Curr][4]] + '&nbsp;' + coordLink(Seed.cities[t.Curr][2], Seed.cities[t.Curr][3]) + '</b>&nbsp;' + ArcaneAura + '</td></tr>';
		Status += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.faction + '</a></td><td class=xtab><b>' + CityFaction + '</b></td><td class=xtab id=prestigeexpcell>&nbsp;</td></tr>';

		Embassy = '<span class=xtab style="color:#f00">' + tx('No Embassy!') + '</span>';
		var emb = t.Buildings[8];
		if (emb.count > 0) {
			var availSlots = emb.maxLevel;
			for (var k in Seed.queue_atkinc) {
				if ((Seed.queue_atkinc[k].toCityId == cityId) && (Seed.queue_atkinc[k].marchStatus == 2) && (Seed.queue_atkinc[k].fromCityId != cityId) && (Cities.byID[Seed.queue_atkinc[k].fromCityId] == null)) {
					--availSlots;
				}
			}
			Embassy = availSlots + ' ' + uW.g_js_strings.commonstr.of + ' ' + emb.maxLevel + ' ' + tx('slots available');
		}
		Status += '<tr><td class=xtab><a class=xlink onClick="btShowEmbassy(' + t.Curr + ')">' + uW.buildingcost.bdg8[0] + '</a></td><td class=xtab colspan=2><b>' + Embassy + '</b></span></b></td></tr>';

		var hall = t.Buildings[7];

		Marshall = '<span class=xtab style="color:#f00">' + tx('No Marshall!') + '</span>';
		Combat = 0;
		var s = Seed.knights["city" + cityId];
		if (s) {
			s = s["knt" + Seed.leaders["city" + cityId].combatKnightId];
			if (s) {
				Combat = s.combat;
				if (s.combatBoostExpireUnixtime > unixTime()) { Combat *= 1.25; }
				Marshall = s.knightName + ' (Atk:' + Combat + ')';
				if (!t.ExpandMarshall && (hall.count >= 1)) {
					Marshall += '&nbsp;&nbsp;<a id="btChangeMarshall" class="inlineButton btButton brown8" onclick="btChangeMarshall()"><span>' + tx('Change') + '</span></a>';
					Gauntlets = Seed.items.i221;
					if (!(s.combatBoostExpireUnixtime > unixTime()) && Gauntlets) {
						Marshall += '&nbsp;<a id="btBoostMarshall" class="inlineButton btButton brown8" onclick="btBoostMarshall()" title="' + itemTitle(221) + '"><span>' + uW.g_js_strings.commonstr.boost + '</span></a>';
					}
					else {
						if (s.combatBoostExpireUnixtime > unixTime()) {
							Marshall += '&nbsp;<span style="color:#080">&nbsp;' + tx('Boosted for') + ' ' + uW.timestr(s.combatBoostExpireUnixtime - unixTime()) + '</span>';
						}
					}
				}
			}
			else {
				t.ExpandMarshall = true;
			}
		}
		else {
			t.ExpandMarshall = false; // no knights ffs!
		}

		if (hall.count < 1) { t.ExpandMarshall = false; } // no fricken knights hall!

		if (t.ExpandMarshall) Marshall += '<div>';
		else Marshall += '<div class=divHide >';
		Marshall += '<SELECT class="btSelector" id="btKnightList"><option value="0">' + uW.g_js_strings.modal_attack.dchooseknightd + '</option>';
		for (var y in Seed.knights["city" + cityId]) {
			s = Seed.knights["city" + cityId][y];
			if ((parseInt(s.knightStatus) == 1) && (s.knightId != parseInt(Seed.leaders["city" + cityId].resourcefulnessKnightId)) && (s.knightId != parseInt(Seed.leaders["city" + cityId].intelligenceKnightId)) && (s.knightId != parseInt(Seed.leaders["city" + cityId].combatKnightId)) && (s.knightId != parseInt(Seed.leaders["city" + cityId].politicsKnightId))) {
				Combat = s.combat;
				if (s.combatBoostExpireUnixtime > unixTime()) { Combat *= 1.25; }
				Marshall += '<option value="' + s.knightId + '">' + s.knightName + ' (' + uW.g_js_strings.commonstr.atk + ':' + Combat + ')</option>';
			}
		}
		Marshall += '</select>';
		Marshall += '&nbsp;&nbsp;&nbsp;<a id="btSetMarshall" class="inlineButton btButton brown8" onclick="btSetMarshall()"><span>' + uW.g_js_strings.commonstr.assign + '</span></a>&nbsp;<a id="btCancelMarshall" class="inlineButton btButton brown8" onclick="btCancelMarshall()"><span>' + uW.g_js_strings.commonstr.cancel + '</span></a></div>';

		Status += '<tr><td class=xtab valign=top><a class=xlink onClick="btShowKnightsHall(' + t.Curr + ')">' + tx('Marshall') + '</a></td><td class=xtabBR style="white-space:normal;" colspan=2><b>' + Marshall + '</b></td></tr>';

		var GotChamp = false;
		var CheckChamp = false;

		if (!uW.isNewServer()) {
			Champion = '<table cellspacing=0><tr><td class="xtab"><span class=xtab style="color:#f00"><b>' + uW.g_js_strings.champ.no_champ + '!</b></td><td class=xtab>';
			try {
				if (!Options.DashboardOptions.GraphicalChampDisplay) {
					t.citychamp = getCityChampion(cityId);
					if (t.citychamp.championId) {
						GotChamp = true;
						if (t.oldchamp != t.citychamp.championId) { t.ExpandChampion = false; }
						if (t.citychamp.status != '10') { champstat = '<span class=xtab style="color:#080">(' + uW.g_js_strings.commonstr.defending + ')</span>'; }
						else { champstat = '<span class=xtab style="color:#f00">(' + uW.g_js_strings.commonstr.marching + ')</span>'; }
						Champion = '<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="ChampStatstd"><img height=14 class=btTop id="ChampStats" onMouseover="btCreateChampionPopUp(this,' + t.citychamp.assignedCity + ',true);" src="' + ChampImagePrefix + t.citychamp.avatarId + ChampImageSuffix + '"></td><td class=xtab>' + t.citychamp.name + '</td><td class=xtab>' + champstat + '</td><td class=xtab>';
					}
					if (t.ExpandChampion) {
						Champion += '<a id="btCancelChampion" class="inlineButton btButton brown8" onclick="btCancelChampion()"><span>' + uW.g_js_strings.commonstr.cancel + '</span></a></td></tr></table><div><table cellspacing=0>';
					}
					else {
						if (!GotChamp) { Champion += '<a id="btChangeChampion" class="inlineButton btButton brown8" onclick="btChangeChampion()"><span>' + uW.g_js_strings.commonstr.assign + '</span></a>'; }
						else { if (t.citychamp.status != '10') { Champion += '<a id="btChangeChampion" class="inlineButton btButton brown8" onclick="btChangeChampion()"><span>' + tx('Change') + '</span></a>'; } }
						if (GotChamp && (t.citychamp.status != '10')) { Champion += '&nbsp;<a id="btFreeChampion" class="inlineButton btButton brown8" onclick="btFreeChampion(' + t.citychamp.championId + ',true)"><span>' + uW.g_js_strings.commonstr.unassign + '</span></a>'; }
						Champion += '</td></tr></table><div class=divHide><table cellspacing=0>';
					}
					for (var y in Seed.champion.champions) {
						chkchamp = Seed.champion.champions[y];
						if (chkchamp.championId) {
							if (!chkchamp.assignedCity || chkchamp.assignedCity != cityId) {
								CheckChamp = true;
								if (chkchamp.assignedCity && !Cities.byID[chkchamp.assignedCity]) { chkchamp.assignedCity = 0; }
								if (!chkchamp.assignedCity || chkchamp.assignedCity == 0) { chkcity = 'Unassigned'; } else { chkcity = Cities.byID[chkchamp.assignedCity].name; }
								chkbtn = '';
								defendingCity = chkcity;
								chkcol = "";
								if (chkchamp.status == '10') {
									defendingCity = tx('Marching From') + ' ' + defendingCity;
									chkcol = 'color:#800;'
								}
								else {
									if (defendingCity != 'Unassigned') {
										defendingCity = uW.g_js_strings.commonstr.defending + ' ' + defendingCity;
										chkcol = 'color:#f80;';
									}
									chkbtn = '<a id="btSetChampion' + chkchamp.championId + '" class="inlineButton btButton brown8" onclick="btSetChampion(' + chkchamp.championId + ',true)"><span>' + uW.g_js_strings.commonstr.assign + '</span></a>';
								}
								Champion += '<tr style="font-weight:normal;align:left;"><td class="xtab trimg" id="ChampStats' + chkchamp.championId + 'td"><img height=14 class=btTop id="ChampStats' + chkchamp.championId + '" onMouseover="btCreateChampionPopUp(this,' + (chkchamp.assignedCity ? chkchamp.assignedCity : 0) + ',true,' + chkchamp.championId + ');" src="' + ChampImagePrefix + chkchamp.avatarId + ChampImageSuffix + '"></td><td class=xtab>' + chkchamp.name + '</td><td class=xtab><span style="' + chkcol + '">' + defendingCity + '</span></td><td class=xtab>' + chkbtn + '</td></tr>';
							}
						}
					}
					Champion += '</table></div>';
				}
				else {
					Champion = t.PaintChampionSelector(cityId);
				}
			}
			catch (err) {
				logerr(err); // write to log
				Champion = '<span class=xtab style="color:#f00"><b>' + tx('Error reading champion data') + ' :(</b></span>';
			}

			if (!Options.DashboardOptions.GraphicalChampDisplay) {
				Status += '<tr><td class=xtab valign=top><a onClick="cm.ChampionModalController.open()">' + uW.g_js_strings.champ.champion + '</a></td><td class=xtab colspan=2><b>' + Champion + '</b></td></tr>';
			}
			else {
				Status += '<tr><td class=xtab><a class=xlink onClick="cm.ChampionModalController.open()">' + uW.g_js_strings.champ.champion + '</a></td><td class=xtab colspan=2>' + Champion + '</td></tr>';
			}
		}

		Status += '<tr><td class=xtab><a class=xlink onClick="btShowGuardians(' + t.Curr + ')">' + uW.g_js_strings.report_view.guardian + '</a></td><td class=xtab colspan=2 id="btGuardianSelector"></td></tr>';

		var now = unixTime();

		atkboost = '<span style="color:#f00"><b>' + tx('No Active Boost!') + '</b></span>';
		if (Seed.playerEffects.atk2Expire > now) {
			atkboost = '<span style="color:#080"><b>50% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.atk2Expire - now) + '</b></span>';
		}
		else {
			if (Seed.playerEffects.atkExpire > now) {
				atkboost = '<span style="color:#f80"><b>20% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.atkExpire - now) + '</b></span>';
			}
		}
		defboost = '<span style="color:#f00"><b>' + tx('No Active Boost!') + '</b></span>';
		if (Seed.playerEffects.def2Expire > now) {
			defboost = '<span style="color:#080"><b>50% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.def2Expire - now) + '</b></span>';
		}
		else {
			if (Seed.playerEffects.defExpire > now) {
				defboost = '<span style="color:#f80"><b>20% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.defExpire - now) + '</b></span>';
			}
		}
		lifeboost = '<span style="color:#f00"><b>' + tx('No Active Boost!') + '</b></span>';
		if (Seed.playerEffects.lifeExpire > now) {
			lifeboost = '<span style="color:#080"><b>10% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.lifeExpire - now) + '</b></span>';
		}
		spellboost = '<span style="color:#f00"><b>' + tx('No Active Boost!') + '</b></span>';
		if (Seed.playerEffects.spExpire && Seed.playerEffects.spExpire > now) {
			spellboost = '<span style="color:#080"><b>25% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.spExpire - now) + '</b></span>';
		}
		debuffboost = '<span style="color:#f00"><b>' + tx('No Active Boost!') + '</b></span>';
		if (Seed.playerEffects.spdatkExpire && Seed.playerEffects.spdatkExpire > now) {
			debuffboost = '<span style="color:#080"><b>25% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.spdatkExpire - now) + '</b></span>';
		}

		boosts = '<table cellspacing=0 cellpadding=0><tr>';
		for (var i = 0; i < t.BoostItemList.length; i++) {
			if (uW.ksoItems[t.BoostItemList[i]].count) {
				boosts += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\'' + t.BoostItemList[i] + '\')"><img height=28 src="' + IMGURL + 'items/70/' + t.BoostItemList[i] + '.jpg" title="' + itemTitle(t.BoostItemList[i]) + '"></a></td>';
			}
		}
		boosts += '</tr></table>'

		boosts2 = '<table cellspacing=0 cellpadding=0><tr>';
		for (var i = 0; i < t.BoostItemList2.length; i++) {
			if (uW.ksoItems[t.BoostItemList2[i]].count) {
				boosts2 += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\'' + t.BoostItemList2[i] + '\')"><img height=28 src="' + IMGURL + 'items/70/' + t.BoostItemList2[i] + '.jpg" title="' + itemTitle(t.BoostItemList2[i]) + '"></a></td>';
			}
		}
		boosts2 += '</tr></table>'

		boosts3 = '<table cellspacing=0 cellpadding=0><tr>';
		for (var i = 0; i < t.BoostItemList3.length; i++) {
			if (uW.ksoItems[t.BoostItemList3[i]] && uW.ksoItems[t.BoostItemList3[i]].count) {
				boosts3 += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\'' + t.BoostItemList3[i] + '\')"><img height=28 src="' + IMGURL + 'items/70/' + t.BoostItemList3[i] + '.jpg" title="' + itemTitle(t.BoostItemList3[i]) + '"></a></td>';
			}
		}
		boosts3 += '</tr></table>'

		Status += '<tr><td class=xtab valign=top>' + uW.g_js_strings.commonstr.attack + '</td><td class=xtab id=atkboostcell>&nbsp;</td><td class=xtab rowspan=2 align=right style="padding-right:0px;">' + boosts + '</td></tr>';
		Status += '<tr><td class=xtab valign=top>' + uW.g_js_strings.commonstr.defense + '</td><td class=xtab id=defboostcell>&nbsp;</td></tr>';
		Status += '<tr><td class=xtab valign=top>' + tx('Health') + '</td><td class=xtab id=lifeboostcell>&nbsp;</td><td class=xtab rowspan=2 align=right style="padding-right:0px;">' + boosts2 + '</td></tr>';
		Status += '<tr><td class=xtab valign=top>' + uW.g_js_strings.spells.spells + '</td><td class=xtab id=spellboostcell>&nbsp;</td></tr>';
		Status += '<tr><td class=xtab valign=top>' + uW.g_js_strings.champ.debuffs + '</td><td class=xtab id=debuffboostcell>&nbsp;</td><td class=xtab rowspan=2 align=right style="padding-right:0px;">' + boosts3 + '</td></tr>';
		Status += '<tr><td class=xtab valign=top>&nbsp;</td><td class=xtab>&nbsp;</td></tr>';

		if (Seed.activeRoyalConquestBuff && matTypeof(Seed.activeRoyalConquestBuff) == "array" && Seed.activeRoyalConquestBuff.length >= 1) {
			Status += '<tr><td class=xtab valign=top>' + tx('Conquest') + '</td><td colspan=2 class=xtab id=conquestboostcell>&nbsp;</td></tr>';
			var conqboost = '';
			for (var k = 0; k < Seed.activeRoyalConquestBuff.length; k++) {
				var conqitem = Seed.activeRoyalConquestBuff[k];
				conqboost += '<div style="color:#080" title="' + uW.itemlist["i" + conqitem.buffId].description + '"><b>' + uW.itemlist["i" + conqitem.buffId].name + ' ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(conqitem.endTime - now) + '</b></div>';
			}
		}

		Status += '</table>';

		if (!uW.isNewServer()) {
			Status += '<div id=btTRPresets></div>';
		}

		if (CheckForHTMLChange('DASH', 'btStatusCell', CityTag + Status, t.serverwait)) {
			ById('btCityStatus').addEventListener('click', function () { t.ToggleDefenceMode(cityId); }, false);
			t.PaintTRPresets();
			t.PaintGuardianSelector();
			if (GotChamp) { t.oldchamp = t.citychamp.championId; }
			else { t.oldchamp = 0; }
			t.ResizeFrame = true;
		}

		ById('atkboostcell').innerHTML = atkboost;
		ById('defboostcell').innerHTML = defboost;
		ById('lifeboostcell').innerHTML = lifeboost;
		ById('spellboostcell').innerHTML = spellboost;
		ById('debuffboostcell').innerHTML = debuffboost;
		ById('prestigeexpcell').innerHTML = prestigeexp;
		if (ById('conquestboostcell')) ById('conquestboostcell').innerHTML = conqboost;

		// arcana

		if (ArcanaEnabled()) {
			var AlliArcana = '';
			var PersArcana = '';
			var now = unixTime();
			var arcanaAlliActive = 0;
			if (Seed.activeBuffs && matTypeof(Seed.activeBuffs) == 'object') {
				for (var a in Seed.activeBuffs) {
					var arc = Seed.activeBuffs[a];
					var time1 = arc.a_24h ? arc.a_24h : 0;
					var time2 = arc.a_7d ? arc.a_7d : 0;
					if (time1 > now || time2 > now) {
						arcanaAlliActive++;
						var remspan = '';
						var rem = (time2 - now);
						var adur = '7d';
						if (time1 > now) { rem = (time1 - now); adur = '24h'; }
						if (rem <= 3600) remspan = 'boldRed';
						AlliArcana += '<div style="margin-bottom:2px;" title="' + uW.itemlist['i' + a].description + ': ' + t.GetArcanaEffect(a, t.Curr) + (a == 42015 ? '' : '%') + '"><span><b>' + uW.itemlist['i' + a].name + '</b></span>';
						if (Seed.is_chancellor || Seed.is_vicechancellor) { AlliArcana += '<span style="inline-block;float:right;margin-top:4px;">' + strButton8(tx('Deactivate'), 'onClick=btDeactivateArcana(' + a + ',"a","' + adur + '")') + '</span>'; }
						AlliArcana += '<br><span class=' + remspan + '>' + timestr(rem) + ' ' + tx('remaining') + '</span></div>';
					}
				}
			}
			if (arcanaAlliActive == 0) { AlliArcana += '<span style="margin-bottom:2px;color:#f00"><b>' + tx('No Active Boost!') + '</b><br>&nbsp;</span>'; }
			var arcanaPersActive = 0;
			if (Seed.activeBuffs && matTypeof(Seed.activeBuffs) == 'object') {
				for (var a in Seed.activeBuffs) {
					var arc = Seed.activeBuffs[a];
					var time1 = arc.p_24h ? arc.p_24h : 0;
					var time2 = arc.p_7d ? arc.p_7d : 0;
					if (time1 > now || time2 > now) {
						arcanaPersActive++;
						var remspan = '';
						var rem = (time2 - now);
						var pdur = '7d';
						if (time1 > now) { rem = (time1 - now); pdur = '24h'; }
						if (rem <= 3600) remspan = 'boldRed';
						PersArcana += '<div style="margin-bottom:2px;" title="' + uW.itemlist['i' + a].description + ': ' + t.GetArcanaEffect(a, t.Curr) + (a == 42015 ? '' : '%') + '"><span><b>' + uW.itemlist['i' + a].name + '</b></span><span style="inline-block;float:right;margin-top:4px;">' + strButton8(tx('Deactivate'), 'onClick=btDeactivateArcana(' + a + ',"p","' + pdur + '")') + '</span><br><span class=' + remspan + '>' + timestr(rem) + ' ' + tx('remaining') + '</span></div>';
					}
				}
			}
			if (arcanaPersActive == 0) { PersArcana += '<span style="margin-bottom:2px;color:#f00"><b>' + tx('No Active Boost!') + '</b><br>&nbsp;</span>'; }

			if (arcanaAlliActive < t.MaxAllianceArcana && (Seed.is_chancellor || Seed.is_vicechancellor) && ById('btAlliArcanaDiv')) { ById('btAlliArcanaDiv').style.display = ''; } else { ById('btAlliArcanaDiv').style.display = 'none'; }
			if (arcanaPersActive < t.MaxPersonalArcana) { ById('btPersArcanaDiv').style.display = ''; } else { ById('btPersArcanaDiv').style.display = 'none'; }

			if (CheckForHTMLChange('DASH', 'btAlliArcanaCell', CityTag + AlliArcana)) {
				ById('btalliarcanamax').innerHTML = t.MaxAllianceArcana;
				ById('btalliarcananum').innerHTML = arcanaAlliActive;
				t.ResizeFrame = true;
			}
			if (CheckForHTMLChange('DASH', 'btPersArcanaCell', CityTag + PersArcana)) {
				ById('btpersarcanamax').innerHTML = t.MaxPersonalArcana;
				ById('btpersarcananum').innerHTML = arcanaPersActive;
				t.ResizeFrame = true;
			}
		}

		// troop boosts

		var BoostSpeedActive = false;
		var BoostAccuracyActive = false;
		var BoostSpeed = '';
		var BoostAccuracy = '';
		if (Seed.activeSpecificTroopBuff && matTypeof(Seed.activeSpecificTroopBuff) == 'object') {
			var now = unixTime();
			for (var a in Seed.activeSpecificTroopBuff) {
				var endtime = parseIntNan(Seed.activeSpecificTroopBuff[a]);
				if (endtime > now) {
					var remspan = '';
					var rem = (endtime - now);
					if (rem <= 3600) remspan = 'boldRed';
					if (t.TroopBoostSpeedList.indexOf(parseInt(a)) != -1) {
						BoostSpeedActive = true;
						BoostSpeed += '<div style="margin-bottom:2px;" title="' + uW.itemlist['i' + a].description + '"><b>' + uW.itemlist['i' + a].name + '</b><br><span class=' + remspan + '>' + timestr(rem) + ' ' + tx('remaining') + '</span></div>';
					}
					if (t.TroopBoostAccuracyList.indexOf(parseInt(a)) != -1) {
						BoostAccuracyActive = true;
						BoostAccuracy += '<div style="margin-bottom:2px;" title="' + uW.itemlist['i' + a].description + '"><b>' + uW.itemlist['i' + a].name + '</b><br><span class=' + remspan + '>' + timestr(rem) + ' ' + tx('remaining') + '</span></div>';
					}
				}
			}
		}

		if (!BoostSpeedActive) { BoostSpeed += '<span style="margin-bottom:2px;color:#f00"><b>' + tx('No Active Boost!') + '</b><br>&nbsp;</span>'; }
		if (!BoostAccuracyActive) { BoostAccuracy += '<span style="margin-bottom:2px;color:#f00"><b>' + tx('No Active Boost!') + '</b><br>&nbsp;</span>'; }

		CheckForHTMLChange('DASH', 'btBoostSpeedCell', CityTag + BoostSpeed);
		CheckForHTMLChange('DASH', 'btBoostAccuracyCell', CityTag + BoostAccuracy);

		// sacrifices

		var s = "";
		var z = "";
		var b = t.Buildings[25];
		if (b.count > 0 && t.SacSettings) {
			s += '<table cellSpacing=0 width="100%">';
			s += '<tr><td width=20% class=xtab>' + tx('No. of Altars') + '</td><td width=20% class=xtab><b>' + b.count + '</b></td>';
			s += '<td width=40% class=xtab>' + uW.g_js_strings.blessingSystem.blessing_name_203 + '?</td><td width=20% class=xtab><b>' + (t.DarkRitual ? uW.g_js_strings.commonstr.yes : uW.g_js_strings.commonstr.no) + '</b></td></tr>';
			s += '<tr><td class=xtab>' + tx('Increase') + '</td><td class=xtab><b>' + t.SacSettings.stat_inc + '%</b></td>';
			s += '<td class=xtab>' + uW.g_js_strings.blessingSystem.blessing_name_206 + '?</td><td class=xtab><b>' + (t.ChannelledSuffering ? uW.g_js_strings.commonstr.yes : uW.g_js_strings.commonstr.no) + '</b></td></tr>';
			s += '<tr><td class=xtab>' + tx('Max. Troops') + '</td><td class=xtab><b>' + addCommas(t.SacSettings.max_amount) + '</b></td>';
			s += '<td class=xtab>' + tx('Troops per Second') + '</td><td class=xtab><b>' + (Math.round(t.SacSpeed * 100 / t.SacSpeedBuff) / 100) + '</b></td></tr>';
			s += '<tr id=btQuickSac class=divHide><td class=xtabBR colspan="4">' + t.QuickSacString + '</td></tr>';
			s += '</table>';

			sac = Seed.queue_sacr["city" + cityId],
				sacrifices = false;
			var r = 0;
			if (sac.length > 0) {
				sacrifices = true;
				jQuery.each(sac, function (P, R) {
					var Q = parseInt(R.eta, 10) - unixTime(),
						S = Math.round((R.multiplier[0] - 1) * 100),
						T = R.buffedUnitType[0];
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
					z += '<tr class="' + rowClass + '"><TD class=xtabBR><span class=xtab>' + uW.unitcost["unt" + T][0] + '</span></td><td class=xtab>' + R.quantity + '</td><td class=xtab>' + uW.timestr(Q) + '</td><td class=xtab align=right><a id="btStopRitual' + P + '" class="inlineButton btButton blue14" onclick="btStopRitual(' + P + ')"><span style="width:65px;display:inline-block;text-align:center;">' + uW.g_js_strings.commonstr.cancel + '</span></a></td></tr>';
				})
			}
			z = '<br><div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="120" class="xtabHD"><b>' + uW.g_js_strings.openCastle.trooptype + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.amount + '</b></td><td width="80" class="xtabHD"><b>' + uW.g_js_strings.commonstr.time + '</b></td><td width="90" class="xtabHD">&nbsp;</td></tr>' + z;
			z += '</table></div>';

			if (r < t.SacAllowed) {
				t.ShowNewSacrifice(true);
				t.allownewsacs = true;
			}
			else {
				t.ShowNewSacrifice(false);
				t.allownewsacs = false;
				z += '<tr><td class=xtab colspan="4"><div class="ErrText" align="center">&nbsp;</div></td></tr>';
			}
			z += '</table></div>';
		}
		else {
			z = '<div><br><div style="opacity:0.3;">' + tx('No fey altars!') + '</div><br></div>';
			t.ShowNewSacrifice(false);
			t.allownewsacs = false;
		}

		if (CheckForHTMLChange('DASH', 'btSacrificeCell', CityTag + s + z)) {
			t.PaintQuickSac();
			t.ResizeFrame = true;
		}

		// troops

		var GotTroops = false;
		var defendMight = 0;
		var TroopColour = Options.Colors.PanelText;
		var TitleColour = 'rgba(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ',0.5)';
		var TitleStyle = 'xtabHD';
		if (DefState) {
			TroopColour = '#f00';
			TitleColour = '#f00';
			TitleStyle = 'xtabHDDef';
		}

		if (DefState) DefButton2 = '<a id=btCityStatus2 class="inlineButton btButton red20"><span style="width:75px"><center>' + uW.g_js_strings.commonstr.defending + '!</center></span></a>';
		else DefButton2 = '<a id=btCityStatus2 class="inlineButton btButton green20"><span style="width:75px"><center>' + tx('Hiding!') + '</center></span></a>';

		TroopCell = '<div style="font-size:10px;" align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td colspan=2 class="xtab" style="vertical-align:text-top;">';
		if (SelectiveDefending) { TroopCell += '<INPUT id=btFixTroopsChk type=checkbox ' + (Options.DashboardOptions.ReplaceDefendingTroops[t.Curr] ? 'CHECKED' : '') + ' /><span style="color:' + TroopColour + ';font-size:11px;"><b>' + tx('Auto-Replace') + '</b></span>'; }
		TroopCell += '</td><td class="xtab" align=center><b><a class="TextLink" title="' + tx('Click to toggle troops to Hide') + '" style="color:' + TitleColour + ';font-size:14px;" onclick="btSelectDefenders(\'A\',false);">' + uW.g_js_strings.commonstr.defending + '</a></b><br></td><td colspan=2 class="xtab" align=right><span class=' + ((Options.DashboardOptions.LowerDefendButton == false) ? 'divHide' : '') + '>' + DefButton2 + '</span></td></tr>';

		if (SelectiveDefending) {
			Troops = '<tr><td width=20% class="' + TitleStyle + '"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'I\',false);">' + uW.g_js_strings.modal_barracks_trainingtab.unittypeinfantry + '</a></b></td><td width=20% class="' + TitleStyle + '"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'R\',false);">' + uW.g_js_strings.modal_barracks_trainingtab.unittyperanged + '</a></b></td><td width=20% class="' + TitleStyle + '"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'H\',false);">' + uW.g_js_strings.modal_barracks_trainingtab.unittypehorsed + '</a></b></td><td width=20% class="' + TitleStyle + '"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'S\',false);">' + uW.g_js_strings.modal_barracks_trainingtab.unittypesiege + '</a></b></td><td width=20% class="' + TitleStyle + '"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'P\',false);">' + uW.g_js_strings.modal_barracks_trainingtab.spellcaster + '</a></b></td></tr>';
			Troops += '<tr><td class="xtabBRTop">';
			for (c = 0; c < Infantry.length; c++) {
				var i = parseInt(Infantry[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] * parseInt(uW.unitmight["unt" + i])); Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',false);">' + TroopImage(i) + addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
			}
			Troops += '</td><td class="xtabBRTop">';
			for (c = 0; c < Ranged.length; c++) {
				var i = parseInt(Ranged[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] * parseInt(uW.unitmight["unt" + i])); Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',false);">' + TroopImage(i) + addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
			}
			Troops += '</td><td class="xtabBRTop">';
			for (c = 0; c < Horsed.length; c++) {
				var i = parseInt(Horsed[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] * parseInt(uW.unitmight["unt" + i])); Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',false);">' + TroopImage(i) + addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
			}
			Troops += '</td><td class="xtabBRTop">';
			for (c = 0; c < Siege.length; c++) {
				var i = parseInt(Siege[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] * parseInt(uW.unitmight["unt" + i])); Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',false);">' + TroopImage(i) + addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
			}
			Troops += '</td><td class="xtabBRTop">';
			for (c = 0; c < SpellCaster.length; c++) {
				var i = parseInt(SpellCaster[c]);
				if (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; defendMight += (Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i] * parseInt(uW.unitmight["unt" + i])); Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',false);">' + TroopImage(i) + addCommas(Seed.defunits['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
			}
			Troops += '</td></tr>';
			if (!GotTroops) { Troops = '<tr><td colspan=5 class="xtab" align=center><div style="opacity:0.3;color:' + TroopColour + '">' + tx('No Troops') + '</div></td></tr>'; }
			else { if (Options.ShowMarchMight) { Troops += '<tr><td colspan=5 class="xtab" align=center><div style="color:' + TroopColour + '">' + tx('Defending Might') + ':&nbsp;' + addCommas(defendMight) + '</div></td></tr>'; } }

			TroopCell += Troops + '<tr><td colspan=5 class="xtab" align=center>&nbsp;</td></tr>';

			GotTroops = false;
			TroopColour = Options.Colors.PanelText;
			TitleColour = 'rgba(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ',0.5)';
			TitleStyle = 'xtabHD';

			TroopCell += '<tr><td colspan=2 class="xtab" style="vertical-align:text-top;">&nbsp;</td><td class="xtab" align=center><b><a class="TextLink" title="' + tx('Click to toggle troops to Defend') + '" style="color:' + TitleColour + ';font-size:14px;" onclick="btSelectDefenders(\'A\',true);">' + tx('Sanctuary') + '</a></b><br></td><td colspan=2 class="xtab" align=right><a class=xlink onclick="btToggleSanctuary();"><span id=btShowHideSanct>' + tx('hide') + '</span></a></td></tr>';
		}

		Troops = '<tr id=btsanctroopstitle><td width=20% class="xtabHD"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'I\',true);">' + uW.g_js_strings.modal_barracks_trainingtab.unittypeinfantry + '</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'R\',true);">' + uW.g_js_strings.modal_barracks_trainingtab.unittyperanged + '</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'H\',true);">' + uW.g_js_strings.modal_barracks_trainingtab.unittypehorsed + '</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'S\',true);">' + uW.g_js_strings.modal_barracks_trainingtab.unittypesiege + '</a></b></td><td width=20% class="xtabHD"><b><a class="TextLink" style="color:' + TitleColour + ';" onclick="btSelectDefenders(\'P\',true);">' + uW.g_js_strings.modal_barracks_trainingtab.spellcaster + '</a></b></td></tr>';
		Troops += '<tr id=btsanctroops><td class="xtabBRTop">';
		for (c = 0; c < Infantry.length; c++) {
			var i = parseInt(Infantry[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',true);">' + TroopImage(i) + addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
		}
		Troops += '</td><td class="xtabBRTop">';
		for (c = 0; c < Ranged.length; c++) {
			var i = parseInt(Ranged[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',true);">' + TroopImage(i) + addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
		}
		Troops += '</td><td class="xtabBRTop">';
		for (c = 0; c < Horsed.length; c++) {
			var i = parseInt(Horsed[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',true);">' + TroopImage(i) + addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
		}
		Troops += '</td><td class="xtabBRTop">';
		for (c = 0; c < Siege.length; c++) {
			var i = parseInt(Siege[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',true);">' + TroopImage(i) + addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
		}
		Troops += '</td><td class="xtabBRTop">';
		for (c = 0; c < SpellCaster.length; c++) {
			var i = parseInt(SpellCaster[c]);
			if (Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i] > 0) { GotTroops = true; Troops += '<div class=xtab style="padding-bottom:1px;color:' + TroopColour + '"><a class="TextLink" style="color:' + TroopColour + ';" onclick="btSelectDefenders(' + i + ',true);">' + TroopImage(i) + addCommas(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + i]) + '</a></div>'; }
		}
		Troops += '</td></tr>';
		if (!GotTroops) { Troops = '<tr id=btsanctroops><td colspan=5 class="xtab" align=center><div style="opacity:0.3;color:' + TroopColour + '">' + tx('No Troops') + '</div></td></tr>'; }
		TroopCell += Troops + '<tr><td colspan=5 class="xtab" align=center>&nbsp;</td></tr></table></div>';

		if (CheckForHTMLChange('DASH', 'btTroopCell', CityTag + TroopCell)) {
			t.ShowHideSanctuary();
			if (SelectiveDefending) {
				ById('btFixTroopsChk').addEventListener('click', function (e) {
					Options.DashboardOptions.ReplaceDefendingTroops[t.Curr] = e.target.checked;
					saveOptions();
				}, false);
			}
			ById('btCityStatus2').addEventListener('click', function () { t.ToggleDefenceMode(cityId); }, false);
			// check if troop types dropdowns need refreshing - Defence AND Sacrifice!
			CheckOptionsString = "";
			for (var y in uW.unitcost) {
				var tot = parseIntNan(Seed.units['city' + Seed.cities[t.Curr][0]]['unt' + y.substr(3)]);
				if ((tot > 0)) {
					CheckOptionsString = CheckOptionsString + y.substr(3);
				}
			}
			if (t.DefOptionsString != CheckOptionsString) {
				if (SelectiveDefending) { t.InitPresetNumber = ById('btDefendPreset').value; }
				t.SetCurrentCity(Seed.cities[t.Curr][0], true);
			}
			else {
				if (SelectiveDefending) { t.SelectDefTroopType(ById("btDefendTroops")); }
			}
			t.ResizeFrame = true;
		}

		// reinforcements

		reinforcements = false;
		reinforceMight = 0;
		t.Reins = [];
		var z = "";
		var r = 0;
		for (var k in inc) {
			var to = Cities.byID[inc[k].toCityId];
			if ((inc[k].toCityId == cityId) && (to.tileId == inc[k].toTileId) && ((inc[k].marchStatus == 2) || (inc[k].marchType == 2)) && (inc[k].fromCityId != cityId)) {
				reinforcements = true;
				var a = inc[k];
				var player = Seed.players['u' + a.fromPlayerId];
				var fromname = player.n;
				marchdir = "Return"; // always show troops remaining
				var marchtime = uW.timestr(a.arrivalTime - unixTime());
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				z += '<tr class="' + rowClass + '"><TD class=xtabBR><span class=xtab>' + fromname + '</span></td><td class=xtabBR>';

				if (a["knightId"] > 0) z += '<span class=xtab>' + uW.g_js_strings.commonstr.knight + ' (Atk:' + a["knightCombat"] + ')</span> ';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (a["unit" + i + marchdir] > 0) {
						z += '<span class=xtab>' + uW.unitcost['unt' + i][0] + ': ' + addCommas(a["unit" + i + marchdir]) + '</span> ';
						reinforceMight += (a["unit" + i + marchdir] * parseInt(uW.unitmight["unt" + i]));
					}
				}
				if ((a.marchStatus == 2) || (a.arrivalTime - unixTime() <= 0)) {
					z += '</td><td class=xtab align="right"><a id="btSendHome' + a.marchId + '" class="inlineButton btButton blue14" onclick="btSendHome(' + a.marchId + ')"><span>' + uW.g_js_strings.openEmbassy.senthome + '</span></a></td></tr>';
					t.Reins.push(a.marchId); // for send all home logic
				}
				else {
					z += '</td><td class=xtab align="right">' + marchtime + '</td></tr>';
				}
			}
		}
		if (!reinforcements) {
			z = '<DIV><br><div style="opacity:0.3;">' + tx('No Reinforcements') + '</div><br></div>';
		}
		else {
			z = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="120" class="xtabHD"><b>' + uW.g_js_strings.commonstr.from + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b></td><td width="40" class="xtabHD"><a id="btSendAllHome" class="inlineButton btButton red14" onclick="btSendAllHome(' + cityId + ')"><span>' + tx('Send All Home') + '</span></a></td></tr>' + z;
			if (Options.ShowMarchMight) { z += '<tr><td colspan=4 class="xtab" style="font-size:10px;" align=center><div>' + tx('Reinforcing Might') + ':&nbsp;' + addCommas(reinforceMight) + '</div></td></tr>'; }
			z += '<tr><td class=xtab colspan="4"><div class="ErrText" align="center" id=btReinErr>&nbsp;</div></td></tr></table></div>';
		}

		if (CheckForHTMLChange('DASH', 'btReinforceCell', CityTag + z, t.serverwait)) {
			t.ResizeFrame = true;
		}

		// incoming attacks

		cityincoming = false;
		var cityinctimes = {};
		var z = "";
		var r = 0;
		for (var k in inc) {
			if ((inc[k].toCityId == cityId) && (inc[k].score)) {
				var a = inc[k];
				if (a.arrivalTime < unixTime()) continue; // don't display arrival times already happened
				cityincoming = true;
				var icon, hint, marchtime, fromname, marchdir, fromcoords;
				var marchId = a.mid;
				var marchScore = parseInt(a.score);
				var marchType = parseInt(a.marchType);
				var marchStatus = parseInt(a.marchStatus);
				var marchMight = 0;
				if (!a.marchType) { a.marchType = 4; }
				if (!a.arrivalTime || a.arrivalTime == -1) { marchtime = '??????'; }
				else { marchtime = uW.timestr(a.arrivalTime - unixTime()); }
				cityinctimes[marchId] = marchtime;
				var player = Seed.players['u' + a.pid];
				fromname = "";
				if (player) { fromname = player.n; }

				if (!a.fromXCoord) { fromcoords = ""; }
				else { fromcoords = coordLink(a.fromXCoord, a.fromYCoord); }
				if (fromname == "") { fromname = '(' + tx('Upgrade WatchTower') + ')'; }
				else { fromname = MonitorLink(a.pid, fromname); }

				switch (marchType) {
					case 3: icon = ScoutImage; hint = uW.g_js_strings.commonstr.scout; break;
					case 4: icon = AttackImage; hint = uW.g_js_strings.commonstr.attack; break;
				}
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				z += '<tr class="' + rowClass + '"><TD class=xtab><img src=' + icon + ' title=' + hint + '></td>';
				z += '<TD class=xtabBR><span class=xtab id="citymarchtime' + marchId + '">&nbsp;</span></td>';
				z += '<TD class=xtabBR><span class=xtab>' + fromname + '</span> ';
				if (fromcoords != "") { z += '<span class=xtab>' + fromcoords + '</span>'; }
				var zz = '';
				if ((safecall.indexOf(a.pid) < 0 || trusted) && a["championInfo"]) {
					t.marchchamp = '<table cellspacing=0 class=xtab><tr><td colspan=2><b>' + a["championInfo"].name + '</b></td></tr><tr><td colspan=2><b>' + uW.g_js_strings.report_view.champion_stats + '</b></td></tr>';
					var gotchamp = false;
					if (a["championInfo"].effects[1] && !(a["championInfo"].effects[1] instanceof Array) && typeof (a["championInfo"].effects[1]) === "object") {
						got202 = false;
						for (var cy in a["championInfo"].effects[1]) {
							// missing bonus damage?
							if ((cy == '202') && gotchamp) { got202 = true; }
							if ((cy == '203') && !got202) { t.marchchamp += "<tr><td>" + uW.g_js_strings.effects.name_202 + "</td><td>0</td></tr>"; }
							str = uW.g_js_strings.effects['name_' + cy];
							if (str && str != "") {
								gotchamp = true;
								t.marchchamp += "<tr><td>" + str + "</td><td>" + a["championInfo"].effects[1][cy] + "</td></tr>";
							} else { break; }
						}
					}
					if (!gotchamp) { t.marchchamp += '<tr><td colspan=2><i>' + tx('None Available') + '</i></td></tr>'; }
					t.marchchamp += '<tr><td colspan=2><b>' + uW.g_js_strings.report_view.troop_stats + '</b></td></tr>';
					var gottroop = false;
					if (a["championInfo"].effects[2] && !(a["championInfo"].effects[2] instanceof Array) && typeof (a["championInfo"].effects[2]) === "object") {
						for (var ty in a["championInfo"].effects[2]) {
							str = uW.g_js_strings.effects['name_' + ty];
							if (str && str != "") {
								gottroop = true;
								t.marchchamp += "<tr><td>" + str + "</td><td>" + a["championInfo"].effects[2][ty] + "</td></tr>";
							} else { break; }
						}
					}
					if (!gottroop) { t.marchchamp += '<tr><td colspan=2><i>' + tx('None Available') + '</i></td></tr>'; }
					t.marchchamp += "</table>";
					zz += '<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btcitymarchchamp' + a.mid + 'td"><input type="hidden" id="btcitymarchchamp' + a.mid + 'effects" value="' + t.marchchamp + '" /><a><img id="btcitymarchchamp' + a.mid + '" onMouseover="btCreateChampionPopUp(this,' + a.toCityId + ');" height=14 class=btTop src="' + ShieldImage + '"></a></td><td class=xtab>Champion: ' + a["championInfo"].name + '&nbsp;</td></tr></table>';
				}
				if (a["knt"] && a["knt"]["cbt"]) zz += '<span class=xtab>' + uW.g_js_strings.commonstr.knight + ' (' + uW.g_js_strings.commonstr.atk + ':' + a["knt"]["cbt"] + ')</span> ';
				if (a["unts"]) {
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (a["unts"]["u" + i]) {
							if (a["unts"]["u" + i] > 0) { zz += '<span class=xtab>' + uW.unitnamedesctranslated['unt' + i][0] + ': ' + addCommas(a["unts"]["u" + i]) + '</span> '; marchMight += (a["unts"]["u" + i] * parseInt(uW.unitmight["unt" + i])); }
							else { zz += '<span class=xtab>' + a["unts"]["u" + i] + ' ' + uW.unitnamedesctranslated['unt' + i][0] + '</span> '; }
						}
					}
				}
				else {
					if (a["cnt"]) { zz += '<span class=xtab>' + a["cnt"] + '</span> '; }
					else { zz += '<span class=xtab>(' + uW.g_js_strings.attack_viewimpending_view.upgradetoseeinfo + ')</span> '; }
				}

				if (local_atkinc["m" + marchId]["fromSpellType"]) {
					var spell = uW.g_js_strings.spells['name_' + local_atkinc["m" + marchId]["fromSpellType"]];
					if (spell) {
						var spellstyle = 'color:#808;';
						zz += '<br><span class=xtab style="' + spellstyle + '"><b>*&nbsp;' + spell + '&nbsp;*</b></span>'
					}
				}
				z += '<TD ';
				if (Options.ShowMarchMight && marchMight != 0) z += 'title="' + uW.g_js_strings.commonstr.might + ': ' + addCommas(marchMight) + '"';
				z += ' colspan=2 class=xtabBR>' + zz + '</td></tr>';
			}
		}
		if (!cityincoming) {
			z = '<DIV><br><div style="opacity:0.3;">' + tx('No Incoming Attacks') + '</div></div>';
		}
		else {
			z = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>' + uW.g_js_strings.commonstr.time + '</b></td><td width="120" class="xtabHD"><b>' + uW.g_js_strings.commonstr.from + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b></td></tr>' + z;
		}
		z += '</table></div>';

		if (CheckForHTMLChange('DASH', 'btAttackCell', CityTag + z)) {
			t.ResizeFrame = true;
		}

		for (var m in cityinctimes) {
			mt = cityinctimes[m];
			if (ById('citymarchtime' + m)) {
				ById('citymarchtime' + m).innerHTML = mt;
			}
		}

		// fortifications

		GotDef = false;
		t.WallDefences = [];
		t.FieldDefences = [];
		var d = Seed.fortifications["city" + Seed.cities[t.Curr][0]];
		var a = Object.keys(d);
		for (var c = 0; c < a.length; c++) {
			var f = parseInt(a[c].split("fort")[1]);
			if (f < 60 || f == 63) { t.WallDefences.push(a[c]) } else { t.FieldDefences.push(a[c]) }
		}

		var dt = t.Buildings[30];
		var rt = t.Buildings[31];
		var wall = {};
		getWallInfo(cityId, wall);
		var TArcDesc = '';
		var TArcEffect = '';
		if (ArcanaEnabled()) {
			var TArc = t.GetArcanaEffect(42001, t.Curr) + t.GetArcanaEffect(42013, t.Curr);
			if (TArc != 0) {
				TArcDesc = tx('Arcana Bonus');
				TArcEffect = TArc + '%';
			}
		}
		Walls = '<div align="center"><table cellSpacing=0 width="100%">';
		Walls += '<tr><td width=20% class=xtab><a class=xlink onClick="btShowWalls(' + t.Curr + ')">' + tx('Walls') + '</a></td><td width=60% class=xtab><b>' + (wall.wallLevel ? uW.g_js_strings.commonstr.level + ' ' + wall.wallLevel : '<span class=xtab style="color:#f00">' + tx('No Walls') + '</span>') + '</b></td><td width=20% class=xtab>' + tx('Wall Space') + '</td><td align=right class=xtab><b>' + wall.wallSpaceUsed + '/' + wall.wallSpace + '</b></td></tr>';
		Walls += '<tr><td class=xtab>' + uW.buildingcost.bdg30[0] + '</td><td class=xtab><b>' + (dt.maxLevel ? 'Level ' + dt.maxLevel : '<span class=xtab style="color:#f00">' + tx('None') + '!</span>') + '</b></td><td class=xtab>' + tx('Field Space') + '</td><td align=right class=xtab><b>' + wall.fieldSpaceUsed + '/' + wall.fieldSpace + '</b></td></tr>';
		Walls += '<tr><td class=xtab>' + uW.buildingcost.bdg31[0] + '</td><td class=xtab><b>' + (rt.maxLevel ? 'Level ' + rt.maxLevel : '<span class=xtab style="color:#f00">' + tx('None') + '!</span>') + '</b></td><td class=xtab>' + TArcDesc + '</td><td align=right class=xtab><b>' + TArcEffect + '</b></td></tr>';
		Walls += '</table><br>';

		var now = unixTime();

		tatkboost = '<span style="color:#f00"><b>' + tx('No Active Boost!') + '</b></span>';
		if (Seed.playerEffects.tatk2Expire > now) {
			tatkboost = '<span style="color:#080"><b>50% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.tatk2Expire - now) + '</b></span>';
		}
		else {
			if (Seed.playerEffects.tatkExpire > now) {
				tatkboost = '<span style="color:#f80"><b>20% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.tatkExpire - now) + '</b></span>';
			}
		}
		tlifeboost = '<span style="color:#f00"><b>' + tx('No Active Boost!') + '</b></span>';
		if (Seed.playerEffects.tlife2Expire > now) {
			tlifeboost = '<span style="color:#080"><b>50% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.tlife2Expire - now) + '</b></span>';
		}
		else {
			if (Seed.playerEffects.tlifeExpire > now) {
				tlifeboost = '<span style="color:#f80"><b>20% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.tlifeExpire - now) + '</b></span>';
			}
		}

		tboosts = '<table cellspacing=0 cellpadding=0><tr>';

		for (var i = 0; i < t.tBoostItemList.length; i++) {
			if (uW.ksoItems[t.tBoostItemList[i]].count) {
				tboosts += '<td class=xtab style="padding-right:3px;"><a onClick="cm.ItemController.use(\'' + t.tBoostItemList[i] + '\')"><img height=28 src="' + IMGURL + 'items/70/' + t.tBoostItemList[i] + '.jpg" title="' + itemTitle(t.tBoostItemList[i]) + '"></a></td>';
			}
		}

		tboosts += '</tr></table>';
		var tStatus = '<table cellSpacing=0 width="100%">';
		tStatus += '<tr><td width=20% class=xtab valign=top>' + tx('Tower Attack') + '</td><td class=xtab id=tatkboostcell>&nbsp;</td><td class=xtab rowspan=2 style="padding-right:0px;" align=right>' + tboosts + '</td></tr>';
		tStatus += '<tr><td width=20% class=xtab valign=top>' + tx('Tower Life') + '</td><td class=xtab id=tlifeboostcell>&nbsp;</td></tr>';

		tStatus += '</table><br>';

		Defences = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width=50% class="xtabHD"><b>' + uW.g_js_strings.openCastle.walldefenses + '</b></td><td width=50% class="xtabHD"><b>' + tx('Field Defenses') + '</b></td></tr>';
		Defences += '<tr><td class="xtabBRTop">';
		for (c = 0; c < t.WallDefences.length; c++) {
			var f = parseInt(t.WallDefences[c].split("fort")[1]);
			if (Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort' + f] > 0) { GotDef = true; Defences += '<span class=xtab style="display:inline-block;width:100px;">' + TroopImage(f) + addCommas(Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort' + f]) + '</span> '; }
		}
		Defences += '</td><td class="xtabBRTop">';
		for (c = 0; c < t.FieldDefences.length; c++) {
			var f = parseInt(t.FieldDefences[c].split("fort")[1]);
			if (Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort' + f] > 0) { GotDef = true; Defences += '<span class=xtab style="display:inline-block;width:100px;">' + TroopImage(f) + addCommas(Seed.fortifications['city' + Seed.cities[t.Curr][0]]['fort' + f]) + '</span> '; }
		}
		Defences += '</td></tr></table>';
		if (!GotDef) { Defences = '<div><br><div style="opacity:0.3;">' + tx('No Fortifications') + '</div>'; }
		Defences += '<br></div>';

		if (CheckForHTMLChange('DASH', 'btWallDefenceCell', CityTag + Walls + tStatus + Defences)) {
			t.ResizeFrame = true;
		}

		ById('tatkboostcell').innerHTML = tatkboost;
		ById('tlifeboostcell').innerHTML = tlifeboost;

		// outgoing attacks

		cityoutgoing = false;
		var cityouttimes = {};
		var z = "";
		var r = 0;
		for (var k in outCity) {
			var a = outCity[k];
			if (a.destinationUnixTime < unixTime()) continue; // don't display arrival times already happened
			var icon, hint, marchtime, totile, tocity, toname, marchdir, tocoords;

			var marchId = a.marchId;
			var marchStatus = parseInt(a.marchStatus);
			var marchType = parseInt(a.marchType);
			var marchMight = 0;
			if (marchType == 10) marchType = 4; // Change Dark Forest type to Attack!
			if (marchType != 4 && marchType != 3) continue; // attacks and scouts only
			cityoutgoing = true;
			var now = unixTime();
			var destinationUnixTime = a["destinationUnixTime"] - now;

			marchdir = "Count";

			totile = "";
			tocity = "";
			toname = "";
			totile = tileTypes[parseInt(a["toTileType"])];
			if (a["toTileType"] == 51) {
				if (!a["toPlayerId"]) { totile = ""; }
				else { if (a["toPlayerId"] == 0) totile = tx('Barb Camp'); }
			}
			totile = 'Lvl ' + a["toTileLevel"] + ' ' + totile;

			if (a["toPlayerId"] && (a["toPlayerId"] != 0)) {
				if (a.players && a.players['u' + a.toPlayerId]) {
					toname = MonitorLink(a.toPlayerId, a.players['u' + a.toPlayerId].n);
				}
				else {
					if (Seed.players['u' + a.toPlayerId]) {
						toname = MonitorLink(a.toPlayerId, Seed.players['u' + a.toPlayerId].n);
					}
				}
			}

			var iconType = marchType;

			if (destinationUnixTime < (60)) { marchtime = '<span style="color:#f00">' + uW.timestr(destinationUnixTime) + '</span>'; }
			else { marchtime = uW.timestr(destinationUnixTime); }

			cityouttimes[marchId] = marchtime;

			if (!a.toXCoord || (tocity != "")) { tocoords = ""; }
			else { tocoords = coordLink(a.toXCoord, a.toYCoord); }

			hint = "";
			switch (marchType) {
				case 3: hint = uW.g_js_strings.commonstr.scout; break;
				case 4: hint = uW.g_js_strings.commonstr.attack; break;
			}

			switch (iconType) {
				case 3: icon = ScoutImage; break;
				case 4: icon = AttackImage; break;
			}
			hint = tx('Recall march') + " (" + marchId + ")";

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="' + rowClass + '"><TD class=xtab><a id="btCityRecall' + a.marchId + '" onclick="btRecall(' + a.marchId + ',true)"><img src=' + icon + ' title=' + hint + '></a></td>';
			z += '<TD class=xtab id="cityoutmarchtime' + marchId + '">&nbsp;</td>';
			z += '<TD class=xtabBR>';
			if (toname != "") { z += '<span class=xtab>' + toname + '</span> '; }
			if (totile != "") { z += '<span class=xtab>' + totile + '</span> '; }
			if (tocity != "") { z += '<span class=xtab>' + tocity + '</span> '; }
			if (tocoords != "") { z += '<span class=xtab>' + tocoords + '</span>'; }
			z += '</td>';
			var zz = '';
			if (a["championInfo"]) { // stats here are sort of obsolete, because it uses city champ data, but kept in for completeness...
				t.marchchamp = '<table cellspacing=0 class=xtab><tr><td colspan=2><b>' + a["championInfo"].name + '</b></td></tr><tr><td colspan=2><b>' + uW.g_js_strings.report_view.champion_stats + '</b></td></tr>';
				var gotchamp = false;
				if (a["championInfo"].effects) {
					if (a["championInfo"].effects[1] && !(a["championInfo"].effects[1] instanceof Array) && typeof (a["championInfo"].effects[1]) === "object") {
						got202 = false;
						for (var cy in a["championInfo"].effects[1]) {
							// missing bonus damage?
							if ((cy == '202') && gotchamp) { got202 = true; }
							if ((cy == '203') && !got202) { t.marchchamp += "<tr><td>" + uW.g_js_strings.effects.name_202 + "</td><td>0</td></tr>"; }
							str = uW.g_js_strings.effects['name_' + cy];
							if (str && str != "") {
								gotchamp = true;
								t.marchchamp += "<tr><td>" + str + "</td><td>" + a["championInfo"].effects[1][cy] + "</td></tr>";
							} else { break; }
						}
					}
					if (!gotchamp) { t.marchchamp += '<tr><td colspan=2><i>' + tx('None Available') + '</i></td></tr>'; }
					t.marchchamp += '<tr><td colspan=2><b>' + uW.g_js_strings.report_view.troop_stats + '</b></td></tr>';
					var gottroop = false;
					if (a["championInfo"].effects[2] && !(a["championInfo"].effects[2] instanceof Array) && typeof (a["championInfo"].effects[2]) === "object") {
						for (var ty in a["championInfo"].effects[2]) {
							str = uW.g_js_strings.effects['name_' + ty];
							if (str && str != "") {
								gottroop = true;
								t.marchchamp += "<tr><td>" + str + "</td><td>" + a["championInfo"].effects[2][ty] + "</td></tr>";
							} else { break; }
						}
					}
					if (!gottroop) { t.marchchamp += '<tr><td colspan=2><i>' + tx('None Available') + '</i></td></tr>'; }
					t.marchchamp += "</table>";
				}
				zz += '<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btcityoutmarchchamp' + a.marchId + 'td"><input type="hidden" id="btcityoutmarchchamp' + a.marchId + 'effects" value="' + t.marchchamp + '" /><a><img id="btcityoutmarchchamp' + a.marchId + '" onMouseover="btCreateChampionPopUp(this,' + a.fromCityId + ',true);" height=14 class=btTop src="' + ShieldImage + '"></a></td><td class=xtab>' + uW.g_js_strings.champ.champion + ': ' + a["championInfo"].name + '&nbsp;</td></tr></table>';
			}
			if ((a["knightId"] > 0) && (!a["knightCombat"])) {
				for (var i in Seed.knights["city" + a.marchCityId]) {
					if (i == ("knt" + a["knightId"])) {
						Combat = Seed.knights["city" + a.marchCityId][i]["combat"];
						if (Seed.knights["city" + a.marchCityId][i]["combatBoostExpireUnixtime"] > unixTime()) { Combat *= 1.25; }
						a["knightCombat"] = Combat;
					}
				}
			}

			if (a["knightId"] > 0) zz += '<span class=xtab>' + uW.g_js_strings.commonstr.knight + ' (' + uW.g_js_strings.commonstr.atk + ':' + a["knightCombat"] + ')</span> ';
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				if ((a["unit" + i + "Count"] > 0) || (a["unit" + i + "Return"] > 0)) {
					trpcol = Options.Colors.PanelText;
					zz += '<span class=xtab>' + uW.unitcost['unt' + i][0] + ': <span class=xtab style="color:' + trpcol + '">' + addCommas(a["unit" + i + marchdir]) + '</span></span> ';
					marchMight += (a["unit" + i + marchdir] * parseInt(uW.unitmight["unt" + i]));
				}
			}

			if (a["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_' + a["fromSpellType"]];
				if (spell) {
					var spellstyle = 'color:#808;';
					zz += '<br><span class=xtab style="' + spellstyle + '"><b>*&nbsp;' + spell + '&nbsp;*</b></span>'
				}
			}
			z += '<TD ';
			if (Options.ShowMarchMight && marchMight != 0) z += 'title="' + uW.g_js_strings.commonstr.might + ': ' + addCommas(marchMight) + '"';
			z += ' colspan=2 class=xtabBR>' + zz + '</td></tr>';
		}
		if (!cityoutgoing) {
			z = '<DIV><br><div style="opacity:0.3;">' + tx('No Outgoing Attacks') + '</div></div>';
		}
		else {
			z = '<div align="center"><TABLE cellSpacing=0 width=100% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>' + uW.g_js_strings.commonstr.time + '</b></td><td width="120" class="xtabHD"><b>' + uW.g_js_strings.commonstr.target + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b></td></tr>' + z;
		}
		z += '<tr><td class=xtab colspan="4"><div class="ErrText" align="center" id=btCityOutErr>&nbsp;</div></td></tr></table></div>';

		if (CheckForHTMLChange('DASH', 'btCityAttackCell', CityTag + z)) {
			t.ResizeFrame = true;
		}

		for (var m in cityouttimes) {
			mt = cityouttimes[m];
			if (ById('cityoutmarchtime' + m)) {
				ById('cityoutmarchtime' + m).innerHTML = mt;
			}
		}

		// toggle section displays

		t.ShowHideSection("btStatus", t.OverviewShow);
		t.ShowHideSection("btArcana", t.ArcanaShow && ArcanaEnabled());
		t.ShowHideSection("btSacrifice", t.SacrificeShow && (ascended.prestigeType == "2"));
		t.ShowHideSection("btTroop", t.TroopShow);
		t.ShowHideSection("btReinforce", t.ReinforceShow);
		t.ShowHideSection("btWallDefence", t.FortificationShow);
		t.ShowHideSection("btAttack", t.AttackShow);
		t.ShowHideSection("btCityAttack", t.CityAttackShow);

		t.ShowHideRow("btDefAddTroopRow", Options.DashboardOptions.DefAddTroopShow);
		t.ShowHideRow("btDefPresetRow", Options.DashboardOptions.DefPresetShow);

		if (t.ResizeFrame == true) { ResetFrameSize('btDash', 100, t.DashWidth); }
	},

	EverySecond: function () {
		var t = Dashboard;

		try {
			/* Reduce Delayers if they are Active */

			if (t.ThroneDelay > 0) { t.ThroneDelay--; t.PaintTRPresets(); }
			if (t.GuardDelay > 0) { t.GuardDelay--; t.PaintGuardianSelector(); }

			if (!(Options.DashboardOptions.CurrentCity < 0)) {
				if (((SecondLooper % t.GeneralInterval) == 1) || t.GeneralInterval == 1) {
					t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
				}
			};

			/* check defence status, incoming status, selected guardian */

			for (var cityId in Cities.byID) {
				var city_num = Cities.byID[cityId].idx;
				if (Seed.citystats["city" + cityId].gate != 0) {
					jQuery("#btCastles_" + city_num).removeClass("hiding").addClass("defending");
				} else {
					jQuery("#btCastles_" + city_num).removeClass("defending").addClass("hiding");
				}
				if (incCity.indexOf(city_num) >= 0) { jQuery("#btCastles_" + city_num).addClass("attack"); }
				else { jQuery("#btCastles_" + city_num).removeClass("attack"); }
			}

			if (t.CurrGuardian != Seed.guardian[Options.DashboardOptions.CurrentCity].type) { t.PaintGuardianSelector(); }

			if (Options.DashboardOptions.RefreshSeed && ((SecondLooper % RefreshSeedInterval) == 1) && !RefreshingSeed) {
				setTimeout(function () { RefreshSeed(); }, 250);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	ToggleSanctuary: function () {
		var t = Dashboard;
		Options.DashboardOptions.ExpandSanctuary = !Options.DashboardOptions.ExpandSanctuary;
		saveOptions();
		t.ShowHideSanctuary();
	},

	ShowHideSanctuary: function () {
		var t = Dashboard;
		var a = ById('btShowHideSanct');
		if (Options.DashboardOptions.ExpandSanctuary) {
			disp = '';
			if (a) a.innerHTML = tx('hide');
		} else {
			disp = 'none';
			if (a) a.innerHTML = tx('show');
		}
		ById('btsanctroops').style.display = disp;
		if (ById('btsanctroopstitle')) ById('btsanctroopstitle').style.display = disp;
	},

	SetAlliArcanaDesc: function () {
		var t = Dashboard;
		ById('btAlliArcanaDesc').innerHTML = '';
		var Arc = parseIntNan(ById('btAlliArcanaSel').value);
		if (Arc != 0) {
			ById('btAlliArcanaDesc').innerHTML = uW.itemlist["i" + Arc].description;
		}
	},

	SetPersArcanaDesc: function () {
		var t = Dashboard;
		ById('btPersArcanaDesc').innerHTML = '';
		var Arc = parseIntNan(ById('btPersArcanaSel').value);
		if (Arc != 0) {
			ById('btPersArcanaDesc').innerHTML = uW.itemlist["i" + Arc].description;
		}
	},

	ArcanaHint: function (elem, itemType, timeType) {
		var t = Dashboard;
		if (itemType == 'a') { var Arc = ById('btAlliArcanaSel').value; }
		else { var Arc = ById('btPersArcanaSel').value; }

		if (Arc != 0) {
			var TT = '<div align=center><b>' + tx('Cost') + '</b></div><div align=left>';
			var Cost = ArcaneRequirements[Arc][itemType + "_" + timeType].cost;
			if (Cost) {
				for (var r in Cost) {
					if (itemType == "p") { // arcane tablets only I think!
						if (r == '43000') {
							var resspan = '<span>';
							if (parseIntNan(Cost[r]) > parseIntNan(Seed.items.i43000)) { resspan = '<span class=boldRed>'; }
							TT += ResourceImage(ArcaneTabletImage, uW.g_js_strings.playerGuide.ahq_14_h) + ' ' + resspan + addCommas(Cost[r]) + '</span><br>';
						}
					}
					else {
						var restype = ArcaneResources[r];
						var resicon = ArcaneResourceImages[r];

						var resspan = '<span>';
						TT += ResourceImage(resicon, '') + ' ' + resspan + addCommas(Cost[r]) + '</span><br>';
					}
				}
			}
			else {
				TT += tx('Unknown');
			}
			TT += '</div>'
			if (itemType == "p") { TT += '<div align=center><b>' + tx('Owned') + '</b></div><div align=left>' + ResourceImage(ArcaneTabletImage, uW.g_js_strings.playerGuide.ahq_14_h) + ' ' + addCommas(parseIntNan(Seed.items.i43000)) + '<br></div>'; }
			jQuery(elem.parentNode).children("span").remove();
			jQuery(elem.parentNode).append('<span class="tooltip" style="margin-top:20px;right:0px;margin-left:-130px;white-space: pre-line; word-wrap: break-word;">' + TT + '</span>');
		}
	},

	ArcanaHintOff: function (elem) {
		jQuery(elem.parentNode).children("span").remove();
	},

	GetArcanaEffect: function (item, citynum) {
		var res = 0;
		if (ArcanaEnabled()) {
			if (Seed.activeBuffs && Seed.activeBuffs[item] && ArcaneRequirements[item]) {
				var arc = Seed.activeBuffs[item];
				var eff = ArcaneRequirements[item].effects;
				var alliance = 0;
				var personal = 0;
				var now = unixTime();
				var HQDist = distance(Seed.cities[citynum][2], Seed.cities[citynum][3], Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord);
				var AuraDist = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
				var time1 = arc.a_24h ? arc.a_24h : 0;
				var time2 = arc.a_7d ? arc.a_7d : 0;
				if (time1 > now || time2 > now) {
					if (HQDist <= AuraDist) {
						for (var k in eff.inAura) { alliance = eff.inAura[k]; break; }
					}
					else {
						for (var k in eff.outAura) { alliance = eff.outAura[k]; break; }
					}
				}
				var time1 = arc.p_24h ? arc.p_24h : 0;
				var time2 = arc.p_7d ? arc.p_7d : 0;
				if (time1 > now || time2 > now) {
					for (var k in eff.personal) { personal = eff.personal[k]; break; }
				}
				if (alliance != 0 && item != 42015) { personal = personal / 2; }
				res = alliance + personal;
			}
		}
		return res;
	},

	setArcanaMessage: function (msg) {
		var t = Dashboard;
		ById('btArcanaErr').innerHTML = msg;
	},

	ActivateArcana: function (itemId, itemType, timeType) {
		var t = Dashboard;
		t.setArcanaMessage(tx('Sending Request') + '...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.itemId = itemId;
		params.itemType = itemType;
		params.timeType = timeType;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqTempleActivateBuff.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var j = CM.AHQTempleModel.buffActivated(uWCloneInto(rslt.activatedBuff));
					OpenTemple(function (rslt) { Tabs.Alliance.SetBoosts(rslt); Dashboard.setArcanaMessage(''); Dashboard.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]); }); // refresh seed from server
				}
				else { // error handling
					if (rslt.error_code) { t.setArcanaMessage('<span style="color:#f00">' + uW.g_js_strings.errorcode["err_" + rslt.error_code] + '</span>'); }
					else { t.setArcanaMessage('<span style="color:#f00">' + tx('Error activating arcana') + '</span>'); }
				}
			},
			onFailure: function () { // error handling
				t.setArcanaMessage('<span style="color:#f00">' + tx('Server connection failed') + '.</span>');
			}
		}, true); //no retry

	},

	DeactivateArcana: function (itemId, itemType, timeType) {
		var t = Dashboard;
		t.setArcanaMessage(tx('Sending Request') + '...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.itemId = itemId;
		params.itemType = itemType;
		params.timeType = timeType;
		params.deactivate = 1;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqTempleActivateBuff.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var j = CM.AHQTempleModel.buffDeActivated(uWCloneInto(rslt.activatedBuff));
					OpenTemple(function (rslt) { Tabs.Alliance.SetBoosts(rslt); Dashboard.setArcanaMessage(''); Dashboard.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]); }); // refresh seed from server
				}
				else { // error handling
					if (rslt.error_code) { t.setArcanaMessage('<span style="color:#f00">' + uW.g_js_strings.errorcode["err_" + rslt.error_code] + '</span>'); }
					else { t.setArcanaMessage('<span style="color:#f00">' + tx('Error Deactivating arcana') + '</span>'); }
				}
			},
			onFailure: function () { // error handling
				t.setArcanaMessage('<span style="color:#f00">' + tx('Server connection failed') + '.</span>');
			}
		}, true); //no retry

	},

	SetSpeedBoostDesc: function () {
		var t = Dashboard;
		ById('btBoostSpeedDesc').innerHTML = '';
		var buff = parseIntNan(ById('btBoostSpeedSel').value);
		if (buff != 0) {
			ById('btBoostSpeedDesc').innerHTML = uW.itemlist["i" + buff].description;
		}
	},

	SetAccuracyBoostDesc: function () {
		var t = Dashboard;
		ById('btBoostAccuracyDesc').innerHTML = '';
		var buff = parseIntNan(ById('btBoostAccuracySel').value);
		if (buff != 0) {
			ById('btBoostAccuracyDesc').innerHTML = uW.itemlist["i" + buff].description;
		}
	},

	ActivateTroopBoost: function (itemId, label) {
		var t = Dashboard;
		t.setTroopBoostMessage(tx('Sending Request') + '...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.iid = itemId;
		params.label = label;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/useSpecificTroopBoost.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					CM.InventoryView.removeItemFromInventory(itemId, 1);
					if (rslt.specificTroopBuffInfo) {
						Seed.activeSpecificTroopBuff = rslt.specificTroopBuffInfo.b;
						Seed.isSpecificTroopBuffActive = rslt.specificTroopBuffInfo.a;
						uW.update_boosts();
						t.setTroopBoostMessage('');
						t.SetCurrentCity(Seed.cities[t.Curr][0], true);
					}
				} else {
					var errorMsg = "Unknown Error";
					if (rslt.error_code == 3102) {
						errorMsg = uW.g_js_strings.errorcode.err_3102
					} else {
						if (rslt.error_code == 3333) {
							errorMsg = "This item cannot be used."
						} else {
							if (rslt.error_code == 4444) {
								errorMsg = "You do not have the item in your inventory."
							} else {
								errorMsg = "Unknown Error"
							}
						}
					}
					t.setTroopBoostMessage(errorMsg);
				}
			}
		}, true); //no retry

	},

	setTroopBoostMessage: function (msg) {
		var t = Dashboard;
		ById('btBoostErr').innerHTML = msg;
	},

	PaintQuickSac: function () {
		var t = Dashboard;
		if (!ById('btQuickSac')) { return; }
		if ((Options.DashboardOptions.QuickSacrifice == true) && (t.allownewsacs == true))
			t.ShowQuickSac(true);
		else
			t.ShowQuickSac(false);
	},

	ShowQuickSac: function (tf) {
		var t = Dashboard;
		var dc = jQuery('#btQuickSac').attr('class');
		if (tf) { if (dc.indexOf('divHide') >= 0) jQuery('#btQuickSac').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#btQuickSac').attr('class', 'divHide'); }
	},

	ShowNewSacrifice: function (tf) {
		var t = Dashboard;
		var dc = jQuery('#btNewSacrificeCell').attr('class');
		if (tf) { if (dc.indexOf('divHide') >= 0) jQuery('#btNewSacrificeCell').attr('class', ''); }
		else { if (dc.indexOf('divHide') < 0) jQuery('#btNewSacrificeCell').attr('class', 'divHide'); }
	},

	SelectTroopType: function (sel) {
		var t = Dashboard;
		if ((sel.value == 0) || (sel.value == "")) {
			ById('btTotalTroops').innerHTML = "";
			ById('btMaxTroops').innerHTML = "";
			t.TotalTroops = 0;
			return false
		} else {
			if (SelectiveDefending) { t.TotalTroops = parseIntNan(Seed.units['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt' + sel.value]) + parseIntNan(Seed.defunits['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt' + sel.value]); }
			else { t.TotalTroops = parseIntNan(Seed.units['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt' + sel.value]); }
			ById('btTotalTroops').innerHTML = '&nbsp;/&nbsp;' + addCommas(t.TotalTroops);
			ById('btMaxTroops').innerHTML = '<a id="btMaxButton" onclick="btSetMaxTroops()"><span style="font-size:9px;" align="center">max</span></a>';
			// set default sac length if blank
			if (Options.DashboardOptions.DefaultSacrifice) {
				var elemin = ById('btRitualMinutes');
				var elesec = ById('btRitualSeconds');
				if ((elemin.value == "") && (elesec.value == "")) {
					elemin.value = Options.DashboardOptions.DefaultSacrificeMin;
					elesec.value = Options.DashboardOptions.DefaultSacrificeSec;
					t.SetRitualLength(elesec);
				}
			}
			var elem = ById('btRitualAmount');
			if (parseInt(elem.value) > t.TotalTroops) {
				elem.value = t.TotalTroops;
				t.SetRitualLength(elem);
			}
		}
	},

	SetMaxTroops: function () {
		var t = Dashboard;
		var elem = ById('btRitualAmount');
		elem.value = t.SacSettings.max_amount;
		if (elem.value > t.TotalTroops) { elem.value = t.TotalTroops; }
		if ((elem.value > Options.DashboardOptions.SacrificeLimit) && (parseIntNan(Options.DashboardOptions.SacrificeLimit) > 0)) { elem.value = Options.DashboardOptions.SacrificeLimit; }
		t.SetRitualLength(elem);
	},

	SetRitualLength: function (sel) {
		var t = Dashboard;
		sel.value = parseInt(sel.value);
		if (isNaN(sel.value)) sel.value = 0;

		var trp, min, sec;

		if (sel.id == 'btRitualMinutes') {
			min = parseIntNan(sel.value);

			if (isNaN(ById('btRitualSeconds').value)) sec = 0;
			else sec = parseIntNan(ById('btRitualSeconds').value);

			trp = Math.round((parseIntNan(min * 60) + sec) * (t.SacSpeed / t.SacSpeedBuff)); // troops
		}

		if (sel.id == 'btRitualSeconds') {
			sec = parseIntNan(sel.value);

			if (isNaN(ById('btRitualMinutes').value)) min = 0;
			else min = parseIntNan(ById('btRitualMinutes').value);

			min += (parseIntNan(sec / 60));
			sec = sec % 60;

			trp = Math.round(((min * 60) + sec) * (t.SacSpeed / t.SacSpeedBuff)); // troops
		}

		if (sel.id == 'btRitualAmount') {
			trp = parseIntNan(sel.value);
		}

		if (trp > t.TotalTroops) { trp = t.TotalTroops; }
		if (trp > parseInt(t.SacSettings.max_amount)) { trp = t.SacSettings.max_amount; }
		if ((trp > Options.DashboardOptions.SacrificeLimit) && (parseIntNan(Options.DashboardOptions.SacrificeLimit) > 0)) { trp = Options.DashboardOptions.SacrificeLimit; }

		sec = parseIntNan(trp / (t.SacSpeed / t.SacSpeedBuff), 10); // seconds
		min = parseIntNan(sec / 60);
		sec = sec % 60;

		ById('btRitualAmount').value = BlankifZero(trp);
		ById('btRitualMinutes').value = BlankifZero(min);
		ById('btRitualSeconds').value = BlankifZero(sec);
	},

	setTroopMessage: function (msg) {
		var t = Dashboard;
		ById('btTroopMsg').innerHTML = msg;
	},

	ToggleDefenceMode: function (cityId) {
		var t = Dashboard;
		if (!SelectiveDefending) return;
		jQuery('#btCityStatus').addClass("disabled");
		jQuery('#btCityStatus2').addClass("disabled");
		ResetHTMLRegister('DASH', 'btStatusCell');
		t.serverwait = true;

		var state = 1;
		if (Seed.citystats["city" + cityId].gate != 0)
			state = 0;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.state = state;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/gate.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				t.serverwait = false;
				if (rslt.ok) {
					Seed.citystats["city" + cityId].gate = state;
					if (t.CurrentCityId == cityId) { t.PaintCityInfo(cityId); }
				}
				jQuery('#btCityStatus').removeClass("disabled");
				jQuery('#btCityStatus2').removeClass("disabled");
			},
			onFailure: function () { t.serverwait = false; jQuery('#btCityStatus').removeClass("disabled"); jQuery('#btCityStatus2').removeClass("disabled"); }
		});
	},

	SelectDefenders: function (sel, def) {
		var t = Dashboard;
		if (!SelectiveDefending) return;
		var MoveArray = [];
		if (!def) { // switch to sanctuary
			if (sel == "A") { // All
				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "I") { // Infantry
				for (c = 0; c < Infantry.length; c++) {
					var i = parseInt(Infantry[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "R") { // Ranged
				for (c = 0; c < Ranged.length; c++) {
					var i = parseInt(Ranged[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "H") { // Horsed
				for (c = 0; c < Horsed.length; c++) {
					var i = parseInt(Horsed[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "S") { // Siege
				for (c = 0; c < Siege.length; c++) {
					var i = parseInt(Siege[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "P") { // SpellCaster
				for (c = 0; c < SpellCaster.length; c++) {
					var i = parseInt(SpellCaster[c]);
					MoveArray[i] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (parseIntNan(sel) != 0) { // Troop Identifier
				MoveArray[sel] = 0 - parseIntNan(Seed.defunits['city' + t.CurrentCityId]['unt' + sel]);
			}
		}
		else { // switch to defend
			if (sel == "A") { // All
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "I") { // Infantry
				for (c = 0; c < Infantry.length; c++) {
					var i = parseInt(Infantry[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "R") { // Ranged
				for (c = 0; c < Ranged.length; c++) {
					var i = parseInt(Ranged[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "H") { // Horsed
				for (c = 0; c < Horsed.length; c++) {
					var i = parseInt(Horsed[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "S") { // Siege
				for (c = 0; c < Siege.length; c++) {
					var i = parseInt(Siege[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (sel == "P") { // SpellCaster
				for (c = 0; c < SpellCaster.length; c++) {
					var i = parseInt(SpellCaster[c]);
					MoveArray[i] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt' + i]);
				}
			}
			if (parseIntNan(sel) != 0) { // Troop Identifier
				MoveArray[sel] = parseIntNan(Seed.units['city' + t.CurrentCityId]['unt' + sel]);
			}
		}
		t.ChangeDefendingTroops(t.CurrentCityId, MoveArray, false);
	},

	ChangeDefendingTroops: function (cityId, MoveArray, Replace, notify) {
		var t = Dashboard;
		t.setTroopMessage(tx('Sending Request') + '...');
		var params = uW.Object.clone(uW.g_ajaxparams)
		params.cid = cityId;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Replace) { params["u" + i] = parseIntNan(MoveArray[i]); }
			else { params["u" + i] = parseIntNan(Seed.defunits['city' + cityId]['unt' + i]) + parseIntNan(MoveArray[i]); }
		}

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/cityDefenseSet.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var unitsarr = [];
					for (var j in uW.unitcost)
						unitsarr.push(0);
					for (var i = 0; i <= unitsarr.length; i++)
						if (params["u" + i])
							unitsarr[i] = params["u" + i];
					if (rslt.def != null) {
						var unitlist = uW.seed.defunits["city" + cityId];
						jQuery.each(rslt.def, function (key, val) {
							var key1 = key.replace("u", "unt");
							unitlist[key1] = val
						})
					}
					if (rslt.res != null) {
						var unitlist = uW.seed.units["city" + cityId];
						jQuery.each(rslt.res, function (key, val) {
							var key1 = key.replace("u", "unt");
							unitlist[key1] = val
						})
					}
					t.setTroopMessage('&nbsp;');
					t.SelectDefTroopType(ById("btDefendTroops"));
					if (notify != null) { notify(); }
					else {
						if (cityId == t.CurrentCityId) {
							t.PaintCityInfo(cityId);
						}
					}
				}
				else { // error handling
					if (rslt.msg) { t.setTroopMessage('<span style="color:#f00">' + rslt.msg + '</span>'); }
					else { t.setTroopMessage('<span style="color:#f00">' + tx('Error setting defending troops') + '</span>'); }
				}
				jQuery('#btAddDefendButton').removeClass("disabled");
				jQuery('#btAddPresetButton').removeClass("disabled");
				jQuery('#btReplacePresetButton').removeClass("disabled");
			},
			onFailure: function () { // error handling
				t.setTroopMessage('<span style="color:#f00">Server connection failed.</span>');
				jQuery('#btAddDefendButton').removeClass("disabled");
				jQuery('#btAddPresetButton').removeClass("disabled");
				jQuery('#btReplacePresetButton').removeClass("disabled");
			}
		}, true); //no retry
	},

	SelectDefTroopType: function (sel) {
		var t = Dashboard;
		if ((sel.value == 0) || (sel.value == "")) {
			ById('btTotalDefTroops').innerHTML = "";
			ById('btMaxDefTroops').innerHTML = "";
			t.TotalSanctuaryTroops = 0;
			return false
		} else {
			t.TotalSanctuaryTroops = parseIntNan(Seed.units['city' + Seed.cities[Options.DashboardOptions.CurrentCity][0]]['unt' + sel.value]);
			ById('btTotalDefTroops').innerHTML = '&nbsp;/&nbsp;' + addCommas(t.TotalSanctuaryTroops);
			ById('btMaxDefTroops').innerHTML = '<a id="btMaxDefButton" onclick="btSetMaxDefTroops()"><span style="font-size:9px;" align="center">max</span></a>';
			// set default defender amount
			var elem = ById('btDefendAmount');
			if ((elem.value == 0) || (elem.value == "")) { elem.value = Options.DashboardOptions.DefaultDefenceNum; }
			if (parseInt(elem.value) > t.TotalSanctuaryTroops) {
				elem.value = t.TotalSanctuaryTroops;
			}
		}
	},

	SetMaxDefTroops: function () {
		var t = Dashboard;
		var elem = ById('btDefendAmount');
		elem.value = t.TotalSanctuaryTroops;
	},

	AddDefenders: function () {
		var t = Dashboard;
		var MoveArray = [];
		var TT = ById('btDefendTroops');
		var AM = ById('btDefendAmount');

		if (!TT.value || (TT.value == 0)) { t.setTroopMessage('<span style="color:#f00">' + tx('Please select troop type') + '</span>'); return; }
		if (!AM.value || (AM.value == 0)) { t.setTroopMessage('<span style="color:#f00">' + tx('Please enter a number of troops') + '</span>'); return; }
		if (AM.value > t.TotalSanctuaryTroops) { t.setTroopMessage('<span style="color:#f00">' + tx('You do not have enough troops') + '</span>'); return; }

		jQuery('#btAddDefendButton').addClass("disabled");

		MoveArray[TT.value] = AM.value;
		t.ChangeDefendingTroops(t.CurrentCityId, MoveArray, false);
	},

	NewDefPreset: function () {
		var t = Dashboard;
		if (t.ExpandDefPreset) return;
		ById('btDefendPreset').value = 0;
		/* Initialise Edit fields */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			ById('btPresetTroop' + i).value = "";
		}
		ById('btDefPresetName').value = tx('Defensive Preset #') + t.NextPresetNumber;

		t.ExpandDefPreset = true;
		jQuery('#btNewDefPreset').addClass("disabled");
		jQuery('#btChgDefPreset').addClass("disabled");
		jQuery('#btDelDefPreset').addClass("disabled");
		jQuery('#DefEditPresetRow').removeClass("divHide");
	},

	ChgDefPreset: function () {
		var t = Dashboard;
		if (t.ExpandDefPreset) return;

		var PN = ById('btDefendPreset');
		if (!PN.value || (PN.value == 0) || (PN.value.substr(0, 1) == 'T')) { return; }

		/* Load preset details into edit fields */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Options.DashboardOptions.DefPresets[PN.value][i]) { ById('btPresetTroop' + i).value = Options.DashboardOptions.DefPresets[PN.value][i]; }
			else { ById('btPresetTroop' + i).value = ""; }
		}
		ById('btDefPresetName').value = Options.DashboardOptions.DefPresets[PN.value][0];

		t.ExpandDefPreset = true;
		jQuery('#btNewDefPreset').addClass("disabled");
		jQuery('#btChgDefPreset').addClass("disabled");
		jQuery('#btDelDefPreset').removeClass("disabled");
		jQuery('#DefEditPresetRow').removeClass("divHide");
	},

	SetCurrentPreset: function () {
		var t = Dashboard;
		/* Initialise Edit fields to current values */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Seed.defunits["city" + t.CurrentCityId]['unt' + i] && (!isNaN(Seed.defunits["city" + t.CurrentCityId]['unt' + i])) && (parseIntNan(Seed.defunits["city" + t.CurrentCityId]['unt' + i]) != 0)) {
				ById('btPresetTroop' + i).value = Seed.defunits["city" + t.CurrentCityId]['unt' + i];
			}
			else {
				ById('btPresetTroop' + i).value = "";
			}
		}
	},

	SaveDefPreset: function () {
		var t = Dashboard;
		var PN = ById('btDefendPreset');
		if (PN.value.substr(0, 1) == 'T') return;
		if (!PN.value || (PN.value == 0)) { SavePN = t.NextPresetNumber; }
		else { SavePN = PN.value; }

		Options.DashboardOptions.DefPresets[SavePN] = {};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			TroopVal = ById('btPresetTroop' + i).value;
			if (!isNaN(TroopVal) && (TroopVal != "")) {
				Options.DashboardOptions.DefPresets[SavePN][i] = TroopVal;
			}
		}

		Options.DashboardOptions.DefPresets[SavePN][0] = ById('btDefPresetName').value;
		saveOptions();
		t.ExpandDefPreset = false;
		t.InitPresetNumber = SavePN;
		t.SetCurrentCity(Seed.cities[t.Curr][0], true);
	},

	CancelDefPreset: function () {
		var t = Dashboard;
		jQuery('#btNewDefPreset').removeClass("disabled");
		var PN = ById('btDefendPreset');
		if (PN.value && (PN.value != 0)) { jQuery('#btChgDefPreset').removeClass("disabled"); }
		jQuery('#DefEditPresetRow').addClass("divHide");
		t.ExpandDefPreset = false;
	},

	DelDefPreset: function () {
		var t = Dashboard;
		var PN = ById('btDefendPreset');
		if (!PN.value || (PN.value == 0) || (PN.value.substr(0, 1) == 'T')) return;

		Options.DashboardOptions.DefPresets[PN.value] = {};
		delete Options.DashboardOptions.DefPresets[PN.value];
		saveOptions();
		t.ExpandDefPreset = false;
		t.SetCurrentCity(Seed.cities[t.Curr][0], true);
	},

	SelectDefPreset: function (sel) {
		var t = Dashboard;
		t.CancelDefPreset();

		if ((sel.value == 0) || (sel.value == "") || (sel.value.substr(0, 1) == 'T')) {
			jQuery('#btChgDefPreset').addClass("disabled");
			return false
		} else {
			jQuery('#btChgDefPreset').removeClass("disabled");
		}
		t.InitPresetNumber = sel.value;
	},

	SetPresetDefenders: function (Replace) {
		var t = Dashboard;
		t.CancelDefPreset();
		var MoveArray = [];
		var PN = ById('btDefendPreset');
		if (!PN.value || (PN.value == 0)) { t.setTroopMessage('<span style="color:#f00">' + tx('Please select a defensive preset') + '</span>'); return; }

		jQuery('#btAddPresetButton').addClass("disabled");
		jQuery('#btReplacePresetButton').addClass("disabled");

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Options.DashboardOptions.DefPresets[PN.value][i]) {
				MoveArray[i] = Options.DashboardOptions.DefPresets[PN.value][i];
			}
		}
		t.ChangeDefendingTroops(t.CurrentCityId, MoveArray, Replace);
	},

	StoreDefendingTroops: function (CityId) {
		var t = Dashboard;
		t.StoreArray[cityId] = [];

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			t.StoreArray[cityId][i] = parseIntNan(Seed.defunits['city' + CityId]['unt' + i]);
		}
	},

	ResetDefendingTroops: function (CityId) {
		var t = Dashboard;
		t.ChangeDefendingTroops(CityId, t.StoreArray[cityId], true);
	},

	SendHome: function (marchId) {
		var t = Dashboard;
		t.setReinError('&nbsp;');
		jQuery('#btSendHome' + marchId).addClass("disabled");
		ResetHTMLRegister('DASH', 'btReinforceCell')
		var march = {};
		march = Seed.queue_atkinc['m' + marchId];
		if (!march) { return; }
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.mid = marchId;
		params.cid = march.toCityId;
		params.fromUid = march.fromPlayerId;
		params.fromCid = march.fromCityId;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/kickoutReinforcements.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var upkeep = 0;
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						upkeep += parseInt(march["unit" + i + "Return"]) * parseInt(uW.unitupkeeps[i])
					}
					uW.seed.resources["city" + march.toCityId].rec1[3] -= upkeep;
					if (parseInt(march.fromPlayerId) == parseInt(uW.tvuid)) {
						var mymarch = uW.seed.queue_atkp["city" + march.fromCityId]["m" + marchId];
						var marchtime = Math.abs(parseInt(mymarch.destinationUnixTime) - parseInt(mymarch.eventUnixTime));
						mymarch.returnUnixTime = unixTime() + marchtime;
						mymarch.marchStatus = 8;
					}
					delete uW.seed.queue_atkinc["m" + marchId];
				} else {
					t.setReinError(rslt.errorMsg);
				}
			},
			onFailure: function () { t.setReinError(tx('AJAX error')); },
		});
	},

	setReinError: function (msg) {
		var t = Dashboard;
		ById('btReinErr').innerHTML = msg;
	},

	QuickSacrifice: function (tt) {
		var t = Dashboard;
		var sel = ById('btRitualTroops');
		if (!sel) return;
		sel.value = tt;
		t.SelectTroopType(sel);
		t.StartRitual(true);
	},

	StartRitual: function (QS) {
		var t = Dashboard;
		t.setSacError('&nbsp;');
		var unitid = parseInt(ById('btRitualTroops').value);
		var numUnits = parseInt(ById('btRitualAmount').value);

		if (!unitid || (unitid == 0)) { t.setSacError(tx('Please select troop type')); return; }
		if (!numUnits || (numUnits == 0)) { t.setSacError(tx('Please enter a number of troops')); return; }
		if (numUnits > t.TotalTroops) { t.setSacError(tx('You do not have enough troops')); return; }

		jQuery('#btStartRitualButton').addClass("disabled");

		// see if we need to claw back units from defending units

		var clawback = uW.seed.units["city" + t.CurrentCityId]['unt' + unitid] - numUnits;
		if (clawback < 0) {
			var MoveArray = [];
			MoveArray[unitid] = clawback;
			t.ChangeDefendingTroops(t.CurrentCityId, MoveArray, false, function () { t.StartRitual(QS); });
			return;
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = t.CurrentCityId;
		params.type = unitid;
		params.quant = numUnits;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/sacrifice.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					uW.seed.queue_sacr["city" + t.CurrentCityId].push(uWCloneInto(rslt.queue_sacr));
					uW.seed.units["city" + t.CurrentCityId] = uWCloneInto(rslt.units);
					uW.seed.cityData.city[t.CurrentCityId].population = rslt.cityData_city.population;
					uW.seed.cityData.city[t.CurrentCityId].populationCap = rslt.cityData_city.populationCap;

					t.setSacError('&nbsp;');
					ById('btRitualTroops').value = 0;
					ById('btTotalTroops').innerHTML = "";
					ById('btMaxTroops').innerHTML = "";
					if (!QS) {
						ById('btRitualAmount').value = "";
						ById('btRitualMinutes').value = "";
						ById('btRitualSeconds').value = "";
					}
				} else {
					t.setSacError(rslt.feedback);
				}
				jQuery('#btStartRitualButton').removeClass("disabled");
			},
			onFailure: function () {
				t.setSacError(tx('AJAX error'));
				jQuery('#btStartRitualButton').removeClass("disabled");
			}
		});
	},

	setSacError: function (msg) {
		var t = Dashboard;
		ById('btSacErr').innerHTML = msg;
	},

	StopRitual: function (sacNo, notify) {
		var t = Dashboard;
		jQuery('#btStopRitual' + sacNo).addClass("disabled");
		ResetHTMLRegister('DASH', 'btSacrificeCell');
		var queue = uW.seed.queue_sacr["city" + t.CurrentCityId][sacNo];
		var params = uW.Object.clone(uW.g_ajaxparams);
		var cityId = t.CurrentCityId;
		params.cid = cityId;
		params.type = queue.unitType;
		params.quant = queue.quantity;
		params.start = queue.start;
		params.eta = queue.eta;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/cancelSacrificing.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					uW.seed.queue_sacr["city" + t.CurrentCityId].splice(sacNo, 1);
					if (t.CurrentCityId == cityId) { t.PaintCityInfo(cityId); }
				}
				jQuery('#btStopRitual' + sacNo).removeClass("disabled");
			},
			onFailure: function () {
				if (notify != null)
					notify(tx('AJAX error'));
				jQuery('#btStopRitual' + sacNo).removeClass("disabled");
			},
		});
	},

	SwitchGuardianResult: function (cityId, type, ok, summonFinishTime) {
		var t = Dashboard;
		// need to delay 8 seconds before allowing again
		if (ok) {
			t.GuardDelay = 8;
			t.PaintGuardianSelector();
		}
		else {
			t.GuardDelay = 0;
			t.PaintGuardianSelector();
			t.setGuardMessage('<span style="color:#f00">' + tx('Could not change Guardian') + '.</span>');
		}
	},

	SwitchGuardian: function (elem) {
		var t = Dashboard;

		var type = guardTypes[elem.id.substr(9) - 1];
		if (type == t.CurrGuardian) { return; }

		var level = Seed.guardian[Options.DashboardOptions.CurrentCity].cityGuardianLevels[type];
		level = level ? level : 0;
		if (level == 0) { return; }

		t.GuardDelay = 999;
		t.setGuardMessage(tx('Sending Request') + '...');

		SwitchGuardian(uW.currentcityid, type, t.SwitchGuardianResult);
	},

	SwitchThroneRoom: function (elem) {
		var t = Dashboard;
		var NewPreset = parseIntNan(elem.id.substr(6));
		if (NewPreset == Seed.throne.activeSlot) { return; }

		t.ThroneDelay = 999;
		t.setThroneMessage(tx('Sending Request') + '...');

		SwitchThroneRoom(NewPreset, true);
	},

	PaintTRPresets: function () {
		if (uW.isNewServer()) { return; }
		var t = Dashboard;
		var fontratio = Options.MonitorOptions.MonitorFontSize / 11;
		if (!(ById('btTRWidget')) && !(ById('btTRPresets')) && !(ById('btMonTRPresets')) && !(ById('trpresetopt1'))) { return; }
		if (t.ThroneDelay > 10) { return; }
		if ((ById('btTRPresets')) && !Options.DashboardOptions.TRPresetChange) { ById('btTRPresets').innerHTML = ""; }
		if ((ById('btMonTRPresets')) && !Options.MonitorOptions.MonPresetChange) { ById('btMonTRPresets').innerHTML = ""; }
		if ((ById('btTRWidget')) && !Options.TRWidget) { ById('btTRWidget').innerHTML = ""; }

		var m = '<div class="xtab" style="opacity:0.6; align="center" id=btThroneMsg>&nbsp;</div><TABLE cellspacing=0 cellpadding=0 style="padding-bottom: 10px;" align=center><TR>';
		var n = '<div class="xtab" style="opacity:0.6;font-size:' + Options.MonitorOptions.MonitorFontSize + 'px;" align="center" id=btMonThroneMsg>&nbsp;</div><TABLE cellspacing=0 cellpadding=0 style="padding-bottom: 10px;" align=center><TR>';
		var o = '<TABLE cellspacing=0 cellpadding=0 style="padding-bottom: 10px;" align=center><TR>';

		if (Options.DashboardOptions.TRPresetByName) { m += '<td class="xtabBR" align=center>'; }
		if (Options.MonitorOptions.TRMonPresetByName) { n += '<td class="xtabBR" align=center>'; }

		var numrows = Math.ceil(Seed.throne.slotNum / 16);
		var perrow = Math.ceil(Seed.throne.slotNum / numrows);
		var nummonrows = Math.ceil(Seed.throne.slotNum / 12);
		var permonrow = Math.ceil(Seed.throne.slotNum / nummonrows);

		if (Options.TRFixPresetWidth) {
			perrow = 8;
			permonrow = 8;
		}

		for (var i = 1; i <= Seed.throne.slotNum; i++) {
			if (Options.DashboardOptions.TRPresetByName) {
				m += '<div id="trpresetcell' + i + '" class="xtabBR trimg" style="display:inline-block"><a class="inlineButton btButton brown11" id="trlink' + i + '"><span style="width:85px;font-size:10px;" id="trpreset' + i + '"><center>' + (Options.DashboardOptions.TRPresets[i] ? Options.DashboardOptions.TRPresets[i].name : 'Preset ' + i) + '</center></span></a></div> ';
			}
			else {
				if ((i % perrow) == 1) {
					m += '</tr><TR>';
				}
				m += '<TD id="trpresetcell' + i + '" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;" id="trlink' + i + '"><div id="trpreset' + i + '" class="presetBut presetButNon"><center>' + i + '</center></div></a></td>';
			}
			if (Options.MonitorOptions.TRMonPresetByName) {
				n += '<div id="tmpresetcell' + i + '" class="xtabBR trimg" style="display:inline-block"><a class="inlineButton btButton brown11" id="tmlink' + i + '"><span style="width:' + Math.floor(85 * fontratio) + 'px;font-size:' + (Options.MonitorFontSize < 10 ? Options.MonitorFontSize : 10) + 'px;" id="tmpreset' + i + '"><center>' + (Options.DashboardOptions.TRPresets[i] ? Options.DashboardOptions.TRPresets[i].name : 'Preset ' + i) + '</center></span></a></div> ';
			}
			else {
				if ((i % permonrow) == 1) {
					n += '</tr><TR>';
				}
				n += '<TD id="tmpresetcell' + i + '" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;" id="tmlink' + i + '"><div id="tmpreset' + i + '" class="presetBut presetButNon"><center>' + i + '</center></div></a></td>';
			}
			if (((i % perrow) == 1 && !Options.ThroneHUD) || (Options.ThroneHUD && i == 25)) {
				o += '</tr><TR>';
			}
			o += '<TD id="trwidgetcell' + i + '" class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;" id="twlink' + i + '"><div id="trwidget' + i + '" class="presetBut presetButNon"><center>' + i + '</center></div></a></td>';
		}

		if (Options.TRFixPresetWidth) {
			while ((i % perrow) != 1) {
				if (!Options.DashboardOptions.TRPresetByName) {
					m += '<TD class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div class="presetBut presetButLck"></div></a></td>';
				}
				if (!Options.MonitorOptions.TRMonPresetByName) {
					n += '<TD class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div class="presetBut presetButLck"></div></a></td>';
				}
				o += '<TD class="xtab trimg" style="padding-right: 0px;"><a style="text-decoration:none;"><div class="presetBut presetButLck"></div></a></td>';
				i++;
			}
		}

		if (Options.DashboardOptions.TRPresetByName) { m += '</td>'; }
		if (Options.MonitorOptions.TRMonPresetByName) { n += '</td>'; }
		m += '</tr></table>';
		n += '</tr></table>';
		o += '</tr></table>';
		if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) { ById('btTRPresets').innerHTML = m; ResetFrameSize('btDash', 100, t.DashWidth); }
		if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) { ById('btMonTRPresets').innerHTML = n; ResetFrameSize('btMonitor', Tabs.Monitor.MonHeight, Tabs.Monitor.MonWidth); }
		if ((ById('btTRWidget')) && Options.TRWidget) { ById('btTRWidget').innerHTML = o; WideScreen.CheckChatPosition(); }

		if (t.ThroneDelay != 0) { t.setThroneMessage('<span style="color:#080">' + tx('Throne Room changed! Change again in') + ' ' + t.ThroneDelay + ' ' + tx('secs') + '...</span>'); }
		else { t.setThroneMessage('&nbsp;'); }

		CurrPreset = Seed.throne.activeSlot;
		for (var i = 1; i <= Seed.throne.slotNum; i++) {
			if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) {
				ById('trlink' + i).addEventListener('click', function () { t.SwitchThroneRoom(this); }, false);
				ById('trpreset' + i).addEventListener('mouseover', function () { t.BuildTRPresetStats(this.id.substring(8)); }, false);
			}
			if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) {
				ById('tmlink' + i).addEventListener('click', function () { t.SwitchThroneRoom(this); }, false);
				ById('tmpreset' + i).addEventListener('mouseover', function () { t.BuildTRPresetStats(this.id.substring(8)); }, false);
			}
			if ((ById('btTRWidget')) && Options.TRWidget) {
				ById('twlink' + i).addEventListener('click', function () { t.SwitchThroneRoom(this); }, false);
				ById('trwidget' + i).addEventListener('mouseover', function () { t.BuildTRPresetStats(this.id.substring(8)); }, false);
			}
			if (ById('trpresetopt1')) {
				ById('trpresetopt' + i).addEventListener('mouseover', function () { t.BuildTRPresetStats(this.id.substring(11)); }, false);
			}

			if (i == CurrPreset) {
				if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) {
					if (Options.DashboardOptions.TRPresetByName) { jQuery("#trlink" + i).removeClass("brown11").addClass("blue11"); }
					else { jQuery("#trpreset" + i).removeClass("presetButNon").addClass("presetButSel"); }
				}
				if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) {
					if (Options.MonitorOptions.TRMonPresetByName) { jQuery("#tmlink" + i).removeClass("brown11").addClass("blue11"); }
					else { jQuery("#tmpreset" + i).removeClass("presetButNon").addClass("presetButSel"); }
				}
				if ((ById('btTRWidget')) && Options.TRWidget) {
					jQuery("#trwidget" + i).removeClass("presetButNon").addClass("presetButSel");
				}
				t.BuildTRPresetStats(i);
			}
		}
	},

	BuildTRPresetStats: function (slot) {
		var t = Dashboard;
		var StatEffects = GenerateTRPresetStats(slot);
		var Tiers = GenerateTRPresetTiers(slot);
		var presetname = (Options.DashboardOptions.TRPresets[slot] ? Options.DashboardOptions.TRPresets[slot].name : 'Preset ' + slot);

		if (ById('trpresetopt' + slot)) { createToolTip(presetname, ById('trpresetopt' + slot), StatEffects.slice(), Tiers.slice()); }
		if ((ById('btTRPresets')) && Options.DashboardOptions.TRPresetChange) { createToolTip(presetname, ById('trpresetcell' + slot), StatEffects.slice(), Tiers.slice()); }
		if ((ById('btMonTRPresets')) && Options.MonitorOptions.MonPresetChange) { createToolTip(presetname, ById('tmpresetcell' + slot), StatEffects.slice(), Tiers.slice()); }
		if ((ById('btTRWidget')) && Options.TRWidget) { createToolTip(presetname, ById('trwidgetcell' + slot), StatEffects.slice(), Tiers.slice()); }
	},

	setThroneMessage: function (msg) {
		var t = Dashboard;
		if (ById('btThroneMsg') && Options.DashboardOptions.TRPresetChange) { ById('btThroneMsg').innerHTML = msg; }
		if (ById('btMonThroneMsg') && Options.MonitorOptions.MonPresetChange) { ById('btMonThroneMsg').innerHTML = msg; }
	},

	setGuardMessage: function (msg) {
		var t = Dashboard;
		if (popDash) { ById('btGuardMsg').innerHTML = msg; }
	},

	setChampMessage: function (msg) {
		var t = Dashboard;
		if (popDash && ById('btChampMsg')) { ById('btChampMsg').innerHTML = msg; }
	},

	CancelMarshall: function () {
		var t = Dashboard;
		t.ExpandMarshall = false;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	ChangeMarshall: function () {
		var t = Dashboard;
		t.ExpandMarshall = true;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	SetMarshall: function () {
		var t = Dashboard;
		jQuery('#btSetMarshall').addClass("disabled");
		var pos = '13';
		var kid = ById('btKnightList').value;
		if (kid == "") { kid = "0"; }
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pos = pos;
		params.kid = kid;
		params.cid = uW.currentcityid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/assignknight.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				jQuery('#btSetMarshall').removeClass("disabled");
				if (rslt.ok) {
					if (kid == 0) {
						uW.seed.leaders["city" + uW.currentcityid].combatKnightId = "0";
					} else {
						uW.seed.leaders["city" + uW.currentcityid].combatKnightId = kid.toString();
						t.ExpandMarshall = false;
						t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
					}
				}
			},
			onFailure: function () { jQuery('#btSetMarshall').removeClass("disabled"); }
		}, true); // noretry
	},

	BoostMarshall: function () {
		var t = Dashboard;
		jQuery('#btBoostMarshall').addClass("disabled");
		var item = 'i221';
		var kid = Seed.leaders["city" + uW.currentcityid].combatKnightId;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.iid = item.substring(1);
		params.cid = uW.currentcityid;
		params.kid = kid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/boostKnight.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				jQuery('#btBoostMarshall').removeClass("disabled");
				if (rslt.ok) {
					uW.seed.knights["city" + uW.currentcityid]["knt" + kid].combatBoostExpireUnixtime = rslt.expiration.toString();
					uW.seed.items[item] = parseInt(uW.seed.items[item]) - 1;
					uW.ksoItems[item.substring(1)].subtract();
					CM.MixPanelTracker.track("item_use", {
						item: uW.itemlist[item].name,
						usr_gen: Seed.player.g,
						usr_byr: Seed.player.y,
						usr_ttl: uW.titlenames[Seed.player.title],
						distinct_id: uW.tvuid
					})
					t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
				}
			},
			onFailure: function () { jQuery('#btBoostMarshall').removeClass("disabled"); }
		}, true); // noretry
	},

	CancelChampion: function () {
		var t = Dashboard;
		t.ExpandChampion = false;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	ChangeChampion: function () {
		var t = Dashboard;
		t.ExpandChampion = true;
		t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
	},

	FreeChampion: function (champId, ButtonClick) {
		var t = Dashboard;
		t.setChampMessage(tx('Sending Request') + '...');
		if (ButtonClick) jQuery('#btFreeChampion').addClass("disabled");
		t.AssignChampion(champId, 0);
	},

	SetChampion: function (champId, ButtonClick) {
		var t = Dashboard;
		t.setChampMessage(tx('Sending Request') + '...');
		if (ButtonClick) jQuery('#btSetChampion' + champId).addClass("disabled");
		t.AssignChampion(champId, uW.currentcityid);
	},

	AssignChampionResult: function (rslt) {
		var t = Dashboard;
		if (rslt.ok) { t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]); }
		else { t.setChampMessage(tx('Error Assigning Champion') + '!'); }
	},

	AssignChampion: function (champId, cityId) {
		var t = Dashboard;
		SwitchChampion(cityId, champId, t.AssignChampionResult);
	},

	PaintChampionSelector: function (cityId) {
		var t = Dashboard;
		if (!popDash) { return; }
		var Curr = Options.DashboardOptions.CurrentCity;
		var m = '<TABLE cellspacing=0 cellpadding=0><TR>';
		var allowclick = true;
		chkchamp = getCityChampion(cityId);
		if (chkchamp.championId && chkchamp.status == '10') {
			allowclick = false;
		}
		for (var y in Seed.champion.champions) {
			chkchamp = Seed.champion.champions[y];
			if (chkchamp.championId) {
				var outlineclass = 'champButNon';
				var opacity = '0.6';
				var onclick = 'onclick="btSetChampion(' + chkchamp.championId + ',false)"';
				if (chkchamp.assignedCity && chkchamp.assignedCity == cityId) {
					outlineclass = 'champButSel';
					opacity = '1.0';
					onclick = 'onclick="btFreeChampion(' + chkchamp.championId + ',false)"';
					if (chkchamp.status == '10') {
						outlineclass = 'champButMarch';
					}
				}
				if (chkchamp.status == '10' || !allowclick) {
					onclick = '';
				}
				m += '<TD id="ChampStatsBtn' + chkchamp.championId + 'td" class="xtab trimg"><a style="text-decoration:none;" id="champlink' + chkchamp.championId + '"><div id="champimg' + chkchamp.championId + '" class="champBut ' + outlineclass + '"><img class=btTop style="width:31px;height:33px;opacity:' + opacity + ';" id="ChampStatsBtn' + chkchamp.championId + '" ' + onclick + ' onMouseover="btCreateChampionPopUp(this,' + (chkchamp.assignedCity ? chkchamp.assignedCity : 0) + ',true,' + chkchamp.championId + ',false,true);" src="' + ChampImagePrefix + chkchamp.avatarId + ChampImageSuffix + '"></div></a></td>';
			}
		}
		m += '<td class="xtab" style="opacity:0.6; align="left" id=btChampMsg>&nbsp;</td></tr></table>';
		return m;
	},

	PaintGuardianSelector: function () {
		var t = Dashboard;
		if (!popDash) { return; }
		if (t.GuardDelay > 10) { return; }

		var Curr = Options.DashboardOptions.CurrentCity;

		var y_offset = { wood: " 47% ", ore: " 72.5% ", food: " 59.5% ", stone: " 85% " };
		var x_offset = { plate: 20, junior: 134, teenager: 248, adult: 362, adult2: 476, adult3: 590 };
		var x_by_level = { 0: x_offset.plate, 1: x_offset.junior, 2: x_offset.junior, 3: x_offset.junior, 4: x_offset.teenager, 5: x_offset.teenager, 6: x_offset.adult, 7: x_offset.adult, 8: x_offset.adult, 9: x_offset.adult, 10: x_offset.adult2, 11: x_offset.adult3, 12: x_offset.adult3, 13: x_offset.adult3, 14: x_offset.adult3, 15: x_offset.adult3 };

		var m = '<TABLE cellspacing=0 cellpadding=0><TR>';

		for (var i = 1; i <= 4; i++) {
			var level = Seed.guardian[Curr].cityGuardianLevels[guardTypes[i - 1]];
			level = level ? level : "";
			m += '<TD id="guardcell' + i + '" class="xtab tooldesc"><a style="text-decoration:none;" id="guardlink' + i + '"><div id="guardimg' + i + '" class="guardBut guardButNon trimg"><center>' + level + '</center></div></a><span class="tooltip" style="white-space: pre-line; word-wrap: break-word;">' + uW.g_js_strings.guardian["tooltipSummon_" + guardTypes[i - 1]] + '</span></td>';
		}
		m += '<td class="xtab" style="opacity:0.6; align="left" id=btGuardMsg>&nbsp;</td></tr></table>';
		ById('btGuardianSelector').innerHTML = m;

		if (t.GuardDelay != 0) { t.setGuardMessage('<span style="color:#080">' + tx('Guardian changed') + '!<br>' + tx('Change again in') + ' ' + t.GuardDelay + ' ' + tx('secs') + '...</span>'); }
		else { t.setGuardMessage('&nbsp;'); }

		t.CurrGuardian = Seed.guardian[Curr].type;
		for (var i = 1; i <= 4; i++) {
			/* show correct portion of image */
			var level = Seed.guardian[Curr].cityGuardianLevels[guardTypes[i - 1]];
			level = level ? level : 0;
			var bg_offset = x_by_level[level] / 776 * 100 + "% " + y_offset[guardTypes[i - 1]];
			jQuery("#guardimg" + i).css('background-position', bg_offset);

			if (popDash) {
				ById('guardlink' + i).addEventListener('click', function () { t.SwitchGuardian(this); }, false);
			}
			if ((guardTypes[i - 1] == (t.CurrGuardian)) && (Seed.guardian[Curr]['level'] != 0)) {
				jQuery("#guardimg" + i).removeClass("guardButNon").addClass("guardButSel");
			}
		}
	},

	Recall: function (marchId, cityview) {
		var t = Dashboard;
		t.setOutError('&nbsp;', cityview);

		var ajaxtype = 'undefend';
		var params = uW.Object.clone(uW.g_ajaxparams);
		for (var k in out) {
			if (out[k].marchId == marchId) {
				params.cid = out[k].marchCityId;
				if (out[k].marchStatus != 2) {
					ajaxtype = 'cancelMarch';
				}
				break;
			}
		}
		params.mid = marchId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/" + ajaxtype + ".php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var march = uW.seed.queue_atkp["city" + params.cid]["m" + params.mid];
					var marchtime = parseInt(march.returnUnixTime) - parseInt(march.destinationUnixTime);
					var ut = uW.unixtime();
					if (Seed.playerEffects.returnExpire > ut) { marchtime *= 0.5 }
					march.destinationUnixTime = rslt.destinationUnixTime || ut;
					march.returnUnixTime = Math.floor(rslt.returnUnixTime || ut + marchtime * rslt.returnMultiplier);
					march.marchStatus = 8;
					if (ajaxtype == 'cancelMarch') {
						for (var j in CM.UNIT_TYPES) {
							j = CM.UNIT_TYPES[j];
							Seed.queue_atkp["city" + params.cid]["m" + params.mid]["unit" + j + "Return"] = parseInt(Seed.queue_atkp["city" + params.cid]["m" + params.mid]["unit" + j + "Count"])
						}
					}
					t.setOutError('March Recalled', cityview);
				}
				else {
					if (rslt.error_code == 253)
						t.setOutError(uW.g_js_strings.recall.error, cityview);
					else
						t.setOutError(tx('Unable to recall march'), cityview);
				}
			},
			onFailure: function () { t.setOutError(tx('Unable to recall march'), cityview); },
		});
	},

	setOutError: function (msg, cityview) {
		var t = Dashboard;
		var elem = ById('btOutErr');
		if (cityview)
			elem = ById('btCityOutErr');
		if (elem)
			elem.innerHTML = msg;
	},

	ShowHideSection: function (div, tf) {
		var t = Dashboard;
		var dh = ById(div + 'Header');
		if (dh) {
			if (tf && jQuery('#' + div + 'Header').hasClass('divHide')) { jQuery('#' + div + 'Header').removeClass('divHide'); t.ResizeFrame = true; }
			if (!tf && !jQuery('#' + div + 'Header').hasClass('divHide')) { jQuery('#' + div + 'Header').addClass('divHide'); t.ResizeFrame = true; }
		}
	},

	ShowHideRow: function (div, tf) {
		var t = Dashboard;
		var dh = ById(div);
		if (dh) {
			if (tf && jQuery('#' + div).hasClass('divHide')) { jQuery('#' + div).removeClass('divHide'); t.ResizeFrame = true; }
			if (!tf && !jQuery('#' + div).hasClass('divHide')) { jQuery('#' + div).addClass('divHide'); t.ResizeFrame = true; }
		}
	},

	ForceUpdateSeed: function () {
		var t = Dashboard;
		if (uW.g_update_seed_ajax_do && (t.ForceTries < 10)) { // refresh seed is occurring? But we need to make sure this runs, so delay for 1 second and try up to 10 times ...
			t.ForceTries = t.ForceTries + 1;
			logit('force update seed - waiting for server to be ready (' + t.ForceTries + ')');
			setTimeout(function () { t.ForceUpdateSeed(); }, 1000);
		}
		logit('force update seed - request sent to server');

		var retfunc = function () {
			var t = Dashboard;
			logit('force update seed - response received from server');
			t.PaintCityInfo(Seed.cities[Options.DashboardOptions.CurrentCity][0]);
			if (Options.DashboardOptions.ReplaceDefendingTroops[Cities.byID[t.AttackedCity].idx]) { t.ResetDefendingTroops(t.AttackedCity); }
		}
		uWExportFunction('btretfunc', retfunc);

		uW.g_update_seed_ajax_force = true;
		setTimeout(function () { uW.update_seed_ajax(true, uW.btretfunc, false); }, 250);
	},

	ToggleAutoRefresh: function () {
		var t = Dashboard;
		Options.DashboardOptions.RefreshSeed = !Options.DashboardOptions.RefreshSeed;
		if (Options.DashboardOptions.RefreshSeed) {
			jQuery('#btRefreshSeed').addClass("disabled");
			jQuery('#btAutoRefresh').addClass("red14");
			jQuery('#btAutoRefresh').removeClass("blue14");
			ById('btAutoRefresh').innerHTML = '<span style="width:30px;display:inline-block;text-align:center;">' + tx('Off') + '</span>';
		}
		else {
			jQuery('#btRefreshSeed').removeClass("disabled");
			jQuery('#btAutoRefresh').removeClass("red14");
			jQuery('#btAutoRefresh').addClass("blue14");
			ById('btAutoRefresh').innerHTML = '<span style="width:30px;display:inline-block;text-align:center;">' + tx('Auto') + '</span>';
		}
		saveOptions();
	},

	UpdatePresetLabel: function (elem, entry) {
		var t = Dashboard;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		if (!Options.DashboardOptions.TRPresets[entry]) { Options.DashboardOptions.TRPresets[entry] = {}; }
		if (elem.value == "") { elem.value = tx('Preset') + ' ' + entry; }

		Options.DashboardOptions.TRPresets[entry].name = elem.value;
		saveOptions();
		t.PaintTRPresets();
	},

	CheckDefaultRitual: function (sel) {
		sel.value = parseInt(sel.value);
		if (isNaN(sel.value)) sel.value = 0;

		var min, sec;

		if (sel.id == 'btDefaultRitualMinutes') {
			min = parseIntNan(sel.value);

			if (isNaN(ById('btDefaultRitualSeconds').value)) sec = 0;
			else sec = parseIntNan(ById('btDefaultRitualSeconds').value);
		}

		if (sel.id == 'btDefaultRitualSeconds') {
			sec = parseIntNan(sel.value);

			if (isNaN(ById('btDefaultRitualMinutes').value)) min = 0;
			else min = parseIntNan(ById('btDefaultRitualMinutes').value);

			min += (parseIntNan(sec / 60));
			sec = sec % 60;
		}
		ById('btDefaultRitualMinutes').value = BlankifZero(min);
		ById('btDefaultRitualSeconds').value = BlankifZero(sec);
		Options.DashboardOptions.DefaultSacrificeMin = BlankifZero(min);
		Options.DashboardOptions.DefaultSacrificeSec = BlankifZero(sec);
		saveOptions();
	},
}
