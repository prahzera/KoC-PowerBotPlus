/** Build Tab **/

Tabs.Build = {
	tabLabel: 'Build',
	tabOrder: 2060,
	tabColor: 'brown',
	tabDisabled: false,
	myDiv: null,
	timer: null,
	ModelCity: null,
	ModelCityId: 0,
	LoopCounter: 0,
	intervalSecs: 5,
	autodelay: 0,
	citydelay: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
	loopaction: false,
	limitingFactor: null,
	buildspeed: 0,
	cityval: 0,
	Subscriber: false,
	BuildMode: false,
	BuildDiv: null,
	BuildList: {},
	koc_buildslot: null,
	Squire: 0,
	Knight: 0,
	Guinevere: 0,
	Morgana: 0,
	Arthur: 0,
	Merlin: 0,
	Divine: 0,
	Epic: 0,
	Legendary: 0,
	ItemList: [1, 2, 3, 4, 5, 6, 7, 8, 10],
	ItemTrans: ["SH", "KH", "GH", "MH", "AH", "RH", "DH", "EH", "LH"],
	SmartOrder: [12, 7, 8, 14, 16, 20, 19, 0, 9, 15, 17, 18, 21, 11, 6, 10, 23, 25, 27], // experiment!
	PresetTypes: { 0: "Unascended City", 1: "Druid City", 2: "Fey City", 3: "Briton City" },
	CityBuildings: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21],
	FieldBuildings: [1, 2, 3, 4],
	DruidCityBuildings: [5, 7, 8, 10, 11, 12, 13, 14, 20],
	FeyCityBuildings: [5, 7, 8, 10, 11, 12, 13, 14, 20, 21],
	BritonCityBuildings: [5, 7, 8, 10, 11, 12, 13, 14, 20, 21],
	DruidFieldBuildings: [22, 23],
	FeyFieldBuildings: [24, 25],
	BritonFieldBuildings: [26, 27],
	NextPresetNumber: 0,
	InitPresetNumber: 0,
	PresetNum: 0,
	PresetType: "",
	PresetName: "",
	Preset: {},
	FieldView: false,
	Options: {
		Running: false,
		ThroneCheck: false,
		BuildSpeed: 0,
		Enabled: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
		Toggle: false,
		maxbuildlevel: 9,
		help: false,
		bothqueues: false,
		EmptySlots: 5,
		BuildPriority: 1, // 0 - none, 1 - shortest time, 2 - position, 3 - building type, 4 - unique buildings
		KeepCompleted: false,
		UseLH: false,
		UseEH: false,
		UseDH: false,
		UseRH: false,
		UseAH: false,
		UseMH: false,
		UseGH: false,
		UseKH: false,
		UseSH: false,
		UseOverride: false,
		OverrideItem: 0,
		OverrideHours: 0,
		OverrideMinutes: 1,
		BuildPresetNames: {},
		BuildPresetTypes: {},
		BuildPresets: {},
		AscendRunning: false,
		AscendEnabled: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		AscendTime: 1,
		AscendFaction: 1, // 1 - druid, 2 - fey, 3 - briton
		AscendBlessings: { 1: [0, 0, 0, 0, 0, 0], 2: [0, 0, 0, 0, 0, 0], 3: [0, 0, 0, 0, 0, 0] }, // up to 6 minor blessings will be allowed eventually...
		AscendPresets: { 1: 0, 2: 0, 3: 0 }, // which preset to queue after ascension
		AscendPresetLevel: 9, // building level to queue after ascension
		AscensionReady: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		UseLesserCrystals: false,
		UseGreaterCrystals: false,
	},
	BuildQueue: {}, // cityId:{ pos0:{buildtype,maxlevel,status,ascendcomplete,errors}, },

	init: function (div) {
		var t = Tabs.Build;
		t.myDiv = div;

		if (!Options.BuildOptions) {
			Options.BuildOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.BuildOptions.hasOwnProperty(y)) {
					Options.BuildOptions[y] = t.Options[y];
				}
			}
		}

		// fix any broken build presets

		for (var y in Options.BuildOptions.BuildPresets) {
			if (!Options.BuildOptions.BuildPresets[y].pos0) { Options.BuildOptions.BuildPresets[y].pos0 = 'bdg0'; }
			if (!Options.BuildOptions.BuildPresets[y].pos1) { Options.BuildOptions.BuildPresets[y].pos1 = 'bdg19'; }
		}

		for (var b in uW.buildingcost) {
			var bid = Number(b.split('bdg')[1]);
			if (bid < 30) {
				t.BuildList[bid] = uW.buildingcost[b][0];
			}
		}

		for (var c = 1; c <= 8; c++) {
			if (!Cities.cities[c - 1]) {
				Options.BuildOptions.AscendEnabled[c] = false;
			}
			else {
				var ascended = getAscensionValues(Cities.cities[c - 1].id);
				if (ascended.isPrestigeCity) {
					var MaxLevel = CM.PrestigeModel.getLevelCapSoft(ascended.prestigeType);
					if (parseIntNan(ascended.prestigeLevel) == MaxLevel) {
						Options.BuildOptions.AscendEnabled[c] = false;
					}
				}
			}
		}

		t.ReadBuildQueue();

		t.koc_buildslot = uW.buildslot; //save original koc function
		t.CreateBuildModeDiv();

		t.Subscriber = CM.QueueModel.hasFreeQueue();

		if (Options.BuildOptions.Toggle) AddSubTabLink('AutoBuild', t.toggleAutoBuildState, 'BuildToggleTab');
		SetToggleButtonState('Build', Options.BuildOptions.Running, 'Build');

		uWExportFunction('speedupBuild', Tabs.Build.speedupBuild);
		uWExportFunction('btcancelConstruction', Tabs.Build.cancelConstruction);
		uWExportFunction('cancelBuild', Tabs.Build.cancelBuild);
		uWExportFunction('btBldCancelAll', Tabs.Build.cancelAll);
		uWExportFunction('btNewBldPreset', Tabs.Build.NewBldPreset);
		uWExportFunction('btSelectBldPreset', Tabs.Build.SelectBldPreset);
		uWExportFunction('btSetBldPreset', Tabs.Build.SetBldPreset);

		var m = '<DIV class=divHeader align=center>' + tx('AUTOMATIC BUILD FUNCTION') + '</div>';
		m += '<div align="center">';

		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btBuildToggle type=checkbox />&nbsp;' + tx("Add toggle button") + '</td><td colspan=2 align=center><INPUT id=btAutoBuildState type=submit value="' + tx("AutoBuild") + ' = ' + (Options.BuildOptions.Running ? 'ON' : 'OFF') + '">&nbsp;<INPUT id=btAutoAscendState type=submit value="' + tx("AutoAscend") + ' = ' + (Options.BuildOptions.AscendRunning ? 'ON' : 'OFF') + '"></td></td><td width=30% align=right>' + tx('Current Construction Speed') + ':&nbsp;<span id=btBuildCurrTR></span>&nbsp;&nbsp;</td></tr></table>';
		m += '<table width=100% class=xtab><tr><td colspan=2 align=left><INPUT id=btBuildTR type=checkbox >&nbsp;' + tx('Only build when construction speed is at least') + ' <INPUT id=btBuildTRSpeed type=text size=3 maxlength=4 >&nbsp;%</td>';
		m += '<td colspan=2 align=right>' + tx('Current Increased City Value') + ':&nbsp;<span id=btCityValCurrTR></span>&nbsp;&nbsp;</td></tr>';
		m += '<tr><TD colspan=2 align=left><INPUT id=pbKeepCompleted type=checkbox \>&nbsp;' + tx("Keep completed buildings in queues of ascended cities") + '</td><td colspan=2 align=right>' + tx("Maximum Build Level") + ':&nbsp;' + htmlSelector({ 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15 }, Options.BuildOptions.maxbuildlevel, 'id=pbMaxBuildLevel') + '</TD></tr>';
		m += '<tr><TD colspan=2 align=left><INPUT id=pbHelpRequest type=checkbox \>&nbsp;' + tx("Ask for help") + '</td><TD colspan=2 align=right>' + tx("Build Priority") + ':&nbsp;' + htmlSelector({ 0: tx('None'), 1: tx('Shortest time'), 2: tx('Position'), 3: tx('Building Type'), 4: tx('Unique Buildings') }, Options.BuildOptions.BuildPriority, 'id=pbBuildPriority') + '</td></tr>';
		m += '<tr><TD colspan=2 align=left class=' + (!t.Subscriber ? 'divHide' : '') + '>&nbsp;</td><TD colspan=2 align=right class=' + (!t.Subscriber ? 'divHide' : '') + '><INPUT id=pbbothqueues type=checkbox \>' + tx("Use both build queues") + '</td></tr>';
		m += '</table>';

		m += '<br><DIV id=btBuildOverviewDiv style="width:' + GlobalOptions.btWinSize.x + 'px;overflow-x:auto;">';

		m += '<TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:' + Options.OverviewOptions.OverviewFontSize + 'px;"><TR valign=bottom><td width=20>&nbsp;</td><td width=100>&nbsp;</td>';

		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><span id="btBuildCity_' + i + '"><B>' + Cities.cities[i - 1].name.substring(0, 12) + '</b></span></td>';
		}
		m += "<td>&nbsp;</td>"; // spacer
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>' + tx('Auto-Build') + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btBuildAutoCity_' + i + '" type=checkbox ' + (Options.BuildOptions.Enabled[i] ? 'CHECKED' : '') + '></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right><b>' + uW.g_js_strings.commonstr.faction + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><span id="btBuildFactionCity_' + i + '">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>' + tx('Ascension') + '%&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><span id="btBuildAscensionPercentCity_' + i + '">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right><b>' + tx('Protection') + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><span id="btBuildAscensionProtectionCity_' + i + '">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>' + tx('Auto-Ascend') + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btBuildAutoAscendCity_' + i + '" type=checkbox ' + (Options.BuildOptions.AscendEnabled[i] ? 'CHECKED' : '') + '></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right><b>' + tx('Queue Length') + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><span id="btBuildQueueLengthCity_' + i + '">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>' + tx('Queue Time') + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><span id="btBuildQueueTimeCity_' + i + '">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right style="padding-top:2px;vertical-align:top;padding-left:0px;"><b>' + tx('Activity') + '&nbsp;</b></td>';
		var actheight = 90;
		if (t.Subscriber) { actheight = 180; }
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder style="height:' + actheight + 'px;"><span id="btBuildActiveCity_' + i + '">&nbsp;</span></div></td>';
		}

		m += '</tr></table></div></div>';

		m += '<div class="divHeader" align="center">' + tx('USE AUTO-SPEEDUPS') + '</div>';

		m += '<table width=100% class=xtab><tr><td><div align=center>';

		var Boosts = '<table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td width=30 rowspan=2><img height=28 src="' + IMGURL + 'items/70/' + t.ItemList[i] + '.jpg" title="' + itemTitle(t.ItemList[i], true) + '\n' + tx(HourGlassHint[i]) + '" /></td><td>(<span id=pbbuildUse' + t.ItemTrans[i] + 'Label>' + parseIntNan(uW.ksoItems[t.ItemList[i]].count) + '</span>)</td>';
		}
		Boosts += '<td width=70 rowspan=2 align=right><INPUT id=pbBuildHelp type=submit value="' + tx('HELP') + '!"></td>';
		Boosts += '</tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td><input type=checkbox id="pbbuild' + t.ItemTrans[i] + '" ' + (Options.BuildOptions["Use" + t.ItemTrans[i]] ? "CHECKED" : "") + '></td>';
		}
		Boosts += '</tr></table></td></tr>';
		Boosts += '<tr><td><div align=center><table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td><input type=checkbox id=pbbuildOV >' + tx('Override above by always using') + ' ' + htmlSelector(HourGlassName, Options.BuildOptions.OverrideItem, 'id=pbbuildOVItem') + ' ' + tx('when more than') + ' ';
		Boosts += '<INPUT style="width: 30px;text-align:right;" id="pbbuildOVHours" type=text maxlength=4 >&nbsp;' + uW.g_js_strings.timestr.timehr + '&nbsp;<INPUT style="width: 30px;text-align:right;" id="pbbuildOVMinutes" type=text maxlength=4 >&nbsp;' + uW.g_js_strings.timestr.timemin + ' ' + tx('remaining') + '.</td></tr></table></div></td></tr>';

		m += Boosts + '</table></div>';

		m += '<a id=btBldAscendLink class=divLink><div class="divHeader" align="left"><table cellpadding=0 cellspacing=0 width=100%><tr><td class=xtab><img id=btBldAscendArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('AUTO-ASCEND OPTIONS') + '</td><td class=xtab align=right>&nbsp;</td></tr></table></div></a>';
		m += '<div id=btBldAscend style="max-height:440px;overflow-y:scroll;" class=divHide>&nbsp;</div><hr>';

		m += '<br><DIV style="text-align:center; margin-bottom:5px;">' + uW.g_js_strings.commonstr.city + ':&nbsp;<span id=pbbuildcity></span></div>';

		m += '<div class="divHeader" align="center">' + tx('ADD BUILDINGS') + '</div><br>';
		m += '<div><table cellpadding=0 cellspacing=0 class=xtab width=100%><tr><td><INPUT id=pbBuildMode class=btInput type=submit value="' + tx("Build Mode = OFF") + '"></td>';
		m += '<td>' + tx('Empty Slots') + ':&nbsp;' + htmlSelector(t.BuildList, Options.BuildOptions.EmptySlots, 'id=pbbuildempty') + '</td>';
		m += '<td align=right>' + tx('Queue ALL') + ':&nbsp;' + htmlSelector({ all: uW.g_js_strings.commonstr.buildings, barracks: uW.buildingcost.bdg13[0], cottages: uW.buildingcost.bdg5[0], farms: uW.buildingcost.bdg1[0], sawmills: uW.buildingcost.bdg2[0], quarries: uW.buildingcost.bdg3[0], mines: uW.buildingcost.bdg4[0], guardians: uW.g_js_strings.guardian.guardians, deftower: uW.g_js_strings.tower.towerName, redoubt: uW.g_js_strings.redoubt.redoubt, empty: tx("Empty Slots") }, 'all', 'id=pbquickadd') + '&nbsp;' + tx('to level') + '&nbsp;<select id=pbaddAllTo></select>&nbsp;<INPUT class=btInput id=doXbuildingToX type=submit value="' + tx('Add to Queue') + '">&nbsp;</td>';
		m += '</tr></table></div><br>';

		m += '<a id=btBldPresetLink class=divLink><div class="divHeader" align="left"><img id=btBldPresetArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('LAYOUT DESIGNER') + '</div></a>';
		m += '<div id=btBldPreset style="height:400px; max-height:400px; overflow-y:auto;" class=divHide>';
		m += '<br><TABLE align=center cellSpacing=0 width=98% height=0%><tr><td width=25% class=xtab style="height:20px;">';
		m += '<SELECT class="btSelector" style="width:190px;" id="btBuildPreset" onchange="btSelectBldPreset(this);">';
		m += '</select>&nbsp;<a id="btNewBldPreset" class="inlineButton btButton brown8" onclick="btNewBldPreset()"><span>' + tx('New') + '</span></a></td><td width=50% class=xtab align=center><span id=btBldPresetMessages>&nbsp;</span></td>';
		m += '<td width=25% align=right class=xtab style="padding-right:0px;"><a id="btAddBldPresetButton" class="inlineButton btButton blue14" onclick="btSetBldPreset()"><span style="width:85px;display:inline-block;text-align:center;" align="center">' + tx('Add to Queue') + '</span></a>&nbsp;' + tx('to level') + '&nbsp;<select id=btBldPresetAllTo></td></tr>';
		m += '<tr><td colspan=3 class=xtab><hr></td></tr></table><div id=btBldPresetDetails>&nbsp;</div>';
		m += '</div>';

		m += '<a id=btBldQueueLink class=divLink><div class="divHeader" align="left"><table cellpadding=0 cellspacing=0 width=100%><tr><td class=xtab><img id=btBldQueueArrow height="10" src="' + DownArrow + '">&nbsp;' + tx('BUILDING QUEUE') + '</td><td class=xtab align=right id=btBldQueueStats>&nbsp;</td></tr></table></div></a>';
		m += '<div id=btBldQueue style="max-height:200px;overflow-y:scroll;">&nbsp;</div>';

		m += '</div><br>';

		div.innerHTML = m;
		t.PaintAscendOptions();
		t.clearBuildPresetDiv();
		t.LoadBuildPresets();
		t.MaxLevelChanged();
		OpenDiv["Building"] = "btBldQueue";

		t.ModelCity = new CdispCityPicker('pbbuild', ById('pbbuildcity'), true, t.clickCitySelect, null);

		ById('btBldAscendLink').addEventListener('click', function () { ToggleMainDivDisplay("Building", 100, GlobalOptions.btWinSize.x, "btBldAscend", true) }, false);
		ById('btBldQueueLink').addEventListener('click', function () { ToggleMainDivDisplay("Building", 100, GlobalOptions.btWinSize.x, "btBldQueue", true) }, false);
		ById('btBldPresetLink').addEventListener('click', function () { ToggleMainDivDisplay("Building", 100, GlobalOptions.btWinSize.x, "btBldPreset", true) }, false);

		for (var i = 1; i <= Cities.numCities; i++) {
			ById('btBuildAutoCity_' + i).addEventListener('click', function (e) {
				var citynum = e.target['className'];
				Options.BuildOptions.Enabled[citynum] = e.target.checked;
				if (Options.BuildOptions.Enabled[citynum]) {
					t.citydelay[citynum] = 0;
					t.timer = setTimeout(function () { t.doAutoLoop(Number(citynum)); }, 0);
				}
				saveOptions();
			}, false);
			ById('btBuildAutoAscendCity_' + i).addEventListener('click', function (e) {
				var citynum = e.target['className'];
				Options.BuildOptions.AscendEnabled[citynum] = e.target.checked;
				saveOptions();
			}, false);
		}

		ToggleOption('BuildOptions', 'btBuildToggle', 'Toggle');

		ById('pbBuildMode').addEventListener('click', function () {
			t.toggleStateMode();
		}, false);

		ById('btAutoBuildState').addEventListener('click', function () {
			t.toggleAutoBuildState(this);
		}, false);

		ById('btAutoAscendState').addEventListener('click', function () {
			t.toggleAutoAscendState(this);
		}, false);

		ToggleOption('BuildOptions', 'btBuildTR', 'ThroneCheck');
		ChangeIntegerOption('BuildOptions', 'btBuildTRSpeed', 'BuildSpeed');
		ChangeIntegerOption('BuildOptions', 'pbMaxBuildLevel', 'maxbuildlevel', 0, t.MaxLevelChanged);

		ById('doXbuildingToX').addEventListener('click', function () {
			var cityId = t.ModelCityId;
			if (!cityId) return;
			var AddType = ById('pbquickadd').value;
			var toLevel = parseIntNan(ById('pbaddAllTo').value.substr(5));
			t.allBuildsTo(cityId, AddType, toLevel);
		}, false);

		ToggleOption('BuildOptions', 'pbHelpRequest', 'help');
		ToggleOption('BuildOptions', 'pbKeepCompleted', 'KeepCompleted', t.ValidateBuildQueue);
		ToggleOption('BuildOptions', 'pbbothqueues', 'bothqueues');
		ChangeOption('BuildOptions', 'pbbuildempty', 'EmptySlots');
		ChangeOption('BuildOptions', 'pbBuildPriority', 'BuildPriority', t.PaintCityInfo);

		ToggleOption('BuildOptions', 'pbbuildSH', 'UseSH');
		ToggleOption('BuildOptions', 'pbbuildKH', 'UseKH');
		ToggleOption('BuildOptions', 'pbbuildGH', 'UseGH');
		ToggleOption('BuildOptions', 'pbbuildMH', 'UseMH');
		ToggleOption('BuildOptions', 'pbbuildAH', 'UseAH');
		ToggleOption('BuildOptions', 'pbbuildRH', 'UseRH');
		ToggleOption('BuildOptions', 'pbbuildDH', 'UseDH');
		ToggleOption('BuildOptions', 'pbbuildEH', 'UseEH');
		ToggleOption('BuildOptions', 'pbbuildLH', 'UseLH');
		ToggleOption('BuildOptions', 'pbbuildOV', 'UseOverride');
		ChangeIntegerOption('BuildOptions', 'pbbuildOVItem', 'OverrideItem');
		ChangeIntegerOption('BuildOptions', 'pbbuildOVHours', 'OverrideHours');
		ChangeIntegerOption('BuildOptions', 'pbbuildOVMinutes', 'OverrideMinutes');

		ById('pbBuildHelp').addEventListener('click', t.helpPop, false);

		// start autobuild loop timer to start in 6 seconds...

		if (Options.BuildOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, (6 * 1000));
		}

		// check auto ascend to clear the ascension ready flags if they are set incorrectly!

		t.checkAutoAscend();
	},

	helpPop: function () {
		var t = Tabs.Build;
		var helpText = '<br>' + tx("Using Speedups for Construction");
		helpText += '<p>' + tx('Speedups will be used in the following order if they are selected, and the required criteria is met') + ' :-</p>';
		helpText += '<TABLE class=xtab><TR><TD><b>' + uW.g_js_strings.commonstr.item + '</b></td><TD><b>' + uW.g_js_strings.commonstr.time + '</b></td><TD><b>' + tx('Criteria') + '</b></td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i10.name + '</td><TD>4 days</td><TD>' + tx('More than 3 days and 12 hours remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i8.name + '</td><TD>2.5 days</td><TD>' + tx('More than 48 hours remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i7.name + '</td><TD>24 hrs</td><TD>' + tx('More than 23 hours 30 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i6.name + '</td><TD>15 hrs</td><TD>' + tx('More than 14 hours 30 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i5.name + '</td><TD>8 hrs</td><TD>' + tx('More than 7 hours 30 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i4.name + '</td><TD>2.5 hrs</td><TD>' + tx('More than 2 hours remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i3.name + '</td><TD>1 hr</td><TD>' + tx('More than 45 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i2.name + '</td><TD>15 mins</td><TD>' + tx('More than 5 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i1.name + '</td><TD>1 min</td><TD>' + tx('More than 30 seconds remaining') + '</td></tr>';
		helpText += '</table>';
		helpText += '<p>' + tx('If the override box is ticked, then the override rule specified will take priority') + '.</p><br>';

		var pop = new CPopup('BotHelp', 0, 0, 460, 360, true);
		pop.centerMe(mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>' + tx("PowerBot+ Help") + ': ' + tx("Speedups") + '</b></center>';
		pop.show(true);
	},

	clearBuildPresetDiv: function () {
		var t = Tabs.Build;
		ById('btBldPresetDetails').innerHTML = '<br><br><br><br><br><br><br><br><br><center>' + tx('Please select an existing layout or create a new one above...') + '</center>';
	},


	toggleAutoBuildState: function (obj) {
		var t = Tabs.Build;
		obj = ById('btAutoBuildState');
		if (Options.BuildOptions.Running == true) {
			Options.BuildOptions.Running = false;
			obj.value = tx("AutoBuild = OFF");
		}
		else {
			Options.BuildOptions.Running = true;
			obj.value = tx("AutoBuild = ON");
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, 0);
		}
		saveOptions();
		SetToggleButtonState('Build', Options.BuildOptions.Running, 'Build');
		t.citydelay = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
		t.PaintOverview();
	},

	toggleAutoAscendState: function (obj) {
		var t = Tabs.Build;
		if (Options.BuildOptions.AscendRunning == true) {
			Options.BuildOptions.AscendRunning = false;
			obj.value = tx("AutoAscend = OFF");
		}
		else {
			Options.BuildOptions.AscendRunning = true;
			obj.value = tx("AutoAscend = ON");
		}
		saveOptions();
		t.checkAutoAscend();
		t.PaintOverview();
	},

	MaxLevelChanged: function () {
		var t = Tabs.Build;
		var m = '';
		for (a = 1; a <= Options.BuildOptions.maxbuildlevel; a++) {
			var sel = ''; if (a == Options.BuildOptions.maxbuildlevel) sel = ' selected';
			m += '<OPTION value=toLvl' + a + sel + '>' + a + '</option>';
		}
		ById('pbaddAllTo').innerHTML = m;
		ById('btBldPresetAllTo').innerHTML = m;
		ById('pbbuildmodeto').innerHTML = m;
		t.ResetAscendAllTo();
	},

	ResetAscendAllTo: function () {
		var t = Tabs.Build;
		var m = '';
		if (Options.BuildOptions.AscendPresetLevel > Options.BuildOptions.maxbuildlevel) {
			Options.BuildOptions.AscendPresetLevel = Options.BuildOptions.maxbuildlevel;
			saveOptions();
		}
		for (a = 1; a <= Options.BuildOptions.maxbuildlevel; a++) {
			var sel = ''; if (a == Options.BuildOptions.AscendPresetLevel) sel = ' selected';
			m += '<OPTION value=toLvl' + a + sel + '>' + a + '</option>';
		}
		ById('btBldAscendAllTo').innerHTML = m;
	},

	SaveBuildQueue: function () {
		var t = Tabs.Build;
		var serverID = getServerId();
		setTimeout(function () { GM_setValue('BuildQueue_' + serverID + '_' + uW.tvuid, JSON2.stringify(t.BuildQueue)); }, 0); // get around GM_SetValue uW error
	},

	ReadBuildQueue: function (notify) {
		var t = Tabs.Build;
		var serverID = getServerId();
		s = GM_getValue('BuildQueue_' + serverID + '_' + uW.tvuid);
		if (s != null) {
			opts = JSON2.parse(s);
			for (var k in opts) {
				var validQ = false;
				var cid = 0;
				for (var i = 0; i < Cities.numCities; i++) {
					if (k == t.QueueKey(Cities.cities[i].id)) {
						validQ = true;
						cid = Cities.cities[i].id;
						break;
					}
				}
				if (validQ) {
					t.BuildQueue[k] = opts[k];
					t.ValidateBuildQueue(cid, false);
				}
			}
			t.SaveBuildQueue(); // cleanup
		}
		if (notify) { notify(); }
	},

	show: function (init) {
		var t = Tabs.Build;
		var DispCityId = uW.currentcityid;
		if (init) { DispCityId = InitialCityId; }
		if (t.ModelCityId != DispCityId) {
			t.ModelCity.selectBut(Cities.byID[DispCityId].idx);
		}
		t.PaintOverview();
	},

	QueueKey: function (cid) {
		var t = Tabs.Build;
		var QKey = cid;
		if (Seed.cityData.city[cid].isPrestigeCity) { QKey += 'A'; }
		return QKey;
	},

	EverySecond: function () {
		var t = Tabs.Build;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter % 2 == 0) { // refresh build speed and overview display every 2 seconds
			t.buildspeed = Math.floor(equippedthronestats(78) + equippedthronestats(165));
			t.cityval = Math.floor(equippedthronestats(109) + equippedthronestats(166));
			if (tabManager.currentTab.name == 'Build' && Options.btWinIsOpen) {
				t.PaintOverview();
				t.PaintCityInfo();
			}
		}

		if (t.LoopCounter >= 60) { // check for auto ascend every minute
			t.checkAutoAscend();
			t.LoopCounter = 0;
		}
	},

	toggleStateMode: function (obj) {
		var t = Tabs.Build;
		t.BuildMode = !t.BuildMode;
		obj = ById('pbBuildMode');
		if (t.BuildMode) {
			// start build mode state
			uW.buildslot = t.bot_buildslot; // overwrite original koc function
			obj.value = tx("Build Mode = ON");
			ById('pbbuildmodeempty').value = Options.BuildOptions.EmptySlots;
			t.BuildDiv.style.display = 'block';
			hideMe();
		}
		else {
			// stop build mode state
			uW.buildslot = t.koc_buildslot; // restore original koc function
			obj.value = tx("Build Mode = OFF");
			ById('pbbuildempty').value = Options.BuildOptions.EmptySlots;
			t.BuildDiv.style.display = 'none';
			showMe();
			ById('bttcBuild').click();
			t.PaintOverview();
			t.PaintCityInfo();
		}
	},

	clickCitySelect: function (city) {
		var t = Tabs.Build;
		t.ModelCityId = city.id;
		t.LastQueue = 'x';
		t.PaintCityInfo();
	},

	PaintOverview: function () {
		var t = Tabs.Build;
		var now = uW.unixtime();

		t.Squire = parseIntNan(Seed.items.i1);
		t.Knight = parseIntNan(Seed.items.i2);
		t.Guinevere = parseIntNan(Seed.items.i3);
		t.Morgana = parseIntNan(Seed.items.i4);
		t.Arthur = parseIntNan(Seed.items.i5);
		t.Merlin = parseIntNan(Seed.items.i6);
		t.Divine = parseIntNan(Seed.items.i7);
		t.Epic = parseIntNan(Seed.items.i8);
		t.Legendary = parseIntNan(Seed.items.i10);

		ById('pbbuildUseSHLabel').innerHTML = t.Squire;
		ById('pbbuildUseKHLabel').innerHTML = t.Knight;
		ById('pbbuildUseGHLabel').innerHTML = t.Guinevere;
		ById('pbbuildUseMHLabel').innerHTML = t.Morgana;
		ById('pbbuildUseAHLabel').innerHTML = t.Arthur;
		ById('pbbuildUseRHLabel').innerHTML = t.Merlin;
		ById('pbbuildUseDHLabel').innerHTML = t.Divine;
		ById('pbbuildUseEHLabel').innerHTML = t.Epic;
		ById('pbbuildUseLHLabel').innerHTML = t.Legendary;

		for (var i = 0; i < Cities.numCities; i++) {
			citynum = i + 1;
			cityId = Cities.cities[i].id;

			var str = '';
			if (t.citydelay[citynum] > 0) { str = tx('Waiting') + '...'; }
			if (Options.BuildOptions.AscensionReady[citynum]) { str = tx('Ascension') + '...'; }

			var isBusy = false;
			var activeblds = [];
			var activetimes = [];
			var qcon = Seed.queue_con["city" + cityId];
			if (matTypeof(qcon) == 'array' && qcon.length > 0) {
				if (parseInt(qcon[0][4]) > now) {
					isBusy = true;
					activeblds.push(parseIntNan(qcon[0][7]));
					activetimes.push(parseIntNan(qcon[0][4]));
				}
			}
			if (isBusy) {
				var timeLeft = qcon[0][4] - now;
				str = '<table cellpadding=0 cellspacing=0 width=100% style="padding-right:0px;"><tr><td class=xtab align=center >';
				str += uW.buildingcost['bdg' + qcon[0][0]][0];
				if (qcon[0][1] == 0) {
					str += '<br>(Destroy)';
				} else {
					str += '<br>Lvl ' + qcon[0][1];
				}
				str += '<br>' + timestr(timeLeft) + '</td></tr>';
				var Speedups = '';
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 1, t.Squire);
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 2, t.Knight);
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 3, t.Guinevere);
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 4, t.Morgana);
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 5, t.Arthur);
				Speedups += '</tr><tr>';
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 6, t.Merlin);
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 7, t.Divine);
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 8, t.Epic);
				Speedups += t.dspHG(cityId, qcon[0][2], 0, 10, t.Legendary);

				if (Speedups != "") Speedups = '<tr><td style="padding-right:0px;padding-bottom:2px;"><table align=left cellspacing=0 cellpadding=0><tr>' + Speedups + '</tr></table></td></tr>';
				str = str + Speedups + '<tr><td class=xtab><table align=center cellspacing=0 cellpadding=0><tr><td class=xtab style="padding-right:0px;"><a class="inlineButton button14" onClick="btcancelConstruction(' + cityId + ',0)"><span>' + tx("Cancel") + '</span></a></td></tr></table>';

				if (qcon.length > 1) {
					if (parseInt(qcon[1][4]) > now) {
						activeblds.push(parseIntNan(qcon[1][7]));
						activetimes.push(parseIntNan(qcon[1][4]));
						timeLeft = qcon[1][4] - now;
						str += '</td></tr><tr><td class=xtab align=center >';
						str += uW.buildingcost['bdg' + qcon[1][0]][0];
						if (qcon[1][1] == 0) {
							str += '<br>(Destroy)';
						} else {
							str += '<br>Lvl ' + qcon[1][1];
						}
						str += '<br>' + timestr(timeLeft) + '</td></tr>';
						var Speedups = '';
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 1, t.Squire);
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 2, t.Knight);
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 3, t.Guinevere);
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 4, t.Morgana);
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 5, t.Arthur);
						Speedups += '</tr><tr>';
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 6, t.Merlin);
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 7, t.Divine);
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 8, t.Epic);
						Speedups += t.dspHG(cityId, qcon[0][2], 1, 10, t.Legendary);

						if (Speedups != "") Speedups = '<tr><td style="padding-right:0px;padding-bottom:2px;"><table align=left cellspacing=0 cellpadding=0><tr>' + Speedups + '</tr></table></td></tr>';
						str = str + Speedups + '<tr><td class=xtab><table align=center cellspacing=0 cellpadding=0><tr><td class=xtab style="padding-right:0px;"><a class="inlineButton button14" onClick="btcancelConstruction(' + cityId + ',1)"><span>' + tx("Cancel") + '</span></a></td></tr></table>';
					}
				}
				str += '</td></tr></table>';
			}

			var ascended = getAscensionValues(cityId);
			var faction = ascended.prestigeType;
			var CityFaction = tx('Not ascended');
			var CityValue = parseIntNan(Seed.cityData.city[cityId].cityValue);
			var cityPrestigeLevel = ascended.prestigeLevel;
			if (faction != 0) {
				CityFaction = getFactionName(faction) + '&nbsp(' + cityPrestigeLevel + ')';
			}
			var CityPercent = parseIntNan(CityValue * 100 / t.getAscensionRequirements('max', faction, (parseIntNan(cityPrestigeLevel) + 1)));
			var CityMin = parseIntNan(t.getAscensionRequirements('min', faction, (parseIntNan(cityPrestigeLevel) + 1)));
			if (parseIntNan(cityPrestigeLevel) >= CM.PrestigeModel.getLevelCapSoft(faction)) {
				CityPercent = 'max';
				ById('btBuildAutoAscendCity_' + citynum).disabled = true;
			}
			else {
				ById('btBuildAutoAscendCity_' + citynum).disabled = false;
				if (CityPercent >= 100) { CityPercent = '<span class=boldGreen>100%</span>'; }
				else {
					if (CityValue < CityMin) { CityPercent = '<span class=boldRed>' + CityPercent + '%</span>'; }
					else { CityPercent = CityPercent + '%'; }
				}
			}
			var prestigeexp = '&nbsp;';
			var cityExpTime = ascended.prestigeBuffExpire;
			if ((!isNaN(cityExpTime)) && (cityExpTime + (3600 * 24) >= unixTime())) {
				if (cityExpTime < unixTime()) {
					prestigeexp = '<span style="color:#f00"><b>&nbsp;' + tx('Expired!') + '</b></span>';
				}
				else {
					prestigeexp = '<span style="color:#080"><b>&nbsp;' + uW.timestr(cityExpTime - unixTime()) + '</b></span>';
				}
			}

			ById("btBuildFactionCity_" + citynum).innerHTML = CityFaction;
			ById("btBuildAscensionPercentCity_" + citynum).innerHTML = CityPercent;
			ById("btBuildAscensionProtectionCity_" + citynum).innerHTML = prestigeexp;

			var Completed = true;
			var QEntries = false;
			var BQ = t.BuildQueue[t.QueueKey(cityId)];
			var QLen = 0;
			var QTime = 0;
			for (var b in BQ) {
				if (BQ[b].hasOwnProperty("buildtype")) {
					QEntries = true;
					var CurrLevel = 0;
					if (Seed.buildings['city' + cityId][b] && Seed.buildings['city' + cityId][b][0] == BQ[b].buildtype) {
						CurrLevel = parseIntNan(Seed.buildings['city' + cityId][b][1]);
					}
					var pos = Number(b.split("pos")[1]);
					var actindex = activeblds.indexOf(pos);
					var acttime = 0;
					var bbmax = BQ[b].maxlevel;
					if (actindex != -1) {
						acttime = activetimes[actindex] - now;
						bbmax--;
					}
					QTime += acttime;

					if (BQ[b].maxlevel == 0) {
						Completed = false;
						QLen += 1;
						if (acttime == 0) {
							QTime += t.getBuildTime(cityId, CurrLevel, BQ[b].buildtype, true);
						}
					}
					else {
						if (BQ[b].maxlevel > CurrLevel) {
							Completed = false;
							QLen += BQ[b].maxlevel - CurrLevel;
							for (var bb = CurrLevel; bb < bbmax; bb++) {
								QTime += t.getBuildTime(cityId, bb, BQ[b].buildtype, false);
							}
						}
					}
				}
			}

			if (!isBusy && QEntries && Completed) { str = uW.g_js_strings.commonstr.completedexc; }
			ById('btBuildActiveCity_' + citynum).innerHTML = str;

			ById("btBuildQueueLengthCity_" + citynum).innerHTML = QLen;
			ById("btBuildQueueTimeCity_" + citynum).innerHTML = timestr(QTime);
		}

		if (Options.BuildOptions.ThroneCheck && (t.buildspeed < Number(Options.BuildOptions.BuildSpeed))) {
			ts = '<span class=boldRed><b>' + t.buildspeed + '%</b></span>';
		}
		else { ts = t.buildspeed + '%'; }
		ById("btBuildCurrTR").innerHTML = ts;
		cv = t.cityval + '%';
		ById("btCityValCurrTR").innerHTML = cv;
	},

	dspHG: function (cityId, qitem, i, item, count) {
		var t = Tabs.Build;
		var n = '';
		if (count > 0) {
			n += '<td class=xtab style="padding-right:2px"><a onClick="speedupBuild(' + cityId + ',' + item + ',' + qitem + ',' + i + ')"><img height=18 class="btTop btFaint" src="' + IMGURL + 'items/70/' + item + '.jpg" title="' + itemTitle(item) + '"></a></td>';
		}
		return n;
	},

	cancelAll: function (cityId) {
		var t = Tabs.Build;
		delete t.BuildQueue[t.QueueKey(cityId)];
		t.SaveBuildQueue();
		t.PaintOverview();
		t.PaintCityInfo();
	},

	cancelBuild: function (cityId, pos) {
		var t = Tabs.Build;
		delete t.BuildQueue[t.QueueKey(cityId)][pos];
		t.SaveBuildQueue();
		t.PaintOverview();
		t.PaintCityInfo();
	},

	allBuildsTo: function (cityId, AddType, ToLevel) {
		var t = Tabs.Build;
		if (AddType != 'empty') {
			for (var b in Seed.buildings['city' + cityId]) {
				var building = Seed.buildings['city' + cityId][b];
				if (building) {
					if (parseInt(building[2]) < 300 || parseInt(building[2]) > 309) { // no dummy ascension buildings
						if (building && building[1] != 0) { // ALL doesn't include guardians or defensive tower!
							if ((building[0] == 5 && AddType == "cottages") || (building[0] == 1 && AddType == "farms") || (building[0] == 2 && AddType == "sawmills") || (building[0] == 3 && AddType == "quarries") || (building[0] == 4 && AddType == "mines") || (building[0] == 13 && AddType == "barracks") || (building[0] >= 50 && building[0] <= 53 && AddType == "guardians") || (building[0] == 30 && AddType == "deftower") || (building[0] == 31 && AddType == "redoubt") || (AddType == "all" && building[0] < 30)) {
								t.addToBuildQueue(cityId, b, building[0], ToLevel, parseIntNan(building[1]));
							}
						}
					}
				}
				// automatically add walls even if level 0 when "all" chosen.
				if (AddType == "all" && (!Seed.buildings['city' + cityId]['pos1'] || Seed.buildings['city' + cityId]['pos1'][1] == 0)) {
					t.addToBuildQueue(cityId, "pos1", 19, ToLevel, 0);
				}
			}
		}
		else {
			for (var b = 1; b <= 32; b++) {
				if (!Seed.buildings['city' + cityId]['pos' + b]) {
					if (b == 1) { var buildingType = 19; } // wall in position 1!
					else {
						var buildingType = Options.BuildOptions.EmptySlots;
					}
					t.addToBuildQueue(cityId, "pos" + b, buildingType, ToLevel, 0);
				}
			}
		}
		t.citydelay[Cities.byID[cityId].idx + 1] = 0;
		t.SaveBuildQueue();
		t.PaintOverview();
		t.PaintCityInfo();
	},

	addToBuildQueue: function (cityId, pos, buildtype, maxlevel, currlevel) {
		var t = Tabs.Build;
		var Result = false;
		if (uW.buildingmaxlvl[buildtype] < maxlevel) { maxlevel = uW.buildingmaxlvl[buildtype]; }
		if (!t.BuildQueue[t.QueueKey(cityId)]) { t.BuildQueue[t.QueueKey(cityId)] = {}; }
		if (currlevel < maxlevel || maxlevel == 0) {
			t.BuildQueue[t.QueueKey(cityId)][pos] = { buildtype: buildtype, maxlevel: maxlevel, status: "", ascendcomplete: "", errors: 0 };
			// if castle, check and add wall SPECIAL CASE!!
			if (maxlevel != 0 && buildtype == 0) {
				var wallLevel = 0;
				if (Seed.buildings["city" + cityId] && Seed.buildings["city" + cityId].pos1) {
					wallLevel = parseInt(Seed.buildings["city" + cityId].pos1[1]);
				}
				if (maxlevel > 2 && wallLevel < maxlevel - 2) {
					t.addToBuildQueue(cityId, "pos1", 19, (maxlevel - 2), wallLevel);
				}
			}
			t.SaveBuildQueue();
			Result = true;
		}
		return Result;
	},

	getBuildTime: function (cityId, buildingLevel, buildingType, destroy) {
		var t = Tabs.Build;
		var now = unixTime();
		var constructionBoost = CM.ThroneController.getBoundedEffect(78);
		if (destroy) {
			var buildingMult = 1;
			if (buildingLevel > 2) { buildingMult = Math.pow(2, buildingLevel - 2); }
		}
		else {
			var buildingMult = Math.pow(2, buildingLevel);
		}
		var polValue = 0;
		var knt = Seed.knights["city" + cityId];
		if (knt) {
			knt = knt["knt" + Seed.leaders["city" + cityId].politicsKnightId];
			if (knt) {
				polValue = parseInt(knt.politics)
				if (!destroy) {
					var polBoost = parseInt(knt.politicsBoostExpireUnixtime);
					if (polBoost > now) {
						polValue = parseInt(polValue * 1.25);
					}
				}
			}
		}
		var buildingTime = uW.buildingcost["bdg" + buildingType][7] * buildingMult;
		if (parseInt(buildingType) == 30) {
			buildingTime = CM.defensiveTower.costs[buildingLevel + 1][6];
		}
		if (parseInt(buildingType) == 31) {
			buildingTime = CM.defensiveTowerRedoubt.costs[buildingLevel + 1][6];
		}
		if (parseInt(buildingType) < 6 && parseInt(buildingType) > 0 && buildingMult == 1) {
			buildingTime = 15;
		}
		if (destroy) {
			if (buildingTime % 1 > 0) { buildingTime = parseInt(buildingTime); }
		}
		else {
			buildingTime = parseInt(buildingTime / (1 + 0.005 * polValue + 0.1 * parseInt(Seed.tech.tch16)));
			if (constructionBoost > 0) buildingTime = Math.round(buildingTime / (1 + (constructionBoost / 100)));
		}
		return buildingTime;
	},

	PaintCityInfo: function () {
		var t = Tabs.Build;
		var cityId = t.ModelCityId;

		if (cityId == 0) { return; }

		t.ValidateBuildQueue(cityId, true); // clear completed if required

		// paint the Queue...

		var SortedQ = t.sortBuildQueue(cityId);
		var now = unixTime();
		var BQ = t.BuildQueue[t.QueueKey(cityId)];
		var QLen = SortedQ.length;

		if (QLen == 0) {
			t.LastQueue = 'x';
			m = '<br><div align=center style="opacity:0.3;">' + tx('No buildings queued') + '</div>';
			ById('btBldQueue').innerHTML = m;
		} else {
			var activeblds = [];
			var activetimes = [];
			var qcon = Seed.queue_con["city" + cityId];
			if (matTypeof(qcon) == 'array' && qcon.length > 0) {
				if (parseInt(qcon[0][4]) > now) { activeblds.push(parseIntNan(qcon[0][7])); activetimes.push(parseIntNan(qcon[0][4])); }
				if (qcon.length > 1) {
					if (parseInt(qcon[1][4]) > now) { activeblds.push(parseIntNan(qcon[1][7])); activetimes.push(parseIntNan(qcon[1][4])); }
				}
			}

			var qs = JSON2.stringify(SortedQ);
			if (qs == t.LastQueue) { // queue hasn't changed, just update the current level, time, and status text
				for (var QObj in SortedQ) {
					var b = SortedQ[QObj].b;
					if (b) {
						var CurrLevel = 0;
						var pos = Number(b.split("pos")[1]);
						var StatusText = BQ[b].status;
						var actindex = activeblds.indexOf(pos);
						var acttime = 0;
						var bbmax = BQ[b].maxlevel;
						if (actindex != -1) {
							if (BQ[b].maxlevel > 0) { StatusText = tx('Building') + '...'; }
							else { StatusText = tx('Destroying') + '...'; }
							if (BQ[b].status != "") {
								BQ[b].status = "";
								t.SaveBuildQueue();
							}
							acttime = activetimes[actindex] - now;
							bbmax--;
						}
						var QTime = acttime;
						if (Seed.buildings["city" + cityId][b]) { CurrLevel = parseIntNan(Seed.buildings["city" + cityId][b][1]); }
						if ((actindex == -1) && BQ[b].ascendcomplete && BQ[b].ascendcomplete == Seed.cityData.city[cityId].prestigeInfo.prestigeLevel) { StatusText = 'Complete!'; }
						if (BQ[b].maxlevel == 0) {
							if (acttime == 0) {
								QTime += t.getBuildTime(cityId, CurrLevel, BQ[b].buildtype, true);
							}
						}
						else {
							for (var bb = CurrLevel; bb < bbmax; bb++) {
								QTime += t.getBuildTime(cityId, bb, BQ[b].buildtype, false);
							}
						}
						ById('pbbldcurr_' + b).innerHTML = CurrLevel;
						ById('pbbldtime_' + b).innerHTML = timestr(QTime, true);
						ById('pbbldstatus_' + b).innerHTML = StatusText;
					}
				}
			} else {
				t.LastQueue = qs;

				m = '<TABLE width=98% cellspacing=0 align=center class=xtab><tr><th width=30px class=xtabHD align=left>' + tx('Pos') + '</th><th class=xtabHD align=left>' + uW.g_js_strings.commonstr.type + '</th><th width=50px class=xtabHD align=center>' + tx('Max Level') + '</th><th width=50px class=xtabHD align=center>' + tx('Current') + '</th><th width=100px class=xtabHD align=right>' + tx('Remaining') + '</th><th class=xtabHD align=left>' + uW.g_js_strings.commonstr.status + '</th><th class=xtabHD align=right><a id=btBldCancelAllButton class="inlineButton btButton red14" onclick="btBldCancelAll(' + cityId + ')"><span>' + tx('Remove All') + '</span></a></th></tr>';
				var r = 0;

				for (var QObj in SortedQ) {
					var b = SortedQ[QObj].b;
					if (b) {
						rowClass = 'evenRow';
						if (r % 2 == 1) rowClass = 'oddRow';
						var CurrLevel = 0;
						var pos = Number(b.split("pos")[1]);
						var StatusText = BQ[b].status;
						var actindex = activeblds.indexOf(pos);
						var acttime = 0;
						var bbmax = BQ[b].maxlevel;
						if (actindex != -1) {
							if (BQ[b].maxlevel > 0) { StatusText = tx('Building') + '...'; }
							else { StatusText = tx('Destroying') + '...'; }
							if (BQ[b].status != "") {
								BQ[b].status = "";
								t.SaveBuildQueue();
							}
							acttime = activetimes[actindex] - now;
							bbmax--;
						}
						var QTime = acttime;
						if (Seed.buildings["city" + cityId][b]) { CurrLevel = parseIntNan(Seed.buildings["city" + cityId][b][1]); }
						if ((actindex == -1) && BQ[b].ascendcomplete && BQ[b].ascendcomplete == Seed.cityData.city[cityId].prestigeInfo.prestigeLevel) { StatusText = 'Complete!'; }

						m += '<TR class="' + rowClass + '"><TD align=left>' + pos + '</td><td align=left>' + uW.buildingcost['bdg' + BQ[b].buildtype][0] + '</td><td align=center>' + (BQ[b].maxlevel || "(" + uW.g_js_strings.commonstr.decontruct + ")") + '</td><td align=center id="pbbldcurr_' + b + '">' + (CurrLevel || "--") + '</td>';
						if (BQ[b].maxlevel == 0) {
							if (acttime == 0) {
								QTime += t.getBuildTime(cityId, CurrLevel, BQ[b].buildtype, true);
							}
						}
						else {
							for (var bb = CurrLevel; bb < bbmax; bb++) {
								QTime += t.getBuildTime(cityId, bb, BQ[b].buildtype, false);
							}
						}
						m += '<td align=right id="pbbldtime_' + b + '">' + timestr(QTime, true) + '</td>';
						m += '<td align=left id="pbbldstatus_' + b + '">' + StatusText + '</td><td align=right><A class="inlineButton btButton brown11" onclick="cancelBuild(' + cityId + ',\'' + b + '\')"><span>' + tx('Remove') + '</span></a></td></tr>';
						r++;
					}
				}
				m += '</table><div align=center id=btBldQueueMessage>&nbsp;</div>';
				ById('btBldQueue').innerHTML = m;
			}
		}
		ById('btBldQueueStats').innerHTML = QLen + ' Buildings';
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	getAscensionRequirements: function (type, faction, level) {
		var t = Tabs.Build;
		var fac = 'DRUID';
		switch (faction) {
			case "2": fac = 'FEY'; break;
			case "3": fac = 'BRITON'; break;
		}
		return CM.WorldSettings.getSettingAsObject("ASCENSION_REQS_" + fac)[level] ? parseIntNan(CM.WorldSettings.getSettingAsObject("ASCENSION_REQS_" + fac)[level][type]) : 9999999;
	},

	CreateBuildModeDiv: function () {
		var t = Tabs.Build;

		t.BuildDiv = document.createElement('div');
		t.BuildDiv.id = 'btBuildDiv';
		t.BuildDiv.style.position = 'absolute';
		t.BuildDiv.style.width = '750px';
		t.BuildDiv.style.top = '20px';
		t.BuildDiv.style.height = '25px';
		t.BuildDiv.style.paddingLeft = '10px';
		t.BuildDiv.style.paddingTop = '8px';
		t.BuildDiv.style.zIndex = '20002'; // keep above nearly everything else...
		t.BuildDiv.style.display = 'none';
		t.BuildDiv.style.opacity = '0.95';
		t.BuildDiv.style.backgroundColor = '#fde073';

		var m = '<table cellpadding=0 cellspacing=0 class=xtab width=100%><tr><td><b><span id=pbbmlabel>' + tx('BUILD MODE') + ':</span></b>&nbsp;</td>';
		m += '<td>' + uW.g_js_strings.commonstr.type + ':&nbsp;' + htmlSelector({ build: tx('Next Level Only'), max: tx('Build to Level'), destroy: uW.g_js_strings.commonstr.decontruct, stomp: tx('Dragon Stomp') }, 'max', 'id=pbbuildmodetype') + '&nbsp;' + uW.g_js_strings.commonstr.level + '&nbsp;<select id=pbbuildmodeto></select></td>';
		m += '<td>' + tx('Empty Slots') + ':&nbsp;' + htmlSelector(t.BuildList, Options.BuildOptions.EmptySlots, 'id=pbbuildmodeempty') + '</td>';
		m += '<td align=right>' + strButton14(uW.g_js_strings.commonstr.close, 'id=pbbuildmodeclose') + '</td></tr></table>';
		t.BuildDiv.innerHTML = m;

		ById('mod_maparea').appendChild(t.BuildDiv);

		ChangeOption('BuildOptions', 'pbbuildmodeempty', 'EmptySlots');
		ById('pbbuildmodeclose').addEventListener('click', t.toggleStateMode, false);
	},

	FlashBuildMode: function (color) {
		var t = Tabs.Build;
		jQuery('#pbbmlabel').css('color', color);
		setTimeout(function () { jQuery('#pbbmlabel').css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')'); }, 250);
	},

	bot_buildslot: function (c, a) {
		var t = Tabs.Build;
		var buildingMode = ById('pbbuildmodetype').value;
		var toLevel = ById('pbbuildmodeto').value.substr(5);
		var cityId = uW.currentcityid;
		var buildingPos = c.id.split("_")[1];
		if (!Seed.buildings['city' + cityId]["pos" + buildingPos]) {
			// new build!
			if (buildingMode != "stomp" && buildingMode != "destroy") {
				if (buildingPos == 1) { var buildingType = 19; } // wall in position 1!
				else {
					var buildingType = parseIntNan(Options.BuildOptions.EmptySlots);
				}
				if (buildingMode == "build") {
					var buildingLevel = 0;
					if (t.BuildQueue[t.QueueKey(cityId)] && t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos] && t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos].buildtype == buildingType) {
						if (t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos].maxlevel > buildingLevel) { buildingLevel = t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos].maxlevel; }
					}
					buildingLevel += 1;
				}
				else {
					if (buildingMode == "max") { var buildingLevel = parseIntNan(toLevel); }
				}
				var maxlevel = buildingLevel;
				if (uW.buildingmaxlvl[buildingType] < maxlevel) { maxlevel = uW.buildingmaxlvl[buildingType]; }

				if (t.addToBuildQueue(cityId, "pos" + buildingPos, buildingType, buildingLevel, 0)) {
					t.FlashBuildMode('green');
					t.citydelay[Cities.byID[cityId].idx + 1] = 0;
					return;
				}
			}
		}
		else {
			var buildingType = parseIntNan(Seed.buildings['city' + cityId]["pos" + buildingPos][0]);
			var buildingLevel = parseIntNan(Seed.buildings['city' + cityId]["pos" + buildingPos][1]);
			var buildingId = parseIntNan(Seed.buildings['city' + cityId]["pos" + buildingPos][3]);
			if (buildingMode != "stomp" && buildingMode != "destroy") {
				if (buildingLevel < Options.BuildOptions.maxbuildlevel) {
					var CurrLevel = buildingLevel;
					if (buildingMode == "build") {
						if (t.BuildQueue[t.QueueKey(cityId)] && t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos] && t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos].buildtype == buildingType) {
							if (t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos].maxlevel > buildingLevel) { buildingLevel = t.BuildQueue[t.QueueKey(cityId)]["pos" + buildingPos].maxlevel; }
						}
						buildingLevel += 1;
					}
					else {
						if (buildingMode == "max") { buildingLevel = parseIntNan(toLevel); }
					}
					var maxlevel = buildingLevel;
					if (uW.buildingmaxlvl[buildingType] < maxlevel) { maxlevel = uW.buildingmaxlvl[buildingType]; }
					if (t.addToBuildQueue(cityId, "pos" + buildingPos, buildingType, maxlevel, CurrLevel)) {
						t.FlashBuildMode('green');
						t.citydelay[Cities.byID[cityId].idx + 1] = 0;
						return;
					}
				}
			}
			else {
				if (buildingMode == "stomp") {
					uW.destructBuildingConfirm(buildingId, buildingPos);
					t.FlashBuildMode('green');
					return;
				};
				if (buildingMode == "destroy") {
					if (t.addToBuildQueue(cityId, "pos" + buildingPos, buildingType, 0, buildingLevel)) {
						t.FlashBuildMode('green');
						t.citydelay[Cities.byID[cityId].idx + 1] = 0;
						return;
					}
				}
			}
		}
		t.FlashBuildMode('red'); // indicate error
	},

	bot_gethelp: function (f, cid, time, retry) {
		var t = Tabs.Build;
		if (retry > 3) return; //dont want to get stuck in a loop of failures
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.bid = f;
		params.ctrl = 'AskForHelp';
		params.action = 'getHelpData';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok && rslt.data) {
					uW.handleHelpCallback(uWCloneInto(rslt.data));
					//only post build to FB if they take at least half an hour
					if (time > 1800) {
						var a = Seed.queue_con["city" + cid];
						var e = 0;
						var d = 0;
						for (var c = 0; c < a.length; c++) {
							if (parseInt(a[c][2]) == parseInt(f)) {
								e = parseInt(a[c][0]);
								d = parseInt(a[c][1]);
								break
							}
						}
						var b = new Array();
						b.push(["REPLACE_LeVeLbUiLdInG", d]);
						b.push(["REPLACE_BuIlDiNgNaMe", uW.buildingcost["bdg" + e][0]]);
						b.push(["REPLACE_LeVeLiD", d]);
						b.push(["REPLACE_AsSeTiD", f]);
						uW.common_postToProfile("95", uWCloneInto(b));
					}
				}
				else {
					if (rslt.errorMsg) { actionLog(Cities.byID[cid].name + ': ' + rslt.errorMsg, 'BUILD'); }
					else { actionLog(Cities.byID[cid].name + ': Build help request failure', 'BUILD'); }
				}
			},
			onFailure: function () {
				actionLog(Cities.byID[cid].name + ': Build help request failure', 'BUILD');
				t.bot_gethelp(f, cid, time, retry + 1);
				return;
			},
		}, true);
	},

	sortBuildQueue: function (cityId) {
		var t = Tabs.Build;
		var Sorted = [];
		var BQ = t.BuildQueue[t.QueueKey(cityId)];
		if (BQ && BQ != {}) {
			BQ = JSON2.parse(JSON2.stringify(BQ)); // new object
			for (var b in BQ) {
				var BObj = BQ[b];
				if (BObj.hasOwnProperty("buildtype")) {
					var CurrLevel = 0;
					if (Seed.buildings["city" + cityId][b]) { CurrLevel = parseIntNan(Seed.buildings["city" + cityId][b][1]); }
					var QTime = 0;
					if (BQ[b].maxlevel == 0) { QTime = t.getBuildTime(cityId, CurrLevel, BQ[b].buildtype, true); }
					else {
						if (CurrLevel >= BQ[b].maxlevel) { QTime = 99999999; }
						else { QTime = t.getBuildTime(cityId, CurrLevel, BQ[b].buildtype, false); }
					}
					var SmartOrder = t.SmartOrder.indexOf(Number(BQ[b].buildtype));
					if (SmartOrder < 0) { SmartOrder = 99999999; }
					BObj.QTime = QTime;
					BObj.b = b;
					BObj.pos = Number(b.split("pos")[1]);
					BObj.SmartOrder = SmartOrder;
					Sorted.push(BObj);
				}
			}
			// sort by next level time, then position...
			if (parseIntNan(Options.BuildOptions.BuildPriority) == 1) {
				Sorted.sort(function (a, b) { var x = a.QTime - b.QTime; return (x == 0) ? a.pos - b.pos : x; });
			}
			// sort by position...
			if (parseIntNan(Options.BuildOptions.BuildPriority) == 2) {
				Sorted.sort(function (a, b) { return a.pos - b.pos; });
			}
			// sort by type, then position...
			if (parseIntNan(Options.BuildOptions.BuildPriority) == 3) {
				Sorted.sort(function (a, b) { var x = Number(a.buildtype) - Number(b.buildtype); return (x == 0) ? a.pos - b.pos : x; });
			}
			// sort by smartorder, then position...
			if (parseIntNan(Options.BuildOptions.BuildPriority) == 4) {
				Sorted.sort(function (a, b) { var x = a.SmartOrder - b.SmartOrder; var y = Number(b.buildtype) - Number(a.buildtype); return (x == 0) ? ((y == 0) ? a.pos - b.pos : y) : x; });
			}
			return Sorted;
		}
		else {
			return Sorted;
		}
	},

	ValidateBuildQueue: function (cityId, save) {
		var t = Tabs.Build;
		var BQ = t.BuildQueue[t.QueueKey(cityId)];
		if (BQ && BQ != {}) {
			for (var b in BQ) {
				var BObj = BQ[b];
				if (BObj.hasOwnProperty("buildtype")) {
					if (BObj.ascendcomplete && BObj.ascendcomplete != Seed.cityData.city[cityId].prestigeInfo.prestigeLevel) { // new ascension level
						t.BuildQueue[t.QueueKey(cityId)][b].ascendcomplete = ""; // clear completed flag
						t.BuildQueue[t.QueueKey(cityId)][b].status = ""; // clear status flag
						if (save) t.SaveBuildQueue();
					}
					if (Seed.buildings["city" + cityId][b]) { // check building type and level
						var buildingType = parseIntNan(Seed.buildings['city' + cityId][b][0]);
						var buildingLevel = parseIntNan(Seed.buildings['city' + cityId][b][1]);
					}
					if (BObj.maxlevel > 0) {
						if (Seed.buildings["city" + cityId][b]) { // check building type and level
							var KeepCompleted = (Options.BuildOptions.KeepCompleted && Seed.cityData.city[cityId].isPrestigeCity);
							if (buildingType && BObj.buildtype != buildingType || (BObj.maxlevel <= buildingLevel && !KeepCompleted)) {
								delete t.BuildQueue[t.QueueKey(cityId)][b];
								if (save) t.SaveBuildQueue();
							}
						}
					}
					else { // check if already destroyed
						if (!Seed.buildings["city" + cityId][b]) {
							delete t.BuildQueue[t.QueueKey(cityId)][b];
							if (save) t.SaveBuildQueue();
						}
						else {
							if (buildingType && BObj.buildtype != buildingType) {
								delete t.BuildQueue[t.QueueKey(cityId)][b];
								if (save) t.SaveBuildQueue();
							}
						}
					}
				}
			}
		}
	},

	doAutoLoop: function (idx) {
		var t = Tabs.Build;
		clearTimeout(t.timer);
		if (!Options.BuildOptions.Running) return;

		var cityId = Cities.cities[idx - 1].id;
		if (idx == 1) { t.loopaction = false; } // reset loop action indicator for first city
		t.autodelay = 0; // no delay if no action taken!

		// first check if city is idle (or busy)

		var now = unixTime();
		var isBusy = false;
		var qcon = Seed.queue_con["city" + cityId];
		if (qcon.length > 0) {
			if (parseInt(qcon[0][4]) > now) {
				isBusy = true;
				// try second queue
				if (CM.QueueModel.hasFreeQueue() && Options.BuildOptions.bothqueues) {
					isBusy = false;
					if (qcon.length > 1) {
						if (parseInt(qcon[1][4]) > now) { isBusy = true; }
					}
					else { t.FixQueue(cityId, 1); }
				}
			}
			else { t.FixQueue(cityId, 0); }
		}

		if (isBusy) {
			// queue busy, try speedup!
			t.autoSpeedup(cityId, qcon[0]);
		}
		else { // we can build!
			t.ValidateBuildQueue(cityId, true);
			if (!Options.BuildOptions.ThroneCheck || (t.buildspeed >= Options.BuildOptions.BuildSpeed)) { // if no build speed restriction or enough building speed
				var ascensionok = (!Options.BuildOptions.AscensionReady[idx]);
				if (Options.BuildOptions.Enabled[idx] && ascensionok) {
					if (t.citydelay[idx] > 0) { t.citydelay[idx]--; } // city being delayed due to error, reduce delay number and skip city
					else {
						var SortedQ = t.sortBuildQueue(cityId);
						if (SortedQ.length > 0) {
							var activeblds = [];
							if (matTypeof(qcon) == 'array' && qcon.length > 0) {
								if (parseInt(qcon[0][4]) > now) { activeblds.push(parseIntNan(qcon[0][7])); }
								if (qcon.length > 1) {
									if (parseInt(qcon[1][4]) > now) { activeblds.push(parseIntNan(qcon[1][7])); }
								}
							}

							// select next building from sorted queue and check build requirements...

							var SomethingToBuild = false;
							for (var QObj in SortedQ) {
								var b = SortedQ[QObj].b;
								if (b) {
									if (activeblds.indexOf(parseIntNan(b.split("pos")[1])) == -1) { // check not already building
										var QEntry = t.BuildQueue[t.QueueKey(cityId)][b];
										if (QEntry.maxlevel > 0) {
											if (!QEntry.ascendcomplete || QEntry.ascendcomplete != Seed.cityData.city[cityId].prestigeInfo.prestigeLevel) { // check building not already completed for this ascension level
												var NextLevel = 1;
												if (Seed.buildings['city' + cityId][b]) { NextLevel = parseIntNan(Seed.buildings['city' + cityId][b][1]) + 1; }
												if (NextLevel <= QEntry.maxlevel) {
													var CanBuild = t.CheckCanBuild(QEntry.buildtype, NextLevel, cityId, b.split("pos")[1]);
													if (!CanBuild) { // update queue entry
														var statustext = tx('Missing Requirement');
														if (t.limitingFactor) { statustext += ' (' + t.limitingFactor + ')'; }
														t.BuildQueue[t.QueueKey(cityId)][b].status = statustext;
														t.SaveBuildQueue();
													}
													else {
														SomethingToBuild = true;
														t.autodelay = t.intervalSecs;
														t.loopaction = true;
														t.Build(cityId, b, QEntry.buildtype, NextLevel);
														break;
													}
												}
												else {
													t.BuildQueue[t.QueueKey(cityId)][b].status = "";
													t.BuildQueue[t.QueueKey(cityId)][b].ascendcomplete = Seed.cityData.city[cityId].prestigeInfo.prestigeLevel;
													t.SaveBuildQueue();
												}
											}
										}
										else {
											// cannot destroy embassy while part of alliance...
											if (QEntry.buildtype == 8 && getMyAlliance()[0] != 0) {
												var statustext = 'Cannot destroy when part of Alliance!';
												t.BuildQueue[t.QueueKey(cityId)][b].status = statustext;
												t.SaveBuildQueue();
											}
											else { // cannot destroy spire when craft queue is full
												if (QEntry.buildtype == 20 && Seed.queue_craft["city" + cityId].length > 0) {
													var statustext = 'Cannot destroy when crafting!';
													t.BuildQueue[t.QueueKey(cityId)][b].status = statustext;
													t.SaveBuildQueue();
												}
												else {
													var NextLevel = parseIntNan(Seed.buildings['city' + cityId][b][1]); // need this for destroy?
													SomethingToBuild = true;
													t.autodelay = t.intervalSecs;
													t.loopaction = true;
													t.Destroy(cityId, b, QEntry.buildtype, NextLevel);
													break;
												}
											}
										}
									}
								}
							}
							if (!SomethingToBuild) {
								// nothing we can build in this city, delay the city by 10 loops...
								t.citydelay[idx] = 10;
							}
						}
					}
				}
			}
		}

		if (idx == Cities.numCities) {
			if (!t.loopaction) { t.autodelay = t.intervalSecs; } // if no action this loop, apply delay anyway...
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, (t.autodelay * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx + 1); }, (t.autodelay * 1000));
		}
	},

	autoSpeedup: function (cityId, q) {
		var t = Tabs.Build;
		var now = unixTime();
		var item = 0;
		totTime = q[4] - now;

		if (totTime > 0) {
			if (Options.BuildOptions.UseOverride && Options.BuildOptions.OverrideItem != 0) {
				var THRESHOLD_SECONDS = (parseIntNan(Options.BuildOptions.OverrideMinutes) * 60) + (parseIntNan(Options.BuildOptions.OverrideHours) * 60 * 60);
				if (totTime >= THRESHOLD_SECONDS && uW.ksoItems[Options.BuildOptions.OverrideItem].count > 0) { item = Options.BuildOptions.OverrideItem; }
			}
			if (item == 0 && totTime >= HGLimit[8] && Options.BuildOptions.UseLH && uW.ksoItems[10].count > 0) { item = 10; }
			if (item == 0 && totTime >= HGLimit[7] && Options.BuildOptions.UseEH && uW.ksoItems[8].count > 0) { item = 8; }
			if (item == 0 && totTime >= HGLimit[6] && Options.BuildOptions.UseDH && uW.ksoItems[7].count > 0) { item = 7; }
			if (item == 0 && totTime >= HGLimit[5] && Options.BuildOptions.UseRH && uW.ksoItems[6].count > 0) { item = 6; }
			if (item == 0 && totTime >= HGLimit[4] && Options.BuildOptions.UseAH && uW.ksoItems[5].count > 0) { item = 5; }
			if (item == 0 && totTime >= HGLimit[3] && Options.BuildOptions.UseMH && uW.ksoItems[4].count > 0) { item = 4; }
			if (item == 0 && totTime >= HGLimit[2] && Options.BuildOptions.UseGH && uW.ksoItems[3].count > 0) { item = 3; }
			if (item == 0 && totTime >= HGLimit[1] && Options.BuildOptions.UseKH && uW.ksoItems[2].count > 0) { item = 2; }
			if (item == 0 && totTime >= HGLimit[0] && Options.BuildOptions.UseSH && uW.ksoItems[1].count > 0) { item = 1; }
		}

		if (item != 0) {
			t.autodelay = t.intervalSecs;
			t.loopaction = true;
			t.speedupBuild(cityId, item, q[2], 0, true);
		}
	},

	FixQueue: function (cityId, qpos) {
		var t = Tabs.Build;
		var qcon = Seed.queue_con["city" + cityId];
		if (qcon[qpos]) { // fix the seed...
			if (GlobalOptions.ExtendedDebugMode) { logit(Cities.byID[cityId].name + ': Fixing seed.building array', 'BUILD'); }
			if (qcon[qpos][1] == 0) {
				delete Seed.buildings["city" + cityId]['pos' + qcon[qpos][7]];
			}
			else {
				Seed.buildings["city" + cityId]['pos' + qcon[qpos][7]] = uWCloneInto([qcon[qpos][0], qcon[qpos][1], qcon[qpos][7], qcon[qpos][2]]);
			};
			qcon.pop(); // remove expired build from queue
			if (cityId == uW.currentcityid) {
				uW.modal_build_show_state();
				uW.update_bdg();
			}
		}
	},

	CheckCanBuild: function (BuildId, Level, cityId, pos) {
		var t = Tabs.Build;

		t.limitingFactor = null;

		if (parseIntNan(Level) == 0) return false;

		var Result = true;

		if (BuildId >= 50 && BuildId <= 53) { return true; }

		// for field view in unascended, check slot unlocked by castle level

		var MaxFields = 109 + (3 * parseInt(Seed.buildings["city" + cityId]["pos0"][1]));
		if (pos > MaxFields) {
			t.limitingFactor = tx('Field still locked');
			Result = false;
			return Result;
		}

		// if building above 10, check castle level

		if (Level > 10) {
			if (BuildId != 0) {
				var B = parseInt(Seed.buildings["city" + cityId]["pos0"][1]);
				if (B < Level) {
					t.limitingFactor = tx('Castle');
					Result = false;
					return Result;
				}
			}
			else { // castle requires wall one level below dammit!
				var B = parseInt(Seed.buildings["city" + cityId]["pos1"][1]);
				if (B < (Level - 1)) {
					t.limitingFactor = tx('Wall');
					Result = false;
					return Result;
				}
			}
		}

		// check resources

		if (BuildId == 30) { // defensive tower different
			var unitFood = parseInt(CM.defensiveTower.costs[Level][1]);
			var unitWood = parseInt(CM.defensiveTower.costs[Level][2]);
			var unitStone = parseInt(CM.defensiveTower.costs[Level][3]);
			var unitOre = parseInt(CM.defensiveTower.costs[Level][4]);
		}
		else {
			if (BuildId == 31) { // redoubt tower difference
				var unitFood = parseInt(CM.defensiveTowerRedoubt.costs[Level][1]);
				var unitWood = parseInt(CM.defensiveTowerRedoubt.costs[Level][2]);
				var unitStone = parseInt(CM.defensiveTowerRedoubt.costs[Level][3]);
				var unitOre = parseInt(CM.defensiveTowerRedoubt.costs[Level][4]);
			}
			else {
				var BuildMult = Math.pow(2, Level - 1);
				var unitFood = parseInt(uW.buildingcost['bdg' + BuildId][1]) * BuildMult;
				var unitWood = parseInt(uW.buildingcost['bdg' + BuildId][2]) * BuildMult;
				var unitStone = parseInt(uW.buildingcost['bdg' + BuildId][3]) * BuildMult;
				var unitOre = parseInt(uW.buildingcost['bdg' + BuildId][4]) * BuildMult;
			}
		}
		var food = parseIntNan(Seed.resources['city' + cityId].rec1[0] / 3600);
		var wood = parseIntNan(Seed.resources['city' + cityId].rec2[0] / 3600);
		var stone = parseIntNan(Seed.resources['city' + cityId].rec3[0] / 3600);
		var ore = parseIntNan(Seed.resources['city' + cityId].rec4[0] / 3600);

		if (food < unitFood) {
			t.limitingFactor = uW.resourceinfo['rec1'];
			Result = false;
		}
		if (wood < unitWood) {
			t.limitingFactor = uW.resourceinfo['rec2'];
			Result = false;
		}
		if (stone < unitStone) {
			t.limitingFactor = uW.resourceinfo['rec3'];
			Result = false;
		}
		if (ore < unitOre) {
			t.limitingFactor = uW.resourceinfo['rec4'];
			Result = false;
		}

		if (!Result) return Result; // break out if already failed

		// building requirements

		var Buildings = getCityBuildings(cityId);

		if (BuildId == 30) { // defensive tower different
			var fc = CM.defensiveTower.buildReq[Level];
			if (matTypeof(fc[0]) == 'object') {
				for (var k in fc[0]) {
					var b = Buildings[k];
					var req = fc[0][k];
					if (req < 0) { req = Level + req; }
					if (b.maxLevel < req) {
						t.limitingFactor = uW.buildingcost["bdg" + k.substr(1)][0];
						Result = false;
						break;
					}
				}
			}
			var fc = CM.defensiveTower.itemsReq[Level];
			if (matTypeof(fc) == 'object') {
				for (var k in fc) {
					var b = parseIntNan(Seed.items["i" + k]);
					var req = fc[k];
					if (b < req) {
						t.limitingFactor = uW.itemlist["i" + k].name;
						Result = false;
						break;
					}
				}
			}
		}
		else {
			if (BuildId == 31) { // redoubt tower different
				var fc = CM.defensiveTowerRedoubt.buildReq[Level];
				if (matTypeof(fc[0]) == 'object') {
					for (var k in fc[0]) {
						var b = Buildings[k];
						var req = fc[0][k];
						if (req < 0) { req = Level + req; }
						if (b.maxLevel < req) {
							t.limitingFactor = uW.buildingcost["bdg" + k.substr(1)][0];
							Result = false;
							break;
						}
					}
				}
				var fc = CM.defensiveTowerRedoubt.itemsReq[Level];
				if (matTypeof(fc) == 'object') {
					for (var k in fc) {
						var b = parseIntNan(Seed.items["i" + k]);
						var req = fc[k];
						if (b < req) {
							t.limitingFactor = uW.itemlist["i" + k].name;
							Result = false;
							break;
						}
					}
				}
			}
			else {
				var fc = uW.buildingcost['bdg' + BuildId];
				if (matTypeof(fc[8]) == 'object') {
					for (var k in fc[8]) {
						var bType = k.substr(1);
						var b = Buildings[bType];
						var req = fc[8][k][1];
						if (req < 0) { req = Level + req; }
						var maxlvl = uW.buildingmaxlvl[bType] || 12;
						if (b.maxLevel < Math.min(maxlvl, req)) {
							t.limitingFactor = uW.buildingcost["bdg" + bType][0];
							Result = false;
							break;
						}
					}
				}
				if (matTypeof(fc[9]) == 'object') {
					for (var k in fc[9]) {
						if (parseInt(Seed.tech['tch' + k.substr(1)]) < (fc[9][k][1]) + Level) {
							t.limitingFactor = uW.techcost["tch" + k.substr(1)][0];
							Result = false;
							break;
						}
					}
				}
			}
		}

		// item requirements
		var V = 1;
		if (Level > 9) {
			var h = "i401";
			if (BuildId == 0) {
				if (Level == 11) {
					h = "i402"
				} else {
					if (Level == 12) {
						h = "i404"
					} else {
						if (Level == 13) {
							h = "i409"
						} else {
							if (Level == 14) {
								h = "i415"
							} else {
								if (Level == 15) {
									h = "i416"
								}
							}
						}
					}
				}
			} else {
				if (Level > 11) {
					h = "i403"
				}
			}
			if (BuildId == 12) {
				if (Level == 13) {
					h = "i410"
				} else {
					if (Level == 14) {
						h = "i419";
						V = 3;
					} else {
						if (Level == 15) {
							h = "i420"
							V = 5;
						}
					}
				}
			}
			if (BuildId == 19) {
				if (Level == 13) {
					h = "i408"
				} else {
					if (Level == 14) {
						h = "i417"
					} else {
						if (Level == 15) {
							h = "i418"
						}
					}
				}
			}
			if (BuildId == 5 && Level == 12) {
				h = "i407"
			}

			var c = CM.BuildingRequirements.get(BuildId, (Level - 1));
			h = c || h;
			var b = parseIntNan(Seed.items[h]);
			if (b < V) {
				t.limitingFactor = uW.itemlist[h].name;
				Result = false;
			}
		}
		return Result;
	},

	speedupBuild: function (cityId, item, bid, slot, noretry) {
		var t = Tabs.Build;
		if (bid == 666) { return; }
		var citynum = Cities.byID[cityId].idx + 1;
		jQuery('#btBuildCity_' + citynum).css('color', 'magenta');

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.iid = item;
		params.bid = bid;
		params.apothecary = false;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/speedupConstruction.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var reduced = CM.intelligentOrdering.getReduceTime(item);
					Seed.items["i" + item] = parseInt(Seed.items["i" + item]) - 1;
					uW.ksoItems[item].subtract();
					var qloc = 0;
					var timered = 0;
					var queue = Seed.queue_con["city" + cityId][slot];
					timered = SpeedupArray[parseInt(item) - 1];
					queue[3] = parseInt(queue[3]) - timered;
					queue[4] = parseInt(queue[4]) - timered
					if (cityId == uW.currentcityid) uW.update_queue();
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name + ': Construction speedup failed (' + rslt.msg + ')', 'BUILD');
					}
					else {
						actionLog(Cities.byID[cityId].name + ': Construction speedup failed (' + rslt.error_code + ')', 'BUILD');
					}
					if (rslt.error_code == 4) { // can't find construction item - let's get rid.
						Seed.queue_con["city" + cityId].splice(slot, 1);
					}
				}
				jQuery('#btBuildCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': Construction speedup failed (AJAX Error)', 'BUILD');
				jQuery('#btBuildCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			},
		}, noretry);
	},

	Destroy: function (cityId, bpos, btype, lvl) {
		var t = Tabs.Build;
		var citynum = Cities.byID[cityId].idx + 1;
		jQuery('#btBuildCity_' + citynum).css('color', 'red');
		var bid = parseIntNan(Seed.buildings["city" + cityId][bpos][3]);
		var additionalqueue = 0;
		var qcon = Seed.queue_con["city" + cityId];
		if (matTypeof(qcon) == 'array' && qcon.length > 0) {
			if (CM.QueueModel.hasFreeQueue() && Options.BuildOptions.bothqueues) { // double check!
				additionalqueue = 1;
			}
			else {
				t.citydelay[citynum] = 10; // delay 10 loops
				actionLog(Cities.byID[cityId].name + ': Not authorised to use second build queue', 'BUILD');
				return;
			}
		}
		var time = t.getBuildTime(cityId, lvl, btype, true);

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.bid = bid;
		params.pos = bpos.split("pos")[1];
		params.lv = lvl - 1;
		params.type = btype;
		params.pay_for_an_additional_queue = additionalqueue;
		params.permission = 0;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/destruct.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (rslt.timeNeeded) { time = rslt.timeNeeded; }
					actionLog(Cities.byID[cityId].name + ': Deconstructing ' + uW.buildingcost['bdg' + btype][0], 'BUILD');
					t.AddSeedQueueEntry(cityId, btype, 0, rslt.buildingId, uW.unixtime(), uW.unixtime() + time, 0, time, params.pos);
					if (params.cid == uW.currentcityid) uW.update_bdg();
					delete t.BuildQueue[t.QueueKey(cityId)][bpos]; // remove destroy request from queue
					t.SaveBuildQueue();
				}
				else {
					t.HandleBuildError(rslt, cityId, bpos, btype, lvl);
				}
				t.PaintOverview();
				jQuery('#btBuildCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': AJAX Error', 'BUILD');
				jQuery('#btBuildCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			}
		}, true);
	},

	Build: function (cityId, bpos, btype, lvl) {
		var t = Tabs.Build;
		var citynum = Cities.byID[cityId].idx + 1;
		var bid = 0;
		var BuildOK = true;
		if (Seed.buildings["city" + cityId][bpos]) { bid = parseIntNan(Seed.buildings["city" + cityId][bpos][3]); }
		var additionalqueue = 0;
		var qcon = Seed.queue_con["city" + cityId];
		if (matTypeof(qcon) == 'array' && qcon.length > 0) {
			if (CM.QueueModel.hasFreeQueue() && Options.BuildOptions.bothqueues) { // double check!
				additionalqueue = 1;
			}
			else {
				t.citydelay[citynum] = 10; // delay 10 loops
				actionLog(Cities.byID[cityId].name + ': Not authorised to use second build queue', 'BUILD');
				BuildOK = false;
			}
		}

		// double check building requirements?

		if (btype != 30 && btype != 31) { // not defensive tower...?
			var saveCityId = uW.currentcityid;
			uW.currentcityid = cityId;
			var chk = uW.checkreq("bdg", btype, lvl); //check if all requirements are met
			uW.currentcityid = saveCityId;
			for (var c = 0; c < chk[3].length; c++) {
				if (chk[3][c] == 0) {
					t.citydelay[citynum] = 10; // delay 10 loops
					actionLog(Cities.byID[cityId].name + ': Final building check failed (' + uW.buildingcost['bdg' + btype][0] + ' Level ' + lvl + ')', 'BUILD');
					BuildOK = false;
				}
			}
		}

		if (BuildOK) {
			jQuery('#btBuildCity_' + citynum).css('color', 'green');
			var time = t.getBuildTime(cityId, lvl - 1, btype, false);

			var params = uW.Object.clone(uW.g_ajaxparams);
			params.cid = cityId;
			params.bid = "";
			if (bid != 0) params.bid = bid;
			params.pos = bpos.split("pos")[1];
			params.lv = lvl;
			params.type = btype;
			params.pay_for_an_additional_queue = additionalqueue;
			if (params.lv > 9) { params.permission = 1; }
			else { params.permission = 0; }

			new MyAjaxRequest(uW.g_ajaxpath + "ajax/construct.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					if (rslt.ok) {
						if (rslt.timeNeeded) { time = rslt.timeNeeded; }
						actionLog(Cities.byID[cityId].name + ': Building ' + uW.buildingcost['bdg' + btype][0] + ' Level ' + lvl, 'BUILD');
						t.AddSeedQueueEntry(cityId, btype, lvl, rslt.buildingId, uW.unixtime(), uW.unixtime() + time, 0, time, params.pos);
						if (btype == 30) { // defensive tower different
							jQuery.each(CM.defensiveTower.itemsReq[lvl], function (i, G) {
								CM.InventoryView.removeItemFromInventory(i, G)
							});
							var unitFood = parseInt(CM.defensiveTower.costs[lvl][1]);
							var unitWood = parseInt(CM.defensiveTower.costs[lvl][2]);
							var unitStone = parseInt(CM.defensiveTower.costs[lvl][3]);
							var unitOre = parseInt(CM.defensiveTower.costs[lvl][4]);
						}
						else {
							if (btype == 31) { // redoubt tower different
								jQuery.each(CM.defensiveTowerRedoubt.itemsReq[lvl], function (i, G) {
									CM.InventoryView.removeItemFromInventory(i, G)
								});
								var unitFood = parseInt(CM.defensiveTowerRedoubt.costs[lvl][1]);
								var unitWood = parseInt(CM.defensiveTowerRedoubt.costs[lvl][2]);
								var unitStone = parseInt(CM.defensiveTowerRedoubt.costs[lvl][3]);
								var unitOre = parseInt(CM.defensiveTowerRedoubt.costs[lvl][4]);
							}
							else {
								var BuildMult = Math.pow(2, lvl - 1);
								var unitFood = parseInt(uW.buildingcost['bdg' + btype][1]) * BuildMult;
								var unitWood = parseInt(uW.buildingcost['bdg' + btype][2]) * BuildMult;
								var unitStone = parseInt(uW.buildingcost['bdg' + btype][3]) * BuildMult;
								var unitOre = parseInt(uW.buildingcost['bdg' + btype][4]) * BuildMult;
							}
						}
						Seed.resources["city" + cityId].rec1[0] -= unitFood;
						Seed.resources["city" + cityId].rec2[0] -= unitWood;
						Seed.resources["city" + cityId].rec3[0] -= unitStone;
						Seed.resources["city" + cityId].rec4[0] -= unitOre;

						var V = 1;
						if (lvl > 9) {
							var h = "i401";
							if (btype == 0) {
								if (lvl == 11) {
									h = "i402"
								} else {
									if (lvl == 12) {
										h = "i404"
									} else {
										if (lvl == 13) {
											h = "i409"
										} else {
											if (lvl == 14) {
												h = "i415"
											} else {
												if (lvl == 15) {
													h = "i416"
												}
											}
										}
									}
								}
							} else {
								if (lvl > 11) {
									h = "i403"
								}
							}
							if (btype == 12) {
								if (lvl == 13) {
									h = "i410"
								} else {
									if (lvl == 14) {
										h = "i419";
										V = 3;
									} else {
										if (lvl == 15) {
											h = "i420";
											V = 5;
										}
									}
								}
							}
							if (btype == 19) {
								if (lvl == 13) {
									h = "i408"
								} else {
									if (lvl == 14) {
										h = "i417"
									} else {
										if (lvl == 15) {
											h = "i418"
										}
									}
								}
							}
							if (btype == 5 && lvl == 12) {
								h = "i407"
							}

							var c = CM.BuildingRequirements.get(btype, (lvl - 1));
							h = c || h;
							Seed.items[h] = parseInt(Seed.items[h]) - V;
							uW.ksoItems[parseInt(h.substr(1))].subtract(V);
						}

						if (Options.BuildOptions.help && time > 59) t.bot_gethelp(params.bid, cityId, time, 1);
						if (params.cid == uW.currentcityid) {
							if (jQuery("#queue_head_building").hasClass("sel")) {
								uW.queue_changetab_building();
							}
							uW.modal_build_show_state();
							uW.update_bdg();
						}
						if (lvl == t.BuildQueue[t.QueueKey(cityId)][bpos].maxlevel) {
							t.BuildQueue[t.QueueKey(cityId)][bpos].ascendcomplete = Seed.cityData.city[cityId].prestigeInfo.prestigeLevel; // completed
						}
						t.BuildQueue[t.QueueKey(cityId)][bpos].errors = 0;
						t.SaveBuildQueue();
					}
					else {
						t.HandleBuildError(rslt, cityId, bpos, btype, lvl);
					}
					t.PaintOverview();
					jQuery('#btBuildCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
				},
				onFailure: function () {
					actionLog(Cities.byID[cityId].name + ': AJAX Error', 'BUILD');
					jQuery('#btBuildCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
				}
			}, true);
		}
	},

	HandleBuildError: function (rslt, cityId, bpos, btype, lvl) {
		var t = Tabs.Build;
		var citynum = Cities.byID[cityId].idx + 1;
		// fix Seed missing buildingId for next pass...
		if (rslt.buildingId && Seed.buildings["city" + cityId][bpos]) {
			Seed.buildings["city" + cityId][bpos][3] = parseInt(rslt.buildingId);
		}
		if (!rslt.msg) { rslt.msg = tx('Error Code (') + rslt.error_code + ')'; }
		actionLog(Cities.byID[cityId].name + ': Building Error - ' + rslt.msg, 'BUILD');
		var a = null;
		var g = Number(rslt.error_code);
		var g_server = uW.g_server;
		var SetError = false;
		switch (g) {
			case 0:
				a = "Unexpected Error.";
				break;
			case 2: // building in progress - update seed to fix
				uW.buildingcost["bdg666"] = uWCloneInto(["Building...", 0, 0, 0, 0, 0, 0, 0, [], [], ""]);
				t.AddSeedQueueEntry(cityId, 666, 666, 666, uW.unixtime(), uW.unixtime() + 90, 0, 90, 999);
				a = "Construction is already starting.";
				break;
			case 3: // Unknown issue when updating your game, please try again
				break;
			case 8:
				a = "Excess traffic.";
				CM.GATracker("Error", a + " (" + g + ")", g_server);
				break;
			case 102: // Another building already exists on the same spot
				SetError = true;
				break;
			case 103: // building already at this level
				SetError = true;
				break;
			case 104: // building cannot be built here
				SetError = true;
				break;
			case 105: // building does not exist here
				SetError = true;
				break;
			case 106: // only one building of this type
				SetError = true;
				break;
			case 107: // only one field building of this type
				SetError = true;
				break;
			case 108: // all available queues in use - update seed to fix
				uW.buildingcost["bdg666"] = uWCloneInto(["Building...", 0, 0, 0, 0, 0, 0, 0, [], [], ""]);
				t.AddSeedQueueEntry(cityId, 666, 666, 666, uW.unixtime(), uW.unixtime() + 90, 0, 90, 999);
				a = "all available queues are in use.";
				break;
			default:
				a = "Something has gone wrong.";
				CM.GATracker("Error", a + " (" + g + ")", g_server);
		};
		if (SetError) {
			if (!t.BuildQueue[t.QueueKey(cityId)][bpos].errors) { t.BuildQueue[t.QueueKey(cityId)][bpos].errors = 0; }
			t.BuildQueue[t.QueueKey(cityId)][bpos].errors++;
			if (t.BuildQueue[t.QueueKey(cityId)][bpos].errors >= 3) { // remove building from queue after 3 errors
				actionLog(Cities.byID[cityId].name + ': Removing Building in Position ' + bpos + ' from Build Queue', 'BUILD');
				delete t.BuildQueue[t.QueueKey(cityId)][bpos];
			}
			t.SaveBuildQueue();
		}
		if (rslt.user_action) { // captcha wtf?
			actionLog(Cities.byID[cityId].name + ': Build Captcha Detected - delaying...', 'BUILD');
			t.citydelay[citynum] = 10;
		}
	},

	AddSeedQueueEntry: function (cityId, btype, lvl, id, start, end, zero, duration, pos) {
		var t = Tabs.Build;

		var k = uWCloneInto([]);
		k.push(btype);
		k.push(lvl);
		k.push(parseInt(id));
		k.push(start);
		k.push(end);
		k.push(zero);
		k.push(duration);
		k.push(pos);
		Seed.queue_con["city" + cityId].push(k);
	},

	LoadBuildPresets: function () {
		var t = Tabs.Build;
		ById('btBuildPreset').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- " + tx('Select Layout') + " --"
		o.value = 0;
		ById("btBuildPreset").options.add(o);
		for (var y in Options.BuildOptions.BuildPresetNames) {
			var o = document.createElement("option");
			o.text = Options.BuildOptions.BuildPresetNames[y];
			o.value = y;
			ById("btBuildPreset").options.add(o);
		}
		t.NextPresetNumber = parseIntNan(y) + 1;
		if (t.InitPresetNumber != 0) {
			ById('btBuildPreset').value = t.InitPresetNumber;
			t.InitPresetNumber = 0;
		}
		for (var a = 1; a <= 3; a++) {
			t.LoadAscensionPresets('btAscendPreset_' + a, a);
		}
	},

	PaintBldPreset: function (PN, msg) {
		var t = Tabs.Build;
		t.FieldView = false;
		t.PresetType = Options.BuildOptions.BuildPresetTypes[PN] || parseIntNan(Seed.cityData.city[t.ModelCityId].prestigeInfo.prestigeType);
		t.PresetName = Options.BuildOptions.BuildPresetNames[PN] || "";
		if (PN != 0) { t.Preset = JSON2.parse(JSON2.stringify(Options.BuildOptions.BuildPresets[PN])); }
		else { t.Preset = { pos0: "bdg0", pos1: "bdg19" }; }
		t.PresetNum = PN;

		if (PN == 0) { ById('btBldPresetMessages').innerHTML = tx('Layout Name') + ':&nbsp;<INPUT class="btInput" id="btBldPresetName" size=20 style="width: 185px" type=text value="City Layout #' + t.NextPresetNumber + '"/>'; }
		else { ById('btBldPresetMessages').innerHTML = msg; }

		var m = '<table width=100% cellpadding=0 cellspacing=0 class=xtab><tr style="vertical-align:top;"><td id=btBldPresetData><div id=btBldPresetSlots>&nbsp</div></td>';
		m += '<td width=400px align=right><div id=btBldPresetImage>&nbsp;</div>';
		m += '<div align=center><br>' + tx('Layout Type') + ':&nbsp;' + htmlSelector(t.PresetTypes, t.PresetType, 'id=btBldPresetType') + '</div>';
		m += '<div align=center><input id=btBldPresetCity type=radio name=btcityfield ' + (!t.FieldView ? 'CHECKED' : '') + '>' + tx('City View') + '&nbsp;&nbsp;<input id=btBldPresetField type=radio name=btcityfield ' + (t.FieldView ? 'CHECKED' : '') + '>' + tx('Field View') + '</div>';
		m += '<br><div align=center>' + strButton8(tx('Copy Current'), 'id=btBldPresetCopy') + '&nbsp;' + strButton8(tx('Delete Layout'), 'id=btBldPresetDelete') + '&nbsp;' + strButton8(tx('Save Changes'), 'id=btBldPresetSave') + '&nbsp;' + strButton8(uW.g_js_strings.commonstr.cancel, 'id=btBldPresetCancel') + '</div>';
		m += '</td></tr></table>';
		m += '<div align=center id=btBldPresetImportMessages></div>';

		ById('btBldPresetDetails').innerHTML = m;
		t.setLayoutImage();
		t.displaySlots();

		if (PN == 0) { jQuery('#btBldPresetDelete').addClass("disabled"); }
		else {
			jQuery('#btBldPresetCancel').addClass("disabled");
			jQuery('#btBldPresetSave').addClass("disabled");
		}

		ById('btBldPresetCity').addEventListener('change', function () {
			t.FieldView = !ById('btBldPresetCity').checked;
			t.setLayoutImage();
			t.displaySlots();
		}, false);
		ById('btBldPresetField').addEventListener('change', function () {
			t.FieldView = ById('btBldPresetField').checked;
			t.setLayoutImage();
			t.displaySlots();
		}, false);
		ById('btBldPresetType').addEventListener('change', function (e) {
			t.PresetType = e.target.value;
			jQuery('#btBldPresetSave').removeClass("disabled");
			t.ValidateLayout();
			t.setLayoutImage();
			t.displaySlots();
		}, false);
		if (ById('btBldPresetName')) {
			ById('btBldPresetName').addEventListener('change', function (e) {
				jQuery('#btBldPresetSave').removeClass("disabled");
				jQuery('#btBldPresetCancel').removeClass("disabled");
			}, false);
		}

		ById('btBldPresetCopy').addEventListener('click', t.CopyBldPreset, false);
		ById('btBldPresetSave').addEventListener('click', t.SaveBldPreset, false);
		ById('btBldPresetDelete').addEventListener('click', t.DeleteBldPreset, false);
		ById('btBldPresetCancel').addEventListener('click', t.CancelBldPreset, false);

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	setLayoutImage: function () {
		var t = Tabs.Build;
		var ImageFile = CITY_VIEW;
		if (!t.FieldView) {
			if (t.PresetType == 1) { ImageFile = DRUID_CITY_VIEW; }
			if (t.PresetType == 2) { ImageFile = FEY_CITY_VIEW; }
			if (t.PresetType == 3) { ImageFile = BRITON_CITY_VIEW; }
		}
		else {
			ImageFile = FIELD_VIEW;
			if (t.PresetType == 1) { ImageFile = DRUID_FIELD_VIEW; }
			if (t.PresetType == 2) { ImageFile = FEY_FIELD_VIEW; }
			if (t.PresetType == 3) { ImageFile = BRITON_FIELD_VIEW; }
		}
		ById('btBldPresetImage').innerHTML = '<img width=400px src="' + ImageFile + '">';
	},

	displaySlots: function () {
		var t = Tabs.Build;
		var min = 0;
		var max = 32;
		var rowcount = 11;
		if (GlobalOptions.btWinSize.x == 750) { rowcount = 17; }
		if (GlobalOptions.btWinSize.x == 1250) { rowcount = 9; }
		var m = '<table width=100% cellpadding=0 cellspacing=0><tr style="vertical-align:top;"><td style="padding-right:0px;">';
		var Blds = t.CityBuildings;
		if (!t.FieldView) {
			if (t.PresetType == 1) { Blds = t.DruidCityBuildings; }
			if (t.PresetType == 2) { Blds = t.FeyCityBuildings; }
			if (t.PresetType == 3) { Blds = t.BritonCityBuildings; }
		}
		else {
			Blds = t.FieldBuildings;
			if (t.PresetType == 1) { Blds = t.DruidFieldBuildings; }
			if (t.PresetType == 2) { Blds = t.FeyFieldBuildings; }
			if (t.PresetType == 3) { Blds = t.BritonFieldBuildings; }
			rowcount = 14;
			if (GlobalOptions.btWinSize.x == 750) { rowcount = 21; }
			if (GlobalOptions.btWinSize.x == 1250) { rowcount = 11; }
			if (t.PresetType == 0) { min = 100; max = 145; }
			else { min = 101; max = 103; }
		}
		var BldSelect = { 0: "-- Select Building --" };
		for (var k in Blds) {
			if (uW.buildingcost["bdg" + Blds[k]]) {
				BldSelect["bdg" + Blds[k]] = uW.buildingcost["bdg" + Blds[k]][0];
			}
		}
		var c = 0;
		m += '<table class=xtab>';
		for (var p = min; p <= max; p++) {
			if (t.FieldView && p > 139 && p != 142 && p != 145) { continue; }
			if (p == 0) { m += '<tr><td align=right>' + p + ':&nbsp;</td><td align=left style="padding-right:0px;">&nbsp;' + uW.buildingcost["bdg0"][0] + '</td></tr>'; }
			else {
				if (p == 1) { m += '<tr><td align=right>' + p + ':&nbsp;</td><td align=left style="padding-right:0px;">&nbsp;' + uW.buildingcost["bdg19"][0] + '</td></tr>'; }
				else {
					m += '<tr><td align=right>' + p + ':&nbsp;</td><td align=left style="padding-right:0px;">' + htmlSelector(BldSelect, t.Preset["pos" + p] || 0, 'class="btInput btBldPresetSelector" id="btBldPresetpos' + p + '"') + '</td></tr>';
				}
			}
			c++;
			if (c % rowcount == 0) { m += '</table></td><td><table class=xtab>'; }
		}
		m += '</table></td></tr></table>';
		m += '<br><div>&nbsp;&nbsp;' + tx('Empty Slots') + ':&nbsp;' + htmlSelector(BldSelect, 0, 'class="btInput" id="btBldPresetposAll"') + '&nbsp;' + strButton8(tx('Set'), 'id=btBldPresetposAllSet') + '</div>';
		m += '<br><div>&nbsp;&nbsp;<input class=btInput id=btBldPresetExport type=button value="' + tx("Export Layout") + '">&nbsp;<input class=btInput id=btBldPresetImport type=button value="' + tx("Import Layout") + '">&nbsp;<input class=btInput id=btBldPresetImportFile type=file></div>';
		ById('btBldPresetSlots').innerHTML = m;

		var nodes = ByCl('btBldPresetSelector');
		if (nodes.length > 0) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].addEventListener('change', function (e) {
					t.Preset[e.target.id.substring(11)] = e.target.value;
					if (t.Preset[e.target.id.substring(11)] == 0) { delete t.Preset[e.target.id.substring(11)]; }
					jQuery('#btBldPresetSave').removeClass("disabled");
					jQuery('#btBldPresetCancel').removeClass("disabled");
				}, false);
			}
		}

		ById('btBldPresetposAllSet').addEventListener('click', t.SetAllEmpty, false);

		ById('btBldPresetExport').addEventListener('click', function () {
			var Export = {};
			if (ById('btBldPresetName')) { Export.PresetName = ById('btBldPresetName').value; }
			else { Export.PresetName = jQuery("#btBuildPreset option:selected").text(); }
			Export.PresetType = ById('btBldPresetType').value;
			Export.Preset = JSON2.parse(JSON2.stringify(t.Preset));
			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			Tabs.Options.saveConfig(uriContent, 'City_Layout_' + getServerId() + '_' + uW.tvuid + '_' + Export.PresetName + '.txt');
		}, false);

		ById('btBldPresetImport').addEventListener('click', function () {
			ById('btBldPresetImportMessages').innerHTML = '&nbsp;'
			var fileInput = ById("btBldPresetImportFile");
			var files = fileInput.files;
			if (files.length == 0) {
				ById('btBldPresetImportMessages').innerHTML = '<span style="color:#800;">' + tx('Please select a city layout file') + '</span>';
				return;
			}
			var file = files[0];

			var reader = new FileReader();

			reader.onload = function (e) {
				var Import = JSON2.parse(e.target.result);
				if (Import.Preset) {
					t.Preset = JSON2.parse(JSON2.stringify(Import.Preset));
					jQuery('#btBldPresetSave').removeClass("disabled");
					jQuery('#btBldPresetCancel').removeClass("disabled");
					if (Import.PresetName && ById('btBldPresetName')) { ById('btBldPresetName').value = Import.PresetName; }
					if (Import.PresetType) {
						t.PresetType = Import.PresetType;
						ById('btBldPresetType').value = Import.PresetType;
						t.setLayoutImage();
					}
					ById('btBldPresetImportMessages').innerHTML = tx('City layout imported');
					t.displaySlots();
				}
				else {
					ById('btBldPresetImportMessages').innerHTML = tx('Invalid File') + '!';
				}
			};
			reader.readAsText(file);
		}, false);

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	SetAllEmpty: function () {
		var t = Tabs.Build;
		var NewType = ById('btBldPresetposAll').value;
		if (NewType != 0) {
			var nodes = ByCl('btBldPresetSelector');
			if (nodes.length > 0) {
				for (var i = 0; i < nodes.length; i++) {
					if (nodes[i].value == 0) {
						nodes[i].value = NewType;
						t.Preset[nodes[i].id.substring(11)] = NewType;
						jQuery('#btBldPresetSave').removeClass("disabled");
						jQuery('#btBldPresetCancel').removeClass("disabled");
					}
				}
			}
		}
	},

	ValidateLayout: function () {
		var t = Tabs.Build;
		var Blds = t.CityBuildings;
		var Flds = t.FieldBuildings;
		var min = 100;
		var max = 145;
		if (t.PresetType == 1) { Blds = t.DruidCityBuildings; Flds = t.DruidFieldBuildings; min = 101; max = 103; }
		if (t.PresetType == 2) { Blds = t.FeyCityBuildings; Flds = t.FeyFieldBuildings; min = 101; max = 103; }
		if (t.PresetType == 3) { Blds = t.BritonCityBuildings; Flds = t.BritonFieldBuildings; min = 101; max = 103; }
		for (var b in t.Preset) {
			var building = t.Preset[b];
			if (building) {
				var bid = parseInt(building.split("bdg")[1]);
				var pos = parseInt(b.split("pos")[1]);
				if (pos != 0 && pos != 1) {
					if (pos < 100) {
						if (Blds.indexOf(bid) == -1) { delete t.Preset[b]; }
					}
					else {
						if (Flds.indexOf(bid) == -1 || pos < min || pos > max) { delete t.Preset[b]; }
					}
				}
			}
		}
	},

	NewBldPreset: function () {
		var t = Tabs.Build;
		ById('btBuildPreset').value = 0;
		jQuery('#btNewBldPreset').addClass("disabled");
		t.PaintBldPreset(0, '');
	},

	DeleteBldPreset: function () {
		var t = Tabs.Build;
		if (!t.PresetNum) return;
		delete Options.BuildOptions.BuildPresetTypes[t.PresetNum];
		delete Options.BuildOptions.BuildPresetNames[t.PresetNum];
		delete Options.BuildOptions.BuildPresets[t.PresetNum];
		saveOptions();
		t.LoadBuildPresets();
		jQuery('#btNewBldPreset').removeClass("disabled");
		t.clearBuildPresetDiv();
		ById('btBldPresetMessages').innerHTML = tx('Layout Deleted') + '!';
	},

	CancelBldPreset: function () {
		var t = Tabs.Build;
		jQuery('#btNewBldPreset').removeClass("disabled");
		ById('btBldPresetMessages').innerHTML = '&nbsp;';
		if (!t.PresetNum) { t.clearBuildPresetDiv(); }
		else { t.PaintBldPreset(t.PresetNum, ''); }
	},

	SaveBldPreset: function () {
		var t = Tabs.Build;

		// validate buildings?

		if (t.PresetNum == 0) {
			t.PresetNum = t.NextPresetNumber;
			Options.BuildOptions.BuildPresetNames[t.PresetNum] = ById('btBldPresetName').value;
		}
		Options.BuildOptions.BuildPresetTypes[t.PresetNum] = ById('btBldPresetType').value;
		Options.BuildOptions.BuildPresets[t.PresetNum] = JSON2.parse(JSON2.stringify(t.Preset));
		saveOptions();
		jQuery('#btNewBldPreset').removeClass("disabled");
		t.InitPresetNumber = t.PresetNum;
		t.LoadBuildPresets();
		t.PaintBldPreset(t.PresetNum, tx('Layout Saved') + '!');
	},

	SelectBldPreset: function (sel) {
		var t = Tabs.Build;
		if (sel.value == 0) { t.clearBuildPresetDiv(); }
		else { t.PaintBldPreset(sel.value, ''); }
	},

	CopyBldPreset: function () {
		var t = Tabs.Build;
		t.Preset = { pos0: "bdg0", pos1: "bdg19" };
		t.PresetType = parseIntNan(Seed.cityData.city[t.ModelCityId].prestigeInfo.prestigeType);
		ById('btBldPresetType').value = t.PresetType;
		for (var b in Seed.buildings['city' + t.ModelCityId]) {
			var building = Seed.buildings['city' + t.ModelCityId][b];
			if (building) {
				if (parseInt(building[2]) < 300 || parseInt(building[2]) > 309) { // no dummy ascension buildings
					if (building && building[1] != 0) {
						if (building[0] < 30 && building[0] > 0) {
							t.Preset[b] = "bdg" + building[0];
						}
					}
				}
			}
		}
		jQuery('#btBldPresetSave').removeClass("disabled");
		jQuery('#btBldPresetCancel').removeClass("disabled");
		t.setLayoutImage();
		t.displaySlots();
	},

	SetBldPreset: function () {
		var t = Tabs.Build;
		var cityId = t.ModelCityId;
		var ToLevel = parseIntNan(ById('btBldPresetAllTo').value.substr(5));
		var PN = parseIntNan(ById('btBuildPreset').value);
		if (PN == 0) return;
		ById('btBldPresetMessages').innerHTML = '&nbsp;';

		// validate correct type

		if (t.PresetType != parseIntNan(Seed.cityData.city[cityId].prestigeInfo.prestigeType)) {
			ById('btBldPresetMessages').innerHTML = 'Incorrect city type';
			return;
		}

		for (var b in t.Preset) {
			var building = t.Preset[b];
			if (building && building != 0) {
				var bid = parseInt(building.split("bdg")[1]);
				var pos = parseInt(b.split("pos")[1]);
				var CurrLevel = 0;
				if (Seed.buildings['city' + cityId][b]) { CurrLevel = Seed.buildings['city' + cityId][b][1]; }
				if (CurrLevel == 0 || Seed.buildings['city' + cityId][b][0] == bid) {
					t.addToBuildQueue(cityId, b, bid, ToLevel, CurrLevel);
				}
			}
		}
		t.SaveBuildQueue();
		t.PaintOverview();
		t.PaintCityInfo();
		ById('btBldQueueLink').click();
	},

	Ascend: function (cityId, faction, blessingId, notify) {
		var t = Tabs.Build;
		var ascended = getAscensionValues(cityId);
		var cityPrestigeType = ascended.prestigeType;
		var cityPrestigeLevel = ascended.prestigeLevel;
		var blessings = Seed.cityData.city[cityId].prestigeInfo.blessings;
		if (!blessings) { blessings = []; }

		var action = 1;

		if (ascended.isPrestigeCity) {
			action = 2;
			faction = cityPrestigeType;
		}

		var paymentType = 'gems';
		var crystalId = null;
		var cost = 0;
		var CanUseCrystal = false;
		var Lessers = Seed.items.i33000 || 0;
		var Greaters = Seed.items.i33001 || 0;
		if (cityPrestigeLevel < 3) { // lessers ascend 1-3
			CanUseCrystal = (Options.BuildOptions.UseLesserCrystals && Lessers);
			if (CanUseCrystal) {
				paymentType = 'crystals';
				crystalId = '33000';
				cost = 1;
			}
		}
		else {
			CanUseCrystal = (Options.BuildOptions.UseGreaterCrystals && Greaters);
			if (CanUseCrystal) {
				paymentType = 'crystals';
				crystalId = '33001';
				cost = 1;
			}
		}
		var cityValue = parseIntNan(Seed.cityData.city[cityId].cityValue);
		var cityPercent = parseIntNan(cityValue * 100 / Tabs.Build.getAscensionRequirements('max', faction, (cityPrestigeLevel + 1)));
		if (cityPercent < 100 && !CanUseCrystal) {
			actionLog(Cities.byID[cityId].name + ': Not ready for ascension (' + cityPercent + '%)', 'ASCEND');
			return;
		}

		if (ascended.isPrestigeCity && cityPrestigeLevel != 3 && cityPrestigeLevel != 6 && cityPrestigeLevel != 9) { // minor
			var allowed = CM.BlessingSystemModel.getBlessingGroup().minor.blessing[faction];
			if (allowed.indexOf(blessingId) == -1) { // this blessing not allowed, choose the first allowed one...
				blessingId = allowed[0];
			}
			if (blessings.indexOf(blessingId) != -1) { // this blessing already used, find the first blessing in the allowed list that isn't used!
				for (var b in allowed) {
					blessingId = allowed[b];
					if (blessings.indexOf(blessingId) == -1) { break; }
				}
			}
			blessings.push(blessingId);
		}
		else { // major
			blessingId = CM.BlessingSystemModel.getBlessingGroup().major[cityPrestigeLevel + 1][faction - 1]; // force the applicable major blessing - 0 index array!!
			blessings.push(blessingId);
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.action = action;
		params.cid = cityId;
		params.prestigeLevel = cityPrestigeLevel + 1;
		params.prestigeType = faction;
		params.blessings = blessings.toString();
		params.paymentType = paymentType;
		if (paymentType == "crystals") {
			params.crystalId = crystalId;
		}
		params.cost = cost;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/createPrestigeCity.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					CM.BlessingSystemModel.updateTempFaction(cityId, faction);
					CM.BlessingSystemModel.levelUp(cityId, uWCloneInto(rslt.updateSeed));
					actionLog(Cities.byID[cityId].name + ': Successfully Ascended', 'ASCEND');
					if (notify) { notify(cityId, faction); } // action on successful ascend...
					// need to reload to get everything in order (the above stuff doesn't work)
					ReloadKOC();
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name + ': Failed to ascend (' + rslt.msg + ')', 'ASCEND');
					}
					else {
						if (rslt.feedback) {
							actionLog(Cities.byID[cityId].name + ': Failed to ascend (' + rslt.feedback + ')', 'ASCEND');
						}
						else {
							actionLog(Cities.byID[cityId].name + ': Failed to ascend (' + rslt.error_code + ')', 'ASCEND');
						}
					}
					t.killCityActivity(cityId); // try and stop things that may be going on..
				}
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': Failed to ascend (Ajax Error)', 'ASCEND');
			},
		}, true); // noretry
	},

	checkAutoAscend: function () {
		var t = Tabs.Build;

		// loop through cities checking if any cities ready to ascend

		for (var i = 1; i <= Cities.numCities; i++) {
			var cityId = Cities.cities[i - 1].id;
			if (Options.BuildOptions.AscendEnabled[i] && Options.BuildOptions.AscendRunning) {
				var ascended = getAscensionValues(cityId);
				var cityPrestigeType = ascended.prestigeType;
				var cityPrestigeLevel = ascended.prestigeLevel;
				var faction = parseIntNan(Options.BuildOptions.AscendFaction) || 1;
				if (ascended.isPrestigeCity) { faction = cityPrestigeType; }
				var blessings = ascended.blessings;
				if (!blessings) { blessings = []; }
				var MaxLevel = CM.PrestigeModel.getLevelCapSoft(faction);
				if (ascended.isPrestigeCity) { faction = cityPrestigeType; }
				var cityValue = parseIntNan(Seed.cityData.city[cityId].cityValue);
				var cityPercent = parseIntNan(cityValue * 100 / Tabs.Build.getAscensionRequirements('max', faction, (cityPrestigeLevel + 1)));
				var cityExpTime = Seed.cityData.city[cityId].prestigeInfo.prestigeBuffExpire;
				if (isNaN(cityExpTime)) { cityExpTime = 0; }
				else { cityExpTime = cityExpTime - unixTime(); }

				ascendok = false;
				canAscend = (cityPercent >= 100);
				if (!canAscend) {
					var Lessers = Seed.items.i33000 || 0;
					var Greaters = Seed.items.i33001 || 0;
					if (cityPrestigeLevel < 3) {
						canAscend = (Options.BuildOptions.UseLesserCrystals && Lessers);
					}
					else {
						if (cityPrestigeLevel < 6) {
							canAscend = (Options.BuildOptions.UseGreaterCrystals && Greaters);
						}
					}

				}
				if (!ascended.isPrestigeCity && canAscend) { ascendok = true; }
				if (ascended.isPrestigeCity && (cityPrestigeLevel < MaxLevel) && canAscend && (cityExpTime <= (Options.BuildOptions.AscendTime * 60))) { ascendok = true; }

				if (ascendok) {
					// get next available minor blessing from preferred list -
					var blessingId = 0;
					for (var b in Options.BuildOptions.AscendBlessings[faction]) {
						blessingId = parseIntNan(Options.BuildOptions.AscendBlessings[faction][b]);
						if (blessingId != 0) {
							if (blessings.indexOf(blessingId) == -1) { break; }
						}
					}

					// do ascend!

					Options.BuildOptions.AscensionReady[i] = true; // suspend auto functions!
					saveOptions();

					citydormant = true;

					if (!citydormant) { // try and stop all the stuff going on before the next pass....
						t.killCityActivity(cityId);
					}

					if (citydormant) {
						t.Ascend(cityId, faction, blessingId, t.AscensionCallBack);
					}
				}
				else {
					if (Options.BuildOptions.AscensionReady[i]) {
						Options.BuildOptions.AscensionReady[i] = false;
						saveOptions();
					}
				}
			}
			else {
				if (Options.BuildOptions.AscensionReady[i]) {
					Options.BuildOptions.AscensionReady[i] = false;
					saveOptions();
				}
			}
		}
	},

	killCityActivity: function (cityId) {
		var t = Tabs.Build;

		// kill training queue
		Tabs.Train.cancelAll(cityId, true);

		// kill fortification queue
		Tabs.Fort.cancelAll(cityId, true);

		// kill currently reviving
		var q1 = Seed.queue_revive["city" + cityId];
		if (q1 != null && q1.length > 0) {
			Tabs.Revive.cancelRevive(cityId, 1);
		}
		var q2 = Seed.queue_revive2["city" + cityId];
		if (q2 != null && q2.length > 0) {
			Tabs.Revive.cancelRevive(cityId, 2);
		}

		// kill raids and attempt to bring all other marches home
		var now = unixTime();
		Options.RaidLastReset = now;
		saveOptions();
		ToggleCityRaids(cityId, 'stopAll');
		var city_atkp = Seed.queue_atkp['city' + cityId]
		var count = 0;
		for (var e in city_atkp) {
			destinationUnixTime = city_atkp[e]['destinationUnixTime'];
			MarchId = city_atkp[e]['marchId'];
			MarchStatus = city_atkp[e]['marchStatus'];
			MarchType = city_atkp[e]['marchType'];
			botMarchStatus = city_atkp[e]['botMarchStatus'];
			if (MarchType == 9 && botMarchStatus == 3 && MarchStatus == 10) {
				count++;
				setTimeout(RaidManager.DoAllDelete, (count * 1250), MarchId, Cities.byID[cityId].idx, count);
			}
			if (MarchType != 9 && MarchId && (MarchStatus == 1 || MarchStatus == 2)) {
				Dashboard.Recall(MarchId, false);
			}
		}

		// kill currently building
		var qcon = Seed.queue_con["city" + cityId];
		if (qcon.length > 0) {
			var bldSlotId = qcon[0][7];
			var currLevel = parseIntNan(qcon[0][1]) - 1;
			t.removeConstruction(cityId, bldSlotId, currLevel);
		}

		// cancel market trades - TODO

	},

	cancelConstruction: function (cityId, q) {
		var t = Tabs.Build;
		var qcon = Seed.queue_con["city" + cityId];
		if (qcon.length > 0) {
			var bldSlotId = qcon[q][7];
			var currLevel = parseIntNan(qcon[q][1]) - 1;
			t.removeConstruction(cityId, bldSlotId, currLevel);
		}
	},

	removeConstruction: function (cityId, bldSlotId, currLevel) {
		var t = Tabs.Build;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.requestType = "CANCEL_CONSTRUCTION";
		params.cityId = cityId;
		params.buildingPosition = bldSlotId;
		if (Seed.buildings["city" + cityId]["pos" + bldSlotId]) {
			params.buildingId = Seed.buildings["city" + cityId]["pos" + bldSlotId][3];
		}
		else {
			params.buildingId = 0;
		}
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/cancelConstruction.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var tgtlv = parseInt(Seed.queue_con["city" + cityId][0][1]);
					var city_queue = Seed.queue_con["city" + cityId];
					for (var x in city_queue) {
						if (parseInt(city_queue[x][2]) == parseInt(params.buildingId)) {
							city_queue.splice(x, 1)
						}
					}
					if (currLevel == 0) {
						delete Seed.buildings["city" + cityId]["pos" + bldSlotId];
						for (var b = 0; b < Seed.queue_con["city" + cityId].length; b++) {
							if (parseInt(Seed.queue_con["city" + cityId][b][7]) == parseInt(bldSlotId)) {
								Seed.queue_con["city" + cityId].splice(b, 1);
								break;
							}
						}
					}

					bldLvl = Seed.buildings["city" + cityId]["pos" + bldSlotId][1];
					bdgType = Seed.buildings["city" + cityId]["pos" + bldSlotId][0];
					if (bldLvl > 0 && tgtlv != 0) {
						if (parseInt(bdgType) == 30) {
							var costs = CM.TowerModel.getCosts().slice(0);
							Seed.resources["city" + cityId].rec1[0] += parseInt(costs[1] / 2) * 3600;
							Seed.resources["city" + cityId].rec2[0] += parseInt(costs[2] / 2) * 3600;
							Seed.resources["city" + cityId].rec3[0] += parseInt(costs[3] / 2) * 3600;
							Seed.resources["city" + cityId].rec4[0] += parseInt(costs[4] / 2) * 3600;
						} else {
							if (parseInt(bdgType) == 31) {
								var costs = CM.RedoubtModel.getCosts().slice(0);
								Seed.resources["city" + cityId].rec1[0] += parseInt(costs[1] / 2) * 3600;
								Seed.resources["city" + cityId].rec2[0] += parseInt(costs[2] / 2) * 3600;
								Seed.resources["city" + cityId].rec3[0] += parseInt(costs[3] / 2) * 3600;
								Seed.resources["city" + cityId].rec4[0] += parseInt(costs[4] / 2) * 3600;
							} else {
								mult = Math.pow(2, (bldLvl - 1));
								Seed.resources["city" + cityId].rec1[0] += parseInt(uW.buildingcost["bdg" + bdgType][1]) * mult * 3600;
								Seed.resources["city" + cityId].rec2[0] += parseInt(uW.buildingcost["bdg" + bdgType][2]) * mult * 3600;
								Seed.resources["city" + cityId].rec3[0] += parseInt(uW.buildingcost["bdg" + bdgType][3]) * mult * 3600;
								Seed.resources["city" + cityId].rec4[0] += parseInt(uW.buildingcost["bdg" + bdgType][4]) * mult * 3600;
								Seed.citystats["city" + cityId].gold[0] += parseInt(uW.buildingcost["bdg" + bdgType][5]) * mult;
							}
						}
						if (uW.currentcityid == cityId) uW.update_gold();
					}
					if (uW.currentcityid == cityId) uW.update_bdg()
				}
			},
		}, true)
	},

	AscensionCallBack: function (cityId, faction) {
		var t = Tabs.Build;

		var citynum = Cities.byID[cityId].idx + 1;
		Options.BuildOptions.AscensionReady[citynum] = false; // allow stuff to happen again!
		saveOptions();

		var ToLevel = parseIntNan(Options.BuildOptions.AscendPresetLevel);
		var PN = parseIntNan(Options.BuildOptions.AscendPresets[faction]);
		if (PN == 0) return;
		if (!Options.BuildOptions.BuildPresets[PN]) return;

		var Preset = JSON2.parse(JSON2.stringify(Options.BuildOptions.BuildPresets[PN]));

		// clear existing building queue before applying new preset..
		delete t.BuildQueue[t.QueueKey(cityId)];
		for (var b in Preset) {
			var building = Preset[b];
			if (building && building != 0) {
				var bid = parseInt(building.split("bdg")[1]);
				var CurrLevel = 0;
				t.addToBuildQueue(cityId, b, bid, ToLevel, CurrLevel);
			}
		}

		t.SaveBuildQueue();
		t.PaintOverview();
		t.PaintCityInfo();
	},

	PaintAscendOptions: function () {
		var t = Tabs.Build;

		var Lessers = Seed.items.i33000 || 0;
		var Greaters = Seed.items.i33001 || 0;

		var m = '<table width=100% class=xtab><tr><td colspan=2>&nbsp;' + tx("Automatically ascend when city value is 100% and remaining protection is less than") + '&nbsp;<INPUT id=pbascendinterval type=text size=2 value="' + Options.BuildOptions.AscendTime + '"\> ' + tx("minutes") + '&nbsp;<INPUT id=pbResetAscend type=button class=btInput value="' + tx("Clear City States") + '"></td></tr>';
		m += '<tr><td width=100>&nbsp;' + tx("Automatically use Ascension Crystals when city value is not 100%") + '</td><td><input type=checkbox id=pbascendlesser ' + (Options.BuildOptions.UseLesserCrystals ? 'CHECKED' : '') + '>&nbsp;' + uW.itemlist['i33000'].name + ' (' + Lessers + ')</td></tr>';
		m += '<tr><td>&nbsp;</td><td><input type=checkbox id=pbascendgreater ' + (Options.BuildOptions.UseGreaterCrystals ? 'CHECKED' : '') + '>&nbsp;' + uW.itemlist['i33001'].name + ' (' + Greaters + ')</td></tr>';
		m += '<tr><td colspan=2>&nbsp;' + tx("Default faction for unascended cities") + ':&nbsp;' + htmlSelector({ 1: uW.g_js_strings.commonstr.druid, 2: uW.g_js_strings.commonstr.fey, 3: uW.g_js_strings.commonstr.briton }, Options.BuildOptions.AscendFaction, 'id=btBldAscendFaction') + '</td></tr>';
		m += '<tr><td colspan=2>&nbsp;' + tx('Re-queue buildings to level') + '&nbsp;<select id=btBldAscendAllTo></select>&nbsp;' + tx('using preferred building layout selected below') + ':-</td></tr>';
		m += '<tr><td colspan=2 align=center><table cellpadding=5 cellspacing=0><tr><th colspan=3 align=center><b>' + tx('Preferred Building Layouts') + '</b></th></tr><tr>';
		for (var a = 1; a <= 3; a++) {
			m += '<th class=xtabHD width=33% align=center><b>' + getFactionName(a) + '</b></th>'
		}
		m += '</tr><tr>';
		for (var a = 1; a <= 3; a++) {
			m += '<td align=center><SELECT class="' + a + '" style="width:190px;" id="btAscendPreset_' + a + '"></td>';
		}
		m += '</tr><tr><td colspan=3>&nbsp;</td></tr><tr><th colspan=3 align=center><b>' + tx('Preferred Minor Blessings') + '</b></th></tr><tr>';
		for (var a = 1; a <= 3; a++) {
			m += '<th class=xtabHD width=33% align=center><b>' + getFactionName(a) + '</b></th>'
		}
		m += '</tr><tr>';
		for (var a = 1; a <= 3; a++) {
			var blessings = CM.BlessingSystemModel.getBlessingGroup().minor.blessing[a];
			var blesslist = { 0: "-- " + tx('Select Blessing') + " --" };
			for (var bb = 0; bb < blessings.length; bb++) {
				blesslist[blessings[bb]] = uW.g_js_strings.blessingSystem['blessing_name_' + blessings[bb]];
			}
			m += '<td>';
			var MaxLevel = CM.PrestigeModel.getLevelCapSoft(a);
			var Maj = Math.ceil(MaxLevel / 3);
			var Min = MaxLevel - Maj;
			for (var b = 1; b <= Min; b++) {
				m += htmlSelector(blesslist, Options.BuildOptions.AscendBlessings[a][b], 'id=btAscendBlessing_' + a + '_' + b + ' class="' + a + '_' + b + '"') + '<br>';
			}
			m += '</td>';
		}
		m += '</tr></table>';
		m += '</td></tr></table><br>';

		ById('btBldAscend').innerHTML = m;

		ToggleOption('BuildOptions', 'pbascendlesser', 'UseLesserCrystals');
		ToggleOption('BuildOptions', 'pbascendgreater', 'UseGreaterCrystals');

		ById('pbResetAscend').addEventListener('click', t.resetCityStates, false);

		ById('pbascendinterval').addEventListener('change', function (e) {
			Options.BuildOptions.AscendTime = parseIntNan(this.value);
			if (Options.BuildOptions.AscendTime == 0) {
				Options.BuildOptions.AscendTime = 1;
				this.value = Options.BuildOptions.AscendTime;
			}
			saveOptions();
		}, false);

		ById('btBldAscendFaction').addEventListener('change', function (e) {
			Options.BuildOptions.AscendFaction = parseIntNan(this.value);
			saveOptions();
		}, false);

		ById('btBldAscendAllTo').addEventListener('change', function (e) {
			Options.BuildOptions.AscendPresetLevel = parseIntNan(this.value.substr(5));
			saveOptions();
		}, false);

		for (var a = 1; a <= 3; a++) {
			ById('btAscendPreset_' + a).addEventListener('change', function (e) {
				Options.BuildOptions.AscendPresets[e.target['className']] = this.value;
				saveOptions();
			}, false);

			var MaxLevel = CM.PrestigeModel.getLevelCapSoft(a);
			var Maj = Math.ceil(MaxLevel / 3);
			var Min = MaxLevel - Maj;
			for (var b = 1; b <= Min; b++) {
				ById('btAscendBlessing_' + a + '_' + b).addEventListener('change', function (e) {
					var elems = e.target['className'].split('_');
					Options.BuildOptions.AscendBlessings[elems[0]][elems[1]] = this.value;
					saveOptions();
				}, false);
			}
		}
	},

	resetCityStates: function () {
		var t = Tabs.Build;
		for (var i = 1; i <= Cities.numCities; i++) {
			Options.BuildOptions.AscensionReady[i] = false;
		}
		saveOptions();
	},

	LoadAscensionPresets: function (sel, faction) {
		var t = Tabs.Build;
		ById(sel).options.length = 0;
		var o = document.createElement("option");
		o.text = "-- " + tx('Select Layout') + " --"
		o.value = 0;
		ById(sel).options.add(o);
		for (var y in Options.BuildOptions.BuildPresetNames) {
			if (Options.BuildOptions.BuildPresetTypes[y] == faction) {
				var o = document.createElement("option");
				o.text = Options.BuildOptions.BuildPresetNames[y];
				o.value = y;
				ById(sel).options.add(o);
			}
		}
		if (Options.BuildOptions.AscendPresets[faction] != 0) {
			ById(sel).value = Options.BuildOptions.AscendPresets[faction];
		}
	},

}
