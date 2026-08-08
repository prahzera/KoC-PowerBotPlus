function getFactionName(faction) {
	var prestige = "";
	var pt = parseIntNan(faction);
	switch (pt) {
		case 1: prestige = uW.g_js_strings.commonstr.druid; break;
		case 2: prestige = uW.g_js_strings.commonstr.fey; break;
		case 3: prestige = uW.g_js_strings.commonstr.briton; break;
		default: prestige = "";
	}
	return prestige;
}

function ModalMultiButton(ModalObject) {
	var ModalBody = uWCreateObjectIn('btModalBody', {});
	ModalBody.title = ModalObject.title;
	ModalBody.body = ModalObject.body;
	ModalBody.buttons = uWCloneInto([]);
	for (var i = 0; i < ModalObject.buttons.length; i++) {
		if (typeof createObjectIn == 'function') {
			var newobj = createObjectIn(uW, { defineAs: 'btTempObj' });
			newobj.txt = ModalObject.buttons[i].txt;
			exportFunction(ModalObject.buttons[i].exe, newobj, { defineAs: 'exe' });
			ModalBody.buttons.push(uW.btTempObj);
		}
		else {
			var newobj = ModalBody.buttons.push({ txt: ModalObject.buttons[i].txt, exe: ModalObject.buttons[i].exe });
		}
	}
	uW.Modal.multiButton(ModalBody);
}

/** KOC Map interface **/

function CMapAjax() {
	this.normalize = normalize;
	this.LookupMap = LookupMap;
	this.generateBlockList = generateBlockList;

	function normalize(x) {
		if (x >= 750) { x -= 750; }
		else if (x < 0) { x += 750; }
		return parseInt(x / 5) * 5;
	}

	function LookupMap(blockString, notify, ignoredelay) {
		if (!ignoredelay && (MAP_DELAY_WATCH > Number(uW.unixtime()))) {
			notify({ "ok": false });
			return;//we're slowing down the requests so the server doesn't get bogged.
		};

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.blocks = blockString;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMapTiles.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (!rslt.ok) {
					if (GlobalOptions.ExtendedDebugMode) {
						logit('Map Error - ' + JSON2.stringify(rslt));
					}
				}
				if (!ignoredelay) { MAP_DELAY_WATCH = Number(uW.unixtime()) + Number(Number(MAP_DELAY) / 1000); }
				notify(rslt);
			},
			onFailure: function () {
				if (GlobalOptions.ExtendedDebugMode) {
					logit('Map Ajax Fail');
				}
				notify({ "ok": false });
			},
		});
	}

	function generateBlockList(X, Y, Radius) {
		var BlockList = [];

		var minX = normalize(X);
		var minY = normalize(Y);
		var maxX = normalize(X + (Radius * 2) + 1);
		var maxY = normalize(Y + (Radius * 2) + 1);

		if (minX <= maxX && minY <= maxY) { // no map boundary - use actual co-ords. (If map boundary you need block numbers in multiples of 5).
			minX = X;
			minY = Y;
			maxX = X + (Radius * 2) + 1;
			maxY = Y + (Radius * 2) + 1;
		}

		var width = parseInt(((Radius * 2) + 5) / 5) * 5;
		var Xwidth5 = parseInt(width / 5);
		var Ywidth5 = parseInt(width / 5);

		if (minX != X) Xwidth5++; // extra block row if required
		if (minY != Y) Ywidth5++; // extra block column if required

		for (var x = 0; x < Xwidth5; x++) {
			var xx = minX + (x * 5);
			if (xx >= 750) { xx -= 750; }
			for (var y = 0; y < Ywidth5; y++) {
				var yy = minY + (y * 5);
				if (yy >= 750) { yy -= 750; }
				BlockList.push('bl_' + xx + '_bt_' + yy);
			}
		}
		return BlockList;
	}
}

