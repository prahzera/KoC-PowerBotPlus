function CheckForIncoming() {
	var atype = "";
	var atime = "";
	var to = "";
	var name = "";
	var who = "";
	var bywho = "";

	var soonest = {};
	soonest.arrivalTime = -1;
	var soonestattack = false;

	Dashboard.StillComing = false;
	var PopupVisible = false;

	// Find big popup gem container element if it exists..

	var el1, el2, el3;
	if (typeof Array.filter == 'function') { // legacy browsers
		el1 = ByCl('primarytitlebar');
		el2 = ByCl('gemContainer');
		el3 = Array.filter(el2, function (elem) { return Array.indexOf(el1, elem.parentNode) > -1; });
	}
	else {
		el1 = Object.values(ByCl('primarytitlebar'));
		el2 = Object.values(ByCl('gemContainer'));
		el3 = el2.filter(function (elem) { return el1.indexOf(elem.parentNode) > -1; });
	}

	for (var e = 0; e < el3.length; e++) {
		PopupVisible = true;
		GemContainer = el3[e];
		if (!Dashboard.Incoming) SaveGemHTML2 = GemContainer.innerHTML;
	}

	if (ChampionDelayer > 0) {
		ChampionDelayer--
	}

	if (!PopupVisible) { // override main screen gem container
		for (var e = 0; e < el2.length; e++) {
			GemContainer = el2[e];
			if (!Dashboard.Incoming) SaveGemHTML = GemContainer.innerHTML;
			GemContainer.style.height = 40 + 'px';
			GemContainer.style.marginTop = 2 + 'px';
			GemContainer.id = 'btGemContainer';
			break;
		}
	}

	CanNotify = ById('btGemContainer');

	for (n in inc) {
		var a = inc[n];
		if (!a.score) continue;
		if (a.marchType == null) continue; // bogus march (returning scouts)
		if (a.arrivalTime >= 0 && (a.arrivalTime < unixTime())) {
			continue; // don't display arrival times already happened
		}
		Dashboard.StillComing = true;
		if ((a.arrivalTime >= 0 && (a.arrivalTime < soonest.arrivalTime)) || (soonest.arrivalTime == -1)) {
			soonest = a;
			if (!soonest.arrivalTime) soonest.arrivalTime = -1;
		}
		if (a.arrivalTime >= 0) {
			if (a.arrivalTime - unixTime() < 2) { // auto-replace defending troops
				if (Seed.citystats["city" + a.toCityId].gate != 0) { // only do this if defending
					// save defending unit configuration
					if (Options.DashboardOptions.ReplaceDefendingTroops[Cities.byID[a.toCityId].idx] && SelectiveDefending) {
						Dashboard.AttackedCity = a.toCityId;
						Dashboard.StoreDefendingTroops(Dashboard.AttackedCity);
					}
					setTimeout(function () { Dashboard.ForceTries = 0; Dashboard.ForceUpdateSeed(); }, 3000); // force update defending troops immediately after attacks land
				}
			}
			if (a.marchType == 4) { // set champ on attack only
				soonestattack = true;
				var changeok = (Options.TowerOptions && Options.TowerOptions.SaveCityState[a.toCityId] && Options.TowerOptions.SaveCityState[a.toCityId].ChangeChampion); // only if tower alerted
				if (Options.TowerOptions.ChangeChamp && changeok && a.arrivalTime - unixTime() <= parseIntNan(Options.TowerOptions.ChampTime)) { // auto-assign champion
					if (ChampionDelayer == 0) {
						var currChamp = getCityChampion(a.toCityId).championId;
						if (Options.TowerOptions.ChampId != 0 && currChamp != Options.TowerOptions.ChampId && (currChamp == 0 || !Options.TowerOptions.ChampNoChamp)) {
							if (getChampionStatus(Options.TowerOptions.ChampId) == "10") {
								actionLog('Champion is marching - Cannot assign', 'TOWER');
							}
							else {
								if (currChamp != 0 && getChampionStatus(currChamp) == "10") {
									actionLog(Cities.byID[a.toCityId].name + ': Current Champion is marching - Cannot unassign', 'TOWER');
								}
								else {
									actionLog(Cities.byID[a.toCityId].name + ': Assigning Champion', 'TOWER');
									SwitchChampion(a.toCityId, Options.TowerOptions.ChampId);
								}
							}
							ChampionDelayer = 3; // only try every 3 seconds
						}
					}
				}
			}
		}
		if (soonest.arrivalTime >= 0 && soonestattack) {
			break;
		}
	}

	if (Dashboard.StillComing) {
		if (soonest.marchType && (soonest.marchType == 3)) atype = '<img style="border:2px ridge #00A;width:15px;height:15px;" src=' + ScoutImage + '>';
		else atype = '<img style="border:2px ridge #A00;width:15px;height:15px;" src=' + AttackImage + '>';
		to = Cities.byID[soonest.toCityId];
		if (to && to.tileId == soonest.toTileId) name = to.name;
		else name = "Wilderness";

		if (soonest.arrivalTime != -1) atime = CM.TimeFormatter.format(parseInt(soonest.arrivalTime - unixTime()));
		else atime = '??????';
		if (soonest.pid && Seed.players['u' + soonest.pid]) { who = Seed.players['u' + soonest.pid].n; bywho = ' by ' + MonitorLink(soonest.pid, who, "AlertLink"); }
		else { bywho = '&nbsp;&nbsp;(Upgrade WatchTower)'; }

		msgcontainer = '<div class="textContainer" style="margin-left:-10px;padding-top:0px;">';
		msglink1 = '<a class="AlertLink" id='
		msglink2 = '>';
		msglink3 = '</a>';
		msgtable = '<div class="AlertStyle"><table border=0><tr><td class="AlertContent"><div style="text-align:center;width:86px">&nbsp;&nbsp;' + atime + '</div></td><td class="AlertContent" style="padding-top:3px;">' + atype + '</td><td class="AlertContent"><div style="color:#ecddc1;text-shadow: 0px 0px 15px #000;">';
		msgend = '</div></td></tr></table></div>';
		if (Options.OverrideAttackAlert) {
			if (CanNotify) {
				ById('btGemContainer').innerHTML = msgcontainer + msgtable + msglink1 + 'btAlertIncoming' + msglink2 + name + msglink3 + msgend + '</div><center>' + bywho + '</center>';
				ById('btGemContainer').style.display = 'block';
				ById('btAlertIncoming').addEventListener('click', function () { Dashboard.show(to) }, false);
				jQuery('.alliance_patch').hide();
			}
			if (PopupVisible) {
				GemContainer.innerHTML = msgcontainer + msgtable + msglink1 + 'btAlertIncoming2' + msglink2 + name + msglink3 + msgend + '</div>';
				GemContainer.style.width = 250 + 'px';
				ById('btAlertIncoming2').addEventListener('click', function () { Dashboard.show(to) }, false);
			}
		}
	}

	if (Dashboard.Incoming && !Dashboard.StillComing) {
		if (Options.OverrideAttackAlert) {
			if (CanNotify) {
				ById('btGemContainer').innerHTML = SaveGemHTML;
				if (jQuery('#ahqbutton').hasClass('sel')) {
					ById('btGemContainer').style.display = 'none';
					jQuery('.alliance_patch').show();
				}
			}
			if (PopupVisible) {
				GemContainer.innerHTML = SaveGemHTML2;
			}
		}
	}

	Dashboard.Incoming = Dashboard.StillComing;

	// check for city incoming

	if (popDash && (Dashboard.CurrentCityId != 0)) {
		var citysoonest = {};
		citysoonest.arrivalTime = -1;

		Dashboard.CityStillComing = false;

		for (n in inc) {
			var a = inc[n];
			if (!a.score) continue;
			if (a.arrivalTime >= 0 && (a.arrivalTime < unixTime())) continue; // don't display arrival times already happened
			if (inc[n].toCityId == Dashboard.CurrentCityId) {
				Dashboard.CityStillComing = true;
				if ((a.arrivalTime >= 0 && (a.arrivalTime < citysoonest.arrivalTime)) || (citysoonest.arrivalTime == -1)) {
					citysoonest = a;
					if (!citysoonest.arrivalTime) citysoonest.arrivalTime = -1;
					if (citysoonest.arrivalTime > 0) break;
				}
			}
		}

		if (Dashboard.CityStillComing) {
			if (citysoonest.arrivalTime != -1) atime = CM.TimeFormatter.format(parseInt(citysoonest.arrivalTime - unixTime()));
			else atime = '??????';
			msgcontainer = '<div class="textContainer" style="margin-right:-20px;padding-top:0px;">';
			msgtable = '<div class="AlertStyle" style="text-align:center;width:110px"><table border=0><tr><td class="AlertContent"><div style="text-align:center;width:86px">&nbsp;' + atime;
			msgend = '</div></td></tr></table></div>';
			ById('btCityAlert').innerHTML = msgcontainer + msgtable + msgend + '</div>';
		}

		if (Dashboard.CityIncoming && !Dashboard.CityStillComing) {
			ById('btCityAlert').innerHTML = "";
		}

		Dashboard.CityIncoming = Dashboard.CityStillComing;
	}
}

