function UpdateMarch(cityId, marchId) {
	if (!Seed.queue_atkp["city" + cityId]["m" + marchId]) { return; }
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.rid = marchId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.march) {
				var now = unixTime();
				if (Seed.queue_atkp["city" + cityId]["m" + marchId] && Seed.queue_atkp["city" + cityId]["m" + marchId].destinationUnixTime && Seed.queue_atkp["city" + cityId]["m" + marchId].destinationUnixTime < now && rslt.march.marchStatus == 1) {
					logit('Fixing march status...');
					rslt.march.marchStatus = 7;
					Seed.queue_atkp["city" + cityId]["m" + marchId].marchStatus = 7;
				}
				if (local_atkp["m" + marchId]) {
					for (var y in rslt.march) {
						local_atkp["m" + marchId][y] = rslt.march[y];
					}
					local_atkp["m" + marchId].btIncomplete = false;
					// champion on march?
					if (rslt.march.championId && (rslt.march.championId != 0) && !local_atkp["m" + marchId].championInfo) {
						for (var y in Seed.champion.champions) {
							if (Seed.champion.champions[y].championId == rslt.march.championId) {
								marchChamp = {};
								marchChamp.name = Seed.champion.champions[y].name; // lazy. We'll use city stats to show champ data
								local_atkp["m" + marchId].championInfo = marchChamp;
								break;
							}
						}
					}
					if (rslt.march.toPlayerId && (rslt.march.toPlayerId != 0) && !Seed.players["u" + rslt.march.toPlayerId]) {
						updatePlayers(rslt.march.toPlayerId);
					}
				}
			}
		},
		onFailure: function () {
			local_atkp["m" + marchId].btRequestSent = 0; // try again
		}
	}, true); // no retry
}

function UpdateIncomingMarch(marchId) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.rid = marchId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (local_atkinc["m" + marchId]) {
				for (var y in rslt.march) {
					local_atkinc["m" + marchId][y] = rslt.march[y];
				}
				local_atkinc["m" + marchId].btIncomplete = false;
			}
		},
		onFailure: function () {
			local_atkinc["m" + marchId].btRequestSent = 0; // try again
		}
	}, true); // no retry
}

function updatePlayers(uid) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.uid = uid;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rsltInfo) {
			if (!rsltInfo.ok) { return; }
			NewPlayer = {};
			NewPlayer.n = rsltInfo.userInfo[0].name;
			NewPlayer.t = rsltInfo.userInfo[0].title;
			NewPlayer.m = rsltInfo.userInfo[0].might;
			NewPlayer.a = rsltInfo.userInfo[0].allianceId;
			Seed.players["u" + uid] = uWCloneInto(NewPlayer);
		},
	}, true);
}
