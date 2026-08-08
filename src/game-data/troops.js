function getCityTroops(unitId, cityId, countmarching) {
	var NumTroops = 0;
	NumTroops = parseIntNan(Seed.units['city' + cityId]['unt' + unitId]);
	if (SelectiveDefending) { NumTroops += parseIntNan(Seed.defunits['city' + cityId]['unt' + unitId]); }

	if (countmarching) {
		var marching = getMarchInfo(cityId);
		NumTroops += marching.marchUnits[unitId];
	}
	return NumTroops;
}

function getMarchInfo(cityId) {
	var ret = {};

	ret.marchUnits = {};
	ret.returnUnits = {};
	ret.resources = [];
	for (var ui in CM.UNIT_TYPES) {
		var i = CM.UNIT_TYPES[ui];
		ret.marchUnits[i] = 0;
		ret.returnUnits[i] = 0;
	}
	for (var i = 0; i < 5; i++) {
		ret.resources[i] = 0;
	}

	for (var k in Seed.queue_atkp["city" + cityId]) { // each march
		march = Seed.queue_atkp["city" + cityId][k];
		if (typeof (march) == 'object') {
			if (march.marchType == 5) continue; // don't count troops currently being reassigned!!!
			if (march.marchType == 9 && (march.marchStatus == 3 || march.marchStatus == 4 || march.marchStatus == 10)) continue; // don't count troops in stopped or resting raids..

			for (var ui in CM.UNIT_TYPES) {
				var i = CM.UNIT_TYPES[ui];
				ret.marchUnits[i] += parseIntNan(march['unit' + i + 'Count']);
				ret.returnUnits[i] += parseIntNan(march['unit' + i + 'Return']);
			}
			for (var ii = 1; ii < 5; ii++) {
				ret.resources[ii] += parseInt(march['resource' + ii]);
			}
			ret.resources[0] += parseInt(march['gold']);
		}
	}
	return ret;
}
