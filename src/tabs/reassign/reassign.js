/** Reassign Tab **/

Tabs.Reassign = {
	tabOrder: 2040,
	tabLabel: 'Reassign',
	tabColor: 'brown',
	myDiv: null,
	dcp0: null,
	dcp1: null,
	timer: null,
	autodelay: 0,
	loopaction: false,
	more: false,
	marchspeed: 0,
	LoopCounter: 0,
	EditRouteNumber: -1,
	EditMode: false,
	Options: {
		Running: false,
		Toggle: false,
		Routes: [],
		ReassignInterval: 60,
		intervalSecs: 5,
		ReverseReassign: false,
		ThroneCheck: false,
		MarchSpeed: 0,
		ReassignKnights: false,
	},
	NewRouteObject: {
		cityId: null,
		target_cityId: null,
		troops: {}, //id{send,keep}
		keep: {},
		Active: true,
		OverrideTime: false,
		Interval: 10,
		LastChecked: 0,
	},
	RouteObject: null,

	init: function (div) {
		var t = Tabs.Reassign;
		t.myDiv = div;

		if (!Options.ReassignOptions) {
			Options.ReassignOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.ReassignOptions.hasOwnProperty(y)) {
					Options.ReassignOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('pbreDeleteRoute', Tabs.Reassign.DeleteRoute);
		uWExportFunction('pbreEditRoute', Tabs.Reassign.EditRoute);
		uWExportFunction('pbreSendRoute', Tabs.Reassign.SendRoute);
		uWExportFunction('pbreToggleActive', Tabs.Reassign.ToggleActive);

		if (Options.ReassignOptions.Toggle) AddSubTabLink('Reassign', t.toggleAutoReassignState, 'ReassignToggleTab');
		SetToggleButtonState('Reassign', Options.ReassignOptions.Running, 'Reassign');

		var m = '<DIV class=divHeader align=center>' + tx('AUTOMATED TROOP REASSIGN') + '</div>';
		m += '<div align="center">';

		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btReassignToggle type=checkbox ' + (Options.ReassignOptions.Toggle ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Add toggle button to main screen header") + '</td><td colspan=2 align=center><INPUT id=btAutoReassignState type=submit value="' + tx("Reassign") + ' = ' + (Options.ReassignOptions.Running ? 'ON' : 'OFF') + '"></td><td width=30% align=right>' + tx('Current Reassign Speed') + ':&nbsp;<span id=btreMarchCurrTR></span>&nbsp;&nbsp;</td></tr></table>';
		m += '<table width=100% class=xtab><tr><td align=left><INPUT id=btreMarchTR type=checkbox ' + (Options.ReassignOptions.ThroneCheck ? 'CHECKED' : '') + '></td><td>' + tx('Only reassign when march speed for reassign is at least') + ' <INPUT id=btreMarchTRSpeed type=text size=3 maxlength=4 value="' + Options.ReassignOptions.MarchSpeed + '">&nbsp;%</td><td align=right>&nbsp;' + tx("Check routes every:") + '&nbsp;<INPUT id=pbreassigninterval type=text size=2 value="' + Options.ReassignOptions.ReassignInterval + '"\> ' + tx("minutes") + '</td></tr>';
		m += '<tr><td><INPUT id=pbreassignknights type=checkbox ' + (Options.ReassignOptions.ReassignKnights ? 'CHECKED' : '') + '></td><td>' + tx('Reassign with Knights') + '</td><td align=right>&nbsp;' + tx("March Interval:") + '&nbsp;<INPUT id=pbrmarchinterval type=text size=2 value="' + Options.ReassignOptions.intervalSecs + '"\> ' + tx("seconds") + '</td></tr>';
		m += '<tr><td><INPUT id=pbrevreassign type=checkbox ' + (Options.ReassignOptions.ReverseReassign ? 'CHECKED' : '') + '></td><td colspan=2>' + tx('Reverse reassign if troop numbers fall below keep value') + '</td></tr></table>';
		m += '<div id=pbreMessages align=center>&nbsp;</div>';
		m += '<div id=pbreRouteDetail>&nbsp;</div><br>';

		div.innerHTML = m;

		ToggleOption('ReassignOptions', 'btReassignToggle', 'Toggle');

		ById('btAutoReassignState').addEventListener('click', function () {
			t.toggleAutoReassignState(this);
		}, false);

		ById('pbreassigninterval').addEventListener('keyup', function () {
			if (isNaN(ById('pbreassigninterval').value)) { ById('pbreassigninterval').value = 60; }
			Options.ReassignOptions.ReassignInterval = ById('pbreassigninterval').value;
			saveOptions();
		}, false);
		ById('pbrmarchinterval').addEventListener('keyup', function () {
			if (parseIntNan(ById('pbrmarchinterval').value) < 1) { ById('pbrmarchinterval').value = 5; }
			if (parseIntNan(ById('pbrmarchinterval').value) < 2) { ById('pbrmarchinterval').value = 2; }
			Options.ReassignOptions.intervalSecs = parseIntNan(ById('pbrmarchinterval').value);
			saveOptions();
		}, false);
		ById('pbrevreassign').addEventListener('change', function () {
			Options.ReassignOptions.ReverseReassign = ById('pbrevreassign').checked;
			saveOptions();
		}, false);
		ById('pbreassignknights').addEventListener('change', function () {
			Options.ReassignOptions.ReassignKnights = ById('pbreassignknights').checked;
			saveOptions();
		}, false);
		ById('btreMarchTR').addEventListener('change', function () {
			Options.ReassignOptions.ThroneCheck = this.checked;
			saveOptions();
		}, false);
		ById('btreMarchTRSpeed').addEventListener('change', function () {
			Options.ReassignOptions.MarchSpeed = parseIntNan(this.value);
			saveOptions();
		}, false);

		t.PaintRoutes();

		// start autoreassign loop timer to start in 12 seconds...

		if (Options.ReassignOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, (12 * 1000));
		}
	},

	toggleAutoReassignState: function (obj) {
		var t = Tabs.Reassign;
		obj = ById('btAutoReassignState');
		if (Options.ReassignOptions.Running == true) {
			Options.ReassignOptions.Running = false;
			obj.value = tx("Reassign = OFF");
			clearTimeout(t.timer);
		}
		else {
			Options.ReassignOptions.Running = true;
			obj.value = tx("Reassign = ON");
			// clear the last checked field on all routes
			var n = Options.ReassignOptions.Routes.length;
			while (n--) {
				Options.ReassignOptions.Routes[n].LastChecked = 0;
			}
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, 0);
		}
		saveOptions();
		SetToggleButtonState('Reassign', Options.ReassignOptions.Running, 'Reassign');
	},

	ClearRoutes: function () {
		var t = Tabs.Reassign;
		Options.ReassignOptions.Routes = [];
		saveOptions();
		ById('pbreMessages').innerHTML = tx("All reassign routes deleted!");
		t.PaintRoutes();
	},

	PaintRoutes: function () {
		var t = Tabs.Reassign;

		t.EditMode = false;
		var z = '';
		var r = 0;

		var Routes = false;

		var z = '<div class=divHeader align=center>' + tx('REASSIGN ROUTES') + '</div><br>';
		z += '<div align="center"><TABLE cellSpacing=0 width=98% height=0% class=xtab><tr><td width=90px>' + strButton20(tx('New Route'), 'id=pbreNewRoute') + '</td>';
		z += '<td align=left id=pbrebulkactions>&nbsp;</td>';
		z += '<td align=right>' + strButton20(tx('Delete ALL Routes'), 'id=pbreClearRoutes') + '&nbsp;</td></tr></table>';
		z += '<div style="max-height:535px;overflow-y:scroll;width:' + GlobalOptions.btWinSize.x + 'px;overflow-x:auto" align="center"><TABLE id=pbreRoutesTable cellSpacing=0 width=100% height=0%><tr><td class="xtabHD" style="width:100px"><b>' + tx('Source') + '</b></td><td style="width:100px" class="xtabHD"><b>' + tx('Destination') + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b><td class="xtabHD" align="center" style="width:90px"><b>' + tx('Active') + '</b></td><td class="xtabHD" align="right" style="width: 115px"><span id=pbrenumroutes>' + Options.ReassignOptions.Routes.length + '</span> ' + tx('Routes') + '</td></tr>';

		var FromList = { 0: "-- " + tx('Select City') + " --" };
		var BulkAction = { 0: "-- " + tx('Select Action') + " --", 1: tx("Delete ALL Marches From"), 2: tx("Delete ALL Marches To"), 3: tx("Transfer ALL Marches From"), 4: tx("Transfer ALL Marches To"), 5: tx("Disable ALL Marches From"), 6: tx("Disable ALL Marches To"), 7: tx("Enable ALL Marches From"), 8: tx("Enable ALL Marches To") };
		var CityList = { 0: "-- " + tx('Select City') + " --" };
		for (g in Cities.byID) { CityList[Cities.byID[g].id] = Cities.byID[g].name; }

		var n = Options.ReassignOptions.Routes.length;
		while (n--) {
			var a = Options.ReassignOptions.Routes[n];
			var fid = -1;
			var fromname = '<span class=boldRed>' + tx('No City') + '!</span>';
			if (Cities.byID[a.cityId]) { fromname = Cities.byID[a.cityId].name; fid = a.cityId; }
			FromList[fid] = fromname;
			var fid = -1;
			var toname = '<span class=boldRed>' + tx('No City') + '!</span>';
			if (Cities.byID[a.target_cityId]) { toname = Cities.byID[a.target_cityId].name; fid = a.target_cityId; }
			FromList[fid] = toname;

			Routes = true;
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="' + rowClass + '">';
			z += '<TD style="width:100px" class=xtab valign=top>' + fromname + '</td>';
			z += '<TD style="width:100px" class=xtab valign=top>' + toname + '</td>';

			var zz = '<table cellpadding=0 cellspacing=0 class=xtab><tr>';

			// loop troops

			var c = 0;
			var LineBreak = 3;
			if (GlobalOptions.btWinSize.x == 750) { LineBreak = 2; }
			if (GlobalOptions.btWinSize.x == 1250) { LineBreak = 4; }
			for (var ui in CM.UNIT_TYPES) {
				var i = CM.UNIT_TYPES[ui];
				if (a.troops[i]) {
					var nn = '<TD width=30px>' + TroopImage(i) + '</td>';
					nn += '<TD width=150px>' + tx("Keep") + ':&nbsp;' + addCommas(parseIntNan(a.keep[i])) + '</td>';
					if (c % LineBreak == 0) zz += '</tr><tr>';
					zz += nn;
					c++;
				}
			}
			zz += '</tr></table><br>'

			z += '<TD class=xtabBRTop>' + zz + '</td>';
			z += '<TD style="width:90px" class=xtab align=center valign=top><INPUT id="pbreRouteActive' + n + '" type=checkbox ' + (a.Active ? 'CHECKED' : '') + ' onclick="pbreToggleActive(' + n + ')" /><div id="pbreRouteStatus' + n + '"><span><br><br></span><//div></td>';
			z += '<TD style="width:100px" class=xtab align=right valign=top><a id="pbreRouteEdit' + n + '" class="inlineButton btButton brown8" onclick="pbreEditRoute(' + n + ')"><span>' + tx('Edit') + '</span></a>&nbsp;<a id="pbreRouteDelete' + n + '" class="inlineButton btButton brown8" onclick="pbreDeleteRoute(' + n + ')"><span>' + tx('Del') + '</span></a></a></td>';
			z += '</tr>';
		}

		if (!Routes) {
			z += '<tr><td colspan=5 class=xtab><div align="center"><br><br>' + tx('No reassign routes') + '</div></td></tr>';
		}

		z += '</table></div><br>';

		ById('pbreRouteDetail').innerHTML = z;
		ById('pbrebulkactions').innerHTML = tx("Bulk Action") + ":&nbsp;" + htmlSelector(BulkAction, 0, 'class=btInput id=pbrebulkaction') + '&nbsp;' + htmlSelector(FromList, 0, 'class=btInput id=pbrebulkfrom') + '&nbsp;<span id=pbrebulknew class=divHide>To&nbsp;' + htmlSelector(CityList, 0, 'class=btInput id=pbrebulkto') + '</span>&nbsp;' + strButton8(tx('Go'), 'id=pbrebulkgo');

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		ById('pbrebulkgo').addEventListener('click', function () { t.DoBulkAction(ById('pbrebulkaction').value, ById('pbrebulkfrom').value, ById('pbrebulkto').value); }, false);
		ById('pbrebulkaction').addEventListener('change', function (e) {
			if (e.target.value == 3 || e.target.value == 4) { jQuery('#pbrebulknew').removeClass("divHide"); }
			else { jQuery('#pbrebulknew').addClass("divHide"); }
		}, false);

		ById('pbreClearRoutes').addEventListener('click', function () { t.ClearRoutes(); }, false);
		ById('pbreNewRoute').addEventListener('click', function () { t.NewRoute(); }, false);
		t.updateRoutes();
	},

	DoBulkAction: function (Action, From, To) {
		var t = Tabs.Reassign;
		ById('pbreMessages').innerHTML = "&nbsp;";
		if (Action == 0 || From == 0) return;
		if ((Action == 3 || Action == 4) && To == 0) return;
		for (var i = Number(Options.ReassignOptions.Routes.length - 1); i > -1; i--) {
			if (Action == 1 || Action == 3 || Action == 5 || Action == 7) {
				if ((Options.ReassignOptions.Routes[i].cityId == From) || (From == -1 && !Cities.byID[Options.ReassignOptions.Routes[i].cityId])) {
					if (Action == 1) { Options.ReassignOptions.Routes.splice(i, 1); }
					else {
						if (Action == 3) { Options.ReassignOptions.Routes[i].cityId = To; }
						else {
							if (Action == 5) { Options.ReassignOptions.Routes[i].Active = false; }
							else {
								if (Action == 7) { Options.ReassignOptions.Routes[i].Active = true; }
							}
						}
					}
				}
			}
			if (Action == 2 || Action == 4 || Action == 6 || Action == 8) {
				if (parseIntNan(Options.ReassignOptions.Routes[i].target_cityId) != 0) {
					if ((Options.ReassignOptions.Routes[i].target_cityId == From) || (From == -1 && !Cities.byID[Options.ReassignOptions.Routes[i].target_cityId])) {
						if (Action == 2) { Options.ReassignOptions.Routes.splice(i, 1); }
						else {
							if (Action == 4) {
								Options.ReassignOptions.Routes[i].target_cityId = To;
							}
							else {
								if (Action == 6) { Options.ReassignOptions.Routes[i].Active = false; }
								else {
									if (Action == 8) { Options.ReassignOptions.Routes[i].Active = true; }
								}
							}
						}
					}
				}
			}
		}
		saveOptions();
		if (Action == 1 || Action == 2) { ById('pbreMessages').innerHTML = tx("Reassign routes deleted!"); }
		else {
			if (Action == 3 || Action == 4) { ById('pbreMessages').innerHTML = tx("Reassign routes relocated!"); }
		}
		t.PaintRoutes();
	},

	DeleteRoute: function (entry) {
		var t = Tabs.Reassign;
		Options.ReassignOptions.Routes.splice(entry, 1);
		saveOptions();
		ById('pbreMessages').innerHTML = tx("Reassign route deleted!");
		t.PaintRoutes();
	},

	ToggleActive: function (entry) {
		var t = Tabs.Reassign;
		Options.ReassignOptions.Routes[entry].Active = !Options.ReassignOptions.Routes[entry].Active;
		saveOptions();
		t.updateRoutes();
	},

	SendRoute: function (entry) {
		var t = Tabs.Reassign;
		Options.ReassignOptions.Routes[entry].LastChecked = 0;
		saveOptions();
		t.updateRoutes();
	},

	EditRoute: function (entry) {
		var t = Tabs.Reassign;
		t.EditRouteNumber = entry;
		t.EditMode = true;
		ById('pbreMessages').innerHTML = "&nbsp;";

		t.RouteObject = {};
		for (var y in Options.ReassignOptions.Routes[t.EditRouteNumber]) {
			t.RouteObject[y] = Options.ReassignOptions.Routes[t.EditRouteNumber][y];
		}
		if (!t.RouteObject.OverrideTime) {
			t.RouteObject.Interval = Options.ReassignOptions.ReassignInterval;
		}
		t.PaintNewRoutePanel();
	},

	NewRoute: function () {
		var t = Tabs.Reassign;
		t.EditRouteNumber = -1;
		t.EditMode = true;
		ById('pbreMessages').innerHTML = "&nbsp;";

		if (!t.RouteObject) {
			t.RouteObject = {};
			for (var y in t.NewRouteObject) {
				t.RouteObject[y] = t.NewRouteObject[y];
			}
			t.RouteObject.Interval = Options.ReassignOptions.ReassignInterval;
		}
		t.PaintNewRoutePanel();
	},

	show: function () {
		var t = Tabs.Reassign;
		t.PaintOverview();
		if (t.EditMode) { t.updateResources(); }
		else { t.updateRoutes(); }
	},

	EverySecond: function () {
		var t = Tabs.Reassign;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter % 2 == 0) { // refresh reassign march speed and overview display every 2 seconds
			t.marchspeed = Math.floor(equippedthronestats(67)) + Math.floor(equippedthronestats(71)) + Math.floor(equippedthronestats(163)); // march speed is reassign and general march speed added together
			if (tabManager.currentTab.name == 'Reassign' && Options.btWinIsOpen) {
				t.PaintOverview();

				if (t.EditMode) { // paint from and to city resources
					t.updateResources();
				}
				else { // paint time on each route?
					t.updateRoutes();
				}
			}
		}
	},

	PaintOverview: function () {
		var t = Tabs.Reassign;

		if (Options.ReassignOptions.ThroneCheck && (t.marchspeed < Number(Options.ReassignOptions.MarchSpeed))) {
			ts = '<span class=boldRed><b>' + t.marchspeed + '%</b></span>';
		}
		else { ts = t.marchspeed + '%'; }
		ById("btreMarchCurrTR").innerHTML = ts;
	},

	PaintNewRoutePanel: function () {
		var t = Tabs.Reassign;
		var fromidx = null;
		var toidx = null;

		if (t.EditRouteNumber < 0) {
			var z = '<div class=divHeader align=center>' + tx('NEW REASSIGN ROUTE') + '</div><br>';
			fromidx = Cities.byID[uW.currentcityid].idx; // default new route from current city
		}
		else {
			var z = '<div class=divHeader align=center>' + tx('EDIT REASSIGN ROUTE') + '</div><br>';
		}

		// remember last route details.... (or saved route details)

		if (Cities.byID[t.RouteObject.cityId]) {
			fromidx = Cities.byID[t.RouteObject.cityId].idx;
		}
		if (Cities.byID[t.RouteObject.target_cityId]) {
			toidx = Cities.byID[t.RouteObject.target_cityId].idx;
		}

		z += '<TABLE align=left class=xtab>';
		z += '<TR><TD align=right>&nbsp;' + tx("From City") + ':&nbsp;</td><TD><span id=pbrfromcity></span></td></tr>';
		z += '<TR><TD align=right>&nbsp;' + tx("To City") + ':&nbsp;</td><TD><span id=pbrtocity></span></td></tr>';

		z += '<TR><TD align=right>&nbsp;</td><TD><INPUT id=pbroverrideintervalchk type=checkbox ' + (t.RouteObject.OverrideTime ? 'CHECKED' : '') + '>&nbsp;' + tx('Override reassign interval') + '</td><TD align=right>' + tx("Reassign Interval") + ':&nbsp;</td><TD><INPUT id=pbroverrideinterval type=text size=2 value="' + t.RouteObject.Interval + '" ' + (t.RouteObject.OverrideTime ? '' : 'disabled') + ' \> ' + tx("minutes") + '</td></tr>';
		z += '<TR><TD align=right>&nbsp;</td><TD><INPUT id=pbrselectall type=checkbox>&nbsp;' + tx('Select/Unselect ALL') + '</td><TD align=right>&nbsp;</td><TD><INPUT id=pbrzeroise type=button value="' + tx("Zeroise values") + '"\>&nbsp;<INPUT id=pbrdefault type=button value="' + tx("Default city values") + '"\></td></tr>';
		z += '</table><br>';

		var c = 0;
		var LineBreak = 7;
		if (GlobalOptions.btWinSize.x == 750) { LineBreak = 5; }
		if (GlobalOptions.btWinSize.x == 1250) { LineBreak = 8; }
		z += '<table class=xtab cellpadding=4 cellspacing=0 align="center"><tr>';
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var n = '<td><table class=xtab cellspacing=0 cellpadding=0><tr style="vertical-align:top;"><td rowspan=2 width="30px">' + TroopImageBig(i) + '</td><td>' + uW.unitnamedesctranslated['unt' + i][0] + '</td></tr>';
			n += '<tr><td><INPUT type=CHECKBOX id="chkRein' + i + '" ' + (t.RouteObject.troops[i] ? 'CHECKED' : '') + '></td></tr>';
			n += '<tr><td align=right>' + tx('Keep') + ':</td><td><INPUT class=btInput id="pbReinKeep' + i + '" type=text size=11 maxlength=12 value="' + (t.RouteObject.keep[i] || 0) + '" ' + (t.RouteObject.troops[i] ? '' : 'disabled') + ' \></td></tr></table></td>';
			if (c % LineBreak == 0) z += '</tr><tr>';
			z += n;
			c++;
		}
		z += '</table>'

		z += '<div align="center"><TABLE cellSpacing=0 width=98% height=0% class=xtab><tr><td>&nbsp;</td><td align=center>' + strButton20(tx('Save Route'), 'id=pbreSaveRoute') + '&nbsp;';
		if (t.EditRouteNumber >= 0) { z += strButton20(tx('Save a Copy'), 'id=pbreCopyRoute') + '&nbsp;'; }
		z += strButton20(uW.g_js_strings.commonstr.cancel, 'id=pbreCancelRoute') + '</td><td align=right>&nbsp;</td></tr></table></div>';

		ById('pbreRouteDetail').innerHTML = z;

		t.dcp0 = new CdispCityPicker('pbreassignfrom', ById('pbrfromcity'), true, t.updateResources, fromidx);
		t.dcp1 = new CdispCityPicker('pbreassignto', ById('pbrtocity'), true, t.updateResources, toidx);

		ById('pbroverrideintervalchk').addEventListener('click', function () {
			var disablerow = (!ById('pbroverrideintervalchk').checked);
			ById('pbroverrideinterval').disabled = disablerow;
			if (disablerow) {
				ById('pbroverrideinterval').value = Options.ReassignOptions.ReassignInterval;
			}
		}, false);
		ById('pbrzeroise').addEventListener('click', function () {
			for (var ui in CM.UNIT_TYPES) {
				var i = CM.UNIT_TYPES[ui];
				ById('pbReinKeep' + i).value = 0;
			}
		}, false);
		ById('pbrdefault').addEventListener('click', function () {
			if (t.dcp0 && t.dcp0.city) {
				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					ById('pbReinKeep' + i).value = getCityTroops(i, t.dcp0.city.id, true);
				}
			}
		}, false);
		ById('pbrselectall').addEventListener('click', function () {
			for (var ui in CM.UNIT_TYPES) {
				var i = CM.UNIT_TYPES[ui];
				ById('chkRein' + i).checked = ById('pbrselectall').checked;
				ById('pbReinKeep' + i).disabled = (!ById('pbrselectall').checked);
			}
		}, false);

		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			t.addListeners(i);
		}

		ById('pbreSaveRoute').addEventListener('click', function () { t.SaveRoute(false); }, false);
		if (ById('pbreCopyRoute')) { ById('pbreCopyRoute').addEventListener('click', function () { t.SaveRoute(true); }, false); }
		ById('pbreCancelRoute').addEventListener('click', function () { t.RouteObject = null; t.PaintRoutes(); }, false);

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
		t.updateResources();
	},

	addListeners: function (Troop) {
		var T1 = 'pbReinKeep' + Troop;
		var T2 = 'chkRein' + Troop;
		ById(T1).addEventListener('keyup', function () { if (isNaN(ById(T1).value)) ById(T1).value = 0; }, false);
		ById(T2).addEventListener('click', function () { ById(T1).disabled = (!ById(T2).checked); }, false);
	},

	SaveRoute: function (CopyRoute) {
		var t = Tabs.Reassign;

		if (!t.validateScreenFields('save')) { return; }

		if (t.EditRouteNumber < 0 || CopyRoute) {
			Options.ReassignOptions.Routes.push(JSON2.parse(JSON2.stringify(t.RouteObject))); // create new object in array
			if (CopyRoute) { t.RouteObject = null; } // clear route object
		}
		else {
			t.RouteObject.LastChecked = 0;
			Options.ReassignOptions.Routes[t.EditRouteNumber] = t.RouteObject;
			t.RouteObject = null; // clear route object
		}
		ById('pbreMessages').innerHTML = tx("Reassign route saved") + "!";
		t.PaintRoutes();
	},

	validateScreenFields: function (action) {
		var t = Tabs.Reassign;

		if (!t.dcp0.city) {
			ById('pbreMessages').innerHTML = tx("No source city selected");
			return false;
		}
		if (!t.dcp1.city) {
			ById('pbreMessages').innerHTML = tx("No destination city selected");
			return false;
		}
		if (t.dcp0.city.id == t.dcp1.city.id) {
			ById('pbreMessages').innerHTML = tx("Cannot reassign to the same city") + "!";
			return false;
		}

		// copy screen fields to routeobject

		t.RouteObject.cityId = t.dcp0.city.id;
		t.RouteObject.target_cityId = t.dcp1.city.id;

		t.RouteObject.troops = {};
		t.RouteObject.keep = {};

		var gottroops = false;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			if (ById('chkRein' + i).checked) {
				gottroops = true;
				t.RouteObject.troops[i] = true;
				t.RouteObject.keep[i] = parseIntNan(ById('pbReinKeep' + i).value);
			}
		}

		if (!gottroops) {
			ById('pbreMessages').innerHTML = tx("You must reassign something") + "!";
			return false;
		}

		t.RouteObject.OverrideTime = ById('pbroverrideintervalchk').checked;
		t.RouteObject.Interval = parseIntNan(ById('pbroverrideinterval').value);

		// validation OK!
		return true;
	},

	updateResources: function () {
		var t = Tabs.Reassign;
		if (!t.dcp0 || !t.dcp0.city) return;
		// at the moment nothing to do!
	},

	updateRoutes: function () {
		var t = Tabs.Reassign;

		if (!tabManager.currentTab || tabManager.currentTab.name != 'Reassign' || !Options.btWinIsOpen) { return; }

		var n = Options.ReassignOptions.Routes.length;
		while (n--) {
			var a = Options.ReassignOptions.Routes[n];
			var elstat = ById('pbreRouteStatus' + n);
			if (elstat) {
				elstat.innerHTML = '<span><br><br></span>';
				if (Options.ReassignOptions.Running) {
					if (a.Active) {
						if (Options.ReassignOptions.ThroneCheck && (t.marchspeed < Options.ReassignOptions.MarchSpeed)) {
							elstat.innerHTML = '<span class=boldRed>' + tx('March') + '<br>' + tx('Speed') + '!<br></span>';
						}
						else {
							var now = unixTime();
							var interval = Options.ReassignOptions.ReassignInterval * 60;
							if (a.OverrideTime) { interval = a.Interval * 60; }
							var due = a.LastChecked + interval;
							if (due < now) {
								elstat.innerHTML = '<span class=boldGreen>' + tx('Checking') + '...<br><br></span>';
							}
							else {
								elstat.innerHTML = uW.timestr(due - now) + '<br><a class=xlink id="pbreRouteCheck' + n + '" onclick="pbreSendRoute(' + n + ')"><span>Check Now</span></a>';
							}
						}
					}
				}
			}
		}
	},

	doAutoLoop: function (idx, rev) {
		var t = Tabs.Reassign;
		clearTimeout(t.timer);
		if (!Options.ReassignOptions.Running) return;

		if (idx >= Options.ReassignOptions.Routes.length) { idx = 0; } // safety, if route(s) have been deleted.
		if (idx == 0 && !rev) { t.loopaction = false; } // reset loop march indicator for first march
		t.autodelay = 0; // no delay if no action taken...

		if (idx < Options.ReassignOptions.Routes.length) {
			var a = Options.ReassignOptions.Routes[idx];

			if (a.Active) {
				var now = unixTime();
				var interval = Options.ReassignOptions.ReassignInterval * 60;
				if (a.OverrideTime) { interval = a.Interval * 60; }
				var due = a.LastChecked + interval;
				if ((due < now) || rev) {
					// check if march is required...
					t.more = false;
					t.doReassigns(idx, rev);
					if (!rev) {
						if (!t.more) {
							Options.ReassignOptions.Routes[idx]["LastChecked"] = uW.unixtime();
							saveOptions();
							t.updateRoutes();
						}
						if (Options.ReassignOptions.ReverseReassign) { // check for reverse reassign on this route
							t.timer = setTimeout(function () { t.doAutoLoop(idx, true); }, (t.autodelay * 1000));
							return;
						}
					}
				}
			}
		}

		if (idx >= Options.ReassignOptions.Routes.length - 1) {
			if (!t.loopaction) { t.autodelay = Options.ReassignOptions.intervalSecs; } // if no action this loop, apply delay anyway...
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, (t.autodelay * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx + 1, false); }, (t.autodelay * 1000));
		}
	},

	doReassigns: function (idx, rev) {
		var t = Tabs.Reassign;
		var a = Options.ReassignOptions.Routes[idx];

		if (Options.ReassignOptions.ThroneCheck && (t.marchspeed < Options.ReassignOptions.MarchSpeed)) { return; } // if not enough march speed

		if (!rev) {
			var sourcecityId = parseIntNan(a["cityId"]);
			var destcityId = a["target_cityId"];
		}
		else {
			if (a["rev_eta"] && parseInt(a["rev_eta"]) > uW.unixtime()) { return; } // only one reverse reassign on each route at a time
			var sourcecityId = a["target_cityId"];
			var destcityId = parseIntNan(a["cityId"]);
		}

		if (!Cities.byID[sourcecityId]) { return; } // no source city!
		if (!Cities.byID[destcityId]) { return; } // no destination city!

		var towerok = (!Options.TowerOptions || !Options.TowerOptions.SaveCityState[sourcecityId] || Options.TowerOptions.SaveCityState[sourcecityId].AllowMarches);
		if (!towerok) { return; } // source city under attack!

		var ascensionok = (!Options.BuildOptions || !Options.BuildOptions.AscensionReady[Cities.byID[sourcecityId].idx]);
		if (!ascensionok) { return; } // source city waiting to ascend!

		var targetname = Cities.byID[destcityId].name;
		var xcoord = Cities.byID[destcityId].x;
		var ycoord = Cities.byID[destcityId].y;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = sourcecityId;
		params.kid = 0;
		if (Options.ReassignOptions.ReassignKnights && !rev) {
			var knt = getAvailableKnights(sourcecityId);
			if (knt[0]) {
				knt = knt.sort(function sort(a, b) { a = a['ID']; b = b['ID']; return a == b ? 0 : (a < b ? -1 : 1); }); // sort by reverse id
				params.kid = knt[0].ID;
			}
		}
		params.type = 5;
		params.xcoord = xcoord;
		params.ycoord = ycoord;
		params.r1 = 0;
		params.r2 = 0;
		params.r3 = 0;
		params.r4 = 0;
		params.r5 = 0;
		params.gold = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			params["u" + i] = 0;
		}

		var maxsend = March.getMaxSize(sourcecityId);
		var totalsend = 0;

		var slots = Number(March.getEmptySlots(sourcecityId));
		if (parseInt(slots) <= Number(Options.FreeRallySlots)) { // no free slots - don't bother server!
			if (GlobalOptions.ExtendedDebugMode) { actionLog(Cities.byID[sourcecityId].name + ": No available rally slots", 'REASSIGN'); }
			return;
		}

		var troopidx = [];
		for (var ui in CM.UNIT_TYPES) {
			troopidx.push(CM.UNIT_TYPES[ui]);
		}
		for (var j = troopidx.length - 1; j >= 0; j--) { // reverse order
			var i = troopidx[j];
			if (!Options.ReassignOptions.Routes[idx].troops[i]) { continue; }
			if (!Seed.cityData.city[destcityId].isPrestigeCity && ((i == 13) || (i == 14) || (i == 15))) { continue; }
			var keepvalue = parseIntNan(Options.ReassignOptions.Routes[idx].keep[i]);
			var availtroops = parseIntNan(Seed.units['city' + sourcecityId]['unt' + i]);

			if (!rev) {
				var citytotal = getCityTroops(i, sourcecityId, true);

				if (citytotal > keepvalue) {
					var sendtroops = parseIntNan(citytotal - keepvalue);
					if (sendtroops > availtroops) { sendtroops = availtroops; }
					if (sendtroops < 0) { sendtroops = 0; }
					params["u" + i] = sendtroops;
					totalsend += sendtroops;
				}
			}
			else {
				var citytotal = getCityTroops(i, destcityId, true);

				if (citytotal < keepvalue) {
					var sendtroops = parseIntNan(keepvalue - citytotal);
					if (sendtroops > availtroops) { sendtroops = availtroops; }
					if (sendtroops < 0) { sendtroops = 0; }
					params["u" + i] = sendtroops;
					totalsend += sendtroops;
				}
			}

			if (totalsend > maxsend) {
				totalsend -= sendtroops;
				params["u" + i] = parseInt(maxsend - totalsend);
				totalsend = maxsend;
				t.more = true;
				break;
			}
		}

		if (totalsend > 0) { // final safety net
			t.autodelay = Options.ReassignOptions.intervalSecs; // march is required, so delay subsequent loop
			t.loopaction = true;

			March.addMarch(params, function (rslt) {
				if (rslt.ok) {
					if (!rev) {
						actionLog(Cities.byID[sourcecityId].name + ": " + totalsend + " troops reassigned to " + targetname, 'REASSIGN');
					}
					else {
						actionLog(Cities.byID[sourcecityId].name + ": " + totalsend + " troops reverse-reassigned to " + targetname, 'REASSIGN');
						Options.ReassignOptions.Routes[idx]["rev_eta"] = parseInt(rslt.eta);
						saveOptions();
					}
				}
				else {
					if (!rslt.msg) { rslt.msg = tx('Error Code (') + rslt.error_code + ')'; }
					if (!rev) { actionLog(Cities.byID[sourcecityId].name + ": Reassign Error - " + rslt.msg, 'REASSIGN'); }
					else { actionLog(Cities.byID[sourcecityId].name + ": Reverse Reassign Error - " + rslt.msg, 'REASSIGN'); }
				}
			});
		}
	},
}
