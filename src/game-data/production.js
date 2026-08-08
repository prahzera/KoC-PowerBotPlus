function getResourceProduction(cityId) {
	var ret = [0, 0, 0, 0, 0];
	var now = unixTime();
	var search = 'type==10 || type==11';
	var wilds = [0, 0, 0, 0, 0];
	var w = Seed.wilderness["city" + cityId];
	for (var k in w) {
		var type = parseInt(w[k].tileType);
		if (type == 10 || type == 11)
			wilds[1] += parseInt(w[k].tileLevel);
		else
			wilds[type / 10] += parseInt(w[k].tileLevel);
	}
	knight = 0;
	var s = Seed.knights["city" + cityId];
	if (s) {
		s = s["knt" + Seed.leaders["city" + cityId].resourcefulnessKnightId];
		if (s) {
			var knight = parseInt(s.resourcefulness);
			if (s.resourcefulnessBoostExpireUnixtime > now)
				knight *= 1.25;
		}
	}
	var workerFactor = 1;
	var c = parseInt(Seed.citystats["city" + cityId]["pop"][0]); // Current population
	var w = parseInt(Seed.citystats["city" + cityId]["pop"][3]); // Labor force
	if (w > c)
		workerFactor = c / w;
	for (var i = 1; i < 5; i++) {
		var items = 0;
		if (parseInt(Seed.playerEffects["r" + i + "BstExp"]) > now) {
			items = 0.25;
		}
		var tech = Seed.tech["tch" + i];
		ret[i] = parseInt((Seed.resources["city" + cityId]["rec" + i][2] * (1 + tech / 10 + knight / 100 + items + 0.05 * wilds[i]) * workerFactor + 100));
	}
	return ret;
}
