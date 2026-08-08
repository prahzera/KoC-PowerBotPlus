/** Messages Tab **/

Tabs.Messages = {
	tabOrder: 1080,
	tabLabel: 'Rpt Search',
	myDiv: null,
	minPages: 0,
	maxPages: 0,
	data: [],
	report: {},
	DisplayIdArray: [],
	DisplayArray: [],
	ScoutIdArray: [],
	ScoutArray: [],
	ScoutResults: [],
	totalPages: 0,
	what: '',
	whatNot: '',
	content: '',
	FromUnixTime: 0,
	ToUnixTime: 0,
	ItemsFound: {},
	ThroneItemsFound: {},
	ChampItemsFound: {},
	JewelItemsFound: {},
	PlayerData: {},
	gold: 0,
	food: 0,
	wood: 0,
	stone: 0,
	ore: 0,
	Options: {
		rptType: 'alliance',
		arAttacker: 'Both',
		arTarget: 'Both',
		arPageFrom: 1,
		arPageTo: 10,
		arAttack: true,
		arScout: true,
	},

	init: function (div) {
		var t = Tabs.Messages;
		t.myDiv = div;

		var link = window.document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = http + 'code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css';
		document.getElementsByTagName("HEAD")[0].appendChild(link);

		// set up regional datepicker text strings

		if (Options.Language != 'en') {
			jQuery.datepicker.regional[Options.Language] = {};
			jQuery.datepicker.regional[Options.Language].closeText = uW.g_js_strings.commonstr.close;
			jQuery.datepicker.regional[Options.Language].prevText = uW.g_js_strings.commonstr.prev;
			jQuery.datepicker.regional[Options.Language].nextText = uW.g_js_strings.commonstr.next;
			jQuery.datepicker.regional[Options.Language].currentText = tx("Today");
			jQuery.datepicker.regional[Options.Language].monthNames = [];
			jQuery.datepicker.regional[Options.Language].monthNamesShort = [];
			jQuery.datepicker.regional[Options.Language].dayNames = [];
			jQuery.datepicker.regional[Options.Language].dayNamesShort = [];
			jQuery.datepicker.regional[Options.Language].dayNamesMin = [];
			jQuery.datepicker.regional[Options.Language].weekHeader = tx("WK");
			jQuery.datepicker.regional[Options.Language].dateFormat = "dd/mm/yy";
			jQuery.datepicker.regional[Options.Language].firstDay = 1;
			jQuery.datepicker.regional[Options.Language].isRTL = false;
			jQuery.datepicker.regional[Options.Language].showMonthAfterYear = false;
			jQuery.datepicker.regional[Options.Language].yearSuffix = "";
			for (var i = 0; i < 12; i++) jQuery.datepicker.regional[Options.Language].monthNames.push(tx(uW.MONTH_NAMES[i]));
			for (var i = 12; i < 24; i++) jQuery.datepicker.regional[Options.Language].monthNamesShort.push(tx(uW.MONTH_NAMES[i]));
			for (var i = 0; i < 7; i++) jQuery.datepicker.regional[Options.Language].dayNames.push(tx(uW.DAY_NAMES[i]));
			for (var i = 7; i < 14; i++) jQuery.datepicker.regional[Options.Language].dayNamesShort.push(tx(uW.DAY_NAMES[i]));
			for (var i = 0; i < 7; i++) jQuery.datepicker.regional[Options.Language].dayNamesMin.push(tx(uW.DAY_NAMES[i])[0].toUpperCase() + tx(uW.DAY_NAMES[i])[1]);
		}

		if (!Options.MessagesOptions) {
			Options.MessagesOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.MessagesOptions.hasOwnProperty(y)) {
					Options.MessagesOptions[y] = t.Options[y];
				}
			}
		}

		t.minPages = Options.MessagesOptions.arPageFrom;
		t.maxPages = Options.MessagesOptions.arPageTo;
		t.totalPages = Options.MessagesOptions.arPageTo;

		uWExportFunction('getmsg', Tabs.Messages.getMailBody);
		uWExportFunction('ptMsgDelete', Tabs.Messages.DeleteMessage);
		uWExportFunction('ptMsgDeleteAll', Tabs.Messages.DeleteAllMessages);
		uWExportFunction('ptRptPVPSummary', Tabs.Messages.BuildPVPSummary);
		uWExportFunction('ptRptItemSummary', Tabs.Messages.BuildItemSummary);
		uWExportFunction('ptRptScoutSummary', Tabs.Messages.BuildScoutSummary);

		var tc = '<DIV class=divHeader align=center>' + tx('REPORT AND MESSAGE SEARCH') + '</DIV><DIV align=center><TABLE cellpadding=2 width=98%><TR align=center valign=center>';
		tc += '<TD class=xtab align=right>' + uW.g_js_strings.commonstr.type + ':&nbsp;<SELECT class="btInput" id="idRptType">';
		tc += '<OPTION value="alliance" ' + (Options.MessagesOptions.rptType == 'alliance' ? 'SELECTED' : '') + '>' + tx('Alliance Reports') + '</OPTION>';
		tc += '<OPTION value="player" ' + (Options.MessagesOptions.rptType == 'player' ? 'SELECTED' : '') + '>' + tx('Player Reports') + '</OPTION>';
		tc += '<OPTION value="inbox" ' + (Options.MessagesOptions.rptType == 'inbox' ? 'SELECTED' : '') + '>' + uW.g_js_strings.commonstr.inbox + '</OPTION>';
		tc += '<OPTION value="outbox" ' + (Options.MessagesOptions.rptType == 'outbox' ? 'SELECTED' : '') + '>' + uW.g_js_strings.commonstr.outbox + '</OPTION>';
		tc += '<OPTION value="hq_messages" ' + (Options.MessagesOptions.rptType == 'hq_messages' ? 'SELECTED' : '') + '>' + uW.g_js_strings.modal_messages.hqmessages + '</OPTION>';
		tc += '</SELECT>';
		tc += '<BR />' + tx('Page') + ':&nbsp;<INPUT class="btInput" id="idRptPageFrom" size=1 value="' + Options.MessagesOptions.arPageFrom + '">&nbsp;&#8211;&nbsp;<INPUT class="btInput" id="idRptPageTo" size=1 value="' + Options.MessagesOptions.arPageTo + '"></TD>';
		tc += '<TD class=xtab align=right>' + tx('Contains') + ':&nbsp;<INPUT class="btInput" id=idRptWhat type=text size=25 maxlength=50 value=""><BR />';
		tc += tx('But not') + ':&nbsp;<INPUT class="btInput" id=idRptWhatNot type=text size=25 maxlength=50 value=""></TD>';
		tc += '<TD class=xtab align=right>' + uW.g_js_strings.commonstr.attacker + ':&nbsp;<SELECT class="btInput" id="idRptAttacker">'; // Options.arPageFrom - Options.arPageTo
		tc += '<OPTION value="Them" ' + (Options.MessagesOptions.arAttacker == 'Them' ? 'SELECTED' : '') + '>' + tx('Them') + '</OPTION>';
		tc += '<OPTION value="Us" ' + (Options.MessagesOptions.arAttacker == 'Us' ? 'SELECTED' : '') + '>' + tx('Us') + '</OPTION>';
		tc += '<OPTION value="Both" ' + (Options.MessagesOptions.arAttacker == 'Both' ? 'SELECTED' : '') + '>' + tx('Both') + '</OPTION></SELECT>';
		tc += '<BR />' + uW.g_js_strings.commonstr.target + ':&nbsp;<SELECT class="btInput" id="idRptTarget">';
		tc += '<OPTION value="Them" ' + (Options.MessagesOptions.arTarget == 'Them' ? 'SELECTED' : '') + '>' + tx('Them') + '</OPTION>';
		tc += '<OPTION value="Us" ' + (Options.MessagesOptions.arTarget == 'Us' ? 'SELECTED' : '') + '>' + tx('Us') + '</OPTION>';
		tc += '<OPTION value="Both" ' + (Options.MessagesOptions.arTarget == 'Both' ? 'SELECTED' : '') + '>' + tx('Both') + '</OPTION></SELECT></TD>';
		tc += '<TD class=xtab align=left><INPUT id=idRptAttack type=checkbox ' + (Options.MessagesOptions.arAttack ? 'CHECKED' : '') + ' />&nbsp;' + uW.g_js_strings.commonstr.attack + '<BR />';
		tc += '<INPUT id=idRptScout type=checkbox ' + (Options.MessagesOptions.arScout ? 'CHECKED' : '') + ' />&nbsp;' + uW.g_js_strings.commonstr.scout + '</TD>';
		tc += '<TD class=xtab align=left><INPUT id=idRptReinforce type=checkbox ' + (Options.MessagesOptions.arReinforce ? 'CHECKED' : '') + ' />&nbsp;' + uW.g_js_strings.commonstr.reinforce + '<BR />';
		tc += '<INPUT id=idRptTransport type=checkbox ' + (Options.MessagesOptions.arTransport ? 'CHECKED' : '') + ' />&nbsp;' + uW.g_js_strings.commonstr.transport + '</TD>';
		tc += '<TD class=xtab align=left><INPUT id=idRptSearch type=submit value="' + tx('Start Search') + '" /></TD>';
		tc += '</TR></TABLE></DIV>';
		tc += '<div id=idRptDateFilter class=divHide align=center><hr><TABLE>';
		tc += '<TR align=center valign=center><TD class=xtab align=right>' + uW.g_js_strings.commonstr.from + ':&nbsp;<INPUT class="btInput" id=idRptFrom type=text size=25 value=""></TD><TD class=xtab align=left>' + uW.g_js_strings.commonstr.totx + ':&nbsp;<INPUT class="btInput" id=idRptTo type=text size=25 value="">&nbsp;' + strButton8(tx('Clear'), 'id=idRptClearDates') + '</TD></tr>';
		tc += '</TABLE></div></DIV>';
		tc += '<DIV class=divHeader><TABLE width=100% cellspacing=0><TR><TD class=xtab align=left width=125><DIV id=idRptSearched></DIV></TD>';
		tc += '<TD class=xtab align=center><SPAN style="white-space:normal" id=idRptStatus>&nbsp;</span></TD>';
		tc += '<TD class=xtab align=right width=125><DIV id=idRptFound></DIV></TD></TR></TABLE></DIV>';
		tc += '<DIV id="idRptResultsDiv" style="height:535px; max-height:535px; width:' + GlobalOptions.btWinSize.x + 'px; overflow-x:scroll; overflow-y:auto; white-space:nowrap;"></DIV><br>';
		t.myDiv.innerHTML = tc;

		jQuery(function () {
			jQuery.datepicker.setDefaults(jQuery.datepicker.regional[Options.Language]);
			jQuery("#idRptFrom").datepicker({ dateFormat: "yy-mm-dd 00:00:00", onSelect: t.handleRptFrom });
			jQuery("#idRptTo").datepicker({ dateFormat: "yy-mm-dd 23:59:59", onSelect: t.handleRptTo });
		});

		ById('idRptType').addEventListener('change', t.handleRptType, false);
		ById('idRptPageFrom').addEventListener('change', t.handleRptPages, false);
		ById('idRptPageTo').addEventListener('change', t.handleRptPages, false);
		ById('idRptAttacker').addEventListener('change', t.handleRptAttacker, false);
		ById('idRptTarget').addEventListener('change', t.handleRptTarget, false);
		ById('idRptWhat').addEventListener('keyup', t.handleRptWhat, false);
		ById('idRptWhatNot').addEventListener('keyup', t.handleRptWhatNot, false);
		ById('idRptSearch').addEventListener('click', t.handleRptSearch, false);
		ById('idRptFrom').addEventListener('change', t.handleRptFrom, false);
		ById('idRptTo').addEventListener('change', t.handleRptTo, false);
		ById('idRptClearDates').addEventListener('click', t.clearRptDates, false);

		ToggleOption('MessagesOptions', 'idRptAttack', 'arAttack', t.RefreshCurrentDisplay);
		ToggleOption('MessagesOptions', 'idRptScout', 'arScout', t.RefreshCurrentDisplay);
		ToggleOption('MessagesOptions', 'idRptReinforce', 'arReinforce', t.RefreshCurrentDisplay);
		ToggleOption('MessagesOptions', 'idRptTransport', 'arTransport', t.RefreshCurrentDisplay);

		t.enableFields();
	},

	handleRptType: function () {
		var t = Tabs.Messages;
		Options.MessagesOptions.rptType = ById("idRptType").value;
		saveOptions();
		// clear data
		t.data = [];
		t.report = {};
		ById("idRptSearched").innerHTML = '';
		ById("idRptStatus").innerHTML = '&nbsp;';
		ById("idRptFound").innerHTML = '';
		ById("idRptResultsDiv").innerHTML = '';
		t.enableFields();
	},

	enableFields: function () {
		var t = Tabs.Messages;
		var disable = (Options.MessagesOptions.rptType == 'inbox' || Options.MessagesOptions.rptType == 'outbox' || Options.MessagesOptions.rptType == 'hq_messages');
		ById('idRptAttacker').disabled = disable;
		ById('idRptTarget').disabled = disable;
		ById('idRptAttack').disabled = disable;
		ById('idRptScout').disabled = disable;
		ById('idRptReinforce').disabled = disable;
		ById('idRptTransport').disabled = disable;
		if (disable) {
			jQuery('#idRptDateFilter').addClass("divHide");
		}
		else {
			jQuery('#idRptDateFilter').removeClass("divHide");
		}
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	handleRptPages: function () {
		var t = Tabs.Messages;
		t.minPages = parseInt(ById("idRptPageFrom").value);
		t.maxPages = parseInt(ById("idRptPageTo").value);
		if (t.maxPages < t.minPages) {
			t.maxPages = t.minPages;
			ById("idRptPageTo").value = t.maxPages;
		}
		Options.MessagesOptions.arPageFrom = t.minPages;
		Options.MessagesOptions.arPageTo = t.maxPages;
		saveOptions();
		t.totalPages = t.maxPages;
	},

	handleRptAttacker: function () {
		var t = Tabs.Messages;
		Options.MessagesOptions.arAttacker = ById("idRptAttacker").value;
		saveOptions();
		if ((Options.MessagesOptions.rptType == 'alliance' || Options.MessagesOptions.rptType == 'player') && t.data.length > 0)
			t.DisplayRpt();
	},

	handleRptTarget: function () {
		var t = Tabs.Messages;
		Options.MessagesOptions.arTarget = ById("idRptTarget").value;
		saveOptions();
		if ((Options.MessagesOptions.rptType == 'alliance' || Options.MessagesOptions.rptType == 'player') && t.data.length > 0)
			t.DisplayRpt();
	},

	handleRptWhat: function () {
		var t = Tabs.Messages;
		t.what = ById("idRptWhat").value.trim();
		ById("idRptWhat").value = t.what;
		t.RefreshCurrentDisplay();
	},

	handleRptWhatNot: function () {
		var t = Tabs.Messages;
		t.whatNot = ById("idRptWhatNot").value.trim();
		ById("idRptWhatNot").value = t.whatNot;
		t.RefreshCurrentDisplay();
	},

	handleRptFrom: function () {
		var t = Tabs.Messages;
		try {
			var datestr = new Date(ById("idRptFrom").value.replace(" ", "T") + "Z");
			t.FromUnixTime = parseIntNan(datestr.getTime() / 1000) + (datestr.getTimezoneOffset() * 60);
			ById("idRptFrom").style.color = 'black';
			if (t.FromUnixTime == 0 && ById("idRptFrom").value != "") { ById("idRptFrom").style.color = 'red'; }
		}
		catch (err) {
			t.FromUnixTime = 0;
			ById("idRptFrom").style.color = 'red';
		}
		t.RefreshCurrentDisplay();
	},

	handleRptTo: function () {
		var t = Tabs.Messages;
		try {
			var datestr = new Date(ById("idRptTo").value.replace(" ", "T") + "Z");
			t.ToUnixTime = parseIntNan(datestr.getTime() / 1000) + (datestr.getTimezoneOffset() * 60);
			ById("idRptTo").style.color = 'black';
			if (t.ToUnixTime == 0 && ById("idRptTo").value != "") { ById("idRptTo").style.color = 'red'; }
		}
		catch (err) {
			t.ToUnixTime = 0;
			ById("idRptTo").style.color = 'red';
		}
		t.RefreshCurrentDisplay();
	},

	clearRptDates: function () {
		var t = Tabs.Messages;
		ById("idRptFrom").value = '';
		ById("idRptTo").value = '';
		t.FromUnixTime = 0;
		t.ToUnixTime = 0;
		t.RefreshCurrentDisplay();
	},

	RefreshCurrentDisplay: function () {
		var t = Tabs.Messages;
		if (t.data.length > 0)
			if (Options.MessagesOptions.rptType == 'alliance' || Options.MessagesOptions.rptType == 'player')
				t.DisplayRpt();
			else
				t.DisplayMail();
	},

	handleRptSearch: function () {
		var t = Tabs.Messages;
		if (t.searchRunning) {
			t.searchRunning = false;
			t.stopSearch('SEARCH CANCELLED!');
			return;
		}
		t.handleRptPages();
		ById('idRptSearch').value = tx('Stop Search');
		ById('idRptStatus').innerHTML = tx('Searching page') + ' ' + t.minPages + ' ' + uW.g_js_strings.commonstr.of + ' ' + t.maxPages;
		t.searchRunning = true;
		t.data = [];
		t.report = {};
		if (Options.MessagesOptions.rptType == 'alliance' || Options.MessagesOptions.rptType == 'player')
			t.getRpt(t.minPages);
		else
			t.getMail(t.minPages);
	},

	stopSearch: function (msg) {
		var t = Tabs.Messages;
		if (t.searchRunning || msg == 'SEARCH CANCELLED!')
			ById('idRptStatus').innerHTML = msg;
		ById('idRptSearch').value = tx('Start Search');
		t.searchRunning = false;
		t.RefreshCurrentDisplay();
	},

	getMail: function (pageNum) {
		var t = Tabs.Messages;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.requestType = "GET_MESSAGE_HEADERS_FOR_USER_INBOX";
		params.boxType = ById('idRptType').value;
		params.pageNo = pageNum;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { t.getMailCallback(rslt, pageNum); },
			onFailure: function () { t.getMailCallback({ errorMsg: tx('AJAX error') }); },
		}, false);
	},

	getMailCallback: function (rslt, page) {
		var t = Tabs.Messages;
		if (rslt) {
			if (!rslt.ok) {
				ById("idRptStatus").innerHTML = rslt.errorMsg;
				return;
			}
			t.totalPages = parseInt(rslt.noOfPages);
			if (t.totalPages < t.maxPages)
				t.maxPages = t.totalPages;
			if (rslt.message && page) {
				var ml = rslt.message;
				if (rslt.messageCount > 0) {
					var rptkeys = uW.Object.keys(uWCloneInto(ml));
					for (var i = 0; i < rptkeys.length; i++) {
						var rpt = ml[rptkeys[i]];
						rpt.page = page;
						t.data.push(rpt);
					}
				}
			}
			if (parseInt(page) + 1 <= t.maxPages && t.searchRunning) {
				ById("idRptStatus").innerHTML = tx('Searching page') + ' ' + (parseInt(page) + 1) + ' ' + uW.g_js_strings.commonstr.of + ' ' + t.maxPages;
				t.getMail(parseInt(page) + 1);
				if (t.data.length > 0)
					t.DisplayMail();
			} else if (page)
				t.stopSearch('Done!');
		}
	},

	getRpt: function (pageNum) {
		var t = Tabs.Messages;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pageNo = pageNum;
		if (Options.MessagesOptions.rptType == 'alliance')
			params.group = "a";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { t.getRptCallback(rslt, pageNum); },
			onFailure: function () { t.getRptCallback({ errorMsg: tx('AJAX error') }); },
		}, false);
	},

	getRptCallback: function (rslt, page) {
		var t = Tabs.Messages;
		if (rslt) {
			if (!rslt.ok) {
				ById("idRptStatus").innerHTML = rslt.errorMsg;
				return;
			}
			t.totalPages = parseInt(rslt.totalPages);
			if (t.totalPages < t.maxPages)
				t.maxPages = t.totalPages;
			if (rslt.arReports && page) {
				var ar = rslt.arReports;
				if (ar.length == 0)
					t.stopSearch(tx('Empty pages found from page') + ' ' + page + ' ' + tx('onwards'));
				var rptkeys = uW.Object.keys(uWCloneInto(ar));
				for (var i = 0; i < rptkeys.length; i++) {
					var rpt = ar[rptkeys[i]];
					var reportId = parseInt(rpt.reportId);
					if (rpt.marchType == 3 && (rpt.side1AllianceId == parseInt(getMyAlliance()[0]) || rpt.side1PlayerId == uW.tvuid)) {
						setTimeout(FetchReportDetail, (250 * i), rpt.reportId, 1); // load scout report into detail cache for speed
					}
					else {
						setTimeout(FetchReport, (250 * i), rpt.reportId); // load report into cache for speed
					}
					t.report[reportId] = {};
					// Attacker
					t.report[reportId].side1Name = rslt.arPlayerNames['p' + rpt.side1PlayerId];
					t.report[reportId].side1PlayerId = parseInt(rpt.side1PlayerId);
					t.report[reportId].side1AllianceId = parseInt(rpt.side1AllianceId);
					if (rpt.side1AllianceId > 0)
						t.report[reportId].side1AllianceName = rslt.arAllianceNames['a' + rpt.side1AllianceId];
					else
						t.report[reportId].side1AllianceName = tx('unallied');
					if (rpt.side1CityId > 0)
						t.report[reportId].side1CityName = rslt.arCityNames['c' + rpt.side1CityId];
					else
						t.report[reportId].side1CityName = uW.g_js_strings.commonstr.none;
					t.report[reportId].side1XCoord = rpt.side1XCoord;
					t.report[reportId].side1YCoord = rpt.side1YCoord;
					// Target
					t.report[reportId].side0PlayerId = parseInt(rpt.side0PlayerId);
					if (parseInt(rpt.side0PlayerId) == 0) { // Game
						t.report[reportId].side0Name = uW.g_js_strings.commonstr.enemy;
						t.report[reportId].side0AllianceName = '';
						t.report[reportId].side0CityName = '';
					} else { // Player
						t.report[reportId].side0Name = rslt.arPlayerNames['p' + rpt.side0PlayerId];
						if (rpt.side0AllianceId > 0)
							t.report[reportId].side0AllianceName = rslt.arAllianceNames['a' + rpt.side0AllianceId];
						else
							t.report[reportId].side0AllianceName = tx('unallied');
						if (rpt.side0CityId > 0)
							t.report[reportId].side0CityName = rslt.arCityNames['c' + rpt.side0CityId];
						else
							t.report[reportId].side0CityName = uW.g_js_strings.commonstr.none;
					}
					t.report[reportId].side0AllianceId = parseInt(rpt.side0AllianceId);
					t.report[reportId].side0XCoord = rpt.side0XCoord;
					t.report[reportId].side0YCoord = rpt.side0YCoord;

					totile = tileTypes[parseInt(rpt.side0TileType)];
					if (rpt.side0TileType == 51) {
						if (parseInt(rpt.side0CityId) == 0) { totile = tx('Barb Camp'); }
					}
					t.report[reportId].side0TileTypeText = totile;

					totile = 'Lvl ' + rpt.side0TileLevel + ' ' + totile;
					t.report[reportId].side0TileTypeLevel = totile;

					t.report[reportId].side0TileType = rpt.side0TileType;
					t.report[reportId].side0TileLevel = rpt.side0TileLevel;
					// Miscellaneous
					t.report[reportId].page = page;
					t.report[reportId].reportUnixTime = rpt.reportUnixTime;
					if (rpt.side0AllianceId == parseInt(getMyAlliance()[0]))
						t.report[reportId].sideId = 0;
					else if (rpt.side1AllianceId == parseInt(getMyAlliance()[0])) {
						t.report[reportId].sideId = 1;
					} else { // if we're here then this is a player report from when they were in another alliance
						if (rpt.side0PlayerId == uW.tvuid)
							t.report[reportId].sideId = 0;
						else if (rpt.side1PlayerId == uW.tvuid)
							t.report[reportId].sideId = 1;
						else // shouldn't get here but we'll catch it if the report body is requested
							t.report[reportId].sideId = -1;
					}
					if (rpt.marchType == 0)
						t.report[reportId].marchName = tx('Desertion');
					else if (rpt.marchType == 1)
						t.report[reportId].marchName = uW.g_js_strings.commonstr.transport;
					else if (rpt.marchType == 2)
						t.report[reportId].marchName = uW.g_js_strings.commonstr.reinforce;
					else if (rpt.marchType == 3) {
						if (t.report[reportId].sideId == 0)
							t.report[reportId].marchName = tx('Anti-Scout');
						else
							t.report[reportId].marchName = uW.g_js_strings.commonstr.scout;
					} else if (rpt.marchType == 4 || rpt.marchType == 10) {
						if (t.report[reportId].sideId == 0)
							t.report[reportId].marchName = uW.g_js_strings.commonstr.defend;
						else
							t.report[reportId].marchName = uW.g_js_strings.commonstr.attack;
					} else
						t.report[reportId].marchName = '?';

					t.data.push({ reportId: reportId });
				}
			}
			if (parseInt(page) + 1 <= t.maxPages && t.searchRunning) {
				ById("idRptStatus").innerHTML = tx('Searching page') + ' ' + (parseInt(page) + 1) + ' ' + uW.g_js_strings.commonstr.of + ' ' + t.maxPages;
				t.getRpt(parseInt(page) + 1);
				if (t.data.length > 0)
					t.DisplayRpt();
			} else if (page)
				t.stopSearch(uW.g_js_strings.commonstr.completedexc);
		}
	},

	DisplayMail: function () {
		var t = Tabs.Messages;
		var results = ById("idRptResultsDiv");
		if (!t.data.length) {
			results.innerHTML = '<br><center>' + tx('None found') + '</center>';
			return;
		}
		reportsSearched = t.data.length;
		reportsFound = 0;
		t.DisplayIdArray = [];
		t.DisplayArray = [];
		t.content = '<BR>';
		var NameType = uW.g_js_strings.commonstr.from;
		if (Options.MessagesOptions.rptType == 'outbox') {
			NameType = uW.g_js_strings.commonstr.totx;
		}
		for (var i = 0; i < reportsSearched; i++) {
			var rpt = t.data[i];
			if (Options.MessagesOptions.rptType == 'outbox') {
				var rptuserid = rpt.toUserId;
			}
			else {
				var rptuserid = rpt.fromUserId;
			}
			var subject = uW.g_js_strings.modal_messages_listshow.nosubject;
			if (rpt.subject && rpt.subject.length > 0) { subject = rpt.subject; }
			var datesok = true; // future development - date filter on messages
			if (datesok && ((t.what == '' || (rpt.subject.search(t.what, "i") != -1) || (rpt.displayName.search(t.what, "i") != -1)) && (t.whatNot == '' || ((rpt.subject.search(t.whatNot, "i") == -1) && (rpt.displayName.search(t.whatNot, "i") == -1))))) {
				reportsFound++;
				if (reportsFound == 1)
					t.content += '<center><table width=98% cellpadding=0 cellspacing=0><tr><td class=xtabHD width=200>' + uW.g_js_strings.commonstr.date + '</td><td class=xtabHD width=200>' + NameType + '</td><td class=xtabHD>' + uW.g_js_strings.commonstr.subject + '</td><td class=xtabHD align=right><a class="inlineButton btButton red14" onclick="ptMsgDeleteAll()"><span>' + tx('Delete All') + '</span></a></td></tr>';

				rowClass = 'evenRow';
				if (reportsFound % 2 == 1) rowClass = 'oddRow';

				t.content += '<tr class=' + rowClass + '><td class=xtab>' + rpt.dateSent + '</td>';
				if (rptuserid == 0) { t.content += '<td class=xtab>' + rpt.displayName + '</td>'; }
				else { t.content += '<td class=xtab>' + PlayerLink(rptuserid, rpt.displayName) + '</td>'; }
				t.content += '<td class=xtab><A class=xlink><SPAN onclick="getmsg(' + rpt.messageId + ')">' + subject + '</SPAN></a></td>';
				t.content += '<td class=xtab align=right>' + strButton8(uW.g_js_strings.commonstr.deletetx, 'onclick="ptMsgDelete(' + i + ')"') + '</td></tr>';

				t.DisplayIdArray.push(rpt.messageId);
				t.DisplayArray.push(i);
			}
		}
		if (reportsFound > 1)
			t.content += '</table></center>';
		if (reportsFound == 0 && reportsSearched > 0)
			t.content = '<br><center>' + tx('No messages found matching search criteria') + '</center>';
		results.innerHTML = t.content;
		ById("idRptSearched").innerHTML = '&nbsp;' + tx('Searched') + ': ' + reportsSearched;
		ById("idRptFound").innerHTML = tx('Matched') + ': ' + reportsFound;
	},

	getMailBody: function (ID, dataI) {
		var t = Tabs.Messages;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.messageId = ID;
		params.requestType = "GET_MESSAGE_FOR_ID";
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok)
					t.displayMailBody(rslt.messageBody, tx('Message Text'));
			},
		}, false);
	},

	displayMailBody: function (messageBody, messageHeader) {
		var t = Tabs.Messages;
		t.popMsg = new CPopup('pbMailBody', 0, 0, 670, 600, true, function () {
			clearTimeout(1000);
		});
		t.popMsg.centerMe(mainPop.getMainDiv());
		var m = '<DIV ondblclick="btSelectText(this);" style="padding-left:6px;padding-top:6px;max-height:550px; height:550px; overflow-y:scroll">';
		messageBody = messageBody.replace(/custom-line-break/g, "<BR>");
		m += messageBody + '</div>';
		t.popMsg.getMainDiv().innerHTML = m;
		t.popMsg.getTopDiv().innerHTML = '<DIV align=center><B>' + messageHeader + '</B></DIV>';
		t.popMsg.show(true);
	},

	DeleteMessage: function (i) {
		var t = Tabs.Messages;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.requestType = 'ACTION_ON_MESSAGES';
		params.boxType = Options.MessagesOptions.rptType;
		params.selectedAction = 'delete';
		params.selectedMessageIds = t.data[i].messageId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				t.data.splice(i, 1);
				t.DisplayMail();
			},
		}, true);
	},

	DeleteAllMessages: function () {
		var t = Tabs.Messages;
		if (t.DisplayArray.length == 0) return;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.requestType = 'ACTION_ON_MESSAGES';
		params.boxType = Options.MessagesOptions.rptType;
		params.selectedAction = 'delete';
		params.selectedMessageIds = t.DisplayIdArray.toString();
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				for (var j = t.DisplayArray.length - 1; j >= 0; j--) {
					t.data.splice(t.DisplayArray[j], 1);
				}
				t.DisplayMail();
			},
		}, true);
	},

	DisplayRpt: function () {
		var t = Tabs.Messages;
		var results = ById("idRptResultsDiv");
		if (!t.data.length) {
			results.innerHTML = '<br><center>' + tx('None found') + '</center>';
			return;
		}
		var myAllianceId = parseInt(getMyAlliance()[0]);
		reportsSearched = t.data.length;
		reportsFound = 0;
		t.DisplayIdArray = [];
		t.DisplayArray = [];
		t.ScoutIdArray = [];
		t.ScoutArray = [];
		t.content = '';
		for (var i = 0; i < reportsSearched; i++) {
			var reportId = t.data[i].reportId;
			var rpt = t.report[reportId];
			if ((rpt.side0Name == 'undefined') || (rpt.marchName == tx('Desertion')))
				continue;
			if ((((myAllianceId == parseInt(rpt.side1AllianceId) && Options.MessagesOptions.arAttacker != 'Them') || (myAllianceId != parseInt(rpt.side1AllianceId) && Options.MessagesOptions.arAttacker != 'Us') || Options.MessagesOptions.arAttacker == 'Both') && ((myAllianceId == parseInt(rpt.side0AllianceId) && Options.MessagesOptions.arTarget != 'Them') || (myAllianceId != parseInt(rpt.side0AllianceId) && Options.MessagesOptions.arTarget != 'Us') || Options.MessagesOptions.arTarget == 'Both') && ((Options.MessagesOptions.arAttack && (rpt.marchName == uW.g_js_strings.commonstr.attack || rpt.marchName == uW.g_js_strings.commonstr.defend)) || (Options.MessagesOptions.arScout && (rpt.marchName == uW.g_js_strings.commonstr.scout || rpt.marchName == tx('Anti-Scout'))) || (Options.MessagesOptions.arReinforce && rpt.marchName == uW.g_js_strings.commonstr.reinforce) || (Options.MessagesOptions.arTransport && rpt.marchName == uW.g_js_strings.commonstr.transport))) || (rpt.marchName == tx('Desertion'))) {
				var datesok = false;
				var unixtime = rpt.reportUnixTime;
				if ((unixtime >= t.FromUnixTime || t.FromUnixTime == 0) && (unixtime <= t.ToUnixTime || t.ToUnixTime == 0)) { datesok = true; }
				if (datesok && (((t.what == '' || (rpt.side1Name.search(t.what, "i") != -1) || (rpt.side1AllianceName.search(t.what, "i") != -1) || (rpt.side0Name.search(t.what, "i") != -1) || (rpt.side0AllianceName.search(t.what, "i") != -1) || (rpt.side0TileTypeText.search(t.what, "i") != -1)) && (t.whatNot == '' || ((rpt.side1Name.search(t.whatNot, "i") == -1) && (rpt.side1AllianceName.search(t.whatNot, "i") == -1) && (rpt.side0Name.search(t.whatNot, "i") == -1) && (rpt.side0AllianceName.search(t.whatNot, "i") == -1) && (rpt.side0TileTypeText.search(t.whatNot, "i") == -1)))) || (rpt.marchName == tx('Desertion')))) {
					reportsFound++;
					if (reportsFound == 1) {
						t.content += '<div id=ptRptSummaryDiv class=divHide><br><center>';
						t.content += strButton20(tx('PVP Summary'), 'onclick="ptRptPVPSummary()"');
						if (Options.MessagesOptions.rptType == 'player') { t.content += '&nbsp;' + strButton20(tx('Item Summary'), 'onclick="ptRptItemSummary()"'); }
						if (Options.MessagesOptions.arScout) { t.content += '&nbsp;' + strButton20(tx('Scouting Summary'), 'onclick="ptRptScoutSummary()"'); }
						t.content += '</center></div>';
						t.content += '<center><table width=98% cellpadding=0 cellspacing=0><tr><td class=xtabHD width=160>' + uW.g_js_strings.commonstr.date + '</td><td class=xtabHD width=120>' + tx('Report Id') + '</td><td class=xtabHD width=120>' + uW.g_js_strings.commonstr.type + '</td><td class=xtabHD align=center width=80>' + uW.g_js_strings.commonstr.from + '</td><td class=xtabHD>' + uW.g_js_strings.commonstr.attacker + '</td>';
						if (Options.MessagesOptions.arAttacker != 'Us')
							t.content += '<td class=xtabHD>' + uW.g_js_strings.commonstr.alliance + '</td>';
						t.content += '<td class=xtabHD>' + uW.g_js_strings.commonstr.target + '</td>';
						if (Options.MessagesOptions.arTarget != 'Us')
							t.content += '<td class=xtabHD>' + uW.g_js_strings.commonstr.alliance + '</td>';
						t.content += '<td class=xtabHD align=center>' + tx('View') + '</td><td class=xtabHD>' + uW.g_js_strings.commonstr.type + '</td><td class=xtabHD align=center width=80>' + tx('At') + '</td><td class=xtabHD align=center width=80>' + tx('Nearest') + '</td><td class=xtabHD align=right width=80>' + tx('Dist') + '</td></tr>';
					}

					rowClass = 'evenRow';
					if (reportsFound % 2 == 1) rowClass = 'oddRow';

					var closestDist = 999999;
					var closestLoc = null;
					var closestNum = 1;
					for (var c = 0; c < Cities.numCities; c++) {
						var city = Cities.cities[c];
						city.x + ',' + city.y
						var dist = distance(city.x, city.y, rpt.side0XCoord, rpt.side0YCoord);
						if (dist < closestDist) {
							closestDist = dist;
							closestLoc = city.x + ',' + city.y;
							closestNum = c + 1;
						}
					}
					if (rpt.marchName == tx('Anti-Scout') || rpt.marchName == uW.g_js_strings.commonstr.defend)
						style = ' style="color:#800;"';
					else if (rpt.marchName == uW.g_js_strings.commonstr.reinforce)
						style = ' style="color:#080;"';
					else
						style = "";
					t.content += '<tr class=' + rowClass + '><td class=xtab>' + formatUnixTime(rpt.reportUnixTime, '24hour') + '</td>';
					t.content += '<td class=xtab><A class=xlink><SPAN onclick="ptChatReportClicked(' + reportId + ',0)">' + reportId + '</span></a></td>';
					if (rpt.marchName == tx('Desertion')) {
						t.content += '<td class=xtab>&nbsp;</td><td class=xtab>&nbsp;</td>';
						if (Options.MessagesOptions.arAttacker != 'Us')
							t.content += '<td class=xtab>&nbsp;</td>';
						t.content += '<td class=xtab>&nbsp;</td>';
						if (Options.MessagesOptions.arAttacker != 'Us')
							t.content += '<td class=xtab>&nbsp;</td>';
						t.content += '<td class=xtab align=center>' + strButton8(uW.g_js_strings.commonstr.view, 'onclick="ptChatReportClicked(' + reportId + ',0)"') + '</td>';
						t.content += '<td class=xtab>&nbsp;</td><td class=xtab>&nbsp;</td>';
						t.content += '<td class=xtab>&nbsp;</td><td class=xtab>&nbsp;</td>';
					} else {
						t.content += '<td class=xtab ' + style + '>' + rpt.marchName + '</td>';
						t.content += '<td align=center class=xtab><A class=xlink onclick="btGotoMap(' + rpt.side1XCoord + ',' + rpt.side1YCoord + ')">' + rpt.side1XCoord + ',' + rpt.side1YCoord + '</a></td><td class=xtab>' + PlayerLink(rpt.side1PlayerId, rpt.side1Name) + '</td>';
						if (Options.MessagesOptions.arAttacker != 'Us')
							t.content += '<td class=xtab><span style=' + DiplomacyColours(rpt.side1AllianceId) + '>' + rpt.side1AllianceName + '</span></td>';
						if (rpt.side0PlayerId && (rpt.side0PlayerId != 0)) { t.content += '<td class=xtab>' + PlayerLink(rpt.side0PlayerId, rpt.side0Name) + '</td>'; }
						else { t.content += '<td class=xtab>' + rpt.side0Name + '</td>'; }
						if (Options.MessagesOptions.arTarget != 'Us')
							t.content += '<td class=xtab><span style=' + DiplomacyColours(rpt.side0AllianceId) + '>' + rpt.side0AllianceName + '</span></td>';
						t.content += '<td class=xtab align=center>' + strButton8(uW.g_js_strings.commonstr.view, 'onclick="ptChatReportClicked(' + reportId + ',0)"') + '</td>';
						t.content += '<td class=xtab>' + rpt.side0TileTypeLevel + '</td>';
						t.content += '<td align=center class=xtab><A class=xlink onclick="btGotoMap(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a></td>';
						t.content += '<td align=center class=xtab><A class=xlink onclick="btGotoMap(' + Cities.cities[closestNum - 1].x + ',' + Cities.cities[closestNum - 1].y + ')\">' + closestLoc + '</a></td><td align=right class=xtab>' + Math.floor(closestDist) + '</td></tr>';
					}

					t.DisplayIdArray.push(reportId);
					t.DisplayArray.push(i);

					if (rpt.marchName == uW.g_js_strings.commonstr.scout) {
						t.ScoutIdArray.push(reportId);
						t.ScoutArray.push(i);
					}
				}
			}
		}
		if (reportsFound >= 1)
			t.content += '</tbody></table></center>';
		if (reportsFound == 0 && reportsSearched > 0)
			t.content = '<br><center>' + tx('No reports found matching search criteria') + '</center>';
		results.innerHTML = t.content;
		ById("idRptSearched").innerHTML = '&nbsp;' + tx('Searched') + ': ' + reportsSearched;
		ById("idRptFound").innerHTML = tx('Matched') + ': ' + reportsFound;

		if (!t.searchRunning) { jQuery('#ptRptSummaryDiv').removeClass('divHide'); }
	},

	BuildPVPSummary: function () {
		var t = Tabs.Messages;
		t.FetchReportArray = [];
		for (var j = 0; j < t.DisplayIdArray.length; j++) {
			t.FetchReportArray.push(t.DisplayIdArray[j]);
		}
		t.displayMailBody("", tx('PVP Summary'));
		ResetFrameSize('pbMailBody', 600, GlobalOptions.btWinSize.x);
		t.popMsg.centerMe(mainPop.getMainDiv());
		t.FetchReports(t.PVPSummary);
	},

	PVPSummary: function () {
		var t = Tabs.Messages;
		t.PlayerData = {};

		var RepCount = 0;
		t.initPlayerInfo('us');
		t.initPlayerInfo('them');

		for (var j = 0; j < t.DisplayArray.length; j++) {
			var reportId = t.data[t.DisplayArray[j]].reportId;
			var rpt = t.report[reportId];
			if (rpt.side0PlayerId && rpt.side0PlayerId != 0) { // PVP
				if (ReportCache[reportId]) {
					RepCount++;
					var rslt = JSON2.parse(JSON2.stringify(ReportCache[reportId]));
					// attacker stats
					var uid = rpt.side1PlayerId;
					t.initPlayerInfo(uid, rpt.side1Name, rpt.side1AllianceId, rpt.side1AllianceName);
					var tid = t.PlayerData[uid].side;
					if (rslt.detail.loot) {
						if (rslt.detail['loot'][0] !== undefined) {
							t.PlayerData[uid].loot.gold += parseIntNan(rslt.detail['loot'][0]);
							t.PlayerData[tid].loot.gold += parseIntNan(rslt.detail['loot'][0]);
						}
						if (rslt.detail['loot'][1] !== undefined) {
							t.PlayerData[uid].loot.food += parseIntNan(rslt.detail['loot'][1]);
							t.PlayerData[tid].loot.food += parseIntNan(rslt.detail['loot'][1]);
						}
						if (rslt.detail['loot'][2] !== undefined) {
							t.PlayerData[uid].loot.wood += parseIntNan(rslt.detail['loot'][2]);
							t.PlayerData[tid].loot.wood += parseIntNan(rslt.detail['loot'][2]);
						}
						if (rslt.detail['loot'][3] !== undefined) {
							t.PlayerData[uid].loot.stone += parseIntNan(rslt.detail['loot'][3]);
							t.PlayerData[tid].loot.stone += parseIntNan(rslt.detail['loot'][3]);
						}
						if (rslt.detail['loot'][4] !== undefined) {
							t.PlayerData[uid].loot.ore += parseIntNan(rslt.detail['loot'][4]);
							t.PlayerData[tid].loot.ore += parseIntNan(rslt.detail['loot'][4]);
						}
						if (rslt.detail['loot'][6] !== undefined) {
							t.PlayerData[uid].loot.aether += parseIntNan(rslt.detail['loot'][6]);
							t.PlayerData[tid].loot.aether += parseIntNan(rslt.detail['loot'][6]);
						}
					}
					if (rslt.detail.fght && rslt.detail.fght.s1) {
						var might = 0;
						for (var ui in CM.UNIT_TYPES) {
							i = CM.UNIT_TYPES[ui];
							if (rslt.detail.fght.s1['u' + i]) {
								if (rslt.detail.fght.s1['u' + i][0] > rslt.detail.fght.s1['u' + i][1]) {
									var losses = parseInt(rslt.detail.fght.s1['u' + i][0]) - parseInt(rslt.detail.fght.s1['u' + i][1]);
									t.PlayerData[uid].losses['u' + i] -= losses;
									t.PlayerData[tid].losses['u' + i] -= losses;
									might -= parseInt(uW.unitmight['unt' + i] * losses);
								}
							}
						}
						t.PlayerData[uid].might += might;
						t.PlayerData[tid].might += might;
					}

					// glory for our side only
					if (rslt.detail['glory'] && t.PlayerData[uid].side == 'us') {
						t.PlayerData[uid].glory += parseInt(rslt.detail['glory']);
						t.PlayerData[tid].glory += parseInt(rslt.detail['glory']);
					}

					// defender stats
					var uid = rpt.side0PlayerId;
					t.initPlayerInfo(uid, rpt.side0Name, rpt.side0AllianceId, rpt.side0AllianceName);
					var tid = t.PlayerData[uid].side;
					if (rslt.detail.loot) {
						if (rslt.detail['loot'][0] !== undefined) {
							t.PlayerData[uid].lost.gold += parseIntNan(rslt.detail['loot'][0]);
							t.PlayerData[tid].lost.gold += parseIntNan(rslt.detail['loot'][0]);
						}
						if (rslt.detail['loot'][1] !== undefined) {
							t.PlayerData[uid].lost.food += parseIntNan(rslt.detail['loot'][1]);
							t.PlayerData[tid].lost.food += parseIntNan(rslt.detail['loot'][1]);
						}
						if (rslt.detail['loot'][2] !== undefined) {
							t.PlayerData[uid].lost.wood += parseIntNan(rslt.detail['loot'][2]);
							t.PlayerData[tid].lost.wood += parseIntNan(rslt.detail['loot'][2]);
						}
						if (rslt.detail['loot'][3] !== undefined) {
							t.PlayerData[uid].lost.stone += parseIntNan(rslt.detail['loot'][3]);
							t.PlayerData[tid].lost.stone += parseIntNan(rslt.detail['loot'][3]);
						}
						if (rslt.detail['loot'][4] !== undefined) {
							t.PlayerData[uid].lost.ore += parseIntNan(rslt.detail['loot'][4]);
							t.PlayerData[tid].lost.ore += parseIntNan(rslt.detail['loot'][4]);
						}
						if (rslt.detail['loot'][6] !== undefined) {
							t.PlayerData[uid].lost.aether += parseIntNan(rslt.detail['loot'][6]);
							t.PlayerData[tid].lost.aether += parseIntNan(rslt.detail['loot'][6]);
						}
					}

					if (rslt.detail.fght && rslt.detail.fght.s0) {
						var might = 0;
						if (rslt.detail.overwhelmed) {
							for (var ui in CM.UNIT_TYPES) {
								i = CM.UNIT_TYPES[ui];
								if (rslt.detail.fght.s0['u' + i]) {
									if (rslt.detail.fght.s0['u' + i][0] > rslt.detail.fght.s0['u' + i][1]) {
										var losses = parseInt(rslt.detail.fght.s0['u' + i][0]);
										t.PlayerData[uid].losses['u' + i] -= losses;
										t.PlayerData[tid].losses['u' + i] -= losses;
										might -= parseInt(uW.unitmight['unt' + i] * losses);
									}
								}
							}
							for (var i = 53; i <= 55; i++) {
								if (rslt.detail.fght.s0['f' + i]) {
									if (rslt.detail.fght.s0['f' + i][0] > rslt.detail.fght.s0['f' + i][1]) {
										var losses = parseInt(rslt.detail.fght.s0['f' + i][0]);
										t.PlayerData[uid].losses['f' + i] -= losses;
										t.PlayerData[tid].losses['f' + i] -= losses;
										var fm = parseIntNan(fortmight['f' + i]);
										might -= fm * losses;
									}
								}
							}
							for (var i = 60; i < 64; i++) {
								if (rslt.detail.fght.s0['f' + i]) {
									if (rslt.detail.fght.s0['f' + i][0] > rslt.detail.fght.s0['f' + i][1]) {
										var losses = parseInt(rslt.detail.fght.s0['f' + i][0]);
										t.PlayerData[uid].losses['f' + i] -= losses;
										t.PlayerData[tid].losses['f' + i] -= losses;
										var fm = parseIntNan(fortmight['f' + i]);
										might -= fm * losses;
									}
								}
							}
						}
						else {
							for (var ui in CM.UNIT_TYPES) {
								i = CM.UNIT_TYPES[ui];
								if (rslt.detail.fght.s0['u' + i]) {
									if (rslt.detail.fght.s0['u' + i][0] > rslt.detail.fght.s0['u' + i][1]) {
										var losses = parseInt(rslt.detail.fght.s0['u' + i][0]) - parseInt(rslt.detail.fght.s0['u' + i][1]);
										t.PlayerData[uid].losses['u' + i] -= losses;
										t.PlayerData[tid].losses['u' + i] -= losses;
										might -= parseInt(uW.unitmight['unt' + i] * losses);
									}
								}
							}
							for (var i = 53; i <= 55; i++) {
								if (rslt.detail.fght.s0['f' + i]) {
									if (rslt.detail.fght.s0['f' + i][0] > rslt.detail.fght.s0['f' + i][1]) {
										var losses = parseInt(rslt.detail.fght.s0['f' + i][0]) - parseInt(rslt.detail.fght.s0['f' + i][1]);
										t.PlayerData[uid].losses['f' + i] -= losses;
										t.PlayerData[tid].losses['f' + i] -= losses;
										var fm = parseIntNan(fortmight['f' + i]);
										might -= fm * losses;
									}
								}
							}
							for (var i = 60; i < 64; i++) {
								if (rslt.detail.fght.s0['f' + i]) {
									if (rslt.detail.fght.s0['f' + i][0] > rslt.detail.fght.s0['f' + i][1]) {
										var losses = parseInt(rslt.detail.fght.s0['f' + i][0]) - parseInt(rslt.detail.fght.s0['f' + i][1]);
										t.PlayerData[uid].losses['f' + i] -= losses;
										t.PlayerData[tid].losses['f' + i] -= losses;
										var fm = parseIntNan(fortmight['f' + i]);
										might -= fm * losses;
									}
								}
							}
						}
						t.PlayerData[uid].might += might;
						t.PlayerData[tid].might += might;
					}

					// glory for our side only
					if (rslt.detail['glory'] && t.PlayerData[uid].side == 'us') {
						t.PlayerData[uid].glory += parseInt(rslt.detail['glory']);
						t.PlayerData[tid].glory += parseInt(rslt.detail['glory']);
					}
				}
			}
		}

		var message = '<DIV style="max-width:' + GlobalOptions.btWinSize.x + 'px;"><b>' + tx('Number of Reports Searched') + ': ' + RepCount + '</b><br><br>';
		message += '<div class=divHeader align=center>' + tx('Resources Taken') + '</div>';

		var r = 0;
		message += '<table width=100% class=xtab cellspacing=0 cellpadding=4><tr><TH class=xtabHD align=left>' + tx('Player') + '</th><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.alliance + '</th><TH class=xtabHD align=right>&nbsp;</th><TH class=xtabHD align=right><img src="' + GoldImage + '"></th><TH class=xtabHD align=right><img src="' + FoodImage + '"></th><TH class=xtabHD align=right><img src="' + WoodImage + '"></th><TH class=xtabHD align=right><img src="' + StoneImage + '"></th><TH class=xtabHD align=right><img src="' + OreImage + '"></th><TH class=xtabHD align=right><img src="' + AetherImage + '"></th></tr>';
		for (var uid in t.PlayerData) {
			var rslt = t.PlayerData[uid];
			if (rslt.side == "us" && uid != "us") {
				if (rslt.loot.gold || rslt.lost.gold || rslt.loot.food || rslt.lost.food || rslt.loot.wood || rslt.lost.wood || rslt.loot.stone || rslt.lost.stone || rslt.loot.ore || rslt.lost.ore || rslt.loot.aether || rslt.lost.aether) {
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
					message += '<tr class="' + rowClass + '"><TD rowspan=3>' + MonitorLink(rslt.uid, rslt.name) + '</td><td rowspan=3><span style=' + DiplomacyColours(rslt.aid) + '>' + rslt.aname + '</span></td>';
					message += '<td align=right>' + tx('Lost') + '</td><td align=right>' + addCommas(0 - rslt.lost.gold) + '</td><td align=right>' + addCommas(0 - rslt.lost.food) + '</td><td align=right>' + addCommas(0 - rslt.lost.wood) + '</td><td align=right>' + addCommas(0 - rslt.lost.stone) + '</td><td align=right>' + addCommas(0 - rslt.lost.ore) + '</td><td align=right>' + addCommas(0 - rslt.lost.aether) + '</td></tr>';
					message += '<tr class="' + rowClass + '"><td align=right>' + tx('Gained') + '</td><td align=right>' + addCommas(rslt.loot.gold) + '</td><td align=right>' + addCommas(rslt.loot.food) + '</td><td align=right>' + addCommas(rslt.loot.wood) + '</td><td align=right>' + addCommas(rslt.loot.stone) + '</td><td align=right>' + addCommas(rslt.loot.ore) + '</td><td align=right>' + addCommas(rslt.loot.aether) + '</td></tr>';
					message += '<tr class="' + rowClass + '"><td align=right class=xtabTotal><b>' + tx('Total') + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.gold - rslt.lost.gold) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.food - rslt.lost.food) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.wood - rslt.lost.wood) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.stone - rslt.lost.stone) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.ore - rslt.lost.ore) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.aether - rslt.lost.aether) + '</b></td></tr>';
				}
			}
		}
		var rslt = t.PlayerData["us"];
		if (++r % 2) { rowClass = 'evenRow'; }
		else { rowClass = 'oddRow'; }
		message += '<tr class="' + rowClass + '"><TD rowspan=3 colspan=2><b>' + tx('Total Gained') + ' (' + tx('Us') + ')</b></td>';
		message += '<td align=right>' + tx('Lost') + '</td><td align=right>' + addCommas(0 - rslt.lost.gold) + '</td><td align=right>' + addCommas(0 - rslt.lost.food) + '</td><td align=right>' + addCommas(0 - rslt.lost.wood) + '</td><td align=right>' + addCommas(0 - rslt.lost.stone) + '</td><td align=right>' + addCommas(0 - rslt.lost.ore) + '</td><td align=right>' + addCommas(0 - rslt.lost.aether) + '</td></tr>';
		message += '<tr class="' + rowClass + '"><td align=right>' + tx('Gained') + '</td><td align=right>' + addCommas(rslt.loot.gold) + '</td><td align=right>' + addCommas(rslt.loot.food) + '</td><td align=right>' + addCommas(rslt.loot.wood) + '</td><td align=right>' + addCommas(rslt.loot.stone) + '</td><td align=right>' + addCommas(rslt.loot.ore) + '</td><td align=right>' + addCommas(rslt.loot.aether) + '</td></tr>';
		message += '<tr class="' + rowClass + '"><td align=right class=xtabTotal><b>' + tx('Total') + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.gold - rslt.lost.gold) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.food - rslt.lost.food) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.wood - rslt.lost.wood) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.stone - rslt.lost.stone) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.ore - rslt.lost.ore) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.aether - rslt.lost.aether) + '</b></td></tr>';

		var r = 0;
		message += '<tr><TH class=xtabHD align=left>' + tx('Player') + '</th><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.alliance + '</th><TH class=xtabHD align=right>&nbsp;</th><TH class=xtabHD align=right><img src="' + GoldImage + '"></th><TH class=xtabHD align=right><img src="' + FoodImage + '"></th><TH class=xtabHD align=right><img src="' + WoodImage + '"></th><TH class=xtabHD align=right><img src="' + StoneImage + '"></th><TH class=xtabHD align=right><img src="' + OreImage + '"></th><TH class=xtabHD align=right><img src="' + AetherImage + '"></th></tr>';
		for (var uid in t.PlayerData) {
			var rslt = t.PlayerData[uid];
			if (rslt.side == "them" && uid != "them") {
				if (rslt.loot.gold || rslt.lost.gold || rslt.loot.food || rslt.lost.food || rslt.loot.wood || rslt.lost.wood || rslt.loot.stone || rslt.lost.stone || rslt.loot.ore || rslt.lost.ore || rslt.loot.aether || rslt.lost.aether) {
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
					message += '<tr class="' + rowClass + '"><TD rowspan=3>' + MonitorLink(rslt.uid, rslt.name) + '</td><td rowspan=3><span style=' + DiplomacyColours(rslt.aid) + '>' + rslt.aname + '</span></td>';
					message += '<td align=right>' + tx('Lost') + '</td><td align=right>' + addCommas(0 - rslt.lost.gold) + '</td><td align=right>' + addCommas(0 - rslt.lost.food) + '</td><td align=right>' + addCommas(0 - rslt.lost.wood) + '</td><td align=right>' + addCommas(0 - rslt.lost.stone) + '</td><td align=right>' + addCommas(0 - rslt.lost.ore) + '</td><td align=right>' + addCommas(0 - rslt.lost.aether) + '</td></tr>';
					message += '<tr class="' + rowClass + '"><td align=right>' + tx('Gained') + '</td><td align=right>' + addCommas(rslt.loot.gold) + '</td><td align=right>' + addCommas(rslt.loot.food) + '</td><td align=right>' + addCommas(rslt.loot.wood) + '</td><td align=right>' + addCommas(rslt.loot.stone) + '</td><td align=right>' + addCommas(rslt.loot.ore) + '</td><td align=right>' + addCommas(rslt.loot.aether) + '</td></tr>';
					message += '<tr class="' + rowClass + '"><td align=right class=xtabTotal><b>' + tx('Total') + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.gold - rslt.lost.gold) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.food - rslt.lost.food) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.wood - rslt.lost.wood) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.stone - rslt.lost.stone) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.ore - rslt.lost.ore) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.aether - rslt.lost.aether) + '</b></td></tr>';
				}
			}
		}
		var rslt = t.PlayerData["them"];
		if (++r % 2) { rowClass = 'evenRow'; }
		else { rowClass = 'oddRow'; }
		message += '<tr class="' + rowClass + '"><TD rowspan=3 colspan=2><b>' + tx('Total Gained') + ' (' + tx('Them') + ')</b></td>';
		message += '<td align=right>' + tx('Lost') + '</td><td align=right>' + addCommas(0 - rslt.lost.gold) + '</td><td align=right>' + addCommas(0 - rslt.lost.food) + '</td><td align=right>' + addCommas(0 - rslt.lost.wood) + '</td><td align=right>' + addCommas(0 - rslt.lost.stone) + '</td><td align=right>' + addCommas(0 - rslt.lost.ore) + '</td><td align=right>' + addCommas(0 - rslt.lost.aether) + '</td></tr>';
		message += '<tr class="' + rowClass + '"><td align=right>' + tx('Gained') + '</td><td align=right>' + addCommas(rslt.loot.gold) + '</td><td align=right>' + addCommas(rslt.loot.food) + '</td><td align=right>' + addCommas(rslt.loot.wood) + '</td><td align=right>' + addCommas(rslt.loot.stone) + '</td><td align=right>' + addCommas(rslt.loot.ore) + '</td><td align=right>' + addCommas(rslt.loot.aether) + '</td></tr>';
		message += '<tr class="' + rowClass + '"><td align=right class=xtabTotal><b>' + tx('Total') + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.gold - rslt.lost.gold) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.food - rslt.lost.food) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.wood - rslt.lost.wood) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.stone - rslt.lost.stone) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.ore - rslt.lost.ore) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.loot.aether - rslt.lost.aether) + '</b></td></tr>';

		message += '</table><br>';
		message += '<div class=divHeader align=center>' + tx('Troop Losses') + '</div>';
		message += '<DIV style="max-width:' + GlobalOptions.btWinSize.x + 'px;">';

		var r = 0;
		message += '<table class=xtab cellspacing=0 cellpadding=4><tr><TH class=xtabHD align=left>' + tx('Player') + '</th><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.alliance + '</th><TH class=xtabHD align=right>' + uW.g_js_strings.commonstr.glory + '</th><TH class=xtabHD align=right>' + tx('Might Loss') + '</th>';
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (t.PlayerData["us"].losses['u' + i] || t.PlayerData["them"].losses['u' + i]) { message += '<TH class=xtabHD align=right>' + TroopImageBigHeader(i) + '</th>'; }
		}
		for (var fi in fortmight) {
			if (t.PlayerData["us"].losses[fi] || t.PlayerData["them"].losses[fi]) { message += '<TH class=xtabHD align=right>' + TroopImageBigHeader(fi.split("f")[1]) + '</th>'; }
		}
		message += '</tr>';
		for (var uid in t.PlayerData) {
			var rslt = t.PlayerData[uid];
			if (rslt.side == "us" && uid != "us") {
				gotdata = false;
				for (var i in rslt.losses) {
					if (rslt.losses[i]) { gotdata = true; break; }
				}
				if (gotdata) {
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
					message += '<tr class="' + rowClass + '"><TD>' + MonitorLink(rslt.uid, rslt.name) + '</td><td><span style=' + DiplomacyColours(rslt.aid) + '>' + rslt.aname + '</span></td><td align=right>' + addCommas(rslt.glory) + '</td><td align=right>' + addCommas(rslt.might) + '</td>';
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (t.PlayerData["us"].losses['u' + i] || t.PlayerData["them"].losses['u' + i]) { message += '<td align=right>' + addCommas(rslt.losses['u' + i]) + '</td>'; }
					}
					for (var fi in fortmight) {
						if (t.PlayerData["us"].losses[fi] || t.PlayerData["them"].losses[fi]) { message += '<td align=right>' + addCommas(rslt.losses[fi]) + '</td>'; }
					}
					message += '</tr>';
				}
			}
		}
		var rslt = t.PlayerData["us"];
		if (++r % 2) { rowClass = 'evenRow'; }
		else { rowClass = 'oddRow'; }
		message += '<tr class="' + rowClass + '"><TD colspan=2><b>' + tx('Total Losses') + ' (' + tx('Us') + ')</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.glory) + '</b></td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.might) + '</b></td>';
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (t.PlayerData["us"].losses['u' + i] || t.PlayerData["them"].losses['u' + i]) { message += '<td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.losses['u' + i]) + '</b></td>'; }
		}
		for (var fi in fortmight) {
			if (t.PlayerData["us"].losses[fi] || t.PlayerData["them"].losses[fi]) { message += '<td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.losses[fi]) + '</b></td>'; }
		}
		message += '</tr>';

		var r = 0;
		message += '<tr><TH class=xtabHD align=left>' + tx('Player') + '</th><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.alliance + '</th><TH class=xtabHD align=right>&nbsp;</th><TH class=xtabHD align=right>' + tx('Might Loss') + '</th>';
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (t.PlayerData["us"].losses['u' + i] || t.PlayerData["them"].losses['u' + i]) { message += '<TH class=xtabHD align=right>' + TroopImageBigHeader(i) + '</th>'; }
		}
		for (var fi in fortmight) {
			if (t.PlayerData["us"].losses[fi] || t.PlayerData["them"].losses[fi]) { message += '<TH class=xtabHD align=right>' + TroopImageBigHeader(fi.split("f")[1]) + '</th>'; }
		}
		message += '</tr>';
		for (var uid in t.PlayerData) {
			var rslt = t.PlayerData[uid];
			if (rslt.side == "them" && uid != "them") {
				gotdata = false;
				for (var i in rslt.losses) {
					if (rslt.losses[i]) { gotdata = true; break; }
				}
				if (gotdata) {
					if (++r % 2) { rowClass = 'evenRow'; }
					else { rowClass = 'oddRow'; }
					message += '<tr class="' + rowClass + '"><TD>' + MonitorLink(rslt.uid, rslt.name) + '</td><td><span style=' + DiplomacyColours(rslt.aid) + '>' + rslt.aname + '</span></td><td align=right>&nbsp;</td><td align=right>' + addCommas(rslt.might) + '</td>';
					for (var ui in CM.UNIT_TYPES) {
						i = CM.UNIT_TYPES[ui];
						if (t.PlayerData["us"].losses['u' + i] || t.PlayerData["them"].losses['u' + i]) { message += '<td align=right>' + addCommas(rslt.losses['u' + i]) + '</td>'; }
					}
					for (var fi in fortmight) {
						if (t.PlayerData["us"].losses[fi] || t.PlayerData["them"].losses[fi]) { message += '<td align=right>' + addCommas(rslt.losses[fi]) + '</td>'; }
					}
					message += '</tr>';
				}
			}
		}
		var rslt = t.PlayerData["them"];
		if (++r % 2) { rowClass = 'evenRow'; }
		else { rowClass = 'oddRow'; }
		message += '<tr class="' + rowClass + '"><TD colspan=2><b>' + tx('Total Losses') + ' (' + tx('Them') + ')</b></td><td align=right>&nbsp;</td><td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.might) + '</b></td>';
		for (var ui in CM.UNIT_TYPES) {
			i = CM.UNIT_TYPES[ui];
			if (t.PlayerData["us"].losses['u' + i] || t.PlayerData["them"].losses['u' + i]) { message += '<td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.losses['u' + i]) + '</b></td>'; }
		}
		for (var fi in fortmight) {
			if (t.PlayerData["us"].losses[fi] || t.PlayerData["them"].losses[fi]) { message += '<td align=right class=xtabTotal><b>' + t.FormatTotal(rslt.losses[fi]) + '</b></td>'; }
		}
		message += '</tr>';
		message += '<tr><TD>&nbsp;</td></tr>';
		message += '<tr><TD colspan=2><b>' + tx('Total Might Loss Difference') + '</b></td><td align=right>&nbsp;</td><td align=right class=xtabTotal><b>' + t.FormatTotal(t.PlayerData["us"].might - t.PlayerData["them"].might) + '</b></td></tr>';
		message += '</table><br><br></div></div>';

		t.displayMailBody(message, tx('PVP Summary'));
		ResetFrameSize('pbMailBody', 600, GlobalOptions.btWinSize.x);
		t.popMsg.centerMe(mainPop.getMainDiv());
	},

	FormatTotal: function (amt) {
		var t = Tabs.Messages;
		if (amt < 0) {
			return '<span class=boldRed>' + addCommas(amt) + '</span>'
		}
		else {
			return addCommas(amt);
		}
	},

	initPlayerInfo: function (uid, name, aid, aname) {
		var t = Tabs.Messages;
		var myAllianceId = parseInt(getMyAlliance()[0]);
		var side = 'them';
		if (uid == "us" || uid == "them") { side = uid; }
		else {
			if ((myAllianceId == 0 && uid == uW.tvuid) || (myAllianceId != 0 && myAllianceId == parseInt(aid))) { side = 'us'; }
		}
		if (!t.PlayerData[uid]) {
			t.PlayerData[uid] = {};
			t.PlayerData[uid].uid = uid;
			t.PlayerData[uid].name = name;
			t.PlayerData[uid].aid = aid;
			t.PlayerData[uid].aname = aname;
			t.PlayerData[uid].side = side;
			t.PlayerData[uid].glory = 0;
			t.PlayerData[uid].might = 0;
			t.PlayerData[uid].loot = {};
			t.PlayerData[uid].loot.gold = 0;
			t.PlayerData[uid].loot.food = 0;
			t.PlayerData[uid].loot.wood = 0;
			t.PlayerData[uid].loot.stone = 0;
			t.PlayerData[uid].loot.ore = 0;
			t.PlayerData[uid].loot.aether = 0;
			t.PlayerData[uid].lost = {};
			t.PlayerData[uid].lost.gold = 0;
			t.PlayerData[uid].lost.food = 0;
			t.PlayerData[uid].lost.wood = 0;
			t.PlayerData[uid].lost.stone = 0;
			t.PlayerData[uid].lost.ore = 0;
			t.PlayerData[uid].lost.aether = 0;
			t.PlayerData[uid].losses = {};
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				t.PlayerData[uid].losses['u' + i] = 0;
			}
			for (var fi in fortmight) {
				t.PlayerData[uid].losses[fi] = 0;
			}
		}
	},

	FetchReports: function (notify) {
		var t = Tabs.Messages;
		if (t.FetchReportArray.length == 0) {
			if (notify) { notify(); }
			return;
		}
		else {
			var rpId = t.FetchReportArray.splice(0, 1);
			t.popMsg.getMainDiv().innerHTML = '<br><br><br><center>' + tx('Reading in report details') + ':&nbsp;' + rpId + '</center>';
			FetchReport(rpId, function () { t.FetchReports(notify); });
		}
	},

	BuildItemSummary: function () {
		var t = Tabs.Messages;
		t.FetchReportArray = [];
		for (var j = 0; j < t.DisplayIdArray.length; j++) {
			t.FetchReportArray.push(t.DisplayIdArray[j]);
		}
		t.displayMailBody("", tx('Items Found Summary'));
		t.FetchReports(t.ItemSummary);
	},

	ItemSummary: function () {
		var t = Tabs.Messages;
		t.ItemsFound = {};
		t.ThroneItemsFound = {};
		t.ChampItemsFound = {};
		t.JewelItemsFound = {};
		var RepCount = 0;

		for (var j = 0; j < t.DisplayArray.length; j++) {
			var reportId = t.data[t.DisplayArray[j]].reportId;
			var rpt = t.report[reportId];
			if (rpt.side1PlayerId == uW.tvuid && rpt.marchName == uW.g_js_strings.commonstr.attack && (!rpt.side0PlayerId || rpt.side0PlayerId == 0)) {
				if (ReportCache[reportId]) {
					RepCount++;
					var rslt = JSON2.parse(JSON2.stringify(ReportCache[reportId]));
					if (rslt.detail.loot[5]) {
						var loot = rslt.detail.loot[5];
						if (matTypeof(loot) == 'object') {
							for (var z in loot) {
								if (t.ItemsFound[z]) { t.ItemsFound[z] += parseInt(loot[z]); }
								else { t.ItemsFound[z] = parseInt(loot[z]); }
							}
						}
					}
					if (rslt.detail.throneRoomDrop) {
						var TR = rslt.detail.throneRoomDrop;
						var z = "" + TR.type + TR.quality;
						if (t.ThroneItemsFound[z]) { t.ThroneItemsFound[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = TR.type;
							NewObj.quality = TR.quality;
							NewObj.amount = 1;
							t.ThroneItemsFound[z] = NewObj;
						}
					}
					if (rslt.detail.equipmentDrop) {
						var EQ = rslt.detail.equipmentDrop;
						var z = "" + EQ.subtype + EQ.rarity;
						if (t.ChampItemsFound[z]) { t.ChampItemsFound[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = EQ.subtype;
							NewObj.quality = EQ.rarity;
							NewObj.amount = 1;
							t.ChampItemsFound[z] = NewObj;
						}
					}
					if (rslt.detail.lootJewel) {
						var item = rslt.detail.lootJewel;
						if (matTypeof(item) == 'object') {
							var z = item.quality;
							if (t.JewelItemsFound[z]) { t.JewelItemsFound[z] += parseInt(item.quantity); }
							else { t.JewelItemsFound[z] = parseInt(item.quantity); }
						}
					}
				}
			}
		}

		var message = '<b>' + tx('Number of Reports Searched') + ': ' + RepCount + '</b> %0A%0A';
		message += '<b>' + tx('Miscellaneous items') + ':</b> %0A';

		var Crests = {};
		var total = 0;
		for (var z in Tabs.Attack.CrestList) { Crests[Tabs.Attack.CrestList[z]] = 0; }

		for (var z in t.ItemsFound) {
			if (!isNaN(Crests[z])) // if item is a crest or seal...
				Crests[z] = t.ItemsFound[z];
			else {
				message += "<img width='20px' height='20px' src='" + getItemImageURL(z) + "' />&nbsp;" + uW.ksoItems[z].name + ' x ' + t.ItemsFound[z] + '%0A';
			}
		}
		message += '%0A';
		message += '<b>' + tx('Crest Stats') + ':</b> %0A';
		for (crest in Crests) {
			if (Crests[crest] > 0) {
				message += "<img width='20px' height='20px' src='" + getItemImageURL(crest) + "' />&nbsp;" + uW.itemlist['i' + crest]['name'] + ' x ' + Crests[crest] + '%0A';
				total += (Crests[crest]);
			}
		}
		message += '<b>' + tx('Total Crests Found') + ': ' + total + '</b> %0A';

		message += '%0A';
		message += '<b>' + tx('Jewel Stats') + ':</b> %0A';
		var itemcount = 0;
		for (z in t.JewelItemsFound) {
			itemcount += t.JewelItemsFound[z];
			message += uW.g_js_strings.jewel['quality_' + Number(z - 1)] + ' Jewel x ' + t.JewelItemsFound[z] + '%0A';
		}
		message += '<b>' + tx('Total Jewels Found') + ': ' + itemcount + '</b> %0A';

		message += '%0A';
		message += '<b>' + tx('Throne Stats') + ':</b> %0A';
		var itemcount = 0;
		for (z in t.ThroneItemsFound) {
			itemcount += t.ThroneItemsFound[z].amount;
			message += strQuality(t.ThroneItemsFound[z].quality) + ' ' + t.ThroneItemsFound[z].type + ' x ' + t.ThroneItemsFound[z].amount + '%0A';
		}
		message += '<b>' + tx('Total Throne Room Items Found') + ': ' + itemcount + '</b> %0A';

		message += '%0A';
		message += '<b>' + uW.g_js_strings.report_view.champion_stats + ':</b> %0A';
		var itemcount = 0;
		for (z in t.ChampItemsFound) {
			itemcount += t.ChampItemsFound[z].amount;
			message += strQuality(t.ChampItemsFound[z].quality) + ' ' + t.ChampItemsFound[z].type + ' x ' + t.ChampItemsFound[z].amount + '%0A';
		}
		message += '<b>' + tx('Total Champion Equipment Found') + ': ' + itemcount + '</b> %0A';

		t.displayMailBody(message.replace(/%0A/g, "<BR>"), tx('Items Found Summary'));
	},

	FetchReportDetails: function (notify) {
		var t = Tabs.Messages;
		if (t.FetchReportArray.length == 0) {
			if (notify) { notify(); }
			return;
		}
		else {
			var rpId = t.FetchReportArray.splice(0, 1);
			t.popMsg.getMainDiv().innerHTML = '<br><br><br><center>' + tx('Reading in scout report details') + ':&nbsp;' + rpId + '</center>';
			FetchReportDetail(rpId, 1, function () { t.FetchReportDetails(notify); });
		}
	},

	BuildScoutSummary: function () {
		var t = Tabs.Messages;
		t.FetchReportArray = [];
		for (var j = 0; j < t.ScoutIdArray.length; j++) {
			t.FetchReportArray.push(t.ScoutIdArray[j]);
		}
		t.displayMailBody("", tx('Scouting Summary'));
		t.FetchReportDetails(t.ScoutSummary);
	},

	ScoutSummary: function () {
		var t = Tabs.Messages;
		var WinCount = 0;
		var FilterCount = 0;
		t.ScoutResults = [];

		for (var j = 0; j < t.ScoutArray.length; j++) {
			var reportId = t.data[t.ScoutArray[j]].reportId;
			var rpt = t.report[reportId];
			if (ReportDetailCache[reportId]) {
				var rslt = JSON2.parse(JSON2.stringify(ReportDetailCache[reportId]));
				if (rslt.winner == 1 && rslt.rsc) {
					WinCount++;
					if (parseIntNan(rslt.gld) >= t.gold && parseIntNan(rslt.rsc.r1) >= t.food && parseIntNan(rslt.rsc.r2) >= t.wood && parseIntNan(rslt.rsc.r3) >= t.stone && parseIntNan(rslt.rsc.r4) >= t.ore) {
						FilterCount++;
						var newobj = {};
						newobj.reportId = reportId;
						newobj.gold = parseIntNan(rslt.gld);
						newobj.food = parseIntNan(rslt.rsc.r1);
						newobj.wood = parseIntNan(rslt.rsc.r2);
						newobj.stone = parseIntNan(rslt.rsc.r3);
						newobj.ore = parseIntNan(rslt.rsc.r4);
						t.ScoutResults.push(newobj);
					}
				}
			}
		}

		var message = '<b>' + tx('Number of Successful Scout Reports') + ': ' + WinCount + '</b><br><br>';
		message += '<table cellpadding=0 cellspacing=0 class=xtab><tr><td><b>' + tx('Minimum Resources') + ':&nbsp;</b></td><td>' + GameIcons.goldImgTiny + '&nbsp;' + '<input id=btRptGold class=btInput value="' + t.gold + '"> ' + GameIcons.foodImgTiny + '&nbsp;' + '<input id=btRptFood class=btInput value="' + t.food + '"> ' + GameIcons.woodImgTiny + '&nbsp;' + '<input id=btRptWood class=btInput value="' + t.wood + '"> ' + GameIcons.stoneImgTiny + '&nbsp;' + '<input id=btRptStone class=btInput value="' + t.stone + '"> ' + GameIcons.oreImgTiny + '&nbsp;' + '<input id=btRptOre class=btInput value="' + t.ore + '"></td></tr></table><br>';

		message += '<table width=100% class=xtab cellspacing=0 cellpadding=4><tr><TH width=50 class=xtabHD align=center><input id=ToggleRptScoutCheckbox type=checkbox></th><TH class=xtabHD align=left>' + tx('Report Id') + '</th><TH class=xtabHD align=left>' + tx('Player') + '</th><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.alliance + '</th><TH class=xtabHD align=left>' + uW.g_js_strings.commonstr.city + '</th><TH class=xtabHD align=center>' + tx('Co-ords') + '</th><TH class=xtabHD align=right><img src="' + GoldImage + '"></th><TH class=xtabHD align=right><img src="' + FoodImage + '"></th><TH class=xtabHD align=right><img src="' + WoodImage + '"></th><TH class=xtabHD align=right><img src="' + StoneImage + '"></th><TH class=xtabHD align=right><img src="' + OreImage + '"></th></tr>';
		var r = 0;
		for (var i = 0; i < t.ScoutResults.length; i++) {
			var reportId = t.ScoutResults[i].reportId;
			var rpt = t.report[reportId];
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			message += '<tr class="' + rowClass + '"><td align=center><input id="btRptScout_' + reportId + '" type=checkbox></td><TD><A class=xlink><SPAN onclick="ptChatReportClicked(' + reportId + ',0)">' + reportId + '</span></a></td><TD>' + MonitorLink(rpt.side0PlayerId, rpt.side0Name) + '</td><td><span style=' + DiplomacyColours(rpt.side0AllianceId) + '>' + rpt.side0AllianceName + '</span></td>';
			message += '<td>' + rpt.side0CityName + '</td><td align=center><A class=xlink onclick="btGotoMap(' + rpt.side0XCoord + ',' + rpt.side0YCoord + ')">' + rpt.side0XCoord + ',' + rpt.side0YCoord + '</a></td><td align=right>' + addCommas(t.ScoutResults[i].gold) + '</td><td align=right>' + addCommas(t.ScoutResults[i].food) + '</td><td align=right>' + addCommas(t.ScoutResults[i].wood) + '</td><td align=right>' + addCommas(t.ScoutResults[i].stone) + '</td><td align=right>' + addCommas(t.ScoutResults[i].ore) + '</td></tr>';
		}
		message += '</table><br>';

		if (FilterCount > 0) {
			if (Tabs.BulkScout) message += strButton20(tx('Add to Scout List'), 'id=btRptScoutExport') + '&nbsp;';
			if (Tabs.BulkAttack) message += strButton20(tx('Add to Attack List'), 'id=btRptBulkAttackExport') + '&nbsp;';
		}
		else {
			message += '<center>' + tx('No scout reports found matching search criteria') + '</center>';
		}

		t.displayMailBody(message, tx('Scouting Summary'));
		ResetFrameSize('pbMailBody', 600, GlobalOptions.btWinSize.x);
		t.popMsg.centerMe(mainPop.getMainDiv());

		ById('ToggleRptScoutCheckbox').addEventListener('change', t.doSelectall, false);
		if (ById('btRptScoutExport')) ById('btRptScoutExport').addEventListener('click', t.ExportScoutList, false);
		if (ById('btRptBulkAttackExport')) ById('btRptBulkAttackExport').addEventListener('click', t.ExportAttackList, false);
		ById('btRptGold').addEventListener('change', t.changeResources, false);
		ById('btRptFood').addEventListener('change', t.changeResources, false);
		ById('btRptWood').addEventListener('change', t.changeResources, false);
		ById('btRptStone').addEventListener('change', t.changeResources, false);
		ById('btRptOre').addEventListener('change', t.changeResources, false);
	},

	changeResources: function () {
		var t = Tabs.Messages;
		t.gold = parseIntNan(ById('btRptGold').value);
		t.food = parseIntNan(ById('btRptFood').value);
		t.wood = parseIntNan(ById('btRptWood').value);
		t.stone = parseIntNan(ById('btRptStone').value);
		t.ore = parseIntNan(ById('btRptOre').value);
		t.ScoutSummary();
	},

	doSelectall: function () {
		var t = Tabs.Messages;
		var coords = "";
		for (var k = 0; k < t.ScoutResults.length; k++) {
			RptId = t.ScoutResults[k].reportId;
			if (ById('ToggleRptScoutCheckbox').checked) ById('btRptScout_' + RptId).checked = true;
			else ById('btRptScout_' + RptId).checked = false;
		}
	},

	ExportScoutList: function () {
		var t = Tabs.Messages;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkScout.ImportCoords(coordlist.split(" "));
			mainPop.focusMe();
		}
	},

	ExportAttackList: function () {
		var t = Tabs.Messages;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkAttack.ImportCoords(coordlist.split(" "));
			mainPop.focusMe();
		}
	},

	getSelected: function () {
		var t = Tabs.Messages;
		var coordlist = '';
		for (var k = 0; k < t.ScoutResults.length; k++) {
			RptId = t.ScoutResults[k].reportId;
			var rpt = t.report[RptId];
			if (ById('btRptScout_' + RptId).checked) {
				coordlist += rpt.side0XCoord.toString() + ',' + rpt.side0YCoord.toString() + ' ';
				ById('btRptScout_' + RptId).checked = false;
			}
		}
		return coordlist;
	},
};