function Copy_Local_ATKP(cid, mid) {
	var now = unixTime();
	if (Seed.queue_atkp[cid][mid].marchStatus == 0) return;
	if (!local_atkp[mid] || (Seed.queue_atkp[cid][mid].marchUnixTime != local_atkp[mid].marchUnixTime) || (Seed.queue_atkp[cid][mid].returnUnixTime != local_atkp[mid].returnUnixTime)) { // add new march, or newly recalled march
		var march = new Object();
		for (var p in Seed.queue_atkp[cid][mid]) {
			march[p] = Seed.queue_atkp[cid][mid][p];
		}
		local_atkp[mid] = march;
		local_atkp[mid].marchCityId = cid.split("city")[1]; // from city
		if (!local_atkp[mid].marchId) {
			local_atkp[mid].marchId = mid.split("m")[1]; // march id
		}
		local_atkp[mid].btIncomplete = true;
		local_atkp[mid].btRequestSent = 0;
	}

	var destinationUnixTime = local_atkp[mid].destinationUnixTime - now;
	var returnUnixTime = local_atkp[mid].returnUnixTime - now;
	var marchStatus = parseInt(local_atkp[mid].marchStatus);
	if (destinationUnixTime < 0 && marchStatus != 2 && marchStatus != 8 && marchStatus != 7 && marchStatus != 0 && returnUnixTime > 0) { // refresh return journey
		local_atkp[mid].btIncomplete = true; // force a march refresh
	}

	if (local_atkp[mid].btIncomplete == true && Options.FetchMarchInfo) {
		if (local_atkp[mid].btRequestSent > 0) {
			local_atkp[mid].btRequestSent = local_atkp[mid].btRequestSent - 1;
		}
		else {
			local_atkp[mid].btRequestSent = 5; // delay any further requests for 5 seconds
			setTimeout(UpdateMarch, 2000, local_atkp[mid].marchCityId, local_atkp[mid].marchId); // 2 sec delay on this
		}
	}
}

