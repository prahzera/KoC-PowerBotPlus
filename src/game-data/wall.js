function getWallInfo(cityId, objOut) {
	objOut.wallSpaceUsed = 0;
	objOut.fieldSpaceUsed = 0;
	objOut.wallSpaceQueued = 0;
	objOut.fieldSpaceQueued = 0;
	objOut.wallLevel = 0;
	objOut.wallSpace = 0;
	objOut.fieldSpace = 0;
	objOut.slotsBusy = 0;
	var b = Seed.buildings["city" + cityId];
	if (!b || b.pos1 == null) return;
	objOut.wallLevel = parseInt(b.pos1[1]);
	var spots = 0;
	for (var i = 1; i < (objOut.wallLevel + 1); i++) { spots += (i * 1500); }
	if (objOut.wallLevel == 13) spots += 3500;
	if (objOut.wallLevel == 14) spots += 7000;
	if (objOut.wallLevel == 15) spots += 10500;
	if (uW.seed.cityData.city[cityId].isPrestigeCity) {
		if (uW.seed.cityData.city[cityId].prestigeInfo.blessings.indexOf(307) != -1) spots = parseInt(spots * 1.15);
	}
	objOut.wallSpace = spots;
	objOut.fieldSpace = spots;
	var fort = Seed.fortifications["city" + cityId];
	for (var k in fort) {
		var id = parseInt(k.substr(4));
		if (id < 60 || id == 63) { objOut.wallSpaceUsed += parseInt(uW.fortstats["unt" + id][5]) * parseInt(fort[k]); }
		else { objOut.fieldSpaceUsed += parseInt(uW.fortstats["unt" + id][5]) * parseInt(fort[k]); }
	}
	var q = Seed.queue_fort["city" + cityId];
	objOut.slotsBusy = q.length;
	if (q != null && q.length > 0) {
		for (var i = 0; i < q.length; i++) {
			if (q[i][0] < 60 || q[i][0] == 63) { objOut.wallSpaceQueued += parseInt(uW.fortstats["unt" + q[i][0]][5]) * parseInt(q[i][1]); }
			else { objOut.fieldSpaceQueued += parseInt(uW.fortstats["unt" + q[i][0]][5]) * parseInt(q[i][1]); }
		}
	}
}
