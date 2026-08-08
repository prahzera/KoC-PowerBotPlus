/** Incoming Marches Popup **/

var Incoming = {
	Options: {
		IncomingStartState: false,
		IncAttack: true,
		IncScout: true,
		IncReinforce: true,
		IncReassign: false,
		IncTransport: false,
		IncWilds: false,
		IncYours: false,
		IncResources: true,
	},

	init: function () {
		var t = Incoming;
		DefaultWindowPos('btIncPos', 'main_engagement_tabs');
		if (GlobalOptions.InOutToggle) {
			AddPowerBarLink(tx('Incoming'), 'PBPIncButton', Incoming.ToggleIncoming, function (me) { ResetWindowPos(me, 'main_engagement_tabs', popInc); });
		}
		HTMLRegister['INC'] = {};

		if (!Options.IncomingOptions) {
			Options.IncomingOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.IncomingOptions.hasOwnProperty(y)) {
					Options.IncomingOptions[y] = t.Options[y];
				}
			}
		}
		if (Options.IncomingOptions.IncomingStartState) { t.ToggleIncoming(); }
	},

	ToggleIncoming: function () {
		var t = Incoming;

		ResetHTMLRegister('INC', 'btIncomingMain');

		if (popInc) {
			Options.IncomingOptions.IncomingStartState = popInc.toggleHide(popInc)
		}
		else {
			m = '<div id=btIncomingButtons align="center"><TABLE width="100%"><tr>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.attack + '</td><TD class=xtab><INPUT id=IncAttackChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.scout + '</td><TD class=xtab><INPUT id=IncScoutChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.reinforce + '</td><TD class=xtab><INPUT id=IncReinforceChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.reassign + '</td><TD class=xtab><INPUT id=IncReassignChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.transport + '</td><TD class=xtab><INPUT id=IncTransportChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + tx('To Wilds') + '</td><TD class=xtab><INPUT id=IncWildsChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + tx('From You') + '</td><TD class=xtab><INPUT id=IncYoursChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.resources + '</td><TD class=xtab><INPUT id=IncResChk type=checkbox /></td>';
			m += '</tr></table></div><div style="max-height:700px; overflow-y:scroll" id=btIncomingMain></div><br>';

			popInc = new CPopup('btIncoming', Options.btIncPos.x, Options.btIncPos.y, 720, 200, true, Incoming.close);
			popInc.getMainDiv().innerHTML = m;
			popInc.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('Incoming Marches') + '</B></DIV>';

			ToggleOption('IncomingOptions', 'IncAttackChk', 'IncAttack');
			ToggleOption('IncomingOptions', 'IncScoutChk', 'IncScout');
			ToggleOption('IncomingOptions', 'IncReinforceChk', 'IncReinforce');
			ToggleOption('IncomingOptions', 'IncReassignChk', 'IncReassign');
			ToggleOption('IncomingOptions', 'IncTransportChk', 'IncTransport');
			ToggleOption('IncomingOptions', 'IncWildsChk', 'IncWilds');
			ToggleOption('IncomingOptions', 'IncYoursChk', 'IncYours');
			ToggleOption('IncomingOptions', 'IncResChk', 'IncResources');

			popInc.show(true);
			Options.IncomingOptions.IncomingStartState = true;
		}
		saveOptions();

	},

	close: function () {
		Options.IncomingOptions.IncomingStartState = false;
		Options.btIncPos = popInc.getLocation();
		saveOptions();
		popInc = null;
	},

	PaintIncoming: function () {
		var t = Incoming;
		var z = '';
		var r = 0;
		var incomingshow = false;
		var incomingfiltered = false;
		var inctimes = {};

		var bclass = "brown11";
		if (RefreshingSeed || Options.DashboardOptions.RefreshSeed) bclass += " disabled";

		var z = '<div align="center"><TABLE cellSpacing=0 width=98% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>' + uW.g_js_strings.commonstr.time + '</b></td><td width="120" class="xtabHD"><b>' + uW.g_js_strings.commonstr.target + '</b></td><td width="120" class="xtabHD"><b>' + tx('From') + '</b></td>';
		z += '<td class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b></td><td class="xtabHD" align="right"><a id=btRefreshSeedInc class="inlineButton btButton ' + bclass + '"><span>' + tx('Refresh') + '</span></a></td></tr>';

		for (n in inc) {
			var a = inc[n];

			var icon, hint, marchtime, targetcity, targetcoords, fromname, marchdir, fromcoords;
			var marchScore = parseInt(a.score);
			var marchType = parseInt(a.marchType);
			var marchStatus = parseInt(a.marchStatus);
			var marchMight = 0;

			var to = Cities.byID[a.toCityId];
			if (to) {
				if (to.tileId == a.toTileId) { targetcity = CityLink(to); targetcoords = ""; }
				else { targetcity = uW.g_js_strings.commonstr.wilderness; targetcoords = coordLink(a.toXCoord, a.toYCoord); }
			}
			else {
				targetcity = ""; targetcoords = coordLink(a.toXCoord, a.toYCoord);
			}

			fromname = "";
			if (a.score) {
				if (a.arrivalTime < unixTime()) continue; // don't display arrival times already happened
				var marchId = a.mid;
				var pid = a.pid;
				if (!a.marchType) { a.marchType = 4; }
				if (!a.arrivalTime || a.arrivalTime == -1) { marchtime = '??????'; }
				else { marchtime = uW.timestr(a.arrivalTime - unixTime()); }
				if (a.players && a.players['u' + a.pid]) { fromname = a.players['u' + a.pid].n; }
				else if (Seed.players['u' + a.pid]) { fromname = Seed.players['u' + a.pid].n; }
			}
			else {
				var marchId = a.marchId;
				var pid = a.fromPlayerId;
				if ((a.arrivalTime - unixTime()) < 0) continue;
				marchtime = uW.timestr(a.arrivalTime - unixTime());
				player = Seed.players['u' + a.fromPlayerId];
				if (Seed.players['u' + a.fromPlayerId]) { fromname = Seed.players['u' + a.fromPlayerId].n; }
				else if (a.players && a.players['u' + a.fromPlayerId]) { fromname = a.players['u' + a.fromPlayerId].n; }
			}
			inctimes[marchId] = marchtime;

			if (!a.fromXCoord) { fromcoords = ""; }
			else { fromcoords = coordLink(a.fromXCoord, a.fromYCoord); }
			if (fromname.toUpperCase() == Seed.player.name.toUpperCase()) {
				fromname = tx('Yourself');
				var fr = Cities.byID[a.fromCityId];
				fromcoords = ' (' + CityLink(fr) + ')';
			}
			else {
				if (fromname == "") { if (a.score) { fromname = '(' + uW.g_js_strings.attack_viewimpending_view.upgradetoseeinfo + ')'; } else { fromname = '(' + tx('Unknown') + ')'; } }
				else { fromname = MonitorLink(pid, fromname); }
			}

			icon = "";
			switch (marchType) {
				case 1: icon = TransportImage; hint = uW.g_js_strings.commonstr.transport; break;
				case 2: icon = ReinforceImage; hint = uW.g_js_strings.commonstr.reinforce; break;
				case 3: icon = ScoutImage; hint = uW.g_js_strings.commonstr.scout; break;
				case 4: icon = AttackImage; hint = uW.g_js_strings.commonstr.attack; break;
				case 5: icon = ReassignImage; hint = uW.g_js_strings.commonstr.reassign; break;
			}
			if (icon == "") continue; // tampermonkey fix

			incomingfiltered = true;

			/* Apply Filters */

			if ((marchType == 1) && !Options.IncomingOptions.IncTransport) continue;
			if ((marchType == 2) && !Options.IncomingOptions.IncReinforce) continue;
			if ((marchType == 5) && !Options.IncomingOptions.IncReassign) continue;

			if ((marchType == 3) && !Options.IncomingOptions.IncScout) continue;
			if (((marchType == 4) || (!marchType && marchScore)) && !Options.IncomingOptions.IncAttack) continue;

			if ((targetcity == "Wilderness") && !Options.IncomingOptions.IncWilds) continue;
			if ((fromname == "Yourself") && !Options.IncomingOptions.IncYours) continue;

			incomingshow = true;

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="' + rowClass + '"><TD class=xtab><img src=' + icon + ' title=' + hint + '></td>';
			z += '<TD class=xtab id="marchtime' + marchId + '">&nbsp;</td>';
			z += '<TD class=xtabBR>';
			if (targetcity != "") z += '<span class=xtab>' + targetcity + '</span> ';
			if (targetcoords != "") z += '<span class=xtab>' + targetcoords + '</span>';
			z += '</td>';
			z += '<TD class=xtabBR><span class=xtab>' + fromname + '</span> ';
			if (fromcoords != "") { z += '<span class=xtab>' + fromcoords + '</span>'; }
			z += '</td>';

			if (a.destinationUnixTime < unixTime() || marchStatus == 8)
				marchdir = "Return";
			else
				marchdir = "Count";

			var zz = '';
			if (marchType == 3 || marchType == 4) {
				if ((safecall.indexOf(a.pid) < 0 || trusted) && a["championInfo"]) {
					marchchamp = "<table cellspacing=0 class=xtab><tr><td colspan=2><b>" + a["championInfo"].name + "</b></td></tr><tr><td colspan=2><b>" + uW.g_js_strings.report_view.champion_stats + "</b></td></tr>";
					var gotchamp = false;
					if (a["championInfo"].effects[1] && !(a["championInfo"].effects[1] instanceof Array) && typeof (a["championInfo"].effects[1]) === "object") {
						got202 = false;
						for (var cy in a["championInfo"].effects[1]) {
							// missing bonus damage?
							if ((cy == '202') && gotchamp) { got202 = true; }
							if ((cy == '203') && !got202) { marchchamp += "<tr><td>" + uW.g_js_strings.effects.name_202 + "</td><td>0</td></tr>"; }
							str = uW.g_js_strings.effects['name_' + cy];
							if (str && str != "") {
								gotchamp = true;
								marchchamp += "<tr><td>" + str + "</td><td>" + a["championInfo"].effects[1][cy] + "</td></tr>";
							} else { break; }
						}
					}
					if (!gotchamp) { marchchamp += '<tr><td colspan=2><i>' + tx('None Available') + '</i></td></tr>'; }
					marchchamp += "<tr><td colspan=2><b>" + uW.g_js_strings.report_view.troop_stats + "</b></td></tr>";
					var gottroop = false;
					if (a["championInfo"].effects[2] && !(a["championInfo"].effects[2] instanceof Array) && typeof (a["championInfo"].effects[2]) === "object") {
						for (var ty in a["championInfo"].effects[2]) {
							str = uW.g_js_strings.effects['name_' + ty];
							if (str && str != "") {
								gottroop = true;
								marchchamp += "<tr><td>" + str + "</td><td>" + a["championInfo"].effects[2][ty] + "</td></tr>";
							} else { break; }
						}
					}
					if (!gottroop) { marchchamp += '<tr><td colspan=2><i>' + tx('None Available') + '</i></td></tr>'; }
					marchchamp += "</table>";
					zz += '<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btmarchchamp' + a.mid + 'td"><input type="hidden" id="btmarchchamp' + a.mid + 'effects" value="' + marchchamp + '" /><a><img id="btmarchchamp' + a.mid + '" onMouseover="btCreateChampionPopUp(this,' + a.toCityId + ');" height=14 class=btTop src="' + ShieldImage + '"></a></td><td class=xtab>' + tx('Champion') + ': ' + a["championInfo"].name + '&nbsp;</td></tr></table>';
				}
				if (a["knt"] && a["knt"]["cbt"]) zz += '<span class=xtab>' + uW.g_js_strings.commonstr.knight + ' (Atk:' + a["knt"]["cbt"] + ')</span> ';
				if (a["unts"]) {
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (a["unts"]["u" + i]) {
							if (a["unts"]["u" + i] > 0) { zz += '<span class=xtab>' + uW.unitcost['unt' + i][0] + ': ' + addCommas(a["unts"]["u" + i]) + '</span> '; marchMight += (a["unts"]["u" + i] * parseInt(uW.unitmight["unt" + i])); }
							else { zz += '<span class=xtab>' + a["unts"]["u" + i] + ' ' + uW.unitcost['unt' + i][0] + '</span> '; }
						}
					}
				}
				else {
					if (a["cnt"]) { zz += '<span class=xtab>' + a["cnt"] + '</span> '; }
					else { zz += '<span class=xtab>(' + uW.g_js_strings.attack_viewimpending_view.upgradetoseeinfo + ')</span> '; }
				}
			}
			else {
				if (a["knightId"] > 0) zz += '<span class=xtab>' + uW.g_js_strings.commonstr.knight + ' (Atk:' + a["knightCombat"] + ')</span> ';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (a["unit" + i + marchdir] > 0) {
						zz += '<span class=xtab>' + uW.unitcost['unt' + i][0] + ': ' + addCommas(a["unit" + i + marchdir]) + '</span> ';
						marchMight += (a["unit" + i + marchdir] * parseInt(uW.unitmight["unt" + i]));
					}
				}
			}

			if (local_atkinc["m" + marchId]["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_' + local_atkinc["m" + marchId]["fromSpellType"]];
				if (spell) {
					var spellstyle = 'color:#808;';
					zz += '<br><span class=xtab style="' + spellstyle + '"><b>*&nbsp;' + spell + '&nbsp;*</b></span>'
				}
			}

			if (Options.IncomingOptions.IncResources) {
				if ((a["gold"] > 0) || (a["resource1"] > 0) || (a["resource2"] > 0) || (a["resource3"] > 0) || (a["resource4"] > 0) || (local_atkinc["m" + marchId]["resource5"] > 0)) {
					zz += "<br>";
				}

				if (a["gold"] > 0) zz += '<span class=xtab>' + ResourceImage(GoldImage, uW.g_js_strings.commonstr.gold) + addCommas(a["gold"]) + '</span> ';
				if (a["resource1"] > 0) zz += '<span class=xtab>' + ResourceImage(FoodImage, uW.g_js_strings.commonstr.food) + addCommas(a["resource1"]) + '</span> ';
				if (a["resource2"] > 0) zz += '<span class=xtab>' + ResourceImage(WoodImage, uW.g_js_strings.commonstr.wood) + addCommas(a["resource2"]) + '</span> ';
				if (a["resource3"] > 0) zz += '<span class=xtab>' + ResourceImage(StoneImage, uW.g_js_strings.commonstr.stone) + addCommas(a["resource3"]) + '</span> ';
				if (a["resource4"] > 0) zz += '<span class=xtab>' + ResourceImage(OreImage, uW.g_js_strings.commonstr.ore) + addCommas(a["resource4"]) + '</span> ';
				if (local_atkinc["m" + marchId]["resource5"] > 0) zz += '<span class=xtab>' + ResourceImage(AetherImage, uW.g_js_strings.commonstr.aetherstone) + addCommas(local_atkinc["m" + marchId]["resource5"]) + '</span> ';
			}
			z += '<TD ';
			if (Options.ShowMarchMight && marchMight != 0) z += 'title="' + uW.g_js_strings.commonstr.might + ': ' + addCommas(marchMight) + '"';
			z += ' colspan=2 class=xtabBR>' + zz + '</td></tr>';
		}

		if (!incomingshow) {
			if (!incomingfiltered)
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No incoming marches') + '</div></td></tr>';
			else
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No incoming marches matching search parameters') + '</div></td></tr>';
		}

		z += '</table></div><br>';

		if (CheckForHTMLChange('INC', 'btIncomingMain', z)) {
			if (Options.DashboardOptions.RefreshSeed) jQuery('#btRefreshSeedInc').addClass("disabled");
			else ById('btRefreshSeedInc').addEventListener('click', function () { setTimeout(function () { RefreshSeed(); }, 250); }, false);
			ResetFrameSize('btIncoming', 200, 720);
		}
		for (var m in inctimes) {
			mt = inctimes[m];
			if (ById('marchtime' + m)) {
				ById('marchtime' + m).innerHTML = mt;
			}
		}
	},

	EverySecond: function () {
		var t = Incoming;

		try {
			if (((SecondLooper % Dashboard.GeneralInterval) == 1) || Dashboard.GeneralInterval == 1) {
				t.PaintIncoming();
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
}
