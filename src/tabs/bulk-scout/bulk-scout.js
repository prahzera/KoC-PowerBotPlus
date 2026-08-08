/** Bulk Scout **/

Tabs.BulkScout = {
	tabLabel: 'Scout List',
	tabOrder: 2080,
	tabColor: 'brown',
	timer: null,
	cityreason: '',
	Options: {
		NumScouts: 1,
		ScoutCity: 0,
		SkipErrors: true,
		Attack: false,
		AttackPreset: false,
		AllCities: false,
		ClosestCity: false,
		QuickScout: false,
		CoordList: [],
		On: false,
		Toggle: false,
		KnightPriority: 0, // 0 - highest combat (default), 1 - lowest combat, 2 - highest experience, 3 - lowest experience, 4 - no knight!
		SendChamp: 0, // 0 - never (default), 1 - always, 2 - if available
		FreeRallySlots: 2,
		ClearOnRefresh: true,
		intervalSecs: 5,
		OverrideAP: false,
		ScoutType: 3,
	},
	myDiv: null,

	init: function (div) {
		var t = Tabs.BulkScout;

		t.myDiv = div;

		if (!Options.BulkScoutOptions) {
			Options.BulkScoutOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.BulkScoutOptions.hasOwnProperty(y)) {
					Options.BulkScoutOptions[y] = t.Options[y];
				}
			}
		}

		if (Options.BulkScoutOptions.Toggle) AddSubTabLink('AutoScout', t.e_toggleswitch, 'ScoutToggleTab');
		SetToggleButtonState('Scout', Options.BulkScoutOptions.On, 'Scout');

		// strip out any co-ords not ticked - this will be unpopular, but it will avoid the list endlessly growing!

		var b = Options.BulkScoutOptions.CoordList.length;
		while (b--) {
			if (!Options.BulkScoutOptions.CoordList[b].chk && Options.BulkScoutOptions.ClearOnRefresh) {
				Options.BulkScoutOptions.CoordList.splice(b, 1);
			}
		}

		uWExportFunction('btRemoveScoutList', Tabs.BulkScout.RemoveEntry);
		uWExportFunction('pbscoutclick', Tabs.BulkScout.ToggleEntry);

		// start autoscout loop timer to start in 10 seconds...

		if (Options.BulkScoutOptions.On) {
			t.timer = setTimeout(function () { t.doAutoLoop(Options.BulkScoutOptions.ScoutCity); }, (10 * 1000));
		}
	},

	show: function (init) {
		var t = Tabs.BulkScout;
		if (!Options.BulkScoutOptions.On) { // reset to current city on show if not already scouting
			if (init) {
				Options.BulkScoutOptions.ScoutCity = Cities.byID[InitialCityId].idx;
			}
			else {
				Options.BulkScoutOptions.ScoutCity = Cities.byID[uW.currentcityid].idx;
			}
		}

		var m = '<DIV class=divHeader align=center>' + tx('SCOUT/ATTACK LIST') + '</div><div align=center>';
		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btScoutToggle type=checkbox ' + (Options.BulkScoutOptions.Toggle ? 'CHECKED ' : '') + '/>&nbsp;' + tx("Add toggle button to main screen header") + '</td><td colspan=2 align=center><INPUT id=BulkScoutButton type=submit value="' + tx("AutoScout") + ' = ' + (Options.BulkScoutOptions.On ? 'ON' : 'OFF') + '"></td><td width=30% align=right>&nbsp;</td></tr></table>';
		m += '<br></div><DIV class=divHeader align=center>' + tx('OPTIONS') + '</div><br>';
		m += '<TABLE width=98% align=center cellpadding=0 cellspacing=0 class=xtab><TR width=50%><td><TABLE cellpadding=1 cellspacing=0 class=xtab>';
		m += '<TR><td colspan=2>' + tx("Number of") + '&nbsp;' + htmlSelector(ScoutTroops, Options.BulkScoutOptions.ScoutType, ' id=pbsscouttype class=btInput') + '&nbsp;' + tx("to send") + ':&nbsp;<input id=pbsrcScoutAmt class=btInput size=5 value="' + Options.BulkScoutOptions.NumScouts + '" /></td></tr>';
		m += '<TR><td colspan=2>' + tx("Keep") + ' <INPUT id=btbsfreerallyslots class=btInput type=text size=2 maxlength=2 value="' + Options.BulkScoutOptions.FreeRallySlots + '"\> ' + tx("free rally point slots") + '</td></tr>';
		m += '<TR><td colspan=2>' + translate("March Interval") + ': <INPUT id=btbsmarchinterval class=btInput type=text size=2 maxlength=2 value="' + Options.BulkScoutOptions.intervalSecs + '"\> ' + translate("seconds") + '</td></tr>';
		m += '<TR><td><input type=checkbox id="pbsclear"></td><td>' + tx("Remove unchecked co-ords from list on refresh") + '</td></tr>';
		m += '<TR><td colspan=2>' + tx("March from") + ': <span id=pbsrcScoutcitypick> </span></td></tr>';
		m += '<TR><td><input type=checkbox id="pbsclosest"></td><td>' + tx("or select the closest city") + '</td></tr>';
		m += '<TR><td><input type=checkbox id="pbskip"></td><td>' + tx("Skip targets when errors occur") + '</td></tr>';
		m += '<TR><td><input type=checkbox id="pbsallcities"></td><td>' + tx("Use all cities (not under Ascension Protection!)") + '</td></tr>';
		m += '<TR><td><input type=checkbox id="pbsoverrideap"></td><td>' + tx("Allow marches from cities under Ascension Protection") + '&nbsp;<span class=boldRed>(' + tx('BEWARE!') + ')</span></td></tr>';
		m += '<TR><td><input type=checkbox id="pbsquick"></td><td>' + tx("Fetch march target details (QuickScout)") + '</td></tr>';
		m += '<TR><td style="height:20px;"><input type=checkbox id="pbattack"></td><td style="vertical-align:bottom;">' + tx("Send ATTACK!") + '&nbsp;&nbsp;&nbsp;&nbsp;<span id=pbspresetspan class=divHide>';
		var MarchPresets = { 0: "-- " + tx('Use Scouts') + " --" };
		for (var PN in Options.QuickMarchOptions.MarchPresets) {
			MarchPresets[PN] = Options.QuickMarchOptions.MarchPresets[PN][0];
		}
		m += htmlSelector(MarchPresets, Options.BulkScoutOptions.AttackPreset, ' id=pbsattackpreset class=btInput');
		m += '</span></div></td></tr>';
		m += '<TR><td style="height:20px;">&nbsp;</td><td id=pbsknightcell class=divHide>' + tx('Knight priority') + ':&nbsp;' + htmlSelector({ 0: tx('Highest Combat Skill'), 1: tx('Lowest Combat Skill'), 2: tx('Highest Experience'), 3: tx('Lowest Experience'), 4: tx('No Knight! (Megaliths)') }, Options.BulkScoutOptions.KnightPriority, ' class=btInput id=pbsknight') + '</td></tr>';
		m += '<TR><td style="height:20px;">&nbsp;</td><td id=pbschampcell class=divHide>' + tx('Send Champion') + ':&nbsp;' + htmlSelector({ 0: tx('Never'), 1: tx('Always'), 2: tx('If Available') }, Options.BulkScoutOptions.SendChamp, ' class=btInput id=pbschamp') + '</td></tr></table>';

		m += '</td><td width=50%>';
		m += '<DIV>' + tx("Co-ordinates") + ':</div>';
		m += '<DIV><textarea id=pbbulkscoutcoords rows=7 cols=40 onkeyup="ptStopProp(event);" title="Separate multiple co-ordinates with spaces.\nValid formats include xxx,yyy (xxx_yyy) [xxx.yyy] etc..."></textarea></div>';
		m += '<DIV>' + strButton20(tx('Add to Scout List'), 'id=pbAddBulkScout') + '</div>';
		m += '</td></tr><tr><td height=20 id=pbbulkscoutmsg align=center colspan=2>&nbsp;</td></tr></table>';

		m += '</div><DIV class=divHeader align=center>' + tx('SCOUT QUEUE') + '</div><br>';
		m += '<DIV id=btScoutList style="height:220px; overflow-y:auto;"></div><br>';

		t.myDiv.innerHTML = m;
		t.PaintList('');

		new CdispCityPicker('pbScoutPick', ById('pbsrcScoutcitypick'), true, function (c, x, y) { Options.BulkScoutOptions.ScoutCity = c.idx; }, Options.BulkScoutOptions.ScoutCity);

		ById('BulkScoutButton').addEventListener('click', function () {
			t.e_toggleswitch(this)
		}, false);


		ChangeIntegerOption('BulkScoutOptions', 'btbsfreerallyslots', 'FreeRallySlots');

		ById('btbsmarchinterval').addEventListener('keyup', function () {
			if (parseIntNan(ById('btbsmarchinterval').value) < 1) { ById('btbsmarchinterval').value = 5; }
			if (parseIntNan(ById('btbsmarchinterval').value) < 2) { ById('btbsmarchinterval').value = 2; }
			Options.BulkScoutOptions.intervalSecs = parseIntNan(ById('btbsmarchinterval').value);
			saveOptions();
		}, false);

		ToggleOption('BulkScoutOptions', 'btScoutToggle', 'Toggle');
		ToggleOption('BulkScoutOptions', 'pbsclosest', 'ClosestCity');
		ToggleOption('BulkScoutOptions', 'pbskip', 'SkipErrors');
		ToggleOption('BulkScoutOptions', 'pbattack', 'Attack', t.ShowHidePreset);
		t.ShowHidePreset();
		ToggleOption('BulkScoutOptions', 'pbsallcities', 'AllCities');
		ToggleOption('BulkScoutOptions', 'pbsoverrideap', 'OverrideAP');
		ToggleOption('BulkScoutOptions', 'pbsquick', 'QuickScout');
		ToggleOption('BulkScoutOptions', 'pbsclear', 'ClearOnRefresh');

		ById('pbAddBulkScout').addEventListener('click', t.AddCoords, false);

		ById('pbsattackpreset').addEventListener('change', function () {
			Options.BulkScoutOptions.AttackPreset = ById('pbsattackpreset').value;
			saveOptions();
		}, false);

		ById('pbsscouttype').addEventListener('change', function () {
			Options.BulkScoutOptions.ScoutType = ById('pbsscouttype').value;
			saveOptions();
		}, false);

		ById('pbsrcScoutAmt').addEventListener('change', function () {
			Options.BulkScoutOptions.NumScouts = parseIntNan(ById('pbsrcScoutAmt').value);
			if (Options.BulkScoutOptions.NumScouts == 0) Options.BulkScoutOptions.NumScouts = 1;
			saveOptions();
		}, false);

		ById('pbsknight').addEventListener('change', function () {
			Options.BulkScoutOptions.KnightPriority = ById('pbsknight').value;
			saveOptions();
		}, false);

		ById('pbschamp').addEventListener('change', function () {
			Options.BulkScoutOptions.SendChamp = ById('pbschamp').value;
			saveOptions();
		}, false);
	},

	ShowHidePreset: function () {
		var t = Tabs.BulkScout;
		if (Options.BulkScoutOptions.Attack) { jQuery('#pbspresetspan').removeClass("divHide"); jQuery('#pbsknightcell').removeClass("divHide"); jQuery('#pbschampcell').removeClass("divHide"); }
		else { jQuery('#pbspresetspan').addClass("divHide"); jQuery('#pbsknightcell').addClass("divHide"); jQuery('#pbschampcell').addClass("divHide"); }
	},

	e_toggleswitch: function (obj) {
		var t = Tabs.BulkScout;
		obj = ById('BulkScoutButton');
		if (Options.BulkScoutOptions.On) {
			if (obj) obj.value = tx("AutoScout = OFF");
			Options.BulkScoutOptions.On = false;
		} else {
			if (obj) obj.value = tx("AutoScout = ON");
			Options.BulkScoutOptions.On = true;
			t.timer = setTimeout(function () { t.doAutoLoop(Options.BulkScoutOptions.ScoutCity); }, 0);
		}
		saveOptions();
		SetToggleButtonState('Scout', Options.BulkScoutOptions.On, 'Scout');
	},

	PaintList: function (msg) {
		var t = Tabs.BulkScout;

		var z = '';
		var r = 0;
		var logshow = false;
		var sel = 0;

		var z = '<div align="center">';
		z += '<TABLE width=98% align=center cellpadding=0 cellspacing=0 class=xtab><TR><TD colspan=4 align=right id=pbscoutinfo>&nbsp;</td></tr><tr><TH class=xtabHD width=15><input type=checkbox id=pbscout_All /></th><TH width=100 class=xtabHD>' + tx('Co-ords') + '</th><th class=xtabHD>' + tx('Details') + '</th><th align=right class=xtabHD>' + strButton14(tx('Export'), 'id=btExportScoutList') + '&nbsp;' + strButton14(tx('Clear List'), 'id=btClearScoutList') + '</th></tr>';
		for (i = 0; i < Options.BulkScoutOptions.CoordList.length; i++) {
			logshow = true;
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<TR class="' + rowClass + '"><TD align=center width=15><input type=checkbox name=pbscoutchk id="pbscoutchk_' + Options.BulkScoutOptions.CoordList[i].x + '_' + Options.BulkScoutOptions.CoordList[i].y + '" value="' + Options.BulkScoutOptions.CoordList[i].x + '_' + Options.BulkScoutOptions.CoordList[i].y + '" ' + (Options.BulkScoutOptions.CoordList[i].chk ? 'CHECKED' : '') + ' onclick="pbscoutclick(\'' + Options.BulkScoutOptions.CoordList[i].x + '_' + Options.BulkScoutOptions.CoordList[i].y + '\')" /></td><TD align=center>' + coordLink(Options.BulkScoutOptions.CoordList[i].x, Options.BulkScoutOptions.CoordList[i].y) + '</td><TD align=left id="pbscoutdetails_' + Options.BulkScoutOptions.CoordList[i].x + '_' + Options.BulkScoutOptions.CoordList[i].y + '">' + (Options.BulkScoutOptions.CoordList[i].Details ? Options.BulkScoutOptions.CoordList[i].Details : '') + '<td align=right><a id="pbscoutdelete' + Options.BulkScoutOptions.CoordList[i].x + '_' + Options.BulkScoutOptions.CoordList[i].y + '" class="inlineButton btButton brown8" onclick="btRemoveScoutList(\'' + Options.BulkScoutOptions.CoordList[i].x + '_' + Options.BulkScoutOptions.CoordList[i].y + '\')"><span>' + tx('Remove') + '</span></a></td></tr>';

			if (Options.BulkScoutOptions.CoordList[i].chk) sel++;
		}

		if (!logshow) {
			z += '<tr><td colspan=4 class=xtab><div align="center"><br><br>' + tx('No list entries') + '</div></td></tr>';
		}

		z += '</table></div>';

		ById('btScoutList').innerHTML = z;
		ById('pbbulkscoutmsg').innerHTML = msg;
		ById('pbscoutinfo').innerHTML = '(' + sel + '/' + Options.BulkScoutOptions.CoordList.length + ')';
		ById('btClearScoutList').addEventListener('click', function () { t.ClearList(); }, false);
		ById('btExportScoutList').addEventListener('click', function () { t.ExportList(); }, false);

		ById('pbscout_All').addEventListener('change', function () {
			var sel = 0;
			for (k in document.getElementsByName('pbscoutchk'))
				document.getElementsByName('pbscoutchk')[k].checked = ById('pbscout_All').checked;
			for (var b in Options.BulkScoutOptions.CoordList) {
				Options.BulkScoutOptions.CoordList[b].chk = ById('pbscout_All').checked;
				if (Options.BulkScoutOptions.CoordList[b].chk) sel++;
			}
			saveOptions();
			ById('pbscoutinfo').innerHTML = '(' + sel + '/' + Options.BulkScoutOptions.CoordList.length + ')';
		}, false);
	},

	ClearList: function () {
		var t = Tabs.BulkScout;
		Options.BulkScoutOptions.CoordList = [];
		saveOptions();
		t.PaintList(tx('Scout List Cleared'));
	},

	ExportList: function () {
		var t = Tabs.BulkScout;
		var CoordList = [];
		for (i = 0; i < Options.BulkScoutOptions.CoordList.length; i++) {
			CoordList.push('(' + Options.BulkScoutOptions.CoordList[i].x + ',' + Options.BulkScoutOptions.CoordList[i].y + ')');
		}
		if (CoordList.length > 0) {
			window.prompt(tx("Copy to clipboard: Ctrl+C"), CoordList.join(" "));
		}
	},

	RemoveEntry: function (c) {
		var t = Tabs.BulkScout;
		var Coord = [];
		Coord = c.split("_");
		for (var b in Options.BulkScoutOptions.CoordList) {
			if (Options.BulkScoutOptions.CoordList[b].x == Coord[0] && Options.BulkScoutOptions.CoordList[b].y == Coord[1]) {
				Options.BulkScoutOptions.CoordList.splice(b, 1);
				break;
			}
		}
		saveOptions();
		t.PaintList('Entry deleted');
	},

	ToggleEntry: function (c) {
		var t = Tabs.BulkScout;
		var Coord = [];
		Coord = c.split("_");
		var sel = 0;
		for (var b in Options.BulkScoutOptions.CoordList) {
			if (Options.BulkScoutOptions.CoordList[b].x == Coord[0] && Options.BulkScoutOptions.CoordList[b].y == Coord[1]) {
				Options.BulkScoutOptions.CoordList[b].chk = !Options.BulkScoutOptions.CoordList[b].chk;
				saveOptions();
			}
			if (Options.BulkScoutOptions.CoordList[b].chk) sel++;
		}
		ById('pbscoutinfo').innerHTML = '(' + sel + '/' + Options.BulkScoutOptions.CoordList.length + ')';
	},

	UnselectEntry: function (x, y) {
		var t = Tabs.BulkScout;
		for (var b in Options.BulkScoutOptions.CoordList) {
			if (Options.BulkScoutOptions.CoordList[b].x == x && Options.BulkScoutOptions.CoordList[b].y == y) {
				Options.BulkScoutOptions.CoordList[b].chk = false;
				saveOptions();
			}
		}
		if (ById('pbscoutchk_' + x + '_' + y)) {
			ById('pbscoutchk_' + x + '_' + y).checked = false;
		}
	},

	AddCoords: function () {
		var t = Tabs.BulkScout;

		var NewCoords = ById('pbbulkscoutcoords').value;
		NewCoords = replaceAll(NewCoords, "(", " ");
		NewCoords = replaceAll(NewCoords, ")", " ");
		NewCoords = replaceAll(NewCoords, "[", " ");
		NewCoords = replaceAll(NewCoords, "]", " ");
		NewCoords = replaceAll(NewCoords, "_", ",");
		NewCoords = replaceAll(NewCoords, ".", ",");
		var NewCoordList = [];
		var CleanedCoordList = [];
		var Coord = [];
		var ListEntry = new Object();
		var msg = '';
		if (NewCoords.trim() != "") {
			NewCoordList = NewCoords.split(" ");
		}
		CoordError = false;
		CoordsAdded = false;
		for (var a = 0; a < NewCoordList.length; a++) {
			var c = NewCoordList[a];
			if (c.trim() != "") {
				Coord = c.split(",");
				if (Coord[0] && !isNaN(Coord[0]) && Coord[1] && !isNaN(Coord[1])) {
					// look like coords?
					CleanedCoordList.push({ x: Coord[0], y: Coord[1] });
					// avoid duplicates by deleting existing entry for these coords
					for (var b = 0; b < Options.BulkScoutOptions.CoordList.length; b++) {
						if (Options.BulkScoutOptions.CoordList[b].x == Coord[0] && Options.BulkScoutOptions.CoordList[b].y == Coord[1]) {
							Options.BulkScoutOptions.CoordList.splice(b, 1);
							break;
						}
					}
				}
				else {
					CoordError = true;
				}
			}
		}

		if (CoordError) {
			msg = '<span style="color:#800;">' + tx('Invalid format') + '!</span>';
		}
		else {
			for (var a = 0; a < CleanedCoordList.length; a++) {
				CoordsAdded = true;
				ListEntry = {};
				ListEntry.chk = true;
				ListEntry.x = CleanedCoordList[a].x;
				ListEntry.y = CleanedCoordList[a].y;
				ListEntry.details = '';
				Options.BulkScoutOptions.CoordList.push(ListEntry);
			}
			if (CoordsAdded) msg = tx('Co-ordinates added');
			ById('pbbulkscoutcoords').value = '';
		}
		saveOptions();
		t.PaintList(msg);
	},

	ImportCoords: function (CoordList) {
		var t = Tabs.BulkScout;
		CoordsAdded = false;
		for (var a = 0; a < CoordList.length; a++) {
			var c = CoordList[a];
			if (c.trim() != "") {
				Coord = c.split(",");
				for (var b = 0; b < Options.BulkScoutOptions.CoordList.length; b++) {
					if (Options.BulkScoutOptions.CoordList[b].x == Coord[0] && Options.BulkScoutOptions.CoordList[b].y == Coord[1]) {
						Options.BulkScoutOptions.CoordList.splice(b, 1);
						break;
					}
				}
				ListEntry = {};
				ListEntry.chk = true;
				ListEntry.x = Coord[0];
				ListEntry.y = Coord[1];
				ListEntry.details = '';
				Options.BulkScoutOptions.CoordList.push(ListEntry);
				CoordsAdded = true;
			}
		}

		if (CoordsAdded) { ById('bttcBulkScout').click(); }
	},

	doAutoLoop: function (idx) {
		var t = Tabs.BulkScout;
		clearTimeout(t.timer);
		if (ById('pbbulkscoutmsg')) { ById('pbbulkscoutmsg').innerHTML = ''; }

		var cityId = Cities.cities[idx].id;

		// get next scout entry, if none, then switch off.

		var entry = null;
		for (var i = 0; i < Options.BulkScoutOptions.CoordList.length; i++) {
			if (Options.BulkScoutOptions.CoordList[i].chk) {
				entry = Options.BulkScoutOptions.CoordList[i];
				break;
			}
		}

		if (!entry) {
			Options.BulkScoutOptions.On = false;
			saveOptions();
			if (ById('BulkScoutButton')) { ById('BulkScoutButton').value = tx("AutoScout = OFF"); }
			SetToggleButtonState('Scout', Options.BulkScoutOptions.On, 'Scout');
			t.PaintList(tx('Scouting Completed'));
			return;
		}
		else {
			if (!Options.BulkScoutOptions.On) {
				t.UpdateDetails(entry.x, entry.y, tx('Scouting Cancelled'));
				return;
			}
			t.UpdateDetails(entry.x, entry.y, tx('Sending') + '...');
		}

		if (Options.BulkScoutOptions.ClosestCity) { // select closest city
			var idx = t.SelectClosest(entry.x, entry.y);
			var cityId = Cities.cities[idx].id;
		}

		// check currently selected city is suitable for the march.

		var citysuitable = t.CheckCitySuitable(cityId, true);

		if (!citysuitable) {
			if (Options.BulkScoutOptions.AllCities) { // check other cities
				var newidx = t.GetNextSuitableCity(idx);
				if (newidx != idx) {
					idx = newidx;
					var cityId = Cities.cities[idx].id;
					citysuitable = true;
					actionLog('Changing city to ' + Cities.cities[idx].name, 'SCOUT')
				}
			}
		}

		if (!citysuitable) {
			t.UpdateDetails(entry.x, entry.y, t.cityreason + '...', true);
			actionLog(t.cityreason, 'SCOUT')
			// 1 min delay... no suitable cities at the moment...
			if (!Options.BulkScoutOptions.ClosestCity || Options.BulkScoutOptions.AllCities) {
				t.timer = setTimeout(function () { t.doAutoLoop(Options.BulkScoutOptions.ScoutCity); }, (60 * 1000));
			}
			else {
				// move co-ords to end of list and try next, because the next entry could be for another city
				Options.BulkScoutOptions.CoordList.push(Options.BulkScoutOptions.CoordList.splice(i, 1)[0]);
				t.timer = setTimeout(function () { t.doAutoLoop(idx); }, (Options.BulkScoutOptions.intervalSecs * 1000));
			}
			return;
		}

		// Send the scout, and loop back once sent...

		t.sendScout(entry.x, entry.y, cityId, function () { var t = Tabs.BulkScout; t.timer = setTimeout(function () { t.doAutoLoop(idx); }, (Options.BulkScoutOptions.intervalSecs * 1000)); });
	},

	SelectClosest: function (x2, y2) {
		var t = Tabs.BulkScout;
		var closestdist = 999999;
		var closestcity;

		if (isNaN(x2) || isNaN(y2)) return;

		for (var i = 0; i < Cities.numCities; i++) {
			var cityId = Cities.cities[i].id;
			var ascensionok = (!CM.PrestigeCityPlayerProtectionController.isActive(cityId) || Options.BulkScoutOptions.OverrideAP); // don't select city under AP!
			if (ascensionok) {
				var x1 = parseInt(Cities.cities[i].x);
				var y1 = parseInt(Cities.cities[i].y);
				if (x1 != x2 || y1 != y2) { // if one of your cities, pick the nearest other city!
					var dist = distance(x1, y1, x2, y2);
					if (dist < closestdist) {
						closestdist = dist;
						closestcity = i;
					}
				}
			}
		}
		return closestcity;
	},

	GetNextSuitableCity: function (idx) {
		var t = Tabs.BulkScout;
		var oldidx = idx;
		do {
			idx++;
			if (idx >= Number(Cities.numCities)) idx = 0;
			cityId = Cities.cities[idx].id;
		}
		while (!t.CheckCitySuitable(cityId) && (idx != oldidx))
		return idx;
	},

	CheckCitySuitable: function (cityId, reason) {
		var t = Tabs.BulkScout;

		var troopsok = true;
		var CheckArray = [];
		if (Options.BulkScoutOptions.Attack && Options.BulkScoutOptions.AttackPreset != 0) {
			for (var ui in CM.UNIT_TYPES) {
				var i = CM.UNIT_TYPES[ui];
				if (Options.QuickMarchOptions.MarchPresets[Options.BulkScoutOptions.AttackPreset][i]) {
					CheckArray[i] = parseIntNan(Options.QuickMarchOptions.MarchPresets[Options.BulkScoutOptions.AttackPreset][i]);
				}
			}
		}
		else {
			CheckArray[Options.BulkScoutOptions.ScoutType] = Options.BulkScoutOptions.NumScouts;
		}
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			if (CheckArray[i] && CheckArray[i] > parseIntNan(Seed.units['city' + cityId]['unt' + i])) {
				troopsok = false;
				break;
			}
		}

		var knightok = true;
		if (Options.BulkScoutOptions.Attack) {
			var knt = getAvailableKnights(cityId);
			if (!knt[0]) { knightok = false; }
		}

		var marches = parseIntNan(March.getMarchSlots(cityId));
		var maxmarches = parseIntNan(March.getTotalSlots(cityId));
		var keepfree = Number(Options.BulkScoutOptions.FreeRallySlots); // use highest of bulk scout keep rally free or general keep rally free
		if (keepfree < Number(Options.FreeRallySlots)) { keepfree = Number(Options.FreeRallySlots); }
		var rallyok = ((marches + keepfree) < maxmarches);
		var towerok = (!Options.TowerOptions || !Options.TowerOptions.SaveCityState[cityId] || Options.TowerOptions.SaveCityState[cityId].AllowMarches);
		var ascensionok = (!CM.PrestigeCityPlayerProtectionController.isActive(cityId) || Options.BulkScoutOptions.OverrideAP);

		var champok = true;
		if (Options.BulkScoutOptions.Attack && parseIntNan(Options.BulkScoutOptions.SendChamp) == 1) {
			citychamp = getCityChampion(cityId);
			champok = (citychamp.championId && citychamp.status != "10");
		}

		if (reason) {
			t.cityreason = tx('Waiting for rally point to clear!');
			if (rallyok) {
				if (!knightok) t.cityreason = tx('Waiting for an available knight!');
				else if (!champok) t.cityreason = tx('No Champion available!');
				else if (!troopsok) t.cityreason = tx('Waiting for available troops!');
				else if (!towerok) t.cityreason = tx('Source city is under attack - waiting for all clear!');
				else if (!ascensionok) t.cityreason = tx('Source city is under ascension protection - cannot march from here!');
			}
		}

		return (troopsok && knightok && rallyok && towerok && ascensionok && champok);
	},

	UpdateDetails: function (x, y, msg, perm) {
		var t = Tabs.BulkScout;
		var el = 'pbscoutdetails_' + x + '_' + y;
		var elem = ById(el);
		if (elem) { elem.innerHTML = msg; }
		if (perm) {
			for (var b in Options.BulkScoutOptions.CoordList) {
				if (Options.BulkScoutOptions.CoordList[b].x == x && Options.BulkScoutOptions.CoordList[b].y == y) {
					Options.BulkScoutOptions.CoordList[b].Details = msg;
					saveOptions();
				}
			}
		}
	},

	sendScout: function (x, y, cid, notify) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cid;
		params.kid = 0;
		params.type = 3;
		params.xcoord = x;
		params.ycoord = y;
		if (Options.BulkScoutOptions.Attack) {
			var knt = getAvailableKnights(cid);
			if (knt[0]) {
				if (Options.BulkScoutOptions.KnightPriority == 1) { // lowest combat skill
					knt = knt.sort(function sort(a, b) { a = a['Combat']; b = b['Combat']; return a == b ? 0 : (a < b ? -1 : 1); });
				};
				if (Options.BulkScoutOptions.KnightPriority == 2) { // highest experience
					knt = knt.sort(function sort(a, b) { a = a['Experience']; b = b['Experience']; return a == b ? 0 : (a > b ? -1 : 1); });
				};
				if (Options.BulkScoutOptions.KnightPriority == 3) { // lowest experience
					knt = knt.sort(function sort(a, b) { a = a['Experience']; b = b['Experience']; return a == b ? 0 : (a < b ? -1 : 1); });
				};
				if (Options.BulkScoutOptions.KnightPriority != 4) { // no knight - megaliths!
					params.kid = knt[0].ID; // will fail if no knights
				}
			}
			params.type = 4;
		}
		if (Options.BulkScoutOptions.Attack && Options.BulkScoutOptions.AttackPreset != 0) {
			for (var ui in CM.UNIT_TYPES) {
				var i = CM.UNIT_TYPES[ui];
				params["u" + i] = 0;
				if (Options.QuickMarchOptions.MarchPresets[Options.BulkScoutOptions.AttackPreset][i]) {
					params["u" + i] = parseIntNan(Options.QuickMarchOptions.MarchPresets[Options.BulkScoutOptions.AttackPreset][i]);
				}
			}

			var iused = new Array();
			for (var i = 0; i < QuickMarch.ItemList.length; i++) {
				if (Options.QuickMarchOptions.MarchPresets[Options.BulkScoutOptions.AttackPreset]["item" + QuickMarch.ItemList[i]] == true && Seed.items["i" + QuickMarch.ItemList[i]]) {
					iused.push(QuickMarch.ItemList[i]);
				}
			}
			params.items = iused.join(",");
		}
		else {
			params["u" + Options.BulkScoutOptions.ScoutType] = Options.BulkScoutOptions.NumScouts;
		}
		params.gold = 0;
		params.r1 = 0;
		params.r2 = 0;
		params.r3 = 0;
		params.r4 = 0;
		params.r5 = 0;

		params.champid = 0;
		if (Options.BulkScoutOptions.Attack && parseIntNan(Options.BulkScoutOptions.SendChamp) != 0) {
			citychamp = getCityChampion(cid);
			if (citychamp.championId && citychamp.status != "10") {
				params.champid = citychamp.championId;
			}
		}

		March.addMarch(params, function (rslt) {
			var t = Tabs.BulkScout;
			if (rslt.ok) {
				var extrainfo = '';
				if (cid != Cities.cities[Options.BulkScoutOptions.ScoutCity].id || Options.BulkScoutOptions.ClosestCity) { extrainfo += ' from ' + Cities.byID[cid].name; }
				if (Options.BulkScoutOptions.Attack) { t.UpdateDetails(x, y, tx('Attack sent') + extrainfo + '!', true); }
				else { t.UpdateDetails(x, y, tx('Scout sent') + extrainfo + '!', true); }
				t.UnselectEntry(x, y);
				if (Options.BulkScoutOptions.QuickScout) {
					ChatStuff.fetchmarch(rslt.marchId, t.QuickScoutResults);
				}
			}
			else {
				var msg = tx('March failed to send!');
				if (rslt.msg) msg = rslt.msg;
				if (rslt.error_code == 208 || rslt.error_code == 207 || rslt.error_code == 104) { // will never be able to send
					t.UpdateDetails(x, y, msg);
					t.UnselectEntry(x, y);
					// update search tab if coords exist and it's misted and target it truced..
					if (rslt.error_code == 208) {
						if (Tabs.Search && Tabs.Search.mapDat) {
							var numRows = Tabs.Search.mapDat.length;
							for (var i = 0; i < numRows; i++) {
								if (Tabs.Search.mapDat[i][0] == x && Tabs.Search.mapDat[i][1] == y) {
									if (Tabs.Search.mapDat[i][13]) {
										Tabs.Search.mapDat[i][6] = 0;
										Tabs.Search.mapDat[i][8] = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Target is truced - Cannot scout') + '!</span>';
										Tabs.Search.scouted++;
										Tabs.Search.updateMistProgress();
									}
									break;
								}
							}
						}
					}
				}
				else {
					if (Options.BulkScoutOptions.SkipErrors) {
						t.UpdateDetails(x, y, msg, true);
						t.UnselectEntry(x, y);
					} else {
						t.UpdateDetails(x, y, msg + ' ' + tx('Retrying') + '...', true);
					}
				}
			}
			if (notify) { notify(); }
		});
	},

	QuickScoutResults: function (rslt, rslt2, march) {
		var t = Tabs.BulkScout;

		var a = march;
		var totile = tileTypes[parseInt(a["toTileType"])];
		if (a["toTileType"] == 51) {
			if (!a["toPlayerId"]) { totile = "???"; }
			else { if (a["toPlayerId"] == 0) totile = 'Barb Camp'; }
		}
		totile = 'Lvl ' + a["toTileLevel"] + ' ' + totile;

		if (rslt2 && rslt2.userInfo) {
			u2 = rslt2.userInfo[0];
			var alli2 = 'None';
			if (u2.allianceName)
				alli2 = u2.allianceName + FormatDiplomacy(u2.allianceId);

			t.UpdateDetails(march.toXCoord, march.toYCoord, totile + ' - ' + uW.g_js_strings.commonstr.nametx + ': ' + PlayerLink(a.toPlayerId, u2.genderAndName) + ', ' + uW.g_js_strings.commonstr.alliance + ': ' + alli2, true);
		}
		else {
			t.UpdateDetails(march.toXCoord, march.toYCoord, totile, true);
		}

		// update misted search if it exists
		if (Tabs.Search && Tabs.Search.mapDat) {
			var numRows = Tabs.Search.mapDat.length;
			for (var i = 0; i < numRows; i++) {
				if (Tabs.Search.mapDat[i][0] == march.toXCoord && Tabs.Search.mapDat[i][1] == march.toYCoord) {
					if (Tabs.Search.mapDat[i][13]) {
						if (!rslt2) {
							QuickScout.FillSearchDiv({ errorMsg: "plain" }, march);
						}
						else {
							QuickScout.FillSearchDiv(rslt2, march);
						}
					}
					break;
				}
			}
		}
	},
}
