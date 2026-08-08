function fixgamelag() {
	var kfutime = Number(uW.unixtime() + 30);
	for (var city in Seed.queue_atkp) {
		var knighthashX = [];
		if (Seed.queue_atkp[city] != "") {
			for (var march in Seed.queue_atkp[city]) {
				if (Seed.queue_atkp[city][march].marchType) {
					if (!Seed.queue_atkp[city][march].botMarchStatus && Seed.queue_atkp[city][march].marchStatus == 5) {
						if (Seed.queue_atkp[city][march].returnUnixTime < kfutime) {
							actionLog(Cities.byID[String(city).replace(/city/, '')].name + ': Fixing march ' + march, 'MARCH');
							for (var ui in CM.UNIT_TYPES) {
								var i = CM.UNIT_TYPES[ui];
								if (Seed.queue_atkp[city][march]['unit' + i + 'Count'] > 0) {
									if (Seed.queue_atkp[city][march]['unit' + i + 'Return'] == 0 || Seed.queue_atkp[city][march]['unit' + i + 'Return'] == undefined) {
										Seed.queue_atkp[city][march]['unit' + i + 'Return'] = Seed.queue_atkp[city][march]['unit' + i + 'Count'];
									}
								}
							}
							Seed.queue_atkp[city][march].hasUpdated = true;
							Seed.queue_atkp[city][march].marchStatus = 8;
						} else { knighthashX.push(Seed.queue_atkp[city][march].knightId); }
					} else { knighthashX.push(Seed.queue_atkp[city][march].knightId); }
				}
			}
		}
		for (var knight in Seed.knights[city]) {
			if (Seed.knights[city][knight].knightStatus != 1) {
				if (knighthashX.indexOf(Seed.knights[city][knight].knightId) == -1) {
					Seed.knights[city][knight].knightStatus = 1;
					actionLog(Cities.byID[String(city).replace(/city/, '')].name + ': Fixing knight ' + Seed.knights[city][knight].knightName, 'MARCH');
				}
			}
		}
	}
}

var ChampLagFix = {
	LagFix1: null,
	LagFix2: null,
	init: function () {
		t = ChampLagFix;

		try {
			uW.CE_EFFECT_TIERS = uWCloneInto(CE_EFFECT_TIERS);
			uWExportFunction('btGetTierEffects', function (T) {
				var U = +T.id || 0,
					R = +T.tier || 0,
					V = CE_EFFECT_TIERS,
					S = U + "," + R;
				if (!V[S]) {
					if (R > 1) {
						CM.log.error(2, CM.ERROR_TYPE.INFORMATION_MISSING, "Champion equipment tier {tier} doesn't exist for Effect ID {effectId}. Trying the next tier down.".replace("{effectId}", U).replace("{tier}", R));
						return uW.btGetTierEffects({
							id: U,
							tier: R - 1
						})
					} else {
						CM.log.error(1, CM.ERROR_TYPE.INFORMATION_MISSING, "Champion equipment tier doesn't exist for Effect ID {effectId}. All tiers attempted.".replace("{effectId}", U));
						return {}
					}
				}
				return V[S]
			});

			t.LagFix1 = new CalterUwFunc("cm.ChampionManager.getEffectAmount", [['o(U),', 'btGetTierEffects(U),']]);
			t.LagFix2 = new CalterUwFunc("cm.ChampionManager.getEffect", [['L(R,', 'cm.ChampionManager.getEffectAmount(R,'], ['e(R', 'cm.ChampionManager.getEffectName(R']]);
			if (ChampLagFix.isAvailable()) {
				ChampLagFix.setEnable(Options.FixCastleLag);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = ChampLagFix;
		t.LagFix1.setEnable(tf);
		t.LagFix2.setEnable(tf);
	},
	isAvailable: function () {
		var t = ChampLagFix;
		return (t.LagFix1.isAvailable() && t.LagFix2.isAvailable());
	},
};

var CollectGold = {
	colCity: null,
	colHappy: 0,

	init: function () {
		var t = CollectGold;
		for (var c = 0; c < Cities.numCities; c++) {
			if (!Options.lastCollect[Cities.cities[c].id]) {
				Options.lastCollect[Cities.cities[c].id] = 0;
			}
		}
		saveOptions();
	},

	tick: function () {
		var t = CollectGold;
		for (var c = 0; c < Cities.numCities; c++) {
			var city = Cities.cities[c];
			var happy = Seed.citystats['city' + city.id].pop[2];
			var since = unixTime() - Options.lastCollect[city.id];
			if ((happy >= parseIntNan(Options.pbGoldHappy)) && (since > 15 * 60)) { // KoC Restriction 15 mins!
				t.colCity = city;
				t.colHappy = happy;
				t.ajaxCollectGold(city, t.e_ajaxDone);
				break;
			}
		}
	},

	e_ajaxDone: function (rslt) {
		var t = CollectGold;
		Options.lastCollect[t.colCity.id] = unixTime();
		saveOptions();
		if (rslt.ok) {
			actionLog(t.colCity.name + ': Collected ' + rslt.goldGained + ' gold (Happiness was ' + t.colHappy + '%)', 'GOLD');
		}
		else { actionLog(t.colCity.name + ': Error collecting gold (' + rslt.errorMsg + ')', 'GOLD'); }
	},

	ajaxCollectGold: function (city, notify) {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = city.id;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/levyGold.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { notify(rslt); },
			onFailure: function () { notify({ errorMsg: tx('AJAX error') }); },
		}, true);
	},
}

