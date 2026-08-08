function GetDisplayName() {
	var DisplayName = ById('topnavDisplayName');
	if (DisplayName) { DisplayName = DisplayName.innerHTML; }
	else { DisplayName = null; }
	return DisplayName
}

function setCities() {
	Cities.numCities = Seed.cities.length;
	Cities.cities = [];
	Cities.byID = {};
	for (var i = 0; i < Cities.numCities; i++) {
		var city = {};
		city.idx = i;
		city.id = parseInt(Seed.cities[i][0]);
		city.name = Seed.cities[i][1];
		city.x = parseInt(Seed.cities[i][2]);
		city.y = parseInt(Seed.cities[i][3]);
		city.tileId = parseInt(Seed.cities[i][5]);
		city.provId = parseInt(Seed.cities[i][4]);
		Cities.cities[i] = city;
		Cities.byID[Seed.cities[i][0]] = city;
	}
}

function SelectCity(idx) {
	var l = ById("citysel_" + idx);
	if (l) { uW.citysel_click(l); return true; }
	else return false;
};

function OpenBuilding(idx, bid) {
	SelectCity(idx);
	var c = Seed.buildings["city" + uW.currentcityid],
		b,
		a;
	for (b in c) {
		if (c[b][0] == bid) {
			a = c[b][2];
			break
		}
	}
	if (a) { uW.modal_build(a); return true; }
	else return false;
};

function showBlessings(Bless) {
	var msg = '';
	if (!Bless) return msg;
	var blessings = Bless.split(',');
	for (var y in blessings) {
		var bb = uW.g_js_strings.blessingSystem['blessing_name_' + blessings[y]];
		var bd = uW.g_js_strings.blessingSystem['blessing_description_' + blessings[y]];
		if (bb)
			msg += '<TR><TD><b>' + bb + '</b><br>' + bd + '</td></tr>';
	}
	return msg;
};

function getAscensionValues(cityId) {
	var ret = { isPrestigeCity: false, prestigeLevel: 0, prestigeType: 0, prestigeBuffExpire: 0, blessings: "" };
	if (Seed.cityData.city[cityId].isPrestigeCity) {
		ret.isPrestigeCity = true;
		ret.prestigeLevel = parseIntNan(Seed.cityData.city[cityId].prestigeInfo.prestigeLevel);
		ret.prestigeType = parseIntNan(Seed.cityData.city[cityId].prestigeInfo.prestigeType);
		ret.prestigeBuffExpire = Seed.cityData.city[cityId].prestigeInfo.prestigeBuffExpire;
		ret.blessings = Seed.cityData.city[cityId].prestigeInfo.blessings.slice();
	}
	return ret;
};

function getSpellData(cityId) {
	var ret = { faction: "", spellavailable: false, cooldownactive: false, cooldown: 0 };
	var ascended = getAscensionValues(cityId);
	if (ascended.isPrestigeCity) {
		ret.faction = ascended.prestigeType;
		ret.spellavailable = (ascended.blessings.indexOf(SpellBlessings[ret.faction]) != -1);
		ret.cooldownactive = (Seed.cityData.city[cityId].spells && Seed.cityData.city[cityId].spells[SpellTypes[ret.faction]] && parseInt(Seed.cityData.city[cityId].spells[SpellTypes[ret.faction]].endDate) > uW.unixtime());
		if (ret.spellavailable && ret.cooldownactive) {
			ret.cooldown = uW.timestr(parseInt(Seed.cityData.city[cityId].spells[SpellTypes[ret.faction]].endDate) - uW.unixtime());
		}
	}
	return ret;
};

function getFactionBonus(slot) {
	var equippeditems = Seed.throne.slotEquip[slot];
	var EQ = {};
	jQuery.each(equippeditems, function (A, B) {
		x = uW.kocThroneItems[B];
		EQ[x.id] = x;
	});
	return CM.ThroneController.hasFactionBonus(uWCloneInto(EQ));
}

function getTREffectStyle(i) {
	var ret = {};
	ret.LineStyle = '<span style="color:#888;">';
	ret.EndStyle = '</span>';
	if (AttackEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#800;">';
	if (DefenceEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#008;">';
	if (LifeEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#088;">';
	if (RangeEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#080;">';
	if (SpeedEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:' + SpeedColour + ';">';
	if (AccuracyEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#f80;">';
	if (OtherCombatEffects.indexOf(parseInt(i)) > -1)
		ret.LineStyle = '<span style="color:#808;">';
	if (GlobalEffects.indexOf(parseInt(i)) > -1) {
		ret.LineStyle = ret.LineStyle + '<strong>';
		ret.EndStyle = '</strong>' + ret.EndStyle;
	}
	if (DebuffEffects.indexOf(parseInt(i)) > -1) {
		ret.LineStyle = ret.LineStyle + '<i>';
		ret.EndStyle = '</i>' + ret.EndStyle;
	}
	return ret;
};

function setTroops() {
	for (var ui in CM.UNIT_TYPES) {
		i = CM.UNIT_TYPES[ui];
		var tt = CM.unitFrontendType[i];
		switch (tt) {
			case "spellcaster":
				SpellCaster.push(i); break;
			case "siege":
				Siege.push(i); break;
			case "horsed":
				Horsed.push(i); break;
			case "ranged":
				Ranged.push(i); break;
			default:
				Infantry.push(i);
		}
		if (TTSort.indexOf(i) == -1) { TTSort.push(i); }
	}
};