function Copy_Local_ATKINC(mid) {
	if (!local_atkinc[mid] || (Seed.queue_atkinc[mid].marchUnixTime != local_atkinc[mid].marchUnixTime)) { // new march
		var march = new Object();
		for (var p in Seed.queue_atkinc[mid]) {
			march[p] = Seed.queue_atkinc[mid][p];
		}
		local_atkinc[mid] = march;
		local_atkinc[mid].btIncomplete = true;
		local_atkinc[mid].btRequestSent = 0;
		if (!local_atkinc[mid].marchId) {
			local_atkinc[mid].marchId = mid.split("m")[1]; // march id
		}
	}

	if (local_atkinc[mid].score) {
		// build an array of cities under attack
		var to = Cities.byID[local_atkinc[mid].toCityId];
		if (to) {
			if (incCity.indexOf(to.idx) < 0) incCity.push(to.idx);
		}
	}

	if (local_atkinc[mid].btIncomplete == true && Options.FetchMarchInfo) {
		if (local_atkinc[mid].btRequestSent > 0) {
			local_atkinc[mid].btRequestSent = local_atkinc[mid].btRequestSent - 1;
		}
		else {
			local_atkinc[mid].btRequestSent = 5; // delay any further requests for 5 seconds
			setTimeout(UpdateIncomingMarch, 2000, local_atkinc[mid].marchId); // 2 sec delay on this
		}
	}
}
