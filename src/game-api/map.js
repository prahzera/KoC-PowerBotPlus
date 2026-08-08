function GotoMapHide(x, y) {
	try { uW.Modal.hideModal(); } catch (e) { }
	try { Modal.hideModal(); } catch (e) { }
	GotoMap(x, y);
}

function GotoMapRpt(x, y) {
	if (Options.hideOnGoto) { Rpt.CloseReport(); }
	GotoMapHide(x, y);
}

function GotoMap(x, y) {
	if (Options.hideOnGoto) { hideMe(); }

	function GoMap() {
		ById('mapXCoor').value = x;
		ById('mapYCoor').value = y;
		uW.reCenterMapWithCoor();
		var a = ById("mod_views").getElementsByTagName("a");
		for (var b = 0; b < a.length; b++) {
			a[b].className = "buttonv2 nav std"
		}
		ById('mod_views_map').className = "buttonv2 nav std sel";
		ById("maparea_city").style.display = 'none';
		ById("maparea_fields").style.display = 'none';
		ById("maparea_map").style.display = 'block';
		uW.tutorialClear()
	}
	setTimeout(GoMap, 0);
}

function CityResourceHint(elem, citynum) {
	var TT = '<center><b>' + Cities.cities[citynum].name + '</b></center>';
	var cid = Cities.cities[citynum].id;
	TT += '<table style="font-weight:normal;" class=xtab cellpadding=0 cellspacing=0 width=100%>';
	TT += '<tr><td>' + ResourceImage(GoldImage, uW.g_js_strings.commonstr.gold);
	TT += '</td><td>' + addCommas(parseInt(Seed.citystats["city" + cid]['gold'][0])) + '</td></tr>';
	for (var r = 1; r < 5; r++) {
		TT += '<tr><td>';
		if (r == 1) { TT += ResourceImage(FoodImage, uW.g_js_strings.commonstr.food); }
		else {
			if (r == 2) { TT += ResourceImage(WoodImage, uW.g_js_strings.commonstr.wood); }
			else {
				if (r == 3) { TT += ResourceImage(StoneImage, uW.g_js_strings.commonstr.stone); }
				else {
					if (r == 4) { TT += ResourceImage(OreImage, uW.g_js_strings.commonstr.ore); }
				}
			}
		}
		TT += '</td><td>' + addCommas(parseIntNan(Seed.resources['city' + cid]['rec' + r][0] / 3600)) + '</td></tr>';
	}
	TT += '<tr><td>' + ResourceImage(AetherImage, uW.g_js_strings.commonstr.aetherstone);
	TT += '</td><td>' + addCommas(parseIntNan(Seed.resources['city' + cid]['rec5'][0])) + '</td></tr></table>';

	jQuery(elem.parentNode).children("span").remove();
	jQuery(elem.parentNode).append('<span class="tooltip" style="margin-top:25px;margin-left:-20px;white-space: pre-line; word-wrap: break-word;">' + TT + '</span>');
};

function CityResourceHintOff(elem) {
	jQuery(elem.parentNode).children("span").remove();
};

function FillBookmarkList(sel) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.requestType = "GET_BOOKMARK_INFO";
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/tileBookmark.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				var m = "";
				var bookmarkInfo = rslt.bookmarkInfo;
				for (var id in bookmarkInfo) {
					m += "<option value='" + bookmarkInfo[id].xCoord + "," + bookmarkInfo[id].yCoord + "'>" + bookmarkInfo[id].name + " (" + bookmarkInfo[id].xCoord + ", " + bookmarkInfo[id].yCoord + ") </option>";
				}
				ById(sel).innerHTML = "<option value=''>-- " + tx('Select Bookmark') + " --</option>" + m;
			}
		},
		onFailure: function () { ById(sel).innerHTML = "<option>" + tx('Server Error') + "</option>"; },
	}, true)
}

function PlotCityImage(cityNum, eMap) {
	var city = Cities.cities[cityNum];
	var x = parseInt((provMapCoords.mapWidth * city.x) / 750);
	var y = parseInt((provMapCoords.mapHeight * city.y) / 750);
	var ce = document.createElement('div');
	ce.style.backgroundImage = "url('" + URL_CASTLE_BUT + "')";
	ce.style.backgroundSize = "16px 16px"
	ce.style.opacity = '1.0';
	ce.style.position = 'relative';
	ce.style.display = 'block';
	ce.style.width = '16px';
	ce.style.height = '16px';
	ce.style.color = 'black';
	ce.style.border = '1px solid #000';
	ce.style.fontWeight = 'bold';
	ce.style.fontSize = '10px';
	ce.style.textAlign = 'center';
	ce.style.top = (y + provMapCoords.topMargin - (cityNum * 16) - 8) + 'px';
	ce.style.left = (x + provMapCoords.leftMargin - 8) + 'px';
	ce.title = city.name + " (" + city.x + ',' + city.y + ')';
	ce.innerHTML = '<a onclick="btGotoMap(' + city.x + ',' + city.y + ')">&nbsp;</a>';
	eMap.appendChild(ce);
	ce.innerHTML = (cityNum + 1) + '';
};

