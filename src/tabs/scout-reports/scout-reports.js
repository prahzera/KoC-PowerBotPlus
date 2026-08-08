/** Scout Reports Tab **/

Tabs.ScoutReports = {
	tabLabel: 'Scout Rpts',
	tabOrder: 2090,
	tabColor: 'brown',
	Options: {
		gold: 0,
		r1: 0,
		r2: 0,
		r3: 0,
		r4: 0,
		On: false,
		lost: false,
		friendly: true,
		hostile: true,
	},
	LoopCounter: 0,
	lrpts: null,
	myDiv: null,
	deleting: false,
	pageNo: 1,
	maxpages: 10,
	scandelay: 30, // 30 seconds between scans
	tocheck: new Array(),

	init: function (div) {
		var t = Tabs.ScoutReports;
		t.myDiv = div;

		if (!Options.ScoutOptions) {
			Options.ScoutOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.ScoutOptions.hasOwnProperty(y)) {
					Options.ScoutOptions[y] = t.Options[y];
				}
			}
		}

		setTimeout(t.startdeletereports, 10 * 1000);
	},

	e_toggleswitch: function (obj) {
		var t = Tabs.ScoutReports;
		if (Options.ScoutOptions.On) {
			obj.value = tx("Delete = OFF");
			Options.ScoutOptions.On = false;
		} else {
			obj.value = tx("Delete = ON");
			Options.ScoutOptions.On = true;
		}
		saveOptions();
	},

	startdeletereports: function () {
		var t = Tabs.ScoutReports;
		if (!t.deleting) {
			if (Options.ScoutOptions.On) {
				t.deleting = true;
				t.listreports(t.pageNo, t.checkreports);
			}
			else {
				t.deleting = false;
				t.pageNo = 1;
				setTimeout(t.startdeletereports, t.scandelay * 1000);
			}
		}
	},

	listreports: function (pageNo, callback) {
		var t = Tabs.ScoutReports;
		t.pageNo = pageNo;

		if (!Options.ScoutOptions.On) {
			t.deleting = false;
			t.pageNo = 1;
			setTimeout(t.startdeletereports, t.scandelay * 1000);
			return;
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		if (t.pageNo >= 1) params.pageNo = t.pageNo;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { callback(rslt); },
			onFailure: function () { callback(); },
		});
	},

	checkreports: function (rslt) {
		var t = Tabs.ScoutReports;
		if (!rslt.ok || (rslt.arReports.length < 1)) {
			t.deleting = false;
			t.pageNo = 1;
			setTimeout(t.startdeletereports, t.scandelay * 1000);
			return;
		}
		var reports = rslt.arReports;
		var totalPages = rslt.totalPages;
		if (rslt.totalPages > t.maxpages) var totalPages = t.maxpages;
		var deletes1 = new Array();
		for (var k in reports) {
			if (Options.ScoutOptions.On) {
				if (reports[k].marchType == 3) {
					if (reports[k].side1PlayerId == uW.tvuid) {
						var rptdel = false;
						if (reports[k].side0AllianceId && Options.ScoutOptions.friendly == true) {
							if (Seed.allianceDiplomacies.friendlyToThem) {
								for (var l in Seed.allianceDiplomacies.friendlyToThem) {
									if (reports[k].side0AllianceId == Seed.allianceDiplomacies.friendlyToThem[l].allianceId) {
										if (GlobalOptions.ExtendedDebugMode) actionLog('deleting friendly scout' + k.substr(2), 'SCOUT');
										deletes1.push(k.substr(2));
										rptdel = true;
									}
								}
							}
							if (Seed.allianceDiplomacies.friendly) {
								for (var l in Seed.allianceDiplomacies.friendly) {
									if (reports[k].side0AllianceId == Seed.allianceDiplomacies.friendly[l].allianceId) {
										if (GlobalOptions.ExtendedDebugMode) actionLog('deleting friendly scout ' + k.substr(2), 'SCOUT');
										deletes1.push(k.substr(2));
										rptdel = true;
									}
								}
							}
						};
						if (reports[k].side0AllianceId && Options.ScoutOptions.hostile == true) {
							if (Seed.allianceDiplomacies.hostile) {
								for (var l in Seed.allianceDiplomacies.hostile) {
									if (reports[k].side0AllianceId == Seed.allianceDiplomacies.hostile[l].allianceId) {
										if (GlobalOptions.ExtendedDebugMode) actionLog('not deleting hostile scout ' + k.substr(2), 'SCOUT');
										rptdel = true;
									}
								}
							}
						};
					};
					if (rptdel == false) { t.tocheck.push(k.substr(2)); }
				};
			}
		};
		if (deletes1.length > 0) {
			t.deleteCheckedReports(deletes1);
		} else {
			if (t.pageNo <= totalPages) {
				t.deleting = false;
				t.pageNo++;
				setTimeout(t.startdeletereports, 5 * 1000); // next page in 5 seconds
				return;
			}
			else {
				t.deleting = false;
				t.pageNo = 1;
				setTimeout(t.startdeletereports, t.scandelay * 1000);
				return;
			}
		}
	},

	deleteCheckedReports: function (deletes1) {
		var t = Tabs.ScoutReports;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.s0rids = '';
		params.s1rids = deletes1.join(",");
		params.cityrids = '';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (deletes1.length > 0) {
						for (var j = 0; j < deletes1.length; j++) {
							delete ReportCache[deletes1[j]];
							delete ReportDetailCache[deletes1[j]];
						}
					}
					Seed.newReportCount = parseInt(Seed.newReportCount) - parseInt(deletes1.length);
					if (GlobalOptions.ExtendedDebugMode) actionLog('Deleted: ' + parseInt(deletes1.length) + ' scout reports', 'SCOUT');
					t.deleting = false;
					setTimeout(t.startdeletereports, 5 * 1000); // next page in 5 seconds
				}
				else {
					t.deleting = false;
					t.pageNo = 1;
					setTimeout(t.startdeletereports, t.scandelay * 1000); // error - start again
				}
			},
			onFailure: function () {
				t.deleting = false;
				t.pageNo = 1;
				setTimeout(t.startdeletereports, t.scandelay * 1000); // error - start again
			},
		});
	},

	fetchreport: function () {
		var t = Tabs.ScoutReports;

		// safety net .. if no options set then don't delete the report, otherwise ALL scouts would be deleted always and we'd have a load of people moaning...
		if (!Options.ScoutOptions.lost && (Number(Options.ScoutOptions.gold) == 0) && (Number(Options.ScoutOptions.r1) == 0) && (Number(Options.ScoutOptions.r2) == 0) && (Number(Options.ScoutOptions.r3) == 0) && (Number(Options.ScoutOptions.r4) == 0)) return;

		if (t.tocheck.length > 0) {
			rpId = t.tocheck.shift();
			FetchReportDetail(rpId, 1, function (rslt) {
				if (rslt) {
					if (rslt.hasOwnProperty("winner") && rslt.winner == 0) {
						if (!Options.ScoutOptions.lost) {
							if (GlobalOptions.ExtendedDebugMode) actionLog('deleting defeated scout report ' + rpId, 'SCOUT');
							deleteCheckedReport(rpId);
						}
					}
					else {
						if (rslt.rsc) {
							var rsc = rslt.rsc;
							var topush = true;

							if (Number(Options.ScoutOptions.gold) > 0) {
								if (rslt.gld && Number(rslt.gld) > Number(Options.ScoutOptions.gold)) {
									topush = false;
								}
							}
							if (Number(Options.ScoutOptions.r1) > 0) {
								if (Number(rsc.r1) > Number(Options.ScoutOptions.r1)) {
									topush = false;
								}
							}
							if (Number(Options.ScoutOptions.r2) > 0) {
								if (Number(rsc.r2) > Number(Options.ScoutOptions.r2)) {
									topush = false;
								}
							}
							if (Number(Options.ScoutOptions.r3) > 0) {
								if (Number(rsc.r3) > Number(Options.ScoutOptions.r3)) {
									topush = false;
								}
							}
							if (Number(Options.ScoutOptions.r4) > 0) {
								if (Number(rsc.r4) > Number(Options.ScoutOptions.r4)) {
									topush = false;
								}
							}

							if (topush == true) { deleteCheckedReport(rpId); }
						}
					}
				}
			});
		}
	},

	show: function () {
		var t = Tabs.ScoutReports;

		var m = '<DIV class=divHeader align=center>' + tx('AUTO-DELETE OWN SCOUT REPORTS') + '</div><br><div align=center>';
		if (Options.ScoutOptions.On) {
			m += '<INPUT id=FSrpts type=submit value="' + tx('Delete = ON') + '">';
		} else {
			m += '<INPUT id=FSrpts type=submit value="' + tx('Delete = OFF') + '">';
		}
		m += '<br>&nbsp;</div><DIV class=divHeader align=center>' + tx('DELETE OPTIONS') + '</div><br>';
		m += '&nbsp;&nbsp;&nbsp;<b>' + tx("DON'T") + '</b> ' + tx('Delete Scout Reports if') + '...';
		m += '<br><table class=xtab><tr><td colspan=2>&nbsp;</td><td><input id=frlost type=checkbox ' + (Options.ScoutOptions.lost ? 'CHECKED' : '') + '>&nbsp;' + tx('Your scouts were defeated in battle') + '</td></tr>';
		m += '<tr><td>&nbsp;&nbsp;<b>' + tx('OR') + '</b></td><td align="right">' + tx('Gold is more than') + ' :&nbsp;</td><td><INPUT id=frGold type=text value=' + Options.ScoutOptions.gold + '></td></tr>';
		m += '<tr><td>&nbsp;&nbsp;<b>' + tx('OR') + '</b></td><td align="right">' + tx('Food is more than') + ' :&nbsp;</td><td><INPUT id=frR1 type=text value=' + Options.ScoutOptions.r1 + '></td></tr>';
		m += '<tr><td>&nbsp;&nbsp;<b>' + tx('OR') + '</b></td><td align="right">' + tx('Wood is more than') + ' :&nbsp;</td><td><INPUT id=frR2 type=text value=' + Options.ScoutOptions.r2 + '></td></tr>';
		m += '<tr><td>&nbsp;&nbsp;<b>' + tx('OR') + '</b></td><td align="right">' + tx('Stone is more than') + ' :&nbsp;</td><td><INPUT id=frR3 type=text value=' + Options.ScoutOptions.r3 + '></td></tr>';
		m += '<tr><td>&nbsp;&nbsp;<b>' + tx('OR') + '</b></td><td align="right">' + tx('Ore is more than') + ' :&nbsp;</td><td><INPUT id=frR4 type=text value=' + Options.ScoutOptions.r4 + '></td></tr>';
		m += '<tr><td colspan=2>&nbsp;</td><td>(' + tx('NB - Set amount to zero to disable the check for that resource') + ')</td></tr></table>';
		m += '<hr>&nbsp;&nbsp;&nbsp;&nbsp;<input id=frfriendly type=checkbox ' + (Options.ScoutOptions.friendly ? 'CHECKED' : '') + '><b>' + tx('ALWAYS') + '</b> ' + tx('Delete Scout Reports of Friendly Alliances');
		m += '<br>&nbsp;&nbsp;&nbsp;&nbsp;<input id=frhostile type=checkbox ' + (Options.ScoutOptions.hostile ? 'CHECKED' : '') + '><b>' + tx('NEVER') + '</b> ' + tx('Delete Scout Reports of Hostile Alliances');
		m += '<br>&nbsp;';

		t.myDiv.innerHTML = m;

		ChangeOption('ScoutOptions', 'frGold', 'gold');
		ChangeOption('ScoutOptions', 'frR1', 'r1');
		ChangeOption('ScoutOptions', 'frR2', 'r2');
		ChangeOption('ScoutOptions', 'frR3', 'r3');
		ChangeOption('ScoutOptions', 'frR4', 'r4');

		ToggleOption('ScoutOptions', 'frlost', 'lost');
		ToggleOption('ScoutOptions', 'frfriendly', 'friendly');
		ToggleOption('ScoutOptions', 'frhostile', 'hostile');

		ById('FSrpts').addEventListener('click', function () {
			t.e_toggleswitch(this)
		}, false);
	},

	EverySecond: function () {
		var t = Tabs.ScoutReports;

		if (!t.deleting && Options.ScoutOptions.On) {
			t.LoopCounter = t.LoopCounter + 1;

			if (t.LoopCounter >= 2) {
				t.LoopCounter = 0;
				// check next report and delete if required..
				t.fetchreport();
			}
		}
		else {
			t.LoopCounter = 0;
		}
	},
};
