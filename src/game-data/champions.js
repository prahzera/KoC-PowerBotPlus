function CardMight(throne_item, champ) {
	if (champ) {
		if (!throne_item.quality) throne_item.quality = throne_item.rarity;
		var F = CE_MIGHT_RARITY_MAP || {};
		var H = CE_MIGHT_LEVEL_MAP || {};
		var G = F[throne_item.quality] && F[throne_item.quality].might ? +F[throne_item.quality].might : 0;
		var E = H[throne_item.level] && H[throne_item.level].might ? +H[throne_item.level].might : 0;
		return Math.round((G + E));
	}
	else {
		var JewelBonus = 1;
		if (throne_item.jewel && throne_item.jewel.valid) {
			switch (throne_item.jewel.quality) {
				case 1: JewelBonus = 1.05; break;
				case 2: JewelBonus = 1.1; break;
				case 3: JewelBonus = 1.15; break;
				case 4: JewelBonus = 1.25; break;
				case 5: JewelBonus = 1.33; break;
				default: break;
			}
		}
		var J = uW.cm.thronestats.mightByLevel || {};
		var ah = uW.cm.thronestats.mightByQuality || {};
		var aj = ah[throne_item.quality].Might || 0;
		return Math.round((aj + J[throne_item.level].Might) * JewelBonus);
	}
}

function CardQuality(quality, unique) {
	var retval;
	var unique = unique || 0;
	if (unique > 0) { retval = uW.g_js_strings.throneRoom.unique; }
	else { retval = strQuality(quality); }
	return retval;
};

function strQuality(b) {
	var a;
	switch (b) {
		case 0: a = uW.g_js_strings.throneRoom.simple; break;
		case 1: a = uW.g_js_strings.throneRoom.common; break;
		case 2: a = uW.g_js_strings.throneRoom.uncommon; break;
		case 3: a = uW.g_js_strings.throneRoom.rare; break;
		case 4: a = uW.g_js_strings.throneRoom.epic; break;
		case 5: a = uW.g_js_strings.throneRoom.wondrous; break;
		case 6: a = uW.g_js_strings.throneRoom.miraculous; break;
		default: a = uW.g_js_strings.throneRoom.simple; break;
	}
	return a
};

function SwitchChampion(cityId, champId, notify) {
	var cindex = -1;
	var oldcity = 0;
	for (var y in Seed.champion.champions) {
		chkchamp = Seed.champion.champions[y];
		if (chkchamp.assignedCity && !Cities.byID[chkchamp.assignedCity]) { chkchamp.assignedCity = 0; }
		if (chkchamp.championId) {
			if (chkchamp.championId == champId) {
				cindex = y;
				oldcity = chkchamp.assignedCity;
				break;
			}
		}
	}
	if (cindex < 0) return;
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.champid = champId;
	params.cid0 = oldcity;
	params.cid = cityId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/assignChampion.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				if (cityId != 0) {
					for (var c = 0; c < Seed.champion.champions.length; c++) {
						if (Seed.champion.champions[c].assignedCity == cityId) {
							Seed.champion.champions[c].assignedCity = 0;
						}
					}
				}
				Seed.champion.champions[cindex].assignedCity = cityId;
				SetChampionIcon();
			}
			if (notify) { notify(rslt); }
		},
		onFailure: function () { if (notify) { notify({ ok: false }); } }
	}, true); // noretry
};

function SwitchGuardian(cityId, type, notify) {
	var cIndex = Cities.byID[cityId].idx;
	if (type == Seed.guardian[cIndex].type) { return; }

	var level = Seed.guardian[cIndex].cityGuardianLevels[type];
	level = level ? level : 0;
	if (level == 0) { return; }

	var params = uW.Object.clone(uW.g_ajaxparams);
	params.ctrl = "Guardian";
	params.action = "summon";
	params.cityId = cityId;
	params.type = type;

	new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				var g = CM.guardianModalModel.gObj();
				g.summonGuardian = uWCloneInto({
					summonFinishTime: parseInt(rslt.summonFinishTime),
					level: rslt.summonGuardian.cl0,
					type: rslt.summonGuardian.type,
					upgrading: false
				});
				uW.seed.guardian[cIndex].type = type;
				uW.seed.guardian[cIndex].level = rslt.summonGuardian.cl0;
				var GType = 0;
				switch (type) {
					case "wood": GType = 50; break;
					case "ore": GType = 51; break;
					case "food": GType = 52; break;
					case "stone": GType = 53; break;
				}
				uW.seed.buildings["city" + cityId].pos500[0] = GType;
				var time = parseInt(rslt.summonFinishTime) - unixTime();
				setTimeout(function () {
					uW.seed.buildings["city" + cityId].pos500[0] = GType;
					uW.seed.guardian[cIndex].type = type;
					uW.seed.guardian[cIndex].level = rslt.summonGuardian.cl0;
				}, (time * 1000));
				guardianFailures = 0;
				if (notify) notify(cityId, type, true, rslt.summonFinishTime);
			}
			else { // retry?
				guardianFailures++;
				actionLog(Cities.byID[cityId].name + ": Guardian change failed. Error code: " + rslt.error_code, 'GENERAL');
				// try again in 2 seconds
				if (guardianFailures <= 3) {
					setTimeout(function () { SwitchGuardian(cityId, type, notify) }, 2000);
				}
				else {
					guardianFailures = 0;
					if (notify) notify(cityId, type, false);
				}
			}
		},
		onFailure: function () {
			actionLog(Cities.byID[cityId].name + ": Guardian change server error", 'GENERAL');
			guardianFailures = 0;
			if (notify) notify(cityId, type, false);
		}
	}, true) // noretry
};
