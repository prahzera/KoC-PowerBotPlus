/** Overview Tab **/

Tabs.OverView = {
	tabOrder: 1000,
	tabLabel: 'Overview',
	unitsarr: [],
	rownum: 0,
	myDiv: null,
	LoopCounter: 0,
	resTotal: {},
	troopTotal: {},
	aethercap: 0,

	Options: {
		OverviewFontSize: 9,
		AllowOverflow: false,
		includeDefending: false,
		includeMarching: true,
		includeTraining: false,
		includeTrainingExt: true,
		enableFoodWarn: true,
		FoodWarnHours: 1,
		Report: false,
		ReportInterval: 12,
		LastReport: 0,
		LastReportStatus: { 1: [0, 0, 0, 0, 0, 0], 2: [0, 0, 0, 0, 0, 0], 3: [0, 0, 0, 0, 0, 0], 4: [0, 0, 0, 0, 0, 0], 5: [0, 0, 0, 0, 0, 0], 6: [0, 0, 0, 0, 0, 0], 7: [0, 0, 0, 0, 0, 0], 8: [0, 0, 0, 0, 0, 0] }, // food,wood,stone,ore,aether,gold
	},

	init: function (div) {
		var t = Tabs.OverView;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			t.unitsarr.push(i);
		}
		t.myDiv = div;

		t.aethercap = CM.WorldSettings.getSetting("DARK_FOREST_AETHERSTONE_CAP") || 5000000;

		if (!Options.OverviewOptions) {
			Options.OverviewOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.OverviewOptions.hasOwnProperty(y)) {
					Options.OverviewOptions[y] = t.Options[y];
				}
			}
		}

		t.sendReport(); // check every refresh
	},

	show: function () {
		var t = Tabs.OverView;

		m = '<div>';
		m += '<div class="divHeader" align="center">' + tx('OVERVIEW') + '</div>';
		m += '<div align="center">';
		m += '<DIV id=ptOverviewDiv style="max-height:700px;overflow-y:scroll;width:' + GlobalOptions.btWinSize.x + 'px;overflow-x:scroll;"></div></div>';

		m += '<a id=ptOverOptionLink class=divLink ><div class="divHeader" align="left"><img id=ptOverOptionArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('OVERVIEW OPTIONS') + '</div></a>';
		m += '<div id=ptOverOption class=divHide><TABLE width="100%">';
		m += '<TR><td class=xtab>&nbsp;</td><td class=xtab>' + tx('Font size') + ': ' + htmlSelector({ 8: 8, 9: 9, 10: 10, 11: 11 }, Options.OverviewOptions.OverviewFontSize, 'id=ptOverviewFont class=btInput') + '&nbsp;' + tx('pixels') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT type=CHECKBOX id=ptOverOver' + (Options.OverviewOptions.AllowOverflow ? ' CHECKED' : '') + '></td><td class=xtab>' + tx('Expand window width to fit') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT type=CHECKBOX id=ptOverDefend' + (Options.OverviewOptions.includeDefending ? ' CHECKED' : '') + '></td><td class=xtab>' + tx('Include Defending Troops') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT type=CHECKBOX id=ptOverMarch' + (Options.OverviewOptions.includeMarching ? ' CHECKED' : '') + '></td><td class=xtab>' + tx('Include Marching Troops/Resources') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT type=CHECKBOX id=ptOverIncTrain' + (Options.OverviewOptions.includeTraining ? ' CHECKED' : '') + '></td><td class=xtab>' + tx('Include Troops in Training (in Cities)') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT type=CHECKBOX id=ptOverIncTrainExt' + (Options.OverviewOptions.includeTrainingExt ? ' CHECKED' : '') + '></td><td class=xtab>' + tx('Include Troops in Training (Total)') + '</td></tr>';
		m += '<TR><TD class=xtab><INPUT id=ptEnableFoodWarn type=checkbox' + (Options.OverviewOptions.enableFoodWarn ? ' CHECKED' : '') + '></td><TD class=xtab>' + tx('Show \'Food left\' in RED if food will run out in less than') + '&nbsp;';
		m += '<INPUT id=ptFoodHours type=text size=2 value="' + Options.OverviewOptions.FoodWarnHours + '">&nbsp;' + tx('hours') + '</td></tr>';
		m += '<tr><td class=xtab><INPUT id=ptOverReport type=checkbox ' + (Options.OverviewOptions.Report ? ' CHECKED' : '') + '\></td><TD class=xtab>' + tx("Send resource report every") + '&nbsp;<INPUT id=ptOverReportInterval value=' + Options.OverviewOptions.ReportInterval + ' type=text size=3 \>&nbsp;' + tx('hours') + '&nbsp;&nbsp;&nbsp;' + strButton8(tx('Send Now'), 'id=ptOverReportSend') + '</td></tr>';
		m += '</table></div><br>';

		t.myDiv.innerHTML = m;

		if (Options.OverviewOptions.AllowOverflow) {
			ById('ptOverviewDiv').style.width = 'auto';
		}
		ById('ptOverOptionLink').addEventListener('click', function () { ToggleMainDivDisplay("Overview", 100, GlobalOptions.btWinSize.x, "ptOverOption", false) }, false);

		ById('ptOverOver').addEventListener('click', function (evt) {
			var t = Tabs.OverView;
			var tf = ById('ptOverOver').checked;
			Options.OverviewOptions.AllowOverflow = tf;
			saveOptions();
			if (tf)
				ById('ptOverviewDiv').style.width = 'auto';
			else
				ById('ptOverviewDiv').style.width = GlobalOptions.btWinSize.x;
			t.PaintOverview();
		}, false);

		ToggleOption('OverviewOptions', 'ptOverDefend', 'includeDefending', t.PaintOverview);
		ToggleOption('OverviewOptions', 'ptOverMarch', 'includeMarching', t.PaintOverview);
		ToggleOption('OverviewOptions', 'ptOverIncTrain', 'includeTraining', t.PaintOverview);
		ToggleOption('OverviewOptions', 'ptOverIncTrainExt', 'includeTrainingExt', t.PaintOverview);
		ToggleOption('OverviewOptions', 'ptEnableFoodWarn', 'enableFoodWarn', t.PaintOverview);
		ToggleOption('OverviewOptions', 'ptOverReport', 'Report', t.sendReport);

		ChangeIntegerOption('OverviewOptions', 'ptFoodHours', 'FoodWarnHours', 1, t.PaintOverview);
		ChangeIntegerOption('OverviewOptions', 'ptOverviewFont', 'OverviewFontSize', 9, t.PaintOverview);
		ChangeIntegerOption('OverviewOptions', 'ptOverReportInterval', 'ReportInterval', 12, t.PaintOverview);

		ById('ptOverReportSend').addEventListener('click', function () {
			Options.OverviewOptions.LastReport = 0;
			saveOptions();
			t.sendReport(true);
		}, false);

		t.PaintOverview();
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	postRes: function () {
		var t = Tabs.OverView;
		var msg = ':::. ' + tx('Total Resources') + ' |'
		for (var key in t.resTotal) {
			msg += '||' + key + ': ' + enFilter(addCommas(t.resTotal[key]));
		}
		msg += '|';
		var automsg = sendChat(msg);
	},

	postTroop: function () {
		var t = Tabs.OverView;
		var msg = ':::. ' + tx('Total Troops') + ' |'
		for (var key in t.troopTotal) {
			msg += '||' + key + ': ' + enFilter(addCommas(t.troopTotal[key]));
		}
		msg += '|';
		var automsg = sendChat(msg);
	},

	addListener: function (but, i) {
		var t = Tabs.OverView;
		if (!SelectiveDefending) return;
		but.addEventListener('click', function () { t.ToggleDefenceMode(i) }, false);
	},

	ToggleDefenceMode: function (cityId) {
		var t = Tabs.OverView;
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
				if (rslt.ok) {
					Seed.citystats["city" + cityId].gate = state;
					t.DisplayDefenceMode(cityId);
				}
			},
		});
	},

	DisplayDefenceMode: function (cityId) {
		var t = Tabs.OverView;
		DefState = parseInt(Seed.citystats["city" + cityId].gate);
		if (DefState) DefButtonText = '<a id=ptCityStatus_' + cityId + ' class="inlineButton btButton red20"><span style="font-size:10px;width:60px"><center>' + tx('Defending') + '!</center></span></a>';
		else DefButtonText = '<a id=ptCityStatus_' + cityId + ' class="inlineButton btButton green20"><span style="font-size:10px;width:60px"><center>' + tx('Hiding') + '!</center></span></a>';
		var DefButton = ById('ptCityStatus_' + cityId);
		DefButton.outerHTML = DefButtonText;
		DefButton = ById('ptCityStatus_' + cityId);	// do again because of outerHTML
		t.addListener(DefButton, cityId);
	},

	getMarchInfo: function () {
		var t = Tabs.OverView;
		var ret = {};
		ret.marchUnits = [];
		ret.returnUnits = [];
		ret.resources = [];
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			ret.marchUnits[i] = 0;
			ret.returnUnits[i] = 0;
		}
		for (var i = 0; i <= 5; i++) {
			ret.resources[i] = 0;
		}
		var now = unixTime();
		for (var i = 0; i < Cities.numCities; i++) { // each city
			cityId = Cities.cities[i].id;
			for (var k in Seed.queue_atkp['city' + cityId]) { // each march
				march = local_atkp[k];
				if (typeof (march) == 'object') {
					for (var ui in CM.UNIT_TYPES) {
						ii = CM.UNIT_TYPES[ui];
						ret.marchUnits[ii] += parseIntNan(march['unit' + ii + 'Count']);
						ret.returnUnits[ii] += parseIntNan(march['unit' + ii + 'Return']);
					}
					for (var ii = 1; ii <= 5; ii++) {
						ret.resources[ii] += parseIntNan(march['resource' + ii]);
					}
					ret.resources[0] += parseIntNan(march['gold']);
				}
			}
		}
		return ret;
	},

	getTrainInfo: function () {
		var t = Tabs.OverView;
		var ret = {};
		ret.trainUnts = [];
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			ret.trainUnts[i] = 0;
		}
		var q = Seed.queue_unt;
		for (var i = 0; i < Cities.numCities; i++) { // each city
			cityId = Cities.cities[i].id;
			q = Seed.queue_unt['city' + cityId];
			if (q && q.length > 0) {
				for (var qi = 0; qi < q.length; qi++)
					ret.trainUnts[q[qi][0]] += parseInt(q[qi][1]);
			}
		}
		return ret;
	},

	EverySecond: function () {
		var t = Tabs.OverView;

		t.LoopCounter = t.LoopCounter + 1;
		if (tabManager.currentTab.name == 'OverView' && Options.btWinIsOpen) {
			if (t.LoopCounter % 5 == 1) { // refresh display every 5 seconds
				t.PaintOverview();
			}
		}

		if (t.LoopCounter >= 60) { // functions for every minute
			t.LoopCounter = 0;
			t.sendReport();
		}
	},

	PaintOverview: function () {
		var t = Tabs.OverView;
		var rownum = 0;

		function _row(name, row, noTotal, icon) {
			var t = Tabs.OverView;
			if (rownum++ % 2)
				style = ' class="evenRow"';
			else
				style = ' class="oddRow"';
			var tot = 0;
			var m = [];
			m.push('<TR align=right');
			m.push(style);
			if (noTotal) {
				m.push('><TD colspan=2');
			}
			else {
				m.push('><TD');
			}
			m.push(' style="padding-left: 0px;"');
			m.push('>');
			if (icon) {
				m.push(icon);
			}
			else {
				m.push('<B>' + name + '&nbsp;</B>');
			}
			m.push('</td>');
			if (!noTotal) {
				for (var i = 0; i < row.length; i++)
					tot += row[i];
				m.push('<TD><div class="totalCell xtabBorder">');
				if (name == uW.g_js_strings.commonstr.gold || name == uW.g_js_strings.commonstr.food || name == uW.g_js_strings.commonstr.wood || name == uW.g_js_strings.commonstr.stone || name == uW.g_js_strings.commonstr.ore || name == uW.g_js_strings.commonstr.aetherstone)
					t.resTotal[name] = tot;
				else {
					if (Options.OverviewOptions.includeTrainingExt && Options.OverviewOptions.includeTraining) {
						tot -= row[row.length - 1];
					}
					t.troopTotal[name] = tot;
				}
				m.push(addCommas(tot));
				m.push('</div></td>');
			}
			for (var i = 0; i < row.length; i++) {
				m.push('<TD');
				m.push(style);
				m.push('><div class=xtabBorder>');
				m.push(addCommas(row[i]));
				m.push('</div></td>');
			}
			m.push('</tr>');
			return m.join('');
		}

		m = '<TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=left style="font-size:' + Options.OverviewOptions.OverviewFontSize + 'px;"><TR valign=bottom><td width=20>&nbsp;</td><td align=right width=100><b>' + tx('TOTALS') + '</b></td>';

		for (var i = 0; i < Cities.numCities; i++) {
			var cityId = Cities.cities[i].id;
			var ascended = getAscensionValues(cityId);
			var CityFaction = '';
			if (ascended.isPrestigeCity) {
				CityFaction = getFactionName(ascended.prestigeType) + '&nbsp(' + ascended.prestigeLevel + ')';
			}

			m += '<TD style="font-size:11px;" align=center width=100><B>' + Cities.cities[i].name.substring(0, 12) + '</b><BR>' + coordLink(Cities.cities[i].x, Cities.cities[i].y) + '<BR>' + uW.provincenames['p' + Cities.cities[i].provId] + '<BR>' + CityFaction + '<BR>';
			DefState = parseInt(Seed.citystats["city" + cityId].gate);
			if (DefState) DefButtonText = '<a id=ptCityStatus_' + cityId + ' class="inlineButton btButton red20"><span style="font-size:10px;width:60px"><center>' + tx('Defending') + '!</center></span></a>';
			else DefButtonText = '<a id=ptCityStatus_' + cityId + ' class="inlineButton btButton green20"><span style="font-size:10px;width:60px"><center>' + tx('Hiding') + '!</center></span></a>';
			m += DefButtonText + '</td>';
		}

		if (Options.OverviewOptions.includeMarching) {
			m += '<TD align=right width=100><B>' + tx('Marching') + '</b></td>';
			march = t.getMarchInfo();
		}
		if (Options.OverviewOptions.includeTrainingExt) {
			m += '<TD align=right width=100>&nbsp;</td>';
			train = t.getTrainInfo();
		}
		m += "<td>&nbsp;</td></tr>"; // spacer

		rows = [];
		rows[0] = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			rows[0][i] = parseInt(Seed.citystats['city' + cityId].gold[0]);
		}
		for (var r = 1; r < 5; r++) {
			rows[r] = [];
			for (var i = 0; i < Cities.numCities; i++) {
				cityId = Cities.cities[i].id;
				rows[r][i] = parseInt(Seed.resources['city' + cityId]['rec' + r][0] / 3600);
			}
		}
		rows[5] = [];
		for (var i = 0; i < Cities.numCities; i++) { //Aetherstone
			cityId = Cities.cities[i].id;
			rows[5][i] = parseInt(Seed.resources['city' + cityId]['rec5'][0]);
		}
		if (Options.OverviewOptions.includeMarching) {
			for (var i = 0; i <= 5; i++) {
				rows[i][Cities.numCities] = march.resources[i];
			}
		}

		m += _row(uW.g_js_strings.commonstr.gold, rows[0], false, ResourceImage(GoldImage, uW.g_js_strings.commonstr.gold));
		m += _row(uW.g_js_strings.commonstr.food, rows[1], false, ResourceImage(FoodImage, uW.g_js_strings.commonstr.food));
		m += _row(uW.g_js_strings.commonstr.wood, rows[2], false, ResourceImage(WoodImage, uW.g_js_strings.commonstr.wood));
		m += _row(uW.g_js_strings.commonstr.stone, rows[3], false, ResourceImage(StoneImage, uW.g_js_strings.commonstr.stone));
		m += _row(uW.g_js_strings.commonstr.ore, rows[4], false, ResourceImage(OreImage, uW.g_js_strings.commonstr.ore));
		m += _row(uW.g_js_strings.commonstr.aetherstone, rows[5], false, ResourceImage(AetherImage, uW.g_js_strings.commonstr.aetherstone));

		m += "</tr>";
		m += '<TR><TD>&nbsp;</td><TD align=right><input id=ptpostres style="font-size:9px" type="submit" value="' + tx('Post To Chat') + '"></input></td></tr>';

		row = [];
		var trupkeepreduce = 0;
		trupkeepreduce = Math.min(equippedthronestats(79), uW.cm.thronestats.boosts.Upkeep.Max);
		var trprodres = Math.min(equippedthronestats(82), uW.cm.thronestats.boosts.ResourceProduction.Max);
		var trprod = [0, 0, 0, 0, 0];
		trprod[1] = Math.min(equippedthronestats(83), uW.cm.thronestats.boosts.ResourceProduction.Max) + trprodres;
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var rp = getResourceProduction(cityId);
			var usage = parseIntNan(Seed.resources['city' + cityId]['rec1'][3]);
			var bp = CM.Resources.getProductionBase(1, cityId);
			row[i] = parseIntNan(rp[1] - usage + bp * trprod[1] / 100);
		}
		m += _row(uW.g_js_strings.commonstr.food + ' +/-', row, true);
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			if (row[i] >= 0)
				row[i] = '----';
			else {
				var timeLeft = parseInt(Seed.resources["city" + cityId]['rec1'][0]) / 3600 / (0 - row[i]) * 3600;
				if (timeLeft > 86313600)
					row[i] = '----';
				else {
					if (Options.OverviewOptions.enableFoodWarn && timeLeft < (Options.OverviewOptions.FoodWarnHours * 3600))
						row[i] = '<SPAN class=whiteOnRed>' + timestrShort(timeLeft) + '</span>';
					else
						row[i] = timestrShort(timeLeft);
				}
			}
		}
		m += _row(tx('Food left'), row, true);

		var bonus = 1 + (CM.ThroneController.getBoundedEffect(111) / 100);
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var raid = 0;
			for (var mid in Seed.queue_atkp["city" + cityId]) {
				var citymarch = Seed.queue_atkp["city" + cityId][mid];
				if (citymarch.marchType == 9 && (citymarch.botMarchStatus < 3 || citymarch.botMarchStatus == 7)) { // running or resting...
					var foodres = citymarch.toTileLevel * 115000;
					if (citymarch.toTileLevel == 12) foodres = 1400000;
					if (citymarch.toTileLevel == 13) foodres = 1540000;
					if (citymarch.toTileLevel == 14) foodres = 1700000;
					if (citymarch.toTileLevel == 15) foodres = 2000000;
					var retUT = citymarch.returnUnixTime;
					if (isNaN(retUT)) { retUT = citymarch.returnEta; }
					var roundtrip = parseIntNan(retUT - citymarch.marchUnixTime);
					var raidres = 0;
					if (roundtrip != 0) { raidres = 3600 / (roundtrip) * foodres * bonus; }
					raid += raidres;
				}
			}
			row[i] = parseInt(raid);
		}
		m += _row(tx('Raids (hr)'), row, true);

		row = [];
		var baseSthProt = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			baseSthProt[i] = StorehouseLevels[parseIntNan(getUniqueCityBuilding(cityId, 9).maxLevel)];
			//tch14 = shrinking powder..
			var SthPrtResearch = parseIntNan(Seed.tech.tch14)
			var TRStHsBoost = Math.min(equippedthronestats(89) + equippedthronestats(167), uW.cm.thronestats.boosts.Storehouse.Max);
			var totalSthPrt = []
			var researchToApply = ((SthPrtResearch / 10) + 1)
			var TRBoostToApply = ((TRStHsBoost / 100) + 1)
			if (TRStHsBoost == 0) TRStHsBoost = 1
			totalSthPrt[i] = addCommas(parseInt((baseSthProt[i] * researchToApply) * TRBoostToApply))
			row[i] = totalSthPrt[i]
		}
		m += _row(uW.buildingcost.bdg9[0], row, true)

		row = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var aethcapinc = 0;
			aethcapinc += equippedthronestats(88);
			var currSet = getFactionBonus(Seed.throne.activeSlot);
			if (currSet.hazBonus && currSet.faction === "fey") {
				aethcapinc += CM.ThroneController.effectBonus(95);
			}
			var aethercap = Math.round(t.aethercap * (1 + Math.min(aethcapinc, uW.cm.thronestats.boosts["ResourceCap"].Max) / 100));
			aethercap = aethercap + Math.round(aethercap * Dashboard.GetArcanaEffect(42008, i) / 100);
			row[i] = addCommas(aethercap);
		}
		m += _row(tx('Aether Limit'), row, true)
		m += '<TR valign=bottom><td width=20>&nbsp;</td><td align=right width=100>&nbsp;</td>';
		for (var i = 0; i < Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><B>' + Cities.cities[i].name.substring(0, 12) + '</b></td>';
		}
		if (Options.OverviewOptions.includeMarching) {
			m += '<TD align=right width=100><B>' + tx('Marching') + '</b></td>';
		}
		if (Options.OverviewOptions.includeTrainingExt) {
			m += '<TD align=right width=100><B>' + tx('Training') + '</b></td>';
		}
		m += "<td>&nbsp;</td></tr>";

		for (var r = 1; r < t.unitsarr.length + 1; r++) {
			rows[r] = [];
			for (var i = 0; i < Cities.numCities; i++) {
				cityId = Cities.cities[i].id;
				rows[r][i] = parseIntNan(Seed.units['city' + cityId]['unt' + t.unitsarr[r - 1]]);
				if (SelectiveDefending && Options.OverviewOptions.includeDefending) rows[r][i] += parseIntNan(Seed.defunits['city' + cityId]['unt' + t.unitsarr[r - 1]]);
			}
		}
		var colnum = Cities.numCities;
		if (Options.OverviewOptions.includeMarching) {
			for (var i = 1; i < t.unitsarr.length + 1; i++) {
				rows[i][colnum] = parseIntNan(march.marchUnits[t.unitsarr[i - 1]]);
			}
			colnum++;
		}
		if (Options.OverviewOptions.includeTrainingExt) {
			for (var i = 1; i < t.unitsarr.length + 1; i++) {
				rows[i][colnum] = parseIntNan(train.trainUnts[t.unitsarr[i - 1]]);
			}
		}
		if (Options.OverviewOptions.includeTraining) {
			var q = Seed.queue_unt;
			for (var i = 0; i < Cities.numCities; i++) {
				cityId = Cities.cities[i].id;
				q = Seed.queue_unt['city' + cityId];
				if (q && q.length > 0) {
					for (var qi = 0; qi < q.length; qi++) {
						qr = q[qi][0];
						if (qr >= 19) qr = qr - 2;
						rows[qr][i] += parseIntNan(q[qi][1]);
					}
				}
			}
		}
		rownum = 0;
		for (var j = 1; j < t.unitsarr.length + 1; j++) {
			m += _row(uW.unitcost['unt' + t.unitsarr[j - 1]][0], rows[j], false, TroopImage(t.unitsarr[j - 1]));
		}
		m += '<TR><TD>&nbsp;</td><TD align=right><input id=ptposttroop style="font-size:9px" type="submit" value="' + tx('Post To Chat') + '"></input></td>';
		for (var i = 0; i < Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><B>' + Cities.cities[i].name.substring(0, 12) + '</b></td>';
		}
		m += '</tr>';

		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var tower = Seed.buildings['city' + cityId].pos99;
			if (tower) tower = parseInt(Seed.buildings['city' + cityId].pos99[1])
			if (!tower)
				row[i] = '<SPAN class=boldRed><B>' + uW.g_js_strings.commonstr.none + '!</b></span>';
			else
				row[i] = 'Level ' + tower;
		}
		m += _row(tx('Def. Tower'), row, true);

		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var tower = Seed.buildings['city' + cityId].pos98;
			if (tower) tower = parseInt(Seed.buildings['city' + cityId].pos98[1])
			if (!tower)
				row[i] = '<SPAN class=boldRed><B>' + uW.g_js_strings.commonstr.none + '!</b></span>';
			else
				row[i] = 'Level ' + tower;
		}
		m += _row(tx('Redoubt Tower'), row, true);

		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var marches = March.getMarchSlots(cityId);
			var maxmarches = March.getTotalSlots(cityId);
			if (marches >= maxmarches)
				row[i] = '<SPAN class=boldRed><B>' + marches + '/' + maxmarches + '</b></span>';
			else
				row[i] = marches + '/' + maxmarches;
		}
		m += _row(uW.buildingcost.bdg12[0], row, true);

		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var totWilds = 0;
			dat = Seed.wilderness['city' + cityId];
			if (dat != null && matTypeof(dat) == 'object')
				for (var k in dat)
					++totWilds;
			var castle = getMaxWilds(cityId);
			if (totWilds < castle)
				row[i] = '<SPAN class=boldRed><B>' + totWilds + '/' + castle + '</b></span>';
			else
				row[i] = totWilds + '/' + castle;
		}
		m += _row(tx('Wilds'), row, true);

		row = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			totKnights = 0;
			dat = Seed.knights['city' + cityId];
			for (var k in dat)
				++totKnights;
			row[i] = totKnights;
		}
		m += _row(uW.g_js_strings.report_view.knights, row, true);


		var AuraDist = '';
		if (ArcanaEnabled()) {
			AuraDist = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
		}
		row = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var ArcaneAura = '<span class=boldRed>' + tx('None') + '!</span>'
			if (Seed.allianceHQ) {
				var HQDist = distance(Seed.cities[i][2], Seed.cities[i][3], Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord);
				if (HQDist <= AuraDist) { ArcaneAura = '<span class=boldGreen>' + HQDist + '</span>'; }
				else { ArcaneAura = '<span>' + HQDist + '</span>'; }
			}
			row[i] = ArcaneAura;
		}
		m += _row(tx('HQ Distance'), row, true);

		m += '<TR><TD colspan=2 align=right><b>' + tx('Queues') + '&nbsp;</b></td></tr>';
		var now = unixTime();
		var row = [];
		var rowsp = [];
		var rowrev = [];
		var rowres = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var totTime = 0;
			var totTime2 = 0;
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
			if (totTime < 3600) row[i] = '<SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
			else row[i] = timestr(totTime);
			if (totTime2 < 0) totTime2 = 0;
			if (totTime2 < 3600) rowsp[i] = '<SPAN class=boldRed><B>' + timestr(totTime2) + '</b></span>';
			else rowsp[i] = timestr(totTime2);

			var totTime = 0;
			var qr = Seed.queue_revive['city' + cityId];
			rowrev[i] = 0;
			if (qr != null && qr.length > 0) {
				totTime = qr[qr.length - 1][3] - now;
				if (totTime < 0) rowrev[i] = 0;
				else if (totTime < 3600) rowrev[i] = '<SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
				else rowrev[i] = timestr(totTime);
			}
			var totTime = 0;
			var qr2 = Seed.queue_revive2['city' + cityId];
			if (qr2 != null && qr2.length > 0) {
				totTime = qr2[qr2.length - 1][3] - now;
				if (totTime >= 0) {
					if (totTime < 3600) rowrev[i] += '<br><SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
					else rowrev[i] += '<br>' + timestr(totTime);
				}
			}

			var totTime = 0;
			var qres = Seed.queue_tch['city' + cityId];
			rowres[i] = 0;
			if (qres != null && qres.length > 0) {
				totTime = qres[qres.length - 1][3] - now;
				if (totTime < 0) rowres[i] = 0;
				else if (totTime < 3600) rowres[i] = '<SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
				else rowres[i] = timestr(totTime);
			}
			var totTime = 0;
			var qres2 = Seed.queue_tch2['city' + cityId];
			if (qres2 != null && qres2.length > 0) {
				totTime = qres2[qres2.length - 1][3] - now;
				if (totTime >= 0) {
					if (totTime < 3600) rowres[i] += '<br><SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
					else rowres[i] += '<br>' + timestr(totTime);
				}
			}
		}
		m += _row(tx('Training'), row, true);
		m += _row(tx('Asc. Training'), rowsp, true);
		m += _row(tx('Reviving'), rowrev, true);
		m += _row(tx('Researching'), rowres, true);

		var row = [];
		for (var i = 0; i < Cities.numCities; i++) {
			cityId = Cities.cities[i].id;
			var wall = {};
			getWallInfo(cityId, wall);
			var totTime = 0;
			var q = Seed.queue_fort['city' + cityId];
			if (q != null && q.length > 0)
				totTime = q[q.length - 1][3] - now;
			if (totTime < 0)
				totTime = 0;
			if (totTime < 1 && (wall.wallSpaceUsed < wall.wallSpace - 4 || wall.fieldSpaceUsed < wall.fieldSpace - 4))
				row[i] = '<SPAN class=boldRed><B>' + timestr(totTime) + '</b></span>';
			else
				row[i] = timestr(totTime);
		}
		m += _row(uW.g_js_strings.report_view.defenses, row, true);

		ById('ptOverviewDiv').innerHTML = m;

		ById('ptpostres').addEventListener('click', t.postRes, false);
		ById('ptposttroop').addEventListener('click', t.postTroop, false);

		for (var cityId in Cities.byID) {
			var DefButton = ById('ptCityStatus_' + cityId);
			t.addListener(DefButton, cityId);
		}
	},

	sendReport: function (force) {
		var t = Tabs.Overview;
		if (!Options.OverviewOptions.Report && !force) { return; }

		var now = unixTime();

		if (!force) {
			if (now < (parseInt(Options.OverviewOptions.LastReport) + (Options.OverviewOptions.ReportInterval * 60 * 60))) { return; }
			var message = tx('Resource Report for') + ' ' + Options.OverviewOptions.ReportInterval + ' ' + tx('hours (or since last report)') + ' %0A';
		}
		else {
			var message = tx('Resource Report (since last report)') + ' %0A';
		}
		var total = 0;
		var totalgain = 0;
		message += '%0A ---------- ' + uW.g_js_strings.commonstr.food + ' ---------- %0A';
		for (q = 1; q <= Seed.cities.length; q++) {
			var cityId = Seed.cities[q - 1][0];
			var oldval = Options.OverviewOptions.LastReportStatus[q][0];
			var newval = parseInt(Seed.resources['city' + cityId]['rec1'][0] / 3600);
			var gain = newval - oldval;
			message += Seed.cities[q - 1][1] + ': ' + tx('Start') + ': ' + addCommas(oldval) + ' ' + tx('End') + ': ' + addCommas(newval) + ' ' + tx('Gain') + ': ' + addCommas(gain) + '%0A';
			total += newval;
			totalgain += gain;
			Options.OverviewOptions.LastReportStatus[q][0] = newval;
		}
		message += '%0A ' + tx('Total Food') + ' : ' + addCommas(total);
		message += '%0A ' + tx('Total Gain') + ' : ' + addCommas(totalgain) + ' %0A';

		total = 0;
		totalgain = 0;
		message += '%0A ---------- ' + uW.g_js_strings.commonstr.aetherstone + ' ---------- %0A';
		for (q = 1; q <= Seed.cities.length; q++) {
			var cityId = Seed.cities[q - 1][0];
			var oldval = Options.OverviewOptions.LastReportStatus[q][4];
			var newval = parseInt(Seed.resources['city' + cityId]['rec5'][0]);
			var gain = newval - oldval;
			message += Seed.cities[q - 1][1] + ': ' + tx('Start') + ': ' + addCommas(oldval) + ' ' + tx('End') + ': ' + addCommas(newval) + ' ' + tx('Gain') + ': ' + addCommas(gain) + '%0A';
			total += newval;
			totalgain += gain;
			Options.OverviewOptions.LastReportStatus[q][4] = newval;
		}
		message += '%0A ' + tx('Total Aetherstone') + ' : ' + addCommas(total);
		message += '%0A ' + tx('Total Gain') + ' : ' + addCommas(totalgain) + ' %0A';

		total = 0;
		totalgain = 0;
		message += '%0A ---------- ' + uW.g_js_strings.commonstr.ore + ' ---------- %0A';
		for (q = 1; q <= Seed.cities.length; q++) {
			var cityId = Seed.cities[q - 1][0];
			var oldval = Options.OverviewOptions.LastReportStatus[q][3];
			var newval = parseInt(Seed.resources['city' + cityId]['rec4'][0] / 3600);
			var gain = newval - oldval;
			message += Seed.cities[q - 1][1] + ': ' + tx('Start') + ': ' + addCommas(oldval) + ' ' + tx('End') + ': ' + addCommas(newval) + ' ' + tx('Gain') + ': ' + addCommas(gain) + '%0A';
			total += newval;
			totalgain += gain;
			Options.OverviewOptions.LastReportStatus[q][3] = newval;
		}
		message += '%0A ' + tx('Total Ore') + ' : ' + addCommas(total);
		message += '%0A ' + tx('Total Gain') + ' : ' + addCommas(totalgain) + ' %0A';

		total = 0;
		totalgain = 0;
		message += '%0A ---------- ' + uW.g_js_strings.commonstr.wood + ' ---------- %0A';
		for (q = 1; q <= Seed.cities.length; q++) {
			var cityId = Seed.cities[q - 1][0];
			var oldval = Options.OverviewOptions.LastReportStatus[q][1];
			var newval = parseInt(Seed.resources['city' + cityId]['rec2'][0] / 3600);
			var gain = newval - oldval;
			message += Seed.cities[q - 1][1] + ': ' + tx('Start') + ': ' + addCommas(oldval) + ' ' + tx('End') + ': ' + addCommas(newval) + ' ' + tx('Gain') + ': ' + addCommas(gain) + '%0A';
			total += newval;
			totalgain += gain;
			Options.OverviewOptions.LastReportStatus[q][1] = newval;
		}
		message += '%0A ' + tx('Total Wood') + ' : ' + addCommas(total);
		message += '%0A ' + tx('Total Gain') + ' : ' + addCommas(totalgain) + ' %0A';

		total = 0;
		totalgain = 0;
		message += '%0A ---------- ' + uW.g_js_strings.commonstr.stone + ' ---------- %0A';
		for (q = 1; q <= Seed.cities.length; q++) {
			var cityId = Seed.cities[q - 1][0];
			var oldval = Options.OverviewOptions.LastReportStatus[q][2];
			var newval = parseInt(Seed.resources['city' + cityId]['rec3'][0] / 3600);
			var gain = newval - oldval;
			message += Seed.cities[q - 1][1] + ': ' + tx('Start') + ': ' + addCommas(oldval) + ' ' + tx('End') + ': ' + addCommas(newval) + ' ' + tx('Gain') + ': ' + addCommas(gain) + '%0A';
			total += newval;
			totalgain += gain;
			Options.OverviewOptions.LastReportStatus[q][2] = newval;
		}
		message += '%0A ' + tx('Total Stone') + ' : ' + addCommas(total);
		message += '%0A ' + tx('Total Gain') + ' : ' + addCommas(totalgain) + ' %0A';

		total = 0;
		totalgain = 0;
		message += '%0A ---------- ' + uW.g_js_strings.commonstr.gold + ' ---------- %0A';
		for (q = 1; q <= Seed.cities.length; q++) {
			var cityId = Seed.cities[q - 1][0];
			var oldval = Options.OverviewOptions.LastReportStatus[q][5];
			var newval = parseInt(Seed.citystats["city" + cityId]['gold'][0]);
			var gain = newval - oldval;
			message += Seed.cities[q - 1][1] + ': ' + tx('Start') + ': ' + addCommas(oldval) + ' ' + tx('End') + ': ' + addCommas(newval) + ' ' + tx('Gain') + ': ' + addCommas(gain) + '%0A';
			total += newval;
			totalgain += gain;
			Options.OverviewOptions.LastReportStatus[q][5] = newval;
		}
		message += '%0A ' + tx('Total Gold') + ' : ' + addCommas(total);
		message += '%0A ' + tx('Total Gain') + ' : ' + addCommas(totalgain) + ' %0A';

		message += '%0A ';

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = tx("Resource Overview");

		params.message = message;
		params.requestType = "COMPOSED_MAIL";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					DeleteLastMessage();
				}
			},
		});

		Options.OverviewOptions.LastReport = now;
		saveOptions();
	},
}
