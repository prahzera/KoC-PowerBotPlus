function AbandonWild(tileId, xCoord, yCoord, cityId, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.tid = tileId;
	params.x = xCoord;
	params.y = yCoord;
	params.cid = cityId;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/abandonWilderness.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok || rslt.error_code == 401) { // if tile info does not match remove from Seed.wilderness
				if (rslt.returningMarches) {
					var cities = Object.keys(rslt.returningMarches);
					for (var i = 0; i < cities.length; i++) {
						for (var j = 0; j < rslt.returningMarches[cities[i]].length; j++) {
							var cid = cities[i].split("c")[1];
							var mid = rslt.returningMarches[cities[i]][j];
							var march = Seed.queue_atkp["city" + cid]["m" + mid];
							if (march) {
								var marchtime = Math.abs(parseInt(march.destinationUnixTime) - parseInt(march.marchUnixTime));
								var ut = uW.unixtime();
								Seed.queue_atkp["city" + cid]["m" + mid].destinationUnixTime = ut;
								Seed.queue_atkp["city" + cid]["m" + mid].marchUnixTime = ut - marchtime;
								Seed.queue_atkp["city" + cid]["m" + mid].returnUnixTime = ut + marchtime;
								Seed.queue_atkp["city" + cid]["m" + mid].marchStatus = 8
							}
						}
					}
				}
				if (Seed.wilderness["city" + cityId] && Seed.wilderness["city" + cityId]["t" + tileId]) {
					delete Seed.wilderness["city" + cityId]["t" + tileId];
					if (Object.keys(Seed.wilderness["city" + cityId]).length == 0) {
						Seed.wilderness["city" + cityId] = uWCloneInto([]);
					}
				}
				if (rslt.error_code == 401) { // manually force return any supposedly encamped marches.. hopefully will free up knights?
					if (Seed.queue_atkp["city" + cityId] != "") {
						for (var mid in Seed.queue_atkp["city" + cityId]) {
							var m = Seed.queue_atkp["city" + cityId][mid];
							if (m.marchType && m.toXCoord == xCoord && m.toYCoord == yCoord && m.marchStatus == 2) {
								var marchtime = Math.abs(parseInt(m.destinationUnixTime) - parseInt(m.marchUnixTime));
								var ut = uW.unixtime();
								m.destinationUnixTime = ut;
								m.marchUnixTime = ut - marchtime;
								m.returnUnixTime = ut + marchtime;
								m.marchStatus = 8;
							}
						}
					}
				}
				if (notify) { notify(); }
			}
		},
	});
}
