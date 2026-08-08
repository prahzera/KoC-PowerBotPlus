/** Training Tab **/

Tabs.Train = {
	tabLabel: 'Train',
	tabOrder: 2000,
	tabColor: 'brown',
	myDiv: null,
	timer: null,
	LoopCounter: 0,
	TroopTotal: 0,
	ModelCity: null,
	ModelCityId: 0,
	serverwait: false,
	MaxTroopTrain: 0,
	isBusy: false,
	TrainCityId: 0,
	QueLength: 0,
	Lancelots: 0,
	Arthurs: 0,
	Merlins: 0,
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
	TuteList: [36, 37, 38],
	TuteTrans: ["LT", "AT", "MT"],
	gamble: {
		"1": {
			"min": "5",
			"max": "15",
			"cost": "2",
			"factor1": 0.85,
			"factor2": 0.95,
		},
		"2": {
			"min": "10",
			"max": "25",
			"cost": "4",
			"factor1": 0.75,
			"factor2": 0.9,
		}
	},
	limitingFactor: null,
	Queued: 0,
	QueuedAscension: 0,
	TotalSlots: 0,
	TotalSlotsAscension: 0,
	intervalSecs: 5,
	autodelay: 0,
	speedupused: false,
	Options: {
		ManualWorkers: true,
		Running: false,
		ThroneCheck: false,
		TrainingSpeed: 0,
		StoneGuardian: false,
		Enabled: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		PrimaryTroops: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		PrimaryMin: { 1: 500, 2: 500, 3: 500, 4: 500, 5: 500, 6: 500, 7: 500, 8: 500 },
		PrimarySelectMax: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		PrimaryMax: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		PrimaryLimit: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		ReduceLimit: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		SecondaryEnabled: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		SecondaryTroops: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		SecondaryMin: { 1: 500, 2: 500, 3: 500, 4: 500, 5: 500, 6: 500, 7: 500, 8: 500 },
		SecondarySelectMax: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		SecondaryMax: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		AscensionEnabled: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		AscensionTroops: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		AscensionMin: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		AscensionSelectMax: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		AscensionMax: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		Gamble: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		Workers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		Keep: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
		Resources: {
			1: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
			2: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
			3: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
			4: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
			5: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
			6: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
			7: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
			8: { Food: 0, Wood: 0, Stone: 0, Ore: 0 },
		},
		DismissRunning: false,
		AutoDismiss: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		AutoFertileWinds: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissMM: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissST: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissSC: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissPK: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissSW: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissAR: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissOther: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DismissOtherType: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		KeepOther: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		KeepMM: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		KeepST: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		KeepSC: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		KeepPK: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		KeepSW: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		KeepAR: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		Toggle: false,
		UseLT: false,
		UseAT: false,
		UseMT: false,
		LTLimitHours: 3,
		ATLimitHours: 5,
		MTLimitHours: 7,
		LTLimitMinutes: 0,
		ATLimitMinutes: 0,
		MTLimitMinutes: 0,
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
	},

	init: function (div) {
		var t = Tabs.Train;
		t.myDiv = div;

		if (!Options.TrainOptions) {
			Options.TrainOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.TrainOptions.hasOwnProperty(y)) {
					Options.TrainOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('cancelTrain', Tabs.Train.cancelTrain);
		uWExportFunction('btTrnCancelAll', Tabs.Train.cancelAll);
		uWExportFunction('speedupTraining', Tabs.Train.speedupTraining);

		if (Options.TrainOptions.Toggle) AddSubTabLink('AutoTrain', t.toggleAutoTrainState, 'TrainToggleTab');
		SetToggleButtonState('Train', Options.TrainOptions.Running, 'Train');

		var m = '<DIV class=divHeader align=center>' + tx('TROOP TRAINING AND POPULATION CONTROL') + '</div>';
		m += '<div align="center">';

		m += '<table width=100% height=0% class=xtab><tr><td width=30%><INPUT id=btTrainToggle type=checkbox />&nbsp;' + tx("Add toggle button") + '</td><td colspan=2 align=center><INPUT id=btAutoTrainState type=submit value="' + tx("AutoTrain") + ' = ' + (Options.TrainOptions.Running ? 'ON' : 'OFF') + '">&nbsp;<INPUT id=btAutoDismissState type=submit value="' + tx("AutoPopulate") + ' = ' + (Options.TrainOptions.DismissRunning ? 'ON' : 'OFF') + '"></td><td width=30% align=right>' + tx('Current Training Speed') + ':&nbsp;<span id=btTrnCurrTR></span>&nbsp;&nbsp;</td></tr>'
		m += '<tr><td colspan=2 align=left><INPUT id=btTrnTR type=checkbox > ' + tx('Only train when training speed is at least') + ' <INPUT id=btTrnTRSpeed type=text size=3 maxlength=4 value="' + Options.TrainOptions.TrainingSpeed + '">&nbsp;%</td>';
		m += '<td colspan=2 align=right><INPUT id=btTrnGuard type=checkbox > ' + tx('Only train when Stone Guardian active') + '&nbsp;&nbsp;</td></tr></table>';

		m += '<br><DIV id=btTrnOverviewDiv style="width:' + GlobalOptions.btWinSize.x + 'px;overflow-x:auto;">';

		m += '<TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:' + Options.OverviewOptions.OverviewFontSize + 'px;"><TR valign=bottom><td width=20>&nbsp;</td><td align=right width=100><b>&nbsp;</b></td>';

		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><span id="btTrnCity_' + i + '"><B>' + Cities.cities[i - 1].name.substring(0, 12) + '</b></span></td>';
		}
		m += "<td>&nbsp;</td>"; // spacer
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 style="padding-left: 0px;"><B>' + tx('Auto-Train') + '&nbsp;</B></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btTrnAutoCity_' + i + '" type=checkbox ' + (Options.TrainOptions.Enabled[i] ? 'CHECKED' : '') + '></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 style="padding-left: 0px;"><B>' + tx('Training Queue') + '&nbsp;</B></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder><span id="btTrnQueueCity_' + i + '">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 style="padding-left: 0px;"><B>' + tx('Asc. Training Queue') + '&nbsp;</B></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder><span id="btTrnAscQueueCity_' + i + '">&nbsp;</span></div></td>';
		}

		m += '</tr><TR align=right class="evenRow"><TD colspan=2 style="padding-left: 0px;"><B>' + tx('Available Population') + '&nbsp;</B></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder style="height:20px;"><a id="btTrnWindsLinkCity_' + i + '"><img class=' + i + ' id="btTrnWindsCity_' + i + '" style="float:left;vertical-align:middle;" width=20 src="' + getItemImageURL(351) + '" title="' + itemTitle(351) + '"></a><span style="line-height:20px;" id="btTrnIdlePopCity_' + i + '">&nbsp;</span></div></td>';
		}
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 style="padding-left: 0px;"><B>' + tx('Auto-Fertilize') + '&nbsp;</B></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btFerAutoCity_' + i + '" type=checkbox ' + (Options.TrainOptions.AutoFertileWinds[i] ? 'CHECKED' : '') + '></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 style="padding-left: 0px;"><B>' + tx('Auto-Dismiss') + '&nbsp;</B></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btDisAutoCity_' + i + '" type=checkbox ' + (Options.TrainOptions.AutoDismiss[i] ? 'CHECKED' : '') + '></div></td>';
		}

		m += '</tr></table></div></div>';

		m += '<a id=btTrnSpeedupLink class=divLink><div class="divHeader" align="left"><img id=btTrnSpeedupArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('AUTO-SPEEDUP SETTINGS') + '</div></a>';
		m += '<div id=btTrnSpeedup class=divHide><table width=100% class=xtab><tr><td><div align=center>';

		var Boosts = '<table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td colspan=4><b>' + tx('Tuteleges') + ':</b></td></tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.TuteList.length; i++) {
			Boosts += '<td width=30 rowspan=2><img height=28 src="' + IMGURL + 'items/70/' + t.TuteList[i] + '.jpg" title="' + itemTitle(t.TuteList[i], true) + '" /></td><td>(<span id=pbtrainUse' + t.TuteTrans[i] + 'Label>' + parseIntNan(uW.ksoItems[t.TuteList[i]].count) + '</span>)</td>';
		}
		Boosts += '<td width=70 rowspan=2 align=right><INPUT id=pbTrainHelp type=submit value="' + tx('HELP') + '!"></td>';
		Boosts += '</tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.TuteList.length; i++) {
			Boosts += '<td><input type=checkbox id="pbtrain' + t.TuteTrans[i] + '" ' + (Options.TrainOptions["Use" + t.TuteTrans[i]] ? "CHECKED" : "") + '></td>';
		}
		Boosts += '</tr><tr>';
		for (var i = 0; i < t.TuteList.length; i++) {
			Boosts += '<td align=right>' + uW.g_js_strings.commonstr.time + ':</td><td><INPUT class=btInput id="pbminhr' + t.TuteTrans[i] + '" type=text size=1 maxlength=2 value="' + Options.TrainOptions[t.TuteTrans[i] + "LimitHours"] + '"\>&nbsp;' + uW.g_js_strings.timestr.timehr + '&nbsp;<INPUT class=btInput id="pbminmn' + t.TuteTrans[i] + '" type=text size=1 maxlength=2 value="' + Options.TrainOptions[t.TuteTrans[i] + "LimitMinutes"] + '"\>&nbsp;' + uW.g_js_strings.timestr.timemin + '</td>';
		}
		Boosts += '</tr></table><br>';
		Boosts += '<table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td colspan=4><b>' + tx('Hourglasses') + ':</b></td></tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td width=30 rowspan=2><img height=28 src="' + IMGURL + 'items/70/' + t.ItemList[i] + '.jpg" title="' + itemTitle(t.ItemList[i], true) + '\n' + tx(HourGlassHint[t.ItemList[i] - 1]) + '" /></td><td>(<span id=pbtrainUse' + t.ItemTrans[i] + 'Label>' + parseIntNan(uW.ksoItems[t.ItemList[i]].count) + '</span>)</td>';
		}
		Boosts += '</tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td><input type=checkbox id="pbtrain' + t.ItemTrans[i] + '" ' + (Options.TrainOptions["Use" + t.ItemTrans[i]] ? "CHECKED" : "") + '></td>';
		}
		Boosts += '</tr></table></td></tr>';
		Boosts += '<tr><td><div align=center><table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td><input type=checkbox id=pbtrainOV >' + tx('Override hourglass rules by always using') + ' ' + htmlSelector(HourGlassName, Options.TrainOptions.OverrideItem, 'id=pbtrainOVItem') + ' ' + tx('when more than') + ' ';
		Boosts += '<INPUT style="width: 30px;text-align:right;" id="pbtrainOVHours" type=text maxlength=4 >&nbsp;' + uW.g_js_strings.timestr.timehr + '&nbsp;<INPUT style="width: 30px;text-align:right;" id="pbtrainOVMinutes" type=text maxlength=4 >&nbsp;' + uW.g_js_strings.timestr.timemin + ' ' + tx('remaining') + '.</td></tr></table></div></td></tr>';

		m += Boosts + '</table></div></div>';

		m += '<HR><br><DIV style="text-align:center; margin-bottom:5px;">' + uW.g_js_strings.commonstr.city + ':&nbsp;<span id=pttraincity></span></div>';

		m += '<a id=btTrnOptionLink class=divLink><div class="divHeader" align="left"><img id=btTrnOptionArrow height="10" src="' + DownArrow + '">&nbsp;' + tx('TRAIN TROOPS') + '</div></a>';
		m += '<div id=btTrnOption>';

		m += '<TABLE align=center cellpadding=0 cellspacing=0 class=xtab width=98%><TR><TD valign=top width=49%>';
		m += '<TABLE class=xtab><tr><td colspan=3>&nbsp;</td></tr><tr><TD align=right>' + tx(uW.g_js_strings.openCastle.trooptype) + ':&nbsp;</td><TD colspan=2>';
		m += '<SELECT id=btTrnType>';
		for (var ui in CM.UNIT_TYPES) {
			var u = CM.UNIT_TYPES[ui];
			if (!CM.BarracksUnitsTypeMap.isUnitType(u, "rare")) {
				m += '<option value=' + u + '>' + uW.unitcost["unt" + u][0] + '</option>';
			}
		}
		m += '</select></td></tr><tr><td>&nbsp;</td><td colspan=2>(<span id=btTrnMax>&nbsp;</span>)</td></tr>';
		m += '<TR><TD align=right>' + tx('Number to train') + ':&nbsp;</td><TD><INPUT id=btTrnNumPerSlot size=5 type=text value=0\></td>';
		m += '<TD><a id=btTrnMaxPerSlotButton class="inlineButton btButton brown8"><span>Max</span></a>&nbsp;(' + uW.g_js_strings.commonstr.max;
		m += ':&nbsp;<span id=btTrnMaxPerSlot>0</span>)</td></tr>';
		m += '<TR><TD align=right>' + tx('Number of slots to use') + ':&nbsp;</td>';
		m += '<TD><INPUT id=btTrnNumSlots size=2 type=text value=1\></td>';
		m += '<TD><a id=btTrnMaxSlotsButton class="inlineButton btButton brown8"><span>Max</span></a>&nbsp;(' + uW.g_js_strings.commonstr.max;
		m += ':&nbsp;<span id=btTrnMaxSlots>0</span>)</td></tr>';
		m += '<TR><td align=right>' + tx('Use Workforce') + ':&nbsp;</td><TD colspan=2><INPUT type=checkbox id=btTrnUseWorkers ' + (Options.TrainOptions.ManualWorkers ? 'CHECKED' : '') + '></td></tr>';
		m += '<tr><td align=right>' + tx('Gamble') + ':&nbsp;</td><td colspan=2><SELECT id=btTrnGamble>\
			<option value=0><CENTER>-- '+ uW.g_js_strings.commonstr.select + ' --</center></option>\
			<option value=1>'+ tx('Use') + ' ' + t.gamble[1].cost + 'x ' + tx('resources') + ' (' + t.gamble[1].min + ' - ' + t.gamble[1].max + '% ' + tx('faster') + ')</option>\
			<option value=2>'+ tx('Use') + ' ' + t.gamble[2].cost + 'x ' + tx('resources') + ' (' + t.gamble[2].min + ' - ' + t.gamble[2].max + '% ' + tx('faster') + ')</option>\
			</select></td></tr>';
		m += '<tr><td>&nbsp;</td><td colspan=2><a id=btTrnButton class="inlineButton btButton blue14"><span id=btTrnButtonLabel style="width:100px;display:inline-block;text-align:center;">' + uW.g_js_strings.modal_openBarracks.trainttl + '</span></a></td></tr></table>';
		m += '</TD><TD valign=top width=49%><TABLE class=xtab><tr><td><b>' + uW.g_js_strings.commonstr.requirements + ':-</b></td></tr>';
		m += '<tr><td valign=top id="btTrnRequirements">&nbsp;</td></tr>';
		m += '</table>';

		m += '</td></tr><tr><td colspan=2><div id=btTrnMessages align=center>&nbsp;</div></td></tr></table></div>';

		m += '<a id=btTrnAutoLink class=divLink><div class="divHeader" align="left"><img id=btTrnAutoArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('AUTO-TRAIN SETTINGS') + '</div></a>';
		m += '<div id=btTrnAuto class=divHide></div>';

		m += '<a id=btDisAutoLink class=divLink><div class="divHeader" align="left"><img id=btDisAutoArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('AUTO-DISMISS SETTINGS') + '</div></a>';
		m += '<div id=btDisAuto class=divHide></div>';

		m += '<a id=btTrnQueueLink class=divLink><div class="divHeader" align="left"><table cellpadding=0 cellspacing=0 width=100%><tr><td class=xtab><img id=btTrnQueueArrow height="10" src="' + DownArrow + '">&nbsp;' + tx('TRAINING QUEUES') + '</td><td class=xtab align=right id=btTrnQueueStats>&nbsp;</td></tr></table></div></a>';
		m += '<div id=btTrnQueue style="max-height:200px;overflow-y:scroll;"></div><br>';

		div.innerHTML = m;

		t.ModelCity = new CdispCityPicker('pttrain', ById('pttraincity'), true, t.clickCitySelect, null);

		ToggleOption('TrainOptions', 'btTrainToggle', 'Toggle');

		ById('btTrnOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Training", 100, GlobalOptions.btWinSize.x, "btTrnOption", false) }, false);
		ById('btTrnAutoLink').addEventListener('click', function () { ToggleMainDivDisplay("Training", 100, GlobalOptions.btWinSize.x, "btTrnAuto", false) }, false);
		ById('btDisAutoLink').addEventListener('click', function () { ToggleMainDivDisplay("Training", 100, GlobalOptions.btWinSize.x, "btDisAuto", false) }, false);
		ById('btTrnQueueLink').addEventListener('click', function () { ToggleMainDivDisplay("Training", 100, GlobalOptions.btWinSize.x, "btTrnQueue", false) }, false);
		ById('btTrnSpeedupLink').addEventListener('click', function () { ToggleMainDivDisplay("Training", 100, GlobalOptions.btWinSize.x, "btTrnSpeedup", false) }, false);

		ById('btTrnType').addEventListener('change', t.PaintCityInfo, false);
		ById('btTrnGamble').addEventListener('change', t.PaintCityInfo, false);

		ById('btTrnMaxPerSlotButton').addEventListener('click', function () {
			var slots = Math.max(parseIntNan(ById('btTrnNumSlots').value), 0);
			ById('btTrnNumPerSlot').value = parseIntNan(t.MaxTroopTrain / slots);
			t.paintRequirements(ById('btTrnType').value);
		}, false);

		ById('btTrnNumPerSlot').addEventListener('change', function () {
			t.paintRequirements(ById('btTrnType').value);
		}, false);

		ById('btTrnNumSlots').addEventListener('change', function () {
			var slots = Math.max(parseIntNan(ById('btTrnNumSlots').value), 0);
			if (slots < 1) { slots = 1; }
			var MaxSlots = t.TotalSlots - t.Queued;
			if (!CM.BarracksUnitsTypeMap.isUnitType(ById('btTrnType').value, "normal")) { MaxSlots = t.TotalSlotsAscension - t.QueuedAscension; }
			if (slots > MaxSlots) { slots = MaxSlots; }
			ById('btTrnNumSlots').value = slots;
			ById('btTrnMaxPerSlot').innerHTML = parseIntNan(t.MaxTroopTrain / slots);
		}, false);

		ById('btTrnMaxSlotsButton').addEventListener('click', function () {
			var MaxSlots = t.TotalSlots - t.Queued;
			if (!CM.BarracksUnitsTypeMap.isUnitType(ById('btTrnType').value, "normal")) { MaxSlots = t.TotalSlotsAscension - t.QueuedAscension; }
			ById('btTrnNumSlots').value = Math.max(MaxSlots, 0);
			var slots = Math.max(parseIntNan(ById('btTrnNumSlots').value), 0);
			ById('btTrnMaxPerSlot').innerHTML = parseIntNan(t.MaxTroopTrain / slots);
		}, false);

		ById('btTrnUseWorkers').addEventListener('click', t.clickCheckUseWorkers, false);
		ById('btTrnButton').addEventListener('click', t.setTraining, false);

		for (var i = 1; i <= Cities.numCities; i++) {
			ById('btTrnAutoCity_' + i).addEventListener('click', function (e) {
				var citynum = e.target['className'];
				Options.TrainOptions.Enabled[citynum] = e.target.checked;
				if (Options.TrainOptions.Enabled[citynum]) {
					t.timer = setTimeout(function () { t.doAutoLoop(Number(citynum)); }, 0);
				}
				saveOptions();
			}, false);
			ById('btDisAutoCity_' + i).addEventListener('click', function (e) {
				var citynum = e.target['className'];
				Options.TrainOptions.AutoDismiss[citynum] = e.target.checked;
				if (Options.TrainOptions.AutoDismiss[citynum]) {
					t.timer = setTimeout(function () { t.doAutoLoop(Number(citynum)); }, 0);
				}
				saveOptions();
			}, false);
			ById('btFerAutoCity_' + i).addEventListener('click', function (e) {
				var citynum = e.target['className'];
				Options.TrainOptions.AutoFertileWinds[citynum] = e.target.checked;
				if (Options.TrainOptions.AutoFertileWinds[citynum]) {
					t.timer = setTimeout(function () { t.doAutoLoop(Number(citynum)); }, 0);
				}
				saveOptions();
			}, false);
			ById('btTrnWindsCity_' + i).addEventListener('click', function (e) {
				var citynum = e.target['className'];
				t.Fertilize(Cities.cities[citynum - 1].id);
			}, false);
		}

		ById('btAutoTrainState').addEventListener('click', function () {
			t.toggleAutoTrainState(this);
		}, false);
		ById('btAutoDismissState').addEventListener('click', function () {
			t.toggleAutoDismissState(this);
		}, false);

		ToggleOption('TrainOptions', 'btTrnTR', 'ThroneCheck');
		ChangeIntegerOption('TrainOptions', 'btTrnTRSpeed', 'TrainingSpeed');

		ToggleOption('TrainOptions', 'btTrnGuard', 'StoneGuardian');

		ToggleOption('TrainOptions', 'pbtrainSH', 'UseSH');
		ToggleOption('TrainOptions', 'pbtrainKH', 'UseKH');
		ToggleOption('TrainOptions', 'pbtrainGH', 'UseGH');
		ToggleOption('TrainOptions', 'pbtrainMH', 'UseMH');
		ToggleOption('TrainOptions', 'pbtrainAH', 'UseAH');
		ToggleOption('TrainOptions', 'pbtrainRH', 'UseRH');
		ToggleOption('TrainOptions', 'pbtrainDH', 'UseDH');
		ToggleOption('TrainOptions', 'pbtrainEH', 'UseEH');
		ToggleOption('TrainOptions', 'pbtrainLH', 'UseLH');
		ToggleOption('TrainOptions', 'pbtrainOV', 'UseOverride');

		ChangeIntegerOption('TrainOptions', 'pbtrainOVItem', 'OverrideItem');
		ChangeIntegerOption('TrainOptions', 'pbtrainOVHours', 'OverrideHours');
		ChangeIntegerOption('TrainOptions', 'pbtrainOVMinutes', 'OverrideMinutes');

		ToggleOption('TrainOptions', 'pbtrainLT', 'UseLT');
		ToggleOption('TrainOptions', 'pbtrainAT', 'UseAT');
		ToggleOption('TrainOptions', 'pbtrainMT', 'UseMT');

		ChangeIntegerOption('TrainOptions', 'pbminhrLT', 'LTLimitHours');
		ChangeIntegerOption('TrainOptions', 'pbminmnLT', 'LTLimitMinutes');
		ChangeIntegerOption('TrainOptions', 'pbminhrAT', 'ATLimitHours');
		ChangeIntegerOption('TrainOptions', 'pbminmnAT', 'ATLimitMinutes');
		ChangeIntegerOption('TrainOptions', 'pbminhrMT', 'MTLimitHours');
		ChangeIntegerOption('TrainOptions', 'pbminmnMT', 'MTLimitMinutes');

		ById('pbTrainHelp').addEventListener('click', t.helpPop, false);

		// start autotrain loop timer to start in 20 seconds...

		if (Options.TrainOptions.Running || Options.TrainOptions.DismissRunning) {
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, (20 * 1000));
		}
	},

	helpPop: function () {
		var t = Tabs.Train;
		var helpText = '<br>' + tx("Using Speedups for Troop Training");
		helpText += '<p>' + tx('Tuteleges will take priority over hourglasses if selected, and the training time remaining is greater than the specified minimum time for the tutelege') + '.</p>';
		helpText += '<p>' + tx("The priority order for tuteleges is Merlin's (70% reduction), Arthur's (50% reduction), and then Lancelot's (30% reduction)") + '.</p>';
		helpText += '<p>' + tx('If no tuteleges can be used, hourglasses will be used in the following order if they are selected, and the required criteria is met') + ' :-</p>';
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

		var pop = new CPopup('BotHelp', 0, 0, 460, 420, true);
		pop.centerMe(mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>' + tx("PowerBot+ Help") + ': ' + tx("Speedups") + '</b></center>';
		pop.show(true);
	},

	toggleAutoTrainState: function (obj) {
		var t = Tabs.Train;
		obj = ById('btAutoTrainState');
		if (Options.TrainOptions.Running == true) {
			Options.TrainOptions.Running = false;
			obj.value = tx("AutoTrain = OFF");
		}
		else {
			Options.TrainOptions.Running = true;
			obj.value = tx("AutoTrain = ON");
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, 0);
		}
		saveOptions();
		SetToggleButtonState('Train', Options.TrainOptions.Running, 'Train');
		t.PaintOverview();
	},

	toggleAutoDismissState: function (obj) {
		var t = Tabs.Train;
		if (Options.TrainOptions.DismissRunning == true) {
			Options.TrainOptions.DismissRunning = false;
			obj.value = tx("AutoPopulate = OFF");
		}
		else {
			Options.TrainOptions.DismissRunning = true;
			obj.value = tx("AutoPopulate = ON");
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, 0);
		}
		saveOptions();
		t.PaintOverview();
	},

	show: function (init) {
		var t = Tabs.Train;
		var DispCityId = uW.currentcityid;
		if (init) { DispCityId = InitialCityId; }
		if (t.ModelCityId != DispCityId) {
			t.ModelCity.selectBut(Cities.byID[DispCityId].idx);
		}
		t.PaintOverview();
		t.UpdateTrainingOptions();
		t.PaintCityInfo();
	},

	EverySecond: function () {
		var t = Tabs.Train;

		if (tabManager.currentTab.name == 'Train' && Options.btWinIsOpen) {
			t.LoopCounter = t.LoopCounter + 1;

			if (t.LoopCounter % 2 == 0) { // refresh queue display every 2 seconds
				t.PaintCityInfo();
			}

			if (t.LoopCounter >= 6) { // refresh overview display every 6 seconds
				t.LoopCounter = 0;
				t.PaintOverview();
			}
		}
	},

	clickCheckUseWorkers: function () {
		var t = Tabs.Train;
		Options.TrainOptions.ManualWorkers = (ById('btTrnUseWorkers').checked);
		saveOptions();
		t.PaintCityInfo();
	},

	clickCitySelect: function (city) {
		var t = Tabs.Train;
		t.ModelCityId = city.id;
		t.LastQueue = 'x';
		t.UpdateTrainingOptions();
		t.PaintCityInfo();
	},

	setTraining: function () {
		var t = Tabs.Train;

		if (t.isBusy) {
			t.isBusy = false;
			ById('btTrnMessages').innerHTML = '<span style="color:#800;">' + tx('Cancelled') + '!</span>';
			ById('btTrnButtonLabel').innerHTML = uW.g_js_strings.modal_openBarracks.trainttl;
			jQuery('#btTrnButton').removeClass("red14");
			jQuery('#btTrnButton').addClass("blue14");
			return;
		}

		t.TrainCityId = t.ModelCityId;
		var unitId = ById('btTrnType').value;
		var perSlot = parseIntNan(ById('btTrnNumPerSlot').value);
		var numSlots = parseIntNan(ById('btTrnNumSlots').value);
		var gamble = ById('btTrnGamble').value;
		var tut = 0;

		if (perSlot < 1) { return; }
		if (numSlots < 1) { return; }

		if (perSlot * numSlots > t.MaxTroopTrain) {
			ById('btTrnMessages').innerHTML = '<span style="color:#800;">' + uW.g_js_strings.modal_attack.maxtroops + ': ' + t.MaxTroopTrain + '</span>';
			return;
		}

		var MaxSlots = t.TotalSlots - t.Queued;
		if (!CM.BarracksUnitsTypeMap.isUnitType(ById('btTrnType').value, "normal")) { MaxSlots = t.TotalSlotsAscension - t.QueuedAscension; }
		if (numSlots > MaxSlots) {
			ById('btTrnMessages').innerHTML = '<span style="color:#800;">' + tx('Maximum number of slots exceeded') + '!</span>';
			return;
		}

		var que = [];
		for (var i = 0; i < numSlots; i++) {
			que.push(['T', unitId, perSlot, gamble, tut]);
		}
		t.QueLength = que.length;
		t.isBusy = true;
		ById('btTrnButtonLabel').innerHTML = uW.g_js_strings.commonstr.cancel;
		jQuery('#btTrnButton').addClass("red14");
		jQuery('#btTrnButton').removeClass("blue14");
		t.nextqueue(que);
	},

	nextqueue: function (que) {
		var t = Tabs.Train;
		if (!t.isBusy) { return; }

		var cmd = que.shift();

		if (cmd[0] == 'T') {
			if (t.QueLength == 1) {
				ById('btTrnMessages').innerHTML = tx('Training') + ' ' + cmd[2] + ' ' + uW.unitcost['unt' + cmd[1]][0] + ' ' + tx('at') + ' ' + Cities.byID[t.TrainCityId].name;
			}
			else {
				ById('btTrnMessages').innerHTML = tx('Training') + ' ' + cmd[2] + ' ' + uW.unitcost['unt' + cmd[1]][0] + ' ' + tx('at') + ' ' + Cities.byID[t.TrainCityId].name + ' (' + tx('Slot') + ' ' + parseIntNan(t.QueLength - que.length) + ' ' + uW.g_js_strings.commonstr.of + ' ' + t.QueLength + ')';
			}
			t.Train(t.TrainCityId, cmd[4], cmd[3], cmd[1], cmd[2], function (rslt) {
				if (rslt.ok) {
					if (parseIntNan(que.length) == 0) {
						ById('btTrnMessages').innerHTML = tx('Completed') + '!';
						ById('btTrnButtonLabel').innerHTML = uW.g_js_strings.modal_openBarracks.trainttl;
						jQuery('#btTrnButton').removeClass("red14");
						jQuery('#btTrnButton').addClass("blue14");
						t.isBusy = false;
						return;
					}
					setTimeout(function () { t.nextqueue(que) }, 2000);
				}
				else {
					if (rslt.msg) {
						ById('btTrnMessages').innerHTML = '<span style="color:#800;">' + rslt.msg + '</span>';
					}
					else {
						ById('btTrnMessages').innerHTML = '<span style="color:#800;">' + tx('Error training troops') + ' (' + rslt.error_code + ')</span>';
					}
					ById('btTrnButtonLabel').innerHTML = uW.g_js_strings.modal_openBarracks.trainttl;
					jQuery('#btTrnButton').removeClass("red14");
					jQuery('#btTrnButton').addClass("blue14");
					t.isBusy = false;
					return;
				}
			});
		}
	},

	getMaxTrain: function (unitId, cityId, ignoreRes, workforce, gamble, auto) {
		var t = Tabs.Train;
		var numberToTrain = 0;
		t.limitingFactor = null;
		var citynum = Cities.byID[cityId].idx + 1;

		if (unitId == 0) { return numberToTrain; }

		var food = parseIntNan(Seed.resources['city' + cityId].rec1[0] / 3600);
		var wood = parseIntNan(Seed.resources['city' + cityId].rec2[0] / 3600);
		var stone = parseIntNan(Seed.resources['city' + cityId].rec3[0] / 3600);
		var ore = parseIntNan(Seed.resources['city' + cityId].rec4[0] / 3600);

		// change these numbers for auto...
		var foodRes = 0;
		var woodRes = 0;
		var stoneRes = 0;
		var oreRes = 0;
		if (auto && Options.TrainOptions.Keep[citynum]) {
			foodRes = parseIntNan(Options.TrainOptions.Resources[citynum]["Food"]);
			woodRes = parseIntNan(Options.TrainOptions.Resources[citynum]["Wood"]);
			stoneRes = parseIntNan(Options.TrainOptions.Resources[citynum]["Stone"]);
			oreRes = parseIntNan(Options.TrainOptions.Resources[citynum]["Ore"]);
		}

		var availFood = food - foodRes;
		var availWood = wood - woodRes;
		var availStone = stone - stoneRes;
		var availOre = ore - oreRes;

		if (auto && !Options.TrainOptions.Keep[citynum]) {
			if (parseIntNan(Options.TrainOptions.Resources[citynum]["Food"]) != 0) {
				availFood = parseIntNan(Options.TrainOptions.Resources[citynum]["Food"])
			}
			if (parseIntNan(Options.TrainOptions.Resources[citynum]["Wood"]) != 0) {
				availWood = parseIntNan(Options.TrainOptions.Resources[citynum]["Wood"])
			}
			if (parseIntNan(Options.TrainOptions.Resources[citynum]["Stone"]) != 0) {
				availStone = parseIntNan(Options.TrainOptions.Resources[citynum]["Stone"])
			}
			if (parseIntNan(Options.TrainOptions.Resources[citynum]["Ore"]) != 0) {
				availOre = parseIntNan(Options.TrainOptions.Resources[citynum]["Ore"])
			}
		}

		var gambleFactor = 1;
		if (gamble > 0) { gambleFactor = t.gamble[gamble].cost; }

		var unitFood = parseInt(uW.unitcost['unt' + unitId][1]) * gambleFactor;
		var unitWood = parseInt(uW.unitcost['unt' + unitId][2]) * gambleFactor;
		var unitStone = parseInt(uW.unitcost['unt' + unitId][3]) * gambleFactor;
		var unitOre = parseInt(uW.unitcost['unt' + unitId][4]) * gambleFactor;
		var unitPop = parseInt(uW.unitcost['unt' + unitId][6]);

		if (unitId == 16) var unitYew = uW.unitcost['unt' + unitId][11]["34001"];
		if (unitId == 27) var unitCorrupter = uW.unitcost['unt' + unitId][11]["34003"];

		var idlePop = parseInt(Seed.citystats['city' + cityId].pop[0]) - parseInt(Seed.citystats['city' + cityId].pop[3]);
		if (ignoreRes) {
			idlePop = parseInt(Seed.citystats['city' + cityId].pop[1]) - parseInt(Seed.citystats['city' + cityId].pop[3]); // base on max population
		}
		var workers = Math.floor(parseIntNan(Seed.citystats['city' + cityId].pop[3]) * (workforce / 100));
		idlePop = idlePop + workers;

		var yew = parseIntNan(Seed.items.i34001); // flame archers require yew branches
		var corrupter = parseIntNan(Seed.items.i34003); // duellists require corrupter seeds

		var max = 9999999999;

		if (!ignoreRes) {
			if ((food / unitFood) < max) {
				max = food / unitFood;
				t.limitingFactor = uW.resourceinfo['rec1'];
			}
			if ((wood / unitWood) < max) {
				max = wood / unitWood;
				t.limitingFactor = uW.resourceinfo['rec2'];
			}
			if ((stone / unitStone) < max) {
				max = stone / unitStone;
				t.limitingFactor = uW.resourceinfo['rec3'];
			}
			if ((ore / unitOre) < max) {
				max = ore / unitOre;
				t.limitingFactor = uW.resourceinfo['rec4'];
			}

			if (unitId == 16) {
				if ((yew / unitYew) < max) {
					max = yew / unitYew;
					t.limitingFactor = 'yew';
				}
			}

			if (unitId == 27) {
				if ((corrupter / unitCorrupter) < max) {
					max = corrupter / unitCorrupter;
					t.limitingFactor = 'corrupter';
				}
			}
		}

		if ((idlePop / unitPop) < max) {
			max = idlePop / unitPop;
			t.limitingFactor = 'pop';
		}

		numberToTrain = parseInt(max);
		if (numberToTrain < 0) { numberToTrain = 0; }

		return numberToTrain;
	},

	CheckCanTrain: function (unitId, cityId) {
		var t = Tabs.Train;
		if (unitId == 0) return false;

		var Result = true;

		// check rare troops

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "rare")) {
			return false;
		}

		// check ascension city types here..

		var ascended = getAscensionValues(cityId);
		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "druid") && ascended.prestigeType != 1) {
			return false;
		}

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "fey") && ascended.prestigeType != 2) {
			return false;
		}

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "briton") && ascended.prestigeType != 3) {
			return false;
		}

		// troop requirements
		var Buildings = getCityBuildings(cityId);
		var fc = uW.unitcost['unt' + unitId];
		if (matTypeof(fc[8]) == 'object') {
			for (var k in fc[8]) {
				var b = Buildings[k.substr(1)];
				if (b.maxLevel < fc[8][k][1]) {
					Result = false;
					break;
				}
			}
		}
		if (matTypeof(fc[9]) == 'object') {
			for (var k in fc[9]) {
				if (parseInt(Seed.tech['tch' + k.substr(1)]) < fc[9][k][1]) {
					Result = false;
					break;
				}
			}
		}

		return Result;
	},

	PaintOverview: function () {
		var t = Tabs.Train;

		for (var i = 0; i < Cities.numCities; i++) {
			citynum = i + 1;
			cityId = Cities.cities[i].id;
			var totTime = 0;
			var totTime2 = 0;
			var now = unixTime();
			var q = Seed.queue_unt['city' + cityId];
			if (q != null && q.length > 0) {
				for (var j = 0; j < q.length; j++) {
					if (q[j][7])
						totTime2 = q[j][3] - now;
					else
						totTime = q[j][3] - now;
				}
			}
			if (totTime < 0) totTime = 0;
			if (totTime < 3600) ById('btTrnQueueCity_' + citynum).innerHTML = '<SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
			else ById('btTrnQueueCity_' + citynum).innerHTML = timestr(totTime);
			if (totTime2 < 0) totTime2 = 0;
			if (totTime2 < 3600) ById('btTrnAscQueueCity_' + citynum).innerHTML = '<SPAN class=boldRed><B>' + timestr(totTime2) + '</b></span>';
			else ById('btTrnAscQueueCity_' + citynum).innerHTML = timestr(totTime2);

			var idlePop = parseInt(Seed.citystats['city' + cityId].pop[0]) - parseInt(Seed.citystats['city' + cityId].pop[3]);
			var workers = Math.floor(parseIntNan(Seed.citystats['city' + cityId].pop[3]) * (Options.TrainOptions.Workers[citynum] / 100));
			var autoidlePop = idlePop + workers;
			if (idlePop <= 0) ById('btTrnIdlePopCity_' + citynum).innerHTML = '<SPAN class=boldRed title="' + addCommas(autoidlePop) + ' ' + tx('Available for Auto-Training') + '">' + addCommas(idlePop) + '</span>';
			else ById('btTrnIdlePopCity_' + citynum).innerHTML = '<SPAN title="' + addCommas(autoidlePop) + ' ' + tx('Available for Auto-Training') + '">' + addCommas(idlePop) + '</span>';

			var WindAvailable = (parseInt(Seed.citystats['city' + cityId].pop[0]) < parseInt(Seed.citystats['city' + cityId].pop[1]));
			if (WindAvailable) { jQuery('#btTrnWindsLinkCity_' + citynum).removeClass("divHide"); }
			else { jQuery('#btTrnWindsLinkCity_' + citynum).addClass("divHide"); }
			ById('btTrnWindsCity_' + citynum).title = itemTitle(351);
		}

		var ts = Math.floor(equippedthronestats(77));
		if (Options.TrainOptions.ThroneCheck && (ts < Number(Options.TrainOptions.TrainingSpeed))) {
			ts = '<span class=boldRed><b>' + ts + '%</b></span>';
		}
		else { ts += '%'; }
		ById("btTrnCurrTR").innerHTML = ts;
	},

	fixQueTimes: function (q) {
		// fix KofC bugs ....
		// if first start time > now, make it now
		// if any end time != next start time then fix it
		var now = unixTime();
		if (q[0][2] > now) { q[0][2] = now; }
		for (var i = 0; i < q.length; i++) {
			if (q[i + 1] != null && q[i + 1][2] != q[i][3]) { q[i][3] = q[i + 1][2]; }
		}
	},

	expireTheQueue: function (q) {
		if (q == null) return;
		var now = unixTime();
		for (var i = 0; i < q.length; i++) {
			if ((q[i][3] - now) < 1) q.splice(i, 1);
		}
	},

	UpdateTrainingOptions: function () {
		var t = Tabs.Train;
		var citynum = Cities.byID[t.ModelCityId].idx + 1;

		var m = '<table width=100% class=xtab>';
		m += '<tr><td width=15>&nbsp;</td><td width=15>&nbsp;</td><td width=120 align=right>' + tx('Primary') + ':&nbsp;</td><td align=left>';
		m += '<SELECT id=btTrnAutoPrimaryType><option value="0">-- ' + uW.g_js_strings.commonstr.select + ' --</option>';
		for (var ui in CM.UNIT_TYPES) {
			var u = CM.UNIT_TYPES[ui];
			if (CM.BarracksUnitsTypeMap.isUnitType(u, "normal") && t.CheckCanTrain(u, t.ModelCityId)) {
				m += '<option value=' + u + '>' + uW.unitcost["unt" + u][0] + '</option>';
			}
		}
		m += '</td><td align=left>' + tx('Min') + ':&nbsp;<INPUT id=btTrnAutoPrimaryMin type=text size=6 maxlength=6 value="' + Options.TrainOptions.PrimaryMin[citynum] + '"\></td>';
		m += '<td><INPUT type=checkbox id=btTrnAutoPrimarySelMax>&nbsp;' + tx("Max") + ':&nbsp;<INPUT id=btTrnAutoPrimaryMax type=text size=6 maxlength=6 value="' + Options.TrainOptions.PrimaryMax[citynum] + '"\></td>';
		m += '<td colspan=2>' + tx('City Limit') + ':&nbsp;<INPUT id=btTrnAutoPrimaryLimit type=text size=12 maxlength=14 value="' + Options.TrainOptions.PrimaryLimit[citynum] + '"\><INPUT type=checkbox ' + (Options.TrainOptions.ReduceLimit[citynum] ? 'CHECKED' : '') + ' id=btTrnAutoReduceLimit>&nbsp;' + tx("Reduce") + '</td></tr>';
		m += '<tr><td>&nbsp;</td><td><INPUT id=btTrnAutoSecondaryEnabled type=checkbox ' + (Options.TrainOptions.SecondaryEnabled[citynum] ? 'CHECKED' : '') + '></td><td align=right>' + tx('Secondary') + ':&nbsp;</td><td align=left>';
		m += '<SELECT id=btTrnAutoSecondaryType><option value="0">-- ' + uW.g_js_strings.commonstr.select + ' --</option>';
		for (var ui in CM.UNIT_TYPES) {
			var u = CM.UNIT_TYPES[ui];
			if (CM.BarracksUnitsTypeMap.isUnitType(u, "normal") && t.CheckCanTrain(u, t.ModelCityId)) {
				m += '<option value=' + u + '>' + uW.unitcost["unt" + u][0] + '</option>';
			}
		}
		m += '</td><td align=left>' + tx('Min') + ':&nbsp;<INPUT id=btTrnAutoSecondaryMin type=text size=6 maxlength=6 value="' + Options.TrainOptions.SecondaryMin[citynum] + '"\></td>';
		m += '<td><INPUT type=checkbox id=btTrnAutoSecondarySelMax>&nbsp;' + tx("Max") + ':&nbsp;<INPUT id=btTrnAutoSecondaryMax type=text size=6 maxlength=6 value="' + Options.TrainOptions.SecondaryMax[citynum] + '"\></td>';
		m += '<td>&nbsp;</td></tr>';

		if (Seed.cityData.city[t.ModelCityId].prestigeInfo.blessings) {
			var AscensionType = '(unknown)';
			if (Seed.cityData.city[t.ModelCityId].prestigeInfo.blessings.indexOf(11) != -1) {
				Options.TrainOptions.AscensionTroops[citynum] = 13;
				var AscensionType = uW.unitcost['unt13'][0];
			}
			if (Seed.cityData.city[t.ModelCityId].prestigeInfo.blessings.indexOf(21) != -1) {
				Options.TrainOptions.AscensionTroops[citynum] = 14;
				var AscensionType = uW.unitcost['unt14'][0];
			}
			if (Seed.cityData.city[t.ModelCityId].prestigeInfo.blessings.indexOf(31) != -1) {
				Options.TrainOptions.AscensionTroops[citynum] = 15;
				var AscensionType = uW.unitcost['unt15'][0];
			}
			m += '<tr><td>&nbsp;</td><td align=left><INPUT id=btTrnAutoAscensionEnabled type=checkbox ' + (Options.TrainOptions.AscensionEnabled[citynum] ? 'CHECKED' : '') + '></td><td align=right>' + tx('Ascension') + ':&nbsp;</td><td><b>' + AscensionType + '</b></td>';
			m += '<td>' + tx("Min") + ':&nbsp;<INPUT id=btTrnAutoAscensionMin type=text size=6 maxlength=6 value="' + Options.TrainOptions.AscensionMin[citynum] + '"></td>';
			m += '<td><INPUT type=checkbox id=btTrnAutoAscensionSelMax>&nbsp;' + tx("Max") + ':&nbsp;<INPUT id=btTrnAutoAscensionMax type=text size=6 maxlength=6 value="' + Options.TrainOptions.AscensionMax[citynum] + '"\></td></tr>';
		}
		m += '<tr><td>&nbsp;</td><td>&nbsp;</td><TD align=right><SELECT id=btTrnAutoKeep><option value="true">' + tx("Keep") + '</option><option value="false">' + tx("Use") + '</option></select></td>';
		m += '<td colspan=5><table class=xtab><tr>';
		m += '<TD><img src="' + FoodImage + '" title="' + uW.g_js_strings.commonstr.food + '"></td>';
		m += '<TD><INPUT id="btTrnAutoFood" type=text size=11 maxlength=12 value="' + Options.TrainOptions.Resources[citynum]['Food'] + '"\></td>';
		m += '<TD><img src="' + WoodImage + '" title="' + uW.g_js_strings.commonstr.wood + '"></td>';
		m += '<TD><INPUT id="btTrnAutoWood" type=text size=11 maxlength=12 value="' + Options.TrainOptions.Resources[citynum]['Wood'] + '"\></td>';
		m += '<TD><img src="' + StoneImage + '" title="' + uW.g_js_strings.commonstr.stone + '"></td>';
		m += '<TD><INPUT id="btTrnAutoStone" type=text size=11 maxlength=12 value="' + Options.TrainOptions.Resources[citynum]['Stone'] + '"\></td>';
		m += '<TD><img src="' + OreImage + '" title="' + uW.g_js_strings.commonstr.ore + '"></td>';
		m += '<TD><INPUT id="btTrnAutoOre" type=text size=11 maxlength=12 value="' + Options.TrainOptions.Resources[citynum]['Ore'] + '"\></td></tr></table></td></tr>';
		m += '<tr><td>&nbsp;</td><td>&nbsp;</td><td align=right>' + tx("Use Workforce") + ':&nbsp;</td>';
		m += '<td><SELECT id=btTrnAutoWorkers><option value="0">0%</option><option value="25">25%</option><option value="50">50%</option><option value="75">75%</option><option value="100">100%</option></select></td>';
		m += '<td colspan=3>' + tx("Gamble") + ':&nbsp;<SELECT id=btTrnAutoGamble>\
			<option value=0><CENTER>-- '+ uW.g_js_strings.commonstr.select + ' --</center></option>\
			<option value=1>Use ' + t.gamble[1].cost + 'x resources (' + t.gamble[1].min + ' - ' + t.gamble[1].max + '% faster)</option>\
			<option value=2>Use ' + t.gamble[2].cost + 'x resources (' + t.gamble[2].min + ' - ' + t.gamble[2].max + '% faster)</option>\
			</select></td><td align=right><a class=xlink id=btTrnAutoCopy>'+ tx('Copy settings to all cities') + '</a>&nbsp;&nbsp;</td></tr></table>';

		// dismiss here!!

		var n = '<table class=xtab width=100%>';
		n += '<tr><td colspan=8><table class=xtab align=center cellpadding=0 cellspacing=0>';
		n += '<tr style="vertical-align:top;"><td rowspan=2><img src="' + IMGURL + 'units/unit_1_30.jpg" /></td><td width=15%>' + uW.unitnamedesctranslated['unt1'][0] + '</td>';
		n += '<td rowspan=2><img src="' + IMGURL + 'units/unit_2_30.jpg" /></td><td width=15%>' + uW.unitnamedesctranslated['unt2'][0] + '</td>';
		n += '<td rowspan=2><img src="' + IMGURL + 'units/unit_3_30.jpg" /></td><td width=15%>' + uW.unitnamedesctranslated['unt3'][0] + '</td>';
		n += '<td rowspan=2><img src="' + IMGURL + 'units/unit_4_30.jpg" /></td><td width=15%>' + uW.unitnamedesctranslated['unt4'][0] + '</td>';
		n += '<td rowspan=2><img src="' + IMGURL + 'units/unit_5_30.jpg" /></td><td width=15%>' + uW.unitnamedesctranslated['unt5'][0] + '</td>';
		n += '<td rowspan=2><img src="' + IMGURL + 'units/unit_6_30.jpg" /></td><td width=15%>' + uW.unitnamedesctranslated['unt6'][0] + '</td></tr>';

		n += '<tr style="vertical-align:top;"><td><INPUT type=CHECKBOX id=chkDoST></td><td><INPUT type=CHECKBOX id=chkDoMM></td>';
		n += '<td><INPUT type=CHECKBOX id=chkDoSC></td><td><INPUT type=CHECKBOX id=chkDoPK></td><td><INPUT type=CHECKBOX id=chkDoSW></td><td><INPUT type=CHECKBOX id=chkDoAR></td></tr>';
		n += '<tr><td align=right>' + tx('Keep') + ':</td><td><INPUT class=btInput id="btDisKeepST" type=text size=11 maxlength=12 value="' + Options.TrainOptions.KeepST[citynum] + '"\></td>';
		n += '<td align=right>' + tx('Keep') + ':</td><td><INPUT class=btInput id="btDisKeepMM" type=text size=11 maxlength=12 value="' + Options.TrainOptions.KeepMM[citynum] + '"\></td>';
		n += '<td align=right>' + tx('Keep') + ':</td><td><INPUT class=btInput id="btDisKeepSC" type=text size=11 maxlength=12 value="' + Options.TrainOptions.KeepSC[citynum] + '"\></td>';
		n += '<td align=right>' + tx('Keep') + ':</td><td><INPUT class=btInput id="btDisKeepPK" type=text size=11 maxlength=12 value="' + Options.TrainOptions.KeepPK[citynum] + '"\></td>';
		n += '<td align=right>' + tx('Keep') + ':</td><td><INPUT class=btInput id="btDisKeepSW" type=text size=11 maxlength=12 value="' + Options.TrainOptions.KeepSW[citynum] + '"\></td>';
		n += '<td align=right>' + tx('Keep') + ':</td><td><INPUT class=btInput id="btDisKeepAR" type=text size=11 maxlength=12 value="' + Options.TrainOptions.KeepAR[citynum] + '"\></td></tr>';
		n += '<tr><td colspan=12><div align=center><table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td align=center><br><input type=checkbox id=chkDoOther >' + tx('Override above rules by always dismissing') + ' ';
		n += '<SELECT id=btDisOtherType><option value="0">-- ' + uW.g_js_strings.commonstr.select + ' --</option>';
		for (var ui in CM.UNIT_TYPES) {
			var u = CM.UNIT_TYPES[ui];
			if (u > 6) {
				n += '<option value=' + u + '>' + uW.unitcost["unt" + u][0] + '</option>';
			}
		}
		n += '</select>&nbsp;' + tx('when more than') + ' <INPUT class=btInput id="btDisKeepOther" type=text size=11 maxlength=12 value="' + Options.TrainOptions.KeepOther[citynum] + '">&nbsp;' + tx('troops owned') + '.</td></tr></table></div></td></tr>';

		n += '</table></td></tr><tr><td colspan=8 align=right><a class=xlink id=btDisAutoCopy>' + tx('Copy settings to all cities') + '</a>&nbsp;&nbsp;</td></tr></table>';

		ById('btTrnAuto').innerHTML = m;
		ById('btDisAuto').innerHTML = n;
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		ById('btTrnAutoPrimaryType').value = Options.TrainOptions.PrimaryTroops[citynum];
		ById('btTrnAutoPrimarySelMax').checked = Options.TrainOptions.PrimarySelectMax[citynum];
		if (!Options.TrainOptions.PrimarySelectMax[citynum]) {
			ById('btTrnAutoPrimaryMax').disabled = true;
			Options.TrainOptions.PrimaryMax[citynum] = t.getMaxTrain(Options.TrainOptions.PrimaryTroops[citynum], t.ModelCityId, true, Options.TrainOptions.Workers[citynum]);
			ById('btTrnAutoPrimaryMax').value = Options.TrainOptions.PrimaryMax[citynum];
		}

		ById('btTrnAutoSecondaryType').value = Options.TrainOptions.SecondaryTroops[citynum];
		ById('btTrnAutoSecondarySelMax').checked = Options.TrainOptions.SecondarySelectMax[citynum];
		if (!Options.TrainOptions.SecondarySelectMax[citynum]) {
			ById('btTrnAutoSecondaryMax').disabled = true;
			Options.TrainOptions.SecondaryMax[citynum] = t.getMaxTrain(Options.TrainOptions.SecondaryTroops[citynum], t.ModelCityId, true, Options.TrainOptions.Workers[citynum]);
			ById('btTrnAutoSecondaryMax').value = Options.TrainOptions.SecondaryMax[citynum];
		}

		if (!Options.TrainOptions.SecondaryEnabled[citynum]) {
			ById('btTrnAutoSecondaryType').disabled = true;
			ById('btTrnAutoSecondaryMin').disabled = true;
			ById('btTrnAutoSecondarySelMax').disabled = true;
			ById('btTrnAutoSecondaryMax').disabled = true;
		}

		if (ById('btTrnAutoAscensionEnabled')) {
			ById('btTrnAutoAscensionSelMax').checked = Options.TrainOptions.AscensionSelectMax[citynum];
			if (!Options.TrainOptions.AscensionSelectMax[citynum]) {
				ById('btTrnAutoAscensionMax').disabled = true;
				Options.TrainOptions.AscensionMax[citynum] = t.getMaxTrain(Options.TrainOptions.AscensionTroops[citynum], t.ModelCityId, true, Options.TrainOptions.Workers[citynum]);
				ById('btTrnAutoAscensionMax').value = Options.TrainOptions.AscensionMax[citynum];
			}

			if (!Options.TrainOptions.AscensionEnabled[citynum]) {
				ById('btTrnAutoAscensionMin').disabled = true;
				ById('btTrnAutoAscensionSelMax').disabled = true;
				ById('btTrnAutoAscensionMax').disabled = true;
			}
		}

		ById('btTrnAutoKeep').value = Options.TrainOptions.Keep[citynum];
		ById('btTrnAutoWorkers').value = Options.TrainOptions.Workers[citynum];
		ById('btTrnAutoGamble').value = Options.TrainOptions.Gamble[citynum];

		ById('btTrnAutoPrimaryType').addEventListener('change', function (e) {
			Options.TrainOptions.PrimaryTroops[citynum] = e.target.value;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btTrnAutoPrimaryMin').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.PrimaryMin[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btTrnAutoPrimaryMax').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = t.getMaxTrain(Options.TrainOptions.PrimaryTroops[citynum], t.ModelCityId, true, Options.TrainOptions.Workers[citynum]);
			Options.TrainOptions.PrimaryMax[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btTrnAutoPrimarySelMax').addEventListener('change', function (e) {
			Options.TrainOptions.PrimarySelectMax[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);
		ById('btTrnAutoPrimaryLimit').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.PrimaryLimit[citynum] = e.target.value;
			saveOptions();
		}, false);

		ById('btTrnAutoReduceLimit').addEventListener('change', function (e) {
			Options.TrainOptions.ReduceLimit[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btTrnAutoSecondaryEnabled').addEventListener('change', function (e) {
			Options.TrainOptions.SecondaryEnabled[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btTrnAutoSecondaryType').addEventListener('change', function (e) {
			Options.TrainOptions.SecondaryTroops[citynum] = e.target.value;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btTrnAutoSecondaryMin').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.SecondaryMin[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btTrnAutoSecondaryMax').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = t.getMaxTrain(Options.TrainOptions.SecondaryTroops[citynum], t.ModelCityId, true, Options.TrainOptions.Workers[citynum]);
			Options.TrainOptions.SecondaryMax[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btTrnAutoSecondarySelMax').addEventListener('change', function (e) {
			Options.TrainOptions.SecondarySelectMax[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btTrnAutoWorkers').addEventListener('change', function (e) {
			Options.TrainOptions.Workers[citynum] = e.target.value;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btTrnAutoGamble').addEventListener('change', function (e) {
			Options.TrainOptions.Gamble[citynum] = e.target.value;
			saveOptions();
		}, false);

		ById('btTrnAutoKeep').addEventListener('change', function (e) {
			Options.TrainOptions.Keep[citynum] = e.target.value;
			saveOptions();
		}, false);

		ById('btTrnAutoFood').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.Resources[citynum]['Food'] = e.target.value;
			saveOptions();
		}, false);
		ById('btTrnAutoWood').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.Resources[citynum]['Wood'] = e.target.value;
			saveOptions();
		}, false);
		ById('btTrnAutoStone').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.Resources[citynum]['Stone'] = e.target.value;
			saveOptions();
		}, false);
		ById('btTrnAutoOre').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.Resources[citynum]['Ore'] = e.target.value;
			saveOptions();
		}, false);

		if (ById('btTrnAutoAscensionEnabled')) {
			ById('btTrnAutoAscensionEnabled').addEventListener('change', function (e) {
				Options.TrainOptions.AscensionEnabled[citynum] = e.target.checked;
				saveOptions();
				t.UpdateTrainingOptions();
			}, false);
			ById('btTrnAutoAscensionMin').addEventListener('change', function (e) {
				if (isNaN(e.target.value)) e.target.value = 0;
				Options.TrainOptions.AscensionMin[citynum] = e.target.value;
				saveOptions();
			}, false);
			ById('btTrnAutoAscensionMax').addEventListener('change', function (e) {
				if (isNaN(e.target.value)) e.target.value = t.getMaxTroops(t.ModelCityId, Options.TrainOptions.AscensionTroops[citynum], true, Options.TrainOptions.Workers[citynum]);
				Options.TrainOptions.AscensionMax[citynum] = e.target.value;
				saveOptions();
			}, false);
			ById('btTrnAutoAscensionSelMax').addEventListener('change', function (e) {
				Options.TrainOptions.AscensionSelectMax[citynum] = e.target.checked;
				saveOptions();
				t.UpdateTrainingOptions();
			}, false);
		};

		ById('chkDoST').checked = Options.TrainOptions.DismissST[citynum];
		ById('chkDoMM').checked = Options.TrainOptions.DismissMM[citynum];
		ById('chkDoSC').checked = Options.TrainOptions.DismissSC[citynum];
		ById('chkDoPK').checked = Options.TrainOptions.DismissPK[citynum];
		ById('chkDoSW').checked = Options.TrainOptions.DismissSW[citynum];
		ById('chkDoAR').checked = Options.TrainOptions.DismissAR[citynum];
		ById('chkDoOther').checked = Options.TrainOptions.DismissOther[citynum];

		ById('btDisOtherType').value = Options.TrainOptions.DismissOtherType[citynum];

		if (!Options.TrainOptions.DismissST[citynum]) {
			ById('btDisKeepST').disabled = true;
		}
		if (!Options.TrainOptions.DismissMM[citynum]) {
			ById('btDisKeepMM').disabled = true;
		}
		if (!Options.TrainOptions.DismissSC[citynum]) {
			ById('btDisKeepSC').disabled = true;
		}
		if (!Options.TrainOptions.DismissPK[citynum]) {
			ById('btDisKeepPK').disabled = true;
		}
		if (!Options.TrainOptions.DismissSW[citynum]) {
			ById('btDisKeepSW').disabled = true;
		}
		if (!Options.TrainOptions.DismissAR[citynum]) {
			ById('btDisKeepAR').disabled = true;
		}
		if (!Options.TrainOptions.DismissOther[citynum]) {
			ById('btDisKeepOther').disabled = true;
			ById('btDisOtherType').disabled = true;
		}

		ById('chkDoST').addEventListener('change', function (e) {
			Options.TrainOptions.DismissST[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);
		ById('chkDoMM').addEventListener('change', function (e) {
			Options.TrainOptions.DismissMM[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);
		ById('chkDoSC').addEventListener('change', function (e) {
			Options.TrainOptions.DismissSC[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);
		ById('chkDoPK').addEventListener('change', function (e) {
			Options.TrainOptions.DismissPK[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);
		ById('chkDoSW').addEventListener('change', function (e) {
			Options.TrainOptions.DismissSW[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);
		ById('chkDoAR').addEventListener('change', function (e) {
			Options.TrainOptions.DismissAR[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);
		ById('chkDoOther').addEventListener('change', function (e) {
			Options.TrainOptions.DismissOther[citynum] = e.target.checked;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btDisOtherType').addEventListener('change', function (e) {
			Options.TrainOptions.DismissOtherType[citynum] = e.target.value;
			saveOptions();
			t.UpdateTrainingOptions();
		}, false);

		ById('btDisKeepST').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.KeepST[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btDisKeepMM').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.KeepMM[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btDisKeepSC').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.KeepSC[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btDisKeepPK').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.KeepPK[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btDisKeepSW').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.KeepSW[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btDisKeepAR').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.KeepAR[citynum] = e.target.value;
			saveOptions();
		}, false);
		ById('btDisKeepOther').addEventListener('change', function (e) {
			if (isNaN(e.target.value)) e.target.value = 0;
			Options.TrainOptions.KeepOther[citynum] = e.target.value;
			saveOptions();
		}, false);

		ById('btTrnAutoCopy').addEventListener('click', function (e) {
			t.CopyAutoTrainSettings(citynum);
			saveOptions();
			ById('btTrnMessages').innerHTML = tx('Auto-train settings copied to all cities');
		}, false);
		ById('btDisAutoCopy').addEventListener('click', function (e) {
			t.CopyAutoDismissSettings(citynum);
			saveOptions();
			ById('btTrnMessages').innerHTML = tx('Auto-dismiss settings copied to all cities');
		}, false);

	},

	CopyAutoTrainSettings: function (citynum) {
		var t = Tabs.Train;
		for (var i = 1; i <= Cities.numCities; i++) {
			if (i != citynum) {
				//				Options.TrainOptions.Enabled[i] = Options.TrainOptions.Enabled[citynum];
				if (Options.TrainOptions.PrimaryTroops[citynum] == 0 || t.CheckCanTrain(Options.TrainOptions.PrimaryTroops[citynum], Cities.cities[i - 1].id)) {
					Options.TrainOptions.PrimaryTroops[i] = Options.TrainOptions.PrimaryTroops[citynum];
					Options.TrainOptions.PrimaryMin[i] = Options.TrainOptions.PrimaryMin[citynum];
					Options.TrainOptions.PrimarySelectMax[i] = Options.TrainOptions.PrimarySelectMax[citynum];
					Options.TrainOptions.PrimaryMax[i] = Options.TrainOptions.PrimaryMax[citynum];
					Options.TrainOptions.PrimaryLimit[i] = Options.TrainOptions.PrimaryLimit[citynum];
					Options.TrainOptions.ReduceLimit[i] = Options.TrainOptions.ReduceLimit[citynum];
				}
				if (Options.TrainOptions.SecondaryTroops[citynum] == 0 || t.CheckCanTrain(Options.TrainOptions.SecondaryTroops[citynum], Cities.cities[i - 1].id)) {
					Options.TrainOptions.SecondaryEnabled[i] = Options.TrainOptions.SecondaryEnabled[citynum];
					Options.TrainOptions.SecondaryTroops[i] = Options.TrainOptions.SecondaryTroops[citynum];
					Options.TrainOptions.SecondaryMin[i] = Options.TrainOptions.SecondaryMin[citynum];
					Options.TrainOptions.SecondarySelectMax[i] = Options.TrainOptions.SecondarySelectMax[citynum];
					Options.TrainOptions.SecondaryMax[i] = Options.TrainOptions.SecondaryMax[citynum];
				}
				if (Seed.cityData.city[Cities.cities[i - 1].id].prestigeInfo.blessings) {
					Options.TrainOptions.AscensionEnabled[i] = Options.TrainOptions.AscensionEnabled[citynum];
					//					Options.TrainOptions.AscensionTroops[i] = Options.TrainOptions.AscensionTroops[citynum];
					Options.TrainOptions.AscensionMin[i] = Options.TrainOptions.AscensionMin[citynum];
					Options.TrainOptions.AscensionSelectMax[i] = Options.TrainOptions.AscensionSelectMax[citynum];
					Options.TrainOptions.AscensionMax[i] = Options.TrainOptions.AscensionMax[citynum];
				}
				Options.TrainOptions.Gamble[i] = Options.TrainOptions.Gamble[citynum];
				Options.TrainOptions.Workers[i] = Options.TrainOptions.Workers[citynum];
				Options.TrainOptions.Keep[i] = Options.TrainOptions.Keep[citynum];
				Options.TrainOptions.Resources[i].Food = Options.TrainOptions.Resources[citynum].Food;
				Options.TrainOptions.Resources[i].Wood = Options.TrainOptions.Resources[citynum].Wood;
				Options.TrainOptions.Resources[i].Stone = Options.TrainOptions.Resources[citynum].Stone;
				Options.TrainOptions.Resources[i].Ore = Options.TrainOptions.Resources[citynum].Ore;
			}
		}
	},

	CopyAutoDismissSettings: function (citynum) {
		var t = Tabs.Train;
		for (var i = 1; i <= Cities.numCities; i++) {
			if (i != citynum) {
				//				Options.TrainOptions.AutoDismiss[i] = Options.TrainOptions.AutoDismiss[citynum];
				Options.TrainOptions.DismissST[i] = Options.TrainOptions.DismissST[citynum];
				Options.TrainOptions.DismissMM[i] = Options.TrainOptions.DismissMM[citynum];
				Options.TrainOptions.DismissSC[i] = Options.TrainOptions.DismissSC[citynum];
				Options.TrainOptions.DismissPK[i] = Options.TrainOptions.DismissPK[citynum];
				Options.TrainOptions.DismissSW[i] = Options.TrainOptions.DismissSW[citynum];
				Options.TrainOptions.DismissAR[i] = Options.TrainOptions.DismissAR[citynum];
				Options.TrainOptions.DismissOther[i] = Options.TrainOptions.DismissOther[citynum];
				Options.TrainOptions.DismissOtherType[i] = Options.TrainOptions.DismissOtherType[citynum];
				Options.TrainOptions.KeepST[i] = Options.TrainOptions.KeepST[citynum];
				Options.TrainOptions.KeepMM[i] = Options.TrainOptions.KeepMM[citynum];
				Options.TrainOptions.KeepSC[i] = Options.TrainOptions.KeepSC[citynum];
				Options.TrainOptions.KeepPK[i] = Options.TrainOptions.KeepPK[citynum];
				Options.TrainOptions.KeepSW[i] = Options.TrainOptions.KeepSW[citynum];
				Options.TrainOptions.KeepAR[i] = Options.TrainOptions.KeepAR[citynum];
				Options.TrainOptions.KeepOther[i] = Options.TrainOptions.KeepOther[citynum];
			}
		}
	},

	doAutoLoop: function (idx) {
		var t = Tabs.Train;
		clearTimeout(t.timer);
		if (!Options.TrainOptions.Running && !Options.TrainOptions.DismissRunning) return;

		var cityId = Cities.cities[idx - 1].id;
		t.autodelay = 0; // no delay if no action taken!

		if (Options.TrainOptions.Running) {
			var TroopsQueued = false;
			var ts = Math.floor(equippedthronestats(77));
			if (!Options.TrainOptions.ThroneCheck || (Options.TrainOptions.TrainingSpeed == 0) || (Options.TrainOptions.TrainingSpeed <= ts)) {
				var ascensionok = (!Options.BuildOptions || !Options.BuildOptions.AscensionReady[idx]);
				if (Options.TrainOptions.Enabled[idx] && ascensionok) {
					var stonelevel = (Seed.guardian[idx - 1].cityGuardianLevels["stone"] ? Seed.guardian[idx - 1].cityGuardianLevels["stone"] : 0);
					if (!Options.TrainOptions.StoneGuardian[idx] || (stonelevel == 0) || (Seed.guardian[idx - 1].type == "stone")) {
						// check ascension first...
						if (Seed.cityData.city[cityId].isPrestigeCity && Options.TrainOptions.AscensionEnabled[idx]) {
							var NumTrain = t.getMaxTrain(Options.TrainOptions.AscensionTroops[idx], cityId, false, Options.TrainOptions.Workers[idx], Options.TrainOptions.Gamble[idx], true);
							if (NumTrain > 0 && NumTrain >= parseIntNan(Options.TrainOptions.AscensionMin[idx])) {
								if (Options.TrainOptions.AscensionSelectMax[idx] && NumTrain > parseIntNan(Options.TrainOptions.AscensionMax[idx])) {
									NumTrain = parseIntNan(Options.TrainOptions.AscensionMax[idx]);
								}
								if (t.CheckTrainSlots(cityId, true)) {
									t.Train(cityId, 0, Options.TrainOptions.Gamble[idx], Options.TrainOptions.AscensionTroops[idx], NumTrain);
									t.autodelay = t.intervalSecs;
									TroopsQueued = true;
								}
							}
						}

						if (!TroopsQueued) {
							// check primary troop conditions...
							var PrimaryLimit = parseIntNan(Options.TrainOptions.PrimaryLimit[idx]);
							var TroopsOwned = parseIntNan(getCityTroops(Options.TrainOptions.PrimaryTroops[idx], cityId, true));
							var NumTrain = t.getMaxTrain(Options.TrainOptions.PrimaryTroops[idx], cityId, false, Options.TrainOptions.Workers[idx], Options.TrainOptions.Gamble[idx], true);
							if (NumTrain > 0) {
								if (Options.TrainOptions.ReduceLimit[idx]) {
									if (NumTrain > PrimaryLimit) { NumTrain = PrimaryLimit; }
								}
								else {
									if (PrimaryLimit > 0 && NumTrain > (PrimaryLimit - TroopsOwned)) { NumTrain = PrimaryLimit - TroopsOwned; }
								}
							}
							if (NumTrain > 0) {
								if (NumTrain >= parseIntNan(Options.TrainOptions.PrimaryMin[idx])) {
									if (Options.TrainOptions.PrimarySelectMax[idx] && NumTrain > parseIntNan(Options.TrainOptions.PrimaryMax[idx])) {
										NumTrain = parseIntNan(Options.TrainOptions.PrimaryMax[idx]);
									}
									if (t.CheckTrainSlots(cityId, false)) {
										t.Train(cityId, 0, Options.TrainOptions.Gamble[idx], Options.TrainOptions.PrimaryTroops[idx], NumTrain, function (rslt) {
											if (rslt.ok) {
												if (Options.TrainOptions.ReduceLimit[idx]) {
													Options.TrainOptions.PrimaryLimit[idx] = Options.TrainOptions.PrimaryLimit[idx] - NumTrain;
													if (Options.TrainOptions.PrimaryLimit[idx] < 0) Options.TrainOptions.PrimaryLimit[idx] = 0;
													saveOptions();
													if (ById('btTrnAutoPrimaryLimit') && cityId == t.ModelCityId) { ById('btTrnAutoPrimaryLimit').value = Options.TrainOptions.PrimaryLimit[idx]; }
												}
											}
										});
										t.autodelay = t.intervalSecs;
										TroopsQueued = true;
									}
								}
								else {
									TroopsQueued = true; // don't allow secondary if primary valid but we're waiting for population.. HOPEFULLY this will still allow us to move to secondary if no yew branches when flame archers are primary (?)
								}
							}
						}

						if (!TroopsQueued) {
							// check secondary troops...
							if (Options.TrainOptions.SecondaryEnabled[idx]) {
								var NumTrain = t.getMaxTrain(Options.TrainOptions.SecondaryTroops[idx], cityId, false, Options.TrainOptions.Workers[idx], Options.TrainOptions.Gamble[idx], true);
								if (NumTrain >= parseIntNan(Options.TrainOptions.SecondaryMin[idx])) {
									if (Options.TrainOptions.SecondarySelectMax[idx] && NumTrain > parseIntNan(Options.TrainOptions.SecondaryMax[idx])) {
										NumTrain = parseIntNan(Options.TrainOptions.SecondaryMax[idx]);
									}
									if (t.CheckTrainSlots(cityId, false)) {
										t.Train(cityId, 0, Options.TrainOptions.Gamble[idx], Options.TrainOptions.SecondaryTroops[idx], NumTrain);
										t.autodelay = t.intervalSecs;
										TroopsQueued = true;
									}
								}
							}
						}
					}
				}
			}

			if (!TroopsQueued) {
				t.speedupused = false;
				var q = Seed.queue_unt['city' + cityId];
				t.expireTheQueue(q);

				var q1 = [];
				var q2 = [];

				for (var u in q) {
					if (q[u][0]) {
						if (q[u][7]) { q2.push(q[u]); }
						else { q1.push(q[u]); }
					}
				}

				var speedup = false;
				var speedupascension = false;
				if (q2 != null && q2.length > 0) { speedupascension = true; }
				else { if (q1 != null && q1.length > 0) { speedup = true; } }
				if (speedupascension && !t.speedupused) {
					for (var i = 0; i < q.length; i++) {
						if (!CM.BarracksUnitsTypeMap.isUnitType(q[i][0], "normal")) {
							t.autoSpeedup(cityId, q[i], i);
							break;
						}
					}
				}
				if (speedup && !t.speedupused) {
					for (var i = 0; i < q.length; i++) {
						if (CM.BarracksUnitsTypeMap.isUnitType(q[i][0], "normal")) {
							t.autoSpeedup(cityId, q[i], i);
							break;
						}
					}
				}
			}
		}

		if (Options.TrainOptions.DismissRunning) {
			t.GetMorePopulation(idx - 1);
		}

		if (idx == Cities.numCities) {
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, (t.intervalSecs * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx + 1); }, (t.autodelay * 1000));
		}
	},

	autoSpeedup: function (cityId, q, slot) {
		var t = Tabs.Train;
		var now = unixTime();
		var item = 0;
		totTime = q[3] - now;

		if (totTime > 0) {
			if (item == 0) {
				var THRESHOLD_SECONDS = (parseIntNan(Options.TrainOptions.MTLimitMinutes) * 60) + (parseIntNan(Options.TrainOptions.MTLimitHours) * 60 * 60);
				if (totTime >= THRESHOLD_SECONDS && Options.TrainOptions.UseMT && uW.ksoItems[38].count > 0) { item = 38; }
			}

			if (item == 0) {
				var THRESHOLD_SECONDS = (parseIntNan(Options.TrainOptions.ATLimitMinutes) * 60) + (parseIntNan(Options.TrainOptions.ATLimitHours) * 60 * 60);
				if (totTime >= THRESHOLD_SECONDS && Options.TrainOptions.UseAT && uW.ksoItems[37].count > 0) { item = 37; }
			}

			if (item == 0) {
				var THRESHOLD_SECONDS = (parseIntNan(Options.TrainOptions.LTLimitMinutes) * 60) + (parseIntNan(Options.TrainOptions.LTLimitHours) * 60 * 60);
				if (totTime >= THRESHOLD_SECONDS && Options.TrainOptions.UseLT && uW.ksoItems[36].count > 0) { item = 36; }
			}

			if (item == 0) {
				if (Options.TrainOptions.UseOverride && Options.TrainOptions.OverrideItem != 0) {
					var THRESHOLD_SECONDS = (parseIntNan(Options.TrainOptions.OverrideMinutes) * 60) + (parseIntNan(Options.TrainOptions.OverrideHours) * 60 * 60);
					if (totTime >= THRESHOLD_SECONDS && uW.ksoItems[Options.TrainOptions.OverrideItem].count > 0) { item = Options.TrainOptions.OverrideItem; }
				}
				if (item == 0 && totTime >= HGLimit[8] && Options.TrainOptions.UseLH && uW.ksoItems[10].count > 0) { item = 10; }
				if (item == 0 && totTime >= HGLimit[7] && Options.TrainOptions.UseEH && uW.ksoItems[8].count > 0) { item = 8; }
				if (item == 0 && totTime >= HGLimit[6] && Options.TrainOptions.UseDH && uW.ksoItems[7].count > 0) { item = 7; }
				if (item == 0 && totTime >= HGLimit[5] && Options.TrainOptions.UseRH && uW.ksoItems[6].count > 0) { item = 6; }
				if (item == 0 && totTime >= HGLimit[4] && Options.TrainOptions.UseAH && uW.ksoItems[5].count > 0) { item = 5; }
				if (item == 0 && totTime >= HGLimit[3] && Options.TrainOptions.UseMH && uW.ksoItems[4].count > 0) { item = 4; }
				if (item == 0 && totTime >= HGLimit[2] && Options.TrainOptions.UseGH && uW.ksoItems[3].count > 0) { item = 3; }
				if (item == 0 && totTime >= HGLimit[1] && Options.TrainOptions.UseKH && uW.ksoItems[2].count > 0) { item = 2; }
				if (item == 0 && totTime >= HGLimit[0] && Options.TrainOptions.UseSH && uW.ksoItems[1].count > 0) { item = 1; }
			}
		}

		if (item != 0) {
			t.autodelay = t.intervalSecs;
			t.speedupused = true;
			t.speedupTraining(cityId, q[0], item, slot, true);
		}
	},

	CheckTrainSlots: function (cityId, prestige) {
		var t = Tabs.Train;
		var Buildings = getCityBuildings(cityId);
		if (!prestige) {
			var barracks = Number(Buildings[13].count);
			var slots = 0;
			for (var k in Seed.queue_unt['city' + cityId]) {
				if (Seed.queue_unt['city' + cityId][k][7] == false) {
					slots += 1;
				}
			}
		}
		else {
			var barracks = Number(Buildings[22].count + Buildings[24].count + Buildings[26].count); //22 druid barracks, 24 fey barracks, 26 briton barracks
			var slots = 0;
			for (var k in Seed.queue_unt['city' + cityId]) {
				if (Seed.queue_unt['city' + cityId][k][7] == true) {
					slots += 1;
				}
			}
		}
		return (barracks > slots) ? true : false;
	},

	GetMorePopulation: function (idx) {
		var t = Tabs.Train;
		// This works one city behind, so if idx < 1, then it must be the end city
		if (idx < 1) { idx = Cities.numCities; }
		var cityId = Seed.cities[idx - 1][0];
		var Buildings = getCityBuildings(cityId);

		var max_idle_pop = (parseInt(Seed.citystats['city' + cityId].pop[1])).toFixed(0);
		var cur_idle_pop = (parseInt(Seed.citystats['city' + cityId].pop[0])).toFixed(0);
		var barracks = parseInt(Buildings[13].count);
		var slots_used = 0;
		for (var k in Seed.queue_unt['city' + cityId]) {
			if (Seed.queue_unt['city' + cityId][k][7] == false) {
				slots_used += 1;
			}
		}
		var slots_free = parseInt(barracks - slots_used);

		var num = parseInt(max_idle_pop) - parseInt(cur_idle_pop);
		if (num == 0) return; // max pop

		// if no slots free, check if less than a min to go in current training queue...

		NearlyDone = false;
		var now = unixTime();
		if ((slots_free <= 0) && (barracks != 0)) {
			var q = Seed.queue_unt['city' + cityId];
			for (var i = 0; i < q.length; i++) {
				if (!q[i][7]) {
					cur = q[i][3] - now;
					break;
				}
			}
			NearlyDone = (cur <= 60);
		}

		// auto fertile winds...

		if (Options.TrainOptions.AutoFertileWinds[idx] && uW.ksoItems[351] && uW.ksoItems[351].count > 0) {
			if ((slots_free > 0) || NearlyDone) {
				t.Fertilize(cityId);
				t.autodelay = t.intervalSecs;
			}
			return;
		}

		// auto dismiss...

		if (!Options.TrainOptions.AutoDismiss[idx]) { return; }

		var trooptype = 0;
		var to_dismiss = 0;
		if (Options.TrainOptions.DismissOther[idx] && (parseIntNan(Seed.units['city' + cityId]['unt' + Options.TrainOptions.DismissOtherType[idx]]) > parseIntNan(Options.TrainOptions.KeepOther[idx])) && (Options.TrainOptions.DismissOtherType[idx] != 0)) { trooptype = Options.TrainOptions.DismissOtherType[idx]; to_dismiss = parseIntNan(Seed.units['city' + cityId]['unt' + Options.TrainOptions.DismissOtherType[idx]]) - parseIntNan(Options.TrainOptions.KeepOther[idx]); } // Other
		else {
			if (Options.TrainOptions.DismissST[idx] && (parseIntNan(Seed.units['city' + cityId]['unt1']) > parseIntNan(Options.TrainOptions.KeepST[idx]))) { trooptype = 1; to_dismiss = parseIntNan(Seed.units['city' + cityId]['unt1']) - parseIntNan(Options.TrainOptions.KeepST[idx]); } // ST
			else {
				if (Options.TrainOptions.DismissMM[idx] && (parseIntNan(Seed.units['city' + cityId]['unt2']) > parseIntNan(Options.TrainOptions.KeepMM[idx]))) { trooptype = 2; to_dismiss = parseIntNan(Seed.units['city' + cityId]['unt2']) - parseIntNan(Options.TrainOptions.KeepMM[idx]); } // MM
				else {
					if (Options.TrainOptions.DismissSC[idx] && (parseIntNan(Seed.units['city' + cityId]['unt3']) > parseIntNan(Options.TrainOptions.KeepSC[idx]))) { trooptype = 3; to_dismiss = parseIntNan(Seed.units['city' + cityId]['unt3']) - parseIntNan(Options.TrainOptions.KeepSC[idx]); } // SC
					else {
						if (Options.TrainOptions.DismissPK[idx] && (parseIntNan(Seed.units['city' + cityId]['unt4']) > parseIntNan(Options.TrainOptions.KeepPK[idx]))) { trooptype = 4; to_dismiss = parseIntNan(Seed.units['city' + cityId]['unt4']) - parseIntNan(Options.TrainOptions.KeepPK[idx]); } // PK
						else {
							if (Options.TrainOptions.DismissSW[idx] && (parseIntNan(Seed.units['city' + cityId]['unt5']) > parseIntNan(Options.TrainOptions.KeepSW[idx]))) { trooptype = 5; to_dismiss = parseIntNan(Seed.units['city' + cityId]['unt5']) - parseIntNan(Options.TrainOptions.KeepSW[idx]); } // SW
							else {
								if (Options.TrainOptions.DismissAR[idx] && (parseIntNan(Seed.units['city' + cityId]['unt6']) > parseIntNan(Options.TrainOptions.KeepAR[idx]))) { trooptype = 6; to_dismiss = parseIntNan(Seed.units['city' + cityId]['unt6']) - parseIntNan(Options.TrainOptions.KeepAR[idx]); } // AR
							}
						}
					}
				}
			}
		}
		if (trooptype == 0) return; // none selected

		if (num > to_dismiss) { num = to_dismiss; }
		if (((slots_free > 0) || NearlyDone) && (num > 0)) {
			t.Dismiss(cityId, trooptype, num);
			t.autodelay = t.intervalSecs;
		}
	},

	PaintCityInfo: function () {
		var t = Tabs.Train;
		var cityId = t.ModelCityId;

		t.Squire = parseIntNan(Seed.items.i1);
		t.Knight = parseIntNan(Seed.items.i2);
		t.Guinevere = parseIntNan(Seed.items.i3);
		t.Morgana = parseIntNan(Seed.items.i4);
		t.Arthur = parseIntNan(Seed.items.i5);
		t.Merlin = parseIntNan(Seed.items.i6);
		t.Divine = parseIntNan(Seed.items.i7);
		t.Epic = parseIntNan(Seed.items.i8);
		t.Legendary = parseIntNan(Seed.items.i10);

		t.Lancelots = parseIntNan(Seed.items.i36);
		t.Arthurs = parseIntNan(Seed.items.i37);
		t.Merlins = parseIntNan(Seed.items.i38);

		ById('pbtrainUseSHLabel').innerHTML = t.Squire;
		ById('pbtrainUseKHLabel').innerHTML = t.Knight;
		ById('pbtrainUseGHLabel').innerHTML = t.Guinevere;
		ById('pbtrainUseMHLabel').innerHTML = t.Morgana;
		ById('pbtrainUseAHLabel').innerHTML = t.Arthur;
		ById('pbtrainUseRHLabel').innerHTML = t.Merlin;
		ById('pbtrainUseDHLabel').innerHTML = t.Divine;
		ById('pbtrainUseEHLabel').innerHTML = t.Epic;
		ById('pbtrainUseLHLabel').innerHTML = t.Legendary;

		ById('pbtrainUseLTLabel').innerHTML = t.Lancelots;
		ById('pbtrainUseATLabel').innerHTML = t.Arthurs;
		ById('pbtrainUseMTLabel').innerHTML = t.Merlins;

		if (cityId == 0) { return; }
		if (t.serverwait) { return; }

		// paint the Queue...
		// training queue is combined - normal and prestige. That's insane. Let's split them!

		var Buildings = getCityBuildings(cityId);

		var now = unixTime();
		var totTime = 0;
		var totTimeAscension = 0;
		t.Queued = 0;
		t.QueuedAscension = 0;
		t.TotalSlots = Buildings[13].count;
		t.TotalSlotsAscension = Buildings[22].count + Buildings[24].count + Buildings[26].count;
		var q = Seed.queue_unt['city' + cityId];
		t.expireTheQueue(q);

		var q1 = [];
		var q2 = [];

		for (var u in q) {
			if (q[u][0]) {
				if (q[u][7]) { q2.push(q[u]); }
				else { q1.push(q[u]); }
			}
		}

		if (q1 != null && q1.length > 0) {
			totTime = q1[q1.length - 1][3] - now;
			t.Queued = q1.length;
		}
		if (q2 != null && q2.length > 0) {
			totTimeAscension = q2[q2.length - 1][3] - now;
			t.QueuedAscension = q2.length;
		}
		var qs = q.toString();
		if (qs == t.LastQueue) { // queue hasn't changed, just update the time of the current item(s)
			if (q1 != null && q1.length > 0) {
				var cur = q1[0][3] - now;
				ById('btTrnQueueRemaining').innerHTML = timestr(cur, true);
			}
			if (q2 != null && q2.length > 0) {
				var cur = q2[0][3] - now;
				ById('btAscTrnQueueRemaining').innerHTML = timestr(cur, true);
			}
			if ((!q1 || q1.length == 0) && (!q2 || q2.length == 0)) {
				m = '<br><div align=center style="opacity:0.3;">' + tx('No Troops Currently Being Trained') + '</div>';
				ById('btTrnQueue').innerHTML = m;
			}
		} else {
			t.LastQueue = qs;
			m = '';

			if (q1 != null && q1.length > 0) {
				m += '<TABLE width=98% cellspacing=0 align=center class=xtab><tr><th class=xtabHD align=left>' + uW.g_js_strings.openCastle.trooptype + '</th><th class=xtabHD align=right>' + tx('Amount') + '</th><th class=xtabHD align=right>' + tx('Total Time') + '</th><th class=xtabHD align=right>' + tx('Remaining') + '</th><th class=xtabHD align=right>' + tx('Tuteleges') + '</th><th class=xtabHD align=right>' + tx('Hourglasses') + '</th><th class=xtabHD align=right><a id=btTrnCancelAllButton class="inlineButton btButton red14" onclick="btTrnCancelAll(' + cityId + ')"><span>' + tx('Cancel All') + '</span></a></th></tr>';
				t.fixQueTimes(q1);
				first = true;
				var lastEnd = now;
				var r = 0;

				for (var i = 0; i < q.length; i++) {
					if (CM.BarracksUnitsTypeMap.isUnitType(q[i][0], "normal")) {
						start = q[i][2];
						end = q[i][3];
						actual = end - lastEnd;
						if (actual < 0) { actual = 0; }

						rowClass = 'evenRow';
						if (r % 2 == 1) rowClass = 'oddRow';
						if (first) rowClass += ' highRow';

						m += '<TR class="' + rowClass + '"><TD align=left>' + TroopImage(q[i][0]) + uW.unitcost["unt" + q[i][0]][0] + '</td><td align=right>' + addCommas(q[i][1]) + '</td><td align=right>';
						if (first) {
							var tutes = '<table cellspacing=0 cellpadding=0><tr>';
							tutes += t.dspHG(cityId, q[i][0], i, 36, t.Lancelots);
							tutes += t.dspHG(cityId, q[i][0], i, 37, t.Arthurs);
							tutes += t.dspHG(cityId, q[i][0], i, 38, t.Merlins);
							tutes += '</tr></table>'

							var Speedups = '<table cellspacing=0 cellpadding=0><tr>';
							Speedups += t.dspHG(cityId, q[i][0], i, 1, t.Squire);
							Speedups += t.dspHG(cityId, q[i][0], i, 2, t.Knight);
							Speedups += t.dspHG(cityId, q[i][0], i, 3, t.Guinevere);
							Speedups += t.dspHG(cityId, q[i][0], i, 4, t.Morgana);
							Speedups += t.dspHG(cityId, q[i][0], i, 5, t.Arthur);
							Speedups += '</tr><tr>';
							Speedups += t.dspHG(cityId, q[i][0], i, 6, t.Merlin);
							Speedups += t.dspHG(cityId, q[i][0], i, 7, t.Divine);
							Speedups += t.dspHG(cityId, q[i][0], i, 8, t.Epic);
							Speedups += t.dspHG(cityId, q[i][0], i, 10, t.Legendary);
							Speedups += '</tr></table>'

							m += timestr(end - start, true) + '</td><TD align=right><SPAN id=btTrnQueueRemaining>' + timestr(actual, true) + '</span></td><td align=right>' + tutes + '</td><td align=right>' + Speedups + '</td>';
						}
						else { m += timestr(actual, true) + '</td><td align=right>&nbsp;</td><td align=center>&nbsp;</td><td align=center>&nbsp;</td>'; }
						m += '<td align=right><A class="inlineButton btButton brown11" onclick="cancelTrain(' + q[i][0] + ',' + q[i][1] + ',' + q[i][2] + ',' + q[i][3] + ',' + q[i][5] + ',' + cityId + ',' + i + ')"><span>' + uW.g_js_strings.commonstr.cancel + '</span></a></td></tr>'
						lastEnd = end;
						first = false;
						r++;
					}
				}
			}
			if (q2 != null && q2.length > 0) {
				if (!q1 || q1.length == 0) {
					m += '<TABLE width=98% cellspacing=0 align=center class=xtab><tr><th class=xtabHD align=left>' + tx('Ascension') + '</th><th class=xtabHD align=right>' + uW.g_js_strings.commonstr.amount + '</th><th class=xtabHD align=right>' + tx('Total Time') + '</th><th class=xtabHD align=right>' + tx('Remaining') + '</th><th class=xtabHD align=right>' + tx('Tuteleges') + '</th><th class=xtabHD align=right>' + tx('Hourglasses') + '</th><th class=xtabHD align=right><a id=btTrnCancelAllButton class="inlineButton btButton red14" onclick="btTrnCancelAll(' + cityId + ')"><span>' + tx('Cancel All') + '</span></a></th></tr>';
				}
				else {
					m += '<tr><th class=xtabHD align=left>' + tx('Ascension') + '</th><th class=xtabHD align=right>' + uW.g_js_strings.commonstr.amount + '</th><th class=xtabHD align=right>' + tx('Total Time') + '</th><th class=xtabHD align=right>' + tx('Remaining') + '</th><th class=xtabHD align=right>' + tx('Tuteleges') + '</th><th class=xtabHD align=right>' + tx('Hourglasses') + '</th><th class=xtabHD align=right>&nbsp;</th></tr>';
				}
				t.fixQueTimes(q2);
				first = true;
				var lastEnd = now;
				var r = 0;

				for (var i = 0; i < q.length; i++) {
					if (!CM.BarracksUnitsTypeMap.isUnitType(q[i][0], "normal")) {
						start = q[i][2];
						end = q[i][3];
						actual = end - lastEnd;
						if (actual < 0) { actual = 0; }

						rowClass = 'evenRow';
						if (r % 2 == 1) rowClass = 'oddRow';
						if (first) rowClass += ' highRow';

						m += '<TR class="' + rowClass + '"><TD align=left>' + TroopImage(q[i][0]) + uW.unitcost["unt" + q[i][0]][0] + '</td><td align=right>' + addCommas(q[i][1]) + '</td><td align=right>';
						if (first) {
							var tutes = '<table cellspacing=0 cellpadding=0><tr>';
							tutes += t.dspHG(cityId, q[i][0], i, 36, t.Lancelots);
							tutes += t.dspHG(cityId, q[i][0], i, 37, t.Arthurs);
							tutes += t.dspHG(cityId, q[i][0], i, 38, t.Merlins);
							tutes += '</tr></table>'

							var Speedups = '<table cellspacing=0 cellpadding=0><tr>';
							Speedups += t.dspHG(cityId, q[i][0], i, 1, t.Squire);
							Speedups += t.dspHG(cityId, q[i][0], i, 2, t.Knight);
							Speedups += t.dspHG(cityId, q[i][0], i, 3, t.Guinevere);
							Speedups += t.dspHG(cityId, q[i][0], i, 4, t.Morgana);
							Speedups += t.dspHG(cityId, q[i][0], i, 5, t.Arthur);
							Speedups += '</tr><tr>';
							Speedups += t.dspHG(cityId, q[i][0], i, 6, t.Merlin);
							Speedups += t.dspHG(cityId, q[i][0], i, 7, t.Divine);
							Speedups += t.dspHG(cityId, q[i][0], i, 8, t.Epic);
							Speedups += t.dspHG(cityId, q[i][0], i, 10, t.Legendary);
							Speedups += '</tr></table>'

							m += timestr(end - start, true) + '</td><TD align=right><SPAN id=btAscTrnQueueRemaining>' + timestr(actual, true) + '</span></td><td align=right>' + tutes + '</td><td align=right>' + Speedups + '</td>';
						}
						else { m += timestr(actual, true) + '</td><td align=right>&nbsp;</td><td align=center>&nbsp;</td><td align=center>&nbsp;</td>'; }
						m += '<td align=right><A class="inlineButton btButton brown11" onclick="cancelTrain(' + q[i][0] + ',' + q[i][1] + ',' + q[i][2] + ',' + q[i][3] + ',' + q[i][5] + ',' + cityId + ',' + i + ')"><span>' + uW.g_js_strings.commonstr.cancel + '</span></a></td></tr>'
						lastEnd = end;
						first = false;
						r++;
					}
				}
			}
			if ((!q1 || q1.length == 0) && (!q2 || q2.length == 0)) {
				m = '<br><div align=center style="opacity:0.3;">' + tx('No Troops Currently Being Trained') + '</div>';
			}
			else {
				m += '</table><div align=center id=btTrnQueueMessage>&nbsp;</div>';
			}
			ById('btTrnQueue').innerHTML = m;
			ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		}
		m = t.Queued + ' ' + uW.g_js_strings.commonstr.of + ' ' + t.TotalSlots;
		if (totTime > 0)
			m += ', ' + uW.timestr(totTime);
		ById('btTrnQueueStats').innerHTML = m;

		// paint info into the city panel...

		var unitId = ById('btTrnType').value;
		var unitOwned = getCityTroops(unitId, cityId, true);
		t.MaxTroopTrain = 0;
		if (t.CheckCanTrain(unitId, cityId)) {
			var workers = 0;
			if (Options.TrainOptions.ManualWorkers) workers = 100;
			t.MaxTroopTrain = t.getMaxTrain(unitId, cityId, false, workers, ById('btTrnGamble').value);
		}

		ById('btTrnMax').innerHTML = uW.g_js_strings.commonstr.max + ':&nbsp;' + t.MaxTroopTrain + ',&nbsp;' + uW.g_js_strings.commonstr.owned + ':&nbsp;' + unitOwned;

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "normal")) {
			ById('btTrnMaxSlots').innerHTML = t.TotalSlots - t.Queued;
		}
		else {
			ById('btTrnMaxSlots').innerHTML = t.TotalSlotsAscension - t.QueuedAscension;
		}
		var slots = Math.max(parseIntNan(ById('btTrnNumSlots').value), 0);
		ById('btTrnMaxPerSlot').innerHTML = parseIntNan(t.MaxTroopTrain / slots);

		// paint the requirements...

		t.paintRequirements(unitId);
	},

	dspHG: function (cityId, qitem, i, item, count) {
		var t = Tabs.Train;
		var n = '';
		if (count > 0) {
			n += '<td class=xtab style="padding-right:2px;padding-bottom:2px;"><a onClick="speedupTraining(' + cityId + ',' + qitem + ',' + item + ',' + i + ')"><img height=20 class="btTop btFaint" src="' + IMGURL + 'items/70/' + item + '.jpg" title="' + itemTitle(item) + '"></a></td>';
		}
		return n;
	},

	paintRequirements: function (unitId) {
		var t = Tabs.Train;
		var cityId = t.ModelCityId;

		var m = '';

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "rare")) {
			m += tx('Troop type cannot be trained');
			ById('btTrnRequirements').innerHTML = m;
			return;
		}

		var ascended = getAscensionValues(cityId);

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "druid") && ascended.prestigeType != 1) {
			m += tx('Troop type can only be trained in Druid cities');
			ById('btTrnRequirements').innerHTML = m;
			return;
		}

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "fey") && ascended.prestigeType != 2) {
			m += tx('Troop type can only be trained in Fey cities');
			ById('btTrnRequirements').innerHTML = m;
			return;
		}

		if (CM.BarracksUnitsTypeMap.isUnitType(unitId, "briton") && ascended.prestigeType != 3) {
			m += tx('Troop type can only be trained in Briton cities');
			ById('btTrnRequirements').innerHTML = m;
			return;
		}

		if (uW.unitcost['unt' + unitId][8] && matTypeof(uW.unitcost['unt' + unitId][8]) === "object") {
			var Buildings = getCityBuildings(cityId);
			for (var b in uW.unitcost['unt' + unitId][8]) {
				var bid = b.split("b")[1];
				var reqlevel = uW.unitcost['unt' + unitId][8][b][1];
				var blvl = Buildings[bid].maxLevel;
				var linestyle = '<span>';
				if (blvl < reqlevel) {
					linestyle = '<span style="color:#800;"><b>';
					m += linestyle + 'Level ' + reqlevel + ' ' + uW.buildingcost['bdg' + bid][0] + '</b></span><br>';
				}
			}
		}

		if (uW.unitcost['unt' + unitId][9] && matTypeof(uW.unitcost['unt' + unitId][9]) === "object") {
			for (var r in uW.unitcost['unt' + unitId][9]) {
				var rid = r.split("t")[1];
				var reqlevel = uW.unitcost['unt' + unitId][9][r][1];
				var rlvl = Seed.tech['tch' + rid];
				var linestyle = '<span>';
				if (rlvl < reqlevel) {
					linestyle = '<span style="color:#800;"><b>';
					m += linestyle + 'Level ' + reqlevel + ' ' + uW.techcost['tch' + rid][0] + '</b></span><br>';
				}
			}
		}

		m += '<table class=xtab cellpadding=0 cellspacing=0 width=100%>';

		if (uW.unitcost['unt' + unitId][6] != 0) {
			m += '<tr><td>';
			m += ResourceImage(PopulationImage, uW.g_js_strings.commonstr.population);
			var reqlevel = uW.unitcost['unt' + unitId][6] * parseIntNan(ById('btTrnNumPerSlot').value);
			if (Options.TrainOptions.ManualWorkers) {
				var plvl = parseIntNan(Seed.citystats["city" + cityId]["pop"][0]);
			}
			else {
				var plvl = parseIntNan(Seed.citystats["city" + cityId]["pop"][0]) - parseIntNan(Seed.citystats["city" + cityId]["pop"][3]);
			}
			var linestyle = '<span>';
			if ((plvl <= reqlevel) || (t.limitingFactor == "pop")) {
				linestyle = '<span style="color:#800;"><b>';
			}
			m += '</td><td>' + linestyle + addCommas(reqlevel) + ' / ' + addCommas(plvl) + '</b></span></td></tr>';
		}

		var gambleFactor = 1;
		if (ById('btTrnGamble').value > 0)
			gambleFactor = t.gamble[ById('btTrnGamble').value].cost;

		for (var r = 1; r < 5; r++) {
			if (uW.unitcost['unt' + unitId][r] != 0) {
				m += '<tr><td>';
				if (r == 1) { m += ResourceImage(FoodImage, uW.g_js_strings.commonstr.food); }
				else {
					if (r == 2) { m += ResourceImage(WoodImage, uW.g_js_strings.commonstr.wood); }
					else {
						if (r == 3) { m += ResourceImage(StoneImage, uW.g_js_strings.commonstr.stone); }
						else {
							if (r == 4) { m += ResourceImage(OreImage, uW.g_js_strings.commonstr.ore); }
						}
					}
				}
				var reqlevel = uW.unitcost['unt' + unitId][r] * parseIntNan(ById('btTrnNumPerSlot').value) * gambleFactor;
				var rlvl = parseIntNan(Seed.resources['city' + cityId]['rec' + r][0] / 3600);
				var linestyle = '<span>';
				if ((rlvl <= reqlevel) || (t.limitingFactor == uW.resourceinfo['rec' + r])) {
					linestyle = '<span style="color:#800;"><b>';
				}
				m += '</td><td>' + linestyle + addCommas(reqlevel) + ' / ' + addCommas(rlvl) + '</b></span></td></tr>';
			}
		}

		if (uW.unitcost['unt' + unitId][11] && matTypeof(uW.unitcost['unt' + unitId][11]) === "object") {
			for (var r in uW.unitcost['unt' + unitId][11]) {
				var iid = r;
				var reqlevel = uW.unitcost['unt' + unitId][11][r] * parseIntNan(ById('btTrnNumPerSlot').value);
				var ilvl = parseIntNan(Seed.items['i' + iid]);
				var linestyle = '<span>';
				if ((ilvl <= reqlevel) || (iid == 34001 && t.limitingFactor == "yew") || (iid == 34003 && t.limitingFactor == "corrupter")) {
					linestyle = '<span style="color:#800;"><b>';
				}
				m += '<tr><td>' + ResourceImage(getItemImageURL(iid), uW.itemlist['i' + iid].name) + '</td><td>';
				m += linestyle + addCommas(reqlevel) + ' / ' + addCommas(ilvl) + '</b></span></td></tr>';
			}
		}
		m += '</table>';

		var perSlot = parseIntNan(ById('btTrnNumPerSlot').value);
		if (perSlot != 0) {
			var time = t.getTrainTime(cityId, unitId, perSlot);
			if (ById('btTrnGamble').value > 0) {
				var timemin = time * t.gamble[ById('btTrnGamble').value].factor1;
				var timemax = time * t.gamble[ById('btTrnGamble').value].factor2;
				m += '<br>' + tx('Estimated Time') + ':&nbsp;' + timestr(timemin) + ' - ' + timestr(timemax);
			}
			else {
				m += '<br>' + tx('Estimated Time') + ':&nbsp;' + timestr(time);
			}
		}

		ById('btTrnRequirements').innerHTML = m;
	},

	cancelAll: function (cityId, silent) {
		var t = Tabs.Train;

		jQuery('#btTrnCancelAllButton').addClass("disabled");
		var delayer = 0;
		var q = Seed.queue_unt['city' + cityId];
		for (var i = q.length - 1; i >= 0; i--) {
			delayer = delayer + 1;
			setTimeout(t.cancelTrain, (1000 * delayer), q[i][0], q[i][1], q[i][2], q[i][3], q[i][5], cityId, i, silent); // spread them out ...
		}
		delayer = delayer + 1;
		setTimeout(function () { jQuery('#btTrnCancelAllButton').removeClass("disabled"); }, (1000 * delayer));
	},

	cancelTrain: function (typetrn, numtrptrn, trnTmp, trnETA, trnNeeded, cityId, trainingId, silent) {
		var t = Tabs.Train;
		t.serverwait = true;
		if (!silent) ById('btTrnQueueMessage').innerHTML = tx('Cancelling Queued Item...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.requestType = "CANCEL_TRAINING";
		params.cityId = cityId;
		params.typetrn = typetrn;
		params.numtrptrn = numtrptrn;
		params.trnETA = trnETA;
		params.trnTmp = trnTmp;
		params.trnNeeded = trnNeeded;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/cancelTraining.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var isPrestigeQueue = Seed.queue_unt["city" + cityId][trainingId][7];
					var k = 0;
					for (var j = 0; j < Seed.queue_unt["city" + cityId].length; j++) {
						if (j > trainingId && (Seed.queue_unt["city" + cityId][j][7] === isPrestigeQueue)) {
							Seed.queue_unt["city" + cityId][j][2] = parseInt(rslt.dateTraining[k]["start"]);
							Seed.queue_unt["city" + cityId][j][3] = parseInt(rslt.dateTraining[k]["end"]);
							k++;
						}
					}
					Seed.queue_unt["city" + cityId].splice(trainingId, 1);
					for (var i = 1; i < 5; i++) {
						var totalReturn = parseInt(uW.unitcost["unt" + typetrn][i]) * parseInt(numtrptrn) * 3600 / 2;
						Seed.resources["city" + cityId]["rec" + i][0] = parseInt(Seed.resources["city" + cityId]["rec" + i][0]) + totalReturn;
					}
					t.PaintCityInfo();
				}
				else {
					if (rslt.msg) { if (!silent) { ById('btTrnQueueMessage').innerHTML = '<span style="color:#f00">' + rslt.msg + '</span>'; } }
					else { if (!silent) { ById('btTrnQueueMessage').innerHTML = '<span style="color:#f00">Error cancelling training queue item</span>'; } }
				}
				t.serverwait = false;
			},
			onFailure: function () {
				if (!silent) { ById('btTrnQueueMessage').innerHTML = '<span style="color:#f00;">AJAX Error!</span>'; }
				t.serverwait = false;
			},
		}, true);
	},

	getTrainTime: function (cityId, unitId, num) {
		return getTrainTime(unitId, num, cityId);
	},

	Train: function (cityId, tut, gamble, unitId, num, notify) {
		var t = Tabs.Train;
		var citynum = Cities.byID[cityId].idx + 1;
		jQuery('#btTrnCity_' + citynum).css('color', 'green');
		var time = t.getTrainTime(cityId, unitId, num);

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.type = unitId;
		params.quant = num;
		params.items = tut;
		params.gambleId = gamble;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/train.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					actionLog(Cities.byID[cityId].name + ': Training ' + num + ' ' + uW.unitcost['unt' + unitId][0], 'TRAINING');
					var Prestige = (!CM.BarracksUnitsTypeMap.isUnitType(unitId, "normal"));
					var MORE_WITH_LESS_FACTOR = CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().MORE_WITH_LESS, cityId, uWCloneInto({ unitid: unitId }));
					var resourceFactors = [];
					var resourceLost;
					time = rslt.timeNeeded;
					for (var i = 1; i < 5; i++) {
						if (rslt.gamble) {
							resourceFactors.push(rslt.gamble[i.toString()])
						} else {
							resourceFactors.push(1)
						}
						resourceLost = Math.ceil(parseInt(uW.unitcost["unt" + unitId][i]) * MORE_WITH_LESS_FACTOR) * 3600 * parseInt(num);
						resourceLost = resourceLost * parseIntNan(resourceFactors[i - 1]);
						Seed.resources["city" + cityId]["rec" + i][0] = parseInt(Seed.resources["city" + cityId]["rec" + i][0]) - resourceLost;
					}
					jQuery.each(uW.unitcost["unt" + unitId][11], function (itemId, itemQuantity) {
						uW.ksoItems[+itemId].subtract(+itemQuantity * num);
						uW.seed.items['i' + itemId] = parseInt(uW.seed.items['i' + itemId]) - (itemQuantity * num);
					});

					Seed.citystats["city" + cityId].gold[0] = parseInt(Seed.citystats["city" + cityId].gold[0]) - parseInt(uW.unitcost["unt" + unitId][5]) * parseInt(num);
					Seed.citystats["city" + cityId].pop[0] = Seed.citystats["city" + cityId].pop[0] - Math.ceil(parseInt(uW.unitcost["unt" + unitId][6]) * MORE_WITH_LESS_FACTOR) * parseInt(num);
					Seed.queue_unt["city" + cityId].push(uWCloneInto([unitId, num, rslt.initTS, parseInt(rslt.initTS) + rslt.timeNeeded, 0, rslt.timeNeeded, null, Prestige]));
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name + ': Failed to train ' + num + ' ' + uW.unitcost['unt' + unitId][0] + ' (' + rslt.msg + ')', 'TRAINING');
					}
					else {
						actionLog(Cities.byID[cityId].name + ': Failed to train ' + num + ' ' + uW.unitcost['unt' + unitId][0] + ' (' + rslt.error_code + ')', 'TRAINING');
					}
				}
				jQuery('#btTrnCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
				if (notify) { notify(rslt); }
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': Failed to train ' + num + ' ' + uW.unitcost['unt' + unitId][0] + ' (Ajax Error)', 'TRAINING');
				jQuery('#btTrnCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
				if (notify) { notify({ msg: tx('AJAX error') }); }
			},
		}, true); // noretry
	},

	Dismiss: function (cityId, unitId, num) {
		var t = Tabs.Train;
		var citynum = Cities.byID[cityId].idx + 1;
		jQuery('#btTrnCity_' + citynum).css('color', 'red');

		var cur_idle_pop = (parseInt(Seed.citystats['city' + cityId].pop[0])).toFixed(0); // manually keep track of pop, because the server can't seem to do it

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.type = unitId;
		params.quant = num;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/dismissUnits.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					actionLog(Cities.byID[cityId].name + ': Dismissed ' + addCommas(num) + ' ' + uW.unitcost['unt' + unitId][0], 'TRAINING');
					Seed.units['city' + cityId]['unt' + unitId] -= parseInt(num);
					Seed.citystats['city' + cityId].pop[0] = parseInt(cur_idle_pop) + parseInt(num); // manually add pop because server doesn't always return pop correctly
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name + ': Failed to dismiss ' + num + ' ' + uW.unitcost['unt' + unitId][0] + ' (' + rslt.msg + ')', 'TRAINING');
					}
					else {
						actionLog(Cities.byID[cityId].name + ': Failed to dismiss ' + num + ' ' + uW.unitcost['unt' + unitId][0] + ' (' + rslt.error_code + ')', 'TRAINING');
					}
				}
				jQuery('#btTrnCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': Failed to dismiss ' + num + ' ' + uW.unitcost['unt' + unitId][0] + ' (Ajax Error)', 'TRAINING');
				jQuery('#btTrnCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			},
		}, true);
	},

	Fertilize: function (cityId) {
		var t = Tabs.Train;
		var citynum = Cities.byID[cityId].idx + 1;
		jQuery('#btTrnCity_' + citynum).css('color', 'magenta');

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fertilizePeople.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					actionLog(Cities.byID[cityId].name + ': Fertile Winds used', 'TRAINING');
					uW.ksoItems[351].subtract();
					Seed.items.i351 = (parseInt(Seed.items.i351) - 1).toString();
					t.PaintOverview();
					t.PaintCityInfo();
				}
				else {
					if (rslt.msg) {
						actionLog(Cities.byID[cityId].name + ': Failed to use Fertile Winds (' + rslt.msg + ')', 'TRAINING');
					}
					else {
						actionLog(Cities.byID[cityId].name + ': Failed to use Fertile Winds (' + rslt.error_code + ')', 'TRAINING');
					}
				}
				jQuery('#btTrnCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': Failed to use Fertile Winds (Ajax Error)', 'TRAINING');
				jQuery('#btTrnCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			}
		}, true);
	},

	speedupTraining: function (cityId, unitId, itemId, trainingId, auto) {
		var t = Tabs.Train;
		t.serverwait = true;
		if (!auto && ById('btTrnQueueMessage')) ById('btTrnQueueMessage').innerHTML = tx('Speeding up Training...');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.iid = itemId;
		params.uid = unitId;
		params.apothecary = false;
		new AjaxRequest(uW.g_ajaxpath + "ajax/speedupTraining.php" + uW.g_ajaxsuffix, { // don't use MyAjaxRequest here, for some reason it fails
			method: "post",
			parameters: params,
			onSuccess: function (transport) {
				var rslt = eval("(" + transport.responseText + ")");
				if (rslt.ok) {
					Seed.queue_unt["city" + cityId][trainingId][2] = parseInt(rslt.dateTrainingStart);
					Seed.queue_unt["city" + cityId][trainingId][3] = parseInt(rslt.dateTraining);
					Seed.items["i" + itemId] = parseInt(Seed.items["i" + itemId]) - 1;
					uW.ksoItems[itemId].subtract();
					if (rslt.updateCityUnits) {
						var a = rslt.updateCityUnits;
						var g = Object.keys(a);
						for (var c = 0; c < g.length; c++) {
							var f = Object.keys(a[g[c]]);
							var e = g[c].split("c")[1];
							for (var b = 0; b < f.length; b++) {
								var d = f[b].split("u")[1];
								Seed.units["city" + e]["unt" + d] = parseInt(a[g[c]][f[b]])
							}
						}
					}
					if (!auto) t.PaintCityInfo();
				}
				else {
					if (rslt.msg) {
						if (!auto && ById('btTrnQueueMessage')) { ById('btTrnQueueMessage').innerHTML = '<span style="color:#f00">' + rslt.msg + '</span>'; }
						else { actionLog(Cities.byID[cityId].name + ": " + rslt.msg, 'TRAINING'); }
					}
					else {
						if (!auto && ById('btTrnQueueMessage')) { ById('btTrnQueueMessage').innerHTML = '<span style="color:#f00">' + tx('Error speeding up training') + '</span>'; }
						else { actionLog(Cities.byID[cityId].name + ": " + tx('Error speeding up training'), 'TRAINING'); }
					}
				}
				t.serverwait = false;
			},
			onFailure: function () {
				if (!auto && ById('btTrnQueueMessage')) { ById('btTrnQueueMessage').innerHTML = '<span style="color:#f00;">AJAX Error!</span>'; }
				else { actionLog(Cities.byID[cityId].name + ": AJAX Error!", 'TRAINING'); }
				t.serverwait = false;
			},
		}, true);
	},

}
