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
	barbArray: {},
	lookup: 1,
	deleting: false,

	// --- Estado del bucle de ataque (v4.37.0) ---
	// Antes habia un unico cursor (t.city) y una sola cadena getnextCity que
	// visitaba una ciudad por tick. Ahora hay dos piezas: sweep() recorre todas
	// las ciudades y encola trabajo, pump() envia una marcha de la cola cada
	// SendGap respetando el tope global de peticiones de March.
	attRunning: false,
	sweeptimer: null,
	pumptimer: null,
	barbQueue: [],
	barbInFlight: {},
	barbLastSend: 0,
	barbStatus: {},
	// Indices knt0/knt1 de Seed.knights ya asignados a un trabajo, por ciudad.
	knightBusy: {},
	// La busqueda de mapa sigue siendo de una en una (los lookups son pesados y
	// son el principal motivo de captcha), pero las ciudades pendientes se
	// atienden en cola FIFO en vez de depender del flag global searchRunning.
	searchQueue: [],
	nextSearchAt: {},
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
		SendGap: 2000,
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
			m += '<TD align=center style="border:1px solid #000;padding:2px;"><b>' + Seed.cities[i][1] + '</b><br><span id=pdtotalcity' + i + '></span><br><span id=pddatacity' + i + '></span><br><span id=pddataarray' + i + '></span><br><span id=pdfdata' + i + '></span></td>';
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

		// Si la opcion quedo activada de la sesion anterior, el boton decia
		// "Attack = ON" pero no habia ningun temporizador corriendo: tras
		// recargar la pagina no se atacaba hasta que el usuario pulsara el
		// boton dos veces. Se arranca aqui el bucle.
		if (Options.DFOptions.Running == true) t.startLoop();

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
		y += '<TR><TD>Gap between sends: </td><td><INPUT id=barbsendgap type=text size=4 maxlength=5 value=' + Options.DFOptions.SendGap + ' \> ms <span style="font-size:9px;">(min 500)</span></td></tr>';
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
		document.getElementById('barbsendgap').addEventListener('change', function () {
			var gap = parseInt(document.getElementById('barbsendgap').value);
			// Tope inferior de 500 ms: por debajo el servidor empieza a devolver
			// error 8 de forma sistematica.
			if (!(gap >= 500)) gap = 2000;
			document.getElementById('barbsendgap').value = gap;
			Options.DFOptions.SendGap = gap;
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

	// Solo carga y ordena las listas de bosques guardadas. Ya NO programa el
	// bucle de ataque: eso lo hace startLoop() y nadie mas, asi no pueden
	// coexistir dos cadenas getnextCity (lo que pasaba antes y duplicaba el
	// ritmo de envio al activar el tab).
	// Tampoco reinicia Options.DFOptions.Update[city][1] en cada pasada: ese
	// reset borraba el contador de busquedas vacias de TODAS las ciudades, con
	// lo que el corte por stopsearch dependia del orden del bucle.
	checkBarbData: function () {
		var t = Tabs.Barb;
		if (!Options.DFOptions.Running) return;
		for (var citynum = 1; citynum <= Seed.cities.length; citynum++) {
			if (!Options.DFOptions.Levels[citynum] || !Options.DFOptions.Levels[citynum][0]) continue; //Skip city if not selected
			var myarray = JSON2.parse(GM_getValue('DF_' + uW.tvuid + '_city_' + citynum + '_' + getServerId(), "[]"));
			if (myarray == null) myarray = JSON2.parse(GM_getValue('DF_' + Seed.player['name'] + '_city_' + citynum + '_' + getServerId(), "[]"));
			if (!myarray || !Array.isArray(myarray)) myarray = [];
			t.barbArray[citynum] = t.sortBarbs(myarray);
			t.saveArray(citynum);
		}
		saveOptions();
	},

	sortBarbs: function (myarray) {
		if (Options.DFOptions.Method == 'distance') return myarray.sort(function sortBarbs(a, b) { a = a['dist']; b = b['dist']; return a == b ? 0 : (a < b ? -1 : 1); });
		if (Options.DFOptions.Method == 'lowlevel') return myarray.sort(function sortBarbs(a, b) { a = a['level'] + a['dist']; b = b['level'] + b['dist']; return parseInt(a) == parseInt(b) ? 0 : (parseInt(a) < parseInt(b) ? -1 : 1); });
		return myarray.sort(function sortBarbs(a, b) { a = a['level'] + a['dist']; b = b['level'] + b['dist']; return parseInt(a) == parseInt(b) ? 0 : (parseInt(a) > parseInt(b) ? -1 : 1); });
	},

	saveArray: function (citynum) {
		GM_setValue('DF_' + uW.tvuid + '_city_' + citynum + '_' + getServerId(), JSON2.stringify(this.barbArray[citynum]));
	},

	// Caballeros libres de UNA ciudad, ya filtrados y ordenados. Antes esto
	// escribia en el array compartido t.knt, lo que impedia encolar mas de una
	// marcha por ciudad: Seed.knights solo se actualiza cuando responde el
	// servidor, asi que dos envios seguidos en el mismo barrido elegian al
	// mismo caballero. Ahora se consume la lista, una vez por caballero.
	//
	// Ademas se filtran los reservados en t.knightBusy. March.addMarch intenta
	// marcar el caballero como ocupado al responder, pero busca la clave
	// 'knt' + params.kid y params.kid es el knightId (un numero grande), no el
	// indice knt0/knt1 que es como se guardan en Seed.knights. La clave nunca
	// coincide, el caballero queda libre en local y el siguiente envio de la
	// misma ciudad lo reutiliza. La reserva local lo evita; el lag-fix
	// (src/panels/lag-fixes.js) devuelve los caballeros a 1 cuando la marcha
	// vuelve, asi que no se queda ocupado de forma permanente.
	getAtkKnight: function (cityID) {
		var t = Tabs.Barb;
		var knt = new Array();
		if (!Seed.knights[cityID] || !Seed.leaders[cityID]) return knt;
		var busy = t.knightBusy[cityID] || [];
		for (var k in Seed.knights[cityID]) {
			if (busy.indexOf(k) !== -1) continue;
			if (Seed.knights[cityID][k]["knightStatus"] == 1 && Seed.leaders[cityID]["resourcefulnessKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["politicsKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["combatKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["intelligenceKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.knights[cityID][k]["combat"] >= Options.DFOptions.barbMinKnight && Seed.knights[cityID][k]["combat"] <= Options.DFOptions.barbMaxKnight) {
				knt.push({
					Key: k,
					Name: Seed.knights[cityID][k]["knightName"],
					Combat: Seed.knights[cityID][k]["combat"],
					ID: Seed.knights[cityID][k]["knightId"],
				});
			}
		}
		return knt.sort(function sort(a, b) {
			a = parseInt(a['Combat']);
			b = parseInt(b['Combat']);
			if (parseInt(Options.DFOptions.knightselector) > 0) return a == b ? 0 : (a > b ? -1 : 1);
			else return a == b ? 0 : (a < b ? -1 : 1);
		});
	},

	// Config de tropas del nivel contra lo que hay en la ciudad. Devuelve null
	// si la ciudad no puede cubrir la configuracion: es config estricta a
	// proposito, no se escala hacia abajo en silencio.
	availableTroops: function (cityID, level) {
		var t = Tabs.Barb;
		var trps = Options.DFOptions.Troops[level];
		var units = Seed.units[cityID];
		if (!trps || !units) return null;
		var out = {};
		var num_troops = 0;
		for (var ii = 1; ii < parseInt(t.troopDef.length + 1); ii++) {
			var want = parseInt(trps[ii]);
			if (!want || want < 0) want = 0;
			if (want > (parseInt(units['unt' + t.troopDef[ii - 1][1]]) || 0)) return null;
			if (want > 0) out[ii] = want;
			num_troops += want;
		}
		if (num_troops == 0) return null;
		return out;
	},

	freeSlots: function (citynumber) {
		var keepfree = Number(Options.DFOptions.RallyClip);
		if (keepfree < Number(Options.FreeRallySlots)) keepfree = Number(Options.FreeRallySlots);
		return Number(March.getEmptySlots(citynumber)) - keepfree;
	},

	// Un caballero se reserva en cuanto entra en la cola, no cuando se envia:
	// entre el encolado y el envio pueden pasar varios segundos y la ciudad
	// vuelve a barajarse en el siguiente barrido.
	reserveKnight: function (cityID, kntKey) {
		var t = Tabs.Barb;
		if (!t.knightBusy[cityID]) t.knightBusy[cityID] = [];
		if (t.knightBusy[cityID].indexOf(kntKey) === -1) t.knightBusy[cityID].push(kntKey);
	},

	releaseKnight: function (cityID, kntKey, markBusy) {
		var t = Tabs.Barb;
		var busy = t.knightBusy[cityID];
		if (busy) {
			var i = busy.indexOf(kntKey);
			if (i !== -1) busy.splice(i, 1);
			if (!busy.length) delete t.knightBusy[cityID];
		}
		// markBusy deja el caballero como ocupado en Seed: es lo que hacia
		// March.addMarch pero con la clave equivocada, asi que nunca surtia
		// efecto. Con esto el siguiente barrido no lo vuelve a elegir.
		if (markBusy && Seed.knights[cityID] && Seed.knights[cityID][kntKey]) {
			Seed.knights[cityID][kntKey].knightStatus = 10;
		}
	},

	setStatus: function (citynum, text) {
		var t = Tabs.Barb;
		t.barbStatus[citynum] = text;
		var el = document.getElementById('pdfdata' + (citynum - 1));
		if (el) el.innerHTML = text;
	},

	// --- Productor: recorre TODAS las ciudades y encola lo que puedan atacar ---
	tryEnqueue: function (citynum) {
		var t = Tabs.Barb;
		if (!Options.DFOptions.Levels[citynum] || !Options.DFOptions.Levels[citynum][0]) {
			t.setStatus(citynum, 'Disabled');
			return;
		}
		var citynumber = Seed.cities[citynum - 1][0];
		var cityID = 'city' + citynumber;

		if (Seed.resources[cityID] && Seed.resources[cityID]["rec5"] && Seed.resources[cityID]["rec5"][0] > Number(Options.DFOptions.threshold)) {
			t.setStatus(citynum, 'Aetherstone too high');
			return;
		}

		// La falta de bosques se comprueba ANTES que caballeros y puntos de
		// marcha. Al reves, una ciudad sin bosques y sin caballero libre se
		// quedaba fuera sin llegar nunca a la cola de busqueda, y se quedaba sin buscar
		// para siempre.
		var arr = t.barbArray[citynum];
		if (!arr || !arr.length) {
			t.queueSearch(citynum);
			t.setStatus(citynum, 'No forests');
			return;
		}

		var knt = t.getAtkKnight(cityID);
		if (!knt.length) {
			t.setStatus(citynum, 'No free knight');
			return;
		}

		var free = t.freeSlots(citynumber);
		if (free < 1) {
			t.setStatus(citynum, 'No free rally point');
			return;
		}

		// Una sola pasada de validacion por ciudad y barrido. Los bosques que no
		// pasan el chequeo se quedan en la lista para el siguiente barrido; los
		// que estan fuera de distancia se descartan, igual que hacia el codigo
		// viejo. Se acabo el shift+push que los hacia rotar sin fin.
		var keep = [];
		var sent = 0, notroops = 0, far = 0;
		for (var i = 0; i < arr.length; i++) {
			var info = arr[i];
			if (sent >= free || !knt.length) { keep.push(info); continue; }
			var level = parseInt(info.level);
			if (!Options.DFOptions.Levels[citynum][level]) { keep.push(info); continue; }
			if (info.dist < Options.DFOptions.MinDistance[level] || info.dist > Options.DFOptions.Distance[level]) { far++; continue; }
			var trps = t.availableTroops(cityID, level);
			if (!trps) { notroops++; keep.push(info); continue; }
			var kid = knt.shift();
			t.reserveKnight(cityID, kid.Key);
			t.barbQueue.push({
				citynum: citynum, cityID: citynumber, cityKey: cityID, x: info['x'], y: info['y'],
				level: level, kid: kid.ID, kntKey: kid.Key, trps: trps
			});
			sent++;
		}
		t.barbArray[citynum] = keep;
		t.saveArray(citynum);

		var out = sent + (t.barbInFlight[citynum] || 0);
		if (sent) t.setStatus(citynum, 'Attacking (' + out + ' out)');
		else if (notroops) t.setStatus(citynum, 'Not enough troops (' + notroops + ')');
		else if (far) t.setStatus(citynum, 'All forests out of range');
		else t.setStatus(citynum, 'Queued');
	},

	// --- Consumidor: saca una marcha de la cola cada SendGap ---
	pump: function () {
		var t = Tabs.Barb;
		noThrottleClear(t.pumptimer);
		t.pumptimer = null;
		if (!t.attRunning) return;
		var gap = Math.max(500, parseInt(Options.DFOptions.SendGap) || 2000);
		// Sin cola no hace falta un temporizador vivo: el siguiente sweep llama
		// a pump() de nuevo. Asi no queda un setTimeout de 2 s girando para nada.
		if (!t.barbQueue.length) return;
		// Si March ya tiene el tope de peticiones ocupado, addMarch meteria la
		// marcha en su cola interna en silencio y perderiamos el bosque, porque
		// March.loop drena uno cada 3 s. Mejor esperar aqui.
		if (March.currentrequests >= March.maxrequests) {
			t.pumptimer = noThrottleTimeout(function () { t.pump(); }, 1000);
			return;
		}
		var wait = t.barbLastSend + gap - (new Date().getTime());
		if (wait > 0) {
			t.pumptimer = noThrottleTimeout(function () { t.pump(); }, wait);
			return;
		}
		t.sendNext();
		t.pumptimer = noThrottleTimeout(function () { t.pump(); }, gap);
	},

	sendNext: function () {
		var t = Tabs.Barb;
		// Tope duro: si la cola creciera sin control (muchos caballeros libres y
		// un SendGap muy corto) se descartan los trabajos mas viejos en vez de
		// acumular un retraso que ya no sirve para nada.
		var cap = t.maxQueue();
		while (t.barbQueue.length > cap) t.barbQueue.shift();
		var job = t.barbQueue.shift();
		if (!job) return;
		t.barbLastSend = new Date().getTime();
		t.barbInFlight[job.citynum] = (t.barbInFlight[job.citynum] || 0) + 1;
		t.doBarb(job.cityID, job.citynum, job.x, job.y, job.level, job.kid, job.trps, job);
	},

	maxQueue: function () {
		var t = Tabs.Barb;
		var free = 0;
		for (var citynum = 1; citynum <= Seed.cities.length; citynum++) {
			if (!Options.DFOptions.Levels[citynum] || !Options.DFOptions.Levels[citynum][0]) continue;
			free += t.getAtkKnight('city' + Seed.cities[citynum - 1][0]).length;
		}
		return Math.max(4, free * 2);
	},

	doSweep: function () {
		var t = Tabs.Barb;
		t.checkBarbData();
		for (var citynum = 1; citynum <= Seed.cities.length; citynum++) {
			t.refreshCityIfStale(citynum);
			try { t.tryEnqueue(citynum); }
			catch (ex) { logerr(ex); }
		}
		t.nextSearch();
		t.pump();
	},

	sweep: function () {
		var t = Tabs.Barb;
		if (!t.attRunning) return;
		noThrottleClear(t.sweeptimer);
		t.doSweep();
		t.sweeptimer = noThrottleTimeout(function () { t.sweep(); }, parseInt((1 + Options.DFOptions.SendInterval) * 1000));
	},

	startLoop: function () {
		var t = Tabs.Barb;
		if (t.attRunning) return;
		t.attRunning = true;
		t.barbQueue = [];
		t.barbInFlight = {};
		t.knightBusy = {};
		t.barbLastSend = 0;
		t.sweep();
	},

	stopLoop: function () {
		var t = Tabs.Barb;
		t.attRunning = false;
		noThrottleClear(t.sweeptimer);
		noThrottleClear(t.pumptimer);
		t.sweeptimer = null;
		t.pumptimer = null;
		t.barbQueue = [];
		t.searchQueue = [];
		t.nextSearchAt = {};
		t.barbInFlight = {};
		// Los caballeros reservados vuelven a estar libres: no queda ninguna
		// marcha en vuelo de este bucle.
		t.knightBusy = {};
		t.barbLastSend = 0;
		// Una busqueda que quedara en vuelo sigue escribiendo su resultado al
		// terminar, pero no vuelve a arrancar la cola: stopSearch llama a
		// nextSearch(), que ve la cola vacia y no hace nada.
	},

	// --- Fase 4: busqueda de bosques, de una en una pero en cola FIFO ---
	// La busqueda de mapa sigue siendo una a una: los lookups son pesados y son
	// el principal motivo de captcha. Lo que cambia es como se elige la ciudad:
	// antes el flag global searchRunning hacia que checkBarbData empezara siempre
	// a recorrer por la ciudad 1, asi que el reparto dependia del orden del
	// bucle. Ahora las ciudades pendientes se encolan y se atienden una a una.
	queueSearch: function (citynum) {
		var t = Tabs.Barb;
		if (t.searchQueue.indexOf(citynum) !== -1) return;
		t.searchQueue.push(citynum);
	},

	citySearchEligible: function (citynum) {
		var t = Tabs.Barb;
		if (!Options.DFOptions.Levels[citynum] || !Options.DFOptions.Levels[citynum][0]) return false;
		var upd = Options.DFOptions.Update[citynum];
		if (!upd) return true;
		// Se respeta "Skip city search after N tries": tras N busquedas vacias la
		// ciudad se aparca. Antes, con el valor por defecto de 1, un solo fallo
		// la dejaba bloqueada y solo se recuperaba con el boton Reset Forests.
		if (parseInt(upd[1]) >= parseInt(Options.DFOptions.stopsearch)) return false;
		if (t.nextSearchAt[citynum] && unixTime() < t.nextSearchAt[citynum]) return false;
		return true;
	},

	nextSearch: function () {
		var t = Tabs.Barb;
		if (t.searchRunning) return;
		// Se recorre la cola descartando las ciudades que ya no tocan, para no
		// dejar entradas muertas bloqueando a las demas.
		for (var guard = 0; guard < Seed.cities.length + 1; guard++) {
			if (!t.searchQueue.length) return;
			var citynum = t.searchQueue.shift();
			if (!t.citySearchEligible(citynum)) continue;
			t.startSearch(citynum);
			return;
		}
		t.searchQueue = [];
	},

	startSearch: function (citynum) {
		var t = Tabs.Barb;
		t.lookup = citynum;
		t.searchRunning = true;
		t.opt.startX = parseInt(Seed.cities[(citynum - 1)][2]);
		t.opt.startY = parseInt(Seed.cities[(citynum - 1)][3]);
		t.clickedSearch();
	},

	// Al vencer el intervalo de refresco la ciudad vuelve a buscar, pero YA NO se
	// borra su lista de bosques. Antes si: cada UpdateInterval (30 min por
	// defecto) se vaciaba la lista de la ciudad que tocaba en el cursor y se
	// obligaba a re-escanear el mismo mapa, con las busquedas serializadas por
	// detras. Ahora la lista sigue alimentando ataques mientras la busqueda
	// repone resultado, asi que el refresco no corta el flujo.
	refreshCityIfStale: function (citynum) {
		var t = Tabs.Barb;
		if (!Options.DFOptions.UpdateEnabled) return;
		var upd = Options.DFOptions.Update[citynum];
		if (!upd) return;
		var now = unixTime();
		if (now > parseInt(upd[0] + (Options.DFOptions.UpdateInterval * 60))) {
			// upd[1] = 0 reinicia el contador de busquedas vacias para que una
			// ciudad aparcada por stopsearch vuelva a probarse al vencer su
			// intervalo de refresco, sin necesidad de pulsar Reset Forests.
			upd[1] = 0;
			t.nextSearchAt[citynum] = 0;
			t.queueSearch(citynum);
		}
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
			// Antes solo se ponia t.nextattack = null, sin clearTimeout, asi que
			// la cadena getnextCity seguia viva y siguo mandando con el tab OFF.
			t.stopLoop();
		} else {
			Options.DFOptions.Running = true;
			obj.innerHTML = '<span>Attack = ON</span>';
			obj.className = 'inlineButton btButton green20';
			if (document.getElementById('DFToggleTab')) document.getElementById('DFToggleTab').innerHTML = '<span style="color: #FFFF00">' + tx('Dark Forest') + ': On</span>';
			saveOptions();
			t.startLoop();
		}
	},

	doBarb: function (cityID, counter, xcoord, ycoord, level, kid, trps, job) {
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
				t.clearInFlight(counter);
				// Sin marcha, el caballero vuelve a estar libre.
				if (job) t.releaseKnight(job.cityKey, job.kntKey, false);
				return;
			};
			if (parseInt(trps[ii]) > 0)
				params['u' + t.troopDef[ii - 1][1]] = trps[ii];
		};

		Options.DFOptions.BarbsTried++;
		document.getElementById('pberror1').innerHTML = 'Tries:' + Options.DFOptions.BarbsTried;

		March.addMarch(params, function (rslt) {
			t.clearInFlight(counter);
			if (rslt.ok) {
				// Se marca el caballero como ocupado en Seed al exito. March
				// lo intenta con 'knt' + kid, pero kid es el knightId, no el
				// indice, asi que nunca encontraba la entrada.
				if (job) t.releaseKnight(job.cityKey, job.kntKey, true);
				Options.DFOptions.BarbsDone[counter]++;
				var element1 = 'pddatacity' + (counter - 1);
				document.getElementById(element1).innerHTML = 'Sent: ' + Options.DFOptions.BarbsDone[counter];
				var element2 = 'pddataarray' + (counter - 1);
				document.getElementById(element2).innerHTML = 'RP: (' + March.getMarchSlots(cityID) + '/' + March.getTotalSlots(cityID) + ')';
				GM_setValue('DF_' + uW.tvuid + '_city_' + counter + '_' + getServerId(), JSON2.stringify(t.barbArray[counter]));
				saveOptions();
			} else {
				// El caballero se libera en cuanto la marcha termina. Si se
				// reintenta por trafico se mantiene reservado para que otro
				// barrido de la misma ciudad no se lo lleve mientras espera.
				if (rslt.error_code == 8) {
					Options.DFOptions.BarbsFailedTraffic++;
					// MyAjaxRequest ya reintenta este error 3 veces cada 2 s, asi que
					// esto ya es un cuarto intento. Antes se reenviaba aqui mismo
					// sin ninguna espera, encadenando ataques contra el limite.
					// Ahora vuelve a la cola y el hueco SendGap hace que espere.
					t.requeueJob(job);
					return;
				}
				if (job) t.releaseKnight(job.cityKey, job.kntKey, false);
				if (rslt.error_code && rslt.msg) document.getElementById('dferrorlog').innerHTML = '<FONT color=red>' + dtime.toLocaleString() + ' ' + Cities.byID[cityID].name + ' dark forest failed: ' + rslt.msg + '</FONT>';
				//logit( inspect(rslt,3,1));
				if (rslt.error_code != 8 && rslt.error_code != 213 && rslt.error_code == 210) Options.DFOptions.BarbsFailedVaria++;
				if (rslt.error_code == 213) Options.DFOptions.BarbsFailedKnight++;
				if (rslt.error_code == 210) Options.DFOptions.BarbsFailedRP++;
				if (rslt.error_code == 4) document.getElementById('dferrorlog').innerHTML = '<FONT color=red>' + dtime.toLocaleString() + ' ' + Cities.byID[cityID].name + ' dark forest failed: Not enough units</FONT>';
				if (rslt.error_code == 104) {
					// El objetivo no es atacable (falso, borroso, ya ocupado). El
					// bosque ya salio de la lista al encolarlo, asi que solo hay
					// que archivarlo y seguir. Antes decia 'new t.barbing()', que
					// no hacia nada: con new el resultado se descarta.
					Options.DFOptions.BarbsFailedBog++;
					GM_setValue('DF_' + uW.tvuid + '_city_' + counter + '_' + getServerId(), JSON2.stringify(t.barbArray[counter]));
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

	clearInFlight: function (counter) {
		var t = Tabs.Barb;
		if (!t.barbInFlight[counter]) return;
		t.barbInFlight[counter]--;
		if (t.barbInFlight[counter] < 0) t.barbInFlight[counter] = 0;
		if (!t.barbInFlight[counter]) delete t.barbInFlight[counter];
	},

	requeueJob: function (job) {
		var t = Tabs.Barb;
		if (!job) return;
		job.retries = (job.retries || 0) + 1;
		// Tres reintentos y el bosque se descarta: si el servidor dice exceso de
		// trafico cuatro veces, no vamos a insistir. El caballero se libera
		// porque el trabajo ya no sale de la cola.
		if (job.retries > 3) {
			t.releaseKnight(job.cityKey, job.kntKey, false);
			return;
		}
		t.barbQueue.unshift(job);
		// Ademas del hueco normal, este trabajo espera un poco mas.
		t.barbLastSend = new Date().getTime() + 3000;
		if (t.attRunning && !t.pumptimer) t.pumptimer = noThrottleTimeout(function () { t.pump(); }, 3000);
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
		// Antes solo se reiniciaba tilesSearched, y blocksSearched se acumulaba
		// entre ciudades durante toda la sesion.
		t.blocksSearched = 0;
		t.curY = 0;
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
		// El contador cuenta solo busquedas SEGUIDAS sin resultado. Antes
		// contaba cualquier busqueda, asi que una ciudad con buenos bosques
		// acababa tan pronto aparcada como una que no encuentra nada, y con el
		// valor por defecto de stopsearch=1 bastaba un fallo para dejarla
		// bloqueada hasta que el usuario pulsara Reset Forests.
		if (!t.mapDat || !t.mapDat.length) {
			Options.DFOptions.Update[t.lookup][1]++;
			// Espera creciente entre reintentos de una ciudad que no da fruto,
			// para no gastarse el turno de busqueda en cada barrido.
			t.nextSearchAt[t.lookup] = unixTime() + Math.min(600, (parseInt(Options.DFOptions.UpdateInterval) || 30) * 20);
		} else {
			Options.DFOptions.Update[t.lookup][1] = 0;
		}
		t.searchRunning = false;
		t.barbArray[t.lookup] = t.sortBarbs(t.mapDat || []);
		t.saveArray(t.lookup);
		saveOptions();
		// Se cede el turno a la siguiente ciudad pendiente en lugar de releer
		// todas las listas.
		t.nextSearch();
		return;
	},

	hide: function () {

	},

	show: function () {
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

};