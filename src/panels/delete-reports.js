var DeleteReports = {
	deleting: false,
	pageNo: 1,
	maxpages: 10,
	scandelay: 30, // 30 secs between scans
	UIDArray: [],
	ReportLog: {
		ItemsFound: {},
		ThroneItemsFound: {},
		ChampItemsFound: {},
		JewelItemsFound: {},
		ItemsFoundDF: {},
		ThroneItemsFoundDF: {},
		ChampItemsFoundDF: {},
		JewelItemsFoundDF: {},
		DFCount: 0,
	},

	init: function () {
		var t = DeleteReports;
		t.loadLog();
		setTimeout(t.startdeletereports, 20 * 1000); // start in 20 seconds
	},

	loadLog: function () {
		var t = DeleteReports;
		var serverID = getServerId();
		s = GM_getValue('ReportLog_' + serverID + '_' + uW.tvuid);
		if (s != null) {
			opts = JSON2.parse(s);
			for (var k in opts)
				t.ReportLog[k] = opts[k];
		}
	},

	saveLog: function () {
		var t = DeleteReports;
		setTimeout(function () { GM_setValue('ReportLog_' + getServerId() + '_' + uW.tvuid, JSON2.stringify(t.ReportLog)); }, 0); // get around GM_SetValue uW error
	},

	startdeletereports: function () {
		var t = DeleteReports;
		if (!t.deleting) {
			if (Options.ReportOptions.DeleteRptbc || Options.ReportOptions.DeleteRpttr || Options.ReportOptions.DeleteRptwl || Options.ReportOptions.DeleteRptaa || Options.ReportOptions.DeleteRptfr || Options.ReportOptions.DeleteRptid || Options.ReportOptions.DeleteRptdf || Options.ReportOptions.DeleteRptsc) {
				t.deleting = true;
				t.listreports(t.pageNo, t.checkreports);
			}
			else {
				t.deleting = false;
				t.pageNo = 1;
				setTimeout(t.startdeletereports, t.scandelay * 1000);
			}
		};
	},

	listreports: function (pageNo, callback) {
		var t = DeleteReports;
		t.pageNo = pageNo;

		if (!Options.ReportOptions.DeleteRptbc && !Options.ReportOptions.DeleteRpttr && !Options.ReportOptions.DeleteRptwl && !Options.ReportOptions.DeleteRptaa && !Options.ReportOptions.DeleteRptfr && !Options.ReportOptions.DeleteRptid && !Options.ReportOptions.DeleteRptdf && !Options.ReportOptions.DeleteRptsc) {
			t.deleting = false;
			t.pageNo = 1;
			setTimeout(t.startdeletereports, t.scandelay * 1000);
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		if (t.pageNo >= 1) params.pageNo = t.pageNo;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/listReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { callback(rslt); },
			onFailure: function () { callback({ ok: false }); },
		});
	},
	checkreports: function (rslt) {
		var t = DeleteReports;
		if (!rslt.ok || (rslt.arReports.length < 1)) { // no results or no reports
			t.deleting = false;
			t.pageNo = 1;
			setTimeout(t.startdeletereports, t.scandelay * 1000);
			return;
		}
		var reports = rslt.arReports;
		var players = rslt.arPlayerNames;
		var totalPages = rslt.totalPages;
		if (rslt.totalPages > t.maxpages) var totalPages = t.maxpages;
		var deletes1 = new Array();
		var deletes0 = new Array();
		for (k in reports) {
			if (reports[k].reportType == 0) {
				var reportUnixTime = Number(reports[k].reportUnixTime);
				if (Options.ReportOptions.DeleteRptbc) {
					if ((reports[k].marchType == 4 || reports[k].marchType == 9) && reports[k].side0PlayerId == 0 && reports[k].side0TileType == 51) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
					else if (reports[k].marchType == 1 && isMyself(reports[k].side1PlayerId)) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRpttr) {
					if (reports[k].marchType == 1 && isMyself(reports[k].side0PlayerId)) {
						if (deletes0.indexOf(k.substr(2)) == -1) deletes0.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRptwl) {
					if (reports[k].side0TileType <= 50 && reports[k].side0PlayerId == 0) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRptdf) {
					if (reports[k].side0TileType == 54 && reports[k].side0PlayerId == 0) {
						t.checkreportforitems(k.substr(2), false);
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
				if (Options.ReportOptions.DeleteRptaa && Options.AttackOptions && Options.AttackOptions.Routes) {
					for (var i in Options.AttackOptions.Routes) {
						var a = Options.AttackOptions.Routes[i];
						if (reports[k].side0XCoord == a.target_x && reports[k].side0YCoord == a.target_y && reports[k].marchType == 4 && isMyself(reports[k].side1PlayerId)) {
							if (reports[k].side0PlayerId != 0) { // don't delete deleted crests on other players
								t.checkreportforitems(k.substr(2), true);
							}
							else {
								t.checkreportforitems(k.substr(2), false);
								if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
							}
							break;
						}
					}
				}
				if (Options.ReportOptions.DeleteRptfr) {
					for (var l in uW.seed.allianceDiplomacies.friendlyToThem) {
						if (reports[k].side1AllianceId == uW.seed.allianceDiplomacies.friendlyToThem[l].allianceId) {
							if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
						}
					}
					for (var l in uW.seed.allianceDiplomacies.friendly) {
						if (reports[k].side1AllianceId == uW.seed.allianceDiplomacies.friendly[l].allianceId) {
							if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
						}
					}
				}
				if (Options.ReportOptions.DeleteRptid) {
					if (Options.ReportOptions.DeleteRptUID != "") {
						// split string by commas
						t.UIDArray = Options.ReportOptions.DeleteRptUID.split(",");
						if (t.UIDArray.indexOf(reports[k].side1PlayerId) != -1) {
							if (deletes1.indexOf(k.substr(2)) == -1) {
								if (Options.ReportOptions.DeleteRptidType == 0 || Options.ReportOptions.DeleteRptidType == reports[k].marchType) {
									deletes1.push(k.substr(2));
								}
							}
						}
					}
				}
				if (Options.ReportOptions.DeleteRptsc) {
					if (reports[k].marchType == 3 && isMyself(reports[k].side0PlayerId)) {
						if (deletes1.indexOf(k.substr(2)) == -1) deletes1.push(k.substr(2));
					}
				}
			}
		}
		if (deletes1.length > 0 || deletes0.length > 0) {
			t.deleteCheckedReports(deletes1, deletes0);
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

	deleteCheckedReports: function (deletes1, deletes0) {
		var t = DeleteReports;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.s1rids = deletes1.join(",");
		params.s0rids = deletes0.join(",");
		params.cityrids = '';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (deletes0.length > 0) {
						for (var j = 0; j < deletes0.length; j++) {
							delete ReportCache[deletes0[j]];
							delete ReportDetailCache[deletes0[j]];
						}
					}
					if (deletes1.length > 0) {
						for (var j = 0; j < deletes1.length; j++) {
							delete ReportCache[deletes1[j]];
							delete ReportDetailCache[deletes1[j]];
						}
					}
					Seed.newReportCount = parseInt(Seed.newReportCount) - parseInt(deletes1.length) - parseInt(deletes0.length);
					if (GlobalOptions.ExtendedDebugMode) actionLog('Deleted: ' + parseInt(deletes1.length + deletes0.length) + ' reports', 'REPORTS');
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

	checkreportforitems: function (rpId, deletewinner) {
		var t = DeleteReports;
		FetchReportDetail(rpId, 1, function (rslt) {
			if (rslt && rslt.winner) {
				var darkforest = false;
				if (rslt.fght && rslt.fght.s0 && (rslt.fght.s0.m101 || rslt.fght.s0.m102 || rslt.fght.s0.m103 || rslt.fght.s0.m104 || rslt.fght.s0.m105 || rslt.fght.s0.m106 || rslt.fght.s0.m107 || rslt.fght.s0.m108 || rslt.fght.s0.m109 || rslt.fght.s0.m10)) {
					darkforest = true;
					t.ReportLog.DFCount++;
				}
				if (rslt.loot && rslt.loot[5]) {
					var loot = rslt.loot[5];
					if (matTypeof(loot) == 'object') {
						for (var z in loot) {
							if (darkforest) {
								if (t.ReportLog.ItemsFoundDF[z]) { t.ReportLog.ItemsFoundDF[z] += parseInt(loot[z]); }
								else { t.ReportLog.ItemsFoundDF[z] = parseInt(loot[z]); }
							} else {
								if (t.ReportLog.ItemsFound[z]) { t.ReportLog.ItemsFound[z] += parseInt(loot[z]); }
								else { t.ReportLog.ItemsFound[z] = parseInt(loot[z]); }
							}
						}
					}
				}
				if (rslt.throneRoomDrop) {
					var TR = rslt.throneRoomDrop;
					var z = "" + TR.type + TR.quality;
					if (darkforest) {
						if (t.ReportLog.ThroneItemsFoundDF[z]) { t.ReportLog.ThroneItemsFoundDF[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = TR.type;
							NewObj.quality = TR.quality;
							NewObj.amount = 1;
							t.ReportLog.ThroneItemsFoundDF[z] = NewObj;
						}
					} else {
						if (t.ReportLog.ThroneItemsFound[z]) { t.ReportLog.ThroneItemsFound[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = TR.type;
							NewObj.quality = TR.quality;
							NewObj.amount = 1;
							t.ReportLog.ThroneItemsFound[z] = NewObj;
						}
					}
				}
				if (rslt.equipmentDrop) {
					var EQ = rslt.equipmentDrop;
					var z = "" + EQ.subtype + EQ.rarity;
					if (darkforest) {
						if (t.ReportLog.ChampItemsFoundDF[z]) { t.ReportLog.ChampItemsFoundDF[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = EQ.subtype;
							NewObj.quality = EQ.rarity;
							NewObj.amount = 1;
							t.ReportLog.ChampItemsFoundDF[z] = NewObj;
						}
					} else {
						if (t.ReportLog.ChampItemsFound[z]) { t.ReportLog.ChampItemsFound[z].amount += 1; }
						else {
							var NewObj = {};
							NewObj.type = EQ.subtype;
							NewObj.quality = EQ.rarity;
							NewObj.amount = 1;
							t.ReportLog.ChampItemsFound[z] = NewObj;
						}
					}
				}
				if (rslt.lootJewel) {
					var item = rslt.lootJewel;
					if (matTypeof(item) == 'object') {
						var z = item.quality;
						if (darkforest) {
							if (t.ReportLog.JewelItemsFoundDF[z]) { t.ReportLog.JewelItemsFoundDF[z] += parseInt(item.quantity); }
							else { t.ReportLog.JewelItemsFoundDF[z] = parseInt(item.quantity); }
						} else {
							if (t.ReportLog.JewelItemsFound[z]) { t.ReportLog.JewelItemsFound[z] += parseInt(item.quantity); }
							else { t.ReportLog.JewelItemsFound[z] = parseInt(item.quantity); }
						}
					}
				}
				t.saveLog();
				if (deletewinner) {
					deleteCheckedReport(rpId);
				}
			};
		});
	},
}

var DispReport = {
	init: function () {
		var t = DispReport;

		try {
			t.modal_MessageButtons = new CalterUwFunc('modal_messages', [[/}\s*$/, ';setTimeout(function() { AddMsgButtons(); },0); }']]);
			uWExportFunction('AddMsgButtons', DispReport.AddMsgButtons);
			t.modal_MessageButtons.setEnable(Options.enhancedinbox);

			t.modal_InboxFunc = new CalterUwFunc('modal_messages_listshow', [['msghtml.join("");', 'msghtml.join("");dispInbox_hook(rslt,boxType,msghtml);'],
			['reverse()', 'sort(function(aaa, bbb){return bbb-aaa})']]);
			uWExportFunction('dispInbox_hook', DispReport.ModalInboxHook);
			t.modal_InboxFunc.setEnable(true);

			t.modal_RptFunc = new CalterUwFunc('Messages.handleListReports', [['n.join("");', 'n.join("");dispRpt_hook(l,n);']]);
			uWExportFunction('dispRpt_hook', DispReport.ModalReportListHook);
			t.modal_RptFunc.setEnable(Options.enhancedinbox);

			t.modal_MessageText = new CalterUwFunc('modal_messages_view', [[/<div class='bodytext'>/, "<div class='bodytext' ondblclick='btSelectText(this);'>"], [/backButtonHtml;/, "backButtonHtml;parseLinks();"]]);
			uWExportFunction('parseLinks', DispReport.parseLinks);
			t.modal_MessageText.setEnable(true);

			uWExportFunction('makeReportLink', makeReportLink);
			uWExportFunction('makeReportPopup', makeReportPopup);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = DispReport;
		t.modal_InboxFunc.setEnable(tf);
	},
	isDispReportAvailable: function () {
		var t = DispReport;
		return t.modal_InboxFunc.isAvailable();
	},
	AddMsgButtons: function () {
		var t = DispReport;
		if (ById('modal_msg_links')) ById('modal_msg_links').style.top = '8px';
		msgBody = ByCl('messageDeletes');
		var div = msgBody[0];
		var a = document.createElement('a');
		a.className = 'inlineButton brown20';
		a.style.marginRight = '6px';
		a.innerHTML = '<span>' + tx('Delete Gift Report') + '</span>';
		a.addEventListener('click', function () { t.checkinbox(1); }, false);
		div.appendChild(a);

		msgBody = ByCl('reportDeletes');
		var div = msgBody[0];
		var a = document.createElement('a');
		a.className = 'buttonDown20';
		a.innerHTML = '<span>' + tx('Delete Wild/Barb/Transport') + '</span>';
		a.style.float = 'left';
		a.addEventListener('click', t.checkreportlist, false);
		div.appendChild(a);
	},
	ModalInboxHook: function (rslt, boxType, msghtml) {
		var t = DispReport;

		var div = ById('ptPageNavBar');
		if (div) div.style.marginLeft = '20px';

		// fix outbox buttons.... game bug!
		if (boxType == 'outbox') {
			uW.hideMessageTabs();
			jQuery(".messageDeletes").show();
		}
		if (ById('modal_msg_view_body')) {
			var msgdiv = ById('modal_msg_view_body').getElementsByClassName('bodytext')[0];
			if (msgdiv) {
				msgdiv.addEventListener('dblclick', function () { SelectText(msgdiv); }, false);
			}
		}
	},
	parseLinks: function () {
		var t = DispReport;
		if (ById('modal_msg_view_body')) {
			var msgdiv = ById('modal_msg_view_body').getElementsByClassName('bodytext')[0];
			if (msgdiv) {
				msgdiv.innerHTML = msgdiv.innerHTML.replace(/(\bReport\sNo\:\s([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
				msgdiv.innerHTML = msgdiv.innerHTML.replace(/(\bRpt\:([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
				msgdiv.innerHTML = msgdiv.innerHTML.replace(/#([0-9]+)#/g, '<a onclick=\'ptChatReportClicked($1,0)\'>$1</a>');
			}
		}
	},
	checkinbox: function (what) {
		var t = DispReport;
		var body = ById('tbl_messages');
		if (!body) return;
		var trs = body.getElementsByTagName('tr');
		var reports = [];
		for (var i = 0; i < trs.length; i++) {
			var tds = trs[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				if (tds[j].className == 'chkcol') var checkbox = tds[j];
				if (tds[j].className == 'dtcol') var date = tds[j];
				if (tds[j].className == 'nmcol') var sender = tds[j];
				if (tds[j].className == 'subjcol') var subject = tds[j];
			}
			reports.push({ checkbox: checkbox, date: date, sender: sender, subject: subject });
		}
		if (what == 1) t.parseGiftReport(reports);
	},
	parseGiftReport: function (rpts) {
		var t = DispReport;
		for (var i = 0; i < rpts.length; i++) {
			var GiftMessage = false;
			for (var j in GiftText) {
				if (rpts[i].subject.innerHTML.indexOf(GiftText[j]) != -1) {
					GiftMessage = true;
					break;
				}
			}
			if (rpts[i].sender.innerHTML.indexOf('Kingdoms Of Camelot') >= 0 && GiftMessage) {
				rpts[i].checkbox.firstChild.checked = true;
			}
		}
		uW.messages_action("delete", "tbl_messages");
	},
	ModalReportListHook: function (rslt, msghtml) {
		var t = DispReport;
		// fix HQ buttons.... rockyou bug!
		jQuery(".hqMessageDeletes").hide();

		if (rslt.ok) {
			msgBody = ById('modal_msg_reports_tablediv');
			var mml = ById('modal_msg_list');
			if (mml != null) mml.style.minHeight = '400px';
			var trs = msgBody.getElementsByTagName('tr');
			for (var i = 0; i < trs.length; i++) {
				var tds = trs[i].getElementsByTagName('td');
				for (var j = 0; j < tds.length; j++) {
					if (tds[j].className == 'subjcol') {
						tds[j].style.width = '190px';
						var original = tds[j].innerHTML;
						original = original.replace("<div>", "");
						original = original.replace("</div>", "");
						var popup = original.replace(uW.g_js_strings.modal_messages_viewtrades.viewrpt, tx("Pop-up"));
						popup = popup.replace(uW.g_js_strings.commonstr.view, tx("Pop-up"));
						popup = popup.replace("Messages.viewMarchReport", "makeReportPopup");
						var makelink = original.replace(uW.g_js_strings.modal_messages_viewtrades.viewrpt, tx("Share"));
						makelink = makelink.replace(uW.g_js_strings.commonstr.view, tx("Share"));
						makelink = makelink.replace("Messages.viewMarchReport", "makeReportLink");
						original = original.replace(uW.g_js_strings.modal_messages_viewtrades.viewrpt, uW.g_js_strings.commonstr.view);
						var newContent = original + " | " + popup + " | " + makelink;
						tds[j].innerHTML = '<DIV style="width:180px;">' + newContent + '</div>';
					}
					if (tds[j].className == 'nmcol') {
						tds[j].style.width = '400px';
					}
				}
			}
		}
	},
	checkreportlist: function () {
		var t = DispReport;
		var body = ById('modal_msg_reports_tablediv');
		var trs = body.getElementsByTagName('tr');
		var reports = [];
		for (var i = 0; i < trs.length; i++) {
			var tds = trs[i].getElementsByTagName('td');
			for (var j = 0; j < tds.length; j++) {
				if (tds[j].className == 'chkcol') {
					var checkbox = tds[j];
				}
				if (tds[j].className == 'nmcol') {
					var type = tds[j];
				}
				if (tds[j].className == 'subjcol') {
					var view = tds[j];
				}
			}
			reports.push({
				checkbox: checkbox,
				type: type,
				view: view
			});
		}
		t.parseBarbReport(reports);
	},
	parseBarbReport: function (rpts) {
		var t = DispReport;
		if (NoRegEx) { // regular expression fix for cometbird
			var regex = /Messages.viewMarchReport\(([^&]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([^&]+),([^&]+),([^&]+),([^&]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+)/;
		}
		else {
			var regex = /Messages.viewMarchReport\(([^"]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([^"]+),([^"]+),([^"]+),([^"]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+),([0-9]+)/;
		}
		for (var i = 0; i < rpts.length; i++) {
			var m = regex.exec(rpts[i].view.innerHTML);
			if (m) {
				if (m[6] == m[8] && m[7] == m[9]) { //Source and target id the same.
					// continue; //Infer transport to self
				} else if (m[5] != 0) {
					continue;
				}
				rpts[i].checkbox.firstChild.checked = true;
			}
		}
		uW.Messages.deleteCheckedReports();
	}
};