function PlotAllianceHQ(eMap, Data) {
	if (!Seed.allianceHQ) return;
	var x = parseInt(Seed.allianceHQ.hq_xcoord);
	var y = parseInt(Seed.allianceHQ.hq_ycoord);
	var city = tx('Alliance HQ');
	var xplot = parseInt((provMapCoords.mapWidth * x) / 750);
	var yplot = parseInt((provMapCoords.mapHeight * y) / 750);
	var ce = document.createElement('div');
	ce.style.background = 'cyan';
	ce.style.opacity = '1.0';
	ce.style.position = 'relative';
	ce.style.display = 'block';
	ce.style.width = '4px';
	ce.style.height = '4px';
	ce.style.top = (yplot + provMapCoords.topMargin - (4 * Data.length) - ((Seed.cities.length) * 18)) + 'px';
	ce.style.left = (xplot + provMapCoords.leftMargin - 2) + 'px';
	ce.title = city + ' (' + x + ',' + y + ')';
	ce.innerHTML = '<a onclick="btGotoMap(' + x + ',' + y + ')">&nbsp;</a>';
	eMap.appendChild(ce);
	// plot alliance aura
	if (ArcanaEnabled()) {
		var auradistance = parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance);
		var Aura = [];
		//left
		var base = parseIntNan(Seed.allianceHQ.hq_xcoord) - auradistance;
		if (base < 0) { base += 750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_ycoord) - auradistance;
		if (slide < 0) { slide += 750; }
		for (var y = 0; y <= (auradistance * 2); y++) {
			var checky = slide + y;
			if (checky > 750) { checky -= 750; }
			for (var x = 0; x < auradistance; x++) {
				var checkx = base + x;
				if (checkx >= 750) { checkx -= 750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({ X: checkx, Y: checky });
					break;
				}
			}
		}
		//right
		var base = parseIntNan(Seed.allianceHQ.hq_xcoord) + auradistance;
		if (base >= 750) { base -= 750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_ycoord) - auradistance;
		if (slide < 0) { slide += 750; }
		for (var y = 0; y <= (auradistance * 2); y++) {
			var checky = slide + y;
			if (checky >= 750) { checky -= 750; }
			for (var x = 0; x < auradistance; x++) {
				var checkx = base - x;
				if (checkx < 0) { checkx += 750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({ X: checkx, Y: checky });
					break;
				}
			}
		}
		//top
		var base = parseIntNan(Seed.allianceHQ.hq_ycoord) - auradistance;
		if (base < 0) { base += 750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_xcoord) - auradistance;
		if (slide < 0) { slide += 750; }
		for (var x = 0; x <= (auradistance * 2); x++) {
			var checkx = slide + x;
			if (checkx >= 750) { checkx -= 750; }
			for (var y = 0; y < auradistance; y++) {
				var checky = base + y;
				if (checky >= 750) { checky -= 750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({ X: checkx, Y: checky });
					break;
				}
			}
		}
		//bottom
		var base = parseIntNan(Seed.allianceHQ.hq_ycoord) + auradistance;
		if (base >= 750) { base -= 750; }
		var slide = parseIntNan(Seed.allianceHQ.hq_xcoord) - auradistance;
		if (slide < 0) { slide += 750; }
		for (var x = 0; x <= (auradistance * 2); x++) {
			var checkx = slide + x;
			if (checkx >= 750) { checkx -= 750; }
			for (var y = 0; y < auradistance; y++) {
				var checky = base - y;
				if (checky < 0) { checky += 750; }
				if (distance(checkx, checky, Seed.allianceHQ.hq_xcoord, Seed.allianceHQ.hq_ycoord) <= auradistance) {
					Aura.push({ X: checkx, Y: checky });
					break;
				}
			}
		}
		// plot
		for (var j = 0; j < Aura.length; j++) {
			var x = parseInt(Aura[j]['X']);
			var y = parseInt(Aura[j]['Y']);
			var xplot = parseInt((provMapCoords.mapWidth * x) / 750);
			var yplot = parseInt((provMapCoords.mapHeight * y) / 750);
			var ce = document.createElement('div');
			ce.style.background = 'cyan';
			ce.style.opacity = '1.0';
			ce.style.position = 'relative';
			ce.style.display = 'block';
			ce.style.width = '1px';
			ce.style.height = '1px';
			ce.style.top = (yplot + provMapCoords.topMargin - (j + 3) - (4 * Data.length) - ((Seed.cities.length) * 18)) + 'px';
			ce.style.left = (xplot + provMapCoords.leftMargin - 2) + 'px';
			ce.title = 'HQ Aura';
			eMap.appendChild(ce);
		}
	}
}
