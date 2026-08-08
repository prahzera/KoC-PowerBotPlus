function getDefendStatus(x, y, div, disphide, notify, index, total, progressdiv) {
	if (progressdiv && ById(progressdiv)) ById(progressdiv).outerHTML = '<span id=' + progressdiv + '>' + tx('Checking') + ' ' + (index + 1) + ' ' + uW.g_js_strings.commonstr.of + ' ' + total + '</span>';
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.xcoord = x;
	params.ycoord = y;
	params.currentcityid = uW.currentcityid;
	params.use_champion = false;
	params.knight = 0;
	params.cityId = 0;
	for (var ui in CM.UNIT_TYPES) {
		i = CM.UNIT_TYPES[ui];
		params["u" + i] = 0;
	}
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/ifCityDefending.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok && rslt.ok == "true") {
				if (div) div.innerHTML = '<span class=boldMagenta>*&nbsp;' + tx('DEFENDING') + '&nbsp;*</span>';
			}
			else {
				if (div && disphide) div.innerHTML = '<span>' + tx('Hiding') + '</span>';
			}
			if (notify) notify(rslt, x, y, index);
		},
		onFailure: function () {
			if (notify) notify({ ok: false }, x, y, index);
		},
	});
}

function getAvailableKnights(cityId) {
	var knt = new Array();
	for (var k in Seed.knights['city' + cityId]) {
		var knight = Seed.knights['city' + cityId][k];
		if (knight["knightStatus"] == 1 && Seed.leaders['city' + cityId]["resourcefulnessKnightId"] != knight["knightId"] && Seed.leaders['city' + cityId]["politicsKnightId"] != knight["knightId"] && Seed.leaders['city' + cityId]["combatKnightId"] != knight["knightId"] && Seed.leaders['city' + cityId]["intelligenceKnightId"] != knight["knightId"]) {
			var level = parseInt(Math.sqrt(parseInt(knight["experience"]) / 75)) + 1;
			var unpoints = level - parseInt(knight["skillPointsApplied"]);

			knt.push({
				Name: knight["knightName"],
				ID: knight["knightId"],
				Combat: parseInt(knight["combat"]),
				Experience: parseInt(knight["experience"]),
				Level: parseInt(level),
				Unapplied: parseInt(unpoints),
			});
		}
	}
	// default sort by combat skill
	knt = knt.sort(function sort(a, b) { a = a['Combat']; b = b['Combat']; return a == b ? 0 : (a > b ? -1 : 1); });
	return knt;
}

function ClaimDailyReward() {
	if (Options.LoginReward && (Seed.loginReward.show_today || Seed.loginReward.show_hud)) {
		var h = Seed.loginReward.items || [];
		var i = (~~(1 * Seed.loginReward.consec_days_logon) + 1) || 1;
		var q;
		if (i <= 5) { q = h[i - 1]; }
		else { q = h[5]; }

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.ctrl = "LoginRewards";
		params.action = "claimReward";
		params.feedSent = 0;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				jQuery("#hudThirdContainer").remove();
				if (Seed.loginReward.show_today) CM.ModalManager.closeAll();
				uW.ksoItems[q].add();
				actionLog('Daily Reward Claimed - Day ' + i + ': ' + uW.itemlist['i' + q].name, 'GENERAL');
			},
		}, true); // no retry
	}
}
