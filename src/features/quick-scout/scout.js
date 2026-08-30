/** QUICK SCOUT **/

QuickScout = {
	init: function () {
		var t = QuickScout;

		try {
			// add new options to the context menu

			CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("bookmark");
			CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("aamod");
			CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("qqmod");
			if (Options.OneClickAttack)
				CM.ContextMenuMapController.prototype.MapContextMenus.City["5"].push("qamod");
			var cityType = CM.CITY_STATUS.ANOTHER_PLAYER_CITY_AND_NOT_IN_YOUR_ALLIANCE;
			CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("aamod");
			CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("qqmod");
			if (Options.OneClickAttack)
				CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("qamod");
			var wildContext;
			wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.EnemyWilderness;
			for (var wild in wildContext) {
				wildContext[wild].push("aamod");
				wildContext[wild].push("qqmod");
				if (Options.OneClickAttack)
					wildContext[wild].push("qamod");
			}
			wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.Wilderness;
			for (var wild in wildContext) {
				wildContext[wild].push("aamod");
				wildContext[wild].push("qqmod");
				if (Options.OneClickAttack)
					wildContext[wild].push("qamod");
			}
			wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.FriendlyWilderness;
			for (var wild in wildContext) {
				wildContext[wild].push("aamod");
				wildContext[wild].push("qqmod");
				if (Options.OneClickAttack)
					wildContext[wild].push("qamod");
			}

			// add actions to the menu item
			var mod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo',
				[['default:', 'case "qqmod":' +
					' b.text = "' + tx('QuickScout') + '"; b.color = "green"; ' +
					' b.action = function () { ' +
					' quickscout(e); ' +
					' }; ' +
					' d.push(b); break; ' +
					'case "qamod":' +
					' b.text = "' + tx('QuickAttack') + '"; b.color = "red"; ' +
					' b.action = function () { ' +
					' quickattack(e); ' +
					' }; ' +
					' d.push(b); break; ' +
					'case "aamod":' +
					' b.text = "' + tx('Auto Attack') + '"; b.color = "blue"; ' +
					' b.action = function () { ' +
					' autoattack(e); ' +
					' }; ' +
					' d.push(b); break; ' +
					' default: ']]);

			mod.setEnable(true);

			function FNQuickScout(e) {
				// send 1 scout
				var params = uW.Object.clone(uW.g_ajaxparams);
				params.cid = uW.currentcityid;
				params.type = 3
				params.kid = 0
				params.xcoord = e.tile.x;
				params.ycoord = e.tile.y;
				params["u" + Options.QuickScoutTroops] = 1;
				params.gold = 0;
				params.r1 = 0;
				params.r2 = 0;
				params.r3 = 0;
				params.r4 = 0;
				params.r5 = 0;

				March.addMarch(params, function (rslt) {
					if (rslt.ok) {
						if (e.tile.level == 0 && (Options.FetchMarchInfo)) QuickScout.fetchmarch(rslt.marchId, QuickScout.PlayerPopup); // mist scout
					}
					else {
						uW.Modal.showAlert(uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback));
					}
				}, true); // force march so it never gets queued
			}
			uWExportFunction('quickscout', FNQuickScout);

			function FNQuickScoutSearch(x, y, cid, auto) {
				// if auto check rally slots

				if (auto) {
					var marches = parseIntNan(March.getMarchSlots(cid));
					var maxmarches = parseIntNan(March.getTotalSlots(cid));
					var keepfree = Number(Options.FreeRallySlots);
					if ((marches + keepfree) >= maxmarches) {
						divid = 'pbsrch_' + x + '_' + y;
						if (ById(divid)) {
							msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Rally Point Full') + '!</span>&nbsp;&nbsp;<SPAN onclick="quickscoutsearch(' + x + ',' + y + ',' + cid + ');return false;"><A class=xlink>' + tx("QuickScout") + '</a></span>';
							ById(divid).innerHTML = msg;
						}
						if (Tabs.Search) { Tabs.Search.QSMarching[x + '_' + y] = 0; }
						return;
					}
				}

				// send 1 scout
				var params = uW.Object.clone(uW.g_ajaxparams);
				if (cid == null)
					params.cid = uW.currentcityid;
				else
					params.cid = cid;
				params.type = 3
				params.kid = 0
				params.xcoord = x;
				params.ycoord = y;
				params["u" + Options.QuickScoutTroops] = 1;
				params.gold = 0;
				params.r1 = 0;
				params.r2 = 0;
				params.r3 = 0;
				params.r4 = 0;
				params.r5 = 0;

				March.addMarch(params, function (rslt) {
					if (rslt.ok) {
						QuickScout.fetchmarch(rslt.marchId, QuickScout.FillSearchDiv); // mist scout
					}
					else {
						divid = 'pbsrch_' + x + '_' + y;
						if (!ById(divid)) return;
						var msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Error Code') + ' - ' + rslt.error_code + '</span>&nbsp;&nbsp;<SPAN onclick="quickscoutsearch(' + x + ',' + y + ',' + cid + ');return false;"><A class=xlink>' + tx("QuickScout") + '</a></span>';
						if (rslt.error_code == 208 || rslt.error_code == 207) { // errors that mean you can never scout
							if (rslt.error_code == 208) {
								msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Target is truced - Cannot scout') + '!</span>';
							}
							else {
								msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('You are truced - Cannot scout another player') + '!</span>';
							}
							// update search results .. find correct row
							var t = Tabs.Search;
							if (t) {
								var numRows = t.mapDat.length;
								for (var i = 0; i < numRows; i++) {
									if (t.mapDat[i][0] == x && t.mapDat[i][1] == y) {
										t.mapDat[i][6] = 0;
										t.mapDat[i][8] = msg;
									}
								}
							}
						}
						if (rslt.error_code == 210) { // errors that mean you may be able to scout in a bit!
							msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Rally Point Full') + '!</span>&nbsp;&nbsp;<SPAN onclick="quickscoutsearch(' + x + ',' + y + ',' + cid + ');return false;"><A class=xlink>' + tx("QuickScout") + '</a></span>';
						}
						ById(divid).innerHTML = msg;
						if (Tabs.Search) {
							Tabs.Search.scouted++;
							Tabs.Search.updateMistProgress();
						}
					}
					if (Tabs.Search) { Tabs.Search.QSMarching[x + '_' + y] = 0; }
				});
			}
			uWExportFunction('quickscoutsearch', FNQuickScoutSearch);

			function FNQuickAttack(e) {
				if (Options.OneClickAttackPreset == 0 || !Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset]) {
					QuickMarch.MapClick(e.tile.x, e.tile.y);
					return;
				}

				// send selected preset on attack

				var knt = getAvailableKnights(uW.currentcityid);
				if (!knt[0]) {
					QuickMarch.MapClick(e.tile.x, e.tile.y);
					return;
				}

				var params = uW.Object.clone(uW.g_ajaxparams);
				params.cid = uW.currentcityid;
				params.type = 4;
				params.kid = knt[0].ID;
				if (e.tile.type == "megalith") { params.kid = 0; }
				params.xcoord = e.tile.x;
				params.ycoord = e.tile.y;
				params.gold = 0;
				params.r1 = 0;
				params.r2 = 0;
				params.r3 = 0;
				params.r4 = 0;
				params.r5 = 0;

				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					params["u" + i] = 0;
					if (Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset][i]) {
						params["u" + i] = parseIntNan(Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset][i]);
					}
				}

				var iused = new Array();
				for (var i = 0; i < QuickMarch.ItemList.length; i++) {
					if (Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset]["item" + QuickMarch.ItemList[i]] == true && Seed.items["i" + QuickMarch.ItemList[i]]) {
						iused.push(QuickMarch.ItemList[i]);
					}
				}
				params.items = iused.join(",");

				params.champid = 0;
				if (Options.QuickMarchOptions.AutoChamp) {
					citychamp = getCityChampion(uW.currentcityid);
					if (citychamp.championId && citychamp.status != "10") { params.champid = citychamp.championId; }
				}

				if (Options.QuickMarchOptions.AutoSpell) {
					var spells = getSpellData(uW.currentcityid);
					if (spells.spellavailable && !spells.cooldownactive) {
						params.bs = SpellTypes[faction];
					}
				}

				March.addMarch(params, function (rslt) {
					if (!rslt.ok) {
						uW.Modal.showAlert(uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback));
					}
				}, true); // force march so it never gets queued
			}

			uWExportFunction('quickattack', FNQuickAttack);

			/** Ataca un tile con el preset configurado (OneClickAttackPreset) desde el tab de buscar.
			 *  Es el equivalente del QuickAttack del menú del mapa pero por coordenadas,
			 *  lo que permite atacar varios tiles (ej. Dark Forests) con tropas pre-configuradas. */
			function FNQuickAttackSearch(x, y, cid, auto) {
				// si es automático, chequear slots de rally
				if (auto) {
					var marches = parseIntNan(March.getMarchSlots(cid));
					var maxmarches = parseIntNan(March.getTotalSlots(cid));
					var keepfree = Number(Options.FreeRallySlots);
					if ((marches + keepfree) >= maxmarches) {
						var divid = 'pbsrch_' + x + '_' + y;
						if (ById(divid)) {
							var msg = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Rally Point Full') + '!</span>&nbsp;&nbsp;<SPAN onclick="quickattacksearch(' + x + ',' + y + ',' + cid + ');return false;"><A class=xlink>' + tx("QuickAttack") + '</a></span>';
							ById(divid).innerHTML = msg;
						}
						if (Tabs.Search) { Tabs.Search.QAMarching[x + '_' + y] = 0; }
						return;
					}
				}

				if (Options.OneClickAttackPreset == 0 || !Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset]) {
					QuickMarch.MapClick(x, y, Cities.byID[cid] ? Cities.byID[cid].idx : 0);
					return;
				}

				// enviar el preset seleccionado como ataque

				var knt = getAvailableKnights(cid);
				if (!knt[0]) {
					QuickMarch.MapClick(x, y, Cities.byID[cid] ? Cities.byID[cid].idx : 0);
					return;
				}

				var params = uW.Object.clone(uW.g_ajaxparams);
				params.cid = cid;
				params.type = 4;
				params.kid = knt[0].ID;
				params.xcoord = x;
				params.ycoord = y;
				params.gold = 0;
				params.r1 = 0;
				params.r2 = 0;
				params.r3 = 0;
				params.r4 = 0;
				params.r5 = 0;

				for (var ui in CM.UNIT_TYPES) {
					var i = CM.UNIT_TYPES[ui];
					params["u" + i] = 0;
					if (Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset][i]) {
						params["u" + i] = parseIntNan(Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset][i]);
					}
				}

				var iused = new Array();
				for (var i = 0; i < QuickMarch.ItemList.length; i++) {
					if (Options.QuickMarchOptions.MarchPresets[Options.OneClickAttackPreset]["item" + QuickMarch.ItemList[i]] == true && Seed.items["i" + QuickMarch.ItemList[i]]) {
						iused.push(QuickMarch.ItemList[i]);
					}
				}
				params.items = iused.join(",");

				params.champid = 0;
				if (Options.QuickMarchOptions.AutoChamp) {
					var citychamp = getCityChampion(cid);
					if (citychamp.championId && citychamp.status != "10") { params.champid = citychamp.championId; }
				}

				if (Options.QuickMarchOptions.AutoSpell) {
					var spells = getSpellData(cid);
					if (spells.spellavailable && !spells.cooldownactive) {
						params.bs = SpellTypes[faction];
					}
				}

				March.addMarch(params, function (rslt) {
					if (Tabs.Search) { Tabs.Search.QAMarching[x + '_' + y] = 0; }
					if (!rslt.ok) {
						var sd = 'pbsrch_' + x + '_' + y;
						if (ById(sd)) {
							if (rslt.error_code == 208 || rslt.error_code == 207) {
								var msgt = (rslt.error_code == 208) ? tx('Target is truced - Cannot attack') : tx('You are truced - Cannot attack another player');
								ById(sd).innerHTML = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + msgt + '!</span>';
							}
							else {
								ById(sd).innerHTML = '<span style="color:#800;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tx('Error Code') + ' - ' + rslt.error_code + '</span>&nbsp;&nbsp;<SPAN onclick="quickattacksearch(' + x + ',' + y + ',' + cid + ');return false;"><A class=xlink>' + tx("QuickAttack") + '</a></span>';
							}
						}
					}
				}, true); // force march so it never gets queued
			}
			uWExportFunction('quickattacksearch', FNQuickAttackSearch);

			function FNAutoAttack(e) {
				Tabs.Attack.RouteObject = null; // clear route object
				Tabs.Attack.NewRoute(e.tile.x, e.tile.y);
				ById('bttcAttack').click();
			};

			uWExportFunction('autoattack', FNAutoAttack);

		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	fetchmarch: function (mid, notify) {
		var t = QuickScout;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = mid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (!rslt.ok) { return; }
				if (rslt.march.toPlayerId != 0) {
					t.fetchmarchPlayerInfo(rslt.march.toPlayerId, notify, rslt.march)
				}
				else {
					notify({ errorMsg: "<div>" + tx('There is no longer a city at this location') + "</div>" }, rslt.march);
				}
			},
			onFailure: function () { notify({ errorMsg: tx('AJAX error') }); }
		}, true);
	},

	fetchmarchPlayerInfo: function (uid, notify, march) {
		var t = QuickScout;

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) { notify(rslt, march); },
			onFailure: function () { notify({ errorMsg: tx('AJAX error') }); },
		}, true);
	},

	PlayerPopup: function (rslt, march) {
		var t = QuickScout;
		if (rslt.errorMsg) {
			Dashboard.Recall(march.marchId);
			uW.Modal.showAlert(rslt.errorMsg);
			return;
		}

		var u = rslt.userInfo[0];

		var a = 'None';
		if (u.allianceName)
			a = u.allianceName + ' (' + getDiplomacy(u.allianceId) + ')';

		var n = '<div> <b>Name:</b> ' + u.genderAndName + '<br/><b>Might:</b> ' + addCommas(parseInt(u.might)) +
			'<br/><b>' + uW.g_js_strings.commonstr.alliance + ':</b> ' + a +
			'<br/><b>' + tx('City Co-ords') + ':</b> (' + march.toXCoord + ',' + march.toYCoord + ')' +
			'<br/><b>' + tx('City Level') + ':</b> ' + march.toTileLevel +
			"</div>";

		ModalMultiButton({
			buttons: [{
				txt: "Recall Scout",
				exe: function () {
					uW.attack_recall(march.marchId, 2, uW.currentcityid);
					uW.Modal.hideModal();
				}
			}, {
				txt: "Post to Chat",
				exe: function () {
					cText = 'Name: ' + u.genderAndName + '||UID: ' + enFilter(u.userId) + '||Might: ' + addCommas(parseInt(u.might)) +
						'||' + uW.g_js_strings.commonstr.alliance + ': ' + a +
						'||City Co-ords: (' + march.toXCoord + ',' + march.toYCoord + ')' +
						'||City Level: ' + march.toTileLevel;
					cText = ":::. |QuickScout Report|| " + cText;
					sendChat("/a " + cText);
				}
			}, {
				txt: "Monitor",
				exe: function () {
					uW.btMonitorExternalCallUID(u.userId);
				}
			}, {
				txt: uW.g_js_strings.commonstr.cancel,
				exe: function () {
					uW.Modal.hideModal();
				}
			}],
			body: n,
			title: "QuickScout Result"
		});
	},

	FillSearchDiv: function (rslt, march) {
		setTimeout(Dashboard.Recall, 2000, march.marchId);
		divid = 'pbsrch_' + march.toXCoord + '_' + march.toYCoord;
		if (!ById(divid)) return;

		if (rslt.errorMsg) {
			var n = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Misted Plain';
			ById(divid).innerHTML = n;
			// update search results .. find correct row
			var t = Tabs.Search;
			if (t) {
				var numRows = t.mapDat.length;
				for (var i = 0; i < numRows; i++) {
					if (t.mapDat[i][0] == march.toXCoord && t.mapDat[i][1] == march.toYCoord) {
						t.mapDat[i][4] = parseIntNan(march.toTileLevel);
						t.mapDat[i][6] = 0;
						t.mapDat[i][8] = n;
						t.mapDat[i][9] = 0;
						t.mapDat[i][10] = '';
						t.mapDat[i][11] = 0;
					}
				}
			}
			Tabs.Search.scouted++;
			Tabs.Search.updateMistProgress();
			return;
		}

		var rowStyle = 'style="opacity:0.5;"'; // misted
		var status = '<img title="Offline" style="vertical-align:bottom" src="' + OFFLINE + '"/>';
		var u = rslt.userInfo[0];
		var alli = '---';
		var aID = parseIntNan(u.allianceId);
		if (aID != 0) {
			alli = u.allianceName;
		}

		var n = '<td ' + rowStyle + ' class=xtab nowrap>' + status + PlayerLink(u.userId, u.name) + '</td><td ' + rowStyle + ' class=xtab>&nbsp;</td><td ' + rowStyle + ' class=xtab align=right>' + addCommas(parseIntNan(u.might)) + '</span></td><td ' + rowStyle + ' class=xtab><span style=' + DiplomacyColours(aID) + '>' + alli + '</span></td>';
		ById(divid).outerHTML = n;

		// update search results .. find correct row

		var t = Tabs.Search;
		if (t) {
			var numRows = t.mapDat.length;
			for (var i = 0; i < numRows; i++) {
				if (t.mapDat[i][0] == march.toXCoord && t.mapDat[i][1] == march.toYCoord) {
					t.mapDat[i][4] = parseIntNan(march.toTileLevel);
					t.mapDat[i][5] = march.toCityId;
					t.mapDat[i][6] = u.userId;
					t.mapDat[i][8] = u.name;
					t.mapDat[i][9] = parseIntNan(u.might);
					t.mapDat[i][10] = alli;
					t.mapDat[i][11] = aID;

					// fire off player online query
					var uList = [];
					uList.push(u.userId);
					getOnline(uList, function (r) {
						var t = Tabs.Search;
						var numRows = t.mapDat.length;
						for (var u in r.data) {
							for (var i = 0; i < numRows; i++) {
								if (t.mapDat[i][6] == u) { t.mapDat[i][12] = r.data[u] ? 1 : 0; }
							}
						}
						t.dispMapTable();
					});
					Tabs.Search.scouted++;
					Tabs.Search.updateMistProgress();
				}
			}
		}
	},
}
