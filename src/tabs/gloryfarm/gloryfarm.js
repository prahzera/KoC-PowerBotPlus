/** GloryFarm Tab **/

Tabs.GloryFarm = {
	tabOrder: 1025,
	tabLabel: 'GloryFarm',
	myDiv: null,
	MapAjax: new CMapAjax(),
	searchRunning: false,
	statusCheckRunning: false,
	blocksTotal: 0,
	blocksSearched: 0,
	BlockList: [],
	mapDat: [],
	dat: [],
	opt: {},
	SearchTimer: null,
	DefendTimer: null,
	DefendFailsafe: null,
	myUid: 0,
	myCityCoords: {},
	ModelCity: null,
	ModelCityId: 0,

	init: function (div) {
		var t = Tabs.GloryFarm;
		t.myDiv = div;

		uWExportFunction('gloryfarmquickmarch', Tabs.GloryFarm.quickMarch);

		var m = '<DIV class=divHeader align="center">' + tx('Glory Farm Search') + '</div>';
		m += '<div class="description" style="margin: 6px 8px; padding: 8px 12px; border: 1px solid #997040; background: rgba(50, 35, 20, 0.45); border-radius: 4px; font-size: 11px; line-height: 15px; color: #dfdfdf;">';
		m += '<strong>' + tx('Target Finder Description') + '</strong><br/>';
		m += '<span style="display:inline-block; margin-top: 4px;">• <strong>' + tx('Center City') + '</strong>: ' + tx('Center City Description') + '</span><br/>';
		m += '• <strong>' + tx('Radius') + '</strong>: ' + tx('Radius Description') + '<br/>';
		m += '• <strong>' + tx('Actions') + '</strong>: ' + tx('Actions Description');
		m += '</div>';
		m += '<TABLE width=100% class=xtab>';
		m += '<TR><TD align=right width=20%>' + tx('Center City') + ':&nbsp;</td><TD><SPAN id=pbGloryCitySpan></span></td></TR>';
		m += '<TR><TD align=right width=20%>' + tx('Radius') + ':&nbsp;</td><TD><INPUT id=pbGloryRadius size=3 value=10 />';
		m += '&nbsp;&nbsp;<SPAN id=pbGloryXSpan>X: <INPUT id=pbGloryX type=text size=3 /> &nbsp;Y: <INPUT id=pbGloryY type=text size=3 /></SPAN></td>';
		m += '<td align=left width=30%><a id=pbGlorySubmit class="inlineButton btButton blue20"><span>' + tx('Start Search') + '</span></a></td></tr>';
		m += '</table>';
		m += '<DIV id=pbGloryResults style="height:400px; overflow-y:auto;"></div>';

		div.innerHTML = m;

		t.ModelCity = new CdispCityPicker('pbGloryCity', ById('pbGloryCitySpan'), true, t.citySelNotify, null);
		t.ModelCity.bindToXYboxes(ById('pbGloryX'), ById('pbGloryY'));

		ById('pbGlorySubmit').addEventListener('click', t.clickedSearch, false);
	},

	citySelNotify: function (city, x, y) {
		var t = Tabs.GloryFarm;
		if (city) {
			t.ModelCityId = city.id;
		}
	},

	clickedSearch: function () {
		var t = Tabs.GloryFarm;
		if (t.searchRunning || t.statusCheckRunning) {
			t.stopSearch(tx('Search Cancelled!'));
			return;
		}

		t.opt.radius = parseInt(ById('pbGloryRadius').value);
		if (isNaN(t.opt.radius) || t.opt.radius < 1) {
			ById('pbGloryResults').innerHTML = '<center><FONT COLOR=#800>' + tx('ERROR') + ':</font><BR><BR>' + tx('Radius must be greater than or equal to 1') + '</center>';
			return;
		}

		var startX = parseInt(ById('pbGloryX').value);
		var startY = parseInt(ById('pbGloryY').value);
		if (isNaN(startX) || isNaN(startY)) {
			ById('pbGloryResults').innerHTML = '<center><FONT COLOR=#800>' + tx('ERROR') + ':</font><BR><BR>Selected city coordinates are invalid</center>';
			return;
		}
		t.opt.startX = startX;
		t.opt.startY = startY;

		t.searchRunning = true;
		ById('pbGlorySubmit').innerHTML = '<span>' + tx('Stop Search') + '</span>';
		ById('pbGloryResults').innerHTML = '<center>' + tx('Searching map...') + '</center>';

		t.mapDat = [];
		t.dat = [];

		// Exclude our own cities: build a set of coordinates for all our cities
		t.myUid = uW.tvuid;
		t.myCityCoords = {};
		for (var cid in Cities.byID) {
			var myc = Cities.byID[cid];
			if (myc) { t.myCityCoords[myc.x + ',' + myc.y] = true; }
		}

		console.log("GloryFarm: Starting search at center X=" + t.opt.startX + ", Y=" + t.opt.startY + " with radius=" + t.opt.radius);

		t.BlockList = t.MapAjax.generateBlockList(t.opt.startX - t.opt.radius, t.opt.startY - t.opt.radius, t.opt.radius);
		console.log("GloryFarm: Generated BlockList to query (" + t.BlockList.length + " blocks):", t.BlockList);

		// Sort the BlockList by distance from center city so we search starting from closest
		t.BlockList.sort(function (a, b) {
			var partsA = a.split('_');
			var ax = parseInt(partsA[1]);
			var ay = parseInt(partsA[3]);
			var partsB = b.split('_');
			var bx = parseInt(partsB[1]);
			var by = parseInt(partsB[3]);
			var distA = distance(t.opt.startX, t.opt.startY, ax + 2, ay + 2);
			var distB = distance(t.opt.startX, t.opt.startY, bx + 2, by + 2);
			return distA - distB;
		});

		t.blocksTotal = t.BlockList.length;
		t.blocksSearched = 0;

		t.doSearch();
	},

	doSearch: function () {
		var t = Tabs.GloryFarm;
		if (!t.searchRunning) return;

		if (t.blocksSearched >= t.blocksTotal) {
			console.log("GloryFarm: All blocks searched. Total = " + t.blocksSearched);
			t.finishSearch();
			return;
		}

		var blockString = '';
		var blocksToSearch = Math.min(MAX_BLOCKS, t.blocksTotal - t.blocksSearched);
		for (var i = 0; i < blocksToSearch; i++) {
			blockString += t.BlockList[t.blocksSearched + i] + '%2C';
		}
		blockString = blockString.substring(0, blockString.length - 3);

		console.log("GloryFarm: Querying map blocks: " + blockString + " (Progress: " + t.blocksSearched + "/" + t.blocksTotal + ")");

		ById('pbGloryResults').innerHTML = '<center>' + tx('Searching map...') + ' ' + Math.floor((t.blocksSearched / t.blocksTotal) * 100) + '%</center>';

		t.MapAjax.LookupMap(blockString, function (rslt) { t.eventGetMap(rslt, blocksToSearch); });
	},

	eventGetMap: function (rslt, blocksSearched) {
		var t = Tabs.GloryFarm;
		if (!t.searchRunning) return;

		if (!rslt.ok) {
			console.log("GloryFarm: Map lookup failed/returned ok=false. Retrying block string.");
			t.SearchTimer = setTimeout(function () { t.doSearch(); }, MAP_DELAY);
			return;
		}

		t.blocksSearched += blocksSearched;

		var map = rslt.data;
		var userInfo = rslt.userInfo;
		var alliance = rslt.allianceNames;

		var tileCount = 0;
		if (map) {
			for (var dummy in map) { tileCount++; }
		}
		console.log("GloryFarm: Map AJAX response received. Total tiles: " + tileCount);

		if (map) {
			for (var k in map) {
				if (!map.hasOwnProperty(k)) continue;
				var tile = map[k];
				var u = tile.tileUserId || 0;
				if (u != 0) {
					console.log("GloryFarm: Evaluated tile at (" + tile.xCoord + "," + tile.yCoord + ") - User ID: " + u + ", Type: " + tile.tileType + ", City Name: '" + tile.cityName + "'");
					if (u != t.myUid && !t.myCityCoords[tile.xCoord + ',' + tile.yCoord]) {
						if (tile.tileType == 51 || tile.tileType == 53) {
							var dist = distance(t.opt.startX, t.opt.startY, tile.xCoord, tile.yCoord);
							console.log("  -> City type matched (51/53). Distance to center: " + dist);
							if (dist <= t.opt.radius) {
								// Avoid duplicates
								var isDup = false;
								for (var d = 0; d < t.mapDat.length; d++) {
									if (t.mapDat[d].x == tile.xCoord && t.mapDat[d].y == tile.yCoord) {
										isDup = true;
										break;
									}
								}
								if (!isDup) {
									var name = tile.cityName || '';
									var player = '???';
									var might = 0;
									var alli = '---';
									var aID = 0;
									if (userInfo && userInfo['u' + u]) {
										player = userInfo['u' + u].n;
										might = parseIntNan(userInfo['u' + u].m);
										if (alliance && alliance['a' + userInfo['u' + u].a]) {
											alli = alliance['a' + userInfo['u' + u].a];
											aID = userInfo['u' + u].a;
										}
									}

									console.log("  -> ADDING to results list. Name: '" + name + "', Player: '" + player + "', Might: " + might);

									t.mapDat.push({
										x: tile.xCoord,
										y: tile.yCoord,
										dist: dist,
										name: name,
										player: player,
										uid: u,
										alliance: alli,
										allianceId: aID,
										might: might,
										defendStatus: 'Checking...',
										checked: false
									});
								} else {
									console.log("  -> Duplicate tile coordinates, skipping.");
								}
							} else {
								console.log("  -> Excluded: Distance " + dist + " is greater than radius " + t.opt.radius);
							}
						} else {
							console.log("  -> Excluded: Tile type " + tile.tileType + " is not 51 or 53 (City/Misted City)");
						}
					} else {
						console.log("  -> Excluded: Own city or own user ID (Self)");
					}
				}
			}
		}

		t.SearchTimer = setTimeout(function () { t.doSearch(); }, MAP_DELAY);
	},

	finishSearch: function () {
		var t = Tabs.GloryFarm;
		t.searchRunning = false;
		t.statusCheckRunning = true;
		ById('pbGlorySubmit').innerHTML = '<span>' + tx('Start Search') + '</span>';

		t.mapDat.sort(function (a, b) { return a.dist - b.dist; });

		t.renderResults();
		t.checkNextDefendStatus();
	},

	renderResults: function () {
		var t = Tabs.GloryFarm;
		var m = '<table width=100% cellpadding=0 cellspacing=0 class=xtab><tr>';
		m += '<td class=xtabHD><b>' + tx('Co-ords') + '</b></td>';
		m += '<td class=xtabHD><b>' + tx('Dist') + '</b></td>';
		m += '<td class=xtabHD><b>' + tx('Player') + '</b></td>';
		m += '<td class=xtabHD><b>' + tx('Alliance') + '</b></td>';
		m += '<td class=xtabHD align=right><b>' + tx('Might') + '</b></td>';
		m += '<td class=xtabHD align=center><b>' + tx('Status') + '</b></td>';
		m += '<td class=xtabHD align=center><b>' + tx('Action') + '</b></td>';
		m += '</tr>';

		for (var i = 0; i < t.mapDat.length; i++) {
			var city = t.mapDat[i];
			var rowClass = (i % 2) ? 'evenRow' : 'oddRow';
			var rowStyle = '';
			var badgeHtml = '';

			if (city.defendStatus === 'DEFENDING' || city.defendStatus.indexOf('DEFENDING') >= 0) {
				rowClass += ' highRow';
				rowStyle = 'background-color: rgba(39, 174, 96, 0.15); font-weight: 600;';
				badgeHtml = '<span style="background-color: #27ae60; color: #fff; padding: 2px 8px; border-radius: 10px; font-weight: bold; font-size: 10px; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.15); text-transform: uppercase;">' + tx('DEFENDING') + '</span>';
			} else if (city.defendStatus === 'Hiding' || city.defendStatus.indexOf('Hiding') >= 0) {
				badgeHtml = '<span style="background-color: #7f8c8d; color: #fff; padding: 2px 8px; border-radius: 10px; font-weight: bold; font-size: 10px; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.15); text-transform: uppercase;">' + tx('Hiding') + '</span>';
			} else {
				badgeHtml = '<span style="background-color: #f39c12; color: #fff; padding: 2px 8px; border-radius: 10px; font-weight: bold; font-size: 10px; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.15); text-transform: uppercase;">' + tx('Checking...') + '</span>';
			}

			m += '<tr id="glory_row_' + i + '" class="' + rowClass + '" style="' + rowStyle + '">';
			m += '<td class=xtab><a class=xlink onclick="btGotoMap(' + city.x + ',' + city.y + ')">' + city.x + ',' + city.y + '</a></td>';
			m += '<td class=xtab>' + city.dist.toFixed(1) + '</td>';
			m += '<td class=xtab>' + city.player + '</td>';
			m += '<td class=xtab>' + city.alliance + '</td>';
			m += '<td class=xtab align=right>' + addCommas(city.might) + '</td>';
			m += '<td class=xtab align=center id="glory_status_' + i + '">' + badgeHtml + '</td>';
			m += '<td class=xtab align=center>';
			m += '<a class="inlineButton btButton blue14" onclick="quickscoutsearch(' + city.x + ',' + city.y + ',' + t.ModelCityId + ');return false;"><span>' + tx('Scout') + '</span></a>&nbsp;';
			m += '<a class="inlineButton btButton red14" onclick="gloryfarmquickmarch(' + city.x + ',' + city.y + ');return false;"><span>' + tx('March+') + '</span></a>';
			m += '</td></tr>';
		}
		m += '</table>';
		ById('pbGloryResults').innerHTML = m;
	},

	checkNextDefendStatus: function () {
		var t = Tabs.GloryFarm;
		if (!t.statusCheckRunning) return;

		var nextIdx = -1;
		for (var i = 0; i < t.mapDat.length; i++) {
			if (!t.mapDat[i].checked) {
				nextIdx = i;
				break;
			}
		}

		if (nextIdx == -1) {
			t.statusCheckRunning = false;
			return; // All checked
		}

		var city = t.mapDat[nextIdx];

		// Failsafe: if the AJAX call never responds, mark as Hiding and move on after 15s
		t.DefendFailsafe = setTimeout(function () {
			if (city.checked) return;
			city.checked = true;
			city.defendStatus = 'Hiding';
			t.renderResults();
			t.DefendTimer = setTimeout(function () { t.checkNextDefendStatus(); }, 1250);
		}, 15000);

		getDefendStatus(city.x, city.y, null, true, function (rslt) {
			clearTimeout(t.DefendFailsafe);
			if (!t.statusCheckRunning) return;
			city.checked = true;

			if (rslt.ok && rslt.ok == "true") {
				city.defendStatus = 'DEFENDING';
			} else {
				city.defendStatus = 'Hiding';
			}
			t.renderResults();

			t.DefendTimer = setTimeout(function () { t.checkNextDefendStatus(); }, 1250); // Delay to avoid spamming
		}, nextIdx, t.mapDat.length, null);
	},

	stopSearch: function (msg) {
		var t = Tabs.GloryFarm;
		t.searchRunning = false;
		t.statusCheckRunning = false;
		clearTimeout(t.SearchTimer);
		clearTimeout(t.DefendTimer);
		clearTimeout(t.DefendFailsafe);
		ById('pbGlorySubmit').innerHTML = '<span>' + tx('Start Search') + '</span>';
		if (msg) ById('pbGloryResults').innerHTML = '<center>' + msg + '</center>';
	},

	quickMarch: function (x, y) {
		var cityId = uW.currentcityid;
		QuickMarch.MapClick(x, y, Cities.byID[cityId].idx);
	},

	hide: function () { },
	show: function (init) {
		var t = Tabs.GloryFarm;
		var DispCityId = uW.currentcityid;
		if (init) { DispCityId = InitialCityId; }
		if (t.ModelCityId != DispCityId && Cities.byID[DispCityId]) {
			t.ModelCity.selectBut(Cities.byID[DispCityId].idx);
		}
	}
};
