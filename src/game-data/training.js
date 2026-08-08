function getTrainTime(n, p, cid) {
	if (p < 1) { return 0; }
	var Buildings = getCityBuildings(cid);
	var faux = 0;
	var uc = uW.unitcost["unt" + n];
	if (matTypeof(uc[8]) == 'object') {
		for (var k in uc[8]) {
			var b = Buildings[k.substr(1)];
			if (b.maxLevel < uc[8][k][1]) {
				faux = 1;
				break;
			}
		}
	}
	if (matTypeof(uc[9]) == 'object') {
		for (var k in uc[9]) {
			if (parseInt(Seed.tech['tch' + k.substr(1)]) < uc[9][k][1]) {
				faux = 1;
				break;
			}
		}
	}

	if (faux) return 0;

	var h = +(uW.unitcost["unt" + n][7]) * p,
		c,
		f = {},
		g = Seed.buildings["city" + cid],
		b = {},
		e = Seed.knights["city" + cid],
		l,
		q = Seed.leaders["city" + cid];
	f.barracks = 0;
	f.workshop = 0;
	f.stable = 0;
	f.tech = 0;
	f.knight = 0;
	f.ultimate = 0;
	var prestigeType = Seed.cityData.city[cid].prestigeInfo.prestigeType;
	jQuery.each(g, function (v, u) {
		u.id = +(u[0]);
		u.level = +(u[1]);
		var rare = (CM.BarracksUnitsTypeMap.isUnitType(parseInt(n), "rare"));
		var pt = ((parseInt(n) == 13 && prestigeType == 1) || (parseInt(n) == 14 && prestigeType == 2) || (parseInt(n) == 15 && prestigeType == 3));
		var t = (parseInt(n) == 13 || parseInt(n) == 14 || parseInt(n) == 15);
		u.isPrestige = (parseInt(u[2]) >= 100 && parseInt(u[2]) <= 105);
		if ((u.id === 13 || u.id === 22 || u.id === 24 || u.id === 26) && u.level > 0) {
			if ((t && pt && u.isPrestige && !rare) || (!t && !u.isPrestige && !rare)) {
				f.barracks += (u.level + 9)
			}
		}
		if (u.id === 16 && u.level > 0) {
			if (+(n) >= 9 && +(n) < 13) {
				f.workshop = u.level
			}
		}
		if (u.id === 17 && u.level > f.stable) {
			if (+(n) >= 7 && +(n) < 13) {
				f.stable = u.level
			}
		}
	});
	c = f.barracks / 10;
	h = Math.max(1, Math.ceil(h / c));
	c = 1;
	if (e) {
		l = e["knt" + q.combatKnightId];
		if (l) {
			f.knight = (+ (l.combatBoostExpireUnixtime) - uW.unixtime() > 0) ? (l.combat * 1.25) : l.combat
		} else {
			f.knight = 0
		}
	}
	if (Seed.tech) {
		f.tech = Seed.tech.tch5
	}
	f.ultimate = f.workshop + f.stable + f.tech;
	c = c * (1 + (0.1 * f.ultimate) + (0.005 * f.knight));
	var d = CM.ThroneController.getBoundedEffect(77);
	c = c * (1 + (d / 100));
	if (CM.WorldSettings.isOn("GUARDIAN_MARCH_EFFECT")) {
		var j = getStoneTrainingSpeedBonus(cid);
		c = c * (1 + j)
	}
	h = Math.max(1, Math.ceil(h / c));
	if (CM.PrestigeModel.isPrestige(cid)) {
		var a = CM.PrestigeModel.getPrestigeLevel(cid);
		if (a > 0) {
			var m = CM.WorldSettings.getSetting("ASCENSION_BARRACKS_BOOST"),
				k = JSON.parse(m),
				o = k.values[a - 1][1],
				i = parseFloat(o);
			h = Math.ceil(h * i)
		}
	}

	var u = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().DEATH_FROM_AFAR, cid);
	var r = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().DARK_INQUIRY, cid);
	var j = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().STRENGTH_OF_THE_PACK, cid);
	var l = CM.BlessingSystemModel.isBlessingActive(CM.BlessingSystemModel.getBlessing().REINFORCED_PLATING, cid);
	if (n == 6 && u) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().DEATH_FROM_AFAR, cid, uWCloneInto({}))))
	}
	if (n == 14 && r) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().DARK_INQUIRY, cid, uWCloneInto({}))))
	}
	if (n == 13 && j) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().STRENGTH_OF_THE_PACK, cid, uWCloneInto({}))))
	}
	if (n == 15 && l) {
		h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().REINFORCED_PLATING, cid, uWCloneInto({}))))
	}

	h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().EXPEDITED_SENTENCING, cid, uWCloneInto({
		traintime: true,
		unitid: n
	}))));
	h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().TO_THE_FRONT_LINES, cid, uWCloneInto({
		unitid: n
	}))));
	h = Math.ceil(h - (h * CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().PRIORITIZED_CONSTRUCTION, cid, uWCloneInto({
		unittype: n
	}))));
	if (CM.VipModel.isActive()) {
		var s = CM.VipModel.getBoostValue("benefitTraining");
		h = Math.ceil(h - (h * (s / 100)))
	}
	return h
}

function getStoneTrainingSpeedBonus(cityId) {
	var c = { 0: 0, 1: 5, 2: 5, 3: 10, 4: 10, 5: 15, 6: 15, 7: 20, 8: 25, 9: 35, 10: 70, 11: 130, 12: 250 };
	var idx = Cities.byID[cityId].idx;
	var stonelevel = (Seed.guardian[idx].cityGuardianLevels["stone"] ? Seed.guardian[idx].cityGuardianLevels["stone"] : 0);
	var x = c[stonelevel] / 100;
	var v = (Seed.guardian[idx].guardianCount == 4);
	var A = Seed.guardian[idx].type == "stone";
	var z = 0;
	var w = (CM.ThroneController.getBoundedEffect(106) / 100);
	var r = 1 + (CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().EMPOWERED_STONE, cityId) / 10);
	var y = 0;
	if (A && v) {
		z = 1.5;
		y = w;
	}
	if (A && !v) {
		z = 1;
		y = w;
	}
	if (!A && v) {
		z = 0.5;
		r = 1;
	}
	if (!A && !v) {
		z = 1;
		r = 1;
	}
	var u = (x * r * z) + y;
	return u
}
