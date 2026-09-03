var Rpt = {
	reportpos: { x: -999, y: -999 },
	popReport: null,
	atkmight: 0,
	defmight: 0,

	FindReport: function (rpId, pageNum) {
		var t = Rpt;
		FetchReport(rpId, function (rslt) {
			jQuery('#viewreports_marchreport_' + rpId).removeClass('unread');
			if (!rslt.ok) {
				var a = document.createElement("div");
				a.className = "chatwrap clearfix noalliance";
				a.innerHTML = "<div>" + rslt.msg + "</div>";
				jQuery("#mod_comm_list" + uW.Chat.chatType).prepend(a);
			}
			else {
				var rpt = rslt['index'];
				rpt.Side0PlayerId = rslt['index']['side0PlayerId'];
				rpt.Side0AllianceId = rslt['index']['side0AllianceId'];
				rpt.Side1PlayerId = rslt['index']['side1PlayerId'];
				t.GetNames(rpId, rpt);
			}
		});
	},

	GetNames: function (rpId, rpt) {
		var t = Rpt;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = rpt.Side1PlayerId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				rpt.side1Name = rslt['userInfo']['0']['name'];
				rpt.side1AllianceName = rslt['userInfo']['0']['allianceName'];
				if (rpt.Side0PlayerId && rpt.Side0PlayerId != 0) {
					var params = uW.Object.clone(uW.g_ajaxparams);
					params.uid = rpt.Side0PlayerId;
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							rpt.side0Name = rslt['userInfo']['0']['name'];
							rpt.side0AllianceName = rslt['userInfo']['0']['allianceName'];
							t.GetReport(rpId, rpt);
						},
					}, false);
				} else {
					rpt.side0Name = uW.g_js_strings.commonstr.enemy;
					t.GetReport(rpId, rpt);
				}
			},
		}, true);
	},

	GetReport: function (rpId, rpt) {
		var t = Rpt;
		var side = 1;
		if (rpt.Side0PlayerId == uW.tvuid) {
			side = 0;
		} else {
			if (rpt.Side1PlayerId == uW.tvuid) {
				side = 1;
			} else {
				if (Seed.allianceDiplomacies) {
					if (parseInt(rpt.side0AllianceId) == parseInt(Seed.allianceDiplomacies.allianceId)) {
						side = 0;
					}
				}
			}
		}

		rpt.sideId = side;
		FetchReportDetail(rpId, side, function (rslt) {
			if (!rslt || rslt.error_code)
				actionLog('Unable to display report', 'REPORTS');
			else
				t.ReportPopup(rslt, rpt, rpId);
		});
	},

	ReportPopup: function (rslt, rpt, reportId) {
		var t = Rpt;

		var m = '';
		var unitImg = [];
		var unitName = [];
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			unitName[i] = uW.unitcost['unt' + i][0];
			unitImg[i] = '<img src="' + TroopImagePrefix + i + TroopImageSuffix + '" title="' + unitName[i] + '">';
		}

		unitName[53] = tx('Crossbows');
		unitName[55] = tx('Trebuchet');
		unitName[60] = uW.fortcost.frt60[0];
		unitName[61] = uW.fortcost.frt61[0];
		unitName[62] = uW.fortcost.frt62[0];
		unitName[63] = uW.fortcost.frt63[0];
		unitName[99] = uW.buildingcost.bdg31[0];
		unitName[100] = uW.buildingcost.bdg30[0];

		unitImg[53] = '<img src="' + IMGURL + 'units/unit_53_30.jpg" title="' + unitName[53] + '">';
		unitImg[55] = '<img src="' + IMGURL + 'units/unit_55_30.jpg" title="' + unitName[55] + '">';
		unitImg[60] = '<img src="' + IMGURL + 'units/unit_60_30.jpg" title="' + unitName[60] + '">';
		unitImg[61] = '<img src="' + IMGURL + 'units/unit_61_30.jpg" title="' + unitName[61] + '">';
		unitImg[62] = '<img src="' + IMGURL + 'units/unit_62_30.jpg" title="' + unitName[62] + '">';
		unitImg[63] = '<img src="' + IMGURL + 'units/unit_63_30.jpg" title="' + unitName[63] + '">';
		unitImg[99] = '<img src="' + IMGURL + 'units/redoubt_30.jpg" title="' + unitName[99] + '" width=30>';
		unitImg[100] = '<img src="' + IMGURL + 'units/tower_30.jpg" title="' + unitName[100] + '" width=30>';

		for (var i = 101; i < 111; i++) {
			unitName[i] = uW.g_js_strings.monsterUnitsNames["m" + i];
			unitImg[i] = '<img src="' + TroopImagePrefix + i + TroopImageSuffix + '" title="' + unitName[i] + '">';
		}

		var trEffect = [];
		for (var k in uW.cm.thronestats.tiers)
			trEffect[k] = uW.g_js_strings.effects["name_" + k].replace("%1$s", "nn% ");
		var chEffect = ["hpm", "hpr", "dam", "arm", "str", "dex", "con", "hit", "cri", "blk"];
		var chEffectName = [uW.g_js_strings.champion_stats.hp, uW.g_js_strings.report_view.hp_remaining, uW.g_js_strings.champion_stats.damage, uW.g_js_strings.effects.name_203, uW.g_js_strings.effects.name_204, uW.g_js_strings.effects.name_205, uW.g_js_strings.effects.name_206, uW.g_js_strings.effects.name_207, uW.g_js_strings.effects.name_208, uW.g_js_strings.effects.name_209];
		rpt.marchName = '?';
		if (rpt.marchType == 0)
			rpt.marchName = tx('Desertion');
		else if (rpt.marchType == 1)
			rpt.marchName = uW.g_js_strings.commonstr.transport;
		else if (rpt.marchType == 2)
			rpt.marchName = uW.g_js_strings.commonstr.reinforce;
		else if (rpt.marchType == 3) {
			if (rpt.sideId == 0)
				rpt.marchName = tx('Anti-Scout');
			else
				rpt.marchName = uW.g_js_strings.commonstr.scout;
		} else if (rpt.marchType == 4) {
			if (rpt.sideId == 0)
				rpt.marchName = uW.g_js_strings.commonstr.defend;
			else
				rpt.marchName = uW.g_js_strings.commonstr.attack;
		} else if (rpt.marchType == 9)
			rpt.marchName = uW.g_js_strings.commonstr.raid;
		else if (rpt.marchType == 10)
			rpt.marchName = uW.g_js_strings.commonstr.darkForest;
		if (parseInt(rpt.side0TileType) <= 50)
			rpt.side0TileTypeText = tileTypes[parseInt(rpt.side0TileType)];
		else if (parseInt(rpt.side0TileType) == 57)
			rpt.side0TileTypeText = tx('Runic Megalith');
		else if (parseInt(rpt.side0CityId) == 0)
			rpt.side0TileTypeText = tx('Barb Camp');
		else
			rpt.side0TileTypeText = tx('City');

		var koth = false;
		if (parseInt(rpt.side0TileType) == 57) koth = true;

		function buildHeader() {
			var h = '<div id=reportHeader style="width:100%;">';
			h += '<div id=reportHeaderLeft style="float:left;width:30%;text-align:left;">';
			h += formatUnixTime(rpt.reportUnixTime);
			h += '<br>';
			h += '<b>' + tx('Glory Gained') + ': ';
			if (parseInt(rpt.side0TileType) == 57) { if (rpt.sideId == 0) { h += rslt['fght']["s0"]["glory"]; } if (rpt.sideId == 1) { h += rslt['fght']["s1"]["glory"]; } } else { if (rslt['glory']) h += addCommas(rslt['glory']); else h += '0'; }
			h += '</b></div>';
			h += '<div id=reportHeaderCenter style="float:left;width:40%;text-align:center;">';
			if (rpt.side0TileTypeText != tx('City') && rpt.side0TileTypeText != tx('Barb Camp') && rpt.marchType == 4) {
				var vCol = (Options.Colors.ReportVictory || '#080'), lCol = (Options.Colors.ReportDefeat || '#CC0000');
				if (rpt.sideId == 0) {
					if (rslt['conquered'] != 0) { h += '<FONT color="' + lCol + '"><B>' + tx('Conquered') + '</B></font>'; }
					else { h += '<FONT color="' + vCol + '"><B>' + tx('Secured') + '</B></font>'; }
				}
				else {
					if (rslt['conquered'] != 0) { h += '<FONT color="' + vCol + '"><B>' + tx('Conquered') + '</B></font>'; }
					else { h += '<FONT color="' + lCol + '"><B>' + tx('Secured') + '</B></font>'; }
				}
			} else if ((rslt['winner'] == 1 && rpt.sideId == 0) || (rslt['winner'] == 0 && rpt.sideId == 1)) {
				if (rpt.marchName == uW.g_js_strings.commonstr.scout)
					h += '<FONT color="' + lCol + '"><B>' + tx('Scouting Failed') + '</B></font>';
				else
					h += '<FONT color="' + lCol + '"><B>' + tx('You were defeated') + '</B></font>';
			} else if (rslt['winner'] == 0 && rpt.sideId == 0)
				h += '<FONT color="' + vCol + '"><B>' + tx('You defended successfully') + '!</B></font>';
			else if (rslt['winner'] == 1 && rpt.sideId == 1) {
				if (rpt.marchName == uW.g_js_strings.commonstr.scout)
					h += '<FONT color="' + vCol + '"><B>' + tx('Scouting Report') + '</B></font>';
				else
					h += '<FONT color="' + vCol + '"><B>' + tx('You were victorious') + '!</B></font>';
			}
			h += '</div>';
			h += '<div id=reportHeaderRight style="float:right;width:30%;text-align:right;">';
			h += 'Report No: ' + reportId;
			h += '<br><input id=ptpostreportid onclick="Chat.sendChat(\'/a Report No: ' + enFilter(reportId) + '\')" style="font-size:9px" type="submit" value="' + tx('Post To Chat') + '">';
			if ((rpt.side1PlayerId && (rpt.side1PlayerId == uW.tvuid)) || (rpt.side0PlayerId && (rpt.side0PlayerId == uW.tvuid))) { h += '&nbsp;<input id=ptDeleteReport style="color:#f00;font-size:9px" type="submit" value="' + uW.g_js_strings.commonstr.deletetx + '">'; } //Delete button for own reports
			h += '</div></div><div style="clear:both;"></div>';
			return h;
		}

		function formatTroopLine(side, unit_type, overwhelmed, fought, survived) {
			var t = Rpt;
			var n = '';
			n += '<TR><TD>' + unitImg[unit_type] + '</td><td>' + unitName[unit_type] + '</td>';
			if (overwhelmed) {
				n += '<TD align=center>???</td>';
				n += '<TD align=center>???</td>';
				if (fought > 0) {
					n += '<TD align=center><FONT color="' + (Options.Colors.ReportDefeat || '#CC0000') + '">(' + addCommas(fought) + ')</FONT></td></tr>';
					if (side == "s0" && unit_type < 50) { t.defmight += parseInt(uW.unitmight['unt' + unit_type] * fought); }
					if (side == "s0" && unit_type >= 50 && unit_type < 99) {
						var fm = parseIntNan(fortmight['f' + unit_type]);
						t.defmight += parseInt(fm * fought);
					}
				} else {
					n += '<TD align=center>0</td></tr>';
				}
			}
			else {
				var killed = parseInt(fought) - parseInt(survived);
				if (killed > 0) {
					n += '<TD align=center>' + addCommas(fought) + '</td>';
					n += '<TD align=center><FONT color="' + (Options.Colors.ReportDefeat || '#CC0000') + '">' + addCommas(survived) + '</FONT></td>';
					n += '<TD align=center><FONT color="' + (Options.Colors.ReportDefeat || '#CC0000') + '">(' + addCommas(killed) + ')</FONT></td></tr>';
					if (side == "s1") { t.atkmight += parseInt(uW.unitmight['unt' + unit_type] * killed); }
					if (side == "s0" && unit_type < 51) { t.defmight += parseInt(uW.unitmight['unt' + unit_type] * killed); }
					if (side == "s0" && unit_type >= 51 && unit_type < 99) {
						var fm = parseIntNan(fortmight['f' + unit_type]);
						t.defmight += parseInt(fm * killed);
					}
				} else {
					n += '<TD align=center>' + addCommas(fought) + '</td>';
					n += '<TD align=center>' + addCommas(survived) + '</td></tr>';
				}
			}
			return n;
		};

		function buildBattle() {
			var t = Rpt;
			var m = '';

			t.atkmight = 0;
			t.defmight = 0;
			//header
			m += '<div class="divHeader" align=left>' + tx('Battle Results').toUpperCase() + '</div>';
			//summary
			m += '<div id=battleSummaryContainer>';
			//summary - attacker
			m += '<div style="width:50%;float:left;">';
			m += '<B>' + tx('Attackers') + ':</B> ' + rpt.side1Name + ' (<A class=xlink onclick="btGotoMapRpt(' + rpt.side1XCoord + ',' + rpt.side1YCoord + ')">' + rpt.side1XCoord + ',' + rpt.side1YCoord + '</a>) ';
			if (rslt['winner'] == 1)
				m += '<FONT color="' + (Options.Colors.ReportDefeat || '#CC0000') + '"><B> ' + tx('Winner') + '</B></FONT>';
			m += '<br>';
			if (rpt.side1AllianceId && (rpt.side1AllianceId != 0)) m += uW.g_js_strings.commonstr.alliance + ':&nbsp;<span style=' + DiplomacyColours(rpt.side1AllianceId) + '>' + rpt.side1AllianceName + '</span><br>';
			if (rpt.side1PlayerId && (rpt.side1PlayerId != 0)) m += 'UID:&nbsp;' + MonitorLinkUID(rpt.side1PlayerId) + '<br>';
			if (rpt.marchName == uW.g_js_strings.commonstr.attack || rpt.marchName == uW.g_js_strings.commonstr.defend)
				m += tx('Knight Combat Skill') + ': ' + rslt['s1KCombatLv'] + '<br>';
			if (rslt['s1spell'] && (rslt['s1spell'] != "0")) {
				m += tx('Spell Used') + ': <b>' + uW.g_js_strings.spells['name_' + rslt['s1spell']] + '</b><br>';
			}
			m += '<span id=atkmightlost>&nbsp;</span></div>';
			//summary - defender
			m += '<div style="width:50%;float:left;">';
			m += '<B>' + tx('Defenders') + '</B> ' + rpt.side0Name + ' (<A class=xlink onclick="btGotoMapRpt(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a>) ';
			if (rslt['winner'] == 0)
				m += '<FONT color="' + (Options.Colors.ReportDefeat || '#CC0000') + '"><B> ' + tx('Winner') + '</B></FONT>';
			m += '<br>';
			if (rpt.side0AllianceId && (rpt.side0AllianceId != 0)) m += uW.g_js_strings.commonstr.alliance + ':&nbsp;<span style=' + DiplomacyColours(rpt.side0AllianceId) + '>' + rpt.side0AllianceName + '</span><br>';
			if (rpt.side0PlayerId && (rpt.side0PlayerId != 0)) m += 'UID:' + MonitorLinkUID(rpt.side0PlayerId) + '<br>';
			if (rpt.marchName == uW.g_js_strings.commonstr.attack || rpt.marchName == uW.g_js_strings.commonstr.defend)
				m += tx('Knight Combat Skill') + ': ' + rslt['s0KCombatLv'] + '<br>';
			if (rslt['s0spell'] && (rslt['s0spell'] != "0")) {
				m += tx('Spell Used') + ': <b>' + uW.g_js_strings.spells['name_' + rslt['s0spell']] + '</b><br>';
			}
			if (rslt['fght']["s0"] && rpt.side0PlayerId && (rpt.side0PlayerId != 0)) {
				m += '<span id=defmightlost>&nbsp;</span><br>';
			}
			if (rslt['rnds']) m += tx('Rounds') + ': ' + rslt['rnds'] + '<br>';
			if (rslt['darkForestConflict']) {
				m += uW.g_js_strings.report_view.darkForestConflict;
			} else {
				if (rpt.marchName == uW.g_js_strings.commonstr.attack || rpt.marchName == uW.g_js_strings.commonstr.defend) {
					if (rpt.side0TileTypeText != tx('City') && rpt.side0TileTypeText != tx('Barb Camp')) {
						if (rslt['conquered'] != 0)
							m += tx('Attackers conquered the') + ' ' + rpt.side0TileTypeText + '.';
						else if (rslt['conquered'] == 0)
							m += tx('Attackers did not conquer the') + ' ' + rpt.side0TileTypeText + '.';
					} else {
						if (rslt['wall']) {
							if (rslt['wall'] == 100)
								m += tx('Attackers breached the walls') + '.';
							else
								m += tx('Attackers did not breach the walls') + '. ' + tx('The walls are') + ' ' + rslt['wall'] + '% ' + tx('damaged');
						}
					}
				}
			}
			m += '</div>';
			m += '</div>'; //end battlesummary div
			//troops
			m += '<div id=battleTroopsContainer style="clear:both">';
			//troops - attacker
			m += '<div style="width:50%;float:left;"><TABLE cellspacing=0 class=ptTab width=100%>';
			if (rslt['fght']["s1"]) {
				m += '<TR><TH class=xtabHD></TH><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.troops + '</TH><TH class=xtabHD align=center>' + tx('Fought') + '</TH><TH class=xtabHD align=center>' + tx('Survived') + '</TH><TH class=xtabHD align=center>' + tx('Killed') + '</TH></TR>';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (rslt['fght']["s1"]['u' + i]) {
						m += formatTroopLine("s1", i, false, rslt['fght']["s1"]['u' + i][0], rslt['fght']["s1"]['u' + i][1]);
					}
				}
			}
			m += '</table></div>';
			//troops - defender
			m += '<div style="width:50%;float:left;">';
			m += '<TABLE cellspacing=0 class=ptTab width=100%>';
			if (rslt['fght']["s0"]) {
				m += '<TR><TH class=xtabHD></TH><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.troops + '</TH><TH class=xtabHD align=center>' + tx('Fought') + '</TH><TH class=xtabHD align=center>' + tx('Survived') + '</TH><TH class=xtabHD align=center>' + tx('Killed') + '</TH></TR>';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (rslt['fght']["s0"]['u' + i] && rslt['fght']["s0"]['u' + i][0] != null) {
						m += formatTroopLine("s0", i, rslt.overwhelmed, rslt['fght']["s0"]['u' + i][0], rslt['fght']["s0"]['u' + i][1]);
					}
				}
				for (var i = 53; i <= 55; i++) {
					if (rslt['fght']["s0"]['f' + i]) {
						m += formatTroopLine("s0", i, rslt.overwhelmed, rslt['fght']["s0"]['f' + i][0], rslt['fght']["s0"]['f' + i][1]);
					}
				}
				for (var i = 60; i <= 63; i++) {
					if (rslt['fght']["s0"]['f' + i]) {
						m += formatTroopLine("s0", i, rslt.overwhelmed, rslt['fght']["s0"]['f' + i][0], rslt['fght']["s0"]['f' + i][1]);
					}
				}
				for (var i = 99; i <= 100; i++) {
					if (rslt['fght']["s0"]['u' + i] && rslt['fght']["s0"]['u' + i][0] != null) {
						m += formatTroopLine("s0", i, rslt.overwhelmed, rslt['fght']["s0"]['u' + i][0], rslt['fght']["s0"]['u' + i][1]);
					}
				}
				for (var i = 101; i <= 110; i++) {
					if (rslt['fght']["s0"]['m' + i]) {
						m += formatTroopLine("s0", i, rslt.overwhelmed, rslt['fght']["s0"]['m' + i][0], rslt['fght']["s0"]['m' + i][1]);
					}
				}
			}
			else {
				m += '<TR><TD>' + tx('No Troops Defended') + '</TD></TR>';
			}
			m += '</table>';
			m += '</div>';
			m += '</div>'; //end troops div
			m += '<div style="clear:both"></div>';
			return m;
		}

		function formatTroopStat(Attr, name, spelltitle, unitId, pulseHits) {
			var TroopString = '';
			var TroopStyle = '';
			var TroopTitle = '';
			if (Attr) {
				if (Attr[0] < Attr[1]) TroopStyle = 'color:green';
				if (Attr[1] < Attr[0]) TroopStyle = 'color:red';
				if (Attr[1] != Attr[0] && Attr[0] != 0) TroopTitle = 'title="' + Math.round((Attr[1] - Attr[0]) / Math.round(Attr[0]) * 100 * 100) / 100 + '%"';
				if (spelltitle) {
					if (unitId == 38 || unitId == 49) {
						TroopTitle = 'title="' + uW.g_js_strings.report_view["spellcaster" + unitId].replace("%2$s", addCommas(Math.round(Attr[1] * 100) / 100)) + '"';
						if (unitId == 38) { TroopTitle = TroopTitle.replace("%1$s%", pulseHits); }
						else { TroopTitle = TroopTitle.replace("%1$s", pulseHits); }
					}
					else {
						if (unitId == 41) {
							TroopTitle = 'title="' + uW.g_js_strings.report_view["spellcaster" + unitId].replace("%2$s", addCommas(Math.round(Attr[1] * 100) / 100)) + '"';
							TroopTitle = TroopTitle.replace("%1$s", addCommas(Math.round(pulseHits * 100) / 100));
						}
						else {
							if (unitId == 39 || unitId == 40 || unitId == 43) {
								TroopTitle = 'title="' + uW.g_js_strings.report_view["spellcaster" + unitId].replace("%1$s%", addCommas(pulseHits)) + '"';
							}
							else {
								TroopTitle = 'title="' + uW.g_js_strings.report_view["spellcaster" + unitId].replace("%1$s", addCommas(Math.round(Attr[1] * 100) / 100)) + '"';
							}
						}
					}
				}
				if (unitId == 38 || unitId == 49) { TroopString = '<td style="width:33%;" align=left ' + TroopTitle + '><font size="1"><b>' + tx(name) + ': </b><span style="' + TroopStyle + '">' + pulseHits + '&nbsp;/&nbsp;' + addCommas(Math.round(Attr[1] * 100) / 100) + '%</span></font></td>'; }
				else {
					if (unitId == 41) { TroopString = '<td style="width:33%;" align=left ' + TroopTitle + '><font size="1"><b>' + tx(name) + ': </b><span style="' + TroopStyle + '">' + addCommas(Math.round(pulseHits * 100) / 100) + '%&nbsp;/&nbsp;' + addCommas(Math.round(Attr[1] * 100) / 100) + '%</span></font></td>'; }
					else {
						if (unitId == 39 || unitId == 40 || unitId == 43) { TroopString = '<td style="width:33%;" align=left ' + TroopTitle + '><font size="1"><b>' + tx(name) + ': </b><span style="' + TroopStyle + '">' + addCommas(pulseHits) + '</span></font></td>'; }
						else { TroopString = '<td style="width:33%;" align=left ' + TroopTitle + '><font size="1"><b>' + tx(name) + ': </b><span style="' + TroopStyle + '">' + addCommas(Math.round(Attr[1] * 100) / 100) + '</span></font></td>'; }
					}
				}
			}
			return TroopString;
		};

		function buildTroopStats() {
			var m = '';
			if (rslt['bonus']) {
				//header
				m += '<a id=reportTroopStatsHdr class=divLink ><div class="divHeader" align=left><img id=reportTroopStatsArrow height="10" src="' + RightArrow + '">&nbsp;' + uW.g_js_strings.report_view.troop_stats.toUpperCase() + '</div></a>';
				//stats
				m += '<div id=reportTroopStats class="divHide">';
				//troops - attacker - stats
				m += '<div style="width:50%;float:left;">';
				if (rslt['fght']["s1"]) {
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (rslt['fght']["s1"]['u' + i] && rslt['bonus']['mod']["s1"]['u' + i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['hp'], 'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['atk'], 'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['def'], 'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['spd'], 'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['rng'], 'Rng');
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['ld'], 'Ld');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['sp'], 'Spell');
							if (i == 38) {
								m += formatTroopStat([rslt['bonus']['mod']['s1']['u' + i]['pulseBuff'], rslt['bonus']['mod']['s1']['u' + i]['pulseBuff']], 'Effect', true, i, rslt['bonus']['mod']['s1']['u' + i]['pulseHits']);
							}
							else {
								if (i == 41) {
									m += formatTroopStat([rslt['bonus']['mod']['s1']['u' + i]['troopSpeedBuff'], rslt['bonus']['mod']['s1']['u' + i]['troopSpeedBuff']], 'Effect', true, i, rslt['bonus']['mod']['s1']['u' + i]['troopLoadBuff']);
								}
								else {
									if (i == 39) {
										m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['spellEffect'], 'Effect', true, i, rslt['bonus']['mod']['s1']['u' + i]['lWitchHits']);
									}
									else {
										if (i == 40) {
											m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['spellEffect'], 'Effect', true, i, rslt['bonus']['mod']['s1']['u' + i]['draHits']);
										}
										else {
											if (i == 43) {
												m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['spellEffect'], 'Effect', true, i, rslt['bonus']['mod']['s1']['u' + i]['giantHits']);
											}
											else {
												if (i == 49) {
													m += formatTroopStat([rslt['bonus']['mod']['s1']['u' + i]['curseBuff'], rslt['bonus']['mod']['s1']['u' + i]['curseBuff']], 'Effect', true, i, rslt['bonus']['mod']['s1']['u' + i]['curseHits']);
												}
												else {
													m += formatTroopStat(rslt['bonus']['mod']['s1']['u' + i]['spellEffect'], 'Effect', true, i);
												}
											}
										}
									}
								}
							}
							m += '</tr></table></div>';
						}
					}
				}
				m += '</div>';
				//troops - defender - stats
				m += '<div style="width:50%;float:left;">';
				if (rslt['fght']["s0"]) {
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (rslt['fght']["s0"]['u' + i] && rslt['bonus']['mod']["s0"]['u' + i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['hp'], 'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['atk'], 'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['def'], 'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['spd'], 'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['rng'], 'Rng');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['sp'], 'Spell');
							if (i == 38) {
								m += formatTroopStat([rslt['bonus']['mod']['s0']['u' + i]['pulseBuff'], rslt['bonus']['mod']['s0']['u' + i]['pulseBuff']], 'Effect', true, i, rslt['bonus']['mod']['s0']['u' + i]['pulseHits']);
							}
							else {
								if (i == 41) {
									m += formatTroopStat([rslt['bonus']['mod']['s0']['u' + i]['troopSpeedBuff'], rslt['bonus']['mod']['s0']['u' + i]['troopSpeedBuff']], 'Effect', true, i, rslt['bonus']['mod']['s0']['u' + i]['troopLoadBuff']);
								}
								else {
									if (i == 39) {
										m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['spellEffect'], 'Effect', true, i, rslt['bonus']['mod']['s0']['u' + i]['lWitchHits']);
									}
									else {
										if (i == 40) {
											m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['spellEffect'], 'Effect', true, i, rslt['bonus']['mod']['s0']['u' + i]['draHits']);
										}
										else {
											if (i == 43) {
												m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['spellEffect'], 'Effect', true, i, rslt['bonus']['mod']['s0']['u' + i]['giantHits']);
											}
											else {
												if (i == 49) {
													m += formatTroopStat([rslt['bonus']['mod']['s0']['u' + i]['curseBuff'], rslt['bonus']['mod']['s0']['u' + i]['curseBuff']], 'Effect', true, i, rslt['bonus']['mod']['s0']['u' + i]['curseHits']);
												}
												else {
													m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['spellEffect'], 'Effect', true, i);
												}
											}
										}
									}
								}
							}
							m += '</tr></table></div>';
						}
					}
					for (var i = 53; i <= 55; i++) {
						if (rslt['fght']["s0"]['f' + i] && rslt['bonus']['mod']['s0']['f' + i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['hp'], 'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['atk'], 'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['def'], 'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['spd'], 'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['rng'], 'Rng');
							m += '</tr></table></div>';
						}
					}
					for (var i = 60; i <= 63; i++) {
						if (rslt['fght']["s0"]['f' + i] && rslt['bonus']['mod']['s0']['f' + i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['hp'], 'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['atk'], 'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['def'], 'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['spd'], 'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['f' + i]['rng'], 'Rng');
							m += '</tr></table></div>';
						}
					}
					for (var i = 99; i <= 100; i++) {
						if (rslt['fght']["s0"]['u' + i] && rslt['bonus']['mod']["s0"]['u' + i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['hp'], 'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['atk'], 'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['def'], 'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['spd'], 'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['u' + i]['rng'], 'Rng');
							m += '</tr></table></div>';
						}
					}
					for (var i = 101; i <= 110; i++) {
						if (rslt['fght']["s0"]['m' + i] && rslt['bonus']['mod']['s0']['m' + i]) {
							m += '<div style="float:left;width:10%;clear:both;">' + unitImg[i] + '</div>';
							m += '<div style="float:left;width:90%;"><table class=ptTab width=100%><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m' + i]['hp'], 'HP');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m' + i]['atk'], 'Atk');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m' + i]['def'], 'Def');
							m += '</tr><tr>';
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m' + i]['spd'], 'Spd');
							m += formatTroopStat(rslt['bonus']['mod']['s0']['m' + i]['rng'], 'Rng');
							m += '</tr></table></div>';
						}
					}
				}
				m += '</div>';
				m += '<div style="clear:both">&nbsp;</div>';
				m += '</div>'; //end reportTroopStats div
			}
			return m;
		}

		function buildChampDuel() {
			var m = '';
			if (rslt['champion_stats']) {
				s1name = rslt.champion_stats['s1'].nam;
				s1win = rslt.champion_stats['s1'].won;
				s1percent = Math.round(1000 * parseIntNan(rslt.champion_stats['s1'].hpr) / parseIntNan(rslt.champion_stats['s1'].hpm)) / 10;
				s0name = rslt.champion_stats['s0'].nam;
				s0win = rslt.champion_stats['s0'].won;
				s0percent = Math.round(1000 * parseIntNan(rslt.champion_stats['s0'].hpr) / parseIntNan(rslt.champion_stats['s0'].hpm)) / 10;
				if ((s1name != '') || (s0name != '') || s1win || s0win) {
					//header
					m += '<a id=reportChampDuelHdr class=divLink ><div class="divHeader" align=left><img id=reportChampDuelArrow height="10" src="' + DownArrow + '">&nbsp;' + tx('Champion Duel').toUpperCase() + '</div></a>';
					//summary
					m += '<div id=reportChampDuel>';
					m += '<div id=ChampStatContainer>';
					m += '<div style="width:50%;float:left;">';
					if ((s1name == '') && (s1win || s0win)) {
						s1name = uW.g_js_strings.champ.no_champ;
					}
					if (s1win) {
						s1name += '&nbsp;(' + tx('Winner') + ')';
					}
					m += '<b>' + s1name + '</b><br>';
					for (var i = 1; i < chEffect.length; i++) {
						if (rslt.champion_stats['s1'][chEffect[i]]) {
							m += chEffectName[i] + ': ' + rslt.champion_stats['s1'][chEffect[i]];
							if (i == 1 && s1win) m += ' <span class=boldGreen>(' + s1percent + '%)</span>';
							m += '<br>';
						}
					}
					m += '</div>'; //attacker
					m += '<div style="width:50%;float:left;">';
					if ((s0name == '') && (s1win || s0win)) {
						s0name = uW.g_js_strings.champ.no_champ;
					}
					if (s0win) {
						s0name += '&nbsp;(' + tx('Winner') + ')';
					}
					m += '<b>' + s0name + '</b><br>';
					for (var i = 1; i < chEffect.length; i++) {
						if (rslt.champion_stats['s0'][chEffect[i]]) {
							m += chEffectName[i] + ': ' + rslt.champion_stats['s0'][chEffect[i]];
							if (i == 1 && s0win) m += ' <span class=boldGreen>(' + s0percent + '%)</span>';
							m += '<br>';
						}
					}
					m += '</div>'; //defender
					m += '</div>'; //ChampStatContainer
					m += '<div style="clear:both">&nbsp;</div>';
					if (rslt.bonus) {
						if (rslt.bonus['chp']) {
							m += '<div id=ChampAdjContainer style="clear:both">';
							m += '<div style="width:50%;float:left;">';
							m += '<b>' + tx('Champion Adjustments') + '</b><br><TABLE class=ptTab width=100%>';
							if (rslt.bonus['chp']['s0'] || rslt.bonus['chp']['s1']) {
								for (var i in uW.cm.thronestats.tiers) {
									trEffect[i] = uW.g_js_strings.throneRoom["effectName_" + i];
									var TRStyles = getTREffectStyle(i);
									if (rslt.bonus['chp']['s1'] && rslt.bonus['chp']['s1'][0][i]) {
										m += '<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] + ': ' + (Math.round(rslt.bonus['chp']['s1'][0][i] * 100) / 100) + TRStyles.EndStyle + '</TD></TR>';
									}
									if (rslt.bonus['chp']['s0'] && rslt.bonus['chp']['s0'][1][i]) {
										m += '<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] + ': ' + (Math.round(rslt.bonus['chp']['s0'][1][i] * 100) / 100) + TRStyles.EndStyle + '</TD></TR>';
									}
								}
							}
							m += '</table></br>'
							m += '</div>';//attacker
							m += '<div style="width:50%;float:left;">';
							m += '<b>' + tx('Champion Adjustments') + '</b><br><TABLE class=ptTab width=100%>';
							if (rslt.bonus['chp']['s0'] || rslt.bonus['chp']['s1']) {
								for (var i in uW.cm.thronestats.tiers) {
									trEffect[i] = uW.g_js_strings.throneRoom["effectName_" + i];
									var TRStyles = getTREffectStyle(i);
									if (rslt.bonus['chp']['s0'] && rslt.bonus['chp']['s0'][0][i]) {
										m += '<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] + ': ' + (Math.round(rslt.bonus['chp']['s0'][0][i] * 100) / 100) + TRStyles.EndStyle + '</TD></TR>';
									}
									if (rslt.bonus['chp']['s1'] && rslt.bonus['chp']['s1'][1][i]) {
										m += '<TR><TD colspan=4>' + TRStyles.LineStyle + trEffect[i] + ': ' + (Math.round(rslt.bonus['chp']['s1'][1][i] * 100) / 100) + TRStyles.EndStyle + '</TD></TR>';
									}
								}
							}
							m += '</table></br>'
							m += '</div>';//defender
							m += '</div>';//ChampAdjContainer
							m += '<div style="clear:both">&nbsp;</div>';
						}
					}
					m += '</div>'; //reportChampDuel
				}
			}
			return m;
		}

		function buildThroneStats() {
			var m = '';
			//header
			m += '<a id=reportThroneHdr class=divLink ><div class="divHeader" align=left><img id=reportThroneArrow height="10" src="' + DownArrow + '">&nbsp;' + tx('Throne Stats').toUpperCase() + '</div></a>';
			//summary
			m += '<div id=reportThrone>';
			m += '<div style="width:50%;float:left;">';

			var SortOrder = [];
			if (Options.AlternateSortOrder) { for (var z in AlternateSortOrder) SortOrder.push(AlternateSortOrder[z]); }
			else { for (var z in trEffect) SortOrder.push(z); }

			if (rslt['s1ThroneRoomBoosts']) {
				for (var id in rslt['s1ThroneRoomBoosts']) {
					if (CompositeEffects.hasOwnProperty(id)) {
						var Composite = CompositeEffects[id]
						for (var e = 0; e < Composite.length; e++) {
							if (!rslt['s1ThroneRoomBoosts'][Composite[e]]) rslt['s1ThroneRoomBoosts'][Composite[e]] = 0;
							rslt['s1ThroneRoomBoosts'][Composite[e]] += rslt['s1ThroneRoomBoosts'][id];
						}
						delete rslt['s1ThroneRoomBoosts'][id];
					}
				}
				for (var z in SortOrder) {
					var i = SortOrder[z];
					if (rslt['s1ThroneRoomBoosts'][i]) {
						var TRStyles = getTREffectStyle(i);
						m += TRStyles.LineStyle + trEffect[i] + ': ' + rslt['s1ThroneRoomBoosts'][i] + '%' + TRStyles.EndStyle + '</span><br>';
					}
				}
			}
			else { m += '&nbsp;'; }
			m += '</div>'; //attacker
			m += '<div style="width:50%;float:left;">';
			if (rslt['s0ThroneRoomBoosts']) {
				for (var id in rslt['s0ThroneRoomBoosts']) {
					if (CompositeEffects.hasOwnProperty(id)) {
						var Composite = CompositeEffects[id]
						for (var e = 0; e < Composite.length; e++) {
							if (!rslt['s0ThroneRoomBoosts'][Composite[e]]) rslt['s0ThroneRoomBoosts'][Composite[e]] = 0;
							rslt['s0ThroneRoomBoosts'][Composite[e]] += rslt['s0ThroneRoomBoosts'][id];
						}
						delete rslt['s0ThroneRoomBoosts'][id];
					}
				}
				for (var z in SortOrder) {
					var i = SortOrder[z];
					if (rslt['s0ThroneRoomBoosts'][i]) {
						var TRStyles = getTREffectStyle(i);
						m += TRStyles.LineStyle + trEffect[i] + ': ' + rslt['s0ThroneRoomBoosts'][i] + '%' + TRStyles.EndStyle + '</span><br>';
					}
				}
			}
			else { m += '&nbsp;'; }
			m += '</div>'; //defender
			m += '<div style="clear:both">&nbsp;</div>';
			m += '</div>'; //throne container
			return m;
		}

		function buildBoosts() {
			var m = '';
			//header
			m += '<a id=reportBoostsHdr class=divLink ><div class="divHeader" align=left><img id=reportBoostsArrow height="10" src="' + DownArrow + '">&nbsp;' + tx('Troop Adjustments').toUpperCase() + '</div></a>';
			//summary
			m += '<div id=reportBoosts>';
			if (rslt['s1atkBoost'] || rslt['s1defBoost'] || rslt['s1lifeBoost'] || rslt['s0atkBoost'] || rslt['s0defBoost'] || rslt['s0lifeBoost']) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Item Boosts') + '</b><br>';
				if (rslt['s1atkBoost'])
					m += tx('Attack Boosted') + ': ' + 100 * rslt['s1atkBoost'] + '%<br>';
				if (rslt['s1defBoost'])
					m += tx('Defence Boosted') + ': ' + 100 * rslt['s1defBoost'] + '%<br>';
				if (rslt['s1lifeBoost'])
					m += tx('Health Boosted') + ': ' + 100 * rslt['s1lifeBoost'] + '%<br>';
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Item Boosts') + '</b><br>';
				if (rslt['s0atkBoost'])
					m += tx('Attack Boosted') + ': ' + 100 * rslt['s0atkBoost'] + '%<br>';
				if (rslt['s0defBoost'])
					m += tx('Defence Boosted') + ': ' + 100 * rslt['s0defBoost'] + '%<br>';
				if (rslt['s0lifeBoost'])
					m += tx('Health Boosted') + ': ' + 100 * rslt['s0lifeBoost'] + '%<br>';
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt['arcaneBonus'] && (rslt['arcaneBonus']['s0AllianceBonus'] || rslt['arcaneBonus']['s1AllianceBonus'])) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Arcane Temple Boosts') + ' (' + tx('Alliance') + ')</b><br>';
				if (rslt['arcaneBonus']['s1AllianceBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s1AllianceBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i' + ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i' + ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Arcane Temple Boosts') + ' (' + tx('Alliance') + ')</b><br>';
				if (rslt['arcaneBonus']['s0AllianceBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s0AllianceBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i' + ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i' + ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt['arcaneBonus'] && (rslt['arcaneBonus']['s0PersonalBonus'] || rslt['arcaneBonus']['s1PersonalBonus'])) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Arcane Temple Boosts') + ' (' + tx('Personal') + ')</b><br>';
				if (rslt['arcaneBonus']['s1PersonalBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s1PersonalBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i' + ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i' + ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Arcane Temple Boosts') + ' (' + tx('Personal') + ')</b><br>';
				if (rslt['arcaneBonus']['s0PersonalBonus']) {
					var ArcBonus = rslt['arcaneBonus']['s0PersonalBonus'];
					for (var z in ArcBonus) {
						if (ArcBonus.hasOwnProperty(z)) {
							var ArcName = uW.itemlist['i' + ArcBonus[z].itemId].name + ' - ' + uW.itemlist['i' + ArcBonus[z].itemId].description;
							m += ArcName + ': ' + ArcBonus[z].effect + '%<br>';
						}
					}
				}
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt['s1guardianAtkBoost'] || rslt['s1guardianDefBoost'] || rslt['s1guardianMarchBoost'] || rslt['s1guardianTrainBoost'] || rslt['s0guardianAtkBoost'] || rslt['s0guardianDefBoost'] || rslt['s0guardianMarchBoost'] || rslt['s0guardianTrainBoost']) {
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Guardian Boosts') + '</b><br>';
				if (rslt['s1guardianAtkBoost'])
					m += tx('Guardian Attack Boost') + ': ' + parseFloat(100 * rslt['s1guardianAtkBoost']).toFixed(1) + '%<br>';
				if (rslt['s1guardianDefBoost'])
					m += tx('Guardian Life Boost') + ': ' + parseFloat(100 * rslt['s1guardianDefBoost']).toFixed(1) + '%<br>';
				if (rslt['s1guardianMarchBoost'])
					m += tx('Guardian March Speed Boost') + ': ' + parseFloat(100 * rslt['s1guardianMarchBoost']).toFixed(1) + '%<br>';
				if (rslt['s1guardianTrainBoost'])
					m += tx('Guardian Training Boost') + ': ' + parseFloat(100 * rslt['s1guardianTrainBoost']).toFixed(1) + '%<br>';
				m += '</div>'; //attacker
				m += '<div style="width:50%;float:left;">';
				m += '<b>' + tx('Guardian Boosts') + '</b><br>';
				if (rslt['s0guardianAtkBoost'])
					m += tx('Guardian Attack Boost') + ': ' + parseFloat(100 * rslt['s0guardianAtkBoost']).toFixed(1) + '%<br>';
				if (rslt['s0guardianDefBoost'])
					m += tx('Guardian Life Boost') + ': ' + parseFloat(100 * rslt['s0guardianDefBoost']).toFixed(1) + '%<br>';
				if (rslt['s0guardianMarchBoost'])
					m += tx('Guardian March Speed Boost') + ': ' + parseFloat(100 * rslt['s0guardianMarchBoost']).toFixed(1) + '%<br>';
				if (rslt['s0guardianTrainBoost'])
					m += tx('Guardian Training Boost') + ': ' + parseFloat(100 * rslt['s0guardianTrainBoost']).toFixed(1) + '%<br>';
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			if (rslt.bonus) {
				if (rslt.bonus['tch'] || rslt.bonus['tch2']) {
					m += '<div style="width:50%;float:left;">';
					m += '<b>' + tx('Research') + '</b><br>';
					if (rslt.bonus['tch']) {
						for (var t1l in rslt.bonus.tch.s1) {
							var normaltech = '';
							if (t1l == 'hp') normaltech = tx('Health');
							if (t1l == 'atk') normaltech = uW.g_js_strings.commonstr.attack;
							if (t1l == 'def') normaltech = uW.g_js_strings.commonstr.defense;
							if (t1l == 'spd') normaltech = tx('Speed');
							if (t1l == 'rng') normaltech = tx('Range');
							if (t1l == 'ld') normaltech = tx('Load');
							if (normaltech != '')
								m += normaltech + ': ' + parseFloat(rslt.bonus.tch.s1[t1l] * 100).toFixed(0) + '%<br>';
						}
					}
					if (rslt.bonus['tch2']) {
						for (var t2l in rslt.bonus.tch2.s1) {
							var britontech = '';
							if (t2l == 'ic') britontech = uW.g_js_strings.commonstr.improved;
							if (t2l == 'id') britontech = uW.g_js_strings.commonstr.improved_def;
							if (t2l == 'sr') britontech = uW.g_js_strings.commonstr.strengthen_ranks;
							if (t2l == 'if') britontech = uW.g_js_strings.commonstr.improved_fletching;
							if (britontech != '')
								m += britontech + ': ' + parseFloat(rslt.bonus.tch2.s1[t2l] * 100).toFixed(0) + '%<br>';
						}
					}
					m += '</div>'; //attacker
					m += '<div style="width:50%;float:left;">';
					m += '<b>' + tx('Research') + '</b><br>';
					if (rslt.bonus['tch']) {
						for (var t1l in rslt.bonus.tch.s0) {
							var normaltech = '';
							if (t1l == 'hp') normaltech = tx('Health');
							if (t1l == 'atk') normaltech = uW.g_js_strings.commonstr.attack;
							if (t1l == 'def') normaltech = uW.g_js_strings.commonstr.defense;
							if (t1l == 'spd') normaltech = tx('Speed');
							if (t1l == 'rng') normaltech = tx('Range');
							if (normaltech != '')
								m += normaltech + ': ' + parseFloat(rslt.bonus.tch.s0[t1l] * 100).toFixed(0) + '%<br>';
						}
					}
					if (rslt.bonus['tch2']) {
						for (var t2l in rslt.bonus.tch2.s0) {
							var britontech = '';
							if (t2l == 'ic') britontech = uW.g_js_strings.commonstr.improved;
							if (t2l == 'id') britontech = uW.g_js_strings.commonstr.improved_def;
							if (t2l == 'sr') britontech = uW.g_js_strings.commonstr.strengthen_ranks;
							if (t2l == 'if') britontech = uW.g_js_strings.commonstr.improved_fletching;
							if (britontech != '')
								m += britontech + ': ' + parseFloat(rslt.bonus.tch2.s0[t2l] * 100).toFixed(0) + '%<br>';
						}
					}
				}
				m += '</div>'; //defender
				m += '<div style="clear:both">&nbsp;</div>';
			}
			m += '</div>'; //boosts
			m += '<div style="clear:both"></div>';
			return m;
		}

		function handleLoot() {
			var m = '';
			if (rslt['loot'] || rslt['throneRoomDrop'] || rslt['equipmentDrop'] || rslt['lootJewel']) {
				m += '<div class="divHeader" align=left>' + uW.g_js_strings.commonstr.loot.toUpperCase() + '</div>';
				if (rslt['loot']) {
					m += '<TABLE style="width:100%;" class=ptTab>';
					m += '<TR><TD style="width:18%">' + GameIcons.goldImgTiny + '&nbsp;';
					if (rslt['loot'][0] > 0)
						m += addCommas(parseFloat(rslt['loot'][0]).toFixed(0)) + '</TD>';
					else
						m += '0</td>'
					m += '<TD style="width:18%">' + GameIcons.foodImgTiny + '&nbsp;';
					if (rslt['loot'][1] > 0)
						m += addCommas(parseFloat(rslt['loot'][1]).toFixed(0)) + '</TD>';
					else
						m += '0</TD>';
					m += '<TD style="width:18%">' + GameIcons.woodImgTiny + '&nbsp;';
					if (rslt['loot'][2] > 0)
						m += addCommas(parseFloat(rslt['loot'][2]).toFixed(0)) + '</TD>';
					else
						m += '0</td>'
					m += '<TD style="width:18%">' + GameIcons.stoneImgTiny + '&nbsp;';
					if (rslt['loot'][3] > 0)
						m += addCommas(parseFloat(rslt['loot'][3]).toFixed(0)) + '</TD>';
					else
						m += '0</TD>';
					m += '<TD style="width:18%">' + GameIcons.oreImgTiny + '&nbsp;';
					if (rslt['loot'][4] > 0)
						m += addCommas(parseFloat(rslt['loot'][4]).toFixed(0)) + '</TD>';
					else
						m += '0</td>'
					m += '<TD style="width:15%">' + GameIcons.astoneImgTiny + '&nbsp;';
					if (rslt['loot'][6] > 0)
						m += addCommas(parseFloat(rslt['loot'][6]).toFixed(0)) + '</TD>';
					else {
						m += '0</TD>';
					}
					m += '</tr>'
				}
				if ((rslt['loot'] && rslt['loot'][5]) || rslt['throneRoomDrop'] || rslt['equipmentDrop'] || rslt['lootJewel']) {
					var itemdetails = '';
					var thronedetails = '';
					var equipdetails = '';
					var jeweldetails = '';
					if (rslt['loot'] && rslt['loot'][5] && JSON2.stringify(rslt['loot'][5]) != '[]') { // crapola
						var D = true;
						if (parseInt(rpt.side0TileType) == 57) {
							D = ((rslt['winner'] == 1 && rpt.sideId == 1) || (rslt['winner'] == 0 && rpt.sideId == 0));
						}
						if (D) {
							for (var item in rslt['loot'][5]) {
								var amt = "";
								if (rslt['loot'][5][item] != 1) { amt = ' (' + rslt['loot'][5][item] + ')'; }
								var itemurl = parseInt(item);
								if (itemurl > 30669 && itemurl < 32111) itemurl = 30303;
								itemdetails += '<img class=btIcon style="width:20px;" src="' + getItemImageURL(itemurl) + '">&nbsp;' + uW.itemlist['i' + item].name + amt + '&nbsp;&nbsp;&nbsp;';
							}
						}
					}
					if (rslt['throneRoomDrop']) {
						var TR = rslt['throneRoomDrop'];
						var thronename = CardQuality(TR.quality) + " " + uW.g_js_strings.throneRoom[TR.type] + " " + uW.g_js_strings.commonstr.of + " " + uW.g_js_strings.effects["suffix_" + TR.effects.slot5.id] + " (" + uW.g_js_strings.commonstr[TR.faction] + ")";

						var TRCard = {};
						TRCard.id = TR.id;
						TRCard.name = CardQuality(TR.quality) + " " + uW.g_js_strings.throneRoom[TR.type] + " " + uW.g_js_strings.commonstr.of + " " + uW.g_js_strings.effects["suffix_" + TR.effects.slot5.id];
						TRCard.faction = TR.faction;
						TRCard.type = TR.type;
						TRCard.unique = parseIntNan(TR.unique);
						TRCard.level = TR.level;
						TRCard.quality = TR.quality;
						TRCard.createPrefix = function () { return ""; };
						TRCard.createSuffix = function () { return ""; };
						TRCard.effects = {};
						var slot = 0;
						for (var k in TR.effects) {
							slot++
							TRCard.effects["slot" + slot] = {};
							TRCard.effects["slot" + slot].id = TR.effects[k].id;
							TRCard.effects["slot" + slot].tier = TR.effects[k].tier;
						}
						thronedetails += '<span class=tooldesc><img class=btIcon style="width:20px;" src="' + IMGURL + 'throne/icons/30/' + TR.faction + '/' + TR.faction + '_' + TR.type + '_normal_1_' + TR.quality + '.png" >&nbsp;' + thronename + '<span class="tooltip" style="white-space: pre-line; word-wrap: break-word;">' + Tabs.Reference.DisplayTRCard(TRCard, false) + '</span></span>&nbsp;&nbsp;&nbsp;';
					}
					if (rslt['equipmentDrop']) {
						var EQ = rslt['equipmentDrop'];
						var equipname = CardQuality(EQ.rarity) + " " + uW.g_js_strings.champ[chTypeStrings[parseInt(EQ.type) - 1]] + " " + uW.g_js_strings.commonstr.of + " " + uW.g_js_strings.effects["suffix_" + EQ["effects"][5]["id"]] + " (" + uW.g_js_strings.commonstr[cardFaction[EQ.faction - 1]] + ")";

						var CHCard = {};
						CHCard.id = EQ.equipmentId;
						CHCard.name = CardQuality(EQ.rarity) + " " + uW.g_js_strings.champ[chTypeStrings[parseInt(EQ.type) - 1]] + " " + uW.g_js_strings.commonstr.of + " " + uW.g_js_strings.effects["suffix_" + EQ["effects"][5]["id"]];
						CHCard.faction = EQ.faction;
						CHCard.type = EQ.type;
						CHCard.unique = parseIntNan(EQ.itemId);
						CHCard.level = EQ.level;
						CHCard.rarity = EQ.rarity;
						CHCard.createPrefix = function () { return ""; };
						CHCard.createSuffix = function () { return ""; };
						CHCard.effects = {};
						var slot = 0;
						for (var k in EQ.effects) {
							slot++
							CHCard.effects["slot" + slot] = {};
							CHCard.effects["slot" + slot].id = EQ.effects[k].id;
							CHCard.effects["slot" + slot].tier = EQ.effects[k].tier;
						}
						equipdetails += '<span class=tooldesc><img class=btIcon style="width:20px;" src="' + IMGURL + 'champion_hall/' + cardQuality[EQ.rarity].toLowerCase() + '_' + champImageTypes[EQ.type - 1] + '_' + cardFaction[EQ.faction - 1] + '_30x30.png">&nbsp;' + equipname + '<span class="tooltip" style="white-space: pre-line; word-wrap: break-word;">' + Tabs.Reference.DisplayCHCard(CHCard, false) + '</span></span>&nbsp;&nbsp;&nbsp;';
					}
					if (rslt['lootJewel'] && JSON2.stringify(rslt['lootJewel']) != '[]') {
						item = rslt['lootJewel'];
						var amt = "";
						if (item.quantity != 1) { amt = ' (' + item.quantity + ')'; }
						jeweldetails += '<img class=btIcon style="width:20px;" src="' + IMGURL + 'throne/icons/70/jewel_' + jewelTypes[CM.ThroneController.jewelType(item)] + '_' + jewelQuality[item.quality - 1] + '.jpg">&nbsp;' + CM.ThroneController.jewelQualityName(item.quality) + " " + CM.ThroneController.getEffectName(item.id) + " " + uW.g_js_strings.commonstr.jewel + amt + '&nbsp;&nbsp;&nbsp;';
					}
					m += '<tr><td colspan=6>' + itemdetails + thronedetails + equipdetails + jeweldetails + '</TD></TR>';
				}
				m += '</TABLE><br>';
			}
			return m;
		}

		function handleTransportLoot() {
			var m = '';
			m += '<div class="divHeader" align=left>' + uW.g_js_strings.commonstr.loot.toUpperCase() + '</div><TABLE style="width:100%;" class=ptTab>';
			m += '<TR><TD style="width:18%">' + GameIcons.goldImgTiny;
			if (rslt['gold'] > 0)
				m += addCommas(rslt['gold']) + '</TD>';
			else
				m += '0</td>'
			m += '<TD style="width:18%">' + GameIcons.foodImgTiny;
			if (rslt['resource1'] > 0)
				m += addCommas(rslt['resource1']) + '</TD>';
			else
				m += '0</TD>';
			m += '<TD style="width:18%">' + GameIcons.woodImgTiny;
			if (rslt['resource2'] > 0)
				m += addCommas(rslt['resource2']) + '</TD>';
			else
				m += '0</td>'
			m += '<TD style="width:18%">' + GameIcons.stoneImgTiny;
			if (rslt['resource3'] > 0)
				m += addCommas(rslt['resource3']) + '</TD>';
			else
				m += '0</TD>';
			m += '<TD style="width:18%">' + GameIcons.oreImgTiny;
			if (rslt['resource4'] > 0)
				m += addCommas(rslt['resource4']) + '</TD>';
			else
				m += '0</td>'
			m += '<TD style="width:15%">' + GameIcons.astoneImgTiny;
			if (rslt['resource5'] > 0)
				m += addCommas(rslt['resource5']) + '</TD>';
			else
				m += '0</TD>';
			m += '</tr>'
			m += '</TABLE><br>';
			return m;
		}

		function deleteThisRpt(testing) {
			var side0 = '';
			var side1 = '';
			if (rpt.sideId == 1) side1 = rpt.marchReportId;
			if (rpt.sideId == 0) side0 = rpt.marchReportId;
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.s0rids = side0;
			params.s1rids = side1;
			params.cityrids = '';
			new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					if (rslt.ok) {
						delete ReportCache[rpt.marchReportId];
						delete ReportDetailCache[rpt.marchReportId];
						t.CloseReport();
						if (ById('modal_msg_tabs_report') && jQuery('#modal_msg_tabs_report').hasClass('selected')) {
							uW.Messages.listReports();
						}
						if (Tabs.Messages && (Options.MessagesOptions.rptType == 'alliance' || Options.MessagesOptions.rptType == 'player')) {
							var ind = Tabs.Messages.DisplayIdArray.indexOf(parseInt(rpt.marchReportId));
							if (ind >= 0) {
								Tabs.Messages.data.splice(Tabs.Messages.DisplayArray[ind], 1);
								delete Tabs.Messages.report[rpt.marchReportId];
								Tabs.Messages.DisplayRpt();
							}
						}
					}
				},
				onFailure: function () {
					if (notify) {
						notify(tx('AJAX error'));
					}
				},
			});
		}

		function handleunts() { // Troops sent to Reinforce or troops found on a Scout (also show destination for transports)
			var m = '';
			//header
			if (rpt.marchName == uW.g_js_strings.commonstr.reinforce)
				m += '<div class="divHeader" align=left>' + tx('Reinforcement').toUpperCase() + '</div>';
			else
				if (rpt.marchName == uW.g_js_strings.commonstr.transport)
					m += '<div class="divHeader" align=left>' + tx('Destination').toUpperCase() + '</div>';
				else
					m += '<div class="divHeader" align=left>' + tx('Scout Report').toUpperCase() + '</div>';
			//summary
			m += '<div id=scoutSummaryContainer>';
			//summary - troops
			m += '<div style="width:50%;float:left;">';
			if (rpt.marchName == uW.g_js_strings.commonstr.reinforce)
				m += '<B>' + tx('Ally') + ':</B> ' + rpt.side1Name + ' (<A onclick="btGotoMapRpt(' + rpt.side1XCoord + ',' + rpt.side1YCoord + ')">' + rpt.side1XCoord + ',' + rpt.side1YCoord + '</a>)<br>';
			if (rslt['unts'] != undefined) {
				m += '<TABLE class=ptTab>';
				for (var ui in CM.UNIT_TYPES) {
					i = CM.UNIT_TYPES[ui];
					if (rslt['unts']['u' + i] && parseIntNan(rslt['unts']['u' + i]) != 0)
						m += '<TR><TD>' + unitImg[i] + '</TD><TD>' + unitName[i] + '</TD><TD align=right>' + addCommas(rslt['unts']['u' + i]) + '</TD></TR>';
				}
				m += '</TABLE>';
			}
			m += '&nbsp;</div>';
			//summary - city and defences
			m += '<div style="width:50%;float:left;">';
			if ((rpt.marchName == uW.g_js_strings.commonstr.reinforce) || (rpt.marchName == uW.g_js_strings.commonstr.transport))
				m += '<B>' + tx('Destination') + '</B> ' + rpt.side0Name + ' (<A onclick="btGotoMapRpt(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a>)<br>';
			else {
				m += '<TABLE class=ptTab width=100%>';
				m += '<TR><TD>' + rpt.side0Name + ' (<A onclick="btGotoMapRpt(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a>)</td></tr>';
				if (rpt.side0AllianceId && (rpt.side0AllianceId != 0)) m += '<TR><TD>' + uW.g_js_strings.commonstr.alliance + ':&nbsp;<span style=' + DiplomacyColours(rpt.side0AllianceId) + '>' + rpt.side0AllianceName + '</span></td></tr>';
				if (rpt.side0PlayerId && (rpt.side0PlayerId != 0)) m += '<TR><TD>UID: ' + MonitorLinkUID(rpt.side0PlayerId) + '</td></tr>';
				if (rslt['lstlgn']) {
					if (!rslt['lstlgn'])
						m += '<TR><TD>' + uW.g_js_strings.modal_messages_viewreports_view.lastlogin + ': ' + tx('Not recorded') + '</TD></TR>';
					else
						m += '<TR><TD>' + uW.g_js_strings.modal_messages_viewreports_view.lastlogin + ': ' + formatUnixTime(rslt['lstlgn']) + '</TD></TR>';
				}
				m += '<TR><TD>' + tx('Marshall Combat') + ': ';
				if (rslt['knt'] && rslt['knt']['cbt'])
					m += rslt['knt']['cbt'];
				else
					m += uW.g_js_strings.commonstr.none;
				m += '</TD></TR>';
				if (rslt['pop'])
					m += '<TR><TD>' + uW.g_js_strings.commonstr.population + ': ' + addCommas(rslt['pop']) + '</TD></TR>';
				if (rslt['hap'])
					m += '<TR><TD>' + uW.g_js_strings.commonstr.happiness + ': ' + addCommas(rslt['hap']) + '</TD></TR></TABLE>';
				m += '</TD></TR></TABLE><br>';
				m += handlefrt();
			}
			m += '</div>';
			m += '</div>'; //end scoutsummary div
			m += '<div style="clear:both"></div>';
			return m;
		}

		function buildResearch() {
			var m = '';
			//header
			m += '<a id=reportResearchHdr class=divLink ><div class="divHeader" align=left><img id=reportResearchArrow height="10" src="' + RightArrow + '">&nbsp;' + tx('Buildings and Research').toUpperCase() + '</div></a>';
			//summary
			m += '<div id=reportResearch class=divHide>';
			if (rslt['blds']) {
				m += '<div style="width:50%;float:left;">';
				if (rslt['blds']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>' + tx('Buildings') + '</TH></TR>';
					for (var bi in rslt['blds'])
						if ((bi != 'b1') && (bi != 'b2') && (bi != 'b3') && (bi != 'b4')) {
							m += handleblds(bi.split("b")[1]);
						}
					m += '</TABLE>';
				}
				if (rslt['blds']['b1'] || rslt['blds']['b2'] || rslt['blds']['b3'] || rslt['blds']['b4']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>' + tx('Fields') + '</TH></TR>';
					for (var i = 1; i < 5; i++)
						if (rslt['blds']['b' + i])
							m += handleblds(i);
					m += '</TABLE>';
				}
				m += '</div>';
			}
			if (rslt['tch'] || rslt['tch2']) {
				m += '<div style="width:50%;float:left;">';
				if (rslt['tch']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>' + tx('Research') + '</TH></TR>';
					for (var tl in rslt.tch) {
						tid = /[0-9]+/.exec(tl);
						m += '<TR><TD>' + uW.techcost['tch' + tid[0]][0] + '</TD><TD align=right>' + rslt.tch[tl] + '</TD></TR>';
					}
					m += '</TABLE>';
				}
				if (rslt['tch2']) {
					m += '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=2 align=left>' + tx('Briton Research') + '</TH></TR>';
					for (var tl in rslt.tch2) {
						tid = /[0-9]+/.exec(tl);
						m += '<TR><TD>' + uW.techcost2['tch' + tid[0]][0] + '</TD><TD align=right>' + rslt.tch2[tl] + '</TD></TR>';
					}
					m += '</TABLE>';
				}
				m += '</div>';
				m += '<div style="clear:both">&nbsp;</div>';
			}
			m += '</div>';
			return m;
		}

		function handlersc(scout) { // Resources brought with reinforcements or found on a Scout
			var m = '';
			if (rslt['rsc'] != undefined) {
				if (rslt['rsc']['r1'] > 0 || rslt['rsc']['r2'] > 0 || rslt['rsc']['r3'] > 0 || rslt['rsc']['r4'] > 0) {
					if (rpt.marchName == uW.g_js_strings.commonstr.reinforce)
						m += '<div class="divHeader" align=left>' + tx('Goodies Brought').toUpperCase() + '</div><TABLE style="width:100%;" class=ptTab>';
					else
						m += '<div class="divHeader" align=left>' + tx('Goodies Found').toUpperCase() + '</div><TABLE style="width:100%;" class=ptTab>';
					m += '<TR><TD style="width:18%">' + GameIcons.goldImgTiny;
					if (rslt['gld'] > 0)
						m += addCommas(parseFloat(rslt['gld']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.foodImgTiny;
					if (rslt['rsc']['r1'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r1']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.woodImgTiny;
					if (rslt['rsc']['r2'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r2']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.stoneImgTiny;
					if (rslt['rsc']['r3'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r3']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					m += '<TD style="width:18%">' + GameIcons.oreImgTiny;
					if (rslt['rsc']['r4'] > 0)
						m += addCommas(parseFloat(rslt['rsc']['r4']).toFixed(0)) + '</TD>';
					else
						m += '0</td>';
					if (rslt['rsc']['r5'] > 0) {
						m += '<TD style="width:15%">' + GameIcons.astoneImgTiny;
						m += addCommas(parseFloat(rslt['rsc']['r5']).toFixed(0)) + '</TD>';
					}
					else {
						if (scout != true) {
							m += '<TD style="width:15%">' + GameIcons.astoneImgTiny + '0</td>';
						}
					}
					m += '</TABLE>';
				}
			}
			return m;
		}

		function handlefrt() { // Fortifications found on a Scout
			var m = '';
			if (rslt['frt'] || (rslt['blds'] && rslt['blds']['b30']) || (rslt['blds'] && rslt['blds']['b31'])) {
				if (rslt['frt']['f53'] != undefined || rslt['frt']['f55'] != undefined || rslt['frt']['f60'] != undefined || rslt['frt']['f61'] != undefined || rslt['frt']['f62'] != undefined || rslt['frt']['f63'] != undefined || (rslt['blds'] && rslt['blds']['b30']) || (rslt['blds'] && rslt['blds']['b31'])) {
					m = '<TABLE cellspacing=0 class=ptTab><TR><TH class=xtabHD colspan=3 align=left>' + tx('Defences Found') + '</TH></TR>';
					if (rslt['frt']['f53'] != undefined)
						m += '<TR><TD>' + unitImg[53] + '</TD><TD>' + unitName[53] + '</TD><TD align=right>' + addCommas(rslt['frt']['f53']) + '</TD></TR>';
					if (rslt['frt']['f55'] != undefined)
						m += '<TR><TD>' + unitImg[55] + '</TD><TD>' + unitName[55] + '</TD><TD align=right>' + addCommas(rslt['frt']['f55']) + '</TD></TR>';
					if (rslt['frt']['f60'] != undefined)
						m += '<TR><TD>' + unitImg[60] + '</TD><TD>' + unitName[60] + '</TD><TD align=right>' + addCommas(rslt['frt']['f60']) + '</TD></TR>';
					if (rslt['frt']['f61'] != undefined)
						m += '<TR><TD>' + unitImg[61] + '</TD><TD>' + unitName[61] + '</TD><TD align=right>' + addCommas(rslt['frt']['f61']) + '</TD></TR>';
					if (rslt['frt']['f62'] != undefined)
						m += '<TR><TD>' + unitImg[62] + '</TD><TD>' + unitName[62] + '</TD><TD align=right>' + addCommas(rslt['frt']['f62']) + '</TD></TR>';
					if (rslt['frt']['f63'] != undefined)
						m += '<TR><TD>' + unitImg[63] + '</TD><TD>' + unitName[63] + '</TD><TD align=right>' + addCommas(rslt['frt']['f63']) + '</TD></TR>';
					if (rslt['blds'] && rslt['blds']['b31'])
						m += '<TR><TD>' + unitImg[99] + '</TD><TD>' + unitName[99] + '</TD><TD align=right>(' + uW.g_js_strings.commonstr.level + ' ' + rslt['blds']['b31'] + ')</TD></TR>';
					if (rslt['blds'] && rslt['blds']['b30'])
						m += '<TR><TD>' + unitImg[100] + '</TD><TD>' + unitName[100] + '</TD><TD align=right>(' + uW.g_js_strings.commonstr.level + ' ' + rslt['blds']['b30'] + ')</TD></TR>';
					m += '</TABLE>';
				}
			}
			return m;
		}

		function handleblds(bType) {
			if (rslt['blds']) {
				var blds = rslt['blds']['b' + bType];
				var maxlvl = uW.buildingmaxlvl[bType] || 12;
				var b = '<TR><TD>';
				arField = [], firstbld = true;
				b += uW.buildingcost['bdg' + bType][0];
				b += '</TD><TD>';
				for (var i = 1; i <= maxlvl; i++)
					arField[i] = 0;
				for (var i = 0; i < blds.length; i++)
					arField[blds[i]]++
				for (var i = maxlvl; i > 0; i--) {
					if (arField[i] > 0) {
						if (firstbld)
							firstbld = false;
						else
							b += ', ';
						if (arField[i] > 1)
							b += arField[i] + ' x ';
						b += ' ' + i;
					}
				}
				b += '</TD></TR>';
				return b;
			}
		}

		t.CloseReport();
		if (rpt.marchName == uW.g_js_strings.commonstr.reinforce) {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 240, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="height:180px">';
		} else if (rpt.marchName == uW.g_js_strings.commonstr.transport) {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 240, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="height:180px">';
		} else if (rpt.marchName == uW.g_js_strings.commonstr.scout && rslt['winner'] == 1 && rpt.sideId == 1) {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 800, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="max-height:760px; height:760px; overflow-y:scroll">';
		} else {
			t.popReport = new CPopup('btReportPopup', t.reportpos.x, t.reportpos.y, 750, 800, true, function () {
				t.reportpos = t.popReport.getLocation();
				clearTimeout(1000);
			});
			m += '<DIV style="max-height:760px; height:760px; overflow-y:scroll">';
		}
		if ((t.reportpos.x == -999) && (t.reportpos.y == -999)) {
			t.popReport.centerMe(mainPop.getMainDiv());
		}
		m += buildHeader();
		if (rpt.marchName == uW.g_js_strings.commonstr.transport) { // Transport
			m += handleTransportLoot();
			m += handleunts();
		}
		m += handleLoot();
		if (rpt.marchName == uW.g_js_strings.commonstr.reinforce) {
			m += handlersc(false);
			m += handleunts();
		}
		if (rpt.marchName == uW.g_js_strings.commonstr.scout && rslt['winner'] == 1) {
			m += handlersc(true);
			m += handleunts();
			m += buildResearch();
		}
		if (rslt['fght']) {
			m += buildBattle();
			m += buildTroopStats();
			if (!koth) {
				m += buildChampDuel();
				m += buildThroneStats();
			}
			m += buildBoosts();
		}
		m += '</DIV>';
		t.popReport.getMainDiv().innerHTML = m;
		if (ById('atkmightlost')) { ById('atkmightlost').innerHTML = tx('Might Lost') + ': ' + addCommas(t.atkmight); }
		if (ById('defmightlost')) { ById('defmightlost').innerHTML = tx('Might Lost') + ': ' + addCommas(t.defmight); }
		if (ById('ptDeleteReport')) {
			ById('ptDeleteReport').addEventListener('click', function () {
				deleteThisRpt(rslt, rpt);
			}, false);
		}
		t.popReport.getTopDiv().innerHTML = '<DIV align=center><B>' + rpt.marchName + ' ' + uW.g_js_strings.commonstr.report + '</B></DIV>';

		if (ById('reportTroopStatsHdr')) { ById('reportTroopStatsHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportTroopStats"); }, false); }
		if (ById('reportChampDuelHdr')) { ById('reportChampDuelHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportChampDuel"); }, false); }
		if (ById('reportThroneHdr')) { ById('reportThroneHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportThrone"); }, false); }
		if (ById('reportBoostsHdr')) { ById('reportBoostsHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportBoosts"); }, false); }
		if (ById('reportResearchHdr')) { ById('reportResearchHdr').addEventListener('click', function () { ToggleDivDisplay(false, 500, 500, "reportResearch"); }, false); }

		t.popReport.show(true);
	},

	CloseReport: function () {
		var t = Rpt;
		if (t.popReport) {
			t.popReport.show(false);
			if (t.popReport.onClose) t.popReport.onClose();
			t.popReport.destroy();
			t.popReport = null;
		}
	},
};
