var MapDistanceFix = {
	popSlotsFunc: null,
	init: function () {
		var t = MapDistanceFix;

		try {
			t.popSlotsFunc = new CalterUwFunc('MapObject.prototype.populateSlots', [
				['this.distance', 'fixMapDistance_hook']
			]);
			if (t.isAvailable()) {
				uWExportFunction('fixMapDistance_hook', MapDistanceFix.fixMapDistance_hook);
				t.enable(true);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	fixMapDistance_hook: function (cityX, cityY, tileX, tileY) {
		var city = Cities.byID[uW.currentcityid];
		return distance(city.x, city.y, tileX, tileY);
	},
	enable: function (tf) {
		var t = MapDistanceFix;
		t.popSlotsFunc.setEnable(tf);
	},
	isAvailable: function () {
		var t = MapDistanceFix;
		return t.popSlotsFunc.isAvailable();
	},
}

var mapinfoFix = {
	init: function () {
		var t = mapinfoFix;

		try {
			t.calcButtonInfo = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo', [
				[/case\s*"reassign":b\.text\s*=\s*g_js_strings\.commonstr\.reassign;b\.color\s*=\s*"blue";b\.action\s*=\s*function\s*\(\)\s*{modal_attack\(2,\s*e\.tile\.x,\s*e\.tile\.y\);*};d\.push\(b\);break;/,
					'case "reassign":b.text=g_js_strings.commonstr.reassign;b.color="blue";b.action=function(){modal_attack(5,e.tile.x,e.tile.y);};d.push(b);break;'
				]
			]);
			t.bookMarkMod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo', [
				[/case\s*"bookmark":/, 'case "bookmark": try { if (e.city && cm.tileInfo[e.tile.id] && cm.tileInfo[e.tile.id].cityName ) {e.tile.name = e.user.username + "/" + cm.tileInfo[e.tile.id].cityName;}} catch (err1) {} ']
			]);
			t.MapContextMenus = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcCityType', [
				['return c', 'c = calcCityTypeFix(c,d);return c']
			]);
			t.calcButtonInfo.setEnable(Options.mapInfo);
			t.MapContextMenus.setEnable(Options.mapInfo2);
			t.bookMarkMod.setEnable(Options.mapInfo3);
			CM.ContextMenuMapController.prototype.MapContextMenus.City["2"].splice(4, 0, "reassign");
			// add reinforce alliance wilds
			for (var jj in CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness) {
				CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness[jj] = ["profile", "throne", "reinforce", "reinforcements", "message", "bookmark"];
			}
			// add megaliths to wild types
			CM.ContextMenuMapController.prototype.MapContextMenus.OwnedWilderness.megalith = ["bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.OwnedWildernessNoDefend.megalith = ["bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness.megalith = ["profile", "bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.FriendlyWilderness.megalith = ["profile", "attack_koth", "scout_koth", "bookmark"];
			CM.ContextMenuMapController.prototype.MapContextMenus.EnemyWilderness.megalith = ["profile", "attack_koth", "scout_koth", "bookmark"];

			uWExportFunction('calcCityTypeFix', t.calcCityType_hook);
			// add the province and the city status (Normal/Truce) to the tooltips
			if (!NoRegEx) {
				t.dispStatusMod = new CalterUwFunc('MapObject.prototype.populateSlots', [
					[/var\s*h\s*=""/, 'var h = ""; h+="<div class=divHide>"+U.tileUserId+"</div><div class=thead align=center><b>"+provincenames["p" + U.tileProvinceId]+"</b></div>";if (M) h += "<div>"+g_js_strings.commonstr.status+": "+M+"</div>";']
				]);
			}
			else {
				t.dispStatusMod = new CalterUwFunc('MapObject.prototype.populateSlots', [
					['var h = "";', 'var h = ""; h+="<div class=divHide>"+U.tileUserId+"</div><div class=thead align=center><b>"+provincenames["p" + U.tileProvinceId]+"</b></div>";if (M) h += "<div>"+g_js_strings.commonstr.status+": "+M+"</div>";']
				]);
			}
			t.dispStatusMod.setEnable(Options.dispStatus);

			t.MapContextMenuAdd = new CalterUwFunc('modal_maptile', [[/}\s*$/, ';setTimeout(function() { MapContextMenuAdd_hook(j,k,m,a,h,f,o,e); },0); }']]);
			uWExportFunction('MapContextMenuAdd_hook', mapinfoFix.MapContextMenu);
			t.MapContextMenuAdd.setEnable(Options.mapMenuInfo);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = mapinfoFix;
		t.calcButtonInfo.setEnable(tf);
	},
	setEnable2: function (tf) {
		var t = mapinfoFix;
		t.MapContextMenus.setEnable(tf);
	},
	setEnable3: function (tf) {
		var t = mapinfoFix;
		t.bookMarkMod.setEnable(tf);
	},
	setMenuEnable: function (tf) {
		var t = mapinfoFix;
		t.MapContextMenuAdd.setEnable(tf);
	},
	setEnableDispStatus: function (tf) {
		var t = mapinfoFix;
		t.dispStatusMod.setEnable(tf);
	},
	calcCityType_hook: function (c, d) {
		if (Cities.byID[d.city.id] && c != 1)
			c = CM.CITY_STATUS.MY_CITY_AND_NOT_CURRENT_CITY;
		return c;
	},
	isAvailable: function () {
		var t = mapinfoFix;
		return t.calcButtonInfo.isAvailable();
	},
	isAvailable2: function () {
		var t = mapinfoFix;
		return t.MapContextMenus.isAvailable();
	},
	isAvailable3: function () {
		var t = mapinfoFix;
		return t.bookMarkMod.isAvailable();
	},
	isMenuAvailable: function () {
		var t = mapinfoFix;
		return t.MapContextMenuAdd.isAvailable();
	},
	isAvailableDispStatus: function () {
		var t = mapinfoFix;
		return t.dispStatusMod.isAvailable();
	},
	MapSelMarchPreset: function () {
		Options.OneClickAttackPreset = ById('ptMapOneClickAttackPreset').value;
		saveOptions();
	},
	MapContextMenu: function (uid, x, y, a, h, f, o, e) {
		var t = mapinfoFix;
		var div = ById('contextMenu');

		var MarchPresets = { 0: "-- " + tx('Select March Preset') + " --" };
		for (var PN in Options.QuickMarchOptions.MarchPresets) {
			MarchPresets[PN] = Options.QuickMarchOptions.MarchPresets[PN][0];
		}
		var HQ = false;
		if (CM.FoundingModel) HQ = CM.FoundingModel.get_hq(x, y);
		var DefendStat = '';
		var citytile = ((e.indexOf("city") > -1 && uid != null && uid != 0 && uid != "0") || e.indexOf("mist") > -1);
		if (citytile) { DefendStat = '<div style="margin-top:6px;" align=center id=ptDefendStatus>&nbsp;</div>'; }

		if ((citytile || (uid != null && uid != 0 && uid != "0")) && (!uid || uid != uW.tvuid)) {
			var ascended = getAscensionValues(uW.currentcityid);
			if (ascended.isPrestigeCity) {
				var cityExpTime = ascended.prestigeBuffExpire;
				if (cityExpTime && cityExpTime > unixTime()) {
					var AP = document.createElement('div');
					AP.innerHTML = '<center><span class=boldRed><b>' + tx('ASCENSION') + '<br>' + tx('PROTECTION') + '<br>' + tx('WARNING') + '!</b></span></center>';
					div.insertBefore(AP, div.firstChild);
				}
			}
		}

		uWExportFunction('ptMapSelMarchPreset', t.MapSelMarchPreset);

		var QAPreset = '<div align=center>' + htmlSelector(MarchPresets, Options.OneClickAttackPreset, 'id=ptMapOneClickAttackPreset class=btInput onChange="ptMapSelMarchPreset();" onMouseMove="ptStopProp(event);" onMouseOut="ptStopProp(event);" onClick="ptStopProp(event);" onMouseUp="ptStopProp(event);"') + '</div>';

		var champ = false;
		if (Options.QuickMarchOptions.AutoChamp) {
			citychamp = getCityChampion(uW.currentcityid);
			if (citychamp.championId) {
				champ = true;
				if (citychamp.status != "10") { QAPreset += '<div align=center style="font-size:10px;color:#080"><b>' + tx('Champion Ready') + '!</b></div>'; }
				else { QAPreset += '<div align=center style="font-size:10px;color:#800"><b>Champion Unavailable!</b></div>'; }
			}
			if (!champ) { QAPreset += '<div align=center style="font-size:10px;color:#800"><b>' + uW.g_js_strings.champ.no_champ + '!</b></div>'; }
		}
		if (Options.QuickMarchOptions.AutoSpell) {
			var faction = '';
			var spellavailable = false;
			var cooldownactive = false;
			if (Seed.cityData.city[uW.currentcityid].isPrestigeCity) {
				faction = parseInt(Seed.cityData.city[uW.currentcityid].prestigeInfo.prestigeType);
				spellavailable = (Seed.cityData.city[uW.currentcityid].prestigeInfo.blessings.indexOf(SpellBlessings[faction]) != -1)
				cooldownactive = (Seed.cityData.city[uW.currentcityid].spells && Seed.cityData.city[uW.currentcityid].spells[SpellTypes[faction]] && parseInt(Seed.cityData.city[uW.currentcityid].spells[SpellTypes[faction]].endDate) > uW.unixtime());
			}
			if (spellavailable) {
				if (!cooldownactive) {
					QAPreset += '<div align=center style="font-size:10px;"><span class=boldMagenta>' + uW.g_js_strings.spells['name_' + SpellTypes[faction]] + ' ' + tx('Ready') + '!</span></div>';
				}
				else {
					QAPreset += '<div align=center style="font-size:10px;"><span class=boldRed>' + uW.g_js_strings.spells['name_' + SpellTypes[faction]] + ' ' + tx('Regenerating') + '!</span></div>';
				}
			}
			else {
				QAPreset += '<div align=center style="font-size:10px;"><span class=boldRed>' + tx('No Spell Available') + '!</span></div>';
			}
		}

		if (uid != null && uid != 0 && uid != "0") {
			var scr = document.createElement('div');
			if ((h != 0 && h == getMyAlliance()[0]) || uid == uW.tvuid || !Options.OneClickAttack || HQ) {
				var QAPreset = '';
			}
			scr.innerHTML = QAPreset + '<div align=center><b>' + tx('Loading') + '...</b></div>';
			div.appendChild(scr);
			var params = uW.Object.clone(uW.g_ajaxparams);
			params.checkArr = uid;
			new MyAjaxRequest(uW.g_ajaxpath + "ajax/getOnline.php" + uW.g_ajaxsuffix, {
				method: "post",
				parameters: params,
				onSuccess: function (rslt) {
					var p = rslt.data;
					var params = uW.Object.clone(uW.g_ajaxparams);
					params.pid = uid;
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							if (rslt.ok) {
								var u = unixTime();
								var f = convertTime(new Date(rslt.playerInfo.fogExpireTimestamp.replace(" ", "T") + "Z"));
								var truce = "";
								if (rslt.playerInfo.warStatus != "1") {
									truce = " (" + Tabs.Monitor.getDuration(rslt.playerInfo.truceExpireTimestamp) + ")";
								}

								var misted = (f >= u);
								m = '<TABLE width="100%" class=ptTab style="font-size:11px"><tr><td align="center"><div style="font-size:12px"><b>' + rslt.playerInfo.displayName + '</b></div></td></tr>';
								m += '<tr><TD align="center"><a id=btMapDetails>' + parseInt(rslt.playerInfo.userId) + '</a></td></tr>';
								var g = uW.g_js_strings.commonstr, h = { 1: g.normal, 2: uW.g_js_strings.MapObject.begprotect, 3: g.truce, 4: g.vacation };
								m += '<tr><TD align="center"><B>' + h[rslt.playerInfo.warStatus] + truce + '</b></td></tr>';
								if (!p[uid])
									m += '<tr><TD align="center">' + t.getLastLogDuration(rslt.playerInfo.lastLogin) + '</td></tr>';
								else
									m += '<tr><TD align="center"><span style="color:#f00;"><b>(' + uW.g_js_strings.commonstr.online.toUpperCase() + ')</b></span></td></tr>';
								if (misted)
									m += '<tr><TD align="center"><B>*** ' + tx("MISTED") + ' ***</b></td></tr>';

								scr.innerHTML = QAPreset + m + '</table>' + DefendStat;
								ById('btMapDetails').addEventListener('click', function () { Battle.fetchPlayerInfo(rslt.playerInfo.userId, Battle.clickedPlayerDetails); }, false);
								var MenuHeight = parseInt(div.offsetHeight);
								div.style.height = MenuHeight + 'px';
								div.style.overflow = 'visible';
								scr.style.height = '500px';
								scr.style.background = '';
								if (citytile) { getDefendStatus(x, y, ById('ptDefendStatus'), true); }
							}
						},
					});
				},
			});
		}
		else {
			if (HQ || !Options.OneClickAttack) {
				var QAPreset = '';
			}
			var scr = document.createElement('div');
			scr.innerHTML = QAPreset + DefendStat;
			div.appendChild(scr);
			var MenuHeight = parseInt(div.offsetHeight);
			div.style.height = MenuHeight + 'px';
			div.style.overflow = 'visible';
			scr.style.height = '500px';
			scr.style.background = '';
			if (citytile) { getDefendStatus(x, y, ById('ptDefendStatus'), true); }
		}
	},

	getLastLogDuration: function (datestr) {
		if (!datestr) return;
		var Interval = convertTime(new Date(datestr.replace(" ", "T") + "Z")) - unixTime();
		if (Interval < 0) return uW.timestr(Interval * (-1));
		else return tx('minutes ago');
	},

};