var FoodAlerts = {
	init: function () {
		var t = FoodAlerts;
		for (var c = 0; c < Cities.numCities; c++) {
			if (!Options.lastAlert[Cities.cities[c].id]) {
				Options.lastAlert[Cities.cities[c].id] = 0;
			}
			if (!Options.countAlert[Cities.cities[c].id]) {
				Options.countAlert[Cities.cities[c].id] = 0;
			}
		}
		saveOptions();
	},

	tick: function () {
		var t = FoodAlerts;
		var now = unixTime();
		var trupkeepreduce = 0;
		trupkeepreduce = Math.min(equippedthronestats(79), uW.cm.thronestats.boosts.Upkeep.Max);
		var trprodres = Math.min(equippedthronestats(82), uW.cm.thronestats.boosts.ResourceProduction.Max);
		var trprod = [0, 0, 0, 0, 0];
		trprod[1] = Math.min(equippedthronestats(83), uW.cm.thronestats.boosts.ResourceProduction.Max) + trprodres;

		if (Options.pbFoodAlertInt < 1) Options.pbFoodAlertInt = 1;

		for (i = 0; i < Cities.numCities; i++) {
			var cityId = Cities.cities[i].id;
			if (isNaN(Seed.resources["city" + cityId]['rec1'][0])) continue; // no alert if can't read the amount...
			var rp = getResourceProduction(cityId);
			var usage = parseIntNan(Seed.resources['city' + cityId]['rec1'][3]);
			var bp = CM.Resources.getProductionBase(1, cityId);
			usage = parseIntNan(rp[1] - usage + bp * trprod[1] / 100);
			var foodleft = parseInt(Seed.resources["city" + cityId]['rec1'][0]) / 3600;
			if (usage != 0) {
				var timeLeft = parseInt(Seed.resources["city" + cityId]['rec1'][0]) / 3600 / (0 - usage) * 3600;
				var msg = '';
				if (usage < 0) {
					var since = unixTime() - Options.lastAlert[cityId];
					if ((timeLeft < (Options.pbFoodAlertInt * 3600)) && (since > 15 * 60)) {
						Options.countAlert[cityId]++;
						if (Options.countAlert[cityId] > 3) { // only post alert if more than 3 positive results in a row
							msg += tx('My city') + ' ' + Cities.cities[i].name.substring(0, 10) + ' (' + Cities.cities[i].x + ',' + Cities.cities[i].y + ')';
							msg += ' ' + tx('is low on food. Remaining') + ': ' + addCommas(foodleft, true) + ' (' + timestrShort(timeLeft) + ') ' + tx('Upkeep') + ': ' + addCommas(usage);
							sendChat("/a " + msg);
							Options.lastAlert[cityId] = unixTime();
						}
					}
					else {
						Options.countAlert[cityId] = 0;
					}
				}
				else {
					Options.countAlert[cityId] = 0;
				}
			}
			else {
				Options.countAlert[cityId] = 0;
			}
		}
	},
}

var RefreshEvery = {
	timer: null,
	PaintTimer: null,
	NextRefresh: 0,
	box: null,
	target: null,

	init: function () {
		var t = RefreshEvery;
		t.creatediv();
		if (Options.btEveryMins < 1)
			Options.btEveryMins = 1;
	},

	creatediv: function () {
		var t = RefreshEvery;
		t.target = ById('comm_tabs');
		if (t.target == null) {
			setTimeout(t.creatediv, 2000);
			return;
		}
		t.box = document.createElement('div');
		t.target.appendChild(t.box);
		t.box.addEventListener('click', function () { t.setEnable(Options.btEveryEnable) }, false);
	},

	setEnable: function (tf) {
		var t = RefreshEvery;
		clearTimeout(t.timer);
		if (tf) {
			t.NextRefresh = unixTime() + (Options.btEveryMins * 60);
			t.timer = setTimeout(t.Paint, 1000);
		} else {
			t.timer = null;
			t.NextRefresh = 0;
			t.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;' + getMyAlliance()[1] + ' (' + getServerId() + ')</b></font></span>';
		}
	},

	doit: function () {
		var t = RefreshEvery;
		t.box.innerHTML = '<span style="Line-Height:35px;"><FONT color=#f80><B>&nbsp;&nbsp;&nbsp;&nbsp;' + tx("Reloading Now!") + '</b></font></span></div>';
		actionLog('Refreshing (' + Options.btEveryMins + ' minutes expired)');
		ReloadKOC(true);
	},

	setTimer: function () {
		var t = RefreshEvery;
		clearTimeout(t.timer);
		if (Options.btEveryMins < 1) Options.btEveryMins = 1;
		RefreshEvery.setEnable(Options.btEveryEnable);
	},

	Paint: function () {
		var t = RefreshEvery;
		if (t.timer == null) return;
		now = unixTime();
		var text = '';
		var Left = parseInt(t.NextRefresh - now);
		var txtbox = ById('modal_msg_write_txt');
		if ((Left < 0) && (!txtbox || txtbox.value == "") && (!Options.detAFK || afkdetector.isAFK)) {
			clearTimeout(t.timer);
			Left = 0;
			t.doit();
			return;
		};
		if (Left <= -1) text += '<span style="Line-Height:35px;"><FONT color=#f80><B>&nbsp;&nbsp;&nbsp;&nbsp;' + tx("Ready to Reload...") + '</b></font></span></div>';
		else if (Left < 60 && (!Options.detAFK || afkdetector.isAFK)) text += '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;' + tx("Next refresh in") + ': </font><FONT color=#f80><B>' + timestr(Left) + '</b></font></span></div>';
		else text += '<span style="Line-Height:35px;"><FONT color=white><B>&nbsp;&nbsp;&nbsp;&nbsp;' + tx("Next refresh in") + ': <B>' + timestr(Left) + '</b></font></span></div>';

		t.box.innerHTML = '<a title="' + tx('Click to reset countdown timer') + '">' + text + '</a>';
		t.timer = setTimeout(t.Paint, 1000);
	},
}
