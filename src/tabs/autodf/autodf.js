/*************** AutoDF Tab **********/
// @tabversion 20171109

Tabs.Barb = {
	tabLabel: 'Dark Forest',
	tabOrder: 2066,
	tabColor: 'brown',
	myDiv: null,
	MapAjax: new CMapAjax(),
	BlockList: [],
	Blocks: [],
	popFirst: true,
	opt: {},
	nextattack: null,
	searchRunning: false,
	tilesSearched: 0,
	tilesFound: 0,
	curX: 0,
	curY: 0,
	lastX: 0,
	firstX: 0,
	firstY: 0,
	lastY: 0,
	rallypointlevel: 0,
	knt: {},
	barbArray: {},
	lookup: 1,
	city: 1,
	deleting: false,
	maplag: 0,
	blocksSearched: 0,
	troopDef: [],
	selLevel: 1,
	refCity: 1,
	DefaultPresets: {
		'1-5 starter': { levels: [1, 2, 3, 4, 5], troops: [100, 100, 100, 100, 100, 75, 75, 50, 50, 50, 25, 25], mindist: 0, maxdist: 750 },
		'6-10 medium': { levels: [6, 7, 8, 9, 10], troops: [250, 250, 250, 200, 200, 150, 150, 100, 100, 100, 50, 50], mindist: 0, maxdist: 750 },
		'11-15 strong': { levels: [11, 12, 13, 14, 15], troops: [500, 500, 500, 400, 400, 300, 300, 200, 200, 200, 100, 100], mindist: 0, maxdist: 750 }
	},
	Options: {
		dfbtns: false,
		Method: "distance",
		SendInterval: 8,
		MaxDistance: 20,
		RallyClip: 0,
		Running: false,
		BarbsFailedKnight: 0,
		BarbsFailedRP: 0,
		BarbsFailedTraffic: 0,
		BarbsFailedVaria: 0,
		BarbsFailedBog: 0,
		BarbsTried: 0,
		DeleteMsg: true,
		DeleteMsgs0: false,
		Foodstatus: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		AetherStatus: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		MsgLevel: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true },
		BarbsDone: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		BarbNumber: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		Levels: { 1: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false }, 2: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false }, 3: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false }, 4: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false }, 5: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false }, 6: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false }, 7: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false }, 8: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false, 13: false, 14: false, 15: false } },
		Troops: { 1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 2: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 3: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 4: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 5: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 6: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 7: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 8: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 9: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 10: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 11: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 12: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 13: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 14: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 }, 15: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 } },
		MinDistance: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 },
		Distance: { 1: 750, 2: 750, 3: 750, 4: 750, 5: 750, 6: 750, 7: 750, 8: 750, 9: 750, 10: 750, 11: 750, 12: 750, 13: 750, 14: 750, 15: 750 },
		Update: { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0], 5: [0, 0], 6: [0, 0], 7: [0, 0], 8: [0, 0] },
		UpdateEnabled: true,
		UpdateInterval: 30,
		Presets: {},
		stopsearch: 1,
		knightselector: 0,
		barbMinKnight: 50,
		barbMaxKnight: 300,
		threshold: 750000,
	},

	init: function (div) {
		var t = Tabs.Barb;

		if (!Options.DFOptions) {
			Options.DFOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.DFOptions.hasOwnProperty(y)) {
					Options.DFOptions[y] = t.Options[y];
				}
			}
		}

		if (Options.DFOptions.dfbtns) AddSubTabLink(tx('Dark Forest'), t.toggleBarbState, 'DFToggleTab');
		t.myDiv = div;

		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var trp = [];
			trp.push(uW.unitcost['unt' + i][0]);
			trp.push(i);
			t.troopDef.push(trp);
		}

		var m = '<DIV id=pbTowrtDivF class=divHeader align=center>AUTOMATED FOREST FUNCTION</div><TABLE id=pbbarbingfunctions width=100% height=0% class=pbTab><TR align="center">';
		if (Options.DFOptions.Running == false) {
			m += '<TD><a id=AttSearch class="inlineButton btButton red14"><span>Attack = OFF</span></a></td>';
			if (document.getElementById('DFToggleTab')) document.getElementById('DFToggleTab').innerHTML = '<span style="color: #CCC">' + tx('Dark Forest') + ': Off</span>';
		} else {
			m += '<TD><a id=AttSearch class="inlineButton btButton green20"><span>Attack = ON</span></a></td>';
			if (document.getElementById('DFToggleTab')) document.getElementById('DFToggleTab').innerHTML = '<span style="color: #FFFF00">' + tx('Dark Forest') + ': On</span>';
		}
		m += '<TD><a id=troopselect class="inlineButton btButton brown11"><span>Select troops</span></a></td>';
		m += '<TD><a id=Options class="inlineButton btButton brown11"><span>Options</span></a></td>';
		m += '<TD><a id=StopSearch class="inlineButton btButton brown11"><span>Stop Current Search</span></a></td>';
		m += '</tr></table></div>';

		// Stats colapsables
		var shrink = '<img height="10" src="' + DownArrow + '">';
		var closed = '<img height="10" src="' + RightArrow + '">';
		m += '<DIV id=pbStatHeader><a id=StatToggle class=divLink><div class=divHeader align="center">FOREST STATS&nbsp;<img id=StatArrow height="10" src="' + DownArrow + '"></div></a></div>';
		m += '<TABLE id=pbStatWrap width=95% height=0% class=pbTab><TR align="left">';
		for (var i = 0; i < Seed.cities.length; i++) {
			m += '<TD align=center style="border:1px solid #000;padding:2px;"><b>' + Seed.cities[i][1] + '</b><br><span id=pdtotalcity' + i + '></span><br><span id=pddatacity' + i + '></span><br><span id=pddataarray' + i + '></span></td>';
		}
		m += '</tr></table><TABLE id=pbErrWrap width=95% height=0% class=pbTab><TR align="left">';
		for (var i = 0; i <= 6; i++) {
			m += '<TD><DIV><span id=pberror' + i + '></span></div></td>';
		}
		m += '</tr></table>';
		m += '<div id="dferrorlog">&nbsp;</div>';
		m += '<DIV id=pbOptHeader><a id=OptToggle class=divLink><div class=divHeader align=center>FOREST OPTIONS&nbsp;<img id=OptArrow height="10" src="' + DownArrow + '"></div></a></div>';
		m += '<TABLE id=pbOptWrap width=95% height=0% class=ptTab>';
		for (var i = 0; i < Seed.cities.length; i++) {
			var rg = t.levelRange(i + 1);
			m += '<TR><TD>' + Seed.cities[i][1] + '</td>';
			m += '<TD>Niveles: <SELECT id=pbcityMin' + i + ' class=btInput>' + t.levelOptions(rg[0]) + '</SELECT> a <SELECT id=pbcityMax' + i + ' class=btInput>' + t.levelOptions(rg[1]) + '</SELECT></td></tr>';
		}
		m += '</table><br>';
		t.myDiv.innerHTML = m;

		saveOptions();
		t.checkBarbData();

		for (var i = 0; i < Seed.cities.length; i++) {
			var element = 'pdtotalcity' + i;
			if (t.barbArray[i + 1] == undefined) document.getElementById(element).innerHTML = 'No Data';
			else document.getElementById(element).innerHTML = 'Forests:' + t.barbArray[i + 1].length;
		}

		document.getElementById('AttSearch').addEventListener('click', function () { t.toggleBarbState(this); }, false);
		document.getElementById('Options').addEventListener('click', t.barbOptions, false);
		document.getElementById('StopSearch').addEventListener('click', t.callStop, false);
		document.getElementById('troopselect').addEventListener('click', t.troopOptions, false);
		document.getElementById('StatToggle').addEventListener('click', function () { t.toggleSection('pbStatWrap', 'pbErrWrap', 'StatArrow'); }, false);
		document.getElementById('OptToggle').addEventListener('click', function () { t.toggleSection('pbOptWrap', null, 'OptArrow'); }, false);
		for (var i = 0; i < Seed.cities.length; i++) {
			document.getElementById('pbcityMin' + i).addEventListener('change', t.rangeLevelChange, false);
			document.getElementById('pbcityMax' + i).addEventListener('change', t.rangeLevelChange, false);
		}
	},

	toggleSection: function (wrapId, errId, arrowId) {
		var sw = document.getElementById(wrapId);
		if (!sw) return;
		var hidden = (sw.style.display == 'none');
		if (errId && document.getElementById(errId)) document.getElementById(errId).style.display = hidden ? '' : 'none';
		sw.style.display = hidden ? '' : 'none';
		if (document.getElementById(arrowId)) document.getElementById(arrowId).src = hidden ? DownArrow : RightArrow;
	},

	levelRange: function (citynum) {
		var min = 0, max = 0;
		for (var w = 1; w <= 15; w++) {
			if (Options.DFOptions.Levels[citynum][w]) {
				if (min == 0) min = w;
				max = w;
			}
		}
		return [min, max];
	},

	levelOptions: function (sel) {
		var o = '';
		for (var w = 0; w <= 15; w++) {
			o += '<option value=' + w + (w == sel ? ' selected' : '') + '>' + (w == 0 ? 'None' : w) + '</option>';
		}
		return o;
	},

	rangeLevelChange: function () {
		var t = Tabs.Barb;
		for (var i = 0; i < Seed.cities.length; i++) {
			var min = parseIntNan(document.getElementById('pbcityMin' + i).value);
			var max = parseIntNan(document.getElementById('pbcityMax' + i).value);
			Options.DFOptions.Levels[i + 1][0] = false;
			for (var w = 1; w <= 15; w++) {
				Options.DFOptions.Levels[i + 1][w] = (w >= min && w <= max);
				if (Options.DFOptions.Levels[i + 1][w]) Options.DFOptions.Levels[i + 1][0] = true;
			}
		}
		saveOptions();
		t.checkBarbData();
	},

	troopOptions: function () {
		var t = Tabs.Barb;
		var troopDef = t.troopDef;
		if (t.troopselect == null)
			t.troopselect = new CPopup('pbtroopselect', 0, 0, 980, 650, true, function () { t.saveTroops(); });
		t.troopselect.centerMe(mainPop.getMainDiv());
		t.renderTroopSelect();
	},

	renderTroopSelect: function () {
		var t = Tabs.Barb;
		var troopDef = t.troopDef;
		var lv = t.selLevel;
		if (!Options.DFOptions.Troops[lv]) Options.DFOptions.Troops[lv] = {};
		if (!Options.DFOptions.MinDistance) Options.DFOptions.MinDistance = {};
		if (!Options.DFOptions.Distance) Options.DFOptions.Distance = {};
		var cityID = 'city' + Seed.cities[t.refCity - 1][0];
		var availTroops = {};
		var cityUnits = Seed.units[cityID];
		for (var i = 0; i < t.troopDef.length; i++) {
			var unit = t.troopDef[i][1];
			availTroops[i] = (cityUnits && cityUnits['unt' + unit]) ? parseIntNan(cityUnits['unt' + unit]) : 0;
		}

		var z = '<DIV id=pbTraderDivD class=divHeader align=center>TROOP SELECTION</div>';
		z += '<TABLE width=100%><TR><TD align=center>';
		for (var l = 1; l <= 15; l++) {
			z += '<a id=lvlnav' + l + ' class="inlineButton btButton ' + (l == lv ? 'green20' : 'brown8') + '" style="margin:1px;"><span>L' + l + '</span></a>';
		}
		z += '</TD></TR><TR><TD align=center>Ciudad: <SELECT id=trpCity class=btInput>';
		for (var c = 0; c < Seed.cities.length; c++) {
			z += '<option value=' + (c + 1) + (c + 1 == t.refCity ? ' selected' : '') + '>' + Seed.cities[c][1] + '</option>';
		}
		z += '</SELECT></TD></TR></TABLE>';

		z += '<TABLE width=100% cellpadding=2 cellspacing=1 class=xtab>';
		z += '<TR class=xtabHD><TD>Unidad</TD><TD align=center>Disponible</TD><TD align=center>Cantidad</TD><TD align=center>Distancia M&#237;n</TD><TD align=center>Distancia M&#225;x</TD></TR>';

		for (var i = 0; i < troopDef.length; i++) {
			z += '<TR><TD><B>' + troopDef[i][0] + '</b></td>';
			z += '<TD align=center>' + addCommas(availTroops[i]) + '</td>';
			z += '<TD align=center><INPUT id=trprd' + t.troopDef[i][1] + ' type=text size=5 maxlength=6 class=btInput value="' + (Options.DFOptions.Troops[lv][i + 1] ? Options.DFOptions.Troops[lv][i + 1] : 0) + '" data-troopidx=' + i + ' /> <a id=minus' + t.troopDef[i][1] + ' class="inlineButton btButton brown8"><span>-</span></a> <a id=plus' + t.troopDef[i][1] + ' class="inlineButton btButton brown8"><span>+</span></a> <a id=max' + t.troopDef[i][1] + ' class="inlineButton btButton green20"><span>MAX</span></a></td>';
			z += '<TD align=center><INPUT id=mindist' + i + ' type=text size=3 maxlength=3 class=btInput value="' + Options.DFOptions.MinDistance[lv] + '"></td>';
			z += '<TD align=center><INPUT id=maxdist' + i + ' type=text size=3 maxlength=3 class=btInput value="' + Options.DFOptions.Distance[lv] + '"></td>';
			z += '</TR>';
		}

		z += '<TR><TD colspan=5 align=center style="padding-top:6px;">';
		z += '<a id=allLevels class="inlineButton btButton green20"><span>Aplicar a todos los niveles</span></a> ';
		z += '<a id=presetLoad class="inlineButton btButton brown11"><span>Cargar preset</span></a> ';
		z += '<SELECT id=presetSel class=btInput>' + t.presetOptions() + '</SELECT> ';
		z += '<a id=presetSave class="inlineButton btButton brown11"><span>Guardar preset</span></a> ';
		z += '<INPUT id=presetName type=text size=12 maxlength=30 class=btInput placeholder="Nombre preset">';
		z += '</TD></TR></TABLE>';
		t.troopselect.getMainDiv().innerHTML = z;
		t.troopselect.show(true);
		t.bindTroopEvents(lv, availTroops);
	},

	bindTroopEvents: function (lv, availTroops) {
		var t = Tabs.Barb;
		var troopDef = t.troopDef;
		var cityID = 'city' + Seed.cities[t.refCity - 1][0];
		var cityUnits = Seed.units[cityID];

		for (var l = 1; l <= 15; l++) {
			document.getElementById('lvlnav' + l).addEventListener('click', function (e) {
				t.selLevel = parseInt(e.currentTarget.id.replace('lvlnav', ''));
				t.renderTroopSelect();
			}, false);
		}

		for (var i = 0; i < troopDef.length; i++) {
			var unit = troopDef[i][1];
			var input = document.getElementById('trprd' + unit);
			var mindst = document.getElementById('mindist' + i);
			var maxdst = document.getElementById('maxdist' + i);
			(function (i, unit, input, mindst, maxdst) {
				input.addEventListener('change', function () {
					Options.DFOptions.Troops[lv][i + 1] = parseIntNan(input.value);
					saveOptions();
				}, false);
				document.getElementById('minus' + unit).addEventListener('click', function () {
					var v = parseIntNan(input.value) - 10;
					if (v < 0) v = 0;
					input.value = v;
					Options.DFOptions.Troops[lv][i + 1] = v;
					saveOptions();
				}, false);
				document.getElementById('plus' + unit).addEventListener('click', function () {
					var v = parseIntNan(input.value) + 10;
					input.value = v;
					Options.DFOptions.Troops[lv][i + 1] = v;
					saveOptions();
				}, false);
				document.getElementById('max' + unit).addEventListener('click', function () {
					var v = cityUnits ? parseIntNan(cityUnits['unt' + unit]) : 0;
					input.value = v;
					Options.DFOptions.Troops[lv][i + 1] = v;
					saveOptions();
				}, false);
				mindst.addEventListener('change', function () {
					Options.DFOptions.MinDistance[lv] = parseIntNan(mindst.value);
					saveOptions();
				}, false);
				maxdst.addEventListener('change', function () {
					Options.DFOptions.Distance[lv] = parseIntNan(maxdst.value);
					if (parseInt(Options.DFOptions.Distance[lv]) > Options.DFOptions.MaxDistance) {
						Options.DFOptions.Distance[lv] = parseInt(Options.DFOptions.MaxDistance);
						maxdst.value = Options.DFOptions.Distance[lv];
					}
					saveOptions();
				}, false);
			})(i, unit, input, mindst, maxdst);
		}

		document.getElementById('trpCity').addEventListener('change', function () {
			t.refCity = parseIntNan(document.getElementById('trpCity').value);
			t.renderTroopSelect();
		}, false);

		document.getElementById('allLevels').addEventListener('click', function () {
			for (var w = 1; w <= 15; w++) {
				for (var x = 1; x <= troopDef.length; x++) {
					Options.DFOptions.Troops[w][x] = Options.DFOptions.Troops[lv][x];
				}
				Options.DFOptions.MinDistance[w] = Options.DFOptions.MinDistance[lv];
				Options.DFOptions.Distance[w] = Options.DFOptions.Distance[lv];
			}
			saveOptions();
		}, false);

		document.getElementById('presetLoad').addEventListener('click', function () {
			t.loadPreset(document.getElementById('presetSel').value);
		}, false);

		document.getElementById('presetSave').addEventListener('click', function () {
			var name = document.getElementById('presetName').value;
			if (name) {
				if (!Options.DFOptions.Presets) Options.DFOptions.Presets = {};
				Options.DFOptions.Presets[name] = { Troops: {}, MinDistance: {}, Distance: {} };
				for (var w = 1; w <= 15; w++) {
					Options.DFOptions.Presets[name].Troops[w] = {};
					Options.DFOptions.Presets[name].MinDistance[w] = Options.DFOptions.MinDistance[w];
					Options.DFOptions.Presets[name].Distance[w] = Options.DFOptions.Distance[w];
					for (var x = 1; x <= troopDef.length; x++) {
						Options.DFOptions.Presets[name].Troops[w][x] = Options.DFOptions.Troops[w][x];
					}
				}
				saveOptions();
				document.getElementById('presetSel').innerHTML = t.presetOptions();
				document.getElementById('presetName').value = '';
			}
		}, false);
	},

	presetOptions: function () {
		var z = '<option value="">Selecciona preset...</option>';
		for (var p in Tabs.Barb.DefaultPresets) {
			z += '<option value="' + p + '">' + p + '</option>';
		}
		for (var p in Options.DFOptions.Presets) {
			z += '<option value="' + p + '">' + p + '</option>';
		}
		return z;
	},

	loadPreset: function (name) {
		var t = Tabs.Barb;
		var preset = t.DefaultPresets[name] || Options.DFOptions.Presets[name];
		if (!preset) return;
		if (preset.levels) {
			for (var k = 0; k < preset.levels.length; k++) {
				var lv = preset.levels[k];
				for (var i = 0; i < preset.troops.length && i < t.troopDef.length; i++) {
					Options.DFOptions.Troops[lv][i + 1] = preset.troops[i];
				}
				Options.DFOptions.MinDistance[lv] = preset.mindist;
				Options.DFOptions.Distance[lv] = preset.maxdist;
			}
		} else {
			for (var w = 1; w <= 15; w++) {
				for (var x = 1; x <= t.troopDef.length; x++) {
					Options.DFOptions.Troops[w][x] = preset.Troops[w] ? preset.Troops[w][x] : 0;
				}
				Options.DFOptions.MinDistance[w] = preset.MinDistance ? preset.MinDistance[w] : 0;
				Options.DFOptions.Distance[w] = preset.Distance ? preset.Distance[w] : 750;
			}
		}
		saveOptions();
		t.checkBarbData();
		t.renderTroopSelect();
	},

	saveTroops: function () {
		var t = Tabs.Barb;
		for (var w = 1; w <= 15; w++) {
			for (var x = 1; x <= t.troopDef.length; x++) {
				if (!Options.DFOptions.Troops[w]) Options.DFOptions.Troops[w] = {};
				if (!Options.DFOptions.Troops[w][x]) Options.DFOptions.Troops[w][x] = 0;
			}
		}
		saveOptions();
	},

	barbOptions: function () {
		var t = Tabs.Barb;
		if (t.barboptions == null)
			t.barboptions = new CPopup('pbbarboptions', 0, 0, 400, 400, true);
		t.barboptions.centerMe(mainPop.getMainDiv());
		t.barboptions.getTopDiv().innerHTML = '<CENTER><b>Dark Forest Options for server ' + getServerId() + '</b></CENTER>';
		var y = '<DIV style="max-height:400px; overflow-y:auto;"><DIV class=divHeader align=center>OPTIONS</div><TABLE width=100%>';
		y += '<TR><TD style="margin-top:5px; text-align:center;"><INPUT id=pbresetbarbs type=submit value="Reset Forests"></td>';
		y += '<TD style="margin-top:5px; text-align:center;"><INPUT id=pbpaintbarbs type=submit value="Show forests"></td>';
		y += '<TD><SELECT id=pbcity type=list></td></tr></table>';
		y += '<table width=100%><TD colspan=2 style="margin-top:5px; text-align:center;"><DIV class=pbStat> OPTIONS </div></td>';
		y += '<TR><TD>Attack interval: </td><td><INPUT id=pbsendint type=text size=4 maxlength=3 value=' + Options.DFOptions.SendInterval + ' \> seconds</td></tr>';
		y += '<TR><TD>Max search distance: </td><td><INPUT id=pbmaxdist type=text size=4 maxlength=3 value=' + Options.DFOptions.MaxDistance + ' \></td></tr>';
		y += '<TR><TD>Keep rallypoint slot(s) free: </td><Td><INPUT id=rallyclip type=text size=3 maxlength=2 value="' + Options.DFOptions.RallyClip + '" \> </td></tr>';
		y += '<TR><TD><INPUT id=pbreset type=checkbox ' + (Options.DFOptions.UpdateEnabled ? 'CHECKED' : '') + '\> Reset search every </td><td><INPUT id=pbresetint type=text size=4 maxlength=3 value=' + Options.DFOptions.UpdateInterval + ' \>minutes</td></tr>';
		y += '<TR><TD> Skip city search after </td><td><INPUT id=barbstopsearch type=text size=3 value=' + Options.DFOptions.stopsearch + ' \> tries.</td></tr>';
		y += '<TR><TD>Method : </td><Td> ' + htmlSelector({ distance: 'Closest first', level: 'Highest level first', lowlevel: 'Lowest level first' }, Options.DFOptions.Method, 'id=pbmethod') + '</td></tr>';
		y += '<TR><TD>Knight priority : </td><td>' + htmlSelector({ 0: 'Lowest combat skill', 1: 'Highest combat skill' }, Options.DFOptions.knightselector, 'id=barbknight') + '</td></tr>';
		y += '<tr><td>Minimum knight Combat level to send: </td><td><input id=barbMinKnight type=text size=3 value=' + Options.DFOptions.barbMinKnight + ' \></td></tr>';
		y += '<tr><td>Maximum knight Combat level to send: </td><td><input id=barbMaxKnight type=text size=3 value=' + Options.DFOptions.barbMaxKnight + ' \></td></tr>';
		y += '<tr><td>Stop hitting Dark forests when Aetherstone in city is more than: </td><td><INPUT id=pbaothreshold type=text size=7 maxlength=8 value=' + Options.DFOptions.threshold + ' \></td></tr>';
		y += '<tr><td>Add toggle button: </td><td><INPUT id=pbdftoggle type=checkbox ' + (Options.DFOptions.dfbtns ? 'CHECKED' : '') + ' \></td></tr>';
		y += '</table></td></tr></table>';
		t.barboptions.getMainDiv().innerHTML = y;
		t.barboptions.show(true);

		document.getElementById('pbcity').options.length = 0;
		for (var i = 0; i < Seed.cities.length; i++) {
			var o = document.createElement("option");
			o.text = Seed.cities[i][1]
			o.value = i + 1;
			document.getElementById("pbcity").options.add(o);
		}

		document.getElementById('pbdftoggle').addEventListener('click', function () {
			Options.DFOptions.dfbtns = document.getElementById('pbdftoggle').checked;
			saveOptions();
		}, false);
		document.getElementById('pbpaintbarbs').addEventListener('click', function () {
			t.showBarbs(document.getElementById("pbcity").value, Seed.cities[document.getElementById("pbcity").value - 1][1]);

		}, false);
		document.getElementById('pbresetbarbs').addEventListener('click', t.deletebarbs, false);
		document.getElementById('pbmethod').addEventListener('change', function () {
			Options.DFOptions.Method = document.getElementById('pbmethod').value;
			saveOptions();
			t.checkBarbData();
		}, false);
		document.getElementById('barbknight').addEventListener('change', function () {
			Options.DFOptions.knightselector = document.getElementById('barbknight').value;
			saveOptions();
		}, false);
		document.getElementById('pbreset').addEventListener('change', function () {
			Options.DFOptions.UpdateEnabled = document.getElementById('pbreset').checked;
			saveOptions();
		}, false);
		document.getElementById('pbresetint').addEventListener('change', function () {
			Options.DFOptions.UpdateInterval = parseInt(document.getElementById('pbresetint').value);
			saveOptions();
		}, false);
		document.getElementById('pbsendint').addEventListener('change', function () {
			if (parseInt(document.getElementById('pbsendint').value) < 5)
				document.getElementById('pbsendint').value = 5; //Set minimum attack interval to 5 seconds
			Options.DFOptions.SendInterval = parseInt(document.getElementById('pbsendint').value);
			saveOptions();
		}, false);
		document.getElementById('pbmaxdist').addEventListener('change', function () {
			if (parseInt(document.getElementById('pbmaxdist').value) > 75)
				document.getElementById('pbmaxdist').value = 75;
			Options.DFOptions.MaxDistance = parseInt(document.getElementById('pbmaxdist').value);
			saveOptions();
		}, false);
		document.getElementById('rallyclip').addEventListener('change', function () {
			Options.DFOptions.RallyClip = parseInt(document.getElementById('rallyclip').value);
			saveOptions();
		}, false);

		document.getElementById('barbMinKnight').addEventListener('change', function () {
			Options.DFOptions.barbMinKnight = parseInt(document.getElementById('barbMinKnight').value);
			saveOptions();
		}, false);
		document.getElementById('barbMaxKnight').addEventListener('change', function () {
			Options.DFOptions.barbMaxKnight = parseInt(document.getElementById('barbMaxKnight').value);
			saveOptions();
		}, false);
		document.getElementById('pbaothreshold').addEventListener('change', function () {
			Options.DFOptions.threshold = parseInt(document.getElementById('pbaothreshold').value);
			saveOptions();
		}, false);
		document.getElementById('barbstopsearch').addEventListener('change', function () {
			document.getElementById('barbstopsearch').value = parseInt(document.getElementById('barbstopsearch').value) > 0 ? document.getElementById('barbstopsearch').value : 1
			Options.DFOptions.stopsearch = parseInt(document.getElementById('barbstopsearch').value);
			saveOptions();
		}, false);
	},

	showBarbs: function (citynumber, cityname) {
		var t = Tabs.Barb;
		var popTradeRoutes = null;
		t.popTradeRoutes = new CPopup('pbShowBarbs', 0, 0, 500, 500, true, function () { clearTimeout(1000); });
		var m = '<DIV style="max-height:460px; height:460px; overflow-y:auto"><TABLE align=center cellpadding=0 cellspacing=0 width=100% class="pbShowBarbs" id="pbBars">';
		t.popTradeRoutes.getMainDiv().innerHTML = '</table></div>' + m;
		t.popTradeRoutes.getTopDiv().innerHTML = '<TD align=center><B>Dark Forests for city: ' + cityname + '</td>';
		t.paintBarbs(citynumber, cityname);
		t._addTabHeader(citynumber, cityname);
		t.popTradeRoutes.show(true);
	},

	paintBarbs: function (i, cityname) {
		var t = Tabs.Barb;
		if (t.barbArray[i] == undefined) return;
		for (var k = (t.barbArray[i].length - 1); k >= 0; k--) { t._addTab(i, cityname, k + 1, t.barbArray[i][k]['x'], t.barbArray[i][k]['y'], t.barbArray[i][k]['dist'], t.barbArray[i][k]['level']); }
	},

	_addTab: function (citynumber, cityname, queueId, X, Y, dist, level) {
		var t = Tabs.Barb;
		var row = document.getElementById('pbBars').insertRow(0);
		row.vAlign = 'top';
		row.insertCell(0).innerHTML = queueId;
		row.insertCell(1).innerHTML = X;
		row.insertCell(2).innerHTML = Y;
		row.insertCell(3).innerHTML = dist;
		row.insertCell(4).innerHTML = level;
		row.insertCell(5).innerHTML = '<a class="button20" id="barbdel_' + queueId + '"><span>Delete</span></a>';
		document.getElementById('barbdel_' + queueId).addEventListener('click', function () {
			t.deleteBarbElement(citynumber, queueId, cityname, true);
		}, false);
	},

	_addTabHeader: function (citynumber, cityname) {
		var t = Tabs.Barb;
		var row = document.getElementById('pbBars').insertRow(0);
		row.vAlign = 'top';
		row.insertCell(0).innerHTML = "City";
		row.insertCell(1).innerHTML = "X";
		row.insertCell(2).innerHTML = "Y";
		row.insertCell(3).innerHTML = "Dist.";
		row.insertCell(4).innerHTML = "Level";
		row.insertCell(5).innerHTML = '<a class="button20" id="barbdelAll"><span>Delete ALL</span></a>';
		document.getElementById('barbdelAll').addEventListener('click', function () {
			t.deleteBarbsCity(citynumber, cityname);
		}, false);
	},

	deleteBarbElement: function (citynumber, queueId, cityname, showFlag) {
		var t = Tabs.Barb;
		var queueId = parseInt(queueId);
		var myarray = t.barbArray[citynumber];
		if (myarray) {
			myarray.splice((queueId - 1), 1);
			GM_setValue('DF_' + uW.tvuid + '_city_' + citynumber + '_' + getServerId(), JSON2.stringify(myarray));
			t.checkBarbData();
			if (showFlag) t.showBarbs(citynumber, cityname);
		}
		else {
			//logit("not found");
		}
	},

	deleteBarbsCity: function (citynumber, cityname) {
		var t = Tabs.Barb;
		Options.DFOptions.Update[citynumber][1] = 0;
		GM_deleteValue('DF_' + uW.tvuid + '_city_' + citynumber + '_' + getServerId())
		GM_deleteValue('DF_' + Seed.player['name'] + '_city_' + citynumber + '_' + getServerId())
		t.checkBarbData();
		t.showBarbs(citynumber, cityname);
		//reloadKOC();
	},

	deletebarbs: function () {
		for (var i = 1; i <= Seed.cities.length; i++) {
			Options.DFOptions.Update[i][1] = 0;
			GM_deleteValue('DF_' + uW.tvuid + '_city_' + i + '_' + getServerId())
			GM_deleteValue('DF_' + Seed.player['name'] + '_city_' + i + '_' + getServerId())
		}
		//reloadKOC();
	},

	checkBarbData: function () {
		var t = Tabs.Barb;
		if (!Options.DFOptions.Running) return;
		for (var citynum = 1; citynum <= Seed.cities.length; citynum++) {

			if (!Options.DFOptions.Levels[citynum][0]) continue; //Skip city if not selected

			t.barbArray[citynum] = [];
			var myarray = JSON2.parse(GM_getValue('DF_' + uW.tvuid + '_city_' + citynum + '_' + getServerId(), "[]"));
			if (myarray == null) myarray = JSON2.parse(GM_getValue('DF_' + Seed.player['name'] + '_city_' + citynum + '_' + getServerId(), "[]"));
			if ((myarray == undefined || myarray.length == 0) && t.searchRunning == false) {
				t.lookup = citynum;
				if (parseInt(Options.DFOptions.Update[t.lookup][1]) >= parseInt(Options.DFOptions.stopsearch)) continue; //Skip if search results are empty more than X times
				t.searchRunning = true;
				t.opt.startX = parseInt(Seed.cities[(citynum - 1)][2]);
				t.opt.startY = parseInt(Seed.cities[(citynum - 1)][3]);
				t.clickedSearch();
			}
			if (myarray && Array.isArray(myarray)) {
				if (Options.DFOptions.Method == 'distance') t.barbArray[citynum] = myarray.sort(function sortBarbs(a, b) { a = a['dist']; b = b['dist']; return a == b ? 0 : (a < b ? -1 : 1); });
				if (Options.DFOptions.Method == 'level') t.barbArray[citynum] = myarray.sort(function sortBarbs(a, b) { a = a['level'] + a['dist']; b = b['level'] + b['dist']; return parseInt(a) == parseInt(b) ? 0 : (parseInt(a) > parseInt(b) ? -1 : 1); });
				if (Options.DFOptions.Method == 'lowlevel') t.barbArray[citynum] = myarray.sort(function sortBarbs(a, b) { a = a['level'] + a['dist']; b = b['level'] + b['dist']; return parseInt(a) == parseInt(b) ? 0 : (parseInt(a) < parseInt(b) ? -1 : 1); });
				GM_setValue('DF_' + uW.tvuid + '_city_' + citynum + '_' + getServerId(), JSON2.stringify(t.barbArray[citynum]));
			}
			Options.DFOptions.Update[citynum][1] = 0;
			saveOptions();
		}
		t.nextattack = setTimeout(t.getnextCity, parseInt((1 + Options.DFOptions.SendInterval) * 1000));
	},

	toggleBarbState: function (obj) {
		obj = document.getElementById('AttSearch');
		var t = Tabs.Barb;
		if (Options.DFOptions.Running == true) {
			Options.DFOptions.Running = false;
			obj.innerHTML = '<span>Attack = OFF</span>';
			obj.className = 'inlineButton btButton red14';
			if (document.getElementById('DFToggleTab')) document.getElementById('DFToggleTab').innerHTML = '<span style="color: #CCC">' + tx('Dark Forest') + ': Off</span>';
			saveOptions();
			t.nextattack = null;
		} else {
			Options.DFOptions.Running = true;
			obj.innerHTML = '<span>Attack = ON</span>';
			obj.className = 'inlineButton btButton green20';
			if (document.getElementById('DFToggleTab')) document.getElementById('DFToggleTab').innerHTML = '<span style="color: #FFFF00">' + tx('Dark Forest') + ': On</span>';
			saveOptions();
			t.checkBarbData();
			t.nextattack = setTimeout(t.getnextCity, parseInt((1 + Options.DFOptions.SendInterval) * 1000));
		}
	},

	barbing: function () {
		var t = Tabs.Barb;
		var city = t.city;
		var citynumber = Seed.cities[city - 1][0];
		var cityID = 'city' + citynumber;
		t.getAtkKnight(cityID);
		var slots = March.getMarchSlots(citynumber);

		//Only send DF if city is not over 750K astone:: rewritten I want df's to farm items and level knights.. who cares about aetherstone?  -baos
		if (Seed.resources[cityID]["rec5"][0] > Number(Options.DFOptions.threshold)) {
			return;
		};
		var element1 = 'pddatacity' + (city - 1);
		if (t.barbArray[city].length == 0) document.getElementById(element1).innerHTML = 'In search mode'; else
			document.getElementById(element1).innerHTML = 'Sent: ' + Options.DFOptions.BarbsDone[city];
		var element2 = 'pddataarray' + (city - 1);
		document.getElementById(element2).innerHTML = 'RP: (' + slots + '/' + March.getTotalSlots(citynumber) + ')';
		if (Number(Number(March.getTotalSlots(citynumber)) - Number(slots)) <= Number(Options.DFOptions.RallyClip)) return;
		if (t.knt.length == 0) return;
		var kid = t.knt[0].ID;

		if (t.barbArray[city] && t.barbArray[city].length > 0) {
			var barbinfo = t.barbArray[city].shift();
		} else if (parseInt(Options.DFOptions.Update[city][1]) == 0) {
			if (!t.searchRunning) t.checkBarbData();
			return;
		} else {
			return;
		};
		var check = 0;
		var barblevel = parseInt(barbinfo.level);

		if (Options.DFOptions.Levels[city][barbinfo.level])
			check = 1;

		if (barbinfo.dist < Options.DFOptions.MinDistance[barblevel] || barbinfo.dist > Options.DFOptions.Distance[barblevel]) {
			check = 0;
			GM_setValue('DF_' + uW.tvuid + '_city_' + city + '_' + getServerId(), JSON2.stringify(t.barbArray[city]));
			return;
		}
		// check troop levels in city
		var trps = Options.DFOptions.Troops[barblevel];
		var num_troops = 0;
		for (var ii = 1; ii < t.troopDef.length + 1; ii++) {
			if (parseInt(trps[ii]) > Seed.units[cityID]['unt' + t.troopDef[ii - 1][1]]) check = 0;
			num_troops += trps[ii];
		}
		if (num_troops == 0) check = 0;

		if (check == 0) {
			t.barbArray[city].push(barbinfo);
			GM_setValue('DF_' + uW.tvuid + '_city_' + city + '_' + getServerId(), JSON2.stringify(t.barbArray[city]));
			return;
		}
		var element = 'pdtotalcity' + (city - 1);
		if (t.barbArray[city] == undefined) document.getElementById(element).innerHTML = 'No Data';
		else document.getElementById(element).innerHTML = 'Forests:' + t.barbArray[city].length;
		var xcoord = barbinfo['x'];
		var ycoord = barbinfo['y'];
		t.doBarb(citynumber, city, xcoord, ycoord, barblevel, kid, trps);
		saveOptions();
	},

	getnextCity: function () {
		var t = Tabs.Barb;
		if (!Options.DFOptions.Running) return;

		var city = t.city + 1;
		if (city > Seed.cities.length) {
			city = 1;
		}

		for (var i = city; i <= Seed.cities.length; i++) {
			if (!Options.DFOptions.Levels[i][0]) continue; //Skip city if not selected
			else {
				city = i;
				break;
			}
		}

		t.city = city;
		if (Options.DFOptions.UpdateEnabled) {
			var now = unixTime();
			if (now > parseInt(Options.DFOptions.Update[city][0] + (Options.DFOptions.UpdateInterval * 60))) {
				Options.DFOptions.Update[city][1] = 0;
				t.barbArray[city] = []; //Clears data if last update was more than X minutes
				GM_deleteValue('DF_' + uW.tvuid + '_city_' + city + '_' + getServerId())
				GM_deleteValue('DF_' + Seed.player['name'] + '_city_' + city + '_' + getServerId())

				GM_setValue('DF_' + uW.tvuid + '_city_' + city + '_' + getServerId(), JSON2.stringify(t.barbArray[city]));
			}
		}

		if (Options.DFOptions.Levels[city][0]) {
			t.barbing();
			t.nextattack = setTimeout(t.getnextCity, parseInt((1 + Options.DFOptions.SendInterval) * 1000));
		} else {
			t.getnextCity();
		}

	},

	getAtkKnight: function (cityID) {
		var t = Tabs.Barb;
		t.knt = new Array();
		for (var k in Seed.knights[cityID]) {
			if (Seed.knights[cityID][k]["knightStatus"] == 1 && Seed.leaders[cityID]["resourcefulnessKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["politicsKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["combatKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["intelligenceKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.knights[cityID][k]["combat"] >= Options.DFOptions.barbMinKnight && Seed.knights[cityID][k]["combat"] <= Options.DFOptions.barbMaxKnight) {
				t.knt.push({
					Name: Seed.knights[cityID][k]["knightName"],
					Combat: Seed.knights[cityID][k]["combat"],
					ID: Seed.knights[cityID][k]["knightId"],
				});
			}
		}
		t.knt = t.knt.sort(function sort(a, b) {
			a = parseInt(a['Combat']);
			b = parseInt(b['Combat']);
			if (parseInt(Options.DFOptions.knightselector) > 0)
				return a == b ? 0 : (a > b ? -1 : 1);
			else
				return a == b ? 0 : (a < b ? -1 : 1);
		});
	},

	doBarb: function (cityID, counter, xcoord, ycoord, level, kid, trps) {
		var t = Tabs.Barb;
		var dtime = new Date()
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityID;
		params.type = 4;
		params.kid = kid;
		params.xcoord = xcoord;
		params.ycoord = ycoord;
		for (var ii = 1; ii < parseInt(t.troopDef.length + 1); ii++) {
			if (parseInt(trps[ii]) > Seed.units['city' + cityID]['unt' + t.troopDef[ii - 1][1]]) {
				document.getElementById('dferrorlog').innerHTML = '<FONT color=red>' + dtime.toLocaleString() + ' ' + Cities.byID[cityID].name + ' dark forest failed: Not doing march, not enough units </FONT>';
				return;
			};
			if (parseInt(trps[ii]) > 0)
				params['u' + t.troopDef[ii - 1][1]] = trps[ii];
		};

		Options.DFOptions.BarbsTried++;
		document.getElementById('pberror1').innerHTML = 'Tries:' + Options.DFOptions.BarbsTried;

		March.addMarch(params, function (rslt) {
			if (rslt.ok) {
				Options.DFOptions.BarbsDone[counter]++;
				var element1 = 'pddatacity' + (counter - 1);
				document.getElementById(element1).innerHTML = 'Sent: ' + Options.DFOptions.BarbsDone[counter];
				var element2 = 'pddataarray' + (counter - 1);
				document.getElementById(element2).innerHTML = 'RP: (' + March.getMarchSlots(cityID) + '/' + March.getTotalSlots(cityID) + ')';
				GM_setValue('DF_' + uW.tvuid + '_city_' + counter + '_' + getServerId(), JSON2.stringify(t.barbArray[counter]));
				saveOptions();
			} else {
				if (rslt.error_code && rslt.msg) document.getElementById('dferrorlog').innerHTML = '<FONT color=red>' + dtime.toLocaleString() + ' ' + Cities.byID[cityID].name + ' dark forest failed: ' + rslt.msg + '</FONT>';
				//logit( inspect(rslt,3,1));
				if (rslt.error_code != 8 && rslt.error_code != 213 && rslt.error_code == 210) Options.DFOptions.BarbsFailedVaria++;
				if (rslt.error_code == 213) Options.DFOptions.BarbsFailedKnight++;
				if (rslt.error_code == 210) Options.DFOptions.BarbsFailedRP++;
				if (rslt.error_code == 4) document.getElementById('dferrorlog').innerHTML = '<FONT color=red>' + dtime.toLocaleString() + ' ' + Cities.byID[cityID].name + ' dark forest failed: Not enough units</FONT>';
				if (rslt.error_code == 8) {
					Options.DFOptions.BarbsFailedTraffic++;
					t.doBarb(cityID, counter, xcoord, ycoord, level, kid, trps);
					return;
				}
				if (rslt.error_code == 104) {
					Options.DFOptions.BarbsFailedBog++;
					GM_setValue('DF_' + uW.tvuid + '_city_' + counter + '_' + getServerId(), JSON2.stringify(t.barbArray[counter]));
					new t.barbing();
					saveOptions();
				}
				document.getElementById('pberror2').innerHTML = 'Excess Traffic errors:' + Options.DFOptions.BarbsFailedTraffic;
				document.getElementById('pberror3').innerHTML = 'Rally Point errors: ' + Options.DFOptions.BarbsFailedRP;
				document.getElementById('pberror4').innerHTML = 'Knight errors:' + Options.DFOptions.BarbsFailedKnight;
				document.getElementById('pberror5').innerHTML = 'Other errors:' + Options.DFOptions.BarbsFailedVaria;
				document.getElementById('pberror6').innerHTML = 'Bog errors:' + Options.DFOptions.BarbsFailedBog;
			}

		});
		//saveOptions();
	},

	clickedSearch: function () {
		var t = Tabs.Barb;

		t.opt.maxDistance = parseInt(Options.DFOptions.MaxDistance);
		t.opt.searchDistance = t.opt.maxDistance;
		t.opt.searchShape = 'circle';
		t.mapDat = [];
		t.firstX = t.opt.startX - t.opt.maxDistance;
		t.firstY = t.opt.startY - t.opt.maxDistance;
		t.tilesSearched = 0;
		t.tilesFound = 0;
		var element = 'pddatacity' + (t.lookup - 1);
		var element2 = 'pddataarray' + (t.lookup - 1);
		document.getElementById(element2).innerHTML = '';

		t.BlockList = t.MapAjax.generateBlockList(t.firstX, t.firstY, t.opt.maxDistance);

		var counter = t.BlockList.length;
		if (counter > MAX_BLOCKS) { counter = MAX_BLOCKS; }

		var curX = t.firstX;
		var curY = t.firstY;
		document.getElementById(element).innerHTML = 'Searching at ' + curX + ',' + curY;

		t.Blocks = [];
		for (var i = 1; i <= counter; i++) {
			t.Blocks.push(t.BlockList.shift());
			t.blocksSearched++;
		}
		var blockString = t.Blocks.join("%2C");

		setTimeout(function () { t.MapAjax.LookupMap(blockString, t.mapCallback); }, MAP_DELAY);
	},

	mapCallback: function (rslt) {
		var t = Tabs.Barb;
		if (!t.searchRunning)
			return;
		if (rslt.ok) {
			var cityID = 'city' + Seed.cities[t.lookup - 1][0];
			var map = rslt.data;
			var tiles = [];
			for (var x in Seed.queue_atkp[cityID]) {
				tiles.push(Seed.queue_atkp[cityID][x].toTileId);
			}

			for (var k in map) {
				if (map[k].tileType == 54 && Options.DFOptions.Levels[t.lookup][map[k].tileLevel]) {
					var dist = distance(t.opt.startX, t.opt.startY, map[k].xCoord, map[k].yCoord);
					if (dist <= parseInt(Options.DFOptions.MaxDistance))
						if (dist <= parseInt(Options.DFOptions.Distance[map[k].tileLevel]))
							if (tiles.indexOf(map[k].tileId) == -1)
								t.mapDat.push({ time: 0, x: map[k].xCoord, y: map[k].yCoord, dist: dist, level: map[k].tileLevel });
				}
			}
		}
		else {
			if (rslt.BotCode && rslt.BotCode == 999) { // map captcha
				var dtime = new Date();
				document.getElementById('dferrorlog').innerHTML = '<FONT color=red>' + dtime.toLocaleString() + ' ' + Cities.byID[Seed.cities[t.lookup - 1][0]].name + ' Green Map detected! </FONT>';
			}
		}

		t.tilesSearched += (t.opt.searchDistance * t.opt.searchDistance);

		var element0 = 'pdtotalcity' + (t.lookup - 1);

		if (t.mapDat.length < 1) document.getElementById(element0).innerHTML = 'No Data';
		else document.getElementById(element0).innerHTML = 'Forests:' + t.mapDat.length;
		var element = 'pddatacity' + (t.lookup - 1);

		var counter = t.BlockList.length;
		if (counter == 0 || t.curY == 999) {
			t.stopSearch('Found: ' + t.mapDat.length);
			return;
		}
		if (counter > MAX_BLOCKS) { counter = MAX_BLOCKS; }

		var nextblock = t.BlockList[0];
		var curX = nextblock.split("_")[1];
		var curY = nextblock.split("_")[3];
		document.getElementById(element).innerHTML = 'Searching at ' + curX + ',' + curY;

		t.Blocks = [];
		for (var i = 1; i <= counter; i++) {
			t.Blocks.push(t.BlockList.shift());
			t.blocksSearched++;
		}
		var blockString = t.Blocks.join("%2C");
		setTimeout(function () { t.MapAjax.LookupMap(blockString, t.mapCallback); }, MAP_DELAY);
	},

	callStop: function () {
		var t = Tabs.Barb;
		t.curY = 999;
		t.stopSearch('Found: ' + t.mapDat.length);
	},

	stopSearch: function (msg) {
		var t = Tabs.Barb;
		var element = 'pddatacity' + (t.lookup - 1);
		document.getElementById(element).innerHTML = msg;
		GM_setValue('DF_' + uW.tvuid + '_city_' + t.lookup + '_' + getServerId(), JSON2.stringify(t.mapDat));
		Options.DFOptions.Update[t.lookup][0] = unixTime();
		Options.DFOptions.Update[t.lookup][1]++;
		t.searchRunning = false;
		saveOptions();
		t.checkBarbData();
		return;
	},

	hide: function () {

	},

	show: function () {
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

};