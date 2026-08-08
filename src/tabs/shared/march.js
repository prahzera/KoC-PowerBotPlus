/** Global march function **/

var March = {
	tt: null,
	currentrequests: 0,
	maxrequests: 3,
	queue: [],
	waittime: 0,
	waitwarning: false,

	addMarch: function (params, callback, forcemarch) {
		var t = March;
		var opts = { params: params, callback: callback };
		if (t.currentrequests < t.maxrequests || forcemarch) {
			t.sendMarch(opts.params, opts.callback);
		} else {
			t.queue.push(opts);
			actionLog(t.getMarchType(opts.params.type) + ' added to march queue. Queue now contains ' + t.getQueueLength() + ' marches.', 'MARCH');
		}
	},

	loop: function () {
		var t = March;
		if (t.currentrequests < t.maxrequests) {
			var opts = t.queue.shift();
			if (opts) {
				t.sendMarch(opts.params, opts.callback);
				actionLog(t.getMarchType(opts.params.type) + ' triggered from march queue. Queue now contains ' + t.getQueueLength() + ' marches.', 'MARCH');
			}
		}
	},

	getMarchType: function (mt) {
		switch (parseIntNan(mt)) {
			case 1: return 'Transport';
			case 2: return 'Reinforcement';
			case 3: return 'Scout';
			case 4: return 'Attack';
			case 5: return 'Reassign';
			default: return 'March';
		}
	},

	getQueueLength: function () {
		var t = March;
		return t.queue.length;
	},

	RallyPoint: function (cityId) {
		var t = March;
		var ret = {};
		ret.level = t.getRallypointLevel(cityId);
		ret.maxSlots = t.getTotalSlots(cityId);
		ret.marching = t.getMarchSlots(cityId);
		ret.emptySlots = t.getEmptySlots(cityId);
		ret.maxSize = t.getMaxSize(cityId, ''); // assume no items
		return ret;
	},

	getRallypointLevel: function (cityId) {
		var t = March;
		cityId = "city" + cityId;
		rallypointlevel = 0;
		for (var o in Seed.buildings[cityId]) {
			var buildingType = parseInt(Seed.buildings[cityId][o][0]);
			var buildingLevel = parseInt(Seed.buildings[cityId][o][1]);
			if (buildingType == 12) {
				rallypointlevel = parseInt(buildingLevel);
				break;
			}
		}
		return rallypointlevel;
	},

	getTotalSlots: function (cityId) {
		var t = March;
		var ascended = getAscensionValues(cityId);
		var rallypointlevel = t.getRallypointLevel(cityId);
		var slots = rallypointlevel; //Set default number of slots to rallypointlevel
		if (slots >= 13) slots = 12;// a level 13 and above rallypoint only allows for 12 marches.
		if (ascended.isPrestigeCity) {
			slots += 3;
		}
		return slots;
	},

	getMarchSlots: function (cityId) {
		var t = March;
		cityId = "city" + cityId;
		var slots = 0;
		var now = unixTime();
		if (Seed.queue_atkp[cityId] != undefined && Seed.queue_atkp[cityId] != []) {
			for (var k in Seed.queue_atkp[cityId]) {
				var m = Seed.queue_atkp[cityId][k];
				if (m.marchType == 9) {
					if (m.botMarchStatus < 3 || m.botMarchStatus > 9) slots++; //If raid is stopped take it as empty slot
				} else {
					if ((m.returnUnixTime > now) || m.marchStatus == 2) { // count encamped marches!
						slots++;
					}
				}
			}
		} else {
			slots = 0;
		}
		return slots;
	},

	getEmptySlots: function (cityId) {
		var t = March;
		var slots = t.getTotalSlots(cityId);
		slots -= t.getMarchSlots(cityId);
		if (slots < 0) slots = 0;
		return slots;
	},

	getMaxSize: function (cityId, items) {
		var t = March;
		var rallypointlevel = getUniqueCityBuilding(cityId, 12).maxLevel;
		var ascended = getAscensionValues(cityId);
		var buff = 1;
		var max = 0;
		var now = unixTime();

		var Conquest = false;
		var Command = false;
		var koth = false;
		var iused = null;
		if (items) { iused = items.split(","); }
		if (iused) {
			for (var i = 0; i < iused.length; i++) {
				if (iused[i] == 931) { Command = true; }
				if (iused[i] == 932) { Conquest = true; }
			}
		}

		if (Conquest) { buff = 1.5; }
		else { if (Command) { buff = 1.25; } };

		// timed auras take priority

		if (Seed.playerEffects.auras2Expire && Seed.playerEffects.auras2Expire > now) { buff = 1.3 }
		else {
			if (Seed.playerEffects.aurasExpire && Seed.playerEffects.aurasExpire > now) { buff = 1.15 }
		}

		//var tr = Math.floor(equippedthronestats(66));
		var tr = Math.floor(equippedthronestats(66) + equippedthronestats(163));
		if (tr > uW.cm.thronestats.boosts.MarchSize.Max) { tr = uW.cm.thronestats.boosts.MarchSize.Max; }
		if (tr > 0) { buff *= (1 + tr / 100); }

		if (ascended.isPrestigeCity) {
			var b = ascended.prestigeLevel;
			var r = CM.WorldSettings.getSetting("ASCENSION_RALLYPOINT_BOOST");
			var m = JSON.parse(r);
			var u = 1;
			if (m.values[b - 1]) {
				u = m.values[b - 1][1];
			}
			var k = parseFloat(u);
			buff *= k
			if (uW.seed.cityData.city[cityId].prestigeInfo.blessings.indexOf(207) != -1) { buff *= 1.1; }
		}
		if (koth) max = 1;
		switch (rallypointlevel) {
			case 11:
				max = 150000 * buff;
				break;
			case 12:
				max = 200000 * buff;
				break;
			case 13:
				max = 215000 * buff;
				break;
			case 14:
				max = 250000 * buff;
				break;
			case 15:
				max = 275000 * buff;
				break;
			default:
				max = (rallypointlevel * 10000) * buff;
				break;
		}
		var domainBoosterBonus = 1;
		if (CM.WorldSettings.hasSetting('DOMAIN_BOOST_RALLYPIONT')) {
			domainBoosterBonus = parseInt(CM.WorldSettings.getSetting("DOMAIN_BOOST_RALLYPIONT"));
			max *= domainBoosterBonus;
		}
		return Math.floor(max + 0.0001);
	},

	getMarchTime: function (cityId, unit_types, distance, spell_type, phoenix_wings_used, thunder_wings_used, red_wings_used, green_wings_used, koth) {
		var speed = 99999;
		var speedfriend = 99999;
		var unitsfound = false;
		var QualifyAU = false;
		var QualifyFF = false;
		var QualifyGW = false;

		for (var ui in unit_types) {
			unitsfound = true;
			i = unit_types[ui];
			var troop_speed = parseInt(uW.unitstats["unt" + i][3]);
			troop_speed *= (1 + 0.1 * parseInt(Seed.tech.tch11));
			for (var sacIndex = 0; sacIndex < Seed.queue_sacr["city" + cityId].length; sacIndex++) {
				if (Seed.queue_sacr["city" + cityId][sacIndex]["unitType"] == i) {
					troop_speed *= Seed.queue_sacr["city" + cityId][sacIndex]["multiplier"][0]
				}
			}
			if (spell_type == '31' && CM.attack_modal.isUnitSiege(i)) { troop_speed *= 2; }
			if (CM.unitHorsedBenefit[i]) { troop_speed = troop_speed * (1 + 0.05 * parseInt(Seed.tech.tch12)); }
			else {
				troop_speed *= (1 + 0.05 * (parseInt(Seed.tech2.tch1) || 0));
				troop_speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().BLOOD_LUST, cityId, uWCloneInto({ speed: true }));
			}
			if (troop_speed < speed) { speed = troop_speed; }

			if (!koth) {
				if (i == 14 || i == 37) { QualifyAU = true; }
				if (i == 13 || uW.spellCasterUnits["unt" + i]) { QualifyFF = true; }
				if (i == 11 || i == 36) { QualifyGW = true; }
			}
		}

		speedfriend = speed;
		speedfriend *= 1 + (getUniqueCityBuilding(cityId, 18).maxLevel / 2);

		speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FILL_THE_RANKS, cityId, uWCloneInto({ marchspeed: true }));
		speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().REDUCE_FATIGUE, cityId, uWCloneInto({}));
		if (QualifyAU) { speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().AGGRESSIVE_URGE, cityId, uWCloneInto({})); }
		if (QualifyFF) { speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FLASH_FEET, cityId, uWCloneInto({})); }
		if (QualifyGW) { speed *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().GREASED_WHEELS, cityId, uWCloneInto({})); }

		speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FILL_THE_RANKS, cityId, uWCloneInto({ marchspeed: true }));
		speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().REDUCE_FATIGUE, cityId, uWCloneInto({}));
		if (QualifyAU) { speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().AGGRESSIVE_URGE, cityId, uWCloneInto({})); }
		if (QualifyFF) { speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().FLASH_FEET, cityId, uWCloneInto({})); }
		if (QualifyGW) { speedfriend *= CM.BlessingSystemModel.applyBlessing(CM.BlessingSystemModel.getBlessing().GREASED_WHEELS, cityId, uWCloneInto({})); }

		if (!koth) {
			trMarchAllSpeed = CM.ThroneController.getBoundedEffect(67) + CM.ThroneController.getBoundedEffect(163);
			trAttackSpeed = CM.ThroneController.getBoundedEffect(68);
			trReinforceSpeed = CM.ThroneController.getBoundedEffect(69);
			trTransportSpeed = CM.ThroneController.getBoundedEffect(70);
			trReassignSpeed = CM.ThroneController.getBoundedEffect(71);
			trScoutSpeed = CM.ThroneController.getBoundedEffect(72);
			var throneBoost = trMarchAllSpeed + trAttackSpeed;
			var throneBoostFriend = trMarchAllSpeed + Math.min(trReinforceSpeed, trTransportSpeed);
			speed = speed * (1 + (throneBoost * 0.01))
			speedfriend = speedfriend * (1 + (throneBoostFriend * 0.01))
		}
		var gi = CM.guardianModalModel.getMarchBonus();
		var multiplier = 1 + (gi * 0.01);
		speed = speed * multiplier
		speedfriend = speedfriend * multiplier
		if (0 == speed || 0 == distance) {
			return { friend: 0, foe: 0, speedfriend: speedfriend, speed: speed };
		}
		var time = 0;
		var timefriend = 0;
		if (unitsfound) {
			if (speed > 0) { time = Math.ceil(parseFloat(distance) * 6000 / speed); }
			if (speedfriend > 0) { timefriend = Math.ceil(parseFloat(distance) * 6000 / speedfriend); }

			var wings_used = red_wings_used || green_wings_used;
			var delay = CM.WorldSettings.isOn("MARCH_SINGLE_TRIP_DELAY") ? parseInt(uW.g_marchSingleTripDelay) : 0;
			time += delay;
			timefriend += delay;

			if (phoenix_wings_used) {
				time = parseInt(time * 0.1);
				timefriend = parseInt(timefriend * 0.1);
			} else {
				if (thunder_wings_used) {
					time = parseInt(time * 0.25);
					timefriend = parseInt(timefriend * 0.25);
				} else {
					if (red_wings_used) {
						time = parseInt(time * 0.5);
						timefriend = parseInt(timefriend * 0.5);
					} else {
						if (green_wings_used) {
							time = parseInt(time * 0.75);
							timefriend = parseInt(timefriend * 0.75);
						}
					}
				}
			}

			if (Seed.playerEffects.returnExpire > uW.unixtime()) {
				time = parseInt(time * 0.75);
				timefriend = parseInt(timefriend * 0.75);
			}
			if (spell_type == '11') {
				time *= 0.01;
				timefriend *= 0.01;
			}

			time = Math.ceil(time < 30 ? 30 : time);
			timefriend = Math.ceil(timefriend < 30 ? 30 : timefriend);
		}
		return { friend: timefriend, foe: time, speedfriend: speedfriend, speed: speed };
	},

	sendMarch: function (params, callback) {
		var t = March;

		if (March.waittime > uW.unixtime()) {
			if (March.waitwarning) {
				actionLog('Marches suspended to deal with march Captcha', 'MARCH');
				March.waitwarning = false;
			}
			if (callback) callback({ msg: "Marches suspended to deal with march Captcha" });
			return;
		};
		//need to check that march is not oversized!
		var maxsize = March.getMaxSize(params.cid, params.items);
		var x = 0;
		for (var ui in CM.UNIT_TYPES) {
			var i = CM.UNIT_TYPES[ui];
			var y = eval('params.u' + i);
			if (matTypeof(y) == 'number') { x += y; }
		}
		if (maxsize < x) {
			actionLog(Cities.byID[params.cid].name + ': Attempted to send march size ' + x + ' - max allowed is ' + maxsize, 'MARCH');
			if (callback) callback({ msg: "Maximum Troops Exceeded" });
			return;
		}
		t.currentrequests++;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/march.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				try {
					--t.currentrequests;
					if (t.currentrequests < 0) t.currentrequests = 0;
					setTimeout(March.loop, 3000); //Always check for the next queued march 3 seconds after a request
					CM.MarchModal.setBackedOff(false);
					if (rslt.ok) {
						if (rslt.bsEndDate) {
							Seed.cityData.city[params.cid].spells = uWCloneInto({});
							Seed.cityData.city[params.cid].spells[params.bs] = uWCloneInto({ endDate: rslt.bsEndDate });
						}
						if (params.champid && params.champid != 0) {
							var championidx = "";
							for (var i = 0; i < Seed.champion.champions.length; i++) {
								if (Seed.champion.champions[i].championId == params.champid) championidx = i;
							}
							// update seed immediately
							Seed.champion.champions[championidx].status = "10";
						}
						var timediff = parseInt(rslt.eta) - parseInt(rslt.initTS);
						var rtimediff = parseInt(rslt.returnTS) - parseInt(rslt.initTS);
						var ut = uW.unixtime();
						var unitsarr = {};
						for (var ui in CM.UNIT_TYPES) {
							i = CM.UNIT_TYPES[ui];
							if (params["u" + i])
								unitsarr[i] = params["u" + i];
							else
								unitsarr[i] = 0;
						}
						var resources = new Array();
						resources[0] = params.gold;
						for (var i = 1; i <= 5; i++) {
							resources[i] = params["r" + i];
						}
						uW.attach_addoutgoingmarch(rslt.marchId, rslt.marchUnixTime, ut + timediff, params.xcoord, params.ycoord, uWCloneInto(unitsarr), params.type, params.kid, uWCloneInto(resources), rslt.tileId, rslt.tileType, rslt.tileLevel, params.cid, true, ut + rtimediff);
						if (params.items && params.items != "") {
							var iused = params.items.split(",");
							for (var i = 0; i < iused.length; i++) {
								Seed.items["i" + iused[i]] = parseInt(Seed.items["i" + iused[i]]) - 1;
								uW.ksoItems[iused[i]].subtract();
							}
						}
						uW.updateBoosts(uWCloneInto(rslt));
						if (rslt.liftFog) {
							Seed.playerEffects.fogExpire = 0;
							uW.g_mapObject.getMoreSlots();
							uW.update_boosts();
							if (Options.AutoMistMarch && uW.ksoItems[10021].count > 0) {
								CM.ItemController.usePotionOfMist('10021');
								actionLog('Automatically applying Potion of Mist', 'MARCH');
							}
						}

						if (Tabs.Megalith && params.type == 4) { Tabs.Megalith.CheckAddAttackTime(params.xcoord, params.ycoord, rslt.marchUnixTime); }

						if (callback) { callback(rslt); }
					} else {
						if (rslt.user_action) {
							actionLog('March Error: Server Response - ' + rslt.user_action, 'MARCH');
							if (rslt.user_action == "backOffWaitTime") {
								CM.MarchModal.setBackedOff(true);
								if (rslt.tt) { params.tt = rslt.tt; }
								var wait = 2;
								if (rslt.wait_time) { wait = rslt.wait_time; }
								setTimeout(t.sendMarch, wait * 1000, params, callback); // retry march after wait time
								return;
							}
							if (rslt.user_action == "marchWarning" || rslt.user_action == "marchCaptcha") { // send captcha through here now (no more captcha - it doesn't work anyway)
								March.waittime = Number(uW.unixtime() + 120); // suspend marches for 2 mins
								March.waitwarning = true;
								rslt.msg = uW.g_js_strings.modal_attack.useractionwarningmessage;
							}
						}

						var msg = '';
						var g = Number(rslt.error_code);
						switch (g) {
							case 0: msg = tx("Unexpected Error"); break; // unexpected error
							case 8: msg = tx("Excess Traffic"); CM.GATracker("Error", "Excess traffic. (" + g + ")", uW.g_server); break;
							case 3: msg = tx("Game out of Sync"); break; //game out of sync
							case 4: msg = tx("You have insufficient units"); break; //not enough units
							case 104: msg = uW.g_js_strings.errorcode.err_104; break; //unable to attack target
							case 208: msg = uW.g_js_strings.errorcode.err_208; break; // beginner protection
							case 210: msg = uW.g_js_strings.errorcode.err_210; break; // Max marches
							case 212:
								if (Seed.knights['city' + params.cid]['knt' + params.kid])
									Seed.knights['city' + params.cid]['knt' + params.kid].knightStatus = 10; //remove knight from list, set to 1 to make available again.
								msg = uW.g_js_strings.errorcode.err_212; break;
							case 213:
								if (Seed.knights['city' + params.cid]['knt' + params.kid])
									Seed.knights['city' + params.cid]['knt' + params.kid].knightStatus = 10; //remove knight from list, set to 1 to make available again.
								msg = uW.g_js_strings.errorcode.err_213; break;
							default:
								CM.GATracker("Error", "Something has gone wrong. (" + g + ")", uW.g_server); break;
								msg = uW.g_js_strings.errorcode["err_" + g]; break;
						}
						if (typeof rslt.cooldownTime !== "undefined") {
							rslt.msg = uW.g_js_strings.koth.timeRemaining.replace("%1$s", uW.timestr(rslt.cooldownTime));
							if (Tabs.Megalith) { var now = unixTime(); Tabs.Megalith.CheckAddAttackTime(params.xcoord, params.ycoord, (now + (rslt.cooldownTime) - (Tabs.Megalith.CoolDown * 60))); }
						}
						if (!rslt.msg) { rslt.msg = msg; }
						if (callback) { callback(rslt); } //return all server excess traffic error to original function to handle
						return;
					}
				} catch (err) { logerr(err); }
			},
			onFailure: function () {
				--t.currentrequests;
				if (t.currentrequests < 0) t.currentrequests = 0;
				setTimeout(March.loop, 3000); //Always check for the next queued march 3 seconds after a request
				if (callback) { callback({ msg: tx("AJAX Error") }); }
			}
		});
	},
};

var ItemMultiUseController = {
	city_holder: 0,
	max: 1,
	init: function () {
		var t = ItemMultiUseController;
		//Hack for ItemController
		t.ItemController = new CalterUwFunc("cm.MultiBuyUse.getNumberUsed", [[/(.|\n)*/i, 'function (e) {return ItemController_hook();}']]);
		uWExportFunction('ItemController_hook', ItemMultiUseController.e_total);
	},
	UseItems: function (iid, num, cid) {
		var t = ItemMultiUseController;
		t.max = num;
		t.ItemController.setEnable(true); //Set to use current value specified
		if (cid) { //Set to use city specified
			t.city_holder = uW.currentcityid;
			uW.currentcityid = cid;
		}
		CM.ItemController.use(iid);
		if (cid) { //Set currentcity to old value
			uW.currentcityid = t.city_holder;
		}
		t.ItemController.setEnable(false); //Switch off value fixed
	},
	e_total: function () {
		var t = ItemMultiUseController;
		return t.max;
	},
}