function TileImage(tt, lv, pid, fac, faclvl, st) {
	var img = '';
	var imgtxt = '';
	if (tt <= 50) { // wild
		if (tt == 50 && st && st != 0) { // new alliance sub-types
			if (st == 1) { // HQ
				img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'alliancehq/map_hq.png\');background-size:30px 30px;" title="' + tx('Alliance HQ') + '">&nbsp;</div>';
			}
		}
		else {
			if (lv >= 7) { lv = 7 }
			else if (lv >= 4) { lv = 4 }
			else { lv = 1 };
			imgtxt = wildImages[tt];
			img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/' + imgtxt + '_lvl' + lv + '.png\');background-size:30px 30px;" title="' + imgtxt + '">&nbsp;</div>';
		}
		return img;
	}
	if (tt == 52) { // ruin (?)
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/ruins.png\');background-size:30px 30px;" title="' + uW.g_js_strings.commonstr.ruin + '">&nbsp;</div>';
		return img;
	}
	if (tt == 53) { // mist
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/city_mist.png\');background-size:30px 30px;" title="' + uW.g_js_strings.commonstr.mists + '">&nbsp;</div>';
		return img;
	}
	if (tt == 55) { // merc camp
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/mercenary_hideout.png\');background-size:30px 30px;" title="' + uW.g_js_strings.commonstr.mercenaryHideout + '">&nbsp;</div>';
		return img;
	}
	if (tt == 56) { // nomad camp
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/nomad_tile.png\');background-size:30px 30px;" title="' + uW.g_js_strings.nomad.camp + '">&nbsp;</div>';
		return img;
	}
	if (tt == 57) { // megalith
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/runic_megalith_tile.png\');background-size:30px 30px;" title="' + uW.g_js_strings.koth.eventname + '">&nbsp;</div>';
		return img;
	}
	if (tt == 54) { // dark forest
		if (lv >= 11) { lv = 11 }
		else if (lv >= 10) { lv = 10 }
		else if (lv >= 7) { lv = 7 }
		else if (lv >= 4) { lv = 4 }
		else { lv = 1 };
		img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/boss_lvl' + lv + '.png\');background-size:30px 30px;" title="' + uW.g_js_strings.commonstr.darkForest + '">&nbsp;</div>';
		return img;
	}
	if (tt == 51) { // city or barbarian camp!?!
		if (!pid || pid == 0) {
			if (lv >= 11) {
				img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/Barbarian_Camp_lvl11.png\');background-size:30px 30px;" title="' + uW.g_js_strings.commonstr.barbariancamp + '">&nbsp;</div>';
				return img;
			}
			else {
				if (lv >= 7) { lv = 7 }
				else if (lv >= 4) { lv = 4 }
				else { lv = 1 };
				img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/barbarian_lvl' + lv + '.png\');background-size:30px 30px;" title="' + uW.g_js_strings.commonstr.barbariancamp + '">&nbsp;</div>';
				return img;
			}
		}
		else {
			if (lv >= 11) { lv = 11 }
			else if (lv >= 10) { lv = 10 }
			else if (lv >= 7) { lv = 7 }
			else if (lv >= 5) { lv = 5 }
			else if (lv >= 3) { lv = 3 }
			else { lv = 1 };
			var title = uW.g_js_strings.commonstr.city;
			img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'buildings/castle_lvl' + lv + '_26.png\');background-size:30px 30px;" title="' + title + '">&nbsp;</div>';
			if (fac) {
				title = getFactionName(fac) + ' (' + uW.g_js_strings.commonstr.level + ' ' + faclvl + ')';
				switch (fac) {
					case 1: { // druid
						var BackPos = '';
						if (lv >= 7) { BackPos = '-188px 0px;'; }
						else if (lv >= 4) { BackPos = '-93px 0px;'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'map_castle01.png\');' + BackPos + 'background-size:90px 30px;" title="' + title + '">&nbsp;</div>';
						break;
					}
					case 2: { // fey
						var BackPos = '01';
						if (lv >= 7) { BackPos = '03'; }
						else if (lv >= 4) { BackPos = '02'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'fey%20cityMap' + BackPos + '.png\');background-size:30px 30px;" title="' + title + '">&nbsp;</div>';
						break;
					}
					case 3: { // briton
						var BackPos = '01';
						if (lv >= 7) { BackPos = '03'; }
						else if (lv >= 4) { BackPos = '02'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'briton_cityMap' + BackPos + '.png\');background-size:30px 30px;" title="' + title + '">&nbsp;</div>';
						break;
					}
					default: { // ???? assume new faction, put fey image out until we know any better.
						var BackPos = '01';
						if (lv >= 7) { BackPos = '03'; }
						else if (lv >= 4) { BackPos = '02'; }
						img = '<div style="width:30px;height:30px;vertical-align:middle;background-image:url(\'' + IMGURL + 'fey%20cityMap' + BackPos + '.png\');background-size:30px 30px;" title="' + title + '">&nbsp;</div>';
						break;
					}
				}
			}
			return img;
		}
	}
}

function TroopImage(tt, style, suffix) {
	var totalcountTroop = 0;
	for (var ui in CM.UNIT_TYPES) {
		totalcountTroop = CM.UNIT_TYPES[ui];
	}
	if (style == null) style = "width:20px;height:20px;vertical-align:middle;";
	if (suffix == null) suffix = "&nbsp;";
	if (tt <= totalcountTroop) { var TroopText = uW.unitcost['unt' + tt][0]; }
	else { var TroopText = uW.fortcost['frt' + tt][0]; }
	var img = '<img style="' + style + '" src="' + TroopImagePrefix + tt + TroopImageSuffix + '" title="' + TroopText + '">' + suffix;
	return img;
}

function TroopImageBig(tt) { return TroopImage(tt, "vertical-align:middle;"); }
function TroopImageBigHeader(tt) { return TroopImage(tt, "", ""); }

function ResourceImage(path, title) {
	var img = '<img style="width:20px;height:20px;vertical-align:middle;" src="' + path + '" title="' + title + '">&nbsp;';
	return img;
}

function capitalize(value) {
	newValue = "";
	var pattern = " ";
	value = value.split(pattern);
	for (var i = 0; i < value.length; i++) {
		newValue += value[i].substring(0, 1).toUpperCase() +
			value[i].substring(1, value[i].length);
		if (i < value.length - 1) { newValue += " "; }
	}
	return newValue;
}

function BlankifZero(val) {
	if (val == 0) { return ""; } else { return val; }
}

function createToolTip(title, elem, TempStatEffects, TempStatTiers) {
	var TempcText = "";
	if (!elem) return;
	if (title != "") { TempcText += "<b>" + title + "</b><br>&nbsp;<br>"; }

	var SortOrder = [];
	if (Options.AlternateSortOrder) { for (var z in AlternateSortOrder) SortOrder.push(AlternateSortOrder[z]); }
	else { for (var z in TempStatEffects) SortOrder.push(z); }

	for (var z in SortOrder) {
		var k = SortOrder[z];
		var HisContent = "";
		var effectName = getThroneEffectName(k, TempStatTiers[k]);
		if (TempStatEffects[k] && (TempStatEffects[k] != 0) && uW.cm.thronestats["effects"][k]) HisContent = (Math.round(TempStatEffects[k] * 100) / 100) + '% ' + effectName;
		if (HisContent != "") { TempcText += HisContent + "<br>"; }
	}

	jQuery('#' + elem.id).children("span").remove();
	jQuery('#' + elem.id).append('<span class="trtip">' + TempcText + '</span>');
}

function UseDove(iid) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/doveOut.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				var boostTime = 43200;
				Seed.player.truceExpireUnixTime = uW.unixtime() + boostTime;
				Seed.player.warStatus = 3;
				CM.InventoryView.removeItemFromInventory(iid);
				uW.update_boosts()
			} else {
				uW.Modal.showAlert(uW.printLocalError(rslt.error_code, rslt.msg, rslt.feedback))
			}
		},
	}, true); // noretry
}
