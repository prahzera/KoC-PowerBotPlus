var AllianceReports = {
	init: function () {
		t = AllianceReports;

		try {
			uWExportFunction('ListAR_hook', AllianceReports.myAllianceReports);
			t.listFunc = new CalterUwFunc('allianceReports', [
				['var params', 'ListAR_hook(pageNo);return;var params']
			]);
			t.listFunc.setEnable(Options.enhanceARpts);

			uWExportFunction('getReportDisplay_hook2', AllianceReports.getReportDisplayHook);
			uWExportFunction('FindReport', Rpt.FindReport);

			t.marvFunc = new CalterUwFunc('modal_alliance_report_view', [
				['getReportDisplay', 'getReportDisplay_hook2']
			]);
			t.marvFunc.setEnable(true);

			t.memListFunc = new CalterUwFunc('membersInfo', [
				['commonstr.might', 'commonstr.might + "</td><td class=colcities>" + g_js_strings.commonstr.cities + "</td><td class=collast>" + g_js_strings.membersInfo.lastonline'],
				['memberInfo[key].prestige\)', 'memberInfo[key].prestige)+ "</td>");memhtml.push("<td class=colcities>" + memberInfo[key].cities + "</td>");memhtml.push("<td class=collast>" + memberInfo[key].lastLogin']
			]);
			t.enable_viewmembers(Options.enhanceViewMembers);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	getReportDisplayHook: function (a, b) {
		var x = '';
		try {
			x = uW.getReportDisplay(a, b);
		} catch (e) {
			x = 'Error formatting report: ' + e.message;
		}
		return x;
	},
	enable_viewmembers: function (tf) {
		t = AllianceReports;
		t.memListFunc.setEnable(tf);
	},
	enable: function (tf) { },
	myAllianceReports: function (pageNum) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		if (pageNum)
			params.pageNo = pageNum;
		params.group = "a";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				displayReports(rslt.arReports, rslt.arPlayerNames, rslt.arAllianceNames, rslt.arCityNames, rslt.totalPages);
			},
		}, false);

		function displayReports(ar, playerNames, allianceNames, cityNames, totalPages) {
			var msg = "";
			var myAllianceId = getMyAlliance()[0];
			msg += "<STYLE>.msgviewtable tbody .myCol div {margin-left:5px; overflow:hidden; white-space:nowrap; color:#000}\
				.msgviewtable tbody .myHostile div {font-weight:600; color:#600}\
				.msgviewtable tbody .myGray div {color:#666}\
				.msgviewtable tbody .myRein div {color:#050}\
				.msgviewtable tbody .myWarn div {font-weight:600; color:#442200}\
				</style>";
			msg += "<div class='modal_msg_reports'>";
			var rptkeys = Object.keys(ar);
			if (ar && matTypeof(ar) != 'array') {
				msg += "<div id='modal_alliance_reports_tablediv' class='modal_msg_list'><table width=675 cellpadding='0' cellspacing='0' class='msgviewtable reportviewtable alliancetable'>";
				msg += "<thead><tr><td width=105>" + uW.g_js_strings.commonstr.date + "</td><td width=40>" + uW.g_js_strings.commonstr.type + "</td><td width=150>" + uW.g_js_strings.commonstr.attacker + "</td><td>" + uW.g_js_strings.commonstr.target + "</td><td>" + uW.g_js_strings.commonstr.view + "</td></tr></thead><tbody>";
				for (var i = 0; i < rptkeys.length; i++) {
					var rpt = ar[rptkeys[i]];
					var colClass = '"myCol"';
					rpt.marchType = parseInt(rpt.marchType);
					rpt.side0AllianceId = parseInt(rpt.side0AllianceId);
					var targetDiplomacy = getDiplomacy(rpt.side0AllianceId);
					if (rpt.marchType == 2) {
						colClass = '"myCol myRein"';
					} else if (rpt.side1AllianceId != myAllianceId) {
						colClass = '"myCol myHostile"';
					} else {
						if (parseInt(rpt.side0TileType) == 57) { // if megalith
							colClass = '"myCol myWarn"';
						}
						else {
							if (parseInt(rpt.side0TileType) < 50) { // if wild
								if (parseInt(rpt.side0PlayerId) == 0)
									colClass = '"myCol myGray"';
								else
									colClass = '"myCol myWarn"';
							} else if (parseInt(rpt.side0PlayerId) == 0) { // barb
								colClass = '"myCol myGray"';
							} else {
								if (targetDiplomacy == uW.g_js_strings.commonstr.friendly)
									colClass = '"myCol myWarn"';
							}
						}
					}
					msg += "<tr valign=top";
					if (i % 2 == 0) msg += " class=stripe";
					msg += "><TD class=" + colClass + "><div>" + uW.formatDateByUnixTime(rpt.reportUnixTime) + "<BR>Rpt&nbsp;<a onclick='FindReport(" + rpt.reportId + ",0);return false;'>#" + rpt.reportId + "</a>";
					msg += "</div></td><TD class=" + colClass + "><div>";
					if (rpt.marchType == 1) msg += uW.g_js_strings.commonstr.transport;
					else if (rpt.marchType == 3) msg += uW.g_js_strings.commonstr.scout;
					else if (rpt.marchType == 2) msg += tx('Reinf');
					else msg += uW.g_js_strings.commonstr.attack;
					// attacker ...
					msg += "</div></td><TD class=" + colClass + "><div>";
					if (parseInt(rpt.side1PlayerId) != 0) msg += playerNames["p" + rpt.side1PlayerId];
					else msg += "?" + tx('Unknown') + "?";
					msg += " " + coordLink(rpt.side1XCoord, rpt.side1YCoord, true) + "<BR>";
					if (rpt.side1AllianceId != myAllianceId) { msg += allianceNames['a' + rpt.side1AllianceId] + " (" + getDiplomacy(rpt.side1AllianceId) + ")"; }
					else { msg += "<BR>"; }
					msg += "</div></td>";
					// target ...
					msg += "<TD class=" + colClass + "><DIV>";
					var type = parseInt(rpt.side0TileType);
					if (type == 57) { // megalith
						msg += capitalize(uW.g_mapObject.types[type] || "") + " " + uW.g_js_strings.commonstr.lvl + " " + rpt.side0TileLevel;
						if (parseInt(rpt.side0PlayerId) != 0) { // IF OWNED, show owner ...
							msg += " [" + playerNames["p" + rpt.side0PlayerId] + "] ";
						}
					}
					else {
						if (type < 50) { // wild
							msg += capitalize(uW.g_mapObject.types[type] || "") + " " + uW.g_js_strings.commonstr.lvl + " " + rpt.side0TileLevel;
							if (parseInt(rpt.side0PlayerId) != 0) { // IF OWNED, show owner ...
								msg += " [" + playerNames["p" + rpt.side0PlayerId] + "] ";
							}
						}
						else {
							if (parseInt(rpt.side0PlayerId) == 0) { // barb
								msg += uW.g_js_strings.commonstr.barbariancamp + " " + uW.g_js_strings.commonstr.lvl + " " + rpt.side0TileLevel;
							}
							else { // city
								msg += playerNames["p" + rpt.side0PlayerId] + " - " + cityNames['c' + rpt.side0CityId];
							}
						}
					}
					msg += " " + coordLink(rpt.side0XCoord, rpt.side0YCoord, true);
					if (rpt.side0AllianceId != 0 && rpt.side0AllianceId != myAllianceId) {
						msg += "<BR>" + allianceNames['a' + rpt.side0AllianceId] + " (" + targetDiplomacy + ")";
					}
					// 'view report' link ...
					if (rpt.marchType != 2) {
						msg += "</div></td><TD class=" + colClass + "><div><a onclick='modal_alliance_report_view(" + rpt.reportId + ",";
						if (parseInt(rpt.side1AllianceId) == parseInt(Seed.allianceDiplomacies.allianceId)) { msg += '1'; }
						else { msg += '0'; }
						msg += "," + rpt.side0TileType + "," + rpt.side0TileLevel + "," + rpt.side0PlayerId + ',"';
						if (parseInt(rpt.side0PlayerId) != 0) msg += escape(playerNames["p" + rpt.side0PlayerId]);
						else msg += uW.g_js_strings.commonstr.enemy;
						msg += '","';
						if (parseInt(rpt.side0PlayerId) != 0) msg += escape(playerNames["g" + rpt.side0PlayerId]);
						else msg += '0';
						msg += '","';
						if (parseInt(rpt.side1PlayerId) > 0) msg += escape(playerNames["p" + rpt.side1PlayerId]);
						msg += '","';
						if (parseInt(rpt.side1PlayerId) != 0) msg += escape(playerNames["g" + rpt.side1PlayerId]);
						msg += '",' + rpt.marchType + "," + rpt.side0XCoord + "," + rpt.side0YCoord + "," + rpt.reportUnixTime + ",";
						if (parseInt(rpt.reportStatus) == 2) msg += "1";
						else msg += "0";
						if (rpt.side1XCoord) { msg += "," + rpt.side1XCoord + "," + rpt.side1YCoord; }
						else { msg += ",,"; }
						msg += ");return false;'>" + uW.g_js_strings.commonstr.view + "</a></div></td></tr>";
					} else {
						// reinforcement!!
						msg += "</div></td><TD class=" + colClass + "><div><a onclick='FindReport(\"" + rpt.reportId + "\",0);return false;'>" + uW.g_js_strings.commonstr.view + "</a></div></td></tr>";
					}
				}
				msg += "</tbody></table></div>";
			}
			msg += "</div><div id='modal_report_list_pagination'></div>";
			ById('allianceContent').innerHTML = msg;
			if (pageNum) {
				uW.ctrlPagination("modal_report_list_pagination", totalPages, "allianceReports", pageNum)
			} else {
				uW.ctrlPagination("modal_report_list_pagination", totalPages, "allianceReports")
			}
		}
	},
};

