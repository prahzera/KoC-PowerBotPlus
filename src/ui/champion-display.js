function getChampionStatus(champId) {
	var status = "";
	for (var y in Seed.champion.champions) {
		citychamp = Seed.champion.champions[y];
		if (citychamp.championId == champId) {
			status = citychamp.status || "";
			break;
		}
	}
	return status;
}

function getChampionCity(champId) {
	var cid = 0;
	for (var y in Seed.champion.champions) {
		citychamp = Seed.champion.champions[y];
		if (citychamp.championId == champId) {
			cid = citychamp.assignedCity || 0;
			break;
		}
	}
	return cid;
}

function getCityChampion(cid) {
	var citychamp;
	var gotchamp = false;
	for (var y in Seed.champion.champions) {
		citychamp = Seed.champion.champions[y];
		if (citychamp.assignedCity && citychamp.assignedCity == cid) {
			gotchamp = true;
			break;
		}
	}
	if (gotchamp) { return citychamp; }
	else { return { championId: 0 }; }
}

function SetChampionIcon() {
	var e = ById('maparea_boosts_champion');
	if (!e) {
		e = document.createElement('table');
		e.height = "20";
		e.style.cssFloat = 'left';
		e.style.border = '1px';
		e.style.borderSpacing = '1px';
		e.style.borderCollapse = 'separate';
		e.style.backgroundColor = '#fff';
		e.id = 'maparea_boosts_champion';
		e.className = 'trimg';
		ById('maparea_boosts').appendChild(e);
		ById('maparea_boosts').style.zIndex = '20001';
	}
	var citychamp = getCityChampion(uW.currentcityid);
	if (citychamp.championId) {
		e.style.display = 'block';
		e.innerHTML = '<tr><td id=maparea_boosts_championtd class="xtab trimg" style="padding:0px;"><img style="margin-left:0px;" id=maparea_boosts_champion_image height=18 src="' + ChampImagePrefix + citychamp.avatarId + ChampImageSuffix + '"></td></tr>'

		function FNChampPopup() { uW.btCreateChampionPopUp(e, citychamp.assignedCity, true, null, true); }
		function FNChampClear() { uW.removeTooltip(); }
		ById('maparea_boosts_champion_image').addEventListener('mouseover', FNChampPopup, false);
		ById('maparea_boosts_champion_image').addEventListener('mouseout', FNChampClear, false);
	}
	else {
		e.style.display = 'none';
	}
}

