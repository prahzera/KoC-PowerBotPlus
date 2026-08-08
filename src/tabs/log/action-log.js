/** Log Tab **/

Tabs.ActionLog = {
	tabOrder: 9998,
	tabColor: 'red',
	tabLabel: 'Log',
	myDiv: null,
	maxEntries: 500,
	EventLog: [],
	arealist: {},
	logfilter: 'ALL',
	LoopCounter: 1,

	init: function (div) {
		var t = Tabs.ActionLog;
		t.myDiv = div;

		var a = JSON2.parse(GM_getValue('log_' + getServerId() + '_' + uW.tvuid, '[]'));
		if (matTypeof(a) == 'array') {
			t.EventLog = a;
		}

		window.addEventListener('unload', t.onUnload, false);
	},

	onUnload: function () {
		var t = Tabs.ActionLog;
		if (uW.btLoaded) {
			if (!ResetAll) t.save();
		}
	},

	EverySecond: function () {
		var t = Tabs.ActionLog;
		t.LoopCounter = t.LoopCounter + 1;
		if (FFVersion.Browser == "Chrome" && (t.LoopCounter % 15 == 0)) {
			t.save();
		}
	},

	save: function () {
		var t = Tabs.ActionLog;
		GM_setValue('log_' + getServerId() + '_' + uW.tvuid, JSON2.stringify(t.EventLog));
	},

	log: function (msg, area) {
		var t = Tabs.ActionLog;
		if (!area) area = 'GENERAL';
		var ts = unixTime();
		while (t.EventLog.length >= t.maxEntries) {
			t.EventLog.shift();
		}
		t.EventLog.push({ msg: msg, ts: ts, area: area });
		if (GlobalOptions.ExtendedDebugMode) {
			logit(msg); // also send to browser log
		}

		if (tabManager.currentTab && tabManager.currentTab.name == 'ActionLog' && Options.btWinIsOpen) {
			t.PaintLog();
		}
	},

	PaintLog: function () {
		var t = Tabs.ActionLog;

		t.arealist = { ALL: 'ALL' };
		for (var i = 0; i < t.EventLog.length; i++) {
			if (!t.arealist[t.EventLog[i].area]) {
				t.arealist[t.EventLog[i].area] = t.EventLog[i].area;
			}
		}

		var z = '';
		var r = 0;
		var logshow = false;
		var logfiltered = false;

		var z = '<DIV class=divHeader align=center>' + tx('ACTION LOG') + '</div>';
		z += '<div align="center"><TABLE cellSpacing=0 width=98% height=0%><tr><td class="xtab"> Area Filter:&nbsp;' + htmlSelector(t.arealist, t.logfilter, 'id=pblogfilter class=btInput') + '<td class="xtab" align=right>(' + t.EventLog.length + '/' + t.maxEntries + ')</td></tr></table>';
		z += '<TABLE cellSpacing=0 width=98% height=0%><tr><td class="xtabHD" style="width:100px"><b>Date/Time</b></td><td style="width:115px" class="xtabHD"><b>Area</b></td><td class="xtabHD"><b>Log Message</b></td></tr></table>';
		z += '<div style="max-height:535px; height:535px; overflow-y:scroll" align="center"><TABLE id=pbactionlog cellSpacing=0 width=98% height=0%>';

		var n = t.EventLog.length;
		while (n--) {
			var a = t.EventLog[n];

			logfiltered = true;
			if ((t.logfilter != "ALL") && (a.area != t.logfilter)) continue;

			logshow = true;
			if (++r % 2) { rowClass = 'evenRow'; }
			else { rowClass = 'oddRow'; }
			z += '<tr class="' + rowClass + '">';
			z += '<TD style="width:100px" class=xtab>' + formatDateTime(a.ts) + '</td>';
			z += '<TD style="width:115px" class=xtab>' + a.area + '</td>';
			z += '<TD class=xtabBRTop>' + a.msg + '</td>';
			z += '</tr>';
		}

		if (!logshow) {
			if (!logfiltered)
				z += '<tr><td colspan=2 class=xtab><div align="center"><br><br>No log entries</div></td></tr>';
			else
				z += '<tr><td colspan=2 class=xtab><div align="center"><br><br>No log entries for selected area</div></td></tr>';
		}

		z += '</table></div><br>';

		t.myDiv.innerHTML = z;
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		ById('pblogfilter').addEventListener('change', t.ChangeLogFilter, false);
	},

	show: function () {
		var t = Tabs.ActionLog;
		t.PaintLog();
	},

	ChangeLogFilter: function (evt) {
		var t = Tabs.ActionLog;
		t.logfilter = evt.target.value;
		t.PaintLog();
	},

}
