/** uW Modifiers **/

function ModifyUWObjects() {

	function DoveOfPeace(iid) {
		// popup
		ModalMultiButton({
			buttons: [{ txt: tx("Use Dove of Peace"), exe: function () { uW.Modal.hideModal(); UseDove(iid); } },
			{ txt: tx("Cancel Request"), exe: function () { uW.Modal.hideModal(); } }],
			body: "<center> " + tx('Please confirm you want to use a Dove of Peace') + "?</center>",
			title: tx("Confirm Dove")
		});
	};

	function ShowCity(idx) {
		SelectCity(idx);
		uW.changeview_city(ById("mod_views_city"));
		uW.btChangeDashCity(uW.currentcityid);
	}

	function ShowKnightsHall(city) {
		if (OpenBuilding(city + 1, "7")) {
			uW.changeKnightModalTabs(1);
		}
	}

	function ShowGuardians(city) {
		SelectCity(city + 1);
		CM.guardianModalModel.open();
	}

	function ShowEmbassy(city) {
		OpenBuilding(city + 1, "8");
	}

	function ShowWalls(city) {
		SelectCity(city + 1);
		if (Seed.buildings["city" + uW.currentcityid].pos1) { uW.modal_build(1); }
		else { uW.modal_buildnew(1); }
	}

	function SendAllHome(cityId) {
		jQuery('#btSendAllHome').addClass("disabled");
		Dashboard.serverwait = true;
		var Returns = [];
		Returns = Dashboard.Reins.slice();
		var delayer = 0;
		for (var r in Returns) {
			var mid = Returns[r];
			delayer = delayer + 1;
			setTimeout(Dashboard.SendHome, (500 * delayer), mid); // spread them out ...
		}
		delayer = delayer + 1;

		function ClearAtEnd() {
			jQuery('#btSendAllHome').removeClass("disabled");
			Dashboard.serverwait = false;
		};

		setTimeout(ClearAtEnd, (500 * delayer)); // let screen updates run again
	}

	function CreateChampionPopUp(elem, chkcityId, localchamp, champid, maparea, cityinfo) {
		effects = ById(elem.id + 'effects');
		// do a compare, or get local champ details...
		if (Options.DashboardOptions.ChampionCompare || localchamp) {
			var oureffects = '<table cellspacing=0 style="background-color:none;"><tr><td class=xtab><b><center><br>' + uW.g_js_strings.champ.no_champ + '<br>' + tx('Assigned') + '!</center></b></td></tr></table>';

			try {
				for (var y in Seed.champion.champions) {
					chkchamp = Seed.champion.champions[y];
					if (chkchamp.assignedCity && !Cities.byID[chkchamp.assignedCity]) { chkchamp.assignedCity = 0; }
					if (chkchamp.championId) {
						if ((!champid && chkchamp.assignedCity == chkcityId) || (chkchamp.championId == champid)) {
							var status = '';
							var champstatus = chkchamp.status;
							if (maparea) {
								if (champstatus != "10") { status = ' (' + tx('Defending') + ')'; }
								else { status = ' (' + tx('Marching') + ')'; }
							}
							else {
								if (cityinfo) {
									var status = '</b><br><i>';
									if (chkchamp.assignedCity == 0) { status += tx('Unassigned') + '</i>'; }
									else {
										if (champstatus != "10") { status += tx('Defending') + ' '; }
										else { status += tx('Marching from') + ' '; }
										status += Cities.byID[chkchamp.assignedCity].name + '</i>';
									}
								}
							}
							oureffects = '<table cellspacing=0 class=xtab><tr><td colspan=2><b>' + chkchamp.name + status + '</b></td></tr><tr><td colspan=2><b>' + uW.g_js_strings.report_view.champion_stats + '</b></td></tr>';

							// equipped items

							var CHAMP_DATA = BuildChampData(uW.kocChampionItems, chkchamp.championId);
							var equippedchampstats = CHAMP_DATA.equippedchampstats;
							var equippedtroopstats = CHAMP_DATA.equippedtroopstats;
							var equippedbossstats = CHAMP_DATA.equippedbosstats;
							var SteelHoofCount = CHAMP_DATA.SteelHoofCount;
							var LightBringerCount = CHAMP_DATA.LightBringerCount;
							var DragonScaleCount = CHAMP_DATA.DragonScaleCount;
							var TestCount = CHAMP_DATA.TestCount;
							var WildHideCount = CHAMP_DATA.WildHideCount;
							var VespersCount = CHAMP_DATA.VespersCount;
							var SilverCount = CHAMP_DATA.SilverCount;
							var WarlockCount = CHAMP_DATA.WarlockCount;
							var IceQueenCount = CHAMP_DATA.IceQueenCount;
							var EagleCount = CHAMP_DATA.EagleCount;
							var DragonWarriorCount = CHAMP_DATA.DragonWarriorCount;

							var gotchamp = false;
							for (var k in equippedchampstats) {
								gotchamp = true;
								str = uW.g_js_strings.effects['name_' + k];
								var chEffect = getChampCappedValue(k, equippedchampstats[k]);
								if (k >= 300) {
									if (k == 314) { str = tx('Add. Defend Bonus'); }
									else { str = tx('Inc. Bonus') + ' ' + str.split(" " + tx("equipment"))[0]; }
									var champvalue = +((chEffect * 100).toFixed(2)) + "%";
								}
								else {
									var champvalue = +(chEffect.toFixed(2));
								}
								if (str && str != "") { oureffects += "<tr><td>" + str + "</td><td>" + champvalue + "</td></tr>"; }
							}
							if (VespersCount >= 4) {
								gotchamp = true;
								oureffects += "<tr><td>" + uW.g_js_strings.champ.vespers + ": " + uW.g_js_strings.champ.damage + "</td><td>" + CM.CHAMPION.getVespersDamageSetBonus().replace('+', '') + "</td></tr>";
							}

							if (!gotchamp) { oureffects += '<tr><td colspan=2><i>None Available</i></td></tr>'; }
							oureffects += "<tr><td colspan=2><b>" + uW.g_js_strings.report_view.troop_stats + "</b></td></tr>";
							var gottroops = false;
							if ((SteelHoofCount >= 4 && LightBringerCount >= 5) || (DragonScaleCount >= 6 && LightBringerCount >= 5)) {
								gottroops = true;
								if (SteelHoofCount >= 4 && LightBringerCount >= 5) {
									oureffects += "<tr><td>" + uW.g_js_strings.champ.doubleBonus + ": " + uW.g_js_strings.champ.attackRange + "</td><td>" + CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+', '') + "</td></tr>";
								}
								else {
									oureffects += "<tr><td>" + uW.g_js_strings.champ.doubleBonus + ": " + uW.g_js_strings.champ.attackLife + "</td><td>" + CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+', '') + "</td></tr>";
								}
							} else {
								if (SteelHoofCount >= 4 || DragonScaleCount >= 6) {
									gottroops = true;
									if (SteelHoofCount >= 4) {
										oureffects += "<tr><td>" + uW.g_js_strings.champ.steelhoofsBonus + ": " + uW.g_js_strings.champ.range + "</td><td>" + CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+', '') + "</td></tr>";
									}
									else {
										oureffects += "<tr><td>" + uW.g_js_strings.champ.dragonscalesBonus + ": " + uW.g_js_strings.champ.life + "</td><td>" + CM.CHAMPION.getSteelhoofsRangeSetBonus().replace('+', '') + "</td></tr>";
									}
								} else {
									if (LightBringerCount >= 5) {
										gottroops = true;
										oureffects += "<tr><td>" + uW.g_js_strings.champ.lightbringersBonus + ": " + uW.g_js_strings.champ.attack + "</td><td>" + CM.CHAMPION.getLightbringersRangeSetBonus().replace('+', '') + "</td></tr>";
									}
									else {
										if (WildHideCount >= 5) {
											gottroops = true;
											oureffects += "<tr><td>" + uW.g_js_strings.champ.wildhideBonus + ": " + uW.g_js_strings.champ.attack + "</td><td>" + CM.CHAMPION.getWildhideAttackSetBonus().replace('+', '') + "</td></tr>";
										}
										else {
											if (SilverCount >= 5) {
												gottroops = true;
												oureffects += "<tr><td>" + uW.g_js_strings.champ.silver + ": " + uW.g_js_strings.champ.silverKnightBonus + "</td><td>" + CM.CHAMPION.getSilverknightSpeedDefenceSetBonus().replace('+', '') + "</td></tr>";
											}
											if (WarlockCount >= 5) {
												gottroops = true;

											}
											if (IceQueenCount >= 5) {
												gottroops = true;

											}
											if (EagleCount >= 5) {
												gottroops = true;

											}
											if (DragonWarriorCount >= 5) {
												gottroops = true;

											}
										}
									}
								}
							}
							for (var k in equippedtroopstats) {
								gottroops = true;
								str = uW.g_js_strings.effects['name_' + k];
								if (str && str != "") {
									var chEffect = getChampCappedValue(k, equippedtroopstats[k]);
									oureffects += "<tr><td>" + str + "</td><td>" + (Math.round(chEffect * 100) / 100) + "</td></tr>";
								}
							}
							if (!gottroops) { oureffects += '<tr><td colspan=2><i>None Available</i></td></tr>'; }
							for (var k in equippedbossstats) {
								var gotboss = false;
								var bosseffects = '';
								for (var kk in equippedbossstats[k]) {
									gotboss = true;
									str = uW.g_js_strings.effects['name_' + kk];
									if (str && str != "") {
										var chEffect = getChampCappedValue(kk, equippedbossstats[k][kk]);
										var champvalue = +(chEffect.toFixed(2)) + "%";
										bosseffects += "<tr><td>" + str + "</td><td>" + champvalue + "</td></tr>";
									}
								}
								if (gotboss) { oureffects += "<tr><td colspan=2><b>" + uW.itemlist['i' + k].name + ' ' + uW.g_js_strings.commonstr.stats + "</b></td></tr>" + bosseffects; }
							}
							oureffects += "</table>";
						}
					}
				}
			}
			catch (err) {
				logerr(err); // write to log
				oureffects = '<table cellspacing=0><tr><td class=xtab><b><center>' + tx('Error reading champion data') + '</center></b></td></tr></table>';
			}
		}

		td = ById(elem.id + 'td');
		jQuery('#' + td.id).children("span").remove();
		if (maparea) {
			uW.showTooltip(oureffects, td, null, 'mod_maparea'); return;
		}
		else {
			if (localchamp) {
				jQuery('#' + td.id).append('<span class="trtip"><table cellspacing=0><tr style="vertical-align:top;"><td class=xtab>' + oureffects + '</td></tr></table></span>');
			}
			else {
				if (Options.ChampionCompare) {
					jQuery('#' + td.id).append('<span class="trtip"><table cellspacing=0><tr style="vertical-align:top;"><td class=xtab>' + effects.value + '</td><td class=xtab>' + oureffects + '</td></tr></table></span>');
				}
				else {
					jQuery('#' + td.id).append('<span class="trtip">' + effects.value + '</span>');
				}
			}
		}
	}

	function ChangeDashCity(city) {
		Dashboard.show(Cities.byID[city]);
	}

	function StopProp(e) {
		e.stopPropagation();
	}

	function CityChanged() {
		if (popDash) uW.btChangeDashCity(uW.currentcityid);
		Options.lmain = Cities.byID[uW.currentcityid].idx;
		saveOptions();
		SetChampionIcon();
	}

	uWExportFunction('btArthurCheck', function (a) { logit('arthurCheck intercepted'); return; });
	uW.arthurCheck = uW.btArthurCheck;

	uWExportFunction('pthideMe', hideMe);
	uWExportFunction('ptStopProp', StopProp);
	uWExportFunction('btDoveOfPeace', DoveOfPeace);
	uWExportFunction('btShowCity', ShowCity);
	uWExportFunction('btGotoMapHide', GotoMapHide);
	uWExportFunction('btGotoMap', GotoMap);
	uWExportFunction('btGotoMapRpt', GotoMapRpt);
	uWExportFunction('btShowKnightsHall', ShowKnightsHall);
	uWExportFunction('btShowGuardians', ShowGuardians);
	uWExportFunction('btShowEmbassy', ShowEmbassy);
	uWExportFunction('btShowWalls', ShowWalls);
	uWExportFunction('btSendAllHome', SendAllHome);
	uWExportFunction('btCreateChampionPopUp', CreateChampionPopUp);
	uWExportFunction('btDashboardButtonClick', WideScreen.ShowDashboard);
	uWExportFunction('btChangeDashCity', ChangeDashCity);

	uWExportFunction('btStartKeyTimer', StartKeyTimer);
	uWExportFunction('btSelectTroopType', Dashboard.SelectTroopType);
	uWExportFunction('btSetRitualLength', Dashboard.SetRitualLength);
	uWExportFunction('btCheckDefaultRitual', Dashboard.CheckDefaultRitual);
	uWExportFunction('btStartRitual', Dashboard.StartRitual);
	uWExportFunction('btStopRitual', Dashboard.StopRitual);
	uWExportFunction('btQuickSacrifice', Dashboard.QuickSacrifice);
	uWExportFunction('btSetMaxTroops', Dashboard.SetMaxTroops);
	uWExportFunction('btSendHome', Dashboard.SendHome);
	uWExportFunction('btSwitchThroneRoom', Dashboard.SwitchThroneRoom);
	uWExportFunction('btCancelMarshall', Dashboard.CancelMarshall);
	uWExportFunction('btChangeMarshall', Dashboard.ChangeMarshall);
	uWExportFunction('btSetMarshall', Dashboard.SetMarshall);
	uWExportFunction('btBoostMarshall', Dashboard.BoostMarshall);
	uWExportFunction('btCancelChampion', Dashboard.CancelChampion);
	uWExportFunction('btChangeChampion', Dashboard.ChangeChampion);
	uWExportFunction('btFreeChampion', Dashboard.FreeChampion);
	uWExportFunction('btSetChampion', Dashboard.SetChampion);
	uWExportFunction('btSelectDefenders', Dashboard.SelectDefenders);
	uWExportFunction('btSelectDefTroopType', Dashboard.SelectDefTroopType);
	uWExportFunction('btSetMaxDefTroops', Dashboard.SetMaxDefTroops);
	uWExportFunction('btAddDefenders', Dashboard.AddDefenders);
	uWExportFunction('btNewDefPreset', Dashboard.NewDefPreset);
	uWExportFunction('btChgDefPreset', Dashboard.ChgDefPreset);
	uWExportFunction('btDelDefPreset', Dashboard.DelDefPreset);
	uWExportFunction('btSaveDefPreset', Dashboard.SaveDefPreset);
	uWExportFunction('btSetCurrentPreset', Dashboard.SetCurrentPreset);
	uWExportFunction('btCancelDefPreset', Dashboard.CancelDefPreset);
	uWExportFunction('btSelectDefPreset', Dashboard.SelectDefPreset);
	uWExportFunction('btSetPresetDefenders', Dashboard.SetPresetDefenders);
	uWExportFunction('btRecall', Dashboard.Recall);
	uWExportFunction('btToggleSanctuary', Dashboard.ToggleSanctuary);

	uWExportFunction('btOverrideDash', Tabs.Options.OverrideDash);
	uWExportFunction('btResetDash', Tabs.Options.ResetDash);

	uWExportFunction('btDelMarchPreset', QuickMarch.DelMarchPreset);
	uWExportFunction('btSaveMarchPreset', QuickMarch.SaveMarchPreset);
	uWExportFunction('btSelectMarchPreset', QuickMarch.SelectMarchPreset);

	uWExportFunction('btAddPowerBarLink', AddPowerBarLink);

	uWExportFunction('btAlliArcanaSelChange', Dashboard.SetAlliArcanaDesc);
	uWExportFunction('btPersArcanaSelChange', Dashboard.SetPersArcanaDesc);
	uWExportFunction('btDeactivateArcana', Dashboard.DeactivateArcana);

	uWExportFunction('btBoostSpeedSelChange', Dashboard.SetSpeedBoostDesc);
	uWExportFunction('btBoostAccuracySelChange', Dashboard.SetAccuracyBoostDesc);

	// add a battle button next to overview

	if (GlobalOptions.btOverviewDashboardBtn) {
		var el1 = ById('mod_cityinfo');
		var el2 = el1.getElementsByClassName('hd');
		for (var e in el2) {
			el2[e].innerHTML += '&nbsp;<a class="inlineButton btButton blue14" style="position:static;" onclick="btDashboardButtonClick(true); return false;"><span style="width:57px;">' + tx('Dashboard') + '</span></a>';
			var el3 = el2[e].getElementsByClassName('button14');
			for (var e2 in el3) {
				el3[e2].style["position"] = "static";
				el3[e2].className = 'inlineButton btButton blue14';
				break;
			}
			break;
		}
	};

	uWExportFunction('btCityChanged', CityChanged);

	var cityselmod = new CalterUwFunc("citysel_click", [['cm.PrestigeCityView.render()', 'cm.PrestigeCityView.render();btCityChanged();']]);
	cityselmod.setEnable(cityselmod.isAvailable());

	// check dashboard and powerbar positions in 5 seconds... (after any other scripts loaded)
	setTimeout(WideScreen.CheckDashPosition, 5000);

	// check for login reward after 5 seconds...
	setTimeout(ClaimDailyReward, 5000);
}
