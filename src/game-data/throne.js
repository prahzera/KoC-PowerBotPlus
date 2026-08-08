function equippedthronestats(stat_id) {
	var current_slot = Seed.throne.activeSlot;
	var total = 0;
	for (var k = 0; k < Seed.throne.slotEquip[current_slot].length; k++) {
		var item_id = Seed.throne.slotEquip[current_slot][k];
		for (var O in uW.kocThroneItems[item_id]["effects"]) {
			var i = +(O.split("slot")[1]);
			var id = uW.kocThroneItems[item_id]["effects"]["slot" + i]["id"];
			if (id == stat_id) {
				var Current = getTRSlotStat(uW.kocThroneItems[item_id], id, i);
				if (i <= parseInt(uW.kocThroneItems[item_id]["quality"])) {
					total += parseIntNan(Current);
				}
			}
		}
	}
	return total;
}

function GenerateTRPresetStats(slot) {
	var StatEffects = [];
	for (var k in uW.cm.thronestats.tiers) StatEffects[k] = 0;
	for (var k in uW.kocThroneItems) {
		for (var ii = 0; ii < Seed.throne.slotEquip[slot].length; ii++) {
			if (Seed.throne.slotEquip[slot][ii] == uW.kocThroneItems[k].id) {
				for (var O in uW.kocThroneItems[k]["effects"]) {
					var i = +(O.split("slot")[1]);
					var id = uW.kocThroneItems[k]["effects"]["slot" + i]["id"];
					Current = getTRSlotStat(uW.kocThroneItems[k], id, i);
					if (i <= parseInt(uW.kocThroneItems[k].quality)) {
						if (CompositeEffects.hasOwnProperty(id)) {
							var Composite = CompositeEffects[id]
							for (var e = 0; e < Composite.length; e++) {
								StatEffects[Composite[e]] += Current;
							}
						}
						else {
							StatEffects[id] += Current;
						}
					}
				}
			}
		}
	}
	return StatEffects;
}

function GenerateTRPresetTiers(slot) {
	var Tiers = [];
	for (var k in uW.cm.thronestats.tiers) Tiers[k] = 0;
	for (var k in uW.kocThroneItems) {
		for (var ii = 0; ii < Seed.throne.slotEquip[slot].length; ii++) {
			if (Seed.throne.slotEquip[slot][ii] == uW.kocThroneItems[k].id) {
				for (var O in uW.kocThroneItems[k]["effects"]) {
					var i = +(O.split("slot")[1]);
					var id = uW.kocThroneItems[k]["effects"]["slot" + i]["id"];
					var tier = uW.kocThroneItems[k]["effects"]["slot" + i]["tier"];
					Tiers[id] = tier;
				}
			}
		}
	}
	return Tiers;
}

function getTRSlotStat(y, id, i) {
	var Current = 0;
	var tier = parseInt(y["effects"]["slot" + i]["tier"]);
	var level = y["level"];
	var p = uW.cm.thronestats.tiers[id][tier];
	while (!p && (tier > 0)) { tier--; p = uW.cm.thronestats.tiers[id][tier]; }
	if (p) { // can't find stats for tier
		var base = +p.base;
		var growth = +p.growth;
		if (y["effects"]["slot" + i].fromJewel && (level > uW.cm.thronestats.jewelGrowthLimit[y["effects"]["slot" + i].quality])) {
			level = uW.cm.thronestats.jewelGrowthLimit[y["effects"]["slot" + i].quality]
		}
		Current = Number(base + ((level * level + level) * growth * 0.5));
	}
	return Current;
}

function getCHSlotStat(N, level) {
	var percent = 0;
	tier = parseInt(N.tier);
	var p = ChampionStatTiers[N.id][tier];
	while (!p && (tier > 0)) { tier--; p = ChampionStatTiers[N.id][tier]; }
	if (p) { // can't find stats for tier
		var base = +p.base || 0;
		var growth = +p.growth || 0;
		percent = Number(base + ((level * level + level) * growth * 0.5));
		if (N.id >= 300) {
			percent = Number(base + (level * growth));
			if (N.id < 400) percent = percent * 100;
		}
		var wholeNumber = false;
		if (Math.round(parseFloat(percent)) == parseFloat(percent)) wholeNumber = true;
		percent = (percent > 0) ? percent : +percent;
		if (wholeNumber)
			percent = parseFloat(percent).toFixed(0);
		else
			percent = parseFloat(percent).toFixed(2);
	}
	return percent;
}

function getChampCappedValue(eff, val) {
	var effkey = eff + ",1"; // tier 1
	var capmax = CE_EFFECT_TIERS[effkey]["Max"];
	var capmin = CE_EFFECT_TIERS[effkey]["Min"];
	//	if (!(capmax == 0 && capmin == 0)) {
	//		return Math.max(Math.min(capmax, val), capmin);
	//	}
	return val;
}
