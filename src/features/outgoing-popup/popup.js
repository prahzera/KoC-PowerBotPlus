/** Outgoing Marches Popup **/

var Outgoing = {
	Options: {
		OutgoingStartState: false,
		OutAttack: true,
		OutScout: true,
		OutReinforce: true,
		OutReassign: false,
		OutTransport: false,
		OutYours: false,
		OutReturning: false,
		OutResources: false,
	},

	init: function () {
		var t = Outgoing;
		DefaultWindowPos('btOutPos', 'main_engagement_tabs');
		if (GlobalOptions.InOutToggle) {
			AddPowerBarLink(tx('Outgoing'), 'PBPOutButton', Outgoing.ToggleOutgoing, function (me) { ResetWindowPos(me, 'main_engagement_tabs', popOut); });
		}
		HTMLRegister['OUT'] = {};

		if (!Options.OutgoingOptions) {
			Options.OutgoingOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.OutgoingOptions.hasOwnProperty(y)) {
					Options.OutgoingOptions[y] = t.Options[y];
				}
			}
		}
		if (Options.OutgoingOptions.OutgoingStartState) { t.ToggleOutgoing(); }
	},

	ToggleOutgoing: function () {
		var t = Outgoing;

		ResetHTMLRegister('OUT', 'btOutgoingMain');

		if (popOut) {
			Options.OutgoingOptions.OutgoingStartState = popOut.toggleHide(popOut)
		}
		else {
			m = '<div id=btOutgoingButtons align="center"><TABLE width="100%"><tr>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.attack + '</td><TD class=xtab><INPUT id=OutAttackChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.scout + '</td><TD class=xtab><INPUT id=OutScoutChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.reinforce + '</td><TD class=xtab><INPUT id=OutReinforceChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.reassign + '</td><TD class=xtab><INPUT id=OutReassignChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.transport + '</td><TD class=xtab><INPUT id=OutTransportChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.returning + '</td><TD class=xtab><INPUT id=OutReturningChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + tx('To You') + '</td><TD class=xtab><INPUT id=OutYoursChk type=checkbox /></td>';
			m += '<td align="right" class=xtab>' + uW.g_js_strings.commonstr.resources + '</td><TD class=xtab><INPUT id=OutResChk type=checkbox /></td>';
			m += '</tr></table></div><div style="max-height:700px; overflow-y:scroll" id=btOutgoingMain></div><br>';

			popOut = new CPopup('btOutgoing', Options.btOutPos.x, Options.btOutPos.y, 720, 200, true, Outgoing.close);
			popOut.getMainDiv().innerHTML = m;
			popOut.getTopDiv().innerHTML = '<DIV align=center><B>&nbsp;&nbsp;&nbsp;' + tx('Outgoing Marches') + '</B></DIV>';

			ToggleOption('OutgoingOptions', 'OutAttackChk', 'OutAttack');
			ToggleOption('OutgoingOptions', 'OutScoutChk', 'OutScout');
			ToggleOption('OutgoingOptions', 'OutReinforceChk', 'OutReinforce');
			ToggleOption('OutgoingOptions', 'OutReassignChk', 'OutReassign');
			ToggleOption('OutgoingOptions', 'OutTransportChk', 'OutTransport');
			ToggleOption('OutgoingOptions', 'OutReturningChk', 'OutReturning');
			ToggleOption('OutgoingOptions', 'OutYoursChk', 'OutYours');
			ToggleOption('OutgoingOptions', 'OutResChk', 'OutResources');

			popOut.show(true);
			Options.OutgoingOptions.OutgoingStartState = true;
		}
		saveOptions();
	},

	close: function () {
		Options.OutgoingOptions.OutgoingStartState = false;
		Options.btOutPos = popOut.getLocation();
		saveOptions();
		popOut = null;
	},

	PaintOutgoing: function () {
		var t = Outgoing;
		var z = '';
		var r = 0;
		var outgoingshow = false;
		var outgoingfiltered = false;
		var outtimes = {};

		var bclass = "brown11";
		if (RefreshingSeed || Options.DashboardOptions.RefreshSeed) bclass += " disabled";

		var z = '<div align="center"><TABLE cellSpacing=0 width=98% height=0%><tr><td width="18" class="xtabHD">&nbsp;</td><td width="60" class="xtabHD"><b>' + uW.g_js_strings.commonstr.time + '</b></td><td width="120" class="xtabHD"><b>' + tx('From') + '</b></td><td width="120" class="xtabHD"><b>' + uW.g_js_strings.commonstr.target + '</b></td><td class="xtabHD"><b>' + uW.g_js_strings.commonstr.troops + '</b></td><td class="xtabHD" style="opacity:1.0"; align="right"><a id=btRefreshSeedOut class="inlineButton btButton ' + bclass + '"><span>' + tx('Refresh') + '</span></a></td></tr>';

		for (n in out) {
			var a = out[n];
			var icon, hint, marchtime, fromcity, totile, tocity, toname, marchdir, tocoords;

			var marchId = a.marchId;
			var marchStatus = parseInt(a.marchStatus);
			var marchType = parseInt(a.marchType);
			var marchMight = 0;

			if (marchType == 10) marchType = 4; // Change Dark Forest type to Attack!

			var from = Cities.byID[a.marchCityId]; if (!from) continue; // tampermonkey fix
			fromcity = CityLink(from);

			var now = unixTime();
			var destinationUnixTime = a["destinationUnixTime"] - now;
			var returnUnixTime = a["returnUnixTime"] - now;

			if ((returnUnixTime <= 0) && ((marchStatus == 8) || (marchStatus == 0))) continue; // never show returned march once completed

			if ((destinationUnixTime < 0) || (marchStatus == 8) || (marchStatus == 2))
				marchdir = "Return";
			else
				marchdir = "Count";

			totile = "";
			tocity = "";
			toname = "";
			for (var i = 0; i < Seed.cities.length; i++) {
				if (Seed.cities[i][2] == parseInt(a["toXCoord"]) && Seed.cities[i][3] == parseInt(a["toYCoord"])) { tocity = CityLink(Cities.byID[Seed.cities[i][0]]); break; }
			}
			if (tocity == "") {
				totile = tileTypes[parseInt(a["toTileType"])];
				if (a["toTileType"] == 51) {
					if (!a["toPlayerId"]) { totile = ""; }
					else { if (a["toPlayerId"] == 0) totile = tx('Barb Camp'); }
				}
				totile = 'Lvl ' + a["toTileLevel"] + ' ' + totile;
			}

			if (a["toPlayerId"] && (a["toPlayerId"] != 0)) {
				if (a["toPlayerId"] == uW.tvuid) {
					if (tocity == 0) { toname = tx('Yourself') }
				}
				else {
					if (a.players && a.players['u' + a.toPlayerId]) {
						toname = MonitorLink(a.toPlayerId, a.players['u' + a.toPlayerId].n);
					}
					else {
						if (Seed.players['u' + a.toPlayerId]) {
							toname = MonitorLink(a.toPlayerId, Seed.players['u' + a.toPlayerId].n);
						}
					}
					if (toname == "") { updatePlayers(a.toPlayerId); } // let's fix it!
				}
			}

			var iconType = marchType;

			if (destinationUnixTime >= 0) {
				if (destinationUnixTime < (60)) { marchtime = '<span style="color:#f00">' + uW.timestr(destinationUnixTime) + '</span>'; }
				else { marchtime = uW.timestr(destinationUnixTime); }
			}
			else {
				if (marchStatus == 2) {
					marchtime = uW.g_js_strings.commonstr.encamped;
					iconType = 102;
				}
				else {
					if (marchStatus == 8) {
						marchtime = uW.timestr(returnUnixTime);
						iconType = 8;
					}
					else {
						marchtime = tx("Waiting");
						iconType = 102;
					}
				}
			}

			outtimes[marchId] = marchtime;

			if (!a.toXCoord || (tocity != "")) { tocoords = ""; }
			else { tocoords = coordLink(a.toXCoord, a.toYCoord); }

			hint = "";
			switch (marchType) {
				case 1: hint = uW.g_js_strings.commonstr.transport; break;
				case 2: hint = uW.g_js_strings.commonstr.reinforce; break;
				case 3: hint = uW.g_js_strings.commonstr.scout; break;
				case 4: hint = uW.g_js_strings.commonstr.attack; break;
				case 5: hint = uW.g_js_strings.commonstr.reassign; break;
			}

			switch (iconType) {
				case 1: icon = TransportImage; break;
				case 2: icon = ReinforceImage; break;
				case 3: icon = ScoutImage; break;
				case 4: icon = AttackImage; break;
				case 5: icon = ReassignImage; break;
				case 8: icon = ReturnImage; break;
				case 102: icon = ReinforceImage; break;
			}
			hint = tx('Recall March') + " (" + marchId + ")";

			outgoingfiltered = true;

			/* Apply Filters */

			if ((marchType == 1) && !Options.OutgoingOptions.OutTransport) continue;
			if ((marchType == 2) && !Options.OutgoingOptions.OutReinforce) continue;
			if ((marchType == 5) && !Options.OutgoingOptions.OutReassign) continue;

			if ((marchType == 3) && !Options.OutgoingOptions.OutScout) continue;
			if ((marchType == 4) && !Options.OutgoingOptions.OutAttack) continue;

			if (((marchdir == "Return") && (marchStatus != 2) && (marchtime != "Waiting")) && !Options.OutgoingOptions.OutReturning) continue;
			if (((toname == "Yourself") || (tocity != 0)) && !Options.OutgoingOptions.OutYours && marchType != 5) continue; // irrelevent for reassigns!

			outgoingshow = true;

			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }

			z += '<tr class="' + rowClass + '"><TD class=xtab><a id="btRecall' + a.marchId + '" onclick="btRecall(' + a.marchId + ')"><img src=' + icon + ' title=' + hint + '></a></td>';
			z += '<TD class=xtab id="omarchtime' + marchId + '">&nbsp;</td>';
			z += '<TD class=xtabBR>';
			if (fromcity != "") z += '<span class=xtab>' + fromcity + '</span> ';
			z += '</td><TD class=xtabBR>';
			if (toname != "") { z += '<span class=xtab>' + toname + '</span> '; }
			if (totile != "") { z += '<span class=xtab>' + totile + '</span> '; }
			if (tocity != "") { z += '<span class=xtab>' + tocity + '</span> '; }
			if (tocoords != "") { z += '<span class=xtab>' + tocoords + '</span>'; }
			z += '</td>';

			var zz = '';
			if (a["championInfo"]) { // stats here are sort of obsolete, because it uses city champ data, but kept in for completeness...
				marchchamp = "<table cellspacing=0 class=xtab><tr><td colspan=2><b>" + a["championInfo"].name + "</b></td></tr><tr><td colspan=2><b>" + uW.g_js_strings.report_view.champion_stats + "</b></td></tr>";
				var gotchamp = false;
				if (a["championInfo"].effects) {
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
				}
				zz += '<table cellspacing=0><tr><td class="xtab trimg" style="font-weight:normal;align:left;" id="btoutmarchchamp' + a.marchId + 'td"><input type="hidden" id="btoutmarchchamp' + a.marchId + 'effects" value="' + marchchamp + '" /><a><img id="btoutmarchchamp' + a.marchId + '" onMouseover="btCreateChampionPopUp(this,' + a.fromCityId + ',true);" height=14 class=btTop src="' + ShieldImage + '"></a></td><td class=xtab>' + tx('Champion') + ': ' + a["championInfo"].name + '&nbsp;</td></tr></table>';
			}
			if ((a["knightId"] > 0) && (!a["knightCombat"])) {
				for (var i in Seed.knights["city" + a.marchCityId]) {
					if (i == ("knt" + a["knightId"])) {
						Combat = Seed.knights["city" + a.marchCityId][i]["combat"];
						if (Seed.knights["city" + a.marchCityId][i]["combatBoostExpireUnixtime"] > unixTime()) { Combat *= 1.25; }
						a["knightCombat"] = Combat;
					}
				}
			}

			if (a.btIncomplete == true && a.marchType != 9 && Options.FetchMarchInfo) { marchdir = "Count"; } // no return info yet
			if (a["knightId"] > 0) zz += '<span class=xtab>' + uW.g_js_strings.commonstr.knight + ' (Atk:' + a["knightCombat"] + ')</span> ';
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				if ((a["unit" + i + "Count"] > 0) || (a["unit" + i + "Return"] > 0)) {
					trpcol = Options.Colors.PanelText;
					if ((marchdir == "Return") && (a["unit" + i + "Return"] < a["unit" + i + "Count"])) { trpcol = '#f00'; }
					zz += '<span class=xtab>' + uW.unitcost['unt' + i][0] + ': <span class=xtab style="color:' + trpcol + '">' + addCommas(a["unit" + i + marchdir]) + '</span></span> ';
					marchMight += (a["unit" + i + marchdir] * parseInt(uW.unitmight["unt" + i]));
				}
			}

			if (a["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_' + a["fromSpellType"]];
				if (spell) {
					var spellstyle = 'color:#808;';
					zz += '<br><span class=xtab style="' + spellstyle + '"><b>*&nbsp;' + spell + '&nbsp;*</b></span>'
				}
			}

			if (Options.OutgoingOptions.OutResources) {
				if ((a["gold"] > 0) || (a["resource1"] > 0) || (a["resource2"] > 0) || (a["resource3"] > 0) || (a["resource4"] > 0) || (a["resource5"] > 0)) {
					zz += "<br>";
				}

				if (a["gold"] > 0) zz += '<span class=xtab>' + ResourceImage(GoldImage, uW.g_js_strings.commonstr.gold) + addCommas(a["gold"]) + '</span> ';
				if (a["resource1"] > 0) zz += '<span class=xtab>' + ResourceImage(FoodImage, uW.g_js_strings.commonstr.food) + addCommas(a["resource1"]) + '</span> ';
				if (a["resource2"] > 0) zz += '<span class=xtab>' + ResourceImage(WoodImage, uW.g_js_strings.commonstr.wood) + addCommas(a["resource2"]) + '</span> ';
				if (a["resource3"] > 0) zz += '<span class=xtab>' + ResourceImage(StoneImage, uW.g_js_strings.commonstr.stone) + addCommas(a["resource3"]) + '</span> ';
				if (a["resource4"] > 0) zz += '<span class=xtab>' + ResourceImage(OreImage, uW.g_js_strings.commonstr.ore) + addCommas(a["resource4"]) + '</span> ';
				if (a["resource5"] > 0) zz += '<span class=xtab>' + ResourceImage(AetherImage, uW.g_js_strings.commonstr.aetherstone) + addCommas(a["resource5"]) + '</span> ';
			}
			z += '<TD ';
			if (Options.ShowMarchMight && marchMight != 0) z += 'title="' + uW.g_js_strings.commonstr.might + ': ' + addCommas(marchMight) + '"';
			z += ' colspan=2 class=xtabBR>' + zz + '</td></tr>';
		}

		if (!outgoingshow) {
			if (!outgoingfiltered)
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No outgoing marches') + '</div></td></tr>';
			else
				z += '<tr><td colspan=6 class=xtab><div align="center"><br><br>' + tx('No outgoing marches matching search parameters') + '</div></td></tr>';
		}

		z += '<tr><td class=xtab colspan="6"><div class="ErrText" align="center" id=btOutErr>&nbsp;</div></td></tr></table></div><br>';

		if (CheckForHTMLChange('OUT', 'btOutgoingMain', z)) {
			if (Options.DashboardOptions.RefreshSeed) jQuery('#btRefreshSeedOut').addClass("disabled");
			else ById('btRefreshSeedOut').addEventListener('click', function () { setTimeout(function () { RefreshSeed(); }, 250); }, false);
			ResetFrameSize('btOutgoing', 200, 720);
		}
		for (var m in outtimes) {
			mt = outtimes[m];
			if (ById('omarchtime' + m)) {
				ById('omarchtime' + m).innerHTML = mt;
			}
		}
	},

	EverySecond: function () {
		var t = Outgoing;

		try {
			if (((SecondLooper % Dashboard.GeneralInterval) == 1) || Dashboard.GeneralInterval == 1) {
				t.PaintOutgoing();
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

}
