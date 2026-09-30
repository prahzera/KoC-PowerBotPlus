/**************************** Aport Tab ****************************************/
// @tabversion 20260930
// Nativizado desde el ExtraTab externo tabs/Aport.js (Tabs.PortalTime).
// Se conserva Options.PortOptions para no perder la configuracion de los
// usuarios que ya usaban el ExtraTab.

Tabs.Aport = {
	tabOrder: 8000,
	tabLabel: 'Aport',
	tabColor: 'brown',
	myDiv: null,
	cityId: 0,
	inc: 0,
	checktimer: null,
	resettimer: null,
	doveavailable: false,
	porttype: 0,
	triggered: false,
	reason: '',
	MapAjax: new CMapAjax(),
	Blocks: [],
	plain: null,
	checklist: [],

	Options: {
		Running: false,
		OnScout: false,
		OnTime: true,
		OnType: false,
		lastinc: 0,
		inctime: 5,
		incnumber: 5,
		inctype: 'unt9',
		incamount: 200000,
		inctype2: 'unt41',
		PortProvince: 0,
		PortToggle: true,
		PortAFK: true,
		UseRefuge: true,
		UseOrder: false,
		MistPort: false,
		SendMail: true,
		PortCities: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		DoveCities: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false },
		AllAttacks: false,
	},

	init: function (div) {
		var t = Tabs.Aport;
		t.myDiv = div;

		if (!Options.PortOptions) {
			Options.PortOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.PortOptions.hasOwnProperty(y)) {
					Options.PortOptions[y] = t.Options[y];
				}
			}
		}

		// Los slots de ciudad se amplian si la cuenta tiene mas ciudades que el
		// maximo historico (8), para que el checkbox no quede huerfano.
		for (var i = 1; i <= Cities.numCities; i++) {
			if (!Options.PortOptions.PortCities.hasOwnProperty(i)) { Options.PortOptions.PortCities[i] = false; }
			if (!Options.PortOptions.DoveCities.hasOwnProperty(i)) { Options.PortOptions.DoveCities[i] = false; }
		}

		Options.PortOptions.MistPort = false; // disable because it doesn't work!

		// conversion
		if (Options.PortOptions.AutoDove && Cities.byID[Options.PortOptions.PortCity]) {
			Options.PortOptions.DoveCities[Cities.byID[Options.PortOptions.PortCity].idx + 1] = true;
			delete Options.PortOptions.AutoDove;
			saveOptions();
		}
		if (Options.PortOptions.PortCity && Cities.byID[Options.PortOptions.PortCity]) {
			Options.PortOptions.PortCities[Cities.byID[Options.PortOptions.PortCity].idx + 1] = true;
			delete Options.PortOptions.PortCity;
			delete Options.PortOptions.PortCityIdx;
			saveOptions();
		}
		if (!Options.PortOptions.inctype2) {
			Options.PortOptions.inctype2 = 'unt41';
			saveOptions();
		}

		if (Options.PortOptions.PortToggle) { AddSubTabLink(tx('Aport'), t.togglePortState, 'AportToggleTab'); }
		t.SyncState();

		var m = '<DIV class=divHeader align=center>' + tx('AutoPort Options') + '</div>';
		m += '<div align="center">';
		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=pbportbutton type=checkbox ' + (Options.PortOptions.PortToggle ? 'CHECKED ' : '') + '/>&nbsp;' + tx('Add toggle button to main screen header') + '</td><td colspan=2 align=center><INPUT id=btAutoPortState type=submit value="' + tx('Aport') + ' = ' + tx('Off') + '"></td><td width=30% align=right>&nbsp;</td></tr></table>';

		m += '<br><TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:' + Options.OverviewOptions.OverviewFontSize + 'px;"><TR valign=bottom><td width=20>&nbsp;</td><td width=40>&nbsp;</td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><B>' + Cities.cities[i - 1].name.substring(0, 12) + '</b></TD>';
		}
		m += '<td>&nbsp;</td>'; // spacer
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>' + tx('Auto-Port') + '&nbsp;</b></TD>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btPortAutoCity_' + i + '" type=checkbox ' + (Options.PortOptions.PortCities[i] ? 'CHECKED' : '') + '></div></TD>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right><b>' + tx('Auto-Dove') + '&nbsp;</b></TD>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btDoveAutoCity_' + i + '" type=checkbox ' + (Options.PortOptions.DoveCities[i] ? 'CHECKED' : '') + '></div></TD>';
		}
		m += '</tr></table>';

		m += '<br><TABLE width=98% height=0% class=xtab>';
		m += '<tr><td colspan=4 align=center><b>' + tx('Requirements') + ':</b></td></tr>';
		m += '<tr><td colspan=4 align=center>' + tx('The selected cities MUST contain a watchtower of level 8 or above, or it cannot properly detect Incoming Attacks/Scouts!') + '</td></tr>';
		m += '<tr><td colspan=4 align=center>' + tx('Porting will NOT work if there are troops outside the city, including barbarian raids!') + '</td></tr>';
		m += '<tr><td colspan=4><hr></td></tr>';
		m += '<tr><td width=10>&nbsp;</td><TD colspan=3>' + tx('Doves Owned') + ' ' + t.ItemCount('i901') + '</td></tr>';
		m += '<tr><td width=10>&nbsp;</td><td colspan=3>' + tx('Port to province') + ':&nbsp;<select id=portprovince><option value="0">' + tx('Random') + '</option>';
		for (var i = 1; i <= 24; i++) { m += '<option value="' + i + '">' + uW.provincenames['p' + i] + '</option>'; }
		m += '</select></td></tr>';
		m += '<tr><TD><INPUT id=btportafk type=checkbox ' + (Options.PortOptions.PortAFK ? 'CHECKED ' : '') + '/></td><TD>' + tx('Only port when AFK') + '</td></tr>';
		m += '<tr><TD><INPUT id=btportorder type=checkbox ' + (Options.PortOptions.UseOrder ? 'CHECKED ' : '') + '/></td><TD width=180px>' + tx('Use Portal of Order (Owned') + ' ' + t.ItemCount('i912') + ')</td><TD style="display:none;"><INPUT id=btmistport type=checkbox ' + (Options.PortOptions.MistPort ? 'CHECKED ' : '') + '/>&nbsp;' + tx('Try to port to an existing mist') + '</td></tr>';
		m += '<tr><TD><INPUT id=btportrefuge type=checkbox ' + (Options.PortOptions.UseRefuge ? 'CHECKED ' : '') + '/></td><TD>' + tx('Use Portal of Refuge (Owned') + ' ' + t.ItemCount('i911') + ')</td></tr>';
		m += '<tr><TD>&nbsp;</td><td colspan=3>' + tx('Portals of Order will be used first if ticked. If map lookup fails a Portal of Refuge will be used whether ticked or not!') + '</td></tr>';
		m += '<tr><td colspan=4><hr></td></tr>';
		m += '<tr><td><INPUT id=portscout type=checkbox ' + (Options.PortOptions.OnScout ? 'CHECKED' : '') + '></td><td colspan=3>' + tx('Port on incoming scout') + '</td></tr>';
		m += '<tr><td><INPUT id=portall type=checkbox ' + (Options.PortOptions.AllAttacks ? 'CHECKED' : '') + '></td><td colspan=3>' + tx('Port on all incoming attacks') + '</td></tr>';
		m += '<tr><td><INPUT id=porttime type=checkbox ' + (Options.PortOptions.OnTime ? 'CHECKED' : '') + '></td><td colspan=3>' + tx('Port on more than') + '&nbsp;<INPUT style="width: 30px;text-align:right;" id=portincnumber type=text value=' + Options.PortOptions.incnumber + '>&nbsp;' + tx('attacks in') + '&nbsp;<INPUT id=portinctime style="width: 30px;text-align:right;" type=text value=' + Options.PortOptions.inctime + '>&nbsp;' + tx('minutes') + '</td></tr>';
		m += '<tr><td><INPUT id=porttype type=checkbox ' + (Options.PortOptions.OnType ? 'CHECKED' : '') + '></td><td colspan=3>' + tx('Port on more than') + '&nbsp;<INPUT style="width: 70px;text-align:right;" id=portincamount type=text value=' + Options.PortOptions.incamount + '>&nbsp;<select id=portinctype>';
		for (var y in uW.unitcost) { m += '<option value="' + y + '">' + uW.unitcost[y][0] + '</option>'; }
		m += '</select>&nbsp;' + tx('or') + '&nbsp;<select id=portinctype2>';
		for (var y in uW.unitcost) { m += '<option value="' + y + '">' + uW.unitcost[y][0] + '</option>'; }
		m += '</select>&nbsp;' + tx('incoming on a single attack') + '</td></tr>';
		m += '<tr><td><INPUT id=portsendmail type=checkbox ' + (Options.PortOptions.SendMail ? 'CHECKED' : '') + '></td><TD>' + tx('Send audit message to yourself when porting triggered') + '</td></tr>';
		m += '</table>';
		m += '<div align=center><br><hr>';
		m += '<br>' + tx('This tool is inspired from tremendous contributions by Barbarbossa69 towards KoC Power Bot') + '<br>';
		t.myDiv.innerHTML = m;

		for (var i = 1; i <= Cities.numCities; i++) {
			ById('btPortAutoCity_' + i).addEventListener('click', function (e) {
				Options.PortOptions.PortCities[e.target['className']] = e.target.checked;
				saveOptions();
			}, false);
			ById('btDoveAutoCity_' + i).addEventListener('click', function (e) {
				Options.PortOptions.DoveCities[e.target['className']] = e.target.checked;
				saveOptions();
			}, false);
		}

		ById('btAutoPortState').addEventListener('click', function () {
			t.togglePortState();
		}, false);

		ToggleOption('PortOptions', 'pbportbutton', 'PortToggle');
		ToggleOption('PortOptions', 'btportafk', 'PortAFK');
		ToggleOption('PortOptions', 'portscout', 'OnScout');
		ToggleOption('PortOptions', 'portall', 'AllAttacks');
		ToggleOption('PortOptions', 'porttime', 'OnTime');
		ToggleOption('PortOptions', 'porttype', 'OnType');
		ToggleOption('PortOptions', 'btportrefuge', 'UseRefuge');
		ToggleOption('PortOptions', 'btportorder', 'UseOrder');
		ToggleOption('PortOptions', 'portsendmail', 'SendMail');
		ChangeOption('PortOptions', 'portprovince', 'PortProvince');
		ChangeOption('PortOptions', 'portincnumber', 'incnumber', t.ResetTimer);
		ChangeOption('PortOptions', 'portinctime', 'inctime', t.ResetTimer);
		ChangeOption('PortOptions', 'portincamount', 'incamount');
		ChangeOption('PortOptions', 'portinctype', 'inctype');
		ChangeOption('PortOptions', 'portinctype2', 'inctype2');

		ById('portprovince').value = Options.PortOptions.PortProvince;
		ById('portinctype').value = Options.PortOptions.inctype;
		ById('portinctype2').value = Options.PortOptions.inctype2;

		if (!t.checktimer) { t.checktimer = setInterval(function () { t.checkincoming(); }, 5000); }
		t.ResetTimer();
		t.doveavailable = true;
	},

	hide: function () { },

	show: function () { },

	ItemCount: function (iid) {
		if (Seed.items[iid]) { return Seed.items[iid]; }
		return 0;
	},

	SyncState: function () {
		var t = Tabs.Aport;
		var running = Options.PortOptions.Running;
		var btn = ById('btAutoPortState');
		if (btn) { btn.value = tx('Aport') + ' = ' + (running ? tx('On') : tx('Off')); }
		SetToggleButtonState('Aport', running, 'Aport');
	},

	checkincoming: function () {
		var t = Tabs.Aport;
		if (!Options.PortOptions.Running) { return; }
		if (t.triggered) { return; } // we're already on it!
		if (afkdetector.isAFK || !Options.PortOptions.PortAFK) {
			var now = unixTime();
			t.reason = '';
			for (var k in Seed.queue_atkinc) { // check each incoming march
				var m = Seed.queue_atkinc[k];
				if (!m.toCityId) { continue; }
				var city = Cities.byID[m.toCityId];
				if (!city) { continue; }
				var slot = city.idx + 1;
				var isPortCity = Options.PortOptions.PortCities[slot] == true;
				var isDoveCity = Options.PortOptions.DoveCities[slot] == true;
				if ((!isPortCity && !isDoveCity) || (m.toTileId != city.tileId)) { continue; }

				var fromname = '???';
				if (Seed.players['u' + m.pid]) { fromname = Seed.players['u' + m.pid].n; }
				var incoming = parseIntNan(m.arrivalTime) > now;

				var GoPort = false;
				if (m.marchType == 3 && Options.PortOptions.OnScout && incoming) {
					GoPort = true;
					t.reason = city.name + ': ' + tx('Attempted scout on city by') + ' ' + fromname;
				}

				if (m.marchType == 4 && Options.PortOptions.OnTime && incoming) {
					if (m.departureTime > Options.PortOptions.lastinc) {
						t.inc++;
						// potential fix for ghosted incoming attacks of the exact same second.
						setTimeout(function () { Options.PortOptions.lastinc = m.departureTime; saveOptions(); }, 500);
						if (t.inc > Options.PortOptions.incnumber) {
							GoPort = true;
							t.reason = city.name + ': ' + tx('Too many attacks in a short space of time');
						}
					}
				}

				if (m.marchType == 4 && Options.PortOptions.OnType && incoming && m['unts']) {
					for (var c = 0; c < 2; c++) {
						var type = c == 0 ? Options.PortOptions.inctype : Options.PortOptions.inctype2;
						if (!type) { continue; }
						var u = parseIntNan(type.split('unt')[1]);
						if (m['unts']['u' + u] && m['unts']['u' + u] >= Options.PortOptions.incamount) {
							GoPort = true;
							t.reason = city.name + ': ' + fromname + ' ' + tx('Attempted to attack with') + ' ' + m['unts']['u' + u] + ' ' + uW.unitnamedesctranslated['unt' + u][0];
						}
					}
				}

				if (m.marchType == 4 && Options.PortOptions.AllAttacks && incoming) {
					GoPort = true;
					t.reason = city.name + ': ' + tx('Attempted attack on city by') + ' ' + fromname;
				}

				if (GoPort) {
					t.triggered = true;
					t.porttype = 0;
					if (isPortCity) {
						if (Options.PortOptions.UseOrder && parseIntNan(Seed.items.i912) != 0) { t.porttype = 912; }
						else if (Options.PortOptions.UseRefuge && parseIntNan(Seed.items.i911) != 0) { t.porttype = 911; }
					}
					if ((Seed.player.warStatus != 3) && isDoveCity && t.doveavailable) {
						actionLog(city.name + ': ' + tx('Attempting to Auto Dove... '), 'AUTOPORT');
						t.UseDove('901', m.toCityId);
					}
					else {
						t.ChoosePort(m.toCityId);
					}
					break;
				}
			}
		}
	},

	ResetTimer: function () {
		var t = Tabs.Aport;
		clearInterval(t.resettimer);
		t.resettimer = setInterval(function () {
			t.inc = 0;
		}, Options.PortOptions.inctime * 60 * 1000); // reset to 0 every xxx mins
	},

	togglePortState: function () {
		var t = Tabs.Aport;
		t.doveavailable = true;
		Options.PortOptions.Running = !Options.PortOptions.Running;
		saveOptions();
		t.SyncState();
	},

	doRefuge: function (cid) {
		var t = Tabs.Aport;
		if (!Options.PortOptions.Running) { return; }
		actionLog(Cities.byID[cid].name + ': ' + tx('Attempting to use Portal of Refuge... '), 'AUTOPORT');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.iid = 911;
		params.cid = cid;
		if (parseIntNan(Options.PortOptions.PortProvince) == 0) { params.pid = Math.floor((Math.random() * 24) + 1); } // random province
		else { params.pid = parseIntNan(Options.PortOptions.PortProvince); }

		new MyAjaxRequest(uW.g_ajaxpath + 'ajax/relocate.php' + uW.g_ajaxsuffix, {
			method: 'post',
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (Options.PortOptions.SendMail) { t.SendPortMessage(t.reason); }
					ReloadGameFrame();
				}
				else {
					if (rslt.error_code == 311) { // troops outside, wait for a minute!
						actionLog(Cities.byID[cid].name + ': ' + tx('Troops outside when attempting to port! Waiting...'), 'AUTOPORT');
						setTimeout(t.ReleaseTrigger, 1000 * 60);
						return;
					}
					t.triggered = false;
				}
			},
			onFailure: function () { t.triggered = false; },
		});
	},

	doOrder: function (cid) {
		var t = Tabs.Aport;
		if (!Options.PortOptions.Running) { return; }
		actionLog(Cities.byID[cid].name + ': ' + tx('Attempting to use Portal of Order... '), 'AUTOPORT');
		if (parseIntNan(Options.PortOptions.PortProvince) == 0) { var province = Math.floor((Math.random() * 24) + 1); } // random province
		else { var province = parseIntNan(Options.PortOptions.PortProvince); }
		// provinces are 30x30 blocks, we're going to choose 4x4 to search, so need to choose random number between 0 and 26 inclusive for both x and y.
		var blockstartX = (Math.floor(Math.random() * 27) * 5) + Provinces['p' + province].x;
		var blockstartY = (Math.floor(Math.random() * 27) * 5) + Provinces['p' + province].y;
		t.Blocks = t.MapAjax.generateBlockList(blockstartX, blockstartY, 9); // radius 9 gives 19 blocks distance
		var blockString = t.Blocks.join('%2C');
		t.MapAjax.LookupMap(blockString, function (rslt) {
			if (rslt.BotCode && rslt.BotCode == 999) { // map captcha
				actionLog(Cities.byID[cid].name + ': ' + tx('Map captcha detected!'), 'AUTOPORT');
				t.doRefuge(cid);
				return;
			}
			if (!rslt.ok) { // lookup rate-limited or failed: don't stay locked forever
				t.triggered = false;
				return;
			}
			var map = rslt.data;
			t.plain = null;
			t.checklist = [];
			var ported = false;
			for (var k in map) {
				var u = map[k].tileUserId || 0;
				if (parseIntNan(map[k].tileType) == 50 && u == 0) { // unowned plain
					if (!Options.PortOptions.MistPort) {
						t.GoOrder(cid, map[k].xCoord, map[k].yCoord, false);
						ported = true;
						break;
					}
					else { t.plain = { 'x': map[k].xCoord, 'y': map[k].yCoord }; }
				}
				if (Options.PortOptions.MistPort && parseIntNan(map[k].tileType) == 53) { // mist
					t.checklist.push({ 'x': map[k].xCoord, 'y': map[k].yCoord });
				}
			}
			if (ported) { return; }
			if (Options.PortOptions.MistPort) {
				if (t.checklist.length > 0) {
					var next = t.checklist.splice(0, 1)[0];
					t.GoOrder(cid, next.x, next.y, true);
				}
				else if (t.plain) {
					t.GoOrder(cid, t.plain.x, t.plain.y, false);
				}
				else {
					t.triggered = false; // allow another go
				}
			}
			else {
				t.triggered = false; // no free plain tile found, allow another go
			}
		});
	},

	GoOrder: function (cid, x, y, loop) {
		var t = Tabs.Aport;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pf = 0;
		params.iid = 912;
		params.cid = cid;
		params.xcoord = x;
		params.ycoord = y;
		new MyAjaxRequest(uW.g_ajaxpath + 'ajax/relocate.php' + uW.g_ajaxsuffix, {
			method: 'post',
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					if (Options.PortOptions.SendMail) { t.SendPortMessage(t.reason); }
					ReloadGameFrame();
				}
				else {
					if (rslt.error_code == 311) { // troops outside, wait for a minute!
						actionLog(Cities.byID[cid].name + ': ' + tx('Troops outside when attempting to port! Waiting...'), 'AUTOPORT');
						setTimeout(t.ReleaseTrigger, 1000 * 60);
						return;
					}
					if (!loop) { t.triggered = false; }
					else {
						if (t.checklist.length > 0) {
							var next = t.checklist.splice(0, 1)[0];
							t.GoOrder(cid, next.x, next.y, true);
						}
						else if (t.plain) {
							t.GoOrder(cid, t.plain.x, t.plain.y, false);
						}
						else {
							t.triggered = false; // allow another go
						}
					}
				}
			},
			onFailure: function () { t.triggered = false; },
		});
	},

	ReleaseTrigger: function () {
		var t = Tabs.Aport;
		t.triggered = false;
	},

	ChoosePort: function (cid) {
		var t = Tabs.Aport;
		if (t.porttype == 911) { t.doRefuge(cid); return; }
		if (t.porttype == 912) { t.doOrder(cid); return; }
		setTimeout(t.ReleaseTrigger, 1000 * 60); // reset trigger anyway after a minute has elapsed
	},

	UseDove: function (iid, cid) {
		var t = Tabs.Aport;
		if (!Options.PortOptions.Running) { return; }
		var params = uW.Object.clone(uW.g_ajaxparams);
		new MyAjaxRequest(uW.g_ajaxpath + 'ajax/doveOut.php' + uW.g_ajaxsuffix, {
			method: 'post',
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					actionLog(Cities.byID[cid].name + ': ' + tx('Auto Dove Successful!'), 'AUTOPORT');
					var boostTime = 43200;
					Seed.player.truceExpireUnixTime = uW.unixtime() + boostTime;
					Seed.player.warStatus = 3;
					uW.CM.InventoryView.removeItemFromInventory(iid);
					uW.update_boosts();
				}
				else {
					actionLog(Cities.byID[cid].name + ': ' + tx('Auto Dove Failed') + ' (' + uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback) + ')', 'AUTOPORT');
				}
				t.doveavailable = false;
				t.ChoosePort(cid);
			},
			onFailure: function () { // revert to port
				t.doveavailable = false;
				t.ChoosePort(cid);
			},
		}, true); // noretry
	},

	SendPortMessage: function (message) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.emailTo = Seed.player['name'];
		params.subject = 'Autoport triggered!';
		params.message = message;
		params.requestType = 'COMPOSED_MAIL';
		new MyAjaxRequest(uW.g_ajaxpath + 'ajax/getEmail.php' + uW.g_ajaxsuffix, {
			method: 'post',
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) { DeleteLastMessage(); }
			},
			onFailure: function () { },
		}, true);
	},
};
