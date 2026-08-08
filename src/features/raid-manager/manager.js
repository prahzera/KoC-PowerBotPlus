var RaidManager = {
	LookupTimer: null,
	stopping: false,
	resuming: false,
	deleting: false,
	stopprogress: 0,
	stopcount: 0,
	activecount: 0,
	count: 0,

	init: function () {
		var t = RaidManager;

		if (Options.RaidToggle) AddSubTabLink('Raids', Tabs.Options.toggleAutoRaidState, 'RaidsToggleTab');
		SetToggleButtonState('Raids', Options.RaidRunning, 'Raids');

		if (Options.RaidButtons) {
			AddMainTabLink('RAIDS: Stop', 'pbraidtab', t.StopAllRaids);
			AddMainTabLink('Resume', 'pbraidtabRes', t.ResumeAllRaids);
			if (Options.RaidDeleteButton) AddMainTabLink('Delete', 'pbraidtabDel', t.DeleteAllRaids);
			ById('pbraidtabRes').style.marginLeft = '0px';
			if (Options.RaidDeleteButton) ById('pbraidtabDel').style.marginLeft = '0px';
			ById('pbraidtab').title = tx('Click to Stop Active Raids');
			ById('pbraidtabRes').title = tx('Click to Resume Stopped Raids');
			if (Options.RaidDeleteButton) ById('pbraidtabDel').title = tx('Click to Delete Stopped Raids');
		}

		t.LookupTimer = setTimeout(t.LookupRaids, 2500);
	},

	CityHasRaids: function (cityId) {
		var t = RaidManager;
		var city_atkp = Seed.queue_atkp['city' + cityId]
		for (var e in city_atkp) {
			MarchType = city_atkp[e]['marchType'];
			if (MarchType == 9) return true;
		}
		return false;
	},

	LookupRaids: function () {
		var t = RaidManager;
		clearTimeout(t.LookupTimer);

		t.activecount = 0;
		t.stopcount = 0;
		for (c = 0; c < Seed.cities.length; c++) {
			var cityId = Seed.cities[c][0];
			var city_atkp = Seed.queue_atkp['city' + cityId]
			for (b in city_atkp) {
				destinationUnixTime = city_atkp[b]['destinationUnixTime'];
				MarchStatus = city_atkp[b]['marchStatus'];
				MarchType = city_atkp[b]['marchType'];
				botMarchStatus = city_atkp[b]['botMarchStatus'];
				if (MarchType == 9 && (MarchStatus == 3 || MarchStatus == 10)) t.stopcount++;
				else if (MarchType == 9) t.activecount++;
			}
		}

		if (!Options.RaidButtons) return;
		if (t.resuming == false && t.stopping == false && t.deleting == false && t.activecount != 0)
			ById('pbraidtab').innerHTML = '<span style="color: #ff6">' + tx('RAIDS:') + ' ' + tx('Stop') + ' (' + t.activecount + ')</span>'
		else if (t.resuming == false && t.stopping == false && t.deleting == false)
			ById('pbraidtab').innerHTML = '<span style="color: #CCC">' + tx('RAIDS:') + ' ' + tx('Stop') + ' (' + t.activecount + ')</span>'
		if (t.resuming == false && t.resuming == false && t.deleting == false && t.stopcount != 0)
			ById('pbraidtabRes').innerHTML = '<span style="color: #ff6">' + tx('Resume') + ' (' + t.stopcount + ')</span>'
		else if (t.resuming == false && t.stopping == false && t.deleting == false)
			ById('pbraidtabRes').innerHTML = '<span style="color: #CCC">' + tx('Resume') + ' (' + t.stopcount + ')</span>'
		if (Options.RaidDeleteButton) {
			if (t.resuming == false && t.stopping == false && t.deleting == false && t.stopcount != 0)
				ById('pbraidtabDel').innerHTML = '<span style="color: #ff6">' + tx('Delete') + ' (' + t.stopcount + ')</span>'
			else if (t.resuming == false && t.stopping == false && t.deleting == false)
				ById('pbraidtabDel').innerHTML = '<span style="color: #CCC">' + tx('Delete') + ' (' + t.stopcount + ')</span>'
		}

		t.LookupTimer = setTimeout(t.LookupRaids, 2500);
	},

	StopAllRaids: function () {
		var t = RaidManager;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.activecount == 0) return;
		t.stopping = true;
		var now = unixTime();
		Options.RaidLastReset = now;
		saveOptions();
		for (i = 0; i < Seed.cities.length; i++) {
			setTimeout(t.DoAllStop, (i * 1500), i);
		}
	},

	ResumeAllRaids: function () {
		var t = RaidManager;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.stopcount == 0) return;
		t.resuming = true;
		var now = unixTime();
		Options.RaidLastReset = now;
		saveOptions();
		for (i = 0; i < Seed.cities.length; i++) {
			setTimeout(t.DoAllResume, (i * 1500), i);
		}
	},

	DeleteAllRaids: function () {
		var t = RaidManager;
		if (t.stopping == true || t.resuming == true || t.deleting == true) return;
		if (t.stopcount == 0) return;
		t.deleting = true;
		var now = unixTime();
		Options.RaidLastReset = now;
		saveOptions();
		count = 0;
		t.count = t.stopcount;
		for (var d = 0; d < Seed.cities.length; d++) {
			var cityId = Seed.cities[d][0];
			var city_atkp = Seed.queue_atkp['city' + cityId]
			for (var e in city_atkp) {
				destinationUnixTime = city_atkp[e]['destinationUnixTime'];
				MarchId = city_atkp[e]['marchId'];
				MarchStatus = city_atkp[e]['marchStatus'];
				MarchType = city_atkp[e]['marchType'];
				botMarchStatus = city_atkp[e]['botMarchStatus'];
				if (MarchType == 9 && botMarchStatus == 3 && MarchStatus == 10) {
					count++;
					setTimeout(t.DoAllDelete, (count * 1250), MarchId, d, count);
				}
			}
		}
	},

	DoAllStop: function (i) {
		var t = RaidManager;
		ToggleCityRaids(Seed.cities[i][0], 'stopAll', function (rslt) {
			if (rslt.ok) { actionLog(Seed.cities[i][1] + ': Stopping Raids', 'RAIDS'); }
			t.stopprogress = t.stopprogress + (100 / Seed.cities.length);
			t.updatebotbutton('Stopping: ' + t.stopprogress.toFixed(0) + '%', 'pbraidtab');
			if (t.stopprogress.toFixed(0) == 100) {
				t.stopprogress = 0;
				setTimeout(function () { t.updatebotbutton('RAIDS: Stop (' + t.activecount + ')', 'pbraidtab'); t.stopping = false; }, 5000);
			}
		});
	},

	DoAllResume: function (i) {
		var t = RaidManager;
		ToggleCityRaids(Seed.cities[i][0], 'resumeAll', function (rslt) {
			if (rslt.ok) { actionLog(Seed.cities[i][1] + ': Resuming Raids', 'RAIDS'); }
			t.stopprogress = t.stopprogress + (100 / Seed.cities.length);
			t.updatebotbutton('Resuming: ' + t.stopprogress.toFixed(0) + '%', 'pbraidtab');
			if (t.stopprogress.toFixed(0) == 100) {
				t.stopprogress = 0;
				setTimeout(function () { t.updatebotbutton('RAIDS: Stop (' + t.activecount + ')', 'pbraidtab'); t.resuming = false; }, 5000);
			}
		});
	},

	DoAllDelete: function (marchId, city, count) {
		var t = RaidManager;
		var cityId = Seed.cities[city][0];
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.ctrl = 'BotManager';
		params.action = 'deleteMarch';
		params.marchId = marchId;
		params.settings = {};
		params.settings = { cityId: cityId };

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt) {
					for (u in Seed.queue_atkp['city' + cityId]) {
						if (Seed.queue_atkp['city' + cityId][u]['marchId'] == marchId) {
							delete Seed.queue_atkp['city' + cityId][u];
							if (Object.keys(Seed.queue_atkp['city' + cityId]).length == 0) {
								Seed.queue_atkp['city' + cityId] = uWCloneInto([]);
							}
							break;
						}
					}

					uW.cityinfo_army();
					setTimeout(uW.update_seed_ajax, 250);
				}
			},
		});

		t.stopprogress = count * (100 / t.count);
		actionLog(Seed.cities[city][1] + ': Deleting Raids', 'RAIDS');
		t.updatebotbutton('Deleting: ' + t.stopprogress.toFixed(0) + '%', 'pbraidtab');
		if (t.stopprogress.toFixed(0) == 100) {
			t.stopprogress = 0;
			setTimeout(function () { t.updatebotbutton('RAIDS: Stop (' + t.activecount + ')', 'pbraidtab'); t.deleting = false; }, (5000));
		}
	},

	updatebotbutton: function (text, id) {
		var but = document.getElementById(id);
		if (but) {
			but.innerHTML = '<span style="color: #ff6">' + text + '</span>';
		}
	},
}
