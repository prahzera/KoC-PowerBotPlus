/** Quick March Popup **/

var QuickMarch = {
	LoopCounter: 0,
	Options: {
		QuickMarchStartState: false,
		StartCoords: { x: '', y: '' },
		AutoKnight: false,
		AutoChamp: false,
		AutoSpell: false,
		AllTroops: false,
		MarchPresets: {},
	},
	SourceCity: {},
	MapX: null,
	MapY: null,
	MapC: null,
	MapLaunch: false,
	DestLookup: false,
	MapAjax: new CMapAjax(),
	Blocks: [],
	targetType: null,
	dcp0: null,
	dcp1: null,
	ItemList: [55, 57, 58, 931, 932, 59, 293, 294, 299],
	MaxTroops: 0,
	MaxLoad: 0,
	NextPresetNumber: 0,
	InitPresetNumber: 0,
	distance: 0,
	Food: 0,
	Wood: 0,
	Stone: 0,
	Ore: 0,
	Gold: 0,
	Aether: 0,

	init: function () {
		var t = QuickMarch;
		if (GlobalOptions.MarchPlusToggle) {
			AddPowerBarLink(tx('March+'), 'PBPMarchButton', function () { QuickMarch.ToggleQuickMarch(false); }, function (me) { ResetWindowPos(me, 'main_engagement_tabs', popMarch); });
		}

		// add new options to the context menu

		CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("portal"); // add portal to mists
		for (var a in CM.ContextMenuMapController.prototype.MapContextMenus) {
			for (var b in CM.ContextMenuMapController.prototype.MapContextMenus[a]) {
				CM.ContextMenuMapController.prototype.MapContextMenus[a][b].unshift("qmmod");
			}
		}

		var mod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo',
			[['default:', 'case "qmmod":' +
				' b.text = "' + tx('March+') + '"; b.color = "green"; ' +
				' b.action = function () { ' +
				' quickmarch(e); ' +
				' }; ' +
				' d.push(b); break; ' +
				' default: ']]);
		if (mod.isAvailable()) {
			mod.setEnable(true);
			// fix duplicate trade button
			var mod2 = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonTypes', [['d.buttons[0]', 'd.buttons[1]'], ['d.buttons.splice(0', 'd.buttons.splice(1']]);
			mod2.setEnable(true);
		}

		function FNQuickMarch(e) {
			QuickMarch.MapClick(e.tile.x, e.tile.y);
		}

		function ApplyingBoost() {
			var div = ById('btboostmsg');
			if (div) { div.innerHTML = tx('Applying Boost') + '...'; }
		}

		uWExportFunction('quickmarch', FNQuickMarch);
		uWExportFunction('QMspeedupSpell', QuickMarch.speedupSpell);
		uWExportFunction('btApplyingBoost', ApplyingBoost);

		DefaultWindowPos('btMarchPos', 'main_engagement_tabs');

		if (!Options.QuickMarchOptions) {
			Options.QuickMarchOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.QuickMarchOptions.hasOwnProperty(y)) {
					Options.QuickMarchOptions[y] = t.Options[y];
				}
			}
		}

		if (Options.QuickMarchOptions.QuickMarchStartState) {
			t.MapX = Options.QuickMarchOptions.StartCoords.x;
			t.MapY = Options.QuickMarchOptions.StartCoords.y;
			t.MapLaunch = true;
			t.ToggleQuickMarch(true);
		}
	},

	ToggleQuickMarch: function (init) {
		var t = QuickMarch;

		if (popMarch) {
			Options.QuickMarchOptions.QuickMarchStartState = popMarch.toggleHide(popMarch)
		}
		else {
			t.Food = 0;
			t.Wood = 0;
			t.Stone = 0;
			t.Ore = 0;
			t.Gold = 0;
			t.Aether = 0;

			m = '<div id=btMarchCoords align="center">';
			m += '<table align=center width=98% cellpadding=0 cellspacing=2 class=xtab style="padding-right:0px;"><tr><td style="padding-left:0px;padding-right:0px;"><div class=divHeader>&nbsp;' + tx('FROM') + '</div></td><td style="padding-left:0px;padding-right:0px;"><div class=divHeader>&nbsp;' + tx('TO') + '</div></td></tr>';
			m += '<tr><td width=50% style="border:1px solid;vertical-align:top;"><table cellpadding=0 cellspacing=0 width=100% class=xtab style="padding-left:6px;padding-right:0px;"><tr height=20><td colspan=3><span id=QMFromCity>&nbsp;</span></td></tr>';
			m += '<tr height=20><td colspan=3><a class=xlink id=QMSelClosest>' + tx('Select Closest City to Destination') + '</a></td></tr>';
			m += '<tr height=20><td colspan=2>' + tx('Rally Point') + ':&nbsp;<span id=QMRP>&nbsp;</span></td><td align=right>' + tx('Auto') + '</td></tr>';
			m += '<tr height=20><td width=50>' + uW.g_js_strings.commonstr.knight + '&nbsp;</td><td><SELECT id=QMKnight class=btInput style="max-width:160px;"></select></td><td align=right><INPUT type=checkbox id=QMAutoKnight ' + (Options.QuickMarchOptions.AutoKnight ? 'CHECKED' : '') + ' /></td></tr>';
			m += '<tr height=20><td>' + tx('Champ') + '&nbsp;</td><td><span id=QMChampSpan><SELECT id=QMChamp class=btInput style="max-width:160px;"></select></span><span id=QMNoChampSpan class=divHide>&nbsp;</span></td><td align=right><INPUT type=checkbox id=QMAutoChamp ' + (Options.QuickMarchOptions.AutoChamp ? 'CHECKED' : '') + ' /></td></tr>';
			m += '<tr height=40><td style="padding-top:2px;vertical-align:top;">' + tx('Spell') + '&nbsp;</td><td style="padding-top:2px;vertical-align:top;"><span id=QMSpellSpan><SELECT id=QMSpell class=btInput style="max-width:160px;"></select></span><span id=QMNoSpellSpan class=divHide>&nbsp;</span></td><td style="padding-top:2px;vertical-align:top;" align=right><INPUT type=checkbox id=QMAutoSpell ' + (Options.QuickMarchOptions.AutoSpell ? 'CHECKED' : '') + ' /></td></tr>';
			m += '</table></td><td width=50% style="border:1px solid;vertical-align:top;"><table cellpadding=0 cellspacing=0 width=100% class=xtab style="padding-left:6px;padding-right:0px;"><tr height=20><td>X:<input type=text class=btInput id=QMToX size=3>&nbsp;Y:<input type=text class=btInput id=QMToY size=3></td><td>' + tx('Dist') + ':&nbsp;<b><span id=QMDist>&nbsp;<span></b></td><td align=right><div id=QMLookupButtonDiv><a id=QMLookupButton class="inlineButton btButton brown8"><span>' + tx('Lookup') + '</span></a>&nbsp;<a id=QMMapButton class="inlineButton btButton brown8"><span>' + tx('Map') + '</span></a></div></td></tr>';
			m += '<tr height=20><td colspan=3 id=QMLookupInfo>&nbsp;</td></tr>';
			m += '<tr height=20><td colspan=3 id=QMTime>&nbsp;</td></tr>';
			m += '<tr height=20><td colspan=3><b>' + tx('Quick Links') + ':</b></td></tr>';
			m += '<tr height=20><td colspan=3><span id=QMToCity>&nbsp;</span></td></tr>';
			m += '<tr height=20><td width=50><a class=xlink title="' + tx('click to load bookmarks') + '" id=QMFetchBookmarks>' + tx('Bookmarks') + ':</a></td><td colspan=2><select title="' + tx('click text to load bookmarks') + '" id=QMBookmarks class=btInput style="max-width:180px;"></select></td></tr>';
			m += '<tr height=20><td><a class=xlink title="' + tx('click to load alliance city co-ords') + '" id=QMFetchAlliance>' + uW.g_js_strings.commonstr.alliance + ':</a></td><td colspan=2><select title="' + tx('click text to load alliance city co-ords') + '" id=QMAlliance class=btInput style="max-width:180px;"></select></td></tr>';
			m += '</table></td></tr></table></div>';
			m += '<div id=btMarchMessages align="center" style="height:30px;max-height:30px;overflow-y:auto;">&nbsp;</div>';
			m += '<div id=btMarchAction align="center"><input type=button id=QMScout value="' + uW.g_js_strings.commonstr.scout + '">&nbsp;<input type=button id=QMAttack value="' + uW.g_js_strings.commonstr.attack + '">&nbsp<input type=button id=QMReassign value="' + uW.g_js_strings.commonstr.reassign + '">&nbsp;<input type=button id=QMReinforce value="' + uW.g_js_strings.commonstr.reinforce + '">&nbsp;<input type=button id=QMReinforceFood value="' + uW.g_js_strings.commonstr.reinforce + ' + ' + tx("Max Food") + '">&nbsp;<input type=button id=QMTransport value="' + uW.g_js_strings.commonstr.transport + '">&nbsp;<input type=button id=QMRaid value="' + uW.g_js_strings.commonstr.raid + '"></div>';
			m += '<div id=btMarchPresets align="center" class=divHeader>' + tx('MARCH PRESETS') + '</div>';

			m += '<div><table class=xtab width=100%><tr><td><SELECT class="btSelector" style="width:190px;" id="QMMarchPreset" onchange="btSelectMarchPreset(this);"></select>&nbsp;<a id="btDeleteMarchPreset" class="inlineButton btButton brown8 disabled" onclick="btDelMarchPreset()"><span>' + uW.g_js_strings.commonstr.deletetx + '</span></a></td><td align=right>';
			m += tx('New Name') + ':&nbsp;<INPUT class=btInput id=QMPresetName type=text style="width:190px;" maxlength=20 value=""\>&nbsp;<a id="btSaveMarchPreset" class="inlineButton btButton brown8" onclick="btSaveMarchPreset()"><span>' + tx('Save') + '</span></a></td></tr></table></div>';

			m += '<div id=btMarchMain align="center"><table align=center width=100% cellpadding=0 cellspacing=1 class=xtab style="padding-right:0px;"><tr><td style="padding-left:0px;"><div class=divHeader><table cellpadding=0 cellspacing=0 width=100% class=xtab><tr><td align=left>' + tx('TROOPS') + '</td><td id=QMTroopHeader align=right>&nbsp;</td></tr></table></div></td><td style="padding-left:0px;"><div class=divHeader><table cellpadding=0 cellspacing=0 width=100% class=xtab><tr><td align=left>' + tx('RESOURCES') + '</td><td id=QMResourceHeader align=right>&nbsp;</td></tr></table></div></td></tr>';
			m += '<tr><td width=50% style="vertical-align:top;"><table cellpadding=0 cellspacing=0 width=98% class=xtab>';

			var r = 0;
			var QMTroops = '<div id=QMMarchMightDiv style="text-align:center;" class=divHide>' + tx('Selected Troop Might') + ':&nbsp;<span id=QMMarchMight>&nbsp;</span></div><table cellpadding=1 cellspacing=0 class=xtab align=left><tr><td colspan=2><input type=checkbox id=QMAllTroops ' + (Options.QuickMarchOptions.AllTroops ? 'CHECKED' : '') + ' /><b>' + tx("All Troops") + '</b></td><td><a class=xlink id=QMResetTroops>' + tx('Reset Troops') + '</a></td></tr>';
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				QMTroops += '<tr id="QMTroopRow' + i + '" class="' + rowClass + '"><td style="padding-left:0px;width:20px;" align=right>' + TroopImage(i) + '</td><td style="width:100px;" id="QMTotalUnit' + i + '" align=left>&nbsp;</td><td align=left><input style="width:60px;" class=btInput id="QMMarchUnit' + i + '" type=text maxlength=7 value=0 ></td><td align=left><input style="height:20px;font-size:9px;" id="QMMaxUnit' + i + '" type=button value="' + uW.g_js_strings.commonstr.max + '"></td></tr>';
			}
			m += '</table><tr><td style="padding-left:5px;vertical-align:top;">' + QMTroops + '</td></tr>';

			m += '</table></td><td width=50% style="vertical-align:top;padding-left:0px;padding-right:0px;"><table cellpadding=0 cellspacing=0 width=98% class=xtab>';

			var QMRes = '<table class=xtab align=center><tr><td>&nbsp;</td><td><a class=xlink id=QMResetResources>' + tx('Reset Resources') + '</a></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="' + GoldImage + '" /></td><td><span id=QMTotalGold>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchGold type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxGold type=button value="' + uW.g_js_strings.commonstr.max + '"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="' + FoodImage + '" /></td><td><span id=QMTotalFood>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchFood type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxFood type=button value="' + uW.g_js_strings.commonstr.max + '"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="' + WoodImage + '" /></td><td><span id=QMTotalWood>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchWood type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxWood type=button value="' + uW.g_js_strings.commonstr.max + '"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="' + StoneImage + '" /></td><td><span id=QMTotalStone>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchStone type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxStone type=button value="' + uW.g_js_strings.commonstr.max + '"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="' + OreImage + '" /></td><td><span id=QMTotalOre>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchOre type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxOre type=button value="' + uW.g_js_strings.commonstr.max + '"></td></tr>';
			QMRes += '<tr><td rowspan=2><img src="' + AetherImage + '" /></td><td><span id=QMTotalAether>&nbsp;</span></td></tr>';
			QMRes += '<tr style="height:30px;vertical-align:top;"><td><INPUT class=btInput id=QMMarchAether type=text size=11 maxlength=20 value=0\><input style="height:20px;font-size:9px;" id=QMMaxAether type=button value="' + uW.g_js_strings.commonstr.max + '"></td></tr>';
			QMRes += '</table>';
			m += '<tr><td style="vertical-align:top;">' + QMRes + '</td></tr>';

			m += '</table><div class=divHeader>&nbsp;' + tx('BOOSTS') + '</div>';

			var QMBoosts = '<table width=100% class=xtab align=left cellpadding=0 cellspacing=0><tr><td align=left>&nbsp;' + tx('March Speed') + ':&nbsp;<b><span id=QMMarchSpeed>&nbsp;</span></b></td><td align=right>&nbsp;' + tx('March Size') + ':&nbsp;<b><span id=QMMarchSize>&nbsp;</span></b></td></tr></table>';
			QMBoosts += '<table class=xtab align=left cellpadding=0 cellspacing=0><tr>';
			for (var i = 0; i < 5; i++) {
				QMBoosts += '<td rowspan=2><img height=28 src="' + IMGURL + 'items/30/' + t.ItemList[i] + '.jpg" title="' + itemTitle(t.ItemList[i], true) + '" /></td><td>&nbsp;</td>';
			}
			QMBoosts += '</tr><tr>';
			for (var i = 0; i < 5; i++) {
				QMBoosts += '<td><input type=checkbox id="QMItem' + t.ItemList[i] + '"></td>';
			}
			QMBoosts += '</tr><tr>';
			for (var i = 0; i < 5; i++) {
				QMBoosts += '<td colspan=2><span id="QMItemCount' + t.ItemList[i] + '">(' + uW.ksoItems[t.ItemList[i]].count + ')</span></td>';
			}
			QMBoosts += '</tr></table>';
			QMBoosts += '<table class=xtab align=left cellpadding=0 cellspacing=0><tr>';
			for (var i = 5; i < t.ItemList.length; i++) {
				if (uW.itemlist["i" + t.ItemList[i]]) {
					QMBoosts += '<td rowspan=2><img height=28 src="' + IMGURL + 'items/30/' + t.ItemList[i] + '.jpg" title="' + itemTitle(t.ItemList[i], true) + '" /></td><td>&nbsp;</td>';
				}
			}
			QMBoosts += '</tr><tr>';
			for (var i = 5; i < t.ItemList.length; i++) {
				if (uW.itemlist["i" + t.ItemList[i]]) {
					QMBoosts += '<td><input type=checkbox id="QMItem' + t.ItemList[i] + '"></td>';
				}
			}
			QMBoosts += '</tr><tr>';
			for (var i = 5; i < t.ItemList.length; i++) {
				if (uW.itemlist["i" + t.ItemList[i]]) {
					QMBoosts += '<td colspan=2><span id="QMItemCount' + t.ItemList[i] + '">(' + uW.ksoItems[t.ItemList[i]].count + ')</span></td>';
				}
			}
			QMBoosts += '</tr></table>';
			QMBoosts += '<table width=100% class=xtab cellpadding=0 cellspacing=0 align=left><tr><td style="padding-right:0px;"><div id=QMTimedBoosts>&nbsp;</div></td></tr></table>';

			m += QMBoosts + '</td></tr></table></div><br>';

			popMarch = new CPopup('btQuickMarch', Options.btMarchPos.x, Options.btMarchPos.y, 620, 870, true, QuickMarch.close);
			popMarch.getMainDiv().innerHTML = m;
			popMarch.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('March+') + '</B></DIV>';

			ById("QMAutoKnight").addEventListener('click', function () {
				Options.QuickMarchOptions.AutoKnight = this.checked;
				saveOptions();
				if (Options.QuickMarchOptions.AutoKnight)
					t.BuildKnightSelect();
			}, false);
			ById("QMAutoChamp").addEventListener('click', function () {
				Options.QuickMarchOptions.AutoChamp = this.checked;
				saveOptions();
				if (Options.QuickMarchOptions.AutoChamp)
					t.BuildChampSelect();
			}, false);
			ById("QMAutoSpell").addEventListener('click', function () {
				Options.QuickMarchOptions.AutoSpell = this.checked;
				saveOptions();
				if (Options.QuickMarchOptions.AutoSpell)
					t.BuildSpellSelect();
			}, false);

			ById("QMSpell").addEventListener('click', function () {
				t.CalcMarchTime();
			}, false);

			var FromCityId = uW.currentcityid;
			if (init && Cities.byID[InitialCityId]) {
				FromCityId = InitialCityId;
			}

			t.dcp0 = new CdispCityPicker('QMCastles0', ById('QMFromCity'), true, t.FromCityClick, Cities.byID[FromCityId].idx);
			t.dcp1 = new CdispCityPicker('QMCastles1', ById('QMToCity'), true, t.DestinationChanged).bindToXYboxes(ById("QMToX"), ById("QMToY"));

			for (var i = 0; i < Cities.numCities; i++) {
				ById('QMCastles0_' + i).addEventListener('mouseover', function () { CityResourceHint(this, this.id.substring(11)); }, false);
				ById('QMCastles0_' + i).addEventListener('mouseout', function () { CityResourceHintOff(this); }, false);
				ById('QMCastles1_' + i).addEventListener('mouseover', function () { CityResourceHint(this, this.id.substring(11)); }, false);
				ById('QMCastles1_' + i).addEventListener('mouseout', function () { CityResourceHintOff(this); }, false);
			}

			ById('QMToX').addEventListener('change', t.DestinationChanged, false);
			ById('QMToY').addEventListener('change', t.DestinationChanged, false);

			ById('QMSelClosest').addEventListener('click', t.SelectClosest, false);
			ById('QMLookupButton').addEventListener('click', t.LookupMapTile, false);
			ById('QMMapButton').addEventListener('click', t.GotoMapTile, false);

			ById('QMFetchAlliance').addEventListener('click', function () {
				var myA = getMyAlliance();
				if (myA[0] != 0) {
					var params = uW.Object.clone(uW.g_ajaxparams);
					params.page = 1;
					params.perPage = 100;
					params.allianceId = myA[0];
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserLeaderboard.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							if (rslt.ok) {
								var m = "";
								for (var i = 0; i < rslt.results.length; i++) {
									p = rslt.results[i];
									if (p.userId != 0) {
										for (var c = 0; c < p.cities.length; c++) {
											if (Seed.player.name != p.displayName) {
												m += "<option value='" + p.cities[c].xCoord + "," + p.cities[c].yCoord + "'>" + p.displayName + " - " + p.cities[c].cityName + " (" + p.cities[c].xCoord + "," + p.cities[c].yCoord + ")</option>";
											}
										}
									}
								}
								ById('QMAlliance').innerHTML = "<option value=''>-- " + tx('Select Member') + " --</option>" + m;
							}
						},
						onFailure: function () { ById('QMAlliance').innerHTML = "<option>" + tx('Server Error') + "</option>"; },
					}, true);
				} else {
					ById('QMAlliance').innerHTML = "<option>" + tx('No Alliance') + "!</option>";
				}
			}, false);

			ById('QMAlliance').addEventListener('change', function () {
				if (this.value != '') {
					var val = this.value;
					var x = val.substr(0, val.lastIndexOf(','));
					var y = val.substr(val.lastIndexOf(',') + 1, val.length);
					ById('QMToX').value = x;
					ById('QMToY').value = y;
					t.DestinationChanged();
				}
			}, false);

			ById('QMFetchBookmarks').addEventListener('click', function () {
				FillBookmarkList('QMBookmarks');
			}, false);

			ById('QMBookmarks').addEventListener('change', function () {
				if (this.value != '') {
					var val = this.value;
					var x = val.substr(0, val.lastIndexOf(','));
					var y = val.substr(val.lastIndexOf(',') + 1, val.length);
					ById('QMToX').value = x;
					ById('QMToY').value = y;
					t.DestinationChanged();
				}
			}, false);

			if (t.MapLaunch) {
				ById('QMToX').value = t.MapX;
				ById('QMToY').value = t.MapY;
				if (t.MapC) { t.dcp0.selectBut(t.MapC); }
				t.DestinationChanged();
			}
			else {
				if (ById('maparea_map').style.display != "none") {
					ById('QMToX').value = ById('mapXCoor').value;
					ById('QMToY').value = ById('mapYCoor').value;
					t.DestinationChanged();
				}
			}

			var x = parseInt(ById('QMToX').value);
			var y = parseInt(ById('QMToY').value);
			if (isNaN(x) || isNaN(y)) { ById('QMLookupButtonDiv').style.display = 'none'; }

			t.LoadMarchPresets();

			ById("QMAllTroops").addEventListener('click', function () {
				Options.QuickMarchOptions.AllTroops = this.checked;
				saveOptions();
				t.RepaintMarchData();
			}, false);

			ById("QMResetTroops").addEventListener('click', function () {
				for (var ui in CM.UNIT_TYPES) ById("QMMarchUnit" + CM.UNIT_TYPES[ui]).value = 0;
				t.RepaintMarchData();
				t.PaintMarchSizeInfo();
				t.PaintLoadInfo();
				t.CalcMarchTime();
			}, false);

			ById("QMResetResources").addEventListener('click', function () {
				ById('QMMarchGold').value = 0;
				ById('QMMarchFood').value = 0;
				ById('QMMarchWood').value = 0;
				ById('QMMarchStone').value = 0;
				ById('QMMarchOre').value = 0;
				ById('QMMarchAether').value = 0;

				t.Food = 0;
				t.Wood = 0;
				t.Stone = 0;
				t.Ore = 0;
				t.Gold = 0;
				t.Aether = 0;

				t.PaintLoadInfo();
			}, false);

			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				ById("QMMaxUnit" + i).addEventListener('click', function () {
					var MarchUnit = this.id.replace("QMMaxUnit", "QMMarchUnit");
					var TotalUnits = parseIntNan(Seed.units["city" + t.SourceCity.id]['unt' + this.id.split("QMMaxUnit")[1]]);
					t.GetMaxMarchSize();
					ById(MarchUnit).value = 0;
					var NumUnits = 0;
					for (var ui in CM.UNIT_TYPES) {
						NumUnits += parseIntNan(ById("QMMarchUnit" + CM.UNIT_TYPES[ui]).value);
					}
					var FreeUnits = parseInt(t.MaxTroops - NumUnits);
					if (FreeUnits < 0) FreeUnits = 0;
					if (TotalUnits >= FreeUnits) {
						ById(MarchUnit).value = FreeUnits;
					} else {
						ById(MarchUnit).value = TotalUnits;
					}
					t.PaintMarchSizeInfo();
					t.PaintLoadInfo();
					t.CalcMarchTime();
				}, false);
				ById("QMMarchUnit" + i).addEventListener('change', function () {
					t.PaintMarchSizeInfo();
					t.PaintLoadInfo();
					t.CalcMarchTime();
				}, false);
			}

			ById('QMMaxGold').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Gold = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Stone + t.Ore + t.Aether), t.MaxGold);
				ById('QMMarchGold').value = t.Gold;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxFood').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Food = Math.min(t.MaxLoad - (t.Wood + t.Stone + t.Ore + t.Gold + t.Aether), t.MaxFood);
				ById('QMMarchFood').value = t.Food;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxWood').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Wood = Math.min(t.MaxLoad - (t.Food + t.Stone + t.Ore + t.Gold + t.Aether), t.MaxWood);
				ById('QMMarchWood').value = t.Wood;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxStone').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Stone = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Ore + t.Gold + t.Aether), t.MaxStone);
				ById('QMMarchStone').value = t.Stone;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxOre').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Ore = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Stone + t.Gold + t.Aether), t.MaxOre);
				ById('QMMarchOre').value = t.Ore;
				t.PaintLoadInfo();
			}, false);
			ById('QMMaxAether').addEventListener('click', function () {
				t.CalcMaxLoad();
				t.Aether = Math.min(t.MaxLoad - (t.Food + t.Wood + t.Stone + t.Ore + t.Gold), t.MaxAether * 5);
				ById('QMMarchAether').value = Math.floor(t.Aether / 5);
				t.PaintLoadInfo();
			}, false);

			ById('QMMarchGold').addEventListener('change', function () {
				t.Gold = parseIntNan(ById('QMMarchGold').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchFood').addEventListener('change', function () {
				t.Food = parseIntNan(ById('QMMarchFood').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchWood').addEventListener('change', function () {
				t.Wood = parseIntNan(ById('QMMarchWood').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchStone').addEventListener('change', function () {
				t.Stone = parseIntNan(ById('QMMarchStone').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchOre').addEventListener('change', function () {
				t.Ore = parseIntNan(ById('QMMarchOre').value);
				t.PaintLoadInfo();
			}, false);
			ById('QMMarchAether').addEventListener('change', function () {
				t.Aether = parseIntNan(ById('QMMarchAether').value) * 5;
				t.PaintLoadInfo();
			}, false);

			ById("QMItem931").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem932").checked = false;
				}
				t.PaintMarchSizeInfo();
			}, false);

			ById("QMItem932").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem931").checked = false;
				}
				t.PaintMarchSizeInfo();
			}, false);

			ById("QMItem59").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem58").checked = false;
					ById("QMItem57").checked = false;
					ById("QMItem55").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem58").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem59").checked = false;
					ById("QMItem57").checked = false;
					ById("QMItem55").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem57").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem59").checked = false;
					ById("QMItem58").checked = false;
					ById("QMItem55").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem55").addEventListener('click', function (e) {
				if (e.target.checked) {
					ById("QMItem59").checked = false;
					ById("QMItem58").checked = false;
					ById("QMItem57").checked = false;
				}
				t.CalcMarchTime();
			}, false);

			ById("QMItem293").addEventListener('click', function (e) {
				if (e.target.checked) {
					//					ById("QMItem294").checked = false;
				}
			}, false);

			ById("QMItem294").addEventListener('click', function (e) {
				if (e.target.checked) {
					//					ById("QMItem293").checked = false;
				}
			}, false);

			ById("QMTransport").addEventListener('click', function () {
				t.DoMarch(1);
			}, false);
			ById("QMReinforce").addEventListener('click', function () {
				t.DoMarch(2);
			}, false);
			ById("QMReinforceFood").addEventListener('click', function () {
				t.DoMarch(2, true);
			}, false);
			ById("QMScout").addEventListener('click', function () {
				t.DoMarch(3);
			}, false);
			ById("QMAttack").addEventListener('click', function () {
				t.DoMarch(4);
			}, false);
			ById("QMReassign").addEventListener('click', function () {
				t.DoMarch(5);
			}, false);
			ById("QMRaid").addEventListener('click', function () {
				t.AddRaid();
			}, false);

			t.RefreshTimedBoosts();

			if (Options.ShowMarchMight) {
				jQuery('#QMMarchMightDiv').removeClass('divHide');
			}

			popMarch.show(true);
			ResetFrameSize('btQuickMarch', 870, 620);
			Options.QuickMarchOptions.QuickMarchStartState = true;
			t.MapLaunch = false;
		}
		saveOptions();
	},

	close: function () {
		Options.QuickMarchOptions.QuickMarchStartState = false;
		Options.btMarchPos = popMarch.getLocation();
		saveOptions();
		popMarch = null;
	},

	GotoMapTile: function () {
		var t = QuickMarch;
		var x = parseInt(ById('QMToX').value);
		var y = parseInt(ById('QMToY').value);
		if (isNaN(x) || isNaN(y)) return;
		GotoMap(x, y);
	},

	LookupMapTile: function () {
		var t = QuickMarch;

		t.targetType = null;

		ById("QMLookupInfo").innerHTML = '';

		var x = parseInt(ById('QMToX').value);
		var y = parseInt(ById('QMToY').value);
		if (isNaN(x) || isNaN(y)) return;

		ById("QMLookupInfo").innerHTML = tx('Searching') + '...';

		t.Blocks = t.MapAjax.generateBlockList(x, y, 1);
		var blockString = t.Blocks.join("%2C");
		t.MapAjax.LookupMap(blockString, function (rslt) {
			t.DestLookup = false;
			if (!rslt.ok) {
				if (rslt.BotCode && rslt.BotCode == 999) { ById("QMLookupInfo").innerHTML = tx('Captcha!'); }
				else { ById("QMLookupInfo").innerHTML = tx('Error!'); }
				return;
			}

			var map = rslt.data;
			for (var k in map) {
				if (x == map[k].xCoord && y == map[k].yCoord) {
					var m = "";
					var uid = map[k].tileUserId;
					var cid = map[k].tileCityId;
					var typeid = map[k].tileType;
					t.targetType = typeid;
					t.CalcMarchTime(); // for megaliths march time is different
					var tiletype = tileTypes[parseInt(typeid)];
					var subtype = map[k].premiumTile;
					if (typeid == 50 && subtype == 1) {
						m = tx('Alliance HQ') + '&nbsp;(' + map[k].allianceHq.allianceName + ')';
						ById("QMLookupInfo").innerHTML = m;
					}
					else {
						var misted = map[k].misted;
						var lvl = parseIntNan(map[k].tileLevel);
						if (!uid || uid == 0 || uid == "0") {
							if (typeid == 51) { tiletype = tx('Barb Camp'); }
							m = tiletype;
							if (misted) {
								m = uW.g_js_strings.commonstr.level + '&nbsp;' + lvl + '&nbsp;' + m + '&nbsp;(' + tx('Owner Misted') + ')';
								ById("QMLookupInfo").innerHTML = m;
							}
							else {
								if (typeid == 53) {
									m += '&nbsp;' + tx('or plain') + '&nbsp;&nbsp;&nbsp;<span id=QMDefendStatus>&nbsp;</span>';
									ById("QMLookupInfo").innerHTML = m;
									getDefendStatus(x, y, ById('QMDefendStatus'), true);
								}
								else {
									if (lvl != 0) {
										m = uW.g_js_strings.commonstr.level + '&nbsp;' + lvl + '&nbsp;' + m;
									}
									ById("QMLookupInfo").innerHTML = m;
								}
							}
						}
						else { // lookup user
							var params = uW.Object.clone(uW.g_ajaxparams);
							params.checkArr = uid;
							new MyAjaxRequest(uW.g_ajaxpath + "ajax/getOnline.php" + uW.g_ajaxsuffix, {
								method: "post",
								parameters: params,
								onSuccess: function (rslt) {
									var p = rslt.data;
									var params = uW.Object.clone(uW.g_ajaxparams);
									params.pid = uid;
									new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
										method: "post",
										parameters: params,
										onSuccess: function (rslt) {
											if (rslt.ok) {
												m = MonitorLink(rslt.playerInfo.userId, rslt.playerInfo.displayName);
												if (p[uid])
													m += '&nbsp;<span style="color:#f00;"><b>(' + uW.g_js_strings.commonstr.online.toUpperCase() + ')</b></span>';
												if (typeid == 51) {
													m += '&nbsp;&nbsp;&nbsp;<span id=QMDefendStatus>&nbsp;</span>';
													ById("QMLookupInfo").innerHTML = m;
													getDefendStatus(x, y, ById('QMDefendStatus'), true);
												}
												else {
													m += '&nbsp;' + uW.g_js_strings.commonstr.level + '&nbsp;' + lvl + '&nbsp;' + tiletype;
													ById("QMLookupInfo").innerHTML = m;
												}
											}
										},
									});
								},
							});
						}
					}
					return;
				}
			}
			ById("QMLookupInfo").innerHTML = tx('No Data');
		}, true); // ignore delay
	},

	RefreshItemCounts: function () {
		var t = QuickMarch;
		for (var i = 0; i < t.ItemList.length; i++) {
			if (ById('QMItemCount' + t.ItemList[i])) ById('QMItemCount' + t.ItemList[i]).innerHTML = '(' + uW.ksoItems[t.ItemList[i]].count + ')';
		}
	},

	RefreshTimedBoosts: function () {
		var t = QuickMarch;

		ById('QMMarchSpeed').innerHTML = Math.floor(equippedthronestats(67) + equippedthronestats(163)) + '%';
		ById('QMMarchSize').innerHTML = Math.floor(equippedthronestats(66) + equippedthronestats(163)) + '%';

		var now = unixTime();
		Bags = Seed.items.i276;
		SturdyBags = Seed.items.i277;
		HeavyBags = Seed.items.i278;

		var loadboost = '<span style="color:#f00"><b>' + uW.g_js_strings.commonstr.none + '!</b></span>';
		if (Seed.playerEffects.loadExpire > now) {
			loadboost = '<span style="color:#080"><b>25% for ' + uW.timestr(Seed.playerEffects.loadExpire - now) + '</b></span>';
		}

		var QMLoad = '<table width=100% align=left class=xtab><tr><td>' + tx('Load') + ':&nbsp;</td><td>' + loadboost + '</td><td align=right style="padding-right:0px;"><table class=xtab style="padding-right:0px;" cellpadding=0 cellspacing=1><tr>';
		if (Bags) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'276\')"><img height=28 class=btTop src="' + BagImage + '" title="' + itemTitle(276) + '"></a></td>';
		}
		if (SturdyBags) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'277\')"><img height=28 class=btTop src="' + SturdyBagImage + '" title="' + itemTitle(277) + '"></a></td>';
		}
		if (HeavyBags) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'278\')"><img height=28 class=btTop src="' + HeavyBagImage + '" title="' + itemTitle(278) + '"></a></td>';
		}
		QMLoad += '</tr></table></td></tr>';

		Authority = Seed.items.i285;
		Dominion = Seed.items.i286;

		var sizeboost = '<span style="color:#f00"><b>' + uW.g_js_strings.commonstr.none + '!</b></span>';
		ById("QMItem931").disabled = false;
		ById("QMItem932").disabled = false;
		if (Seed.playerEffects.auras2Expire && Seed.playerEffects.auras2Expire > now) {
			sizeboost = '<span style="color:#080"><b>30% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.auras2Expire - now) + '</b></span>';
			ById("QMItem931").checked = false;
			ById("QMItem932").checked = false;
			ById("QMItem931").disabled = true;
			ById("QMItem932").disabled = true;
		}
		else {
			if (Seed.playerEffects.aurasExpire && Seed.playerEffects.aurasExpire > now) {
				sizeboost = '<span style="color:#f80"><b>15% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.aurasExpire - now) + '</b></span>';
				ById("QMItem931").checked = false;
				ById("QMItem932").checked = false;
				ById("QMItem931").disabled = true;
				ById("QMItem932").disabled = true;
			}
		}
		QMLoad += '<tr><td>' + tx('Size') + ':&nbsp;</td><td>' + sizeboost + '</td><td style="padding-right:0px;" align=right><table class=xtab style="padding-right:0px;" cellpadding=0 cellspacing=1><tr>';
		if (Authority) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'285\')"><img height=28 class=btTop src="' + AuthorityImage + '" title="' + itemTitle(285) + '"></a></td>';
		}
		if (Dominion) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'286\')"><img height=28 class=btTop src="' + DominionImage + '" title="' + itemTitle(286) + '"></a></td>';
		}
		QMLoad += '</tr></table></td></tr>';

		BlueEagle = Seed.items.i279;

		var speedboost = '<span style="color:#f00"><b>' + uW.g_js_strings.commonstr.none + '!</b></span>';
		if (Seed.playerEffects.returnExpire && Seed.playerEffects.returnExpire > now) {
			speedboost = '<span style="color:#080"><b>50% ' + uW.g_js_strings.commonstr.fortxl + ' ' + uW.timestr(Seed.playerEffects.returnExpire - now) + '</b></span>';
		}
		QMLoad += '<tr><td>' + tx('Return') + ':&nbsp;</td><td>' + speedboost + '</td><td style="padding-right:0px;" align=right><table class=xtab style="padding-right:0px;" cellpadding=0 cellspacing=1><tr>';
		if (BlueEagle) {
			QMLoad += '<td><a onClick="btApplyingBoost();cm.ItemController.use(\'279\')"><img height=28 class=btTop src="' + BlueEagleImage + '" title="' + itemTitle(279) + '"></a></td>';
		}
		QMLoad += '</tr></table></td></tr>';

		QMLoad += '</table>';

		ById('QMTimedBoosts').innerHTML = '<div align=center id=btboostmsg>&nbsp;</div>' + QMLoad;

		// check champ status

		if (jQuery('#QMChampSpan').hasClass('divHide')) {
			citychamp = getCityChampion(t.SourceCity.id);
			if (citychamp.championId && citychamp.status != "10") {
				t.BuildChampSelect();
			}
		}

		// check spell cooldown

		if (jQuery('#QMSpellSpan').hasClass('divHide')) {
			var spells = getSpellData(t.SourceCity.id);
			if (spells.spellavailable) {
				if (spells.cooldownactive) {
					if (ById('QMCoolTime')) { ById('QMCoolTime').innerHTML = spells.cooldown; }
				}
				else { t.BuildSpellSelect(); }
			}
		}
	},

	GetMaxMarchSize: function () {
		var t = QuickMarch;
		var e = 1;
		var f = uW.unixtime();
		var koth = false;
		if (t.targetType == 57) { koth = true; }

		var elem = ById("QMItem931");
		var elem2 = ById("QMItem932");
		if (elem2 && elem2.checked && parseInt(Seed.items["i932"]) > 0) { e = 1.5; }
		else {
			if (elem && elem.checked && parseInt(Seed.items["i931"]) > 0) { e = 1.25; }
		}

		// timed auras take priority

		if (Seed.playerEffects.auras2Expire && Seed.playerEffects.auras2Expire > f) { e = 1.3 }
		else {
			if (Seed.playerEffects.aurasExpire && Seed.playerEffects.aurasExpire > f) { e = 1.15 }
		}

		//(var trmarchsizebuff = Math.min(equippedthronestats(66),uW.cm.thronestats.boosts.MarchSize.Max);
		var trmarchsizebuff = Math.min(equippedthronestats(66) + equippedthronestats(163), uW.cm.thronestats.boosts.MarchSize.Max);
		if (trmarchsizebuff > 0)
			e *= (1 + trmarchsizebuff / 100);
		if (Seed.cityData.city[t.SourceCity.id].isPrestigeCity) {
			var b = Seed.cityData.city[t.SourceCity.id].prestigeInfo.prestigeLevel;
			var r = CM.WorldSettings.getSetting("ASCENSION_RALLYPOINT_BOOST");
			var m = JSON.parse(r);
			var u = 1;
			if (m.values[b - 1]) {
				u = m.values[b - 1][1];
			}
			var k = parseFloat(u);
			e *= k
			if (Seed.cityData.city[t.SourceCity.id].prestigeInfo.blessings.indexOf(207) != -1) { e *= 1.1; }
		}
		if (koth) { e = 1; }
		var RallyPointLevel = parseInt(getUniqueCityBuilding(t.SourceCity.id, 12).maxLevel);
		t.MaxTroops = Math.round(RallyPointLevel * 10000 * e - 0.001);
		if (RallyPointLevel == 11) { t.MaxTroops = Math.round(150000 * e - 0.001); }
		if (RallyPointLevel == 12) { t.MaxTroops = Math.round(200000 * e - 0.001); }
		if (RallyPointLevel == 13) { t.MaxTroops = Math.round(215000 * e - 0.001); }
		if (RallyPointLevel == 14) { t.MaxTroops = Math.round(250000 * e - 0.001); }
		if (RallyPointLevel == 15) { t.MaxTroops = Math.round(275000 * e - 0.001); }

		var domainBoosterBonus = 1;
		if (CM.WorldSettings.hasSetting('DOMAIN_BOOST_RALLYPIONT')) {
			domainBoosterBonus = parseInt(CM.WorldSettings.getSetting("DOMAIN_BOOST_RALLYPIONT"));
			t.MaxTroops *= domainBoosterBonus;
		}

	},

	PaintMarchSizeInfo: function () {
		var t = QuickMarch;
		t.CheckMarchNumbers();
		t.GetMaxMarchSize();
		var NumUnits = 0;
		var MarchMight = 0;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			var TroopUnits = parseIntNan(ById("QMMarchUnit" + i).value);
			NumUnits += TroopUnits;
			MarchMight += (TroopUnits * parseInt(uW.unitmight["unt" + i]));
		}
		if (NumUnits > t.MaxTroops)
			ById('QMTroopHeader').innerHTML = '<SPAN class=boldRed><B>' + addCommas(NumUnits) + ' / ' + addCommas(t.MaxTroops) + '</b></span>';
		else
			ById('QMTroopHeader').innerHTML = addCommas(NumUnits) + ' / ' + addCommas(t.MaxTroops);

		ById('QMMarchMight').innerHTML = addCommas(MarchMight);
	},

	PaintLoadInfo: function () {
		var t = QuickMarch;
		t.CalcMaxLoad();
		var Resources = t.Food + t.Wood + t.Stone + t.Ore + t.Gold + t.Aether;
		if (Resources > t.MaxLoad)
			ById('QMResourceHeader').innerHTML = '<SPAN class=boldRed><B>' + addCommas(Resources) + ' / ' + addCommas(t.MaxLoad) + '</b></span>';
		else
			ById('QMResourceHeader').innerHTML = addCommas(Resources) + ' / ' + addCommas(t.MaxLoad);
	},

	PaintRallyPoint: function () {
		var t = QuickMarch;
		cityId = t.SourceCity.id;
		var marches = March.getMarchSlots(cityId);
		var maxmarches = March.getTotalSlots(cityId);
		if (marches >= maxmarches)
			ById('QMRP').innerHTML = '<SPAN class=boldRed><B>' + marches + '/' + maxmarches + '</b></span>';
		else
			ById('QMRP').innerHTML = marches + '/' + maxmarches;
	},

	RepaintMarchData: function (ignoreTT) {
		var t = QuickMarch;

		var r = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var troopnum = parseIntNan(Seed.units["city" + t.SourceCity.id]['unt' + i]);
			if (troopnum > 0) {
				var ritual = false;
				for (var sacIndex = 0; sacIndex < Seed.queue_sacr["city" + t.SourceCity.id].length; sacIndex++) {
					if (Seed.queue_sacr["city" + t.SourceCity.id][sacIndex]["unitType"] == i) {
						ritual = true;
					}
				}
				if (ritual) {
					ById('QMTotalUnit' + i).innerHTML = '<SPAN style="color:#080"><B>' + addCommas(troopnum) + '</B></SPAN>';
				}
				else {
					ById('QMTotalUnit' + i).innerHTML = addCommas(troopnum);
				}
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
			}
			else {
				ById('QMTotalUnit' + i).innerHTML = '';
				if (Options.QuickMarchOptions.AllTroops || parseIntNan(ById('QMMarchUnit' + i).value) != 0) {
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
				}
				else { rowClass = 'divHide'; }
			}
			ById('QMTroopRow' + i).className = rowClass;
		}

		t.MaxFood = parseInt(Seed.resources["city" + t.SourceCity.id]['rec1'][0] / 3600);
		t.MaxWood = parseInt(Seed.resources["city" + t.SourceCity.id]['rec2'][0] / 3600);
		t.MaxStone = parseInt(Seed.resources["city" + t.SourceCity.id]['rec3'][0] / 3600);
		t.MaxOre = parseInt(Seed.resources["city" + t.SourceCity.id]['rec4'][0] / 3600);
		t.MaxAether = parseInt(Seed.resources["city" + t.SourceCity.id]['rec5'][0]);
		t.MaxGold = parseInt(Seed.citystats["city" + t.SourceCity.id]['gold'][0]);

		ById('QMTotalGold').innerHTML = addCommas(t.MaxGold);
		ById('QMTotalFood').innerHTML = addCommas(t.MaxFood);
		ById('QMTotalWood').innerHTML = addCommas(t.MaxWood);
		ById('QMTotalStone').innerHTML = addCommas(t.MaxStone);
		ById('QMTotalOre').innerHTML = addCommas(t.MaxOre);
		ById('QMTotalAether').innerHTML = addCommas(t.MaxAether);

		var cityExpTime = Seed.cityData.city[t.SourceCity.id].prestigeInfo.prestigeBuffExpire;
		if (cityExpTime && cityExpTime > unixTime()) {
			ById("QMAttack").style.color = '#f00';
			ById("QMScout").style.color = '#f00';
		}
		else {
			ById("QMAttack").style.color = '#000';
			ById("QMScout").style.color = '#000';
		}

		t.PaintRallyPoint();
		ResetFrameSize('btQuickMarch', 870, 620);
	},

	FromCityClick: function (city, force) {
		var t = QuickMarch;

		if (t.SourceCity != city || force) {
			t.SourceCity = city;

			t.RepaintMarchData();
			t.BuildKnightSelect();
			t.BuildChampSelect();
			t.BuildSpellSelect();
			t.PaintMarchSizeInfo();
			t.PaintLoadInfo();
			t.CalcDistance();
			t.CalcMarchTime();

			t.SelectMarchPreset(ById('QMMarchPreset'));
		}
	},

	CheckMarchNumbers: function () {
		var t = QuickMarch;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var troopnum = parseIntNan(Seed.units["city" + t.SourceCity.id]['unt' + i]);
			if (ById('QMMarchUnit' + i).value > troopnum) { ById('QMMarchUnit' + i).style.color = '#f00'; }
			else { ById('QMMarchUnit' + i).style.color = '#000'; }
		}

		if (t.MaxGold < t.Gold) { ById('QMMarchGold').style.color = '#f00'; }
		else { ById('QMMarchGold').style.color = '#000'; }

		if (t.MaxFood < t.Food) { ById('QMMarchFood').style.color = '#f00'; }
		else { ById('QMMarchFood').style.color = '#000'; }

		if (t.MaxWood < t.Wood) { ById('QMMarchWood').style.color = '#f00'; }
		else { ById('QMMarchWood').style.color = '#000'; }

		if (t.MaxStone < t.Stone) { ById('QMMarchStone').style.color = '#f00'; }
		else { ById('QMMarchStone').style.color = '#000'; }

		if (t.MaxOre < t.Ore) { ById('QMMarchOre').style.color = '#f00'; }
		else { ById('QMMarchOre').style.color = '#000'; }

		if (t.MaxAether < t.Aether) { ById('QMMarchAether').style.color = '#f00'; }
		else { ById('QMMarchAether').style.color = '#000'; }
	},

	DestinationChanged: function () {
		var t = QuickMarch;
		if (t.DestLookup) { return; } // don't duplicate lookups
		t.DestLookup = true;
		Options.QuickMarchOptions.StartCoords.x = ById('QMToX').value;
		Options.QuickMarchOptions.StartCoords.y = ById('QMToY').value;

		var x = parseInt(ById('QMToX').value);
		var y = parseInt(ById('QMToY').value);
		if (isNaN(x) || isNaN(y)) { ById('QMLookupButtonDiv').style.display = 'none'; }
		else { ById('QMLookupButtonDiv').style.display = ''; }
		ById("QMLookupInfo").innerHTML = '';

		t.LookupMapTile();
		t.CalcDistance();
	},

	CalcDistance: function () {
		var t = QuickMarch;

		ById("QMDist").innerHTML = '';
		t.distance = 0;

		var x1 = parseInt(t.SourceCity.x);
		var x2 = parseInt(ById('QMToX').value);
		var y1 = parseInt(t.SourceCity.y);
		var y2 = parseInt(ById('QMToY').value);
		if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return;
		t.distance = distance(x1, y1, x2, y2);
		ById("QMDist").innerHTML = t.distance;
	},

	SelectClosest: function () {
		var t = QuickMarch;
		var closestdist = 999999;
		var closestcity;

		var x2 = parseInt(ById('QMToX').value);
		var y2 = parseInt(ById('QMToY').value);
		if (isNaN(x2) || isNaN(y2)) return;

		for (var i = 0; i < Cities.numCities; i++) {
			var cityId = Cities.cities[i].id;
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
		t.dcp0.selectBut(closestcity);
	},

	BuildKnightSelect: function () {
		var t = QuickMarch;
		var knt = getAvailableKnights(t.SourceCity.id);
		ById('QMKnight').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- " + tx('Select Knight') + " --"
		o.value = 0;
		ById("QMKnight").options.add(o);
		for (var k in knt) {
			if (knt[k]["Name"] != undefined) {
				var o = document.createElement("option");
				o.text = (knt[k]["Name"] + ' (' + knt[k]["Combat"] + ')')
				o.value = knt[k]["ID"];
				ById("QMKnight").options.add(o);
			}
		}
		if (ById('QMKnight').options.length > 1) {
			if (Options.QuickMarchOptions.AutoKnight)
				ById('QMKnight').selectedIndex = 1;
		}
	},

	BuildChampSelect: function () {
		var t = QuickMarch;

		ById('QMChamp').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- " + tx('Select Champion') + " --";
		o.value = 0;
		ById("QMChamp").options.add(o);
		var citychamp;
		var NoChampText = '<SPAN class=boldRed><B>' + uW.g_js_strings.champ.no_champ + '!</b></span>';
		citychamp = getCityChampion(t.SourceCity.id);
		if (citychamp.championId) {
			var champname = citychamp.name;
			var champstatus = citychamp.status;
			if (champstatus != "10") {
				var o = document.createElement("option");
				o.text = champname;
				o.value = citychamp.championId;
				ById("QMChamp").options.add(o);
			}
			else {
				NoChampText = '<SPAN class=boldRed><B>' + champname + ' ' + tx('is Marching') + '!</b></span>';
			}
		}
		if (ById('QMChamp').options.length > 1) {
			jQuery("#QMChampSpan").removeClass("divHide");
			jQuery("#QMNoChampSpan").addClass("divHide");
			if (Options.QuickMarchOptions.AutoChamp)
				ById('QMChamp').selectedIndex = 1;
		}
		else {
			jQuery("#QMNoChampSpan").removeClass("divHide");
			jQuery("#QMChampSpan").addClass("divHide");
			ById('QMNoChampSpan').innerHTML = NoChampText;
		}
	},

	BuildSpellSelect: function () {
		var t = QuickMarch;

		var spells = getSpellData(t.SourceCity.id);
		var faction = spells.faction;

		ById('QMSpell').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- " + tx('Select Battle Spell') + " --";
		o.value = 0;
		ById("QMSpell").options.add(o);
		var NoSpellText = '<SPAN class=boldRed><B>' + tx('No Spell') + '!</b></span>';
		if (spells.spellavailable) {
			var SpellName = uW.g_js_strings.spells["name_" + SpellTypes[faction]];
			if (!spells.cooldownactive) {
				var o = document.createElement("option");
				o.text = SpellName;
				o.value = SpellTypes[faction];
				ById("QMSpell").options.add(o);
			}
			else {
				NoSpellText = '<SPAN class=boldRed><B>' + SpellName + ' (<span id=QMCoolTime>' + spells.cooldown + '</span>)</b></span>';

				var Squire = parseIntNan(Seed.items.i1);
				var Knight = parseIntNan(Seed.items.i2);
				var Guinevere = parseIntNan(Seed.items.i3);
				var Morgana = parseIntNan(Seed.items.i4);
				var Arthur = parseIntNan(Seed.items.i5);
				var Merlin = parseIntNan(Seed.items.i6);

				var Speedups = '';
				Speedups += t.dspHG(t.SourceCity.id, faction, 1, Squire);
				Speedups += t.dspHG(t.SourceCity.id, faction, 2, Knight);
				Speedups += t.dspHG(t.SourceCity.id, faction, 3, Guinevere);
				Speedups += t.dspHG(t.SourceCity.id, faction, 4, Morgana);
				Speedups += t.dspHG(t.SourceCity.id, faction, 5, Arthur);
				Speedups += t.dspHG(t.SourceCity.id, faction, 6, Merlin);
				if (Speedups != "") Speedups = "<table align=left cellspacing=0 cellpadding=0><tr>" + Speedups + "</tr></table>";
				NoSpellText = NoSpellText + '<div>' + Speedups + '</div>';
			}
		}

		if (ById("QMSpell").options.length > 1) {
			jQuery("#QMSpellSpan").removeClass("divHide");
			jQuery("#QMNoSpellSpan").addClass("divHide");
			if (Options.QuickMarchOptions.AutoSpell) {
				ById("QMSpell").selectedIndex = 1;
				t.CalcMarchTime();
			}
		}
		else {
			jQuery("#QMNoSpellSpan").removeClass("divHide");
			jQuery("#QMSpellSpan").addClass("divHide");
			ById('QMNoSpellSpan').innerHTML = NoSpellText;
		}
	},

	dspHG: function (cityId, faction, item, count) {
		var t = QuickMarch;
		var n = '';
		if (count > 0) {
			n += '<td class=xtab style="padding-right:2px"><a onClick="QMspeedupSpell(' + cityId + ', ' + item + ',' + SpellTypes[faction] + ')"><img height=18 class="btTop btFaint" src="' + IMGURL + 'items/70/' + item + '.jpg" title="' + itemTitle(item) + '"></a></td>';
		}
		return n;
	},

	speedupSpell: function (cityId, item, spell) {
		var t = QuickMarch;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = cityId;
		params.iid = item;
		params.sid = spell;
		params.apothecary = false;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/speedupBattleSpellCooldown.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (rslt.endDate) {
						Seed.cityData.city[cityId].spells = uWCloneInto({});
						Seed.cityData.city[cityId].spells[spell] = uWCloneInto({ endDate: rslt.endDate });
					}
					Seed.items["i" + item] = Number(parseInt(Seed.items["i" + item]) - 1);
					uW.ksoItems[item].subtract();
					if (cityId == uW.currentcityid) uW.update_queue();
					t.BuildSpellSelect();
				}
			},
		}, true);
	},

	MapClick: function (x, y, c) {
		var t = QuickMarch;
		if (popMarch) {
			ById('QMToX').value = x;
			ById('QMToY').value = y;
			if (c) { t.dcp0.selectBut(c); }
			t.DestinationChanged();
		}
		else {
			t.MapX = x;
			t.MapY = y;
			if (c) { t.MapC = c; } else { t.MapC = null; }
			t.MapLaunch = true;
			t.ToggleQuickMarch(false);
		}
	},

	CalcMaxLoad: function () {
		var t = QuickMarch;
		t.MaxLoad = 0;
		var featherweight = parseInt(Seed.tech.tch10) * 0.1;
		var loadEffectBoost = 0;
		if (Seed.playerEffects.loadExpire > uW.unixtime()) {
			loadEffectBoost = 0.25;
		};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];

			var loadBoostBase = (Math.floor(CM.ThroneController.effectBonus(6)) * 0.01) + loadEffectBoost;
			if (CM.unitFrontendType[i] == "siege") {
				loadBoostBase += (CM.ThroneController.effectBonus(59) * 0.01)
			};
			if (CM.unitFrontendType[i] == "horsed") {
				loadBoostBase += (CM.ThroneController.effectBonus(48) * 0.01);
			};
			var Load = parseInt(uW.unitstats['unt' + i]['5']);
			var LoadSac = "";
			if (uW.seed.queue_sacr["city" + t.SourceCity.id]) {
				for (var sacIndex = 0; sacIndex < uW.seed.queue_sacr["city" + t.SourceCity.id].length; sacIndex++) {
					if (uW.seed.queue_sacr["city" + t.SourceCity.id][sacIndex]["unitType"] == i) {
						Load *= uW.seed.queue_sacr["city" + t.SourceCity.id][sacIndex]["multiplier"][0];
					}
				}
			}
			if (loadBoostBase > Number(uW.cm.thronestats.boosts.Load.Max) / 100) {
				loadBoostBase = Number(uW.cm.thronestats.boosts.Load.Max) / 100;
			};
			loadBoostBase += featherweight; //Should be done after throne room max check to get max boost?
			loadBoostBase += 1;

			var LoadUnit = Math.floor(loadBoostBase * Load);
			t.MaxLoad += parseInt(LoadUnit * ById("QMMarchUnit" + i).value);
		}
		if (t.MaxLoad > 0) t.MaxLoad = t.MaxLoad - 1; // reduce max by 1 to avoid load capacity errors due to roundoff
	},

	LoadMarchPresets: function () {
		var t = QuickMarch;
		ById('QMMarchPreset').options.length = 0;
		var o = document.createElement("option");
		o.text = "-- " + tx('Select Preset') + " --"
		o.value = 0;
		ById("QMMarchPreset").options.add(o);
		for (var y in Options.QuickMarchOptions.MarchPresets) {
			var o = document.createElement("option");
			o.text = Options.QuickMarchOptions.MarchPresets[y][0];
			o.value = y;
			ById("QMMarchPreset").options.add(o);
		}
		t.NextPresetNumber = parseIntNan(y) + 1;
		if (t.InitPresetNumber != 0) {
			ById('QMMarchPreset').value = t.InitPresetNumber;
			t.SelectMarchPreset(ById('QMMarchPreset'));
			t.InitPresetNumber = 0;
		}
	},

	SelectMarchPreset: function (sel) {
		var t = QuickMarch;
		var PN = sel.value;
		if ((PN == 0) || (PN == "")) {
			jQuery('#btDeleteMarchPreset').addClass("disabled");
			return false
		} else {
			jQuery('#btDeleteMarchPreset').removeClass("disabled");
		}

		/* Load preset details into edit fields */

		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (Options.QuickMarchOptions.MarchPresets[PN][i]) { ById('QMMarchUnit' + i).value = Options.QuickMarchOptions.MarchPresets[PN][i]; }
			else { ById('QMMarchUnit' + i).value = "0"; }
		}

		t.Food = 0;
		t.Wood = 0;
		t.Stone = 0;
		t.Ore = 0;
		t.Gold = 0;
		t.Aether = 0;

		if (Options.QuickMarchOptions.MarchPresets[PN].Gold) { t.Gold = Options.QuickMarchOptions.MarchPresets[PN].Gold; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Food) { t.Food = Options.QuickMarchOptions.MarchPresets[PN].Food; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Wood) { t.Wood = Options.QuickMarchOptions.MarchPresets[PN].Wood; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Stone) { t.Stone = Options.QuickMarchOptions.MarchPresets[PN].Stone; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Ore) { t.Ore = Options.QuickMarchOptions.MarchPresets[PN].Ore; }
		if (Options.QuickMarchOptions.MarchPresets[PN].Aether) { t.Aether = Options.QuickMarchOptions.MarchPresets[PN].Aether; }

		ById('QMMarchGold').value = t.Gold;
		ById('QMMarchFood').value = t.Food;
		ById('QMMarchWood').value = t.Wood;
		ById('QMMarchStone').value = t.Stone;
		ById('QMMarchOre').value = t.Ore;
		ById('QMMarchAether').value = t.Aether;

		for (var i = 0; i < t.ItemList.length; i++) {
			var elem = ById("QMItem" + t.ItemList[i]);
			if (elem) {
				elem.checked = (Options.QuickMarchOptions.MarchPresets[PN]["item" + t.ItemList[i]] == true);
			}
		}
		t.RepaintMarchData();
		t.PaintMarchSizeInfo();
		t.PaintLoadInfo();
		t.CalcMarchTime();
	},

	SaveMarchPreset: function () {
		var t = QuickMarch;
		ById('btMarchMessages').innerHTML = "";	// need to induce a flicker or something, so they know something has happened..
		var PN = ById('QMMarchPreset');
		var NewName = ById('QMPresetName').value.trim();
		var OldName = "";
		if (!PN.value || (PN.value == 0)) {
			if (NewName == "") {
				ById('btMarchMessages').innerHTML = "<FONT COLOR=#800>" + tx('Please enter a name for the march preset') + "</font>";
				return false;
			}
			SavePN = t.NextPresetNumber;
		}
		else {
			if (NewName != "") {
				SavePN = t.NextPresetNumber;
			}
			else {
				SavePN = PN.value;
				OldName = Options.QuickMarchOptions.MarchPresets[SavePN][0];
			}
		}

		Options.QuickMarchOptions.MarchPresets[SavePN] = {};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			TroopVal = ById('QMMarchUnit' + i).value;
			if (!isNaN(TroopVal) && (TroopVal != "")) {
				Options.QuickMarchOptions.MarchPresets[SavePN][i] = TroopVal;
			}
		}

		if (!isNaN(t.Gold) && (t.Gold != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Gold = t.Gold;
		}
		if (!isNaN(t.Food) && (t.Food != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Food = t.Food;
		}
		if (!isNaN(t.Wood) && (t.Wood != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Wood = t.Wood;
		}
		if (!isNaN(t.Stone) && (t.Stone != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Stone = t.Stone;
		}
		if (!isNaN(t.Ore) && (t.Ore != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Ore = t.Ore;
		}
		if (!isNaN(t.Aether) && (t.Aether != 0)) {
			Options.QuickMarchOptions.MarchPresets[SavePN].Aether = t.Aether;
		}

		for (var i = 0; i < t.ItemList.length; i++) {
			var elem = ById("QMItem" + t.ItemList[i]);
			if (elem && elem.checked) {
				Options.QuickMarchOptions.MarchPresets[SavePN]["item" + t.ItemList[i]] = true;
			}
		}

		Options.QuickMarchOptions.MarchPresets[SavePN][0] = OldName;
		if (NewName != "") {
			Options.QuickMarchOptions.MarchPresets[SavePN][0] = NewName;
		}
		saveOptions();
		t.InitPresetNumber = SavePN;
		t.LoadMarchPresets();
		ById('QMPresetName').value = "";
		ById('btMarchMessages').innerHTML = tx("March Preset Saved");
	},

	DelMarchPreset: function () {
		var t = QuickMarch;
		var PN = ById('QMMarchPreset');
		if (!PN.value || (PN.value == 0)) return;

		Options.QuickMarchOptions.MarchPresets[PN.value] = {};
		delete Options.QuickMarchOptions.MarchPresets[PN.value];
		saveOptions();
		t.LoadMarchPresets();
		ById('btMarchMessages').innerHTML = tx("March Preset Deleted");
	},

	DoMarch: function (MarchType, SendMaxFood) {
		var t = QuickMarch;
		t.RepaintMarchData();
		t.GetMaxMarchSize();

		var koth = false;
		if (t.targetType == 57) { koth = true; }

		var totalunit = 0;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (MarchType != 3 || i == 3 || i == 46) { totalunit = totalunit + parseIntNan(ById("QMMarchUnit" + i).value); }
		}

		var x = ById("QMToX").value;
		var y = ById("QMToY").value;

		if (ById("QMKnight").value == 0 && MarchType == 4 && !koth) { // attack, try to automatically select knight if none assigned
			if (ById('QMKnight').options.length > 1) {
				ById('QMKnight').selectedIndex = 1;
			}
		}

		var errMsg = "";
		if (x == "" || y == "" || isNaN(x) || isNaN(y) || x < 0 || x > 749 || y < 0 || y > 749) { errMsg += tx("Map co-ordinates must be between 0 and 749") + "!<BR>"; }
		if (ById("QMKnight").value == 0 && MarchType == 4 && !koth) { errMsg += tx("No knight selected") + "!<BR>"; }

		if (MarchType != 3 && MarchType != 4 && !SendMaxFood) {
			t.CalcMaxLoad();
			if ((t.Food + t.Wood + t.Stone + t.Ore + t.Gold + t.Aether) > t.MaxLoad) { errMsg += tx("Too much to carry") + "!<BR>"; }
			if (MarchType == 1 && (t.Food + t.Wood + t.Stone + t.Ore + t.Gold + t.Aether) <= 0) { errMsg += tx("You must transport something") + "!<BR>"; }
		}
		if (totalunit == 0 && MarchType != 3) { errMsg += tx("You must select some troops") + "!<br>"; }
		if (totalunit > t.MaxTroops) { errMsg += tx("You can only send") + " " + t.MaxTroops + " " + tx("units") + ".<br>"; }

		if (errMsg != "") {
			ById('btMarchMessages').innerHTML = "<FONT COLOR=#800>" + errMsg + "</font>";
			return;
		}

		// if we get this far we are good to march...

		var iused = new Array();
		for (var i = 0; i < t.ItemList.length; i++) {
			var elem = ById("QMItem" + t.ItemList[i]);
			if (elem && elem.checked && parseInt(Seed.items["i" + t.ItemList[i]]) > 0) {
				iused.push(t.ItemList[i]);
			}
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.r1 = 0;
		params.r2 = 0;
		params.r3 = 0;
		params.r4 = 0;
		params.r5 = 0;
		params.gold = 0;
		var res = 0;
		if (SendMaxFood) {
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				res += Tabs.Transport.getLoadUnit(i, t.SourceCity.id) * ById("QMMarchUnit" + i).value;
			}
			res = res - 1;
			params.r1 = res;
		}
		params.items = iused.join(",");
		params.cid = t.SourceCity.id;
		params.type = MarchType; // 5 Reassign, 4 Attack, 3 Scout, 2 Reinforce, 1 Transport
		params.xcoord = x;
		params.ycoord = y;
		if (koth) { params.kid = 0; }
		else { params.kid = ById("QMKnight").value; }
		if (MarchType != 3 && MarchType != 4 && !SendMaxFood) {
			params.r1 = Math.min(t.Food, t.MaxFood);
			params.r2 = Math.min(t.Wood, t.MaxWood);
			params.r3 = Math.min(t.Stone, t.MaxStone);
			params.r4 = Math.min(t.Ore, t.MaxOre);
			params.r5 = Math.floor(Math.min(t.Aether / 5, t.MaxAether));
			params.gold = Math.min(t.Gold, t.MaxGold);
		}
		for (var ui in CM.UNIT_TYPES) { params["u" + CM.UNIT_TYPES[ui]] = 0; }
		if (MarchType != 3) {
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				if (ById("QMMarchUnit" + i).value > 0) { params["u" + i] = parseIntNan(ById("QMMarchUnit" + i).value); }
			}
		} else {
			params.u46 = parseIntNan(ById("QMMarchUnit46").value);
			if (params.u46 == 0) {
				params.u3 = parseIntNan(ById("QMMarchUnit3").value);
				if (params.u3 == 0) { params.u3 = 1; }
			}
		}
		params.champid = 0;
		if (MarchType == 4) {
			if (ById('QMChamp').value != 0 && ById('QMChamp').value != "") {
				var championidx = "";
				for (var i = 0; i < Seed.champion.champions.length; i++) {
					if (Seed.champion.champions[i].championId == ById('QMChamp').value) championidx = i;
				}
				params.champid = ById('QMChamp').value;
			}
		}
		if (ById('QMSpell').value != 0 && ById('QMSpell').value != "") {
			if (MarchType == 4 || ById('QMSpell').value != "21") {
				params.bs = ById('QMSpell').value;
			}
		}

		t.DisableButtons(true);
		ById('btMarchMessages').innerHTML = "<i><b>" + tx('Sending march') + "....</b></i>";
		March.addMarch(params, function (rslt) {
			if (rslt.ok) {
				var ReturnMessage = "";
				switch (MarchType) {
					case 1: ReturnMessage = tx("Transport successful"); break;
					case 2: ReturnMessage = tx("Reinforce successful"); break;
					case 3: ReturnMessage = tx("Scout successful"); break;
					case 4: ReturnMessage = tx("Attack successful"); break;
					case 5: ReturnMessage = tx("Reassign successful"); break;
					default: ReturnMessage = tx("March successful");
				}
				ById('btMarchMessages').innerHTML = ReturnMessage;
				t.FromCityClick(t.SourceCity, true); // force update
				t.RefreshItemCounts();
			} else {
				if (rslt.msg) {
					ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>" + rslt.msg + "</b></font>";
				} else {
					ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>" + tx('Error sending march') + "!</b></font>";
				}
			}
			t.DisableButtons(false);
		}, true);
	},

	AddRaid: function () {
		var t = QuickMarch;
		t.RepaintMarchData();
		t.GetMaxMarchSize();
		var totalunit = 0;
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			totalunit = totalunit + parseIntNan(ById("QMMarchUnit" + i).value);
		}

		var x = ById("QMToX").value;
		var y = ById("QMToY").value;

		if (ById("QMKnight").value == 0) { // attack, try to automatically select knight if none assigned
			if (ById('QMKnight').options.length > 1) {
				ById('QMKnight').selectedIndex = 1;
			}
		}

		var errMsg = "";
		if (x == "" || y == "" || isNaN(x) || isNaN(y) || x < 0 || x > 749 || y < 0 || y > 749) { errMsg += tx("Map co-ordinates must be between 0 and 749") + "!<BR>"; }
		if (ById("QMKnight").value == 0) { errMsg += tx("No knight selected") + "!<BR>"; }

		if (totalunit == 0) { errMsg += tx("You must select some troops") + "!<br>"; }
		if (totalunit > t.MaxTroops) { errMsg += tx("You can only send") + " " + t.MaxTroops + " " + tx("units") + ".<br>"; }

		if (errMsg != "") {
			ById('btMarchMessages').innerHTML = "<FONT COLOR=#800>" + errMsg + "</font>";
			return;
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'saveMarch';
		params.settings = {};
		params.queue = { 0: { botMarches: { botMarchStatus: 1, botState: 1 }, cityMarches: {} } };

		params.settings.cityId = t.SourceCity.id;
		params.queue[0].cityMarches.knightId = ById("QMKnight").value;
		params.queue[0].cityMarches.toXCoord = x;
		params.queue[0].cityMarches.toYCoord = y;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			params.queue[0]['cityMarches']['unit' + i + 'Count'] = parseIntNan(ById("QMMarchUnit" + i).value);
		}

		t.DisableButtons(true);
		ById('btMarchMessages').innerHTML = "<i><b>" + tx("Adding Raid") + "....</b></i>";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				var t = QuickMarch;
				if (rslt.ok) {
					uW.cityinfo_army();
					setTimeout(uW.update_seed_ajax, 250);
					ById('btMarchMessages').innerHTML = tx("Raid Added Successfully");
					Seed.knights['city' + params.settings.cityId]['knt' + params.queue[0].cityMarches.knightId].knightStatus = 10; // update knight instantly!
					t.FromCityClick(t.SourceCity, true); // force update
				} else {
					if (rslt.msg) {
						ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>" + rslt.msg + "</b></font>";
					} else {
						ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>" + tx("Error setting raid") + "!</b></font>";
					}
				}
				t.DisableButtons(false);
			},
			onFailure: function () {
				var t = QuickMarch;
				ById('btMarchMessages').innerHTML = "<FONT COLOR=#800><b>" + tx("Error communicating with server") + "!</b></font>";
				t.DisableButtons(false);
			}
		}, true);
	},

	DisableButtons: function (tf) {
		ById("QMTransport").disabled = tf;
		ById("QMReinforce").disabled = tf;
		ById("QMReinforceFood").disabled = tf;
		ById("QMScout").disabled = tf;
		ById("QMAttack").disabled = tf;
		ById("QMReassign").disabled = tf;
	},

	CalcMarchTime: function () {
		var t = QuickMarch;
		var unit_types = {};
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			var troop_number = parseIntNan(ById("QMMarchUnit" + i).value);
			if (troop_number > 0) { unit_types[ui] = i; }
		}
		var phoenix_wings_used = false;
		var thunder_wings_used = false;
		var red_wings_used = false;
		var green_wings_used = false;
		var elem = ById("QMItem59");
		if (elem && elem.checked && parseInt(Seed.items["i59"]) > 0) {
			phoenix_wings_used = true;
		}
		else {
			elem = ById("QMItem58");
			if (elem && elem.checked && parseInt(Seed.items["i58"]) > 0) {
				thunder_wings_used = true;
			}
			else {
				elem = ById("QMItem57");
				if (elem && elem.checked && parseInt(Seed.items["i57"]) > 0) {
					red_wings_used = true;
				}
				else {
					elem = ById("QMItem55");
					if (elem && elem.checked && parseInt(Seed.items["i55"]) > 0) {
						green_wings_used = true;
					}
				}
			}
		}
		var MarchTime = March.getMarchTime(t.SourceCity.id, unit_types, t.distance, ById("QMSpell").value, phoenix_wings_used, thunder_wings_used, red_wings_used, green_wings_used, (t.targetType == 57));
		if (MarchTime.foe == 0) {
			ById("QMTime").innerHTML = "";
			return;
		}
		ById("QMTime").innerHTML = tx("Est. Time") + ": " + uW.timestr(MarchTime.friend) + " (" + tx("Friend") + "), " + uW.timestr(MarchTime.foe) + " (" + tx("Foe") + ")";
	},

	EverySecond: function () {
		var t = QuickMarch;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter >= 3) { // refresh display every 3 seconds
			t.LoopCounter = 0;
			if (t.SourceCity) {
				t.RepaintMarchData();
				t.RefreshTimedBoosts();
				t.RefreshItemCounts();
			}
		}
	},
}
