/** Attack Tab **/

Tabs.Attack = {
	tabOrder: 2050,
	tabLabel: 'Attack',
	tabColor: 'brown',
	myDiv: null,
	dcp0: null,
	timer: null,
	autodelay: 0,
	loopaction: false,
	mercmode: 0,
	mercmatch: {},
	searchval: '',
	LoopCounter: 0,
	EditRouteNumber: -1,
	EditMode: false,
	CrestList: [1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115],
	AttackOrder: [], // for randomising attack order
	Options: {
		Running: false,
		Toggle: false,
		intervalSecs: 5,
		Randomize: false,
		Routes: [],
		AttackReport: false,
		AttackReportInterval: 1,
		LastAttackReport: 0,
		MercRunning: false,
		MercItem: '31228',
		MercTarget: '',
		Wave1Count: 0,
		Wave2Count: 0,
		FreeRallySlots: 2,
	},
	NewRouteObject: {
		cityId: null,
		target_x: '',
		target_y: '',
		isWild: false,
		isMegalith: false,
		ChampOnly: false,
		RoundOne: false,
		RoundOneTroops: {},
		LastRoundOne: 0,
		RoundTwo: true,
		RoundTwoTroops: {},
		LastRoundTwo: 0,
		Active: true,
	},
	RouteObject: null,

	init: function (div) {
		var t = Tabs.Attack;
		t.myDiv = div;

		if (!Options.AttackOptions) {
			Options.AttackOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.AttackOptions.hasOwnProperty(y)) {
					Options.AttackOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('pbatDeleteRoute', Tabs.Attack.DeleteRoute);
		uWExportFunction('pbatEditRoute', Tabs.Attack.EditRoute);
		uWExportFunction('pbatToggleActive', Tabs.Attack.ToggleActive);

		if (Options.AttackOptions.Toggle) AddSubTabLink('Attack', t.toggleAutoAttackState, 'AttackToggleTab');
		SetToggleButtonState('Attack', Options.AttackOptions.Running, 'Attack');

		var m = '<DIV class=divHeader align=center>' + tx('AUTOMATED ATTACKS') + '</div>';
		m += '<div align="center">';

		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btAttackToggle type=checkbox ' + (Options.AttackOptions.Toggle ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Add toggle button to main screen header") + '</td><td colspan=2 align=center><INPUT id=btAutoAttackState type=submit value="' + tx("Attack") + ' = ' + (Options.AttackOptions.Running ? 'ON' : 'OFF') + '"></td><td width=30% align=right>&nbsp;</td></tr></table>';
		m += '<table width=100% class=xtab><tr><td align=left><INPUT id=pbattackrandom type=checkbox ' + (Options.AttackOptions.Randomize ? 'CHECKED ' : '') + '/></td><td>' + tx("Randomize attack order") + '</td><td align=right>&nbsp;' + tx("Attack Interval:") + '&nbsp;<INPUT id=pbattackinterval type=text size=2 value="' + Options.AttackOptions.intervalSecs + '"\> ' + tx("seconds") + '</td></tr>';
		m += '<tr><td align=left><INPUT id=pbattackreport type=checkbox ' + (Options.AttackOptions.AttackReport ? ' CHECKED' : '') + '\></td><td align=left>' + tx("Send attack report every") + '&nbsp;<INPUT id=pbattackreportinterval value=' + Options.AttackOptions.AttackReportInterval + ' type=text size=3 \>&nbsp;' + tx('hours') + '&nbsp;&nbsp;&nbsp;' + strButton8(tx('Send Now'), 'id=pbattackreportsend') + '</td>';
		m += '<td align=right>' + tx("Keep") + ' <INPUT id=btatfreerallyslots type=text size=2 maxlength=2 value="' + Options.AttackOptions.FreeRallySlots + '"\> ' + tx("free rally point slots") + '</td></tr>';
		m += '<tr><td colspan=3 align=left><b>' + tx('Mercenary Camp Prize Target') + '</b></td></tr>';
		m += '<tr><td colspan=3 align=left id=pbatmercdiv></td></tr>';
		m += '</table>';
		m += '<div id=pbatMessages align=center>&nbsp;</div>';
		m += '<div id=pbatRouteDetail>&nbsp;</div><br>';

		div.innerHTML = m;
		t.PaintMercDiv();

		ToggleOption('AttackOptions', 'btAttackToggle', 'Toggle');

		ById('btAutoAttackState').addEventListener('click', function () {
			t.toggleAutoAttackState(this);
		}, false);

		ById('pbattackinterval').addEventListener('keyup', function () {
			if (parseIntNan(ById('pbattackinterval').value) < 1) { ById('pbattackinterval').value = 6; }
			if (parseIntNan(ById('pbattackinterval').value) < 2) { ById('pbattackinterval').value = 2; }
			Options.AttackOptions.intervalSecs = parseIntNan(ById('pbattackinterval').value);
			saveOptions();
		}, false);

		ById('pbattackreportsend').addEventListener('click', function () {
			Options.AttackOptions.LastAttackReport = 0;
			saveOptions();
			t.sendAttackReport(true);
		}, false);
		ChangeIntegerOption('AttackOptions', 'pbattackreportinterval', 'AttackReportInterval', 1, t.sendAttackReport);
		ChangeIntegerOption('AttackOptions', 'btatfreerallyslots', 'FreeRallySlots');

		ToggleOption('AttackOptions', 'pbattackrandom', 'Randomize');
		ToggleOption('AttackOptions', 'pbattackreport', 'AttackReport', t.sendAttackReport);

		t.PaintRoutes();
		t.sendAttackReport(); // check every refresh

		// start autoattack loop timer to start in 8 seconds...

		if (Options.AttackOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, (8 * 1000));
		}
	},

	PaintMercDiv: function () {
		var t = Tabs.Attack;
		var m = '<table class=xtab cellpadding=0 cellspacing=0 width=100%><tr><td>';
		if (t.mercmode == 0) {
			var itemname = '<span class=boldRed>' + tx('Unknown Item') + '!</span>';
			if (uW.itemlist["i" + Options.AttackOptions.MercItem]) {
				itemname = uW.itemlist["i" + Options.AttackOptions.MercItem].name;
			}
			m += '<a class=xlink id=pbmercsearch title="' + tx('Click to search by item name') + '">' + tx('Chest ID') + ':</a>&nbsp;<INPUT id=pbmercitem type=text size=5 maxlength=8 value="' + Options.AttackOptions.MercItem + '">&nbsp;&nbsp;&nbsp;' + itemname + '</td>';
		}
		if (t.mercmode == 1) {
			m += tx('Chest Name') + ':&nbsp;<INPUT id=pbmercsearchname type=text style="width:180px;" maxlength=20 value="' + t.searchval + '">&nbsp;' + strButton8('Search', 'id=pbmercsearchbutton') + '&nbsp;' + strButton8(uW.g_js_strings.commonstr.cancel, 'id=pbmercsearchcancel') + '</td>';
		}
		if (t.mercmode == 2) {
			m += tx('Chest Name') + ':&nbsp;' + htmlSelector(t.mercmatch, 0, 'id=pbmercselectlist style="width:180px;"') + '&nbsp;' + strButton8(uW.g_js_strings.commonstr.cancel, 'id=pbmercsearchcancel') + '</td>';
		}
		m += '<td align=right>' + uW.g_js_strings.commonstr.target + ':&nbsp;<INPUT id=pbmerctarget type=text size=3 \>&nbsp;&nbsp;' + tx('Current') + ':&nbsp;<span id=pbcurrmerc></span>&nbsp;&nbsp;<a title="' + tx('automatically use excess items') + '" id=pbautomercstate class="inlineButton btButton ' + (Options.AttackOptions.MercRunning ? 'red14' : 'blue14') + '"><span id=pbautomerclabel style="width:30px;display:inline-block;text-align:center;">' + (Options.AttackOptions.MercRunning ? tx('Off') : tx('Auto')) + '</span></a></td></tr></table>';
		ById('pbatmercdiv').innerHTML = m;
		t.UpdateMercTarget();

		ById('pbautomercstate').addEventListener('click', function () {
			t.toggleAutoMercState(this);
		}, false);

		ChangeIntegerOption('AttackOptions', 'pbmerctarget', 'MercTarget', 0, t.UpdateMercTarget);

		if (t.mercmode == 0) {
			ById("pbmercitem").addEventListener('change', function (e) {
				Options.AttackOptions.MercItem = parseIntNan(e.target.value);
				if (Options.AttackOptions.MercRunning) { t.toggleAutoMercState(); }
				saveOptions();
				t.UpdateMercTarget();
				t.PaintMercDiv();
			}, false);
			ById("pbmercsearch").addEventListener('click', function () {
				t.mercmode = 1;
				t.PaintMercDiv();
			}, false);
		}
		if (t.mercmode == 1) {
			ById("pbmercsearchcancel").addEventListener('click', function () {
				ById('pbatMessages').innerHTML = "&nbsp;";
				t.mercmode = 0;
				t.PaintMercDiv();
			}, false);
			ById("pbmercsearchbutton").addEventListener('click', function () {
				t.mercmode = 0;
				t.searchval = ById('pbmercsearchname').value.toUpperCase();
				if (t.searchval.length < 3) {
					ById('pbatMessages').innerHTML = uW.g_js_strings.getAllianceSearchResults.entryatleast3;
					return;
				}
				ById('pbatMessages').innerHTML = tx("Searching...");
				t.MercItemSearch(t.searchval);
			}, false);
		}
		if (t.mercmode == 2) {
			ById("pbmercsearchcancel").addEventListener('click', function () {
				ById('pbatMessages').innerHTML = "&nbsp;";
				t.mercmode = 1;
				t.PaintMercDiv();
			}, false);
			ById("pbmercselectlist").addEventListener('change', function (e) {
				ById('pbatMessages').innerHTML = "&nbsp;";
				Options.AttackOptions.MercItem = e.target.value;
				if (Options.AttackOptions.MercRunning) { t.toggleAutoMercState(); }
				saveOptions();
				t.mercmode = 0;
				t.PaintMercDiv();
			}, false);
		}
	},

	MercItemSearch: function (searchval) {
		var t = Tabs.Attack;
		t.mercmatch = {};
		t.mercmatch[0] = "-- " + tx('Select Item') + " --";
		for (var i in uW.itemlist) {
			var item = uW.itemlist[i];
			var id = i.split('i')[1];
			if (item.name.toUpperCase().indexOf(searchval) != -1) {
				t.mercmatch[id] = item.name + ' (' + id + ')';
			}
		}
		var nummatches = Object.keys(t.mercmatch).length;
		if (nummatches == 1) {
			ById('pbatMessages').innerHTML = tx("No matching items found");
			return;
		}
		if (nummatches == 2) {
			ById('pbatMessages').innerHTML = "&nbsp;";
			Options.AttackOptions.MercItem = Object.keys(t.mercmatch)[1];
			if (Options.AttackOptions.MercRunning) { t.toggleAutoMercState(); }
			saveOptions();
			t.mercmode = 0;
			t.PaintMercDiv();
		}
		else {
			ById('pbatMessages').innerHTML = tx("Please select an item");
			t.mercmode = 2;
			t.PaintMercDiv();
		}
	},

	UpdateMercTarget: function () {
		var t = Tabs.Attack;
		ById("pbcurrmerc").innerHTML = parseIntNan(Seed.items["i" + Options.AttackOptions.MercItem]);
		if (parseIntNan(Seed.items["i" + Options.AttackOptions.MercItem]) >= parseIntNan(Options.AttackOptions.MercTarget)) {
			jQuery('#pbcurrmerc').css('color', 'green');
		}
		else {
			jQuery('#pbcurrmerc').css('color', 'black');
		}
	},

	checkMercItemLimit: function () {
		var t = Tabs.Attack;
		if (!Options.AttackOptions.MercRunning) return;
		if (isNaN(Options.AttackOptions.MercItem) || Options.AttackOptions.MercItem == 0) return;
		if (isNaN(Options.AttackOptions.MercTarget) || Options.AttackOptions.MercTarget == 0) return;
		var item = uW.ksoItems[Options.AttackOptions.MercItem];
		if (item) {
			var useamount = parseIntNan(item.count - parseIntNan(Options.AttackOptions.MercTarget));
			if (useamount > 0) { // automatically use items to bring amount down...
				if (!item.usable) { // can't use so log it!
					actionLog('Unable to use Mercenary Prize Chest Item', 'ATTACK');
				}
				else {
					actionLog('Attempting to use ' + useamount + ' ' + item.name, 'ATTACK');
					if (uW.itemlist['i' + Options.AttackOptions.MercItem] && uW.itemlist['i' + Options.AttackOptions.MercItem].subCategory == 100) {
						t.useMysteryChest(Options.AttackOptions.MercItem, useamount);
					}
					else {
						ItemMultiUseController.UseItems(Options.AttackOptions.MercItem, useamount);
					}
				}
			}
		}
		var now = unixTime();
		Options.AttackOptions.LastMercChecked = now;
		saveOptions();
	},

	useMysteryChest: function (itemId, quantity) {
		var t = Tabs.Attack;

		function addItemsToSeed(items) {
			jQuery.each(items, function (key, value) {
				if (Seed.items["i" + key]) {
					Seed.items["i" + key] = (parseInt(Seed.items["i" + key]) + parseInt(value)).toString();
					uW.ksoItems[key].add(Number(value))
				} else {
					Seed.items["i" + key] = value.toString();
					uW.ksoItems[key].add(Number(value))
				}
			})
		}

		params = uW.Object.clone(uW.g_ajaxparams);
		params.chestId = itemId;
		params.cid = uW.currentcityid;
		params.quantity = quantity;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/useMysteryChest.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					CM.InventoryView.removeItemFromInventory(itemId, params.quantity);
					addItemsToSeed(rslt.items);
				}
			},
		}, true);
	},

	toggleAutoAttackState: function (obj) {
		var t = Tabs.Attack;
		obj = ById('btAutoAttackState');
		if (Options.AttackOptions.Running == true) {
			Options.AttackOptions.Running = false;
			obj.value = tx("Attack = OFF");
			clearTimeout(t.timer);
		}
		else {
			Options.AttackOptions.Running = true;
			obj.value = tx("Attack = ON");
			// clear the last round one field on all routes
			var n = Options.AttackOptions.Routes.length;
			while (n--) {
				Options.AttackOptions.Routes[n].LastRoundOne = 0;
			}
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, 0);
			t.sendAttackReport(); // check
		}
		saveOptions();
		SetToggleButtonState('Attack', Options.AttackOptions.Running, 'Attack');
	},

	toggleAutoMercState: function (obj) {
		var t = Tabs.Attack;
		obj = ById('pbautomerclabel');
		if (Options.AttackOptions.MercRunning == true) {
			Options.AttackOptions.MercRunning = false;
			obj.innerHTML = tx("Auto");
			jQuery('#pbautomercstate').removeClass("red14");
			jQuery('#pbautomercstate').addClass("blue14");
		}
		else {
			Options.AttackOptions.MercRunning = true;
			obj.innerHTML = tx("Off");
			jQuery('#pbautomercstate').addClass("red14");
			jQuery('#pbautomercstate').removeClass("blue14");
			Options.AttackOptions.LastMercChecked = 0;
		}
		saveOptions();
	},

	ClearRoutes: function () {
		var t = Tabs.Attack;
		Options.AttackOptions.Routes = [];
		saveOptions();
		ById('pbatMessages').innerHTML = tx("All attack routes deleted!");
		t.PaintRoutes();
	},

	PaintRoutes: function () {
		var t = Tabs.Attack;

		t.EditMode = false;
		var z = '';
		var r = 0;

		var Routes = false;

		var z = '<div class=divHeader align=center>' + tx('ATTACK ROUTES') + '</div><br>';
		z += '<div align="center"><TABLE cellSpacing=0 width=98% height=0% class=xtab><tr><td width=90px>' + strButton20(tx('New Route'), 'id=pbatNewRoute') + '</td>';
		z += '<td align=left id=pbatbulkactions>&nbsp;</td>';
		z += '<td align=right>' + strButton20(tx('Delete ALL Routes'), 'id=pbatClearRoutes') + '&nbsp;</td></tr></table>';
		z += '<div style="max-height:535px;overflow-y:scroll;width:' + GlobalOptions.btWinSize.x + 'px;overflow-x:auto" align="center"><TABLE id=pbatRoutesTable cellSpacing=0 width=100% height=0%><tr><td class="xtabHD" style="width:100px"><b>' + tx('City') + '</b></td><td style="width:100px" class="xtabHD"><b>' + uW.g_js_strings.commonstr.target + '</b></td><td style="width:100px" class="xtabHD"><b>' + uW.g_js_strings.commonstr.options + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b><td class="xtabHD" align="center" style="width:90px"><b>' + tx('Active') + '</b></td><td class="xtabHD" align="right" style="width: 115px"><span id=pbatnumroutes>' + Options.AttackOptions.Routes.length + '</span> ' + tx('Routes') + '</td></tr>';

		var FromList = { 0: "-- " + tx('Select City') + " --" };
		var BulkAction = { 0: "-- " + tx('Select Action') + " --", 1: tx("Delete ALL Attacks From"), 2: tx("Transfer ALL Attacks From"), 3: tx("Disable ALL Attacks From"), 4: tx("Enable ALL Attacks From") };
		var CityList = { 0: "-- " + tx('Select City') + " --" };
		for (g in Cities.byID) { CityList[Cities.byID[g].id] = Cities.byID[g].name; }

		var n = Options.AttackOptions.Routes.length;
		while (n--) {
			var a = Options.AttackOptions.Routes[n];
			var fromname = '<span class=boldRed>' + tx('No City') + '!</span>';
			var fid = -1;
			if (Cities.byID[a.cityId]) { fromname = Cities.byID[a.cityId].name; fid = a.cityId; }
			FromList[fid] = fromname;
			var toname = coordLink(a.target_x, a.target_y);

			Routes = true;
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="' + rowClass + '">';
			z += '<TD style="width:100px" class=xtab valign=top>' + fromname + '</td>';
			z += '<TD style="width:100px" class=xtab valign=top>' + toname + '</td>';
			var RouteOpts = '';
			if (a.isWild) RouteOpts += tx('Is Wild') + '<BR>';
			if (a.isMegalith) RouteOpts += tx('Is Megalith') + '<BR>';
			if (a.ChampOnly) RouteOpts += tx('Champ Only');
			z += '<TD style="width:100px;" class=xtab valign=top>' + RouteOpts + '</td>';

			var zz = '<table cellpadding=0 cellspacing=0 class=xtab><tr valign=top>';

			var LineBreak = 4;
			if (GlobalOptions.btWinSize.x == 750) { LineBreak = 2; }
			if (GlobalOptions.btWinSize.x == 1250) { LineBreak = 5; }

			if (a.RoundOne) {
				zz += '<td width=60px style="padding-top:5px;"><b>' + tx('Wave') + ' 1:&nbsp;</b></td><td><table cellpadding=0 cellspacing=1 class=xtab><tr>';
				var c = 0;
				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					if (a.RoundOneTroops[i]) {
						var nn = '<TD width=30px>' + TroopImage(i) + '</td>';
						nn += '<TD width=150px>' + addCommas(parseIntNan(a.RoundOneTroops[i])) + '</td>';
						if (c % LineBreak == 0) zz += '</tr><tr>';
						zz += nn;
						c++;
					}
				}
				zz += '</tr></table></td></tr><tr valign=top>';
			}

			if (a.RoundTwo) {
				zz += '<td width=60px style="padding-top:5px;"><b>' + tx('Wave') + ' 2:&nbsp;</b></td><td><table cellpadding=0 cellspacing=1 class=xtab><tr>';
				var c = 0;
				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					if (a.RoundTwoTroops[i]) {
						var nn = '<TD width=30px>' + TroopImage(i) + '</td>';
						nn += '<TD width=150px>' + addCommas(parseIntNan(a.RoundTwoTroops[i])) + '</td>';
						if (c % LineBreak == 0) zz += '</tr><tr>';
						zz += nn;
						c++;
					}
				}
				zz += '</tr></table></td>';
			}
			zz += '</tr></table><br>'

			z += '<TD class=xtabBRTop>' + zz + '</td>';
			z += '<TD style="width:90px" class=xtab align=center valign=top><INPUT id="pbatRouteActive' + n + '" type=checkbox ' + (a.Active ? 'CHECKED' : '') + ' onclick="pbatToggleActive(' + n + ')" /></td>';
			z += '<TD style="width:100px" class=xtab align=right valign=top><a id="pbatRouteEdit' + n + '" class="inlineButton btButton brown8" onclick="pbatEditRoute(' + n + ')"><span>' + tx('Edit') + '</span></a>&nbsp;<a id="pbatRouteDelete' + n + '" class="inlineButton btButton brown8" onclick="pbatDeleteRoute(' + n + ')"><span>' + tx('Del') + '</span></a></a></td>';
			z += '</tr>';
		}

		if (!Routes) {
			z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No attack routes') + '</div></td></tr>';
		}

		z += '</table></div><br>';

		ById('pbatRouteDetail').innerHTML = z;
		ById('pbatbulkactions').innerHTML = tx("Bulk Action") + ":&nbsp;" + htmlSelector(BulkAction, 0, 'class=btInput id=pbatbulkaction') + '&nbsp;' + htmlSelector(FromList, 0, 'class=btInput id=pbatbulkfrom') + '&nbsp;<span id=pbatbulknew class=divHide>To&nbsp;' + htmlSelector(CityList, 0, 'class=btInput id=pbatbulkto') + '</span>&nbsp;' + strButton8(tx('Go'), 'id=pbatbulkgo');

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		ById('pbatbulkgo').addEventListener('click', function () { t.DoBulkAction(ById('pbatbulkaction').value, ById('pbatbulkfrom').value, ById('pbatbulkto').value); }, false);
		ById('pbatbulkaction').addEventListener('change', function (e) {
			if (e.target.value == 2) { jQuery('#pbatbulknew').removeClass("divHide"); }
			else { jQuery('#pbatbulknew').addClass("divHide"); }
		}, false);

		ById('pbatClearRoutes').addEventListener('click', function () { t.ClearRoutes(); }, false);
		ById('pbatNewRoute').addEventListener('click', function () { t.NewRoute(); }, false);
	},

	DoBulkAction: function (Action, From, To) {
		var t = Tabs.Attack;
		ById('pbatMessages').innerHTML = "&nbsp;";
		if (Action == 0 || From == 0) return;
		if (Action == 2 && To == 0) return;
		for (var i = Number(Options.AttackOptions.Routes.length - 1); i > -1; i--) {
			if ((Options.AttackOptions.Routes[i].cityId == From) || (From == -1 && !Cities.byID[Options.AttackOptions.Routes[i].cityId])) {
				if (Action == 1) { Options.AttackOptions.Routes.splice(i, 1); }
				else {
					if (Action == 2) { Options.AttackOptions.Routes[i].cityId = To; }
					else {
						if (Action == 3) { Options.AttackOptions.Routes[i].Active = false; }
						else {
							if (Action == 4) { Options.AttackOptions.Routes[i].Active = true; }
						}
					}
				}
			}
		}
		saveOptions();
		if (Action == 1) { ById('pbatMessages').innerHTML = tx("Attack routes deleted") + "!"; }
		else {
			if (Action == 2) { ById('pbatMessages').innerHTML = tx("Attack routes relocated") + "!"; }
		}
		t.PaintRoutes();
	},

	DeleteRoute: function (entry) {
		var t = Tabs.Attack;
		Options.AttackOptions.Routes.splice(entry, 1);
		saveOptions();
		ById('pbatMessages').innerHTML = tx("Attack route deleted") + "!";
		t.PaintRoutes();
	},

	ToggleActive: function (entry) {
		var t = Tabs.Attack;
		Options.AttackOptions.Routes[entry].Active = !Options.AttackOptions.Routes[entry].Active;
		saveOptions();
	},

	EditRoute: function (entry) {
		var t = Tabs.Attack;
		t.EditRouteNumber = entry;
		t.EditMode = true;
		ById('pbatMessages').innerHTML = "&nbsp;";

		t.RouteObject = {};
		for (var y in Options.AttackOptions.Routes[t.EditRouteNumber]) {
			t.RouteObject[y] = Options.AttackOptions.Routes[t.EditRouteNumber][y];
		}
		t.PaintNewRoutePanel();
	},

	NewRoute: function (xcoord, ycoord) {
		var t = Tabs.Attack;
		t.EditRouteNumber = -1;
		t.EditMode = true;
		ById('pbatMessages').innerHTML = "&nbsp;";

		if (!t.RouteObject) {
			t.RouteObject = {};
			for (var y in t.NewRouteObject) {
				t.RouteObject[y] = t.NewRouteObject[y];
			}
		}
		if (xcoord && ycoord) {
			t.RouteObject.target_x = xcoord;
			t.RouteObject.target_y = ycoord;
		}
		else {
			if (ById('maparea_map').style.display != "none") {
				t.RouteObject.target_x = ById('mapXCoor').value;
				t.RouteObject.target_y = ById('mapYCoor').value;
			}
		}
		t.PaintNewRoutePanel();
	},

	show: function () {
		var t = Tabs.Attack;
		t.PaintOverview();
	},

	EverySecond: function () {
		var t = Tabs.Attack;
		var now = unixTime();

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter % 2 == 0) { // refresh overview display every 2 seconds
			if (tabManager.currentTab.name == 'Attack' && Options.btWinIsOpen) {
				t.PaintOverview();
			}
		}

		if (t.LoopCounter % 3 == 0 && Options.AttackOptions.Running) { // check abandon wilds every 3 seconds
			setTimeout(t.checkAbandonWild, 0);

			// Check Merc Item Limit
			if (Options.AttackOptions.MercRunning && (Options.AttackOptions.LastMercChecked + 60) < now) { // check once a minute, but on a timer!
				t.checkMercItemLimit();
			}
		}

		if (t.LoopCounter % 60 == 0) { // check attack report every minute
			t.sendAttackReport();
			t.LoopCounter = 0;
		}
	},

	PaintOverview: function () {
		var t = Tabs.Attack;
		// update merc items
		t.UpdateMercTarget();
	},

	PaintNewRoutePanel: function () {
		var t = Tabs.Attack;
		var fromidx = null;

		if (t.EditRouteNumber < 0) {
			var z = '<div class=divHeader align=center>' + tx('NEW ATTACK ROUTE') + '</div><br>';
			fromidx = Cities.byID[uW.currentcityid].idx; // default new route from current city
		}
		else {
			var z = '<div class=divHeader align=center>' + tx('EDIT ATTACK ROUTE') + '</div><br>';
		}

		// remember last route details.... (or saved route details)

		if (Cities.byID[t.RouteObject.cityId]) {
			fromidx = Cities.byID[t.RouteObject.cityId].idx;
		}

		var MarchPresets = { 0: "-- " + tx('Select Preset') + " --" };
		for (var PN in Options.QuickMarchOptions.MarchPresets) {
			MarchPresets[PN] = Options.QuickMarchOptions.MarchPresets[PN][0];
		}

		z += '<TABLE align=left class=xtab>';
		z += '<TR><TD align=right>' + tx("Attack From") + ':&nbsp;</td><TD colspan=2><span id=pbatfromcity></span></td></tr>';
		z += '<tr><TD align=right>' + tx("Target Co-ords") + ':&nbsp;</td><td colspan=2>X:&nbsp;<INPUT id=pbatX type=text size=3 maxlength=10 value="' + t.RouteObject.target_x + '"\>&nbsp;Y:&nbsp;<INPUT id=pbatY type=text size=3 maxlength=3 value="' + t.RouteObject.target_y + '"\>&nbsp;&nbsp;&nbsp;<a class=xlink id=pbatFetchBookmarks>' + tx('Select Bookmark') + ':</a>&nbsp;<select id=pbatBookmarks class=btInput style="max-width:180px;"></select></td></tr>';
		z += '<TR><TD colspan=2><INPUT id=pbatwild type=checkbox ' + (t.RouteObject.isWild ? 'CHECKED' : '') + '>&nbsp;' + tx('Target is a Wilderness') + '</td><td>(' + tx('Auto-abandon wild and reduce some wave 1 troops to 10% of specified amount for subsequent attacks') + ')</td></tr>';
		z += '<TR><TD colspan=2><INPUT id=pbatmegalith type=checkbox ' + (t.RouteObject.isMegalith ? 'CHECKED' : '') + '>&nbsp;' + tx('Target is a Megalith') + '</td><td>(' + tx('No knight will be sent on attacks') + ')</td></tr>';
		z += '<TR><TD colspan=2><INPUT id=pbatchamponly type=checkbox ' + (t.RouteObject.ChampOnly ? 'CHECKED' : '') + '>&nbsp;' + tx('Attack with Champion Only!') + '</td><td>(' + tx('Champions are only sent on Wave 2') + ')</td></tr>';
		z += '</table><br>';

		z += '<TABLE width=100% class=xtab><TR valign=top>';
		z += '<td style="padding-top:3px;"><INPUT type=checkbox id=pbatRound1 ' + (t.RouteObject.RoundOne ? 'CHECKED' : '') + '></td><TD style="padding-top:6px;"><b>' + tx('Wave 1') + '</b>&nbsp;(' + tx('initial') + '):<br>';
		z += htmlSelector(MarchPresets, 0, 'id=pbatPreset1 class=btInput');
		z += '</td><td><table class=xtab cellspacing=0 cellpadding=0><tr>';

		var LineBreak = 6;
		if (GlobalOptions.btWinSize.x == 750) { LineBreak = 5; }
		if (GlobalOptions.btWinSize.x == 1250) { LineBreak = 8; }
		var c = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var tmpstyle = '';
			if (parseIntNan(i) < 5) tmpstyle = 'background-color:' + Options.Colors.Highlight;
			zz = '<td width=30px style="padding-right:0px;">' + TroopImageBig(i) + '</td><TD><INPUT style="' + tmpstyle + '" id=pbatR1_' + i + ' type=text size=7 maxlength=7 value="' + (t.RouteObject.RoundOneTroops[i] || 0) + '">&nbsp;&nbsp;</td>';
			if (c % LineBreak == 0) z += '</tr><tr>';
			z += zz;
			c++;
		}

		z += '</tr></table></td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr><TR valign=top>';
		z += '<TD style="padding-top:3px;"><INPUT type=checkbox id=pbatRound2 ' + (t.RouteObject.RoundTwo ? 'CHECKED' : '') + '><TD style="padding-top:6px;"><b>' + tx('Wave 2') + '</b>&nbsp;(' + tx('recurring') + '):<br>';
		z += htmlSelector(MarchPresets, 0, 'id=pbatPreset2 class=btInput');
		z += '</td><td><table class=xtab cellspacing=0 cellpadding=0><tr>';

		var c = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			zz = '<td width=30px style="padding-right:0px;">' + TroopImageBig(i) + '</td><TD><INPUT id=pbatR2_' + i + ' type=text size=7 maxlength=7 value="' + (t.RouteObject.RoundTwoTroops[i] || 0) + '">&nbsp;&nbsp;</td>';
			if (c % LineBreak == 0) z += '</tr><tr>';
			z += zz;
			c++;
		}
		z += '</tr></table></td></tr></table>';

		z += '<div align="center"><TABLE cellSpacing=0 width=98% height=0% class=xtab><tr><td>&nbsp;</td><td align=center>' + strButton20(tx('Save Route'), 'id=pbatSaveRoute') + '&nbsp;';
		if (t.EditRouteNumber >= 0) { z += strButton20(tx('Save a Copy'), 'id=pbatCopyRoute') + '&nbsp;'; }
		if (Tabs.Search && Tabs.Search.dat) {
			for (var k = 0; k < Tabs.Search.dat.length; k++) {
				coords = Tabs.Search.dat[k][0] + '_' + Tabs.Search.dat[k][1];
				elem = ById('pbSearchScout_' + coords);
				if (elem && elem.checked) {
					z += strButton20(tx('Bulk Add Co-ords from Search'), 'id=pbatImport') + '&nbsp;';
					break;
				}
			}
		}
		z += strButton20(uW.g_js_strings.commonstr.cancel, 'id=pbatCancelRoute') + '</td><td align=right>&nbsp;</td></tr></table></div>';

		ById('pbatRouteDetail').innerHTML = z;

		t.dcp0 = new CdispCityPicker('pbattackfrom', ById('pbatfromcity'), true, null, fromidx);

		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			t.addListeners(i);
		}

		ById('pbatRound1').addEventListener('click', function () {
			var checked = (!this.checked);
			t.checkDisableRound('1', checked);
		}, false);
		ById('pbatRound2').addEventListener('click', function () {
			var checked = (!this.checked);
			t.checkDisableRound('2', checked);
		}, false);

		t.checkDisableRound('1', !t.RouteObject.RoundOne);
		t.checkDisableRound('2', !t.RouteObject.RoundTwo);

		ById('pbatPreset1').addEventListener('change', function (e) {
			t.LoadPreset(e.target.value, 1);
		}, false);
		ById('pbatPreset2').addEventListener('change', function (e) {
			t.LoadPreset(e.target.value, 2);
		}, false);

		ById('pbatFetchBookmarks').addEventListener('click', function () {
			FillBookmarkList('pbatBookmarks');
		}, false);

		ById('pbatBookmarks').addEventListener('change', function () {
			if (this.value != '') {
				var val = this.value;
				var x = val.substr(0, val.lastIndexOf(','));
				var y = val.substr(val.lastIndexOf(',') + 1, val.length);
				ById('pbatX').value = x;
				ById('pbatY').value = y;
			}
		}, false);

		ById('pbatSaveRoute').addEventListener('click', function () { t.SaveRoute(false); }, false);
		if (ById('pbatCopyRoute')) { ById('pbatCopyRoute').addEventListener('click', function () { t.SaveRoute(true); }, false); }
		if (ById('pbatImport')) { ById('pbatImport').addEventListener('click', function () { t.ImportRoutes(); }, false); }
		ById('pbatCancelRoute').addEventListener('click', function () { t.RouteObject = null; t.PaintRoutes(); }, false);

		ById('pbatX').addEventListener('change', function () {
			var xValue = ById('pbatX').value.trim();
			var xI = /^\s*([0-9]+)[\s|,|-|.]+([0-9]+)/.exec(xValue);
			if (xI) {
				ById('pbatX').value = xI[1]
				ById('pbatY').value = xI[2]
			}
		});

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	addListeners: function (Troop) {
		var t = Tabs.Attack;
		var T1 = 'pbatR1_' + Troop;
		var T2 = 'pbatR2_' + Troop;
		ById(T1).addEventListener('keyup', function () { if (isNaN(ById(T1).value)) ById(T1).value = 0; }, false);
		ById(T2).addEventListener('keyup', function () { if (isNaN(ById(T2).value)) ById(T2).value = 0; }, false);
	},

	LoadPreset: function (PN, r) {
		var t = Tabs.Attack;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var elem = ById('pbatR' + r + '_' + i);
			if (elem) {
				elem.value = 0;
				if (Options.QuickMarchOptions.MarchPresets[PN][i]) {
					elem.value = parseIntNan(Options.QuickMarchOptions.MarchPresets[PN][i]);
				}
			}
		}
	},

	checkDisableRound: function (r, disabled) {
		var t = Tabs.Attack;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var elem = ById('pbatR' + r + '_' + i);
			if (elem) {
				elem.disabled = disabled;
				if (disabled) { elem.value = 0; }
			}
		}
		var elem = ById('pbatPreset' + r);
		if (elem) {
			elem.disabled = disabled;
			if (disabled) { elem.value = 0; }
		}
	},

	SaveRoute: function (CopyRoute) {
		var t = Tabs.Attack;

		if (!t.validateScreenFields('save')) { return; }

		if (t.EditRouteNumber < 0 || CopyRoute) {
			Options.AttackOptions.Routes.push(JSON2.parse(JSON2.stringify(t.RouteObject))); // create new object in array
			if (CopyRoute) { t.RouteObject = null; } // clear route object
		}
		else {
			Options.AttackOptions.Routes[t.EditRouteNumber] = t.RouteObject;
			t.RouteObject = null; // clear route object
		}
		ById('pbatMessages').innerHTML = tx("Attack route saved!");
		t.PaintRoutes();
	},

	ImportRoutes: function () {
		var t = Tabs.Attack;

		if (!t.validateScreenFields('import')) { return; }

		if (Tabs.Search && Tabs.Search.dat) {
			for (var k = 0; k < Tabs.Search.dat.length; k++) {
				coords = Tabs.Search.dat[k][0] + '_' + Tabs.Search.dat[k][1];
				elem = ById('pbSearchScout_' + coords);
				if (elem && elem.checked) {
					t.RouteObject.target_x = Tabs.Search.dat[k][0];
					t.RouteObject.target_y = Tabs.Search.dat[k][1];
					Options.AttackOptions.Routes.push(JSON2.parse(JSON2.stringify(t.RouteObject))); // create new object in array
					elem.checked = false;
				}
			}
		}

		t.RouteObject = null; // clear route object
		ById('pbatMessages').innerHTML = tx("Routes imported from Search Results!");
		t.PaintRoutes();
	},

	validateScreenFields: function (action) {
		var t = Tabs.Attack;

		if (!t.dcp0.city) {
			ById('pbatMessages').innerHTML = tx("No source city selected");
			return false;
		}

		if (action == "save") {
			var x = ById("pbatX").value;
			var y = ById("pbatY").value;
			if (x == "" || y == "" || isNaN(x) || isNaN(y) || x < 0 || x > 749 || y < 0 || y > 749) {
				ById('pbatMessages').innerHTML = tx("Map co-ordinates must be between 0 and 749!");
				return false;
			}
		}

		// copy screen fields to routeobject

		t.RouteObject.cityId = t.dcp0.city.id;
		t.RouteObject.target_x = x;
		t.RouteObject.target_y = y;
		t.RouteObject.isWild = ById('pbatwild').checked;
		t.RouteObject.isMegalith = ById('pbatmegalith').checked;
		t.RouteObject.ChampOnly = ById('pbatchamponly').checked;
		t.RouteObject.RoundOne = ById('pbatRound1').checked;
		t.RouteObject.RoundTwo = ById('pbatRound2').checked;

		t.RouteObject.RoundOneTroops = {};
		t.RouteObject.RoundTwoTroops = {};

		var gotR1troops = false;
		var gotR2troops = false;

		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var troopval = parseIntNan(ById('pbatR1_' + i).value);
			if (troopval != 0) {
				gotR1troops = true;
				t.RouteObject.RoundOneTroops[i] = troopval;
			}
			var troopval = parseIntNan(ById('pbatR2_' + i).value);
			if (troopval != 0) {
				gotR2troops = true;
				t.RouteObject.RoundTwoTroops[i] = troopval;
			}
		}

		if (!gotR1troops && !gotR2troops) {
			ById('pbatMessages').innerHTML = tx("You must select some attack troops!");
			return false;
		}
		if (!gotR1troops && ById('pbatRound1').checked) {
			ById('pbatMessages').innerHTML = tx("No wave 1 troops selected!");
			return false;
		}
		if (!gotR2troops && ById('pbatRound2').checked) {
			ById('pbatMessages').innerHTML = tx("No wave 2 troops selected!");
			return false;
		}

		// validation OK!
		return true;
	},

	sendAttackReport: function (force) {
		var t = Tabs.Attack;
		if ((!Options.AttackOptions.AttackReport || !Options.AttackOptions.Running) && !force) { return; }

		var now = unixTime();

		if (!force) {
			if (now < (parseInt(Options.AttackOptions.LastAttackReport) + (Options.AttackOptions.AttackReportInterval * 60 * 60))) { return; }
			var message = tx('Attack Report for') + ' ' + Options.AttackOptions.AttackReportInterval + ' ' + tx('hours of attacking (or since last report)') + ' %0A';
		}
		else {
			var message = tx('Attack Report (since last report)') + ' %0A';
		}

		var total = 0;
		message += tx('Numbers of 1st wave sent') + ': ' + Options.AttackOptions.Wave1Count + '%0A';
		message += tx('Numbers of 2nd wave sent') + ': ' + Options.AttackOptions.Wave2Count + '%0A';
		message += '%0A';

		if (Options.ReportOptions.DeleteRptaa) {
			message += tx('Miscellaneous items') + ': %0A';

			var Crests = {};
			for (var z in t.CrestList) { Crests[t.CrestList[z]] = 0; }

			for (var z in DeleteReports.ReportLog.ItemsFound) {
				if (!isNaN(Crests[z])) // if item is a crest or seal...
					Crests[z] = DeleteReports.ReportLog.ItemsFound[z];
				else {
					if (z == "T") {
						message += uW.g_js_strings.commonstr.found + ' ' + tx('Treasure Chest') + ' x ' + DeleteReports.ReportLog.ItemsFound[z] + '%0A';
					}
					else {
						message += uW.g_js_strings.commonstr.found + ' ' + uW.ksoItems[z].name + ' x ' + DeleteReports.ReportLog.ItemsFound[z] + '%0A';
					}
				}
			}
			message += '%0A';
			message += tx('Crest Stats') + ': %0A';
			for (crest in Crests) {
				if (Crests[crest] > 0) {
					message += uW.itemlist['i' + crest]['name'] + ' x ' + Crests[crest] + '%0A';
					total += (Crests[crest]);
				}
			}
			message += tx('Total Crests Found') + ': ' + total + '%0A';

			message += '%0A';
			message += tx('Jewel Stats') + ': %0A';
			var itemcount = 0;
			for (z in DeleteReports.ReportLog.JewelItemsFound) {
				itemcount += DeleteReports.ReportLog.JewelItemsFound[z];
				message += uW.g_js_strings.jewel['quality_' + Number(z - 1)] + ' Jewel x ' + DeleteReports.ReportLog.JewelItemsFound[z] + '%0A';
			}
			message += tx('Total Jewels Found') + ': ' + itemcount + '%0A';

			message += '%0A';
			message += tx('Throne Stats') + ': %0A';
			var itemcount = 0;
			for (z in DeleteReports.ReportLog.ThroneItemsFound) {
				itemcount += DeleteReports.ReportLog.ThroneItemsFound[z].amount;
				message += strQuality(DeleteReports.ReportLog.ThroneItemsFound[z].quality) + ' ' + DeleteReports.ReportLog.ThroneItemsFound[z].type + ' x ' + DeleteReports.ReportLog.ThroneItemsFound[z].amount + '%0A';
			}
			message += tx('Total Throne Room Items Found') + ': ' + itemcount + '%0A';

			message += '%0A';
			message += uW.g_js_strings.report_view.champion_stats + ': %0A';
			var itemcount = 0;
			for (z in DeleteReports.ReportLog.ChampItemsFound) {
				itemcount += DeleteReports.ReportLog.ChampItemsFound[z].amount;
				message += strQuality(DeleteReports.ReportLog.ChampItemsFound[z].quality) + ' ' + DeleteReports.ReportLog.ChampItemsFound[z].type + ' x ' + DeleteReports.ReportLog.ChampItemsFound[z].amount + '%0A';
			}
			message += tx('Total Champion Equipment Found') + ': ' + itemcount + '%0A';
		}
		else {
			message += tx('Found item details only available if the option "Delete auto-attack reports" is ticked') + '%0A';
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = tx("Attack Overview");

		params.message = message;
		params.requestType = "COMPOSED_MAIL";

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					DeleteLastMessage();
					Options.AttackOptions.Wave1Count = 0;
					Options.AttackOptions.Wave2Count = 0;
					saveOptions();
					if (Options.ReportOptions.DeleteRptaa) {
						DeleteReports.ReportLog.ItemsFound = {};
						DeleteReports.ReportLog.ThroneItemsFound = {};
						DeleteReports.ReportLog.ChampItemsFound = {};
						DeleteReports.ReportLog.JewelItemsFound = {};
						DeleteReports.saveLog();
					}
				}
			},
		});

		Options.AttackOptions.LastAttackReport = now;
		saveOptions();
	},

	doAutoLoop: function (idx, busted) {
		var t = Tabs.Attack;
		clearTimeout(t.timer);
		if (!Options.AttackOptions.Running) return;

		if (idx >= Options.AttackOptions.Routes.length) { idx = 0; } // safety, if route(s) have been deleted.
		if (idx == 0 && !busted) {
			t.loopaction = false; // reset loop action indicator for first city
			t.AttackOrder = [];
			for (var y = 0; y < Options.AttackOptions.Routes.length; y++) { t.AttackOrder.push(y); }
			if (Options.AttackOptions.Randomize) {
				t.AttackOrder = shuffle(t.AttackOrder);
			}
		}
		t.autodelay = 0; // no delay if no action taken!

		if (idx < Options.AttackOptions.Routes.length) {
			var a = Options.AttackOptions.Routes[t.AttackOrder[idx]];
			t.autodelay = 0; // no delay if no action taken...

			if (a.Active) {
				// do we need another round 1 yet?
				var now = unixTime();
				if (a.RoundTwo && a.RoundOne && !busted) {
					if (now > (parseIntNan(a.LastRoundOne) + 90)) {
						if (t.doAttack(idx, 1, true)) { return; } // march call initiated, loop handled from there...
					}
				}
				if (a.RoundTwo) { t.doAttack(idx, 2, false); }
				else { t.doAttack(idx, 1, false); } // if only round 1 just keep sending round 1...
			}
		}
		t.checkNextRoute(idx);
	},

	checkNextRoute: function (idx) {
		var t = Tabs.Attack;
		if (idx >= Options.AttackOptions.Routes.length - 1) {
			if (!t.loopaction) { t.autodelay = Options.AttackOptions.intervalSecs; } // if no action this loop, apply delay anyway...
			t.timer = setTimeout(function () { t.doAutoLoop(0, false); }, (t.autodelay * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx + 1, false); }, (t.autodelay * 1000));
		}
	},

	doAttack: function (idx, r, buster) {
		var t = Tabs.Attack;
		var a = Options.AttackOptions.Routes[t.AttackOrder[idx]];

		var champid = 0;
		citychamp = getCityChampion(a.cityId);
		if (citychamp.championId && citychamp.status != "10") {
			champid = citychamp.championId;
		}

		if (!Cities.byID[a.cityId]) { return false; } // no attack city!
		var towerok = (!Options.TowerOptions || !Options.TowerOptions.SaveCityState[a.cityId] || Options.TowerOptions.SaveCityState[a.cityId].AllowMarches);
		if (!towerok) { return false; } // attack city under attack!

		var ascensionok = (!Options.BuildOptions || !Options.BuildOptions.AscensionReady[Cities.byID[a.cityId].idx]);
		if (!ascensionok) { return; } // attack city waiting to ascend!

		if (a.ChampOnly && (champid == 0) && (r == 2 || (r == 1 && a.RoundTwo))) { return false; } // no champ or champ not ready!
		if (!t.checkCityTroops(r, idx)) { return false; } // insufficient troops for one or both waves!
		var slotsneeded = 1;
		if (r == 1 && a.RoundTwo) slotsneeded = 2;
		var keepfree = Number(Options.AttackOptions.FreeRallySlots); // use highest of attack keep rally free or general keep rally free
		if (keepfree < Number(Options.FreeRallySlots)) { keepfree = Number(Options.FreeRallySlots); }
		var availslots = Number(March.getEmptySlots(a.cityId)) - keepfree;
		if (availslots < slotsneeded) { return false; }

		if (!a.isMegalith) {
			var knt = getAvailableKnights(a.cityId);
			if (!knt[0]) { return false; } // no knight for this wave
			if (r == 1 && a.RoundTwo && !knt[1]) { return false; } // no knight for wave 2!
		}

		// from here, should be ok to attack..

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = a.cityId;
		if (!a.isMegalith) { params.kid = knt[0].ID; } // will fail if no knights
		else { params.kid = 0; }
		params.type = 4;
		params.xcoord = a.target_x;
		params.ycoord = a.target_y;

		if (a.ChampOnly && (r == 2)) {
			params.champid = champid;
		}

		var totalsend = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			if (r == 1) { params["u" + i] = parseIntNan(a.RoundOneTroops[i]); }
			else { params["u" + i] = parseIntNan(a.RoundTwoTroops[i]); }
			totalsend += params["u" + i];
		}

		if (r == 1) {
			var now = unixTime();
			if (now < (parseInt(a.LastRoundOne) + 500) && a.isWild) {
				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					if (params["u" + i] != 0 && parseIntNan(i) < 5) { // supply troops, militia, scouts and pikes only.
						params["u" + i] = Math.ceil(params["u" + i] / 10);
					}
				}
			}
		}

		if (totalsend == 0) { // final safety net
			return false;
		}
		else {
			t.autodelay = Options.AttackOptions.intervalSecs; // march is required, so delay subsequent loop
			t.loopaction = true;

			March.addMarch(params, function (rslt) {
				if (rslt.ok) {
					var now = unixTime();
					if (r == 1) {
						Options.AttackOptions.Wave1Count++;
						Options.AttackOptions.Routes[t.AttackOrder[idx]].LastRoundOne = now;
					}
					else {
						Options.AttackOptions.Wave2Count++;
					}
					saveOptions();
					if (buster) { // wave 1 success!.. reset loop on same route for wave 2...
						t.timer = setTimeout(function () { t.doAutoLoop(idx, true); }, (t.autodelay * 1000));
					}
				}
				else {
					if (rslt.error_code == 206) { // cannot do this to yourself! You still own the wild....
						//						if (a.isWild) {
						var tid = CalculateTileId(a.target_x, a.target_y);
						if (tid != 0) { AbandonWild(tid, a.target_x, a.target_y, a.cityId); }
						//						}
					}
					else {
						if (!rslt.msg) { rslt.msg = tx('Error Code (') + rslt.error_code + ')'; }
						if (GlobalOptions.ExtendedDebugMode) { actionLog(Cities.byID[a.cityId].name + ": Attack Error - " + rslt.msg, 'ATTACK'); }
					}
					if (buster) { // wave 1 failed.. reset loop and move on to next route
						t.checkNextRoute(idx);
					}
				}
			});
		}

		return true; // march was requested...
	},

	checkCityTroops: function (round, idx) {
		var t = Tabs.Attack;
		var a = Options.AttackOptions.Routes[t.AttackOrder[idx]];
		var result = true;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var needed = 0;
			for (var r = round; r <= 2; r++) { // wave 1 checks both wave requirements
				if (r == 1) { needed += parseIntNan(a.RoundOneTroops[i]); }
				else { needed += parseIntNan(a.RoundTwoTroops[i]); }
				result = (result && (parseIntNan(Seed.units['city' + a.cityId]['unt' + i]) >= needed));
				if (!result) { return result; }
			}
		}
		return result;
	},

	checkAbandonWild: function () {
		var t = Tabs.Attack;
		if (!Options.AttackOptions.Running) { return; }
		for (var m in Options.AttackOptions.Routes) {
			var a = Options.AttackOptions.Routes[m];
			if (a.isWild) {
				for (var c = 0; c < Cities.numCities; c++) {
					var city = Cities.cities[c];
					var cWilds = Seed.wilderness['city' + city.id];
					if (matTypeof(cWilds) == 'object') {
						for (var k in Seed.wilderness['city' + city.id]) {
							var w = Seed.wilderness['city' + city.id][k];
							if (w.xCoord == a.target_x && w.yCoord == a.target_y) {
								AbandonWild(w.tileId, w.xCoord, w.yCoord, city.id);
								return; // only abandon one per loop
							}
						}
					}
				}
			}
		}
	},

}