function BuildChampData(champItems, championId) {
	var effectTiers = CE_EFFECT_TIERS;
	var res = {};
	res.equippedchampstats = JSON.parse(JSON.stringify(BaseChamp));
	res.equippedtroopstats = {};
	res.equippedbossstats = {};
	res.SetBonus = {};
	res.SteelHoofCount = 0;
	res.LightBringerCount = 0;
	res.DragonScaleCount = 0;
	res.WildHideCount = 0;
	res.VespersCount = 0;
	res.SilverCount = 0;
	res.WarlockCount = 0;
	res.IceQueenCount = 0;
	res.EagleCount = 0;
	res.DragonWarriorCount = 0;
	res.TestCount = 0;
	res.might = 0;

	for (var y in champItems) { // calculate unique set bonuses
		var item = champItems[y];
		if (item.equippedTo && item.equippedTo == championId) {
			if (!item.quality) item.quality = parseIntNan(item.rarity);
			item.level = parseIntNan(item.level);
			if (SteelHoofItems.indexOf(parseIntNan(item.unique)) !== -1) { res.SteelHoofCount++ }
			if (LightBringerItems.indexOf(parseIntNan(item.unique)) !== -1) { res.LightBringerCount++ }
			if (DragonScaleItems.indexOf(parseIntNan(item.unique)) !== -1) { res.DragonScaleCount++ }
			if (TestItems.indexOf(parseIntNan(item.unique)) !== -1) { res.TestCount++ }
			if (WildHideItems.indexOf(parseIntNan(item.unique)) !== -1) { res.WildHideCount++ }
			if (VespersItems.indexOf(parseIntNan(item.unique)) !== -1) { res.VespersCount++ }
			if (SilverItems.indexOf(parseIntNan(item.unique)) !== -1) { res.SilverCount++ }
			if (WarlocksItems.indexOf(parseIntNan(item.unique)) !== - 1) { res.WarlockCount++ }
			if (IceQueensItems.indexOf(parseIntNan(item.unique)) !== - 1) { res.IceQueenCount++ }
			if (EagleItems.indexOf(parseIntNan(item.unique)) !== - 1) { res.EagleCount++ }
			if (DragonWarriorsItems.indexOf(parseIntNan(item.unique)) !== -1) { res.DragonWarriorCount++ }

			for (var e in item.effects) {
				if (Number(e) <= Number(item.rarity)) {
					var id = item.effects[e].id;
					if (id >= 300 && id < 400) {
						var Set = item.set;
						var tier = item.effects[e].tier;
						if (id == 312) Set = 'U';
						if (id == 313) Set = 'N';
						if (id == 314) Set = 'D';
						if (id == 324) Set = 'U'; //snake and ophidian rings
						var S = effectTiers;
						var P = id + "," + tier
						var TV = S[P];
						while (!TV && (tier > 0)) { tier--; P = id + "," + tier; TV = S[P]; }
						if (TV) {
							var base = +TV.Base || 0;
							var growth = +TV.Growth || 0;
							var level = Number(item.level) || 0;
							percent = Number(base + (level * growth));
							if (!res.SetBonus[Set]) { res.SetBonus[Set] = 0; }
							res.SetBonus[Set] += percent;
						}
					}
				}
			}
		}
	}
	for (var y in champItems) {
		var item = champItems[y];
		if (item.equippedTo && item.equippedTo == championId) {
			if (!item.quality) item.quality = parseIntNan(item.rarity);
			item.level = parseIntNan(item.level);
			res.might += CardMight(item, true);
			for (var e in item.effects) {
				if (Number(e) <= Number(item.rarity)) {
					var id = item.effects[e].id;
					var tier = item.effects[e].tier;
					var S = effectTiers;
					var P = id + "," + tier;
					var TV = S[P];
					while (!TV && (tier > 0)) { tier--; P = id + "," + tier; TV = S[P]; }
					if (TV) {
						var base = +TV.Base || 0;
						var growth = +TV.Growth || 0;
						var level = Number(item.level) || 0;
						var bonus = 0;
						if (id < 300 || id >= 400) {
							bonus = res.SetBonus[item.set] || 0;
							if (item.unique && item.unique != 0 && res.SetBonus['U']) bonus += res.SetBonus['U'];
							if ((!item.unique || item.unique == 0) && res.SetBonus['N']) bonus += res.SetBonus['N'];
							//if (SetBonus['D']) bonus += res.SetBonus['D'];
						}
						var percent = Number(base + ((level * level + level) * growth * 0.5));
						if (id >= 300) {
							percent = Number(base + (level * growth));
						}
						if (id >= 400) {
							if (!res.equippedbossstats[item.unique]) { res.equippedbossstats[item.unique] = {}; }
							if (!res.equippedbossstats[item.unique][id]) { res.equippedbossstats[item.unique][id] = 0; }
							res.equippedbossstats[item.unique][id] += percent + (percent * bonus); // can this apply to boss stats?
						}
						else {
							if (id >= 200) {
								var chAdj = 0;
								if (id == 201 && item.unique && item.unique != 0 && res.VespersCount >= 0) { chAdj = 0.05; }
								if (!res.equippedchampstats[id]) { res.equippedchampstats[id] = 0; }
								res.equippedchampstats[id] += percent + (percent * bonus);
								res.equippedchampstats[id] += (percent * chAdj);
							}
							else {
								if (!res.equippedtroopstats[id]) { res.equippedtroopstats[id] = 0; }
								res.equippedtroopstats[id] += percent;
							}
						}
					}
				}
			}
		}
	}
	return res;
}
