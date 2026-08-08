/** Alliance Tab **/

Tabs.Alliance = {
	tabOrder: 1060,
	tabLabel: 'Alliance',
	myDiv: null,
	alliancemembers: [],
	sortmembers: [],
	number: 0,
	totalmembers: 0,
	totalpages: 0,
	returnedpages: 0,
	error: false,
	HQActive: false,
	LoopCounter: 0,
	DonationLog: {},
	DonateResourceItems: { 40010: 1000000, 40040: 1000000, 40030: 1000000, 40020: 1000000, 40000: 1000000, 40050: 1, 43000: 1 },
	DonateHourglassItems: { 40070: 1, 40071: 1, 40072: 1, 40073: 1 },
	VaultItems: { 0: { 41000: 1000000 }, 1: { 41010: 1000000 }, 2: { 41020: 1000000 }, 3: { 41030: 1000000 }, 4: { 41040: 1000000 }, 5: { 41050: 1000000 }, 6: { 41060: 100, 41061: 500, 41062: 1000 }, 7: {} },
	ArcaneBundles: [43001, 43002, 43003, 43004],
	AuraDistance: 0,
	MaxAllianceArcana: 0,
	MaxPersonalArcana: 0,
	DonationLimit: 0,
	DonationHLimit: 0,
	ActiveTab: '',
	memactive: 0,
	memtotal: 0,
	memspan: '',
	serverwait: false,
	aid: 0,
	Options: {
		sortColNum: 0,
		sortDir: 1,
		Monitor: false,
		MonitorHours: 1,
		MonitorCC: "",
		LastChecked: 0,
		MonitorId: 0,
		LastMemberList: {},
		DeleteHQMessages: false,
		EnableAutoAmber: true,
		MineLastChecked: 0,
		ResLastChecked: 0,
		c: false,
		LastDonateReport: 0,
		DonateReportInterval: 24,
		AutoDonate: {},
		InfoDisplayed: false,
		UnBundleArcaneTablets: false,
	},

	// t.alliancemembers for sorting
	// 0 - name
	// 1 - might
	// 2 - cities
	// 3 - position
	// 4 - dip
	// 5 - lastlogin
	// 6 - uid
	// 7 - fbuid
	// 8 - avatarurl
	// 9 - glory
	//10 - dateJoined
	//11 - lastlogin (sortable)
	//12 - dateJoined (sortable)
	//13 - rune score

	init: function (div) {
		var t = Tabs.Alliance;
		t.myDiv = div;

		if (!Options.AllianceOptions) {
			Options.AllianceOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.AllianceOptions.hasOwnProperty(y)) {
					Options.AllianceOptions[y] = t.Options[y];
				}
			}
		}

		t.loadLog();

		for (var k in t.DonateResourceItems) {
			if (!Options.AllianceOptions.AutoDonate[k]) {
				Options.AllianceOptions.AutoDonate[k] = {};
				Options.AllianceOptions.AutoDonate[k].Active = false;
				Options.AllianceOptions.AutoDonate[k].Amount = 0;
				Options.AllianceOptions.AutoDonate[k].Donated = 0;
			}
		}
		for (var k in t.DonateHourglassItems) {
			if (!Options.AllianceOptions.AutoDonate[k]) {
				Options.AllianceOptions.AutoDonate[k] = {};
				Options.AllianceOptions.AutoDonate[k].Active = false;
				Options.AllianceOptions.AutoDonate[k].Amount = 0;
				Options.AllianceOptions.AutoDonate[k].Donated = 0;
			}
		}
		t.CheckNewDay();

		uWExportFunction('ptallClickSort', Tabs.Alliance.allClickSort);
		uWExportFunction('ptsetMember', Tabs.Alliance.setMember);
		uWExportFunction('btCollectAmber', Tabs.Alliance.CheckMineAmber);
		uWExportFunction('btDonateNow', function () { ById('bttcInventory').click(); ById('pbinventory_alliance').click(); });
		uWExportFunction('btPrestigeShown', function () { Options.AllianceOptions.InfoDisplayed = true; saveOptions(); });
		uWExportFunction('btViewAuraMap', Tabs.Alliance.ViewAuraMap);

		var HQ = '<span class=boldRed>' + uW.g_js_strings.commonstr.none + '</span>';
		var HQCoords = '<span class=boldRed>' + uW.g_js_strings.commonstr.none + '</span>';
		var HQStyle = 'display:none;';
		if (Seed.allianceHQ) {
			var ahqlevel = 0;
			jQuery.each(Seed.allianceHQ.buildings, function (key, value) {
				ahqlevel += parseInt(value.buildingLevel)
			});
			HQ = uW.g_js_strings.commonstr.level + ' ' + ahqlevel;
			HQCoords = coordLink(Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord);
			HQStyle = '';
			t.HQActive = true;
			// initialise arcana - because the game doesn't!
			OpenTemple(t.SetBoosts);
		}

		t.totalmembers = 0;
		t.alliancemembers = [];
		var m = '<DIV class=divHeader align="center">' + tx('ALLIANCE FUNCTIONS') + '</div>';
		if (!Seed.allianceDiplomacies) {
			m += '<table class=xtab width=100%><tr><TD align=center style="font-size:14px;";><b>' + tx('You are not a member of an Alliance') + '</b></td></tr></table>';
			t.myDiv.innerHTML = m;
			return;
		}
		t.aid = Seed.allianceDiplomacies['allianceId'];
		m += '<table class=xtab align=center>';
		m += '<TR><TD class=xtab>&nbsp;</td><td align=right class=xtab>' + tx('Alliance Name') + ':</td><td class=xtab><b>' + Seed.allianceDiplomacies['allianceName'] + '</b></td><td class=xtab align=right>' + tx('Alliance Id') + ':</td><td class=xtab><b>' + t.aid + '</b></td></tr>';
		m += '<TR><TD class=xtab>&nbsp;</td><td align=right class=xtab>' + tx('Alliance HQ') + ':</td><td class=xtab><b>' + HQ + '</b></td><td class=xtab align=right>' + uW.g_js_strings.commonstr.coordinates + ':</td><td class=xtab><b>' + HQCoords + '</b></td></tr>';
		m += '</table>';
		m += '<TABLE width=100% class=xtab><TD width=200><INPUT style="' + HQStyle + '" id=alHQ type=submit value="' + tx("Alliance HQ") + '">&nbsp;<INPUT id=aldiplo type=submit value="' + tx("Diplomacies") + '">&nbsp;<INPUT id=alList type=submit value="' + tx('Alliance Members') + '">&nbsp;<span id=ptalliprogress></span></td>';
		m += '<td align=right>' + tx('Membership Monitor') + '&nbsp;<INPUT id=pballimonitor type=checkbox ' + (Options.AllianceOptions.Monitor ? 'CHECKED ' : '') + '/>&nbsp;' + tx('Check Every') + '&nbsp;<INPUT id=pballihours type=text size=2 value="' + Options.AllianceOptions.MonitorHours + '">&nbsp;' + tx('hours') + '</td></tr>';
		m += '</table>';
		m += '<DIV id=alHeader class=divHeader align="center">' + tx('SEARCH RESULTS') + '</div>';
		m += '<DIV id=alOverviewTab style="height:530px;max-height:535px;overflow-y:scroll;width:' + GlobalOptions.btWinSize.x + 'px";overflow-x:scroll;"></div><br>';
		t.myDiv.innerHTML = m;

		ToggleOption('AllianceOptions', 'pballimonitor', 'Monitor', t.ToggleAllianceMonitor);
		ById('pballihours').addEventListener('change', function () {
			Options.AllianceOptions.MonitorHours = ById('pballihours').value;
			if (isNaN(Options.AllianceOptions.MonitorHours)) {
				Options.AllianceOptions.MonitorHours = 1;
				ById('pballihours').value = 1;
			}
			saveOptions();
		}, false);

		ById('alList').addEventListener('click', function () {
			t.ActiveTab = 'Members';
			ById('alHeader').innerHTML = tx('SEARCH RESULTS');
			if (!t.searching) {
				t.totalmembers = 0;
				t.alliancemembers = [];
				ById('alOverviewTab').innerHTML = "";
				ById('ptalliprogress').innerHTML = uW.g_js_strings.commonstr.loadingddd;
				ById('alList').disabled = true;
				t.error = false;
				t.fetchAllianceMemberList();
			}
		}, false);
		ById('aldiplo').addEventListener('click', t.paintDiplomacy, false);
		ById('alHQ').addEventListener('click', t.paintHQOptions, false);

		if (t.HQActive) {
			t.sendDonateReport(); // check every refresh
			if (Options.AllianceOptions.DeleteHQMessages) {
				setTimeout(t.scanHQMessages, 13000, 4);
			}
		}
	},

	SetBoosts: function (rslt) {
		if (rslt.activeBuffs) {
			Seed.activeBuffs = uWCloneInto(rslt.activeBuffs);
			if (!CM.AHQTempleModel.arcanaRequirementsLoaded) {
				CM.AHQTempleModel.initializeArcanaBuffs(Seed.arcaneRequirements)
			}
			CM.AHQTempleModel.setActiveBuffs(Seed.activeBuffs)
		}
	},

	ToggleAllianceMonitor: function () {
		var t = Tabs.Alliance;
		if (Options.AllianceOptions.Monitor) { // reset last sent time...
			Options.AllianceOptions.LastChecked = 0;
			saveOptions();
		}
	},

	paintMembers: function () {
		var t = Tabs.Alliance;

		function sortFunc(a, b) {
			var t = Tabs.Alliance;
			if (typeof (a[Options.AllianceOptions.sortColNum]) == 'number') {
				if (Options.AllianceOptions.sortDir > 0)
					return a[Options.AllianceOptions.sortColNum] - b[Options.AllianceOptions.sortColNum];
				else
					return b[Options.AllianceOptions.sortColNum] - a[Options.AllianceOptions.sortColNum];
			} else if (typeof (a[Options.AllianceOptions.sortColNum]) == 'boolean') {
				return 0;
			} else {
				if (Options.AllianceOptions.sortDir > 0)
					return a[Options.AllianceOptions.sortColNum].localeCompare(b[Options.AllianceOptions.sortColNum]);
				else
					return b[Options.AllianceOptions.sortColNum].localeCompare(a[Options.AllianceOptions.sortColNum]);
			}
		}

		var EmptyDatabase = (t.alliancemembers.length == 0);
		if (!EmptyDatabase) {
			t.sortmembers = t.alliancemembers.sort(sortFunc);

			var r = 0;
			var z = '<center><table width=98% cellspacing=0 cellpadding=0 class=xtab>';
			z += '<TR></td><TD width=40 align=left nowrap>&nbsp;</td>\
				<TD width=60 nowrap><A id=AlliCol0 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.commonstr.nametx + '&nbsp;</span></a></td>\
				<TD width=60 align=right nowrap><A id=AlliCol1 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.commonstr.might + '&nbsp;</span></a></td>\
				<TD width=60 nowrap><A id=AlliCol9 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.commonstr.glory + '&nbsp;</span></a></td>\
				<TD width=60 nowrap><A id=AlliCol13 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Runes') + '&nbsp;</span></a></td>\
				<TD align=right nowrap><A id=AlliCol2 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.commonstr.cities + '&nbsp;</span></a></td>\
				<TD align=left nowrap><A id=AlliCol3 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.commonstr.position + '&nbsp;</span></a></td>\
				<TD align=left nowrap><A id=AlliCol4 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('DIP') + '&nbsp;</span></a></td>\
				<TD align=left nowrap><A id=AlliCol11 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.modal_messages_viewreports_view.lastlogin + '&nbsp;</span></a></td>\
				<TD align=left nowrap><A id=AlliCol12 onclick="ptallClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Joined') + '&nbsp;</span></a></td>';
			if (allianceleader) {
				z += '<td align=left nowrap><A class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;' + tx('Action') + '&nbsp;</span></a></td>';
			}
			z += '</tr>';

			for (var y in t.sortmembers) {
				if (t.sortmembers[y][6]) {
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
					var promstring = '';
					if (allianceleader && t.sortmembers[y][6] != uW.tvuid) {
						switch (officertype) {
							case 1:
							case 2:
								if (parseInt(officertype) < parseIntNan(t.sortmembers[y][3])) {
									promstring += '<input class=btInput type="button" value="' + uW.g_js_strings.commonstr.promote + '" onclick="ptsetMember(\'promote\',' + t.sortmembers[y][6] + ',' + t.sortmembers[y][3] + ')" />';
									if (parseIntNan(t.sortmembers[y][3]) != 4) {
										promstring += '<input class=btInput type="button" value="' + uW.g_js_strings.commonstr.demote + '" onclick="ptsetMember(\'demote\',' + t.sortmembers[y][6] + ',' + t.sortmembers[y][3] + ')" />';
									}
								}
							case 3:
								if (parseInt(officertype) < parseIntNan(t.sortmembers[y][3])) {
									promstring += '<input class=btInput type="button" value="' + uW.g_js_strings.commonstr.remove + '" onclick="ptsetMember(\'remove\',' + t.sortmembers[y][6] + ',' + t.sortmembers[y][3] + ')" />';
								}
						}

					}

					z += '<tr class="' + rowClass + '"><TD class=xtab style="padding:1px;"><A target="_blank" href="https://www.facebook.com/profile.php?id=' + t.sortmembers[y][7] + '">';
					if (Options.ChatOptions.chatIcons) { z += '<img width=40 src="https://graph.facebook.com/' + t.sortmembers[y][7] + '/picture">'; }
					else { z += '<img width=25 src="' + t.sortmembers[y][8] + '">'; }
					z += '</a></td>';
					z += '<TD class=xtab>' + PlayerLink(t.sortmembers[y][6], t.sortmembers[y][0]) + '</td>';
					z += '<TD class=xtab align=right>' + addCommas(t.sortmembers[y][1]) + '</td>';
					z += '<TD class=xtab align=right>' + addCommas(t.sortmembers[y][9]) + '</td>';
					z += '<TD class=xtab align=right>' + addCommas(t.sortmembers[y][13]) + '</td>';
					z += '<TD class=xtab align=right>' + t.sortmembers[y][2] + '</td>';
					z += '<TD class=xtab>' + officerId2String(t.sortmembers[y][3]) + '</td>';
					z += '<TD class=xtab align=right>' + t.sortmembers[y][4] + '</td>';
					z += '<TD class=xtab align=right>' + t.sortmembers[y][5] + '</td>';
					z += '<TD class=xtab align=right>' + t.sortmembers[y][10] + '</td>';
					if (allianceleader) {
						z += '<td width=100 style="padding-right:0px;" id="ptallmemberact_' + t.sortmembers[y][6] + '" align=left nowrap>' + promstring + '</td>';
					}
					z += '</tr>';
				}
			}
			z += '</table></div><div align=right><input type=button value="' + tx('Export to Excel') + '" id=alListExcel>&nbsp;&nbsp;&nbsp;</div><br>';
			ById('alHeader').innerHTML = tx('SEARCH RESULTS');
			ById('alOverviewTab').innerHTML = z;

			ById('AlliCol' + Options.AllianceOptions.sortColNum).className = 'buttonv2 std green';
			ById('alListExcel').addEventListener('click', function () {
				t.ExportToExcel();
			}, false);
		}
		else {
			ById('alOverviewTab').innerHTML = '<center>' + tx('No alliance') + '</center>';
		}

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	allClickSort: function (e) {
		var t = Tabs.Alliance;
		var newColNum = e.id.substr(7);
		ById('AlliCol' + Options.AllianceOptions.sortColNum).className = 'buttonv2 std blue';
		e.className = 'buttonv2 std green';
		if (newColNum == Options.AllianceOptions.sortColNum) { Options.AllianceOptions.sortDir *= -1; }
		else { Options.AllianceOptions.sortColNum = newColNum; }
		saveOptions();
		t.paintMembers();
	},


	ExportToExcel: function () {
		var t = Tabs.Alliance;
		var headers = ["UID", "Name", "Might", "Glory", "Runes", "Cities", "Position", "DIP", "Last Login", "Joined"];
		var ExcelTable = document.createElement('table');
		var ExcelBody = document.createElement('tbody');
		var ExcelRow = document.createElement('tr');
		var ExcelColumn = "";
		for (var i = 0; i < headers.length; i++) {
			ExcelColumn = document.createElement('th');
			ExcelColumn.appendChild(document.createTextNode(headers[i]));
			ExcelRow.appendChild(ExcelColumn);
		}
		ExcelBody.appendChild(ExcelRow);

		var columns = [];

		for (var y in t.sortmembers) {
			columns = [];
			columns.push(t.sortmembers[y][6]);
			columns.push(t.sortmembers[y][0]);
			columns.push(t.sortmembers[y][1]);
			columns.push(t.sortmembers[y][9]);
			columns.push(t.sortmembers[y][13]);
			columns.push(t.sortmembers[y][2]);
			columns.push(officerId2String(t.sortmembers[y][3]));
			columns.push(t.sortmembers[y][4]);
			columns.push(t.sortmembers[y][5]);
			columns.push(t.sortmembers[y][10]);
			columns.reverse();
			ExcelRow = document.createElement('tr');
			while (columns.length > 0) {
				ExcelColumn = document.createElement('td');
				ExcelColumn.appendChild(document.createTextNode(columns.pop()));
				ExcelRow.appendChild(ExcelColumn);
			}
			ExcelBody.appendChild(ExcelRow);
		}
		ExcelTable.appendChild(ExcelBody);
		window.open('data:application/vnd.ms-excel,' + encodeURIComponent(ExcelTable.outerHTML));
	},

	paintDiplomacy: function () {
		var t = Tabs.Alliance;
		t.ActiveTab = 'Diplomacy';
		ById('alOverviewTab').innerHTML = "";
		ById('ptalliprogress').innerHTML = "";
		ById('alHeader').innerHTML = uW.g_js_strings.allianceInfo.allidiplomacy.toUpperCase();
		var m = '<table class=xtab width=98%><tr><td valign=top width=33%>';
		m += '<table width=100% class=xtab><TR><TD colspan=3 style="background:#33CC66;" align=center><B>' + uW.g_js_strings.commonstr.friendly + ': </b></td></tr>';
		if (Seed.allianceDiplomacies['friendly'] == null) m += '<TR><TD colspan=3>' + tx('No Friendlies found') + '...</td></tr>';
		else m += '<TR><TD><b>' + uW.g_js_strings.getDiplomacy.alliname + '</b></td><TD align=center><b>' + uW.g_js_strings.commonstr.members + '</b></td></tr>';
		for (var k in Seed.allianceDiplomacies['friendly']) {
			m += t.formatAllianceName(Seed.allianceDiplomacies["friendly"][k]);
		}
		m += '</table></td><td valign=top width=33%>';
		m += '<table width=100% class=xtab><TR><TD colspan=3 style="background:#CC0033;color:#fff;" align=center><B>' + uW.g_js_strings.commonstr.hostile + ': </b></td></tr>';
		if (Seed.allianceDiplomacies['hostile'] == null) m += '<TR><TD colspan=3>' + tx('No Hostiles found') + '...</td></tr>';
		else m += '<TR><TD><b>' + uW.g_js_strings.getDiplomacy.alliname + '</b></td><TD align=center><b>' + uW.g_js_strings.commonstr.members + '</b></td></tr>';
		for (var k in Seed.allianceDiplomacies["hostile"]) {
			m += t.formatAllianceName(Seed.allianceDiplomacies["hostile"][k]);
		}
		m += '</table></td><td valign=top width=33%>';
		m += '<table width=100% class=xtab><TR><TD colspan=3 style="background:#FF6633;" align=center><B>' + uW.g_js_strings.getDiplomacy.friendlytoyou + ': </b></td></tr>';
		if (Seed.allianceDiplomacies['friendlyToYou'] == null) m += '<TR><TD colspan=3>' + tx('No Friendlies towards us found') + '...</td></tr>';
		else m += '<TR><TD><b>' + uW.g_js_strings.getDiplomacy.alliname + '</b></td><TD align=center><b>' + uW.g_js_strings.commonstr.members + '</b></td></tr>';
		for (var k in Seed.allianceDiplomacies["friendlyToYou"]) {
			m += t.formatAllianceName(Seed.allianceDiplomacies["friendlyToYou"][k]);
		}
		m += '<TR><TD colspan=3>&nbsp;</td></tr>';
		m += '<TR><TD colspan=3 style="background:#FF6633;" align=center><B>' + uW.g_js_strings.getDiplomacy.friendlytowardsthem + ': </b></td></tr>';
		if (Seed.allianceDiplomacies['friendlyToThem'] == null) m += '<TR><TD colspan=3>' + tx('No Friendlies towards them found') + '...</td></tr>';
		else m += '<TR><TD><b>' + uW.g_js_strings.getDiplomacy.alliname + '</b></td><TD align=center><b>' + uW.g_js_strings.commonstr.members + '</b></td></tr>';
		for (var k in Seed.allianceDiplomacies["friendlyToThem"]) {
			m += t.formatAllianceName(Seed.allianceDiplomacies["friendlyToThem"][k]);
		}
		m += '</table></td></tr></table>';
		ById('alOverviewTab').innerHTML = m;
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	formatAllianceName: function (alli) {
		var t = Tabs.Alliance;
		var n = '';
		n += '<TR><TD><a class=xlink onclick="ptAllianceDetails(' + alli.allianceId + ')">' + alli.allianceName + '</a></td>';
		n += '<TD align=center>' + alli.membersCount + '</td>';
		if (KOCMON_ON) n += '<TD class=xtab><a target="_blank" href="http://www.rycamelot.com/alliance/' + getServerId() + '/' + alli.allianceId + '"><img title="' + tx('View alliance on kocmon') + '" style="width:16px;vertical-align:bottom;opacity:0.75;" src="' + KOCMON_LOGO + '"></a></td>';
		n += '</tr>';
		return n;
	},

	paintHQOptions: function () {
		var t = Tabs.Alliance;
		t.ActiveTab = 'HQ';
		ById('alOverviewTab').innerHTML = "";
		ById('ptalliprogress').innerHTML = "";
		ById('alHeader').innerHTML = tx('ALLIANCE HQ');

		var m = '<div id=alHQPanel><br><center>' + uW.g_js_strings.commonstr.loadingddd + '</center><br></div>';
		m += '<div class="divHeader" align="center">' + tx('MEMBER OPTIONS') + '</div>';
		m += '<table class=xtab width=98%>';
		m += '<tr><td width=30><INPUT id=alhqdeletemsgs type=checkbox ' + (Options.AllianceOptions.DeleteHQMessages ? ' CHECKED' : '') + '\></td><td colspan=2>' + tx('Automatically delete Alliance HQ donation and Temple Arcana messages') + '</td></tr>';
		m += '<tr style="display:none;"><td class=xtab>&nbsp;</td><td class=xtab><INPUT id=alhqreport type=checkbox ' + (Options.AllianceOptions.DonateReport ? ' CHECKED' : '') + '\>&nbsp;' + tx("Send Donation report every") + '&nbsp;<INPUT id=alhqreportinterval value=' + Options.AllianceOptions.DonateReportInterval + ' type=text size=3 \>&nbsp;' + tx('hours') + '&nbsp;&nbsp;&nbsp;' + strButton8(tx('Send Now'), 'id=alhqreportsend') + '</td></tr>';
		m += '<tr><td><INPUT id=alhqautoamber type=checkbox ' + (Options.AllianceOptions.EnableAutoAmber ? ' CHECKED' : '') + '\></td><td colspan=2>' + tx('Automatically collect Amber from Alliance Mine') + '</td></tr>';
		m += '<tr><td colspan=2><b>' + tx('Automatic Daily Resource Donations') + '</b></td></tr>';
		m += '<tr><td><INPUT id=alhqautounbundle type=checkbox ' + (Options.AllianceOptions.UnBundleArcaneTablets ? ' CHECKED' : '') + '\></td><td colspan=2>' + tx('Automatically unbundle crafted Arcane Tablet items') + '</td></tr>';
		m += '<tr><td colspan=2><table class=xtab width=100%><tr><td><table class=xtab align=left cellpadding=0 cellspacing=0><tr style="vertical-align:top;">';
		for (var k in t.DonateResourceItems) {
			m += '<td rowspan=2><img width=30 src="' + IMGURL + 'items/70/' + k + '.jpg" title="' + uW.itemlist["i" + k].name + '" /></td><td width=15%>(<span id="albunowned_' + k + '"> ' + addCommas(parseIntNan(uW.ksoItems[k].count)) + '</span>)</td>';
		}
		m += '</tr><tr style="vertical-align:top;">';
		for (var k in t.DonateResourceItems) {
			m += '<td><INPUT type=CHECKBOX class=' + k + ' id="aldonchk_' + k + '" ' + (Options.AllianceOptions.AutoDonate[k].Active ? 'Checked' : '') + '></td>';
		}
		m += '</tr><tr>';
		for (var k in t.DonateResourceItems) {
			m += '<td align=right>' + tx('Donate') + ':</td><td><INPUT style="font-size:10px;" class=' + k + ' id="aldon_' + k + '" type=text size=3 maxlength=3 value="' + Options.AllianceOptions.AutoDonate[k].Amount + '"\></td>';
		}
		m += '</table></td></tr></table></td></tr>';
		m += '<tr><td colspan=2><b>' + tx('Resources Selected') + ':&nbsp;<span id=alhqdonstats>&nbsp;</span></b>&nbsp;(' + tx('excluding aetherstone and arcane tablets') + ')</td></tr>';
		m += '<tr><td colspan=2>&nbsp;</td></tr>';
		m += '<tr><td colspan=2><b>' + tx('Automatic Daily Hourglass Donations') + '</b></td></tr>';
		m += '<tr><td colspan=2><table class=xtab width=100%><tr><td><table class=xtab align=left cellpadding=0 cellspacing=0><tr style="vertical-align:top;">';
		for (var k in t.DonateHourglassItems) {
			m += '<td rowspan=2><img width=30 src="' + IMGURL + 'items/70/' + k + '.jpg" title="' + uW.itemlist["i" + k].name + '" /></td><td width=15%>(<span id="albunowned_' + k + '"> ' + addCommas(parseIntNan(uW.ksoItems[k].count)) + '</span>)</td>';
		}
		m += '</tr><tr style="vertical-align:top;">';
		for (var k in t.DonateHourglassItems) {
			m += '<td><INPUT type=CHECKBOX class=' + k + ' id="aldonchk_' + k + '" ' + (Options.AllianceOptions.AutoDonate[k].Active ? 'Checked' : '') + '></td>';
		}
		m += '</tr><tr>';
		for (var k in t.DonateHourglassItems) {
			m += '<td align=right>' + tx('Donate') + ':</td><td><INPUT style="font-size:10px;" class=' + k + ' id="aldon_' + k + '" type=text size=2 maxlength=2 value="' + Options.AllianceOptions.AutoDonate[k].Amount + '"\></td>';
		}
		m += '</table></td></tr></table></td></tr>';
		m += '<tr><td colspan=2><b>' + tx('Hourglasses Selected') + ':&nbsp;<span id=alhqhdonstats>&nbsp;</span></b></td></tr>';
		m += '</table>';

		ById('alOverviewTab').innerHTML = m;

		for (var k in t.DonateResourceItems) {
			if (!Options.AllianceOptions.AutoDonate[k].Active) { ById('aldon_' + k).disabled = true; }
			else { ById('aldon_' + k).disabled = false; }

			ById('aldonchk_' + k).addEventListener('click', function (e) {
				var item = e.target['className'];
				Options.AllianceOptions.AutoDonate[item].Active = e.target.checked;
				if (!Options.AllianceOptions.AutoDonate[item].Active) {
					Options.AllianceOptions.AutoDonate[item].Amount = 0;
					ById('aldon_' + item).value = 0;
					ById('aldon_' + item).disabled = true;
				}
				else { ById('aldon_' + item).disabled = false; }
				Options.AllianceOptions.ResLastChecked = 0;
				saveOptions();
				t.paintHQTimers();
			}, false);

			ById('aldon_' + k).addEventListener('change', function (e) { t.AutoDonateChange(e.target); }, false);
			ById('aldon_' + k).addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.AutoDonateChange); }, false);

		}

		for (var k in t.DonateHourglassItems) {
			if (!Options.AllianceOptions.AutoDonate[k].Active) { ById('aldon_' + k).disabled = true; }
			else { ById('aldon_' + k).disabled = false; }

			ById('aldonchk_' + k).addEventListener('click', function (e) {
				var item = e.target['className'];
				Options.AllianceOptions.AutoDonate[item].Active = e.target.checked;
				if (!Options.AllianceOptions.AutoDonate[item].Active) {
					Options.AllianceOptions.AutoDonate[item].Amount = 0;
					ById('aldon_' + item).value = 0;
					ById('aldon_' + item).disabled = true;
				}
				else { ById('aldon_' + item).disabled = false; }
				Options.AllianceOptions.ResLastChecked = 0;
				saveOptions();
				t.paintHQTimers();
			}, false);

			ById('aldon_' + k).addEventListener('change', function (e) { t.AutoDonateChange(e.target); }, false);
			ById('aldon_' + k).addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.AutoDonateChange); }, false);

		}

		ById('alhqdeletemsgs').addEventListener('change', function () {
			Options.AllianceOptions.DeleteHQMessages = this.checked;
			saveOptions();
			if (Options.AllianceOptions.DeleteHQMessages) { t.scanHQMessages(4); }
		}, false);

		ById('alhqreportinterval').addEventListener('keyup', function () {
			if (isNaN(ById('alhqreportinterval').value) || ById('alhqreportinterval').value < 1) { ById('alhqreportinterval').value = 1; }
			Options.AllianceOptions.DonateReportInterval = ById('alhqreportinterval').value;
			saveOptions();
			t.sendDonateReport();
		}, false);
		ById('alhqreportsend').addEventListener('click', function () {
			Options.AllianceOptions.LastDonateReport = 0;
			saveOptions();
			t.sendDonateReport(true);
		}, false);
		ToggleOption('AllianceOptions', 'alhqreport', 'DonateReport', t.sendDonateReport);
		ToggleOption('AllianceOptions', 'alhqautoamber', 'EnableAutoAmber', function () { Options.AllianceOptions.MineLastChecked = 0; saveOptions(); });
		ToggleOption('AllianceOptions', 'alhqautounbundle', 'UnBundleArcaneTablets');

		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
		FetchHQInfo(t.paintHQ);
	},

	AutoDonateChange: function (e) {
		var t = Tabs.Alliance;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		if (isNaN(e.value)) e.value = 0;
		var item = e['className'];
		Options.AllianceOptions.AutoDonate[item].Amount = e.value;
		Options.AllianceOptions.ResLastChecked = 0;
		saveOptions();
		t.paintHQTimers();
	},

	paintHQ: function (rslt, rslt2, rslt3) {
		var t = Tabs.Alliance;
		if (!rslt.ok) return;
		if (!rslt2.ok) return;
		if (!rslt3.ok) return;

		function getSpan(val1, val2, hint) {
			var span = '<span';
			if (val1 == val2) span = '<span class=boldGreen';
			if (hint) span += ' title="' + hint + '"';
			span += '>';
			return span;
		}

		t.memactive = 0;
		t.memtotal = 0;
		var memhint = '';
		if (rslt3.collect_status) {
			for (var p in rslt3.collect_status) {
				var mem = rslt3.collect_status[p];
				t.memtotal++;
				if (mem.status == 0) {
					t.memactive++;
					memhint += mem.displayName + '\n';
				}
			}
		}
		t.memspan = getSpan(t.memactive, t.memtotal, memhint) + '<b>' + t.memactive + '/' + t.memtotal + '</b></span>';
		t.DonationLimit = rslt2.dailyDonations.caps.resource;
		t.DonationHLimit = rslt2.dailyDonations.caps.hourglass;

		var VaultAmount = [];
		for (var vv in t.VaultItems) { VaultAmount[vv] = 0; }
		for (var v in rslt2.items) {
			for (var vv in t.VaultItems) {
				if (t.VaultItems[vv].hasOwnProperty(v)) {
					VaultAmount[vv] += parseIntNan(rslt2.items[v]) * parseIntNan(t.VaultItems[vv][v]);
				}
			}
		}

		var m = '<TABLE width=98% align=center cellpadding=0 cellspacing=0 class=xtab><TR style="vertical-align:top;"><td width=50% align=center><b>' + tx('RESOURCES') + '</b><br><TABLE cellpadding=1 cellspacing=0 class=xtab style="font-size:' + Options.OverviewOptions.OverviewFontSize + 'px;">';
		m += '<tr><td>&nbsp;</td><td align=right><b>' + tx('TOTAL') + '</b></td><td align=right><b>' + uW.g_js_strings.commonstr.owned.toUpperCase() + '</b></td><td align=right><b>' + uW.g_js_strings.commonstr.inventory.toUpperCase() + '</b></td><td align=right><b>' + tx('LIMIT') + '</b></td></tr>';
		m += '<tr class="evenRow"><td align=right>' + ResourceImage(GoldImage, uW.g_js_strings.commonstr.gold) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.gold + VaultAmount[0]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.gold, rslt2.dailyCaps[0]) + addCommas(rslt.hq.stats.gold) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[0]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[0]) + '</div></td></tr>';
		m += '<tr class="oddRow"><td align=right>' + ResourceImage(FoodImage, uW.g_js_strings.commonstr.food) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.food + VaultAmount[1]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.food, rslt2.dailyCaps[1]) + addCommas(rslt.hq.stats.food) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[1]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[1]) + '</div></td></tr>';
		m += '<tr class="evenRow"><td align=right>' + ResourceImage(WoodImage, uW.g_js_strings.commonstr.wood) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.wood + VaultAmount[2]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.wood, rslt2.dailyCaps[2]) + addCommas(rslt.hq.stats.wood) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[2]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[2]) + '</div></td></tr>';
		m += '<tr class="oddRow"><td align=right>' + ResourceImage(StoneImage, uW.g_js_strings.commonstr.stone) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.stone + VaultAmount[3]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.stone, rslt2.dailyCaps[3]) + addCommas(rslt.hq.stats.stone) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[3]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[3]) + '</div></td></tr>';
		m += '<tr class="evenRow"><td align=right>' + ResourceImage(OreImage, uW.g_js_strings.commonstr.ore) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.ore + VaultAmount[4]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.ore, rslt2.dailyCaps[4]) + addCommas(rslt.hq.stats.ore) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[4]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[4]) + '</div></td></tr>';
		m += '<tr class="oddRow"><td align=right>' + ResourceImage(AetherImage, uW.g_js_strings.commonstr.aetherstone) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.aetherstone + VaultAmount[5]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.aetherstone, rslt2.dailyCaps[5]) + addCommas(rslt.hq.stats.aetherstone) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[5]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[5]) + '</div></td></tr>';
		m += '<tr class="evenRow"><td align=right>' + ResourceImage(AmberImage, uW.g_js_strings.alliance.resource1) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.amber + VaultAmount[6]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.amber, rslt2.dailyCaps[6]) + addCommas(rslt.hq.stats.amber) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[6]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[6]) + '</div></td></tr>';
		m += '<tr class="evenRow"><td align=right>' + ResourceImage(ArcaneTabletImage, uW.g_js_strings.playerGuide.ahq_14_h) + '</td><td align=right><div class="totalCell xtabBorder">' + addCommas(rslt.hq.stats.arcanetablet + VaultAmount[7]) + '</div></td><td align=right><div class=xtabBorder>' + getSpan(rslt.hq.stats.arcanetablet, rslt2.dailyCaps[7]) + addCommas(rslt.hq.stats.arcanetablet) + '</span></div></td><td align=right><div class=xtabBorder>' + addCommas(VaultAmount[7]) + '</div></td><td align=right><div class=xtabBorder>' + addCommas(rslt2.dailyCaps[7]) + '</div></td></tr>';

		m += '</table></td><td width=50% align=center><b>' + tx('ACTIVITY') + '</b><br><TABLE cellpadding=1 cellspacing=0 class=xtab>';
		m += '<tr><td align=right>' + tx('Resource Donations') + ':</td><td>' + getSpan(rslt2.dailyDonations.quantity.resource, rslt2.dailyDonations.caps.resource) + '<b>' + addCommas(rslt2.dailyDonations.quantity.resource) + '/' + addCommas(rslt2.dailyDonations.caps.resource) + '</b></span>&nbsp;&nbsp;' + strButton8(tx('Donate Now'), 'id=btResDonateButton onclick="btDonateNow();"') + '</td></tr>';
		m += '<tr><td align=right>' + tx('Alliance Donations') + ':</td><td>' + getSpan(rslt2.dailyDonations.quantity.alliance, rslt2.dailyDonations.caps.alliance) + '<b>' + addCommas(rslt2.dailyDonations.quantity.alliance) + '/' + addCommas(rslt2.dailyDonations.caps.alliance) + '</b></span></td></tr>';
		m += '<tr><td align=right>' + tx('Hourglass Donations') + ':</td><td>' + getSpan(rslt2.dailyDonations.quantity.hourglass, rslt2.dailyDonations.caps.hourglass) + '<b>' + rslt2.dailyDonations.quantity.hourglass + '/' + rslt2.dailyDonations.caps.hourglass + '</b></span></td></tr>';
		m += '<tr><td align=right>&nbsp;</td><td>&nbsp;</td></tr>';
		m += '<tr><td align=right>' + tx('Amber Mine Status') + ':</td><td><span id=alminestatus>&nbsp;</span></td></tr>';
		m += '<tr><td align=right>' + tx('Alliance Mining') + ':</td><td><span id=alalliminestatus>' + t.memspan + '</span></td></tr>';
		m += '<tr><td align=right>&nbsp;</td><td>&nbsp;</td></tr>';
		m += '<tr><td align=right>' + tx('Arcane Temple Aura Distance') + ':</td><td><span id=alauradistance>&nbsp;</span></td></tr>';
		m += '<tr><td align=right>' + tx('Alliance Arcana Limit') + ':</td><td><span id=almaxalliancearcana>&nbsp;</span></td></tr>';
		m += '<tr><td align=right>' + tx('Personal Arcana Limit') + ':</td><td><span id=almaxpersonalarcana>&nbsp;</span></td></tr>';
		m += '</table></td></tr></table>';

		if (ById('alHQPanel')) {
			ById('alHQPanel').innerHTML = m;

			if (rslt2.dailyDonations.quantity.resource >= rslt2.dailyDonations.caps.resource || rslt2.dailyDonations.quantity.alliance >= rslt2.dailyDonations.caps.alliance) {
				ById('btResDonateButton').setAttribute("style", "display:none");
			}

			ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
			t.paintHQTimers();
		}
	},

	paintHQTimers: function () {
		var t = Tabs.Alliance;
		if (t.serverwait) return;
		var now = uW.unixtime();
		var cooldown = 0;
		var allicooldown = 0;
		if (typeof Seed.allianceHQ.mineCooldown !== "undefined") { cooldown = +Seed.allianceHQ.mineCooldown; }
		if (typeof Seed.allianceHQ.allianceMineCooldown !== "undefined") { allicooldown = +Seed.allianceHQ.allianceMineCooldown; }

		if (ById('alminestatus')) {
			if (allicooldown > cooldown && allicooldown > now) { ById('alminestatus').innerHTML = '<span class=boldRed>' + tx('Cannot mine for') + '&nbsp;' + timestr(allicooldown - now) + '</span>'; }
			else {
				if (cooldown > now) { ById('alminestatus').innerHTML = '<span class=boldGreen>' + uW.g_js_strings.alliance.mining + '&nbsp;' + timestr(cooldown - now) + '</span>'; }
				else { ById('alminestatus').innerHTML = '<span class=boldRed>' + uW.g_js_strings.commonstr.inactive + '</span>&nbsp;' + strButton8(uW.g_js_strings.alliance.collect, 'id=btAmberButton onclick="btCollectAmber();"'); }
			}
		}
		if (ById('alauradistance')) {
			if (ArcanaEnabled()) {
				t.AuraDistance = Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance;
				t.MaxAllianceArcana = Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].maxActiveAlliance;
				t.MaxPersonalArcana = Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].maxActivePersonal;
				ById('alauradistance').innerHTML = '<b>' + parseIntNan(t.AuraDistance) + '</b>&nbsp;' + strButton8(tx('View on map'), 'onclick="btViewAuraMap()"');
				ById('almaxalliancearcana').innerHTML = '<b>' + parseIntNan(t.MaxAllianceArcana) + '</b>';
				ById('almaxpersonalarcana').innerHTML = '<b>' + parseIntNan(t.MaxPersonalArcana) + '</b>';
			}
			else {
				ById('alauradistance').innerHTML = '<span class=boldRed>' + tx('No Arcane Temple') + '<span>';
				ById('almaxalliancearcana').innerHTML = '<span class=boldRed>' + tx('No Arcane Temple') + '<span>';
				ById('almaxpersonalarcana').innerHTML = '<span class=boldRed>' + tx('No Arcane Temple') + '<span>';
			}
		}
		for (var k in t.DonateResourceItems) {
			if (ById('albunowned_' + k)) {
				ById('albunowned_' + k).innerHTML = addCommas(parseIntNan(uW.ksoItems[k].count));
			}
		}
		for (var k in t.DonateHourglassItems) {
			if (ById('albunowned_' + k)) {
				ById('albunowned_' + k).innerHTML = addCommas(parseIntNan(uW.ksoItems[k].count));
			}
		}
		if (ById('alhqdonstats')) {
			var count = 0;
			for (var k in t.DonateResourceItems) {
				if (t.DonateResourceItems[k] > 1) { // don't include aether and arcane tablets
					count += (Options.AllianceOptions.AutoDonate[k].Amount * t.DonateResourceItems[k]);
				}
			}
			var rc = '';
			if (count == t.DonationLimit) { rc = 'boldGreen' }
			else if (count > t.DonationLimit) { rc = 'boldRed' }
			ById('alhqdonstats').className = rc;
			ById('alhqdonstats').innerHTML = addCommas(count) + '/' + addCommas(t.DonationLimit);
		}
		if (ById('alhqhdonstats')) {
			var count = 0;
			for (var k in t.DonateHourglassItems) {
				count += (Options.AllianceOptions.AutoDonate[k].Amount * t.DonateHourglassItems[k]);
			}
			var rc = '';
			if (count == t.DonationHLimit) { rc = 'boldGreen' }
			else if (count > t.DonationHLimit) { rc = 'boldRed' }
			ById('alhqhdonstats').className = rc;
			ById('alhqhdonstats').innerHTML = addCommas(count) + '/' + addCommas(t.DonationHLimit);
		}
	},

	fetchAllianceMemberList: function (silent, notify) {
		var t = Tabs.Alliance;
		if (t.serverwait) { // if busy wait 2 secs and loop again
			setTimeout(t.fetchAllianceMemberList, 2000, silent, notify);
			return;
		}
		if (!silent) ById('alList').disabled = true;
		t.serverwait = true;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceGetInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				t.totalmembers = parseIntNan(rslt["allianceInfo"]["members"]);
				t.totalpages = Math.ceil(t.totalmembers / 10);
				t.returnedpages = 0;
				for (var i = 1; i <= t.totalpages; i++) {
					setTimeout(t.fetchAllianceMemberPage, (300 * i), i, silent, notify);
				}
			},
			onFailure: function () {
				if (!silent) {
					ById('alList').disabled = false;
					ById('ptalliprogress').innerHTML = "ERROR!";
				}
				t.error = true;
				t.serverwait = false;
			},
		}, true);
	},

	fetchAllianceMemberPage: function (pageNo, silent, notify) {
		var t = Tabs.Alliance;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pageNo = pageNo;
		params.pf = 0;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceGetMembersInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (info) {
				if (info.ok) {
					for (var k in info["memberInfo"]) {
						if (info["memberInfo"][k]["might"] != undefined && !t.error) {
							var datesplit = info["memberInfo"][k]["lastLogin"].split(" ");
							var mnth = uW.MONTH_NAMES.indexOf(datesplit[0]);
							if (mnth == -1) mnth = 0;
							if (mnth > 11) mnth = mnth - 11;
							if (mnth < 10) { var amnth = "A0" + mnth; } else { var amnth = "A" + mnth; }
							var LogTime = amnth + datesplit[1] + datesplit[2];
							var datesplit = info["memberInfo"][k]["dateJoined"].split(" ");
							var mnth = uW.MONTH_NAMES.indexOf(datesplit[1]);
							if (mnth == -1) mnth = 0;
							if (mnth > 11) mnth = mnth - 11;
							if (mnth < 10) { var amnth = "A0" + mnth; } else { var amnth = "A" + mnth; }
							var JoinTime = datesplit[2] + amnth + datesplit[0];
							t.alliancemembers.push([info["memberInfo"][k]["name"], parseInt(info["memberInfo"][k]["might"]), parseInt(info["memberInfo"][k]["cities"]), parseInt(info["memberInfo"][k]["positionType"]), parseInt(info["memberInfo"][k]["daysInPosition"]), info["memberInfo"][k]["lastLogin"], parseInt(info["memberInfo"][k]["userId"]), parseInt(info["memberInfo"][k]["fbuid"]), info["memberInfo"][k]["avatarurl"], parseInt(info["memberInfo"][k]["glory"]), info["memberInfo"][k]["dateJoined"], LogTime, JoinTime, parseInt(info["kothScore"][k] || 0)]);
						}
					}
					if (!t.error && !silent) ById('ptalliprogress').innerHTML = '(' + (t.alliancemembers.length) + '/' + t.totalmembers + ')';
					if (!silent) {
						ById('alOverviewTab').innerHTML = "";
						t.paintMembers();
					}
					t.returnedpages++;
					if (t.returnedpages >= t.totalpages) {
						if (!silent) ById('alList').disabled = false;
						t.serverwait = false;
						if (notify) { notify(); }
					}
				} else if (info.error) {
					if (!silent) {
						ById('alList').disabled = false;
						ById('ptalliprogress').innerHTML = "ERROR!";
					}
					t.error = true;
					t.serverwait = false;
				}
			},
			onFailure: function () {
				if (!silent) {
					ById('alList').disabled = false;
					ById('ptalliprogress').innerHTML = "ERROR!";
				}
				t.error = true;
				t.serverwait = false;
			},
		}, true);
	},

	show: function () {
		var t = Tabs.Alliance;
		AreYouALeader();
		if (t.ActiveTab == 'HQ') { FetchHQInfo(t.paintHQ); }
		else {
			if (t.HQActive && t.ActiveTab == '') {
				t.paintHQOptions();
			}
		}
	},

	loadLog: function () {
		var t = Tabs.Alliance;
		var serverID = getServerId();
		s = GM_getValue('HQDonationLog_' + serverID + '_' + uW.tvuid);
		if (s != null) {
			opts = JSON2.parse(s);
			for (var k in opts)
				t.DonationLog[k] = opts[k];
		}
	},

	saveLog: function () {
		var t = Tabs.Alliance;
		setTimeout(function () { GM_setValue('HQDonationLog_' + getServerId() + '_' + uW.tvuid, JSON2.stringify(t.DonationLog)); }, 0); // get around GM_SetValue uW error
	},


	EverySecond: function () {
		var t = Tabs.Alliance;
		var aid = getMyAlliance()[0];
		var now = unixTime();

		t.LoopCounter = t.LoopCounter + 1;

		if (aid > 0) {
			if (t.LoopCounter >= 60) {
				if (Options.AllianceOptions.Monitor && Options.AllianceOptions.LastChecked + (Options.AllianceOptions.MonitorHours * 60 * 60) < now) {
					Options.AllianceOptions.LastChecked = now;
					if (aid != Options.AllianceOptions.MonitorId) { // new alliance, just set members, don't send message..
						actionLog('Setting alliance monitor start position for this alliance', 'ALLIANCE');
						t.totalmembers = 0;
						t.alliancemembers = [];
						t.error = false;
						t.fetchAllianceMemberList(true, t.SaveMembers);
					}
					else {
						actionLog('Checking alliance member list for changes', 'ALLIANCE');
						t.totalmembers = 0;
						t.alliancemembers = [];
						t.error = false;
						t.fetchAllianceMemberList(true, t.CompareMembers);
					}
					Options.AllianceOptions.MonitorId = aid;
					saveOptions();
				}
			}
		}

		if (t.HQActive) {
			if (Options.AllianceOptions.EnableAutoAmber && Options.AllianceOptions.MineLastChecked + (15 * 60) < now) {
				t.CheckMineAmber();
			}
			if (Options.AllianceOptions.ResLastChecked + (15 * 60) < now) {
				t.CheckDonateResources();
			}
			if (t.LoopCounter >= 60) { // HQ Actions every minute
				if (Options.AllianceOptions.UnBundleArcaneTablets) {
					t.CheckUnBundleArcaneTablets();
				}
				t.sendDonateReport();
				t.scanHQMessages(1);
				if (tabManager.currentTab.name == 'Alliance' && t.ActiveTab == 'HQ' && Options.btWinIsOpen) {
					FetchHQInfo(t.paintHQ);
				}
			}
			if (tabManager.currentTab.name == 'Alliance' && t.ActiveTab == 'HQ' && Options.btWinIsOpen) {
				t.paintHQTimers();
			}
		}
		// reset loop counter
		if (t.LoopCounter >= 60) {
			t.LoopCounter = 0;
		}
	},

	SaveMembers: function () {
		var t = Tabs.Alliance;
		Options.AllianceOptions.LastMemberList = {};
		for (var y in t.alliancemembers) {
			if (t.alliancemembers[y][6]) {
				Options.AllianceOptions.LastMemberList[t.alliancemembers[y][6]] = JSON.parse(JSON.stringify(t.alliancemembers[y]));
			}
		}
		saveOptions();
	},

	CompareMembers: function () {
		var t = Tabs.Alliance;
		var MemberChanges = false;
		var message = '%0A ' + tx('Additional Members') + ': %0A';

		for (var y in t.alliancemembers) {
			if (t.alliancemembers[y][6] && !Options.AllianceOptions.LastMemberList.hasOwnProperty(t.alliancemembers[y][6].toString())) {
				MemberChanges = true;
				message += t.alliancemembers[y][0] + ' (Might ' + addCommas(t.alliancemembers[y][1]) + ') ' + officerId2String(t.alliancemembers[y][3]) + ' UID:' + t.alliancemembers[y][6] + ' %0A';
			}
		}
		if (!MemberChanges) { message += tx('None') + ' %0A'; }

		var MemberLeft = false;
		message += '%0A ' + tx('Departed Members') + ': %0A';
		for (var x in Options.AllianceOptions.LastMemberList) {
			if (Options.AllianceOptions.LastMemberList[x][6]) {
				var Found = false;
				for (var y in t.alliancemembers) {
					if (t.alliancemembers[y][6] && x == t.alliancemembers[y][6].toString()) {
						Found = true;
						break;
					}
				}
				if (!Found) {
					MemberLeft = true;
					MemberChanges = true;
					message += Options.AllianceOptions.LastMemberList[x][0] + ' (Might ' + addCommas(Options.AllianceOptions.LastMemberList[x][1]) + ') ' + officerId2String(Options.AllianceOptions.LastMemberList[x][3]) + ' UID:' + Options.AllianceOptions.LastMemberList[x][6] + ' %0A';
				}
			}
		}
		if (!MemberLeft) { message += tx('None') + ' %0A'; }

		if (MemberChanges) {
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.emailTo = Seed.player['name'];
			params.subject = tx("Alliance Membership Change Report for") + " " + getMyAlliance()[1];
			params.message = message;
			params.requestType = "COMPOSED_MAIL";
			new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					if (rslt.ok) { DeleteLastMessage(); }
				},
			}, true);

			// save current position...
			t.SaveMembers();
		}
	},

	setMember: function (actionType, pid, pos) { // "promote", "demote", "remove"
		var t = Tabs.Alliance;
		var popConfirm = null;
		popConfirm = new CPopup('ptConfirmAction', 0, -100, 500, 100, true, function () { clearTimeout(1000); });
		popConfirm.centerMe(mainPop.getMainDiv());
		var m = '<DIV style="height:50px;"><br><TABLE align=center cellpadding=0 cellspacing=0 width=100% class=xtab>';
		if (pos == 2 && actionType == "promote") { m += '<tr><TD align=center><span class=boldRed>' + tx("WARNING - This action will demote you to Vice Chancellor!") + '<br>&nbsp;</td></tr>'; }
		m += '<tr><TD align=center><INPUT id=ptConfirm type=submit value="' + actionType.toUpperCase() + '" \>&nbsp;<INPUT id=ptCancel type=submit value="' + uW.g_js_strings.commonstr.cancel + '" \></td></tr></table></div>';
		popConfirm.getMainDiv().innerHTML = m;
		ResetFrameSize('ptConfirmAction', 100, 500);
		popConfirm.getTopDiv().innerHTML = '<DIV align=center><b>' + tx('Confirm action on alliance member') + '?</b></div>';
		popConfirm.show(true);
		ById('ptConfirm').addEventListener('click', function () {
			popConfirm.show(false);
			popConfirm.onClose();
			popConfirm.destroy();
			popConfirm = null;

			var params = uW.Object.clone(uW.g_ajaxparams);
			var fileName = "";
			var actionName = "";
			if (actionType == "promote") {
				fileName = "alliancePromoteMember.php";
				actionName = tx('Promoted!');
			} else {
				if (actionType == "demote") {
					fileName = "allianceDemoteMember.php";
					actionName = tx('Demoted!');
				} else {
					if (actionType == "remove") {
						fileName = "allianceRemoveMember.php";
						actionName = tx('Removed!');
					}
				}
			}
			if (fileName != "") {
				params.memberOfficerType = pos;
				params.memberId = pid;
				new MyAjaxRequest(uW.g_ajaxpath + "ajax/" + fileName + uW.g_ajaxsuffix, {
					method: "post",
					parameters: params,
					onSuccess: function (rslt) {
						if (rslt.ok) {
							ById('ptallmemberact_' + pid).innerHTML = actionName;
						} else {
							uW.Modal.showAlert(uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback));
							ById('ptallmemberact_' + pid).innerHTML = tx('ERROR!');
						}
						t.totalmembers = 0;
						t.alliancemembers = [];
						t.error = false;
						t.fetchAllianceMemberList(true, t.paintMembers); // refresh members display
					},
				}, true)
			}
		}, false);
		ById('ptCancel').addEventListener('click', function () {
			popConfirm.show(false);
			popConfirm.onClose();
			popConfirm.destroy();
			popConfirm = null;
		}, false);
	},

	scanHQMessages: function (page) {
		var t = Tabs.Alliance;
		page = Number(page);
		if (!Options.AllianceOptions.DeleteHQMessages) { return; }
		if (page <= 0) { return; }
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.requestType = "GET_MESSAGE_HEADERS_FOR_USER_INBOX";
		params.boxType = "hq_messages";
		params.pageNo = page;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var deletes1 = new Array();
					var deletes2 = new Array();
					for (var i in rslt.message) {
						if (rslt.message[i].subject) {
							var HQMessage = false;
							for (var j in HQText) {
								if (rslt.message[i].subject.indexOf(HQText[j]) != -1) {
									HQMessage = true;
									break;
								}
							}
							if (rslt.message[i].fromUserId == "0" && HQMessage) {
								//t.foundHQMessage(i);
								if (deletes1.indexOf(i) == -1) { deletes1.push(i); }
							}
							// remove temple arcana messages too
							var HQMessage = false;
							for (var j in HQText2) {
								if (rslt.message[i].subject.indexOf(HQText2[j]) != -1) {
									HQMessage = true;
									break;
								}
							}
							if (rslt.message[i].fromUserId == "0" && HQMessage) {
								if (deletes2.indexOf(i) == -1) { deletes2.push(i); }
							}
						}
					}
					if (deletes1.length > 0) {
						actionLog('Deleting ' + deletes1.length + ' Alliance HQ donation messages', 'ALLIANCE');
						t.deletemsgs(deletes1.join(","));
					}
					if (deletes2.length > 0) {
						actionLog('Deleting ' + deletes2.length + ' Alliance HQ Temple Arcana messages', 'ALLIANCE');
						t.deletemsgs(deletes2.join(","));
					}
					setTimeout(t.scanHQMessages, 5000, parseInt(page - 1));
				} else return;
			},
		}, true);
	},

	foundHQMessage: function (id) {
		var t = Tabs.Alliance;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.messageId = id;
		params.requestType = "GET_MESSAGE_FOR_ID";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var name = rslt.messageBody.split(" ")[0];
					var myregexp = /has donated (.*) to/;
					var match = myregexp.exec(rslt.messageBody)[1] || '1';
					var amount = parseIntNan(match.substr(0, match.indexOf(' ')));
					var type = match.substr(match.indexOf(' ') + 1) || "Unknown";
					if (!t.DonationLog[name]) t.DonationLog[name] = {};
					if (t.DonationLog[name][type]) { t.DonationLog[name][type] += amount; }
					else { t.DonationLog[name][type] = amount; }
					t.saveLog();
					if (GlobalOptions.ExtendedDebugMode) logit('Found Alliance HQ donation message from ' + name + ' - ' + type + ' x' + amount);
				}
			},
		}, true);
	},

	deletemsgs: function (msgid) {
		var t = Tabs.Alliance;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.requestType = "ACTION_ON_MESSAGES";
		params.selectedAction = "delete";
		params.selectedMessageIds = msgid;
		params.boxType = "hq_messages";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { },
		}, true);
	},

	sendDonateReport: function (force) {
		return; // disabled
		var t = Tabs.Alliance;
		if (!Options.AllianceOptions.DonateReport && !force) { return; }

		var now = unixTime();

		if (!force) {
			if (now < (parseInt(Options.AllianceOptions.LastDonateReport) + (Options.AllianceOptions.DonateReportInterval * 60 * 60))) { return; }
			var message = tx('Alliance HQ Donation Report for') + ' ' + Options.AllianceOptions.DonateReportInterval + ' ' + tx('hours (or since last report)') + ' %0A';
		}
		else {
			var message = tx('Alliance HQ Donation Report (since last report)') + ' %0A';
		}

		var total = 0;

		if (Options.AllianceOptions.DeleteHQMessages) {
			message += '%0A';
			for (var z in t.DonationLog) {
				message += z + ': %0A';
				for (var zz in t.DonationLog[z]) {
					message += zz + ' x ' + t.DonationLog[z][zz] + '%0A';
					total += t.DonationLog[z][zz];
				}
				message += '%0A';
			}
			message += tx('Total number of donations') + ': ' + total + '%0A';
		}
		else {
			message += tx('Donated item details only available if the option "Delete HQ donation messages" is ticked') + '%0A';
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = tx("Alliance HQ Donation Summary");

		params.message = message;
		params.requestType = "COMPOSED_MAIL";

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					DeleteLastMessage();
					if (Options.AllianceOptions.DeleteHQMessages) {
						t.DonationLog = {};
						t.saveLog();
					}
				}
			},
		});

		Options.AllianceOptions.LastDonateReport = now;
		saveOptions();
	},

	CheckMineAmber: function () {
		var t = Tabs.Alliance;
		var now = unixTime();
		var cooldown = 0;
		if (typeof Seed.allianceHQ.mineCooldown !== "undefined") { cooldown = +Seed.allianceHQ.mineCooldown; }
		if (typeof Seed.allianceHQ.allianceMineCooldown !== "undefined" && Seed.allianceHQ.allianceMineCooldown > cooldown) {
			cooldown = +Seed.allianceHQ.allianceMineCooldown;
		}
		if (cooldown < now) {
			jQuery('#btAmberButton').addClass("disabled");
			t.serverwait = true;
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.context = "allianceHQMineCollectAmber.php";
			new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHQMineCollectAmber.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					if (rslt.ok) {
						var tempstats = CM.AllianceHQModel.getStats();
						tempstats.amber += rslt.amber;
						CM.AllianceHQModel.setStats(uWCloneInto(tempstats));
						var data = { interval: 8 * 60 * 60, startTime: 0, endTime: 0, nextCollectTime: uW.unixtime() };
						if (typeof rslt.nextCollectTime !== "undefined") {
							Seed.allianceHQ.mineCooldown = rslt.nextCollectTime;
							data.nextCollectTime = rslt.nextCollectTime;
						}
						if (typeof rslt.data !== "undefined") { data = rslt.data; }
						CM.automine.update(uWCloneInto(data));
						actionLog(uW.g_js_strings.alliance.amberExtracted.replace("%1$s", rslt.amber) + " " + rslt.message, 'ALLIANCE');
					}
					else {
						if (!rslt.feedback) { rslt.feedback = 'Error mining amber'; }
						actionLog(rslt.feedback, 'ALLIANCE');
						Options.AllianceOptions.MineLastChecked = uW.unixtime() + (45 * 60); // don't try auto again for another hour
					}
					t.serverwait = false;
				},
				onFailure: function () {
					actionLog('Error mining amber (AJAX Error)', 'ALLIANCE');
					t.serverwait = false;
				},
			});
		}
		Options.AllianceOptions.MineLastChecked = now;
		saveOptions();
	},

	CheckDonateResources: function () {
		var t = Tabs.Alliance;
		var now = unixTime();

		Options.AllianceOptions.ResLastChecked = now;
		saveOptions();

		var params = uW.Object.clone(uW.g_ajaxparams);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqOpen.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var params2 = uW.Object.clone(uW.g_ajaxparams);
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqVaultOpen.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params2,
						onSuccess: function (rslt2) {
							if (rslt2.ok) {
								// check each resource. Don't try to donate amber or arcane tablets above limit
								for (var k in t.DonateResourceItems) {
									var free = parseIntNan(rslt2.dailyDonations.caps.resource) - parseIntNan(rslt2.dailyDonations.quantity.resource);
									var alliancefree = parseIntNan(rslt2.dailyDonations.caps.alliance) - parseIntNan(rslt2.dailyDonations.quantity.alliance);
									if (alliancefree < free) free = alliancefree;
									if (k == 40050) { free = parseIntNan(rslt2.dailyCaps[6]) - parseIntNan(rslt.hq.stats.amber); }
									if (k == 43000) { free = parseIntNan(rslt2.dailyCaps[7]) - parseIntNan(rslt.hq.stats.arcanetablet); }
									if (free > 0) {
										var remain = (Options.AllianceOptions.AutoDonate[k].Amount - Options.AllianceOptions.AutoDonate[k].Donated) * t.DonateResourceItems[k];
										var avail = parseIntNan(uW.ksoItems[k].count) * t.DonateResourceItems[k];
										if (Options.AllianceOptions.AutoDonate[k].Active && remain > 0 && avail > 0) { // can donate this resource this loop!
											var donateamount = remain;
											if (avail < donateamount) donateamount = avail;
											if (free < donateamount) donateamount = free;
											donateamount = Math.floor(donateamount / t.DonateResourceItems[k]);
											t.Donate(k, donateamount, function (k, donateamount) {
												Options.AllianceOptions.AutoDonate[k].Donated += donateamount;
												Options.AllianceOptions.ResLastChecked = 0; // check the next resource immediately!
												saveOptions();
											});
											break;
										}
									}
								}
								for (var k in t.DonateHourglassItems) {
									var free = parseIntNan(rslt2.dailyDonations.caps.hourglass) - parseIntNan(rslt2.dailyDonations.quantity.hourglass);
									if (free > 0) {
										var remain = (Options.AllianceOptions.AutoDonate[k].Amount - Options.AllianceOptions.AutoDonate[k].Donated) * t.DonateHourglassItems[k];
										var avail = parseIntNan(uW.ksoItems[k].count) * t.DonateHourglassItems[k];
										if (Options.AllianceOptions.AutoDonate[k].Active && remain > 0 && avail > 0) { // can donate this resource this loop!
											var donateamount = remain;
											if (avail < donateamount) donateamount = avail;
											if (free < donateamount) donateamount = free;
											donateamount = Math.floor(donateamount / t.DonateHourglassItems[k]);
											t.Donate(k, donateamount, function (k, donateamount) {
												Options.AllianceOptions.AutoDonate[k].Donated += donateamount;
												Options.AllianceOptions.ResLastChecked = 0; // check the next resource immediately!
												saveOptions();
											});
											break;
										}
									}
								}
							}
						},
						onFailure: function () { },
					});
				}
			},
			onFailure: function () { },
		});
	},

	CheckUnBundleArcaneTablets: function () {
		var t = Tabs.Alliance;
		for (var i = 0; i < t.ArcaneBundles.length; i++) {
			var item = uW.ksoItems[t.ArcaneBundles[i]];
			if (item) {
				var useamount = Math.min(parseIntNan(item.count), parseIntNan(Seed.items["i" + t.ArcaneBundles[i]]));
				if (useamount > 0) { // automatically use items to unbundle...
					actionLog('Attempting to unbundle ' + useamount + ' ' + item.name, 'ALLIANCE');
					ItemMultiUseController.UseItems(t.ArcaneBundles[i], useamount);
				}
			}
		}
	},

	CheckNewDay: function () {
		var t = Tabs.Alliance;
		var date = new Date();
		var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
		var offset = -8 + (getDST(date) / 3600);
		var today = new Date(utc + (3600000 * offset));
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();
		if (dd < 10) { dd = '0' + dd }
		if (mm < 10) { mm = '0' + mm }
		today = dd + '/' + mm + '/' + yyyy;
		if (today != Options.AllianceOptions.HQDate) {
			Options.AllianceOptions.HQDate = today;
			for (var k in t.DonateResourceItems) {
				if (Options.AllianceOptions.AutoDonate[k]) {
					Options.AllianceOptions.AutoDonate[k].Donated = 0;
				}
			}
			for (var k in t.DonateHourglassItems) {
				if (Options.AllianceOptions.AutoDonate[k]) {
					Options.AllianceOptions.AutoDonate[k].Donated = 0;
				}
			}
			saveOptions();
		}
	},

	Donate: function (item, amount, notify) {
		var t = Tabs.Alliance;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.itemId = item;
		params.quantity = amount;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHQVaultDonate.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					CM.InventoryView.removeItemFromInventory(item, amount);
					if (typeof CM.AHQitems[rslt.itemId] !== "undefined") { CM.AHQitems[rslt.itemId] += amount; }
					else { CM.AHQitems[rslt.itemId] = amount; }
					actionLog(amount + ' ' + uW.itemlist['i' + item].name + ' donated to alliance HQ', 'ALLIANCE');
					if (notify) notify(item, amount);
				}
				else {
					if (!rslt.feedback) rslt.feedback = 'Unknown error';
					actionLog('Error donating ' + amount + ' ' + uW.itemlist['i' + item].name + ' to alliance HQ - ' + rslt.feedback, 'ALLIANCE');
				}
			},
			onFailure: function (rslt) {
				actionLog('Error donating ' + amount + ' ' + uW.itemlist['i' + item].name + ' to alliance HQ - AJAX Error', 'ALLIANCE');
			},
		});
	},

	ViewAuraMap: function () {
		var t = Tabs.Alliance;
		Tabs.Player.eventMapExternalTabClick(t.aid, Seed.allianceDiplomacies['allianceName']);
	},
};
