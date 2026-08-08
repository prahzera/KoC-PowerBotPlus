function getCityBuildings(cityId) {
	var ret = {};
	for (var k in uW.buildingcost) {
		ret[k.split("bdg")[1]] = { count: 0, maxLevel: 0 };
	}

	var b = Seed.buildings['city' + cityId];
	for (var k in b) {
		if (b[k] && matTypeof(b[k]) == "array") {
			if (ret[b[k][0]]) {
				ret[b[k][0]].count++;
				if (parseInt(b[k][1]) > ret[b[k][0]].maxLevel) {
					ret[b[k][0]].maxLevel = parseInt(b[k][1]);
				}
			}
		}
	}
	return ret;
}

function getCityBuilding(cityId, buildingId, unique) {
	var b = Seed.buildings['city' + cityId];
	var ret = { count: 0, maxLevel: 0 };
	for (var k in b) {
		if (b[k] && b[k][0] == buildingId) {
			++ret.count;
			if (parseInt(b[k][1]) > ret.maxLevel)
				ret.maxLevel = parseInt(b[k][1]);
			if (unique) return ret;
		}
	}
	return ret;
}

function getUniqueCityBuilding(cityId, buildingId) {
	return getCityBuilding(cityId, buildingId, true);
}
