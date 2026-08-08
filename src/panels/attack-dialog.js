var AttackDialog = {
	hideAttackEffortsState: true,

	init: function () {
		var t = AttackDialog;
		t.hideAttackEffortsState = Options.hideAttackEfforts;
		try {
			t.modal_attackFunc = new CalterUwFunc('modal_attack', [
				[/}\s*$/, '; attackDialog_hook(); }']
			]);
			uWExportFunction('attackDialog_hook', t.modalAttackHook);
			t.modal_attackFunc.setEnable(true);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function () { },
	isAvailable: function () {
		var t = AttackDialog;
		return t.modal_attackFunc.isAvailable();
	},
	modalAttackHook: function () {
		var t = AttackDialog;
		if (Options.fixKnightSelect || Options.attackCityPicker) {
			for (var i = 1; i < 6; i++)
				ById('modal_attack_tab_' + i).addEventListener('click', t.e_changeMarchType, false);
		}
		if (Options.attackCityPicker) {
			setTimeout(t.initCityPicker, 0);
		}
		if (Options.DontFilterTransportTroops) {
			var sf = ById('modal_attack_supplyfilter_checkbox');
			if (sf) { if (sf.checked) { sf.click(); } }
		}

		var divContainer = ById('modal_attack_speed_boost');
		divContainer.appendChild(t.HideAttackEfforts());

	},
	HideAttackEfforts: function () {
		var t = AttackDialog;
		if (!ById('modal_attack_march_boost')) { return; }
		var span = document.createElement('span');
		var a = document.createElement('a');
		a.innerHTML = tx('Show Attack/Speed Boosts');
		a.id = 'ptShowBoosts';
		span.appendChild(a);
		if (t.hideAttackEffortsState) {
			hideshow();
		}
		a.addEventListener('click', function (evt) {
			t.hideAttackEffortsState = !t.hideAttackEffortsState;
			hideshow();
		}, false);
		for (var i = 1; i < 5; i++) {
			ById('modal_attack_tab_' + i).addEventListener('click', hideshow, false);
		}
		return span;

		function hideshow() {
			var a = ById('ptShowBoosts');
			if (t.hideAttackEffortsState) {
				disp = 'none';
				if (a) a.innerHTML = tx('Show Attack/Speed Boosts');
			} else {
				disp = 'block';
				if (a) a.innerHTML = tx('Hide Attack/Speed Boosts');
			}
			ById('modal_attack_march_boost').style.display = disp;
			ById('modal_attack_attack_boost').style.display = disp;
			ById('modal_attack_defense_boost').style.display = disp;
			var div = ById('modal_attack_speed_boost');
			for (var i = 0; i < i < div.childNodes.length; i++) {
				if (div.childNodes[i].className == 'section_title') {
					div.childNodes[i].style.display = disp;
				}
				if (div.childNodes[i].className == 'section_content') {
					div = div.childNodes[i];
					for (var i = 0; i < div.childNodes.length; i++) {
						if (div.childNodes[i].style != undefined && div.childNodes[i].className != 'estimated') {
							div.childNodes[i].style.display = disp;
						}
					}
					break;
				}
			}
		}
	},

	initCityPicker: function () {
		var t = AttackDialog;
		var div = ById('modal_attack_target_numflag'); // as of KofC version 96;
		var mySpan;
		if (div) {
			div.parentNode.innerHTML += ' &nbsp; <SPAN id=modal_attack_citybuts></span>';
		} else {
			var span = ById('modal_attack_target_coords'); // KofC version 116+;
			span.parentNode.parentNode.firstChild.innerHTML += ' &nbsp; <SPAN id=modal_attack_citybuts></span>';
		}
		var disabled = [];
		for (var cid in Cities.byID) {
			var x = Cities.byID[cid].idx;
			disabled[x] = (Cities.byID[uW.currentcityid].idx == x) ? true : false;
		}
		new CdispCityPicker('ptatp', ById('modal_attack_citybuts'), false, t.e_CityButton, null, disabled);

		for (var i = 0; i < Cities.numCities; i++) {
			ById('ptatp_' + i).addEventListener('mouseover', function () { CityResourceHint(this, this.id.substring(6)); }, false);
			ById('ptatp_' + i).addEventListener('mouseout', function () { CityResourceHintOff(this); }, false);
		}

		if (ById('modal_attack_tab_4').className == 'selected' || ById('modal_attack_tab_3').className == 'selected') // don't do for attack or scout
			ById('modal_attack_citybuts').style.display = 'none';
	},
	e_CityButton: function (city) {
		ById('modal_attack_target_coords_x').value = city.x;
		ById('modal_attack_target_coords_y').value = city.y;
		uW.modal_attack_update_time();
	},
	e_changeMarchType: function (evt) {
		var t = AttackDialog;
		var marchType = parseInt(evt.target.id.substr(17));
		if (Options.attackCityPicker) {
			if (marchType == 3 || marchType == 4)
				ById('modal_attack_citybuts').style.display = 'none';
			else
				ById('modal_attack_citybuts').style.display = 'inline';
		}
		if (Options.fixKnightSelect) {
			var knightVal = 0;
			var selector = ById('modal_attack_knight');
			if (selector.length > 1 && (marchType == 4 || marchType == 2)) // if 'attack' or 'reinforce'
				knightVal = 1;
			selector.selectedIndex = knightVal;
			selector.disabled = false;
		}
		if (Options.DontFilterTransportTroops) {
			var sf = ById('modal_attack_supplyfilter_checkbox');
			if (sf) { if (sf.checked) { sf.click(); } }
		}
	},
};

var battleReports = {
	init: function () {
		var t = battleReports;
		try {
			t.getReportDisplayFunc = new CalterUwFunc('getReportDisplay', [
				['return K.join("")', 'var themsg=K.join(""); themsg=getReportDisplay_hook(themsg, arguments[1]); return themsg']
			]); //Alliance report battle rounds function
			uWExportFunction('getReportDisplay_hook', t.hook);
			t.getReportDisplayFunc.setEnable(true);

			t.renderBattleReportFunc = new CalterUwFunc('Messages.viewMarchReport', [
				[/\$\("modal_msg_list"\)\.innerHTML\s*=\s*cm\.MarchReportController\.getMarchReport\(c,\s*y\)/, 'var msg = cm.MarchReportController.getMarchReport(c, y); $("modal_msg_list").innerHTML = renderBattleReport_hook(msg,c,y);']
			]); //March reports battle rounds function
			uWExportFunction('renderBattleReport_hook', t.hook2);
			t.renderBattleReportFunc.setEnable(true);

			uWExportFunction('deleteAreport', t.e_deleteReport);
			uWExportFunction('PostReport', t.e_PostReport);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function () { },
	isRoundsAvailable: function () {
		var t = battleReports;
		return t.getReportDisplayFunc.isAvailable() || t.renderBattleReportFunc.isAvailable();
	},
	e_deleteReport: function (rptid) {
		var t = battleReports;
		t.ajaxDeleteMyReport(rptid);
	},
	e_PostReport: function (rptid) {
		var msg = tx('Report No') + ': ' + enFilter(rptid);
		sendChat("/a " + msg);
	},
	ajaxDeleteMyReport: function (rptid, isUnread, side, isCityReport, notify) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.s0rids = rptid;
		params.s1rids = '';
		params.cityrids = '';
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					delete ReportCache[rptid];
					delete ReportDetailCache[rptid];
					if (isUnread) {
						uW.seed.newReportCount = parseInt(seed.newReportCount) - 1;
						uW.messages_notify_bug()
					}
				}
				if (notify) notify(rslt.errorMsg);
			},
		});
	},
	hook2: function (msg, args, rslt) {
		if (rslt.rnds && Options.dispBattleRounds) {
			msg = msg.replace(/<\/ul>.*\s*<\/div>.*\s*<div class="unitsContainer">/im, '<li><span class=\'label\'>Rounds: </span><span class=\'value\'>' + rslt.rnds + '</span></li></ul></div><div class="unitsContainer">');
		}
		if (Options.reportDeleteButton) {
			msg = msg.replace(/Reports<\/span><\/a>/im, 'Reports</span></a><a class=\'button20\' onclick=\'PostReport(' + args[0] + ',false)\'><span>Post To Chat</span></a>'); //Post to Chat button
			msg = msg.replace(/Reports<\/span><\/a>/im, 'Reports</span></a><a class=\'button20\' onclick=\'MoreReport(' + args[0] + ',' + args[1] + ',false)\'><span>More</span></a>'); //More button
			msg = msg.replace(/Reports<\/span><\/a>/im, 'Reports</span></a><a class=\'button20\' onclick=\'deleteAreport(' + args[0] + ',false)\'><span>' + uW.g_js_strings.commonstr.deletetx + '</span></a>'); //Delete button
		}
		return msg;
	},
	hook: function (msg, rslt) {
		msg = msg.replace(/(\bReport\sNo\:\s([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
		if (rslt.rnds && Options.dispBattleRounds) {
			msg = msg.replace(/(Attackers <span.*?)<\/div>/im, '$1<BR>Rounds: ' + rslt.rnds + '</div>');
		}
		return msg;
	},
};
