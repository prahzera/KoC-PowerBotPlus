function distance(d, f, c, e) {
	var a = 750;
	var g = a / 2;
	var b = Math.abs(c - d);
	if (b > g)
		b = a - b;
	var h = Math.abs(e - f);
	if (h > g)
		h = a - h;
	return Math.round(100 * Math.sqrt(b * b + h * h)) / 100;
};

function CalculateTileId(x, y) {
	var prov = '';
	for (var i in Provinces) {
		if (x >= Provinces[i].x && x < Provinces[i].x + 150 && y >= Provinces[i].y && y < Provinces[i].y + 150) {
			prov = i;
			break;
		}
	}
	if (prov == '') return 0;
	var pid = prov.split("p")[1];
	var xx = x - Provinces[prov].x;
	var yy = y - Provinces[prov].y;
	var tid = TileOrigin + ((pid - 1) * 22500) + (xx * 150) + yy + 1;
	return tid;
}

function getMaxWilds(cityId) {
	var castle = parseInt(Seed.buildings['city' + cityId].pos0[1]);
	if (castle == 11) castle = 12;
	else if (castle == 12) castle = 14;
	else if (castle == 13) castle = 16;
	else if (castle == 14) castle = 18;
	else if (castle == 15) castle = 20;
	return castle;
}