var AllianceReportsCheck = {
	aRpt: {},

	init: function () {
		var t = AllianceReportsCheck;
		var b = GM_getValue('allianceRpt_' + getServerId() + '_' + uW.tvuid);
		if (b != null)
			t.aRpt = JSON2.parse(b);
		else {
			t.aRpt = {};
		}
		t.enable(Options.ReportOptions.EnhanceAR);
	},

	enable: function (tf) {
		var t = AllianceReportsCheck;
		if (Options.ReportOptions.EnhanceAR) {
			t.checkAllianceReport();
		}
		setTimeout(t.enable, parseInt((Math.random() * 15 * 1000) + (Options.ReportOptions.alertinterval * 1000)), Options.ReportOptions.EnhanceAR);
	},

	checkAllianceReport: function () {
		var t = AllianceReportsCheck;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.group = "a";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				t.parseAReports(rslt.arReports, rslt.arPlayerNames, rslt.arAllianceNames, rslt.arCityNames, rslt.totalPages);
			},
		}, true);
	},
	parseAReports: function (ar, playerNames, allianceNames, cityNames, totalPages) {
		var t = AllianceReportsCheck;
		var myAllianceId = getMyAlliance()[0];
		var rptkeys = uW.Object.keys(uWCloneInto(ar));
		if (ar && matTypeof(ar) != 'array') {
			for (var i = 0; i < rptkeys.length; i++) {
				var rpt = ar[rptkeys[i]];
				if (rpt.side1AllianceId != myAllianceId && Options.ReportOptions.PostIncoming) {
					var ID = rpt.reportId;
					var target = tx("city");
					if (t.aRpt["a" + ID]) continue;
					if (rpt.marchType == 3) { atkType = tx('scouted'); }
					else if (rpt.marchType == 4) { atkType = tx('attacked'); }
					if (rpt.side0TileType == 57) { target = tx("megalith"); }
					else if (rpt.side0TileType <= 50) { target = tx("wild"); }
					var allianceName = '';
					if (parseIntNan(rpt.side1AllianceId) != 0) {
						allianceName = ' of ' + allianceNames["a" + rpt.side1AllianceId] + ' (' + getDiplomacy(rpt.side1AllianceId) + ')';
					}
					var date = uW.formatDateByUnixTime(rpt.reportUnixTime);
					var msg = ':::. | Report No: ' + enFilter(rpt.reportId) + ' || ' + date + ' || ' + playerNames['p' + rpt.side0PlayerId] + '\'s ' + target + ' ' + tx('at') + ' ' + rpt.side0XCoord + ',' + rpt.side0YCoord + ' ' + tx('has been') + ' ' + atkType + ' ' + tx('by') + ' ' + playerNames["p" + rpt.side1PlayerId] + ' ' + tx('at') + ' ' + rpt.side1XCoord + ',' + rpt.side1YCoord + allianceName;
					t.fetchreport(ID, rpt, msg, playerNames, cityNames, rpt.side0TileType, rpt.marchType);
					t.addAllianceReport(rpt);
				}
				if (rpt.side1PlayerId == uW.tvuid && Options.ReportOptions.WhisperOutgoing) {
					var ID = rpt.reportId;
					if (t.aRpt["a" + ID]) continue;

					if ((rpt.marchType == 4) && Options.AttackOptions && Options.AttackOptions.Routes) {
						var crest = false;
						for (var j in Options.AttackOptions.Routes) {
							var a = Options.AttackOptions.Routes[j];
							if (rpt.side0XCoord == a.target_x && rpt.side0YCoord == a.target_y) {
								crest = true;
								break;
							}
						}
						if (crest) {
							t.addAllianceReport(rpt); // no try again
							continue; // no whisper on crest targets
						}
					}
					if (rpt.marchType == 3) { atkType = tx('scouted'); }
					else if (rpt.marchType == 4) { atkType = tx('attacked'); }
					target = tileTypes[parseInt(rpt.side0TileType)];
					if (parseInt(rpt.side0PlayerId) == 0) { var playerName = ''; }
					else { var playerName = playerNames['p' + rpt.side0PlayerId] + '\'s '; }
					var date = uW.formatDateByUnixTime(rpt.reportUnixTime);
					var msg = ':::. | Report No: ' + enFilter(rpt.reportId) + ' || ' + date + ' || ' + playerName + target + ' ' + tx('at') + ' ' + rpt.side0XCoord + ',' + rpt.side0YCoord + ' ' + tx('has been') + ' ' + atkType + ' ' + tx('by you');
					var automsg = sendChat("/" + Seed.player.name + ' ' + msg);
					t.addAllianceReport(rpt);
				}
			}
		}
	},
	addAllianceReport: function (rpt) {
		t = AllianceReportsCheck;
		var ID = rpt.reportId;
		t.aRpt["a" + ID] = rpt.reportUnixTime;
		var now = unixTime() - (5 * 24 * 60 * 60);
		for (var k in t.aRpt) {
			if (t.aRpt[k] < now)
				delete t.aRpt[k];
		}
		var string = JSON2.stringify(t.aRpt);
		setTimeout(function () { GM_setValue("allianceRpt_" + getServerId() + "_" + uW.tvuid, string); }, 0);
	},
	fetchreport: function (rpId, rpt, msg, playerNames, cityNames, TileType, MarchType) {
		var t = AllianceReportsCheck;
		if (Options.ReportOptions.IgnoreScouts && MarchType == 3) return;
		if (Options.ReportOptions.IgnoreWilds && TileType <= 50) return;
		FetchReport(rpId, function (rslt) {
			if (rslt.detail.winner && rslt.detail.winner == 1) { var DefeatedText = ' ||[#1][#8] ' + tx('You were defeated') + '![#][#]'; }
			else { var DefeatedText = ' ||[#2] ' + tx('You defended successfully') + '![#]'; }
			var troops = rslt.detail.fght.s1;
			var trooptot = 0;
			for (var i in troops) {
				trooptot += Number(troops[i][0]);
			}
			if (Options.ReportOptions.alertmtroops > trooptot) return;
			msg = msg + ' || ' + uW.g_js_strings.commonstr.troops + ' ' + trooptot + DefeatedText;
			if (Options.ReportOptions.WhisperAR) {
				var automsg = sendChat("/" + Seed.player.name + ' ' + msg);
				var WList = Options.ReportOptions.WhisperARList.split(',');
				for (var i = 0; i < WList.length; i++) {
					var WName = WList[i].trim();
					if (WName) BotChat.sendWhisper(msg, WName);
				}
			}
			else {
				var automsg = sendChat('/a ' + msg);
			}
		});
	},
};
