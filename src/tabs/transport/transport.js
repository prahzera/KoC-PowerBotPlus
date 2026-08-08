/** Transport Tab **/

Tabs.Transport = {
	tabOrder: 2030,
	tabLabel: 'Transport',
	tabColor: 'brown',
	myDiv: null,
	dcp0: null,
	dcp1: null,
	timer: null,
	autodelay: 0,
	loopaction: false,
	marchspeed: 0,
	LoopCounter: 0,
	EditRouteNumber: -1,
	EditMode: false,
	LoadSac: '',
	Gold_Capacity: 12000000000,
	Options: {
		Running: false,
		Toggle: false,
		Routes: [],
		TransportInterval: 10,
		intervalSecs: 5,
		MinWagons: 100,
		ReverseTransport: false,
		ReverseTransportPercent: 90,
		ThroneCheck: false,
		MarchSpeed: 0,
		Priority: "1,4,5,3,2", // food, ore, aether, stone, wood
		LastTroopType: 9,
		GoldCap: true,
	},
	NewRouteObject: {
		cityId: null,
		target_x: '',
		target_y: '',
		target_cityId: null,
		TroopType: 9,
		ship_Gold: false,
		ship_Food: false,
		ship_Wood: false,
		ship_Stone: false,
		ship_Ore: false,
		ship_Aether: false,
		keep_Gold: 0,
		keep_Food: 0,
		keep_Wood: 0,
		keep_Stone: 0,
		keep_Ore: 0,
		keep_Aether: 0,
		trade_Gold: 0,
		trade_Food: 0,
		trade_Wood: 0,
		trade_Stone: 0,
		trade_Ore: 0,
		trade_Aether: 0,
		Active: true,
		OverrideTime: false,
		Interval: 10,
		LastChecked: 0,
	},
	RouteObject: null,

	init: function (div) {
		var t = Tabs.Transport;
		t.myDiv = div;

		if (!Options.TransportOptions) {
			Options.TransportOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.TransportOptions.hasOwnProperty(y)) {
					Options.TransportOptions[y] = t.Options[y];
				}
			}
		}
		t.checkcitymoved();

		uWExportFunction('pbtrDeleteRoute', Tabs.Transport.DeleteRoute);
		uWExportFunction('pbtrEditRoute', Tabs.Transport.EditRoute);
		uWExportFunction('pbtrSendRoute', Tabs.Transport.SendRoute);
		uWExportFunction('pbtrToggleActive', Tabs.Transport.ToggleActive);

		if (Options.TransportOptions.Toggle) AddSubTabLink('Transport', t.toggleAutoTransportState, 'TransportToggleTab');
		SetToggleButtonState('Transport', Options.TransportOptions.Running, 'Transport');

		var m = '<DIV class=divHeader align=center>' + tx('AUTOMATED TRANSPORT') + '</div>';
		m += '<div align="center">';

		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btTransportToggle type=checkbox ' + (Options.TransportOptions.Toggle ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Add toggle button to main screen header") + '</td><td colspan=2 align=center><INPUT id=btAutoTransportState type=submit value="' + tx("Transport") + ' = ' + (Options.TransportOptions.Running ? 'ON' : 'OFF') + '"></td><td width=30% align=right>' + tx('Current Transport Speed') + ':&nbsp;<span id=bttrMarchCurrTR></span>&nbsp;&nbsp;</td></tr></table>';
		m += '<table width=100% class=xtab><tr><td align=left><INPUT id=bttrMarchTR type=checkbox ' + (Options.TransportOptions.ThroneCheck ? 'CHECKED' : '') + '></td><td>' + tx('Only transport when march speed for transports is at least') + ' <INPUT id=bttrMarchTRSpeed type=text size=3 maxlength=4 value="' + Options.TransportOptions.MarchSpeed + '">&nbsp;%</td><td align=right>&nbsp;' + tx("Check routes every:") + '&nbsp;<INPUT id=pbtransportinterval type=text size=2 value="' + Options.TransportOptions.TransportInterval + '"\> ' + tx("minutes") + '</td></tr>';
		m += '<tr><td>&nbsp;</td><td>' + tx("Do not march if less than") + ' <INPUT id=pbminwagons type=text size=6 value="' + Options.TransportOptions.MinWagons + '"\> ' + tx("troops are needed. (Avoids needless transports)") + '</td><td align=right>&nbsp;' + tx("March Interval:") + '&nbsp;<INPUT id=pbtmarchinterval type=text size=2 value="' + Options.TransportOptions.intervalSecs + '"\> ' + tx("seconds") + '</td></tr>';
		m += '<tr><td><INPUT id=pbrevtrans type=checkbox ' + (Options.TransportOptions.ReverseTransport ? 'CHECKED' : '') + '></td><td>' + tx('Reverse transport if resource amount falls below') + ' <INPUT id=pbrevtranspc type=text size=2 value="' + Options.TransportOptions.ReverseTransportPercent + '"\> % ' + tx('of the Keep value') + '.</td><td align=right>&nbsp;' + tx("Transport Priority:") + '&nbsp;' + htmlSelector({ "1,4,5,3,2": uW.g_js_strings.commonstr.food, "4,1,5,3,2": uW.g_js_strings.commonstr.ore }, Options.TransportOptions.Priority, 'id=pbtPriority') + '</td></tr>';
		m += '<tr><td><INPUT id=pbgoldcap type=checkbox ' + (Options.TransportOptions.GoldCap ? 'CHECKED' : '') + '></td><td>' + tx('Do not transport gold above target city capacity') + '</td><td align=right>&nbsp;</td></tr></table>';
		m += '<div id=pbtrMessages align=center>&nbsp;</div>';
		m += '<div id=pbtrRouteDetail>&nbsp;</div><br>';

		div.innerHTML = m;

		ToggleOption('TransportOptions', 'btTransportToggle', 'Toggle');

		ById('btAutoTransportState').addEventListener('click', function () {
			t.toggleAutoTransportState(this);
		}, false);

		ById('pbtransportinterval').addEventListener('keyup', function () {
			if (isNaN(ById('pbtransportinterval').value)) { ById('pbtransportinterval').value = 60; }
			Options.TransportOptions.TransportInterval = ById('pbtransportinterval').value;
			saveOptions();
		}, false);
		ById('pbtmarchinterval').addEventListener('keyup', function () {
			if (parseIntNan(ById('pbtmarchinterval').value) < 1) { ById('pbtmarchinterval').value = 5; }
			if (parseIntNan(ById('pbtmarchinterval').value) < 2) { ById('pbtmarchinterval').value = 2; }
			Options.TransportOptions.intervalSecs = parseIntNan(ById('pbtmarchinterval').value);
			saveOptions();
		}, false);
		ById('pbtPriority').addEventListener('change', function () {
			Options.TransportOptions.Priority = ById('pbtPriority').value;
			saveOptions();
		}, false);
		ById('pbrevtrans').addEventListener('change', function () {
			Options.TransportOptions.ReverseTransport = ById('pbrevtrans').checked;
			saveOptions();
		}, false);
		ById('pbrevtranspc').addEventListener('keyup', function () {
			if (isNaN(ById('pbrevtranspc').value)) { ById('pbrevtranspc').value = 0; }
			Options.TransportOptions.ReverseTransportPercent = ById('pbrevtranspc').value;
			saveOptions();
		}, false);
		ById('pbminwagons').addEventListener('keyup', function () {
			if (isNaN(ById('pbminwagons').value)) { ById('pbminwagons').value = 100; }
			Options.TransportOptions.MinWagons = ById('pbminwagons').value;
			saveOptions();
		}, false)
		ById('bttrMarchTR').addEventListener('change', function () {
			Options.TransportOptions.ThroneCheck = this.checked;
			saveOptions();
		}, false);
		ById('bttrMarchTRSpeed').addEventListener('change', function () {
			Options.TransportOptions.MarchSpeed = parseIntNan(this.value);
			saveOptions();
		}, false);
		ById('pbgoldcap').addEventListener('change', function () {
			Options.TransportOptions.GoldCap = ById('pbgoldcap').checked;
			saveOptions();
		}, false);

		t.PaintRoutes();

		// start autotransport loop timer to start in 10 seconds...

		if (Options.TransportOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, (10 * 1000));
		}
	},

	toggleAutoTransportState: function (obj) {
		var t = Tabs.Transport;
		obj = ById('btAutoTransportState');
		if (Options.TransportOptions.Running == true) {
			Options.TransportOptions.Running = false;
			obj.value = tx("Transport = OFF");
			clearTimeout(t.timer);
		}
		else {
			Options.TransportOptions.Running = true;
			obj.value = tx("Transport = ON");
			// clear the last checked field on all routes
			var n = Options.TransportOptions.Routes.length;
			while (n--) {
				Options.TransportOptions.Routes[n].LastChecked = 0;
			}
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, 0);
		}
		saveOptions();
		SetToggleButtonState('Transport', Options.TransportOptions.Running, 'Transport');
	},

	checkcitymoved: function () {
		var t = Tabs.Transport;
		for (var i = 0; i < Options.TransportOptions.Routes.length; i++) {
			if (parseIntNan(Options.TransportOptions.Routes[i].target_cityId) != 0 && Cities.byID[Options.TransportOptions.Routes[i].target_cityId]) {
				Options.TransportOptions.Routes[i].target_x = Cities.byID[Options.TransportOptions.Routes[i].target_cityId].x;
				Options.TransportOptions.Routes[i].target_y = Cities.byID[Options.TransportOptions.Routes[i].target_cityId].y;
			}
		}
		saveOptions();
	},

	ClearRoutes: function () {
		var t = Tabs.Transport;
		Options.TransportOptions.Routes = [];
		saveOptions();
		ById('pbtrMessages').innerHTML = tx("All transport routes deleted") + "!";
		t.PaintRoutes();
	},

	PaintRoutes: function () {
		var t = Tabs.Transport;

		t.EditMode = false;
		var z = '';
		var r = 0;

		var Routes = false;

		var z = '<div class=divHeader align=center>' + tx('TRANSPORT ROUTES') + '</div><br>';
		z += '<div align="center"><TABLE cellSpacing=0 width=98% height=0% class=xtab><tr><td width=90px>' + strButton20(tx('New Route'), 'id=pbtrNewRoute') + '</td>';
		z += '<td align=left id=pbtrbulkactions>&nbsp;</td>';
		z += '<td align=right>' + strButton20(tx('Delete ALL Routes'), 'id=pbtrClearRoutes') + '&nbsp;</td></tr></table>';
		z += '<div style="max-height:535px;overflow-y:scroll;width:' + GlobalOptions.btWinSize.x + 'px;overflow-x:auto" align="center"><TABLE id=pbtrRoutesTable cellSpacing=0 width=100% height=0%><tr><td class="xtabHD" style="width:100px"><b>' + tx('Source') + '</b></td><td style="width:100px" class="xtabHD"><b>' + tx('Destination') + '</b></td><td style="width:100px" class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.resources + '</b></td><td class="xtabHD" align="center" style="width:90px"><b>' + tx('Active') + '</b></td><td class="xtabHD" align="right" style="width: 115px"><span id=pbtrnumroutes>' + Options.TransportOptions.Routes.length + '</span> ' + tx('Routes') + '</td></tr>';

		var FromList = { 0: "-- " + tx('Select City') + " --" };
		var BulkAction = { 0: "-- " + tx('Select Action') + " --", 1: tx("Delete ALL Marches From"), 2: tx("Delete ALL Marches To"), 3: tx("Transfer ALL Marches From"), 4: tx("Transfer ALL Marches To"), 5: tx("Disable ALL Marches From"), 6: tx("Disable ALL Marches To"), 7: tx("Enable ALL Marches From"), 8: tx("Enable ALL Marches To") };
		var CityList = { 0: "-- " + tx('Select City') + " --" };
		for (g in Cities.byID) { CityList[Cities.byID[g].id] = Cities.byID[g].name; }

		var n = Options.TransportOptions.Routes.length;
		while (n--) {
			var a = Options.TransportOptions.Routes[n];
			var fid = -1;
			var fromname = '<span class=boldRed>' + tx('No City') + '!</span>';
			if (Cities.byID[a.cityId]) { fromname = Cities.byID[a.cityId].name; fid = a.cityId; }
			FromList[fid] = fromname;
			var toname = '<span class=boldRed>' + tx('No City') + '!</span>';
			if (a.target_cityId != 0) {
				var fid = -1;
				if (Cities.byID[a.target_cityId]) { toname = Cities.byID[a.target_cityId].name; fid = a.target_cityId; }
				FromList[fid] = toname;
			}
			else {
				toname = coordLink(a.target_x, a.target_y);
			}

			Routes = true;
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="' + rowClass + '">';
			z += '<TD style="width:100px" class=xtab valign=top>' + fromname + '</td>';
			z += '<TD style="width:100px" class=xtab valign=top>' + toname + '</td>';
			z += '<TD style="width:100px" class=xtab valign=top>' + uW.unitcost['unt' + a.TroopType][0] + '</td>';

			var zz = '<table cellpadding=0 cellspacing=0 class=xtab>';
			if (a.ship_Food) {
				zz += '<TR><TD width=30px>' + ResourceImage(FoodImage, uW.g_js_strings.commonstr.food) + '</td>';
				if (parseIntNan(a.keep_Food) != 0 || parseIntNan(a.trade_Food) == 0) { zz += '<TD width=175px>' + tx("Keep") + ':&nbsp;' + addCommas(a.keep_Food) + '</td>'; }
				if (parseIntNan(a.trade_Food) != 0) { zz += '<TD width=175px>' + tx("Trade") + ':&nbsp;' + addCommas(a.trade_Food) + '</td>'; }
				zz += '</tr>';
			}
			if (a.ship_Wood) {
				zz += '<TR><TD width=30px>' + ResourceImage(WoodImage, uW.g_js_strings.commonstr.wood) + '</td>';
				if (parseIntNan(a.keep_Wood) != 0 || parseIntNan(a.trade_Wood) == 0) { zz += '<TD width=175px>' + tx("Keep") + ':&nbsp;' + addCommas(a.keep_Wood) + '</td>'; }
				if (parseIntNan(a.trade_Wood) != 0) { zz += '<TD width=175px>' + tx("Trade") + ':&nbsp;' + addCommas(a.trade_Wood) + '</td>'; }
				zz += '</tr>';
			}
			if (a.ship_Stone) {
				zz += '<TR><TD width=30px>' + ResourceImage(StoneImage, uW.g_js_strings.commonstr.stone) + '</td>';
				if (parseIntNan(a.keep_Stone) != 0 || parseIntNan(a.trade_Stone) == 0) { zz += '<TD width=175px>' + tx("Keep") + ':&nbsp;' + addCommas(a.keep_Stone) + '</td>'; }
				if (parseIntNan(a.trade_Stone) != 0) { zz += '<TD width=175px>' + tx("Trade") + ':&nbsp;' + addCommas(a.trade_Stone) + '</td>'; }
				zz += '</tr>';
			}
			if (a.ship_Ore) {
				zz += '<TR><TD width=30px>' + ResourceImage(OreImage, uW.g_js_strings.commonstr.ore) + '</td>';
				if (parseIntNan(a.keep_Ore) != 0 || parseIntNan(a.trade_Ore) == 0) { zz += '<TD width=175px>' + tx("Keep") + ':&nbsp;' + addCommas(a.keep_Ore) + '</td>'; }
				if (parseIntNan(a.trade_Ore) != 0) { zz += '<TD width=175px>' + tx("Trade") + ':&nbsp;' + addCommas(a.trade_Ore) + '</td>'; }
				zz += '</tr>';
			}
			if (a.ship_Aether) {
				zz += '<TR><TD width=30px>' + ResourceImage(AetherImage, uW.g_js_strings.commonstr.aetherstone) + '</td>';
				if (parseIntNan(a.keep_Aether) != 0 || parseIntNan(a.trade_Aether) == 0) { zz += '<TD width=175px>' + tx("Keep") + ':&nbsp;' + addCommas(a.keep_Aether) + '</td>'; }
				if (parseIntNan(a.trade_Aether) != 0) { zz += '<TD width=175px>' + tx("Trade") + ':&nbsp;' + addCommas(a.trade_Aether) + '</td>'; }
				zz += '</tr>';
			}
			if (a.ship_Gold) {
				zz += '<TR><TD width=30px>' + ResourceImage(GoldImage, uW.g_js_strings.commonstr.gold) + '</td>';
				if (parseIntNan(a.keep_Gold) != 0 || parseIntNan(a.trade_Gold) == 0) { zz += '<TD width=175px>' + tx("Keep") + ':&nbsp;' + addCommas(a.keep_Gold) + '</td>'; }
				if (parseIntNan(a.trade_Gold) != 0) { zz += '<TD width=175px>' + tx("Trade") + ':&nbsp;' + addCommas(a.trade_Gold) + '</td>'; }
				zz += '</tr>';
			}
			zz += '</table><br>'

			z += '<TD class=xtabBRTop>' + zz + '</td>';
			z += '<TD style="width:90px" class=xtab align=center valign=top><INPUT id="pbtrRouteActive' + n + '" type=checkbox ' + (a.Active ? 'CHECKED' : '') + ' onclick="pbtrToggleActive(' + n + ')" /><div id="pbtrRouteStatus' + n + '"><span><br><br></span><//div></td>';
			z += '<TD style="width:100px" class=xtab align=right valign=top><a id="pbtrRouteEdit' + n + '" class="inlineButton btButton brown8" onclick="pbtrEditRoute(' + n + ')"><span>' + tx('Edit') + '</span></a>&nbsp;<a id="pbtrRouteDelete' + n + '" class="inlineButton btButton brown8" onclick="pbtrDeleteRoute(' + n + ')"><span>' + tx('Del') + '</span></a></a></td>';
			z += '</tr>';
		}

		if (!Routes) {
			z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No transport routes') + '</div></td></tr>';
		}

		z += '</table></div><br>';

		ById('pbtrRouteDetail').innerHTML = z;
		ById('pbtrbulkactions').innerHTML = tx("Bulk Action") + ":&nbsp;" + htmlSelector(BulkAction, 0, 'class=btInput id=pbtrbulkaction') + '&nbsp;' + htmlSelector(FromList, 0, 'class=btInput id=pbtrbulkfrom') + '&nbsp;<span id=pbtrbulknew class=divHide>To&nbsp;' + htmlSelector(CityList, 0, 'class=btInput id=pbtrbulkto') + '</span>&nbsp;' + strButton8(tx('Go'), 'id=pbtrbulkgo');

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		ById('pbtrbulkgo').addEventListener('click', function () { t.DoBulkAction(ById('pbtrbulkaction').value, ById('pbtrbulkfrom').value, ById('pbtrbulkto').value); }, false);
		ById('pbtrbulkaction').addEventListener('change', function (e) {
			if (e.target.value == 3 || e.target.value == 4) { jQuery('#pbtrbulknew').removeClass("divHide"); }
			else { jQuery('#pbtrbulknew').addClass("divHide"); }
		}, false);

		ById('pbtrClearRoutes').addEventListener('click', function () { t.ClearRoutes(); }, false);
		ById('pbtrNewRoute').addEventListener('click', function () { t.NewRoute(); }, false);
		t.updateRoutes();
	},

	DoBulkAction: function (Action, From, To) {
		var t = Tabs.Transport;
		ById('pbtrMessages').innerHTML = "&nbsp;";
		if (Action == 0 || From == 0) return;
		if ((Action == 3 || Action == 4) && To == 0) return;
		for (var i = Number(Options.TransportOptions.Routes.length - 1); i > -1; i--) {
			if (Action == 1 || Action == 3 || Action == 5 || Action == 7) {
				if ((Options.TransportOptions.Routes[i].cityId == From) || (From == -1 && !Cities.byID[Options.TransportOptions.Routes[i].cityId])) {
					if (Action == 1) { Options.TransportOptions.Routes.splice(i, 1); }
					else {
						if (Action == 3) { Options.TransportOptions.Routes[i].cityId = To; }
						else {
							if (Action == 5) { Options.TransportOptions.Routes[i].Active = false; }
							else {
								if (Action == 7) { Options.TransportOptions.Routes[i].Active = true; }
							}
						}
					}
				}
			}
			if (Action == 2 || Action == 4 || Action == 6 || Action == 8) {
				if (parseIntNan(Options.TransportOptions.Routes[i].target_cityId) != 0) {
					if ((Options.TransportOptions.Routes[i].target_cityId == From) || (From == -1 && !Cities.byID[Options.TransportOptions.Routes[i].target_cityId])) {
						if (Action == 2) { Options.TransportOptions.Routes.splice(i, 1); }
						else {
							if (Action == 4) {
								Options.TransportOptions.Routes[i].target_cityId = To;
								Options.TransportOptions.Routes[i].target_x = Cities.byID[To].x;
								Options.TransportOptions.Routes[i].target_y = Cities.byID[To].y;
							}
							else {
								if (Action == 6) { Options.TransportOptions.Routes[i].Active = false; }
								else {
									if (Action == 8) { Options.TransportOptions.Routes[i].Active = true; }
								}
							}
						}
					}
				}
			}
		}
		saveOptions();
		if (Action == 1 || Action == 2) { ById('pbtrMessages').innerHTML = tx("Transport routes deleted!"); }
		else {
			if (Action == 3 || Action == 4) { ById('pbtrMessages').innerHTML = tx("Transport routes relocated!"); }
		}
		t.PaintRoutes();
	},

	DeleteRoute: function (entry) {
		var t = Tabs.Transport;
		Options.TransportOptions.Routes.splice(entry, 1);
		saveOptions();
		ById('pbtrMessages').innerHTML = tx("Transport route deleted!");
		t.PaintRoutes();
	},

	ToggleActive: function (entry) {
		var t = Tabs.Transport;
		Options.TransportOptions.Routes[entry].Active = !Options.TransportOptions.Routes[entry].Active;
		saveOptions();
		t.updateRoutes();
	},

	SendRoute: function (entry) {
		var t = Tabs.Transport;
		Options.TransportOptions.Routes[entry].LastChecked = 0;
		saveOptions();
		t.updateRoutes();
	},

	EditRoute: function (entry) {
		var t = Tabs.Transport;
		t.EditRouteNumber = entry;
		t.EditMode = true;
		ById('pbtrMessages').innerHTML = "&nbsp;";

		t.RouteObject = {};
		for (var y in Options.TransportOptions.Routes[t.EditRouteNumber]) {
			t.RouteObject[y] = Options.TransportOptions.Routes[t.EditRouteNumber][y];
		}
		if (!t.RouteObject.OverrideTime) {
			t.RouteObject.Interval = Options.TransportOptions.TransportInterval;
		}
		t.PaintNewRoutePanel();
	},

	NewRoute: function () {
		var t = Tabs.Transport;
		t.EditRouteNumber = -1;
		t.EditMode = true;
		ById('pbtrMessages').innerHTML = "&nbsp;";

		if (!t.RouteObject) {
			t.RouteObject = {};
			for (var y in t.NewRouteObject) {
				t.RouteObject[y] = t.NewRouteObject[y];
			}
			t.RouteObject.Interval = Options.TransportOptions.TransportInterval;
			t.RouteObject.TroopType = Options.TransportOptions.LastTroopType;
		}
		t.PaintNewRoutePanel();
	},

	show: function () {
		var t = Tabs.Transport;
		t.PaintOverview();
		if (t.EditMode) { t.updateResources(); }
		else { t.updateRoutes(); }
	},

	EverySecond: function () {
		var t = Tabs.Transport;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter % 2 == 0) { // refresh transport march speed and overview display every 2 seconds
			t.marchspeed = Math.floor(equippedthronestats(67)) + Math.floor(equippedthronestats(70)) + Math.floor(equippedthronestats(163)); // march speed is transport and general march speed added together
			if (tabManager.currentTab.name == 'Transport' && Options.btWinIsOpen) {
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
		var t = Tabs.Transport;

		if (Options.TransportOptions.ThroneCheck && (t.marchspeed < Number(Options.TransportOptions.MarchSpeed))) {
			ts = '<span class=boldRed><b>' + t.marchspeed + '%</b></span>';
		}
		else { ts = t.marchspeed + '%'; }
		ById("bttrMarchCurrTR").innerHTML = ts;
	},

	PaintNewRoutePanel: function () {
		var t = Tabs.Transport;
		var fromidx = null;
		var toidx = null;

		if (t.EditRouteNumber < 0) {
			var z = '<div class=divHeader align=center>' + tx('NEW TRANSPORT ROUTE') + '</div><br>';
			fromidx = Cities.byID[uW.currentcityid].idx; // default new route from current city
		}
		else {
			var z = '<div class=divHeader align=center>' + tx('EDIT TRANSPORT ROUTE') + '</div><br>';
		}

		// remember last route details.... (or saved route details)

		if (Cities.byID[t.RouteObject.cityId]) {
			fromidx = Cities.byID[t.RouteObject.cityId].idx;
		}
		if (t.RouteObject.target_cityId != 0 && Cities.byID[t.RouteObject.target_cityId]) {
			toidx = Cities.byID[t.RouteObject.target_cityId].idx;
			t.RouteObject.target_x = Cities.byID[t.RouteObject.target_cityId].x;
			t.RouteObject.target_y = Cities.byID[t.RouteObject.target_cityId].y;
		}

		z += '<TABLE align=left class=xtab>';
		z += '<TR><TD align=right>&nbsp;' + tx("From City") + ':&nbsp;</td><TD><span id=pbtfromcity></span></td></tr>';
		z += '<TR><TD align=right>&nbsp;' + tx("To City") + ':&nbsp;</td><TD><span id=pbttocity></span></td>';
		z += '<TD>&nbsp;' + tx("or") + '&nbsp;&nbsp;&nbsp;X:&nbsp;<INPUT id=pbtcityX type=text size=3 value="' + t.RouteObject.target_x + '"\>&nbsp;Y:&nbsp;<INPUT id=pbtcityY type=text size=3 value="' + t.RouteObject.target_y + '"\>&nbsp;&nbsp;&nbsp;<a class=xlink id=pbtFetchBookmarks>' + tx('Select Bookmark') + ':</a></td><td><select id=pbtBookmarks class=btInput style="max-width:180px;"></select></td></tr>';
		z += '<TR><TD align=right>&nbsp;' + uW.g_js_strings.openCastle.trooptype + ':&nbsp;</td><TD><SELECT id="pbttroops">';
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			z += '<option value=' + i + '>' + uW.unitcost["unt" + i][0] + '</option>';
		}
		z += '</select></td><TD align=right>' + tx("Maximum March Size") + ':&nbsp;</td><TD id=pbtmaxtroops>&nbsp;</td></tr>';
		z += '<TR><TD align=right>&nbsp;' + tx("Troop Count") + ':&nbsp;</td><TD id=pbttotaltroops>&nbsp;</td><TD align=right>' + tx("Maximum Load") + ':&nbsp;</td><TD id=pbtmaxload>&nbsp;</td></tr>';
		z += '<TR><TD align=right>&nbsp;</td><TD><INPUT id=pbtoverrideintervalchk type=checkbox ' + (t.RouteObject.OverrideTime ? 'CHECKED' : '') + '>&nbsp;' + tx('Override transport interval') + '</td><TD align=right>' + tx("Transport Interval") + ':&nbsp;</td><TD><INPUT id=pbtoverrideinterval type=text size=2 value="' + t.RouteObject.Interval + '" ' + (t.RouteObject.OverrideTime ? '' : 'disabled') + ' \> ' + tx("minutes") + '</td></tr>';
		z += '</table><br>';

		z += '<TABLE width=98% align=center class=xtab cellspacing=0><TR><th class=xtabHD align=center>' + tx('Resource') + '</th><th class=xtabHD align=right>' + tx('Source') + '</th><th class=xtabHD align=right>' + tx('Destination') + '</th><th class=xtabHD align=center>' + tx('Send') + '</th><th class=xtabHD align=left>' + tx('Keep') + '</th><th class=xtabHD align=left>' + tx('Trade') + '</th><th class=xtabHD align=left>&nbsp;</th></tr>';
		z += '<TR>';
		z += '<TD align=center width=5%><img src="' + FoodImage + '" title="' + uW.g_js_strings.commonstr.food + '"></td>';
		z += '<TD id=pbtfromRec1 align=right width=110px></td>';
		z += '<TD id=pbttoRec1 align=right width=110px></td>';
		z += '<TD width=55px align=center><INPUT id=pbshipFood type=checkbox ' + (t.RouteObject.ship_Food ? 'CHECKED' : '') + ' \></td>';
		z += '<TD width=180px><INPUT id=pbtargetamountFood type=text size=11 maxlength=20 value="' + t.RouteObject.keep_Food + '" ' + (t.RouteObject.ship_Food ? '' : 'disabled') + ' \></td>';
		z += '<TD width=100px><INPUT id=pbtradeamountFood type=text size=11 maxlength=20 value="' + t.RouteObject.trade_Food + '" ' + (t.RouteObject.ship_Food ? '' : 'disabled') + ' \></td>';
		z += '<TD width=50px><INPUT id=pbMaxFood type=submit value="Max" ' + (t.RouteObject.ship_Food ? '' : 'disabled') + ' ></td></tr>';

		z += '<TR>';
		z += '<TD align=center width=5%><img src="' + WoodImage + '" title="' + uW.g_js_strings.commonstr.wood + '"></td>';
		z += '<TD id=pbtfromRec2 align=right width=110px></td>';
		z += '<TD id=pbttoRec2 align=right width=110px></td>';
		z += '<TD width=55px align=center><INPUT id=pbshipWood type=checkbox ' + (t.RouteObject.ship_Wood ? 'CHECKED' : '') + ' \></td>';
		z += '<TD width=180px><INPUT id=pbtargetamountWood type=text size=11 maxlength=20 value="' + t.RouteObject.keep_Wood + '" ' + (t.RouteObject.ship_Wood ? '' : 'disabled') + ' \></td>';
		z += '<TD width=100px><INPUT id=pbtradeamountWood type=text size=11 maxlength=20 value="' + t.RouteObject.trade_Wood + '" ' + (t.RouteObject.ship_Wood ? '' : 'disabled') + ' \></td>';
		z += '<TD width=50px><INPUT id=pbMaxWood type=submit value="Max" ' + (t.RouteObject.ship_Wood ? '' : 'disabled') + ' ></td></tr>';

		z += '<TR>';
		z += '<TD align=center width=5%><img src="' + StoneImage + '" title="' + uW.g_js_strings.commonstr.stone + '"></td>';
		z += '<TD id=pbtfromRec3 align=right width=110px></td>';
		z += '<TD id=pbttoRec3 align=right width=110px></td>';
		z += '<TD width=55px align=center><INPUT id=pbshipStone type=checkbox ' + (t.RouteObject.ship_Stone ? 'CHECKED' : '') + ' \></td>';
		z += '<TD width=180px><INPUT id=pbtargetamountStone type=text size=11 maxlength=20 value="' + t.RouteObject.keep_Stone + '" ' + (t.RouteObject.ship_Stone ? '' : 'disabled') + ' \></td>';
		z += '<TD width=100px><INPUT id=pbtradeamountStone type=text size=11 maxlength=20 value="' + t.RouteObject.trade_Stone + '" ' + (t.RouteObject.ship_Stone ? '' : 'disabled') + ' \></td>';
		z += '<TD width=50px><INPUT id=pbMaxStone type=submit value="Max" ' + (t.RouteObject.ship_Stone ? '' : 'disabled') + ' ></td></tr>';

		z += '<TR>';
		z += '<TD align=center width=5%><img src="' + OreImage + '" title="' + uW.g_js_strings.commonstr.ore + '"></td>';
		z += '<TD id=pbtfromRec4 align=right width=110px></td>';
		z += '<TD id=pbttoRec4 align=right width=110px></td>';
		z += '<TD width=55px align=center><INPUT id=pbshipOre type=checkbox ' + (t.RouteObject.ship_Ore ? 'CHECKED' : '') + ' \></td>';
		z += '<TD width=180px><INPUT id=pbtargetamountOre type=text size=11 maxlength=20 value="' + t.RouteObject.keep_Ore + '" ' + (t.RouteObject.ship_Ore ? '' : 'disabled') + ' \></td>';
		z += '<TD width=100px><INPUT id=pbtradeamountOre type=text size=11 maxlength=20 value="' + t.RouteObject.trade_Ore + '" ' + (t.RouteObject.ship_Ore ? '' : 'disabled') + ' \></td>';
		z += '<TD width=50px><INPUT id=pbMaxOre type=submit value="Max" ' + (t.RouteObject.ship_Ore ? '' : 'disabled') + ' ></td></tr>';

		z += '<TR>';
		z += '<TD align=center width=5%><img src="' + AetherImage + '" title="' + uW.g_js_strings.commonstr.aetherstone + '"></td>';
		z += '<TD id=pbtfromRec5 align=right width=110px></td>';
		z += '<TD id=pbttoRec5 align=right width=110px></td>';
		z += '<TD width=55px align=center><INPUT id=pbshipAether type=checkbox ' + (t.RouteObject.ship_Aether ? 'CHECKED' : '') + ' \></td>';
		z += '<TD width=180px><INPUT id=pbtargetamountAether type=text size=11 maxlength=20 value="' + t.RouteObject.keep_Aether + '" ' + (t.RouteObject.ship_Aether ? '' : 'disabled') + ' \></td>';
		z += '<TD width=100px><INPUT id=pbtradeamountAether type=text size=11 maxlength=20 value="' + t.RouteObject.trade_Aether + '" ' + (t.RouteObject.ship_Aether ? '' : 'disabled') + ' \></td>';
		z += '<TD width=50px><INPUT id=pbMaxAether type=submit value="Max" ' + (t.RouteObject.ship_Aether ? '' : 'disabled') + ' ></td></tr>';

		z += '<TR>';
		z += '<TD align=center width=5%><img src="' + GoldImage + '" title="' + uW.g_js_strings.commonstr.gold + '"></td>';
		z += '<TD id=pbtfromGold align=right width=110px></td>';
		z += '<TD id=pbttoGold align=right width=110px></td>';
		z += '<TD width=55px align=center><INPUT id=pbshipGold type=checkbox ' + (t.RouteObject.ship_Gold ? 'CHECKED' : '') + ' \></td>';
		z += '<TD width=180px><INPUT id=pbtargetamountGold type=text size=11 maxlength=20 value="' + t.RouteObject.keep_Gold + '" ' + (t.RouteObject.ship_Gold ? '' : 'disabled') + ' \></td>';
		z += '<TD width=100px><INPUT id=pbtradeamountGold type=text size=11 maxlength=20 value="' + t.RouteObject.trade_Gold + '" ' + (t.RouteObject.ship_Gold ? '' : 'disabled') + ' \></td>';
		z += '<TD width=50px><INPUT id=pbMaxGold type=submit value="Max" ' + (t.RouteObject.ship_Gold ? '' : 'disabled') + ' ></td></tr>';
		z += '</table><br>';

		z += '<div align="center"><TABLE cellSpacing=0 width=98% height=0% class=xtab><tr><td>&nbsp;</td><td align=center>' + strButton20(tx('Save Route'), 'id=pbtrSaveRoute') + '&nbsp;';
		if (t.EditRouteNumber >= 0) { z += strButton20(tx('Save a Copy'), 'id=pbtrCopyRoute') + '&nbsp;'; }
		z += strButton20(tx('Manual Transport'), 'id=pbtrManualTransport') + '&nbsp;' + strButton20(uW.g_js_strings.commonstr.cancel, 'id=pbtrCancelRoute') + '</td><td align=right>&nbsp;</td></tr></table></div>';

		ById('pbtrRouteDetail').innerHTML = z;

		ById('pbttroops').value = t.RouteObject.TroopType;
		t.dcp0 = new CdispCityPicker('pbttradefrom', ById('pbtfromcity'), true, t.updateResources, fromidx);
		t.dcp1 = new CdispCityPicker('pbttradeto', ById('pbttocity'), true, t.updateResources, toidx);
		t.dcp1.bindToXYboxes(ById('pbtcityX'), ById('pbtcityY'));

		ById('pbtFetchBookmarks').addEventListener('click', function () {
			FillBookmarkList('pbtBookmarks');
		}, false);

		ById('pbtBookmarks').addEventListener('change', function () {
			if (this.value != '') {
				var val = this.value;
				var x = val.substr(0, val.lastIndexOf(','));
				var y = val.substr(val.lastIndexOf(',') + 1, val.length);
				ById('pbtcityX').value = x;
				ById('pbtcityY').value = y;
			}
		}, false);

		ById('pbttroops').addEventListener('change', function () {
			t.updateResources();
		}, false);

		ById('pbtoverrideintervalchk').addEventListener('click', function () {
			var disablerow = (!ById('pbtoverrideintervalchk').checked);
			ById('pbtoverrideinterval').disabled = disablerow;
			if (disablerow) {
				ById('pbtoverrideinterval').value = Options.TransportOptions.TransportInterval;
			}
		}, false);

		ById('pbtargetamountFood').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtargetamountFood').value)) ById('pbtargetamountFood').value = 0;
		}, false);
		ById('pbtargetamountWood').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtargetamountWood').value)) ById('pbtargetamountWood').value = 0;
		}, false);
		ById('pbtargetamountStone').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtargetamountStone').value)) ById('pbtargetamountStone').value = 0;
		}, false);
		ById('pbtargetamountOre').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtargetamountOre').value)) ById('pbtargetamountOre').value = 0;
		}, false);
		ById('pbtargetamountAether').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtargetamountAether').value)) ById('pbtargetamountAether').value = 0;
		}, false);
		ById('pbtargetamountGold').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtargetamountGold').value)) ById('pbtargetamountGold').value = 0;
		}, false);
		ById('pbtradeamountFood').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtradeamountFood').value)) ById('pbtradeamountFood').value = 0;
		}, false);
		ById('pbtradeamountWood').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtradeamountWood').value)) ById('pbtradeamountWood').value = 0;
		}, false);
		ById('pbtradeamountStone').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtradeamountStone').value)) ById('pbtradeamountStone').value = 0;
		}, false);
		ById('pbtradeamountOre').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtradeamountOre').value)) ById('pbtradeamountOre').value = 0;
		}, false);
		ById('pbtradeamountAether').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtradeamountAether').value)) ById('pbtradeamountAether').value = 0;
		}, false);
		ById('pbtradeamountGold').addEventListener('change', function () {
			if (isNaNCommas(ById('pbtradeamountGold').value)) ById('pbtradeamountGold').value = 0;
		}, false);

		ById('pbshipFood').addEventListener('click', function () {
			var disablerow = (!ById('pbshipFood').checked);
			ById('pbtargetamountFood').disabled = disablerow;
			ById('pbtradeamountFood').disabled = disablerow;
			ById('pbMaxFood').disabled = disablerow;
			if (disablerow) {
				ById('pbtargetamountFood').value = 0;
				ById('pbtradeamountFood').value = 0;
			}
		}, false);
		ById('pbshipWood').addEventListener('click', function () {
			var disablerow = (!ById('pbshipWood').checked);
			ById('pbtargetamountWood').disabled = disablerow;
			ById('pbtradeamountWood').disabled = disablerow;
			ById('pbMaxWood').disabled = disablerow;
			if (disablerow) {
				ById('pbtargetamountWood').value = 0;
				ById('pbtradeamountWood').value = 0;
			}
		}, false);
		ById('pbshipStone').addEventListener('click', function () {
			var disablerow = (!ById('pbshipStone').checked);
			ById('pbtargetamountStone').disabled = disablerow;
			ById('pbtradeamountStone').disabled = disablerow;
			ById('pbMaxStone').disabled = disablerow;
			if (disablerow) {
				ById('pbtargetamountStone').value = 0;
				ById('pbtradeamountStone').value = 0;
			}
		}, false);
		ById('pbshipOre').addEventListener('click', function () {
			var disablerow = (!ById('pbshipOre').checked);
			ById('pbtargetamountOre').disabled = disablerow;
			ById('pbtradeamountOre').disabled = disablerow;
			ById('pbMaxOre').disabled = disablerow;
			if (disablerow) {
				ById('pbtargetamountOre').value = 0;
				ById('pbtradeamountOre').value = 0;
			}
		}, false);
		ById('pbshipAether').addEventListener('click', function () {
			var disablerow = (!ById('pbshipAether').checked);
			ById('pbtargetamountAether').disabled = disablerow;
			ById('pbtradeamountAether').disabled = disablerow;
			ById('pbMaxAether').disabled = disablerow;
			if (disablerow) {
				ById('pbtargetamountAether').value = 0;
				ById('pbtradeamountAether').value = 0;
			}
		}, false);
		ById('pbshipGold').addEventListener('click', function () {
			var disablerow = (!ById('pbshipGold').checked);
			ById('pbtargetamountGold').disabled = disablerow;
			ById('pbtradeamountGold').disabled = disablerow;
			ById('pbMaxGold').disabled = disablerow;
			if (disablerow) {
				ById('pbtargetamountGold').value = 0;
				ById('pbtradeamountGold').value = 0;
			}
		}, false);

		ById('pbMaxFood').addEventListener('click', function () {
			ById('pbtradeamountFood').value = t.CalcMaxResource('Food');
		}, false);
		ById('pbMaxWood').addEventListener('click', function () {
			ById('pbtradeamountWood').value = t.CalcMaxResource('Wood');
		}, false);
		ById('pbMaxStone').addEventListener('click', function () {
			ById('pbtradeamountStone').value = t.CalcMaxResource('Stone');
		}, false);
		ById('pbMaxOre').addEventListener('click', function () {
			ById('pbtradeamountOre').value = t.CalcMaxResource('Ore');
		}, false);
		ById('pbMaxAether').addEventListener('click', function () {
			ById('pbtradeamountAether').value = t.CalcMaxResource('Aether');
		}, false);
		ById('pbMaxGold').addEventListener('click', function () {
			ById('pbtradeamountGold').value = t.CalcMaxResource('Gold');
		}, false);

		ById('pbtrSaveRoute').addEventListener('click', function () { t.SaveRoute(false); }, false);
		if (ById('pbtrCopyRoute')) { ById('pbtrCopyRoute').addEventListener('click', function () { t.SaveRoute(true); }, false); }
		ById('pbtrCancelRoute').addEventListener('click', function () { t.RouteObject = null; t.PaintRoutes(); }, false);
		ById('pbtrManualTransport').addEventListener('click', function () { t.ManualTransport(); }, false);

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
		t.updateResources();
	},

	SaveRoute: function (CopyRoute) {
		var t = Tabs.Transport;

		if (!t.validateScreenFields('save')) { return; }

		Options.TransportOptions.LastTroopType = t.RouteObject.TroopType;
		saveOptions();

		if (t.EditRouteNumber < 0 || CopyRoute) {
			Options.TransportOptions.Routes.push(JSON2.parse(JSON2.stringify(t.RouteObject))); // create new object in array
			if (CopyRoute) { t.RouteObject = null; } // clear route object
		}
		else {
			t.RouteObject.LastChecked = 0;
			Options.TransportOptions.Routes[t.EditRouteNumber] = t.RouteObject;
			t.RouteObject = null; // clear route object
		}
		ById('pbtrMessages').innerHTML = tx("Transport route saved!");
		t.PaintRoutes();
	},

	validateScreenFields: function (action) {
		var t = Tabs.Transport;

		ById('pbtrMessages').innerHTML = "&nbsp;";

		if (!t.dcp0.city) {
			ById('pbtrMessages').innerHTML = tx("No source city selected");
			return false;
		}

		// copy screen fields to routeobject

		t.RouteObject.cityId = t.dcp0.city.id;
		var x = ById("pbtcityX").value;
		var y = ById("pbtcityY").value;
		if (x == "" || y == "" || isNaN(x) || isNaN(y) || x < 0 || x > 749 || y < 0 || y > 749) {
			ById('pbtrMessages').innerHTML = tx("Map co-ordinates must be between 0 and 749!");
			return false;
		}

		t.RouteObject.target_x = x;
		t.RouteObject.target_y = y;
		t.RouteObject.target_cityId = 0
		for (ii in Seed.cities) {
			if (Seed.cities[ii][2] == t.RouteObject.target_x && Seed.cities[ii][3] == t.RouteObject.target_y) { t.RouteObject.target_cityId = Seed.cities[ii][0]; }
		}
		t.RouteObject.TroopType = ById('pbttroops').value;
		t.RouteObject.ship_Gold = ById('pbshipGold').checked;
		t.RouteObject.ship_Food = ById('pbshipFood').checked;
		t.RouteObject.ship_Wood = ById('pbshipWood').checked;
		t.RouteObject.ship_Stone = ById('pbshipStone').checked;
		t.RouteObject.ship_Ore = ById('pbshipOre').checked;
		t.RouteObject.ship_Aether = ById('pbshipAether').checked;
		t.RouteObject.keep_Gold = ById('pbtargetamountGold').value;
		t.RouteObject.keep_Food = ById('pbtargetamountFood').value;
		t.RouteObject.keep_Wood = ById('pbtargetamountWood').value;
		t.RouteObject.keep_Stone = ById('pbtargetamountStone').value;
		t.RouteObject.keep_Ore = ById('pbtargetamountOre').value;
		t.RouteObject.keep_Aether = ById('pbtargetamountAether').value;
		t.RouteObject.trade_Gold = ById('pbtradeamountGold').value;
		t.RouteObject.trade_Food = ById('pbtradeamountFood').value;
		t.RouteObject.trade_Wood = ById('pbtradeamountWood').value;
		t.RouteObject.trade_Stone = ById('pbtradeamountStone').value;
		t.RouteObject.trade_Ore = ById('pbtradeamountOre').value;
		t.RouteObject.trade_Aether = ById('pbtradeamountAether').value;

		t.RouteObject.OverrideTime = ById('pbtoverrideintervalchk').checked;
		if (isNaN(ById('pbtoverrideinterval').value)) { t.RouteObject.Interval = 0; }
		else { t.RouteObject.Interval = ById('pbtoverrideinterval').value; }

		if (t.RouteObject.target_x == "" || t.RouteObject.target_y == "") {
			ById('pbtrMessages').innerHTML = tx("Destination coordinates invalid");
			return false;
		}
		if (t.dcp0.city.id == t.RouteObject.target_cityId) {
			ById('pbtrMessages').innerHTML = tx("Cannot transport to the same city!");
			return false;
		}
		if (parseIntNan(t.RouteObject.TroopType) == 0) {
			ById('pbtrMessages').innerHTML = tx("No troop type selected");
			return false;
		}
		if (!t.RouteObject.ship_Gold && !t.RouteObject.ship_Food && !t.RouteObject.ship_Wood && !t.RouteObject.ship_Stone && !t.RouteObject.ship_Ore && !t.RouteObject.ship_Aether) {
			ById('pbtrMessages').innerHTML = tx("You must transport something!");
			return false;
		}

		if (action == "send") {
			if (!t.RouteObject.trade_Gold && !t.RouteObject.trade_Food && !t.RouteObject.trade_Wood && !t.RouteObject.trade_Stone && !t.RouteObject.trade_Ore && !t.RouteObject.trade_Aether) {
				ById('pbtrMessages').innerHTML = tx("For manual transports you must enter the Trade values.");
				return false;
			}
		}

		// validation OK!
		return true;
	},

	updateResources: function () {
		var t = Tabs.Transport;
		if (!t.dcp0 || !t.dcp0.city) return;

		var ToCity = null;
		for (var i = 1; i <= 5; i++) {
			if (i == 5) { ById('pbtfromRec' + i).innerHTML = addCommas(parseInt(Seed.resources["city" + t.dcp0.city.id]['rec' + i][0])); }
			else { ById('pbtfromRec' + i).innerHTML = addCommas(parseInt(Seed.resources["city" + t.dcp0.city.id]['rec' + i][0] / 3600)); }
		}
		ById('pbtfromGold').innerHTML = addCommas(parseInt(Seed.citystats["city" + t.dcp0.city.id]['gold'][0]));
		for (ii in Seed.cities) {
			if (Seed.cities[ii][2] == ById('pbtcityX').value && Seed.cities[ii][3] == ById('pbtcityY').value) { ToCity = Seed.cities[ii][0]; }
		}
		for (var i = 1; i <= 5; i++) {
			if (ToCity) {
				if (i == 5) { ById('pbttoRec' + i).innerHTML = addCommas(parseInt(Seed.resources["city" + ToCity]['rec' + i][0])); }
				else { ById('pbttoRec' + i).innerHTML = addCommas(parseInt(Seed.resources["city" + ToCity]['rec' + i][0] / 3600)); }
			}
			else {
				ById('pbttoRec' + i).innerHTML = "----";
			}
		}
		if (ToCity) { ById('pbttoGold').innerHTML = addCommas(parseInt(Seed.citystats["city" + ToCity]['gold'][0])); }
		else { ById('pbttoGold').innerHTML = "----"; }

		// update troop and rally point information

		var Food = parseIntCommas(ById('pbtradeamountFood').value);
		var Wood = parseIntCommas(ById('pbtradeamountWood').value);
		var Stone = parseIntCommas(ById('pbtradeamountStone').value);
		var Ore = parseIntCommas(ById('pbtradeamountOre').value);
		var Gold = parseIntCommas(ById('pbtradeamountGold').value);
		var Aether = parseIntCommas(ById('pbtradeamountAether').value) * 5;

		var unit = ById('pbttroops').value;
		var Troops = parseInt(Seed.units['city' + t.dcp0.city.id]["unt" + unit]);
		var LoadUnit = t.getLoadUnit(unit, t.dcp0.city.id);
		var MaxMarchSize = March.RallyPoint(t.dcp0.city.id).maxSize;
		if (MaxMarchSize < Troops) { var GlobalMaxLoad = MaxMarchSize * LoadUnit; }
		else { var GlobalMaxLoad = Troops * LoadUnit; }
		if (GlobalMaxLoad > 0) GlobalMaxLoad = GlobalMaxLoad - 1; // avoid max load problems

		var LoadSelected = Food + Wood + Stone + Ore + Gold + Aether;
		var TroopsNeeded = Math.ceil(LoadSelected / LoadUnit);

		var troopcolor = Options.Colors.PanelText;
		if (TroopsNeeded >= Troops || Troops == 0) { troopcolor = '#f00'; }

		var marchcolor = Options.Colors.PanelText;
		if (TroopsNeeded >= MaxMarchSize) { marchcolor = '#f00'; }

		var loadcolor = Options.Colors.PanelText;
		if (GlobalMaxLoad < LoadSelected) { loadcolor = '#f00'; }

		ById('pbttotaltroops').innerHTML = '<FONT color=' + troopcolor + '>' + addCommas(Troops) + '</font>';
		ById('pbtmaxtroops').innerHTML = '<FONT color=' + marchcolor + '>' + addCommas(MaxMarchSize) + '</font>';
		ById('pbtmaxload').innerHTML = '<FONT color=' + loadcolor + '>' + addCommas(GlobalMaxLoad) + '</font>' + t.LoadSac;
	},

	getLoadUnit: function (unit, cityId) {
		var t = Tabs.Transport;

		var featherweight = parseInt(Seed.tech.tch10) * 0.1;
		var loadEffectBoost = 0;
		if (Seed.playerEffects.loadExpire > uW.unixtime()) { loadEffectBoost = 0.25; };
		var loadBoostBase = (Math.floor(CM.ThroneController.effectBonus(6)) * 0.01) + loadEffectBoost;
		if (CM.unitFrontendType[unit] == "siege") { loadBoostBase += (CM.ThroneController.effectBonus(59) * 0.01) };
		if (CM.unitFrontendType[unit] == "horsed") { loadBoostBase += (CM.ThroneController.effectBonus(48) * 0.01); };
		var Load = parseInt(uW.unitstats["unt" + unit]['5']);

		t.LoadSac = "";
		if (Seed.queue_sacr["city" + cityId]) {
			for (var sacIndex = 0; sacIndex < Seed.queue_sacr["city" + cityId].length; sacIndex++) {
				if (Seed.queue_sacr["city" + cityId][sacIndex]["unitType"] == unit) {
					Load *= Seed.queue_sacr["city" + cityId][sacIndex]["multiplier"][0];
					t.LoadSac = '<span style="color:#f00;">&nbsp;&nbsp;&nbsp;Ritual Boost ' + Math.round((Seed.queue_sacr["city" + cityId][sacIndex]["multiplier"][0] - 1) * 100) + '%</span>';
				}
			}
		}

		if (loadBoostBase > Number(uW.cm.thronestats.boosts.Load.Max) / 100) {
			loadBoostBase = Number(uW.cm.thronestats.boosts.Load.Max) / 100;
		};
		loadBoostBase += featherweight; //Should be done after throne room max check to get max boost?
		loadBoostBase += 1;

		return Math.floor(loadBoostBase * Load);
	},

	CalcMaxResource: function (restype) {
		var t = Tabs.Transport;
		if (!t.dcp0 || !t.dcp0.city) return;

		var Food = (restype == "Food") ? 0 : parseIntCommas(ById('pbtradeamountFood').value);
		var Wood = (restype == "Wood") ? 0 : parseIntCommas(ById('pbtradeamountWood').value);
		var Stone = (restype == "Stone") ? 0 : parseIntCommas(ById('pbtradeamountStone').value);
		var Ore = (restype == "Ore") ? 0 : parseIntCommas(ById('pbtradeamountOre').value);
		var Gold = (restype == "Gold") ? 0 : parseIntCommas(ById('pbtradeamountGold').value);
		var Aether = (restype == "Aether") ? 0 : parseIntCommas(ById('pbtradeamountAether').value) * 5;

		var unit = ById('pbttroops').value;
		var Troops = parseInt(Seed.units['city' + t.dcp0.city.id]["unt" + unit]);
		var LoadUnit = t.getLoadUnit(unit, t.dcp0.city.id);
		var MaxMarchSize = March.RallyPoint(t.dcp0.city.id).maxSize;
		if (MaxMarchSize < Troops) { var GlobalMaxLoad = MaxMarchSize * LoadUnit; }
		else { var GlobalMaxLoad = Troops * LoadUnit; }
		if (GlobalMaxLoad > 0) GlobalMaxLoad = GlobalMaxLoad - 1; // avoid max load problems

		var LoadSelected = Food + Wood + Stone + Ore + Gold + Aether;
		var Max = GlobalMaxLoad - LoadSelected;
		if (Max < 0) Max = 0;
		if (restype == "Aether") Max = Math.floor(Max / 5);
		// limit to source city values
		var citylimit = 0;
		if (restype == "Food") citylimit = parseIntNan(Seed.resources["city" + t.dcp0.city.id]['rec1'][0] / 3600);
		if (restype == "Wood") citylimit = parseIntNan(Seed.resources["city" + t.dcp0.city.id]['rec2'][0] / 3600);
		if (restype == "Stone") citylimit = parseIntNan(Seed.resources["city" + t.dcp0.city.id]['rec3'][0] / 3600);
		if (restype == "Ore") citylimit = parseIntNan(Seed.resources["city" + t.dcp0.city.id]['rec4'][0] / 3600);
		if (restype == "Gold") citylimit = parseIntNan(Seed.citystats["city" + t.dcp0.city.id]['gold'][0]);
		if (restype == "Aether") citylimit = parseIntNan(Seed.resources["city" + t.dcp0.city.id]['rec5'][0]);
		if (Max > citylimit) Max = citylimit;

		return Max;
	},

	updateRoutes: function () {
		var t = Tabs.Transport;

		if (!tabManager.currentTab || tabManager.currentTab.name != 'Transport' || !Options.btWinIsOpen) { return; }

		var n = Options.TransportOptions.Routes.length;
		while (n--) {
			var a = Options.TransportOptions.Routes[n];
			var elstat = ById('pbtrRouteStatus' + n);
			if (elstat) {
				elstat.innerHTML = '<span><br><br></span>';
				if (Options.TransportOptions.Running) {
					if (a.Active) {
						if (Options.TransportOptions.ThroneCheck && (t.marchspeed < Options.TransportOptions.MarchSpeed)) {
							elstat.innerHTML = '<span class=boldRed>March<br>Speed!<br></span>';
						}
						else {
							var now = unixTime();
							var interval = Options.TransportOptions.TransportInterval * 60;
							if (a.OverrideTime) { interval = a.Interval * 60; }
							var due = a.LastChecked + interval;
							if (due < now) {
								elstat.innerHTML = '<span class=boldGreen>' + tx('Checking') + '...<br><br></span>';
							}
							else {
								elstat.innerHTML = uW.timestr(due - now) + '<br><a class=xlink id="pbtrRouteCheck' + n + '" onclick="pbtrSendRoute(' + n + ')"><span>' + tx('Check Now') + '</span></a>';
							}
						}
					}
				}
			}
		}
	},

	doAutoLoop: function (idx, rev) {
		var t = Tabs.Transport;
		clearTimeout(t.timer);
		if (!Options.TransportOptions.Running) return;

		if (idx >= Options.TransportOptions.Routes.length) { idx = 0; } // safety, if route(s) have been deleted.
		if (idx == 0 && !rev) { t.loopaction = false; } // reset loop march indicator for first march
		t.autodelay = 0; // no delay if no action taken...

		if (idx < Options.TransportOptions.Routes.length) {
			var a = Options.TransportOptions.Routes[idx];

			if (a.Active) {
				var now = unixTime();
				var interval = Options.TransportOptions.TransportInterval * 60;
				if (a.OverrideTime) { interval = a.Interval * 60; }
				var due = a.LastChecked + interval;
				if ((due < now) || rev) {
					// check if march is required...
					t.doTrades(idx, rev);
					if (!rev) {
						Options.TransportOptions.Routes[idx]["LastChecked"] = uW.unixtime();
						saveOptions();
						t.updateRoutes();
						if (Options.TransportOptions.ReverseTransport) { // check for reverse transport on this route
							t.timer = setTimeout(function () { t.doAutoLoop(idx, true); }, (t.autodelay * 1000));
							return;
						}
					}
				}
			}
		}

		if (idx >= Options.TransportOptions.Routes.length - 1) {
			if (!t.loopaction) { t.autodelay = Options.TransportOptions.intervalSecs; } // if no action this loop, apply delay anyway...
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, (t.autodelay * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx + 1, false); }, (t.autodelay * 1000));
		}
	},

	doTrades: function (idx, rev) {
		var t = Tabs.Transport;
		var a = Options.TransportOptions.Routes[idx];

		if (Options.TransportOptions.ThroneCheck && (t.marchspeed < Options.TransportOptions.MarchSpeed)) { return; } // if not enough march speed

		if (!rev) {
			var sourcecityId = parseIntNan(a["cityId"]);
			var destcityId = a["target_cityId"];
			var xcoord = a["target_x"];
			var ycoord = a["target_y"];
		}
		else {
			if (a["rev_eta"] && parseInt(a["rev_eta"]) > uW.unixtime()) { return; } // only one reverse transport on each route at a time
			var sourcecityId = a["target_cityId"];
			var destcityId = parseIntNan(a["cityId"]);
			if (!Cities.byID[destcityId]) { return; } // no reverse transport city!
			var xcoord = Cities.byID[destcityId].x;
			var ycoord = Cities.byID[destcityId].y;
		}

		if (!Cities.byID[sourcecityId]) { return; } // no source city!

		var towerok = (!Options.TowerOptions || !Options.TowerOptions.SaveCityState[sourcecityId] || Options.TowerOptions.SaveCityState[sourcecityId].AllowMarches);
		if (!towerok) { return; } // source city under attack!

		var ascensionok = (!Options.BuildOptions || !Options.BuildOptions.AscensionReady[Cities.byID[sourcecityId].idx]);
		if (!ascensionok) { return; } // source city waiting to ascend!

		var targetname = xcoord + ',' + ycoord;
		if (destcityId && destcityId != 0) {
			if (!Cities.byID[destcityId]) return; // no destination city!
			targetname = Cities.byID[destcityId].name;
		}

		var ship_Food = a["ship_Food"];
		var ship_Wood = a["ship_Wood"];
		var ship_Stone = a["ship_Stone"];
		var ship_Ore = a["ship_Ore"];
		var ship_Aether = a["ship_Aether"];
		var ship_Gold = a["ship_Gold"];

		var trade_Food = parseIntNan(a["trade_Food"]);
		var trade_Wood = parseIntNan(a["trade_Wood"]);
		var trade_Stone = parseIntNan(a["trade_Stone"]);
		var trade_Ore = parseIntNan(a["trade_Ore"]);
		var trade_Aether = parseIntNan(a["trade_Aether"]);
		var trade_Gold = parseIntNan(a["trade_Gold"]);

		var TotalTrade = trade_Food + trade_Wood + trade_Stone + trade_Ore + (trade_Aether * 5) + trade_Gold;

		var target_Food = parseIntNan(a["keep_Food"]);
		var target_Wood = parseIntNan(a["keep_Wood"]);
		var target_Stone = parseIntNan(a["keep_Stone"]);
		var target_Ore = parseIntNan(a["keep_Ore"]);
		var target_Aether = parseIntNan(a["keep_Aether"]);
		var target_Gold = parseIntNan(a["keep_Gold"]);

		var minfactor = parseIntNan(Options.TransportOptions.ReverseTransportPercent) / 100;

		var min_Food = target_Food * minfactor;
		var min_Wood = target_Wood * minfactor;
		var min_Stone = target_Stone * minfactor;
		var min_Ore = target_Ore * minfactor;
		var min_Aether = target_Aether * minfactor;
		var min_Gold = target_Gold * minfactor;

		var citymax_Food = parseIntNan(Seed.resources["city" + sourcecityId]['rec1'][0] / 3600);
		var citymax_Wood = parseIntNan(Seed.resources["city" + sourcecityId]['rec2'][0] / 3600);
		var citymax_Stone = parseIntNan(Seed.resources["city" + sourcecityId]['rec3'][0] / 3600);
		var citymax_Ore = parseIntNan(Seed.resources["city" + sourcecityId]['rec4'][0] / 3600);
		var citymax_Aether = parseIntNan(Seed.resources["city" + sourcecityId]['rec5'][0]);
		var citymax_Gold = parseIntNan(Seed.citystats["city" + sourcecityId]['gold']);

		if (!rev) {
			var carry_Food = parseIntNan(citymax_Food - target_Food);
			var carry_Wood = parseIntNan(citymax_Wood - target_Wood);
			var carry_Stone = parseIntNan(citymax_Stone - target_Stone);
			var carry_Ore = parseIntNan(citymax_Ore - target_Ore);
			var carry_Aether = parseIntNan(citymax_Aether - target_Aether);
			var carry_Gold = 0;
		}
		else {
			var tgtcitymax_Food = parseIntNan(Seed.resources["city" + destcityId]['rec1'][0] / 3600);
			var tgtcitymax_Wood = parseIntNan(Seed.resources["city" + destcityId]['rec2'][0] / 3600);
			var tgtcitymax_Stone = parseIntNan(Seed.resources["city" + destcityId]['rec3'][0] / 3600);
			var tgtcitymax_Ore = parseIntNan(Seed.resources["city" + destcityId]['rec4'][0] / 3600);
			var tgtcitymax_Aether = parseIntNan(Seed.resources["city" + destcityId]['rec5'][0]);
			var tgtcitymax_Gold = parseIntNan(Seed.citystats["city" + destcityId]['gold']);

			var carry_Food = parseIntNan(min_Food - tgtcitymax_Food);
			var carry_Wood = parseIntNan(min_Wood - tgtcitymax_Wood);
			var carry_Stone = parseIntNan(min_Stone - tgtcitymax_Stone);
			var carry_Ore = parseIntNan(min_Ore - tgtcitymax_Ore);
			var carry_Aether = parseIntNan(min_Aether - tgtcitymax_Aether);
			var carry_Gold = 0;
		}

		if (carry_Food < 0 || !ship_Food) carry_Food = 0;
		if (carry_Wood < 0 || !ship_Wood) carry_Wood = 0;
		if (carry_Stone < 0 || !ship_Stone) carry_Stone = 0;
		if (carry_Ore < 0 || !ship_Ore) carry_Ore = 0;
		if (carry_Aether < 0 || !ship_Aether) carry_Aether = 0;

		if (!rev) {
			if (trade_Food > 0 && (carry_Food > trade_Food)) carry_Food = parseIntNan(trade_Food);
			if (trade_Wood > 0 && (carry_Wood > trade_Wood)) carry_Wood = parseIntNan(trade_Wood);
			if (trade_Stone > 0 && (carry_Stone > trade_Stone)) carry_Stone = parseIntNan(trade_Stone);
			if (trade_Ore > 0 && (carry_Ore > trade_Ore)) carry_Ore = parseIntNan(trade_Ore);
			if (trade_Aether > 0 && (carry_Aether > trade_Aether)) carry_Aether = parseIntNan(trade_Aether);
		}
		else { // reverse trans up to keep value (not min value)
			if (carry_Food > 0 && (target_Food > min_Food)) carry_Food = parseIntNan(target_Food - tgtcitymax_Food);
			if (carry_Wood > 0 && (target_Wood > min_Wood)) carry_Wood = parseIntNan(target_Wood - tgtcitymax_Wood);
			if (carry_Stone > 0 && (target_Stone > min_Stone)) carry_Stone = parseIntNan(target_Stone - tgtcitymax_Stone);
			if (carry_Ore > 0 && (target_Ore > min_Ore)) carry_Ore = parseIntNan(target_Ore - tgtcitymax_Ore);
			if (carry_Aether > 0 && (target_Aether > min_Aether)) carry_Aether = parseIntNan(target_Aether - tgtcitymax_Aether);

			// don't attempt to reverse transport more than you actually have available...
			if (carry_Food > citymax_Food) carry_Food = parseIntNan(citymax_Food);
			if (carry_Wood > citymax_Wood) carry_Wood = parseIntNan(citymax_Wood);
			if (carry_Stone > citymax_Stone) carry_Stone = parseIntNan(citymax_Stone);
			if (carry_Ore > citymax_Ore) carry_Ore = parseIntNan(citymax_Ore);
			if (carry_Aether > citymax_Aether) carry_Aether = parseIntNan(citymax_Aether);
		}
		carry_Aether *= 5; // Multiply by 5 to account for 5 times less carrying capacity

		var unit = 9;
		if (a['TroopType'] && a['TroopType'] != 0) { unit = a['TroopType']; }
		var Troops = parseInt(Seed.units['city' + sourcecityId]["unt" + unit]);
		if (Troops < Options.TransportOptions.MinWagons) { // insufficient troops!
			actionLog(Cities.byID[sourcecityId].name + ": Insufficient troops available for transport", 'TRANSPORT');
			return;
		}

		var LoadUnit = t.getLoadUnit(unit, sourcecityId);
		var MaxMarchSize = March.RallyPoint(sourcecityId).maxSize;
		var maxload = MaxMarchSize * LoadUnit;
		if (Troops < MaxMarchSize) { maxload = Troops * LoadUnit; }
		if (maxload > 0) maxload = maxload - 1; // avoid max load problems

		var slots = Number(March.getEmptySlots(sourcecityId));
		if (parseInt(slots) <= Number(Options.FreeRallySlots)) { // no free slots - don't bother server!
			if (GlobalOptions.ExtendedDebugMode) { actionLog(Cities.byID[sourcecityId].name + ": No available rally slots", 'TRANSPORT'); }
			return;
		}

		// apportion resources if too many to carry at once...

		var shift_Food = parseIntNan(maxload / 9); // Total of 9 portions
		var shift_Wood = parseIntNan(maxload / 9);
		var shift_Stone = parseIntNan(maxload / 9);
		var shift_Ore = parseIntNan(maxload / 9);
		var shift_Aether = parseIntNan(maxload / 9 * 5); // Aetherstone takes 5 of 9 portions - This gives us extra capacity if there's no aether

		if ((maxload - carry_Food - carry_Wood - carry_Stone - carry_Ore - carry_Aether) < 0) {
			var shift_spare = 0;

			// Check: See if load/9 is to big for some resources...

			if (carry_Food < shift_Food) {
				shift_spare += (shift_Food - carry_Food);
				shift_Food = carry_Food;
			}
			if (carry_Wood < shift_Wood) {
				shift_spare += (shift_Wood - carry_Wood);
				shift_Wood = carry_Wood;
			}
			if (carry_Stone < shift_Stone) {
				shift_spare += (shift_Stone - carry_Stone);
				shift_Stone = carry_Stone;
			}
			if (carry_Ore < shift_Ore) {
				shift_spare += (shift_Ore - carry_Ore);
				shift_Ore = carry_Ore;
			}
			if (carry_Aether < shift_Aether) {
				shift_spare += (shift_Aether - carry_Aether);
				shift_Aether = carry_Aether;
			}

			while (shift_spare > 1) {
				var PriorityList = Options.TransportOptions.Priority.split(",");
				for (var p in PriorityList) {
					var res = PriorityList[p];
					if (res == 1) { // food
						if (carry_Food < (shift_Food + shift_spare)) {
							shift_Food = carry_Food;
							shift_spare = shift_spare - carry_Food;
						}
						else {
							shift_Food = (shift_Food + shift_spare);
							shift_spare = 0;
						}
					}
					if (res == 2) { // wood
						if (carry_Wood < (shift_Wood + shift_spare)) {
							shift_Wood = carry_Wood;
							shift_spare = shift_spare - carry_Wood;
						} else {
							shift_Wood = shift_Wood + shift_spare;
							shift_spare = 0;
						}
					}
					if (res == 3) { // stone
						if (carry_Stone < (shift_Stone + shift_spare)) {
							shift_Stone = carry_Stone;
							shift_spare = shift_spare - carry_Stone;
						} else {
							shift_Stone = shift_Stone + shift_spare;
							shift_spare = 0;
						}
					}
					if (res == 4) { // ore
						if (carry_Ore < (shift_Ore + shift_spare)) {
							shift_Ore = carry_Ore;
							shift_spare = shift_spare - carry_Ore;
						} else {
							shift_Ore = shift_Ore + shift_spare;
							shift_spare = 0;
						}
					}
					if (res == 5) { // aether
						if (carry_Aether < (shift_Aether + shift_spare)) {
							shift_Aether = carry_Aether;
							shift_spare = shift_spare - carry_Aether;
						} else {
							shift_Aether = shift_Aether + shift_spare;
							shift_spare = 0;
						}
					}
				}
			}
			carry_Food = shift_Food;
			carry_Wood = shift_Wood;
			carry_Stone = shift_Stone;
			carry_Ore = shift_Ore;
			carry_Aether = shift_Aether;
		}

		// ship gold if any spare capacity left

		var spaceleft = maxload - (carry_Food + carry_Wood + carry_Stone + carry_Ore + carry_Aether);
		if ((spaceleft > 0) && ship_Gold) {
			if (!rev) {
				if (spaceleft > (citymax_Gold - target_Gold)) {
					carry_Gold = (citymax_Gold - target_Gold);
					if (carry_Gold < 0) carry_Gold = 0;
				}
				else {
					carry_Gold = spaceleft;
				}
				if (trade_Gold > 0 && (carry_Gold > trade_Gold)) carry_Gold = parseInt(trade_Gold);
			}
			else {
				carry_Gold = (min_Gold - tgtcitymax_Gold);
				if (carry_Gold < 0) carry_Gold = 0;
				if (carry_Gold > 0) {
					if (spaceleft > (target_Gold - tgtcitymax_Gold)) {
						carry_Gold = (target_Gold - tgtcitymax_Gold);
						if (carry_Gold < 0) carry_Gold = 0;
					}
					else {
						carry_Gold = spaceleft;
					}
				}
				if (carry_Gold > citymax_Gold) carry_Gold = parseIntNan(citymax_Gold);
			}
			if (Cities.byID[destcityId] && Options.TransportOptions.GoldCap) {
				var destcity_Gold = parseIntNan(Seed.citystats["city" + destcityId]['gold']);
				if (destcity_Gold + carry_Gold > t.Gold_Capacity) {
					carry_Gold = t.Gold_Capacity - destcity_Gold;
					if (carry_Gold < 0) { carry_Gold = 0; }
				}
			}
		}
		var totalres = carry_Food + carry_Wood + carry_Stone + carry_Ore + carry_Aether + carry_Gold;
		var wagons_needed = Math.ceil((totalres) / LoadUnit);
		var IgnoreMinCheck = (!rev && (TotalTrade == totalres)); // don't check min troops if transporting the set amount of resources user has asked to be transported
		if (wagons_needed < Options.TransportOptions.MinWagons && !IgnoreMinCheck) {
			if (GlobalOptions.ExtendedDebugMode && !rev) { actionLog(Cities.byID[sourcecityId].name + ": Small transport skipped : (" + wagons_needed + " for " + totalres + " load)", 'TRANSPORT'); }
			return;
		}
		if (wagons_needed > MaxMarchSize) { // don't bother server with this either, we can trust my calculations I hope!!
			if (GlobalOptions.ExtendedDebugMode) { actionLog(Cities.byID[sourcecityId].name + ": Maximum march size exceeded : (" + wagons_needed + "/" + MaxMarchSize + " for " + totalres + " load)", 'TRANSPORT'); }
			return;
		}

		if (totalres > 0) { // final safety net
			t.autodelay = Options.TransportOptions.intervalSecs; // march is required, so delay subsequent loop
			t.loopaction = true;

			var params = uW.Object.clone(uW.g_ajaxparams);
			params.cid = sourcecityId;
			params.kid = 0;
			params.type = 1;
			params.xcoord = xcoord;
			params.ycoord = ycoord;
			params.r1 = carry_Food;
			params.r2 = carry_Wood;
			params.r3 = carry_Stone;
			params.r4 = carry_Ore;
			params.r5 = parseInt(carry_Aether / 5);
			params.gold = carry_Gold;
			params["u" + unit] = wagons_needed;

			March.addMarch(params, function (rslt) {
				if (rslt.ok) {
					if (!rev) {
						actionLog(Cities.byID[sourcecityId].name + ": " + wagons_needed + " " + uW.unitcost["unt" + unit][0] + " transported goods to " + targetname, 'TRANSPORT');
					}
					else {
						actionLog(Cities.byID[sourcecityId].name + ": " + wagons_needed + " " + uW.unitcost["unt" + unit][0] + " reverse-transported goods back to " + targetname, 'TRANSPORT');
						Options.TransportOptions.Routes[idx]["rev_eta"] = parseInt(rslt.eta);
						saveOptions();
					}
				}
				else {
					if (!rslt.msg) { rslt.msg = tx('Error Code (') + rslt.error_code + ')'; }
					if (!rev) { actionLog(Cities.byID[sourcecityId].name + ": Transport Error - " + rslt.msg, 'TRANSPORT'); }
					else { actionLog(Cities.byID[sourcecityId].name + ": Reverse Transport Error - " + rslt.msg, 'TRANSPORT'); }
				}
			});
		}
	},

	ManualTransport: function () {
		var t = Tabs.Transport;

		if (!t.validateScreenFields('send')) { return; }

		ById('pbtrMessages').innerHTML = tx("Sending manual transport...");

		var a = t.RouteObject;

		var sourcecityId = parseIntNan(a["cityId"]);
		var xcoord = a["target_x"];
		var ycoord = a["target_y"];

		var carry_Food = parseIntNan(a["trade_Food"]);
		var carry_Wood = parseIntNan(a["trade_Wood"]);
		var carry_Stone = parseIntNan(a["trade_Stone"]);
		var carry_Ore = parseIntNan(a["trade_Ore"]);
		var carry_Aether = parseIntNan(a["trade_Aether"]);
		var carry_Gold = parseIntNan(a["trade_Gold"]);

		var totalres = carry_Food + carry_Wood + carry_Stone + carry_Ore + (carry_Aether * 5) + carry_Gold;

		var unit = 9;
		if (a['TroopType'] && a['TroopType'] != 0) { unit = a['TroopType']; }
		var Troops = parseInt(Seed.units['city' + sourcecityId]["unt" + unit]);
		if (Troops <= 0) { Troops = 0; }
		var LoadUnit = t.getLoadUnit(unit, sourcecityId);
		var MaxMarchSize = March.RallyPoint(sourcecityId).maxSize;
		var maxload = MaxMarchSize * LoadUnit;
		if (Troops < MaxMarchSize) { maxload = Troops * LoadUnit; }
		if (maxload > 0) maxload = maxload - 1; // avoid max load problems

		if (totalres > maxload) {
			ById('pbtrMessages').innerHTML = tx("Too much to carry!");
			return;
		}

		var slots = Number(March.getEmptySlots(sourcecityId));
		if (parseInt(slots) <= 0) { // no free slots - don't bother server!
			ById('pbtrMessages').innerHTML = tx("No free rally point slots");
			return;
		}

		var wagons_needed = Math.ceil((totalres) / LoadUnit);
		if (wagons_needed > MaxMarchSize) { // don't bother server with this either, we can trust my calculations I hope!!
			ById('pbtrMessages').innerHTML = tx("Maximum march size exceeded") + " : (" + wagons_needed + "/" + MaxMarchSize + " " + tx('for') + " " + totalres + " " + tx('load') + ")";
			return;
		}

		if (totalres > 0) { // final safety net
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.cid = sourcecityId;
			params.kid = 0;
			params.type = 1;
			params.xcoord = xcoord;
			params.ycoord = ycoord;
			params.r1 = carry_Food;
			params.r2 = carry_Wood;
			params.r3 = carry_Stone;
			params.r4 = carry_Ore;
			params.r5 = carry_Aether;
			params.gold = carry_Gold;
			params["u" + unit] = wagons_needed;

			March.addMarch(params, function (rslt) {
				if (rslt.ok) {
					ById('pbtrMessages').innerHTML = tx("Manual transport successful!");
				}
				else {
					if (!rslt.msg) { rslt.msg = tx('Error Code (') + rslt.error_code + ')'; }
					ById('pbtrMessages').innerHTML = rslt.msg;
				}
			});
		}
	},
}
